import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadBufferToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOC_TYPES = ['application/pdf'];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB max

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';
    const altText = (formData.get('altText') as string) || '';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tệp tải lên từ thiết bị.' },
        { status: 400 }
      );
    }

    // Validate MIME types
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isPdf = ALLOWED_DOC_TYPES.includes(file.type) || file.name.toLowerCase().endsWith('.pdf');

    if (!isImage && !isPdf) {
      return NextResponse.json(
        {
          success: false,
          error: 'Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh (JPEG, PNG, WebP) hoặc tài liệu PDF.',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'Dung lượng tệp vượt quá giới hạn tối đa 15MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let secureUrl: string;
    let finalFormat = isPdf ? 'pdf' : 'webp';
    let finalSize = file.size;

    if (isCloudinaryConfigured()) {
      // Production Serverless Upload to Cloudinary CDN with on-the-fly WebP optimization
      const uploadResult = await uploadBufferToCloudinary(buffer, {
        folder: `geopro/${folder}`,
        isPdf,
      });

      secureUrl = uploadResult.secure_url;
      finalFormat = uploadResult.format || finalFormat;
      finalSize = uploadResult.bytes || finalSize;
    } else {
      // Local Development Fallback when Cloudinary environment keys have not been configured yet
      const base64Data = buffer.toString('base64');
      const mime = isPdf ? 'application/pdf' : file.type || 'image/jpeg';
      secureUrl = `data:${mime};base64,${base64Data}`;
      console.warn(
        '[CLOUD UPLOAD] Notice: Cloudinary API keys not detected in .env. Running in dev fallback mode. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to enable direct Cloudinary CDN uploads.'
      );
    }

    // Persist media metadata into database for media management
    let savedMedia = null;
    try {
      savedMedia = await prisma.media.create({
        data: {
          filename: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
          originalName: file.name,
          url: secureUrl,
          mimeType: isPdf ? 'application/pdf' : `image/${finalFormat}`,
          size: finalSize,
          folder,
          altText: altText || file.name,
        },
      });
    } catch (dbError) {
      console.warn('Could not save media record to database:', dbError);
    }

    return NextResponse.json({
      success: true,
      url: secureUrl,
      originalName: file.name,
      size: finalSize,
      mimeType: isPdf ? 'application/pdf' : `image/${finalFormat}`,
      media: savedMedia,
      cloudProvider: isCloudinaryConfigured() ? 'cloudinary' : 'dev-local',
    });
  } catch (error: any) {
    console.error('Error handling cloud upload:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Xảy ra lỗi trong quá trình tải lên đám mây.' },
      { status: 500 }
    );
  }
}

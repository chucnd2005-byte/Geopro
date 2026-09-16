import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadBufferToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'products';
    const altText = (formData.get('altText') as string) || '';

    if (!file) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy file tải lên.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    let publicUrl: string;
    let finalSize = file.size;
    let finalMime = file.type || (isPdf ? 'application/pdf' : 'image/webp');

    if (isCloudinaryConfigured()) {
      const uploadResult = await uploadBufferToCloudinary(buffer, {
        folder: `geopro/${folder}`,
        isPdf,
      });
      publicUrl = uploadResult.secure_url;
      finalSize = uploadResult.bytes || file.size;
      finalMime = isPdf ? 'application/pdf' : `image/${uploadResult.format || 'webp'}`;
    } else {
      // Dev local fallback
      const base64Data = buffer.toString('base64');
      const mime = isPdf ? 'application/pdf' : file.type || 'image/jpeg';
      publicUrl = `data:${mime};base64,${base64Data}`;
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const uniqueFilename = `${Date.now()}-${cleanName}`;

    // Save record to DB
    const media = await prisma.media.create({
      data: {
        filename: uniqueFilename,
        originalName: file.name,
        url: publicUrl,
        mimeType: finalMime,
        size: finalSize,
        folder,
        altText: altText || file.name,
      },
    });

    return NextResponse.json({ success: true, media, url: publicUrl });
  } catch (error: any) {
    console.error('Error in upload API:', error);
    return NextResponse.json({ success: false, error: 'Tải file lên thất bại: ' + error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');

    const whereClause: any = {};
    if (folder && folder !== 'all') {
      whereClause.folder = folder;
    }

    const medias = await prisma.media.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, medias });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Không thể lấy danh sách media.' }, { status: 500 });
  }
}

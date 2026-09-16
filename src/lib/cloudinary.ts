import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const isCloudinaryConfigured = (): boolean => {
  return !!(
    (process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

export interface CloudinaryUploadOptions {
  folder?: string;
  isPdf?: boolean;
  publicId?: string;
}

/**
 * Uploads a file buffer directly to Cloudinary without writing to the serverless local disk.
 * Automatically optimizes images to WebP format, limits max dimensions to 1600px,
 * and sets quality to auto:good to ensure < 500KB output for optimal Core Web Vitals.
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: CloudinaryUploadOptions = {}
): Promise<UploadApiResponse> {
  const { folder = 'geopro/products', isPdf = false, publicId } = options;

  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, any> = {
      folder,
      resource_type: isPdf ? 'raw' : 'image',
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    // Apply WebP conversion, auto compression, and max-dimension limits for image files
    if (!isPdf) {
      uploadOptions.transformation = [
        { width: 1600, height: 1600, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'webp' },
      ];
      uploadOptions.format = 'webp';
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload to Cloudinary failed without result'));
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

export default cloudinary;

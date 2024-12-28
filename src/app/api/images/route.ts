import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

// Constants
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
const COMPRESSION_QUALITY = 80; // 0-100, higher means better quality but larger file size

// Helper function to generate a unique filename
function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const hash = crypto.randomBytes(8).toString('hex');
  return `${hash}${ext}`;
}

// Helper function to validate and process image
async function processImage(file: File): Promise<{ buffer: Buffer; format: string }> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
  }

  // Get file buffer
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Process image with sharp
  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  // Determine output format (preserve original format or convert to WebP)
  const format = metadata.format === 'webp' ? 'webp' : 'jpeg';
  
  // Compress and resize if necessary
  const processedBuffer = await image
    .resize(2000, 2000, { // Max dimensions
      fit: 'inside',
      withoutEnlargement: true
    })
    [format]({
      quality: COMPRESSION_QUALITY,
      mozjpeg: true, // Use mozjpeg for better compression if jpeg
    })
    .toBuffer();

  return { buffer: processedBuffer, format };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? '' },
    });

    if (!user?.email || user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const tourId = formData.get('tourId') as string;
    const files = formData.getAll('files') as File[];

    if (!tourId || !files.length) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if tour exists
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      return NextResponse.json(
        { message: 'Tour not found' },
        { status: 404 }
      );
    }

    // Process and save each file
    const images = await Promise.all(
      files.map(async (file) => {
        try {
          // Process image
          const { buffer, format } = await processImage(file);
          
          // Generate filename with correct extension
          const uniqueFilename = generateUniqueFilename(file.name.replace(/\.[^/.]+$/, `.${format}`));
          const relativePath = `/uploads/tours/${uniqueFilename}`;
          const fullPath = path.join(process.cwd(), 'public', relativePath);

          // Save processed file to disk
          await writeFile(fullPath, buffer);

          // Create database record
          return prisma.image.create({
            data: {
              tourId,
              url: relativePath,
              alt: file.name,
            },
          });
        } catch (error) {
          console.error(`Error processing image ${file.name}:`, error);
          throw new Error(`Failed to process image ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      })
    );

    return NextResponse.json(images, { status: 201 });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tourId = searchParams.get('tourId');

    const where = tourId ? { tourId } : undefined;

    const images = await prisma.image.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Get images error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? '' },
    });

    if (!user?.email || user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json(
        { message: 'Missing image ID' },
        { status: 400 }
      );
    }

    // Get image record
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json(
        { message: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete file from disk
    try {
      const fullPath = path.join(process.cwd(), 'public', image.url);
      await unlink(fullPath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    // Delete database record
    await prisma.image.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 
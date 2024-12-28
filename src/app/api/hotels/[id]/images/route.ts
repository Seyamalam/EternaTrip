import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const COMPRESSION_QUALITY = 80;

async function processImage(file: Buffer): Promise<{ buffer: Buffer; format: string }> {
  const metadata = await sharp(file).metadata();
  const format = metadata.format || 'jpeg';

  const processedBuffer = await sharp(file)
    .resize(1200, 800, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toFormat(format, { quality: COMPRESSION_QUALITY })
    .toBuffer();

  return { buffer: processedBuffer, format };
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user and check if admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if hotel exists
    const hotel = await prisma.hotel.findUnique({
      where: { id: params.id },
    });

    if (!hotel) {
      return NextResponse.json(
        { message: 'Hotel not found' },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: 'No files uploaded' },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    for (const file of files) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { message: `File ${file.name} exceeds maximum size of 3MB` },
          { status: 400 }
        );
      }

      // Process image
      const buffer = Buffer.from(await file.arrayBuffer());
      const { buffer: processedBuffer, format } = await processImage(buffer);

      // Generate unique filename
      const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${format}`;
      const relativePath = `/uploads/hotels/${uniqueFilename}`;
      const absolutePath = join(process.cwd(), 'public', relativePath);

      // Save file
      await writeFile(absolutePath, processedBuffer);

      // Create image record
      const image = await prisma.hotelImage.create({
        data: {
          url: relativePath,
          alt: file.name,
          hotel: {
            connect: { id: params.id },
          },
        },
      });

      uploadedImages.push(image);
    }

    return NextResponse.json(uploadedImages);
  } catch (error) {
    console.error('Error uploading hotel images:', error);
    return NextResponse.json(
      { message: 'Failed to upload images' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user and check if admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json(
        { message: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Delete image record
    await prisma.hotelImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting hotel image:', error);
    return NextResponse.json(
      { message: 'Failed to delete image' },
      { status: 500 }
    );
  }
} 
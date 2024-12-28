import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    // Here you would typically:
    // 1. Save the message to your database
    // 2. Send an email notification
    // 3. Set up an auto-responder
    // For now, we'll just simulate a successful submission

    // Example: Send email using your preferred email service
    // await sendEmail({
    //   to: 'support@example.com',
    //   subject: `New Contact Form Submission: ${validatedData.subject}`,
    //   text: `
    //     Name: ${validatedData.name}
    //     Email: ${validatedData.email}
    //     Subject: ${validatedData.subject}
    //     Message: ${validatedData.message}
    //   `,
    // });

    // Example: Send auto-response
    // await sendEmail({
    //   to: validatedData.email,
    //   subject: 'Thank you for contacting us',
    //   text: `
    //     Dear ${validatedData.name},
    //     Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.
    //     Best regards,
    //     Your Support Team
    //   `,
    // });

    return NextResponse.json({
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Invalid form data',
          errors: error.errors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to send message' },
      { status: 500 }
    );
  }
} 
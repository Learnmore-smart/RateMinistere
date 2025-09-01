import nodemailer from 'nodemailer';

export async function POST(request) {
  const { name, email, message } = await request.json();

  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_SERVER,
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_KEY
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });

  try {
    await transporter.sendMail({
      from: `"RateMinistère Contact" <rateministere@gmail.com>`,
      to: 'rateministere@gmail.com',
      replyTo: email,
      subject: `New message from ${name}`,
      text: message,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Brevo SMTP error:', error);
    return Response.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
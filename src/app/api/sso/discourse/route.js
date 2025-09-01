import { getServerSession } from 'next-auth/next';
import { options as authOptions } from '../../auth/[...nextauth]/options';
import { encode } from 'js-base64'; // Import base64 encoding library

export async function GET(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Generate SSO payload for Discourse
  const payload = {
    // Include necessary user information
    external_id: session.user.id,
    email: session.user.email,
    id: session.user.id,
    username: session.user.name,
    // Add any other required fields
  };

  // Serialize payload using JSON.stringify
  const serializedPayload = JSON.stringify(payload);

  // Sign the payload using a secret key (replace with your actual secret)
  const secretKey = process.env.sso; // Replace with your secret key
  const signature = encode(
    Buffer.from(secretKey).toString('base64') + '.' +
    encode(serializedPayload)
  );

  // Construct the Discourse SSO URL
  const redirectUrl = `${process.env.discourseSsoUrl}${signature}`;

  // Redirect to Discourse SSO URL
  return res.redirect(redirectUrl);
}
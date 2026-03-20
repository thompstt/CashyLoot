import "server-only";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { env } from "@/env";

const ses = new SESClient({ region: env.AWS_SES_REGION });

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

export async function sendVerificationEmail(to: string, name: string | undefined, verificationUrl: string) {
  const displayName = escapeHtml(name || "there");

  const command = new SendEmailCommand({
    Source: env.AWS_SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: "Verify your CashyLoot account",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #8b5cf6;">Welcome to CashyLoot, ${displayName}!</h2>
              <p>Click the button below to verify your email address and activate your account.</p>
              <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #22d3ee); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
                Verify Email
              </a>
              <p style="color: #666; font-size: 14px;">Or copy this link: ${escapeHtml(verificationUrl)}</p>
              <p style="color: #999; font-size: 12px; margin-top: 32px;">
                If you didn't create an account on CashyLoot, you can ignore this email.
              </p>
            </div>
          `,
          Charset: "UTF-8",
        },
        Text: {
          Data: `Welcome to CashyLoot, ${name || "there"}!\n\nVerify your email by visiting: ${verificationUrl}\n\nIf you didn't create an account, ignore this email.`,
          Charset: "UTF-8",
        },
      },
    },
  });

  await ses.send(command);
}

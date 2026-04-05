import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || "Stalling aan de Dijk <noreply@stallingaandedijk.nl>";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.log(`[EMAIL] Geen RESEND_API_KEY geconfigureerd. E-mail niet verzonden.`);
    console.log(`[EMAIL] Aan: ${to}`);
    console.log(`[EMAIL] Onderwerp: ${subject}`);
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}

export function approvalEmailHtml(params: {
  name: string;
  loginUrl: string;
  vehiclePlate: string;
  contractTotal: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #111;">Welkom bij Stalling aan de Dijk!</h1>
      <p>Beste ${params.name},</p>
      <p>Goed nieuws! Uw aanmelding is goedgekeurd. U kunt nu gebruik maken van onze stalling.</p>

      <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Uw stallingscontract</h3>
        <p><strong>Voertuig:</strong> ${params.vehiclePlate}</p>
        <p><strong>Jaarbedrag:</strong> € ${params.contractTotal}</p>
        <p><strong>Looptijd:</strong> 12 maanden (automatische verlenging)</p>
      </div>

      <p>U kunt nu inloggen op het klantportaal met uw e-mailadres en wachtwoord:</p>
      <p><a href="${params.loginUrl}" style="display: inline-block; background: #111; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Inloggen</a></p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #666; font-size: 14px;">
        Stalling aan de Dijk<br/>
        Gageldijk 204, 3566 MJ Utrecht<br/>
        Tel: 06 51 60 54 67<br/>
        Email: stallingaandedijk@gmail.com
      </p>
    </div>
  `;
}

type SendMailInput = {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  text?: string;
  html?: string;
};

export async function sendMail({ to, cc, bcc, subject, text, html }: SendMailInput): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "0");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!host || !port || !user || !pass || !from) {
    return false;
  }

  if (!to || to.length === 0) {
    return false;
  }

  try {
    const nodemailer = await import("nodemailer");
    const options = {
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    };
    const transporter = nodemailer.createTransport(options);
    await transporter.sendMail({
      from,
      to: Array.from(new Set(to)).join(","),
      cc: cc ? Array.from(new Set(cc)).join(",") : undefined,
      bcc: bcc ? Array.from(new Set(bcc)).join(",") : undefined,
      subject,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error("SMTP Error:", error);
    return false;
  }
}

import nodemailer from "nodemailer";

type MailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !portRaw || !user || !pass || !from) {
    throw new Error("SMTP config is incomplete");
  }

  const port = Number(portRaw);
  const normalizedPass = pass.replace(/\s+/g, "");

  if (Number.isNaN(port)) {
    throw new Error("SMTP_PORT must be a valid number");
  }

  return {
    host,
    port,
    user,
    pass: normalizedPass,
    from,
    secure: process.env.SMTP_SECURE === "1",
  };
}

export async function sendMail(input: MailInput): Promise<void> {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  const config = getSmtpConfig();

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: config.from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}

export async function sendRecoveryEmail(params: {
  to: string;
  resetLink: string;
  otpCode: string;
}): Promise<void> {
  const subject = "JUMPFIRST password recovery";
  const text = [
    "We received a password recovery request.",
    `Reset link: ${params.resetLink}`,
    `OTP code: ${params.otpCode}`,
    "If this was not you, ignore this message.",
  ].join("\n");

  const html = [
    "<p>We received a password recovery request.</p>",
    `<p><a href=\"${params.resetLink}\">Reset your password</a></p>`,
    `<p>OTP code: <strong>${params.otpCode}</strong></p>`,
    "<p>If this was not you, ignore this message.</p>",
  ].join("");

  await sendMail({
    to: params.to,
    subject,
    text,
    html,
  });
}

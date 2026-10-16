import nodemailer from 'nodemailer';

export function createOtpMailer(config, createTransport = nodemailer.createTransport) {
  const transport = createTransport({
    host: config.host, port: config.port,
    secure: config.port === 465,
    requireTLS: true,
    auth: { user: config.user, pass: config.pass },
    tls: { rejectUnauthorized: true, minVersion: 'TLSv1.2' },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
    logger: false, debug: false,
  });
  return {
    // Connection verification is explicit: never invoked during readiness/health.
    verify: () => transport.verify(),
    async send({ email, otp, type }) {
      if (!['sign-in', 'email-verification', 'forget-password'].includes(type) || typeof email !== 'string' || /[\r\n]/.test(email) || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email) || !/^\d{6}$/.test(otp)) throw new Error('INVALID_MAIL_REQUEST');
      try {
        await transport.sendMail({
          from: config.from, to: email,
          subject: 'Seu código do Trelelê',
          text: `Seu código do Trelelê é ${otp}. Ele expira em 5 minutos. Vale o código que você acabou de pedir. Se não foi você, ignore esta mensagem.`,
          disableFileAccess: true, disableUrlAccess: true,
        });
      } catch { throw new Error('EMAIL_DELIVERY_FAILED'); }
    },
    close: () => transport.close(),
  };
}

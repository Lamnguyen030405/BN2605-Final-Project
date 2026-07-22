import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const sendRegistrationOtp = async (toEmail, otpCode) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME || 'Support Team'}" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Xác thực tài khoản Travel Booking',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333;">Chào mừng bạn đến với Travel Booking!</h2>
        <p style="color: #555;">
          Sử dụng mã OTP dưới đây để xác thực tài khoản của bạn. Mã này có hiệu lực
          trong <strong>15 phút</strong>.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <span
            style="
              display: inline-block;
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 12px;
              color: #1a73e8;
              background: #f0f4ff;
              padding: 16px 32px;
              border-radius: 8px;
            "
          >
            ${otpCode}
          </span>
        </div>
        <p style="color: #888; font-size: 13px;">
          Nếu bạn không thực hiện đăng ký tài khoản, vui lòng bỏ qua email này.
        </p>
      </div>
    `,
  });
};
export default { sendRegistrationOtp };

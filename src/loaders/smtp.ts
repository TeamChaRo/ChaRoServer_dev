import nodemailer from 'nodemailer';
import config from '../config/config';

export default nodemailer.createTransport({
  // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
  service: 'gmail',
  // host를 gmail로 설정
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    // 보내는 사람 설정
    user: config.mailerId,
    pass: config.mailerPassword,
  },
});

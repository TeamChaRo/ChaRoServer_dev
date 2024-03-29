import dotenv = require('dotenv');

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  env: process.env.NODE_ENV || 'development',

  // database connection
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,

  // user image
  defaultImage: process.env.DEFAULT_IMAGE,

  /* Google */
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleSecret: process.env.GOOGLE_SECRET,
  googleRedirect: process.env.GOOGLE_REDIRECT,

  /* Kakao */
  kakaoClientId: process.env.KAKAO_CLIENT_ID,
  kakaoSecret: process.env.KAKAO_SECRET,
  kakaoRedirect: process.env.KAKAO_REDIRECT,

  /* login */
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGO,

  /* S3 */
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,

  /* mailer */
  mailerId: process.env.NODEMAILER_USER,
  mailerPassword: process.env.NODEMAILER_PASS,
};

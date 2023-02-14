import jwt from 'jsonwebtoken';
import { User } from '../model/auth.js';
import dotenv from 'dotenv';
dotenv.config();

// 비밀키 env
const secretKey = process.env.SECRETKEY;

// 사용자 인증 미들웨어
export const isAuth = async (req, res, next) => {
  const { Authorization } = req.cookies;
  // authorization 쿠키가 존재하지 않았을 때를 대비
  const [authType, authToken] = (Authorization ?? '').split(' ');

  // 1. authType === Bearer 값인지 확인하기
  // 2. authToken 존재 유무 검증하기
  if (authType !== 'Bearer' || !authToken) {
    res.status(400).json({
      errorMessage: '로그인 후에 이용할 수 있는 기능입니다.',
    });
    return;
  }

  try {
    // 1. authToken이 만료되었는지 확인
    // 2. authToken이 서버가 발급한 토큰이 맞는지 확인
    const check = jwt.verify(authToken, secretKey);
    if (!check) {
      return res
        .status(403)
        .json({ errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.' });
    }

    // authToken에 있는 userId에 해당하는 사용자가 실제 DB에 존재하는지 확인
    const decodedToken = jwt.decode(authToken);
    const test = await User.findByPk(decodedToken.userId);
    if (test == null) {
      return res
        .status(403)
        .json({ errorMessage: '계정이 존재하지 않습니다.' });
    }
    next();
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ errorMessage: '로그인 후에 이용할 수 있는 기능입니다.' });
    return;
  }
};

import * as userRepository from '../model/auth.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// 회원가입 API
export async function signup(req, res) {
  const { nickname, password, confirm } = req.body;
  // 회원가입 조건
  const rex = /[a-z][A-Z][0-9]/gi;
  const nicknameCheck = rex.test(nickname); // test() 메서드는 주어진 문자열이 정규 표현식을 만족하는지 판별하고, 그 여부를 true 또는 false로 반환한다.
  if (!nicknameCheck) {
    return res
      .status(412)
      .json({ errorMessage: '닉네임의 형식이 일치하지 않습니다.' });
  }
  if (password !== confirm) {
    return res
      .status(412)
      .json({ errorMessage: '패스워드가 일치하지 않습니다.' });
  }
  if (password.search(nickname) > -1) {
    return res
      .status(412)
      .json({ errorMessage: '패스워드에 닉네임이 포함되어 있습니다.' });
  }
  const nicknameOverlap = await userRepository.findByUsername(nickname);
  if (nicknameOverlap !== null) {
    return res.status(412).json({ errorMessage: '중복된 닉네임입니다.' });
  }
  // 닉네임 중복 아니고 비밀번호 확인까지 마쳤으면, 회원가입 시키기.
  await userRepository.createUser({
    nickname,
    password,
  });
  res.status(201).json({ message: '회원 가입에 성공하였습니다.' });
}

// 로그인
export async function login(req, res) {
  const { nickname, password } = req.body;
  const user = await userRepository.findByUsername(nickname);
  if (!user) {
    return res
      .status(412)
      .json({ errorMessage: '닉네임 또는 패스워드를 확인해주세요' });
  }
  const isValidPassword = await user.password.includes(password);
  if (!isValidPassword) {
    return res
      .status(402)
      .json({ errorMessage: '닉네임 또는 패스워드를 확인해주세요.' });
  }

  // 토큰 response
  const crtoken = createJwtToken(user.userId);
  const slicetoken1 = crtoken.slice(0, 10);
  const slicetoken2 = crtoken
    .slice(10, 20)
    .replace(/^[a-z0-9_]{4,20}$/gi, '**********');
  const token = slicetoken1 + slicetoken2;
  res.cookie('Authorization', `Bearer ${crtoken}`);
  res.json({ token: token });
}

// token 생성
const secretKey = process.env.SECRETKEY;
function createJwtToken(userId) {
  return jwt.sign({ userId }, secretKey);
}

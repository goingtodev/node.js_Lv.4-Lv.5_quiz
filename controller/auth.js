import * as userRepository from '../model/auth.js';
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
  if (password.search(nickname) > -1) {
    return res
      .status(412)
      .json({ errorMessage: '패스워드에 닉네임이 포함되어 있습니다.' });
  }
  if (password !== confirm) {
    return res
      .status(412)
      .json({ errorMessage: '패스워드가 일치하지 않습니다.' });
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
  res.status(200).json({ message: '회원가입에 성공하셨습니다.' });
}

// 로그인

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class UsersService {
  constructor(usersRepository, bcrypt, response) {
    this.usersRepository = usersRepository;
    // this.bcrypt = bcrypt; // bcrypt 모듈 주입
    this.response = response;
  }

  //1. 회원가입
  signup = async (email, password, confirmPassword, name) => {
    // 이메일 중복 체크
    try {
      if (!email) {
        throw new Error("email은 필수 입력값입니다.");
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { message: "유효한 이메일 주소를 입력해야 합니다." }; // 예외를 throw하는 대신에 메시지를 반환
      }

      const existUser = await this.usersRepository.findByEmail(email);
      if (existUser) {
        throw new Error("이미 사용하고 있는 이메일입니다.");
      }

      if (!password) {
        throw new Error("password는 필수 입력값입니다.");
      }
      if (!name) {
        throw new Error("name은 필수 입력값입니다.");
      }
      if (!confirmPassword) {
        throw new Error("confirmPassword는 필수 입력값입니다.");
      }

      // 비밀번호 일치 여부 확인
      if (password !== confirmPassword) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }

      // 사용자 생성
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.usersRepository.signup(
        email,
        hashedPassword,
        name
      );

      // 사용자 정보를 가공하여 반환

      const user = {
        userId: newUser.userId,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
      };

      return { message: "회원가입이 완료되었습니다.", user };
    } catch (error) {
      throw error;
    }
  };

  // 2. 로그인
  signin = async (email, password) => {
    if (!email || !password) {
      throw new Error("이메일과 비밀번호를 입력해주세요.");
    }

    // 해당하는 이메일이 존재하는지 찾기
    const user = await this.usersRepository.findByEmail(email);

    // user가 없으면 가입되지 않은 user이므로 에러 발생
    if (!user) {
      throw new Error("가입되지 않은 이메일입니다.");
    }

    // bcrypt를 사용하여 비밀번호 비교
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("잘못된 비밀번호입니다.");
    }

    // password가 맞으면 access token과 refresh token 생성하여 반환
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    const accessToken = jwt.sign({ userId: user.userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: "12h",
    });
    const refreshToken = jwt.sign(
      { userId: user.userId },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  };

  // 3. 로그아웃
  signout = async () => {
    return { message: "로그아웃 되었습니다." };
  };

  // 4. 계정 삭제
  deleteUser = async (userId) => {
    try {
      // 사용자의 계정을 삭제하기 전에 레포지토리를 통해 사용자를 검색합니다.
      const user = await this.usersRepository.findUserById(userId);

      if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }

      // 사용자가 존재하는 경우 계정을 삭제합니다.
      const deletionResult = await this.usersRepository.deleteUserById(userId);

      if (!deletionResult) {
        throw new Error("계정 삭제에 실패했습니다.");
      }

      return { success: true, message: "계정이 성공적으로 삭제되었습니다." };
    } catch (error) {
      // 에러 발생 시 에러를 반환합니다.
      return { success: false, message: error.message };
    }
  };
}

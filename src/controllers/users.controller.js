import { extractUserIdFromToken } from "../utils/tokenUtils.js";

export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  // 회원 가입
  signup = async (req, res, next) => {
    try {
      const { email, password, confirmPassword, name } = req.body;

      const result = await this.usersService.signup(
        email,
        password,
        confirmPassword,
        name
      );

      if (result.error) {
        return res.status(400).json({ message: result.error });
      }

      return res.status(200).json({
        message: "회원가입이 완료되었습니다.",
        data: {
          userId: result.user.userId,
          email: result.user.email,
          name: result.user.name,
        },
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  // 로그인 라우터랑 연결할 컨트롤러 메서드
  signin = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { accessToken, refreshToken } = await this.usersService.signin(
        email,
        password
      );

      //accessToken과 refreshToken을 쿠키에 설정
      res.cookie("authorization", `Bearer ${accessToken}`, {
        httpOnly: true,
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });

      return res.status(200).send({
        message: "로그인 되었습니다",
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  // 로그아웃
  signout = async (req, res, next) => {
    try {
      // 쿠키 제거

      // 클라이언트에게 로그인 상태가 아니라는 메시지 전달
      if (!req.cookies.authorization || !req.cookies.refreshToken) {
        return res.status(401).json({ message: "로그인되어 있지 않습니다." });
      }
      res.clearCookie("authorization", { path: "/", secure: true });
      res.clearCookie("refreshToken", { path: "/", secure: true });

      // 로그아웃 메서드 호출
      const result = await this.usersService.signout();

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // 계정삭제
  deleteUser = async (req, res) => {
    try {
      // 클라이언트에서 전송된 토큰을 요청 헤더에서 추출합니다.
      const token = req.cookies.authorization;

      // 토큰이 없는 경우 에러를 응답합니다.
      if (!token) {
        return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      }

      // 토큰을 검증하여 사용자 식별 정보를 추출합니다.
      const userId = extractUserIdFromToken(token);

      // 해당 계정 삭제를 서비스 레이어로 위임합니다.
      const result = await this.usersService.deleteUser(userId);
      res.clearCookie("authorization", { path: "/", secure: true });
      res.clearCookie("refreshToken", { path: "/", secure: true });

      // 계정 삭제 결과를 클라이언트에 응답합니다.
      res.json(result);
    } catch (error) {
      // 에러 발생 시 클라이언트에 에러 메시지를 응답합니다.
      res.status(500).json({ error: error.message });
    }
  };
}

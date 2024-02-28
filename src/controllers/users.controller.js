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
          userId: user.userId,
          email: user.email,
          name: user.name,
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
      res.cookie("accessToken", accessToken, {
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
      res.clearCookie("accessToken", { path: "/", secure: true });
      res.clearCookie("refreshToken", { path: "/", secure: true });

      // 클라이언트에게 로그인 상태가 아니라는 메시지 전달
      if (!req.cookies.accessToken || !req.cookies.refreshToken) {
        return res.status(401).json({ message: "로그인되어 있지 않습니다." });
      }

      // 로그아웃 메서드 호출
      const result = await this.usersService.signout();

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // 계정삭제
  deleteUser = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const { password } = req.body;

      // 사용자 서비스를 사용하여 사용자 비밀번호 검증 및 삭제 수행
      const result = await this.usersService.deleteUser(userId, password);

      // 삭제가 성공했을 경우
      if (result.success) {
        return res
          .status(200)
          .json({ message: "사용자가 성공적으로 삭제되었습니다." });
      } else {
        // 삭제가 실패했을 경우 (예: 비밀번호가 올바르지 않음)
        return res.status(401).json({ message: result.message });
      }
    } catch (err) {
      next(err);
    }
  };
}

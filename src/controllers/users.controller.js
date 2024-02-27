export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  // 회원 가입
  signup = async (req, res, next) => {
    try {
      const { email, password, confirmPassword, name } = req.body;

      const { user } = await this.usersService.signup(
        email,
        password,
        confirmPassword,
        name
      );

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

      // 쿠키에 accessToken 설정
      res.cookie("accessToken", `Bearer ${accessToken}`);
      console.log(accessToken);

      return res.status(200).send({
        message: "로그인 되었습니다",
        // data: {
        //   accessToken,
        //   refreshToken,
        // },
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  signout = async (req, res, next) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        // 클라이언트에게 로그인 상태가 아니라는 메시지 전달
        return res.status(401).json({ message: "로그인되어 있지 않습니다." });
      }

      const result = await this.usersService.signout();

      // 쿠키에서 accessToken 제거
      res.clearCookie("accessToken", { path: "/", secure: true });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // 회원 탈퇴
  deleteUser = async (req, res, next) => {
    try {
      const { userId } = req.params;

      const deleteUser = await this.usersService.deleteUser(userId);

      return res.status(200).json({ data: deleteUser });
    } catch (err) {
      next(err);
    }
  };
}

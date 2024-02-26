export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  // 회원 가입
  signupUser = async (req, res, next) => {
    try {
      const { email, password, confirmPassword, name } = req.body;

      const user = await this.usersService.signupUser(
        email,
        password,
        confirmPassword,
        name
      );

      return res.status(200).json({
        data: {
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  // 로그인 라우터랑 연결할 컨트롤러 메서드
  signinUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { accessToken, refreshToken } = await signinService.signinUser(
        email,
        password
      );

      // 쿠키에 accessToken 설정
      res.cookie("accessToken", "Bearer ${accessToken}");
      console.log(accessToken);

      return res.status(200).send({
        message: "로그인 api 입니다.",
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  //로그아웃
  signoutUser = async (req, res, next) => {
    try {
      res.clearCookie("authorization", { path: "/", secure: true });
      return res.status(200).json({ message: "로그아웃 되었습니다." });
    } catch (error) {
      next(error);
    }
  };

  // 회원 탈퇴
  deleteUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { password } = req.body;

      const deleteUser = await this.usersService.deleteUser(userId, password);

      return res.status(200).json({ data: deleteUser });
    } catch (error) {
      next(error);
    }
  };
}

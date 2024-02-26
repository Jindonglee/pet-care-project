export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  // 회원 가입
  createUser = async (req, res, next) => {
    try {
      const { email, password, confirmPassword, name } = req.body;

      const user = await this.usersService.createUser(
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

      if (!email) {
        return res.status(400).json({
          message: "email은 필수 입력값입니다.",
        });
      }
      if (!password) {
        return res.status(400).json({
          message: "password는 필수 입력값입니다.",
        });
      }

      // 해당하는 이메일이 존재하는지 찾아보기
      const user = await prisma.users.findFirst({
        where: {
          email,
        },
      });

      // user가 없으면 가입되지 않은 user이므로 error를 발생시킨다.
      if (!user) {
        return res.status(400).json({
          message: "가입되지 않은 이메일입니다.",
        });
      }

      // user가 있으면 password가 맞는지 확인한다.
      // pawwword가 맞지 않으면 올바르지 않은 비밀번호이므로 error를 발생시킨다.
      if (user.password !== password) {
        return res.status(400).json({
          message: "비밀번호가 올바르지 않습니다.",
        });
      }

      // password가 맞으면 로그인이 완료된 것이므로 access token을 돌려준다.
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "12h",
        }
      );
      const refreshToken = jwt.sign(
        { userId: user.userId },
        process.env.REFRESH_TOKEN_KEY,
        { expiresIn: "7d" }
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

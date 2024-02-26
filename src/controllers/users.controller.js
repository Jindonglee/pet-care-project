export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  // 회원 가입
  createUser = async (req, res, next) => {
    try {
      const { email, password, confirmPassword, name } = req.body;

      // 필수 파라미터 검증하기
      if (!email || !password || !confirmPassword || !name) {
        return res
          .status(400)
          .json({ message: "모든 필수 정보를 입력해야 합니다." });
      }

      // 이메일 형식 검증하기
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ message: "유효한 이메일 주소를 입력해야 합니다." });
      }

      // 비밀번호 길이 검증하기
      if (password.length < 6) {
        return res
          .status(400)
          .json({ success: false, message: "비밀번호는 최소 6자 이상입니다." });
      }

      // 비밀번호 일치 여부 확인
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "비밀번호가 일치하지 않습니다." });
      }

      // 회원가입 서비스 호출
      const user = await this.userService.signup(
        email,
        password,
        name,
        profileImage
      );

      return res.status(200).json({
        message: "회원가입이 완료되었습니다.",
        data: {
          email: user.email,
          name: user.name,
        },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: "예기치 못한 서버 에러 발생", error: err.message });
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
      res.cookie("accessToken", accessToken);

      return res.status(200).send({
        message: "로그인 api 입니다.",
        data: {
          accessToken,
        },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "예기치 못한 서버 에러 발생", error: err.message });
    }
  };
}

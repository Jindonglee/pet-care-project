export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  //1. 회원가입
  signup = async (email, password, confirmPassword, name) => {
    const user = await this.usersRepository.signupUser(
      email,
      password,
      confirmPassword,
      name
    );

    if (!email || !password || !confirmPassword || !name) {
      throw new Error("모든 필수 정보를 입력해야 합니다.");
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("유효한 이메일 주소를 입력해야 합니다.");
    }

    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }

    // 이메일 중복 체크
    const existUser = await userRepository.findByEmail(email);
    if (existUser) {
      throw new Error("이미 사용하고 있는 이메일입니다.");
    }

    // 사용자 생성
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.createUser(
      email,
      hashedPassword,
      name
    );

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return { message: "회원가입이 완료되었습니다.", user: newUser };
  };

  // 2. 로그인
  signin = async (email, password) => {
    if (!email) {
      throw new Error("email은 필수 입력값입니다.");
    }
    if (!password) {
      throw new Error("password는 필수 입력값입니다.");
    }

    // 해당하는 이메일이 존재하는지 찾기
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    // user가 없으면 가입되지 않은 user이므로 에러 발생
    if (!user) {
      throw new Error("가입되지 않은 이메일입니다.");
    }

    // bcrypt를 사용하여 비밀번호 비교
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("비밀번호가 올바르지 않습니다.");
    }

    // password가 맞으면 access token과 refresh token 생성하여 반환
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "12h" }
    );
    const refreshToken = jwt.sign(
      { userId: user.userId },
      process.env.REFRESH_TOKEN_KEY,
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
    const user = await userRepository.findUserById(userId);

    if (!user) {
      throw new Error("존재하지 않는 사용자입니다.");
    }

    await userRepository.deleteUserById(userId);
    return { message: "사용자 정보가 삭제되었습니다." };
  };
}

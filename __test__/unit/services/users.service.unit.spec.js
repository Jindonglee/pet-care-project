import { jest } from "@jest/globals";
import { UsersService } from "../../../src/services/users.service.js";
import { expect } from "@jest/globals";

//Mock bcrypt 모듈
let mockBcrypt = {
  hash: jest.fn((password, saltRounds) => Promise.resolve(`hashed${password}`)), // 비밀번호를 해시합니다.
};

// 가짜 응답 객체 생성
let mockResponse = {
  clearCookie: jest.fn(), // jest.fn()으로 clearCookie 메서드를 가짜 함수로 대체
};

// usersRepository는 아래의 4개 메서드만 지원하고 있습니다.
let mockUsersRepository = {
  findByEmail: jest.fn(),
  signup: jest.fn(),
  signin: jest.fn(),
  signout: jest.fn(),
  findUserById: jest.fn(),
  deleteUser: jest.fn(),
};

// usersService의 Repository를 Mock Repository로 의존성을 주입합니다.
let usersService = new UsersService(
  mockUsersRepository,
  mockBcrypt,
  mockResponse
);

describe("Users Service Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("signup should throw an error if email is missing", async () => {
    // Mock user data
    const name = "test User";
    const password = "pass1234";
    const confirmpassword = "pass1234";

    // 예외를 기대하여 이메일이 누락된 경우를 테스트합니다.
    await expect(
      usersService.signup("userId", "", password, confirmpassword, name)
    ).rejects.toThrow("email은 필수 입력값입니다.");
  });

  test("sign up shoule trow an error if password is missing", async () => {
    const email = "test@example.com";
    const name = "test User";

    await expect(
      usersService.signup("userId", email, "", "confirmPassword", name)
    ).rejects.toThrow("password는 필수 입력값입니다.");
  });

  test("sign up shoule trow an error if name is missing", async () => {
    const email = "test@example.com";
    const password = "pass1234";
    const confirmpassword = "pass1234";

    await expect(
      usersService.signup("userId", email, password, confirmpassword, "")
    ).rejects.toThrow("name은 필수 입력값입니다.");
  });

  test("sign up shoule trow an error if confirmPassword is missing", async () => {
    const email = "test@example.com";
    const name = "Test User";
    const password = "pass1234";

    await expect(
      usersService.signup("userId", email, password, "", name)
    ).rejects.toThrow("confirmPassword는 필수 입력값입니다.");
  });

  test("signup should throw an error if passwords do not match", async () => {
    const email = "test@example.com";
    const name = "Test User";
    const password = "pass1234";
    const confirmpassword = "pass5678";

    await expect(
      usersService.signup("userId", email, password, confirmpassword, name)
    ).rejects.toThrow("비밀번호가 일치하지 않습니다.");
  });

  test("signup should throw an error if invalid email is provided", async () => {
    // 유효하지 않은 이메일 주소 목록
    const invalidEmails = [
      "invalidemail",
      "invalidemail@",
      "invalidemail.com",
      "invalidemail@.com",
      "@invalidemail.com",
    ];

    // 유효하지 않은 이메일 주소에 대한 테스트
    for (const invalidEmail of invalidEmails) {
      await expect(
        usersService.signup(invalidEmail, "password", "John")
      ).resolves.toEqual({ message: "유효한 이메일 주소를 입력해야 합니다." });
    }
  });

  test("signup should throw an error if user already exists with the given email", async () => {
    // Mock user data
    const email = "test@example.com";

    // Mock usersRepository.findByEmail to return a user object (이메일이 이미 사용중임을 나타냄)
    mockUsersRepository.findByEmail.mockResolvedValueOnce({
      userId: "1",
      email: "test@example.com",
      password: "pass1234",
      name: "Test User",
    });

    // 이미 존재하는 이메일임을 signup method를 통해 불러옴
    await expect(
      usersService.signup("userId", email, "password", "password", "name")
    ).rejects.toThrow("이미 사용하고 있는 이메일입니다.");

    // 제공된 이메일로 usersRepository.findByEmail 한번 호출되었는지 확인
    expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(email);

    // usersRepository.signup이 호출되지 않았는지 확인
    expect(mockUsersRepository.signup).not.toHaveBeenCalled();

    // bcrypt.hash이 호출되지 않았는지 확인
    expect(mockBcrypt.hash).not.toHaveBeenCalled();
  });

  test("signup should successfully create a new user if valid inputs are provided", async () => {
    // Mock user data
    const userId = "1";
    const email = "test@example.com";
    const name = "test User";
    const password = "pass1234";

    // Mock usersRepository.findByEmail to return null (이메일이 아직 사용되지 않음을 나타냄)
    mockUsersRepository.findByEmail.mockResolvedValueOnce(null);

    // Mock bcrypt.hash to return hashed password
    const hashedPassword = "hashedPassword123";
    mockBcrypt.hash.mockResolvedValueOnce(hashedPassword);

    // Mock usersRepository.signup 의 new user 객체를 반환
    const user = {
      userId,
      email,
      name,
      hashedPassword,
      createdAt: new Date(),
    };

    mockUsersRepository.signup.mockResolvedValueOnce(user);

    // 새로운 사용자 생성
    const newUser = await usersService.signup(userId, email, password, name);

    //제공된 email, hashed password, name으로 usersRepository.signup이 호출되었는지 확인
    expect(mockUsersRepository.signup).toHaveBeenCalledWith(
      userId,
      email,
      hashedPassword,
      name
    );

    // 올바른 사용자 정보가 반환되는지 확인
    expect(user).toEqual({
      message: "회원가입이 완료되었습니다.",
      user: {
        userId,
        email,
        name,
        createdAt: expect.any(Date),
      },
    });
  });

  test("signin should throw an error if email or password is missing", async () => {
    expect(usersService.signin("", "password")).rejects.toThrow(
      "이메일과 비밀번호를 입력해주세요."
    );
    await expect(usersService.signin("email@example.com", "")).rejects.toThrow(
      "이메일과 비밀번호를 입력해주세요."
    );
  });

  test("signin should throw an error if user does not exist", async () => {
    // Mock user data
    const email = "nonexistent@example.com"; // 존재하지 않는 이메일

    // Mock usersRepository.findByEmail to return null (존재하지 않는 이메일)
    mockUsersRepository.findByEmail.mockResolvedValueOnce(null);

    // 예외를 기대하여 존재하지 않는 이메일을 사용하여 로그인하는 경우를 테스트.
    await expect(usersService.signin(email, "password")).rejects.toThrow(
      "가입되지 않은 이메일입니다."
    );

    // usersRepository.findByEmail이 한 번 호출되었는지 확인합니다.
    expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(email);
  });

  test("signout should clear access and refresh tokens in cookies", async () => {
    // signout 메서드 호출
    await usersService.signout(mockResponse);

    const result = await usersService.signout();
    expect(result.message).toBe("로그아웃 되었습니다.");
  });

  test("deleteUser should throw an error if user does not exist", async () => {
    mockUsersRepository.findUserById.mockResolvedValueOnce(null);
    await expect(usersService.deleteUser("123")).rejects.toThrow(
      "존재하지 않는 사용자입니다."
    );
  });
});

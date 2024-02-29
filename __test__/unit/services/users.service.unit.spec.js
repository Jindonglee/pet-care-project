import { jest } from "@jest/globals";
import { UsersService } from "../../../src/services/users.service.js";
import { expect } from "@jest/globals";
import jwt from "jsonwebtoken";

//Mock bcrypt 모듈
let mockBcrypt = {
  hash: jest.fn((password, saltRounds) => Promise.resolve(`hashed${password}`)), // 비밀번호를 해시합니다.
  compare: jest.fn().mockResolvedValueOnce(true),
  compare: jest.fn((password, hashedPassword) =>
    Promise.resolve(password === "correct_password")
  ),
};

// 가짜 응답 객체 생성
let mockResponse = {
  clearCookie: jest.fn(), // jest.fn()으로 clearCookie 메서드를 가짜 함수로 대체
};

// usersRepository는 아래의 7개 메서드만 지원하고 있습니다.
let mockUsersRepository = {
  findByEmail: jest.fn(),
  compare: jest.fn(),
  signup: jest.fn(),
  signin: jest.fn(),
  signout: jest.fn(),
  findById: jest.fn(),
  deleteUser: jest.fn(),
  delete: jest.fn().mockResolvedValue(true),
};

// usersService의 Repository를 Mock Repository로 의존성을 주입합니다.
let usersService = new UsersService(
  mockUsersRepository,
  mockBcrypt,
  mockResponse
);
console.log(usersService);
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
      usersService.signup("", password, confirmpassword, name)
    ).rejects.toThrow("email은 필수 입력값입니다.");
  });

  test("sign up shoule trow an error if password is missing", async () => {
    const email = "test@example.com";
    const name = "test User";

    await expect(
      usersService.signup(email, "", "confirmPassword", name)
    ).rejects.toThrow("password는 필수 입력값입니다.");
  });

  test("sign up shoule trow an error if name is missing", async () => {
    const email = "test@example.com";
    const password = "pass1234";
    const confirmpassword = "pass1234";

    await expect(
      usersService.signup(email, password, confirmpassword, "")
    ).rejects.toThrow("name은 필수 입력값입니다.");
  });

  test("sign up shoule trow an error if confirmPassword is missing", async () => {
    const email = "test@example.com";
    const name = "Test User";
    const password = "pass1234";

    await expect(
      usersService.signup(email, password, "", name)
    ).rejects.toThrow("confirmPassword는 필수 입력값입니다.");
  });

  test("signup should throw an error if passwords do not match", async () => {
    const email = "test@example.com";
    const name = "Test User";
    const password = "pass1234";
    const confirmpassword = "pass5678";

    await expect(
      usersService.signup(email, password, confirmpassword, name)
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
      usersService.signup(email, "password", "password", "name")
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
    const name = "Test User";
    const email = "test@example.com";
    const password = "pass1234";

    // Mock bcrypt.hash to return hashed password
    const hashedPassword = "hashedPassword123";
    mockBcrypt.hash.mockResolvedValueOnce(hashedPassword);

    // Mock usersRepository.signup to return a new user object
    const newUser = {
      userId: "1",
      email: "test@example.com",
      password: hashedPassword, // Return hashed password
      name: "Test User",
      createdAt: new Date(), // Mock createdAt timestamp
    };
    mockUsersRepository.signup.mockResolvedValueOnce(newUser);

    // Call the signup method of usersService
    const result = await usersService.signup(email, password, password, name);

    // Verify the result
    expect(result.message).toBe("회원가입이 완료되었습니다.");
    expect(result.user).toEqual({
      userId: newUser.userId,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
    });

    // Verify that usersRepository.signup was called with the correct arguments
    expect(mockUsersRepository.signup).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.signup).toHaveBeenCalledWith(
      email,
      hashedPassword,
      name
    );

    // Verify that bcrypt.hash was called with the correct arguments
    expect(mockBcrypt.hash).toHaveBeenCalledTimes(1);
    expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
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

  test("signin should return access token and refresh token if password is correct", async () => {
    const email = "test@example.com";
    const password = "pass1234";
    const user = {
      userId: "1",
      email: "test@example.com",
      password: await mockBcrypt.hash(password, 10),
    };

    // 사용자 객체 반환
    mockUsersRepository.findByEmail.mockResolvedValueOnce(user);

    // Mock bcrypt.compare to return true (비밀번호 일치를 나타냄)
    mockBcrypt.compare.mockResolvedValueOnce(true);

    //Mock access token and refresh token
    const accessToken = "mockAccessToken";
    const refreshToken = "mockRefreshToken";

    // access token,refresh token을 반환하기 위해 jwt.sign을 mock
    jest
      .spyOn(jwt, "sign")
      .mockReturnValueOnce(accessToken)
      .mockReturnValueOnce(refreshToken);

    // Call the signin method of usersService
    const result = await usersService.signin(email, password);

    // 결과가 잘 반환되었는지 확인
    expect(result.accessToken).toBe(accessToken);
    expect(result.refreshToken).toBe(refreshToken);

    // usersRepository.findByEmail 올바른 인수(email)로 한번 호출 되었는지 확인
    expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(email);

    // bcrypt.compare 올바른 인수 password, user.password로 한번 호출된 것을 확인
    expect(mockBcrypt.compare).toHaveBeenCalledTimes(1);
    expect(mockBcrypt.compare).toHaveBeenCalledWith(password, user.password);

    // Verify that jwt.sign was called with the correct arguments for access token
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: user.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "12h" }
    );

    // Verify that jwt.sign was called with the correct arguments for refresh token
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: user.userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
  });

  test("signin should throw an error if password is incorrect", async () => {
    // Mock user data
    const email = "test@example.com";
    const password = "wrong_password";
    const user = {
      userId: "1",
      email: "test@example.com",
      password: await mockBcrypt.hash("correct_password", 10), // Hashed password
      // Mock other user data as needed
    };

    // Mock usersRepository.findByEmail user 객체로 반환 확인
    mockUsersRepository.findByEmail.mockResolvedValueOnce(user);

    // bcrypt.compare를 Mock (모의)하여 false를 반환  ( => 비밀번호 불일치를 나타냄)
    mockBcrypt.compare.mockResolvedValueOnce(false);

    // Call the signin method of usersService and expect it to throw an error
    await expect(usersService.signin(email, password)).rejects.toThrow(
      "잘못된 비밀번호입니다."
    );

    // usersRepository.findByEmail 올바른 인수로 호출되었는지 확인
    expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(email);

    // bcrypt.compare가 올바른 인수로 호출되었는지 확인
    expect(mockBcrypt.compare).toHaveBeenCalledTimes(1);
    expect(mockBcrypt.compare).toHaveBeenCalledWith(password, user.password);
  });

  test("should return a message indicating successful signout", async () => {
    const result = await usersService.signout();
    expect(result.message).toBe("로그아웃 되었습니다.");
  });
});

test("deleteUser should delete user account successfully", async () => {
  // Mock 데이터 설정
  const userId = "user123";
  const mockUser = { userId: "user123" };

  // UserRepository findById Mock 설정
  mockUsersRepository.findById.mockResolvedValue(mockUser);

  // UserRepository delete Mock 설정
  mockUsersRepository.delete.mockResolvedValue(true);

  // deleteUser 호출
  const result = await usersService.deleteUser(userId);

  // 올바른 사용자를 찾는지 확인
  expect(mockUsersRepository.findById).toHaveBeenCalledWith(userId);

  // deleteUser가 호출되었는지 확인
  expect(mockUsersRepository.delete).toHaveBeenCalledWith(userId);

  // 계정 삭제 성공 여부 확인
  expect(result).toEqual({
    success: true,
    message: "계정이 성공적으로 삭제되었습니다.",
  });
});

test("deleteUser should return failure message if user deletion fails", async () => {
  // Mock 데이터 설정
  const userId = "user123";
  const mockUser = { userId: "user123" };

  // UserRepository findById Mock 설정
  mockUsersRepository.findById.mockResolvedValue(mockUser);

  // UserRepository delete Mock 설정 (삭제 실패)
  mockUsersRepository.delete.mockResolvedValue(false);

  // deleteUser 메서드를 호출하고 반환값을 확인합니다.
  const result = await usersService.deleteUser(userId);

  // deleteUser 메서드가 호출되었는지 확인합니다.
  expect(mockUsersRepository.delete).toHaveBeenCalledWith(userId);

  // 계정 삭제 실패 메시지 확인
  expect(result).toEqual({
    success: false,
    message: "계정 삭제에 실패했습니다.",
  });
});

test("deleteUser should throw an error if user does not exist", async () => {
  // Mock 데이터 설정
  const userId = "nonexistentUser";

  // UserRepository findById Mock 설정 (사용자가 존재하지 않음)
  mockUsersRepository.findById.mockResolvedValue(null);

  // deleteUser 함수 호출 및 반환값 확인
  const result = await usersService.deleteUser(userId);

  // 사용자를 찾을 수 없을 때 실패 메시지 반환 여부 확인
  expect(result).toEqual({
    message: "사용자를 찾을 수 없습니다.",
    success: false,
  });
});

// __tests__/unit/posts.controller.unit.spec.js

import { jest } from "@jest/globals";
import { UsersController } from "../../../src/controllers/users.controller.js";
import { UsersService } from "../../../src/services/users.service.js";

// posts.service.js 에서는 아래 5개의 Method만을 사용합니다.
const mockUsersService = {
  signup: jest.fn(),
  signin: jest.fn(),
  signout: jest.fn(),
  deleteUser: jest.fn(),
};

const mockRequest = (body, cookies, headers) => ({ body, cookies, headers });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

// usersController의 Service를 Mock Service로 의존성을 주입합니다.
const usersController = new UsersController(mockUsersService);

describe("Users Controller Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status.mockReturnValue(mockResponse);
  });

  test("signup - Success", async () => {
    const req = mockRequest({
      email: "test@example.com",
      password: "password",
      confirmPassword: "password",
      name: "Test User",
    });
    const res = mockResponse();

    // UsersService의 signup 메서드가 성공적으로 실행되도록 설정합니다.
    mockSignup.mockResolvedValueOnce({
      userId: "123",
      email: "test@example.com",
      name: "Test User",
    });

    // 회원 가입을 시도합니다.
    await usersController.signup(req, res, mockNext);

    // 응답이 올바르게 설정되었는지 확인합니다.
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "회원가입이 완료되었습니다.",
      data: {
        userId: "123",
        email: "test@example.com",
        name: "Test User",
      },
    });

    // UsersService의 signup 메서드가 올바르게 호출되었는지 확인합니다.
    expect(mockSignup).toHaveBeenCalledWith(
      "test@example.com",
      "password",
      "password",
      "Test User"
    );
  });

  test("signin - Success", async () => {
    const req = mockRequest({
      email: "test@example.com",
      password: "password",
    });
    const res = mockResponse();

    // UsersService의 signin 메서드가 성공적으로 실행되도록 설정합니다.
    const accessToken = "fakeAccessToken";
    const refreshToken = "fakeRefreshToken";
    mockSignin.mockResolvedValueOnce({ accessToken, refreshToken });

    // 로그인을 시도합니다.
    await usersController.signin(req, res, mockNext);

    // 응답이 올바르게 설정되었는지 확인합니다.
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "로그인 되었습니다",
      data: {
        accessToken,
        refreshToken,
      },
    });

    // 쿠키가 올바르게 설정되었는지 확인합니다.
    expect(res.cookie).toHaveBeenCalledWith("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    });
    expect(res.cookie).toHaveBeenCalledWith("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    // UsersService의 signin 메서드가 올바르게 호출되었는지 확인합니다.
    expect(mockSignin).toHaveBeenCalledWith("test@example.com", "password");
  });

  test("signout - Success", async () => {
    const req = mockRequest({
      accessToken: "fakeAccessToken",
      refreshToken: "fakeRefreshToken",
    });
    const res = mockResponse();

    // 로그아웃 메서드 호출 시, 성공적으로 실행되도록 설정합니다.
    mockSignout.mockResolvedValueOnce({ message: "로그아웃 되었습니다." });

    // 로그아웃을 시도합니다.
    await usersController.signout(req, res, mockNext);

    // 응답이 올바르게 설정되었는지 확인합니다.
    expect(res.clearCookie).toHaveBeenCalledWith("accessToken", {
      path: "/",
      secure: true,
    });
    expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", {
      path: "/",
      secure: true,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "로그아웃 되었습니다." });

    // UsersService의 signout 메서드가 올바르게 호출되었는지 확인합니다.
    expect(mockSignout).toHaveBeenCalled();
  });
});

test("should return 401 status if token is missing", async () => {
  const req = mockRequest({});
  const res = mockResponse();

  await usersController.deleteUser(req, res);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    message: "인증되지 않은 사용자입니다.",
  });
  expect(mockUsersService.deleteUser).not.toHaveBeenCalled(); // deleteUser 메서드가 호출되지 않아야 함
});

test("should call deleteUser method and return result if token is provided", async () => {
  const req = mockRequest({ authorization: "fakeToken" });
  const res = mockResponse();
  const expectedResult = { message: "User deleted successfully" };

  // Mock deleteUser 메서드가 성공적으로 실행되도록 설정
  mockUsersService.deleteUser.mockResolvedValueOnce(expectedResult);

  await usersController.deleteUser(req, res);

  expect(mockUsersService.deleteUser).toHaveBeenCalledWith("userIdFromToken");
  expect(res.json).toHaveBeenCalledWith(expectedResult);
});

test("should return 500 status and error message if deleteUser method throws an error", async () => {
  const req = mockRequest({ authorization: "fakeToken" });
  const res = mockResponse();
  const expectedError = new Error("Internal Server Error");

  // Mock deleteUser 메서드가 에러를 던질 경우
  mockUsersService.deleteUser.mockRejectedValueOnce(expectedError);

  await usersController.deleteUser(req, res);

  expect(mockUsersService.deleteUser).toHaveBeenCalledWith("userIdFromToken");
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: expectedError.message });
});

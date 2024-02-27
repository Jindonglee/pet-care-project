// __tests__/unit/posts.repository.unit.spec.js

import { jest } from "@jest/globals";
import { UsersRepository } from "../../../src/repositories/users.repository";
import { expect } from "@jest/globals";

// Prisma 클라이언트에서는 아래 4개의 메서드만 사용합니다.
let mockPrisma = {
  users: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

let usersRepository = new UsersRepository(mockPrisma);

describe("Users Repository Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("findByEmail Method", async () => {
    const userEmail = "test@sprata.com";
    const mockUser = { userId: 1, email: userEmail, name: "Test User" };
    mockPrisma.users.findFirst.mockResolvedValue(mockUser);

    const user = await usersRepository.findByEmail(userEmail);

    // findByEmail 메서드가 Prisma 클라이언트의 findFirst 메서드를 올바르게 호출했는지 확인
    expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({
      where: { email: userEmail },
    });

    // findByEmail 메서드가 Prisma 클라이언트에서 받은 값을 반환했는지 확인
    expect(user).toEqual(mockUser);
  });

  test("signup Method", async () => {
    const userData = {
      email: "test@example.com",
      password: "password",
      name: "Test User",
    };

    const mockNewUser = {
      userId: 1,
      eamil: userData.email,
      name: userData.name,
    };

    mockPrisma.users.create.mockResolvedValue(mockNewUser);

    const newUser = await usersRepository.signup(
      userData.email,
      userData.password,
      userData.name
    );

    //signup 메서드가 Prisma 클라이언트의 create 메서드를 올바르게 호출했는지 확인
    expect(mockPrisma.users.create).toHaveBeenCalledWith({
      data: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
      },
      select: { userId: true, email: true, name: true },
    });

    // signup 메서드가 Prisma 클라이언트에서 받은 값을 반환했는지 확인
    expect(newUser).toEqual(mockNewUser);
  });

  test("findUserById Method", async () => {
    const userId = 1;
    const mockUser = { userId, email: "test@example.com", name: "Test User" };

    mockPrisma.users.findUnique.mockResolvedValue(mockUser);

    // findUserById 메서드를 호출하여 사용자를 찾습니다.
    const user = await usersRepository.findUserById(userId);

    // findeUserById 메서드가 Prisma 클라이언트의 findUnique 메서드를 올바르게 호출했는지 확인
    expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({
      where: { userId: +userId },
    });

    // findFrist 메서드가 Prisma 클라이언트에서 받은 값을 반환했는지 확인
    expect(user).toEqual(mockUser);
  });

  test("deleteUserById Method", async () => {
    const userId = 1;
    mockPrisma.users.delete.mockResolvedValue({ userId });

    // When : deleteUserById 메서드를 호출하여 사용자를 삭제합니다.
    const deletedUser = await usersRepository.deleteUserById(userId);

    // deleteUserById 메서드가 Prisma 클라이언트의 delete 메서드를 올바르게 호출했는지 확인
    expect(mockPrisma.users.delete).toHaveBeenCalledWith({
      where: { userId: +userId },
    });

    // deleteUserById 메서드가 Prisma 클라이언트에서 받은 값을 반환했는지 확인
    expect(deletedUser).toEqual({ userId });
  });
});

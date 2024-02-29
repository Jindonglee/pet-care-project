import { prisma } from "../utils/prisma/index.js";
import { jest } from "jest/globals";
import { ProfileRepository } from "../../../src/repositories/profile.repository";
import { PrismaClient } from "@prisma/client";

// Prisma 클라이언트에서는 아래 5개의 메서드만 사용합니다.
let mockPrisma = {
  profile: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let profileRepository = new ProfileRepository(mockPrisma);

describe("Profile Repository Unit Test", () => {
  let prisma;
  beforeEach(() => {
    prisma = new PrismaClient();
    jest.resetAllMocks(); // 모든 Mock을 초기화함.
  });

  test("findAllProfiles Method", async () => {
    const mockReturn = "findMany String";
    mockPrisma.profile.findMany.mockReturnValue(mockReturn);

    // postsRepository의 findAllPosts Method를 호출합니다.
    const profile = await profileRepository.findAllProfile();

    // prisma.posts의 findMany은 1번만 호출 되었습니다.
    expect(profileRepository.prisma.profile.findMany).toHaveBeenCalledTimes(1);

    // mockPrisma의 Return과 출력된 findMany Method의 값이 일치하는지 비교합니다.
    expect(profile).toBe(mockReturn);
  });

  test("getProfile Method", async () => {
    const mockReturn = "create Return String";
    mockPrisma.profile.create.mockReturnValue(mockReturn);

    const getProfileParams = {
      nickname: "createPostNickname",
      password: "createPostPassword",
      title: "createPostTitle",
      content: "createPostContent",
    };

    // postsRepository의 createPost Method를 실행합니다.
    const createPostData = await postsRepository.createPost(
      createPostParams.nickname,
      createPostParams.password,
      createPostParams.title,
      createPostParams.content
    );

    // createPostData는 prisma.posts의 create를 실행한 결과값을 바로 반환한 값인지 테스트합니다.
    expect(createPostData).toBe(mockReturn);

    // postsRepository의 createPost Method를 실행했을 때, prisma.posts의 create를 1번 실행합니다.
    expect(mockPrisma.posts.create).toHaveBeenCalledTimes(1);

    // postsRepository의 createPost Method를 실행했을 때, prisma.posts의 create를 아래와 같은 값으로 호출합니다.
    expect(mockPrisma.posts.create).toHaveBeenCalledWith({
      data: createPostParams,
    });
  });
});

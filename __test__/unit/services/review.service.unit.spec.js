// __tests__/unit/posts.service.unit.spec.js

import { expect, jest } from "@jest/globals";
import { ReviewService } from "../../../src/services/review.service";

// PostsRepository는 아래의 5개 메서드만 지원하고 있습니다.
let mockReviewRepository = {
  findSitterId: jest.fn(),
  findReviewId: jest.fn(),
  getReviews: jest.fn(),
  postReview: jest.fn(),
  patchReview: jest.fn(),
  deleteReview: jest.fn(),
};

// postsService의 Repository를 Mock Repository로 의존성을 주입합니다.
let reviewService = new ReviewService(mockReviewRepository);

const sampleSitter = [
  {
    sitterId: 1,
    sitterName: "일시터",
    career: 1,
    createdAt: "2023-08-21T08:25:38.4532Z",
    updatedAt: "2023-08-21T08:25:38.4532Z",
  },
];

const sampleReviews = [
  {
    users: { name: "김일번" },
    sitterId: 1,
    reviewId: 1,
    userId: 1,
    title: "일번타이틀",
    content: "일번컨텐트",
    rate: "five",
    createdAt: "2023-08-25T03:43:20.4532Z",
    updatedAt: "2023-08-25T03:43:20.4532Z",
  },
  {
    users: { name: "김이번" },
    sitterId: 1,
    reviewId: 2,
    userId: 2,
    title: "이번타이틀",
    content: "이번컨텐트",
    rate: "four",
    createdAt: "2023-08-26T03:43:20.4532Z",
    updatedAt: "2023-08-26T03:43:20.4532Z",
  },
];

const samplePostedReviews = [
  {
    users: { name: "김일번" },
    sitterId: 1,
    reviewId: 1,
    userId: 1,
    title: "일번타이틀",
    content: "일번컨텐트",
    rate: "five",
    createdAt: "2023-08-25T03:43:20.4532Z",
    updatedAt: "2023-08-25T03:43:20.4532Z",
  },
  {
    users: { name: "김이번" },
    sitterId: 1,
    reviewId: 2,
    userId: 2,
    title: "이번타이틀",
    content: "이번컨텐트",
    rate: "four",
    createdAt: "2023-08-26T03:43:20.4532Z",
    updatedAt: "2023-08-26T03:43:20.4532Z",
  },
  {
    users: { name: "김삼번" },
    sitterId: 1,
    reviewId: 3,
    userId: 3,
    title: "삼번타이틀",
    content: "삼번컨텐트",
    rate: "three",
    createdAt: "2023-08-26T03:43:20.4532Z",
    updatedAt: "2023-08-26T03:43:20.4532Z",
  },
];

const samplePostReview = {
  users: { name: "김삼번" },
  sitterId: 1,
  reviewId: 3,
  userId: 3,
  title: "삼번타이틀",
  content: "삼번컨텐트",
  rate: "three",
  createdAt: "2023-08-26T03:43:20.4532Z",
  updatedAt: "2023-08-26T03:43:20.4532Z",
};

const samplePatchedReviews = [
  {
    users: { name: "김일번" },
    sitterId: 1,
    reviewId: 1,
    userId: 1,
    title: "일번타이틀",
    content: "일번컨텐트",
    rate: "five",
    createdAt: "2023-08-25T03:43:20.4532Z",
    updatedAt: "2023-08-25T03:43:20.4532Z",
  },
  {
    users: { name: "김이번" },
    sitterId: 1,
    reviewId: 2,
    userId: 2,
    title: "이번타이틀",
    content: "이번컨텐트",
    rate: "four",
    createdAt: "2023-08-26T03:43:20.4532Z",
    updatedAt: "2023-08-26T03:43:20.4532Z",
  },
  {
    users: { name: "김삼번" },
    sitterId: 1,
    reviewId: 3,
    userId: 3,
    title: "수정타이틀",
    content: "수정컨텐트",
    rate: "five",
    createdAt: "2023-08-26T03:43:20.4532Z",
    updatedAt: "2023-08-26T03:43:20.4532Z",
  },
];

const samplePatchReview = {
  users: { name: "김삼번" },
  sitterId: 1,
  reviewId: 3,
  userId: 3,
  title: "수정타이틀",
  content: "수정컨텐트",
  rate: "five",
  createdAt: "2023-08-26T03:43:20.4532Z",
  updatedAt: "2023-08-26T03:43:20.4532Z",
};

const getReviewsOrganize = sampleReviews.map((review) => {
  return {
    name: review.users.name,
    sitterId: review.sitterId,
    reviewId: review.reviewId,
    title: review.title,
    content: review.content,
    rate: review.rate,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
});

const postReviewsOrganize = sampleReviews
  .concat(samplePostReview)
  .map((review) => {
    return {
      name: review.users.name,
      sitterId: review.sitterId,
      reviewId: review.reviewId,
      title: review.title,
      content: review.content,
      rate: review.rate,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  });

const patchReviewsOrganize = sampleReviews
  .concat(samplePatchReview)
  .map((review) => {
    return {
      name: review.users.name,
      sitterId: review.sitterId,
      reviewId: review.reviewId,
      title: review.title,
      content: review.content,
      rate: review.rate,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  });

const user1 = {
  userId: 1,
  name: "일유저",
  email: "1email",
  password: "1q2w3e4r",
  createdAt: "2023-08-23T18:27:21.4532Z",
};

const user3 = {
  userId: 3,
  name: "삼유저",
  email: "3email",
  password: "1q2w3e4r",
  createdAt: "2023-08-24T12:58:32.4532Z",
};

describe("Review Service Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("getReviews Method Success", async () => {
    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    const allReviews = await reviewService.getReviews(1, "desc");
    expect(allReviews).toEqual(getReviewsOrganize);
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(1);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(1);
  });

  test("getReviews Method Without orderValue Success", async () => {
    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    const allReviews = await reviewService.getReviews(1);
    expect(allReviews).toEqual(getReviewsOrganize);
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(1);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(1);
  });

  test("getReviews Method Without sitterId Fail", async () => {
    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    try {
      await reviewService.getReviews(undefined, "desc");
    } catch (err) {
      expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("sitterId가 입력되지 않았습니다.");
    }
  });

  test("getReviews Method Wrong orderValue Fail", async () => {
    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    try {
      await reviewService.getReviews(1, "abcd");
    } catch (err) {
      expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("정렬값이 올바르지 않습니다.");
    }
  });

  test("getReviews Method Not Found sitterId Fail", async () => {
    const emptySitter = null;
    mockReviewRepository.findSitterId.mockReturnValue(emptySitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    try {
      await reviewService.getReviews(12345, "ASC");
    } catch (err) {
      expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(1);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("해당하는 sitterId는 존재하지 않습니다.");
    }
  });

  test("postReview Method Success", async () => {
    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.postReview.mockReturnValue(samplePostReview);
    mockReviewRepository.getReviews.mockReturnValue(samplePostedReviews);
    const allReviews = await reviewService.postReview(
      user1.userId,
      1,
      "삼번타이틀",
      "삼번컨텐트",
      "three"
    );
    expect(allReviews).toEqual(postReviewsOrganize);
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(1);
    expect(mockReviewRepository.postReview).toHaveBeenCalledTimes(1);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(1);
  });

  test("postReview Method Without sitterId Fail", async () => {
    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.postReview.mockReturnValue(samplePostReview);
    mockReviewRepository.getReviews.mockReturnValue(samplePostedReviews);
    try {
      await reviewService.postReview(
        user1.userId,
        undefined,
        "삼번타이틀",
        "삼번컨텐트",
        "three"
      );
    } catch (err) {
      expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.postReview).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("sitterId가 입력되지 않았습니다.");
    }
  });

  test("postReview Method Without Request Data Fail", async () => {
    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.postReview.mockReturnValue(samplePostReview);
    mockReviewRepository.getReviews.mockReturnValue(samplePostedReviews);
    try {
      await reviewService.postReview(
        user1.userId,
        1,
        undefined,
        "삼번컨텐트",
        "three"
      );
    } catch (err) {
      expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.postReview).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("title, content, rate값을 입력해주세요.");
    }
  });

  test("postReview Method Wrong rate Fail", async () => {
    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.postReview.mockReturnValue(samplePostReview);
    mockReviewRepository.getReviews.mockReturnValue(samplePostedReviews);
    try {
      await reviewService.postReview(
        user1.userId,
        1,
        "삼번타이틀",
        "삼번컨텐트",
        "eleven"
      );
    } catch (err) {
      expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.postReview).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("rate값이 올바르지 않습니다.");
    }
  });

  test("postReview Method Not Found sitterId Fail", async () => {
    const emptySitter = null;
    mockReviewRepository.findSitterId.mockReturnValue(emptySitter);
    mockReviewRepository.postReview.mockReturnValue(samplePostReview);
    mockReviewRepository.getReviews.mockReturnValue(samplePostedReviews);
    try {
      await reviewService.postReview(
        user1.userId,
        123456,
        "삼번타이틀",
        "삼번컨텐트",
        "three"
      );
    } catch (err) {
      expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(1);
      expect(mockReviewRepository.postReview).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("해당하는 sitterId는 존재하지 않습니다.");
    }
  });

  test("patchReview Method Success", async () => {
    mockReviewRepository.findReviewId.mockReturnValue(samplePostReview);
    mockReviewRepository.patchReview.mockReturnValue(samplePatchReview);
    mockReviewRepository.getReviews.mockReturnValue(samplePatchedReviews);
    const allReviews = await reviewService.patchReview(
      user3.userId,
      3,
      "수정타이틀",
      "수정컨텐트",
      "five"
    );
    expect(allReviews).toEqual(patchReviewsOrganize);
    expect(mockReviewRepository.findReviewId).toHaveBeenCalledTimes(1);
    expect(mockReviewRepository.patchReview).toHaveBeenCalledTimes(1);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(1);
  });

  test("patchReview Method Without reviewId Fail", async () => {
    mockReviewRepository.findReviewId.mockReturnValue(samplePostReview);
    mockReviewRepository.patchReview.mockReturnValue(samplePatchReview);
    mockReviewRepository.getReviews.mockReturnValue(samplePatchedReviews);
    try {
      await reviewService.patchReview(
        user3.userId,
        undefined,
        "수정타이틀",
        "수정컨텐트",
        "five"
      );
    } catch (err) {
      expect(mockReviewRepository.findReviewId).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.patchReview).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("reviewId가 입력되지 않았습니다.");
    }
  });

  test("patchReview Method Without Request Data Fail", async () => {
    mockReviewRepository.findReviewId.mockReturnValue(samplePostReview);
    mockReviewRepository.patchReview.mockReturnValue(samplePatchReview);
    mockReviewRepository.getReviews.mockReturnValue(samplePatchedReviews);
    try {
      await reviewService.patchReview(
        user3.userId,
        1,
        undefined,
        "수정컨텐트",
        "five"
      );
    } catch (err) {
      expect(mockReviewRepository.findReviewId).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.patchReview).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("title, content, rate값을 입력해주세요.");
    }
  });

  test("patchReview Method Wrong rate Fail", async () => {
    mockReviewRepository.findReviewId.mockReturnValue(samplePostReview);
    mockReviewRepository.patchReview.mockReturnValue(samplePatchReview);
    mockReviewRepository.getReviews.mockReturnValue(samplePatchedReviews);
    try {
      await reviewService.patchReview(
        user3.userId,
        1,
        "수정타이틀",
        "수정컨텐트",
        "nice"
      );
    } catch (err) {
      expect(mockReviewRepository.findReviewId).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.patchReview).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("rate값이 올바르지 않습니다.");
    }
  });

  test("patchReview Method Not Found reviewId Fail", async () => {
    const emptyReview = null;
    mockReviewRepository.findReviewId.mockReturnValue(emptyReview);
    mockReviewRepository.patchReview.mockReturnValue(samplePatchReview);
    mockReviewRepository.getReviews.mockReturnValue(samplePatchedReviews);
    try {
      await reviewService.patchReview(
        user3.userId,
        123456,
        "수정타이틀",
        "수정컨텐트",
        "five"
      );
    } catch (err) {
      expect(mockReviewRepository.findReviewId).toHaveBeenCalledTimes(1);
      expect(mockReviewRepository.patchReview).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("해당하는 reviewId는 존재하지 않습니다.");
    }
  });

  test("patchReview Method Without Auth Fail", async () => {
    mockReviewRepository.findReviewId.mockReturnValue(samplePostReview);
    mockReviewRepository.patchReview.mockReturnValue(samplePatchReview);
    mockReviewRepository.getReviews.mockReturnValue(samplePatchedReviews);
    try {
      await reviewService.patchReview(
        user1.userId,
        1,
        "수정타이틀",
        "수정컨텐트",
        "five"
      );
    } catch (err) {
      expect(mockReviewRepository.findReviewId).toHaveBeenCalledTimes(1);
      expect(mockReviewRepository.patchReview).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("권한이 없습니다.");
    }
  });

  test("deletePost Method Success", async () => {
    mockReviewRepository.findReviewId.mockReturnValue(samplePostReview);
    mockReviewRepository.deleteReview.mockReturnValue(samplePostReview);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    const allReviews = await reviewService.deleteReview(user3.userId, 3);
    expect(allReviews).toEqual(getReviewsOrganize);
    expect(mockReviewRepository.findReviewId).toHaveBeenCalledTimes(1);
    expect(mockReviewRepository.deleteReview).toHaveBeenCalledTimes(1);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(1);
  });

  test("deletePost Method Without reviewId Fail", async () => {
    mockReviewRepository.findReviewId.mockReturnValue(samplePostReview);
    mockReviewRepository.deleteReview.mockReturnValue(samplePostReview);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    try {
      await reviewService.deleteReview(user3.userId, undefined);
    } catch (err) {
      expect(mockReviewRepository.findReviewId).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.deleteReview).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("reviewId가 입력되지 않았습니다.");
    }
  });

  test("deletePost Method Not Found reviewId Fail", async () => {
    mockReviewRepository.findReviewId.mockReturnValue(samplePostReview);
    mockReviewRepository.deleteReview.mockReturnValue(samplePostReview);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    try {
      await reviewService.deleteReview(user3.userId, 12345);
    } catch (err) {
      expect(mockReviewRepository.findReviewId).toHaveBeenCalledTimes(1);
      expect(mockReviewRepository.deleteReview).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("해당하는 reviewId는 존재하지 않습니다.");
    }
  });

  test("deletePost Method Without Auth Fail", async () => {
    mockReviewRepository.findReviewId.mockReturnValue(samplePostReview);
    mockReviewRepository.deleteReview.mockReturnValue(samplePostReview);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    try {
      await reviewService.deleteReview(user1.userId, 3);
    } catch (err) {
      expect(mockReviewRepository.findReviewId).toHaveBeenCalledTimes(1);
      expect(mockReviewRepository.deleteReview).toHaveBeenCalledTimes(0);
      expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("권한이 없습니다.");
    }
  });
});

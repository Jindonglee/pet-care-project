// __tests__/unit/posts.service.unit.spec.js

import { expect, jest } from '@jest/globals';
import { ReviewService } from '../../../src/services/review.service';

// PostsRepository는 아래의 5개 메서드만 지원하고 있습니다.
let mockReviewRepository = {
  getReviews: jest.fn(),
  postReview: jest.fn(),
  patchReview: jest.fn(),
  deleteReview: jest.fn()
};

// postsService의 Repository를 Mock Repository로 의존성을 주입합니다.
let reviewService = new ReviewService(mockReviewRepository);

describe('Review Service Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  })

  test('getReviews Method Success', async () => {

  });

  test('getReviews Method Without orderValue Success', async () => {

  });

  test('getReviews Method Without sitterId Fail', async () => {

  });

  test('getReviews Method Wrong orderValue Fail', async () => {

  });

  test('getReviews Method Without sitterId Fail', async () => {

  });

  test('deletePost Method By Success', async () => {

  });

  test('deletePost Method By Not Found Post Error', async () => {

  });

  test('deletePost Method By Not Found Post Error', async () => {

  });

  test('deletePost Method By Not Found Post Error', async () => {

  });

  test('deletePost Method By Not Found Post Error', async () => {

  });

  test('deletePost Method By Not Found Post Error', async () => {

  });

  test('deletePost Method By Not Found Post Error', async () => {

  });

  test('deletePost Method By Not Found Post Error', async () => {

  });
});
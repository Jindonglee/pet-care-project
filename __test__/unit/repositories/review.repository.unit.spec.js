// __tests__/unit/posts.repository.unit.spec.js
import { PrismaClient } from '@prisma/client';
import { jest } from '@jest/globals';
import { ReviewRepository } from '../../../src/repositories/review.repository';

// Prisma 클라이언트에서는 아래 5개의 메서드만 사용합니다.
let mockPrisma = {
  petSitters: {
    findFirst: jest.fn(),
  },
  review: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let reviewRepository = new ReviewRepository(mockPrisma);

describe('Review Repository Unit Test', () => {
    let prisma;
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    prisma = new PrismaClient();
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  })




  test('getReviews Method', async () => {
    const mockReturn = 'getReviews String';
    mockPrisma.review.findMany.mockReturnValue(mockReturn);

    const reviews = await reviewRepository.getReviews();
    expect(reviews).toBe(mockReturn);
    expect(mockPrisma.review.findMany).toHaveBeenCalledTimes(1);
  });


  test('postReview Method', async () => {
    const mockReturn = 'postReview Return String';
    mockPrisma.review.create.mockReturnValue(mockReturn);
    const createReviewParams = {
        userId: 1,
        sitterId: 1,
        title: 'createReviewTitle',
        content: 'createReviewContent',
        rate: 'createReviewRate'
    }
    const createReviewData = await reviewRepository.postReview(
        createReviewParams.userId,
        createReviewParams.sitterId,
        createReviewParams.title,
        createReviewParams.content,
        createReviewParams.rate
    );
    expect(createReviewData).toEqual(mockReturn);
    expect(mockPrisma.review.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.review.create).toHaveBeenCalledWith({
        data: {
            userId:createReviewParams.userId,
            sitterId:createReviewParams.sitterId,
            title:createReviewParams.title,
            content:createReviewParams.content,
            rate:createReviewParams.rate
        }
    })
  });


  test('findSitterId method', async () => {
    const mockReturn = 'findSitterId String';
    mockPrisma.petSitters.findFirst.mockReturnValue(mockReturn);

    const findSitterParams = { sitterId: 1}
    const review = await reviewRepository.findSitterId(findSitterParams.sitterId);
    expect(review).toBe(mockReturn);
    expect(mockPrisma.petSitters.findFirst).toHaveBeenCalledTimes(1);
    expect(mockPrisma.petSitters.findFirst).toHaveBeenCalledWith({
        where: {
            sitterId:findSitterParams.sitterId,
        }
    })
  });


  test('findReviewId method', async () => {
    const mockReturn = 'findReviewId String';
    mockPrisma.review.findFirst.mockReturnValue(mockReturn);

    const findReviewParams = { reviewId: 1}
    const review = await reviewRepository.findReviewId(findReviewParams.reviewId);
    expect(review).toBe(mockReturn);
    expect(mockPrisma.review.findFirst).toHaveBeenCalledTimes(1);
    expect(mockPrisma.review.findFirst).toHaveBeenCalledWith({
        where: {
            reviewId:findReviewParams.reviewId,
        }
    })
  });


  test('patchReview method', async () => {
    const mockReturn = 'patchReview Return String';
    mockPrisma.review.update.mockReturnValue(mockReturn);
    const updateReviewParams = {
        reviewId: 1,
        title: 'updateReviewTitle',
        content: 'updateReviewContent',
        rate: 'updateReviewRate'
    }
    const updateReviewData = await reviewRepository.patchReview(
        updateReviewParams.reviewId,
        updateReviewParams.title,
        updateReviewParams.content,
        updateReviewParams.rate
    );
    expect(updateReviewData).toEqual(mockReturn);
    expect(mockPrisma.review.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.review.update).toHaveBeenCalledWith({
        data: {
            title:updateReviewParams.title,
            content:updateReviewParams.content,
            rate:updateReviewParams.rate
        },
        where: {
            reviewId:updateReviewParams.reviewId,
        }
    })

  });


  test('deleteReview method', async () => {
    const mockReturn = 'deleteReview String';
    mockPrisma.review.delete.mockReturnValue(mockReturn);

    const deleteReviewParams = { reviewId: 1}
    const reviews = await reviewRepository.deleteReview(deleteReviewParams.reviewId);
    expect(reviews).toBe(mockReturn);
    expect(mockPrisma.review.delete).toHaveBeenCalledTimes(1);
    expect(mockPrisma.review.delete).toHaveBeenCalledWith({
        where: {
            reviewId:deleteReviewParams.reviewId,
        }
    })
  });
});
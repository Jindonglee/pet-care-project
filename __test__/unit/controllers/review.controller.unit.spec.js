// __tests__/unit/posts.controller.unit.spec.js

import { jest } from '@jest/globals';
import { ReviewController } from '../../../src/controllers/review.controller';

const mockReviewService = {
  getReviews: jest.fn(),
  postReview: jest.fn(),
  patchReview: jest.fn(),
  deleteReview: jest.fn()
};

const mockRequest = {
  params: jest.fn(),
  query: jest.fn(),
  body: jest.fn(),
  user: jest.fn()
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

// postsController의 Service를 Mock Service로 의존성을 주입합니다.
const reviewController = new ReviewController(mockReviewService);


const sampleReviews= [
  {   
      "name": "김일번",
      "sitterId": 1,
      "reviewId": 1,
      "userId": 1,
      "title": "일번타이틀",
      "content": "일번컨텐트",
      "rate": "five",
      "createdAt": "2023-08-25T03:43:20.4532Z",
      "updatedAt": "2023-08-25T03:43:20.4532Z"
  },
  {
      "name": "김이번",
      "sitterId": 1,
      "reviewId": 2,
      "userId": 2,
      "title": "이번타이틀",
      "content": "이번컨텐트",
      "rate": "four",
      "createdAt": "2023-08-26T03:43:20.4532Z",
      "updatedAt": "2023-08-26T03:43:20.4532Z"
  }
];

const sampleReviewRequestBodyParams = {
  title: '타이틀값',
  content: '콘텐트값',
  rate: '레이트값'
};

const sampleUser =
  {
    "userId": 1,
    "name": "일유저",
    "email": "1email",
    "password": "1q2w3e4r",
    "createdAt": "2023-08-23T18:27:21.4532Z",
  }


describe('Reviews Controller Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status.mockReturnValue(mockResponse);
  });

  test('getReviews Method Success', async () => {
    mockRequest.params = sampleUser;
    mockRequest.query = {order:"desc"};
    mockReviewService.getReviews.mockReturnValue(sampleReviews);
    await reviewController.getReviews(mockRequest, mockResponse, mockNext);
    expect(mockReviewService.getReviews).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
        data: sampleReviews
    })
  });




  test('postReview Method Success', async () => {
    mockRequest.user = sampleUser;
    mockRequest.params = {sitterId :'1'};
    mockRequest.body = sampleReviewRequestBodyParams;
    const createReviewReturnValue = {
        reviewId: 1,
        ...sampleReviewRequestBodyParams,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString()
    }
    mockReviewService.postReview.mockReturnValue(createReviewReturnValue);
    await reviewController.postReview(mockRequest, mockResponse, mockNext);
    expect(mockReviewService.postReview).toHaveBeenCalledTimes(1);
    expect(mockReviewService.postReview).toHaveBeenCalledWith(
      sampleUser.userId,
      '1',
      sampleReviewRequestBodyParams.title,
      sampleReviewRequestBodyParams.content,
      sampleReviewRequestBodyParams.rate
    );
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
        data: createReviewReturnValue
    });
  });




  test('patchReview Method Success', async () => {
    mockRequest.user = sampleUser;
    mockRequest.params = {reviewId :'1'};
    mockRequest.body = sampleReviewRequestBodyParams;
    const patchReviewReturnValue = {
        reviewId: 1,
        ...sampleReviewRequestBodyParams,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString()
    }
    mockReviewService.patchReview.mockReturnValue(patchReviewReturnValue);
    await reviewController.patchReview(mockRequest, mockResponse, mockNext);
    expect(mockReviewService.patchReview).toHaveBeenCalledTimes(1);
    expect(mockReviewService.patchReview).toHaveBeenCalledWith(
      sampleUser.userId,
      '1',
      sampleReviewRequestBodyParams.title,
      sampleReviewRequestBodyParams.content,
      sampleReviewRequestBodyParams.rate
    );
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
        data: patchReviewReturnValue
    });
  });




  test('deleteReview Method Success', async () => {
    mockRequest.user = sampleUser;
    mockRequest.params = {reviewId :'1'};
    const patchReviewReturnValue = {
        reviewId: 1,
        ...sampleReviewRequestBodyParams,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString()
    }
    mockReviewService.deleteReview.mockReturnValue(patchReviewReturnValue);
    await reviewController.deleteReview(mockRequest, mockResponse, mockNext);
    expect(mockReviewService.deleteReview).toHaveBeenCalledTimes(1);
    expect(mockReviewService.deleteReview).toHaveBeenCalledWith(
      sampleUser.userId,
      '1',
    );
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
        data: patchReviewReturnValue
    });
  });
});
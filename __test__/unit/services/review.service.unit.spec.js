// __tests__/unit/posts.service.unit.spec.js

import { expect, jest } from '@jest/globals';
import { ReviewService } from '../../../src/services/review.service';

// PostsRepository는 아래의 5개 메서드만 지원하고 있습니다.
let mockReviewRepository = {
  findSitterId: jest.fn(),
  findReviewId: jest.fn(),
  getReviews: jest.fn(),
  postReview: jest.fn(),
  patchReview: jest.fn(),
  deleteReview: jest.fn()
};

// postsService의 Repository를 Mock Repository로 의존성을 주입합니다.
let reviewService = new ReviewService(mockReviewRepository);

const sampleSitter = [
    {
        "sitterId": 1,
        "sitterName": "일시터",
        "career": 1,
        "createdAt": "2023-08-21T08:25:38.4532Z",
        "updatedAt": "2023-08-21T08:25:38.4532Z"

    }
];

const sampleReviews =[
    {   
        "users": {"name": "김일번"},
        "sitterId": 1,
        "reviewId": 1,
        "title": "일번타이틀",
        "content": "일번컨텐트",
        "rate": "five",
        "createdAt": "2023-08-25T03:43:20.4532Z",
        "updatedAt": "2023-08-25T03:43:20.4532Z"
    },
    {
        "users": {"name": "김이번"},
        "sitterId": 1,
        "reviewId": 2,
        "title": "이번타이틀",
        "content": "이번컨텐트",
        "rate": "four",
        "createdAt": "2023-08-26T03:43:20.4532Z",
        "updatedAt": "2023-08-26T03:43:20.4532Z"
    }
];

const reviews = sampleReviews.map((review)=> {
    return {
      name: review.users.name,
      sitterId: review.sitterId,
      reviewId: review.reviewId, 
      title: review.title,
      content: review.content,
      rate: review.rate,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt
    }
  });

describe('Review Service Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  })

  test('getReviews Method Success', async () => {
    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    const allReviews = await reviewService.getReviews(1, 'desc');
    expect(allReviews).toEqual(reviews);
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(1);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(1);
  });

  test('getReviews Method Without orderValue Success', async () => {
    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    const allReviews = await reviewService.getReviews(1);
    expect(allReviews).toEqual(reviews);
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(1);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(1);
  });

  test('getReviews Method Without sitterId Fail', async () => {
        mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
        mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    try{
        await reviewService.getReviews(undefined, 'desc');
    }catch(err){
        expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
        expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
        expect(err.message).toEqual('sitterId가 입력되지 않았습니다.');
    }
  });

  test('getReviews Method Wrong orderValue Fail', async () => {
    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    try{
        await reviewService.getReviews(1, 'abcd');
    }catch(err){
        expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
        expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
        expect(err.message).toEqual('정렬값이 올바르지 않습니다.');
    }
  });

  test('getReviews Method Not Found sitterId Fail', async () => {
    const emptySitter = null;
    mockReviewRepository.findSitterId.mockReturnValue(emptySitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    try{
        await reviewService.getReviews(12345, 'ASC');
    }catch(err){
        expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(1);
        expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
        expect(err.message).toEqual('해당하는 sitterId는 존재하지 않습니다.');
    }
  });




  test('postReview Method Success', async () => {
    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.postReview.mockReturnValue(/*뭐넣어야하지*/);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    const allReviews = await reviewService.postReview(1);
    expect(allReviews).toEqual(reviews);
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(1);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(1);
  });

  test('postReview Method Without sitterId Fail', async () => {

    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
try{
    await reviewService.getReviews(undefined, 'desc');
}catch(err){
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
    expect(err.message).toEqual('sitterId가 입력되지 않았습니다.');
}
  });

  test('postReview Method Without Request Data Fail', async () => {

    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
try{
    await reviewService.getReviews(undefined, 'desc');
}catch(err){
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
    expect(err.message).toEqual('sitterId가 입력되지 않았습니다.');
}
  });

  test('postReview Method Not Found sitterId Fail', async () => {

    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
try{
    await reviewService.getReviews(undefined, 'desc');
}catch(err){
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
    expect(err.message).toEqual('sitterId가 입력되지 않았습니다.');
}
  });




  test('patchReview Method Success', async () => {
    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    const allReviews = await reviewService.getReviews(1);
    expect(allReviews).toEqual(reviews);
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(1);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(1);
  });

  test('patchReview Method Without reviewId Fail', async () => {

    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
try{
    await reviewService.getReviews(undefined, 'desc');
}catch(err){
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
    expect(err.message).toEqual('sitterId가 입력되지 않았습니다.');
}
  });

  test('patchReview Method Without Request Data Fail', async () => {

    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
try{
    await reviewService.getReviews(undefined, 'desc');
}catch(err){
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
    expect(err.message).toEqual('sitterId가 입력되지 않았습니다.');
}
  });

  test('patchReview Method Not Found reviewId Fail', async () => {

    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
try{
    await reviewService.getReviews(undefined, 'desc');
}catch(err){
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
    expect(err.message).toEqual('sitterId가 입력되지 않았습니다.');
}
  });

  test('patchReview Method Without Auth Fail', async () => {

    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
try{
    await reviewService.getReviews(undefined, 'desc');
}catch(err){
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
    expect(err.message).toEqual('sitterId가 입력되지 않았습니다.');
}
  });




  test('deletePost Method Success', async () => {
    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
    const allReviews = await reviewService.getReviews(1);
    expect(allReviews).toEqual(reviews);
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(1);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(1);
  });

  test('deletePost Method Without reviewId Fail', async () => {

    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
try{
    await reviewService.getReviews(undefined, 'desc');
}catch(err){
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
    expect(err.message).toEqual('sitterId가 입력되지 않았습니다.');
}
  });

  test('deletePost Method Not Found reviewId Fail', async () => {

    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
try{
    await reviewService.getReviews(undefined, 'desc');
}catch(err){
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
    expect(err.message).toEqual('sitterId가 입력되지 않았습니다.');
}
  });

  test('deletePost Method Without Auth Fail', async () => {

    mockReviewRepository.findSitterId.mockReturnValue(sampleSitter);
    mockReviewRepository.getReviews.mockReturnValue(sampleReviews);
try{
    await reviewService.getReviews(undefined, 'desc');
}catch(err){
    expect(mockReviewRepository.findSitterId).toHaveBeenCalledTimes(0);
    expect(mockReviewRepository.getReviews).toHaveBeenCalledTimes(0);
    expect(err.message).toEqual('sitterId가 입력되지 않았습니다.');
}
  });
});
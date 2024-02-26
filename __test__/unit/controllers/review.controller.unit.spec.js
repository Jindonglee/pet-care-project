// __tests__/unit/posts.controller.unit.spec.js

import { jest } from '@jest/globals';
import { ReviewController } from '../../../src/controllers/review.controller';

// posts.service.js 에서는 아래 5개의 Method만을 사용합니다.
const mockPostsService = {
  findAllPosts: jest.fn(),
  findPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

const mockRequest = {
  body: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

// postsController의 Service를 Mock Service로 의존성을 주입합니다.
const reviewController = new ReviewController(mockPostsService);

describe('Posts Controller Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status.mockReturnValue(mockResponse);
  });

  test('getPosts Method by Success', async () => {
    const samplePosts = [
      {
        postId: 2,
        nickname: 'Nickname_2',
        title: 'Title_2',
        createdAt: new Date('07 October 2011 15:50 UTC'),
        updatedAt: new Date('07 October 2011 15:50 UTC'),
      },
      {
        postId: 1,
        nickname: 'Nickname_1',
        title: 'Title_1',
        createdAt: new Date('06 October 2011 15:50 UTC'),
        updatedAt: new Date('06 October 2011 15:50 UTC'),
      },
    ];

    mockPostsService.findAllPosts.mockReturnValue(samplePosts);
    await postsController.getPosts(mockRequest, mockResponse, mockNext);
    expect(mockPostsService.findAllPosts).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
        data: samplePosts
    })
  });

  test('createPost Method by Success', async () => {
    const createPostRequestBodyParams = {
      nickname: 'Nickname_Success',
      password: 'Password_Success',
      title: 'Title_Success',
      content: 'Content_Success',
    };
    mockRequest.body = createPostRequestBodyParams;
    const createPostReturnValue = {
        postId: 1,
        ...createPostRequestBodyParams,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString()
    }
    mockPostsService.createPost.mockReturnValue(createPostReturnValue);
    await postsController.createPost(mockRequest, mockResponse, mockNext);
    expect(mockPostsService.createPost).toHaveBeenCalledTimes(1);
    expect(mockPostsService.createPost).toHaveBeenCalledWith(
        createPostRequestBodyParams.nickname,
        createPostRequestBodyParams.password,
        createPostRequestBodyParams.title,
        createPostRequestBodyParams.content
    );
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
        data: createPostReturnValue
    });
  });

  test('createPost Method by Invalid Params Error', async () => {
    mockRequest.body = {
      nickname: 'Nickname_InvalidParamsError',
      password: 'Password_InvalidParamsError',
    };
    await postsController.createPost(mockRequest, mockResponse, mockNext);
    
    expect(mockNext).toHaveBeenCalledWith(new Error("InvalidParamsError"));
  });

});
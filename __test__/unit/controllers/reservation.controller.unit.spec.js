import { jest } from '@jest/globals';
import { ReserveController } from '../../../src/controllers/reservation.controller.js';

const mockReserveService = {
  createReservation: jest.fn(),
  getReserveById: jest.fn(),
  updateReserve: jest.fn(),
  deleteReserve: jest.fn(),
};

const mockRequest = {
  user: { userId: 1 },
  body: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

const reserveController = new ReserveController(mockReserveService);

describe('Reserve Controller Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockResponse.status.mockReturnValue(mockResponse);
  });

  test('createReserve Method by Success', async () => {
    const sampleReserve = {
      reserveId: 1,
      userId: 1,
      sitterId: 2,
      reservation: new Date(),
      petInfo: '반려동물 정보',
      request: '요청',
    };

    mockReserveService.createReservation.mockReturnValue(sampleReserve);

    await reserveController.createReserve(mockRequest, mockResponse, mockNext);

    expect(mockReserveService.createReservation).toHaveBeenCalledTimes(1);
    expect(mockReserveService.createReservation).toHaveBeenCalledWith(
      mockRequest.user.userId,
      mockRequest.body.sitterId,
      expect.any(Date),
      mockRequest.body.petInfo,
      mockRequest.body.request
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    expect(mockResponse.json).toHaveBeenCalledWith({
      data: sampleReserve,
    });
  });

  test('createReserve Method non sitter', async () => {
    mockRequest.body = {
      sitterId: 40,
      reservation: '2024-03-01T12:00:00',
      petInfo: '반려동물 정보',
      request: '요청',
    };

    mockReserveService.createReservation.mockReturnValue('시터가 없습니다');

    await reserveController.createReserve(mockRequest, mockResponse, mockNext);

    expect(mockReserveService.createReservation).toHaveBeenCalledTimes(1);
    expect(mockReserveService.createReservation).toHaveBeenCalledWith(
      mockRequest.user.userId,
      mockRequest.body.sitterId,
      expect.any(Date),
      mockRequest.body.petInfo,
      mockRequest.body.request
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(404);

    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '존재하지 않는 펫시터입니다',
    });
  });

  test('createReserve already reserved', async () => {
    mockRequest.body = {
      sitterId: 2,
      reservation: '2024-03-01T12:00:00',
      petInfo: '반려동물 정보',
      request: '요청',
    };

    mockReserveService.createReservation.mockReturnValue('이미 예약이 됐습니다');

    await reserveController.createReserve(mockRequest, mockResponse, mockNext);

    expect(mockReserveService.createReservation).toHaveBeenCalledTimes(1);
    expect(mockReserveService.createReservation).toHaveBeenCalledWith(
      mockRequest.user.userId,
      mockRequest.body.sitterId,
      expect.any(Date),
      mockRequest.body.petInfo,
      mockRequest.body.request
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(404);

    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '이미 예약이 됐습니다',
    });
  });

  test('createReserve change date', async () => {
    mockRequest.body = {
      sitterId: 2,
      reservation: '2024-03-01T12:00:00',
      petInfo: '반려동물 정보',
      request: '요청',
    };

    mockReserveService.createReservation.mockReturnValue('다른 날짜를 선택하세요');

    await reserveController.createReserve(mockRequest, mockResponse, mockNext);

    expect(mockReserveService.createReservation).toHaveBeenCalledTimes(1);
    expect(mockReserveService.createReservation).toHaveBeenCalledWith(
      mockRequest.user.userId,
      mockRequest.body.sitterId,
      expect.any(Date),
      mockRequest.body.petInfo,
      mockRequest.body.request
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(400);

    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '다른 날짜를 선택하세요',
    });
  });

  test('getdetailreserve Method by success', async () => {
    const sampleReserve = {
      reserveId: 1,
      userId: 1,
      sitterId: 2,
      reservation: new Date(),
      petInfo: '반려동물 정보',
      request: '요청',
    };
  
    mockReserveService.getReserveById.mockReturnValue(sampleReserve);
  
    await reserveController.getdetailreserve(mockRequest, mockResponse, mockNext);
  
    expect(mockReserveService.getReserveById).toHaveBeenCalledTimes(1);
    expect(mockReserveService.getReserveById).toHaveBeenCalledWith(mockRequest.user.userId);
  
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: sampleReserve,
    });
  });

  test('getdetailreserve Non reserve', async () => {
    mockReserveService.getReserveById.mockReturnValue(null);
  
    await reserveController.getdetailreserve(mockRequest, mockResponse, mockNext);
  
    expect(mockReserveService.getReserveById).toHaveBeenCalledTimes(1);
    expect(mockReserveService.getReserveById).toHaveBeenCalledWith(mockRequest.user.userId);
  
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
  
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '예약 조회에 실패했습니다.',
    });
  });


  test('updateReserve Method by success', async () => {
    const sampleReserve = {
      reserveId: 1,
      userId: 1,
      sitterId: 2,
      reservation: new Date(),
      petInfo: '반려동물 정보',
      request: '요청',
    };
  
    mockRequest.body = {
      sitterId: 3,
      reservation: '2024-03-05T12:00:00',
      petInfo: '반려동물 정보',
      request: '요청',
    };
  
    mockReserveService.updateReserve.mockReturnValue(sampleReserve);
  
    await reserveController.updateReserve(mockRequest, mockResponse, mockNext);
  
    expect(mockReserveService.updateReserve).toHaveBeenCalledTimes(1);
    expect(mockReserveService.updateReserve).toHaveBeenCalledWith(
      mockRequest.user.userId,
      mockRequest.body.sitterId,
      expect.any(Date),
      mockRequest.body.petInfo,
      mockRequest.body.request
    );
  
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: sampleReserve,
    });
  });
  
  test('updateReserve change date', async () => {
    mockRequest.body = {
      sitterId: 2,
      reservation: '2024-03-01T12:00:00',
      petInfo: '반려동물 정보',
      request: '요청',
    };
  
    mockReserveService.updateReserve.mockReturnValue('다른 날짜를 선택하세요');
  
    await reserveController.updateReserve(mockRequest, mockResponse, mockNext);
  
    expect(mockReserveService.updateReserve).toHaveBeenCalledTimes(1);
    expect(mockReserveService.updateReserve).toHaveBeenCalledWith(
      mockRequest.user.userId,
      mockRequest.body.sitterId,
      expect.any(Date),
      mockRequest.body.petInfo,
      mockRequest.body.request
    );
  
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '다른 날짜를 선택하세요',
    });
  });
  
  test('updateReserve Non sitter', async () => {
    mockRequest.body = {
      sitterId: 2,
      reservation: '2024-03-01T12:00:00',
      petInfo: '반려동물 정보',
      request: '요청',
    };
  
    mockReserveService.updateReserve.mockReturnValue('시터가 없습니다');
  
    await reserveController.updateReserve(mockRequest, mockResponse, mockNext);
  
    expect(mockReserveService.updateReserve).toHaveBeenCalledTimes(1);
    expect(mockReserveService.updateReserve).toHaveBeenCalledWith(
      mockRequest.user.userId,
      mockRequest.body.sitterId,
      expect.any(Date),
      mockRequest.body.petInfo,
      mockRequest.body.request
    );
  
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '해당 시터가 없습니다',
    });
  });
  
  test('updateReserve Non reserve', async () => {
    mockRequest.body = {
      sitterId: 2,
      reservation: '2024-03-01T12:00:00',
      petInfo: '반려동물 정보',
      request: '요청',
    };
  
    mockReserveService.updateReserve.mockReturnValue('예약이 되어있지 않습니다');
  
    await reserveController.updateReserve(mockRequest, mockResponse, mockNext);
  
    expect(mockReserveService.updateReserve).toHaveBeenCalledTimes(1);
    expect(mockReserveService.updateReserve).toHaveBeenCalledWith(
      mockRequest.user.userId,
      mockRequest.body.sitterId,
      expect.any(Date),
      mockRequest.body.petInfo,
      mockRequest.body.request
    );
  
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '예약이 되어있지 않습니다',
    });
  });
  
  test('updateReserve Non state', async () => {
    mockRequest.body = {
      sitterId: 2,
      reservation: '2024-03-01T12:00:00',
      petInfo: '반려동물 정보',
      request: '요청',
    };
  
    mockReserveService.updateReserve.mockReturnValue('예약 수정은 확인 대기 중일 때만 가능합니다');
  
    await reserveController.updateReserve(mockRequest, mockResponse, mockNext);
  
    expect(mockReserveService.updateReserve).toHaveBeenCalledTimes(1);
    expect(mockReserveService.updateReserve).toHaveBeenCalledWith(
      mockRequest.user.userId,
      mockRequest.body.sitterId,
      expect.any(Date),
      mockRequest.body.petInfo,
      mockRequest.body.request
    );
  
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '예약 수정은 확인 대기 중일 때만 가능합니다',
    });
  });

  test('deleteReserve Method by success', async () => {
    mockReserveService.deleteReserve.mockReturnValue('예약이 삭제되었습니다');
  
    await reserveController.deleteReserve(mockRequest, mockResponse, mockNext);
  
    expect(mockReserveService.deleteReserve).toHaveBeenCalledTimes(1);
    expect(mockReserveService.deleteReserve).toHaveBeenCalledWith(mockRequest.user.userId);
  
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '예약이 삭제되었습니다',
    });
  });
  
  test('deleteReserve Non reserve', async () => {
    mockReserveService.deleteReserve.mockReturnValue('삭제할 예약이 없습니다');
  
    await reserveController.deleteReserve(mockRequest, mockResponse, mockNext);
  
    expect(mockReserveService.deleteReserve).toHaveBeenCalledTimes(1);
    expect(mockReserveService.deleteReserve).toHaveBeenCalledWith(mockRequest.user.userId);
  
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
  
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '삭제할 예약이 없습니다',
    });
  });
  
  test('deleteReserve wrong state', async () => {
    mockReserveService.deleteReserve.mockReturnValue('예약 수정은 확인 대기 중일 때만 가능합니다');
  
    await reserveController.deleteReserve(mockRequest, mockResponse, mockNext);
  
    expect(mockReserveService.deleteReserve).toHaveBeenCalledTimes(1);
    expect(mockReserveService.deleteReserve).toHaveBeenCalledWith(mockRequest.user.userId);
  
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '예약 수정은 확인 대기 중일 때만 가능합니다',
    });
  });


});

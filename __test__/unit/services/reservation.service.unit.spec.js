import { jest } from '@jest/globals';
import { ReserveService } from '../../../src/services/reservation.service.js';

let mockReserveRepository = {
    createReservation: jest.fn(),
    checkDate: jest.fn(),
    ExitReservation: jest.fn(),
    findSitter: jest.fn(),
    getReserveById: jest.fn(),
    findReservation: jest.fn(),
    checkState: jest.fn(),
    updateReserve: jest.fn(),
    deleteReserve: jest.fn()
};

let reserveService = new ReserveService(mockReserveRepository);

describe('Reserve Service Unit Test', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    })

    test('createReservation Method with Existing Sitter', async () => {
        const sampleReserve = {
            userId: 1,
            sitterId: 2,
            reservation: '2024-05-13T14:00:00.000Z',
            petInfo: '소형견, 5kg, 말티즈',
            request: '잘 보살펴주세요',
        };


        // 시터가 있음
        mockReserveRepository.findSitter.mockReturnValue(true);

        // 예약이 없음
        mockReserveRepository.ExitReservation.mockReturnValue(false);

        // 날짜가 안겹침
        mockReserveRepository.checkDate.mockReturnValue(false);

        const createdReservation = { postId: 1, ...sampleReserve };

        mockReserveRepository.createReservation.mockReturnValue(createdReservation);

        const result = await reserveService.createReservation(
            sampleReserve.userId,
            sampleReserve.sitterId,
            sampleReserve.reservation,
            sampleReserve.petInfo,
            sampleReserve.request,
        );

        expect(mockReserveRepository.findSitter).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.ExitReservation).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkDate).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.createReservation).toHaveBeenCalledTimes(1);

        expect(mockReserveRepository.createReservation).toHaveBeenCalledWith(
            sampleReserve.userId,
            sampleReserve.sitterId,
            sampleReserve.reservation,
            sampleReserve.petInfo,
            sampleReserve.request,
        );

        expect(result).toEqual(createdReservation);
    });

    test('createReservation Method with Non-existing Sitter', async () => {

        const sampleReserve = {
            userId: 1,
            sitterId: 2,
            reservation: '2024-05-13T14:00:00.000Z',
            petInfo: '소형견, 5kg, 말티즈',
            request: '잘 보살펴주세요',
        };

        // 펫시터가 존재 x
        mockReserveRepository.findSitter.mockReturnValue(false);

        const result = await reserveService.createReservation(
            sampleReserve.userId,
            sampleReserve.sitterId,
            sampleReserve.reservation,
            sampleReserve.petInfo,
            sampleReserve.request,
        );

        expect(mockReserveRepository.findSitter).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.ExitReservation).not.toHaveBeenCalled();
        expect(mockReserveRepository.checkDate).not.toHaveBeenCalled();
        expect(mockReserveRepository.createReservation).not.toHaveBeenCalled();


        expect(result).toBe('시터가 없습니다');
    });

    test('createReservation Method with Existing Reservation', async () => {

        const sampleReserve = {
            userId: 1,
            sitterId: 2,
            reservation: '2024-05-13T14:00:00.000Z',
            petInfo: '소형견, 5kg, 말티즈',
            request: '잘 보살펴주세요',
        };

        // 펫시터 있음
        mockReserveRepository.findSitter.mockReturnValue(true);

        // 예약이 이미 됨
        mockReserveRepository.ExitReservation.mockReturnValue(true);

        const result = await reserveService.createReservation(
            sampleReserve.userId,
            sampleReserve.sitterId,
            sampleReserve.reservation,
            sampleReserve.petInfo,
            sampleReserve.request,
        );

        expect(mockReserveRepository.findSitter).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.ExitReservation).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkDate).not.toHaveBeenCalled();
        expect(mockReserveRepository.createReservation).not.toHaveBeenCalled();

        expect(result).toBe('이미 예약이 됐습니다');
    });

    test('createReservation Method with Overlapping Dates', async () => {

        const sampleReserve = {
            userId: 1,
            sitterId: 2,
            reservation: '2024-05-13T14:00:00.000Z',
            petInfo: '소형견, 5kg, 말티즈',
            request: '잘 보살펴주세요',
        };

        // 펫시터 있음
        mockReserveRepository.findSitter.mockReturnValue(true);

        // 예약이 안되어있음
        mockReserveRepository.ExitReservation.mockReturnValue(false);

        // 날짜 중복 
        mockReserveRepository.checkDate.mockReturnValue(true);

        const result = await reserveService.createReservation(
            sampleReserve.userId,
            sampleReserve.sitterId,
            sampleReserve.reservation,
            sampleReserve.petInfo,
            sampleReserve.request,
        );

        expect(mockReserveRepository.findSitter).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.ExitReservation).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkDate).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.createReservation).not.toHaveBeenCalled();

        expect(result).toBe('다른 날짜를 선택하세요');
    });


    test('getReserveById Method Existing Reservation', async () => {

        const userId = 1;

        const sampleReserve = {
            postId: 1,
            userId,
            sitterId: 2,
            reservation: '2024-05-13T14:00:00.000Z',
            petInfo: '소형견, 5kg, 말티즈',
            request: '잘 보살펴주세요'
        };

        mockReserveRepository.getReserveById.mockReturnValue(sampleReserve);

        const result = await reserveService.getReserveById(userId);

        expect(mockReserveRepository.getReserveById).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.getReserveById).toHaveBeenCalledWith(userId);

        expect(result).toEqual(sampleReserve);
    });

    test('getReserveById Method Non-existing Reservation', async () => {

        const userId = 1;

        mockReserveRepository.getReserveById.mockReturnValue(null);

        const result = await reserveService.getReserveById(userId);

        expect(mockReserveRepository.getReserveById).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.getReserveById).toHaveBeenCalledWith(userId);

        expect(result).toBeNull();
    });

    test('updateReserve Method with Valid Data', async () => {

        const sampleReserve = {
            userId: 1,
            sitterId: 2,
            reservation: '2024-05-13T14:00:00.000Z',
            petInfo: '소형견, 5kg, 말티즈',
            request: '잘 보살펴주세요',
        };

        // 시터가 있음
        mockReserveRepository.findSitter.mockReturnValue(true);

        // 날짜가 안겹침
        mockReserveRepository.checkDate.mockReturnValue(false);

        // 예약이 있음
        mockReserveRepository.findReservation.mockReturnValue({
            postId: 1,
            userId: 1,
            sitterId: 3,
            reservation: '2024-05-11T14:00:00.000Z',
            petInfo: '소형견, 5kg, 말티즈',
            request: '잘 보살펴주세요',
        });

        // 예약 상태가 확인 대기 중
        mockReserveRepository.checkState.mockReturnValue({ reserveState: '확인 대기 중' });

        const updatedReserve = { postId: 1, ...sampleReserve };
        mockReserveRepository.updateReserve.mockReturnValue(updatedReserve);

        const result = await reserveService.updateReserve(
            sampleReserve.userId,
            sampleReserve.sitterId,
            sampleReserve.reservation,
            sampleReserve.petInfo,
            sampleReserve.request,
        );

        expect(mockReserveRepository.findSitter).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkDate).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.findReservation).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkState).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.updateReserve).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.updateReserve).toHaveBeenCalledWith(
            1,
            sampleReserve.sitterId,
            sampleReserve.reservation,
            sampleReserve.petInfo,
            sampleReserve.request,
        );


        expect(result).toEqual(updatedReserve);
    });


    test('updateReserve Method Non-existing sitter', async () => {

        const sampleReserve = {
            userId: 1,
            sitterId: 2,
            reservation: '2024-05-13T14:00:00.000Z',
            petInfo: '소형견, 5kg, 말티즈',
            request: '잘 보살펴주세요',
        };

        // 시터가 없음
        mockReserveRepository.findSitter.mockReturnValue(false);

        const result = await reserveService.updateReserve(
            sampleReserve.userId,
            sampleReserve.sitterId,
            sampleReserve.reservation,
            sampleReserve.petInfo,
            sampleReserve.request,
        );

        expect(mockReserveRepository.findSitter).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkDate).not.toHaveBeenCalled();
        expect(mockReserveRepository.findReservation).not.toHaveBeenCalled();
        expect(mockReserveRepository.checkState).not.toHaveBeenCalled();
        expect(mockReserveRepository.updateReserve).not.toHaveBeenCalled();


        expect(result).toEqual("시터가 없습니다");
    });

    test('updateReserve Method with No Existing Reservation', async () => {
        const sampleReserve = {
            userId: 1,
            sitterId: 2,
            reservation: '2024-05-13T14:00:00.000Z',
            petInfo: '소형견, 5kg, 말티즈',
            request: '잘 보살펴주세요',
        };

        // 시터가 있음
        mockReserveRepository.findSitter.mockReturnValue(true);

        // 날짜가 안겹침
        mockReserveRepository.checkDate.mockReturnValue(false);

        // 예약이 없음
        mockReserveRepository.findReservation.mockReturnValue(null);

        // 서비스 메서드 호출
        const result = await reserveService.updateReserve(
            sampleReserve.userId,
            sampleReserve.sitterId,
            sampleReserve.reservation,
            sampleReserve.petInfo,
            sampleReserve.request,
        );

        // 각 메서드가 가짜 데이터로 호출되었는지 확인
        expect(mockReserveRepository.findSitter).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkDate).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.findReservation).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkState).not.toHaveBeenCalled(); 
        expect(mockReserveRepository.updateReserve).not.toHaveBeenCalled(); 
        expect(result).toEqual("예약이 되어있지 않습니다");
    });

    test('updateReserve Method with Overlapping Dates', async () => {
        const sampleReserve = {
            userId: 1,
            sitterId: 2,
            reservation: '2024-05-13T14:00:00.000Z',
            petInfo: '소형견, 5kg, 말티즈',
            request: '잘 보살펴주세요',
        };

        mockReserveRepository.findSitter.mockReturnValue(true);

        mockReserveRepository.checkDate.mockReturnValue(true);

        const result = await reserveService.updateReserve(
            sampleReserve.userId,
            sampleReserve.sitterId,
            sampleReserve.reservation,
            sampleReserve.petInfo,
            sampleReserve.request,
        );

        expect(mockReserveRepository.findSitter).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkDate).toHaveBeenCalledTimes(1);

        expect(mockReserveRepository.findReservation).not.toHaveBeenCalled();
        expect(mockReserveRepository.checkState).not.toHaveBeenCalled();
        expect(mockReserveRepository.updateReserve).not.toHaveBeenCalled();

        expect(result).toEqual("다른 날짜를 선택하세요");
    });

    test('updateReserve Method with Non-Confirming State', async () => {
        const sampleReserve = {
            userId: 1,
            sitterId: 2,
            reservation: '2024-05-13T14:00:00.000Z',
            petInfo: '소형견, 5kg, 말티즈',
            request: '잘 보살펴주세요',
        };

        mockReserveRepository.findSitter.mockReturnValue(true);

        mockReserveRepository.checkDate.mockReturnValue(false);

        mockReserveRepository.findReservation.mockReturnValue(true);

        mockReserveRepository.checkState.mockReturnValue({ reserveState: '돌봄 완료' });

        const result = await reserveService.updateReserve(
            sampleReserve.userId,
            sampleReserve.sitterId,
            sampleReserve.reservation,
            sampleReserve.petInfo,
            sampleReserve.request,
        );

        expect(mockReserveRepository.findSitter).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkDate).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.findReservation).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkState).toHaveBeenCalledTimes(1);

        expect(mockReserveRepository.updateReserve).not.toHaveBeenCalled();

        expect(result).toEqual("예약 수정은 확인 대기 중일 때만 가능합니다");
    });



    // 예약이 없는 경우
    test('updateReserve Method with No Existing Reservation', async () => {
        const sampleReserve = {
            userId: 1,
            sitterId: 2,
            reservation: '2024-05-13T14:00:00.000Z',
            petInfo: '소형견, 5kg, 말티즈',
            request: '잘 보살펴주세요',
        };

        mockReserveRepository.findSitter.mockReturnValue(true);

        mockReserveRepository.checkDate.mockReturnValue(false);

        mockReserveRepository.findReservation.mockReturnValue(null);

        const result = await reserveService.updateReserve(
            sampleReserve.userId,
            sampleReserve.sitterId,
            sampleReserve.reservation,
            sampleReserve.petInfo,
            sampleReserve.request,
        );

        expect(mockReserveRepository.findSitter).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkDate).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.findReservation).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkState).not.toHaveBeenCalled(); 
        expect(mockReserveRepository.updateReserve).not.toHaveBeenCalled(); 
        expect(result).toEqual("예약이 되어있지 않습니다");
    });

    test('deleteReserve Method with Non-Confirming State', async () => {
        const userId = 1;

        mockReserveRepository.findReservation.mockReturnValue(false);

        const result = await reserveService.deleteReserve(userId);

        expect(mockReserveRepository.findReservation).toHaveBeenCalledTimes(1);

        expect(mockReserveRepository.checkState).not.toHaveBeenCalled();
        expect(mockReserveRepository.deleteReserve).not.toHaveBeenCalled();

        expect(result).toEqual("삭제할 예약이 없습니다");
    });

    test('deleteReserve Method with Non-Confirming State', async () => {
        const userId = 1;

        mockReserveRepository.findReservation.mockReturnValue(true);

        mockReserveRepository.checkState.mockReturnValue({ reserveState: '돌봄 완료' });

        const result = await reserveService.deleteReserve(userId);

        expect(mockReserveRepository.findReservation).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkState).toHaveBeenCalledTimes(1);

        expect(mockReserveRepository.deleteReserve).not.toHaveBeenCalled();

        expect(result).toEqual("예약 수정은 확인 대기 중일 때만 가능합니다");
    });

    test('deleteReserve Method with Confirming State', async () => {
        const userId = 1;
    
        mockReserveRepository.findReservation.mockReturnValue(true);
    
        mockReserveRepository.checkState.mockReturnValue({ reserveState: '확인 대기 중' });
    
        const deletedReserveInfo = { 
            postId: 1,
            sitterId: 2,
            userId: 1,
            reservation: '2024-05-13T14:00:00.000Z',
            petInfo: '소형견, 5kg, 말티즈',
            request: '잘 보살펴주세요',
        };
        mockReserveRepository.deleteReserve.mockReturnValue(deletedReserveInfo);
    
        const result = await reserveService.deleteReserve(userId);
    
        expect(mockReserveRepository.findReservation).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.checkState).toHaveBeenCalledTimes(1);
        expect(mockReserveRepository.deleteReserve).toHaveBeenCalledTimes(1);
    
        expect(result).toEqual(deletedReserveInfo);
    });
    


});

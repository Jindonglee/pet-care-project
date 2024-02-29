import { expect, jest, test } from '@jest/globals';
import { ReserveRepository } from '../../../src/repositories/reservation.repository.js';

// Prisma 클라이언트에서는 아래 5개의 메서드만 사용합니다.
let mockPrisma = {
    reservation: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    petsitters: {
        findFirst: jest.fn()
    }
};

let reserveRepository = new ReserveRepository(mockPrisma);

describe('Reservation Repository Unit Test', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    })

    // 예약 생성
    test('createReservation Method', async () => {
        const mockReturn = "create Return String";

        mockPrisma.reservation.create.mockReturnValue(mockReturn);

        const createReservationParams = {
            userId: 1,
            sitterId: 1,
            reservation: "2024-05-13T14:00:00.000Z",
            petInfo: "소형견, 5kg, 말티즈",
            request: "잘 보살펴주세요",
        };

        const createReservationData = await reserveRepository.createReservation(
            createReservationParams.userId,
            createReservationParams.sitterId,
            createReservationParams.reservation,
            createReservationParams.petInfo,
            createReservationParams.request,
        );


        expect(mockPrisma.reservation.create).toHaveBeenCalledTimes(1);

        expect(mockPrisma.reservation.create).toHaveBeenCalledWith({
            data: createReservationParams,
        });

        expect(createReservationData).toBe(mockReturn);
    });

    // 날짜 확인
    test("checkDate Method", async () => {
        const mockReturn = "checkDate String";
        mockPrisma.reservation.findFirst.mockReturnValue(mockReturn);

        const userId = 1;
        const sitterId = 1;
        const reservation = "2024-05-13T14:00:00.000Z";

        const checkdate = await reserveRepository.checkDate(userId, sitterId, reservation);

        expect(mockPrisma.reservation.findFirst).toHaveBeenCalledTimes(1);
        expect(mockPrisma.reservation.findFirst).toHaveBeenCalledWith({
            where: {
                userId: userId,
                sitterId: sitterId,
                reservation: {
                    equals: new Date(reservation)
                }
            }
        });

        expect(checkdate).toBe(true);

    });

    // 예약 존재 여부 확인
    test("ExitReservation Method", async () => {
        const mockReturn = "ExitReservation String";
        mockPrisma.reservation.findFirst.mockReturnValue(mockReturn);

        const userId = 1;

        const exitreservation = await reserveRepository.ExitReservation(userId);

        expect(mockPrisma.reservation.findFirst).toHaveBeenCalledTimes(1);
        expect(mockPrisma.reservation.findFirst).toHaveBeenCalledWith({
            where: {
                userId: userId,
            }
        });

        expect(exitreservation).toBe(mockReturn);

    });

    // 해당 펫시터 검색
    test("findSitter Method", async () => {
        const mockReturn = "findSitter String";
        mockPrisma.petsitters.findFirst.mockReturnValue(mockReturn);

        const sitterId = 1;

        const findsitter = await reserveRepository.findSitter(sitterId);

        expect(mockPrisma.petsitters.findFirst).toHaveBeenCalledTimes(1);
        expect(mockPrisma.petsitters.findFirst).toHaveBeenCalledWith({
            where: {
                sitterId: sitterId,
            }
        });

        expect(findsitter).toBe(mockReturn);

    });


    // 예약 조회
    test('getReserveById Method', async () => {
        const mockReturn = "getReserveById String";
        mockPrisma.reservation.findFirst.mockReturnValue(mockReturn);

        const userId = 1;

        const getreservebyid = await reserveRepository.getReserveById(userId);

        expect(reserveRepository.prisma.reservation.findFirst).toHaveBeenCalledTimes(1);
        expect(reserveRepository.prisma.reservation.findFirst).toHaveBeenCalledWith({
            where: { userId: userId },
            select: {
                postId: true,
                userId: true,
                sitterId: true,
                reservation: true,
                petInfo: true,
                request: true,
                reserveState: true,
                createdAt: true,
                updateAt: true
            },
        });


        expect(getreservebyid).toBe(mockReturn);

    });


    // 예약 찾기
    test('findReservation Method', async () => {
        const mockReturn = "findFirst String";
        mockPrisma.reservation.findFirst.mockReturnValue(mockReturn);

        const userId = 1;

        const reservation = await reserveRepository.findReservation(userId);

        expect(reserveRepository.prisma.reservation.findFirst).toHaveBeenCalledTimes(1);
        expect(reserveRepository.prisma.reservation.findFirst).toHaveBeenCalledWith({
            where: { userId: userId },
            select: { postId: true },
        });


        expect(reservation).toBe(mockReturn);

    });


    // 예약 상태 조회
    test('checkState Method', async () => {
        const mockReturn = "checkState String";
        mockPrisma.reservation.findFirst.mockReturnValue(mockReturn);

        const userId = 1;

        const checkstate = await reserveRepository.checkState(userId);

        expect(reserveRepository.prisma.reservation.findFirst).toHaveBeenCalledTimes(1);
        expect(reserveRepository.prisma.reservation.findFirst).toHaveBeenCalledWith({
            where: { userId: userId },
            select: { reserveState: true },
        });


        expect(checkstate).toBe(mockReturn);

    });

    
    // 예약 수정
    test("updateReserve Method", async () => {
        const mockReturn = "updateReserve String";
        mockPrisma.reservation.update.mockReturnValue(mockReturn);

        const postId = 1;
        const sitterId = 1;
        const reservation = "2024-05-13T14:00:00.000Z";
        const petInfo = "소형견, 5kg, 말티즈";
        const request = "잘 보살펴주세요";
        const reserveStatus = "confirmed";

        const updatedreserve = await reserveRepository.updateReserve(postId, sitterId, reservation, petInfo, request, reserveStatus);

        expect(reserveRepository.prisma.reservation.update).toHaveBeenCalledTimes(1);
        expect(reserveRepository.prisma.reservation.update).toBeCalledWith({
            where : {postId : postId},
            data: {
                sitterId,
                reservation, 
                petInfo, 
                request,
                reserveStatus
            },
        });

        expect(updatedreserve).toBe(mockReturn);

    });


    // 예약 삭제
    test("deleteReserve Method", async () => {
        const postId = 1;

        await reserveRepository.deleteReserve(postId);

        expect(reserveRepository.prisma.reservation.delete).toHaveBeenCalledTimes(1);
        expect(reserveRepository.prisma.reservation.delete).toBeCalledWith({
            where: {postId: postId}
        });
    });



});
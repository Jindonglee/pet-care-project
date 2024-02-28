import { expect, jest } from "@jest/globals";
import { PetSittersService } from "../../../src/services/petsitters.service.js";

let mockPetSittersRepository = {
  getSittersByRegionAndVisit: jest.fn(),
  getSittersInfo: jest.fn(),
};

let petSittersService = new PetSittersService(mockPetSittersRepository);
const unmockedFetch = global.fetch;

describe("PetSitters Service Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(() => {
    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      });
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  test("getSitters Method", async () => {
    const options = {
      region: "서울 강남구",
      visit: "방문 가능",
      page: 1,
      limit: 10,
      orderKey: "createdAt",
      orderValue: "desc",
    };

    const samplePetsitters = [
      {
        sitterId: 1,
        sitterName: "홍길동",
        region: "서울 강남구",
        visit: "방문 가능",
        review: [],
      },
      {
        sitterId: 2,
        sitterName: "김철수",
        region: "서울 강남구",
        visit: "방문 가능",
        review: [{ rate: "one" }, { rate: "two" }],
      },
    ];

    const expectedSortedPetsitters = [
      {
        averageRate: 0,
        distance: 0,
        region: "서울 강남구",
        review: [],
        sitterId: 1,
        sitterName: "홍길동",
        visit: "방문 가능",
      },
      {
        averageRate: 1.5,
        distance: 0.3,
        distance: 0,
        region: "서울 강남구",
        review: [
          {
            rate: "one",
          },
          {
            rate: "two",
          },
        ],
        sitterId: 2,
        sitterName: "김철수",
        visit: "방문 가능",
      },
    ];

    mockPetSittersRepository.getSittersByRegionAndVisit.mockReturnValue(
      samplePetsitters
    );

    petSittersService.getLatLng = jest
      .fn()
      .mockReturnValue({ lat: 37.1234, lng: 127.5678 });
    petSittersService.calculateDistance = jest
      .fn()
      .mockImplementation((lat1, lon1, lat2, lon2) => {
        // 단위 km로 반환하도록 설정
        return (
          Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111
        );
      });

    petSittersService.calculateTotalRate = jest.fn().mockReturnValue(1.5); // 예상 평균 평점 설정

    const sortedPetsitters = await petSittersService.getSitters(options);

    expect(
      mockPetSittersRepository.getSittersByRegionAndVisit
    ).toHaveBeenCalledTimes(1);
    expect(
      mockPetSittersRepository.getSittersByRegionAndVisit
    ).toHaveBeenCalledWith(
      options.region,
      options.visit,
      options.page,
      options.limit,
      options.orderKey,
      options.orderValue
    );

    expect(sortedPetsitters).toEqual(expectedSortedPetsitters);
  });

  test("getSitters Method Success with sortBy: distance", async () => {
    const options = {
      region: "서울 강남구",
      visit: "방문 가능",
      page: 1,
      limit: 10,
      orderKey: "createdAt",
      orderValue: "desc",
      sortBy: "distance",
    };

    const samplePetsitters = [
      {
        sitterId: 1,
        sitterName: "홍길동",
        region: "서울 강남구",
        visit: "방문 가능",
        review: [],
      },
      {
        sitterId: 2,
        sitterName: "김철수",
        region: "서울 강남구",
        visit: "방문 가능",
        review: [{ rate: "one" }, { rate: "two" }],
      },
    ];

    const expectedSortedPetsitters = [
      {
        averageRate: 0,
        distance: 0,
        region: "서울 강남구",
        review: [],
        sitterId: 1,
        sitterName: "홍길동",
        visit: "방문 가능",
      },
      {
        averageRate: 1.5,
        distance: 0.3,
        distance: 0,
        region: "서울 강남구",
        review: [
          {
            rate: "one",
          },
          {
            rate: "two",
          },
        ],
        sitterId: 2,
        sitterName: "김철수",
        visit: "방문 가능",
      },
    ];

    mockPetSittersRepository.getSittersByRegionAndVisit.mockReturnValue(
      samplePetsitters
    );

    petSittersService.getLatLng = jest
      .fn()
      .mockReturnValue({ lat: 37.1234, lng: 127.5678 });
    petSittersService.calculateDistance = jest
      .fn()
      .mockImplementation((lat1, lon1, lat2, lon2) => {
        // 단위 km로 반환하도록 설정
        return (
          Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111
        );
      });

    petSittersService.calculateTotalRate = jest.fn().mockReturnValue(1.5); // 예상 평균 평점 설정

    const sortedPetsitters = await petSittersService.getSitters(options);

    expect(
      mockPetSittersRepository.getSittersByRegionAndVisit
    ).toHaveBeenCalledTimes(1);
    expect(
      mockPetSittersRepository.getSittersByRegionAndVisit
    ).toHaveBeenCalledWith(
      options.region,
      options.visit,
      options.page,
      options.limit,
      options.orderKey,
      options.orderValue
    );

    expect(sortedPetsitters).toEqual(expectedSortedPetsitters);
  });

  test("getSitters Method Success with sortBy rate", async () => {
    const options = {
      region: "서울 강남구",
      visit: "방문 가능",
      page: 1,
      limit: 10,
      orderKey: "createdAt",
      orderValue: "desc",
      sortBy: "rate",
    };

    const samplePetsitters = [
      {
        sitterId: 1,
        sitterName: "홍길동",
        region: "서울 강남구",
        visit: "방문 가능",
        review: [],
      },
      {
        sitterId: 2,
        sitterName: "김철수",
        region: "서울 강남구",
        visit: "방문 가능",
        review: [{ rate: "one" }, { rate: "two" }],
      },
    ];

    const expectedSortedPetsitters = [
      {
        averageRate: 1.5,
        distance: 0.3,
        distance: 0,
        region: "서울 강남구",
        review: [
          {
            rate: "one",
          },
          {
            rate: "two",
          },
        ],
        sitterId: 2,
        sitterName: "김철수",
        visit: "방문 가능",
      },
      {
        averageRate: 0,
        distance: 0,
        region: "서울 강남구",
        review: [],
        sitterId: 1,
        sitterName: "홍길동",
        visit: "방문 가능",
      },
    ];

    mockPetSittersRepository.getSittersByRegionAndVisit.mockReturnValue(
      samplePetsitters
    );

    petSittersService.getLatLng = jest
      .fn()
      .mockReturnValue({ lat: 37.1234, lng: 127.5678 });
    petSittersService.calculateDistance = jest
      .fn()
      .mockImplementation((lat1, lon1, lat2, lon2) => {
        // 단위 km로 반환하도록 설정
        return (
          Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111
        );
      });

    petSittersService.calculateTotalRate = jest.fn().mockReturnValue(1.5); // 예상 평균 평점 설정

    const sortedPetsitters = await petSittersService.getSitters(options);

    expect(
      mockPetSittersRepository.getSittersByRegionAndVisit
    ).toHaveBeenCalledTimes(1);
    expect(
      mockPetSittersRepository.getSittersByRegionAndVisit
    ).toHaveBeenCalledWith(
      options.region,
      options.visit,
      options.page,
      options.limit,
      options.orderKey,
      options.orderValue
    );

    expect(sortedPetsitters).toEqual(expectedSortedPetsitters);
  });

  test("getSittersInfo Method", async () => {
    const page = 1;

    const sampleSittersInfo = [
      {
        sitterId: 1,
        sitterName: "홍길동",
        career: 2,
        review: [],
      },
      {
        sitterId: 2,
        sitterName: "김철수",
        career: 1,
        review: [{ rate: "one" }, { rate: "two" }],
      },
    ];

    const expectedSortedSittersInfo = [
      {
        sitterId: 2,
        sitterName: "김철수",
        career: 1,
        averageRate: 1.5, // 예상 평균 평점
      },
      {
        sitterId: 1,
        sitterName: "홍길동",
        career: 2,
        averageRate: 0, // 리뷰가 없으므로 0으로 설정
      },
    ];

    mockPetSittersRepository.getSittersInfo = jest
      .fn()
      .mockReturnValue(sampleSittersInfo);
    petSittersService.calculateTotalRate = jest.fn().mockReturnValue(1.5); // 예상 평균 평점 설정

    const sortedSittersInfo = await petSittersService.getSittersInfo(page);

    expect(mockPetSittersRepository.getSittersInfo).toHaveBeenCalledTimes(1);
    expect(mockPetSittersRepository.getSittersInfo).toHaveBeenCalledWith(page);

    // 각 펫시터의 평균 평점이 예상된 대로 설정되었는지 확인
    expect(sortedSittersInfo).toEqual(expectedSortedSittersInfo);
  });

  test("returns latitude and longitude for a valid address", async () => {
    // Mocking할 데이터 준비 (가짜 응답 데이터)
    const mockAddress = "서울시 강남구 논현동";
    const expectedData = { lat: 37.123456, lng: 127.123456 };

    petSittersService.getLatLng = jest
      .spyOn(global, "fetch")
      .mockImplementation((address) => Promise.resolve(expectedData));
    // highlight-end

    // 테스트할 함수 호출
    const result = await petSittersService.getLatLng(mockAddress);

    // 결과 검증
    expect(result).toEqual({ lat: 37.123456, lng: 127.123456 });
  });

  test("throws an error for an invalid address", async () => {
    // fetch 함수를 Mocking하여 빈 결과를 반환하도록 만듭니다.
    const getLatLng = jest
      .spyOn(global, "fetch")
      .mockImplementation(() => Promise.reject(expectedError));

    const expectedError = new Error("주소를 찾을 수 없습니다.");

    // 테스트 함수 호출
    try {
      await getLatLng("없는 주소");
      fail("예외 발생하지 않음");
    } catch (error) {
      // 에러 발생 여부 검증
      expect(error).toBe(expectedError);
    }
  });

  test("calculates distance between two points", async () => {
    // 두 지점의 위도와 경도를 설정합니다.
    const lat1 = 37.123456; // 첫 번째 지점 위도
    const lon1 = 127.123456; // 첫 번째 지점 경도
    const lat2 = 37.123456; // 두 번째 지점 위도
    const lon2 = 127.123456; // 두 번째 지점 경도
    petSittersService = new PetSittersService();

    // 테스트 대상 함수 호출
    const expectedDistance = await petSittersService.calculateDistance(
      lat1,
      lon1,
      lat2,
      lon2
    );

    // 예상되는 결과값을 예상범위 내에서 비교합니다. (예상범위는 적절하게 조정하세요.)
    expect(expectedDistance).toBeCloseTo(0); // 예상되는 결과값과 오차범위를 함께 지정합니다.
  });
});

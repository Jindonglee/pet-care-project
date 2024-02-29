import { PetSittersRepository } from "../../../src/repositories/petsitters.repository.js"; // PetSittersRepository 파일의 경로를 정확히 지정해주세요
import { jest } from "@jest/globals";

describe("PetSittersRepository", () => {
  let mockPrisma;
  let petSittersRepository;

  beforeEach(() => {
    mockPrisma = {
      petsitters: {
        findMany: jest.fn(),
      },
    };
    petSittersRepository = new PetSittersRepository(mockPrisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getSittersByRegionAndVisit", () => {
    it("should fetch pet sitters by region and visit", async () => {
      const mockResults = [
        { sitterId: 1, sitterName: "John", visit: "" },
        { sitterId: 2, sitterName: "Jane", visit: "" },
      ];
      mockPrisma.petsitters.findMany.mockResolvedValue(mockResults);

      const region = "서울";
      const visit = "isVisit";
      const page = 1;
      const limit = 10;
      const orderKey = "createdAt";
      const orderValue = "desc";

      const result = await petSittersRepository.getSittersByRegionAndVisit(
        region,
        visit,
        page,
        limit,
        orderKey,
        orderValue
      );

      expect(mockPrisma.petsitters.findMany).toHaveBeenCalledWith({
        where: { region, visit },
        skip: 0,
        take: 10,
        orderBy: { [orderKey]: orderValue },
        select: expect.any(Object),
      });
      expect(result).toEqual([...mockResults, ...mockResults, ...mockResults]);
    });
  });

  describe("getSittersInfo", () => {
    it("should fetch pet sitters info", async () => {
      const mockResults = [
        { sitterId: 1, sitterName: "John", career: 3 },
        { sitterId: 2, sitterName: "Jane", career: 2 },
      ];
      mockPrisma.petsitters.findMany.mockResolvedValue(mockResults);

      const page = 1;

      const result = await petSittersRepository.getSittersInfo(page);

      expect(mockPrisma.petsitters.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 3,
        select: expect.any(Object),
      });
      expect(result).toEqual(mockResults);
    });
  });
  test("mapVisitEnum converts enum values correctly", async () => {
    const isVisit = await petSittersRepository.mapVisitEnum("isVisit");
    const isNotVisit = await petSittersRepository.mapVisitEnum("isNotVisit");
    const pickUp = await petSittersRepository.mapVisitEnum("pickUp");

    expect(isVisit).toBe("방문 가능");
    expect(isNotVisit).toBe("방문 불가");
    expect(pickUp).toBe("픽업 가능");
  });

  test("mapVisitInData converts visit field in data", async () => {
    const data = [
      { sitterId: 1, visit: "isVisit" },
      { sitterId: 2, visit: "isNotVisit" },
      { sitterId: 3, visit: "pickUp" },
    ];

    const convertedDataPromises = petSittersRepository.mapVisitInData(data);
    const convertedData = await Promise.all(convertedDataPromises);

    expect(convertedData).toEqual([
      { sitterId: 1, visit: "방문 가능" },
      { sitterId: 2, visit: "방문 불가" },
      { sitterId: 3, visit: "픽업 가능" },
    ]);
  });
});

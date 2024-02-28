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
        { sitterId: 1, sitterName: "John" },
        { sitterId: 2, sitterName: "Jane" },
      ];
      mockPrisma.petsitters.findMany.mockResolvedValue(mockResults);

      const region = "서울";
      const visit = "방문 가능";
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
});

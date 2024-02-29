import { jest } from "@jest/globals";
import { PetSittersController } from "../../../src/controllers/petsitters.controller.js";

const mockPetSittersService = {
  getSitters: jest.fn(),
  getSittersInfo: jest.fn(),
};

const mockRequest = {
  body: jest.fn(),
  query: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

const petSittersController = new PetSittersController(mockPetSittersService);

describe("PetSitters Controller Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockResponse.status.mockReturnValue(mockResponse);
  });

  test("should return sitters with default values if query parameters are missing", async () => {
    const getRequestBodyParams = {
      region: "Test Region",
    };
    const getRequestQueryParams = {
      visit: "방문 가능",
      page: 1,
      limit: 10,
      orderKey: "createdAt",
      orderValue: "desc",
      sortBy: undefined,
    };

    mockRequest.body = getRequestBodyParams;
    mockRequest.query = getRequestQueryParams;

    await petSittersController.getSitters(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockPetSittersService.getSitters).toHaveBeenCalledTimes(1);
    expect(mockPetSittersService.getSitters).toHaveBeenCalledWith({
      region: "Test Region",
      visit: "방문 가능",
      page: 1,
      limit: 10,
      orderKey: "createdAt",
      orderValue: "desc",
      sortBy: undefined,
    });
  });

  test("should throw an error if region is missing", async () => {
    mockRequest.body = {};
    mockRequest.query = {};
    await petSittersController.getSitters(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      err: "지역을 입력해 주시기 바랍니다.",
    });
    expect(mockPetSittersService.getSitters).not.toHaveBeenCalled();
  });
  test("should return sitters info with default page if page parameter is missing", async () => {
    const getRequestQueryParams = { page: 1 };
    mockRequest.query = getRequestQueryParams;
    await petSittersController.getSittersInfo(
      mockRequest,
      mockResponse,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalled();
    expect(mockPetSittersService.getSittersInfo).toHaveBeenCalledWith(1);
  });
});

export class PetSittersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  getSittersByRegionAndVisit = async (
    region,
    visit,
    page,
    limit,
    orderKey,
    orderValue
  ) => {
    const where = { region, visit };

    // 1. 'region'과 'visit' 모두 일치하는 펫시터 검색
    const firstResults = await this.prisma.petsitters.findMany({
      where,
      skip: (page - 1) * limit,
      take: +limit,
      orderBy: {
        [orderKey]: orderValue,
      },
      select: {
        sitterId: true,

        sitterName: true,
        career: true,
        createdAt: true,
        updatedAt: true,
        region: true,
        visit: true,
        review: {
          select: {
            title: true,
            rate: true,
          },
        },
      },
    });

    // 2. 'region' 또는 'visit' 중 하나만 일치하는 펫시터 검색
    const secondResults = await this.prisma.petsitters.findMany({
      where: {
        OR: [{ region }, { visit }],
        NOT: where,
      },
      skip: 0, // 'firstResults' 이후 결과만 가져오기 위해 0으로 설정
      take: +limit - firstResults.length,
      orderBy: {
        [orderKey]: orderValue,
      },
      select: {
        sitterId: true,

        sitterName: true,
        career: true,
        createdAt: true,
        updatedAt: true,
        region: true,
        visit: true,
        review: {
          select: {
            title: true,
            rate: true,
          },
        },
      },
    });

    // 3. 'region'과 'visit' 모두 일치하지 않는 펫시터 검색
    const thirdResults = await this.prisma.petsitters.findMany({
      where: {
        AND: [
          {
            NOT: { region },
          },
          {
            NOT: { visit },
          },
        ],
      },
      skip: 0, // 'firstResults' 및 'secondResults' 이후 결과만 가져오기 위해 0으로 설정
      take: +limit - firstResults.length - secondResults.length,
      orderBy: {
        [orderKey]: orderValue,
      },
      select: {
        sitterId: true,

        sitterName: true,
        career: true,
        createdAt: true,
        updatedAt: true,
        region: true,
        visit: true,
        review: {
          select: {
            title: true,
            rate: true,
          },
        },
      },
    });

    const results = await this.mapVisitInData(
      firstResults.concat(secondResults, thirdResults)
    );
    return Promise.all(results);
  };
  getSittersInfo = async (page) => {
    const results = await this.prisma.petsitters.findMany({
      skip: (page - 1) * 3,
      take: 3,
      select: {
        sitterId: true,

        sitterName: true,
        career: true,
        review: {
          select: {
            rate: true,
          },
        },
      },
    });

    return results;
  };
  mapVisitEnum = async (enumValue) => {
    switch (enumValue) {
      case "isVisit":
        return "방문 가능";
      case "isNotVisit":
        return "방문 불가";
      case "pickUp":
        return "픽업 가능";
      default:
        return "";
    }
  };

  mapVisitInData = (data) => {
    // visit 필드를 변환하여 데이터를 반환
    return data.map(async (item) => ({
      ...item,
      visit: await this.mapVisitEnum(item.visit), // visit 필드를 변환
    }));
  };
}

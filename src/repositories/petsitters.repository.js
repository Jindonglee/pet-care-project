export class PetSittersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  /**여기에 작성하심 됩니다. */
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

    return firstResults.concat(secondResults, thirdResults);
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
}

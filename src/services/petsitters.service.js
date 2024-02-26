export class PetSittersService {
  constructor(petSittersRepository) {
    this.petSittersRepository = petSittersRepository;
  }

  getSitters = async (options) => {
    const { region, visit, page, limit, orderKey, orderValue, sortBy } =
      options;
    try {
      // 사용자의 주소를 이용하여 위도와 경도를 구합니다.
      const { lat: userLat, lng: userLon } = await this.getLatLng(region);
      console.log({ userLat, userLon });

      // 해당 region의 모든 펫시터 정보를 가져옵니다.
      const petsitters =
        await this.petSittersRepository.getSittersByRegionAndVisit(
          region,
          visit,
          page,
          limit,
          orderKey,
          orderValue
        );

      // 각 펫시터의 주소를 이용하여 위도와 경도를 구하고 거리를 계산하여 정렬합니다.
      const sortedPetsitters = [];

      for (let i = 0; i < petsitters.length; i++) {
        const petsitter = petsitters[i];
        const { lat, lng } = await this.getLatLng(petsitter.region);
        const distance = await this.calculateDistance(
          userLat,
          userLon,
          lat,
          lng
        );
        const roundedDistance = Math.round(distance * 10) / 10;

        let average = 0;
        if (petsitter.review.length > 0) {
          average = await this.calculateTotalRate(petsitter.review);
        }

        sortedPetsitters.push({
          ...petsitter,
          distance: roundedDistance,
          averageRate: average,
        });
      }
      if (!sortBy) {
        return sortedPetsitters;
      } else if (sortBy === "distance") {
        return sortedPetsitters.sort((a, b) => a.distance - b.distance);
      } else if (sortBy === "rate") {
        return sortedPetsitters.sort((a, b) => b.averageRate - a.averageRate);
      }

      return sortedPetsitters;
    } catch (error) {
      throw new Error(error);
    }
  };

  getLatLng = async (address) => {
    let adressSplit = address.split(" ");
    let finalAdress = adressSplit[2];
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${finalAdress}&key=${apiKey}&language=ko`;

    const response = await fetch(url);
    const data = await response.json();

    const { results } = data;
    if (results.length === 0) {
      throw new Error("주소를 찾을 수 없습니다.");
    }

    const { lat, lng } = results[0].geometry.location;
    return { lat, lng };
  };

  calculateDistance = async (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구 반지름 (단위: km)
    const deg2rad = (deg) => deg * (Math.PI / 180);
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // 두 지점 간의 거리 (단위: km)
    return distance;
  };

  calculateTotalRate = async (reviews) => {
    let totalRate = 0;

    reviews.forEach((review) => {
      if (review.rate === "one") totalRate += 1;
      else if (review.rate === "two") totalRate += 2;
      else if (review.rate === "three") totalRate += 3;
      else if (review.rate === "four") totalRate += 4;
      else if (review.rate === "five") totalRate += 5;
    });

    return totalRate / reviews.length;
  };

  getSittersInfo = async (page) => {
    const sittesrInfo = await this.petSittersRepository.getSittersInfo(page);
    const sortedPetsitters = [];
    for (let i = 0; i < sittesrInfo.length; i++) {
      const petsitter = sittesrInfo[i];
      let average = 0;
      if (petsitter.review.length > 0) {
        average = await this.calculateTotalRate(petsitter.review);
      }
      sortedPetsitters.push({
        sitterId: petsitter.sitterId,
        sitterName: petsitter.sitterName,
        career: petsitter.career,
        averageRate: average,
      });
    }
    return sortedPetsitters.sort((a, b) => b.averageRate - a.averageRate);
  };
}

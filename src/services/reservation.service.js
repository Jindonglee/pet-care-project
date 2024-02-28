export class ReserveService {

  constructor(reserveRepository) {
      this.reserveRepository = reserveRepository;
  }

  // 예약 생성
  createReservation = async (userId, sitterId, reservation, petInfo, request) => {

      const isExistsitter = await this.reserveRepository.findSitter(sitterId);

      if (!isExistsitter) {
          return "시터가 없습니다";
      }

      const isExistreserve = await this.reserveRepository.ExitReservation(userId);

      if (isExistreserve) {
          return "이미 예약이 됐습니다";
      }

      const checkdate = await this.reserveRepository.checkDate(userId, sitterId, reservation);

      if (checkdate) {
          return "다른 날짜를 선택하세요";
      }

      const createdReservation = await this.reserveRepository.createReservation(
          userId, sitterId, reservation, petInfo, request
      );

      

      return createdReservation;
  }

  getReserveById = async (userId) => {
      const getReserveById = await this.reserveRepository.getReserveById(userId);

      if (!getReserveById) {
          return null;
      }

      return getReserveById;
  };

  updateReserve = async (userId, sitterId, reservation, petInfo, request) => {

      const isExistsitter = await this.reserveRepository.findSitter(sitterId);

      if (!isExistsitter) {
          return "시터가 없습니다";
      }

      const checkdate = await this.reserveRepository.checkDate(userId, sitterId, reservation);
  
      if (checkdate) {
          return "다른 날짜를 선택하세요";
      }

      const isExistreserve = await this.reserveRepository.findReservation(userId);

      if (!isExistreserve) {
          return "예약이 되어있지 않습니다";
      }

      const checkState = await this.reserveRepository.checkState(userId);

      if (checkState.reserveState !== "확인 대기 중") {
          return "예약 수정은 확인 대기 중일 때만 가능합니다";
      }

      const updateReserve = await this.reserveRepository.updateReserve(isExistreserve.postId, sitterId, reservation, petInfo, request);


      return updateReserve;
  };

  deleteReserve = async (userId) => {
      const isExistreserve = await this.reserveRepository.findReservation(userId);

      if (!isExistreserve) {
          return "삭제할 예약이 없습니다";
      }

      const checkState = await this.reserveRepository.checkState(userId);

      if (checkState.reserveState !== "확인 대기 중") {
          return "예약 수정은 확인 대기 중일 때만 가능합니다";
      }

      const deleteReserve = await this.reserveRepository.deleteReserve(isExistreserve.postId);

      return deleteReserve;
  };

}
export class ReserveController {
    
  constructor(reserveService) {
      this.reserveService = reserveService;
  }

  // 예약 생성
  createReserve = async (req, res, next) => {

      const { userId } = req.user;
      const { sitterId, reservation, petInfo, request } = req.body;

      const reserve = await this.reserveService.createReservation(userId, sitterId, new Date(reservation), petInfo, request);

      if (reserve === "시터가 없습니다") {
          return res.status(404).json({ message: "존재하지 않는 펫시터입니다" });
      }

      if (reserve === "이미 예약이 됐습니다") {
          return res.status(404).json({ message: "이미 예약이 됐습니다" });
      }

      if (reserve === "다른 날짜를 선택하세요") {
          return res.status(400).json({ message: "다른 날짜를 선택하세요" });
      }

      return res.status(201).json({ data: reserve });
  };



  getdetailreserve = async (req, res, next) => {
      const { userId } = req.user

      const reserve = await this.reserveService.getReserveById(userId);

      if (!reserve) {
          return res.status(404).json({ message: "예약 조회에 실패했습니다." });
      }

      return res.status(200).json({ data: reserve });
  };

 // 예약 수정 부분
  updateReserve = async (req, res, next) => {
      const { userId } = req.user;
      const { sitterId, reservation, petInfo, request } = req.body;

      const reserve = await this.reserveService.updateReserve(userId, sitterId, new Date(reservation), petInfo, request);

      if (reserve === "다른 날짜를 선택하세요") {
          return res.status(400).json({ message: "다른 날짜를 선택하세요" });
      }

      if (reserve === "시터가 없습니다") {
          return res.status(400).json({ message: "해당 시터가 없습니다" });
      }

      if (reserve === "예약이 되어있지 않습니다") {
          return res.status(400).json({ message: "예약이 되어있지 않습니다" });
      }

      if (reserve === "예약 수정은 확인 대기 중일 때만 가능합니다") {
          return res.status(400).json({ message: "예약 수정은 확인 대기 중일 때만 가능합니다" });
      }
      

      return res.status(200).json({ data: reserve });
  };

  deleteReserve = async (req, res, next) => {
      const { userId } = req.user;

      const reserve = await this.reserveService.deleteReserve(userId);

      if (reserve === "삭제할 예약이 없습니다") {
          return res.status(404).json({ message: "삭제할 예약이 없습니다" });
      }

      if (reserve === "예약 수정은 확인 대기 중일 때만 가능합니다") {
          return res.status(400).json({ message: "예약 수정은 확인 대기 중일 때만 가능합니다" });
      }

      return res.status(200).json({ message: "예약이 삭제되었습니다" });
  }

}
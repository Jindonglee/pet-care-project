export class ReserveRepository {

  constructor (prisma) {
      this.prisma = prisma
  }

  createReservation = async (userId,sitterId, reservation, petInfo, request) => {

      const createreserve = await this.prisma.reservation.create({
          data: {
              userId: +userId,
              sitterId: +sitterId,
              reservation,
              petInfo,
              request,
          },
      });
      return createreserve;
  };

  // 날짜 체크, 상태 체크
  checkDate = async (userId, sitterId, reservation) => {
      const checkdate = await this.prisma.reservation.findFirst({
          where : {
              userId: +userId,
              sitterId: +sitterId,
              reservation: { 
                  equals: new Date(reservation) 
              }
          }
          
      });

      return checkdate !== null;
  }

  ExitReservation = async (userId) => {
      const reservationcheck = await this.prisma.reservation.findFirst({
          where: {userId: +userId}, 
      });

      return reservationcheck;
  }

  findSitter = async (sitterId) => {
      // 펫시터가 있는지 확인
      const petsittercheck = await this.prisma.petsitters.findFirst({
          where: {sitterId: +sitterId}
      });

      return petsittercheck;
  };

  getReserveById = async (userId) => {
      const reserve = await this.prisma.reservation.findFirst({
          where: { userId: +userId },
          select: {
              postId: true,
              userId : true,
              sitterId: true,
              reservation: true,
              petInfo: true,
              request: true,
              reserveState: true,
              createdAt: true,
              updateAt: true 
          },
      });
      return reserve;
  };

  findReservation = async (userId) => {

      const reservationcheck = await this.prisma.reservation.findFirst({
          where: {userId: +userId}, 
          select: {postId: true}
      });

      return reservationcheck;
  };

  checkState = async (userId) => {
      const checkstate = await this.prisma.reservation.findFirst({
          where: {userId: +userId},
          select: {
              reserveState: true
          }
      });

      return checkstate;
  }

  updateReserve = async (postId, sitterId, reservation, petInfo, request, reserveStatus) => {

      const reserve = await this.prisma.reservation.update({
          where: {
              postId: +postId,
          },
          
          data: {
              sitterId,
              reservation, 
              petInfo, 
              request,
              reserveStatus
          },
          
      });

      if(!reserve) {
          return null;
      }

      return reserve;
  };

  deleteReserve = async (postId) => {
      await this.prisma.reservation.delete({
          where: { postId: postId },
      });

  };
}
export class ProfileRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  getProfile = async (userId) => {
    return await this.prisma.users.findFirst({
      where: {
        userId: +userId,
      },
      select: {
        name: true,
        birth: true,
        address: true,
        remarks: true,
      },
    });
  };
  updateProfile = async (userId, newPwd, name, birth, address, remarks) => {
    return await this.prisma.users.update({
      where: { userId: +userId },
      data: {
        password: newPwd,
        name,
        birth,
        address,
        remarks,
      },
    });
  };
}

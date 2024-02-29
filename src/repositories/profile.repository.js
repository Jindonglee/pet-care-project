export class ProfileRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  getProfile = async (userId) => {
    return await this.prisma.users.findFirst({ where: { userId } });
  };

  updateProfile = async (
    userId,
    newPwd,
    checkedPwd,
    name,
    birth,
    address,
    remarks,
    profileImage
  ) => {
    return await this.prisma.profile.update({
      where: { userId: +userId },
      data: { newPwd, checkedPwd, name, birth, address, remarks, profileImage },
    });
  };
}

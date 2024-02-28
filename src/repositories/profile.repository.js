import { prisma } from "../utils/prisma/index.js";

export default class ProfileRepository {
  getProfileById = async (userId) => {
    return await prisma.users.findFirst({ where: { userId } });
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
    return await prisma.profile.update({
      where: { userId: +userId },
      data: { newPwd, checkedPwd, name, birth, address, remarks, profileImage },
    });
  };

  updateUsers = async(userId);
}

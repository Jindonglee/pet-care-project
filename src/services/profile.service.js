// import ProfileRepository from "../repositories/profile.repository.js";
import bcrypt from "bcrypt";

export class ProfileService {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }
  getProfile = async (userId) => {
    try {
      return await this.profileRepository.getProfile(userId);
    } catch (err) {
      throw err;
    }
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
    try {
      if (newPwd !== checkedPwd) {
        throw new Error(
          "새 비밀번호와 비밀번호 확인이 일치하지 않습니다. 확인해주세요!"
        );
      }

      await bcrypt.hash(newPwd, 10);

      await this.profileRepository.updateProfile(
        userId,
        newPwd,
        name,
        birth,
        address,
        remarks
      );
    } catch (err) {
      throw err;
    }
  };
}

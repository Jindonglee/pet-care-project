import ProfileRepository from "../repositories/profile.repository.js";

const profileRepository = new ProfileRepository();

export default class ProfileService {
  getProfileById = async () => {};

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
    if (newPwd !== checkedPwd) {
      throw new Error(
        "새 비밀번호와 비밀번호 확인이 일치하지 않습니다. 확인해주세요!"
      );
    }

    await bcrypt.hash(newPwd, 10);

    await ProfileRepository.updateProfile(
      userId,
      name,
      birth,
      address,
      remarks,
      profileImage
    );
  };
}

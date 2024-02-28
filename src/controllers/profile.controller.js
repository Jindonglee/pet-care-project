import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";
import ProfileService from "../services/profile.service.js";

const profileService = new ProfileSer() / vice();

export default class ProfileController {
  getProfileById = async (req, res, next) => {
    try {
      // 미들웨어에서 req.user를 설정해줬으니까 여기서 받아올 수 있음
      const { userId } = req.user;

      // 해당하는 userId로 user가 있는지 확인한다.
      const user = await prisma.users.findFirst({
        where: {
          userId,
        },
      });

      // user가 있다면 이메일과 이름을 돌려준다.
      if (!user) {
        return res.status(400).send({
          errorMessage: "존재하지 않는 프로필입니다. 확인해주세요!",
        });
      }

      return res.status(200).send({
        message: "프로필 조회 성공 (^O^)",
        data: {
          email: user.email,
          name: user.name,
          birth: user.birth,
          address: user.address,
          remarks: user.remarks,
          profileImage: user.profileImage,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const {
        newPwd,
        checkedPwd,
        name,
        birth,
        address,
        remarks,
        profileImage,
      } = req.body;

      await ProfileService.updateProfile(
        userId,
        newPwd,
        checkedPwd,
        name,
        birth,
        address,
        remarks,
        profileImage
      );

      res.status(200).json({ message: "프로필 수정 완료 (^O^)" });
    } catch (err) {
      next(err);
    }
  };
}

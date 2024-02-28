import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

const s3 = new S3Client({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  region: "ap-northeast-2",
});
const multerUpload = multer({
  dest: tmpdir(),
});

// 프로필 이미지 업로드 함수
const uploadProfileImage = async (req, res, next) => {
  //업로드 함수를 정의
  return new Promise((resolve, reject) => {
    multerUpload.single("profileImage")(req, res, async (error) => {
      if (error) {
        reject(res.status(500).json({ message: error.message }));
      }
      console.log(req.file);
      const fileStream = fs.createReadStream(req.file.path); //파일을 읽는 스트림 생성
    });
  });
};

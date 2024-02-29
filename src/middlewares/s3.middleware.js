import express from "express";
import AWS from "aws-sdk";
// import multer from "multer";
// import sharp from "sharp";
import fs from "fs";
import multerS3 from "multer-s3";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  region: process.env.REGION,
});

/** 이미지 업로드를 위한 multer 설정 */
const upload = multerS3({
  dest: "uploads/",
});

// 프로필 이미지 생성 및 S3에 업로드하는 미들웨어
export const uploadImage = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    upload.single("profileImage"),
      async (req, res, next) => {
        if (!req.file) {
          return res.status(400).send("No image file uploaded");
        }
        const imageFile = req.file.path;
        const userId = req.body.userId; // 클라이언트에서 전송된 사용자 ID

        // 이미지 크기 조정 및 형식 변경
        // sharp(imageFile)
        //   .resize({ width: 200, height: 200 })
        //   .toFormat("png")
        //   .toBuffer()
        //   .then((buffer) => {
        // AWS S3에 이미지 업로드
        const loader = new upload({
          s3: 3,
          params: {
            Bucket: process.env.BUCKET_NAME,
            Key: `profiles/${userId}.png`, // S3에 저장될 경로 및 파일명
            Body: buffer,
            ContentType: "image/png", // 이미지 타입 지정
          },
        });
        try {
          // s3.upload(params, (err, data) => {
          //   if (err) {
          //     console.error("사진 업로드 오류!!", err);
          //     return res.status(500).send("사진 업로드 실패.");
          //   }

          // 업로드된 이미지 URL을 클라이언트에 응답
          const result = await loader.done();
          fs.unlinkSync(imageFile); // 로컬에 저장된 이미지 파일 삭제
          res.status(200).json({ imageUrl: result.Location });
          resolve(next());
        } catch (err) {
          console.error("사진 응답에 대한 오류!!", err);
          reject(res.status(500).send("사진 응답에 실패함."));
        }
      };
  });
};
//   });
// };

// module.exports = router;
// const s3 = new AWS.S3();
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     //s3: new AWS.S3(), // S3 객체
//     bucket: 'sparta-aws-bucket', // S3 버킷명
//     acl: 'public-read', // 파일 엑세스 권한 : AllUsers그룹이 액세스 READ 권한획득
//     contentType: multerS3.AUTO_CONTENT_TYPE, // multer-s3가 파일 유형을 자동으로 찾는 상수 설정
//     key: function (req, file, cb) {
//       // 업로드 파일이 어떤 이름으로 버킷에 저장되는가 속성
//       cb(null, `img/${Date.now()}_${file.originalname}`); // 파일명: 현재시간_유저업로드파일명.이미지확장자 + imgStorage 폴더에 파일 저장
//     },
// })
// const uploadProfileImage = async (req, res, next) => {
//   //업로드 함수를 정의
//   return new Promise((resolve, reject) => {
//     multerUpload.single("profileImage")(req, res, async (error) => {
//       // 멀터.싱글을 요청해서 파일을 가져오고
//       if (error) {
//         reject(res.status(500).json({ message: error.message }));
//       }
//       console.log(req.file);
//       const fileStream = fs.createReadStream(req.file.path); //파일을 읽는 스트림 생성

//     const uploader = new upload({
//       // 파일을 S3에 업로드
//       client: s3,
//       params: {
//         Bucket: process.env.BUCKET_NAME,
//         Key: req.file.originalname,
//         Body: fileStream,
//         ContentType: req.file.mimetype,
//       },
//     });

//     try {
//       const result = await uploader.done();
//       req.file.Location = result.Location; // S3에서 반환한 URL을 객체에 추가
//       resolve(next());
//     } catch (error) {
//       reject(res.status(500).json({ message: error.message }));
//     }
//   });
// });

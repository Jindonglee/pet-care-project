export default function (err, req, res, next) {
  // 에러를 출력합니다.
  console.error(err);

  res.status(500).json({ errorMessage: "서버 내부 에러가 발생했습니다." });
}

const isLoggedIn = (req, res, next) => {
  // 사용자가 로그인되어 있는지 확인
  if (req.cookies.accessToken) {
    next(); // 다음 미들웨어로 이동
  } else {
    res.status(401).json({ message: "로그인이 필요합니다." });
  }
};

export default isLoggedIn;

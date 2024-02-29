import jwt from "jsonwebtoken";

// 토큰을 검증하고 사용자 ID를 추출하는 유틸리티 함수
export function extractUserIdFromToken(authorization) {
  try {
    // 토큰을 검증하여 사용자 ID를 추출합니다.

    if (!authorization)
      throw new Error("요청한 사용자의 토큰이 존재하지 않습니다.");

    // tokenType은 Bearer token은 나머지가 된다.
    const [tokenType, token] = authorization.split(" ");
    if (tokenType !== "Bearer")
      throw new Error("토큰 타입이 Bearer 형식이 아닙니다.");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;

    return userId;
  } catch (error) {
    throw new Error("유효하지 않은 토큰입니다.");
  }
}

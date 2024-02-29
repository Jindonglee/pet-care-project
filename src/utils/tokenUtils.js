import jwt from "jsonwebtoken";

// 토큰을 검증하고 사용자 ID를 추출하는 유틸리티 함수
export function extractUserIdFromToken(token) {
  try {
    // 토큰을 검증하여 사용자 ID를 추출합니다.
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    return userId;
  } catch (error) {
    throw new Error("유효하지 않은 토큰입니다.");
  }
}

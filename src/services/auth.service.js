import jwt from "jsonwebtoken";

export class authController {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  refreshToken = async (refreshToken) => {
    const token = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    if (!token) {
      throw new Error("Invalid refresh token");
    }

    const user = await userService.findUserById(token.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "12h" }
    );
    const newRefreshToken = jwt.sign(
      { userId: user.userId },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken: newRefreshToken };
  };
}

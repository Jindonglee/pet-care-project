export class authController {
  constructor(authService) {
    this.authService = authService;
  }

  refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.body;

      const tokens = await authService.refreshToken(refreshToken);
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

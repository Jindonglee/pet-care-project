export class PetSittersController {
  constructor(petSittersService) {
    this.petSittersService = petSittersService;
  }
  getSitters = async (req, res, next) => {
    try {
      const { region } = req.body;
      let { visit, page, limit, orderKey, orderValue, sortBy } = req.query;

      visit = visit ? visit : "방문 가능";
      page = page ? page : 1;
      limit = limit ? limit : 10;
      orderKey = orderKey ? orderKey : "createdAt";
      orderValue = orderValue ? orderValue : "desc";
      if (!region) {
        throw new Error("지역을 입력해 주시기 바랍니다.");
      }
      const options = {
        region,
        visit,
        page,
        limit,
        orderKey,
        orderValue,
        sortBy,
      };
      const sitters = await this.petSittersService.getSitters(options);
      res.status(200).json(sitters);
    } catch (err) {
      res.status(400).json({ err: err.message });
    }
  };
  getSittersInfo = async (req, res, next) => {
    let { page } = req.query;
    page = page ? page : 1;
    try {
      const sittersInfo = await this.petSittersService.getSittersInfo(page);
      res.status(200).json(sittersInfo);
    } catch (err) {
      next(err);
    }
  };
}

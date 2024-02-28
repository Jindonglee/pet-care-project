export class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }
  //리뷰 조회
  getReviews = async (req, res, next) => {
    try{
      const sitterId = req.params.sitterId; // = 1
      const orderValue = req.query.order ?? 'desc'; // = "desc"
      const reviews = await this.reviewService.getReviews(sitterId, orderValue) //바뀐 sitterId값에 맞는 리뷰들을 리턴

      return res.status(201).json({data :reviews}); //그 리뷰들을 data에 묶어서 json으로 res해준다.

    }catch(err){
      res.status(err || 500).json({ message: err || '서버 에러' }); //에러 값 처리
    }
  }

  postReview = async (req, res, next) => {
    try{
      const user = req.user.userId; // = 1
      const sitterId = req.params.sitterId; // = 1
      const { title, content, rate } = req.body; // key값 없이 밸류만 담김.
      const reviews = await this.reviewService.postReview(user, sitterId, title, content, rate); //최신값부터 들고옴.

      return res.status(201).json({data :reviews}); //그 리뷰들을 data에 묶어서 json으로 res해준다.

    }catch(err){
      res.status(err.code || 500).json({ message: err.message || '서버 에러' }); //에러 값 처리
    }
  }

  patchReview = async (req, res, next) => {
    try{
      const user = req.user.userId; // = 1
      const reviewId = req.params.reviewId; // = 1
      const { title, content, rate } = req.body; // key값 없이 밸류만 담김.
      const reviews = await this.reviewService.patchReview(user, reviewId, title, content, rate);//리뷰들을 최신순으로 리턴받음

      return res.status(201).json({data :reviews}); //res

    }catch(err){
      res.status(err.code || 500).json({ message: err.message || '서버 에러' });
    }
  }

  deleteReview = async (req, res, next) => {
    try{
      const user = req.user.userId; // = 1
      const reviewId = req.params.reviewId; // = 1
      const reviews = await this.reviewService.deleteReview(user, reviewId);

      return res.status(201).json({data :reviews});

    }catch(err){
      res.status(err.code || 500).json({ message: err.message || '서버 에러' });
    }
  }
}

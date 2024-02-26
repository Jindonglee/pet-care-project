export class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }
  getReviews = async (req, res, next) => {
    try{
      const sitterId = req.params.sitterId;
      const orderValue = req.query.orderValue ?? 'desc';
      const reviews = await this.reviewService.getReviews(sitterId, orderValue)

      return res.status(200).json({data :reviews});

    }catch(err){
      console.error('에러 발생:', err);
      res.status(err.code || 500).json({ error: err.message || '서버 에러' });
    }
  }

  postReview = async (req, res, next) => {
    try{
      const { user } = req.user;
      const { sitterId } = req.params;
      const { title, content, rate } = req.body;
      const reviews = await this.reviewService.postReview(user, sitterId, title, content, rate);

      return res.status(200).json({data :reviews});

    }catch(err){
      console.error('에러 발생:', err);
      res.status(err.code || 500).json({ error: err.message || '서버 에러' });
    }
  }

  patchReview = async (req, res, next) => {
    try{
      const { user } = req.user;
      const { reviewId } = req.params;
      const { title, content, rate } = req.body;
      const reviews = await this.reviewService.patchReview(user, reviewId, title, content, rate);

      return res.status(200).json({data :reviews});

    }catch(err){
      console.error('에러 발생:', err);
      res.status(err.code || 500).json({ error: err.message || '서버 에러' });
    }
  }

  deleteReview = async (req, res, next) => {
    try{
      const { user } = req.user;
      const { reviewId } = req.params;
      const reviews = await this.reviewService.deleteReview(user, reviewId);

      return res.status(200).json({data :reviews});

    }catch(err){
      console.error('에러 발생:', err);
      res.status(err.code || 500).json({ error: err.message || '서버 에러' });
    }
  }
}

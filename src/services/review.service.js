export class ReviewService {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  getReviews = async (sitterId, orderValue) => {
    try {
      if (!sitterId){ //sitterId값 검증
        throw {
          code: 400,
          message: 'sitterId가 입력되지 않았습니다.'
        }
      }
      if (!orderValue){
        orderValue = 'desc';
      }
      if (!['asc', 'desc'].includes(orderValue.toLowerCase())) { //정렬값 검증
        throw{
          code: 400,
          message: '정렬값이 올바르지 않습니다.'
        }
      }
      const checkSitterId = await this.reviewRepository.findSitterId(sitterId);
      if (!checkSitterId) { //해당하는 sitter가 있는지 검증
        throw{
          code: 400,
          message: '해당하는 sitterId는 존재하지 않습니다.'
        }
      }
      orderValue = orderValue.toLowerCase();
      return await this.reviewRepository.getReviews(sitterId, orderValue);

    } catch (err) {
      return err
    }
  }


  postReview = async (user, sitterId, title, content, rate) => {
    try{
      if (!sitterId) { //sitterId값 검증
        throw {
          code: 400,
          message: 'sitterId가 입력되지 않았습니다.'
        }
      }
      if (!title||!content||!rate) { //body값 검증
        throw {
          code: 400,
          message: 'title, content, rate값을 입력해주세요.'
        }
      }
      const checkSitterId = await this.reviewRepository.findSitterId(sitterId);
      if (!checkSitterId) { //해당하는 sitter가 있는지 검증
        throw{
          code: 400,
          message: '해당하는 sitterId는 존재하지 않습니다.'
        }
      }

      const userId = user.userId;
      await this.reviewRepository.postReview(userId, sitterId, title, content, rate);

      const orderKey = sitterId;
      const orderValue = 'desc';
      return await this.reviewRepository.getReviews(orderKey, orderValue);

    }catch(err){
      return err
    }
  }


  patchReview = async (user, reviewId, title, content, rate) => {
    try{
      if (!reviewId) { //sitterId값 검증
        throw {
          code: 400,
          message: 'reviewId가 입력되지 않았습니다.'
        }
      }
      if (!title||!content||!rate) { //body값 검증
        throw {
          code: 400,
          message: 'title, content, rate값을 입력해주세요.'
        }
      }
      const checkReviewId = await this.reviewRepository.findReviewId(reviewId);
      if (!checkReviewId) { //해당하는 Review가 있는지 검증
        throw{
          code: 400,
          message: '리뷰가 존재하지 않습니다.'
        }
      }
      if (user.userId !== checkReviewId.userId){
        throw{
          code: 403,
          message: '권한이 없습니다.'
        }
      }

      await this.reviewRepository.patchReview(reviewId, title, content, rate);

      const orderKey = checkReviewId.sitterId;
      const orderValue = 'desc';
      return await this.reviewRepository.getReviews(orderKey, orderValue);

    }catch(err){
      return err
    }
  }

  deleteReview = async (user, reviewId) => {
    try{
      if (!reviewId) { //sitterId값 검증
        throw {
          code: 400,
          message: 'reviewId가 입력되지 않았습니다.'
        }
      }
      const checkReviewId = await this.reviewRepository.findReviewId(reviewId);
      if (!checkReviewId) { //해당하는 Review가 있는지 검증
        throw{
          code: 400,
          message: '리뷰가 존재하지 않습니다.'
        }
      }
      if (user.userId !== checkReviewId.userId){
        throw{
          code: 403,
          message: '권한이 없습니다.'
        }
      }

      await this.reviewRepository.deleteReview(reviewId);
      const orderKey = checkReviewId.sitterId;
      const orderValue = 'desc';
      return await this.reviewRepository.getReviews(orderKey, orderValue);

    }catch(err){
      return err
    }
  }
}

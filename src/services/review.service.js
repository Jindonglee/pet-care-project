export class ReviewService {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  reviews = async (orderKey, orderValue) => { // = 1, "desc"
      const reviews = await this.reviewRepository.getReviews(orderKey, orderValue); // 시터 ID 값에 맞는 모든 리뷰 return
      return reviews.map((review)=> { // 그 리뷰들에서 name값이 users : {name : "뭐시기"} 이기 때문에 바꿔주고 return
        return {
          name: review.users.name,
          sitterId: review.sitterId,
          reviewId: review.reviewId, 
          title: review.title,
          content: review.content,
          rate: review.rate,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt
        }
      });
  }

  checkSitterId = async (sitterId) => { // = 1
    try {
      const checkSitterId = await this.reviewRepository.findSitterId(sitterId); //sitter 에 맞는 review 하나 return
      if (!checkSitterId) { //해당하는 sitter가 있는지 검증
        throw{
          code: 400,
          message: '해당하는 sitterId는 존재하지 않습니다.'
        }
      }
    }catch(err){
      throw err;
    }
  }

  checkReviewId = async (reviewId) => {
    try {
      const checkReviewId = await this.reviewRepository.findReviewId(reviewId); //reviewId에 맞는 review하나만 return
      if (!checkReviewId) { //해당하는 Review가 있는지 검증
        throw{
          code: 400,
          message: '해당하는 reviewId는 존재하지 않습니다.'
        }
      }
      return checkReviewId; //review 전체가 가게됨.
    }catch(err){
      throw err;
    }
  }




  getReviews = async (sitterId, orderValue) => {
    try {
      if (!sitterId){ //sitterId값 검증 = 1
        throw {
          code: 400,
          message: 'sitterId가 입력되지 않았습니다.'
        }
      }
      if (!orderValue){ // = "desc"
        orderValue = 'desc';
      }
      orderValue = orderValue.toLowerCase(); // = "desc"
      if (!['asc', 'desc'].includes(orderValue)) { //정렬값 검증
        throw{
          code: 400,
          message: '정렬값이 올바르지 않습니다.'
        }
      }
      await this.checkSitterId(sitterId); // = 1
      const orderKey = sitterId; // = 1
      return await this.reviews(orderKey, orderValue); //바뀐 sitterId값에 맞는 리뷰들을 리턴
    } catch (err) {
      throw err;
    }
  }


  postReview = async (user, sitterId, title, content, rate) => {
    try{
      if (!sitterId) { //sitterId값 검증 = 1
        throw {
          code: 400,
          message: 'sitterId가 입력되지 않았습니다.'
        }
      }
      if (!title||!content||!rate) { //body값 검증 = 밸류만 담겨있음.
        throw {
          code: 400,
          message: 'title, content, rate값을 입력해주세요.'
        }
      }
      rate = rate.toLowerCase();
      if (!['one', 'two', 'three', 'four', 'five'].includes(rate)) { //rate값 검증
        throw{
          code: 400,
          message: 'rate값이 올바르지 않습니다.'
        }
      }
      await this.checkSitterId(sitterId); // = 1
      const userId = user; // = 1 
      await this.reviewRepository.postReview(userId, sitterId, title, content, rate); // post만.

      const orderKey = sitterId; // = 1
      const orderValue = 'desc'; 
      return await this.reviews(orderKey, orderValue); // 그냥 최신값부터 들고와버림.

    }catch(err){
      throw err
    }
  }


  patchReview = async (user, reviewId, title, content, rate) => {
    try{
      if (!reviewId) { //sitterId값 검증 = 1
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
      rate = rate.toLowerCase();
      if (!['one', 'two', 'three', 'four', 'five'].includes(rate)) { //정렬값 검증
        throw{
          code: 400,
          message: 'rate값이 올바르지 않습니다.'
        }
      }
      const checkReviewId = await this.checkReviewId(reviewId);
      if (user !== checkReviewId.userId){ // = 1 !== 리뷰 전체가 오게되므로, userId값만.
        throw{
          code: 403,
          message: '권한이 없습니다.'
        }
      }

      await this.reviewRepository.patchReview(reviewId, title, content, rate); // patch만.

      const orderKey = checkReviewId.sitterId;
      const orderValue = 'desc';
      return await this.reviews(orderKey, orderValue); //리뷰들을 최신순으로 리턴

    }catch(err){
      throw err
    }
  }

  deleteReview = async (user, reviewId) => {
    try{
      if (!reviewId) { //reviewId값 검증 = 1
        throw {
          code: 400,
          message: 'reviewId가 입력되지 않았습니다.'
        }
      }
      const checkReviewId = await this.checkReviewId(reviewId);
      if (user !== checkReviewId.userId){
        throw{
          code: 403,
          message: '권한이 없습니다.'
        }
      }

      await this.reviewRepository.deleteReview(reviewId); // delete만.
      const orderKey = checkReviewId.sitterId;
      const orderValue = 'desc';
      return await this.reviews(orderKey, orderValue);

    }catch(err){
      throw err
    }
  }
}

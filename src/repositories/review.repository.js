import { prisma } from '../utils/prisma/index.js';
export class ReviewRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findSitterId = async (sitterId) => {
    return await this.prisma.review.findFirst({
      where : {sitterId : +sitterId}
    })
  }

  findReviewId = async (reviewId) => {
    return await this.prisma.review.findFirst({
      where : {reviewId : +reviewId}
    })
  }

  getReviews = async (orderKey, orderValue) => {
      return await this.prisma.review.findMany({
        where : {sitterId: +orderKey},
        orderBy : [{
          createdAt: orderValue,
        }],
        select : {
          users : {
            select : {
              name : true,
            }
          },
          reivewId : true,
          title : true,
          content : true,
          rate : true,
          createdAt : true,
          updatedAt : true,
        }
      })
  }

  postReview = async (userId, sitterId, title, content, rate) => {
    return await this.prisma.review.create({
      data : {
        userId : +userId,
        sitterId : +sitterId,
        title,
        content,
        rate,
      }
    })
  }

  patchReview = async (reviewId, title, content, rate) => {
    return await this.prisma.review.update({
      where : {
        reviewId : +reviewId,
      },
      data : {
        title,
        content,
        rate,
      }
    })

  }

  deleteReview = async (reviewId) => {
    return await this.prisma.review.delete({
      where : {
        reviewId : +reviewId,
      }
    })
  }
}

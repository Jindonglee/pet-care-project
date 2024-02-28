import { prisma } from '../utils/prisma/index.js';
export class ReviewRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findSitterId = async (sitterId) => { // = number
    return await this.prisma.petSitters.findFirst({ //근데 이건 시터 아닌가??? prisma에 맞춰 수정바람. 어짜피 시터가 있는지만 확인하는 용도.
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
          sitterId : true,
          reviewId : true,
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

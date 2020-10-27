import { useReviewFactory, UseReview, UseReviewFactoryParams } from '@vue-storefront/core';
import { Review } from '../../types';

const params: UseReviewFactoryParams<any, any, any> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchReviews: async (params) => {
    console.log('Mocked: searchReviews');
    return {};
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addReview: async (params) => {
    console.log('Mocked: addReview');
    return {};
  }
};

const useReview: (cacheId: string) => UseReview<Review, any, any> = useReviewFactory<Review, any, any>(params);

export { useReview };
export { default as reviewGetters } from '../getters/reviewGetters';

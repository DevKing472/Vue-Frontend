import { Ref, computed } from '@vue/composition-api';
import { UseReview } from '../types';
import { sharedRef, Logger } from '../utils';

export declare type UseReviewFactoryParams<REVIEW, REVIEWS_SEARCH_PARAMS, REVIEW_ADD_PARAMS> = {
  searchReviews: (params: REVIEWS_SEARCH_PARAMS) => Promise<REVIEW>;
  addReview: (params: REVIEW_ADD_PARAMS) => Promise<REVIEW>;
};

export function useReviewFactory<REVIEW, REVIEWS_SEARCH_PARAMS, REVIEW_ADD_PARAMS>(
  factoryParams: UseReviewFactoryParams<REVIEW, REVIEWS_SEARCH_PARAMS, REVIEW_ADD_PARAMS>
) {
  return function useReview(id: string): UseReview<REVIEW, REVIEWS_SEARCH_PARAMS, REVIEW_ADD_PARAMS> {
    const reviews: Ref<REVIEW> = sharedRef([], `useReviews-reviews-${id}`);
    const loading: Ref<boolean> = sharedRef(false, `useReviews-loading-${id}`);
    const error: Ref<string | null> = sharedRef(null, `useReviews-error-${id}`);

    const search = async (params?: REVIEWS_SEARCH_PARAMS): Promise<void> => {
      Logger.debug('useReview.search', params);

      try {
        loading.value = true;
        reviews.value = await factoryParams.searchReviews(params);
      } catch (searchError) {
        Logger.error('useReview.search', searchError);

        error.value = searchError.toString();
      } finally {
        loading.value = false;
      }
    };

    const addReview = async (params: REVIEW_ADD_PARAMS): Promise<void> => {
      Logger.debug('useReview.addReview', params);

      try {
        loading.value = true;
        reviews.value = await factoryParams.addReview(params);
      } catch (addError) {
        Logger.error('useReview.addReview', addError);

        error.value = addError.toString();
      } finally {
        loading.value = false;
      }
    };

    return {
      search,
      addReview,
      reviews: computed(() => reviews.value),
      loading: computed(() => loading.value),
      error: computed(() => error.value)
    };
  };
}

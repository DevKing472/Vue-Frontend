import { Ref, computed } from '@vue/composition-api';
import { RenderComponent, UseContent, Context, FactoryParams, UseContentErrors } from '../types';
import { sharedRef, Logger, generateContext } from '../utils';
import { PropOptions, VNode } from 'vue';

export interface UseContentFactoryParams<CONTENT, CONTENT_SEARCH_PARAMS> extends FactoryParams {
  search: (context: Context, params: CONTENT_SEARCH_PARAMS) => Promise<CONTENT>;
}

export function useContentFactory<CONTENT, CONTENT_SEARCH_PARAMS>(
  factoryParams: UseContentFactoryParams<CONTENT, CONTENT_SEARCH_PARAMS>
) {
  return function useContent(id: string): UseContent<CONTENT, CONTENT_SEARCH_PARAMS> {
    const content: Ref<CONTENT> = sharedRef([], `useContent-content-${id}`);
    const loading: Ref<boolean> = sharedRef(false, `useContent-loading-${id}`);
    const error: Ref<UseContentErrors> = sharedRef({}, `useContent-error-${id}`);
    const context = generateContext(factoryParams);

    const search = async(params: CONTENT_SEARCH_PARAMS): Promise<void> => {
      Logger.debug(`useContent/${id}/search`, params);

      try {
        loading.value = true;
        error.value.search = null;
        content.value = await factoryParams.search(context, params);
      } catch (err) {
        error.value.search = err;
        Logger.error(`useContent/${id}/search`, err);
      } finally {
        loading.value = false;
      }
    };

    return {
      search,
      content: computed(() => content.value),
      loading: computed(() => loading.value),
      error: computed(() => error.value)
    };
  };
}

export declare type RenderContentFactoryParams<CONTENT = any> = {
  extractContent: (content) => CONTENT;
};

export function renderContentFactory(
  factoryParams: RenderContentFactoryParams<RenderComponent[]>
) {
  return {
    render: function render(createElement) {
      const components: VNode[] = [];
      // eslint-disable-next-line
      const self = this;
      const content = self.content;
      const resolvedContent: RenderComponent[] = factoryParams.extractContent(content);
      resolvedContent.map(function component(component: RenderComponent) {
        const { componentName, props } = component;
        components.push(createElement(componentName, { attrs: { name: componentName }, props }, self.$slots.default));
      });
      return createElement('div', components);
    },
    props: {
      content: {
        type: [Array, Object]
      } as PropOptions<[] | {}>
    }
  };
}

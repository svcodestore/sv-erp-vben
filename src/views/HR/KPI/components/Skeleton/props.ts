import type { PropType } from 'vue';

export const props = {
  title: { type: String as PropType<string>, default: () => '' },
  description: { type: String as PropType<string>, default: () => '' },
  loading: { type: Boolean, default: () => false },
};

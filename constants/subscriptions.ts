// 애니메이션 상수
export const ANIMATION_CONSTANTS = {
  FADE_DURATION: 600,
  SLIDE_DURATION: 400,
  SLIDE_DISTANCE: 30,
  ITEM_ANIMATION_DELAY: 5,
  ITEM_ANIMATION_OFFSET: 20,
} as const;

// FlatList 성능 최적화 상수
export const FLATLIST_CONSTANTS = {
  ITEM_HEIGHT: 120,
  INITIAL_NUM_TO_RENDER: 10,
  MAX_TO_RENDER_PER_BATCH: 10,
  WINDOW_SIZE: 10,
} as const;

// 정렬 옵션
export const SORT_OPTIONS = {
  NAME: 'name',
  COST: 'cost',
  DATE: 'date',
  CATEGORY: 'category',
} as const;

// 필터 옵션
export const FILTER_OPTIONS = {
  ALL: 'all',
  SUBSCRIBED: 'subscribed',
  UPCOMING: 'upcoming',
  CANCELLED: 'cancelled',
} as const; 
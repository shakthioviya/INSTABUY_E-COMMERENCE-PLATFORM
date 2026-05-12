export const CATEGORY_CONFIG = {
  beauty: { dealerId: 28, label: 'Beauty', emoji: '💄', color: '#FF6B9D' },
  furniture: { dealerId: 29, label: 'Furniture', emoji: '🪑', color: '#8B6914' },
  electronics: { dealerId: 30, label: 'Electronics', emoji: '📱', color: '#2563EB' },
  clothing: { dealerId: 31, label: 'Clothing', emoji: '👗', color: '#7C3AED' },
  'home-decor': { dealerId: 32, label: 'Home Decor', emoji: '🏠', color: '#059669' },
};

export const getCategoryByDealerId = (dealerId) => {
  return Object.entries(CATEGORY_CONFIG).find(
    ([, config]) => config.dealerId === dealerId
  )?.[0] || 'all';
};

export const CATEGORIES = ['all', 'clothing', 'electronics', 'home-decor', 'furniture', 'beauty'];
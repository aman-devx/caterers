const u = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=80&auto=format&fit=crop`;

export const FALLBACK_IMAGE = u('1555244162-803834f70033');

export const LANDING_IMAGES = {
  hero: [
    { src: u('1519225421980-715cb0215aed', 1400, 900), alt: 'Elegant wedding reception catering' },
    { src: u('1511578314322-379afb476865', 1400, 900), alt: 'Corporate event catering buffet' },
    { src: u('1555244162-803834f70033', 1400, 900), alt: 'Premium catering buffet spread' },
    { src: u('1414235077428-338989a2e8c0', 1400, 900), alt: 'Fine dining food experience' },
  ],
  about: [
    { src: u('1464366400600-7168b8af9bc3', 600, 750), alt: 'Wedding banquet hall' },
    { src: u('1546069901-ba4a3752c747', 400, 400), alt: 'Gourmet food plating' },
    { src: u('1476224207421-acaac941d319', 400, 400), alt: 'Event dining setup' },
    { src: u('1504674900247-0877df9cc836', 600, 750), alt: 'Catering food presentation' },
  ],
};

export const MENU_CATEGORY_ORDER = [
  'Starters', 'Soups', 'Salads', 'Main Course', 'Breads', 'Rice Items', 'Desserts', 'Beverages',
];

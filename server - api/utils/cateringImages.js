/** Curated Unsplash catering & food images — optimized with w/q/auto params */
const u = (id, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=80&auto=format&fit=crop`;

const FALLBACK = u('1555244162-803834f70033', 800, 600);

const LANDING = {
  hero: [
    u('1519225421980-715cb0215aed', 1200, 800), // wedding reception
    u('1511578314322-379afb476865', 1200, 800), // corporate event
    u('1555244162-803834f70033', 1200, 800), // buffet spread
    u('1414235077428-338989a2e8c0', 1200, 800), // fine dining
  ],
  about: [
    u('1464366400600-7168b8af9bc3', 600, 750), // wedding banquet
    u('1546069901-ba4a3752c747', 400, 400), // gourmet plating
    u('1476224207421-acaac941d319', 400, 400), // event dining
    u('1504674900247-0877df9cc836', 600, 750), // food spread
  ],
};

const CATERER_IMAGES = {
  northIndian: {
    cover: u('1606491956689-2ea866880f44', 1200, 500),
    logo: u('1585937420432-55d25ccc4db2', 200, 200),
    gallery: [u('1585937420432-55d25ccc4db2'), u('1606491956689-2ea866880f44'), u('1563379091339-85a8f39fd851'), u('1555939594-58d7cb561ad1')],
    dishes: {
      paneer: u('1606491956689-2ea866880f44', 400, 300),
      butterChicken: u('1585937420432-55d25ccc4db2', 400, 300),
      naan: u('1563379091339-85a8f39fd851', 400, 300),
      biryani: u('1563379091339-85a8f39fd851', 400, 300),
      gulabJamun: u('1551024506-0bccd6281a48', 400, 300),
    },
  },
  wedding: {
    cover: u('1519225421980-715cb0215aed', 1200, 500),
    logo: u('1464366400600-7168b8af9bc3', 200, 200),
    gallery: [u('1519225421980-715cb0215aed'), u('1464366400600-7168b8af9bc3'), u('1522673607200-847d5b9f3f48'), u('1555244162-803834f70033')],
    dishes: { lamb: u('1606491956689-2ea866880f44', 400, 300), dessert: u('1551024506-0bccd6281a48', 400, 300) },
  },
  corporate: {
    cover: u('1511578314322-379afb476865', 1200, 500),
    logo: u('1540575467063-178a50c2df87', 200, 200),
    gallery: [u('1511578314322-379afb476865'), u('1540575467063-178a50c2df87'), u('1556761175-b413da4baf72')],
    dishes: { buffet: u('1555244162-803834f70033', 400, 300), coffee: u('1495474472287-4d71bcdd2085', 400, 300) },
  },
  southIndian: {
    cover: u('1601050690117-3f19f42c7eb4', 1200, 500),
    logo: u('1589302178067-a00a5100a08f', 200, 200),
    gallery: [u('1601050690117-3f19f42c7eb4'), u('1589302178067-a00a5100a08f'), u('1630385937418-6c110d0705a5')],
    dishes: {
      dosa: u('1601050690117-3f19f42c7eb4', 400, 300),
      idli: u('1589302178067-a00a5100a08f', 400, 300),
      thali: u('1630385937418-6c110d0705a5', 400, 300),
      payasam: u('1551024506-0bccd6281a48', 400, 300),
    },
  },
  seafood: {
    cover: u('1559339352-11d035aa65de', 1200, 500),
    logo: u('1559339352-11d035aa65de', 200, 200),
    gallery: [u('1559339352-11d035aa65de'), u('1565299624946-b28f40a0ae38'), u('1567620905732-2d1ec7ab7445')],
    dishes: { fish: u('1559339352-11d035aa65de', 400, 300), prawn: u('1565299624946-b28f40a0a0ae38', 400, 300) },
  },
  gujarati: {
    cover: u('1596794090639-b8f1f6296f88', 1200, 500),
    logo: u('1596794090639-b8f1f6296f88', 200, 200),
    gallery: [u('1596794090639-b8f1f6296f88'), u('1606491956689-2ea866880f44')],
    dishes: { thali: u('1596794090639-b8f1f6296f88', 400, 300), dalBaati: u('1606491956689-2ea866880f44', 400, 300) },
  },
  bengali: {
    cover: u('1563379091339-85a8f39fd851', 1200, 500),
    logo: u('1563379091339-85a8f39fd851', 200, 200),
    gallery: [u('1563379091339-85a8f39fd851'), u('1606491956689-2ea866880f44')],
    dishes: { fish: u('1559339352-11d035aa65de', 400, 300), mishti: u('1551024506-0bccd6281a48', 400, 300) },
  },
  vegan: {
    cover: u('1512621776951-a57141f2eefd', 1200, 500),
    logo: u('1540189549336-e6e99c3679fe', 200, 200),
    gallery: [u('1512621776951-a57141f2eefd'), u('1540189549336-e6e99c3679fe'), u('1490645934777-813db6efd685')],
    dishes: { bowl: u('1512621776951-a57141f2eefd', 400, 300), salad: u('1540189549336-e6e99c3679fe', 400, 300) },
  },
  chinese: {
    cover: u('1563379091339-85a8f39fd851', 1200, 500),
    logo: u('1563379091339-85a8f39fd851', 200, 200),
    gallery: [u('1563379091339-85a8f39fd851')],
    dishes: {
      noodles: u('1563379091339-85a8f39fd851', 400, 300),
      friedRice: u('1603131171714-a4d963a09d9b', 400, 300),
      manchurian: u('1582878794940-1247ccada30e', 400, 300),
    },
  },
  dessert: {
    cover: u('1551024506-0bccd6281a48', 1200, 500),
    logo: u('1551024506-0bccd6281a48', 200, 200),
    gallery: [u('1551024506-0bccd6281a48'), u('1488477181946-6428a0291777')],
    dishes: { cake: u('1488477181946-6428a0291777', 400, 300), pastries: u('1551024506-0bccd6281a48', 400, 300) },
  },
};

const STANDARD_MENU_CATEGORIES = [
  'Starters', 'Soups', 'Salads', 'Main Course', 'Breads', 'Rice Items', 'Desserts', 'Beverages',
];

module.exports = { u, FALLBACK, LANDING, CATERER_IMAGES, STANDARD_MENU_CATEGORIES };

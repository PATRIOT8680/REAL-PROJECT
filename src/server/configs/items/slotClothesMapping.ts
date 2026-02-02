export const SLOT_MAPPING = {
  // Головной убор - props[0]
  0: {
    clothesSection: 0,
    type: 'props' as const,
    name: 'Головной убор'
  },

  // Украшения - props[2], clothes[7]
  1: {
    clothesSection: 2,
    type: 'props' as const,
    name: 'Украшения'
  },

  // Маска - clothes[1]
  2: {
    clothesSection: 1,
    type: 'clothes' as const,
    name: 'Маска'
  },

  // Очки - props[1]
  3: {
    clothesSection: 1,
    type: 'props' as const,
    name: 'Очки'
  },

  // Браслет - props[7]
  4: {
    clothesSection: 7,
    type: 'props' as const,
    name: 'Браслет'
  },

  // Футболка - clothes[11]
  5: {
    clothesSection: 11,
    type: 'clothes' as const,
    name: 'Футболка'
  },

  // Перчатки - clothes[3]
  6: {
    clothesSection: 3,
    type: 'clothes' as const,
    name: 'Перчатки'
  },

  // Бронежилет - clothes[9]
  7: {
    clothesSection: 9,
    type: 'clothes' as const,
    name: 'Бронежилет'
  },

  // Куртка/верх - clothes[11]
  8: {
    clothesSection: 11,
    type: 'clothes' as const,
    name: 'Верх'
  },

  // Часы - props[6]
  9: {
    clothesSection: 6,
    type: 'props' as const,
    name: 'Часы'
  },

  // Сумка - clothes[5]
  10: {
    clothesSection: 5,
    type: 'clothes' as const,
    name: 'Рюкзак'
  },

  // Штаны - clothes[4]
  11: {
    clothesSection: 4,
    type: 'clothes' as const,
    name: 'Штаны'
  },

  // Обувь - clothes[6]
  12: {
    clothesSection: 6,
    type: 'clothes' as const,
    name: 'Обувь'
  }
} as const


export const CLOTHES_IMAGE_IDS = {
  0: 100,   // Головной убор
  1: 101,   // Украшения
  2: 102,   // Маска
  3: 103,   // Очки
  4: 104,   // Браслет
  5: 105,   // Футболка
  6: 106,   // Перчатки
  7: 107,   // Бронежилет
  8: 108,   // Куртка
  9: 112,   // Часы
  10: 109,  // Сумка
  11: 110,  // Штаны
  12: 111   // Обувь
} as const;
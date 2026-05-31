type NicknameConfig = {
  nouns: string[];
  descriptors: string[];
  // Word order differs per language (e.g. "Mèo Mơ Màng" vs "Dreamy Cat")
  format: (noun: string, descriptor: string) => string;
};

const DEFAULT_LANG = 'vi';
const MAX_LENGTH = 25;

const vi: NicknameConfig = {
  nouns: [
    // Animals
    'Mèo',
    'Cún',
    'Gấu',
    'Thỏ',
    'Sóc',
    'Heo',
    'Cá Voi',
    'Đại Bàng',
    'Diều Hâu',
    'Hổ',
    'Sư Tử',
    'Voi',
    'Khỉ',
    'Hải Cẩu',
    'Cá Heo',
    'Panda',
    'Cáo',
    'Hươu',
    'Hamster',
    'Gà',
    'Vịt',
    'Thiên Nga',
    // Plants
    'Xoài',
    'Bơ',
    'Dâu',
    'Cam',
    'Chanh',
    'Mận',
    'Mít',
    'Sen',
    'Súng',
    'Dừa',
    'Dứa',
    'Me',
    'Sầu Riêng',
    'Bưởi',
    'Na',
    'Ổi',
    // Flowers
    'Lan',
    'Cúc Vàng',
    'Hồng Đỏ',
    'Hướng Dương',
    'Cẩm Tú Cầu',
    'Bồ Công Anh',
    'Đỗ Quyên',
    'Mai Vàng',
    'Đào Tiên',
    'Huệ Trắng',
    'Nhài',
    'Hoa Sứ',
    'Mười Giờ',
    'Vạn Thọ',
    'Thược Dược',
    'Lay Ơn',
    'Tường Vi',
    'Bằng Lăng',
    'Phượng',
    'Lộc Vừng',
    'Ngọc Lan',
    'Quỳnh',
    'Sim',
  ],
  descriptors: [
    // Adjectives
    'Tăng Động',
    'Mơ Màng',
    'Dễ Thương',
    'Hài Hước',
    'Thông Minh',
    'Lười Biếng',
    'Chăm Chỉ',
    'Xinh Đẹp',
    'Ngầu Lòi',
    'Bụi Bặm',
    'Chill',
    'Vui Vẻ',
    'Hiền Lành',
    'Tinh Nghịch',
    'Trầm Tư',
    'Ngáo Ngơ',
    'Mũm Mĩm',
    'Nhỏ Bé',
    'Khổng Lồ',
    'Kỳ Diệu',
    // Actions
    'Tung Tăng',
    'Đi Dạo',
    'Ngủ Nướng',
    'Bay Nhảy',
    'Ca Hát',
    'Nhảy Múa',
    'Leo Núi',
    'Tắm Nắng',
    'Đọc Sách',
    'Ăn Vặt',
    'Đi Phượt',
    'Chạy Bộ',
    'Câu Cá',
    'Lướt Sóng',
    'Vẽ Tranh',
    'Hái Hoa',
    'Bắt Bướm',
    'Xem Phim',
    'Học Bài',
  ],
  format: (noun, descriptor) => `${noun} ${descriptor}`,
};

const en: NicknameConfig = {
  nouns: [
    // Animals
    'Cat',
    'Puppy',
    'Bear',
    'Bunny',
    'Squirrel',
    'Pig',
    'Whale',
    'Eagle',
    'Hawk',
    'Tiger',
    'Lion',
    'Elephant',
    'Monkey',
    'Seal',
    'Dolphin',
    'Panda',
    'Fox',
    'Deer',
    'Hamster',
    'Chick',
    'Duck',
    'Swan',
    // Plants
    'Mango',
    'Avocado',
    'Berry',
    'Orange',
    'Lemon',
    'Plum',
    'Jackfruit',
    'Lotus',
    'Coconut',
    'Pineapple',
    'Tamarind',
    'Durian',
    'Pomelo',
    'Guava',
    // Flowers
    'Orchid',
    'Daisy',
    'Rose',
    'Sunflower',
    'Hydrangea',
    'Dandelion',
    'Azalea',
    'Apricot',
    'Lily',
    'Jasmine',
    'Frangipani',
    'Marigold',
    'Dahlia',
    'Magnolia',
    'Poppy',
    'Tulip',
  ],
  descriptors: [
    // Adjectives
    'Hyper',
    'Dreamy',
    'Adorable',
    'Funny',
    'Smart',
    'Lazy',
    'Diligent',
    'Pretty',
    'Cool',
    'Scruffy',
    'Chill',
    'Cheerful',
    'Gentle',
    'Mischievous',
    'Pensive',
    'Goofy',
    'Chubby',
    'Tiny',
    'Giant',
    'Magical',
    // Actions
    'Frolicking',
    'Strolling',
    'Sleepy',
    'Leaping',
    'Singing',
    'Dancing',
    'Climbing',
    'Sunbathing',
    'Reading',
    'Snacking',
    'Roaming',
    'Running',
    'Fishing',
    'Surfing',
    'Painting',
    'Wandering',
    'Dreaming',
    'Wishful',
    'Studious',
  ],
  format: (noun, descriptor) => `${descriptor} ${noun}`,
};

const configs: Record<string, NicknameConfig> = { vi, en };

export function generateRandomNickname(lang: string = DEFAULT_LANG): string {
  // Normalize regional codes (e.g. "en-US" -> "en")
  const base = lang.split('-')[0];
  const config = configs[base] ?? configs[DEFAULT_LANG];

  const noun = config.nouns[Math.floor(Math.random() * config.nouns.length)];
  const descriptor =
    config.descriptors[Math.floor(Math.random() * config.descriptors.length)];

  const nickname = config.format(noun, descriptor);

  // Retry if somehow too long (rare with these lists)
  if (nickname.length > MAX_LENGTH) {
    return generateRandomNickname(lang);
  }

  return nickname;
}

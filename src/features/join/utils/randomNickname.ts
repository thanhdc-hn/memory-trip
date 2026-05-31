const animals = [
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
];

const plants = [
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
];

const flowers = [
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
];

const adjectives = [
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
];

const actions = [
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
];

export function generateRandomNickname(): string {
  const nouns = [...animals, ...plants, ...flowers];
  const descriptors = [...adjectives, ...actions];

  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomDescriptor =
    descriptors[Math.floor(Math.random() * descriptors.length)];

  const nickname = `${randomNoun} ${randomDescriptor}`;

  if (nickname.length > 25) {
    // If somehow too long, try again (should be rare with these lists)
    return generateRandomNickname();
  }

  return nickname;
}

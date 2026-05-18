# Memory Trip

Memory Trip là một ứng dụng web (PWA) giúp lưu giữ những kỷ niệm đáng nhớ trong mỗi chuyến đi. Dự án được xây dựng với
mục tiêu tối ưu cho thiết bị di động (Mobile First) và cung cấp trải nghiệm mượt mà như ứng dụng bản địa.

## 🛠 Công nghệ sử dụng

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Sử dụng `@tailwindcss/vite` plugin)
- **Routing**: [React Router Dom v7](https://reactrouter.com/) (Object-based routing)
- **State Management**:
    - Server State: [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
    - Client State: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Backend Service**: [Supabase](https://supabase.com/)
- **PWA**: `vite-plugin-pwa`
- **Chất lượng mã nguồn**: ESLint, Prettier, Husky

## 📂 Cấu trúc thư mục

```text
src/
├── assets/             # Tài nguyên tĩnh (hình ảnh, fonts, v.v.)
├── components/         # Các component dùng chung
│   ├── ui/             # Các component UI (Toast, Dialog, v.v. - shadcn style)
│   ├── error-boundary.tsx
│   └── loading.tsx
├── hoc/                # Higher-Order Components
├── hooks/              # Custom React Hooks (use-toast, v.v.)
├── layouts/            # Các layout bao quanh trang (main-layout, v.v.)
├── lib/                # Cấu hình các thư viện bên thứ ba (supabase.ts)
├── routes/             # Cấu hình hệ thống định tuyến (index.tsx)
├── services/           # Các hàm gọi API hoặc logic nghiệp vụ
├── store/              # Quản lý state toàn cục với Zustand
├── utils/              # Các hàm tiện ích (storage.ts)
├── views/              # Các thành phần giao diện theo trang (home, about, not-found)
├── app.tsx             # Component gốc của ứng dụng
├── main.tsx            # Điểm khởi đầu của ứng dụng (Entry point)
└── style.css           # Cấu hình style toàn cục và Tailwind v4 theme
```

## 🚀 Bắt đầu dự án

### Cài đặt

Sử dụng `pnpm` để quản lý các gói phụ thuộc:

```bash
pnpm install
```

### Biến môi trường

Tạo file `.env` dựa trên mẫu từ `.env.example`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Chạy chế độ phát triển

```bash
pnpm dev
```

### Xây dựng sản phẩm

```bash
pnpm build
```

## 📝 Ghi chú cho lập trình viên

### 1. Path Alias

Dự án sử dụng `@/*` làm alias cho thư mục `src/`.
Ví dụ: `import Button from '@/components/button';`

### 2. Định tuyến (Routing)

- Hệ thống định tuyến được quản lý dưới dạng object tại `src/routes/index.tsx`.
- Sử dụng `lazy` loading cho các trang để tối ưu hiệu năng.
- Sử dụng HOC `with-suspense` để tự động bọc component bằng `Suspense` và `loading` fallback.

### 3. Tiện ích Storage

Sử dụng `src/utils/storage.ts` để thao tác với `localStorage` một cách an toàn và có hỗ trợ kiểu dữ liệu (TypeScript).
Hàm `clear` có hỗ trợ tùy chọn `keep` để giữ lại các key cần thiết.

### 4. Giao diện Mobile First

- Ứng dụng được thiết kế ưu tiên cho di động.
- Trên Desktop, nội dung được giới hạn ở chiều rộng tối đa của máy tính bảng (768px) và căn giữa màn hình.

### 5. Định dạng mã nguồn

- Dự án áp dụng nguyên tắc đặt tên file và thư mục sử dụng kebab-case (ví dụ: `name-abc`, `main-layout.tsx`).
- Dự án có cấu hình tự động sắp xếp (sort) imports thông qua Prettier plugin.
- Các class Tailwind CSS cũng được tự động sắp xếp lại theo chuẩn.
- Husky sẽ chạy `lint` và `format` trước mỗi lần commit.

### 6. Các quy tắc phát triển tốt nhất (React Best Practices)

- Sử dụng named imports cho React (ví dụ: `import { useState, useEffect } from 'react'`) thay vì `React.useState`.
- Sử dụng `src/utils/storage.ts` cho tất cả các thao tác với `localStorage`.
- Tránh sử dụng các thẻ tiêu đề như `h1`, `h2`, v.v. Ưu tiên sử dụng `div`, `span`, hoặc `p` với định dạng CSS phù hợp
  để đảm bảo tính linh hoạt và phong cách thiết kế của ứng dụng.
- Lối vào bí mật cho Admin: Nhấp/chạm 10 lần liên tiếp vào bất kỳ đâu trên màn hình để truy cập trang `/admin`.

## 📱 PWA (Progressive Web App)

Dự án đã tích hợp Service Worker để hỗ trợ cài đặt ứng dụng và chạy offline. Cấu hình chi tiết nằm trong
`vite.config.ts`.

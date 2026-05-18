import { type FC } from 'react';
import { Link } from 'react-router-dom';

const About: FC = () => {
  return (
    <section className="p-8 text-center">
      <div className="mb-4 text-4xl font-bold text-[#aa3bff]">Về Chúng Tôi</div>
      <p className="mx-auto mb-8 max-w-2xl text-gray-600 dark:text-gray-400">
        Memory Trip là ứng dụng giúp bạn lưu giữ những kỷ niệm đáng nhớ trong
        mỗi chuyến đi. Với giao diện hiện đại, tối ưu cho di động và công nghệ
        đồng bộ hóa mạnh mẽ.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/"
          className="rounded-xl border-2 border-[#aa3bff] px-6 py-2 font-semibold text-[#aa3bff] transition hover:bg-[#aa3bff] hover:text-white"
        >
          Quay lại
        </Link>
      </div>
    </section>
  );
};

export default About;

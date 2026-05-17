import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <section className="p-8 text-center">
      <div className="mb-8 flex justify-center">
        <div className="h-20 w-20 rounded-full bg-[#aa3bff] p-4 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
            />
          </svg>
        </div>
      </div>
      <h1 className="mb-4 text-4xl font-bold text-[#aa3bff]">Memory Trip</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Chào mừng bạn đến với Memory Trip - Nơi lưu giữ những kỷ niệm đáng nhớ!
      </p>
      <div className="flex flex-col gap-4">
        <Link
          to="/about"
          className="rounded-xl bg-[#aa3bff] px-6 py-3 font-semibold text-white transition hover:bg-[#932ee0]"
        >
          Khám phá ngay
        </Link>
      </div>
    </section>
  );
};

export default Home;

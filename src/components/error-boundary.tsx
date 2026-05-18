import { type FC } from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorBoundary: FC = () => {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-4 text-4xl font-bold text-red-500">Oops!</div>
      <p className="mb-4 text-xl">Đã có lỗi xảy ra.</p>
      <p className="mb-8 text-gray-500">
        <i>{error.statusText || error.message}</i>
      </p>
      <button
        onClick={() => (window.location.href = '/')}
        className="rounded bg-[#aa3bff] px-6 py-2 text-white hover:bg-[#932ee0]"
      >
        Quay lại trang chủ
      </button>
    </div>
  );
};

export default ErrorBoundary;

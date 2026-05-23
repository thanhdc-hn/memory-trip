import { type FC } from 'react';

const Loading: FC = () => {
  return (
    <div className="flex h-full min-h-50 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#aa3bff] border-t-transparent"></div>
    </div>
  );
};

export default Loading;

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import errorImage from '@/assets/images/404.webp';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('misc');
  const goHomePage = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 dark:bg-[#0f1014]">
      <div className="w-full max-w-lg text-center">
        <div className="relative mb-4 h-50 sm:h-70">
          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center text-[100px] font-black tracking-[-20px] text-[#222] uppercase sm:text-[150px] dark:text-white">
            4
            <span
              className="inline-block h-30 w-30 bg-cover bg-center sm:h-45 sm:w-45"
              style={{ backgroundImage: `url(${errorImage})` }}
            ></span>
            4
          </div>
        </div>
        <div className="mb-4 text-2xl font-bold text-[#222] uppercase sm:text-3xl dark:text-white">
          {t('notFound.title')}
        </div>
        <p className="mb-8 text-sm font-medium text-[#222] sm:text-base dark:text-gray-400">
          {t('notFound.description')}
        </p>
        <button
          onClick={goHomePage}
          className="bg-accent inline-block rounded-full px-8 py-3 text-sm font-bold text-white uppercase transition-all hover:bg-[#932ee0] hover:shadow-lg active:scale-95"
        >
          {t('notFound.backHome')}
        </button>
      </div>
    </div>
  );
};

export default NotFound;

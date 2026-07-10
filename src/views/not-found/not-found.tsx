import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import errorImage from '@/assets/images/404.webp';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('misc');
  const goHomePage = () => {
    navigate('/');
  };

  return (
    <div className="bg-surface flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        <div className="relative mb-4 h-50 sm:h-70">
          <div className="text-text absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center text-[100px] font-black tracking-[-20px] uppercase sm:text-[150px]">
            4
            <span
              className="inline-block h-30 w-30 bg-cover bg-center sm:h-45 sm:w-45"
              style={{ backgroundImage: `url(${errorImage})` }}
            ></span>
            4
          </div>
        </div>
        <div className="text-text-h mb-4 text-2xl font-bold uppercase sm:text-3xl">
          {t('notFound.title')}
        </div>
        <p className="text-text mb-8 text-sm font-medium sm:text-base">
          {t('notFound.description')}
        </p>
        <Button
          onClick={goHomePage}
          variant="accent"
          size="lg"
          className="uppercase"
        >
          {t('notFound.backHome')}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

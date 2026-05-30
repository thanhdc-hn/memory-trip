import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router-dom';

const ErrorBoundary: FC = () => {
  const error = useRouteError() as any;
  const { t } = useTranslation('misc');
  console.error(error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-4 text-4xl font-bold text-red-500">
        {t('error.title')}
      </div>
      <p className="mb-4 text-xl">{t('error.message')}</p>
      <p className="mb-8 text-gray-500">
        <i>{error.statusText || error.message}</i>
      </p>
      <button
        onClick={() => (window.location.href = '/')}
        className="rounded bg-[#aa3bff] px-6 py-2 text-white hover:bg-[#932ee0]"
      >
        {t('error.backHome')}
      </button>
    </div>
  );
};

export default ErrorBoundary;

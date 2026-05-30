import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const About: FC = () => {
  const { t } = useTranslation('misc');
  return (
    <section className="p-8 text-center">
      <div className="mb-4 text-4xl font-bold text-[#aa3bff]">
        {t('about.title')}
      </div>
      <p className="mx-auto mb-8 max-w-2xl text-gray-600 dark:text-gray-400">
        {t('about.body')}
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/"
          className="rounded-xl border-2 border-[#aa3bff] px-6 py-2 font-semibold text-[#aa3bff] transition hover:bg-[#aa3bff] hover:text-white"
        >
          {t('about.back')}
        </Link>
      </div>
    </section>
  );
};

export default About;

import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const SubmitYouProject: React.FC<{ blackMode?: boolean }> = ({ blackMode }) => {
  const { t } = useTranslation();
  const router = useRouter();
  if (router.pathname === '/submit-your-project') {
    return null;
  }

  return (
    <Link
      href="/submit-your-project"
      className={
        'ml-2 cursor-pointer truncate border-2 border-white bg-black px-4 py-2 font-medium text-white xl:px-1'
      }
    >
      {t('common:header.submit_your_project')}
    </Link>
  );
};

export default SubmitYouProject;

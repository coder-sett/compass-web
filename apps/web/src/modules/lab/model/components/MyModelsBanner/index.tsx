import React from 'react';
import classnames from 'classnames';
import style from './index.module.css';
import Center from '@common/components/Layout/Center';
import { useTranslation } from 'next-i18next';

const Banner = ({ text = '' }) => {
  const { t } = useTranslation();
  return (
    <div
      className={classnames(
        'relative h-40 overflow-hidden bg-[#ffebbf]',
        style.headerBgLine
      )}
    >
      <div
        className={classnames(
          'absolute  right-28 bottom-0 h-60 w-[376px] md:-right-[300px]',
          style.headerBgGraph
        )}
      />

      <Center>
        <div
          className={classnames(
            'mt-14 text-4xl font-bold text-[#886F36] md:pl-2'
          )}
        >
          {text || t('lab:my_models')}
        </div>
      </Center>
    </div>
  );
};

export default Banner;

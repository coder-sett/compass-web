import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import jsonData from './FromData.json';
import Link from 'next/link';
import Image from 'next/image';
import { BsArrowRight } from 'react-icons/bs';
import DatePicker from './DatePicker';
import getLocale from '@common/utils/getLocale';
import LinkX from '@common/components/LinkX';

const FromBox = (props: {
  type: string;
  title: string;
  titleCn: string;
  img?: string;
  url?: string;
}) => {
  const { t, i18n } = useTranslation();
  const typeMap = {
    Announcement: t('home:announcement'),
    Report: t('home:report'),
    Event: t('home:event'),
  };
  const { type, title, titleCn, img, url } = props;
  return (
    <div>
      <div className="h-[430px] rounded border p-6 shadow">
        <span
          className={classnames('h-6 max-w-[110px] px-2 py-1 text-sm', {
            'border-[#A3BDFF] bg-[#F1F5FF] text-[#6E89CD]':
              type === 'Announcement',
            'border-[#A8E99B] bg-[#F1FFF4] text-[#5ECA66]': type === 'Report',
            'border-[#DDA3FF] bg-[#FBF1FF] text-[#B26ECD]': type === 'Event',
          })}
        >
          {typeMap[type]}
        </span>
        {type === 'Event' ? (
          <>
            <div className="line-clamp-3 mt-2 h-[46px] text-2xl font-bold">
              {i18n.language === 'en' ? title : titleCn}
            </div>
            <DatePicker />
          </>
        ) : (
          <>
            <div className="line-clamp-3 mt-2 h-[96px] text-2xl font-bold">
              {i18n.language === 'en' ? title : titleCn}
            </div>
            <div className="mt-4 mb-6">
              <Image
                width={336}
                height={190}
                src={img}
                unoptimized
                alt={''}
                style={{
                  maxWidth: '100%',
                  height: '190px',
                }}
              />
            </div>
            <div className="h-8 leading-8">
              <LinkX href={url || ''}>
                {t('home:read_more')}
                <BsArrowRight className="ml-2 inline-block text-xs" />
              </LinkX>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const LatestFrom = () => {
  const { t } = useTranslation();
  const data = jsonData['formData'];
  return (
    <section
      className={classnames(
        'relative mx-auto grid w-[1200px] pt-[40px] pb-6',
        'lg:w-full lg:grid-cols-1 lg:gap-y-6 lg:px-4'
      )}
    >
      <div className="mb-6 text-2xl font-bold">{t('home:the_latest_from')}</div>
      <div className="mb-10 grid h-[430px] grid-cols-3 gap-5">
        {data.map(({ type, title, title_cn, img, url }) => {
          return (
            <FromBox
              type={type}
              title={title}
              titleCn={title_cn}
              img={img}
              url={url}
              key={type}
            />
          );
        })}
      </div>
    </section>
  );
};

export default LatestFrom;

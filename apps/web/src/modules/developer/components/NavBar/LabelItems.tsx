import React from 'react';
import { useTranslation } from 'next-i18next';
import useCompareItems from '@modules/developer/hooks/useCompareItems';
import { getProvider } from '@common/utils';
import ImageFallback from '@common/components/ImageFallback';
import classnames from 'classnames';
import ProviderIcon from '../ProviderIcon';
import client from '@common/gqlClient';
import { useCommunityReposQuery } from '@oss-compass/graphql';

const Avatar = () => {
  return (
    <div className="relative">
      <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-100">
        <ImageFallback
          src={'https://avatars.githubusercontent.com/u/53640896?v=4'}
          unoptimized
          width={32}
          height={32}
          style={{
            objectFit: 'cover',
          }}
          fallbackSrc={'/images/default.png'}
          alt="logo"
        />
      </div>
      {/* <div className="absolute -bottom-0.5 -right-0.5 z-10 rounded-full bg-white p-0.5">
        <ProviderIcon provider={'github'} />
      </div> */}
    </div>
  );
};
const LabelItems = () => {
  const { t } = useTranslation();
  const { compareItems } = useCompareItems();
  const item = compareItems.length > 0 ? [compareItems[0]] : [];

  return (
    <>
      <div className="relative flex h-6 flex-1 items-center overflow-hidden">
        {item.map(({ name, label, level }) => {
          const host = getProvider(label);
          let labelNode = (
            <span className={'ml-1 mr-1 font-semibold'}>{name}</span>
          );
          return (
            <div key={label} className={classnames('flex items-center')}>
              <Avatar />
              <a
                className="ml-1 mr-1 whitespace-nowrap font-semibold hover:underline"
                href={label}
                target="_blank"
                rel={'noreferrer'}
              >
                lishengbao
              </a>
              <div className="ml-2 rounded-[10px] bg-[#FFF9F2] px-2 py-0.5 text-xs text-[#D98523]">
                开发者
              </div>
            </div>
          );
        })}
      </div>
      <div className="hidden md:block">
        {/* todo show compare items in mobile */}
      </div>
    </>
  );
};

export default LabelItems;

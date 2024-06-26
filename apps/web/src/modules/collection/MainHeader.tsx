import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Collection } from '@modules/explore/type';
import jsonData from '@public/data/collections.json';
import classnames from 'classnames';
import { getShortCompareLink } from '@common/utils';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdOutlineSort } from 'react-icons/md';
import { useHotkeys } from 'react-hotkeys-hook';
import Compare from './assets/compare.svg';
import { Dropdown } from 'antd';

const collectionsMap = jsonData as unknown as Record<string, Collection>;

const MainHeader = ({
  slug,
  nameKey,
  total,
  compareIds,
  compareMode,
  onCompareModeChange,
  keyword,
  setKeyword,
  setSort,
}: {
  slug: string;
  nameKey: 'name_cn' | 'name';
  total: number;
  compareIds: string[];
  compareMode: boolean;
  onCompareModeChange: (v: boolean) => void;
  keyword: string;
  setKeyword: (v: string) => void;
  setSort: (v: any) => void;
}) => {
  const router = useRouter();

  const { t } = useTranslation();

  const ident = Object.keys(collectionsMap).find((ident) => {
    return collectionsMap[ident].slug === `/${slug}`;
  });
  const collection = ident ? collectionsMap[ident] : null;

  const [value, setValue] = useState(keyword);
  useEffect(() => {
    setValue('');
    setActive('1');
  }, [ident]);
  useHotkeys(
    'enter',
    (e, he) => {
      e.preventDefault();
      const press = he.key;
      if (press === 'enter') {
        if (!value) return;
        setKeyword?.(value);
      }
    },
    { enableOnTags: ['INPUT'] }
  );
  const onClick = ({ key }) => {
    setActive(key);
    let item = sortList.find((z) => {
      return z.key === key;
    });
    let type = item.type;
    let direction = item.direction;
    console.log(type, direction);
    setSort({ type, direction });
  };
  const [active, setActive] = useState('1');
  const sortList = [
    {
      type: 'activity_score',
      direction: 'desc',
      key: '1',
      name: t('collection:descending_order_of_activity'),
    },
    {
      type: 'activity_score',
      direction: 'asc',
      key: '2',
      name: t('collection:ascending_order_of_activity'),
    },
  ];
  const items = sortList.map((item) => {
    return {
      label: (
        <span className={classnames({ 'text-[#1677ff]': active === item.key })}>
          {item.name}
        </span>
      ),
      key: item.key,
    };
  });
  return (
    <div className="flex justify-between px-8 pt-4 pb-5 md:hidden">
      <div className="mr-8">
        <div className="text-xl font-bold">
          {collection && collection[nameKey]}
        </div>
        <div className="text-xs text-gray-400">
          {t('collection:repositories', {
            length: total,
          })}
        </div>
      </div>
      <div className="pt-1">
        {compareMode ? (
          <div className="flex text-xs ">
            <div className="text-sm leading-8 text-gray-400">
              {t('collection:please_select_two_or_more_repositories_below')}
            </div>
            <div
              onClick={() => {
                onCompareModeChange(false);
              }}
              className="ml-5 h-8 cursor-pointer border border-gray-500 px-3 py-2 text-center text-xs text-black "
            >
              {t('collection:cancel')}
            </div>
            <div
              onClick={async () => {
                if (compareIds.length > 1) {
                  await window.open(getShortCompareLink(compareIds), '_blank');
                }
                // setSelect(false);
              }}
              className={classnames(
                'ml-2 h-8 cursor-pointer border-0 border-gray-500 bg-blue-600 px-3 py-2 text-center text-xs text-gray-50',
                { 'bg-gray-300': compareIds.length < 2 }
              )}
            >
              {t('collection:compare')}
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              onCompareModeChange(true);
            }}
            className="h-8 flex-none cursor-pointer border border-gray-500 px-2 text-center text-xs font-semibold leading-8"
          >
            <div className="mr-2 inline-block align-text-bottom">
              <Compare />
            </div>

            {t('collection:pick_for_compare')}
          </div>
        )}
      </div>
      <div className="ml-4 pt-1">
        <div className="flex items-center border border-gray-500 px-2 md:px-2">
          <input
            value={value}
            type="text"
            className={classnames(
              'h-[30px] w-full appearance-none bg-transparent text-sm outline-0',
              'md:h-[30px] md:text-sm'
            )}
            placeholder={t('collection:search_repository')}
            onChange={(event) => {
              const val = event.target.value;
              setValue(val);
            }}
            alt={'Type the name to insight into your project'}
          />
          <div
            onClick={() => {
              setKeyword(value);
            }}
            className="h-6 w-8 cursor-pointer select-none pl-2"
          >
            <AiOutlineSearch className="h-full w-full" />
          </div>
        </div>
      </div>
      <div className="ml-auto mt-2 cursor-pointer text-2xl">
        <Dropdown menu={{ items, onClick }}>
          <a
            className="hover:text-[#1677ff]"
            onClick={(e) => e.preventDefault()}
          >
            <MdOutlineSort />
          </a>
        </Dropdown>
      </div>
    </div>
  );
};

export default MainHeader;

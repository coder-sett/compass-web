import React, { useState, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { useGetContributionTypeI18n } from '../contribution';
import { getDomainData, getIcons } from '../utils';
import { toFixed } from '@common/utils';
import classnames from 'classnames';
import Popper from '@mui/material/Popper';

const PopperContent = ({ dataList, name, active, setActive, origin }) => {
  const { t } = useTranslation();
  const activeItem = dataList
    .find((item) => item.type === active)
    ?.childern.sort((a, b) => b.contribution - a.contribution);
  // const allType = ['Code', 'Code Admin', 'Issue', 'Issue Admin', 'Observe'];
  return (
    <div className="right-0 rounded bg-[#fcfcfc] text-xs drop-shadow-md">
      <div className="flex h-10 items-center pl-3 text-sm font-semibold">
        {getIcons(origin, name)}
        {name + ' ' + t('analyze:metric_detail:domain_persona_details')}
      </div>
      <div className="flex h-[300px]">
        <div className="flex h-full w-40 flex-shrink-0 flex-col border-t">
          {dataList.map(({ type, color, contribution }) => {
            return (
              <div
                key={type}
                onClick={() => {
                  setActive(type);
                }}
                className={classnames(
                  'flex h-9 w-full cursor-pointer items-center justify-between border-b border-r bg-[#F6F6F6] last:border-b-0',
                  { '!border-r-0 !bg-[#FFFFFF]': active === type }
                )}
              >
                <div
                  style={{ backgroundColor: color }}
                  className="ml-3 h-2 w-2"
                ></div>
                <div className="ml-2 text-xs font-bold">{type}</div>
                <div className="ml-auto mr-3 text-[#868690]">
                  {contribution}
                </div>
              </div>
            );
          })}
          <div className="flex-1 border-r bg-[#F6F6F6]"></div>
        </div>
        <div className="h-full w-[216px] flex-shrink-0 overflow-auto border-t px-4 py-2 text-xs">
          {activeItem?.map(({ text, contribution }) => {
            return (
              <div
                key={text}
                className="flex h-7 w-full items-center justify-between"
              >
                <div className="text-[#2C3542]">{text}</div>
                <div className="text-[#868690]">{contribution}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const DomainPersona = ({ maxDomain, dataList, name, origin }) => {
  const contributionTypeMap = useGetContributionTypeI18n();
  const domainData = useMemo(() => {
    return getDomainData(dataList, contributionTypeMap);
  }, [dataList, contributionTypeMap]);
  const [active, setActive] = useState('');
  const [popperOpen, togglePopperOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>, type) => {
    setActive(type);
    setAnchorEl(event.currentTarget);
    togglePopperOpen(() => true);
  };

  return (
    <div
      onMouseLeave={() => {
        setActive('');
        popperOpen && togglePopperOpen(() => false);
      }}
    >
      <div className="flex items-center">
        {domainData.map(({ type, color, contribution }) => {
          const width = toFixed((contribution / maxDomain) * 100, 2);
          return active === type ? (
            <div
              key={type}
              className="cursor-pointer border"
              style={{
                width: `${width}%`,
                borderColor: color,
                padding: '1px',
              }}
            >
              <div className="h-2" style={{ backgroundColor: color }}></div>
            </div>
          ) : (
            <div
              key={type}
              onMouseEnter={(e) => {
                handleClick(e, type);
              }}
              style={{ backgroundColor: color, width: `${width}%` }}
              className="h-2 cursor-pointer"
            ></div>
          );
        })}
      </div>
      <Popper
        open={popperOpen}
        style={{
          zIndex: 1000,
        }}
        placement={'bottom'}
        anchorEl={anchorEl}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 0],
            },
          },
        ]}
      >
        <PopperContent
          dataList={domainData}
          name={name}
          active={active}
          setActive={setActive}
          origin={origin}
        />
      </Popper>
    </div>
  );
};

export default DomainPersona;

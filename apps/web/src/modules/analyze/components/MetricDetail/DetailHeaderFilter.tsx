import React, { useState } from 'react';
import { Select } from 'antd';
import { useTranslation } from 'next-i18next';
import CommunityFilter from './CommunityFilter';

const DetailHeaderFilter: React.FC<{
  type: string;
  level: string;
  label: string;
  isBot?: boolean;
  onBotChange?: (v) => void;
  onRepoChange?: (v) => void;
}> = ({ type, level, label, isBot, onBotChange, onRepoChange }) => {
  const { t } = useTranslation();

  const isBotOptions = [
    {
      label: t('analyze:metric_detail:include_robot'),
      value: true,
    },
    {
      label: t('analyze:metric_detail:exclude_robot'),
      value: false,
    },
  ];
  if (type == 'issue') {
    return (
      <>
        {level === 'community1' ? (
          <CommunityFilter
            label={label}
            onRepoChange={(v) => onRepoChange(v)}
          />
        ) : (
          <div className="mb-1 text-lg font-semibold text-[#000000]">
            {t('analyze:metric_detail:issues')}
          </div>
        )}
      </>
    );
  } else if (type == 'pr') {
    return (
      <>
        {level === 'community1' ? (
          <CommunityFilter
            label={label}
            onRepoChange={(v) => onRepoChange(v)}
          />
        ) : (
          <div className="mb-1 text-lg font-semibold text-[#000000]">
            {t('analyze:metric_detail:pull_requests')}
          </div>
        )}
      </>
    );
  } else {
    return (
      <div className="flex gap-2">
        {level === 'community' ? (
          <>
            <CommunityFilter
              label={label}
              onRepoChange={(v) => onRepoChange(v)}
            />
            <Select
              style={{ width: 130 }}
              onChange={(v) => {
                onBotChange(v);
                //   handleQueryParams({ tab: v });
              }}
              value={isBot}
              options={isBotOptions}
            />
          </>
        ) : (
          <Select
            style={{ width: 130 }}
            onChange={(v) => {
              onBotChange(v);
              //   handleQueryParams({ tab: v });
            }}
            value={isBot}
            options={isBotOptions}
          />
        )}
      </div>
    );
  }
};

export default DetailHeaderFilter;

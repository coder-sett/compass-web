import React, { useMemo, useState } from 'react';
import { Activity } from '@modules/developer/components/SideBar/config';
import BaseCard from '@common/components/BaseCard';
import ChartWithData from '@modules/developer/components/ChartWithData';
import EChartX from '@common/components/EChartX';
import { GenChartOptions, TransOpt } from '@modules/developer/type';
import { useTranslation } from 'next-i18next';
import useGetLineOption from '@modules/developer/hooks/useGetLineOption';

import CardDropDownMenu from '@modules/developer/components/CardDropDownMenu';

const CodeReviewCount = () => {
  const { t } = useTranslation();
  const tansOpts: TransOpt = {
    legendName: t(
      'metrics_models:community_activity.metrics.code_review_count'
    ),
    xKey: 'grimoireCreationDate',
    yKey: 'metricActivity.codeReviewCount',
    summaryKey: 'summaryActivity.codeReviewCount',
  };
  const {
    showAvg,
    setShowAvg,
    showMedian,
    setShowMedian,
    getOptions,
    yAxisScale,
    setYAxisScale,
  } = useGetLineOption();

  return (
    <BaseCard
      title={t('metrics_models:community_activity.metrics.code_review_count')}
      id={Activity.CodeReviewCount}
      description={t(
        'metrics_models:community_activity.metrics.code_review_count_desc'
      )}
      weight={t(
        'metrics_models:community_activity.metrics.code_review_count_more.weight'
      )}
      threshold={t(
        'metrics_models:community_activity.metrics.code_review_count_more.threshold'
      )}
      detail={t(
        'metrics_models:community_activity.metrics.code_review_count_more.detail'
      )}
      docLink={'/docs/metrics-models/robustness/activity/#code-review-count'}
      headRight={(ref, fullScreen, setFullScreen) => (
        <CardDropDownMenu
          cardRef={ref}
          fullScreen={fullScreen}
          onFullScreen={(b) => {
            setFullScreen(b);
          }}
          showAvg={showAvg}
          onAvgChange={(b) => setShowAvg(b)}
          showMedian={showMedian}
          onMedianChange={(b) => setShowMedian(b)}
          yAxisScale={yAxisScale}
          onYAxisScaleChange={(b) => setYAxisScale(b)}
          yKey={tansOpts['yKey']}
        />
      )}
    >
      {(ref) => {
        return (
          <ChartWithData tansOpts={tansOpts} getOptions={getOptions}>
            {({ loading, option }) => {
              return (
                <EChartX containerRef={ref} loading={loading} option={option} />
              );
            }}
          </ChartWithData>
        );
      }}
    </BaseCard>
  );
};

export default CodeReviewCount;

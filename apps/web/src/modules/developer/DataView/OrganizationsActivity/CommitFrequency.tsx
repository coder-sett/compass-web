import React, { useMemo } from 'react';
import { Organizations } from '@modules/developer/components/SideBar/config';
import BaseCard from '@common/components/BaseCard';
import ChartWithData from '@modules/developer/components/ChartWithData';
import EChartX from '@common/components/EChartX';
import { TransOpt, GenChartOptions } from '@modules/developer/type';
import { useTranslation } from 'next-i18next';
import useGetLineOption from '@modules/developer/hooks/useGetLineOption';
import CardDropDownMenu from '@modules/developer/components/CardDropDownMenu';

const CommitFrequency = () => {
  const { t } = useTranslation();
  const tansOpts: TransOpt = {
    legendName: t(
      'metrics_models:organization_activity.metrics.commit_frequency'
    ),
    xKey: 'grimoireCreationDate',
    yKey: 'metricGroupActivity.commitFrequency',
    summaryKey: 'summaryGroupActivity.commitFrequency',
  };
  const {
    getOptions,
    showAvg,
    showMedian,
    setShowAvg,
    setShowMedian,
    yAxisScale,
    setYAxisScale,
  } = useGetLineOption();
  return (
    <BaseCard
      title={t('metrics_models:organization_activity.metrics.commit_frequency')}
      id={Organizations.CommitFrequency}
      description={'每月代码提交次数'}
      weight={t(
        'metrics_models:organization_activity.metrics.commit_frequency_more.weight'
      )}
      threshold={t(
        'metrics_models:organization_activity.metrics.commit_frequency_more.threshold'
      )}
      detail={t(
        'metrics_models:organization_activity.metrics.commit_frequency_more.detail'
      )}
      docLink={
        '/docs/metrics-models/niche-creation/organization-activity/#commit-frequency'
      }
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

export default CommitFrequency;

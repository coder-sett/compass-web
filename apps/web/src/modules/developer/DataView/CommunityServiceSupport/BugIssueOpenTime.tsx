import React, { useMemo, useState } from 'react';
import { EChartsOption } from 'echarts';
import { Support } from '@modules/developer/components/SideBar/config';
import BaseCard from '@common/components/BaseCard';
import { ChartDataProvider } from '@modules/developer/options';
import ChartOptionContainer from '@modules/developer/components/Container/ChartOptionContainer';
import EChartX from '@common/components/EChartX';
import { useTranslation } from 'next-i18next';
import Tab from '@common/components/Tab';
import { GenChartOptions, TransOpt } from '@modules/developer/type';
import useGetLineOption from '@modules/developer/hooks/useGetLineOption';
import { getYAxisWithUnit } from '@common/options';
import { DataContainerResult } from '@modules/developer/type';
import CardDropDownMenu from '@modules/developer/components/CardDropDownMenu';

const BugIssueOpenTime = () => {
  const { t, i18n } = useTranslation();

  const tabOptions = [
    { label: t('analyze:average'), value: '1' },
    { label: t('analyze:median'), value: '2' },
  ];

  const chartTabs = {
    '1': {
      legendName: t('analyze:average'),
      xKey: 'grimoireCreationDate',
      yKey: 'metricCommunity.issueOpenTimeAvg',
      summaryKey: 'summaryCommunity.issueOpenTimeAvg',
    },
    '2': {
      legendName: t('analyze:median'),
      xKey: 'grimoireCreationDate',
      yKey: 'metricCommunity.issueOpenTimeMid',
      summaryKey: 'summaryCommunity.issueOpenTimeMid',
    },
  };

  const [tab, setTab] = useState<TabValue>('1');
  type TabValue = keyof typeof chartTabs;
  const tansOpts: TransOpt = chartTabs[tab];

  const indicators = t('analyze:negative_indicators');
  const unit = t('analyze:unit_label', {
    unit: t('analyze:unit_day'),
  });

  const {
    getOptions,
    showAvg,
    showMedian,
    setShowMedian,
    setShowAvg,
    yAxisScale,
    setYAxisScale,
  } = useGetLineOption({ indicators });

  const appendOptions = (
    options: EChartsOption,
    result: DataContainerResult
  ): EChartsOption => {
    return {
      ...options,
      ...getYAxisWithUnit({
        result,
        indicators,
        unit,
        namePaddingLeft: i18n.language === 'zh' ? 0 : 35,
        scale: yAxisScale,
      }),
    };
  };

  return (
    <BaseCard
      title={t(
        'metrics_models:community_service_and_support.metrics.bug_issue_open_time'
      )}
      id={Support.BugIssueOpenTime}
      description={t(
        'metrics_models:community_service_and_support.metrics.bug_issue_open_time_desc'
      )}
      weight={t(
        'metrics_models:community_service_and_support.metrics.bug_issue_open_time_more.weight'
      )}
      threshold={t(
        'metrics_models:community_service_and_support.metrics.bug_issue_open_time_more.threshold'
      )}
      detail={t(
        'metrics_models:community_service_and_support.metrics.bug_issue_open_time_more.detail'
      )}
      notes={t(
        'metrics_models:community_service_and_support.metrics.bug_issue_open_time_more.notes'
      )}
      docLink={
        '/docs/metrics-models/productivity/community-service-and-support/#bug-issue-open-time'
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
      bodyClass={'h-[400px]'}
    >
      {(ref) => {
        return (
          <>
            <div className="mb-4">
              <Tab
                options={tabOptions}
                value={tab}
                onChange={(v) => setTab(v as TabValue)}
              />
            </div>
            <ChartDataProvider tansOpts={tansOpts}>
              {({ loading, result }) => {
                return (
                  <ChartOptionContainer
                    data={result}
                    indicators={indicators}
                    optionCallback={getOptions}
                  >
                    {({ option }) => {
                      const opts = appendOptions(option, result);
                      return (
                        <EChartX
                          loading={loading}
                          option={opts}
                          containerRef={ref}
                        />
                      );
                    }}
                  </ChartOptionContainer>
                );
              }}
            </ChartDataProvider>
          </>
        );
      }}
    </BaseCard>
  );
};

export default BugIssueOpenTime;

import React, { useState } from 'react';
import Tab from '@common/components/Tab';
import { useTranslation } from 'next-i18next';
import BaseCard from '@common/components/BaseCard';
import EChartX from '@common/components/EChartX';
import first from 'lodash/first';
import {
  useLabModelVersionReportDetailQuery,
  LabModelVersionReportDetailQuery,
} from '@oss-compass/graphql';
import {
  getColorWithLabel,
  getLineOption,
  legendFormat,
  line,
  getTooltipsFormatter,
  colors,
} from '@common/options';
import { formatISO } from '@common/utils';
import CardHeadButtons from './CardHeadButtons';

const LabMetricCard = ({
  panel,
}: {
  panel: LabModelVersionReportDetailQuery['labModelVersionReportDetail']['panels'][number];
}) => {
  const { t } = useTranslation();
  const color = '#5470c6';
  const { diagrams, metric } = panel;
  const firstItem = first(diagrams);

  const hasTab = diagrams?.length > 1;

  const [tab, setTab] = useState<string>(firstItem.tabIdent);
  const tabs = diagrams?.map?.((i) => ({
    label: i.tabIdent,
    value: i.tabIdent,
  }));

  const currentItem = diagrams.find((i) => i.tabIdent === tab);

  const opts = getLineOption({
    xAxisData: currentItem.dates.map((i) => formatISO(i)),
    series: line({
      name: metric.ident,
      data: currentItem.values,
      color,
    }),
    yAxis: { type: 'value', scale: true },
  });

  const key = `lab_metrics:${metric.category}.${currentItem.tabIdent}`;
  const keyDesc = `lab_metrics:${metric.category}.${currentItem.tabIdent}_desc`;

  return (
    <BaseCard
      title={t(key)}
      id={currentItem.tabIdent}
      description={t(keyDesc)}
      headRight={(ref, fullScreen, setFullScreen) => <CardHeadButtons />}
      bodyClass={'h-[400px]'}
      bodyRender={(ref, fullScreen) => {
        return (
          <>
            {hasTab ? (
              <div className="mb-4">
                <Tab options={tabs} value={tab} onChange={(v) => setTab(v)} />
              </div>
            ) : null}
            <EChartX loading={false} option={opts} containerRef={ref} />
          </>
        );
      }}
    />
  );
};

export default LabMetricCard;

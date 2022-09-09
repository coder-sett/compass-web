import React, { useEffect, useMemo, useRef } from 'react';
import { MetricQuery, useMetricQuery } from '@graphql/generated';
import EChartX from '@common/components/EChartX';
import { getLineOption, mapToLineAreaSeries, toTimeXAxis } from '../options';
import BaseCard from '@common/components/BaseCard';
import useMetricQueryData from '@modules/analyze/hooks/useMetricQueryData';

const ContributorCount: React.FC<{
  loading?: boolean;
  data: { url: string; result: MetricQuery | undefined }[];
}> = ({ loading = false, data }) => {
  const echartsOpts = useMemo(() => {
    if (!data[0]?.result?.metricCodequality) return {};

    const metricCodequality = data[0].result.metricCodequality;
    const xAxisDate = toTimeXAxis(metricCodequality, 'grimoireCreationDate');

    const isCompare = data?.length > 1;

    const series = data.map((item) => {
      return mapToLineAreaSeries(
        item.result!.metricCodequality,
        'commitFrequency',
        isCompare ? item.url : 'Commit frequency'
      );
    });

    return getLineOption({
      xAxisData: xAxisDate,
      series,
    });
  }, [data]);

  return (
    <BaseCard
      loading={loading}
      title="Commit frequency"
      description="Determine the average number of commits per week in the past 90 days."
    >
      <EChartX option={echartsOpts} />
    </BaseCard>
  );
};

const ContributorCountWithData = () => {
  const data = useMetricQueryData();
  return <ContributorCount data={data} />;
};

export default ContributorCountWithData;
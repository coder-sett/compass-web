import React from 'react';
import { bar, genSeries, getBarOption } from '@modules/analyze/options';
import { CodeQuality } from '@modules/analyze/Misc/SideBar/menus';

import {
  getLegendName,
  TransOpts,
  TransResult,
} from '@modules/analyze/DataTransform/transToAxis';
import { BarSeriesOption, LineSeriesOption } from 'echarts';
import LazyLoadCard from '@modules/analyze/components/LazyLoadCard';
import Chart from '@modules/analyze/components/Chart';
import { toFixed } from '@common/utils';

const tansOpts: TransOpts = {
  metricType: 'metricCodequality',
  xAxisKey: 'grimoireCreationDate',
  yAxisOpts: [
    {
      legendName: 'lines add',
      valueKey: 'linesAddedFrequency',
    },
    {
      legendName: 'lines remove',
      valueKey: 'linesRemovedFrequency',
      valueFormat: (v) => toFixed(v * -1, 3),
    },
  ],
};

const getOptions = ({ xAxis, yResults }: TransResult) => {
  const series = genSeries<BarSeriesOption>(
    yResults,
    ({ legendName, label, level, isCompare, color, data }) => {
      return bar({
        name: getLegendName(legendName, { label, level, isCompare }),
        stack: label,
        data: data,
        color,
      });
    }
  );
  return getBarOption({ xAxisData: xAxis, series });
};

const LocFrequency = () => {
  return (
    <LazyLoadCard
      title="Line of code frequency"
      id={CodeQuality.LocFrequency}
      description={
        'Determine the average number of lines touched (lines added plus lines removed) per week in the past 90 days.'
      }
    >
      <Chart getOptions={getOptions} tansOpts={tansOpts} />
    </LazyLoadCard>
  );
};

export default LocFrequency;

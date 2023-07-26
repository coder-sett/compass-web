import React from 'react';
import ModelTitle from './modelTitle';
import ModelTrends from './modelTrends';
import CreateGuide from './CreateGuide';
import {
  useBetaMetricsIndexQuery,
  BetaMetricsIndexQuery,
} from '@oss-compass/graphql';
import client from '@common/gqlClient';
import Loading from './Loading';

type BetaMetric = {
  __typename?: 'BetaMetric';
  id?: number | null;
  dimensionality?: string | null;
  desc?: string | null;
  extra?: string | null;
  metric?: string | null;
};

const ModelItem: React.FC<{ betaMetric: BetaMetric }> = ({ betaMetric }) => {
  const { id, dimensionality, desc, extra, metric } = betaMetric;
  return (
    <div className="flex-1">
      <ModelTitle
        dimensionality={dimensionality}
        desc={desc}
        extra={extra}
        metric={metric}
      />
      <ModelTrends id={id!} />
    </div>
  );
};

const Model = () => {
  // const { isLoading, data } = useBetaMetricsIndexQuery(client, {
  //   per: 1,
  // });
  const isLoading = false;
  const data = { betaMetricsIndex: [{ id: 1 }] };
  return (
    <div className="mx-auto flex h-10 w-[1280px] md:flex-wrap xl:w-full xl:px-2">
      {data.betaMetricsIndex.map((i, index) => {
        if (index === 0) {
          return (
            <>
              <ModelItem betaMetric={i} key={i.id} />
              <CreateGuide key={index} />
            </>
          );
        } else {
          return <ModelItem betaMetric={i} key={i.id} />;
        }
      })}
    </div>
  );
};

export default Model;

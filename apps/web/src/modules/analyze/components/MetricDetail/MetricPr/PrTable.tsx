import React, { useState } from 'react';
import {
  usePullsDetailListQuery,
  PullDetail,
  FilterOptionInput,
  SortOptionInput,
} from '@oss-compass/graphql';
import client from '@common/gqlClient';
import MyTable from '@common/components/Table';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useTranslation } from 'next-i18next';
import { format, parseJSON } from 'date-fns';
import { useStateType } from '@modules/analyze/components/MetricDetail/MetricIssue/issue';

interface TableParams {
  pagination?: TablePaginationConfig;
  filterOpts?: FilterOptionInput[];
  sortOpts?: SortOptionInput;
  filters?: Record<string, FilterValue>;
}

const MetricTable: React.FC<{
  label: string;
  level: string;
  beginDate: Date;
  endDate: Date;
}> = ({ label, level, beginDate, endDate }) => {
  const { t } = useTranslation();
  const stateOption = useStateType();
  const filterMap = {
    ecologicalType: 'ecological_type',
    contributionTypeList: 'contribution_type',
  };
  const [tableData, setData] = useState<PullDetail[]>();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      position: ['bottomCenter'],
      showTotal: (total) => {
        return `Total ${total} items`;
      },
    },
    filterOpts: [],
  });
  const query = {
    page: tableParams.pagination.current,
    per: tableParams.pagination.pageSize,
    filterOpts: tableParams.filterOpts,
    sortOpts: tableParams.sortOpts,
    label,
    level,
    beginDate,
    endDate,
  };
  const { isLoading } = usePullsDetailListQuery(client, query, {
    // enabled: false,
    onSuccess: (data) => {
      const items = data.pullsDetailList.items;
      setData(items);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data.pullsDetailList.count,
        },
      });
    },
  });
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<PullDetail>
  ) => {
    let sortOpts = null;
    let filterOpts = [];
    sortOpts = sorter.field && {
      type: sorter.field,
      direction: sorter.order === 'ascend' ? 'asc' : 'desc',
    };
    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        const transformedObj = {
          type: key,
          values: filters[key] as string[],
        };
        filters[key] && filterOpts.push(transformedObj);
      }
    }
    setTableParams({
      pagination,
      sortOpts,
      filterOpts,
    });
  };

  const columns: ColumnsType<PullDetail> = [
    {
      title: t('analyze:metric_detail:pr_title'),
      dataIndex: 'title',
      align: 'center',
      width: '12%',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      align: 'center',
      width: '12%',
    },
    {
      title: t('analyze:metric_detail:state'),
      dataIndex: 'state',
      align: 'center',
      width: '5%',
      filters: stateOption,
      render: (text) => {
        return stateOption.find((i) => i.value === text)?.text || text;
      },
    },
    {
      title: t('analyze:metric_detail:created_time'),
      dataIndex: 'createdAt',
      align: 'center',
      width: '8%',
      render: (time) => format(parseJSON(time)!, 'yyyy-MM-dd'),
    },
    {
      title: t('analyze:metric_detail:close_time'),
      dataIndex: 'closedAt',
      align: 'center',
      width: '8%',
      render: (time) => (time ? format(parseJSON(time)!, 'yyyy-MM-dd') : ''),
    },
    {
      title: t('analyze:metric_detail:processing_time'),
      dataIndex: 'timeToCloseDays',
      align: 'center',
      width: '8%',
    },
    {
      title: t('analyze:metric_detail:first_response_time'),
      dataIndex: 'timeToFirstAttentionWithoutBot',
      align: 'center',
      width: '8%',
    },
    {
      title: t('analyze:metric_detail:comments_count'),
      dataIndex: 'numReviewComments',
      align: 'center',
      width: '8%',
    },
    {
      title: t('analyze:metric_detail:tags'),
      dataIndex: 'labels',
      align: 'center',
      width: '10%',
    },
    {
      title: t('analyze:metric_detail:creator'),
      dataIndex: 'userLogin',
      align: 'center',
      width: '10%',
    },
    {
      title: t('analyze:metric_detail:reviewer'),
      dataIndex: 'reviewersLogin',
      align: 'center',
      width: '8%',
      render: (list) => list.join(','),
    },
    {
      title: t('analyze:metric_detail:merge_author'),
      dataIndex: 'mergeAuthorLogin',
      align: 'center',
      width: '10%',
    },
  ];
  return (
    <div className="flex-1 pt-4">
      <MyTable
        columns={columns}
        dataSource={tableData}
        loading={isLoading}
        onChange={handleTableChange}
        pagination={tableParams.pagination}
        rowKey={'url'}
      />
    </div>
  );
};
export default MetricTable;
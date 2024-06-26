import React, { useState } from 'react';
import {
  useIssuesDetailListQuery,
  IssueDetail,
  FilterOptionInput,
  SortOptionInput,
} from '@oss-compass/graphql';
import client from '@common/gqlClient';
import MyTable from '@common/components/Table';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useTranslation } from 'next-i18next';
import { format, parseJSON } from 'date-fns';
import { useStateType } from './issue';
import { toUnderline } from '@common/utils/format';
import Download from '@common/components/Table/Download';
import { getIssuePolling, getIssueExport } from '../tableDownload';

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
  commonFilterOpts: any[];
}> = ({ label, level, beginDate, endDate, commonFilterOpts }) => {
  const { t } = useTranslation();
  const stateOption = useStateType();
  const [tableData, setData] = useState<IssueDetail[]>();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      position: ['bottomCenter'],
      showTotal: (total) => {
        return `${t('analyze:total_issues', { total })} `;
      },
    },
    filterOpts: [],
    sortOpts: {
      type: 'state',
      direction: 'desc',
    },
  });

  const query = {
    page: tableParams.pagination.current,
    per: tableParams.pagination.pageSize,
    filterOpts: [...tableParams.filterOpts, ...commonFilterOpts],
    sortOpts: tableParams.sortOpts,
    label,
    level,
    beginDate,
    endDate,
  };
  const { isLoading, isFetching } = useIssuesDetailListQuery(client, query, {
    // enabled: false,
    onSuccess: (data) => {
      const items = data.issuesDetailList.items;
      setData(items);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data.issuesDetailList.count,
        },
      });
    },
  });
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<IssueDetail>
  ) => {
    let sortOpts = null;
    let filterOpts = [];
    sortOpts = sorter.field && {
      type: toUnderline(sorter.field as string),
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
      pagination: {
        showTotal: tableParams.pagination.showTotal,
        ...pagination,
      },
      sortOpts,
      filterOpts,
    });
  };

  const columns: ColumnsType<IssueDetail> = [
    {
      title: t('analyze:metric_detail:issue_title'),
      dataIndex: 'title',
      align: 'left',
      width: '200px',
      sorter: true,
      fixed: 'left',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      align: 'left',
      width: '220px',
    },
    {
      title: t('analyze:metric_detail:state'),
      dataIndex: 'state',
      align: 'left',
      width: '100px',
      sorter: true,
      filters: stateOption,
      render: (text) => {
        return stateOption.find((i) => i.value === text)?.text || text;
      },
    },
    {
      title: t('analyze:metric_detail:created_time'),
      dataIndex: 'createdAt',
      align: 'left',
      sorter: true,
      width: '140px',
      render: (time) => format(parseJSON(time)!, 'yyyy-MM-dd'),
    },
    {
      title: t('analyze:metric_detail:close_time'),
      dataIndex: 'closedAt',
      align: 'left',
      sorter: true,
      width: '120px',
      render: (time) => (time ? format(parseJSON(time)!, 'yyyy-MM-dd') : ''),
    },
    {
      title: t('analyze:metric_detail:processing_time'),
      dataIndex: 'timeToCloseDays',
      align: 'left',
      sorter: true,
      width: '200px',
    },
    {
      title: t('analyze:metric_detail:first_response_time'),
      dataIndex: 'timeToFirstAttentionWithoutBot',
      align: 'left',
      sorter: true,
      width: '220px',
    },
    {
      title: t('analyze:metric_detail:comments_count'),
      dataIndex: 'numOfCommentsWithoutBot',
      align: 'left',
      sorter: true,
      width: '160px',
    },
    {
      title: t('analyze:metric_detail:tags'),
      dataIndex: 'labels',
      align: 'left',
      render: (list) => list?.join(', ') || '',
      width: '100px',
    },
    {
      title: t('analyze:metric_detail:creator'),
      dataIndex: 'userLogin',
      align: 'left',
      width: '100px',
    },
    {
      title: t('analyze:metric_detail:assignee'),
      dataIndex: 'assigneeLogin',
      align: 'left',
      width: '100px',
    },
  ];
  return (
    <>
      <div className="absolute right-4 top-16">
        <Download
          beginFun={getIssueExport}
          pollingFun={getIssuePolling}
          query={query}
          fileName={t('analyze:metric_detail:issue_data_table')}
        />
      </div>
      <MyTable
        columns={columns}
        dataSource={tableData}
        loading={isLoading || isFetching}
        onChange={handleTableChange}
        pagination={tableParams.pagination}
        rowKey={'url'}
        scroll={{ x: 'max-content' }}
      />
    </>
  );
};
export default MetricTable;

import React, { useState, useEffect } from 'react';
import { connect, init, getInstanceByDom } from 'echarts';
import type { EChartsOption, ECharts, SetOptionOpts } from 'echarts';
import useQueryDateRange from '@modules/oh/hooks/useQueryDateRange';
import { Select } from 'antd';
import router from 'next/router';

let yList = [
  'RN 框架 (React Native)',
  'Flutter 框架 (Flutter)',
  '动画 (Animation)',
  '网络及协议 (Networking&Protocol)',
  '加解密 (Encryption)',
  '数据库 (Database)',
  '文件及解析 (Files&Parsing)',
  '多媒体 (Media)',
  '图片 (Image)',
  '图形 (Graphics)',
  '人工智能 (AI)',
  '工具 (Tools)',
  '数学及算法 (Math&Algorithm)',
  '架构及模式 (Architecture&Patterns)',
  '日志及调试 (Logging&Debugging)',
  '辅助实用 (Utility)',
];
// prettier-ignore
function getRecentYearMonths() {
    var monthsArray: any = [];
    var currentDate = new Date(); // 获取当前日期
    for (var i = 0; i < 12; i++) {
      var month = currentDate.getMonth(); // 月份从 0 开始，需要加 1
      var year = currentDate.getFullYear();
      var formattedMonth: string = year + "-" + (month < 10 ? "0" : "") + month; // 格式化为 YYYY-MM 形式
      monthsArray.unshift(formattedMonth); // 将月份添加到数组的开头
      currentDate.setMonth(currentDate.getMonth() - 1); // 获取上一个月的日期
    }
    return monthsArray;
  }
const getdata = (days) => {
  const data: any = [];
  for (let d = 0; d < days.length; d += 1) {
    for (let j = 0; j < 52; j += 1) {
      data.push([d, j, Math.floor(Math.random() * (100 - 20 + 1)) + 20]);
    }
  }
  return data;
};
const Chart = () => {
  const [type, setType] = useState('活跃度');

  const { range } = useQueryDateRange();
  const hours = getRecentYearMonths();

  const initChart = () => {
    var chartDom = document.getElementById('main');
    var myChart = init(chartDom);
    const data_tmp = getdata(yList);
    const data = data_tmp.map(function (item) {
      return [item[1], item[0], item[2], item[3] || ''];
    });
    let option = {
      dataZoom: [
        {
          id: 'dataZoomY',
          type: 'slider',
          yAxisIndex: [0],
          startValue: 0,
          endValue: 40,
          filterMode: 'empty',
        },
      ],
      tooltip: {
        position: 'top',
      },
      grid: {
        height: '80%',
        width: 'auto',
        top: '5%',
      },
      xAxis: {
        type: 'category',
        data: hours,
        splitArea: {
          show: true,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        data: yList,
        splitArea: {
          show: true,
        },
        axisTick: {
          show: false,
        },
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        inRange: {
          color: ['#e2fae2', '#77c74e'],
        },
        dimension: 2,
        orient: 'horizontal',
        left: 'center',
        bottom: '1%',
      },
      series: [
        {
          name: '',
          type: 'heatmap',
          data: data,
          label: {
            // formatter:(item)=>{
            //   return item.data[2]
            //   console.log(item)
            // },
            show: false,
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
            borderWidth: 2,
            borderColor: '#fff',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    option && myChart.setOption(option);
    myChart.on('click', (e) => {
      let name = yList[e.data[1]];
      console.log(name);
      //   router.push('/oh');
      window.location.hash = '#sigCenter' + '?sigName=' + name;
      //   window.location.query = '?sigName=' + name;
      //   window.open('https://compass.gitee.com/analyze/ck8eobrl');
    });
  };
  useEffect(() => {
    // init
    let chart: ECharts | undefined;
    initChart();
    return () => {
      chart?.dispose();
    };
  }, [initChart]);
  const onChange = (e) => {
    setType(e);
  };
  return (
    <>
      <div>
        模型：
        <Select onChange={onChange} style={{ width: 120 }} value={type}>
          <Select.Option value="活跃度">活跃度</Select.Option>
          <Select.Option value="社区响应">社区响应</Select.Option>
          <Select.Option value="代码贡献">代码贡献</Select.Option>
        </Select>
      </div>
      <div className="mt-2 h-[800px] w-full" id="main"></div>
    </>
  );
};

export default Chart;

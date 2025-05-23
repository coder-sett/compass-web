import React, { useEffect } from 'react';
import { Popover } from 'antd';
import { useUserInfo } from '@modules/auth';
import { toast } from 'react-hot-toast';

const Timeline = ({ state, content, userId }) => {
  const { id } = useUserInfo().currentUser || {};
  const stepsList = [
    { text: '提交申请', value: 99 },
    {
      text: '待澄清',
      value: 0,
    },
    {
      text: '待确认',
      value: 1,
    },
    {
      text: '待审批',
      value: 2,
    },
    {
      text: '待QA确认',
      value: 4,
    },
    {
      text: '已通过',
      value: 3,
    },
  ];
  let currentStep = stepsList.findIndex((i) => i.value === state);
  if (state === -1) {
    stepsList[4].text = '已驳回';
    currentStep = 4;
  } else if (state === 3) {
    currentStep = 5; //已通过
  }
  useEffect(() => {
    if (currentStep === 5 && id === userId)
      toast.success(`当前申请已完成线上平台审批，请启动 TPC SIG 汇报流程！`);
  }, [currentStep]);
  return (
    <div className="mb-2 flex items-center justify-between">
      {stepsList.map((step, index) => (
        <div key={index} className="flex w-24 items-center">
          <Popover content={index === currentStep ? content : ''}>
            <div className="relative flex w-2 flex-col items-center justify-center">
              <div
                className={`h-2.5 w-2.5 rounded-full border-[3px] ${
                  index < currentStep
                    ? 'border-[#52c41a]'
                    : index === currentStep
                    ? 'cursor-pointer border-blue-500'
                    : 'border-[#bfbfbf]'
                }`}
              />
              <div
                className={`absolute mt-8 w-20 text-center text-xs font-normal ${
                  index === currentStep
                    ? 'cursor-pointer text-blue-500'
                    : 'cursor-default'
                }`}
              >
                {step.text}
              </div>
            </div>
          </Popover>
          {index < stepsList.length - 1 && (
            <div
              className={`mb-[1px] h-[1px] flex-1 ${
                index < currentStep ? 'bg-[#52c41a]' : 'bg-[#f0f0f0]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
export default Timeline;

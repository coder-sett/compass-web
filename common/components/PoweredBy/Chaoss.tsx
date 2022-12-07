import React from 'react';
import { useTranslation } from 'react-i18next';
import ChaossSvg from '@common/svgs/chaoss.svg';
import Tooltip from '@common/components/Tooltip';

const Chaoss = () => {
  const { t } = useTranslation();
  return (
    <Tooltip title={t('analyze:powered_by_choass')} arrow placement="top">
      <span className="ml-2">
        <ChaossSvg />
      </span>
    </Tooltip>
  );
};

export default Chaoss;

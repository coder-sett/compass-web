import React, { PropsWithChildren, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@oss-compass/ui';
import FormIsPublic from './FormIsPublic';
import FormVersionTitle from './FormVersionTitle';
import FormDescription from './FormDescription';
import FormTitle from './FormTitle';
import FormIsTotalScore from './FormIsTotalScore';
import FormMetric from './FormMetric';
import FormWeight from './FormWeight';
import FormAlgorithm from './FormAlgorithm';
import CheckTerms from '@modules/lab/model/components/CheckTerms';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { formState } from '../Form/state';
import { useSnapshot } from 'valtio';

const Form = ({
  formType,
  onSubmit,
  loading,
  submitLoading,
}: {
  formType?: 'VersionCreate' | 'VersionEdit' | 'ModelCreate' | 'ModelEdit';
  loading?: boolean;
  submitLoading: boolean;
  onSubmit: () => void;
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const isVersion = formType === 'VersionCreate' || formType === 'VersionEdit';
  const isModel = formType === 'ModelCreate' || formType === 'ModelEdit';
  const [select, setSelect] = useState(false);
  const snapshot = useSnapshot(formState);
  const isScore = snapshot.isScore;

  if (loading) {
    return (
      <div className="animate-pulse py-4">
        <div className="flex-1 space-y-4 ">
          <div className="h-4 rounded bg-slate-200"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-4 rounded bg-slate-200"></div>
            <div className="col-span-1 h-4 rounded bg-slate-200"></div>
          </div>
          <div className="h-4 rounded bg-slate-200"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 h-4 rounded bg-slate-200"></div>
            <div className="col-span-2 h-4 rounded bg-slate-200"></div>
          </div>
          <div className="h-4 rounded bg-slate-200"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <FormTitle disabled={isVersion} />
      <FormDescription disabled={isVersion} />
      <FormIsPublic disabled={isVersion} />

      {formType === 'ModelEdit' ? null : (
        <>
          {isModel ? null : <FormVersionTitle />}
          {/* <FormDataSet /> */}
          <FormMetric />
          <FormIsTotalScore />
          {isScore && (
            <>
              <FormWeight />
              <FormAlgorithm />
            </>
          )}
          {isModel && (
            <CheckTerms
              select={select}
              setSelect={(e) => {
                setSelect(e);
              }}
            />
          )}
        </>
      )}

      <div className="flex items-center">
        <Button
          className="mr-6 w-28"
          size="md"
          loading={submitLoading}
          onClick={() => {
            if (!formState.name) {
              toast.error(t('lab:form_tips.name_require'));
              return;
            }

            if (isVersion && !formState.version) {
              toast.error(t('lab:form_tips.version_require'));
              return;
            }

            const dataSetLen = formState.dataSet.length;
            // if ((isVersion || formType === 'ModelCreate') && dataSetLen === 0) {
            //   toast.error(t('lab:form_tips.dataset_require'));
            //   return;
            // }

            const metricSetLen = formState.metricSet.length;
            if (
              (isVersion || formType === 'ModelCreate') &&
              metricSetLen === 0
            ) {
              toast.error(t('lab:form_tips.metric_require'));
              return;
            }

            if (formType === 'ModelCreate' && !select) {
              toast.error(t('lab:please_check_the_terms'));
              return;
            }

            onSubmit();
          }}
        >
          {t('common:btn.save')}
        </Button>
        <Button
          intent="text"
          onClick={() => {
            router.back();
          }}
        >
          {t('common:btn.cancel')}
        </Button>
      </div>
    </>
  );
};

export default Form;

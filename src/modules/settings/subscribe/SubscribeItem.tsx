import React from 'react';
import { useTranslation } from 'react-i18next';
import { SiGitee, SiGithub } from 'react-icons/si';
import { Subscription } from '@graphql/generated';
import client from '@graphql/client';
import Button from '@common/components/Button';
import { useCancelSubscriptionMutation } from '@graphql/generated';
import { getRepoName, getProvider, getNameSpace } from '@common/utils/url';
import { formatISO } from '@common/utils/time';
import { Level } from '@modules/analyze/constant';

const ItemStatus = ({ item }: { item: Subscription }) => {
  const { t } = useTranslation();

  if (item.status === 'complete') {
    return (
      <span className="text-xs text-secondary">
        {t('setting:subscriptions.updated_on')}
        {formatISO(item.statusUpdatedAt)}
      </span>
    );
  }

  return (
    <span className="inline-block rounded-full bg-[#FFEEC6] px-2 text-xs text-[#AA8122]">
      {t('setting:subscriptions.analyzing')}
    </span>
  );
};

const RepoItem = ({ item }: { item: Subscription }) => {
  const provider = getProvider(item.label);
  const repo = getRepoName(item.label);
  const ns = getNameSpace(item.label);
  return (
    <>
      <div className="pr-2 pt-1">
        {provider === 'github' ? (
          <SiGithub />
        ) : (
          <SiGitee className="text-[#c71c27]" />
        )}
      </div>
      <div>
        <div className="text-sm font-bold">{repo}</div>
        <div className="text-xs text-secondary">{ns}</div>
      </div>
    </>
  );
};

const CommunityItem = ({ item }: { item: Subscription }) => {
  return (
    <>
      <div className=""></div>
      <div>
        <div className="text-base font-bold">{item.label}</div>
        <div className="text-xs text-secondary">{item.level}</div>
      </div>
    </>
  );
};

const SubscribeItem = ({
  item,
  onRefresh,
}: {
  item: Subscription;
  onRefresh: () => void;
}) => {
  const { t } = useTranslation();

  const Cancel = useCancelSubscriptionMutation(client, {
    onSuccess: (res) => {
      onRefresh();
    },
  });

  return (
    <div className="flex items-center border-b py-3">
      <div className="flex">
        {item.level === Level.REPO ? (
          <RepoItem item={item} />
        ) : (
          <CommunityItem item={item} />
        )}
      </div>

      <div className="flex flex-1 justify-end">
        <div className="w-[200px]">
          <ItemStatus item={item} />
        </div>
      </div>

      <Button
        intent="text"
        size="sm"
        className="text-xs"
        loading={Cancel.isLoading}
        onClick={() => {
          Cancel.mutate({ label: item.label, level: item.level });
        }}
      >
        {t('setting:subscriptions.unsubscribe')}
      </Button>
    </div>
  );
};

export default SubscribeItem;

import React from 'react';
import { proxy } from 'valtio';
import { UserinfoQuery } from '@graphql/generated';
import { getAuthProvider } from '@common/utils/cookie';

type LoginBind = NonNullable<
  NonNullable<UserinfoQuery['currentUser']>['loginBinds']
>[0];

export const userInfoStore = proxy<{
  loading: boolean;
  user: LoginBind | null;
  currentUser: UserinfoQuery['currentUser'] | null;
}>({
  loading: true,
  user: null,
  currentUser: null,
});

export const setUserInfo = (res?: UserinfoQuery) => {
  let user;
  const provider = getAuthProvider();
  if (provider) {
    user = res?.currentUser?.loginBinds?.find(
      (bindInfo) => bindInfo.provider === provider
    );
  } else {
    user = res?.currentUser?.loginBinds?.[0];
  }

  if (user) {
    user = {
      ...user,
      // todo Let the backend modify
      // The naming of the returned fields in the interface data is reversed.
      account: user?.nickname,
      nickname: user?.account,
    };
    userInfoStore.user = user;
  }
  userInfoStore.currentUser = res?.currentUser || null;
};

export const serUserLoading = (loading: boolean) => {
  userInfoStore.loading = loading;
};

export const resetUserInfo = () => {
  userInfoStore.loading = false;
  userInfoStore.user = null;
  userInfoStore.currentUser = null;
};

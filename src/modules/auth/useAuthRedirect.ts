import router from 'next/router';
import { useSnapshot } from 'valtio';
import { userInfoStore } from './UserInfoStore';

const useAuthRedirect = (options?: { redirectTo?: string }) => {
  const { user, loading } = useSnapshot(userInfoStore);
  if (!loading && !user) {
    let redirectTo = options?.redirectTo ?? window.location.pathname;
    router.replace(
      `/auth/signin?redirect_to=${encodeURIComponent(redirectTo)}`
    );
  }
};

export default useAuthRedirect;

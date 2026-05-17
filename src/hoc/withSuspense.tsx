import { ComponentType, Suspense } from 'react';

import Loading from '@/components/Loading';

export const withSuspense = <P extends object>(Component: ComponentType<P>) => {
  return (props: P) => (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  );
};

export default withSuspense;

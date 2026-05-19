import { Suspense } from 'react';
import type { ComponentType } from 'react';

import Loading from '@/components/loading';

export const withSuspense = <P extends object>(Component: ComponentType<P>) => {
  return (props: P) => (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  );
};

export default withSuspense;

import { Suspense, type FunctionComponent } from 'react';

export const withRelayBoundary = <T extends JSX.IntrinsicAttributes>(
  Component: FunctionComponent<T>,
): FunctionComponent<T> => {
  const QueryRendererWrapper = (props: T) => {
    return (
      <Suspense fallback={<a data-testid="loading">Loading...</a>}>
        <Component {...props} />
      </Suspense>
    );
  };

  QueryRendererWrapper.displayName = `withRelayBoundary(${
    Component.displayName || Component.name
  })`;

  return QueryRendererWrapper;
};

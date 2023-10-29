import type { FunctionComponent } from 'react';
import type { Environment } from 'react-relay';
import { RelayEnvironmentProvider } from 'react-relay';

export type WithProvidersArgs<P> = {
  environment: Environment;
  Component: FunctionComponent<P>;
};

export const withProviders =
  <P extends JSX.IntrinsicAttributes>({
    environment,
    Component,
  }: WithProvidersArgs<P>) =>
  (props: P) => {
    return (
      <RelayEnvironmentProvider environment={environment}>
        <Component {...props} />
      </RelayEnvironmentProvider>
    );
  };

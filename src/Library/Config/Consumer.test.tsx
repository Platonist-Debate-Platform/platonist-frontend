import '@testing-library/jest-dom/extend-expect';
import React, { FunctionComponent } from 'react';
import { render, screen } from '@testing-library/react';
import { withConfig, WithConfigProps } from './Consumer';
import { ConfigProvider } from './Provider';
import { defaultConfig } from './DefaultConfig';

const TestComponent: FunctionComponent<{} & WithConfigProps> = ({ config }) => (
  <>
    <p>protocol: {config?.api.config.protocol}</p>
  </>
);

const TestComponentWithConfig = withConfig(TestComponent);

const TestContextProvider: FunctionComponent = () => {
  return (
    <ConfigProvider config={defaultConfig()}>
      <TestComponentWithConfig />
    </ConfigProvider>
  );
};

test('Renders config Provider', () => {
  render(<TestContextProvider />);
  expect(screen.getByText(`protocol: https`)).toBeInTheDocument();
});

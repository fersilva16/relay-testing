import '@testing-library/jest-dom';

import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MockPayloadGenerator, createMockEnvironment } from 'relay-test-utils';

import { withProviders } from '../../test/withProviders';
import { connectionFromArray } from '../../test/connectionFromArray';
import TodoList from '../TodoList';
import { ConnectionHandler, ROOT_ID } from 'relay-runtime';

it('should render todo list', async () => {
  const environment = createMockEnvironment();

  const Root = withProviders({
    environment,
    Component: TodoList,
  });

  render(<Root />);

  const customMockResolvers = {
    Query: () => ({
      todos: connectionFromArray([
        {
          id: 'todo1',
          message: 'do something 1',
          checked: false,
        },
      ]),
    }),
  };

  act(() => {
    environment.mock.resolveMostRecentOperation((operation) => {
      const a = MockPayloadGenerator.generate(operation, customMockResolvers);

      console.dir(a, { depth: null });

      return a;
    });
  });

  await waitForElementToBeRemoved(screen.getByTestId('loading'));

  expect(screen.getByText('do something 1')).toBeInTheDocument();
  expect(screen.getByTestId('todo1-checked')).not.toBeChecked();
});

it('should add todo to the todo list', async () => {
  const environment = createMockEnvironment();

  const Root = withProviders({
    environment,
    Component: TodoList,
  });

  render(<Root />);

  const customMockResolvers = {
    Query: () => ({
      todos: connectionFromArray([]),
    }),
  };

  act(() => {
    environment.mock.resolveMostRecentOperation((operation) => {
      const a = MockPayloadGenerator.generate(operation, customMockResolvers);

      console.dir(a, { depth: null });

      return a;
    });
  });

  await waitForElementToBeRemoved(screen.getByTestId('loading'));

  await userEvent.type(screen.getByTestId('add-message'), 'do something 2');
  await userEvent.click(screen.getByTestId('add-submit'));

  await waitFor(() => environment.mock.getMostRecentOperation());

  const operation = environment.mock.getMostRecentOperation();

  const listConnectionId = ConnectionHandler.getConnectionID(
    ROOT_ID,
    'TodoList_todos',
  );

  expect(operation.fragment.variables).toEqual({
    input: {
      message: 'do something 2',
    },
    connections: [listConnectionId],
  });

  act(() => {
    environment.mock.resolveMostRecentOperation((operation) => {
      const a = MockPayloadGenerator.generate(operation, {
        TodoAddPayload: () => ({
          todo: {
            id: 'todo2',
            message: 'do something 2',
            checked: true,
          },
        }),
      });

      console.dir(a, { depth: null });

      return a;
    });
  });

  expect(screen.getByText('do something 2')).toBeInTheDocument();
  expect(screen.getByTestId('todo2-checked')).toBeChecked();
});

it('should edit todo in the todo list', async () => {
  const environment = createMockEnvironment();

  const Root = withProviders({
    environment,
    Component: TodoList,
  });

  render(<Root />);

  const customMockResolvers = {
    Query: () => ({
      todos: connectionFromArray([
        {
          id: 'todo1',
          message: 'do something 1',
          checked: false,
        },
      ]),
    }),
  };

  act(() => {
    environment.mock.resolveMostRecentOperation((operation) => {
      const a = MockPayloadGenerator.generate(operation, customMockResolvers);

      console.dir(a, { depth: null });

      return a;
    });
  });

  await waitForElementToBeRemoved(screen.getByTestId('loading'));

  expect(screen.getByText('do something 1')).toBeInTheDocument();
  expect(screen.getByTestId('todo1-checked')).not.toBeChecked();

  await userEvent.click(screen.getByTestId('todo1-checked'));

  await waitFor(() => environment.mock.getMostRecentOperation());

  const operation = environment.mock.getMostRecentOperation();

  expect(operation.fragment.variables).toEqual({
    input: {
      checked: true,
    },
  });

  act(() => {
    environment.mock.resolveMostRecentOperation((operation) => {
      const a = MockPayloadGenerator.generate(operation, {
        TodoEditPayload: () => ({
          todo: {
            id: 'todo1',
            message: 'do something 1',
            checked: true,
          },
        }),
      });

      console.dir(a, { depth: null });

      return a;
    });
  });

  expect(screen.getByTestId('todo1-checked')).toBeChecked();
});

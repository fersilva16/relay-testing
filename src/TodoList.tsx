import {
  graphql,
  useLazyLoadQuery,
  useMutation,
  usePaginationFragment,
} from 'react-relay';

import type { TodoListQuery } from './__generated__/TodoListQuery.graphql';
import type { TodoList_query$key } from './__generated__/TodoList_query.graphql';
import type { TodoListPaginationQuery } from './__generated__/TodoListPaginationQuery.graphql';
import { withRelayBoundary } from './relay/withRelayBoundary';
import TodoAddForm from './TodoAddForm';
import type { TodoEditMutation } from './__generated__/TodoEditMutation.graphql';
import { TodoEdit } from './TodoEditMutation';
import type { ChangeEvent } from 'react';

const TodoList = () => {
  const response = useLazyLoadQuery<TodoListQuery>(
    graphql`
      query TodoListQuery(
        $first: Int
        $last: Int
        $after: String
        $before: String
      ) {
        ...TodoList_query
          @arguments(first: $first, last: $last, after: $after, before: $before)
      }
    `,
    {},
  );

  const { data: query } = usePaginationFragment<
    TodoListPaginationQuery,
    TodoList_query$key
  >(
    graphql`
      fragment TodoList_query on Query
      @refetchable(queryName: "TodoListPaginationQuery")
      @argumentDefinitions(
        first: { type: Int }
        last: { type: Int }
        before: { type: String }
        after: { type: String }
      ) {
        todos(first: $first, last: $last, before: $before, after: $after)
          @connection(key: "TodoList_todos") {
          edges {
            node {
              id
              message
              checked
            }
          }
        }
      }
    `,
    response,
  );

  const [todoEdit] = useMutation<TodoEditMutation>(TodoEdit);

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    todoEdit({
      variables: {
        input: {
          checked: e.target.checked,
        },
      },
    });
  };

  console.dir(query, { depth: null });

  return (
    <div>
      {query.todos.edges.map((todo) => (
        <div key={todo?.node?.id}>
          <a data-testid={`${todo?.node?.id}-message`}>{todo?.node?.message}</a>
          <input
            data-testid={`${todo?.node?.id}-checked`}
            type="checkbox"
            checked={todo?.node?.checked}
            onChange={handleCheck}
          />
        </div>
      ))}

      <TodoAddForm />
    </div>
  );
};

export default withRelayBoundary(TodoList);

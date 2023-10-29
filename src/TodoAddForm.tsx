import { useState } from 'react';
import { useMutation } from 'react-relay';
import { ConnectionHandler, ROOT_ID } from 'relay-runtime';

import { withRelayBoundary } from './relay/withRelayBoundary';
import { TodoAdd } from './TodoAddMutation';
import type { TodoAddMutation } from './__generated__/TodoAddMutation.graphql';

const TodoList = () => {
  const [message, setMessage] = useState('');

  const [todoAdd] = useMutation<TodoAddMutation>(TodoAdd);

  const handleSubmit = () => {
    const listConnectionId = ConnectionHandler.getConnectionID(
      ROOT_ID,
      'TodoList_todos',
    );

    todoAdd({
      variables: {
        input: {
          message,
        },
        connections: [listConnectionId],
      },
    });
  };

  return (
    <div>
      <input
        data-testid="add-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button data-testid="add-submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default withRelayBoundary(TodoList);

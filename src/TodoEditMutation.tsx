import { graphql } from 'react-relay';

export const TodoEdit = graphql`
  mutation TodoEditMutation($input: TodoEditInput!) {
    TodoEdit(input: $input) {
      todo {
        id
        message
        checked
      }
    }
  }
`;

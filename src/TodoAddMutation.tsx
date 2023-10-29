import { graphql } from 'react-relay';

export const TodoAdd = graphql`
  mutation TodoAddMutation($input: TodoAddInput!, $connections: [ID!]!) {
    TodoAdd(input: $input) {
      todo @appendNode(edgeTypeName: "TodoEdge", connections: $connections) {
        id
        message
        checked
      }
    }
  }
`;

import { gql } from "@apollo/client";

export const GET_PROPERTIES = gql`
  query get_properties(
    $first: Int
    $offset: Int
    $orderBy: [_PropertyOrdering]
  ) {
    property(first: $first, offset: $offset, orderBy: $orderBy) {
      id
      name
    }
  }
`;

export const GET_USERS = gql`
  query getUsers {
    user {
      id
      first_name
      last_name
    }
  }
`;

// Create realm given name and title
export const createRealmSchema = `
  mutation createRealm($name: String!, $title: String) {
    createRealm(name: $name, title: $title) {
      id
      name
      title
    }
  }
`;

// Create player given name and realmId
export const createPlayerSchema = `
  mutation createPlayer($name: String!, $realmId: ID!) {
    createPlayer(name: $name, realmId: $realmId) {
      id
      name
      realmId
    }
  }
`;

// Create player given name and realmId
export const putSessionSchema = `
  mutation putSession(
    $name: String!,
    $realmId: ID!,
    $time: String!,
    $playerSessions: [CreateSessionPlayerSession]!
  ) {
    putSession(
      name: $name,
      realmId: $realmId,
      time: $time,
      playerSessions: $playerSessions
    ) {
      id
      realmId
      name
      time
      playerSessions {
        playerId
      }
    }
  }
`;

import { gql } from "@apollo/client";

const stakesReceivedsQuery = gql`
  query getStakedList {
    stakeReceiveds {
      id
      user
      amount
      transactionHash
    }
  }
`;

const ticketMintedQuery = gql`
  query getTicketMintedList {
    ticketMinteds {
      id
      owner
      tokenId
      transactionHash
    }
  }
`;

const fanscoreSetsQuery = gql`
  query fanScoresList {
    fanScoreSets {
      id
      score
      user
      transactionHash
    }
  }
`;

const userQualifedListQuery = gql`
  query MyQuery {
    userQualifieds {
      id
      user
      transactionHash
    }
  }
`;
export {
  stakesReceivedsQuery,
  ticketMintedQuery,
  userQualifedListQuery,
  fanscoreSetsQuery,
};

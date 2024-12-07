export interface Event {
  id: string;
  artist: string;
  baseTokenURI: string;
  city: string;
  contractAddress: string | null;
  date: string;
  description: string;
  image: string;
  location: string;
  maxResalePrice: string;
  minFanScore: string;
  name: string;
  royaltyFeeNumerator: string;
  royaltyReceiver: string;
  stakeAmount: string;
  symbol: string;
  ticketPrice: string;
  ticketsToSell: string;
  totalTickets: string;
  scanUrl: string;
}

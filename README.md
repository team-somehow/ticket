# FanBase

This innovative app revolutionizes ticketing for high-demand events by ensuring transparency and fairness in ticket distribution. It integrates ERC-2981 royalty standards and enforces price caps on resales, protecting both fans and artists from exploitative practices. With a unique fan-first approach, the app uses Spotify OAuth to calculate fan scores, prioritizing loyal supporters in the ticketing queue. Early supporters and fans of emerging artists also enjoy loyalty discounts, fostering a supportive ecosystem for up-and-coming talent. By seamlessly blending technology, transparency, and fan-centric features, this app aims to create an equitable and rewarding experience for both fans and artists.

<img src="https://firebasestorage.googleapis.com/v0/b/somehow-eth-singapore.appspot.com/o/seed%2FFanBase_Readme.png?alt=media&token=5117fb8c-e764-4fb8-95b8-ec6be9bed9c1" alt="banner" />

## Table of Contents

- [FanBase](#FanBase)
  - [Table of Contents](#table-of-contents)
  - [Algorithmic System](#algorithmic-system)
  - [User Journey Flow](#user-journey-flow)
  - [Deployed Contracts](#deployed-contracts)
    - [1. **Base Sepolia Testnet**](#1-base-sepolia-testnet)
    - [2. **BNB Smart Chain**](#2-bnb-smart-chain)
  - [About The Team](#about-the-team)
  - [Team Members:-](#team-members-)

## Algorithmic System

### How the System Computes the Score

The system uses multiple mathematical models to compute a project's score based on the user votes:

- **Fan Score Calculation**: The system begins by calculating a Fan Score using Spotify OAuth. It authenticates users to access their listening history, playlists, and favorite artists. This data is then analyzed using a weighted algorithm that evaluates the frequency of streams for specific artists, the inclusion of their tracks in playlists, and the recency of engagement. Fans who frequently listen to an artist, include their music in personal playlists, and have recent interactions with their tracks are awarded higher scores. This score reflects the user’s loyalty and engagement with the artist.

- **Queue Priority and Ticket Allocation**: Queue priority is determined based on the Fan Scores. Higher-scoring fans are granted earlier access to tickets, ensuring that loyal supporters have better chances of securing them. The system dynamically adjusts queue positions to maintain fairness, especially among fans with similar scores. Tickets are allocated in descending order of Fan Scores, with a portion reserved for general availability. Fans of emerging artists or early supporters may be given additional priority to encourage growth and community engagement.

- **Resale Price Regulation**: To prevent unfair practices, ticket resales are regulated through smart contracts adhering to ERC-2981 standards. Resale prices are capped to eliminate inflated secondary market rates, while artists benefit from a royalty percentage on each resale. This ensures that both fans and artists are protected.

- **Loyalty Rewards**: Loyalty discounts are applied for fans who demonstrate long-term support, making the ticketing process more rewarding for dedicated followers. Emerging artist tickets may include exclusive perks, fostering connections between new talent and their supporters.



## User Journey Flow

The user journey begins on the “FanBase” homepage, where users log in securely via Worldcoin or Anonaadhar. After logging in, they access a dashboard showcasing upcoming events. Users can select an event, view details, and apply for tickets using Spotify integration to calculate fan scores, which determine queue priority. Payments are made through ETH staking or Coinbase.

Top fans receive ticket confirmations and unique non-resalable NFT tickets, ensuring security and fairness. Unsuccessful applicants are notified and can view their refunds on the blockchain. Approved users use the NFT ticket’s QR code for seamless event access, completing the experience with a congratulatory message.



## Deployed Contracts

### 1. **Base Sepolia Testnet**

- **Contract Address**: `0x99C8CA6842C20F5428c8C17e6c79634e8dA539D8`

### 2. **BNB Smart Chain**

- **Contract Address**: `0x714Cfb36Af2FDDB6558775966bB2F42377dB2927`


---
Our team is composed of highly passionate developers, data scientists, and blockchain enthusiasts committed to building innovative solutions for decentralized voting systems. We bring expertise from various domains including machine learning, full-stack development, cryptography, and blockchain technologies.

## Team Members:-

- **Hussain Pettiwala** - **Backend Development**
- **Gaurish Baliga** - **Frontend Development**
- **Vinay Kansel** - **Full Stack Development**
- **Rahul Dandona** - **Backend and Smart Contract Development**
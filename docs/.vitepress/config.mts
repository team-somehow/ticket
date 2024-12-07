import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Fan Score Protocol",
  description: "Documentation for the Fan Score Protocol",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guides/getting-started' },
      { text: 'API', link: '/api/attestation' }
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/guides/getting-started' },
          { text: 'Installation', link: '/guides/installation' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Attestation', link: '/api/attestation' },
          { text: 'Firebase', link: '/api/firebase' },
          { text: 'Subgraph', link: '/api/subgraph' },
          { text: 'Web3', link: '/api/web3' }
        ]
      },
      {
        text: 'Components',
        items: [
          { text: 'Score Generation', link: '/components/score-generation' }
        ]
      },
      {
        text: 'Hooks',
        items: [
          { text: 'Buy Ticket', link: '/hooks/buy-ticket' },
          { text: 'User Event Score', link: '/hooks/user-event-score' }
        ]
      }
    ]
  }
})
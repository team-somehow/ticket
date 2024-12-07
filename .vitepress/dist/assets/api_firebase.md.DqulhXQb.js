import{_ as i,c as a,a0 as n,o as t}from"./chunks/framework.p2VkXzrt.js";const g=JSON.parse('{"title":"Firebase Integration","description":"","frontmatter":{},"headers":[],"relativePath":"api/firebase.md","filePath":"api/firebase.md"}'),e={name:"api/firebase.md"};function l(p,s,h,k,r,E){return t(),a("div",null,s[0]||(s[0]=[n(`<h1 id="firebase-integration" tabindex="-1">Firebase Integration <a class="header-anchor" href="#firebase-integration" aria-label="Permalink to &quot;Firebase Integration&quot;">​</a></h1><h2 id="overview" tabindex="-1">Overview <a class="header-anchor" href="#overview" aria-label="Permalink to &quot;Overview&quot;">​</a></h2><p>The project uses Firebase for backend services, including Cloud Functions, Firestore, and Authentication.</p><h2 id="configuration" tabindex="-1">Configuration <a class="header-anchor" href="#configuration" aria-label="Permalink to &quot;Configuration&quot;">​</a></h2><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// frontend/src/lib/firebase.config.ts</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> firebaseConfig</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">apiKey: process.env.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">FIREBASE_API_KEY</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">authDomain: process.env.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">FIREBASE_AUTH_DOMAIN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">projectId: process.env.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">FIREBASE_PROJECT_ID</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">storageBucket: process.env.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">FIREBASE_STORAGE_BUCKET</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">messagingSenderId: process.env.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">FIREBASE_MESSAGING_SENDER_ID</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">appId: process.env.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">FIREBASE_APP_ID</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div><h2 id="cloud-functions" tabindex="-1">Cloud Functions <a class="header-anchor" href="#cloud-functions" aria-label="Permalink to &quot;Cloud Functions&quot;">​</a></h2><h3 id="fan-score-calculation" tabindex="-1">Fan Score Calculation <a class="header-anchor" href="#fan-score-calculation" aria-label="Permalink to &quot;Fan Score Calculation&quot;">​</a></h3><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// web3-interactions/src/index.ts</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> setUserScores</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onRequest</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">async</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">request</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">response</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (request.method </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!==</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;POST&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">response.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">status</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">405</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">send</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ message: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Method not allowed&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> });</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">try</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> contract</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ethers.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Contract</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">CONTRACT_ADDRESS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">TicketProtocolImplementation.abi,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">wallet</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> tx</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> contract.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setFanScores</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[userAddress],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[score]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">response.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">status</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">200</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">send</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">message: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Fan scores updated successfully&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">transactionHash: tx.hash,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">} </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">catch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (error) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">response.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">status</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">send</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ message: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Something went wrong&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, error });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">## Firestore Schema</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">### User Applied Events</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`\`\`typescript</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">interface UserAppliedEvent {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">eventId: string;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">isListed: boolean;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">userId: string;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">userWalletAddress: string;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">status: &#39;applied&#39; | &#39;approved&#39; | &#39;rejected&#39;;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">score: number;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">artist_name: string;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}</span></span></code></pre></div><h2 id="usage-examples" tabindex="-1">Usage Examples <a class="header-anchor" href="#usage-examples" aria-label="Permalink to &quot;Usage Examples&quot;">​</a></h2><h3 id="reading-data" tabindex="-1">Reading Data <a class="header-anchor" href="#reading-data" aria-label="Permalink to &quot;Reading Data&quot;">​</a></h3><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ticketRef</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> doc</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(db, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;user_applied_events&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, ticketId);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ticketDoc</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> getDoc</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ticketRef);</span></span></code></pre></div><h3 id="writing-data" tabindex="-1">Writing Data <a class="header-anchor" href="#writing-data" aria-label="Permalink to &quot;Writing Data&quot;">​</a></h3><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> eventUserRef</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> collection</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(db, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;user_applied_events&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> addDoc</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(eventUserRef, {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">eventId,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">isListed: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">userId: spotifyUserId,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">userWalletAddress: address,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">status: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;applied&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">score: fanScore,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">artist_name: artistName</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><p>This provides a concise overview of the Firebase integration. Would you like me to expand on any particular section?</p>`,14)]))}const c=i(e,[["render",l]]);export{g as __pageData,c as default};

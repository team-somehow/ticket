import{_ as s,c as n,a0 as e,o as t}from"./chunks/framework.p2VkXzrt.js";const h=JSON.parse('{"title":"React Hooks Guide","description":"","frontmatter":{},"headers":[],"relativePath":"hooks/hooks.md","filePath":"hooks/hooks.md"}'),o={name:"hooks/hooks.md"};function i(p,a,l,r,c,d){return t(),n("div",null,a[0]||(a[0]=[e(`<h1 id="react-hooks-guide" tabindex="-1">React Hooks Guide <a class="header-anchor" href="#react-hooks-guide" aria-label="Permalink to &quot;React Hooks Guide&quot;">​</a></h1><h2 id="overview" tabindex="-1">Overview <a class="header-anchor" href="#overview" aria-label="Permalink to &quot;Overview&quot;">​</a></h2><p>Custom hooks for managing ticket purchases and user event scores in the Fan Score Protocol.</p><h2 id="available-hooks" tabindex="-1">Available Hooks <a class="header-anchor" href="#available-hooks" aria-label="Permalink to &quot;Available Hooks&quot;">​</a></h2><h3 id="_1-usebuyticket" tabindex="-1">1. useBuyTicket <a class="header-anchor" href="#_1-usebuyticket" aria-label="Permalink to &quot;1. useBuyTicket&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Buy tickets from the secondary market</span></span>
<span class="line"><span>const { buyTicket, loading, error } = useBuyTicket();</span></span>
<span class="line"><span>// Usage</span></span>
<span class="line"><span>await buyTicket({</span></span>
<span class="line"><span>ticketId: &quot;123&quot;,</span></span>
<span class="line"><span>buyerAddress: &quot;0x...&quot;</span></span>
<span class="line"><span>});</span></span></code></pre></div><h3 id="_2-useusereventscore" tabindex="-1">2. useUserEventScore <a class="header-anchor" href="#_2-useusereventscore" aria-label="Permalink to &quot;2. useUserEventScore&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/ Get user&#39;s fan score for an event</span></span>
<span class="line"><span>const { getScore, loading, error } = useUserEventScore();</span></span>
<span class="line"><span>// Usage</span></span>
<span class="line"><span>const score = await getScore({</span></span>
<span class="line"><span>userId: &quot;spotify_user_id&quot;,</span></span>
<span class="line"><span>eventId: &quot;123&quot;</span></span>
<span class="line"><span>});</span></span></code></pre></div><h2 id="common-patterns" tabindex="-1">Common Patterns <a class="header-anchor" href="#common-patterns" aria-label="Permalink to &quot;Common Patterns&quot;">​</a></h2><h3 id="loading-states" tabindex="-1">Loading States <a class="header-anchor" href="#loading-states" aria-label="Permalink to &quot;Loading States&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function TicketPurchase() {</span></span>
<span class="line"><span>const { buyTicket, loading } = useBuyTicket();</span></span>
<span class="line"><span>return (</span></span>
<span class="line"><span>&lt;button disabled={loading}&gt;</span></span>
<span class="line"><span>{loading ? &quot;Processing...&quot; : &quot;Buy Ticket&quot;}</span></span>
<span class="line"><span>&lt;/button&gt;</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="error-handling" tabindex="-1">Error Handling <a class="header-anchor" href="#error-handling" aria-label="Permalink to &quot;Error Handling&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function ScoreDisplay() {</span></span>
<span class="line"><span>const { getScore, error } = useUserEventScore();</span></span>
<span class="line"><span>if (error) {</span></span>
<span class="line"><span>return &lt;div&gt;Error: {error}&lt;/div&gt;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>return &lt;div&gt;Score: {score}&lt;/div&gt;;</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,13)]))}const g=s(o,[["render",i]]);export{h as __pageData,g as default};

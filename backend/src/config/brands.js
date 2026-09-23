'use strict';

/**
 * brands.js — Maintainable Brand Registry
 *
 * Provides canonical names, aliases, domains, referral URL patterns,
 * and categories for known services.
 */

const BRAND_REGISTRY = [
  // ─── Finance & Payments ──────────────────────────────────────────────────
  {
    name: 'MobiKwik',
    aliases: ['mobikwik', 'mobi kwik'],
    category: 'finance',
    domains: ['mobikwik.com'],
    referralDomains: ['w6em.app.link', 'mobikwik.com'],
  },
  {
    name: 'Google Pay',
    aliases: ['google pay', 'gpay', 'g pay'],
    category: 'finance',
    domains: ['pay.google.com', 'g.co'],
    referralDomains: ['g.co/payinvite'],
  },
  {
    name: 'PhonePe',
    aliases: ['phonepe', 'phone pe'],
    category: 'finance',
    domains: ['phonepe.com'],
    referralDomains: ['phon.pe'],
  },
  {
    name: 'Paytm',
    aliases: ['paytm', 'pay tm'],
    category: 'finance',
    domains: ['paytm.com'],
    referralDomains: ['p-y.tm'],
  },
  {
    name: 'CRED',
    aliases: ['cred'],
    category: 'finance',
    domains: ['cred.club'],
    referralDomains: ['cred.club'],
  },
  {
    name: 'Groww',
    aliases: ['groww'],
    category: 'finance',
    domains: ['groww.in'],
    referralDomains: ['groww.in'],
  },
  {
    name: 'Zerodha',
    aliases: ['zerodha', 'kite by zerodha', 'kite'],
    category: 'finance',
    domains: ['zerodha.com'],
    referralDomains: ['zerodha.com'],
  },
  {
    name: 'Upstox',
    aliases: ['upstox'],
    category: 'finance',
    domains: ['upstox.com'],
    referralDomains: ['upstox.com'],
  },
  {
    name: 'Jupiter',
    aliases: ['jupiter money', 'jupiter'],
    category: 'finance',
    domains: ['jupiter.money'],
    referralDomains: ['jupiter.money'],
  },
  {
    name: 'Fi Money',
    aliases: ['fi money', 'fi'],
    category: 'finance',
    domains: ['fi.money'],
    referralDomains: ['fi.money'],
  },

  // ─── Shopping & E-Commerce ───────────────────────────────────────────────
  {
    name: 'Amazon',
    aliases: ['amazon', 'amazon pay'],
    category: 'shopping',
    domains: ['amazon.in', 'amazon.com'],
    referralDomains: ['amzn.to', 'amzn.in'],
  },
  {
    name: 'Flipkart',
    aliases: ['flipkart'],
    category: 'shopping',
    domains: ['flipkart.com'],
    referralDomains: ['fkrt.it'],
  },
  {
    name: 'Myntra',
    aliases: ['myntra'],
    category: 'shopping',
    domains: ['myntra.com'],
    referralDomains: ['myntra.com'],
  },
  {
    name: 'Nykaa',
    aliases: ['nykaa'],
    category: 'shopping',
    domains: ['nykaa.com'],
    referralDomains: ['nykaa.com'],
  },
  {
    name: 'Meesho',
    aliases: ['meesho'],
    category: 'shopping',
    domains: ['meesho.com'],
    referralDomains: ['meesho.com'],
  },
  {
    name: 'Ajio',
    aliases: ['ajio'],
    category: 'shopping',
    domains: ['ajio.com'],
    referralDomains: ['ajio.com'],
  },

  // ─── Food & Groceries ────────────────────────────────────────────────────
  {
    name: 'Swiggy',
    aliases: ['swiggy', 'instamart', 'swiggy instamart', 'dineout'],
    category: 'food',
    domains: ['swiggy.com'],
    referralDomains: ['swiggy.com', 'swiggy.in'],
  },
  {
    name: 'Zomato',
    aliases: ['zomato'],
    category: 'food',
    domains: ['zomato.com'],
    referralDomains: ['zoma.to'],
  },
  {
    name: 'Blinkit',
    aliases: ['blinkit', 'grofers'],
    category: 'food',
    domains: ['blinkit.com'],
    referralDomains: ['blinkit.com'],
  },
  {
    name: 'Zepto',
    aliases: ['zepto'],
    category: 'food',
    domains: ['zeptonow.com'],
    referralDomains: ['zeptonow.com'],
  },
  {
    name: 'BigBasket',
    aliases: ['bigbasket', 'bbnow'],
    category: 'food',
    domains: ['bigbasket.com'],
    referralDomains: ['bigbasket.com'],
  },

  // ─── Travel & Mobility ───────────────────────────────────────────────────
  {
    name: 'Uber',
    aliases: ['uber'],
    category: 'travel',
    domains: ['uber.com'],
    referralDomains: ['uber.com'],
  },
  {
    name: 'Ola',
    aliases: ['ola', 'ola cabs'],
    category: 'travel',
    domains: ['olacabs.com'],
    referralDomains: ['olacabs.com'],
  },
  {
    name: 'Rapido',
    aliases: ['rapido'],
    category: 'travel',
    domains: ['rapido.bike'],
    referralDomains: ['rapido.bike'],
  },
  {
    name: 'MakeMyTrip',
    aliases: ['makemytrip', 'mmt'],
    category: 'travel',
    domains: ['makemytrip.com'],
    referralDomains: ['makemytrip.com'],
  },
  {
    name: 'Airbnb',
    aliases: ['airbnb'],
    category: 'travel',
    domains: ['airbnb.com'],
    referralDomains: ['abnb.me'],
  },
  {
    name: 'IRCTC',
    aliases: ['irctc'],
    category: 'travel',
    domains: ['irctc.co.in'],
    referralDomains: ['irctc.co.in'],
  },

  // ─── Education & Learning ────────────────────────────────────────────────
  {
    name: 'Coursera',
    aliases: ['coursera'],
    category: 'education',
    domains: ['coursera.org'],
    referralDomains: ['coursera.org'],
  },
  {
    name: 'Udemy',
    aliases: ['udemy'],
    category: 'education',
    domains: ['udemy.com'],
    referralDomains: ['udemy.com'],
  },
  {
    name: 'Unacademy',
    aliases: ['unacademy'],
    category: 'education',
    domains: ['unacademy.com'],
    referralDomains: ['unacademy.com'],
  },
  {
    name: 'Duolingo',
    aliases: ['duolingo'],
    category: 'education',
    domains: ['duolingo.com'],
    referralDomains: ['invite.duolingo.com'],
  },

  // ─── Productivity & Design ───────────────────────────────────────────────
  {
    name: 'Notion',
    aliases: ['notion'],
    category: 'productivity',
    domains: ['notion.so', 'notion.site'],
    referralDomains: ['notion.so'],
  },
  {
    name: 'Figma',
    aliases: ['figma'],
    category: 'productivity',
    domains: ['figma.com'],
    referralDomains: ['figma.com'],
  },
  {
    name: 'Canva',
    aliases: ['canva'],
    category: 'productivity',
    domains: ['canva.com'],
    referralDomains: ['canva.me'],
  },
  {
    name: 'Slack',
    aliases: ['slack'],
    category: 'productivity',
    domains: ['slack.com'],
    referralDomains: ['slack.com'],
  },

  // ─── Developer Tools & Cloud ─────────────────────────────────────────────
  {
    name: 'GitHub',
    aliases: ['github'],
    category: 'developer',
    domains: ['github.com'],
    referralDomains: ['github.com'],
  },
  {
    name: 'Vercel',
    aliases: ['vercel'],
    category: 'developer',
    domains: ['vercel.com', 'vercel.app'],
    referralDomains: ['vercel.com'],
  },
  {
    name: 'Netlify',
    aliases: ['netlify'],
    category: 'developer',
    domains: ['netlify.com', 'netlify.app'],
    referralDomains: ['netlify.com'],
  },
  {
    name: 'DigitalOcean',
    aliases: ['digitalocean', 'digital ocean'],
    category: 'developer',
    domains: ['digitalocean.com'],
    referralDomains: ['m.do.co'],
  },
  {
    name: 'AWS',
    aliases: ['aws', 'amazon web services'],
    category: 'developer',
    domains: ['aws.amazon.com'],
    referralDomains: ['aws.amazon.com'],
  },
  {
    name: 'Render',
    aliases: ['render'],
    category: 'developer',
    domains: ['render.com'],
    referralDomains: ['render.com'],
  },
  {
    name: 'Railway',
    aliases: ['railway'],
    category: 'developer',
    domains: ['railway.app'],
    referralDomains: ['railway.app'],
  },

  // ─── Entertainment & Media ───────────────────────────────────────────────
  {
    name: 'Netflix',
    aliases: ['netflix'],
    category: 'entertainment',
    domains: ['netflix.com'],
    referralDomains: ['netflix.com'],
  },
  {
    name: 'Spotify',
    aliases: ['spotify'],
    category: 'entertainment',
    domains: ['spotify.com'],
    referralDomains: ['spotify.link', 'spotify.com'],
  },
  {
    name: 'Hotstar',
    aliases: ['hotstar', 'disney+ hotstar', 'disney hotstar'],
    category: 'entertainment',
    domains: ['hotstar.com'],
    referralDomains: ['hotstar.com'],
  },
];

module.exports = { BRAND_REGISTRY };

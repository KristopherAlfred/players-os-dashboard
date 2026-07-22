#!/usr/bin/env node
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../public/data");
const now = () => new Date().toISOString();

function parseCount(text) {
  const raw = String(text || "").replace(/,/g, "").trim();
  const m = raw.match(/^([\d.]+)\s*([KMB])?$/i);
  if (!m) return Number(raw.replace(/[^\d]/g, "")) || 0;
  const n = Number(m[1]);
  const u = (m[2] || "").toUpperCase();
  return Math.round(n * ({ K: 1e3, M: 1e6, B: 1e9 }[u] || 1));
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 SloaneGloDashboard/1.0" },
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.text();
}

async function writeYoutube() {
  const xml = await fetchText(
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCL88E7XtLyJKmLoaGpwxxtQ",
  );
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
  const videos = entries
    .map((entry) => {
      const id = (entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1] || "";
      const title = (entry.match(/<title>([^<]+)<\/title>/) || [])[1] || "";
      const published = (entry.match(/<published>([^<]+)<\/published>/) || [])[1] || now();
      const views = Number((entry.match(/views="(\d+)"/) || [])[1] || 0);
      return {
        id,
        title,
        viewCount: views,
        likeCount: 0,
        publishedAt: published,
        permalink: `https://www.youtube.com/watch?v=${id}`,
        durationSeconds: 0,
      };
    })
    .filter((v) => v.id)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const totalViews = videos.reduce((s, v) => s + v.viewCount, 0);
  const payload = {
    syncedAt: now(),
    source: "cache",
    channel: {
      id: "UCL88E7XtLyJKmLoaGpwxxtQ",
      name: "Sloane Stephens",
      handle: "@sloanestephens",
      permalink: "https://www.youtube.com/@sloanestephens",
      subscribers: 0,
      subscribersLabel: "Subscribers unavailable",
    },
    kpis: {
      subscribers: 0,
      totalVideos: videos.length,
      totalViews,
      avgViews: Math.round(totalViews / Math.max(videos.length, 1)),
      avgLikes: 0,
      engagementRate: 0,
    },
    recentVideos: videos.slice(0, 12),
    topVideos: [...videos].sort((a, b) => b.viewCount - a.viewCount).slice(0, 8),
  };
  await writeFile(path.join(OUT, "youtube-analytics.json"), `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`YT ${videos.length} videos`);
}

async function writeTwitter() {
  const posts = [
    {
      id: "1957945477824946317",
      text: "First day, first fit. ESPN, let's do this",
      permalink: "https://x.com/SloaneStephens/status/1957945477824946317",
      createdAt: "2025-08-19T00:00:00.000Z",
      likes: 28000,
      replies: 361,
      reposts: 1900,
      quotes: 0,
    },
    {
      id: "1960814637076676844",
      text: "Butter yellow babe, US Open edition",
      permalink: "https://x.com/SloaneStephens/status/1960814637076676844",
      createdAt: "2025-08-27T00:00:00.000Z",
      likes: 19000,
      replies: 165,
      reposts: 965,
      quotes: 0,
    },
    {
      id: "1883120400084975857",
      text: "It was never if, just when. You deserve this and beyond #AusOpen",
      permalink: "https://x.com/SloaneStephens/status/1883120400084975857",
      createdAt: "2025-01-25T00:00:00.000Z",
      likes: 14000,
      replies: 96,
      reposts: 867,
      quotes: 0,
    },
    {
      id: "1700646958770041069",
      text: "US Open family",
      permalink: "https://x.com/SloaneStephens/status/1700646958770041069",
      createdAt: "2023-09-09T00:00:00.000Z",
      likes: 13000,
      replies: 105,
      reposts: 1000,
      quotes: 0,
    },
    {
      id: "1558855025333501954",
      text: "Besties",
      permalink: "https://x.com/SloaneStephens/status/1558855025333501954",
      createdAt: "2022-08-14T00:00:00.000Z",
      likes: 16000,
      replies: 198,
      reposts: 643,
      quotes: 0,
    },
    {
      id: "1519364929026813952",
      text: "@NGSuperEagles",
      permalink: "https://x.com/SloaneStephens/status/1519364929026813952",
      createdAt: "2022-04-27T00:00:00.000Z",
      likes: 24000,
      replies: 573,
      reposts: 2100,
      quotes: 0,
    },
    {
      id: "1478769672468185092",
      text: "Wife",
      permalink: "https://x.com/SloaneStephens/status/1478769672468185092",
      createdAt: "2022-01-05T00:00:00.000Z",
      likes: 17000,
      replies: 589,
      reposts: 651,
      quotes: 0,
    },
    {
      id: "1478465348508729356",
      text: "1.1.22",
      permalink: "https://x.com/SloaneStephens/status/1478465348508729356",
      createdAt: "2022-01-04T00:00:00.000Z",
      likes: 27000,
      replies: 766,
      reposts: 1200,
      quotes: 0,
    },
    {
      id: "1167959554929246209",
      text: "This support is what tennis should be about well done @Naomi_Osaka_ @CocoGauff",
      permalink: "https://x.com/SloaneStephens/status/1167959554929246209",
      createdAt: "2019-09-01T00:00:00.000Z",
      likes: 3500,
      replies: 207,
      reposts: 0,
      quotes: 0,
    },
    {
      id: "1005559262121267205",
      text: "Not the outcome I wanted today, but grateful for this opportunity to compete in the @rolandgarros Finals.",
      permalink: "https://x.com/SloaneStephens/status/1005559262121267205",
      createdAt: "2018-06-09T00:00:00.000Z",
      likes: 15000,
      replies: 588,
      reposts: 0,
      quotes: 0,
    },
    {
      id: "909149510215000064",
      text: "Honored",
      permalink: "https://x.com/SloaneStephens/status/909149510215000064",
      createdAt: "2017-09-16T00:00:00.000Z",
      likes: 15000,
      replies: 220,
      reposts: 3300,
      quotes: 0,
    },
    {
      id: "906674890484404224",
      text: "BEST. DAY. EVER.",
      permalink: "https://x.com/SloaneStephens/status/906674890484404224",
      createdAt: "2017-09-10T00:00:00.000Z",
      likes: 49000,
      replies: 3100,
      reposts: 0,
      quotes: 0,
    },
  ];
  const followers = parseCount("238.5K");
  const avgLikes = Math.round(posts.reduce((s, p) => s + p.likes, 0) / posts.length);
  const avgReplies = Math.round(posts.reduce((s, p) => s + p.replies, 0) / posts.length);
  const avgReposts = Math.round(posts.reduce((s, p) => s + p.reposts, 0) / posts.length);
  const payload = {
    syncedAt: now(),
    source: "cache",
    profile: {
      screenName: "SloaneStephens",
      name: "Sloane Stephens",
      handle: "@SloaneStephens",
      permalink: "https://x.com/SloaneStephens",
      followers,
      followersLabel: "238.5K Followers",
      following: 124,
      totalPosts: posts.length,
    },
    kpis: {
      followers,
      following: 124,
      sampledPosts: posts.length,
      avgLikes,
      avgReplies,
      avgReposts,
      engagementRate: followers
        ? Math.round(((avgLikes + avgReplies + avgReposts) / followers) * 10000) / 100
        : 0,
    },
    recentPosts: posts,
    topPosts: [...posts].sort((a, b) => b.likes - a.likes).slice(0, 8),
  };
  await writeFile(path.join(OUT, "twitter-analytics.json"), `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`X ${posts.length} posts, ${followers} followers`);
}

async function writeFacebook() {
  const followers = parseCount("725K");
  const posts = [
    {
      id: "pfbid02iajANLLfn1fHRdMEWe6WHjhZ3noueQmPwvv7rayaQQEsguDnTwJ7EZyEVAr4DGDjl",
      text: "Sloane Stephens is at ROLAND-GARROS. Paris, France.",
      permalink:
        "https://www.facebook.com/Sloaneposts/posts/pfbid02iajANLLfn1fHRdMEWe6WHjhZ3noueQmPwvv7rayaQQEsguDnTwJ7EZyEVAr4DGDjl",
      createdAt: "2025-06-03T00:00:00.000Z",
      likes: 2800,
      comments: 146,
      shares: 43,
    },
    {
      id: "photo-recent-1",
      text: "Sloane Stephens added a new photo.",
      permalink: "https://www.facebook.com/Sloaneposts/",
      createdAt: "2025-06-01T00:00:00.000Z",
      likes: 380,
      comments: 0,
      shares: 0,
    },
    {
      id: "photo-90s-fine",
      text: "90s fine",
      permalink: "https://www.facebook.com/Sloaneposts/",
      createdAt: "2025-02-01T00:00:00.000Z",
      likes: 510,
      comments: 0,
      shares: 0,
    },
    {
      id: "ate-this-up",
      text: "ate this up. literally.",
      permalink: "https://www.facebook.com/Sloaneposts/",
      createdAt: "2025-03-01T00:00:00.000Z",
      likes: 520,
      comments: 0,
      shares: 0,
    },
    {
      id: "more-tennis-please",
      text: "More tennis please @technifibre",
      permalink: "https://www.facebook.com/Sloaneposts/",
      createdAt: "2025-04-01T00:00:00.000Z",
      likes: 770,
      comments: 0,
      shares: 0,
    },
  ];
  const avgLikes = Math.round(posts.reduce((s, p) => s + p.likes, 0) / posts.length);
  const avgComments = Math.round(posts.reduce((s, p) => s + p.comments, 0) / posts.length);
  const avgShares = Math.round(posts.reduce((s, p) => s + p.shares, 0) / posts.length);
  const payload = {
    syncedAt: now(),
    source: "cache",
    page: {
      id: "Sloaneposts",
      name: "Sloane Stephens",
      slug: "Sloaneposts",
      permalink: "https://www.facebook.com/Sloaneposts/",
      followers,
      followersLabel: "725K followers",
      talkingAbout: 0,
    },
    kpis: {
      followers,
      totalPosts: posts.length,
      avgLikes,
      avgComments,
      avgShares,
      engagementRate: followers
        ? Math.round(((avgLikes + avgComments + avgShares) / followers) * 10000) / 100
        : 0,
    },
    recentPosts: posts,
    topPosts: [...posts].sort((a, b) => b.likes - a.likes).slice(0, 8),
  };
  await writeFile(path.join(OUT, "facebook-analytics.json"), `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`FB ${posts.length} posts, ${followers} followers`);
}

async function writeBeehiiv() {
  const html = await fetchText("https://sloanestephens.beehiiv.com/");
  const sitemap = await fetchText("https://sloanestephens.beehiiv.com/sitemap.xml");
  const titleMatches = [...html.matchAll(/"web_title":"((?:\\.|[^"\\])*)"/g)].map((m) =>
    m[1].replace(/\\u([\dA-Fa-f]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))),
  );
  const slugMatches = [...html.matchAll(/"slug":"([^"]+)"/g)]
    .map((m) => m[1])
    .filter((s) => !["podcast", "business", "posts", "authors"].includes(s));
  const slugs = [];
  const seen = new Set();
  for (const s of slugMatches) {
    if (seen.has(s)) continue;
    seen.add(s);
    slugs.push(s);
  }
  const lastmodBySlug = new Map();
  for (const m of sitemap.matchAll(/<url>\s*<loc>(.*?)<\/loc>\s*(?:<lastmod>(.*?)<\/lastmod>)?/gs)) {
    const loc = m[1];
    if (!loc.includes("/p/")) continue;
    const slug = loc.replace(/\/$/, "").split("/").pop();
    lastmodBySlug.set(slug, m[2] || now());
  }
  const count = Math.min(slugs.length, titleMatches.length);
  const posts = Array.from({ length: count }, (_, i) => ({
    id: slugs[i],
    title: titleMatches[i] || slugs[i],
    subtitle: "",
    url: `https://sloanestephens.beehiiv.com/p/${slugs[i]}`,
    publishedAt: lastmodBySlug.get(slugs[i]) || now(),
    thumbnail: "",
    source: "beehiiv",
  }));
  const payload = {
    syncedAt: now(),
    source: "live",
    publication: {
      id: "277a630a-5dde-4d4f-bcb5-ba871a7af973",
      name: "Sloane Stephens Off-Court",
      url: "https://sloanestephens.beehiiv.com/",
    },
    posts,
  };
  await writeFile(path.join(OUT, "beehiiv-posts.json"), `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Beehiiv ${posts.length} posts`);
}

await mkdir(OUT, { recursive: true });
await writeYoutube();
await writeTwitter();
await writeFacebook();
await writeBeehiiv();
console.log("done");

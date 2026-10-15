import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteConfig } from '../src/config/site.ts';

/** Validate the complete response before replacing either committed data file. */
export async function syncBilibili({
  root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
  mid = process.env.BILIBILI_MID || siteConfig.socials.bilibiliMid,
  fetcher = fetch,
} = {}) {
  if (!/^\d+$/.test(mid)) throw new Error('Set siteConfig.socials.bilibiliMid before syncing Bilibili videos');
  const response = await fetcher(`https://api.bilibili.com/x/v2/medialist/resource/list?type=1&biz_id=${encodeURIComponent(mid)}&ps=50`, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Referer: `https://space.bilibili.com/${mid}`,
    },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Bilibili HTTP ${response.status}`);
  const result = await response.json();
  if (result.code !== 0 || !Array.isArray(result.data?.media_list) || !result.data.media_list.length) {
    throw new Error(`Bilibili API: ${result.message || 'empty or invalid video list'}`);
  }
  const seen = new Set();
  const videos = result.data.media_list.map(video => {
    if (!/^BV[a-zA-Z0-9]{10}$/.test(video.bv_id) || seen.has(video.bv_id) ||
        typeof video.title !== 'string' || !video.title.trim() ||
        typeof video.cover !== 'string' || !/^https?:\/\//.test(video.cover) ||
        !Number.isFinite(video.duration) || video.duration < 0 ||
        !Number.isFinite(video.pubtime) || video.pubtime < 0 ||
        !Number.isFinite(video.cnt_info?.play) || video.cnt_info.play < 0) {
      throw new Error('Invalid video entry; existing files were preserved');
    }
    seen.add(video.bv_id);
    return {
      bvid: video.bv_id, title: video.title,
      cover: video.cover.replace(/^http:\/\//, 'https://'),
      duration: video.duration, play_count: video.cnt_info.play, publish_time: video.pubtime,
    };
  }).sort((a, b) => b.publish_time - a.publish_time);

  const videosPath = path.join(root, 'src/data/bilibili-videos.json');
  const cachePath = path.join(root, 'src/data/bilibili-cache.json');
  let cache = {};
  try { cache = JSON.parse(await fs.readFile(cachePath, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!cache || typeof cache !== 'object' || Array.isArray(cache)) throw new Error('Invalid existing Bilibili cache');
  for (const video of videos) {
    const seconds = Math.floor(video.duration);
    cache[video.bvid] = {
      ...cache[video.bvid],
      title: video.title, cover: video.cover,
      desc: cache[video.bvid]?.desc || '', author: siteConfig.author,
      duration: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`,
      views: video.play_count >= 10000 ? `${(video.play_count / 10000).toFixed(1)}万` : String(video.play_count),
    };
  }
  const suffix = `.sync-${process.pid}-${Date.now()}.tmp`;
  // Stage both JSON files first; failed requests and malformed payloads never touch originals.
  await fs.writeFile(videosPath + suffix, JSON.stringify(videos, null, 2) + '\n', 'utf8');
  await fs.writeFile(cachePath + suffix, JSON.stringify(cache, null, 2) + '\n', 'utf8');
  await fs.rename(videosPath + suffix, videosPath);
  await fs.rename(cachePath + suffix, cachePath);
  return { videos: videos.length, cached: Object.keys(cache).length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await syncBilibili();
    console.log(`[bili-sync] Updated ${result.videos} videos and ${result.cached} cached entries.`);
  } catch (error) {
    console.error(`[bili-sync] ${error.message}`);
    process.exitCode = 1;
  }
}

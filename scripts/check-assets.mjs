import fs from 'node:fs';
import path from 'node:path';

const css = fs.readFileSync('src/styles/fonts.css', 'utf8');
const urls = [...new Set([...css.matchAll(/url\(['"]?(\/fonts\/[^)'"\s]+)['"]?\)/g)].map(m => m[1]))];
const missing = urls.filter(url => !fs.existsSync(path.join('public', url.slice(1))));
for (const family of ['inter', 'noto-serif-sc', 'noto-sans-sc', 'jetbrains-mono']) {
  if (!fs.existsSync(`public/fonts/${family}/OFL.txt`)) missing.push(`public/fonts/${family}/OFL.txt`);
}
if (missing.length) throw new Error('Missing bundled font files/licenses:\n' + missing.join('\n'));
console.log(`[assets] ${urls.length} font URLs and 4 font licenses verified`);

/* デザインに関する法的な扱いの頁（design-legal.html）が書いた事実と、引いた条文を確かめる。
 *
 *   node verification/check_design.js
 *
 * 頁に書いた事実を、ファイルから数え直して突き合わせる。部品の表とファイル、来歴のコミット、書体の並び、
 * 画像と外から読む素材が無いこと、色の比、動きとキーボードと拡大の定め、配り方、つなぎ、書き方。
 * 条文は verification/statutes-design.json の写しと、ここに書いた sha256 の両方に合わせる。
 * 写しは nusquama の verification/statutes-texts.json（コミット 85dd680）から写した。
 *
 * 通ることでは信用できない。最後に、入力を一つずつ壊して、狙った項目が落ちることを確かめる。
 * 壊した入力は手元の写しの上だけで作り、ファイルには書かない。
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PAGE = 'design-legal.html';

/* nusquama の verification/statutes.json（コミット 85dd680）が記した、各条の sha256。
 * 写しの文と、写しの側の sha256 の両方を、ここに合わせる。写しを書き換えても、ここが動かなければ落ちる。 */
const PINNED = {
  '著作権法 第2条第1項第1号': '0f88f7f03918f732cfd781dbb99e4866384cea43aa62ca7e592ba493fe25cdf9',
  '著作権法 第10条第1項第4号': '1b51b19db7203d4b06a5c38df46175351f6ec7066007c6e7fc656dbbb655d184',
  '著作権法 第19条': 'e544aec935d1d2d11c98e1f90407335be874712ae20f88a90ea4ff100d8bf042',
  '著作権法 第20条': 'fd3c3f660c5bc41d424736d468def4f29f0f65d368f3a8c7be334dc9294e21c9',
  '著作権法 第21条': 'a85d04f2fd20d7867d5579bee40676b13405c58ea7fd7eb27f1e7a5a03bda100',
  '意匠法 第2条': '1269a8ef67318251bacfa8d8e3e21c068c595c209bcf8b75a44b30c155dfcc0a',
  '意匠法 第23条': '9b5f05ea19a53e1d43811f6be3cf4d311e1e97e59667fdfad36e4ab19917bc3e',
  '商標法 第25条': 'e1cd4c4290fdca9b93e0fd753c50e9fe5c6e353650609eb3f0d044c66797c405',
  '不正競争防止法 第2条第1項第1号・第2号': '900c33bc3c6d3b7db92cc13678d27b03af57f0dfdab5215edabbea437fb08484',
  '不正競争防止法 第2条第1項第3号': '252a66b5a09d62812203a03b27a15a835de6216b0b8059f044519dd7b2ad28a9',
  '障害者差別解消法 第2条': '3c5f4837cb368517ec9d236bc43ea08bfdb8b190f228e0f27800623c6a23522f',
  '障害者差別解消法 第8条': '0a058f1f4e2e5968d50afd70576a381409a1e62d19e629036114dea9139934f2',
};
const SOURCE_COMMIT = '85dd68091ce06598f55740428d3f1a927448523c';
/* 頁は出所のリポジトリの名を書かない。研究の系列の散文は創作の系列の名を書かない（cpsbvbng26-dotcom の check_ecosystem.js の 13c）。
 * 名は verification/statutes-design.json の「出所」に置き、ここで確かめる。 */
const SOURCE_LINE = '運営者の別のリポジトリの verification/statutes-texts.json（コミット 85dd680、e-Gov 法令 API から 2026-11-22 に取り寄せ）';
const CREATIVE = /nusquama|ヌスクァマ|無何有|騎士王国/i;
const FORMAL = { '障害者差別解消法': '障害を理由とする差別の解消の推進に関する法律' };

/* 見た目に関わるファイルの拡張子。頁の「部品の一覧」の前置きと同じ並び。 */
const DESIGN_EXT = ['html', 'css', 'svg', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'ico', 'woff', 'woff2', 'ttf', 'otf'];
const FONT_EXT = ['woff', 'woff2', 'ttf', 'otf'];
const PARTS = ['page', 'this', 'style', 'font', 'logo', 'share', 'figure', 'external', 'badge'];
const 漢 = '〇一二三四五六七八九十'.split('');

/* 来歴。頁の表が名指すコミットと、そのコミットが足したファイル。 */
const HISTORY = [['f883ee2', 'index.html', '2026-09-15'], ['c4d1e37', 'style.css', '2026-09-15']];

const CSP = "default-src 'none'; script-src 'none'; style-src 'self'; img-src 'self' data:; connect-src 'none'; form-action 'none'; base-uri 'none'";
const VIEWPORT = 'width=device-width, initial-scale=1.0';

/* cpsbvbng26-dotcom の check_ecosystem.js（12t）が、配っている頁に置かないと決めた言い方の日本語の一覧。
 * この頁も同じ言い方を使わない。 */
const ADMIT_JA = ['おそれは減', 'なくなりはしません', 'なくなるわけではない', 'おそれを断たない', '余地は残る', '余地もある', '当たりうる', '言い切れません', 'はっきりしない', 'はっきりしません',
  '裁判所の判断による', '判断は裁判所による', '除ききれない', '残る危険', '違法となるおそれ', '違反するおそれ', '違反となるおそれ', '抵触するおそれ', '読む道が残ります', '無効とされる余地',
  '守るものではない', '違法の可能性', '違反の可能性'];
/* 位と権威の語（check_text.js と同じ六語）と、使わないと決めた自称。 */
const TITLES = ['宗家', '流祖', '師範', '創始者', '免許皆伝', '段位', '独立研究者', 'Independent Researcher', 'コンサルタント'];

/* ---------------- 読む ---------------- */

function git(args) {
  try { return execFileSync('git', ['-C', ROOT].concat(args), { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { return null; }
}
function readAll() {
  const r = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
  const wfDir = path.join(ROOT, '.github', 'workflows');
  const shallow = (git(['rev-parse', '--is-shallow-repository']) || '').trim();
  const history = {};
  if (shallow === 'false') {
    for (const [h, f] of HISTORY) {
      const out = git(['show', '--no-patch', '--format=%ad', '--date=short', h]);
      const added = git(['show', '--format=', '--name-status', '--diff-filter=A', h]);
      history[h] = out === null ? null : { date: out.trim(), added: (added || '').split('\n').filter((l) => /^A\t/.test(l)).map((l) => l.slice(2)) };
    }
  }
  return {
    page: r(PAGE), index: r('index.html'), css: r('style.css'), readme: r('README.md'), license: r('LICENSE'),
    statutes: JSON.parse(r(path.join('verification', 'statutes-design.json'))),
    tracked: (git(['ls-files']) || '').split('\n').filter(Boolean),
    workflows: Object.fromEntries(fs.readdirSync(wfDir).filter((f) => /\.ya?ml$/.test(f)).sort().map((f) => [f, fs.readFileSync(path.join(wfDir, f), 'utf8')])),
    shallow, history,
  };
}

/* ---------------- 道具 ---------------- */

const sha = (t) => crypto.createHash('sha256').update(t, 'utf8').digest('hex');
const ws = (t) => String(t).replace(/\s+/g, '');
const text = (h) => h.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
const blockquotes = (h) => [...h.matchAll(/<blockquote([^>]*)>([\s\S]*?)<\/blockquote>/g)].map((m) => ({ attrs: m[1], body: m[2], index: m.index, attr: (k) => (new RegExp(k + '="([^"]*)"').exec(m[1]) || [])[1] }));
/* 散文の部分。<main> の中から、下の欄と囲みの引用と表と見出しを除く。下の欄は名とつなぎの並びで、文ではない。 */
const prose = (h) => ((/<main[^>]*>([\s\S]*?)<\/main>/.exec(h) || [, ''])[1])
  .replace(/<footer>[\s\S]*?<\/footer>/g, '').replace(/<blockquote[\s\S]*?<\/blockquote>/g, '').replace(/<div class="tw">[\s\S]*?<\/div>/g, '').replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/g, '');
const paragraphs = (h) => [...prose(h).matchAll(/<(p|li)[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => text(m[2]).replace(/\s+/g, ' ').trim()).filter(Boolean);
const rootVars = (css, sel) => {
  const m = new RegExp(sel.replace(/[[\]().*+?^$|\\]/g, '\\$&') + '\\s*\\{([^}]*)\\}').exec(css);
  return m ? Object.fromEntries([...m[1].matchAll(/--([a-z]+):\s*(#[0-9a-fA-F]{6})/g)].map((x) => [x[1], x[2].toLowerCase()])) : {};
};
function lum(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const floor2 = (x) => (Math.floor(x * 100 + 1e-9) / 100).toFixed(2);
const ext = (f) => (/\.([a-z0-9]+)$/i.exec(f) || [, ''])[1].toLowerCase();

/* ---------------- 項目 ---------------- */

/* どの項目も、問題の並びを返す。空なら通る。 */
const ITEMS = [
  ['statutes', '条文の写しの各条が、文の sha256 と、写しが記した値と、この検査に書いた値の三つで合い、出所が nusquama のコミット 85dd680 である（名は写しの側にだけ置く）', (x) => {
    const bad = [];
    const C = x.statutes['条'] || {};
    const keys = Object.keys(C).sort(), want = Object.keys(PINNED).sort();
    if (keys.join('|') !== want.join('|')) bad.push('写しの条の並びが違う');
    for (const k of want) {
      const e = C[k];
      if (!e) continue;
      if (sha(e['文']) !== e.sha256 || e.sha256 !== PINNED[k]) bad.push(k);
    }
    const src = x.statutes['出所'] || {};
    if (src['コミット'] !== SOURCE_COMMIT || src['リポジトリ'] !== 'cpsbvbng26-dotcom/nusquama' || src['ファイル'] !== 'verification/statutes-texts.json') bad.push('出所');
    if (!C['障害者差別解消法 第2条'] || C['障害者差別解消法 第2条']['法令名'] !== FORMAL['障害者差別解消法']) bad.push('障害者差別解消法の正式の名');
    return bad;
  }],
  ['quotes', '頁の条文の引用が、写しの全文と一字一句同じか、写しの一部であり、全文か切り出しかを名乗り、写しのどの条も引かれている', (x) => {
    const bad = [];
    const C = x.statutes['条'] || {};
    const used = new Set();
    const qs = blockquotes(x.page).filter((q) => q.attr('data-statute') !== undefined);
    if (!qs.length) bad.push('引用が無い');
    for (const q of qs) {
      const k = q.attr('data-statute'), cut = q.attr('data-cut');
      const e = C[k];
      if (!e) { bad.push('写しに無い条：' + k); continue; }
      used.add(k);
      const got = ws(text(q.body)), all = ws(e['文']);
      if (cut === 'whole') { if (got !== all) bad.push(k + '：全文と違う'); }
      else if (cut === 'excerpt') { if (!got || got === all || all.indexOf(got) < 0) bad.push(k + '：写しの一部でない'); }
      else bad.push(k + '：全文か切り出しかを名乗らない');
      /* 引用のすぐ前の段落が、全文か、どこを切り出したかを書く。 */
      const before = x.page.slice(0, q.index);
      const lastP = text((before.match(/<p>[\s\S]*?<\/p>/g) || ['']).pop());
      if (cut === 'whole' && lastP.indexOf('（写しの全文）') < 0) bad.push(k + '：前の段落が全文と書かない');
      if (cut === 'excerpt' && !/第\d+(項|号)[\s\S]*切り出しました/.test(lastP)) bad.push(k + '：前の段落がどこを切り出したかを書かない');
    }
    for (const k of Object.keys(C)) if (!used.has(k)) bad.push('引かれていない条：' + k);
    return bad;
  }],
  ['articles', '頁の散文が名指す条が、どれも写しにある条で、障害者差別解消法は初めに正式の名で書かれている', (x) => {
    const bad = [];
    const keys = Object.keys(x.statutes['条'] || {});
    const laws = [...new Set(keys.map((k) => k.replace(/ 第.*$/, '')))].sort((a, b) => b.length - a.length);
    const lawRe = new RegExp('(' + laws.join('|') + ')', 'g');
    let n = 0;
    for (const line of prose(x.page).split('\n')) {
      for (const m of line.matchAll(/第(\d+)条/g)) {
        n++;
        const names = [...line.slice(0, m.index).matchAll(lawRe)];
        const law = names.length ? names[names.length - 1][1] : null;
        if (!law || !keys.some((k) => k.startsWith(law + ' 第' + m[1] + '条'))) bad.push((law || '名の無い') + ' 第' + m[1] + '条');
      }
    }
    if (n === 0) bad.push('条を名指していない');
    const p = prose(x.page);
    for (const [short, formal] of Object.entries(FORMAL)) {
      const i = p.indexOf(formal + '（以下、' + short + '）');
      if (i < 0 || p.indexOf(short) < i) bad.push(short + 'の正式の名が初めに無い');
    }
    return bad;
  }],
  ['source', '頁が、写しの出所をコミット 85dd680 と e-Gov 法令 API の取り寄せの日で書き、法的な助言でなく弁護士の確認を受けていないと書く', (x) => {
    const bad = [];
    const p = text(x.page).replace(/\s+/g, ' ');
    if (p.indexOf(SOURCE_LINE) < 0) bad.push('出所の文');
    if (!SOURCE_COMMIT.startsWith('85dd680')) bad.push('出所のコミット');
    for (const t of ['運営者の側の理解です。法的な助言ではありません。弁護士の確認は受けていません。', 'この頁は法的な助言ではありません。弁護士の確認は受けていません。言語モデル（Claude、Anthropic）を用いて書いています。'])
      if (p.indexOf(t) < 0) bad.push(t.slice(0, 16));
    return bad;
  }],
  ['license', 'LICENSE から引いた文が LICENSE に一字一句あり、要旨が訳ではないと断り、README の許諾の表が頁の本文を CC BY 4.0 に挙げる', (x) => {
    const bad = [];
    const qs = blockquotes(x.page).filter((q) => q.attr('data-license') === 'LICENSE');
    if (!qs.length) bad.push('LICENSE の引用が無い');
    for (const q of qs) if (ws(x.license).indexOf(ws(text(q.body))) < 0 || !ws(text(q.body))) bad.push('LICENSE に無い文');
    if (!/^Creative Commons Attribution 4\.0 International/.test(x.license)) bad.push('LICENSE が CC BY 4.0 でない');
    if (text(x.page).indexOf('訳ではありません。') < 0) bad.push('訳ではないと断らない');
    if (x.readme.indexOf('| 散文 —— `README.md`、`index.html` と `design-legal.html` の本文 | [CC BY 4.0](LICENSE) |') < 0) bad.push('README の許諾の表');
    if (/`style\.css`/.test((/\n## ライセンス\n([\s\S]*?)\n## /.exec(x.readme) || [, ''])[1])) bad.push('README の許諾の表が style.css を名指すのに、頁は名指さないと書く');
    return bad;
  }],
  ['files', '部品の表のファイルの欄が、見た目に関わる追跡中のファイルと過不足なく一致し、表が部品の行をすべて持ち、前置きの数が合う', (x) => {
    const bad = [];
    const files = x.tracked.filter((f) => DESIGN_EXT.includes(ext(f))).sort();
    const rows = [...x.page.matchAll(/<tr data-part="([^"]*)" data-file="([^"]*)">/g)];
    const named = rows.map((m) => m[2]).filter(Boolean).sort();
    if (named.join('|') !== files.join('|')) bad.push('表 ' + named.join(',') + ' / 実際 ' + files.join(','));
    const parts = rows.map((m) => m[1]);
    if (parts.slice().sort().join('|') !== PARTS.slice().sort().join('|')) bad.push('部品の行 ' + parts.join(','));
    if (x.page.indexOf('このリポジトリに' + 漢[files.length] + 'つあります。') < 0) bad.push('前置きの数');
    const pre = text((/<h2>部品の一覧<\/h2>\s*<p>([\s\S]*?)<\/p>/.exec(x.page) || [, ''])[1]);
    if (pre.indexOf('（拡張子が ' + DESIGN_EXT.join('・') + ' のもの）') < 0) bad.push('前置きの拡張子の並び');
    return bad;
  }],
  ['history', '表が名指す来歴のコミットが、その日にそのファイルを足している', (x) => {
    const bad = [];
    if (x.shallow !== 'false') return ['git の履歴が無いか浅い（CI は fetch-depth: 0 で取り出す）'];
    for (const [h, f, d] of HISTORY) {
      const e = x.history[h];
      if (!e || e.date !== d || !e.added.includes(f)) bad.push(h + ' が ' + d + ' に ' + f + ' を足していない');
      if (text(x.page).indexOf(d + ' のコミット ' + h) < 0) bad.push('頁が ' + h + ' を名指さない');
    }
    return bad;
  }],
  ['fonts', '書体は配らず、style.css の font-family の並びが頁に書いた二つと同じで、@font-face と書体のファイルが無い', (x) => {
    const bad = [];
    const fams = [...x.css.matchAll(/font-family:\s*([^;}]+)/g)].map((m) => m[1].trim());
    const said = ["'Hiragino Mincho ProN', 'Yu Mincho', YuMincho, serif", 'ui-monospace, Menlo, monospace'];
    if (fams.join('|') !== said.join('|')) bad.push('並び ' + fams.join(' | '));
    for (const s of said) if (x.page.indexOf('<code>' + s + '</code>') < 0) bad.push('頁に無い ' + s);
    if (/@font-face/i.test(x.css)) bad.push('@font-face');
    if (x.tracked.some((f) => FONT_EXT.includes(ext(f)))) bad.push('書体のファイル');
    for (const h of [x.page, x.index]) if (/font-src/.test(h)) bad.push('CSP の font-src');
    return bad;
  }],
  ['images', '二つの頁に、画像の要素も、icon の link も、共有用の画像の meta も無い', (x) => {
    const bad = [];
    for (const [n, h] of [['index.html', x.index], [PAGE, x.page]]) {
      if (/<(img|svg|picture|video|canvas|object|embed|iframe)\b/i.test(h)) bad.push(n + '：画像の要素');
      if (/rel="[^"]*icon[^"]*"/i.test(h)) bad.push(n + '：icon の link');
      if (/<meta[^>]*(og:image|twitter:)/i.test(h)) bad.push(n + '：共有用の画像の meta');
    }
    return bad;
  }],
  ['external', '二つの頁が同じ CSP（default-src none）を持ち、外を指す src と stylesheet が無く、style.css も外を読まない', (x) => {
    const bad = [];
    for (const [n, h] of [['index.html', x.index], [PAGE, x.page]]) {
      const csp = (/http-equiv="Content-Security-Policy" content="([^"]*)"/.exec(h) || [])[1];
      if (csp !== CSP) bad.push(n + '：CSP');
      if (/\ssrc="/i.test(h)) bad.push(n + '：src');
      const sheets = [...h.matchAll(/<link [^>]*rel="stylesheet"[^>]*>/g)].map((m) => (/href="([^"]*)"/.exec(m[0]) || [])[1]);
      if (sheets.join('|') !== 'style.css') bad.push(n + '：stylesheet ' + sheets.join(','));
      if (/<script\b/i.test(h) || /<style\b/i.test(h) || /\sstyle="/i.test(h)) bad.push(n + '：script か style の書き込み');
    }
    if (/url\(|@import/i.test(x.css)) bad.push('style.css が外を読む');
    return bad;
  }],
  ['badges', 'README の画像のバッジが二つで、どれも github.com か zenodo.org の画像である', (x) => {
    const bad = [];
    const imgs = [...x.readme.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]);
    const hosts = imgs.map((u) => (/^https:\/\/([^/]+)\//.exec(u) || [, ''])[1]);
    if (!hosts.length || !hosts.every((h) => h === 'github.com' || h === 'zenodo.org')) bad.push('所在 ' + hosts.join(','));
    if (x.page.indexOf('の上の' + 漢[imgs.length] + 'つのバッジは、GitHub と Zenodo のサーバーが描く画像です。') < 0) bad.push('頁の数 ' + imgs.length);
    if (/<img\b|!\[/.test(x.index)) bad.push('index.html がバッジを読む');
    return bad;
  }],
  ['contrast', '文字の色と地の色のどの組も比が 4.5 を下回らず、頁の比の表が style.css の色から数え直したものと同じで、数の名乗りが合う', (x) => {
    const bad = [];
    const V = rootVars(x.css, ':root');
    const fg = [...new Set([...x.css.matchAll(/(?:^|[;{\s])color:\s*var\(--([a-z]+)\)/g)].map((m) => m[1]))];
    const bg = [...new Set([...x.css.matchAll(/background(?:-color)?:\s*var\(--([a-z]+)\)/g)].map((m) => m[1]))];
    const other = [...x.css.matchAll(/(?:^|[;{\s])(color|background(?:-color)?):\s*(?!\s|var\()([^;}]+)/g)].map((m) => m[1] + ' ' + m[2]);
    if (other.length) bad.push('変数でない色 ' + other.join(','));
    const rows = [...x.page.matchAll(/<tr data-contrast="([a-z]+) ([a-z]+)">([\s\S]*?)<\/tr>/g)];
    const want = fg.flatMap((f) => bg.map((b) => f + ' ' + b)).sort();
    const got = rows.map((m) => m[1] + ' ' + m[2]).sort();
    if (want.join('|') !== got.join('|')) bad.push('組 ' + got.join(',') + ' / 実際 ' + want.join(','));
    let min = null;
    for (const m of rows) {
      const [f, b] = [m[1], m[2]];
      if (!V[f] || !V[b]) { bad.push('色が無い ' + f + ' ' + b); continue; }
      const r = ratio(V[f], V[b]);
      const cells = [...m[3].matchAll(/<td>([\s\S]*?)<\/td>/g)].map((c) => text(c[1]));
      if (cells[0] !== '--' + f + '（' + V[f] + '）' || cells[1] !== '--' + b + '（' + V[b] + '）' || cells[2] !== floor2(r)) bad.push(f + ' ' + b + '：' + cells.join(' / ') + ' / 実際 ' + floor2(r));
      if (r < 4.5) bad.push(f + ' ' + b + '：比が 4.5 を下回る');
      if (!min || r < min[0]) min = [r, f, b];
    }
    const p = text(x.page);
    if (p.indexOf('文字に使う色は' + 漢[fg.length] + 'つ、地に使う色は' + 漢[bg.length] + 'つです。') < 0) bad.push('色の数の名乗り');
    if (!min || p.indexOf('いちばん低いのは --' + min[1] + ' と --' + min[2] + ' の組で、' + floor2(min[0]) + ' です。') < 0) bad.push('いちばん低い組の名乗り');
    return bad;
  }],
  ['a11y', '下線を消さず、動くものが無く、tabindex と輪郭と拡大を止める定めが無く、lang が ja で、暗い配色は使われない', (x) => {
    const bad = [];
    if (/text-decoration/i.test(x.css)) bad.push('text-decoration');
    if (!/\bb \{ font-weight: 600; \}/.test(x.css)) bad.push('太字の定め');
    if (/animation|transition|@keyframes|scroll-behavior/i.test(x.css)) bad.push('動き');
    if (/outline/i.test(x.css)) bad.push('outline');
    for (const [n, h] of [['index.html', x.index], [PAGE, x.page]]) {
      if (/tabindex="[1-9]/.test(h)) bad.push(n + '：正の tabindex');
      if ((/<meta name="viewport" content="([^"]*)"/.exec(h) || [])[1] !== VIEWPORT) bad.push(n + '：viewport');
      if (!/^<!DOCTYPE html>\n<html lang="ja">/.test(h)) bad.push(n + '：lang');
      if (/data-theme=/.test(h.replace(/<code>[^<]*<\/code>/g, ''))) bad.push(n + '：data-theme');
    }
    if (!/:root\[data-theme="dark"\]/.test(x.css)) bad.push('暗い配色の定めが無いのに、頁は有ると書く');
    return bad;
  }],
  ['pages', 'リポジトリに頁を配るワークフローも CNAME も無く、頁がそう書く', (x) => {
    const bad = [];
    for (const [f, t] of Object.entries(x.workflows)) if (/deploy-pages|upload-pages-artifact|pages:\s*write|configure-pages/.test(t)) bad.push(f);
    for (const f of ['CNAME', '.nojekyll', 'docs/CNAME']) if (x.tracked.includes(f)) bad.push(f);
    const p = text(x.page).replace(/\s+/g, ' ');
    if (p.indexOf('このリポジトリは、GitHub Pages で配っていません。') < 0 || p.indexOf('リポジトリの中にも、頁を配るワークフローと CNAME のファイルはありません。') < 0) bad.push('頁の文');
    return bad;
  }],
  ['links', 'index.html と README がこの頁につなぎ、この頁が index.html に戻り、題が同じ形である', (x) => {
    const bad = [];
    const foot = (/<footer>([\s\S]*?)<\/footer>/.exec(x.index) || [, ''])[1];
    if (foot.indexOf('<a href="design-legal.html">デザインに関する法的な扱い</a>') < 0) bad.push('index.html の下の欄');
    if (x.readme.indexOf('[design-legal.html](design-legal.html)') < 0) bad.push('README');
    if ((x.page.match(/<a href="index.html">自己実験としての名乗り<\/a>/g) || []).length < 2) bad.push('この頁から戻るつなぎ');
    if (x.page.indexOf('<title>デザインに関する法的な扱い | 根本卓哉</title>') < 0 || x.page.indexOf('<h1>デザインに関する法的な扱い</h1>') < 0) bad.push('題');
    return bad;
  }],
  ['writing', '頁の散文が、ですます調で、二人称と指図を使わず、太字とダッシュを使わず、使わないと決めた語と言い方と「数＋件・項目・通り」を書かない', (x) => {
    const bad = [];
    const ps = paragraphs(x.page);
    const main = (/<main[^>]*>([\s\S]*?)<\/main>/.exec(x.page) || [, ''])[1];
    for (const p of ps) {
      for (const s of p.split('。').map((y) => y.trim()).filter(Boolean)) {
        const t = s.replace(/（[^（）]*）$/, '');
        if (!/(です|ます|ません|ました|でした)$/.test(t)) bad.push('ですます：' + s.slice(-12));
      }
      if ((p.match(/——|―|－/g) || []).length > 0) bad.push('ダッシュ：' + p.slice(0, 12));
    }
    const all = text(main);
    for (const w of ['あなた', 'してください', 'ください']) if (all.indexOf(w) >= 0) bad.push('指図か二人称：' + w);
    if (/<(b|strong)>/.test(main)) bad.push('太字');
    for (const w of ADMIT_JA.concat(TITLES)) if (all.indexOf(w) >= 0) bad.push('語：' + w);
    if (/(?<![0-9０-９.\-/])[0-9]+\s?(件|項目|通り)/.test(text(x.page))) bad.push('数＋件・項目・通り');
    if (/[父母]/.test(all.replace(/分母|母語|母集団/g, ''))) bad.push('父か母');
    if (CREATIVE.test(x.page) || CREATIVE.test(x.readme)) bad.push('創作の系列の名');
    return bad;
  }],
];

function run(x) {
  return ITEMS.map(([key, name, f]) => { let bad; try { bad = f(x); } catch (e) { bad = ['例外 ' + e.message]; } return [key, name, bad]; });
}

/* ---------------- 回す ---------------- */

const real = readAll();
let pass = 0;
const failures = [];
function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  通  ' + name + (detail ? '  ' + detail : '')); }
  else { failures.push(name); console.log('  落  ' + name + (detail ? '  ' + detail : '')); }
}
for (const [, name, bad] of run(real)) ok(name, bad.length === 0, bad.slice(0, 6).join(' / '));

/* 兄弟の nusquama があれば、写しの文を、出所のコミットの文と突き合わせる（ECOSYSTEM_ROOT でも指せる）。
 * 無ければ、見ていないと名乗って通す（CI には兄弟が無い）。 */
{
  const eco = process.env.ECOSYSTEM_ROOT || path.resolve(ROOT, '..');
  const nu = path.join(eco, 'nusquama');
  let src = null;
  try { src = JSON.parse(execFileSync('git', ['-C', nu, 'show', SOURCE_COMMIT + ':verification/statutes-texts.json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })); } catch (e) { src = null; }
  if (src === null) {
    try { const t = JSON.parse(fs.readFileSync(path.join(nu, 'verification', 'statutes-texts.json'), 'utf8')); if (Object.keys(PINNED).every((k) => t[k] !== undefined)) src = t; } catch (e) { src = null; }
  }
  if (src === null) ok('写しの文が、兄弟の nusquama の取り寄せた文と一字一句同じ', true, '兄弟に出所の文が無いので、見ていない');
  else {
    const 違い = Object.keys(PINNED).filter((k) => src[k] !== (real.statutes['条'][k] || {})['文']);
    ok('写しの文が、兄弟の nusquama の取り寄せた文と一字一句同じ', 違い.length === 0, 違い.length ? 違い.join(', ') : Object.keys(PINNED).length + ' 条');
  }
}

/* ---------------- 壊して確かめる ---------------- */

const clone = (x) => JSON.parse(JSON.stringify(x));
function broken(f) { const y = clone(real); f(y); return y; }
const rep = (k, a, b) => (y) => { if (y[k].indexOf(a) < 0) throw new Error('壊す先が無い：' + a.slice(0, 20)); y[k] = y[k].replace(a, b); };
const BREAKS = [
  ['statutes', '写しの文を一字変える', (y) => { y.statutes['条']['商標法 第25条']['文'] = y.statutes['条']['商標法 第25条']['文'].replace('専有する', '有する'); }],
  ['statutes', '写しの文と写しの sha256 をそろえて変える', (y) => { const e = y.statutes['条']['著作権法 第21条']; e['文'] = e['文'].replace('専有する', '有する'); e.sha256 = sha(e['文']); }],
  ['statutes', '写しの出所のコミットを変える', (y) => { y.statutes['出所']['コミット'] = SOURCE_COMMIT.replace(/^8/, '9'); }],
  ['quotes', '頁の引用を一字変える', rep('page', '視覚を通じて美感を起こさせるものをいう。</p>', '視覚を通じて美しさを起こさせるものをいう。</p>')],
  ['quotes', '切り出しを全文と名乗る', rep('page', 'data-statute="著作権法 第19条" data-cut="excerpt"', 'data-statute="著作権法 第19条" data-cut="whole"')],
  ['quotes', '写しの一条を引かない', (y) => { y.page = y.page.replace(/<blockquote class="note" data-statute="著作権法 第21条"[\s\S]*?<\/blockquote>/, ''); }],
  ['articles', '写しに無い条を散文で名指す', rep('page', '<p>二つの頁は、何も売りません。', '<p>商標法第26条も見ました。二つの頁は、何も売りません。')],
  ['articles', '正式の名を外す', rep('page', '障害を理由とする差別の解消の推進に関する法律（以下、障害者差別解消法）の第2条', '障害者差別解消法の第2条')],
  ['source', '出所のコミットを頁で変える', rep('page', '（コミット 85dd680、', '（コミット 85dd681、')],
  ['source', '弁護士の一文を外す', rep('page', '法的な助言ではありません。弁護士の確認は受けていません。</p>\n\n<p>条文', '法的な助言ではありません。</p>\n\n<p>条文')],
  ['license', 'LICENSE の引用を一字変える', rep('page', 'but not otherwise.</p>', 'and otherwise.</p>')],
  ['license', 'README の許諾の表から頁を外す', rep('readme', '`index.html` と `design-legal.html` の本文', '`index.html` の本文')],
  ['files', '画像のファイルを足す', (y) => { y.tracked.push('favicon.ico'); }],
  ['files', '表から style.css の行を外す', (y) => { y.page = y.page.replace(/<tr data-part="style"[\s\S]*?<\/tr>\n/, ''); }],
  ['history', '来歴のコミットを変える', rep('page', '2026-09-15 のコミット c4d1e37', '2026-09-15 のコミット c4d1e38')],
  ['history', '来歴を浅い取り出しにする', (y) => { y.shallow = 'true'; }],
  ['fonts', '書体の並びに一つ足す', rep('css', "font-family: 'Hiragino Mincho ProN',", "font-family: 'Noto Serif JP', 'Hiragino Mincho ProN',")],
  ['fonts', '@font-face を足す', (y) => { y.css += "\n@font-face { font-family: X; src: local(X); }\n"; }],
  ['images', 'index.html に画像を足す', rep('index', '<h1>自己実験としての名乗り</h1>', '<h1>自己実験としての名乗り</h1>\n<img src="logo.png" alt="">')],
  ['images', '共有用の画像の meta を足す', rep('page', '<meta name="robots"', '<meta property="og:image" content="og.png">\n<meta name="robots"')],
  ['images', 'icon の link を足す', rep('index', '<link rel="stylesheet" href="style.css">', '<link rel="icon" href="favicon.svg">\n<link rel="stylesheet" href="style.css">')],
  ['external', '外の stylesheet を足す', rep('page', '<link rel="stylesheet" href="style.css">', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=X">\n<link rel="stylesheet" href="style.css">')],
  ['external', 'CSP をずらす', rep('index', "style-src 'self';", "style-src 'self' 'unsafe-inline';")],
  ['external', 'style.css から外を読む', (y) => { y.css += '\n@import url("https://example.com/x.css");\n'; }],
  ['badges', 'README に外の画像を足す', rep('readme', '\n\n**非流派', '\n[![x](https://img.shields.io/badge/x-y-z)](https://example.com)\n\n**非流派')],
  ['contrast', '色を一つ変える', rep('css', '--faint: #727278;', '--faint: #8a8a90;')],
  ['contrast', '表の比を一つ変える', rep('page', '<td>5.65</td>', '<td>5.66</td>')],
  ['contrast', '文字の色を一つ足す', rep('css', '.lede { color: var(--muted);', '.lede { color: var(--line);')],
  ['contrast', '変数でない色を足す', rep('css', 'footer a { color: var(--faint); }', 'footer a { color: #b0b0b0; }')],
  ['contrast', '表から組を一つ外す', (y) => { y.page = y.page.replace(/<tr data-contrast="accent card">[\s\S]*?<\/tr>\n/, ''); }],
  ['a11y', 'リンクの下線を消す', rep('css', 'a { color: var(--accent); }', 'a { color: var(--accent); text-decoration: none; }')],
  ['a11y', '動きを足す', rep('css', 'a { color: var(--accent); }', 'a { color: var(--accent); transition: color .2s; }')],
  ['a11y', '輪郭を消す', (y) => { y.css += '\na:focus { outline: none; }\n'; }],
  ['a11y', '拡大を止める', rep('page', 'content="width=device-width, initial-scale=1.0"', 'content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no"')],
  ['a11y', '暗い配色を付ける', rep('index', '<html lang="ja">', '<html lang="ja" data-theme="dark">')],
  ['a11y', '正の tabindex を付ける', rep('page', '<main id="main" tabindex="-1">', '<main id="main" tabindex="1">')],
  ['pages', '頁を配るワークフローを足す', (y) => { y.workflows['pages.yml'] = 'permissions:\n  pages: write\njobs:\n  d:\n    steps:\n      - uses: actions/deploy-pages@v4\n'; }],
  ['pages', 'CNAME を足す', (y) => { y.tracked.push('CNAME'); }],
  ['links', 'index.html の下の欄からつなぎを外す', rep('index', '<p><a href="design-legal.html">デザインに関する法的な扱い</a></p>\n', '')],
  ['links', 'README からつなぎを外す', rep('readme', '- デザインに関する法的な扱い —— [design-legal.html](design-legal.html)\n', '')],
  ['writing', 'である調の文を足す', rep('page', '<p>この頁の事実は、2026-11-22 に確かめたものです。</p>', '<p>この頁の事実は、2026-11-22 に確かめたものである。</p>')],
  ['writing', '指図を足す', rep('page', '<p>この頁の事実は、2026-11-22 に確かめたものです。</p>', '<p>この頁の事実は、2026-11-22 に確かめたものです。誤りは知らせてください。</p>')],
  ['writing', '太字を足す', rep('page', '<p>この頁の事実は、', '<p><b>この頁の事実は</b>、')],
  ['writing', '数＋件を書く', rep('page', '<p>この頁の事実は、2026-11-22 に確かめたものです。</p>', '<p>この頁の事実は、2026-11-22 に確かめたもので、12 件あります。</p>')],
  ['writing', '創作の系列の名を書く', rep('page', '運営者の別のリポジトリの verification', 'nusquama の verification')],
  ['writing', '認める言い方を足す', rep('page', '条文の文からは決まりません。運営者は', '当たりうると考えています。運営者は')],
];
{
  const missed = [];
  for (const [key, name, f] of BREAKS) {
    let y;
    try { y = broken(f); } catch (e) { missed.push(name + '（' + e.message + '）'); continue; }
    const r = run(y).find(([k]) => k === key);
    if (!r || r[2].length === 0) missed.push(name);
  }
  ok('壊して確かめる：入力を一つずつ壊すと、狙った項目が落ちる（' + (BREAKS.length - missed.length) + ' / ' + BREAKS.length + '）',
    missed.length === 0, missed.join(' / '));
}

console.log('\n' + '-'.repeat(50));
if (failures.length) {
  console.log(pass + ' 件が通り、' + failures.length + ' 件が通りませんでした。');
  failures.forEach((f) => console.log('  - ' + f));
  process.exit(1);
}
console.log(pass + ' 件すべて通りました。');

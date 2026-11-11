/* 読むのにかかる時間の目安を、字数から計算して二つの面に書き込む。
 *
 *   node verification/update_reading_time.js          # 書き込む
 *   node verification/update_reading_time.js --print  # 計算した文を出すだけ
 *
 * **数を手で書かない**（決めごと 5）。字数は配信の面（index.html）の本文から数え、
 * README.md と index.html の印のあいだを、同じ一文で置き換える。
 * check_text.js が同じ関数で数え直し、印のあいだが一致しなければ落とす。
 *
 * 数え方。<main> の中から、<footer> と、この印の区間そのものを除き、タグと空白を
 * 落とした残りの字を数える。印の区間を除くのは、書き込んだ数で字数が動かないようにするため。
 * 一分に 500 字として割り、切り上げる。
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const START = '<!-- 読む時間:ここから -->';
const END = '<!-- 読む時間:ここまで -->';
const PER_MINUTE = 500;

function count(html) {
  const main = (/<main[^>]*>([\s\S]*?)<\/main>/.exec(html) || [, ''])[1];
  return main
    .replace(new RegExp(START + '[\\s\\S]*?' + END, 'g'), '')
    .replace(/<footer[\s\S]*?<\/footer>/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&[a-z]+;|&#\d+;/g, 'x')
    .replace(/\s+/g, '')
    .length;
}

function sentence(html) {
  const chars = count(html);
  const minutes = Math.ceil(chars / PER_MINUTE);
  return '読むのにかかる時間の目安は約 ' + minutes + ' 分です（本文 ' + chars
    + ' 字を、一分に ' + PER_MINUTE + ' 字として `verification/update_reading_time.js` が数えました）。';
}

function between(text) {
  const i = text.indexOf(START);
  const j = text.indexOf(END);
  return i < 0 || j < i ? null : text.slice(i + START.length, j);
}

function write(file, body) {
  const full = path.join(ROOT, file);
  const text = fs.readFileSync(full, 'utf8');
  const old = between(text);
  if (old === null) throw new Error(file + ' に印がありません');
  fs.writeFileSync(full, text.replace(START + old + END, START + body + END));
}

module.exports = { count, sentence, between, START, END, PER_MINUTE };

if (require.main === module) {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const s = sentence(html);
  if (process.argv.includes('--print')) { console.log(s); process.exit(0); }
  /* index.html はコードの記法を持たないので、` を <code> に替えて書く。 */
  write('README.md', s);
  write('index.html', s.replace(/`([^`]+)`/g, '<code>$1</code>'));
  console.log(s);
}

/* 本文が自分と食い違わないかを見る。
 *
 *   node verification/check_text.js
 *
 * **通ることでは信用できない。**足したときに必ず壊して、意図した項目が
 * 落ちることを確かめてある。
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const md = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');

const failures = [];
let pass = 0;
function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  通  ' + name + (detail ? '  ' + detail : '')); }
  else { failures.push(name); console.log('  落  ' + name + (detail ? '  ' + detail : '')); }
}

const 漢 = '〇一二三四五六七八九十'.split('');

/* **三つ組が芯である。**一つでも欠ければ、残るのは
 * 「一人だから試せない」という平凡な話に戻る。 */
{
  const 三つ = ['裏切り', '騙し討ち', '不意打ち'];
  const 欠け = 三つ.filter((w) => md.indexOf(w) < 0);
  ok('稽古が排除する' + 漢[三つ.length] + 'つが、本文に立っている',
     欠け.length === 0, 欠け.length ? 欠け.join(' / ') : 三つ.join('・'));
  ok('三つが、意思・情報・時間に割り当てられている',
     md.indexOf('相手の**意思**') >= 0
     && md.indexOf('相手の**情報**') >= 0
     && md.indexOf('相手の**時間**') >= 0);
  ok('三つが一つであると書いてある',
     md.indexOf('三つは別々の欠点ではない。同じ一つのことの、三つの面である。') >= 0);
}

/* **帰結の向きが反転したら落ちる。**「一人でも仕上がる」を支える形に
 * 書き換われば、記録ではなく宣伝になる。 */
ok('帰結が、こちらに不利な向きのままである',
   md.indexOf('「一人だから」ではない。道場でも示せない。') >= 0
   && md.indexOf('支えているのは、「一人でも道場でも、同じ穴が開いている」のほうである。') >= 0);

/* **究極形態は戦略的能力である。**そして、それが弱さから出ていることと、
 * 測定ではないことの二つを、同じ節に置いてある。**どちらかが消えたら落ちる。** */
{
  const 内訳 = ['状況を読むこと', '位置を取ること', '関係を結ぶ相手を選ぶこと', '退く判断を下すこと'];
  const 欠け = 内訳.filter((w) => md.indexOf(w) < 0);
  ok('究極形態が、戦略的能力として立っている',
     md.indexOf('本稿はこれを**戦略的能力**と呼ぶ') >= 0
     && md.indexOf('これが独我流の究極形態である') >= 0);
  ok('戦略的能力の内訳が、名乗った数だけある',
     欠け.length === 0
     && md.indexOf('内訳は' + 漢[内訳.length] + 'つある') >= 0,
     欠け.length ? 欠け.join(' / ') : (内訳.length + ' つ'));
  ok('戦略が、強さではなく弱さから出ていると書いてある',
     md.indexOf('強いから戦略を選ぶのではない') >= 0
     && md.indexOf('こちらは選べないから選ぶ') >= 0);
  ok('戦略的能力が、測定ではなく主張だと認めてある',
     md.indexOf('回避できなかった記録を、著者は持っていない') >= 0
     && md.indexOf('戦略的能力は主張であって、測定ではない') >= 0);
}

/* **欠けているものの数は、散文にも表にも出る。**片方だけ動かせば落ちる。 */
{
  const rows = (md.match(/^\| \d+ \| \*\*/gm) || []).length;
  const m = /五つある。/.exec(md);
  ok('欠けているものの数が、表の行数と合う',
     rows > 0 && md.indexOf(漢[rows] + 'つある。') >= 0
     && md.indexOf(漢[rows] + 'つとも埋まっていない') >= 0,
     '表 ' + rows + ' 行' + (m ? '' : '（散文の名乗りが無い）'));
}

/* **位と権威を示す語を入れない。**入れた瞬間に、これは自称の肩書きになる。 */
{
  const 権威 = ['宗家', '流祖', '師範', '創始者', '免許皆伝', '段位'];
  const 出た = 権威.filter((w) => md.indexOf(w) >= 0);
  ok('位と権威の語を使っていない', 出た.length === 0,
     出た.length ? 出た.join(' / ') : (権威.length + ' 語とも無い'));
}

/* **他人の来歴を、名乗りの支えに使わない。** */
{
  const 借り = ['藤平', '心身統一合氣道会', '氣の研究会', '植芝'].filter((w) => md.indexOf(w) >= 0);
  ok('他人の来歴を、名乗りの支えに使っていない',
     借り.length === 0 && md.indexOf('名乗ることの先行例は挙げない') >= 0,
     借り.length ? 借り.join(' / ') : '支えを外したまま置いてある');
}

/* **経験は等級ではない。**年数が段に読み替えられないよう押さえる。 */
ok('年数が審査を経ていないと書いてある',
   md.indexOf('段は一つも無い。') >= 0
   && md.indexOf('7 年は、審査を経た数ではない。') >= 0);
ok('盛れる場所を、先に潰してある',
   md.indexOf('元ボクサーと立ったことは、勝ったことではない') >= 0
   && md.indexOf('面を受けたことも、受けた側の記録である') >= 0);

/* **査読を受けていないことと、AI を使ったことを消さない。** */
ok('査読前であることが書いてある',
   md.indexOf('公開ノート（査読前）') >= 0
   && md.indexOf('これは論文ではない。査読も受けていない。') >= 0);
ok('AI 支援の開示が残っている',
   md.indexOf('生成 AI（Claude、Anthropic）を用いて書いている') >= 0);

/* **自己実験と名乗る以上、設計の穴も書いてある。** */
ok('実験の設計が、埋まっていないと認めてある',
   md.indexOf('現段階でこれは実験ではない') >= 0
   && md.indexOf('実験の設計だけがある状態である') >= 0);

console.log('\n' + '-'.repeat(50));
if (failures.length) {
  console.log(pass + ' 件が通り、' + failures.length + ' 件が通りませんでした。');
  failures.forEach((f) => console.log('  - ' + f));
  process.exit(1);
}
console.log(pass + ' 件すべて通りました。');

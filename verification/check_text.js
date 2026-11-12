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

/* **本文は二つある。**README.md（GitHub の面）と index.html（配信の面）。
 * **片方だけ直せば、二つは静かにずれる。**記法を落として同じ地の文にしてから、
 * すべての項目を両方に当てる。片方で落ちれば、その項目が落ちる。 */
const 素 = (t) => t
  .replace(/<style>[\s\S]*?<\/style>/g, '')
  .replace(/<[^>]*>/g, '')
  .replace(/\*\*/g, '')
  .replace(/\s+/g, '');
const SRC = {
  'README.md': 素(fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8')),
  'index.html': 素(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')),
};
/* 両方に入っていなければ、入っていないものとして扱う。 */
const md = {
  indexOf: (x) => Object.values(SRC)
    .every((t) => t.indexOf(素(x)) >= 0) ? 0 : -1,
  match: (re) => fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8').match(re),
};

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
     md.indexOf('三つは別々の欠点ではありません。同じ一つのことの、三つの面です。') >= 0);
}

/* **帰結の向きが反転したら落ちる。**「一人でも仕上がる」を支える形に
 * 書き換われば、記録ではなく宣伝になる。 */
ok('帰結が、こちらに不利な向きのままである',
   md.indexOf('「一人だから」ではありません。道場でも示せません。') >= 0
   && md.indexOf('支えているのは、「一人でも道場でも、同じ穴が開いている」のほうです。') >= 0);

/* **究極形態は戦略的能力である。**そして、それが弱さから出ていることと、
 * 測定ではないことの二つを、同じ節に置いてある。**どちらかが消えたら落ちる。** */
{
  const 内訳 = ['状況を読むこと', '位置を取ること', '関係を結ぶ相手を選ぶこと', '退く判断を下すこと'];
  const 欠け = 内訳.filter((w) => md.indexOf(w) < 0);
  ok('究極形態が、戦略的能力として立っている',
     md.indexOf('本稿はこれを**戦略的能力**と呼びます') >= 0
     && md.indexOf('これが独我流の究極形態です') >= 0);
  ok('戦略的能力の内訳が、名乗った数だけある',
     欠け.length === 0
     && md.indexOf('内訳は' + 漢[内訳.length] + 'つあります') >= 0,
     欠け.length ? 欠け.join(' / ') : (内訳.length + ' つ'));
  ok('戦略が、強さではなく弱さから出ていると書いてある',
     md.indexOf('強いから戦略を選ぶのではありません') >= 0
     && md.indexOf('こちらは選べないから選びます') >= 0);
  ok('戦略的能力が、測定ではなく主張だと認めてある',
     md.indexOf('回避できなかった記録を、著者は持っていません') >= 0
     && md.indexOf('戦略的能力は主張であって、測定ではありません') >= 0);
}

/* **欠けているものの数は、散文にも表にも出る。**片方だけ動かせば落ちる。 */
{
  /* **太字に依らせない**（書き方 5）。行の頭の番号だけを数える。 */
  const rows = (md.match(/^\| \d+ \| /gm) || []).length;
  const m = /五つあります。/.exec(md);
  ok('欠けているものの数が、表の行数と合う',
     rows > 0 && md.indexOf(漢[rows] + 'つあります。') >= 0
     && md.indexOf(漢[rows] + 'つとも埋まっていません') >= 0,
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
     借り.length === 0 && md.indexOf('名乗ることの先行例は挙げません') >= 0,
     借り.length ? 借り.join(' / ') : '支えを外したまま置いてある');
}

/* **経験は等級ではない。**年数が段に読み替えられないよう押さえる。 */
ok('年数が審査を経ていないと書いてある',
   md.indexOf('段は一つもありません。') >= 0
   && md.indexOf('7 年は、審査を経た数ではありません。') >= 0);
ok('盛れる場所を、先に潰してある',
   md.indexOf('元ボクサーと立ったことは、勝ったことではありません') >= 0
   && md.indexOf('面を受けたことも、受けた側の記録です') >= 0);

/* **査読を受けていないことと、言語モデルを使ったことを消さない。** */
ok('査読前であることが書いてある',
   md.indexOf('公開ノート（査読前）') >= 0
   && md.indexOf('これは論文ではありません。査読も受けていません。') >= 0);
ok('言語モデル利用の開示が残っている',
   md.indexOf('言語モデル（Claude、Anthropic）を用いて書いています') >= 0);

/* **自己実験と名乗る以上、設計の穴も書いてある。** */
ok('実験の設計が、埋まっていないと認めてある',
   md.indexOf('現段階でこれは実験ではありません') >= 0
   && md.indexOf('実験の設計だけがある状態です') >= 0);

/* **二つの面が、同じ節を持っていること。**片方に節を足して、もう片方に
 * 足し忘れると、読む場所によって中身が変わる。 */
{
  const 節 = (t) => (t.match(/^#{2,3} (.+)$/gm) || [])
    .map((x) => x.replace(/^#+ /, '').trim());
  const 頁 = (t) => (t.match(/<h[23]>([\s\S]*?)<\/h[23]>/g) || [])
    .map((x) => x.replace(/<[^>]*>/g, '').trim());
  const a = 節(fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8'));
  const b = 頁(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'));
  /* README には、配信の面が持たない節がある —— 検査の回し方、ライセンス、
   * 開示、関連。**本文の節だけを突き合わせる。**配信の面に出ている節は、
   * すべて README にも無ければならない。逆は問わない。 */
  const 欠け節 = b.filter((x) => a.indexOf(x) < 0);
  ok('配信の面の節が、すべて README にもある', 欠け節.length === 0,
     欠け節.length ? ('README に無い: ' + 欠け節.join(' / ')) : (b.length + ' 節'));
}

/* **免責と、発展途上であることの断りを消さない。**
 * 免責が消えれば、三つ組を扱う文書が、加害の側に読める余地を残す。
 * **本稿の帰結は局面を発生させないことであり、法の軽視の反対である。**
 * 発展途上の断りが消えれば、先行研究を確認していないことが隠れる。 */
ok('法を軽視するものではないと書いてある',
   md.indexOf('本稿は法を軽視するものではありません。むしろ逆です。') >= 0
   && md.indexOf('加害の手順は書いていません') >= 0
   && md.indexOf('その要件が生じる前に離れること') >= 0
   && md.indexOf('携帯も使用も勧めていません') >= 0
   && md.indexOf('本稿は法的意見ではありません') >= 0);
/* **免責の法令の文は、取り寄せた条文に合わせた形で置く**（2026-11-12 の法令の点検）。
 * 正当防衛は刑法第36条第1項の要件（自己又は他人の権利を防衛するため）を落とさない。
 * 武器術は軽犯罪法第1条第2号の要件（正当な理由なく・隠して携帯）で書き、「扱えば法の問題」に戻さない。
 * 前の言い方は、改めた記録の「」の中にだけ残る。条文は cpsbvbng26-dotcom の verification/statutes.json にある。 */
{
  const 前 = ['正当防衛を急迫不正の侵害に対するやむを得ずにした行為に限っています', '稽古の場の外で扱えば、法の問題になります'];
  const 戻り = ['README.md', 'index.html'].filter((f) => {
    const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    return 前.some((x) => t.split(x).length !== t.split('「' + x).length);
  });
  ok('免責の法令の文が、刑法第36条第1項と軽犯罪法第1条第2号の要件で書かれ、前の言い方に戻っていない',
     md.indexOf('日本の刑法第36条第1項は、正当防衛を、急迫不正の侵害に対して、自己又は他人の権利を防衛するため、やむを得ずにした行為としています。') >= 0
     && md.indexOf('稽古の場の外で、正当な理由なく器具を隠して携帯すれば、軽犯罪法第1条第2号に当たりえます。') >= 0
     && 戻り.length === 0, 戻り.join(', '));
}
ok('発展途上であることが書いてある',
   md.indexOf('本稿は発展途上です。先行研究が見つかれば、随時加えます。') >= 0
   && md.indexOf('見つかった時点で、本稿の独自性はその分だけ減ります') >= 0);

/* **DOI は三箇所と CITATION.cff に出る。**片方だけ直せばずれる。
 * **番号そのものは Zenodo に出られないので確かめられない。**
 * 確かめられるのは、書いた番号が全部同じであることだけである。
 * あわせて、概念 DOI か版 DOI か決まっていないという断りが残っているかも見る。 */
{
  const rm = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  const cff = fs.readFileSync(path.join(ROOT, 'CITATION.cff'), 'utf8');
  const 番号 = [...new Set((rm + cff).match(/10\.5281\/zenodo\.\d+/g) || [])];
  const 自分 = 番号.filter((x) => x !== '10.5281/zenodo.22058254');
  ok('書いてある DOI が、どこでも同じ一つである', 自分.length === 1,
     自分.length ? 自分.join(' / ') : '番号が無い');
  /* 2026-11-12（百本ノック五の 414）。DataCite で版の DOI だと確かめた。確かめた結果を書いていること。 */
  ok('DOI の等級を、確かめた結果として書いてある',
     rm.indexOf('この番号は版の DOI です。2026-11-12 に DataCite の記録で確かめました。') >= 0
     && rm.indexOf('まだ確かめていません。作業環境から Zenodo') < 0);
  ok('CITATION.cff が、同じ番号と版を持っている',
     自分.length === 1 && cff.indexOf('doi: ' + 自分[0]) >= 0
     && cff.indexOf('version: v1.0.0') >= 0);
}

/* **英語版は三つ目の面である。**投稿に出す原稿なので、日本語版と食い違えば
 * 出した先と記録がずれる。**全文の対照はしない**（訳文なので語が一致しない）。
 * **要となる約束だけを当てる** —— 三つ組、帰結の向き、戦略的能力、免責、開示、
 * 位と権威の語を使っていないこと。**どれかが訳の途中で落ちたら落ちる。** */
{
  const en = fs.readFileSync(path.join(ROOT, 'preprint', 'solitary-school-en.md'), 'utf8');
  const 三つ = ['betrayal', 'deception', 'ambush'];
  const 欠け = 三つ.filter((w) => en.toLowerCase().indexOf(w) < 0);
  ok('英語版に、' + 漢[三つ.length] + 'つ組が立っている', 欠け.length === 0,
     欠け.length ? 欠け.join(' / ') : 三つ.join(' / '));
  ok('英語版の帰結が、こちらに不利な向きのままである',
     en.indexOf('It cannot be demonstrated in the training hall either.') >= 0
     && en.indexOf('the same hole is open whether one trains alone or with others') >= 0);
  ok('英語版が、戦略的能力を主張であって測定ではないと認めてある',
     en.indexOf('**strategic capability**') >= 0
     && en.indexOf('strategic capability is a claim, not a measurement') >= 0);
  ok('英語版に、免責と開示が残っている',
     en.indexOf('This paper does not take the law lightly. The opposite.') >= 0
     && en.indexOf('No procedure for causing harm is given') >= 0
     && en.indexOf('Claude is not an author.') >= 0
     && en.indexOf('The author determined the argument') >= 0);
  /* **英語でも位と権威の語を使わない。**日本語だけ締め出しても意味が無い。
   * **そして決めごと 6 が禁じている自称も、英語のほうに出やすい。** */
  const 権威en = ['grandmaster', 'soke', 'founder of', 'menkyo', 'Independent Researcher'];
  const 出たen = 権威en.filter((w) => en.toLowerCase().indexOf(w.toLowerCase()) >= 0);
  ok('英語版が、位と権威の語を使っていない', 出たen.length === 0,
     出たen.length ? 出たen.join(' / ') : (権威en.length + ' 語とも無い'));
  ok('英語版が、査読前であることと段が無いことを書いてある',
     en.indexOf('Preprint. Not peer-reviewed.') >= 0
     && en.indexOf('**Not a single dan grade is held.**') >= 0);
}

/* **種類と状態の札。**README の題のすぐ下に一行置く。目録（cpsbvbng26-dotcom）と
 * 食い違えば横断の検査が落とす。ここでは札の形と、引用情報の type を見る。 */
{
  const rm = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8').split('\n');
  const cff = fs.readFileSync(path.join(ROOT, 'CITATION.cff'), 'utf8');
  ok('README の題のすぐ下に、種類と状態の札がある',
     /^# /.test(rm[0]) && rm[1] === '' && rm[2] === '種類：エッセイ　状態：凍結',
     rm[2] || '札が無い');
  ok('CITATION.cff の type が dataset である', /^type: dataset$/m.test(cff),
     (/^type: (.*)$/m.exec(cff) || [, '無い'])[1]);
}

/* **覆し方の二番目は、第四節を覆す条件でなければならない。**
 * 2026-11-11 までは「測定できないままであることを示せば、第四節は主張のまま残る」と
 * 書いていた。これは第四節・二を確かめるだけで、何も落とさない。
 * 第四節・二は「回避できなかった一回が、測定の全部」と定めている。その一回が出れば、
 * 第四節が落ちる。**この条件が両方の面にあり、前の言い方がどちらの列挙にも無いこと。**
 * 英語版は凍結してあるので、前の言い方のまま残っていることを README に書いておく。
 * **英語版が作り直されて言い方が変われば、その断りのほうが嘘になるので落とす。** */
{
  const rmRaw = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  const hRaw = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const en = fs.readFileSync(path.join(ROOT, 'preprint', 'solitary-school-en.md'), 'utf8');
  const 新 = '裏切り・騙し討ち・不意打ちのどれかが起きる場面を、著者が避けられなかった例が一つでも示されれば、第四節（独我流にはそうした場面を起こさない力が要る、という主張）は崩れます。';
  const 旧 = '戦略的能力が測定できないままであることを示せば、第四節は主張のまま残ります。';
  ok('覆し方の二番目が、第四節を覆す条件になっている',
     md.indexOf(新) >= 0
     && rmRaw.indexOf('2. ' + 新) >= 0 && hRaw.indexOf('<li>' + 新 + '</li>') >= 0
     && rmRaw.indexOf('2. ' + 旧) < 0 && hRaw.indexOf('<li>' + 旧 + '</li>') < 0
     && md.indexOf('回避できなかった一回が、測定の全部です。') >= 0);
  ok('改めたことと、前の言い方が残っている英語版のことが書いてある',
     md.indexOf('二番目は 2026-11-11 に改めました。') >= 0
     && rmRaw.indexOf('第八節の二番目は前の言い方のまま残っています。') >= 0
     && en.indexOf('2. Show that strategic capability remains unmeasurable. Section 4 then remains a claim only.') >= 0);
}

/* **読む時間は、字数から数える。手で書かない。**update_reading_time.js と同じ関数で
 * 数え直し、二つの面の印のあいだが一致することを見る。本文を直して書き込み直すのを
 * 忘れれば落ちる。 */
{
  const rt = require('./update_reading_time.js');
  const hRaw = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const rmRaw = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  const want = rt.sentence(hRaw);
  const a = rt.between(rmRaw);
  const b = rt.between(hRaw);
  ok('読む時間の目安が、字数から数え直したものと合う',
     a === want && b === want.replace(/`([^`]+)`/g, '<code>$1</code>'),
     rt.count(hRaw) + ' 字' + (a === want ? '' : ' / README がずれている') + (b !== null && b.indexOf(String(rt.count(hRaw))) >= 0 ? '' : ' / index.html がずれている'));
}

/* **「この稿が言っていないこと」は、本文が自分で断っていることだけを集める。**
 * 各行の括弧が指す節が、実際にあること。無い節を根拠に挙げれば落ちる。 */
{
  const rmRaw = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  const 節 = (rmRaw.match(/^#{2,3} (.+)$/gm) || []).map((x) => x.replace(/^#+ /, '').trim());
  const i = rmRaw.indexOf('## この稿が言っていないこと');
  const 区 = i < 0 ? '' : rmRaw.slice(i, rmRaw.indexOf('\n## ', i + 1));
  const 行 = 区.split('\n').filter((l) => l.startsWith('- '));
  const 宛先 = (l) => (/（([^（）]+)）。$/.exec(l) || [, ''])[1];
  const 在る = (t) => {
    if (t === '冒頭') return rmRaw.indexOf('これは流派ではありません。') >= 0;
    const m = /^第(.)節(?:・(.))?$/.exec(t);
    if (m) return 節.some((h) => h.startsWith(m[2] ? m[1] + '・' + m[2] + ' ' : m[1] + ' '));
    return 節.indexOf(t) >= 0;
  };
  const 無い = 行.filter((l) => !在る(宛先(l)));
  ok('「この稿が言っていないこと」の各行が、実在する節を指している',
     行.length > 0 && 無い.length === 0 && md.indexOf('本文が自分で断っていることを、一か所に集めます。') >= 0,
     無い.length ? 無い.join(' / ') : (行.length + ' 行'));
}

/* **読んでいない典拠を隠さない。**第六節の四番目が、実際に先行研究の未確認であること。
 * 論文の側の依存（E6）を指していること。 */
ok('読んでいない典拠が、第六節と論文の正誤表に結ばれている',
   md.indexOf('先行研究を確認していない。同じ構造を先に扱った武道論や現象学があるはずだが、当たっていない') >= 0
   && md.indexOf('同じ構造を先に扱った武道論や現象学に、当たっていません（第六節の四番目）。') >= 0
   && md.indexOf('の E6 と、同じリポジトリの README の「三篇の骨格」にあります。') >= 0);

/* **外部の反応は、外部評価の記録から写す。**記録の所在へのリンクが両方の面にあること。
 * 兄弟ディレクトリに cpsbvbng26-dotcom があれば（ECOSYSTEM_ROOT でも指せる）、
 * 記録の二つの表に本稿の行が本当に無いかを見る。無ければ形だけを見る。 */
{
  const SRC = 'https://github.com/cpsbvbng26-dotcom/cpsbvbng26-dotcom/blob/main/docs/external-evaluations.md';
  const rmRaw = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  const hRaw = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const eco = process.env.ECOSYSTEM_ROOT || path.resolve(ROOT, '..');
  const f = path.join(eco, 'cpsbvbng26-dotcom', 'docs', 'external-evaluations.md');
  let 行 = null;
  if (fs.existsSync(f)) {
    const t = fs.readFileSync(f, 'utf8');
    行 = [];
    for (const h of ['## 受けた評価', '## 出した先']) {
      const i = t.indexOf(h);
      if (i < 0) continue;
      const ls = t.slice(i).split('\n');
      let k = ls.findIndex((l) => l.startsWith('|'));
      for (; k >= 0 && k < ls.length && ls[k].startsWith('|'); k++) 行.push(ls[k]);
    }
    行 = 行.filter((l) => /自己実験としての名乗り|独我流|solitary-school/.test(l));
  }
  ok('外部の反応が、外部評価の記録と合う',
     rmRaw.indexOf('](' + SRC + ')') >= 0 && hRaw.indexOf('href="' + SRC + '"') >= 0
     && md.indexOf('その記録の「受けた評価」と「出した先」の表に、本稿を対象にした行はありません。') >= 0
     && (行 === null || 行.length === 0),
     行 === null ? '兄弟に記録が無いので、所在と文だけを見た' : '記録の行 ' + 行.length);
}

/* **散文に数を書いたら、その数を機械で確かめられるようにする**（決めごと 5）。
 * README と CI の仕事の名前と CONTRIBUTING.md が、実際の項目数を名乗っている。
 * CONTRIBUTING.md は一度、23 項目のまま取り残されていた。
 * **いまの pass に、この項目自身を足したものが総数である。** */
{
  const total = pass + 1;
  const rm = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  const yml = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'verify.yml'), 'utf8');
  const ずれ = [];
  if (rm.indexOf(total + ' 項目あります。') < 0) ずれ.push('README.md');
  if (yml.indexOf('食い違わないか ' + total + ' 項目') < 0) ずれ.push('verify.yml');
  const co = fs.readFileSync(path.join(ROOT, 'CONTRIBUTING.md'), 'utf8');
  if (co.indexOf('# ' + total + ' 項目') < 0) ずれ.push('CONTRIBUTING.md');
  ok('名乗っている項目数が、実際と合う', ずれ.length === 0,
     ずれ.length ? ('実際 ' + total + ' / ずれ: ' + ずれ.join(' / ')) : (total + ' 項目'));
}

console.log('\n' + '-'.repeat(50));
if (failures.length) {
  console.log(pass + ' 件が通り、' + failures.length + ' 件が通りませんでした。');
  failures.forEach((f) => console.log('  - ' + f));
  process.exit(1);
}
console.log(pass + ' 件すべて通りました。');

# 手を入れるときに

Issue も pull request も歓迎する。登録は要らない。

## ここに何があるか

公開ノートが一本ある。査読を受けていない。論文でもない。
`README.md` と `index.html` が同じ本文を持ち、`verification/check_text.js` が
両者のずれを見ている。

## いちばん知らせてほしいもの

先行研究である。本文は「同じ構造を先に扱った武道論や現象学があるはずだが、
当たっていない」と自分で書いている。見つけたら教えてほしい。

<https://github.com/cpsbvbng26-dotcom/solitary-school/issues> に立てる。
書誌を添えてほしい。見つかった時点で、本稿の独自性はその分だけ減る。
減ったことも書く。

次に知らせてほしいのは、**覆し方の節に挙げた四つ**のいずれかを実際に満たす指摘である。

## 片方だけ直さない

本文は二つある。`README.md`（GitHub の面）と `index.html`（配信の面）。
片方だけ直せば、検査が落ちる。記法を落として同じ地の文にしてから、
全項目を両方に当てている。

## 変更を出す

```
node verification/check_text.js    # 38 項目
```

通ってから出す。依存パッケージは要らない。

## 位と権威の語を入れない

これは流派ではない。宗家・流祖・師範・創始者・免許皆伝・段位の六語は、
検査が締め出している。一語でも入れば落ちる。

他人の来歴も、名乗りの支えに使わない。先行例として特定の人名や団体名を挙げる
変更は受けられない。挙げれば、その人の来歴がこちらの裏付けに見える。

## 帰結の向きを反転させない

本稿の結論は、**こちらに不利な向き**を向いている。「一人でも仕上がる」を支えてはいない。
支える形に書き換える変更は、検査が止める。

## 通らない変更

- **位と権威の語を入れること**
- **他人の来歴を支えに使うこと**
- **帰結の向きを反転させること**
- **査読を受けていないという断り、言語モデル利用の開示、免責を消すこと**
- **検査の期待値を、通すために変えること**

## 支えの範囲と、これからの見込み

- **維持しているのは著者一人である**（根本卓哉）。組織の後ろ盾は無い
- issue への返答は**数日から一週間**を目安とする。約束ではない
- 範囲。この一本のノートに限る。稽古の指導、技法の解説、他流の評価は範囲の外である
- 発展途上である。先行研究が見つかれば随時加える

## ライセンス

[CC BY 4.0](LICENSE)。手を入れたぶんも同じ条件で扱われる。

## 突き合わせの受付 / Checked intake

2026-12-01 から、誤りの知らせ（`error-report.yml`）は「突き合わせの受付」で確かめる。
人が嘘をつくこと一般は、仕組みでは止められない。受けるのは、申し立てた人がその場で書けない出どころと突き合わせられる申し立てだけで、通らないものと確かめられないものは自動で退ける。
確かめるのは一つだけである。「書いてあること」の語が、「どこか」の欄に書いた所（このリポジトリのファイル、配っている頁、このリポジトリが写しを持つ DOI の PDF か翻刻）に、そのとおりにあること。空白の違いと文字の幅は見ない。頁や節は確かめず、文書の全体を探す。
あればラベル「quote verified」を付ける。それが誤りかどうかは、人が読んで決める。なければ、ラベル「not verified」と決まった文のコメントを付け、その申し立ては受け付けない。本文を直すか、新しい issue で出し直せば、もう一度確かめる。
突き合わせの受付は、どの issue も閉じず、鍵も掛けない。どの issue も人が読む。言葉の並びでは、法令が受けて扱うことを求める求め（削除・権利・個人の情報・人についての記述・同意の撤回。どの言語でも）を、誤りの知らせと見分けきれないためである（2026-11-15）。
そう読める語を含む issue には、ラベル「needs a person」も付ける。人への目印で、これに頼って何かを決めることはない。
持ち主が開き直したり直したりしたときは、何もしない。
コメントと実行の記録は、決まった語と issue の番号だけを書き、issue に書かれたことを写さない。
道具は `.github/checked-intake/verify.js`、確かめる先は `.github/checked-intake/config.json` にある。

From 2026-12-01, error reports (`error-report.yml`) are checked by the checked intake.
No system can stop a person from lying in general. Only claims that can be checked against a source that the claimant does not write at the moment of claiming are accepted; a claim that fails, or cannot be checked, is turned away automatically.
One thing is checked: that the words under "What it says" occur, as written, at the location under "Where" (a file of this repository, a page that it serves, or the PDF or transcription of a DOI of which it holds a copy). Differences of white space and character width are ignored. The page or section is not checked; the whole document is searched.
If they occur, the label "quote verified" is added, and whether it is an error is decided by a person. If they do not, the label "not verified" and a fixed comment are added, and the claim is not accepted; editing the issue, or opening a new one, runs the check again.
The checked intake never closes or locks an issue; a person reads every one. No list of words can tell every request that the law requires the operator to receive (removal, rights, personal data, statements about a person, the withdrawal of a consent, in any language) from an error report (2026-11-15).
An issue with words that read as such a request also gets the label "needs a person": a signal for the person, never relied on.
When the owner of the repository reopens or edits an issue, nothing is done.
Comments and logs carry only fixed words and the issue number, never what the issue says.
The script is `.github/checked-intake/verify.js`; what it checks against is in `.github/checked-intake/config.json`.

# 法令の点検（2026-11-12）

この頁は、2026-11-12 に Claude が行った法令の点検のうち、solitary-school の分の記録です。
対象は、README と index.html の「免責」の節の法令の記載、ライセンスの記載、依拠している経験の節です。
10 のリポジトリに掛かる免責事項の点検と、条文の取り寄せ方は、cpsbvbng26-dotcom の[点検の記録](https://github.com/cpsbvbng26-dotcom/cpsbvbng26-dotcom/blob/main/docs/legal-audit-2026-11-12.md)にあります。
この頁は運営者の立場を記録するもので、読む人への法的な助言ではありません。

## やり方

法令が出てくる箇所を一つずつ挙げ、挙げた条の文を、取り寄せた条文と照らしました。
条文は記憶から書いていません。
Sophaxis の取り寄せの仕事を走らせて e-Gov から取り寄せ、cpsbvbng26-dotcom の [verification/statutes.json](https://github.com/cpsbvbng26-dotcom/cpsbvbng26-dotcom/blob/main/verification/statutes.json) に写しました。
この頁が挙げる条がどれもその表にあることは、cpsbvbng26-dotcom の `check_ecosystem.js` が確かめます。
判定は、誤り・根拠不足・漏れ・表現・問題なしの五つです。

## 点検の表

| 箇所 | 法令と条 | 要件 | 事実 | 判定 | 対応 |
| --- | --- | --- | --- | --- | --- |
| README と index.html の正当防衛の一文 | 刑法第36条 | 急迫不正の侵害に対して、自己又は他人の権利を防衛するため、やむを得ずにした行為は、罰しない | 「正当防衛を急迫不正の侵害に対するやむを得ずにした行為に限っています」と書き、「自己又は他人の権利を防衛するため」を落としていた。条も挙げていなかった | 表現 | 「日本の刑法第36条第1項は、正当防衛を、急迫不正の侵害に対して、自己又は他人の権利を防衛するため、やむを得ずにした行為としています。」に直した |
| README と index.html の武器術の一文 | 軽犯罪法第1条、銃砲刀剣類所持等取締法第22条 | 正当な理由がなくて、人の生命を害し又は身体に重大な害を加えるのに使われるような器具を隠して携帯した者（軽犯罪法第1条第2号）。業務その他正当な理由による場合を除き、刃体の長さが六センチメートルをこえる刃物を携帯してはならない | 「稽古の場の外で扱えば、法の問題になります」と書いていた。扱うだけで罪になるという条は無く、軽犯罪法は正当な理由が無く隠して携帯することを要件にする。稽古の武器は刃物ではない | 表現 | 「稽古の場の外で、正当な理由なく器具を隠して携帯すれば、軽犯罪法第1条第2号に当たりえます。」に直した。改めたことと前の言い方を同じ節に書いた。`check_text.js` に検査を足した |
| 英語版のプレプリント（凍結した PDF） | 刑法第36条、軽犯罪法第1条 | 同上 | 英語版は前の言い方のまま残る | 表現 | 凍結した紙面は変えない。2026-11-12 に Claude が決めました。事実の誤りではなく言い方の問題なので、self-correction の登録簿には足さず、README と index.html に改めた記録を置きます |
| README「ライセンス」、LICENSE、LICENSE-CODE、CITATION.cff、.zenodo.json | 著作権法第21条、著作権法第23条 | 複製と公衆送信は著作者の権利で、他人に許す範囲は許す者の表示で決まる | LICENSE が CC BY 4.0、LICENSE-CODE が MIT。CITATION.cff と .zenodo.json は CC BY 4.0 | 問題なし | なし |
| README の「出典を示せば」 | 著作権法第21条、CC BY 4.0 の第 3 節 | 第 3 節は、著作者の表示・著作権の表示・ライセンスへの言及・保証の否認への言及・URI・改変したかどうかの表示を求める | 「出典を示せば」は第 3 節の一部しか言っていなかった | 表現 | 「CC BY 4.0 の第 3 節が求める表示（著作者の名、ライセンスへのリンク、改変したかどうかなど）を添えれば」に直した |
| 依拠している経験の節の相手 | 個人情報保護法第2条、刑法第230条 | 特定の個人を識別できる情報。名誉の毀損 | 相手は「有段者」「元ボクサー」「県大会級の相手」とだけ書き、特定の個人を識別できない | 問題なし | なし |

## 2026-11-12 の続き：リスクを締めた

同じ日に、利用者が「法的リスクをさらにシメて」と求めました。
上の表で根拠不足としたところと、取り寄せた文だけでは読みが決まらないところを、厳しいほうの読みで見直しました。
厳しいほうの読みでも成り立つ形があり、費用が掛からないときは、その形を採りました。
決めたことは、行ごとに理由と一緒に書きます。
取り寄せられなかった文に頼るところは、この節では扱っていません。

| 箇所 | 法令と条 | 要件 | 事実 | 判定 | 対応 |
| --- | --- | --- | --- | --- | --- |
| README と index.html の稽古の経験の表の流派の名 | 商標法第25条、商標法第26条 | 登録商標の使用は、指定商品又は指定役務について権利者が専有する | 自分が数日稽古した事実を述べる表に、流派の名として出る。この頁は何も売らず、教えない。名を商品や役務の表示として使っていない | 問題なし | なし |
| 依拠している経験の節の相手 | 個人情報保護法第2条、刑法第230条 | 特定の個人を識別できる情報。名誉の毀損 | 相手は「有段者」「元ボクサー」「県大会級の相手」とだけ書く | 問題なし | なし |
| README の責任の一文 | 民法第709条 | 故意又は過失で他人の権利又は法律上保護される利益を侵害した者は、生じた損害を賠償する | 「責任の範囲は、免責事項に定めています」と書いていた。免責事項は契約ではなく、責任の範囲は法令が決める。今日、免責事項は責任を免除する文をやめた | 表現 | 「責任は、法令の定めるとおりです。説明は免責事項にあります。」に直した。10 のリポジトリで同じ一文にそろえ、cpsbvbng26-dotcom の `check_ecosystem.js` が一字一句を見る。2026-11-12 に Claude が決めました。免責事項が範囲を決めると読める言い方は、どちらの読みでも成り立たないからです |

## 2026-11-12 の続き：取り寄せた周辺の文

上の表で取り寄せられなかった文のうち、同じ日に Sophaxis の取り寄せの仕事が取り寄せたものがあります。
置き場は Sophaxis の main（コミット 6b40d77、PR #218）の `verification/sources-raw.json` です。
取り寄せた文で、上の結論を一つずつ確かめ直しました。
条の文は cpsbvbng26-dotcom の `verification/statutes.json` に写し、`check_ecosystem.js` が Sophaxis の文と一字一句を突き合わせます。
規約は著作物なので、頼った句だけをこの表に引きます。

| 箇所 | 法令と条 | 要件 | 事実 | 判定 | 対応 |
| --- | --- | --- | --- | --- | --- |
| README と index.html の武器術の一文 | 銃砲刀剣類所持等取締法第22条、銃砲刀剣類所持等取締法施行令第43条、銃砲刀剣類所持等取締法施行規則第101条 | 刃体の長さが六センチメートルを超える刃物の携帯の禁止。銃砲刀剣類所持等取締法施行規則第101条は、刃体の長さを、切先と、柄部の切先に最も近い点を結ぶ直線で計ると定める。銃砲刀剣類所持等取締法施行令第43条は、携帯の禁止から外れる、はさみと折畳み式のナイフなどの形を定める | 稽古の武器は刃物ではなく、この頁は刃物の携帯に触れていない。頁が挙げるのは軽犯罪法第1条第2号だけ | 問題なし | 上の結論を保つ。測り方と除かれる刃物は、頁の一文に関わらないことを確かめた |

## 2026-11-12 の続き：二度目の見落とし

同じ日に、読むだけの点検を、さらに別の手でもう一度行いました。
上の節が見落としていたものが見つかりました。
前の行は、そのとき何を確かめたかの記録なので、消していません。
法令の文は、cpsbvbng26-dotcom の `verification/statutes.json` に写した取り寄せた文から引きます。
10 のリポジトリに同じものを置く文書の点検は、[cpsbvbng26-dotcom の記録](https://github.com/cpsbvbng26-dotcom/cpsbvbng26-dotcom/blob/main/docs/legal-audit-2026-11-12.md)の同じ見出しの節にもあります。

| 箇所 | 法令と条 | 要件 | 事実 | 判定 | 対応 |
| --- | --- | --- | --- | --- | --- |
| SECURITY.md | 民法第709条 | 取り寄せた文は「故意又は過失によって他人の権利又は法律上保護される利益を侵害した者は、これによって生じた損害を賠償する責任を負う」と定める。無い窓口を約して、頼った人に損を生じさせないこと | SECURITY.md は、安全の問題を GitHub の非公開の報告で受けると約していた。GitHub の API は、2026-11-12 に、このリポジトリの非公開の報告を `enabled: false` と返した。これはリポジトリの設定であり、Claude の持つ道具では変えられない | 誤り | 運営者の ORCID の記録にあるメールアドレスで受けると書き直し、GitHub の非公開の報告は有効になっていないと、確かめた日と一緒に書いた。写しは 10 のリポジトリと deposit-check で一字一句同じで、cpsbvbng26-dotcom の `check_ecosystem.js` の 12j が中身を確かめる。2026-11-12 に Claude が決めました。在る窓口は、免責事項がすでに使っている一つだけだからです |

## 2026-11-12 の続き：四度目の見落とし

同じ日に、読むだけの点検を、四度目に別の手で行いました。
上の節が見落としていたものが見つかりました。
前の行は、そのとき何を確かめたかの記録なので、消していません。
誤っていた前の行は、新しい行の中でそう書き、理由を添えます。
法令の文は、cpsbvbng26-dotcom の `verification/statutes.json` に写した取り寄せた文から引きます。
10 のリポジトリと deposit-check に同じ形で置く文の点検は、[cpsbvbng26-dotcom の記録](https://github.com/cpsbvbng26-dotcom/cpsbvbng26-dotcom/blob/main/docs/legal-audit-2026-11-12.md)の同じ見出しの節にもあります。

| 箇所 | 法令と条 | 要件 | 事実 | 判定 | 対応 |
| --- | --- | --- | --- | --- | --- |
| README「ライセンス」 | 著作権法第21条 | 取り寄せた文は「著作者は、その著作物を複製する権利を専有する。」と定める（cpsbvbng26-dotcom の `verification/statutes.json`、SHA-256 `a85d04f2fd20d7867d5579bee40676b13405c58ea7fd7eb27f1e7a5a03bda100`）。許せるのは、許す者が権利を持つものだけである。ライセンスの文が、他人の文まで許すと読めないこと | README のライセンスの節は、文書の CC BY 4.0 とコードの MIT だけを書き、引いた他人の文の扱いを書いていなかった。Sophaxis は、最初の見落としの節で同じ一文を足していたが、10 のリポジトリと deposit-check には届いていなかった。上の点検の表の「README「ライセンス」、LICENSE、LICENSE-CODE、CITATION.cff、.zenodo.json」の行は問題なしとしていたが、他人の文の扱いを見ていなかった | 漏れ | README のライセンスの節に「このリポジトリが引き、または引用を確かめるために置いている他人の文は、CC BY 4.0 でも MIT でも許諾しておらず、それぞれの権利者のものです。」を足した。`check_ecosystem.js` の 12l が、10 のリポジトリと deposit-check の README（英語の README を含む）にこの一文があることを見る。2026-11-12 に Claude が決めました。Sophaxis の README と同じ範囲を、同じ形で書くためです |
| CITATION.cff の message と .zenodo.json の notes | 著作権法第21条 | 同上。引用情報の license の欄は、どの部分に掛かるかを書けないので、その範囲を別の欄で書くこと | CITATION.cff と .zenodo.json の license の欄は CC BY 4.0 で、notes は本文が CC BY 4.0 とだけ書き、LICENSE-CODE の MIT を書いていなかった。上の点検の表の「README「ライセンス」、LICENSE、LICENSE-CODE、CITATION.cff、.zenodo.json」の行は問題なしとしていたが、欄の掛かる範囲と他人の文を見ていなかった | 表現 | message と notes に、本文が CC BY 4.0、検査のスクリプトが MIT で、license の欄は本文だけに掛かることを書いた。他人の文は許諾していないとも、和英で書いた。`check_ecosystem.js` の 12l が、二つのファイルにこの文があり、置き方が目録の licenceLayout と同じことを見る。2026-11-12 に Claude が決めました。Sophaxis の CITATION.cff が三度目の見落としの節で書いた範囲の文に、10 のリポジトリと deposit-check を揃えるためです |

## 2026-11-12 の続き：八度目の見落とし

読むだけの点検を、八度目に別の手で行いました。
上の節が見落としていたものが見つかりました。
直した日は、日本時間で 2026-11-13 です。
前の行は、そのとき何を確かめたかの記録なので、消していません。
GitHub の利用規約の I 節は「Some Service features may be subject to additional terms specific to that feature or product as set forth in the GitHub Additional Product Terms.」と書きます。
その追加の規約（GitHub Terms for Additional Products and Features）を、これまでの点検は取り寄せていませんでした。
追加の規約は、`github/site-policy` のコミット `166eb97e485b7de3cd5dbaf8c8d16e4310fda46c` の文を、2026-11-13 に raw.githubusercontent.com から直に取り寄せました。
ファイルの SHA-256 は `c39b5a7fc1953ebd37428db18101726acefb55420f766bcd7d912e1b71ee2ffc` です。
Actions の節は「Additionally, regardless of whether an Action is using self-hosted runners, Actions should not be used for:」と書き、次の二つを挙げます。
一つは「Any activity that places a burden on our servers, where that burden is disproportionate to the benefits provided to users (for example, don't use Actions as a content delivery network or as part of a serverless application, but a low benefit Action could be ok if it’s also low burden); or」です。
もう一つは「If using GitHub-hosted runners, any other activity unrelated to the production, testing, deployment, or publication of the software project associated with the repository where GitHub Actions are used.」です。
同じ節は「Misuse of GitHub Actions may result in termination of jobs, restrictions in your ability to use GitHub Actions, disabling of repositories created to run Actions in a way that violates these Terms, or in some cases, suspension or termination of your GitHub account.」とも書きます。
このリポジトリのワークフローは、どれも GitHub の実行環境（`ubuntu-latest` か `ubuntu-24.04`）で動きます。
そこで、ワークフローを一つずつ、四つの目的（制作・検査・配備・公開）のどれに当たるか、負荷が益に見合うかで読みました。
ワークフローの行は、箇所の欄を `.github/workflows/` のファイルの名で始めます。
実行の時間は、GitHub の API で 2026-11-13 に読んだ直近の実行（多くて 300 件）の中央値です。
GitHub Pages が枝から頁を配るときに GitHub が動かす仕事と、Dependabot の版の更新は、このリポジトリのファイルではないので、表に挙げていません。
引いた文は、cpsbvbng26-dotcom の `verification/statutes.json` の「GitHub の利用規約 I」と「GitHub の追加製品の規約 Actions」に写しました。
同じ点検は、13 のリポジトリの記録の同じ見出しの節にあります。

| 箇所 | 法令と条 | 要件 | 事実 | 判定 | 対応 |
| --- | --- | --- | --- | --- | --- |
| GitHub の追加製品の規約（Actions の節） | GitHub の利用規約 I、GitHub の追加製品の規約 Actions | 使っているサービスの規約を取り寄せて読むこと | 利用規約の I 節は追加の規約を取り込みますが、これまでの点検は追加の規約を読んでいませんでした | 漏れ | 取り寄せ、Actions の節の文を cpsbvbng26-dotcom の `verification/statutes.json` に写しました。Sophaxis の週ごとの見張りにも足しました。2026-11-13 に Claude が決めました。ワークフローの使い方を決める文なので、ほかの規約と同じに読むためです |
| `.github/workflows/hygiene.yml`（main への push・PR、毎週水曜の 13:25、手で起こすとき） | GitHub の追加製品の規約 Actions | GitHub の実行環境で、リポジトリのソフトウェアのプロジェクトの制作・検査・配備・公開のどれかに当たること。負荷が利用者への益に見合うこと | 依存・権限・固定・秘密の走査（`verification/check_hygiene.py`）を回します。週に一度の実行は、変更の無い日にも混入を見るためです。実行の中央値は 9 秒です | 問題なし | 変えていません。検査に当たり、負荷は週に一度の数秒です |
| `.github/workflows/verify.yml`（main への push・PR、手で起こすとき） | GitHub の追加製品の規約 Actions | GitHub の実行環境で、リポジトリのソフトウェアのプロジェクトの制作・検査・配備・公開のどれかに当たること。負荷が利用者への益に見合うこと | このリポジトリの検査を回します（散文）。実行の中央値は 9 秒です | 問題なし | 変えていません。検査に当たります |
| 検査（`verification/check_hygiene.py`） | なし | ワークフローごとの判断を、機械で固めること | ありませんでした | 漏れ | `verification/check_hygiene.py` に 7 番を足し、`.github/workflows/` のどのファイルもこの節の表に行を持ち、無いファイルの行が無いことを確かめます。cpsbvbng26-dotcom の `check_ecosystem.js` の 12o も、13 のリポジトリについて同じことを確かめます。2026-11-13 に Claude が決めました。新しいワークフローを、規約に照らさずに足せないようにするためです |

この表の判定は、漏れ 2、問題なし 2 です。

弁護士は、この節を見ていません。

## 調べた法令

- GitHub の利用規約（I 節）と GitHub の追加製品の規約（Actions の節。2026-11-13 に `github/site-policy` から直に取り寄せた）
- 刑法（第36条、第230条）
- 軽犯罪法（第1条）
- 銃砲刀剣類所持等取締法（第2条、第22条）
- 著作権法（第21条、第23条）
- 個人情報保護法（第2条）
- 商標法（第25条、第26条）
- 民法（第709条）
- CC BY 4.0 の法的条項（第 3 節）
- 銃砲刀剣類所持等取締法施行令（第43条）、銃砲刀剣類所持等取締法施行規則（第101条）

## 取り寄せられなかった文

- この記録が頼る文で、取り寄せられなかったものは残っていません。

## 弁護士について

この点検は Claude が行いました。
弁護士は、この点検を見ていません。

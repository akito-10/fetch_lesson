// 通信時は主にGET、POST、PUT、DELETEなどがある。
// GETは取得、POSTは取得・作成、PUTは更新、DELETEは削除をするためのもの。
// じゃあGETとPOSTってどっちも取得できるから作成とかもできるPOST使っときゃ万能じゃない？
// と思うかもしれない。が、違う。詳しくは下記参照。
// 記事内で冪等（べきとう）という言葉が出てくるがPOSTなどを何回も使用しても返ってくる値が変わるかどうかということ。
// GETの場合は一生取得する値が同じ（nameを取得したい！→GET→何回やってもname="akt"が返ってくる）ので冪等である。
// → https://qiita.com/kanataxa/items/522efb74421255f0e0a1
// 以下の例ではGET（取得）とPUT（更新）を使用している。

// 以下の書き方は即時関数というもの。
// async/awaitとは、非同期通信と呼ばれるものでAPI通信で生まれる時間差で値が上手く入らないようなことが起こらないようにするもの。
(async () => {
  // fetch(url)でurl先のAPIと通信できる。resと書いているところはAPIの結果（ここではDBからGETした値）
  const res = await fetch('http://localhost:8000/practice')
  // resはまだ使えない形であり、json()を使うことで使える状態に変えることができる。
  const result = await res.json()
  // APIの結果からisCancelを取得。返ってきた値には様々な形があるのでconsole.logなどで見てみるといいかも。
  let isCancel = result[0].isCancel

  const output = document.getElementById('output')
  output.textContent = isCancel ? "中止" : "決行"

  // headersとは、どのような通信を行っているかという内訳。
  const headers = new Headers();
  // 以下はjsonという形でデータを送る通信するよということ。
  headers.set("Content-Type", "application/json");

  document.getElementById('put-btn').addEventListener('click', async () => {
    // fetch(url, {各種情報})
    // methodは何も書かなかったらGETになる。今はPUTしたいのでPUTと書く。
    // headersは先ほど設定したheaders。
    // bodyのJSON.stringify({送りたい情報})は送りたい情報をheadersで設定したjsonに変えて送るという意味。
    // mode:corsはクロスオリジン（これは調べて）の通信をするよってこと。
    await fetch(`http://localhost:8000/practice/${result[0]._id}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        isCancel: !isCancel
      }),
      mode: "cors"
      // thenとは通信が成功したときの処理。
      // catchとは通信が失敗したときの処理。
    }).then((res) => {
      // res.statusとは、成功した時に返ってくる番号でこれも調べて欲しい。
      console.log(res.status, 'OK')
      isCancel = !isCancel
      output.textContent = isCancel ? "中止" : "決行"
    }).catch((err) => {
      console.log(err)
    })
  })
})()

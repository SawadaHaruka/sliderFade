const init = () => {
  const img_num = 5,//画像の枚数
    img_index = img_num - 1,//ステート用に直す
    red = "#c50022", glay = "#bbb";
  let state = 0; //現在表示されている画像
  let images = [], circles = [], btns = [], g_btns = [], strokes = [];

  //画像取得
  for (let i = 1; i <= img_num; i++) {
    let img = document.getElementById("img" + i);
    images.push(img);
    img.style.opacity = 0;
    images[state].style.opacity = 1;
  }
  //戻る・進むボタン
  {
    const btnLeft = document.getElementById('svg_btnL'), //左：戻るボタン
      btnRight = document.getElementById('svg_btnR'), //右：進むボタン
      g_btnL = document.getElementById('g_btnL'),
      g_btnR = document.getElementById('g_btnR');
    btns.push(btnLeft, btnRight);
    g_btns.push(g_btnL, g_btnR);
    for (let k = 0; k < 2; k++) {
      btns[k].style.fill = "#fff";
      g_btns[k].style.cursor = "pointer";
      g_btns[k].addEventListener('click', () => {
        if (g_btns[k] == g_btns[0]) { //左：戻るボタン
          if (state == 0) {
            state = img_index;
          } else {
            state -= 1;
          }
        } else { //右：進むボタン
          if (state == img_index) {
            state = 0;
          } else {
            state += 1;
          }
        }
        changeImg();
      });
    }
    let hover = (target) => {
      let target_btn = () => {
        if (target === g_btnL) {
          return btns[0]; //左：ポリゴン
        } else {
          return btns[1]; //右：ポリゴン
        }
      }
      target.addEventListener('mouseover', () => {
        let z = () => {
          if (target === g_btnL) {
            return "20 50, 75 20, 75 50, 75 80"; //左：戻るボタン
          } else {
            return "80 50, 25 20, 25 50, 25 80"; //右：進むボタン
          }
        }
        anime({
          targets: target_btn(),
          points: z(),
          duration: 800,
          easing: 'easeOutQuart'
        });

      });
      target.addEventListener('mouseout', () => {
        let zz = () => {
          if (target === g_btnL) {
            return "20 50, 80 20, 60 50, 80 80"; //左：戻るボタン
          } else {
            return "80 50, 20 25, 40 50, 20 80"; //右：進むボタン
          }
        }
        anime({
          targets: target_btn(),
          points: zz(),
          duration: 800,
          easing: 'easeOutQuart'
        });
      });
    }
    hover(g_btnL);
    hover(g_btnR);
  }
  //インジケータ配置
  {
    const svg = document.getElementById('svg_dots'),
      NS = "http://www.w3.org/2000/svg";
    for (let j = 0; j < img_num; j++) {
      let en_width = 20;//svg空間の幅100に対しての大きさ
      let circle = document.createElementNS(NS, 'circle');//円を生成
      circle.setAttribute('cx', 1);
      circle.setAttribute('cy', j * 140 - 240);
      circle.setAttribute('r', en_width);
      svg.appendChild(circle);
      circle.style.fill = glay;
      circle.style.cursor = "pointer";
      circles.push(circle);
      circle.addEventListener('click', () => {
        state = circles.indexOf(circle, 0);//クリックした円をステートにする
        changeImg();
      });
      circle.addEventListener('mouseover', () => {
        circle.style.fill = red;
      });
      circle.addEventListener('mouseout', () => {
        circle.style.fill = glay;
        if (circle == circles[state]) {
          circle.style.fill = red;
        }
      });

      let stroke_c = document.createElementNS(NS, 'circle');//線を生成
      stroke_c.setAttribute('cx', 1);
      stroke_c.setAttribute('cy', j * 140 - 240);
      stroke_c.setAttribute('r', en_width * 1.8);
      stroke_c.setAttribute('stroke-width', 8);
      stroke_c.style.fill = 'none';
      svg.appendChild(stroke_c);
      strokes.push(stroke_c);
      // console.log(en_width * 1.8 * 2 * Math.PI);
    }
  }

  //ステートによって画像とインジケータの色が変わる
  const changeImg = () => {
    //全部取得して変更
    for (let l = 0; l < img_num; l++) {
      images[l].style.opacity = 0;
      circles[l].style.fill = glay;
      strokes[l].style.stroke = "transparent";
      strokes[l].style.strokeDasharray = "0 226.194";
    }
    //ステートのみ上書き
    images[state].style.opacity = 1;
    circles[state].style.fill = red;
    strokes[state].style.stroke = red;
    anime({
      targets: [strokes[state]],
      strokeDasharray: "226.194 226.194",
      duration: 5000,
      easing: 'linear'
    });
    clearInterval(autoChange);//一回タイマーを止めて
    autoChange = setInterval(count, 5500);//一秒目からスタート
  }
  //自動で切り替え
  const count = () => {
    if (state >= img_index) {
      state = 0;
    } else {
      state += 1;
    }
    changeImg();
  }
  let autoChange;
  changeImg(); //読み込み時に実行
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      changeImg();//ページが表示された時に止まってたところから動き出す
    }
    if (document.visibilityState === 'hidden') {
      clearInterval(autoChange);//ページから外れている時はタイマーを止めておく
    }
  });
}
init();
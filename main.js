const img_num = 5,//画像の枚数
  img_index = img_num - 1;//ステート用に直す

const init = () => {
  let state = 0;//現在表示されている画像
  let images = [], circles = [], btns = [], strokes = [];

  //画像とボタン設置
  {
    //画像取得
    for (let i = 1; i <= img_num; i++) {
      let img = document.getElementById("img" + i);
      images.push(img);
      img.style.opacity = 0;
      images[state].style.opacity = 1;
    }

    //svgエリア
    const svg = document.getElementById('svg_stage'),
      NS = svg.getAttribute('xmlns');

    //インジケータ配置
    for (let j = 0; j < img_num; j++) {
      let en_width = 0.5;//svg空間の幅100に対しての大きさ
      let circle = document.createElementNS(NS, 'circle');//円を生成
      circle.setAttribute('cx', j * 3 + 50 - (en_width * img_index / 2 + en_width / 2 + 2 * img_index / 2)); //真ん中に配置したい
      circle.setAttribute('cy', 1);
      circle.setAttribute('r', en_width);
      svg.appendChild(circle);
      circle.style.fill = "#bbb";
      circle.style.cursor = "pointer";
      circles.push(circle);
      circle.addEventListener('click', () => {
        let number = circles.indexOf(circle, 0); //クリックした円を取得
        state = number;//クリックしたn番目をステートにする
        changeImg();
      });
      circle.addEventListener('mouseover', () => {
        circle.style.fill = "#c50022";
      });
      circle.addEventListener('mouseout', () => {
        circle.style.fill = "#bbb";
        if (circle == circles[state]) {
          circle.style.fill = "#c50022";
        }
      });

      let stroke_c = document.createElementNS(NS, 'circle');//円を生成
      stroke_c.setAttribute('cx', j * 3 + 50 - (en_width * img_index / 2 + en_width / 2 + 2 * img_index / 2)); //真ん中に配置したい
      stroke_c.setAttribute('cy', 1);
      stroke_c.setAttribute('r', en_width * 1.8);
      stroke_c.setAttribute('stroke-width', '0.2');
      stroke_c.style.fill = 'none';
      svg.appendChild(stroke_c);
      strokes.push(stroke_c);
      // console.log(en_width * 1.8 * 2 * Math.PI);
    }

    //戻る・進むボタン
    {
      let btnLeft_points = "33.27 1, 35 0, 34.4 1, 35 2 ",
        btnRight_points = "66.73 1, 65 0,65.6 1, 65 2";
      let btnLeft = document.createElementNS(NS, 'polygon');//左：戻るボタン
      btnLeft.setAttribute('points', btnLeft_points);
      svg.appendChild(btnLeft);
      let btnRight = document.createElementNS(NS, 'polygon');//右：進むボタン
      btnRight.setAttribute('points', btnRight_points);
      svg.appendChild(btnRight);
      btns.push(btnLeft, btnRight);
      for (let k = 0; k < 2; k++) {
        btns[k].style.fill = "#c50022";
        btns[k].style.cursor = "pointer";
        btns[k].addEventListener('click', () => {
          if (btns[k] == btns[0]) {
            if (state == 0) {
              state = img_index;
            } else {
              state -= 1;
            }
          } else {
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
        target.addEventListener('mouseover', () => {
          let z = () => {
            if (target == btns[0]) {
              return "32.27 1, 35 0,34.4 1, 35 2"; //左：戻るボタン
            } else {
              return "67.73 1, 65 0,65.6 1, 65 2"; //右：進むボタン
            }
          }
          anime({
            targets: [target],
            points: z(),
            duration: 800,
            easing: 'easeOutQuart'
          });
        });
        target.addEventListener('mouseout', () => {
          let zz = () => {
            if (target == btns[0]) {
              return btnLeft_points; //左：戻るボタン
            } else {
              return btnRight_points; //右：進むボタン
            }
          }
          anime({
            targets: [target],
            points: zz(),
            duration: 800,
            easing: 'easeOutQuart'
          });
        });
      }
      hover(btns[0]);
      hover(btns[1]);
    }

  }

  //ステートによって画像とインジケータの色が変わる
  const changeImg = () => {
    //全部取得して変更
    for (let l = 0; l < img_num; l++) {
      circles[l].style.fill = "#bbb";
      images[l].style.opacity = 0;
      strokes[l].style.stroke = "transparent";
      strokes[l].style.strokeDasharray = "0 5.654";
    }
    //ステートのみ上書き
    circles[state].style.fill = "#c50022";
    images[state].style.opacity = 1;
    strokes[state].style.stroke = "#c50022";
    anime({
      targets: [strokes[state]],
      strokeDasharray: "5.654 5.654",
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
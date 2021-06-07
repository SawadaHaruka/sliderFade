let img_num = 5;//画像の枚数
let img_index = img_num - 1;//ステート用に直す

const init = () => {
  let state = 0;
  let images = [], circles = [], btns = [];

  const setImg = () => {
    //画像取得
    for (let i = 1; i <= img_num; i++) {
      let img = document.getElementById("img" + i);
      images.push(img);
      img.style.opacity = 0;
      images[state].style.opacity = 1;
    }

    //svgエリア
    let svg = document.getElementById('svg_stage');
    let NS = svg.getAttribute('xmlns');

    //インジケータ配置
    let en_width = 0.5;//svg空間の幅100に対しての大きさ
    for (let j = 0; j < img_num; j++) {
      let circle = document.createElementNS(NS, 'circle');//円を生成
      circle.setAttributeNS(null, 'cx', j * 3 + 50 - (en_width * img_index / 2 + en_width / 2 + 2 * img_index / 2));
      circle.setAttributeNS(null, 'cy', 1);
      circle.setAttributeNS(null, 'r', en_width);
      svg.appendChild(circle);
      circle.style.fill = "#bbb";
      circle.style.cursor = "pointer";
      circles.push(circle);
      circles[state].style.fill = "#d00022";
      circle.addEventListener('click', () => {
        let number = circles.indexOf(circle, 0); //クリックした円を取得
        circles[j].style.fill = "#bbb";
        circle.style.fill = "#d00022";//クリックした円塗り替え
        state = number;//クリックしたn番目をステートにする
        changeImg();
      });
      circle.addEventListener('mouseover', () => {
        circle.style.fill = "#d00022";
      });
      circle.addEventListener('mouseout', () => {
        circle.style.fill = "#bbb";
        if (circle == circles[state]) {
          circle.style.fill = "#d00022";
        }
      });
    }

    let btnLeft = document.createElementNS(NS, 'polygon');//左：戻るボタン
    btnLeft.setAttributeNS(null, 'points', "33.27 1, 35 0, 35 2");
    svg.appendChild(btnLeft);
    let btnRight = document.createElementNS(NS, 'polygon');//右：進むボタン
    btnRight.setAttributeNS(null, 'points', "66.73 1, 65 0, 65 2");
    svg.appendChild(btnRight);
    btns.push(btnLeft, btnRight);
    for (let k = 0; k < 2; k++) {
      btns[k].style.fill = "#d00022";
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
            return "32.27 1, 35 0, 35 2"; //左：戻るボタン
          } else {
            return "67.73 1, 65 0, 65 2"; //右：進むボタン
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
            return "33.27 1, 35 0, 35 2"; //左：戻るボタン
          } else {
            return "66.73 1, 65 0, 65 2"; //右：進むボタン
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
  setImg();

  //ステートによって画像とインジケータの色が変わる
  const changeImg = () => {
    //全部取得して変更
    for (let l = 0; l < img_num; l++) {
      circles[l].style.fill = "#bbb";
      images[l].style.opacity = 0;
    }
    //ステートのみ上書き
    circles[state].style.fill = "#d00022";
    images[state].style.opacity = 1;
  }

  //自動で切り替え
  setInterval(() => {
    if (state >= img_index) {
      state = 0;
    } else {
      state += 1;
    }
    changeImg();
  }, 4000);

}
init();

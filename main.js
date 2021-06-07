let img_num = 5;//画像の枚数
let img_index = img_num - 1;//ステート用に直す

const init = () => {
  let state = 0;
  let images = [], circles = [];

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
    let NS = svg.getAttribute('xmlns');//多分svgの空間のこと

    //インジゲータ配置
    let en_width = 0.5;//svg空間100に対しての大きさ
    for (let j = 0; j < img_num; j++) {
      let circle = document.createElementNS(NS, 'circle');//円を生成
      circle.setAttributeNS(null, 'cx', j * 3 + 50 - (en_width * img_index / 2 + en_width / 2 + 2 * img_index / 2));
      circle.setAttributeNS(null, 'cy', 1.5);
      circle.setAttributeNS(null, 'r', en_width);
      svg.appendChild(circle);
      circle.style.fill = "#bbb";
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
        if(circle==circles[state]){
          circle.style.fill = "#d00022";
        }
      });
    }

    //左：戻るボタン
    let btnLeft = document.createElementNS(NS, 'polygon');//三角形を生成
    btnLeft.setAttributeNS(null, 'points', "32.4 1.5, 35 0, 35 3");
    svg.appendChild(btnLeft);
    btnLeft.style.fill = "#d00022";
    btnLeft.addEventListener('click', () => {
      if (state == 0) {
        state = img_index;
      } else {
        state -= 1;
      }
      changeImg();
    });
    //右：進むボタン
    let btnRight = document.createElementNS(NS, 'polygon');//三角形を生成
    btnRight.setAttributeNS(null, 'points', "67.6 1.5, 65 0, 65 3");
    svg.appendChild(btnRight);
    btnRight.style.fill = "#d00022";
    btnRight.addEventListener('click', () => {
      if (state == img_index) {
        state = 0;
      } else {
        state += 1;
      }
      changeImg();
    });
    let hover = (target) => {
      target.addEventListener('mouseover', () => {
        let z = () => {
          if (target == btnLeft) {
            return "31.4 1.5, 35 0, 35 3"; //左：戻るボタン
          } else {
            return "68.6 1.5, 65 0, 65 3"; //右：進むボタン
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
          if (target == btnLeft) {
            return "32.4 1.5, 35 0, 35 3"; //左：戻るボタン
          } else {
            return "67.6 1.5, 65 0, 65 3"; //右：進むボタン
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
    hover(btnLeft);
    hover(btnRight);
  }
  setImg();

  //ステートによって画像とインジゲータの色が変わる
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

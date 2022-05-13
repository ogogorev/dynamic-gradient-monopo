const WIDTH = 300;
const HEIGHT = 200;

const K = 4;

const EFFECT_W = WIDTH / K;
const EFFECT_H = HEIGHT / K;

const r = (a = 0, b = 255) => {
  return Math.floor(a + b * Math.random());
};

const randomColor = () => {
  return [r(), r(), r()];
};

const lV2 = (a, b) => {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];

  return Math.sqrt(dx * dx + dy * dy);
};

const sumV3 = (v1, v2) => {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
};

const multV3 = (v, n) => [v[0] * n, v[1] * n, v[2] * n];

const multV32 = (v1, v2) => [v1[0] * v2[0], v1[1] * v2[1], v1[2] * v2[2]];

const scV3 = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];

const cosV3 = (v) => {
  return [Math.cos(v[0]), Math.cos(v[1]), Math.cos(v[2])];
};

const mixColors = (colors) => {
  const colCount = colors.length;
  const resColor = [];

  for (let ch = 0; ch < 3; ch++) {
    let s = 0;
    for (let cI = 0; cI < colCount; cI++) {
      s += Math.round(colors[cI][ch] * 255);
    }
    resColor[ch] = s / colCount;
  }

  return resColor;
};

const palette = (t, a, b, c, d) => {
  // const p = t % 1;
  // const p = Math.cos(2 * Math.PI * t);
  const p = (Math.cos(Math.PI * t) + 1) / 2;
  return sumV3(multV3(a, p), multV3(b, 1 - p));
};

const V1 = [0, 1, 0];
const V2 = [0, 0, 0];
const V3 = [1, 1, 1];
const V4 = [0.9, 0, 0];

// 000 111 111 0.1 0 0.9

const getPixelColor = (coords, t, c1, c2, c3) => {
  const uv = [coords[0] / WIDTH, coords[1] / HEIGHT];

  const col1 = palette(lV2(uv, c1), V1, V2, V3, V4);
  // const col2 = palette(lV2(uv, c2), V1, V2, V3, V4);
  // const col3 = palette(lV2(uv, c3), V1, V2, V3, V4);

  // const d2 = lV2(uv, c2);
  // const col2 = palette(d2 + time, V1, V2, V3, V4);

  // return multV3(multV3(sumV3(col1, col2), 0.5), 255);
  // return multV3(multV3(sumV3(sumV3(col1, col2), col3), 0.3333), 255);
  return multV3(col1, 255);
  // return mixColors([col1, col2, col3]);
};

////// =======

const v4r = document.querySelector("#v4-r");
const v4g = document.querySelector("#v4-g");
const v4b = document.querySelector("#v4-b");

v4r.addEventListener("change", (e) => {
  const value = parseFloat(e.target.value);
  console.log({ value });
  V4[0] = value;
});

v4g.addEventListener("change", (e) => {
  const value = parseFloat(e.target.value);
  console.log({ value });
  V4[1] = value;
});

v4b.addEventListener("change", (e) => {
  const value = parseFloat(e.target.value);
  console.log({ value });
  V4[2] = value;
});

let stopped = false;
const stopButton = document.querySelector("#stopButton");
stopButton.addEventListener("click", () => (stopped = true));

const cnv = document.querySelector("#canvas");
cnv.width = WIDTH;
cnv.height = HEIGHT;

let mousePos = [];

cnv.addEventListener("mousemove", (ev) => {
  // console.log(ev.offsetX, ev.offsetY);
  mousePos = [ev.offsetX, ev.offsetY];

  if (stopped) {
    stopped = false;
    requestAnimationFrame(draw);
  }
});

// console.log({ cnv });
const ctx = cnv.getContext("2d");

const imageData = ctx.createImageData(WIDTH, HEIGHT);
const { data } = imageData;

let frame = 0;
const start = performance.now();

const checkFrame = (frame) => true;

const timeArray = Array(100)
  .fill(0)
  .map((_, i) => i * 0.02);

const setColorByPos = (i, j, red, green, blue) => {
  const dI = (j * WIDTH + i) * 4;
  data[dI] = red;
  data[dI + 1] = green;
  data[dI + 2] = blue;
  data[dI + 3] = 255;
};

const drawDot = (x, y, color) => {
  setColorByPos(x - 1, y - 1, color[0], color[1], color[2]);
  setColorByPos(x, y - 1, color[0], color[1], color[2]);
  setColorByPos(x + 1, y - 1, color[0], color[1], color[2]);
  setColorByPos(x - 1, y, color[0], color[1], color[2]);
  setColorByPos(x, y, color[0], color[1], color[2]);
  setColorByPos(x + 1, y, color[0], color[1], color[2]);
  setColorByPos(x - 1, y + 1, color[0], color[1], color[2]);
  setColorByPos(x, y + 1, color[0], color[1], color[2]);
  setColorByPos(x + 1, y + 1, color[0], color[1], color[2]);
};

let lastX, lastY;

const draw = () => {
  frame++;

  if (checkFrame(frame)) {
    const [x, y] = [mousePos[0] / WIDTH, mousePos[1] / HEIGHT];
    // const t = Math.round((performance.now() - start) / 10) / 100;
    const t = frame / 60;
    // const time = timeArray[frame % timeArray.length];

    // const c1 = [Math.sin(x) * 0.5, Math.cos(y * 0.2) * 0.7];
    const c1 = [x, y];
    // const c2 = [1 - x, y];
    // const c1 = [Math.sin(x + y), Math.cos(y * y - x)];
    // const c2 = [Math.cos(x * y), Math.sin(y * y * y + 3 * x) * 0.3];
    // const c3 = [Math.sin(t) * 0.5, Math.cos(t * 0.2) * 0.7];

    // const c1 = [Math.sin(x) * 0.5, Math.cos(y * 0.2) * 0.7];
    // const c1 = [Math.sin(x), Math.cos(y)];
    // const c2 = [Math.sin(y), Math.cos(x)];
    // const c2 = [
    //   Math.sin((x + WIDTH / 2) * 0.7) * 0.9,
    //   Math.cos((y + HEIGHT / 2) * 0.2 * 0.65) * 0.6,
    // ];

    // if (!(frame % 10)) {
    //   console.log({ c1, c2 });
    // }

    for (let j = 0; j < HEIGHT; j++) {
      for (let i = 0; i < WIDTH; i++) {
        const color = getPixelColor([i, j], undefined, c1);
        setColorByPos(i, j, color[0], color[1], color[2]);
      }
    }

    drawDot(Math.floor(c1[0] * WIDTH), Math.floor(c1[1] * HEIGHT), [255, 0, 0]);
    // drawDot(Math.floor(c2[0] * WIDTH), Math.floor(c2[1] * HEIGHT), [0, 255, 0]);
    // drawDot(Math.floor(c3[0] * WIDTH), Math.floor(c3[1] * HEIGHT), [0, 0, 255]);

    ctx.putImageData(imageData, 0, 0);

    if (lastX === x && lastY === y) {
      stopped = true;
    }
    lastX = x;
    lastY = y;
  }

  if (!stopped) {
    requestAnimationFrame(draw);
  }
};

draw();

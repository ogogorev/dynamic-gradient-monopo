/**
 * orange - #e35417 227,84,23
 * grey   - #a8a796 168,167,150
 * blue   - #28437b 40,67,123
 *
 * ORANGE
 * red 220 -> cos(2pi * (0.08 | 0.92))
 * green 80 -> 0.3 -> cos(2pi * (0.2 | 0.8))
 * blue 20 -> 0.08 -> cos(2pi * (0.236 | 0.764))
 *
 */

const WIDTH = 300;
const HEIGHT = 200;

let WK = 2;
let HK = 2;

const palette = (t, a, b, c, d) => {
  const ct = multV3(c, EASINGS.q(t));
  const ctd = sumV3(ct, d);

  const ctd2pi = multV3(ctd, 6.28318);
  const ctdCos = cosV3(ctd2pi);
  const bCos = multV32(b, ctdCos);

  return sumV3(a, bCos);
};

const V1 = [0, 0, 0];
const V2 = [1, 1, 1];
const V3 = [-1, -1, -1];
const V4 = [0.37, 0.45, 0.486];

const getPixelColor = (coords, t, c1, c2, c3) => {
  const uv = [coords[0] / WIDTH, coords[1] / HEIGHT];

  const d1 = lV2(uv, c1);
  const d2 = lV2(uv, c2);
  const d3 = lV2(uv, c3);

  const col1 = palette(d1, V1, V2, V3, V4);
  const col2 = palette(d2, V1, V2, V3, V4);
  const col3 = palette(d3, V1, V2, V3, V4);

  const mixedColor = mixColorsW2([col1, col2, col3], [d1, d2, d3]);

  return mixedColor;
};

let stopped = true;

const cnv = document.querySelector("#canvas");
cnv.width = WIDTH;
cnv.height = HEIGHT;

WK = cnv.getBoundingClientRect().width / WIDTH;
HK = cnv.getBoundingClientRect().height / HEIGHT;

let mousePos = [];

cnv.addEventListener("mousemove", (ev) => {
  mousePos = [ev.offsetX / WK, ev.offsetY / HK];

  if (stopped) {
    stopped = false;
    requestAnimationFrame(draw);
  }
});

const ctx = cnv.getContext("2d");

const imageData = ctx.createImageData(WIDTH, HEIGHT);
const { data } = imageData;

let frame = 0;
const start = performance.now();

const setColorByPos = (i, j, red, green, blue) => {
  const dI = (j * WIDTH + i) * 4;
  data[dI] = red;
  data[dI + 1] = green;
  data[dI + 2] = blue;
  data[dI + 3] = 255;
};

// const drawDot = (x, y, color) => {
//   setColorByPos(x - 1, y - 1, color[0], color[1], color[2]);
//   setColorByPos(x, y - 1, color[0], color[1], color[2]);
//   setColorByPos(x + 1, y - 1, color[0], color[1], color[2]);
//   setColorByPos(x - 1, y, color[0], color[1], color[2]);
//   setColorByPos(x, y, color[0], color[1], color[2]);
//   setColorByPos(x + 1, y, color[0], color[1], color[2]);
//   setColorByPos(x - 1, y + 1, color[0], color[1], color[2]);
//   setColorByPos(x, y + 1, color[0], color[1], color[2]);
//   setColorByPos(x + 1, y + 1, color[0], color[1], color[2]);
// };

let lastX, lastY;

const draw = () => {
  frame++;

  const [x, y] = [mousePos[0] / WIDTH, mousePos[1] / HEIGHT];
  const t = frame / 60;

  const c1 = [0.5 + Math.sin(x) * 0.5, Math.cos(y) * 0.7];
  // const c1 = [x, y];
  // const c2 = [1 - x, y];
  // const c1 = [Math.sin(x + y), Math.cos(y * y - x)];
  const c2 = [0.5 * Math.cos(x + y), Math.sin(y * y * y + 3 * x) * 0.3];
  const c3 = [
    Math.sin(t) * 0.5,
    Math.cos(-Math.PI / 2 + (Math.PI * 0.2 * Math.round(t * 1000)) / 1000),
  ];
  // const c2 = [0.5, 0.5];
  // const c3 = [0.4, 0.4];

  // const c1 = [Math.sin(x) * 0.5, Math.cos(y * 0.2) * 0.7];
  // const c1 = [Math.sin(x), Math.cos(y)];
  // const c2 = [Math.sin(y), Math.cos(x)];
  // const c2 = [
  //   Math.sin((x + WIDTH / 2) * 0.7) * 0.9,
  //   Math.cos((y + HEIGHT / 2) * 0.2 * 0.65) * 0.6,
  // ];;

  for (let j = 0; j < HEIGHT; j++) {
    for (let i = 0; i < WIDTH; i++) {
      const color = getPixelColor([i, j], undefined, c1, c2, c3);
      setColorByPos(i, j, color[0], color[1], color[2]);
    }
  }

  // drawDot(Math.floor(c1[0] * WIDTH), Math.floor(c1[1] * HEIGHT), [255, 0, 0]);
  // drawDot(Math.floor(c2[0] * WIDTH), Math.floor(c2[1] * HEIGHT), [0, 255, 0]);
  // drawDot(Math.floor(c3[0] * WIDTH), Math.floor(c3[1] * HEIGHT), [0, 0, 255]);

  ctx.putImageData(imageData, 0, 0);

  if (lastX === x && lastY === y) {
    stopped = true;
  }
  lastX = x;
  lastY = y;

  if (!stopped) {
    requestAnimationFrame(draw);
  }
};

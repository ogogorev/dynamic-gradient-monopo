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
  // return dx * dx + dy * dy;
  // return Math.abs(dx) + Math.abs(dy);
};

// const lV3 = (a, b) => {
//   const dx = a[0] - b[0];
//   const dy = a[1] - b[1];
//   const dz = a[2] - b[2];

//   // return Math.sqrt(dx * dx + dy * dy + dz * dz);
//   return dx * dx + dy * dy + dz * dz;
// };

const sumV3 = (v1, v2) => {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
};

const multV3 = (v, n) => [v[0] * n, v[1] * n, v[2] * n];

const multV32 = (v1, v2) => [v1[0] * v2[0], v1[1] * v2[1], v1[2] * v2[2]];

const scV3 = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];

const cosV3 = (v) => {
  return [Math.cos(v[0]), Math.cos(v[1]), Math.cos(v[2])];
};

const powV3 = (v, p) => {
  return [Math.pow(v[0], p), Math.pow(v[1], p), Math.pow(v[2], p)];
};

const mixColors = (colors) => {
  const colCount = colors.length;
  const resColor = [];

  for (let ch = 0; ch < 3; ch++) {
    let s = 0;
    for (let cI = 0; cI < colCount; cI++) {
      s += Math.round(colors[cI][ch] * 255);
    }
    resColor[ch] = Math.round(s / colCount);
  }

  return resColor;
};

const mixColors2 = (colors) => {
  const colCount = colors.length;
  const resColor = [];

  const squaredColors = [];

  for (let cI = 0; cI < colCount; cI++) {
    squaredColors.push(powV3(colors[cI], 2));
  }

  for (let ch = 0; ch < 3; ch++) {
    let s = 0;
    for (let cI = 0; cI < colCount; cI++) {
      s += squaredColors[cI][ch];
    }
    resColor[ch] = s / colCount;
  }

  const r = multV3(powV3(resColor, 1 / 2), 255);
  // debugger;
  return r;
};

const subtractColors = (colors) => {
  const colCount = colors.length;
  const resColor = [];

  for (let ch = 0; ch < 3; ch++) {
    let s = colors[0][ch];
    for (let cI = 1; cI < colCount; cI++) {
      s -= colors[cI][ch];
    }
    // resColor[ch] = s / colCount;
    resColor[ch] = Math.abs(s);
  }

  const r = multV3(resColor, 255);
  // debugger;
  return r;
};

const EASINGS = {
  q: (x) => x * x,
  log: (x) => Math.log(x) * 10,
  easeOutQuart: (x) => 1 - Math.pow(1 - x, 4),
  easeOutCubic: (x) => 1 - Math.pow(1 - x, 3),
};

const easingF = (t, f) => {
  switch (f) {
    case "cos":
      return 1 - (Math.cos(Math.PI * t) + 1) / 2;
    case "q":
      return t * t;
    case "inOutQuart":
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    case "inOutQuad":
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    default:
      return t;
  }
};

const mixColorsW = (colors, ds) => {
  let min = 1000000;
  let max = -1;
  let sum = 0;

  for (let i = 0; i < ds.length; i++) {
    sum += ds[i];
    if (ds[i] < min) min = ds[i];
    if (ds[i] > max) max = ds[i];
  }

  const ws = [];

  for (let i = 0; i < ds.length; i++) {
    ws.push((min + max - ds[i]) / sum);
  }

  const colCount = colors.length;
  const resColor = [];

  for (let ch = 0; ch < 3; ch++) {
    let s = 0;
    for (let cI = 0; cI < colCount; cI++) {
      s += Math.round(colors[cI][ch] * 255) * ws[cI];
    }
    resColor[ch] = s;
  }

  return resColor;
};

const mixColorsW2 = (colors, ds) => {
  const minMax = Math.min.apply(null, ds) + Math.max.apply(null, ds);
  const invertedSquared = [];
  let sum = 0;

  for (let i = 0; i < ds.length; i++) {
    const n = Math.pow(minMax - ds[i], 2);
    sum += n;
    invertedSquared.push(n);
  }

  const ws = [];
  for (let i = 0; i < ds.length; i++) {
    ws.push(invertedSquared[i] / sum);
  }

  const colCount = colors.length;
  const resColor = [];

  for (let ch = 0; ch < 3; ch++) {
    let s = 0;
    for (let cI = 0; cI < colCount; cI++) {
      s += Math.round(colors[cI][ch] * 255) * ws[cI];
    }
    resColor[ch] = s;
  }

  return resColor;
};

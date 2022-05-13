let spacePressed = false;
window.addEventListener("keydown", (e) => {
  e.key === " " && !spacePressed && (spacePressed = true);
});
window.addEventListener(
  "keyup",
  (e) => e.key === " " && spacePressed && (spacePressed = false)
);
const log = (...args) => {
  if (spacePressed) {
    console.log(args);
    spacePressed = false;
  }
};

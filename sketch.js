const controlsPanel = document.getElementById("controls-panel");
const arcSets = [];
const setCount = 10;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createArcSetControls(index) {
  const set = {
    colorValue: Math.round(randomBetween(0, 360)),
    lineSize: randomBetween(4, 18),
    lineHeight: randomBetween(100, 260),
    lineWidth: randomBetween(100, 260),
    offsetX: randomBetween(-80, 80),
    offsetY: randomBetween(-80, 80),
    rotation: randomBetween(-1.5, 1.5),
    orbitSpeed: randomBetween(-0.006, 0.006),
  };

  const wrapper = document.createElement("div");
  wrapper.className = "arc-set";

  const title = document.createElement("h2");
  title.textContent = `Set ${index + 1}`;
  wrapper.appendChild(title);

  const controls = [
    { key: "colorValue", label: "Color value", min: 0, max: 360, value: set.colorValue },
    { key: "lineSize", label: "Size", min: 1, max: 30, value: set.lineSize },
    { key: "lineHeight", label: "Height", min: 50, max: 300, value: set.lineHeight },
    { key: "lineWidth", label: "Width", min: 50, max: 300, value: set.lineWidth },
  ];

  controls.forEach((config) => {
    const group = document.createElement("div");
    group.className = "control-group";

    const label = document.createElement("label");
    label.setAttribute("for", `set-${index}-${config.key}`);

    const text = document.createElement("span");
    text.textContent = config.label;

    const output = document.createElement("output");
    output.id = `set-${index}-${config.key}-output`;
    output.textContent = String(config.value);

    label.appendChild(text);
    label.appendChild(output);

    const input = document.createElement("input");
    input.id = `set-${index}-${config.key}`;
    input.type = "range";
    input.min = String(config.min);
    input.max = String(config.max);
    input.value = String(config.value);
    input.addEventListener("input", (event) => {
      set[config.key] = Number(event.target.value);
      output.textContent = event.target.value;
      if (typeof redraw === "function") {
        redraw();
      }
    });

    group.appendChild(label);
    group.appendChild(input);
    wrapper.appendChild(group);
  });

  controlsPanel.appendChild(wrapper);
  arcSets.push(set);
}

for (let i = 0; i < setCount; i += 1) {
  createArcSetControls(i);
}

function setup() {
  const canvas = createCanvas(windowWidth * 0.68, windowHeight * 0.9);
  canvas.parent("canvas-holder");
  pixelDensity(1);
  noFill();
  strokeCap(ROUND);
}

function windowResized() {
  resizeCanvas(windowWidth * 0.68, windowHeight * 0.9);
}

function draw() {
  background(16, 21, 28);
  translate(width * 0.5, height * 0.5);

  for (let setIndex = 0; setIndex < arcSets.length; setIndex += 1) {
    const set = arcSets[setIndex];
    const layerAngle = (TWO_PI / arcSets.length) * setIndex + set.rotation + frameCount * set.orbitSpeed;

    push();
    rotate(layerAngle);
    translate(set.offsetX, set.offsetY);

    const arcLayers = [
      { width: set.lineWidth + 80, height: set.lineHeight + 80, weight: set.lineSize + 8 },
      { width: set.lineWidth + 56, height: set.lineHeight + 52, weight: set.lineSize + 6 },
      { width: set.lineWidth + 32, height: set.lineHeight + 28, weight: set.lineSize + 4 },
      { width: set.lineWidth + 16, height: set.lineHeight + 14, weight: set.lineSize + 2 },
      { width: set.lineWidth, height: set.lineHeight, weight: set.lineSize }
    ];

    for (let i = 0; i < arcLayers.length; i += 1) {
      const layer = arcLayers[i];
      const offset = i * 0.18 + setIndex * 0.08;
      const startAngle = -HALF_PI + offset;
      const endAngle = startAngle + PI * 0.95 + i * 0.12;

      stroke(set.colorValue + i * 5, 100, 90);
      strokeWeight(layer.weight);
      arc(0, 0, layer.width, layer.height, startAngle, endAngle);
    }

    pop();
  }
}

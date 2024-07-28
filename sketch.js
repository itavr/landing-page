let seed;
let t;
let num;
let radius, mySize, margin;
let sizes = [];
let palette;
let color_bg, color_planet;
let v_planet = [];
let zoomLevel = 1;
let targetZoom = 1;
let zoomSpeed = 0.05;
let zoomComplete = false;
let maxZoom = 20;
let centralPlanetSize;
let transitionProgress = 0;
let scrollPosition = 0;
let maxScroll;

function setup() {
  frameRate(50);
  seed = Math.random() * 15283;
  randomSeed(seed);
  mySize = min(windowWidth, windowHeight);
  margin = mySize / 100;
  createCanvas(windowWidth, windowHeight, WEBGL);
  perspective(PI / 3.5, width / height, 1, 5000);
  palette = random(colorScheme).colors.concat();
  color_bg = "#202020";
  color_planet = "#020317"; // Set the final color to #020317
  background(color_bg);
  num = int(random(20, 10));
  radius = mySize * 2.25;
  
  centralPlanetSize = mySize / 35;
  
  for (let a = 0; a < TAU; a += TAU / num) {
    sizes.push(random(0.1, 0.5));
  }
  t = 0;
  
  maxScroll = windowHeight * 2; // Adjust this value to control the total scroll length
}

function draw() {
  randomSeed(seed);
  
  // Calculate zoom based on scroll position
  targetZoom = map(scrollPosition, 0, maxScroll, 1, maxZoom);
  zoomLevel = lerp(zoomLevel, targetZoom, zoomSpeed);

  // Calculate transition progress
  transitionProgress = map(zoomLevel, 1, maxZoom, 0, 1);
  transitionProgress = constrain(transitionProgress, 0, 1);

  // Transition background color
  let bgColor = lerpColor(color(color_bg), color(color_planet), transitionProgress);
  background(bgColor);

  push();
  scale(zoomLevel);

  // Draw central star
  push();
  noStroke();
  fill(color_planet);
  sphere(centralPlanetSize);
  pop();

  // Draw space elements
  if (transitionProgress < 0.9) {
    drawSpaceElements();
  }

  pop();

  // Display instructions
  if (transitionProgress < 1) {
    push();
    fill(255, 255 * (1 - transitionProgress));
    textAlign(CENTER, CENTER);
    textSize(20 / zoomLevel);
    text("Scroll to enter the star", 0, height / 3 / zoomLevel);
    pop();
  }

  // Check if transition is complete
  if (transitionProgress >= 1) {
    zoomComplete = true;
    // Here you can trigger the transition to the rest of your site
    // For example, you could use:
    // window.location.href = 'your-main-site-url';
  }
}

function drawSpaceElements() {
  for (let i = 0; i < num; i++) {
    let a = (TAU / num) * i;
    let x = radius * sin(a + t) / random(5, 3) / 1.0;
    let y = radius * cos(a + t) / random(3, 5) / 1.0;
    v_planet[i] = createVector(x, y);
  }

  push();
  for (let q = 0; q < 1 / 5; q += 2 * random(0.01, 0.02)) {
    for (let j = 0; j < 1; j++) {
      let n = noise(q * t, j * t, frameCount * 0.01);
      rotateX(random(TAU) + sin(-t) / 5 + q);
      rotateY(random(TAU) + cos(t) / 5 + q);
      rotateZ(random(TAU) + sin(-t) / 5 + q);
      noStroke();
      fill(random(palette));
      for (let i = 0; i < num; i += 8) {
        let d = random(radius / 2, radius / 4) / 1;
        push();
        rotateX(random(TAU) + sin(t));
        rotateY(random(TAU) + cos(-t) + n / 100);
        rotateZ(random(TAU) + 2 * sin(2 * t));
        let x_plus = 1.25 * random(-d, d) / 1;
        let y_plus = 1.25 * random(-d, d) / 1;
        let z_plus = 1.25 * random(-d, d) / 1;
        torus(z_plus, random(0.1,1.5) * (1 - transitionProgress), 100, 100);
        pop();
      }
      for (let i = 0; i < num; i += 4) {
        let d = (1.5 + sin(t)) * random(radius / 2, radius / 4);
        let x_plus = 0.5 * random(-d, d) / 1;
        let y_plus = 0.5 * random(-d, d) / 1;
        let z_plus = 0.5 * random(-d, d) / 1;
        stroke(random(palette));
        strokeWeight(random(0.1, 0.5) * (1 - transitionProgress));
        noFill();
        push();
        translate(v_planet[i].x + x_plus, v_planet[i].y + y_plus, z_plus);
        rotateX(random(TAU) + t);
        rotateY(random(-TAU) + t);
        rotateZ(random(PI) + t);
        sphere(random(2, 15) * (1 - transitionProgress));
        pop();
      }
    }
  }
  pop();

  t += random(2, 1) * random(0.001, 0.005) / 1;
}

function mouseWheel(event) {
  if (!zoomComplete) {
    scrollPosition += event.delta;
    scrollPosition = constrain(scrollPosition, 0, maxScroll);
    return false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centralPlanetSize = min(windowWidth, windowHeight) / 35;
  maxScroll = windowHeight * 2; // Recalculate maxScroll on window resize
}

const colorScheme = [
  {colors: ['#000427', '#EEC280', '#0C3A44', '#191224', '#221605']},
  {colors: ['#343D46', '#F1EDDB', '#ECF0F1', '#282E33', '#03111A']},
  {"colors": ["#0d0d21", "#d4c6b9", "#7e7375", "#332b31", "#55423e"]},
  {"colors": ["#0a0a1f", "#5a4640", "#eae4e1", "#af9f91", "#786d70"]},
  {"colors": ["#25222c", "#3e3334", "#c7c2bf", "#8b7e7a", "#5d524e"]},
  {"colors": ["#111118", "#a59887", "#736b69", "#4b4643", "#362f2b"]},
  {"colors": ["#1c1b23", "#9c8e7f", "#8a7a6f", "#564d49", "#403734"]},
  {"colors": ["#202124", "#b0a297", "#877d74", "#5c524d", "#3d3633"]}
]

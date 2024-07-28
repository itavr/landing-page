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
let zoomSpeed = 0.04; // שנה ערך זה כדי לשנות את מהירות הזום
let zoomComplete = false;
let maxZoom = 40; // שנה ערך זה כדי לשנות את עומק הזום המקסימלי
let centralPlanetSize;
let transitionProgress = 0;
let centralPlanetColor = "#020317";
let font;
let textVisible = false;
let textTimer;

function preload() {
  font = loadFont('ploni-light-aaa.otf');
}

function setup() {
  frameRate(50);
  seed = Math.random() * 15283;
  randomSeed(seed);
  mySize = min(windowWidth, windowHeight);
  margin = mySize / 100;
  createCanvas(windowWidth, windowHeight, WEBGL);
  perspective(PI / 3.5, width / height, 1, 5000);
  updatePalette();
  background(color_bg);
  num = int(random(20, 10));
  radius = mySize * 2.25;
  
  // הגדרת גודל הכוכב המרכזי - שנה את המספר כאן כדי לשנות את גודל הכוכב
  centralPlanetSize = mySize / 35;
  
  for (let a = 0; a < TAU; a += TAU / num) {
    sizes.push(random(0.1, 0.5));
  }
  t = 0;
  textFont(font); // הגדרת הפונט בהתחלה
}

function draw() {
  randomSeed(seed);
  // מעבר הדרגתי של צבע הרקע
  background(color_bg);

  // הפעלת אפקט הזום
  scale(zoomLevel);
  zoomLevel = easeInOutQuad(zoomLevel, targetZoom, zoomSpeed);

  // עדכון התקדמות המעבר
  if (zoomLevel > maxZoom / 2) {
    transitionProgress = map(zoomLevel, maxZoom / 2, maxZoom, 0, 1);
  }

  // בדיקה אם הזום הושלם
  if (abs(zoomLevel - targetZoom) < 0.01 && targetZoom >= maxZoom) {
    zoomComplete = true;
    if (!textVisible) {
      textVisible = true;
      textTimer = millis();
    }
  }

  // ציור הכוכב המרכזי
  push();
  noStroke();
  fill(centralPlanetColor);
  sphere(centralPlanetSize);
  pop();

  // קוד הציור הקיים שלך (עם כמה שינויים)
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
        // הקטנת האובייקטים ככל שמתקרבים לכוכב המרכזי
        torus(z_plus, random(0.1, 1.5) * (1 - transitionProgress), 100, 100);
        pop();
      }
      for (let i = 0; i < num; i += 4) {
        let d = (1.5 + sin(t)) * random(radius / 2, radius / 4);
        let x_plus = 0.5 * random(-d, d) / 1;
        let y_plus = 0.5 * random(-d, d) / 1;
        let z_plus = 0.5 * random(-d, d) / 1;
        stroke(random(palette));
        // הקטנת עובי הקו ככל שמתקרבים לכוכב המרכזי
        strokeWeight(random(0.1, 0.5) * (1 - transitionProgress));
        noFill();
        push();
        translate(v_planet[i].x + x_plus, v_planet[i].y + y_plus, z_plus);
        rotateX(random(TAU) + t);
        rotateY(random(-TAU) + t);
        rotateZ(random(PI) + t);
        // הקטנת האובייקטים ככל שמתקרבים לכוכב המרכזי
        sphere(random(2, 15) * (1 - transitionProgress));
        pop();
      }
    }
  }
  pop();

  t += random(2, 1) * random(0.001, 0.005) / 1;

  // הצגת הוראות אם הזום לא הושלם
  if (!zoomComplete) {
    push();
    fill(250);
    textAlign(CENTER, CENTER);
    textSize(14 / zoomLevel);
    text("Scroll to Zoom In", 0, height / 3 / zoomLevel);
    pop();
  }

  // הצגת הטקסט לאחר זום אין מלא
  if (textVisible) {
    push();
    fill(255); // צבע לבן בוהק
    textAlign(CENTER, CENTER);
    textFont(font);
    textSize(100 / zoomLevel); // התאמת גודל הטקסט לפי הזום
    text("Hey, We've Been Waiting For You", 0, 0);
    pop();
    
    // הסתרת הטקסט לאחר 3 שניות
    if (millis() - textTimer > 3000) {
      textVisible = false;
    }
  }
}

function mouseWheel(event) {
  if (!zoomComplete) {
    // הגדלה או הקטנה של targetZoom בהתאם לכיוון הגלילה
    targetZoom += event.delta * -0.01;
    
    // הגבלת targetZoom בין 1 ל-maxZoom
    targetZoom = constrain(targetZoom, 1, maxZoom);
    
    // מניעת התנהגות גלילה רגילה
    return false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // עדכון גודל הכוכב המרכזי בעת שינוי גודל החלון
  centralPlanetSize = min(windowWidth, windowHeight) / 10;
}

// פונקציה לעדכון צבעי הפלטה
function updatePalette() {
  palette = random(colorScheme).colors.concat();
  color_bg = random(palette); // בחירת צבע רנדומלי לרקע מתוך הפלטה
}

// פונקציה ל-easeInOutQuad
function easeInOutQuad(current, target, speed) {
  let t = speed / 1;
  t = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  return current + (target - current) * t;
}

// סכמות צבעים (אתה צריך להגדיר אלה או להשתמש בספריית צבעים)
const colorScheme = [
  {colors: ['#000427', '#EEC280', '#0C3A44', '#191224', '#221605']},
  {colors: ['#343D46', '#F1EDDB', '#ECF0F1', '#282E33', '#03111A']},
  {"colors": ["#0d0d21", "#d4c6b9", "#7e7375", "#332b31", "#55423e"]},
  {"colors": ["#0a0a1f", "#5a4640", "#eae4e1", "#af9f91", "#786d70"]},
  {"colors": ["#25222c", "#3e3334", "#c7c2bf", "#8b7e7a", "#5d524e"]},
  ]
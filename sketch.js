let racers = [];
let finishLine;
let playerIndex = 0; // Index of the player-controlled racer
let raceOver = false;
let winner = "";
let keys = {}; // Object to track pressed keys

function setup() {
  createCanvas(800, 400);
  finishLine = width - 50;

  // Create racers with different shapes
  racers.push(new Racer('circle', color(255, 0, 0), 50, true)); // Player-controlled racer
  racers.push(new Racer('square', color(0, 255, 0), 100));
  racers.push(new Racer('triangle', color(0, 0, 255), 150));
  racers.push(new Racer('ellipse', color(255, 255, 0), 200));
}

function draw() {
  background(220);

  // Draw finish line
  stroke(0);
  line(finishLine, 0, finishLine, height);
  noStroke();
  fill(0);
  textSize(16);
  text("Finish", finishLine - 40, 20);

  // Check if race is over
  if (raceOver) {
    textSize(32);
    fill(50);
    textAlign(CENTER, CENTER);
    text(winner + " wins!", width / 2, height / 2);
    noLoop();
    return;
  }

  // Handle player movement
  handlePlayerMovement();

  // Update and display all racers
  for (let i = 0; i < racers.length; i++) {
    let racer = racers[i];
    racer.update();

    // Check for collisions between the player and others
    if (i !== playerIndex) {
      racers[playerIndex].checkCollision(racer);
    }

    racer.display();

    // Check if any racer has won
    if (racer.x >= finishLine && !raceOver) {
      raceOver = true;
      winner = racer.isPlayer ? "Player" : `Racer ${i + 1}`;
    }
  }
}

function handlePlayerMovement() {
  let player = racers[playerIndex];
  if (keys[UP_ARROW]) {
    player.y = max(0, player.y - 5);
  }
  if (keys[DOWN_ARROW]) {
    player.y = min(height, player.y + 5);
  }
  if (keys[LEFT_ARROW]) {
    player.x = max(0, player.x - 5);
  }
  if (keys[RIGHT_ARROW]) {
    player.x = min(finishLine, player.x + 5);
  }
}

function keyPressed() {
  // Record the key being pressed
  keys[keyCode] = true;
}

function keyReleased() {
  // Record the key being released
  keys[keyCode] = false;
}

function mousePressed() {
  // Interact with racers by clicking
  for (let racer of racers) {
    racer.checkInteraction(mouseX, mouseY);
  }
}

class Racer {
  constructor(shape, color, y, isPlayer = false) {
    this.shape = shape;
    this.color = color;
    this.y = y;
    this.x = 0;
    this.speed = random(1, 3);
    this.boost = 0;
    this.size = 30;
    this.isPlayer = isPlayer;
  }

  update() {
    if (!this.isPlayer) {
      this.x += this.speed + this.boost;
    }
    this.boost *= 0.9; // Gradual slowdown after a boost
    this.x = min(this.x, finishLine); // Stop at the finish line
  }

  display() {
    fill(this.color);
    noStroke();

    if (this.shape === 'circle') {
      ellipse(this.x, this.y, this.size, this.size);
    } else if (this.shape === 'square') {
      rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else if (this.shape === 'triangle') {
      triangle(
        this.x, this.y - this.size / 2,
        this.x - this.size / 2, this.y + this.size / 2,
        this.x + this.size / 2, this.y + this.size / 2
      );
    } else if (this.shape === 'ellipse') {
      ellipse(this.x, this.y, this.size * 1.5, this.size);
    }
  }

  checkInteraction(px, py) {
    if (dist(px, py, this.x, this.y) < this.size) {
      this.boost = 5; // Add a speed boost on click
    }
  }

  checkCollision(other) {
    let distance = dist(this.x, this.y, other.x, other.y);
    if (distance < this.size) {
      // Push other racer
      other.boost = 5;
    }
  }
}



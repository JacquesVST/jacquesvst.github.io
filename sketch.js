let matriz = [];
let pixelSize = 16;
let size = 128;
let canvasSize = pixelSize * size;

let currentX;
let currentY;

let serverUrl = 'https://pricey-midi-scabiosa.glitch.me'

var socket = io(serverUrl);

function setup() {
  createCanvas(canvasSize, canvasSize);
  background(255);

  for (let i = 0; i < size; i++) {
    matriz[i] = [];
    for (let j = 0; j < size; j++) {
      let pixel = {
        size: pixelSize,
        fill: '#ffffff',
        stroke: '#000000',
        lowerLimits: {
          x: i * pixelSize,
          y: j * pixelSize,
        },
        upperLimits: {
          x: (i + 1) * pixelSize,
          y: (j + 1) * pixelSize,
        },
        index: {
          row: i,
          column: j,
        },
      };

      fill(pixel.fill);
      stroke(pixel.stroke);
      rect(pixel.lowerLimits.x, pixel.lowerLimits.y, pixelSize, pixelSize);

      matriz[i][j] = pixel;
    }
  }

  socket.on('drawing', (data) => {
    matriz[data.index.row][data.index.column] = data;
    drawPixel(data);
  });
}

function draw() {
  if (currentX >= 0 && currentY >= 0) {
    let currentPixel = matriz[currentX][currentY];
    drawPixel(currentPixel);
  }
}

function mouseDragged(e) {
    updateTileMatrix(e)
}

function mouseClicked(e) {
  updateTileMatrix(e)
}

function updateTileMatrix(e) {
  if (e.isTrusted) {
    let colorPicker = document.getElementById('hidden-picker');

    if (
      (pmouseX >= 0) &&
      (pmouseX < canvasSize) &&
      (pmouseY >= 0) &&
      (pmouseY < canvasSize)
    ) {
      currentX = Math.floor(pmouseX / pixelSize);
      currentY = Math.floor(pmouseY / pixelSize);

      matriz[currentX][currentY].fill = colorPicker.value;
      socket.emit('drawing', matriz[currentX][currentY]);
    }
  }
}

function drawPixel(currentPixel) {
  fill(color(currentPixel.fill));
  stroke(color(currentPixel.stroke));
  rect(
    currentPixel.lowerLimits.x,
    currentPixel.lowerLimits.y,
    currentPixel.size,
    currentPixel.size
  );
}


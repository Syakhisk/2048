import "./style.css";
import * as PIXI from "pixi.js";
import _ from "lodash";

let arrowPress: string = "";

let grid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let colorRed = { x: -1, y: -1 };

type Dir = "L" | "R" | "U" | "D";

(() => {
  const app = new PIXI.Application({
    width: 300,
    height: 300,
    backgroundColor: 0x1099bb,
  });

  document.querySelector("#app")?.appendChild(app.view as any);

  function draw() {
    grid.forEach((row, y) => {
      row.forEach((col, x) => {
        const box = new PIXI.Graphics();
        const width = app.view.width / 4;

        if (colorRed.x == x && colorRed.y == y) {
          box.beginFill(0xff0000);
        } else {
          box.beginFill(0xffffff);
        }

        box.lineStyle(2, 0x000);
        box.drawRect(x * width, y * width, width, width);
        box.endFill();

        const text = new PIXI.Text(col);
        text.x = width / 2 + x * width;
        text.y = width / 2 + y * width;

        text.anchor.set(0.5);

        app.stage.addChild(box);

        if (grid[y][x] != 0) {
          app.stage.addChild(text);
        }
      });
    });

    const arrowPressText = new PIXI.Text(arrowPress);
    arrowPressText.x = app.view.width / 2;
    arrowPressText.y = app.view.height / 2;

    arrowPressText.anchor.set(0.5);
    app.stage.addChild(arrowPressText);

  }

  function generateNumber() {
    const zeros: Array<{ x: number; y: number }> = [];

    grid.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col == 0) zeros.push({ x, y });
      });
    });

    if (zeros.length == 0) return;

    const randIdx = Math.floor(Math.random() * zeros.length);
    const { x, y } = zeros[randIdx];

    colorRed = { x, y };

    grid[y][x] = Math.random() > 0.5 ? 2 : 4;
  }

  function move() {
    for (let y in grid) {
      let newRow = grid[y].filter((v) => v);
      newRow = newRow.concat([0, 0, 0, 0]);
      newRow.length = 4;
      grid[y] = newRow;
    }
  }

  function transpose(dir: Dir) {
    let gridCopy = _.cloneDeep(grid);

    if (dir == "R") {
      gridCopy = gridCopy.map((row) => _.reverse(row));
    } else if (dir == "U") {
      gridCopy = _.unzip(gridCopy);
    } else if (dir == "D") {
      gridCopy = _.reverse(gridCopy);
      gridCopy = _.unzip(gridCopy);
    }

    grid = gridCopy;
  }

  function transposeBack(dir: Dir) {
    let gridCopy = _.cloneDeep(grid);

    if (dir == "R") {
      gridCopy = gridCopy.map((row) => _.reverse(row));
    } else if (dir == "U") {
      gridCopy = _.unzip(gridCopy);
    } else if (dir == "D") {
      gridCopy = _.unzip(gridCopy);
      gridCopy = _.reverse(gridCopy);
    }

    grid = gridCopy;
  }

  function merge() {
    grid.forEach((row, y) => {
      row.forEach((col, x) => {
        if (row[x] == row[x + 1]) {
          row[x] = row[x] * 2;
          row[x + 1] = 0;
          return;
        }
      });
    });
  }

  function onKeyDown(e) {
    let dir: Dir = "L";
    if (e.key == "ArrowLeft") {
      dir = "L";
      arrowPress = "⬅️"
    } else if (e.key == "ArrowRight") {
      dir = "R";
      arrowPress = "➡️"
    } else if (e.key == "ArrowUp") {
      dir = "U";
      arrowPress = "⬆️"
    } else if (e.key == "ArrowDown") {
      dir = "D";
      arrowPress = "⬇️"
    }

    let lastGrid = _.cloneDeep(grid);

    transpose(dir);
    move();
    merge();
    move();
    transposeBack(dir);

    if (JSON.stringify(lastGrid) != JSON.stringify(grid)) {
      generateNumber();
    }

    draw();
  }

  document.addEventListener("keydown", onKeyDown);
  generateNumber();
  draw();
})();

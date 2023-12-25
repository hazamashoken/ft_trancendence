import { Phase, Pong } from '@/lib/pong.enum';
import { GameState } from '@/lib/pong.interface';
import { collision } from '@/lib/pong.collision';
import { Starburst } from '@/lib/Starburst';

let _starburst: Starburst = new Starburst(0, 0.5, 50);

const _blinkFrequency: number = 1000;
const _blinkInterval: number = 800;
let _blinkTimer: number = 0;

function drawBackground(canvas: HTMLCanvasElement)
{
  let canvas2d = canvas.getContext("2d");

  if (canvas2d != null)
  {
    canvas2d.fillStyle = "#000000";
    canvas2d.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawSquare(canvas: HTMLCanvasElement, x: number, y: number, colour: string = "#ffffff")
{
  let canvas2d = canvas.getContext("2d");
  let square = canvas.height * Pong.SQUARE_SIZE;
  let halfsquare = square / 2;

  if (canvas2d != null)
  {
    canvas2d.fillStyle = colour;
    canvas2d.fillRect(Math.round((canvas.width / 2) + (x * canvas.height) - halfsquare),
                      Math.round((y * canvas.height) - halfsquare),
                      Math.round(square), Math.round(square));
  }
}

function drawBat(canvas: HTMLCanvasElement, x: number, y: number)
{
  let limit = Math.floor(Pong.BAT_SIZE / 2);

  drawSquare(canvas, x, y);
  while (limit > 0)
  {
    drawSquare(canvas, x, y - (Pong.SQUARE_SIZE * limit));
    drawSquare(canvas, x, y + (Pong.SQUARE_SIZE * limit));
    limit--;
  }
}

function drawNet(canvas: HTMLCanvasElement)
{
  let canvas2d = canvas.getContext("2d");

  if (canvas2d != null)
  {
    for (let height: number = 0; height < 1 + Pong.SQUARE_SIZE; height += Pong.SQUARE_SIZE * 2)
      drawSquare(canvas, 0, height);
  }
}

function drawLetterSquares(canvas: HTMLCanvasElement, x: number, y: number, num: number[][], print: boolean, colour: string = "#ffffff")
{
  let canvas2d = canvas.getContext("2d");
  let width = num[0].length;
  let height = num.length;

  if (canvas2d != null)
  {
    for (let ys = 0; ys < height; ys++)
    {
      for (let xs = 0; xs < width; xs++)
      {
        if (print && num[ys][xs] == 1)
          drawSquare(canvas, x + (xs * Pong.SQUARE_SIZE), y + (ys * Pong.SQUARE_SIZE), colour);
      }
    }
  }
  return (width * Pong.SQUARE_SIZE);
}

function drawLetterSingle(canvas: HTMLCanvasElement, x: number, y: number, c: string, print: boolean, colour: string = "#ffffff")
: number
{
  let chr = [ [0],
              [0],
              [0],
              [0],
              [0] ];

  switch (c)
  {
    case "0":
      chr = [ [1, 1, 1],
              [1, 0, 1],
              [1, 0, 1],
              [1, 0, 1],
              [1, 1, 1] ];
      break;
    case "1":
      chr = [ [1, 1, 0],
              [0, 1, 0],
              [0, 1, 0],
              [0, 1, 0],
              [1, 1, 1] ];
      break;
    case "2":
      chr = [ [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1] ];
      break;
    case "3":
      chr = [ [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1] ];
      break;
    case "4":
      chr = [ [1, 0, 1],
              [1, 0, 1],
              [1, 1, 1],
              [0, 0, 1],
              [0, 0, 1] ];
      break;
    case "5":
      chr = [ [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1] ];
      break;
    case "6":
      chr = [ [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1] ];
      break;
    case "7":
      chr = [ [1, 1, 1],
              [0, 0, 1],
              [0, 0, 1],
              [0, 0, 1],
              [0, 0, 1] ];
      break;
    case "8":
      chr = [ [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1] ];
      break;
    case "9":
      chr = [ [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1],
              [0, 0, 1],
              [0, 0, 1] ];
      break;
    case "A":
      chr = [ [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1],
              [1, 0, 1],
              [1, 0, 1] ];
      break;
    case "C":
      chr = [ [1, 1, 1],
              [1, 0, 0],
              [1, 0, 0],
              [1, 0, 0],
              [1, 1, 1] ];
      break;
    case "D":
      chr = [ [1, 1, 0],
              [1, 0, 1],
              [1, 0, 1],
              [1, 0, 1],
              [1, 1, 0] ];
      break;
    case "E":
      chr = [ [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1] ];
      break;
    case "G":
      chr = [ [1, 1, 1],
              [1, 0, 0],
              [1, 0, 1],
              [1, 0, 1],
              [1, 1, 1] ];
      break;
    case "I":
      chr = [ [1, 1, 1],
              [0, 1, 0],
              [0, 1, 0],
              [0, 1, 0],
              [1, 1, 1] ];
      break;
    case "L":
      chr = [ [1, 0, 0],
              [1, 0, 0],
              [1, 0, 0],
              [1, 0, 0],
              [1, 1, 1] ];
      break;
    case "N":
      chr = [ [1, 1, 1],
              [1, 0, 1],
              [1, 0, 1],
              [1, 0, 1],
              [1, 0, 1] ];
      break;
    case "P":
      chr = [ [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1],
              [1, 0, 0],
              [1, 0, 0] ];
      break;
    case "R":
      chr = [ [1, 1, 1],
              [1, 0, 1],
              [1, 1, 0],
              [1, 0, 1],
              [1, 0, 1] ];
      break;
    case "S":
      chr = [ [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1] ];
      break;
    case "T":
      chr = [ [1, 1, 1],
              [0, 1, 0],
              [0, 1, 0],
              [0, 1, 0],
              [0, 1, 0] ];
      break;
    case "W":
      chr = [ [1, 0, 1, 0, 1],
              [1, 0, 1, 0, 1],
              [1, 0, 1, 0, 1],
              [1, 0, 1, 0, 1],
              [1, 1, 1, 1, 1] ];
      break;
    case "Y":
      chr = [ [1, 0, 1],
              [1, 0, 1],
              [1, 1, 1],
              [0, 1, 0],
              [0, 1, 0] ];
      break;
    case "!":
      chr = [ [1],
              [1],
              [1],
              [0],
              [1] ];
      break;
    case ".":
      chr = [ [0],
              [0],
              [0],
              [0],
              [1] ];
      break;
  }
  return (drawLetterSquares(canvas, x, y, chr, print, colour));
}

function drawString(canvas: HTMLCanvasElement, x: number, y: number, s: string, colour: string = "#ffffff", blink: boolean = false)
{
  let offset = 0;
  let halfsquare = Pong.SQUARE_SIZE / 2;

  if (blink && _blinkTimer >= _blinkInterval)
    return ;

  for (let i = 0; i < s.length; i++)
  {
    if (i != 0)
      offset += drawLetterSingle(canvas, x + offset + halfsquare, y + halfsquare, " ", true, colour);
    offset += drawLetterSingle(canvas, x + offset + halfsquare, y + halfsquare, s[i], true, colour);
  }
}

function drawStringRev(canvas: HTMLCanvasElement, x: number, y: number, s: string, colour: string = "#ffffff", blink: boolean = false)
{
  let offset = 0;

  // this loop measures the length of the offset
  for (let i = 0; i < s.length; i++)
  {
    if (i != 0)
      offset += drawLetterSingle(canvas, offset, y, " ", false);
    offset += drawLetterSingle(canvas, offset, y, s[i], false);
  }
  // draw the number with the offset
  drawString(canvas, x - offset, y, s, colour, blink);
}

function drawStringCentre(canvas: HTMLCanvasElement, y: number, s: string, colour: string = "#ffffff", blink: boolean = false)
{
  let offset = 0;

  // this loop measures the length of the offset
  for (let i = 0; i < s.length; i++)
  {
    if (i != 0)
      offset += drawLetterSingle(canvas, offset, y, " ", false);
    offset += drawLetterSingle(canvas, offset, y, s[i], false);
  }
  // draw the number with the offset
  drawString(canvas, -offset / 2, y, s, colour, blink);
}

function drawNumber(canvas: HTMLCanvasElement, x: number, y: number, n: number)
{
  drawString(canvas, x, y, n.toString());
}

function drawNumberRev(canvas: HTMLCanvasElement, x: number, y: number, n: number)
{
  drawStringRev(canvas, x, y, n.toString());
}

export function renderCanvas(canvas: HTMLCanvasElement, state: GameState, delta: number)
{
  collision(state, delta);
  _blinkTimer += delta;
  while (_blinkTimer > _blinkFrequency)
    _blinkTimer -= _blinkFrequency;

  drawBackground(canvas);
  drawNet(canvas);
  drawNumberRev(canvas, -Pong.SCORE_OFFSET, Pong.SCORE_OFFSET, state.player1.score);
  drawNumber(canvas, Pong.SCORE_OFFSET, Pong.SCORE_OFFSET, state.player2.score);
  drawBat(canvas, state.player1.position.x, state.player1.position.y);
  drawBat(canvas, state.player2.position.x, state.player2.position.y);
  if (state.phase == Phase.waiting)
    drawStringCentre(canvas, Pong.SCORE_OFFSET * 3, "PLAYER SELECT", "#0000ff", true);
  if (state.phase == Phase.finish)
  {
    _starburst.reset();
    _starburst.update(delta);
    _starburst.render(canvas);
    if (state.player1.score > state.player2.score)
      drawStringCentre(canvas, Pong.SCORE_OFFSET * 3, "PLAYER 1 WINS", "#0000ff");
    if (state.player2.score > state.player1.score)
      drawStringCentre(canvas, Pong.SCORE_OFFSET * 3, "PLAYER 2 WINS", "#0000ff");
  }
  else
  {
    _starburst.stop();
    _starburst.update(delta);
    _starburst.render(canvas);
  }
  if (state.phase == Phase.readyP1)
  {
    drawStringCentre(canvas, Pong.SCORE_OFFSET * 3, "READY PLAYER 1", "#0000ff", true);
    drawStringCentre(canvas, Pong.SCORE_OFFSET * 5, "WAITING PLAYER 2", "#0000ff", true);
  }
  if (state.phase == Phase.readyP2)
  {
    drawStringCentre(canvas, Pong.SCORE_OFFSET * 3, "READY PLAYER 2", "#0000ff", true);
    drawStringCentre(canvas, Pong.SCORE_OFFSET * 5, "WAITING PLAYER 1", "#0000ff", true);
  }
  if (state.phase == Phase.ready)
  {
    drawStringCentre(canvas, Pong.SCORE_OFFSET * 3, "PRESS START", "#0000ff", true);
  }
  if (state.ball.visible)
  {
    drawSquare(canvas, state.ball.position.x, state.ball.position.y);
    for (let i: number = 0; i < state.multiball.length; i++)
      drawSquare(canvas, state.multiball[i].position.x, state.multiball[i].position.y, "#ff0000");
  }
  let multiballs: string = ("").padStart(state.player1.balls, ".");
  drawStringRev(canvas, -Pong.SCORE_OFFSET, 1 - Pong.SCORE_OFFSET - (Pong.SQUARE_SIZE * 2), multiballs, "#ff0000");
  multiballs = ("").padStart(state.player2.balls, ".");
  drawString(canvas, Pong.SCORE_OFFSET, 1 - Pong.SCORE_OFFSET - (Pong.SQUARE_SIZE * 2), multiballs, "#ff0000");
}

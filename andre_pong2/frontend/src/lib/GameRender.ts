import { Phase, Pong } from '@/lib/pong.enum';
import { GameState } from '@/lib/pong.interface';
import { collision } from '@/lib/pong.collision';
import { Starburst } from '@/lib/Starburst';

let _starburst: Starburst = new Starburst(0, 0.5, 50);
let _timer: number = 0;

function drawBackground(canvas: HTMLCanvasElement)
{
  var canvas2d = canvas.getContext("2d");

  if (canvas2d != null)
  {
    canvas2d.fillStyle = "#000000";
    canvas2d.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawSquare(canvas: HTMLCanvasElement, x: number, y: number, colour: string = "#ffffff")
{
  var canvas2d = canvas.getContext("2d");
  var square = canvas.height * Pong.SQUARE_SIZE;
  var halfsquare = square / 2;

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
  var limit = Math.floor(Pong.BAT_SIZE / 2);

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
  var canvas2d = canvas.getContext("2d");

  if (canvas2d != null)
  {
    for (var height: number = 0; height < 1 + Pong.SQUARE_SIZE; height += Pong.SQUARE_SIZE * 2)
      drawSquare(canvas, 0, height);
  }
}

function drawNumberSquares(canvas: HTMLCanvasElement, x: number, y: number, num: number[][], print: boolean, colour: string = "#ffffff")
{
  var canvas2d = canvas.getContext("2d");
  var width = num[0].length;
  var height = num.length;

  if (canvas2d != null)
  {
    for (var ys = 0; ys < height; ys++)
    {
      for (var xs = 0; xs < width; xs++)
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
  var cha = [ [0],
              [0],
              [0],
              [0],
              [0] ];

  switch (c)
  {
    case "A":
      cha = [ [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1],
              [1, 0, 1],
              [1, 0, 1] ];
      break;
    case "C":
      cha = [ [1, 1, 1],
              [1, 0, 0],
              [1, 0, 0],
              [1, 0, 0],
              [1, 1, 1] ];
      break;
    case "D":
      cha = [ [1, 1, 0],
              [1, 0, 1],
              [1, 0, 1],
              [1, 0, 1],
              [1, 1, 0] ];
      break;
    case "E":
      cha = [ [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1] ];
      break;
    case "G":
      cha = [ [1, 1, 1],
              [1, 0, 0],
              [1, 0, 1],
              [1, 0, 1],
              [1, 1, 1] ];
      break;
    case "I":
      cha = [ [1, 1, 1],
              [0, 1, 0],
              [0, 1, 0],
              [0, 1, 0],
              [1, 1, 1] ];
      break;
    case "L":
      cha = [ [1, 0, 0],
              [1, 0, 0],
              [1, 0, 0],
              [1, 0, 0],
              [1, 1, 1] ];
      break;
    case "N":
      cha = [ [1, 1, 1],
              [1, 0, 1],
              [1, 0, 1],
              [1, 0, 1],
              [1, 0, 1] ];
      break;
    case "P":
      cha = [ [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1],
              [1, 0, 0],
              [1, 0, 0] ];
      break;
    case "R":
      cha = [ [1, 1, 1],
              [1, 0, 1],
              [1, 1, 0],
              [1, 0, 1],
              [1, 0, 1] ];
      break;
    case "S":
      cha = [ [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1] ];
      break;
    case "T":
      cha = [ [1, 1, 1],
              [0, 1, 0],
              [0, 1, 0],
              [0, 1, 0],
              [0, 1, 0] ];
      break;
    case "W":
      cha = [ [1, 0, 1, 0, 1],
              [1, 0, 1, 0, 1],
              [1, 0, 1, 0, 1],
              [1, 0, 1, 0, 1],
              [1, 1, 1, 1, 1] ];
      break;
    case "Y":
      cha = [ [1, 0, 1],
              [1, 0, 1],
              [1, 1, 1],
              [0, 1, 0],
              [0, 1, 0] ];
      break;
    case "1":
      cha = [ [1, 1, 0],
              [0, 1, 0],
              [0, 1, 0],
              [0, 1, 0],
              [1, 1, 1] ];
      break;
    case "2":
      cha = [ [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1] ];
      break;
    case "!":
      cha = [ [1],
              [1],
              [1],
              [0],
              [1] ];
      break;
    case ".":
      cha = [ [0],
              [0],
              [0],
              [0],
              [1] ];
      break;
  }
  return (drawNumberSquares(canvas, x, y, cha, print, colour));
}

function drawString(canvas: HTMLCanvasElement, x: number, y: number, s: string, colour: string = "#ffffff", blink: boolean = false)
{
  var str = s;
  var len = str.length;
  var off = 0;
  var hsq = Pong.SQUARE_SIZE / 2;

  if (blink && _timer >= 800)
    return ;

  for (var i = 0; i < len; i++)
  {
    if (i != 0)
      off += drawLetterSingle(canvas, x + off + hsq, y + hsq, " ", true, colour);
    off += drawLetterSingle(canvas, x + off + hsq, y + hsq, str[i], true, colour);
  }
}

function drawStringRev(canvas: HTMLCanvasElement, x: number, y: number, s: string, colour: string = "#ffffff", blink: boolean = false)
{
  var str = s;
  var len = str.length;
  var off = 0;

  // this loop measures the length of the offset
  for (var i = 0; i < len; i++)
  {
    if (i != 0)
      off += drawLetterSingle(canvas, off, y, " ", false);
    off += drawLetterSingle(canvas, off, y, str[i], false);
  }
  // draw the number with the offset
  drawString(canvas, x - off, y, s, colour, blink);
}

function drawStringCentre(canvas: HTMLCanvasElement, y: number, s: string, colour: string = "#ffffff", blink: boolean = false)
{
  var str = s;
  var len = str.length;
  var off = 0;

  // this loop measures the length of the offset
  for (var i = 0; i < len; i++)
  {
    if (i != 0)
      off += drawLetterSingle(canvas, off, y, " ", false);
    off += drawLetterSingle(canvas, off, y, str[i], false);
  }
  // draw the number with the offset
  drawString(canvas, -off / 2, y, s, colour, blink);
}

function drawNumberSingle(canvas: HTMLCanvasElement, x: number, y: number, n: number, print: boolean)
: number
{
  var num = [ [0],
              [0],
              [0],
              [0],
              [0] ];

  switch (n)
  {
    case 0:
      num = [ [1, 1, 1],
              [1, 0, 1],
              [1, 0, 1],
              [1, 0, 1],
              [1, 1, 1] ];
      break;
    case 1:
      num = [ [1, 1, 0],
              [0, 1, 0],
              [0, 1, 0],
              [0, 1, 0],
              [1, 1, 1] ];
      break;
    case 2:
      num = [ [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1] ];
      break;
    case 3:
      num = [ [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1] ];
      break;
    case 4:
      num = [ [1, 0, 1],
              [1, 0, 1],
              [1, 1, 1],
              [0, 0, 1],
              [0, 0, 1] ];
      break;
    case 5:
      num = [ [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1] ];
      break;
    case 6:
      num = [ [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1] ];
      break;
    case 7:
      num = [ [1, 1, 1],
              [0, 0, 1],
              [0, 0, 1],
              [0, 0, 1],
              [0, 0, 1] ];
      break;
    case 8:
      num = [ [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1] ];
      break;
    case 9:
      num = [ [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1],
              [0, 0, 1],
              [0, 0, 1] ];
      break;
  }
  return (drawNumberSquares(canvas, x, y, num, print));
}

function drawNumber(canvas: HTMLCanvasElement, x: number, y: number, n: number)
{
  var str = n.toString();
  var len = str.length;
  var off = 0;
  var hsq = Pong.SQUARE_SIZE / 2;

  for (var i = 0; i < len; i++)
  {
    if (i != 0)
      off += drawNumberSingle(canvas, x + off + hsq, y + hsq, -1, true);
    off += drawNumberSingle(canvas, x + off + hsq, y + hsq, parseInt(str[i]), true);
  }
}

function drawNumberRev(canvas: HTMLCanvasElement, x: number, y: number, n: number)
{
  var str = n.toString();
  var len = str.length;
  var off = 0;

  // this loop measures the length of the offset
  for (var i = 0; i < len; i++)
  {
    if (i != 0)
      off += drawNumberSingle(canvas, x + off, y, -1, false);
    off += drawNumberSingle(canvas, x + off, y, parseInt(str[i]), false);
  }
  // draw the number with the offset
  drawNumber(canvas, x - off, y, n);
}

export function renderCanvas(canvas: HTMLCanvasElement, state: GameState, delta: number)
{
  collision(state, delta);
  _timer += delta;
  while (_timer > 1000)
    _timer -= 1000;

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
    _starburst.update(delta);
    _starburst.render(canvas);
    if (state.player1.score > state.player2.score)
      drawStringCentre(canvas, Pong.SCORE_OFFSET * 3, "PLAYER 1 WINS", "#0000ff");
    if (state.player2.score > state.player1.score)
      drawStringCentre(canvas, Pong.SCORE_OFFSET * 3, "PLAYER 2 WINS", "#0000ff");
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
    _starburst.reset();
    drawStringCentre(canvas, Pong.SCORE_OFFSET * 3, "PRESS START", "#0000ff", true);
  }
  if (state.ball.visible)
    drawSquare(canvas, state.ball.position.x, state.ball.position.y);
  // drawStringRev(canvas, -Pong.SCORE_OFFSET, 1 - Pong.SCORE_OFFSET - (Pong.SQUARE_SIZE * 2), "...");
  // drawString(canvas, Pong.SCORE_OFFSET, 1 - Pong.SCORE_OFFSET - (Pong.SQUARE_SIZE * 2), "...");
}

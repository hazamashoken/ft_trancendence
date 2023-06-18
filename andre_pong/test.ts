const SQUARE_SIDE = 0.02;

const BAT_OFFSET = 0.2;
const BAT_SPEED = 0.5;
const BAT_SIZE = 5;

const BALL_SPEED = 0.5;

const START = 1;
const PLAY = 2;
const SCORE = 3;
const END = 4;

var _batSpeedL = 0;
var _batSpeedR = 0;
var _batSpeedAdjusted = 0;
var _batPositionLX = 0;
var _batPositionRX = 0;
var _batPositionLY = 0;
var _batPositionRY = 0;
var _ballSpeedX = 0;
var _ballSpeedY = 0;
var _ballPositionX = 0;
var _ballPositionY = 0;
var _prevTime = 0;
var _state = 0;

function drawSquare(canvas: HTMLCanvasElement, x: number, y: number)
{
	var canvas2d = canvas.getContext("2d");
	var square = Math.floor(canvas.height * SQUARE_SIDE);

	if (canvas2d != null)
	{
		canvas2d.fillStyle = "#ffffff";
		canvas2d.fillRect(x, y, square, square);
	}
}

function drawBackground(canvas: HTMLCanvasElement)
{
	var canvas2d = canvas.getContext("2d");

	if (canvas2d != null)
	{
		canvas2d.fillStyle = "#000000";
		canvas2d.fillRect(0, 0, canvas.width, canvas.height);
	}
}

function drawNet(canvas: HTMLCanvasElement)
{
	var canvas2d = canvas.getContext("2d");
	var square = Math.floor(canvas.height * SQUARE_SIDE);

	if (canvas2d != null)
	{
		var middle = (canvas.width / 2) - (square / 2);
		for (var height = 0; height < canvas.height; height += square * 2)
		{
			drawSquare(canvas, middle, height);
		}
	}
}

function drawBat(canvas: HTMLCanvasElement, x: number, y: number)
{
	var canvas2d = canvas.getContext("2d");
	var square = Math.floor(canvas.height * SQUARE_SIDE);

	if (canvas2d != null)
	{
		canvas2d.fillStyle = "#ffffff";
		canvas2d.fillRect(x, y, square, square * BAT_SIZE);
	}
}

function drawBatL(canvas: HTMLCanvasElement, y: number)
{
	var canvas2d = canvas.getContext("2d");
	var square = Math.floor(canvas.height * SQUARE_SIDE);
	var height = square * BAT_SIZE;

	if (canvas2d != null)
	{
		canvas2d.fillStyle = "#ffffff";
		canvas2d.fillRect(BAT_OFFSET * canvas.height, y * (canvas.height - height), square, height);
	}
}

function drawBatR(canvas: HTMLCanvasElement, y: number)
{
	var canvas2d = canvas.getContext("2d");
	var square = Math.floor(canvas.height * SQUARE_SIDE);
	var height = square * BAT_SIZE;

	if (canvas2d != null)
	{
		canvas2d.fillStyle = "#ffffff";
		canvas2d.fillRect(canvas.width - (BAT_OFFSET * canvas.height) - square, y * (canvas.height - height), square, height);
	}
}

function drawNumberSquares(canvas: HTMLCanvasElement, x: number, y: number, num: number[][], print: boolean)
{
	var canvas2d = canvas.getContext("2d");
	var width = num[0].length;
	var height = num.length;
	var square = Math.floor(canvas.height * SQUARE_SIDE);

	if (canvas2d != null)
	{
		canvas2d.fillStyle = "#ffffff";
		for (var ys = 0; ys < height; ys++)
		{
			for (var xs = 0; xs < width; xs++)
			{
				if (print && num[ys][xs] == 1)
				{
					canvas2d.fillRect(x + (xs * square), y + (ys * square), square, square);
				}
			}
		}
	}
	return (width * square);
}

function drawNumberSingle(canvas: HTMLCanvasElement, x: number, y: number, n: number, print: boolean)
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
			num = [ [1],
					[1],
					[1],
					[1],
					[1] ];
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

	for (var i = 0; i < len; i++)
	{
		if (i != 0)
			off += drawNumberSingle(canvas, x + off, y, -1, true);
		off += drawNumberSingle(canvas, x + off, y, parseInt(str[i]), true);
	}
}

function drawNumberRev(canvas: HTMLCanvasElement, x: number, y: number, n: number)
{
	var str = n.toString();
	var len = str.length;
	var off = 0;

	for (var i = 0; i < len; i++)
	{
		if (i != 0)
			off += drawNumberSingle(canvas, x + off, y, -1, false);
		off += drawNumberSingle(canvas, x + off, y, parseInt(str[i]), false);
	}
	drawNumber(canvas, x - off, y, n);
}

function drawScoreL(canvas: HTMLCanvasElement, n: number)
{
	var canvas2d = canvas.getContext("2d");
	var square = Math.floor(canvas.height * SQUARE_SIDE);

	if (canvas2d != null)
	{
		var middle = canvas.width / 2;
		drawNumberRev(canvas, middle - (square / 2) - square, square, n);
	}
}

function drawScoreR(canvas: HTMLCanvasElement, n: number)
{
	var canvas2d = canvas.getContext("2d");
	var square = Math.floor(canvas.height * SQUARE_SIDE);

	if (canvas2d != null)
	{
		var middle = canvas.width / 2;
		drawNumber(canvas, middle + (square / 2) + square, square, n);
	}
}

function startBat(canvas: HTMLCanvasElement)
{
	var square = Math.floor(canvas.height * SQUARE_SIDE);

	_batPositionLX = BAT_OFFSET * canvas.height;
	_batPositionRX = canvas.width - square - (BAT_OFFSET * canvas.height);
	_batPositionLY = (canvas.height / 2) - (square * BAT_SIZE / 2);
	_batPositionRY = _batPositionLY;
	_batSpeedAdjusted = BAT_SPEED * canvas.height;
	_batSpeedL = 0;
	_batSpeedR = 0;
}

function startBallL(canvas: HTMLCanvasElement)
{
	var canvas2d = canvas.getContext("2d");
	var square = Math.floor(canvas.height * SQUARE_SIDE);
	var angle = Math.random() * (Math.PI / 4);

	_ballSpeedX = -Math.cos(angle) * BALL_SPEED * canvas.height;
	_ballSpeedY = Math.sin(angle) * BALL_SPEED * canvas.height;
	_ballPositionX = (canvas.width / 2) - (square * 2.5);
	_ballPositionY = (canvas.height / 2) - (square / 2);
}

function keyDown(e: KeyboardEvent)
{
	if (e.code == "ArrowUp")
	{
		_batSpeedL = -_batSpeedAdjusted;
		_batSpeedR = -_batSpeedAdjusted;
	}
	if (e.code == "ArrowDown")
	{
		_batSpeedL = _batSpeedAdjusted;
		_batSpeedR = _batSpeedAdjusted;
	}
}

function keyUp(e: KeyboardEvent)
{
	if (e.code == "ArrowUp" || e.code == "ArrowDown")
	{
		_batSpeedL = 0;
		_batSpeedR = 0;
	}
}

function clamp(num: number, min: number, max:number)
{
	if (num < min)
		return (min);
	if (num > max)
		return (max);
	return (num);
}

function ballWallCollision(canvas: HTMLCanvasElement)
{
	var square = Math.floor(canvas.height * SQUARE_SIDE);

	if (_ballPositionY < 0)
	{
		_ballPositionY = 0;
		_ballSpeedY = -_ballSpeedY;
	}
	if (_ballPositionY > (canvas.height - square))
	{
		_ballPositionY = canvas.height - square;
		_ballSpeedY = -_ballSpeedY;
	}
}

function ballBatCollision(canvas: HTMLCanvasElement)
{
	var square = Math.floor(canvas.height * SQUARE_SIDE);

	if (_ballSpeedX < 0 && _ballPositionX > _batPositionLX
		&& _ballPositionX < _batPositionLX + square
		&& _ballPositionY + square > _batPositionLY
		&& _ballPositionY - square < (_batPositionLY + BAT_SIZE * square))
	{
		_ballSpeedX = -_ballSpeedX;
	}
	if (_ballSpeedX > 0 && _ballPositionX + square > _batPositionRX
		&& _ballPositionX < _batPositionRX
		&& _ballPositionY + square > _batPositionRY
		&& _ballPositionY - square < (_batPositionRY + BAT_SIZE * square))
	{
		_ballSpeedX = -_ballSpeedX;
	}
}

function update(canvas: HTMLCanvasElement, delta: number)
{
	var square = Math.floor(canvas.height * SQUARE_SIDE);
	var limit = canvas.height - (square * BAT_SIZE);

	if (_state == START)
	{
		startBallL(canvas);
		startBat(canvas);
		_state = PLAY;
	}
	if (_state == PLAY)
	{
		_batPositionLY += (delta / 1000 * _batSpeedL);
		_batPositionLY = clamp(_batPositionLY, 0, limit);
		_batPositionRY += (delta / 1000 * _batSpeedR);
		_batPositionRY = clamp(_batPositionRY, 0, limit);

		_ballPositionX += (delta / 1000 * _ballSpeedX);
		_ballPositionY += (delta / 1000 * _ballSpeedY);
		ballWallCollision(canvas);
		ballBatCollision(canvas);
	}
}

function render(canvas: HTMLCanvasElement, delta: number)
{
	drawBackground(canvas);
	drawNet(canvas);
	drawBat(canvas, _batPositionLX, _batPositionLY);
	drawBat(canvas, _batPositionRX, _batPositionRY);
	drawSquare(canvas, _ballPositionX, _ballPositionY);
	drawScoreL(canvas, 12345);
	drawScoreR(canvas, 67890);
}

_prevTime = performance.now();
_state = START;

function loop(now: number)
{
	var canvas = <HTMLCanvasElement>document.querySelector('#pong-canvas');
	var delta = now - _prevTime;

	update(canvas, delta);
	render(canvas, delta);

	_prevTime = now;
	window.requestAnimationFrame(loop);
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
window.requestAnimationFrame(loop);

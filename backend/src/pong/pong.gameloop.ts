let _gameLoopRun = false;
let _gameLoopCallback: (delta: number) => void;
let _gameLoopPrevious: number;
let _gameLoopID: any;

export function startGameLoop(callback: (delta: number) => void) {
  if (_gameLoopRun) return;

  _gameLoopRun = true;
  _gameLoopCallback = callback;
  _gameLoopPrevious = Date.now();
  _gameLoopID = setInterval(gameLoop, 40);
}

export function stopGameLoop() {
  if (!_gameLoopRun) return;

  _gameLoopRun = false;
  clearInterval(_gameLoopID);
}

function gameLoop() {
  const now: number = Date.now();
  _gameLoopCallback(now - _gameLoopPrevious);
  _gameLoopPrevious = now;
}

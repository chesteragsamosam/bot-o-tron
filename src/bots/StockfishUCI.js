const STOCKFISH_PATH =
  'src/stockfish-windows-x86-64-avx2 (Stockfish 16)/stockfish/stockfish-windows-x86-64-avx2.exe';

const { spawn } = require('child_process');

const stockfishProcess = spawn(STOCKFISH_PATH);

const StockfishMovePromise = (moves) => {
  return new Promise((res, rej) => {
    // Listen for output from Stockfish
    stockfishProcess.stdout.on('data', (data) => {
      const message = String(data);
      // console.log('Stockfish:', message);
      if (message.includes('bestmove')) {
        const bestmoveIndex = message.indexOf('bestmove');
        let bestMove = message.slice(bestmoveIndex + 9, bestmoveIndex + 13);
        ponderMove = message.slice(bestmoveIndex + 21, bestmoveIndex + 25);
        console.log('BestMove', bestMove, ponderMove);
        if (bestmoveIndex !== -1) {
          res(bestMove);
        }
      }
    });
    // Handle errors
    stockfishProcess.on('error', (error) => {
      rej(`Error starting Stockfish: ${error.message}`);
    });
    stockfishProcess.on('exit', (error) => {
      rej(`Galing mo chester: ${error}`);
    });
  });
};
class StockfishUCI {
  getNextMove(moves) {
    StockfishMovePromise(moves.join(' ')).then((bestMove) => {
      return bestMove;
    });
  }

  getReply(chat) {
    return 'hi';
  }
}

module.exports = StockfishUCI;

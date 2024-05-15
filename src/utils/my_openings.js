const strOpeningsAsWhite = `
e2e4 e7e5 d2d4 e5d4 c2c3 d4c3 f1c4 c3b2 c1b2 d7d5 c4d5 g8f6 d5f7 e8f7 d1d8 f8b4 d8d2 b4d2 b1d2 h8e8 g1f3
e2e4 e7e5 d2d4 e5d4 c2c3 d4c3 f1c4 c3b2 c1b2 b8c6 g1f3
e2e4 e7e5 d2d4 e5d4 c2c3 b8c6 g1f3 d4c3 f1c4 c3b2 c1b2
e2e4 e7e6 d2d4 d7d5 e4e5 c7c5 c2c3 b8c6 g1f3 c8d7 f1d3 d8b6 e1g1
e2e4 e7e6 d2d4 d7d5 e4e5 c7c5 c2c3 c8d7 g1f3 b8c6 f1d3 d8b6 e1g1 c8d7
e2e4 c7c5 d2d4 c5d4 c2c3 d4c3 b1c3 b8c6 g1f3 e7e6 f1e2 g8f6 e1g1 d7d6 d1b3 f8e7 f1d1 d8c7 c1f4 c7b8
e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 g7g6 c1e3 f8g7 f2f3 e8g8 d1d2 b8c6 e1c1 d6d5 e4d5 f6d5 d4c6 b7c6
e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 g7g6 c1e3 f8g7 f2f3 e8g8 d1d2 b8c6 e1c1 c6d4 e3d4
e2e4 c7c6 d2d4 g8f6 b1c3 g7g6
e2e4 g8f6 f1c4 f6e4 c4f7 e8f7 d1h5
`;

const strOpeningsAsBlack = `
e2e4 c7c6 d2d4 d7d5
e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 g7g6 c1e3 f8g7 f2f3 e8g8 d1d2 b8c6 e1c1 d6d5 e4d5 f6d5 d4c6 b7c6
e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 g7g6 c1e3 f8g7 f2f3 e8g8 d1d2 b8c6 e1c1 c6d4 e3d4
e2e4 c7c5 d2d4 c5d4 c2c3 d4c3 b1c3
d2d4 d7d5 c2c4 c7c6 g1f3 g8f6 b1c3
d2d4 d7d5 c2c4 c7c6 g1f3 g8f6 b1c3
`;

function getMoveBaseOnMovesHistory(moves, forColor) {
  const strOpening =
    forColor === 'white' ? strOpeningsAsWhite : strOpeningsAsBlack;
  const isCompleted = strOpening.search(new RegExp('^' + moves + '$', 'm'));
  if (isCompleted !== -1) return null;
  let matchedIdx = strOpening.search(new RegExp('^' + moves, 'm'));
  if (matchedIdx !== -1) {
    let bestMove = strOpening.slice(
      matchedIdx + moves.length + 1,
      matchedIdx + moves.length + 5,
    );
    return bestMove;
  } else {
    return null;
  }
}

module.exports = { getMoveBaseOnMovesHistory };

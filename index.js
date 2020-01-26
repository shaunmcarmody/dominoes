const Board = require('./Board');
const Player = require('./Player');

const dominoes = {
  activePlayer: null,
  board: new Board(),
  playerA: new Player('Alice'),
  playerB: new Player('Bob'),
  winner: null,
  setActivePlayer(player) {
    if (player) {
      this.activePlayer = player;
    } else {
      this.activePlayer = this.activePlayer.name === this.playerA.name ? this.playerB : this.playerA;
    }
  },
  setWinner() {
    this.winner = this.activePlayer;
  },
};

console.log('\n');
initiateGame(dominoes);
console.log('\n');

function activePlayerPlays(game) {
  const { activePlayer, board } = game;
  const matchingTile = doesStockMatchEnds(board, activePlayer);
  if (matchingTile) {
    const end = handleMatchingTile(board, matchingTile);
    console.log(`${activePlayer.name} plays ${matchingTile.getAsString()} to connect to tile ${end.getAsString()} on the board`);
    board.getChainAsString();
  }
  return activePlayer;
}

function doesStockMatchEnds(board, player) {
  const { getEnds, getNewTile } = board;
  const {
    getMatchingTile, name, setAsBlocked, setAsUnblocked, setInStock,
  } = player;
  const matchingTile = getMatchingTile(...getEnds());
  if (!matchingTile) {
    setAsBlocked();
    const tile = getNewTile();
    if (!tile) {
      console.log(`${name} can't play and is unable to draw tile`);
      return tile;
    }
    setInStock(tile);
    return doesStockMatchEnds(board, player);
  }
  setAsUnblocked();
  return matchingTile;
}

function handleMatchingTile(board, tile) {
  const { getFront } = board;
  const { ends } = tile;
  if (ends.includes(getFront())) {
    return board.setFront(tile);
  }
  return board.setRear(tile);
}

function initiateGame(game) {
  setStartingParams(game);
  const { playerA, playerB, winner } = playDominoes(game);
  if (winner) {
    console.log(`Player ${winner.name} has won!`);
  } else {
    tieBreaker(playerA, playerB);
  }
}

function playDominoes(game) {
  while (game.activePlayer.totalStock > 0) {
    // if both players are blocked then break out of game
    if (game.playerA.blocked && game.playerB.blocked) break;
    const activePlayer = activePlayerPlays(game);
    const { totalStock } = activePlayer;

    if (totalStock > 0) {
      game.setActivePlayer();
    } else {
      game.setWinner();
    }
  }
  return game;
}


function setStartingParams(game) {
  for (let i = 0; i < 7; i += 1) {
    game.playerA.setInStock(game.board.getNewTile());
    game.playerB.setInStock(game.board.getNewTile());
  }
  game.board.setInitialTile();
  game.setActivePlayer(game.playerA);
  console.log(`Game starting with first tile: ${game.board.front.getAsString()}`);
}

function tieBreaker(playerA, playerB) {
  const playerASum = playerA.getTotalRemainingTiles();
  const playerBSum = playerB.getTotalRemainingTiles();
  console.log(`${playerA.name} has remaining tiles with a combined value of ${playerASum} left on the board`);
  console.log(`${playerB.name} has remaining tiles with a combined value of ${playerBSum} left on the board`);
  if (playerASum === playerBSum) {
    console.log('Match ends draw!');
  } else {
    console.log(`Player ${playerASum < playerBSum ? playerA.name : playerB.name} has won!`);
  }
}
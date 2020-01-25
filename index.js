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

function playGame(game) {
  while (game.activePlayer.totalStock > 0) {
    const { activePlayer, board } = game;
    const matchingTile = doesStockMatchEnds(board, activePlayer);
    if (matchingTile) {
      const end = handleMatchingTile(board, matchingTile);
      console.log(`${activePlayer.name} plays ${matchingTile.getAsString()} to connect to tile ${end.getAsString()} on the board`);
      board.getChainAsString();
    } else {
      const { playerA, playerB } = game;
      if (playerA.blocked && playerB.blocked) {
        break;
      }
    }

    if (activePlayer.totalStock === 0) {
      game.setWinner();
    } else {
      game.setActivePlayer();
    }
  }
  const { playerA, playerB, winner } = game;
  if (winner) {
    console.log(`Player ${winner.name} has won!`);
  } else {
    tieBreaker(playerA, playerB);
  }
}

setStartingParams(dominoes);
playGame(dominoes);
console.log('\n');

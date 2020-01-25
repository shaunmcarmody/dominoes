const Tile = require('./Tile');

class Board {
  constructor(stock = [], chain = [], front = null, rear = null) {
    this.stock = stock;
    this.chain = chain;
    this.front = front;
    this.rear = rear;
    this.setStock();
  }

  getChainAsString = () => {
    let chain = '';
    this.chain.forEach((el) => {
      chain += `<${el.ends[0]}:${el.ends[1]}> `;
    });
    console.log(`Board is now: ${chain}`);
  }

  getEnds = () => {
    return [
      this.getFront(),
      this.getRear(),
    ];
  }

  getFront = () => {
    return this.front.ends[0];
  }

  getNewTile = () => {
    const count = this.stock.length;
    if (count > 0) {
      const i = Math.floor(Math.random() * count);
      const tile = this.stock[i];
      this.stock = [...this.stock.slice(0, i), ...this.stock.slice(i + 1)];
      return tile;
    }
    return false;
  }

  getRear = () => {
    return this.rear.ends[1];
  }

  setFront = (tile) => {
    const { front } = this;
    const { ends } = front;
    if (ends[0] === tile.ends[0]) {
      tile.setRotatedEnds();
    }
    this.chain.unshift(tile);
    this.front = tile;
    return front;
  }

  setInitialTile = () => {
    const tile = this.getNewTile();
    this.chain.push(tile);
    this.front = tile;
    this.rear = tile;
  }

  setRear = (tile) => {
    const { rear } = this;
    const { ends } = rear;
    if (ends[1] === tile.ends[1]) {
      tile.setRotatedEnds();
    }
    this.chain.push(tile);
    this.rear = tile;
    return rear;
  }

  setStock = () => {
    for (let i = 0; i < 7; i += 1) {
      for (let j = 0; j < i + 1; j += 1) {
        const tile = new Tile(j, i);
        this.stock.push(tile);
      }
    }
  }
}

module.exports = Board;

class Player {
  constructor(name, stock = [], totalStock = 0, blocked = false) {
    this.name = name;
    this.stock = stock;
    this.totalStock = totalStock;
    this.blocked = blocked;
  }

  getFromStock = (i) => {
    const tile = this.stock[i];
    this.stock = [...this.stock.slice(0, i), ...this.stock.slice(i + 1)];
    this.totalStock -= 1;
    return tile;
  }

  getMatchingTile = (front, rear) => {
    for (let i = 0; i < this.stock.length; i += 1) {
      const { ends } = this.stock[i];
      if (ends.includes(front) || ends.includes(rear)) {
        return this.getFromStock(i);
      }
    }
    return false;
  }

  getTotalRemainingTiles = () => {
    let total = 0;
    for (let i = 0; i < this.stock.length; i += 1) {
      const [left, right] = this.stock[i].ends;
      total += left + right;
    }
    return total;
  }

  setAsBlocked = () => {
    if (!this.blocked) {
      this.blocked = true;
    }
  }

  setAsUnblocked = () => {
    if (this.blocked) {
      this.blocked = false;
    }
  }

  setInStock = (tile) => {
    this.stock.push(tile);
    this.totalStock += 1;
  }
}

module.exports = Player;

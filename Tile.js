class Tile {
  constructor(...args) {
    this.ends = args;
  }

  getAsString = () => {
    return `<${this.ends[0]}:${this.ends[1]}>`;
  }

  setRotatedEnds = () => {
    this.ends.reverse();
  }
}

module.exports = Tile;

module.exports.numberToAddress = (row, column) => {
    let columnName = '';
    while (column > 0) {
      const remainder = (column - 1) % 26;
      columnName = String.fromCharCode('A'.charCodeAt(0) + remainder) + columnName;
      column = Math.floor((column - 1) / 26);
    }
    return columnName + row.toString();
}

module.exports.addressToNumber = (index) => {
  var match = index.match(/([A-Z]+)(\d+)/);
  if (!match) {
   // throw new Error('Invalid Excel index format');
   index="A"+index
   match = index.match(/([A-Z]+)(\d+)/);
  }
  const [, letters, number] = match;
  const column = letters.split('').reduce((acc, letter) => acc * 26 + (letter.charCodeAt(0) - 'A'.charCodeAt(0) + 1), 0);
  const row = parseInt(number, 10);
  return { col : column, row : row };
}
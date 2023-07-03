class Solver {
  // ---- Start SUDOKU SOLVER
  indexToRowCol(index) {
    return { row: Math.floor(index / 9), col: index % 9 }
  }
  rowColToIndex(row, col) { return (row * 9 + col) }
  acceptable(board, index, value) {
    let { row, col } = this.indexToRowCol(index)
    for (let r = 0; r < 9; ++r) {
      if (board[this.rowColToIndex(r, col)] == value) return false
    }
    for (let c = 0; c < 9; ++c) {
      if (board[this.rowColToIndex(row, c)] == value) return false
    }

    let r1 = Math.floor(row / 3) * 3
    let c1 = Math.floor(col / 3) * 3
    for (let r = r1; r < r1 + 3; ++r) {
      for (let c = c1; c < c1 + 3; ++c) {
        if (board[this.rowColToIndex(r, c)] == value) return false
      }
    }
    return true
  }
  getChoices(board, index) {
    let choices = []
    for (let value = 1; value <= 9; ++value) {
      if (this.acceptable(board, index, value)) {
        choices.push(value)
      }
    }
    return choices
  }
  bestBet(board) {
    let index, moves, bestLen = 100
    for (let i = 0; i < 81; ++i) {
      if (!board[i]) {
        let m = this.getChoices(board, i)
        if (m.length < bestLen) {
          bestLen = m.length
          moves = m
          index = i
          if (bestLen == 0) break
        }
      }
    }
    return { index, moves }
  }
  solveSudoku(bb) {
    let { index, moves } = this.bestBet(bb)
    if (index == null) return true
    for (let m of moves) {
      bb[index] = m
      if (this.solveSudoku(bb)) return bb
    }
    bb[index] = 0
    return false
  }
  // ---- End SUDOKU SOLVER
}

class SudokuSolver extends Solver {

  validate(puzzleString) {

  }

  letterToNumber(row) {
    switch (row.toUpperCase()) {
      case 'A': return 1
      case 'B': return 2
      case 'C': return 3
      case 'D': return 4
      case 'E': return 5
      case 'F': return 6
      case 'G': return 7
      case 'H': return 8
      case 'I': return 9
      default: return 'none'
    }
  }

  checkColPlacement(puzzleString, row, col, value) {
    row = this.letterToNumber(row);
    let board = this.transform_string2array(puzzleString)
    if (board[this.rowColToIndex(row - 1, col - 1)] == value) return true
    for (let r = 0; r < 9; ++r) {
      if (board[this.rowColToIndex(r, col - 1)] == value) return false
    }
    return true
  }

  checkRowPlacement(puzzleString, row, col, value) {
    row = this.letterToNumber(row);
    let board = this.transform_string2array(puzzleString)
    if (board[this.rowColToIndex(row - 1, col - 1)] == value) return true
    for (let c = 0; c < 9; ++c) {
      if (board[this.rowColToIndex(row - 1, c)] == value) return false
    }
    return true
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    row = this.letterToNumber(row);
    let board = this.transform_string2array(puzzleString)
    if (board[this.rowColToIndex(row - 1, col - 1)] == value) return true
    let r1 = Math.floor(row / 3) * 3
    let c1 = Math.floor(col / 3) * 3
    for (let r = r1; r < r1 + 3; ++r) {
      for (let c = c1; c < c1 + 3; ++c) {
        if (board[this.rowColToIndex(r, c)] == value) return false
      }
    }
    return true
  }

  solve(puzzleString) {
    let validChars = /^[1-9.]+$/
    if (!validChars.test(puzzleString)) { return false }

    let arrayBoard = this.transform_string2array(puzzleString)
    let solvedAnswer = this.solveSudoku(arrayBoard)
    return solvedAnswer ? this.transform_array2string(solvedAnswer) : false
  }

  transform_string2array(string) {
    // '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
    // ^--- to [1, 0, 5, 0, 0, 2, 0, 8, 4, 0, 0, ... ]
    return Array.from(string).map(z => z == '.' ? 0 : parseInt(z))
  }
  transform_array2string(grid) {
    // [1, 0, 5, 0, 0, 2, 0, 8, 4, 0, 0, ... ]
    // ^--- to '105002084006301207020050000090010000802036740307020090470008001001600009269140370'
    return grid.join('')
  }

}

module.exports = SudokuSolver

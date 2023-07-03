'use strict'

const SudokuSolver = require('../controllers/sudoku-solver.js')

module.exports = function (app) {
  let solver = new SudokuSolver()

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' })
    }
    const row = coordinate.split('')[0]
    const column = coordinate.split('')[1]

    let isValidCoordinate = (coordinate.length !== 2 || !(/[a-i]/i.test(row)) || !(/[1-9]/i.test(column)))
    if (isValidCoordinate) {
      return res.json({ error: 'Invalid coordinate' })
    }
    let isValueInRange = (value >= 1 && value <= 9)
    if (!isValueInRange) {
      res.json({ error: "Invalid value" });
      return;
    }
    if (puzzle.length != 81) {
      return res.json({ error: 'Expected puzzle to be 81 characters long' })
    }
    if (/[^0-9.]/g.test(puzzle)) {
      return res.json({ error: 'Invalid characters in puzzle' })
    }

    let validCol = solver.checkColPlacement(puzzle, row, column, value)
    let validReg = solver.checkRegionPlacement(puzzle, row, column, value)
    let validRow = solver.checkRowPlacement(puzzle, row, column, value)
    let conflicts = []
    if (validCol && validRow && validReg) {
      res.json({ valid: true })
    } else {
      if (!validRow) {
        conflicts.push('row')
      }
      if (!validCol) {
        conflicts.push('column')
      }
      if (!validReg) {
        conflicts.push('region')
      }
      res.json({ valid: false, conflict: conflicts })
    }
  })

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body
    if (!puzzle) {
      return res.json({ error: 'Required field missing' })
    }
    if (puzzle.length != 81) {
      return res.json({ error: 'Expected puzzle to be 81 characters long' })
    }
    if (/[^0-9.]/g.test(puzzle)) {
      return res.json({ error: 'Invalid characters in puzzle' })
    }
    let solvedString = solver.solve(puzzle)
    if (!solvedString) {
      res.json({ error: 'Puzzle cannot be solved' })
    } else {
      res.json({ solution: solvedString })
    }

  })
}

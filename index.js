const blackHorseCode = '&#x265E'
let moveCount = 0
let tableLinesSize = 8
let isCleared = true

const templateCell = document.getElementsByTagName('td')[0]
const tableElement = document.getElementsByTagName('table')[0]
const tableBodyElement = document.getElementsByTagName('tbody')[0]
templateCell.parentElement.remove()

function generateTableLines() {
  const size = Number(document.getElementById("table-rows").value) + 1
  
  if (size > 0) {
    tableBodyElement.innerHTML = ''
  }

  tableElement.appendChild(tableBodyElement)

  tableLinesSize = Number(document.getElementById("table-rows").value)

  for (let i = 0; i < tableLinesSize; i++) {
    const newLine = document.createElement('tr')
    tableBodyElement.appendChild(newLine)
  }
  generateTableColumns()
}

function generateTableColumns() {
  const size = Number(document.getElementById("table-columns").value)
  const lines = Number(document.getElementById("table-rows").value)

  for (let i = 0; i < lines; i++) {
    const targetLine = document.getElementsByTagName('tr')[i]

    for (let j = 0; j < size; j++) {
      if (i % 2 === 0 && j % 2 === 0) {
        const newCell = document.createElement('td')
        newCell.setAttribute('id', `${i}-${j}`)
        newCell.setAttribute('class', 'white')
        newCell.setAttribute('onclick', 'moveHorse(event)')
        targetLine.appendChild(newCell)
      } else if (i % 2 !== 0 && j % 2 === 0) {
        const newCell = document.createElement('td')
        newCell.setAttribute('id', `${i}-${j}`)
        newCell.setAttribute('class', 'black')
        newCell.setAttribute('onclick', 'moveHorse(event)')
        targetLine.appendChild(newCell)
      } else if (i % 2 === 0 && j % 2 !== 0) {
        const newCell = document.createElement('td')
        newCell.setAttribute('id', `${i}-${j}`)
        newCell.setAttribute('class', 'black')
        newCell.setAttribute('onclick', 'moveHorse(event)')
        targetLine.appendChild(newCell)
      } else {
        const newCell = document.createElement('td')
        newCell.setAttribute('id', `${i}-${j}`)
        newCell.setAttribute('class', 'white')
        newCell.setAttribute('onclick', 'moveHorse(event)')
        targetLine.appendChild(newCell)
      }
    }
  }
}

generateTableLines()

function loadPositions() {
  const cells = document.getElementsByTagName('td')
  let line = 1

  const columnsMax = Number(document.getElementById("table-columns").value)
  const tableTotal = columnsMax * Number(document.getElementById("table-rows").value)

  const positions = {}

  let columns = []

  for (let i = 1; i <= tableTotal; i++) {
    columns.push(cells.item(i - 1))

    if (i % columnsMax === 0) {
      positions[line] = columns
      line++
      columns = []
    }
  }

  return positions
}

const cells = document.getElementsByTagName('td')

function getPossibleMoves(line, column) {
  const positions =  loadPositions();
  const lineMax = Number(document.getElementById("table-rows").value)
  const columnsMax = Number(document.getElementById("table-columns").value)
  let possibleMoves = []

  // CC
  if (line > 2) {
    // E
    if (column > 1 && positions[line - 2][column - 2].innerHTML === '') {
      possibleMoves.push(positions[line - 2][column - 2])
    }

    // D
    if (column < columnsMax && positions[line - 2][column].innerHTML === '') {
      possibleMoves.push(positions[line - 2][column])
    }
  }

  // BB
  if (line < lineMax - 1) {
    // E
    if (column > 1 && positions[line + 2][column - 2].innerHTML === '') {
      possibleMoves.push(positions[line + 2][column - 2])
    }

    // D
    if (column < columnsMax && positions[line + 2][column].innerHTML === '') {
      possibleMoves.push(positions[line + 2][column])
    }
  }

  // EE
  if (column > 2) {
    // C
    if (line > 1 && positions[line - 1][column - 3].innerHTML === '') {
      possibleMoves.push(positions[line - 1][column - 3])
    }

    // B
    if (line < lineMax && positions[line + 1][column - 3].innerHTML === '') {
      possibleMoves.push(positions[line + 1][column - 3])
    }
  }

  // DD
  if (column < columnsMax - 1) {
    // C
    if (line > 1 && positions[line - 1][column + 1].innerHTML === '') {
      possibleMoves.push(positions[line - 1][column + 1])
    }

    // B
    if (line < lineMax && positions[line + 1][column + 1].innerHTML === '') {
      possibleMoves.push(positions[line + 1][column + 1])
    }
  }

  return possibleMoves
}

function showPossibleMoves(possibleMoves) {
  for (let i = 0; i < possibleMoves.length; i++) {
    possibleMoves[i].classList.add('possible')
  }
}

function clearPossibleMoves() {
  const cells = document.getElementsByTagName('td')

  for (let i = 0; i < cells.length; i++) {
    cells.item(i).classList.remove('possible')
  }
}

function clearTable() {
  generateTableLines()
  moveCount = 0
  isCleared = true
}

function moveHorse(e) {
  let contador = 0
  let line = 1
  let column = 1

  const columnsMax = Number(document.getElementById("table-columns").value)

  if (isCleared) {
    e.target.innerHTML = blackHorseCode

    for (cell of cells) {
      if (cell.innerHTML === '♞') {
        break
      } else {
        contador++
        
        if (column + 1 > columnsMax) {
          column = 1
        } else {
          column++
        }
  
        if (contador % columnsMax === 0) {
          line++
        }
      }
    }
  
    const possibleMoves = getPossibleMoves(line, column)
    showPossibleMoves(possibleMoves)
    isCleared = false
  } else {
    for (cell of cells) {
      if (cell.innerHTML === '♞') {
        break
      } else {
        contador++
        
        if (column + 1 > columnsMax) {
          column = 1
        } else {
          column++
        }
  
        if (contador % columnsMax === 0) {
          line++
        }
      }
    }
  
    const possibleMoves = getPossibleMoves(line, column)
    const targetCell = possibleMoves.find(cell => cell === e.target) 
    const positions = loadPositions() 
  
    if (targetCell) {
      moveCount++
      positions[line][column - 1].classList.add('moved')
      positions[line][column - 1].innerHTML = `${moveCount}`
      targetCell.innerHTML = '♞'
    }
  
    line = 1
    column = 1
  
    for (cell of cells) {
      if (cell.innerHTML === '♞') {
        break
      } else {
        contador++
        
        if (column + 1 > columnsMax) {
          column = 1
          line++
        } else {
          column++
        }
      }
    }
  
    clearPossibleMoves()
  
    const newPossibleMoves = getPossibleMoves(line, column)
    showPossibleMoves(newPossibleMoves)

    if (newPossibleMoves.length === 0) {
      const lineMax = Number(document.getElementById("table-rows").value)
      const columnsMax = Number(document.getElementById("table-columns").value)
      const tableTotal = lineMax * columnsMax
      console.log(moveCount)
      console.log(tableTotal)

      if (moveCount >= tableTotal - 1) {
        console.log('entrou aqui')
        const messageElement = document.getElementsByTagName('p')[0]

        messageElement.innerText = 'Você venceu!'
      } else {
        console.log('entrou aqui no lose')
        const messageElement = document.getElementsByTagName('p')[0]

        messageElement.innerText = 'Você perdeu!'
      }
    }
  }
}
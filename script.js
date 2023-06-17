// Word sets for each level
const wordSets = [
  ['WORD', 'SEARCH', 'GAME'],
  ['OPEN', 'AI', 'GPT'],
  ['DEVELOPER', 'PROGRAMMER', 'CODING'],
  ['PUZZLE', 'CHALLENGE', 'BRAIN'],
];

const ROW_DIRECTIONS = [-1, -1, 0, 1, 1, 1, 0, -1];
const COL_DIRECTIONS = [0, 1, 1, 1, 0, -1, -1, -1];

let currentLevel = 0; // Current level index
let wordsToFind = wordSets[currentLevel]; // Words to find in the current level
let foundWords = []; // Found words in the current level
let wordSearchGrid; // Word search grid for the current level (will be initialized later)
let selectedCells = []; // Track selected cells to form a word
let selectedWordString = ''; // Store the selected word string
let roundEnded = false;

// Function to generate the word search grid
function generateWordSearchGrid(wordSet) {
  const grid = [];

  // Generate an empty grid
  for (let row = 0; row < 15; row++) {
    const rowArray = [];
    for (let col = 0; col < 15; col++) {
      rowArray.push('');
    }
    grid.push(rowArray);
  }

  // Place the words in the grid
  for (const word of wordSet) {
    let wordPlaced = false;

    while (!wordPlaced) {
      const randomRowIndex = Math.floor(Math.random() * 15);
      const randomColIndex = Math.floor(Math.random() * 15);
      const randomDirectionIndex = Math.floor(Math.random() * ROW_DIRECTIONS.length);
      const direction = [ROW_DIRECTIONS[randomDirectionIndex], COL_DIRECTIONS[randomDirectionIndex]];

      if (isWordPlaceable(grid, word, randomRowIndex, randomColIndex, direction)) {
        placeWordInGrid(grid, word, randomRowIndex, randomColIndex, direction);
        wordPlaced = true;
      }
    }
  }

  // Fill empty cells with random letters
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = getRandomLetter();
      }
    }
  }

  return grid;
}

// Function to generate a random letter
function getRandomLetter() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomIndex = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
}

// Function to check if a word can be placed in a specific position
function isWordPlaceable(grid, word, rowIndex, colIndex, direction) {
  const wordLength = word.length;
  const [rowDirection, colDirection] = direction;

  // Check if the word can be placed within the boundaries of the grid
  const lastRow = rowIndex + rowDirection * (wordLength - 1);
  const lastCol = colIndex + colDirection * (wordLength - 1);
  if (lastRow < 0 || lastRow >= 15 || lastCol < 0 || lastCol >= 15) {
    return false;
  }

  // Check if the word conflicts with existing letters in the grid
  for (let i = 0; i < wordLength; i++) {
    const currentRow = rowIndex + rowDirection * i;
    const currentCol = colIndex + colDirection * i;

    if (grid[currentRow][currentCol] !== '' && grid[currentRow][currentCol] !== word.charAt(i)) {
      return false;
    }
  }

  return true;
}

// Function to place a word in the grid
function placeWordInGrid(grid, word, rowIndex, colIndex, direction) {
  const [rowDirection, colDirection] = direction;

  for (let i = 0; i < word.length; i++) {
    const currentRow = rowIndex + rowDirection * i;
    const currentCol = colIndex + colDirection * i;

    grid[currentRow][currentCol] = word.charAt(i);
  }
}

// Function to render the word search grid
function renderWordSearchGrid(grid) {
  const gridContainer = document.getElementById('gridContainer');
  gridContainer.innerHTML = '';

  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.textContent = grid[row][col];
      gridContainer.appendChild(cell);
    }
  }

  // Add event listener to the grid container
  gridContainer.addEventListener('click', handleCellClick);
}

// Function to handle click event on cells
function handleCellClick(event) {
  const clickedCell = event.target;

  if (roundEnded) {
    return; // Ignore clicks if the round has ended
  }

  // Check if the clicked cell is within the grid boundaries
  if (!clickedCell.classList.contains('cell')) {
    return; // Ignore clicks outside the grid
  }

  // Check if the clicked cell is already highlighted with yellow
  if (clickedCell.classList.contains('highlight')) {
    clickedCell.classList.remove('highlight');
    const index = selectedCells.findIndex(cell => cell === clickedCell);
    if (index !== -1) {
      selectedCells.splice(index, 1);
    }
  } else if (!clickedCell.classList.contains('confirmed')) { // Check if the cell is not confirmed (highlighted green)
    // Check if the clicked cell is adjacent to the previously clicked cells
    const isAdjacent = selectedCells.some(cell => {
      const rowDiff = Math.abs(cell.dataset.row - clickedCell.dataset.row);
      const colDiff = Math.abs(cell.dataset.col - clickedCell.dataset.col);
      return (rowDiff <= 1 && colDiff <= 1);
    });

    if (!isAdjacent) {
      // Clicked cell is not adjacent to the highlighted cells
      for (const cell of selectedCells) {
        cell.classList.remove('highlight');
      }
      selectedCells = [];
      selectedWordString = '';
    }

    clickedCell.classList.add('highlight');
    selectedCells.push(clickedCell);
  }

  // Update the selected word string
  const selectedWord = selectedCells.map(cell => cell.textContent).join('');
  selectedWordString += selectedWord; // Concatenate the selected word to the string

  // Log the selected word string
  console.log('Selected Word:', selectedWordString);
  console.log('Selected Word:', selectedCells.map(cell => cell.textContent));

  // Check if the selected word string matches any word in the word set
  if (wordsToFind.includes(selectedWordString)) {
    // Valid word found
    foundWords.push(selectedWordString);
    renderFoundWords();

    for (const cell of selectedCells) {
      console.log('Selected Word is valid');
      cell.classList.add('confirmed');
      cell.classList.remove('highlight');
    }

    // Clear the selected cells array
    selectedCells = [];
    checkGameStatus();
  }
  // Reset the selected word string
  selectedWordString = '';
  event.stopPropagation();
}

function removeHighlight() {
  for (const cell of selectedCells) {
    cell.classList.remove('highlight');
  }
}

// Function to render the found words
function renderFoundWords() {
  const ulFoundWords = document.getElementById('foundWords');
  ulFoundWords.innerHTML = '';

  for (const word of foundWords) {
    const li = document.createElement('li');
    li.textContent = word;
    ulFoundWords.appendChild(li);
  }
}

// Function to check the game status
function checkGameStatus() {
  if (foundWords.length === wordsToFind.length) {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('hidden');
    roundEnded = true;
    document.removeEventListener('click', handleCellClick);
	
	// Enable the submit button
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = false;
	} else {
    // Disable the submit button
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;
	}
}


// Function to update the level indicator
function updateLevelIndicator() {
  const levelIndicator = document.getElementById('level');
  levelIndicator.textContent = `Level: ${currentLevel + 1}`;
}

// Function to initialize the game
function initializeGame() {
  wordSearchGrid = generateWordSearchGrid(wordsToFind);
  updateLevelIndicator();
  renderWordSearchGrid(wordSearchGrid);
  renderFoundWords();
  document.addEventListener('click', handleCellClick);
}

// Function to change the level
function changeLevel() {
  currentLevel = (currentLevel + 1) % wordSets.length;
  wordsToFind = wordSets[currentLevel];
  foundWords = [];
  selectedCells = [];
  const successMessage = document.getElementById('successMessage');
  successMessage.classList.add('hidden');
  updateLevelIndicator();
  initializeGame();
}

// Function to handle the submit button click event
function handleSubmitButtonClick() {
  changeLevel();
}

// Initialize the game
initializeGame();

// Add event listener to the submit button
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', handleSubmitButtonClick);
submitButton.disabled = true;

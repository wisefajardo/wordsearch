// Word sets for each level
const MAX_WORDS_PER_SET = 30; // Maximum number of words per word set
const wordSets = [[]]; // Array to store word sets

const ROW_DIRECTIONS = [-1, -1, 0, 1, 1, 1, 0, -1];
const COL_DIRECTIONS = [0, 1, 1, 1, 0, -1, -1, -1];

let currentLevel = 0; // Current level index
let wordsToFind = wordSets[currentLevel]; // Words to find in the current level
let foundWords = []; // Found words in the current level
let wordSearchGrid; // Word search grid for the current level (will be initialized later)
let selectedCells = []; // Track selected cells to form a word
let selectedWordString = ''; // Store the selected word string
let roundEnded = false;

function getWordSet(){
	// Function to handle the submit button click event
function handleSubmitButtonClick() {
  const inputField = document.getElementById('wordInput');
  const newWordSetButton = document.getElementById('newWordSetButton');
  const startGameButton = document.getElementById('startGameButton');
  const word = inputField.value.trim().toUpperCase();
  if (word === '') {
    return;
  }
  
  // Add the word to the current word set if it's not already present
  const currentWordSet = wordSets[wordSets.length - 1];
  if (!currentWordSet.includes(word)) {
	currentWordSet.push(word);
  } else {
    console.log('Word is already in the list.');
  }

  //Check if there is at least one word in the word set and enable the start game button if true
  if (wordSets[wordSets.length - 1].length > 0) {
    startGameButton.disabled = false;
	newWordSetButton.disabled = false;
  }else{
	  //Disable the start game button if there are no words in the word set
	  startGameButton.disabled = true;
	  newWordSetButton.disabled = true;
  }


  // Clear the input field
  inputField.value = '';

  // Render the word set as a list
  renderWordSet(currentWordSet);

  // Disable input field if the word set limit is reached
  if (currentWordSet.length >= MAX_WORDS_PER_SET) {
    inputField.disabled = true;
  }
   // Render all word sets
  renderAllWordSets();
}

// Function to handle the start game button click event
function handleStartGameButtonClick() {
  if (wordSets[wordSets.length - 1].length > 0) {
    // Hide the input field and buttons
    const wordInputContainer = document.getElementById('wordInputContainer');
    wordInputContainer.classList.add('hidden');


	const wordSetsLabel = document.getElementById('wordSetsLabel');
    wordSetsLabel.classList.add('hidden');

    // Display the word sets as lists
    const wordSetsContainer = document.getElementById('wordSetsContainer');
    wordSetsContainer.classList.add('hidden');
    renderAllWordSets();

    // Show the level, grid, and found words
    const levelContainer = document.getElementById('levelContainer');
    levelContainer.classList.remove('hidden');

    const gridContainer = document.getElementById('gridContainer');
    gridContainer.classList.remove('hidden');

    const foundWordsContainer = document.getElementById('foundWordsContainer');
    foundWordsContainer.classList.remove('hidden');

  currentLevel = 0;
	wordsToFind = wordSets[currentLevel];
	console.log('Word set:',wordsToFind);
    // Initialize the game
    initializeGame();
  } else {
    console.log('Please enter at least one word set before starting the game.');
  }
}


// Function to render a word set as a list
function renderWordSet(wordSet) {
  const wordSetsContainer = document.getElementById('wordSetsContainer');
  wordSetsContainer.classList.remove("hidden");

  // Create a new list element
  const list = document.createElement('ul');
  list.classList.add('word-set');

  // Create list items for each word
  for (const word of wordSet) {
    const listItem = document.createElement('li');
    listItem.textContent = word;
    list.appendChild(listItem);
  }

  // Append the list to the container
  wordSetsContainer.appendChild(list);
}

// Function to render all word sets
function renderAllWordSets() {
  const wordSetsContainer = document.getElementById('wordSetsContainer');

  // Clear the container
  wordSetsContainer.innerHTML = '';

  // Render each word set as a list
  for (let i = 0; i < wordSets.length; i++) {
    const wordSet = wordSets[i];
    const setNumber = i + 1;

    // Create a new list element
    const list = document.createElement('ul');
    list.classList.add('word-set');

    // Create list items for each word
    for (const word of wordSet) {
      const listItem = document.createElement('li');
      listItem.textContent = word;
	  
	  // Add event listener to each word item
      listItem.addEventListener('click', function () {
  if (!listItem.querySelector('input')) {
    const originalWord = listItem.textContent; // Store the original word value
    const currentWordSet = wordSets[i]; // Store the current wordSet array

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = originalWord;

    inputElement.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        const newWord = inputElement.value.toUpperCase(); // Convert to uppercase
        if (newWord === '') {
          // If input value is empty, remove the list item and update the wordSets array
          listItem.parentNode.removeChild(listItem);
          const wordIndex = currentWordSet.indexOf(originalWord);
          if (wordIndex !== -1) {
            currentWordSet.splice(wordIndex, 1);
          }
        } else if (newWord !== originalWord && !currentWordSet.includes(newWord)) {
          // If the new word is different and does not exist in the word set
          listItem.textContent = newWord;
          const wordIndex = currentWordSet.indexOf(originalWord);
          if (wordIndex !== -1) {
            currentWordSet[wordIndex] = newWord;
          }
          // Add your logic to update the string or perform other actions with the new value
        }
      }
    });

    // Replace the list item content with the input element
    listItem.textContent = '';
    listItem.appendChild(inputElement);
    inputElement.focus();
  }
      });
	  
      list.appendChild(listItem);
    }

    // Create a list item for the set number indicator
    const setIndicator = document.createElement('li');
    setIndicator.classList.add('set-indicator');
    setIndicator.textContent = `Set ${setNumber}`;
	setIndicator.style.fontWeight = 'bold';

    // Append the set number indicator and the list to the container
    wordSetsContainer.appendChild(setIndicator);
    wordSetsContainer.appendChild(list);
  }
}

// Function to handle the enter key press event in the input field
function handleInputFieldKeyPress(event) {
  if (event.key === 'Enter') {
    handleSubmitButtonClick();
  }
}

// Function to handle the create new word set button click event
function handleNewWordSetButtonClick() {
	
	if (wordSets[wordSets.length - 1].length <= 0) {
		console.log('Please enter at least one word set before creating another word set');
		return;
	}
	
  // Create a new empty word set
  wordSets.push([]);

  // Clear the input field and enable it
  const inputField = document.getElementById('wordInput');
  inputField.value = '';
  inputField.disabled = false;

  // Hide the word sets container
  const wordSetsContainer = document.getElementById('wordSetsContainer');
  wordSetsContainer.classList.add('hidden');

  // Show the input field and buttons
  const wordInputContainer = document.getElementById('wordInputContainer');
  wordInputContainer.classList.remove('hidden');

  // Focus on the input field
  inputField.focus();

  // Render the new word set
  renderWordSet(wordSets[wordSets.length - 1]);

  // Render all word sets (including the new set)
  renderAllWordSets();
}

// Add event listeners to the buttons and input field
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', handleSubmitButtonClick);
submitButton.disabled = false;

const startGameButton = document.getElementById('startGameButton');
startGameButton.addEventListener('click', handleStartGameButtonClick);

const inputField = document.getElementById('wordInput');
inputField.addEventListener('keypress', handleInputFieldKeyPress);

const newWordSetButton = document.getElementById('newWordSetButton');
newWordSetButton.addEventListener('click', handleNewWordSetButtonClick);
}

// Function to generate the word search grid
function generateWordSearchGrid(wordSet) {
  const gridSize = 12; // Size of the grid (12x12)
  const cellSize = 40; // Adjust the size of the cells as needed
  const gridContainer = document.getElementById("gridContainer");
  gridContainer.innerHTML = ''; // Clear any existing grid cells

  const grid = [];

  // Generate an empty grid
  for (let row = 0; row < gridSize; row++) {
    const rowArray = [];
    for (let col = 0; col < gridSize; col++) {
      rowArray.push('');
    }
    grid.push(rowArray);
  }

  // Place the words in the grid
  for (const word of wordSet) {
    let wordPlaced = false;

    while (!wordPlaced) {
      const randomRowIndex = Math.floor(Math.random() * gridSize);
      const randomColIndex = Math.floor(Math.random() * gridSize);
      const randomDirectionIndex = Math.floor(Math.random() * ROW_DIRECTIONS.length);
      const direction = [ROW_DIRECTIONS[randomDirectionIndex], COL_DIRECTIONS[randomDirectionIndex]];

      if (isWordPlaceable(grid, word, randomRowIndex, randomColIndex, direction)) {
        placeWordInGrid(grid, word, randomRowIndex, randomColIndex, direction);
        wordPlaced = true;
      }
    }
  }

  // Fill empty cells with random letters
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = getRandomLetter();
      }
    }
  }

  // Generate the grid cells and append them to the grid container
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.style.width = cellSize + "px";
      cell.style.height = cellSize + "px";
      gridContainer.appendChild(cell);
    }
  }

  // Adjust the grid-template-columns property of the word-search class
  const wordSearch = document.querySelector(".word-search");
  wordSearch.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;

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
  if (lastRow < 0 || lastRow >= 12 || lastCol < 0 || lastCol >= 12) {
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

  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 12; col++) {
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

// Function to getAdjacent letter
function getNextLetter(row, col, direction) {
  const [rowDirection, colDirection] = direction;

  const nextRow = row + rowDirection;
  const nextCol = col + colDirection;

  // Check if the next cell is within the boundaries of the grid
  if (nextRow >= 0 && nextRow < 12 && nextCol >= 0 && nextCol < 12) {
    const nextCell = wordSearchGrid[nextRow][nextCol];
	console.log("row ", row);
	console.log("col ", col);
	console.log("next cell ", nextCell);
    return nextCell;
  }

  return null;
}

// Function to handle click event on cells
function handleCellClick(event) {
  const clickedCell = event.target;
  let direction;
  
  const isAdjacent = selectedCells.some(cell => {
    const rowDiff = Math.abs(cell.dataset.row - clickedCell.dataset.row);
    const colDiff = Math.abs(cell.dataset.col - clickedCell.dataset.col);
    return rowDiff <= 1 && colDiff <= 1;
  });

	
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
	
	 // Update the selected word string
  const selectedWord = selectedCells.map(cell => cell.textContent).join('');
  selectedWordString += selectedWord; // Concatenate the selected word to the string
  
   // Check if the next letter is available
  const previousCell = selectedCells[selectedCells.length - 2];
  if(previousCell != null){
	  console.log("prev cell ", previousCell);
  const rowDiff = clickedCell.dataset.row - previousCell?.dataset.row;
  const colDiff = clickedCell.dataset.col - previousCell?.dataset.col;

  //let direction;
  if (rowDiff === 0 && colDiff === -1) {
    direction = [0, -1]; // LEFT
  } else if (rowDiff === 0 && colDiff === 1) {
    direction = [0, 1]; // RIGHT
  } else if (rowDiff === -1 && colDiff === 0) {
    direction = [-1, 0]; // UP
  } else if (rowDiff === 1 && colDiff === 0) {
    direction = [1, 0]; // DOWN
  } else if (rowDiff === -1 && colDiff === -1) {
    direction = [-1, -1]; // UP_LEFT
  } else if (rowDiff === -1 && colDiff === 1) {
    direction = [-1, 1]; // UP_RIGHT
  } else if (rowDiff === 1 && colDiff === -1) {
    direction = [1, -1]; // DOWN_LEFT
  } else if (rowDiff === 1 && colDiff === 1) {
    direction = [1, 1]; // DOWN_RIGHT
  }

  let nextLetter = getNextLetter(
    parseInt(clickedCell.dataset.row),
    parseInt(clickedCell.dataset.col),
    direction
  );
  
   console.log("Direction2:", direction);
  let potentialWord = selectedWordString + nextLetter;
  const foundPotentialWord = wordsToFind.some(word => word.startsWith(potentialWord));
  
  if(foundPotentialWord){// Check if the potential word string matches any word in the word set
	  console.log("potential word in list ",potentialWord);
  } else if (wordsToFind.includes(selectedWordString)) { // Check if the selected word string matches any word in the word set
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
  }
  } else if(clickedCell.classList.contains('confirmed')){
	  console.log('Confirmed clicked');
		selectedCells.push(clickedCell);
	}

  // Log the selected word string
  console.log('Selected Word:', selectedWordString);
  console.log('Selected Word:', selectedCells.map(cell => cell.textContent));
  
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
	
	const nextButton = document.getElementById('nextButton');
	// Add event listener to the submit button
	nextButton.addEventListener('click', handleNextButtonClick);
    nextButton.classList.remove('hidden');
	nextButton.disabled = false;
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
  const nextButton = document.getElementById('nextButton');
  nextButton.classList.add('hidden');
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
  
  roundEnded = false;
  
  // Add the event listener back to the grid container
  const gridContainer = document.getElementById('gridContainer');
  gridContainer.addEventListener('click', handleCellClick);
}

//Function to handle the submit button click event
function handleNextButtonClick() {
  changeLevel();
}

const foundWordsContainer = document.getElementById('foundWordsContainer');
foundWordsContainer.classList.add('hidden');
const levelContainer = document.getElementById('levelContainer');
levelContainer.classList.add('hidden');
const nextButton = document.getElementById('nextButton');
nextButton.classList.add('hidden');
getWordSet();

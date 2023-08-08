import React, { useState } from 'react';
import { motion } from 'framer-motion';
import solvePuzzle from '../utils/solver';
import toast from 'react-hot-toast';

const tileVariants = {
  initial: { x: 0, y: 0 },
  animate: { x: 0, y: 0 },
};

type PuzzleTileProps = {
  value: number;
  onClick: () => void;
};

const PuzzleTile = ({ value, onClick }: PuzzleTileProps) => {
  return (
    <motion.div
      className="tile"
      variants={tileVariants}
      whileTap="active"
      onClick={onClick}
    >
      {value}
    </motion.div>
  );
};

const isValidMove = (row: number, col: number) => {
  return row >= 0 && row < 3 && col >= 0 && col < 3;
};

const swapTiles = (state: number[], from: number, to: number) => {
  const newState = [...state];
  [newState[from], newState[to]] = [newState[to], newState[from]];
  return newState;
};

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [puzzleState, setPuzzleState] = useState<number[]>();
  const [moves, setMoves] = useState('');
  const [solution, setSolution] = useState(false);

  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputValue(event.target.value);
  };

  const handleSolveClick = () => {
    const numberArray = inputValue.split('').map(Number);
    setPuzzleState(numberArray);
    console.log(numberArray);
    const solutionString = solvePuzzle(numberArray); // Call your solver utility
    if (solutionString) {
      setSolution(true);
      setMoves(solutionString);
      animateSolution();
    } else {
      toast.error('The board is unsolvable.');
    }
  };

  const animateSolution = () => {
    let delay = 0;
    for (let move of moves) {
      setTimeout(() => {
        performMove(move);
      }, delay);
      delay += 500; // Adjust the delay between moves
    }
  };

  const performMove = (move: string) => {
    const emptyTileIndex = puzzleState!.indexOf(0);
    const row = Math.floor(emptyTileIndex / 3);
    const col = emptyTileIndex % 3;

    let newRow = row;
    let newCol = col;

    switch (move) {
      case 'U':
        newRow = row - 1;
        break;
      case 'D':
        newRow = row + 1;
        break;
      case 'L':
        newCol = col - 1;
        break;
      case 'R':
        newCol = col + 1;
        break;
      default:
        return;
    }

    if (isValidMove(newRow, newCol)) {
      const newIndex = newRow * 3 + newCol;
      const newPuzzleState = swapTiles(puzzleState!, emptyTileIndex, newIndex);
      setPuzzleState(newPuzzleState);
    }
  };

  const renderTiles = () => {
    return puzzleState!.map((value, index) => (
      <PuzzleTile key={index} value={value} onClick={() => onclick} />
    ));
  };

  return (
    <div className="app">
      <h1>8-Puzzle Solver</h1>
      <textarea
        placeholder="Enter the initial board values..."
        value={inputValue}
        onChange={handleInputChange}
      />
      <button onClick={handleSolveClick}>Solve</button>
      {solution && (
        <div className="solution-board">
          {renderTiles()}
        </div>
      )}
    </div>
  );
};

export default App;

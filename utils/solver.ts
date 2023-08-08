interface PuzzleState {
  state: number[];
  moves: string;
}

const goalState: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // Solved state

const isValidMove = (row: number, col: number): boolean => {
  return row >= 0 && row < 3 && col >= 0 && col < 3;
};

const swapTiles = (state: number[], from: number, to: number): number[] => {
  const newState = state.slice();
  [newState[from], newState[to]] = [newState[to], newState[from]];
  return newState;
};

const solverPuzzle = (initialState: number[]): string | null => {
  console.log("initialState", initialState)
  const queue: PuzzleState[] = [{ state: initialState, moves: "" }];
  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    visited.add(current.state.toString());

    if (current.state.toString() === goalState.toString()) {
      return current.moves;
    }

    const emptyTileIndex = current.state.indexOf(0);
    const row = Math.floor(emptyTileIndex / 3);
    const col = emptyTileIndex % 3;

    const directions = ['U', 'D', 'L', 'R'];
    const rowOffsets = [-1, 1, 0, 0];
    const colOffsets = [0, 0, -1, 1];

    for (let i = 0; i < 4; i++) {
      const newRow = row + rowOffsets[i];
      const newCol = col + colOffsets[i];

      if (isValidMove(newRow, newCol)) {
        const newIndex = newRow * 3 + newCol;
        const newState = swapTiles(current.state, emptyTileIndex, newIndex);

        if (!visited.has(newState.toString())) {
          queue.push({
            state: newState,
            moves: current.moves + directions[i]
          });
        }
      }
    }
  }

  return null; // Solution not found
};

export default solverPuzzle;


// Testing
const initialState: number[] = [1, 2, 3, 4, 5, 6, 0, 7, 8]; // Initial puzzle state
const solution = solverPuzzle(initialState);

if (solution) {
  console.log("Solution found:", solution);
} else {
  console.log("No solution found.");
}

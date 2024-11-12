const fs = require('fs');
const { PriorityQueue } = require('@datastructures-js/priority-queue');

const readFile = (filename) => {
  const fileContent = fs.readFileSync(filename, 'utf8');
  const lines = fileContent.trim().split('\n');
  return lines.map(line => line.split(' ').map(Number));
};

const calculateSum = (rod) => {
  return rod.reduce((sum, num) => sum + num, 0);
};

let heuristicCount = 0;
const heuristic = (state) => {
  heuristicCount += 1;
  const [rod1, rod2, rod3] = state;

  const sumRod1 = calculateSum(rod1);
  const sumRod2 = calculateSum(rod2);
  const sumRod3 = calculateSum(rod3);
  const minDifference = Math.min(
    Math.abs(sumRod1 - sumRod2),
    Math.abs(sumRod1 - sumRod3),
    Math.abs(sumRod2 - sumRod3)
  );
  const mincolumn = Math.min(
    sumRod1,
    sumRod2,
    sumRod3  
  );
  return Math.max(minDifference,mincolumn);
};
const isGoal = (state) => {
  const [rod1, rod2, rod3] = state;
  const sumRod1 = calculateSum(rod1);
  const sumRod2 = calculateSum(rod2);
  const sumRod3 = calculateSum(rod3);

  return (
    (rod3.length === 0 && sumRod1 === sumRod2) ||
    (rod2.length === 0 && sumRod1 === sumRod3) ||
    (rod1.length === 0 && sumRod2 === sumRod3)
  );
};
const getBestNeighbors = (state) => {
  const [rod1, rod2, rod3] = state;
  const neighbors = [];
  const rods = [rod1, rod2, rod3];
  const sums = rods.map(calculateSum);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i !== j && rods[i].length > 0) {
        const newState = [rod1.slice(), rod2.slice(), rod3.slice()];
        const num = newState[i].pop();      
        newState[j].push(num);

        const moveCost = num;        

        neighbors.push({ state: newState, priority: heuristic(newState), moveCost });
      }
    }
  }

  return neighbors.sort((a, b) => a.priority - b.priority).map(n => ({ state: n.state, moveCost: n.moveCost }));
};

const aStar = (startState) => {
  const pq = new PriorityQueue((a, b) => a.priority - b.priority);
  pq.enqueue({ state: startState, cost: 0, priority: heuristic(startState), path: [startState] });

  const visited = new Set();

  while (!pq.isEmpty()) {
    const { state: currentState, cost, path } = pq.dequeue();
    if (isGoal(currentState)) {
      return { state: currentState, cost, path };
    }

    visited.add(JSON.stringify(currentState));
    for (const neighbor of getBestNeighbors(currentState)) {
      const { state: neighborState, moveCost } = neighbor;
      const newCost = cost + moveCost;  // محاسبه هزینه بر اساس وزن وزنه

      if (!visited.has(JSON.stringify(neighborState))) {
        pq.enqueue({ 
          state: neighborState, 
          cost: newCost, 
          priority: newCost + heuristic(neighborState), 
          path: [...path, neighborState] 
        });
      }
    }
  }

  return null;
};


const startState = readFile('input.txt');
const solution = aStar(startState);
if (solution) {
  const { state: solutionState, cost: solutionCost, path } = solution;
  console.log(`Solution found with cost ${solutionCost}:`);
  console.log(`Rod 1: ${solutionState[0]}`);
  console.log(`Rod 2: ${solutionState[1]}`);
  console.log(`Rod 3: ${solutionState[2]}`);
  console.log("----------------------------------------");
  const sumRod1 = calculateSum(solutionState[0]);
  const sumRod2 = calculateSum(solutionState[1]);
  const sumRod3 = calculateSum(solutionState[2]);
  console.log(`Sum of Rod 1: ${sumRod1}`);
  console.log(`Sum of Rod 2: ${sumRod2}`);
  console.log(`Sum of Rod 3: ${sumRod3}`);
  console.log("----------------------------------------");
  console.log(`Both sums are equal: ${sumRod1 === sumRod2 || sumRod1 === sumRod3 || sumRod2 === sumRod3}`);
  console.log(`Heuristic was calculated ${heuristicCount} times.`);
  console.log(`\ncost:${solutionCost}\n`)
  console.log("Path of moves:");
  path.forEach((state, index) => {
    console.log(`Step ${index}:`);
    console.log(`Rod 1: ${state[0]}`);
    console.log(`Rod 2: ${state[1]}`);
    console.log(`Rod 3: ${state[2]}`);
    console.log("----------------------------------------");
  });
} else {
  console.log("No solution found.");
}

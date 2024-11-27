const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const config = {
  timerDuration: 60, 
};

function calculateDifference(workerTimes) {
  const maxTime = Math.max(...workerTimes);
  const minTime = Math.min(...workerTimes);
  return maxTime - minTime;
}

function hillClimbingWithGhosts(
  numTasks,
  numWorkers,
  taskTimes,
  workerCapability,
  maxIterations = 1000,
  numGhosts = 50,
  maxBadSteps = 5 
) {
  let assignments = Array(numTasks).fill(-1);
  let workerTimes = Array(numWorkers).fill(0);

  const possibleWorkersForTask = Array.from({ length: numTasks }, (_, task) =>
    Array.from({ length: numWorkers }, (_, worker) => worker).filter(
      (worker) => workerCapability[task][worker] === 1
    )
  );

  for (let task = 0; task < numTasks; task++) {
    const possibleWorkers = possibleWorkersForTask[task];
    if (possibleWorkers.length > 0) {
      const randomWorker =
        possibleWorkers[Math.floor(Math.random() * possibleWorkers.length)];
      assignments[task] = randomWorker;
      workerTimes[randomWorker] += taskTimes[task];
    }
  }

  const initialAssignments = [...assignments];
  const initialWorkerTimes = [...workerTimes];
  const initialDifference = calculateDifference(workerTimes);

  let bestDifference = initialDifference;

  const ghosts = Array.from({ length: numGhosts }, () => ({
    assignments: [...assignments],
    workerTimes: [...workerTimes],
    bestDifference: bestDifference,
    badSteps: 0, 
  }));

  const startTime = Date.now();

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    if ((Date.now() - startTime) / 1000 > config.timerDuration) break;

    ghosts.forEach((ghost) => {
      const task = Math.floor(Math.random() * numTasks);
      const currentWorker = ghost.assignments[task];
      const possibleWorkers = possibleWorkersForTask[task].filter(
        (worker) => worker !== currentWorker
      );

      if (possibleWorkers.length === 0) return;

      const newWorker =
        possibleWorkers[Math.floor(Math.random() * possibleWorkers.length)];

      ghost.workerTimes[currentWorker] -= taskTimes[task];
      ghost.workerTimes[newWorker] += taskTimes[task];
      ghost.assignments[task] = newWorker;

      const newDifference = calculateDifference(ghost.workerTimes);

      if (newDifference < ghost.bestDifference) {
        ghost.bestDifference = newDifference;
        ghost.badSteps = 0; 

        if (newDifference < bestDifference) {
          bestDifference = newDifference;
          workerTimes = [...ghost.workerTimes];
          assignments = [...ghost.assignments];
        }
      } else {
        ghost.badSteps++; 
        if (ghost.badSteps >= maxBadSteps) {
          
          ghost.badSteps = 0;
          ghost.assignments[task] = currentWorker;
          ghost.workerTimes[newWorker] -= taskTimes[task];
          ghost.workerTimes[currentWorker] += taskTimes[task];
        } else {
          ghost.workerTimes[newWorker] -= taskTimes[task];
          ghost.workerTimes[currentWorker] += taskTimes[task];
          ghost.assignments[task] = currentWorker;
        }
      }
    });

      console.log(
        `Iteration: ${iteration}, Best Difference: ${bestDifference}`
      );
    
  }

  return {
    initialAssignments,
    initialWorkerTimes,
    initialDifference,
    finalAssignments: assignments,
    bestDifference,
    finalWorkerTimes: workerTimes,
  };
}

app.get("/config", (req, res) => {
  res.json(config);
});

app.get("/run", (req, res) => {
  fs.readFile("input2.txt", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error reading input file" });
      return;
    }

    const lines = data.trim().split("\n");
    const [numTasks, numWorkers] = lines[0].split(" ").map(Number);
    const taskTimes = lines[1].split(" ").map(Number);
    const workerCapability = lines
      .slice(2)
      .map((line) => line.split(" ").map(Number));

    const result = hillClimbingWithGhosts(
      numTasks,
      numWorkers,
      taskTimes,
      workerCapability
    );

    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const fs = require('fs');

function calculateDifference(workerTimes) {
    const maxTime = Math.max(...workerTimes);
    const minTime = Math.min(...workerTimes);
    return maxTime - minTime;
}

function hillClimbingWithGhosts(numTasks, numWorkers, taskTimes, workerCapability, maxIterations = 1000, numGhosts = 50) {
    let assignments = Array(numTasks).fill(-1);
    let workerTimes = Array(numWorkers).fill(0);

    const possibleWorkersForTask = Array.from({ length: numTasks }, (_, task) =>
        Array.from({ length: numWorkers }, (_, worker) => worker)
            .filter(worker => workerCapability[task][worker] === 1)
    );

  
    for (let task = 0; task < numTasks; task++) {
        const possibleWorkers = possibleWorkersForTask[task];
        if (possibleWorkers.length > 0) {
            const chosenWorker = possibleWorkers.reduce((minWorker, worker) =>
                workerTimes[worker] < workerTimes[minWorker] ? worker : minWorker
            );
            assignments[task] = chosenWorker;
            workerTimes[chosenWorker] += taskTimes[task];
        }
    }

    console.log("Initial Assignments:", assignments);
    console.log("Initial Worker Times:", workerTimes);

    let bestDifference = calculateDifference(workerTimes);
    console.log("Initial difference:", bestDifference);

    const ghosts = Array.from({ length: numGhosts }, () => ({
        assignments: [...assignments],
        workerTimes: [...workerTimes],
        bestDifference: bestDifference
    }));

    for (let iteration = 0; iteration < maxIterations; iteration++) {
        ghosts.forEach((ghost, ghostIndex) => {
            const task = Math.floor(Math.random() * numTasks);
            const currentWorker = ghost.assignments[task];
            const possibleWorkers = possibleWorkersForTask[task].filter(worker => worker !== currentWorker);

            if (possibleWorkers.length === 0) return;
            const newWorker = possibleWorkers[Math.floor(Math.random() * possibleWorkers.length)];

           
            ghost.workerTimes[currentWorker] -= taskTimes[task];
            ghost.workerTimes[newWorker] += taskTimes[task];
            ghost.assignments[task] = newWorker;

            const newDifference = calculateDifference(ghost.workerTimes);

            if (newDifference < ghost.bestDifference) {
                ghost.bestDifference = newDifference;

                if (newDifference < bestDifference) {
                    bestDifference = newDifference;
                    workerTimes = [...ghost.workerTimes];
                    assignments = [...ghost.assignments];

                    // console.log(`Iteration ${iteration + 1}, Ghost ${ghostIndex + 1}:`);
                    // console.log(`   Updated Assignments: ${assignments}`);
                    // console.log(`   Updated Worker Times: ${workerTimes}`);
                    // console.log(`    New Difference: ${bestDifference}`);
                }
            } else {
              
                ghost.workerTimes[newWorker] -= taskTimes[task];
                ghost.workerTimes[currentWorker] += taskTimes[task];
                ghost.assignments[task] = currentWorker;
            }
        });
    }

    console.log("Final Assignments:", assignments);

    return [bestDifference, workerTimes];
}

fs.readFile('input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }
    console.log("===========================")

    const lines = data.trim().split('\n');
    const [numTasks, numWorkers] = lines[0].split(' ').map(Number);
    const taskTimes = lines[1].split(' ').map(Number);
    const workerCapability = lines.slice(2).map(line => line.split(' ').map(Number));

    const [bestDifference, bestWorkerTimes] = hillClimbingWithGhosts(numTasks, numWorkers, taskTimes, workerCapability);
    console.log("******************************************")
    console.log("Best Difference:", bestDifference);
    console.log("Worker Times:", bestWorkerTimes);
});

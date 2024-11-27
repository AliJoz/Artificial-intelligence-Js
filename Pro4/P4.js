
const fs = require("fs");

function calculateDifference(workerTimes) {
  return Math.max(...workerTimes) - Math.min(...workerTimes);
}

function getRandomAssignment(
  numTasks,
  numWorkers,
  taskTimes,
  workerCapability
) {
  let assignments = Array(numTasks).fill(-1);
  let workerTimes = Array(numWorkers).fill(0);

  for (let task = 0; task < numTasks; task++) {
    const possibleWorkers = workerCapability[task]
      .map((capable, index) => (capable === 1 ? index : -1))
      .filter((index) => index !== -1);

    if (possibleWorkers.length > 0) {
      const chosenWorker =
        possibleWorkers[Math.floor(Math.random() * possibleWorkers.length)];
      assignments[task] = chosenWorker;
      workerTimes[chosenWorker] += taskTimes[task];
    }
  }
  return { assignments, workerTimes };
}

function hillClimbingWithGhosts(
  numTasks,
  numWorkers,
  taskTimes,
  workerCapability,
  timeLimit = 60,
  maxBadSteps = 4
) {
  let { assignments, workerTimes } = getRandomAssignment(
    numTasks,
    numWorkers,
    taskTimes,
    workerCapability
  );
  let bestDifference = calculateDifference(workerTimes);
  let bestAssignments = [...assignments];
  let bestWorkerTimes = [...workerTimes];

  const startTime = Date.now();
  let badSteps = 0;

  while ((Date.now() - startTime) / 1000 < timeLimit) {
    const ghostAssignments = [...assignments];
    const ghostWorkerTimes = [...workerTimes];
    let ghostBadSteps = 0;

    // تلاش روح برای پیدا کردن تخصیص بهتر
    const task = Math.floor(Math.random() * numTasks);
    const currentWorker = ghostAssignments[task];
    const possibleWorkers = workerCapability[task]
      .map((capable, index) =>
        capable === 1 && index !== currentWorker ? index : -1
      )
      .filter((index) => index !== -1);

    if (possibleWorkers.length === 0) continue;

    const newWorker =
      possibleWorkers[Math.floor(Math.random() * possibleWorkers.length)];

    // تغییر موقت
    ghostWorkerTimes[currentWorker] -= taskTimes[task];
    ghostWorkerTimes[newWorker] += taskTimes[task];
    ghostAssignments[task] = newWorker;

    const newDifference = calculateDifference(ghostWorkerTimes);

    if (newDifference < bestDifference) {
      // بهبود: تخصیص جدید بهتر از قبلی است
      bestDifference = newDifference;
      bestAssignments = [...ghostAssignments];
      bestWorkerTimes = [...ghostWorkerTimes];
      ghostBadSteps = 0; // گام‌های بد را ریست می‌کنیم
    } else {
      // افزایش گام‌های بد
      ghostBadSteps++;
      if (ghostBadSteps > maxBadSteps) {
        // اگر گام‌های بد بیش از حد شود، به وضعیت قبلی برمی‌گردیم
        ghostWorkerTimes[currentWorker] += taskTimes[task];
        ghostWorkerTimes[newWorker] -= taskTimes[task];
        ghostAssignments[task] = currentWorker;
        ghostBadSteps = 0; // بازنشانی گام‌های بد
      }
    }

    // جایگزینی تخصیص اصلی با بهترین تخصیص روح
    assignments = [...bestAssignments];
    workerTimes = [...bestWorkerTimes];
  }

  return [bestDifference, bestWorkerTimes, bestAssignments];
}

// خواندن داده‌ها از فایل
fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  const lines = data.trim().split("\n");
  const [numTasks, numWorkers] = lines[0].split(" ").map(Number);
  const taskTimes = lines[1].split(" ").map(Number);
  const workerCapability = lines
    .slice(2)
    .map((line) => line.split(" ").map(Number));

  const [bestDifference, bestWorkerTimes, bestAssignments] =
    hillClimbingWithGhosts(numTasks, numWorkers, taskTimes, workerCapability);

  console.log("******************************************");
  console.log("Best Difference:", bestDifference);
  console.log("Worker Times:", bestWorkerTimes);
  console.log("Assignments:", bestAssignments);
});

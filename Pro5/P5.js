const fs = require('fs');

// تابع هدف برای ارزیابی اختلاف زمان کارگران
function calculateDifference(workerTimes) {
    const maxTime = Math.max(...workerTimes);
    const minTime = Math.min(...workerTimes);
    return maxTime - minTime;
}

// تولید جمعیت اولیه
function generateInitialPopulation(populationSize, numTasks, numWorkers, workerCapability, taskTimes) {
    return Array.from({ length: populationSize }, () => {
        const assignments = Array(numTasks).fill(-1);
        const workerTimes = Array(numWorkers).fill(0);

        for (let task = 0; task < numTasks; task++) {
            const possibleWorkers = Array.from({ length: numWorkers }, (_, worker) => worker)
                .filter(worker => workerCapability[task][worker] === 1);

            if (possibleWorkers.length > 0) {
                const chosenWorker = possibleWorkers[Math.floor(Math.random() * possibleWorkers.length)];
                assignments[task] = chosenWorker;
                workerTimes[chosenWorker] += taskTimes[task];
            }
        }

        return { assignments, workerTimes, fitness: calculateDifference(workerTimes) };
    });
}

// انتخاب والدین (روش ترکیبی: تورنمنت و تناسبی)
function selectParents(population, tournamentSize = 3) {
    const tournament = Array.from({ length: tournamentSize }, () =>
        population[Math.floor(Math.random() * population.length)]
    );
    return tournament.reduce((best, individual) =>
        individual.fitness < best.fitness ? individual : best
    );
}

// تقاطع (Crossover): تقاطع بخشی از تخصیص‌های والدین
function crossover(parent1, parent2, numTasks) {
    const crossoverPoint = Math.floor(Math.random() * numTasks);
    return [
        ...parent1.assignments.slice(0, crossoverPoint),
        ...parent2.assignments.slice(crossoverPoint),
    ];
}

// جهش (Mutation): تخصیص‌های نادرست را بهبود می‌بخشد
function mutate(assignments, numWorkers, workerCapability, taskTimes, mutationRate = 0.2) {
    for (let task = 0; task < assignments.length; task++) {
        if (Math.random() < mutationRate) {
            const possibleWorkers = Array.from({ length: numWorkers }, (_, worker) => worker)
                .filter(worker => workerCapability[task][worker] === 1);
            if (possibleWorkers.length > 0) {
                assignments[task] = possibleWorkers[Math.floor(Math.random() * possibleWorkers.length)];
            }
        }
    }
    return assignments;
}

// اجرای الگوریتم ژنتیک
function geneticAlgorithm(numTasks, numWorkers, taskTimes, workerCapability, populationSize = 50, generations = 100) {
    let population = generateInitialPopulation(populationSize, numTasks, numWorkers, workerCapability, taskTimes);

    let bestSolution = population[0];

    for (let generation = 0; generation < generations; generation++) {
        const newPopulation = [];

        while (newPopulation.length < populationSize) {
            const parent1 = selectParents(population);
            const parent2 = selectParents(population);

            const childAssignments = crossover(parent1, parent2, numTasks);
            const mutatedAssignments = mutate(childAssignments, numWorkers, workerCapability, taskTimes);

            const workerTimes = Array(numWorkers).fill(0);
            mutatedAssignments.forEach((worker, task) => {
                if (worker !== -1) {
                    workerTimes[worker] += taskTimes[task];
                }
            });

            const fitness = calculateDifference(workerTimes);

            const newIndividual = { assignments: mutatedAssignments, workerTimes, fitness };
            newPopulation.push(newIndividual);

            if (fitness < bestSolution.fitness) {
                bestSolution = newIndividual;
            }
        }

        population = newPopulation;
        console.log(`Generation ${generation + 1}: Best Difference = ${bestSolution.fitness}`);
    }

    return bestSolution;
}

// خواندن و پردازش داده‌ها از فایل
fs.readFile('input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    const lines = data.trim().split('\n');
    const [numTasks, numWorkers] = lines[0].split(' ').map(Number);
    const taskTimes = lines[1].split(' ').map(Number);
    const workerCapability = lines.slice(2).map(line => line.split(' ').map(Number));

    const bestSolution = geneticAlgorithm(numTasks, numWorkers, taskTimes, workerCapability);

    console.log("\nOptimal Solution:");
    console.log("Best Difference:", bestSolution.fitness);
    console.log("Worker Times:", bestSolution.workerTimes);
    console.log("Assignments:", bestSolution.assignments);
});

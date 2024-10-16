const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function IDS(start, target) {
  let maxDepth = 0;
  while (true) {
    const result = Dfs(start, target, maxDepth, [], new Set());
    if (result) {
      return result;
    }
    maxDepth++;
  }
}

function Dfs(num, target, limit, path, visited) {
  if (num === target) {
    return { path: [...path, num], steps: path.length };
  }

  if (limit === 0) {
    return null;
  }

  visited.add(num);

  let sqrtNum = Math.sqrt(num);
  let mulNum = num * 2;
  let floorNum = Math.floor(num);

  //  sqrt(num)
  if (!visited.has(sqrtNum)) {
    const result = Dfs(
      sqrtNum,
      target,
      limit - 1,
      [...path, `sqrt(${num})`],
      visited
    );
    if (result) return result;
  }

  //  num * 2
  if (!visited.has(mulNum)) {
    const result = Dfs(
      mulNum,
      target,
      limit - 1,
      [...path, `${num} * 2`],
      visited
    );
    if (result) return result;
  }

  //  floor(num)
  if (!visited.has(floorNum)) {
    const result = Dfs(
      floorNum,
      target,
      limit - 1,
      [...path, `floor(${num})`],
      visited
    );
    if (result) return result;
  }

  visited.delete(num);
  return null;
}

rl.question("Please input the first number: ", (start) => {
  rl.question("Please input the second number (target): ", (target) => {
    start = parseInt(start, 10);
    target = parseInt(target, 10);

    let result = IDS(start, target);
    if (result) {
      console.log(`Path to\t ${target}: ${result.path.join(" -> ")}`);
      console.log(`Total steps: ${result.steps}`);
    } else {
      console.log(`No path found to ${target}`);
    }

    rl.close();
  });
});

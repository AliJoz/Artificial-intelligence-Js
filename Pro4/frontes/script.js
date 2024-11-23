async function startProcess() {
  const duration = await fetchTimerDuration(); 
  hideResults(); 
  startCountdown(duration, fetchResults); 
}

async function fetchTimerDuration() {
  const response = await fetch("http://localhost:3000/config");
  const data = await response.json();
  return data.timerDuration; // بازگشت مدت زمان
}


function startCountdown(duration, callback) {
  const timerElement = document.getElementById("timer");
  let timeLeft = duration;

  timerElement.style.display = "block";
  timerElement.innerText = `زمان باقی‌مانده: ${timeLeft} ثانیه`;

  const countdownInterval = setInterval(() => {
      timeLeft--;
      timerElement.innerText = `زمان باقی‌مانده: ${timeLeft} ثانیه`;

      if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          timerElement.style.display = "none";
          callback();
      }
  }, 1000);
}


async function fetchResults() {
  const response = await fetch("http://localhost:3000/run");
  const data = await response.json();

  
  document.querySelector("#initial-results").style.display = "block";
  document.querySelector("#final-results").style.display = "block";

  
  const initialAssignmentsDiv = document.getElementById("initial-assignments");
  initialAssignmentsDiv.innerHTML = `<strong class="block text-center text-3xl font-bold mb-6">تخصیص اولیه:</strong>`;
  const initialContainerDiv = document.createElement("div");
  initialContainerDiv.className = "flex justify-center flex-wrap gap-x-2 mt-1 gap-y-3"; 
  data.initialAssignments.forEach((assignment, index) => {
    const assignmentDiv = document.createElement("div");
    assignmentDiv.className = "p-2 bg-green-200 border border-green-400 rounded-md text-center w-32";
    assignmentDiv.innerText = `کار ${index + 1}: کارگر ${assignment}`;
    initialContainerDiv.appendChild(assignmentDiv);
  });
  initialAssignmentsDiv.appendChild(initialContainerDiv);

  // نمایش زمان‌های اولیه
  const initialWorkerTimesDiv = document.getElementById("initial-worker-times");
  initialWorkerTimesDiv.innerHTML = `<strong class="block text-center text-3xl font-bold mb-6">زمان‌های اولیه کارگرها:</strong>`;
  data.initialWorkerTimes.forEach((time, index) => {
    const workerDiv = document.createElement("div");
    workerDiv.className = "p-2 mb-2 bg-yellow-200 border border-yellow-400 rounded-md";
    workerDiv.innerText = `کارگر ${index + 1}: ${time} دقیقه`;
    initialWorkerTimesDiv.appendChild(workerDiv);
  });

  // نمایش اختلاف اولیه
  const initialDifferenceDiv = document.getElementById("initial-difference");
  initialDifferenceDiv.innerHTML = `<strong class="block text-center text-3xl font-bold mb-6">اختلاف اولیه: ${data.initialDifference}</strong>`;

  // نمایش تخصیص‌های نهایی
  const finalAssignmentsDiv = document.getElementById("final-assignments");
  finalAssignmentsDiv.innerHTML = `<strong class="block text-center text-3xl font-bold mb-6">تخصیص نهایی:</strong>`;
  const finalContainerDiv = document.createElement("div");
  finalContainerDiv.className = "flex justify-center flex-wrap gap-x-2 mt-1 gap-y-3";
  data.finalAssignments.forEach((assignment, index) => {
    const assignmentDiv = document.createElement("div");
    assignmentDiv.className = "p-2 bg-blue-200 border border-blue-400 rounded-md text-center w-32";
    assignmentDiv.innerText = `کار ${index + 1}: کارگر ${assignment}`;
    finalContainerDiv.appendChild(assignmentDiv);
  });
  finalAssignmentsDiv.appendChild(finalContainerDiv);

  // نمایش زمان‌های نهایی
  const finalWorkerTimesDiv = document.getElementById("final-worker-times");
  finalWorkerTimesDiv.innerHTML = `<strong class="block text-center text-3xl font-bold mb-6">زمان‌های نهایی کارگرها:</strong>`;
  data.finalWorkerTimes.forEach((time, index) => {
    const workerDiv = document.createElement("div");
    workerDiv.className = "p-2 mb-2 bg-purple-200 border border-purple-400 rounded-md";
    workerDiv.innerText = `کارگر ${index + 1}: ${time} دقیقه`;
    finalWorkerTimesDiv.appendChild(workerDiv);
  });

  // نمایش بهترین اختلاف
  const bestDifferenceDiv = document.getElementById("best-difference");
  bestDifferenceDiv.innerHTML = `
    <div class="flex justify-center text-2xl gap-x-3">
      <strong class="text-2xl text-center font-bold mb-6">بهترین اختلاف:</strong>
      <p class="text-red-700 font-bold">${data.bestDifference}</p>
    </div>`;
}

function hideResults() {
  document.getElementById("initial-results").style.display = "none";
  document.getElementById("final-results").style.display = "none";
}

async function fetchResults() {
  try {
    const response = await fetch("http://localhost:3000/run");
    const data = await response.json();

    // نمایش بخش‌های اطلاعات
    document.querySelector("#initial-assignments").style.display = "block";
    document.querySelector("#initial-worker-times").style.display = "block";
    document.querySelector("#initial-difference").style.display = "block";
    document.querySelector("#final-assignments").style.display = "block";
    document.querySelector("#final-worker-times").style.display = "block";
    document.querySelector("#best-difference").style.display = "block";
    // مقداردهی اطلاعات اولیه
    const initialAssignmentsDiv = document.getElementById(
      "initial-assignments"
    );
    initialAssignmentsDiv.innerHTML = `<strong class="block text-center text-3xl font-bold mb-6">تخصیص اولیه:</strong>`; // عنوان بخش

    // ساخت یک کانتینر برای نمایش شبکه‌ای
    const initialContainerDiv = document.createElement("div");
    initialContainerDiv.className =
      "flex justify-center flex-wrap gap-x-2 mt-1 gap-y-3"; // تنظیم Flexbox برای نمایش کنار هم

    // اضافه کردن هر تخصیص به داخل کانتینر
    data.initialAssignments.forEach((assignment, index) => {
      const assignmentDiv = document.createElement("div");
      assignmentDiv.className =
        "p-2 bg-green-200 border border-green-400 rounded-md text-center w-32"; // استایل کارت‌ها
      assignmentDiv.innerText = `کار ${index + 1}: کارگر ${assignment}`;
      initialContainerDiv.appendChild(assignmentDiv);
    });

    // افزودن کانتینر به بخش اصلی
    initialAssignmentsDiv.appendChild(initialContainerDiv);

    const initialWorkerTimesDiv = document.getElementById(
      "initial-worker-times"
    );
    initialWorkerTimesDiv.innerHTML = `<strong class="block text-center text-3xl font-bold mb-6">زمان‌های اولیه کارگرها:</strong>`; // عنوان بخش
    data.initialWorkerTimes.forEach((time, index) => {
      const workerDiv = document.createElement("div");
      workerDiv.className =
        "p-2 mb-2 bg-yellow-200 border border-yellow-400 rounded-md";
      workerDiv.innerText = `کارگر ${index + 1}: ${time} دقیقه`;
      initialWorkerTimesDiv.appendChild(workerDiv);
    });

    const initialDifferenceDiv = document.getElementById("initial-difference");
    initialDifferenceDiv.innerHTML = `<strong class="block text-center text-3xl font-bold mb-6">اختلاف اولیه: ${data.initialDifference}</strong>`;

    // مقداردهی اطلاعات نهایی
    const finalAssignmentsDiv = document.getElementById("final-assignments");
    finalAssignmentsDiv.innerHTML =
      finalAssignmentsDiv.innerHTML = `<strong class="block text-center text-3xl font-bold mb-6">تخصیص نهایی:</strong>`;

    // ساخت یک کانتینر برای نمایش شبکه‌ای
    const containerDiv = document.createElement("div");
    containerDiv.className =
      "flex justify-center flex-wrap gap-x-2 mt-1 gap-y-3"; // تنظیم Flexbox برای نمایش کنار هم

    // اضافه کردن هر تخصیص به داخل کانتینر
    data.finalAssignments.forEach((assignment, index) => {
      const assignmentDiv = document.createElement("div");
      assignmentDiv.className =
        "p-2 bg-blue-200 border border-blue-400 rounded-md  text-center w-32"; // استایل کارت‌ها
      assignmentDiv.innerText = `کار ${index + 1}:  کارگر${assignment}`;
      containerDiv.appendChild(assignmentDiv);
    });

    // افزودن کانتینر به بخش اصلی
    finalAssignmentsDiv.appendChild(containerDiv);

    const finalWorkerTimesDiv = document.getElementById("final-worker-times");
    finalWorkerTimesDiv.innerHTML = `<strong class="block text-center text-3xl font-bold mb-6">زمان‌های نهایی کارگرها:</strong>`; // عنوان بخش
    data.finalWorkerTimes.forEach((time, index) => {
      const workerDiv = document.createElement("div");
      workerDiv.className =
        "p-2 mb-2 bg-purple-200 border border-purple-400 rounded-md";
      workerDiv.innerText = `کارگر ${index + 1}: ${time} دقیقه`;
      finalWorkerTimesDiv.appendChild(workerDiv);
    });

    const bestDifferenceDiv = document.getElementById("best-difference");
    bestDifferenceDiv.innerHTML = `<div class="flex   justify-center text-2xl gap-x-3">  <strong class="  text-2xl text-center font-bold mb-6">بهترین اختلاف:</strong> <p class=text-red-700 font-bold> ${data.bestDifference} </p></div> `;
  } catch (error) {
    console.error("Error fetching results:", error);
  }
}

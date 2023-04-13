"use strict";

const add = document.querySelector(".add");
const inputText = document.querySelector("input");
const list = document.querySelector(".list");
const time = document.querySelector(".time");
const sortMenuToggle = document.querySelector("#sort");
const clear = document.querySelector("#clear");

// sort buttons
const fromA = document.querySelector("#a-to-z");
const fromZ = document.querySelector("#z-to-a");
const fromNewDate = document.querySelector("#sort-date");
const fromComplete = document.querySelector("#sort-complete");
const select = document.querySelector(".select");

// ------------LIST ARRAYS AND OBJECTS

const tasks = [
  {
    id: 1678928683725,
    task: "Fix your code",
    date: "2023-03-16T00:33:37.603Z",
    completed: false,
    selected: false,
  },
  {
    id: 1678928711124,
    task: "Clean your room",
    date: "2023-03-13T00:33:37.603Z",
    completed: false,
    selected: false,
  },
  {
    id: 1678928721873,
    task: "Watch the course",
    date: "2023-02-16T00:33:37.603Z",
    completed: false,
    selected: false,
  },
];

// --------DATE FUNCTIONALITY

function timePassed(date) {
  const today = new Date();
  const past = new Date(date);

  const dateAdded = Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(past);

  const secondsPassed = Math.round((today - past) / 1000);
  const minutesPassed = Math.round(secondsPassed / 60);
  const hoursPassed = Math.round(minutesPassed / 60);
  const daysPassed = Math.round(hoursPassed / 24);

  if (secondsPassed <= 60) return `Added ${secondsPassed} secs ago`;
  if (minutesPassed <= 60) return `Added ${minutesPassed} mins ago`;
  if (hoursPassed <= 24)
    return `Added ${hoursPassed} ${hoursPassed === 1 ? "hour" : "hours"} ago`;
  if (daysPassed <= 7)
    return `Added ${daysPassed} ${daysPassed === 1 ? "day" : "days"} ago`;

  return dateAdded;
}

// --------------ADDING FUNCTIONALITY
add.addEventListener("click", (button) => {
  button.preventDefault();

  const value = inputText.value;
  const dateISO = new Date().toISOString();
  const newID = Date.now();
  const taskIndex = tasks.length;

  if (!value == "") {
    tasks.push({
      id: newID,
      task: `${value}`,
      date: dateISO,
      completed: false,
      selected: false,
    });

    displayTasks(tasks);
    inputText.value = "";
  }
});

// -------------- DISPLAY FUNCTIONALITY

function displayTasks(items) {
  list.innerHTML = "";

  items.map((item) => {
    const taskAddedDate = timePassed(item.date);

    const html = `
    <div class="item">
    <div class="item-container">
      <div>
        <label class="switch">
          <input type="checkbox" class="check-input" />
          <span class="check"></span>
        </label>
      </div>
      <h3>${item.task}</h3>
    </div>
    <h5>${taskAddedDate}</h5>
    </div>
    `;

    list.insertAdjacentHTML("afterbegin", html);
  });

  checkComplete();
}

displayTasks(tasks);

// ----------------CLOCK
const options = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

const dateFormatter = new Intl.DateTimeFormat(navigator.language, options);

function updateTime() {
  const date = new Date();
  const dateFormatted = dateFormatter.format(date);

  const clock = dateFormatted;
  time.textContent = clock;
}
updateTime();

setInterval(() => {
  updateTime();
}, 100);

// ------------ UPDATING UI

function updateUI() {
  displayTasks(tasks);

  checkComplete();
}

// ------ TOGGLE SORT MENU

let toggled = false;

sortMenuToggle.addEventListener("click", () => {
  const menu = document.querySelector(".sort-menu-parent");
  if (!toggled) {
    toggled = true;

    menu.style.opacity = 100;
    menu.style.visibility = "visible";
  } else {
    toggled = false;

    menu.style.opacity = 0;
    menu.style.visibility = "hidden";
  }
});

// ---------- CHECKBOX COMPLETION

function search(str, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].task === str) {
      return arr[i];
    }
  }
}

function checkComplete() {
  const checkBox = document.querySelectorAll(".check-input");

  checkBox.forEach((boxes) => {
    boxes.addEventListener("click", (box) => {
      const targetBox = box.target;
      const parent = targetBox.closest(".item");
      const textEl = parent.childNodes[1].childNodes[3];

      const objIndex = tasks.findIndex((obj) => obj.task == textEl.textContent);
      const curTask = tasks[objIndex];

      if (targetBox.checked) {
        textEl.style.textDecoration = "line-through";
        textEl.style.color = "grey";
        curTask.completed = true;
      } else {
        textEl.style.textDecoration = "none";
        textEl.style.color = "white";
        curTask.completed = false;
      }
    });
  });
}

function removeTask(task, index) {
  task.splice(index, 1);
}

clear.addEventListener("click", () => {
  tasks.forEach((task, i) => {
    if (task.completed) {
      console.log(task);
      tasks.filter;
    }
  });
  // console.log(tasks);
  // updateUI();
});

console.log(tasks);

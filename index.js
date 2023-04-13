const add = document.querySelector("form");
const inputText = document.querySelector("input");
const list = document.querySelector(".list");
const time = document.querySelector(".time");
const sortMenuToggle = document.querySelector("#sort");
const clear = document.querySelector("#clear");
const remove = document.querySelector("#remove");

// sort buttons
const fromA = document.querySelector("#a-to-z");
const fromZ = document.querySelector("#z-to-a");
const fromNewDate = document.querySelector("#sort-date");
const fromComplete = document.querySelector("#sort-complete");
const select = document.querySelector(".select");

//////////////////////////////////////
//////////////////////////////////////

class Task {
  id = Date.now();
  date = new Date().toISOString();
  completed = false;
  selected = false;

  constructor(task) {
    this.task = task;
  }
}

//////////////////////////////////////
//////////////////////////////////////

class Application {
  tasks = [];

  constructor() {
    this.getLocalStorage();

    add.addEventListener("submit", this.createTask.bind(this));
    clear.addEventListener("click", this.clearCompleted.bind(this));
    select.addEventListener("click", this.selectingTasks.bind(this));
    remove.addEventListener("click", this.removeTasks.bind(this));

    fromA.addEventListener("click", this.SortFromA.bind(this));
    fromZ.addEventListener("click", this.SortFromZ.bind(this));
    fromNewDate.addEventListener("click", this.SortFromDate.bind(this));
    fromComplete.addEventListener("click", this.SortFromCompleted.bind(this));
  }

  // --------- DATE FUNCTION
  timePassed(date) {
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

  // --------- DISPLAY TASK FUNCTION
  displayTasks(items) {
    list.innerHTML = "";

    items.map((item) => {
      const taskAddedDate = this.timePassed(item.date);

      const html = `
      <div class="item" data-ID="${item.id}">
      <div class="item-container">
        <div>
          <label class="switch">
            <input type="checkbox" class="check-input" ${
              item.completed ? "checked" : ""
            } />
            <span class="check"></span>
          </label>
        </div>
        <h3 style="text-decoration: ${
          item.completed ? "line-through" : ""
        }; color: ${item.completed ? "grey" : "white"}" >${item.task}</h3>
      </div>
      <h5>${taskAddedDate}</h5>
      </div>
      `;

      list.insertAdjacentHTML("afterbegin", html);
    });
    this.checkComplete();
    this.setLocalStorage();
  }
  // ----------- CHECK FOR COMPLETION

  checkComplete() {
    const checkBox = document.querySelectorAll(".check-input");

    checkBox?.forEach((box) => {
      box.addEventListener("click", (e) => {
        const id = e.target.closest(".item").dataset.id;
        const textEl = e.target.closest(".item").querySelector("h3");

        this.tasks.map((task) => {
          if (task.id == id) {
            // task.completed = box.checked ? true : false;
            task.completed = !task.completed;
            textEl.style.textDecoration = task.completed
              ? "line-through"
              : "none";
            textEl.style.color = task.completed ? "grey" : "white";
            this.setLocalStorage();
          }
        });
      });
    });
  }

  // -------------CLEARING COMPLETED TASKS
  clearCompleted() {
    const updatedTasks = this.tasks.filter((task) => !task.completed);
    this.tasks = updatedTasks;
    this.displayTasks(this.tasks);
  }

  // --------- CREATE TASK FUNCTION
  createTask(e) {
    e.preventDefault();
    let task;

    task = new Task(inputText.value);
    this.tasks.push(task);
    inputText.value = "";
    this.displayTasks(this.tasks);
  }

  // -------- SELECTING TASK FUNCTION
  selectingTasks() {
    this.toggleSelect = !this.toggleSelect;
    const itemRows = document.querySelectorAll(".item");

    select.style.backgroundColor = this.toggleSelect ? "white" : "#24272c";
    select.style.color = this.toggleSelect ? "#24272c" : "white";

    if (this.toggleSelect) {
      itemRows.forEach((row) => {
        row.addEventListener("click", (e) => {
          this.tasks.map((task) => {
            if (task.id == row.dataset.id) {
              row.style.backgroundColor = "#262a30";
              task.selected = true;
            }
          });
        });
      });
    }

    if (!this.toggleSelect) {
      this.tasks.map((task) => {
        task.selected = false;
        itemRows.forEach((row) => (row.style.backgroundColor = "#24272c"));
      });
    }
  }

  // --------------------- REMOVE TASK FUNCTION
  removeTasks() {
    const updatedTasks = this.tasks.filter((task) => !task.selected);
    this.tasks = updatedTasks;
    this.displayTasks(this.tasks);

    this.toggleSelect = false;
    select.style.backgroundColor = "#24272c";
    select.style.color = "white";
  }

  // ---------STORAGE FUNCTIONS
  setLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("tasks"));

    if (!data) return;

    this.tasks = data;
    this.displayTasks(this.tasks);
  }

  // ----------------- SORTING FUNCTIONALITY
  SortFromA() {
    const sorted = this.tasks.sort((a, b) => {
      const taskA = a.task.toUpperCase();
      const taskB = b.task.toUpperCase();
      if (taskA < taskB) return 1;
      if (taskA > taskB) return -1;
      return 0;
    });
    this.displayTasks(this.tasks);
  }
  SortFromZ() {
    const sorted = this.tasks.sort((a, b) => {
      const taskA = a.task.toUpperCase();
      const taskB = b.task.toUpperCase();
      if (taskA < taskB) return -1;
      if (taskA > taskB) return 1;
      return 0;
    });
    this.displayTasks(this.tasks);
  }
  SortFromDate() {
    const sorted = this.tasks.sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
    });
    this.displayTasks(this.tasks);
  }
  SortFromCompleted() {
    const sorted = this.tasks.sort((a, b) => {
      if (a.completed < b.completed) return -1;
      if (a.completed > b.completed) return 1;
    });
    this.displayTasks(this.tasks);
  }
}

new Application();

// add.addEventListener("submit", (e) => {
//   e.preventDefault();
//   console.log("work");
// });
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

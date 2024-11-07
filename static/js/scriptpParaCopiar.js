const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const monthContainer = document.querySelector(".month-container");
const daysContainer = document.getElementById("days");

const prevBtn = document.getElementById("previous-btn");
const nextBtn = document.getElementById("next-btn");

const infoItems = document.getElementById("info-items");
const monthTitleInfo = document.querySelector(".item-title");
const addNumberInput = document.getElementById("add-number-input");
const addDescriptionInput = document.getElementById("add-description-input");
const addBtn = document.getElementById("add-btn");
const changeBtn = document.querySelector(".info-btn-change");

const changePanel = document.querySelector(".info-change-panel");
const changeOptions = document.querySelectorAll(".change-option");
const inputsContainer = document.querySelector(".info-inputs-container");

const userPanel = document.querySelector(".user-panel");

const infoMain = document.querySelector(".info-main");

function hideChangePanel() {
  changePanel.classList.remove("displayed");
  changeBtn.children[0].classList.remove("rotate");
  changePanel.children[0].removeAttribute("style");
}

// let items = {
//   2024: {
//     7: {
//       10: [
//         {
//           type: "Income",
//           amount: 1200,
//           description: "Me prestó plata Pedrito",
//         },
//         {
//           type: "Expenses",
//           amount: 1200,
//           description: "Me robaron lo que me prestó Pedrito",
//         },
//       ],
//       15: [
//         { type: "Income", amount: 500, description: "Venta de cosas usadas" },
//         { type: "Expenses", amount: 200, description: "Cena en restaurante" },
//       ],
//       22: [
//         { type: "Income", amount: 800, description: "Pago freelance" },
//         { type: "Expenses", amount: 300, description: "Regalo para un amigo" },
//       ],
//     },
//     8: {
//       29: [
//         { type: "Expenses", amount: 1000, description: "Compré un pancho" },
//         {
//           type: "Income",
//           amount: 1500,
//           description: "Devolución de impuestos",
//         },
//         { type: "Expenses", amount: 1300, description: "Compré una coca" },
//         { type: "Expenses", amount: 1500, description: "Compré papas" },
//         {
//           type: "Income",
//           amount: 2000,
//           description: "Encontré plata en el piso",
//         },
//       ],
//       5: [
//         { type: "Expenses", amount: 400, description: "Gasolina" },
//         { type: "Income", amount: 200, description: "Venta de libro usado" },
//       ],
//       17: [
//         { type: "Expenses", amount: 700, description: "Mantenimiento auto" },
//       ],
//     },
//     9: {
//       10: [
//         { type: "Income", amount: 1200, description: "Sueldo mensual" },
//         { type: "Expenses", amount: 600, description: "Compra de ropa" },
//       ],
//       15: [{ type: "Income", amount: 1000, description: "holita" }],
//       20: [
//         { type: "Income", amount: 100, description: "Venta de bicicleta" },
//         { type: "Expenses", amount: 250, description: "Cena con amigos" },
//       ],
//       25: [{ type: "Expenses", amount: 500, description: "La puse" }],
//       30: [{ type: "Expenses", amount: 150, description: "Entrada cine" }],
//     },
//     10: {
//       5: [
//         { type: "Income", amount: 1000, description: "Pago por proyecto" },
//         { type: "Expenses", amount: 300, description: "Regalo cumpleaños" },
//       ],
//       15: [{ type: "Income", amount: 600, description: "Venta de mueble" }],
//       25: [
//         {
//           type: "Expenses",
//           amount: 900,
//           description: "Reparación computadora",
//         },
//       ],
//     },
//     11: {
//       2: [
//         { type: "Income", amount: 1200, description: "Reembolso de empresa" },
//       ],
//       12: [
//         { type: "Expenses", amount: 150, description: "Comida rápida" },
//         { type: "Income", amount: 300, description: "Devolución préstamo" },
//       ],
//       22: [{ type: "Expenses", amount: 200, description: "Salida al teatro" }],
//     },
//   },
// };

// let data = [[1, "2024-10-10", "hola", "123", "Income"]];

let storedItems = [];

let items = {};

function updateItem(day, updatedItem) {
  let actualDate = new Date(
    `${String(currentMonth + 1)}-${String(day)}-${String(currentYear)}`
  );
  let item = storedItems.find((d) => {
    if (
      new Date(d[1]).getFullYear() === actualDate.getFullYear() &&
      new Date(d[1]).getMonth() === actualDate.getMonth() &&
      new Date(d[1]).getDate() === actualDate.getDate()
    ) {
      if (updatedItem.description || updatedItem.amount) {
        return (
          d[2] == updatedItem.description &&
          parseFloat(d[3]) == parseFloat(updatedItem.amount) &&
          d[4] == updatedItem.type
        );
      } else {
        return d[2] == updatedItem;
      }
    }
  });
  console.log(item);
  $.ajax({
    url: "/deleteNota",
    data: JSON.stringify({ id: item[0] }),
    contentType: "application/json",
    type: "POST",
    success: function (response) {
      $.ajax({
        url: "/getNotas",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
          storedItems = response;
        },
        error: function (error) {
          console.error(error);
        },
      });
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function setItems() {
  storedItems.forEach(function (dataItem) {
    let itemDate = new Date(dataItem[1]);
    if (items[itemDate.getFullYear()]) {
      if (items[itemDate.getFullYear()][itemDate.getMonth()]) {
        if (
          items[itemDate.getFullYear()][itemDate.getMonth()][itemDate.getDate()]
        ) {
          if (parseFloat(dataItem[3]) !== 0) {
            items[itemDate.getFullYear()][itemDate.getMonth()][
              itemDate.getDate()
            ].push({
              amount: parseFloat(dataItem[3]),
              description: dataItem[2],
              type: dataItem[4],
            });
          } else {
            items[itemDate.getFullYear()][itemDate.getMonth()][
              itemDate.getDate()
            ].push({
              note: dataItem[2],
              type: dataItem[4],
            });
          }
        } else {
          if (parseFloat(dataItem[3]) !== 0) {
            items[itemDate.getFullYear()][itemDate.getMonth()][
              itemDate.getDate()
            ] = [
              {
                amount: parseFloat(dataItem[3]),
                description: dataItem[2],
                type: dataItem[4],
              },
            ];
          } else {
            items[itemDate.getFullYear()][itemDate.getMonth()][
              itemDate.getDate()
            ] = [
              {
                note: dataItem[2],
                type: dataItem[4],
              },
            ];
          }
        }
      } else {
        if (parseFloat(dataItem[3]) !== 0) {
          items[itemDate.getFullYear()][itemDate.getMonth()] = {
            [itemDate.getDate()]: [
              {
                amount: parseFloat(dataItem[3]),
                description: dataItem[2],
                type: dataItem[4],
              },
            ],
          };
        } else {
          items[itemDate.getFullYear()][itemDate.getMonth()] = {
            [itemDate.getDate()]: [
              {
                note: dataItem[2],
                type: dataItem[4],
              },
            ],
          };
        }
      }
    } else {
      if (parseFloat(dataItem[3]) !== 0) {
        items[itemDate.getFullYear()] = {
          [itemDate.getMonth()]: {
            [itemDate.getDate()]: [
              {
                amount: parseFloat(dataItem[3]),
                description: dataItem[2],
                type: dataItem[4],
              },
            ],
          },
        };
      } else {
        items[itemDate.getFullYear()] = {
          [itemDate.getMonth()]: {
            [itemDate.getDate()]: [
              {
                note: dataItem[2],
                type: dataItem[4],
              },
            ],
          },
        };
      }
    }
  });
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let showYear = true;
let showNotes = false;

function showCalendar(
  month,
  year,
  monthContainer = document.querySelector(".month-container")
) {
  let infoYear = getValues(items, currentYear);
  let infoMonth = getValues(infoYear, currentMonth);

  let monthTitle = document.querySelector(".month-title");
  let container = monthContainer.querySelector(".days");

  container.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = 32 - new Date(year, month, 32).getDate();

  monthTitle.textContent = months[month] + " " + year;
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("prev-month");
    container.appendChild(emptyDiv);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    const infoDayContainer = document.createElement("div");
    let date = document.createElement("span");
    date.classList.add("span-date");
    date.textContent = day;
    infoDayContainer.append(date);
    if (
      items[currentYear] &&
      items[currentYear][currentMonth] &&
      items[currentYear][currentMonth][day]
    ) {
      infoDayContainer.append(setDayBoxInfo(day));
    }
    dayDiv.append(infoDayContainer);
    dayDiv.classList.add("day");
    if (
      day === currentDate.getDate() &&
      month === currentDate.getMonth() &&
      year === currentDate.getFullYear()
    ) {
      dayDiv.classList.add("today");
      let circle = document.createElement("span");
      circle.classList.add("today-circle");
      dayDiv.append(circle);
    } else {
      dayDiv.classList.remove("today");
    }
    container.appendChild(dayDiv);
  }
  const days = document.querySelectorAll(".day > div");
  days.forEach(function (day) {
    day.addEventListener("click", function () {
      setDayPanelInfo(infoMonth, day);
    });
  });
  setInfoMonth(months[month] + " " + year, infoYear);
}
function addNote(dataInput) {
  let currentDay =
    monthTitleInfo.textContent[monthTitleInfo.textContent.length - 2] +
    monthTitleInfo.textContent[monthTitleInfo.textContent.length - 1];
  currentDay = currentDay.trim();
  if (
    items[currentYear] &&
    items[currentYear][currentMonth] &&
    items[currentYear][currentMonth][currentDay]
  ) {
    items[currentYear][currentMonth][currentDay].push({
      type: "Notes",
      note: dataInput,
    });
  } else {
    if (!items[currentYear]) {
      items[currentYear] = {
        [currentMonth]: {
          [currentDay]: [
            {
              type: "Notes",
              note: dataInput,
            },
          ],
        },
      };
    } else if (!items[currentYear][currentMonth]) {
      items[currentYear][currentMonth] = {
        [currentDay]: [
          {
            type: "Notes",
            note: dataInput,
          },
        ],
      };
    } else if (!items[currentYear][currentMonth][currentDay]) {
      items[currentYear][currentMonth][currentDay] = [
        {
          type: "Notes",
          note: dataInput,
        },
      ];
    }
  }
  let dayElement = getDayElement(currentDay);
  setNotesItems(dataInput, currentDay, dayElement);
  storeItems(currentDay, {
    type: "Notes",
    note: dataInput,
  });
}
function addInfo(dataInput, descriptionInfo) {
  let currentDay =
    monthTitleInfo.textContent[monthTitleInfo.textContent.length - 2] +
    monthTitleInfo.textContent[monthTitleInfo.textContent.length - 1];
  currentDay = currentDay.trim();
  if (
    items[currentYear] &&
    items[currentYear][currentMonth] &&
    items[currentYear][currentMonth][currentDay]
  ) {
    items[currentYear][currentMonth][currentDay].push({
      type: addNumberInput.placeholder,
      amount: dataInput,
      description: descriptionInfo,
    });
  } else {
    if (!items[currentYear]) {
      items[currentYear] = {
        [currentMonth]: {
          [currentDay]: [
            {
              type: addNumberInput.placeholder,
              amount: dataInput,
              description: descriptionInfo,
            },
          ],
        },
      };
    } else if (!items[currentYear][currentMonth]) {
      items[currentYear][currentMonth] = {
        [currentDay]: [
          {
            type: addNumberInput.placeholder,
            amount: dataInput,
            description: descriptionInfo,
          },
        ],
      };
    } else if (!items[currentYear][currentMonth][currentDay]) {
      items[currentYear][currentMonth][currentDay] = [
        {
          type: addNumberInput.placeholder,
          amount: dataInput,
          description: descriptionInfo,
        },
      ];
    }
  }
  let dayElement = getDayElement(currentDay);
  setInfoNumberItems(
    {
      type: addNumberInput.placeholder,
      amount: dataInput,
      description: descriptionInfo,
    },
    currentDay,
    dayElement
  );
  showCalendar(currentMonth, currentYear);
  storeItems(currentDay, {
    type: addNumberInput.placeholder,
    amount: dataInput,
    description: descriptionInfo,
  });
}

function getDayElement(day) {
  let element;
  document.querySelectorAll(".day").forEach(function (days) {
    if (days.children[0].children[0].textContent === day) {
      element = days;
    }
  });
  return element;
}

function getNumberFormat(number) {
  const formattedNumber = parseFloat(number).toFixed(2);

  let [integerPart, decimalPart] = formattedNumber.split(".");

  let newIntegerPart = "";
  let cont = 0;

  for (let i = integerPart.length - 1; i >= 0; i--) {
    newIntegerPart += integerPart[i];
    cont++;
    if (i != 0 && cont % 3 === 0) {
      newIntegerPart += ",";
      cont = 0;
    }
  }
  newIntegerPart = newIntegerPart.split("").reverse().join("");
  return `$${newIntegerPart}.${decimalPart}`;
}
function getValues(currentItems, value) {
  return currentItems[value] ?? false;
}
function getWeekDay(day) {
  switch (new Date(currentYear, currentMonth, day).getDay()) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
  }
}
function getTotalIncome(dayInfo) {
  let totalIncome = 0;
  dayInfo.forEach((info) => {
    if (info.type === "Income") {
      totalIncome += info.amount;
    }
  });
  return totalIncome;
}
function getTotalExpenses(dayInfo) {
  let totalExpenses = 0;
  dayInfo.forEach((info) => {
    if (info.type === "Expenses") {
      totalExpenses += info.amount;
    }
  });
  return totalExpenses;
}
function getSymbol(type) {
  switch (type) {
    case "Expenses":
      return "-";
    case "Income":
      return "+";
  }
}

function setDayBoxInfo(day) {
  let div = document.createElement("div");
  let totalIncome = getTotalIncome(items[currentYear][currentMonth][day]);
  let totalExpenses = getTotalExpenses(items[currentYear][currentMonth][day]);
  if (totalIncome != 0) {
    let span = document.createElement("span");
    span.innerHTML = "+ " + getNumberFormat(totalIncome);
    span.classList.add("income-data");
    div.append(span);
  }
  if (totalExpenses != 0) {
    let span = document.createElement("span");
    span.innerHTML = "- " + getNumberFormat(totalExpenses);
    span.classList.add("expenses-data");
    div.append(span);
  }
  if (totalExpenses != 0 || totalIncome != 0) {
    let total = totalIncome - totalExpenses;
    let span = document.createElement("span");
    span.classList.add("total-data");

    if (total < 0) {
      total *= -1;
      span.classList.add("expenses-data");
      span.innerHTML = "- ";
    } else if (total > 0) {
      span.classList.add("income-data");
      span.innerHTML = "+ ";
    }

    span.innerHTML += getNumberFormat(total);

    div.append(span);
  }
  div.classList.add("day-info-container");
  return div;
}
function setDayPanelInfo(infoMonth, day) {
  infoMain.style.display = "flex";
  monthTitleInfo.textContent =
    getWeekDay(day.querySelector("span").textContent) +
    " " +
    day.querySelector("span").textContent;
  for (let i = infoItems.children.length - 1; i >= 1; i--) {
    infoItems.children[i].remove();
  }
  let infoDay = getValues(infoMonth, day.querySelector("span").textContent);
  if (infoDay) {
    infoDay.forEach(function (info) {
      if (info.type != "Notes") {
        setInfoNumberItems(info, day.querySelector("span").textContent, day);
      } else {
        setNotesItems(info.note, day.querySelector("span").textContent, day);
      }
    });
  }
}

function showUserPanel(info, day, dayElement) {
  const header = document.querySelector("header");
  const main = document.querySelector("main");

  header.style.pointerEvents = "none";
  main.style.pointerEvents = "none";

  userPanel.classList.add("fade-up");
  let buttons = userPanel.querySelector(".panel-buttons");
  buttons.children[0].addEventListener("click", function () {
    userPanel.classList.remove("fade-up");
    header.style.pointerEvents = "auto";
    main.style.pointerEvents = "auto";
    info = null;
    day = null;
    dayElement = null;
  });
  buttons.children[1].addEventListener("click", function () {
    if (info && day && dayElement) {
      header.style.pointerEvents = "auto";
      main.style.pointerEvents = "auto";
      deleteItem(info, day, dayElement);
    }
    userPanel.classList.remove("fade-up");
  });
}

function setInfoNumberItems(info, day, dayElement) {
  let type = info.type;
  let description = info.description;
  let amount = info.amount;
  let li = document.createElement("li");
  li.innerHTML = `<span class="${type.toLowerCase()}-data">${getSymbol(
    type
  )} ${getNumberFormat(
    amount
  )}</span><span class="description-data">${description}<span>`;
  li.classList.add("info-data");
  let button = document.createElement("button");
  button.innerHTML = '<i class="fa-solid fa-trash"></i>';
  button.classList.add("delete-item");
  button.classList.add("fade-out");
  button.addEventListener("click", function () {
    showUserPanel(info, day, dayElement);
  });
  li.append(button);
  infoItems.append(li);
  li.addEventListener("mouseover", function () {
    button.classList.remove("fade-out");
  });
  li.addEventListener("mouseleave", function () {
    button.classList.add("fade-out");
  });
}
function setNotesItems(note, day, dayElement) {
  let li = document.createElement("li");
  li.innerHTML = `<span class="notes-data">Note: ${note}</span>`;
  li.classList.add("info-data");
  let button = document.createElement("button");
  button.innerHTML = '<i class="fa-solid fa-trash"></i>';
  button.classList.add("delete-item");
  button.classList.add("fade-out");
  button.addEventListener("click", function () {
    showUserPanel(note, day, dayElement);
  });
  li.append(button);
  infoItems.append(li);
  li.addEventListener("mouseover", function () {
    button.classList.remove("fade-out");
  });
  li.addEventListener("mouseleave", function () {
    button.classList.add("fade-out");
  });
}

function deleteItem(info, day, dayElement) {
  updateItem(day, info);
  if (info.description || info.amount) {
    items[currentYear][currentMonth][day] = items[currentYear][currentMonth][
      day
    ].filter(function (data) {
      if (
        data.amount === info.amount &&
        data.description === info.description &&
        data.type === info.type
      ) {
        info = "";
      } else {
        return data;
      }
    });
  } else {
    items[currentYear][currentMonth][day] = items[currentYear][currentMonth][
      day
    ].filter(function (data) {
      if (data.note === info) {
        info = "";
      } else {
        return data;
      }
    });
  }
  let infoYear = getValues(items, currentYear);
  let infoMonth = getValues(infoYear, currentMonth);
  setDayPanelInfo(infoMonth, dayElement);
  showCalendar(currentMonth, currentYear);
}

addBtn.addEventListener("click", function () {
  if (
    addNumberInput.value.trim() &&
    parseFloat(addNumberInput.value).toFixed(2) !== 0 &&
    addNumberInput.value.length <= 14 &&
    addDescriptionInput.value.length <= 50
  ) {
    if (
      addNumberInput.placeholder != "Notes" &&
      !isNaN(parseFloat(addNumberInput.value))
    ) {
      addInfo(parseFloat(addNumberInput.value), addDescriptionInput.value);
      addNumberInput.value = "";
      addDescriptionInput.value = "";
    } else if (addNumberInput.placeholder == "Notes") {
      addNote(addNumberInput.value);
      addNumberInput.value = "";
      addDescriptionInput.value = "";
    }
  }
});
changeBtn.addEventListener("click", function () {
  changePanel.classList.toggle("displayed");
  changeBtn.children[0].classList.add("rotate");

  if (changePanel.classList.contains("displayed")) {
    changePanel.children[0].style.bottom = "0";
  } else {
    hideChangePanel();
  }
});

prevBtn.addEventListener("click", () => {
  infoMain.style.display = "none";
  if (showYear) {
    currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
  } else {
    currentYear--;
    showMonths(currentYear);
  }
});
nextBtn.addEventListener("click", () => {
  infoMain.style.display = "none";
  if (showYear) {
    currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    showCalendar(currentMonth, currentYear);
  } else {
    currentYear++;
    showMonths(currentYear);
  }
});

document.addEventListener("click", function (e) {
  if (e.target != changePanel && e.target != changeBtn) {
    hideChangePanel();
  }
});

addNumberInput.addEventListener("keydown", function (e) {
  if (addNumberInput.placeholder != "Notes") {
    if (
      e.key != "Backspace" &&
      e.key != "ArrowLeft" &&
      e.key != "ArrowRight" &&
      e.key != "Delete"
    ) {
      e.preventDefault();
    }
    if (
      addNumberInput.value.length < 10 &&
      !addNumberInput.value.includes(".")
    ) {
      if (!isNaN(parseInt(e.key)) || e.key == ".") {
        addNumberInput.value += e.key;
      }
    } else {
      if (
        addNumberInput.value.length < 13 &&
        addNumberInput.value.includes(".")
      ) {
        if (e.key != ".") {
          if (!isNaN(parseInt(e.key))) {
            addNumberInput.value += e.key;
          }
        }
      }
    }
    if (
      addNumberInput.value.length == 10 &&
      !addNumberInput.value.includes(".")
    ) {
      if (e.key == ".") {
        addNumberInput.value += e.key;
      }
    }
  }
});

changeOptions.forEach(function (changeOption) {
  changeOption.addEventListener("click", function () {
    if (changePanel.classList.contains("displayed")) {
      inputsContainer.classList.remove("income");
      inputsContainer.classList.remove("expenses");
      inputsContainer.classList.remove("notes");
      addNumberInput.placeholder = changeOption.textContent;
      inputsContainer.classList.add(changeOption.textContent.toLowerCase());
      changeBtn.innerHTML =
        changeOption.textContent +
        "<i class='fa-solid fa-chevron-down info-btn-change-icon'></i>";
      hideChangePanel();
      addNumberInput.value = "";
      addDescriptionInput.value = "";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  storedItems = data.map((a) => {
    return a;
  });
  setItems();
  showCalendar(currentMonth, currentYear);
  let infoYear = getValues(items, currentYear);
  let infoMonth = getValues(infoYear, currentMonth);
  let date = new Date();
  document.querySelectorAll(".day > div").forEach(function (d) {
    if (d.querySelector("span").textContent == date.getDate()) {
      setDayPanelInfo(infoMonth, d);
    }
  });
  // data.forEach((dataItem) => {
  //   items.push(dataItem);
  // });
});

let averageChart;
const averageGraphic = document.getElementById("average-graphic");

function setInfoMonth(month, infoYear) {
  let infoMonth = getValues(infoYear, currentMonth);

  const monthTitle = document.querySelector(".month-info h2");
  monthTitle.textContent = month;

  const daysInMonth = 32 - new Date(currentYear, currentMonth, 32).getDate();

  let x = [];
  let yIncome = [];
  let yExpenses = [];
  let yAverage = [];

  let totalIncome = 0;
  let totalExpenses = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    x.push(day);
    yIncome.push(getDayValues(day, infoMonth, "Income"));
    yExpenses.push(getDayValues(day, infoMonth, "Expenses") * -1);
    yAverage.push(yIncome[day - 1] + yExpenses[day - 1]);
  }
  totalIncome = getMonthValues(infoMonth, "Income", daysInMonth);
  totalExpenses = getMonthValues(infoMonth, "Expenses", daysInMonth);

  if (averageChart) {
    averageChart.destroy();
  }
  averageChart = new Chart(averageGraphic, {
    type: "line",
    data: {
      labels: x,
      datasets: [
        {
          pointBorderWidth: 0,
          label: "Average",
          data: yAverage,
          borderWidth: 1,
          fill: false,
          backgroundColor: "#a96cbb",
          borderColor: "#b50fe6",
          tension: 0.4,
          pointRadius: function (context) {
            const value = context.raw;
            return value === 0 ? 0 : 3;
          },
        },
        {
          pointBorderWidth: 0,

          label: "Income",
          data: yIncome,
          borderWidth: 1,
          fill: false,
          borderColor: "#0c6fe9",
          backgroundColor: "#3777c6",
          tension: 0.4,
          pointRadius: function (context) {
            const value = context.raw;
            return value === 0 ? 0 : 3;
          },
        },
        {
          pointBorderWidth: 0,

          label: "Expenses",
          data: yExpenses,
          borderWidth: 1,
          fill: false,
          borderColor: "#c71a1a",
          backgroundColor: "#f45858",
          tension: 0.4,
          pointRadius: function (context) {
            const value = context.raw;
            return value === 0 ? 0 : 3;
          },
        },
      ],
    },
    options: {
      scales: {
        x: {
          beginAtZero: true,
        },
      },
    },
  });

  const monthIncome = document.querySelector(".month-income");
  monthIncome.textContent = "Income: " + getNumberFormat(totalIncome);

  const monthExpenses = document.querySelector(".month-expenses");
  monthExpenses.textContent = "Expenses: -" + getNumberFormat(totalExpenses);

  const monthAverage = document.querySelector(".month-average");
  monthAverage.textContent =
    "Average: " +
    (totalIncome - totalExpenses >= 0
      ? getNumberFormat(totalIncome - totalExpenses)
      : "- " + getNumberFormat(-1 * (totalIncome - totalExpenses)));

  const performance = document.querySelector(".performance");

  let previousMonth = currentMonth - 1 === -1 ? 0 : currentMonth - 1;
  let previousInfoMonth = getValues(infoYear, previousMonth);

  let daysPreviousMonth =
    32 - new Date(currentYear, previousMonth, 32).getDate();

  let previousTotalMonth =
    (getMonthValues(previousInfoMonth, "Income", daysPreviousMonth) * 100) /
    getMonthValues(previousInfoMonth, "Expenses", daysPreviousMonth);

  let actualTotalMonth =
    (((totalIncome * 100) / totalExpenses) * 100) / previousTotalMonth;

  let average = 0;

  if (previousTotalMonth !== 0 && totalIncome - totalExpenses !== 0) {
    average = (actualTotalMonth / previousTotalMonth).toFixed(1) ?? 0;
  }

  performance.children[1].textContent = 0;
  performance.children[0].style.display = "none";
  performance.children[0].classList.remove("fa-angle-up");
  performance.children[0].classList.remove("fa-angle-down");
  performance.style.color = "#545454";
  if (average != "NaN" && average) {
    performance.children[1].textContent = average;
    performance.children[0].style.display = "inline";
    if (average >= 1) {
      performance.children[0].classList.add("fa-angle-up");
      performance.style.color = "#067910";
    } else if (average < 1) {
      performance.children[0].classList.add("fa-angle-down");
      performance.style.color = "#c71a1a";
    }
  }

  const monthList = document.querySelector(".month-list-items");
  monthList.innerHTML = "";

  let monthEntries = Object.keys(infoMonth);
  for (let i = 0; i < monthEntries.length; i++) {
    let date = document.createElement("span");
    date.textContent = "Day " + monthEntries[i];
    let items = document.createElement("div");
    infoMonth[monthEntries[i]].forEach(function (info) {
      if (info.type === "Income" || info.type === "Expenses") {
        let item = document.createElement("div");
        let amount = document.createElement("span");
        let description = document.createElement("span");

        info.type === "Expenses"
          ? (amount.textContent = "-" + getNumberFormat(info.amount))
          : (amount.textContent = getNumberFormat(info.amount));
        description.textContent = info.description;
        item.append(amount, description);
        items.append(item);
      }
    });
    monthList.append(date, items);
  }
}

function getDayValues(day, infoMonth, type) {
  if (infoMonth[day]) {
    let suma = 0;
    infoMonth[day].forEach(function (item) {
      if (item.type === type) {
        suma += item.amount;
      }
    });
    return suma;
  }
  return 0;
}

function getMonthValues(infoMonth, type, daysInMonth) {
  let totalValues = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    totalValues += getDayValues(day, infoMonth, type);
  }
  return totalValues;
}

function storeItems(day, infoDay) {
  let newData = {};
  if (infoDay.note) {
    newData = {
      fecha: `${currentYear}-${currentMonth + 1}-${day}`,
      descripcion: infoDay.note,
      importe: 0,
      tipo: infoDay.type,
    };
  } else {
    newData = {
      fecha: `${currentYear}-${currentMonth + 1}-${day}`,
      descripcion: infoDay.description,
      importe: infoDay.amount,
      tipo: infoDay.type,
    };
  }

  $.ajax({
    url: "/createNota",
    data: JSON.stringify(newData),
    contentType: "application/json",
    type: "POST",
    success: function (response) {
      $.ajax({
        url: "/getNotas",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
          storedItems = response;
        },
        error: function (error) {
          console.error(error);
        },
      });
    },
    error: function (error) {
      console.error(error);
    },
  });
}

document.querySelector(".sign-out").addEventListener("click", function () {
  window.location.href = "/logout";
});

// window.addEventListener("resize", function () {
//   averageGraphic.style.width = "100%";
//   averageGraphic.width = "100%";
//   console.log("averageGraphic");
// });

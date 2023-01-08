/*var obj = { nissan: "sentra", color: "green" };

if (localStorage.getItem("myStorage") === null)
  localStorage.setItem("myStorage", JSON.stringify([]));

console.log(JSON.parse(localStorage.getItem("myStorage")));
let data = JSON.parse(localStorage.getItem("myStorage"));
data.push(obj);
localStorage.setItem("myStorage", JSON.stringify(data));
var obj = JSON.parse(localStorage.getItem("myStorage"));

console.log(obj);
*/

const startBtn = document.querySelector("#start");
const nameInp = document.querySelector("#name");
const menu = document.querySelector("#menu");
const mapSel = document.querySelector("#map");
const table = document.querySelector("#table");
const wlBtn = document.querySelector("#wl");
const wlh = document.querySelector("#wlh");
const game = document.querySelector("#game");
const gamename = document.querySelector("#gamename");
const timer = document.querySelector("#timer");
const res = document.querySelector("#res");
const res_list = document.querySelector("#res-list");
const save = document.querySelector("#save");
const save_list = document.querySelector("#save-list");
const saveBtn = document.querySelector("#save-btn");

let timerInt;
let timerVal = 0;

let namee = "";
let map = [];
let cells = [];
let sec = 0;
let win = false;

let a = [[], [], [], []];
/*
 * map values :
 * -1 : feher mezo / nem tortent vele semmi
 * -2 : fekete mezo ertek nelkul
 * -3 : lámpa van a cellán
 * -4 : világít a cella
 */
const map1 = [
  [-1, -1, -1, 1, -1, -1, -1],
  [-1, 0, -1, -1, -1, 2, -1],
  [-1, -1, -1, -1, -1, -1, -1],
  [-2, -1, -1, -2, -1, -1, -2],
  [-1, -1, -1, -1, -1, -1, -1],
  [-1, -2, -1, -1, -1, 2, -1],
  [-1, -1, -1, 3, -1, -1, -1],
];

const map2 = [
  [-1, -1, 0, -1, -2, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1],
  [-2, -1, -2, -1, 3, -1, -2],
  [-1, -1, -1, 1, -1, -1, -1],
  [2, -1, -2, -1, -2, -1, -2],
  [-1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -2, -1, 2, -1, -1],
];

const map3 = [
  [-1, -2, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, 3, -1, 2, -1, -2],
  [-1, 0, -2, -1, -1, -1, -1, -2, -1, -1],
  [-1, -1, -1, -1, -2, -1, -1, -1, -1, -1],
  [-1, 1, -1, -1, -2, 1, -2, -1, -1, -1],
  [-1, -1, -1, -2, -2, -2, -1, -1, 3, -1],
  [-1, -1, -1, -1, -1, -2, -1, -1, -1, -1],
  [-1, -1, 1, -1, -1, -1, -1, 0, -2, -1],
  [3, -1, -2, -1, 0, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, 0, -1],
];

//displaying save list
save.addEventListener("click", () => {
  save_list.innerHTML = "";
  save_list.classList.toggle("hidden");
  let data = JSON.parse(localStorage.getItem("mySaves"));
  for (let i = 0; i < data.length; ++i) {
    let li = document.createElement("li");
    li.innerHTML =
      "Név : " +
      data[i].name +
      " , Idő : " +
      data[i].time +
      ", Pálya : " +
      data[i].map;
    //making button to be able to load saves
    let btn = document.createElement("button");
    btn.classList.add("continue");
    btn.innerHTML = "Folytatás";
    btn.addEventListener("click", () => {
      //STARTING POINT
      timer.innerHTML = "Eltelt idő: " + data[i].time;
      save_list.className = "hidden";
      res_list.className = "hidden";
      saveBtn.classList.remove("hidden");
      namee = data[i].name;
      timerVal = data[i].time;
      switch (data[i].map) {
        case "Könnyű 7x7":
          map = map1;
          break;
        case "Haladó 7x7":
          map = map2;
          break;
        case "Extrém 10x10":
          map = map3;
      }
      cells = [];
      menu.classList.add("hidden");
      win = false;
      nameInp.style.boxShadow = "";
      let s = Date.now() - Math.round(timerVal * 1000);
      timerInt = setInterval(function () {
        let d = Date.now() - s;
        timerVal = Math.round(d / 1000);
        timer.innerHTML = "Eltelt idő: " + timerVal;
      }, 1000);
      gamename.innerHTML = "Játékos neve: " + namee;
      game.classList.remove("hidden");
      wlBtn.classList.add("hidden");
      drawMapSaved(data[i].cells);
      checkBtn();
    });
    li.append(btn);
    save_list.append(li);
  }
});

function drawMapSaved(c) {
  for (let i = 0; i < c.length; ++i) {
    let row = document.createElement("tr");
    let r = [];
    for (let j = 0; j < c[i].length; ++j) {
      let sc = c[i][j]; //copy cell
      let cell = document.createElement("td");
      //adding value / x / y to cell to do logic easier
      cell.value = sc.value;
      cell.done = sc.done;
      cell.count = sc.count;
      cell.x = sc.x;
      cell.y = sc.y;
      switch (sc.value) {
        case -2:
          cell.classList.add("black");
          break;
        case -1:
          break;
        case -4:
          cell.classList.add("yellow");
          break;
        case -3:
          cell.classList.add("yellow");
          let img = document.createElement("img");
          img.src = "pic/lamp.png";
          img.style.width = "40px";
          img.classList.add("inactiveLink"); //this makes the img "unclickable" to avoid bugs
          cell.append(img);
          break;
        default:
          cell.classList.add("black");
          cell.innerHTML = sc.value;
      }
      row.append(cell);
      r.push(cell);
    }
    table.append(row);
    cells.push(r);
  }
  console.log(cells);
}

//making savies
saveBtn.addEventListener("click", () => {
  win = true;
  clearInterval(timerInt);
  game.classList.add("hidden");
  menu.classList.remove("hidden");
  table.innerHTML = "";
  table.classList.remove("inactiveLink");
  //pushing data to localStorage
  let predata = JSON.parse(localStorage.getItem("mySaves"));
  let md = [];
  for (let i = 0; i < cells.length; ++i) {
    let r = [];
    for (let j = 0; j < cells[i].length; ++j) {
      let c = cells[i][j];
      let d = `{"x":${c.x}, "y":${c.y}, "value":${c.value}, "count":${c.count}, "done":${c.done}}`;
      r.push(d);
    }
    md.push("[" + r.toString() + "]");
  }
  md = "[" + md.toString() + "]";
  let m;
  switch (map) {
    case map1:
      m = "Könnyű 7x7";
      break;
    case map2:
      m = "Haladó 7x7";
      break;
    case map3:
      m = "Extrém 10x10";
  }
  let data = JSON.parse(
    `{"name":"${namee}", "map":"${m}", "time":${timerVal}, "cells":${md}}`
  );
  predata.push(data);
  localStorage.setItem("mySaves", JSON.stringify(predata));
});

//making previous list
res.addEventListener("click", () => {
  res_list.innerHTML = "";
  res_list.classList.toggle("hidden");
  let data = JSON.parse(localStorage.getItem("myStorage"));
  for (let i = 0; i < data.length; ++i) {
    let li = document.createElement("li");
    li.innerHTML =
      "Név : " +
      data[i].name +
      " , Idő : " +
      data[i].time +
      ", Pálya : " +
      data[i].map;
    res_list.append(li);
  }
});

//localStorage initialization
if (localStorage.getItem("myStorage") === null)
  localStorage.setItem("myStorage", JSON.stringify([]));

if (localStorage.getItem("mySaves") === null)
  localStorage.setItem("mySaves", JSON.stringify([]));

//pressing the start button: game starts
startBtn.addEventListener("click", () => {
  //check if name is given
  if (nameInp.value != "") {
    namee = nameInp.value;
    menu.classList.add("hidden");
    switch (mapSel.value) {
      case "1":
        map = map1;
        break;
      case "2":
        map = map2;
        break;
      case "3":
        map = map3;
    }
    start();
  } else {
    nameInp.style.boxShadow = "1px -1px 5px 3px red";
  }
});

//menu btn event
wlBtn.addEventListener("click", () => {
  game.classList.add("hidden");
  menu.classList.remove("hidden");
  table.innerHTML = "";
  wlh.innerHTML = "";
  table.classList.remove("inactiveLink");
});

//making table with data
table.addEventListener("click", (e) => {
  if (
    e.target.matches("td") &&
    (e.target.value == -1 || e.target.value == -4)
  ) {
    //clicking on white or yellow cell
    let img = document.createElement("img");
    img.src = "pic/lamp.png";
    img.style.width = "40px";
    img.classList.add("inactiveLink"); //this makes the img "unclickable" to avoid bugs
    e.target.append(img);
    e.target.value = -3;
    e.target.className = "";
    e.target.classList.add("yellow");
    makeLight(e.target, "yellow");
    checkBtn();
    checkWin();
  }
  //clicking on lamp
  else if (e.target.matches("td") && e.target.value == -3) {
    e.target.innerHTML = "";
    if (e.target.count > 0) e.target.value = -4;
    else e.target.value = -1;
    e.target.className = "";
    e.target.classList.add("yellow");
    removeLamp(e.target);
    checkBtn();
  }
});

function start() {
  save_list.className = "hidden";
  res_list.className = "hidden";
  win = false;
  saveBtn.classList.remove("hidden");
  nameInp.style.boxShadow = "";
  timer.innerHTML = "Eltelt idő: " + "0";
  let s = Date.now();
  timerInt = setInterval(function () {
    let d = Date.now() - s;
    timerVal = Math.round(d / 1000);
    timer.innerHTML = "Eltelt idő: " + timerVal;
  }, 1000);
  gamename.innerHTML = "Játékos neve: " + namee;
  cells = [];
  game.classList.remove("hidden");
  wlBtn.classList.add("hidden");
  drawMap();
  checkBtn();
}

//checking if all black cells are green
function checkBtnGreen() {
  for (let i = 0; i < cells.length; ++i) {
    for (let j = 0; j < cells[i].length; ++j) {
      if (cells[i][j].value >= 0 && !cells[i][j].done) return false;
    }
  }
  return true;
}

//checks if a black cell value equals to its neighbours count
function checkBtn() {
  for (let i = 0; i < cells.length; ++i) {
    for (let j = 0; j < cells[i].length; ++j) {
      let c = 0;
      let cell = cells[i][j];
      if (cell.value >= 0) {
        if (i < cells.length - 1 && cells[i + 1][j].value == -3) ++c;
        if (i > 0 && cells[i - 1][j].value == -3) ++c;
        if (j < cells[i].length - 1 && cells[i][j + 1].value == -3) ++c;
        if (j > 0 && cells[i][j - 1].value == -3) ++c;
        if (c == cell.value) {
          cell.style.color = "#7CFC00";
          cell.done = true;
        } else cell.style.color = "white";
      }
    }
  }
}

function removeLamp(e) {
  --e.count;
  if (e.count == 0) {
    e.className = "";
  }
  //right
  for (let i = e.y + 1; i < map.length; ++i) {
    let c = cells[e.x][i];
    if (!removeLampHelpFunc(c)) break;
  }
  //left
  for (let i = e.y - 1; i >= 0; --i) {
    let c = cells[e.x][i];
    if (!removeLampHelpFunc(c)) break;
  }
  //up
  for (let i = e.x - 1; i >= 0; --i) {
    let c = cells[i][e.y];
    if (!removeLampHelpFunc(c)) break;
  }
  //down
  for (let i = e.x + 1; i < map[e.y].length; ++i) {
    let c = cells[i][e.y];
    if (!removeLampHelpFunc(c)) break;
  }
  checkWin();
}

function removeLampHelpFunc(c) {
  if (c.value == -1 || c.value == -4) {
    --c.count;
    if (c.count == 0) {
      c.className = "";
    }
    return true;
  } else if (c.value == -3) {
    --c.count;
    if (c.count == 1) {
      c.className = "";
      c.classList.add("yellow");
    }
    return true;
  }
  return false;
}

function drawMap() {
  for (let i = 0; i < map.length; ++i) {
    let row = document.createElement("tr");
    let r = [];
    for (let j = 0; j < map[i].length; ++j) {
      let cell = document.createElement("td");
      //adding value / x / y to cell to do logic easier
      cell.value = map[i][j];
      cell.done = false;
      cell.count = 0;
      cell.x = i;
      cell.y = j;
      switch (map[i][j]) {
        case -2:
          cell.classList.add("black");
          break;
        case -1:
          break;
        default:
          cell.classList.add("black");
          cell.innerHTML = map[i][j];
      }
      row.append(cell);
      r.push(cell);
    }
    table.append(row);
    cells.push(r);
  }
}

function makeLight(e, color) {
  a = [[], [], [], []];
  ++e.count;
  //right
  for (let i = e.y + 1; i < map.length; ++i) {
    let c = cells[e.x][i];
    if (!makeLightHelpFunc(e, color, c, 0)) break;
  }
  //left
  for (let i = e.y - 1; i >= 0; --i) {
    let c = cells[e.x][i];
    if (!makeLightHelpFunc(e, color, c, 1)) break;
  }
  //up
  for (let i = e.x - 1; i >= 0; --i) {
    let c = cells[i][e.y];
    if (!makeLightHelpFunc(e, color, c, 2)) break;
  }
  //down
  for (let i = e.x + 1; i < map[e.y].length; ++i) {
    let c = cells[i][e.y];
    if (!makeLightHelpFunc(e, color, c, 3)) break;
  }
  //animation
  table.classList.add("inactiveLink");
  for (let i = 0; i < 9; ++i) {
    (function () {
      setTimeout(function () {
        let c = 0;
        if (a[0].length > i) a[0][i].classList.add("yellow");
        else c++;
        if (a[1].length > i) a[1][i].classList.add("yellow");
        else c++;
        if (a[2].length > i) a[2][i].classList.add("yellow");
        else c++;
        if (a[3].length > i) a[3][i].classList.add("yellow");
        else c++;
        if (c == 4) i = 10;
      }, i * 40);
    })();
  }
  setTimeout(function () {
    if (!win) table.classList.remove("inactiveLink");
  }, 200); // this is for preventing timing bugs
}

function makeLightHelpFunc(e, color, c, ind) {
  if (c.value == -1 || c.value == -4) {
    c.value = -4;
    a[ind].push(c);
    //c.classList.add(color);
    ++c.count;
    return true;
  } else if (c.value == -3) {
    e.className = "";
    e.classList.add("red");
    c.className = "";
    c.classList.add("red");
    ++c.count;
    return true;
  } else {
    return false;
  }
}

function checkWin() {
  if (checkValues() && checkLights() && checkBtnGreen()) {
    win = true;
    wlh.innerHTML = "Nyertél!";
    wlh.style.color = "green";
    wlh.style.textAlign = "center";
    table.classList.add("inactiveLink");
    wlBtn.classList.remove("hidden");
    clearInterval(timerInt);
    saveBtn.classList.add("hidden");
    //pushing data to localStorage
    let predata = JSON.parse(localStorage.getItem("myStorage"));
    let m;
    switch (map) {
      case map1:
        m = "Könnyű 7x7";
        break;
      case map2:
        m = "Haladó 7x7";
        break;
      case map3:
        m = "Extrém 10x10";
    }
    let data = JSON.parse(
      `{"name":"${namee}", "map":"${m}", "time":${timerVal}}`
    );
    predata.push(data);
    localStorage.setItem("myStorage", JSON.stringify(predata));
  }
}

//checks if the values are not -1
function checkValues() {
  for (let i = 0; i < cells.length; ++i) {
    for (let j = 0; j < cells[i].length; ++j) {
      if (cells[i][j].value == -1) return false;
    }
  }
  return true;
}

//checks if light are not in the same row / column
function checkLights() {
  for (let i = 0; i < cells.length; ++i) {
    for (let j = 0; j < cells[i].length; ++j) {
      if (cells[i][j].value == -3) {
        if (!checkLight(cells[i][j])) return false;
      }
    }
  }
  return true;
}

//checks one exact light
function checkLight(e) {
  //right
  for (let i = e.y + 1; i < map.length; ++i) {
    let c = cells[e.x][i];
    if (c.value == -3) {
      return false;
    } else if (c.value != -4) {
      break;
    }
  }
  //left
  for (let i = e.y - 1; i >= 0; --i) {
    let c = cells[e.x][i];
    if (c.value == -3) {
      return false;
    } else if (c.value != -4) {
      break;
    }
  }
  //up
  for (let i = e.x - 1; i >= 0; --i) {
    let c = cells[i][e.y];
    if (c.value == -3) {
      return false;
    } else if (c.value != -4) {
      break;
    }
  }
  //down
  for (let i = e.x + 1; i < map[e.y].length; ++i) {
    let c = cells[i][e.y];
    if (c.value == -3) {
      return false;
    } else if (c.value != -4) {
      break;
    }
  }
  return true;
}

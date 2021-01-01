const n = 160;
const m = 320;

let rule = 30;
let unit = true;
let currGen = [n];


function getRule() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    rule = urlParams.get('rule') || 30;
    unit = (parseInt(urlParams.get('unit')) != 0);
    console.log(unit)

    let ruleElem = document.getElementById("rule");
    ruleElem.value = rule;

    let unitElem = document.getElementById("unit");
    unitElem.checked = unit;
}

function setRule(r) {
    rule = r;
    console.log(r);
}

function setUnit() {
    unit = document.getElementById('unit').checked;
}

function createWorld() {
    let world = document.querySelector("#world");
    let tbl = document.createElement("table");
    tbl.setAttribute("id", "worldgrid");

    for (let i = 0; i < n; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < m; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            tr.appendChild(cell);
        }
        tbl.appendChild(tr);
    }
    world.appendChild(tbl);
}

function createGenArrays() {
    for (let i = 0; i < n; i++) {
        currGen[i] = new Array(m);
    }
}

function convert2bin(dec) {
    let bin = (dec >>> 0).toString(2);
    return "0".repeat(8 - bin.length) + bin;
}

function generateInitialCondition() {
    let initialCondition = Array(m);
    for (let i = 0; i < m; i++) {
        initialCondition[i] = Math.round(Math.random());
    }
    return initialCondition;
}

function getValue(binRule, nrow, ncol) {
    let neighbours = Array(3);
    switch (ncol) {
        case 0:
        neighbours = [0].concat(currGen[nrow - 1].slice(0, 2));
        break;
        case m - 1:
        neighbours = currGen[nrow - 1].slice(m - 2).concat([0]);
        break;
        default:
        neighbours = currGen[nrow - 1].slice(ncol - 1, ncol + 2);
    }
    let pattern = 7 - parseInt(neighbours.join(""), 2);
    return parseInt(binRule[pattern]);
}


function updateCurrGen() {
    for (row in currGen) {
        for (col in currGen[row]) {
            currGen[row][col] = 0;
        }
    }
}

function updateWorld() {
    let cell = '';
    for (row in currGen) {
        for (col in currGen[row]) {
            cell = document.getElementById(row + '_' + col);
            if (currGen[row][col] == 0) {
                cell.setAttribute('class', 'dead');
            } else {
                cell.setAttribute('class', 'alive');
            }
        }
    }
}

function run() {
    updateCurrGen();
    updateWorld();

    const binRule = convert2bin(rule);
    let initial = Array(m).fill(0);

    if (unit) {
        initial[~~(m / 2)] = 1;
    } else {
        initial = generateInitialCondition();
    }

    currGen[0] = initial;
    let cell = '';

    for (let i = 1; i < n; i++) {
        for (let j = 0; j < m; j++) {
            currGen[i][j] = getValue(binRule, i, j);
        }
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (currGen[i][j] == 1) {
                cell = document.getElementById(i + '_' + j);
                cell.setAttribute('class', 'alive');
            }
        }
    }
}

window.onload=()=>{
    createWorld();
    createGenArrays();
    getRule();
    run();
}

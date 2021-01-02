const n = 115;
const m = 115;

let rule = 1;
let unit = true;
let currGen = [n];


function getRule() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    rule = urlParams.get('rule') || 1;
    unit = (parseInt(urlParams.get('unit')) != 0);

    let ruleElem = document.getElementById("rule");
    ruleElem.value = rule;

    let unitElem = document.getElementById("unit");
    unitElem.checked = unit;
}

function setRule(r) {
    rule = r;
}

function setUnit() {
    unit = document.getElementById('unit').checked;
}

function createWorld() {
    let world = document.querySelector('#world');

    for (let i = 0; i < n; i++) {
        let row = document.createElement('div');
        row.setAttribute('class', (i % 2) ? 'hex-row even': 'hex-row');

        for (let j = 0; j < m; j++) {
            let hex = document.createElement('div');
            hex.setAttribute('class', 'hex');
            hex.setAttribute('id', i + '_' + j);

            let top = document.createElement('div');
            top.setAttribute('class', 'top');
            let middle = document.createElement('div');
            middle.setAttribute('class', 'middle');
            let bottom = document.createElement('div');
            bottom.setAttribute('class', 'bottom');

            hex.appendChild(top);
            hex.appendChild(middle);
            hex.appendChild(bottom);

            row.appendChild(hex);
        }
    world.appendChild(row);
    }
}

function createGenArrays() {
    for (let i = 0; i < n; i++) {
        currGen[i] = new Array(m);
    }
}

function convert2bin(dec) {
    let bin = (dec >>> 0).toString(2);
    return "0".repeat(4 - bin.length) + bin;
}

function generateInitialCondition() {
    let initialCondition = Array(m);
    for (let i = 0; i < m; i++) {
        initialCondition[i] = Math.round(Math.random());
    }
    return initialCondition;
}

function getValue(binRule, nrow, ncol) {
    let neighbours = Array(2);
    switch (ncol) {
        case 0:
        neighbours = (nrow % 2) ? [0, currGen[nrow - 1][0]] : currGen[nrow - 1].slice(0, 2);
        break;
        case m - 1:
        neighbours = (nrow % 2) ? currGen[nrow - 1].slice(ncol, ncol + 2) : [currGen[nrow - 1][ncol], 0];
        break;
        default:
        neighbours = (nrow % 2) ? currGen[nrow - 1].slice(ncol, ncol + 2) : currGen[nrow - 1].slice(ncol -1 , ncol + 1);
    }
    let pattern = 3 - parseInt(neighbours.join(""), 2);
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
                cell.setAttribute('class', 'hex dead');
            } else {
                cell.setAttribute('class', 'hex alive');
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
                cell.setAttribute('class', 'hex alive');
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

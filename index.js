const interns = [
    " 1: Simon",
    " 2: Niklas",
    " 4: Raphael",
    " 6: Anna",
    " 7: Lea",
    " 8: Sebastian",
    " 9: Hanna",
    "10: Jonas",
    "11: Sophie",
    "12: Niklas",
    "14: Verena",
    "15: Anna",
    "16: Mathias",
    "17: Elias",
    "18: Philipp",
    "19: Aurelia",
    "20: Tobias",
    "21: Oliver",
    "22: Jonas",
    "23: Hanna",
    "24: Jonathan",
    "25: Lorenz"
]

const externs = [" 3: Ciro", " 5: Darcy"];

const simpleStrategy = false;

let advanced = true;
let timeouts = [];
let minGroupSize = 0;
let groupCount = 0;
let includeExterns = false;

let container;

window.onload = () => {
    container = document.getElementById('container');

    document.getElementById('icon').onclick = () => {
        advanced = !advanced;
    }
}

function start() {
    if (minGroupSize == 0) return;

    timeouts.forEach(n => {
        clearTimeout(n);
    })

    container.innerHTML = '';

    let groups = [];
    for (let i = 0; i < groupCount; i++) {
        groups[i] = [];
    }

    (!advanced ? () => {
        let localInterns = [...interns];
        shuffle(localInterns);

        for (let i = 0, k = 0; k < interns.length; i++) {
            for (let j = 0; j < groupCount && k < interns.length; j++) {
                groups[j][i] = localInterns[k];
                k++;
            }
        }

    } : () => {
        let sequence = Array.from(Array(interns.length).keys());
        shuffle(sequence);

        for (let i = 0; sequence.length != 0; i++) {
            for (let j = 0; j < groupCount && sequence.length != 0; j++) {
                let found = false;
                let last = sequence[sequence.length - 1];
                let index;
                while (!found && last != index) {
                    index = sequence.shift();
                    if ((simpleStrategy ? group => {
                        let good = [1, 5, 8, 13, 18, 20];
                        let bad = [2, 3, 4, 6, 7, 11, 12];
                        let is = [false, false];

                        group.forEach(m => {
                            is[0] = good.includes(m) ? true : is[0];
                            is[1] = bad.includes(m) ? true : is[1];
                        });

                        return (good.includes(index) && !is[1]) || (bad.includes(index) && !is[0]);
                    } : group => {
                        let best = [1, 5, 13];
                        let good = [8, 18, 15, 20];
                        let bad = [3, 12, 16, 17];
                        let worst = [2, 4, 7, 11];
                        let is = [false, false, false, false];

                        group.forEach(m => {
                            is[0] = best.includes(m) ? true : is[0];
                            is[1] = good.includes(m) ? true : is[1];
                            is[2] = bad.includes(m) ? true : is[2];
                            is[3] = worst.includes(m) ? true : is[3];
                        });

                        return (best.includes(index) && !is[2] && !is[3]) || (good.includes(index) && !is[3]) || (bad.includes(index) && !is[0]) || (worst.includes(index) && !is[0] && !is[1]);
                    })(groups[j])) {
                        groups[j][i] = index;
                        found = true;
                    } else {
                        sequence.push(index);
                    }
                }

                if (!found) {
                    groups[j][i] = sequence.pop();
                }
            }
        }

        groups.forEach(g => {
            g.forEach((m, i) => {
                g[i] = interns[m];
            });
        });
    })();

    if (includeExterns) {
        shuffle(externs);

        for (let i = 0; i < externs.length; i++) {
            let smallestGroup = [0, interns.length];

            for (let j = 0; j < groupCount; j++) {
                if (groups[j].length < smallestGroup[1]) {
                    smallestGroup = [j, groups[j].length];
                }
            }

            groups[smallestGroup[0]].push(externs[i]);
        }
    }

    groups.forEach(e => {
        shuffle(e);
    });
    shuffle(groups);

    for (let i = 0; i < groups.length; i++) {
        timeouts[i] = setTimeout(() => {
            renderGroup(i + 1, groups[i]);
        }, i * 1000);
    }
}

function input(elem) {
    let i = elem.value;

    if (1 < i && i <= interns.length / 2 + 1) {
        minGroupSize = i;
        groupCount = Math.floor(interns.length / i);
    } else {
        elem.value = minGroupSize != 0 ? minGroupSize : '';
    }
}

function check(b) {
    includeExterns = b;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderGroup(number, names) {
    let item = document.createElement('span');
    item.setAttribute('class', 'item border');

    let name = document.createElement('p');
    name.innerText = "Gruppe " + number + ":";

    let list = document.createElement('ul');
    list.setAttribute('class', 'group-names');

    names.forEach(n => {
        let entry = document.createElement('li');
        entry.innerText = n;
        list.appendChild(entry);
    });

    item.appendChild(name);
    item.appendChild(list);

    container.appendChild(item);
}

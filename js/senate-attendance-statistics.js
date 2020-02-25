// 1. Senate at a glance
var statistics = { Democrats: 0, Republicans: 0, Independent: 0, Total: 0 };

let dataMembers = "";
let url = document.URL;

if (url.includes("senate")) {
  url = "https://api.propublica.org/congress/v1/113/senate/members.json";
} else if (url.includes("house")) {
  url = "https://api.propublica.org/congress/v1/113/house/members.json";
} else {
  console.log("Not in the correct page");
}

fetch(url, {
  method: "GET",
  headers: {
    "X-API-Key": "NCquwND1AFmljskD7ssecslMskarwVXTrhUnX4Fj"
  }
})
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log(data);
    dataMembers = data.results[0].members;
    init();
    document.getElementById("loader").style.display = "none";
  })
  .catch(error => {
    console.log(error);
  });

function init() {
  getMembers(dataMembers);
  getVotes(dataMembers);

  getLeastEngaged(dataMembers);
  getMostEngaged(dataMembers);
  var tenLeast = getTenPct(getLeastEngaged(dataMembers));
  var tenMost = getTenPct(getMostEngaged(dataMembers));
  getLeastEngagedTable(tenLeast, "tbody1");
  getLeastEngagedTable(tenMost, "tbody2");
}

var containerD = [];
var containerR = [];
var containerI = [];

function getMembers(arr) {
  for (i = 0; i < arr.length; i++) {
    if (arr[i].party == "D") {
      containerD.push(arr[i].party);
    } else if (arr[i].party == "R") {
      containerR.push(arr[i].party);
    } else if (arr[i].party == "I") {
      containerI.push(arr[i].party);
    }
    var numRep = document.getElementById("rep");
    numRep.innerHTML = containerR.length;
    var numDem = document.getElementById("dem");
    numDem.innerHTML = containerD.length;
    var numInd = document.getElementById("ind");
    numInd.innerHTML = containerI.length;
    var numTotal = document.getElementById("numtotal");
    numTotal.innerHTML =
      containerR.length + containerD.length + containerI.length;
  }

  console.log(containerR.length + containerD.length + containerI.length);
}

function getVotes(arr) {
  var votesRepublican = [];
  var votesDemocrat = [];
  var votesIndependent = [];
  var sum = 0;
  var sum1 = 0;
  var sum2 = 0;
  for (i = 0; i < arr.length; i++) {
    if (arr[i].party == "R") {
      votesRepublican.push(arr[i].votes_with_party_pct);
    }
    if (arr[i].party == "D") {
      votesDemocrat.push(arr[i].votes_with_party_pct);
    }
    if (arr[i].party == "I") {
      votesIndependent.push(arr[i].votes_with_party_pct);
    }
  }
  for (j = 0; j < votesRepublican.length; j++) {
    if ((sum += votesRepublican[j])) {
      var averageRep = sum / votesRepublican.length;
    }
    var votRep = document.getElementById("vrep");
    votRep.innerHTML = averageRep.toFixed(2);
  }

  for (k = 0; k < votesDemocrat.length; k++) {
    if ((sum1 += votesDemocrat[k])) {
      var averageDem = sum1 / votesDemocrat.length;
    }
    var votDem = document.getElementById("vdem");
    votDem.innerHTML = averageDem.toFixed(2);
  }
  for (l = 0; l < votesIndependent.length; l++) {
    if ((sum2 += votesIndependent[l])) {
      var averageInd = sum2 / votesIndependent.length;
    }
    var votInd = document.getElementById("vind");
    votInd.innerHTML = averageInd.toFixed(2);
  }

  var totalAvg = parseFloat(
    (sum + sum1 + sum2) /
      parseInt(
        votesRepublican.length + votesDemocrat.length + votesIndependent.length
      )
  );
  var votTotal = document.getElementById("avgtotal");
  votTotal.innerHTML = totalAvg.toFixed(2);
  console.log(totalAvg);
}

// Least Engaged (Bottom 10% Attendance)

function getLeastEngagedTable(arr, id) {
  var body = document.getElementById(id);
  for (let i = 0; i < arr.length; i++) {
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");
    var link1 = document.createElement("a");
    link1.setAttribute("href", arr[i].url);
    link1.setAttribute("target", arr[i].url);
    var cell2 = document.createElement("td");
    var cell3 = document.createElement("td");

    // PARA CALCULAR EL %
    // let randNum = Math.random()
    // let randPct = (randNum * 100).toFixed(2) + '%'
    // console.log(randPct)

    link1.innerHTML =
      arr[i].first_name +
      " " +
      (arr[i].middle_name || " ") +
      " " +
      arr[i].last_name;
    cell2.innerHTML = arr[i].missed_votes;
    cell3.innerHTML = arr[i].missed_votes_pct;

    body.append(row);
    row.append(cell1, cell2, cell3);
    cell1.appendChild(link1);
  }
}

function getLeastEngaged(arr) {
  return [
    ...arr.sort(function(a, b) {
      return a.missed_votes_pct - b.missed_votes_pct;
    })
  ];
}

function getMostEngaged(arr) {
  return [
    ...arr.sort(function(a, b) {
      return b.missed_votes_pct - a.missed_votes_pct;
    })
  ];
}

function getTenPct(arr) {
  var arrTenPct = [];
  for (let i = 0; i < arr.length; i++) {
    if (i < 0.1 * arr.length) {
      arrTenPct.push(arr[i]);
    } else if (
      arrTenPct[arrTenPct.length - 1].missed_votes_pct ==
      arr[i].missed_votes_pct
    ) {
      arrTenPct.push(arr[i]);
    } else {
      break;
    }
  }
  return arrTenPct;
}

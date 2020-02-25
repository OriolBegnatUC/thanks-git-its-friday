let dataArray = "";
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
    dataArray = data.results[0].members;
    init();
  })
  .catch(error => {
    console.log(error);
  });

function init() {
  createFilterState(filterState(dataArray), "filtersselect");
  getFilters(dataArray, "senate-data");
}

var btnText = document.getElementById("check1");
var btnText2 = document.getElementById("check2");
var stateSelector = document.getElementById("filtersselect");
var btnText3 = document.getElementById("check3");

btnText.addEventListener("click", function() {
  getFilters(classifEstates(dataArray), "senate-data");
});

btnText2.addEventListener("click", function() {
  getFilters(classifEstates(dataArray), "senate-data");
});

btnText3.addEventListener("click", function() {
  getFilters(classifEstates(dataArray), "senate-data");
});

stateSelector.addEventListener("change", function() {
  getFilters(classifEstates(dataArray), "senate-data");
});

function getFilters(arr, id) {
  var containerFilter = [];
  for (let i = 0; i < arr.length; i++) {
    if (document.getElementById("check1").checked && arr[i].party == "D") {
      containerFilter.push(arr[i]);
    } else if (
      document.getElementById("check2").checked &&
      arr[i].party == "R"
    ) {
      containerFilter.push(arr[i]);
    } else if (
      document.getElementById("check3").checked &&
      arr[i].party == "I"
    ) {
      containerFilter.push(arr[i]);
    }
  }

  let dg_alert = document.getElementById("danger");

  if (
    document.getElementById("check1").checked && //si ind/rep/dem están checked y la array esta vacía, saldrá un mensaje.
    containerFilter.length == 0
  ) {
    dg_alert.innerHTML = "There are no Democrats";
    dg_alert.classList.remove("alert", "alert-danger");
    dg_alert.classList.add("alert", "alert-color");
  } else if (
    document.getElementById("check2").checked &&
    containerFilter.length == 0
  ) {
    dg_alert.innerHTML = "There are no Republicans";
    dg_alert.classList.remove("alert", "alert-danger");
    dg_alert.classList.add("alert", "alert-color");
  } else if (
    document.getElementById("check3").checked &&
    containerFilter.length == 0
  ) {
    dg_alert.innerHTML = "There are no Independents";
    dg_alert.classList.remove("alert", "alert-danger");
    dg_alert.classList.add("alert", "alert-color");
  } else if (containerFilter.length !== 0) {
    dg_alert.innerHTML = " "; //si la array no está vacía (se ha rellenado mediante algún checkbox), el mensaje y la clase desaparecerán.
    dg_alert.classList.remove("alert", "alert-danger");
  } else {
    dg_alert.innerHTML = "Please, select a Party"; //si nada de eso ocurre, saldrá la clase y un mensaje predeterminado.
    dg_alert.classList.remove("alert", "alert-danger");
    dg_alert.classList.add("alert", "alert-color");
  }

  createTable(containerFilter, id);
}

function filterState(arr) {
  var containerStates = [];
  for (let i = 0; i < arr.length; i++) {
    if (containerStates.includes(dataArray[i].state) === false) {
      containerStates.push(arr[i].state);
    }
  }
  console.log(containerStates);
  containerStates.sort();
  return containerStates;
}

function createFilterState(arr, id) {
  var options = document.getElementById(id);
  for (let i = 0; i < arr.length; i++) {
    var option1 = document.createElement("option");
    option1.innerHTML = arr[i];
    options.append(option1);
  }
}

function classifEstates(arr) {
  var classifArray = [];
  var classValue = stateSelector.value;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].state == classValue || classValue == "all") {
      classifArray.push(arr[i]);
    }
  }
  return classifArray;
}
console.log(classifEstates(dataArray));

function createTable(array, id) {
  var body = document.getElementById(id);
  body.innerHTML = " ";
  for (var i = 0; i < array.length; i++) {
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");
    var link1 = document.createElement("a");
    link1.setAttribute("href", array[i].url);
    link1.setAttribute("target", array[i].url);
    var cell2 = document.createElement("td");
    var cell3 = document.createElement("td");
    var cell4 = document.createElement("td");
    var cell5 = document.createElement("td");

    link1.innerHTML =
      array[i].first_name +
      " " +
      (array[i].middle_name || " ") +
      " " +
      array[i].last_name;
    cell2.innerHTML = array[i].party;
    cell3.innerHTML = array[i].state;
    cell4.innerHTML = array[i].seniority;
    cell5.innerHTML = array[i].votes_with_party_pct;

    body.append(row);
    row.append(cell1, cell2, cell3, cell4, cell5);
    cell1.appendChild(link1);
  }
}

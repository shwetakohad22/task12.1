function fetchData() {
  return new Promise((resolve, reject) => {
    fetch("https://data.covid19india.org/v4/min/timeseries.min.json")
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

const stateNameMapping = {
  AN: "Andaman and Nicobar Islands",
  AP: "Andhra Pradesh",
  AR: "Arunachal Pradesh",
  AS: "Assam",
  BR: "Bihar",
  CH: "Chandigarh",
  CT: "Chhattisgarh",
  DN: "Dadra and Nagar Haveli and Daman and Diu",
  DL: "Delhi",
  GA: "Goa",
  GJ: "Gujarat",
  HP: "Himachal Pradesh",
  HR: "Haryana",
  JH: "Jharkhand",
  JK: "Jammu and Kashmir",
  KA: "Karnataka",
  KL: "Kerala",
  LA: "Ladakh",
  LD: "Lakshadweep",
  MH: "Maharashtra",
  ML: "Meghalaya",
  MN: "Manipur",
  MP: "Madhya Pradesh",
  MZ: "Mizoram",
  NL: "Nagaland",
  OR: "Odisha",
  PB: "Punjab",
  PY: "Puducherry",
  RJ: "Rajasthan",
  SK: "Sikkim",
  TG: "Telangana",
  TN: "Tamil Nadu",
  TR: "Tripura",
  TT: "India",
  UP: "Uttar Pradesh",
  UT: "Uttarakhand",
  WB: "West Bengal",
};

function getFullStateName(stateCode) {
  return stateNameMapping[stateCode] || stateCode;
}

function createCards(data) {
  const stateCardsContainer = document.getElementById("stateCards");

  for (const stateCode in data) {
    const stateData = data[stateCode]?.dates || {};
    const latestDate = Object.keys(stateData).pop();
    const totalCases = stateData[latestDate]?.total || {};

    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${getFullStateName(stateCode)}</h5>
                    <p class="card-text">Total Cases: ${
                      totalCases.confirmed || 0
                    }</p>
                    <button class="btn btn-primary" onclick="viewStateData('${stateCode}', '${latestDate}')">View Details</button>
                </div>
            </div>
        `;

    stateCardsContainer.appendChild(card);
  }
}

function viewStateData(stateCode, latestDate) {
  const stateModalLabel = document.getElementById("stateModalLabel");
  const stateModalBody = document.getElementById("stateModalBody");

  const fullStateName = getFullStateName(stateCode);

  stateModalLabel.innerText = `${fullStateName} - COVID-19 Data`;

  const stateData = data[stateCode]?.dates[latestDate] || {};

  const modalContent = `
        <p>Confirmed Cases: ${stateData.total?.confirmed || 0}</p>
        <p>Recovered Cases: ${stateData.total?.recovered || 0}</p>
        <p>Deceased Cases: ${stateData.total?.deceased || 0}</p>
        <p>Tested Cases: ${stateData.total?.tested || 0}</p>
        <!-- Add more details as needed -->
    `;

  stateModalBody.innerHTML = modalContent;

  $("#stateModal").modal("show");
}

// Fetch data and create cards when the page loads
let data;

fetchData()
  .then((result) => {
    data = result;
    createCards(result);
  })
  .catch((error) => console.error("Error fetching data:", error));

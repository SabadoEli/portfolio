
//Pulling the API data
let chart;
let dailyMaxUV = {};
let currentLocation = "Berlin";

fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=uv_index&past_days=5&forecast_days=6")
  .then(res => res.json())
  .then(data => {
    const times = data.hourly.time;
    const uv = data.hourly.uv_index;
    currentLocation = "Berlin";

    for (let i = 0; i < times.length; i++) {
      const date = times[i].split("T")[0];

      // Ensure the day exists no matter what
      if (dailyMaxUV[date] === undefined) {
        dailyMaxUV[date] = null;
      }

      // Only update if UV value exists
      if (uv[i] != null) {
        if (dailyMaxUV[date] == null) {
          dailyMaxUV[date] = uv[i];
        } else {
          dailyMaxUV[date] = Math.max(dailyMaxUV[date], uv[i]);
        }
      }
    }

    console.log(dailyMaxUV);
    renderChart(handleSelection("future"));
  });

  const selector = document.getElementById("uvSelector");

selector.addEventListener("change", () => {
  const filtered = handleSelection(selector.value);
  renderChart(filtered);
});



//The Handle Select Section 
function handleSelection(type) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = {};

  for (const date in dailyMaxUV) {
    const [year, month, day] = date.split("-").map(Number);
    const currentDate = new Date(year, month - 1, day); 
    const diffDays = Math.floor((currentDate - today) / (1000 * 60 * 60 * 24));

  if (type === "future" && diffDays > 0 && diffDays <= 5) {
    result[date] = dailyMaxUV[date];
  }

  if (type === "past" && diffDays < 0 && diffDays >= -5) {
    result[date] = dailyMaxUV[date];
  }
  }

  console.log(type === "future" ? "Next 5 Days:" : "Previous 5 Days:", result);
  return result;
}


//Zip Code Conversion

const button = document.getElementById("searchBtn");
const input = document.getElementById("zipInput");

button.addEventListener("click", () => {
  const zip = input.value.trim();

  if (!zip) {
    console.log("Enter a zip code");
    return;
  }

  //Convert ZIP → lat/lon
  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${zip}`)
    .then(res => res.json())
    .then(geoData => {
      if (!geoData.results || geoData.results.length === 0) {
        console.log("Invalid ZIP or no results");
        return;
      }

      const { latitude, longitude, name } = geoData.results[0];
      currentLocation = name;
      console.log(`Location: ${name}`);

      //Fetch weather using lat/lon
      return fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=uv_index&past_days=5&forecast_days=6`
    );
    })
    .then(res => res.json())
    .then(weatherData => {
      if (!weatherData) return;

      const times = weatherData.hourly.time;
      const uv = weatherData.hourly.uv_index;

      dailyMaxUV = {};

      for (let i = 0; i < times.length; i++) {
        const date = times[i].split("T")[0];

        // Ensure the day exists no matter what
        if (dailyMaxUV[date] === undefined) {
          dailyMaxUV[date] = null;
        }

        // Only update if UV value exists
        if (uv[i] != null) {
          if (dailyMaxUV[date] == null) {
            dailyMaxUV[date] = uv[i];
          } else {
            dailyMaxUV[date] = Math.max(dailyMaxUV[date], uv[i]);
          }
        }
      }

      console.log("Updated UV Data:", dailyMaxUV);

      const selectedType = selector.value;
      const filtered = handleSelection(selectedType);
      renderChart(filtered);
    })
    
    .catch(err => console.error(err));
});

// Display the chart

function renderChart(data) {
  const dates = Object.keys(data).sort();
  const uvValues = dates.map(date => data[date]);

  const xValues = dates.map(date =>
    new Date(date).toLocaleDateString("en-US", { weekday: "long" })
  );

  const myChart = document.getElementById("myChart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(myChart, {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        label: "Today's Max UV Index",
        data: uvValues,
        backgroundColor: uvValues.map(uv => {
          if (uv <= 2) return "green";
          if (uv <= 5) return "yellow";
          if (uv <= 7) return "orange";
          if (uv <= 10) return "red";
          return "purple";
        })
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 11
        }
      }
    }
  });

  document.getElementById("locationLabel").textContent =
  `Location: ${currentLocation}`;
}
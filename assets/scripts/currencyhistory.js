async function getForexData() {

    const base = document.getElementById("baseCurrency").value.toUpperCase();
    const target = document.getElementById("targetCurrency").value.toUpperCase();
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    const apiKey = "n43nu3bpaSV_k9JHw0mK1v6vfqmsYqJ3";

    const pair = `C:${target}${base}`;

    const url = `https://api.polygon.io/v2/aggs/ticker/${pair}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        console.log(data); // see what comes back

        processData(data); // this is your function that builds dates & values

    } catch (error) {
        console.error("Error:", error);
    }
}

function processData(data) {

    let dates = [];
    let values = [];

    data.results.forEach(item => {

        let date = new Date(item.t);
        let formattedDate = date.toISOString().split("T")[0];

        dates.push(formattedDate);

        values.push(item.c);
    });

    renderChart(dates, values);
}

function renderChart(dates, values) {

    var ctx = document.getElementById("chartjs-0");

    new Chart(ctx, {
        "type":"line",
        "data": {
            "labels": dates,
            "datasets":[{
                "data": values,
                fill: false
            }]
        },
        "options":{ 
            responsive: false,
            maintainAspectRatio: true,
        }
    });
}
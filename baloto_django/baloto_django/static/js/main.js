/**
 * SOME CONSTANTS AND VARIABLES INITS
 */ 
console.log("JEJE");

//DJANGO API URL TO FETCH
const api_url = "http://localhost:8000",
//Number of balls in Baloto's game
numBalotas = 6;
/**
 * Once the API returns data ordered by dates by default, we will create an array with:
 * {
 *  ALLBALLS1: [1 - 2 - 3 - 4 - 5 - 6 - ... - N]
 *  ALLBALLS2: [1 - 2 - 3 - 4 - 5 - 6 - ... - N]
 *  ALLBALLS3: [1 - 2 - 3 - 4 - 5 - 6 - ... - N]
 *  ALLBALLS4: [1 - 2 - 3 - 4 - 5 - 6 - ... - N]
 *  ALLBALLS5: [1 - 2 - 3 - 4 - 5 - 6 - ... - N]
 *  ALLBALLS6: [1 - 2 - 3 - 4 - 5 - 6 - ... - N]
 * }
 */
fixedData = {}
//Element for calendar with the start date for fetching    
start_calendar = document.getElementById("start-calendar"),
//Element for calendar with the end date for fetching
end_calendar = document.getElementById("end-calendar"),
//Data conter for show fetching result
dataContent = document.getElementById("data-container"),
//STATS CONTENT
//Mean content
meansContent = document.getElementById("mean-el"),
//Standart deviation content
sdContent = document.getElementById("sd-el"),
//Var content
varContent = document.getElementById("var-el");

//Some default vals
let startDate = start_calendar.value,
endDate = end_calendar.value;

//Setting up listeners to calendars and button
start_calendar.addEventListener("change", (event) => {
    console.log("Calendar changed: ", start_calendar.value);
    startDate = start_calendar.value;
});

end_calendar.addEventListener("change", (event) => {
    console.log("Calendar changed: ", end_calendar.value);
    endDate = end_calendar.value;
});


//////////////////////////////////////////////////////////////////////////////////
///////  ADDING EVENT LISTENER TO THE START BUTTON . . . /////////////////////////
//////////////////////////////////////////////////////////////////////////////////
document.getElementById("start-button").addEventListener("click", event => {
    const url = new URL(api_url + "/get-data")
    const params = {
        "start-date": startDate, 
        "end-date": endDate
    }
    url.search = new URLSearchParams(params)

    const getData = async () => {
        const req = await fetch(url);
        const json = await req.json();
        return json.data;
    }

    const fillData = (allData) => {
        allData.forEach(monthData => {
            monthData.forEach(dayData => {
                const { numeros } = dayData;
                const { fecha } = numeros;
                dataContent.innerHTML += `
                <tr>
                    <td>${fecha}</td>
                    <td>${numeros["1"]}</td>
                    <td>${numeros["2"]}</td>
                    <td>${numeros["3"]}</td>
                    <td>${numeros["4"]}</td>
                    <td>${numeros["5"]}</td>
                    <td>${numeros["Superbalota"]}</td>
                </tr>
                `
            })
        });
    }

    const fillBalotasContent = async allData => {
        for (let cont = 1; cont <= numBalotas; cont ++){
            const data = [];
            const dates = []
            const index = ( cont <= 5 ) ? cont : "Superbalota"
            allData.forEach(monthData => {
                monthData.forEach(dayData => {
                    const { numeros } = dayData;
                    const { fecha } = numeros;
                    data.push(numeros[index])
                    dates.push(fecha);
                })
            });

            fixedData[index] = {
                balota: data,
                tiempo: dates
            }

            //Fetching api to get stats
            const req = await fetch(api_url + "/get-stats", {
                method: "POST",
                body: JSON.stringify({
                    "data": data
                }),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            const stats = await req.json();
            meansContent.innerHTML += `
                <td>${stats.mean}</td>
            `
            sdContent.innerHTML += `
                <td>${stats.sd}</td>
            `
            varContent.innerHTML += `
                <td>${stats.var}</td>
            `
        }

    }


    function drawGraphs(){
        for (let cont = 1; cont <= numBalotas; cont ++){
            const index = ( cont <= 5 ) ? cont : "Superbalota"

            console.log(fixedData);
            var trace = {
                x: fixedData[index].tiempo,
                y: fixedData[index].balota,
                mode: 'markers',
                type: 'scatter',
                name: 'Team A',
                text: ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'],
                marker: { size: 12 }
              };
            var layout = {
                xaxis: {
                    type: 'time'
                },
                yaxis: {
                    range: [0, 99]
                },
                title: "BALOTA: " + index
              };
            document.getElementById("graphics").innerHTML += `<div id="graph-${index}"> </div>`;
            Plotly.newPlot(`graph-${index}`,[trace], layout)
        }
 
    }

    main = async () => {
        const allData = await getData();
        await fillData(allData);
        await fillBalotasContent(allData);
        drawGraphs();
    }

    main();
    console.log("Start: ", startDate, "End: ", endDate);
})
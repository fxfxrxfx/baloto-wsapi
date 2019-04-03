/**
 * SOME CONSTANTS AND VARIABLES INITS
 */ 
console.log("JEJE");
const api_url = "http://localhost:8000",
start_calendar = document.getElementById("start-calendar"),
end_calendar = document.getElementById("end-calendar"),
dataContent = document.getElementById("data-container"),
meansContent = document.getElementById("mean-el"),
sdContent = document.getElementById("sd-el"),
varContent = document.getElementById("var-el");


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
        const numBalotas = 6;
        for (let cont = 1; cont <= numBalotas; cont ++){
            const data = []
            const index = ( cont <= 5 ) ? cont : "Superbalota"
            allData.forEach(monthData => {
                monthData.forEach(dayData => {
                    const { numeros } = dayData;
                    data.push(numeros[index])
                })
            });
            console.log(data)   
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

    const drawGraphs = allData => {

    }

    main = async () => {
        const allData = await getData();
        await fillData(allData);
        await fillBalotasContent(allData);
    }

    main();
    console.log("Start: ", startDate, "End: ", endDate);
})
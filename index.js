/**
 * Baloto's web page has an URL kinda: 
 * https://www.baloto.com/historicomes/ @year / @year_period
 * So what I'm going to do, to don't use Express, it'll be:
 * The url for this little API will need to have the same format / @year / @year_period in order
 * to work with Baloto's page
 */ 

var http = require("http");
const rp = require("request-promise-native");
const url = "https://www.baloto.com/historicomes@year";
const $ = require("cheerio");



class Balota {
    constructor(numArr, date){
        this.numeros = {
            "fecha": date,
            "1": numArr[0],
            "2": numArr[1],
            "3": numArr[2],
            "4": numArr[3],
            "5": numArr[4],
            "Superbalota": numArr[5],
        }
    }
}

/**
 * Son 6 números
 * El 6° es la súper balota
 */
const getData = (res, year_url) => {
    const data = []
    rp(url.replace("@year", year_url))
        .then(function(html) {
            const numbersHTML = $(".numbers", html).text().replace(/\ /g, "").replace(/\n\n/, "").replace(/\n\n\n/g, "").replace(/súperbalota/g, ""); 
            console.log(numbersHTML);
            //  res.write(numbersHTML);
            const dates = $(".panel-title", html).text()
                .replace(/\ /g, "")
                .replace(/\n\n/g, "")
                .split("\n");
            console.log("DATES", dates);
            numbers = numbersHTML.split("\n").filter(Boolean).map(str => parseInt(str));
            console.log(numbers)
            index = 0;
            date = dates[0];
            cont = -1;
            while(true){
                if(!numbers[index]) break;
                const slice = numbers.slice(index, index + 6);
                //REVANCHA: Cada 2 números que caigan
                if( (index / 6) % 2 == 0) {
                    date = dates[ cont + 1 ];
                    cont++;
                }
                data.push(new Balota(slice, date));
                index += 6;
            }

            // console.log(data);
            res.write(JSON.stringify(data));
            res.end(); //end the responsesda
        })
        .catch(function(err) {
        //handle error
        });
};

//create a server object:
http
    .createServer(function(req, res) {
        console.log("LISTENNING ON PORT 8080");
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            'Access-Control-Max-Age': 2592000, // 30 days
            /** add other headers as per requirement */
          };
        
          if (req.method === 'OPTIONS') {
            res.writeHead(204, headers);
            res.end();
            return;
          }
        
          if (['GET', 'POST'].indexOf(req.method) > -1) {
            res.writeHead(200, headers);
            getData(res, req.url);
            return;
          }
        
          res.writeHead(405, headers);
          res.end(`${req.method} is not allowed for the request.`);
    })
    .listen(process.env.PORT || 3000)//the server object listens on port 8080

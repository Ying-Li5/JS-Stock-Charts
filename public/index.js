//i spent most of the time trying to figure out the input then actually coding, i wish there was a better example for the import ):
async function dataFetch() {
    const options = {
        "method": "GET",
        "headers": {
            "Authorization": "apikey 82c49b3840d54bb5a7e0a0db99e182f4"
        }
    }
    const response = await fetch('https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1month', options)
    const data = await response.json()

    const {GME, MSFT, DIS, BNTX} = data; //Destructuring elements
    const stocks = [GME, MSFT, DIS, BNTX]
    return stocks
}

function getColor(stock){
    if(stock === "GME"){
        return 'rgba(61, 161, 61, 0.7)'
    }
    if(stock === "MSFT"){
        return 'rgba(209, 4, 25, 0.7)'
    }
    if(stock === "DIS"){
        return 'rgba(18, 4, 209, 0.7)'
    }
    if(stock === "BNTX"){
        return 'rgba(166, 43, 158, 0.7)'
    }
}

function getHighest(arr){
    let highest = -1
    arr.map(value => {
     if(highest < parseFloat(value.high)){
        highest = parseFloat(value.high)
     }   
    })
    return highest
}

async function main() {
    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');
    const stock = await dataFetch();
    stock.forEach(item => item.values.reverse()) //Makes the object different? wasnt working?
    console.log(stock[0])
    
    const myChart = new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stock[0].values.map(value => value.datetime),
            datasets: stock.map(item => ({
                label: item.meta.symbol,
                data: item.values.map(value => parseFloat(value.high)),
                backgroundColor: getColor(item.meta.symbol),
                borderColor: getColor(item.meta.symbol),
            }))
        }
    });
    
    const barChart = new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: stock.map(value => value.meta.symbol),
            datasets: [{ //was confusing until i read the docs
                data: stock.map(item => getHighest(item.values)),
                backgroundColor: stock.map(item => getColor(item.meta.symbol)),
                borderColor: stock.map(item => getColor(item.meta.symbol)),
            }]
        }
    });

    // const pieChart = new Chart(timeChartCanvas.getContext('0'), {
    //     type: 'pie',
    //     data: {
    //         labels: stock[0].values.map(value => value.datetime),
    //         datasets: stock.map(item => ({
    //             label: item.meta.symbol,
    //             data: item.values.map(value => parseFloat(value.high)),
    //             backgroundColor: getColor(item.meta.symbol),
    //             borderColor: getColor(item.meta.symbol),
    //         }))
    //     }
    // });
    
}

main()
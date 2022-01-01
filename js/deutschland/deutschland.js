async function getData(){
    const germany = 'https://api.corona-zahlen.org/germany';
    const historyCases = 'https://api.corona-zahlen.org/germany/history/cases';
    const historyDeaths = 'https://api.corona-zahlen.org/germany/history/cases';
    const ageGroups = 'https://api.corona-zahlen.org/germany/age-groups';

    Promise.all([
        fetch(germany),
        fetch(historyCases),
        fetch(historyDeaths),
        fetch(ageGroups)
    ]).then(function (responses) {
        // Get a JSON object from each of the responses
        return Promise.all(responses.map(function (response) {
            return response.json();
        }));
    }).then(function (data) {
        // Cards
        const germanyData = data[0];
        document.getElementById('weekIncidence').textContent = (germanyData["weekIncidence"].toFixed(2));
        document.getElementById('weekCases').textContent = (new Intl.NumberFormat('de-DE').format(germanyData["casesPerWeek"]));
        document.getElementById('dailyCases').textContent = ("+" + germanyData["delta"]["cases"]);
        document.getElementById('allCases').textContent = (new Intl.NumberFormat('de-DE').format(germanyData["cases"]));
        document.getElementById('dayDeaths').textContent = ("+" + germanyData["delta"]["deaths"]);
        document.getElementById('allDeaths').textContent = (new Intl.NumberFormat('de-DE').format(germanyData["deaths"]));
        document.getElementById('dayRecover').textContent = (new Intl.NumberFormat('de-DE').format(germanyData['delta']['recovered']));
        document.getElementById('allRecover').textContent = (new Intl.NumberFormat('de-DE').format(germanyData['recovered']));
        // History Chart
        const casesHistoryData = data[1]['data'];
        const day = casesHistoryData.map(
            function(index){
                return index.date
            }
        );
        const cases = casesHistoryData.map(
            function(index){
                return index.cases
            }
        );
        const deathsHistoryData = data[2]['data'];
        const deaths = deathsHistoryData.map(
            function(index){
                return index.deaths
            }
        );

        HistoryChart.config.data.labels = day;
        HistoryChart.config.data.datasets[0].data = cases;
        HistoryChart.config.data.datasets[1].data = deaths;
        // Age Groups Chart
        console.log(data);
        console.log(germanyData);
        console.log(casesHistoryData);
    }).catch(function (error) {
        // if there's an error, log it
        console.log(error);
    });
    
}

async function chartMapping() {
    await getData();
    var historyChart_ctx = document.getElementById('historyChart');
    var ageChart_ctx = document.getElementById('ageChart');

    const HistoryChart = new Chart (historyChart_ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
            {
                label: 'Fälle',
                data: [],
                backgroundColor: '#8540F5',
                order: 1
            },
            {
                label: 'Todesfälle',
                data: [],
                backgroundColor: '#0A58CA',
                type: 'line',
                order: 0
            }
        ]},
        options: {
            plugins: {
                legend: {
                position: 'top',
                },
                title: {
                    display: false,
                    // text: ''
                }
            }
        },
    });
    const AgeChart = new Chart (ageChart_ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
            {
                label: 'Männlich',
                data: [],
                backgroundColor: '#0A58CA',
            },
            {
                label: 'Weiblich',
                data: [],
                backgroundColor: '#8540F5',
            }
        ]},
        options: {
            plugins: {
                legend: {
                position: 'top',
                },
                title: {
                    display: false,
                    // text: ''
                }
            }
        },
    });
};

chartMapping();


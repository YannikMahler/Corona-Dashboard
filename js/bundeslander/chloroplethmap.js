import bundeslanderFetch from './bundeslander'

bundeslanderFetch().then(responseJson =>{
    const day = responseJson.data.map(
        function(index) {
            return index.date;
        }
    );
    const cases = responseJson.data.map(
        function(index) {
            return index.cases
        }
    );
    console.log(day);
    console.log(cases);

        
    
})
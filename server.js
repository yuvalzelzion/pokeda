const express = require('express');
const path = require('path');
const app = express();

let popularity = {};

app.use('/static', express.static(path.join(__dirname, 'data')));

let pokemons = require('./data/pokemon-data/pokemons.json');                                //Get json data file.

app.get('/all', (req, res) => res.send(pokemons));                                          //return the data of all the pokemons


//html pages 
app.get('/', (req, res) => res.sendFile(path.resolve("html_pages/HomePage.html")));         //Open the Home page.

app.get('/pokemons', (req, res) =>
    res.sendFile(path.resolve("html_pages/AllPokemonsList.html")));                         //Return all pokemons list html page.

app.get('/pokemons/:id', (req, res) => {                                                    //Return the template html page.

    res.sendFile(path.resolve("html_pages/SpecificPokemon.html"))
});


//specific pokemon by his id
app.get('/api/pokemons/:id', (req, res) => {                                                //Return json data of specific pokemon by his id.
    var currentId = req.params.id;

    res.send(pokemons[currentId - 1]);
});

app.post('/api/pokemons/:id', (req, res) => {                                               //Return json data of specific pokemon and increse popularity.
    var currentId = req.params.id;
    popularity[currentId] += 1;

    res.send(pokemons[currentId - 1]);
});

//pokemon popularity
for (pokemon of pokemons) {                                                                 //Init popularity of all the pokemons.
    popularity[pokemon.id] = 0;
}



function getMax3(arr) {                                                                     //Helper function that get's the 3 most popular pokemons.
    //Create items array
    var items = Object.keys(arr).map(function(key) {
        return [key, arr[key]];
    });

    items.sort(function(first, second) {                                                    //Sort the array based on the second element
        return second[1] - first[1];
    });

let max3Array = items.slice(0, 3);                                                          //Create an a array with the first 3 items



    let retVal = [{
            "index": "1",
            "pokemon": pokemons[max3Array[0][0] - 1],
            "popularity": max3Array[0][1]
        },
        {
            "index": "2",
            "pokemon": pokemons[max3Array[1][0] - 1],
            "popularity": max3Array[1][1]
        },
        {
            "index": "3",
            "pokemon": pokemons[max3Array[2][0] - 1],
            "popularity": max3Array[2][1]
        }
    ];

    return retVal; //Return as json object for ease of use.
}

app.get('/max3', (req, res) => { //Return json data of top 3 popular pokemons.

    var m3 = getMax3(popularity);

    res.send(m3)
});




app.listen(3000);
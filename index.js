const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const anime = new sqlite3.Database(path.join(__dirname, "data", "anime.db"), err => {
    if(err){
        console.log(err.message);
    }else{
        console.log('Connected to Database');
    }
});

process.setMaxListeners(20);

const app = express();
const port = 4000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, err => {
    if(err){
        console.log(err.message);
    }
});

var tokens = ["Xej907Nmj8", "WTVx4ZRktk", "jILGrh75Gi", "GaePTJvspg", "FPIP4UwOHP", "OjKVqn7U0H", "0jEeIbKkqa", "Cpfi1zQLCe", "gyD1pgq9pB", "zjwpZZ0Qj8"];

/* SERVER FUNCTIONS {START} */

function randomToken(){
    let random = Math.floor(Math.random()*tokens.length);
    let token = tokens[random];
    return token;
}

function checkToken(token){
    for(const t of tokens){
        if(token == t){
            return true;
        }
    }
}

/* SERVER FUNCTIONS {END} */

app.get('/', (req, res) => {
    let token = randomToken();
    res.redirect(`/main/${token}`);
});

app.get('/main/:token', (req, res) => {
    let token = req.params.token;
    let isValidToken = checkToken(token);

    if(isValidToken){
        res.render('home', {token:token});
    }else{
        res.status(498).send('Invalid Token');
    } 
});

app.get('/anime-archive/:token', (req, res) => {
    if(checkToken(req.params.token)){
        let sql = `SELECT * FROM anime`;
        anime.all(sql, (err, rows) => {
            if(err){
                console.log(err.message);
            }else{
                res.render('anime_archive', {animeList:rows});
            }
        });
    }else{
        res.status(498).send('Invalid Token');
    }
});

app.get('/anime-control/persist/:token', (req, res) => {
    if(checkToken(req.params.token)){
        res.render(add_anime, {token:req.params.token});
    }else{
        res.status(498).send('Invalid Token')
    }
})

app.post('/anime-control/persist/:token', (req, res) => {
    if(checkToken(req.params.token)){
        let random_id = Math.floor(Math.random()*10000);
        let sql = `INSERT INTO anime(id, name, type, seasons, ratings) VALUES(?, ?, ?, ?, ?)`;
        let new_anime = [random_id, req.body.name, req.body.type, req.body.seasons, req.body.ratings];

        anime.run(sql, new_anime, err => {
            if(err){
                console.log(err.message);
            }else{
                console.log('Added new anime');
            }
        });
    }else{
        res.status(498).send('Invalid Token');
    }
})


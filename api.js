const client = require('./connection.js')
const express = require('express');
const app = express();
app.listen(3300, () => {
    console.log("Sever is now listening at port 3300");
})
client.connect();


app.use('/', express.static('views'));
app.set('view engine', 'ejs')


app.get('/movie', (req, res) => {
    // `SELECT * FROM movie ORDER BY mov_id ASC `
    // SELECT * FROM movie INNER JOIN movie_cast ON movie.mov_id = movie_cast.mov_id
    client.query(`SELECT * FROM get_detailed_movies();`, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/get_movie/:id', (req, res) => {
    client.query(`Select * from movie where mov_id=${req.params.id}`, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// ------Movie apis start

app.post('/add_movie', (req, res) => {
    const movie = req.body;
    console.log(movie)
    let insertQuery = `insert into movie(mov_id, mov_title, mov_year,mov_time, mov_lang, mov_dt_rel, mov_rel_country) values(${movie.mov_id}, '${movie.mov_title}', '${movie.mov_year}', '${movie.mov_time}', '${movie.mov_lang}','${movie.mov_dt_rel}','${movie.mov_rel_country}')`

    client.query(insertQuery, (err, result) => {
        if (!err) {
            res.send('Insertion was successful')
        }
        else { console.log(err.message) }
    })
    client.end;
})

app.put('/edit_movie', (req, res) => {
    let movie = req.body;
    let updateQuery = `update movie
                       set mov_title = '${movie.mov_title}',
                       mov_year = '${movie.mov_year}',
                       mov_time = '${movie.mov_time}',
                       mov_lang = '${movie.mov_lang}',
                       mov_dt_rel = '${movie.mov_dt_rel}',
                       mov_rel_country = '${movie.mov_rel_country}'
                       where mov_id = ${movie.mov_id}`

    client.query(updateQuery, (err, result) => {
        if (!err) {
            res.send('Update was successful')
        }
        else {
            console.log(err.message)
        }
    })
    client.end;
})

app.delete('/delete_movie/:id', (req, res) => {
    console.log(req.params)
    let insertQuery = `delete from movie where mov_id=${req.params.id}`

    client.query(insertQuery, (err, result) => {
        if (!err) {
            res.send('Deletion was successful')
        }
        else { console.log(err.message) }
    })
    client.end;
})

// ------Movie apis end

// ----User management apis

app.get('/get_user', (req, res) => {
    let insertQuery = `SELECT * FROM users`
    client.query(insertQuery, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
        else { console.log(err.message) }
    })
    client.end;
})

app.get('/get_rated_movies/:id', (req, res) => {
    let insertQuery = `select * from user_rated_movies(${req.params.id});`
    client.query(insertQuery, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
        else { console.log(err.message) }
    })
    client.end;
})
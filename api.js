const client = require('./connection.js')
const express = require('express');
const app = express();
app.listen(3300, () => {
    console.log("Sever is now listening at port 3300");
})
client.connect();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use('/', express.static('views'));


app.get('/movie', (req, res) => {
    client.query(`SELECT * FROM get_movies_withRatings();`, (err, result) => {
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


// ------Movie apis start

app.post('/add_movie', (req, res) => {
    const movie = req.body;
    console.log(movie)
    let insertQuery = `SELECT * from add_new_movie('` + movie.mov_title + `',` + movie.mov_year + `,'` + movie.mov_lang + `','` + movie.mov_rel_country + `',` + movie.genres + `, ` + movie.director + `, ` + movie.actor + `);`;
    console.log(insertQuery)
    client.query(insertQuery, (err, result) => {
        if (!err) {
            res.send('Insertion was successful')
        }
        else {
            console.log(err.message)
            if (err.message) {
                res.send({ status: 'failed', error: err.message })
            }
        }
    })
    client.end;
})

app.put('/edit_movie', (req, res) => {
    let movie = req.body;
    console.log(movie)
    let updateQuery = `SELECT * FROM update_movie (` + movie.mov_id + `,'` + movie.mov_title + `',` + movie.mov_year + `,'` + movie.mov_lang + `','` + movie.mov_rel_country + `',` + movie.genres + `, ` + movie.director + `, ` + movie.actor + `);`;
    console.log(updateQuery)
    client.query(updateQuery, (err, result) => {
        if (!err) {
            res.send('Update was successful')
        }
        else {
            console.log(err.message)
            if (err.message) {
                res.send({ status: 'failed', error: err.message })
            }
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

app.get('/get_movie_persons', (req, res) => {
    let insertQuery = `SELECT * FROM director`
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
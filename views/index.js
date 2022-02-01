var dataMovies = []
var userList = []
var dataList = getMoviesData()
var actor_list = []
var director_list = []
var genreList = []
function removeForm() {
    document.getElementById('add_mov_form').innerHTML = ''
}

function createSelectOption(list, ele, field1, field2) {
    for (var i = 0; i < list.length; i++) {
        var option = document.createElement("option");
        option.value = list[i][field1];
        option.text = list[i][field2];
        ele.appendChild(option);
    }
}

function createForm(type, dataList, position, index) {
    var modelBody = document.getElementById('modal-body');
    var submitBtn = document.getElementById('submit-button');
    if (type === 'movie') {
        submitBtn.onclick = () => {
            if (position === 'add') {
                create_movie()
            } else {
                edit_movie(index)
            }
        };
        var form = document.createElement("form");
        form.setAttribute('style', 'display:grid;padding: 0 40px;margin-bottom: 0;')
        form.setAttribute('id', 'add_mov_form')
        var br = document.createElement("div");
        br.setAttribute('style', 'padding:10px;')
        form.setAttribute("method", "post");
        for (var keyData in dataList) {
            if (!keyData.includes('id') && keyData.includes('mov')) {
                var MN = document.createElement("input");
                MN.setAttribute("type", keyData === 'mov_year' ? 'number' : "text");
                MN.setAttribute("name", keyData);
                MN.setAttribute("placeholder", keyData);
                if (position === 'edit') {
                    MN.setAttribute('value', dataList[keyData])
                }
                MN.setAttribute('id', keyData)
                form.appendChild(MN);
                // Inserting a line break
                form.appendChild(br.cloneNode());
            }
            if (keyData === 'actor_name' || keyData === 'director_name' || keyData === 'gen_title') {
                var MN = document.createElement("select");
                if (keyData === 'actor_name') {
                    createSelectOption(actor_list, MN, 'id', 'name')
                } else if (keyData === 'director_name') {
                    createSelectOption(director_list, MN, 'id', 'name')
                } else if (keyData === 'gen_title') {
                    createSelectOption(genreList, MN, 'id', 'name')
                }
                MN.setAttribute("placeholder", keyData);
                console.log(dataList['gen_id'], dataList['act_id'])
                if (position === 'edit') {
                    if (keyData === 'gen_title') {
                        MN.value = dataList['gen_id']
                        // MN.setAttribute('text', dataList['gen_title'])
                        console.log(MN)
                    } else if (keyData === 'actor_name') {
                        MN.value = dataList['act_id']
                        // MN.setAttribute('value', dataList['act_id'])
                        // MN.setAttribute('text', dataList['actor_name'])
                        console.log(MN)
                    } else if (keyData === 'director_name') {
                        MN.value = dataList['dir_id']
                        // MN.setAttribute('value', dataList['dir_id'])
                        // MN.setAttribute('text', dataList['director_name'])
                        console.log(MN)
                    }
                    else {
                        MN.setAttribute('value', dataList[keyData])
                    }
                }
                MN.setAttribute('id', keyData)
                form.appendChild(MN);
                // Inserting a line break
                form.appendChild(br.cloneNode());
            }

        }
    }

    modelBody.appendChild(form);

}

function trigger_model(type, position, dataFields, index) {
    console.log(position)
    if (position === 'add') {
        document.getElementById('modal-title').innerHTML = 'Add new movie';
        let dataField = {
            mov_title: '',
            mov_year: '',
            genres: '',
            mov_lang: '',
            mov_rel_country: '',
            actor_name: '',
            director_name: ''

        }
        createForm(type, dataField, position)
    }
    else if (position === 'edit') {
        document.getElementById('modal-title').innerHTML = 'Edit movie';
        createForm(type, dataFields, position, index)
    }
}

function getUsersOverview(position) {
    document.getElementById('film-table').innerHTML = ''
    if (position === 'all_movie') {
        document.getElementById('all-users').setAttribute('style', 'display:flex')
        document.getElementById('all_movie').setAttribute('style', 'display:none')
        var changeFunction = document.getElementById('add_action_btn')
        changeFunction.addEventListener('click', () => {
            trigger_model('movie', 'add');
        })
        getMoviesData()
    } else if (position === 'all-users') {
        document.getElementById('all-users').setAttribute('style', 'display:none')
        document.getElementById('all_movie').setAttribute('style', 'display:flex')
        var changeFunction = document.getElementById('add_action_btn')
        changeFunction.addEventListener('click', () => {
            trigger_model('users', 'add');
        })
        createTableDOM(userList, 'user')
    } else if (position === 'all-film-person') {
        document.getElementById('all-film-person').setAttribute('style', 'display:none')
        document.getElementById('all_movie').setAttribute('style', 'display:flex')
        var changeFunction = document.getElementById('add_action_btn')
        changeFunction.addEventListener('click', () => {
            trigger_model('movie_person', 'add');
        })
        getMoviePerson()
    }
}

function getMoviePerson() {
    fetch('http://localhost:3300/get_movie_persons', {
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length > 0) {
                createTableDOM(data, 'movie_person')
            }
        })
}

function getUsersList() {
    fetch('http://localhost:3300/get_user', {
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length > 0) {
                userList = data
                var selectList = document.getElementById("user-selection");
                //Create and append the options
                createSelectOption(data, selectList, 'user_id', 'user_name')

            }
        })
}

function onUserChange(data) {
    if (data.target.value === 'ALL Movies') {
        document.getElementById('film-table').innerHTML = ''
        getMoviesData('onuser-change')
    } else {
        fetch('http://localhost:3300/get_rated_movies/' + data.target.value, {
            method: 'GET',
            headers: {
                "Content-type": "application/json"
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                document.getElementById('film-table').innerHTML = ''
                createTableDOM(data, 'movie')
            })
    }

}

function createTableDOM(data, type) {
    dataMovies = data
    let dataRef = document.getElementById('film-table')
    var tr = document.createElement('tr');
    var element = Object.keys(data[0])
    for (var i = 0; i < element.length; i++) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(element[i].replaceAll('_', ' ').toUpperCase()
        ));
        if (element[i].includes('id')) {
            th.setAttribute('style', 'display:none;')
        }
        tr.appendChild(th)
    }
    var th = document.createElement('th');
    th.appendChild(document.createTextNode("Action"));
    tr.appendChild(th)
    dataRef.appendChild(tr);

    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
        tr.setAttribute('id', 'row' + i);
        for (var key in data[i]) {
            var td = document.createElement('td');
            td.setAttribute('id', key + i);
            if (key.includes('id')) {
                td.setAttribute('style', 'display:none;')
            }
            if (key.includes('actor') || key.includes('director')) {
                td.setAttribute('class', 'hover_role')
            }
            td.appendChild(document.createTextNode(data[i][key] === null ? '-' : data[i][key]));
            tr.appendChild(td)
        }
        var td1 = document.createElement('td');
        if (type === 'movie') {
            var domStr = '<div><span onclick="edit_row(' + i + ')" data-toggle="modal" data-target="#myModal" class="action_icons" id=edit_button' + i + '><i class="fa fa-edit"></i></span> <span onclick="save_movie(' + i + ')" class="action_icons" id=save_button' + i + '><i class="fa fa-star"></i></span> <span onclick="delete_movie(' + i + ')" id=edit_button' + i + ' class="action_icons"><i class="fa fa-trash-alt"></i></span><div>'
            td1.innerHTML = domStr
        }
        tr.appendChild(td1)
        dataRef.appendChild(tr);
    }
}

function getMoviesData(position) {
    fetch('http://localhost:3300/movie', {
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        },
    })
        .then(function (response) {

            return response.json();
        })
        .then(function (data) {
            if (typeof position === 'undefined') {
                getUsersList()
            }
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].actor_name !== null) {
                        actor_list.push({ id: data[i].act_id, name: data[i].actor_name })
                    }
                    if (data[i].director_name !== null) {
                        director_list.push({ id: data[i].dir_id, name: data[i].director_name })
                    }
                    if (data[i].genres !== null) {
                        genreList.push({ id: data[i].gen_id, name: data[i].gen_title })
                    }
                }
                createTableDOM(data, 'movie')
            }
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
}


function edit_row(index) {
    trigger_model('movie', 'edit', dataMovies[index], index)
}

function save_movie(index) {
    let dataObj = dataMovies[index]
    let dataParam = {}
    for (var keyData in dataObj) {
        window[keyData + '_val'] = document.getElementById(keyData + '_text' + index).value;
        document.getElementById(keyData + index).innerHTML = window[keyData + '_val'];
        dataParam[keyData] = window[keyData + '_val'];
    }
    document.getElementById("edit_button" + index).style.display = "inline-flex";
    document.getElementById("save_button" + index).style.display = "none";

    fetch('http://localhost:3300/edit_movie', {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(dataParam),
    })
        .then(function (response) {
            if (response.status === 200) {
                console.log("Updated movie Successfull")
                document.getElementById('film-table').innerHTML = ''
                getMoviesData()
            }
        })
        .then(function (data) {

        })
}

function delete_movie(index) {
    let dataObj = dataMovies[index]
    fetch('http://localhost:3300/delete_movie/' + dataObj.mov_id, {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json"
        },
    })
        .then(function (response) {
            if (response.status === 200) {
                console.log("Delete Successfull")
                document.getElementById('film-table').innerHTML = ''
                getMoviesData()
            }
        })
        .then(function (data) {

        })

}


function create_movie() {
    var data = {}
    data.mov_title = document.getElementById('mov_title')?.value
    data.genres = parseInt(document.getElementById('gen_title')?.value)
    data.mov_year = parseInt(document.getElementById('mov_year')?.value)
    data.mov_lang = document.getElementById('mov_lang')?.value
    data.mov_rel_country = document.getElementById('mov_rel_country')?.value
    data.director = parseInt(document.getElementById('director_name')?.value)
    data.actor = parseInt(document.getElementById('actor_name')?.value)
    console.log(data)


    fetch('http://localhost:3300/add_movie', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(function (response) {
            if (response.status === 200) {
                console.log("Movie creation Successfull")
                document.getElementById('film-table').innerHTML = ''
                getMoviesData()
            }
        })
        .then(function (data) {

        })

}

function edit_movie(index) {
    console.log(index)
    var dataObj = dataMovies[index]
    var data = {}
    data.mov_id = dataObj.mov_id
    data.mov_title = document.getElementById('mov_title')?.value
    data.genres = document.getElementById('gen_title')?.value
    data.mov_year = parseInt(document.getElementById('mov_year')?.value)
    data.mov_lang = document.getElementById('mov_lang')?.value
    data.mov_rel_country = document.getElementById('mov_rel_country')?.value
    data.director = parseInt(document.getElementById('director_name')?.value)
    data.actor = parseInt(document.getElementById('actor_name')?.value)

    fetch('http://localhost:3300/edit_movie', {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(function (response) {
            if (response.status === 200) {
                console.log("Movie creation Successfull")
                document.getElementById('film-table').innerHTML = ''
                getMoviesData()
            }
        })
        .then(function (data) {

        })
}
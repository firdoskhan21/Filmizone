var dataMovies = []
var userList = []

function removeForm() {
    document.getElementById('add_mov_form').innerHTML = ''
}

function createForm(dataList, position) {
    var modelBody = document.getElementById('modal-body');
    var form = document.createElement("form");
    form.setAttribute('style', 'display:grid;padding: 0 40px;margin-bottom: 0;')
    form.setAttribute('id', 'add_mov_form')
    var br = document.createElement("div");
    br.setAttribute('style', 'padding:10px;')
    form.setAttribute("method", "post");
    // form.setAttribute("action", "add_movie()");
    for (var keyData in dataList) {
        if (!keyData.includes('id')) {
            var MN = document.createElement("input");
            MN.setAttribute("type", "text");
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

    }
    modelBody.appendChild(form);

}

function trigger_model(position, dataFields) {
    console.log(position)
    if (position === 'add') {
        document.getElementById('modal-title').innerHTML = 'Add new movie';
        let dataField = {
            mov_title: '',
            mov_year: '',
            genres: '',
            mov_lang: '',
            mov_rel_country: ''

        }
        createForm(dataField, position)
    }
    else if (position === 'edit') {
        document.getElementById('modal-title').innerHTML = 'Edit movie';
        createForm(dataFields, position)
    }
}

function getUsersOverview(position) {
    document.getElementById('film-table').innerHTML = ''
    if (position === 'all_movie') {
        document.getElementById('all-users').setAttribute('style', 'display:flex')
        document.getElementById('all_movie').setAttribute('style', 'display:none')
        getMoviesData()
    } else if (position === 'all-users') {
        document.getElementById('all-users').setAttribute('style', 'display:none')
        document.getElementById('all_movie').setAttribute('style', 'display:flex')
        createTableDOM(userList)
    }
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
                for (var i = 0; i < data.length; i++) {
                    var option = document.createElement("option");
                    option.value = data[i].user_id;
                    option.text = data[i].user_name;
                    selectList.appendChild(option);
                }
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
                createTableDOM(data)
            })
    }

}

function createTableDOM(data) {
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
            td.appendChild(document.createTextNode(data[i][key] === null ? '-' : data[i][key]));
            tr.appendChild(td)
        }
        var td1 = document.createElement('td');
        var domStr = '<div><span onclick="edit_row(' + i + ')" data-toggle="modal" data-target="#myModal" class="action_icons" id=edit_button' + i + '><i class="fa fa-edit"></i></span> <span onclick="save_movie(' + i + ')" class="action_icons" id=save_button' + i + '><i class="fa fa-save"></i></span> <span onclick="delete_movie(' + i + ')" id=edit_button' + i + ' class="action_icons"><i class="fa fa-trash-alt"></i></span><div>'
        td1.innerHTML = domStr
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
                createTableDOM(data)
            }
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
}

var dataList = getMoviesData()

function edit_row(index) {
    trigger_model('edit', dataMovies[index])
    // let dataObj = dataMovies[index]
    // document.getElementById("edit_button" + index).style.display = "none";
    // document.getElementById("save_button" + index).style.display = "inline-flex";
    // for (var keyData in dataObj) {
    //     window[keyData] = document.getElementById(keyData + index);
    // }
    // for (var keyData in dataObj) {
    //     window[keyData + '_data'] = window[keyData].innerHTML;
    // }
    // mov_id.innerHTML = "<input type='text' id='mov_id_text" + index + "' value='" + mov_id_data + "'>";
    // mov_title.innerHTML = "<input type='text' id='mov_title_text" + index + "' value='" + mov_title_data + "'>";
    // mov_year.innerHTML = "<input type='text' id='mov_year_text" + index + "' value='" + mov_year_data + "'>";
    // mov_time.innerHTML = "<input type='text' id='mov_time_text" + index + "' value='" + mov_time_data + "'>";
    // mov_lang.innerHTML = "<input type='text' id='mov_lang_text" + index + "' value='" + mov_lang_data + "'>";
    // mov_dt_rel.innerHTML = "<input type='text' id='mov_dt_rel_text" + index + "' value='" + mov_dt_rel_data + "'>";
    // mov_rel_country.innerHTML = "<input type='text' id='mov_rel_country_text" + index + "' value='" + mov_rel_country_data + "'>";
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
    data.mov_title = document.getElementById('mov_title').value
    data.genres = document.getElementById('genres').value
    data.mov_year = document.getElementById('mov_year').value
    data.mov_lang = document.getElementById('mov_lang').value
    data.mov_rel_country = document.getElementById('mov_rel_country').value
    console.log(data)

}


function add_movie() {
    var new_name = document.getElementById("new_name").value;
    var new_country = document.getElementById("new_country").value;
    var new_age = document.getElementById("new_age").value;

    var table = document.getElementById("data_table");
    var table_len = (table.rows.length) - 1;
    var row = table.insertRow(table_len).outerHTML = "<tr id='row" + table_len + "'><td id='name_row" + table_len + "'>" + new_name + "</td><td id='country_row" + table_len + "'>" + new_country + "</td><td id='age_row" + table_len + "'>" + new_age + "</td><td><input type='button' id='edit_button" + table_len + "' value='Edit' class='edit' onclick='edit_row(" + table_len + ")'> <input type='button' id='save_button" + table_len + "' value='Save' class='save' onclick='save_row(" + table_len + ")'> <input type='button' value='Delete' class='delete' onclick='delete_row(" + table_len + ")'></td></tr>";

    document.getElementById("new_name").value = "";
    document.getElementById("new_country").value = "";
    document.getElementById("new_age").value = "";
}
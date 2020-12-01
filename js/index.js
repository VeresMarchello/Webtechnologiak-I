$(document).ready(function() {
    var menuButtons = document.getElementsByClassName("menuButton");
    $.each(menuButtons, function(index, value) {
        $(value).click(function(e) {
            e.preventDefault();
            var page = $(this)[0].attributes.href.nodeValue;
            $("#content").load(page);
        });
    });
});

function init() {
    $("#content").load("cars.html");
}

function load(address, tableName) {
    $.getJSON(address, function(data) {

        var table = $("#" + tableName);
        var index = 0;

        $.each(data, function(key, value) {
            var row = $("<tr></tr>");

            $.each(Object.entries(value), function(key, value) {

                if (key != 0) {

                    if (index == 0) {
                        var cell = $('<th>' + value[0] + '</th>');
                    } else {
                        var cell = $('<td>' + value[1] + '</td>');
                    }

                    $(row).append(cell);
                }
            });

            $(table).append(row);

            index++;
        });
    });
}

function insert(address, formName) {
    var form = document.getElementById(formName);
    var inputs = form.querySelectorAll('*[id]');
    var object = {};

    for (var i = 0; i < inputs.length; i++) {
        var property = inputs[i]['id'];
        var value = inputs[i]['value'];

        object[property] = value;
    }

    var data = JSON.stringify(object);

    $.ajax({
        type: "POST",
        url: address,
        data: data,
        dataType: "json",
        contentType: "application/json"
    });
}

function remove(address, tableName) {
    var selectedObjects = getSelectedObjects(tableName);
    var fullObjects = getFullObjects(address);
    var ids = getIds(selectedObjects, fullObjects);

    $(ids).each(function(index, element) {
        var url = address + "/" + element

        $.ajax({
            type: "DELETE",
            url: url,
        });
    });
}


function setManufacturers() {
    $.getJSON("https://webtechcars.herokuapp.com/api/manufacturers", function(data) {

        var select = document.getElementById("manufacturer");

        $.each(data, function(index, value) {
            var option = document.createElement("option");
            option.text = value.name;

            select.add(option);
        });
    });
}

function appendCheckBoxes(tableName) {
    var table = document.getElementById(tableName);

    var rows = document.getElementsByTagName("tr");
    var rowIndex = 0;
    $(rows).each(function(index, element) {
        if (rowIndex != 0) {
            var checkbox = document.createElement('input');
            checkbox.setAttribute("type", "checkbox");
            element.append(checkbox);
        }
        rowIndex++;
    });
}

function getFullObjects(address) {
    $.ajaxSetup({
        async: false
    });
    var fullObjects = {};
    $.getJSON(address, function(data) {
        fullObjects = data;
    });
    $.ajaxSetup({
        async: true
    });
    return fullObjects;
}

function getSelectedObjects(tableName) {
    var selectedRows = $("#" + tableName + " tr").filter(':has(:checkbox:checked)');
    var headers = document.getElementsByTagName("th");

    var objects = [];

    for (var j = 0; j < selectedRows.length; j++) {
        var object = {};
        var cells = selectedRows[j].cells;

        for (var i = 0; i < cells.length; i++) {
            var property = headers[i]['textContent'];
            var value = cells[i]['textContent'];
            object[property] = value;
        }
        objects.push(object);
    };
    return objects;
}

function getIds(selectedObjects, fullObjects) {
    var ids = [];
    for (var i = 0; i < selectedObjects.length; i++) {
        var selectedObject = selectedObjects[i];

        for (var j = 0; j < fullObjects.length; j++) {
            var fullObject = fullObjects[j];
            var fullObjectAttributes = Object.entries(fullObject);
            var selectedObjectAttributes = Object.entries(selectedObject);

            var count = 0;
            for (var k = 0; k < selectedObjectAttributes.length; k++) {
                var index = k + 1;
                if (fullObjectAttributes[index][1] == selectedObjectAttributes[k][1]) {
                    count++;
                }
            }

            if (count == selectedObjectAttributes.length) {
                ids.push(fullObjectAttributes[0][1]);
            }
        }
    }

    return ids;
}
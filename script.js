const isNumeric = n => !isNaN(n);

let graph_dict = {};

function UpdateGraph() {
    let data = document.getElementById("edge-input").value;
    let massive_of_edges = data.split("\n");
    document.getElementById("edge-input").value = '';
    for (let i = 0; i < massive_of_edges.length; i++) {
        let edge = massive_of_edges[i].split(" ");

        if (!isNumeric(edge[0]) || !isNumeric(edge[1])) {
            alert("Вершины могут быть представлены лишь числами. Ребро "+massive_of_edges[i]+" не добавлено.");
            continue;
        }

        let vertex1 = edge[0];
        let vertex2 = edge[1];

        if (vertex1 == vertex2) {
            continue;
        }

        if (!(vertex1 in graph_dict)) {
            graph_dict[vertex1] = [];
        }
        graph_dict[vertex1].push(vertex2);
        if (!(vertex2 in graph_dict)) {
            graph_dict[vertex2] = [];
        }
        graph_dict[vertex2].push(vertex1);
    }
    UpdateTable();
}

function UpdateTable() {
    let table = document.getElementById("graph_neighbors");
    let row_count = table.rows.length;
    for (let i = 0; i < row_count; i++) {
        table.deleteRow(0);
    }
    for (vertex in graph_dict) {
        let neighbors = graph_dict[vertex];
        let row = document.createElement("tr");
        row.innerHTML = '<td>'+vertex+'</td>';
        row.innerHTML += '<td>'+neighbors+'</td>';
        table.append(row);
    }
}

let addVertexBtn = document.getElementById("add-vertex-btn");
addVertexBtn.addEventListener("click", UpdateGraph);
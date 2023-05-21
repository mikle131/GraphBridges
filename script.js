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
    DrawGraph();
}

description = ["Ввод данных", "Поиск в глубину с обратным ориентирванием ребер", "Разворот списка", "Раскраска"];

function UpdateTable() {
    let table = document.getElementById("graph_neighbors");
    document.getElementById("alg-step").textContent = "Этап алгоритма: " + step_alg_num + ' (' + description[step_alg_num]+')';
    document.getElementById("obhod").textContent = "Обход: "+order_out;
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

let graph = { nodes: [], links: [] };

function DrawGraph() {
    graph = { nodes: [], links: [] };
    for (node in graph_dict) {
        graph.nodes.push({ id: node });
        for (neighbor in graph_dict[node]) {
            graph.links.push({ source: node, target: graph_dict[node][neighbor] });
        }
    }

    var svg = d3.select("svg");
    svg.selectAll(".link").remove();
    svg.selectAll(".node").remove();

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(150))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(700, 400))
        .force("collide", d3.forceCollide(100)); //отталкивание

    var defs = svg.append("defs");

    defs.append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("orient", "auto")
        .attr("markerWidth", 7)
        .attr("markerHeight", 7)
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class", "arrowhead");

    var link = svg.selectAll(".link")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("class", "link")
    .style("stroke", "black")
    .style("stroke-width", 2)
    .attr("source", function (d) {return d.source})
    .attr("target", function (d) {return d.target})
    .attr("marker-end", "url(#arrowhead)");

    var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("id", function (d) { return d.id; });

    node.append("circle")
        .attr("r", 12)
        .style("fill", "green")
        .style("stroke", "black")
        .style("stroke-width", 2);

    node.append("text")
        .text(function (d) { return d.id; })
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "central")
        .style("fill", "white");

    simulation.nodes(graph.nodes);
    simulation.force("link").links(graph.links);
    simulation.on("tick", ticked);

    function ticked() {
        link.transition()
        .duration(20)
        .attr("x1", function (d) {
            var dx = d.target.x - d.source.x;
            var dy = d.target.y - d.source.y;
            var length = Math.sqrt(dx * dx + dy * dy);
            var offsetX = (dx / length) * 12;
            var offsetY = (dy / length) * 12;
            return d.source.x + offsetX;
        })
        .attr("y1", function (d) {
            var dx = d.target.x - d.source.x;
            var dy = d.target.y - d.source.y;
            var length = Math.sqrt(dx * dx + dy * dy);
            var offsetX = (dx / length) * 12;
            var offsetY = (dy / length) * 12;
            return d.source.y + offsetY;
        })
        .attr("x2", function (d) {
            var dx = d.target.x - d.source.x;
            var dy = d.target.y - d.source.y;
            var length = Math.sqrt(dx * dx + dy * dy);
            var offsetX = (dx / length) * 12;
            var offsetY = (dy / length) * 12;
            return d.target.x - offsetX;
        })
        .attr("y2", function (d) {
            var dx = d.target.x - d.source.x;
            var dy = d.target.y - d.source.y;
            var length = Math.sqrt(dx * dx + dy * dy);
            var offsetX = (dx / length) * 12;
            var offsetY = (dy / length) * 12;
            return d.target.y - offsetY;
        });
    
        node.transition()
            .duration(20)
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
    }
}
//удаление ребра, идущего из a в b
function DeleteEdge(a, b) {
    var svg = d3.select("svg");
    let edge = svg.select(".link[source='"+b+"'][target='"+a+"']");
    if (!edge) {
        alert("Ребро не найдено");
        return;
    }
    edge.remove();
  }
  
// Раскраска вершины с номером num
function ColorVertex(num, color) {
    var svg = d3.select("svg");
    if (!vertex) {
        alert("Вершина не найдена");
        return;
    }
    let node = svg.select(".node[id='"+num+"']");
    node.select("circle")
        .style("fill", color);

}


let step_alg_num = 0;
function RunAlgrotihm() {
    let num = document.getElementById("start-input").value;
    if (!isNumeric(num) || num.length == 0) {
        alert("Стартовая вершина задана неверно");
        return;
    }
    if (step_alg_num != 0) {
        alert("Алгоритм уже запущен");
        return;
    }
    step_alg_num = 1;
    ColorVertex(num, "blue");
    UpdateTable();
    for (i in graph_dict) {
        if (i != num) {
            to_run_step_1.push(i);
        }
    }
    to_run_step_1.push(num);
}

function reloadPage() {
    document.location.reload()
}

//Окей, сам алгоритм. Сначала добвим, как надо реагировать при нажатии на кнопку "Вперед"

function GoNext () {
    if (step_alg_num == 0) {
        alert("Сначала запустите алгоритм");
    }
    else if (step_alg_num == 1) {
        go_next_1();
    }
    else if (step_alg_num == 2) {
         go_next_2();
     }
    else if (step_alg_num == 3) {
        go_next_3();
    }
    else {
        alert("Алгоритм закончен");
    }
}


let to_run_step_1 = [];
let visited = [];
let order_out = [];
let previous = 0;

function go_next_1 () {
    let now = to_run_step_1[to_run_step_1.length - 1];
    visited.push(now);
    let was_new = 0;
    let ind_new = 0;
    ColorVertex(previous, "red");
    for (let i = 0; i < graph_dict[now].length; i++) {
        let neighbor = graph_dict[now][i];
        if (!visited.includes(neighbor)) {
            to_run_step_1.push(neighbor);
            was_new = 1;
            ind_new = i;
            break;
        }
    }
    if (was_new) {
        let next = to_run_step_1[to_run_step_1.length - 1];
        let ind = graph_dict[now].indexOf(next);
        graph_dict[now].splice(ind, 1);
        DeleteEdge(next, now);
        UpdateTable();
    }
    else {
        if (!(order_out.includes(to_run_step_1[to_run_step_1.length - 1]))) {
            order_out.push(to_run_step_1[to_run_step_1.length - 1]); //Куча вершинок для несвязного графа
        }
        to_run_step_1.pop();
        UpdateTable();
    }
    ColorVertex(now, "red");
    ColorVertex(to_run_step_1[to_run_step_1.length - 1], "blue");
    previous = now;
    if (to_run_step_1.length == 0) {
        step_alg_num = 2;
        UpdateTable();
    }
}

function go_next_2 () {
    order_out.reverse();
    step_alg_num = 3;
    UpdateTable();
}

//order_out

let q = 0;
let order = [];
let color_dict = {};
let curr_color = 1;
let colors = ['', "gold", "blue", "green", "black", "grey", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange"];
let visited_3 = [];

function go_next_3 () {
    if (order.length == 0) {
        if (q == order_out.length) {
            step_alg_num = 4;
            UpdateTable();
            return;
        }
        if (!(visited_3.includes(order_out[q]))) {
            order.push(order_out[q]);
            q+= 1;
            curr_color += 1;
        }
        else {
            q += 1;
        }

    }
    let now = order[order.length - 1];
    let was_neighbor = 0;
    ColorVertex(now, colors[curr_color]);
    alert("Ордер: "+order);
    alert("Соседи: "+ graph_dict[now]);
    for (let neighbor3 in graph_dict[now]) {
        if (neighbor3 != 0){
            alert(neighbor3);
            color_dict[neighbor3] = curr_color;
            ColorVertex(neighbor3, colors[curr_color]);
            order.push(neighbor3);
            visited_3.push(neighbor3);
            was_neighbor = 1;
            break;
        }
    }
    if (!was_neighbor) {
        order.pop();
    }
}



let go_next_btn = document.getElementById("go-next-btn");
go_next_btn.addEventListener("click", GoNext);

let add_vertex_button = document.getElementById("add-vertex-btn");
add_vertex_button.addEventListener("click", UpdateGraph);

let run_algorithm_button = document.getElementById("run-algorighm-btn");
run_algorithm_button.addEventListener("click", RunAlgrotihm);

let reload_button = document.getElementById("reload-page");
reload_button.addEventListener("click", reloadPage);
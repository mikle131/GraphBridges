const isNumeric = n => !isNaN(n);

let graph_dict = {};

let edge_list = [];

function UpdateGraph() {
    if (step_alg_num != 0) {
        alert("Алгоритм уже запущен. Вы не можете добавлять ребра в процессе работы алгоритма");
        return;
    }
    let data = document.getElementById("edge-input").value;
    let massive_of_edges = data.split("\n");
    document.getElementById("edge-input").value = '';
    for (let i = 0; i < massive_of_edges.length; i++) {
        let edge = massive_of_edges[i].split(" ");
        edge_list.push(edge);
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

description = ["Ввод данных", "Поиск в глубину с обратным ориентирванием ребер", "Разворот списка", "Раскраска", "Поиск мостов  проходом по ребрам и сравниванием цветов", "Алгортим завершен"];
description_long = ['Ввод данных.', 'Поиск в глубину с обратным ориентирванием ребер. То есть при прохождении по ребру (v. u) (то есть когда мы находимся в вершине v, а вершина u еще не посещена) мы превращаем это ребро в ориентиронное в обратную сторону. В итоге могут остаться ребра, по которым обход в глубину вообще не проходил. Они останутся неориентированными. Также при выходе из DFS запоминаем в отдельный массив номера вершин.', 'Разворачиваем полученный массив.', 'Далее мы идем циклом по нашемк списку и, если вершина не помечена как посещенная, запускаем функцию обхода в глубину, которая работает на ориентированном графе. Она просто красит все достижимые вершины в цвет очередной компоненты.', 'Далее проходимся по всем ребрам. Те ребра, которые соединяют вершины, покрашенные в разный цвет, являются мостами.', 'Алгоритм закончен']
function UpdateTable() {
    let table = document.getElementById("graph_neighbors");
    document.getElementById("alg-step").textContent = "Этап алгоритма: " + step_alg_num + ' (' + description[step_alg_num]+')';
    document.getElementById("obhod").textContent = "Обход: "+order_out;
    document.getElementById("step-description").textContent = "Описание этапа: "+ description_long[step_alg_num];
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
        .force("collide", d3.forceCollide(75));

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

  function ColorEdge(a, b, color) {
    var svg = d3.select("svg");
    let edge = svg.select(".link[source='"+b+"'][target='"+a+"']");
    edge.style("stroke", color);
    edge.style("stroke-width", "2");
    let edge2 = svg.select(".link[source='"+a+"'][target='"+b+"']");
    edge2.style("stroke", color);
    edge2.style("stroke-width", "2");
  }
  
  function CurEdge(a, b) {
    var svg = d3.select("svg");
    let edge = svg.select(".link[source='"+b+"'][target='"+a+"']");
    edge.style("stroke-width", "4");
    let edge2 = svg.select(".link[source='"+a+"'][target='"+b+"']");
    edge2.style("stroke-width", "4");
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
    else if (step_alg_num == 4){
        go_next_4();
    }
    else {
        alert("Алгоритм закончен");
    }
    UpdateTable()
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
let curr_color = 0;
let colors = ['', "gold", "blue", "green", "black", "grey", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange"];
let visited_3 = [];
let prev = 0;

function go_next_3 () {
    if (order.length == 0) {
        if (q == order_out.length) {
            step_alg_num = 4;
            UpdateTable();
            CurEdge(edge_list[0][0], edge_list[0][1]);
            document.getElementById("on-checking").textContent = "На проверке ребро "+edge_list[0][0]+"-"+edge_list[0][1];
            return;
        }
        if (!visited_3.includes(order_out[q])) {
            order.push(order_out[q]);
            curr_color += 1;
        }
        q += 1;
        go_next_3();
        return;
    }
    let now = order[order.length - 1];
    ColorVertex(now, colors[curr_color]);
    color_dict[now] = curr_color;
    if (!(visited_3.includes(now))) {
        visited_3.push(now);
    }
    let was_neighbor = 0;
    for (let i = 0; i < graph_dict[now].length; i++) {
        let neigh = graph_dict[now][i];
        if (!(visited_3.includes(neigh))) {
            order.push(neigh);
            was_neighbor = 1;
            break;
        }
    }
    if (was_neighbor == 0) {
        order.pop();
        if (order.length != 0) {
            go_next_3();
        }
    }
}

let edge_num = 1;
let found_bridges = [];

function go_next_4 () {
    if (edge_num == edge_list.length + 1) {
        step_alg_num = 5;
        document.getElementById("on-checking").textContent = "Статус: Алгоритм закончен";
        return;
    }
    let edge_i = edge_list[edge_num - 1];
    if (color_dict[edge_i[0]] != color_dict[edge_i[1]]) {
        ColorEdge(edge_i[0], edge_i[1], "red");
        found_bridges.push(" "+edge_i[0]+"-"+edge_i[1]);
    }
    else {
        ColorEdge(edge_i[0], edge_i[1], "black");
    }
    UpdateTable();
    if (edge_num < edge_list.length) {
        let edge_next = edge_list[edge_num];
        CurEdge(edge_next[0], edge_next[1]);
        document.getElementById("on-checking").textContent = "На проверке ребро "+edge_next[0]+"-"+edge_next[1];
    }
    else {
        document.getElementById("on-checking").textContent = "Статус: Алгоритм закончен";
    }
    let print_bridges = document.getElementById("found-bridges");
    print_bridges.textContent = "Найденные мосты: "+found_bridges;
    edge_num += 1;
}

function NextStep () {
    if (step_alg_num == 5) {
        alert("Алгоритм закончен");
    }
    else if (step_alg_num == 0) {
        alert("Сначала запустите алгоритм");
    }
    else {
        let next = step_alg_num + 1;
        while (step_alg_num != next) {
            GoNext();
        }
    }
}
let p1 = '1 2\n3 4\n5 6\n6 7\n7 8\n8 6\n8 2'
let p2 = '1 2\n2 4\n4 5\n4 3\n3 1'
let p3 = '1 2\n2 3\n3 1\n4 5\n1 5\n3 5\n4 6\n4 7'
let p4 = '1 2\n1 3\n1 4\n2 3\n2 4\n3 4\n3 2\n6 3\n6 1\n6 7'

function fill1 () {
    document.getElementById("edge-input").textContent = p1
    document.getElementById("start-input").textContent = '1'
}


function fill2 () {
    document.getElementById("edge-input").textContent = p2
    document.getElementById("start-input").textContent = '3'
}

function fill3 () {
    document.getElementById("edge-input").textContent = p3
    document.getElementById("start-input").textContent = '5'
}

function fill4 () {
    document.getElementById("edge-input").textContent = p4
    document.getElementById("start-input").textContent = '4'
}

let go_next_btn = document.getElementById("go-next-btn");
go_next_btn.addEventListener("click", GoNext);

let add_vertex_button = document.getElementById("add-vertex-btn");
add_vertex_button.addEventListener("click", UpdateGraph);

let run_algorithm_button = document.getElementById("run-algorighm-btn");
run_algorithm_button.addEventListener("click", RunAlgrotihm);

let reload_button = document.getElementById("reload-page");
reload_button.addEventListener("click", reloadPage);

let next_step_button = document.getElementById("go-next-step-btn");
next_step_button.addEventListener("click", NextStep);

let ex1 = document.getElementById("ex-1");
ex1.addEventListener("click", fill1);

let ex2 = document.getElementById("ex-2");
ex2.addEventListener("click", fill2);

let ex3 = document.getElementById("ex-3");
ex3.addEventListener("click", fill3);

let ex4 = document.getElementById("ex-4");
ex4.addEventListener("click", fill4);
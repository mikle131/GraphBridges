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
        .force("collide", d3.forceCollide(60));

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
function ColorVertex(num) {
    var svg = d3.select("svg");
    if (!vertex) {
        alert("Вершина не найдена");
        return;
    }
    let node = svg.select(".node[id='"+num+"']");
    node.select("circle")
        .style("fill", "red");

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
    ColorVertex(num);
    DeleteEdge(1, 2);
}

function reloadPage() {
    document.location.reload()
}

let add_vertex_button = document.getElementById("add-vertex-btn");
add_vertex_button.addEventListener("click", UpdateGraph);

let run_algorithm_button = document.getElementById("run-algorighm-btn");
run_algorithm_button.addEventListener("click", RunAlgrotihm);

let reload_button = document.getElementById("reload-page");
reload_button.addEventListener("click", reloadPage);
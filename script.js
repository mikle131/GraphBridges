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

function DrawGraph() {
    let graph = { nodes: [], links: [] };
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

    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "black")
        .style("stroke-width", 2);

    var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("class", "node");

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
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node.transition()
            .duration(20)
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
    }
}

function SetOrientation(a, b) {
    var edge = graph.links.find(function(link) {
      return link.source.id === a && link.target.id === b;
    });  
    if (edge) {
      edge.oriented = true;
    }  
    svg.select(".link[source='" + a + "'][target='" + b + "']")
      .attr("marker-end", function(d) {
        return d.oriented ? "url(#arrowhead)" : null;
      });
  }

let addVertexBtn = document.getElementById("add-vertex-btn");
addVertexBtn.addEventListener("click", UpdateGraph);
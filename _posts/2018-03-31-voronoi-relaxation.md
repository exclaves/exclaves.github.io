---
layout: post
title: Lloyd's relaxation with color coded cells
date: 2018-03-31 00:00:00 +0000
---
I saw an interesting visualization on [Jason Davie's website](https://www.jasondavies.com/lloyd/) last night of Lloyd's relaxation algorithm. I thought it was fun to watch the cells slowly change number of sides and irregularity, so I extended his visualization to color cells differently depending on their irregularity.

<script src="https://www.jasondavies.com/d3.min.js""></script>

<div id="chart"><canvas width="1920" height="960" style="width: 960px; height: 480px;"></canvas></div>

<script>
var ratio = window.devicePixelRatio || 1,
width = 960 \* ratio,
height = 480 \* ratio,
n = 1000,
vertices;

var voronoi = d3.geom.voronoi()
.clipExtent(\[\[0, 0\], \[width, height\]\]);

var canvas = d3.select("#chart").append("canvas")
.attr("width", width)
.attr("height", height)
.style("width", width / ratio + "px")
.style("height", height / ratio + "px")
.on("click", function() {
var mouse = d3.mouse(this);
reset(mouse\[0\] \* ratio, mouse\[1\] \* ratio);
});

var context = canvas.node().getContext("2d");
context.fillStyle = "#00f";
context.lineWidth = .5 \* ratio;
context.strokeStyle = "#000";

var iterations,
format = d3.format(",f");

d3.timer(redraw);

reset(width / 2, height / 2);

function mean(data) {
if (data.length < 1) return 0;
return data.reduce(function(memo, num) { return memo + num; }, 0)/data.length;
}
function stdev(data) {
if (data.length < 1) return 0;
var setMean = mean(data);
var totalDeviation = data.reduce(function(memo, num){ return memo + Math.pow(setMean - num, 2);  },0);
return Math.sqrt(totalDeviation/data.length);
}

function get_color(irregularity, size, sides) {
var max_irregularity = 20 / (Math.pow(width \* height / n, 0.25) \* 4);
irregularity /= max_irregularity;
var hue = irregularity \* 360;
hue += Date.now()/100;

var max_size = Math.sqrt(width \* height / n) \* 4;
size /= max_size;

if (sides == 4) {
hue -= 180;
} else if (sides == 5) {
hue -= 90;
}

return d3.hcl(hue % 360, size\*80, 80 - size \* 60 - (irregularity  \* 80));
}

function redraw() {
var cells = voronoi(vertices),
dx = 0,
dy = 0,
edges = {};

for (var i = 0, n = cells.length; i < n; ++i) {
var cell = cells\[i\];
if (cell == null) continue;

    var area = d3.geom.polygon(cell).area(),
        centroid = cell.centroid(-1 / (6 * area)),
        vertex = vertices[i],
        δx = centroid[0] - vertex[0],
        δy = centroid[1] - vertex[1];
    dx += Math.abs(δx);
    dy += Math.abs(δy);
    vertex[0] += δx, vertex[1] += δy;
    
    var p0 = cell[0];
    if (!p0) continue;
    lengths = []
    for (var j = 1; j < cell.length; j++) {
      lengths.push(Math.sqrt(Math.pow(cell[j][1] - cell[j-1][1], 2) + Math.pow(cell[j][0] - cell[j-1][0], 2)))
    }
    context.fillStyle = get_color(stdev(lengths)/Math.sqrt(area), Math.sqrt(area), cell.length);
    context.beginPath();
    context.moveTo(p0[0], p0[1]);
    for (var j = 1, m = cell.length, k0 = p0[0] + "," + p0[1]; j < m; ++j) {
      var p = cell[j];
      context.lineTo(p[0], p[1]);
      var k = p[0] + "," + p[1];
      if (k0 < k) edges[k0 + "," + k] = [p0, p];
      else edges[k + "," + k0] = [p, p0];
      p0 = p, k0 = k;
    }
    context.fill();

}

d3.select("#iterations").text(format(++iterations));

if (dx \* dx + dy \* dy < 1e-6) return true;
}

function reset(x, y) {
vertices = d3.range(n).map(function(d) {
return \[x + Math.random() - .5, y + Math.random() - .5\];
});
iterations = 0;
}
</script>
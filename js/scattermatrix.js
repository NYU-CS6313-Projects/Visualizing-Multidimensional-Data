

function Scattermatrix(sel, datafile, indexlist){

var width = 500,
    size = width*.9/indexlist.length,
    padding = .05*size;

var paddingLeft = 150;
var paddingRight = 50;
var paddingTop = 10 + (paddingLeft + paddingRight) * 0.5;
var paddingBottom = 20 + (paddingLeft + paddingRight) * 0.5;
this.padding = function() {
  return [ paddingTop, paddingRight, paddingBottom, paddingLeft ];
};

var x = d3.scale.linear()
    .range([padding / 2, size - padding / 2]);

var y = d3.scale.linear()
    .range([size - padding / 2, padding / 2]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);
    

sel.style({
  "display": "inline-block"
});


d3.csv(datafile, function(error, data) {
  var domainByTrait = {};
  var attributelist = d3.keys(data[0]);
  var traits = [];
  var rows = 0;
  for (index in indexlist) {
    traits.push(attributelist[indexlist[index]]);
  }
  var n = traits.length;

  traits.forEach(function(trait) {
    domainByTrait[trait] = d3.extent(data, function(d) { 
      rows = rows + 1;
      return parseFloat(d[trait]); 
    });
  });
  rows = rows/indexlist.length;

  xAxis.tickSize(size * n);
  yAxis.tickSize(-size * n);

  var svg = sel.append("svg")
      .attr("width", size * n + padding)
      .attr("height", size * n + padding)
    .append("g")
      .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

  // svg.selectAll(".x.axis")
  //     .data(traits)
  //   .enter().append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
  //     .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

  // svg.selectAll(".y.axis")
  //     .data(traits)
  //   .enter().append("g")
  //     .attr("class", "y axis")
  //     .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
  //     .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

  var cell = svg.selectAll(".cell")
      .data(cross(traits, traits))
    .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
      .each(plot);

  // Titles for the diagonal.
  cell.filter(function(d) { return d.i === d.j; }).append("text")
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .style("font-size", (4/(1+indexlist.length)).toString()+"em")
      .text(function(d) { return d.x; });

  function plot(p) {
    var cell = d3.select(this);

    x.domain(domainByTrait[p.x]);
    y.domain(domainByTrait[p.y]);

    cell.append("rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding)
        .attr("fill", "white")
        .style("fill-opacity", 0)
        .style("stroke", "lightgray");

    console.log(data[0][p.x])

    if (p.x === p.y){
      holder = []
      for (i = 0; i < data.length; i++) { 
        holder.push(parseFloat(data[i][p.x]));
      }
      
      var data1 = d3.layout.histogram()
        .bins(x.ticks(20))
        (holder);
      var histy = d3.scale.linear()
        .domain([0, d3.max(data1, function(d) { return d.y; })])
        .range([size - padding, (size - padding)*0.15]);
      var bar = cell.selectAll(".bar")
        .data(data1)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + histy(d.y) + ")"; })
        .style("fill-opacity", 0.7)
        .style("fill", "crimson");

      console.log(x(data[0].dx));
      console.log(data[0]);

      bar.append("rect")
        .attr("x", 1)
        .attr("width", x(data1[0].dx) - 5)
        .attr("height", size - padding);

    }else{

      cell.selectAll("circle")
          .data(data)
        .enter().append("circle")
          .attr("cx", function(d) { return x(d[p.x]); })
          .attr("cy", function(d) { return y(d[p.y]); })
          .attr("r", 10/indexlist.length)
          .style("fill-opacity", .1*Math.log10(rows))
          .style("fill", "crimson");
    }
  }

  function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
  }

  d3.select(self.frameElement).style("height", size * n + padding + 20 + "px");
});
}
document.addEventListener("DOMContentLoaded", function() {
    d3.json("skill_data.json").then(function(data) {
      var words = data.map(function(d) {
        return { text: d.skill, count: d.count };
      });
  
      var colorScale = d3.scaleLinear()
        .domain([0, d3.max(words, function(d) { return d.count; })])
        .range(["#e0f3db", "#0868ac"]); // Adjust the range to desired darker colors
  
      var layout = d3.layout.cloud()
        .size([800, 500])
        .words(words)
        .padding(3)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .fontSize(function(d) { return Math.sqrt(d.count) * 7; })
        .on("end", draw);
  
      layout.start();
  
      function draw(words) {
        var svg = d3.select("#word-cloud")
          .append("svg")
          .attr("width", 800)
          .attr("height", 500)
          .append("g")
          .attr("transform", "translate(400, 250)");
  
        var wordElements = svg.selectAll("text")
          .data(words)
          .enter()
          .append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("fill", function(d) { return colorScale(d.count); }) // Use color scale for fill color
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
  
        wordElements.on("mouseover", function(event, d) { // Include event parameter
          var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("background-color", "rgba(0, 0, 0, 0.7)")
            .style("color", "#fff")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("font-size", "12px")
            .style("left", (event.pageX + 10) + "px") // Use event.pageX instead of d3.event.pageX
            .style("top", (event.pageY - 10) + "px") // Use event.pageY instead of d3.event.pageY
            .text(`Number of positions that require this skill: ${d.count}`);
          console.log(d);
  
          wordElements.on("mousemove", function() {
            tooltip.style("left", (event.pageX + 10) + "px") // Use event.pageX instead of d3.event.pageX
              .style("top", (event.pageY - 10) + "px"); // Use event.pageY instead of d3.event.pageY
          });
  
          wordElements.on("mouseout", function() {
            tooltip.remove();
          });
        });
  
        // Ensure all words are displayed correctly
        wordElements
          .attr("opacity", 0)
          .transition()
          .duration(1000)
          .attr("opacity", 1);
  
        // Ensure the word with the largest count is displayed on top
        wordElements.order();
      }
    });
  });
  
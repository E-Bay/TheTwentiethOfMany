var screen = {width:1000,height:700}
var margins = {top:10,right:50,left:25,bottom:50}

var dataPromise = d3.json("penguins/classData.json")

dataPromise.then(function(data)
{
    var newData = transformPen(data)
    console.log(newData)
    setup(newData)
},
function(err)
{console.log("Fail", err)})

var transformPen = function(classroom)
{
    var newData = classroom.map(changePen)
    return newData
}

var changePen = function(penguin)
{
    var quizList = penguin.quizes.map(getGrade)
    penguin.quizGrades = quizList
    return penguin
}

var getGrade = function(quiz)
{
    return quiz.grade
}

var setup = function(classroom)
{
    d3.select("svg")
      .attr("width",screen.width)
      .attr("height",screen.height)
      .append("g")
      .attr("id","graph")
      .attr("transform","translate("+margins.left+","+margins.top+")");
var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;

    var xScale = d3.scaleLinear()
                   .domain([0,38])
                   .range([0,width])
    var yScale = d3.scaleLinear()
                    .domain([0,10])
                    .range([height,0])
    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale)
    d3.select("svg")
      .append("g")
      .classed("axis",true)
    
    d3.select(".axis")
      .append("g")
      .attr("id","xAxis")
      .attr("transform","translate("+margins.left+","+(margins.top+height)+")")
      .call(xAxis)
    
    d3.select(".axis")
      .append("g")
      .attr("id","yAxis")
      .attr("transform","translate(25, "+margins.top+")")
      .call(yAxis)
    
    d3.select("#graph")
      .selectAll("circle")
      .data(classroom[0].quizGrades)
      .enter()
      .append("circle")
      .attr("fill","black")
      .attr("cx",function(num,index){return xScale(index)})
      .attr("cy",function(num){return yScale(num)})
      .attr("r", 3)
    
    makeButtons(classroom,xScale,yScale)
    drawArray(classroom,xScale,yScale,0)
}

var drawArray = function(classroom,xScale,yScale,index)
{
    d3.select("#graph")
      .selectAll("circle")
      .data(classroom[index].quizGrades)
      .transition()
      .attr("fill","black")
      .attr("cx",function(num,index){return xScale(index)})
      .attr("cy",function(num){return yScale(num)})
      .attr("r", 3)
}

var makeButtons = function(classroom,xScale,yScale)
{
    d3.select("#buttons")
      .selectAll("button")
      .data(classroom)
      .enter()
      .append("button")
      .text(function(penguin,index)
           {
                return "Penguin "+ (index + 1)
           })
      .on("click", function(penguin,index){return makeImage(penguin), drawArray(classroom,xScale,yScale,index)})
}
          
var makeImage = function(penguin)
{
    d3.select("#imgs *").remove()
    d3.select("#imgs")
      .append("img")
      .attr("src", function(){return "penguins/" + penguin.picture})
}
/**
 * Created by jack on 2017/3/9.
 */
var width = 800;  //画布的宽度
var height = 600;   //画布的高度

var svg = d3.select(".item")     //选择文档中的body元素
    .append("svg")          //添加一个svg元素
    .attr("width", width)       //设定宽度
    .attr("height", height);    //设定高度


var circle1 = svg.append("circle")
    .attr("cx", 100)
    .attr("cy", 100)
    .attr("r", 45)
    .style("fill","green");

//在1秒（1000毫秒）内将圆心坐标由100变为300
//    circle1.transition()
//            .duration(1000)
//            .attr("cx", 300);

//在1.5秒（1500毫秒）内将圆心坐标由100变为300，
//将颜色从绿色变为红色
//    circle1.transition()
//            .duration(1500)
//            .attr("cx", 300)
//            .style("fill","red");



//在2秒（2000毫秒）内将圆心坐标由100变为300
//将颜色从绿色变为红色
//将半径从45变成25
//过渡方式采用bounce（在终点处弹跳几次）
circle1.transition()
    .duration(2000)
    .ease("bounce")
    .attr("cx", 300)
    .style("fill","red")
    .attr("r", 25);


/**
 * update 与 enter
 * @type {number[]}
 */
var dataset = [ 3 , 6 , 9 , 12 , 15 ];

//选择body中的p元素
var p = d3.select("body").selectAll("p");

//获取update部分
var update = p.data(dataset);

//获取enter部分
var enter = update.enter();

//update部分的处理：更新属性值
update.text(function(d){
    return "update " + d;
});

//enter部分的处理：添加元素后赋予属性值
enter.append("p")
    .text(function(d){
        return "enter " + d;
    });


/**
 * update 与 exit
 * @type {number[]}
 */
var dataset = [ 3 ];

//选择body中的p元素
var p = d3.select("body").selectAll("p");

//获取update部分
var update = p.data(dataset);

//获取exit部分
var exit = update.exit();

//update部分的处理：更新属性值
update.text(function(d){
    return "update " + d;
});

//exit部分的处理：修改p元素的属性
exit.text(function(d){
    return "exit";
});

//exit部分的处理通常是删除元素
// exit.remove();
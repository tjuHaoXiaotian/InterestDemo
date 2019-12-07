/**
 * Created by haoxiaotian on 2017/3/9.
 */

// Q table，初始化为空，行代表不同的状态 s，列代表不同action
var Q = [ ];
var learningRate = 0.8;
var exploreRate = 1;
var episodeTimes = 10;
var moveTerminal = 500;

// 初始化状态数组
var states = [];


// 图形数组
var circles = [];

/**
 * 节点
 * @param x 圆心 x
 * @param y 圆心 y
 * @param radius 半径
 * @param isTarget 是否是目的地
 * @param reward  到达该节点获得的 reward
 * @returns {{graphic: {x: *, y: *, radius: *}, isTarget: *, reward: *}}
 * @constructor
 */
var Node = function(x,y,radius,isTarget,reward){
    return {
        index:0,
        graphic: {
            x:x,
            y:y,
            radius:radius
        },

        isTarget:isTarget,
        reward:reward,
        children:[],

        setIndex:function(id){
            this.index = id;
        },

        setX:function(x){
            this.graphic.x = x;
        },

        setY:function(y){
            this.graphic.y = y;
        },

        setRadius:function(radius){
            this.graphic.radius = radius;
        },

        setTarget:function(){
            this.isTarget = true;
        },

        setReward:function(reward){
            this.reward = reward;
        },

        addChild:function(node){
            this.children.push(node);
        },

        getChildren:function(){
            return this.children;
        }
    };
};

function initQTable(stateNum,actionNum){
    var table = $("#q-table");
    var tr = $("<tr></tr>");
    tr.append($('<td>S\\A</td>'));
    var i = 0,j = 0,line = [];
    for(i = 0;i < actionNum;i++){
        tr.append($("<td>a"+i+"</td>"));
    }
    table.append(tr);
    for(i = 0;i < stateNum;i++){
        line = [];
        tr = $("<tr></tr>");

        tr.append($("<td>s"+i+"</td>"));
        for(j = 0;j < actionNum;j++){
            line.push(0);
            tr.append($('<td id="'+i+"_"+j+'">0</td>'))
        }
        table.append(tr);
        Q.push(line);
    }
}

function initNodes(stateNum){
    // 初始化为 （0,0），半径：20，非目标结点，reward：-1
    var i = 0;
    for(;i < stateNum;i++){
        states.push(new Node(0,0,30,false,-1));
    }

}

function showText(text){
    $(".information").text(text);
}

function updateQValue(id,text){
    $(id).text(text);
}

function training(stateNum){
    // 随机选择起始位置
    var node = states[GetRandomNum(0, stateNum - 1)];
    circles[node.index].style("fill", "green");
    showText("restart at position " + node.index);
    move(stateNum,node);
}

function move(stateNum,node){
    setTimeout(function(){
        circles[stateNum-1].style("fill", "red");

        if (!node.isTarget) {
            //console.log(node);

            var newState = ChooseAction(node);

            // 收到的直接reward
            var reward = newState.reward;

            // 更新 Q table Q(s,a)
            Q[node.index][newState.index] = (1 - exploreRate) * Q[node.index][newState.index] + exploreRate * (reward + learningRate * GetHighestRewardOnState(newState));

            updateQValue("#"+node.index+"_"+newState.index,Q[node.index][newState.index].toFixed(2));

            //circles[node.index].style("fill", "orange");
            circles[node.index].transition().duration(200).style("fill", "orange");

            node = newState;

            //circles[newState.index].style("fill", "green");
            circles[node.index].transition().duration(200).style("fill", "green");
            move(stateNum,newState)
        }else{
            showText("one episode finished!");
            episodeTimes++;
            setTimeout(function(){
                if(episodeTimes % 10 == 0){
                    updateExploreRate();
                }
                if(exploreRate < 0.01){
                    showText("training finished!")
                }else{
                    training(stateNum)
                }
            },1500)
        }
    },moveTerminal);
}

// 返回对应的下一个状态
function ChooseAction(state){
    var children = state.getChildren();
    // 探索： 随机选择一个 Action
    var action = GetRandomNum(0,children.length-1);
    if(Math.random() > exploreRate){  // 使用 knowledge
        var maxValue = Q[state.index][children[action].index];  // 随机一个元素当做当前最大值，保证即使 children value 全部相等也会随机选择 action
        children.forEach(function(value,index,array){
            if(Q[state.index][value.index] > maxValue){
                maxValue = Q[state.index][value.index];
                action = index;
            }
        });
    }
    // 选择对应 action 后转移到的状态
    return children[action];
}

function GetHighestRewardOnState(state)
{
    var maxValue = -Number.MAX_VALUE;
    var children = state.getChildren();
    children.forEach(function(value,index,array){
        if(Q[state.index][value.index] > maxValue){
            maxValue = Q[state.index][value.index];
        }
    });
    return maxValue;
}

function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}

function updateExploreRate(){
    exploreRate = 1 / Math.sqrt(episodeTimes/10);
    setExploreRate();
}

function setExploreRate(){
    $("#q-table .header").text("Q TABLE, explore rate:"+exploreRate)
}
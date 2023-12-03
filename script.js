const myCanvas = document.getElementById("myCanvas");
const summText = document.querySelector(".summ-text");
const listBlock = document.querySelector(".list-expenses");
const listValue = listBlock.querySelectorAll(".list-value");
const markColor = listBlock.querySelectorAll(".mark-color");
const listDiv = listBlock.querySelectorAll(".list-div");

const circle = myCanvas.getContext("2d");
const xCircle = myCanvas.width/2;
const yCircle = myCanvas.height/2;
const rCircle = Math.min(myCanvas.width/2-myCanvas.width/10, myCanvas.height/2-myCanvas.height/10);
const colorList = ["#7bbbe3","#d5c0c6","#7d879c","#de9d2d","#f38eb5","#7ad1a2","#f38687","#ea5253", "#a4d5b3","#65849f", "#ae7ac2"];

let startAngleArr = [];
let endAngleArr = [];

function drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color){
    ctx.fillStyle = color;
	ctx.beginPath();
	ctx.moveTo(centerX,centerY);
	ctx.arc(centerX, centerY, radius, startAngle, endAngle);
	ctx.closePath();
	ctx.fill();
}
function sumValueFn(list){
    let sumValue = 0;
    for(let i=0; i < list.length; i++){
        sumValue = sumValue + Number(list[i].textContent); 
    }
    let startAngle = 0;
    summText.innerHTML = summText.textContent  + " " + sumValue + " &#8381";
    for(let i=0; i < list.length; i++){
        positionValue = Number(list[i].textContent)*100/sumValue;
        sliceAngle = 2 * Math.PI * positionValue/100;
        list[i].innerHTML = list[i].textContent + " &#8381" + " (" + positionValue.toFixed(1) +"%)";
        markColor[i].style.background = colorList[i];
        startAngleArr.push(startAngle);
        endAngleArr.push(startAngle+sliceAngle);
        drawPieSlice(circle, xCircle, yCircle, rCircle, startAngle, startAngle+sliceAngle, colorList[i]);
        startAngle += sliceAngle;
    }
}
sumValueFn(listValue);
    function updateCanvas(){
        circle.clearRect(0, 0, myCanvas.width, myCanvas.height)
        listBlock.classList.remove("selected");
        for(let i=0; i < startAngleArr.length; i++){
            drawPieSlice(circle, xCircle, yCircle, rCircle, startAngleArr[i], endAngleArr[i], colorList[i]);
            newPiece = false;
            if(listDiv[i].classList.contains("active")){
                listDiv[i].classList.remove("active");
                updateCanvas()
            }
        }
    }
myCanvas.addEventListener("mousemove", clickFn, false);
    let newPiece = false;
    let listDivNumber = false;
function clickFn(e){
    let clickX = e.pageX - myCanvas.offsetLeft;
    let clickY = e.pageY - myCanvas.offsetTop;
    let distanceFromCenter = Math.sqrt(Math.pow(xCircle - clickX, 2) + Math.pow(yCircle - clickY, 2))
    if (distanceFromCenter <= rCircle) {
        let a = clickY - yCircle;
        let b = clickX - xCircle;
        let result = Math.atan2(a,b);
        if(result < 0){
            result += 2*Math.PI
        }
        for(let i=0; i < startAngleArr.length; i++){
            if(result >= startAngleArr[i] && result <= endAngleArr[i]){
                if(newPiece == true){
                    updateCanvas();
                }
                drawPieSlice(circle, xCircle, yCircle, Math.min(myCanvas.width/2, myCanvas.height/2) , startAngleArr[i], endAngleArr[i], colorList[i]);
                listBlock.classList.add("selected");
                listDiv[i].classList.add("active");
                newPiece = true;
                listDivNumber = i;
            }                
        }
    }else{
        updateCanvas();
    }
}
listBlock.addEventListener("mousedown", clickFn1, false);
function clickFn1(e){
    if(e.target.parentNode != listDiv){
                updateCanvas();
    }
    for(i=0; i < 10; i++){
        if(e.target.parentNode == listDiv[i]){
                updateCanvas();
                drawPieSlice(circle, xCircle, yCircle, Math.min(myCanvas.width/2, myCanvas.height/2) , startAngleArr[i], endAngleArr[i], colorList[i]);
                listBlock.classList.add("selected");
                listDiv[i].classList.add("active");
        }
    }
}
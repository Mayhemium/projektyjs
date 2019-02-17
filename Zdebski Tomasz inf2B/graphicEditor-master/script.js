let pixels;
let original;
let grey = false;
let isSepia = false;
let isBlur = false;
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let flag = false;
let prevX = 0;
let currX = 0;
let prevY = 0;
let currY = 0;
let dot_flag = false;
ctx.strokeStyle = document.getElementById("colorPicker").value;
ctx.lineWidth = document.getElementById("sizePicker").value;


document.getElementById('inp').onchange = function(e) {
    let img = new Image();
    img.onload = draw;
    img.onerror = failed;
    img.src = URL.createObjectURL(this.files[0]);
};
function draw() {
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(this, 0,0);
    pixels = ctx.getImageData(0,0,canvas.width,canvas.height);
    original = ctx.getImageData(0,0,canvas.width,canvas.height);


}
function failed() {
    console.error("The provided file couldn't be loaded as an Image media");
}

function greyOut(){
    for(let i =0; i<pixels.data.length;i+=4){
        let avg = (original.data[i]+original.data[i+1]+original.data[i+2])/3;
        pixels.data[i] = avg;
        pixels.data[i+1] = avg;
        pixels.data[i+2] = avg;
    }
    ctx.putImageData(pixels,0,0);
}
function sepia(){
    for(let i =0; i<pixels.data.length;i+=4){
        let r = pixels.data[i];
        let g = pixels.data[i + 1];
        let b = pixels.data[i + 2];
        let tr = 0.393 * r + 0.769 * g + 0.189 * b;
        let tg = 0.349 * r + 0.686 * g + 0.168 * b;
        let tb = 0.272 * r + 0.534 * g + 0.131 * b;
        if (tr > 255) r = 255; else r = tr;
        if (tg > 255) g = 255; else g = tg;
        if (tb > 255) b = 255; else b = tb;
        pixels.data[i] = r;
        pixels.data[i+1] = g;
        pixels.data[i+2] = b;
    }
    ctx.putImageData(pixels,0,0);
}
function blurOut(){
    awesomeConv();
}

function deleteFilter(){
    grey = false;
    isSepia = false;
    isBlur = false;
    for(let i =0; i<pixels.data.length;i+=4){
        pixels.data[i] = original.data[i];
        pixels.data[i+1] = original.data[i+1];
        pixels.data[i+2] = original.data[i+2];
    }
    ctx.putImageData(pixels,0,0);
}

function awesomeConv() {
    var side = 3;
    var halfSide = Math.floor(side/2);
    var src = pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;
    var w = sw;
    var h = sh;
    var alphaFac = false ? 1 : 0;
    for (var y=0; y<h; y++) {
      for (var x=0; x<w; x++) {
        var sy = y;
        var sx = x;
        var dstOff = (y*w+x)*4;
        var r=0, g=0, b=0, a=0;
        for (var cy=0; cy<side; cy++) {
          for (var cx=0; cx<side; cx++) {
            var scy = sy + cy - halfSide;
            var scx = sx + cx - halfSide;
            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
              var srcOff = (scy*sw+scx)*4;
              var wt = 1/9;
              r += src[srcOff] * wt;
              g += src[srcOff+1] * wt;
              b += src[srcOff+2] * wt;
              a += src[srcOff+3] * wt;
            }
          }
        }
        pixels.data[dstOff] = r;
        pixels.data[dstOff+1] = g;
        pixels.data[dstOff+2] = b;
        pixels.data[dstOff+3] = a + alphaFac*(255-a);
      }
    }
    ctx.putImageData(pixels,0,0);
  };

function blurAvg(num){
    return (original.data[(num-4)>=0?num-4:0] + original.data[num] + original.data[(num+4)<=255?num+4:255])/3;
}

document.getElementById("jasnosc").addEventListener("input",
function brightness(e){
    for(let i = 0; i<pixels.data.length;i+=4){
        pixels.data[i] = parseInt(original.data[i])+255*(e.target.value/100);
        pixels.data[i+1] = parseInt(original.data[i+1])+255*(e.target.value/100);
        pixels.data[i+2] = parseInt(original.data[i+2])+255*(e.target.value/100);
    }
    ctx.putImageData(pixels,0,0);
})

document.getElementById("kontrast").addEventListener("input",
function brightness(e){
    let contrast = parseFloat(e.target.value);
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
    for(let i = 0; i<pixels.data.length;i+=4){
        pixels.data[i] = factor * (parseInt(original.data[i])   - 128) + 128;
        pixels.data[i+1] = factor * (parseInt(original.data[i+1])   - 128) + 128;
        pixels.data[i+2] = factor * (parseInt(original.data[i+2])   - 128) + 128;
    }
    ctx.putImageData(pixels,0,0);
})

canvas.addEventListener("mousemove", function (e) {
    findxy('move', e)
}, false);
canvas.addEventListener("mousedown", function (e) {
    findxy('down', e)
}, false);
canvas.addEventListener("mouseup", function (e) {
    findxy('up', e)
}, false);
canvas.addEventListener("mouseout", function (e) {
    findxy('out', e)
}, false);

function findxy(res, e) {
    let pos = getMousePos(e);
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = pos.x;
        currY = pos.y;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = document.getElementById("colorPicker").value;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = pos.x;
            currY = pos.y;
            drawLine();
        }
    }
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function drawLine() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = document.getElementById("colorPicker").value;
    ctx.lineWidth = document.getElementById("sizePicker").value;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.closePath();
}
//figure out why error for "<"
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var x = 0;
var y = 0;
var signing = false;

//event listeners here:
canvas.addEventListener("mousedown", (e) => {
    x = e.offsetX;
    y = e.offsetY;
    signing = true;
});

canvas.addEventListener("mousemove", (e) => {
    if (signing === true) {
        sign(ctx, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
    }
});
canvas.addEventListener("mouseup", (e) => {
    if (signing === true) {
        sign(ctx, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        signing = false;
    }
});

function sign(ctx, a, b, c, d) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(a, b);
    ctx.lineTo(c, d);
    ctx.stroke();
    ctx.closePath();
};

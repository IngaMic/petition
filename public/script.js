const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let x = 0;
let y = 0;
var signing = false;
ctx.strokeStyle = "black";
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.lineWidth = 3;

function sign(e) {
    if (!signing) {
        return;
    } else {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [x, y] = [e.offsetX, e.offsetY];
        //ctx.closePath();
    }
}
canvas.addEventListener("mouseup", (e) => {
    signing = false;
    let dataUrl = canvas.toDataURL();
    hidden.value = dataUrl;
});
canvas.addEventListener("mousemove", (e) => {
    if (signing) {
        return sign(e);
    } else {
        return;
    }
});
canvas.addEventListener("mousedown", (e) => {
    signing = true;
    [x, y] = [e.offsetX, e.offsetY];
});
canvas.addEventListener("mouseout", () => {
    signing = false;
});


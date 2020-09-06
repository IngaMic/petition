//figure out why error for "<"
const canvas = document.getElementById("canvas");
//const hidden = document.getElementById("hidden");
const ctx = canvas.getContext("2d");

var position = {
    x: 0,
    y: 0
};

var signing = false;
canvas.addEventListener("mousedown", (e) => {
    signing = true;
    setNewPosition(e);
});
canvas.addEventListener("mouseup", (e) => {
    signing = false;
    let dataUrl = canvas.toDataURL();
    hidden.value = dataUrl;
    setNewPosition(e);
});
canvas.addEventListener("mousemove", (e) => {
    if (signing) {
        ctx.strokeStyle = "black";
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(position.x, position.y);
        setNewPosition(e);
        console.log(position.x, position.y);
        ctx.lineTo(position.x, position.y);
        ctx.closePath();
        ctx.stroke();
    } else {
        return;
    }
});
canvas.addEventListener("mouseout", () => {
    signing = false;
});
//need to adjust the hight!!
window.addEventListener("resize", (e) => {
    e.clientX - canvas.offsetLeft;
    e.clientY - canvas.offsetTop;
});
function setNewPosition(e) {
    position.x = e.clientX;
    position.y = e.clientY;
}

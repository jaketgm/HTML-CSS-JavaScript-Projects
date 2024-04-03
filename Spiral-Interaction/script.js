const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
ctx.strokeStyle = 'black';
ctx.lineWidth = 1;
ctx.shadowOffsetX = 10;
ctx.shadowOffsetY = 10;
ctx.shadowBlur = 10;
ctx.shadowColor = 'black';
let hue = 0;
let drawing = false;

function drawShape(x,y, radius, inset, n)
{
    // ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);
    ctx.moveTo(0, 0 - radius);

    for (let i = 0; i < n; i++)
    {
        ctx.rotate(Math.PI / n);
        ctx.lineTo(0, 0 - (radius * inset));
        ctx.rotate(Math.PI / n);
        ctx.lineTo(0, 0 - radius);
    }

    ctx.restore();
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}
const radius = 50;
const inset = 0.4;

const n = 2;
drawShape(80, 80, radius * 0.95, 1, 5);
drawShape(120, 120, radius, inset, n);

let angle = 0;
window.addEventListener('mousemove', function(e) {
    if (drawing)
    {
        ctx.save();
        ctx.translate(e.x, e.y);

        ctx.rotate(angle);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        drawShape(0, 0, radius, 1, 3);

        ctx.rotate(-angle * 3);
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        drawShape(radius/2 + 15, radius/2 + 15, radius/2, 0.5, 3);

        ctx.rotate(-angle/2);
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'black';
        drawShape(radius/1.5 + 10, radius/1.5 + 10, radius/5, 0.5, 3);

        angle += 0.05;
        ctx.restore();
    }
});
window.addEventListener('mousedown', function(e) {
    drawing = true;
});
window.addEventListener('mouseup', function(e) {
    drawing = false;
});

//DO this for inset \land radius
function Nally()
{

}

euler = function () {
    const n = 1000000;
    let sum = 0;
    for (let k = 1; k <= n; k++) {
      sum += 1/k;
    }
    const eulerMascheroni = -Math.log(n) + sum - Math.log(sum);
    return eulerMascheroni;
}

//COOL ABSTRACT
// const canvas = document.getElementById('canvas1');
// const ctx = canvas.getContext('2d');
// canvas.height = window.innerHeight;
// canvas.width = window.innerWidth;
// ctx.strokeStyle = 'black';
// ctx.lineWidth = 2;
// ctx.shadowOffsetX = 10;
// ctx.shadowOffsetY = 10;
// ctx.shadowBlur = 10;
// ctx.shadowColor = 'black';
// let hue = 0;
// let drawing = false;
// ctx.globalCompositeOperation = 'difference';

// function drawShape(x,y, radius, inset, n)
// {
//     ctx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
//     ctx.beginPath();
//     ctx.save();
//     ctx.translate(x, y);
//     ctx.moveTo(0, 0 - radius);

//     for (let i = 0; i < n; i++)
//     {
//         ctx.rotate(Math.PI / n);
//         ctx.lineTo(0, 0 - (radius * inset));
//         ctx.rotate(Math.PI / n);
//         ctx.lineTo(0, 0 - radius);
//     }

//     ctx.restore();
//     ctx.closePath();
//     ctx.stroke();
//     ctx.fill();
// }
// const radius = 70;
// const inset = 0.5;
// const n = 20;
// drawShape(120, 120, radius, inset, n);

// let angle = 0;
// window.addEventListener('mousemove', function(e) {
//     if (drawing)
//     {
//         ctx.save();
//         ctx.translate(e.x, e.y);
//         ctx.rotate(angle);
//         hue+=3;
//         angle += 0.1;
//         drawShape(10, 10, radius, inset, n);
//         ctx.restore();
//     }
// });
// window.addEventListener('mousedown', function(e) {
//     drawing = true;
// });
// window.addEventListener('mouseup', function(e) {
//     drawing = false;
// });

//COOL
// const canvas = document.getElementById('canvas1');
// const ctx = canvas.getContext('2d');
// canvas.height = window.innerHeight;
// canvas.width = window.innerWidth;
// ctx.strokeStyle = '#3c415c';
// ctx.lineWidth = 3;
// ctx.shadowOffsetX = 10;
// ctx.shadowOffsetY = 10;
// ctx.shadowBlur = 10;
// ctx.shadowColor = 'black';
// let hue = 0;
// let drawing = false;

// function drawShape(x,y, radius, inset, n)
// {
//     ctx.fillStyle = '#b4a5a5';
//     ctx.beginPath();
//     ctx.save();
//     ctx.translate(x, y);
//     ctx.moveTo(0, 0 - radius);

//     for (let i = 0; i < n; i++)
//     {
//         ctx.rotate(Math.PI / n);
//         ctx.lineTo(0, 0 - (radius * inset));
//         ctx.rotate(Math.PI / n);
//         ctx.lineTo(0, 0 - radius);
//     }

//     ctx.restore();
//     ctx.closePath();
//     ctx.stroke();
//     ctx.fill();
// }
// const radius = 70;
// const inset = 0.4;
// const n = 10;
// drawShape(120, 120, radius * 1.45, 1, 1.5);
// drawShape(120, 120, radius, inset, n);

// let angle = 0;
// window.addEventListener('mousemove', function(e) {
//     if (drawing)
//     {
//         ctx.save();
//         ctx.translate(e.x, e.y);
//         ctx.rotate(angle);
//         hue+=3;
//         angle += 0.1;
//         drawShape(0, 0, radius, inset, n);
//         ctx.restore();
//     }
// });
// window.addEventListener('mousedown', function(e) {
//     drawing = true;
// });
// window.addEventListener('mouseup', function(e) {
//     drawing = false;
// });

//Make Dragon fluid that looks like this
// const canvas = document.getElementById('canvas1');
// const ctx = canvas.getContext('2d');
// canvas.height = window.innerHeight;
// canvas.width = window.innerWidth;
// ctx.strokeStyle = 'black';
// ctx.lineWidth = 3;
// ctx.shadowOffsetX = 10;
// ctx.shadowOffsetY = 10;
// ctx.shadowBlur = 10;
// ctx.shadowColor = 'black';
// let hue = 0;
// let drawing = false;

// function drawShape(x,y, radius, inset, n)
// {
//     ctx.fillStyle = 'red';
//     ctx.beginPath();
//     ctx.save();
//     ctx.translate(x, y);
//     ctx.moveTo(0, 0 - radius);

//     for (let i = 0; i < n; i++)
//     {
//         ctx.rotate(Math.PI / n);
//         ctx.lineTo(0, 0 - (radius * inset));
//         ctx.rotate(Math.PI / n);
//         ctx.lineTo(0, 0 - radius);
//     }

//     ctx.restore();
//     ctx.closePath();
//     ctx.stroke();
//     ctx.fill();
// }
// const radius = 40;
// const inset = 0.4;
// const n = 10;
// drawShape(120, 120, radius * 0.45, 1, 1.5);
// drawShape(120, 120, radius, inset, n);

// let angle = 0;
// window.addEventListener('mousemove', function(e) {
//     if (drawing)
//     {
//         ctx.save();
//         ctx.translate(e.x, e.y);

//         ctx.rotate(angle);
//         drawShape(radius, radius, radius * 0.95, 1, 1.5);

//         ctx.rotate(-angle * 4);
//         drawShape(0, 0, radius, inset, n);

//         angle += 0.05;
//         ctx.restore();
//     }
// });
// window.addEventListener('mousedown', function(e) {
//     drawing = true;
// });
// window.addEventListener('mouseup', function(e) {
//     drawing = false;
// });
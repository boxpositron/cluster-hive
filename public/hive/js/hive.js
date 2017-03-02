
var canvas = document.getElementById('drawing');
var context = canvas.getContext('2d');
var width = window.innerWidth;
var height = window.innerHeight;

var mouse = {
    click: false,
    move: false,
    pos: {
        x: 0,
        y: 0
    },
    pos_prev: false
};

document.addEventListener("DOMContentLoaded", function() {
    // get canvas element and create context

    // set canvas to full browser width/height
    canvas.width = width;
    canvas.height = height;

    // register mouse event handlers
    canvas.onmousedown = function(e) {
        mouse.click = true;
    };
    canvas.onmouseup = function(e) {
        mouse.click = false;
    };

    canvas.onmousemove = function(e) {
        // normalize mouse position to range 0.0 - 1.0

        mouse.pos.x = e.clientX / width;
        mouse.pos.y = e.clientY / height;
        mouse.move = true;
    };


})

var socket = io();

$(document).ready(function() {

    socket.on('connect', function() {
        console.log('Canvas link active');
    });

    // draw line received from server
    socket.on('draw-line', function(data) {
        console.log("Draw line triggered client")
        var line = data.line;
        context.beginPath();
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.stroke();
    });

    mainLoop();
})

function mainLoop() {
    // check if the user is drawing
    if (mouse.click && mouse.move && mouse.pos_prev) {
        // send line to to the server\
        socket.emit('draw-line', {
            line: [mouse.pos, mouse.pos_prev]
        });
        mouse.move = false;
    }
    mouse.pos_prev = {
        x: mouse.pos.x,
        y: mouse.pos.y
    };
    setTimeout(mainLoop, 25);
}
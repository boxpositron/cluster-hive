module.exports = function(io) {
    var line_history = [];

    io.on('connect', function (socket) {

       // first send the history to the new client
       for (var i in line_history) {
          socket.emit('draw-line', { line: line_history[i] } );
       }

       // add handler for message type "draw_line".
       socket.on('draw-line', function (data) {
          // add received line to history
          line_history.push(data.line);
          // send line to all clients
          io.emit('draw-line', { line: data.line });
       });
    });

}

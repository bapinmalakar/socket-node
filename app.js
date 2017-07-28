var express = require('express');
var routes = require('./routes');
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(8000, () => console.log('Server Start::::'));
io.set("origins", "*:*");

var currentPrice = 150;
var app = express();


app.use('/', routes);

io.on('connection', function (socket) {
    socket.emit('myid', socket.id);
    console.log('Connection Socket is: ', socket.id);
    socket.emit('priceUpdate', currentPrice);

    socket.on('mydetails', (clientDetails) => {
        console.log('Client Details is::::', clientDetails);
    })

    socket.on('sendmessage', (data) => {
        console.log('Function Call', data);
        if (io.sockets.connected[data.id]) {
            console.log('Is Connected');
            io.sockets.connected[data.id].emit('receive-message', data.msg);
        }
    })

    socket.on('bid', function (data) {
        currentPrice = parseInt(data);
        socket.emit('priceUpdate', currentPrice);
        socket.broadcast.emit('priceUpdate', currentPrice);
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
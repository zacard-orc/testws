/**
 * Created by linly on 2015/6/25.
 */

Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('testws');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});

var io=require('socket.io')(server);

/*
io.on('connection',function(socket){
    console.log(new Date().format("yyyy-MM-dd hh:mm:ss")+
        ','+socket.nsp.sockets[0].id+
        ','+socket.nsp.sockets[0].conn.remoteAddress+
        ','+socket.nsp.sockets[0].handshake.url+
        ','+socket.nsp.sockets[0].handshake.headers.referer)



    socket.emit('news',{'hello':'world'});
    var now=new Date();
    console.log(new Date().format("yyyy-MM-dd hh:mm:ss")+',Server Send:EVENT=nes|BODY='+JSON.stringify({'hello':'client'}));
    socket.on('my other event',function(data){
       var now=new Date();
       console.log(new Date().format("yyyy-MM-dd hh:mm:ss")+',Server Recv:EVENT=my other event|BODY='+JSON.stringify(data));
   })
});
*/
var chat = io
    .of('/chat')
    .on('connection', function (socket) {
       // console.log(socket)
        socket.on('hi',function(data){
            console.log(new Date().format("yyyy-MM-dd hh:mm:ss")+',Server Recv:EVENT=my other event|BODY='+JSON.stringify(data));
        });
        socket.emit('a message', {
            that: 'only'
            , '/chat': 'will get'
        });
        chat.emit('a message', {
            everyone: 'in'
            , '/chat': 'will get'
        });
    });

var news = io
    .of('/news')
    .on('connection', function (socket) {
        socket.on('woot',function(data){
            console.log(new Date().format("yyyy-MM-dd hh:mm:ss")+',Server Recv:EVENT=my other event|BODY='+JSON.stringify(data));
        });
        socket.emit('item', { news: 'item' });
    });
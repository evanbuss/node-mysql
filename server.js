var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

// load customers route
var customers = require('./routes/customers');
var user = require('./routes/user');
var connection = require('express-myconnection');
var mysql = require('mysql');




var routes = require('./routes');
//var users = require('./routes/users');

var app = express();

// view engine setup & all environments
app.set('port', 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);
/*
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
*/
/// error handlers



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

/* ----------------------------------------
 * connection peer, register as middleware
 * type koneksi: single, pool and request
 * --------------------------------------- */
app.use(
        connection(mysql,{
            host    :'localhost',
            user    :'root',
            password:'root',
            port    :8889, //port mysql
            database:'database'
        }, 'request')
);

// route index, hello world
app.get('/', routes.index);

/*
 * CUSTOMERS REST API
 */
// route customer list
app.get('/customers', customers.list);

// route add customer, get n post
app.get('/customers/add', customers.add);
app.post('/customers/add', customers.save);

// route delete customer
app.get('/customers/delete/:id', customers.delete_customer);

// edit customer route, get n post
app.get('/customers/edit/:id',customers.edit);
app.post('/customers/edit/:id',customers.save_edit);

/*
 * USER REST API
 */
// login
app.post('/user/login',user.login);

// register
app.get('/user', user.show);
app.post('/user',user.save);

//app.use(app.router);
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

// module.exports = app;


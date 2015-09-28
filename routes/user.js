var passwordHash = require('password-hash');

exports.save = function(req,res) {

    var input = JSON.parse(JSON.stringify(req.body));

    req.getConnection(function(req, connection){
        console.log("JSON input: %s", input);
        var data = {
            username    : input.username,
            password    : input.password,
            email       : input.email
        };

        connection.query('INSERT INTO user SET ?',data, function(err, rows) {
            if (err)
                console.log("Error register: %s",err);
            res.redirect('/');
        });
    });
};

exports.show = function(req,res) {
    res.render('register', {page_title: "Register - Node.js"});
};

exports.login = function(req,res) {
    var input = JSON.parse(JSON.stringify(req.body));
    console.log("got here", input.username);

    req.getConnection(function(req, connection) {
        // console.log("got connections",connection);
        connection.query('SELECT * FROM user WHERE username = ?',input.username, function(err, rows) {
            if (err) {
                console.log("Username doesn't exist: %s", err);
                res.render('loginFailed', {page_title:"Login Failed", data:"Username doesn't exist"});
            } else {
                // if (rows[0].password.match(hashstring)) {
                if (input.password == rows[0].password) {
                    console.log("User password is matched");
                    res.render('userHomepage', {page_title:"Homepage - Node.js", data:rows});
                } else {
                    console.log("failed here", input.password, "rows",  rows[0].password);
                    res.render('loginFailed', {page_title:"Login Failed", data:"Password is wrong"});
                }
            }
        });
    });
};

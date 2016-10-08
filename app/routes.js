var User = require('./models/users');

module.exports = function (app) {
    app.get('/', function (req,res) {
        res.send('hellow from routes')
    });

    app.get(':/username/:password', function (req, res) {
        var newUser = new User;
        newUser.local.username = req.params.username;
        newUser.local.password = req.params.password;
        console.log(newUser.username+" "+newUser.password);
        newUser.save(function (err) {
            if (err)
                throw err;
        });
        res.send('success');
    });
};
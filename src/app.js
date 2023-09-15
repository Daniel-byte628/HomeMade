const express = require('express');
const {engine} = require('express-handlebars');
const myconnection = require('express-myconnection');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');

const loginRouts = require('./routes/login');

const app = express();
app.use(express.static('static'));

app.set('port', process.env.PORT || 4000);

app.set('views', __dirname + '/views');
app.engine('.hbs', engine({
    extname: '.hbs',
}))

app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(myconnection(mysql, {
    host: 'containers-us-west-82.railway.app',
    user: 'root',
    password: 'FgU1z4OF6z61fjXzWSfM',
    port: 7455,
    database: 'railway',
}))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})

app.use('/', loginRouts);



app.get('/', (req, res) => {
    if (req.session.loggedin==true) {
        res.render('home', {name: req.session.name});
    }
    else{
        res.redirect('/login')
    }
    
})

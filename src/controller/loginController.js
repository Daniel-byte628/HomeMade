const bcrypt = require('bcrypt');



function login(req, res) {
    if (req.session.loggedin!=true) {
        res.render('login/index');
    }
    else{
        res.redirect('/')
    }
}

function authenticate(req, res) {
    const data = req.body;
    
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM Usuario WHERE usuario = ?', [data.usuario], (err, results) => {
            if (err) {
                // Manejo de error de la consulta
                console.error(err);
                return res.status(500).send('Error interno del servidor');
            }

            if (results.length > 0) {
                const storedHash = results[0].password; // Obtén el hash almacenado en la base de datos
                bcrypt.compare(data.password, storedHash, (err, passwordMatch) => {
                    if (err) {
                        // Manejo de error en la comparación de contraseñas
                        console.error(err);
                        return res.status(500).send('Error interno del servidor');
                    }

                    if (passwordMatch) {
                        req.session.loggedin = true;
                        console.log(results[0].name);
                        req.session.name = results[0].name;
                        res.redirect('/');
                    } else {
                        // Contraseña incorrecta
                        res.render('login/index', {
                            error: 'Contraseña incorrecta'
                        });
                    }
                });
            } else {
                // Usuario no encontrado
                res.render('login/index', {
                    error: 'Usuario incorrecto'
                });
            }
        });
    });
}


function register(req, res) {
    if (req.session.loggedin!=true) {
        res.render('login/register');
    }
    else{
        res.redirect('/')
    }
}

function storeuser(req, res) {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM Usuario WHERE usuario = ? OR correo = ?', [data.usuario, data.correo], (err, results) => {
            if (results.length > 0) {
                const existingUser = results.find((user) => user.usuario === data.usuario);
                const existingEmail = results.find((user) => user.correo === data.correo);
                let errorMessage = '';
                
                if (existingUser) {
                    errorMessage += 'El usuario ya existe. ';
                }
                
                if (existingEmail) {
                    errorMessage += 'El correo electrónico ya está en uso.';
                }
                
                res.render('login/register', {
                    error: errorMessage
                });
            } else {
                bcrypt.hash(data.password, 12).then((hash) => {
                    data.password = hash;
                    conn.query('INSERT INTO Usuario SET ?', [data], (err, user) => {
                        res.redirect('/');
                    });
                });
            }
        });
    });
}

function logout(req, res) {
    if (req.session.loggedin) {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }
    else{
        res.redirect('/login');
    }
}


module.exports = {
    login,
    register,
    storeuser,
    authenticate,
    logout,
}
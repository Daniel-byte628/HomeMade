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
        if (err) {
            console.error(err);
            return res.status(500).send('Error en la conexión a la base de datos');
        }

        // Realizar consulta en la tabla "Usuario"
        const userQuery = 'SELECT * FROM Usuario WHERE usuario = ? OR correo = ?';
        conn.query(userQuery, [data.usuario, data.correo], (err, userResults) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error en la consulta a la base de datos');
            }

            // Realizar consulta en la tabla "profesional"
            const profQuery = 'SELECT * FROM profesional WHERE usuario = ? OR correo = ?';
            conn.query(profQuery, [data.usuario, data.correo], (err, profResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error en la consulta a la base de datos');
                }

                // Combinar los resultados de ambas consultas
                const results = [...userResults, ...profResults];

                if (results.length > 0) {
                    const storedHash = results[0].password;

                    bcrypt.compare(data.password, storedHash, (err, passwordMatch) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('Error interno del servidor');
                        }

                        if (passwordMatch) {
                            req.session.loggedin = true;
                            req.session.name = results[0].name;
                            return res.redirect('/');
                        } else {
                            return res.render('login/index', {
                                error: 'Contraseña incorrecta'
                            });
                        }
                    });
                } else {
                    return res.render('login/index', {
                        error: 'Usuario no encontrado'
                    });
                }
            });
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
        // Realizar consulta en la tabla "Usuario"
        conn.query('SELECT * FROM Usuario WHERE usuario = ? OR correo = ?', [data.usuario, data.correo], (err, userResults) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error en la consulta a la base de datos');
            }

            // Realizar consulta en la tabla "profesional"
            conn.query('SELECT * FROM profesional WHERE usuario = ? OR correo = ?', [data.usuario, data.correo], (err, profResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error en la consulta a la base de datos');
                }

                // Combinar los resultados de ambas consultas
                const results = [...userResults, ...profResults];

                console.log(results); // Imprimir los resultados para verificar

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
                            if (err) {
                                console.error(err);
                                return res.status(500).send('Error al registrar al usuario');
                            }
                            res.redirect('/');
                        });
                    });
                }
            });
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

function registerprofesional(req, res) {
    if (req.session.loggedin!=true) {
        res.render('login/registerprofesional');
    }
    else{
        res.redirect('/')
    }
}

function storeuserprofesional(req, res) {
    const data = req.body;
    console.log(data);
    req.getConnection((err, conn) => {
        // Realizar consulta en la tabla "Usuario"
        conn.query('SELECT * FROM Usuario WHERE usuario = ? OR correo = ?', [data.usuario, data.correo], (err, userResults) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error en la consulta a la base de datos');
            }

            // Realizar consulta en la tabla "profesional"
            conn.query('SELECT * FROM profesional WHERE usuario = ? OR correo = ?', [data.usuario, data.correo], (err, profResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error en la consulta a la base de datos');
                }

                // Combinar los resultados de ambas consultas
                const results = [...userResults, ...profResults];

                console.log(results); // Imprimir los resultados para verificar

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

                    res.render('login/registerprofesional', {
                        error: errorMessage
                    });
                } else {
                    bcrypt.hash(data.password, 12).then((hash) => {
                        data.password = hash;
                        console.log(data);
                        conn.query('INSERT INTO profesional SET ?', [data], (err, user) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send('Error al registrar al profesional');
                            }
                            res.redirect('/');
                        });
                    });
                }
            });
        });
    });
}





module.exports = {
    login,
    register,
    storeuser,
    authenticate,
    logout,
    registerprofesional,
    storeuserprofesional,
}
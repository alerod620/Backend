const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');

router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `SELECT * FROM Usuario WHERE LOWER(Correo) = LOWER(${db.escape(
      req.body.correo
    )});`,
    (err, result) => {

      //El correo ya está registrado
      if (result.length) {
        return res.status(409).send({
          msg: 'El correo ya está registrado'
        });
      } 
      //El correo se puede registrar
      else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err
            });
          } else {
            // has hashed pw => add to database
            db.query(
              `INSERT INTO Usuario (Correo, Nombre, Apellido, Password, IdRol, FechaCreacion) 
              VALUES (
                ${db.escape(req.body.correo)},
                ${db.escape(req.body.nombre)},
                ${db.escape(req.body.apellido)},
                ${db.escape(hash)},
                ${db.escape(1)},
                now())`,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    msg: err
                  });
                }
                return res.status(201).send({
                  msg: 'Registro exitoso'
                });
              }
            );
          }
        });
      }
    }
  );
});

router.post('/login', (req, res, next) => {
  db.query(
    `SELECT * FROM Usuario WHERE Correo = ${db.escape(req.body.correo)};`,
    (err, result) => {
      //El usuario no existe
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }
      //Usuario o contraseña incorrecta
      if (!result.length) {
        return res.status(401).send({
          msg: 'Usuario o contraseña incorrecta'
        });
      }

      // check password
      bcrypt.compare(
        req.body.password,
        result[0]['Password'],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            throw bErr;
            return res.status(401).send({
              msg: 'Usuario o contraseña incorrecta'
            });
          }
          if (bResult) {
            const token = jwt.sign({
                username: result[0].Correo,
                userId: result[0].IdUsuario
              },
              'SECRETKEY', {
                expiresIn: '3h'
              }
            );
            db.query(
              `UPDATE Usuario SET UltimaSesion = now() WHERE IdUsuario = '${result[0].IdUsuario}'`
            );
            return res.status(200).send({
              msg: 'Login exitoso',
              token,
              user: result[0]
            });
          }
          return res.status(401).send({
            msg: 'Usuario o contraseña incorrecta'
          });
        }
      );
    }
  );
});

router.get('/getCursos', (req, res, next) => {
  db.query(
    `SELECT * FROM Curso;`,
    (err, result) => {
      //No encuentra nada en la base de datos
      if (err) 
      {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }
      //Obtiene todos los cursos en que se encuentran en la base de datos
      if (!result.length) 
      {
        return res.status(401).send({
          msg: 'Usuario o contraseña incorrecta'
        });
      }
      else
      {
        return res.status(200).send({
          msg: 'Consulta existosa',
          value: result
        })
      }

    }
  );
});

router.get('/secret-route', (req, res, next) => {
  res.send('This is the secret content. Only logged in users can see that!');
});


//Métodos para las funciones de ADMIN

router.post('/admin/sign-up', userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `SELECT * FROM Usuario WHERE LOWER(Correo) = LOWER(${db.escape(
      req.body.Correo
    )});`,
    (err, result) => {

      //El correo ya está registrado
      if (result.length) {
        return res.status(409).send({
          msg: 'El correo ya está registrado'
        });
      } 
      //El correo se puede registrar
      else {
        bcrypt.hash(req.body.Password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err
            });
          } else {
            // has hashed pw => add to database
            db.query(
              `INSERT INTO Usuario (Correo, Nombre, Apellido, Password, IdRol, FechaCreacion) 
              VALUES (
                ${db.escape(req.body.Correo)},
                ${db.escape(req.body.Nombre)},
                ${db.escape(req.body.Apellido)},
                ${db.escape(hash)},
                ${db.escape(1)},
                now())`,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    msg: err
                  });
                }
                return res.status(201).send({
                  msg: 'Registro exitoso'
                });
              }
            );
          }
        });
      }
    }
  );
});

module.exports = router;
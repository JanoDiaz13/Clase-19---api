//EJERCICIO 1  "Creacion de restful API"

/*
const cors = require("cors");
const multer = require("multer");
const  MethodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');
const express = require("express");
const dayjs = require("dayjs");
*/

import cors from "cors";
import multer from "multer";
import MethodOverride from "method-override";
import {
    v4 as uuid
} from "uuid";
import express from "express";
import path from "path";
import dayjs from "dayjs";  
import { setServers } from "dns";

const server = express();
const log = console.log;

let port = process.env.PORT || 3000;

server.use(express.urlencoded({extended:true}));
server.use(express.json());
server.use(cors());
server.use(MethodOverride());

let users = [{
        email: "asd@gmail.com",
        name: "asd",
        pass: "12345678"
    }

];   

server.listen(3000, () => {
    log("start server");
}).on("error", () => {
    log("error server");
});

server.get("/", (req, res)=>{                                                               
    res.sendFile(path.join(__dirname, "/index.html")); 
});


//1- Mostrar array de users                                              
server.get("/users", (req, res) => {
    res.send(users);
});

//2- Mostrar un user mediante el email             

server.get("/users/email/:email", (req,res)=>{
    let email = req.params.email;
    res.send(users.filter(user => user.email === email));
});

//3- Mostrar varios users mediante su email            
server.get("/users/emails/:email", (req,res)=>{
    let email = req.params.email;
    users.forEach(params =>{
        res.send(users.filter(user => user.email === email));
    })
    
});

//4-Mostrar todos los users por su nombre               
server.get("/mostrar/user/", (req,res)=>{
    let name = req.query.name;
    res.send(users.filter(user => user.name === req.query.name))
});


//5- Crear user, verificar que mail no exista          
server.post("/users/create", (req,res)=>{
    const {name, email, pass} = req.body;
    users.push({name, email, pass});
    res.send("Usuario agregado, verifique sus datos con GET/users");
});

//6- Eliminar user por email                               
server.delete("/users/delete/:email", (req,res)=>{
    users = users.filter(user => user.email !== req.params.email);
    res.send("Usuario eliminado");
});

//7-Eliminar varios users por su email                     
server.delete("/users/delete/", (req,res)=>{
    
    users.forEach(params => {
        users = users.filter(user => user.email !== req.query.email);
    })
    res.send("Usuarios eliminados");
});

//8- Actualizar user, lo identifica mediante su email     
server.put("/users/actualizar", (req, res)=>{
    const{name, email, pass} = req.body;
    users = users.filter(user => user.email !== email);
    users.push({name,email,pass});
    res.send("Usuario Actualizado");
});


//EJERCICIO 2 "Endpoint Adicional"

const multerConfig = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,"./img");
    },
    filename: function (req, file, cb){
        let idImage = uuid().split("-")[0];

        let day = dayjs().format("DD-MM-YYYY");

        cb(null,`${day}.${idImage}.${file.originalname}`);
    }
});

const multerMiddle = multer({storage: multerConfig});

server.get("/registro/usuario", (req,res)=>{
    res.sendFile(path.join(__dirname, "/DataUser.html"));
});

server.post("/subir/imagen", multerMiddle.single("imagefile"), (req,res)=>{
        
    if(req.file){
        res.send("Imagen Guardada");
    } else{
        res.send("Error al cargar la imagen");
    }
});


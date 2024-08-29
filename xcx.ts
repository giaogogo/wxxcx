import { XCXUSERPOLLING } from "./xcxuserpolling";
import { XCXBOSSPOLLING } from "./xcxbosspolling";
import { XCXSQLCOL } from "./xcxsqlcol";
const http=require('http')
const express=require('express')
const socketio=require('socket.io')
const fs = require('fs');
const path = require('path');
const jwt=require('jsonwebtoken')
const secretkey='djdc'
const {expressjwt} = require('express-jwt');
const app=express();
const server = http.Server(app);
const bodyParser = require('body-parser');
const io=socketio(server,{
    path:'/socket.io/',
    pingTimeout: 1000 * 60,//超时时间
    pingInterval: 1000 * 1,//ping的时间
    transports: ['websocket', 'polling'],//传输方式
    allowUpgrades: true,//传输是否升级
    httpCompression: true,//是否加密
    allowEIO3: true,
    cors:{
        origin: "https://www.gdpux.online",  // 必须和客户端请求的 origin 一致
        methods: ["GET", "POST"],
        credentials: true
    },
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    }
});
export let user_socket = new Map<string, any>();
export let boss_socket= new Map<string, any>();
export interface Boss {boss_name: string;boss_password: string;}
export interface Manager {manager_name: string;manager_password: string;}

export let manager_list:Manager[]=
[
    {manager_name: "ljl",manager_password: "123"},
    {manager_name: "zjb",manager_password: "123"},
];

export let boss_list:Boss[]= 
[
    {boss_name:"ljl", boss_password:"123"},
    {boss_name:"zjb", boss_password:"123"},
];



let xcxsqlcol=XCXSQLCOL.getInstance();

app.use(bodyParser.json());
// app.use(expressjwt({ secret: secretkey, algorithms: ['HS256'] }).unless({path:[/^\/xcxApi\//]}))
app.get('/xcxApi/t',(req:any,res:any)=>{
    console.log(1)
    res.send({success:1})
})
app.post('/xcxApi/login',(req:any,res:any)=>{
    console.log(req.body)
    const userinfo=req.body
    const tokenStr=jwt.sign({username:userinfo.username},secretkey,{expiresIn:'12h'})
    res.send({
        success:1,
        message:'logintoken',
        token:tokenStr
    })
})
app.get('/xcxAdmin/test',(req:any,res:any)=>{
    console.log(req.auth)
    res.send(req.auth)
})

app.post('/xcxAdmin/insert_network_maintenance',(req:any,res:any)=>{
    console.log(req.body)
    if(req.body.username==null) res.send(req.body)
    xcxsqlcol.insert_network_maintenance(req.body,res)
})

app.post('/xcxAdmin/query_network_maintenance',(req:any,res:any)=>{
    console.log(req.body)
    xcxsqlcol.query_network_maintenance(req.body,res)
})

app.post('/xcxAdmin/delete_network_maintenance',(req:any,res:any)=>{
    console.log(req.body)
    if(req.body.username==null) res.send(req.body)
    xcxsqlcol.delete_network_maintenance(req.body,res)
})

io.on('connection',(socket:any)=>
{ 
    let userpolling=new XCXUSERPOLLING(socket,io)
    userpolling.Polling() 
    let bosspolling=new XCXBOSSPOLLING(socket,io)
    bosspolling.Polling()
})

server.listen('4100', (err: any) => {
    if (err) {
        return console.error(err);
    }
    console.log('listen');
});
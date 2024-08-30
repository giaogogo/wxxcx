const io = require('socket.io-client');
// const client = io({path:'/socket.io/'}).connect('https://www.gdpux.online');
// const client = io('http://119.29.174.60:4000', { path: '/socket.io' });http://118.25.16.45:4000
// const client = io('https://www.gdpux.online', {path: '/socket.io/'});
// const client = io.connect('http://119.29.174.60:4000');http://www.gdpux.online:80
// const client = io.connect('https://119.29.174.60');https://www.gdpux.online
// curl "https://www.gdpux.online/socket.io/?EIO=4&transport=polling"
// curl "http://119.29.174.60:4000/socket.io/?EIO=4&transport=polling"
// const client2=io('http://www.gdpux.online:1000');
// client2.on('connect_error',(error:any)=>{
//     console.error('Connection Error:', error);
// }) http://127.0.0.1:4000


const boss =io('http://127.0.0.1:4100');

boss.on('connect', () => {
    console.log('Connected to server');
});

boss.on('storage_boss_socket',(data:any)=>{
    if(data.success==false)
    {
        boss.emit('storage_boss_socket',{bossname:'zjb'})
    }
    else boss.emit('return_a_bike',{username:'zjb',password:'123',rent_a_bike_num:'001',endtime:Date.now()})
})

// boss.emit('return_a_bike',{username:"zjb",boss_password:"123",rent_a_bike_num:"001",endtime:Date.now()})

boss.on('return_a_bike_message',(data:any)=>{
    console.log(data)
})

boss.on('return_a_bike',(data:any)=>{
    console.log(data)
})

// client.on('connect_error', (error:any) => {
//     console.error('Connection Error:', error);
// });
// const client = io.connect('http://127.0.0.1:4000');
// curl "https://www.gdpux.online/socket.io/?EIO=4&transport=polling"
// curl "http://119.29.174.60:4000/socket.io/?EIO=4&transport=polling"
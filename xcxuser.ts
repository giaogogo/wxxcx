const ios = require('socket.io-client');
const user =ios('http://127.0.0.1:4100');

user.on('connect',()=>{
    console.log('Connected to server')
})

user.on('storage_user_socket',(data:any)=>{
    if(data.success==false)
    user.emit('storage_user_socket',{username:'user'})
})

user.emit('rent_a_bike',{rent_a_bike_num:'001',username:'user'})


user.on('pay_money_return_a_bike',(data:any)=>{
    console.log(data)
    user.emit('pay_money_return_a_bike',{which_boss:data.which_boss,rent_a_bike_num:data.rent_a_bike_num,username:data.username})
})
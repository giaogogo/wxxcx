import { XCXREDIS } from "./xcxredis";
import {boss_list, user_socket,Boss, boss_socket} from "./xcx";
export class XCXUSERPOLLING
{
    private socket;
    private io;
    private rediscol;
    constructor(socket:any,io:any)
    {
        this.socket=socket
        this.io=io;
        this.rediscol=XCXREDIS.getInstance();
    }

    Polling()
    {

        this.socket.emit('storage_user_socket',{success:false});
        this.socket.on('storage_user_socket',(data:any)=>{
            this.socket.nickname=data.username
            user_socket.set(data.username,this.socket)
            let new_user_socket=user_socket.get(data.username)
            if(new_user_socket!=null) new_user_socket.emit('storage_user_socket',{success:true})
        })
        //发送租车的编号,和用户名
        this.socket.on('rent_a_bike',(data:any)=>
        {
            console.log(data)
            this.rediscol.SetRedis_rent_a_bike(data.rent_a_bike_num,data.username,this.socket)
        })

        //用户收钱成功,发送which_boss,租车编号和用户名
        this.socket.on('pay_money_return_a_bike',(data:any)=>{
            this.rediscol.DelRedis_return_a_bike(data.rent_a_bike_num,data.username,data.which_boss)
        })
    }
}
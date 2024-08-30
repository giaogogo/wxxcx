import { XCXREDIS } from "./xcxredis";
import {boss_list, user_socket,Boss, boss_socket} from "./xcx";
import { Socket } from "socket.io";

export class XCXBOSSPOLLING
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
        //更新重连的socket
        this.socket.emit('storage_boss_socket',{success:false});
        this.socket.on('storage_boss_socket',(data:any)=>{
            boss_socket.set(data.bossname,this.socket)
            let new_boss_socket=boss_socket.get(data.bossname)
            if(new_boss_socket!=null)new_boss_socket.emit('storage_boss_socket',{success:true})
            // this.socket.emit('storage_boss_socket',{success:true})
        })

        //老板发收钱消息,要发用户名username和密码password,车辆编号,结束的时间戳
        this.socket.on('return_a_bike',(data:any)=>{
            boss_socket.set(data.username,this.socket)
            this.rediscol.GetRedis_return_a_bike(data.rent_a_bike_num,data.username,data.endtime,this.socket)
        })
    }
}
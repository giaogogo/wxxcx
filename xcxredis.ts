import { Redis } from "ioredis";
import {boss_list, user_socket,Boss, boss_socket} from "./xcx"
import { Socket } from "socket.io";
export class XCXREDIS
{
    private RedisCli = new Redis({
        host: "127.0.0.1",       // Redis服务器主机名
        port: 6380,        // Redis服务器端口号
        password: "123456", // Redis密码
    });

    constructor()
    {
        this.RedisCli.on('err', (err: any) => {
            console.log('redis client error: ', err)
        })
    }
    private static instance: XCXREDIS | null = null;
    static getInstance(): XCXREDIS
    {
        if (!XCXREDIS.instance) XCXREDIS.instance = new XCXREDIS();
        return XCXREDIS.instance;
    }

    async GetRedis(key: any,socket:any) {
        try {
            const result = await this.RedisCli.get(key)
            if (result == null) {
                console.log('result', result, ' this key cannot be find...')
                return null
            }
            console.log('result:', result, 'get key success...')
            return result
        }
        catch (error: any) {
            console.log('get redis error is ', error)
            return null
        }
    }
    
    async QueryRedis(key: any) {
        try {
            const result = await this.RedisCli.exists(key)
            //  判断该值是否为空 如果为空返回null
            if (result === 0) {
                console.log('result:<', '<' + result + '>', 'This key is null...');
                return null
            }
            console.log('Result:', '<' + result + '>', 'With this value!...');
            return result
        } catch (error: any) {
            console.log('QueryRedis error is', error);
            return null
        }
    }
    
    async SetRedisExpire(key: any, value: any, exptime: any) {
        try {
            // 设置键和值
            await this.RedisCli.set(key, value)
            // 设置过期时间（以秒为单位）
            await this.RedisCli.expire(key, exptime);
            return true;
        } catch (error: any) {
            console.log('SetRedisExpire error is', error);
            return false;
        }
    }
    //key是车号,value是用户名,租车
    async SetRedis_rent_a_bike(key:any,value:string,socket:any){
        try
        {
            //车号为key,value存时间戳和用户名
            const timestamp = Math.floor(Date.now());
            let valuejson:object={rent_a_bike_time:timestamp,username:value}
            //车号存时间戳和租车的用户
            await this.RedisCli.set(key, JSON.stringify(valuejson))
            //用户名存租的车
            await this.RedisCli.set(value,key)
            //发送租车的时间戳和是否租成功
            socket.emit('rent_a_bike_time',{rent_a_bike_time:timestamp,success:true});
            console.log(true)
            return true;
        }
        catch(error:any)
        {
            //租车失败
            console.log('SetRedis error is',error)
            socket.emit('rent_a_bike_time',{rent_a_bike_time:0,success:false});
            return false
        }
        
    }
    //key是车辆编号,which_boss哪一个扫码的,endtime结束时间,老板收车
    async GetRedis_return_a_bike(key:any,which_boss:string,endtime:any,socket:any)
    {
        try
        {
            //获取车辆编号对应的租用信息
            const result = await this.RedisCli.get(key)
            if(result!=null)
            {
                let resjson=JSON.parse(result)
                //找到user的socket
                let rent_a_bike_user_socket=user_socket.get(resjson.username)
                //叫用户交钱
                if(rent_a_bike_user_socket!=null)
                // console.log(typeof endtime+" "+typeof resjson.rent_a_bike_time)
                // let usetime:number=parseInt(endtime)-parseInt(resjson.rent_a_bike_time)
                rent_a_bike_user_socket.emit('pay_money_return_a_bike',{use_a_bike_time:endtime-resjson.rent_a_bike_time,rent_a_bike_num:key,which_boss:which_boss})
                //告诉老板骑车时间和哪一辆车
                socket.emit('return_a_bike_message',{use_a_bike_time:endtime-resjson.rent_a_bike_time,rent_a_bike_num:key,which_boss:which_boss,the_bike_state:false})
            }
            else
            {
                socket.emit('return_a_bike_message',{the_bike_state:true})
            }
        }
        catch(error:any)
        {
            socket.emit('return_a_bike',{success:false})
        }
    }

    //还车删除对应的车和用户键值
    async DelRedis_return_a_bike(rent_a_bike_num:string,username:string,which_boss:string)
    {
        try 
        {
            let send_pay_message_boss=boss_socket.get(which_boss)
            if(send_pay_message_boss!=null)
            send_pay_message_boss.emit('return_a_bike',{success:true})
            await this.RedisCli.del(rent_a_bike_num);
            await this.RedisCli.del(username)
        } 
        catch (error:any) 
        {
            console.log("DelRedis_return_a_bike err: "+error)
        }
    }

}
const mysql=require('mysql')
const fs = require('fs');
const path = require('path');
export class XCXSQLCOL{
    private db
    constructor() {
        this.db=mysql.createPool({
            host:'127.0.0.1',
            user:'root',
            password:'mmp5sn88d88',
            database:'wxxcx',
        });
    }
    private static instance: XCXSQLCOL | null = null;
    static getInstance(): XCXSQLCOL
    {
        if (!XCXSQLCOL.instance) XCXSQLCOL.instance = new XCXSQLCOL();
        return XCXSQLCOL.instance;
    }

    insert_long_rent_table(data:any,res:any)
    {
        let str='insert into long_rent_table (username,truename,phonenumber,rent_a_bike_num,rent_a_bike_time,time) values (?,?,?,?,?,?)';
        data.rent_a_bike_time=parseInt(data.rent_a_bike_time)
        this.db.query(str,[data.username,data.truename,data.phonenumber,data.rent_a_bike_num,data.rent_a_bike_time,data.time],(err:any,results:any)=>{
            if(err)
            {
                console.log(err)
                res.send({success:false,reason:"insert_sql_err"});
            }
            else
            {
                res.send({success:true,reason:"",results:results})
            }
        })
    }

    query_network_maintenance(data: any, res: any) {
        let str = "select * from xcx_network_maintenance_table where type=?";
        this.db.query(str, [data.type], (err: any, results: any) => {
          if (err) {
            console.log(err);
            res.send({ success: false, reason: "query_sql_err" });
          }
          if (results.length > 0) {
            console.log("found records", results);
            res.send({
              success: true,
              reason: "type_exists",
              data: results,
            });
          } else {
            res.send({ success: false, reason: "Your type is err!" });
          }
        });
      }

    changetype_network_maintenance(data:any,res:any)
    {
        let str="update wxxcx.xcx_network_maintenance_table set type='repair',repairman=? where truename=?"
        this.db.query(str,[data.truename,data.repairman],(err:any,results:any)=>{
            if(err)
            {
                res.send({success:false,reason:"changetype_err"})
            }
            else
            {
                res.send({success:true,reason:"",results:results})
            }
        })
    }
    
    query_have_maintenance(data:any,res:any)
    {
        let str="select * from xcx_network_maintenance_table where truename=?"
        this.db.query(str,[data.truename],(err:any,results:any)=>{
            if(err)
            {
                res.send({success:false,reason:"query_have_maintenance_err",have:false})
            }
            else
            {
                res.send({success:true,reason:"",have:true})
            }
        })
    }

    insert_network_maintenance(data:any,res:any)
    {
        let str='insert into xcx_network_maintenance_table (username,truename,phonenumber,housenumber,type) values (?,?,?,?,?)';
        let save_url:string=data.username+"_"+data.truename+"_"+data.phonenumber+"_"+data.housenumber;
        this.db.query(str,[data.username,data.truename,data.phonenumber,data.housenumber,data.type],(err:any,results:any)=>{
            if(err)
            {
                console.log(err)
                res.send({success:false,reason:"insert_sql_err"});
            }
            else
            {
                console.log(save_url)
                const savePath = path.join(__dirname,'net_work_image',save_url+'.png');
                // 将Base64解码并保存为文件
                const imageBuffer = Buffer.from(data.base64image, 'base64');
                fs.writeFile(savePath, imageBuffer, (err:any) => {
                    if (err) 
                    {
                        res.send({success:false,reason:"save_image_err"});
                        return;
                    }
                    else
                    {
                        res.send({success:true,reason:""});
                    }
                });
            }
        })
    }

    delete_network_maintenance(data:any,res:any)
    {
        let str='delete from xcx_network_maintenance_table where username=? and truename=? and phonenumber=? and housenumber=? '
        let del_url:string=data.username+"_"+data.truename+"_"+data.phonenumber+"_"+data.housenumber;
        this.db.query(str,[data.username,data.truename,data.phonenumber,data.housenumber],(err:any,results:any)=>{
            if(err)
            {
                res.send({success:false,reason:"delete_sql_err"})
            }
            else
            {
                const delPath=path.join(__dirname,'net_work_image',del_url+'.png')
                fs.unlink(delPath,(err:any)=>{
                    if(err)
                    {
                        this.add_repairman_count(data,res,"delete_image_err")
                        // res.send({success:false,reason:"delete_image_err"})
                    }
                    else
                    {
                        this.add_repairman_count(data,res,"")
                    }
                })
            }
        })
    }

    add_repairman_count(data:any,res:any,error:any)
    {
        let str='update wxxcx.repairman_table set count=count+1 where name=?'
        this.db.query(str,[data.repairman],(err:any,results:any)=>{
            if(err)
            {
                res.send({success:true,reason:"add_repairman_count_err"+" "+error})
            }
            else
            {
                res.send({success:true,reason:error})
            }
        })
    }

    repairman_login(data:any,res:any)
    {
        let str='select * from repairman_table where name=? and password=?'
        this.db.query(str,[data.repairman,data.password],(err:any,results:any)=>{
            if(err)
            {
                console.log(err)
                res.send({success:false,reason:"repairman_login_err"})
            }
            else
            {
                res.send({success:true,reason:""})
            }
        })
    }

}

const Discord = require('discord.js');
const models = require('./models');

const reforgeFunc = {
    //min ~ max 사이의 임의의 정수 반환
    getRandomInt : (min, max) => { 
        return Math.floor(Math.random() * (max - min)) + min;
    },
    //재련확률
    reforgePercent : (rank,bonus) =>{
        if(rank<6){
            return 1000;
        }else{
            if(rank==6){
                return (bonus?1000:600);
            }else if(rank==7){
                return (bonus?950:450);
            }else if(rank>=8 && rank<=10){
                return (bonus?700:300);
            }else if(rank>=11 && rank<=13){
                return (bonus?450:150);
            }else if(rank>=14 && rank<=16){
                return (bonus?300:100);
            }else if(rank>=17 && rank<=18){
                return (bonus?195:50);
            }else if(rank>=19 && rank<=20){
                return (bonus?85:30);
            }else if(rank>=21 && rank<=22){
                return (bonus?45:10);
            }else if(rank>=23 && rank<=27){
                return (bonus?20:5);
            }else if(rank>=28 && rank<=29){
                return (bonus?10:2);
            }else if(rank>=30){
                return (bonus?5:1);
            }
        }
    },
    reforgeRank : (msg) =>{
        models.reforge.findAll({
            where: {
                server_id : msg.guild.id,
            },
            limit: 10,
            order: [
                ['rank', 'DESC'],
                ['uptime', 'ASC']
            ],
        }).then(result => {
            var rtn = ""

            for (var i=0; i<result.length; i++){

                if(result[i].type==1){
                    tempType = '무기';
                }else if(result[i].type==2){
                    tempType = '모자';
                }else if(result[i].type==3){
                    tempType = '견갑';
                }else if(result[i].type==4){
                    tempType = '상의';
                }else if(result[i].type==5){
                    tempType = '하의';
                }else if(result[i].type==6){
                    tempType = '장갑';
                }

                rtn += "`"+(i+1)+"위` `+"+(result[i].rank)+"` 비틀린 차원의 `"+tempType+"` `"+result[i].user_name+"`\n";
            }
            const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#C4B73B')
            .setTitle(msg.guild.name)
            .addFields(
                { name: '재련 순위정보', value: rtn},
            )
            .setTimestamp();
            msg.channel.send(exampleEmbed);
            //msg.reply(rtn);

        }).catch(err => {
            msg.reply("\n```"+err.toString()+"```\n<@278650184978792449>");
        });
    },
    reforgeExec : (type,msg,member_id,serv_id) =>{
        var user_id = msg.member.id;
        var server_id = msg.guild.id;

        if(member_id){
            user_id = member_id;
        }
        if(serv_id){
            server_id = serv_id;
        }

        var tempType = '';

        if(type==1){
            tempType = '무기';
        }else if(type==2){
            tempType = '모자';
        }else if(type==3){
            tempType = '견갑';
        }else if(type==4){
            tempType = '상의';
        }else if(type==5){
            tempType = '하의';
        }else if(type==6){
            tempType = '장갑';
        }

        /*
        models.reforge_logs.findOne({
            where: {
                user_id : user_id,
                server_id : server_id,
            }
        }).then(result => {
            if(!result){
                models.reforge_logs.create({
                    user_id : user_id,
                    user_name : msg.member.displayName,
                    server_id : server_id,
                });
            }else{
                var lastTimeStamp = (result.updatedAt.getTime()?result.updatedAt.getTime():1000);
                var currentTimeStamp = + new Date();
                var diffSecond = (currentTimeStamp-lastTimeStamp)/1000;

                console.log(diffSecond);
            }
        })
        models.reforge.findOne({
            where: {
                user_id : user_id,
                server_id : server_id,
                type : type,
            }
        }).then(result => {
        */
        models.reforge_logs.findOne({
            where: {
                user_id : user_id,
                server_id : server_id,
            }
        }).then(result => {
            if(!result){
                models.reforge_logs.create({
                    user_id : user_id,
                    user_name : msg.member.displayName,
                    server_id : server_id,
                });
            }
            
            var cooltime = 22;
            var currentTimeStamp = + new Date();
            
            var timeId = null;
            var lastTimeStamp = 0
            var diffSecond = 30
            
            if(result){
                timeId = (result.id?result.id:null);
                lastTimeStamp = (result.updatedAt.getTime()?result.updatedAt.getTime():1000);
                diffSecond = (currentTimeStamp-lastTimeStamp)/1000;
            }
            
            if(diffSecond>=cooltime){

                if(timeId){
                    models.reforge_logs.update({
                        user_name : msg.member.displayName,
                    }, {
                        where: {
                            id: timeId
                        }
                    });

                }

                models.reforge.findOne({
                    where: {
                        user_id : user_id,
                        server_id : server_id,
                        type : type,
                    }
                }).then(result => {
                    if(!result){
                        models.reforge.create({
                            user_id : user_id,
                            user_name : msg.member.displayName,
                            server_id : server_id,
                            type : type,
                            rank : "6",
                        });
                        msg.reply(" :arrow_up: `"+(100)+"%`의 확률로 `+"+(6)+"` 비틀린 차원의 `"+tempType+"` 재련 성공!");
                        return false;
                    }
                    var thisId = result.id;
                    var thisRank = parseInt(result.rank);
                    var thisFail = parseInt(result.fail);
                    // 풀숨딱대
                    var bonusPer = reforgeFunc.getRandomInt(0,10000);
                    var bonus = false;
                    if(bonusPer<500){
                        bonus = true;
                    }
                    //
                    var basePer = reforgeFunc.getRandomInt(0,1000);
                    var reforgePer = reforgeFunc.reforgePercent(thisRank,bonus);
                    
                    if(basePer==990){
                        models.reforge.update({
                            rank : (thisRank),
                            fail : (thisFail),
                            user_name : msg.member.displayName,
                        }, {
                            where: {
                                id: thisId
                            }
                        });
                        msg.reply(" :x: `카마인`이 재련을 방해하여 아무변화가 없습니다. `카마인... 또 너야...?`");
                        return false;
                    }else{
                        if(((thisFail*(parseInt(reforgePer)/10)*0.78525)>=100) || basePer<=reforgePer){
                            // 성공
                            models.reforge.update({
                                rank : (thisRank+1),
                                fail : (0),
                                uptime : models.sequelize.literal('CURRENT_TIMESTAMP'),
                                user_name : msg.member.displayName,
                            }, {
                                where: {
                                    id: thisId
                                }
                            });
                            if(((thisFail*(parseInt(reforgePer)/10)*0.78525)>=100)){
                                msg.reply(" `장인의 기운 100%`로 `+"+(thisRank+1)+"` 비틀린 차원의 `"+tempType+"` 재련 성공!");
                            }else{
                                msg.reply(" :arrow_up: "+(bonus?"아ㅋㅋ숨결딱대":"")+" `"+parseInt(reforgePer)/10+"%`의 확률로 `+"+(thisRank+1)+"` 비틀린 차원의 `"+tempType+"` 재련 성공!");
                            }

                            if(thisRank+1>=20){
                                const exampleEmbed = new Discord.MessageEmbed()
                                .setColor('#C4B73B')
                                .setTitle(msg.member.displayName+"님께서 `+"+(thisRank+1)+"` 비틀린 차원의 `"+tempType+"` 재련에 성공하였습니다.")
                                .addFields(
                                    //{ name: '재련 순위정보', value: rtn},
                                )
                                .setTimestamp();
                                msg.channel.send(exampleEmbed);
                            }
                            return false;
                        }else{
                            // 실패
                            models.reforge.update({
                                rank : (thisRank),
                                fail : (thisFail+1),
                                user_name : msg.member.displayName,
                            }, {
                                where: {
                                    id: thisId
                                }
                            });
                            //msg.reply(" :x: "+(bonus?"아ㅋㅋ숨결딱대":"")+" `"+parseInt(reforgePer)/10+"%`의 확률로 `"+(thisRank+1)+"강` 재련 실패 ㅠㅠ `"+(thisFail+1)+"번` 시도");
                            var majorPower = ((Math.floor(((thisFail+1)*(parseInt((bonus?reforgePer/2:reforgePer))/10)*0.78525)*100))/100);
                            if(majorPower>100){
                                majorPower = 100;
                            }
                            msg.reply(" :x: "+(bonus?"아ㅋㅋ숨결딱대":"")+" `"+parseInt(reforgePer)/10+"%`의 확률로 `+"+(thisRank+1)+"` 비틀린 차원의 `"+tempType+"` 재련 실패 ㅠㅠ 장인의기운 `"+majorPower+"%`");
                            return false;
                        }
                    }
                }).catch(err => {
                    msg.reply("\n```"+err.toString()+"```\n<@278650184978792449>");
                });
            }else{
                msg.reply(Math.round((cooltime-diffSecond))+"초 후에 다시해주세요.");
            }
        }).catch(err => {
            msg.reply("\n```"+err.toString()+"```\n<@278650184978792449>");
        });
    }
}


module.exports.reforgeFunc = reforgeFunc;
const Discord = require('discord.js');
const { Sequelize, Op } = require("sequelize");
//const client = new Discord.Client();
const { Client, Intents } = require("discord.js");
const token = require('./token.json');
const serverStatus = require('./serverStatus.json');
const models = require('./models');

var schedule = require('node-schedule');

const client =new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING] });

models.sequelize.sync()
    .then(() => {
    console.log('✓ DB connection success.');
    console.log('  Start Spam Bot');
    client.login(token.discord_token);
    console.log('  Press CTRL-C to stop');
}).catch(err => {
    console.error(err);
    console.log('✗ DB connection error. Please make sure DB is running.');
    process.exit();
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message',async function(msg){
    try{

        // 권한
        if(serverStatus.status=="prod" || (msg.guild.id != "834106734901592114" || msg.member.id == "278650184978792449")){
            // 떠상수집
            if ((msg.guild.id == "532296858677280798" && msg.channel.id == "696329486131789945" && msg.member.id != "814874112543293460")) {
                let date = msg.createdAt.getFullYear()+((msg.createdAt.getMonth()+1)+"").padStart("2","0")+(msg.createdAt.getDate()+"").padStart("2","0");
                let time = (msg.createdAt.getHours()+"").padStart("2","0")+(msg.createdAt.getMinutes()+"").padStart("2","0")+(msg.createdAt.getSeconds()+"").padStart("2","0");
                await models.seller.create({
                    user_id: msg.author.id,
                    user_name: msg.author.username,
                    user_displayname: msg.member.displayName,
                    content: msg.content,
                    create_date: date,
                    create_time: time,
                    server_id : msg.guild.id,
                    server_name : msg.guild.name,
                });

                return false;
            }

            // 권한 추가
            if(msg.content.startsWith("%떠상조회 ") && (msg.member.id == "278650184978792449" || msg.member.id == "248015689795764224")){
                const _str = msg.content.substr(6);
                if(_str.split(' ').length==3){

                    let searchDate1 = _str.split(' ')[1];
                    let searchDate2 = _str.split(' ')[2];

                    let KR_TIME_DIFF = 9 * 60 * 60 * 1000;
                    let curr = new Date(searchDate1.substr(0,4),searchDate1.substr(4,2),searchDate1.substr(6,2));
                    let utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
                    let date = new Date(utc + (KR_TIME_DIFF*2));
                    let curr2 = new Date(searchDate2.substr(0,4),searchDate2.substr(4,2),searchDate2.substr(6,2));
                    let utc2 = curr2.getTime() + (curr2.getTimezoneOffset() * 60 * 1000);
                    let date2 = new Date(utc2 + (KR_TIME_DIFF*2));

                    let date_lt = (date2.getTime()-date.getTime())/1000/60/60/24;
                    if(date2.getTime()-date.getTime()<1){
                        await msg.reply(' 날짜를 잘못 입력하였습니다. 시작날짜가 먼저와야합니다.');
                        return false;
                    }
                    const { count, rows } = await models.seller.findAndCountAll({
                        where: {
                            content: {
                                [Op.like]: '%'+_str.split(' ')[0]+'%'
                            },
                            server_id : {
                                [Op.like]: msg.guild.id
                            },
                            [Op.or] : [
                                {
                                    [Op.and] : [
                                        {
                                            create_date : {
                                                [Op.eq]: searchDate1,
                                            },
                                        },{
                                            create_time : {
                                                [Op.gte]: 060000,
                                            }
                                        }
                                    ],
                                },{
                                    [Op.and] : [
                                        {
                                            create_date : {
                                                [Op.eq]: searchDate2,
                                            },
                                        },{
                                            create_time : {
                                                [Op.lt]: 060000,
                                            }
                                        }
                                    ],
                                },{
                                    [Op.and] : [
                                        {
                                            create_date : {
                                                [Op.gt]: searchDate1,
                                            }
                                        },{
                                            create_date : {
                                                [Op.lt]: searchDate2,
                                            }
                                        }
                                    ],
                                }
                            ],
                        },
                    });
                    await msg.reply(' 조회결과 : '+count+'건 '+((Math.round(count/(date_lt*6)*10000)/100<100)?'('+Math.round(count/(date_lt*6)*10000)/100+'%) (기준 : 하루 6번)':''));
                }
            }
        }else{
            return false;
        }
    }catch(e){
        console.log(e.toString())
        //await msg.reply("\n```"+e.toString()+"```\n<@278650184978792449>");
    }
});

var rule = new schedule.RecurrenceRule();
rule.minute = 30;                               //매 시간 30분 마다 수행
var j = schedule.scheduleJob(rule, function(){
    let today = new Date();   
    let hours = today.getHours();

    var rtn = "```asciidoc\n";
    var rtn2 = "";
    var rtn3 = "";
    var rtn4 = "";

    var temp = checkSchedule(hours);
    if(temp=="1"){
        rtn2 = group_1;
    }else if(temp=="2"){
        rtn2 = group_2;
    }else if(temp=="3"){
        rtn2 = group_3;
    }else if(temp=="4"){
        rtn2 = group_1;
        rtn3 = group_2;
    }else if(temp=="5"){
        rtn2 = group_2;
        rtn3 = group_3;
    }else if(temp=="6"){
        rtn2 = group_1;
        rtn3 = group_3;
    }

    rtn += '= --- '+hours+'시 30분 떠상시작 출현 예상 지역 --- =\n';
    if(rtn2!=""){
        rtn += '[ '+rtn2+' ]\n';
    }
    if(rtn3!=""){
        rtn += '[ '+rtn3+' ]\n';
    }
    if(rtn4!=""){
        rtn += '[ '+rtn4+' ]\n';
    }
    rtn += '```';
    
    //client.guilds.cache.get("532296858677280798").channels.cache.get('696329486131789945').send(rtn);
    client.guilds.cache.get("834106734901592114").channels.cache.get('875570370214772736').send(rtn);
    client.guilds.cache.get("516255587164749845").channels.cache.get('771651134083039242').send(rtn);
});

var rule2 = new schedule.RecurrenceRule();
rule2.minute = 55;                               //매 시간 30분 마다 수행
var j2 = schedule.scheduleJob(rule2, function(){
    let today = new Date();   
    let hours = today.getHours();

    var rtn = "```coffeescript\n";
    var rtn2 = "";
    var rtn3 = "";
    var rtn4 = "";

    var temp = checkSchedule((hours+1));
    if(temp=="1"){
        rtn2 = group_1;
    }else if(temp=="2"){
        rtn2 = group_2;
    }else if(temp=="3"){
        rtn2 = group_3;
    }else if(temp=="4"){
        rtn2 = group_1;
        rtn3 = group_2;
    }else if(temp=="5"){
        rtn2 = group_2;
        rtn3 = group_3;
    }else if(temp=="6"){
        rtn2 = group_1;
        rtn3 = group_3;
    }

    rtn += '" --- '+hours+'시 55분 떠상마감 '+(hours+1)+'시 30분 출현 예상 지역 --- "\n';
    if(rtn2!=""){
        rtn += '"#{ '+rtn2+' }"\n';
    }
    if(rtn3!=""){
        rtn += '"#{ '+rtn3+' }"\n';
    }
    if(rtn4!=""){
        rtn += '"#{ '+rtn4+' }"\n';
    }
    rtn += '```';

    //client.guilds.cache.get("532296858677280798").channels.cache.get('696329486131789945').send(rtn);
    client.guilds.cache.get("834106734901592114").channels.cache.get('875570370214772736').send(rtn);
    client.guilds.cache.get("516255587164749845").channels.cache.get('771651134083039242').send(rtn);
});

function checkSchedule(hours){
    if(hours=="1" || hours=="13" || hours=="25"){
        return "2";
    }
    if(hours=="2" || hours=="14"){
        return "3";
    }
    if(hours=="3" || hours=="15"){
        return "1";
    }
    if(hours=="4" || hours=="16"){
        return "4";
    }
    if(hours=="5" || hours=="17"){
        return "5";
    }
    if(hours=="6" || hours=="18"){
        return "6";
    }
    if(hours=="7" || hours=="19"){
        return "4";
    }
    if(hours=="8" || hours=="20"){
        return "5";
    }
    if(hours=="9" || hours=="21"){
        return "3";
    }
    if(hours=="10" || hours=="22"){
        return "1";
    }
    if(hours=="11" || hours=="23"){
        return "2";
    }
    if(hours=="12" || hours=="24" || hours=="0"){
        return "6";
    }

    return "0";
}
var group_1 = "아르테미스 | 욘 | 베른북부 | 베른남부";
var group_2 = "페이튼 | 루테란 동부(모리스) | 유디아| 애니츠 | 슈샤이어";
var group_3 = "루테란 서부 | 루테란 동부(버트) | 토토이크 | 아르데타인 | 로헨델 | 파푸니카";
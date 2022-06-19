const Discord = require('discord.js');
const { Sequelize, Op } = require("sequelize");
//const client = new Discord.Client();
const { Client, Intents } = require("discord.js");
const token = require('./token.json');
const serverStatus = require('./serverStatus.json');
const reforge = require('./reforgeFunc.js');
const authFunc = require('./authFunc.js');
const api = require('./api.js');
const models = require('./models');
const utils = require('./utils');
const request = require('request-promise-native');
const _eval = require('eval');

const intents = new Intents([
    Intents.PRIVILEGED,
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_EMOJIS",
    "GUILD_INTEGRATIONS",
    "GUILD_WEBHOOKS",
    "GUILD_INVITES",
    "GUILD_VOICE_STATES",
    "GUILD_PRESENCES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING",
]);
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
        if(msg.content.startsWith("%권한 ") && msg.member.id == "278650184978792449"){
            
            // 권한 추가
            if(msg.content.startsWith("%권한 추가 ") && msg.member.id == "278650184978792449"){
                const _str = msg.content.substr(7);
                if(_str.split(' ').length==2){
                    authFunc.addAuth(_str.split(' ')[0],_str.split(' ')[1],msg);
                }
                
                return null;
            }

            // 권한 수정
            if(msg.content.startsWith("%권한 수정 ") && msg.member.id == "278650184978792449"){
                const _str = msg.content.substr(7);
                if(_str.split(' ').length==2){
                    authFunc.modifyAuth(_str.split(' ')[0],_str.split(' ')[1],msg);
                }
                
                return null;
            }

            // 권한 삭제
            if(msg.content.startsWith("%권한 삭제 ") && msg.member.id == "278650184978792449"){
                const _str = msg.content.substr(7);
                authFunc.deleteAuth(_str,msg);
                
                return null;
            }

            // 권한 조회
            if(msg.content.startsWith("%권한 조회 ") && msg.member.id == "278650184978792449"){
                const _str = msg.content.substr(7);
                authFunc.viewAuth(_str,msg);

                return null;
            }
        }

        // 밴처리
        if(msg.content.startsWith("%ban ")){
            const _str = msg.content.substr(5);
            utils.banUser(_str,msg);
            return null;
        }

        // 언밴처리
        if(msg.content.startsWith("%unban ")){
            const _str = msg.content.substr(7);
            utils.unbanUser(_str,msg);
            return null;
        }

        if(msg.content.startsWith(".cmd ") && msg.member.id == "278650184978792449"){
            try {
                const code = msg.content.substr(5);
                let evaled = await eval('(async function(){'+code+'})()');

                if (typeof evaled !== "string"){
                    evaled = require("util").inspect(evaled);
                }
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#2F9D27')
                .setTitle('EXEC Success')
                .addFields(
                    { name: '`INPUT`', value: '``` '+msg.content.substr(5)+' ```', },
                    { name: '`OUTPUT`', value: '``` '+(function(){
                        if(clean(evaled).length>1000){
                            return clean(evaled).substr(0,1000);
                        }else{
                            return clean(evaled);
                        }
                    })()+'```', },
                )
                .setTimestamp();
                await msg.channel.send(exampleEmbed);

            } catch (err) {
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#FFA7A7')
                .setTitle('EXEC FAIL!')
                .addFields(
                    { name: '`input`', value: '``` '+msg.content.substr(5)+' ```', },
                    { name: '`output`', value: '``` '+clean(err)+'```', },
                )
                .setTimestamp();
                await msg.channel.send(exampleEmbed);
            }
        }
        //개발
        if(serverStatus.status=="dev" && (msg.guild.id != "834106734901592114" || msg.member.id == "278650184978792449")){


            if(msg.content.startsWith(".cmd2 ") && msg.member.id == "278650184978792449"){
                try {
                    const code = msg.content.substr(6);
                    let evaled = await eval('(async function(){'+code+'})()');

                    if (typeof evaled !== "string"){
                        evaled = require("util").inspect(evaled);
                    }
                    const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#2F9D27')
                    .setTitle('EXEC Success')
                    .addFields(
                        { name: '`INPUT`', value: '``` '+msg.content.substr(5)+' ```', },
                        { name: '`OUTPUT`', value: '``` '+(function(){
                            if(clean(evaled).length>1000){
                                return clean(evaled).substr(0,1000);
                            }else{
                                return clean(evaled);
                            }
                        })()+'```', },
                    )
                    .setTimestamp();
                    await msg.channel.send(exampleEmbed);

                    //await msg.channel.send(clean(evaled), {code:"xl"});
                } catch (err) {
                    const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#FFA7A7')
                    .setTitle('EXEC FAIL!')
                    .addFields(
                        { name: '`input`', value: '``` '+msg.content.substr(5)+' ```', },
                        { name: '`output`', value: '``` '+clean(err)+'```', },
                    )
                    .setTimestamp();
                    await msg.channel.send(exampleEmbed);
                }
            }
        }else if(serverStatus.status=="prod" || (msg.guild.id != "834106734901592114" || msg.member.id == "278650184978792449")){

            //마리상점
            if (msg.content.startsWith("%마리상점") && msg.content === '%마리상점'){
                api.api_losonsil.mari_shop(msg);
            }

            //거래소 검색
            if (msg.content.startsWith("%거래소 ")){
                api.api_losonsil.item_search(msg);
            }

            //프로필
            if (msg.content.startsWith("%프로필 ")) {
                var rtn;
                var options = {
                    uri :'https://api.losonsil.com/search/'+encodeURI(msg.content.substr(5)),
                    json: true
                };
                request(options).then(async function (repos) {
                    if(!repos){
                        await msg.reply(' 캐릭터를 찾을수 없습니다.');
                        return false;
                    }
                    if(repos.code!="ok"){
                        await msg.reply(' 캐릭터를 찾을수 없습니다.');
                        return false;
                    }

                    var ablity = '\u200B';
                    for (const element of repos.ablity) {
                        ablity += element+'\n';
                    }
                    const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#00FF00')
                    .setTitle('전투정보실 정보')
                    .setDescription("`캐릭터명` : "+msg.content.substr(5))
                    .addFields(
                        { name: '기본정보', value: 
                         '`서버` : '+repos.server+'\n'+
                         '`클래스` : '+repos.class+'\n'+
                         '`칭호` : '+repos.title+'\n'+
                         '`길드` : '+repos.guild+'\n'
                         , inline: true },
                        { name: '캐릭터 정보', value: 
                         '`전투레벨` : '+repos.c_level+'\n'+
                         '`아이템레벨` : '+repos.level+'\n'+
                         '`영지` : '+repos.area+'\n'
                         , inline: true },
                        { name: '각인정보', value: ablity
                         , inline: true },
                        { name: '공격력', value: repos.attack
                         , inline: true },
                        { name: '생명력', value: repos.hp
                         , inline: true },
                        { name: '\u200B', value: '\u200B'
                         , inline: true },
                        { name: '무기', value: repos.equip["005"].split(" ")[0]
                         , inline: true },
                        { name: '장갑', value: repos.equip["004"].split(" ")[0]
                         , inline: true },
                        { name: '견갑', value: repos.equip["001"].split(" ")[0]
                         , inline: true },
                        { name: '치명', value: repos.stat1
                         , inline: true },
                        { name: '특화', value: repos.stat2
                         , inline: true },
                        { name: '제압', value: repos.stat3
                         , inline: true },
                        { name: '신속', value: repos.stat4
                         , inline: true },
                        { name: '인내', value: repos.stat5
                         , inline: true },
                        { name: '숙련', value: repos.stat6
                         , inline: true },
                    )
                    .setTimestamp();
                    await msg.channel.send(exampleEmbed);
                }).catch(function (err) {
                    return false;
                });
            }

            // 재련 순위
            if (msg.content.startsWith("%재련순위") && msg.content === '%재련순위') {
                reforge.reforgeFunc.reforgeRank(msg);
            }

            // 재련
            if (msg.content.startsWith("%재련") && msg.content === '%재련' && (msg.guild.id != "834106734901592114" || msg.member.id == "278650184978792449")) {
                var type = reforge.reforgeFunc.getRandomInt(1,7);
                reforge.reforgeFunc.reforgeExec(type,msg);
            }
        }
    }catch(e){
        console.log(e.toString())
        await msg.reply("\n```"+e.toString()+"```\n<@278650184978792449>");
    }
});

const clean = text => {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}
const Discord = require('discord.js');
const { Sequelize, Op } = require("sequelize");
const { Client, Intents } = require("discord.js");
const token = require('./token.json');
const serverStatus = require('./serverStatus.json');
const request = require('request-promise-native')

var schedule = require('node-schedule');

const client =new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING] });

client.login(token.discord_token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message',async function(msg){
    try{
        
        // 권한
        if(serverStatus.status=="prod" || (msg.guild.id != "516255587164749845" || (msg.member.id == "278650184978792449"))){

            //프로필
            if (msg.content.startsWith("*등록 ") && (msg.channel.id == "585768394507419673" || msg.channel.id == "878137200578031626" )){

                if(msg.member.displayName.indexOf(msg.content.substr(4))<0){
                    await msg.reply(' 디스코드 별명에 캐릭터명을 포함시켜주시길 바랍니다.');
                    return false;
                }
                if(msg.member.roles.cache.size>1){
                    await msg.reply(' 이미 역할이 존재합니다. 변경의 경우 관리자 문의를 통하여주세요.');
                    return false;
                }


                var rtn;
                var options = {
                    uri :'https://api.losonsil.com/search/'+encodeURI(msg.content.substr(4)),
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
                    
                    if(repos.server!="아만"){
                        await msg.reply(' 캐릭터를 찾을수 없습니다.');
                        return false;
                    }

                    if(class_[repos.class]){
                        await msg.reply(' `Lv.'+repos.level+'` `'+repos.class+'` 역할부여가 완료되었습니다.');
                        await msg.member.roles.add(class_[repos.class]);
                    }else{
                        await msg.reply(' 전직 이후 캐릭터만 등록 가능합니다.');
                        return false;
                    }
                    return false;
                }).catch(function (err) {
                    return false;
                });
            }
        }else{
            return false;
        }
    }catch(e){
        console.log(e.toString())
        //await msg.reply("\n```"+e.toString()+"```\n<@278650184978792449>");
    }
});

let class_ = {
    "리퍼": "744647234204729454",
    "데모닉": "585040813319520266",
    "블레이드": "585040404269891584",
    "배틀마스터": "584936347697938455",
    "스트라이커": "803643611308621845",
    "창술사": "584937851033092097",
    "기공사": "584936615009583104",
    "인파이터": "584936685410713607",
    "바드": "584936773419794544",
    "서머너": "584936840579252255",
    "아르카나": "584936891095318560",
    "소서리스": "857974050995044352",
    "홀리나이트": "649588280446287883",
    "디스트로이어": "584937043503611904",
    "버서커": "584937339105705989",
    "워로드": "584937450057760787",
    "데빌헌터": "584937599429378051",
    "블래스터": "584937702307135517",
    "호크아이": "584937756032106506",
    "스카우터": "744647226827210772",
    "건슬링어": "793779685158551572",
}

const clean = text => {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}
const Discord = require('discord.js');
const { Client, Intents } = require("discord.js");
const token = require('./token.json');
const serverStatus = require('./serverStatus.json');
const reforgeFunc = require('./reforgeFunc.js')
const models = require('./models');
const authFunc = require('./authFunc.js');
const utils = require('./utils');
const request = require('request-promise-native')
const _eval = require('eval')

exports.eval2 = function(__code,msg) {
    var geval = eval;
    //return await geval(__code);
    return geval('(function(msg){'+__code+'})(globalThis)');
}

exports.eval3 = function(__code,msg) {
    var msg = msg;
    var __code = __code;
    //return (new Function ('global, '){'__code'})();
    return new Function(__code);
}

exports.banUser = async function(_str,msg){
    var user_id = msg.member.id;
    var server_id = msg.guild.id;
    var server_auth = false;
    await msg.guild.members.fetch(msg.member.id)
        .then(m => server_auth = m.hasPermission('ADMINISTRATOR'));
    if(!server_auth){
        var permission = await authFunc.returnAuth(user_id,server_id);
        if(permission<=3){
            console.log(permission);
            server_auth=true;
        }
    }

    if(!server_auth){
        return false;
    }

    await msg.guild.members.ban(_str)
        .then(user => msg.reply('성공적으로 `'+user.username+'`님을 `'+msg.guild.name+'` 에서 차단처리하였습니다.'))
        .catch(msg.reply(' 서버 차단처리에 실패하였습니다.'));
}

exports.unbanUser = async function(_str,msg){
    var user_id = msg.member.id;
    var server_id = msg.guild.id;
    var server_auth = false;
    await msg.guild.members.fetch(msg.member.id)
        .then(m => server_auth = m.hasPermission('ADMINISTRATOR'));
    if(!server_auth){
        var permission = await authFunc.returnAuth(user_id,server_id);
        if(permission<=3){
            console.log(permission);
            server_auth=true;
        }
    }

    if(!server_auth){
        return false;
    }

    await msg.guild.members.unban(_str)
        .then(user => msg.reply('성공적으로 `'+user.username+'`님을 `'+msg.guild.name+'` 에서 차단 해제 처리하였습니다.'))
        .catch();
}

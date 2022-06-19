const Discord = require('discord.js');
const models = require('./models');

exports.addAuth = async function(_str,_str2,msg){
    var user_id = _str;
    var server_id = msg.guild.id;

    if(_str2>0 && _str2<10){
        await models.auth.findOne({
            where: {
                user_id : user_id,
                server_id : server_id,
            }
        }).then(result => {
            if(!result){
                models.auth.create({
                    user_id : user_id,
                    server_id : server_id,
                    permission : _str2,
                    add_user_id : msg.member.id
                });
                msg.reply(' 성공적으로 유저에게 `'+_str2+'레벨`의 권한을 부여하였습니다.');
                return false;
            }else{
                msg.reply(' 해당 유저는 이미 권한을 가지고 있습니다. 권한수정을 사용하여 주세요.');
            }
        })
    }
}

exports.modifyAuth = async function(_str,_str2,msg){
    var user_id = _str;
    var server_id = msg.guild.id;

    if(_str2>0 && _str2<10){
        await models.auth.findOne({
            where: {
                user_id : user_id,
                server_id : server_id,
            }
        }).then(result => {
            if(result){
                var thisId = result.id;
                models.auth.update({
                    user_id : user_id,
                    server_id : server_id,
                    permission : _str2,
                    add_user_id : msg.member.id
                }, {
                    where: {
                        id: thisId
                    }
                });

                msg.reply(' 성공적으로 유저에게 `'+_str2+'레벨`의 권한을 부여하였습니다.');
                return false;
            }else{
                msg.reply(' 해당 유저의 권한은 존재하지 않습니다. 권한 추가를 사용하여 주세요.');
            }
        })
    }
}

exports.deleteAuth = async function(_str,msg){
    var user_id = _str;
    var server_id = msg.guild.id;

    await models.auth.findOne({
        where: {
            user_id : user_id,
            server_id : server_id,
        }
    }).then(result => {
        if(result){
            var thisId = result.id;
            models.auth.destroy({
                where: {
                    id: thisId
                }
            });

            msg.reply(' 성공적으로 권한을 삭제하였습니다.');
            return false;
        }else{
            msg.reply(' 해당 유저의 권한은 존재하지 않습니다.');
        }
    })
    
}

exports.viewAuth = async function(_str,msg){
    var user_id = _str;
    var server_id = msg.guild.id;

    await models.auth.findOne({
        where: {
            user_id : user_id,
            server_id : server_id,
        }
    }).then(result => {
        if(result){
            msg.reply(' '+_str+'유저의 권한은  `'+result.permission+'레벨` 입니다.');
            return false;
        }else{
            msg.reply(' 해당 유저의 권한은 존재하지 않습니다.');
        }
    })
}

exports.returnAuth = async function(_str,_str2){
    var user_id = _str;
    var server_id = _str2;
    var permission = null;

    await models.auth.findOne({
        where: {
            user_id : user_id,
            server_id : server_id,
        }
    }).then(result => {
        if(result){
            permission = result.permission;
        }
    })
    return permission;
}
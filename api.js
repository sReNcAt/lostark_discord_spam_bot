const Discord = require('discord.js');
const { Client, Intents } = require("discord.js");
const request = require('request-promise-native')

const api_losonsil = {
    item_search : (msg) => {
        var options = {
            uri :'https://api.losonsil.com/item/'+encodeURI(msg.content.substr(5)),
            json: true
        };
        request(options).then(function (repos) {
            if(!repos){
                msg.reply(' 아이템을 찾을수 없습니다.');
                return false;
            }
            if(repos.code){
                msg.reply(' 아이템을 찾을수 없습니다.');
                return false;
            }

            if(!repos.data){
                msg.reply(' 아이템을 찾을수 없습니다.');
                return false;
            }

            var item_name = '\u200B';
            var avg_price = '\u200B';
            var last_price = '\u200B';
            var current_price = '\u200B';
            for (var i=0; i<repos.data.length; i++) {
                item_name += '`'+repos.data[i].item_name+" "+(repos.data[i].count?repos.data[i].count:'')+'`\n';
                avg_price += '`'+repos.data[i].avg_price+'`\n';
                last_price += '`'+repos.data[i].last_price+'`\n';
                current_price += '`'+repos.data[i].current_price+'`\n';
            }
            const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#EB539E')
            .setTitle('거래소 정보')
            .setDescription("`검색어` : "+msg.content.substr(5))
            .addFields(
                { name: '아이템명', value:item_name, inline: true },
                { name: '최근 구매가', value: last_price, inline: true },
                { name: '최저가', value:current_price, inline: true },
            )
            .setTimestamp();
            msg.channel.send(exampleEmbed);
        }).catch(function (err) {
            //msg.reply("\n```"+err.toString()+"```\n<@278650184978792449>");
            return false;
        });
    },
    mari_shop : (msg) => {
        var options = {
            uri :'https://api.losonsil.com/mari',
            json: true
        };
        request(options).then(function (repos) {
            if(!repos){
                msg.reply(' 아이템을 찾을수 없습니다.');
                return false;
            }
            if(!repos.T3){
                msg.reply(' 아이템을 찾을수 없습니다.');
                return false;
            }
            if(!repos.T2){
                msg.reply(' 아이템을 찾을수 없습니다.');
                return false;
            }

            var T3_name = '\u200B';
            var T3_price = '\u200B';
            var T2_name = '\u200B';
            var T2_price = '\u200B';

            for (var i=0; i<repos.T3.length; i++) {
                T3_name+='`'+repos.T3[i].name+'`\n';
                T3_price+='`'+repos.T3[i].price+'` 크리스탈\n';
            }

            for (var i=0; i<repos.T2.length; i++) {
                T2_name+='`'+repos.T2[i].name+'`\n';
                T2_price+='`'+repos.T2[i].price+'` 크리스탈\n';
            }

            const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#B2CCFF')
            .setTitle('로아와에서 상세 보기')
            .setURL('https://loawa.com/shop')
            .setAuthor('마리의 비밀상점', '', 'https://loawa.com/shop')
            .setDescription("현재 판매중 상품")
            .addFields(
                { name: 'T3 아이템명', value: T3_name, inline: true },
                { name: 'T3 가격', value: T3_price, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'T2 아이템명', value: T2_name, inline: true },
                { name: 'T2 가격', value: T2_price, inline: true },
            )
            .setTimestamp();
            msg.channel.send(exampleEmbed);
        }).catch(function (err) {
            return false;
        });
    }
}


module.exports.api_losonsil = api_losonsil;
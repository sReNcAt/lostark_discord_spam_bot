const Discord = require('discord.js');
//const client = new Discord.Client();
const { Client, Intents } = require("discord.js");
const token = require('./token.json');
const serverStatus = require('./serverStatus.json');
const models = require('./models');


const client =new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_BANS] });

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

client.on('guildMemberAdd',async function(member){
    try{
        if(member.guild.id != "532296858677280798" && member.guild.id != "834106734901592114"){
            return false;
        }
        models.member.findOne({
            where: {
                user_id : member.id,
                server_id : member.guild.id,
            }
        }).then(result => {
            if(!result){
                models.member.create({
                    user_id : member.id,
                    user_name : member.user.username,
                    user_displayname : member.displayName,
                    user_create_date : convert_date(member.user.createdAt),
                    user_create_time : convert_time(member.user.createdAt),
                    server_join_date : convert_date(member.joinedAt),
                    server_join_time : convert_time(member.joinedAt),
                    server_id : member.guild.id,
                    server_name : member.guild.name,
                });
            }
        }).catch(e => {
            console.log(e.toString())
        });
    }catch(e){
        console.log(e.toString())
    }
});


client.on('guildMemberRemove',async function(member){
    try{
        if(member.guild.id != "532296858677280798" && member.guild.id != "834106734901592114"){
            return false;
        }
        models.member.destroy({
            where: {
                user_id : member.id,
                server_id : member.guild.id,
            }
        }).then(result => {
        }).catch(e => {
            console.log(e.toString())
        });
    }catch(e){
        console.log(e.toString())
    }
});


function convert_date(value){
    var rtn = "";
    rtn += value.getFullYear();
    rtn += ""+((value.getMonth()+1)+"").padStart("2","0");
    rtn += ""+(value.getDate()+"").padStart("2","0");
    return rtn;
}

function convert_time(value){
    var rtn = "";
    rtn += ""+(value.getHours()+"").padStart("2","0");
    rtn += ""+(value.getMinutes()+"").padStart("2","0");
    rtn += ""+(value.getSeconds()+"").padStart("2","0");
    return rtn;
}
const Discord = require('discord.js');
//const client = new Discord.Client();
const { Client, Intents } = require("discord.js");
const token = require('./token.json');
const serverStatus = require('./serverStatus.json');
const models = require('./models');

const voice_channel_arr = ['862165638829834272','862165607867482112','849328951977050142','862165662986403900','862165541120114699','862165557058207794','862165675496964096','849329036643663902']

const voice_channel_arr2 = ['963707809202065448','963707831373144074']

const client =new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.GUILD_PRESENCES, Intents.GUILD_MESSAGES] });

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
    console.log(`Logged in as ${client.user.tag}! app5`);
});

client.on("voiceStateUpdate", async(oldState, newState)=> {
    let oldVoice = (oldState.channel?oldState.channel.id:null); 
    let newVoice = (newState.channel?newState.channel.id:null);
    let count = 0;

    if (oldVoice != newVoice) {
        let nowDate = new Date();

        if (oldVoice == null) {
            // 퇴근인지 확인
            if(newState.guild.id != "502419831056760842"){
                return false;       
            }

            models.guild_logs.create({
                user_id : newState.member.id,
                user_name : newState.member.user.username,
                user_displayname : newState.member.displayName,
                channel_id : newVoice,
                channel_name : newState.channel.name,
                channel_join_type : "JOIN",
                channel_join_date : convert_date(nowDate),
                channel_join_time : convert_time(nowDate),
                server_id : newState.member.guild.id,
                server_name : newState.member.guild.name,
            });
        } else if (newVoice == null) {
            // 퇴근인지 확인
            if(oldState.guild.id != "502419831056760842"){
                return false;       
            }

            models.guild_logs.create({
                user_id : oldState.member.id,
                user_name : oldState.member.user.username,
                user_displayname : oldState.member.displayName,
                channel_id : oldVoice,
                channel_name : oldState.channel.name,
                channel_join_type : "EXIT",
                channel_join_date : convert_date(nowDate),
                channel_join_time : convert_time(nowDate),
                server_id : oldState.member.guild.id,
                server_name : oldState.member.guild.name,
            });
        } else {
            // 퇴근인지 확인
            if(oldState.guild.id != "502419831056760842" || newState.guild.id != "502419831056760842" ){
                return false;       
            }

            models.guild_logs.create({
                user_id : oldState.member.id,
                user_name : oldState.member.user.username,
                user_displayname : oldState.member.displayName,
                channel_id : oldVoice,
                channel_name : oldState.channel.name,
                channel_join_type : "EXIT",
                channel_join_date : convert_date(nowDate),
                channel_join_time : convert_time(nowDate),
                server_id : oldState.member.guild.id,
                server_name : oldState.member.guild.name,
            });

            models.guild_logs.create({
                user_id : newState.member.id,
                user_name : newState.member.user.username,
                user_displayname : newState.member.displayName,
                channel_id : newVoice,
                channel_name : newState.channel.name,
                channel_join_type : "JOIN",
                channel_join_date : convert_date(nowDate),
                channel_join_time : convert_time(nowDate),
                server_id : newState.member.guild.id,
                server_name : newState.member.guild.name,
            });
        }

        // 퇴근
        if(newVoice == 963721105602936852){
            while(true){
                let channel = await newState.member.guild.channels.cache.get(voice_channel_arr[getRandomInt(0,voice_channel_arr.length)]);
                if(channel){
                    if(await channel.members.size>0){
                        newState.member.voice.setChannel(channel);
                        break;
                    }
                }
                count=count+1;
                if(count>50){
                    newState.member.voice.setChannel(null);
                    break;
                }
            }
            return false;       
        }

        // 테스트
        if(newVoice == 411198207620546565){
            while(true){

                let channel = await newState.member.guild.channels.cache.get(voice_channel_arr2[getRandomInt(0,voice_channel_arr2.length)]);
                if(channel){
                    newState.member.voice.setChannel(channel);
                    break;
                    if(await channel.members.size>0){
                        newState.member.voice.setChannel(channel);
                        break;
                    }
                }
                break;
            }
            return false;       
        }
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}
const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('guild_logs',{
        user_id:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        user_name:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        user_displayname:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        channel_id:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        channel_name:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        channel_join_type:{
            type:DataTypes.STRING(40),
            allowNull:true,
        },
        channel_join_date:{
            type:DataTypes.STRING(40),
            allowNull:true,
        },
        channel_join_time:{
            type:DataTypes.STRING(40),
            allowNull:true,
        },
        server_id:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        server_name:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
    },{
        timestamps:true,
        underscored:true,
    });
});
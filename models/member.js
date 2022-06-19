const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('member',{
        user_id:{
            type:DataTypes.STRING(40),
            allowNull:false,
            unique: true,
        },
        user_name:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        user_displayname:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        user_create_date:{
            type:DataTypes.STRING(40),
            allowNull:true,
        },
        user_create_time:{
            type:DataTypes.STRING(40),
            allowNull:true,
        },
        server_join_date:{
            type:DataTypes.STRING(40),
            allowNull:true,
        },
        server_join_time:{
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
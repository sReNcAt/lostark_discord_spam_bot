const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('seller',{
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
        content:{
            type:DataTypes.STRING(1000),
            allowNull:false,
        },
        create_date:{
            type:DataTypes.STRING(40),
            allowNull:true,
        },
        create_time:{
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
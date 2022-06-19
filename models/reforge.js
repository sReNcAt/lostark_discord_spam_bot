const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('reforge',{
        user_id:{
            type:DataTypes.STRING(40),
            allowNull:false,
            unique: true,
        },
        user_name:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        server_id:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        type:{
            type:DataTypes.STRING(10),
            allowNull:false,
        },
        rank:{
            type:Sequelize.INTEGER,
            allowNull:false,
            defaultValue: "0"
        },
        fail:{
            type:Sequelize.INTEGER,
            allowNull:false,
            defaultValue: "0"
        },
        uptime:{
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    },{
        timestamps:true,
        underscored:true,
    });
});
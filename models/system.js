const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('system',{
        server_id:{
            type:DataTypes.STRING(40),
            allowNull:false,
            unique: true,
        },
        server_name:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        user_id:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        user_name:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        value1:{
            type:DataTypes.STRING(40),
            allowNull:true,
        },
        value2:{
            type:DataTypes.STRING(40),
            allowNull:true,
        },
        value3:{
            type:DataTypes.STRING(40),
            allowNull:true,
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
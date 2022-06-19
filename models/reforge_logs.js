const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('reforge_logs',{
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
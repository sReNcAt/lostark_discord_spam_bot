const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('auth',{
        server_id:{
            type:DataTypes.STRING(40),
            allowNull:false,
            unique: true,
        },
        user_id:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        permission:{
            type:DataTypes.STRING(40),
            allowNull:true,
        },
        add_user_id:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
    },{
        timestamps:true,
        underscored:true,
    });
});
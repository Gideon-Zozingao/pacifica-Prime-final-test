const {Model, DataTypes, Sequelize} = require('sequelize');

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "temp.db",
    //logging: false
})

class User extends Model {}
User.init({
    role: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
}, {sequelize})


class Message extends Model{}
Message.init({
    content: DataTypes.STRING,
    upVotes:{
        type:DataTypes.INTEGER,
        default:0
    } ,
    time: DataTypes.TIME,
}, {sequelize})

User.hasMany(Message)
Message.belongsTo(User);

(async()=>{
    sequelize.sync()
})()

module.exports = {
    User, 
    Message, 
    sequelize
}


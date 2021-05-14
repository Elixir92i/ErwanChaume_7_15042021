// Include Sequelize module.
const Sequelize = require('sequelize')
  
// Import sequelize object, 
// Database connection pool managed by Sequelize.
const sequelize = require('../utils/database')

  
// Define method takes two arrguments
// 1st - name of table
// 2nd - columns inside the table
const PostMessage = sequelize.define('postMessage', {
  
    // Column-1, user_id is an object with 
    // properties like type, keys, 
    // validation of column.
    message_id:{
  
        // Sequelize module has INTEGER Data_Type.
        type:Sequelize.INTEGER,
  
        // To increment user_id automatically.
        autoIncrement:true,
  
        // user_id can not be null.
        allowNull:false,
  
        // For uniquely identify user.
        primaryKey:true
    },
  
    // Column-2, name
    content: { type: Sequelize.STRING, allowNull: false },
    likes: {type: Sequelize.INTEGER, allowNull: true},
    users_liked:{ type: Sequelize.STRING, allowNull: true},
    dislikes: {type: Sequelize.INTEGER, allowNull: true},
    users_disliked:{ type: Sequelize.STRING, allowNull: true},
    
    // dates => current time
    myDate: { type: Sequelize.DATE, 
            defaultValue: Sequelize.NOW },
  
     // Timestamps
     createdAt: Sequelize.DATE,
     updatedAt: Sequelize.DATE,
},
{tableName: 'postMessage'})

  
// Exporting User, using this constant
// we can perform CRUD operations on
// 'user' table.
module.exports = PostMessage;
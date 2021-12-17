const bcrypt = require("bcryptjs")

const User = require("../Models/UserModel");
const Chat = require("../Models/ChatModel");
const UserCred = require("../Models/UserCredential")


class userService{

    // Adding User while Sign Up Process
    async addUser(body){
        try{

            // Preparing Data to Store in UserCredential collection
            const user_cred_body = {...body}
            
            // Encrypting password and storing hashed password in database
            const salt = await bcrypt.genSalt(10);
            user_cred_body["password"] = await bcrypt.hash(user_cred_body["password"], salt)
            
            // Preparing Data to Store in User collection
            const user_body = {...body}
            delete user_body["password"]
            
            const user = await User.create(user_body);
            const userCred = await UserCred.create(user_cred_body)
            
            // Returning User Information Stored in User Collection
            console.log("New User Added : ", user);
            
            return {user};
        }
        catch(err){
            console.log("error : ", err.message);
            return {errorMsg:err.message};
        }
    }

    // For fetching User Credentials from db
    async getUserCredById(user_id){
        try{
            const user = await UserCred.find({user_id:user_id});
            return {user};
        }
        catch(err){
            console.log("error : ", err.message);
            return {errorMsg:err.message};
        }
    }

    // For fetching User Data by Id
    async getUserData(body){
        try{
            const userArray = await User.find(body);
            if(userArray.length === 0) return {errorMsg:"No User Found !! "};
            return {userArray};
        }
        catch(err){
            console.log("error : ", err.message);
            return {errorMsg:err.message};
        }
    }

    // Add friend in User Friend List
    async addUserFriend(user_id, friend_data){
        try{
            const userArray = await User.find({user_id});

            if(userArray.length === 0) return {errorMsg:"Something went Wrong !! "};

            const user_friends = userArray[0].user_friends;

            user_friends.push({ user_id:friend_data.user_id, full_name:friend_data.full_name});

            await User.updateOne({user_id}, {user_friends});
        }
        catch(err){
            console.log("error : ", err.message);
            return {errorMsg:err.message};
        }
    }


    // API to check if user already exist in db
    async countUserId(body){
        try{
            const count = await User.countDocuments(body);
            return {count};
        }
        catch(err){
            console.log("error : ", err.message);
            return {errorMsg:err.message};
        }
    }

    async getAllUser(){
        try{
            const users = await User.find({});
            return {users};
        }
        catch(err){
            console.log("error : ", err.message)
            return {errorMsg:err.message};
        }
    }




    // Chat Data Services

    // Will fetch chats on basis of sent_to and sent_by attribute
    async getChatData(body){
        try{
            const {user_id, friend_id} = body;
            
            const chats = await Chat.find({
                $or: [
                    {$and: [
                        { 'sent_to': user_id },
                        { 'sent_by': friend_id }
                    ]},
                    {$and: [
                        { 'sent_to': friend_id },
                        { 'sent_by': user_id }
                    ]}
                ]
            })


            
            return {chats}
        
        }catch(err){
            console.log("error : ", err.message)
            return {errorMsg:err.message};
        } 
    }

    // Will Store all the chats in array
    async addChatData(body){
        try{
            const {chats} = body;

            // // Changing is_ne to false
            // chats.forEach(chat => chat.is_new = false );

            await Chat.insertMany(chats);
            return {success:true}
        }catch(err){
            console.log("error : ", err.message)
            return {errorMsg:err.message};
        } 
    }
    
}

module.exports = userService;

require("dotenv").config()

const mongoose = require("mongoose");
const { celebrate, Joi, Segments } = require('celebrate');
const UserService = require("./Services/UserService");

const userService = new UserService();

const express = require("express");
const {Router} = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Socket 
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors:"http://localhost:3000"
});



// Redis
const redis = require('redis');
const { promisifyAll } = require('bluebird');

promisifyAll(redis);

console.log("🚀 Connecting to Redis db");
const client = redis.createClient(); 


const passportConfig = require("./config/passport")

passportConfig(passport);

let URL = process.env.MONGO_DB_URI;

const PORT = process.env.PORT || 5000;

const route = Router();

app.use(express.urlencoded({extended:true}));
app.use(express.json({
    type: ['application/json', 'text/plain']
  }));
app.use(cors())  
app.use('/user', route);  


// Connection to mongoose database
mongoose.connect(URL, {useNewUrlParser: true, useCreateIndex: true,
    useUnifiedTopology: true,})
    .then((res)=>{
        console.log("🚀 Connected Successfully to Mongo db");
        // app.listen(PORT, ()=>{console.log(`Listening on ${PORT}`)}); 
        http.listen(PORT, ()=>{console.log(`🚀 Listening on ${PORT}`)});
    })
    .catch((err)=>{console.log(`🔥 ${err}`);} );


// Route to get all Users     
route.get('/', 
passport.authenticate('jwt',
    { session: false, failureRedirect: process.env.CLIENT_URL }),
async (req, res) => {
    console.log("📥 Request to get All User Data");
    const {errorMsg, users} = await userService.getAllUser();
    if (!errorMsg) {
        return res.send(users).status(200);
    } else {
        console.log(`🔥 ${errorMsg}`);
        return res.send({ errorMsg });
    }
  })


// Add User ( User Sign Up )
route.post("/signUpUser", 
    celebrate({
        [Segments.BODY]: Joi.object().keys({
        user_id: Joi.string().required(),
        full_name: Joi.string().required(),
        password: Joi.string().required(),
        })
    }),
    async(req, res)=>{
        console.log("📥 Request for user sign up");
        console.log(req.body)
        const {errorMsg, user} = await userService.addUser(req.body);
        if (!errorMsg) {
            return res.send({user}).status(200);
        } else {
            console.log(`🔥 ${errorMsg}`);
            return res.send({ errorMsg });
        }
    })


// Count Particular User Id in db
route.post("/countUserId",
//   passport.authenticate('jwt',
//   { session: false, failureRedirect: process.env.CLIENT_URL }),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      user_id: Joi.string().required()
    })
  }),
  async(req, res)=>{
      console.log("📥 Request for User Count");
      const {errorMsg, count} = await userService.countUserId(req.body);
      if (!errorMsg) {
          return res.send({count}).status(200);
      } else {
          console.log(`🔥 ${errorMsg}`);
          return res.send({ errorMsg });
      }
})    


route.post("/getUserData",
    passport.authenticate('jwt',
    { session: false, failureRedirect: process.env.CLIENT_URL }),
    celebrate({
        [Segments.BODY]: Joi.object().keys({
        user_id: Joi.string().required()
        })
    }),
    async(req, res)=>{
        console.log("📥 Request to get Particular User Data");
        const {errorMsg, userArray} = await userService.getUserData(req.body);
        if (!errorMsg) {
            const user = userArray[0]
            return res.send({user}).status(200);
        } else {
            console.log(`🔥 ${errorMsg}`);
            return res.send({ errorMsg });
        }
})


route.post("/addFriend",
passport.authenticate('jwt',
    { session: false, failureRedirect: process.env.CLIENT_URL }),
celebrate({
    [Segments.BODY]: Joi.object().keys({
    user_id: Joi.string().required(),
    friend_id: Joi.string().required()
    })
}),
async (req, res)=>{
    try{
        console.log("📥 Request to add friend");
        console.log(req.body.user_id, req.body.friend_id)
        const {errorMsg, userArray} = await userService.getUserData({user_id:req.body.friend_id});
        if (!errorMsg) {

            const friend_data = {}
            friend_data["user_id"] = userArray[0].user_id
            friend_data["full_name"] = userArray[0].full_name

            await userService.addUserFriend(req.body.user_id, friend_data);
            
            return res.send({success:`${friend_data["full_name"]} Added !!`, friend_data}).status(200);
        } else {
            console.log(`🔥 ${errorMsg}`);
            return res.send({ errorMsg });
        }
    }catch(e){
        console.log(`🔥 ${e}`);
        res.json({ errorMsg: `${req.body.friend_id} not Added !!`});
    }
}
)


// When User Login
route.post('/login',
    celebrate({
        body: Joi.object({
            user_id: Joi.string().required(),
            password: Joi.string().required(),
        }),
    }),
    async(req, res)=>{
        console.log("📥 Request for login");
        const {user_id, password} = req.body;
        try{
            const {errorMsg, user} = await userService.getUserCredById(user_id);

            if (!errorMsg) {

                if(user.length === 0){
                    
                    return res.json({ errorMsg: 'No User Found !! ' });
                }

                const isMatch  = await bcrypt.compare(password, user[0].password);

                if (isMatch) {
                    // USER MATCHED
                    // CREATE JWT PAYLOAD
                    const payload = { user_id };
                    // SIGN TOKEN
                    jwt.sign(
                        payload,
                        process.env.SECRET_KEY,
                        {
                            expiresIn: 60*60, // Can Change (in Seconds )
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                user_name: user[0].full_name,
                                token: 'Bearer ' + token,
                            });
                        },
                    );
                } else {
                    return res.json({ errorMsg: 'Password Incorrect !! ' });
                }

            } else {
                console.log(`🔥 ${errorMsg}`);
                return res.send({ errorMsg });
            }
        }
        catch (e) {
            console.log(`🔥 ${e}`);
            res.json({ errorMsg: 'Something went wrong' });
        }
    })


// Route to fetch Chat Data
route.post("/getChatData",
passport.authenticate('jwt',
    { session: false, failureRedirect: process.env.CLIENT_URL }),
celebrate({
    [Segments.BODY]: Joi.object().keys({
    user_id: Joi.string().required(),
    friend_id: Joi.string().required()
    })
}),
async (req, res)=>{
    console.log("📥 Request to get Chat Data");
    try{
        const {errorMsg, chats} = await userService.getChatData(req.body);
        if (!errorMsg) {
        
            return res.send({chats}).status(200);   
        
        } else {
            console.log(`🔥 ${errorMsg}`);
            return res.send({ errorMsg });
        }

    }catch(e){
        console.log(`🔥 ${e}`);
        res.json({ errorMsg: `Error in Fetching Chat Data !!`});
    }
})


// TODO: Find Another Solution for adding data when logout

// Route to save Chat Data
route.post("/addChatData",
// passport.authenticate('jwt',
//     { session: false, failureRedirect: process.env.CLIENT_URL }),
celebrate({
    [Segments.BODY]: Joi.object().keys({
    chats:Joi.array().required() 
    })
}),
async (req, res)=>{
    console.log("📥 Request to add Chat Data");
    try{
        const {errorMsg, success} = await userService.addChatData(req.body);
        if (!errorMsg) {
        
            return res.send({success}).status(200);   
        
        } else {
            console.log(`🔥 ${errorMsg}`);
            return res.send({ errorMsg });
        }

    }catch(e){
        console.log(`🔥 ${e}`);
        res.json({ errorMsg: `Error in Saving Chat Data !!`});
    }
})


route.post("/status",
passport.authenticate('jwt',
{ session: false, failureRedirect: process.env.CLIENT_URL }),
celebrate({
    [Segments.BODY]: Joi.object().keys({
    user_id: Joi.string().required(),
    })
}),
async (req, res) => {
    console.log("📥 Request to fetch User Status");
    try{
        const status = await client.getAsync(req.body.user_id);
        return res.send({status}).status(200); 
    }catch(e){
        console.log(`🔥 ${e}`);
        res.json({ errorMsg: `Error in Retreiving User Status !!`});
    }

});


// *************************************************** Profile Picture Upload *************************************************************

const maxSize = 20971520; // 20 mb limit

function saveImgToDirectory(cb, user_id) {
    
    // const dir = `./uploads/UserDP/${user_id}`;
    const dir = `./uploads/UserDP`;

    fs.mkdir(dir, { recursive: true }, err => {
        if (err) {
            return '';
        }
        return cb(null, dir);
    });
    return '';
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { user_id } = req.body;

        saveImgToDirectory(cb, user_id);
    },

    filename: function (req, file, cb) {
        const extName = path.extname(file.originalname);
        //

        cb(null, `${Date.now()}${extName}`);
    },
});

const upload = multer({ storage: storage, limits: { fileSize: maxSize } });


route.post(
    '/upload/dp',
    upload.single('image'),
    celebrate({
        body: Joi.object({
            user_id: Joi.string().required(),
        })
    }),
    (req, res, next) => {    
        const files = req.files;
        const {user_id} = req.body;
        console.log(files);
        console.log(user_id);
    })




// *************************************************** Handling Socket Events *************************************************************


const SocketId = {}; // Socked Id from User Id
const UserId = {}; // User Id from Socket Id


/** Manage behavior of each client socket connection */
io.on('connection', async (socket) => {
    
    socket.on("USER_ID", async (user_id) => {

        console.log(`🟢 User Connected - Socket ID -> ${socket.id}  User ID -> ${user_id}`);

        await client.setAsync(user_id, 'online');
        SocketId[user_id] = socket.id;
        UserId[socket.id] = user_id;
    
    });

    socket.on("MESSAGE", data => {

        console.log("Message Data", data);
        socket.to(SocketId[data.friend_id]).emit("MESSAGE", data.msgData);

    });

    socket.on('disconnect', async ()=>{

        let ts = Date.now();

        const date_ob = new Date(ts);
        const date = date_ob.getDate();
        const month = date_ob.getMonth() + 1;
        const year = date_ob.getFullYear();
        const hour = date_ob.getHours();
        const min = date_ob.getMinutes();
        const sec = date_ob.getSeconds();

        await client.setAsync(UserId[socket.id], `${hour}:${min}:${sec} ${date}-${month}-${year}`);

        console.log(`🔴 User Disonnected - Socket ID -> ${socket.id}  User ID -> ${UserId[socket.id]}`);

    });

});

// In order to use this in Mongoose you need to create an index on the collection using this syntax: MySchema.index( { "expireAt": 1 }, { expireAfterSeconds: 0 } );

// You also need to create a field in schema named expireAt and add the time at which you want the document to expire while adding document in the collection.
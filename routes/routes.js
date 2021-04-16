const { User, Message } = require('../models/models.js')
const jwt = require('jsonwebtoken')
const { Router } = require('express')
const router = Router()


router.get('/', async function (req, res){
    let messages = await Message.findAll({})
    let data = { messages }

    res.render('index.ejs', data)
})

router.get('/createUser', async function(req, res){
    let token = req.cookies.token 
    if(token){
        res.redirect("/")
    }else{
        res.render('createUser.ejs')
    }
    
})

router.get("/logout",(req,res)=>{
    let token = req.cookies.token
    if(token){
        res.cookie("token","");
         res.redirect("/");
    }else{
        res.redirect("/");

    }
})
router.post('/createUser', async function(req, res){
    let { username, password } = req.body

    try {
        await User.create({
            username,
            password,
            role: "user"
        }).then((user)=>{
            res.redirect('/login')
            console.log(user)
        })  
    } catch (e) {
        console.log(e)
        res.redirect("/error")
    }

    
})

router.post("/vote",(req,res)=>{
    let token=req.cookies.token;
    let messageId=req.body.messageId;
    if(token){
        
            res.redirect("/")
    }else{
            res.redirect("/login")
    }
    res.redirect("/");

})

router.get('/login', function(req, res) {
    let token = req.cookies.token 
    if(token){
        res.redirect("/")
    }else{
        res.render('login')
    }
    
})

router.post('/login', async function(req, res) {
    let username=req.body.username;
    let password=req.body.password;

    try {
        let user = await User.findOne({
            where: {username:username}
        }).then((user)=>{
            if (user && user.password === password) {
        let data = {
            username: username,
            role: user.role
        }

        let token = jwt.sign(data, "theSecret")
        res.cookie("token", token)
        res.redirect('/')
    }else{
        res.redirect('/error')
    }
    })
    } catch (e) {
        console.log(e)
    }
})

router.get('/message', async function (req, res) {
    let token = req.cookies.token 
    if (token) {                                      // very bad, no verify, don't do this
        res.render('message')
    } else {
        res.render('login')
    }
})

router.post('/message', async function(req, res){
    let { token } = req.cookies
    let { content } = req.body

    if (token) {
        let payload = await jwt.verify(token, "theSecret")  
 
        let user = await User.findOne({
            where: {username: payload.username}
        }).then((user)=>{
            if(user){
                let msg =  Message.create({
            content,
            userId: user.id
        }).then((msg)=>{
            console.log(msg)
           res.redirect('/') 
        })
        
            }else{
              res.redirect('/error')  
            }
        }).catch((error)=>{
            console.log(error);
            res.redirect('/error')
        })
        
    } else {
        res.redirect('/login')
    }
})

router.get('/error', function(req, res){
    res.render('error')
})

router.all('*', function(req, res){
    res.send('404 dude')
})

module.exports = router
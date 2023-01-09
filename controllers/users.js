// create an instance of express routers
const express = require('express')
const db = require('../models')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')

// GET /users/new -- serves a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs', {
        user: res.locals.user
    })
})

// POST /users -- creates a new user from the form @ /users/new
router.post('/', async (req, res) => {
    try {
        // based on the info in the req.body, find or create user
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email
            }
        }) 
        // if the user is found, redirect user to login
        if (!created) {
            res.redirect('/users/login?message=Please log in to continue.')
        } else {
            // here we know its a new user
            // hash the supplied password
            const hashedPassword = bcrypt.hashSync(req.body.password, 12)
            // save the user with the new password
            newUser.password = hashedPassword
            await newUser.save() // actually save the new password in th db
            // ecrypt the new user's id and convert it to a string
            const encryptedId = crypto.AES.encrypt(String(newUser.id), process.env.SECRET)
            const encryptedIdString = encryptedId.toString()
            // place the encrypted id in a cookie
            res.cookie('userId', encryptedIdString)
            // redirect to user's profile
            res.redirect('/users/profile')
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('server error on POST user to db path 🔥')
    }
})

// GET /users/login -- render a login form that POSTs to /users/login
router.get('/login', (req, res) => {
    res.render('users/login.ejs', {
        message: req.query.message ? req.query.message : null,
        user: res.locals.user
    })
})

// POST /users/login -- ingest data from form rendered @ GET /users/login
router.post('/login', async (req, res) => {
    try {
        // look up the user based on their email
        const user = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        // boilerplate message if login fails
        const badCredentialMessage = 'username or password incorrect'
        if (!user) {
            // if the user isn't found in the db 
            res.redirect('/users/login?message=' + badCredentialMessage)
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
            // if the user's supplied password is incorrect
            res.redirect('/users/login?message=' + badCredentialMessage)
        } else {
            // if the user is found and their password matches log them in
            // ecrypt the new user's id and convert it to a string
            const encryptedId = crypto.AES.encrypt(String(user.id), process.env.SECRET)
            const encryptedIdString = encryptedId.toString()
            // place the encrypted id in a cookie
            res.cookie('userId', encryptedIdString)
            res.redirect('/')
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('server error on POST user login path 🔥')
    }
})

// GET /users/logout -- clear any cookies and redirect to the homepage
router.get('/logout', (req, res) => {
    // log the user out by removing the cookie
    // make a get req to /
    res.clearCookie('userId')
    res.redirect('/')
})

// GET /users/profile -- show the user their profile page
router.get('/profile', async (req, res) => {
    // if the user is not logged in -- they are not allowed to be here
    if (!res.locals.user) {
        res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource!')
    } else {
        res.render('users/profile.ejs', {
            user: res.locals.user
        })
    }
})

// POST /users/:id change user passwork
router.put('/:id', async (req,res) => {
    try {
        // update user db with password change
        const passwordChange = await db.user.update({ 
            password: bcrypt.hashSync(req.body.password, 12) },{
                where: {
                    email: req.body.email
                }
        })  
        res.redirect('/')
    } catch (err) {
        console.log(err)
        res.status(500).send('server error on PUT password path 🔥')
    }
})

// POST /users/favorites/:id delete a favorited drink
router.delete('/favorites/:id', async (req,res) =>{
    try {
        // delete selected drink
        await db.favorite.destroy({
            where: {
                id: req.params.id
            }
        })
        res.redirect(req.get('referer'))
    } catch (err) {
        console.log(err)
        res.status(500).send('server error on DELETE favorite path 🔥')
    }
})

// POST /users/favorites/:id/comment add a comment to comment db model
router.post('/favorites/:id/comment', async (req,res)=>{
    try {
        // create a new comment
        const newComment = await db.comment.create({
            userName: req.body.userName,
            comment: req.body.comment,
            favoriteId: req.params.id,
            userId:res.locals.user.id
        })
        res.redirect(req.get('referer'))
    } catch (err) {
        console.log(err)
        res.status(500).send('server error on POST comment path 🔥')
    }
})

// GET /users/favorites/:name - return a page with the favorite drink details( instructions, ingredients etc)
router.get('/favorites/:name', async (req,res) =>{
    try {
        // get API results based on the name in the url
        let name = req.params.name
        const baseUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`
        const response = await axios.get(baseUrl,{ 
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        })
        // find all drinks in favorite db where the name matches the name in url
        const favDrinks = await db.favorite.findAll({
            where: {
                name: req.params.name
            },
            // add the comments db
            include: [db.comment]
        })
        res.render('./users/details.ejs', {
            user: res.locals.user,
            data: response.data.drinks,
            favDrinks: favDrinks
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('server error on GET details path 🔥')
    }
})

// export the router
module.exports = router
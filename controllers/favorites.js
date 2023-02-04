// create an instance of express routers
const express = require('express')
const db = require('../models')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')

// GET /favorites - return a page with favorited drink
router.get('/', async (req, res) => {
    try {
        // READ function to find all favorite drinks for logged in user
        const favDrinks = await db.favorite.findAll({
            where: {
            userId: res.locals.user.id
        },
        // include the comment db model
            include: [db.comment]
        })
        res.render('./users/favorites.ejs', {
            favDrinks: favDrinks,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('server error on GET favs path 🔥')
    }
})

// POST /favorites - receive the name of a drink and add it to the database
router.post('/', async (req, res) => {
    try {
        // IF a user is logged in find or create the drink in the db
        if (req.cookies.userId) {
            await db.favorite.findOrCreate({
                where: {
                    name: req.body.name,
                    glassType: req.body.glassType,
                    image: req.body.image,
                    userId: res.locals.user.id
        }
    })
        // IF no user direct to the login page
        }else {
            res.redirect('/users/login')
        }
        res.redirect('/favorites')
    } catch (err) {
        console.log(err)
        res.status(500).send('server error on POST fav to db path 🔥')
    } 
});

// export the router
module.exports = router
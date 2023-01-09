// create an instance of express routers
const express = require('express')
const db = require('../models')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')

// // GET /results axois to hit API
router.get('/', async (req,res) => {
    try {
        // query the search bar to grab name of the drink to search the API
        let name = req.query.search
        const baseUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`
        const response = await axios.get(baseUrl,{ 
            // accept encoded API results
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        })
        res.render('results.ejs', {
            user: res.locals.user,
            data: response.data.drinks
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('server error on GET api results path 🔥')
    }
})

// export the router
module.exports = router



const db = require('./models')

// create some pokemon with async/await syntax
async function createFav() {
    try {
        const newFav = await db.favorite.create({ name: 'Highball'})
        console.log('the new drink is:', newFav)
        const foundDrink = await db.favorite.findOne({
            where: {
                name: 'Highball'
            }
        })
        console.log('the found drink is:', foundDrink)
    }catch (err) {
        console.log(err)
    }
}

createFav()
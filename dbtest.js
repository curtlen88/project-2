const db = require('./models')

// const createComment = async () => {
//   try {
//     const newComment = await db.comment.create({
//       userName: 'Ada Lovelace',
//       comment: 'So excited for this!',
//       drinkId: 1
//     })
//     console.log(newComment)
//   } catch (err) {
//     console.log(err)
//   }
// }

// createComment()

const readComments = async () => {
    try {
      const comment = await db.favorite.findOne({
        where: { id: 1},
        include: [db.comment]
      })
      console.log(article)
    } catch (err) {
      console.log(err)
    }
  }
  
  readComments()
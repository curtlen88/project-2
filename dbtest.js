const db = require('./models')

// const createComment = async () => {
//   try {
//     const newComment = await db.comment.create({
//       userName: 'the dude',
//       comment: '💀that carpet really brought together the room!',
//       favoriteId: 3
//     })
//     console.log(newComment)
//   } catch (err) {
//     console.log(err)
//   }
// }

// createComment()

  const readComment = async () => {
    try {
      const oneFav = await db.favorite.findOne({
        where: { id: 3},
        include: [db.comment]
      })
      console.log(oneFav.comments)
    } catch (err) {
      console.log(err)
    }
  }
  
  readComment()
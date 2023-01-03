const db = require('./models')

const createComment = async () => {
  try {
    const newComment = await db.comment.create({
      userName: 'superman',
      comment: 'small buildings in a single drink!',
      favoriteId: 3
    })
    console.log(newComment)
  } catch (err) {
    console.log(err)
  }
}

createComment()

  // const readComment = async () => {
  //   try {
  //     const oneFav = await db.favorite.findOne({
  //       where: { id: 3},
  //       include: [db.comment]
  //     })
  //     console.log(oneFav.comments)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  
  // readComment()
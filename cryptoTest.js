// encryption is a two way process -- data id encrypted using an algorithm and a key 
// you must know wat the key is to decrypt or unscramble the data

// cyptojs for encryption
const mySecret = 'i eat cookies for breakfast'

const secretKey = 'myPassword'

// advances encryption standard algo
const  crypto = require('crypto-js')

const myEncryption = crypto.AES.encrypt(Srting(100), secretKey)
console.log(myEncryption.toString());// lets see our encrypted data

const dcrypt = crypto.AES.descrypt(myEncryption.toString(), secretKey)
console.log(decrypt.toString(crypto.enc.Utf8));

// paswords in the database will be hashed 
// hashing is a one way process, once data has been hashed you cannot unhash it 
// hashing functions always return a hash of equal length regardless of input
// hashing functions always return the same output given the sam input 

const bcrypt = require('bcrypt')

const userPassword = '12345password'
// when the user signes up we want to hash their password and save it in the db
const hashedPassword = bcrypt.hashSync(userPassword, 12)
console.log(hashedPassword);

// COMPARE a string to our hash (user login)
console.log(bcrypt.comaoreSync(userPassword, hashedPassword));


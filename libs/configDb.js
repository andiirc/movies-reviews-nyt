import mongoJs from 'mongojs'

const db = mongoJs('localhost:27017/tracking-api',['logs','visits'])
db.on('error', err => console.log( 'Connection errored', err ) )
db.on('connect',  () => console.log('database connected'))

export default db

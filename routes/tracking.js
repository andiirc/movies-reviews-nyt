import request from 'request'
import mongoJs from 'mongojs'
import moment from 'moment'

const db = mongoJs('localhost:27017/tracking-api',['logs','visits'])
db.on('error', err => console.log( 'Connection errored', err ) )
db.on('connect',  () => console.log('database connected'))

module.exports = app =>{

  app.get('/api/tracking-logs', (req,res)=>{
      db.logs.find((err, logs )=>{
          res.send({data: logs, success: true})
      })
  })

  app.get('/api/tracking-logs-filter-date/:date', (req, res)=>{
    let start = `${moment(req.params.date).format("YYYY-MM-DD")} 00:00:00`
    let end =  `${moment(req.params.date).format("YYYY-MM-DD")} 23:59:59`
    db.logs.find({ date: {$gte: start, $lte: end } },(err, logs)=>{
        res.send({ data: logs, success: true})
    })
  })

  app.get('/api/tracking-logs-filter-ip/:ip', (req, res)=>{
      let ip = req.params.ip
      db.logs.find({ ip: ip },(err, logs)=>{
         res.send({ data: logs, success: true})
      })
  })

  app.get('/api/tracking-locationip/:id', (req, res)=>{
      let id = req.params.id
      db.logs.findOne({ _id: mongoJs.ObjectId(`${id}`) },(err, logs)=>{
          const {ip} = logs
          request.get(`https://timezoneapi.io/api/ip/?${ip}`, (err, res, dat) => {
            const { data } = JSON.parse(dat)
            let visits = {
              ip: data.ip,
              city: data. city,
              country: data.country,
              location: data.location
            }
             db.visits.insert(visits, (err,res)=>{
                if (err) console.log(err)
             })
        })
        res.send({data: logs, success:true})
      })

  })

}

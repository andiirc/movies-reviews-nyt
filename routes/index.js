import request from 'request'
import moment from 'moment'
import db from '../libs/configDb.js'

const key = '007e5be0a0f846ecb46a4328ffd2a037'

module.exports = app => {

  app.get('/', (req, res)=>{
    res.redirect('/api/movies')
  })

  app.get('/api/movies', (req,res)=>{
    let now = new Date()
    let search = {
      url:'https://api.nytimes.com/svc/movies/v2/reviews/search.json',
      qs:{ 'api-key':key, 'publication-date': moment(now).format('YYYY-MM-DD') }
    }
    request.get(search, (err, response, body) => {
            if(!err){
              const { results, num_results } = JSON.parse(body)
              const movies = results.map(item=>{
                 return {
                   display_title: item.display_title,
                   multimedia: item.multimedia,
                   opening_date: item.opening_date
                 }
               })

               request.get(`https://timezoneapi.io/api/ip`, (err, res, dat) => {
                   const { data } = JSON.parse(dat)
                   let log = {
                      ip:  data.ip,
                      date: moment(now).format("YYYY-MM-DD HH:mm:ss"),
                      search_term: search,
                      number_items: num_results
                    }
                    db.logs.insert(log, (err,res)=>{
                       if (err) console.log(err)
                    })
               })

              res.send({ data: movies, success: true })
            }
          })
  })

  app.get('/api/movies/:query', (req,res)=>{
    let search = {
      url:'https://api.nytimes.com/svc/movies/v2/reviews/all.json',
      qs:{ 'api-key':key, 'query': req.params.query, 'order': "by-title" }
    }
    request.get(search,(err, response, body) => {
            if(!err){
              const { results, num_results } = JSON.parse(body)

              request.get(`https://timezoneapi.io/api/ip`, (err, res, dat) => {
                  const { data } = JSON.parse(dat)
                  let log = {
                     ip:  data.ip,
                     date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                     search_term: search,
                     number_items: num_results
                   }
                   db.logs.insert(log, (err,res)=>{
                      if (err) console.log(err)
                   })
              })

              res.send({ data: results, success: true })
            }
          })
  })

}

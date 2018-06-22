module.exports = app => app.listen( app.get('port'), ()=> console.log(`listen port ${app.get('port')}`) )

var dbname="nyultar", //database name (collections --> ?)
    express = require('express'), bodyParser = require('body-parser'),
    frontend={ root: __dirname+'/frontend' },
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    mongoose = require('mongoose'), app = express()
app .use(bodyParser.json()).use(cookieParser())
    .use(express.static('public')).use(session({
        resave: true, saveUninitialized: true,
        secret: 'ABC123', cookie: { maxAge: 600000 }
    }))
mongoose.connect('mongodb://localhost/'+dbname, { useMongoClient: true })
mongoose.Promise = global.Promise

var Nyul = mongoose.model('nyul', {
  nyultipus: {type: String, trim:true},
  nyulszam: {type: String, trim:true, unique:true},
  ketrecszam: {type: String, trim:true},
  datum: {type: Date,},
})

var Ketrec = mongoose.model('ketrec', {
  kategoria: {type: String, trim:true},
  ketrecszam: {type: String, trim:true, unique:true},
  ferohelyszam: {type: String, trim:true},
})


app.get( '/', (req, res) => res.sendFile('index.html', frontend) )

app.get( '/backend/ujnyulhtml', (req, res) => res.sendFile('ujnyul.html', frontend) )

app.get( '/backend/ujketrechtml', (req, res) => res.sendFile('ujketrec.html', frontend) )

app.get( '/backend/mainhtml', (req, res) => res.sendFile('main.html', frontend) )

app.get( '/backend/sugohtml', (req, res) => res.sendFile('sugo.html', frontend) )


app.post("/nyulment", (req,res) => {
	console.log(req.body)
	var ujnyul = new Nyul( req.body )
	ujnyul
	.save( (err,cucc) => {
		if (err) res.send({ok:0})
		else res.send({ok: 1})
	})
})

app.get("/nyulak", (req,res) => {
    // console.log('keres erkezett')
    // res.send({valami:'adat'})
	Nyul
		.find()
		.sort({nyulszam: 1})
		.exec((err,arr) => {
        if (err) {
            console.log(err)
            res.send([])
        }
        res.send(arr)
    } )
})
app.get("/ketrecek", (req,res) => {
    Ketrec
		.find()
		.sort({ketrecszam: 1})
		.exec((err,arr) => {
        if (err) {
            console.log(err)
            res.send([])
        }
        res.send(arr)
    } )
})

app.post("/ketrecment", (req,res) => {
	console.log(req.body)
	var ujketrec = new Ketrec( req.body )
	ujketrec
	.save( (err,cucc) => {
		if (err) res.send({ok:0})
		else res.send({ok: 1})            
    })
})

app.post( '/keres', (req,res) => {
	console.log(req.body)
    Nyul
        .find({
            $or: [
                { nyulszam: new RegExp('^.*'+req.body.mitkeres+'.*$', "i") },
                { nyultipus: new RegExp('^.*'+req.body.mitkeres+'.*$', "i") }
            ]
        })
        .sort({nyulszam: -1})
        .limit(20)
        .exec((err,arr) => {
            console.log(arr)
			res.send({nyulak: arr})
        } )
} )

app.listen(3000)
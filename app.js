var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var path = require('path');
var multer  = require('multer');

// Models
var Publisher = require('./models/publisher.js');
var GameInfo = require('./models/gameInfo.js');

var app = express();
var PORT = process.env.PORT || 3000;

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

// Set Static Path
app.use(express.static(process.cwd() + "/public"));

// Setting up links for mongo
var mlab = 'mongodb://heroku_5h6mt273:7i4si4eaccbelkn1rcblq63u7r@ds045618.mlab.com:45618/heroku_5h6mt273';
var local = 'mongodb://localhost:27017/gameDatabase';

// Connect to localhost if not a production environment
if(process.env.NODE_ENV == 'production'){
  mongoose.connect(mlab);
} else {
  mongoose.connect(local);
}
 
var db = mongoose.connection;

// show any Mongoose errors
db.on('error', function (err) {
  console.log('Mongoose Error: ', err);
});

// Once logged in to the db through mongoose, log a success message
db.once('open', function () {
  console.log('Mongoose connection successful.');
});

// Storage setup for Multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname );
  }
});
var upload = multer({ storage: storage });

// Routes
app.get("/", (req, res) => {
	GameInfo.find().populate('gamePublisher').exec(function(err, data){
		if(err) {
			console.log(err)
		} else {
			
			res.render('gameList', {
				datas: data
			})		
		}

	});
});


app.post('/addPublisher', function(req, res){
	 var myPublisher = new Publisher(req.body);
	 myPublisher.save()
	 .then(item => {
	 console.log("saved");
	 })
	 .catch(err => {
	 res.status(400).send("unable to save to database");
	 });
	 res.redirect('publisherList');
});

app.post('/addInfo', upload.single('gameImage'), function(req, res){
	console.log(req.body)

	var myGameInfo = {};	
	myGameInfo = new GameInfo(req.body);
	myGameInfo.gameImage = req.file.filename;	

	myGameInfo.save(function(err){
		if(err){
			console.log(err)
		}
			console.log("saved")
		})
		res.redirect('/');
});

	


app.get('/addGame', function(req, res){
	Publisher.find({}, function(err,data){
		if(err){
			console.log(err);
		} else {
			// console.log(games);
			res.render('addGame', {
				publishers: data
			})
		}
	});
});

app.get('/addPublisher', function(req, res){
	res.render('addPublisher')
});

app.get('/publisherList', function(req, res){
	Publisher.find().populate().exec(function(err, data) {
		if(err){
			console.log(err);
		} else {
			// console.log(games);
			res.render('publisherList', {
				publishers: data
			})
		}
	});
});

app.get('/editGame/:id', function(req, res){
	console.log(req.params.id)

	GameInfo.findById(req.params.id)
	.populate('gamePublisher')
	.populate('gamePublisher.publisher')
	.exec(function(err, game){
		if(err) {
			console.log(err)
		} else {
			Publisher.find({}, function(err,data){
				console.log('get',game.gamePublisher[0]._id)
			res.render('editGame', {
				games: game,
				publishers: data
			})
			});		
		}

	});








	// , function(err, game){
	// 	if(err){
	// 		console.log(err);
	// 	} 
	// 	Publisher.find({}, function(err,data){
	// 		res.render('editGame', {
	// 		game: game,
	// 		publishers: data
	// 		});
	// 	});	
	// });
});

app.post('/editGame/:id', upload.single('gameImage'), function(req, res){

	let game = {};
	game.gameTitle = req.body.gameTitle;
	game.gamePublisher = req.body.gamePublisher;
	console.log('post: ',req.body);
	// game.gameImage = req.file.filename;
	// game.gameImage = req.body.gameImage;
	let file = JSON.stringify(req.file)

	if(file===undefined){
		console.log('no file submitted')
	} else {
		game.gameImage = req.file.filename;
	}

	let id = {_id:req.params.id}

	GameInfo.update(id, game, function(err){
		if(err){
			console.log(err);
			return;
		} else {
			console.log('updated');
			res.redirect('/');
		}
	})
});


app.get('/editPublisher/:id', function(req, res){
	Publisher.findById(req.params.id, function(err, data){
		res.render('editPublisher', {
			publisher: data
		})
	})
})

app.post('/editPublisher/:id', function(req, res){
	
	let publisher = {};
	publisher.publisher = req.body.publisher;
	let id = {_id:req.params.id};

	Publisher.update(id, publisher, function(err){
		if(err){
			console.log(err);
			return;
		} else {
			var game = new 
			console.log('updated');
			res.redirect('/publisherList');
		}
	})
});

app.get('/delete/:id', function(req, res){
	let id = {_id:req.params.id};

	Publisher.findById(req.params.id, function(err, article){
		Publisher.remove(id, function(err){
			if(err){
				console.log(err);
			}
			console.log('Publisher Deleted');
			res.redirect('/publisherList');
		})
	})
});

app.get('/deleteGame/:id', function(req, res){
	let id = {_id:req.params.id};

	GameInfo.findById(req.params.id, function(err, article){
		GameInfo.remove(id, function(err){
			if(err){
				console.log(err);
			}
			console.log('Game Deleted');
			res.redirect('/');
		})
	})
});
 
app.listen(PORT, () => {
 console.log("Server listening on port " + PORT);
});
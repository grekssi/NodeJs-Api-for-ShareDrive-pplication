const express = require('express');
const cors = require('cors');
const monk = require('monk');
const offersdb = monk('mongodb+srv://grekssi:254517@cats-qdnj0.mongodb.net/OffersDb')
const offers = offersdb.get('Offers');
const db = monk('mongodb+srv://grekssi:254517@cats-qdnj0.mongodb.net/Users');
const users = db.get('RegisteredUsers');
const mews = db.get('mews');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res, next) => {
  mews
    .find()
    .then(mews => {
      res.json(mews);
    }).catch(next);
});

app.get('/users', (req, res, next) => {
  users
    .find()
    .then(users => {
      res.json(users);
    }).catch(next);
});

app.get('/users/id', (req, res, next) => {
  const userId = req.body.userId;
  users
    .findOne({_id : userId})
    .then(users => {
      res.json(users);
    }).catch(next);
});

app.get('/mews', (req, res, next) => {
  mews
    .find()
    .then(mews => {
      res.json(mews);
    }).catch(next);
});

app.get('/offers', (req, res, next) => {
  offers
  .find()
  .then(mews => {
    res.json(mews);
  }).catch(next);
});

app.post("/createoffer", function(req, res, next){    
  
  const offer = {
    price : req.body.price,
    userId : req.body.userId,
    luggageSpace : req.body.luggageSpace,
    userLevel : req.body.userLevel,
    spacesLeft : req.body.spacesLeft,                           
    startingPoint : req.body.startingPoint,
    endPoint : req.body.endPoint,
    timeOfPost : req.body.timeOfPost,
    isActive : req.body.isActive
  };

  offers
      .insert(offer)
      .then(createdOffer => {
        res.json(createdOffer);
      }).catch(next);
})

function isValidMew(mew) {
  return mew.name && mew.name.toString().trim() !== '' && mew.name.toString().trim().length <= 50 &&
    mew.content && mew.content.toString().trim() !== '' && mew.content.toString().trim().length <= 140;
}

function isValidRegistration(user) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)){
    return true;
  }
}

const createMew = (req, res, next) => {
  if (isValidMew(req.body)) {
    const mew = {
      name: req.body.name.toString().trim(),
      content: req.body.content.toString().trim(),
      created: new Date()
    };

    mews
      .insert(mew)
      .then(createdMew => {
        res.json(createdMew);
      }).catch(next);
  } else {
    res.status(422);
    res.json({
      message: 'Hey! Name and Content are required! Name cannot be longer than 50 characters. Content cannot be longer than 140 characters.'
    });
  }
};

app.post("/login", function(req, res){    
  const username = req.body.name;
  const password = req.body.password;
  users.findOne({name : username})
  .then(foundUser => {
      if(foundUser.password == password){
      res.json(foundUser);
    }
    else{
      res.status(422);
      res.json({
        message: 'InvalidPassword '
      });
    }
  });
})

const register = (req, res, next) => {
  if (isValidRegistration(req.body)) {
    const user = {
      name: req.body.name.toString().trim(),
      password: req.body.password.toString().trim(),
      email: req.body.email.toString().trim()
    };

    users
      .insert(user)
      .then(createdUser => {
        res.json(createdUser);
      }).catch(next);
  } else {
    res.status(422);
    res.json({
      message: 'Hey! Username and Password are required!'
    });
  }
};


app.post('/mews', createMew);
app.post('/register', register);

app.use((error, req, res, next) => {
  res.status(500);
  res.json({
    message: error.message
  });
});





app.listen(5000, () => {
  console.log('Listening on http://localhost:5000');
});







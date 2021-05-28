require ('dotenv').config ();
const express = require ('express');
const mongoose = require ('mongoose');
const bodyParser = require ('body-parser');
const cors = require ('cors');
const app = express ();
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
app.use (function (req, res, next) {
  //Enabling CORS
  res.header ('Access-Control-Allow-Origin', '*');
  res.header ('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header (
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization'
  );
  next ();
});

app.use (express.json ({limit: '30mb', extended: true}));
app.use (express.urlencoded ({limit: '30mb', extended: true}));
app.use (cors ());

const PORT = process.env.PORT || 4000;
mongoose
  .connect (process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then (() =>
    app.listen (PORT, () => console.log ('Server running successfully!'))
  )
  .catch (error => console.log (error.message));
const userSchema = new mongoose.Schema ({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  id: {type: String},
});
const User = mongoose.model ('User', userSchema);
const postSchema = new mongoose.Schema ({
  title: String,
  message: String,
  name:String,
  creator: String,
  tags: [String],
  selectedFile: String,
  likes: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date (),
  },
});
app.get ('/', (req, res) => {
  res.send ('Hello Welcome to Memories APP');
});
const Post = mongoose.model('Post', postSchema);
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
   
  if (authHeader) {
    const token = authHeader.split (' ')[1];
    const isCustomAuth = token.length < 500;
    
    if (token && isCustomAuth) {
      jwt.verify (token, 'test', (err, user) => {
        if (err) {
          res.status (403).json ('Authentication Unsuccesfull!');
        } else {
          req.userId = user.id;
        }
      });
    } else {
      
      const user=jwt.decode(token);
      req.userId=user.sub;
    }
    next ();
  } else {
    res.status (401).json ('Authentication Key Not found!');
  }
};

app.get ('/api/posts', (req, res) => {
  Post.find ({}, (err, posts) => {
    if (err) {
      res.status (404).json (err);
    } else {
      res.status (200).json (posts);
    }
  });
});
app.post ('/api/create', authenticateJWT, (req, res) => {
  
  const post = req.body;
  const newPost=new Post({...post,creator:req.userId,createdAt:new Date().toISOString()});
  newPost.save (err => {
    if (err) {
      res.status (409).json (err);
    } else {
      res.status (201).json (newPost);
    }
  });
});
app.get ('/api/:id', authenticateJWT, (req, res) => {
  const id = req.params.id;
  Post.findById (id, (err, foundPost) => {
    if (err) {
      res.status (404).json (err);
    } else {
      res.status (200).json (foundPost);
    }
  });
});
app.post ('/api/update/:id', authenticateJWT, (req, res) => {
  const id = req.params.id;
  Post.findById (id, (err, foundPost) => {
    if (err) {
      res.status (404).send ('Post with this id not found!');
    } else {
      foundPost.title = req.body.title;
      foundPost.message = req.body.message;
      foundPost.tags = req.body.tags;
      foundPost.selectedFile = req.body.selectedFile;
      foundPost.save (err => {
        if (err) {
          res.status (400).send ('Update not possible!');
        } else {
          res.status (200).json ('Updated!');
        }
      });
    }
  });
});
app.delete ('/api/delete/:id', authenticateJWT, (req, res) => {
  const id = req.params.id;
  Post.findByIdAndDelete (id, (err, response) => {
    if (!err) {
      res.status (200).json ('Deleted Successfully!');
    } else {
      res.status (404).json ('No Document Found!');
    }
  });
});
app.get('/api/updateLike/:id', authenticateJWT, (req, res) => {
  const id = req.params.id; 

  if (!req.userId) {
    return res.status (401).json ('Unauthenticated!');
  } else {
    Post.findById (id, (err, foundPost) => {
      if (err) {
        res.status (404).json ('Not Found!');
      } else {
        const index = foundPost.likes.findIndex (
          id => id === String (req.userId)
        );
        if (index === -1) {
          foundPost.likes.push (req.userId);
        } else {
          foundPost.likes = foundPost.likes.filter (
            id => id !== String (req.userId)
          );
        }
        foundPost.save (err => {
          res.status (200).json (foundPost);
        });
      }
    });
  }
});
//User Signin and Singup
app.post ('/api/signin', (req, res) => {
  const {email, password} = req.body;
  User.findOne ({email}, (err, foundUser) => {
    if (err) {
      res.status (404).json ('Something Went Wrong!');
    }
    if (!foundUser) {
      res.status (400).json ("User doesn't exist");
    } else {
      bcrypt.compare (
        password,
        foundUser.password,
        (err, isPasswordCorrect) => {
          if (!isPasswordCorrect) {
            res.status (400).json ('Invalid Credentials!');
          } else {
            jwt.sign (
              {email: foundUser.email, id: foundUser._id},
              'test',
              {expiresIn: '1h'},
              (err, token) => {
                res.status (200).json ({result: foundUser, token});
              }
            );
          }
        }
      );
    }
  });
});
app.post ('/api/signup', (req, res) => {
  const {email, password, confirmPassword, firstName, lastName} = req.body;
  User.findOne ({email}, (err, foundUser) => {
    if (foundUser) {
      res.status (400).json ('User already exist');
    } else if (password !== confirmPassword) {
      res.status (404).json ("Passwords doesn't match");
    } else {
      bcrypt.hash (password, 10, (err, hash) => {
        User.create (
          {email: email, password: hash, name: firstName + ' ' + lastName},
          (err, result) => {
            jwt.sign (
              {email: result.email, id: result._id},
              'test',
              {expiresIn: '1h'},
              (err, token) => {
                res.status (200).json ({result, token});
              }
            );
          }
        );
      });
    }
  });
});

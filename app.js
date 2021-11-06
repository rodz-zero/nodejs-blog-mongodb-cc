const express = require ('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

// express app

const app = express();

// connect mongodb
const dbURL = 'mongodb+srv://rodzero:aria123@nodemo.do3ej.mongodb.net/node-demo?retryWrites=true&w=majority';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => app.listen(3000))
.catch((err) => console.log(err));
// register view engine
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    const blogs = [
        {title: 'Rods1 is shy', snippet: 'Lorem ipsum dolor sit amet consectetor'},
        {title: 'Rods2 is shy', snippet: 'Lorem ipsum dolor sit amet consectetor'},
        {title: 'Rods3 is shy', snippet: 'Lorem ipsum dolor sit amet consectetor'}
    ];
    res.render('index', { title: 'Home', blogs });
});

// middleware and static files
app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result });
        })
        .catch((err) => {
            console.log(err);
        });
    
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About'});
});


app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new Blog'});
});

app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'new blog 2',
        snippet: 'about my new blog',
        body: 'more about my blog'
    });

    blog.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
    
});

app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/single-blog', (req, res) => {
    Blog.findById('6186a27175714884f7fcd9c6')
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

// redirects
// app.get('/about-us', (req, res) => {
//     res.redirect('/about');
// });

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404'});
});


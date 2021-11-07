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

//app.listen(3000)

app.set('view engine', 'ejs');

// middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.redirect('/blogs');
    // const blogs = [
    //     {_id: '1', title: 'Rods1 is shy', snippet: 'Lorem ipsum dolor sit amet consectetor', body: 'Body: Lorem ipsum dolor sit amet consectetor.'},
    //     {_id: '2', title: 'Rods2 is shy', snippet: 'Lorem ipsum dolor sit amet consectetor', body: 'Body: Lorem ipsum dolor sit amet consectetor.'},
    //     {_id: '3', title: 'Rods3 is shy', snippet: 'Lorem ipsum dolor sit amet consectetor', body: 'Body: Lorem ipsum dolor sit amet consectetor.'}
    // ];
    // res.render('index', { title: 'Home', blogs });
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result });
        })
        .catch((err) => {
            console.log(err);
        });
    
});

// post request
app.post('/blogs', (req, res) => {
    // console.log(req.body);
    const blog = new Blog(req.body);
    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        })

})


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
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    //res.render('details', { title : 'Blog Details'});
    Blog.findById(id)
        .then((result) => {
            res.render('details', { blog: result, title : 'Blog Details'});
        })
        .catch((err) => {
            console.log(err);
        });
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/blogs'})
        })
        .catch(err => { 
            console.log(err);
        })
})

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


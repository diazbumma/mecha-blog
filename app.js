const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const sanitizer = require('express-sanitizer')
const app = express()
const PORT = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(sanitizer())
mongoose.connect('mongodb://localhost/mecha_blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('Connected to mecha_blog DB!')).catch(error => console.log(error.message))

const Blog = require('./models/blog')

app.get('/', function(req, res) {
    res.redirect('/blogs')
})

app.get('/blogs', function(req, res) {
    Blog.find({}, function(err, data) {
        if (err) {
            console.log('ups there is an error while retrieving data')
        } else {
            res.render('index', {blogs: data})
        }
    })
})

app.get('/blogs/new', function(req, res) {
    res.render('new', {})
})

app.post('/blogs', function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err, data) {
        if (err) {
            console.log(err)
            res.redirect('/blogs/new')
        } else {
            res.redirect('/blogs')
        }
    })
})

app.get('/blogs/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, data) {
        if (err) {
            res.redirect('/blogs')
        } else {
            res.render('show', {blog: data})
        }
    })
})

app.get('/blogs/:id/edit', function(req, res) {
    Blog.findById(req.params.id, function(err, data) {
        if (err) {
            res.redirect('/blogs')
        } else {
            res.render('edit', {blog: data})
        }
    })
})

app.put('/blogs/:id', function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, data) {
        if (err) {
            res.redirect('/blogs')
        } else {
            res.redirect('/blogs/' + req.params.id)
        }
    })
})

app.delete('/blogs/:id' , function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect('/blogs')
        } else {
            console.log(req.params.id + ' has been deleted')
            res.redirect('/blogs')
        }
    })
})

app.get('*', function(req, res) {
    res.send('Ups, i think you lost buddy')
})

app.listen(PORT, function() {
    console.log('mechablog app is running on server')
})
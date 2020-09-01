const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
mongoose.connect('mongodb://localhost/mecha_blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to mecha_blog DB!')).catch(error => console.log(error.message))

let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})

let Blog = mongoose.model('Blog', blogSchema)

// Blog.create({
//     title: 'Gundam Barbatos',
//     image: 'https://images.unsplash.com/photo-1578908638278-2b372050d676?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80',
//     body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet iaculis massa, quis rhoncus massa. Curabitur sollicitudin arcu ipsum, non suscipit risus venenatis eget.'
// }, function(err, data) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log('A data was inserted')
//         console.log(data)
//     }
// })

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

app.get('*', function(req, res) {
    res.send('Ups, i think you lost buddy')
})

app.listen(PORT, function() {
    console.log('mechablog app is running on server')
})
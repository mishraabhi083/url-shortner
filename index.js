const express = require('express')
const path=require('path')
const mongoose = require('mongoose')
const ShortUrl=require('./models/shortUrl')
mongoose.connect('mongodb://localhost/shortUrl', {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const PORT = 5000
app = new express()
app.use(express.static(path.join(__dirname,'bootstrap')))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


app.get('/', async (req, res) => {
    const setup = {
        hostname:req.headers.host
    }
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls ,setup})
})

app.post('/shortUrls/del', async (req, res,next) => {
    const x = await ShortUrl.deleteOne({}, { short: req.body.toDelete })
    
    console.log(x,req.body.toDelete)
    // ShortUrl.findByIdAndDelete(x._id, (err, done) => {
    //     if (error) {
    //         Response.sendStatus(500)
    //     }
    //     else {
    //         res.redirect('/')
    //     }
    // })
    res.redirect('/')
    
})
app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

// app.post('/shortUrls:url', async (req, res) => {
//     await ShortUrl.create({ full: req.body.fullUrl })
//     res.redirect('/')
// })

app.get('/:shortUrl', async (req, res) => {
    const url = await ShortUrl.findOne({ short: req.params.shortUrl })
    // console.log(url)
    if (url == null) {
        return res.sendStatus(404)
    }
    else {
        url.clicks += 1
        url.save()
        res.redirect(url.full)  
    }
    
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`listening on PORT : ${PORT}`)
})


const express = require('express');
const app = express();
const articleRouter = require('./routes/article');
const mongoose = require('mongoose');
const Article = require('./models/article');
const methodOverride = require('method-override');

mongoose.connect("mongodb://localhost/blog",
                  { useNewUrlParser: true, useUnifiedTopology: true,
                  useCreateIndex: true } )

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));


app.get('/', async (req, res) => {
  let articles = await Article.find().sort({createdAt: 'desc'});
  res.render('articles/index', {articles});
})

app.use('/articles', articleRouter);
app.listen(3000);
const express = require('express');
const router = express.Router();
const Article = require('./../models/article');

 
router.get('/new', (req, res) => {
  res.render('articles/new', {article: new Article()});
})

router.get('/:slug', async (req, res) => {
  let article = await Article.findOne({slug: req.params.slug });
  res.render('articles/show', {article: article});
})

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect('/');
})

router.get('/edit/:id', async (req, res) => {
  let article = await Article.findById(req.params.id);
  res.render('articles/edit', {article})
})

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next();
}, saveArticleAndRedirect('edit'))

router.post('/', async (req, res, next) => {
  req.article = await new Article();
  next();
}, saveArticleAndRedirect('new'))

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article 
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try{
      article = await article.save();
      res.redirect(`/articles/${article.slug}`)
    }catch(e) {
      console.log(e);
      res.render(`articles/${path}`, {article: article})
    }
  }
}

module.exports = router;
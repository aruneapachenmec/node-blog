const mongoose = require('mongoose');
const slugify = require('slugify');
const marked = require('marked');
const { JSDOM } = require('jsdom');
const createDomPurify = require('dompurify');
const dompurify = createDomPurify( new JSDOM().window)

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
})

articleSchema.pre('validate', function(next){
  if (this.title) {
    this.slug = slugify(this.title, {strict: true, lower: true})
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }
  next();
})

module.exports = mongoose.model('Article', articleSchema);
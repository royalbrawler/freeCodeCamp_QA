/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict'

const Book = require('../models').Book

module.exports = function (app) {
  app
    .route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}).then((books) => {
        if (!books) {
          res.json([])
        } else {
          const formattedData = books.map((book) => {
            return {
              _id: book._id,
              title: book.title,
              comments: book.comments,
              commentcount: book.comments.length,
            }
          })
          res.json(formattedData)
        }
      })
    })

    .post(function (req, res) {
      let title = req.body.title
      //response will contain new book object including atleast _id and title
      if (!title) {
        return res.send('missing required field title')
      }
      const newBook = new Book({ title, comments: [] })
      newBook
        .save()
        .then((book) => {
          if (book) {
            res.json({ _id: book._id, title: book.title })
          }
        })
        .catch((err) => {
          res.send('there was an error saving')
        })
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({})
        .then((result) => {
          if (result) {
            res.send('complete delete successful')
          }
        })
        .catch((err) => {
          res.send('error')
        })
    })

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid)
        .then((book) => {
          if (!book) {
            res.send('no book exists')
          } else {
            res.json({
              _id: book._id,
              title: book.title,
              comments: book.comments,
              commentcount: book.comments.length,
            })
          }
        })
        .catch((err) => { res.send('no book exists') })
    })

    .post(function (req, res) {
      let bookid = req.params.id
      let comment = req.body.comment
      //json res format same as .get
      if (!comment) {
        return res.send('missing required field comment')
      }
      Book.findById(bookid)
        .then((book) => {
          if (!book) {
            res.send('no book exists')
          } else {
            book.comments.push(comment)
            book.save().then((savedData) => {
              res.json({
                _id: savedData._id,
                title: savedData.title,
                comments: savedData.comments,
                commentcount: savedData.comments.length,
              })
            })
          }
        })
        .catch((err) => { res.send('no book exists') })
    })

    .delete(function (req, res) {
      let bookid = req.params.id
      //if successful response will be 'delete successful'
      Book.findByIdAndRemove(bookid)
        .then((result) => {
          if (!result) {
            res.send('no book exists')
          } else {
            res.send('delete successful')
          }
        })
        .catch((err) => {
          res.send('no book exists')
        })
    })
}

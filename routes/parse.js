
const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer()
const fs = require('fs')
const es = require('event-stream')
const { replaceStringInString, parseInputTextToStrings, createFile, deleteFile } = require('../supporting_functions.js')

/* GET home page. */
router.post('/', upload.single('text'), async function (req, res, next) {
  let file = req.file
  console.log(req.file)

  let input = parseInputTextToStrings(req.body.words)
  await createFile(`./${file.originalname}`, file.buffer)
  let read = fs.createReadStream(`./${file.originalname}`)
  // let write = fs.createWriteStream('./testRedact')

  read.pipe(es.split('.'))
    .pipe(es.map(function (data, cb) {
      let phrases = input.phrases
      let words = input.words
      let improvedData = data
      if (data.length > 1) {
        improvedData = data + '.'
      }
      phrases.forEach(phrase => {
        improvedData = replaceStringInString(improvedData, phrase, 'xxxx')
      })
      words.forEach(word => {
        improvedData = replaceStringInString(improvedData, word, 'xxxx')
      })
      cb(null, improvedData)
    }))
    .pipe(res)

  res.on('finish', async function () {
    await deleteFile(`./${file.originalname}`)
  })
})

module.exports = router

const _ = require('underscore')
const fs = require('fs')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const unlinkFile = util.promisify(fs.unlink)

/** ******************** String Functions ***********************************/
// inputString - string - `String of keywords and phrases: a string of censored keywords and phrases separated by spaces or commas. Phrases will be enclosed in single or double quotes. Some examples: Hello world “Boston Red Sox”‘Pepperoni Pizza’, ‘Cheese Pizza’, beer`
// returns - returns {words: [], phrases: [] }

const parseInputTextToStrings = (inputString) => {
  let singleQuoteMatches = inputString.match(/\'(.*?)\'/g) || []
  let cleanedSingleQuoteMatches = _.map(singleQuoteMatches, string => {
    return string.replace(/'/g, '')
  })
  // remove single sring matches
  let doubleQuoteMatches = inputString.match(/\"(.*?)\"/g) || []
  let cleanedDoubleQuoteMatches = _.map(doubleQuoteMatches, string => {
    return string.replace(/"/g, '')
  })
  // remove double string matches
  let inputStringWithoutPhrases = inputString
  singleQuoteMatches.forEach(phrase => {
    inputStringWithoutPhrases = inputStringWithoutPhrases.replace(phrase, '')
  })
  doubleQuoteMatches.forEach(phrase => {
    inputStringWithoutPhrases = inputStringWithoutPhrases.replace(phrase, '')
  })
  // replace spaces with ,
  let words = inputStringWithoutPhrases.replace(/,/g, ' ').split(' ')
  words = _.filter(words, word => {
    return word !== ''
  })
  let phrases = cleanedSingleQuoteMatches.concat(cleanedDoubleQuoteMatches)
  return {
    words: words,
    phrases: phrases
  }
}
// for a string replaces all instances of a search value with an new value
const replaceStringInString = (textString, searchString, replaceValue) => {
  let re = new RegExp('\\b' + searchString + '\\b', 'g')
  let result = textString.replace(re, replaceValue)
  return result
}
/** *****************File Functions**********************/
const createFile = async (path, fileString) => {
  try {
    await writeFile(path, fileString)
  } catch (e) {
    throw new Error(`writeFile failed with the following error: ${e.message}`)
  }
}

const deleteFile = async (path) => {
  try {
    await unlinkFile(path)
  } catch (e) {
    throw new Error(`deleteFile failed with the following error: ${e.message}`)
  }
}
module.exports = {
  parseInputTextToStrings: parseInputTextToStrings,
  replaceStringInString: replaceStringInString,
  createFile: createFile,
  deleteFile: deleteFile
}

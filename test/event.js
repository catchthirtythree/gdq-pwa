const fs = require('fs')

fs.readFile('test/17.html', (err, schedule) => {
  if (err) throw err

  const lodash = require('lodash')
  const cheerio = require('cheerio')

  const $ = cheerio.load(schedule)

  const eventRow = $('.container h1.text-gdq-red')
  const eventNode = lodash.head(eventRow)
  const eventNodes = eventNode.children
  const textNode = lodash.head(eventNodes)
  const dataNode = textNode.data

  console.log('eventRow', dataNode)
})

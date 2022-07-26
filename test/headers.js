const fs = require('fs')

fs.readFile('test/40.html', (err, schedule) => {
  if (err) throw err

  const lodash = require('lodash')
  const cheerio = require('cheerio')

  const $ = cheerio.load(schedule)

  const headerRow = $('#runTable thead tr td')
  const headers = lodash.reduce(headerRow, (acc, header) => {
    const childNodes = header.children
    const textNodes = lodash.filter(childNodes, { type: 'text' })
    const dataNodes = lodash.map(textNodes, node => node.data)
    const joinedNodes = dataNodes.join(' ')
    const splitAmps = joinedNodes.split('&')
    const cleanedText = lodash.map(splitAmps, text => text.trim())

    return lodash.concat(acc, cleanedText)
  }, [])

  console.log('headers', headers)
})

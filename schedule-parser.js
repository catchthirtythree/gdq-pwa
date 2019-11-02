const lodash = require('lodash')

let getTitle = ($) => {
  const eventRow = $('.container h1.text-gdq-red')
  const eventNode = lodash.head(eventRow)
  const eventNodes = eventNode.children
  const textNode = lodash.head(eventNodes)
  const dataNode = textNode.data
  return dataNode
}

let getHeaders = ($) => {
  const headerRow = $('#runTable thead tr td')
  const headers = lodash.reduce(headerRow, (acc, child) => {
    let childNodes = child.children
    let textNodes = lodash.filter(childNodes, { type: 'text' })
    let dataNodes = textNodes.map(node => node.data)
    let joinedNodes = dataNodes.join(' ')
    let splitAmps = joinedNodes.split('&')
    let cleanedText = lodash.map(splitAmps, text => text.trim())

    return lodash.concat(acc, cleanedText)
  }, [])

  return headers
}

let getRuns = ($) => {
  const bodyRows = $('#runTable tbody tr')
  const rows = lodash.reduce(bodyRows, (acc, row) => {
    const tdNodes = lodash.filter(row.children, { name: 'td' })
    const dataNodes = lodash.map(tdNodes, node => {
      // TODO: Make category and console separate
      const textNodes = lodash.filter(node.children, { type: 'text' })
      const dataNodes = lodash.map(textNodes, node => node.data)
      const joinedNodes = dataNodes.join('')
      return joinedNodes.trim()
    })

    const attrs = row.attribs
    if (lodash.has(attrs, 'class') && attrs.class === 'second-row') {
      const head = lodash.initial(acc)
      const last = lodash.last(acc)

      const keys = ['length', 'category', 'host']
      const run = lodash.zipObject(keys, dataNodes)

      return lodash.concat(head, lodash.assign({}, last, run))
    } else {
      const keys = ['time', 'game', 'runner', 'setup']
      const run = lodash.zipObject(keys, dataNodes)

      return lodash.concat(acc, run)
    }
  }, [])

  return rows
}

module.exports = {
  getTitle, getHeaders, getRuns
}
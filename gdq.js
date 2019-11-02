const lodash = require('lodash')

const host = 'http://www.gamesdonequick.com'

const Schedule = (() => {
  const resource = '/schedule'
  return lodash.assign({
    current: (callback) => request(`${host}${resource}`, callback),
    one: (id, callback) => request(`${host}${resource}/${id}`, callback)
  })
})()

module.exports = {
  Schedule
}
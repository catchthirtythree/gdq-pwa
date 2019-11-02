const scheduleParser = require('./schedule-parser')

const request = require('request')
const cheerio = require('cheerio')

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  return res.sendFile('index.html')
})

app.get('/schedule', (req, res) => {
  return request.get(`http://www.gamesdonequick.com/schedule`, (error, response, body) => {
    if (error) {
      return res.status(404).send(error)
    }

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send(`could not get requested schedule ${id}`)
    }

    const $ = cheerio.load(body)

    return res.status(200).json(scheduleParse.buildResponse($))
  })
})

app.get('/schedule/:id', (req, res) => {
  let id = req.params.id
  if (id < 17) {
    return res.status(404).send(`no exist ${id}`)
  }

  return request.get(`http://www.gamesdonequick.com/schedule/${id}`, (error, response, body) => {
    if (error) {
      return res.status(404).send(error)
    }

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send(`could not get requested schedule ${id}`)
    }

    const $ = cheerio.load(body)

    return res.status(200).json(scheduleParse.buildResponse($))
  })
})

app.listen(port, () => {
  console.log(`server started listening on port ${port}`)
})

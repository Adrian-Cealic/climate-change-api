const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express() // start express
const newsPapers = [
    {
        name: "climatechangenews",
        address: 'https://www.climatechangenews.com/',
        base: ''
    },
    {
        name: "guardian",
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: 'https://www.theguardian.com'
    },
    {
        name: "skynews",
        address: 'https://news.sky.com/climate',
        base: 'https://news.sky.com/'
    },
    {
        name: "bbc",
        address: 'https://www.bbc.com/news/science_and_environment',
        base: 'https://www.bbc.com'
    },
    {
        name: "nytimes",
        address: 'https://www.nytimes.com/section/climate',
        base: 'https://www.nytimes.com'
    },
    {
        name: "npr",
        address: 'https://www.npr.org/sections/climate/',
        base: 'https://www.npr.org'
    },
    {
        name: "bloomberg",
        address: 'https://www.bloomberg.com/green',
        base: 'https://www.bloomberg.com'
    },

]

const articles = []

newsPapers.forEach(newspaper => {
    axios.get(newspaper.address).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })
        })

    })
})

app.get('/', (req, res) => {
    res.json("Welcome to my climate change news api")
})
app.get('/news', (req, res) => {
    res.json(articles);
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId
    const newspaperAdress = newsPapers.filter(newspaper => newspaper.name === newspaperId)[0].address
    const newspaperBase = newsPapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAdress).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href');
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))

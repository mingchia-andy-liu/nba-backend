const CronJob = require('cron').CronJob;
const format = require('date-fns/format')
const addDays = require('date-fns/add_days')
const parse = require('date-fns/parse')
const fetch = require("node-fetch")

const query = require('./google')
const Video = require('../models/video')

const delay = ms => new Promise(r => setTimeout(r, ms))

const formatSearchQuery = (htc, htn, vtc, vtn, date) => {
    const gameDate = parse(date, 'YYYYMMDD', new Date())
    return `${htc} ${htn} vs ${vtc} ${vtn} Full Game Highlights / ${format(gameDate, 'MMMM DD')} / 2017-18 NBA Season`
}

let result = new Date('2018-03-29')
// read cron patterns at http://crontab.org/
const job = new CronJob('* * * * *', async () => {
    // should look up vids and insert to mysql
    dateStr = format(result, 'YYYYMMDD')


    let daily = []
    try {
        const url = `https://data.nba.com/data/5s/json/cms/noseason/scoreboard/${dateStr}/games.json`
        console.log(url)
        const res = await fetch(url)
        const { sports_content: { games: { game } } } = await res.json()
        daily = game
    } catch (error) {
        console.log('error when fetching NBA', error)
    }

    console.log('dailys\' length', daily.length)

    // if you use forEach with async, you cannot wait on it, gets thrown away.
    // Use Promise.all() to wait on all of them
    const v = new Video()
    await Promise.all(daily.map(async (game) => {
        const vid = await v.FindVideoByGid(game.id)
        if (vid == null || vid.length === 0) {
            const {
                date,
                home: {
                    city: htc,
                    team_code: htn,
                },
                visitor: {
                    city: vtc,
                    team_code: vtn,
                }
            } = game
            const queryTerm = formatSearchQuery(htc, htn, vtc, vtn, date)
            // console.log('queryTerm ', queryTerm)
            const data = await query(queryTerm)
            if (data && data.items && data.items.length !== 0) {
                const item = data.items[0]
                const { id: {videoId}, snippet: {title}} = item
                if (title.includes(format(result, 'MMMM DD')) &&
                    title.includes(htc) &&
                    title.includes(vtc)) {
                        console.log('FOUND: ')
                        await v.InsertVideoIdByGid(game.id, videoId)
                        console.log('INSERT COMPLELE')
                } else {
                    // console.log('MISMATCH: \n\n', title, '\n', queryTerm)
                }
            } else {
                // console.log('MISSING: ')
            }
        } else {
            // console.log('FOUND THE VID in DB: ', game.id)
        }
    }))
    addDays(result, -1)
    console.log('END OF JOB, decrement the date')
})

// Start the job
job.start();

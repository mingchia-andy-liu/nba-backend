const CronJob = require('cron').CronJob;
const format = require('date-fns/format')
const addDays = require('date-fns/add_days')
const parse = require('date-fns/parse')
const fetch = require("node-fetch")

const query = require('./google')
const Video = require('../models/video')

const formatSearchQuery = (htc, htn, vtc, vtn, date) => {
    const gameDate = parse(date, 'YYYYMMDD', new Date())
    return `${htc} ${htn} vs ${vtc} ${vtn} Full Game Highlights / ${format(gameDate, 'MMMM DD')} / 2017-18 NBA Season`
}

// read cron patterns at http://crontab.org/
// Cron jobs: At minute 0, past every hour from 16 through 23.
// timezone: PST (America/Los_Angeles) and it will get ran on start
const job = new CronJob('0 0 16-23 * * *', async () => {
    // should look up vids and insert to mysql
    const today = new Date()
    dateStr = format(today, 'YYYYMMDD')

    let daily = []
    try {
        const url = `https://data.nba.com/data/5s/json/cms/noseason/scoreboard/${dateStr}/games.json`
        const res = await fetch(url)
        const { sports_content: { games: { game } } } = await res.json()
        daily = game
    } catch (error) {
        console.debug(`error when fetching NBA on ${dateStr}`, error)
    }

    // if you use forEach with async, you cannot wait on it, gets thrown away.
    // Use Promise.all() to wait on all of them
    const v = new Video()
    await Promise.all(daily.map(async (game) => {
        const vid = await v.FindVideoByGid(game.id)
        if (vid == null || vid.length === 0) {
            // video id is not in DB, search then insert
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
            const data = await query(queryTerm)

            if (data && data.items && data.items.length !== 0) {
                // find the highlight
                const item = data.items[0]
                const { id: {videoId}, snippet: {title}} = item
                if ((title.includes(format(today, 'MMMM D')) ||
                        title.includes(format(today, 'MMM D'))) &&
                    title.includes(htc) &&
                    title.includes(vtc)) {
                        // only insert if the first search result is almost what we look for
                        await v.InsertVideoIdByGid(game.id, videoId)
                }
            }
        }
    }))
}, null, true, 'America/Los_Angeles')

// Start the job
job.start();

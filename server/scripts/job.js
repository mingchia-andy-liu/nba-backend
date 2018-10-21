const CronJob = require('cron').CronJob;
const moment = require('moment-timezone')
const fetch = require("node-fetch")

const query = require('./google')
const Video = require('../models/video')
const DimensionDate = require('../models/date')

const DATE_FORMAT = 'YYYYMMDD'

const formatSearchQuery = (htc, htn, vtc, vtn, date) => {
    const momentObj = moment(date)
    return `${htc} ${htn} vs ${vtc} ${vtn} Full Game Highlights ${momentObj.format('MM.DD.YYYY')} | NBA Season`
}

const apiDate = () => {
    const ET = moment.tz(new Date(), 'America/New_York')
    const EThour = moment(ET).format('HH')
    let res
    // if ET time has not pass 6 am, don't jump ahead
    if (+EThour < 6) {
        res = moment(ET).subtract(1, 'day').format(DATE_FORMAT)
    } else {
        res = ET.format(DATE_FORMAT)
    }
    return moment(res, DATE_FORMAT)
}

// read cron patterns at http://crontab.org/
// At minute 0 past every hour from 0 through 3 and every hour from 18 through 23.
// timezone: ET (America/New_York) and it will get ran on start
const job = new CronJob('0 0-3,18-23 * * *', async () => {
    // should look up if date is complete,
    // if not, look up vids and insert to mysql
    const dimensionDate = new DimensionDate()
    let isComplete = false

    let startDate = moment('2018-10-16').tz('America/New_York')
    const endDate = apiDate()

    for (;moment(startDate).isSameOrBefore(endDate);startDate = moment(startDate).add(1, 'day')) {
        const dateStr = moment(startDate).format(DATE_FORMAT)
        isComplete = await dimensionDate.isCompleteByDate(dateStr)
        if (isComplete) {
            continue
        }

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
            // if game hasn't start early return
            if (!(game && game.period_time && game.period_time.game_status === '3')) {
                return
            }
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
                    const {id: {videoId}, snippet: {title}} = item
                    if (title.includes(startDate.format('MM.DD.YYYY')) &&
                        title.includes(htc) &&
                        title.includes(vtc) &&
                        title.includes('Full')) {
                        // only insert if the first search result is almost what we look for
                        await v.InsertVideoIdByGid(game.id, videoId)
                    }
                }
            }
        }))
        .then(() => {
            // Mark the date as completed if date is at least a day before api date
            if (moment(startDate).isBefore(endDate)) {
                dimensionDate.completeDate(dateStr)
            }
        })
        .catch(() => {
            console.debug('Error: searching video id failed')
        })
    }
}, null, true, 'America/New_York')

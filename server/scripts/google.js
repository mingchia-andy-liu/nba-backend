const {google} = require('googleapis');
const addDays = require('date-fns/add_days')

const keys = require('../config/keys')

// Each API may support multiple version, and using an API key to authenticate.
const youtube = google.youtube({
    version: 'v3',
    auth: keys.youtubeKey,
})

// a very simple example of searching for youtube videos
async function query (term) {
    try {
        const res = await youtube.search.list({
            channelId: 'UCoh_z6QB0AGB1oxWufvbDUg',
            part: 'snippet',
            q: term,
        });
        return res.data
    } catch (error) {
        return null
    }
}

module.exports = query

const {google} = require('googleapis');

const keys = require('../config/keys')

// Each API may support multiple version, and using an API key to authenticate.
const youtube = google.youtube({
    version: 'v3',
    auth: keys.youtubeKey,
})

/**
 * a function to search video base on the given serach term on MLG channel
 * @param {string} term
 */
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

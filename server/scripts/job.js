const CronJob = require('cron').CronJob;

// read cron patterns at http://crontab.org/
const job = new CronJob('* * * * * *', () => {
    // should look up vids and insert to mysql
    const d = new Date()
    console.log('Every second', d.toISOString());
});
// Start the job
job.start();

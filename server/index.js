const path = require('path');
const { createApp } = require('./app');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const { app } = createApp(path.join(DATA_DIR, 'leaderboard.db'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`mathema-api listening on :${port}`));

const express = require('express');
const cors = require('cors');
const _ = require('lodash');
const { dataGame } = require('./utils/data');
const router = require('./routes');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// app.use('/test', express.static('public'));
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
   res.render('index');
});

app.use('/api', router);

app.get('/*', (req, res) => {
   res.status(404).json({ error: 'Kembalilah ke jalan yang benar' });
});

app.listen(port, () => {
   console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;

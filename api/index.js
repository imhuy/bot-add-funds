require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const url = 'https://api.telegram.org/bot';
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const moment = require('moment');


app.get('/', async function (req, res) {

    res.send(`Welcome to CRON server ${process.env.BOT_TOKEN}`);
});

app.post('/', async function (req, res) {

    let message = req?.body?.message?.text;

    if (!message) {
        return res.send('Invalid message')
    }
    let payId = message?.split('/')[0];

    let payAmount = message?.split('/')[1];
    payAmount = Number(payAmount);

    if (!payId || !payAmount) {
        console.log('Invalid payId or payAmount')
        return res.send('Invalid payId or payAmount')
    }

    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Authorization", process.env.TOKEN);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "content": payId.toUpperCase(),
        "amount": payAmount
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    let addfunds = await fetch("http://14.225.210.125/api/payments/add-amount", requestOptions)
    let response = await addfunds.json();

    await axios.post(`${url}${process.env.BOT_TOKEN}/sendMessage`,
        {
            chat_id: process.env.CHAT_ID,
            text: response?.message ? response.message : 'Nạp tiền không thành công',
        })

    res.send(`Welcome to CRON server ${process.env.BOT_TOKEN}`);
});




app.listen(8000, () => console.log('Server ready on port 8000.'));

module.exports = app;

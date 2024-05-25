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
    let payId = message?.split('/')[0];

    let payAmount = message?.split('/')[1];
    if (!payId) console.log('Invalid payId')
    if (!payAmount) console.log('Invalid payAmount')
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
            text: response.message,
        })

    res.send(`Welcome to CRON server ${process.env.BOT_TOKEN}`);
});


app.post('/cronjob', async (req, res) => {

    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("accept-language", "en-US,en;q=0.9");
    myHeaders.append("authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IlNNSVhJUEdOQzNPRUxTUURQTkxHREVKUkpMWjlQTUJZT1NWWUtUUE8iLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiIzYTA5YWYyNy0wYzdhLWJkMGItODUwMi0yYjlhMTY4YWQ3ZmYiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWJwLmlvIiwicm9sZSI6ImFkbWluIiwiZ2l2ZW5fbmFtZSI6ImFkbWluIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjoiRmFsc2UiLCJlbWFpbF92ZXJpZmllZCI6IkZhbHNlIiwidW5pcXVlX25hbWUiOiJhZG1pbiIsIm9pX3Byc3QiOiJBbHBoYVF1ZXN0X0FwcCIsImNsaWVudF9pZCI6IkFscGhhUXVlc3RfQXBwIiwib2lfdGtuX2lkIjoiM2ExMTg2OWQtZjVhMC0zMDhlLWQzZjEtMzMyZDJkOTkzODUwIiwiYXVkIjoiQWxwaGFRdWVzdCIsInNjb3BlIjoiQWxwaGFRdWVzdCIsImp0aSI6IjlmOTVkMTViLTJiY2UtNGU1MC1iOWM2LWIzZmI1YzFiM2EyZiIsImV4cCI6MTcxMzk0MjU1NCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzNjEvIiwiaWF0IjoxNzExMzUwNTU0fQ.Vgt3baWpZuDOr5yWRUkIdKz9dmOldMJrOx7JOZm4pklHIaCLaf85cDUaRRSWTZteX1L86UzKrcvF4WuGfP1jVWxbrQ_zzD0Af7OxItXOo4upG0Jw9S1KRrvIJpG4kvd51oaFf3BivF_FqBxprfjEapE1nlZb29lyNzvswUxOLlmreLCfz4wdJWqHxXshuu6mgQ7goqEK2iITqO9oQa6hjc8CynfippH7xMuSyHorZnc4-dQXEz9a2JeC2nYseNA9E97PH_2Sx6bT143lwL01g7kHxhYqqZcoETuy7oES90OJupmLGC87hAv4fvz-LVO4m6g9eVtAUAkAfKIJ179f6g");
    myHeaders.append("origin", "https://app.alphaquest.io");
    myHeaders.append("referer", "https://app.alphaquest.io/");
    myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"");
    myHeaders.append("sec-ch-ua-mobile", "?0");

    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-site", "same-site");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    let data = await fetch("https://api.alphaquest.io/api/app/twitter?pageNumber=1&pageSize=10&sortBy=SCORE&timeFrame=1D&newest=false", requestOptions)
    let response = await data.json();


    const generateChain = (data) => {
        if (data?.name == undefined) return 'No Chain Found'
        return data?.name
    }

    const generateCategory = (data) => {
        // if (data?.name == undefined) return 'No Chain Found'

        if (data == null) return 'No Category Found'
        return data.map((item) => item.name)

        // return `Category:  `
    }

    let message = response.items.map((item, i) => {
        let data = `<b> ${i + 1}:</b>  <b>${item.name}</b><code>: followersCount: ${item.followersCount}| score: ${item.trendingScore}| Chain: ${generateChain(item?.chain)}| Category: ${generateCategory(item?.categories)} </code>\n <b>Created At: ${moment(item?.createdAt).format('MM/DD/YYYY')}</b> <a href="${item.twitterUrl}">Twitter URL</a>\n\n`;
        return data;

    });

    let r = await axios.post(`${url}${process.env.BOT_TOKEN}/sendMessage`,
        {
            chat_id: process.env.CHAT_ID,
            text: `<b>Top 10 Project Twitter Trending Today</b> \n\n${message.join('')}`,
            parse_mode: 'HTML',
        })
    res.send(`Welcome to CRON server ${process.env.BOT_TOKEN}`);

});

app.listen(8000, () => console.log('Server ready on port 8000.'));

module.exports = app;

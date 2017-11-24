# HODL

Joe Thomas' cool hodling contest to see if anyone can beat the BTC return rate.

## To run your own instance
Make sure you have the latest versions of [Node.JS and NPM installed](https://nodejs.org/en/download/), and execute the following:

```
git clone https://github.com/joe-tom/hodl
cd hodl
npm install
npm start
```

Boom, it's that easy

## FAQ
### Where does the data come from?
Any realtime data comes from the CoinMarketCap API. The inital 30 day sync data uses the CyrptoCompare Historical API.
### Why are you doing this?
It's fun.
### I noticed you're using CoinHive Recaptcha? Are you using my computer to generate Monero??
Yes, it's to prevent spam, all individual data is held in RAM and that cannot be allowed to overflow. Any nanoMonero generated will be kept by me.

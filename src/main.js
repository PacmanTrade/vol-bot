import xeggexApi from './xeggexApi.js'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { v4 as uuidv4 } from 'uuid';
import Big from 'big.js';
import { onShutdown } from "node-graceful-shutdown";
import process from 'process';
import fs from 'fs';

const argv = yargs(hideBin(process.argv)).argv


const opts = {
    //apiKey: argv.apiKey,            	/// API key
    //apiSecret: argv.apiSecret,      	/// API secret
	sessionKey: argv.sessionKey,
    base: argv.base,                	/// Base asset to use e.g. BTC for BTC_ETH
    stock: argv.stock,               	/// Stock to use e.g. ETH for BTC_ETH
	volume: parseFloat(argv.volume)
}

// Get the command line args and save into opts
Object.keys(opts).forEach(key => {
    if (opts[key] === undefined) {
        console.log(`
            ${key} must be passed into the program
            e.g. node . run --${key}=<value>
            `)
        process.exit(1);
    }
});

console.log(
    `
        Running market maker with the following options;
        Base Asset: ${opts.base}
        Stock Asset: ${opts.stock}
        Volume: ${opts.volume}
    `)

console.log(opts.stock + '_' + opts.base + " process id is " + process.pid);

fs.writeFileSync("./pidfiles/" + opts.stock + "_" + opts.base + ".pid", process.pid.toString());

const restapi = new xeggexApi(opts.sessionKey);

console.log('start first del');
async function firstDel()
{
		try {
			var orders = [];
            orders = await restapi.getUserOrders(opts.stock + '/' + opts.base, 0, 1000);
            console.log(orders.length)
            for (var i = 0; i < orders.length; i++)
            {
                
            	var orderCur = orders[i];
            	var orderCurId = orderCur.orderId;
            	var res = await restapi.cancelOrder(orderCurId);
            }
			//await restapi.cancelAllOrders(opts.stock + '/' + opts.base, 'all');
		} catch (e) {
			console.log(e);
		}
	
        console.log('Cancel open orders');
}
firstDel();
console.log('end first del');


var lastPrice = 0;
var lastCheckTime = Date.now(); // ms

runIt();

// On Shutdown - Cancel open orders
process.on('SIGTERM', async function () {

  return new Promise((resolve, reject) => {

    (async () => {

	  firstDel();
      
      fs.unlinkSync("./pidfiles/" + opts.stock + "_" + opts.base + ".pid");

	  console.log('Remove PID file');
	  
	  process.exit;
	  
      resolve(true);
				
    })();
			
  });
	
});


async function runIt()
{

	await recalculate_and_enter();
    var randTime = Math.ceil(Math.random() * 40 - 20) * 1000;
	setTimeout(function() {
	
		runIt();
	
	}, 60000 + randTime);


}


// Enter a buy order with n% from account (y/2)% away from the last price
// Enter a sell order with n% from accoutn (y/2)% away from the last price

async function recalculate_and_enter(heavyside = null) {

	console.log('recalulate and enter');
	
	var orderVol = Math.ceil(opts.volume / 24 / 60);
	var randVol = Math.ceil(Math.random() * orderVol - (orderVol / 2));
    orderVol = orderVol + randVol;

    var htrades = [];

    try {
    	htrades = await restapi.getTradeHistorySince(opts.stock + '/' + opts.base, 1);
	} catch (e) {
		console.log(e);
	}

	if (htrades.length > 0)
	{

		lastCheckTime = Date.now(); // ms

		lastPrice = parseFloat(htrades[0].price);

		// Check current spread

		var marketInfo = await restapi.getOrderBookBySymbol(opts.stock + '/' + opts.base);

		if (marketInfo.ask.items[0].price && marketInfo.bid.items[0].price)
		{

			var bestbid = marketInfo.bid.items[0].price;
			var bestask = marketInfo.ask.items[0].price;
			console.log(bestbid);
			console.log(bestask);

			lastPrice = ((bestask + bestbid) / 2).toFixed(10);

		}

		// end spread check

		//var stock_balances = [];
		//var base_balances = [];

		try {
			//account_info = await restapi.getBalances();
			var stock_balance = await restapi.getUnitBalances(opts.stock);
			var base_balance = await restapi.getUnitBalances(opts.base);
		} catch (e) {
			console.log(e);
		}

		//var balances = {};
		//for (let i = 0; i < stock_balances.length; i++)
		//{
		//	var thisitem = stock_balances[i];
		//	if (typeof parseFloat(thisitem.balance) === 'number' && isFinite(parseFloat(thisitem.balance)) && parseFloat(thisitem.balance) > 0.0000001)
		//	{
		//	    balances[thisitem.unit] = parseFloat(balances[thisitem.unit]) + parseFloat(thisitem.balance);
		//	}
		//}
		//for (let i = 0; i < base_balances.length; i++)
		//{
        //    
		//	var thisitem = base_balances[i];
		//	if (typeof parseFloat(thisitem.balance) === 'number' && isFinite(parseFloat(thisitem.balance)) && parseFloat(thisitem.balance) > 0.0000001)
		//	{
		//	    balances[thisitem.unit] = parseFloat(balances[thisitem.unit]) + parseFloat(thisitem.balance);
		//	}
		//}
		//console.log(balances["PWR"]);
		//console.log(balances["USDT"]);
//
		//let base_balance = parseFloat(balances[opts.base]);
		//let stock_balance = parseFloat(balances[opts.stock]);
		console.log(base_balance)
		console.log(stock_balance)
		try {
			//var orderinfo = await restapi.createLimitOrder(opts.stock + '/' +  opts.base, 'sell', thistrade.quantity, newprice, uuid);
			var orderinfo = await restapi.createLimitOrder(opts.stock + '/' +  opts.base, lastPrice, orderVol, 'BUY', 'LIMIT_PRICE', 0);
			console.log(orderinfo);
		} catch (e) {
			console.log(e);
		}
		try {
			//var orderinfo = await restapi.createLimitOrder(opts.stock + '/' +  opts.base, 'sell', thistrade.quantity, newprice, uuid);
			var orderinfo = await restapi.createLimitOrder(opts.stock + '/' +  opts.base, lastPrice, orderVol, 'SELL', 'LIMIT_PRICE', 0);
			console.log(orderinfo);
		} catch (e) {
			console.log(e);
		}

		console.log(
			`
			Making order every 1 min:
				1 order: ${orderVol} ${opts.stock}, price: ${lastPrice} ${opts.base}
				All volume orders (${opts.stock}): ${opts.volume}
			`)


    }
    else
    {

    	console.log('Error, no historical trades to base pricing from');


    }
    
    return true;

}


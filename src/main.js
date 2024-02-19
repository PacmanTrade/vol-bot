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
	sessionKey: argv.sessionKey,		/// Bot Session Key (pacman.trade)
    spread: argv.spread / 100,      	/// Spread to maintain
    baseexposure: argv.baseexposure / 100,  /// Amount of base account to have exposed at a given time
    stockexposure: argv.stockexposure / 100,  /// Amount of stock account to have exposed at a given time
    basemax: argv.basemax,                	/// Max Qty can use for base exposure
    stockmax: argv.stockmax,               	/// Max Qty can use for stock exposre
    base: argv.base,                	/// Base asset to use e.g. BTC for BTC_ETH
    stock: argv.stock,               	/// Stock to use e.g. ETH for BTC_ETH
    numorders: parseInt(argv.numorders)	/// Number of orders per side
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
        Spread: ${opts.spread}
        Base Exposure: ${opts.baseexposure}
        Stock Exposure: ${opts.stockexposure}
        Base Max: ${opts.basemax}
        Stock Max: ${opts.stockmax}
        Base Asset: ${opts.base}
        Stock Asset: ${opts.stock}
        NumOrders: ${opts.numorders}
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
var is_initialised = false;
var rebalancing = false;
var lastTradeSide = null;
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

	if (!is_initialised) {
	  await recalculate_and_enter();
	  is_initialised = true;
	}

	// Get last trade
	var apiresp = [];
	
	try {
   		apiresp = await restapi.getTradeHistorySince(opts.stock + '/' + opts.base);
	} catch (e) {
		console.log(e);
	}
	
	for (let t = 0; t < apiresp.length; t++)
	{
	
		var thistrade = apiresp[t];
	
		// A Trade Has Occurred

		lastTradeSide = thistrade.direction;
		lastPrice = parseFloat(thistrade.price);
		lastCheckTime = parseInt(thistrade.time);
		
		if (lastTradeSide == 'BUY') // we need to sell
		{

			//let uuid = uuidv4();

    		var newprice = (lastPrice + (lastPrice * (opts.spread / 2))).toFixed(10);

			try {
    			//var orderinfo = await restapi.createLimitOrder(opts.stock + '/' +  opts.base, 'sell', thistrade.quantity, newprice, uuid);
				var orderinfo = await restapi.createLimitOrder(opts.stock + '/' +  opts.base, newprice, thistrade.amount, 'SELL', 'LIMIT_PRICE', 0);
				console.log(orderinfo);
			} catch (e) {
				console.log(e);
			}

		}
		else // we need to buy
		{

			//let uuid = uuidv4();

    		var newprice = (lastPrice - (lastPrice * (opts.spread / 2))).toFixed(10);

			try {
    			//var orderinfo = await restapi.createLimitOrder(opts.stock + '/' +  opts.base, 'buy', thistrade.quantity, newprice, uuid);
				var orderinfo = await restapi.createLimitOrder(opts.stock + '/' +  opts.base, newprice, thistrade.amount, 'BUY', 'LIMIT_PRICE', 0);
				console.log(orderinfo);
			} catch (e) {
				console.log(e);
			}

		}

	}

	// Check open orders, if one side has less than half of original specification, then we are out of balance and need to recalculate
	
	var openordersbuy = [];
	var openorderssell = [];
	
	try {
		openordersbuy = await restapi.getOpenBuyOrders(opts.stock + '/' +  opts.base);
		openorderssell = await restapi.getOpenSellOrders(opts.stock + '/' +  opts.base);
	} catch (e) {
		console.log(e);
	}
			
	var buycount = openordersbuy.length;
	var sellcount = openorderssell.length;
	
	// for (let i = 0; i < openorders.length; i++)
	// {
	//
	// 	if (openorders[i].side == 'buy') buycount++;
	// 	else sellcount++;
	//
	// }

	if (buycount < opts.numorders/2 || sellcount < opts.numorders/2)
	{
	
		var heavyside = 'BUY';
		if (buycount < opts.numorders/2) heavyside = 'SELL';
	
		// Rebuild
		try {
			var orders = []
			orders = await restapi.getUserOrders(opts.stock + '/' + opts.base, 0, 1000);
			for (var i = 0; i < orders.length; i++)
			{
				var orderCur = orders[i];
				var orderCurId = orderCur.orderId;
				await restapi.cancelOrder(orderCurId);
			}
		} catch (e) {
			console.log(e);
		}
		
		await recalculate_and_enter(heavyside);
		
	}

	setTimeout(function() {
	
		runIt();
	
	},30000);


}


// Enter a buy order with n% from account (y/2)% away from the last price
// Enter a sell order with n% from accoutn (y/2)% away from the last price

async function recalculate_and_enter(heavyside = null) {

	console.log('recalulate and enter');

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

			if (Big(lastPrice).gte(bestask) || Big(lastPrice).lte(bestbid))
			{

				lastPrice = Big(bestask).plus(bestbid).div(2).toFixed(10);

			}

		}

		// end spread check

		//var stock_balances = [];
		//var base_balances = [];

		try {
			//account_info = await restapi.getBalances();
			var stock_balance = await restapi.getUnitBalances(opts.stock);
			var base_balance = await restapi.getUnitBalances(opts.base);
			console.log(typeof(stock_balance))
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

		let sell_price = null;
		let buy_price = null;
		
		console.log('LP: ' + lastPrice)
		console.log('OS: ' + opts.spread)

		sell_price = (parseFloat(lastPrice) + (parseFloat(lastPrice) * (parseFloat(opts.spread) / 2))).toFixed(10);
		console.log(sell_price);
		buy_price = (parseFloat(lastPrice) - (parseFloat(lastPrice) * (parseFloat(opts.spread) / 2))).toFixed(10);

		let quantity_stock = (parseFloat(stock_balance) * parseFloat(opts.stockexposure) / parseFloat(opts.numorders)).toFixed(3);
		let quantity_base = ((parseFloat(base_balance) * parseFloat(opts.baseexposure) / parseFloat(opts.numorders))/parseFloat(buy_price)).toFixed(3);

		if (parseFloat(stock_balance) * parseFloat(opts.stockexposure) > parseFloat(opts.stockmax))
		{
			quantity_stock = (parseFloat(opts.stockmax) / parseFloat(opts.numorders)).toFixed(3);
		}

		if (parseFloat(base_balance) * parseFloat(opts.baseexposure) > parseFloat(opts.basemax))
		{
			quantity_base = ((parseFloat(opts.basemax) / parseFloat(opts.numorders))/parseFloat(buy_price)).toFixed(3);
		}

		console.log(
			`
			Entering orders:
				Buy amount (${opts.stock}): ${quantity_base}
				Buy price (${opts.base}): ${buy_price}

				Sell amount (${opts.stock}): ${quantity_stock}
				Sell price (${opts.base}): ${sell_price}

				Last Price: ${lastPrice}

				Num Orders: ${opts.numorders}
			`)



		var slidermin = parseInt(opts.numorders / 2) - opts.numorders;

		for (const side of ["buy", "sell"]) {

		  var adjstart = slidermin;

		  for (let i = 0; i < opts.numorders; i++)
		  {

			let uuid = uuidv4();

			var slidequantity = 0;

			if (side === "BUY")
			{

				var adjust = Big(quantity_base).times(adjstart).div(opts.numorders).toFixed(8);

				if (heavyside == 'BUY')
				{

					let heavyOrders = Big(opts.numorders).times(0.80);

					adjust = Big(quantity_base).times(adjstart).div(heavyOrders).toFixed(8);

				}

				slidequantity = Big(quantity_base).plus(adjust).toFixed(8);

			}
			else
			{

				var adjust = Big(quantity_stock).times(adjstart).div(opts.numorders).toFixed(8);

				if (heavyside == 'SELL')
				{

					let heavyOrders = Big(opts.numorders).times(0.80);

					adjust = Big(quantity_stock).times(adjstart).div(heavyOrders).toFixed(8);

				}

				slidequantity = Big(quantity_stock).plus(adjust).toFixed(8);

			}

			adjstart = adjstart + 1;

			try {
				//var orderinfo = await restapi.createLimitOrder(opts.stock + '/' +  opts.base, side, slidequantity, side === "buy" ? buy_price : sell_price, uuid);
				var orderinfo = await restapi.createLimitOrder(opts.stock + '/' +  opts.base, side === 'BUY' ? buy_price : sell_price, slidequantity, side, 'LIMIT_PRICE', 0);
				console.log(orderinfo);
			} catch (e) {
				console.log(e);
			}

			if (side == 'BUY')
			{
				buy_price = (parseFloat(buy_price) - (parseFloat(buy_price) * (opts.spread / 2))).toFixed(10);
			}
			else
			{
				sell_price = (parseFloat(sell_price) + (parseFloat(sell_price) * (opts.spread / 2))).toFixed(10);
			}

		  }

		}

    }
    else
    {

    	console.log('Error, no historical trades to base pricing from');


    }
    
    return true;

}


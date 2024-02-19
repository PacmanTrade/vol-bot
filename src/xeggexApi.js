/*
	Xeggex API Class for NodeJS
	version: 0.1.1
*/

import got from 'got';
import Big from 'big.js';
	
class xeggexApi {
		
	constructor(sessionKey, apiKey = null, apiSecret = null, apiURL)
	{
		if (apiURL === void 0)
			this.apiURL = 'https://api.pacman.trade/';
		else
			this.apiURL = apiURL;

        this.options = {
            prefixUrl: this.apiURL,
            headers: {
                Cookie: 'SESSION=' + sessionKey + '; rememberMe=AIQmKdWPah4QanPHifL7Y6RSIJ9rlOLdyjc9WKK55x4vwaXbXDQawmy34yPSbccMci52s67g3BZsBl4+2s8/BPjfsz8HftlQPF5vST0ycGhTa6PlCHwUNfrjSkkwaK+zMjrj6LFM3DlyXViNFZD1SduNyevf4+6QeFacewA4oBVGIJ7NdM3EEHfQizp8sIGHT/saxzsX8Z29fwKHxcUAOnaM9+hdiPIs3ciGJXyGoF5abQvxa0v9I1KY4KBC5g+8plCiW2N18k8nSi1y1Ms0BFLa5q/BDnIfmT3PuS9c/XioMPOUbc5F5p54GYBrzlX7jclqhdAakqtj9P0gkqayXFm6EFEWYjXCZ3hHMQ8mK69D3T+KOfI3lyySqgQg052OxtLw7xN+s46yrYDiUkqIPEeYwe9mp+6ru4pa5URYthU6+2Xsh2KHjG/85PsZT7q6i2b6cx3gHeVlgqYI4M0Q2jhDuD0ys1y1mHOF/WDQNccIqu8ON9JeydTnPv7hAoBW+BatDpG/eqCgS5IxIVn+jfzFB/Giy8vrD36Vjj4WWgR4',
            }
        };
		
		return this;
	}

    // getHistoricalTrades(ticker, limit)
    // {
    //
    //     return new Promise((resolve, reject) => {
    //
    //     	(async () => {
    //
	// 			try {
    //         		const response = await got.get(`historical_trades?ticker_id=${ticker}&limit=${limit}`, this.options).json();
	// 				resolve(response);
	// 			} catch (e) {
    //                 reject(e);
    //             }
    //
    //         })();
    //
    //     });
    //
    // }
    
    getMarkets()
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
            		const response = await got.get('market/getlist', this.options).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }

    getMarket(symbol)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {
        	
        		const encodedSymbol = encodeURIComponent(symbol);


				try {
            		const response = await got.get('market/getbysymbol/' + encodedSymbol, this.options).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }

    getMarketById(marketId)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
            		const response = await got.get('market/getbyid/' + marketId, this.options).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }
    
    getAssets()
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
            		const response = await got.get('asset/getlist', this.options).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }

    getAsset(ticker)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {
        	
        		const encodedTicker = encodeURIComponent(ticker);


				try {
            		const response = await got.get('asset/getbyticker/' + encodedTicker, this.options).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }

    getAssetById(assetId)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
            		const response = await got.get('asset/getbyid/' + assetId, this.options).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }
    
    getOrderBookBySymbol(symbol)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {
        	
        		const encodedSymbol = encodeURIComponent(symbol);


				try {
            		const response = await got.post('market/exchange-plate-full?symbol=' + symbol, {...this.options}).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }

    getOrderBookByMarketId(marketId)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
            		const response = await got.get('market/getorderbookbymarketid/' + marketId, this.options).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }
    
    getUnitBalances(unit)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
            		const response = await got.post('uc/asset/wallet/' + unit, {...this.options}).json();
					resolve(response.data.balance);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }	

    getOpenBuyOrders(symbol, limit = 50, skip = 0)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
        			if (symbol == null) symbol = '';
					limit = parseInt(limit);
					skip = parseInt(skip);
				
            		const response = await got.post('market/exchange-plate-full?symbol=' + symbol, {...this.options}).json();
					resolve(response.bid.items);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }
    
    getOpenSellOrders(symbol, limit = 50, skip = 0)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
        			if (symbol == null) symbol = '';
					limit = parseInt(limit);
					skip = parseInt(skip);
				
            		const response = await got.post('market/exchange-plate-full?symbol=' + symbol, {...this.options}).json();
					resolve(response.ask.items);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }	
    
    getFilledOrders(symbol, limit = 50, skip = 0)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
        			if (symbol == null) symbol = '';
					limit = parseInt(limit);
					skip = parseInt(skip);
				
            		const response = await got.get(`getorders?status=filled&symbol=${symbol}&limit=${limit}&skip=${skip}`, this.options).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }	

    getCancelledOrders(symbol, limit = 50, skip = 0)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
        			if (symbol == null) symbol = '';
					limit = parseInt(limit);
					skip = parseInt(skip);
				
            		const response = await got.get(`getorders?status=cancelled&symbol=${symbol}&limit=${limit}&skip=${skip}`, this.options).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }

    getTradeHistory(symbol, limit = 50, skip = 0)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
        			if (symbol == null) symbol = '';
					limit = parseInt(limit);
					skip = parseInt(skip);
				
            		const response = await got.get(`gettrades?symbol=${symbol}&limit=${limit}&skip=${skip}`, this.options).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }

    getTradeHistorySince(symbol, size = 100)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
        			if (symbol == null) symbol = '';
                    size = parseInt(size);
					//skip = parseInt(skip);
					//since = parseInt(since);

            		const response = await got.post('market/latest-trade?symbol=' + symbol + '&size=' + size, {...this.options}).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }

    cancelAllOrders(symbol, side)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
            		const response = await got.post('cancelallorders', {...this.options, json: {symbol: symbol, side: side}}).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }

    cancelOrder(orderId)
    {

        return new Promise((resolve, reject) => {

            (async () => {

                try {
                    const response = await got.post('exchange/order/cancel/' + orderId, {...this.options}).json();
                    resolve(response);
                } catch (e) {
                    reject(e);
                }

            })();

        });

    }

    getUserOrders(symbol, pageNo, pageSize)
    {

        return new Promise((resolve, reject) => {

            (async () => {

                try {
                    //console.log(typeof symbol)
                    //console.log(typeof pageNo)
                    //console.log(typeof pageSize)
                    const response = await got.post('exchange/order/current/?symbol=' + symbol + '&pageNo=' + pageNo + '&pageSize=' + pageSize, {...this.options}).json();
                    console.log(response.content)
                    console.log(this.options.headers.Cookie)
                    resolve(response.content);
                } catch (e) {
                    reject(e);
                }
                

            })();

        });

    }
    
    createLimitOrder(symbol, price, amount, direction, type, useDiscount)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
            		const response = await got.post('exchange/order/add?symbol=' + symbol + '&price=' + price + '&amount=' + amount + '&direction=' + direction + '&type=' + type + '&useDiscount=' + useDiscount, {...this.options}).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }

    createMarketOrder(symbol, side, quantity, userProvidedId = null, strictValidate = false)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
            		const response = await got.post('createorder', {...this.options, json: {symbol: symbol, side: side, quantity: quantity, type: 'market', userProvidedId: userProvidedId, strictValidate: strictValidate}}).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }
    
};

export default xeggexApi;

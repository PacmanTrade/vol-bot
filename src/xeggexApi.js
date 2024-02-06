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

        this.options = new Options({
            prefixUrl: this.apiURL,
            headers: {
                COOKIE: 'SESSION=' + sessionKey + '; rememberMe=kHJf1J9RCy7wKI+BStATxJeRLgb2WjAZLVECy0wpyWdsiRI+d6XMieygrjsGpimPCAfEljzXKtq7XaUtfMa2DM/FvLRCmhdko5htwvu7lNbW+uQEd6xvkiU8Lv2hupicBaxN4f6GlnYd61oINZn7lEkl+q1Ymz6BaUoUdSvEmOmMDNr/qCS5RB8S9GJDkl2v//ibvN4TDY1nIcW/I2VZMbw+c+MJ40FNfjiPle/wGh1qLD4ZqnEtytuP2tX8mVUHAhcO8VaC4/8NvB3cP0owHCaM9sC+HEvdWz2uwb77nSAKIhxRADVOmLMddbJEbbAF5WRo8v8aBg8ggTb8aktW2g1Uh/teOuZEm26rycg+fRtBp1CrtNyTLLOiV12hZLB99dPCmpLmqD044Zy2y2IjaPtCsvdjstQACUZ2ffWUYpbMajdG6wv4MTSKQdS48KGPCczsddN/J6zf4EncgHYk8wa65gOxVVFnZlYAtaztuB7lsnpTfMWNJsWZsAJTwf3jzj6bGVn2NAV/doeSyWMomveZY0TwNzTL93/7BiYDTzXb; _ga=GA1.2.1228727332.1697729366; _gid=GA1.2.1394924511.1706723417'
            }
        });
		
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
            		const response = await got.post('market/exchange-plate-full', {...this.options, json: {symbol: symbol}}).json();
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
    
    getBalances()
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
            		const response = await got.post('admin/member/member-wallet/balance', {...this.options, json: {pageSize: 500, isOut: 0}}).json();
					resolve(response);
				} catch (e) {
                    reject(e);
                }
            
            })();
            
        });

    }	

    getOpenOrders(symbol, limit = 50, skip = 0)
    {

        return new Promise((resolve, reject) => {
        
        	(async () => {

				try {
        			if (symbol == null) symbol = '';
					limit = parseInt(limit);
					skip = parseInt(skip);
				
            		const response = await got.post('market/exchange-plate-full', {...this.options, json: {symbol: symbol}}).json();
					resolve(response);
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

            		const response = await got.post('market/latest-trade', {...this.options, json: {symbol: symbol, size: size}}).json();
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
                    const response = await got.post('exchange/order/current', {...this.options, json: {symbol: symbol, pageNo: pageNo, pageSize: pageSize}}).json();
                    resolve(response);
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
            		const response = await got.post('exchange/order/add', {...this.options, json: {symbol: symbol, price: price, amount: amount, direction: direction, type: type, useDiscount: useDiscount}}).json();
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

import {SMA, RSI, CrossUp, CrossDown} from 'technicalindicators';
import moment from 'moment';
import { create, all } from 'mathjs';
import {frontRunningBot} from "~/server/models/frontRunningBot.schema";
const config = {
    number: 'BigNumber',
    precision: 20
}
const math = create(all, config);

export default defineNitroPlugin((nitroApp) => {
    console.log('Front Running Library Loaded...')

    nitroApp.FrontRunningLIB = {

        placeBuyOrder: async function(bot) {
            // let side = this.getSide(bot);
            // let side = 'buy';
            let log = null;


            let orderResponse = await nitroApp.ccxtw.createOrder(
                bot.userID,
                bot.exchange,
                bot.symbol,
                'limit',
                'buy',
                bot.buyAmount,
                bot.buyPrice,
            );

            if (orderResponse.success) {
                bot.activeDeal.buyOrder = orderResponse.data;
                log =`${this.getCurrentTime()}: ${bot.symbol} - ${bot.activeDeal.status} - Type: limit, Side: buy, Amount: ${bot.buyAmount}, Price: ${bot.buyPrice}`;

                //next step->>
                bot.activeDeal.status = 'PLACE_SELL_ORDERS';
            }

            if (!orderResponse.success) {
                bot.activeDeal.buyOrder = null;
                log =`${this.getCurrentTime()}: ${bot.symbol} - ${bot.activeDeal.status} - ${orderResponse.log}`;
            }

            bot.logs.push(log);
            console.log(log);

            return bot;
        },
        placeSellOrders: async function(bot) {

            let log = null;

            let prices = this.generatePriceList(bot.sellPriceMin, bot.sellPriceMax, bot.nrOfGrids);

            for (let i = 0; i < prices.length; i++) {

                // let sign = this.getSign(bot);
                let sellPrice = prices[i];
                let sellAmount = bot.amount / bot.nrOfGrids;
                // let side = this.getSide(bot);
                // let side = 'sell';

                let orderResponse = await nitroApp.ccxtw.createOrder(
                    bot.userID,
                    bot.exchange,
                    bot.symbol,
                    'limit',
                    'sell',
                    sellAmount,
                    sellPrice
                );

                if (orderResponse.success) {
                    bot.activeDeal.sellOrders.push(orderResponse.data);
                    log =`${this.getCurrentTime()}: ${bot.symbol} - ${bot.activeDeal.status} - Type: limit, Side: sell, Amount: ${sellAmount}, Price: ${sellPrice}`;

                    //next step->>
                    bot.activeDeal.status = 'WAIT_FOR_FILLS';
                }

                if (!orderResponse.success) {
                    // bot.activeDeal.safetyOrder = null;
                    log =`${this.getCurrentTime()}: ${bot.symbol} - ${bot.activeDeal.status} - ${orderResponse.log}`;
                }
            }

            bot.logs.push(log);
            console.log(log);

            return bot;
        },
        generatePriceList: function(minPrice, maxPrice, numGrids) {
            var priceList = [];
            var grids = numGrids - 1;
            var increment = (maxPrice - minPrice) / grids;

            for (var i = 0; i <= grids; i++) {
                var price = minPrice + (i * increment);
                priceList.push(price.toFixed(2)); // toFixed(2) to keep two decimals
            }

            return priceList;
        },
        checkBuyOrder: async function(bot) {
            let orderResponse = await nitroApp.ccxtw.fetchOrder(bot.userID, bot.exchange, bot.activeDeal.buyOrder.id, bot.symbol);
            let log = null;

            if (orderResponse.success) {
                if (orderResponse.data.status === 'closed') {
                    bot.activeDeal.buyOrder = null;
                    bot.activeDeal.filledOrders.push(orderResponse.data);
                    log =`${this.getCurrentTime()}: ${bot.symbol} - ${bot.activeDeal.status} - BUY_ORDER_FILLED`;
                    bot.logs.push(log);
                    console.log(log);


                    //cancel ordere sell vechi

                    //recalculare amount total = amount buy + amount not sell

                    //plasare ordere sell


                }
            }
            return bot;
        },
        checkSellOrders: async function(bot) {

            // verificat ce s-a filluit la orderele de sell
            for (let i = 0; i < bot.activeDeal.sellOrders.length; i++) {

                let sellOrder = bot.activeDeal.sellOrders[i];

                let orderResponse = await nitroApp.ccxtw.fetchOrder(bot.userID, bot.exchange, sellOrder.id, bot.symbol);
                let log = null;

                if (orderResponse.success) {

                    if (orderResponse.data.status === 'closed') {
                        bot.activeDeal.sellOrders = null;




                        bot.activeDeal.filledOrders.push(orderResponse.data);
                        log =`${this.getCurrentTime()}: ${bot.symbol} - ${bot.activeDeal.status} - SAFETY_ORDER_FILLED`;
                        bot.logs.push(log);
                        console.log(log);


                        //cancel orderul de buy
                        await nitroApp.ccxtw.cancelOrder(bot.userID, bot.exchange, bot.activeDeal.buyOrder.id, bot.symbol);

                        let originalBuyOrder = await nitroApp.ccxtw.fetchOrder(bot.userID, bot.exchange, bot.activeDeal.buyOrder.id, bot.symbol);


                        //din amount-ul orderelor de la sell, add la buy
                        let amountToBuy = sellOrder.amount + originalBuyOrder.amount;

                        //place order iar

                        let orderResponse = await nitroApp.ccxtw.createOrder(
                            bot.userID,
                            bot.exchange,
                            bot.symbol,
                            'limit',
                            'buy',
                            amountToBuy,
                            bot.buyPrice,
                        );

                        if (orderResponse.success) {
                            bot.activeDeal.buyOrder = orderResponse.data;
                            log =`${this.getCurrentTime()}: ${bot.symbol} - ${bot.activeDeal.status} - Type: limit, Side: buy, Amount: ${bot.buyAmount}, Price: ${bot.buyPrice}`;
                        }

                        if (!orderResponse.success) {
                            bot.activeDeal.buyOrder = null;
                            log =`${this.getCurrentTime()}: ${bot.symbol} - ${bot.activeDeal.status} - ${orderResponse.log}`;
                        }

                        bot.logs.push(log);
                        console.log(log);

                        return bot;
                    }
                }
            }

            return bot;
        },
        // checkTakeProfitOrder: async function(bot) {
        //     let side = this.getSide(bot);
        //     let orderResponse = await nitroApp.ccxtw.fetchOrder(bot.userID, bot.exchange, bot.activeDeal.takeProfitOrder.id, bot.symbol);
        //     let log = null;
        //
        //     if (orderResponse.success) {
        //         if (orderResponse.data.status === 'closed') {
        //             bot.activeDeal.takeProfitOrder = null;
        //             bot.activeDeal.filledOrders.push(orderResponse.data);
        //             log =`${this.getCurrentTime()}: ${bot.symbol} - ${bot.activeDeal.status} - TAKE_PROFIT_ORDER_FILLED`;
        //             bot.logs.push(log);
        //             console.log(log);
        //
        //             //next step->>
        //             //cancel old safety order
        //             if (bot.activeDeal.safetyOrder !== null){
        //                 let cancelOrderResponse = await nitroApp.ccxtw.cancelOrder(bot.userID, bot.exchange, bot.activeDeal.safetyOrder.id, bot.symbol);
        //                 if (!cancelOrderResponse.success) {
        //                     bot.logs.push(cancelOrderResponse.log);
        //                     console.log(cancelOrderResponse.log);
        //                 }
        //                 bot.activeDeal.safetyOrder = null;
        //             }
        //
        //
        //             if (bot.marketType === 'future') {
        //                 if (bot.activeDeal.stopLossOrder !== null){
        //                     let cancelOrderResponse = await nitroApp.ccxtw.cancelOrder(bot.userID, bot.exchange, bot.activeDeal.stopLossOrder.id, bot.symbol);
        //                     if (!cancelOrderResponse.success) {
        //                         bot.logs.push(cancelOrderResponse.log);
        //                         console.log(cancelOrderResponse.log);
        //                     }
        //                     bot.activeDeal.stopLossOrder = null;
        //                 }
        //             }
        //
        //             //calculate profit
        //             bot.activeDeal.profit = this.calculateProfit(bot.activeDeal.filledOrders, side.mainDirection);
        //             bot.profit = math.evaluate(`${bot.profit} + ${bot.activeDeal.profit}`);
        //             bot.activeDeal.status = 'CLOSED_DEAL';
        //
        //             bot.closedDeals.push(bot.activeDeal);
        //
        //             log = `${this.getCurrentTime()}: ${bot.symbol} - CLOSED_DEAL - Profit: ${bot.activeDeal.profit}!!!. Resetting.`;
        //             bot.logs.push(log);
        //             console.log(log);
        //
        //             //reset
        //             bot.activeDeal = {
        //                 status:'START_NEW_DEAL',
        //                 baseOrder:null,
        //                 safetyOrder:null,
        //                 takeProfitOrder:null,
        //                 stopLossOrder:null,
        //                 filledOrders:[],
        //                 profit:0,
        //             };
        //         }
        //     }
        //
        //     return bot;
        // },
        // checkStopLossOrder: async function(bot) {
        //     let side = this.getSide(bot);
        //     let orderResponse = await nitroApp.ccxtw.fetchOrder(bot.userID, bot.exchange, bot.activeDeal.stopLossOrder.id, bot.symbol);
        //     let log = null;
        //
        //     if (orderResponse.success) {
        //         if (orderResponse.data.status === 'closed') {
        //             bot.activeDeal.stopLossOrder = null;
        //             bot.activeDeal.filledOrders.push(orderResponse.data);
        //             log =`${this.getCurrentTime()}: ${bot.symbol} - ${bot.activeDeal.status} - STOP_LOSS_ORDER_FILLED`;
        //             bot.logs.push(log);
        //             console.log(log);
        //
        //             //next step->>
        //             //cancel tp order
        //             if (bot.marketType === 'future') {
        //                 if (bot.takeProfitOrder !== null){
        //                     let cancelOrderResponse = await nitroApp.ccxtw.cancelOrder(bot.userID, bot.exchange, bot.activeDeal.takeProfitOrder.id, bot.symbol);
        //                     if (!cancelOrderResponse.success) {
        //                         bot.logs.push(cancelOrderResponse.log);
        //                         console.log(cancelOrderResponse.log);
        //                     }
        //                     bot.activeDeal.takeProfitOrder = null;
        //                 }
        //             }
        //
        //             bot.activeDeal.profit = this.calculateProfit(bot.activeDeal.filledOrders, side.mainDirection);
        //             bot.profit = math.evaluate(`${bot.profit} + ${bot.activeDeal.profit}`);
        //             bot.activeDeal.status = 'CLOSED_DEAL';
        //             bot.closedDeals.push(bot.activeDeal);
        //             log = `${this.getCurrentTime()}: ${bot.symbol} - STOP_LOSS_FILLED - LOSS: ${bot.activeDeal.profit}`;
        //             bot.logs.push(log);
        //             console.log(log);
        //
        //             //reset
        //             bot.activeDeal = {
        //                 status:'START_NEW_DEAL',
        //                 baseOrder:null,
        //                 safetyOrder:null,
        //                 takeProfitOrder:null,
        //                 stopLossOrder:null,
        //                 filledOrders:[],
        //                 profit:0,
        //             };
        //         }
        //     }
        //     return bot;
        // },
        createBot: async function(data){


            data.activeDeal = {
                status:'START_NEW_DEAL',
                buyOrder:null,
                sellOrders:[],
                closedOrders:[],
            };

            data.logs = [];

            await new frontRunningBot(data).save()
        },
        // startBot: async function(id) {
        //     await frontRunningBot.updateOne({ _id:id }, { status:true });
        // },
        // stopBot: async function(id) {
        //     await frontRunningBot.updateOne({ _id:id }, { status:false });
        // },
        // deleteBot: async function(id) {
        //     await frontRunningBot.findByIdAndDelete(id);
        // },
        // getBots: async function(){
        //     let bots = await frontRunningBot.find({});
        //     let formattedBots = [];
        //
        //     for (let i = 0; i < bots.length; i++) {
        //         let bot = bots[i].toObject();
        //
        //         let profit = 0;
        //         let bots = await frontRunningBot.find({id:bot._id});
        //         for (let i = 0; i < bots.length; i++) {
        //             profit = profit + bots[i].profit;
        //         }
        //
        //         bot.bots = bots;
        //         bot.profit = profit;
        //
        //         formattedBots.push(bot);
        //     }
        //     return formattedBots;
        // },
        // getDirection: async function(userID, exchange, symbol) {
        //     let status = await nitroApp.ccxtw.fetchOHLCV(userID, exchange, symbol, '1m');
        //     if (status.success) {
        //         let prices = [];
        //         for (let i = 0; i < status.data.length; i++) {
        //             prices.push(status.data[i][3]);
        //         }
        //
        //         let ma7Data = [];
        //         let ma7 = new SMA({period : 7, values : prices});
        //         let results = ma7.getResult();
        //         let offset = prices.length - results.length;
        //         for (let i = 0; i < results.length; i++) {
        //             ma7Data.push({
        //                 time:(status.data[i+offset][0] / 1000),
        //                 value:results[i],
        //             });
        //         }
        //
        //         let ma25Data = [];
        //         let ma25 = new SMA({period : 25, values : prices});
        //         results = ma25.getResult();
        //         offset = prices.length - results.length;
        //         for (let i = 0; i < results.length; i++) {
        //             ma25Data.push({
        //                 time:(status.data[i+offset][0] / 1000),
        //                 value:results[i],
        //             });
        //         }
        //
        //         let rsiData = [];
        //         let rsi = new RSI({period : 14, values : prices});
        //         results = rsi.getResult();
        //         offset = prices.length - results.length;
        //         for (let i = 0; i < results.length; i++) {
        //             rsiData.push({
        //                 time:(status.data[i+offset][0] / 1000),
        //                 value:results[i],
        //             });
        //         }
        //
        //         let data = {
        //             ma7:ma7Data,
        //             ma25:ma25Data,
        //             rsi:rsiData,
        //         }
        //
        //
        //         let maOffset = data.ma7.length - data.ma25.length;
        //         let ma7Vals = [];
        //         for (let i = maOffset; i < data.ma7.length; i++) {
        //             ma7Vals.push(data.ma7[i].value);
        //         }
        //
        //         let ma25Vals = [];
        //         for (let i = 0; i < data.ma25.length; i++) {
        //             ma25Vals.push(data.ma25[i].value);
        //         }
        //
        //         let crossLines = {
        //             lineA: ma7Vals,
        //             lineB: ma25Vals,
        //         };
        //
        //         let crossUp = new CrossUp(crossLines);
        //         let crossDown = new CrossDown(crossLines);
        //         let crossUpValues = crossUp.getResult();
        //         let crossDownValues = crossDown.getResult();
        //
        //
        //         let overboughtCondition = false;
        //         let oversoldCondition = false;
        //         let trend = null;
        //
        //         for (let i = 0; i < crossUpValues.length; i++) {
        //
        //             if (crossUpValues[i] === true) {
        //                 trend = 'bullish';
        //             }
        //
        //             if (crossDownValues[i] === true) {
        //                 trend = 'bearish';
        //             }
        //         }
        //
        //         for (let i = 0; i < data.rsi.length; i++) {
        //             if (data.rsi[i].value > 80 && !overboughtCondition) {
        //                 overboughtCondition = true;
        //             } else {
        //                 overboughtCondition = false;
        //             }
        //             if (data.rsi[i].value < 20 && !oversoldCondition) {
        //                 oversoldCondition = true;
        //             } else {
        //                 oversoldCondition = false;
        //             }
        //         }
        //
        //         return {
        //             trend,
        //             overboughtCondition,
        //             oversoldCondition
        //         }
        //     }
        // },
        getCurrentTime: function() {
            return moment(new Date()).format('lll');
        },
        // getSide: function(bot){
        //     let side = null;
        //     let opposite = null;
        //     if (bot.direction === 'long') {
        //         side = 'buy';
        //         opposite = 'sell';
        //     }
        //     if (bot.direction === 'short') {
        //         side = 'sell';
        //         opposite = 'buy';
        //     }
        //     return {
        //         mainDirection:side,
        //         oppositeDirection:opposite
        //     }
        // },
        // getSign: function(bot){
        //     let mainSign = null;
        //     let oppositeSign = null
        //
        //     if (bot.direction === 'long') {
        //         mainSign = '-';
        //         oppositeSign = '+';
        //     } else {
        //         mainSign = '+';
        //         oppositeSign = '-';
        //     }
        //
        //     return {
        //         mainSign:mainSign,
        //         oppositeSign:oppositeSign
        //     }
        // },
        // calculateProfit(orders, side){
        //     //calc profit
        //     let totalBuyCost = 0;
        //     let totalSellCost = 0;
        //     let profit = 0;
        //
        //     for (let i = 0; i < orders.length; i++) {
        //         if (orders[i].side === side) {
        //             totalBuyCost = math.evaluate(`${totalBuyCost} + ${orders[i].cost}`);
        //         }
        //         if (orders[i].side !== side) {
        //             totalSellCost = math.evaluate(`${totalSellCost} + ${orders[i].cost}`);
        //         }
        //     }
        //
        //     if (side === 'buy') {
        //         profit = math.evaluate(`${totalSellCost} - ${totalBuyCost}`);
        //     } else {
        //         profit = math.evaluate(`${totalBuyCost} - ${totalSellCost}`);
        //     }
        //     return profit;
        // }
    };

})

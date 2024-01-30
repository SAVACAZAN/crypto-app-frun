import { setIntervalAsync } from "set-interval-async"

export default defineNitroPlugin((nitroApp) => {
    startScheduler(nitroApp)
    console.log('FrontRunning Engine Loaded...')
})

function startScheduler(nitroApp) {
    setIntervalAsync(async () => {

        // get running bots
        let runningBots = await ActiveBot.find({isRunning: true});
        for (let bot of runningBots) {

            console.log(bot);

            //place buy order
            //NEW_DEAL --> 0
            if (bot.activeDeal.status === 'START_NEW_DEAL') {
                let log = `${nitroApp.ActiveBotsLib.getCurrentTime()}: ${bot.symbol} - NEW_DEAL - Side: ${bot.direction}`;
                bot.logs.push(log);
                console.log(log);

                // bot.activeDeal.status = 'PLACE_BUY_ORDER';
                bot.activeDeal.status = 'PLACE_SELL_ORDERS';
            }

            //PLACE_BUY_ORDER
            if (bot.activeDeal.status === 'PLACE_BUY_ORDER') {
                bot = await nitroApp.ActiveBotsLib.placeBuyOrder(bot);
            }

            //PLACE_SELL_ORDERS
            if (bot.activeDeal.status === 'PLACE_SELL_ORDERS') {
                bot = await nitroApp.ActiveBotsLib.placeSellOrders(bot);
            }

            //WAIT_FOR_FILLS
            if (bot.activeDeal.status === 'WAIT_FOR_FILLS') {

                ///BUY_ORDER_FILLED?
                if (bot.activeDeal.buyOrder !== null){
                    bot = await nitroApp.ActiveBotsLib.checkBuyOrder(bot);
                }

                ///SELL_ORDER_FILLED?
                if (bot.activeDeal.safetyOrder !== null){
                    bot = await nitroApp.ActiveBotsLib.checkSellOrders(bot);
                }


            }

            await ActiveBot.updateOne({_id: bot._id}, bot);
        }


    }, 1000);
}

import {UserListSchema} from "~/server/models/UserList.schema";


export default defineEventHandler(async (event) => {
    const nitroApp = useNitroApp()
    const data = await readBody(event)

    //set rest of exchanges as not selected
    await UserListSchema.updateMany({userID:data.userID}, {isSelectedExchange:false});

    //get exchange instance
    let exchangeInstance = await nitroApp.ccxtw.addUser(data.userID, data.MicroServiceExchangeBalance, data.BetCasinoBalance, data.CryptoWalletBalance , );

    //create new
    let newUserExchange = {
        userID: data.userID,
        MicroServiceExchangeBalance: data.MicroServiceExchangeBalance,
        BetCasinoBalance: data.BetCasinoBalance,
        CryptoWalletBalance: data.CryptoWalletBalance,
        timeframes:exchangeInstance.timeframes,
    };

    //push data to db
    let newUserResp = await new UserListSchema(newUserExchange).save()

    //get exchange markets
    const addUserList = await $fetch('/api/v1//addUserList', {
        query:{
            userID: data.userID,
            MicroServiceExchangeBalance: data.MicroServiceExchangeBalance,
            BetCasinoBalance: data.BetCasinoBalance,
            CryptoWalletBalance: data.CryptoWalletBalance,
            timeframes:exchangeInstance.timeframes,
        }
    });

   

    //update user data to db
    await UserListSchema.updateOne({ userID:data.userID, MicroServiceExchangeBalance:data.MicroServiceExchangeBalance, BetCasinoBalance:data.BetCasinoBalance, CryptoWalletBalance:data.CryptoWalletBalance }, {
        MicroServiceExchangeBalance:MicroServiceExchangeBalance,
        BetCasinoBalance:BetCasinoBalance,
        CryptoWalletBalance: CryptoWalletBalance,
    });

    return {
        data: {
            id: data.userID,
            MicroServiceExchangeBalance: data.MicroServiceExchangeBalance,
            BetCasinoBalance: data.BetCasinoBalance,
            CryptoWalletBalance: data.CryptoWalletBalance,
        }
    }
})



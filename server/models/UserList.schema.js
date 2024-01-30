import { defineMongooseModel } from '#nuxt/mongoose'
export const UserListSchema = defineMongooseModel({
    name: 'UserList',
    schema: {
        userID: {
            type: String,
            required: false
        },
        // MicroServiceExchangeBalance: {
        //     type: String,
        //     required: false
     
        // },
        // BetCasinoBalance: {
        //     type: String,
        //     required: false
     
        // },
        // CryptoWalletBalance: {
        //     type: String,
        //     required: false
     
        // },
    },
})



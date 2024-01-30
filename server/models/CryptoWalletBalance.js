import { defineMongooseModel } from '#nuxt/mongoose'
export const CryptoWalletBalanceSchema = defineMongooseModel({
    name: 'CryptoWalletBalance',
    schema: {
        userID: {
            type: String,
            required: true
           },

        _BTCWallet: {
            $BTCAdress: {
              type: String,
              required: false,
            },
            $BTCKey: {
              type: String,
              required: false,
            },
            $BTCMnemo: {
              type: String,
              required: false,
            },
            $BTCBalance: {
              type: String,
              required: false,
            },
          },
       _ETHWallet: {
            $ETHAdress: {
              type: String,
              required: false,
            },
            $ETHKey: {
              type: String,
              required: false,
            },
            $ETHMnemo: {
              type: String,
              required: false,
            },
            $ETHBalance: {
              type: String,
              required: false,
            },
          },
    },
})



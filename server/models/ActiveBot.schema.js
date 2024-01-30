import { defineMongooseModel } from '#nuxt/mongoose'
export const ActiveBot = defineMongooseModel({
    name: 'ActiveBots',
    schema: {
        userID: {
            type: String,
            required: true
        },
        isRunning: {
            type: Boolean,
            required: true
        },
        exchange: {
            type: String,
            required: true
        },
        symbol: {
            type: String,
            required: true
        },
        buyAmount: {
            type: Number,
            required: true
        },
        buyPrice: {
            type: Number,
            required: true
        },
        nrOfGrids: {
            type: Number,
            required: true
        },
        sellAmount: {
            type: Number,
            required: true
        },
        sellPriceMin: {
            type: Number,
            required: true
        },
        sellPriceMax: {
            type: Number,
            required: true
        },
        activeDeal: {
            type: Object,
            required:true,
        },
        logs: {
            type: Array,
            required: true
        },
    },
})

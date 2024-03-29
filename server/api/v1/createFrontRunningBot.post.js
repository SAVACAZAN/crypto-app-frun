export default defineEventHandler(async (event) => {
    const nitroApp = useNitroApp()
    const data = await readBody(event)

    await nitroApp.FrontRunningLIB.createBot(data);

    return {
        data: 'OK'
    }
})


import moment from 'moment';
import { create, all } from 'mathjs';
import { UserListSchema } from '~/server/models/UserList.schema';

const config = {
  number: 'BigNumber',
  precision: 20,
};

const math = create(all, config);

export default defineNitroPlugin((nitroApp) => {
  console.log('UserList Library Loaded...');

  nitroApp.UserListLib = {
    createUserList: async function (data) {
      await new UserListSchema(data).save();
    },

    generateMicroServiceToken: async function (data) {
      let orders = [];

    //   // Verificăm dacă data conține informațiile necesare
    //   if (!data || !data.userID || !data.MicroServiceExchangeBalance || !data.BetCasinoBalance || !data.CryptoWalletBalance) {
    //     throw new Error('Incomplete data provided for generating MicroServiceToken.');
    //   }

      // Adăugăm logica de generare MicroServiceToken aici (dacă este necesar)

      // Exemplu: generare un token aleator
      const tokenLength = 15;
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let generatedToken = 'MSE';

      for (let i = 0; i < tokenLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        generatedToken += characters[randomIndex];
      }

      // Salvăm token-ul generat în baza de date sau utilizăm în alt mod
      // Înlocuiește această linie cu logica reală necesară
      await nitroApp.ccxtw.addUserList(data.userID, data.MicroServiceExchangeBalance, data.BetCasinoBalance, data.CryptoWalletBalance, generatedToken);

      // Adăugăm informații despre tranzacție la array-ul orders (dacă este necesar)
      orders.push({
        userID: data.userID,
        MicroServiceExchangeBalance: data.MicroServiceExchangeBalance,
        BetCasinoBalance: data.BetCasinoBalance,
        CryptoWalletBalance: data.CryptoWalletBalance,
        // Alte informații despre tranzacție
        generatedToken: generatedToken,
      });

      return orders;
    },

    getCurrentTime() {
      return moment(new Date()).format('lll');
    },
  };
});

<template>
  <n-space class="container" vertical>
    <n-text>userID: {{ userID }}</n-text>
    <n-text v-if="microServiceToken" class="token">MicroServiceToken: {{ microServiceToken }}</n-text>
    <n-text v-if="microServiceExchangeBalance">MicroServiceExchangeBalance: {{ microServiceExchangeBalance }}</n-text>
    <n-text v-if="betCasinoBalance">BetCasinoBalance: {{ betCasinoBalance }}</n-text>
    <n-text v-if="cryptoWalletBalance">CryptoWalletBalance: {{ cryptoWalletBalance }}</n-text>
    <n-button @click="generateMicroServiceToken" :disabled="tokenGenerated" class="generate-button">Generate Token</n-button>
  </n-space>
</template>

<script setup>
import { ref } from 'vue';


let userIDCookie = useCookie('userID');
let userID = userIDCookie.value;

const microServiceToken = ref('');
const microServiceExchangeBalance = ref(0);
const betCasinoBalance = ref(0);
const cryptoWalletBalance = ref(0);
const tokenGenerated = ref(false);

const generateMicroServiceToken = () => {
  if (!tokenGenerated.value) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const tokenLength = 15;
    let token = 'MSE';

    for (let i = 0; i < tokenLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }


    
    microServiceExchangeBalance.value = 100; // Exemplu de balanță pentru MicroServiceExchange
    betCasinoBalance.value = 50; // Exemplu de balanță pentru BetCasino
    cryptoWalletBalance.value = 200; // Exemplu de balanță pentru CryptoWallet

    tokenGenerated.value = true;
  }
};
</script>

<style scoped>
.container {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.token {
  margin-top: 10px;
  font-weight: bold;
}

.generate-button {
  margin-top: 10px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
}

.generate-button:disabled {
  background-color: #ddd;
  color: #999;
  cursor: not-allowed;
}
</style>

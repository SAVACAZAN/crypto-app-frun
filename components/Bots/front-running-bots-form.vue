<script setup>
import {ref} from "vue";
import {useAppStore} from "~/stores/app.store";
const app = useAppStore()
let userID = useCookie('userID');

let currentExchange = ref(app.getUserSelectedExchange);
let currentSymbol = ref(app.getUserSelectedMarket);


const buyAmount = ref('');
const buyPrice = ref('');
const nrOfGrids = ref('');

const sellAmount = ref('');
const sellPriceMin = ref('');
const sellPriceMax = ref('');



async function submit(){

  let data = {
    userID:userID.value,
    isRunning:true,
    exchange: currentExchange.value,
    symbol:currentSymbol.value,
    buyAmount:buyAmount.value,
    buyPrice:buyPrice.value,
    nrOfGrids:nrOfGrids.value,
    sellAmount:sellAmount.value,
    sellPriceMin:sellPriceMin.value,
    sellPriceMax:sellPriceMax.value
  }

  await $fetch( '/api/v1/createFrontRunningBot', {
    method: 'POST',
    body: data
  } );
}


</script>

<template>
  <n-card>
    <n-grid x-gap="12" :cols="2">
      <n-gi>
        <n-space vertical>
          <n-input v-model:value="buyAmount" type="text" placeholder="Buy Amount" />
          <n-input v-model:value="buyPrice" type="text" placeholder="Buy Price" />
          <n-button type="primary" @click="submit()">
            Submit
          </n-button>
        </n-space>
      </n-gi>
      <n-gi>
        <n-space vertical>
          <n-input v-model:value="nrOfGrids" type="text" placeholder="NR Of Grids" />
          <n-input v-model:value="sellAmount" type="text" placeholder="Sell Amount" />
          <n-input v-model:value="sellPriceMin" type="text" placeholder="Sell Price Min" />
          <n-input v-model:value="sellPriceMax" type="text" placeholder="Sell Price Max" />
        </n-space>
      </n-gi>
    </n-grid>
  </n-card>
</template>

<style scoped>

</style>

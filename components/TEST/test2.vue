<script setup>
import { useAppStore } from '~/stores/app.store';
import {ref} from "vue";


const app = useAppStore()

let userID = useCookie('userID');

let currentExchange = ref(app.getUserSelectedExchange);
let currentSymbol = ref(app.getUserSelectedMarket);

let base = currentSymbol.value.split('/')[0];
let quote = currentSymbol.value.split('/')[1];


let lowerPrice = ref('');
let upperPrice = ref('');


let amount = ref('');
let nrOfGrids = ref('');


let incrementalPercentAmountBuy = ref('');
let incrementalPercentAmountSell = ref('');
let deviationPriceBuy = ref('');
let deviationPriceSell = ref('');
let deviationAmountBuy = ref('');
let deviationAmountSell = ref('');





  // console.log(data);




</script>

<template>
  <n-card>
      <n-grid x-gap="12" :cols="2" item-responsive>
        <n-gi>
          <n-space vertical>
        
            <n-input v-model:value="lowerPrice" type="text" placeholder="Lower Price">
              <template #suffix> {{quote}} </template>
            </n-input>
          
           
            <n-input v-model:value="incrementalPercentAmountBuy" type="text" placeholder="Inc. % Amount Buy">
              <template #suffix> % </template>
            </n-input>
            <n-input v-model:value="deviationPriceBuy" type="text" placeholder="Deviation Price Buy">
              <template #suffix> % </template>
            </n-input>
            <n-input v-model:value="deviationAmountBuy" type="text" placeholder="Deviation Amount Buy">
              <template #suffix> % </template>
            </n-input>
        
           
            

                <!-- Butonul de creare -->
    <button @click="generatePriceList">Create</button>


          </n-space>
        </n-gi>
        <n-gi>
          <n-space vertical>

           


            <n-input v-model:value="upperPrice" type="text" placeholder="Upper Price">
              <template #suffix> {{quote}} </template>
            </n-input>
            <n-input v-model:value="amount" type="text" placeholder="Amount">
              <template #suffix> {{quote}} </template>
            </n-input>
            <n-input v-model:value="nrOfGrids" type="text" placeholder="Nr of grids"></n-input>
            <n-input v-model:value="incrementalPercentAmountSell" type="text" placeholder="Inc. % Amount Sell">
              <template #suffix> % </template>
            </n-input>
            <n-input v-model:value="deviationPriceSell" type="text" placeholder="Deviation Price Sell">
              <template #suffix> % </template>
            </n-input>
            <n-input v-model:value="deviationAmountSell" type="text" placeholder="Deviation Amount Sell">
              <template #suffix> % </template>
            </n-input>
          
          </n-space>
        </n-gi>
      </n-grid>
  </n-card>
</template>

<style scoped>

</style>

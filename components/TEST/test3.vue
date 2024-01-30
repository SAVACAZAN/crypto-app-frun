<template>
    <n-card>
      <n-grid x-gap="12" :cols="2" item-responsive>
        <n-gi>
          <n-space vertical>
            <n-input v-model:value="lowerPrice" type="text" placeholder="Lower Price">
              <template #suffix> {{quote}} </template>
            </n-input>
            <n-input v-model:value="incrementalPercentAmountBuy" type="text" placeholder="Inc. % Amount Buy">
              <template #suffix>%</template>
            </n-input>
            <n-input v-model:value="deviationPriceBuy" type="text" placeholder="Deviation Price Buy">
              <template #suffix>%</template>
            </n-input>
            <n-input v-model:value="deviationAmountBuy" type="text" placeholder="Deviation Amount Buy">
              <template #suffix>%</template>
            </n-input>
  
            <!-- Button for creating the price list -->
            <button @click="generatePriceList">Create</button>
          </n-space>
        </n-gi>
        <n-gi>
          <n-space vertical>
            <n-input v-model:value="upperPrice" type="text" placeholder="Upper Price">
              <template #suffix>{{ quote }}</template>
            </n-input>
            <n-input v-model:value="amount" type="text" placeholder="Amount">
              <template #suffix>{{ quote }}</template>
            </n-input>
            <n-input v-model:value="nrOfGrids" type="text" placeholder="Nr of grids"></n-input>
            <n-input v-model:value="incrementalPercentAmountSell" type="text" placeholder="Inc. % Amount Sell">
              <template #suffix>%</template>
            </n-input>
            <n-input v-model:value="deviationPriceSell" type="text" placeholder="Deviation Price Sell">
              <template #suffix>%</template>
            </n-input>
            <n-input v-model:value="deviationAmountSell" type="text" placeholder="Deviation Amount Sell">
              <template #suffix>%</template>
            </n-input>
  
            <div>
    <div style="float: left; margin-right: 20px;">
      <!-- PAS 1 - Cumpărare -->
      <h3>PAS 1 - Cumpărare:</h3>
      <table>
  
        <thead>
          <tr>
            <th>Preț</th>
            <th>Cantitate</th>
            <th>Total Fise</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in buyList" :key="'buy-' + index">
            <td>{{ item.price }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.totalFiseBuy }}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- PAS 2 - Deviație: Vânzare -->
      <h3>PAS 2 - Deviație: Vânzare:</h3>
      <table>
        
      
    <thead>
      <tr>
        <th>Preț Deviat</th>
        <th>Cantitate</th>
        <th>Total Fise</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in sellListDeviation" :key="'sell-dev-' + index">
        <td>{{ item.price }}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.totalFise }}</td>
      </tr>
    </tbody>
  </table>
  
  
      
    </div>
  
    <div style="float: left; margin-right: 20px;">
      <!-- PAS 1 - Vânzare -->
      <h3>PAS 1 - Vânzare:</h3>
      <table>
        <thead>
          <tr>
            <th>Preț</th>
            <th>Cantitate</th>
            <th>Total Fise</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in sellList" :key="'sell-' + index">
            <td>{{ item.price }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.totalFiseSell }}</td>
          </tr>
        </tbody>
      </table>
      
      
      <!-- PAS 2 - Deviație: Cumpărare -->
      <h3>PAS 2 - Deviație: Cumpărare:</h3>
      <table>
        
        <thead>
          <tr>
            <th>Preț Deviat</th>
            <th>Cantitate</th>
            <th>Total Fise</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in buyListDeviation" :key="'buy-dev-' + index">
            <td>{{ item.price }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.totalFise }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
  
          </n-space>
        </n-gi>
      </n-grid>
    </n-card>
  </template>
  
  <script setup>
  import { useAppStore } from '~/stores/app.store';
  import { ref } from "vue";
  
  const app = useAppStore();
  
  const userID = useCookie('userID'); // Import 'useCookie' from the appropriate library
  
  const currentExchange = ref(app.getUserSelectedExchange);
  const currentSymbol = ref(app.getUserSelectedMarket);
  
  const base = ref('');
  const quote = ref('');
  
  const lowerPrice = ref('');
  const upperPrice = ref('');
  
  const amount = ref('');
  const nrOfGrids = ref('');
  
  const incrementalPercentAmountBuy = ref('');
  const incrementalPercentAmountSell = ref('');
  const deviationPriceBuy = ref('');
  const deviationPriceSell = ref('');
  const deviationAmountBuy = ref('');
  const deviationAmountSell = ref('');
  
  </script>
  
  <script>
  export default {
    data() {
      return {
        minPrice: [],
        maxPrice: [],
        quantity: [],
        lastPrice: 0.13,
        nrGrids: 5,
        buyQuantityIncrementPercentage: [],
        sellQuantityIncrementPercentage: [],
        buyPriceDeviationPercentage: [],
        sellPriceDeviationPercentage: [],
        buyList: [],
        sellList: [],
        buyListDeviation: [],
        sellListDeviation: [],
      };
    },
    computed: {
      totalQuantityBuyPas1() {
        return this.buyList.reduce((total, item) => total + item.quantity, 0);
      },
      totalQuantitySellPas1() {
        return this.sellList.reduce((total, item) => total + item.quantity, 0);
      },
      totalFiseBuyPas1() {
        return this.buyList.reduce((total, item) => total + parseFloat(item.totalFiseBuy), 0).toFixed(3);
      },
      totalFiseSellPas1() {
        return this.sellList.reduce((total, item) => total + parseFloat(item.totalFiseSell), 0).toFixed(3);
      },
      totalQuantityBuyPas2() {
        return this.sellListDeviation.reduce((total, item) => total + item.quantity, 0);
      },
      totalQuantitySellPas2() {
        return this.buyListDeviation.reduce((total, item) => total + item.quantity, 0);
      },
      totalFiseBuyPas2() {
        return this.buyListDeviation.reduce((total, item) => total + parseFloat(item.totalFise), 0).toFixed(3);
      },
      totalFiseSellPas2() {
        return this.sellListDeviation.reduce((total, item) => total + parseFloat(item.totalFise), 0).toFixed(3);
      },
  
  
      
      averagePriceBuyPas1() {
      let totalValue = this.buyList.reduce((total, item) => total + (item.price * item.quantity), 0);
      let totalQuantity = this.totalQuantityBuyPas1;
      return totalQuantity !== 0 ? (totalValue / totalQuantity).toFixed(3) : 0;
    },
  
    averagePriceSellPas1() {
      let totalValue = this.sellList.reduce((total, item) => total + (item.price * item.quantity), 0);
      let totalQuantity = this.totalQuantitySellPas1;
      return totalQuantity !== 0 ? (totalValue / totalQuantity).toFixed(3) : 0;
    },
  
    averagePriceBuyPas2() {
      let totalValue = this.buyListDeviation.reduce((total, item) => total + (item.price * item.quantity), 0);
      let totalQuantity = this.totalQuantityBuyPas2;
      return totalQuantity !== 0 ? (totalValue / totalQuantity).toFixed(3) : 0;
    },
  
    averagePriceSellPas2() {
      let totalValue = this.sellListDeviation.reduce((total, item) => total + (item.price * item.quantity), 0);
      let totalQuantity = this.totalQuantitySellPas2;
      return totalQuantity !== 0 ? (totalValue / totalQuantity).toFixed(3) : 0;
    },
  },
    methods: {
      generatePriceList() {
        this.buyList = [];
        this.sellList = [];
  
        let baseQuantity = this.quantity;
        let gridWidth = (this.maxPrice - this.minPrice) / (this.nrGrids - 1);
  
        let currentPriceBuy = this.lastPrice;
        for (let i = 0; i < this.nrGrids / 2; i++) {
          let incrementedQuantityBuy = baseQuantity * (1 + this.buyQuantityIncrementPercentage / 100 * i);
          let totalFiseBuy = (currentPriceBuy * incrementedQuantityBuy).toFixed(3);
  
          this.buyList.push({
            price: currentPriceBuy.toFixed(3),
            quantity: incrementedQuantityBuy,
            totalFiseBuy: totalFiseBuy,
          });
  
          currentPriceBuy -= gridWidth;
        }
  
        let currentPriceSell = this.lastPrice;
        for (let i = 0; i < this.nrGrids / 2; i++) {
          let incrementedQuantitySell = baseQuantity * (1 + this.sellQuantityIncrementPercentage / 100 * i);
          let totalFiseSell = (currentPriceSell * incrementedQuantitySell).toFixed(3);
  
          this.sellList.push({
            price: currentPriceSell.toFixed(3),
            quantity: incrementedQuantitySell,
            totalFiseSell: totalFiseSell,
          });
  
          currentPriceSell += gridWidth;
        }
        this.calculateDeviationPriceList();
      },
      
    calculateProfit(listBuy, listSell) {
      let profit = 0;
      for (let i = 0; i < listBuy.length; i++) {
        if (listSell[i]) {
          profit += (listSell[i].price - listBuy[i].price) * Math.min(listBuy[i].quantity, listSell[i].quantity);
        }
      }
      return profit.toFixed(3);
    },
  
    profitPas1() {
      return this.calculateProfit(this.buyList, this.sellList);
    },
  
    profitPas2() {
      return this.calculateProfit(this.buyListDeviation, this.sellListDeviation);
    },
      calculateDeviationPriceList() {
        this.sellListDeviation = this.sellList.map(item => ({
          price: (item.price * (1 + this.sellPriceDeviationPercentage / 100)).toFixed(3),
          quantity: item.quantity,
          totalFise: (item.price * item.quantity * (1 + this.sellPriceDeviationPercentage / 100)).toFixed(3)
        }));
  
        this.buyListDeviation = this.buyList.map(item => ({
          price: (item.price * (1 - this.buyPriceDeviationPercentage / 100)).toFixed(3),
          quantity: item.quantity,
          totalFise: (item.price * item.quantity * (1 - this.buyPriceDeviationPercentage / 100)).toFixed(3)
        }));
      },
    },
  };
  </script>
  
  <style scoped>
  /* Your styles here... */
  </style>
  
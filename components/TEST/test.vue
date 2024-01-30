<template>
  <div>
    <h2>Listă de Prețuri, Cantități și Total Fise</h2>

    <!-- Input-uri pentru parametrii -->
    <div>
      <label for="minPrice">Preț minim:</label>
      <input type="number" v-model="minPrice" id="minPrice" step="0.01">
    </div>
    <div>
      <label for="maxPrice">Preț maxim:</label>
      <input type="number" v-model="maxPrice" id="maxPrice" step="0.01">
    </div>
    <div>
      <label for="quantity">Cantitate:</label>
      <input type="number" v-model="quantity" id="quantity">
    </div>
    <div>
      <label for="lastPrice">Ultimul Preț:</label>
      <input type="number" v-model="lastPrice" id="lastPrice" step="0.01">
    </div>
    <div>
      <label for="nrGrids">Număr de Grile:</label>
      <input type="number" v-model="nrGrids" id="nrGrids">
    </div>
    <div>
      <label for="incrementalBuy">Incremental Buy:</label>
      <input type="number" v-model="buyQuantityIncrementPercentage" id="incrementalBuy" step="0.01">
    </div>
    <div>
      <label for="incrementalSell">Incremental Sell:</label>
      <input type="number" v-model="sellQuantityIncrementPercentage" id="incrementalSell" step="0.01">
    </div>

    <div>
      <label for="incrementalBuy">buyPriceDeviationPercentage:</label>
      <input type="number" v-model="buyPriceDeviationPercentage" id="buyPriceDeviationPercentage" step="0.01">
    </div>
    <div>
      <label for="incrementalSell">sellPriceDeviationPercentage:</label>
      <input type="number" v-model="sellPriceDeviationPercentage" id="sellPriceDeviationPercentage" step="0.01">
    </div>

    
    <h2>Listă de Prețuri, Cantități și Total Fise</h2>

    <!-- Input-uri pentru parametrii -->
    <!-- ... Restul codului ... -->

    <!-- Butonul de creare -->
    <button @click="generatePriceList">Create</button>

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
              <td :class="{'text-green': item.transactionType === 'buy', 'text-red': item.transactionType === 'sell'}">{{ item.price }}</td>
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
              <td :class="{'text-green': item.transactionType === 'buy', 'text-red': item.transactionType === 'sell'}">{{ item.price }}</td>
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
              <td :class="{'text-green': item.transactionType === 'buy', 'text-red': item.transactionType === 'sell'}">{{ item.price }}</td>
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
              <td :class="{'text-green': item.transactionType === 'buy', 'text-red': item.transactionType === 'sell'}">{{ item.price }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.totalFise }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <h3>Totaluri PAS 1:</h3>
      Total Cantitate Cumpărare: {{ totalQuantityBuyPas1 }}
      Total Cantitate Vânzare: {{ totalQuantitySellPas1 }}
      Total Fise Cumpărare: {{ totalFiseBuyPas1 }}
      Total Fise Vânzare: {{ totalFiseSellPas1 }}
    </div>
    <!-- Totalurile pentru PAS 2 -->
    <div>
      <h3>Totaluri PAS 2:</h3>
      Total Cantitate Cumpărare Deviată: {{ totalQuantityBuyPas2 }}
      Total Cantitate Vânzare Deviată: {{ totalQuantitySellPas2 }}
      Total Fise Cumpărare Deviată: {{ totalFiseBuyPas2 }}
      Total Fise Vânzare Deviată: {{ totalFiseSellPas2 }}
    </div>
    <div>
      <h3>Prețuri Medii:</h3>
      Preț Mediu Cumpărare PAS 1: {{ averagePriceBuyPas1 }}<br>
      Preț Mediu Vânzare PAS 1: {{ averagePriceSellPas1 }}<br>
      Preț Mediu Cumpărare Deviată PAS 2: {{ averagePriceBuyPas2 }}<br>
      Preț Mediu Vânzare Deviată PAS 2: {{ averagePriceSellPas2 }}
    </div>

    <div>
      <h3>Profituri:</h3>
      Profit PAS 1 (Fise): {{ profitPas1Fise() }}<br>
      Profit PAS 1 (Cantitate): {{ profitPas1Quantity() }}<br>
      Profit PAS 2 (Fise): {{ profitPas2Fise() }}<br>
      Profit PAS 2 (Cantitate): {{ profitPas2Quantity() }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      minPrice: 0.14,
      maxPrice: 0.17,
      quantity: 100,
      lastPrice: 0.13,
      nrGrids: 5,
      buyQuantityIncrementPercentage: 5,
      sellQuantityIncrementPercentage: 3,
      buyPriceDeviationPercentage: 3,
      sellPriceDeviationPercentage: 2,
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
          transactionType: 'buy',
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
          transactionType: 'sell',
        });

        currentPriceSell += gridWidth;
      }
      this.calculateDeviationPriceList();
    },
    calculateProfitFise(listBuy, listSell) {
      let profit = 0;
      for (let i = 0; i < listBuy.length; i++) {
        if (listSell[i]) {
          profit += (listSell[i].price - listBuy[i].price) * Math.min(listBuy[i].quantity, listSell[i].quantity);
        }
      }
      return profit;
    },
    calculateProfitQuantity(listBuy, listSell) {
      let profit = 0;
      for (let i = 0; i < listBuy.length; i++) {
        if (listSell[i]) {
          profit += Math.min(listBuy[i].quantity, listSell[i].quantity);
        }
      }
      return profit;
    },
    profitPas1Fise() {
      let profitFise = this.calculateProfitFise(this.buyList, this.sellList);
      return profitFise.toFixed(3);
    },
    profitPas1Quantity() {
      let profitQuantity = this.calculateProfitQuantity(this.buyList, this.sellList);
      return profitQuantity.toFixed(3);
    },
    profitPas2Fise() {
      let profitFise = this.calculateProfitFise(this.buyListDeviation, this.sellListDeviation);
      return profitFise.toFixed(3);
    },
    profitPas2Quantity() {
      let profitQuantity = this.calculateProfitQuantity(this.buyListDeviation, this.sellListDeviation);
      return profitQuantity.toFixed(3);
    },
    calculateDeviationPriceList() {
      this.sellListDeviation = this.sellList.map(item => ({
        price: (item.price * (1 + this.sellPriceDeviationPercentage / 100)).toFixed(3),
        quantity: item.quantity,
        totalFise: (item.price * item.quantity * (1 + this.sellPriceDeviationPercentage / 100)).toFixed(3),
        transactionType: 'sell',
      }));

      this.buyListDeviation = this.buyList.map(item => ({
        price: (item.price * (1 - this.buyPriceDeviationPercentage / 100)).toFixed(3),
        quantity: item.quantity,
        totalFise: (item.price * item.quantity * (1 - this.buyPriceDeviationPercentage / 100)).toFixed(3),
        transactionType: 'buy',
      }));
    },
  },
};
</script>

<style scoped>
.text-green {
  color: green;
}

.text-red {
  color: red;
}
</style>

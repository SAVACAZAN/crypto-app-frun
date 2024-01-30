<template>
  <div v-if="show" class="popup-container">
    <div :class="{'background-green': isFrontRun, 'background-red': isGridBot}" class="popup-content">
      <h3>Detalii Grid Bot</h3>
      <p><strong>Nume:</strong> {{ name }}</p>
      <p><strong>Exchange:</strong> {{ exchange }}</p>
      <p><strong>Simbol:</strong> {{ symbol }}</p>
      <p><strong>Preț Superior:</strong> {{ upperPrice }}</p>
      <p><strong>Preț Inferior:</strong> {{ lowerPrice }}</p>
      <p><strong>amount:</strong> {{ amount }}</p>
      <p><strong>nrOfGrids:</strong> {{ nrOfGrids }}</p>
      <div>
        <h4>Griduri de Cumpărare (Buy)</h4>
        <ul>
          <li v-for="(price, index) in buyPrices" :key="index">Preț: {{ price }}</li>
        </ul>
      </div>
      <div>
        <h4>Griduri de Vânzare (Sell)</h4>
        <ul>
          <li v-for="(price, index) in sellPrices" :key="index">Preț: {{ price }}</li>
        </ul>
      </div>
      <n-button @click="onClose">Închide</n-button>
    </div>
  </div>
</template>

<script setup>
import { NButton } from 'naive-ui';
import { computed } from 'vue';

const props = defineProps({
  show: Boolean,
  onClose: Function,
  name: String,
  exchange: String,
  symbol: String,
  upperPrice: String,
  lowerPrice: String,
  amount:String,
  nrOfGrids:String,
  buyPrices: Array,
  sellPrices: Array
});

const isFrontRun = computed(() => props.name.startsWith('FronRun'));
const isGridBot = computed(() => props.name.startsWith('gridBot'));
</script>

<style scoped>
.popup-container {
  /* Stiluri pentru containerul popup */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  /* Stiluri de bază pentru conținutul popup */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.background-green {
  background-color: green;
}

.background-red {
  background-color: red;
}
</style>

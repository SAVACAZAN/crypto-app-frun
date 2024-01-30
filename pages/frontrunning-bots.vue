<template>
    <h2>Frontrunning Bots</h2>
    <TickerBar/>
    <FrontRunningBotsForm/>
</template>


<script setup>
import FrontRunningBotsForm from '~/components/Bots/front-running-bots-form.vue';

definePageMeta({
  middleware: 'auth'
})
import { useAppStore } from '~/stores/app.store';
const app = useAppStore()
let userID = useCookie('userID');

await app.loadUserExchangeData(userID.value);
</script>

<template>
    <h2>Active Bots</h2>
    <TickerBar/>
    <ActiveBotsForm/>
</template>


<script setup>
definePageMeta({
  middleware: 'auth'
})
import ActiveBotsForm from '~/components/Bots/active-bots-form.vue';
import { useAppStore } from '~/stores/app.store';
const app = useAppStore()
let userID = useCookie('userID');

await app.loadUserExchangeData(userID.value);
</script>

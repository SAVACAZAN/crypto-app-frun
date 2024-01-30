<template>
    <div>
      <h1>
        
      </h1>
      <!-- Aici puteți adăuga conținutul specific paginii de listă a utilizatorilor -->
    </div>
    <Rewards/>
   
  </template>
  
  
  <script setup>
  definePageMeta({
  middleware: 'auth'
  })
  import { useAppStore } from '~/stores/app.store';
  const app = useAppStore()
  let userID = useCookie('userID');
  
  await app.loadUserExchangeData(userID.value);
  </script>
  
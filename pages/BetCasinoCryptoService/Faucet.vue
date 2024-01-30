<template>
  <div>
    <h1>Faucet Page</h1>
    <p>Your Faucet Balance: {{ faucetBalance }}</p>
    <button @click="claimFaucet">Claim Faucet</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      faucetBalance: 0,
    };
  },
  methods: {
    async claimFaucet() {
      try {
        const response = await fetch('/api/claimFaucet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: 'IDUtilizator', // Înlocuiți cu userID real sau cu datele necesare
          }),
        });

        if (response.ok) {
          console.log('Data added successfully');
          this.faucetBalance += 1;
        } else {
          console.error('Failed to add data');
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

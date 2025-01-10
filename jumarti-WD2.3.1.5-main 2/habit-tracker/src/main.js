// Import the necessary modules from Vue and other files
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles.css'; // Global styles

// Create a Vue application instance
const app = createApp(App);

// Use the router for navigation
app.use(router);

// Mount the app to the DOM
app.mount('#app');

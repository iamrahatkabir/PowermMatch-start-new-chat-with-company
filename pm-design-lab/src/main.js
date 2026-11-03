import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import ds from './ds'
import HomePage from './pages/HomePage.vue'
import DesignPage from './pages/DesignPage.vue'
import './styles/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/d/:slug', component: DesignPage },
  ],
})

createApp(App).use(router).use(ds).mount('#app')

import Home from '@/views/Home.vue'; // Exemplo de componente existente
import Projetos from '@/views/Projetos.vue'; // Página de projetos
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/projetos', // Rota para a página de projetos
    name: 'Projetos',
    component: Projetos,
  },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  

export default router;
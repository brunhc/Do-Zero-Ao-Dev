import Home from '@/views/Home.vue'; // Exemplo de componente existente
import Projetos from '@/views/Projetos.vue'; // Página de projetos
import ConversorPrecos from '@/views/projetos/ConversorPrecos.vue';
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
  {
    path: '/conversor-precos',
    name: 'Conversor de preços',
    component: ConversorPrecos,
  }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  

export default router;
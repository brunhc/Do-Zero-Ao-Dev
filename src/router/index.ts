import Home from '@/views/Home.vue';
import Projetos from '@/views/Projetos.vue';
import CalculadoraRPA from '@/views/projetos/CalculadoraRPA.vue';
import ConversorPrecos from '@/views/projetos/ConversorPrecos.vue';
import PrecoPorHoraTrabalhada from '@/views/projetos/PrecoPorHoraTrabalhada.vue'; // NOVO IMPORT
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/projetos',
    name: 'Projetos',
    component: Projetos,
  },
  {
    path: '/conversor-precos',
    name: 'Conversor de preços',
    component: ConversorPrecos,
  },
  {
    path: '/calculadora-rpa',
    name: 'Calculadora RPA Bidirecional',
    component: CalculadoraRPA,
  },
  {
    path: '/preco-por-hora', // NOVA ROTA
    name: 'Preço por Hora Trabalhada',
    component: PrecoPorHoraTrabalhada,
  }
];

const router = createRouter({
  history: createWebHistory('/Do-Zero-Ao-Dev/'),
  routes,
});

export default router;
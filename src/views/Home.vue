<template>
    <div class="home">
      <h1>Bem-vindo ao Meu Portfólio</h1>
      <p>Esta é a página inicial. Aqui você pode conhecer mais sobre mim e meus projetos.</p>
      <router-link to="/projetos" class="btn">Ver Projetos</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomePage',
  };
  </script>
  
  <style scoped>
  .home {
    text-align: center;
    padding: 20px;
  }
  h1 {
    color: #2c3e50;
  }
  .btn {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    text-decoration: none;
    border-radius: 5px;
  }
  .btn:hover {
    background-color: #3aa876;
  }
  </style>
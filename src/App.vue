<template>
  <div id="app">
    <!-- Seu cabeçalho estático -->
    <header>
      <h1>Bem-vindo ao Meu Site Simples</h1>
    </header>

    <!-- Sua navegação estática + links do Vue Router -->
    <nav class="main-nav">
      <a href="#">Início</a> |
      <a href="#">Sobre</a> |
      <a href="#">Serviços</a> |
      <a href="#">Contato</a> |
      <router-link to="/">Home</router-link> |
      <router-link to="/projetos">Projetos</router-link>
    </nav>

    <!-- Área dinâmica do Vue Router -->
    <router-view />

    <!-- Seu rodapé estático -->
    <footer>
      <p>&copy; 2023 Meu Site Simples. Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Estilos do seu index.html original + ajustes para o Vue */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}
header {
  background-color: #333;
  color: #fff;
  padding: 10px 0;
  text-align: center;
}
.main-nav {
  margin: 20px;
  text-align: center;
}
.main-nav a {
  margin: 0 15px;
  text-decoration: none;
  color: #333;
}
.main-nav a:hover {
  color: #007BFF;
}
footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 10px 0;
  position: fixed;
  width: 100%;
  bottom: 0;
}

/* Estilos originais do Vue (opcional) */
#app {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 60px; /* Ajuste para o rodapé fixo */
}
.router-link-exact-active {
  color: #42b983 !important;
  font-weight: bold;
}
</style>
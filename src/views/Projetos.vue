<template>
  <div>
    <h1>Meus Projetos</h1>
    <p>Esta é a página onde listarei meus projetos.</p>
    <ul>
      <li><router-link to="/conversor-precos">📊 Conversor de Preços</router-link></li>
      <li><router-link to="/calculadora-rpa">🧮 Calculadora RPA Bidirecional</router-link></li>
      <li><router-link to="/preco-por-hora">⏰ Preço por Hora Trabalhada</router-link></li>
      <li><a href="#">⚙️ Projeto 4 (em breve)</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ProjectsPage',
};
</script>

<style scoped>
h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

p {
  color: #4a5568;
  margin-bottom: 30px;
}

ul {
  list-style-type: none;
  padding: 0;
  max-width: 400px;
}

li {
  margin: 15px 0;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s;
}

li:hover {
  transform: translateX(5px);
  background-color: #e9ecef;
}

a {
  color: #2c3e50;
  text-decoration: none;
  font-size: 1.1rem;
  display: block;
}

.router-link-exact-active {
  color: #42b983;
  font-weight: bold;
}

a:hover {
  text-decoration: none;
}
</style>
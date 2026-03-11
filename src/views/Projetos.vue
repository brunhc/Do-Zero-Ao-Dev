<template>
  <div>
    <h1>Meus Projetos</h1>
    <p>Esta é a página onde listarei meus projetos.</p>
    <ul>
      <li><router-link to="/conversor-precos">Conversor</router-link></li>
      <li><router-link to="/calculadora-rpa">Calculadora RPA Bidirecional</router-link></li>
      <li><a href="#">Projeto 3</a></li>
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
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

a {
  color: #42b983;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
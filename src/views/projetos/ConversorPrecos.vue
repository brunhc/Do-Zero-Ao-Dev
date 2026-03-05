<template>
  <div class="conversor-preco">
    <div class="produtos-container">
      <div class="produto1">
        <div class="preco">
          <h2>
            Informe o preço
          </h2>
          <input
            :value="precoFormatado1"
            @input="atualizarPreco1"
            inputmode="numeric"
            placeholder="Preço" />
        </div>
        <div class="quantidade">
          <h2>
            Informe a quantidade
          </h2>
    
          <div class="quantidade-inputs">
            <input
              v-model.number="quantidade1"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
            />
    
            <select v-model="unidade1">
              <option value="g">  g (gramas)</option>
              <option value="kg"> kg (quilos)</option>
              <option value="L">  L (litros)</option>
              <option value="un"> un (unidades)</option>
            </select>
          </div>
    
          <p v-if="quantidade1 && precoEmCentavos1" class="resultado">
            Preço por {{ unidade1 }}: <strong>{{ precoPorUnidade1 }}</strong>
          </p>
        </div>
      </div>

      <div class="produto2">
        <div class="preco">
          <h2>
            Informe o preço
          </h2>
          <input
            :value="precoFormatado2"
            @input="atualizarPreco2"
            inputmode="numeric"
            placeholder="Preço"
          />
        </div>
        <div class="quantidade">
          <h2>
            Informe a quantidade
          </h2>
    
          <div class="quantidade-inputs">
            <input
              v-model.number="quantidade2"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
            />
    
            <select v-model="unidade2">
              <option value="g">  g (gramas)</option>
              <option value="kg"> kg (quilos)</option>
              <option value="L">  L (litros)</option>
              <option value="un"> un (unidades)</option>
            </select>
          </div>
    
          <p v-if="quantidade2 && precoEmCentavos2" class="resultado">
            Preço por {{ unidade2 }}: <strong>{{ precoPorUnidade2 }}</strong>
          </p>
        </div>
      </div>
    </div>

    <div v-if="produtosValidos" class="comparativo">
      <h2>📊 Comparativo</h2>

       <div class="valores-base">
        <p>Produto 1: {{ precoPorUnidade1 }} / {{ unidade1 }}</p>
        <p>Produto 2: {{ precoPorUnidade2 }} / {{ unidade2 }}</p>
      </div>

      <div class="conversao" v-if="unidade1 !== unidade2">
        <p>⚖️ Convertendo para a mesma unidade...</p>
        <div class="resultado-conversao">
          <p>Produto 1: <strong>{{ precoConvertido1 }}</strong> / kg</p>
          <p>Produto 2: <strong>{{ precoConvertido2 }}</strong> / kg</p>
        </div>
      </div>
       <div class="melhor-opcao" :class="melhorProdutoClass">
        <h3>{{ mensagemMelhorOpcao }}</h3>
        <p class="diferenca" v-if="diferencaPreco">
          Diferença: {{ diferencaPreco }} ({{ percentualDiferenca }}%)
        </p>
      </div>
    </div>
    <div v-else class="comparativo aviso">
      ⚠️ Preencha os dados dos dois produtos para ver a comparação
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const precoEmCentavos1 = ref<number>(0);
const quantidade1 = ref<number>(0);
const unidade1 = ref<string>('kg');

const precoEmCentavos2 = ref<number>(0);
const quantidade2 = ref<number>(0);
const unidade2 = ref<string>('kg');

const precoFormatado1 = computed(() => formatarMoeda(precoEmCentavos1.value));
const precoFormatado2 = computed(() => formatarMoeda(precoEmCentavos2.value));

const precoPorUnidade1 = computed(() => calcularPrecoPorUnidade(precoEmCentavos1.value, quantidade1.value));
const precoPorUnidade2 = computed(() => calcularPrecoPorUnidade(precoEmCentavos2.value, quantidade2.value));

const precoConvertido1 = computed(() => {
  return formatarMoeda(converterParaKg(precoEmCentavos1.value, quantidade1.value, unidade1.value));
});

const precoConvertido2 = computed(() => {
  return formatarMoeda(converterParaKg(precoEmCentavos2.value, quantidade2.value, unidade2.value));
});

const produtosValidos = computed(() => {
  return precoEmCentavos1.value > 0 &&
         quantidade1.value > 0 &&
         precoEmCentavos2.value > 0 &&
         quantidade2.value > 0;
});

const melhorProduto = computed(() => {
  if(!produtosValidos.value) return null;

  const valor1 = converterParaKg(precoEmCentavos1.value, quantidade1.value, unidade1.value);
  const valor2 = converterParaKg(precoEmCentavos2.value, quantidade2.value, unidade2.value);

  if(valor1 < valor2) return 1;
  if(valor2 < valor1) return 2;
  return 0; //Em caso de empate
});

const mensagemMelhorOpcao = computed(() => {
  switch(melhorProduto.value){
    case 1: return '✅ Produto 1 é mais vantajoso!';
    case 2: return '✅ Produto 2 é mais vantajoso!';
    case 0: return '⚖️ Produtos equivalentes!';
    default: return 'Preencha os dados para a comparação';
  }
});

const melhorProdutoClass = computed(() => {
  switch(melhorProduto.value){
    case 1: return 'vantagem-produto1';
    case 2: return 'vantagem-produto2';
    default: return '';
  }
});

const diferencaPreco = computed(() => {
  if (!produtosValidos.value || melhorProduto.value === 0) return null;

  const valor1 = converterParaKg(precoEmCentavos1.value, quantidade1.value, unidade1.value);
  const valor2 = converterParaKg(precoEmCentavos2.value, quantidade2.value, unidade2.value);

  const diferenca = Math.abs(valor1 - valor2);
  return formatarMoeda(diferenca);
});

const percentualDiferenca = computed(() => {
  if (!produtosValidos.value || melhorProduto.value === 0) return null;

  const valor1 = converterParaKg(precoEmCentavos1.value, quantidade1.value, unidade1.value);
  const valor2 = converterParaKg(precoEmCentavos2.value, quantidade2.value, unidade2.value);

  const maior = Math.max(valor1, valor2);
  const menor = Math.min(valor1, valor2);

  return ((maior - menor) / menor * 100).toFixed(1);
});

function formatarMoeda(valorEmCentavos: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valorEmCentavos / 100)
}

function calcularPrecoPorUnidade(preco: number, quantidade: number): string {
  if(!quantidade || quantidade <= 0 || !preco) return 'R$ 0,00';
  return formatarMoeda(preco / quantidade);
}

function converterParaKg(preco: number, quantidade: number, unidade: string): number
{
  if(!quantidade || quantidade <= 0 || !preco) return 0;

  let quantidadeEmKg = quantidade;

  switch(unidade) {
    case 'g':
      quantidadeEmKg = quantidade / 1000;
      break;
    case 'kg':
      quantidadeEmKg = quantidade;
      break;
    case 'L':
      quantidadeEmKg = quantidade;
      break;
    case 'un':
      return preco / quantidade;
  }

  return preco / quantidadeEmKg;
}

function atualizarPreco1(event: Event) {
  const input = event.target as HTMLInputElement
  const somenteNumeros = input.value.replace(/\D/g, '')
  precoEmCentavos1.value = Number(somenteNumeros)
}

function atualizarPreco2(event: Event) {
  const input = event.target as HTMLInputElement
  const somenteNumeros = input.value.replace(/\D/g, '')
  precoEmCentavos2.value = Number(somenteNumeros)
}
</script>

<style scoped>
.conversor-preco {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.produtos-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 30px;
  margin-bottom: 40px;
}

/* 📱 MEDIA QUERY PARA CELULAR */
@media (max-width: 768px) {
  .produtos-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .produto1, .produto2 {
    width: 100%;
    min-width: auto;
  }
  
  .quantidade-inputs {
    flex-wrap: wrap;
  }
  
  input[type="number"] {
    width: 100%;
  }
  
  select {
    width: 100%;
  }
  
  .valores-base {
    flex-direction: column;
    gap: 10px;
  }
  
  .resultado-conversao {
    flex-direction: column;
    gap: 10px;
  }
  
  /* Ajusta fonte para celular */
  h2 {
    font-size: 1.3rem;
  }
  
  .melhor-opcao h3 {
    font-size: 1.2rem;
  }
}

.produto1, .produto2 {
  flex: 1;
  padding: 20px;
  border: 2px solid #333;
  border-radius: 8px;
  min-width: 300px;
}

.produto1 {
  background-color: #e6f3ff;
}

.produto2 {
  background-color: #fff0e6;
}

h2 {
  margin-top: 0;
  color: #333;
  text-align: center;
}

.preco, .quantidade {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.quantidade-inputs {
  display: flex;
  gap: 10px;
  align-items: center;
}

input, select {
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type="number"] {
  width: 120px;
}

select {
  width: 100px;
  background-color: white;
  cursor: pointer;
}

input:focus, select:focus {
  outline: none;
  border-color: #42b983;
}

.resultado {
  margin-top: 10px;
  padding: 8px;
  background-color: rgba(66, 185, 131, 0.1);
  border-radius: 4px;
  font-size: 0.95rem;
}

.resultado strong {
  color: #42b983;
  font-size: 1.1rem;
}

.comparativo {
  margin-top: 40px;
  padding: 30px;
  border: 2px solid #42b983;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
}

.comparativo.aviso {
  border-color: #ff9800;
  background-color: #fff3e0;
  color: #ff9800;
  font-size: 1.2rem;
}

.valores-base {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
}

.conversao {
  margin: 20px 0;
  padding: 15px;
  background-color: #e3f2fd;
  border-radius: 4px;
}

.resultado-conversao {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.melhor-opcao {
  margin-top: 30px;
  padding: 20px;
  border-radius: 8px;
  background-color: white;
}

.melhor-opcao h3 {
  font-size: 1.5rem;
  margin: 0 0 10px 0;
}

.vantagem-produto1 h3 {
  color: #2196f3;
}

.vantagem-produto2 h3 {
  color: #ff5722;
}

.diferenca {
  font-size: 1.2rem;
  color: #666;
  margin: 10px 0 0 0;
}
</style>
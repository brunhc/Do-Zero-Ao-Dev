<template>
  <div class="horas-trabalho">
    <h1>⏰ Horas de Trabalho por Produto</h1>
    <p class="subtitulo">Descubra quantas horas você precisa trabalhar para comprar algo</p>

    <div class="container-calculadora">
      <!-- Painel de Escolha do Tipo de Salário -->
      <div class="painel-escolha">
        <h2>⚙️ Configuração do Salário</h2>
        
        <div class="radio-group">
          <label class="radio-option">
            <input 
              type="radio" 
              v-model="tipoSalario" 
              value="bruto"
            />
            <span class="radio-label">
              <strong>💰 Salário Bruto</strong>
              <small>Valor total antes dos descontos</small>
            </span>
          </label>
          
          <label class="radio-option">
            <input 
              type="radio" 
              v-model="tipoSalario" 
              value="liquido"
            />
            <span class="radio-label">
              <strong>💵 Salário Líquido</strong>
              <small>Valor que cai na conta (após descontos)</small>
            </span>
          </label>
        </div>
      </div>

      <!-- Painel de Entrada de Dados -->
      <div class="painel-entrada" :class="{ 'modo-bruto': tipoSalario === 'bruto', 'modo-liquido': tipoSalario === 'liquido' }">
        <h2>{{ tituloSalario }}</h2>
        
        <div class="input-group">
          <label>{{ labelSalario }} (R$)</label>
          <div class="input-wrapper">
            <span class="simbolo">R$</span>
            <input 
              v-model="salarioTexto"
              @input="processarSalario"
              @blur="formatarSalario"
              inputmode="numeric"
              placeholder="0,00"
            />
          </div>
        </div>

        <div class="input-group">
          <label>⏱️ Horas trabalhadas por dia</label>
          <div class="input-wrapper small">
            <input 
              v-model.number="horasPorDia"
              type="number"
              min="1"
              max="24"
              step="0.5"
              placeholder="8"
            />
            <span class="unidade">horas/dia</span>
          </div>
        </div>

        <div class="input-group">
          <label>📅 Dias trabalhados por mês</label>
          <div class="input-wrapper small">
            <input 
              v-model.number="diasPorMes"
              type="number"
              min="1"
              max="31"
              step="1"
              placeholder="22"
            />
            <span class="unidade">dias/mês</span>
          </div>
        </div>

        <div class="info-box" v-if="tipoSalario === 'bruto' && valorSalario > 0">
          <p>✨ Estimativa de salário líquido: <strong>{{ formatarMoeda(salarioLiquidoEstimado) }}</strong></p>
          <small>Baseado em INSS (11%) e IRRF médio de 15%</small>
        </div>
      </div>

      <!-- Painel do Produto -->
      <div class="painel-produto">
        <h2>🛒 Valor do Produto</h2>
        
        <div class="input-group">
          <label>Preço do produto (R$)</label>
          <div class="input-wrapper">
            <span class="simbolo">R$</span>
            <input 
              v-model="produtoTexto"
              @input="processarProduto"
              @blur="formatarProduto"
              inputmode="numeric"
              placeholder="0,00"
            />
          </div>
        </div>
      </div>

      <!-- Resultado -->
      <div v-if="valorSalario > 0 && valorProduto > 0" class="painel-resultado">
        <h2>📊 Resultado</h2>
        
        <div class="card-destaque" :class="{ 'modo-bruto': tipoSalario === 'bruto', 'modo-liquido': tipoSalario === 'liquido' }">
          <div class="label">Você precisa trabalhar:</div>
          <div class="valor-destaque">{{ resultadoHoras }}</div>
          <div class="detalhe-horas">
            <span v-if="horasInteiras > 0">{{ horasInteiras }} horas</span>
            <span v-if="horasInteiras > 0 && minutosRestantes > 0"> e </span>
            <span v-if="minutosRestantes > 0">{{ minutosRestantes }} minutos</span>
          </div>
          <small>para comprar este produto</small>
        </div>

        <!-- Comparativos -->
        <div class="comparativos">
          <h3>📈 Comparação</h3>
          
          <div class="comparativo-item">
            <span>Em dias de trabalho:</span>
            <strong>{{ diasTrabalho }} dia{{ diasTrabalho !== '1' ? 's' : '' }}</strong>
          </div>
          
          <div class="comparativo-item" v-if="parseFloat(diasTrabalho) > 1">
            <span>Equivalente a:</span>
            <strong>{{ semanasTrabalho }} semana{{ semanasTrabalho !== '1' ? 's' : '' }}</strong>
          </div>
          
          <div class="comparativo-item">
            <span>Percentual do salário:</span>
            <strong>{{ percentualSalario }}%</strong>
          </div>
          
          <div class="comparativo-item">
            <span>Valor da sua hora:</span>
            <strong>{{ formatarMoeda(valorHora) }}</strong>
          </div>
        </div>

        <!-- Produtos equivalentes -->
        <div class="produtos-equivalentes" v-if="valorProduto > 0">
          <h3>🔄 Com o mesmo valor, você poderia comprar:</h3>
          <ul>
            <li v-if="valorProduto >= 5">🎫 {{ Math.floor(valorProduto / 5) }} passagem{{ Math.floor(valorProduto / 5) !== 1 ? 'ns' : '' }} de ônibus</li>
            <li v-if="valorProduto >= 10">☕ {{ Math.floor(valorProduto / 10) }} café{{ Math.floor(valorProduto / 10) !== 1 ? 's' : '' }}</li>
            <li v-if="valorProduto >= 25">🍔 {{ Math.floor(valorProduto / 25) }} lanche{{ Math.floor(valorProduto / 25) !== 1 ? 's' : '' }}</li>
            <li v-if="valorProduto >= 50">🍽️ {{ Math.floor(valorProduto / 50) }} refeição{{ Math.floor(valorProduto / 50) !== 1 ? 'ões' : '' }} em restaurante</li>
          </ul>
        </div>

        <!-- Mensagem motivacional corrigida -->
        <div class="mensagem-motivacional" :class="classeMotivacional">
          <p>{{ mensagemMotivacional }}</p>
        </div>
      </div>

      <!-- Aviso para valores inválidos -->
      <div v-else class="painel-resultado aviso">
        <p>⚡ Preencha o salário e o preço do produto para ver o resultado</p>
      </div>
    </div>

    <!-- Tabela de referência -->
    <div class="tabela-referencia">
      <h3>📈 Quanto tempo você gasta comprando coisas?</h3>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço médio</th>
            <th>Horas de trabalho</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>☕ Café simples</td>
            <td>R$ 8,00</td>
            <td>{{ calcularExemplo(8) }}</td>
          </tr>
          <tr>
            <td>🍔 Lanche rápido</td>
            <td>R$ 25,00</td>
            <td>{{ calcularExemplo(25) }}</td>
          </tr>
          <tr>
            <td>👕 Camiseta</td>
            <td>R$ 80,00</td>
            <td>{{ calcularExemplo(80) }}</td>
          </tr>
          <tr>
            <td>🎮 Jogo de videogame</td>
            <td>R$ 250,00</td>
            <td>{{ calcularExemplo(250) }}</td>
          </tr>
          <tr>
            <td>📱 Celular</td>
            <td>R$ 2.500,00</td>
            <td>{{ calcularExemplo(2500) }}</td>
          </tr>
          <tr>
            <td>✈️ Viagem nacional</td>
            <td>R$ 5.000,00</td>
            <td>{{ calcularExemplo(5000) }}</td>
          </tr>
        </tbody>
      </table>
      <small>*Baseado no seu salário e jornada de trabalho</small>
    </div>

    <!-- Informações legais -->
    <div class="info-legal">
      <p>
        <strong>📌 Como funciona o cálculo:</strong><br>
        • Valor da hora = Salário ÷ (horas por dia × dias por mês)<br>
        • Horas necessárias = Preço do produto ÷ valor da hora<br>
        • Para salário bruto, consideramos INSS (11%) e IRRF médio de 15% como estimativa<br>
        • Use salário líquido para resultado mais preciso
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// ============ DADOS REATIVOS COM TIPAGEM CORRETA ============
const tipoSalario = ref<'bruto' | 'liquido'>('liquido');
const salarioTexto = ref<string>('3.000,00');
const salarioNumerico = ref<number>(3000);
const produtoTexto = ref<string>('100,00');
const produtoNumerico = ref<number>(100);
const horasPorDia = ref<number>(8);
const diasPorMes = ref<number>(22);

// ============ CONSTANTES ============
const ALIQUOTA_INSS = 0.11;
const ALIQUOTA_IRRF_MEDIA = 0.15; // Estimativa média

// ============ FUNÇÕES DE FORMATAÇÃO ============
function converterParaNumero(valorTexto: string): number {
  if (!valorTexto) return 0;
  let textoLimpo = valorTexto.replace(/[R$\s]/g, '');
  textoLimpo = textoLimpo.replace(/\./g, '').replace(',', '.');
  const numero = parseFloat(textoLimpo);
  return isNaN(numero) ? 0 : numero;
}

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

function formatarNumeroBrasileiro(valor: number): string {
  return valor.toFixed(2).replace('.', ',');
}

function processarSalario() {
  let valor = salarioTexto.value.replace(/[^\d,.]/g, '');
  const partes = valor.split(/[,.]/);
  if (partes.length > 2) {
    valor = partes[0] + ',' + partes.slice(1).join('');
  }
  salarioTexto.value = valor;
  const numero = converterParaNumero(valor);
  if (!isNaN(numero) && numero !== salarioNumerico.value) {
    salarioNumerico.value = numero;
  }
}

function formatarSalario() {
  if (salarioNumerico.value > 0) {
    salarioTexto.value = formatarNumeroBrasileiro(salarioNumerico.value);
  } else {
    salarioTexto.value = '';
  }
}

function processarProduto() {
  let valor = produtoTexto.value.replace(/[^\d,.]/g, '');
  const partes = valor.split(/[,.]/);
  if (partes.length > 2) {
    valor = partes[0] + ',' + partes.slice(1).join('');
  }
  produtoTexto.value = valor;
  const numero = converterParaNumero(valor);
  if (!isNaN(numero) && numero !== produtoNumerico.value) {
    produtoNumerico.value = numero;
  }
}

function formatarProduto() {
  if (produtoNumerico.value > 0) {
    produtoTexto.value = formatarNumeroBrasileiro(produtoNumerico.value);
  } else {
    produtoTexto.value = '';
  }
}

// ============ PROPRIEDADES COMPUTADAS CORRIGIDAS ============
const tituloSalario = computed<string>(() => {
  return tipoSalario.value === 'bruto' 
    ? '💰 Informe seu salário bruto'
    : '💵 Informe seu salário líquido';
});

const labelSalario = computed<string>(() => {
  return tipoSalario.value === 'bruto' 
    ? 'Salário Bruto'
    : 'Salário Líquido';
});

const valorSalario = computed<number>(() => salarioNumerico.value);
const valorProduto = computed<number>(() => produtoNumerico.value);

// Estimativa de salário líquido (para salário bruto)
const salarioLiquidoEstimado = computed<number>(() => {
  if (tipoSalario.value === 'liquido') return valorSalario.value;
  
  // Garante que valorSalario é número
  const salario = Number(valorSalario.value) || 0;
  
  // Cálculo aproximado: bruto - INSS - IRRF médio
  const inss = salario * ALIQUOTA_INSS;
  const baseIRRF = salario - inss;
  const irrfEstimado = baseIRRF * ALIQUOTA_IRRF_MEDIA;
  
  return Math.max(0, salario - inss - irrfEstimado);
});

// Salário considerado para cálculo (sempre líquido)
const salarioParaCalculo = computed<number>(() => {
  if (tipoSalario.value === 'liquido') return Number(valorSalario.value) || 0;
  return Number(salarioLiquidoEstimado.value) || 0;
});

// Total de horas trabalhadas no mês
const horasPorMes = computed<number>(() => {
  const horas = Number(horasPorDia.value) || 0;
  const dias = Number(diasPorMes.value) || 0;
  return horas * dias;
});

// Valor da hora de trabalho
const valorHora = computed<number>(() => {
  const horas = horasPorMes.value;
  const salario = salarioParaCalculo.value;
  if (horas === 0 || salario === 0) return 0;
  return salario / horas;
});

// Horas necessárias para comprar o produto
const horasNecessarias = computed<number>(() => {
  const hora = valorHora.value;
  const produto = Number(valorProduto.value) || 0;
  if (hora === 0 || produto === 0) return 0;
  return produto / hora;
});

// Formatação do resultado em horas e minutos
const horasInteiras = computed<number>(() => {
  return Math.floor(horasNecessarias.value);
});

const minutosRestantes = computed<number>(() => {
  const minutosDecimais = (horasNecessarias.value - horasInteiras.value) * 60;
  return Math.round(minutosDecimais);
});

const resultadoHoras = computed<string>(() => {
  const horas = horasNecessarias.value;
  if (horas < 1) {
    const minutos = Math.round(horas * 60);
    return `${minutos} minuto${minutos !== 1 ? 's' : ''}`;
  }
  
  if (minutosRestantes.value === 0) {
    return `${horasInteiras.value} hora${horasInteiras.value !== 1 ? 's' : ''}`;
  }
  
  return `${horasInteiras.value} hora${horasInteiras.value !== 1 ? 's' : ''} e ${minutosRestantes.value} minuto${minutosRestantes.value !== 1 ? 's' : ''}`;
});

// Dias de trabalho
const diasTrabalho = computed<string>(() => {
  return (horasNecessarias.value / Number(horasPorDia.value || 1)).toFixed(1);
});

const semanasTrabalho = computed<string>(() => {
  return (parseFloat(diasTrabalho.value) / 5).toFixed(1);
});

// Percentual do salário
const percentualSalario = computed<string>(() => {
  const salario = salarioParaCalculo.value;
  const produto = Number(valorProduto.value) || 0;
  if (salario === 0) return '0';
  return ((produto / salario) * 100).toFixed(1);
});

// Mensagem motivacional
const mensagemMotivacional = computed<string>(() => {
  const percentual = parseFloat(percentualSalario.value) || 0;
  
  if (percentual < 0.5) return '🌟 É muito barato! Menos de 1% do seu salário!';
  if (percentual < 1) return '✨ É bem acessível! Cerca de 1% do seu salário.';
  if (percentual < 5) return '👍 Cabe no orçamento! Menos de 5% do seu salário.';
  if (percentual < 10) return '🤔 É um gasto moderado. Pense bem antes de comprar.';
  if (percentual < 20) return `⚠️ É um gasto significativo! Quase ${percentual.toFixed(1)}% do seu salário.`;
  return '🔥 É um investimento pesado! Mais de 20% do seu salário.';
});

const classeMotivacional = computed<string>(() => {
  const percentual = parseFloat(percentualSalario.value) || 0;
  
  if (percentual < 1) return 'barato';
  if (percentual > 10) return 'caro';
  return '';
});

// Função para exemplos na tabela
function calcularExemplo(preco: number): string {
  const hora = valorHora.value;
  if (hora === 0) return '-';
  
  const horas = preco / hora;
  
  if (horas < 1) {
    return `${Math.round(horas * 60)} min`;
  }
  
  const hrs = Math.floor(horas);
  const mins = Math.round((horas - hrs) * 60);
  
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h${mins}`;
}

// ============ WATCH ============
watch([tipoSalario, salarioNumerico, produtoNumerico, horasPorDia, diasPorMes], () => {
  // Apenas para garantir reatividade
});
</script>

<style scoped>
.horas-trabalho {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  color: #2c3e50;
  margin-bottom: 5px;
  font-size: 2rem;
}

.subtitulo {
  color: #7f8c8d;
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.container-calculadora {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.painel-escolha {
  padding: 30px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.painel-escolha h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #495057;
  font-size: 1.3rem;
}

.radio-group {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.radio-option {
  flex: 1;
  min-width: 250px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background-color: white;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.radio-option:hover {
  border-color: #f39c12;
  background-color: #fff9f0;
}

.radio-option input[type="radio"] {
  margin-top: 3px;
  accent-color: #f39c12;
  width: 18px;
  height: 18px;
}

.radio-label {
  display: flex;
  flex-direction: column;
}

.radio-label strong {
  color: #2c3e50;
  margin-bottom: 5px;
}

.radio-label small {
  color: #6c757d;
  font-size: 0.85rem;
}

.painel-entrada {
  padding: 30px;
  transition: all 0.3s;
}

.painel-entrada.modo-bruto {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: white;
}

.painel-entrada.modo-liquido {
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
  color: white;
}

.painel-produto {
  padding: 30px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
}

.painel-entrada h2, .painel-produto h2 {
  color: white;
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 1.5rem;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  opacity: 0.9;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.2);
}

.input-wrapper.small {
  max-width: 250px;
}

.simbolo {
  padding: 10px 15px;
  background-color: #f0f0f0;
  color: #333;
  font-weight: bold;
}

.unidade {
  padding: 10px 15px;
  background-color: #f0f0f0;
  color: #333;
  font-weight: 500;
}

.input-wrapper input {
  flex: 1;
  padding: 10px 15px;
  border: none;
  font-size: 1.1rem;
  outline: none;
}

.input-wrapper input:focus {
  background-color: #f8f8f8;
}

.input-wrapper input[type="number"] {
  text-align: right;
}

.info-box {
  margin-top: 20px;
  padding: 15px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 8px;
  font-size: 0.95rem;
}

.info-box strong {
  font-size: 1.2rem;
}

.info-box small {
  display: block;
  margin-top: 5px;
  opacity: 0.8;
}

.painel-resultado {
  padding: 40px;
  background-color: white;
}

.painel-resultado.aviso {
  text-align: center;
  color: #7f8c8d;
  font-size: 1.2rem;
  padding: 60px;
}

.card-destaque {
  text-align: center;
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  margin-bottom: 30px;
}

.card-destaque.modo-bruto {
  background: linear-gradient(135deg, #fef5e7 0%, #fdebd0 100%);
  border-left: 4px solid #f39c12;
}

.card-destaque.modo-liquido {
  background: linear-gradient(135deg, #e9f7ef 0%, #d5f0e0 100%);
  border-left: 4px solid #27ae60;
}

.label {
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 10px;
}

.valor-destaque {
  font-size: 3rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 5px;
}

.detalhe-horas {
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 5px;
}

.card-destaque small {
  color: #718096;
}

.comparativos {
  margin: 30px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.comparativos h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2d3748;
}

.comparativo-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed #cbd5e0;
}

.comparativo-item:last-child {
  border-bottom: none;
}

.comparativo-item strong {
  color: #2c3e50;
  font-size: 1.1rem;
}

.produtos-equivalentes {
  margin: 30px 0;
  padding: 20px;
  background-color: #ebf8ff;
  border-radius: 8px;
}

.produtos-equivalentes h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2b6cb0;
}

.produtos-equivalentes ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.produtos-equivalentes li {
  padding: 8px 0;
  border-bottom: 1px solid #bee3f8;
}

.produtos-equivalentes li:last-child {
  border-bottom: none;
}

.mensagem-motivacional {
  margin-top: 30px;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
}

.mensagem-motivacional.caro {
  background-color: #fff5f5;
  color: #c53030;
  border-left: 4px solid #fc8181;
}

.mensagem-motivacional.barato {
  background-color: #f0fff4;
  color: #276749;
  border-left: 4px solid #9ae6b4;
}

.tabela-referencia {
  margin-top: 30px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.tabela-referencia h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2d3748;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px;
  background-color: #4a5568;
  color: white;
  font-weight: 500;
}

td {
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background-color: #f7fafc;
}

.info-legal {
  margin-top: 30px;
  padding: 20px;
  background-color: #fefcbf;
  border-radius: 8px;
  color: #744210;
  font-size: 0.9rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .radio-group {
    flex-direction: column;
    gap: 15px;
  }
  
  .valor-destaque {
    font-size: 2rem;
  }
  
  .detalhe-horas {
    font-size: 1.2rem;
  }
  
  .input-wrapper.small {
    max-width: 100%;
  }
  
  table {
    font-size: 0.85rem;
  }
  
  th, td {
    padding: 8px 4px;
  }
}
</style>
<template>
  <div class="rpa-calculator">
    <h1>📘 Calculadora RPA - Professor</h1>
    <p class="subtitulo">Faculdade em Curitiba - Contratação por RPA</p>
    
    <!-- AVISO DA NOVA TABELA -->
    <div class="info-legal" style="margin-top: 0; margin-bottom: 20px; background-color: #e6f3ff;">
      <p>
        <strong>🆕 NOVA TABELA IR 2026 EM VIGOR</strong> - Isenção total até R$ 5.000/mês | Redução gradual até R$ 7.350
      </p>
    </div>
    
    <div class="container-calculadora">
      <!-- Painel de Escolha do Tipo de Cálculo -->
      <div class="painel-escolha">
        <h2>⚙️ Escolha como deseja calcular</h2>
        
        <div class="radio-group">
          <label class="radio-option">
            <input 
              type="radio" 
              v-model="tipoCalculo" 
              value="liquidoParaBruto"
            />
            <span class="radio-label">
              <strong>💰 Calcular a partir do LÍQUIDO</strong>
              <small>Informo quanto quero receber líquido e descubro o bruto</small>
            </span>
          </label>
          
          <label class="radio-option">
            <input 
              type="radio" 
              v-model="tipoCalculo" 
              value="brutoParaLiquido"
            />
            <span class="radio-label">
              <strong>📄 Calcular a partir do BRUTO</strong>
              <small>Informo o valor do RPA e descubro o líquido</small>
            </span>
          </label>
        </div>
      </div>

      <!-- Painel de Entrada -->
      <div class="painel-entrada" :class="{ 'modo-liquido': tipoCalculo === 'liquidoParaBruto', 'modo-bruto': tipoCalculo === 'brutoParaLiquido' }">
        <h2>{{ tituloEntrada }}</h2>
        
        <div class="input-group">
          <label>{{ labelEntrada }} (R$)</label>
          <div class="input-wrapper">
            <span class="simbolo">R$</span>
            <input 
              v-model="valorEntradaTexto"
              @input="processarEntrada"
              @blur="formatarEntrada"
              inputmode="numeric"
              placeholder="0,00"
            />
          </div>
          <small>{{ descricaoEntrada }}</small>
        </div>

        <div class="info-municipio">
          <span class="badge">📍 Curitiba - PR</span>
          <span class="badge">📚 Professor (Código 0319)</span>
          <span class="badge">🏛️ ISS 2%</span>
          <span class="badge" :class="{ 'ativo': tipoCalculo === 'liquidoParaBruto' }">🔄 Cálculo Reverso</span>
        </div>
      </div>

      <!-- Resultados -->
      <div v-if="valorEntradaNumerico > 0" class="painel-resultados">
        <h2>📊 Resultado da Simulação</h2>
        
        <!-- Card com destaque -->
        <div class="card-destaque" :class="{ 'modo-liquido': tipoCalculo === 'liquidoParaBruto' }">
          <div class="label">{{ labelDestaque }}</div>
          <div class="valor-destaque">{{ formatarMoeda(valorDestaque) }}</div>
          <small>{{ descricaoDestaque }}</small>
        </div>

        <!-- Benefício da nova tabela -->
        <div v-if="mostrarBeneficioIR" class="resultado" style="background-color: #e6f3ff; margin-bottom: 20px;">
          <p style="margin: 0;">
            <strong>✨ Benefício da nova tabela IR 2026:</strong> 
            Economia de {{ formatarMoeda(economiaIR) }} no IRRF
          </p>
        </div>

        <!-- Detalhamento dos Impostos -->
        <div class="detalhamento">
          <h3>🔍 Composição dos Valores</h3>
          
          <div class="tabela-valores">
            <div class="linha-valor bruto">
              <span>📄 Valor Bruto (RPA)</span>
              <span class="valor">{{ formatarMoeda(valorBruto) }}</span>
            </div>
            
            <div class="linha-valor inss">
              <span>🛡️ INSS (11%)</span>
              <span class="valor">- {{ formatarMoeda(valorINSS) }}</span>
            </div>
            
            <div class="linha-valor iss">
              <span>🏛️ ISS (2% - Curitiba)</span>
              <span class="valor">- {{ formatarMoeda(valorISS) }}</span>
            </div>
            
            <div class="linha-valor irrf">
              <span>📊 IRRF (Tabela 2026)</span>
              <span class="valor">- {{ formatarMoeda(valorIRRF) }}</span>
              <span v-if="redutorAplicado > 0" class="badge" style="margin-left: 8px; background-color: #9f7aea; color: white;">
                Redutor: R$ {{ redutorAplicado.toFixed(2) }}
              </span>
            </div>
            
            <div class="linha-total-impostos">
              <span>Total de Impostos</span>
              <span class="valor">{{ formatarMoeda(totalImpostos) }}</span>
            </div>
            
            <div class="linha-valor liquido">
              <span>💵 Valor Líquido</span>
              <span class="valor">{{ formatarMoeda(valorLiquido) }}</span>
            </div>
          </div>
        </div>

        <!-- Alíquotas Efetivas -->
        <div class="aliquotas">
          <div class="aliquota-item">
            <span>Carga Tributária Total</span>
            <strong>{{ cargaTributaria }}%</strong>
          </div>
          <div class="aliquota-item">
            <span>INSS Efetivo</span>
            <strong>{{ inssEfetivo }}%</strong>
          </div>
          <div class="aliquota-item">
            <span>IRRF Efetivo</span>
            <strong>{{ irrfEfetivo }}%</strong>
          </div>
        </div>

        <!-- Informação do modo atual -->
        <div class="modo-info" :class="{ 'reverso': tipoCalculo === 'liquidoParaBruto' }">
          <span v-if="tipoCalculo === 'liquidoParaBruto'">
            🔄 Para receber <strong>{{ formatarMoeda(valorLiquido) }}</strong> líquido,
            a faculdade deve emitir RPA de <strong>{{ formatarMoeda(valorBruto) }}</strong>
          </span>
          <span v-else>
            📄 Emitindo RPA de <strong>{{ formatarMoeda(valorBruto) }}</strong>,
            você receberá líquido <strong>{{ formatarMoeda(valorLiquido) }}</strong>
          </span>
        </div>
      </div>

      <!-- Aviso para valores inválidos -->
      <div v-else class="painel-resultados aviso">
        <p>⚡ Digite um valor para ver a simulação completa</p>
      </div>
    </div>

    <!-- Tabela de Referência Rápida -->
    <div class="tabela-referencia">
      <h3>📈 Referência Rápida - IR 2026</h3>
      
      <div class="referencia-tabs">
        <button 
          class="tab-btn" 
          :class="{ ativo: referenciaTab === 'bruto' }"
          @click="referenciaTab = 'bruto'"
        >
          Partindo do Bruto
        </button>
        <button 
          class="tab-btn" 
          :class="{ ativo: referenciaTab === 'liquido' }"
          @click="referenciaTab = 'liquido'"
        >
          Partindo do Líquido
        </button>
      </div>

      <table v-if="referenciaTab === 'bruto'">
        <thead>
          <tr>
            <th>Bruto (RPA)</th>
            <th>INSS (11%)</th>
            <th>ISS (2%)</th>
            <th>IRRF 2026</th>
            <th>Líquido</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="valor in valoresReferenciaBruto" :key="valor.bruto">
            <td>{{ formatarMoeda(valor.bruto) }}</td>
            <td>{{ formatarMoeda(valor.inss) }}</td>
            <td>{{ formatarMoeda(valor.iss) }}</td>
            <td>{{ formatarMoeda(valor.irrf) }}</td>
            <td><strong>{{ formatarMoeda(valor.liquido) }}</strong></td>
          </tr>
        </tbody>
      </table>

      <table v-else>
        <thead>
          <tr>
            <th>Líquido</th>
            <th>Bruto</th>
            <th>INSS (11%)</th>
            <th>ISS (2%)</th>
            <th>IRRF 2026</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="valor in valoresReferenciaLiquido" :key="valor.liquido">
            <td>{{ formatarMoeda(valor.liquido) }}</td>
            <td><strong>{{ formatarMoeda(valor.bruto) }}</strong></td>
            <td>{{ formatarMoeda(valor.inss) }}</td>
            <td>{{ formatarMoeda(valor.iss) }}</td>
            <td>{{ formatarMoeda(valor.irrf) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Informações Legais -->
    <div class="info-legal">
      <p>
        <strong>📌 Informações importantes - IR 2026:</strong><br>
        • INSS: 11% sobre o valor bruto (sem faixas progressivas - RPA)<br>
        • ISS: 2% fixo para professores em Curitiba (código 0319)<br>
        • <strong>IRRF 2026:</strong> Isenção total até R$ 5.000/mês | Redução gradual até R$ 7.350<br>
        • Redutor especial: R$ 978,62 - (0,133145 × renda mensal) para rendas entre R$ 5.000,01 e R$ 7.350<br>
        • Tabela base: 27,5% com dedução de R$ 908,73 para rendas acima de R$ 4.664,68<br>
        • Cálculo reverso com precisão de 1 centavo
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// ============ DADOS REATIVOS ============
const tipoCalculo = ref<'liquidoParaBruto' | 'brutoParaLiquido'>('brutoParaLiquido');
const valorEntradaTexto = ref<string>('5.000,00');
const valorEntradaNumerico = ref<number>(5000);
const referenciaTab = ref<'bruto' | 'liquido'>('bruto');
const redutorAplicado = ref<number>(0);
const economiaIR = ref<number>(0);

// Valores calculados
const valorBruto = ref<number>(0);
const valorLiquido = ref<number>(0);
const valorINSS = ref<number>(0);
const valorISS = ref<number>(0);
const valorIRRF = ref<number>(0);

// ============ CONSTANTES ============
const ALIQUOTA_INSS = 0.11; // 11% para RPA (diferente de CLT)
const ALIQUOTA_ISS = 0.02; // 2% (Curitiba)
const TETO_INSS = 7786.02; // Teto 2026

// TABELA IR 2026
const LIMITE_ISENCAO_TOTAL = 5000; // Isenção total até R$ 5.000
const LIMITE_REDUCAO = 7350; // Redução até R$ 7.350
const REDUTOR_A = 978.62;
const REDUTOR_B = 0.133145;

// Tabela base IR 2026
const TABELA_IR_2026 = [
  { ate: 2428.80, aliquota: 0, deducao: 0 },
  { ate: 2826.65, aliquota: 0.075, deducao: 182.16 },
  { ate: 3751.05, aliquota: 0.15, deducao: 394.16 },
  { ate: 4664.68, aliquota: 0.225, deducao: 675.49 },
  { ate: Infinity, aliquota: 0.275, deducao: 908.73 }
];

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

function processarEntrada() {
  // Pega apenas números do que foi digitado
  let numeros = valorEntradaTexto.value.replace(/\D/g, '');
  
  // Se não tem números, limpa o campo
  if (numeros.length === 0) {
    valorEntradaTexto.value = '';
    valorEntradaNumerico.value = 0;
    return;
  }
  
  // Converte para número inteiro (centavos)
  let valorEmCentavos = parseInt(numeros, 10);
  
  // Formata com 2 casas decimais
  // Exemplos:
  // 1 → 0,01
  // 12 → 0,12  
  // 123 → 1,23
  // 1234 → 12,34
  
  let reais = Math.floor(valorEmCentavos / 100);
  let centavos = valorEmCentavos % 100;
  
  // Garante que centavos tenha sempre 2 dígitos
  let centavosStr = centavos.toString().padStart(2, '0');
  
  // Formata com ponto de milhar a cada 3 dígitos nos reais
  let reaisStr = reais.toLocaleString('pt-BR');
  
  valorEntradaTexto.value = `${reaisStr},${centavosStr}`;
  
  // Atualiza o valor numérico (em reais)
  valorEntradaNumerico.value = reais + (centavos / 100);
}

function formatarEntrada() {
  if (valorEntradaNumerico.value > 0) {
    valorEntradaTexto.value = formatarNumeroBrasileiro(valorEntradaNumerico.value);
  } else {
    valorEntradaTexto.value = '';
  }
}

// ============ FUNÇÃO DE CÁLCULO DO IRRF 2026 ============
function calcularIRRF2026(baseIRRF: number, bruto: number): { irrf: number, redutor: number } {
  let redutor = 0;
  let irrfBase = 0;
  
  // Aplica redutor especial baseado no BRUTO (não na base)
  if (bruto <= LIMITE_ISENCAO_TOTAL) {
    return { irrf: 0, redutor: 0 };
  } 
  else if (bruto <= LIMITE_REDUCAO) {
    // Fórmula do redutor: R$ 978,62 - (0,133145 × renda mensal)
    redutor = REDUTOR_A - (REDUTOR_B * bruto);
    redutor = Math.max(0, Math.min(redutor, REDUTOR_A));
  }
  
  // Calcula IRRF pela tabela base usando a BASE (bruto - INSS)
  for (const faixa of TABELA_IR_2026) {
    if (baseIRRF <= faixa.ate) {
      irrfBase = baseIRRF * faixa.aliquota - faixa.deducao;
      break;
    }
  }
  irrfBase = Math.max(0, irrfBase);
  
  // Aplica redutor
  const irrfFinal = Math.max(0, irrfBase - redutor);
  
  return { 
    irrf: Math.round(irrfFinal * 100) / 100,
    redutor: Math.round(redutor * 100) / 100
  };
}

// ============ FUNÇÃO PRINCIPAL DE CÁLCULO ============
function calcularLiquidoAPartirDoBruto(bruto: number): { 
  liquido: number, 
  inss: number, 
  iss: number, 
  irrf: number,
  redutor: number 
} {
  const brutoArredondado = Math.round(bruto * 100) / 100;
  
  // INSS (11% direto para RPA, diferente de CLT)
  const inss = Math.round(Math.min(brutoArredondado * ALIQUOTA_INSS, TETO_INSS * ALIQUOTA_INSS) * 100) / 100;
  
  // ISS
  const iss = Math.round(brutoArredondado * ALIQUOTA_ISS * 100) / 100;
  
  // Base IRRF (bruto - INSS - ISS? NÃO! ISS não deduz do IR)
  const baseIRRF = brutoArredondado - inss;
  
  // IRRF 2026 com redutor baseado no BRUTO
  const { irrf, redutor } = calcularIRRF2026(baseIRRF, brutoArredondado);
  
  // Líquido (bruto - inss - iss - irrf)
  const liquido = Math.round((brutoArredondado - inss - iss - irrf) * 100) / 100;
  
  return { liquido, inss, iss, irrf, redutor };
}

// Cálculo direto: BRUTO → LÍQUIDO
function calcularBrutoParaLiquido(bruto: number) {
  const resultado = calcularLiquidoAPartirDoBruto(bruto);
  
  valorBruto.value = bruto;
  valorINSS.value = resultado.inss;
  valorISS.value = resultado.iss;
  valorIRRF.value = resultado.irrf;
  valorLiquido.value = resultado.liquido;
  redutorAplicado.value = resultado.redutor;
  
  // Calcula economia (comparação com tabela sem redutor)
  const baseSemRedutor = bruto - resultado.inss;
  let irrfSemRedutor = 0;
  for (const faixa of TABELA_IR_2026) {
    if (baseSemRedutor <= faixa.ate) {
      irrfSemRedutor = baseSemRedutor * faixa.aliquota - faixa.deducao;
      break;
    }
  }
  irrfSemRedutor = Math.max(0, Math.round(irrfSemRedutor * 100) / 100);
  economiaIR.value = Math.max(0, irrfSemRedutor - valorIRRF.value);
}

// Cálculo reverso: LÍQUIDO → BRUTO
function calcularLiquidoParaBruto(liquidoDesejado: number) {
  if (liquidoDesejado <= 0) {
    zerarValores();
    return;
  }

  const liquidoAlvo = Math.round(liquidoDesejado * 100) / 100;
  
  // Busca binária otimizada
  let brutoMin = liquidoAlvo;
  let brutoMax = liquidoAlvo * 1.5;
  let melhorBruto = liquidoAlvo * 1.18;
  let melhorDiferenca = Infinity;
  let iteracoes = 0;
  const maxIteracoes = 200;
  
  while (iteracoes < maxIteracoes) {
    const brutoTeste = (brutoMin + brutoMax) / 2;
    const { liquido: liquidoTeste } = calcularLiquidoAPartirDoBruto(brutoTeste);
    
    const diferenca = Math.abs(liquidoTeste - liquidoAlvo);
    
    if (diferenca < melhorDiferenca) {
      melhorDiferenca = diferenca;
      melhorBruto = brutoTeste;
    }
    
    if (diferenca < 0.001) { // Precisão de 0,1 centavo
      melhorBruto = brutoTeste;
      break;
    }
    
    if (liquidoTeste < liquidoAlvo) {
      brutoMin = brutoTeste;
    } else {
      brutoMax = brutoTeste;
    }
    
    iteracoes++;
  }
  
  // Ajuste fino final
  const resultado = calcularLiquidoAPartirDoBruto(melhorBruto);
  
  valorBruto.value = Math.round(melhorBruto * 100) / 100;
  valorINSS.value = resultado.inss;
  valorISS.value = resultado.iss;
  valorIRRF.value = resultado.irrf;
  valorLiquido.value = resultado.liquido;
  redutorAplicado.value = resultado.redutor;
  
  // Calcula economia
  const baseSemRedutor = valorBruto.value - resultado.inss;
  let irrfSemRedutor = 0;
  for (const faixa of TABELA_IR_2026) {
    if (baseSemRedutor <= faixa.ate) {
      irrfSemRedutor = baseSemRedutor * faixa.aliquota - faixa.deducao;
      break;
    }
  }
  irrfSemRedutor = Math.max(0, Math.round(irrfSemRedutor * 100) / 100);
  economiaIR.value = Math.max(0, irrfSemRedutor - valorIRRF.value);
}

function zerarValores() {
  valorBruto.value = 0;
  valorLiquido.value = 0;
  valorINSS.value = 0;
  valorISS.value = 0;
  valorIRRF.value = 0;
  redutorAplicado.value = 0;
  economiaIR.value = 0;
}

// ============ PROPRIEDADES COMPUTADAS ============
const tituloEntrada = computed(() => {
  return tipoCalculo.value === 'liquidoParaBruto' 
    ? '💰 Quanto você quer receber líquido?'
    : '📄 Qual o valor do RPA (bruto)?';
});

const labelEntrada = computed(() => {
  return tipoCalculo.value === 'liquidoParaBruto'
    ? 'Valor Líquido Desejado'
    : 'Valor Bruto (RPA)';
});

const descricaoEntrada = computed(() => {
  return tipoCalculo.value === 'liquidoParaBruto'
    ? 'Digite quanto quer receber líquido (após descontos)'
    : 'Digite o valor bruto que será pago via RPA';
});

const labelDestaque = computed(() => {
  return tipoCalculo.value === 'liquidoParaBruto'
    ? 'Valor Bruto necessário:'
    : 'Valor Líquido a receber:';
});

const valorDestaque = computed(() => {
  return tipoCalculo.value === 'liquidoParaBruto' ? valorBruto.value : valorLiquido.value;
});

const descricaoDestaque = computed(() => {
  return tipoCalculo.value === 'liquidoParaBruto'
    ? 'A faculdade deve emitir o RPA neste valor'
    : 'Este é o valor que cairá na sua conta';
});

const totalImpostos = computed(() => {
  return valorINSS.value + valorISS.value + valorIRRF.value;
});

const cargaTributaria = computed(() => {
  if (valorBruto.value === 0) return '0,00';
  return ((totalImpostos.value / valorBruto.value) * 100).toFixed(2);
});

const inssEfetivo = computed(() => {
  if (valorBruto.value === 0) return '0,00';
  return ((valorINSS.value / valorBruto.value) * 100).toFixed(2);
});

const irrfEfetivo = computed(() => {
  if (valorBruto.value === 0) return '0,00';
  return ((valorIRRF.value / valorBruto.value) * 100).toFixed(2);
});

const mostrarBeneficioIR = computed(() => {
  return economiaIR.value > 0 && valorBruto.value > 0;
});

// ============ VALORES DE REFERÊNCIA ============
const valoresReferenciaBruto = computed(() => {
  const valores = [3000, 5000, 6000, 7000, 10000];
  return valores.map(bruto => {
    const inss = Math.round(Math.min(bruto * ALIQUOTA_INSS, TETO_INSS * ALIQUOTA_INSS) * 100) / 100;
    const iss = Math.round(bruto * ALIQUOTA_ISS * 100) / 100;
    const baseIRRF = bruto - inss;
    const { irrf } = calcularIRRF2026(baseIRRF, bruto);
    const liquido = Math.round((bruto - inss - iss - irrf) * 100) / 100;
    return { bruto, inss, iss, irrf, liquido };
  });
});

const valoresReferenciaLiquido = computed(() => {
  const valores = [2500, 4000, 5000, 6000, 8000];
  return valores.map(liquido => {
    // Aproximação inicial
    const brutoAprox = liquido * 1.15;
    return {
      liquido,
      bruto: Math.round(brutoAprox * 100) / 100,
      inss: Math.round(brutoAprox * 0.11 * 100) / 100,
      iss: Math.round(brutoAprox * 0.02 * 100) / 100,
      irrf: Math.max(0, Math.round((brutoAprox - brutoAprox * 0.11) * 0.15 * 100) / 100)
    };
  });
});

// ============ WATCH ============
watch([tipoCalculo, valorEntradaNumerico], () => {
  if (valorEntradaNumerico.value <= 0) {
    zerarValores();
    return;
  }

  if (tipoCalculo.value === 'brutoParaLiquido') {
    calcularBrutoParaLiquido(valorEntradaNumerico.value);
  } else {
    calcularLiquidoParaBruto(valorEntradaNumerico.value);
  }
});

// Inicialização
calcularBrutoParaLiquido(5000);
</script>

<style scoped>
/* (Mantém todo o CSS anterior que você aprovou) */
.rpa-calculator {
  max-width: 1000px;
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
  border-color: #42b983;
  background-color: #f8fff9;
}

.radio-option input[type="radio"] {
  margin-top: 3px;
  accent-color: #42b983;
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
  padding: 40px;
  transition: all 0.3s;
}

.painel-entrada.modo-liquido {
  background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
  color: white;
}

.painel-entrada.modo-bruto {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
}

.painel-entrada h2 {
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

.simbolo {
  padding: 12px 15px;
  background-color: #f0f0f0;
  color: #333;
  font-weight: bold;
}

.input-wrapper input {
  flex: 1;
  padding: 12px;
  border: none;
  font-size: 1.2rem;
  outline: none;
}

.input-wrapper input:focus {
  background-color: #f8f8f8;
}

.input-group small {
  display: block;
  margin-top: 8px;
  opacity: 0.8;
  font-size: 0.9rem;
}

.info-municipio {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.badge {
  background-color: rgba(255,255,255,0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.badge.ativo {
  background-color: #ffd700;
  color: #2c3e50;
  font-weight: bold;
}

.painel-resultados {
  padding: 40px;
  background-color: white;
}

.painel-resultados.aviso {
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

.card-destaque.modo-liquido {
  background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
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

.card-destaque small {
  color: #718096;
}

.detalhamento h3 {
  color: #2d3748;
  margin-bottom: 20px;
}

.tabela-valores {
  background-color: #f7fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.linha-valor, .linha-total-impostos {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.linha-valor:last-child {
  border-bottom: none;
}

.linha-valor.bruto .valor {
  color: #2c3e50;
  font-weight: 600;
}

.linha-valor.inss .valor {
  color: #e53e3e;
}

.linha-valor.iss .valor {
  color: #dd6b20;
}

.linha-valor.irrf .valor {
  color: #3182ce;
}

.linha-valor.liquido .valor {
  color: #38a169;
  font-weight: bold;
}

.linha-total-impostos {
  font-weight: bold;
  border-top: 2px solid #cbd5e0;
  border-bottom: 2px solid #cbd5e0;
  margin: 10px 0;
  padding: 15px 0;
}

.aliquotas {
  display: flex;
  gap: 20px;
  margin-top: 30px;
  margin-bottom: 20px;
}

.aliquota-item {
  flex: 1;
  text-align: center;
  padding: 15px;
  background-color: #ebf8ff;
  border-radius: 8px;
}

.aliquota-item span {
  display: block;
  color: #2c5282;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.aliquota-item strong {
  font-size: 1.3rem;
  color: #2b6cb0;
}

.modo-info {
  padding: 15px;
  background-color: #f0f4f8;
  border-radius: 8px;
  text-align: center;
  font-size: 1rem;
  color: #2d3748;
}

.modo-info.reverso {
  background-color: #f0fff4;
  border-left: 4px solid #38a169;
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

.referencia-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  background-color: #e2e8f0;
  color: #4a5568;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.tab-btn.ativo {
  background-color: #42b983;
  color: white;
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
  
  .painel-entrada, .painel-resultados {
    padding: 20px;
  }
  
  .valor-destaque {
    font-size: 2rem;
  }
  
  .aliquotas {
    flex-direction: column;
    gap: 10px;
  }
  
  .referencia-tabs {
    flex-direction: column;
  }
  
  table {
    font-size: 0.85rem;
  }
  
  th, td {
    padding: 8px 4px;
  }
}
</style>
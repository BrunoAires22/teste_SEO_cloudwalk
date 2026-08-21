/**
 * Calculadora de Salário Líquido — cálculo simplificado.
 *
 * Conforme o escopo deste teste, a ferramenta não precisa ser 100% funcional
 * nem espelhar a legislação vigente com exatidão — o foco é a estrutura da
 * página para SEO/AEO. As faixas abaixo são valores de referência
 * (aproximados de tabelas públicas de INSS/IRRF) usados apenas para
 * demonstrar o funcionamento da calculadora. Ver aviso na própria página.
 */
(function () {
  "use strict";

  // Tabela progressiva de INSS (valores de referência, simplificados)
  var INSS_FAIXAS = [
    { ate: 1518.00, aliquota: 0.075 },
    { ate: 2793.88, aliquota: 0.09 },
    { ate: 4190.83, aliquota: 0.12 },
    { ate: 8157.41, aliquota: 0.14 },
  ];

  // Tabela progressiva de IRRF (valores de referência, simplificados)
  var IRRF_FAIXAS = [
    { ate: 2259.20, aliquota: 0, deducao: 0 },
    { ate: 2826.65, aliquota: 0.075, deducao: 169.44 },
    { ate: 3751.05, aliquota: 0.15, deducao: 381.44 },
    { ate: 4664.68, aliquota: 0.225, deducao: 662.77 },
    { ate: Infinity, aliquota: 0.275, deducao: 896.00 },
  ];

  var DEDUCAO_POR_DEPENDENTE = 189.59;

  function calcularINSS(bruto) {
    var total = 0;
    var anterior = 0;
    for (var i = 0; i < INSS_FAIXAS.length; i++) {
      var faixa = INSS_FAIXAS[i];
      var teto = Math.min(bruto, faixa.ate);
      if (teto > anterior) {
        total += (teto - anterior) * faixa.aliquota;
      }
      anterior = faixa.ate;
      if (bruto <= faixa.ate) break;
    }
    // Teto de contribuição (aprox.) caso o bruto ultrapasse a última faixa
    var tetoContribuicao = 951.63;
    return Math.min(total, tetoContribuicao);
  }

  function calcularIRRF(baseCalculo) {
    for (var i = 0; i < IRRF_FAIXAS.length; i++) {
      var faixa = IRRF_FAIXAS[i];
      if (baseCalculo <= faixa.ate) {
        var imposto = baseCalculo * faixa.aliquota - faixa.deducao;
        return Math.max(imposto, 0);
      }
    }
    return 0;
  }

  // Converte string em formato BR ("3.500,00" ou "3500,00" ou "3500") em
  // número. Remove separador de milhar (".") antes de trocar a vírgula
  // decimal por ponto — sem isso, "3.500,00" vira 3.5 (parseFloat para no
  // segundo ponto), um bug real que só aparece com valores de 4+ dígitos.
  function parseValorBR(valor) {
    var limpo = String(valor || "").trim().replace(/\./g, "").replace(",", ".");
    var n = parseFloat(limpo);
    return isNaN(n) ? 0 : n;
  }

  function formatarBRL(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // Formata só o número (sem "R$"), pra usar junto do prefixo estilizado
  // em roxo — padrão de resultado do design system da InfinitePay.
  function formatarNumero(valor) {
    return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function init() {
    var form = document.getElementById("calc-form");
    var resultBox = document.getElementById("resultado");
    var stamp = document.getElementById("stamp");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var bruto = parseValorBR(document.getElementById("salario-bruto").value);
      var dependentes =
        parseInt(document.getElementById("dependentes").value, 10) || 0;
      var outrosDescontos = parseValorBR(
        document.getElementById("outros-descontos").value
      );

      if (bruto <= 0) {
        document.getElementById("salario-bruto").focus();
        return;
      }

      var inss = calcularINSS(bruto);
      var baseIRRF = Math.max(
        bruto - inss - dependentes * DEDUCAO_POR_DEPENDENTE,
        0
      );
      var irrf = calcularIRRF(baseIRRF);
      var totalDescontos = inss + irrf + outrosDescontos;
      var liquido = Math.max(bruto - totalDescontos, 0);

      document.getElementById("v-bruto").textContent = formatarBRL(bruto);
      document.getElementById("v-inss").textContent = "− " + formatarBRL(inss);
      document.getElementById("v-irrf").textContent = "− " + formatarBRL(irrf);
      document.getElementById("v-outros").textContent =
        "− " + formatarBRL(outrosDescontos);
      document.getElementById("v-liquido").innerHTML =
        '<span class="prefix">R$</span>' + formatarNumero(liquido);

      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });

      stamp.classList.remove("show");
      // força reflow para reiniciar a animação em cálculos consecutivos
      void stamp.offsetWidth;
      stamp.classList.add("show");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();

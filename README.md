# Calculadora de Salário Líquido — InfinitePay

Protótipo da página principal da ferramenta gratuita recomendada na análise de
oportunidade de aquisição orgânica da InfinitePay (documento em anexo à
entrega do teste). Este repositório contém **apenas a página principal do
hub** `/calculadoras/`, conforme escopo do teste, as demais calculadoras do
cluster (férias, 13º, rescisão, FGTS, horas extras, INSS) aparecem como
"em breve" na própria página, representando a arquitetura planejada.

**Preview:** abra `index.html` diretamente no navegador.

## Como este protótipo se conecta à análise

Todas as decisões de estrutura, título, URL e dados estruturados desta página
decorrem diretamente dos achados do dataset (Ahrefs, mercado Brasil), o
racional completo está no documento de análise. Resumo das decisões
aplicadas aqui:

| Decisão | Onde está no código | Por quê |
|---|---|---|
| URL de destino `infinitepay.io/calculadoras/salario-liquido` | `<link rel="canonical">` e schema | Diretório novo, separado de `/materiais/`, replicando o padrão do concorrente líder do cluster |
| Title sem ano (evergreen) | `<title>` | Evita obsolescência de metadado e desalinhamento de backlinks ao longo do tempo |
| Calculadora + conteúdo explicativo na mesma URL | Estrutura da página | Página #1 do cluster no dataset ranqueia como "guia completo", não só como ferramenta isolada |
| Schema `FAQPage` + `HowTo` + `WebApplication` + `BreadcrumbList` | `<script type="application/ld+json">` no `<head>` | Nenhum concorrente do cluster ocupa `serp_features` hoje — terreno aberto para SEO e AEO |
| Cálculo client-side, sem framework | `assets/js/calculator.js` | Keywords do cluster são classificadas como transacionais ("faça agora"), latência mata a intenção de uso |
| Hub de calculadoras relacionadas | Seção `#related` | Arquitetura hub-and-spoke prevista no roadmap de 90 dias |
| CTA cruzado para Conta PJ | Seção `.cta-band` | Ferramenta como topo de funil, não conversão direta, ponderação registrada na análise sobre quem efetivamente busca essas keywords |

## Design system aplicado

A primeira versão deste protótipo usava uma direção visual própria (conceito
de holerite/carimbo). Ela foi substituída pelo **design system real da
InfinitePay**, extraído por inspeção do CSS computado do site
(`infinitepaydesignsystem.md`), para que a página tenha consistência de marca
de verdade, sinal de atenção ao detalhe para quem for avaliar a entrega,
mesmo o README do teste liberando uma interface simplificada.

Mapeamento token → implementação:

| Token do design system | Onde foi aplicado |
|---|---|
| `--brand-purple` `#6e08f2` / `purple-400` `#864dff` | Prefixo "R$" do valor líquido, links, ícones de FAQ, círculos numerados dos passos |
| `--brand-lime` `#baff1a` / `--brand-dark-lime` `#92d900` | Botão primário "Calcular salário líquido" (pill) e CTA da faixa final |
| `--brand-dark` `#13151e` | Fundo da faixa de CTA cruzado (Conta PJ) |
| `--brand-light-grey` `#f4f5f8` / fundo de página `#f0f0f0` | Fundo geral da página, contra os cards brancos |
| `red-800` `#990012` | Valores de desconto (INSS, IRRF, outros), semântica de "negativo" do próprio design system |
| `border-medium` (16px) | Card da calculadora |
| `border-regular` (12px) | Cards de FAQ e de calculadoras relacionadas |
| `border-rounded` (pill/500px) | Botões e badge de confirmação |
| Padrão "R$ roxo + número quase-preto, 600, ~28px" (card de CDB da InfinitePay) | Valor final de salário líquido |
| Sombra sutil (`0 2px 12px rgba(0,0,0,.06)`), sem bordas pesadas | Todos os cards |
| Fonte geométrica (fallback recomendado: Sora/DM Sans, já que a Cerapro é proprietária) | Sora para headings/valores, DM Sans para corpo, carregadas via Google Fonts com `preconnect` + `font-display: swap` |

**Sobre a fonte externa:** a decisão original desta página era não carregar
nenhuma fonte externa, para não adicionar uma requisição bloqueante ao
carregamento (relevante porque as keywords do cluster são transacionais,
"faça agora"). Priorizar a fidelidade à marca aqui é uma troca consciente:
mitigo o impacto com `preconnect` (resolve DNS/TLS da fonte antes de
precisar dela) e `font-display: swap` (o texto aparece imediatamente com a
fonte do sistema e troca para Sora/DM Sans assim que carrega, sem bloquear
a renderização). Registrado aqui porque é exatamente o tipo de trade-off que
vale explicar no vídeo.

## Estrutura

```
index.html                  → página principal (única página desta entrega)
assets/css/styles.css       → sistema de tokens + estilos
assets/js/calculator.js     → cálculo simplificado de INSS/IRRF (client-side)
```

## Sobre o cálculo

O cálculo usa faixas de referência simplificadas de INSS e IRRF, conforme o
escopo do teste, a ferramenta não precisa refletir a legislação vigente com
exatidão, só demonstrar a estrutura da página. Isso está declarado
explicitamente na própria página (aviso abaixo do resultado e no rodapé).

## Decisões técnicas relevantes

- **Sem framework, sem dependência externa.** HTML/CSS/JS puro, menor
  payload possível, sem hidratação, adequado a uma página cuja prioridade é
  Core Web Vitals.
- **Sem fonte externa.** Usa a stack de fontes do sistema para eliminar uma
  requisição bloqueante.
- **Acessibilidade de base:** labels associadas aos campos, foco visível
  (`:focus-visible`), FAQ nativo (`<details>`/`<summary>`, navegável por
  teclado), `prefers-reduced-motion` respeitado.
- **O que ficou fora de propósito, por decisão:** as 6 páginas satélite do
  hub (férias, 13º, rescisão, FGTS, horas extras, INSS) não foram
  desenvolvidas nesta entrega — o teste pede explicitamente só a página
  principal. Elas aparecem como estado "em breve" para comunicar a
  arquitetura sem gastar tempo fora do escopo.

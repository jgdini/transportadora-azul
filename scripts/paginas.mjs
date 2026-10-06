// Gera as páginas de serviço e de rotas a partir do index.html (CSS, ícones, cabeçalho, rodapé e WhatsApp).
// Depois de editar a home, rode: node scripts/paginas.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = 'https://jgdini.github.io/transportadora-azul/';
const home = readFileSync('index.html', 'utf8');
const pega = (ini, fim) => { const a = home.indexOf(ini); const b = home.indexOf(fim, a); if (a < 0 || b < 0) throw new Error('não achei ' + ini); return home.slice(a, b); };

const estilo = pega('<style>', '</style>') + '</style>';
const icones = pega('<svg width="0" height="0"', '</svg>\n\n<header') + '</svg>';
const cabecalho = (pega('<header class="topo">', '</header>') + '</header>')
  // só os links <a>: os <use href="#i-..."> dos ícones continuam apontando para o sprite da página
  .replace(/(<a [^>]*?)href="#([a-z-]+)"/g, '$1href="./#$2"')
  .replace(/ data-aba="[^"]+"/g, '');
const rodape = pega('<footer class="rodape">', '</footer>') + '</footer>';
const zap = pega('<div class="zap" id="zap">', '<script>');

const WA = 'https://wa.me/5511995854072?text=';
const zapLink = t => WA + encodeURIComponent(t);

// CSS próprio das páginas internas
const estiloInterno = `<style>
.trilha{font-size:.85rem;color:var(--apagado);margin-bottom:22px}
.trilha a{color:var(--prata);text-decoration:none}
.trilha a:hover{color:var(--ouro-claro)}
.topo-int{position:relative;isolation:isolate;padding:72px 0 80px;color:#fff;background:var(--preto)}
.topo-int>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.topo-int::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(11,11,12,.95) 0%,rgba(11,11,12,.8) 50%,rgba(11,11,12,.45) 100%)}
.topo-int h1{font-size:clamp(2.2rem,4.6vw,3.8rem);margin:18px 0 18px;max-width:20ch}
.topo-int p{max-width:56ch;color:#d5d8dd;font-size:1.1rem}
.topo-int .acoes{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
.corpo{display:grid;grid-template-columns:1.5fr 1fr;gap:72px;align-items:start}
.corpo>*{min-width:0}
.texto h2{font-size:clamp(1.6rem,2.6vw,2.1rem);margin:44px 0 14px}
.texto h2:first-child{margin-top:0}
.texto p{color:var(--cinza);margin-bottom:14px;max-width:66ch}
.texto ul{color:var(--cinza);padding-left:20px;margin:0 0 14px}
.texto li{margin-bottom:6px}
.texto table{width:100%;border-collapse:collapse;margin:8px 0 18px;font-size:.98rem}
.texto th,.texto td{text-align:left;padding:14px 12px 14px 0;border-bottom:1px solid var(--borda);vertical-align:top}
.texto th{font-size:.74rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--ouro-texto)}
.texto td:last-child,.texto th:last-child{text-align:right;white-space:nowrap}
.ficha{position:sticky;top:130px;background:#fff;border-radius:var(--r);padding:30px;border-top:3px solid var(--ouro)}
.ficha h2{font-size:.74rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:var(--ouro-texto);margin:0 0 6px}
.ficha dl{margin:0}
.ficha dl>div{padding:14px 0;border-bottom:1px solid var(--borda)}
.ficha dt{font-size:.85rem;color:var(--cinza)}
.ficha dd{margin:2px 0 0;font-weight:600}
.ficha .btn{width:100%;margin-top:22px}
.outros{display:flex;flex-wrap:wrap;gap:10px;list-style:none;padding:0;margin:18px 0 0}
.outros a{display:inline-block;border:1px solid var(--borda);border-radius:999px;padding:9px 18px;text-decoration:none;font-weight:600;font-size:.94rem;background:#fff}
.outros a:hover{border-color:var(--ouro-texto);color:var(--ouro-texto)}
@media (max-width:1000px){.corpo{grid-template-columns:1fr;gap:40px}.ficha{position:static}}
</style>`;

const scriptInterno = `<script>
(() => {
  const mBtn = document.querySelector('.menu-btn'), menu = document.getElementById('menu');
  const setMenu = open => { menu.classList.toggle('aberto', open); mBtn.setAttribute('aria-expanded', open); mBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); };
  mBtn.addEventListener('click', () => setMenu(!menu.classList.contains('aberto')));
  const zBtn = document.getElementById('zap-btn'), card = document.getElementById('zap-card'), status = document.getElementById('zap-status');
  const setCard = open => { card.hidden = !open; zBtn.setAttribute('aria-expanded', open); zBtn.classList.remove('chamando'); if (open) card.querySelector('.zap-opcoes a').focus(); };
  zBtn.addEventListener('click', () => setCard(card.hidden));
  card.querySelector('.zap-fecha').addEventListener('click', () => { setCard(false); zBtn.focus(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !card.hidden) { setCard(false); zBtn.focus(); } });
  document.addEventListener('click', e => { if (!card.hidden && !e.target.closest('#zap')) setCard(false); });
  setTimeout(() => { if (card.hidden) zBtn.classList.add('chamando'); }, 8000);
  try {
    const p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(new Date());
    const wd = p.find(x => x.type === 'weekday').value, h = parseInt(p.find(x => x.type === 'hour').value, 10);
    const aberto = wd === 'Sat' ? (h >= 7 && h < 12) : (wd !== 'Sun' && h >= 7 && h < 18);
    if (!aberto) { status.textContent = 'Deixe sua mensagem, respondemos a partir das 7h'; status.classList.add('fora'); }
  } catch (e) {}
})();
</script>`;

const paginas = [
  {
    arquivo: 'carga-fracionada.html',
    titulo: 'Carga fracionada em Cotia e na Grande SP | ZUPO Transportadora',
    descricao: 'Transporte de carga fracionada saindo de Cotia (SP): de 1 caixa a 10 paletes, coleta no mesmo dia para pedidos até 11h, seguro até o valor da nota fiscal e rastreio por satélite.',
    nome: 'Carga fracionada',
    h1: 'Carga fracionada saindo de Cotia',
    lead: 'Para quem despacha de uma caixa a dez paletes. Sua carga divide o caminhão com a de outros clientes que vão para a mesma região, e você paga pelo espaço que ocupa.',
    foto: ['doca', [480, 720, 960, 1400], 'Dois caminhões baú da ZUPO encostados na doca do galpão'],
    msg: 'Olá! Quero cotar uma carga fracionada.',
    corpo: `
<h2>Como funciona</h2>
<p>A ZUPO coleta a sua carga, leva para a base em Cotia e junta com outras que seguem para a mesma região. O caminhão sai com a rota fechada e entrega cada volume no endereço do destinatário.</p>
<p>Na Grande São Paulo, o pedido confirmado até as 11h é coletado e entregue no mesmo dia. Para Campinas, Sorocaba, Jundiaí e São José dos Campos, o prazo é de 1 dia útil.</p>
<h2>Como o frete é calculado</h2>
<p>O valor depende da distância, do peso e do volume. Para cargas leves e volumosas, como espuma ou embalagens vazias, vale o peso cubado: o volume em metros cúbicos multiplicado por 300 kg, padrão do transporte rodoviário. A ZUPO cobra pelo maior dos dois, o peso real ou o cubado.</p>
<p>Abaixo de 30 kg vale a taxa mínima de frete. O seguro vai até o valor da nota fiscal, por isso a cotação pede esse valor.</p>
<h2>O que informar na cotação</h2>
<ul><li>Cidade de coleta e cidade de entrega</li><li>Peso total e número de volumes</li><li>Medidas das caixas ou dos paletes, se a carga for volumosa</li><li>Valor da nota fiscal</li></ul>`,
    ficha: [['Volume', '1 caixa a 10 paletes'], ['Coleta', 'Mesmo dia, pedido até 11h'], ['Grande SP', 'Entrega no mesmo dia'], ['Seguro', 'RCTR-C e RC-DC até o valor da NF']],
    faq: [
      ['Existe peso mínimo para carga fracionada?', 'Não. A ZUPO leva de uma caixa a vários paletes. Abaixo de 30 kg vale a taxa mínima de frete.'],
      ['O que é peso cubado?', 'É o peso calculado pelo volume da carga: os metros cúbicos multiplicados por 300 kg, padrão do transporte rodoviário. O frete usa o maior valor entre o peso real e o cubado.'],
      ['A carga fracionada tem o mesmo seguro da lotação?', 'Sim. Toda viagem sai com seguro RCTR-C e RC-DC, que cobrem acidente, roubo e desvio até o valor da nota fiscal.'],
    ],
  },
  {
    arquivo: 'lotacao.html',
    titulo: 'Frete lotação saindo de Cotia (SP) | ZUPO Transportadora',
    descricao: 'Caminhão exclusivo para a sua carga, saindo de Cotia direto para o destino, sem transbordo. Truck baú ou graneleiro até 14 t, com seguro até o valor da nota fiscal e rastreio 24 h.',
    nome: 'Carga lotação',
    h1: 'Lotação: o caminhão inteiro para a sua carga',
    lead: 'O caminhão sai da sua doca direto para o destino, sem passar por outro depósito. Menos manuseio da carga e prazo mais curto.',
    foto: ['galpao', [480, 720, 960, 1400], 'Caminhão baú e graneleiro da ZUPO sob a cobertura do galpão'],
    msg: 'Olá! Quero cotar um frete lotação.',
    corpo: `
<h2>Quando vale a lotação</h2>
<p>A lotação compensa quando a carga ocupa boa parte do caminhão ou quando o prazo é apertado. Como não há parada em outro depósito, a carga é carregada uma vez e descarregada uma vez, o que reduz o risco de avaria.</p>
<h2>Caminhões disponíveis</h2>
<table><thead><tr><th>Caminhão</th><th>Uso</th><th>Capacidade</th></tr></thead><tbody>
<tr><td>Truck baú</td><td>Carga paletizada e caixas, protegida da chuva</td><td>até 14 t</td></tr>
<tr><td>Graneleiro com lona</td><td>Granel, sacaria e carga que carrega pela lateral</td><td>até 14 t</td></tr>
<tr><td>Toco baú</td><td>Lotes menores na Grande São Paulo</td><td>até 6 t</td></tr>
</tbody></table>
<h2>Agendamento</h2>
<p>Para a Grande São Paulo, o caminhão pode sair no mesmo dia se o pedido for confirmado até as 11h. Para o interior e os estados vizinhos, a ZUPO agenda o horário de carregamento e o de entrega com você e com o destinatário.</p>`,
    ficha: [['Caminhões', 'Truck baú, graneleiro e toco'], ['Capacidade', 'até 14 t'], ['Transbordo', 'Nenhum, sai direto ao destino'], ['Seguro', 'RCTR-C e RC-DC até o valor da NF']],
    faq: [
      ['Qual a diferença entre lotação e carga fracionada?', 'Na lotação o caminhão leva só a sua carga, direto ao destino. Na fracionada a carga divide o caminhão com a de outros clientes e passa pela base em Cotia.'],
      ['Posso agendar o horário de carregamento?', 'Sim. A ZUPO combina o horário de carregamento na sua doca e o de entrega no destinatário.'],
      ['Que tipo de carga o graneleiro leva?', 'Carga a granel e sacaria, além de cargas que precisam ser carregadas pela lateral. A lona protege a carga durante a viagem.'],
    ],
  },
  {
    arquivo: 'entrega-vuc-centro-sp.html',
    titulo: 'Entrega com VUC no centro expandido de São Paulo | ZUPO Transportadora',
    descricao: 'Entregas na Zona de Máxima Restrição de Circulação (ZMRC) de São Paulo com VUC. Lojas, condomínios e centros de distribuição no centro expandido, saindo de Cotia.',
    nome: 'Entrega com VUC no centro de São Paulo',
    h1: 'Entrega no centro expandido de São Paulo com VUC',
    lead: 'Caminhão comum tem horário restrito na Zona de Máxima Restrição de Circulação. Os dois VUCs da ZUPO entregam em lojas, condomínios e centros de distribuição dentro dessa área.',
    foto: ['frota-tres', [480, 720, 960, 1400], 'Caminhões da ZUPO estacionados no pátio ao pôr do sol'],
    msg: 'Olá! Preciso de uma entrega no centro de São Paulo com VUC.',
    corpo: `
<h2>O que é a ZMRC</h2>
<p>A Zona de Máxima Restrição de Circulação é a área do centro expandido de São Paulo onde a Prefeitura limita a entrada de caminhões durante o dia. Os horários e as vias de cada regra são definidos pela CET.</p>
<p>O VUC, veículo urbano de carga, é um caminhão pequeno com dimensões limitadas pela regulamentação municipal. Por isso ele pode circular em boa parte da zona em horários em que um toco ou um truck não pode.</p>
<h2>Para quem serve</h2>
<ul><li>Lojas de rua e de shopping que recebem mercadoria durante o dia</li><li>Condomínios residenciais e comerciais</li><li>Centros de distribuição e escritórios no centro expandido</li></ul>
<h2>Como a ZUPO faz</h2>
<p>A carga sai de Cotia pela Raposo Tavares em um dos dois VUCs baú da frota, com até 3 t. Pedido confirmado até as 11h é entregue no mesmo dia. Na entrega, o motorista fotografa o canhoto assinado e manda no seu WhatsApp.</p>`,
    ficha: [['Veículo', 'VUC baú'], ['Capacidade', 'até 3 t'], ['Frota', '2 VUCs'], ['Área', 'Centro expandido de São Paulo']],
    faq: [
      ['VUC pode circular em toda a ZMRC?', 'O VUC tem regras mais flexíveis que os caminhões maiores, mas algumas vias e horários têm restrições próprias definidas pela CET. A ZUPO planeja a rota de cada entrega de acordo com essas regras.'],
      ['Qual a capacidade do VUC?', 'Os VUCs baú da ZUPO levam até 3 t por viagem.'],
      ['Dá para entregar no mesmo dia no centro de São Paulo?', 'Sim, para pedidos confirmados até as 11h.'],
    ],
  },
  {
    arquivo: 'fretes-saindo-de-cotia.html',
    titulo: 'Fretes saindo de Cotia: rotas, distâncias e prazos | ZUPO Transportadora',
    descricao: 'Rotas e prazos de frete saindo de Cotia (SP) para a capital, Campinas, Sorocaba, Jundiaí, São José dos Campos, Baixada Santista e estados vizinhos.',
    nome: 'Fretes saindo de Cotia',
    h1: 'Fretes saindo de Cotia: rotas e prazos',
    lead: 'A base da ZUPO fica na Rua Saturno, em Cotia, perto da Raposo Tavares e a cerca de 9 km do Rodoanel. Pelo Rodoanel, o caminhão chega às principais rodovias de São Paulo sem atravessar a capital.',
    foto: ['garagem', [480, 800], 'Caminhões da ZUPO na garagem coberta da base em Cotia'],
    msg: 'Olá! Quero cotar um frete saindo de Cotia.',
    corpo: `
<h2>Prazos e caminhos</h2>
<table><thead><tr><th>Destino</th><th>Caminho principal</th><th>Prazo</th></tr></thead><tbody>
<tr><td>Grande São Paulo e capital</td><td>Raposo Tavares e Rodoanel</td><td>Mesmo dia*</td></tr>
<tr><td>Sorocaba (cerca de 65 km)</td><td>Raposo Tavares e Castello Branco</td><td>1 dia útil</td></tr>
<tr><td>Jundiaí (cerca de 75 km)</td><td>Rodoanel e Bandeirantes</td><td>1 dia útil</td></tr>
<tr><td>Campinas (cerca de 100 km)</td><td>Rodoanel e Bandeirantes</td><td>1 dia útil</td></tr>
<tr><td>Baixada Santista (cerca de 100 km)</td><td>Rodoanel e Imigrantes</td><td>1 dia útil</td></tr>
<tr><td>São José dos Campos (cerca de 120 km)</td><td>Rodoanel e Dutra</td><td>1 dia útil</td></tr>
<tr><td>Interior de SP acima de 200 km</td><td>Conforme o destino</td><td>2 dias úteis</td></tr>
<tr><td>Sul de Minas, Rio de Janeiro e Paraná</td><td>Lotação ou fracionado consolidado</td><td>2 a 3 dias</td></tr>
</tbody></table>
<p>* Para pedidos confirmados até as 11h. As distâncias são aproximadas, por estrada, a partir da base em Cotia.</p>
<h2>Cidades com coleta e entrega todo dia útil</h2>
<p>Cotia, Vargem Grande Paulista, Embu das Artes, Itapevi, Jandira, Barueri, Carapicuíba, Osasco, Taboão da Serra, São Paulo, Guarulhos e o ABC.</p>`,
    ficha: [['Base', 'Rua Saturno, 8, Cotia (SP)'], ['Rodoanel', 'cerca de 9 km'], ['Grande SP', 'Mesmo dia, pedido até 11h'], ['Interior próximo', '1 dia útil']],
    faq: [
      ['Qual o prazo de Cotia para Campinas?', '1 dia útil. O caminhão segue pelo Rodoanel e pela Bandeirantes.'],
      ['A ZUPO entrega fora do estado de São Paulo?', 'Sim, no sul de Minas, no Rio de Janeiro e no Paraná, em 2 a 3 dias, por lotação ou carga fracionada consolidada.'],
      ['Vocês coletam em Barueri e Osasco?', 'Sim. Barueri, Osasco e as outras cidades da região oeste têm coleta e entrega todo dia útil.'],
    ],
  },
];

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
for (const p of paginas) {
  const url = BASE + p.arquivo;
  const [foto, ws, alt] = p.foto;
  const srcset = ws.map(w => `assets/img/${foto}-${w}.webp ${w}w`).join(', ');
  const maior = ws[ws.length - 1];
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Service', '@id': url + '#servico', name: p.nome, description: p.descricao, url, areaServed: { '@type': 'AdministrativeArea', name: 'Região Metropolitana de São Paulo' }, provider: { '@id': BASE + '#org' } },
      { '@type': 'WebPage', '@id': url, url, name: p.titulo, inLanguage: 'pt-BR', isPartOf: { '@id': BASE + '#site' }, about: { '@id': url + '#servico' } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: BASE }, { '@type': 'ListItem', position: 2, name: p.nome, item: url }] },
      { '@type': 'FAQPage', mainEntity: p.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      { '@type': ['Organization', 'LocalBusiness'], '@id': BASE + '#org', name: 'ZUPO Transportadora', url: BASE, telephone: '+55 11 99585-4072', address: { '@type': 'PostalAddress', streetAddress: 'Rua Saturno, 8 - Jardim Nova Coimbra', addressLocality: 'Cotia', addressRegion: 'SP', postalCode: '06702-170', addressCountry: 'BR' } },
    ],
  };
  const outros = paginas.filter(o => o !== p).map(o => `<li><a href="${o.arquivo}">${o.nome}</a></li>`).join('');
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.titulo)}</title>
<meta name="description" content="${esc(p.descricao)}">
<meta name="theme-color" content="#0b0b0c">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="ZUPO Transportadora">
<meta property="og:title" content="${esc(p.titulo)}">
<meta property="og:description" content="${esc(p.descricao)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}assets/img/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<link rel="preload" as="image" type="image/webp" imagesrcset="${srcset}" imagesizes="100vw" fetchpriority="high">
<link rel="preload" href="assets/fonts/manrope-normal.woff2" as="font" type="font/woff2" crossorigin>
<script type="application/ld+json">
${JSON.stringify(schema)}
</script>
${estilo}
${estiloInterno}
</head>
<body>
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
${icones}

${cabecalho}

<main id="conteudo">
<section class="topo-int escuro" aria-labelledby="h1">
  <img src="assets/img/${foto}-${ws[Math.min(2, ws.length - 1)]}.webp" srcset="${srcset}" sizes="100vw" width="${maior}" height="${Math.round(maior * (foto === 'garagem' ? 4 / 3 : 0.75))}" alt="${esc(alt)}" fetchpriority="high">
  <div class="wrap">
    <nav class="trilha" aria-label="Você está em"><a href="./">Início</a> / ${p.nome}</nav>
    <span class="rotulo">ZUPO Transportadora · Cotia (SP)</span>
    <h1 id="h1">${p.h1}</h1>
    <p>${p.lead}</p>
    <div class="acoes">
      <a class="btn btn-ouro" href="${zapLink(p.msg)}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-zap"/></svg>Cotar pelo WhatsApp</a>
      <a class="btn btn-linha" href="./#trajeto">Como cuidamos da carga</a>
    </div>
  </div>
</section>

<section class="sec claro" aria-label="${esc(p.nome)}">
  <div class="wrap corpo">
    <div class="texto">${p.corpo}
<h2>Perguntas frequentes</h2>
<div class="faq">
${p.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n')}
</div>
<h2>Outros serviços</h2>
<ul class="outros">${outros}<li><a href="./#servicos">Todos os serviços</a></li></ul>
    </div>
    <aside class="ficha" aria-label="Resumo">
      <h2>Resumo</h2>
      <dl>${p.ficha.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      <a class="btn btn-ouro" href="${zapLink(p.msg)}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-zap"/></svg>Cotar pelo WhatsApp</a>
    </aside>
  </div>
</section>
</main>

${rodape}

${zap.trimEnd()}

${scriptInterno}
</body>
</html>
`;
  writeFileSync(p.arquivo, html);
  console.log('gerada', p.arquivo, Math.round(html.length / 1024) + ' KB');
}

// sitemap com a home e as páginas internas
const hoje = new Date().toISOString().slice(0, 10);
const urls = ['', ...paginas.map(p => p.arquivo)];
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${BASE}${u}</loc><lastmod>${hoje}</lastmod></url>`).join('\n')}
</urlset>
`);
console.log('sitemap com', urls.length, 'URLs');

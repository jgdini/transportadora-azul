# ZUPO Transportadora

Modelo de site de página única para a ZUPO Transportadora (Cotia, SP). O repositório e a pasta ainda se chamam transportadora-azul, nome provisório do primeiro briefing. HTML e CSS estáticos, sem dependências em produção.

## Rodar no computador

```bash
node scripts/serve.mjs 5600
```

## Páginas internas

`scripts/paginas.mjs` gera `carga-fracionada.html`, `lotacao.html`, `entrega-vuc-centro-sp.html` e `fretes-saindo-de-cotia.html` a partir do `index.html` (CSS, ícones, cabeçalho, rodapé e botão do WhatsApp) e reescreve o `sitemap.xml`. Depois de editar a home, rode:

```bash
node scripts/paginas.mjs
```

## Imagens

`npm install` e depois `npm run imagens`. O comando roda:

- `scripts/logo.mjs`: recorta o logo de `Arquivo/Logo ZUPO Transportadora Premium.png`, tira o fundo preto e gera o logo do cabeçalho, o do rodapé, a marca (Z) e os ícones.
- `scripts/og.mjs`: imagem de compartilhamento (`assets/img/og-image.jpg`) com a foto da frota.
- `scripts/fotos.mjs`: converte as 6 fotos tratadas (`Arquivo/Fotos/Fotos Novas (1–6).PNG`) para WebP em vários tamanhos.

O vídeo do pátio (`assets/img/patio.mp4`, 10 s, sem áudio) foi cortado e comprimido com ffmpeg a partir do vídeo original. As fotos e o vídeo originais ficam em `Arquivo/`, que não vai para o repositório.

## Dados de briefing

Estes dados foram inventados para o modelo e precisam ser confirmados com o cliente: ano de fundação (2008), composição da frota (2 VUCs, 3 tocos, 4 trucks e 2 graneleiros), capacidades, prazos, 1.900 entregas/mês, 98% no prazo, peso mínimo de 30 kg, cotação em 30 min, seguros, revisão a cada 10 mil km e horário de atendimento. Também faltam CNPJ, e-mail, domínio, redes sociais e o perfil no Google (de onde vêm as coordenadas para o schema). Pelo ViaCEP, o CEP 06702-170 fica no bairro Recanto Vista Alegre, não no Jardim Nova Coimbra: confirmar o endereço com o cliente.

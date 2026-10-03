# Transportadora Azul

Modelo de site de página única para a Transportadora Azul (Cotia, SP). HTML e CSS estáticos, sem dependências em produção.

## Rodar no computador

```bash
node scripts/serve.mjs 5600
```

## Imagens

`npm install` e depois `npm run imagens`. O comando roda três scripts:

- `scripts/imagens.mjs`: ícones a partir do `favicon.svg`.
- `scripts/og.mjs`: imagem de compartilhamento (`assets/img/og-image.jpg`) com a foto da frota.
- `scripts/fotos.mjs`: converte as fotos de `Arquivo/Fotos` para WebP em vários tamanhos.

O vídeo do pátio (`assets/img/patio.mp4`, 10 s, sem áudio) foi cortado e comprimido com ffmpeg a partir do vídeo original. As fotos e o vídeo originais ficam em `Arquivo/`, que não vai para o repositório.

## Dados de briefing

Estes dados foram inventados para o modelo e precisam ser confirmados com o cliente: ano de fundação (2008), composição da frota (2 VUCs, 3 tocos, 4 trucks e 2 graneleiros), capacidades, prazos, 1.900 entregas/mês, 98% no prazo, peso mínimo de 30 kg, cotação em 30 min, seguros, revisão a cada 10 mil km e horário de atendimento. Também faltam CNPJ, e-mail, domínio e redes sociais.

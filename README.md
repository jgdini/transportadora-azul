# Transportadora Azul

Modelo de site de página única para a Transportadora Azul (Cotia, SP). HTML e CSS estáticos, sem dependências em produção.

## Rodar no computador

```bash
node scripts/serve.mjs 5600
```

## Imagens

- `npm install` e depois `npm run imagens` geram os ícones e a `assets/img/og-image.jpg`.
- As fotos originais ficam em `Arquivo/`, que não vai para o repositório. Elas entram no site convertidas para WebP com srcset.

## Dados de briefing

Estes dados foram inventados para o modelo e precisam ser confirmados com o cliente: ano de fundação (2008), composição da frota, placas, capacidades, prazos, 1.900 entregas/mês, 98% no prazo, peso mínimo de 30 kg, cotação em 30 min, seguros, revisão a cada 10 mil km e horário de atendimento. Também faltam CNPJ, e-mail, domínio e redes sociais.

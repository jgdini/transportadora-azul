# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Site estático já existente: HTML, CSS e JavaScript puros, com GSAP, ScrollTrigger, SplitText e Lenis em `assets/js/vendor/`. Publicado no GitHub Pages (`jgdini.github.io/transportadora-azul`). Sem framework. Escolha registrada pelo código atual, não por pergunta nova.

## Users

- **Primário:** empresa que precisa transportar carga (gestor de logística, comprador ou dono de empresa que contrata frete), em Cotia e Grande SP, para cargas regulares ou pontuais.
- **Secundário (não priorizado):** quem recebe ou acompanha a mercadoria e quer saber se a entrega é confiável. O site não é desenhado para este público.

## Product Purpose

Transportadora própria com frota de 11 caminhões em Cotia (SP), que transporta cargas fracionadas, lotações, entregas no centro com VUC e transporte dedicado por contrato. Sucesso para o site: o visitante entende os serviços e pede cotação pelo WhatsApp ou pelo formulário.

## Positioning

A ZUPO cuida da carga do começo ao fim com caminhões e motoristas da própria empresa, sem repassar o frete a terceiros. Um concorrente não pode copiar a afirmação "frota própria, nenhum frete repassado" sem ter a mesma operação. O diferencial a defender é a frota própria, com atendimento direto.

## Operating Context

- Cotação e contato principal pelo WhatsApp, com o número `(11) 99585-4072`.
- Consulta de rastreio por chave de NF-e ou CT-e, com redirecionamento para o site da Sefaz (o site não consulta a Sefaz diretamente).
- Tabela de serviços com filtro por categoria (fracionada, lotação, VUC, contrato).
- Cobertura regional e FAQ.

## Capabilities and Constraints

- Site estático, sem backend. Formulários enviam pelo WhatsApp ou redirecionam para a Sefaz.
- Vídeo comercial de 30 s em MP4 (`assets/video/zupo-comercial.mp4`), carregado só ao aparecer na tela, mudo e em loop.
- Animações com GSAP carregadas depois do primeiro paint; respeitam `prefers-reduced-motion`.
- Terminologia: "carga fracionada", "lotação", "VUC" (Veículo Urbano de Carga), "RCTR-C e RC-DC", "CT-e", "MDF-e".
- **Ainda não definido pelo cliente:** CNPJ, e-mail, domínio final, redes sociais, perfil no Google. Não inventar esses dados.

## Brand Commitments

- Nome: **ZUPO Transportadora** (ex-"Transportadora Azul"; o nome antigo não deve aparecer).
- Logo: versões clara e escura em `assets/img/zupo-logo*.webp`, gerada a partir do arquivo enviado pelo cliente.
- Cidade-base: Cotia (SP). Atendimento em Grande SP.
- Crédito de desenvolvimento no rodapé: "Desenvolvido por Halo Company", no formato do site Hanaoka.

## Evidence on Hand

- Fotos da frota e do pátio em `assets/img/` (atego, graneleiro, doca, galpão, garagem, frota-tres). Imagens de apresentação do modelo.
- Vídeo comercial e vídeo curto do pátio (`assets/img/patio.mp4`).
- Lista de serviços com os tipos de carga (fracionada, lotação, VUC, contrato).
- **Dados ilustrativos, para aprovação de layout:** os números (98% no prazo, 1.900 entregas por mês, 18 anos em Cotia, fundação em 2008), a composição da frota, os prazos e as frases de processo. O cliente pode pedir alterações para melhorar a visualização e o contexto.
- Não há depoimentos, cases ou certificações. Não criar nenhum.
- **Dados reais (únicos confirmados):** nome da transportadora, endereço (Rua Saturno, 8, Cotia-SP) e número do WhatsApp `(11) 99585-4072`.

## Product Principles

1. Frota própria é o diferencial a comunicar. As demais informações são ilustrativas e podem ser ajustadas.
2. A ação é sempre a cotação: o visitante deve conseguir pedir orçamento em um toque, no celular.
3. Linguagem direta, com termos de transporte explicados na primeira vez que aparecem.

## Accessibility & Inclusion

- Conteúdo legível no celular em 390 px, sem corte horizontal.
- Vídeo com controle de pausa visível, mudo por padrão, sem reprodução automática quando não visível.
- Texto secundário com contraste mínimo de 4,5:1 (AA).

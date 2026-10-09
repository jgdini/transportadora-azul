/* ZUPO Transportadora — animações e micro-interações.
   Carregado depois do evento load (ver o fim do index.html), junto com gsap, ScrollTrigger, SplitText e Lenis.
   A abertura do topo é CSS puro e não depende deste arquivo. Sem ele o site continua inteiro:
   nada fica escondido por CSS esperando o JavaScript. */
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger, SplitText } = window;
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const root = document.documentElement;
  root.classList.add('js-motion');
  const q = (s, el = document) => el.querySelector(s);
  const qa = (s, el = document) => [...el.querySelectorAll(s)];
  const alturaTopo = () => (q('.topo') ? q('.topo').offsetHeight : 0);
  const chegouComAncora = location.hash.length > 1;

  /* ---------- rolagem suave (Lenis) ---------- */
  let lenis = null;
  const semReducao = matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (semReducao && window.Lenis && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    root.classList.add('com-lenis');
  }

  // âncoras: com Lenis, rola até o destino descontando o cabeçalho fixo; sem Lenis, o navegador cuida (scroll-padding-top)
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || !lenis) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || url.hash.length < 2) return;
    const alvo = document.getElementById(url.hash.slice(1));
    if (!alvo) return;
    e.preventDefault();
    lenis.scrollTo(alvo, { offset: -(alturaTopo() + 8) });
    history.pushState(null, '', url.hash);
  });

  /* ---------- contadores (98%, 1.900, 18) ---------- */
  const contadores = qa('.count').filter(el => el.getBoundingClientRect().top > innerHeight * 0.92);

  /* ---------- faixa da frota: pausa com o mouse em cima e fora da tela ----------
     Usa pointerenter/pointerleave (e não :hover, que pode ficar travado depois de uma rolagem)
     e uma única função decide o estado, para que um evento não desfaça o outro. */
  const trilho = q('.frota-trilho'), faixa = q('.frota-faixa');
  if (trilho && faixa) {
    let sobMouse = false, naTela = true;
    const aplicar = () => { trilho.style.animationPlayState = (sobMouse || !naTela) ? 'paused' : 'running'; };
    faixa.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { sobMouse = true; aplicar(); } });
    faixa.addEventListener('pointerleave', () => { sobMouse = false; aplicar(); });
    faixa.addEventListener('pointercancel', () => { sobMouse = false; aplicar(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(en => { naTela = en[0].isIntersecting; aplicar(); }).observe(faixa);
  }

  /* ---------- itens que entram ao aparecer ---------- */
  // o motion pode chegar depois da primeira rolagem: o que já está na tela (ou acima dela) não é escondido de novo
  const foraDaTela = el => el.getBoundingClientRect().top > innerHeight * 0.92;
  const revelaveis = qa([
    '.trajeto-head .rotulo', '.trajeto-head .lead', '#servicos .rotulo', '.lista-serv li', '.serv-rodape',
    '.frota-topo .rotulo', '.frota-topo .lead', '.composicao li',
    '.cob-txt > :not(h2)', '.prazos h3', '.prazos dl > div', '.chamada .wrap > :not(h2)',
    '#duvidas .faq-grid > div:first-child > :not(h2)', '.faq details', '.texto > *', '.ficha',
  ].join(',')).filter(foraDaTela);
  const titulos = qa('#h-traj, #h-serv, #h-frota, #h-cob, .chamada h2, #h-faq, .texto > h2').filter(foraDaTela);

  const mm = gsap.matchMedia();
  mm.add({
    reduzir: '(prefers-reduced-motion: reduce)',
    mover: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 1001px)',
    mouse: '(hover: hover) and (pointer: fine)',
  }, ctx => {
    const { reduzir, desktop, mouse } = ctx.conditions;

    /* movimento reduzido: só fades curtos, números já no valor final */
    if (reduzir) {
      gsap.set([...revelaveis, ...titulos], { opacity: 0 });
      ScrollTrigger.batch([...revelaveis, ...titulos], { start: 'top 92%', once: true, onEnter: b => gsap.to(b, { opacity: 1, duration: 0.3, overwrite: true }) });
      return;
    }

    /* 1. títulos das seções sobem linha por linha atrás de uma máscara (a abertura do topo é CSS) */
    if (SplitText) {
      titulos.forEach(t => {
        const split = SplitText.create(t, { type: 'words', mask: 'words', wordsClass: 'palavra-titulo' });
        gsap.set(split.words, { yPercent: 115 });
        ScrollTrigger.create({
          trigger: t, start: 'top 88%', once: true,
          onEnter: () => gsap.to(split.words, { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.05, onComplete: () => split.revert() }),
        });
      });
    }

    /* 4. itens entrando em sequência ao aparecer na tela */
    gsap.set(revelaveis, { opacity: 0, y: 18 });
    ScrollTrigger.batch(revelaveis, {
      start: 'top 88%',
      onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07, overwrite: true }),
      onEnterBack: b => gsap.to(b, { opacity: 1, y: 0, duration: 0.5, overwrite: true }),
    });

    /* números: o 98% ganha um anel que se preenche até o valor; 1.900 e 18 sobem de uma máscara */
    contadores.forEach(el => {
      const alvo = parseInt(el.dataset.target, 10) || 0;
      const bloco = el.closest('.numeros > div') || el.parentElement;
      const b = el.closest('b');
      const mascara = document.createElement('span');
      mascara.className = 'numero-mask';
      b.parentNode.insertBefore(mascara, b);
      mascara.appendChild(b);
      gsap.set(b, { yPercent: 110 });
      const tl = gsap.timeline({ paused: true });
      tl.to(b, { yPercent: 0, duration: 1, ease: 'expo.out' });
      const anel = bloco.querySelector('.progresso');
      if (anel) tl.to(anel, { strokeDashoffset: 100 - alvo, duration: 1.8, ease: 'power3.out' }, 0.1);
      ScrollTrigger.create({ trigger: bloco, start: 'top 82%', once: true, onEnter: () => tl.play() });
    });

    /* 2. o trajeto da carga */
    const sec = q('#trajeto'), pista = q('#estrada .pista'), paradas = qa('.parada'), seguro = q('.seguro-faixa');
    if (sec && paradas.length) {
      if (desktop && pista) {
        // a estrada se revela da esquerda para a direita (clip-path) e cada parada acende quando a estrada chega nela
        gsap.set(pista, { clipPath: 'inset(-40% 100% -40% 0%)' });
        gsap.set(paradas, { opacity: 0.18 });
        gsap.set(qa('.parada .marco'), { scale: 0.55 });
        if (seguro) gsap.set(seguro, { opacity: 0, y: 24 });
        // fixa a partir do início do conteúdo: parte do espaçamento de cima pode sair da tela
        const cs = getComputedStyle(sec), padTopo = parseFloat(cs.paddingTop), padBase = parseFloat(cs.paddingBottom);
        const folga = 28, cabe = sec.offsetHeight - padTopo - padBase + folga * 2 + alturaTopo() <= innerHeight;
        const tl = gsap.timeline({
          scrollTrigger: cabe
            ? { trigger: sec, start: () => `top+=${padTopo - folga} ${alturaTopo()}`, end: '+=130%', pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true }
            : { trigger: '#estrada', start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
        });
        tl.to(pista, { clipPath: 'inset(-40% 0% -40% 0%)', ease: 'none', duration: 1 }, 0);
        const brilho = q('#estrada .fio-brilho');
        if (brilho) tl.fromTo(brilho, { strokeDashoffset: 0 }, { strokeDashoffset: -100, ease: 'none', duration: 1 }, 0);
        // o caminhão anda sobre a estrada, seguindo a ponta da revelação (coordenadas do SVG: 1200x90)
        const camEl = q('#estrada-cam'), estradaEl = q('#estrada');
        if (camEl && estradaEl) {
          const posicao = { t: 0 };
          const pontoNaEstrada = t => {
            const x = 25 + 1150 * t, y = 62 - 48 * t; // a linha da estrada vai de (25, 62) a (1175, 14)
            const px = x / 1200 * estradaEl.offsetWidth;
            camEl.style.transform = 'translate3d(' + (px - 32) + 'px, ' + (y - 24) + 'px, 0)';
            camEl.style.opacity = String(Math.min(1, t * 12));
          };
          tl.to(posicao, { t: 1, ease: 'none', duration: 1, onUpdate: () => pontoNaEstrada(posicao.t) }, 0);
        }
        paradas.forEach((p, i) => {
          const t = 0.1 + i * 0.25; // cada marco fica no centro da sua coluna (12,5%, 37,5%...)
          const marco = q('.marco', p);
          const anel = document.createElement('span'); anel.className = 'anel'; anel.setAttribute('aria-hidden', 'true');
          marco.appendChild(anel);
          tl.to(p, { opacity: 1, duration: 0.14, ease: 'none' }, t)
            .to(marco, { scale: 1, duration: 0.14, ease: 'back.out(2.2)' }, t)
            .fromTo(anel, { scale: 1, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: 0.5, ease: 'power2.out' }, t + 0.1);
        });
        if (seguro) tl.to(seguro, { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 1);
        if (cabe) tl.to({}, { duration: 0.18 }); // segura a cena completa um instante antes de soltar
      } else {
        // celular: a linha vertical cresce com a rolagem e as paradas entram uma a uma (sem pin)
        const ol = q('.paradas');
        gsap.fromTo(ol, { '--linha': 0 }, { '--linha': 1, ease: 'none', scrollTrigger: { trigger: ol, start: 'top 75%', end: 'bottom 60%', scrub: 0.4 } });
        paradas.forEach(p => gsap.from(p, { opacity: 0, x: -14, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 85%', once: true } }));
        if (seguro) gsap.from(seguro, { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: seguro, start: 'top 88%', once: true } });
      }
    }

    /* 3. fotos: parallax sutil (só desktop) e o vídeo da frota revelado por clip-path */
    if (desktop) {
      const parallax = (img, trigger, de, ate) => {
        if (!img) return;
        gsap.set(img, { scale: 1.16 });
        gsap.fromTo(img, { yPercent: de }, { yPercent: ate, ease: 'none', scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true } });
      };
      parallax(q('.hero > img'), '.hero', 0, 7);
      parallax(q('.chamada > img'), '.chamada', -7, 7);
      parallax(q('.topo-int > img'), '.topo-int', 0, 7);
    }
    const video = q('.video-frota');
    if (video) {
      gsap.fromTo(video, { clipPath: 'inset(14% 14% 14% 14% round 20px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.2, ease: 'power3.inOut',
        scrollTrigger: { trigger: video, start: 'top 85%', once: true },
      });
    }

    /* 5. botões dourados "magnéticos" (só com mouse) */
    const limpar = [];
    if (mouse) {
      qa('.btn-ouro').forEach(btn => {
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
        const mover = e => {
          const r = btn.getBoundingClientRect();
          xTo(((e.clientX - r.left) / r.width - 0.5) * 12);
          yTo(((e.clientY - r.top) / r.height - 0.5) * 10);
        };
        const soltar = () => { xTo(0); yTo(0); };
        btn.addEventListener('pointermove', mover);
        btn.addEventListener('pointerleave', soltar);
        limpar.push(() => { btn.removeEventListener('pointermove', mover); btn.removeEventListener('pointerleave', soltar); });
      });
    }
    return () => limpar.forEach(f => f());
  });

  // por último, para os pins de cima já estarem calculados (senão a posição desta seção sai errada)
  /* ---------- caminhão que percorre a página e entra na doca do cliente (só telas largas) ---------- */
  const janela = q('#caminhao-janela'), camImg = q('#caminhao-img'), dock = q('#doca-fim');
  const hero = q('.hero');
  if (janela && camImg && dock && hero && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const desenhaCaminhao = sy => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const heroFim = hero.getBoundingClientRect().bottom + sy;      // o caminhão só começa depois do topo
      const p = Math.min(1, Math.max(0, (sy - heroFim) / Math.max(1, max - heroFim)));
      const visivel = Math.min(1, Math.max(0, (sy - heroFim) / 160));
      const camH = camImg.offsetHeight, dockH = dock.offsetHeight, dockTop = dock.getBoundingClientRect().top;
      const inicio = 150; // logo abaixo do cabeçalho fixo
      // no fim da página a cabine chega à porta da doca; a parte que passa da linha da doca fica escondida
      const fim = innerHeight - dockH - camH * 0.2;
      const y = inicio + (fim - inicio) * p;
      camImg.style.transform = 'translate3d(0, ' + y + 'px, 0)';
      janela.style.clipPath = 'inset(0 0 ' + Math.max(0, innerHeight - dockTop) + 'px 0)';
      janela.style.opacity = String(visivel);
      dock.classList.toggle('chegou', p >= 0.98);
    };
    ScrollTrigger.create({
      trigger: document.documentElement, start: 'top top', end: 'bottom bottom',
      onUpdate: s => desenhaCaminhao(s.scroll()), onRefresh: s => desenhaCaminhao(s.scroll()),
    });
  }

  // chegada com âncora (ex.: vindo de uma página interna para ./#frota): recalcula com o pin já aplicado.
  // Este arquivo já roda depois do load, então faz isso direto.
  ScrollTrigger.refresh();
  if (chegouComAncora) {
    const alvo = document.getElementById(location.hash.slice(1));
    if (alvo) {
      if (lenis) lenis.scrollTo(alvo, { offset: -(alturaTopo() + 8), immediate: true });
      else alvo.scrollIntoView();
    }
  }
})();

/**
 * Diorama Interativo — Antes que se esqueça
 * Renderiza e anima a representação vetorial isométrica das 4 etapas de criação:
 * 0: Memórias & Fotos
 * 1: Modelagem 3D & Blueprint
 * 2: Impressão 3D & Pintura artesanal
 * 3: Caixa de presente pronta
 */

(function () {
  var captions = [
    "fotos, lembranças e detalhes daquele lugar",
    "o espaço modelado em 3D e ajustado com você",
    "impressão camada por camada e pintura à mão",
    "a memória viva na caixa, pronta pra emocionar"
  ];

  function buildSVG() {
    return `
    <svg viewBox="0 0 500 450" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="overflow:visible">
      <defs>
        <!-- Filtros e sombras -->
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="cardShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#5C261C" flood-opacity="0.18" />
        </filter>
        <!-- Gradientes -->
        <linearGradient id="wallGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FDF3E6" />
          <stop offset="100%" stop-color="#F7E6D0" />
        </linearGradient>
        <linearGradient id="woodFloor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#D9A683" />
          <stop offset="100%" stop-color="#C28A65" />
        </linearGradient>
        <linearGradient id="terraGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#C75B3B" />
          <stop offset="100%" stop-color="#B04A2B" />
        </linearGradient>
        <linearGradient id="windowLight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFF5DF" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#F6B49A" stop-opacity="0.2" />
        </linearGradient>
        <pattern id="sliceLines" width="20" height="4" patternUnits="userSpaceOnUse">
          <line x1="0" y1="2" x2="20" y2="2" stroke="#5C261C" stroke-width="0.75" stroke-opacity="0.25" />
        </pattern>
      </defs>

      <!-- BASE / PLATAFORMA ISOMÉTRICA (PERSISTENTE) -->
      <g id="diorama-base" transform="translate(250, 240)">
        <!-- Piso Isométrico -->
        <polygon points="0,-70 170,18 0,105 -170,18" fill="url(#woodFloor)" stroke="#B04A2B" stroke-width="2" />
        <!-- Parede Esquerda -->
        <polygon points="-170,18 0,-70 0,-180 -170,-92" fill="#FDF3E6" stroke="#B04A2B" stroke-width="2" />
        <!-- Parede Direita -->
        <polygon points="0,-70 170,18 170,-92 0,-180" fill="#F7E6D0" stroke="#B04A2B" stroke-width="2" />
        
        <!-- Rodapés e linhas de assoalho -->
        <line x1="-170" y1="18" x2="0" y2="-70" stroke="#B04A2B" stroke-width="2" stroke-opacity="0.5" />
        <line x1="0" y1="-70" x2="170" y2="18" stroke="#B04A2B" stroke-width="2" stroke-opacity="0.5" />
        
        <!-- Janela na parede esquerda -->
        <g id="d-window" transform="translate(-100, -85)">
          <polygon points="-35,18 20,-10 20,-90 -35,-62" fill="#FFEECB" stroke="#B04A2B" stroke-width="2" />
          <!-- Cortina suave -->
          <polygon points="-38,16 -22,8 -22,-68 -38,-60" fill="#FFFFFF" fill-opacity="0.8" />
          <polygon points="5,-3 22,-12 22,-88 5,-80" fill="#FFFFFF" fill-opacity="0.8" />
          <!-- Caixilho cruzado -->
          <line x1="-8" y1="4" x2="-8" y2="-76" stroke="#B04A2B" stroke-width="1.5" />
          <line x1="-35" y1="-22" x2="20" y2="-50" stroke="#B04A2B" stroke-width="1.5" />
          <!-- Feixe de luz solar -->
          <polygon id="d-sunbeam" points="-30,10 15,-15 110,60 10,95" fill="url(#windowLight)" opacity="0.6" />
        </g>

        <!-- Tapetinho no chão -->
        <g id="d-rug" transform="translate(0, 15)">
          <polygon points="0,-30 75,9 0,48 -75,9" fill="#F6B49A" stroke="#B04A2B" stroke-width="1.5" />
          <polygon points="0,-25 65,8 0,41 -65,8" fill="none" stroke="#FDF3E6" stroke-width="1" stroke-dasharray="3,3" />
        </g>

        <!-- Poltrona Aconchegante (Centro-esquerda) -->
        <g id="d-armchair" transform="translate(-20, -5)">
          <!-- Base / pernas -->
          <line x1="-28" y1="28" x2="-28" y2="38" stroke="#5C261C" stroke-width="3" stroke-linecap="round" />
          <line x1="18" y1="48" x2="18" y2="58" stroke="#5C261C" stroke-width="3" stroke-linecap="round" />
          <line x1="38" y1="28" x2="38" y2="38" stroke="#5C261C" stroke-width="3" stroke-linecap="round" />
          <line x1="-8" y1="8" x2="-8" y2="18" stroke="#5C261C" stroke-width="3" stroke-linecap="round" />
          <!-- Assento -->
          <polygon points="5,-5 42,12 10,32 -28,15" fill="#B04A2B" stroke="#5C261C" stroke-width="2" />
          <!-- Almofada -->
          <polygon points="4,-8 38,8 8,26 -26,10" fill="#F6B49A" stroke="#B04A2B" stroke-width="1.5" />
          <!-- Encosto florido / vintage -->
          <polygon points="-28,15 5,-5 5,-55 -28,-35" fill="#93391F" stroke="#5C261C" stroke-width="2" />
          <polygon points="5,-5 42,12 42,-38 5,-55" fill="#B04A2B" stroke="#5C261C" stroke-width="2" />
          <!-- Braço esquerdo e direito -->
          <polygon points="-32,13 -18,6 -18,-14 -32,-7" fill="#F6B49A" stroke="#5C261C" stroke-width="1.5" />
          <polygon points="26,18 42,10 42,-10 26,-2" fill="#F6B49A" stroke="#5C261C" stroke-width="1.5" />
        </g>

        <!-- Estante de livros na parede direita -->
        <g id="d-bookshelf" transform="translate(100, -45)">
          <!-- Corpo da estante -->
          <polygon points="0,-10 25,3 25,-105 0,-118" fill="#5C261C" stroke="#431A13" stroke-width="2" />
          <polygon points="-38,8 0,-10 0,-118 -38,-100" fill="#93391F" stroke="#431A13" stroke-width="2" />
          <!-- Prateleiras e livros coloridos -->
          <polygon points="-36,-18 -2,-34 22,-22 -12,-6" fill="#FDF3E6" opacity="0.4" />
          <rect x="-30" y="-32" width="6" height="18" fill="#F6B49A" />
          <rect x="-22" y="-30" width="8" height="16" fill="#FDF3E6" />
          <rect x="-12" y="-34" width="7" height="20" fill="#B04A2B" />
          <!-- Vasinho com plantinha -->
          <circle cx="12" cy="-30" r="4" fill="#C28A65" />
          <path d="M12,-34 Q8,-42 5,-38 Q12,-38 12,-34 Q14,-44 19,-40 Q15,-36 12,-34" fill="#6B8E23" />
        </g>

        <!-- Vasinho com Samambaia no chão -->
        <g id="d-plant" transform="translate(-75, 45)">
          <polygon points="-12,0 0,-6 12,0 0,6" fill="#C75B3B" stroke="#5C261C" stroke-width="1.5" />
          <polygon points="-12,0 0,6 0,22 -12,16" fill="#93391F" stroke="#5C261C" stroke-width="1.5" />
          <polygon points="0,6 12,0 12,16 0,22" fill="#B04A2B" stroke="#5C261C" stroke-width="1.5" />
          <!-- Folhas curvas -->
          <path d="M0,0 Q-18,-20 -28,-10 Q-15,-6 0,0" fill="#5A7D28" stroke="#431A13" stroke-width="1" />
          <path d="M0,0 Q-10,-32 0,-30 Q-2,-14 0,0" fill="#6E9930" stroke="#431A13" stroke-width="1" />
          <path d="M0,0 Q18,-24 24,-14 Q12,-8 0,0" fill="#5A7D28" stroke="#431A13" stroke-width="1" />
        </g>
      </g>

      <!-- ================= ETAPA 0: FOTOS & MEMÓRIAS ================= -->
      <g id="stage-0" class="stage-layer">
        <!-- Linhas e moldura de esboço/memória -->
        <rect x="30" y="25" width="440" height="390" rx="20" fill="none" stroke="#B04A2B" stroke-width="2" stroke-dasharray="6,6" opacity="0.4" />
        
        <!-- Foto Polaroid 1 (Esquerda superior) -->
        <g id="polaroid-1" transform="translate(45, 60) rotate(-8)" filter="url(#cardShadow)">
          <rect x="0" y="0" width="115" height="135" rx="6" fill="#FFFFFF" stroke="#F7E6D0" stroke-width="2" />
          <rect x="10" y="10" width="95" height="90" rx="4" fill="#FDF3E6" />
          <!-- Desenho simples da vovó na poltrona -->
          <circle cx="58" cy="45" r="16" fill="#F6B49A" />
          <path d="M40,85 C40,65 76,65 76,85 Z" fill="#B04A2B" />
          <text x="58" y="122" font-family="'Fredoka', sans-serif" font-size="12" font-weight="600" fill="#5C261C" text-anchor="middle">sala da vó '98</text>
          <!-- Alfinete / coração -->
          <circle cx="58" cy="6" r="4" fill="#B04A2B" />
        </g>

        <!-- Foto Polaroid 2 (Direita superior) -->
        <g id="polaroid-2" transform="translate(330, 45) rotate(7)" filter="url(#cardShadow)">
          <rect x="0" y="0" width="125" height="145" rx="6" fill="#FFFFFF" stroke="#F7E6D0" stroke-width="2" />
          <rect x="10" y="10" width="105" height="98" rx="4" fill="#F7E6D0" />
          <!-- Janela do domingo -->
          <rect x="25" y="25" width="75" height="60" fill="#FFF5DF" stroke="#B04A2B" stroke-width="1.5" />
          <line x1="62" y1="25" x2="62" y2="85" stroke="#B04A2B" stroke-width="1" />
          <line x1="25" y1="55" x2="100" y2="55" stroke="#B04A2B" stroke-width="1" />
          <text x="62" y="130" font-family="'Fredoka', sans-serif" font-size="12" font-weight="600" fill="#5C261C" text-anchor="middle">domingo à tarde ♥</text>
        </g>

        <!-- Bilhete carinhoso -->
        <g id="note-card" transform="translate(190, 40) rotate(-2)" filter="url(#cardShadow)">
          <rect x="0" y="0" width="120" height="65" rx="8" fill="#FFEECB" />
          <path d="M15,22 L105,22 M15,36 L85,36 M15,50 L60,50" stroke="#B04A2B" stroke-width="2" stroke-linecap="round" stroke-opacity="0.45" />
          <circle cx="98" cy="46" r="8" fill="#B04A2B" />
          <path d="M98,49 s-3,-2 -4,-4 c-1,-1.5 1,-3 2.5,-2 c1,0.6 1.5,1.5 1.5,1.5 c0,0 0.5,-0.9 1.5,-1.5 c1.5,-1 3.5,0.5 2.5,2 c-1,2 -4,4 -4,4 Z" fill="#FDF3E6" />
        </g>
      </g>

      <!-- ================= ETAPA 1: MODELAGEM 3D / CAD ================= -->
      <g id="stage-1" class="stage-layer" opacity="0">
        <!-- Grade wireframe isométrica overlay -->
        <g stroke="#1F6FEB" stroke-width="1" stroke-opacity="0.5" fill="none">
          <line x1="80" y1="258" x2="250" y2="170" />
          <line x1="420" y1="258" x2="250" y2="170" />
          <line x1="250" y1="170" x2="250" y2="60" />
          <!-- Caixa delimitadora / Bounding box -->
          <polygon points="250,70 420,158 250,245 80,158" stroke-dasharray="4,4" />
          <line x1="80" y1="158" x2="80" y2="258" stroke-dasharray="4,4" />
          <line x1="420" y1="158" x2="420" y2="258" stroke-dasharray="4,4" />
          <line x1="250" y1="245" x2="250" y2="345" stroke-dasharray="4,4" />
        </g>

        <!-- Cotas e marcadores de dimensão -->
        <g font-family="'Outfit', sans-serif" font-size="11" font-weight="700" fill="#1F6FEB">
          <!-- Cota da poltrona -->
          <circle cx="230" cy="235" r="3" fill="#1F6FEB" />
          <line x1="230" y1="235" x2="160" y2="200" stroke="#1F6FEB" stroke-width="1.5" />
          <text x="145" y="195">48 mm</text>
          
          <!-- Cota da janela -->
          <circle cx="150" cy="155" r="3" fill="#1F6FEB" />
          <line x1="150" y1="155" x2="90" y2="115" stroke="#1F6FEB" stroke-width="1.5" />
          <text x="75" y="110">escala 1:24</text>
        </g>

        <!-- Ícone / cursor de rotação 3D -->
        <g id="cad-gizmo" transform="translate(250, 240)">
          <circle cx="0" cy="0" r="28" fill="none" stroke="#B04A2B" stroke-width="2" stroke-dasharray="5,3" />
          <polygon points="0,-28 -5,-36 5,-36" fill="#B04A2B" />
          <polygon points="28,0 36,-5 36,5" fill="#B04A2B" />
        </g>
      </g>

      <!-- ================= ETAPA 2: IMPRESSÃO 3D & PINTURA ================= -->
      <g id="stage-2" class="stage-layer" opacity="0">
        <!-- Máscara de fatiamento 3D sobre o ambiente -->
        <rect x="70" y="50" width="360" height="300" fill="url(#sliceLines)" pointer-events="none" />

        <!-- Bico Extrusor / Cabeçote de Impressão 3D -->
        <g id="printer-head" transform="translate(230, 215)">
          <path d="M-15,-60 L15,-60 L15,-20 L0,0 L-15,-20 Z" fill="#5C261C" stroke="#431A13" stroke-width="2" />
          <rect x="-8" y="-55" width="16" height="30" fill="#C75B3B" />
          <!-- Laser / filamento em ação -->
          <circle cx="0" cy="1" r="3" fill="#FFEECB" filter="url(#softGlow)" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#FFEECB" stroke-width="2" />
        </g>

        <!-- Pincel artesanal de pintura -->
        <g id="art-brush" transform="translate(340, 160) rotate(-35)">
          <polygon points="-4,-70 4,-70 3,-10 -3,-10" fill="#C28A65" stroke="#5C261C" stroke-width="1.5" />
          <rect x="-4" y="-10" width="8" height="12" fill="#D9A683" stroke="#5C261C" stroke-width="1.5" />
          <path d="M-4,2 C-4,14 4,14 4,2 Z" fill="#B04A2B" />
          <!-- Gotinha de tinta fresca -->
          <circle cx="0" cy="16" r="3" fill="#B04A2B" />
        </g>

        <!-- Paleta de cores em miniatura -->
        <g id="paint-palette" transform="translate(60, 310)" filter="url(#cardShadow)">
          <ellipse cx="40" cy="25" rx="35" ry="22" fill="#FDF3E6" stroke="#B04A2B" stroke-width="2" />
          <circle cx="22" cy="20" r="5" fill="#B04A2B" />
          <circle cx="36" cy="14" r="5" fill="#F6B49A" />
          <circle cx="52" cy="18" r="5" fill="#5C261C" />
          <circle cx="45" cy="30" r="5" fill="#C28A65" />
        </g>
      </g>

      <!-- ================= ETAPA 3: CAIXA DE PRESENTE PRONTA ================= -->
      <g id="stage-3" class="stage-layer" opacity="0">
        <!-- Caixa de linho aberta que envolve a maquete -->
        <g id="gift-box-walls" transform="translate(250, 240)">
          <!-- Lateral esquerda da caixa -->
          <polygon points="-185,15 -185,90 -5,178 -5,103" fill="#FDF3E6" stroke="#B04A2B" stroke-width="2.5" />
          <!-- Lateral direita da caixa -->
          <polygon points="-5,103 -5,178 185,90 185,15" fill="#F7E6D0" stroke="#B04A2B" stroke-width="2.5" />
          <!-- Papel de seda / crinkle paper aconchegante -->
          <path d="M-175,20 Q-150,5 -130,22 Q-100,5 -70,24 Q-30,8 -5,22 Q30,6 70,24 Q110,6 140,24 Q165,10 175,20" fill="none" stroke="#D9A683" stroke-width="5" stroke-linecap="round" />
        </g>

        <!-- Tampa da caixa apoiada / flutuando suavemente -->
        <g id="box-lid" transform="translate(140, 80) rotate(-14)" filter="url(#cardShadow)">
          <polygon points="0,-40 130,15 0,70 -130,15" fill="#FDF3E6" stroke="#B04A2B" stroke-width="2.5" />
          <polygon points="-130,15 0,70 0,95 -130,40" fill="#F7E6D0" stroke="#B04A2B" stroke-width="2.5" />
          <polygon points="0,70 130,15 130,40 0,95" fill="#EBD5BF" stroke="#B04A2B" stroke-width="2.5" />
          <!-- Fita Terracota cruzando a tampa -->
          <polygon points="-15,-33 15,-20 0,70 -30,57" fill="#B04A2B" opacity="0.9" />
          <!-- Laço com coração -->
          <circle cx="-12" cy="18" r="14" fill="#B04A2B" />
          <circle cx="-12" cy="18" r="6" fill="#FDF3E6" />
        </g>

        <!-- Brilhos / Sparkles de encanto -->
        <g id="sparkles" fill="#B04A2B">
          <path class="sparkle" d="M380,80 Q380,95 395,95 Q380,95 380,110 Q380,95 365,95 Q380,95 380,80 Z" />
          <path class="sparkle" d="M110,240 Q110,250 120,250 Q110,250 110,260 Q110,250 100,250 Q110,250 110,240 Z" />
          <path class="sparkle" d="M410,270 Q410,282 422,282 Q410,282 410,294 Q410,282 398,282 Q410,282 410,270 Z" />
        </g>
      </g>
    </svg>
    `;
  }

  var currentStep = -1;
  var containerEl = null;
  var captionEl = null;
  var progressEl = null;

  function init() {
    containerEl = document.querySelector("[data-diorama]");
    captionEl = document.querySelector("[data-caption]");
    progressEl = document.querySelector("[data-progress]");

    if (!containerEl) return;
    containerEl.innerHTML = buildSVG();

    // Começa no passo 0
    setStep(0, true);
  }

  function setStep(index, immediate) {
    if ((index === currentStep && !immediate) || index < 0 || index > 3) return;
    currentStep = index;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var animated = window.gsap && !immediate && !reduce;
    if (window.gsap) {
      // Stop a previous stage before a rapid scroll starts the next one.
      gsap.killTweensOf("#polaroid-1, #polaroid-2, #cad-gizmo, #printer-head, #art-brush, #box-lid, .sparkle");
      gsap.set("#polaroid-1, #polaroid-2, #cad-gizmo, #printer-head, #art-brush, #box-lid, .sparkle", { clearProps: "transform,opacity" });
    }

    // Atualiza legenda com fade suave
    if (captionEl) {
      captionEl.textContent = captions[index];
      if (window.gsap) gsap.killTweensOf(captionEl);
      if (animated) gsap.fromTo(captionEl, { opacity: 0.4 }, { opacity: 1, duration: 0.2, overwrite: true });
      else captionEl.style.opacity = "1";
    }

    // Atualiza barra de progresso
    if (progressEl) {
      var pct = (index + 1) / 4;
      if (animated) {
        gsap.to(progressEl, { scaleX: pct, duration: 0.25, ease: "power2.out" });
      } else {
        if (window.gsap) gsap.killTweensOf(progressEl);
        progressEl.style.transform = "scaleX(" + pct + ")";
      }
    }

    // Animação das camadas SVG
    var stages = [0, 1, 2, 3];
    stages.forEach(function (s) {
      var layer = document.getElementById("stage-" + s);
      if (!layer) return;

      var isActive = s === index;

      if (animated) {
        if (isActive) {
          gsap.to(layer, {
            opacity: 1,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto"
          });

          // Animações específicas de cada estágio
          if (s === 0) {
            gsap.fromTo("#polaroid-1", { scale: 0.92, y: -10 }, { scale: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" });
            gsap.fromTo("#polaroid-2", { scale: 0.92, y: 10 }, { scale: 1, y: 0, duration: 0.6, delay: 0.1, ease: "back.out(1.4)" });
          } else if (s === 1) {
            gsap.fromTo("#cad-gizmo", { rotation: -45 }, { rotation: 0, duration: 0.8, ease: "power3.out" });
          } else if (s === 2) {
            gsap.fromTo("#printer-head", { x: 200, y: 190 }, { x: 260, y: 220, duration: 1.2, repeat: 1, yoyo: true, ease: "sine.inOut" });
            gsap.fromTo("#art-brush", { rotation: -45, y: -8 }, { rotation: -30, y: 4, duration: 0.8, repeat: 1, yoyo: true, ease: "sine.inOut" });
          } else if (s === 3) {
            gsap.fromTo("#box-lid", { y: -20, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" });
            gsap.fromTo(".sparkle", { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, ease: "back.out(2)" });
          }
        } else {
          gsap.to(layer, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      } else {
        if (window.gsap) gsap.killTweensOf(layer);
        layer.style.opacity = isActive ? "1" : "0";
      }
    });
  }

  window.AQSE_Diorama = {
    init: init,
    setStep: setStep,
    getCurrentStep: function () { return currentStep; }
  };
})();

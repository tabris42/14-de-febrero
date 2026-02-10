//© Zero - Código libre no comercial

// Ajuste de velocidad del árbol (más alto = más lento)
const TREE_SLOW_MULT = 2.0;       // prueba 1.6 / 2.0 / 2.5
const MOVE_SCALE_MS = 1800;       // debe coincidir con CSS (1.8s)

// Arranque manual (Tap para empezar)
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('start-overlay');
  const btn = document.getElementById('start-btn');

  const start = () => {
    if (overlay) overlay.classList.add('hidden');

    // Iniciar música con gesto del usuario (evita bloqueo de autoplay)
    playBackgroundMusic();

    // Iniciar animación del árbol
    loadAndAnimateTree();

    // Evitar doble arranque
    if (btn) btn.removeEventListener('click', start);
    if (overlay) overlay.removeEventListener('click', start);
  };

  if (btn) btn.addEventListener('click', start);
  // Por si tocan fuera del botón también
  if (overlay) overlay.addEventListener('click', start);
});

function loadAndAnimateTree() {
  // Cargar el SVG y animar los corazones
  fetch('Img/treelove.svg')
    .then(res => res.text())
    .then(svgText => {
      const container = document.getElementById('tree-container');
      container.innerHTML = svgText;
      const svg = container.querySelector('svg');
      if (!svg) return;

      // Animación de "dibujo" para todos los paths
      const allPaths = Array.from(svg.querySelectorAll('path'));
      allPaths.forEach(path => {
        path.style.stroke = '#222';
        path.style.strokeWidth = '2.5';
        path.style.fillOpacity = '0';
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = 'none';
      });

      // Forzar reflow y luego animar
      setTimeout(() => {
        allPaths.forEach((path, i) => {
          const dur = 1200 * TREE_SLOW_MULT;
          const delay = i * 80 * TREE_SLOW_MULT;
          const fillDelayBase = 900 * TREE_SLOW_MULT;

          path.style.transition =
            `stroke-dashoffset ${dur}ms cubic-bezier(.77,0,.18,1) ${delay}ms, ` +
            `fill-opacity 500ms ${fillDelayBase + delay}ms`;

          path.style.strokeDashoffset = 0;

          setTimeout(() => {
            path.style.fillOpacity = '1';
            path.style.stroke = '';
            path.style.strokeWidth = '';
          }, dur + delay);
        });

        // Después de la animación de dibujo, mueve y agranda el SVG
        const totalDuration =
          (1200 * TREE_SLOW_MULT) +
          ((allPaths.length - 1) * 80 * TREE_SLOW_MULT) +
          500;

        setTimeout(() => {
          svg.classList.add('move-and-scale');

          // Mostrar texto con efecto typing (queda igual)
          setTimeout(() => {
            showDedicationText();
            startFloatingObjects();
            showCountdown();
            // Música ya se inició en "Empezar"
          }, MOVE_SCALE_MS);
        }, totalDuration);
      }, 50);

      // Selecciona los corazones (formas rojas)
      const heartPaths = allPaths.filter(el => {
        const style = el.getAttribute('style') || '';
        return style.includes('#FC6F58') || style.includes('#C1321F');
      });
      heartPaths.forEach(path => {
        path.classList.add('animated-heart');
      });
    });
}

// Efecto máquina de escribir para el texto de dedicatoria (seguidores)
function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() { //seguidores
  let text = getURLParam('text');
  if (!text) {
    text = `Para el amor de mi vida:
Desde que nos conocimos en aquella obra de servicio construyendo casas,
supe que estaríamos juntos por siempre.
Gracias por acompañarme en cada paso,
por entenderme incluso en silencio y por
llenar mis días con amor.
Te amo más de lo que las palabras pueden
expresar...`;
  }

  const dedicationElement = document.getElementById('dedication-text');
  dedicationElement.style.display = 'block';
  dedicationElement.innerHTML = '';

  // Crear un elemento para el texto con efecto typing
  const typingElement = document.createElement('div');
  typingElement.classList.add('typing-text');
  dedicationElement.appendChild(typingElement);

  // Firma opcional
  let signature = getURLParam('signature');
  if (!signature) signature = 'Con amor, Adriancito 💖';

  // Máquina de escribir (velocidad se mantiene igual)
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      typingElement.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
      i++;
      setTimeout(typeWriter, 40); // velocidad letras
    } else {
      // Al terminar, agrega firma
      const signatureElement = document.createElement('div');
      signatureElement.classList.add('signature');
      signatureElement.innerHTML = signature;
      dedicationElement.appendChild(signatureElement);
    }
  }

  typeWriter();
}

// Pétalos flotando / corazoncitos (seguidores)
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  container.innerHTML = '';

  const numObjects = 14; // cantidad

  for (let i = 0; i < numObjects; i++) {
    const obj = document.createElement('div');
    obj.classList.add('floating-object');
    obj.innerHTML = '🌸';

    const size = 18 + Math.random() * 18;
    obj.style.fontSize = `${size}px`;

    obj.style.left = `${Math.random() * 100}%`;
    obj.style.animationDuration = `${6 + Math.random() * 6}s`;
    obj.style.animationDelay = `${Math.random() * 2}s`;
    obj.style.opacity = `${0.4 + Math.random() * 0.6}`;

    container.appendChild(obj);

    obj.addEventListener('animationend', () => obj.remove());
  }

  // Repetir cada cierto tiempo
  setInterval(() => {
    const obj = document.createElement('div');
    obj.classList.add('floating-object');
    obj.innerHTML = '🌸';

    const size = 18 + Math.random() * 18;
    obj.style.fontSize = `${size}px`;

    obj.style.left = `${Math.random() * 100}%`;
    obj.style.animationDuration = `${6 + Math.random() * 6}s`;
    obj.style.animationDelay = `${Math.random() * 2}s`;
    obj.style.opacity = `${0.4 + Math.random() * 0.6}`;

    container.appendChild(obj);
    obj.addEventListener('animationend', () => obj.remove());
  }, 900);
}

// Cuenta regresiva (seguidores)
function showCountdown() {
  const countdownEl = document.getElementById('countdown');
  countdownEl.style.display = 'block';

  let startDateParam = getURLParam('start');
  let eventDateParam = getURLParam('event');

  // defaults (puedes cambiar después)
  const startDate = startDateParam ? new Date(startDateParam) : new Date('2010-04-26T00:00:00');
  const eventDate = eventDateParam ? new Date(eventDateParam) : new Date('2026-04-26T00:00:00');

  function update() {
    const now = new Date();

    // Tiempo juntos
    const diffStart = now - startDate;
    const daysTogether = Math.floor(diffStart / (1000 * 60 * 60 * 24));

    // Cuenta al evento
    const diffEvent = eventDate - now;

    let eventText = '';
    if (diffEvent > 0) {
      const days = Math.floor(diffEvent / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffEvent / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffEvent / (1000 * 60)) % 60);
      const seconds = Math.floor((diffEvent / 1000) % 60);
      eventText = `Faltan ${days}d ${hours}h ${minutes}m ${seconds}s para nuestro aniversario`;
    } else {
      eventText = `¡Hoy es el día! 💖`;
    }

    countdownEl.innerHTML = `
      <div class="count-title">💞 Nuestro tiempo de conocernos:</div>
      <div class="count-line">Llevamos <b>${daysTogether}</b> días juntos</div>
      <div class="count-line">${eventText}</div>
    `;
  }

  update();
  setInterval(update, 1000);
}

// Música (seguidores)
function playBackgroundMusic() {
  const audio = document.getElementById('background-music');
  if (!audio) return;

  // Crear botón si no existe
  let btn = document.getElementById('music-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'music-btn';
    btn.className = 'music-btn';
    btn.textContent = '🔊 Música';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    });
  }

  // Intentar reproducir (con gesto del usuario ya debería funcionar)
  audio.play().catch(() => {});
}

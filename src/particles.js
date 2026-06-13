/* =============================================
   PARTICLES — Canvas Network Animation
   ============================================= */

export function initParticles(canvasEl) {
  const ctx = canvasEl.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: -9999, y: -9999 };
  let animId;

  const PARTICLE_COUNT = 65;
  const CONNECTION_DISTANCE = 140;
  const MOUSE_RADIUS = 120;
  const PARTICLE_SIZE_MIN = 1;
  const PARTICLE_SIZE_MAX = 2.5;

  // ── Accent color in RGB for canvas ──
  const ACCENT_R = 139;
  const ACCENT_G = 92;
  const ACCENT_B = 246;

  function resize() {
    width = canvasEl.width = canvasEl.offsetWidth;
    height = canvasEl.height = canvasEl.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: PARTICLE_SIZE_MIN + Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN),
        opacity: 0.2 + Math.random() * 0.4
      });
    }
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Gentle mouse interaction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.01;
        p.vx -= dx * force;
        p.vy -= dy * force;
      }

      // Dampen velocity
      p.vx *= 0.999;
      p.vy *= 0.999;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          ctx.strokeStyle = `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      ctx.fillStyle = `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animate() {
    update();
    draw();
    animId = requestAnimationFrame(animate);
  }

  // ── Mouse tracking ──
  function handleMouseMove(e) {
    const rect = canvasEl.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function handleMouseLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  // ── Init ──
  resize();
  createParticles();
  animate();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  canvasEl.addEventListener('mousemove', handleMouseMove);
  canvasEl.addEventListener('mouseleave', handleMouseLeave);

  // Return cleanup function
  return function destroy() {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
    canvasEl.removeEventListener('mousemove', handleMouseMove);
    canvasEl.removeEventListener('mouseleave', handleMouseLeave);
  };
}

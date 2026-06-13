/* =============================================
   SCROLL, REVEAL, TYPEWRITER & CURSOR EFFECTS
   ============================================= */

/**
 * Initialize all animation handlers
 */
export function initAnimations() {
  // 1. Standard scroll fades
  initScrollAnimate();

  // 2. Block reveals
  initRevealAnimations();

  // 3. Typewriter roles selector
  initTypewriter();

  // 4. Mouse trail blob
  initMouseFollower();
}

/**
 * Scroll fade in animations
 */
function initScrollAnimate() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach((el) => observer.observe(el));
}

/**
 * Block reveal animation toggling
 */
function initRevealAnimations() {
  const wrappers = document.querySelectorAll('.reveal-wrapper');
  if (!wrappers.length) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const wrapper = entry.target;
          const box = wrapper.querySelector('.reveal-box');
          const content = wrapper.querySelector('.reveal-content');
          if (box && content) {
            box.classList.add('animate');
            setTimeout(() => {
              content.classList.add('revealed');
            }, 550); // half duration of scale animation to cover
          }
          revealObserver.unobserve(wrapper);
        }
      });
    },
    { threshold: 0.1 }
  );

  wrappers.forEach((w) => revealObserver.observe(w));
}

/**
 * Typewriter loop script
 */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const words = JSON.parse(element.getAttribute('data-words') || '[]');
  if (!words.length) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let currentText = '';

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      currentText = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      currentText = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    element.textContent = currentText;

    let typeSpeed = 100;
    if (isDeleting) {
      typeSpeed /= 2; // delete twice as fast
    }

    // State thresholds
    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 1800; // pause on full typed word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 450; // pause before typing next word
    }

    setTimeout(type, typeSpeed);
  }

  // Initial delay
  setTimeout(type, 800);
}

/**
 * Custom spring-lag mouse follow particle background
 */
function initMouseFollower() {
  const follower = document.getElementById('mouse-follower');
  if (!follower) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  // Track position
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Ease position update loop
  function easeLoop() {
    const ease = 0.085; // smooth lag factor
    followerX += (mouseX - followerX) * ease;
    followerY += (mouseY - followerY) * ease;

    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(easeLoop);
  }

  // Check if pointer support exists before looping
  if (window.matchMedia('(pointer: fine)').matches) {
    requestAnimationFrame(easeLoop);
  }
}

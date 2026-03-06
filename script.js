// ========================================
// Portfolio | Sai Sankar Madeti
// Interactive behaviors — Bento Grid Edition
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== Constellation Stars Background =====
  const canvas = document.getElementById('stars-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const hero = canvas.closest('.hero');
    let stars = [];
    let animId;
    let isVisible = true;
    const STAR_COUNT = 120;
    const MAX_DIST = 120;

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function createStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.5,
          dx: (Math.random() - 0.5) * 0.3,
          dy: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
    }

    function draw() {
      if (!isVisible) {
        cancelAnimationFrame(animId);
        animId = null;
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(162, 155, 254, ${0.15 * (1 - dist / MAX_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw stars
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 255, ${s.opacity})`;
        ctx.fill();

        // Move
        s.x += s.dx;
        s.y += s.dy;

        // Wrap around edges
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
      });

      animId = requestAnimationFrame(draw);
    }

    // Pause when hero is not visible, resume when it comes back
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animId) draw();
      if (!isVisible && animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    });
    observer.observe(hero);

    resize();
    createStars();
    draw();

    window.addEventListener('resize', () => {
      resize();
      createStars();
    });
  }

  // ===== Tech stack icon injection (Devicon + Simple Icons fallback) =====
  // Primary: Devicon font icons (loaded via CDN CSS)
  const deviconMap = {
    'python': 'devicon-python-plain',
    'react': 'devicon-react-original',
    'node.js': 'devicon-nodejs-plain',
    'next.js': 'devicon-nextjs-plain',
    'mongodb': 'devicon-mongodb-plain',
    'express.js': 'devicon-express-original',
    'docker': 'devicon-docker-plain',
    'redis': 'devicon-redis-plain',
    'fastapi': 'devicon-fastapi-plain',
    'grafana': 'devicon-grafana-plain',
    'vercel': 'devicon-vercel-original',
    'sql': 'devicon-azuresqldatabase-plain',
  };

  // Fallback: Simple Icons CDN (SVG images, theme-matched color)
  // Only verified-working slugs included
  const simpleIconMap = {
    'claude': 'anthropic',
    'langchain': 'langchain',
    'zapier': 'zapier',
    'make': 'make',
    'n8n': 'n8n',
    'stripe': 'stripe',
    'scikit-learn': 'scikitlearn',
    'clickhouse': 'clickhouse',
    'hubspot': 'hubspot',
  };

  const SI_COLORS = {
    services: '9ca3af',  // matches --text-dim for service cards
    projects: 'a29bfe',  // matches --primary-light for project cards
  };

  document.querySelectorAll('.card-tools li, .project-tech li').forEach(li => {
    const name = li.textContent.trim().toLowerCase();
    const isProject = li.closest('.project-tech') !== null;
    const siColor = isProject ? SI_COLORS.projects : SI_COLORS.services;

    // Try Devicon first
    if (deviconMap[name]) {
      const icon = document.createElement('i');
      icon.className = deviconMap[name];
      icon.setAttribute('aria-hidden', 'true');
      li.insertBefore(icon, li.firstChild);
      return;
    }

    // Fallback to Simple Icons CDN
    if (simpleIconMap[name]) {
      const img = document.createElement('img');
      img.src = `https://cdn.simpleicons.org/${simpleIconMap[name]}/${siColor}`;
      img.alt = '';
      img.className = 'si-icon';
      img.setAttribute('aria-hidden', 'true');
      img.loading = 'lazy';
      // Gracefully hide if icon fails to load
      img.onerror = () => img.remove();
      li.insertBefore(img, li.firstChild);
    }
  });

  // ===== Mobile Nav Toggle =====
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  // ===== Scroll-triggered animations (Intersection Observer) =====
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animateObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animateObserver.observe(el);
  });

  // ===== Navbar scroll effect =====
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== JS-based ripple effect on buttons =====
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // ===== Cursor-following glow on bento cards =====
  document.querySelectorAll('.bento-card, .project-card').forEach(card => {
    // Create glow element
    const glow = document.createElement('div');
    glow.classList.add('card-glow');
    card.appendChild(glow);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.left = x + 'px';
      glow.style.top = y + 'px';
    });
  });

  // ===== Card tilt effect on hover =====
  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2;
      const rotateY = ((x - centerX) / centerX) * 2;

      card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ===== Animated stat counter =====
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';

        if (isNaN(target)) return;

        const duration = 1500;
        const start = performance.now();
        const isDecimal = target % 1 !== 0;

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = isDecimal
            ? (target * eased).toFixed(1)
            : Math.floor(target * eased);

          el.textContent = prefix + current + suffix;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // Set final value
            el.textContent = prefix + (isDecimal ? target.toFixed(1) : target) + suffix;
            // Special case for the "10+" stat
            if (target === 10 && !suffix && !prefix) {
              el.textContent = '10+';
            }
          }
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

  // ===== Typing effect for hero tag =====
  const heroTag = document.querySelector('.hero-tag');
  if (heroTag) {
    heroTag.style.opacity = '0';
    heroTag.style.transform = 'translateY(10px)';
    setTimeout(() => {
      heroTag.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      heroTag.style.opacity = '1';
      heroTag.style.transform = 'translateY(0)';
    }, 300);
  }

  // ===== Live Demo Chatbot =====
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatSuggestions = document.getElementById('chatSuggestions');

  // Preset responses
  const responses = {
    'what ai services do you offer?': "I offer 10+ AI services including workflow automation, AI chatbots & voice agents, RAG knowledge bases, SaaS micro-products, content generation, consulting, SEO, video/image generation, data analytics, and rapid MVP development. Each service is tailored to your specific needs!",
    'what services do you offer?': "I offer 10+ AI services including workflow automation, AI chatbots & voice agents, RAG knowledge bases, SaaS micro-products, content generation, consulting, SEO, video/image generation, data analytics, and rapid MVP development. Each service is tailored to your specific needs!",
    'how can ai help my business?': "AI can help your business in many ways: automate repetitive workflows (save 100s of hours), build intelligent customer support chatbots (24/7 availability), generate content at 10x speed, analyze data for actionable insights, and build custom SaaS tools. Most businesses see 2x-10x ROI within the first few months!",
    "what's your tech stack?": "I work with a modern, production-grade stack: OpenAI GPT-4, Claude, LangChain, Pinecone, ChromaDB for AI/ML. Next.js, React, Node.js, Python, FastAPI for full-stack. n8n, Make, Zapier for automation. Plus Stripe, Vercel, Docker, Redis, and more for infrastructure.",
    'how fast can you build an mvp?': "With AI-accelerated development, I can go from idea to working MVP in 1-2 weeks for simpler products, and 3-4 weeks for more complex SaaS applications. You'll see weekly demos and progress from day one. Quick iterations are my specialty!",
  };

  const fallbackResponses = [
    "That's a great question! I specialize in AI automation, chatbots, SaaS products, and consulting. Want to dive deeper into any of these? Feel free to book a discovery call!",
    "Interesting! AI is transforming businesses every day. I'd love to discuss how it can help with your specific use case. Check out the services section above or reach out directly!",
    "Great thinking! The best way to explore this would be a quick discovery call. No commitment, just a friendly chat about your goals. Scroll down to the contact section to get started!",
  ];

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.classList.add('chat-msg', type);
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.classList.add('typing-indicator');
    typing.id = 'typingIndicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typing;
  }

  function getResponse(question) {
    const q = question.toLowerCase().trim();

    // Check for exact or partial matches
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key) || key.includes(q)) {
        return value;
      }
    }

    // Check for keyword matches
    if (q.includes('automat') || q.includes('workflow')) {
      return responses['what ai services do you offer?'];
    }
    if (q.includes('help') || q.includes('business') || q.includes('roi')) {
      return responses['how can ai help my business?'];
    }
    if (q.includes('tech') || q.includes('stack') || q.includes('tool')) {
      return responses["what's your tech stack?"];
    }
    if (q.includes('mvp') || q.includes('fast') || q.includes('quick') || q.includes('time')) {
      return responses['how fast can you build an mvp?'];
    }
    if (q.includes('price') || q.includes('cost') || q.includes('how much')) {
      return "Pricing depends on the scope and complexity of your project. Most automation projects start from a few hundred dollars, while full SaaS builds vary. Let's hop on a quick discovery call to give you an accurate quote!";
    }

    // Fallback
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    // Hide suggestions after first user message
    if (chatSuggestions) {
      chatSuggestions.style.display = 'none';
    }

    const typing = showTyping();

    // Simulate AI thinking delay
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      typing.remove();
      addMessage(getResponse(text), 'ai');
    }, delay);
  }

  if (chatSend) {
    chatSend.addEventListener('click', handleSend);
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  // Suggestion buttons
  if (chatSuggestions) {
    chatSuggestions.querySelectorAll('.demo-suggestion').forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.dataset.question;
        chatInput.value = question;
        handleSend();
      });
    });
  }

});

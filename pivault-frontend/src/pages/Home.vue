<template>
  <div class="relative min-h-screen bg-gray-950 text-white overflow-hidden">

    <!-- ═══════════════════════════════════════
         🌌 ANIMATED BACKGROUND
    ═══════════════════════════════════════ -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div class="orb orb-blue"></div>
      <div class="orb orb-purple"></div>
      <div class="orb orb-cyan"></div>
      <div class="grid-overlay"></div>
      <div class="particle" v-for="i in 18" :key="i" :style="particleStyle(i)"></div>
    </div>

    <!-- ═══════════════════════════════════════
         🔝 NAVBAR
    ═══════════════════════════════════════ -->
    <nav class="navbar" :class="{ 'navbar-scrolled': scrolled }">
      <div class="navbar-inner">

        <div class="navbar-brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="brand-name">PiVault</span>
        </div>

        <div class="navbar-links">
          <a href="#features" class="nav-link">Features</a>
          <a href="#why" class="nav-link">Why PiVault</a>
          <a href="#cta" class="nav-link">Get Started</a>
        </div>

        <div class="navbar-actions">
          <button @click="$router.push('/login')" class="login-btn">
            <LogIn class="w-4 h-4" />
            <span>Login</span>
          </button>
        </div>

      </div>
    </nav>

    <!-- ═══════════════════════════════════════
         🔥 HERO SECTION
    ═══════════════════════════════════════ -->
    <section class="hero-section">

      <!-- Slow drifting ghost text behind headline -->
      <div class="hero-bg-text" aria-hidden="true">
        <span>SECURE</span>
        <span>PRIVATE</span>
        <span>YOURS</span>
        <span>ENCRYPTED</span>
        <span>CLOUD</span>
        <span>VAULT</span>
      </div>

      <!-- Badge -->
      <div class="hero-badge" :class="{ 'animate-in': mounted }">
        <span class="badge-dot"></span>
        Powered by your own hardware
      </div>

      <!-- Headline -->
      <h1 class="hero-title" :class="{ 'animate-in': mounted }">
        Your Personal
        <span class="gradient-text">Cloud System</span>
      </h1>

      <!-- Trimmed description -->
      <p class="hero-desc" :class="{ 'animate-in': mounted }">
        Store, backup and access your files globally —<br class="hidden md:block" />
        on hardware you own.
      </p>

      <!-- CTAs -->
      <div class="hero-ctas" :class="{ 'animate-in': mounted }">
        <button @click="$router.push('/login')" class="btn-primary">
          Get Started
          <ArrowRight class="w-4 h-4" />
        </button>
        <a href="#features" class="btn-secondary">Learn More</a>
      </div>

      <!-- Scroll indicator -->
      <div class="scroll-indicator" :class="{ 'animate-in': mounted }">
        <div class="scroll-mouse">
          <div class="scroll-wheel"></div>
        </div>
      </div>

    </section>

    <!-- ═══════════════════════════════════════
         📊 STATS BAR
    ═══════════════════════════════════════ -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-value">100%</span>
        <span class="stat-label">Data Ownership</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">₹0</span>
        <span class="stat-label">Subscription Fee</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">24/7</span>
        <span class="stat-label">Always Accessible</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">E2E</span>
        <span class="stat-label">Encrypted</span>
      </div>
    </div>

    <!-- ═══════════════════════════════════════
         🔥 FEATURES SECTION
    ═══════════════════════════════════════ -->
    <section id="features" class="features-section">

      <div class="section-label">Core Features</div>
      <h2 class="section-title">Everything you need,<br />nothing you don't</h2>

      <div class="features-grid">

        <div class="feature-card feature-card--blue">
          <div class="feature-icon-wrap icon-blue">
            <Shield class="w-6 h-6" />
          </div>
          <div class="feature-glow glow-blue"></div>
          <h3 class="feature-title">Secure Storage</h3>
          <p class="feature-desc">Your data stays with you — not on third-party cloud services. Full encryption at rest and in transit.</p>
          <div class="feature-tag">AES-256</div>
        </div>

        <div class="feature-card feature-card--green">
          <div class="feature-icon-wrap icon-green">
            <DatabaseBackup class="w-6 h-6" />
          </div>
          <div class="feature-glow glow-green"></div>
          <h3 class="feature-title">Auto Backup</h3>
          <p class="feature-desc">Daily and weekly backups with zero manual effort. Schedule once, protect forever.</p>
          <div class="feature-tag">Scheduled</div>
        </div>

        <div class="feature-card feature-card--purple">
          <div class="feature-icon-wrap icon-purple">
            <Globe class="w-6 h-6" />
          </div>
          <div class="feature-glow glow-purple"></div>
          <h3 class="feature-title">Global Access</h3>
          <p class="feature-desc">Access your files anywhere securely using Tailscale. Your vault travels with you.</p>
          <div class="feature-tag">Tailscale VPN</div>
        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════
         🔥 WHY SECTION
    ═══════════════════════════════════════ -->
    <section id="why" class="why-section">
      <div class="why-inner">

        <div class="why-content">
          <div class="section-label">The Difference</div>
          <h2 class="section-title" style="text-align:left">Why PiVault?</h2>
          <p class="why-desc">
            Unlike traditional cloud services, PiVault gives you complete control with
            zero subscription cost and full privacy.
          </p>

          <div class="comparison-list">
            <div class="comparison-row">
              <div>Big Tech Clouds</div>
              <div></div>
              <div>PiVault</div>
            </div>
            <div class="comparison-item">
              <span>Subscription fees</span>
              <span class="comparison-vs">→</span>
              <span class="text-green-400">One-time hardware cost</span>
            </div>
            <div class="comparison-item">
              <span>They own your data</span>
              <span class="comparison-vs">→</span>
              <span class="text-green-400">You own your data</span>
            </div>
            <div class="comparison-item">
              <span>Privacy policies change</span>
              <span class="comparison-vs">→</span>
              <span class="text-green-400">Your rules, forever</span>
            </div>
            <div class="comparison-item">
              <span>Data center dependent</span>
              <span class="comparison-vs">→</span>
              <span class="text-green-400">Your hardware, your home</span>
            </div>
          </div>
        </div>

        <div class="why-visual">
          <div class="vault-graphic">
            <div class="vault-ring vault-ring--outer"></div>
            <div class="vault-ring vault-ring--mid"></div>
            <div class="vault-ring vault-ring--inner"></div>
            <div class="vault-core">
              <Shield class="w-8 h-8 text-blue-400" />
            </div>
            <div class="vault-orbit" v-for="(orb, i) in orbitItems" :key="i" :style="orbitStyle(i)">
              <span>{{ orb }}</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════
         🔥 CTA SECTION
    ═══════════════════════════════════════ -->
    <section id="cta" class="cta-section">
      <div class="cta-bg-glow"></div>
      <div class="section-label">Get Started</div>
      <h2 class="cta-title">Ready to take control<br />of your data?</h2>
      <p class="cta-sub">Join the self-hosted revolution. Your files, your rules.</p>
      <div class="cta-actions">
        <button @click="$router.push('/login')" class="btn-primary btn-large">
          <LogIn class="w-5 h-5" />
          Login to PiVault
        </button>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         🔻 FOOTER
    ═══════════════════════════════════════ -->
    <footer class="footer">
      <div class="footer-brand">
        <div class="brand-icon brand-icon--sm">
          <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
        <span>PiVault</span>
      </div>
      <p class="footer-copy">© 2026 PiVault — Personal Cloud System</p>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Shield, DatabaseBackup, Globe, ArrowRight, LogIn } from "lucide-vue-next";

const mounted = ref(false);
const scrolled = ref(false);
const orbitItems = ["📁", "🔒", "☁️", "🔑"];

onMounted(() => {
  setTimeout(() => { mounted.value = true; }, 100);
  window.addEventListener("scroll", () => {
    scrolled.value = window.scrollY > 20;
  });
});

function particleStyle(i) {
  const size = 2 + (i % 3);
  const delay = (i * 0.4) % 6;
  const duration = 8 + (i % 5) * 2;
  const left = (i * 5.5) % 100;
  const top = (i * 7.3) % 100;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };
}

function orbitStyle(i) {
  const angle = (i / 4) * 360;
  const radius = 100;
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;
  return {
    transform: `translate(${x}px, ${y}px)`,
    animationDelay: `${i * 0.5}s`,
  };
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

* { font-family: 'Outfit', sans-serif; }

/* ════════════════════════════════
   BACKGROUND
════════════════════════════════ */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: orbFloat 12s ease-in-out infinite;
}
.orb-blue {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%);
  top: -200px; left: -200px;
}
.orb-purple {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%);
  bottom: -150px; right: -150px;
  animation-delay: -4s;
}
.orb-cyan {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%);
  top: 40%; left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -8s;
}
@keyframes orbFloat {
  0%, 100% { transform: translateY(0px) scale(1); }
  33%  { transform: translateY(-40px) scale(1.05); }
  66%  { transform: translateY(20px) scale(0.97); }
}
.grid-overlay {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
}
.particle {
  position: absolute;
  background: rgba(255,255,255,0.35);
  border-radius: 50%;
  animation: particleDrift linear infinite;
}
@keyframes particleDrift {
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.6; }
  100% { transform: translateY(-80px) translateX(20px); opacity: 0; }
}

/* ════════════════════════════════
   NAVBAR
════════════════════════════════ */
.navbar {
  position: fixed; top: 0; width: 100%; z-index: 50;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(3,7,18,0.4);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}
.navbar-scrolled {
  background: rgba(3,7,18,0.85);
  box-shadow: 0 4px 30px rgba(0,0,0,0.4);
}
.navbar-inner {
  max-width: 1280px; margin: 0 auto; padding: 0 2rem;
  height: 68px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
}
.navbar-brand {
  display: flex; align-items: center; gap: 0.6rem; justify-self: start;
}
.brand-icon {
  width: 34px; height: 34px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: white;
  box-shadow: 0 0 16px rgba(59,130,246,0.4);
}
.brand-icon--sm { width: 28px; height: 28px; border-radius: 6px; }
.brand-name {
  font-size: 1.15rem; font-weight: 700; letter-spacing: -0.02em;
  background: linear-gradient(90deg, #fff, #94a3b8);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.navbar-links {
  display: flex; align-items: center; gap: 2rem; justify-self: center;
}
@media (max-width: 768px) { .navbar-links { display: none; } }
.nav-link {
  font-size: 0.875rem; font-weight: 500;
  color: rgba(255,255,255,0.6); text-decoration: none;
  letter-spacing: 0.01em; transition: color 0.2s ease; position: relative;
}
.nav-link::after {
  content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
  height: 1px; background: #3b82f6; transform: scaleX(0); transition: transform 0.25s ease;
}
.nav-link:hover { color: white; }
.nav-link:hover::after { transform: scaleX(1); }
.navbar-actions { justify-self: end; }
.login-btn {
  display: flex; align-items: center; gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white; border: none; padding: 0.55rem 1.25rem;
  border-radius: 8px; font-size: 0.875rem; font-weight: 600;
  cursor: pointer; transition: all 0.25s ease;
  box-shadow: 0 0 20px rgba(59,130,246,0.25);
}
.login-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(59,130,246,0.5); }

/* ════════════════════════════════
   HERO
════════════════════════════════ */
.hero-section {
  min-height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center;
  padding: 8rem 1.5rem 5rem;
  gap: 2.4rem;
  position: relative;
}

/* ── Ghost text behind headline ── */
.hero-bg-text {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 0.6rem;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.hero-bg-text span {
  font-size: clamp(3.5rem, 11vw, 8rem);
  font-weight: 900;
  letter-spacing: 0.2em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.038);
  white-space: nowrap;
  will-change: transform;
}
.hero-bg-text span:nth-child(1) { animation: driftRight 34s ease-in-out infinite; }
.hero-bg-text span:nth-child(2) { animation: driftLeft  30s ease-in-out infinite; animation-delay: -6s; }
.hero-bg-text span:nth-child(3) { animation: driftRight 38s ease-in-out infinite; animation-delay: -12s; }
.hero-bg-text span:nth-child(4) { animation: driftLeft  28s ease-in-out infinite; animation-delay: -18s; }
.hero-bg-text span:nth-child(5) { animation: driftRight 32s ease-in-out infinite; animation-delay: -4s; }
.hero-bg-text span:nth-child(6) { animation: driftLeft  36s ease-in-out infinite; animation-delay: -22s; }

@keyframes driftRight {
  0%   { transform: translateX(-6%); }
  50%  { transform: translateX(6%); }
  100% { transform: translateX(-6%); }
}
@keyframes driftLeft {
  0%   { transform: translateX(6%); }
  50%  { transform: translateX(-6%); }
  100% { transform: translateX(6%); }
}

/* Bring all real hero content above bg text */
.hero-badge, .hero-title, .hero-desc, .hero-ctas, .scroll-indicator {
  position: relative; z-index: 1;
}

/* Staggered entrance */
.hero-badge, .hero-title, .hero-desc, .hero-ctas, .scroll-indicator {
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.hero-badge.animate-in       { opacity: 1; transform: translateY(0); transition-delay: 0.10s; }
.hero-title.animate-in       { opacity: 1; transform: translateY(0); transition-delay: 0.22s; }
.hero-desc.animate-in        { opacity: 1; transform: translateY(0); transition-delay: 0.34s; }
.hero-ctas.animate-in        { opacity: 1; transform: translateY(0); transition-delay: 0.46s; }
.scroll-indicator.animate-in { opacity: 1; transform: translateY(0); transition-delay: 0.60s; }

.hero-badge {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3);
  color: #93c5fd; font-size: 0.8rem; font-weight: 500;
  padding: 0.4rem 1rem; border-radius: 100px; letter-spacing: 0.03em;
}
.badge-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #3b82f6; box-shadow: 0 0 8px #3b82f6;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 4px #3b82f6; }
  50%       { box-shadow: 0 0 14px #3b82f6, 0 0 24px rgba(59,130,246,0.4); }
}
.hero-title {
  font-size: clamp(2.6rem, 6vw, 4.8rem);
  font-weight: 800; letter-spacing: -0.04em; line-height: 1.05; color: white;
  text-shadow: 0 0 60px rgba(0,0,0,0.9);
}
.gradient-text {
  background: linear-gradient(135deg, #60a5fa, #a78bfa, #34d399);
  background-size: 200% 200%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: gradientShift 4s ease infinite;
}
@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.hero-desc {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.5);
  max-width: 400px;
  line-height: 1.7;
}
.hero-ctas {
  display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
}
.btn-primary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white; border: none; padding: 0.85rem 1.8rem;
  border-radius: 10px; font-size: 0.95rem; font-weight: 600;
  cursor: pointer; transition: all 0.25s ease;
  box-shadow: 0 0 30px rgba(59,130,246,0.3); text-decoration: none;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(59,130,246,0.55); }
.btn-large { padding: 1rem 2rem; font-size: 1rem; }
.btn-secondary {
  display: inline-flex; align-items: center;
  background: transparent; color: rgba(255,255,255,0.65);
  border: 1px solid rgba(255,255,255,0.15); padding: 0.85rem 1.8rem;
  border-radius: 10px; font-size: 0.95rem; font-weight: 500;
  cursor: pointer; transition: all 0.25s ease; text-decoration: none;
}
.btn-secondary:hover { color: white; background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.3); }

.scroll-indicator { margin-top: 0.25rem; }
.scroll-mouse {
  width: 24px; height: 38px;
  border: 2px solid rgba(255,255,255,0.18); border-radius: 12px;
  display: flex; align-items: flex-start; justify-content: center; padding-top: 6px;
}
.scroll-wheel {
  width: 3px; height: 8px;
  background: rgba(255,255,255,0.45); border-radius: 99px;
  animation: scrollWheel 1.8s ease-in-out infinite;
}
@keyframes scrollWheel {
  0%   { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(10px); opacity: 0; }
}

/* ════════════════════════════════
   STATS BAR
════════════════════════════════ */
.stats-bar {
  display: flex; align-items: center; justify-content: center;
  max-width: 700px; margin: 0 auto;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px; padding: 1.25rem 2rem; flex-wrap: wrap; gap: 1rem;
}
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; padding: 0 1.5rem; }
.stat-value {
  font-size: 1.4rem; font-weight: 800;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  font-family: 'JetBrains Mono', monospace;
}
.stat-label {
  font-size: 0.72rem; color: rgba(255,255,255,0.4);
  font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em;
}
.stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.1); }

/* ════════════════════════════════
   FEATURES SECTION
════════════════════════════════ */
.features-section {
  padding: 7rem 1.5rem; max-width: 1100px; margin: 0 auto; text-align: center;
}
.section-label {
  display: inline-block; font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase; color: #60a5fa; margin-bottom: 0.75rem;
}
.section-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800;
  letter-spacing: -0.03em; margin-bottom: 2.5rem; line-height: 1.15;
}
.features-grid {
  display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
.feature-card {
  position: relative; background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08); border-radius: 20px;
  padding: 2rem; text-align: left; overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease; cursor: default;
}
.feature-card:hover { transform: translateY(-6px); }
.feature-card--blue:hover  { border-color: rgba(59,130,246,0.4);  box-shadow: 0 20px 60px rgba(59,130,246,0.15);  }
.feature-card--green:hover { border-color: rgba(52,211,153,0.4);  box-shadow: 0 20px 60px rgba(52,211,153,0.15);  }
.feature-card--purple:hover{ border-color: rgba(139,92,246,0.4);  box-shadow: 0 20px 60px rgba(139,92,246,0.15);  }
.feature-glow {
  position: absolute; width: 200px; height: 200px; border-radius: 50%;
  filter: blur(60px); top: -80px; right: -60px;
  opacity: 0; transition: opacity 0.4s ease; pointer-events: none;
}
.feature-card:hover .feature-glow { opacity: 1; }
.glow-blue   { background: rgba(59,130,246,0.3); }
.glow-green  { background: rgba(52,211,153,0.3); }
.glow-purple { background: rgba(139,92,246,0.3); }
.feature-icon-wrap {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;
}
.icon-blue   { background: rgba(59,130,246,0.15); color: #60a5fa; }
.icon-green  { background: rgba(52,211,153,0.15); color: #34d399; }
.icon-purple { background: rgba(139,92,246,0.15); color: #a78bfa; }
.feature-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 0.6rem; letter-spacing: -0.01em; }
.feature-desc  { font-size: 0.875rem; color: rgba(255,255,255,0.5); line-height: 1.65; margin-bottom: 1.25rem; }
.feature-tag {
  display: inline-block; font-size: 0.7rem; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.06);
  padding: 0.25rem 0.6rem; border-radius: 6px; font-family: 'JetBrains Mono', monospace;
}

/* ════════════════════════════════
   WHY SECTION
════════════════════════════════ */
.why-section {
  padding: 6rem 1.5rem;
  background: rgba(255,255,255,0.025);
  border-top: 1px solid rgba(255,255,255,0.07);
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.why-inner {
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
}
@media (max-width: 768px) { .why-inner { grid-template-columns: 1fr; } .why-visual { display: none; } }
.why-desc { color: rgba(255,255,255,0.5); line-height: 1.7; margin-bottom: 2rem; font-size: 0.95rem; }
.comparison-list { display: flex; flex-direction: column; gap: 0.6rem; }
.comparison-row {
  display: grid; grid-template-columns: 1fr 20px 1fr; gap: 0.5rem;
  font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: rgba(255,255,255,0.3); margin-bottom: 0.25rem;
}
.comparison-item {
  display: grid; grid-template-columns: 1fr 20px 1fr; gap: 0.5rem;
  font-size: 0.875rem; color: rgba(255,255,255,0.5);
  padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.06); align-items: center;
}
.comparison-vs { color: rgba(255,255,255,0.2); text-align: center; }

.why-visual { display: flex; align-items: center; justify-content: center; }
.vault-graphic { position: relative; width: 260px; height: 260px; display: flex; align-items: center; justify-content: center; }
.vault-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(59,130,246,0.2); animation: ringPulse 4s ease-in-out infinite; }
.vault-ring--outer { width: 240px; height: 240px; animation-delay: 0s; }
.vault-ring--mid   { width: 175px; height: 175px; animation-delay: -1.3s; border-color: rgba(139,92,246,0.25); }
.vault-ring--inner { width: 110px; height: 110px; animation-delay: -2.6s; border-color: rgba(52,211,153,0.3); }
@keyframes ringPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.03); }
}
.vault-core {
  width: 64px; height: 64px; background: rgba(59,130,246,0.15);
  border: 1px solid rgba(59,130,246,0.3); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; z-index: 1;
  animation: coreGlow 3s ease-in-out infinite;
}
@keyframes coreGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.3); }
  50%       { box-shadow: 0 0 50px rgba(59,130,246,0.6), 0 0 80px rgba(59,130,246,0.2); }
}
.vault-orbit {
  position: absolute; width: 32px; height: 32px;
  background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem; animation: orbitSpin 12s linear infinite;
}
@keyframes orbitSpin { from { rotate: 0deg; } to { rotate: 360deg; } }

/* ════════════════════════════════
   CTA SECTION
════════════════════════════════ */
.cta-section { position: relative; padding: 7rem 1.5rem; text-align: center; overflow: hidden; }
.cta-bg-glow {
  position: absolute; width: 600px; height: 300px;
  background: radial-gradient(ellipse, rgba(59,130,246,0.15), transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
}
.cta-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 1rem; }
.cta-sub   { color: rgba(255,255,255,0.45); font-size: 0.95rem; margin-bottom: 2.5rem; }
.cta-actions { display: flex; justify-content: center; }

/* ════════════════════════════════
   FOOTER
════════════════════════════════ */
.footer {
  border-top: 1px solid rgba(255,255,255,0.07);
  padding: 2rem 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
}
.footer-brand { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: rgba(255,255,255,0.7); font-size: 0.9rem; }
.footer-copy  { font-size: 0.8rem; color: rgba(255,255,255,0.3); }
</style>
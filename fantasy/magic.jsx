/* ============================================================
   magic.jsx — FANTASY animation engine
   Vanilla canvas controllers (mounted by React) + React helpers.
   Exposes: window.MagicFX  and  window.CountUp / window.Sparkles
   Load with type="text/babel" AFTER React.
   ============================================================ */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setupCanvas(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var ctx = canvas.getContext('2d');
    function resize() {
      var r = canvas.getBoundingClientRect();
      var w = r.width || canvas.parentElement.clientWidth || window.innerWidth;
      var h = r.height || canvas.parentElement.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: w, h: h };
    }
    return { ctx: ctx, resize: resize, dpr: dpr };
  }

  /* -------------------- STARFIELD -------------------- */
  function mountStarfield(canvas, opts) {
    opts = opts || {};
    var s = setupCanvas(canvas), ctx = s.ctx, dim = s.resize();
    var stars = [], shooting = [], clouds = [], raf, t = 0;
    function makePuffs() {
      // a soft cumulus silhouette = a cluster of overlapping blobs
      var n = 4 + Math.floor(Math.random() * 3), puffs = [], spanX = 0;
      for (var i = 0; i < n; i++) {
        var r = 26 + Math.random() * 30;
        puffs.push({ dx: spanX, dy: (Math.random() - 0.5) * 16, r: r });
        spanX += r * (0.7 + Math.random() * 0.4);
      }
      // recentre so dx is around 0
      for (var j = 0; j < puffs.length; j++) puffs[j].dx -= spanX / 2;
      return puffs;
    }
    function seed() {
      var n = Math.round((dim.w * dim.h) / 5400);
      stars = [];
      // colorful star palette [fill r,g,b · glow hex]
      var pal = [
        [255, 255, 255, '#cfe0ff'],   // white
        [246, 207, 106, '#f6cf6a'],   // gold
        [127, 230, 255, '#7fe6ff'],   // cyan
        [255, 143, 200, '#ff8fc8'],   // rose
        [177, 139, 255, '#b18bff'],   // violet
        [154, 255, 208, '#9affd0'],   // mint
      ];
      for (var i = 0; i < n; i++) {
        // weight: ~50% white, rest spread across colors
        var col = Math.random() < 0.5 ? pal[0] : pal[1 + Math.floor(Math.random() * (pal.length - 1))];
        stars.push({
          x: Math.random() * dim.w, y: Math.random() * dim.h,
          r: Math.random() * 1.2 + 0.45, tw: Math.random() * Math.PI * 2,
          sp: Math.random() * 0.045 + 0.012, drift: Math.random() * 0.07 + 0.015,
          rise: Math.random() * 0.06 + 0.02, sway: Math.random() * Math.PI * 2,
          col: col, big: Math.random() < 0.16,
          dayCol: (function () {
            var r = Math.random();
            if (r < 0.45) return [255, 255, 255, 'rgba(255,255,255,0.9)']; // white
            if (r < 0.78) return [255, 233, 194, 'rgba(255,225,170,0.9)']; // soft champagne
            return [255, 208, 222, 'rgba(255,196,214,0.9)'];              // pale rose
          })(),
        });
      }
      // drifting daytime clouds (Daydream mode)
      clouds = [];
      var cn = Math.max(3, Math.round(dim.w / 360));
      for (var ci = 0; ci < cn; ci++) {
        clouds.push({
          x: Math.random() * dim.w,
          y: dim.h * (0.05 + Math.random() * 0.5),
          scale: 0.55 + Math.random() * 0.95,
          sp: 0.06 + Math.random() * 0.16,
          alpha: 0.5 + Math.random() * 0.35,
          puffs: makePuffs(),
        });
      }
    }
    seed();
    function frame() {
      t += 1;
      ctx.clearRect(0, 0, dim.w, dim.h);
      var mode = opts.getMode ? opts.getMode() : 'night';
      var dawn = mode === 'dawn';
      // ---- drifting clouds (Daydream only) ----
      if (dawn) {
        for (var ci = 0; ci < clouds.length; ci++) {
          var cl = clouds[ci];
          cl.x += cl.sp * cl.scale;
          var margin = 160 * cl.scale;
          if (cl.x - margin > dim.w) { cl.x = -margin; cl.y = dim.h * (0.05 + Math.random() * 0.5); }
          for (var pi = 0; pi < cl.puffs.length; pi++) {
            var pf = cl.puffs[pi];
            var px = cl.x + pf.dx * cl.scale, py = cl.y + pf.dy * cl.scale, pr = pf.r * cl.scale;
            var grd = ctx.createRadialGradient(px, py, 0, px, py, pr);
            grd.addColorStop(0, 'rgba(255,255,255,' + (cl.alpha * 0.9) + ')');
            grd.addColorStop(0.55, 'rgba(255,251,255,' + (cl.alpha * 0.4) + ')');
            grd.addColorStop(1, 'rgba(255,251,255,0)');
            ctx.fillStyle = grd;
            ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
      // ---- stars (night) / floating motes (daydream) ----
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        st.tw += st.sp;
        var a = (Math.sin(st.tw) * 0.5 + 0.5);
        if (dawn) {
          // gentle pixie-pollen: rise upward, sway, twinkle — spread across the whole sky
          st.y -= st.rise; st.sway += st.sp * 0.6;
          if (st.y < -2) { st.y = dim.h + 2; st.x = Math.random() * dim.w; }
          a = a * 0.6 + 0.4;
          // only soften at the very top/bottom edges so the field fills the screen
          var ey = st.y / dim.h;
          var efade = ey < 0.06 ? ey / 0.06 : ey > 0.96 ? (1 - ey) / 0.04 : 1;
          a *= Math.max(0, efade);
          var dx = Math.sin(st.sway) * 6;
          var c = st.dayCol;
          var mx = st.x + dx, mr = st.r * (st.big ? 1.9 : 1.45);
          // soft colored halo
          var hg = ctx.createRadialGradient(mx, st.y, 0, mx, st.y, mr * 3.2);
          hg.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a * 0.5) + ')');
          hg.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
          ctx.fillStyle = hg;
          ctx.beginPath(); ctx.arc(mx, st.y, mr * 3.2, 0, Math.PI * 2); ctx.fill();
          // colored body with bloom
          ctx.beginPath();
          ctx.arc(mx, st.y, mr, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
          ctx.shadowBlur = st.big ? 16 : 9; ctx.shadowColor = c[3];
          ctx.fill();
          // bright white core for sparkle
          ctx.beginPath();
          ctx.arc(mx, st.y, mr * 0.42, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,' + Math.min(1, a * 1.1) + ')';
          ctx.shadowBlur = 0;
          ctx.fill();
        } else {
          st.y += st.drift;
          if (st.y > dim.h + 2) { st.y = -2; st.x = Math.random() * dim.w; }
          a = a * 0.65 + 0.3;
          // vertical falloff — full at top, fading toward the bottom
          var vy = st.y / dim.h;
          var vfade = vy < 0.35 ? 1 : Math.max(0.06, 1 - (vy - 0.35) / 0.65 * 1.05);
          a *= vfade;
          var c2 = st.col;
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + c2[0] + ',' + c2[1] + ',' + c2[2] + ',' + a + ')';
          ctx.shadowBlur = st.big ? 8 : 3; ctx.shadowColor = c2[3];
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
      // shooting stars (night only) — prominent, occasionally doubled
      if (mode !== 'dawn' && shooting.length < 2 && Math.random() < 0.018) {
        shooting.push({ x: Math.random() * dim.w * 0.7, y: Math.random() * dim.h * 0.45, life: 0, len: 150 + Math.random() * 90, ang: Math.PI / 5 + (Math.random() - 0.5) * 0.5, sp: 12 + Math.random() * 6, max: 30 + Math.random() * 10, gold: Math.random() < 0.4 });
      }
      for (var si = shooting.length - 1; si >= 0; si--) {
        var sh = shooting[si];
        sh.life += 1;
        var sx = sh.x + Math.cos(sh.ang) * sh.life * sh.sp;
        var sy = sh.y + Math.sin(sh.ang) * sh.life * sh.sp;
        var tx = sx - Math.cos(sh.ang) * sh.len, ty = sy - Math.sin(sh.ang) * sh.len;
        var fade = sh.life < 6 ? sh.life / 6 : Math.max(0, 1 - (sh.life - 6) / (sh.max - 6));
        var head = sh.gold ? '255,234,168' : '255,255,255';
        var grd = ctx.createLinearGradient(sx, sy, tx, ty);
        grd.addColorStop(0, 'rgba(' + head + ',' + (0.95 * fade) + ')');
        grd.addColorStop(0.4, 'rgba(' + head + ',' + (0.35 * fade) + ')');
        grd.addColorStop(1, 'rgba(' + head + ',0)');
        ctx.strokeStyle = grd; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(tx, ty); ctx.stroke();
        // glowing head
        ctx.beginPath(); ctx.arc(sx, sy, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + head + ',' + fade + ')';
        ctx.shadowBlur = 14; ctx.shadowColor = sh.gold ? '#f6cf6a' : '#cfe0ff'; ctx.fill(); ctx.shadowBlur = 0;
        if (sh.life > sh.max) shooting.splice(si, 1);
      }
      raf = requestAnimationFrame(frame);
    }
    if (!reduce) frame(); else { ctx.clearRect(0, 0, dim.w, dim.h); }
    function onResize() { dim = s.resize(); seed(); if (reduce) ctx.clearRect(0, 0, dim.w, dim.h); }
    window.addEventListener('resize', onResize);
    return { destroy: function () { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); } };
  }

  /* -------------------- FIREWORKS -------------------- */
  function mountFireworks(canvas) {
    var s = setupCanvas(canvas), ctx = s.ctx, dim = s.resize();
    var parts = [], raf = null, running = false;
    var palette = ['#f6cf6a', '#7fe6ff', '#ff8fc8', '#b18bff', '#fbe6a8', '#9affd0'];
    function burst(x, y, opts) {
      opts = opts || {};
      if (reduce) return;
      x = x == null ? dim.w * (0.3 + Math.random() * 0.4) : x;
      y = y == null ? dim.h * (0.22 + Math.random() * 0.25) : y;
      var count = opts.count || 46;
      var col = opts.color || palette[Math.floor(Math.random() * palette.length)];
      for (var i = 0; i < count; i++) {
        var ang = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        var sp = (Math.random() * 3.4 + 1.6) * (opts.power || 1);
        parts.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 1, decay: Math.random() * 0.012 + 0.008, col: col, size: Math.random() * 2 + 1.4 });
      }
      if (!running) { running = true; loop(); }
    }
    function show(n) { // celebratory multi-burst
      n = n || 4;
      for (var i = 0; i < n; i++) (function (k) { setTimeout(function () { burst(null, null, {}); }, k * 280); })(i);
    }
    function loop() {
      ctx.clearRect(0, 0, dim.w, dim.h);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.vy += 0.035; p.vx *= 0.99; p.vy *= 0.99;
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.col; ctx.shadowBlur = 12; ctx.shadowColor = p.col; ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      if (parts.length) raf = requestAnimationFrame(loop);
      else { running = false; ctx.clearRect(0, 0, dim.w, dim.h); }
    }
    function onResize() { dim = s.resize(); }
    window.addEventListener('resize', onResize);
    return { burst: burst, show: show, destroy: function () { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); } };
  }

  /* -------------------- PIXIE DUST CURSOR -------------------- */
  function mountDust(canvas, opts) {
    opts = opts || {};
    var s = setupCanvas(canvas), ctx = s.ctx, dim = s.resize();
    var parts = [], raf, last = { x: 0, y: 0, t: 0 };
    function add(x, y, n) {
      for (var i = 0; i < n; i++) {
        parts.push({ x: x + (Math.random() - .5) * 8, y: y + (Math.random() - .5) * 8, vx: (Math.random() - .5) * .8, vy: (Math.random() - .5) * .8 - .3, life: 1, decay: Math.random() * .02 + .012, size: Math.random() * 2.4 + .8, gold: Math.random() < .7, tone: Math.random() });
      }
    }
    function onMove(e) {
      if (opts.getEnabled && !opts.getEnabled()) return;
      var x = e.clientX, y = e.clientY;
      var dx = x - last.x, dy = y - last.y;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d > 4) { add(x, y, Math.min(4, Math.round(d / 6))); last.x = x; last.y = y; }
    }
    function frame() {
      ctx.clearRect(0, 0, dim.w, dim.h);
      var dawn = (opts.getMode ? opts.getMode() : 'night') === 'dawn';
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy; p.vy += .012; p.life -= p.decay;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        var col;
        if (dawn) {
          // daytime: white / champagne / pale rose to match the motes
          col = p.tone < 0.5 ? '#ffffff' : p.tone < 0.8 ? '#ffe6b4' : '#ffcede';
        } else {
          col = p.gold ? '#f6cf6a' : '#7fe6ff';
        }
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.shadowBlur = dawn ? 6 : 8; ctx.shadowColor = col; ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      raf = requestAnimationFrame(frame);
    }
    function onResize() { dim = s.resize(); }
    if (!reduce) { window.addEventListener('pointermove', onMove); frame(); }
    window.addEventListener('resize', onResize);
    return { destroy: function () { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', onResize); } };
  }

  /* -------------------- HERO PARALLAX CASTLE SCENE -------------------- */
  function mountHero(canvas, opts) {
    opts = opts || {};
    var s = setupCanvas(canvas), ctx = s.ctx, dim = s.resize();
    var raf, t = 0, mx = 0.5, my = 0.5, fw = [], nextFw = 60;
    var hstars = [];
    function seed() { hstars = []; var n = Math.round(dim.w / 6); for (var i = 0; i < n; i++) hstars.push({ x: Math.random() * dim.w, y: Math.random() * dim.h * 0.7, r: Math.random() * 1.3 + .3, tw: Math.random() * 6.28, sp: Math.random() * .05 + .01 }); }
    seed();
    function castle(cx, base, scale, col) {
      ctx.fillStyle = col;
      function tower(x, w, h, roofH) {
        ctx.fillRect(x, base - h, w, h);
        ctx.beginPath(); ctx.moveTo(x - 3, base - h); ctx.lineTo(x + w / 2, base - h - roofH); ctx.lineTo(x + w + 3, base - h); ctx.closePath(); ctx.fill();
      }
      // central keep + side towers (stylized fairytale silhouette)
      tower(cx - 14 * scale, 28 * scale, 120 * scale, 46 * scale);
      tower(cx - 52 * scale, 22 * scale, 92 * scale, 36 * scale);
      tower(cx + 30 * scale, 22 * scale, 92 * scale, 36 * scale);
      tower(cx - 86 * scale, 17 * scale, 66 * scale, 28 * scale);
      tower(cx + 69 * scale, 17 * scale, 66 * scale, 28 * scale);
      ctx.fillRect(cx - 90 * scale, base - 50 * scale, 196 * scale, 50 * scale);
      // little flags
      ctx.strokeStyle = col; ctx.lineWidth = 1.5 * scale;
      [[cx, 120], [cx - 41, 92], [cx + 41, 92]].forEach(function (f) {
        var fx = f[0] * 1, fy = base - f[1] * scale - 46 * scale * (f[1] === 120 ? 1 : 0.78);
      });
    }
    function frame() {
      t += 1;
      var mode = opts.getMode ? opts.getMode() : 'night';
      var night = mode !== 'dawn';
      var px = (mx - 0.5), py = (my - 0.5);
      // sky
      var g = ctx.createLinearGradient(0, 0, 0, dim.h);
      if (night) { g.addColorStop(0, '#070a22'); g.addColorStop(.5, '#1b1452'); g.addColorStop(1, '#46236f'); }
      else { g.addColorStop(0, '#bcd4ff'); g.addColorStop(.5, '#e6d4ff'); g.addColorStop(1, '#ffd6ea'); }
      ctx.fillStyle = g; ctx.fillRect(0, 0, dim.w, dim.h);
      // moon / sun
      var moonX = dim.w * 0.78 + px * 26, moonY = dim.h * 0.26 + py * 18;
      ctx.beginPath(); ctx.arc(moonX, moonY, 42, 0, Math.PI * 2);
      ctx.fillStyle = night ? 'rgba(246,240,210,0.95)' : 'rgba(255,247,210,0.95)';
      ctx.shadowBlur = 60; ctx.shadowColor = night ? 'rgba(246,230,168,.6)' : 'rgba(255,220,150,.7)'; ctx.fill(); ctx.shadowBlur = 0;
      // hero stars
      if (night) for (var i = 0; i < hstars.length; i++) { var st = hstars[i]; st.tw += st.sp; var a = Math.sin(st.tw) * .5 + .5; ctx.globalAlpha = a * .9; ctx.beginPath(); ctx.arc(st.x + px * 10, st.y + py * 6, st.r, 0, 6.28); ctx.fillStyle = '#fff'; ctx.fill(); } ctx.globalAlpha = 1;
      // fireworks over castle (night)
      if (night) {
        nextFw -= 1;
        if (nextFw <= 0) { spawnHeroFw(); nextFw = 70 + Math.random() * 60; }
        for (var f = fw.length - 1; f >= 0; f--) { var pt = fw[f]; pt.vy += .03; pt.x += pt.vx; pt.y += pt.vy; pt.life -= pt.decay; if (pt.life <= 0) { fw.splice(f, 1); continue; } ctx.globalAlpha = Math.max(0, pt.life); ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, 6.28); ctx.fillStyle = pt.col; ctx.shadowBlur = 10; ctx.shadowColor = pt.col; ctx.fill(); }
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      }
      // hills (parallax)
      var base = dim.h * 0.92 + py * 8;
      ctx.fillStyle = night ? '#0a0820' : '#b9a7e8';
      // castle silhouette centered, gentle parallax
      castle(dim.w * 0.5 + px * -14, base, dim.w < 600 ? 0.95 : 1.4, night ? '#0a0820' : '#9a86d8');
      // foreground hill
      ctx.beginPath(); ctx.moveTo(0, dim.h); ctx.lineTo(0, base - 8); ctx.quadraticCurveTo(dim.w * 0.5, base + 26, dim.w, base - 8); ctx.lineTo(dim.w, dim.h); ctx.closePath();
      ctx.fillStyle = night ? '#080617' : '#8f7ccf'; ctx.fill();
      raf = requestAnimationFrame(frame);
    }
    function spawnHeroFw() {
      var cx = dim.w * (0.3 + Math.random() * 0.45), cy = dim.h * (0.18 + Math.random() * 0.2);
      var cols = ['#f6cf6a', '#7fe6ff', '#ff8fc8', '#b18bff'], col = cols[Math.floor(Math.random() * cols.length)];
      for (var i = 0; i < 34; i++) { var a = (6.28 * i) / 34; var sp = Math.random() * 2.2 + 1; fw.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: Math.random() * .012 + .008, col: col, size: Math.random() * 1.8 + 1 }); }
    }
    function onMove(e) { var r = canvas.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; }
    function onResize() { dim = s.resize(); seed(); }
    if (!reduce) { frame(); canvas.parentElement.addEventListener('pointermove', onMove); }
    else { // static draw
      frame.__once = true; var m = opts.getMode ? opts.getMode() : 'night'; frame();
      cancelAnimationFrame(raf);
    }
    window.addEventListener('resize', onResize);
    return { destroy: function () { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); if (canvas.parentElement) canvas.parentElement.removeEventListener('pointermove', onMove); } };
  }

  window.MagicFX = { mountStarfield: mountStarfield, mountFireworks: mountFireworks, mountDust: mountDust, mountHero: mountHero, reduce: reduce };
})();

/* -------------------- REACT HELPERS -------------------- */
(function () {
  var React = window.React;

  // animated number count-up
  function CountUp(props) {
    var format = props.format || function (n) { return Math.round(n).toLocaleString(); };
    var ref = React.useRef(null);
    var prev = React.useRef(props.value || 0);
    React.useEffect(function () {
      var from = prev.current, to = props.value, start = null, dur = props.duration || 650;
      if (window.MagicFX && window.MagicFX.reduce) { if (ref.current) ref.current.textContent = format(to); prev.current = to; return; }
      var raf;
      function step(ts) {
        if (start == null) start = ts;
        var t = Math.min(1, (ts - start) / dur);
        var e = 1 - Math.pow(1 - t, 3);
        var val = from + (to - from) * e;
        if (ref.current) ref.current.textContent = format(val);
        if (t < 1) raf = requestAnimationFrame(step); else prev.current = to;
      }
      raf = requestAnimationFrame(step);
      return function () { cancelAnimationFrame(raf); prev.current = to; };
    }, [props.value]);
    return React.createElement(props.tag || 'span', { ref: ref, className: props.className, style: props.style }, format(prev.current));
  }

  window.CountUp = CountUp;
})();

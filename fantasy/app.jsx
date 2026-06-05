/* ============================================================
   fantasy/app.jsx — Starlight planner root
   ============================================================ */
(function () {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;

  function App() {
    var pl = window.usePlanner({ storeKey: 'fy-planner-v2' });
    var _mode = useState(function () { try { return localStorage.getItem('fy-mode') || 'night'; } catch (e) { return 'night'; } });
    var mode = _mode[0], setMode = _mode[1];
    var modeRef = useRef(mode); modeRef.current = mode;
    var _hs = useState(function () { try { return localStorage.getItem('fy-hotelstyle') || 'photo'; } catch (e) { return 'photo'; } });
    var hotelStyle = _hs[0], setHotelStyle = _hs[1];
    useEffect(function () { try { localStorage.setItem('fy-hotelstyle', hotelStyle); } catch (e) {} }, [hotelStyle]);

    var _bt = useState(function () { try { return localStorage.getItem('fy-bigtext') === 'on'; } catch (e) { return false; } });
    var bigText = _bt[0], setBigText = _bt[1];
    useEffect(function () {
      document.documentElement.setAttribute('data-bigtext', bigText ? 'on' : 'off');
      try { localStorage.setItem('fy-bigtext', bigText ? 'on' : 'off'); } catch (e) {}
    }, [bigText]);

    var starRef = useRef(null), dustRef = useRef(null), fwRef = useRef(null);
    var fx = useRef({});

    // apply mode to <html>
    useEffect(function () { document.documentElement.setAttribute('data-mode', mode); try { localStorage.setItem('fy-mode', mode); } catch (e) {} }, [mode]);

    // mount persistent FX once
    useEffect(function () {
      var star = window.MagicFX.mountStarfield(starRef.current, { getMode: function () { return modeRef.current; } });
      var dust = window.MagicFX.mountDust(dustRef.current, { getEnabled: function () { return true; }, getMode: function () { return modeRef.current; } });
      var fw = window.MagicFX.mountFireworks(fwRef.current);
      fx.current.fw = fw;
      return function () { star.destroy(); dust.destroy(); fw.destroy(); };
    }, []);

    // milestone fireworks when total changes (throttled)
    var _sc = useState(false); var scrolled = _sc[0], setScrolled = _sc[1];
    useEffect(function () {
      function onScroll() { setScrolled(window.scrollY > 360); }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return function () { window.removeEventListener('scroll', onScroll); };
    }, []);

    var prevTotal = useRef(pl.d.totals.total), lastBurst = useRef(0), firstRun = useRef(true);
    useEffect(function () {
      var total = pl.d.totals.total;
      if (firstRun.current) { firstRun.current = false; prevTotal.current = total; return; }
      if (total !== prevTotal.current) {
        var now = Date.now();
        if (fx.current.fw && now - lastBurst.current > 550) { fx.current.fw.burst(); lastBurst.current = now; }
        prevTotal.current = total;
      }
    }, [pl.d.totals.total]);

    return h(React.Fragment, null,
      h('div', { className: 'fy-backdrop' }),
      h('canvas', { ref: starRef, className: 'fy-starfield' }),
      h('canvas', { ref: fwRef, className: 'fy-fireworks' }),
      h('canvas', { ref: dustRef, className: 'fy-dust' }),
      h('header', { className: 'fy-header' },
        h(TopBar, { mode: mode, setMode: setMode, bigText: bigText, setBigText: setBigText, onHome: function () { pl.navTo.main(); } }),
        pl.nav.view === 'main' ? h(SummaryStrip, { planner: pl, on: scrolled }) : null
      ),
      pl.nav.view === 'main'
        ? h(MainPage, { planner: pl, mode: mode, hotelStyle: hotelStyle, setHotelStyle: setHotelStyle })
        : pl.nav.view === 'park'
          ? h(window.FY_ParkPage, { id: pl.nav.id, onBack: pl.navTo.main })
          : h(window.FY_HotelPage, { id: pl.nav.id, onBack: pl.navTo.main }),
      h(Footer)
    );
  }

  function TopBar(props) {
    return h('div', { className: 'fy-topbar' },
      h('div', { className: 'fy-brand', style: { cursor: 'pointer' }, onClick: props.onHome },
        h('div', { className: 'fy-brand-mark' }, '✦'),
        h('div', null, h('div', { className: 'fy-brand-name' }, 'Wishful'), h('div', { className: 'fy-brand-sub' }, 'Disney World 2027 · Trip Planner'))
      ),
      h('div', { className: 'fy-topnav' },
h('button', {
          className: 'fy-mode' + (props.bigText ? ' on' : ''),
          onClick: function () { props.setBigText(!props.bigText); },
          'aria-pressed': props.bigText ? 'true' : 'false',
          title: props.bigText ? 'Switch to standard text size' : 'Switch to larger text for easier reading'
        }, h('span', { className: 'fy-mode-aa' }, 'A', h('b', null, 'A')), 'Larger text'),
        h('button', { className: 'fy-mode', onClick: function () { props.setMode(props.mode === 'night' ? 'dawn' : 'night'); } },
          props.mode === 'night' ? '☾ Starlight' : '☀ Daydream')
      )
    );
  }

  function SummaryStrip(props) {
    var pl = props.planner, t = pl.d.totals, st = pl.state;
    var items = [
      { l: 'Estimated total', v: t.total, hero: true },
      { l: 'Per person', v: t.perPerson },
      { l: 'Hotel · ' + st.nights + ' nt', v: t.hotel },
      { l: 'Special', v: t.special },
    ];
    return h('div', { className: 'fy-summary' + (props.on ? ' on' : '') },
      h('div', { className: 'fy-summary-inner' },
        items.map(function (it, i) {
          return h('div', { key: i, className: 'fy-summary-item' + (it.hero ? ' hero' : '') },
            h('span', { className: 'fy-summary-l' }, it.l),
            h(window.CountUp, { tag: 'span', className: 'fy-summary-v', value: it.v, format: function (n) { return '$' + Math.round(n).toLocaleString(); } })
          );
        })
      )
    );
  }

  function HeroScene(props) {
    var canRef = useRef(null);
    useEffect(function () {
      var ctrl = window.MagicFX.mountHero(canRef.current, { getMode: function () { return props.mode; } });
      return function () { ctrl.destroy(); };
    }, [props.mode]);
    return h('div', { className: 'fy-hero' },
      h('canvas', { ref: canRef, style: { width: '100%', height: '100%' } }),
      h('div', { className: 'fy-hero-content' },
        h('div', { className: 'fy-hero-kicker' }, 'Once upon a 2027'),
        h('h1', null, 'Disney World', h('br'), 'Trip Planner'),
        h('div', { className: 'fy-hero-sub' }, '2 adults · 1 child (almost 4) · 1 grandparent · 4 park days · flying ATL→MCO. Every wish, every dollar, mapped to the night.'),
        h('div', { className: 'fy-hero-meta' }, props.note)
      )
    );
  }

  function MainPage(props) {
    var pl = props.planner;
    return h('div', null,
      h('div', { className: 'fy-wrap', style: { paddingTop: 4 } },
        h(HeroScene, { mode: props.mode, note: pl.d.inflationNote }),
        h('div', { className: 'fy-rise' },
          h(window.FY_Metrics, { planner: pl }),
          h('div', { style: { height: 14 } }),
          h(window.FY_ControlBar, { planner: pl }),
          h(window.FY_Reservations, { planner: pl }),
          h(window.FY_SL, null, 'Booking timeline'),
          h('div', { className: 'fy-hint', style: { marginBottom: 8 } }, 'Enter your check-in date for booking deadlines calculated automatically.'),
          h(window.FY_BookingTimeline, { planner: pl }),
          h(window.FY_HotelGrid, { planner: pl, cardStyle: props.hotelStyle, setCardStyle: props.setHotelStyle }),
          h(window.FY_SL, null, 'Cost breakdown'),
          h(window.FY_BudgetBreakdown, { planner: pl }),
          h(window.FY_SL, null, 'Park day & night plans'),
          h('div', { className: 'fy-hint', style: { marginBottom: 10 } }, 'Your little one will be almost 4 (~36–38" tall). Tap a park for its full plan.'),
          h(window.FY_ParkNav, { planner: pl }),
          h(window.FY_SL, null, 'Resort restaurants'),
          h(window.FY_ResortRests, { planner: pl })
        )
      )
    );
  }

  function Footer() {
    return h('div', { className: 'fy-footer' }, h('span', { className: 'fy-script' }, '✦ WISHFUL ✦'), h('div', { style: { marginTop: 6 } }, 'Prices projected to 2027 · estimates only · the magic is real'));
  }

  var root = ReactDOM.createRoot(document.getElementById('fy-root'));
  root.render(h(App));
})();

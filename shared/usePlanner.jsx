/* ============================================================
   usePlanner — shared React state hook for all three redesigns.
   Wraps PlannerEngine. Exposes state, setters (mirroring the
   original app.js actions), derived values, and navigation.
   Load AFTER React + engine.js, with type="text/babel".
   ============================================================ */
(function () {
  var E = window.PlannerEngine;

  function usePlanner(opts) {
    opts = opts || {};
    var storeKey = opts.storeKey || 'planner-state';
    var React = window.React;

    var initial = React.useMemo(function () {
      var base = E.defaultState();
      try {
        var saved = JSON.parse(localStorage.getItem(storeKey) || 'null');
        if (saved) {
          Object.assign(base, saved);
          base.nights = Math.min(7, Math.max(1, parseInt(base.nights, 10) || 5));
          var td = saved.tripDate ? new Date(saved.tripDate) : null;
          base.tripDate = (td && !isNaN(td.getTime()) && td.getFullYear() >= 2025) ? td : null;
          if (!base.tripDate) { base.inflYears = E.defaultState().inflYears; }
          base.tripMult = E.computeTripMult(base.inflRate, base.inflYears);
        }
      } catch (e) {}
      return base;
    }, []);

    var _s = React.useState(initial);
    var state = _s[0], setState = _s[1];

    var _nav = React.useState({ view: 'main', id: null }); // main | park | hotel
    var nav = _nav[0], setNav = _nav[1];

    // persist
    React.useEffect(function () {
      try {
        var copy = Object.assign({}, state, { tripDate: state.tripDate ? state.tripDate.toISOString() : null });
        localStorage.setItem(storeKey, JSON.stringify(copy));
      } catch (e) {}
    }, [state]);

    function patch(p) { setState(function (s) { return Object.assign({}, s, p); }); }

    var actions = {
      selH: function (k) { patch({ sel: k, clubLevel: false }); },
      setSeason: function (s) { patch({ season: s }); },
      changeNights: function (d) { setState(function (s) { return Object.assign({}, s, { nights: Math.min(7, Math.max(1, s.nights + d)) }); }); },
      setNights: function (n) { patch({ nights: Math.min(7, Math.max(1, n)) }); },
      selFW: function (k) {
        setState(function (s) {
          var arr = s.activeFireworks.slice();
          var i = arr.indexOf(k);
          if (i !== -1) arr.splice(i, 1);
          else { if (arr.length >= 2) arr.shift(); arr.push(k); }
          return Object.assign({}, s, { activeFireworks: arr });
        });
      },
      clearFW: function () { patch({ activeFireworks: [] }); },
      selDT: function (k) {
        setState(function (s) {
          var arr = (s.activeDaytime || []).slice();
          var i = arr.indexOf(k);
          if (i !== -1) arr.splice(i, 1);
          else { if (arr.length >= 3) arr.shift(); arr.push(k); }
          return Object.assign({}, s, { activeDaytime: arr });
        });
      },
      clearDT: function () { patch({ activeDaytime: [] }); },
      selEV: function (k) { patch({ activeEvening: k }); },
      setClub: function (v) { patch({ clubLevel: v }); },
      toggleMemMaker: function () { setState(function (s) { return Object.assign({}, s, { wantMemMaker: !s.wantMemMaker }); }); },
      toggleStroller: function () { setState(function (s) { return Object.assign({}, s, { wantStroller: !s.wantStroller }); }); },
      toggleBands: function () { setState(function (s) { return Object.assign({}, s, { wantBands: !s.wantBands }); }); },
      setTravel: function (m) { patch({ travelMode: m }); },
      setDeal: function (d) { patch({ activeDeal: d }); },
      toggleKEF: function () { setState(function (s) { if (s.activeDeal === 'dining') return s; return Object.assign({}, s, { kidsEatFree: !s.kidsEatFree }); }); },
      setInflRate: function (v) {
        setState(function (s) {
          var rate = parseFloat(v) / 100;
          var tm = E.computeTripMult(rate, s.inflYears);
          return Object.assign({}, s, { inflRate: rate, tripMult: tm });
        });
      },
      setTripDate: function (v) {
        setState(function (s) {
          var d = v ? new Date(v + 'T12:00:00') : null;
          if (d && (isNaN(d.getTime()) || d.getFullYear() < 2025 || d.getFullYear() > 2040)) d = null;
          if (d) {
            var inflYears = Math.max(0, d.getFullYear() - 2026);
            return Object.assign({}, s, {
              tripDate: d, inflYears: inflYears,
              tripMult: E.computeTripMult(s.inflRate, inflYears),
              season: E.isPeakDate(d) ? 'peak' : 'off',
            });
          }
          var defYears = E.defaultState().inflYears;
          return Object.assign({}, s, { tripDate: null, inflYears: defYears, tripMult: E.computeTripMult(s.inflRate, defYears) });
        });
      },
    };

    // navigation
    var navTo = {
      main: function () { setNav({ view: 'main', id: null }); window.scrollTo(0, 0); },
      park: function (id) { setNav({ view: 'park', id: id }); window.scrollTo(0, 0); },
      hotel: function (key) { setNav({ view: 'hotel', id: key }); window.scrollTo(0, 0); },
    };

    // derived
    var derived = React.useMemo(function () {
      return {
        items: E.buildItems(state),
        sections: E.sections(state),
        totals: E.totals(state),
        dealSavings: E.dealSavings(state),
        timeline: E.timeline(state),
        inflationNote: E.inflationNote(state),
        hotel: E.getH(state.sel),
      };
    }, [state]);

    return { state: state, actions: actions, nav: nav, navTo: navTo, d: derived, E: E };
  }

  window.usePlanner = usePlanner;
})();

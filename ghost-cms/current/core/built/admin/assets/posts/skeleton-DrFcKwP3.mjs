import { am as W, a1 as oe, Q as f, a7 as wo, k as vo, x as C, a9 as re, ak as N, a6 as K, p as yo, af as Ce, ad as bo, F as Mo, i as q, S as kt } from "./index-BuIZkUhD.mjs";
import { x as nt, l as Pe, s as te, n as ot, w as rt, c as Z, i as E, t as $t, u as We, b as ze, P as Co, r as Ao, q as So, v as Ro, R as _o, F as Po, D as Eo, j as Gt, m as Bt, C as Do } from "./button-CQCNdxY6.mjs";
function Oo(e) {
  const [t, n] = W(void 0);
  return nt(() => {
    if (e) {
      n({ width: e.offsetWidth, height: e.offsetHeight });
      const o = new ResizeObserver((r) => {
        if (!Array.isArray(r) || !r.length)
          return;
        const s = r[0];
        let i, c;
        if ("borderBoxSize" in s) {
          const u = s.borderBoxSize, d = Array.isArray(u) ? u[0] : u;
          i = d.inlineSize, c = d.blockSize;
        } else
          i = e.offsetWidth, c = e.offsetHeight;
        n({ width: i, height: c });
      });
      return o.observe(e, { box: "border-box" }), () => o.unobserve(e);
    } else
      n(void 0);
  }, [e]), t;
}
const Io = ["top", "right", "bottom", "left"], ae = Math.min, H = Math.max, Le = Math.round, je = Math.floor, ee = (e) => ({
  x: e,
  y: e
}), No = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function st(e, t, n) {
  return H(e, ae(t, n));
}
function se(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function ie(e) {
  return e.split("-")[0];
}
function we(e) {
  return e.split("-")[1];
}
function ut(e) {
  return e === "x" ? "y" : "x";
}
function dt(e) {
  return e === "y" ? "height" : "width";
}
function J(e) {
  const t = e[0];
  return t === "t" || t === "b" ? "y" : "x";
}
function ft(e) {
  return ut(J(e));
}
function To(e, t, n) {
  n === void 0 && (n = !1);
  const o = we(e), r = ft(e), s = dt(r);
  let i = r === "x" ? o === (n ? "end" : "start") ? "right" : "left" : o === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (i = ke(i)), [i, ke(i)];
}
function jo(e) {
  const t = ke(e);
  return [it(e), t, it(t)];
}
function it(e) {
  return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
const St = ["left", "right"], Rt = ["right", "left"], Fo = ["top", "bottom"], Lo = ["bottom", "top"];
function ko(e, t, n) {
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? Rt : St : t ? St : Rt;
    case "left":
    case "right":
      return t ? Fo : Lo;
    default:
      return [];
  }
}
function $o(e, t, n, o) {
  const r = we(e);
  let s = ko(ie(e), n === "start", o);
  return r && (s = s.map((i) => i + "-" + r), t && (s = s.concat(s.map(it)))), s;
}
function ke(e) {
  const t = ie(e);
  return No[t] + e.slice(t.length);
}
function Go(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function Kt(e) {
  return typeof e != "number" ? Go(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function $e(e) {
  const {
    x: t,
    y: n,
    width: o,
    height: r
  } = e;
  return {
    width: o,
    height: r,
    top: n,
    left: t,
    right: t + o,
    bottom: n + r,
    x: t,
    y: n
  };
}
function _t(e, t, n) {
  let {
    reference: o,
    floating: r
  } = e;
  const s = J(t), i = ft(t), c = dt(i), u = ie(t), d = s === "y", a = o.x + o.width / 2 - r.width / 2, l = o.y + o.height / 2 - r.height / 2, p = o[c] / 2 - r[c] / 2;
  let m;
  switch (u) {
    case "top":
      m = {
        x: a,
        y: o.y - r.height
      };
      break;
    case "bottom":
      m = {
        x: a,
        y: o.y + o.height
      };
      break;
    case "right":
      m = {
        x: o.x + o.width,
        y: l
      };
      break;
    case "left":
      m = {
        x: o.x - r.width,
        y: l
      };
      break;
    default:
      m = {
        x: o.x,
        y: o.y
      };
  }
  switch (we(t)) {
    case "start":
      m[i] -= p * (n && d ? -1 : 1);
      break;
    case "end":
      m[i] += p * (n && d ? -1 : 1);
      break;
  }
  return m;
}
async function Bo(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: o,
    y: r,
    platform: s,
    rects: i,
    elements: c,
    strategy: u
  } = e, {
    boundary: d = "clippingAncestors",
    rootBoundary: a = "viewport",
    elementContext: l = "floating",
    altBoundary: p = !1,
    padding: m = 0
  } = se(t, e), h = Kt(m), g = c[p ? l === "floating" ? "reference" : "floating" : l], w = $e(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(g))) == null || n ? g : g.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(c.floating)),
    boundary: d,
    rootBoundary: a,
    strategy: u
  })), M = l === "floating" ? {
    x: o,
    y: r,
    width: i.floating.width,
    height: i.floating.height
  } : i.reference, y = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(c.floating)), v = await (s.isElement == null ? void 0 : s.isElement(y)) ? await (s.getScale == null ? void 0 : s.getScale(y)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, S = $e(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: c,
    rect: M,
    offsetParent: y,
    strategy: u
  }) : M);
  return {
    top: (w.top - S.top + h.top) / v.y,
    bottom: (S.bottom - w.bottom + h.bottom) / v.y,
    left: (w.left - S.left + h.left) / v.x,
    right: (S.right - w.right + h.right) / v.x
  };
}
const Ko = 50, Wo = async (e, t, n) => {
  const {
    placement: o = "bottom",
    strategy: r = "absolute",
    middleware: s = [],
    platform: i
  } = n, c = i.detectOverflow ? i : {
    ...i,
    detectOverflow: Bo
  }, u = await (i.isRTL == null ? void 0 : i.isRTL(t));
  let d = await i.getElementRects({
    reference: e,
    floating: t,
    strategy: r
  }), {
    x: a,
    y: l
  } = _t(d, o, u), p = o, m = 0;
  const h = {};
  for (let x = 0; x < s.length; x++) {
    const g = s[x];
    if (!g)
      continue;
    const {
      name: w,
      fn: M
    } = g, {
      x: y,
      y: v,
      data: S,
      reset: A
    } = await M({
      x: a,
      y: l,
      initialPlacement: o,
      placement: p,
      strategy: r,
      middlewareData: h,
      rects: d,
      platform: c,
      elements: {
        reference: e,
        floating: t
      }
    });
    a = y ?? a, l = v ?? l, h[w] = {
      ...h[w],
      ...S
    }, A && m < Ko && (m++, typeof A == "object" && (A.placement && (p = A.placement), A.rects && (d = A.rects === !0 ? await i.getElementRects({
      reference: e,
      floating: t,
      strategy: r
    }) : A.rects), {
      x: a,
      y: l
    } = _t(d, p, u)), x = -1);
  }
  return {
    x: a,
    y: l,
    placement: p,
    strategy: r,
    middlewareData: h
  };
}, zo = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: n,
      y: o,
      placement: r,
      rects: s,
      platform: i,
      elements: c,
      middlewareData: u
    } = t, {
      element: d,
      padding: a = 0
    } = se(e, t) || {};
    if (d == null)
      return {};
    const l = Kt(a), p = {
      x: n,
      y: o
    }, m = ft(r), h = dt(m), x = await i.getDimensions(d), g = m === "y", w = g ? "top" : "left", M = g ? "bottom" : "right", y = g ? "clientHeight" : "clientWidth", v = s.reference[h] + s.reference[m] - p[m] - s.floating[h], S = p[m] - s.reference[m], A = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(d));
    let _ = A ? A[y] : 0;
    (!_ || !await (i.isElement == null ? void 0 : i.isElement(A))) && (_ = c.floating[y] || s.floating[h]);
    const P = v / 2 - S / 2, j = _ / 2 - x[h] / 2 - 1, O = ae(l[w], j), F = ae(l[M], j), L = O, T = _ - x[h] - F, I = _ / 2 - x[h] / 2 + P, G = st(L, I, T), D = !u.arrow && we(r) != null && I !== G && s.reference[h] / 2 - (I < L ? O : F) - x[h] / 2 < 0, k = D ? I < L ? I - L : I - T : 0;
    return {
      [m]: p[m] + k,
      data: {
        [m]: G,
        centerOffset: I - G - k,
        ...D && {
          alignmentOffset: k
        }
      },
      reset: D
    };
  }
}), Ho = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var n, o;
      const {
        placement: r,
        middlewareData: s,
        rects: i,
        initialPlacement: c,
        platform: u,
        elements: d
      } = t, {
        mainAxis: a = !0,
        crossAxis: l = !0,
        fallbackPlacements: p,
        fallbackStrategy: m = "bestFit",
        fallbackAxisSideDirection: h = "none",
        flipAlignment: x = !0,
        ...g
      } = se(e, t);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const w = ie(r), M = J(c), y = ie(c) === c, v = await (u.isRTL == null ? void 0 : u.isRTL(d.floating)), S = p || (y || !x ? [ke(c)] : jo(c)), A = h !== "none";
      !p && A && S.push(...$o(c, x, h, v));
      const _ = [c, ...S], P = await u.detectOverflow(t, g), j = [];
      let O = ((o = s.flip) == null ? void 0 : o.overflows) || [];
      if (a && j.push(P[w]), l) {
        const I = To(r, i, v);
        j.push(P[I[0]], P[I[1]]);
      }
      if (O = [...O, {
        placement: r,
        overflows: j
      }], !j.every((I) => I <= 0)) {
        var F, L;
        const I = (((F = s.flip) == null ? void 0 : F.index) || 0) + 1, G = _[I];
        if (G && (!(l === "alignment" ? M !== J(G) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        O.every((R) => J(R.placement) === M ? R.overflows[0] > 0 : !0)))
          return {
            data: {
              index: I,
              overflows: O
            },
            reset: {
              placement: G
            }
          };
        let D = (L = O.filter((k) => k.overflows[0] <= 0).sort((k, R) => k.overflows[1] - R.overflows[1])[0]) == null ? void 0 : L.placement;
        if (!D)
          switch (m) {
            case "bestFit": {
              var T;
              const k = (T = O.filter((R) => {
                if (A) {
                  const b = J(R.placement);
                  return b === M || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  b === "y";
                }
                return !0;
              }).map((R) => [R.placement, R.overflows.filter((b) => b > 0).reduce((b, B) => b + B, 0)]).sort((R, b) => R[1] - b[1])[0]) == null ? void 0 : T[0];
              k && (D = k);
              break;
            }
            case "initialPlacement":
              D = c;
              break;
          }
        if (r !== D)
          return {
            reset: {
              placement: D
            }
          };
      }
      return {};
    }
  };
};
function Pt(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function Et(e) {
  return Io.some((t) => e[t] >= 0);
}
const Vo = function(e) {
  return e === void 0 && (e = {}), {
    name: "hide",
    options: e,
    async fn(t) {
      const {
        rects: n,
        platform: o
      } = t, {
        strategy: r = "referenceHidden",
        ...s
      } = se(e, t);
      switch (r) {
        case "referenceHidden": {
          const i = await o.detectOverflow(t, {
            ...s,
            elementContext: "reference"
          }), c = Pt(i, n.reference);
          return {
            data: {
              referenceHiddenOffsets: c,
              referenceHidden: Et(c)
            }
          };
        }
        case "escaped": {
          const i = await o.detectOverflow(t, {
            ...s,
            altBoundary: !0
          }), c = Pt(i, n.floating);
          return {
            data: {
              escapedOffsets: c,
              escaped: Et(c)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Wt = /* @__PURE__ */ new Set(["left", "top"]);
async function Uo(e, t) {
  const {
    placement: n,
    platform: o,
    elements: r
  } = e, s = await (o.isRTL == null ? void 0 : o.isRTL(r.floating)), i = ie(n), c = we(n), u = J(n) === "y", d = Wt.has(i) ? -1 : 1, a = s && u ? -1 : 1, l = se(t, e);
  let {
    mainAxis: p,
    crossAxis: m,
    alignmentAxis: h
  } = typeof l == "number" ? {
    mainAxis: l,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: l.mainAxis || 0,
    crossAxis: l.crossAxis || 0,
    alignmentAxis: l.alignmentAxis
  };
  return c && typeof h == "number" && (m = c === "end" ? h * -1 : h), u ? {
    x: m * a,
    y: p * d
  } : {
    x: p * d,
    y: m * a
  };
}
const Yo = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var n, o;
      const {
        x: r,
        y: s,
        placement: i,
        middlewareData: c
      } = t, u = await Uo(t, e);
      return i === ((n = c.offset) == null ? void 0 : n.placement) && (o = c.arrow) != null && o.alignmentOffset ? {} : {
        x: r + u.x,
        y: s + u.y,
        data: {
          ...u,
          placement: i
        }
      };
    }
  };
}, Xo = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: o,
        placement: r,
        platform: s
      } = t, {
        mainAxis: i = !0,
        crossAxis: c = !1,
        limiter: u = {
          fn: (w) => {
            let {
              x: M,
              y
            } = w;
            return {
              x: M,
              y
            };
          }
        },
        ...d
      } = se(e, t), a = {
        x: n,
        y: o
      }, l = await s.detectOverflow(t, d), p = J(ie(r)), m = ut(p);
      let h = a[m], x = a[p];
      if (i) {
        const w = m === "y" ? "top" : "left", M = m === "y" ? "bottom" : "right", y = h + l[w], v = h - l[M];
        h = st(y, h, v);
      }
      if (c) {
        const w = p === "y" ? "top" : "left", M = p === "y" ? "bottom" : "right", y = x + l[w], v = x - l[M];
        x = st(y, x, v);
      }
      const g = u.fn({
        ...t,
        [m]: h,
        [p]: x
      });
      return {
        ...g,
        data: {
          x: g.x - n,
          y: g.y - o,
          enabled: {
            [m]: i,
            [p]: c
          }
        }
      };
    }
  };
}, qo = function(e) {
  return e === void 0 && (e = {}), {
    options: e,
    fn(t) {
      const {
        x: n,
        y: o,
        placement: r,
        rects: s,
        middlewareData: i
      } = t, {
        offset: c = 0,
        mainAxis: u = !0,
        crossAxis: d = !0
      } = se(e, t), a = {
        x: n,
        y: o
      }, l = J(r), p = ut(l);
      let m = a[p], h = a[l];
      const x = se(c, t), g = typeof x == "number" ? {
        mainAxis: x,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...x
      };
      if (u) {
        const y = p === "y" ? "height" : "width", v = s.reference[p] - s.floating[y] + g.mainAxis, S = s.reference[p] + s.reference[y] - g.mainAxis;
        m < v ? m = v : m > S && (m = S);
      }
      if (d) {
        var w, M;
        const y = p === "y" ? "width" : "height", v = Wt.has(ie(r)), S = s.reference[l] - s.floating[y] + (v && ((w = i.offset) == null ? void 0 : w[l]) || 0) + (v ? 0 : g.crossAxis), A = s.reference[l] + s.reference[y] + (v ? 0 : ((M = i.offset) == null ? void 0 : M[l]) || 0) - (v ? g.crossAxis : 0);
        h < S ? h = S : h > A && (h = A);
      }
      return {
        [p]: m,
        [l]: h
      };
    }
  };
}, Zo = function(e) {
  return e === void 0 && (e = {}), {
    name: "size",
    options: e,
    async fn(t) {
      var n, o;
      const {
        placement: r,
        rects: s,
        platform: i,
        elements: c
      } = t, {
        apply: u = () => {
        },
        ...d
      } = se(e, t), a = await i.detectOverflow(t, d), l = ie(r), p = we(r), m = J(r) === "y", {
        width: h,
        height: x
      } = s.floating;
      let g, w;
      l === "top" || l === "bottom" ? (g = l, w = p === (await (i.isRTL == null ? void 0 : i.isRTL(c.floating)) ? "start" : "end") ? "left" : "right") : (w = l, g = p === "end" ? "top" : "bottom");
      const M = x - a.top - a.bottom, y = h - a.left - a.right, v = ae(x - a[g], M), S = ae(h - a[w], y), A = !t.middlewareData.shift;
      let _ = v, P = S;
      if ((n = t.middlewareData.shift) != null && n.enabled.x && (P = y), (o = t.middlewareData.shift) != null && o.enabled.y && (_ = M), A && !p) {
        const O = H(a.left, 0), F = H(a.right, 0), L = H(a.top, 0), T = H(a.bottom, 0);
        m ? P = h - 2 * (O !== 0 || F !== 0 ? O + F : H(a.left, a.right)) : _ = x - 2 * (L !== 0 || T !== 0 ? L + T : H(a.top, a.bottom));
      }
      await u({
        ...t,
        availableWidth: P,
        availableHeight: _
      });
      const j = await i.getDimensions(c.floating);
      return h !== j.width || x !== j.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function He() {
  return typeof window < "u";
}
function ve(e) {
  return zt(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function V(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function ne(e) {
  var t;
  return (t = (zt(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function zt(e) {
  return He() ? e instanceof Node || e instanceof V(e).Node : !1;
}
function Y(e) {
  return He() ? e instanceof Element || e instanceof V(e).Element : !1;
}
function ce(e) {
  return He() ? e instanceof HTMLElement || e instanceof V(e).HTMLElement : !1;
}
function Dt(e) {
  return !He() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof V(e).ShadowRoot;
}
function Ee(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: o,
    display: r
  } = X(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + o + n) && r !== "inline" && r !== "contents";
}
function Qo(e) {
  return /^(table|td|th)$/.test(ve(e));
}
function Ve(e) {
  try {
    if (e.matches(":popover-open"))
      return !0;
  } catch {
  }
  try {
    return e.matches(":modal");
  } catch {
    return !1;
  }
}
const Jo = /transform|translate|scale|rotate|perspective|filter/, er = /paint|layout|strict|content/, fe = (e) => !!e && e !== "none";
let Qe;
function pt(e) {
  const t = Y(e) ? X(e) : e;
  return fe(t.transform) || fe(t.translate) || fe(t.scale) || fe(t.rotate) || fe(t.perspective) || !mt() && (fe(t.backdropFilter) || fe(t.filter)) || Jo.test(t.willChange || "") || er.test(t.contain || "");
}
function tr(e) {
  let t = le(e);
  for (; ce(t) && !xe(t); ) {
    if (pt(t))
      return t;
    if (Ve(t))
      return null;
    t = le(t);
  }
  return null;
}
function mt() {
  return Qe == null && (Qe = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), Qe;
}
function xe(e) {
  return /^(html|body|#document)$/.test(ve(e));
}
function X(e) {
  return V(e).getComputedStyle(e);
}
function Ue(e) {
  return Y(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function le(e) {
  if (ve(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    Dt(e) && e.host || // Fallback.
    ne(e)
  );
  return Dt(t) ? t.host : t;
}
function Ht(e) {
  const t = le(e);
  return xe(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : ce(t) && Ee(t) ? t : Ht(t);
}
function Se(e, t, n) {
  var o;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const r = Ht(e), s = r === ((o = e.ownerDocument) == null ? void 0 : o.body), i = V(r);
  if (s) {
    const c = ct(i);
    return t.concat(i, i.visualViewport || [], Ee(r) ? r : [], c && n ? Se(c) : []);
  } else
    return t.concat(r, Se(r, [], n));
}
function ct(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Vt(e) {
  const t = X(e);
  let n = parseFloat(t.width) || 0, o = parseFloat(t.height) || 0;
  const r = ce(e), s = r ? e.offsetWidth : n, i = r ? e.offsetHeight : o, c = Le(n) !== s || Le(o) !== i;
  return c && (n = s, o = i), {
    width: n,
    height: o,
    $: c
  };
}
function ht(e) {
  return Y(e) ? e : e.contextElement;
}
function ge(e) {
  const t = ht(e);
  if (!ce(t))
    return ee(1);
  const n = t.getBoundingClientRect(), {
    width: o,
    height: r,
    $: s
  } = Vt(t);
  let i = (s ? Le(n.width) : n.width) / o, c = (s ? Le(n.height) : n.height) / r;
  return (!i || !Number.isFinite(i)) && (i = 1), (!c || !Number.isFinite(c)) && (c = 1), {
    x: i,
    y: c
  };
}
const nr = /* @__PURE__ */ ee(0);
function Ut(e) {
  const t = V(e);
  return !mt() || !t.visualViewport ? nr : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function or(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== V(e) ? !1 : t;
}
function pe(e, t, n, o) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(), s = ht(e);
  let i = ee(1);
  t && (o ? Y(o) && (i = ge(o)) : i = ge(e));
  const c = or(s, n, o) ? Ut(s) : ee(0);
  let u = (r.left + c.x) / i.x, d = (r.top + c.y) / i.y, a = r.width / i.x, l = r.height / i.y;
  if (s) {
    const p = V(s), m = o && Y(o) ? V(o) : o;
    let h = p, x = ct(h);
    for (; x && o && m !== h; ) {
      const g = ge(x), w = x.getBoundingClientRect(), M = X(x), y = w.left + (x.clientLeft + parseFloat(M.paddingLeft)) * g.x, v = w.top + (x.clientTop + parseFloat(M.paddingTop)) * g.y;
      u *= g.x, d *= g.y, a *= g.x, l *= g.y, u += y, d += v, h = V(x), x = ct(h);
    }
  }
  return $e({
    width: a,
    height: l,
    x: u,
    y: d
  });
}
function Ye(e, t) {
  const n = Ue(e).scrollLeft;
  return t ? t.left + n : pe(ne(e)).left + n;
}
function Yt(e, t) {
  const n = e.getBoundingClientRect(), o = n.left + t.scrollLeft - Ye(e, n), r = n.top + t.scrollTop;
  return {
    x: o,
    y: r
  };
}
function rr(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: o,
    strategy: r
  } = e;
  const s = r === "fixed", i = ne(o), c = t ? Ve(t.floating) : !1;
  if (o === i || c && s)
    return n;
  let u = {
    scrollLeft: 0,
    scrollTop: 0
  }, d = ee(1);
  const a = ee(0), l = ce(o);
  if ((l || !l && !s) && ((ve(o) !== "body" || Ee(i)) && (u = Ue(o)), l)) {
    const m = pe(o);
    d = ge(o), a.x = m.x + o.clientLeft, a.y = m.y + o.clientTop;
  }
  const p = i && !l && !s ? Yt(i, u) : ee(0);
  return {
    width: n.width * d.x,
    height: n.height * d.y,
    x: n.x * d.x - u.scrollLeft * d.x + a.x + p.x,
    y: n.y * d.y - u.scrollTop * d.y + a.y + p.y
  };
}
function sr(e) {
  return Array.from(e.getClientRects());
}
function ir(e) {
  const t = ne(e), n = Ue(e), o = e.ownerDocument.body, r = H(t.scrollWidth, t.clientWidth, o.scrollWidth, o.clientWidth), s = H(t.scrollHeight, t.clientHeight, o.scrollHeight, o.clientHeight);
  let i = -n.scrollLeft + Ye(e);
  const c = -n.scrollTop;
  return X(o).direction === "rtl" && (i += H(t.clientWidth, o.clientWidth) - r), {
    width: r,
    height: s,
    x: i,
    y: c
  };
}
const Ot = 25;
function cr(e, t) {
  const n = V(e), o = ne(e), r = n.visualViewport;
  let s = o.clientWidth, i = o.clientHeight, c = 0, u = 0;
  if (r) {
    s = r.width, i = r.height;
    const a = mt();
    (!a || a && t === "fixed") && (c = r.offsetLeft, u = r.offsetTop);
  }
  const d = Ye(o);
  if (d <= 0) {
    const a = o.ownerDocument, l = a.body, p = getComputedStyle(l), m = a.compatMode === "CSS1Compat" && parseFloat(p.marginLeft) + parseFloat(p.marginRight) || 0, h = Math.abs(o.clientWidth - l.clientWidth - m);
    h <= Ot && (s -= h);
  } else d <= Ot && (s += d);
  return {
    width: s,
    height: i,
    x: c,
    y: u
  };
}
function ar(e, t) {
  const n = pe(e, !0, t === "fixed"), o = n.top + e.clientTop, r = n.left + e.clientLeft, s = ce(e) ? ge(e) : ee(1), i = e.clientWidth * s.x, c = e.clientHeight * s.y, u = r * s.x, d = o * s.y;
  return {
    width: i,
    height: c,
    x: u,
    y: d
  };
}
function It(e, t, n) {
  let o;
  if (t === "viewport")
    o = cr(e, n);
  else if (t === "document")
    o = ir(ne(e));
  else if (Y(t))
    o = ar(t, n);
  else {
    const r = Ut(e);
    o = {
      x: t.x - r.x,
      y: t.y - r.y,
      width: t.width,
      height: t.height
    };
  }
  return $e(o);
}
function Xt(e, t) {
  const n = le(e);
  return n === t || !Y(n) || xe(n) ? !1 : X(n).position === "fixed" || Xt(n, t);
}
function lr(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let o = Se(e, [], !1).filter((c) => Y(c) && ve(c) !== "body"), r = null;
  const s = X(e).position === "fixed";
  let i = s ? le(e) : e;
  for (; Y(i) && !xe(i); ) {
    const c = X(i), u = pt(i);
    !u && c.position === "fixed" && (r = null), (s ? !u && !r : !u && c.position === "static" && !!r && (r.position === "absolute" || r.position === "fixed") || Ee(i) && !u && Xt(e, i)) ? o = o.filter((a) => a !== i) : r = c, i = le(i);
  }
  return t.set(e, o), o;
}
function ur(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: o,
    strategy: r
  } = e;
  const i = [...n === "clippingAncestors" ? Ve(t) ? [] : lr(t, this._c) : [].concat(n), o], c = It(t, i[0], r);
  let u = c.top, d = c.right, a = c.bottom, l = c.left;
  for (let p = 1; p < i.length; p++) {
    const m = It(t, i[p], r);
    u = H(m.top, u), d = ae(m.right, d), a = ae(m.bottom, a), l = H(m.left, l);
  }
  return {
    width: d - l,
    height: a - u,
    x: l,
    y: u
  };
}
function dr(e) {
  const {
    width: t,
    height: n
  } = Vt(e);
  return {
    width: t,
    height: n
  };
}
function fr(e, t, n) {
  const o = ce(t), r = ne(t), s = n === "fixed", i = pe(e, !0, s, t);
  let c = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const u = ee(0);
  function d() {
    u.x = Ye(r);
  }
  if (o || !o && !s)
    if ((ve(t) !== "body" || Ee(r)) && (c = Ue(t)), o) {
      const m = pe(t, !0, s, t);
      u.x = m.x + t.clientLeft, u.y = m.y + t.clientTop;
    } else r && d();
  s && !o && r && d();
  const a = r && !o && !s ? Yt(r, c) : ee(0), l = i.left + c.scrollLeft - u.x - a.x, p = i.top + c.scrollTop - u.y - a.y;
  return {
    x: l,
    y: p,
    width: i.width,
    height: i.height
  };
}
function Je(e) {
  return X(e).position === "static";
}
function Nt(e, t) {
  if (!ce(e) || X(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return ne(e) === n && (n = n.ownerDocument.body), n;
}
function qt(e, t) {
  const n = V(e);
  if (Ve(e))
    return n;
  if (!ce(e)) {
    let r = le(e);
    for (; r && !xe(r); ) {
      if (Y(r) && !Je(r))
        return r;
      r = le(r);
    }
    return n;
  }
  let o = Nt(e, t);
  for (; o && Qo(o) && Je(o); )
    o = Nt(o, t);
  return o && xe(o) && Je(o) && !pt(o) ? n : o || tr(e) || n;
}
const pr = async function(e) {
  const t = this.getOffsetParent || qt, n = this.getDimensions, o = await n(e.floating);
  return {
    reference: fr(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: o.width,
      height: o.height
    }
  };
};
function mr(e) {
  return X(e).direction === "rtl";
}
const hr = {
  convertOffsetParentRelativeRectToViewportRelativeRect: rr,
  getDocumentElement: ne,
  getClippingRect: ur,
  getOffsetParent: qt,
  getElementRects: pr,
  getClientRects: sr,
  getDimensions: dr,
  getScale: ge,
  isElement: Y,
  isRTL: mr
};
function Zt(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function gr(e, t) {
  let n = null, o;
  const r = ne(e);
  function s() {
    var c;
    clearTimeout(o), (c = n) == null || c.disconnect(), n = null;
  }
  function i(c, u) {
    c === void 0 && (c = !1), u === void 0 && (u = 1), s();
    const d = e.getBoundingClientRect(), {
      left: a,
      top: l,
      width: p,
      height: m
    } = d;
    if (c || t(), !p || !m)
      return;
    const h = je(l), x = je(r.clientWidth - (a + p)), g = je(r.clientHeight - (l + m)), w = je(a), y = {
      rootMargin: -h + "px " + -x + "px " + -g + "px " + -w + "px",
      threshold: H(0, ae(1, u)) || 1
    };
    let v = !0;
    function S(A) {
      const _ = A[0].intersectionRatio;
      if (_ !== u) {
        if (!v)
          return i();
        _ ? i(!1, _) : o = setTimeout(() => {
          i(!1, 1e-7);
        }, 1e3);
      }
      _ === 1 && !Zt(d, e.getBoundingClientRect()) && i(), v = !1;
    }
    try {
      n = new IntersectionObserver(S, {
        ...y,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(S, y);
    }
    n.observe(e);
  }
  return i(!0), s;
}
function xr(e, t, n, o) {
  o === void 0 && (o = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: s = !0,
    elementResize: i = typeof ResizeObserver == "function",
    layoutShift: c = typeof IntersectionObserver == "function",
    animationFrame: u = !1
  } = o, d = ht(e), a = r || s ? [...d ? Se(d) : [], ...t ? Se(t) : []] : [];
  a.forEach((w) => {
    r && w.addEventListener("scroll", n, {
      passive: !0
    }), s && w.addEventListener("resize", n);
  });
  const l = d && c ? gr(d, n) : null;
  let p = -1, m = null;
  i && (m = new ResizeObserver((w) => {
    let [M] = w;
    M && M.target === d && m && t && (m.unobserve(t), cancelAnimationFrame(p), p = requestAnimationFrame(() => {
      var y;
      (y = m) == null || y.observe(t);
    })), n();
  }), d && !u && m.observe(d), t && m.observe(t));
  let h, x = u ? pe(e) : null;
  u && g();
  function g() {
    const w = pe(e);
    x && !Zt(x, w) && n(), x = w, h = requestAnimationFrame(g);
  }
  return n(), () => {
    var w;
    a.forEach((M) => {
      r && M.removeEventListener("scroll", n), s && M.removeEventListener("resize", n);
    }), l?.(), (w = m) == null || w.disconnect(), m = null, u && cancelAnimationFrame(h);
  };
}
const wr = Yo, vr = Xo, yr = Ho, br = Zo, Mr = Vo, Tt = zo, Cr = qo, Ar = (e, t, n) => {
  const o = /* @__PURE__ */ new Map(), r = {
    platform: hr,
    ...n
  }, s = {
    ...r.platform,
    _c: o
  };
  return Wo(e, t, {
    ...r,
    platform: s
  });
};
function Qt(e) {
  const t = e + "CollectionProvider", [n, o] = Pe(t), [r, s] = n(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), i = (x) => {
    const { scope: g, children: w } = x, M = oe.useRef(null), y = oe.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ f.jsx(r, { scope: g, itemMap: y, collectionRef: M, children: w });
  };
  i.displayName = t;
  const c = e + "CollectionSlot", u = ot(c), d = oe.forwardRef(
    (x, g) => {
      const { scope: w, children: M } = x, y = s(c, w), v = te(g, y.collectionRef);
      return /* @__PURE__ */ f.jsx(u, { ref: v, children: M });
    }
  );
  d.displayName = c;
  const a = e + "CollectionItemSlot", l = "data-radix-collection-item", p = ot(a), m = oe.forwardRef(
    (x, g) => {
      const { scope: w, children: M, ...y } = x, v = oe.useRef(null), S = te(g, v), A = s(a, w);
      return oe.useEffect(() => (A.itemMap.set(v, { ref: v, ...y }), () => {
        A.itemMap.delete(v);
      })), /* @__PURE__ */ f.jsx(p, { [l]: "", ref: S, children: M });
    }
  );
  m.displayName = a;
  function h(x) {
    const g = s(e + "CollectionConsumer", x);
    return oe.useCallback(() => {
      const M = g.collectionRef.current;
      if (!M) return [];
      const y = Array.from(M.querySelectorAll(`[${l}]`));
      return Array.from(g.itemMap.values()).sort(
        (A, _) => y.indexOf(A.ref.current) - y.indexOf(_.ref.current)
      );
    }, [g.collectionRef, g.itemMap]);
  }
  return [
    { Provider: i, Slot: d, ItemSlot: m },
    h,
    o
  ];
}
var Sr = vo(void 0);
function Jt(e) {
  const t = wo(Sr);
  return e || t || "ltr";
}
var et = "rovingFocusGroup.onEntryFocus", Rr = { bubbles: !1, cancelable: !0 }, De = "RovingFocusGroup", [at, en, _r] = Qt(De), [Pr, tn] = Pe(
  De,
  [_r]
), [Er, Dr] = Pr(De), nn = C(
  (e, t) => /* @__PURE__ */ f.jsx(at.Provider, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ f.jsx(at.Slot, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ f.jsx(Or, { ...e, ref: t }) }) })
);
nn.displayName = De;
var Or = C((e, t) => {
  const {
    __scopeRovingFocusGroup: n,
    orientation: o,
    loop: r = !1,
    dir: s,
    currentTabStopId: i,
    defaultCurrentTabStopId: c,
    onCurrentTabStopIdChange: u,
    onEntryFocus: d,
    preventScrollOnEntryFocus: a = !1,
    ...l
  } = e, p = N(null), m = te(t, p), h = Jt(s), [x, g] = $t({
    prop: i,
    defaultProp: c ?? null,
    onChange: u,
    caller: De
  }), [w, M] = W(!1), y = We(d), v = en(n), S = N(!1), [A, _] = W(0);
  return re(() => {
    const P = p.current;
    if (P)
      return P.addEventListener(et, y), () => P.removeEventListener(et, y);
  }, [y]), /* @__PURE__ */ f.jsx(
    Er,
    {
      scope: n,
      orientation: o,
      dir: h,
      loop: r,
      currentTabStopId: x,
      onItemFocus: K(
        (P) => g(P),
        [g]
      ),
      onItemShiftTab: K(() => M(!0), []),
      onFocusableItemAdd: K(
        () => _((P) => P + 1),
        []
      ),
      onFocusableItemRemove: K(
        () => _((P) => P - 1),
        []
      ),
      children: /* @__PURE__ */ f.jsx(
        Z.div,
        {
          tabIndex: w || A === 0 ? -1 : 0,
          "data-orientation": o,
          ...l,
          ref: m,
          style: { outline: "none", ...e.style },
          onMouseDown: E(e.onMouseDown, () => {
            S.current = !0;
          }),
          onFocus: E(e.onFocus, (P) => {
            const j = !S.current;
            if (P.target === P.currentTarget && j && !w) {
              const O = new CustomEvent(et, Rr);
              if (P.currentTarget.dispatchEvent(O), !O.defaultPrevented) {
                const F = v().filter((D) => D.focusable), L = F.find((D) => D.active), T = F.find((D) => D.id === x), G = [L, T, ...F].filter(
                  Boolean
                ).map((D) => D.ref.current);
                sn(G, a);
              }
            }
            S.current = !1;
          }),
          onBlur: E(e.onBlur, () => M(!1))
        }
      )
    }
  );
}), on = "RovingFocusGroupItem", rn = C(
  (e, t) => {
    const {
      __scopeRovingFocusGroup: n,
      focusable: o = !0,
      active: r = !1,
      tabStopId: s,
      children: i,
      ...c
    } = e, u = rt(), d = s || u, a = Dr(on, n), l = a.currentTabStopId === d, p = en(n), { onFocusableItemAdd: m, onFocusableItemRemove: h, currentTabStopId: x } = a;
    return re(() => {
      if (o)
        return m(), () => h();
    }, [o, m, h]), /* @__PURE__ */ f.jsx(
      at.ItemSlot,
      {
        scope: n,
        id: d,
        focusable: o,
        active: r,
        children: /* @__PURE__ */ f.jsx(
          Z.span,
          {
            tabIndex: l ? 0 : -1,
            "data-orientation": a.orientation,
            ...c,
            ref: t,
            onMouseDown: E(e.onMouseDown, (g) => {
              o ? a.onItemFocus(d) : g.preventDefault();
            }),
            onFocus: E(e.onFocus, () => a.onItemFocus(d)),
            onKeyDown: E(e.onKeyDown, (g) => {
              if (g.key === "Tab" && g.shiftKey) {
                a.onItemShiftTab();
                return;
              }
              if (g.target !== g.currentTarget) return;
              const w = Tr(g, a.orientation, a.dir);
              if (w !== void 0) {
                if (g.metaKey || g.ctrlKey || g.altKey || g.shiftKey) return;
                g.preventDefault();
                let y = p().filter((v) => v.focusable).map((v) => v.ref.current);
                if (w === "last") y.reverse();
                else if (w === "prev" || w === "next") {
                  w === "prev" && y.reverse();
                  const v = y.indexOf(g.currentTarget);
                  y = a.loop ? jr(y, v + 1) : y.slice(v + 1);
                }
                setTimeout(() => sn(y));
              }
            }),
            children: typeof i == "function" ? i({ isCurrentTabStop: l, hasTabStop: x != null }) : i
          }
        )
      }
    );
  }
);
rn.displayName = on;
var Ir = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Nr(e, t) {
  return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function Tr(e, t, n) {
  const o = Nr(e.key, n);
  if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(o)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(o)))
    return Ir[o];
}
function sn(e, t = !1) {
  const n = document.activeElement;
  for (const o of e)
    if (o === n || (o.focus({ preventScroll: t }), document.activeElement !== n)) return;
}
function jr(e, t) {
  return e.map((n, o) => e[(t + o) % e.length]);
}
var Fr = nn, Lr = rn, kr = typeof document < "u", $r = function() {
}, Fe = kr ? bo : $r;
function Ge(e, t) {
  if (e === t)
    return !0;
  if (typeof e != typeof t)
    return !1;
  if (typeof e == "function" && e.toString() === t.toString())
    return !0;
  let n, o, r;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (n = e.length, n !== t.length) return !1;
      for (o = n; o-- !== 0; )
        if (!Ge(e[o], t[o]))
          return !1;
      return !0;
    }
    if (r = Object.keys(e), n = r.length, n !== Object.keys(t).length)
      return !1;
    for (o = n; o-- !== 0; )
      if (!{}.hasOwnProperty.call(t, r[o]))
        return !1;
    for (o = n; o-- !== 0; ) {
      const s = r[o];
      if (!(s === "_owner" && e.$$typeof) && !Ge(e[s], t[s]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function cn(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function jt(e, t) {
  const n = cn(e);
  return Math.round(t * n) / n;
}
function tt(e) {
  const t = N(e);
  return Fe(() => {
    t.current = e;
  }), t;
}
function Gr(e) {
  e === void 0 && (e = {});
  const {
    placement: t = "bottom",
    strategy: n = "absolute",
    middleware: o = [],
    platform: r,
    elements: {
      reference: s,
      floating: i
    } = {},
    transform: c = !0,
    whileElementsMounted: u,
    open: d
  } = e, [a, l] = W({
    x: 0,
    y: 0,
    strategy: n,
    placement: t,
    middlewareData: {},
    isPositioned: !1
  }), [p, m] = W(o);
  Ge(p, o) || m(o);
  const [h, x] = W(null), [g, w] = W(null), M = K((R) => {
    R !== A.current && (A.current = R, x(R));
  }, []), y = K((R) => {
    R !== _.current && (_.current = R, w(R));
  }, []), v = s || h, S = i || g, A = N(null), _ = N(null), P = N(a), j = u != null, O = tt(u), F = tt(r), L = tt(d), T = K(() => {
    if (!A.current || !_.current)
      return;
    const R = {
      placement: t,
      strategy: n,
      middleware: p
    };
    F.current && (R.platform = F.current), Ar(A.current, _.current, R).then((b) => {
      const B = {
        ...b,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: L.current !== !1
      };
      I.current && !Ge(P.current, B) && (P.current = B, yo(() => {
        l(B);
      }));
    });
  }, [p, t, n, F, L]);
  Fe(() => {
    d === !1 && P.current.isPositioned && (P.current.isPositioned = !1, l((R) => ({
      ...R,
      isPositioned: !1
    })));
  }, [d]);
  const I = N(!1);
  Fe(() => (I.current = !0, () => {
    I.current = !1;
  }), []), Fe(() => {
    if (v && (A.current = v), S && (_.current = S), v && S) {
      if (O.current)
        return O.current(v, S, T);
      T();
    }
  }, [v, S, T, O, j]);
  const G = Ce(() => ({
    reference: A,
    floating: _,
    setReference: M,
    setFloating: y
  }), [M, y]), D = Ce(() => ({
    reference: v,
    floating: S
  }), [v, S]), k = Ce(() => {
    const R = {
      position: n,
      left: 0,
      top: 0
    };
    if (!D.floating)
      return R;
    const b = jt(D.floating, a.x), B = jt(D.floating, a.y);
    return c ? {
      ...R,
      transform: "translate(" + b + "px, " + B + "px)",
      ...cn(D.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: n,
      left: b,
      top: B
    };
  }, [n, c, D.floating, a.x, a.y]);
  return Ce(() => ({
    ...a,
    update: T,
    refs: G,
    elements: D,
    floatingStyles: k
  }), [a, T, G, D, k]);
}
const Br = (e) => {
  function t(n) {
    return {}.hasOwnProperty.call(n, "current");
  }
  return {
    name: "arrow",
    options: e,
    fn(n) {
      const {
        element: o,
        padding: r
      } = typeof e == "function" ? e(n) : e;
      return o && t(o) ? o.current != null ? Tt({
        element: o.current,
        padding: r
      }).fn(n) : {} : o ? Tt({
        element: o,
        padding: r
      }).fn(n) : {};
    }
  };
}, Kr = (e, t) => {
  const n = wr(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Wr = (e, t) => {
  const n = vr(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, zr = (e, t) => ({
  fn: Cr(e).fn,
  options: [e, t]
}), Hr = (e, t) => {
  const n = yr(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Vr = (e, t) => {
  const n = br(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Ur = (e, t) => {
  const n = Mr(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Yr = (e, t) => {
  const n = Br(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
};
var Xr = "Arrow", an = C((e, t) => {
  const { children: n, width: o = 10, height: r = 5, ...s } = e;
  return /* @__PURE__ */ f.jsx(
    Z.svg,
    {
      ...s,
      ref: t,
      width: o,
      height: r,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: e.asChild ? n : /* @__PURE__ */ f.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
an.displayName = Xr;
var qr = an, gt = "Popper", [ln, un] = Pe(gt), [Zr, dn] = ln(gt), fn = (e) => {
  const { __scopePopper: t, children: n } = e, [o, r] = W(null);
  return /* @__PURE__ */ f.jsx(Zr, { scope: t, anchor: o, onAnchorChange: r, children: n });
};
fn.displayName = gt;
var pn = "PopperAnchor", mn = C(
  (e, t) => {
    const { __scopePopper: n, virtualRef: o, ...r } = e, s = dn(pn, n), i = N(null), c = te(t, i), u = N(null);
    return re(() => {
      const d = u.current;
      u.current = o?.current || i.current, d !== u.current && s.onAnchorChange(u.current);
    }), o ? null : /* @__PURE__ */ f.jsx(Z.div, { ...r, ref: c });
  }
);
mn.displayName = pn;
var xt = "PopperContent", [Qr, Jr] = ln(xt), hn = C(
  (e, t) => {
    const {
      __scopePopper: n,
      side: o = "bottom",
      sideOffset: r = 0,
      align: s = "center",
      alignOffset: i = 0,
      arrowPadding: c = 0,
      avoidCollisions: u = !0,
      collisionBoundary: d = [],
      collisionPadding: a = 0,
      sticky: l = "partial",
      hideWhenDetached: p = !1,
      updatePositionStrategy: m = "optimized",
      onPlaced: h,
      ...x
    } = e, g = dn(xt, n), [w, M] = W(null), y = te(t, ($) => M($)), [v, S] = W(null), A = Oo(v), _ = A?.width ?? 0, P = A?.height ?? 0, j = o + (s !== "center" ? "-" + s : ""), O = typeof a == "number" ? a : { top: 0, right: 0, bottom: 0, left: 0, ...a }, F = Array.isArray(d) ? d : [d], L = F.length > 0, T = {
      padding: O,
      boundary: F.filter(ts),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: L
    }, { refs: I, floatingStyles: G, placement: D, isPositioned: k, middlewareData: R } = Gr({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: j,
      whileElementsMounted: (...$) => xr(...$, {
        animationFrame: m === "always"
      }),
      elements: {
        reference: g.anchor
      },
      middleware: [
        Kr({ mainAxis: r + P, alignmentAxis: i }),
        u && Wr({
          mainAxis: !0,
          crossAxis: !1,
          limiter: l === "partial" ? zr() : void 0,
          ...T
        }),
        u && Hr({ ...T }),
        Vr({
          ...T,
          apply: ({ elements: $, rects: Me, availableWidth: mo, availableHeight: ho }) => {
            const { width: go, height: xo } = Me.reference, Te = $.floating.style;
            Te.setProperty("--radix-popper-available-width", `${mo}px`), Te.setProperty("--radix-popper-available-height", `${ho}px`), Te.setProperty("--radix-popper-anchor-width", `${go}px`), Te.setProperty("--radix-popper-anchor-height", `${xo}px`);
          }
        }),
        v && Yr({ element: v, padding: c }),
        ns({ arrowWidth: _, arrowHeight: P }),
        p && Ur({ strategy: "referenceHidden", ...T })
      ]
    }), [b, B] = wn(D), Q = We(h);
    nt(() => {
      k && Q?.();
    }, [k, Q]);
    const ue = R.arrow?.x, ye = R.arrow?.y, be = R.arrow?.centerOffset !== 0, [Ne, de] = W();
    return nt(() => {
      w && de(window.getComputedStyle(w).zIndex);
    }, [w]), /* @__PURE__ */ f.jsx(
      "div",
      {
        ref: I.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...G,
          transform: k ? G.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: Ne,
          "--radix-popper-transform-origin": [
            R.transformOrigin?.x,
            R.transformOrigin?.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...R.hide?.referenceHidden && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: e.dir,
        children: /* @__PURE__ */ f.jsx(
          Qr,
          {
            scope: n,
            placedSide: b,
            onArrowChange: S,
            arrowX: ue,
            arrowY: ye,
            shouldHideArrow: be,
            children: /* @__PURE__ */ f.jsx(
              Z.div,
              {
                "data-side": b,
                "data-align": B,
                ...x,
                ref: y,
                style: {
                  ...x.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: k ? void 0 : "none"
                }
              }
            )
          }
        )
      }
    );
  }
);
hn.displayName = xt;
var gn = "PopperArrow", es = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, xn = C(function(t, n) {
  const { __scopePopper: o, ...r } = t, s = Jr(gn, o), i = es[s.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ f.jsx(
      "span",
      {
        ref: s.onArrowChange,
        style: {
          position: "absolute",
          left: s.arrowX,
          top: s.arrowY,
          [i]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[s.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[s.placedSide],
          visibility: s.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ f.jsx(
          qr,
          {
            ...r,
            ref: n,
            style: {
              ...r.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
xn.displayName = gn;
function ts(e) {
  return e !== null;
}
var ns = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    const { placement: n, rects: o, middlewareData: r } = t, i = r.arrow?.centerOffset !== 0, c = i ? 0 : e.arrowWidth, u = i ? 0 : e.arrowHeight, [d, a] = wn(n), l = { start: "0%", center: "50%", end: "100%" }[a], p = (r.arrow?.x ?? 0) + c / 2, m = (r.arrow?.y ?? 0) + u / 2;
    let h = "", x = "";
    return d === "bottom" ? (h = i ? l : `${p}px`, x = `${-u}px`) : d === "top" ? (h = i ? l : `${p}px`, x = `${o.floating.height + u}px`) : d === "right" ? (h = `${-u}px`, x = i ? l : `${m}px`) : d === "left" && (h = `${o.floating.width + u}px`, x = i ? l : `${m}px`), { data: { x: h, y: x } };
  }
});
function wn(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
var os = fn, rs = mn, ss = hn, is = xn, lt = ["Enter", " "], cs = ["ArrowDown", "PageUp", "Home"], vn = ["ArrowUp", "PageDown", "End"], as = [...cs, ...vn], ls = {
  ltr: [...lt, "ArrowRight"],
  rtl: [...lt, "ArrowLeft"]
}, us = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
}, Oe = "Menu", [Re, ds, fs] = Qt(Oe), [me, yn] = Pe(Oe, [
  fs,
  un,
  tn
]), Xe = un(), bn = tn(), [ps, he] = me(Oe), [ms, Ie] = me(Oe), Mn = (e) => {
  const { __scopeMenu: t, open: n = !1, children: o, dir: r, onOpenChange: s, modal: i = !0 } = e, c = Xe(t), [u, d] = W(null), a = N(!1), l = We(s), p = Jt(r);
  return re(() => {
    const m = () => {
      a.current = !0, document.addEventListener("pointerdown", h, { capture: !0, once: !0 }), document.addEventListener("pointermove", h, { capture: !0, once: !0 });
    }, h = () => a.current = !1;
    return document.addEventListener("keydown", m, { capture: !0 }), () => {
      document.removeEventListener("keydown", m, { capture: !0 }), document.removeEventListener("pointerdown", h, { capture: !0 }), document.removeEventListener("pointermove", h, { capture: !0 });
    };
  }, []), /* @__PURE__ */ f.jsx(os, { ...c, children: /* @__PURE__ */ f.jsx(
    ps,
    {
      scope: t,
      open: n,
      onOpenChange: l,
      content: u,
      onContentChange: d,
      children: /* @__PURE__ */ f.jsx(
        ms,
        {
          scope: t,
          onClose: K(() => l(!1), [l]),
          isUsingKeyboardRef: a,
          dir: p,
          modal: i,
          children: o
        }
      )
    }
  ) });
};
Mn.displayName = Oe;
var hs = "MenuAnchor", wt = C(
  (e, t) => {
    const { __scopeMenu: n, ...o } = e, r = Xe(n);
    return /* @__PURE__ */ f.jsx(rs, { ...r, ...o, ref: t });
  }
);
wt.displayName = hs;
var vt = "MenuPortal", [gs, Cn] = me(vt, {
  forceMount: void 0
}), An = (e) => {
  const { __scopeMenu: t, forceMount: n, children: o, container: r } = e, s = he(vt, t);
  return /* @__PURE__ */ f.jsx(gs, { scope: t, forceMount: n, children: /* @__PURE__ */ f.jsx(ze, { present: n || s.open, children: /* @__PURE__ */ f.jsx(Co, { asChild: !0, container: r, children: o }) }) });
};
An.displayName = vt;
var U = "MenuContent", [xs, yt] = me(U), Sn = C(
  (e, t) => {
    const n = Cn(U, e.__scopeMenu), { forceMount: o = n.forceMount, ...r } = e, s = he(U, e.__scopeMenu), i = Ie(U, e.__scopeMenu);
    return /* @__PURE__ */ f.jsx(Re.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ f.jsx(ze, { present: o || s.open, children: /* @__PURE__ */ f.jsx(Re.Slot, { scope: e.__scopeMenu, children: i.modal ? /* @__PURE__ */ f.jsx(ws, { ...r, ref: t }) : /* @__PURE__ */ f.jsx(vs, { ...r, ref: t }) }) }) });
  }
), ws = C(
  (e, t) => {
    const n = he(U, e.__scopeMenu), o = N(null), r = te(t, o);
    return re(() => {
      const s = o.current;
      if (s) return Ao(s);
    }, []), /* @__PURE__ */ f.jsx(
      bt,
      {
        ...e,
        ref: r,
        trapFocus: n.open,
        disableOutsidePointerEvents: n.open,
        disableOutsideScroll: !0,
        onFocusOutside: E(
          e.onFocusOutside,
          (s) => s.preventDefault(),
          { checkForDefaultPrevented: !1 }
        ),
        onDismiss: () => n.onOpenChange(!1)
      }
    );
  }
), vs = C((e, t) => {
  const n = he(U, e.__scopeMenu);
  return /* @__PURE__ */ f.jsx(
    bt,
    {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => n.onOpenChange(!1)
    }
  );
}), ys = ot("MenuContent.ScrollLock"), bt = C(
  (e, t) => {
    const {
      __scopeMenu: n,
      loop: o = !1,
      trapFocus: r,
      onOpenAutoFocus: s,
      onCloseAutoFocus: i,
      disableOutsidePointerEvents: c,
      onEntryFocus: u,
      onEscapeKeyDown: d,
      onPointerDownOutside: a,
      onFocusOutside: l,
      onInteractOutside: p,
      onDismiss: m,
      disableOutsideScroll: h,
      ...x
    } = e, g = he(U, n), w = Ie(U, n), M = Xe(n), y = bn(n), v = ds(n), [S, A] = W(null), _ = N(null), P = te(t, _, g.onContentChange), j = N(0), O = N(""), F = N(0), L = N(null), T = N("right"), I = N(0), G = h ? _o : Mo, D = h ? { as: ys, allowPinchZoom: !0 } : void 0, k = (b) => {
      const B = O.current + b, Q = v().filter(($) => !$.disabled), ue = document.activeElement, ye = Q.find(($) => $.ref.current === ue)?.textValue, be = Q.map(($) => $.textValue), Ne = Is(be, B, ye), de = Q.find(($) => $.textValue === Ne)?.ref.current;
      (function $(Me) {
        O.current = Me, window.clearTimeout(j.current), Me !== "" && (j.current = window.setTimeout(() => $(""), 1e3));
      })(B), de && setTimeout(() => de.focus());
    };
    re(() => () => window.clearTimeout(j.current), []), Ro();
    const R = K((b) => T.current === L.current?.side && Ts(b, L.current?.area), []);
    return /* @__PURE__ */ f.jsx(
      xs,
      {
        scope: n,
        searchRef: O,
        onItemEnter: K(
          (b) => {
            R(b) && b.preventDefault();
          },
          [R]
        ),
        onItemLeave: K(
          (b) => {
            R(b) || (_.current?.focus(), A(null));
          },
          [R]
        ),
        onTriggerLeave: K(
          (b) => {
            R(b) && b.preventDefault();
          },
          [R]
        ),
        pointerGraceTimerRef: F,
        onPointerGraceIntentChange: K((b) => {
          L.current = b;
        }, []),
        children: /* @__PURE__ */ f.jsx(G, { ...D, children: /* @__PURE__ */ f.jsx(
          Po,
          {
            asChild: !0,
            trapped: r,
            onMountAutoFocus: E(s, (b) => {
              b.preventDefault(), _.current?.focus({ preventScroll: !0 });
            }),
            onUnmountAutoFocus: i,
            children: /* @__PURE__ */ f.jsx(
              Eo,
              {
                asChild: !0,
                disableOutsidePointerEvents: c,
                onEscapeKeyDown: d,
                onPointerDownOutside: a,
                onFocusOutside: l,
                onInteractOutside: p,
                onDismiss: m,
                children: /* @__PURE__ */ f.jsx(
                  Fr,
                  {
                    asChild: !0,
                    ...y,
                    dir: w.dir,
                    orientation: "vertical",
                    loop: o,
                    currentTabStopId: S,
                    onCurrentTabStopIdChange: A,
                    onEntryFocus: E(u, (b) => {
                      w.isUsingKeyboardRef.current || b.preventDefault();
                    }),
                    preventScrollOnEntryFocus: !0,
                    children: /* @__PURE__ */ f.jsx(
                      ss,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": Bn(g.open),
                        "data-radix-menu-content": "",
                        dir: w.dir,
                        ...M,
                        ...x,
                        ref: P,
                        style: { outline: "none", ...x.style },
                        onKeyDown: E(x.onKeyDown, (b) => {
                          const Q = b.target.closest("[data-radix-menu-content]") === b.currentTarget, ue = b.ctrlKey || b.altKey || b.metaKey, ye = b.key.length === 1;
                          Q && (b.key === "Tab" && b.preventDefault(), !ue && ye && k(b.key));
                          const be = _.current;
                          if (b.target !== be || !as.includes(b.key)) return;
                          b.preventDefault();
                          const de = v().filter(($) => !$.disabled).map(($) => $.ref.current);
                          vn.includes(b.key) && de.reverse(), Ds(de);
                        }),
                        onBlur: E(e.onBlur, (b) => {
                          b.currentTarget.contains(b.target) || (window.clearTimeout(j.current), O.current = "");
                        }),
                        onPointerMove: E(
                          e.onPointerMove,
                          _e((b) => {
                            const B = b.target, Q = I.current !== b.clientX;
                            if (b.currentTarget.contains(B) && Q) {
                              const ue = b.clientX > I.current ? "right" : "left";
                              T.current = ue, I.current = b.clientX;
                            }
                          })
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
Sn.displayName = U;
var bs = "MenuGroup", Mt = C(
  (e, t) => {
    const { __scopeMenu: n, ...o } = e;
    return /* @__PURE__ */ f.jsx(Z.div, { role: "group", ...o, ref: t });
  }
);
Mt.displayName = bs;
var Ms = "MenuLabel", Rn = C(
  (e, t) => {
    const { __scopeMenu: n, ...o } = e;
    return /* @__PURE__ */ f.jsx(Z.div, { ...o, ref: t });
  }
);
Rn.displayName = Ms;
var Be = "MenuItem", Ft = "menu.itemSelect", qe = C(
  (e, t) => {
    const { disabled: n = !1, onSelect: o, ...r } = e, s = N(null), i = Ie(Be, e.__scopeMenu), c = yt(Be, e.__scopeMenu), u = te(t, s), d = N(!1), a = () => {
      const l = s.current;
      if (!n && l) {
        const p = new CustomEvent(Ft, { bubbles: !0, cancelable: !0 });
        l.addEventListener(Ft, (m) => o?.(m), { once: !0 }), So(l, p), p.defaultPrevented ? d.current = !1 : i.onClose();
      }
    };
    return /* @__PURE__ */ f.jsx(
      _n,
      {
        ...r,
        ref: u,
        disabled: n,
        onClick: E(e.onClick, a),
        onPointerDown: (l) => {
          e.onPointerDown?.(l), d.current = !0;
        },
        onPointerUp: E(e.onPointerUp, (l) => {
          d.current || l.currentTarget?.click();
        }),
        onKeyDown: E(e.onKeyDown, (l) => {
          const p = c.searchRef.current !== "";
          n || p && l.key === " " || lt.includes(l.key) && (l.currentTarget.click(), l.preventDefault());
        })
      }
    );
  }
);
qe.displayName = Be;
var _n = C(
  (e, t) => {
    const { __scopeMenu: n, disabled: o = !1, textValue: r, ...s } = e, i = yt(Be, n), c = bn(n), u = N(null), d = te(t, u), [a, l] = W(!1), [p, m] = W("");
    return re(() => {
      const h = u.current;
      h && m((h.textContent ?? "").trim());
    }, [s.children]), /* @__PURE__ */ f.jsx(
      Re.ItemSlot,
      {
        scope: n,
        disabled: o,
        textValue: r ?? p,
        children: /* @__PURE__ */ f.jsx(Lr, { asChild: !0, ...c, focusable: !o, children: /* @__PURE__ */ f.jsx(
          Z.div,
          {
            role: "menuitem",
            "data-highlighted": a ? "" : void 0,
            "aria-disabled": o || void 0,
            "data-disabled": o ? "" : void 0,
            ...s,
            ref: d,
            onPointerMove: E(
              e.onPointerMove,
              _e((h) => {
                o ? i.onItemLeave(h) : (i.onItemEnter(h), h.defaultPrevented || h.currentTarget.focus({ preventScroll: !0 }));
              })
            ),
            onPointerLeave: E(
              e.onPointerLeave,
              _e((h) => i.onItemLeave(h))
            ),
            onFocus: E(e.onFocus, () => l(!0)),
            onBlur: E(e.onBlur, () => l(!1))
          }
        ) })
      }
    );
  }
), Cs = "MenuCheckboxItem", Pn = C(
  (e, t) => {
    const { checked: n = !1, onCheckedChange: o, ...r } = e;
    return /* @__PURE__ */ f.jsx(Nn, { scope: e.__scopeMenu, checked: n, children: /* @__PURE__ */ f.jsx(
      qe,
      {
        role: "menuitemcheckbox",
        "aria-checked": Ke(n) ? "mixed" : n,
        ...r,
        ref: t,
        "data-state": At(n),
        onSelect: E(
          r.onSelect,
          () => o?.(Ke(n) ? !0 : !n),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
Pn.displayName = Cs;
var En = "MenuRadioGroup", [As, Ss] = me(
  En,
  { value: void 0, onValueChange: () => {
  } }
), Dn = C(
  (e, t) => {
    const { value: n, onValueChange: o, ...r } = e, s = We(o);
    return /* @__PURE__ */ f.jsx(As, { scope: e.__scopeMenu, value: n, onValueChange: s, children: /* @__PURE__ */ f.jsx(Mt, { ...r, ref: t }) });
  }
);
Dn.displayName = En;
var On = "MenuRadioItem", In = C(
  (e, t) => {
    const { value: n, ...o } = e, r = Ss(On, e.__scopeMenu), s = n === r.value;
    return /* @__PURE__ */ f.jsx(Nn, { scope: e.__scopeMenu, checked: s, children: /* @__PURE__ */ f.jsx(
      qe,
      {
        role: "menuitemradio",
        "aria-checked": s,
        ...o,
        ref: t,
        "data-state": At(s),
        onSelect: E(
          o.onSelect,
          () => r.onValueChange?.(n),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
In.displayName = On;
var Ct = "MenuItemIndicator", [Nn, Rs] = me(
  Ct,
  { checked: !1 }
), Tn = C(
  (e, t) => {
    const { __scopeMenu: n, forceMount: o, ...r } = e, s = Rs(Ct, n);
    return /* @__PURE__ */ f.jsx(
      ze,
      {
        present: o || Ke(s.checked) || s.checked === !0,
        children: /* @__PURE__ */ f.jsx(
          Z.span,
          {
            ...r,
            ref: t,
            "data-state": At(s.checked)
          }
        )
      }
    );
  }
);
Tn.displayName = Ct;
var _s = "MenuSeparator", jn = C(
  (e, t) => {
    const { __scopeMenu: n, ...o } = e;
    return /* @__PURE__ */ f.jsx(
      Z.div,
      {
        role: "separator",
        "aria-orientation": "horizontal",
        ...o,
        ref: t
      }
    );
  }
);
jn.displayName = _s;
var Ps = "MenuArrow", Fn = C(
  (e, t) => {
    const { __scopeMenu: n, ...o } = e, r = Xe(n);
    return /* @__PURE__ */ f.jsx(is, { ...r, ...o, ref: t });
  }
);
Fn.displayName = Ps;
var Es = "MenuSub", [Ii, Ln] = me(Es), Ae = "MenuSubTrigger", kn = C(
  (e, t) => {
    const n = he(Ae, e.__scopeMenu), o = Ie(Ae, e.__scopeMenu), r = Ln(Ae, e.__scopeMenu), s = yt(Ae, e.__scopeMenu), i = N(null), { pointerGraceTimerRef: c, onPointerGraceIntentChange: u } = s, d = { __scopeMenu: e.__scopeMenu }, a = K(() => {
      i.current && window.clearTimeout(i.current), i.current = null;
    }, []);
    return re(() => a, [a]), re(() => {
      const l = c.current;
      return () => {
        window.clearTimeout(l), u(null);
      };
    }, [c, u]), /* @__PURE__ */ f.jsx(wt, { asChild: !0, ...d, children: /* @__PURE__ */ f.jsx(
      _n,
      {
        id: r.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": n.open,
        "aria-controls": r.contentId,
        "data-state": Bn(n.open),
        ...e,
        ref: Gt(t, r.onTriggerChange),
        onClick: (l) => {
          e.onClick?.(l), !(e.disabled || l.defaultPrevented) && (l.currentTarget.focus(), n.open || n.onOpenChange(!0));
        },
        onPointerMove: E(
          e.onPointerMove,
          _e((l) => {
            s.onItemEnter(l), !l.defaultPrevented && !e.disabled && !n.open && !i.current && (s.onPointerGraceIntentChange(null), i.current = window.setTimeout(() => {
              n.onOpenChange(!0), a();
            }, 100));
          })
        ),
        onPointerLeave: E(
          e.onPointerLeave,
          _e((l) => {
            a();
            const p = n.content?.getBoundingClientRect();
            if (p) {
              const m = n.content?.dataset.side, h = m === "right", x = h ? -5 : 5, g = p[h ? "left" : "right"], w = p[h ? "right" : "left"];
              s.onPointerGraceIntentChange({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: l.clientX + x, y: l.clientY },
                  { x: g, y: p.top },
                  { x: w, y: p.top },
                  { x: w, y: p.bottom },
                  { x: g, y: p.bottom }
                ],
                side: m
              }), window.clearTimeout(c.current), c.current = window.setTimeout(
                () => s.onPointerGraceIntentChange(null),
                300
              );
            } else {
              if (s.onTriggerLeave(l), l.defaultPrevented) return;
              s.onPointerGraceIntentChange(null);
            }
          })
        ),
        onKeyDown: E(e.onKeyDown, (l) => {
          const p = s.searchRef.current !== "";
          e.disabled || p && l.key === " " || ls[o.dir].includes(l.key) && (n.onOpenChange(!0), n.content?.focus(), l.preventDefault());
        })
      }
    ) });
  }
);
kn.displayName = Ae;
var $n = "MenuSubContent", Gn = C(
  (e, t) => {
    const n = Cn(U, e.__scopeMenu), { forceMount: o = n.forceMount, ...r } = e, s = he(U, e.__scopeMenu), i = Ie(U, e.__scopeMenu), c = Ln($n, e.__scopeMenu), u = N(null), d = te(t, u);
    return /* @__PURE__ */ f.jsx(Re.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ f.jsx(ze, { present: o || s.open, children: /* @__PURE__ */ f.jsx(Re.Slot, { scope: e.__scopeMenu, children: /* @__PURE__ */ f.jsx(
      bt,
      {
        id: c.contentId,
        "aria-labelledby": c.triggerId,
        ...r,
        ref: d,
        align: "start",
        side: i.dir === "rtl" ? "left" : "right",
        disableOutsidePointerEvents: !1,
        disableOutsideScroll: !1,
        trapFocus: !1,
        onOpenAutoFocus: (a) => {
          i.isUsingKeyboardRef.current && u.current?.focus(), a.preventDefault();
        },
        onCloseAutoFocus: (a) => a.preventDefault(),
        onFocusOutside: E(e.onFocusOutside, (a) => {
          a.target !== c.trigger && s.onOpenChange(!1);
        }),
        onEscapeKeyDown: E(e.onEscapeKeyDown, (a) => {
          i.onClose(), a.preventDefault();
        }),
        onKeyDown: E(e.onKeyDown, (a) => {
          const l = a.currentTarget.contains(a.target), p = us[i.dir].includes(a.key);
          l && p && (s.onOpenChange(!1), c.trigger?.focus(), a.preventDefault());
        })
      }
    ) }) }) });
  }
);
Gn.displayName = $n;
function Bn(e) {
  return e ? "open" : "closed";
}
function Ke(e) {
  return e === "indeterminate";
}
function At(e) {
  return Ke(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function Ds(e) {
  const t = document.activeElement;
  for (const n of e)
    if (n === t || (n.focus(), document.activeElement !== t)) return;
}
function Os(e, t) {
  return e.map((n, o) => e[(t + o) % e.length]);
}
function Is(e, t, n) {
  const r = t.length > 1 && Array.from(t).every((d) => d === t[0]) ? t[0] : t, s = n ? e.indexOf(n) : -1;
  let i = Os(e, Math.max(s, 0));
  r.length === 1 && (i = i.filter((d) => d !== n));
  const u = i.find(
    (d) => d.toLowerCase().startsWith(r.toLowerCase())
  );
  return u !== n ? u : void 0;
}
function Ns(e, t) {
  const { x: n, y: o } = e;
  let r = !1;
  for (let s = 0, i = t.length - 1; s < t.length; i = s++) {
    const c = t[s], u = t[i], d = c.x, a = c.y, l = u.x, p = u.y;
    a > o != p > o && n < (l - d) * (o - a) / (p - a) + d && (r = !r);
  }
  return r;
}
function Ts(e, t) {
  if (!t) return !1;
  const n = { x: e.clientX, y: e.clientY };
  return Ns(n, t);
}
function _e(e) {
  return (t) => t.pointerType === "mouse" ? e(t) : void 0;
}
var js = Mn, Fs = wt, Ls = An, ks = Sn, $s = Mt, Gs = Rn, Bs = qe, Ks = Pn, Ws = Dn, zs = In, Hs = Tn, Vs = jn, Us = Fn, Ys = kn, Xs = Gn, Ze = "DropdownMenu", [qs] = Pe(
  Ze,
  [yn]
), z = yn(), [Zs, Kn] = qs(Ze), Wn = (e) => {
  const {
    __scopeDropdownMenu: t,
    children: n,
    dir: o,
    open: r,
    defaultOpen: s,
    onOpenChange: i,
    modal: c = !0
  } = e, u = z(t), d = N(null), [a, l] = $t({
    prop: r,
    defaultProp: s ?? !1,
    onChange: i,
    caller: Ze
  });
  return /* @__PURE__ */ f.jsx(
    Zs,
    {
      scope: t,
      triggerId: rt(),
      triggerRef: d,
      contentId: rt(),
      open: a,
      onOpenChange: l,
      onOpenToggle: K(() => l((p) => !p), [l]),
      modal: c,
      children: /* @__PURE__ */ f.jsx(js, { ...u, open: a, onOpenChange: l, dir: o, modal: c, children: n })
    }
  );
};
Wn.displayName = Ze;
var zn = "DropdownMenuTrigger", Hn = C(
  (e, t) => {
    const { __scopeDropdownMenu: n, disabled: o = !1, ...r } = e, s = Kn(zn, n), i = z(n);
    return /* @__PURE__ */ f.jsx(Fs, { asChild: !0, ...i, children: /* @__PURE__ */ f.jsx(
      Z.button,
      {
        type: "button",
        id: s.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": s.open,
        "aria-controls": s.open ? s.contentId : void 0,
        "data-state": s.open ? "open" : "closed",
        "data-disabled": o ? "" : void 0,
        disabled: o,
        ...r,
        ref: Gt(t, s.triggerRef),
        onPointerDown: E(e.onPointerDown, (c) => {
          !o && c.button === 0 && c.ctrlKey === !1 && (s.onOpenToggle(), s.open || c.preventDefault());
        }),
        onKeyDown: E(e.onKeyDown, (c) => {
          o || (["Enter", " "].includes(c.key) && s.onOpenToggle(), c.key === "ArrowDown" && s.onOpenChange(!0), ["Enter", " ", "ArrowDown"].includes(c.key) && c.preventDefault());
        })
      }
    ) });
  }
);
Hn.displayName = zn;
var Qs = "DropdownMenuPortal", Vn = (e) => {
  const { __scopeDropdownMenu: t, ...n } = e, o = z(t);
  return /* @__PURE__ */ f.jsx(Ls, { ...o, ...n });
};
Vn.displayName = Qs;
var Un = "DropdownMenuContent", Yn = C(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e, r = Kn(Un, n), s = z(n), i = N(!1);
    return /* @__PURE__ */ f.jsx(
      ks,
      {
        id: r.contentId,
        "aria-labelledby": r.triggerId,
        ...s,
        ...o,
        ref: t,
        onCloseAutoFocus: E(e.onCloseAutoFocus, (c) => {
          i.current || r.triggerRef.current?.focus(), i.current = !1, c.preventDefault();
        }),
        onInteractOutside: E(e.onInteractOutside, (c) => {
          const u = c.detail.originalEvent, d = u.button === 0 && u.ctrlKey === !0, a = u.button === 2 || d;
          (!r.modal || a) && (i.current = !0);
        }),
        style: {
          ...e.style,
          "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    );
  }
);
Yn.displayName = Un;
var Js = "DropdownMenuGroup", Xn = C(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e, r = z(n);
    return /* @__PURE__ */ f.jsx($s, { ...r, ...o, ref: t });
  }
);
Xn.displayName = Js;
var ei = "DropdownMenuLabel", qn = C(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e, r = z(n);
    return /* @__PURE__ */ f.jsx(Gs, { ...r, ...o, ref: t });
  }
);
qn.displayName = ei;
var ti = "DropdownMenuItem", Zn = C(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e, r = z(n);
    return /* @__PURE__ */ f.jsx(Bs, { ...r, ...o, ref: t });
  }
);
Zn.displayName = ti;
var ni = "DropdownMenuCheckboxItem", Qn = C((e, t) => {
  const { __scopeDropdownMenu: n, ...o } = e, r = z(n);
  return /* @__PURE__ */ f.jsx(Ks, { ...r, ...o, ref: t });
});
Qn.displayName = ni;
var oi = "DropdownMenuRadioGroup", ri = C((e, t) => {
  const { __scopeDropdownMenu: n, ...o } = e, r = z(n);
  return /* @__PURE__ */ f.jsx(Ws, { ...r, ...o, ref: t });
});
ri.displayName = oi;
var si = "DropdownMenuRadioItem", Jn = C((e, t) => {
  const { __scopeDropdownMenu: n, ...o } = e, r = z(n);
  return /* @__PURE__ */ f.jsx(zs, { ...r, ...o, ref: t });
});
Jn.displayName = si;
var ii = "DropdownMenuItemIndicator", eo = C((e, t) => {
  const { __scopeDropdownMenu: n, ...o } = e, r = z(n);
  return /* @__PURE__ */ f.jsx(Hs, { ...r, ...o, ref: t });
});
eo.displayName = ii;
var ci = "DropdownMenuSeparator", to = C((e, t) => {
  const { __scopeDropdownMenu: n, ...o } = e, r = z(n);
  return /* @__PURE__ */ f.jsx(Vs, { ...r, ...o, ref: t });
});
to.displayName = ci;
var ai = "DropdownMenuArrow", li = C(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e, r = z(n);
    return /* @__PURE__ */ f.jsx(Us, { ...r, ...o, ref: t });
  }
);
li.displayName = ai;
var ui = "DropdownMenuSubTrigger", no = C((e, t) => {
  const { __scopeDropdownMenu: n, ...o } = e, r = z(n);
  return /* @__PURE__ */ f.jsx(Ys, { ...r, ...o, ref: t });
});
no.displayName = ui;
var di = "DropdownMenuSubContent", oo = C((e, t) => {
  const { __scopeDropdownMenu: n, ...o } = e, r = z(n);
  return /* @__PURE__ */ f.jsx(
    Xs,
    {
      ...r,
      ...o,
      ref: t,
      style: {
        ...e.style,
        "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
        "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
        "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
      }
    }
  );
});
oo.displayName = di;
var fi = Wn, pi = Hn, mi = Vn, ro = Yn, hi = Xn, so = qn, io = Zn, co = Qn, ao = Jn, lo = eo, uo = to, fo = no, po = oo;
const gi = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], xi = Bt("chevron-right", gi);
const wi = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]], vi = Bt("circle", wi), Ni = fi, Ti = pi, ji = hi, yi = C(({ className: e, inset: t, children: n, ...o }, r) => /* @__PURE__ */ f.jsxs(
  fo,
  {
    ref: r,
    className: q(
      "flex cursor-default gap-2 select-none hover:bg-accent items-center rounded-xs px-2 py-1.5 text-control outline-hidden focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      t && "pl-8",
      e
    ),
    ...o,
    children: [
      n,
      /* @__PURE__ */ f.jsx(xi, { className: "ml-auto" })
    ]
  }
));
yi.displayName = fo.displayName;
const bi = C(({ className: e, ...t }, n) => /* @__PURE__ */ f.jsx("div", { className: kt, children: /* @__PURE__ */ f.jsx(
  po,
  {
    ref: n,
    className: q(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      e
    ),
    ...t
  }
) }));
bi.displayName = po.displayName;
const Mi = C(({ className: e, sideOffset: t = 4, ...n }, o) => /* @__PURE__ */ f.jsx(mi, { children: /* @__PURE__ */ f.jsx("div", { className: kt, children: /* @__PURE__ */ f.jsx(
  ro,
  {
    ref: o,
    className: q(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      e
    ),
    sideOffset: t,
    ...n
  }
) }) }));
Mi.displayName = ro.displayName;
const Ci = C(({ className: e, inset: t, ...n }, o) => /* @__PURE__ */ f.jsx(
  io,
  {
    ref: o,
    className: q(
      "relative flex cursor-default select-none cursor-pointer items-center gap-2 rounded-xs px-2 py-1.5 text-control outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      t && "pl-8",
      e
    ),
    ...n
  }
));
Ci.displayName = io.displayName;
const Ai = C(({ className: e, children: t, checked: n, ...o }, r) => /* @__PURE__ */ f.jsxs(
  co,
  {
    ref: r,
    checked: n,
    className: q(
      "relative flex cursor-default select-none items-center rounded-xs py-1.5 pl-8 pr-2 text-control outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e
    ),
    ...o,
    children: [
      /* @__PURE__ */ f.jsx("span", { className: "absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ f.jsx(lo, { children: /* @__PURE__ */ f.jsx(Do, { className: "size-4" }) }) }),
      t
    ]
  }
));
Ai.displayName = co.displayName;
const Si = C(({ className: e, children: t, ...n }, o) => /* @__PURE__ */ f.jsxs(
  ao,
  {
    ref: o,
    className: q(
      "relative flex cursor-default select-none items-center rounded-xs py-1.5 pl-8 pr-2 text-control outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e
    ),
    ...n,
    children: [
      /* @__PURE__ */ f.jsx("span", { className: "absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ f.jsx(lo, { children: /* @__PURE__ */ f.jsx(vi, { className: "size-2 fill-current" }) }) }),
      t
    ]
  }
));
Si.displayName = ao.displayName;
const Ri = C(({ className: e, inset: t, ...n }, o) => /* @__PURE__ */ f.jsx(
  so,
  {
    ref: o,
    className: q(
      "px-2 py-1.5 text-control font-semibold",
      t && "pl-8",
      e
    ),
    ...n
  }
));
Ri.displayName = so.displayName;
const _i = C(({ className: e, ...t }, n) => /* @__PURE__ */ f.jsx(
  uo,
  {
    ref: n,
    className: q("-mx-1 my-1 h-px bg-muted", e),
    ...t
  }
));
_i.displayName = uo.displayName;
const Pi = ({
  className: e,
  ...t
}) => /* @__PURE__ */ f.jsx(
  "span",
  {
    className: q("ml-auto text-xs tracking-wider opacity-60", e),
    ...t
  }
);
Pi.displayName = "DropdownMenuShortcut";
function Lt({
  containerClassName: e,
  count: t = 1,
  randomize: n = !1,
  minWidth: o = 70,
  maxWidth: r = 100,
  className: s,
  ...i
}) {
  const { randomWidths: c, keys: u } = Ce(() => {
    const d = [], a = [];
    for (let l = 0; l < t; l++) {
      if (n) {
        const p = Math.floor((r - o) / 5), m = Math.floor(Math.random() * (p + 1)), h = o + m * 5;
        d.push(`${h}%`);
      }
      a.push(`skeleton-${l}`);
    }
    return {
      randomWidths: d,
      keys: a
    };
  }, [t, n, o, r]);
  return /* @__PURE__ */ f.jsx("span", { className: e, children: Array.from({ length: t }).map((d, a) => /* @__PURE__ */ f.jsxs(oe.Fragment, { children: [
    /* @__PURE__ */ f.jsx(
      "span",
      {
        className: q("inline-flex w-full leading-none animate-pulse rounded-[2px] bg-primary/10", s),
        style: n ? { width: c[a] } : void 0,
        ...i,
        children: "‌"
      }
    ),
    /* @__PURE__ */ f.jsx("br", {})
  ] }, u[a])) });
}
const Ei = oe.forwardRef(({ className: e, lines: t = 5, ...n }, o) => t < 1 ? /* @__PURE__ */ f.jsx(f.Fragment, {}) : /* @__PURE__ */ f.jsx("div", { ref: o, className: q("flex flex-col gap-2", e), ...n, children: Array.from({ length: t }, (r, s) => {
  let i = "66%";
  switch (s % 5) {
    case 0:
      i = "57%";
      break;
    case 1:
      i = "33%";
      break;
    case 2:
      i = "40%";
      break;
    case 3:
      i = "48%";
      break;
    case 4:
      i = "24%";
      break;
  }
  return /* @__PURE__ */ f.jsxs("div", { className: "flex justify-between gap-6", children: [
    /* @__PURE__ */ f.jsx("div", { className: "grow", style: {
      maxWidth: i
    }, children: /* @__PURE__ */ f.jsx(Lt, {}) }),
    /* @__PURE__ */ f.jsx(Lt, { className: "w-[60px] self-end" })
  ] }, s);
}) }));
Ei.displayName = "SkeletonTable";
export {
  rs as A,
  un as B,
  Ks as C,
  Ni as D,
  tn as E,
  Jt as F,
  $s as G,
  Oo as H,
  Lr as I,
  Gs as L,
  Ls as P,
  Ws as R,
  Vs as S,
  Fs as a,
  is as b,
  Us as c,
  xi as d,
  vi as e,
  ss as f,
  ks as g,
  Ai as h,
  Mi as i,
  ji as j,
  Ci as k,
  _i as l,
  Pi as m,
  Ti as n,
  Bs as o,
  Hs as p,
  zs as q,
  Fr as r,
  os as s,
  js as t,
  Lt as u,
  Ei as v,
  Xs as w,
  Ys as x,
  Qt as y,
  yn as z
};
//# sourceMappingURL=skeleton-DrFcKwP3.mjs.map

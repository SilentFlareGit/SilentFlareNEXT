import { a6 as R, k as V, af as M, Q as x, a7 as Y, ad as _e, ak as P, a9 as w, am as L, o as ge, C as A, g as U, aj as Qe, x as N, M as D, F as re, p as Je, R as et, l as O, i as tt, n as nt } from "./index-BuIZkUhD.mjs";
var k = function() {
  return k = Object.assign || function(t) {
    for (var n, r = 1, o = arguments.length; r < o; r++) {
      n = arguments[r];
      for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (t[a] = n[a]);
    }
    return t;
  }, k.apply(this, arguments);
};
function Me(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
}
function Kn(e, t, n, r) {
  function o(a) {
    return a instanceof n ? a : new n(function(c) {
      c(a);
    });
  }
  return new (n || (n = Promise))(function(a, c) {
    function i(l) {
      try {
        s(r.next(l));
      } catch (f) {
        c(f);
      }
    }
    function d(l) {
      try {
        s(r.throw(l));
      } catch (f) {
        c(f);
      }
    }
    function s(l) {
      l.done ? a(l.value) : o(l.value).then(i, d);
    }
    s((r = r.apply(e, t || [])).next());
  });
}
function Yn(e, t) {
  var n = { label: 0, sent: function() {
    if (a[0] & 1) throw a[1];
    return a[1];
  }, trys: [], ops: [] }, r, o, a, c = Object.create((typeof Iterator == "function" ? Iterator : Object).prototype);
  return c.next = i(0), c.throw = i(1), c.return = i(2), typeof Symbol == "function" && (c[Symbol.iterator] = function() {
    return this;
  }), c;
  function i(s) {
    return function(l) {
      return d([s, l]);
    };
  }
  function d(s) {
    if (r) throw new TypeError("Generator is already executing.");
    for (; c && (c = 0, s[0] && (n = 0)), n; ) try {
      if (r = 1, o && (a = s[0] & 2 ? o.return : s[0] ? o.throw || ((a = o.return) && a.call(o), 0) : o.next) && !(a = a.call(o, s[1])).done) return a;
      switch (o = 0, a && (s = [s[0] & 2, a.value]), s[0]) {
        case 0:
        case 1:
          a = s;
          break;
        case 4:
          return n.label++, { value: s[1], done: !1 };
        case 5:
          n.label++, o = s[1], s = [0];
          continue;
        case 7:
          s = n.ops.pop(), n.trys.pop();
          continue;
        default:
          if (a = n.trys, !(a = a.length > 0 && a[a.length - 1]) && (s[0] === 6 || s[0] === 2)) {
            n = 0;
            continue;
          }
          if (s[0] === 3 && (!a || s[1] > a[0] && s[1] < a[3])) {
            n.label = s[1];
            break;
          }
          if (s[0] === 6 && n.label < a[1]) {
            n.label = a[1], a = s;
            break;
          }
          if (a && n.label < a[2]) {
            n.label = a[2], n.ops.push(s);
            break;
          }
          a[2] && n.ops.pop(), n.trys.pop();
          continue;
      }
      s = t.call(e, n);
    } catch (l) {
      s = [6, l], o = 0;
    } finally {
      r = a = 0;
    }
    if (s[0] & 5) throw s[1];
    return { value: s[0] ? s[1] : void 0, done: !0 };
  }
}
function Xn(e, t) {
  var n = typeof Symbol == "function" && e[Symbol.iterator];
  if (!n) return e;
  var r = n.call(e), o, a = [], c;
  try {
    for (; (t === void 0 || t-- > 0) && !(o = r.next()).done; ) a.push(o.value);
  } catch (i) {
    c = { error: i };
  } finally {
    try {
      o && !o.done && (n = r.return) && n.call(r);
    } finally {
      if (c) throw c.error;
    }
  }
  return a;
}
function rt(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, o = t.length, a; r < o; r++)
    (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
  return e.concat(a || Array.prototype.slice.call(t));
}
function Se(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function be(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const a = Se(o, t);
      return !n && typeof a == "function" && (n = !0), a;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const a = r[o];
          typeof a == "function" ? a() : Se(e[o], null);
        }
      };
  };
}
function oe(...e) {
  return R(be(...e), e);
}
function Zn(e, t) {
  const n = V(t), r = (a) => {
    const { children: c, ...i } = a, d = M(() => i, Object.values(i));
    return /* @__PURE__ */ x.jsx(n.Provider, { value: d, children: c });
  };
  r.displayName = e + "Provider";
  function o(a) {
    const c = Y(n);
    if (c) return c;
    if (t !== void 0) return t;
    throw new Error(`\`${a}\` must be used within \`${e}\``);
  }
  return [r, o];
}
function Gn(e, t = []) {
  let n = [];
  function r(a, c) {
    const i = V(c), d = n.length;
    n = [...n, c];
    const s = (f) => {
      const { scope: v, children: m, ...g } = f, u = v?.[e]?.[d] || i, h = M(() => g, Object.values(g));
      return /* @__PURE__ */ x.jsx(u.Provider, { value: h, children: m });
    };
    s.displayName = a + "Provider";
    function l(f, v) {
      const m = v?.[e]?.[d] || i, g = Y(m);
      if (g) return g;
      if (c !== void 0) return c;
      throw new Error(`\`${f}\` must be used within \`${a}\``);
    }
    return [s, l];
  }
  const o = () => {
    const a = n.map((c) => V(c));
    return function(i) {
      const d = i?.[e] || a;
      return M(
        () => ({ [`__scope${e}`]: { ...i, [e]: d } }),
        [i, d]
      );
    };
  };
  return o.scopeName = e, [r, ot(o, ...t)];
}
function ot(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const r = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(a) {
      const c = r.reduce((i, { useScope: d, scopeName: s }) => {
        const f = d(a)[`__scope${s}`];
        return { ...i, ...f };
      }, {});
      return M(() => ({ [`__scope${t.scopeName}`]: c }), [c]);
    };
  };
  return n.scopeName = t.scopeName, n;
}
function se(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(o) {
    if (e?.(o), n === !1 || !o.defaultPrevented)
      return t?.(o);
  };
}
var z = globalThis?.document ? _e : () => {
}, at = ge[" useInsertionEffect ".trim().toString()] || z;
function qn({
  prop: e,
  defaultProp: t,
  onChange: n = () => {
  },
  caller: r
}) {
  const [o, a, c] = it({
    defaultProp: t,
    onChange: n
  }), i = e !== void 0, d = i ? e : o;
  {
    const l = P(e !== void 0);
    w(() => {
      const f = l.current;
      f !== i && console.warn(
        `${r} is changing from ${f ? "controlled" : "uncontrolled"} to ${i ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), l.current = i;
    }, [i, r]);
  }
  const s = R(
    (l) => {
      if (i) {
        const f = st(l) ? l(e) : l;
        f !== e && c.current?.(f);
      } else
        a(l);
    },
    [i, e, a, c]
  );
  return [d, s];
}
function it({
  defaultProp: e,
  onChange: t
}) {
  const [n, r] = L(e), o = P(n), a = P(t);
  return at(() => {
    a.current = t;
  }, [t]), w(() => {
    o.current !== n && (a.current?.(n), o.current = n);
  }, [n, o]), [n, r, a];
}
function st(e) {
  return typeof e == "function";
}
function ct(e, t) {
  return Qe((n, r) => t[n][r] ?? n, e);
}
var ut = (e) => {
  const { present: t, children: n } = e, r = lt(t), o = typeof n == "function" ? n({ present: r.isPresent }) : A.only(n), a = oe(r.ref, dt(o));
  return typeof n == "function" || r.isPresent ? U(o, { ref: a }) : null;
};
ut.displayName = "Presence";
function lt(e) {
  const [t, n] = L(), r = P(null), o = P(e), a = P("none"), c = e ? "mounted" : "unmounted", [i, d] = ct(c, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return w(() => {
    const s = Z(r.current);
    a.current = i === "mounted" ? s : "none";
  }, [i]), z(() => {
    const s = r.current, l = o.current;
    if (l !== e) {
      const v = a.current, m = Z(s);
      e ? d("MOUNT") : m === "none" || s?.display === "none" ? d("UNMOUNT") : d(l && v !== m ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, d]), z(() => {
    if (t) {
      let s;
      const l = t.ownerDocument.defaultView ?? window, f = (m) => {
        const u = Z(r.current).includes(CSS.escape(m.animationName));
        if (m.target === t && u && (d("ANIMATION_END"), !o.current)) {
          const h = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", s = l.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = h);
          });
        }
      }, v = (m) => {
        m.target === t && (a.current = Z(r.current));
      };
      return t.addEventListener("animationstart", v), t.addEventListener("animationcancel", f), t.addEventListener("animationend", f), () => {
        l.clearTimeout(s), t.removeEventListener("animationstart", v), t.removeEventListener("animationcancel", f), t.removeEventListener("animationend", f);
      };
    } else
      d("ANIMATION_END");
  }, [t, d]), {
    isPresent: ["mounted", "unmountSuspended"].includes(i),
    ref: R((s) => {
      r.current = s ? getComputedStyle(s) : null, n(s);
    }, [])
  };
}
function Z(e) {
  return e?.animationName || "none";
}
function dt(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
// @__NO_SIDE_EFFECTS__
function ft(e) {
  const t = /* @__PURE__ */ vt(e), n = N((r, o) => {
    const { children: a, ...c } = r, i = A.toArray(a), d = i.find(ht);
    if (d) {
      const s = d.props.children, l = i.map((f) => f === d ? A.count(s) > 1 ? A.only(null) : D(s) ? s.props.children : null : f);
      return /* @__PURE__ */ x.jsx(t, { ...c, ref: o, children: D(s) ? U(s, void 0, l) : null });
    }
    return /* @__PURE__ */ x.jsx(t, { ...c, ref: o, children: a });
  });
  return n.displayName = `${e}.Slot`, n;
}
// @__NO_SIDE_EFFECTS__
function vt(e) {
  const t = N((n, r) => {
    const { children: o, ...a } = n;
    if (D(o)) {
      const c = pt(o), i = mt(a, o.props);
      return o.type !== re && (i.ref = r ? be(r, c) : c), U(o, i);
    }
    return A.count(o) > 1 ? A.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var Fe = /* @__PURE__ */ Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function Qn(e) {
  const t = ({ children: n }) => /* @__PURE__ */ x.jsx(x.Fragment, { children: n });
  return t.displayName = `${e}.Slottable`, t.__radixId = Fe, t;
}
function ht(e) {
  return D(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Fe;
}
function mt(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], a = t[r];
    /^on[A-Z]/.test(r) ? o && a ? n[r] = (...i) => {
      const d = a(...i);
      return o(...i), d;
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...a } : r === "className" && (n[r] = [o, a].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function pt(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var yt = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], ae = yt.reduce((e, t) => {
  const n = /* @__PURE__ */ ft(`Primitive.${t}`), r = N((o, a) => {
    const { asChild: c, ...i } = o, d = c ? n : t;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ x.jsx(d, { ...i, ref: a });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function gt(e, t) {
  e && Je(() => e.dispatchEvent(t));
}
var bt = /* @__PURE__ */ Symbol.for("react.lazy"), ne = ge[" use ".trim().toString()];
function Et(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
function We(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === bt && "_payload" in e && Et(e._payload);
}
// @__NO_SIDE_EFFECTS__
function St(e) {
  const t = /* @__PURE__ */ Ct(e), n = N((r, o) => {
    let { children: a, ...c } = r;
    We(a) && typeof ne == "function" && (a = ne(a._payload));
    const i = A.toArray(a), d = i.find(xt);
    if (d) {
      const s = d.props.children, l = i.map((f) => f === d ? A.count(s) > 1 ? A.only(null) : D(s) ? s.props.children : null : f);
      return /* @__PURE__ */ x.jsx(t, { ...c, ref: o, children: D(s) ? U(s, void 0, l) : null });
    }
    return /* @__PURE__ */ x.jsx(t, { ...c, ref: o, children: a });
  });
  return n.displayName = `${e}.Slot`, n;
}
var wt = /* @__PURE__ */ St("Slot");
// @__NO_SIDE_EFFECTS__
function Ct(e) {
  const t = N((n, r) => {
    let { children: o, ...a } = n;
    if (We(o) && typeof ne == "function" && (o = ne(o._payload)), D(o)) {
      const c = Ot(o), i = Nt(a, o.props);
      return o.type !== re && (i.ref = r ? be(r, c) : c), U(o, i);
    }
    return A.count(o) > 1 ? A.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var Pt = /* @__PURE__ */ Symbol("radix.slottable");
function xt(e) {
  return D(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Pt;
}
function Nt(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], a = t[r];
    /^on[A-Z]/.test(r) ? o && a ? n[r] = (...i) => {
      const d = a(...i);
      return o(...i), d;
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...a } : r === "className" && (n[r] = [o, a].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function Ot(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var At = ge[" useId ".trim().toString()] || (() => {
}), Tt = 0;
function Jn(e) {
  const [t, n] = L(At());
  return z(() => {
    n((r) => r ?? String(Tt++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
function K(e) {
  const t = P(e);
  return w(() => {
    t.current = e;
  }), M(() => (...n) => t.current?.(...n), []);
}
function Lt(e, t = globalThis?.document) {
  const n = K(e);
  w(() => {
    const r = (o) => {
      o.key === "Escape" && n(o);
    };
    return t.addEventListener("keydown", r, { capture: !0 }), () => t.removeEventListener("keydown", r, { capture: !0 });
  }, [n, t]);
}
var Rt = "DismissableLayer", pe = "dismissableLayer.update", kt = "dismissableLayer.pointerDownOutside", It = "dismissableLayer.focusOutside", we, je = V({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), Dt = N(
  (e, t) => {
    const {
      disableOutsidePointerEvents: n = !1,
      onEscapeKeyDown: r,
      onPointerDownOutside: o,
      onFocusOutside: a,
      onInteractOutside: c,
      onDismiss: i,
      ...d
    } = e, s = Y(je), [l, f] = L(null), v = l?.ownerDocument ?? globalThis?.document, [, m] = L({}), g = oe(t, (y) => f(y)), u = Array.from(s.layers), [h] = [...s.layersWithOutsidePointerEventsDisabled].slice(-1), p = u.indexOf(h), b = l ? u.indexOf(l) : -1, E = s.layersWithOutsidePointerEventsDisabled.size > 0, S = b >= p, C = Ft((y) => {
      const _ = y.target, F = [...s.branches].some((H) => H.contains(_));
      !S || F || (o?.(y), c?.(y), y.defaultPrevented || i?.());
    }, v), T = Wt((y) => {
      const _ = y.target;
      [...s.branches].some((H) => H.contains(_)) || (a?.(y), c?.(y), y.defaultPrevented || i?.());
    }, v);
    return Lt((y) => {
      b === s.layers.size - 1 && (r?.(y), !y.defaultPrevented && i && (y.preventDefault(), i()));
    }, v), w(() => {
      if (l)
        return n && (s.layersWithOutsidePointerEventsDisabled.size === 0 && (we = v.body.style.pointerEvents, v.body.style.pointerEvents = "none"), s.layersWithOutsidePointerEventsDisabled.add(l)), s.layers.add(l), Ce(), () => {
          n && s.layersWithOutsidePointerEventsDisabled.size === 1 && (v.body.style.pointerEvents = we);
        };
    }, [l, v, n, s]), w(() => () => {
      l && (s.layers.delete(l), s.layersWithOutsidePointerEventsDisabled.delete(l), Ce());
    }, [l, s]), w(() => {
      const y = () => m({});
      return document.addEventListener(pe, y), () => document.removeEventListener(pe, y);
    }, []), /* @__PURE__ */ x.jsx(
      ae.div,
      {
        ...d,
        ref: g,
        style: {
          pointerEvents: E ? S ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: se(e.onFocusCapture, T.onFocusCapture),
        onBlurCapture: se(e.onBlurCapture, T.onBlurCapture),
        onPointerDownCapture: se(
          e.onPointerDownCapture,
          C.onPointerDownCapture
        )
      }
    );
  }
);
Dt.displayName = Rt;
var _t = "DismissableLayerBranch", Mt = N((e, t) => {
  const n = Y(je), r = P(null), o = oe(t, r);
  return w(() => {
    const a = r.current;
    if (a)
      return n.branches.add(a), () => {
        n.branches.delete(a);
      };
  }, [n.branches]), /* @__PURE__ */ x.jsx(ae.div, { ...e, ref: o });
});
Mt.displayName = _t;
function Ft(e, t = globalThis?.document) {
  const n = K(e), r = P(!1), o = P(() => {
  });
  return w(() => {
    const a = (i) => {
      if (i.target && !r.current) {
        let d = function() {
          Be(
            kt,
            n,
            s,
            { discrete: !0 }
          );
        };
        const s = { originalEvent: i };
        i.pointerType === "touch" ? (t.removeEventListener("click", o.current), o.current = d, t.addEventListener("click", o.current, { once: !0 })) : d();
      } else
        t.removeEventListener("click", o.current);
      r.current = !1;
    }, c = window.setTimeout(() => {
      t.addEventListener("pointerdown", a);
    }, 0);
    return () => {
      window.clearTimeout(c), t.removeEventListener("pointerdown", a), t.removeEventListener("click", o.current);
    };
  }, [t, n]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => r.current = !0
  };
}
function Wt(e, t = globalThis?.document) {
  const n = K(e), r = P(!1);
  return w(() => {
    const o = (a) => {
      a.target && !r.current && Be(It, n, { originalEvent: a }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, n]), {
    onFocusCapture: () => r.current = !0,
    onBlurCapture: () => r.current = !1
  };
}
function Ce() {
  const e = new CustomEvent(pe);
  document.dispatchEvent(e);
}
function Be(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target, a = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? gt(o, a) : o.dispatchEvent(a);
}
var jt = "Portal", Bt = N((e, t) => {
  const { container: n, ...r } = e, [o, a] = L(!1);
  z(() => a(!0), []);
  const c = n || o && globalThis?.document?.body;
  return c ? et.createPortal(/* @__PURE__ */ x.jsx(ae.div, { ...r, ref: t }), c) : null;
});
Bt.displayName = jt;
var ce = 0;
function er() {
  w(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", e[0] ?? Pe()), document.body.insertAdjacentElement("beforeend", e[1] ?? Pe()), ce++, () => {
      ce === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), ce--;
    };
  }, []);
}
function Pe() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var ue = "focusScope.autoFocusOnMount", le = "focusScope.autoFocusOnUnmount", xe = { bubbles: !1, cancelable: !0 }, $t = "FocusScope", Ut = N((e, t) => {
  const {
    loop: n = !1,
    trapped: r = !1,
    onMountAutoFocus: o,
    onUnmountAutoFocus: a,
    ...c
  } = e, [i, d] = L(null), s = K(o), l = K(a), f = P(null), v = oe(t, (u) => d(u)), m = P({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  w(() => {
    if (r) {
      let u = function(E) {
        if (m.paused || !i) return;
        const S = E.target;
        i.contains(S) ? f.current = S : I(f.current, { select: !0 });
      }, h = function(E) {
        if (m.paused || !i) return;
        const S = E.relatedTarget;
        S !== null && (i.contains(S) || I(f.current, { select: !0 }));
      }, p = function(E) {
        if (document.activeElement === document.body)
          for (const C of E)
            C.removedNodes.length > 0 && I(i);
      };
      document.addEventListener("focusin", u), document.addEventListener("focusout", h);
      const b = new MutationObserver(p);
      return i && b.observe(i, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", u), document.removeEventListener("focusout", h), b.disconnect();
      };
    }
  }, [r, i, m.paused]), w(() => {
    if (i) {
      Oe.add(m);
      const u = document.activeElement;
      if (!i.contains(u)) {
        const p = new CustomEvent(ue, xe);
        i.addEventListener(ue, s), i.dispatchEvent(p), p.defaultPrevented || (Ht(Xt($e(i)), { select: !0 }), document.activeElement === u && I(i));
      }
      return () => {
        i.removeEventListener(ue, s), setTimeout(() => {
          const p = new CustomEvent(le, xe);
          i.addEventListener(le, l), i.dispatchEvent(p), p.defaultPrevented || I(u ?? document.body, { select: !0 }), i.removeEventListener(le, l), Oe.remove(m);
        }, 0);
      };
    }
  }, [i, s, l, m]);
  const g = R(
    (u) => {
      if (!n && !r || m.paused) return;
      const h = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, p = document.activeElement;
      if (h && p) {
        const b = u.currentTarget, [E, S] = Vt(b);
        E && S ? !u.shiftKey && p === S ? (u.preventDefault(), n && I(E, { select: !0 })) : u.shiftKey && p === E && (u.preventDefault(), n && I(S, { select: !0 })) : p === b && u.preventDefault();
      }
    },
    [n, r, m.paused]
  );
  return /* @__PURE__ */ x.jsx(ae.div, { tabIndex: -1, ...c, ref: v, onKeyDown: g });
});
Ut.displayName = $t;
function Ht(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e)
    if (I(r, { select: t }), document.activeElement !== n) return;
}
function Vt(e) {
  const t = $e(e), n = Ne(t, e), r = Ne(t.reverse(), e);
  return [n, r];
}
function $e(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (r) => {
      const o = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || o ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function Ne(e, t) {
  for (const n of e)
    if (!zt(n, { upTo: t })) return n;
}
function zt(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function Kt(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function I(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && Kt(e) && t && e.select();
  }
}
var Oe = Yt();
function Yt() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && n?.pause(), e = Ae(e, t), e.unshift(t);
    },
    remove(t) {
      e = Ae(e, t), e[0]?.resume();
    }
  };
}
function Ae(e, t) {
  const n = [...e], r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
function Xt(e) {
  return e.filter((t) => t.tagName !== "A");
}
var Zt = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, W = /* @__PURE__ */ new WeakMap(), G = /* @__PURE__ */ new WeakMap(), q = {}, de = 0, Ue = function(e) {
  return e && (e.host || Ue(e.parentNode));
}, Gt = function(e, t) {
  return t.map(function(n) {
    if (e.contains(n))
      return n;
    var r = Ue(n);
    return r && e.contains(r) ? r : (console.error("aria-hidden", n, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, qt = function(e, t, n, r) {
  var o = Gt(t, Array.isArray(e) ? e : [e]);
  q[n] || (q[n] = /* @__PURE__ */ new WeakMap());
  var a = q[n], c = [], i = /* @__PURE__ */ new Set(), d = new Set(o), s = function(f) {
    !f || i.has(f) || (i.add(f), s(f.parentNode));
  };
  o.forEach(s);
  var l = function(f) {
    !f || d.has(f) || Array.prototype.forEach.call(f.children, function(v) {
      if (i.has(v))
        l(v);
      else
        try {
          var m = v.getAttribute(r), g = m !== null && m !== "false", u = (W.get(v) || 0) + 1, h = (a.get(v) || 0) + 1;
          W.set(v, u), a.set(v, h), c.push(v), u === 1 && g && G.set(v, !0), h === 1 && v.setAttribute(n, "true"), g || v.setAttribute(r, "true");
        } catch (p) {
          console.error("aria-hidden: cannot operate on ", v, p);
        }
    });
  };
  return l(t), i.clear(), de++, function() {
    c.forEach(function(f) {
      var v = W.get(f) - 1, m = a.get(f) - 1;
      W.set(f, v), a.set(f, m), v || (G.has(f) || f.removeAttribute(r), G.delete(f)), m || f.removeAttribute(n);
    }), de--, de || (W = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new WeakMap(), G = /* @__PURE__ */ new WeakMap(), q = {});
  };
}, tr = function(e, t, n) {
  n === void 0 && (n = "data-aria-hidden");
  var r = Array.from(Array.isArray(e) ? e : [e]), o = Zt(e);
  return o ? (r.push.apply(r, Array.from(o.querySelectorAll("[aria-live], script"))), qt(r, o, n, "aria-hidden")) : function() {
    return null;
  };
}, ee = "right-scroll-bar-position", te = "width-before-scroll-bar", Qt = "with-scroll-bars-hidden", Jt = "--removed-body-scroll-bar-size";
function fe(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function en(e, t) {
  var n = L(function() {
    return {
      // value
      value: e,
      // last callback
      callback: t,
      // "memoized" public interface
      facade: {
        get current() {
          return n.value;
        },
        set current(r) {
          var o = n.value;
          o !== r && (n.value = r, n.callback(r, o));
        }
      }
    };
  })[0];
  return n.callback = t, n.facade;
}
var tn = typeof window < "u" ? _e : w, Te = /* @__PURE__ */ new WeakMap();
function nn(e, t) {
  var n = en(null, function(r) {
    return e.forEach(function(o) {
      return fe(o, r);
    });
  });
  return tn(function() {
    var r = Te.get(n);
    if (r) {
      var o = new Set(r), a = new Set(e), c = n.current;
      o.forEach(function(i) {
        a.has(i) || fe(i, null);
      }), a.forEach(function(i) {
        o.has(i) || fe(i, c);
      });
    }
    Te.set(n, e);
  }, [e]), n;
}
function rn(e) {
  return e;
}
function on(e, t) {
  t === void 0 && (t = rn);
  var n = [], r = !1, o = {
    read: function() {
      if (r)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return n.length ? n[n.length - 1] : e;
    },
    useMedium: function(a) {
      var c = t(a, r);
      return n.push(c), function() {
        n = n.filter(function(i) {
          return i !== c;
        });
      };
    },
    assignSyncMedium: function(a) {
      for (r = !0; n.length; ) {
        var c = n;
        n = [], c.forEach(a);
      }
      n = {
        push: function(i) {
          return a(i);
        },
        filter: function() {
          return n;
        }
      };
    },
    assignMedium: function(a) {
      r = !0;
      var c = [];
      if (n.length) {
        var i = n;
        n = [], i.forEach(a), c = n;
      }
      var d = function() {
        var l = c;
        c = [], l.forEach(a);
      }, s = function() {
        return Promise.resolve().then(d);
      };
      s(), n = {
        push: function(l) {
          c.push(l), s();
        },
        filter: function(l) {
          return c = c.filter(l), n;
        }
      };
    }
  };
  return o;
}
function an(e) {
  e === void 0 && (e = {});
  var t = on(null);
  return t.options = k({ async: !0, ssr: !1 }, e), t;
}
var He = function(e) {
  var t = e.sideCar, n = Me(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var r = t.read();
  if (!r)
    throw new Error("Sidecar medium not found");
  return O(r, k({}, n));
};
He.isSideCarExport = !0;
function sn(e, t) {
  return e.useMedium(t), He;
}
var Ve = an(), ve = function() {
}, ie = N(function(e, t) {
  var n = P(null), r = L({
    onScrollCapture: ve,
    onWheelCapture: ve,
    onTouchMoveCapture: ve
  }), o = r[0], a = r[1], c = e.forwardProps, i = e.children, d = e.className, s = e.removeScrollBar, l = e.enabled, f = e.shards, v = e.sideCar, m = e.noRelative, g = e.noIsolation, u = e.inert, h = e.allowPinchZoom, p = e.as, b = p === void 0 ? "div" : p, E = e.gapMode, S = Me(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), C = v, T = nn([n, t]), y = k(k({}, S), o);
  return O(
    re,
    null,
    l && O(C, { sideCar: Ve, removeScrollBar: s, shards: f, noRelative: m, noIsolation: g, inert: u, setCallbacks: a, allowPinchZoom: !!h, lockRef: n, gapMode: E }),
    c ? U(A.only(i), k(k({}, y), { ref: T })) : O(b, k({}, y, { className: d, ref: T }), i)
  );
});
ie.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
ie.classNames = {
  fullWidth: te,
  zeroRight: ee
};
var cn = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function un() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = cn();
  return t && e.setAttribute("nonce", t), e;
}
function ln(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function dn(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var fn = function() {
  var e = 0, t = null;
  return {
    add: function(n) {
      e == 0 && (t = un()) && (ln(t, n), dn(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, vn = function() {
  var e = fn();
  return function(t, n) {
    w(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && n]);
  };
}, ze = function() {
  var e = vn(), t = function(n) {
    var r = n.styles, o = n.dynamic;
    return e(r, o), null;
  };
  return t;
}, hn = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, he = function(e) {
  return parseInt(e || "", 10) || 0;
}, mn = function(e) {
  var t = window.getComputedStyle(document.body), n = t[e === "padding" ? "paddingLeft" : "marginLeft"], r = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [he(n), he(r), he(o)];
}, pn = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return hn;
  var t = mn(e), n = document.documentElement.clientWidth, r = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, r - n + t[2] - t[0])
  };
}, yn = ze(), $ = "data-scroll-locked", gn = function(e, t, n, r) {
  var o = e.left, a = e.top, c = e.right, i = e.gap;
  return n === void 0 && (n = "margin"), `
  .`.concat(Qt, ` {
   overflow: hidden `).concat(r, `;
   padding-right: `).concat(i, "px ").concat(r, `;
  }
  body[`).concat($, `] {
    overflow: hidden `).concat(r, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(r, ";"),
    n === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(a, `px;
    padding-right: `).concat(c, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(i, "px ").concat(r, `;
    `),
    n === "padding" && "padding-right: ".concat(i, "px ").concat(r, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(ee, ` {
    right: `).concat(i, "px ").concat(r, `;
  }
  
  .`).concat(te, ` {
    margin-right: `).concat(i, "px ").concat(r, `;
  }
  
  .`).concat(ee, " .").concat(ee, ` {
    right: 0 `).concat(r, `;
  }
  
  .`).concat(te, " .").concat(te, ` {
    margin-right: 0 `).concat(r, `;
  }
  
  body[`).concat($, `] {
    `).concat(Jt, ": ").concat(i, `px;
  }
`);
}, Le = function() {
  var e = parseInt(document.body.getAttribute($) || "0", 10);
  return isFinite(e) ? e : 0;
}, bn = function() {
  w(function() {
    return document.body.setAttribute($, (Le() + 1).toString()), function() {
      var e = Le() - 1;
      e <= 0 ? document.body.removeAttribute($) : document.body.setAttribute($, e.toString());
    };
  }, []);
}, En = function(e) {
  var t = e.noRelative, n = e.noImportant, r = e.gapMode, o = r === void 0 ? "margin" : r;
  bn();
  var a = M(function() {
    return pn(o);
  }, [o]);
  return O(yn, { styles: gn(a, !t, o, n ? "" : "!important") });
}, ye = !1;
if (typeof window < "u")
  try {
    var Q = Object.defineProperty({}, "passive", {
      get: function() {
        return ye = !0, !0;
      }
    });
    window.addEventListener("test", Q, Q), window.removeEventListener("test", Q, Q);
  } catch {
    ye = !1;
  }
var j = ye ? { passive: !1 } : !1, Sn = function(e) {
  return e.tagName === "TEXTAREA";
}, Ke = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var n = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    n[t] !== "hidden" && // contains scroll inside self
    !(n.overflowY === n.overflowX && !Sn(e) && n[t] === "visible")
  );
}, wn = function(e) {
  return Ke(e, "overflowY");
}, Cn = function(e) {
  return Ke(e, "overflowX");
}, Re = function(e, t) {
  var n = t.ownerDocument, r = t;
  do {
    typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
    var o = Ye(e, r);
    if (o) {
      var a = Xe(e, r), c = a[1], i = a[2];
      if (c > i)
        return !0;
    }
    r = r.parentNode;
  } while (r && r !== n.body);
  return !1;
}, Pn = function(e) {
  var t = e.scrollTop, n = e.scrollHeight, r = e.clientHeight;
  return [
    t,
    n,
    r
  ];
}, xn = function(e) {
  var t = e.scrollLeft, n = e.scrollWidth, r = e.clientWidth;
  return [
    t,
    n,
    r
  ];
}, Ye = function(e, t) {
  return e === "v" ? wn(t) : Cn(t);
}, Xe = function(e, t) {
  return e === "v" ? Pn(t) : xn(t);
}, Nn = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, On = function(e, t, n, r, o) {
  var a = Nn(e, window.getComputedStyle(t).direction), c = a * r, i = n.target, d = t.contains(i), s = !1, l = c > 0, f = 0, v = 0;
  do {
    if (!i)
      break;
    var m = Xe(e, i), g = m[0], u = m[1], h = m[2], p = u - h - a * g;
    (g || p) && Ye(e, i) && (f += p, v += g);
    var b = i.parentNode;
    i = b && b.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? b.host : b;
  } while (
    // portaled content
    !d && i !== document.body || // self content
    d && (t.contains(i) || t === i)
  );
  return (l && Math.abs(f) < 1 || !l && Math.abs(v) < 1) && (s = !0), s;
}, J = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, ke = function(e) {
  return [e.deltaX, e.deltaY];
}, Ie = function(e) {
  return e && "current" in e ? e.current : e;
}, An = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, Tn = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, Ln = 0, B = [];
function Rn(e) {
  var t = P([]), n = P([0, 0]), r = P(), o = L(Ln++)[0], a = L(ze)[0], c = P(e);
  w(function() {
    c.current = e;
  }, [e]), w(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var u = rt([e.lockRef.current], (e.shards || []).map(Ie), !0).filter(Boolean);
      return u.forEach(function(h) {
        return h.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), u.forEach(function(h) {
          return h.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var i = R(function(u, h) {
    if ("touches" in u && u.touches.length === 2 || u.type === "wheel" && u.ctrlKey)
      return !c.current.allowPinchZoom;
    var p = J(u), b = n.current, E = "deltaX" in u ? u.deltaX : b[0] - p[0], S = "deltaY" in u ? u.deltaY : b[1] - p[1], C, T = u.target, y = Math.abs(E) > Math.abs(S) ? "h" : "v";
    if ("touches" in u && y === "h" && T.type === "range")
      return !1;
    var _ = window.getSelection(), F = _ && _.anchorNode, H = F ? F === T || F.contains(T) : !1;
    if (H)
      return !1;
    var X = Re(y, T);
    if (!X)
      return !0;
    if (X ? C = y : (C = y === "v" ? "h" : "v", X = Re(y, T)), !X)
      return !1;
    if (!r.current && "changedTouches" in u && (E || S) && (r.current = C), !C)
      return !0;
    var Ee = r.current || C;
    return On(Ee, h, u, Ee === "h" ? E : S);
  }, []), d = R(function(u) {
    var h = u;
    if (!(!B.length || B[B.length - 1] !== a)) {
      var p = "deltaY" in h ? ke(h) : J(h), b = t.current.filter(function(C) {
        return C.name === h.type && (C.target === h.target || h.target === C.shadowParent) && An(C.delta, p);
      })[0];
      if (b && b.should) {
        h.cancelable && h.preventDefault();
        return;
      }
      if (!b) {
        var E = (c.current.shards || []).map(Ie).filter(Boolean).filter(function(C) {
          return C.contains(h.target);
        }), S = E.length > 0 ? i(h, E[0]) : !c.current.noIsolation;
        S && h.cancelable && h.preventDefault();
      }
    }
  }, []), s = R(function(u, h, p, b) {
    var E = { name: u, delta: h, target: p, should: b, shadowParent: kn(p) };
    t.current.push(E), setTimeout(function() {
      t.current = t.current.filter(function(S) {
        return S !== E;
      });
    }, 1);
  }, []), l = R(function(u) {
    n.current = J(u), r.current = void 0;
  }, []), f = R(function(u) {
    s(u.type, ke(u), u.target, i(u, e.lockRef.current));
  }, []), v = R(function(u) {
    s(u.type, J(u), u.target, i(u, e.lockRef.current));
  }, []);
  w(function() {
    return B.push(a), e.setCallbacks({
      onScrollCapture: f,
      onWheelCapture: f,
      onTouchMoveCapture: v
    }), document.addEventListener("wheel", d, j), document.addEventListener("touchmove", d, j), document.addEventListener("touchstart", l, j), function() {
      B = B.filter(function(u) {
        return u !== a;
      }), document.removeEventListener("wheel", d, j), document.removeEventListener("touchmove", d, j), document.removeEventListener("touchstart", l, j);
    };
  }, []);
  var m = e.removeScrollBar, g = e.inert;
  return O(
    re,
    null,
    g ? O(a, { styles: Tn(o) }) : null,
    m ? O(En, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function kn(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const In = sn(Ve, Rn);
var Dn = N(function(e, t) {
  return O(ie, k({}, e, { ref: t, sideCar: In }));
});
Dn.classNames = ie.classNames;
const Ze = (...e) => e.filter((t, n, r) => !!t && t.trim() !== "" && r.indexOf(t) === n).join(" ").trim();
const _n = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Mn = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (t, n, r) => r ? r.toUpperCase() : n.toLowerCase()
);
const De = (e) => {
  const t = Mn(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
};
var me = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const Fn = (e) => {
  for (const t in e)
    if (t.startsWith("aria-") || t === "role" || t === "title")
      return !0;
  return !1;
}, Ge = V({});
function nr({
  children: e,
  size: t,
  color: n,
  strokeWidth: r,
  absoluteStrokeWidth: o,
  className: a
}) {
  const c = M(
    () => ({
      size: t,
      color: n,
      strokeWidth: r,
      absoluteStrokeWidth: o,
      className: a
    }),
    [t, n, r, o, a]
  );
  return O(Ge.Provider, { value: c }, e);
}
const Wn = () => Y(Ge), jn = N(
  ({ color: e, size: t, strokeWidth: n, absoluteStrokeWidth: r, className: o = "", children: a, iconNode: c, ...i }, d) => {
    const {
      size: s = 24,
      strokeWidth: l = 2,
      absoluteStrokeWidth: f = !1,
      color: v = "currentColor",
      className: m = ""
    } = Wn() ?? {}, g = r ?? f ? Number(n ?? l) * 24 / Number(t ?? s) : n ?? l;
    return O(
      "svg",
      {
        ref: d,
        ...me,
        width: t ?? s ?? me.width,
        height: t ?? s ?? me.height,
        stroke: e ?? v,
        strokeWidth: g,
        className: Ze("lucide", m, o),
        ...!a && !Fn(i) && { "aria-hidden": "true" },
        ...i
      },
      [
        ...c.map(([u, h]) => O(u, h)),
        ...Array.isArray(a) ? a : [a]
      ]
    );
  }
);
const qe = (e, t) => {
  const n = N(
    ({ className: r, ...o }, a) => O(jn, {
      ref: a,
      iconNode: t,
      className: Ze(
        `lucide-${_n(De(e))}`,
        `lucide-${e}`,
        r
      ),
      ...o
    })
  );
  return n.displayName = De(e), n;
};
const Bn = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], rr = qe("check", Bn);
const $n = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], Un = qe("chevron-down", $n), Hn = nt(
  "inline-flex items-center justify-center gap-1.5 rounded-md text-control whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-focus-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-[1.5px]",
  {
    variants: {
      variant: {
        default: "bg-primary font-semibold text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive font-medium text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background font-medium hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary font-medium text-secondary-foreground hover:bg-secondary/80",
        ghost: "font-medium hover:bg-accent hover:text-accent-foreground",
        link: "font-medium text-primary underline-offset-4 hover:underline",
        dropdown: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      },
      size: {
        default: "h-(--control-height) px-2.5 py-2",
        sm: "h-7 rounded-md px-3 text-sm [&_svg]:size-3",
        lg: "h-11 rounded-md px-8 text-md font-semibold",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), Vn = N(
  ({ className: e, variant: t, size: n, asChild: r = !1, children: o, ...a }, c) => {
    const i = r ? wt : "button", d = t === "dropdown" ? /* @__PURE__ */ x.jsxs(x.Fragment, { children: [
      o,
      /* @__PURE__ */ x.jsx(Un, { className: "-mr-0.5! -ml-1! size-4 stroke-[2px]! opacity-50", strokeWidth: 2 })
    ] }) : o;
    return /* @__PURE__ */ x.jsx(
      i,
      {
        ref: c,
        className: tt(Hn({ variant: t, size: n, className: e })),
        ...a,
        children: d
      }
    );
  }
);
Vn.displayName = "Button";
export {
  Vn as B,
  rr as C,
  Dt as D,
  Ut as F,
  jn as I,
  nr as L,
  Bt as P,
  Dn as R,
  wt as S,
  Kn as _,
  Un as a,
  ut as b,
  ae as c,
  Yn as d,
  Xn as e,
  Me as f,
  rt as g,
  Hn as h,
  se as i,
  be as j,
  Zn as k,
  Gn as l,
  qe as m,
  ft as n,
  St as o,
  Qn as p,
  gt as q,
  tr as r,
  oe as s,
  qn as t,
  K as u,
  er as v,
  Jn as w,
  z as x,
  Wn as y
};
//# sourceMappingURL=button-CQCNdxY6.mjs.map

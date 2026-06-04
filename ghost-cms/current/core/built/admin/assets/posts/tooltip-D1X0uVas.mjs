import { w as Z, t as ee, s as G, c as te, i as b, b as F, P as oe, l as re, D as ne, p as se, m as $ } from "./button-CQCNdxY6.mjs";
import { ak as g, a9 as P, Q as l, a6 as m, am as B, af as ae, x as E, S as ie, i as ce } from "./index-BuIZkUhD.mjs";
import { s as le, A as ue, B as z, f as de, b as pe } from "./skeleton-DrFcKwP3.mjs";
import { R as fe } from "./chevron-up-DaikhWC2.mjs";
var [j] = re("Tooltip", [
  z
]), L = z(), q = "TooltipProvider", ve = 700, N = "tooltip.open", [xe, k] = j(q), U = (t) => {
  const {
    __scopeTooltip: o,
    delayDuration: e = ve,
    skipDelayDuration: r = 300,
    disableHoverableContent: n = !1,
    children: i
  } = t, a = g(!0), f = g(!1), s = g(0);
  return P(() => {
    const d = s.current;
    return () => window.clearTimeout(d);
  }, []), /* @__PURE__ */ l.jsx(
    xe,
    {
      scope: o,
      isOpenDelayedRef: a,
      delayDuration: e,
      onOpen: m(() => {
        window.clearTimeout(s.current), a.current = !1;
      }, []),
      onClose: m(() => {
        window.clearTimeout(s.current), s.current = window.setTimeout(
          () => a.current = !0,
          r
        );
      }, [r]),
      isPointerInTransitRef: f,
      onPointerInTransitChange: m((d) => {
        f.current = d;
      }, []),
      disableHoverableContent: n,
      children: i
    }
  );
};
U.displayName = q;
var D = "Tooltip", [he, O] = j(D), V = (t) => {
  const {
    __scopeTooltip: o,
    children: e,
    open: r,
    defaultOpen: n,
    onOpenChange: i,
    disableHoverableContent: a,
    delayDuration: f
  } = t, s = k(D, t.__scopeTooltip), d = L(o), [c, p] = B(null), v = Z(), u = g(0), x = a ?? s.disableHoverableContent, y = f ?? s.delayDuration, h = g(!1), [C, T] = ee({
    prop: r,
    defaultProp: n ?? !1,
    onChange: (H) => {
      H ? (s.onOpen(), document.dispatchEvent(new CustomEvent(N))) : s.onClose(), i?.(H);
    },
    caller: D
  }), _ = ae(() => C ? h.current ? "delayed-open" : "instant-open" : "closed", [C]), R = m(() => {
    window.clearTimeout(u.current), u.current = 0, h.current = !1, T(!0);
  }, [T]), A = m(() => {
    window.clearTimeout(u.current), u.current = 0, T(!1);
  }, [T]), S = m(() => {
    window.clearTimeout(u.current), u.current = window.setTimeout(() => {
      h.current = !0, T(!0), u.current = 0;
    }, y);
  }, [y, T]);
  return P(() => () => {
    u.current && (window.clearTimeout(u.current), u.current = 0);
  }, []), /* @__PURE__ */ l.jsx(le, { ...d, children: /* @__PURE__ */ l.jsx(
    he,
    {
      scope: o,
      contentId: v,
      open: C,
      stateAttribute: _,
      trigger: c,
      onTriggerChange: p,
      onTriggerEnter: m(() => {
        s.isOpenDelayedRef.current ? S() : R();
      }, [s.isOpenDelayedRef, S, R]),
      onTriggerLeave: m(() => {
        x ? A() : (window.clearTimeout(u.current), u.current = 0);
      }, [A, x]),
      onOpen: R,
      onClose: A,
      disableHoverableContent: x,
      children: e
    }
  ) });
};
V.displayName = D;
var M = "TooltipTrigger", Y = E(
  (t, o) => {
    const { __scopeTooltip: e, ...r } = t, n = O(M, e), i = k(M, e), a = L(e), f = g(null), s = G(o, f, n.onTriggerChange), d = g(!1), c = g(!1), p = m(() => d.current = !1, []);
    return P(() => () => document.removeEventListener("pointerup", p), [p]), /* @__PURE__ */ l.jsx(ue, { asChild: !0, ...a, children: /* @__PURE__ */ l.jsx(
      te.button,
      {
        "aria-describedby": n.open ? n.contentId : void 0,
        "data-state": n.stateAttribute,
        ...r,
        ref: s,
        onPointerMove: b(t.onPointerMove, (v) => {
          v.pointerType !== "touch" && !c.current && !i.isPointerInTransitRef.current && (n.onTriggerEnter(), c.current = !0);
        }),
        onPointerLeave: b(t.onPointerLeave, () => {
          n.onTriggerLeave(), c.current = !1;
        }),
        onPointerDown: b(t.onPointerDown, () => {
          n.open && n.onClose(), d.current = !0, document.addEventListener("pointerup", p, { once: !0 });
        }),
        onFocus: b(t.onFocus, () => {
          d.current || n.onOpen();
        }),
        onBlur: b(t.onBlur, n.onClose),
        onClick: b(t.onClick, n.onClose)
      }
    ) });
  }
);
Y.displayName = M;
var I = "TooltipPortal", [ye, me] = j(I, {
  forceMount: void 0
}), X = (t) => {
  const { __scopeTooltip: o, forceMount: e, children: r, container: n } = t, i = O(I, o);
  return /* @__PURE__ */ l.jsx(ye, { scope: o, forceMount: e, children: /* @__PURE__ */ l.jsx(F, { present: e || i.open, children: /* @__PURE__ */ l.jsx(oe, { asChild: !0, container: n, children: r }) }) });
};
X.displayName = I;
var w = "TooltipContent", K = E(
  (t, o) => {
    const e = me(w, t.__scopeTooltip), { forceMount: r = e.forceMount, side: n = "top", ...i } = t, a = O(w, t.__scopeTooltip);
    return /* @__PURE__ */ l.jsx(F, { present: r || a.open, children: a.disableHoverableContent ? /* @__PURE__ */ l.jsx(Q, { side: n, ...i, ref: o }) : /* @__PURE__ */ l.jsx(Te, { side: n, ...i, ref: o }) });
  }
), Te = E((t, o) => {
  const e = O(w, t.__scopeTooltip), r = k(w, t.__scopeTooltip), n = g(null), i = G(o, n), [a, f] = B(null), { trigger: s, onClose: d } = e, c = n.current, { onPointerInTransitChange: p } = r, v = m(() => {
    f(null), p(!1);
  }, [p]), u = m(
    (x, y) => {
      const h = x.currentTarget, C = { x: x.clientX, y: x.clientY }, T = we(C, h.getBoundingClientRect()), _ = Ee(C, T), R = _e(y.getBoundingClientRect()), A = Ae([..._, ...R]);
      f(A), p(!0);
    },
    [p]
  );
  return P(() => () => v(), [v]), P(() => {
    if (s && c) {
      const x = (h) => u(h, c), y = (h) => u(h, s);
      return s.addEventListener("pointerleave", x), c.addEventListener("pointerleave", y), () => {
        s.removeEventListener("pointerleave", x), c.removeEventListener("pointerleave", y);
      };
    }
  }, [s, c, u, v]), P(() => {
    if (a) {
      const x = (y) => {
        const h = y.target, C = { x: y.clientX, y: y.clientY }, T = s?.contains(h) || c?.contains(h), _ = !Re(C, a);
        T ? v() : _ && (v(), d());
      };
      return document.addEventListener("pointermove", x), () => document.removeEventListener("pointermove", x);
    }
  }, [s, c, a, d, v]), /* @__PURE__ */ l.jsx(Q, { ...t, ref: i });
}), [ge, Ce] = j(D, { isInside: !1 }), Pe = se("TooltipContent"), Q = E(
  (t, o) => {
    const {
      __scopeTooltip: e,
      children: r,
      "aria-label": n,
      onEscapeKeyDown: i,
      onPointerDownOutside: a,
      ...f
    } = t, s = O(w, e), d = L(e), { onClose: c } = s;
    return P(() => (document.addEventListener(N, c), () => document.removeEventListener(N, c)), [c]), P(() => {
      if (s.trigger) {
        const p = (v) => {
          v.target?.contains(s.trigger) && c();
        };
        return window.addEventListener("scroll", p, { capture: !0 }), () => window.removeEventListener("scroll", p, { capture: !0 });
      }
    }, [s.trigger, c]), /* @__PURE__ */ l.jsx(
      ne,
      {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: i,
        onPointerDownOutside: a,
        onFocusOutside: (p) => p.preventDefault(),
        onDismiss: c,
        children: /* @__PURE__ */ l.jsxs(
          de,
          {
            "data-state": s.stateAttribute,
            ...d,
            ...f,
            ref: o,
            style: {
              ...f.style,
              "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
              "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
              "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
              "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
              "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
            },
            children: [
              /* @__PURE__ */ l.jsx(Pe, { children: r }),
              /* @__PURE__ */ l.jsx(ge, { scope: e, isInside: !0, children: /* @__PURE__ */ l.jsx(fe, { id: s.contentId, role: "tooltip", children: n || r }) })
            ]
          }
        )
      }
    );
  }
);
K.displayName = w;
var W = "TooltipArrow", be = E(
  (t, o) => {
    const { __scopeTooltip: e, ...r } = t, n = L(e);
    return Ce(
      W,
      e
    ).isInside ? null : /* @__PURE__ */ l.jsx(pe, { ...n, ...r, ref: o });
  }
);
be.displayName = W;
function we(t, o) {
  const e = Math.abs(o.top - t.y), r = Math.abs(o.bottom - t.y), n = Math.abs(o.right - t.x), i = Math.abs(o.left - t.x);
  switch (Math.min(e, r, n, i)) {
    case i:
      return "left";
    case n:
      return "right";
    case e:
      return "top";
    case r:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function Ee(t, o, e = 5) {
  const r = [];
  switch (o) {
    case "top":
      r.push(
        { x: t.x - e, y: t.y + e },
        { x: t.x + e, y: t.y + e }
      );
      break;
    case "bottom":
      r.push(
        { x: t.x - e, y: t.y - e },
        { x: t.x + e, y: t.y - e }
      );
      break;
    case "left":
      r.push(
        { x: t.x + e, y: t.y - e },
        { x: t.x + e, y: t.y + e }
      );
      break;
    case "right":
      r.push(
        { x: t.x - e, y: t.y - e },
        { x: t.x - e, y: t.y + e }
      );
      break;
  }
  return r;
}
function _e(t) {
  const { top: o, right: e, bottom: r, left: n } = t;
  return [
    { x: n, y: o },
    { x: e, y: o },
    { x: e, y: r },
    { x: n, y: r }
  ];
}
function Re(t, o) {
  const { x: e, y: r } = t;
  let n = !1;
  for (let i = 0, a = o.length - 1; i < o.length; a = i++) {
    const f = o[i], s = o[a], d = f.x, c = f.y, p = s.x, v = s.y;
    c > r != v > r && e < (p - d) * (r - c) / (v - c) + d && (n = !n);
  }
  return n;
}
function Ae(t) {
  const o = t.slice();
  return o.sort((e, r) => e.x < r.x ? -1 : e.x > r.x ? 1 : e.y < r.y ? -1 : e.y > r.y ? 1 : 0), De(o);
}
function De(t) {
  if (t.length <= 1) return t.slice();
  const o = [];
  for (let r = 0; r < t.length; r++) {
    const n = t[r];
    for (; o.length >= 2; ) {
      const i = o[o.length - 1], a = o[o.length - 2];
      if ((i.x - a.x) * (n.y - a.y) >= (i.y - a.y) * (n.x - a.x)) o.pop();
      else break;
    }
    o.push(n);
  }
  o.pop();
  const e = [];
  for (let r = t.length - 1; r >= 0; r--) {
    const n = t[r];
    for (; e.length >= 2; ) {
      const i = e[e.length - 1], a = e[e.length - 2];
      if ((i.x - a.x) * (n.y - a.y) >= (i.y - a.y) * (n.x - a.x)) e.pop();
      else break;
    }
    e.push(n);
  }
  return e.pop(), o.length === 1 && e.length === 1 && o[0].x === e[0].x && o[0].y === e[0].y ? o : o.concat(e);
}
var Oe = U, je = V, Le = Y, Ne = X, J = K;
const Me = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
], $e = $("circle-alert", Me);
const ke = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
], Be = $("eye", ke), ze = Oe, qe = je, Ue = Le, Ie = E(({ className: t, sideOffset: o = 4, ...e }, r) => /* @__PURE__ */ l.jsx(Ne, { children: /* @__PURE__ */ l.jsx("div", { className: ie, children: /* @__PURE__ */ l.jsx(
  J,
  {
    ref: r,
    className: ce(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      t
    ),
    sideOffset: o,
    ...e
  }
) }) }));
Ie.displayName = J.displayName;
export {
  $e as C,
  Be as E,
  qe as T,
  Ie as a,
  ze as b,
  Ue as c
};
//# sourceMappingURL=tooltip-D1X0uVas.mjs.map

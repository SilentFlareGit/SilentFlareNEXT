import { aD as U, al as g, bl as D, aZ as d, aI as G, bn as W, aC as X, aO as P, bw as ee, br as k, aj as B, aA as x, bK as L, bo as te, bN as K, bk as oe, bj as y } from "./index-D_R_kUw4.mjs";
function ne(e) {
  const o = e + "CollectionProvider", [i, r] = U(o), [w, I] = i(
    o,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), p = (u) => {
    const { scope: t, children: a } = u, f = g.useRef(null), n = g.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ d.jsx(w, { scope: t, itemMap: n, collectionRef: f, children: a });
  };
  p.displayName = o;
  const v = e + "CollectionSlot", A = G(v), m = g.forwardRef(
    (u, t) => {
      const { scope: a, children: f } = u, n = I(v, a), c = D(t, n.collectionRef);
      return /* @__PURE__ */ d.jsx(A, { ref: c, children: f });
    }
  );
  m.displayName = v;
  const s = e + "CollectionItemSlot", b = "data-radix-collection-item", S = G(s), C = g.forwardRef(
    (u, t) => {
      const { scope: a, children: f, ...n } = u, c = g.useRef(null), E = D(t, c), T = I(s, a);
      return g.useEffect(() => (T.itemMap.set(c, { ref: c, ...n }), () => {
        T.itemMap.delete(c);
      })), /* @__PURE__ */ d.jsx(S, { [b]: "", ref: E, children: f });
    }
  );
  C.displayName = s;
  function F(u) {
    const t = I(e + "CollectionConsumer", u);
    return g.useCallback(() => {
      const f = t.collectionRef.current;
      if (!f) return [];
      const n = Array.from(f.querySelectorAll(`[${b}]`));
      return Array.from(t.itemMap.values()).sort(
        (T, h) => n.indexOf(T.ref.current) - n.indexOf(h.ref.current)
      );
    }, [t.collectionRef, t.itemMap]);
  }
  return [
    { Provider: p, Slot: m, ItemSlot: C },
    F,
    r
  ];
}
var re = X(void 0);
function ce(e) {
  const o = W(re);
  return e || o || "ltr";
}
var N = "rovingFocusGroup.onEntryFocus", se = { bubbles: !1, cancelable: !0 }, _ = "RovingFocusGroup", [O, V, ae] = ne(_), [ie, Ce] = U(
  _,
  [ae]
), [le, ue] = ie(_), Y = P(
  (e, o) => /* @__PURE__ */ d.jsx(O.Provider, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ d.jsx(O.Slot, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ d.jsx(fe, { ...e, ref: o }) }) })
);
Y.displayName = _;
var fe = P((e, o) => {
  const {
    __scopeRovingFocusGroup: i,
    orientation: r,
    loop: w = !1,
    dir: I,
    currentTabStopId: p,
    defaultCurrentTabStopId: v,
    onCurrentTabStopIdChange: A,
    onEntryFocus: m,
    preventScrollOnEntryFocus: s = !1,
    ...b
  } = e, S = L(null), C = D(o, S), F = ce(I), [u, t] = te({
    prop: p,
    defaultProp: v ?? null,
    onChange: A,
    caller: _
  }), [a, f] = K(!1), n = oe(m), c = V(i), E = L(!1), [T, h] = K(0);
  return k(() => {
    const l = S.current;
    if (l)
      return l.addEventListener(N, n), () => l.removeEventListener(N, n);
  }, [n]), /* @__PURE__ */ d.jsx(
    le,
    {
      scope: i,
      orientation: r,
      dir: F,
      loop: w,
      currentTabStopId: u,
      onItemFocus: y(
        (l) => t(l),
        [t]
      ),
      onItemShiftTab: y(() => f(!0), []),
      onFocusableItemAdd: y(
        () => h((l) => l + 1),
        []
      ),
      onFocusableItemRemove: y(
        () => h((l) => l - 1),
        []
      ),
      children: /* @__PURE__ */ d.jsx(
        B.div,
        {
          tabIndex: a || T === 0 ? -1 : 0,
          "data-orientation": r,
          ...b,
          ref: C,
          style: { outline: "none", ...e.style },
          onMouseDown: x(e.onMouseDown, () => {
            E.current = !0;
          }),
          onFocus: x(e.onFocus, (l) => {
            const Z = !E.current;
            if (l.target === l.currentTarget && Z && !a) {
              const j = new CustomEvent(N, se);
              if (l.currentTarget.dispatchEvent(j), !j.defaultPrevented) {
                const M = c().filter((R) => R.focusable), $ = M.find((R) => R.active), J = M.find((R) => R.id === u), Q = [$, J, ...M].filter(
                  Boolean
                ).map((R) => R.ref.current);
                z(Q, s);
              }
            }
            E.current = !1;
          }),
          onBlur: x(e.onBlur, () => f(!1))
        }
      )
    }
  );
}), H = "RovingFocusGroupItem", q = P(
  (e, o) => {
    const {
      __scopeRovingFocusGroup: i,
      focusable: r = !0,
      active: w = !1,
      tabStopId: I,
      children: p,
      ...v
    } = e, A = ee(), m = I || A, s = ue(H, i), b = s.currentTabStopId === m, S = V(i), { onFocusableItemAdd: C, onFocusableItemRemove: F, currentTabStopId: u } = s;
    return k(() => {
      if (r)
        return C(), () => F();
    }, [r, C, F]), /* @__PURE__ */ d.jsx(
      O.ItemSlot,
      {
        scope: i,
        id: m,
        focusable: r,
        active: w,
        children: /* @__PURE__ */ d.jsx(
          B.span,
          {
            tabIndex: b ? 0 : -1,
            "data-orientation": s.orientation,
            ...v,
            ref: o,
            onMouseDown: x(e.onMouseDown, (t) => {
              r ? s.onItemFocus(m) : t.preventDefault();
            }),
            onFocus: x(e.onFocus, () => s.onItemFocus(m)),
            onKeyDown: x(e.onKeyDown, (t) => {
              if (t.key === "Tab" && t.shiftKey) {
                s.onItemShiftTab();
                return;
              }
              if (t.target !== t.currentTarget) return;
              const a = pe(t, s.orientation, s.dir);
              if (a !== void 0) {
                if (t.metaKey || t.ctrlKey || t.altKey || t.shiftKey) return;
                t.preventDefault();
                let n = S().filter((c) => c.focusable).map((c) => c.ref.current);
                if (a === "last") n.reverse();
                else if (a === "prev" || a === "next") {
                  a === "prev" && n.reverse();
                  const c = n.indexOf(t.currentTarget);
                  n = s.loop ? Ie(n, c + 1) : n.slice(c + 1);
                }
                setTimeout(() => z(n));
              }
            }),
            children: typeof p == "function" ? p({ isCurrentTabStop: b, hasTabStop: u != null }) : p
          }
        )
      }
    );
  }
);
q.displayName = H;
var de = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function me(e, o) {
  return o !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function pe(e, o, i) {
  const r = me(e.key, i);
  if (!(o === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(o === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return de[r];
}
function z(e, o = !1) {
  const i = document.activeElement;
  for (const r of e)
    if (r === i || (r.focus({ preventScroll: o }), document.activeElement !== i)) return;
}
function Ie(e, o) {
  return e.map((i, r) => e[(o + r) % e.length]);
}
var Re = Y, ge = q;
export {
  ge as I,
  Re as R,
  Ce as a,
  ne as c,
  ce as u
};
//# sourceMappingURL=index-CMF39cb6.mjs.map

import { x as f, Q as n, a1 as u, n as F, i as G, a7 as z, k as $ } from "./index-BuIZkUhD.mjs";
import { t as h, c as x, i as D, l as B } from "./button-CQCNdxY6.mjs";
import { I as O, E as C, F as H, r as L } from "./skeleton-DrFcKwP3.mjs";
var j = "Toggle", T = f((e, o) => {
  const { pressed: s, defaultPressed: t, onPressedChange: a, ...l } = e, [r, i] = h({
    prop: s,
    onChange: a,
    defaultProp: t ?? !1,
    caller: j
  });
  return /* @__PURE__ */ n.jsx(
    x.button,
    {
      type: "button",
      "aria-pressed": r,
      "data-state": r ? "on" : "off",
      "data-disabled": e.disabled ? "" : void 0,
      ...l,
      ref: o,
      onClick: D(e.onClick, () => {
        e.disabled || i(!r);
      })
    }
  );
});
T.displayName = j;
var y = T, c = "ToggleGroup", [_] = B(c, [
  C
]), I = C(), b = u.forwardRef((e, o) => {
  const { type: s, ...t } = e;
  if (s === "single") {
    const a = t;
    return /* @__PURE__ */ n.jsx(Q, { ...a, ref: o });
  }
  if (s === "multiple") {
    const a = t;
    return /* @__PURE__ */ n.jsx(U, { ...a, ref: o });
  }
  throw new Error(`Missing prop \`type\` expected on \`${c}\``);
});
b.displayName = c;
var [N, R] = _(c), Q = u.forwardRef((e, o) => {
  const {
    value: s,
    defaultValue: t,
    onValueChange: a = () => {
    },
    ...l
  } = e, [r, i] = h({
    prop: s,
    defaultProp: t ?? "",
    onChange: a,
    caller: c
  });
  return /* @__PURE__ */ n.jsx(
    N,
    {
      scope: e.__scopeToggleGroup,
      type: "single",
      value: u.useMemo(() => r ? [r] : [], [r]),
      onItemActivate: i,
      onItemDeactivate: u.useCallback(() => i(""), [i]),
      children: /* @__PURE__ */ n.jsx(k, { ...l, ref: o })
    }
  );
}), U = u.forwardRef((e, o) => {
  const {
    value: s,
    defaultValue: t,
    onValueChange: a = () => {
    },
    ...l
  } = e, [r, i] = h({
    prop: s,
    defaultProp: t ?? [],
    onChange: a,
    caller: c
  }), p = u.useCallback(
    (g) => i((d = []) => [...d, g]),
    [i]
  ), m = u.useCallback(
    (g) => i((d = []) => d.filter((A) => A !== g)),
    [i]
  );
  return /* @__PURE__ */ n.jsx(
    N,
    {
      scope: e.__scopeToggleGroup,
      type: "multiple",
      value: r,
      onItemActivate: p,
      onItemDeactivate: m,
      children: /* @__PURE__ */ n.jsx(k, { ...l, ref: o })
    }
  );
});
b.displayName = c;
var [q, J] = _(c), k = u.forwardRef(
  (e, o) => {
    const {
      __scopeToggleGroup: s,
      disabled: t = !1,
      rovingFocus: a = !0,
      orientation: l,
      dir: r,
      loop: i = !0,
      ...p
    } = e, m = I(s), g = H(r), d = { role: "group", dir: g, ...p };
    return /* @__PURE__ */ n.jsx(q, { scope: s, rovingFocus: a, disabled: t, children: a ? /* @__PURE__ */ n.jsx(
      L,
      {
        asChild: !0,
        ...m,
        orientation: l,
        dir: g,
        loop: i,
        children: /* @__PURE__ */ n.jsx(x.div, { ...d, ref: o })
      }
    ) : /* @__PURE__ */ n.jsx(x.div, { ...d, ref: o }) });
  }
), v = "ToggleGroupItem", V = u.forwardRef(
  (e, o) => {
    const s = R(v, e.__scopeToggleGroup), t = J(v, e.__scopeToggleGroup), a = I(e.__scopeToggleGroup), l = s.value.includes(e.value), r = t.disabled || e.disabled, i = { ...e, pressed: l, disabled: r }, p = u.useRef(null);
    return t.rovingFocus ? /* @__PURE__ */ n.jsx(
      O,
      {
        asChild: !0,
        ...a,
        focusable: !r,
        active: l,
        ref: p,
        children: /* @__PURE__ */ n.jsx(P, { ...i, ref: o })
      }
    ) : /* @__PURE__ */ n.jsx(P, { ...i, ref: o });
  }
);
V.displayName = v;
var P = u.forwardRef(
  (e, o) => {
    const { __scopeToggleGroup: s, value: t, ...a } = e, l = R(v, s), r = { role: "radio", "aria-checked": e.pressed, "aria-pressed": void 0 }, i = l.type === "single" ? r : void 0;
    return /* @__PURE__ */ n.jsx(
      T,
      {
        ...i,
        ...a,
        ref: o,
        onPressedChange: (p) => {
          p ? l.onItemActivate(t) : l.onItemDeactivate(t);
        }
      }
    );
  }
), w = b, E = V;
const M = F(
  "inline-flex items-center justify-center gap-2 rounded-md text-control font-medium text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:ring-1 focus-visible:ring-focus-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-[1.5px]",
  {
    variants: {
      variant: {
        default: "bg-transparent"
      },
      size: {
        default: "h-[calc(var(--control-height)-2px)] min-w-[26px] px-2",
        button: "h-[calc(var(--control-height)-2px)] min-w-[32px] px-3"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), K = f(({ className: e, variant: o, size: s, ...t }, a) => /* @__PURE__ */ n.jsx(
  y,
  {
    ref: a,
    className: G(M({ variant: o, size: s, className: e })),
    ...t
  }
));
K.displayName = y.displayName;
const S = $({
  size: "default",
  variant: "default"
}), W = f(({ className: e, variant: o, size: s, children: t, ...a }, l) => /* @__PURE__ */ n.jsx(
  w,
  {
    ref: l,
    className: G("inline-flex items-center justify-center gap-0.5 bg-muted p-0.5 rounded-md", e),
    ...a,
    children: /* @__PURE__ */ n.jsx(S.Provider, { value: { variant: o, size: s }, children: t })
  }
));
W.displayName = w.displayName;
const X = f(({ className: e, children: o, variant: s, size: t, ...a }, l) => {
  const r = z(S);
  return /* @__PURE__ */ n.jsx(
    E,
    {
      ref: l,
      className: G(
        M({
          variant: r.variant || s,
          size: r.size || t
        }),
        e
      ),
      ...a,
      children: o
    }
  );
});
X.displayName = E.displayName;
export {
  W as T,
  X as a
};
//# sourceMappingURL=toggle-group-B_ubMZvo.mjs.map

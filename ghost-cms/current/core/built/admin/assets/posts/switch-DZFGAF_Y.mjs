import { x as h, am as H, ak as C, Q as o, a9 as M, i as g, n as y } from "./index-BuIZkUhD.mjs";
import { s as P, t as V, c as _, i as A, l as U } from "./button-CQCNdxY6.mjs";
import { u as q } from "./popover-Du2NcggM.mjs";
import { H as L } from "./skeleton-DrFcKwP3.mjs";
var m = "Switch", [O] = U(m), [D, F] = O(m), E = h(
  (t, s) => {
    const {
      __scopeSwitch: e,
      name: a,
      checked: r,
      defaultChecked: b,
      required: c,
      disabled: n,
      value: d = "on",
      onCheckedChange: v,
      form: i,
      ...w
    } = t, [l, u] = H(null), k = P(s, (f) => u(f)), x = C(!1), S = l ? i || !!l.closest("form") : !0, [p, B] = V({
      prop: r,
      defaultProp: b ?? !1,
      onChange: v,
      caller: m
    });
    return /* @__PURE__ */ o.jsxs(D, { scope: e, checked: p, disabled: n, children: [
      /* @__PURE__ */ o.jsx(
        _.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": p,
          "aria-required": c,
          "data-state": T(p),
          "data-disabled": n ? "" : void 0,
          disabled: n,
          value: d,
          ...w,
          ref: k,
          onClick: A(t.onClick, (f) => {
            B((I) => !I), S && (x.current = f.isPropagationStopped(), x.current || f.stopPropagation());
          })
        }
      ),
      S && /* @__PURE__ */ o.jsx(
        R,
        {
          control: l,
          bubbles: !x.current,
          name: a,
          value: d,
          checked: p,
          required: c,
          disabled: n,
          form: i,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
E.displayName = m;
var N = "SwitchThumb", j = h(
  (t, s) => {
    const { __scopeSwitch: e, ...a } = t, r = F(N, e);
    return /* @__PURE__ */ o.jsx(
      _.span,
      {
        "data-state": T(r.checked),
        "data-disabled": r.disabled ? "" : void 0,
        ...a,
        ref: s
      }
    );
  }
);
j.displayName = N;
var Q = "SwitchBubbleInput", R = h(
  ({
    __scopeSwitch: t,
    control: s,
    checked: e,
    bubbles: a = !0,
    ...r
  }, b) => {
    const c = C(null), n = P(c, b), d = q(e), v = L(s);
    return M(() => {
      const i = c.current;
      if (!i) return;
      const w = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(
        w,
        "checked"
      ).set;
      if (d !== e && u) {
        const k = new Event("click", { bubbles: a });
        u.call(i, e), i.dispatchEvent(k);
      }
    }, [d, e, a]), /* @__PURE__ */ o.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": !0,
        defaultChecked: e,
        ...r,
        tabIndex: -1,
        ref: n,
        style: {
          ...r.style,
          ...v,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
R.displayName = Q;
function T(t) {
  return t ? "checked" : "unchecked";
}
var z = E, W = j;
const X = y(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
  {
    variants: {
      size: {
        default: "h-4 w-7",
        sm: "h-3 w-5"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
), $ = y(
  "pointer-events-none block rounded-full bg-background ring-0 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.07))] transition-transform data-[state=unchecked]:translate-x-0",
  {
    variants: {
      size: {
        default: "size-3 data-[state=checked]:translate-x-3",
        sm: "size-2 data-[state=checked]:translate-x-2"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
), G = h(({ className: t, size: s, ...e }, a) => /* @__PURE__ */ o.jsx(
  z,
  {
    className: g(X({ size: s, className: t })),
    ...e,
    ref: a,
    children: /* @__PURE__ */ o.jsx(
      W,
      {
        className: g($({ size: s }))
      }
    )
  }
));
G.displayName = z.displayName;
export {
  G as S
};
//# sourceMappingURL=switch-DZFGAF_Y.mjs.map

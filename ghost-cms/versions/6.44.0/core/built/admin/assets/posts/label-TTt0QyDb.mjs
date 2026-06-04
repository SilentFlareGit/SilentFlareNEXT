import { x as C, Q as n, am as S, ak as _, a9 as B, i as E, n as U } from "./index-BuIZkUhD.mjs";
import { b as X, c as I, t as Q, s as L, i as M, l as V, C as J } from "./button-CQCNdxY6.mjs";
import { u as W } from "./popover-Du2NcggM.mjs";
import { H as Y } from "./skeleton-DrFcKwP3.mjs";
import { P as Z } from "./index-DzWTmJMy.mjs";
var y = "Checkbox", [ee] = V(y), [te, j] = ee(y);
function oe(e) {
  const {
    __scopeCheckbox: r,
    checked: t,
    children: i,
    defaultChecked: a,
    disabled: o,
    form: p,
    name: b,
    onCheckedChange: d,
    required: h,
    value: m = "on",
    // @ts-expect-error
    internal_do_not_use_render: l
  } = e, [u, v] = Q({
    prop: t,
    defaultProp: a ?? !1,
    onChange: d,
    caller: y
  }), [k, x] = S(null), [g, s] = S(null), c = _(!1), N = k ? !!p || !!k.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    !0
  ), P = {
    checked: u,
    disabled: o,
    setChecked: v,
    control: k,
    setControl: x,
    name: b,
    form: p,
    value: m,
    hasConsumerStoppedPropagationRef: c,
    required: h,
    defaultChecked: f(a) ? !1 : a,
    isFormControl: N,
    bubbleInput: g,
    setBubbleInput: s
  };
  return /* @__PURE__ */ n.jsx(
    te,
    {
      scope: r,
      ...P,
      children: re(l) ? l(P) : i
    }
  );
}
var D = "CheckboxTrigger", A = C(
  ({ __scopeCheckbox: e, onKeyDown: r, onClick: t, ...i }, a) => {
    const {
      control: o,
      value: p,
      disabled: b,
      checked: d,
      required: h,
      setControl: m,
      setChecked: l,
      hasConsumerStoppedPropagationRef: u,
      isFormControl: v,
      bubbleInput: k
    } = j(D, e), x = L(a, m), g = _(d);
    return B(() => {
      const s = o?.form;
      if (s) {
        const c = () => l(g.current);
        return s.addEventListener("reset", c), () => s.removeEventListener("reset", c);
      }
    }, [o, l]), /* @__PURE__ */ n.jsx(
      I.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": f(d) ? "mixed" : d,
        "aria-required": h,
        "data-state": O(d),
        "data-disabled": b ? "" : void 0,
        disabled: b,
        value: p,
        ...i,
        ref: x,
        onKeyDown: M(r, (s) => {
          s.key === "Enter" && s.preventDefault();
        }),
        onClick: M(t, (s) => {
          l((c) => f(c) ? !0 : !c), k && v && (u.current = s.isPropagationStopped(), u.current || s.stopPropagation());
        })
      }
    );
  }
);
A.displayName = D;
var R = C(
  (e, r) => {
    const {
      __scopeCheckbox: t,
      name: i,
      checked: a,
      defaultChecked: o,
      required: p,
      disabled: b,
      value: d,
      onCheckedChange: h,
      form: m,
      ...l
    } = e;
    return /* @__PURE__ */ n.jsx(
      oe,
      {
        __scopeCheckbox: t,
        checked: a,
        defaultChecked: o,
        disabled: b,
        required: p,
        onCheckedChange: h,
        name: i,
        form: m,
        value: d,
        internal_do_not_use_render: ({ isFormControl: u }) => /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
          /* @__PURE__ */ n.jsx(
            A,
            {
              ...l,
              ref: r,
              __scopeCheckbox: t
            }
          ),
          u && /* @__PURE__ */ n.jsx(
            H,
            {
              __scopeCheckbox: t
            }
          )
        ] })
      }
    );
  }
);
R.displayName = y;
var T = "CheckboxIndicator", q = C(
  (e, r) => {
    const { __scopeCheckbox: t, forceMount: i, ...a } = e, o = j(T, t);
    return /* @__PURE__ */ n.jsx(
      X,
      {
        present: i || f(o.checked) || o.checked === !0,
        children: /* @__PURE__ */ n.jsx(
          I.span,
          {
            "data-state": O(o.checked),
            "data-disabled": o.disabled ? "" : void 0,
            ...a,
            ref: r,
            style: { pointerEvents: "none", ...e.style }
          }
        )
      }
    );
  }
);
q.displayName = T;
var F = "CheckboxBubbleInput", H = C(
  ({ __scopeCheckbox: e, ...r }, t) => {
    const {
      control: i,
      hasConsumerStoppedPropagationRef: a,
      checked: o,
      defaultChecked: p,
      required: b,
      disabled: d,
      name: h,
      value: m,
      form: l,
      bubbleInput: u,
      setBubbleInput: v
    } = j(F, e), k = L(t, v), x = W(o), g = Y(i);
    B(() => {
      const c = u;
      if (!c) return;
      const N = window.HTMLInputElement.prototype, w = Object.getOwnPropertyDescriptor(
        N,
        "checked"
      ).set, G = !a.current;
      if (x !== o && w) {
        const K = new Event("click", { bubbles: G });
        c.indeterminate = f(o), w.call(c, f(o) ? !1 : o), c.dispatchEvent(K);
      }
    }, [u, x, o, a]);
    const s = _(f(o) ? !1 : o);
    return /* @__PURE__ */ n.jsx(
      I.input,
      {
        type: "checkbox",
        "aria-hidden": !0,
        defaultChecked: p ?? s.current,
        required: b,
        disabled: d,
        name: h,
        value: m,
        form: l,
        ...r,
        tabIndex: -1,
        ref: k,
        style: {
          ...r.style,
          ...g,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
H.displayName = F;
function re(e) {
  return typeof e == "function";
}
function f(e) {
  return e === "indeterminate";
}
function O(e) {
  return f(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
const ne = C(({ className: e, ...r }, t) => /* @__PURE__ */ n.jsx(
  R,
  {
    ref: t,
    className: E(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-xs border border-primary shadow focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      e
    ),
    ...r,
    children: /* @__PURE__ */ n.jsx(
      q,
      {
        className: E("grid place-content-center text-current"),
        children: /* @__PURE__ */ n.jsx(J, { className: "size-4" })
      }
    )
  }
));
ne.displayName = R.displayName;
var se = "Label", z = C((e, r) => /* @__PURE__ */ n.jsx(
  Z.label,
  {
    ...e,
    ref: r,
    onMouseDown: (t) => {
      t.target.closest("button, input, select, textarea") || (e.onMouseDown?.(t), !t.defaultPrevented && t.detail > 1 && t.preventDefault());
    }
  }
));
z.displayName = se;
var $ = z;
const ae = U(
  "text-control leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
), ce = C(({ className: e, ...r }, t) => /* @__PURE__ */ n.jsx(
  $,
  {
    ref: t,
    className: E(ae(), e),
    ...r
  }
));
ce.displayName = $.displayName;
export {
  ne as C,
  ce as L
};
//# sourceMappingURL=label-TTt0QyDb.mjs.map

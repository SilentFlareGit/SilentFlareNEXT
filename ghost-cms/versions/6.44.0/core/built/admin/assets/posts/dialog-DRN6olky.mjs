import { ak as g, Q as n, a6 as Y, x as i, C as Z, a9 as h, S as J, i as p } from "./index-BuIZkUhD.mjs";
import { t as X, w as y, s as _, c as D, i as m, b as P, P as ee, l as te, r as oe, R as ae, v as ne, F as se, D as re, n as ie, k as le } from "./button-CQCNdxY6.mjs";
var v = "Dialog", [O, Re] = te(v), [ce, d] = O(v), R = (e) => {
  const {
    __scopeDialog: t,
    children: o,
    open: s,
    defaultOpen: r,
    onOpenChange: a,
    modal: c = !0
  } = e, l = g(null), f = g(null), [C, N] = X({
    prop: s,
    defaultProp: r ?? !1,
    onChange: a,
    caller: v
  });
  return /* @__PURE__ */ n.jsx(
    ce,
    {
      scope: t,
      triggerRef: l,
      contentRef: f,
      contentId: y(),
      titleId: y(),
      descriptionId: y(),
      open: C,
      onOpenChange: N,
      onOpenToggle: Y(() => N((U) => !U), [N]),
      modal: c,
      children: o
    }
  );
};
R.displayName = v;
var I = "DialogTrigger", A = i(
  (e, t) => {
    const { __scopeDialog: o, ...s } = e, r = d(I, o), a = _(t, r.triggerRef);
    return /* @__PURE__ */ n.jsx(
      D.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": r.open,
        "aria-controls": r.contentId,
        "data-state": j(r.open),
        ...s,
        ref: a,
        onClick: m(e.onClick, r.onOpenToggle)
      }
    );
  }
);
A.displayName = I;
var E = "DialogPortal", [de, T] = O(E, {
  forceMount: void 0
}), M = (e) => {
  const { __scopeDialog: t, forceMount: o, children: s, container: r } = e, a = d(E, t);
  return /* @__PURE__ */ n.jsx(de, { scope: t, forceMount: o, children: Z.map(s, (c) => /* @__PURE__ */ n.jsx(P, { present: o || a.open, children: /* @__PURE__ */ n.jsx(ee, { asChild: !0, container: r, children: c }) })) });
};
M.displayName = E;
var x = "DialogOverlay", S = i(
  (e, t) => {
    const o = T(x, e.__scopeDialog), { forceMount: s = o.forceMount, ...r } = e, a = d(x, e.__scopeDialog);
    return a.modal ? /* @__PURE__ */ n.jsx(P, { present: s || a.open, children: /* @__PURE__ */ n.jsx(ge, { ...r, ref: t }) }) : null;
  }
);
S.displayName = x;
var ue = ie("DialogOverlay.RemoveScroll"), ge = i(
  (e, t) => {
    const { __scopeDialog: o, ...s } = e, r = d(x, o);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ n.jsx(ae, { as: ue, allowPinchZoom: !0, shards: [r.contentRef], children: /* @__PURE__ */ n.jsx(
        D.div,
        {
          "data-state": j(r.open),
          ...s,
          ref: t,
          style: { pointerEvents: "auto", ...s.style }
        }
      ) })
    );
  }
), u = "DialogContent", F = i(
  (e, t) => {
    const o = T(u, e.__scopeDialog), { forceMount: s = o.forceMount, ...r } = e, a = d(u, e.__scopeDialog);
    return /* @__PURE__ */ n.jsx(P, { present: s || a.open, children: a.modal ? /* @__PURE__ */ n.jsx(pe, { ...r, ref: t }) : /* @__PURE__ */ n.jsx(fe, { ...r, ref: t }) });
  }
);
F.displayName = u;
var pe = i(
  (e, t) => {
    const o = d(u, e.__scopeDialog), s = g(null), r = _(t, o.contentRef, s);
    return h(() => {
      const a = s.current;
      if (a) return oe(a);
    }, []), /* @__PURE__ */ n.jsx(
      w,
      {
        ...e,
        ref: r,
        trapFocus: o.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: m(e.onCloseAutoFocus, (a) => {
          a.preventDefault(), o.triggerRef.current?.focus();
        }),
        onPointerDownOutside: m(e.onPointerDownOutside, (a) => {
          const c = a.detail.originalEvent, l = c.button === 0 && c.ctrlKey === !0;
          (c.button === 2 || l) && a.preventDefault();
        }),
        onFocusOutside: m(
          e.onFocusOutside,
          (a) => a.preventDefault()
        )
      }
    );
  }
), fe = i(
  (e, t) => {
    const o = d(u, e.__scopeDialog), s = g(!1), r = g(!1);
    return /* @__PURE__ */ n.jsx(
      w,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (a) => {
          e.onCloseAutoFocus?.(a), a.defaultPrevented || (s.current || o.triggerRef.current?.focus(), a.preventDefault()), s.current = !1, r.current = !1;
        },
        onInteractOutside: (a) => {
          e.onInteractOutside?.(a), a.defaultPrevented || (s.current = !0, a.detail.originalEvent.type === "pointerdown" && (r.current = !0));
          const c = a.target;
          o.triggerRef.current?.contains(c) && a.preventDefault(), a.detail.originalEvent.type === "focusin" && r.current && a.preventDefault();
        }
      }
    );
  }
), w = i(
  (e, t) => {
    const { __scopeDialog: o, trapFocus: s, onOpenAutoFocus: r, onCloseAutoFocus: a, ...c } = e, l = d(u, o), f = g(null), C = _(t, f);
    return ne(), /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
      /* @__PURE__ */ n.jsx(
        se,
        {
          asChild: !0,
          loop: !0,
          trapped: s,
          onMountAutoFocus: r,
          onUnmountAutoFocus: a,
          children: /* @__PURE__ */ n.jsx(
            re,
            {
              role: "dialog",
              id: l.contentId,
              "aria-describedby": l.descriptionId,
              "aria-labelledby": l.titleId,
              "data-state": j(l.open),
              ...c,
              ref: C,
              onDismiss: () => l.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
        /* @__PURE__ */ n.jsx(me, { titleId: l.titleId }),
        /* @__PURE__ */ n.jsx(xe, { contentRef: f, descriptionId: l.descriptionId })
      ] })
    ] });
  }
), b = "DialogTitle", k = i(
  (e, t) => {
    const { __scopeDialog: o, ...s } = e, r = d(b, o);
    return /* @__PURE__ */ n.jsx(D.h2, { id: r.titleId, ...s, ref: t });
  }
);
k.displayName = b;
var W = "DialogDescription", $ = i(
  (e, t) => {
    const { __scopeDialog: o, ...s } = e, r = d(W, o);
    return /* @__PURE__ */ n.jsx(D.p, { id: r.descriptionId, ...s, ref: t });
  }
);
$.displayName = W;
var G = "DialogClose", L = i(
  (e, t) => {
    const { __scopeDialog: o, ...s } = e, r = d(G, o);
    return /* @__PURE__ */ n.jsx(
      D.button,
      {
        type: "button",
        ...s,
        ref: t,
        onClick: m(e.onClick, () => r.onOpenChange(!1))
      }
    );
  }
);
L.displayName = G;
function j(e) {
  return e ? "open" : "closed";
}
var H = "DialogTitleWarning", [Ie, z] = le(H, {
  contentName: u,
  titleName: b,
  docsSlug: "dialog"
}), me = ({ titleId: e }) => {
  const t = z(H), o = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
  return h(() => {
    e && (document.getElementById(e) || console.error(o));
  }, [o, e]), null;
}, De = "DialogDescriptionWarning", xe = ({ contentRef: e, descriptionId: t }) => {
  const s = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${z(De).contentName}}.`;
  return h(() => {
    const r = e.current?.getAttribute("aria-describedby");
    t && r && (document.getElementById(t) || console.warn(s));
  }, [s, e, t]), null;
}, ve = R, Ce = A, Ne = M, B = S, V = F, q = k, K = $, Ae = L;
const Te = ve, Me = Ce, ye = Ne, Q = i(({ className: e, ...t }, o) => /* @__PURE__ */ n.jsx(
  B,
  {
    ref: o,
    className: p(
      "fixed inset-0 z-50 bg-black/30 dark:bg-white/8 backdrop-blur-none transform-gpu data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:backdrop-blur-[3px]",
      e
    ),
    ...t
  }
));
Q.displayName = B.displayName;
const he = i(({ className: e, children: t, ...o }, s) => /* @__PURE__ */ n.jsx(ye, { children: /* @__PURE__ */ n.jsxs("div", { className: J, children: [
  /* @__PURE__ */ n.jsx(Q, {}),
  /* @__PURE__ */ n.jsx(
    V,
    {
      ref: s,
      className: p(
        "fixed left-[50%] top-[8vmin] z-50 grid w-full max-w-lg translate-x-[-50%] gap-6 bg-popover p-6 shadow-lg duration-200 transform-gpu data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg outline-hidden",
        e
      ),
      ...o,
      children: t
    }
  )
] }) }));
he.displayName = V.displayName;
const _e = ({
  className: e,
  ...t
}) => /* @__PURE__ */ n.jsx(
  "div",
  {
    className: p(
      "flex flex-col gap-y-1.5 text-center sm:text-left",
      e
    ),
    ...t
  }
);
_e.displayName = "DialogHeader";
const Pe = ({
  className: e,
  ...t
}) => /* @__PURE__ */ n.jsx(
  "div",
  {
    className: p(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2 sm:items-end [&_button]:min-w-20",
      e
    ),
    ...t
  }
);
Pe.displayName = "DialogFooter";
const Ee = i(({ className: e, ...t }, o) => /* @__PURE__ */ n.jsx(
  q,
  {
    ref: o,
    className: p(
      "text-xl font-semibold leading-none tracking-tight",
      e
    ),
    ...t
  }
));
Ee.displayName = q.displayName;
const be = i(({ className: e, ...t }, o) => /* @__PURE__ */ n.jsx(
  K,
  {
    ref: o,
    className: p("text-sm text-muted-foreground", e),
    ...t
  }
));
be.displayName = K.displayName;
export {
  Ae as C,
  K as D,
  B as O,
  Ne as P,
  ve as R,
  q as T,
  Ie as W,
  V as a,
  Te as b,
  he as c,
  be as d,
  Pe as e,
  _e as f,
  Ee as g,
  Me as h,
  Ce as i,
  Re as j
};
//# sourceMappingURL=dialog-DRN6olky.mjs.map

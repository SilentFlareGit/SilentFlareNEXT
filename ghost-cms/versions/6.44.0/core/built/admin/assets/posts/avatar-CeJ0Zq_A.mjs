import { k as y, af as A, Q as u, a7 as T, x as f, am as g, a9 as N, ak as z, a0 as B, i as p } from "./index-BuIZkUhD.mjs";
import { u as U, x as S } from "./button-CQCNdxY6.mjs";
import { P as b } from "./index-DzWTmJMy.mjs";
import { s as V } from "./hooks-D4pJ_p_P.mjs";
import { g as W, b as q } from "./app-utils-CD0bhOLs.mjs";
import { U as G } from "./get-site-timezone-JepxGwVr.mjs";
function K(e, a = []) {
  let r = [];
  function o(t, c) {
    const s = y(c);
    s.displayName = t + "Context";
    const i = r.length;
    r = [...r, c];
    const l = (m) => {
      const { scope: x, children: h, ...v } = m, F = x?.[e]?.[i] || s, H = A(() => v, Object.values(v));
      return /* @__PURE__ */ u.jsx(F.Provider, { value: H, children: h });
    };
    l.displayName = t + "Provider";
    function d(m, x) {
      const h = x?.[e]?.[i] || s, v = T(h);
      if (v) return v;
      if (c !== void 0) return c;
      throw new Error(`\`${m}\` must be used within \`${t}\``);
    }
    return [l, d];
  }
  const n = () => {
    const t = r.map((c) => y(c));
    return function(s) {
      const i = s?.[e] || t;
      return A(
        () => ({ [`__scope${e}`]: { ...s, [e]: i } }),
        [s, i]
      );
    };
  };
  return n.scopeName = e, [o, Q(n, ...a)];
}
function Q(...e) {
  const a = e[0];
  if (e.length === 1) return a;
  const r = () => {
    const o = e.map((n) => ({
      useScope: n(),
      scopeName: n.scopeName
    }));
    return function(t) {
      const c = o.reduce((s, { useScope: i, scopeName: l }) => {
        const m = i(t)[`__scope${l}`];
        return { ...s, ...m };
      }, {});
      return A(() => ({ [`__scope${a.scopeName}`]: c }), [c]);
    };
  };
  return r.scopeName = a.scopeName, r;
}
function D() {
  return V.useSyncExternalStore(
    J,
    () => !0,
    () => !1
  );
}
function J() {
  return () => {
  };
}
var L = "Avatar", [O] = K(L), [X, _] = O(L), j = f(
  (e, a) => {
    const { __scopeAvatar: r, ...o } = e, [n, t] = g("idle");
    return /* @__PURE__ */ u.jsx(
      X,
      {
        scope: r,
        imageLoadingStatus: n,
        onImageLoadingStatusChange: t,
        children: /* @__PURE__ */ u.jsx(b.span, { ...o, ref: a })
      }
    );
  }
);
j.displayName = L;
var w = "AvatarImage", E = f(
  (e, a) => {
    const { __scopeAvatar: r, src: o, onLoadingStatusChange: n = () => {
    }, ...t } = e, c = _(w, r), s = Y(o, t), i = U((l) => {
      n(l), c.onImageLoadingStatusChange(l);
    });
    return S(() => {
      s !== "idle" && i(s);
    }, [s, i]), s === "loaded" ? /* @__PURE__ */ u.jsx(b.img, { ...t, ref: a, src: o }) : null;
  }
);
E.displayName = w;
var I = "AvatarFallback", k = f(
  (e, a) => {
    const { __scopeAvatar: r, delayMs: o, ...n } = e, t = _(I, r), [c, s] = g(o === void 0);
    return N(() => {
      if (o !== void 0) {
        const i = window.setTimeout(() => s(!0), o);
        return () => window.clearTimeout(i);
      }
    }, [o]), c && t.imageLoadingStatus !== "loaded" ? /* @__PURE__ */ u.jsx(b.span, { ...n, ref: a }) : null;
  }
);
k.displayName = I;
function C(e, a) {
  return e ? a ? (e.src !== a && (e.src = a), e.complete && e.naturalWidth > 0 ? "loaded" : "loading") : "error" : "idle";
}
function Y(e, { referrerPolicy: a, crossOrigin: r }) {
  const o = D(), n = z(null), t = o ? (n.current || (n.current = new window.Image()), n.current) : null, [c, s] = g(
    () => C(t, e)
  );
  return S(() => {
    s(C(t, e));
  }, [t, e]), S(() => {
    const i = (m) => () => {
      s(m);
    };
    if (!t) return;
    const l = i("loaded"), d = i("error");
    return t.addEventListener("load", l), t.addEventListener("error", d), a && (t.referrerPolicy = a), typeof r == "string" && (t.crossOrigin = r), () => {
      t.removeEventListener("load", l), t.removeEventListener("error", d);
    };
  }, [t, r, a]), c;
}
var P = j, R = E, M = k;
const Z = f(({ className: e, ...a }, r) => /* @__PURE__ */ u.jsx(
  R,
  {
    ref: r,
    className: p("aspect-square h-full w-full", e),
    ...a
  }
));
Z.displayName = R.displayName;
const $ = f(({ className: e, ...a }, r) => /* @__PURE__ */ u.jsx(
  M,
  {
    ref: r,
    className: p(
      "flex h-full w-full items-center justify-center rounded-full bg-muted [&_svg]:size-4",
      e
    ),
    ...a
  }
));
$.displayName = M.displayName;
function ee({ src: e }) {
  const [a, r] = g(!1);
  return N(() => {
    r(!1);
  }, [e]), /* @__PURE__ */ u.jsx(
    "img",
    {
      alt: "",
      className: p(
        "absolute inset-0 h-full w-full object-cover",
        !a && "invisible"
      ),
      src: e,
      onLoad: (o) => {
        const { naturalWidth: n, naturalHeight: t } = o.currentTarget;
        n > 1 && t > 1 && r(!0);
      }
    }
  );
}
const te = f(({ className: e, children: a, src: r, name: o, email: n, ...t }, c) => {
  const s = { name: o || void 0, email: n || void 0 }, i = !!(o || n), l = i ? W(s) : null, d = i ? B(q(s), "75", "55") : void 0;
  return /* @__PURE__ */ u.jsx(
    P,
    {
      ref: c,
      className: p(
        "relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full",
        e
      ),
      ...t,
      children: a ?? /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
        /* @__PURE__ */ u.jsx(
          $,
          {
            className: p(
              "text-xs text-muted-foreground md:text-sm [&_svg]:size-3 md:[&_svg]:size-4",
              i && "font-semibold text-white"
            ),
            style: i ? { backgroundColor: d } : void 0,
            children: l ?? /* @__PURE__ */ u.jsx(G, {})
          }
        ),
        r && /* @__PURE__ */ u.jsx(ee, { src: r })
      ] })
    }
  );
});
te.displayName = P.displayName;
export {
  te as A,
  $ as a
};
//# sourceMappingURL=avatar-CeJ0Zq_A.mjs.map

import { a9 as J, ak as U, am as te, a6 as ne, af as he, x as ce, Q as u, i as oe, n as hn, S as os, _ as Vc, z as Fc, a1 as _e, T as ue, m as Wc, a7 as jt, k as ao, ad as Yc, aa as Xc, c as Zc, u as gt, L as Uc, ah as Gc, a5 as qc } from "./index-BuIZkUhD.mjs";
import { M as co } from "./mail-Bi1gt3MU.mjs";
import { C as lo, S as Kc, Z as rs, M as ss, a as Qc, T as is, P as Jc } from "./zap-BPDyHF1u.mjs";
import { a as Re, c as Vo, b as Fo, d as el, i as An, A as tl } from "./value-DhEK7_uT.mjs";
import { f as uo, a as Wo, g as fo, d as nl, r as ol, u as rl, J as as, h as sl } from "./hooks-D4pJ_p_P.mjs";
import { P as cs, b as ls, a as us } from "./popover-Du2NcggM.mjs";
import { b as ds, T as fs, c as hs, a as ps, C as il, E as al } from "./tooltip-D1X0uVas.mjs";
import { P as yt } from "./plus-DW3bG6ui.mjs";
import { L as He } from "./loading-indicator-BsY7eGY6.mjs";
import { u as ho, a as pn, g as gn, i as po, h as gs, s as cl } from "./settings-DJqx19W1.mjs";
import { u as ll } from "./site-Bxv-L5Dn.mjs";
import { u as ul } from "./posts-CYjfxmgX.mjs";
import { m as dl, v as fl, f as hl, k as pl, d as gl, j as ml, M as Yn, r as xl, b as yl, u as Yo, i as wl, a as vl, A as bl, l as _l, h as El } from "./automations-BmGKngyG.mjs";
import { B as fe, u as Nl, c as Sl, i as lt, l as Cl, C as ms } from "./button-CQCNdxY6.mjs";
import { I as mn } from "./input-DUvSHOFz.mjs";
import { A as Ft, c as Wt, f as Yt, g as Xt, d as Zt, e as Ut, b as Gt } from "./alert-dialog-mmQvJUHQ.mjs";
import { b as Ml, c as jl, g as kl } from "./dialog-DRN6olky.mjs";
import { T as Il, b as Pl, c as Xo } from "./tabs-1fkhM4p8.mjs";
import { X as Al } from "./x-Cl72IwQm.mjs";
import { L as Xn, C as Zo } from "./label-TTt0QyDb.mjs";
import { t as Dl, a as Tl, z as xs, P as zl, g as $l, S as Ll, o as Rl, G as Ol, L as Hl, C as Bl, R as Vl, q as Fl, p as Wl, c as Yl, x as Xl, w as Zl, d as Ul, e as Gl, D as ys, n as ws, i as vs, k as Zn, m as ql, l as Kl, u as Ql } from "./skeleton-DrFcKwP3.mjs";
import { a as Uo } from "./input-surface-CO8-j6V2.mjs";
import { S as Jl, e as eu } from "./select-FX6QYAFU.mjs";
import { P as bs } from "./pencil-DDnfXQqn.mjs";
import { E as tu } from "./ellipsis-BIs4PL5-.mjs";
function nu(e) {
  J(() => {
    if (!e)
      return;
    const t = (n) => {
      n.preventDefault(), n.returnValue = "";
    };
    return window.addEventListener("beforeunload", t), () => {
      window.removeEventListener("beforeunload", t);
    };
  }, [e]);
}
const Go = (e = [], t, n) => !e || !n ? e : e.filter((o) => o[t]?.toLowerCase().includes(n.toLowerCase())), ou = (e) => "'" + e.replace(/'/g, "\\'") + "'", qo = ({ path: e, filterKey: t, responseKey: n, limit: o = 20 }) => {
  const r = uo(), s = U({}), i = async (l) => {
    if ((s.current.allLoaded || s.current.lastInput === l) && s.current.data)
      return Go(s.current.data, t, l);
    const c = await r(Wo(e, {
      filter: l ? `${t}:~${ou(l)}` : "",
      limit: o.toString()
    }));
    return s.current.data = c[n], s.current.allLoaded = !l && !c.meta?.pagination.next, s.current.lastInput = l, Go(c[n], t, l);
  };
  return {
    loadData: i,
    loadInitialValues: async (l, c) => {
      await i("");
      const f = [...s.current.data || []], d = l.filter((h) => !s.current.data?.find((g) => g[c] === h));
      if (d.length) {
        const h = await r(Wo(e, {
          filter: `${c}:[${d.join(",")}]`,
          limit: "100"
        }));
        f.push(...h[n]);
      }
      return l.map((h) => f.find((g) => g[c] === h));
    }
  };
}, ft = {
  image: {
    mimeTypes: ["image/gif", "image/jpg", "image/jpeg", "image/png", "image/svg+xml", "image/webp"],
    extensions: ["gif", "jpg", "jpeg", "png", "svg", "svgz", "webp"],
    endpoint: "/images/upload/",
    requestMethod: "post",
    resourceName: "images"
  },
  video: {
    mimeTypes: ["video/mp4", "video/webm", "video/ogg"],
    extensions: ["mp4", "webm", "ogv"],
    endpoint: "/media/upload/",
    requestMethod: "post",
    resourceName: "media"
  },
  audio: {
    mimeTypes: ["audio/mp3", "audio/mpeg", "audio/ogg", "audio/wav", "audio/vnd.wav", "audio/wave", "audio/x-wav", "audio/mp4", "audio/x-m4a"],
    extensions: ["mp3", "wav", "ogg", "m4a"],
    endpoint: "/media/upload/",
    requestMethod: "post",
    resourceName: "media"
  },
  mediaThumbnail: {
    mimeTypes: ["image/gif", "image/jpg", "image/jpeg", "image/png", "image/webp"],
    extensions: ["gif", "jpg", "jpeg", "png", "webp"],
    endpoint: "/media/thumbnail/upload/",
    requestMethod: "put",
    resourceName: "media"
  },
  file: {
    extensions: [],
    endpoint: "/files/upload/",
    requestMethod: "post",
    resourceName: "files"
  }
}, Dn = (e, t) => {
  let n = e;
  for (const o of t)
    if (n && typeof n == "object" && o in n)
      n = n[o];
    else
      return null;
  return typeof n == "string" ? n : null;
}, ru = (e = "image") => {
  const [t, n] = te(0), [o, r] = te(!1), [s, i] = te([]), [a, l] = te(0), c = U(/* @__PURE__ */ new Map()), f = uo();
  function d() {
    if (c.current.size === 0) {
      n(0);
      return;
    }
    let x = 0;
    c.current.forEach((y) => {
      x += y;
    }), n(Math.round(x / c.current.size));
  }
  const h = (x) => {
    if (e === "file")
      return !0;
    const y = ft[e].extensions, [, _] = /(?:\.([^.]+))?$/.exec(x.name) ?? [];
    return y && (!_ || y.indexOf(_.toLowerCase()) === -1) ? `The file type you uploaded is not supported. Please use ${`.${y.join(", .").toUpperCase()}`}` : !0;
  }, g = (x = []) => {
    const y = [];
    for (let _ = 0; _ < x.length; _ += 1) {
      const m = x[_], w = h(m);
      w !== !0 && y.push({ fileName: m.name, message: w });
    }
    return y;
  }, p = async (x, { formData: y = {} } = {}) => {
    c.current.set(x, 0);
    const _ = new FormData();
    _.append("file", x, x.name), Object.keys(y).forEach((w) => {
      _.append(w, y[w]);
    });
    const m = `${fo().apiRoot}${ft[e].endpoint}`;
    try {
      const w = await f(m, {
        method: ft[e].requestMethod,
        body: _,
        onUploadProgress(E) {
          c.current.set(x, E), d();
        }
      });
      c.current.set(x, 100), d();
      let S;
      if (w) {
        const E = w[ft[e].resourceName];
        E && Array.isArray(E) && E[0] && (S = E[0].url);
      }
      return {
        url: S,
        fileName: x.name
      };
    } catch (w) {
      throw console.error(w), {
        message: Dn(w, ["data", "errors", 0, "message"]) || Dn(w, ["message"]) || "",
        context: Dn(w, ["data", "errors", 0, "context"]) || "",
        fileName: x.name
      };
    }
  };
  return { progress: t, isLoading: o, upload: async (x = [], y = {}) => {
    l(x.length), r(!0);
    const _ = g(x);
    if (_.length)
      return i(_), r(!1), n(100), null;
    const m = [];
    for (let w = 0; w < x.length; w += 1) {
      const S = x[w];
      m.push(p(S, y));
    }
    try {
      const w = await Promise.all(m);
      return n(100), c.current.clear(), r(!1), i([]), w;
    } catch (w) {
      return console.error(w), i((S) => [...S, w]), r(!1), n(100), c.current.clear(), null;
    }
  }, errors: s, filesNumber: a };
}, su = () => {
  const e = uo();
  return ne(async (t, { type: n } = {}) => {
    const o = new URL(`${fo().apiRoot}/oembed/`, window.location.origin);
    return o.searchParams.set("url", t), n && o.searchParams.set("type", n), await e(o);
  }, [e]);
}, iu = "OffersResponseType", au = nl({
  dataType: iu,
  path: "/offers/",
  // offers endpoint doesn't support limit or pagination so we exclude the default ?limit=20
  defaultSearchParams: {}
}), cu = ({
  siteUrl: e,
  membersSignupAccess: t,
  donationsEnabled: n,
  recommendationsEnabled: o
}) => {
  const { data: r } = au(), { data: s } = ul({
    searchParams: {
      filter: "status:published",
      fields: "id,url,title,visibility,published_at",
      order: "published_at desc",
      limit: "5"
    }
  }), i = qo({
    path: "/search-index/posts/",
    filterKey: "title",
    responseKey: "posts"
  }), a = qo({
    path: "/search-index/pages/",
    filterKey: "title",
    responseKey: "pages"
  }), l = he(() => [{
    label: "Latest posts",
    items: (s?.posts || []).map((g) => ({
      id: g.id,
      title: g.title,
      url: g.url,
      visibility: g.visibility,
      publishedAt: g.published_at
    }))
  }], [s?.posts]), c = ne(async () => {
    const d = [
      { label: "Homepage", value: e },
      { label: "Free signup", value: "#/portal/signup/free" }
    ], h = t === "all" ? [
      { label: "Paid signup", value: "#/portal/signup" },
      { label: "Upgrade or change plan", value: "#/portal/account/plans" }
    ] : [], g = n ? [{ label: "Tips and donations", value: "#/portal/support" }] : [], p = o ? [{ label: "Recommendations", value: "#/portal/recommendations" }] : [], v = (r?.offers || []).filter((x) => x.status === "active" && x.redemption_type === "signup").map((x) => ({
      label: `Offer - ${x.name}`,
      value: new URL(x.code, e).toString()
    }));
    return [...d, ...h, ...g, ...p, ...v];
  }, [n, t, r?.offers, o, e]), f = ne(async (d) => {
    if (!d)
      return l;
    const [h, g] = await Promise.all([
      i.loadData(d),
      a.loadData(d)
    ]);
    return [
      {
        label: "Posts",
        items: h.filter((p) => p.status === "published").map((p) => ({
          id: p.id,
          title: p.title,
          url: p.url,
          visibility: p.visibility,
          publishedAt: p.published_at
        }))
      },
      {
        label: "Pages",
        items: g.filter((p) => p.status === "published").map((p) => ({
          id: p.id,
          title: p.title,
          url: p.url,
          visibility: p.visibility,
          publishedAt: p.published_at
        }))
      }
    ].filter((p) => p.items.length > 0);
  }, [l, a, i]);
  return {
    fetchAutocompleteLinks: c,
    searchLinks: f
  };
};
function lu(e, t) {
  const n = e.editorInstance.getRootElement();
  if (!n)
    return;
  const { bottom: o } = n.getBoundingClientRect();
  t.pageY > o && t.clientY > o && (t.preventDefault(), e.lastNodeIsDecorator() && e.insertParagraphAtBottom(), e.focusEditor({ position: "bottom" }));
}
const uu = hn(
  "relative block rounded-lg transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border border-border-default bg-surface-panel shadow-sm hover:shadow-md",
        gradient: [
          "cursor-pointer bg-surface-elevated",
          "shadow-[-7px_-6px_42px_8px_rgb(75_225_226_/_28%),7px_6px_42px_8px_rgb(202_103_255_/_32%)]",
          "dark:shadow-[-7px_-6px_42px_8px_rgb(75_225_226_/_36%),7px_6px_42px_8px_rgb(202_103_255_/_38%)]",
          "hover:shadow-[-7px_-4px_42px_10px_rgb(75_225_226_/_38%),7px_8px_42px_10px_rgb(202_103_255_/_42%)]",
          "dark:hover:shadow-[-7px_-4px_42px_10px_rgb(75_225_226_/_50%),7px_8px_42px_10px_rgb(202_103_255_/_52%)]",
          "hover:translate-y-[-2px] hover:scale-[1.01]"
        ],
        info: "border border-state-info/40 bg-state-info/10",
        success: "border border-state-success/40 bg-state-success/10",
        warning: "border border-state-warning/40 bg-state-warning/10",
        destructive: "bg-surface-panel shadow-sm"
      },
      size: {
        sm: "p-2 text-sm",
        md: "p-3",
        lg: "p-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
), _s = ce(
  (e, t) => {
    const {
      variant: n,
      size: o,
      dismissible: r = !1,
      onDismiss: s,
      role: i = "status",
      className: a,
      children: l,
      ...c
    } = e, f = (d) => {
      d.preventDefault(), d.stopPropagation(), r && s && s();
    };
    return /* @__PURE__ */ u.jsxs(
      "div",
      {
        ref: t,
        className: oe(uu({ variant: n, size: o }), a),
        role: i,
        ...c,
        children: [
          r && /* @__PURE__ */ u.jsx(
            fe,
            {
              "aria-label": "Dismiss notification",
              className: "absolute top-1 right-1 size-8 text-text-secondary hover:text-text-primary",
              size: "icon",
              variant: "ghost",
              onClick: f,
              children: /* @__PURE__ */ u.jsx(Al, { className: "size-5" })
            }
          ),
          l
        ]
      }
    );
  }
);
_s.displayName = "Banner";
var Ko = 180 / Math.PI, Un = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Es(e, t, n, o, r, s) {
  var i, a, l;
  return (i = Math.sqrt(e * e + t * t)) && (e /= i, t /= i), (l = e * n + t * o) && (n -= e * l, o -= t * l), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, l /= a), e * o < t * n && (e = -e, t = -t, l = -l, i = -i), {
    translateX: r,
    translateY: s,
    rotate: Math.atan2(t, e) * Ko,
    skewX: Math.atan(l) * Ko,
    scaleX: i,
    scaleY: a
  };
}
var zt;
function du(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Un : Es(t.a, t.b, t.c, t.d, t.e, t.f);
}
function fu(e) {
  return e == null || (zt || (zt = document.createElementNS("http://www.w3.org/2000/svg", "g")), zt.setAttribute("transform", e), !(e = zt.transform.baseVal.consolidate())) ? Un : (e = e.matrix, Es(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Ns(e, t, n, o) {
  function r(c) {
    return c.length ? c.pop() + " " : "";
  }
  function s(c, f, d, h, g, p) {
    if (c !== d || f !== h) {
      var v = g.push("translate(", null, t, null, n);
      p.push({ i: v - 4, x: Re(c, d) }, { i: v - 2, x: Re(f, h) });
    } else (d || h) && g.push("translate(" + d + t + h + n);
  }
  function i(c, f, d, h) {
    c !== f ? (c - f > 180 ? f += 360 : f - c > 180 && (c += 360), h.push({ i: d.push(r(d) + "rotate(", null, o) - 2, x: Re(c, f) })) : f && d.push(r(d) + "rotate(" + f + o);
  }
  function a(c, f, d, h) {
    c !== f ? h.push({ i: d.push(r(d) + "skewX(", null, o) - 2, x: Re(c, f) }) : f && d.push(r(d) + "skewX(" + f + o);
  }
  function l(c, f, d, h, g, p) {
    if (c !== d || f !== h) {
      var v = g.push(r(g) + "scale(", null, ",", null, ")");
      p.push({ i: v - 4, x: Re(c, d) }, { i: v - 2, x: Re(f, h) });
    } else (d !== 1 || h !== 1) && g.push(r(g) + "scale(" + d + "," + h + ")");
  }
  return function(c, f) {
    var d = [], h = [];
    return c = e(c), f = e(f), s(c.translateX, c.translateY, f.translateX, f.translateY, d, h), i(c.rotate, f.rotate, d, h), a(c.skewX, f.skewX, d, h), l(c.scaleX, c.scaleY, f.scaleX, f.scaleY, d, h), c = f = null, function(g) {
      for (var p = -1, v = h.length, x; ++p < v; ) d[(x = h[p]).i] = x.x(g);
      return d.join("");
    };
  };
}
var hu = Ns(du, "px, ", "px)", "deg)"), pu = Ns(fu, ", ", ")", ")"), gu = 1e-12;
function Qo(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function mu(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function xu(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const qt = (function e(t, n, o) {
  function r(s, i) {
    var a = s[0], l = s[1], c = s[2], f = i[0], d = i[1], h = i[2], g = f - a, p = d - l, v = g * g + p * p, x, y;
    if (v < gu)
      y = Math.log(h / c) / t, x = function(k) {
        return [
          a + k * g,
          l + k * p,
          c * Math.exp(t * k * y)
        ];
      };
    else {
      var _ = Math.sqrt(v), m = (h * h - c * c + o * v) / (2 * c * n * _), w = (h * h - c * c - o * v) / (2 * h * n * _), S = Math.log(Math.sqrt(m * m + 1) - m), E = Math.log(Math.sqrt(w * w + 1) - w);
      y = (E - S) / t, x = function(k) {
        var P = k * y, A = Qo(S), O = c / (n * _) * (A * xu(t * P + S) - mu(S));
        return [
          a + O * g,
          l + O * p,
          c * A / Qo(t * P + S)
        ];
      };
    }
    return x.duration = y * 1e3 * t / Math.SQRT2, x;
  }
  return r.rho = function(s) {
    var i = Math.max(1e-3, +s), a = i * i, l = a * a;
    return e(i, a, l);
  }, r;
})(Math.SQRT2, 2, 4);
var go = "ContextMenu", [yu] = Cl(go, [
  xs
]), ge = xs(), [wu, Ss] = yu(go), Cs = (e) => {
  const { __scopeContextMenu: t, children: n, onOpenChange: o, dir: r, modal: s = !0 } = e, [i, a] = te(!1), l = ge(t), c = Nl(o), f = ne(
    (d) => {
      a(d), c(d);
    },
    [c]
  );
  return /* @__PURE__ */ u.jsx(
    wu,
    {
      scope: t,
      open: i,
      onOpenChange: f,
      modal: s,
      children: /* @__PURE__ */ u.jsx(
        Dl,
        {
          ...l,
          dir: r,
          open: i,
          onOpenChange: f,
          modal: s,
          children: n
        }
      )
    }
  );
};
Cs.displayName = go;
var Ms = "ContextMenuTrigger", js = ce(
  (e, t) => {
    const { __scopeContextMenu: n, disabled: o = !1, ...r } = e, s = Ss(Ms, n), i = ge(n), a = U({ x: 0, y: 0 }), l = U({
      getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...a.current })
    }), c = U(0), f = ne(
      () => window.clearTimeout(c.current),
      []
    ), d = (h) => {
      a.current = { x: h.clientX, y: h.clientY }, s.onOpenChange(!0);
    };
    return J(() => f, [f]), J(() => {
      o && f();
    }, [o, f]), /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
      /* @__PURE__ */ u.jsx(Tl, { ...i, virtualRef: l }),
      /* @__PURE__ */ u.jsx(
        Sl.span,
        {
          "data-state": s.open ? "open" : "closed",
          "data-disabled": o ? "" : void 0,
          ...r,
          ref: t,
          style: { WebkitTouchCallout: "none", ...e.style },
          onContextMenu: o ? e.onContextMenu : lt(e.onContextMenu, (h) => {
            f(), d(h), h.preventDefault();
          }),
          onPointerDown: o ? e.onPointerDown : lt(
            e.onPointerDown,
            $t((h) => {
              f(), c.current = window.setTimeout(() => d(h), 700);
            })
          ),
          onPointerMove: o ? e.onPointerMove : lt(e.onPointerMove, $t(f)),
          onPointerCancel: o ? e.onPointerCancel : lt(e.onPointerCancel, $t(f)),
          onPointerUp: o ? e.onPointerUp : lt(e.onPointerUp, $t(f))
        }
      )
    ] });
  }
);
js.displayName = Ms;
var vu = "ContextMenuPortal", ks = (e) => {
  const { __scopeContextMenu: t, ...n } = e, o = ge(t);
  return /* @__PURE__ */ u.jsx(zl, { ...o, ...n });
};
ks.displayName = vu;
var Is = "ContextMenuContent", Ps = ce(
  (e, t) => {
    const { __scopeContextMenu: n, ...o } = e, r = Ss(Is, n), s = ge(n), i = U(!1);
    return /* @__PURE__ */ u.jsx(
      $l,
      {
        ...s,
        ...o,
        ref: t,
        side: "right",
        sideOffset: 2,
        align: "start",
        onCloseAutoFocus: (a) => {
          e.onCloseAutoFocus?.(a), !a.defaultPrevented && i.current && a.preventDefault(), i.current = !1;
        },
        onInteractOutside: (a) => {
          e.onInteractOutside?.(a), !a.defaultPrevented && !r.modal && (i.current = !0);
        },
        style: {
          ...e.style,
          "--radix-context-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-context-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-context-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-context-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-context-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    );
  }
);
Ps.displayName = Is;
var bu = "ContextMenuGroup", _u = ce(
  (e, t) => {
    const { __scopeContextMenu: n, ...o } = e, r = ge(n);
    return /* @__PURE__ */ u.jsx(Ol, { ...r, ...o, ref: t });
  }
);
_u.displayName = bu;
var Eu = "ContextMenuLabel", As = ce(
  (e, t) => {
    const { __scopeContextMenu: n, ...o } = e, r = ge(n);
    return /* @__PURE__ */ u.jsx(Hl, { ...r, ...o, ref: t });
  }
);
As.displayName = Eu;
var Nu = "ContextMenuItem", Ds = ce(
  (e, t) => {
    const { __scopeContextMenu: n, ...o } = e, r = ge(n);
    return /* @__PURE__ */ u.jsx(Rl, { ...r, ...o, ref: t });
  }
);
Ds.displayName = Nu;
var Su = "ContextMenuCheckboxItem", Ts = ce((e, t) => {
  const { __scopeContextMenu: n, ...o } = e, r = ge(n);
  return /* @__PURE__ */ u.jsx(Bl, { ...r, ...o, ref: t });
});
Ts.displayName = Su;
var Cu = "ContextMenuRadioGroup", Mu = ce((e, t) => {
  const { __scopeContextMenu: n, ...o } = e, r = ge(n);
  return /* @__PURE__ */ u.jsx(Vl, { ...r, ...o, ref: t });
});
Mu.displayName = Cu;
var ju = "ContextMenuRadioItem", zs = ce((e, t) => {
  const { __scopeContextMenu: n, ...o } = e, r = ge(n);
  return /* @__PURE__ */ u.jsx(Fl, { ...r, ...o, ref: t });
});
zs.displayName = ju;
var ku = "ContextMenuItemIndicator", $s = ce((e, t) => {
  const { __scopeContextMenu: n, ...o } = e, r = ge(n);
  return /* @__PURE__ */ u.jsx(Wl, { ...r, ...o, ref: t });
});
$s.displayName = ku;
var Iu = "ContextMenuSeparator", Ls = ce((e, t) => {
  const { __scopeContextMenu: n, ...o } = e, r = ge(n);
  return /* @__PURE__ */ u.jsx(Ll, { ...r, ...o, ref: t });
});
Ls.displayName = Iu;
var Pu = "ContextMenuArrow", Au = ce(
  (e, t) => {
    const { __scopeContextMenu: n, ...o } = e, r = ge(n);
    return /* @__PURE__ */ u.jsx(Yl, { ...r, ...o, ref: t });
  }
);
Au.displayName = Pu;
var Du = "ContextMenuSubTrigger", Rs = ce((e, t) => {
  const { __scopeContextMenu: n, ...o } = e, r = ge(n);
  return /* @__PURE__ */ u.jsx(Xl, { ...r, ...o, ref: t });
});
Rs.displayName = Du;
var Tu = "ContextMenuSubContent", Os = ce((e, t) => {
  const { __scopeContextMenu: n, ...o } = e, r = ge(n);
  return /* @__PURE__ */ u.jsx(
    Zl,
    {
      ...r,
      ...o,
      ref: t,
      style: {
        ...e.style,
        "--radix-context-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-context-menu-content-available-width": "var(--radix-popper-available-width)",
        "--radix-context-menu-content-available-height": "var(--radix-popper-available-height)",
        "--radix-context-menu-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-context-menu-trigger-height": "var(--radix-popper-anchor-height)"
      }
    }
  );
});
Os.displayName = Tu;
function $t(e) {
  return (t) => t.pointerType !== "mouse" ? e(t) : void 0;
}
var zu = Cs, $u = js, Lu = ks, Hs = Ps, Bs = As, Vs = Ds, Fs = Ts, Ws = zs, Ys = $s, Xs = Ls, Zs = Rs, Us = Os;
const Ru = zu, Ou = $u, Hu = ce(({ className: e, inset: t, children: n, ...o }, r) => /* @__PURE__ */ u.jsxs(
  Zs,
  {
    ref: r,
    className: oe(
      "flex cursor-default gap-2 select-none items-center rounded-xs px-2 py-1.5 text-sm outline-hidden hover:bg-accent focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      t && "pl-8",
      e
    ),
    ...o,
    children: [
      n,
      /* @__PURE__ */ u.jsx(Ul, { className: "ml-auto" })
    ]
  }
));
Hu.displayName = Zs.displayName;
const Bu = ce(({ className: e, ...t }, n) => /* @__PURE__ */ u.jsx("div", { className: os, children: /* @__PURE__ */ u.jsx(
  Us,
  {
    ref: n,
    className: oe(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      e
    ),
    ...t
  }
) }));
Bu.displayName = Us.displayName;
const Gs = ce(({ className: e, ...t }, n) => /* @__PURE__ */ u.jsx(Lu, { children: /* @__PURE__ */ u.jsx("div", { className: os, children: /* @__PURE__ */ u.jsx(
  Hs,
  {
    ref: n,
    className: oe(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      e
    ),
    ...t
  }
) }) }));
Gs.displayName = Hs.displayName;
const qs = ce(({ className: e, inset: t, variant: n = "default", ...o }, r) => /* @__PURE__ */ u.jsx(
  Vs,
  {
    ref: r,
    className: oe(
      "relative flex cursor-default select-none cursor-pointer items-center gap-2 rounded-xs px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      n === "destructive" && "text-destructive focus:bg-destructive/10 focus:text-destructive",
      t && "pl-8",
      e
    ),
    ...o
  }
));
qs.displayName = Vs.displayName;
const Vu = ce(({ className: e, children: t, checked: n, ...o }, r) => /* @__PURE__ */ u.jsxs(
  Fs,
  {
    ref: r,
    checked: n,
    className: oe(
      "relative flex cursor-default select-none items-center rounded-xs py-1.5 pl-8 pr-2 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e
    ),
    ...o,
    children: [
      /* @__PURE__ */ u.jsx("span", { className: "absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ u.jsx(Ys, { children: /* @__PURE__ */ u.jsx(ms, { className: "size-4" }) }) }),
      t
    ]
  }
));
Vu.displayName = Fs.displayName;
const Fu = ce(({ className: e, children: t, ...n }, o) => /* @__PURE__ */ u.jsxs(
  Ws,
  {
    ref: o,
    className: oe(
      "relative flex cursor-default select-none items-center rounded-xs py-1.5 pl-8 pr-2 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e
    ),
    ...n,
    children: [
      /* @__PURE__ */ u.jsx("span", { className: "absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ u.jsx(Ys, { children: /* @__PURE__ */ u.jsx(Gl, { className: "size-2 fill-current" }) }) }),
      t
    ]
  }
));
Fu.displayName = Ws.displayName;
const Wu = ce(({ className: e, inset: t, ...n }, o) => /* @__PURE__ */ u.jsx(
  Bs,
  {
    ref: o,
    className: oe(
      "px-2 py-1.5 text-sm font-semibold",
      t && "pl-8",
      e
    ),
    ...n
  }
));
Wu.displayName = Bs.displayName;
const Ks = ce(({ className: e, ...t }, n) => /* @__PURE__ */ u.jsx(
  Xs,
  {
    ref: n,
    className: oe("-mx-1 my-1 h-px bg-muted", e),
    ...t
  }
));
Ks.displayName = Xs.displayName;
const Yu = hn(
  "group/field flex w-full gap-2 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ],
        responsive: [
          "flex-col @md/field-group:flex-row @md/field-group:items-center [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ]
      }
    },
    defaultVariants: {
      orientation: "vertical"
    }
  }
);
function Xu({
  className: e,
  orientation: t = "vertical",
  ...n
}) {
  return /* @__PURE__ */ u.jsx(
    "div",
    {
      className: oe(Yu({ orientation: t }), e),
      "data-orientation": t,
      "data-slot": "field",
      role: "group",
      ...n
    }
  );
}
function Zu({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ u.jsx(
    Xn,
    {
      className: oe(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>[data-slot=field]]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        e
      ),
      "data-slot": "field-label",
      ...t
    }
  );
}
function Uu({
  className: e,
  children: t,
  errors: n,
  ...o
}) {
  const r = he(() => t || (n ? n?.length === 1 && n[0]?.message ? n[0].message : /* @__PURE__ */ u.jsx("ul", { className: "ml-4 flex list-disc flex-col gap-1", children: n.map(
    (s) => s?.message && /* @__PURE__ */ u.jsx("li", { children: s.message }, s.message)
  ) }) : null), [t, n]);
  return r ? /* @__PURE__ */ u.jsx(
    "div",
    {
      className: oe("text-destructive text-control font-normal", e),
      "data-slot": "field-error",
      role: "alert",
      ...o,
      children: r
    }
  ) : null;
}
function Gu({ className: e, ...t }) {
  return /* @__PURE__ */ u.jsx(
    "div",
    {
      className: oe(
        // Shared surface chrome (border, bg, radius, transition, invalid state).
        Uo.base,
        Uo.invalidWithin,
        // Wrapper layout + group context (input-group specific).
        "group/input-group relative flex w-full items-center outline-hidden",
        "h-9 has-[>textarea]:h-auto",
        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",
        // Focus state — scoped to the input-group control specifically so that
        // focusing an InputGroupButton inside the group does NOT trigger the surface
        // focus ring. This is why we don't use inputSurface('within') here.
        "has-[[data-slot=input-group-control]:focus-visible]:outline-hidden has-[[data-slot=input-group-control]:focus-visible]:bg-transparent has-[[data-slot=input-group-control]:focus-visible]:border-focus-ring has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-focus-ring/25",
        e
      ),
      "data-slot": "input-group",
      role: "group",
      ...t
    }
  );
}
const qu = hn(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-control font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--input-group-radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end": "order-last pr-3 has-[>button]:mr-[-0.4rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start": "order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-3",
        "block-end": "order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-3"
      }
    },
    defaultVariants: {
      align: "inline-start"
    }
  }
);
function Ku({
  className: e,
  align: t = "inline-start",
  ...n
}) {
  return /* @__PURE__ */ u.jsx(
    "div",
    {
      className: oe(qu({ align: t }), e),
      "data-align": t,
      "data-slot": "input-group-addon",
      role: "group",
      onClick: (o) => {
        if (o.target.closest("button"))
          return;
        o.currentTarget.closest('[data-slot="input-group"]')?.querySelector('[data-slot="input-group-control"]')?.focus();
      },
      ...n
    }
  );
}
const Qu = hn(
  "flex items-center gap-2 text-control shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--input-group-radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5",
        "icon-xs": "size-6 rounded-[calc(var(--input-group-radius)-5px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0"
      }
    },
    defaultVariants: {
      size: "xs"
    }
  }
);
function Jo({
  className: e,
  type: t = "button",
  variant: n = "ghost",
  size: o = "xs",
  ...r
}) {
  return /* @__PURE__ */ u.jsx(
    fe,
    {
      className: oe(Qu({ size: o }), e),
      "data-size": o,
      type: t,
      variant: n,
      ...r
    }
  );
}
function Ju({ className: e, ...t }) {
  return /* @__PURE__ */ u.jsx(
    "span",
    {
      className: oe(
        "text-muted-foreground flex items-center gap-2 text-control [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        e
      ),
      ...t
    }
  );
}
function ed({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ u.jsx(
    mn,
    {
      className: oe(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:outline-hidden focus-visible:shadow-none dark:bg-transparent",
        e
      ),
      "data-slot": "input-group-control",
      ...t
    }
  );
}
const er = (e) => {
  if (!(e === null || typeof e > "u")) {
    if (typeof e == "string")
      return e;
    throw new TypeError("Expected value to be null, undefined, or a string");
  }
}, tr = (e) => {
  if (e.startsWith("/")) {
    const { adminRoot: t } = fo();
    return window.location.origin + t.replace(/\/$/, "") + e;
  }
  return e;
};
function td() {
  const { data: e } = ho(), { data: t } = pn(), o = e?.config?.hostSettings?.pintura, r = t?.settings ?? null, [s, i, a] = gn(r, [
    "pintura",
    "pintura_js_url",
    "pintura_css_url"
  ]);
  let l, c;
  return s && (l = o?.js || er(i), c = o?.css || er(a)), he(() => !l || !c ? null : {
    jsUrl: tr(l),
    cssUrl: tr(c)
  }, [l, c]);
}
const nr = ({ icon: e, label: t, description: n, onClick: o }) => /* @__PURE__ */ u.jsxs(
  "button",
  {
    className: "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-grey-50 focus-visible:bg-grey-50 focus-visible:outline-none dark:hover:bg-grey-900 dark:focus-visible:bg-grey-900",
    type: "button",
    onClick: o,
    children: [
      /* @__PURE__ */ u.jsx("div", { className: "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-text-secondary", children: /* @__PURE__ */ u.jsx(e, { className: "size-4" }) }),
      /* @__PURE__ */ u.jsxs("div", { className: "flex min-w-0 flex-col", children: [
        /* @__PURE__ */ u.jsx("span", { className: "font-medium", children: t }),
        /* @__PURE__ */ u.jsx("span", { className: "text-xs text-text-secondary", children: n })
      ] })
    ]
  }
), Qs = ({ onPick: e }) => /* @__PURE__ */ u.jsxs("div", { className: "flex w-72 flex-col gap-1 p-1", "data-testid": "step-picker", children: [
  /* @__PURE__ */ u.jsx(
    nr,
    {
      description: "Send an email",
      icon: co,
      label: "Email",
      onClick: () => e("send_email")
    }
  ),
  /* @__PURE__ */ u.jsx(
    nr,
    {
      description: "Wait a set amount of time",
      icon: lo,
      label: "Wait",
      onClick: () => e("wait")
    }
  )
] });
function de(e) {
  if (typeof e == "string" || typeof e == "number") return "" + e;
  let t = "";
  if (Array.isArray(e))
    for (let n = 0, o; n < e.length; n++)
      (o = de(e[n])) !== "" && (t += (t && " ") + o);
  else
    for (let n in e)
      e[n] && (t += (t && " ") + n);
  return t;
}
var nd = { value: () => {
} };
function xn() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Kt(n);
}
function Kt(e) {
  this._ = e;
}
function od(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", r = n.indexOf(".");
    if (r >= 0 && (o = n.slice(r + 1), n = n.slice(0, r)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Kt.prototype = xn.prototype = {
  constructor: Kt,
  on: function(e, t) {
    var n = this._, o = od(e + "", n), r, s = -1, i = o.length;
    if (arguments.length < 2) {
      for (; ++s < i; ) if ((r = (e = o[s]).type) && (r = rd(n[r], e.name))) return r;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++s < i; )
      if (r = (e = o[s]).type) n[r] = or(n[r], e.name, t);
      else if (t == null) for (r in n) n[r] = or(n[r], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new Kt(e);
  },
  call: function(e, t) {
    if ((r = arguments.length - 2) > 0) for (var n = new Array(r), o = 0, r, s; o < r; ++o) n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (s = this._[e], o = 0, r = s.length; o < r; ++o) s[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var o = this._[e], r = 0, s = o.length; r < s; ++r) o[r].value.apply(t, n);
  }
};
function rd(e, t) {
  for (var n = 0, o = e.length, r; n < o; ++n)
    if ((r = e[n]).name === t)
      return r.value;
}
function or(e, t, n) {
  for (var o = 0, r = e.length; o < r; ++o)
    if (e[o].name === t) {
      e[o] = nd, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var Gn = "http://www.w3.org/1999/xhtml";
const rr = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Gn,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function yn(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), rr.hasOwnProperty(t) ? { space: rr[t], local: e } : e;
}
function sd(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Gn && t.documentElement.namespaceURI === Gn ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function id(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Js(e) {
  var t = yn(e);
  return (t.local ? id : sd)(t);
}
function ad() {
}
function mo(e) {
  return e == null ? ad : function() {
    return this.querySelector(e);
  };
}
function cd(e) {
  typeof e != "function" && (e = mo(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var s = t[r], i = s.length, a = o[r] = new Array(i), l, c, f = 0; f < i; ++f)
      (l = s[f]) && (c = e.call(l, l.__data__, f, s)) && ("__data__" in l && (c.__data__ = l.__data__), a[f] = c);
  return new xe(o, this._parents);
}
function ld(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function ud() {
  return [];
}
function ei(e) {
  return e == null ? ud : function() {
    return this.querySelectorAll(e);
  };
}
function dd(e) {
  return function() {
    return ld(e.apply(this, arguments));
  };
}
function fd(e) {
  typeof e == "function" ? e = dd(e) : e = ei(e);
  for (var t = this._groups, n = t.length, o = [], r = [], s = 0; s < n; ++s)
    for (var i = t[s], a = i.length, l, c = 0; c < a; ++c)
      (l = i[c]) && (o.push(e.call(l, l.__data__, c, i)), r.push(l));
  return new xe(o, r);
}
function ti(e) {
  return function() {
    return this.matches(e);
  };
}
function ni(e) {
  return function(t) {
    return t.matches(e);
  };
}
var hd = Array.prototype.find;
function pd(e) {
  return function() {
    return hd.call(this.children, e);
  };
}
function gd() {
  return this.firstElementChild;
}
function md(e) {
  return this.select(e == null ? gd : pd(typeof e == "function" ? e : ni(e)));
}
var xd = Array.prototype.filter;
function yd() {
  return Array.from(this.children);
}
function wd(e) {
  return function() {
    return xd.call(this.children, e);
  };
}
function vd(e) {
  return this.selectAll(e == null ? yd : wd(typeof e == "function" ? e : ni(e)));
}
function bd(e) {
  typeof e != "function" && (e = ti(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var s = t[r], i = s.length, a = o[r] = [], l, c = 0; c < i; ++c)
      (l = s[c]) && e.call(l, l.__data__, c, s) && a.push(l);
  return new xe(o, this._parents);
}
function oi(e) {
  return new Array(e.length);
}
function _d() {
  return new xe(this._enter || this._groups.map(oi), this._parents);
}
function on(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
on.prototype = {
  constructor: on,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function Ed(e) {
  return function() {
    return e;
  };
}
function Nd(e, t, n, o, r, s) {
  for (var i = 0, a, l = t.length, c = s.length; i < c; ++i)
    (a = t[i]) ? (a.__data__ = s[i], o[i] = a) : n[i] = new on(e, s[i]);
  for (; i < l; ++i)
    (a = t[i]) && (r[i] = a);
}
function Sd(e, t, n, o, r, s, i) {
  var a, l, c = /* @__PURE__ */ new Map(), f = t.length, d = s.length, h = new Array(f), g;
  for (a = 0; a < f; ++a)
    (l = t[a]) && (h[a] = g = i.call(l, l.__data__, a, t) + "", c.has(g) ? r[a] = l : c.set(g, l));
  for (a = 0; a < d; ++a)
    g = i.call(e, s[a], a, s) + "", (l = c.get(g)) ? (o[a] = l, l.__data__ = s[a], c.delete(g)) : n[a] = new on(e, s[a]);
  for (a = 0; a < f; ++a)
    (l = t[a]) && c.get(h[a]) === l && (r[a] = l);
}
function Cd(e) {
  return e.__data__;
}
function Md(e, t) {
  if (!arguments.length) return Array.from(this, Cd);
  var n = t ? Sd : Nd, o = this._parents, r = this._groups;
  typeof e != "function" && (e = Ed(e));
  for (var s = r.length, i = new Array(s), a = new Array(s), l = new Array(s), c = 0; c < s; ++c) {
    var f = o[c], d = r[c], h = d.length, g = jd(e.call(f, f && f.__data__, c, o)), p = g.length, v = a[c] = new Array(p), x = i[c] = new Array(p), y = l[c] = new Array(h);
    n(f, d, v, x, y, g, t);
    for (var _ = 0, m = 0, w, S; _ < p; ++_)
      if (w = v[_]) {
        for (_ >= m && (m = _ + 1); !(S = x[m]) && ++m < p; ) ;
        w._next = S || null;
      }
  }
  return i = new xe(i, o), i._enter = a, i._exit = l, i;
}
function jd(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function kd() {
  return new xe(this._exit || this._groups.map(oi), this._parents);
}
function Id(e, t, n) {
  var o = this.enter(), r = this, s = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (r = t(r), r && (r = r.selection())), n == null ? s.remove() : n(s), o && r ? o.merge(r).order() : r;
}
function Pd(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, r = n.length, s = o.length, i = Math.min(r, s), a = new Array(r), l = 0; l < i; ++l)
    for (var c = n[l], f = o[l], d = c.length, h = a[l] = new Array(d), g, p = 0; p < d; ++p)
      (g = c[p] || f[p]) && (h[p] = g);
  for (; l < r; ++l)
    a[l] = n[l];
  return new xe(a, this._parents);
}
function Ad() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], r = o.length - 1, s = o[r], i; --r >= 0; )
      (i = o[r]) && (s && i.compareDocumentPosition(s) ^ 4 && s.parentNode.insertBefore(i, s), s = i);
  return this;
}
function Dd(e) {
  e || (e = Td);
  function t(d, h) {
    return d && h ? e(d.__data__, h.__data__) : !d - !h;
  }
  for (var n = this._groups, o = n.length, r = new Array(o), s = 0; s < o; ++s) {
    for (var i = n[s], a = i.length, l = r[s] = new Array(a), c, f = 0; f < a; ++f)
      (c = i[f]) && (l[f] = c);
    l.sort(t);
  }
  return new xe(r, this._parents).order();
}
function Td(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function zd() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function $d() {
  return Array.from(this);
}
function Ld() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], r = 0, s = o.length; r < s; ++r) {
      var i = o[r];
      if (i) return i;
    }
  return null;
}
function Rd() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Od() {
  return !this.node();
}
function Hd(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var r = t[n], s = 0, i = r.length, a; s < i; ++s)
      (a = r[s]) && e.call(a, a.__data__, s, r);
  return this;
}
function Bd(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Vd(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Fd(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Wd(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function Yd(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Xd(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Zd(e, t) {
  var n = yn(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Vd : Bd : typeof t == "function" ? n.local ? Xd : Yd : n.local ? Wd : Fd)(n, t));
}
function ri(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Ud(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Gd(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function qd(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function Kd(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? Ud : typeof t == "function" ? qd : Gd)(e, t, n ?? "")) : Ke(this.node(), e);
}
function Ke(e, t) {
  return e.style.getPropertyValue(t) || ri(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Qd(e) {
  return function() {
    delete this[e];
  };
}
function Jd(e, t) {
  return function() {
    this[e] = t;
  };
}
function ef(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function tf(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Qd : typeof t == "function" ? ef : Jd)(e, t)) : this.node()[e];
}
function si(e) {
  return e.trim().split(/^|\s+/);
}
function xo(e) {
  return e.classList || new ii(e);
}
function ii(e) {
  this._node = e, this._names = si(e.getAttribute("class") || "");
}
ii.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function ai(e, t) {
  for (var n = xo(e), o = -1, r = t.length; ++o < r; ) n.add(t[o]);
}
function ci(e, t) {
  for (var n = xo(e), o = -1, r = t.length; ++o < r; ) n.remove(t[o]);
}
function nf(e) {
  return function() {
    ai(this, e);
  };
}
function of(e) {
  return function() {
    ci(this, e);
  };
}
function rf(e, t) {
  return function() {
    (t.apply(this, arguments) ? ai : ci)(this, e);
  };
}
function sf(e, t) {
  var n = si(e + "");
  if (arguments.length < 2) {
    for (var o = xo(this.node()), r = -1, s = n.length; ++r < s; ) if (!o.contains(n[r])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? rf : t ? nf : of)(n, t));
}
function af() {
  this.textContent = "";
}
function cf(e) {
  return function() {
    this.textContent = e;
  };
}
function lf(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function uf(e) {
  return arguments.length ? this.each(e == null ? af : (typeof e == "function" ? lf : cf)(e)) : this.node().textContent;
}
function df() {
  this.innerHTML = "";
}
function ff(e) {
  return function() {
    this.innerHTML = e;
  };
}
function hf(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function pf(e) {
  return arguments.length ? this.each(e == null ? df : (typeof e == "function" ? hf : ff)(e)) : this.node().innerHTML;
}
function gf() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function mf() {
  return this.each(gf);
}
function xf() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function yf() {
  return this.each(xf);
}
function wf(e) {
  var t = typeof e == "function" ? e : Js(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function vf() {
  return null;
}
function bf(e, t) {
  var n = typeof e == "function" ? e : Js(e), o = t == null ? vf : typeof t == "function" ? t : mo(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function _f() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Ef() {
  return this.each(_f);
}
function Nf() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Sf() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Cf(e) {
  return this.select(e ? Sf : Nf);
}
function Mf(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function jf(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function kf(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function If(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, r = t.length, s; n < r; ++n)
        s = t[n], (!e.type || s.type === e.type) && s.name === e.name ? this.removeEventListener(s.type, s.listener, s.options) : t[++o] = s;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function Pf(e, t, n) {
  return function() {
    var o = this.__on, r, s = jf(t);
    if (o) {
      for (var i = 0, a = o.length; i < a; ++i)
        if ((r = o[i]).type === e.type && r.name === e.name) {
          this.removeEventListener(r.type, r.listener, r.options), this.addEventListener(r.type, r.listener = s, r.options = n), r.value = t;
          return;
        }
    }
    this.addEventListener(e.type, s, n), r = { type: e.type, name: e.name, value: t, listener: s, options: n }, o ? o.push(r) : this.__on = [r];
  };
}
function Af(e, t, n) {
  var o = kf(e + ""), r, s = o.length, i;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var l = 0, c = a.length, f; l < c; ++l)
        for (r = 0, f = a[l]; r < s; ++r)
          if ((i = o[r]).type === f.type && i.name === f.name)
            return f.value;
    }
    return;
  }
  for (a = t ? Pf : If, r = 0; r < s; ++r) this.each(a(o[r], t, n));
  return this;
}
function li(e, t, n) {
  var o = ri(e), r = o.CustomEvent;
  typeof r == "function" ? r = new r(t, n) : (r = o.document.createEvent("Event"), n ? (r.initEvent(t, n.bubbles, n.cancelable), r.detail = n.detail) : r.initEvent(t, !1, !1)), e.dispatchEvent(r);
}
function Df(e, t) {
  return function() {
    return li(this, e, t);
  };
}
function Tf(e, t) {
  return function() {
    return li(this, e, t.apply(this, arguments));
  };
}
function zf(e, t) {
  return this.each((typeof t == "function" ? Tf : Df)(e, t));
}
function* $f() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], r = 0, s = o.length, i; r < s; ++r)
      (i = o[r]) && (yield i);
}
var ui = [null];
function xe(e, t) {
  this._groups = e, this._parents = t;
}
function kt() {
  return new xe([[document.documentElement]], ui);
}
function Lf() {
  return this;
}
xe.prototype = kt.prototype = {
  constructor: xe,
  select: cd,
  selectAll: fd,
  selectChild: md,
  selectChildren: vd,
  filter: bd,
  data: Md,
  enter: _d,
  exit: kd,
  join: Id,
  merge: Pd,
  selection: Lf,
  order: Ad,
  sort: Dd,
  call: zd,
  nodes: $d,
  node: Ld,
  size: Rd,
  empty: Od,
  each: Hd,
  attr: Zd,
  style: Kd,
  property: tf,
  classed: sf,
  text: uf,
  html: pf,
  raise: mf,
  lower: yf,
  append: wf,
  insert: bf,
  remove: Ef,
  clone: Cf,
  datum: Mf,
  on: Af,
  dispatch: zf,
  [Symbol.iterator]: $f
};
function me(e) {
  return typeof e == "string" ? new xe([[document.querySelector(e)]], [document.documentElement]) : new xe([[e]], ui);
}
function Rf(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function ye(e, t) {
  if (e = Rf(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e.clientX, o.y = e.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var r = t.getBoundingClientRect();
      return [e.clientX - r.left - t.clientLeft, e.clientY - r.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const Of = { passive: !1 }, wt = { capture: !0, passive: !1 };
function Tn(e) {
  e.stopImmediatePropagation();
}
function qe(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function di(e) {
  var t = e.document.documentElement, n = me(e).on("dragstart.drag", qe, wt);
  "onselectstart" in t ? n.on("selectstart.drag", qe, wt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function fi(e, t) {
  var n = e.document.documentElement, o = me(e).on("dragstart.drag", null);
  t && (o.on("click.drag", qe, wt), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Lt = (e) => () => e;
function qn(e, {
  sourceEvent: t,
  subject: n,
  target: o,
  identifier: r,
  active: s,
  x: i,
  y: a,
  dx: l,
  dy: c,
  dispatch: f
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    identifier: { value: r, enumerable: !0, configurable: !0 },
    active: { value: s, enumerable: !0, configurable: !0 },
    x: { value: i, enumerable: !0, configurable: !0 },
    y: { value: a, enumerable: !0, configurable: !0 },
    dx: { value: l, enumerable: !0, configurable: !0 },
    dy: { value: c, enumerable: !0, configurable: !0 },
    _: { value: f }
  });
}
qn.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function Hf(e) {
  return !e.ctrlKey && !e.button;
}
function Bf() {
  return this.parentNode;
}
function Vf(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Ff() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function hi() {
  var e = Hf, t = Bf, n = Vf, o = Ff, r = {}, s = xn("start", "drag", "end"), i = 0, a, l, c, f, d = 0;
  function h(w) {
    w.on("mousedown.drag", g).filter(o).on("touchstart.drag", x).on("touchmove.drag", y, Of).on("touchend.drag touchcancel.drag", _).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function g(w, S) {
    if (!(f || !e.call(this, w, S))) {
      var E = m(this, t.call(this, w, S), w, S, "mouse");
      E && (me(w.view).on("mousemove.drag", p, wt).on("mouseup.drag", v, wt), di(w.view), Tn(w), c = !1, a = w.clientX, l = w.clientY, E("start", w));
    }
  }
  function p(w) {
    if (qe(w), !c) {
      var S = w.clientX - a, E = w.clientY - l;
      c = S * S + E * E > d;
    }
    r.mouse("drag", w);
  }
  function v(w) {
    me(w.view).on("mousemove.drag mouseup.drag", null), fi(w.view, c), qe(w), r.mouse("end", w);
  }
  function x(w, S) {
    if (e.call(this, w, S)) {
      var E = w.changedTouches, k = t.call(this, w, S), P = E.length, A, O;
      for (A = 0; A < P; ++A)
        (O = m(this, k, w, S, E[A].identifier, E[A])) && (Tn(w), O("start", w, E[A]));
    }
  }
  function y(w) {
    var S = w.changedTouches, E = S.length, k, P;
    for (k = 0; k < E; ++k)
      (P = r[S[k].identifier]) && (qe(w), P("drag", w, S[k]));
  }
  function _(w) {
    var S = w.changedTouches, E = S.length, k, P;
    for (f && clearTimeout(f), f = setTimeout(function() {
      f = null;
    }, 500), k = 0; k < E; ++k)
      (P = r[S[k].identifier]) && (Tn(w), P("end", w, S[k]));
  }
  function m(w, S, E, k, P, A) {
    var O = s.copy(), C = ye(A || E, S), D, z, b;
    if ((b = n.call(w, new qn("beforestart", {
      sourceEvent: E,
      target: h,
      identifier: P,
      active: i,
      x: C[0],
      y: C[1],
      dx: 0,
      dy: 0,
      dispatch: O
    }), k)) != null)
      return D = b.x - C[0] || 0, z = b.y - C[1] || 0, function j(N, M, I) {
        var T = C, $;
        switch (N) {
          case "start":
            r[P] = j, $ = i++;
            break;
          case "end":
            delete r[P], --i;
          // falls through
          case "drag":
            C = ye(I || M, S), $ = i;
            break;
        }
        O.call(
          N,
          w,
          new qn(N, {
            sourceEvent: M,
            subject: b,
            target: h,
            identifier: P,
            active: $,
            x: C[0] + D,
            y: C[1] + z,
            dx: C[0] - T[0],
            dy: C[1] - T[1],
            dispatch: O
          }),
          k
        );
      };
  }
  return h.filter = function(w) {
    return arguments.length ? (e = typeof w == "function" ? w : Lt(!!w), h) : e;
  }, h.container = function(w) {
    return arguments.length ? (t = typeof w == "function" ? w : Lt(w), h) : t;
  }, h.subject = function(w) {
    return arguments.length ? (n = typeof w == "function" ? w : Lt(w), h) : n;
  }, h.touchable = function(w) {
    return arguments.length ? (o = typeof w == "function" ? w : Lt(!!w), h) : o;
  }, h.on = function() {
    var w = s.on.apply(s, arguments);
    return w === s ? h : w;
  }, h.clickDistance = function(w) {
    return arguments.length ? (d = (w = +w) * w, h) : Math.sqrt(d);
  }, h;
}
var Qe = 0, ht = 0, ut = 0, pi = 1e3, rn, pt, sn = 0, Fe = 0, wn = 0, vt = typeof performance == "object" && performance.now ? performance : Date, gi = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function yo() {
  return Fe || (gi(Wf), Fe = vt.now() + wn);
}
function Wf() {
  Fe = 0;
}
function an() {
  this._call = this._time = this._next = null;
}
an.prototype = mi.prototype = {
  constructor: an,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? yo() : +n) + (t == null ? 0 : +t), !this._next && pt !== this && (pt ? pt._next = this : rn = this, pt = this), this._call = e, this._time = n, Kn();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Kn());
  }
};
function mi(e, t, n) {
  var o = new an();
  return o.restart(e, t, n), o;
}
function Yf() {
  yo(), ++Qe;
  for (var e = rn, t; e; )
    (t = Fe - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Qe;
}
function sr() {
  Fe = (sn = vt.now()) + wn, Qe = ht = 0;
  try {
    Yf();
  } finally {
    Qe = 0, Zf(), Fe = 0;
  }
}
function Xf() {
  var e = vt.now(), t = e - sn;
  t > pi && (wn -= t, sn = e);
}
function Zf() {
  for (var e, t = rn, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : rn = n);
  pt = e, Kn(o);
}
function Kn(e) {
  if (!Qe) {
    ht && (ht = clearTimeout(ht));
    var t = e - Fe;
    t > 24 ? (e < 1 / 0 && (ht = setTimeout(sr, e - vt.now() - wn)), ut && (ut = clearInterval(ut))) : (ut || (sn = vt.now(), ut = setInterval(Xf, pi)), Qe = 1, gi(sr));
  }
}
function ir(e, t, n) {
  var o = new an();
  return t = t == null ? 0 : +t, o.restart((r) => {
    o.stop(), e(r + t);
  }, t, n), o;
}
var Uf = xn("start", "end", "cancel", "interrupt"), Gf = [], xi = 0, ar = 1, Qn = 2, Qt = 3, cr = 4, Jn = 5, Jt = 6;
function vn(e, t, n, o, r, s) {
  var i = e.__transition;
  if (!i) e.__transition = {};
  else if (n in i) return;
  qf(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: r,
    // For context during callback.
    on: Uf,
    tween: Gf,
    time: s.time,
    delay: s.delay,
    duration: s.duration,
    ease: s.ease,
    timer: null,
    state: xi
  });
}
function wo(e, t) {
  var n = be(e, t);
  if (n.state > xi) throw new Error("too late; already scheduled");
  return n;
}
function Ne(e, t) {
  var n = be(e, t);
  if (n.state > Qt) throw new Error("too late; already running");
  return n;
}
function be(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function qf(e, t, n) {
  var o = e.__transition, r;
  o[t] = n, n.timer = mi(s, 0, n.time);
  function s(c) {
    n.state = ar, n.timer.restart(i, n.delay, n.time), n.delay <= c && i(c - n.delay);
  }
  function i(c) {
    var f, d, h, g;
    if (n.state !== ar) return l();
    for (f in o)
      if (g = o[f], g.name === n.name) {
        if (g.state === Qt) return ir(i);
        g.state === cr ? (g.state = Jt, g.timer.stop(), g.on.call("interrupt", e, e.__data__, g.index, g.group), delete o[f]) : +f < t && (g.state = Jt, g.timer.stop(), g.on.call("cancel", e, e.__data__, g.index, g.group), delete o[f]);
      }
    if (ir(function() {
      n.state === Qt && (n.state = cr, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = Qn, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Qn) {
      for (n.state = Qt, r = new Array(h = n.tween.length), f = 0, d = -1; f < h; ++f)
        (g = n.tween[f].value.call(e, e.__data__, n.index, n.group)) && (r[++d] = g);
      r.length = d + 1;
    }
  }
  function a(c) {
    for (var f = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = Jn, 1), d = -1, h = r.length; ++d < h; )
      r[d].call(e, f);
    n.state === Jn && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = Jt, n.timer.stop(), delete o[t];
    for (var c in o) return;
    delete e.__transition;
  }
}
function en(e, t) {
  var n = e.__transition, o, r, s = !0, i;
  if (n) {
    t = t == null ? null : t + "";
    for (i in n) {
      if ((o = n[i]).name !== t) {
        s = !1;
        continue;
      }
      r = o.state > Qn && o.state < Jn, o.state = Jt, o.timer.stop(), o.on.call(r ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[i];
    }
    s && delete e.__transition;
  }
}
function Kf(e) {
  return this.each(function() {
    en(this, e);
  });
}
function Qf(e, t) {
  var n, o;
  return function() {
    var r = Ne(this, e), s = r.tween;
    if (s !== n) {
      o = n = s;
      for (var i = 0, a = o.length; i < a; ++i)
        if (o[i].name === t) {
          o = o.slice(), o.splice(i, 1);
          break;
        }
    }
    r.tween = o;
  };
}
function Jf(e, t, n) {
  var o, r;
  if (typeof n != "function") throw new Error();
  return function() {
    var s = Ne(this, e), i = s.tween;
    if (i !== o) {
      r = (o = i).slice();
      for (var a = { name: t, value: n }, l = 0, c = r.length; l < c; ++l)
        if (r[l].name === t) {
          r[l] = a;
          break;
        }
      l === c && r.push(a);
    }
    s.tween = r;
  };
}
function eh(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = be(this.node(), n).tween, r = 0, s = o.length, i; r < s; ++r)
      if ((i = o[r]).name === e)
        return i.value;
    return null;
  }
  return this.each((t == null ? Qf : Jf)(n, e, t));
}
function vo(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var r = Ne(this, o);
    (r.value || (r.value = {}))[t] = n.apply(this, arguments);
  }), function(r) {
    return be(r, o).value[t];
  };
}
function yi(e, t) {
  var n;
  return (typeof t == "number" ? Re : t instanceof Vo ? Fo : (n = Vo(t)) ? (t = n, Fo) : el)(e, t);
}
function th(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function nh(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function oh(e, t, n) {
  var o, r = n + "", s;
  return function() {
    var i = this.getAttribute(e);
    return i === r ? null : i === o ? s : s = t(o = i, n);
  };
}
function rh(e, t, n) {
  var o, r = n + "", s;
  return function() {
    var i = this.getAttributeNS(e.space, e.local);
    return i === r ? null : i === o ? s : s = t(o = i, n);
  };
}
function sh(e, t, n) {
  var o, r, s;
  return function() {
    var i, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (i = this.getAttribute(e), l = a + "", i === l ? null : i === o && l === r ? s : (r = l, s = t(o = i, a)));
  };
}
function ih(e, t, n) {
  var o, r, s;
  return function() {
    var i, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (i = this.getAttributeNS(e.space, e.local), l = a + "", i === l ? null : i === o && l === r ? s : (r = l, s = t(o = i, a)));
  };
}
function ah(e, t) {
  var n = yn(e), o = n === "transform" ? pu : yi;
  return this.attrTween(e, typeof t == "function" ? (n.local ? ih : sh)(n, o, vo(this, "attr." + e, t)) : t == null ? (n.local ? nh : th)(n) : (n.local ? rh : oh)(n, o, t));
}
function ch(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function lh(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function uh(e, t) {
  var n, o;
  function r() {
    var s = t.apply(this, arguments);
    return s !== o && (n = (o = s) && lh(e, s)), n;
  }
  return r._value = t, r;
}
function dh(e, t) {
  var n, o;
  function r() {
    var s = t.apply(this, arguments);
    return s !== o && (n = (o = s) && ch(e, s)), n;
  }
  return r._value = t, r;
}
function fh(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var o = yn(e);
  return this.tween(n, (o.local ? uh : dh)(o, t));
}
function hh(e, t) {
  return function() {
    wo(this, e).delay = +t.apply(this, arguments);
  };
}
function ph(e, t) {
  return t = +t, function() {
    wo(this, e).delay = t;
  };
}
function gh(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? hh : ph)(t, e)) : be(this.node(), t).delay;
}
function mh(e, t) {
  return function() {
    Ne(this, e).duration = +t.apply(this, arguments);
  };
}
function xh(e, t) {
  return t = +t, function() {
    Ne(this, e).duration = t;
  };
}
function yh(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? mh : xh)(t, e)) : be(this.node(), t).duration;
}
function wh(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Ne(this, e).ease = t;
  };
}
function vh(e) {
  var t = this._id;
  return arguments.length ? this.each(wh(t, e)) : be(this.node(), t).ease;
}
function bh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Ne(this, e).ease = n;
  };
}
function _h(e) {
  if (typeof e != "function") throw new Error();
  return this.each(bh(this._id, e));
}
function Eh(e) {
  typeof e != "function" && (e = ti(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var s = t[r], i = s.length, a = o[r] = [], l, c = 0; c < i; ++c)
      (l = s[c]) && e.call(l, l.__data__, c, s) && a.push(l);
  return new Ie(o, this._parents, this._name, this._id);
}
function Nh(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, r = n.length, s = Math.min(o, r), i = new Array(o), a = 0; a < s; ++a)
    for (var l = t[a], c = n[a], f = l.length, d = i[a] = new Array(f), h, g = 0; g < f; ++g)
      (h = l[g] || c[g]) && (d[g] = h);
  for (; a < o; ++a)
    i[a] = t[a];
  return new Ie(i, this._parents, this._name, this._id);
}
function Sh(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function Ch(e, t, n) {
  var o, r, s = Sh(t) ? wo : Ne;
  return function() {
    var i = s(this, e), a = i.on;
    a !== o && (r = (o = a).copy()).on(t, n), i.on = r;
  };
}
function Mh(e, t) {
  var n = this._id;
  return arguments.length < 2 ? be(this.node(), n).on.on(e) : this.each(Ch(n, e, t));
}
function jh(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function kh() {
  return this.on("end.remove", jh(this._id));
}
function Ih(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = mo(e));
  for (var o = this._groups, r = o.length, s = new Array(r), i = 0; i < r; ++i)
    for (var a = o[i], l = a.length, c = s[i] = new Array(l), f, d, h = 0; h < l; ++h)
      (f = a[h]) && (d = e.call(f, f.__data__, h, a)) && ("__data__" in f && (d.__data__ = f.__data__), c[h] = d, vn(c[h], t, n, h, c, be(f, n)));
  return new Ie(s, this._parents, t, n);
}
function Ph(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = ei(e));
  for (var o = this._groups, r = o.length, s = [], i = [], a = 0; a < r; ++a)
    for (var l = o[a], c = l.length, f, d = 0; d < c; ++d)
      if (f = l[d]) {
        for (var h = e.call(f, f.__data__, d, l), g, p = be(f, n), v = 0, x = h.length; v < x; ++v)
          (g = h[v]) && vn(g, t, n, v, h, p);
        s.push(h), i.push(f);
      }
  return new Ie(s, i, t, n);
}
var Ah = kt.prototype.constructor;
function Dh() {
  return new Ah(this._groups, this._parents);
}
function Th(e, t) {
  var n, o, r;
  return function() {
    var s = Ke(this, e), i = (this.style.removeProperty(e), Ke(this, e));
    return s === i ? null : s === n && i === o ? r : r = t(n = s, o = i);
  };
}
function wi(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function zh(e, t, n) {
  var o, r = n + "", s;
  return function() {
    var i = Ke(this, e);
    return i === r ? null : i === o ? s : s = t(o = i, n);
  };
}
function $h(e, t, n) {
  var o, r, s;
  return function() {
    var i = Ke(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), Ke(this, e))), i === l ? null : i === o && l === r ? s : (r = l, s = t(o = i, a));
  };
}
function Lh(e, t) {
  var n, o, r, s = "style." + t, i = "end." + s, a;
  return function() {
    var l = Ne(this, e), c = l.on, f = l.value[s] == null ? a || (a = wi(t)) : void 0;
    (c !== n || r !== f) && (o = (n = c).copy()).on(i, r = f), l.on = o;
  };
}
function Rh(e, t, n) {
  var o = (e += "") == "transform" ? hu : yi;
  return t == null ? this.styleTween(e, Th(e, o)).on("end.style." + e, wi(e)) : typeof t == "function" ? this.styleTween(e, $h(e, o, vo(this, "style." + e, t))).each(Lh(this._id, e)) : this.styleTween(e, zh(e, o, t), n).on("end.style." + e, null);
}
function Oh(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function Hh(e, t, n) {
  var o, r;
  function s() {
    var i = t.apply(this, arguments);
    return i !== r && (o = (r = i) && Oh(e, i, n)), o;
  }
  return s._value = t, s;
}
function Bh(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (t == null) return this.tween(o, null);
  if (typeof t != "function") throw new Error();
  return this.tween(o, Hh(e, t, n ?? ""));
}
function Vh(e) {
  return function() {
    this.textContent = e;
  };
}
function Fh(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function Wh(e) {
  return this.tween("text", typeof e == "function" ? Fh(vo(this, "text", e)) : Vh(e == null ? "" : e + ""));
}
function Yh(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Xh(e) {
  var t, n;
  function o() {
    var r = e.apply(this, arguments);
    return r !== n && (t = (n = r) && Yh(r)), t;
  }
  return o._value = e, o;
}
function Zh(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, Xh(e));
}
function Uh() {
  for (var e = this._name, t = this._id, n = vi(), o = this._groups, r = o.length, s = 0; s < r; ++s)
    for (var i = o[s], a = i.length, l, c = 0; c < a; ++c)
      if (l = i[c]) {
        var f = be(l, t);
        vn(l, e, n, c, i, {
          time: f.time + f.delay + f.duration,
          delay: 0,
          duration: f.duration,
          ease: f.ease
        });
      }
  return new Ie(o, this._parents, e, n);
}
function Gh() {
  var e, t, n = this, o = n._id, r = n.size();
  return new Promise(function(s, i) {
    var a = { value: i }, l = { value: function() {
      --r === 0 && s();
    } };
    n.each(function() {
      var c = Ne(this, o), f = c.on;
      f !== e && (t = (e = f).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), c.on = t;
    }), r === 0 && s();
  });
}
var qh = 0;
function Ie(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function vi() {
  return ++qh;
}
var Ce = kt.prototype;
Ie.prototype = {
  constructor: Ie,
  select: Ih,
  selectAll: Ph,
  selectChild: Ce.selectChild,
  selectChildren: Ce.selectChildren,
  filter: Eh,
  merge: Nh,
  selection: Dh,
  transition: Uh,
  call: Ce.call,
  nodes: Ce.nodes,
  node: Ce.node,
  size: Ce.size,
  empty: Ce.empty,
  each: Ce.each,
  on: Mh,
  attr: ah,
  attrTween: fh,
  style: Rh,
  styleTween: Bh,
  text: Wh,
  textTween: Zh,
  remove: kh,
  tween: eh,
  delay: gh,
  duration: yh,
  ease: vh,
  easeVarying: _h,
  end: Gh,
  [Symbol.iterator]: Ce[Symbol.iterator]
};
function Kh(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Qh = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Kh
};
function Jh(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function ep(e) {
  var t, n;
  e instanceof Ie ? (t = e._id, e = e._name) : (t = vi(), (n = Qh).time = yo(), e = e == null ? null : e + "");
  for (var o = this._groups, r = o.length, s = 0; s < r; ++s)
    for (var i = o[s], a = i.length, l, c = 0; c < a; ++c)
      (l = i[c]) && vn(l, e, t, c, i, n || Jh(l, t));
  return new Ie(o, this._parents, e, t);
}
kt.prototype.interrupt = Kf;
kt.prototype.transition = ep;
const Rt = (e) => () => e;
function tp(e, {
  sourceEvent: t,
  target: n,
  transform: o,
  dispatch: r
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: r }
  });
}
function je(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
je.prototype = {
  constructor: je,
  scale: function(e) {
    return e === 1 ? this : new je(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new je(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var bn = new je(1, 0, 0);
bi.prototype = je.prototype;
function bi(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return bn;
  return e.__zoom;
}
function zn(e) {
  e.stopImmediatePropagation();
}
function dt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function np(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function op() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function lr() {
  return this.__zoom || bn;
}
function rp(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function sp() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function ip(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], r = e.invertX(t[1][0]) - n[1][0], s = e.invertY(t[0][1]) - n[0][1], i = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    r > o ? (o + r) / 2 : Math.min(0, o) || Math.max(0, r),
    i > s ? (s + i) / 2 : Math.min(0, s) || Math.max(0, i)
  );
}
function _i() {
  var e = np, t = op, n = ip, o = rp, r = sp, s = [0, 1 / 0], i = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = qt, c = xn("start", "zoom", "end"), f, d, h, g = 500, p = 150, v = 0, x = 10;
  function y(b) {
    b.property("__zoom", lr).on("wheel.zoom", P, { passive: !1 }).on("mousedown.zoom", A).on("dblclick.zoom", O).filter(r).on("touchstart.zoom", C).on("touchmove.zoom", D).on("touchend.zoom touchcancel.zoom", z).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  y.transform = function(b, j, N, M) {
    var I = b.selection ? b.selection() : b;
    I.property("__zoom", lr), b !== I ? S(b, j, N, M) : I.interrupt().each(function() {
      E(this, arguments).event(M).start().zoom(null, typeof j == "function" ? j.apply(this, arguments) : j).end();
    });
  }, y.scaleBy = function(b, j, N, M) {
    y.scaleTo(b, function() {
      var I = this.__zoom.k, T = typeof j == "function" ? j.apply(this, arguments) : j;
      return I * T;
    }, N, M);
  }, y.scaleTo = function(b, j, N, M) {
    y.transform(b, function() {
      var I = t.apply(this, arguments), T = this.__zoom, $ = N == null ? w(I) : typeof N == "function" ? N.apply(this, arguments) : N, L = T.invert($), R = typeof j == "function" ? j.apply(this, arguments) : j;
      return n(m(_(T, R), $, L), I, i);
    }, N, M);
  }, y.translateBy = function(b, j, N, M) {
    y.transform(b, function() {
      return n(this.__zoom.translate(
        typeof j == "function" ? j.apply(this, arguments) : j,
        typeof N == "function" ? N.apply(this, arguments) : N
      ), t.apply(this, arguments), i);
    }, null, M);
  }, y.translateTo = function(b, j, N, M, I) {
    y.transform(b, function() {
      var T = t.apply(this, arguments), $ = this.__zoom, L = M == null ? w(T) : typeof M == "function" ? M.apply(this, arguments) : M;
      return n(bn.translate(L[0], L[1]).scale($.k).translate(
        typeof j == "function" ? -j.apply(this, arguments) : -j,
        typeof N == "function" ? -N.apply(this, arguments) : -N
      ), T, i);
    }, M, I);
  };
  function _(b, j) {
    return j = Math.max(s[0], Math.min(s[1], j)), j === b.k ? b : new je(j, b.x, b.y);
  }
  function m(b, j, N) {
    var M = j[0] - N[0] * b.k, I = j[1] - N[1] * b.k;
    return M === b.x && I === b.y ? b : new je(b.k, M, I);
  }
  function w(b) {
    return [(+b[0][0] + +b[1][0]) / 2, (+b[0][1] + +b[1][1]) / 2];
  }
  function S(b, j, N, M) {
    b.on("start.zoom", function() {
      E(this, arguments).event(M).start();
    }).on("interrupt.zoom end.zoom", function() {
      E(this, arguments).event(M).end();
    }).tween("zoom", function() {
      var I = this, T = arguments, $ = E(I, T).event(M), L = t.apply(I, T), R = N == null ? w(L) : typeof N == "function" ? N.apply(I, T) : N, F = Math.max(L[1][0] - L[0][0], L[1][1] - L[0][1]), V = I.__zoom, Y = typeof j == "function" ? j.apply(I, T) : j, K = l(V.invert(R).concat(F / V.k), Y.invert(R).concat(F / Y.k));
      return function(X) {
        if (X === 1) X = Y;
        else {
          var B = K(X), H = F / B[2];
          X = new je(H, R[0] - B[0] * H, R[1] - B[1] * H);
        }
        $.zoom(null, X);
      };
    });
  }
  function E(b, j, N) {
    return !N && b.__zooming || new k(b, j);
  }
  function k(b, j) {
    this.that = b, this.args = j, this.active = 0, this.sourceEvent = null, this.extent = t.apply(b, j), this.taps = 0;
  }
  k.prototype = {
    event: function(b) {
      return b && (this.sourceEvent = b), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(b, j) {
      return this.mouse && b !== "mouse" && (this.mouse[1] = j.invert(this.mouse[0])), this.touch0 && b !== "touch" && (this.touch0[1] = j.invert(this.touch0[0])), this.touch1 && b !== "touch" && (this.touch1[1] = j.invert(this.touch1[0])), this.that.__zoom = j, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(b) {
      var j = me(this.that).datum();
      c.call(
        b,
        this.that,
        new tp(b, {
          sourceEvent: this.sourceEvent,
          target: y,
          transform: this.that.__zoom,
          dispatch: c
        }),
        j
      );
    }
  };
  function P(b, ...j) {
    if (!e.apply(this, arguments)) return;
    var N = E(this, j).event(b), M = this.__zoom, I = Math.max(s[0], Math.min(s[1], M.k * Math.pow(2, o.apply(this, arguments)))), T = ye(b);
    if (N.wheel)
      (N.mouse[0][0] !== T[0] || N.mouse[0][1] !== T[1]) && (N.mouse[1] = M.invert(N.mouse[0] = T)), clearTimeout(N.wheel);
    else {
      if (M.k === I) return;
      N.mouse = [T, M.invert(T)], en(this), N.start();
    }
    dt(b), N.wheel = setTimeout($, p), N.zoom("mouse", n(m(_(M, I), N.mouse[0], N.mouse[1]), N.extent, i));
    function $() {
      N.wheel = null, N.end();
    }
  }
  function A(b, ...j) {
    if (h || !e.apply(this, arguments)) return;
    var N = b.currentTarget, M = E(this, j, !0).event(b), I = me(b.view).on("mousemove.zoom", R, !0).on("mouseup.zoom", F, !0), T = ye(b, N), $ = b.clientX, L = b.clientY;
    di(b.view), zn(b), M.mouse = [T, this.__zoom.invert(T)], en(this), M.start();
    function R(V) {
      if (dt(V), !M.moved) {
        var Y = V.clientX - $, K = V.clientY - L;
        M.moved = Y * Y + K * K > v;
      }
      M.event(V).zoom("mouse", n(m(M.that.__zoom, M.mouse[0] = ye(V, N), M.mouse[1]), M.extent, i));
    }
    function F(V) {
      I.on("mousemove.zoom mouseup.zoom", null), fi(V.view, M.moved), dt(V), M.event(V).end();
    }
  }
  function O(b, ...j) {
    if (e.apply(this, arguments)) {
      var N = this.__zoom, M = ye(b.changedTouches ? b.changedTouches[0] : b, this), I = N.invert(M), T = N.k * (b.shiftKey ? 0.5 : 2), $ = n(m(_(N, T), M, I), t.apply(this, j), i);
      dt(b), a > 0 ? me(this).transition().duration(a).call(S, $, M, b) : me(this).call(y.transform, $, M, b);
    }
  }
  function C(b, ...j) {
    if (e.apply(this, arguments)) {
      var N = b.touches, M = N.length, I = E(this, j, b.changedTouches.length === M).event(b), T, $, L, R;
      for (zn(b), $ = 0; $ < M; ++$)
        L = N[$], R = ye(L, this), R = [R, this.__zoom.invert(R), L.identifier], I.touch0 ? !I.touch1 && I.touch0[2] !== R[2] && (I.touch1 = R, I.taps = 0) : (I.touch0 = R, T = !0, I.taps = 1 + !!f);
      f && (f = clearTimeout(f)), T && (I.taps < 2 && (d = R[0], f = setTimeout(function() {
        f = null;
      }, g)), en(this), I.start());
    }
  }
  function D(b, ...j) {
    if (this.__zooming) {
      var N = E(this, j).event(b), M = b.changedTouches, I = M.length, T, $, L, R;
      for (dt(b), T = 0; T < I; ++T)
        $ = M[T], L = ye($, this), N.touch0 && N.touch0[2] === $.identifier ? N.touch0[0] = L : N.touch1 && N.touch1[2] === $.identifier && (N.touch1[0] = L);
      if ($ = N.that.__zoom, N.touch1) {
        var F = N.touch0[0], V = N.touch0[1], Y = N.touch1[0], K = N.touch1[1], X = (X = Y[0] - F[0]) * X + (X = Y[1] - F[1]) * X, B = (B = K[0] - V[0]) * B + (B = K[1] - V[1]) * B;
        $ = _($, Math.sqrt(X / B)), L = [(F[0] + Y[0]) / 2, (F[1] + Y[1]) / 2], R = [(V[0] + K[0]) / 2, (V[1] + K[1]) / 2];
      } else if (N.touch0) L = N.touch0[0], R = N.touch0[1];
      else return;
      N.zoom("touch", n(m($, L, R), N.extent, i));
    }
  }
  function z(b, ...j) {
    if (this.__zooming) {
      var N = E(this, j).event(b), M = b.changedTouches, I = M.length, T, $;
      for (zn(b), h && clearTimeout(h), h = setTimeout(function() {
        h = null;
      }, g), T = 0; T < I; ++T)
        $ = M[T], N.touch0 && N.touch0[2] === $.identifier ? delete N.touch0 : N.touch1 && N.touch1[2] === $.identifier && delete N.touch1;
      if (N.touch1 && !N.touch0 && (N.touch0 = N.touch1, delete N.touch1), N.touch0) N.touch0[1] = this.__zoom.invert(N.touch0[0]);
      else if (N.end(), N.taps === 2 && ($ = ye($, this), Math.hypot(d[0] - $[0], d[1] - $[1]) < x)) {
        var L = me(this).on("dblclick.zoom");
        L && L.apply(this, arguments);
      }
    }
  }
  return y.wheelDelta = function(b) {
    return arguments.length ? (o = typeof b == "function" ? b : Rt(+b), y) : o;
  }, y.filter = function(b) {
    return arguments.length ? (e = typeof b == "function" ? b : Rt(!!b), y) : e;
  }, y.touchable = function(b) {
    return arguments.length ? (r = typeof b == "function" ? b : Rt(!!b), y) : r;
  }, y.extent = function(b) {
    return arguments.length ? (t = typeof b == "function" ? b : Rt([[+b[0][0], +b[0][1]], [+b[1][0], +b[1][1]]]), y) : t;
  }, y.scaleExtent = function(b) {
    return arguments.length ? (s[0] = +b[0], s[1] = +b[1], y) : [s[0], s[1]];
  }, y.translateExtent = function(b) {
    return arguments.length ? (i[0][0] = +b[0][0], i[1][0] = +b[1][0], i[0][1] = +b[0][1], i[1][1] = +b[1][1], y) : [[i[0][0], i[0][1]], [i[1][0], i[1][1]]];
  }, y.constrain = function(b) {
    return arguments.length ? (n = b, y) : n;
  }, y.duration = function(b) {
    return arguments.length ? (a = +b, y) : a;
  }, y.interpolate = function(b) {
    return arguments.length ? (l = b, y) : l;
  }, y.on = function() {
    var b = c.on.apply(c, arguments);
    return b === c ? y : b;
  }, y.clickDistance = function(b) {
    return arguments.length ? (v = (b = +b) * b, y) : Math.sqrt(v);
  }, y.tapDistance = function(b) {
    return arguments.length ? (x = +b, y) : x;
  }, y;
}
const Ee = {
  error001: () => "[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001",
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (e) => `Node type "${e}" not found. Using fallback type "default".`,
  error004: () => "The React Flow parent container needs a width and a height to render the graph.",
  error005: () => "Only child nodes can use a parent extent.",
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (e) => `The old edge with id=${e} does not exist.`,
  error009: (e) => `Marker type "${e}" doesn't exist.`,
  error008: (e, { id: t, sourceHandle: n, targetHandle: o }) => `Couldn't create edge for ${e} handle id: "${e === "source" ? n : o}", edge id: ${t}.`,
  error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
  error011: (e) => `Edge type "${e}" not found. Using fallback type "default".`,
  error012: (e) => `Node with id "${e}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
  error013: (e = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${e}/dist/style.css' or base.css to make sure everything is working properly.`,
  error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
  error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs."
}, bt = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], Ei = ["Enter", " ", "Escape"], Ni = {
  "node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.ariaLiveMessage": ({ direction: e, x: t, y: n }) => `Moved selected node ${e}. New position, x: ${t}, y: ${n}`,
  "edge.a11yDescription.default": "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.",
  // Control elements
  "controls.ariaLabel": "Control Panel",
  "controls.zoomIn.ariaLabel": "Zoom In",
  "controls.zoomOut.ariaLabel": "Zoom Out",
  "controls.fitView.ariaLabel": "Fit View",
  "controls.interactive.ariaLabel": "Toggle Interactivity",
  // Mini map
  "minimap.ariaLabel": "Mini Map",
  // Handle
  "handle.ariaLabel": "Handle"
};
var Je;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(Je || (Je = {}));
var Ve;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(Ve || (Ve = {}));
var _t;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(_t || (_t = {}));
const Si = {
  inProgress: !1,
  isValid: null,
  from: null,
  fromHandle: null,
  fromPosition: null,
  fromNode: null,
  to: null,
  toHandle: null,
  toPosition: null,
  toNode: null,
  pointer: null
};
var $e;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})($e || ($e = {}));
var cn;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(cn || (cn = {}));
var W;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(W || (W = {}));
const ur = {
  [W.Left]: W.Right,
  [W.Right]: W.Left,
  [W.Top]: W.Bottom,
  [W.Bottom]: W.Top
};
function Ci(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
const Mi = (e) => "id" in e && "source" in e && "target" in e, ap = (e) => "id" in e && "position" in e && !("source" in e) && !("target" in e), bo = (e) => "id" in e && "internals" in e && !("source" in e) && !("target" in e), It = (e, t = [0, 0]) => {
  const { width: n, height: o } = Pe(e), r = e.origin ?? t, s = n * r[0], i = o * r[1];
  return {
    x: e.position.x - s,
    y: e.position.y - i
  };
}, cp = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  const n = e.reduce((o, r) => {
    const s = typeof r == "string";
    let i = !t.nodeLookup && !s ? r : void 0;
    t.nodeLookup && (i = s ? t.nodeLookup.get(r) : bo(r) ? r : t.nodeLookup.get(r.id));
    const a = i ? ln(i, t.nodeOrigin) : { x: 0, y: 0, x2: 0, y2: 0 };
    return _n(o, a);
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return En(n);
}, Pt = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, o = !1;
  return e.forEach((r) => {
    (t.filter === void 0 || t.filter(r)) && (n = _n(n, ln(r)), o = !0);
  }), o ? En(n) : { x: 0, y: 0, width: 0, height: 0 };
}, _o = (e, t, [n, o, r] = [0, 0, 1], s = !1, i = !1) => {
  const a = {
    ...Dt(t, [n, o, r]),
    width: t.width / r,
    height: t.height / r
  }, l = [];
  for (const c of e.values()) {
    const { measured: f, selectable: d = !0, hidden: h = !1 } = c;
    if (i && !d || h)
      continue;
    const g = f.width ?? c.width ?? c.initialWidth ?? null, p = f.height ?? c.height ?? c.initialHeight ?? null, v = Et(a, tt(c)), x = (g ?? 0) * (p ?? 0), y = s && v > 0;
    (!c.internals.handleBounds || y || v >= x || c.dragging) && l.push(c);
  }
  return l;
}, lp = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((o) => {
    n.add(o.id);
  }), t.filter((o) => n.has(o.source) || n.has(o.target));
};
function up(e, t) {
  const n = /* @__PURE__ */ new Map(), o = t?.nodes ? new Set(t.nodes.map((r) => r.id)) : null;
  return e.forEach((r) => {
    r.measured.width && r.measured.height && (t?.includeHiddenNodes || !r.hidden) && (!o || o.has(r.id)) && n.set(r.id, r);
  }), n;
}
async function dp({ nodes: e, width: t, height: n, panZoom: o, minZoom: r, maxZoom: s }, i) {
  if (e.size === 0)
    return Promise.resolve(!0);
  const a = up(e, i), l = Pt(a), c = Eo(l, t, n, i?.minZoom ?? r, i?.maxZoom ?? s, i?.padding ?? 0.1);
  return await o.setViewport(c, {
    duration: i?.duration,
    ease: i?.ease,
    interpolate: i?.interpolate
  }), Promise.resolve(!0);
}
function ji({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: o = [0, 0], nodeExtent: r, onError: s }) {
  const i = n.get(e), a = i.parentId ? n.get(i.parentId) : void 0, { x: l, y: c } = a ? a.internals.positionAbsolute : { x: 0, y: 0 }, f = i.origin ?? o;
  let d = i.extent || r;
  if (i.extent === "parent" && !i.expandParent)
    if (!a)
      s?.("005", Ee.error005());
    else {
      const g = a.measured.width, p = a.measured.height;
      g && p && (d = [
        [l, c],
        [l + g, c + p]
      ]);
    }
  else a && nt(i.extent) && (d = [
    [i.extent[0][0] + l, i.extent[0][1] + c],
    [i.extent[1][0] + l, i.extent[1][1] + c]
  ]);
  const h = nt(d) ? We(t, d, i.measured) : t;
  return (i.measured.width === void 0 || i.measured.height === void 0) && s?.("015", Ee.error015()), {
    position: {
      x: h.x - l + (i.measured.width ?? 0) * f[0],
      y: h.y - c + (i.measured.height ?? 0) * f[1]
    },
    positionAbsolute: h
  };
}
async function fp({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: o, onBeforeDelete: r }) {
  const s = new Set(e.map((h) => h.id)), i = [];
  for (const h of n) {
    if (h.deletable === !1)
      continue;
    const g = s.has(h.id), p = !g && h.parentId && i.find((v) => v.id === h.parentId);
    (g || p) && i.push(h);
  }
  const a = new Set(t.map((h) => h.id)), l = o.filter((h) => h.deletable !== !1), f = lp(i, l);
  for (const h of l)
    a.has(h.id) && !f.find((p) => p.id === h.id) && f.push(h);
  if (!r)
    return {
      edges: f,
      nodes: i
    };
  const d = await r({
    nodes: i,
    edges: f
  });
  return typeof d == "boolean" ? d ? { edges: f, nodes: i } : { edges: [], nodes: [] } : d;
}
const et = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), We = (e = { x: 0, y: 0 }, t, n) => ({
  x: et(e.x, t[0][0], t[1][0] - (n?.width ?? 0)),
  y: et(e.y, t[0][1], t[1][1] - (n?.height ?? 0))
});
function ki(e, t, n) {
  const { width: o, height: r } = Pe(n), { x: s, y: i } = n.internals.positionAbsolute;
  return We(e, [
    [s, i],
    [s + o, i + r]
  ], t);
}
const dr = (e, t, n) => e < t ? et(Math.abs(e - t), 1, t) / t : e > n ? -et(Math.abs(e - n), 1, t) / t : 0, Ii = (e, t, n = 15, o = 40) => {
  const r = dr(e.x, o, t.width - o) * n, s = dr(e.y, o, t.height - o) * n;
  return [r, s];
}, _n = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), eo = ({ x: e, y: t, width: n, height: o }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + o
}), En = ({ x: e, y: t, x2: n, y2: o }) => ({
  x: e,
  y: t,
  width: n - e,
  height: o - t
}), tt = (e, t = [0, 0]) => {
  const { x: n, y: o } = bo(e) ? e.internals.positionAbsolute : It(e, t);
  return {
    x: n,
    y: o,
    width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
    height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
  };
}, ln = (e, t = [0, 0]) => {
  const { x: n, y: o } = bo(e) ? e.internals.positionAbsolute : It(e, t);
  return {
    x: n,
    y: o,
    x2: n + (e.measured?.width ?? e.width ?? e.initialWidth ?? 0),
    y2: o + (e.measured?.height ?? e.height ?? e.initialHeight ?? 0)
  };
}, Pi = (e, t) => En(_n(eo(e), eo(t))), Et = (e, t) => {
  const n = Math.max(0, Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)), o = Math.max(0, Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y));
  return Math.ceil(n * o);
}, fr = (e) => we(e.width) && we(e.height) && we(e.x) && we(e.y), we = (e) => !isNaN(e) && isFinite(e), hp = (e, t) => {
}, At = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), Dt = ({ x: e, y: t }, [n, o, r], s = !1, i = [1, 1]) => {
  const a = {
    x: (e - n) / r,
    y: (t - o) / r
  };
  return s ? At(a, i) : a;
}, un = ({ x: e, y: t }, [n, o, r]) => ({
  x: e * r + n,
  y: t * r + o
});
function Ze(e, t) {
  if (typeof e == "number")
    return Math.floor((t - t / (1 + e)) * 0.5);
  if (typeof e == "string" && e.endsWith("px")) {
    const n = parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(n);
  }
  if (typeof e == "string" && e.endsWith("%")) {
    const n = parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(t * n * 0.01);
  }
  return console.error(`[React Flow] The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function pp(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const o = Ze(e, n), r = Ze(e, t);
    return {
      top: o,
      right: r,
      bottom: o,
      left: r,
      x: r * 2,
      y: o * 2
    };
  }
  if (typeof e == "object") {
    const o = Ze(e.top ?? e.y ?? 0, n), r = Ze(e.bottom ?? e.y ?? 0, n), s = Ze(e.left ?? e.x ?? 0, t), i = Ze(e.right ?? e.x ?? 0, t);
    return { top: o, right: i, bottom: r, left: s, x: s + i, y: o + r };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function gp(e, t, n, o, r, s) {
  const { x: i, y: a } = un(e, [t, n, o]), { x: l, y: c } = un({ x: e.x + e.width, y: e.y + e.height }, [t, n, o]), f = r - l, d = s - c;
  return {
    left: Math.floor(i),
    top: Math.floor(a),
    right: Math.floor(f),
    bottom: Math.floor(d)
  };
}
const Eo = (e, t, n, o, r, s) => {
  const i = pp(s, t, n), a = (t - i.x) / e.width, l = (n - i.y) / e.height, c = Math.min(a, l), f = et(c, o, r), d = e.x + e.width / 2, h = e.y + e.height / 2, g = t / 2 - d * f, p = n / 2 - h * f, v = gp(e, g, p, f, t, n), x = {
    left: Math.min(v.left - i.left, 0),
    top: Math.min(v.top - i.top, 0),
    right: Math.min(v.right - i.right, 0),
    bottom: Math.min(v.bottom - i.bottom, 0)
  };
  return {
    x: g - x.left + x.right,
    y: p - x.top + x.bottom,
    zoom: f
  };
}, Nt = () => typeof navigator < "u" && navigator?.userAgent?.indexOf("Mac") >= 0;
function nt(e) {
  return e != null && e !== "parent";
}
function Pe(e) {
  return {
    width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
    height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
  };
}
function Ai(e) {
  return (e.measured?.width ?? e.width ?? e.initialWidth) !== void 0 && (e.measured?.height ?? e.height ?? e.initialHeight) !== void 0;
}
function Di(e, t = { width: 0, height: 0 }, n, o, r) {
  const s = { ...e }, i = o.get(n);
  if (i) {
    const a = i.origin || r;
    s.x += i.internals.positionAbsolute.x - (t.width ?? 0) * a[0], s.y += i.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return s;
}
function hr(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function mp() {
  let e, t;
  return { promise: new Promise((o, r) => {
    e = o, t = r;
  }), resolve: e, reject: t };
}
function xp(e) {
  return { ...Ni, ...e || {} };
}
function mt(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: o, containerBounds: r }) {
  const { x: s, y: i } = ve(e), a = Dt({ x: s - (r?.left ?? 0), y: i - (r?.top ?? 0) }, o), { x: l, y: c } = n ? At(a, t) : a;
  return {
    xSnapped: l,
    ySnapped: c,
    ...a
  };
}
const No = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), Ti = (e) => e?.getRootNode?.() || window?.document, yp = ["INPUT", "SELECT", "TEXTAREA"];
function zi(e) {
  const t = e.composedPath?.()?.[0] || e.target;
  return t?.nodeType !== 1 ? !1 : yp.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const $i = (e) => "clientX" in e, ve = (e, t) => {
  const n = $i(e), o = n ? e.clientX : e.touches?.[0].clientX, r = n ? e.clientY : e.touches?.[0].clientY;
  return {
    x: o - (t?.left ?? 0),
    y: r - (t?.top ?? 0)
  };
}, pr = (e, t, n, o, r) => {
  const s = t.querySelectorAll(`.${e}`);
  return !s || !s.length ? null : Array.from(s).map((i) => {
    const a = i.getBoundingClientRect();
    return {
      id: i.getAttribute("data-handleid"),
      type: e,
      nodeId: r,
      position: i.getAttribute("data-handlepos"),
      x: (a.left - n.left) / o,
      y: (a.top - n.top) / o,
      ...No(i)
    };
  });
};
function Li({ sourceX: e, sourceY: t, targetX: n, targetY: o, sourceControlX: r, sourceControlY: s, targetControlX: i, targetControlY: a }) {
  const l = e * 0.125 + r * 0.375 + i * 0.375 + n * 0.125, c = t * 0.125 + s * 0.375 + a * 0.375 + o * 0.125, f = Math.abs(l - e), d = Math.abs(c - t);
  return [l, c, f, d];
}
function Ot(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function gr({ pos: e, x1: t, y1: n, x2: o, y2: r, c: s }) {
  switch (e) {
    case W.Left:
      return [t - Ot(t - o, s), n];
    case W.Right:
      return [t + Ot(o - t, s), n];
    case W.Top:
      return [t, n - Ot(n - r, s)];
    case W.Bottom:
      return [t, n + Ot(r - n, s)];
  }
}
function Ri({ sourceX: e, sourceY: t, sourcePosition: n = W.Bottom, targetX: o, targetY: r, targetPosition: s = W.Top, curvature: i = 0.25 }) {
  const [a, l] = gr({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: r,
    c: i
  }), [c, f] = gr({
    pos: s,
    x1: o,
    y1: r,
    x2: e,
    y2: t,
    c: i
  }), [d, h, g, p] = Li({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: r,
    sourceControlX: a,
    sourceControlY: l,
    targetControlX: c,
    targetControlY: f
  });
  return [
    `M${e},${t} C${a},${l} ${c},${f} ${o},${r}`,
    d,
    h,
    g,
    p
  ];
}
function Oi({ sourceX: e, sourceY: t, targetX: n, targetY: o }) {
  const r = Math.abs(n - e) / 2, s = n < e ? n + r : n - r, i = Math.abs(o - t) / 2, a = o < t ? o + i : o - i;
  return [s, a, r, i];
}
function wp({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: o = 0, elevateOnSelect: r = !1, zIndexMode: s = "basic" }) {
  if (s === "manual")
    return o;
  const i = r && n ? o + 1e3 : o, a = Math.max(e.parentId || r && e.selected ? e.internals.z : 0, t.parentId || r && t.selected ? t.internals.z : 0);
  return i + a;
}
function vp({ sourceNode: e, targetNode: t, width: n, height: o, transform: r }) {
  const s = _n(ln(e), ln(t));
  s.x === s.x2 && (s.x2 += 1), s.y === s.y2 && (s.y2 += 1);
  const i = {
    x: -r[0] / r[2],
    y: -r[1] / r[2],
    width: n / r[2],
    height: o / r[2]
  };
  return Et(i, En(s)) > 0;
}
const bp = ({ source: e, sourceHandle: t, target: n, targetHandle: o }) => `xy-edge__${e}${t || ""}-${n}${o || ""}`, _p = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), Ep = (e, t, n = {}) => {
  if (!e.source || !e.target)
    return t;
  const o = n.getEdgeId || bp;
  let r;
  return Mi(e) ? r = { ...e } : r = {
    ...e,
    id: o(e)
  }, _p(r, t) ? t : (r.sourceHandle === null && delete r.sourceHandle, r.targetHandle === null && delete r.targetHandle, t.concat(r));
};
function Hi({ sourceX: e, sourceY: t, targetX: n, targetY: o }) {
  const [r, s, i, a] = Oi({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: o
  });
  return [`M ${e},${t}L ${n},${o}`, r, s, i, a];
}
const mr = {
  [W.Left]: { x: -1, y: 0 },
  [W.Right]: { x: 1, y: 0 },
  [W.Top]: { x: 0, y: -1 },
  [W.Bottom]: { x: 0, y: 1 }
}, Np = ({ source: e, sourcePosition: t = W.Bottom, target: n }) => t === W.Left || t === W.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, xr = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function Sp({ source: e, sourcePosition: t = W.Bottom, target: n, targetPosition: o = W.Top, center: r, offset: s, stepPosition: i }) {
  const a = mr[t], l = mr[o], c = { x: e.x + a.x * s, y: e.y + a.y * s }, f = { x: n.x + l.x * s, y: n.y + l.y * s }, d = Np({
    source: c,
    sourcePosition: t,
    target: f
  }), h = d.x !== 0 ? "x" : "y", g = d[h];
  let p = [], v, x;
  const y = { x: 0, y: 0 }, _ = { x: 0, y: 0 }, [, , m, w] = Oi({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[h] * l[h] === -1) {
    h === "x" ? (v = r.x ?? c.x + (f.x - c.x) * i, x = r.y ?? (c.y + f.y) / 2) : (v = r.x ?? (c.x + f.x) / 2, x = r.y ?? c.y + (f.y - c.y) * i);
    const P = [
      { x: v, y: c.y },
      { x: v, y: f.y }
    ], A = [
      { x: c.x, y: x },
      { x: f.x, y: x }
    ];
    a[h] === g ? p = h === "x" ? P : A : p = h === "x" ? A : P;
  } else {
    const P = [{ x: c.x, y: f.y }], A = [{ x: f.x, y: c.y }];
    if (h === "x" ? p = a.x === g ? A : P : p = a.y === g ? P : A, t === o) {
      const b = Math.abs(e[h] - n[h]);
      if (b <= s) {
        const j = Math.min(s - 1, s - b);
        a[h] === g ? y[h] = (c[h] > e[h] ? -1 : 1) * j : _[h] = (f[h] > n[h] ? -1 : 1) * j;
      }
    }
    if (t !== o) {
      const b = h === "x" ? "y" : "x", j = a[h] === l[b], N = c[b] > f[b], M = c[b] < f[b];
      (a[h] === 1 && (!j && N || j && M) || a[h] !== 1 && (!j && M || j && N)) && (p = h === "x" ? P : A);
    }
    const O = { x: c.x + y.x, y: c.y + y.y }, C = { x: f.x + _.x, y: f.y + _.y }, D = Math.max(Math.abs(O.x - p[0].x), Math.abs(C.x - p[0].x)), z = Math.max(Math.abs(O.y - p[0].y), Math.abs(C.y - p[0].y));
    D >= z ? (v = (O.x + C.x) / 2, x = p[0].y) : (v = p[0].x, x = (O.y + C.y) / 2);
  }
  const S = { x: c.x + y.x, y: c.y + y.y }, E = { x: f.x + _.x, y: f.y + _.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...S.x !== p[0].x || S.y !== p[0].y ? [S] : [],
    ...p,
    ...E.x !== p[p.length - 1].x || E.y !== p[p.length - 1].y ? [E] : [],
    n
  ], v, x, m, w];
}
function Cp(e, t, n, o) {
  const r = Math.min(xr(e, t) / 2, xr(t, n) / 2, o), { x: s, y: i } = t;
  if (e.x === s && s === n.x || e.y === i && i === n.y)
    return `L${s} ${i}`;
  if (e.y === i) {
    const c = e.x < n.x ? -1 : 1, f = e.y < n.y ? 1 : -1;
    return `L ${s + r * c},${i}Q ${s},${i} ${s},${i + r * f}`;
  }
  const a = e.x < n.x ? 1 : -1, l = e.y < n.y ? -1 : 1;
  return `L ${s},${i + r * l}Q ${s},${i} ${s + r * a},${i}`;
}
function dn({ sourceX: e, sourceY: t, sourcePosition: n = W.Bottom, targetX: o, targetY: r, targetPosition: s = W.Top, borderRadius: i = 5, centerX: a, centerY: l, offset: c = 20, stepPosition: f = 0.5 }) {
  const [d, h, g, p, v] = Sp({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: o, y: r },
    targetPosition: s,
    center: { x: a, y: l },
    offset: c,
    stepPosition: f
  });
  let x = `M${d[0].x} ${d[0].y}`;
  for (let y = 1; y < d.length - 1; y++)
    x += Cp(d[y - 1], d[y], d[y + 1], i);
  return x += `L${d[d.length - 1].x} ${d[d.length - 1].y}`, [x, h, g, p, v];
}
function yr(e) {
  return e && !!(e.internals.handleBounds || e.handles?.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function Mp(e) {
  const { sourceNode: t, targetNode: n } = e;
  if (!yr(t) || !yr(n))
    return null;
  const o = t.internals.handleBounds || wr(t.handles), r = n.internals.handleBounds || wr(n.handles), s = vr(o?.source ?? [], e.sourceHandle), i = vr(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === Je.Strict ? r?.target ?? [] : (r?.target ?? []).concat(r?.source ?? []),
    e.targetHandle
  );
  if (!s || !i)
    return e.onError?.("008", Ee.error008(s ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const a = s?.position || W.Bottom, l = i?.position || W.Top, c = Ye(t, s, a), f = Ye(n, i, l);
  return {
    sourceX: c.x,
    sourceY: c.y,
    targetX: f.x,
    targetY: f.y,
    sourcePosition: a,
    targetPosition: l
  };
}
function wr(e) {
  if (!e)
    return null;
  const t = [], n = [];
  for (const o of e)
    o.width = o.width ?? 1, o.height = o.height ?? 1, o.type === "source" ? t.push(o) : o.type === "target" && n.push(o);
  return {
    source: t,
    target: n
  };
}
function Ye(e, t, n = W.Left, o = !1) {
  const r = (t?.x ?? 0) + e.internals.positionAbsolute.x, s = (t?.y ?? 0) + e.internals.positionAbsolute.y, { width: i, height: a } = t ?? Pe(e);
  if (o)
    return { x: r + i / 2, y: s + a / 2 };
  switch (t?.position ?? n) {
    case W.Top:
      return { x: r + i / 2, y: s };
    case W.Right:
      return { x: r + i, y: s + a / 2 };
    case W.Bottom:
      return { x: r + i / 2, y: s + a };
    case W.Left:
      return { x: r, y: s + a / 2 };
  }
}
function vr(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function to(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((o) => `${o}=${e[o]}`).join("&")}` : "";
}
function jp(e, { id: t, defaultColor: n, defaultMarkerStart: o, defaultMarkerEnd: r }) {
  const s = /* @__PURE__ */ new Set();
  return e.reduce((i, a) => ([a.markerStart || o, a.markerEnd || r].forEach((l) => {
    if (l && typeof l == "object") {
      const c = to(l, t);
      s.has(c) || (i.push({ id: c, color: l.color || n, ...l }), s.add(c));
    }
  }), i), []).sort((i, a) => i.id.localeCompare(a.id));
}
const Bi = 1e3, kp = 10, So = {
  nodeOrigin: [0, 0],
  nodeExtent: bt,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, Ip = {
  ...So,
  checkEquality: !0
};
function Co(e, t) {
  const n = { ...e };
  for (const o in t)
    t[o] !== void 0 && (n[o] = t[o]);
  return n;
}
function Pp(e, t, n) {
  const o = Co(So, n);
  for (const r of e.values())
    if (r.parentId)
      jo(r, e, t, o);
    else {
      const s = It(r, o.nodeOrigin), i = nt(r.extent) ? r.extent : o.nodeExtent, a = We(s, i, Pe(r));
      r.internals.positionAbsolute = a;
    }
}
function Ap(e, t) {
  if (!e.handles)
    return e.measured ? t?.internals.handleBounds : void 0;
  const n = [], o = [];
  for (const r of e.handles) {
    const s = {
      id: r.id,
      width: r.width ?? 1,
      height: r.height ?? 1,
      nodeId: e.id,
      x: r.x,
      y: r.y,
      position: r.position,
      type: r.type
    };
    r.type === "source" ? n.push(s) : r.type === "target" && o.push(s);
  }
  return {
    source: n,
    target: o
  };
}
function Mo(e) {
  return e === "manual";
}
function no(e, t, n, o = {}) {
  const r = Co(Ip, o), s = { i: 0 }, i = new Map(t), a = r?.elevateNodesOnSelect && !Mo(r.zIndexMode) ? Bi : 0;
  let l = e.length > 0, c = !1;
  t.clear(), n.clear();
  for (const f of e) {
    let d = i.get(f.id);
    if (r.checkEquality && f === d?.internals.userNode)
      t.set(f.id, d);
    else {
      const h = It(f, r.nodeOrigin), g = nt(f.extent) ? f.extent : r.nodeExtent, p = We(h, g, Pe(f));
      d = {
        ...r.defaults,
        ...f,
        measured: {
          width: f.measured?.width,
          height: f.measured?.height
        },
        internals: {
          positionAbsolute: p,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: Ap(f, d),
          z: Vi(f, a, r.zIndexMode),
          userNode: f
        }
      }, t.set(f.id, d);
    }
    (d.measured === void 0 || d.measured.width === void 0 || d.measured.height === void 0) && !d.hidden && (l = !1), f.parentId && jo(d, t, n, o, s), c ||= f.selected ?? !1;
  }
  return { nodesInitialized: l, hasSelectedNodes: c };
}
function Dp(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function jo(e, t, n, o, r) {
  const { elevateNodesOnSelect: s, nodeOrigin: i, nodeExtent: a, zIndexMode: l } = Co(So, o), c = e.parentId, f = t.get(c);
  if (!f) {
    console.warn(`Parent node ${c} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  Dp(e, n), r && !f.parentId && f.internals.rootParentIndex === void 0 && l === "auto" && (f.internals.rootParentIndex = ++r.i, f.internals.z = f.internals.z + r.i * kp), r && f.internals.rootParentIndex !== void 0 && (r.i = f.internals.rootParentIndex);
  const d = s && !Mo(l) ? Bi : 0, { x: h, y: g, z: p } = Tp(e, f, i, a, d, l), { positionAbsolute: v } = e.internals, x = h !== v.x || g !== v.y;
  (x || p !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: x ? { x: h, y: g } : v,
      z: p
    }
  });
}
function Vi(e, t, n) {
  const o = we(e.zIndex) ? e.zIndex : 0;
  return Mo(n) ? o : o + (e.selected ? t : 0);
}
function Tp(e, t, n, o, r, s) {
  const { x: i, y: a } = t.internals.positionAbsolute, l = Pe(e), c = It(e, n), f = nt(e.extent) ? We(c, e.extent, l) : c;
  let d = We({ x: i + f.x, y: a + f.y }, o, l);
  e.extent === "parent" && (d = ki(d, l, t));
  const h = Vi(e, r, s), g = t.internals.z ?? 0;
  return {
    x: d.x,
    y: d.y,
    z: g >= h ? g + 1 : h
  };
}
function ko(e, t, n, o = [0, 0]) {
  const r = [], s = /* @__PURE__ */ new Map();
  for (const i of e) {
    const a = t.get(i.parentId);
    if (!a)
      continue;
    const l = s.get(i.parentId)?.expandedRect ?? tt(a), c = Pi(l, i.rect);
    s.set(i.parentId, { expandedRect: c, parent: a });
  }
  return s.size > 0 && s.forEach(({ expandedRect: i, parent: a }, l) => {
    const c = a.internals.positionAbsolute, f = Pe(a), d = a.origin ?? o, h = i.x < c.x ? Math.round(Math.abs(c.x - i.x)) : 0, g = i.y < c.y ? Math.round(Math.abs(c.y - i.y)) : 0, p = Math.max(f.width, Math.round(i.width)), v = Math.max(f.height, Math.round(i.height)), x = (p - f.width) * d[0], y = (v - f.height) * d[1];
    (h > 0 || g > 0 || x || y) && (r.push({
      id: l,
      type: "position",
      position: {
        x: a.position.x - h + x,
        y: a.position.y - g + y
      }
    }), n.get(l)?.forEach((_) => {
      e.some((m) => m.id === _.id) || r.push({
        id: _.id,
        type: "position",
        position: {
          x: _.position.x + h,
          y: _.position.y + g
        }
      });
    })), (f.width < i.width || f.height < i.height || h || g) && r.push({
      id: l,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: p + (h ? d[0] * h - x : 0),
        height: v + (g ? d[1] * g - y : 0)
      }
    });
  }), r;
}
function zp(e, t, n, o, r, s, i) {
  const a = o?.querySelector(".xyflow__viewport");
  let l = !1;
  if (!a)
    return { changes: [], updatedInternals: l };
  const c = [], f = window.getComputedStyle(a), { m22: d } = new window.DOMMatrixReadOnly(f.transform), h = [];
  for (const g of e.values()) {
    const p = t.get(g.id);
    if (!p)
      continue;
    if (p.hidden) {
      t.set(p.id, {
        ...p,
        internals: {
          ...p.internals,
          handleBounds: void 0
        }
      }), l = !0;
      continue;
    }
    const v = No(g.nodeElement), x = p.measured.width !== v.width || p.measured.height !== v.height;
    if (!!(v.width && v.height && (x || !p.internals.handleBounds || g.force))) {
      const _ = g.nodeElement.getBoundingClientRect(), m = nt(p.extent) ? p.extent : s;
      let { positionAbsolute: w } = p.internals;
      p.parentId && p.extent === "parent" ? w = ki(w, v, t.get(p.parentId)) : m && (w = We(w, m, v));
      const S = {
        ...p,
        measured: v,
        internals: {
          ...p.internals,
          positionAbsolute: w,
          handleBounds: {
            source: pr("source", g.nodeElement, _, d, p.id),
            target: pr("target", g.nodeElement, _, d, p.id)
          }
        }
      };
      t.set(p.id, S), p.parentId && jo(S, t, n, { nodeOrigin: r, zIndexMode: i }), l = !0, x && (c.push({
        id: p.id,
        type: "dimensions",
        dimensions: v
      }), p.expandParent && p.parentId && h.push({
        id: p.id,
        parentId: p.parentId,
        rect: tt(S, r)
      }));
    }
  }
  if (h.length > 0) {
    const g = ko(h, t, n, r);
    c.push(...g);
  }
  return { changes: c, updatedInternals: l };
}
async function $p({ delta: e, panZoom: t, transform: n, translateExtent: o, width: r, height: s }) {
  if (!t || !e.x && !e.y)
    return Promise.resolve(!1);
  const i = await t.setViewportConstrained({
    x: n[0] + e.x,
    y: n[1] + e.y,
    zoom: n[2]
  }, [
    [0, 0],
    [r, s]
  ], o), a = !!i && (i.x !== n[0] || i.y !== n[1] || i.k !== n[2]);
  return Promise.resolve(a);
}
function br(e, t, n, o, r, s) {
  let i = r;
  const a = o.get(i) || /* @__PURE__ */ new Map();
  o.set(i, a.set(n, t)), i = `${r}-${e}`;
  const l = o.get(i) || /* @__PURE__ */ new Map();
  if (o.set(i, l.set(n, t)), s) {
    i = `${r}-${e}-${s}`;
    const c = o.get(i) || /* @__PURE__ */ new Map();
    o.set(i, c.set(n, t));
  }
}
function Fi(e, t, n) {
  e.clear(), t.clear();
  for (const o of n) {
    const { source: r, target: s, sourceHandle: i = null, targetHandle: a = null } = o, l = { edgeId: o.id, source: r, target: s, sourceHandle: i, targetHandle: a }, c = `${r}-${i}--${s}-${a}`, f = `${s}-${a}--${r}-${i}`;
    br("source", l, f, e, r, i), br("target", l, c, e, s, a), t.set(o.id, o);
  }
}
function Wi(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : Wi(n, t) : !1;
}
function _r(e, t, n) {
  let o = e;
  do {
    if (o?.matches?.(t))
      return !0;
    if (o === n)
      return !1;
    o = o?.parentElement;
  } while (o);
  return !1;
}
function Lp(e, t, n, o) {
  const r = /* @__PURE__ */ new Map();
  for (const [s, i] of e)
    if ((i.selected || i.id === o) && (!i.parentId || !Wi(i, e)) && (i.draggable || t && typeof i.draggable > "u")) {
      const a = e.get(s);
      a && r.set(s, {
        id: s,
        position: a.position || { x: 0, y: 0 },
        distance: {
          x: n.x - a.internals.positionAbsolute.x,
          y: n.y - a.internals.positionAbsolute.y
        },
        extent: a.extent,
        parentId: a.parentId,
        origin: a.origin,
        expandParent: a.expandParent,
        internals: {
          positionAbsolute: a.internals.positionAbsolute || { x: 0, y: 0 }
        },
        measured: {
          width: a.measured.width ?? 0,
          height: a.measured.height ?? 0
        }
      });
    }
  return r;
}
function $n({ nodeId: e, dragItems: t, nodeLookup: n, dragging: o = !0 }) {
  const r = [];
  for (const [i, a] of t) {
    const l = n.get(i)?.internals.userNode;
    l && r.push({
      ...l,
      position: a.position,
      dragging: o
    });
  }
  if (!e)
    return [r[0], r];
  const s = n.get(e)?.internals.userNode;
  return [
    s ? {
      ...s,
      position: t.get(e)?.position || s.position,
      dragging: o
    } : r[0],
    r
  ];
}
function Rp({ dragItems: e, snapGrid: t, x: n, y: o }) {
  const r = e.values().next().value;
  if (!r)
    return null;
  const s = {
    x: n - r.distance.x,
    y: o - r.distance.y
  }, i = At(s, t);
  return {
    x: i.x - s.x,
    y: i.y - s.y
  };
}
function Op({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: o, onDragStop: r }) {
  let s = { x: null, y: null }, i = 0, a = /* @__PURE__ */ new Map(), l = !1, c = { x: 0, y: 0 }, f = null, d = !1, h = null, g = !1, p = !1, v = null;
  function x({ noDragClassName: _, handleSelector: m, domNode: w, isSelectable: S, nodeId: E, nodeClickDistance: k = 0 }) {
    h = me(w);
    function P({ x: D, y: z }) {
      const { nodeLookup: b, nodeExtent: j, snapGrid: N, snapToGrid: M, nodeOrigin: I, onNodeDrag: T, onSelectionDrag: $, onError: L, updateNodePositions: R } = t();
      s = { x: D, y: z };
      let F = !1;
      const V = a.size > 1, Y = V && j ? eo(Pt(a)) : null, K = V && M ? Rp({
        dragItems: a,
        snapGrid: N,
        x: D,
        y: z
      }) : null;
      for (const [X, B] of a) {
        if (!b.has(X))
          continue;
        let H = { x: D - B.distance.x, y: z - B.distance.y };
        M && (H = K ? {
          x: Math.round(H.x + K.x),
          y: Math.round(H.y + K.y)
        } : At(H, N));
        let Z = null;
        if (V && j && !B.extent && Y) {
          const { positionAbsolute: q } = B.internals, re = q.x - Y.x + j[0][0], ae = q.x + B.measured.width - Y.x2 + j[1][0], se = q.y - Y.y + j[0][1], pe = q.y + B.measured.height - Y.y2 + j[1][1];
          Z = [
            [re, se],
            [ae, pe]
          ];
        }
        const { position: Q, positionAbsolute: G } = ji({
          nodeId: X,
          nextPosition: H,
          nodeLookup: b,
          nodeExtent: Z || j,
          nodeOrigin: I,
          onError: L
        });
        F = F || B.position.x !== Q.x || B.position.y !== Q.y, B.position = Q, B.internals.positionAbsolute = G;
      }
      if (p = p || F, !!F && (R(a, !0), v && (o || T || !E && $))) {
        const [X, B] = $n({
          nodeId: E,
          dragItems: a,
          nodeLookup: b
        });
        o?.(v, a, X, B), T?.(v, X, B), E || $?.(v, B);
      }
    }
    async function A() {
      if (!f)
        return;
      const { transform: D, panBy: z, autoPanSpeed: b, autoPanOnNodeDrag: j } = t();
      if (!j) {
        l = !1, cancelAnimationFrame(i);
        return;
      }
      const [N, M] = Ii(c, f, b);
      (N !== 0 || M !== 0) && (s.x = (s.x ?? 0) - N / D[2], s.y = (s.y ?? 0) - M / D[2], await z({ x: N, y: M }) && P(s)), i = requestAnimationFrame(A);
    }
    function O(D) {
      const { nodeLookup: z, multiSelectionActive: b, nodesDraggable: j, transform: N, snapGrid: M, snapToGrid: I, selectNodesOnDrag: T, onNodeDragStart: $, onSelectionDragStart: L, unselectNodesAndEdges: R } = t();
      d = !0, (!T || !S) && !b && E && (z.get(E)?.selected || R()), S && T && E && e?.(E);
      const F = mt(D.sourceEvent, { transform: N, snapGrid: M, snapToGrid: I, containerBounds: f });
      if (s = F, a = Lp(z, j, F, E), a.size > 0 && (n || $ || !E && L)) {
        const [V, Y] = $n({
          nodeId: E,
          dragItems: a,
          nodeLookup: z
        });
        n?.(D.sourceEvent, a, V, Y), $?.(D.sourceEvent, V, Y), E || L?.(D.sourceEvent, Y);
      }
    }
    const C = hi().clickDistance(k).on("start", (D) => {
      const { domNode: z, nodeDragThreshold: b, transform: j, snapGrid: N, snapToGrid: M } = t();
      f = z?.getBoundingClientRect() || null, g = !1, p = !1, v = D.sourceEvent, b === 0 && O(D), s = mt(D.sourceEvent, { transform: j, snapGrid: N, snapToGrid: M, containerBounds: f }), c = ve(D.sourceEvent, f);
    }).on("drag", (D) => {
      const { autoPanOnNodeDrag: z, transform: b, snapGrid: j, snapToGrid: N, nodeDragThreshold: M, nodeLookup: I } = t(), T = mt(D.sourceEvent, { transform: b, snapGrid: j, snapToGrid: N, containerBounds: f });
      if (v = D.sourceEvent, (D.sourceEvent.type === "touchmove" && D.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      E && !I.has(E)) && (g = !0), !g) {
        if (!l && z && d && (l = !0, A()), !d) {
          const $ = ve(D.sourceEvent, f), L = $.x - c.x, R = $.y - c.y;
          Math.sqrt(L * L + R * R) > M && O(D);
        }
        (s.x !== T.xSnapped || s.y !== T.ySnapped) && a && d && (c = ve(D.sourceEvent, f), P(T));
      }
    }).on("end", (D) => {
      if (!(!d || g) && (l = !1, d = !1, cancelAnimationFrame(i), a.size > 0)) {
        const { nodeLookup: z, updateNodePositions: b, onNodeDragStop: j, onSelectionDragStop: N } = t();
        if (p && (b(a, !1), p = !1), r || j || !E && N) {
          const [M, I] = $n({
            nodeId: E,
            dragItems: a,
            nodeLookup: z,
            dragging: !1
          });
          r?.(D.sourceEvent, a, M, I), j?.(D.sourceEvent, M, I), E || N?.(D.sourceEvent, I);
        }
      }
    }).filter((D) => {
      const z = D.target;
      return !D.button && (!_ || !_r(z, `.${_}`, w)) && (!m || _r(z, m, w));
    });
    h.call(C);
  }
  function y() {
    h?.on(".drag", null);
  }
  return {
    update: x,
    destroy: y
  };
}
function Hp(e, t, n) {
  const o = [], r = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const s of t.values())
    Et(r, tt(s)) > 0 && o.push(s);
  return o;
}
const Bp = 250;
function Vp(e, t, n, o) {
  let r = [], s = 1 / 0;
  const i = Hp(e, n, t + Bp);
  for (const a of i) {
    const l = [...a.internals.handleBounds?.source ?? [], ...a.internals.handleBounds?.target ?? []];
    for (const c of l) {
      if (o.nodeId === c.nodeId && o.type === c.type && o.id === c.id)
        continue;
      const { x: f, y: d } = Ye(a, c, c.position, !0), h = Math.sqrt(Math.pow(f - e.x, 2) + Math.pow(d - e.y, 2));
      h > t || (h < s ? (r = [{ ...c, x: f, y: d }], s = h) : h === s && r.push({ ...c, x: f, y: d }));
    }
  }
  if (!r.length)
    return null;
  if (r.length > 1) {
    const a = o.type === "source" ? "target" : "source";
    return r.find((l) => l.type === a) ?? r[0];
  }
  return r[0];
}
function Yi(e, t, n, o, r, s = !1) {
  const i = o.get(e);
  if (!i)
    return null;
  const a = r === "strict" ? i.internals.handleBounds?.[t] : [...i.internals.handleBounds?.source ?? [], ...i.internals.handleBounds?.target ?? []], l = (n ? a?.find((c) => c.id === n) : a?.[0]) ?? null;
  return l && s ? { ...l, ...Ye(i, l, l.position, !0) } : l;
}
function Xi(e, t) {
  return e || (t?.classList.contains("target") ? "target" : t?.classList.contains("source") ? "source" : null);
}
function Fp(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const Zi = () => !0;
function Wp(e, { connectionMode: t, connectionRadius: n, handleId: o, nodeId: r, edgeUpdaterType: s, isTarget: i, domNode: a, nodeLookup: l, lib: c, autoPanOnConnect: f, flowId: d, panBy: h, cancelConnection: g, onConnectStart: p, onConnect: v, onConnectEnd: x, isValidConnection: y = Zi, onReconnectEnd: _, updateConnection: m, getTransform: w, getFromHandle: S, autoPanSpeed: E, dragThreshold: k = 1, handleDomNode: P }) {
  const A = Ti(e.target);
  let O = 0, C;
  const { x: D, y: z } = ve(e), b = Xi(s, P), j = a?.getBoundingClientRect();
  let N = !1;
  if (!j || !b)
    return;
  const M = Yi(r, b, o, l, t);
  if (!M)
    return;
  let I = ve(e, j), T = !1, $ = null, L = !1, R = null;
  function F() {
    if (!f || !j)
      return;
    const [Q, G] = Ii(I, j, E);
    h({ x: Q, y: G }), O = requestAnimationFrame(F);
  }
  const V = {
    ...M,
    nodeId: r,
    type: b,
    position: M.position
  }, Y = l.get(r);
  let X = {
    inProgress: !0,
    isValid: null,
    from: Ye(Y, V, W.Left, !0),
    fromHandle: V,
    fromPosition: V.position,
    fromNode: Y,
    to: I,
    toHandle: null,
    toPosition: ur[V.position],
    toNode: null,
    pointer: I
  };
  function B() {
    N = !0, m(X), p?.(e, { nodeId: r, handleId: o, handleType: b });
  }
  k === 0 && B();
  function H(Q) {
    if (!N) {
      const { x: pe, y: Ae } = ve(Q), Se = pe - D, Le = Ae - z;
      if (!(Se * Se + Le * Le > k * k))
        return;
      B();
    }
    if (!S() || !V) {
      Z(Q);
      return;
    }
    const G = w();
    I = ve(Q, j), C = Vp(Dt(I, G, !1, [1, 1]), n, l, V), T || (F(), T = !0);
    const q = Ui(Q, {
      handle: C,
      connectionMode: t,
      fromNodeId: r,
      fromHandleId: o,
      fromType: i ? "target" : "source",
      isValidConnection: y,
      doc: A,
      lib: c,
      flowId: d,
      nodeLookup: l
    });
    R = q.handleDomNode, $ = q.connection, L = Fp(!!C, q.isValid);
    const re = l.get(r), ae = re ? Ye(re, V, W.Left, !0) : X.from, se = {
      ...X,
      from: ae,
      isValid: L,
      to: q.toHandle && L ? un({ x: q.toHandle.x, y: q.toHandle.y }, G) : I,
      toHandle: q.toHandle,
      toPosition: L && q.toHandle ? q.toHandle.position : ur[V.position],
      toNode: q.toHandle ? l.get(q.toHandle.nodeId) : null,
      pointer: I
    };
    m(se), X = se;
  }
  function Z(Q) {
    if (!("touches" in Q && Q.touches.length > 0)) {
      if (N) {
        (C || R) && $ && L && v?.($);
        const { inProgress: G, ...q } = X, re = {
          ...q,
          toPosition: X.toHandle ? X.toPosition : null
        };
        x?.(Q, re), s && _?.(Q, re);
      }
      g(), cancelAnimationFrame(O), T = !1, L = !1, $ = null, R = null, A.removeEventListener("mousemove", H), A.removeEventListener("mouseup", Z), A.removeEventListener("touchmove", H), A.removeEventListener("touchend", Z);
    }
  }
  A.addEventListener("mousemove", H), A.addEventListener("mouseup", Z), A.addEventListener("touchmove", H), A.addEventListener("touchend", Z);
}
function Ui(e, { handle: t, connectionMode: n, fromNodeId: o, fromHandleId: r, fromType: s, doc: i, lib: a, flowId: l, isValidConnection: c = Zi, nodeLookup: f }) {
  const d = s === "target", h = t ? i.querySelector(`.${a}-flow__handle[data-id="${l}-${t?.nodeId}-${t?.id}-${t?.type}"]`) : null, { x: g, y: p } = ve(e), v = i.elementFromPoint(g, p), x = v?.classList.contains(`${a}-flow__handle`) ? v : h, y = {
    handleDomNode: x,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (x) {
    const _ = Xi(void 0, x), m = x.getAttribute("data-nodeid"), w = x.getAttribute("data-handleid"), S = x.classList.contains("connectable"), E = x.classList.contains("connectableend");
    if (!m || !_)
      return y;
    const k = {
      source: d ? m : o,
      sourceHandle: d ? w : r,
      target: d ? o : m,
      targetHandle: d ? r : w
    };
    y.connection = k;
    const A = S && E && (n === Je.Strict ? d && _ === "source" || !d && _ === "target" : m !== o || w !== r);
    y.isValid = A && c(k), y.toHandle = Yi(m, _, w, f, n, !0);
  }
  return y;
}
const oo = {
  onPointerDown: Wp,
  isValid: Ui
};
function Yp({ domNode: e, panZoom: t, getTransform: n, getViewScale: o }) {
  const r = me(e);
  function s({ translateExtent: a, width: l, height: c, zoomStep: f = 1, pannable: d = !0, zoomable: h = !0, inversePan: g = !1 }) {
    const p = (m) => {
      if (m.sourceEvent.type !== "wheel" || !t)
        return;
      const w = n(), S = m.sourceEvent.ctrlKey && Nt() ? 10 : 1, E = -m.sourceEvent.deltaY * (m.sourceEvent.deltaMode === 1 ? 0.05 : m.sourceEvent.deltaMode ? 1 : 2e-3) * f, k = w[2] * Math.pow(2, E * S);
      t.scaleTo(k);
    };
    let v = [0, 0];
    const x = (m) => {
      (m.sourceEvent.type === "mousedown" || m.sourceEvent.type === "touchstart") && (v = [
        m.sourceEvent.clientX ?? m.sourceEvent.touches[0].clientX,
        m.sourceEvent.clientY ?? m.sourceEvent.touches[0].clientY
      ]);
    }, y = (m) => {
      const w = n();
      if (m.sourceEvent.type !== "mousemove" && m.sourceEvent.type !== "touchmove" || !t)
        return;
      const S = [
        m.sourceEvent.clientX ?? m.sourceEvent.touches[0].clientX,
        m.sourceEvent.clientY ?? m.sourceEvent.touches[0].clientY
      ], E = [S[0] - v[0], S[1] - v[1]];
      v = S;
      const k = o() * Math.max(w[2], Math.log(w[2])) * (g ? -1 : 1), P = {
        x: w[0] - E[0] * k,
        y: w[1] - E[1] * k
      }, A = [
        [0, 0],
        [l, c]
      ];
      t.setViewportConstrained({
        x: P.x,
        y: P.y,
        zoom: w[2]
      }, A, a);
    }, _ = _i().on("start", x).on("zoom", d ? y : null).on("zoom.wheel", h ? p : null);
    r.call(_, {});
  }
  function i() {
    r.on("zoom", null);
  }
  return {
    update: s,
    destroy: i,
    pointer: ye
  };
}
const Nn = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), Ln = ({ x: e, y: t, zoom: n }) => bn.translate(e, t).scale(n), Ue = (e, t) => e.target.closest(`.${t}`), Gi = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), Xp = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, Rn = (e, t = 0, n = Xp, o = () => {
}) => {
  const r = typeof t == "number" && t > 0;
  return r || o(), r ? e.transition().duration(t).ease(n).on("end", o) : e;
}, qi = (e) => {
  const t = e.ctrlKey && Nt() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function Zp({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: o, panOnScrollMode: r, panOnScrollSpeed: s, zoomOnPinch: i, onPanZoomStart: a, onPanZoom: l, onPanZoomEnd: c }) {
  return (f) => {
    if (Ue(f, t))
      return f.ctrlKey && f.preventDefault(), !1;
    f.preventDefault(), f.stopImmediatePropagation();
    const d = n.property("__zoom").k || 1;
    if (f.ctrlKey && i) {
      const x = ye(f), y = qi(f), _ = d * Math.pow(2, y);
      o.scaleTo(n, _, x, f);
      return;
    }
    const h = f.deltaMode === 1 ? 20 : 1;
    let g = r === Ve.Vertical ? 0 : f.deltaX * h, p = r === Ve.Horizontal ? 0 : f.deltaY * h;
    !Nt() && f.shiftKey && r !== Ve.Vertical && (g = f.deltaY * h, p = 0), o.translateBy(
      n,
      -(g / d) * s,
      -(p / d) * s,
      // @ts-ignore
      { internal: !0 }
    );
    const v = Nn(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? (l?.(f, v), e.panScrollTimeout = setTimeout(() => {
      c?.(f, v), e.isPanScrolling = !1;
    }, 150)) : (e.isPanScrolling = !0, a?.(f, v));
  };
}
function Up({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(o, r) {
    const s = o.type === "wheel", i = !t && s && !o.ctrlKey, a = Ue(o, e);
    if (o.ctrlKey && s && a && o.preventDefault(), i || a)
      return null;
    o.preventDefault(), n.call(this, o, r);
  };
}
function Gp({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (o) => {
    if (o.sourceEvent?.internal)
      return;
    const r = Nn(o.transform);
    e.mouseButton = o.sourceEvent?.button || 0, e.isZoomingOrPanning = !0, e.prevViewport = r, o.sourceEvent?.type === "mousedown" && t(!0), n && n?.(o.sourceEvent, r);
  };
}
function qp({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: o, onPanZoom: r }) {
  return (s) => {
    e.usedRightMouseButton = !!(n && Gi(t, e.mouseButton ?? 0)), s.sourceEvent?.sync || o([s.transform.x, s.transform.y, s.transform.k]), r && !s.sourceEvent?.internal && r?.(s.sourceEvent, Nn(s.transform));
  };
}
function Kp({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: o, onPanZoomEnd: r, onPaneContextMenu: s }) {
  return (i) => {
    if (!i.sourceEvent?.internal && (e.isZoomingOrPanning = !1, s && Gi(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && i.sourceEvent && s(i.sourceEvent), e.usedRightMouseButton = !1, o(!1), r)) {
      const a = Nn(i.transform);
      e.prevViewport = a, clearTimeout(e.timerId), e.timerId = setTimeout(
        () => {
          r?.(i.sourceEvent, a);
        },
        // we need a setTimeout for panOnScroll to suppress multiple end events fired during scroll
        n ? 150 : 0
      );
    }
  };
}
function Qp({ zoomActivationKeyPressed: e, zoomOnScroll: t, zoomOnPinch: n, panOnDrag: o, panOnScroll: r, zoomOnDoubleClick: s, userSelectionActive: i, noWheelClassName: a, noPanClassName: l, lib: c, connectionInProgress: f }) {
  return (d) => {
    const h = e || t, g = n && d.ctrlKey, p = d.type === "wheel";
    if (d.button === 1 && d.type === "mousedown" && (Ue(d, `${c}-flow__node`) || Ue(d, `${c}-flow__edge`)))
      return !0;
    if (!o && !h && !r && !s && !n || i || f && !p || Ue(d, a) && p || Ue(d, l) && (!p || r && p && !e) || !n && d.ctrlKey && p)
      return !1;
    if (!n && d.type === "touchstart" && d.touches?.length > 1)
      return d.preventDefault(), !1;
    if (!h && !r && !g && p || !o && (d.type === "mousedown" || d.type === "touchstart") || Array.isArray(o) && !o.includes(d.button) && d.type === "mousedown")
      return !1;
    const v = Array.isArray(o) && o.includes(d.button) || !d.button || d.button <= 1;
    return (!d.ctrlKey || p) && v;
  };
}
function Jp({ domNode: e, minZoom: t, maxZoom: n, translateExtent: o, viewport: r, onPanZoom: s, onPanZoomStart: i, onPanZoomEnd: a, onDraggingChange: l }) {
  const c = {
    isZoomingOrPanning: !1,
    usedRightMouseButton: !1,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: !1
  }, f = e.getBoundingClientRect(), d = _i().scaleExtent([t, n]).translateExtent(o), h = me(e).call(d);
  _({
    x: r.x,
    y: r.y,
    zoom: et(r.zoom, t, n)
  }, [
    [0, 0],
    [f.width, f.height]
  ], o);
  const g = h.on("wheel.zoom"), p = h.on("dblclick.zoom");
  d.wheelDelta(qi);
  function v(C, D) {
    return h ? new Promise((z) => {
      d?.interpolate(D?.interpolate === "linear" ? An : qt).transform(Rn(h, D?.duration, D?.ease, () => z(!0)), C);
    }) : Promise.resolve(!1);
  }
  function x({ noWheelClassName: C, noPanClassName: D, onPaneContextMenu: z, userSelectionActive: b, panOnScroll: j, panOnDrag: N, panOnScrollMode: M, panOnScrollSpeed: I, preventScrolling: T, zoomOnPinch: $, zoomOnScroll: L, zoomOnDoubleClick: R, zoomActivationKeyPressed: F, lib: V, onTransformChange: Y, connectionInProgress: K, paneClickDistance: X, selectionOnDrag: B }) {
    b && !c.isZoomingOrPanning && y();
    const H = j && !F && !b;
    d.clickDistance(B ? 1 / 0 : !we(X) || X < 0 ? 0 : X);
    const Z = H ? Zp({
      zoomPanValues: c,
      noWheelClassName: C,
      d3Selection: h,
      d3Zoom: d,
      panOnScrollMode: M,
      panOnScrollSpeed: I,
      zoomOnPinch: $,
      onPanZoomStart: i,
      onPanZoom: s,
      onPanZoomEnd: a
    }) : Up({
      noWheelClassName: C,
      preventScrolling: T,
      d3ZoomHandler: g
    });
    if (h.on("wheel.zoom", Z, { passive: !1 }), !b) {
      const G = Gp({
        zoomPanValues: c,
        onDraggingChange: l,
        onPanZoomStart: i
      });
      d.on("start", G);
      const q = qp({
        zoomPanValues: c,
        panOnDrag: N,
        onPaneContextMenu: !!z,
        onPanZoom: s,
        onTransformChange: Y
      });
      d.on("zoom", q);
      const re = Kp({
        zoomPanValues: c,
        panOnDrag: N,
        panOnScroll: j,
        onPaneContextMenu: z,
        onPanZoomEnd: a,
        onDraggingChange: l
      });
      d.on("end", re);
    }
    const Q = Qp({
      zoomActivationKeyPressed: F,
      panOnDrag: N,
      zoomOnScroll: L,
      panOnScroll: j,
      zoomOnDoubleClick: R,
      zoomOnPinch: $,
      userSelectionActive: b,
      noPanClassName: D,
      noWheelClassName: C,
      lib: V,
      connectionInProgress: K
    });
    d.filter(Q), R ? h.on("dblclick.zoom", p) : h.on("dblclick.zoom", null);
  }
  function y() {
    d.on("zoom", null);
  }
  async function _(C, D, z) {
    const b = Ln(C), j = d?.constrain()(b, D, z);
    return j && await v(j), new Promise((N) => N(j));
  }
  async function m(C, D) {
    const z = Ln(C);
    return await v(z, D), new Promise((b) => b(z));
  }
  function w(C) {
    if (h) {
      const D = Ln(C), z = h.property("__zoom");
      (z.k !== C.zoom || z.x !== C.x || z.y !== C.y) && d?.transform(h, D, null, { sync: !0 });
    }
  }
  function S() {
    const C = h ? bi(h.node()) : { x: 0, y: 0, k: 1 };
    return { x: C.x, y: C.y, zoom: C.k };
  }
  function E(C, D) {
    return h ? new Promise((z) => {
      d?.interpolate(D?.interpolate === "linear" ? An : qt).scaleTo(Rn(h, D?.duration, D?.ease, () => z(!0)), C);
    }) : Promise.resolve(!1);
  }
  function k(C, D) {
    return h ? new Promise((z) => {
      d?.interpolate(D?.interpolate === "linear" ? An : qt).scaleBy(Rn(h, D?.duration, D?.ease, () => z(!0)), C);
    }) : Promise.resolve(!1);
  }
  function P(C) {
    d?.scaleExtent(C);
  }
  function A(C) {
    d?.translateExtent(C);
  }
  function O(C) {
    const D = !we(C) || C < 0 ? 0 : C;
    d?.clickDistance(D);
  }
  return {
    update: x,
    destroy: y,
    setViewport: m,
    setViewportConstrained: _,
    getViewport: S,
    scaleTo: E,
    scaleBy: k,
    setScaleExtent: P,
    setTranslateExtent: A,
    syncViewport: w,
    setClickDistance: O
  };
}
var ot;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(ot || (ot = {}));
function eg({ width: e, prevWidth: t, height: n, prevHeight: o, affectsX: r, affectsY: s }) {
  const i = e - t, a = n - o, l = [i > 0 ? 1 : i < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return i && r && (l[0] = l[0] * -1), a && s && (l[1] = l[1] * -1), l;
}
function Er(e) {
  const t = e.includes("right") || e.includes("left"), n = e.includes("bottom") || e.includes("top"), o = e.includes("left"), r = e.includes("top");
  return {
    isHorizontal: t,
    isVertical: n,
    affectsX: o,
    affectsY: r
  };
}
function De(e, t) {
  return Math.max(0, t - e);
}
function Te(e, t) {
  return Math.max(0, e - t);
}
function Ht(e, t, n) {
  return Math.max(0, t - e, e - n);
}
function Nr(e, t) {
  return e ? !t : t;
}
function tg(e, t, n, o, r, s, i, a) {
  let { affectsX: l, affectsY: c } = t;
  const { isHorizontal: f, isVertical: d } = t, h = f && d, { xSnapped: g, ySnapped: p } = n, { minWidth: v, maxWidth: x, minHeight: y, maxHeight: _ } = o, { x: m, y: w, width: S, height: E, aspectRatio: k } = e;
  let P = Math.floor(f ? g - e.pointerX : 0), A = Math.floor(d ? p - e.pointerY : 0);
  const O = S + (l ? -P : P), C = E + (c ? -A : A), D = -s[0] * S, z = -s[1] * E;
  let b = Ht(O, v, x), j = Ht(C, y, _);
  if (i) {
    let I = 0, T = 0;
    l && P < 0 ? I = De(m + P + D, i[0][0]) : !l && P > 0 && (I = Te(m + O + D, i[1][0])), c && A < 0 ? T = De(w + A + z, i[0][1]) : !c && A > 0 && (T = Te(w + C + z, i[1][1])), b = Math.max(b, I), j = Math.max(j, T);
  }
  if (a) {
    let I = 0, T = 0;
    l && P > 0 ? I = Te(m + P, a[0][0]) : !l && P < 0 && (I = De(m + O, a[1][0])), c && A > 0 ? T = Te(w + A, a[0][1]) : !c && A < 0 && (T = De(w + C, a[1][1])), b = Math.max(b, I), j = Math.max(j, T);
  }
  if (r) {
    if (f) {
      const I = Ht(O / k, y, _) * k;
      if (b = Math.max(b, I), i) {
        let T = 0;
        !l && !c || l && !c && h ? T = Te(w + z + O / k, i[1][1]) * k : T = De(w + z + (l ? P : -P) / k, i[0][1]) * k, b = Math.max(b, T);
      }
      if (a) {
        let T = 0;
        !l && !c || l && !c && h ? T = De(w + O / k, a[1][1]) * k : T = Te(w + (l ? P : -P) / k, a[0][1]) * k, b = Math.max(b, T);
      }
    }
    if (d) {
      const I = Ht(C * k, v, x) / k;
      if (j = Math.max(j, I), i) {
        let T = 0;
        !l && !c || c && !l && h ? T = Te(m + C * k + D, i[1][0]) / k : T = De(m + (c ? A : -A) * k + D, i[0][0]) / k, j = Math.max(j, T);
      }
      if (a) {
        let T = 0;
        !l && !c || c && !l && h ? T = De(m + C * k, a[1][0]) / k : T = Te(m + (c ? A : -A) * k, a[0][0]) / k, j = Math.max(j, T);
      }
    }
  }
  A = A + (A < 0 ? j : -j), P = P + (P < 0 ? b : -b), r && (h ? O > C * k ? A = (Nr(l, c) ? -P : P) / k : P = (Nr(l, c) ? -A : A) * k : f ? (A = P / k, c = l) : (P = A * k, l = c));
  const N = l ? m + P : m, M = c ? w + A : w;
  return {
    width: S + (l ? -P : P),
    height: E + (c ? -A : A),
    x: s[0] * P * (l ? -1 : 1) + N,
    y: s[1] * A * (c ? -1 : 1) + M
  };
}
const Ki = { width: 0, height: 0, x: 0, y: 0 }, ng = {
  ...Ki,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function og(e) {
  return [
    [0, 0],
    [e.measured.width, e.measured.height]
  ];
}
function rg(e, t, n) {
  const o = t.position.x + e.position.x, r = t.position.y + e.position.y, s = e.measured.width ?? 0, i = e.measured.height ?? 0, a = n[0] * s, l = n[1] * i;
  return [
    [o - a, r - l],
    [o + s - a, r + i - l]
  ];
}
function sg({ domNode: e, nodeId: t, getStoreItems: n, onChange: o, onEnd: r }) {
  const s = me(e);
  let i = {
    controlDirection: Er("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: c, boundaries: f, keepAspectRatio: d, resizeDirection: h, onResizeStart: g, onResize: p, onResizeEnd: v, shouldResize: x }) {
    let y = { ...Ki }, _ = { ...ng };
    i = {
      boundaries: f,
      resizeDirection: h,
      keepAspectRatio: d,
      controlDirection: Er(c)
    };
    let m, w = null, S = [], E, k, P, A = !1;
    const O = hi().on("start", (C) => {
      const { nodeLookup: D, transform: z, snapGrid: b, snapToGrid: j, nodeOrigin: N, paneDomNode: M } = n();
      if (m = D.get(t), !m)
        return;
      w = M?.getBoundingClientRect() ?? null;
      const { xSnapped: I, ySnapped: T } = mt(C.sourceEvent, {
        transform: z,
        snapGrid: b,
        snapToGrid: j,
        containerBounds: w
      });
      y = {
        width: m.measured.width ?? 0,
        height: m.measured.height ?? 0,
        x: m.position.x ?? 0,
        y: m.position.y ?? 0
      }, _ = {
        ...y,
        pointerX: I,
        pointerY: T,
        aspectRatio: y.width / y.height
      }, E = void 0, m.parentId && (m.extent === "parent" || m.expandParent) && (E = D.get(m.parentId), k = E && m.extent === "parent" ? og(E) : void 0), S = [], P = void 0;
      for (const [$, L] of D)
        if (L.parentId === t && (S.push({
          id: $,
          position: { ...L.position },
          extent: L.extent
        }), L.extent === "parent" || L.expandParent)) {
          const R = rg(L, m, L.origin ?? N);
          P ? P = [
            [Math.min(R[0][0], P[0][0]), Math.min(R[0][1], P[0][1])],
            [Math.max(R[1][0], P[1][0]), Math.max(R[1][1], P[1][1])]
          ] : P = R;
        }
      g?.(C, { ...y });
    }).on("drag", (C) => {
      const { transform: D, snapGrid: z, snapToGrid: b, nodeOrigin: j } = n(), N = mt(C.sourceEvent, {
        transform: D,
        snapGrid: z,
        snapToGrid: b,
        containerBounds: w
      }), M = [];
      if (!m)
        return;
      const { x: I, y: T, width: $, height: L } = y, R = {}, F = m.origin ?? j, { width: V, height: Y, x: K, y: X } = tg(_, i.controlDirection, N, i.boundaries, i.keepAspectRatio, F, k, P), B = V !== $, H = Y !== L, Z = K !== I && B, Q = X !== T && H;
      if (!Z && !Q && !B && !H)
        return;
      if ((Z || Q || F[0] === 1 || F[1] === 1) && (R.x = Z ? K : y.x, R.y = Q ? X : y.y, y.x = R.x, y.y = R.y, S.length > 0)) {
        const ae = K - I, se = X - T;
        for (const pe of S)
          pe.position = {
            x: pe.position.x - ae + F[0] * (V - $),
            y: pe.position.y - se + F[1] * (Y - L)
          }, M.push(pe);
      }
      if ((B || H) && (R.width = B && (!i.resizeDirection || i.resizeDirection === "horizontal") ? V : y.width, R.height = H && (!i.resizeDirection || i.resizeDirection === "vertical") ? Y : y.height, y.width = R.width, y.height = R.height), E && m.expandParent) {
        const ae = F[0] * (R.width ?? 0);
        R.x && R.x < ae && (y.x = ae, _.x = _.x - (R.x - ae));
        const se = F[1] * (R.height ?? 0);
        R.y && R.y < se && (y.y = se, _.y = _.y - (R.y - se));
      }
      const G = eg({
        width: y.width,
        prevWidth: $,
        height: y.height,
        prevHeight: L,
        affectsX: i.controlDirection.affectsX,
        affectsY: i.controlDirection.affectsY
      }), q = { ...y, direction: G };
      x?.(C, q) !== !1 && (A = !0, p?.(C, q), o(R, M));
    }).on("end", (C) => {
      A && (v?.(C, { ...y }), r?.({ ...y }), A = !1);
    });
    s.call(O);
  }
  function l() {
    s.on(".drag", null);
  }
  return {
    update: a,
    destroy: l
  };
}
var On = { exports: {} }, Hn = {};
var Sr;
function ig() {
  if (Sr) return Hn;
  Sr = 1;
  var e = Vc, t = ol();
  function n(c, f) {
    return c === f && (c !== 0 || 1 / c === 1 / f) || c !== c && f !== f;
  }
  var o = typeof Object.is == "function" ? Object.is : n, r = t.useSyncExternalStore, s = e.useRef, i = e.useEffect, a = e.useMemo, l = e.useDebugValue;
  return Hn.useSyncExternalStoreWithSelector = function(c, f, d, h, g) {
    var p = s(null);
    if (p.current === null) {
      var v = { hasValue: !1, value: null };
      p.current = v;
    } else v = p.current;
    p = a(
      function() {
        function y(E) {
          if (!_) {
            if (_ = !0, m = E, E = h(E), g !== void 0 && v.hasValue) {
              var k = v.value;
              if (g(k, E))
                return w = k;
            }
            return w = E;
          }
          if (k = w, o(m, E)) return k;
          var P = h(E);
          return g !== void 0 && g(k, P) ? (m = E, k) : (m = E, w = P);
        }
        var _ = !1, m, w, S = d === void 0 ? null : d;
        return [
          function() {
            return y(f());
          },
          S === null ? void 0 : function() {
            return y(S());
          }
        ];
      },
      [f, d, h, g]
    );
    var x = r(c, p[0], p[1]);
    return i(
      function() {
        v.hasValue = !0, v.value = x;
      },
      [x]
    ), l(x), x;
  }, Hn;
}
var Cr;
function ag() {
  return Cr || (Cr = 1, On.exports = ig()), On.exports;
}
var cg = ag();
const lg = /* @__PURE__ */ Fc(cg), ug = {}, Mr = (e) => {
  let t;
  const n = /* @__PURE__ */ new Set(), o = (f, d) => {
    const h = typeof f == "function" ? f(t) : f;
    if (!Object.is(h, t)) {
      const g = t;
      t = d ?? (typeof h != "object" || h === null) ? h : Object.assign({}, t, h), n.forEach((p) => p(t, g));
    }
  }, r = () => t, l = { setState: o, getState: r, getInitialState: () => c, subscribe: (f) => (n.add(f), () => n.delete(f)), destroy: () => {
    (ug ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), n.clear();
  } }, c = t = e(o, r, l);
  return l;
}, dg = (e) => e ? Mr(e) : Mr, { useDebugValue: fg } = _e, { useSyncExternalStoreWithSelector: hg } = lg, pg = (e) => e;
function Qi(e, t = pg, n) {
  const o = hg(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return fg(o), o;
}
const jr = (e, t) => {
  const n = dg(e), o = (r, s = t) => Qi(n, r, s);
  return Object.assign(o, n), o;
}, gg = (e, t) => e ? jr(e, t) : jr;
function ie(e, t) {
  if (Object.is(e, t))
    return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  if (e instanceof Map && t instanceof Map) {
    if (e.size !== t.size) return !1;
    for (const [o, r] of e)
      if (!Object.is(r, t.get(o)))
        return !1;
    return !0;
  }
  if (e instanceof Set && t instanceof Set) {
    if (e.size !== t.size) return !1;
    for (const o of e)
      if (!t.has(o))
        return !1;
    return !0;
  }
  const n = Object.keys(e);
  if (n.length !== Object.keys(t).length)
    return !1;
  for (const o of n)
    if (!Object.prototype.hasOwnProperty.call(t, o) || !Object.is(e[o], t[o]))
      return !1;
  return !0;
}
const Sn = ao(null), mg = Sn.Provider, Ji = Ee.error001();
function ee(e, t) {
  const n = jt(Sn);
  if (n === null)
    throw new Error(Ji);
  return Qi(n, e, t);
}
function le() {
  const e = jt(Sn);
  if (e === null)
    throw new Error(Ji);
  return he(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const kr = { display: "none" }, xg = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, ea = "react-flow__node-desc", ta = "react-flow__edge-desc", yg = "react-flow__aria-live", wg = (e) => e.ariaLiveMessage, vg = (e) => e.ariaLabelConfig;
function bg({ rfId: e }) {
  const t = ee(wg);
  return u.jsx("div", { id: `${yg}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: xg, children: t });
}
function _g({ rfId: e, disableKeyboardA11y: t }) {
  const n = ee(vg);
  return u.jsxs(u.Fragment, { children: [u.jsx("div", { id: `${ea}-${e}`, style: kr, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), u.jsx("div", { id: `${ta}-${e}`, style: kr, children: n["edge.a11yDescription.default"] }), !t && u.jsx(bg, { rfId: e })] });
}
const Cn = ce(({ position: e = "top-left", children: t, className: n, style: o, ...r }, s) => {
  const i = `${e}`.split("-");
  return u.jsx("div", { className: de(["react-flow__panel", n, ...i]), style: o, ref: s, ...r, children: t });
});
Cn.displayName = "Panel";
function Eg({ proOptions: e, position: t = "bottom-right" }) {
  return e?.hideAttribution ? null : u.jsx(Cn, { position: t, className: "react-flow__attribution", "data-message": "Please only hide this attribution when you are subscribed to React Flow Pro: https://pro.reactflow.dev", children: u.jsx("a", { href: "https://reactflow.dev", target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const Ng = (e) => {
  const t = [], n = [];
  for (const [, o] of e.nodeLookup)
    o.selected && t.push(o.internals.userNode);
  for (const [, o] of e.edgeLookup)
    o.selected && n.push(o);
  return { selectedNodes: t, selectedEdges: n };
}, Bt = (e) => e.id;
function Sg(e, t) {
  return ie(e.selectedNodes.map(Bt), t.selectedNodes.map(Bt)) && ie(e.selectedEdges.map(Bt), t.selectedEdges.map(Bt));
}
function Cg({ onSelectionChange: e }) {
  const t = le(), { selectedNodes: n, selectedEdges: o } = ee(Ng, Sg);
  return J(() => {
    const r = { nodes: n, edges: o };
    e?.(r), t.getState().onSelectionChangeHandlers.forEach((s) => s(r));
  }, [n, o, e]), null;
}
const Mg = (e) => !!e.onSelectionChangeHandlers;
function jg({ onSelectionChange: e }) {
  const t = ee(Mg);
  return e || t ? u.jsx(Cg, { onSelectionChange: e }) : null;
}
const ro = typeof window < "u" ? Yc : J, na = [0, 0], kg = { x: 0, y: 0, zoom: 1 }, Ig = [
  "nodes",
  "edges",
  "defaultNodes",
  "defaultEdges",
  "onConnect",
  "onConnectStart",
  "onConnectEnd",
  "onClickConnectStart",
  "onClickConnectEnd",
  "nodesDraggable",
  "autoPanOnNodeFocus",
  "nodesConnectable",
  "nodesFocusable",
  "edgesFocusable",
  "edgesReconnectable",
  "elevateNodesOnSelect",
  "elevateEdgesOnSelect",
  "minZoom",
  "maxZoom",
  "nodeExtent",
  "onNodesChange",
  "onEdgesChange",
  "elementsSelectable",
  "connectionMode",
  "snapGrid",
  "snapToGrid",
  "translateExtent",
  "connectOnClick",
  "defaultEdgeOptions",
  "fitView",
  "fitViewOptions",
  "onNodesDelete",
  "onEdgesDelete",
  "onDelete",
  "onNodeDrag",
  "onNodeDragStart",
  "onNodeDragStop",
  "onSelectionDrag",
  "onSelectionDragStart",
  "onSelectionDragStop",
  "onMoveStart",
  "onMove",
  "onMoveEnd",
  "noPanClassName",
  "nodeOrigin",
  "autoPanOnConnect",
  "autoPanOnNodeDrag",
  "onError",
  "connectionRadius",
  "isValidConnection",
  "selectNodesOnDrag",
  "nodeDragThreshold",
  "connectionDragThreshold",
  "onBeforeDelete",
  "debug",
  "autoPanSpeed",
  "ariaLabelConfig",
  "zIndexMode"
], Ir = [...Ig, "rfId"], Pg = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), Pr = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: bt,
  nodeOrigin: na,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function Ag(e) {
  const { setNodes: t, setEdges: n, setMinZoom: o, setMaxZoom: r, setTranslateExtent: s, setNodeExtent: i, reset: a, setDefaultNodesAndEdges: l } = ee(Pg, ie), c = le();
  ro(() => (l(e.defaultNodes, e.defaultEdges), () => {
    f.current = Pr, a();
  }), []);
  const f = U(Pr);
  return ro(
    () => {
      for (const d of Ir) {
        const h = e[d], g = f.current[d];
        h !== g && (typeof e[d] > "u" || (d === "nodes" ? t(h) : d === "edges" ? n(h) : d === "minZoom" ? o(h) : d === "maxZoom" ? r(h) : d === "translateExtent" ? s(h) : d === "nodeExtent" ? i(h) : d === "ariaLabelConfig" ? c.setState({ ariaLabelConfig: xp(h) }) : d === "fitView" ? c.setState({ fitViewQueued: h }) : d === "fitViewOptions" ? c.setState({ fitViewOptions: h }) : c.setState({ [d]: h })));
      }
      f.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    Ir.map((d) => e[d])
  ), null;
}
function Ar() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function Dg(e) {
  const [t, n] = te(e === "system" ? null : e);
  return J(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = Ar(), r = () => n(o?.matches ? "dark" : "light");
    return r(), o?.addEventListener("change", r), () => {
      o?.removeEventListener("change", r);
    };
  }, [e]), t !== null ? t : Ar()?.matches ? "dark" : "light";
}
const Dr = typeof document < "u" ? document : null;
function St(e = null, t = { target: Dr, actInsideInputWithModifier: !0 }) {
  const [n, o] = te(!1), r = U(!1), s = U(/* @__PURE__ */ new Set([])), [i, a] = he(() => {
    if (e !== null) {
      const c = (Array.isArray(e) ? e : [e]).filter((d) => typeof d == "string").map((d) => d.replace("+", `
`).replace(`

`, `
+`).split(`
`)), f = c.reduce((d, h) => d.concat(...h), []);
      return [c, f];
    }
    return [[], []];
  }, [e]);
  return J(() => {
    const l = t?.target ?? Dr, c = t?.actInsideInputWithModifier ?? !0;
    if (e !== null) {
      const f = (g) => {
        if (r.current = g.ctrlKey || g.metaKey || g.shiftKey || g.altKey, (!r.current || r.current && !c) && zi(g))
          return !1;
        const v = zr(g.code, a);
        if (s.current.add(g[v]), Tr(i, s.current, !1)) {
          const x = g.composedPath?.()?.[0] || g.target, y = x?.nodeName === "BUTTON" || x?.nodeName === "A";
          t.preventDefault !== !1 && (r.current || !y) && g.preventDefault(), o(!0);
        }
      }, d = (g) => {
        const p = zr(g.code, a);
        Tr(i, s.current, !0) ? (o(!1), s.current.clear()) : s.current.delete(g[p]), g.key === "Meta" && s.current.clear(), r.current = !1;
      }, h = () => {
        s.current.clear(), o(!1);
      };
      return l?.addEventListener("keydown", f), l?.addEventListener("keyup", d), window.addEventListener("blur", h), window.addEventListener("contextmenu", h), () => {
        l?.removeEventListener("keydown", f), l?.removeEventListener("keyup", d), window.removeEventListener("blur", h), window.removeEventListener("contextmenu", h);
      };
    }
  }, [e, o]), n;
}
function Tr(e, t, n) {
  return e.filter((o) => n || o.length === t.size).some((o) => o.every((r) => t.has(r)));
}
function zr(e, t) {
  return t.includes(e) ? "code" : "key";
}
const Tg = () => {
  const e = le();
  return he(() => ({
    zoomIn: (t) => {
      const { panZoom: n } = e.getState();
      return n ? n.scaleBy(1.2, t) : Promise.resolve(!1);
    },
    zoomOut: (t) => {
      const { panZoom: n } = e.getState();
      return n ? n.scaleBy(1 / 1.2, t) : Promise.resolve(!1);
    },
    zoomTo: (t, n) => {
      const { panZoom: o } = e.getState();
      return o ? o.scaleTo(t, n) : Promise.resolve(!1);
    },
    getZoom: () => e.getState().transform[2],
    setViewport: async (t, n) => {
      const { transform: [o, r, s], panZoom: i } = e.getState();
      return i ? (await i.setViewport({
        x: t.x ?? o,
        y: t.y ?? r,
        zoom: t.zoom ?? s
      }, n), Promise.resolve(!0)) : Promise.resolve(!1);
    },
    getViewport: () => {
      const [t, n, o] = e.getState().transform;
      return { x: t, y: n, zoom: o };
    },
    setCenter: async (t, n, o) => e.getState().setCenter(t, n, o),
    fitBounds: async (t, n) => {
      const { width: o, height: r, minZoom: s, maxZoom: i, panZoom: a } = e.getState(), l = Eo(t, o, r, s, i, n?.padding ?? 0.1);
      return a ? (await a.setViewport(l, {
        duration: n?.duration,
        ease: n?.ease,
        interpolate: n?.interpolate
      }), Promise.resolve(!0)) : Promise.resolve(!1);
    },
    screenToFlowPosition: (t, n = {}) => {
      const { transform: o, snapGrid: r, snapToGrid: s, domNode: i } = e.getState();
      if (!i)
        return t;
      const { x: a, y: l } = i.getBoundingClientRect(), c = {
        x: t.x - a,
        y: t.y - l
      }, f = n.snapGrid ?? r, d = n.snapToGrid ?? s;
      return Dt(c, o, d, f);
    },
    flowToScreenPosition: (t) => {
      const { transform: n, domNode: o } = e.getState();
      if (!o)
        return t;
      const { x: r, y: s } = o.getBoundingClientRect(), i = un(t, n);
      return {
        x: i.x + r,
        y: i.y + s
      };
    }
  }), []);
};
function oa(e, t) {
  const n = [], o = /* @__PURE__ */ new Map(), r = [];
  for (const s of e)
    if (s.type === "add") {
      r.push(s);
      continue;
    } else if (s.type === "remove" || s.type === "replace")
      o.set(s.id, [s]);
    else {
      const i = o.get(s.id);
      i ? i.push(s) : o.set(s.id, [s]);
    }
  for (const s of t) {
    const i = o.get(s.id);
    if (!i) {
      n.push(s);
      continue;
    }
    if (i[0].type === "remove")
      continue;
    if (i[0].type === "replace") {
      n.push({ ...i[0].item });
      continue;
    }
    const a = { ...s };
    for (const l of i)
      zg(l, a);
    n.push(a);
  }
  return r.length && r.forEach((s) => {
    s.index !== void 0 ? n.splice(s.index, 0, { ...s.item }) : n.push({ ...s.item });
  }), n;
}
function zg(e, t) {
  switch (e.type) {
    case "select": {
      t.selected = e.selected;
      break;
    }
    case "position": {
      typeof e.position < "u" && (t.position = e.position), typeof e.dragging < "u" && (t.dragging = e.dragging);
      break;
    }
    case "dimensions": {
      typeof e.dimensions < "u" && (t.measured = {
        ...e.dimensions
      }, e.setAttributes && ((e.setAttributes === !0 || e.setAttributes === "width") && (t.width = e.dimensions.width), (e.setAttributes === !0 || e.setAttributes === "height") && (t.height = e.dimensions.height))), typeof e.resizing == "boolean" && (t.resizing = e.resizing);
      break;
    }
  }
}
function $g(e, t) {
  return oa(e, t);
}
function Lg(e, t) {
  return oa(e, t);
}
function Oe(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function Ge(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const o = [];
  for (const [r, s] of e) {
    const i = t.has(r);
    !(s.selected === void 0 && !i) && s.selected !== i && (n && (s.selected = i), o.push(Oe(s.id, i)));
  }
  return o;
}
function $r({ items: e = [], lookup: t }) {
  const n = [], o = new Map(e.map((r) => [r.id, r]));
  for (const [r, s] of e.entries()) {
    const i = t.get(s.id), a = i?.internals?.userNode ?? i;
    a !== void 0 && a !== s && n.push({ id: s.id, item: s, type: "replace" }), a === void 0 && n.push({ item: s, type: "add", index: r });
  }
  for (const [r] of t)
    o.get(r) === void 0 && n.push({ id: r, type: "remove" });
  return n;
}
function Lr(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const Rr = (e) => ap(e), Rg = (e) => Mi(e);
function ra(e) {
  return ce(e);
}
function Or(e) {
  const [t, n] = te(BigInt(0)), [o] = te(() => Og(() => n((r) => r + BigInt(1))));
  return ro(() => {
    const r = o.get();
    r.length && (e(r), o.reset());
  }, [t]), o;
}
function Og(e) {
  let t = [];
  return {
    get: () => t,
    reset: () => {
      t = [];
    },
    push: (n) => {
      t.push(n), e();
    }
  };
}
const sa = ao(null);
function Hg({ children: e }) {
  const t = le(), n = ne((a) => {
    const { nodes: l = [], setNodes: c, hasDefaultNodes: f, onNodesChange: d, nodeLookup: h, fitViewQueued: g, onNodesChangeMiddlewareMap: p } = t.getState();
    let v = l;
    for (const y of a)
      v = typeof y == "function" ? y(v) : y;
    let x = $r({
      items: v,
      lookup: h
    });
    for (const y of p.values())
      x = y(x);
    f && c(v), x.length > 0 ? d?.(x) : g && window.requestAnimationFrame(() => {
      const { fitViewQueued: y, nodes: _, setNodes: m } = t.getState();
      y && m(_);
    });
  }, []), o = Or(n), r = ne((a) => {
    const { edges: l = [], setEdges: c, hasDefaultEdges: f, onEdgesChange: d, edgeLookup: h } = t.getState();
    let g = l;
    for (const p of a)
      g = typeof p == "function" ? p(g) : p;
    f ? c(g) : d && d($r({
      items: g,
      lookup: h
    }));
  }, []), s = Or(r), i = he(() => ({ nodeQueue: o, edgeQueue: s }), []);
  return u.jsx(sa.Provider, { value: i, children: e });
}
function Bg() {
  const e = jt(sa);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const Vg = (e) => !!e.panZoom;
function Mn() {
  const e = Tg(), t = le(), n = Bg(), o = ee(Vg), r = he(() => {
    const s = (d) => t.getState().nodeLookup.get(d), i = (d) => {
      n.nodeQueue.push(d);
    }, a = (d) => {
      n.edgeQueue.push(d);
    }, l = (d) => {
      const { nodeLookup: h, nodeOrigin: g } = t.getState(), p = Rr(d) ? d : h.get(d.id), v = p.parentId ? Di(p.position, p.measured, p.parentId, h, g) : p.position, x = {
        ...p,
        position: v,
        width: p.measured?.width ?? p.width,
        height: p.measured?.height ?? p.height
      };
      return tt(x);
    }, c = (d, h, g = { replace: !1 }) => {
      i((p) => p.map((v) => {
        if (v.id === d) {
          const x = typeof h == "function" ? h(v) : h;
          return g.replace && Rr(x) ? x : { ...v, ...x };
        }
        return v;
      }));
    }, f = (d, h, g = { replace: !1 }) => {
      a((p) => p.map((v) => {
        if (v.id === d) {
          const x = typeof h == "function" ? h(v) : h;
          return g.replace && Rg(x) ? x : { ...v, ...x };
        }
        return v;
      }));
    };
    return {
      getNodes: () => t.getState().nodes.map((d) => ({ ...d })),
      getNode: (d) => s(d)?.internals.userNode,
      getInternalNode: s,
      getEdges: () => {
        const { edges: d = [] } = t.getState();
        return d.map((h) => ({ ...h }));
      },
      getEdge: (d) => t.getState().edgeLookup.get(d),
      setNodes: i,
      setEdges: a,
      addNodes: (d) => {
        const h = Array.isArray(d) ? d : [d];
        n.nodeQueue.push((g) => [...g, ...h]);
      },
      addEdges: (d) => {
        const h = Array.isArray(d) ? d : [d];
        n.edgeQueue.push((g) => [...g, ...h]);
      },
      toObject: () => {
        const { nodes: d = [], edges: h = [], transform: g } = t.getState(), [p, v, x] = g;
        return {
          nodes: d.map((y) => ({ ...y })),
          edges: h.map((y) => ({ ...y })),
          viewport: {
            x: p,
            y: v,
            zoom: x
          }
        };
      },
      deleteElements: async ({ nodes: d = [], edges: h = [] }) => {
        const { nodes: g, edges: p, onNodesDelete: v, onEdgesDelete: x, triggerNodeChanges: y, triggerEdgeChanges: _, onDelete: m, onBeforeDelete: w } = t.getState(), { nodes: S, edges: E } = await fp({
          nodesToRemove: d,
          edgesToRemove: h,
          nodes: g,
          edges: p,
          onBeforeDelete: w
        }), k = E.length > 0, P = S.length > 0;
        if (k) {
          const A = E.map(Lr);
          x?.(E), _(A);
        }
        if (P) {
          const A = S.map(Lr);
          v?.(S), y(A);
        }
        return (P || k) && m?.({ nodes: S, edges: E }), { deletedNodes: S, deletedEdges: E };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (d, h = !0, g) => {
        const p = fr(d), v = p ? d : l(d), x = g !== void 0;
        return v ? (g || t.getState().nodes).filter((y) => {
          const _ = t.getState().nodeLookup.get(y.id);
          if (_ && !p && (y.id === d.id || !_.internals.positionAbsolute))
            return !1;
          const m = tt(x ? y : _), w = Et(m, v);
          return h && w > 0 || w >= m.width * m.height || w >= v.width * v.height;
        }) : [];
      },
      isNodeIntersecting: (d, h, g = !0) => {
        const v = fr(d) ? d : l(d);
        if (!v)
          return !1;
        const x = Et(v, h);
        return g && x > 0 || x >= h.width * h.height || x >= v.width * v.height;
      },
      updateNode: c,
      updateNodeData: (d, h, g = { replace: !1 }) => {
        c(d, (p) => {
          const v = typeof h == "function" ? h(p) : h;
          return g.replace ? { ...p, data: v } : { ...p, data: { ...p.data, ...v } };
        }, g);
      },
      updateEdge: f,
      updateEdgeData: (d, h, g = { replace: !1 }) => {
        f(d, (p) => {
          const v = typeof h == "function" ? h(p) : h;
          return g.replace ? { ...p, data: v } : { ...p, data: { ...p.data, ...v } };
        }, g);
      },
      getNodesBounds: (d) => {
        const { nodeLookup: h, nodeOrigin: g } = t.getState();
        return cp(d, { nodeLookup: h, nodeOrigin: g });
      },
      getHandleConnections: ({ type: d, id: h, nodeId: g }) => Array.from(t.getState().connectionLookup.get(`${g}-${d}${h ? `-${h}` : ""}`)?.values() ?? []),
      getNodeConnections: ({ type: d, handleId: h, nodeId: g }) => Array.from(t.getState().connectionLookup.get(`${g}${d ? h ? `-${d}-${h}` : `-${d}` : ""}`)?.values() ?? []),
      fitView: async (d) => {
        const h = t.getState().fitViewResolver ?? mp();
        return t.setState({ fitViewQueued: !0, fitViewOptions: d, fitViewResolver: h }), n.nodeQueue.push((g) => [...g]), h.promise;
      }
    };
  }, []);
  return he(() => ({
    ...r,
    ...e,
    viewportInitialized: o
  }), [o]);
}
const Hr = (e) => e.selected, Fg = typeof window < "u" ? window : void 0;
function Wg({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = le(), { deleteElements: o } = Mn(), r = St(e, { actInsideInputWithModifier: !1 }), s = St(t, { target: Fg });
  J(() => {
    if (r) {
      const { edges: i, nodes: a } = n.getState();
      o({ nodes: a.filter(Hr), edges: i.filter(Hr) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [r]), J(() => {
    n.setState({ multiSelectionActive: s });
  }, [s]);
}
function Yg(e) {
  const t = le();
  J(() => {
    const n = () => {
      if (!e.current || !(e.current.checkVisibility?.() ?? !0))
        return !1;
      const o = No(e.current);
      (o.height === 0 || o.width === 0) && t.getState().onError?.("004", Ee.error004()), t.setState({ width: o.width || 500, height: o.height || 500 });
    };
    if (e.current) {
      n(), window.addEventListener("resize", n);
      const o = new ResizeObserver(() => n());
      return o.observe(e.current), () => {
        window.removeEventListener("resize", n), o && e.current && o.unobserve(e.current);
      };
    }
  }, []);
}
const jn = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, Xg = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function Zg({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: o = !1, panOnScrollSpeed: r = 0.5, panOnScrollMode: s = Ve.Free, zoomOnDoubleClick: i = !0, panOnDrag: a = !0, defaultViewport: l, translateExtent: c, minZoom: f, maxZoom: d, zoomActivationKeyCode: h, preventScrolling: g = !0, children: p, noWheelClassName: v, noPanClassName: x, onViewportChange: y, isControlledViewport: _, paneClickDistance: m, selectionOnDrag: w }) {
  const S = le(), E = U(null), { userSelectionActive: k, lib: P, connectionInProgress: A } = ee(Xg, ie), O = St(h), C = U();
  Yg(E);
  const D = ne((z) => {
    y?.({ x: z[0], y: z[1], zoom: z[2] }), _ || S.setState({ transform: z });
  }, [y, _]);
  return J(() => {
    if (E.current) {
      C.current = Jp({
        domNode: E.current,
        minZoom: f,
        maxZoom: d,
        translateExtent: c,
        viewport: l,
        onDraggingChange: (N) => S.setState((M) => M.paneDragging === N ? M : { paneDragging: N }),
        onPanZoomStart: (N, M) => {
          const { onViewportChangeStart: I, onMoveStart: T } = S.getState();
          T?.(N, M), I?.(M);
        },
        onPanZoom: (N, M) => {
          const { onViewportChange: I, onMove: T } = S.getState();
          T?.(N, M), I?.(M);
        },
        onPanZoomEnd: (N, M) => {
          const { onViewportChangeEnd: I, onMoveEnd: T } = S.getState();
          T?.(N, M), I?.(M);
        }
      });
      const { x: z, y: b, zoom: j } = C.current.getViewport();
      return S.setState({
        panZoom: C.current,
        transform: [z, b, j],
        domNode: E.current.closest(".react-flow")
      }), () => {
        C.current?.destroy();
      };
    }
  }, []), J(() => {
    C.current?.update({
      onPaneContextMenu: e,
      zoomOnScroll: t,
      zoomOnPinch: n,
      panOnScroll: o,
      panOnScrollSpeed: r,
      panOnScrollMode: s,
      zoomOnDoubleClick: i,
      panOnDrag: a,
      zoomActivationKeyPressed: O,
      preventScrolling: g,
      noPanClassName: x,
      userSelectionActive: k,
      noWheelClassName: v,
      lib: P,
      onTransformChange: D,
      connectionInProgress: A,
      selectionOnDrag: w,
      paneClickDistance: m
    });
  }, [
    e,
    t,
    n,
    o,
    r,
    s,
    i,
    a,
    O,
    g,
    x,
    k,
    v,
    P,
    D,
    A,
    w,
    m
  ]), u.jsx("div", { className: "react-flow__renderer", ref: E, style: jn, children: p });
}
const Ug = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function Gg() {
  const { userSelectionActive: e, userSelectionRect: t } = ee(Ug, ie);
  return e && t ? u.jsx("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const Bn = (e, t) => (n) => {
  n.target === t.current && e?.(n);
}, qg = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  connectionInProgress: e.connection.inProgress,
  dragging: e.paneDragging
});
function Kg({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = _t.Full, panOnDrag: o, paneClickDistance: r, selectionOnDrag: s, onSelectionStart: i, onSelectionEnd: a, onPaneClick: l, onPaneContextMenu: c, onPaneScroll: f, onPaneMouseEnter: d, onPaneMouseMove: h, onPaneMouseLeave: g, children: p }) {
  const v = le(), { userSelectionActive: x, elementsSelectable: y, dragging: _, connectionInProgress: m } = ee(qg, ie), w = y && (e || x), S = U(null), E = U(), k = U(/* @__PURE__ */ new Set()), P = U(/* @__PURE__ */ new Set()), A = U(!1), O = (I) => {
    if (A.current || m) {
      A.current = !1;
      return;
    }
    l?.(I), v.getState().resetSelectedElements(), v.setState({ nodesSelectionActive: !1 });
  }, C = (I) => {
    if (Array.isArray(o) && o?.includes(2)) {
      I.preventDefault();
      return;
    }
    c?.(I);
  }, D = f ? (I) => f(I) : void 0, z = (I) => {
    A.current && (I.stopPropagation(), A.current = !1);
  }, b = (I) => {
    const { domNode: T } = v.getState();
    if (E.current = T?.getBoundingClientRect(), !E.current)
      return;
    const $ = I.target === S.current;
    if (!$ && !!I.target.closest(".nokey") || !e || !(s && $ || t) || I.button !== 0 || !I.isPrimary)
      return;
    I.target?.setPointerCapture?.(I.pointerId), A.current = !1;
    const { x: F, y: V } = ve(I.nativeEvent, E.current);
    v.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: F,
        startY: V,
        x: F,
        y: V
      }
    }), $ || (I.stopPropagation(), I.preventDefault());
  }, j = (I) => {
    const { userSelectionRect: T, transform: $, nodeLookup: L, edgeLookup: R, connectionLookup: F, triggerNodeChanges: V, triggerEdgeChanges: Y, defaultEdgeOptions: K, resetSelectedElements: X } = v.getState();
    if (!E.current || !T)
      return;
    const { x: B, y: H } = ve(I.nativeEvent, E.current), { startX: Z, startY: Q } = T;
    if (!A.current) {
      const se = t ? 0 : r;
      if (Math.hypot(B - Z, H - Q) <= se)
        return;
      X(), i?.(I);
    }
    A.current = !0;
    const G = {
      startX: Z,
      startY: Q,
      x: B < Z ? B : Z,
      y: H < Q ? H : Q,
      width: Math.abs(B - Z),
      height: Math.abs(H - Q)
    }, q = k.current, re = P.current;
    k.current = new Set(_o(L, G, $, n === _t.Partial, !0).map((se) => se.id)), P.current = /* @__PURE__ */ new Set();
    const ae = K?.selectable ?? !0;
    for (const se of k.current) {
      const pe = F.get(se);
      if (pe)
        for (const { edgeId: Ae } of pe.values()) {
          const Se = R.get(Ae);
          Se && (Se.selectable ?? ae) && P.current.add(Ae);
        }
    }
    if (!hr(q, k.current)) {
      const se = Ge(L, k.current, !0);
      V(se);
    }
    if (!hr(re, P.current)) {
      const se = Ge(R, P.current);
      Y(se);
    }
    v.setState({
      userSelectionRect: G,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }, N = (I) => {
    I.button === 0 && (I.target?.releasePointerCapture?.(I.pointerId), !x && I.target === S.current && v.getState().userSelectionRect && O?.(I), v.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), A.current && (a?.(I), v.setState({
      nodesSelectionActive: k.current.size > 0
    })));
  }, M = o === !0 || Array.isArray(o) && o.includes(0);
  return u.jsxs("div", { className: de(["react-flow__pane", { draggable: M, dragging: _, selection: e }]), onClick: w ? void 0 : Bn(O, S), onContextMenu: Bn(C, S), onWheel: Bn(D, S), onPointerEnter: w ? void 0 : d, onPointerMove: w ? j : h, onPointerUp: w ? N : void 0, onPointerDownCapture: w ? b : void 0, onClickCapture: w ? z : void 0, onPointerLeave: g, ref: S, style: jn, children: [p, u.jsx(Gg, {})] });
}
function so({ id: e, store: t, unselect: n = !1, nodeRef: o }) {
  const { addSelectedNodes: r, unselectNodesAndEdges: s, multiSelectionActive: i, nodeLookup: a, onError: l } = t.getState(), c = a.get(e);
  if (!c) {
    l?.("012", Ee.error012(e));
    return;
  }
  t.setState({ nodesSelectionActive: !1 }), c.selected ? (n || c.selected && i) && (s({ nodes: [c], edges: [] }), requestAnimationFrame(() => o?.current?.blur())) : r([e]);
}
function ia({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: o, nodeId: r, isSelectable: s, nodeClickDistance: i }) {
  const a = le(), [l, c] = te(!1), f = U();
  return J(() => {
    f.current = Op({
      getStoreItems: () => a.getState(),
      onNodeMouseDown: (d) => {
        so({
          id: d,
          store: a,
          nodeRef: e
        });
      },
      onDragStart: () => {
        c(!0);
      },
      onDragStop: () => {
        c(!1);
      }
    });
  }, []), J(() => {
    if (!(t || !e.current || !f.current))
      return f.current.update({
        noDragClassName: n,
        handleSelector: o,
        domNode: e.current,
        isSelectable: s,
        nodeId: r,
        nodeClickDistance: i
      }), () => {
        f.current?.destroy();
      };
  }, [n, o, t, s, e, r, i]), l;
}
const Qg = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function aa() {
  const e = le();
  return ne((n) => {
    const { nodeExtent: o, snapToGrid: r, snapGrid: s, nodesDraggable: i, onError: a, updateNodePositions: l, nodeLookup: c, nodeOrigin: f } = e.getState(), d = /* @__PURE__ */ new Map(), h = Qg(i), g = r ? s[0] : 5, p = r ? s[1] : 5, v = n.direction.x * g * n.factor, x = n.direction.y * p * n.factor;
    for (const [, y] of c) {
      if (!h(y))
        continue;
      let _ = {
        x: y.internals.positionAbsolute.x + v,
        y: y.internals.positionAbsolute.y + x
      };
      r && (_ = At(_, s));
      const { position: m, positionAbsolute: w } = ji({
        nodeId: y.id,
        nextPosition: _,
        nodeLookup: c,
        nodeExtent: o,
        nodeOrigin: f,
        onError: a
      });
      y.position = m, y.internals.positionAbsolute = w, d.set(y.id, y);
    }
    l(d);
  }, []);
}
const Io = ao(null), Jg = Io.Provider;
Io.Consumer;
const ca = () => jt(Io), em = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), tm = (e, t, n) => (o) => {
  const { connectionClickStartHandle: r, connectionMode: s, connection: i } = o, { fromHandle: a, toHandle: l, isValid: c } = i, f = l?.nodeId === e && l?.id === t && l?.type === n;
  return {
    connectingFrom: a?.nodeId === e && a?.id === t && a?.type === n,
    connectingTo: f,
    clickConnecting: r?.nodeId === e && r?.id === t && r?.type === n,
    isPossibleEndHandle: s === Je.Strict ? a?.type !== n : e !== a?.nodeId || t !== a?.id,
    connectionInProcess: !!a,
    clickConnectionInProcess: !!r,
    valid: f && c
  };
};
function nm({ type: e = "source", position: t = W.Top, isValidConnection: n, isConnectable: o = !0, isConnectableStart: r = !0, isConnectableEnd: s = !0, id: i, onConnect: a, children: l, className: c, onMouseDown: f, onTouchStart: d, ...h }, g) {
  const p = i || null, v = e === "target", x = le(), y = ca(), { connectOnClick: _, noPanClassName: m, rfId: w } = ee(em, ie), { connectingFrom: S, connectingTo: E, clickConnecting: k, isPossibleEndHandle: P, connectionInProcess: A, clickConnectionInProcess: O, valid: C } = ee(tm(y, p, e), ie);
  y || x.getState().onError?.("010", Ee.error010());
  const D = (j) => {
    const { defaultEdgeOptions: N, onConnect: M, hasDefaultEdges: I } = x.getState(), T = {
      ...N,
      ...j
    };
    if (I) {
      const { edges: $, setEdges: L } = x.getState();
      L(Ep(T, $));
    }
    M?.(T), a?.(T);
  }, z = (j) => {
    if (!y)
      return;
    const N = $i(j.nativeEvent);
    if (r && (N && j.button === 0 || !N)) {
      const M = x.getState();
      oo.onPointerDown(j.nativeEvent, {
        handleDomNode: j.currentTarget,
        autoPanOnConnect: M.autoPanOnConnect,
        connectionMode: M.connectionMode,
        connectionRadius: M.connectionRadius,
        domNode: M.domNode,
        nodeLookup: M.nodeLookup,
        lib: M.lib,
        isTarget: v,
        handleId: p,
        nodeId: y,
        flowId: M.rfId,
        panBy: M.panBy,
        cancelConnection: M.cancelConnection,
        onConnectStart: M.onConnectStart,
        onConnectEnd: (...I) => x.getState().onConnectEnd?.(...I),
        updateConnection: M.updateConnection,
        onConnect: D,
        isValidConnection: n || ((...I) => x.getState().isValidConnection?.(...I) ?? !0),
        getTransform: () => x.getState().transform,
        getFromHandle: () => x.getState().connection.fromHandle,
        autoPanSpeed: M.autoPanSpeed,
        dragThreshold: M.connectionDragThreshold
      });
    }
    N ? f?.(j) : d?.(j);
  }, b = (j) => {
    const { onClickConnectStart: N, onClickConnectEnd: M, connectionClickStartHandle: I, connectionMode: T, isValidConnection: $, lib: L, rfId: R, nodeLookup: F, connection: V } = x.getState();
    if (!y || !I && !r)
      return;
    if (!I) {
      N?.(j.nativeEvent, { nodeId: y, handleId: p, handleType: e }), x.setState({ connectionClickStartHandle: { nodeId: y, type: e, id: p } });
      return;
    }
    const Y = Ti(j.target), K = n || $, { connection: X, isValid: B } = oo.isValid(j.nativeEvent, {
      handle: {
        nodeId: y,
        id: p,
        type: e
      },
      connectionMode: T,
      fromNodeId: I.nodeId,
      fromHandleId: I.id || null,
      fromType: I.type,
      isValidConnection: K,
      flowId: R,
      doc: Y,
      lib: L,
      nodeLookup: F
    });
    B && X && D(X);
    const H = structuredClone(V);
    delete H.inProgress, H.toPosition = H.toHandle ? H.toHandle.position : null, M?.(j, H), x.setState({ connectionClickStartHandle: null });
  };
  return u.jsx("div", { "data-handleid": p, "data-nodeid": y, "data-handlepos": t, "data-id": `${w}-${y}-${p}-${e}`, className: de([
    "react-flow__handle",
    `react-flow__handle-${t}`,
    "nodrag",
    m,
    c,
    {
      source: !v,
      target: v,
      connectable: o,
      connectablestart: r,
      connectableend: s,
      clickconnecting: k,
      connectingfrom: S,
      connectingto: E,
      valid: C,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: o && (!A || P) && (A || O ? s : r)
    }
  ]), onMouseDown: z, onTouchStart: z, onClick: _ ? b : void 0, ref: g, ...h, children: l });
}
const Ct = ue(ra(nm));
function om({ data: e, isConnectable: t, sourcePosition: n = W.Bottom }) {
  return u.jsxs(u.Fragment, { children: [e?.label, u.jsx(Ct, { type: "source", position: n, isConnectable: t })] });
}
function rm({ data: e, isConnectable: t, targetPosition: n = W.Top, sourcePosition: o = W.Bottom }) {
  return u.jsxs(u.Fragment, { children: [u.jsx(Ct, { type: "target", position: n, isConnectable: t }), e?.label, u.jsx(Ct, { type: "source", position: o, isConnectable: t })] });
}
function sm() {
  return null;
}
function im({ data: e, isConnectable: t, targetPosition: n = W.Top }) {
  return u.jsxs(u.Fragment, { children: [u.jsx(Ct, { type: "target", position: n, isConnectable: t }), e?.label] });
}
const fn = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, Br = {
  input: om,
  default: rm,
  output: im,
  group: sm
};
function am(e) {
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? e.style?.width,
    height: e.height ?? e.initialHeight ?? e.style?.height
  } : {
    width: e.width ?? e.style?.width,
    height: e.height ?? e.style?.height
  };
}
const cm = (e) => {
  const { width: t, height: n, x: o, y: r } = Pt(e.nodeLookup, {
    filter: (s) => !!s.selected
  });
  return {
    width: we(t) ? t : null,
    height: we(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${o}px,${r}px)`
  };
};
function lm({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const o = le(), { width: r, height: s, transformString: i, userSelectionActive: a } = ee(cm, ie), l = aa(), c = U(null);
  J(() => {
    n || c.current?.focus({
      preventScroll: !0
    });
  }, [n]);
  const f = !a && r !== null && s !== null;
  if (ia({
    nodeRef: c,
    disabled: !f
  }), !f)
    return null;
  const d = e ? (g) => {
    const p = o.getState().nodes.filter((v) => v.selected);
    e(g, p);
  } : void 0, h = (g) => {
    Object.prototype.hasOwnProperty.call(fn, g.key) && (g.preventDefault(), l({
      direction: fn[g.key],
      factor: g.shiftKey ? 4 : 1
    }));
  };
  return u.jsx("div", { className: de(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: i
  }, children: u.jsx("div", { ref: c, className: "react-flow__nodesselection-rect", onContextMenu: d, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : h, style: {
    width: r,
    height: s
  } }) });
}
const Vr = typeof window < "u" ? window : void 0, um = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function la({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: o, onPaneMouseLeave: r, onPaneContextMenu: s, onPaneScroll: i, paneClickDistance: a, deleteKeyCode: l, selectionKeyCode: c, selectionOnDrag: f, selectionMode: d, onSelectionStart: h, onSelectionEnd: g, multiSelectionKeyCode: p, panActivationKeyCode: v, zoomActivationKeyCode: x, elementsSelectable: y, zoomOnScroll: _, zoomOnPinch: m, panOnScroll: w, panOnScrollSpeed: S, panOnScrollMode: E, zoomOnDoubleClick: k, panOnDrag: P, defaultViewport: A, translateExtent: O, minZoom: C, maxZoom: D, preventScrolling: z, onSelectionContextMenu: b, noWheelClassName: j, noPanClassName: N, disableKeyboardA11y: M, onViewportChange: I, isControlledViewport: T }) {
  const { nodesSelectionActive: $, userSelectionActive: L } = ee(um, ie), R = St(c, { target: Vr }), F = St(v, { target: Vr }), V = F || P, Y = F || w, K = f && V !== !0, X = R || L || K;
  return Wg({ deleteKeyCode: l, multiSelectionKeyCode: p }), u.jsx(Zg, { onPaneContextMenu: s, elementsSelectable: y, zoomOnScroll: _, zoomOnPinch: m, panOnScroll: Y, panOnScrollSpeed: S, panOnScrollMode: E, zoomOnDoubleClick: k, panOnDrag: !R && V, defaultViewport: A, translateExtent: O, minZoom: C, maxZoom: D, zoomActivationKeyCode: x, preventScrolling: z, noWheelClassName: j, noPanClassName: N, onViewportChange: I, isControlledViewport: T, paneClickDistance: a, selectionOnDrag: K, children: u.jsxs(Kg, { onSelectionStart: h, onSelectionEnd: g, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: o, onPaneMouseLeave: r, onPaneContextMenu: s, onPaneScroll: i, panOnDrag: V, isSelecting: !!X, selectionMode: d, selectionKeyPressed: R, paneClickDistance: a, selectionOnDrag: K, children: [e, $ && u.jsx(lm, { onSelectionContextMenu: b, noPanClassName: N, disableKeyboardA11y: M })] }) });
}
la.displayName = "FlowRenderer";
const dm = ue(la), fm = (e) => (t) => e ? _o(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function hm(e) {
  return ee(ne(fm(e), [e]), ie);
}
const pm = (e) => e.updateNodeInternals;
function gm() {
  const e = ee(pm), [t] = te(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
    const o = /* @__PURE__ */ new Map();
    n.forEach((r) => {
      const s = r.target.getAttribute("data-id");
      o.set(s, {
        id: s,
        nodeElement: r.target,
        force: !0
      });
    }), e(o);
  }));
  return J(() => () => {
    t?.disconnect();
  }, [t]), t;
}
function mm({ node: e, nodeType: t, hasDimensions: n, resizeObserver: o }) {
  const r = le(), s = U(null), i = U(null), a = U(e.sourcePosition), l = U(e.targetPosition), c = U(t), f = n && !!e.internals.handleBounds;
  return J(() => {
    s.current && !e.hidden && (!f || i.current !== s.current) && (i.current && o?.unobserve(i.current), o?.observe(s.current), i.current = s.current);
  }, [f, e.hidden]), J(() => () => {
    i.current && (o?.unobserve(i.current), i.current = null);
  }, []), J(() => {
    if (s.current) {
      const d = c.current !== t, h = a.current !== e.sourcePosition, g = l.current !== e.targetPosition;
      (d || h || g) && (c.current = t, a.current = e.sourcePosition, l.current = e.targetPosition, r.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: s.current, force: !0 }]])));
    }
  }, [e.id, t, e.sourcePosition, e.targetPosition]), s;
}
function xm({ id: e, onClick: t, onMouseEnter: n, onMouseMove: o, onMouseLeave: r, onContextMenu: s, onDoubleClick: i, nodesDraggable: a, elementsSelectable: l, nodesConnectable: c, nodesFocusable: f, resizeObserver: d, noDragClassName: h, noPanClassName: g, disableKeyboardA11y: p, rfId: v, nodeTypes: x, nodeClickDistance: y, onError: _ }) {
  const { node: m, internals: w, isParent: S } = ee((B) => {
    const H = B.nodeLookup.get(e), Z = B.parentLookup.has(e);
    return {
      node: H,
      internals: H.internals,
      isParent: Z
    };
  }, ie);
  let E = m.type || "default", k = x?.[E] || Br[E];
  k === void 0 && (_?.("003", Ee.error003(E)), E = "default", k = x?.default || Br.default);
  const P = !!(m.draggable || a && typeof m.draggable > "u"), A = !!(m.selectable || l && typeof m.selectable > "u"), O = !!(m.connectable || c && typeof m.connectable > "u"), C = !!(m.focusable || f && typeof m.focusable > "u"), D = le(), z = Ai(m), b = mm({ node: m, nodeType: E, hasDimensions: z, resizeObserver: d }), j = ia({
    nodeRef: b,
    disabled: m.hidden || !P,
    noDragClassName: h,
    handleSelector: m.dragHandle,
    nodeId: e,
    isSelectable: A,
    nodeClickDistance: y
  }), N = aa();
  if (m.hidden)
    return null;
  const M = Pe(m), I = am(m), T = A || P || t || n || o || r, $ = n ? (B) => n(B, { ...w.userNode }) : void 0, L = o ? (B) => o(B, { ...w.userNode }) : void 0, R = r ? (B) => r(B, { ...w.userNode }) : void 0, F = s ? (B) => s(B, { ...w.userNode }) : void 0, V = i ? (B) => i(B, { ...w.userNode }) : void 0, Y = (B) => {
    const { selectNodesOnDrag: H, nodeDragThreshold: Z } = D.getState();
    A && (!H || !P || Z > 0) && so({
      id: e,
      store: D,
      nodeRef: b
    }), t && t(B, { ...w.userNode });
  }, K = (B) => {
    if (!(zi(B.nativeEvent) || p)) {
      if (Ei.includes(B.key) && A) {
        const H = B.key === "Escape";
        so({
          id: e,
          store: D,
          unselect: H,
          nodeRef: b
        });
      } else if (P && m.selected && Object.prototype.hasOwnProperty.call(fn, B.key)) {
        B.preventDefault();
        const { ariaLabelConfig: H } = D.getState();
        D.setState({
          ariaLiveMessage: H["node.a11yDescription.ariaLiveMessage"]({
            direction: B.key.replace("Arrow", "").toLowerCase(),
            x: ~~w.positionAbsolute.x,
            y: ~~w.positionAbsolute.y
          })
        }), N({
          direction: fn[B.key],
          factor: B.shiftKey ? 4 : 1
        });
      }
    }
  }, X = () => {
    if (p || !b.current?.matches(":focus-visible"))
      return;
    const { transform: B, width: H, height: Z, autoPanOnNodeFocus: Q, setCenter: G } = D.getState();
    if (!Q)
      return;
    _o(/* @__PURE__ */ new Map([[e, m]]), { x: 0, y: 0, width: H, height: Z }, B, !0).length > 0 || G(m.position.x + M.width / 2, m.position.y + M.height / 2, {
      zoom: B[2]
    });
  };
  return u.jsx("div", { className: de([
    "react-flow__node",
    `react-flow__node-${E}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [g]: P
    },
    m.className,
    {
      selected: m.selected,
      selectable: A,
      parent: S,
      draggable: P,
      dragging: j
    }
  ]), ref: b, style: {
    zIndex: w.z,
    transform: `translate(${w.positionAbsolute.x}px,${w.positionAbsolute.y}px)`,
    pointerEvents: T ? "all" : "none",
    visibility: z ? "visible" : "hidden",
    ...m.style,
    ...I
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: $, onMouseMove: L, onMouseLeave: R, onContextMenu: F, onClick: Y, onDoubleClick: V, onKeyDown: C ? K : void 0, tabIndex: C ? 0 : void 0, onFocus: C ? X : void 0, role: m.ariaRole ?? (C ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": p ? void 0 : `${ea}-${v}`, "aria-label": m.ariaLabel, ...m.domAttributes, children: u.jsx(Jg, { value: e, children: u.jsx(k, { id: e, data: m.data, type: E, positionAbsoluteX: w.positionAbsolute.x, positionAbsoluteY: w.positionAbsolute.y, selected: m.selected ?? !1, selectable: A, draggable: P, deletable: m.deletable ?? !0, isConnectable: O, sourcePosition: m.sourcePosition, targetPosition: m.targetPosition, dragging: j, dragHandle: m.dragHandle, zIndex: w.z, parentId: m.parentId, ...M }) }) });
}
var ym = ue(xm);
const wm = (e) => ({
  nodesDraggable: e.nodesDraggable,
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function ua(e) {
  const { nodesDraggable: t, nodesConnectable: n, nodesFocusable: o, elementsSelectable: r, onError: s } = ee(wm, ie), i = hm(e.onlyRenderVisibleElements), a = gm();
  return u.jsx("div", { className: "react-flow__nodes", style: jn, children: i.map((l) => (
    /*
     * The split of responsibilities between NodeRenderer and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For example, when you’re dragging a single node, that node gets
     * updated multiple times per second. If `NodeRenderer` were to update
     * every time, it would have to re-run the `nodes.map()` loop every
     * time. This gets pricey with hundreds of nodes, especially if every
     * loop cycle does more than just rendering a JSX element!
     *
     * As a result of this choice, we took the following implementation
     * decisions:
     * - NodeRenderer subscribes *only* to node IDs – and therefore
     *   rerender *only* when visible nodes are added or removed.
     * - NodeRenderer performs all operations the result of which can be
     *   shared between nodes (such as creating the `ResizeObserver`
     *   instance, or subscribing to `selector`). This means extra prop
     *   drilling into `NodeComponentWrapper`, but it means we need to run
     *   these operations only once – instead of once per node.
     * - Any operations that you’d normally write inside `nodes.map` are
     *   moved into `NodeComponentWrapper`. This ensures they are
     *   memorized – so if `NodeRenderer` *has* to rerender, it only
     *   needs to regenerate the list of nodes, nothing else.
     */
    u.jsx(ym, { id: l, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: a, nodesDraggable: t, nodesConnectable: n, nodesFocusable: o, elementsSelectable: r, nodeClickDistance: e.nodeClickDistance, onError: s }, l)
  )) });
}
ua.displayName = "NodeRenderer";
const vm = ue(ua);
function bm(e) {
  return ee(ne((n) => {
    if (!e)
      return n.edges.map((r) => r.id);
    const o = [];
    if (n.width && n.height)
      for (const r of n.edges) {
        const s = n.nodeLookup.get(r.source), i = n.nodeLookup.get(r.target);
        s && i && vp({
          sourceNode: s,
          targetNode: i,
          width: n.width,
          height: n.height,
          transform: n.transform
        }) && o.push(r.id);
      }
    return o;
  }, [e]), ie);
}
const _m = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return u.jsx("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, Em = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return u.jsx("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, Fr = {
  [cn.Arrow]: _m,
  [cn.ArrowClosed]: Em
};
function Nm(e) {
  const t = le();
  return he(() => Object.prototype.hasOwnProperty.call(Fr, e) ? Fr[e] : (t.getState().onError?.("009", Ee.error009(e)), null), [e]);
}
const Sm = ({ id: e, type: t, color: n, width: o = 12.5, height: r = 12.5, markerUnits: s = "strokeWidth", strokeWidth: i, orient: a = "auto-start-reverse" }) => {
  const l = Nm(t);
  return l ? u.jsx("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${o}`, markerHeight: `${r}`, viewBox: "-10 -10 20 20", markerUnits: s, orient: a, refX: "0", refY: "0", children: u.jsx(l, { color: n, strokeWidth: i }) }) : null;
}, da = ({ defaultColor: e, rfId: t }) => {
  const n = ee((s) => s.edges), o = ee((s) => s.defaultEdgeOptions), r = he(() => jp(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: o?.markerStart,
    defaultMarkerEnd: o?.markerEnd
  }), [n, o, t, e]);
  return r.length ? u.jsx("svg", { className: "react-flow__marker", "aria-hidden": "true", children: u.jsx("defs", { children: r.map((s) => u.jsx(Sm, { id: s.id, type: s.type, color: s.color, width: s.width, height: s.height, markerUnits: s.markerUnits, strokeWidth: s.strokeWidth, orient: s.orient }, s.id)) }) }) : null;
};
da.displayName = "MarkerDefinitions";
var Cm = ue(da);
function fa({ x: e, y: t, label: n, labelStyle: o, labelShowBg: r = !0, labelBgStyle: s, labelBgPadding: i = [2, 4], labelBgBorderRadius: a = 2, children: l, className: c, ...f }) {
  const [d, h] = te({ x: 1, y: 0, width: 0, height: 0 }), g = de(["react-flow__edge-textwrapper", c]), p = U(null);
  return J(() => {
    if (p.current) {
      const v = p.current.getBBox();
      h({
        x: v.x,
        y: v.y,
        width: v.width,
        height: v.height
      });
    }
  }, [n]), n ? u.jsxs("g", { transform: `translate(${e - d.width / 2} ${t - d.height / 2})`, className: g, visibility: d.width ? "visible" : "hidden", ...f, children: [r && u.jsx("rect", { width: d.width + 2 * i[0], x: -i[0], y: -i[1], height: d.height + 2 * i[1], className: "react-flow__edge-textbg", style: s, rx: a, ry: a }), u.jsx("text", { className: "react-flow__edge-text", y: d.height / 2, dy: "0.3em", ref: p, style: o, children: n }), l] }) : null;
}
fa.displayName = "EdgeText";
const Mm = ue(fa);
function rt({ path: e, labelX: t, labelY: n, label: o, labelStyle: r, labelShowBg: s, labelBgStyle: i, labelBgPadding: a, labelBgBorderRadius: l, interactionWidth: c = 20, ...f }) {
  return u.jsxs(u.Fragment, { children: [u.jsx("path", { ...f, d: e, fill: "none", className: de(["react-flow__edge-path", f.className]) }), c ? u.jsx("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: c, className: "react-flow__edge-interaction" }) : null, o && we(t) && we(n) ? u.jsx(Mm, { x: t, y: n, label: o, labelStyle: r, labelShowBg: s, labelBgStyle: i, labelBgPadding: a, labelBgBorderRadius: l }) : null] });
}
function Wr({ pos: e, x1: t, y1: n, x2: o, y2: r }) {
  return e === W.Left || e === W.Right ? [0.5 * (t + o), n] : [t, 0.5 * (n + r)];
}
function ha({ sourceX: e, sourceY: t, sourcePosition: n = W.Bottom, targetX: o, targetY: r, targetPosition: s = W.Top }) {
  const [i, a] = Wr({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: r
  }), [l, c] = Wr({
    pos: s,
    x1: o,
    y1: r,
    x2: e,
    y2: t
  }), [f, d, h, g] = Li({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: r,
    sourceControlX: i,
    sourceControlY: a,
    targetControlX: l,
    targetControlY: c
  });
  return [
    `M${e},${t} C${i},${a} ${l},${c} ${o},${r}`,
    f,
    d,
    h,
    g
  ];
}
function pa(e) {
  return ue(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: s, sourcePosition: i, targetPosition: a, label: l, labelStyle: c, labelShowBg: f, labelBgStyle: d, labelBgPadding: h, labelBgBorderRadius: g, style: p, markerEnd: v, markerStart: x, interactionWidth: y }) => {
    const [_, m, w] = ha({
      sourceX: n,
      sourceY: o,
      sourcePosition: i,
      targetX: r,
      targetY: s,
      targetPosition: a
    }), S = e.isInternal ? void 0 : t;
    return u.jsx(rt, { id: S, path: _, labelX: m, labelY: w, label: l, labelStyle: c, labelShowBg: f, labelBgStyle: d, labelBgPadding: h, labelBgBorderRadius: g, style: p, markerEnd: v, markerStart: x, interactionWidth: y });
  });
}
const jm = pa({ isInternal: !1 }), ga = pa({ isInternal: !0 });
jm.displayName = "SimpleBezierEdge";
ga.displayName = "SimpleBezierEdgeInternal";
function ma(e) {
  return ue(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: s, label: i, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: f, labelBgBorderRadius: d, style: h, sourcePosition: g = W.Bottom, targetPosition: p = W.Top, markerEnd: v, markerStart: x, pathOptions: y, interactionWidth: _ }) => {
    const [m, w, S] = dn({
      sourceX: n,
      sourceY: o,
      sourcePosition: g,
      targetX: r,
      targetY: s,
      targetPosition: p,
      borderRadius: y?.borderRadius,
      offset: y?.offset,
      stepPosition: y?.stepPosition
    }), E = e.isInternal ? void 0 : t;
    return u.jsx(rt, { id: E, path: m, labelX: w, labelY: S, label: i, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: f, labelBgBorderRadius: d, style: h, markerEnd: v, markerStart: x, interactionWidth: _ });
  });
}
const xa = ma({ isInternal: !1 }), ya = ma({ isInternal: !0 });
xa.displayName = "SmoothStepEdge";
ya.displayName = "SmoothStepEdgeInternal";
function wa(e) {
  return ue(({ id: t, ...n }) => {
    const o = e.isInternal ? void 0 : t;
    return u.jsx(xa, { ...n, id: o, pathOptions: he(() => ({ borderRadius: 0, offset: n.pathOptions?.offset }), [n.pathOptions?.offset]) });
  });
}
const km = wa({ isInternal: !1 }), va = wa({ isInternal: !0 });
km.displayName = "StepEdge";
va.displayName = "StepEdgeInternal";
function ba(e) {
  return ue(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: s, label: i, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: f, labelBgBorderRadius: d, style: h, markerEnd: g, markerStart: p, interactionWidth: v }) => {
    const [x, y, _] = Hi({ sourceX: n, sourceY: o, targetX: r, targetY: s }), m = e.isInternal ? void 0 : t;
    return u.jsx(rt, { id: m, path: x, labelX: y, labelY: _, label: i, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: f, labelBgBorderRadius: d, style: h, markerEnd: g, markerStart: p, interactionWidth: v });
  });
}
const Im = ba({ isInternal: !1 }), _a = ba({ isInternal: !0 });
Im.displayName = "StraightEdge";
_a.displayName = "StraightEdgeInternal";
function Ea(e) {
  return ue(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: s, sourcePosition: i = W.Bottom, targetPosition: a = W.Top, label: l, labelStyle: c, labelShowBg: f, labelBgStyle: d, labelBgPadding: h, labelBgBorderRadius: g, style: p, markerEnd: v, markerStart: x, pathOptions: y, interactionWidth: _ }) => {
    const [m, w, S] = Ri({
      sourceX: n,
      sourceY: o,
      sourcePosition: i,
      targetX: r,
      targetY: s,
      targetPosition: a,
      curvature: y?.curvature
    }), E = e.isInternal ? void 0 : t;
    return u.jsx(rt, { id: E, path: m, labelX: w, labelY: S, label: l, labelStyle: c, labelShowBg: f, labelBgStyle: d, labelBgPadding: h, labelBgBorderRadius: g, style: p, markerEnd: v, markerStart: x, interactionWidth: _ });
  });
}
const Pm = Ea({ isInternal: !1 }), Na = Ea({ isInternal: !0 });
Pm.displayName = "BezierEdge";
Na.displayName = "BezierEdgeInternal";
const Yr = {
  default: Na,
  straight: _a,
  step: va,
  smoothstep: ya,
  simplebezier: ga
}, Xr = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null
}, Am = (e, t, n) => n === W.Left ? e - t : n === W.Right ? e + t : e, Dm = (e, t, n) => n === W.Top ? e - t : n === W.Bottom ? e + t : e, Zr = "react-flow__edgeupdater";
function Ur({ position: e, centerX: t, centerY: n, radius: o = 10, onMouseDown: r, onMouseEnter: s, onMouseOut: i, type: a }) {
  return u.jsx("circle", { onMouseDown: r, onMouseEnter: s, onMouseOut: i, className: de([Zr, `${Zr}-${a}`]), cx: Am(t, o, e), cy: Dm(n, o, e), r: o, stroke: "transparent", fill: "transparent" });
}
function Tm({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: o, sourceY: r, targetX: s, targetY: i, sourcePosition: a, targetPosition: l, onReconnect: c, onReconnectStart: f, onReconnectEnd: d, setReconnecting: h, setUpdateHover: g }) {
  const p = le(), v = (w, S) => {
    if (w.button !== 0)
      return;
    const { autoPanOnConnect: E, domNode: k, connectionMode: P, connectionRadius: A, lib: O, onConnectStart: C, cancelConnection: D, nodeLookup: z, rfId: b, panBy: j, updateConnection: N } = p.getState(), M = S.type === "target", I = (L, R) => {
      h(!1), d?.(L, n, S.type, R);
    }, T = (L) => c?.(n, L), $ = (L, R) => {
      h(!0), f?.(w, n, S.type), C?.(L, R);
    };
    oo.onPointerDown(w.nativeEvent, {
      autoPanOnConnect: E,
      connectionMode: P,
      connectionRadius: A,
      domNode: k,
      handleId: S.id,
      nodeId: S.nodeId,
      nodeLookup: z,
      isTarget: M,
      edgeUpdaterType: S.type,
      lib: O,
      flowId: b,
      cancelConnection: D,
      panBy: j,
      isValidConnection: (...L) => p.getState().isValidConnection?.(...L) ?? !0,
      onConnect: T,
      onConnectStart: $,
      onConnectEnd: (...L) => p.getState().onConnectEnd?.(...L),
      onReconnectEnd: I,
      updateConnection: N,
      getTransform: () => p.getState().transform,
      getFromHandle: () => p.getState().connection.fromHandle,
      dragThreshold: p.getState().connectionDragThreshold,
      handleDomNode: w.currentTarget
    });
  }, x = (w) => v(w, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), y = (w) => v(w, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), _ = () => g(!0), m = () => g(!1);
  return u.jsxs(u.Fragment, { children: [(e === !0 || e === "source") && u.jsx(Ur, { position: a, centerX: o, centerY: r, radius: t, onMouseDown: x, onMouseEnter: _, onMouseOut: m, type: "source" }), (e === !0 || e === "target") && u.jsx(Ur, { position: l, centerX: s, centerY: i, radius: t, onMouseDown: y, onMouseEnter: _, onMouseOut: m, type: "target" })] });
}
function zm({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: o, onClick: r, onDoubleClick: s, onContextMenu: i, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, reconnectRadius: f, onReconnect: d, onReconnectStart: h, onReconnectEnd: g, rfId: p, edgeTypes: v, noPanClassName: x, onError: y, disableKeyboardA11y: _ }) {
  let m = ee((G) => G.edgeLookup.get(e));
  const w = ee((G) => G.defaultEdgeOptions);
  m = w ? { ...w, ...m } : m;
  let S = m.type || "default", E = v?.[S] || Yr[S];
  E === void 0 && (y?.("011", Ee.error011(S)), S = "default", E = v?.default || Yr.default);
  const k = !!(m.focusable || t && typeof m.focusable > "u"), P = typeof d < "u" && (m.reconnectable || n && typeof m.reconnectable > "u"), A = !!(m.selectable || o && typeof m.selectable > "u"), O = U(null), [C, D] = te(!1), [z, b] = te(!1), j = le(), { zIndex: N, sourceX: M, sourceY: I, targetX: T, targetY: $, sourcePosition: L, targetPosition: R } = ee(ne((G) => {
    const q = G.nodeLookup.get(m.source), re = G.nodeLookup.get(m.target);
    if (!q || !re)
      return {
        zIndex: m.zIndex,
        ...Xr
      };
    const ae = Mp({
      id: e,
      sourceNode: q,
      targetNode: re,
      sourceHandle: m.sourceHandle || null,
      targetHandle: m.targetHandle || null,
      connectionMode: G.connectionMode,
      onError: y
    });
    return {
      zIndex: wp({
        selected: m.selected,
        zIndex: m.zIndex,
        sourceNode: q,
        targetNode: re,
        elevateOnSelect: G.elevateEdgesOnSelect,
        zIndexMode: G.zIndexMode
      }),
      ...ae || Xr
    };
  }, [m.source, m.target, m.sourceHandle, m.targetHandle, m.selected, m.zIndex]), ie), F = he(() => m.markerStart ? `url('#${to(m.markerStart, p)}')` : void 0, [m.markerStart, p]), V = he(() => m.markerEnd ? `url('#${to(m.markerEnd, p)}')` : void 0, [m.markerEnd, p]);
  if (m.hidden || M === null || I === null || T === null || $ === null)
    return null;
  const Y = (G) => {
    const { addSelectedEdges: q, unselectNodesAndEdges: re, multiSelectionActive: ae } = j.getState();
    A && (j.setState({ nodesSelectionActive: !1 }), m.selected && ae ? (re({ nodes: [], edges: [m] }), O.current?.blur()) : q([e])), r && r(G, m);
  }, K = s ? (G) => {
    s(G, { ...m });
  } : void 0, X = i ? (G) => {
    i(G, { ...m });
  } : void 0, B = a ? (G) => {
    a(G, { ...m });
  } : void 0, H = l ? (G) => {
    l(G, { ...m });
  } : void 0, Z = c ? (G) => {
    c(G, { ...m });
  } : void 0, Q = (G) => {
    if (!_ && Ei.includes(G.key) && A) {
      const { unselectNodesAndEdges: q, addSelectedEdges: re } = j.getState();
      G.key === "Escape" ? (O.current?.blur(), q({ edges: [m] })) : re([e]);
    }
  };
  return u.jsx("svg", { style: { zIndex: N }, children: u.jsxs("g", { className: de([
    "react-flow__edge",
    `react-flow__edge-${S}`,
    m.className,
    x,
    {
      selected: m.selected,
      animated: m.animated,
      inactive: !A && !r,
      updating: C,
      selectable: A
    }
  ]), onClick: Y, onDoubleClick: K, onContextMenu: X, onMouseEnter: B, onMouseMove: H, onMouseLeave: Z, onKeyDown: k ? Q : void 0, tabIndex: k ? 0 : void 0, role: m.ariaRole ?? (k ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": m.ariaLabel === null ? void 0 : m.ariaLabel || `Edge from ${m.source} to ${m.target}`, "aria-describedby": k ? `${ta}-${p}` : void 0, ref: O, ...m.domAttributes, children: [!z && u.jsx(E, { id: e, source: m.source, target: m.target, type: m.type, selected: m.selected, animated: m.animated, selectable: A, deletable: m.deletable ?? !0, label: m.label, labelStyle: m.labelStyle, labelShowBg: m.labelShowBg, labelBgStyle: m.labelBgStyle, labelBgPadding: m.labelBgPadding, labelBgBorderRadius: m.labelBgBorderRadius, sourceX: M, sourceY: I, targetX: T, targetY: $, sourcePosition: L, targetPosition: R, data: m.data, style: m.style, sourceHandleId: m.sourceHandle, targetHandleId: m.targetHandle, markerStart: F, markerEnd: V, pathOptions: "pathOptions" in m ? m.pathOptions : void 0, interactionWidth: m.interactionWidth }), P && u.jsx(Tm, { edge: m, isReconnectable: P, reconnectRadius: f, onReconnect: d, onReconnectStart: h, onReconnectEnd: g, sourceX: M, sourceY: I, targetX: T, targetY: $, sourcePosition: L, targetPosition: R, setUpdateHover: D, setReconnecting: b })] }) });
}
var $m = ue(zm);
const Lm = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function Sa({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: o, noPanClassName: r, onReconnect: s, onEdgeContextMenu: i, onEdgeMouseEnter: a, onEdgeMouseMove: l, onEdgeMouseLeave: c, onEdgeClick: f, reconnectRadius: d, onEdgeDoubleClick: h, onReconnectStart: g, onReconnectEnd: p, disableKeyboardA11y: v }) {
  const { edgesFocusable: x, edgesReconnectable: y, elementsSelectable: _, onError: m } = ee(Lm, ie), w = bm(t);
  return u.jsxs("div", { className: "react-flow__edges", children: [u.jsx(Cm, { defaultColor: e, rfId: n }), w.map((S) => u.jsx($m, { id: S, edgesFocusable: x, edgesReconnectable: y, elementsSelectable: _, noPanClassName: r, onReconnect: s, onContextMenu: i, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, onClick: f, reconnectRadius: d, onDoubleClick: h, onReconnectStart: g, onReconnectEnd: p, rfId: n, onError: m, edgeTypes: o, disableKeyboardA11y: v }, S))] });
}
Sa.displayName = "EdgeRenderer";
const Rm = ue(Sa), Om = (e) => `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]})`;
function Hm({ children: e }) {
  const t = ee(Om);
  return u.jsx("div", { className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: t }, children: e });
}
function Bm(e) {
  const t = Mn(), n = U(!1);
  J(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const Vm = (e) => e.panZoom?.syncViewport;
function Fm(e) {
  const t = ee(Vm), n = le();
  return J(() => {
    e && (t?.(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function Wm(e) {
  return e.connection.inProgress ? { ...e.connection, to: Dt(e.connection.to, e.transform) } : { ...e.connection };
}
function Ym(e) {
  return Wm;
}
function Xm(e) {
  const t = Ym();
  return ee(t, ie);
}
const Zm = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function Um({ containerStyle: e, style: t, type: n, component: o }) {
  const { nodesConnectable: r, width: s, height: i, isValid: a, inProgress: l } = ee(Zm, ie);
  return !(s && r && l) ? null : u.jsx("svg", { style: e, width: s, height: i, className: "react-flow__connectionline react-flow__container", children: u.jsx("g", { className: de(["react-flow__connection", Ci(a)]), children: u.jsx(Ca, { style: t, type: n, CustomComponent: o, isValid: a }) }) });
}
const Ca = ({ style: e, type: t = $e.Bezier, CustomComponent: n, isValid: o }) => {
  const { inProgress: r, from: s, fromNode: i, fromHandle: a, fromPosition: l, to: c, toNode: f, toHandle: d, toPosition: h, pointer: g } = Xm();
  if (!r)
    return;
  if (n)
    return u.jsx(n, { connectionLineType: t, connectionLineStyle: e, fromNode: i, fromHandle: a, fromX: s.x, fromY: s.y, toX: c.x, toY: c.y, fromPosition: l, toPosition: h, connectionStatus: Ci(o), toNode: f, toHandle: d, pointer: g });
  let p = "";
  const v = {
    sourceX: s.x,
    sourceY: s.y,
    sourcePosition: l,
    targetX: c.x,
    targetY: c.y,
    targetPosition: h
  };
  switch (t) {
    case $e.Bezier:
      [p] = Ri(v);
      break;
    case $e.SimpleBezier:
      [p] = ha(v);
      break;
    case $e.Step:
      [p] = dn({
        ...v,
        borderRadius: 0
      });
      break;
    case $e.SmoothStep:
      [p] = dn(v);
      break;
    default:
      [p] = Hi(v);
  }
  return u.jsx("path", { d: p, fill: "none", className: "react-flow__connection-path", style: e });
};
Ca.displayName = "ConnectionLine";
const Gm = {};
function Gr(e = Gm) {
  U(e), le(), J(() => {
  }, [e]);
}
function qm() {
  le(), U(!1), J(() => {
  }, []);
}
function Ma({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: o, onEdgeClick: r, onNodeDoubleClick: s, onEdgeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: f, onSelectionContextMenu: d, onSelectionStart: h, onSelectionEnd: g, connectionLineType: p, connectionLineStyle: v, connectionLineComponent: x, connectionLineContainerStyle: y, selectionKeyCode: _, selectionOnDrag: m, selectionMode: w, multiSelectionKeyCode: S, panActivationKeyCode: E, zoomActivationKeyCode: k, deleteKeyCode: P, onlyRenderVisibleElements: A, elementsSelectable: O, defaultViewport: C, translateExtent: D, minZoom: z, maxZoom: b, preventScrolling: j, defaultMarkerColor: N, zoomOnScroll: M, zoomOnPinch: I, panOnScroll: T, panOnScrollSpeed: $, panOnScrollMode: L, zoomOnDoubleClick: R, panOnDrag: F, onPaneClick: V, onPaneMouseEnter: Y, onPaneMouseMove: K, onPaneMouseLeave: X, onPaneScroll: B, onPaneContextMenu: H, paneClickDistance: Z, nodeClickDistance: Q, onEdgeContextMenu: G, onEdgeMouseEnter: q, onEdgeMouseMove: re, onEdgeMouseLeave: ae, reconnectRadius: se, onReconnect: pe, onReconnectStart: Ae, onReconnectEnd: Se, noDragClassName: Le, noWheelClassName: st, noPanClassName: it, disableKeyboardA11y: at, nodeExtent: kn, rfId: Tt, viewport: Xe, onViewportChange: ct }) {
  return Gr(e), Gr(t), qm(), Bm(n), Fm(Xe), u.jsx(dm, { onPaneClick: V, onPaneMouseEnter: Y, onPaneMouseMove: K, onPaneMouseLeave: X, onPaneContextMenu: H, onPaneScroll: B, paneClickDistance: Z, deleteKeyCode: P, selectionKeyCode: _, selectionOnDrag: m, selectionMode: w, onSelectionStart: h, onSelectionEnd: g, multiSelectionKeyCode: S, panActivationKeyCode: E, zoomActivationKeyCode: k, elementsSelectable: O, zoomOnScroll: M, zoomOnPinch: I, zoomOnDoubleClick: R, panOnScroll: T, panOnScrollSpeed: $, panOnScrollMode: L, panOnDrag: F, defaultViewport: C, translateExtent: D, minZoom: z, maxZoom: b, onSelectionContextMenu: d, preventScrolling: j, noDragClassName: Le, noWheelClassName: st, noPanClassName: it, disableKeyboardA11y: at, onViewportChange: ct, isControlledViewport: !!Xe, children: u.jsxs(Hm, { children: [u.jsx(Rm, { edgeTypes: t, onEdgeClick: r, onEdgeDoubleClick: i, onReconnect: pe, onReconnectStart: Ae, onReconnectEnd: Se, onlyRenderVisibleElements: A, onEdgeContextMenu: G, onEdgeMouseEnter: q, onEdgeMouseMove: re, onEdgeMouseLeave: ae, reconnectRadius: se, defaultMarkerColor: N, noPanClassName: it, disableKeyboardA11y: at, rfId: Tt }), u.jsx(Um, { style: v, type: p, component: x, containerStyle: y }), u.jsx("div", { className: "react-flow__edgelabel-renderer" }), u.jsx(vm, { nodeTypes: e, onNodeClick: o, onNodeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: f, nodeClickDistance: Q, onlyRenderVisibleElements: A, noPanClassName: it, noDragClassName: Le, disableKeyboardA11y: at, nodeExtent: kn, rfId: Tt }), u.jsx("div", { className: "react-flow__viewport-portal" })] }) });
}
Ma.displayName = "GraphView";
const Km = ue(Ma), qr = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, width: r, height: s, fitView: i, fitViewOptions: a, minZoom: l = 0.5, maxZoom: c = 2, nodeOrigin: f, nodeExtent: d, zIndexMode: h = "basic" } = {}) => {
  const g = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), y = o ?? t ?? [], _ = n ?? e ?? [], m = f ?? [0, 0], w = d ?? bt;
  Fi(v, x, y);
  const { nodesInitialized: S } = no(_, g, p, {
    nodeOrigin: m,
    nodeExtent: w,
    zIndexMode: h
  });
  let E = [0, 0, 1];
  if (i && r && s) {
    const k = Pt(g, {
      filter: (C) => !!((C.width || C.initialWidth) && (C.height || C.initialHeight))
    }), { x: P, y: A, zoom: O } = Eo(k, r, s, l, c, a?.padding ?? 0.1);
    E = [P, A, O];
  }
  return {
    rfId: "1",
    width: r ?? 0,
    height: s ?? 0,
    transform: E,
    nodes: _,
    nodesInitialized: S,
    nodeLookup: g,
    parentLookup: p,
    edges: y,
    edgeLookup: x,
    connectionLookup: v,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: n !== void 0,
    hasDefaultEdges: o !== void 0,
    panZoom: null,
    minZoom: l,
    maxZoom: c,
    translateExtent: bt,
    nodeExtent: w,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: Je.Strict,
    domNode: null,
    paneDragging: !1,
    noPanClassName: "nopan",
    nodeOrigin: m,
    nodeDragThreshold: 1,
    connectionDragThreshold: 1,
    snapGrid: [15, 15],
    snapToGrid: !1,
    nodesDraggable: !0,
    nodesConnectable: !0,
    nodesFocusable: !0,
    edgesFocusable: !0,
    edgesReconnectable: !0,
    elementsSelectable: !0,
    elevateNodesOnSelect: !0,
    elevateEdgesOnSelect: !0,
    selectNodesOnDrag: !0,
    multiSelectionActive: !1,
    fitViewQueued: i ?? !1,
    fitViewOptions: a,
    fitViewResolver: null,
    connection: { ...Si },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: hp,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: Ni,
    zIndexMode: h,
    onNodesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onEdgesChangeMiddlewareMap: /* @__PURE__ */ new Map()
  };
}, Qm = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, width: r, height: s, fitView: i, fitViewOptions: a, minZoom: l, maxZoom: c, nodeOrigin: f, nodeExtent: d, zIndexMode: h }) => gg((g, p) => {
  async function v() {
    const { nodeLookup: x, panZoom: y, fitViewOptions: _, fitViewResolver: m, width: w, height: S, minZoom: E, maxZoom: k } = p();
    y && (await dp({
      nodes: x,
      width: w,
      height: S,
      panZoom: y,
      minZoom: E,
      maxZoom: k
    }, _), m?.resolve(!0), g({ fitViewResolver: null }));
  }
  return {
    ...qr({
      nodes: e,
      edges: t,
      width: r,
      height: s,
      fitView: i,
      fitViewOptions: a,
      minZoom: l,
      maxZoom: c,
      nodeOrigin: f,
      nodeExtent: d,
      defaultNodes: n,
      defaultEdges: o,
      zIndexMode: h
    }),
    setNodes: (x) => {
      const { nodeLookup: y, parentLookup: _, nodeOrigin: m, elevateNodesOnSelect: w, fitViewQueued: S, zIndexMode: E, nodesSelectionActive: k } = p(), { nodesInitialized: P, hasSelectedNodes: A } = no(x, y, _, {
        nodeOrigin: m,
        nodeExtent: d,
        elevateNodesOnSelect: w,
        checkEquality: !0,
        zIndexMode: E
      }), O = k && A;
      S && P ? (v(), g({
        nodes: x,
        nodesInitialized: P,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: O
      })) : g({ nodes: x, nodesInitialized: P, nodesSelectionActive: O });
    },
    setEdges: (x) => {
      const { connectionLookup: y, edgeLookup: _ } = p();
      Fi(y, _, x), g({ edges: x });
    },
    setDefaultNodesAndEdges: (x, y) => {
      if (x) {
        const { setNodes: _ } = p();
        _(x), g({ hasDefaultNodes: !0 });
      }
      if (y) {
        const { setEdges: _ } = p();
        _(y), g({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (x) => {
      const { triggerNodeChanges: y, nodeLookup: _, parentLookup: m, domNode: w, nodeOrigin: S, nodeExtent: E, debug: k, fitViewQueued: P, zIndexMode: A } = p(), { changes: O, updatedInternals: C } = zp(x, _, m, w, S, E, A);
      C && (Pp(_, m, { nodeOrigin: S, nodeExtent: E, zIndexMode: A }), P ? (v(), g({ fitViewQueued: !1, fitViewOptions: void 0 })) : g({}), O?.length > 0 && (k && console.log("React Flow: trigger node changes", O), y?.(O)));
    },
    updateNodePositions: (x, y = !1) => {
      const _ = [];
      let m = [];
      const { nodeLookup: w, triggerNodeChanges: S, connection: E, updateConnection: k, onNodesChangeMiddlewareMap: P } = p();
      for (const [A, O] of x) {
        const C = w.get(A), D = !!(C?.expandParent && C?.parentId && O?.position), z = {
          id: A,
          type: "position",
          position: D ? {
            x: Math.max(0, O.position.x),
            y: Math.max(0, O.position.y)
          } : O.position,
          dragging: y
        };
        if (C && E.inProgress && E.fromNode.id === C.id) {
          const b = Ye(C, E.fromHandle, W.Left, !0);
          k({ ...E, from: b });
        }
        D && C.parentId && _.push({
          id: A,
          parentId: C.parentId,
          rect: {
            ...O.internals.positionAbsolute,
            width: O.measured.width ?? 0,
            height: O.measured.height ?? 0
          }
        }), m.push(z);
      }
      if (_.length > 0) {
        const { parentLookup: A, nodeOrigin: O } = p(), C = ko(_, w, A, O);
        m.push(...C);
      }
      for (const A of P.values())
        m = A(m);
      S(m);
    },
    triggerNodeChanges: (x) => {
      const { onNodesChange: y, setNodes: _, nodes: m, hasDefaultNodes: w, debug: S } = p();
      if (x?.length) {
        if (w) {
          const E = $g(x, m);
          _(E);
        }
        S && console.log("React Flow: trigger node changes", x), y?.(x);
      }
    },
    triggerEdgeChanges: (x) => {
      const { onEdgesChange: y, setEdges: _, edges: m, hasDefaultEdges: w, debug: S } = p();
      if (x?.length) {
        if (w) {
          const E = Lg(x, m);
          _(E);
        }
        S && console.log("React Flow: trigger edge changes", x), y?.(x);
      }
    },
    addSelectedNodes: (x) => {
      const { multiSelectionActive: y, edgeLookup: _, nodeLookup: m, triggerNodeChanges: w, triggerEdgeChanges: S } = p();
      if (y) {
        const E = x.map((k) => Oe(k, !0));
        w(E);
        return;
      }
      w(Ge(m, /* @__PURE__ */ new Set([...x]), !0)), S(Ge(_));
    },
    addSelectedEdges: (x) => {
      const { multiSelectionActive: y, edgeLookup: _, nodeLookup: m, triggerNodeChanges: w, triggerEdgeChanges: S } = p();
      if (y) {
        const E = x.map((k) => Oe(k, !0));
        S(E);
        return;
      }
      S(Ge(_, /* @__PURE__ */ new Set([...x]))), w(Ge(m, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: x, edges: y } = {}) => {
      const { edges: _, nodes: m, nodeLookup: w, triggerNodeChanges: S, triggerEdgeChanges: E } = p(), k = x || m, P = y || _, A = [];
      for (const C of k) {
        if (!C.selected)
          continue;
        const D = w.get(C.id);
        D && (D.selected = !1), A.push(Oe(C.id, !1));
      }
      const O = [];
      for (const C of P)
        C.selected && O.push(Oe(C.id, !1));
      S(A), E(O);
    },
    setMinZoom: (x) => {
      const { panZoom: y, maxZoom: _ } = p();
      y?.setScaleExtent([x, _]), g({ minZoom: x });
    },
    setMaxZoom: (x) => {
      const { panZoom: y, minZoom: _ } = p();
      y?.setScaleExtent([_, x]), g({ maxZoom: x });
    },
    setTranslateExtent: (x) => {
      p().panZoom?.setTranslateExtent(x), g({ translateExtent: x });
    },
    resetSelectedElements: () => {
      const { edges: x, nodes: y, triggerNodeChanges: _, triggerEdgeChanges: m, elementsSelectable: w } = p();
      if (!w)
        return;
      const S = y.reduce((k, P) => P.selected ? [...k, Oe(P.id, !1)] : k, []), E = x.reduce((k, P) => P.selected ? [...k, Oe(P.id, !1)] : k, []);
      _(S), m(E);
    },
    setNodeExtent: (x) => {
      const { nodes: y, nodeLookup: _, parentLookup: m, nodeOrigin: w, elevateNodesOnSelect: S, nodeExtent: E, zIndexMode: k } = p();
      x[0][0] === E[0][0] && x[0][1] === E[0][1] && x[1][0] === E[1][0] && x[1][1] === E[1][1] || (no(y, _, m, {
        nodeOrigin: w,
        nodeExtent: x,
        elevateNodesOnSelect: S,
        checkEquality: !1,
        zIndexMode: k
      }), g({ nodeExtent: x }));
    },
    panBy: (x) => {
      const { transform: y, width: _, height: m, panZoom: w, translateExtent: S } = p();
      return $p({ delta: x, panZoom: w, transform: y, translateExtent: S, width: _, height: m });
    },
    setCenter: async (x, y, _) => {
      const { width: m, height: w, maxZoom: S, panZoom: E } = p();
      if (!E)
        return Promise.resolve(!1);
      const k = typeof _?.zoom < "u" ? _.zoom : S;
      return await E.setViewport({
        x: m / 2 - x * k,
        y: w / 2 - y * k,
        zoom: k
      }, { duration: _?.duration, ease: _?.ease, interpolate: _?.interpolate }), Promise.resolve(!0);
    },
    cancelConnection: () => {
      g({
        connection: { ...Si }
      });
    },
    updateConnection: (x) => {
      g({ connection: x });
    },
    reset: () => g({ ...qr() })
  };
}, Object.is);
function Jm({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: o, initialWidth: r, initialHeight: s, initialMinZoom: i, initialMaxZoom: a, initialFitViewOptions: l, fitView: c, nodeOrigin: f, nodeExtent: d, zIndexMode: h, children: g }) {
  const [p] = te(() => Qm({
    nodes: e,
    edges: t,
    defaultNodes: n,
    defaultEdges: o,
    width: r,
    height: s,
    fitView: c,
    minZoom: i,
    maxZoom: a,
    fitViewOptions: l,
    nodeOrigin: f,
    nodeExtent: d,
    zIndexMode: h
  }));
  return u.jsx(mg, { value: p, children: u.jsx(Hg, { children: g }) });
}
function ex({ children: e, nodes: t, edges: n, defaultNodes: o, defaultEdges: r, width: s, height: i, fitView: a, fitViewOptions: l, minZoom: c, maxZoom: f, nodeOrigin: d, nodeExtent: h, zIndexMode: g }) {
  return jt(Sn) ? u.jsx(u.Fragment, { children: e }) : u.jsx(Jm, { initialNodes: t, initialEdges: n, defaultNodes: o, defaultEdges: r, initialWidth: s, initialHeight: i, fitView: a, initialFitViewOptions: l, initialMinZoom: c, initialMaxZoom: f, nodeOrigin: d, nodeExtent: h, zIndexMode: g, children: e });
}
const tx = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function nx({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, className: r, nodeTypes: s, edgeTypes: i, onNodeClick: a, onEdgeClick: l, onInit: c, onMove: f, onMoveStart: d, onMoveEnd: h, onConnect: g, onConnectStart: p, onConnectEnd: v, onClickConnectStart: x, onClickConnectEnd: y, onNodeMouseEnter: _, onNodeMouseMove: m, onNodeMouseLeave: w, onNodeContextMenu: S, onNodeDoubleClick: E, onNodeDragStart: k, onNodeDrag: P, onNodeDragStop: A, onNodesDelete: O, onEdgesDelete: C, onDelete: D, onSelectionChange: z, onSelectionDragStart: b, onSelectionDrag: j, onSelectionDragStop: N, onSelectionContextMenu: M, onSelectionStart: I, onSelectionEnd: T, onBeforeDelete: $, connectionMode: L, connectionLineType: R = $e.Bezier, connectionLineStyle: F, connectionLineComponent: V, connectionLineContainerStyle: Y, deleteKeyCode: K = "Backspace", selectionKeyCode: X = "Shift", selectionOnDrag: B = !1, selectionMode: H = _t.Full, panActivationKeyCode: Z = "Space", multiSelectionKeyCode: Q = Nt() ? "Meta" : "Control", zoomActivationKeyCode: G = Nt() ? "Meta" : "Control", snapToGrid: q, snapGrid: re, onlyRenderVisibleElements: ae = !1, selectNodesOnDrag: se, nodesDraggable: pe, autoPanOnNodeFocus: Ae, nodesConnectable: Se, nodesFocusable: Le, nodeOrigin: st = na, edgesFocusable: it, edgesReconnectable: at, elementsSelectable: kn = !0, defaultViewport: Tt = kg, minZoom: Xe = 0.5, maxZoom: ct = 2, translateExtent: Do = bt, preventScrolling: Oa = !0, nodeExtent: In, defaultMarkerColor: Ha = "#b1b1b7", zoomOnScroll: Ba = !0, zoomOnPinch: Va = !0, panOnScroll: Fa = !1, panOnScrollSpeed: Wa = 0.5, panOnScrollMode: Ya = Ve.Free, zoomOnDoubleClick: Xa = !0, panOnDrag: Za = !0, onPaneClick: Ua, onPaneMouseEnter: Ga, onPaneMouseMove: qa, onPaneMouseLeave: Ka, onPaneScroll: Qa, onPaneContextMenu: Ja, paneClickDistance: ec = 1, nodeClickDistance: tc = 0, children: nc, onReconnect: oc, onReconnectStart: rc, onReconnectEnd: sc, onEdgeContextMenu: ic, onEdgeDoubleClick: ac, onEdgeMouseEnter: cc, onEdgeMouseMove: lc, onEdgeMouseLeave: uc, reconnectRadius: dc = 10, onNodesChange: fc, onEdgesChange: hc, noDragClassName: pc = "nodrag", noWheelClassName: gc = "nowheel", noPanClassName: To = "nopan", fitView: zo, fitViewOptions: $o, connectOnClick: mc, attributionPosition: xc, proOptions: yc, defaultEdgeOptions: wc, elevateNodesOnSelect: vc = !0, elevateEdgesOnSelect: bc = !1, disableKeyboardA11y: Lo = !1, autoPanOnConnect: _c, autoPanOnNodeDrag: Ec, autoPanSpeed: Nc, connectionRadius: Sc, isValidConnection: Cc, onError: Mc, style: jc, id: Ro, nodeDragThreshold: kc, connectionDragThreshold: Ic, viewport: Pc, onViewportChange: Ac, width: Dc, height: Tc, colorMode: zc = "light", debug: $c, onScroll: Oo, ariaLabelConfig: Lc, zIndexMode: Ho = "basic", ...Rc }, Oc) {
  const Pn = Ro || "1", Hc = Dg(zc), Bc = ne((Bo) => {
    Bo.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), Oo?.(Bo);
  }, [Oo]);
  return u.jsx("div", { "data-testid": "rf__wrapper", ...Rc, onScroll: Bc, style: { ...jc, ...tx }, ref: Oc, className: de(["react-flow", r, Hc]), id: Ro, role: "application", children: u.jsxs(ex, { nodes: e, edges: t, width: Dc, height: Tc, fitView: zo, fitViewOptions: $o, minZoom: Xe, maxZoom: ct, nodeOrigin: st, nodeExtent: In, zIndexMode: Ho, children: [u.jsx(Ag, { nodes: e, edges: t, defaultNodes: n, defaultEdges: o, onConnect: g, onConnectStart: p, onConnectEnd: v, onClickConnectStart: x, onClickConnectEnd: y, nodesDraggable: pe, autoPanOnNodeFocus: Ae, nodesConnectable: Se, nodesFocusable: Le, edgesFocusable: it, edgesReconnectable: at, elementsSelectable: kn, elevateNodesOnSelect: vc, elevateEdgesOnSelect: bc, minZoom: Xe, maxZoom: ct, nodeExtent: In, onNodesChange: fc, onEdgesChange: hc, snapToGrid: q, snapGrid: re, connectionMode: L, translateExtent: Do, connectOnClick: mc, defaultEdgeOptions: wc, fitView: zo, fitViewOptions: $o, onNodesDelete: O, onEdgesDelete: C, onDelete: D, onNodeDragStart: k, onNodeDrag: P, onNodeDragStop: A, onSelectionDrag: j, onSelectionDragStart: b, onSelectionDragStop: N, onMove: f, onMoveStart: d, onMoveEnd: h, noPanClassName: To, nodeOrigin: st, rfId: Pn, autoPanOnConnect: _c, autoPanOnNodeDrag: Ec, autoPanSpeed: Nc, onError: Mc, connectionRadius: Sc, isValidConnection: Cc, selectNodesOnDrag: se, nodeDragThreshold: kc, connectionDragThreshold: Ic, onBeforeDelete: $, debug: $c, ariaLabelConfig: Lc, zIndexMode: Ho }), u.jsx(Km, { onInit: c, onNodeClick: a, onEdgeClick: l, onNodeMouseEnter: _, onNodeMouseMove: m, onNodeMouseLeave: w, onNodeContextMenu: S, onNodeDoubleClick: E, nodeTypes: s, edgeTypes: i, connectionLineType: R, connectionLineStyle: F, connectionLineComponent: V, connectionLineContainerStyle: Y, selectionKeyCode: X, selectionOnDrag: B, selectionMode: H, deleteKeyCode: K, multiSelectionKeyCode: Q, panActivationKeyCode: Z, zoomActivationKeyCode: G, onlyRenderVisibleElements: ae, defaultViewport: Tt, translateExtent: Do, minZoom: Xe, maxZoom: ct, preventScrolling: Oa, zoomOnScroll: Ba, zoomOnPinch: Va, zoomOnDoubleClick: Xa, panOnScroll: Fa, panOnScrollSpeed: Wa, panOnScrollMode: Ya, panOnDrag: Za, onPaneClick: Ua, onPaneMouseEnter: Ga, onPaneMouseMove: qa, onPaneMouseLeave: Ka, onPaneScroll: Qa, onPaneContextMenu: Ja, paneClickDistance: ec, nodeClickDistance: tc, onSelectionContextMenu: M, onSelectionStart: I, onSelectionEnd: T, onReconnect: oc, onReconnectStart: rc, onReconnectEnd: sc, onEdgeContextMenu: ic, onEdgeDoubleClick: ac, onEdgeMouseEnter: cc, onEdgeMouseMove: lc, onEdgeMouseLeave: uc, reconnectRadius: dc, defaultMarkerColor: Ha, noDragClassName: pc, noWheelClassName: gc, noPanClassName: To, rfId: Pn, disableKeyboardA11y: Lo, nodeExtent: In, viewport: Pc, onViewportChange: Ac }), u.jsx(jg, { onSelectionChange: z }), nc, u.jsx(Eg, { proOptions: yc, position: xc }), u.jsx(_g, { rfId: Pn, disableKeyboardA11y: Lo })] }) });
}
var ox = ra(nx);
const rx = (e) => e.domNode?.querySelector(".react-flow__edgelabel-renderer");
function sx({ children: e }) {
  const t = ee(rx);
  return t ? Wc(e, t) : null;
}
const ix = (e) => ({
  x: e.transform[0],
  y: e.transform[1],
  zoom: e.transform[2]
});
function ax() {
  return ee(ix, ie);
}
function cx({ dimensions: e, lineWidth: t, variant: n, className: o }) {
  return u.jsx("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: de(["react-flow__background-pattern", n, o]) });
}
function lx({ radius: e, className: t }) {
  return u.jsx("circle", { cx: e, cy: e, r: e, className: de(["react-flow__background-pattern", "dots", t]) });
}
var ke;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(ke || (ke = {}));
const ux = {
  [ke.Dots]: 1,
  [ke.Lines]: 1,
  [ke.Cross]: 6
}, dx = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function ja({
  id: e,
  variant: t = ke.Dots,
  // only used for dots and cross
  gap: n = 20,
  // only used for lines and cross
  size: o,
  lineWidth: r = 1,
  offset: s = 0,
  color: i,
  bgColor: a,
  style: l,
  className: c,
  patternClassName: f
}) {
  const d = U(null), { transform: h, patternId: g } = ee(dx, ie), p = o || ux[t], v = t === ke.Dots, x = t === ke.Cross, y = Array.isArray(n) ? n : [n, n], _ = [y[0] * h[2] || 1, y[1] * h[2] || 1], m = p * h[2], w = Array.isArray(s) ? s : [s, s], S = x ? [m, m] : _, E = [
    w[0] * h[2] || 1 + S[0] / 2,
    w[1] * h[2] || 1 + S[1] / 2
  ], k = `${g}${e || ""}`;
  return u.jsxs("svg", { className: de(["react-flow__background", c]), style: {
    ...l,
    ...jn,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": i
  }, ref: d, "data-testid": "rf__background", children: [u.jsx("pattern", { id: k, x: h[0] % _[0], y: h[1] % _[1], width: _[0], height: _[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${E[0]},-${E[1]})`, children: v ? u.jsx(lx, { radius: m / 2, className: f }) : u.jsx(cx, { dimensions: S, lineWidth: r, variant: t, className: f }) }), u.jsx("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${k})` })] });
}
ja.displayName = "Background";
const fx = ue(ja);
function hx() {
  return u.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: u.jsx("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function px() {
  return u.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: u.jsx("path", { d: "M0 0h32v4.2H0z" }) });
}
function gx() {
  return u.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: u.jsx("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function mx() {
  return u.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: u.jsx("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function xx() {
  return u.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: u.jsx("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function Vt({ children: e, className: t, ...n }) {
  return u.jsx("button", { type: "button", className: de(["react-flow__controls-button", t]), ...n, children: e });
}
const yx = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function ka({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: o = !0, fitViewOptions: r, onZoomIn: s, onZoomOut: i, onFitView: a, onInteractiveChange: l, className: c, children: f, position: d = "bottom-left", orientation: h = "vertical", "aria-label": g }) {
  const p = le(), { isInteractive: v, minZoomReached: x, maxZoomReached: y, ariaLabelConfig: _ } = ee(yx, ie), { zoomIn: m, zoomOut: w, fitView: S } = Mn(), E = () => {
    m(), s?.();
  }, k = () => {
    w(), i?.();
  }, P = () => {
    S(r), a?.();
  }, A = () => {
    p.setState({
      nodesDraggable: !v,
      nodesConnectable: !v,
      elementsSelectable: !v
    }), l?.(!v);
  }, O = h === "horizontal" ? "horizontal" : "vertical";
  return u.jsxs(Cn, { className: de(["react-flow__controls", O, c]), position: d, style: e, "data-testid": "rf__controls", "aria-label": g ?? _["controls.ariaLabel"], children: [t && u.jsxs(u.Fragment, { children: [u.jsx(Vt, { onClick: E, className: "react-flow__controls-zoomin", title: _["controls.zoomIn.ariaLabel"], "aria-label": _["controls.zoomIn.ariaLabel"], disabled: y, children: u.jsx(hx, {}) }), u.jsx(Vt, { onClick: k, className: "react-flow__controls-zoomout", title: _["controls.zoomOut.ariaLabel"], "aria-label": _["controls.zoomOut.ariaLabel"], disabled: x, children: u.jsx(px, {}) })] }), n && u.jsx(Vt, { className: "react-flow__controls-fitview", onClick: P, title: _["controls.fitView.ariaLabel"], "aria-label": _["controls.fitView.ariaLabel"], children: u.jsx(gx, {}) }), o && u.jsx(Vt, { className: "react-flow__controls-interactive", onClick: A, title: _["controls.interactive.ariaLabel"], "aria-label": _["controls.interactive.ariaLabel"], children: v ? u.jsx(xx, {}) : u.jsx(mx, {}) }), f] });
}
ka.displayName = "Controls";
const wx = ue(ka);
function vx({ id: e, x: t, y: n, width: o, height: r, style: s, color: i, strokeColor: a, strokeWidth: l, className: c, borderRadius: f, shapeRendering: d, selected: h, onClick: g }) {
  const { background: p, backgroundColor: v } = s || {}, x = i || p || v;
  return u.jsx("rect", { className: de(["react-flow__minimap-node", { selected: h }, c]), x: t, y: n, rx: f, ry: f, width: o, height: r, style: {
    fill: x,
    stroke: a,
    strokeWidth: l
  }, shapeRendering: d, onClick: g ? (y) => g(y, e) : void 0 });
}
const bx = ue(vx), _x = (e) => e.nodes.map((t) => t.id), Vn = (e) => e instanceof Function ? e : () => e;
function Ex({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: o = 5,
  nodeStrokeWidth: r,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: s = bx,
  onClick: i
}) {
  const a = ee(_x, ie), l = Vn(t), c = Vn(e), f = Vn(n), d = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return u.jsx(u.Fragment, { children: a.map((h) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    u.jsx(Sx, { id: h, nodeColorFunc: l, nodeStrokeColorFunc: c, nodeClassNameFunc: f, nodeBorderRadius: o, nodeStrokeWidth: r, NodeComponent: s, onClick: i, shapeRendering: d }, h)
  )) });
}
function Nx({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: o, nodeBorderRadius: r, nodeStrokeWidth: s, shapeRendering: i, NodeComponent: a, onClick: l }) {
  const { node: c, x: f, y: d, width: h, height: g } = ee((p) => {
    const v = p.nodeLookup.get(e);
    if (!v)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const x = v.internals.userNode, { x: y, y: _ } = v.internals.positionAbsolute, { width: m, height: w } = Pe(x);
    return {
      node: x,
      x: y,
      y: _,
      width: m,
      height: w
    };
  }, ie);
  return !c || c.hidden || !Ai(c) ? null : u.jsx(a, { x: f, y: d, width: h, height: g, style: c.style, selected: !!c.selected, className: o(c), color: t(c), borderRadius: r, strokeColor: n(c), strokeWidth: s, shapeRendering: i, onClick: l, id: c.id });
}
const Sx = ue(Nx);
var Cx = ue(Ex);
const Mx = 200, jx = 150, kx = (e) => !e.hidden, Ix = (e) => {
  const t = {
    x: -e.transform[0] / e.transform[2],
    y: -e.transform[1] / e.transform[2],
    width: e.width / e.transform[2],
    height: e.height / e.transform[2]
  };
  return {
    viewBB: t,
    boundingRect: e.nodeLookup.size > 0 ? Pi(Pt(e.nodeLookup, { filter: kx }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, Px = "react-flow__minimap-desc";
function Ia({
  style: e,
  className: t,
  nodeStrokeColor: n,
  nodeColor: o,
  nodeClassName: r = "",
  nodeBorderRadius: s = 5,
  nodeStrokeWidth: i,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: a,
  bgColor: l,
  maskColor: c,
  maskStrokeColor: f,
  maskStrokeWidth: d,
  position: h = "bottom-right",
  onClick: g,
  onNodeClick: p,
  pannable: v = !1,
  zoomable: x = !1,
  ariaLabel: y,
  inversePan: _,
  zoomStep: m = 1,
  offsetScale: w = 5
}) {
  const S = le(), E = U(null), { boundingRect: k, viewBB: P, rfId: A, panZoom: O, translateExtent: C, flowWidth: D, flowHeight: z, ariaLabelConfig: b } = ee(Ix, ie), j = e?.width ?? Mx, N = e?.height ?? jx, M = k.width / j, I = k.height / N, T = Math.max(M, I), $ = T * j, L = T * N, R = w * T, F = k.x - ($ - k.width) / 2 - R, V = k.y - (L - k.height) / 2 - R, Y = $ + R * 2, K = L + R * 2, X = `${Px}-${A}`, B = U(0), H = U();
  B.current = T, J(() => {
    if (E.current && O)
      return H.current = Yp({
        domNode: E.current,
        panZoom: O,
        getTransform: () => S.getState().transform,
        getViewScale: () => B.current
      }), () => {
        H.current?.destroy();
      };
  }, [O]), J(() => {
    H.current?.update({
      translateExtent: C,
      width: D,
      height: z,
      inversePan: _,
      pannable: v,
      zoomStep: m,
      zoomable: x
    });
  }, [v, x, _, m, C, D, z]);
  const Z = g ? (q) => {
    const [re, ae] = H.current?.pointer(q) || [0, 0];
    g(q, { x: re, y: ae });
  } : void 0, Q = p ? ne((q, re) => {
    const ae = S.getState().nodeLookup.get(re).internals.userNode;
    p(q, ae);
  }, []) : void 0, G = y ?? b["minimap.ariaLabel"];
  return u.jsx(Cn, { position: h, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof f == "string" ? f : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof d == "number" ? d * T : void 0,
    "--xy-minimap-node-background-color-props": typeof o == "string" ? o : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof i == "number" ? i : void 0
  }, className: de(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: u.jsxs("svg", { width: j, height: N, viewBox: `${F} ${V} ${Y} ${K}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": X, ref: E, onClick: Z, children: [G && u.jsx("title", { id: X, children: G }), u.jsx(Cx, { onClick: Q, nodeColor: o, nodeStrokeColor: n, nodeBorderRadius: s, nodeClassName: r, nodeStrokeWidth: i, nodeComponent: a }), u.jsx("path", { className: "react-flow__minimap-mask", d: `M${F - R},${V - R}h${Y + R * 2}v${K + R * 2}h${-Y - R * 2}z
        M${P.x},${P.y}h${P.width}v${P.height}h${-P.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
Ia.displayName = "MiniMap";
ue(Ia);
const Ax = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, Dx = {
  [ot.Line]: "right",
  [ot.Handle]: "bottom-right"
};
function Tx({ nodeId: e, position: t, variant: n = ot.Handle, className: o, style: r = void 0, children: s, color: i, minWidth: a = 10, minHeight: l = 10, maxWidth: c = Number.MAX_VALUE, maxHeight: f = Number.MAX_VALUE, keepAspectRatio: d = !1, resizeDirection: h, autoScale: g = !0, shouldResize: p, onResizeStart: v, onResize: x, onResizeEnd: y }) {
  const _ = ca(), m = typeof e == "string" ? e : _, w = le(), S = U(null), E = n === ot.Handle, k = ee(ne(Ax(E && g), [E, g]), ie), P = U(null), A = t ?? Dx[n];
  J(() => {
    if (!(!S.current || !m))
      return P.current || (P.current = sg({
        domNode: S.current,
        nodeId: m,
        getStoreItems: () => {
          const { nodeLookup: C, transform: D, snapGrid: z, snapToGrid: b, nodeOrigin: j, domNode: N } = w.getState();
          return {
            nodeLookup: C,
            transform: D,
            snapGrid: z,
            snapToGrid: b,
            nodeOrigin: j,
            paneDomNode: N
          };
        },
        onChange: (C, D) => {
          const { triggerNodeChanges: z, nodeLookup: b, parentLookup: j, nodeOrigin: N } = w.getState(), M = [], I = { x: C.x, y: C.y }, T = b.get(m);
          if (T && T.expandParent && T.parentId) {
            const $ = T.origin ?? N, L = C.width ?? T.measured.width ?? 0, R = C.height ?? T.measured.height ?? 0, F = {
              id: T.id,
              parentId: T.parentId,
              rect: {
                width: L,
                height: R,
                ...Di({
                  x: C.x ?? T.position.x,
                  y: C.y ?? T.position.y
                }, { width: L, height: R }, T.parentId, b, $)
              }
            }, V = ko([F], b, j, N);
            M.push(...V), I.x = C.x ? Math.max($[0] * L, C.x) : void 0, I.y = C.y ? Math.max($[1] * R, C.y) : void 0;
          }
          if (I.x !== void 0 && I.y !== void 0) {
            const $ = {
              id: m,
              type: "position",
              position: { ...I }
            };
            M.push($);
          }
          if (C.width !== void 0 && C.height !== void 0) {
            const L = {
              id: m,
              type: "dimensions",
              resizing: !0,
              setAttributes: h ? h === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: C.width,
                height: C.height
              }
            };
            M.push(L);
          }
          for (const $ of D) {
            const L = {
              ...$,
              type: "position"
            };
            M.push(L);
          }
          z(M);
        },
        onEnd: ({ width: C, height: D }) => {
          const z = {
            id: m,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: C,
              height: D
            }
          };
          w.getState().triggerNodeChanges([z]);
        }
      })), P.current.update({
        controlPosition: A,
        boundaries: {
          minWidth: a,
          minHeight: l,
          maxWidth: c,
          maxHeight: f
        },
        keepAspectRatio: d,
        resizeDirection: h,
        onResizeStart: v,
        onResize: x,
        onResizeEnd: y,
        shouldResize: p
      }), () => {
        P.current?.destroy();
      };
  }, [
    A,
    a,
    l,
    c,
    f,
    d,
    v,
    x,
    y,
    p
  ]);
  const O = A.split("-");
  return u.jsx("div", { className: de(["react-flow__resize-control", "nodrag", ...O, n, o]), ref: S, style: {
    ...r,
    scale: k,
    ...i && { [E ? "backgroundColor" : "borderColor"]: i }
  }, children: s });
}
ue(Tx);
const zx = "border-dashed border-border-default bg-surface-page text-text-secondary shadow-sm hover:border-border-strong", Kr = "var(--xy-edge-stroke)", $x = ({
  id: e,
  sourceX: t,
  sourceY: n,
  targetX: o,
  targetY: r,
  sourcePosition: s,
  targetPosition: i,
  data: a
}) => {
  const [l, c] = te(!1), [f, d] = te(!1), [h, g] = te(!1), p = a, [v, x, y] = dn({
    sourceX: t,
    sourceY: n,
    sourcePosition: s,
    targetX: o,
    targetY: r,
    targetPosition: i
  });
  if (!p)
    return /* @__PURE__ */ u.jsx(rt, { id: e, path: v, style: { stroke: Kr } });
  const _ = (E) => {
    c(!1), p.onPick(E, { sourceId: p.sourceId, targetId: p.targetId });
  }, m = l || f || h, w = /* @__PURE__ */ u.jsx(
    "button",
    {
      "aria-label": "Insert step here",
      className: oe(
        "flex size-8 items-center justify-center rounded-full border transition-opacity focus-visible:opacity-100 focus-visible:outline-none",
        zx,
        m ? "opacity-100" : "opacity-0",
        p.disabled && "cursor-not-allowed!"
      ),
      "data-testid": `add-step-button-${p.sourceId}-${p.targetId}`,
      disabled: p.disabled,
      type: "button",
      children: /* @__PURE__ */ u.jsx(yt, { className: "size-5", strokeWidth: 1.5 })
    }
  );
  let S;
  return p.disabled ? S = p.disabledReason ? /* @__PURE__ */ u.jsx(ds, { delayDuration: 150, children: /* @__PURE__ */ u.jsxs(fs, { children: [
    /* @__PURE__ */ u.jsx(hs, { asChild: !0, children: /* @__PURE__ */ u.jsx("span", { tabIndex: 0, children: w }) }),
    /* @__PURE__ */ u.jsx(ps, { children: p.disabledReason })
  ] }) }) : w : S = /* @__PURE__ */ u.jsxs(cs, { open: l, onOpenChange: c, children: [
    /* @__PURE__ */ u.jsx(ls, { asChild: !0, children: w }),
    /* @__PURE__ */ u.jsx(us, { align: "center", className: "border-0 p-0 shadow-lg", side: "top", sideOffset: 12, children: /* @__PURE__ */ u.jsx(Qs, { onPick: _ }) })
  ] }), /* @__PURE__ */ u.jsxs(
    "g",
    {
      onMouseEnter: () => d(!0),
      onMouseLeave: () => d(!1),
      children: [
        /* @__PURE__ */ u.jsx(rt, { id: e, interactionWidth: 30, path: v, style: { stroke: Kr } }),
        /* @__PURE__ */ u.jsx(sx, { children: /* @__PURE__ */ u.jsx(
          "div",
          {
            className: "pointer-events-auto absolute",
            style: {
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`
            },
            onMouseEnter: () => g(!0),
            onMouseLeave: () => g(!1),
            children: /* @__PURE__ */ u.jsx("div", { className: "flex h-10 w-16 items-center justify-center", children: S })
          }
        ) })
      ]
    }
  );
}, Lx = () => {
  const { data: e } = pn(), { data: t } = ll(), n = e?.settings || [], o = t?.site?.url || "", [
    r = "all",
    s = !1,
    i = !1
  ] = gn(n, [
    "members_signup_access",
    "donations_enabled",
    "recommendations_enabled"
  ]);
  return cu({
    siteUrl: o,
    membersSignupAccess: typeof r == "string" ? r : "all",
    donationsEnabled: !!s,
    recommendationsEnabled: !!i
  });
}, Rx = {
  useFileUpload: ru,
  fileTypes: ft
}, Ox = _e.lazy(() => import("./koenig-lexical-cRm7bY-6.mjs").then((e) => ({ default: e.EmailEditor })));
class Hx extends _e.Component {
  state = { hasError: !1 };
  static getDerivedStateFromError() {
    return { hasError: !0 };
  }
  render() {
    return this.state.hasError ? /* @__PURE__ */ u.jsx("div", { className: "p-6 text-sm text-destructive", children: "Something went wrong loading the editor." }) : this.props.children;
  }
}
const Bx = oe(
  // Base typography
  "text-[1.6rem] leading-[1.6] tracking-[-0.01em] pb-10",
  // Dark mode
  "dark:text-white dark:selection:bg-[rgba(88,101,116,0.99)]",
  // Placeholder styling
  "[&_.koenig-lexical-editor-input-placeholder]:font-sans! [&_.koenig-lexical-editor-input-placeholder]:text-[1.6rem] [&_.koenig-lexical-editor-input-placeholder]:tracking-tight",
  // Headings dark mode
  "[&_:is(h2,h3)]:dark:text-white",
  // Inputs
  "[&_.koenig-lexical_input]:text-[1.4rem]",
  // Plus icon
  "[&_[data-kg-plus-button]]:top-[-4px]",
  // Settings panel
  "[&_[data-kg-card-selected]]:isolate",
  // Content typography
  "[&_:is(p,blockquote,aside,ul,ol)]:tracking-tight",
  // Reset content typography inside card captions to match Koenig's caption styles
  "[&_figcaption_:is(p,blockquote,aside,ul,ol)]:text-[1.4rem] [&_figcaption_:is(p,blockquote,aside,ul,ol)]:tracking-[.025em]",
  "[&_figcaption_p]:mb-0",
  "[&_:is(h1)]:text-[36px] [&_:is(h2)]:text-[32px] [&_:is(h3)]:text-[26px] [&_:is(h4)]:text-[21px] [&_:is(h5)]:text-[19px] [&_:is(h6)]:text-[19px] [&_:is(h1,h2,h3,h4,h5,h6)]:mb-[0.5em]",
  // Horizontal ruler
  "[&_:is(hr)]:pt-0",
  // Paragraph spacing & bold
  "[&_p]:mb-4 [&_strong]:font-semibold",
  // Keep settings panel copy compact
  "[&_[data-kg-settings-panel]_p]:!mb-0",
  // Nested-editor (callout, etc.) fixes: align placeholder with text
  "[&_.not-kg-prose>div]:font-sans! [&_.not-kg-prose>div]:tracking-tight! [&_.not-kg-prose>div]:text-[1.6rem]! [&_.not-kg-prose>div]:leading-[1.6]!",
  "[&_.kg-inherit-styles_p]:mb-0!",
  "[&_.kg-inherit-styles]:pt-[3px]!",
  // CTA card: keep sponsor label at its intended 12.5px size
  "[&_.koenig-lexical-cta-label_p]:!text-[12.5px]"
), Vx = ({
  value: e,
  placeholder: t,
  className: n,
  onChange: o
}) => {
  const r = U(null), s = U(e), { unsplashConfig: i } = Xc(), a = td(), { data: l } = pn(), { data: c } = ho(), f = l?.settings || [], d = c?.config, { fetchAutocompleteLinks: h, searchLinks: g } = Lx(), p = su(), v = d?.tenor?.googleApiKey ? d.tenor : null, [x] = gn(f, ["transistor"]), y = he(() => ({
    unsplash: i,
    pinturaConfig: a,
    tenor: v,
    fetchEmbed: p,
    fetchAutocompleteLinks: h,
    searchLinks: g,
    feature: {
      transistor: x
    },
    visibilitySettings: "none"
  }), [i, a, v, p, h, g, x]), _ = ne((E) => {
    r.current = E;
  }, []), m = ne((E) => {
    o && E && typeof E == "object" && o(JSON.stringify(E));
  }, [o]), w = ne((E) => {
    (E.metaKey || E.ctrlKey) && E.key === "k" && E.stopPropagation();
  }, []), S = (E) => {
    r.current && lu(r.current, E);
  };
  return /* @__PURE__ */ u.jsx("div", { className: "h-full", onKeyDown: w, onMouseDown: S, children: /* @__PURE__ */ u.jsx(Hx, { children: /* @__PURE__ */ u.jsx(Zc, { fallback: /* @__PURE__ */ u.jsx(He, { size: "lg" }), children: /* @__PURE__ */ u.jsx("div", { className: oe("koenig-react-editor w-full", Bx, n), children: /* @__PURE__ */ u.jsx(
    Ox,
    {
      cardConfig: y,
      className: "koenig-lexical koenig-lexical-editor-input",
      darkMode: !1,
      fileUploader: Rx,
      initialEditorState: s.current,
      placeholderText: t,
      registerAPI: _,
      onChange: m
    }
  ) }) }) }) });
}, Fx = _e.memo(Vx), Wx = ({ previewState: e }) => {
  const [t, n] = te(null), [o, r] = te(!1), s = U(!1), i = U(null), a = U(null), l = U(null), c = U(null);
  function f() {
    a.current?.disconnect(), a.current = null, l.current !== null && (window.cancelAnimationFrame(l.current), l.current = null), c.current !== null && (window.cancelAnimationFrame(c.current), c.current = null);
  }
  const d = e.status === "success" ? e.html : "";
  J(() => (f(), s.current = !1, r(!1), n(null), () => {
    f();
  }), [d, e.status]);
  function h() {
    const x = i.current, y = x?.contentDocument;
    if (!x || !y)
      return;
    y.documentElement.style.overflowY = "hidden", y.body.style.overflowY = "hidden";
    const _ = Math.max(
      y.documentElement?.scrollHeight || 0,
      y.body?.scrollHeight || 0,
      y.documentElement?.offsetHeight || 0,
      y.body?.offsetHeight || 0
    );
    _ > 0 && (n((m) => m === _ ? m : _), !s.current && c.current === null && (c.current = window.requestAnimationFrame(() => {
      c.current = window.requestAnimationFrame(() => {
        c.current = null, s.current = !0, r(!0);
      });
    })));
  }
  function g() {
    l.current !== null && window.cancelAnimationFrame(l.current), l.current = window.requestAnimationFrame(() => {
      l.current = null, h();
    });
  }
  function p() {
    const x = i.current, y = x?.contentDocument;
    if (!(!x || !y) && (f(), g(), typeof ResizeObserver < "u")) {
      const _ = new ResizeObserver(() => {
        g();
      });
      _.observe(y.documentElement), _.observe(y.body), a.current = _;
    }
  }
  const v = e.status === "loading" || e.status === "success" && !o;
  return /* @__PURE__ */ u.jsxs("div", { className: "relative w-full", "data-testid": "email-preview", children: [
    v && /* @__PURE__ */ u.jsx(
      "div",
      {
        className: "flex min-h-full items-start justify-center pt-24",
        "data-testid": "email-preview-loading",
        style: t ? { height: `${t}px` } : void 0,
        children: /* @__PURE__ */ u.jsx(He, { size: "md" })
      }
    ),
    e.status === "success" && /* @__PURE__ */ u.jsx(
      "div",
      {
        "aria-hidden": !o,
        className: oe(
          "w-full",
          !o && "pointer-events-none absolute left-0 top-0 opacity-0"
        ),
        children: /* @__PURE__ */ u.jsx(
          "iframe",
          {
            ref: i,
            className: "w-full rounded bg-white",
            "data-testid": "email-preview-iframe",
            sandbox: "allow-same-origin allow-popups allow-popups-to-escape-sandbox",
            srcDoc: e.html,
            style: { height: t ? `${t}px` : "600px" },
            title: "Email preview",
            onLoad: p
          }
        )
      }
    ),
    (e.status === "error" || e.status === "invalid") && /* @__PURE__ */ u.jsx("div", { className: "flex h-full items-center justify-center px-4", "data-testid": "email-preview-error", children: /* @__PURE__ */ u.jsx("span", { className: "text-sm text-destructive", children: e.message }) })
  ] });
}, Yx = ({
  automatedEmailId: e,
  subject: t,
  lexical: n,
  validateForm: o,
  onClose: r
}) => {
  const { data: s } = rl(), { mutateAsync: i } = dl(), [a, l] = te(s?.email || ""), [c, f] = te(""), [d, h] = te("idle"), g = U(null);
  J(() => () => {
    g.current && clearTimeout(g.current);
  }, []), J(() => {
    s?.email && l(s.email);
  }, [s?.email]), J(() => {
    const v = (x) => {
      x.key === "Escape" && (x.stopPropagation(), r());
    };
    return document.addEventListener("keydown", v, !0), () => document.removeEventListener("keydown", v, !0);
  }, [r]);
  const p = async () => {
    if (f(""), !fl.isEmail(a)) {
      f("Please enter a valid email address");
      return;
    }
    if (!o()) {
      f("Please complete the required fields");
      return;
    }
    h("sending");
    try {
      await i({
        id: e,
        email: a,
        subject: t,
        lexical: n
      }), h("sent"), g.current && clearTimeout(g.current), g.current = setTimeout(() => h("idle"), 2e3);
    } catch (v) {
      h("idle");
      let x;
      v instanceof as && v.data && v.data.errors[0] ? x = v.data.errors[0].context || v.data.errors[0].message : v instanceof Error && (x = v.message), f(x || "Failed to send test email");
    }
  };
  return /* @__PURE__ */ u.jsxs("div", { className: "absolute top-full right-0 z-10 mt-2 w-[260px] rounded border border-grey-300 bg-white p-4 shadow-lg dark:border-grey-950 dark:bg-grey-950", "data-testid": "test-email-dropdown", children: [
    /* @__PURE__ */ u.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ u.jsx("label", { className: "mb-2 block text-sm font-semibold", htmlFor: "test-email-input", children: "Send test email" }),
      /* @__PURE__ */ u.jsx(
        mn,
        {
          id: "test-email-input",
          placeholder: "you@yoursite.com",
          value: a,
          onChange: (v) => {
            l(v.target.value);
          }
        }
      )
    ] }),
    /* @__PURE__ */ u.jsx(
      fe,
      {
        className: "w-full",
        disabled: d === "sending",
        onClick: p,
        children: d === "sent" ? "Sent" : d === "sending" ? "Sending..." : "Send"
      }
    ),
    c && /* @__PURE__ */ u.jsx("span", { className: "mt-2 block text-xs text-destructive", children: c })
  ] });
}, Po = (e, t, n) => po(t) && !gs(t) && n ? n : e.sender_email || n || "", Xx = (e, t, n, o) => e.sender_reply_to === "newsletter" ? po(t) ? "" : Po(e, t, o) : e.sender_reply_to === "support" ? n || o || "" : e.sender_reply_to, Zx = (e, t, n, o) => {
  const r = Xx(e, t, n, o);
  return r || (e.sender_reply_to === "newsletter" ? Po(e, t, o) || n || o || "" : n || o || "");
}, io = {
  free: "member-welcome-email-free",
  paid: "member-welcome-email-paid"
}, ze = (e) => e?.trim() || "", Fn = (...e) => e.map(ze).find(Boolean) || "", Ux = ({
  automatedEmails: e = [],
  config: t,
  defaultEmailAddress: n,
  newsletter: o,
  siteTitle: r,
  supportEmailAddress: s
}) => {
  const i = e.find((k) => k.slug === io.free), a = e.find((k) => k.slug === io.paid), l = Fn(i?.sender_name, a?.sender_name), c = Fn(i?.sender_email, a?.sender_email), f = Fn(i?.sender_reply_to, a?.sender_reply_to), d = ze(o?.sender_name), h = o ? ze(Po(o, t, n || void 0)) : "", g = o ? ze(Zx(o, t, s || void 0, n || void 0)) : "", p = d || ze(r) || "Your site name", v = h || ze(n), x = g || ze(s) || ze(n), y = l || p, _ = c || v || "", m = f || x || "", w = m !== "" && m !== _, S = po(t), E = gs(t);
  return {
    hasDistinctReplyTo: w,
    replyToEmailInput: f,
    replyToEmailPlaceholder: x,
    resolvedReplyToEmail: m,
    resolvedSenderEmail: _,
    resolvedSenderName: y,
    senderEmailDomain: E ? cl(t) : null,
    senderEmailInput: c,
    senderEmailPlaceholder: v,
    senderNameInput: l,
    senderNamePlaceholder: p,
    showSenderEmailInput: !S || E
  };
}, Gx = (e) => {
  if (!e)
    return !0;
  try {
    const n = JSON.parse(e)?.root?.children;
    return !n || n.length === 0 || n.length === 1 && n[0].type === "paragraph" && (!n[0].children || n[0].children.length === 0);
  } catch {
    return !0;
  }
}, Pa = (e) => {
  const t = {};
  return e.subject?.trim() || (t.subject = "A subject is required"), Gx(e.lexical) && (t.lexical = "Email content is required"), t;
}, qx = (e) => {
  if (typeof DOMParser > "u")
    return e;
  const n = new DOMParser().parseFromString(e, "text/html");
  return n.querySelectorAll("a[href]").forEach((o) => {
    o.target = "_blank", o.rel = "noopener noreferrer";
  }), `<!doctype html>${n.documentElement.outerHTML}`;
}, Kx = (e) => {
  const t = "Failed to render preview";
  return e instanceof as && e.data?.errors?.[0] ? e.data.errors[0].context || e.data.errors[0].message || t : e instanceof Error && e.message ? e.message : t;
}, Qx = ({ automatedEmailId: e, previewWelcomeEmail: t, setErrors: n }) => {
  const [o, r] = te({ status: "idle" }), s = U(0), i = () => {
    s.current += 1, r({ status: "idle" });
  }, a = async (c) => {
    const f = s.current + 1;
    s.current = f;
    const d = Pa(c);
    if (n(d), !!(d.subject || d.lexical)) {
      r({
        status: "invalid",
        message: d.subject || d.lexical
      });
      return;
    }
    r({ status: "loading" });
    try {
      const g = await t({
        id: e,
        subject: c.subject,
        lexical: c.lexical
      });
      if (s.current !== f)
        return;
      const p = g.automated_emails?.[0];
      if (!p?.html || !p?.plaintext || !p?.subject)
        throw new Error("Preview response was incomplete");
      r({
        status: "success",
        preview: {
          ...p,
          html: qx(p.html)
        }
      });
    } catch (g) {
      if (s.current !== f)
        return;
      r({
        status: "error",
        message: Kx(g)
      });
    }
  };
  let l = { status: "loading" };
  return o.status === "success" ? l = { status: "success", html: o.preview.html } : (o.status === "error" || o.status === "invalid") && (l = { status: o.status, message: o.message }), {
    previewFrameState: l,
    previewState: o,
    enterPreview: a,
    exitPreview: i
  };
}, Jx = (e = []) => {
  const { data: t } = pn(), { data: n } = ho(), o = t?.settings || [], r = he(() => n?.config || {}, [n]), [s, i, a] = gn(o, ["title", "default_email_address", "support_email_address"]), { data: l } = hl({
    searchParams: {
      filter: "status:active",
      limit: "1"
    }
  }), c = l?.newsletters?.[0];
  return he(() => Ux({
    automatedEmails: e,
    config: r,
    defaultEmailAddress: i,
    newsletter: c,
    siteTitle: s,
    supportEmailAddress: a
  }), [e, r, i, c, s, a]);
}, Aa = _e.forwardRef(({ title: e, centeredHeaderContent: t, headerActions: n, children: o, className: r, isEditMode: s = !1 }, i) => /* @__PURE__ */ u.jsxs(
  "div",
  {
    ref: i,
    className: oe(
      "flex h-full w-full flex-col gap-0 overflow-hidden p-0",
      s ? "bg-white" : "bg-gray-100",
      "dark:bg-gray-975",
      r
    ),
    children: [
      /* @__PURE__ */ u.jsxs("div", { className: "sticky top-0 grid shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-gray-200 bg-white px-5 py-3 dark:border-gray-900 dark:bg-gray-950", children: [
        /* @__PURE__ */ u.jsx("h3", { className: "justify-self-start text-xl font-semibold", children: e }),
        /* @__PURE__ */ u.jsx("div", { className: "justify-self-center", children: t }),
        /* @__PURE__ */ u.jsx("div", { className: "flex items-center gap-2 justify-self-end", children: n })
      ] }),
      /* @__PURE__ */ u.jsx("div", { className: "flex min-h-0 grow flex-col overflow-y-auto [scrollbar-gutter:stable]", children: o })
    ]
  }
));
Aa.displayName = "EmailPreviewModalContent";
const ey = ({ children: e, className: t }) => /* @__PURE__ */ u.jsx("div", { className: oe(
  "relative z-20 isolate mx-auto w-full max-w-[780px] rounded-t-lg border border-b-0 border-gray-200 bg-white px-6 py-4 transition-[max-width,padding] duration-300 ease-out motion-reduce:transition-none dark:border-grey-900 dark:bg-grey-975",
  t
), children: e }), ty = ({ children: e, className: t }) => /* @__PURE__ */ u.jsx("div", { className: oe(
  "flex mx-auto w-full rounded-b-lg transition-[max-width,height,padding] duration-300 ease-out motion-reduce:transition-none dark:border-grey-900 dark:shadow-none grow max-w-[780px]",
  t
), children: e }), ny = ({ initialMode: e = "edit", initialSubject: t, initialLexical: n, onClose: o, onSave: r }) => {
  const { mutateAsync: s } = pl(), { data: i } = gl(), [a, l] = te(!1), [c, f] = te(e), [d, h] = te(null), [g, p] = te(!1), v = U(!1), x = U(null), y = U(n || ""), _ = U(!1), m = sl(), w = i?.automated_emails || [], { resolvedSenderName: S, resolvedSenderEmail: E, resolvedReplyToEmail: k, hasDistinctReplyTo: P } = Jx(w), A = (w.find((H) => H.slug === io.free) || w[0])?.id || "", { formState: O, saveState: C, updateForm: D, setFormState: z, setErrors: b, handleSave: j, okProps: N, errors: M, validate: I } = ml({
    initialState: {
      subject: t || "",
      lexical: n || ""
    },
    savingDelay: 500,
    onSave: async (H) => {
      r({ subject: H.subject, lexical: H.lexical });
    },
    onSaveError: m,
    onValidate: Pa
  }), T = N.label || "Save", { previewFrameState: $, enterPreview: L, exitPreview: R } = Qx({
    automatedEmailId: A,
    previewWelcomeEmail: s,
    setErrors: b
  });
  J(() => {
    e !== "preview" || v.current || (v.current = !0, L(O));
  }, [L, O, e]);
  const F = C === "unsaved", V = ne(() => {
    F ? p(!0) : o();
  }, [F, o]), Y = ne(async () => {
    await j({ fakeWhenUnchanged: !0 }) && o();
  }, [j, o]);
  J(() => {
    const H = (Z) => {
      x.current && !x.current.contains(Z.target) && l(!1);
    };
    return a && document.addEventListener("mousedown", H), () => {
      document.removeEventListener("mousedown", H);
    };
  }, [a]);
  const K = U(Y);
  J(() => {
    K.current = Y;
  }, [Y]), J(() => {
    const H = (Z) => {
      (Z.metaKey || Z.ctrlKey) && Z.key === "s" && (Z.preventDefault(), K.current());
    };
    return window.addEventListener("keydown", H), () => {
      window.removeEventListener("keydown", H);
    };
  }, []);
  const X = ne((H) => {
    f(H), H === "preview" ? (h(null), L(O)) : (l(!1), h(null), R());
  }, [L, R, O]), B = ne((H) => {
    if (!_.current) {
      y.current = H, z((Z) => ({ ...Z, lexical: H }));
      return;
    }
    H !== y.current ? D((Z) => ({ ...Z, lexical: H })) : z((Z) => ({ ...Z, lexical: H }));
  }, [z, D]);
  return /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
    /* @__PURE__ */ u.jsx(Ml, { open: !0, onOpenChange: (H) => {
      H || V();
    }, children: /* @__PURE__ */ u.jsxs(
      jl,
      {
        "aria-describedby": void 0,
        className: "top-0 left-0 h-[100dvh] w-full max-w-full translate-x-0 translate-y-0 grid-rows-[1fr] gap-0 rounded-none border-0 p-0 shadow-none outline-hidden sm:rounded-none dark:bg-[#151719]",
        onEscapeKeyDown: (H) => {
          H.preventDefault(), H.stopPropagation(), V();
        },
        children: [
          /* @__PURE__ */ u.jsx(kl, { className: "sr-only", children: "Edit email" }),
          /* @__PURE__ */ u.jsx(
            Aa,
            {
              centeredHeaderContent: /* @__PURE__ */ u.jsx(
                Il,
                {
                  "data-testid": "email-mode-toggle",
                  value: c,
                  variant: "segmented-sm",
                  onValueChange: (H) => H && X(H),
                  children: /* @__PURE__ */ u.jsxs(Pl, { className: "grid w-[240px] grid-cols-2 bg-gray-100 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]", children: [
                    /* @__PURE__ */ u.jsx(Xo, { className: "w-full justify-center data-[state=active]:bg-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black", "data-testid": "email-mode-edit", value: "edit", children: "Email content" }),
                    /* @__PURE__ */ u.jsx(Xo, { className: "w-full justify-center", "data-testid": "email-mode-preview", value: "preview", children: "Preview" })
                  ] })
                }
              ),
              headerActions: /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
                /* @__PURE__ */ u.jsx(fe, { variant: "outline", onClick: V, children: "Close" }),
                /* @__PURE__ */ u.jsx(
                  fe,
                  {
                    disabled: N.disabled,
                    onClick: Y,
                    children: T
                  }
                )
              ] }),
              isEditMode: c === "edit",
              title: "Edit email",
              children: /* @__PURE__ */ u.jsxs("div", { className: "flex grow flex-col items-center p-6", children: [
                c === "preview" && /* @__PURE__ */ u.jsx(ey, { className: "border-x-0 border-t-0 border-b", children: /* @__PURE__ */ u.jsxs("div", { className: "flex flex-col gap-2", children: [
                  /* @__PURE__ */ u.jsxs("div", { className: "flex items-center py-1", children: [
                    /* @__PURE__ */ u.jsx("div", { className: "w-20 shrink-0 text-sm font-semibold", children: "From:" }),
                    /* @__PURE__ */ u.jsx("div", { className: "min-w-0 grow pr-4 text-sm", children: /* @__PURE__ */ u.jsxs("span", { className: "flex gap-1 truncate whitespace-nowrap", children: [
                      /* @__PURE__ */ u.jsx("span", { children: S }),
                      /* @__PURE__ */ u.jsx("span", { className: "text-gray-500 dark:text-gray-400", children: `<${E}>` })
                    ] }) }),
                    /* @__PURE__ */ u.jsxs("div", { ref: x, className: "relative", children: [
                      /* @__PURE__ */ u.jsxs(fe, { variant: "outline", onClick: () => l(!a), children: [
                        /* @__PURE__ */ u.jsx(Kc, { className: "size-4" }),
                        "Test"
                      ] }),
                      a && /* @__PURE__ */ u.jsx(Yx, { automatedEmailId: A, lexical: O.lexical, subject: O.subject, validateForm: I, onClose: () => l(!1) })
                    ] })
                  ] }),
                  P && /* @__PURE__ */ u.jsxs("div", { className: "flex items-center", children: [
                    /* @__PURE__ */ u.jsx("div", { className: "w-20 shrink-0 text-sm font-semibold", children: "Reply-to:" }),
                    /* @__PURE__ */ u.jsx("div", { className: "grow text-sm text-gray-500 dark:text-gray-400", children: k })
                  ] }),
                  /* @__PURE__ */ u.jsxs("div", { className: "flex items-center", children: [
                    /* @__PURE__ */ u.jsx("div", { className: "w-20 shrink-0 text-sm font-semibold", children: "Subject:" }),
                    /* @__PURE__ */ u.jsxs("div", { className: "grow", children: [
                      /* @__PURE__ */ u.jsx(
                        mn,
                        {
                          className: "w-full",
                          "data-testid": "email-preview-subject",
                          value: d ?? O.subject,
                          onChange: (H) => {
                            const Z = H.target.value;
                            h(Z), D((Q) => ({ ...Q, subject: Z }));
                          }
                        }
                      ),
                      M.subject && /* @__PURE__ */ u.jsx("span", { className: "mt-2 block text-xs text-destructive", children: M.subject })
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ u.jsxs(ty, { className: oe(
                  c === "preview" && "shadow-sm bg-white dark:bg-grey-975",
                  c === "edit" && "px-6",
                  c === "edit" && "rounded-lg",
                  c === "edit" && M.lexical && "border border-red-500"
                ), children: [
                  /* @__PURE__ */ u.jsx(
                    "div",
                    {
                      className: oe(
                        "mx-auto w-full max-w-[600px] pt-10 pb-8 transition-[max-width,padding] duration-300 ease-out motion-reduce:transition-none",
                        c === "preview" && "hidden"
                      ),
                      "data-testid": "email-editor",
                      onFocus: () => {
                        _.current = !0;
                      },
                      children: /* @__PURE__ */ u.jsx(
                        Fx,
                        {
                          className: "automation-email-editor",
                          placeholder: "Write your email content...",
                          value: O.lexical,
                          onChange: B
                        }
                      )
                    }
                  ),
                  c === "preview" && /* @__PURE__ */ u.jsx(Wx, { previewState: $ })
                ] }),
                c === "edit" && M.lexical && /* @__PURE__ */ u.jsx("span", { className: "mt-2 block max-w-[740px] text-xs text-destructive", children: M.lexical })
              ] })
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ u.jsx(Ft, { open: g, onOpenChange: p, children: /* @__PURE__ */ u.jsxs(Wt, { children: [
      /* @__PURE__ */ u.jsxs(Yt, { children: [
        /* @__PURE__ */ u.jsx(Xt, { children: "Discard changes?" }),
        /* @__PURE__ */ u.jsx(Zt, { children: "Your changes to this email haven't been saved." })
      ] }),
      /* @__PURE__ */ u.jsxs(Ut, { children: [
        /* @__PURE__ */ u.jsx(Gt, { children: "Keep editing" }),
        /* @__PURE__ */ u.jsx(
          fe,
          {
            variant: "destructive",
            onClick: () => {
              p(!1), o();
            },
            children: "Discard"
          }
        )
      ] })
    ] }) })
  ] });
}, tn = 30, oy = /^\d+$/, nn = 0, ry = 256, sy = nn + ry / 2, Qr = 180, iy = 40, ay = 180, cy = 250, ly = `Limit of ${gt(Yn)} steps reached`, uy = "var(--xy-edge-stroke)", dy = [1.5, 1, 0.75, 0.5, 0.25], Me = "__trigger__", Be = "__tail__", fy = ({ sourceId: e, targetId: t }) => ({
  previousActionId: e === Me ? void 0 : e,
  nextActionId: t === Be ? void 0 : t
}), hy = {
  background: "transparent",
  border: "none",
  height: 0,
  minHeight: 0,
  minWidth: 0,
  opacity: 0,
  pointerEvents: "none",
  width: 0
}, Mt = ({ type: e, position: t }) => /* @__PURE__ */ u.jsx(Ct, { isConnectable: !1, position: t, style: hy, type: e }), Da = ({ children: e, className: t, data: n }) => {
  const o = U(!1);
  return /* @__PURE__ */ u.jsxs(Ru, { onOpenChange: (r) => {
    r || (o.current = !1);
  }, children: [
    /* @__PURE__ */ u.jsx(Ou, { asChild: !0, children: /* @__PURE__ */ u.jsx(
      "button",
      {
        "aria-label": n.value ? `${n.label}: ${n.value}` : n.label,
        "aria-pressed": n.selected,
        className: oe(
          "flex w-64 items-center gap-3 rounded-lg border border-transparent bg-surface-elevated p-3 text-left text-sm text-foreground shadow-sm transition-all focus-visible:border-border-strong focus-visible:outline-none",
          !n.selected && "hover:border-border-strong",
          n.selected && "border-gray-700 shadow-[inset_0_0_0_1px_var(--color-gray-700),0_1px_2px_0_rgb(0_0_0_/_0.05)]",
          n.isNew && "animate-in fade-in-0 zoom-in-90 duration-250 ease-out motion-reduce:animate-none",
          t
        ),
        type: "button",
        onClick: (r) => {
          if (r.stopPropagation(), r.button !== 0 || o.current) {
            o.current = !1;
            return;
          }
          n.onSelect();
        },
        onContextMenu: (r) => {
          o.current = !0, r.stopPropagation();
        },
        onPointerDown: (r) => {
          r.button === 2 && r.stopPropagation();
        },
        children: e
      }
    ) }),
    /* @__PURE__ */ u.jsx(
      Gs,
      {
        className: "w-44",
        onClick: (r) => r.stopPropagation(),
        onPointerDown: (r) => r.stopPropagation(),
        children: n.contextMenuItems.map((r) => {
          if (r.type === "separator")
            return /* @__PURE__ */ u.jsx(Ks, {}, r.id);
          const s = r.icon;
          return /* @__PURE__ */ u.jsxs(qs, { variant: r.variant, onSelect: r.onSelect, children: [
            s && /* @__PURE__ */ u.jsx(s, { className: "size-4" }),
            r.label
          ] }, r.label);
        })
      }
    )
  ] });
}, Ta = ({ data: e }) => {
  const t = e.icon;
  return /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
    /* @__PURE__ */ u.jsx("div", { className: "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-text-secondary", children: /* @__PURE__ */ u.jsx(t, { className: "size-4" }) }),
    /* @__PURE__ */ u.jsxs("div", { className: "flex min-w-0 flex-col text-left", children: [
      /* @__PURE__ */ u.jsx("span", { className: "text-xs text-text-secondary", children: e.label }),
      e.value && /* @__PURE__ */ u.jsx("span", { className: "truncate font-medium", children: e.value })
    ] })
  ] });
}, za = _e.memo(({ data: e }) => /* @__PURE__ */ u.jsxs(Da, { data: e, children: [
  /* @__PURE__ */ u.jsx(Ta, { data: e }),
  /* @__PURE__ */ u.jsx(Mt, { position: W.Bottom, type: "source" })
] }));
za.displayName = "TriggerNode";
const $a = _e.memo(({ data: e }) => /* @__PURE__ */ u.jsxs(Da, { data: e, children: [
  /* @__PURE__ */ u.jsx(Mt, { position: W.Top, type: "target" }),
  /* @__PURE__ */ u.jsx(Ta, { data: e }),
  /* @__PURE__ */ u.jsx(Mt, { position: W.Bottom, type: "source" })
] }));
$a.displayName = "StepNode";
const py = ({ data: e }) => {
  const [t, n] = te(!1), o = (s) => {
    n(!1), e.onPick(s, e.anchor);
  }, r = "flex h-12 w-64 items-center justify-center rounded-lg border border-dashed border-border-default bg-surface-page transition-colors hover:border-border-strong focus-visible:border-border-strong focus-visible:outline-none";
  if (e.disabled) {
    const s = /* @__PURE__ */ u.jsxs(
      "div",
      {
        "aria-disabled": "true",
        className: oe(r, "cursor-not-allowed opacity-60"),
        "data-testid": "add-step-tail-button",
        children: [
          /* @__PURE__ */ u.jsx(Mt, { position: W.Top, type: "target" }),
          /* @__PURE__ */ u.jsx(yt, { className: "size-5 text-text-secondary", strokeWidth: 1.5 })
        ]
      }
    );
    return e.disabledReason ? /* @__PURE__ */ u.jsx(ds, { delayDuration: 150, children: /* @__PURE__ */ u.jsxs(fs, { children: [
      /* @__PURE__ */ u.jsx(hs, { asChild: !0, children: /* @__PURE__ */ u.jsx("span", { tabIndex: 0, children: s }) }),
      /* @__PURE__ */ u.jsx(ps, { children: e.disabledReason })
    ] }) }) : s;
  }
  return /* @__PURE__ */ u.jsxs(cs, { open: t, onOpenChange: n, children: [
    /* @__PURE__ */ u.jsxs(
      ls,
      {
        "aria-label": "Add step",
        className: oe(r, "cursor-pointer"),
        "data-testid": "add-step-tail-button",
        children: [
          /* @__PURE__ */ u.jsx(Mt, { position: W.Top, type: "target" }),
          /* @__PURE__ */ u.jsx(yt, { className: "size-5 text-text-secondary", strokeWidth: 1.5 })
        ]
      }
    ),
    /* @__PURE__ */ u.jsx(us, { align: "center", className: "border-0 p-0 shadow-lg", side: "top", sideOffset: 12, children: /* @__PURE__ */ u.jsx(Qs, { onPick: o }) })
  ] });
}, gy = {
  trigger: za,
  step: $a,
  tail: py
}, my = {
  "add-step-edge": $x
}, xy = () => {
  const [e, t] = te(!1), { fitView: n, zoomIn: o, zoomOut: r, zoomTo: s } = Mn(), { zoom: i } = ax(), a = { duration: ay }, l = Math.round(i * 100), c = (d) => {
    t(!1), s(d, a);
  }, f = () => {
    t(!1), n(a);
  };
  return /* @__PURE__ */ u.jsxs(
    wx,
    {
      className: "gap-1 overflow-hidden rounded-md bg-surface-elevated p-0.5 text-foreground shadow-sm",
      orientation: "horizontal",
      showFitView: !1,
      showInteractive: !1,
      showZoom: !1,
      style: { bottom: 24, left: 24 },
      children: [
        /* @__PURE__ */ u.jsx(
          fe,
          {
            "aria-label": "Zoom out",
            className: "rounded-sm text-text-secondary hover:text-foreground",
            size: "icon",
            title: "Zoom out",
            type: "button",
            variant: "ghost",
            onClick: () => {
              r(a);
            },
            children: /* @__PURE__ */ u.jsx(ss, { className: "size-5", strokeWidth: 1.5 })
          }
        ),
        /* @__PURE__ */ u.jsxs(ys, { open: e, onOpenChange: t, children: [
          /* @__PURE__ */ u.jsx(ws, { asChild: !0, children: /* @__PURE__ */ u.jsxs(
            fe,
            {
              "aria-label": `Zoom level ${gt(l)}%`,
              className: "min-w-14 rounded-sm px-2 font-semibold",
              type: "button",
              variant: "ghost",
              children: [
                gt(l),
                "%"
              ]
            }
          ) }),
          /* @__PURE__ */ u.jsxs(vs, { align: "center", className: "w-40", side: "top", sideOffset: 12, children: [
            dy.map((d) => {
              const h = Math.round(d * 100), g = Math.abs(i - d) < 0.01;
              return /* @__PURE__ */ u.jsxs(Zn, { onSelect: () => c(d), children: [
                gt(h),
                "%",
                g && /* @__PURE__ */ u.jsx(ql, { children: /* @__PURE__ */ u.jsx(ms, { className: "size-4 text-text-secondary", strokeWidth: 1.5 }) })
              ] }, d);
            }),
            /* @__PURE__ */ u.jsx(Kl, {}),
            /* @__PURE__ */ u.jsx(Zn, { onSelect: f, children: "Fit to view" })
          ] })
        ] }),
        /* @__PURE__ */ u.jsx(
          fe,
          {
            "aria-label": "Zoom in",
            className: "rounded-sm text-text-secondary hover:text-foreground",
            size: "icon",
            title: "Zoom in",
            type: "button",
            variant: "ghost",
            onClick: () => {
              o(a);
            },
            children: /* @__PURE__ */ u.jsx(yt, { className: "size-5", strokeWidth: 1.5 })
          }
        )
      ]
    }
  );
}, La = (e) => {
  if (e <= 0)
    throw new Error("Wait time must be a positive number of hours.");
  if (e % 24 === 0) {
    const t = e / 24;
    return t === 1 ? "1 day" : `${t} days`;
  }
  return e === 1 ? "1 hour" : `${e} hours`;
}, yy = (e) => {
  switch (e.type) {
    case "wait":
      return { icon: lo, label: "Wait", value: La(e.data.wait_hours) };
    case "send_email":
      return { icon: co, label: "Send email", value: e.data.email_subject };
    default: {
      const t = e;
      throw new Error(`Unknown automation action type: ${t}`);
    }
  }
}, Jr = ({
  canDelete: e = !1,
  canEditEmailBody: t = !1,
  onDelete: n,
  onEditEmailBody: o,
  onPreviewEmail: r,
  onSelectStep: s,
  stepId: i
}) => {
  const a = [{
    icon: Qc,
    label: "Edit settings",
    onSelect: () => s(i)
  }];
  return t && o && a.push({
    icon: bs,
    label: "Edit email body",
    onSelect: () => o(i)
  }), t && r && a.push({
    icon: al,
    label: "Preview",
    onSelect: () => r(i)
  }), e && n && (t && a.push({ id: "before-delete", type: "separator" }), a.push({
    icon: is,
    label: "Delete",
    onSelect: () => n(i),
    variant: "destructive"
  })), a;
}, wy = (e) => {
  if (e.actions.length === 0)
    return [];
  const t = new Map(e.actions.map((l) => [l.id, l])), n = new Set(e.edges.map((l) => l.target_action_id)), o = e.actions.find((l) => !n.has(l.id));
  if (!o)
    throw new Error(`Could not determine the starting step for automation ${e.id}.`);
  const r = new Map(e.edges.map((l) => [l.source_action_id, l.target_action_id])), s = [], i = /* @__PURE__ */ new Set();
  let a = o;
  for (; a; ) {
    if (i.has(a.id))
      throw new Error(`Detected a loop in automation ${e.id}.`);
    s.push(a), i.add(a.id);
    const l = r.get(a.id);
    a = l ? t.get(l) : void 0;
  }
  if (s.length !== e.actions.length)
    throw new Error(`Some steps in automation ${e.id} are missing or disconnected.`);
  return s;
}, vy = ({ automation: e, disabled: t, onDelete: n, onEditEmailBody: o, onPick: r, onPreviewEmail: s, onSelectStep: i, newStepId: a, selectedStepId: l }) => {
  const c = wy(e), f = {
    draggable: !1,
    selectable: !1,
    connectable: !1,
    focusable: !1
  }, d = t ? ly : void 0, g = {
    sourceId: c[c.length - 1]?.id ?? Me,
    targetId: Be
  }, p = [
    {
      id: Me,
      type: "trigger",
      position: { x: nn, y: 0 },
      data: {
        contextMenuItems: Jr({
          onSelectStep: i,
          stepId: Me
        }),
        icon: rs,
        isNew: !1,
        label: "Trigger",
        value: "Member signs up",
        selected: l === Me,
        onSelect: () => i(Me)
      },
      ...f
    }
  ];
  c.forEach((y, _) => {
    p.push({
      id: y.id,
      type: "step",
      position: { x: nn, y: Qr * (_ + 1) },
      data: {
        ...yy(y),
        contextMenuItems: Jr({
          canDelete: !0,
          canEditEmailBody: y.type === "send_email",
          onDelete: n,
          onEditEmailBody: o,
          onPreviewEmail: s,
          onSelectStep: i,
          stepId: y.id
        }),
        isNew: a === y.id,
        selected: l === y.id,
        onSelect: () => i(y.id)
      },
      ...f
    });
  }), p.push({
    id: Be,
    type: "tail",
    position: { x: nn, y: Qr * (c.length + 1) },
    data: { disabled: t, disabledReason: d, onPick: r, anchor: g },
    draggable: !1,
    connectable: !1
  });
  const v = [];
  let x = Me;
  return c.forEach((y) => {
    const _ = {
      sourceId: x,
      targetId: y.id,
      disabled: t,
      disabledReason: d,
      onPick: r
    };
    v.push({
      id: `e-${x}-${y.id}`,
      source: x,
      target: y.id,
      type: "add-step-edge",
      focusable: !1,
      data: _
    }), x = y.id;
  }), v.push({
    id: `e-${x}-${Be}`,
    source: x,
    target: Be,
    type: "smoothstep",
    focusable: !1,
    style: { stroke: uy }
  }), { nodes: p, edges: v };
}, by = (e) => ({
  x: Math.round(e / 2 - sy),
  y: iy,
  zoom: 1
}), _y = {
  "member-welcome-email-free": ["free"],
  "member-welcome-email-paid": ["paid"]
}, Ey = ({ automation: e, stepId: t, onDelete: n, onUpdateWait: o, onUpdateSubject: r, onEditEmail: s }) => {
  if (!t)
    return null;
  if (t === Me)
    return {
      icon: rs,
      label: "Trigger",
      title: "Member signs up",
      memberTiers: _y[e.slug] ?? [],
      type: "trigger"
    };
  const i = e.actions.find((a) => a.id === t);
  if (!i)
    return null;
  switch (i.type) {
    case "wait": {
      const a = La(i.data.wait_hours);
      return {
        icon: lo,
        label: "Wait",
        title: a,
        action: i,
        onDelete: () => n(i.id),
        onUpdate: (l) => o(i.id, l),
        type: "wait"
      };
    }
    case "send_email":
      return {
        icon: co,
        label: "Send email",
        title: i.data.email_subject || "No subject",
        action: i,
        onDelete: () => n(i.id),
        onUpdateSubject: (a) => r(i.id, a),
        onEditEmail: () => s(i.id),
        type: "send_email"
      };
    default: {
      const a = i;
      throw new Error(`Unknown automation action type: ${a}`);
    }
  }
}, Ao = ({ children: e, htmlFor: t, label: n }) => /* @__PURE__ */ u.jsxs(Xu, { children: [
  /* @__PURE__ */ u.jsx(Zu, { className: "text-xs font-medium text-text-secondary", htmlFor: t, children: n }),
  e
] }), Ny = ({ value: e }) => /* @__PURE__ */ u.jsx(Jl, { value: e, children: /* @__PURE__ */ u.jsx(eu, { disabled: !0, children: /* @__PURE__ */ u.jsx("span", { children: e }) }) }), Sy = ({ memberTiers: e }) => /* @__PURE__ */ u.jsxs("div", { className: "flex flex-col gap-5", children: [
  /* @__PURE__ */ u.jsx(Ao, { label: "Trigger", children: /* @__PURE__ */ u.jsx(Ny, { value: "New member sign up" }) }),
  /* @__PURE__ */ u.jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ u.jsx("span", { className: "text-xs font-medium text-text-secondary", children: "Members" }),
    /* @__PURE__ */ u.jsxs(Xn, { className: "flex items-center gap-2 text-sm font-normal text-foreground", children: [
      /* @__PURE__ */ u.jsx(Zo, { checked: e.includes("free"), disabled: !0 }),
      "Free"
    ] }),
    /* @__PURE__ */ u.jsxs(Xn, { className: "flex items-center gap-2 text-sm font-normal text-foreground", children: [
      /* @__PURE__ */ u.jsx(Zo, { checked: e.includes("paid"), disabled: !0 }),
      "Paid"
    ] })
  ] })
] }), Ra = ({ onClick: e }) => /* @__PURE__ */ u.jsxs(
  fe,
  {
    className: "w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground",
    type: "button",
    variant: "outline",
    onClick: e,
    children: [
      /* @__PURE__ */ u.jsx(is, { className: "size-4" }),
      "Delete step"
    ]
  }
), Wn = (e) => {
  const t = Number(e);
  return !oy.test(e) || !Number.isInteger(t) || t < 1 || t > tn ? null : t;
}, Cy = ({ action: e, onUpdate: t, onDelete: n }) => {
  if (e.data.wait_hours % 24 !== 0)
    throw new Error(`WaitSidebarBody: wait_hours must be a multiple of 24, received ${e.data.wait_hours}`);
  const o = e.data.wait_hours / 24, [r, s] = te(String(o)), i = Number(r), a = Wn(r) !== null, l = (d) => {
    const h = d * 24;
    h !== e.data.wait_hours && t(h);
  }, c = (d) => {
    const h = Wn(r);
    if (h === null)
      return;
    const g = Math.min(tn, Math.max(1, h + d));
    s(String(g)), l(g);
  }, f = (d) => {
    const h = d.target.value;
    s(h);
    const g = Wn(h);
    g !== null && l(g);
  };
  return /* @__PURE__ */ u.jsxs("div", { className: "flex flex-1 flex-col gap-5", children: [
    /* @__PURE__ */ u.jsxs(Ao, { htmlFor: "automation-wait-days", label: "Wait for", children: [
      /* @__PURE__ */ u.jsxs(
        Gu,
        {
          "aria-label": "Wait duration in days",
          className: "h-(--control-height)",
          "data-disabled": a ? void 0 : "true",
          children: [
            /* @__PURE__ */ u.jsx(
              ed,
              {
                "aria-describedby": a ? void 0 : "automation-wait-days-error",
                "aria-invalid": !a,
                className: "w-10 min-w-10 flex-none pr-1 font-mono tabular-nums",
                id: "automation-wait-days",
                inputMode: "numeric",
                value: r,
                onChange: f
              }
            ),
            /* @__PURE__ */ u.jsx(Ju, { className: "mr-auto", children: i === 1 ? "day" : "days" }),
            /* @__PURE__ */ u.jsxs(Ku, { align: "inline-end", className: "gap-0.5 pr-2", children: [
              /* @__PURE__ */ u.jsx(
                Jo,
                {
                  "aria-label": "Decrease wait by one day",
                  disabled: !a || i <= 1,
                  size: "icon-xs",
                  title: "Decrease wait by one day",
                  onClick: () => c(-1),
                  children: /* @__PURE__ */ u.jsx(ss, { className: "size-4" })
                }
              ),
              /* @__PURE__ */ u.jsx(
                Jo,
                {
                  "aria-label": "Increase wait by one day",
                  disabled: !a || i >= tn,
                  size: "icon-xs",
                  title: "Increase wait by one day",
                  onClick: () => c(1),
                  children: /* @__PURE__ */ u.jsx(yt, { className: "size-4" })
                }
              )
            ] })
          ]
        }
      ),
      !a && /* @__PURE__ */ u.jsxs(Uu, { className: "text-xs", id: "automation-wait-days-error", children: [
        "Enter a whole number between 1 and ",
        gt(tn),
        " days."
      ] })
    ] }),
    /* @__PURE__ */ u.jsx("div", { className: "mt-auto pt-6", children: /* @__PURE__ */ u.jsx(Ra, { onClick: n }) })
  ] });
}, My = ({ action: e, onUpdateSubject: t, onEditEmail: n, onDelete: o }) => /* @__PURE__ */ u.jsxs("div", { className: "flex flex-1 flex-col gap-5", children: [
  /* @__PURE__ */ u.jsx(Ao, { htmlFor: "automation-email-subject", label: "Subject line", children: /* @__PURE__ */ u.jsx(
    mn,
    {
      id: "automation-email-subject",
      placeholder: "Subject line",
      value: e.data.email_subject,
      onChange: (r) => t(r.target.value)
    }
  ) }),
  /* @__PURE__ */ u.jsxs(
    fe,
    {
      className: "w-full",
      type: "button",
      variant: "outline",
      onClick: n,
      children: [
        /* @__PURE__ */ u.jsx(bs, { className: "size-4" }),
        "Edit email"
      ]
    }
  ),
  /* @__PURE__ */ u.jsx("div", { className: "mt-auto pt-6", children: /* @__PURE__ */ u.jsx(Ra, { onClick: o }) })
] }), jy = ({ detail: e }) => {
  switch (e.type) {
    case "trigger":
      return /* @__PURE__ */ u.jsx(Sy, { memberTiers: e.memberTiers });
    case "wait":
      return /* @__PURE__ */ u.jsx(Cy, { action: e.action, onDelete: e.onDelete, onUpdate: e.onUpdate }, e.action.id);
    case "send_email":
      return /* @__PURE__ */ u.jsx(My, { action: e.action, onDelete: e.onDelete, onEditEmail: e.onEditEmail, onUpdateSubject: e.onUpdateSubject }, e.action.id);
    default: {
      const t = e;
      throw new Error(`Unknown sidebar type: ${t}`);
    }
  }
}, ky = ({ detail: e }) => {
  const t = e.icon;
  return /* @__PURE__ */ u.jsxs("div", { className: "flex min-h-full flex-col gap-6", children: [
    /* @__PURE__ */ u.jsx("div", { className: "flex items-start gap-4", children: /* @__PURE__ */ u.jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
      /* @__PURE__ */ u.jsx("div", { className: "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-text-secondary", children: /* @__PURE__ */ u.jsx(t, { className: "size-4" }) }),
      /* @__PURE__ */ u.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ u.jsx("span", { className: "block text-xs text-text-secondary", children: e.label }),
        /* @__PURE__ */ u.jsx("h2", { className: "truncate text-base leading-tight font-medium text-foreground", children: e.title })
      ] })
    ] }) }),
    /* @__PURE__ */ u.jsx(jy, { detail: e })
  ] });
}, Iy = ({ detail: e, isEmailModalOpen: t, onClose: n }) => (J(() => {
  if (!e)
    return;
  const o = (r) => {
    if (r.key === "Escape") {
      if (t)
        return;
      n();
    }
  };
  return document.addEventListener("keydown", o), () => {
    document.removeEventListener("keydown", o);
  };
}, [e, t, n]), /* @__PURE__ */ u.jsx(
  "aside",
  {
    "aria-hidden": !e,
    "aria-label": "Step details",
    className: oe(
      "absolute inset-y-0 right-0 z-[1] flex w-[calc(100%-6rem)] max-w-none translate-x-full flex-col gap-6 overflow-y-auto bg-background p-6 shadow-sm transition-transform duration-200 ease-out sm:w-[36rem] dark:border-l dark:border-gray-950",
      e ? "translate-x-0" : "pointer-events-none"
    ),
    "data-state": e ? "open" : "closed",
    "data-testid": "automation-step-sidebar",
    children: e && /* @__PURE__ */ u.jsx(ky, { detail: e })
  }
)), Py = {
  wait: vl,
  send_email: wl
}, Ay = ({ automation: e, isLoading: t, isError: n, onChange: o }) => {
  const [r, s] = te(null), [i, a] = te("edit"), [l, c] = te(null), [f, d] = te(null), h = f?.id ?? null, g = ne((C, D) => {
    if (!e || e.actions.length >= Yn)
      return;
    const z = fy(D), b = Py[C], j = b({ detail: e, anchor: z }), N = j.actions.find((M) => !e.actions.some((I) => I.id === M.id));
    s(N?.id ?? null), N && d({ id: N.id }), o(j);
  }, [e, o]);
  J(() => {
    if (!r)
      return;
    const C = window.setTimeout(() => {
      s(null);
    }, cy);
    return () => window.clearTimeout(C);
  }, [r]);
  const p = ne((C) => {
    if (!e)
      return;
    const D = xl({ detail: e, actionId: C });
    c((z) => z === C ? null : z), d(null), o(D);
  }, [e, o]), v = ne((C, D) => {
    e && o(yl({ detail: e, actionId: C, waitHours: D }));
  }, [e, o]), x = ne((C, D) => {
    if (!e)
      return;
    const z = e.actions.find((b) => b.id === C && b.type === "send_email");
    z && o(Yo({ detail: e, actionId: C, emailSubject: D, emailLexical: z.data.email_lexical }));
  }, [e, o]), y = ne((C, D = "edit") => {
    a(D), c(C);
  }, []), _ = ne((C, D = "edit") => {
    d(null), a(D), c(C);
  }, []), m = ne((C) => {
    _(C, "preview");
  }, [_]), w = l && e ? e.actions.find((C) => C.id === l && C.type === "send_email") : void 0, S = U(by(window.innerWidth)), E = he(() => e ? vy({
    automation: e,
    disabled: e.actions.length >= Yn,
    onDelete: p,
    onEditEmailBody: _,
    onPick: g,
    onPreviewEmail: m,
    onSelectStep: (C) => d({ id: C }),
    newStepId: r,
    selectedStepId: h
  }) : null, [e, _, m, p, g, r, h]), k = e ? Ey({
    automation: e,
    onDelete: p,
    onUpdateWait: v,
    onUpdateSubject: x,
    onEditEmail: y,
    stepId: h
  }) : null, P = ne(() => {
    d(null);
  }, []), A = () => {
    c(null), a("edit");
  }, O = ne((C, D) => {
    if (C.stopPropagation(), !e || D.id === Be || D.id === Me)
      return;
    const z = e.actions.find((b) => b.id === D.id);
    z?.type === "send_email" && y(z.id);
  }, [e, y]);
  return t ? /* @__PURE__ */ u.jsx("div", { className: "flex flex-1 items-center justify-center bg-surface-page", "data-testid": "automation-canvas-loading", children: /* @__PURE__ */ u.jsx(He, { size: "lg" }) }) : n || !e || !E ? /* @__PURE__ */ u.jsx("div", { className: "flex flex-1 items-start justify-center bg-surface-page px-4 py-8", children: /* @__PURE__ */ u.jsx(_s, { className: "max-w-md", role: "alert", variant: "destructive", children: /* @__PURE__ */ u.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ u.jsx(il, { className: "mt-0.5 size-5 text-red" }),
    /* @__PURE__ */ u.jsxs("div", { children: [
      /* @__PURE__ */ u.jsx("strong", { className: "block", children: "Couldn't load automation" }),
      /* @__PURE__ */ u.jsx("p", { className: "text-sm text-muted-foreground", children: "Try refreshing the page." })
    ] })
  ] }) }) }) : /* @__PURE__ */ u.jsxs("div", { className: "relative flex-1 overflow-hidden bg-surface-page", "data-testid": "automation-canvas", children: [
    /* @__PURE__ */ u.jsxs(
      ox,
      {
        className: "[--xy-background-color:var(--color-grey-50)] [--xy-background-pattern-color:var(--color-grey-500)] [--xy-edge-stroke:var(--color-grey-300)] dark:[--xy-background-color:var(--color-black)] dark:[--xy-background-pattern-color:var(--color-grey-900)] dark:[--xy-edge-stroke:var(--color-grey-800)]",
        defaultViewport: S.current,
        edges: E.edges,
        edgesFocusable: !1,
        edgeTypes: my,
        nodes: E.nodes,
        nodesConnectable: !1,
        nodesDraggable: !1,
        nodesFocusable: !1,
        nodeTypes: gy,
        proOptions: { hideAttribution: !0 },
        zoomOnDoubleClick: !1,
        zoomOnScroll: !1,
        panOnScroll: !0,
        onNodeClick: (C, D) => {
          C.button === 0 && D.id !== Be && d({ id: D.id });
        },
        onNodeDoubleClick: O,
        onPaneClick: P,
        children: [
          /* @__PURE__ */ u.jsx(fx, { variant: ke.Dots }),
          /* @__PURE__ */ u.jsx(xy, {})
        ]
      }
    ),
    /* @__PURE__ */ u.jsx(Iy, { detail: k, isEmailModalOpen: !!w, onClose: P }),
    w && e && /* @__PURE__ */ u.jsx(
      ny,
      {
        initialLexical: w.data.email_lexical,
        initialMode: i,
        initialSubject: w.data.email_subject,
        onClose: A,
        onSave: ({ subject: C, lexical: D }) => {
          o(Yo({ detail: e, actionId: w.id, emailSubject: C, emailLexical: D })), A();
        }
      }
    )
  ] });
}, Dy = ({
  automation: e,
  isLoadingAutomation: t,
  isSaveButtonEnabled: n,
  isPublishButtonEnabled: o,
  saveButtonVariant: r,
  publishButtonVariant: s,
  isTurnOffButtonEnabled: i,
  saveButtonChildren: a,
  publishButtonChildren: l,
  onSave: c,
  onPublish: f,
  onTurnOff: d
}) => {
  const h = e?.name, g = e?.status;
  return /* @__PURE__ */ u.jsxs("header", { className: "relative z-10 flex h-14 shrink-0 items-center justify-between bg-background px-4 shadow-sm dark:border-b dark:border-gray-950", children: [
    /* @__PURE__ */ u.jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
      /* @__PURE__ */ u.jsx(fe, { variant: "ghost", asChild: !0, children: /* @__PURE__ */ u.jsx(Uc, { "aria-label": "Back to automations", to: "/automations", children: /* @__PURE__ */ u.jsx(tl, { strokeWidth: 2 }) }) }),
      t ? /* @__PURE__ */ u.jsx(Ql, { className: "h-5 w-40" }) : /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
        /* @__PURE__ */ u.jsx("span", { className: "truncate text-lg font-semibold", children: h }),
        g && /* @__PURE__ */ u.jsx(bl, { status: g })
      ] })
    ] }),
    /* @__PURE__ */ u.jsxs("div", { className: "flex shrink-0 items-center gap-3", children: [
      g === "active" && /* @__PURE__ */ u.jsxs(ys, { children: [
        /* @__PURE__ */ u.jsx(ws, { asChild: !0, children: /* @__PURE__ */ u.jsx(fe, { "aria-label": "Automation options", variant: "ghost", children: /* @__PURE__ */ u.jsx(tu, {}) }) }),
        /* @__PURE__ */ u.jsx(vs, { align: "end", className: "min-w-40", children: /* @__PURE__ */ u.jsxs(Zn, { disabled: !i, onSelect: d, children: [
          /* @__PURE__ */ u.jsx(Jc, { className: "size-4" }),
          "Turn off"
        ] }) })
      ] }),
      g === "inactive" && /* @__PURE__ */ u.jsx(
        fe,
        {
          disabled: !n,
          variant: r,
          onClick: c,
          children: a
        }
      ),
      /* @__PURE__ */ u.jsx(
        fe,
        {
          disabled: !o,
          variant: s,
          onClick: f,
          children: l
        }
      )
    ] })
  ] });
};
var es = Object.prototype.hasOwnProperty;
function ts(e, t, n) {
  for (n of e.keys())
    if (xt(n, t)) return n;
}
function xt(e, t) {
  var n, o, r;
  if (e === t) return !0;
  if (e && t && (n = e.constructor) === t.constructor) {
    if (n === Date) return e.getTime() === t.getTime();
    if (n === RegExp) return e.toString() === t.toString();
    if (n === Array) {
      if ((o = e.length) === t.length)
        for (; o-- && xt(e[o], t[o]); ) ;
      return o === -1;
    }
    if (n === Set) {
      if (e.size !== t.size)
        return !1;
      for (o of e)
        if (r = o, r && typeof r == "object" && (r = ts(t, r), !r) || !t.has(r)) return !1;
      return !0;
    }
    if (n === Map) {
      if (e.size !== t.size)
        return !1;
      for (o of e)
        if (r = o[0], r && typeof r == "object" && (r = ts(t, r), !r) || !xt(o[1], t.get(r)))
          return !1;
      return !0;
    }
    if (n === ArrayBuffer)
      e = new Uint8Array(e), t = new Uint8Array(t);
    else if (n === DataView) {
      if ((o = e.byteLength) === t.byteLength)
        for (; o-- && e.getInt8(o) === t.getInt8(o); ) ;
      return o === -1;
    }
    if (ArrayBuffer.isView(e)) {
      if ((o = e.byteLength) === t.byteLength)
        for (; o-- && e[o] === t[o]; ) ;
      return o === -1;
    }
    if (!n || typeof e == "object") {
      o = 0;
      for (n in e)
        if (es.call(e, n) && ++o && !es.call(t, n) || !(n in t) || !xt(e[n], t[n])) return !1;
      return Object.keys(t).length === o;
    }
  }
  return e !== e && t !== t;
}
const ns = (e) => ({
  status: e.status,
  actions: e.actions,
  edges: e.edges
}), Ty = (e) => {
  switch (e) {
    case "failed to publish":
    case "failed to re-publish":
    case "failed to save":
    case "failed to unpublish":
      return !0;
    case "confirming re-publish":
    case "confirming unpublish":
    case "idle":
    case "publishing":
    case "re-publishing":
    case "saving":
    case "unpublishing":
      return !1;
    default: {
      const t = e;
      throw new Error(`Unhandled edit state: ${t}`);
    }
  }
}, i0 = () => {
  const { id: e = "" } = Gc(), { data: t, isLoading: n, isError: o } = _l(e, {
    defaultErrorHandler: !1
  }), r = t?.automations[0], s = El(), [i, a] = _e.useState("idle"), [l, c] = _e.useState(void 0);
  _e.useEffect(() => {
    r && c((N) => N?.id === r.id ? N : r);
  }, [r]);
  const f = !!l && !!r && !xt(ns(l), ns(r)), d = (N) => {
    c(N), a((M) => Ty(M) ? "idle" : M);
  }, h = (N) => {
    if (!l)
      throw new Error("Cannot edit an automation that has not loaded.");
    let M, I;
    const T = l.status, $ = N ?? T, L = `${T} -> ${$}`;
    switch (L) {
      case "active -> active":
        M = "re-publishing", I = "failed to re-publish";
        break;
      case "inactive -> inactive":
        M = "saving", I = "failed to save";
        break;
      case "inactive -> active":
        M = "publishing", I = "failed to publish";
        break;
      case "active -> inactive":
        M = "unpublishing", I = "failed to unpublish";
        break;
      default: {
        const R = L;
        throw new Error(`Unhandled status transition: ${R}`);
      }
    }
    a(M), s.mutate(
      {
        id: l.id,
        status: $,
        actions: l.actions,
        edges: l.edges
      },
      {
        onSuccess: (R) => {
          c(R.automations[0]), a("idle");
        },
        onError: () => a(I)
      }
    );
  };
  let g = !1, p = !1, v = !1, x = !!l && l.actions.length > 0 && l.status === "inactive" && f, y = "secondary", _ = "Save", m = !!l && l.actions.length > 0 && (l.status === "inactive" || f), w = "default", S = l?.status === "active" ? f ? "Publish changes" : "Published" : "Publish", E = !0, k = "Turn off", P = !0, A = "default", O = "Publish changes";
  switch (i) {
    case "idle":
      break;
    case "saving":
      v = !0, x = !1, m = !1, E = !1, _ = /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
        /* @__PURE__ */ u.jsx(He, { size: "sm" }),
        /* @__PURE__ */ u.jsx("span", { className: "sr-only", children: "Saving..." })
      ] });
      break;
    case "publishing":
      v = !0, x = !1, m = !1, E = !1, S = /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
        /* @__PURE__ */ u.jsx(He, { color: "light", size: "sm" }),
        /* @__PURE__ */ u.jsx("span", { className: "sr-only", children: "Publishing..." })
      ] });
      break;
    case "re-publishing":
      v = !0, p = !0, m = !1, E = !1, P = !1, O = /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
        /* @__PURE__ */ u.jsx(He, { color: "light", size: "sm" }),
        /* @__PURE__ */ u.jsx("span", { className: "sr-only", children: "Publishing..." })
      ] });
      break;
    case "unpublishing":
      v = !0, g = !0, x = !1, m = !1, E = !1, k = /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
        /* @__PURE__ */ u.jsx(He, { color: "light", size: "sm" }),
        /* @__PURE__ */ u.jsx("span", { className: "sr-only", children: "Turning off..." })
      ] });
      break;
    case "confirming unpublish":
      g = !0, x = !1, m = !1, E = !1;
      break;
    case "confirming re-publish":
      p = !0, m = !1, E = !1;
      break;
    case "failed to save":
      y = "destructive", _ = "Retry";
      break;
    case "failed to publish":
      w = "destructive", S = "Retry";
      break;
    case "failed to re-publish":
      p = !0, m = !1, E = !1, A = "destructive", O = "Retry";
      break;
    case "failed to unpublish":
      g = !0, E = !0, k = "Retry";
      break;
    default: {
      const N = i;
      throw new Error(`Unhandled edit state: ${N}`);
    }
  }
  const C = (N) => {
    a((M) => {
      switch (M) {
        case "confirming unpublish":
        case "failed to unpublish":
          return N ? M : "idle";
        case "idle":
          return N ? "confirming unpublish" : M;
        default:
          return M;
      }
    });
  }, D = (N) => {
    a((M) => {
      switch (M) {
        case "confirming re-publish":
        case "failed to re-publish":
          return N ? M : "idle";
        case "idle":
          return N ? "confirming re-publish" : M;
        default:
          return M;
      }
    });
  }, z = () => {
    const N = l?.status;
    switch (N) {
      case void 0:
        throw new Error("Cannot publish an automation that has not loaded.");
      case "active":
        a("confirming re-publish");
        break;
      case "inactive":
        h("active");
        break;
      default: {
        const M = N;
        throw new Error(`Unhandled status: ${M}`);
      }
    }
  };
  nu(v || f);
  const b = qc(({ currentLocation: N, nextLocation: M }) => f && N.pathname !== M.pathname), j = (N) => {
    !N && b.state === "blocked" && b.reset();
  };
  return /* @__PURE__ */ u.jsxs("div", { className: "fixed inset-0 z-50 flex flex-col bg-background", "data-testid": "automation-editor", children: [
    /* @__PURE__ */ u.jsx(
      Dy,
      {
        automation: l,
        isLoadingAutomation: n,
        isPublishButtonEnabled: m,
        isSaveButtonEnabled: x,
        isTurnOffButtonEnabled: E,
        publishButtonChildren: S,
        publishButtonVariant: w,
        saveButtonChildren: _,
        saveButtonVariant: y,
        onPublish: z,
        onSave: () => h(),
        onTurnOff: () => a("confirming unpublish")
      }
    ),
    /* @__PURE__ */ u.jsx(
      Ay,
      {
        automation: l,
        isError: o,
        isLoading: n,
        onChange: d
      }
    ),
    /* @__PURE__ */ u.jsx(
      Ft,
      {
        open: b.state === "blocked",
        onOpenChange: j,
        children: /* @__PURE__ */ u.jsxs(Wt, { children: [
          /* @__PURE__ */ u.jsxs(Yt, { children: [
            /* @__PURE__ */ u.jsx(Xt, { children: "Discard unsaved changes?" }),
            /* @__PURE__ */ u.jsx(Zt, { children: "Your changes will be lost if you leave this automation." })
          ] }),
          /* @__PURE__ */ u.jsxs(Ut, { children: [
            /* @__PURE__ */ u.jsx(Gt, { children: "Keep working" }),
            /* @__PURE__ */ u.jsx(
              fe,
              {
                variant: "destructive",
                onClick: () => b.proceed?.(),
                children: "Discard changes"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ u.jsx(
      Ft,
      {
        open: g,
        onOpenChange: C,
        children: /* @__PURE__ */ u.jsxs(Wt, { children: [
          /* @__PURE__ */ u.jsxs(Yt, { children: [
            /* @__PURE__ */ u.jsx(Xt, { children: "Turn off this automation?" }),
            /* @__PURE__ */ u.jsx(Zt, { children: "It will stop running until you turn it back on." })
          ] }),
          /* @__PURE__ */ u.jsxs(Ut, { children: [
            /* @__PURE__ */ u.jsx(Gt, { disabled: v, children: "Cancel" }),
            /* @__PURE__ */ u.jsx(
              fe,
              {
                disabled: v,
                variant: i === "failed to unpublish" ? "destructive" : "default",
                onClick: () => h("inactive"),
                children: k
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ u.jsx(
      Ft,
      {
        open: p,
        onOpenChange: D,
        children: /* @__PURE__ */ u.jsxs(Wt, { children: [
          /* @__PURE__ */ u.jsxs(Yt, { children: [
            /* @__PURE__ */ u.jsx(Xt, { children: "Update automation?" }),
            /* @__PURE__ */ u.jsx(Zt, { children: "This will update the automation for new runs of the automation, as well as any actively-running ones." })
          ] }),
          /* @__PURE__ */ u.jsxs(Ut, { children: [
            /* @__PURE__ */ u.jsx(Gt, { disabled: v, children: "Cancel" }),
            /* @__PURE__ */ u.jsx(
              fe,
              {
                disabled: !P,
                variant: A,
                onClick: () => h(),
                children: O
              }
            )
          ] })
        ] })
      }
    )
  ] });
};
export {
  i0 as default
};
//# sourceMappingURL=editor-DN_Zz0m2.mjs.map

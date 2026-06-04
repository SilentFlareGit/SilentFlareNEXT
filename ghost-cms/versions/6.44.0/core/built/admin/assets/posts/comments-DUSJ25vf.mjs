import { Q as l, i as we, n as Yd, a1 as ht, ak as ie, a9 as Fe, am as xe, af as be, a6 as ur, w as Ut, u as qt, al as mr, L as ca, ae as Zd, x as Wd, j as rl, y as ua, z as Hd } from "./index-BuIZkUhD.mjs";
import { F as Vd, a as Gd, c as Jd } from "./filters-CJl5ebXd.mjs";
import { b as Rn, T as An, c as Dn, a as Mn, E as nl } from "./tooltip-D1X0uVas.mjs";
import { C as Kd, b as la, g as Qd, F as Xd, d as ep, c as tp, e as ol, D as fa, P as Hi, h as il, M as rp, R as np, E as al, f as Vi } from "./search-Dz7F6ifc.mjs";
import { e as op, D as ip, n as ap, i as sp, k as Xt } from "./skeleton-DrFcKwP3.mjs";
import { U as sl, E as cp, g as up } from "./get-site-timezone-JepxGwVr.mjs";
import { b as yr, c as da, e as Hn } from "./hooks-D4pJ_p_P.mjs";
import { a as lp } from "./posts-CYjfxmgX.mjs";
import { X as fp } from "./x-Cl72IwQm.mjs";
import { B as le, a as dp } from "./button-CQCNdxY6.mjs";
import { C as pp } from "./chevron-up-DaikhWC2.mjs";
import { A as wt } from "./avatar-CeJ0Zq_A.mjs";
import { L as xt } from "./loading-indicator-BsY7eGY6.mjs";
import { C as hp, L as mp } from "./label-TTt0QyDb.mjs";
import { b as pa, c as ha, f as ma, g as ya, d as yp, e as ga } from "./dialog-DRN6olky.mjs";
import { u as gp, a as vp } from "./settings-DJqx19W1.mjs";
import { E as bp } from "./ellipsis-BIs4PL5-.mjs";
import { T as wp, b as xp, c as cc, a as uc } from "./tabs-1fkhM4p8.mjs";
import { b as ir, a as cl, T as ul } from "./app-utils-CD0bhOLs.mjs";
import { H as ll } from "./heart-BMBWsLs2.mjs";
import { E as Gi } from "./empty-indicator-Wiukrx4T.mjs";
import { S as jp } from "./separator-C7QPCSjM.mjs";
import { S as Sp, a as Np, c as Tp, d as Pp } from "./sheet-wg_8-w45.mjs";
import { g as Ep, a as Op, u as Rp, L as Ap } from "./virtual-list-window-DqbQUkIo.mjs";
import { M as fl } from "./main-layout-DejRuxP8.mjs";
import { I as Dp, L as ar, P as gt } from "./list-page-DQIiFvFP.mjs";
function Mp(e) {
  throw new Error('Could not dynamically require "' + e + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
function $r(e) {
  "@babel/helpers - typeof";
  return $r = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, $r(e);
}
const dl = Yd(
  "inline-flex items-center rounded-xs border px-1.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-focus-ring focus:ring-offset-2 focus:outline-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground/70",
        destructive: "border-transparent bg-destructive/20 text-destructive",
        success: "border-transparent bg-green/20 text-green",
        warning: "border-transparent bg-state-warning/20 text-yellow-600",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function lc({ className: e, variant: t, ...r }) {
  return /* @__PURE__ */ l.jsx("div", { className: we(dl({ variant: t }), e), ...r });
}
function Ip({ className: e, children: t }) {
  return ht.Children.count(t) === 0 ? null : /* @__PURE__ */ l.jsx(
    Dp,
    {
      align: "start",
      className: we("w-full", e),
      "data-slot": "filter-bar",
      gap: "sm",
      justify: "between",
      children: t
    }
  );
}
const kp = ["is-less", "is-or-less", "is-greater", "is-or-greater"], Cp = {
  "is-less": "before",
  "is-or-less": "on or before",
  "is-greater": "after",
  "is-or-greater": "on or after"
}, _p = "is-or-less", qr = "in-the-last", pl = "in-the-next", Fp = {
  [qr]: "in the last",
  [pl]: "in the next"
};
function hl(e) {
  return e === qr || e === pl;
}
function Bp(e) {
  return e.operators.some(hl);
}
function Lp(e) {
  return { ...e, operators: [...e.operators, qr] };
}
function $p(e) {
  return Object.assign((r) => ht.createElement(Yp, {
    ...r,
    fallbackDate: e
  }), { displayName: "RelativeDateRenderer" });
}
const qp = 7, Up = /^\d{4}-\d{2}-\d{2}$/, zp = "w-full bg-transparent outline-hidden dark:!bg-transparent", Yp = ({
  field: e,
  values: t,
  onChange: r,
  operator: n,
  fallbackDate: o
}) => {
  const i = hl(n), a = t[0], s = typeof a == "number" && Number.isSafeInteger(a) && a > 0 ? a : qp, c = typeof a == "string" && Up.test(a) ? a : o, u = ie(null);
  Fe(() => {
    if (u.current === n)
      return;
    u.current = n;
    const p = i ? [s] : [c];
    Hp(t, p) || r(p);
  }, [n, i, s, c, t, r]);
  const [f, d] = xe(() => String(s));
  if (Fe(() => {
    d(String(s));
  }, [s]), i) {
    const p = n === qr ? "Since" : "Until", h = Zp(o, n === qr ? -s : s);
    return /* @__PURE__ */ l.jsx(Rn, { children: /* @__PURE__ */ l.jsxs(An, { children: [
      /* @__PURE__ */ l.jsx(Dn, { asChild: !0, children: /* @__PURE__ */ l.jsxs("div", { className: "flex w-full items-center gap-2", "data-slot": "filters-input-wrapper", children: [
        /* @__PURE__ */ l.jsx(
          "input",
          {
            "aria-label": "Relative date amount",
            className: we(zp, "min-w-[1ch] tabular-nums [field-sizing:content] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"),
            "data-slot": "filters-input",
            min: 1,
            type: "number",
            value: f,
            onBlur: () => {
              const y = Number(f);
              (!Number.isSafeInteger(y) || y <= 0) && d(String(s));
            },
            onChange: (y) => {
              const m = y.target.value;
              d(m);
              const v = Number(m);
              Number.isSafeInteger(v) && v > 0 && r([v]);
            }
          }
        ),
        /* @__PURE__ */ l.jsx("span", { className: "shrink-0 text-muted-foreground select-none", children: s === 1 ? "day" : "days" })
      ] }) }),
      /* @__PURE__ */ l.jsxs(Mn, { children: [
        p,
        " ",
        h
      ] })
    ] }) });
  }
  return /* @__PURE__ */ l.jsx(
    Vd,
    {
      className: e.className,
      embedded: !0,
      field: e,
      value: c,
      onChange: (p) => r([p])
    }
  );
};
function Zp(e, t) {
  const [r, n, o] = e.split("-").map(Number), i = new Date(r, n - 1, o);
  return i.setDate(i.getDate() + t), new Intl.DateTimeFormat(Wp(), {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(i);
}
function Wp() {
  return typeof navigator > "u" ? "en-US" : navigator.language || "en-US";
}
function Hp(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let r = 0; r < e.length; r += 1)
    if (e[r] !== t[r])
      return !1;
  return !0;
}
function Ee(e, t, r, n, o) {
  return at(t, ((i, a) => {
    const s = i[a];
    if (s === void 0)
      throw new TypeError(ps(a));
    return s;
  })(e, t), r, n, o);
}
function at(e, t, r, n, o, i) {
  const a = zr(t, r, n);
  if (o && t !== a)
    throw new RangeError(Df(e, t, r, n, i));
  return a;
}
function Ne(e) {
  return e !== null && /object|function/.test(typeof e);
}
function Ie(e, t = Map) {
  const r = new t();
  return (n, ...o) => {
    if (r.has(n))
      return r.get(n);
    const i = e(n, ...o);
    return r.set(n, i), i;
  };
}
function Ur(e) {
  return lr({
    name: e
  }, 1);
}
function lr(e, t) {
  return st(((r) => ({
    value: r,
    configurable: 1,
    writable: !t
  })), e);
}
function Vp(e) {
  return st(((t) => ({
    get: t,
    configurable: 1
  })), e);
}
function va(e) {
  return {
    [Symbol.toStringTag]: {
      value: e,
      configurable: 1
    }
  };
}
function gr(e, t) {
  const r = {};
  let n = e.length;
  for (const o of t)
    r[e[--n]] = o;
  return r;
}
function st(e, t, r) {
  const n = {};
  for (const o in t)
    n[o] = e(t[o], o, r);
  return n;
}
function Vn(e, t, r) {
  const n = {};
  for (let o = 0; o < t.length; o++) {
    const i = t[o];
    n[i] = e(i, o, r);
  }
  return n;
}
function ml(e, t, r) {
  const n = {};
  for (let o = 0; o < e.length; o++)
    n[t[o]] = r[e[o]];
  return n;
}
function $e(e, t) {
  const r = /* @__PURE__ */ Object.create(null);
  for (const n of e)
    r[n] = t[n];
  return r;
}
function fc(e, t) {
  for (const r of t)
    if (r in e)
      return 1;
  return 0;
}
function yl(e, t, r) {
  for (const n of e)
    if (t[n] !== r[n])
      return 0;
  return 1;
}
function gl(e, t, r) {
  const n = {
    ...r
  };
  for (let o = 0; o < t; o++)
    n[e[o]] = 0;
  return n;
}
function Q(e, ...t) {
  return (...r) => e(...t, ...r);
}
function Gp() {
}
function dc(e) {
  return e[0].toUpperCase() + e.substring(1);
}
function Jr(e) {
  return e.slice().sort();
}
function In(e, t) {
  return String(t).padStart(e, "0");
}
function jt(e, t) {
  return Math.sign(e - t);
}
function zr(e, t, r) {
  return Math.min(Math.max(e, t), r);
}
function nt(e, t) {
  return [Math.floor(e / t), Br(e, t)];
}
function Br(e, t) {
  return (e % t + t) % t;
}
function Tt(e, t) {
  return [Gn(e, t), ba(e, t)];
}
function Gn(e, t) {
  return Math.trunc(e / t) || 0;
}
function ba(e, t) {
  return e % t || 0;
}
function xn(e) {
  return Math.abs(e % 1) === 0.5;
}
function vl(e, t, r) {
  let n = 0, o = 0;
  for (let s = 0; s <= t; s++) {
    const c = e[r[s]], u = Ke[s], f = ae / u, [d, p] = Tt(c, f);
    n += p * u, o += d;
  }
  const [i, a] = Tt(n, ae);
  return [o + i, a];
}
function Jn(e, t, r) {
  const n = {};
  for (let o = t; o >= 0; o--) {
    const i = Ke[o];
    n[r[o]] = Gn(e, i), e = ba(e, i);
  }
  return n;
}
function Jp(e) {
  if (e !== void 0)
    return ye(e);
}
function Kp(e) {
  if (e !== void 0)
    return rt(e);
}
function bl(e) {
  if (e !== void 0)
    return wa(e);
}
function rt(e) {
  return jl(wa(e));
}
function wa(e) {
  return xl(Uy(e));
}
function wl(e, t) {
  if (t == null)
    throw new RangeError(ps(e));
  return t;
}
function Kr(e) {
  if (!Ne(e))
    throw new TypeError(py);
  return e;
}
function xa(e, t, r = e) {
  if (typeof t !== e)
    throw new TypeError(Ct(r, t));
  return t;
}
function xl(e, t = "number") {
  if (!Number.isInteger(e))
    throw new RangeError(sy(t, e));
  return e || 0;
}
function jl(e, t = "number") {
  if (e <= 0)
    throw new RangeError(cy(t, e));
  return e;
}
function ja(e) {
  if (typeof e == "symbol")
    throw new TypeError(dy);
  return String(e);
}
function kn(e, t) {
  return Ne(e) ? String(e) : ye(e, t);
}
function Sa(e) {
  if (typeof e == "string")
    return BigInt(e);
  if (typeof e != "bigint")
    throw new TypeError(fy(e));
  return e;
}
function Sl(e, t = "number") {
  if (typeof e == "bigint")
    throw new TypeError(ly(t));
  if (e = Number(e), !Number.isFinite(e))
    throw new RangeError(uy(t, e));
  return e;
}
function je(e, t) {
  return Math.trunc(Sl(e, t)) || 0;
}
function Na(e, t) {
  return xl(Sl(e, t), t);
}
function pc(e, t) {
  return jl(je(e, t), t);
}
function Ta(e, t) {
  let [r, n] = Tt(t, ae), o = e + r;
  const i = Math.sign(o);
  return i && i === -Math.sign(n) && (o -= i, n += i * ae), [o, n];
}
function fr(e, t, r = 1) {
  return Ta(e[0] + t[0] * r, e[1] + t[1] * r);
}
function zt(e, t) {
  return Ta(e[0], e[1] + t);
}
function Ge(e, t) {
  return fr(t, e, -1);
}
function ke(e, t) {
  return jt(e[0], t[0]) || jt(e[1], t[1]);
}
function Nl(e, t, r) {
  return ke(e, t) === -1 || ke(e, r) === 1;
}
function Pa(e, t = 1) {
  const r = BigInt(ae / t);
  return [Number(e / r), Number(e % r) * t];
}
function Cn(e, t = 1) {
  const r = ae / t, [n, o] = Tt(e, r);
  return [n, o * t];
}
function Qp(e, t = 1) {
  const [r, n] = e, o = Math.floor(n / t), i = ae / t;
  return BigInt(r) * BigInt(i) + BigInt(o);
}
function Je(e, t = 1, r) {
  const [n, o] = e, [i, a] = Tt(o, t);
  return n * (ae / t) + (i + (r ? a / t : 0));
}
function Xp(e) {
  return e[0] + e[1] / ae;
}
function Ea(e, t, r = nt) {
  const [n, o] = e, [i, a] = r(o, t);
  return [n * (ae / t) + i, a];
}
function Oa(e) {
  return Ee(e, "isoYear", Gr, Vr, 1), e.isoYear === Gr ? Ee(e, "isoMonth", 4, 12, 1) : e.isoYear === Vr && Ee(e, "isoMonth", 1, 9, 1), e;
}
function Le(e) {
  return De({
    ...e,
    ...Me,
    isoHour: 12
  }), e;
}
function De(e) {
  const t = Ee(e, "isoYear", Gr, Vr, 1), r = t === Gr ? 1 : t === Vr ? -1 : 0;
  return r && Qe(pe({
    ...e,
    isoDay: e.isoDay + r,
    isoNanosecond: e.isoNanosecond - r
  })), e;
}
function Qe(e) {
  if (!e || Nl(e, Gy, Vy))
    throw new RangeError(_t);
  return e;
}
function Pt(e) {
  return vl(e, 5, ze)[1];
}
function Kn(e) {
  const [t, r] = nt(e, ae);
  return [Jn(r, 5, ze), t];
}
function eh(e) {
  return Tl(e)[0];
}
function Tl(e) {
  return Ea(e, Ve);
}
function Se(e) {
  return vr(e.isoYear, e.isoMonth, e.isoDay, e.isoHour, e.isoMinute, e.isoSecond, e.isoMillisecond);
}
function pe(e) {
  const t = Se(e);
  if (t !== void 0) {
    const [r, n] = Tt(t, Ae);
    return [r, n * lt + (e.isoMicrosecond || 0) * on + (e.isoNanosecond || 0)];
  }
}
function Ra(e, t) {
  const [r, n] = Kn(Pt(e) - t);
  return Qe(pe({
    ...e,
    isoDay: e.isoDay + n,
    ...r
  }));
}
function _n(...e) {
  return vr(...e) / $f;
}
function vr(...e) {
  const [t, r] = Pl(...e), n = t.valueOf();
  if (!isNaN(n))
    return n - r * Ae;
}
function Pl(e, t = 1, r = 1, n = 0, o = 0, i = 0, a = 0) {
  const s = e === Gr ? 1 : e === Vr ? -1 : 0, c = /* @__PURE__ */ new Date();
  return c.setUTCHours(n, o, i, a), c.setUTCFullYear(e, t - 1, r + s), [c, s];
}
function br(e, t) {
  let [r, n] = zt(e, t);
  n < 0 && (n += ae, r -= 1);
  const [o, i] = nt(n, lt), [a, s] = nt(i, on);
  return Qn(r * Ae + o, a, s);
}
function Qn(e, t = 0, r = 0) {
  const n = Math.ceil(Math.max(0, Math.abs(e) - Ps) / Ae) * Math.sign(e), o = new Date(e - n * Ae);
  return gr(jo, [o.getUTCFullYear(), o.getUTCMonth() + 1, o.getUTCDate() + n, o.getUTCHours(), o.getUTCMinutes(), o.getUTCSeconds(), o.getUTCMilliseconds(), t, r]);
}
function Aa(e, t) {
  if (t < -Ps)
    throw new RangeError(_t);
  const r = e.formatToParts(t), n = {};
  for (const o of r)
    n[o.type] = o.value;
  return n;
}
function th(e) {
  return e.isoDay;
}
function Da(e) {
  return [e.isoYear, e.isoMonth, e.isoDay];
}
function El(e, t) {
  return [t, 0];
}
function rh(e, t) {
  if (!t)
    return [it, e];
}
function nh(e, t, r) {
  return {
    isoYear: e,
    isoMonth: t,
    isoDay: r
  };
}
function oh() {
  return 7;
}
function Ol() {
  return vt;
}
function Rl(e, t) {
  switch (t) {
    case 2:
      return Ma(e) ? 29 : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
  }
  return 31;
}
function Al(e) {
  return Ma(e) ? 366 : 365;
}
function Ma(e) {
  return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
}
function Dl(e) {
  const [t, r] = Pl(e.isoYear, e.isoMonth, e.isoDay);
  return Br(t.getUTCDay() - r, 7) || 7;
}
function Ml(e) {
  return this.id === Or ? (({ isoYear: t }) => t < 1 ? ["gregory-inverse", 1 - t] : ["gregory", t])(e) : this.id === Rt ? Qy(e) : [];
}
function ih(e) {
  const t = Se(e);
  if (t < Ky) {
    const { isoYear: i } = e;
    return i < 1 ? ["japanese-inverse", 1 - i] : ["japanese", i];
  }
  const r = Aa(_s(Rt), t), { era: n, eraYear: o } = bf(r, Rt);
  return [n, o];
}
function Xn(e) {
  return Wt(e), wr(e, 1), e;
}
function Wt(e) {
  return Il(e, 1), e;
}
function hc(e) {
  return yl(Ss, e, Il(e));
}
function Il(e, t) {
  const { isoYear: r } = e, n = Ee(e, "isoMonth", 1, Ol(), t);
  return {
    isoYear: r,
    isoMonth: n,
    isoDay: Ee(e, "isoDay", 1, Rl(r, n), t)
  };
}
function wr(e, t) {
  return gr(ze, [Ee(e, "isoHour", 0, 23, t), Ee(e, "isoMinute", 0, 59, t), Ee(e, "isoSecond", 0, 59, t), Ee(e, "isoMillisecond", 0, 999, t), Ee(e, "isoMicrosecond", 0, 999, t), Ee(e, "isoNanosecond", 0, 999, t)]);
}
function ee(e) {
  return e === void 0 ? 0 : ed(Kr(e));
}
function eo(e, t = 0) {
  e = Xe(e);
  const r = td(e), n = ug(e, t);
  return [ed(e), n, r];
}
function xr(e, t, r, n = 9, o = 0, i = 4) {
  t = Xe(t);
  let a = Xf(t, n, o), s = Ca(t), c = cn(t, i);
  const u = sn(t, n, o, 1);
  return a == null ? a = Math.max(r, u) : Fl(a, u), s = _a(s, u, 1), e && (c = ((f) => f < 4 ? (f + 2) % 4 : f)(c)), [a, u, s, c];
}
function to(e, t = 6, r) {
  let n = Ca(e = ro(e, zn));
  const o = cn(e, 7);
  let i = sn(e, t);
  return i = wl(zn, i), n = _a(n, i, void 0, r), [i, n, o];
}
function Ia(e) {
  return Es(Xe(e));
}
function kl(e, t) {
  return ka(Xe(e), t);
}
function ah(e) {
  const t = ro(e, $o), r = At($o, sg, t, 0);
  if (!r)
    throw new RangeError(Ct($o, r));
  return r;
}
function ka(e, t = 4) {
  const r = _l(e);
  return [cn(e, 4), ...Cl(sn(e, t), r)];
}
function Cl(e, t) {
  return e != null ? [Ke[e], e < 4 ? 9 - 3 * e : -1] : [t === void 0 ? 1 : 10 ** (9 - t), t];
}
function Ca(e) {
  const t = e[Lr];
  return t === void 0 ? 1 : je(t, Lr);
}
function _a(e, t, r, n) {
  const o = n ? ae : Ke[t + 1];
  if (o) {
    const i = Ke[t];
    if (o % ((e = at(Lr, e, 1, o / i - (n ? 0 : 1), 1)) * i))
      throw new RangeError(Ct(Lr, e));
  } else
    e = at(Lr, e, 1, r ? 10 ** 9 : 1, 1);
  return e;
}
function _l(e) {
  let t = e[Lo];
  if (t !== void 0) {
    if (typeof t != "number") {
      if (ja(t) === "auto")
        return;
      throw new RangeError(Ct(Lo, t));
    }
    t = at(Lo, Math.floor(t), 0, 9, 1);
  }
  return t;
}
function Xe(e) {
  return e === void 0 ? {} : Kr(e);
}
function ro(e, t) {
  return typeof e == "string" ? {
    [t]: e
  } : Kr(e);
}
function no(e) {
  return {
    overflow: eg[e]
  };
}
function Fa(e, t, r = 9, n = 0, o) {
  let i = t[e];
  if (i === void 0)
    return o ? n : void 0;
  if (i = ja(i), i === "auto")
    return o ? n : null;
  let a = Xi[i];
  if (a === void 0 && (a = Zy[i]), a === void 0)
    throw new RangeError(If(e, i, Xi));
  return at(e, a, n, r, 1, hs), a;
}
function At(e, t, r, n = 0) {
  const o = r[e];
  if (o === void 0)
    return n;
  const i = ja(o), a = t[i];
  if (a === void 0)
    throw new RangeError(If(e, i, t));
  return a;
}
function Fl(e, t) {
  if (t > e)
    throw new RangeError(ky);
}
function ct(e) {
  return {
    branding: Ds,
    epochNanoseconds: e
  };
}
function qe(e, t, r) {
  return {
    branding: Ft,
    calendar: r,
    timeZone: t,
    epochNanoseconds: e
  };
}
function Ue(e, t = e.calendar) {
  return {
    branding: Rr,
    calendar: t,
    ...$e(Wy, e)
  };
}
function ut(e, t = e.calendar) {
  return {
    branding: un,
    calendar: t,
    ...$e(Ns, e)
  };
}
function Yr(e, t = e.calendar) {
  return {
    branding: Os,
    calendar: t,
    ...$e(Ns, e)
  };
}
function Fn(e, t = e.calendar) {
  return {
    branding: Rs,
    calendar: t,
    ...$e(Ns, e)
  };
}
function et(e) {
  return {
    branding: As,
    ...$e(Jf, e)
  };
}
function fe(e) {
  return {
    branding: Ms,
    sign: Dt(e),
    ...$e(ws, e)
  };
}
function Ba(e) {
  return Ea(e.epochNanoseconds, lt)[0];
}
function sh(e) {
  return Qp(e.epochNanoseconds);
}
function Bl(e) {
  return e.epochNanoseconds;
}
function ch(e, t, r, n, o) {
  const i = Yt(n), [a, s] = ((P, T) => {
    const E = T((P = ro(P, ta))[Kf]);
    let R = cg(P);
    return R = wl(ta, R), [R, E];
  })(o, e), c = Math.max(a, i);
  if (!s && Wr(c, s))
    return mc(n, a);
  if (!s)
    throw new RangeError(bo);
  if (!n.sign)
    return 0;
  const [u, f, d] = co(t, r, s), p = Ha(d), h = uo(d), y = Va(d), m = h(f, u, n);
  dr(s) || (De(u), De(m));
  const v = y(f, u, m, a);
  return Wr(a, s) ? mc(v, a) : uh(v, p(m), a, f, u, p, h);
}
function uh(e, t, r, n, o, i, a) {
  const s = Dt(e), [c, u] = La(n, js(r, e), r, s, o, i, a), f = $a(t, c, u);
  return e[te[r]] + f * s;
}
function mc(e, t) {
  return Je(he(e), Ke[t], 1);
}
function La(e, t, r, n, o, i, a) {
  const s = te[r], c = {
    ...t,
    [s]: t[s] + n
  }, u = a(e, o, t), f = a(e, o, c);
  return [i(u), i(f)];
}
function $a(e, t, r) {
  const n = Je(Ge(t, r));
  if (!n)
    throw new RangeError(Pr);
  return Je(Ge(t, e)) / n;
}
function lh(e, t) {
  const [r, n, o] = to(t, 5, 1);
  return ct(io(e.epochNanoseconds, r, n, o, 1));
}
function fh(e, t, r) {
  let { epochNanoseconds: n, timeZone: o, calendar: i } = t;
  const [a, s, c] = to(r);
  if (a === 0 && s === 1)
    return t;
  const u = e(o);
  if (a === 6)
    n = gh(ql, u, t, c);
  else {
    const f = u.N(n);
    n = jr(u, Ll(br(n, f), a, s, c), f, 2, 0, 1);
  }
  return qe(n, o, i);
}
function dh(e, t) {
  return Ue(Ll(e, ...to(t)), e.calendar);
}
function ph(e, t) {
  const [r, n, o] = to(t, 5);
  var i;
  return et((i = o, qa(e, Qr(r, n), i)[0]));
}
function hh(e, t) {
  const r = e(t.timeZone), n = _e(t, r), [o, i] = ql(n), a = Je(Ge(Ot(r, o), Ot(r, i)), xo, 1);
  if (a <= 0)
    throw new RangeError(Pr);
  return a;
}
function mh(e, t) {
  const { timeZone: r, calendar: n } = t;
  return qe(yh(Ul, e(r), t), r, n);
}
function yh(e, t, r) {
  return Ot(t, e(_e(r, t)));
}
function gh(e, t, r, n) {
  const o = _e(r, t), [i, a] = e(o), s = r.epochNanoseconds, c = Ot(t, i), u = Ot(t, a);
  if (Nl(s, c, u))
    throw new RangeError(Pr);
  return zl($a(s, c, u), n) ? u : c;
}
function Ll(e, t, r, n) {
  return $l(e, Qr(t, r), n);
}
function $l(e, t, r) {
  const [n, o] = qa(e, t, r);
  return De({
    ...Ht(e, o),
    ...n
  });
}
function qa(e, t, r) {
  return Kn(Et(Pt(e), t, r));
}
function Bn(e) {
  return Et(e, wo, 7);
}
function Qr(e, t) {
  return Ke[e] * t;
}
function ql(e) {
  const t = Ul(e);
  return [t, Ht(t, 1)];
}
function Ul(e) {
  return Hy(6, e);
}
function vh(e, t, r) {
  const n = Math.min(Yt(e), 6);
  return Sr(ao(he(e, n), t, r), n);
}
function oo(e, t, r, n, o, i, a, s, c, u) {
  if (n === 0 && o === 1)
    return e;
  const f = Wr(n, s) ? dr(s) && n < 6 && r >= 6 ? wh : bh : xh;
  let [d, p, h] = f(e, t, r, n, o, i, a, s, c, u);
  return h && n !== 7 && (d = ((y, m, v, P, T, E, R, C) => {
    const _ = Dt(y);
    for (let M = P + 1; M <= v; M++) {
      if (M === 7 && v !== 7)
        continue;
      const Z = js(M, y);
      Z[te[M]] += _;
      const $ = Je(Ge(R(C(T, E, Z)), m));
      if ($ && Math.sign($) !== _)
        break;
      y = Z;
    }
    return y;
  })(d, p, r, Math.max(6, n), a, s, c, u)), d;
}
function io(e, t, r, n, o) {
  return t === 6 ? [Et(Xp(e), r, n), 0] : ao(e, Qr(t, r), n, o);
}
function ao(e, t, r, n) {
  let [o, i] = e;
  n && i < 0 && (i += ae, o -= 1);
  const [a, s] = nt(Et(i, t, r), ae);
  return Ta(o + a, s);
}
function Et(e, t, r) {
  return zl(e / t, r) * t;
}
function zl(e, t) {
  return dg[t](e);
}
function bh(e, t, r, n, o, i) {
  const a = Dt(e), s = he(e), c = io(s, n, o, i), u = Ge(s, c), f = Math.sign(c[0] - s[0]) === a, d = Sr(c, Math.min(r, 6));
  return [{
    ...e,
    ...d
  }, fr(t, u), f];
}
function wh(e, t, r, n, o, i, a, s, c, u) {
  const f = Dt(e) || 1, d = Je(he(e, 5)), p = Qr(n, o);
  let h = Et(d, p, i);
  const [y, m] = La(a, {
    ...e,
    ...xs
  }, 6, f, s, c, u), v = h - Je(Ge(y, m));
  let P = 0;
  v && Math.sign(v) !== f ? t = zt(y, h) : (P += f, h = Et(v, p, i), t = zt(m, h));
  const T = lo(h);
  return [{
    ...e,
    ...T,
    days: e.days + P
  }, t, !!P];
}
function xh(e, t, r, n, o, i, a, s, c, u) {
  const f = Dt(e), d = te[n], p = js(n, e);
  n === 7 && (e = {
    ...e,
    weeks: e.weeks + Math.trunc(e.days / 7)
  });
  const h = Gn(e[d], o) * o;
  p[d] = h;
  const [y, m] = La(a, p, n, o * f, s, c, u), v = h + $a(t, y, m) * f * o, P = Et(v, o, i), T = Math.sign(P - v) === f;
  return p[d] = P, [p, T ? m : y, T];
}
function Ro(e, t, r, n) {
  const [o, i, a, s] = ((u) => {
    const f = ka(u = Xe(u));
    return [u.timeZone, ...f];
  })(n), c = o !== void 0;
  return ((u, f, d, p, h, y) => {
    d = ao(d, h, p, 1);
    const m = f.N(d);
    return Ua(br(d, m), y) + (u ? Xr(Bn(m)) : "Z");
  })(c, t(c ? e(o) : Kt), r.epochNanoseconds, i, a, s);
}
function Ao(e, t, r) {
  const [n, o, i, a, s, c] = ((u) => {
    u = Xe(u);
    const f = Es(u), d = _l(u), p = fg(u), h = cn(u, 4), y = sn(u, 4);
    return [f, lg(u), p, h, ...Cl(y, d)];
  })(r);
  return ((u, f, d, p, h, y, m, v, P, T) => {
    p = ao(p, P, v, 1);
    const E = u(d).N(p);
    return Ua(br(p, E), T) + Xr(Bn(E), m) + ((R, C) => C !== 1 ? "[" + (C === 2 ? "!" : "") + R + "]" : "")(d, y) + za(f, h);
  })(e, t.calendar, t.timeZone, t.epochNanoseconds, n, o, i, a, s, c);
}
function Do(e, t) {
  const [r, n, o, i] = ((u) => (u = Xe(u), [Es(u), ...ka(u)]))(t);
  return a = e.calendar, s = r, c = i, Ua($l(e, o, n), c) + za(a, s);
  var a, s, c;
}
function Mo(e, t) {
  return r = e.calendar, n = e, o = Ia(t), Ln(n) + za(r, o);
  var r, n, o;
}
function Io(e, t) {
  return Yl(e.calendar, Zl, e, Ia(t));
}
function ko(e, t) {
  return Yl(e.calendar, jh, e, Ia(t));
}
function Co(e, t) {
  const [r, n, o] = kl(t);
  return i = o, Wl(qa(e, n, r)[0], i);
  var i;
}
function jn(e, t) {
  const [r, n, o] = kl(t, 3);
  return n > 1 && Vt(e = {
    ...e,
    ...vh(e, n, r)
  }), ((i, a) => {
    const { sign: s } = i, c = s === -1 ? Te(i) : i, { hours: u, minutes: f } = c, [d, p] = Ea(he(c, 3), Ve, Tt);
    Jl(d);
    const h = Ya(p, a), y = a >= 0 || !s || h;
    return (s < 0 ? "-" : "") + "P" + yc({
      Y: $t(c.years),
      M: $t(c.months),
      W: $t(c.weeks),
      D: $t(c.days)
    }) + (u || f || d || y ? "T" + yc({
      H: $t(u),
      M: $t(f),
      S: $t(d, y) + h
    }) : "");
  })(e, o);
}
function Yl(e, t, r, n) {
  const o = n > 1 || n === 0 && e !== K;
  return n === 1 ? e === K ? t(r) : Ln(r) : o ? Ln(r) + Hl(e, n === 2) : t(r);
}
function yc(e) {
  const t = [];
  for (const r in e) {
    const n = e[r];
    n && t.push(n, r);
  }
  return t.join("");
}
function Ua(e, t) {
  return Ln(e) + "T" + Wl(e, t);
}
function Ln(e) {
  return Zl(e) + "-" + Be(e.isoDay);
}
function Zl(e) {
  const { isoYear: t } = e;
  return (t < 0 || t > 9999 ? Vl(t) + In(6, Math.abs(t)) : In(4, t)) + "-" + Be(e.isoMonth);
}
function jh(e) {
  return Be(e.isoMonth) + "-" + Be(e.isoDay);
}
function Wl(e, t) {
  const r = [Be(e.isoHour), Be(e.isoMinute)];
  return t !== -1 && r.push(Be(e.isoSecond) + ((n, o, i, a) => Ya(n * lt + o * on + i, a))(e.isoMillisecond, e.isoMicrosecond, e.isoNanosecond, t)), r.join(":");
}
function Xr(e, t = 0) {
  if (t === 1)
    return "";
  const [r, n] = nt(Math.abs(e), xo), [o, i] = nt(n, wo), [a, s] = nt(i, Ve);
  return Vl(e) + Be(r) + ":" + Be(o) + (a || s ? ":" + Be(a) + Ya(s) : "");
}
function za(e, t) {
  return t !== 1 && (t > 1 || t === 0 && e !== K) ? Hl(e, t === 2) : "";
}
function Hl(e, t) {
  return "[" + (t ? "!" : "") + "u-ca=" + e + "]";
}
function Ya(e, t) {
  let r = In(9, e);
  return r = t === void 0 ? r.replace(mg, "") : r.slice(0, t), r ? "." + r : "";
}
function Vl(e) {
  return e < 0 ? "-" : "+";
}
function $t(e, t) {
  return e || t ? e.toLocaleString("fullwide", {
    useGrouping: 0
  }) : "";
}
function Sh(e, t) {
  const { epochNanoseconds: r } = e, n = (t.N ? t : t(e.timeZone)).N(r), o = br(r, n);
  return {
    calendar: e.calendar,
    ...o,
    offsetNanoseconds: n
  };
}
function jr(e, t, r, n = 0, o = 0, i, a) {
  if (r !== void 0 && n === 1 && (n === 1 || a))
    return Ra(t, r);
  const s = e.v(t);
  if (r !== void 0 && n !== 3) {
    const c = ((u, f, d, p) => {
      const h = pe(f);
      p && (d = Bn(d));
      for (const y of u) {
        let m = Je(Ge(y, h));
        if (p && (m = Bn(m)), m === d)
          return y;
      }
    })(s, t, r, i);
    if (c !== void 0)
      return c;
    if (n === 0)
      throw new RangeError(Oy);
  }
  return a ? pe(t) : en(e, t, o, s);
}
function en(e, t, r = 0, n = e.v(t)) {
  if (n.length === 1)
    return n[0];
  if (r === 1)
    throw new RangeError(Ry);
  if (n.length)
    return n[r === 3 ? 1 : 0];
  const o = pe(t), i = ((s, c) => {
    const u = s.N(zt(c, -ae));
    return ((f) => {
      if (f > ae)
        throw new RangeError(Ey);
      return f;
    })(s.N(zt(c, ae)) - u);
  })(e, o), a = i * (r === 2 ? -1 : 1);
  return (n = e.v(br(o, a)))[r === 2 ? 0 : n.length - 1];
}
function Ot(e, t) {
  const r = e.v(t);
  if (r.length)
    return r[0];
  const n = zt(pe(t), -ae);
  return e.l(n, 1);
}
function gc(e, t, r) {
  return ct(Qe(fr(t.epochNanoseconds, ((n) => {
    if (Kl(n))
      throw new RangeError(My);
    return he(n, 5);
  })(e ? Te(r) : r))));
}
function vc(e, t, r, n, o, i = /* @__PURE__ */ Object.create(null)) {
  const a = t(n.timeZone), s = e(n.calendar);
  return {
    ...n,
    ...Za(a, s, n, r ? Te(o) : o, i)
  };
}
function bc(e, t, r, n, o = /* @__PURE__ */ Object.create(null)) {
  const { calendar: i } = r;
  return Ue(Wa(e(i), r, t ? Te(n) : n, o), i);
}
function wc(e, t, r, n, o) {
  const { calendar: i } = r;
  return ut(so(e(i), r, t ? Te(n) : n, o), i);
}
function xc(e, t, r, n, o) {
  const i = r.calendar, a = e(i);
  let s = Le(Zr(a, r));
  t && (n = Ga(n)), n.sign < 0 && (s = a.P(s, {
    ...me,
    months: 1
  }), s = Ht(s, -1));
  const c = a.P(s, n, o);
  return Yr(Zr(a, c), i);
}
function jc(e, t, r) {
  return et(Gl(t, e ? Te(r) : r)[0]);
}
function Za(e, t, r, n, o) {
  const i = he(n, 5);
  let a = r.epochNanoseconds;
  if (Kl(n)) {
    const s = _e(r, e);
    a = fr(en(e, {
      ...so(t, s, {
        ...n,
        ...xs
      }, o),
      ...$e(ze, s)
    }), i);
  } else
    a = fr(a, i), ee(o);
  return {
    epochNanoseconds: Qe(a)
  };
}
function Wa(e, t, r, n) {
  const [o, i] = Gl(t, r);
  return De({
    ...so(e, t, {
      ...r,
      ...xs,
      days: r.days + i
    }, n),
    ...o
  });
}
function so(e, t, r, n) {
  if (r.years || r.months || r.weeks)
    return e.P(t, r, n);
  ee(n);
  const o = r.days + he(r, 5)[0];
  return o ? Le(Ht(t, o)) : t;
}
function Zr(e, t, r = 1) {
  return Ht(t, r - e.day(t));
}
function Gl(e, t) {
  const [r, n] = he(t, 5), [o, i] = Kn(Pt(e) + n);
  return [o, r + i];
}
function Nh(e, t, r) {
  const n = ee(r);
  let o, { years: i, months: a, weeks: s, days: c } = t;
  if (c += he(t, 5)[0], i || a)
    o = Th(this, e, i, a, n);
  else {
    if (!s && !c)
      return e;
    o = Se(e);
  }
  if (o === void 0)
    throw new RangeError(_t);
  return o += (7 * s + c) * Ae, Le(Qn(o));
}
function Th(e, t, r, n, o) {
  let [i, a, s] = e.u(t);
  if (r) {
    const [c, u] = e.m(i, a);
    i += r, a = yo(c, u, e.F(i)), a = at("month", a, 1, e.O(i), o);
  }
  return n && ([i, a] = e.p(i, a, n)), s = at("day", s, 1, e.B(i, a), o), e.M(i, a, s);
}
function Ph(e, t, r) {
  return e += Gn(r, vt), (t += ba(r, vt)) < 1 ? (e--, t += vt) : t > vt && (e++, t -= vt), [e, t];
}
function Eh(e, t, r) {
  if (r) {
    if (t += r, !Number.isSafeInteger(t))
      throw new RangeError(_t);
    if (r < 0)
      for (; t < 1; )
        t += qn.call(this, --e);
    else {
      let n;
      for (; t > (n = qn.call(this, e)); )
        t -= n, e++;
    }
  }
  return [e, t];
}
function Ht(e, t) {
  return t ? {
    ...e,
    ...Qn(Se(e) + t * Ae)
  } : e;
}
function co(e, t, r) {
  const n = e(r.calendar);
  return dr(r) ? [r, n, t(r.timeZone)] : [{
    ...r,
    ...Me
  }, n];
}
function Ha(e) {
  return e ? Bl : pe;
}
function uo(e) {
  return e ? Q(Za, e) : Wa;
}
function Va(e) {
  return e ? Q(Kh, e) : Qh;
}
function dr(e) {
  return e && e.epochNanoseconds;
}
function Wr(e, t) {
  return e <= 6 - (dr(t) ? 1 : 0);
}
function Sc(e, t, r, n, o, i, a) {
  const s = e(Xe(a).relativeTo), c = Math.max(Yt(o), Yt(i));
  if (Wr(c, s))
    return fe(Vt(((m, v, P, T) => {
      const E = fr(he(m), he(v), T ? -1 : 1);
      if (!Number.isFinite(E[0]))
        throw new RangeError(_t);
      return {
        ...me,
        ...Sr(E, P)
      };
    })(o, i, c, n)));
  if (!s)
    throw new RangeError(bo);
  n && (i = Te(i));
  const [u, f, d] = co(t, r, s), p = uo(d), h = Va(d), y = p(f, u, o);
  return fe(h(f, u, p(f, y, i), c));
}
function Oh(e, t, r, n, o) {
  const i = Yt(n), [a, s, c, u, f] = ((_, M, Z) => {
    _ = ro(_, zn);
    let $ = Xf(_);
    const G = Z(_[Kf]);
    let B = Ca(_);
    const N = cn(_, 7);
    let j = sn(_);
    if ($ === void 0 && j === void 0)
      throw new RangeError(Iy);
    if (j == null && (j = 0), $ == null && ($ = Math.max(j, M)), Fl($, j), B = _a(B, j, 1), B > 1 && j > 5 && $ !== j)
      throw new RangeError("For calendar units with roundingIncrement > 1, use largestUnit = smallestUnit");
    return [$, j, B, N, G];
  })(o, i, e), d = Math.max(i, a);
  if (!f && d <= 6)
    return fe(Vt(((_, M, Z, $, G) => {
      const B = io(he(_), Z, $, G);
      return {
        ...me,
        ...Sr(B, M)
      };
    })(n, a, s, c, u)));
  if (!dr(f) && !n.sign)
    return n;
  if (!f)
    throw new RangeError(bo);
  const [p, h, y] = co(t, r, f), m = Ha(y), v = uo(y), P = Va(y), T = v(h, p, n);
  dr(f) || (De(p), De(T));
  let E = P(h, p, T, a);
  const R = n.sign, C = Dt(E);
  if (R && C && R !== C)
    throw new RangeError(Pr);
  return E = oo(E, m(T), a, s, c, u, h, p, m, v), fe(E);
}
function Rh(e) {
  return e.sign === -1 ? Ga(e) : e;
}
function Ga(e) {
  return fe(Te(e));
}
function Te(e) {
  const t = {};
  for (const r of te)
    t[r] = -1 * e[r] || 0;
  return t;
}
function Ah(e) {
  return !e.sign;
}
function Dt(e, t = te) {
  let r = 0;
  for (const n of t) {
    const o = Math.sign(e[n]);
    if (o) {
      if (r && r !== o)
        throw new RangeError(Dy);
      r = o;
    }
  }
  return r;
}
function Vt(e) {
  for (const t of Yy)
    at(t, e[t], -Ic, Ic, 1);
  return Jl(Je(he(e), Ve)), e;
}
function Jl(e) {
  if (!Number.isSafeInteger(e))
    throw new RangeError(Ay);
}
function he(e, t = 6) {
  return vl(e, t, te);
}
function Sr(e, t = 6) {
  const [r, n] = e, o = Jn(n, t, te);
  if (o[te[t]] += r * (ae / Ke[t]), !Number.isFinite(o[te[t]]))
    throw new RangeError(_t);
  return o;
}
function lo(e, t = 5) {
  return Jn(e, t, te);
}
function Kl(e) {
  return !!Dt(e, Gf);
}
function Yt(e) {
  let t = 9;
  for (; t > 0 && !e[te[t]]; t--)
    ;
  return t;
}
function Dh(e, t) {
  return [e, t];
}
function Nc(e) {
  const t = Math.floor(e / En) * En;
  return [t, t + En];
}
function Mh(e) {
  const t = Mt(e = kn(e));
  if (!t)
    throw new RangeError(Oe(e));
  let r;
  if (t.C)
    r = 0;
  else {
    if (!t.offset)
      throw new RangeError(Oe(e));
    r = Gt(t.offset);
  }
  return t.timeZone && es(t.timeZone, 1), ct(Ra(Xn(t), r));
}
function Ih(e) {
  const t = Mt(ye(e));
  if (!t)
    throw new RangeError(Oe(e));
  if (t.timeZone)
    return Ql(t, t.offset ? Gt(t.offset) : void 0);
  if (t.C)
    throw new RangeError(Oe(e));
  return ef(t);
}
function kh(e, t) {
  const r = Mt(ye(e));
  if (!r || !r.timeZone)
    throw new RangeError(Oe(e));
  const { offset: n } = r, o = n ? Gt(n) : void 0, [, i, a] = eo(t);
  return Ql(r, o, i, a);
}
function Gt(e) {
  const t = es(e);
  if (t === void 0)
    throw new RangeError(Oe(e));
  return t;
}
function Ch(e) {
  const t = Mt(ye(e));
  if (!t || t.C)
    throw new RangeError(Oe(e));
  return Ue(Xl(t));
}
function Ja(e, t, r) {
  let n = Mt(ye(e));
  if (!n || n.C)
    throw new RangeError(Oe(e));
  return t ? n.calendar === K && (n = n.isoYear === -271821 && n.isoMonth === 4 ? {
    ...n,
    isoDay: 20,
    ...Me
  } : {
    ...n,
    isoDay: 1,
    ...Me
  }) : r && n.calendar === K && (n = {
    ...n,
    isoYear: it
  }), ut(n.k ? Xl(n) : ef(n));
}
function _h(e, t) {
  const r = Qa(ye(t));
  if (r)
    return Ka(r), Yr(Oa(Wt(r)));
  const n = Ja(t, 1);
  return Yr(Zr(e(n.calendar), n));
}
function Ka(e) {
  if (e.calendar !== K)
    throw new RangeError(ot(e.calendar));
}
function Fh(e, t) {
  const r = Xa(ye(t));
  if (r)
    return Ka(r), Fn(Wt(r));
  const n = Ja(t, 0, 1), { calendar: o } = n, i = e(o), [a, s, c] = i.u(n), [u, f] = i.m(a, s), [d, p] = i.R(u, f, c);
  return Fn(Le(i.U(d, p, c)), o);
}
function Bh(e) {
  let t, r = ((n) => {
    const o = jg.exec(n);
    return o ? (fo(o[10]), nf(o)) : void 0;
  })(ye(e));
  if (!r) {
    if (r = Mt(e), !r)
      throw new RangeError(Oe(e));
    if (!r.k)
      throw new RangeError(Oe(e));
    if (r.C)
      throw new RangeError(ot("Z"));
    Ka(r);
  }
  if ((t = Qa(e)) && hc(t))
    throw new RangeError(Oe(e));
  if ((t = Xa(e)) && hc(t))
    throw new RangeError(Oe(e));
  return et(wr(r, 1));
}
function Lh(e) {
  const t = ((r) => {
    const n = Tg.exec(r);
    return n ? ((o) => {
      function i(f, d, p) {
        let h = 0, y = 0;
        if (p && ([h, c] = nt(c, Ke[p])), f !== void 0) {
          if (s)
            throw new RangeError(ot(f));
          y = ((m) => {
            const v = parseInt(m);
            if (!Number.isFinite(v))
              throw new RangeError(ot(m));
            return v;
          })(f), a = 1, d && (c = ts(d) * (Ke[p] / Ve), s = 1);
        }
        return h + y;
      }
      let a = 0, s = 0, c = 0, u = {
        ...gr(te, [i(o[2]), i(o[3]), i(o[4]), i(o[5]), i(o[6], o[7], 5), i(o[8], o[9], 4), i(o[10], o[11], 3)]),
        ...Jn(c, 2, te)
      };
      if (!a)
        throw new RangeError(Mf(te));
      return rs(o[1]) < 0 && (u = Te(u)), u;
    })(n) : void 0;
  })(ye(e));
  if (!t)
    throw new RangeError(Oe(e));
  return fe(Vt(t));
}
function $h(e) {
  const t = Mt(e) || Qa(e) || Xa(e);
  return t ? t.calendar : e;
}
function qh(e) {
  const t = Mt(e);
  return t && (t.timeZone || t.C && Kt || t.offset) || e;
}
function Ql(e, t, r = 0, n = 0) {
  const o = ns(e.timeZone), i = H(o);
  let a;
  return Xn(e), a = e.k ? jr(i, e, t, r, n, !i.j, e.C) : Ot(i, e), qe(a, o, vo(e.calendar));
}
function Xl(e) {
  return tf(De(Xn(e)));
}
function ef(e) {
  return tf(Le(Wt(e)));
}
function tf(e) {
  return {
    ...e,
    calendar: vo(e.calendar)
  };
}
function Mt(e) {
  const t = xg.exec(e);
  return t ? ((r) => {
    const n = r[10], o = (n || "").toUpperCase() === "Z";
    return {
      isoYear: rf(r),
      isoMonth: parseInt(r[4]),
      isoDay: parseInt(r[5]),
      ...nf(r.slice(5)),
      ...fo(r[16]),
      k: !!r[6],
      C: o,
      offset: o ? void 0 : n
    };
  })(t) : void 0;
}
function Qa(e) {
  const t = bg.exec(e);
  return t ? ((r) => ({
    isoYear: rf(r),
    isoMonth: parseInt(r[4]),
    isoDay: 1,
    ...fo(r[5])
  }))(t) : void 0;
}
function Xa(e) {
  const t = wg.exec(e);
  return t ? ((r) => ({
    isoYear: it,
    isoMonth: parseInt(r[1]),
    isoDay: parseInt(r[2]),
    ...fo(r[3])
  }))(t) : void 0;
}
function es(e, t) {
  const r = Sg.exec(e);
  return r ? ((n, o) => {
    const i = n[4] || n[5];
    if (o && i)
      throw new RangeError(ot(i));
    return ((a) => {
      if (Math.abs(a) >= ae)
        throw new RangeError(Py);
      return a;
    })((sr(n[2]) * xo + sr(n[3]) * wo + sr(n[4]) * Ve + ts(n[5] || "")) * rs(n[1]));
  })(r, t) : void 0;
}
function rf(e) {
  const t = rs(e[1]), r = parseInt(e[2] || e[3]);
  if (t < 0 && !r)
    throw new RangeError(ot(-0));
  return t * r;
}
function nf(e) {
  const t = sr(e[3]);
  return {
    ...Kn(ts(e[4] || ""))[0],
    isoHour: sr(e[1]),
    isoMinute: sr(e[2]),
    isoSecond: t === 60 ? 59 : t
  };
}
function fo(e) {
  let t, r;
  const n = [];
  if (e.replace(Ng, ((o, i, a) => {
    const s = !!i, [c, u] = a.split("=").reverse();
    if (u) {
      if (u === "u-ca")
        n.push(c), t || (t = s);
      else if (s || /[A-Z]/.test(u))
        throw new RangeError(ot(o));
    } else {
      if (r)
        throw new RangeError(ot(o));
      r = c;
    }
    return "";
  })), n.length > 1 && t)
    throw new RangeError(ot(e));
  return {
    timeZone: r,
    calendar: n[0] || K
  };
}
function ts(e) {
  return parseInt(e.padEnd(9, "0"));
}
function Nr(e) {
  return new RegExp(`^${e}$`, "i");
}
function rs(e) {
  return e && e !== "+" ? -1 : 1;
}
function sr(e) {
  return e === void 0 ? 0 : parseInt(e);
}
function Uh(e) {
  return ns(ye(e));
}
function ns(e) {
  const t = os(e);
  return typeof t == "number" ? Xr(t) : t ? ((r) => {
    if (Og.test(r))
      throw new RangeError(Ff(r));
    if (Eg.test(r))
      throw new RangeError(Ty);
    return r.toLowerCase().split("/").map(((n, o) => (n.length <= 3 || /\d/.test(n)) && !/etc|yap/.test(n) ? n.toUpperCase() : n.replace(/baja|dumont|[a-z]+/g, ((i, a) => i.length <= 2 && !o || i === "in" || i === "chat" ? i.toUpperCase() : i.length > 2 || !a ? dc(i).replace(/island|noronha|murdo|rivadavia|urville/, dc) : i)))).join("/");
  })(e) : Kt;
}
function Tc(e) {
  const t = os(e);
  return typeof t == "number" ? t : t ? t.resolvedOptions().timeZone : Kt;
}
function os(e) {
  const t = es(e = e.toUpperCase(), 1);
  return t !== void 0 ? t : e !== Kt ? Pg(e) : void 0;
}
function of(e, t) {
  return ke(e.epochNanoseconds, t.epochNanoseconds);
}
function af(e, t) {
  return ke(e.epochNanoseconds, t.epochNanoseconds);
}
function zh(e, t, r, n, o, i) {
  const a = e(Xe(i).relativeTo), s = Math.max(Yt(n), Yt(o));
  if (yl(te, n, o))
    return 0;
  if (Wr(s, a))
    return ke(he(n), he(o));
  if (!a)
    throw new RangeError(bo);
  const [c, u, f] = co(t, r, a), d = Ha(f), p = uo(f);
  return ke(d(p(u, c, n)), d(p(u, c, o)));
}
function sf(e, t) {
  return Tr(e, t) || is(e, t);
}
function Tr(e, t) {
  return jt(Se(e), Se(t));
}
function is(e, t) {
  return jt(Pt(e), Pt(t));
}
function Yh(e, t) {
  return !of(e, t);
}
function Zh(e, t) {
  return !af(e, t) && !!cf(e.timeZone, t.timeZone) && e.calendar === t.calendar;
}
function Wh(e, t) {
  return !sf(e, t) && e.calendar === t.calendar;
}
function Hh(e, t) {
  return !Tr(e, t) && e.calendar === t.calendar;
}
function Vh(e, t) {
  return !Tr(e, t) && e.calendar === t.calendar;
}
function Gh(e, t) {
  return !Tr(e, t) && e.calendar === t.calendar;
}
function Jh(e, t) {
  return !is(e, t);
}
function cf(e, t) {
  if (e === t)
    return 1;
  try {
    return Tc(e) === Tc(t);
  } catch {
  }
}
function Pc(e, t, r, n) {
  const o = xr(e, n, 3, 5), i = po(t.epochNanoseconds, r.epochNanoseconds, ...o);
  return fe(e ? Te(i) : i);
}
function Ec(e, t, r, n, o, i) {
  const a = mo(n.calendar, o.calendar), [s, c, u, f] = xr(r, i, 5), d = n.epochNanoseconds, p = o.epochNanoseconds, h = ke(p, d);
  let y;
  if (h)
    if (s < 6)
      y = po(d, p, s, c, u, f);
    else {
      const m = t(nm(n.timeZone, o.timeZone)), v = e(a);
      y = lf(v, m, n, o, h, s, i), y = oo(y, p, s, c, u, f, v, n, Bl, Q(Za, m));
    }
  else
    y = me;
  return fe(r ? Te(y) : y);
}
function Oc(e, t, r, n, o) {
  const i = mo(r.calendar, n.calendar), [a, s, c, u] = xr(t, o, 6), f = pe(r), d = pe(n), p = ke(d, f);
  let h;
  if (p)
    if (a <= 6)
      h = po(f, d, a, s, c, u);
    else {
      const y = e(i);
      h = ff(y, r, n, p, a, o), h = oo(h, d, a, s, c, u, y, r, pe, Wa);
    }
  else
    h = me;
  return fe(t ? Te(h) : h);
}
function Rc(e, t, r, n, o) {
  const i = mo(r.calendar, n.calendar);
  return uf(t, (() => e(i)), r, n, ...xr(t, o, 6, 9, 6));
}
function Ac(e, t, r, n, o) {
  const i = mo(r.calendar, n.calendar), a = xr(t, o, 9, 9, 8), s = e(i), c = Zr(s, r), u = Zr(s, n);
  return c.isoYear === u.isoYear && c.isoMonth === u.isoMonth && c.isoDay === u.isoDay ? fe(me) : uf(t, (() => s), Le(c), Le(u), ...a, 8);
}
function uf(e, t, r, n, o, i, a, s, c = 6) {
  const u = pe(r), f = pe(n);
  if (u === void 0 || f === void 0)
    throw new RangeError(_t);
  let d;
  if (ke(f, u))
    if (o === 6)
      d = po(u, f, o, i, a, s);
    else {
      const p = t();
      d = p.h(r, n, o), i === c && a === 1 || (d = oo(d, f, o, i, a, s, p, r, pe, so));
    }
  else
    d = me;
  return fe(e ? Te(d) : d);
}
function Dc(e, t, r, n) {
  const [o, i, a, s] = xr(e, n, 5, 5), c = Et(as(t, r), Qr(i, a), s), u = {
    ...me,
    ...lo(c, o)
  };
  return fe(e ? Te(u) : u);
}
function Kh(e, t, r, n, o, i) {
  const a = ke(n.epochNanoseconds, r.epochNanoseconds);
  return a ? o < 6 ? df(r.epochNanoseconds, n.epochNanoseconds, o) : lf(t, e, r, n, a, o, i) : me;
}
function Qh(e, t, r, n, o) {
  const i = pe(t), a = pe(r), s = ke(a, i);
  return s ? n <= 6 ? df(i, a, n) : ff(e, t, r, s, n, o) : me;
}
function lf(e, t, r, n, o, i, a) {
  const [s, c, u] = Xh(t, r, n, o);
  var f, d;
  return {
    ...i === 6 ? (f = s, d = c, {
      ...me,
      days: pf(f, d)
    }) : e.h(s, c, i, a),
    ...lo(u)
  };
}
function ff(e, t, r, n, o, i) {
  const [a, s, c] = ((u, f, d) => {
    let p = f, h = as(u, f);
    return Math.sign(h) === -d && (p = Ht(f, -d), h += ae * d), [u, p, h];
  })(t, r, n);
  return {
    ...e.h(a, s, o, i),
    ...lo(c)
  };
}
function Xh(e, t, r, n) {
  function o() {
    return d = {
      ...Ht(s, u++ * -n),
      ...a
    }, p = en(e, d), ke(c, p) === -n;
  }
  const i = _e(t, e), a = $e(ze, i), s = _e(r, e), c = r.epochNanoseconds;
  let u = 0;
  const f = as(i, s);
  let d, p;
  if (Math.sign(f) === -n && u++, o() && (n === -1 || o()))
    throw new RangeError(Pr);
  const h = Je(Ge(p, c));
  return [i, d, h];
}
function po(e, t, r, n, o, i) {
  return {
    ...me,
    ...Sr(io(Ge(e, t), n, o, i), r)
  };
}
function df(e, t, r) {
  return {
    ...me,
    ...Sr(Ge(e, t), r)
  };
}
function pf(e, t) {
  return ho(Se(e), Se(t));
}
function ho(e, t) {
  return Math.trunc((t - e) / Ae);
}
function as(e, t) {
  return Pt(t) - Pt(e);
}
function em(e, t, r) {
  if (r <= 7) {
    let c = 0, u = pf({
      ...e,
      ...Me
    }, {
      ...t,
      ...Me
    });
    return r === 7 && ([c, u] = Tt(u, 7)), {
      ...me,
      weeks: c,
      days: u
    };
  }
  const n = this.u(e), o = this.u(t);
  let [i, a, s] = ((c, u, f, d, p, h, y) => {
    let m = p - u, v = h - f, P = y - d;
    if (m || v) {
      const T = Math.sign(m || v);
      let E = c.B(p, h), R = 0;
      if (Math.sign(P) === -T) {
        const C = E;
        [p, h] = c.p(p, h, -T), m = p - u, v = h - f, E = c.B(p, h), R = T < 0 ? -C : E;
      }
      if (P = y - Math.min(d, E) + R, m) {
        const [C, _] = c.m(u, f), [M, Z] = c.m(p, h);
        if (v = M - C || Number(Z) - Number(_), Math.sign(v) === -T) {
          const $ = T < 0 && -c.O(p);
          m = (p -= T) - u, v = h - yo(C, _, c.F(p)) + ($ || c.O(p));
        }
      }
    }
    return [m, v, P];
  })(this, ...n, ...o);
  return r === 8 && (a += this.q(i, n[0]), i = 0), {
    ...me,
    years: i,
    months: a,
    days: s
  };
}
function tm(e) {
  return e * vt;
}
function rm(e, t) {
  const r = t + e, n = Math.sign(e), o = n < 0 ? -1 : 0;
  let i = 0;
  for (let a = t; a !== r; a += n)
    i += qn.call(this, a + o);
  return i;
}
function mo(e, t) {
  if (e !== t)
    throw new RangeError(_f);
  return e;
}
function nm(e, t) {
  if (!cf(e, t))
    throw new RangeError(Bf);
  return e;
}
function hf(e) {
  return this.I(e)[0];
}
function mf(e) {
  return this.I(e)[1];
}
function om(e) {
  const [t] = this.u(e);
  return this.L(t);
}
function im(e) {
  const [t] = this.u(e);
  return this.O(t);
}
function am(e) {
  const [t, r] = this.u(e);
  return this.B(t, r);
}
function sm(e) {
  const [t] = this.u(e);
  return this.G(t);
}
function ss(e) {
  const [t] = this.u(e);
  return ho(this.M(t), Se(e)) + 1;
}
function cs(e) {
  const t = Rg.exec(e);
  if (!t)
    throw new RangeError(Sy(e));
  return [parseInt(t[1]), !!t[2]];
}
function tn(e, t) {
  return "M" + Be(e) + (t ? "L" : "");
}
function yo(e, t, r) {
  return e + (t || r && e >= r ? 1 : 0);
}
function us(e, t) {
  return e - (t && e >= t ? 1 : 0);
}
function yf(e, t) {
  return (t + e) * (Math.sign(t) || 1) || 0;
}
function ls(e) {
  return Hf[vf(e)];
}
function gf(e) {
  return $y[vf(e)];
}
function vf(e) {
  return Zt(e.id || K);
}
function cm(e) {
  function t(o) {
    return ((i, a) => ({
      ...bf(i, a),
      V: i.month,
      day: parseInt(i.day)
    }))(Aa(r, o), n);
  }
  const r = _s(e), n = Zt(e);
  return {
    id: e,
    _: um(t),
    J: lm(t)
  };
}
function um(e) {
  return Ie(((t) => {
    const r = Se(t);
    return e(r);
  }), WeakMap);
}
function lm(e) {
  const t = e(0).year - Jy;
  return Ie(((r) => {
    let n, o = vr(r - t), i = 0;
    const a = [], s = [];
    do
      o += 400 * Ae;
    while ((n = e(o)).year <= r);
    do
      if (o += (1 - n.day) * Ae, n.year === r && (a.push(o), s.push(n.V)), o -= Ae, ++i > 100 || o < -Ps)
        throw new RangeError(Pr);
    while ((n = e(o)).year >= r);
    return {
      K: a.reverse(),
      X: Lf(s.reverse())
    };
  }));
}
function bf(e, t) {
  let r, n, o = wf(e);
  if (e.era) {
    const i = Hf[t], a = Vf[t] || {};
    i !== void 0 && (r = t === "islamic" ? "ah" : e.era.normalize("NFD").toLowerCase().replace(/[^a-z0-9]/g, ""), r === "bc" || r === "b" ? r = "bce" : r === "ad" || r === "a" ? r = "ce" : r === "beforeroc" && (r = "broc"), r = a[r] || r, n = o, o = yf(n, i[r] || 0));
  }
  return {
    era: r,
    eraYear: n,
    year: o
  };
}
function wf(e) {
  return parseInt(e.relatedYear || e.year);
}
function fm(e) {
  return this._(e).day;
}
function go(e) {
  const { year: t, V: r, day: n } = this._(e), { X: o } = this.J(t);
  return [t, o[r] + 1, n];
}
function dm(e, t, r) {
  return Qn(Hr.call(this, e, t, r));
}
function Hr(e, t = 1, r = 1) {
  return this.J(e).K[t - 1] + (r - 1) * Ae;
}
function xf(e, t) {
  const r = $n.call(this, e);
  return [us(t, r), r === t];
}
function $n(e) {
  const t = Mc(this, e), r = Mc(this, e - 1), n = t.length;
  if (n > r.length) {
    const o = gf(this);
    if (o < 0)
      return -o;
    for (let i = 0; i < n; i++)
      if (t[i] !== r[i])
        return i + 1;
  }
}
function pm(e) {
  const t = Pn.call(this, e);
  return t > Pn.call(this, e - 1) && t > Pn.call(this, e + 1);
}
function Pn(e) {
  return ho(Hr.call(this, e), Hr.call(this, e + 1));
}
function jf(e, t) {
  const { K: r } = this.J(e);
  let n = t + 1, o = r;
  return n > r.length && (n = 1, o = this.J(e + 1).K), ho(r[t - 1], o[n - 1]);
}
function qn(e) {
  return this.J(e).K.length;
}
function Sf(e) {
  const t = this._(e);
  return [t.era, t.eraYear];
}
function hm(e, t, r) {
  const n = this.id && Zt(this.id) === "chinese" ? ((u, f, d) => {
    if (f)
      switch (u) {
        case 1:
          return 1651;
        case 2:
          return d < 30 ? 1947 : 1765;
        case 3:
          return d < 30 ? 1966 : 1955;
        case 4:
          return d < 30 ? 1963 : 1944;
        case 5:
          return d < 30 ? 1971 : 1952;
        case 6:
          return d < 30 ? 1960 : 1941;
        case 7:
          return d < 30 ? 1968 : 1938;
        case 8:
          return d < 30 ? 1957 : 1718;
        case 9:
          return 1832;
        case 10:
          return 1870;
        case 11:
          return 1814;
        case 12:
          return 1890;
      }
    return 1972;
  })(e, t, r) : it;
  let [o, i, a] = go.call(this, {
    isoYear: n,
    isoMonth: vt,
    isoDay: 31
  });
  const s = $n.call(this, o), c = i === s;
  (jt(e, us(i, s)) || jt(Number(t), Number(c)) || jt(r, a)) === 1 && o--;
  for (let u = 0; u < 100; u++) {
    const f = o - u, d = $n.call(this, f), p = yo(e, t, d);
    if (t === (p === d) && r <= jf.call(this, f, p))
      return [f, p];
  }
}
function Mc(e, t) {
  return Object.keys(e.J(t).X);
}
function rn(e) {
  return vo(ye(e));
}
function vo(e) {
  if ((e = e.toLowerCase()) !== K && e !== Or) {
    const t = _s(e).resolvedOptions().calendar;
    if (Zt(e) !== Zt(t))
      throw new RangeError(Cf(e));
    return t;
  }
  return e;
}
function Zt(e) {
  return e === "islamicc" && (e = "islamic"), e.split("-")[0];
}
function Nf(e, t) {
  return (r) => r === K ? e : r === Or || r === Rt ? Object.assign(Object.create(e), {
    id: r
  }) : Object.assign(Object.create(t), Ag(r));
}
function mm(e, t, r, n) {
  const o = It(r, n, dt, [], zf);
  if (o.timeZone !== void 0) {
    const i = r.ee(o), a = nn(o), s = e(o.timeZone);
    return {
      epochNanoseconds: jr(t(s), {
        ...i,
        ...a
      }, o.offset !== void 0 ? Gt(o.offset) : void 0),
      timeZone: s
    };
  }
  return {
    ...r.ee(o),
    ...Me
  };
}
function ym(e, t, r, n, o, i) {
  const a = It(r, o, dt, qf, zf), s = e(a.timeZone), [c, u, f] = eo(i), d = r.ee(a, no(c)), p = nn(a, c);
  return qe(jr(t(s), {
    ...d,
    ...p
  }, a.offset !== void 0 ? Gt(a.offset) : void 0, u, f), s, n);
}
function gm(e, t, r) {
  const n = It(e, t, dt, [], ft), o = ee(r);
  return Ue(De({
    ...e.ee(n, no(o)),
    ...nn(n, o)
  }));
}
function vm(e, t, r, n = []) {
  const o = It(e, t, dt, n);
  return e.ee(o, r);
}
function bm(e, t, r, n) {
  const o = It(e, t, bs, n);
  return e.ne(o, r);
}
function wm(e, t, r, n) {
  const o = It(e, r, dt, an);
  return t && o.month !== void 0 && o.monthCode === void 0 && o.year === void 0 && (o.year = it), e.te(o, n);
}
function xm(e, t) {
  return et(nn(Ce(e, ea, [], 1), ee(t)));
}
function jm(e) {
  const t = Ce(e, ws);
  return fe(Vt({
    ...me,
    ...t
  }));
}
function It(e, t, r, n = [], o = []) {
  return Ce(t, [...e.fields(r), ...o].sort(), n);
}
function Ce(e, t, r, n = !r) {
  const o = {};
  let i, a = 0;
  for (const s of t) {
    if (s === i)
      throw new RangeError(my(s));
    if (s === "constructor" || s === "__proto__")
      throw new RangeError(hy(s));
    let c = e[s];
    if (c !== void 0)
      a = 1, kc[s] && (c = kc[s](c, s)), o[s] = c;
    else if (r) {
      if (r.includes(s))
        throw new TypeError(ps(s));
      o[s] = Wf[s];
    }
    i = s;
  }
  if (n && !a)
    throw new TypeError(Mf(t));
  return o;
}
function nn(e, t) {
  return wr(Fs({
    ...Wf,
    ...e
  }), t);
}
function Sm(e, t, r, n, o) {
  const { calendar: i, timeZone: a } = r, s = e(i), c = t(a), u = [...s.fields(dt), ...Uf].sort(), f = ((P) => {
    const T = _e(P, H), E = Xr(T.offsetNanoseconds), R = No(P.calendar), [C, _, M] = R.u(T), [Z, $] = R.m(C, _), G = tn(Z, $);
    return {
      ...Yg(T),
      year: C,
      monthCode: G,
      day: M,
      offset: E
    };
  })(r), d = Ce(n, u), p = s.oe(f, d), h = {
    ...f,
    ...d
  }, [y, m, v] = eo(o, 2);
  return qe(jr(c, {
    ...s.ee(p, no(y)),
    ...wr(Fs(h), y)
  }, Gt(h.offset), m, v), a, i);
}
function Nm(e, t, r, n) {
  const o = e(t.calendar), i = [...o.fields(dt), ...ft].sort(), a = {
    ...Pf(s = t),
    hour: s.isoHour,
    minute: s.isoMinute,
    second: s.isoSecond,
    millisecond: s.isoMillisecond,
    microsecond: s.isoMicrosecond,
    nanosecond: s.isoNanosecond
  };
  var s;
  const c = Ce(r, i), u = ee(n), f = o.oe(a, c), d = {
    ...a,
    ...c
  };
  return Ue(De({
    ...o.ee(f, no(u)),
    ...wr(Fs(d), u)
  }));
}
function Tm(e, t, r, n) {
  const o = e(t.calendar), i = o.fields(dt).sort(), a = Pf(t), s = Ce(r, i), c = o.oe(a, s);
  return o.ee(c, n);
}
function Pm(e, t, r, n) {
  const o = e(t.calendar), i = o.fields(bs).sort(), a = ((u) => {
    const f = No(u.calendar), [d, p] = f.u(u), [h, y] = f.m(d, p);
    return {
      year: d,
      monthCode: tn(h, y)
    };
  })(t), s = Ce(r, i), c = o.oe(a, s);
  return o.ne(c, n);
}
function Em(e, t, r, n) {
  const o = e(t.calendar), i = o.fields(dt).sort(), a = ((u) => {
    const f = No(u.calendar), [d, p, h] = f.u(u), [y, m] = f.m(d, p);
    return {
      monthCode: tn(y, m),
      day: h
    };
  })(t), s = Ce(r, i), c = o.oe(a, s);
  return o.te(c, n);
}
function Om(e, t, r) {
  return et(((n, o, i) => nn({
    ...$e(ea, n),
    ...Ce(o, ea)
  }, ee(i)))(e, t, r));
}
function Rm(e, t) {
  return fe((r = e, n = t, Vt({
    ...r,
    ...Ce(n, ws)
  })));
  var r, n;
}
function Am(e, t) {
  const r = It(e, t, Zf);
  return e.te(r);
}
function Dm(e, t, r) {
  const n = It(e, t, Yf);
  return e.ne(n, r);
}
function Tf(e, t, r, n, o) {
  t = $e(r = e.fields(r), t), n = Ce(n, o = e.fields(o), []);
  let i = e.oe(t, n);
  return i = Ce(i, [...r, ...o].sort(), []), e.ee(i);
}
function Mm(e, t) {
  const r = ee(t), n = fs(this, e), o = Un(this, e, n, r), i = Ji(this, e, o, n, r);
  return ut(Le(this.U(n, o, i)), this.id || K);
}
function Im(e, t) {
  const r = ee(t), n = fs(this, e), o = Un(this, e, n, r);
  return Yr(Oa(this.U(n, o, 1)), this.id || K);
}
function km(e, t) {
  const r = ee(t);
  let n, o, i, a = e.eraYear !== void 0 || e.year !== void 0 ? fs(this, e) : void 0;
  const s = !this.id;
  if (a === void 0 && s && (a = it), a !== void 0) {
    const d = Un(this, e, a, r);
    n = Ji(this, e, d, a, r);
    const p = this.F(a);
    o = us(d, p), i = d === p;
  } else {
    if (e.monthCode === void 0)
      throw new TypeError(kf);
    if ([o, i] = cs(e.monthCode), this.id && this.id !== Or && this.id !== Rt)
      if (this.id && Zt(this.id) === "coptic" && r === 0) {
        const d = i || o !== 13 ? 30 : 6;
        n = e.day, n = zr(n, 1, d);
      } else if (this.id && Zt(this.id) === "chinese" && r === 0) {
        const d = !i || o !== 1 && o !== 9 && o !== 10 && o !== 11 && o !== 12 ? 30 : 29;
        n = e.day, n = zr(n, 1, d);
      } else
        n = e.day;
    else
      n = Ji(this, e, Un(this, e, it, r), it, r);
  }
  const c = this.R(o, i, n);
  if (!c)
    throw new RangeError("Cannot guess year");
  const [u, f] = c;
  return Fn(Le(this.U(u, f, n)), this.id || K);
}
function Cm(e) {
  return ls(this) && e.includes("year") ? [...e, ...ms] : e;
}
function _m(e, t) {
  const r = Object.assign(/* @__PURE__ */ Object.create(null), e);
  return _o(r, t, vs), ls(this) && (_o(r, t, By), this.id === Rt && _o(r, t, Ly, ms)), r;
}
function fs(e, t) {
  const r = ls(e), n = Vf[e.id || ""] || {};
  let { era: o, eraYear: i, year: a } = t;
  if (o !== void 0 || i !== void 0) {
    if (o === void 0 || i === void 0)
      throw new TypeError(by);
    if (!r)
      throw new RangeError(vy);
    const s = r[n[o] || o];
    if (s === void 0)
      throw new RangeError(xy(o));
    const c = yf(i, s);
    if (a !== void 0 && a !== c)
      throw new RangeError(wy);
    a = c;
  } else if (a === void 0)
    throw new TypeError(jy(r));
  return a;
}
function Un(e, t, r, n) {
  let { month: o, monthCode: i } = t;
  if (i !== void 0) {
    const a = ((s, c, u, f) => {
      const d = s.F(u), [p, h] = cs(c);
      let y = yo(p, h, d);
      if (h) {
        const m = gf(s);
        if (m === void 0)
          throw new RangeError(kr);
        if (m > 0) {
          if (y > m)
            throw new RangeError(kr);
          if (d === void 0) {
            if (f === 1)
              throw new RangeError(kr);
            y--;
          }
        } else {
          if (y !== -m)
            throw new RangeError(kr);
          if (d === void 0 && f === 1)
            throw new RangeError(kr);
        }
      }
      return y;
    })(e, i, r, n);
    if (o !== void 0 && o !== a)
      throw new RangeError(Ny);
    o = a, n = 1;
  } else if (o === void 0)
    throw new TypeError(kf);
  return at("month", o, 1, e.O(r), n);
}
function Ji(e, t, r, n, o) {
  return Ee(t, "day", 1, e.B(n, r), o);
}
function _o(e, t, r, n) {
  let o = 0;
  const i = [];
  for (const a of r)
    t[a] !== void 0 ? o = 1 : i.push(a);
  if (Object.assign(e, t), o)
    for (const a of n || i)
      delete e[a];
}
function Pf(e) {
  const t = No(e.calendar), [r, n, o] = t.u(e), [i, a] = t.m(r, n);
  return {
    year: r,
    monthCode: tn(i, a),
    day: o
  };
}
function Fm(e) {
  return ct(Qe(Pa(Sa(e))));
}
function Bm(e, t, r, n, o = K) {
  return qe(Qe(Pa(Sa(r))), t(n), e(o));
}
function Lm(e, t, r, n, o = 0, i = 0, a = 0, s = 0, c = 0, u = 0, f = K) {
  return Ue(De(Xn(st(je, gr(jo, [t, r, n, o, i, a, s, c, u])))), e(f));
}
function $m(e, t, r, n, o = K) {
  return ut(Le(Wt(st(je, {
    isoYear: t,
    isoMonth: r,
    isoDay: n
  }))), e(o));
}
function qm(e, t, r, n = K, o = 1) {
  const i = je(t), a = je(r), s = e(n);
  return Yr(Oa(Wt({
    isoYear: i,
    isoMonth: a,
    isoDay: je(o)
  })), s);
}
function Um(e, t, r, n = K, o = it) {
  const i = je(t), a = je(r), s = e(n);
  return Fn(Le(Wt({
    isoYear: je(o),
    isoMonth: i,
    isoDay: a
  })), s);
}
function zm(e = 0, t = 0, r = 0, n = 0, o = 0, i = 0) {
  return et(wr(st(je, gr(ze, [e, t, r, n, o, i])), 1));
}
function Ym(e = 0, t = 0, r = 0, n = 0, o = 0, i = 0, a = 0, s = 0, c = 0, u = 0) {
  return fe(Vt(st(Na, gr(te, [e, t, r, n, o, i, a, s, c, u]))));
}
function Zm(e, t, r = K) {
  return qe(e.epochNanoseconds, t, r);
}
function Wm(e) {
  return ct(e.epochNanoseconds);
}
function Ef(e, t) {
  return Ue(_e(t, e));
}
function Of(e, t) {
  return ut(_e(t, e));
}
function Rf(e, t) {
  return et(_e(t, e));
}
function Hm(e, t, r, n) {
  const o = ((i, a, s, c) => {
    const u = ((f) => td(Xe(f)))(c);
    return en(i(a), s, u);
  })(e, r, t, n);
  return qe(Qe(o), r, t.calendar);
}
function Vm(e, t, r, n, o) {
  const i = e(o.timeZone), a = o.plainTime, s = a !== void 0 ? t(a) : void 0, c = r(i);
  let u;
  return u = s ? en(c, {
    ...n,
    ...s
  }) : Ot(c, {
    ...n,
    ...Me
  }), qe(u, i, n.calendar);
}
function Gm(e, t = Me) {
  return Ue(De({
    ...e,
    ...t
  }));
}
function Jm(e, t, r) {
  return Dm(e(t.calendar), r);
}
function Km(e, t, r) {
  return Am(e(t.calendar), r);
}
function Qm(e, t, r, n) {
  return ((o, i, a) => Tf(o, i, Yf, Kr(a), an))(e(t.calendar), r, n);
}
function Xm(e, t, r, n) {
  return ((o, i, a) => Tf(o, i, Zf, Kr(a), ys))(e(t.calendar), r, n);
}
function ey(e) {
  return ct(Qe(Cn(Na(e), lt)));
}
function ty(e) {
  return ct(Qe(Pa(Sa(e))));
}
function Jt(e, t, r) {
  const n = new Set(r);
  return (o, i) => {
    const a = r && fc(o, r);
    if (!fc(o = ((s, c) => {
      const u = {};
      for (const f in c)
        s.has(f) || (u[f] = c[f]);
      return u;
    })(n, o), e)) {
      if (i && a)
        throw new TypeError("Invalid formatting options");
      o = {
        ...t,
        ...o
      };
    }
    return r && (o.timeZone = Kt, ["full", "long"].includes(o.ie) && (o.ie = "medium")), o;
  };
}
function kt(e, t = Af, r = 0) {
  const [n, , , o] = e;
  return (i, a = uv, ...s) => {
    const c = t(o && o(...s), i, a, n, r), u = c.resolvedOptions();
    return [c, ...ny(e, u, s)];
  };
}
function Af(e, t, r, n, o) {
  if (r = n(r, o), e) {
    if (r.timeZone !== void 0)
      throw new TypeError(_y);
    r.timeZone = e;
  }
  return new St(t, r);
}
function ry() {
  return new St(void 0, {
    calendar: K
  }).resolvedOptions().calendar === K;
}
function ny(e, t, r) {
  const [, n, o] = e;
  return r.map(((i) => (i.calendar && ((a, s, c) => {
    if ((c || a !== K) && a !== s)
      throw new RangeError(_f);
  })(i.calendar, t.calendar, o), n(i, t))));
}
function oy(e, t, r) {
  const n = t.timeZone, o = e(n), i = {
    ..._e(t, o),
    ...r || Me
  };
  let a;
  return a = r ? jr(o, i, i.offsetNanoseconds, 2) : Ot(o, i), qe(a, n, t.calendar);
}
function iy(e, t = Me) {
  return Ue(De({
    ...e,
    ...t
  }));
}
function ds(e, t) {
  return {
    ...e,
    calendar: t
  };
}
function ay(e, t) {
  return {
    ...e,
    timeZone: t
  };
}
function Fo(e) {
  const t = Ki();
  return br(t, e.N(t));
}
function Ki() {
  return Cn(Date.now(), lt);
}
function Ir() {
  return new St().resolvedOptions().timeZone;
}
const sy = (e, t) => `Non-integer ${e}: ${t}`, cy = (e, t) => `Non-positive ${e}: ${t}`, uy = (e, t) => `Non-finite ${e}: ${t}`, ly = (e) => `Cannot convert bigint to ${e}`, fy = (e) => `Invalid bigint: ${e}`, dy = "Cannot convert Symbol to string", py = "Invalid object", Df = (e, t, r, n, o) => o ? Df(e, o[t], o[r], o[n]) : Ct(e, t) + `; must be between ${r}-${n}`, Ct = (e, t) => `Invalid ${e}: ${t}`, ps = (e) => `Missing ${e}`, hy = (e) => `Invalid field ${e}`, my = (e) => `Duplicate field ${e}`, Mf = (e) => "No valid fields: " + e.join(), yy = "Invalid bag", If = (e, t, r) => Ct(e, t) + "; must be " + Object.keys(r).join(), gy = "Cannot use valueOf", Qi = "Invalid calling context", vy = "Forbidden era/eraYear", by = "Mismatching era/eraYear", wy = "Mismatching year/eraYear", xy = (e) => `Invalid era: ${e}`, jy = (e) => "Missing year" + (e ? "/era/eraYear" : ""), Sy = (e) => `Invalid monthCode: ${e}`, Ny = "Mismatching month/monthCode", kf = "Missing month/monthCode", kr = "Invalid leap month", Pr = "Invalid protocol results", Cf = (e) => Ct("Calendar", e), _f = "Mismatching Calendars", Ff = (e) => Ct("TimeZone", e), Bf = "Mismatching TimeZones", Ty = "Forbidden ICU TimeZone", Py = "Out-of-bounds offset", Ey = "Out-of-bounds TimeZone gap", Oy = "Invalid TimeZone offset", Ry = "Ambiguous offset", _t = "Out-of-bounds date", Ay = "Out-of-bounds duration", Dy = "Cannot mix duration signs", bo = "Missing relativeTo", My = "Cannot use large units", Iy = "Required smallestUnit or largestUnit", ky = "smallestUnit > largestUnit", Oe = (e) => `Cannot parse: ${e}`, ot = (e) => `Invalid substring: ${e}`, Cy = (e) => `Cannot format ${e}`, Bo = "Mismatching types for formatting", _y = "Cannot specify TimeZone", Lf = /* @__PURE__ */ Q(Vn, ((e, t) => t)), Er = /* @__PURE__ */ Q(Vn, ((e, t, r) => r)), Be = /* @__PURE__ */ Q(In, 2), Xi = {
  nanosecond: 0,
  microsecond: 1,
  millisecond: 2,
  second: 3,
  minute: 4,
  hour: 5,
  day: 6,
  week: 7,
  month: 8,
  year: 9
}, hs = /* @__PURE__ */ Object.keys(Xi), Ae = 864e5, $f = 1e3, on = 1e3, lt = 1e6, Ve = 1e9, wo = 6e10, xo = 36e11, ae = 864e11, Ke = [1, on, lt, Ve, wo, xo, ae], ft = /* @__PURE__ */ hs.slice(0, 6), ea = /* @__PURE__ */ Jr(ft), Fy = ["offset"], qf = ["timeZone"], Uf = /* @__PURE__ */ ft.concat(Fy), zf = /* @__PURE__ */ Uf.concat(qf), ms = ["era", "eraYear"], By = /* @__PURE__ */ ms.concat(["year"]), ys = ["year"], gs = ["monthCode"], vs = /* @__PURE__ */ ["month"].concat(gs), an = ["day"], bs = /* @__PURE__ */ vs.concat(ys), Yf = /* @__PURE__ */ gs.concat(ys), dt = /* @__PURE__ */ an.concat(bs), Ly = /* @__PURE__ */ an.concat(vs), Zf = /* @__PURE__ */ an.concat(gs), Wf = /* @__PURE__ */ Er(ft, 0), K = "iso8601", Or = "gregory", Rt = "japanese", Hf = {
  [Or]: {
    "gregory-inverse": -1,
    gregory: 0
  },
  [Rt]: {
    "japanese-inverse": -1,
    japanese: 0,
    meiji: 1867,
    taisho: 1911,
    showa: 1925,
    heisei: 1988,
    reiwa: 2018
  },
  ethiopic: {
    ethioaa: 0,
    ethiopic: 5500
  },
  coptic: {
    "coptic-inverse": -1,
    coptic: 0
  },
  roc: {
    "roc-inverse": -1,
    roc: 0
  },
  buddhist: {
    be: 0
  },
  islamic: {
    ah: 0
  },
  indian: {
    saka: 0
  },
  persian: {
    ap: 0
  }
}, Vf = {
  [Or]: {
    bce: "gregory-inverse",
    ce: "gregory"
  },
  [Rt]: {
    bce: "japanese-inverse",
    ce: "japanese"
  },
  ethiopic: {
    era0: "ethioaa",
    era1: "ethiopic"
  },
  coptic: {
    era0: "coptic-inverse",
    era1: "coptic"
  },
  roc: {
    broc: "roc-inverse",
    minguo: "roc"
  }
}, $y = {
  chinese: 13,
  dangi: 13,
  hebrew: -6
}, ye = /* @__PURE__ */ Q(xa, "string"), qy = /* @__PURE__ */ Q(xa, "boolean"), Uy = /* @__PURE__ */ Q(xa, "number"), te = /* @__PURE__ */ hs.map(((e) => e + "s")), ws = /* @__PURE__ */ Jr(te), zy = /* @__PURE__ */ te.slice(0, 6), Gf = /* @__PURE__ */ te.slice(6), Yy = /* @__PURE__ */ Gf.slice(1), Zy = /* @__PURE__ */ Lf(te), me = /* @__PURE__ */ Er(te, 0), xs = /* @__PURE__ */ Er(zy, 0), js = /* @__PURE__ */ Q(gl, te), ze = ["isoNanosecond", "isoMicrosecond", "isoMillisecond", "isoSecond", "isoMinute", "isoHour"], Ss = ["isoDay", "isoMonth", "isoYear"], jo = /* @__PURE__ */ ze.concat(Ss), Ns = /* @__PURE__ */ Jr(Ss), Jf = /* @__PURE__ */ Jr(ze), Wy = /* @__PURE__ */ Jr(jo), Me = /* @__PURE__ */ Er(Jf, 0), Hy = /* @__PURE__ */ Q(gl, jo), Ts = 1e8, Ps = Ts * Ae, Vy = [Ts, 0], Gy = [-Ts, 0], Vr = 275760, Gr = -271821, St = Intl.DateTimeFormat, Jy = 1970, it = 1972, vt = 12, Ky = /* @__PURE__ */ vr(1868, 9, 8), Qy = /* @__PURE__ */ Ie(ih, WeakMap), zn = "smallestUnit", ta = "unit", Xy = "roundingMode", Lr = "roundingIncrement", Lo = "fractionalSecondDigits", Kf = "relativeTo", $o = "direction", Qf = {
  constrain: 0,
  reject: 1
}, eg = /* @__PURE__ */ Object.keys(Qf), tg = {
  compatible: 0,
  reject: 1,
  earlier: 2,
  later: 3
}, rg = {
  reject: 0,
  use: 1,
  prefer: 2,
  ignore: 3
}, ng = {
  auto: 0,
  never: 1,
  critical: 2,
  always: 3
}, og = {
  auto: 0,
  never: 1,
  critical: 2
}, ig = {
  auto: 0,
  never: 1
}, ag = {
  floor: 0,
  halfFloor: 1,
  ceil: 2,
  halfCeil: 3,
  trunc: 4,
  halfTrunc: 5,
  expand: 6,
  halfExpand: 7,
  halfEven: 8
}, sg = {
  previous: -1,
  next: 1
}, sn = /* @__PURE__ */ Q(Fa, zn), Xf = /* @__PURE__ */ Q(Fa, "largestUnit"), cg = /* @__PURE__ */ Q(Fa, ta), ed = /* @__PURE__ */ Q(At, "overflow", Qf), td = /* @__PURE__ */ Q(At, "disambiguation", tg), ug = /* @__PURE__ */ Q(At, "offset", rg), Es = /* @__PURE__ */ Q(At, "calendarName", ng), lg = /* @__PURE__ */ Q(At, "timeZoneName", og), fg = /* @__PURE__ */ Q(At, "offset", ig), cn = /* @__PURE__ */ Q(At, Xy, ag), Os = "PlainYearMonth", Rs = "PlainMonthDay", un = "PlainDate", Rr = "PlainDateTime", As = "PlainTime", Ft = "ZonedDateTime", Ds = "Instant", Ms = "Duration", dg = [Math.floor, (e) => xn(e) ? Math.floor(e) : Math.round(e), Math.ceil, (e) => xn(e) ? Math.ceil(e) : Math.round(e), Math.trunc, (e) => xn(e) ? Math.trunc(e) || 0 : Math.round(e), (e) => e < 0 ? Math.floor(e) : Math.ceil(e), (e) => Math.sign(e) * Math.round(Math.abs(e)) || 0, (e) => xn(e) ? (e = Math.trunc(e) || 0) + e % 2 : Math.round(e)], Kt = "UTC", En = 5184e3, pg = /* @__PURE__ */ _n(1847), hg = /* @__PURE__ */ _n((() => {
  const e = /* @__PURE__ */ new Date();
  return (e.getTime() === 0 ? 2040 : e.getUTCFullYear()) + 10;
})()), mg = /0+$/, _e = /* @__PURE__ */ Ie(Sh, WeakMap), Ic = 2 ** 32 - 1, H = /* @__PURE__ */ Ie(((e) => {
  const t = os(e);
  return typeof t == "object" ? new gg(t) : new yg(t || 0);
}));
class yg {
  constructor(t) {
    this.j = t;
  }
  N() {
    return this.j;
  }
  v(t) {
    return ((r) => {
      const n = pe({
        ...r,
        ...Me
      });
      if (!n || Math.abs(n[0]) > 1e8)
        throw new RangeError(_t);
    })(t), [Ra(t, this.j)];
  }
  l() {
  }
}
class gg {
  constructor(t) {
    this.ae = ((r) => {
      function n(u) {
        const f = zr(u, s, c), [d, p] = Nc(f), h = i(d), y = i(p);
        return h === y ? h : o(a(d, p), h, y, u);
      }
      function o(u, f, d, p) {
        let h, y;
        for (; (p === void 0 || (h = p < u[0] ? f : p >= u[1] ? d : void 0) === void 0) && (y = u[1] - u[0]); ) {
          const m = u[0] + Math.floor(y / 2);
          r(m) === d ? u[1] = m : u[0] = m + 1;
        }
        return h;
      }
      const i = Ie(r), a = Ie(Dh);
      let s = pg, c = hg;
      return {
        se(u) {
          const f = n(u - 86400), d = n(u + 86400), p = u - f, h = u - d;
          if (f === d)
            return [p];
          const y = n(p);
          return y === n(h) ? [u - y] : f > d ? [p, h] : [];
        },
        ue: n,
        l(u, f) {
          const d = zr(u, s, c);
          let [p, h] = Nc(d);
          const y = En * f, m = f < 0 ? () => h > s || (s = d, 0) : () => p < c || (c = d, 0);
          for (; m(); ) {
            const v = i(p), P = i(h);
            if (v !== P) {
              const T = a(p, h);
              o(T, v, P);
              const E = T[0];
              if ((jt(E, u) || 1) === f)
                return E;
            }
            p += y, h += y;
          }
        }
      };
    })(/* @__PURE__ */ ((r) => (n) => {
      const o = Aa(r, n * $f);
      return _n(wf(o), parseInt(o.month), parseInt(o.day), parseInt(o.hour), parseInt(o.minute), parseInt(o.second)) - n;
    })(t));
  }
  N(t) {
    return this.ae.ue(eh(t)) * Ve;
  }
  v(t) {
    const [r, n] = [_n((o = t).isoYear, o.isoMonth, o.isoDay, o.isoHour, o.isoMinute, o.isoSecond), o.isoMillisecond * lt + o.isoMicrosecond * on + o.isoNanosecond];
    var o;
    return this.ae.se(r).map(((i) => Qe(zt(Cn(i, Ve), n))));
  }
  l(t, r) {
    const [n, o] = Tl(t), i = this.ae.l(n + (r > 0 || o ? 1 : 0), r);
    if (i !== void 0)
      return Cn(i, Ve);
  }
}
const Is = "([+-])", On = "(?:[.,](\\d{1,9}))?", rd = `(?:(?:${Is}(\\d{6}))|(\\d{4}))-?(\\d{2})`, ks = "(\\d{2})(?::?(\\d{2})(?::?(\\d{2})" + On + ")?)?", Cs = Is + ks, vg = rd + "-?(\\d{2})(?:[T ]" + ks + "(Z|" + Cs + ")?)?", nd = "\\[(!?)([^\\]]*)\\]", So = `((?:${nd}){0,9})`, bg = /* @__PURE__ */ Nr(rd + So), wg = /* @__PURE__ */ Nr("(?:--)?(\\d{2})-?(\\d{2})" + So), xg = /* @__PURE__ */ Nr(vg + So), jg = /* @__PURE__ */ Nr("T?" + ks + "(?:" + Cs + ")?" + So), Sg = /* @__PURE__ */ Nr(Cs), Ng = /* @__PURE__ */ new RegExp(nd, "g"), Tg = /* @__PURE__ */ Nr(`${Is}?P(\\d+Y)?(\\d+M)?(\\d+W)?(\\d+D)?(?:T(?:(\\d+)${On}H)?(?:(\\d+)${On}M)?(?:(\\d+)${On}S)?)?`), Pg = /* @__PURE__ */ Ie(((e) => new St("en", {
  calendar: K,
  timeZone: e,
  era: "short",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: 0
}))), Eg = /^(AC|AE|AG|AR|AS|BE|BS|CA|CN|CS|CT|EA|EC|IE|IS|JS|MI|NE|NS|PL|PN|PR|PS|SS|VS)T$/, Og = /[^\w\/:+-]+/, Rg = /^M(\d{2})(L?)$/, Ag = /* @__PURE__ */ Ie(cm), _s = /* @__PURE__ */ Ie(((e) => new St("en", {
  calendar: e,
  timeZone: Kt,
  era: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour12: 0
}))), od = {
  P: Nh,
  h: em,
  ee: Mm,
  ne: Im,
  te: km,
  fields: Cm,
  oe: _m,
  inLeapYear: om,
  monthsInYear: im,
  daysInMonth: am,
  daysInYear: sm,
  dayOfYear: ss,
  era(e) {
    return this.$(e)[0];
  },
  eraYear(e) {
    return this.$(e)[1];
  },
  monthCode(e) {
    const [t, r] = this.u(e), [n, o] = this.m(t, r);
    return tn(n, o);
  },
  dayOfWeek: Dl,
  daysInWeek: oh
}, Dg = {
  u: Da,
  $: Ml,
  m: El
}, Mg = {
  dayOfYear: ss,
  u: Da,
  M: vr
}, Ig = /* @__PURE__ */ Object.assign({}, Mg, {
  weekOfYear: hf,
  yearOfWeek: mf,
  I(e) {
    function t(h) {
      return (7 - h < n ? 7 : 0) - h;
    }
    function r(h) {
      const y = Al(p + h), m = h || 1, v = t(Br(c + y * m, 7));
      return f = (y + (v - u) * m) / 7;
    }
    const n = this.id ? 1 : 4, o = Dl(e), i = this.dayOfYear(e), a = Br(o - 1, 7), s = i - 1, c = Br(a - s, 7), u = t(c);
    let f, d = Math.floor((s - u) / 7) + 1, p = e.isoYear;
    return d ? d > r(0) && (d = 1, p++) : (d = r(-1), p--), [d, p, f];
  }
}), kg = /* @__PURE__ */ Object.assign({}, od, Ig, {
  u: Da,
  $: Ml,
  m: El,
  R: rh,
  L: Ma,
  F: Gp,
  O: Ol,
  q: tm,
  B: Rl,
  G: Al,
  U: nh,
  M: vr,
  p: Ph,
  year(e) {
    return e.isoYear;
  },
  month(e) {
    return e.isoMonth;
  },
  day: th
}), Cg = {
  u: go,
  $: Sf,
  m: xf
}, _g = {
  dayOfYear: ss,
  u: go,
  M: Hr
}, Fg = {
  I() {
    return [];
  }
}, Bg = /* @__PURE__ */ Object.assign({}, _g, Fg, {
  weekOfYear: hf,
  yearOfWeek: mf
}), Lg = /* @__PURE__ */ Object.assign({}, od, Bg, {
  u: go,
  $: Sf,
  m: xf,
  R: hm,
  L: pm,
  F: $n,
  O: qn,
  q: rm,
  B: jf,
  G: Pn,
  U: dm,
  M: Hr,
  p: Eh,
  year(e) {
    return this._(e).year;
  },
  month(e) {
    const { year: t, V: r } = this._(e), { X: n } = this.J(t);
    return n[r] + 1;
  },
  day: fm
}), No = /* @__PURE__ */ Nf(Dg, Cg), Y = /* @__PURE__ */ Nf(kg, Lg), $g = {
  era: kn,
  eraYear: je,
  year: je,
  month: pc,
  monthCode(e) {
    const t = kn(e);
    return cs(t), t;
  },
  day: pc
}, qg = /* @__PURE__ */ Er(ft, je), Ug = /* @__PURE__ */ Er(te, Na), zg = {
  offset(e) {
    const t = kn(e);
    return Gt(t), t;
  }
}, kc = /* @__PURE__ */ Object.assign({}, $g, qg, Ug, zg), Fs = /* @__PURE__ */ Q(ml, ft, ze), Yg = /* @__PURE__ */ Q(ml, ze, ft), Nt = "numeric", ln = ["timeZoneName"], id = {
  month: Nt,
  day: Nt
}, Bs = {
  year: Nt,
  month: Nt
}, Ls = /* @__PURE__ */ Object.assign({}, Bs, {
  day: Nt
}), $s = {
  hour: Nt,
  minute: Nt,
  second: Nt
}, qs = /* @__PURE__ */ Object.assign({}, Ls, $s), Zg = /* @__PURE__ */ Object.assign({}, qs, {
  timeZoneName: "short"
}), Wg = /* @__PURE__ */ Object.keys(Bs), Hg = /* @__PURE__ */ Object.keys(id), Vg = /* @__PURE__ */ Object.keys(Ls), Gg = /* @__PURE__ */ Object.keys($s), Us = ["dateStyle"], Jg = /* @__PURE__ */ Wg.concat(Us), Kg = /* @__PURE__ */ Hg.concat(Us), zs = /* @__PURE__ */ Vg.concat(Us, ["weekday"]), fn = /* @__PURE__ */ Gg.concat(["dayPeriod", "timeStyle", "fractionalSecondDigits"]), Ys = /* @__PURE__ */ zs.concat(fn), Qg = /* @__PURE__ */ ln.concat(fn), Xg = /* @__PURE__ */ ln.concat(zs), ev = /* @__PURE__ */ ln.concat(["day", "weekday"], fn), tv = /* @__PURE__ */ ln.concat(["year", "weekday"], fn), rv = /* @__PURE__ */ Jt(Ys, qs), nv = /* @__PURE__ */ Jt(Ys, Zg), ov = /* @__PURE__ */ Jt(Ys, qs, ln), iv = /* @__PURE__ */ Jt(zs, Ls, Qg), av = /* @__PURE__ */ Jt(fn, $s, Xg), sv = /* @__PURE__ */ Jt(Jg, Bs, ev), cv = /* @__PURE__ */ Jt(Kg, id, tv), uv = {}, ad = /* @__PURE__ */ ry(), sd = [rv, Ba], lv = [nv, Ba, 0, (e, t) => {
  const r = e.timeZone;
  if (t && t.timeZone !== r)
    throw new RangeError(Bf);
  return r;
}], cd = [ov, Se], ud = [iv, Se], ld = [av, (e) => Pt(e) / lt], fd = [sv, Se, ad], dd = [cv, Se, ad];
function Bt(e, t, r, n, o, i) {
  function a(...u) {
    if (!(this instanceof a))
      throw new TypeError(Qi);
    {
      const f = t(...u);
      Fc(this, f), ra(this, f, i);
    }
  }
  function s(u, f) {
    return Object.defineProperties((function(...d) {
      return u.call(this, c(this), ...d);
    }), Ur(f));
  }
  function c(u) {
    const f = Pe(u);
    if (!f || f.branding !== e)
      throw new TypeError(Qi);
    return f;
  }
  return Object.defineProperties(a.prototype, {
    ...Vp(st(s, r)),
    ...lr(st(s, n)),
    ...va("Temporal." + e)
  }), Object.defineProperties(a, {
    ...lr(o),
    ...Ur(e)
  }), [a, (u) => {
    const f = Object.create(a.prototype);
    return Fc(f, u), ra(f, u, i), f;
  }, c];
}
function Ar(e) {
  if (Pe(e) || e.calendar !== void 0 || e.timeZone !== void 0)
    throw new TypeError(yy);
  return e;
}
function ra(e, t, r) {
  ra.name === "dbg" && Object.defineProperty(e, "o", {
    value: r(t),
    writable: 0,
    enumerable: 0,
    configurable: 0
  });
}
function dn(e) {
  return pd(e) || K;
}
function pd(e) {
  const { calendar: t } = e;
  if (t !== void 0)
    return To(t);
}
function To(e) {
  if (Ne(e)) {
    const { calendar: t } = Pe(e) || {};
    if (!t)
      throw new TypeError(Cf(e));
    return t;
  }
  return ((t) => vo($h(ye(t))))(e);
}
function Zs(e) {
  const t = {};
  for (const r in e)
    t[r] = (n) => {
      const { calendar: o } = n;
      return Y(o)[r](n);
    };
  return t;
}
function Lt() {
  throw new TypeError(gy);
}
function Re(e) {
  if (Ne(e)) {
    const { timeZone: t } = Pe(e) || {};
    if (!t)
      throw new TypeError(Ff(e));
    return t;
  }
  return ((t) => ns(qh(ye(t))))(e);
}
function ue(e) {
  if (Ne(e)) {
    const t = Pe(e);
    return t && t.branding === Ms ? t : jm(e);
  }
  return Lh(e);
}
function Cr(e) {
  if (e !== void 0) {
    if (Ne(e)) {
      const t = Pe(e) || {};
      switch (t.branding) {
        case Ft:
        case un:
          return t;
        case Rr:
          return ut(t);
      }
      const r = dn(e);
      return {
        ...mm(Re, H, Y(r), e),
        calendar: r
      };
    }
    return Ih(e);
  }
}
function mt(e, t) {
  if (Ne(e)) {
    const n = Pe(e) || {};
    switch (n.branding) {
      case As:
        return ee(t), n;
      case Rr:
        return ee(t), et(n);
      case Ft:
        return ee(t), Rf(H, n);
    }
    return xm(e, t);
  }
  const r = Bh(e);
  return ee(t), r;
}
function Ws(e) {
  return e === void 0 ? void 0 : mt(e);
}
function er(e, t) {
  if (Ne(e)) {
    const n = Pe(e) || {};
    switch (n.branding) {
      case Rr:
        return ee(t), n;
      case un:
        return ee(t), Ue({
          ...n,
          ...Me
        });
      case Ft:
        return ee(t), Ef(H, n);
    }
    return gm(Y(dn(e)), e, t);
  }
  const r = Ch(e);
  return ee(t), r;
}
function Cc(e, t) {
  if (Ne(e)) {
    const n = Pe(e);
    if (n && n.branding === Rs)
      return ee(t), n;
    const o = pd(e);
    return wm(Y(o || K), !o, e, t);
  }
  const r = Fh(Y, e);
  return ee(t), r;
}
function tr(e, t) {
  if (Ne(e)) {
    const n = Pe(e);
    return n && n.branding === Os ? (ee(t), n) : bm(Y(dn(e)), e, t);
  }
  const r = _h(Y, e);
  return ee(t), r;
}
function rr(e, t) {
  if (Ne(e)) {
    const n = Pe(e) || {};
    switch (n.branding) {
      case un:
        return ee(t), n;
      case Rr:
        return ee(t), ut(n);
      case Ft:
        return ee(t), Of(H, n);
    }
    return vm(Y(dn(e)), e, t);
  }
  const r = Ja(e);
  return ee(t), r;
}
function nr(e, t) {
  if (Ne(e)) {
    const r = Pe(e);
    if (r && r.branding === Ft)
      return eo(t), r;
    const n = dn(e);
    return ym(Re, H, Y(n), n, e, t);
  }
  return kh(e, t);
}
function _c(e) {
  return st(((t) => (r) => t(na(r))), e);
}
function na(e) {
  return _e(e, H);
}
function or(e) {
  if (Ne(e)) {
    const t = Pe(e);
    if (t)
      switch (t.branding) {
        case Ds:
          return t;
        case Ft:
          return ct(t.epochNanoseconds);
      }
  }
  return Mh(e);
}
function fv() {
  function e(i, a) {
    return new t(i, a);
  }
  function t(i, a = /* @__PURE__ */ Object.create(null)) {
    Zn.set(this, ((s, c) => {
      const u = new St(s, c), f = u.resolvedOptions(), d = f.locale, p = $e(Object.keys(c), f), h = Ie(hv), y = (m, ...v) => {
        if (m) {
          if (v.length !== 2)
            throw new TypeError(Bo);
          for (const R of v)
            if (R === void 0)
              throw new TypeError(Bo);
        }
        m || v[0] !== void 0 || (v = []);
        const P = v.map(((R) => Pe(R) || Number(R)));
        let T, E = 0;
        for (const R of P) {
          const C = typeof R == "object" ? R.branding : void 0;
          if (E++ && C !== T)
            throw new TypeError(Bo);
          T = C;
        }
        return T ? h(T)(d, p, ...P) : [u, ...P];
      };
      return y.i = u, y;
    })(i, a));
  }
  const r = St.prototype, n = Object.getOwnPropertyDescriptors(r), o = Object.getOwnPropertyDescriptors(St);
  for (const i in n) {
    const a = n[i], s = i.startsWith("format") && dv(i);
    typeof a.value == "function" ? a.value = i === "constructor" ? e : s || pv(i) : s && (a.get = function() {
      if (!Zn.has(this))
        throw new TypeError(Qi);
      return (...c) => s.apply(this, c);
    }, Object.defineProperties(a.get, Ur(`get ${i}`)));
  }
  return o.prototype.value = t.prototype = Object.create({}, n), Object.defineProperties(e, o), e;
}
function dv(e) {
  return Object.defineProperties((function(...t) {
    const r = Zn.get(this), [n, ...o] = r(e.includes("Range"), ...t);
    return n[e](...o);
  }), Ur(e));
}
function pv(e) {
  return Object.defineProperties((function(...t) {
    return Zn.get(this).i[e](...t);
  }), Ur(e));
}
function hv(e) {
  const t = wv[e];
  if (!t)
    throw new TypeError(Cy(e));
  return kt(t, Ie(Af), 1);
}
const Yn = /* @__PURE__ */ new WeakMap(), Pe = /* @__PURE__ */ Yn.get.bind(Yn), Fc = /* @__PURE__ */ Yn.set.bind(Yn), hd = {
  era: Jp,
  eraYear: bl,
  year: wa,
  month: rt,
  daysInMonth: rt,
  daysInYear: rt,
  inLeapYear: qy,
  monthsInYear: rt
}, Hs = {
  monthCode: ye
}, md = {
  day: rt
}, mv = {
  dayOfWeek: rt,
  dayOfYear: rt,
  weekOfYear: Kp,
  yearOfWeek: bl,
  daysInWeek: rt
}, Vs = /* @__PURE__ */ Zs(/* @__PURE__ */ Object.assign({}, hd, Hs, md, mv)), yv = /* @__PURE__ */ Zs({
  ...hd,
  ...Hs
}), gv = /* @__PURE__ */ Zs({
  ...Hs,
  ...md
}), pn = {
  calendarId: (e) => e.calendar
}, vv = /* @__PURE__ */ Vn(((e) => (t) => t[e]), te.concat("sign")), Gs = /* @__PURE__ */ Vn(((e, t) => (r) => r[ze[t]]), ft), yd = {
  epochMilliseconds: Ba,
  epochNanoseconds: sh
}, [bv, se] = Bt(Ms, Ym, {
  ...vv,
  blank: Ah
}, {
  with: (e, t) => se(Rm(e, t)),
  negated: (e) => se(Ga(e)),
  abs: (e) => se(Rh(e)),
  add: (e, t, r) => se(Sc(Cr, Y, H, 0, e, ue(t), r)),
  subtract: (e, t, r) => se(Sc(Cr, Y, H, 1, e, ue(t), r)),
  round: (e, t) => se(Oh(Cr, Y, H, e, t)),
  total: (e, t) => ch(Cr, Y, H, e, t),
  toLocaleString(e, t, r) {
    return Intl.DurationFormat ? new Intl.DurationFormat(t, r).format(this) : jn(e);
  },
  toString: jn,
  toJSON: (e) => jn(e),
  valueOf: Lt
}, {
  from: (e) => se(ue(e)),
  compare: (e, t, r) => zh(Cr, Y, H, ue(e), ue(t), r)
}, jn), wv = {
  Instant: sd,
  PlainDateTime: cd,
  PlainDate: ud,
  PlainTime: ld,
  PlainYearMonth: fd,
  PlainMonthDay: dd
}, xv = /* @__PURE__ */ kt(sd), jv = /* @__PURE__ */ kt(lv), Sv = /* @__PURE__ */ kt(cd), Nv = /* @__PURE__ */ kt(ud), Tv = /* @__PURE__ */ kt(ld), Pv = /* @__PURE__ */ kt(fd), Ev = /* @__PURE__ */ kt(dd), [Ov, bt] = Bt(As, zm, Gs, {
  with(e, t, r) {
    return bt(Om(this, Ar(t), r));
  },
  add: (e, t) => bt(jc(0, e, ue(t))),
  subtract: (e, t) => bt(jc(1, e, ue(t))),
  until: (e, t, r) => se(Dc(0, e, mt(t), r)),
  since: (e, t, r) => se(Dc(1, e, mt(t), r)),
  round: (e, t) => bt(ph(e, t)),
  equals: (e, t) => Jh(e, mt(t)),
  toLocaleString(e, t, r) {
    const [n, o] = Tv(t, r, e);
    return n.format(o);
  },
  toString: Co,
  toJSON: (e) => Co(e),
  valueOf: Lt
}, {
  from: (e, t) => bt(mt(e, t)),
  compare: (e, t) => is(mt(e), mt(t))
}, Co), [Rv, We] = Bt(Rr, Q(Lm, rn), {
  ...pn,
  ...Vs,
  ...Gs
}, {
  with: (e, t, r) => We(Nm(Y, e, Ar(t), r)),
  withCalendar: (e, t) => We(ds(e, To(t))),
  withPlainTime: (e, t) => We(iy(e, Ws(t))),
  add: (e, t, r) => We(bc(Y, 0, e, ue(t), r)),
  subtract: (e, t, r) => We(bc(Y, 1, e, ue(t), r)),
  until: (e, t, r) => se(Oc(Y, 0, e, er(t), r)),
  since: (e, t, r) => se(Oc(Y, 1, e, er(t), r)),
  round: (e, t) => We(dh(e, t)),
  equals: (e, t) => Wh(e, er(t)),
  toZonedDateTime: (e, t, r) => ve(Hm(H, e, Re(t), r)),
  toPlainDate: (e) => He(ut(e)),
  toPlainTime: (e) => bt(et(e)),
  toLocaleString(e, t, r) {
    const [n, o] = Sv(t, r, e);
    return n.format(o);
  },
  toString: Do,
  toJSON: (e) => Do(e),
  valueOf: Lt
}, {
  from: (e, t) => We(er(e, t)),
  compare: (e, t) => sf(er(e), er(t))
}, Do), [Av, oa] = Bt(Rs, Q(Um, rn), {
  ...pn,
  ...gv
}, {
  with: (e, t, r) => oa(Em(Y, e, Ar(t), r)),
  equals: (e, t) => Gh(e, Cc(t)),
  toPlainDate(e, t) {
    return He(Xm(Y, e, this, t));
  },
  toLocaleString(e, t, r) {
    const [n, o] = Ev(t, r, e);
    return n.format(o);
  },
  toString: ko,
  toJSON: (e) => ko(e),
  valueOf: Lt
}, {
  from: (e, t) => oa(Cc(e, t))
}, ko), [Dv, Fr] = Bt(Os, Q(qm, rn), {
  ...pn,
  ...yv
}, {
  with: (e, t, r) => Fr(Pm(Y, e, Ar(t), r)),
  add: (e, t, r) => Fr(xc(Y, 0, e, ue(t), r)),
  subtract: (e, t, r) => Fr(xc(Y, 1, e, ue(t), r)),
  until: (e, t, r) => se(Ac(Y, 0, e, tr(t), r)),
  since: (e, t, r) => se(Ac(Y, 1, e, tr(t), r)),
  equals: (e, t) => Vh(e, tr(t)),
  toPlainDate(e, t) {
    return He(Qm(Y, e, this, t));
  },
  toLocaleString(e, t, r) {
    const [n, o] = Pv(t, r, e);
    return n.format(o);
  },
  toString: Io,
  toJSON: (e) => Io(e),
  valueOf: Lt
}, {
  from: (e, t) => Fr(tr(e, t)),
  compare: (e, t) => Tr(tr(e), tr(t))
}, Io), [Mv, He] = Bt(un, Q($m, rn), {
  ...pn,
  ...Vs
}, {
  with: (e, t, r) => He(Tm(Y, e, Ar(t), r)),
  withCalendar: (e, t) => He(ds(e, To(t))),
  add: (e, t, r) => He(wc(Y, 0, e, ue(t), r)),
  subtract: (e, t, r) => He(wc(Y, 1, e, ue(t), r)),
  until: (e, t, r) => se(Rc(Y, 0, e, rr(t), r)),
  since: (e, t, r) => se(Rc(Y, 1, e, rr(t), r)),
  equals: (e, t) => Hh(e, rr(t)),
  toZonedDateTime(e, t) {
    const r = Ne(t) ? t : {
      timeZone: t
    };
    return ve(Vm(Re, mt, H, e, r));
  },
  toPlainDateTime: (e, t) => We(Gm(e, Ws(t))),
  toPlainYearMonth(e) {
    return Fr(Jm(Y, e, this));
  },
  toPlainMonthDay(e) {
    return oa(Km(Y, e, this));
  },
  toLocaleString(e, t, r) {
    const [n, o] = Nv(t, r, e);
    return n.format(o);
  },
  toString: Mo,
  toJSON: (e) => Mo(e),
  valueOf: Lt
}, {
  from: (e, t) => He(rr(e, t)),
  compare: (e, t) => Tr(rr(e), rr(t))
}, Mo), [Iv, ve] = Bt(Ft, Q(Bm, rn, Uh), {
  ...yd,
  ...pn,
  ..._c(Vs),
  ..._c(Gs),
  offset: (e) => Xr(na(e).offsetNanoseconds),
  offsetNanoseconds: (e) => na(e).offsetNanoseconds,
  timeZoneId: (e) => e.timeZone,
  hoursInDay: (e) => hh(H, e)
}, {
  with: (e, t, r) => ve(Sm(Y, H, e, Ar(t), r)),
  withCalendar: (e, t) => ve(ds(e, To(t))),
  withTimeZone: (e, t) => ve(ay(e, Re(t))),
  withPlainTime: (e, t) => ve(oy(H, e, Ws(t))),
  add: (e, t, r) => ve(vc(Y, H, 0, e, ue(t), r)),
  subtract: (e, t, r) => ve(vc(Y, H, 1, e, ue(t), r)),
  until: (e, t, r) => se(fe(Ec(Y, H, 0, e, nr(t), r))),
  since: (e, t, r) => se(fe(Ec(Y, H, 1, e, nr(t), r))),
  round: (e, t) => ve(fh(H, e, t)),
  startOfDay: (e) => ve(mh(H, e)),
  equals: (e, t) => Zh(e, nr(t)),
  toInstant: (e) => yt(Wm(e)),
  toPlainDateTime: (e) => We(Ef(H, e)),
  toPlainDate: (e) => He(Of(H, e)),
  toPlainTime: (e) => bt(Rf(H, e)),
  toLocaleString(e, t, r = {}) {
    const [n, o] = jv(t, r, e);
    return n.format(o);
  },
  toString: (e, t) => Ao(H, e, t),
  toJSON: (e) => Ao(H, e),
  valueOf: Lt,
  getTimeZoneTransition(e, t) {
    const { timeZone: r, epochNanoseconds: n } = e, o = ah(t), i = H(r).l(n, o);
    return i ? ve({
      ...e,
      epochNanoseconds: i
    }) : null;
  }
}, {
  from: (e, t) => ve(nr(e, t)),
  compare: (e, t) => af(nr(e), nr(t))
}, ((e) => Ao(H, e))), [kv, yt] = Bt(Ds, Fm, yd, {
  add: (e, t) => yt(gc(0, e, ue(t))),
  subtract: (e, t) => yt(gc(1, e, ue(t))),
  until: (e, t, r) => se(Pc(0, e, or(t), r)),
  since: (e, t, r) => se(Pc(1, e, or(t), r)),
  round: (e, t) => yt(lh(e, t)),
  equals: (e, t) => Yh(e, or(t)),
  toZonedDateTimeISO: (e, t) => ve(Zm(e, Re(t))),
  toLocaleString(e, t, r) {
    const [n, o] = xv(t, r, e);
    return n.format(o);
  },
  toString: (e, t) => Ro(Re, H, e, t),
  toJSON: (e) => Ro(Re, H, e),
  valueOf: Lt
}, {
  from: (e) => yt(or(e)),
  fromEpochMilliseconds: (e) => yt(ey(e)),
  fromEpochNanoseconds: (e) => yt(ty(e)),
  compare: (e, t) => of(or(e), or(t))
}, ((e) => Ro(Re, H, e))), Cv = /* @__PURE__ */ Object.defineProperties({}, {
  ...va("Temporal.Now"),
  ...lr({
    timeZoneId: () => Ir(),
    instant: () => yt(ct(Ki())),
    zonedDateTimeISO: (e = Ir()) => ve(qe(Ki(), Re(e), K)),
    plainDateTimeISO: (e = Ir()) => We(Ue(Fo(H(Re(e))), K)),
    plainDateISO: (e = Ir()) => He(ut(Fo(H(Re(e))), K)),
    plainTimeISO: (e = Ir()) => bt(et(Fo(H(Re(e)))))
  })
}), cr = /* @__PURE__ */ Object.defineProperties({}, {
  ...va("Temporal"),
  ...lr({
    PlainYearMonth: Dv,
    PlainMonthDay: Av,
    PlainDate: Mv,
    PlainTime: Ov,
    PlainDateTime: Rv,
    ZonedDateTime: Iv,
    Instant: kv,
    Duration: bv,
    Now: Cv
  })
}), _v = /* @__PURE__ */ fv(), Zn = /* @__PURE__ */ new WeakMap();
Object.create(Intl), lr({
  DateTimeFormat: _v
});
function pr(e) {
  return `'${e.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}
const Fv = /^(\d{4})-(\d{2})-(\d{2})$/, Bv = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/;
function Bc(e, t) {
  try {
    if (Fv.test(e))
      return cr.PlainDate.from(e).toString();
    const r = Bv.test(e) ? `${e.replace(" ", "T")}Z` : e;
    return cr.Instant.from(r).toZonedDateTimeISO(t).toPlainDate().toString();
  } catch {
    return null;
  }
}
function Lv(e) {
  return cr.Now.zonedDateTimeISO(e).toPlainDate().toString();
}
function $v(e, t) {
  let r;
  try {
    r = cr.PlainDate.from(e);
  } catch {
    throw new Error(`Invalid filter date: ${e}`);
  }
  try {
    const n = r.toPlainDateTime(cr.PlainTime.from("00:00:00")).toZonedDateTime(t).toInstant(), o = r.toPlainDateTime(cr.PlainTime.from("23:59:59.999")).toZonedDateTime(t).toInstant();
    return {
      start: n.toString({ fractionalSecondDigits: 3 }),
      end: o.toString({ fractionalSecondDigits: 3 })
    };
  } catch {
    throw new Error(`Invalid timezone: ${t}`);
  }
}
function qv(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e) && !(e instanceof RegExp);
}
function Uv(e) {
  const t = Object.keys(e);
  if (t.length !== 1)
    return;
  const [r] = t;
  if (!r.startsWith("$"))
    return r;
}
function Po(e) {
  const t = Uv(e);
  if (!t)
    return;
  const r = e[t];
  if (qv(r)) {
    const n = Object.entries(r);
    if (n.length !== 1)
      return;
    const [o, i] = n[0];
    return { field: t, operator: o, value: i };
  }
  return {
    field: t,
    operator: "$eq",
    value: r
  };
}
const zv = {
  $eq: "is",
  $ne: "is-not"
}, Yv = {
  $lt: "is-less",
  $lte: "is-or-less",
  $gt: "is-greater",
  $gte: "is-or-greater"
}, Zv = {
  contains: "~",
  "does-not-contain": "-~",
  "starts-with": "~^",
  "does-not-start-with": "-~^",
  "ends-with": "~$",
  "does-not-end-with": "-~$"
}, Wv = {
  "is-less": "<",
  "is-or-less": "<=",
  "is-greater": ">",
  "is-or-greater": ">="
}, Hv = /^[A-Za-z0-9_.-]+$/;
function hr(e, t) {
  return e?.field ?? t;
}
function Lc(e, t) {
  return typeof e == "string" ? t?.quoteStrings || e.startsWith("-") || !Hv.test(e) ? pr(e) : e : String(e);
}
function $c(e, t = !1) {
  const r = e.source, n = r.startsWith("^"), o = r.endsWith("$");
  return n && o ? t ? "does-not-contain" : "contains" : n ? t ? "does-not-start-with" : "starts-with" : o ? t ? "does-not-end-with" : "ends-with" : t ? "does-not-contain" : "contains";
}
function qc(e) {
  let t = e.source;
  return t.startsWith("^") && (t = t.slice(1)), t.endsWith("$") && (t = t.slice(0, -1)), t.replace(/\\([\\.^$|?*+()[\]{}\/-])/g, "$1");
}
function qo(e) {
  return {
    parse(t, r) {
      const n = Po(t), o = hr(e, r.key);
      if (!n || n.field !== o)
        return null;
      const i = zv[n.operator];
      return i ? {
        field: r.key,
        operator: i,
        values: [n.value]
      } : null;
    },
    serialize(t, r) {
      const n = t.values[0], o = hr(e, r.key);
      return n == null || n === "" ? null : t.operator === "is" ? [`${o}:${Lc(n, e)}`] : t.operator === "is-not" ? [`${o}:-${Lc(n, e)}`] : null;
    }
  };
}
function Vv(e) {
  return {
    parse(t, r) {
      const n = Po(t), o = hr(e, r.key);
      return !n || n.field !== o ? null : n.operator === "$eq" && typeof n.value == "string" ? {
        field: r.key,
        operator: "is",
        values: [n.value]
      } : n.operator === "$regex" && n.value instanceof RegExp ? {
        field: r.key,
        operator: $c(n.value),
        values: [qc(n.value)]
      } : n.operator === "$not" && n.value instanceof RegExp ? {
        field: r.key,
        operator: $c(n.value, !0),
        values: [qc(n.value)]
      } : null;
    },
    serialize(t, r) {
      const n = t.values[0], o = hr(e, r.key);
      if (typeof n != "string" || n === "")
        return null;
      if (t.operator === "is")
        return [`${o}:${pr(n)}`];
      const i = Zv[t.operator];
      return i ? [`${o}:${i}${pr(n)}`] : null;
    }
  };
}
function Gv(e) {
  if (!e || typeof e != "object")
    return !1;
  const t = e.$relativeDate;
  if (!t || typeof t != "object")
    return !1;
  const { op: r, amount: n, unit: o } = t;
  return (r === "sub" || r === "add") && typeof n == "number" && Number.isSafeInteger(n) && n > 0 && typeof o == "string";
}
function Jv(e) {
  return {
    parse(t, r) {
      const n = Po(t), o = hr(e, r.key);
      if (!n || n.field !== o)
        return null;
      if (Gv(n.value) && n.value.$relativeDate.unit === "days") {
        const { op: s, amount: c } = n.value.$relativeDate, u = s === "sub" && n.operator === "$gte", f = s === "add" && n.operator === "$lte";
        if (u || f)
          return {
            field: r.key,
            operator: u ? "in-the-last" : "in-the-next",
            values: [c]
          };
      }
      if (typeof n.value != "string")
        return null;
      const i = Yv[n.operator], a = Bc(n.value, r.timezone);
      return !i || !a ? null : {
        field: r.key,
        operator: i,
        values: [a]
      };
    },
    serialize(t, r) {
      const n = hr(e, r.key);
      if (t.operator === "in-the-last" || t.operator === "in-the-next") {
        const f = t.values[0];
        if (typeof f != "number" || !Number.isSafeInteger(f) || f <= 0)
          return null;
        const d = t.operator === "in-the-last" ? "-" : "+", p = t.operator === "in-the-last" ? ">=" : "<=";
        return [`${n}:${p}now${d}${f}d`];
      }
      const o = t.values[0];
      if (typeof o != "string" || o === "")
        return null;
      const i = Bc(o, r.timezone);
      if (!i)
        return null;
      const { start: a, end: s } = $v(i, r.timezone), c = Wv[t.operator];
      if (c === void 0)
        return null;
      const u = t.operator === "is-less" || t.operator === "is-or-greater" ? a : s;
      return [`${n}:${c}'${u}'`];
    }
  };
}
const Kv = {
  parse(e, t) {
    const r = Po(e);
    return !r || r.field !== "count.reports" ? null : r.operator === "$eq" && r.value === 0 ? {
      field: t.key,
      operator: "is",
      values: ["false"]
    } : r.operator === "$gt" && r.value === 0 ? {
      field: t.key,
      operator: "is",
      values: ["true"]
    } : null;
  },
  serialize(e) {
    const t = e.values[0];
    return e.operator !== "is" ? null : t === "true" ? ["count.reports:>0"] : t === "false" ? ["count.reports:0"] : null;
  }
}, hn = {
  status: {
    operators: ["is"],
    ui: {
      label: "Status",
      type: "select",
      searchable: !1,
      hideOperatorSelect: !0
    },
    options: [
      { value: "published", label: "Published" },
      { value: "hidden", label: "Hidden" }
    ],
    codec: qo()
  },
  created_at: Lp({
    operators: kp,
    ui: {
      label: "Date",
      defaultOperator: _p,
      type: "date"
    },
    codec: Jv()
  }),
  body: {
    operators: ["contains", "does-not-contain"],
    parseKeys: ["html"],
    ui: {
      label: "Text",
      type: "text",
      placeholder: "Search comment text...",
      defaultOperator: "contains",
      className: "w-full max-w-48",
      popoverContentClassName: "w-full max-w-48"
    },
    codec: Vv({ field: "html" })
  },
  post: {
    operators: ["is", "is-not"],
    parseKeys: ["post_id"],
    ui: {
      label: "Post",
      type: "select",
      searchable: !0,
      className: "w-full max-w-80",
      popoverContentClassName: "w-full max-w-[calc(100vw-32px)] max-w-80"
    },
    codec: qo({ field: "post_id" })
  },
  author: {
    operators: ["is", "is-not"],
    parseKeys: ["member_id"],
    ui: {
      label: "Author",
      type: "select",
      searchable: !0,
      className: "w-80",
      popoverContentClassName: "w-80"
    },
    codec: qo({ field: "member_id" })
  },
  reported: {
    operators: ["is"],
    parseKeys: ["count.reports"],
    ui: {
      label: "Reported",
      type: "select",
      searchable: !1,
      hideOperatorSelect: !0
    },
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" }
    ],
    codec: Kv
  }
};
function Qv(e, t = {}) {
  const r = t.labels || {};
  return e.map((n) => ({
    value: n,
    label: r[n] ?? n.replaceAll("-", " ")
  }));
}
const Xv = ["author", "post", "body", "status", "reported", "created_at"], eb = {
  ...Cp,
  ...Fp
};
function tb(e) {
  switch (e) {
    case "author":
      return ht.createElement(sl, { className: "size-4" });
    case "post":
      return ht.createElement(Xd, { className: "size-4" });
    case "body":
      return ht.createElement(Qd, { className: "size-4" });
    case "status":
      return ht.createElement(op, { className: "size-4" });
    case "reported":
      return ht.createElement(la, { className: "size-4" });
    case "created_at":
      return ht.createElement(Kd, { className: "size-4" });
    default:
      return;
  }
}
function rb({
  postValueSource: e,
  memberValueSource: t,
  siteTimezone: r = "UTC"
}) {
  return be(() => {
    const n = Lv(r);
    return Xv.map((o) => {
      const i = hn[o], a = o === "created_at" ? {
        defaultValue: n,
        ...Bp(i) ? { customRenderer: $p(n) } : {}
      } : {};
      return {
        key: o,
        ...i.ui,
        icon: tb(o),
        operators: Qv(i.operators, { labels: eb }),
        ..."options" in i && i.options ? { options: i.options } : {},
        ...a,
        ...o === "author" ? { valueSource: t } : {},
        ...o === "post" ? { valueSource: e } : {}
      };
    });
  }, [t, e, r]);
}
const nb = "MembersResponseType", ob = yr({
  method: "POST",
  path: ({ id: e }) => `/members/${e}/commenting/disable`,
  body: ({ reason: e, hideComments: t }) => ({
    reason: e,
    hide_comments: t
  }),
  invalidateQueries: {
    dataType: "CommentsResponseType"
  }
}), ib = yr({
  method: "POST",
  path: ({ id: e }) => `/members/${e}/commenting/enable`,
  body: () => ({}),
  invalidateQueries: {
    dataType: "CommentsResponseType"
  }
}), ab = da({
  dataType: nb,
  path: "/members/",
  defaultSearchParams: {
    include: "labels,tiers",
    limit: "100",
    order: "created_at desc"
  },
  defaultNextPageParams: (e, t) => {
    if (e.meta?.pagination.next)
      return {
        ...t,
        page: e.meta.pagination.next.toString()
      };
  },
  returnData: (e) => {
    const { pages: t } = e, r = t.flatMap((o) => o.members), n = t[t.length - 1].meta;
    return {
      members: r,
      meta: n,
      isEnd: n ? n.pagination.pages === n.pagination.page : !0
    };
  }
});
function sb(e, t) {
  if (t.length !== 0)
    return `${e}:[${t.map((r) => pr(r)).join(",")}]`;
}
function Wn(...e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    if (r)
      for (const n of r)
        t.has(n.value) || t.set(n.value, n);
  return [...t.values()];
}
function cb(e, t, r, n) {
  var o = this, i = ie(null), a = ie(0), s = ie(0), c = ie(null), u = ie([]), f = ie(), d = ie(), p = ie(e), h = ie(!0), y = ie(), m = ie();
  p.current = e;
  var v = typeof window < "u", P = !t && t !== 0 && v;
  if (typeof e != "function") throw new TypeError("Expected a function");
  t = +t || 0;
  var T = !!(r = r || {}).leading, E = !("trailing" in r) || !!r.trailing, R = !!r.flushOnExit && E, C = "maxWait" in r, _ = "debounceOnServer" in r && !!r.debounceOnServer, M = C ? Math.max(+r.maxWait || 0, t) : null, Z = be(function() {
    var $ = function(A) {
      var S = u.current, oe = f.current;
      return u.current = f.current = null, a.current = A, s.current = s.current || A, d.current = p.current.apply(oe, S);
    }, G = function(A, S) {
      P && cancelAnimationFrame(c.current), c.current = P ? requestAnimationFrame(A) : setTimeout(A, S);
    }, B = function(A) {
      if (!h.current) return !1;
      var S = A - i.current;
      return !i.current || S >= t || S < 0 || C && A - a.current >= M;
    }, N = function(A) {
      return c.current = null, E && u.current ? $(A) : (u.current = f.current = null, d.current);
    }, j = function A() {
      var S = Date.now();
      if (T && s.current === a.current && D(), B(S)) return N(S);
      if (h.current) {
        var oe = t - (S - i.current), J = C ? Math.min(oe, M - (S - a.current)) : oe;
        G(A, J);
      }
    }, D = function() {
      n && n({});
    }, k = function() {
      if (v || _) {
        var A, S = Date.now(), oe = B(S);
        if (u.current = [].slice.call(arguments), f.current = o, i.current = S, R && !y.current && (y.current = function() {
          var J;
          ((J = globalThis.document) == null ? void 0 : J.visibilityState) === "hidden" && m.current.flush();
        }, (A = globalThis.document) == null || A.addEventListener == null || A.addEventListener("visibilitychange", y.current)), oe) {
          if (!c.current && h.current) return a.current = i.current, G(j, t), T ? $(i.current) : d.current;
          if (C) return G(j, t), $(i.current);
        }
        return c.current || G(j, t), d.current;
      }
    };
    return k.cancel = function() {
      var A = c.current;
      A && (P ? cancelAnimationFrame(c.current) : clearTimeout(c.current)), a.current = 0, u.current = i.current = f.current = c.current = null, A && n && n({});
    }, k.isPending = function() {
      return !!c.current;
    }, k.flush = function() {
      return c.current ? N(Date.now()) : d.current;
    }, k;
  }, [T, C, t, M, E, R, P, v, _, n]);
  return m.current = Z, Fe(function() {
    return h.current = !0, function() {
      var $;
      R && m.current.flush(), y.current && (($ = globalThis.document) == null || $.removeEventListener == null || $.removeEventListener("visibilitychange", y.current), y.current = null), h.current = !1;
    };
  }, [R]), Z;
}
function ub(e, t) {
  return e === t;
}
function lb(e, t, r) {
  var n = ub, o = ie(e), i = xe({})[1], a = cb(ur(function(c) {
    o.current = c, i({});
  }, [i]), t, r, i), s = ie(e);
  return n(s.current, e) || (a(e), s.current = e), [o.current, a];
}
const Uc = () => {
};
function fb(e, t, r) {
  return r ? e.flatMap((n) => t.some((i) => i.value === n) ? [] : [r(n)]) : [];
}
function db(e) {
  return function(r = {}) {
    const { enabled: n = !0 } = r, o = () => {
      const a = e.useBrowse("", { enabled: !0 }), s = be(() => (a.data || []).map(e.toOption), [a.data]);
      return {
        items: a.data,
        options: s,
        isLoading: a.isLoading,
        pagination: a.pagination
      };
    }, i = ({ query: a, selectedValues: s }) => {
      const [c] = lb(a, e.debounceMs ?? 200), u = e.useBrowse(c, { enabled: n }), f = e.useHydrate?.(s, { enabled: n }), d = be(() => (u.data || []).map(e.toOption), [u.data]), p = be(() => (f?.data || []).map(e.toOption), [f?.data]), h = be(() => Wn(p, d), [p, d]), y = be(() => fb(
        s,
        h,
        e.getMissingSelectedOption
      ), [h, s]);
      return n ? {
        options: Wn(y, h),
        isInitialLoad: u.isLoading && h.length === 0,
        isSearching: !u.isLoading && u.isRefreshing && !u.isLoadingMore,
        isLoadingMore: u.isLoadingMore,
        hasMore: u.hasMore,
        loadMore: u.loadMore ?? Uc
      } : {
        options: [],
        isInitialLoad: !1,
        isSearching: !1,
        isLoadingMore: !1,
        hasMore: !1,
        loadMore: Uc
      };
    };
    return {
      id: e.id,
      useInitialBrowse: o,
      useOptions: i
    };
  };
}
function pb(e) {
  return { filter: e };
}
function hb(e) {
  return sb("id", e);
}
function zc(e) {
  return {
    limit: "100",
    ...e
  };
}
function Js({
  id: e,
  buildBrowseSearchParams: t,
  buildHydrateSearchParams: r = pb,
  buildHydrateFilter: n = hb,
  debounceMs: o,
  selectItems: i,
  toOption: a,
  getMissingSelectedOption: s,
  useQuery: c
}) {
  return db({
    id: e,
    useBrowse: (u, f) => {
      const d = c({
        enabled: f.enabled ?? !0,
        searchParams: zc(t(u))
      });
      return {
        data: i(d.data),
        isLoading: d.isLoading,
        isRefreshing: d.isFetching,
        isLoadingMore: d.isFetchingNextPage,
        hasMore: !!d.hasNextPage,
        loadMore: d.fetchNextPage,
        pagination: d.data?.meta?.pagination
      };
    },
    useHydrate: (u, f) => {
      const d = n(u), p = {};
      typeof d == "string" && Object.assign(p, zc(r(d)));
      const y = c({
        enabled: (f.enabled ?? !0) && u.length > 0,
        searchParams: p
      });
      return {
        data: i(y.data),
        isLoading: y.isLoading
      };
    },
    toOption: a,
    getMissingSelectedOption: s,
    debounceMs: o
  });
}
function mb(e) {
  return {
    value: e.id,
    label: e.name || "Unknown name",
    detail: e.email ?? "(Unknown email)"
  };
}
const yb = Js({
  id: "posts.members.remote",
  buildBrowseSearchParams: (e) => ({
    limit: "100",
    order: "created_at DESC",
    ...e ? { search: e } : {}
  }),
  getMissingSelectedOption: (e) => ({
    value: e,
    label: `ID: ${e}`
  }),
  selectItems: (e) => e?.members,
  useQuery: ({ enabled: e, searchParams: t }) => ab({
    enabled: e,
    keepPreviousData: !0,
    searchParams: t
  }),
  toOption: mb
});
function gb() {
  return yb();
}
const vb = "PagesResponseType", bb = da({
  dataType: vb,
  path: "/pages/",
  defaultNextPageParams: (e, t) => {
    if (e.meta?.pagination.next)
      return {
        ...t,
        page: e.meta.pagination.next.toString()
      };
  },
  returnData: (e) => {
    const { pages: t } = e, r = t.flatMap((o) => o.pages), n = t[t.length - 1].meta;
    return {
      pages: r,
      meta: n,
      isEnd: n ? n.pagination.pages === n.pagination.page : !0
    };
  }
});
function wb(e, t, r) {
  return function(o) {
    const i = e(o), a = t(o), s = ur(({ query: c, selectedValues: u }) => {
      const f = i.useOptions({ query: c, selectedValues: u }), d = a.useOptions({ query: c, selectedValues: u }), p = Wn(f.options, d.options), h = r ? u.flatMap((y) => p.some((v) => v.value === y) ? [] : [r(y)]) : [];
      return {
        options: Wn(p, h),
        isInitialLoad: f.options.length === 0 && d.options.length === 0 && (f.isInitialLoad || d.isInitialLoad),
        isSearching: f.isSearching || d.isSearching,
        isLoadingMore: f.isLoadingMore || d.isLoadingMore,
        hasMore: f.hasMore || d.hasMore,
        loadMore: () => {
          f.hasMore && f.loadMore(), d.hasMore && d.loadMore();
        }
      };
    }, [i, a]);
    return be(() => ({
      id: `${i.id}+${a.id}`,
      useOptions: s
    }), [i.id, a.id, s]);
  };
}
function xb(e) {
  return e ? `status:published+title:~${pr(e)}` : "status:published";
}
function jb(e) {
  return {
    value: e.id,
    label: e.title
  };
}
function Sb(e) {
  return {
    value: e.id,
    label: e.title,
    detail: "Page"
  };
}
const gd = (e) => ({
  filter: xb(e),
  limit: "25",
  fields: "id,title",
  order: "published_at DESC"
}), vd = (e) => ({
  fields: "id,title",
  filter: e
}), Nb = Js({
  id: "posts.published.remote",
  buildBrowseSearchParams: gd,
  buildHydrateSearchParams: vd,
  selectItems: (e) => e?.posts,
  useQuery: ({ enabled: e, searchParams: t }) => lp({
    enabled: e,
    keepPreviousData: !0,
    searchParams: t
  }),
  toOption: jb
}), Tb = Js({
  id: "pages.published.remote",
  buildBrowseSearchParams: gd,
  buildHydrateSearchParams: vd,
  selectItems: (e) => e?.pages,
  useQuery: ({ enabled: e, searchParams: t }) => bb({
    enabled: e,
    keepPreviousData: !0,
    searchParams: t
  }),
  toOption: Sb
}), Pb = wb(
  Nb,
  Tb,
  (e) => ({
    value: e,
    label: `ID: ${e}`
  })
);
function Eb() {
  return Pb();
}
const Yc = ({
  filters: e,
  siteTimezone: t,
  onFiltersChange: r
}) => {
  const n = Eb(), o = gb(), i = rb({
    memberValueSource: o,
    postValueSource: n,
    siteTimezone: t
  }), a = e.length > 0;
  return /* @__PURE__ */ l.jsx(
    Gd,
    {
      addButtonIcon: a ? /* @__PURE__ */ l.jsx(ep, {}) : /* @__PURE__ */ l.jsx(tp, {}),
      addButtonText: a ? "Add filter" : "Filter",
      allowMultiple: !1,
      className: `[&>button]:order-last ${a ? "[&>button]:border-none" : "w-auto"}`,
      clearButtonClassName: "font-normal text-muted-foreground",
      clearButtonIcon: /* @__PURE__ */ l.jsx(fp, {}),
      clearButtonText: "Clear",
      fields: i,
      filters: e,
      keyboardShortcut: "f",
      popoverAlign: a ? "start" : "end",
      showClearButton: a,
      showSearchInput: !1,
      onChange: r
    }
  );
};
function Ob({ onClick: e, expanded: t }) {
  return /* @__PURE__ */ l.jsxs(
    le,
    {
      className: "shrink-0 gap-0.5 self-start p-0 text-base hover:bg-transparent",
      variant: "ghost",
      onClick: e,
      children: [
        t ? "Show less" : "Show more",
        t ? /* @__PURE__ */ l.jsx(pp, {}) : /* @__PURE__ */ l.jsx(dp, {})
      ]
    }
  );
}
function bd({ item: e }) {
  const t = ie(null), [r, n] = xe(!1), [o, i] = xe(!1);
  return Fe(() => {
    if (o)
      return;
    const a = () => {
      t.current && n(t.current.scrollHeight > t.current.clientHeight);
    };
    return a(), window.addEventListener("resize", a), () => window.removeEventListener("resize", a);
  }, [e.html, o]), /* @__PURE__ */ l.jsx("div", { className: "mt-2 flex flex-col gap-2", children: /* @__PURE__ */ l.jsxs("div", { className: `flex max-w-full flex-col items-start ${e.status === "hidden" && "opacity-50"}`, children: [
    /* @__PURE__ */ l.jsx(
      "div",
      {
        dangerouslySetInnerHTML: { __html: e.html || "" },
        ref: t,
        className: we(
          "prose flex-1 text-base max-w-[80ch] balance leading-[1.5em] [&_*]:leading-[1.5em] [&_*]:text-base [&_*]:font-normal [&_blockquote]:border-l-[3px] [&_blockquote]:border-foreground [&_blockquote]:p-0 [&_blockquote]:pl-3 [&_blockquote_p]:mt-0 [&_a]:underline",
          o ? "-mb-1 [&_p]:mb-[0.85em]" : "line-clamp-2 [&_p]:m-0 [&_blockquote+p]:mt-1 mb-1"
        )
      }
    ),
    r && /* @__PURE__ */ l.jsx(Ob, { expanded: o, onClick: () => i(!o) })
  ] }) });
}
const Dr = "CommentsResponseType", wd = "count.dislikes", Ks = (e) => [
  "member",
  "post",
  "count.replies",
  "count.direct_replies",
  "count.likes",
  ...e ? [wd] : [],
  "count.reports",
  "parent",
  "in_reply_to"
].join(","), Rb = (e) => [
  "member",
  "post",
  "count.direct_replies",
  "count.likes",
  ...e ? [wd] : [],
  "count.reports",
  "parent",
  "in_reply_to"
].join(","), Ab = da({
  dataType: Dr,
  path: "/comments/",
  defaultNextPageParams: (e, t) => e.meta?.pagination.next ? {
    ...t,
    page: (e.meta?.pagination.next || 1).toString()
  } : void 0,
  returnData: (e) => {
    const { pages: t } = e, r = t.flatMap((o) => o.comments), n = t[t.length - 1].meta;
    return {
      comments: r,
      meta: n,
      isEnd: n ? n.pagination.pages === n.pagination.page : !0
    };
  }
}), xd = (e) => Ab({
  ...e,
  searchParams: {
    limit: "100",
    order: "created_at desc",
    include: "member,post,parent",
    ...e?.searchParams
  }
}), jd = yr({
  method: "PUT",
  path: ({ id: e }) => `/comments/${e}/`,
  body: ({ id: e }) => ({
    comments: [{
      id: e,
      status: "hidden"
    }]
  }),
  invalidateQueries: {
    dataType: Dr
  }
}), Sd = yr({
  method: "PUT",
  path: ({ id: e }) => `/comments/${e}/`,
  body: ({ id: e }) => ({
    comments: [{
      id: e,
      status: "published"
    }]
  }),
  invalidateQueries: {
    dataType: Dr
  }
}), Db = yr({
  method: "PUT",
  path: ({ id: e }) => `/comments/${e}/`,
  body: ({ id: e }) => ({
    comments: [{
      id: e,
      pinned: !0
    }]
  }),
  invalidateQueries: {
    dataType: Dr
  }
}), Qs = yr({
  method: "PUT",
  path: ({ id: e }) => `/comments/${e}/`,
  body: ({ id: e }) => ({
    comments: [{
      id: e,
      pinned: !1
    }]
  }),
  invalidateQueries: {
    dataType: Dr
  }
}), Mb = Hn({
  dataType: Dr,
  path: (e) => `/comments/${e}/`,
  defaultSearchParams: {
    include: Ks(!1)
  }
}), Ib = (e, t) => {
  const { dislikesEnabled: r = !1, searchParams: n, ...o } = t || {};
  return Mb(e, {
    ...o,
    searchParams: {
      include: Ks(r),
      ...n
    }
  });
}, kb = Hn({
  dataType: "CommentReportsResponseType",
  path: (e) => `/comments/${e}/reports/`
}), Cb = (e, t) => kb(e, { ...t }), _b = Hn({
  dataType: "CommentLikesResponseType",
  path: (e) => `/comments/${e}/likes/`,
  defaultSearchParams: {
    include: "member",
    limit: "100",
    order: "created_at desc"
  }
}), Fb = (e, t) => _b(e, { ...t }), Bb = Hn({
  dataType: "CommentDislikesResponseType",
  path: (e) => `/comments/${e}/dislikes/`,
  defaultSearchParams: {
    include: "member",
    limit: "100",
    order: "created_at desc"
  }
}), Lb = (e, t) => Bb(e, { ...t }), $b = (e, t) => {
  const { dislikesEnabled: r = !1, ...n } = t || {};
  return xd({
    ...n,
    searchParams: {
      filter: `(parent_id:${e}+in_reply_to_id:null),in_reply_to_id:${e}`,
      order: "created_at asc",
      include: Rb(r),
      limit: "100"
    }
  });
};
function qb(e) {
  const t = new Date(e);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric"
  }).format(t).replace(/(\d+),(\s+\d{4})/, "$1$2");
}
const Ub = we(
  dl({ variant: "warning" }),
  "gap-1 hover:bg-state-warning/30"
);
function Nd({
  memberName: e,
  memberId: t,
  createdAt: r,
  isHidden: n,
  canComment: o,
  isPinned: i,
  onAuthorClick: a,
  postTitle: s,
  onPostClick: c,
  onUnpinClick: u,
  className: f
}) {
  const d = (p) => {
    p.stopPropagation(), u?.();
  };
  return /* @__PURE__ */ l.jsxs("div", { className: we("flex items-center gap-2", f), children: [
    /* @__PURE__ */ l.jsxs("div", { className: we(
      "flex min-w-0 items-center gap-x-1",
      n && "opacity-50"
    ), children: [
      /* @__PURE__ */ l.jsx("div", { className: "whitespace-nowrap", children: t && a ? /* @__PURE__ */ l.jsx(
        le,
        {
          className: "flex h-auto items-center gap-1.5 truncate p-0 text-md font-semibold text-primary hover:opacity-70",
          variant: "link",
          onClick: a,
          children: e || "Unknown"
        }
      ) : /* @__PURE__ */ l.jsx("span", { className: "block truncate font-semibold", children: e || "Unknown" }) }),
      o === !1 && /* @__PURE__ */ l.jsx(Rn, { children: /* @__PURE__ */ l.jsxs(An, { children: [
        /* @__PURE__ */ l.jsx(Dn, { asChild: !0, children: /* @__PURE__ */ l.jsx("span", { "data-testid": "commenting-disabled-indicator", children: /* @__PURE__ */ l.jsx(
          ol,
          {
            className: "size-3.5 text-muted-foreground"
          }
        ) }) }),
        /* @__PURE__ */ l.jsx(Mn, { children: "Comments disabled" })
      ] }) }),
      /* @__PURE__ */ l.jsx(fa, { className: "shrink-0 text-muted-foreground/50", size: 16 }),
      /* @__PURE__ */ l.jsx("div", { className: "shrink-0 whitespace-nowrap", children: r && /* @__PURE__ */ l.jsx(Rn, { children: /* @__PURE__ */ l.jsxs(An, { children: [
        /* @__PURE__ */ l.jsx(Dn, { asChild: !0, children: /* @__PURE__ */ l.jsx("span", { className: "cursor-default text-sm text-muted-foreground", children: Ut(r) }) }),
        /* @__PURE__ */ l.jsx(Mn, { children: qb(r) })
      ] }) }) }),
      s && /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
        /* @__PURE__ */ l.jsx("div", { className: "shrink-0 text-muted-foreground", children: "on" }),
        /* @__PURE__ */ l.jsx("div", { className: "min-w-0 truncate", children: c ? /* @__PURE__ */ l.jsx(
          le,
          {
            className: "block h-auto w-full cursor-pointer truncate p-0 text-left font-medium text-gray-800 hover:opacity-70 dark:text-gray-400",
            variant: "link",
            onClick: c,
            children: s
          }
        ) : /* @__PURE__ */ l.jsx("span", { className: "font-medium text-gray-800 dark:text-gray-400", children: s }) })
      ] })
    ] }),
    n && /* @__PURE__ */ l.jsx(lc, { variant: "secondary", children: "Hidden" }),
    i && (u ? /* @__PURE__ */ l.jsxs(
      "button",
      {
        "aria-label": "Unpin comment",
        className: we("group", Ub),
        type: "button",
        onClick: d,
        children: [
          /* @__PURE__ */ l.jsxs("span", { className: "grid size-3 shrink-0", children: [
            /* @__PURE__ */ l.jsx(Hi, { className: "col-start-1 row-start-1 size-3 group-hover:opacity-0 group-focus-visible:opacity-0" }),
            /* @__PURE__ */ l.jsx(il, { className: "col-start-1 row-start-1 size-3 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" })
          ] }),
          /* @__PURE__ */ l.jsxs("span", { className: "grid justify-items-start text-left", children: [
            /* @__PURE__ */ l.jsx("span", { className: "col-start-1 row-start-1 group-hover:opacity-0 group-focus-visible:opacity-0", children: "Pinned" }),
            /* @__PURE__ */ l.jsx("span", { className: "col-start-1 row-start-1 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100", children: "Unpin" })
          ] })
        ]
      }
    ) : /* @__PURE__ */ l.jsxs(lc, { className: "gap-1", variant: "warning", children: [
      /* @__PURE__ */ l.jsx(Hi, { className: "size-3" }),
      "Pinned"
    ] }))
  ] });
}
function zb({
  open: e,
  memberName: t,
  onOpenChange: r,
  onConfirm: n
}) {
  const [o, i] = xe(!1), a = (c) => {
    c || i(!1), r(c);
  }, s = () => {
    n(o), i(!1);
  };
  return /* @__PURE__ */ l.jsx(pa, { open: e, onOpenChange: a, children: /* @__PURE__ */ l.jsxs(ha, { className: "gap-5", children: [
    /* @__PURE__ */ l.jsxs(ma, { children: [
      /* @__PURE__ */ l.jsx(ya, { children: "Disable comments" }),
      /* @__PURE__ */ l.jsxs(yp, { children: [
        t || "This member",
        " won't be able to comment in the future. You can re-enable commenting anytime."
      ] })
    ] }),
    /* @__PURE__ */ l.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ l.jsx(
        hp,
        {
          checked: o,
          id: "hide-comments",
          onCheckedChange: (c) => i(c === !0)
        }
      ),
      /* @__PURE__ */ l.jsx(mp, { htmlFor: "hide-comments", children: "Hide all previous comments" })
    ] }),
    /* @__PURE__ */ l.jsxs(ga, { children: [
      /* @__PURE__ */ l.jsx(le, { variant: "outline", onClick: () => a(!1), children: "Cancel" }),
      /* @__PURE__ */ l.jsx(le, { onClick: s, children: "Disable comments" })
    ] })
  ] }) });
}
const Xs = () => {
  const { data: e } = gp();
  return e?.config?.labs?.commentsPinning === !0;
};
function Td({
  comment: e
}) {
  const { mutate: t } = ob(), { mutate: r } = ib(), { mutate: n } = Db(), { mutate: o } = Qs(), [i, a] = xe(!1), s = Xs(), { id: c, post: u, member: f } = e, d = u?.url, p = f?.id, h = f?.can_comment, y = s && !e.parent_id && e.status !== "deleted", m = (P) => {
    p && (t({
      id: p,
      reason: `Disabled from comment ${c}`,
      hideComments: P
    }), a(!1));
  }, v = () => {
    p && r({ id: p });
  };
  return /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    /* @__PURE__ */ l.jsxs(ip, { children: [
      /* @__PURE__ */ l.jsx(ap, { asChild: !0, children: /* @__PURE__ */ l.jsx(
        le,
        {
          className: "relative z-10 text-gray-800 hover:bg-secondary [&_svg]:size-4",
          size: "sm",
          variant: "ghost",
          children: /* @__PURE__ */ l.jsx(bp, {})
        }
      ) }),
      /* @__PURE__ */ l.jsxs(sp, { align: "start", children: [
        d && /* @__PURE__ */ l.jsx(Xt, { asChild: !0, children: /* @__PURE__ */ l.jsxs("a", { href: `${d}#ghost-comments-${c}`, rel: "noopener noreferrer", target: "_blank", children: [
          /* @__PURE__ */ l.jsx(cp, { className: "size-4" }),
          "View on post"
        ] }) }),
        p && /* @__PURE__ */ l.jsx(Xt, { asChild: !0, children: /* @__PURE__ */ l.jsxs("a", { href: `#/members/${p}`, children: [
          /* @__PURE__ */ l.jsx(sl, { className: "size-4" }),
          "View member"
        ] }) }),
        y && (e.pinned ? /* @__PURE__ */ l.jsxs(Xt, { onClick: () => o({ id: c }), children: [
          /* @__PURE__ */ l.jsx(il, { className: "size-4" }),
          "Unpin comment"
        ] }) : /* @__PURE__ */ l.jsxs(Xt, { onClick: () => n({ id: c }), children: [
          /* @__PURE__ */ l.jsx(Hi, { className: "size-4" }),
          "Pin comment"
        ] })),
        p && (h !== !1 ? /* @__PURE__ */ l.jsxs(Xt, { onClick: () => a(!0), children: [
          /* @__PURE__ */ l.jsx(ol, { className: "size-4" }),
          "Disable commenting"
        ] }) : /* @__PURE__ */ l.jsxs(Xt, { onClick: v, children: [
          /* @__PURE__ */ l.jsx(rp, { className: "size-4" }),
          "Enable commenting"
        ] }))
      ] })
    ] }),
    /* @__PURE__ */ l.jsx(
      zb,
      {
        memberName: f?.name,
        open: i,
        onConfirm: m,
        onOpenChange: a
      }
    )
  ] });
}
function Yb({ comment: e, dislikesEnabled: t, open: r, defaultTab: n = "likes", onOpenChange: o }) {
  const { data: i, isLoading: a } = Fb(e.id, { enabled: r }), { data: s, isLoading: c } = Lb(e.id, { enabled: r && t }), u = i?.comment_likes ?? [], f = t ? s?.comment_dislikes ?? [] : [], d = e.count?.likes ?? 0, p = t ? e.count?.dislikes ?? 0 : 0, h = Math.max(0, d - u.length), y = Math.max(0, p - f.length);
  return /* @__PURE__ */ l.jsx(pa, { open: r, onOpenChange: o, children: /* @__PURE__ */ l.jsxs(ha, { "aria-describedby": void 0, children: [
    /* @__PURE__ */ l.jsx(ma, { children: /* @__PURE__ */ l.jsx(ya, { children: t ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
      qt(d),
      " ",
      d === 1 ? "like" : "likes",
      " and ",
      qt(p),
      " ",
      p === 1 ? "dislike" : "dislikes"
    ] }) : /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
      qt(d),
      " ",
      d === 1 ? "like" : "likes"
    ] }) }) }),
    /* @__PURE__ */ l.jsx("div", { className: "overflow-hidden rounded-md border p-3", children: /* @__PURE__ */ l.jsxs("div", { className: "flex min-w-0 items-start gap-3", children: [
      /* @__PURE__ */ l.jsx(
        wt,
        {
          className: "shrink-0",
          email: e.member?.email,
          name: e.member?.name,
          src: e.member?.avatar_image
        }
      ),
      /* @__PURE__ */ l.jsxs("div", { className: "flex min-w-0 flex-col overflow-hidden", children: [
        /* @__PURE__ */ l.jsxs("div", { className: "flex min-w-0 items-center gap-1 text-sm", children: [
          /* @__PURE__ */ l.jsx("span", { className: "shrink-0 font-semibold", children: e.member ? ir(e.member) : "Deleted member" }),
          /* @__PURE__ */ l.jsx(fa, { className: "shrink-0 text-muted-foreground/50", size: 16 }),
          /* @__PURE__ */ l.jsx("span", { className: "shrink-0 text-muted-foreground", children: e.created_at && Ut(e.created_at) }),
          /* @__PURE__ */ l.jsx("span", { className: "shrink-0 text-muted-foreground", children: "on" }),
          /* @__PURE__ */ l.jsx("span", { className: "min-w-0 truncate font-medium text-gray-800 dark:text-gray-400", children: e.post?.title || "Unknown post" })
        ] }),
        /* @__PURE__ */ l.jsx(
          "div",
          {
            dangerouslySetInnerHTML: { __html: e.html || "" },
            className: "prose mt-2 line-clamp-2 text-sm [&_*]:text-sm [&_*]:leading-[1.5em] [&_p]:m-0"
          }
        )
      ] })
    ] }) }),
    t ? /* @__PURE__ */ l.jsxs(wp, { defaultValue: n, variant: "segmented", children: [
      /* @__PURE__ */ l.jsxs(xp, { className: "grid w-full grid-cols-2", children: [
        /* @__PURE__ */ l.jsx(cc, { value: "likes", children: "Likes" }),
        /* @__PURE__ */ l.jsx(cc, { value: "dislikes", children: "Dislikes" })
      ] }),
      /* @__PURE__ */ l.jsx(uc, { className: "mt-4", value: "likes", children: /* @__PURE__ */ l.jsx("div", { className: "-mx-1 max-h-64 overflow-y-auto px-1", children: a ? /* @__PURE__ */ l.jsx("div", { className: "flex justify-center py-4", children: /* @__PURE__ */ l.jsx(xt, { size: "md" }) }) : u.length === 0 ? /* @__PURE__ */ l.jsx("div", { className: "py-4 text-center text-sm text-muted-foreground", children: "No likes yet" }) : /* @__PURE__ */ l.jsxs("div", { className: "flex flex-col gap-3 pb-1", children: [
        u.map((m) => /* @__PURE__ */ l.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ l.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ l.jsxs("div", { className: "relative shrink-0", children: [
              /* @__PURE__ */ l.jsx(
                wt,
                {
                  email: m.member?.email,
                  name: m.member?.name,
                  src: m.member?.avatar_image
                }
              ),
              /* @__PURE__ */ l.jsx("div", { className: "absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-gray-500 text-white", children: /* @__PURE__ */ l.jsx(cl, { className: "size-2.5", fill: "currentColor" }) })
            ] }),
            /* @__PURE__ */ l.jsx("span", { className: "font-medium", children: m.member ? ir(m.member) : "Deleted member" })
          ] }),
          /* @__PURE__ */ l.jsx("span", { className: "shrink-0 text-sm text-muted-foreground", children: Ut(m.created_at) })
        ] }, m.id)),
        h > 0 && /* @__PURE__ */ l.jsxs("div", { className: "pt-1 text-center text-sm text-muted-foreground", children: [
          "and ",
          qt(h),
          " more"
        ] })
      ] }) }) }),
      /* @__PURE__ */ l.jsx(uc, { className: "mt-4", value: "dislikes", children: /* @__PURE__ */ l.jsx("div", { className: "-mx-1 max-h-64 overflow-y-auto px-1", children: c ? /* @__PURE__ */ l.jsx("div", { className: "flex justify-center py-4", children: /* @__PURE__ */ l.jsx(xt, { size: "md" }) }) : f.length === 0 ? /* @__PURE__ */ l.jsx("div", { className: "py-4 text-center text-sm text-muted-foreground", children: "No dislikes yet" }) : /* @__PURE__ */ l.jsxs("div", { className: "flex flex-col gap-3 pb-1", children: [
        f.map((m) => /* @__PURE__ */ l.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ l.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ l.jsxs("div", { className: "relative shrink-0", children: [
              /* @__PURE__ */ l.jsx(
                wt,
                {
                  email: m.member?.email,
                  name: m.member?.name,
                  src: m.member?.avatar_image
                }
              ),
              /* @__PURE__ */ l.jsx("div", { className: "absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-gray-500 text-white", children: /* @__PURE__ */ l.jsx(ul, { className: "size-2.5", fill: "currentColor" }) })
            ] }),
            /* @__PURE__ */ l.jsx("span", { className: "font-medium", children: m.member ? ir(m.member) : "Deleted member" })
          ] }),
          /* @__PURE__ */ l.jsx("span", { className: "shrink-0 text-sm text-muted-foreground", children: Ut(m.created_at) })
        ] }, m.id)),
        y > 0 && /* @__PURE__ */ l.jsxs("div", { className: "pt-1 text-center text-sm text-muted-foreground", children: [
          "and ",
          qt(y),
          " more"
        ] })
      ] }) }) })
    ] }) : /* @__PURE__ */ l.jsx("div", { className: "-mx-1 max-h-64 overflow-y-auto px-1", children: a ? /* @__PURE__ */ l.jsx("div", { className: "flex justify-center py-4", children: /* @__PURE__ */ l.jsx(xt, { size: "md" }) }) : /* @__PURE__ */ l.jsxs("div", { className: "flex flex-col gap-3 pb-1", children: [
      u.map((m) => /* @__PURE__ */ l.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ l.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ l.jsxs("div", { className: "relative shrink-0", children: [
            /* @__PURE__ */ l.jsx(
              wt,
              {
                email: m.member?.email,
                name: m.member?.name,
                src: m.member?.avatar_image
              }
            ),
            /* @__PURE__ */ l.jsx("div", { className: "absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-pink-500 text-white", children: /* @__PURE__ */ l.jsx(ll, { className: "size-2.5", fill: "currentColor" }) })
          ] }),
          /* @__PURE__ */ l.jsx("span", { className: "font-medium", children: m.member ? ir(m.member) : "Deleted member" })
        ] }),
        /* @__PURE__ */ l.jsx("span", { className: "shrink-0 text-sm text-muted-foreground", children: Ut(m.created_at) })
      ] }, m.id)),
      h > 0 && /* @__PURE__ */ l.jsxs("div", { className: "pt-1 text-center text-sm text-muted-foreground", children: [
        "and ",
        qt(h),
        " more"
      ] })
    ] }) }),
    /* @__PURE__ */ l.jsx(ga, { children: /* @__PURE__ */ l.jsx(le, { onClick: () => o(!1), children: "OK" }) })
  ] }) });
}
function Zb({ comment: e, open: t, onOpenChange: r }) {
  const { data: n, isLoading: o } = Cb(e.id, { enabled: t }), i = n?.comment_reports ?? [], a = e.count?.reports ?? i.length;
  return /* @__PURE__ */ l.jsx(pa, { open: t, onOpenChange: r, children: /* @__PURE__ */ l.jsxs(ha, { "aria-describedby": void 0, children: [
    /* @__PURE__ */ l.jsx(ma, { children: /* @__PURE__ */ l.jsxs(ya, { children: [
      a,
      " ",
      a === 1 ? "report" : "reports"
    ] }) }),
    /* @__PURE__ */ l.jsx("div", { className: "overflow-hidden rounded-md border p-3", children: /* @__PURE__ */ l.jsxs("div", { className: "flex min-w-0 items-start gap-3", children: [
      /* @__PURE__ */ l.jsx(
        wt,
        {
          className: "shrink-0",
          email: e.member?.email,
          name: e.member?.name,
          src: e.member?.avatar_image
        }
      ),
      /* @__PURE__ */ l.jsxs("div", { className: "flex min-w-0 flex-col overflow-hidden", children: [
        /* @__PURE__ */ l.jsxs("div", { className: "flex min-w-0 items-center gap-1 text-sm", children: [
          /* @__PURE__ */ l.jsx("span", { className: "shrink-0 font-semibold", children: e.member ? ir(e.member) : "Deleted member" }),
          /* @__PURE__ */ l.jsx(fa, { className: "shrink-0 text-muted-foreground/50", size: 16 }),
          /* @__PURE__ */ l.jsx("span", { className: "shrink-0 text-muted-foreground", children: e.created_at && Ut(e.created_at) }),
          /* @__PURE__ */ l.jsx("span", { className: "shrink-0 text-muted-foreground", children: "on" }),
          /* @__PURE__ */ l.jsx("span", { className: "min-w-0 truncate font-medium text-gray-800 dark:text-gray-400", children: e.post?.title || "Unknown post" })
        ] }),
        /* @__PURE__ */ l.jsx(
          "div",
          {
            dangerouslySetInnerHTML: { __html: e.html || "" },
            className: "prose mt-2 line-clamp-2 text-sm [&_*]:text-sm [&_*]:leading-[1.5em] [&_p]:m-0"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ l.jsx("div", { className: "-mx-1 max-h-64 overflow-y-auto px-1", children: o ? /* @__PURE__ */ l.jsx("div", { className: "flex justify-center py-4", children: /* @__PURE__ */ l.jsx(xt, { size: "md" }) }) : /* @__PURE__ */ l.jsx("div", { className: "flex flex-col gap-3 pb-1", children: i.map((s) => /* @__PURE__ */ l.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ l.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ l.jsxs("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ l.jsx(
            wt,
            {
              email: s.member?.email,
              name: s.member?.name,
              src: s.member?.avatar_image
            }
          ),
          /* @__PURE__ */ l.jsx("div", { className: "absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-red text-white", children: /* @__PURE__ */ l.jsx(la, { className: "size-2.5", fill: "currentColor" }) })
        ] }),
        /* @__PURE__ */ l.jsx("span", { className: "font-medium", children: s.member ? ir(s.member) : "Deleted member" })
      ] }),
      /* @__PURE__ */ l.jsx("span", { className: "shrink-0 text-sm text-muted-foreground", children: Ut(s.created_at) })
    ] }, s.id)) }) }),
    /* @__PURE__ */ l.jsx(ga, { children: /* @__PURE__ */ l.jsx(le, { onClick: () => r(!1), children: "OK" }) })
  ] }) });
}
function _r({ icon: e, count: t, label: r, to: n, onClick: o, className: i, testId: a }) {
  const s = we("flex items-center gap-1 text-xs text-gray-800", i), c = /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    e,
    /* @__PURE__ */ l.jsx("span", { children: qt(t) })
  ] }), u = n || o;
  return /* @__PURE__ */ l.jsx(Rn, { children: /* @__PURE__ */ l.jsxs(An, { children: [
    /* @__PURE__ */ l.jsx(Dn, { asChild: !0, children: n ? /* @__PURE__ */ l.jsx(
      ca,
      {
        className: we(s, "cursor-pointer hover:opacity-70"),
        "data-testid": a,
        to: n,
        onClick: (f) => {
          f.stopPropagation();
        },
        children: c
      }
    ) : o ? /* @__PURE__ */ l.jsx(
      "button",
      {
        className: we(s, "cursor-pointer hover:opacity-70"),
        "data-testid": a,
        type: "button",
        onClick: (f) => {
          f.stopPropagation(), o();
        },
        children: c
      }
    ) : /* @__PURE__ */ l.jsx("div", { className: s, "data-testid": a, children: c }) }),
    /* @__PURE__ */ l.jsx(Mn, { children: u ? `View ${r.toLowerCase()}` : r })
  ] }) });
}
function ec(e, t) {
  if (!t)
    return;
  const r = new URLSearchParams(e);
  return r.set("thread", `is:${t}`), `?${r.toString()}`;
}
function Pd({
  comment: e,
  dislikesEnabled: t,
  className: r
}) {
  const [n] = mr(), [o, i] = xe(!1), [a, s] = xe("likes"), [c, u] = xe(!1), f = ec(n, e.id), d = e.count?.direct_replies ?? e.count?.replies ?? e.replies?.length ?? 0, p = e.count?.likes ?? 0, h = t ? e.count?.dislikes ?? 0 : 0, y = e.count?.reports ?? 0, m = d > 0, v = p > 0, P = h > 0, T = y > 0;
  return /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    /* @__PURE__ */ l.jsxs("div", { className: we("flex items-center gap-6", r), children: [
      /* @__PURE__ */ l.jsx(
        _r,
        {
          count: d,
          icon: /* @__PURE__ */ l.jsx(np, { size: 16, strokeWidth: 1.5 }),
          label: "Replies",
          testId: "replies-metric",
          to: m ? f : void 0
        }
      ),
      t ? /* @__PURE__ */ l.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ l.jsx(
          _r,
          {
            count: p,
            icon: /* @__PURE__ */ l.jsx(cl, { size: 16, strokeWidth: 1.5 }),
            label: "Likes",
            testId: "likes-metric",
            onClick: v ? () => {
              s("likes"), i(!0);
            } : void 0
          }
        ),
        /* @__PURE__ */ l.jsx(
          _r,
          {
            count: h,
            icon: /* @__PURE__ */ l.jsx(ul, { size: 16, strokeWidth: 1.5 }),
            label: "Dislikes",
            testId: "dislikes-metric",
            onClick: P ? () => {
              s("dislikes"), i(!0);
            } : void 0
          }
        )
      ] }) : /* @__PURE__ */ l.jsx(
        _r,
        {
          count: p,
          icon: /* @__PURE__ */ l.jsx(ll, { size: 16, strokeWidth: 1.5 }),
          label: "Likes",
          onClick: v ? () => i(!0) : void 0
        }
      ),
      /* @__PURE__ */ l.jsx(
        _r,
        {
          className: T ? "font-semibold text-red" : void 0,
          count: y,
          icon: /* @__PURE__ */ l.jsx(la, { size: 16, strokeWidth: 1.5 }),
          label: "Reports",
          onClick: T ? () => u(!0) : void 0
        }
      )
    ] }),
    /* @__PURE__ */ l.jsx(
      Yb,
      {
        comment: e,
        defaultTab: a,
        dislikesEnabled: t,
        open: o,
        onOpenChange: i
      }
    ),
    /* @__PURE__ */ l.jsx(
      Zb,
      {
        comment: e,
        open: c,
        onOpenChange: u
      }
    )
  ] });
}
function Wb({ hasReplies: e }) {
  return e ? /* @__PURE__ */ l.jsx(
    "div",
    {
      className: "mb-2 h-full w-px grow rounded bg-gradient-to-b from-muted-foreground/20 from-70% to-transparent",
      "data-testid": "replies-line"
    }
  ) : null;
}
function Ed({ comment: e, dislikesEnabled: t, isReply: r = !1, isSelectedComment: n = !1, selectedCommentId: o }) {
  const [i] = mr(), { mutate: a } = jd(), { mutate: s } = Sd(), { mutate: c } = Qs(), u = Xs(), f = (e.replies?.length ?? 0) > 0 || (e.count?.direct_replies ?? e.count?.replies ?? 0) > 0, d = !f || r ? "mb-7" : "mb-0";
  return /* @__PURE__ */ l.jsxs("div", { className: `flex w-full flex-row ${d}`, children: [
    /* @__PURE__ */ l.jsxs("div", { className: "mr-2 flex shrink-0 flex-col items-center justify-start md:mr-3", children: [
      /* @__PURE__ */ l.jsx(
        wt,
        {
          className: we("mb-3 size-6 md:mb-4 md:size-8", e.status === "hidden" && "opacity-50"),
          email: e.member?.email,
          name: e.member?.name,
          src: e.member?.avatar_image
        }
      ),
      /* @__PURE__ */ l.jsx(Wb, { hasReplies: f && !r })
    ] }),
    /* @__PURE__ */ l.jsx("div", { className: "grow", children: /* @__PURE__ */ l.jsxs(
      "div",
      {
        className: "w-full",
        "data-testid": `comment-thread-row-${e.id}`,
        children: [
          /* @__PURE__ */ l.jsxs("div", { className: "flex min-w-0 flex-col", children: [
            /* @__PURE__ */ l.jsx(
              Nd,
              {
                canComment: e.member?.can_comment,
                createdAt: e.created_at,
                isHidden: e.status === "hidden",
                isPinned: u && e.pinned,
                memberId: e.member?.id,
                memberName: e.member?.name,
                onUnpinClick: u ? () => c({ id: e.id }) : void 0
              }
            ),
            e.in_reply_to_snippet && n && /* @__PURE__ */ l.jsxs("div", { className: `mb-1 line-clamp-1 text-sm ${e.status === "hidden" && "opacity-50"}`, children: [
              /* @__PURE__ */ l.jsx("span", { className: "text-muted-foreground", children: "Replied to:" }),
              " ",
              /* @__PURE__ */ l.jsx(
                ca,
                {
                  className: "text-sm font-normal text-muted-foreground hover:text-foreground",
                  "data-testid": "replied-to-link",
                  to: ec(i, e.in_reply_to_id || e.parent_id) || "",
                  onClick: (p) => {
                    p.stopPropagation();
                  },
                  children: e.in_reply_to_snippet
                }
              )
            ] }),
            /* @__PURE__ */ l.jsx(bd, { item: e }),
            /* @__PURE__ */ l.jsxs("div", { className: "mt-4 flex flex-row flex-wrap items-center gap-3", children: [
              e.status === "published" && /* @__PURE__ */ l.jsxs(le, { className: "text-gray-800", size: "sm", variant: "outline", onClick: () => a({ id: e.id }), children: [
                /* @__PURE__ */ l.jsx(al, {}),
                /* @__PURE__ */ l.jsx("span", { className: "max-md:hidden", children: "Hide" })
              ] }),
              e.status === "hidden" && /* @__PURE__ */ l.jsxs(le, { className: "text-gray-800", size: "sm", variant: "outline", onClick: () => s({ id: e.id }), children: [
                /* @__PURE__ */ l.jsx(nl, {}),
                /* @__PURE__ */ l.jsx("span", { className: "max-md:hidden", children: "Show" })
              ] }),
              /* @__PURE__ */ l.jsx(
                Pd,
                {
                  comment: e,
                  dislikesEnabled: t
                }
              ),
              /* @__PURE__ */ l.jsx(
                Td,
                {
                  comment: e
                }
              )
            ] })
          ] }),
          f && e.replies && /* @__PURE__ */ l.jsx("div", { className: "mt-7 mb-4 -ml-2 pl-2 md:mt-8 md:mb-0 md:-ml-3 md:pl-3", children: e.replies.map((p) => /* @__PURE__ */ l.jsx(
            Ed,
            {
              comment: p,
              dislikesEnabled: t,
              isReply: !0,
              selectedCommentId: o
            },
            p.id
          )) })
        ]
      }
    ) })
  ] });
}
const Hb = ({
  selectedComment: e,
  dislikesEnabled: t,
  replies: r,
  selectedCommentId: n,
  fetchNextPage: o,
  hasNextPage: i,
  isFetchingNextPage: a
}) => {
  const s = { ...e, replies: r };
  return /* @__PURE__ */ l.jsxs("div", { className: "flex flex-col", "data-testid": "comment-thread-list", children: [
    /* @__PURE__ */ l.jsx(
      Ed,
      {
        comment: s,
        dislikesEnabled: t,
        isSelectedComment: !0,
        selectedCommentId: n
      }
    ),
    i && /* @__PURE__ */ l.jsx("div", { className: "flex justify-center pb-4", children: /* @__PURE__ */ l.jsx(
      le,
      {
        disabled: a,
        variant: "outline",
        onClick: () => o(),
        children: a ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
          /* @__PURE__ */ l.jsx(xt, { size: "sm" }),
          "Loading..."
        ] }) : "Load more replies"
      }
    ) })
  ] });
}, Vb = ({
  commentId: e,
  dislikesEnabled: t,
  open: r,
  onOpenChange: n
}) => {
  const {
    data: o,
    isLoading: i,
    isError: a,
    fetchNextPage: s,
    hasNextPage: c,
    isFetchingNextPage: u
  } = $b(e ?? "", {
    dislikesEnabled: t,
    enabled: r && !!e
  }), { data: f, isLoading: d, isError: p } = Ib(e ?? "", {
    dislikesEnabled: t,
    enabled: r && !!e
  }), h = i || d, y = p || a && !f, m = f?.comments?.[0], v = o?.comments || [];
  return /* @__PURE__ */ l.jsx(Sp, { open: r, onOpenChange: n, children: /* @__PURE__ */ l.jsxs(Np, { className: "overflow-y-auto px-6 pt-0 sm:max-w-[420px]", children: [
    /* @__PURE__ */ l.jsx(Tp, { className: "sticky top-0 z-40 -mx-6 bg-background/60 p-6 backdrop-blur", children: /* @__PURE__ */ l.jsx(Pp, { className: "text-md", children: "Thread" }) }),
    m?.post && /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
      /* @__PURE__ */ l.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ l.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ l.jsx("h3", { className: "line-clamp-1 text-xl font-semibold text-foreground", children: m.post.title }),
          m.post.excerpt && /* @__PURE__ */ l.jsx("p", { className: "mt-1 line-clamp-2 text-sm text-muted-foreground", children: m.post.excerpt })
        ] }),
        m.post.feature_image && /* @__PURE__ */ l.jsx(
          "img",
          {
            alt: m.post.title || "Post feature image",
            className: "hidden aspect-video h-18 shrink-0 rounded object-cover lg:block",
            src: m.post.feature_image
          }
        )
      ] }),
      /* @__PURE__ */ l.jsx(jp, { className: "-mx-6 my-6 w-auto" })
    ] }),
    /* @__PURE__ */ l.jsx("div", { children: h ? /* @__PURE__ */ l.jsx("div", { className: "flex h-full items-center justify-center py-8", children: /* @__PURE__ */ l.jsx(xt, { size: "lg" }) }) : y || !m ? /* @__PURE__ */ l.jsx("div", { className: "flex h-full items-center justify-center py-8", children: /* @__PURE__ */ l.jsx(
      Gi,
      {
        actions: /* @__PURE__ */ l.jsx(le, { variant: "outline", onClick: () => n(!1), children: "Back to comments" }),
        description: "This thread may have been deleted or doesn't exist.",
        title: "Thread not found",
        children: /* @__PURE__ */ l.jsx(Vi, {})
      }
    ) }) : /* @__PURE__ */ l.jsx(
      Hb,
      {
        dislikesEnabled: t,
        fetchNextPage: s,
        hasNextPage: c,
        isFetchingNextPage: u,
        replies: v,
        selectedComment: m,
        selectedCommentId: e ?? ""
      }
    ) })
  ] }) });
}, Uo = /* @__PURE__ */ new Map(), ia = "ghostVirtualListScrollPosition", Zc = 150, Gb = 500;
function zo() {
  if (!(typeof window > "u"))
    return window.history.state;
}
function aa(e) {
  const t = e?.key;
  if (typeof t == "string" || typeof t == "number")
    return String(t);
  const r = e?.idx;
  if (typeof r == "number")
    return String(r);
}
function Wc(e, t) {
  const r = aa(e);
  if (r)
    return `${r}::${t}`;
}
function Jb(e, t) {
  const r = e?.[ia];
  if (!r || typeof r != "object")
    return;
  const n = r[t];
  if (typeof n == "number")
    return n;
}
function Kb(e, t, r) {
  if (typeof window > "u")
    return;
  const n = e?.[ia], o = {
    ...e ?? {},
    [ia]: {
      ...n && typeof n == "object" ? n : {},
      [t]: r
    }
  };
  window.history.replaceState(o, "");
}
function Qb({ parentRef: e, enabled: t = !0, isLoading: r = !1 }) {
  const n = Zd(), [o, i] = xe(null), a = ie(null), s = ie(0), c = ie(0), u = ie(0), f = ie(null), d = ie(/* @__PURE__ */ new Set()), p = n.pathname + n.search;
  Fe(() => {
    if (!t || !e.current)
      return;
    const h = Ep(e.current);
    i(h);
  }, [t, e]), Fe(() => {
    if (!t || !o)
      return;
    const h = zo(), y = aa(h), m = Wc(h, p), v = () => {
      f.current !== null && (window.clearTimeout(f.current), f.current = null);
    }, P = (_) => {
      m && Uo.set(m, _);
      const M = zo();
      aa(M) === y && Kb(M, p, _), c.current = Date.now(), u.current = _;
    }, T = ({ persistToHistory: _ = !0 } = {}) => {
      if (v(), !_) {
        const M = s.current;
        m && Uo.set(m, M), c.current = Date.now(), u.current = M;
        return;
      }
      P(s.current);
    }, E = () => {
      const _ = Date.now();
      if (Math.abs(s.current - u.current) >= Gb || _ - c.current >= Zc) {
        v(), P(s.current);
        return;
      }
      f.current === null && (f.current = window.setTimeout(() => {
        f.current = null, P(s.current);
      }, Zc));
    }, R = () => {
      s.current = o.scrollTop, E();
    }, C = () => {
      T();
    };
    return s.current = o.scrollTop, o.addEventListener("scroll", R), window.addEventListener("pagehide", C), () => {
      T({ persistToHistory: !1 }), o.removeEventListener("scroll", R), window.removeEventListener("pagehide", C);
    };
  }, [t, p, o]), Fe(() => {
    const h = zo(), y = Wc(h, p), m = (y ? Uo.get(y) : void 0) ?? Jb(h, p);
    if (!(!t || !o || r)) {
      if (m !== void 0 && a.current !== p) {
        a.current = p;
        let v = 0;
        const P = 20, T = () => {
          for (const C of d.current)
            window.clearTimeout(C);
          d.current.clear();
        }, E = (C, _) => {
          const M = window.setTimeout(() => {
            d.current.delete(M), C();
          }, _);
          d.current.add(M);
        }, R = () => {
          if (v += 1, !o)
            return;
          const C = o.scrollTop, _ = o.scrollHeight, M = o.clientHeight, Z = _ - M;
          if (m > Z && v < P) {
            E(R, 100);
            return;
          }
          if (Math.abs(m - C) > 5) {
            const $ = Math.min(m, Z);
            o.scrollTop = $;
          }
        };
        return E(R, 150), () => T();
      }
      a.current = p;
    }
  }, [t, p, o, r]);
}
const Hc = ({ height: e }) => /* @__PURE__ */ l.jsx("div", { "aria-hidden": "true", className: "flex", children: /* @__PURE__ */ l.jsx("div", { className: "flex", style: { height: e } }) }), Xb = Wd(function(t, r) {
  return /* @__PURE__ */ l.jsx(
    "div",
    {
      ref: r,
      ...t,
      "aria-hidden": "true",
      className: "relative flex flex-col",
      children: /* @__PURE__ */ l.jsx("div", { className: "relative z-10 h-24 animate-pulse", children: /* @__PURE__ */ l.jsx("div", { className: "h-full rounded-md bg-muted", "data-testid": "loading-placeholder" }) })
    }
  );
});
function e1({
  items: e,
  totalItems: t,
  hasNextPage: r,
  isFetchingNextPage: n,
  fetchNextPage: o,
  resetKey: i,
  onAddFilter: a,
  isLoading: s,
  dislikesEnabled: c
}) {
  const u = ie(null), { visibleItemCount: f, canLoadMore: d, loadMore: p } = Op(t, { resetKey: i }), [h, y] = mr(), [m, v] = xe(!1), [P, T] = xe(null), { mutate: E } = jd(), { mutate: R } = Sd(), { mutate: C } = Qs(), _ = Xs(), M = (B) => {
    if (v(B), !B) {
      const N = new URLSearchParams(h);
      N.delete("thread"), y(N, { replace: !0 });
    }
  };
  Fe(() => {
    const B = h.get("thread");
    if (B) {
      const N = B.match(/^is:(.+)$/);
      if (N && N[1]) {
        const j = N[1];
        T(j), v(!0);
      } else
        v(!1), T(null);
    } else
      v(!1), T(null);
  }, [h]), Qb({ parentRef: u, isLoading: s });
  const { visibleItems: Z, spaceBefore: $, spaceAfter: G } = Rp({
    items: e,
    totalItems: f,
    hasNextPage: r,
    isFetchingNextPage: n,
    fetchNextPage: o,
    parentRef: u
  });
  return /* @__PURE__ */ l.jsxs("div", { ref: u, className: "overflow-hidden border-t", children: [
    /* @__PURE__ */ l.jsx(
      "div",
      {
        className: "flex flex-col",
        "data-testid": "comments-list",
        children: /* @__PURE__ */ l.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ l.jsx(Hc, { height: $ }),
          Z.map(({ key: B, virtualItem: N, item: j, props: D }) => N.index > e.length - 1 ? /* @__PURE__ */ l.jsx(Xb, { ...D }, B) : /* @__PURE__ */ l.jsxs(
            "div",
            {
              ...D,
              className: "grid w-full grid-cols-1 items-start justify-between gap-4 border-b p-3 hover:bg-muted/50 md:p-5 lg:grid-cols-[minmax(0,1fr)_144px]",
              "data-testid": "comment-list-row",
              onClick: () => {
                m && M(!1);
              },
              children: [
                /* @__PURE__ */ l.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ l.jsx(
                    wt,
                    {
                      className: we("mt-0.5 size-6 md:size-8", j.status === "hidden" && "opacity-50"),
                      email: j.member?.email,
                      name: j.member?.name,
                      src: j.member?.avatar_image
                    }
                  ),
                  /* @__PURE__ */ l.jsxs("div", { className: "flex min-w-0 flex-col gap-3", children: [
                    /* @__PURE__ */ l.jsxs("div", { children: [
                      /* @__PURE__ */ l.jsx(
                        Nd,
                        {
                          canComment: j.member?.can_comment,
                          createdAt: j.created_at,
                          isHidden: j.status === "hidden",
                          isPinned: _ && j.pinned,
                          memberId: j.member?.id,
                          memberName: j.member?.name,
                          postTitle: j.post?.title,
                          onAuthorClick: j.member?.id ? () => a("author", j.member.id) : void 0,
                          onPostClick: j.post?.id ? () => a("post", j.post.id) : void 0,
                          onUnpinClick: _ ? () => C({ id: j.id }) : void 0
                        }
                      ),
                      j.in_reply_to_snippet && /* @__PURE__ */ l.jsxs("div", { className: `mb-1 line-clamp-1 max-w-3xl ${j.status === "hidden" && "opacity-50"}`, children: [
                        /* @__PURE__ */ l.jsx("span", { className: "text-muted-foreground", children: "Replied to:" }),
                        " ",
                        /* @__PURE__ */ l.jsx(
                          ca,
                          {
                            className: "text-sm font-normal text-muted-foreground hover:text-foreground",
                            "data-testid": "replied-to-link",
                            to: ec(h, j.in_reply_to_id || j.parent_id) || "",
                            onClick: (A) => {
                              A.stopPropagation();
                            },
                            children: j.in_reply_to_snippet
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ l.jsx(bd, { item: j }),
                    /* @__PURE__ */ l.jsxs("div", { className: "flex flex-row flex-nowrap items-center gap-3", children: [
                      j.status === "published" && /* @__PURE__ */ l.jsxs(le, { className: "text-foreground", size: "sm", variant: "outline", onClick: () => E({ id: j.id }), children: [
                        /* @__PURE__ */ l.jsx(al, {}),
                        "Hide"
                      ] }),
                      j.status === "hidden" && /* @__PURE__ */ l.jsxs(le, { className: "text-foreground", size: "sm", variant: "outline", onClick: () => R({ id: j.id }), children: [
                        /* @__PURE__ */ l.jsx(nl, {}),
                        "Show"
                      ] }),
                      /* @__PURE__ */ l.jsx(
                        Pd,
                        {
                          className: "ml-2",
                          comment: j,
                          dislikesEnabled: c
                        }
                      ),
                      /* @__PURE__ */ l.jsx(
                        Td,
                        {
                          comment: j
                        }
                      )
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ l.jsx("div", { children: j.post?.feature_image ? /* @__PURE__ */ l.jsx(
                  "img",
                  {
                    alt: j.post.title || "Post feature image",
                    className: `hidden aspect-video w-36 rounded object-cover lg:block ${j.status === "hidden" && "opacity-50"}`,
                    src: j.post.feature_image
                  }
                ) : null })
              ]
            },
            B
          )),
          /* @__PURE__ */ l.jsx(Hc, { height: G })
        ] })
      }
    ),
    d && /* @__PURE__ */ l.jsx(Ap, { isLoading: n, onClick: p }),
    /* @__PURE__ */ l.jsx(
      Vb,
      {
        commentId: P,
        dislikesEnabled: c,
        open: m,
        onOpenChange: M
      }
    )
  ] });
}
var Sn = {}, Yo = {}, Zo = {}, Wo, Vc;
function Od() {
  return Vc || (Vc = 1, Wo = function() {
    if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
      return !1;
    if (typeof Symbol.iterator == "symbol")
      return !0;
    var t = {}, r = /* @__PURE__ */ Symbol("test"), n = Object(r);
    if (typeof r == "string" || Object.prototype.toString.call(r) !== "[object Symbol]" || Object.prototype.toString.call(n) !== "[object Symbol]")
      return !1;
    var o = 42;
    t[r] = o;
    for (var i in t)
      return !1;
    if (typeof Object.keys == "function" && Object.keys(t).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(t).length !== 0)
      return !1;
    var a = Object.getOwnPropertySymbols(t);
    if (a.length !== 1 || a[0] !== r || !Object.prototype.propertyIsEnumerable.call(t, r))
      return !1;
    if (typeof Object.getOwnPropertyDescriptor == "function") {
      var s = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(t, r)
      );
      if (s.value !== o || s.enumerable !== !0)
        return !1;
    }
    return !0;
  }), Wo;
}
var Ho, Gc;
function Eo() {
  if (Gc) return Ho;
  Gc = 1;
  var e = Od();
  return Ho = function() {
    return e() && !!Symbol.toStringTag;
  }, Ho;
}
var Vo, Jc;
function Rd() {
  return Jc || (Jc = 1, Vo = Object), Vo;
}
var Go, Kc;
function t1() {
  return Kc || (Kc = 1, Go = Error), Go;
}
var Jo, Qc;
function r1() {
  return Qc || (Qc = 1, Jo = EvalError), Jo;
}
var Ko, Xc;
function n1() {
  return Xc || (Xc = 1, Ko = RangeError), Ko;
}
var Qo, eu;
function o1() {
  return eu || (eu = 1, Qo = ReferenceError), Qo;
}
var Xo, tu;
function Ad() {
  return tu || (tu = 1, Xo = SyntaxError), Xo;
}
var ei, ru;
function mn() {
  return ru || (ru = 1, ei = TypeError), ei;
}
var ti, nu;
function i1() {
  return nu || (nu = 1, ti = URIError), ti;
}
var ri, ou;
function a1() {
  return ou || (ou = 1, ri = Math.abs), ri;
}
var ni, iu;
function s1() {
  return iu || (iu = 1, ni = Math.floor), ni;
}
var oi, au;
function c1() {
  return au || (au = 1, oi = Math.max), oi;
}
var ii, su;
function u1() {
  return su || (su = 1, ii = Math.min), ii;
}
var ai, cu;
function l1() {
  return cu || (cu = 1, ai = Math.pow), ai;
}
var si, uu;
function f1() {
  return uu || (uu = 1, si = Math.round), si;
}
var ci, lu;
function d1() {
  return lu || (lu = 1, ci = Number.isNaN || function(t) {
    return t !== t;
  }), ci;
}
var ui, fu;
function p1() {
  if (fu) return ui;
  fu = 1;
  var e = /* @__PURE__ */ d1();
  return ui = function(r) {
    return e(r) || r === 0 ? r : r < 0 ? -1 : 1;
  }, ui;
}
var li, du;
function h1() {
  return du || (du = 1, li = Object.getOwnPropertyDescriptor), li;
}
var fi, pu;
function Mr() {
  if (pu) return fi;
  pu = 1;
  var e = /* @__PURE__ */ h1();
  if (e)
    try {
      e([], "length");
    } catch {
      e = null;
    }
  return fi = e, fi;
}
var di, hu;
function Oo() {
  if (hu) return di;
  hu = 1;
  var e = Object.defineProperty || !1;
  if (e)
    try {
      e({}, "a", { value: 1 });
    } catch {
      e = !1;
    }
  return di = e, di;
}
var pi, mu;
function m1() {
  if (mu) return pi;
  mu = 1;
  var e = typeof Symbol < "u" && Symbol, t = Od();
  return pi = function() {
    return typeof e != "function" || typeof Symbol != "function" || typeof e("foo") != "symbol" || typeof /* @__PURE__ */ Symbol("bar") != "symbol" ? !1 : t();
  }, pi;
}
var hi, yu;
function Dd() {
  return yu || (yu = 1, hi = typeof Reflect < "u" && Reflect.getPrototypeOf || null), hi;
}
var mi, gu;
function Md() {
  if (gu) return mi;
  gu = 1;
  var e = /* @__PURE__ */ Rd();
  return mi = e.getPrototypeOf || null, mi;
}
var yi, vu;
function y1() {
  if (vu) return yi;
  vu = 1;
  var e = "Function.prototype.bind called on incompatible ", t = Object.prototype.toString, r = Math.max, n = "[object Function]", o = function(c, u) {
    for (var f = [], d = 0; d < c.length; d += 1)
      f[d] = c[d];
    for (var p = 0; p < u.length; p += 1)
      f[p + c.length] = u[p];
    return f;
  }, i = function(c, u) {
    for (var f = [], d = u, p = 0; d < c.length; d += 1, p += 1)
      f[p] = c[d];
    return f;
  }, a = function(s, c) {
    for (var u = "", f = 0; f < s.length; f += 1)
      u += s[f], f + 1 < s.length && (u += c);
    return u;
  };
  return yi = function(c) {
    var u = this;
    if (typeof u != "function" || t.apply(u) !== n)
      throw new TypeError(e + u);
    for (var f = i(arguments, 1), d, p = function() {
      if (this instanceof d) {
        var P = u.apply(
          this,
          o(f, arguments)
        );
        return Object(P) === P ? P : this;
      }
      return u.apply(
        c,
        o(f, arguments)
      );
    }, h = r(0, u.length - f.length), y = [], m = 0; m < h; m++)
      y[m] = "$" + m;
    if (d = Function("binder", "return function (" + a(y, ",") + "){ return binder.apply(this,arguments); }")(p), u.prototype) {
      var v = function() {
      };
      v.prototype = u.prototype, d.prototype = new v(), v.prototype = null;
    }
    return d;
  }, yi;
}
var gi, bu;
function yn() {
  if (bu) return gi;
  bu = 1;
  var e = y1();
  return gi = Function.prototype.bind || e, gi;
}
var vi, wu;
function tc() {
  return wu || (wu = 1, vi = Function.prototype.call), vi;
}
var bi, xu;
function rc() {
  return xu || (xu = 1, bi = Function.prototype.apply), bi;
}
var wi, ju;
function g1() {
  return ju || (ju = 1, wi = typeof Reflect < "u" && Reflect && Reflect.apply), wi;
}
var xi, Su;
function Id() {
  if (Su) return xi;
  Su = 1;
  var e = yn(), t = rc(), r = tc(), n = g1();
  return xi = n || e.call(r, t), xi;
}
var ji, Nu;
function nc() {
  if (Nu) return ji;
  Nu = 1;
  var e = yn(), t = /* @__PURE__ */ mn(), r = tc(), n = Id();
  return ji = function(i) {
    if (i.length < 1 || typeof i[0] != "function")
      throw new t("a function is required");
    return n(e, r, i);
  }, ji;
}
var Si, Tu;
function v1() {
  if (Tu) return Si;
  Tu = 1;
  var e = nc(), t = /* @__PURE__ */ Mr(), r;
  try {
    r = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (a) {
    if (!a || typeof a != "object" || !("code" in a) || a.code !== "ERR_PROTO_ACCESS")
      throw a;
  }
  var n = !!r && t && t(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  ), o = Object, i = o.getPrototypeOf;
  return Si = n && typeof n.get == "function" ? e([n.get]) : typeof i == "function" ? (
    /** @type {import('./get')} */
    function(s) {
      return i(s == null ? s : o(s));
    }
  ) : !1, Si;
}
var Ni, Pu;
function oc() {
  if (Pu) return Ni;
  Pu = 1;
  var e = Dd(), t = Md(), r = /* @__PURE__ */ v1();
  return Ni = e ? function(o) {
    return e(o);
  } : t ? function(o) {
    if (!o || typeof o != "object" && typeof o != "function")
      throw new TypeError("getProto: not an object");
    return t(o);
  } : r ? function(o) {
    return r(o);
  } : null, Ni;
}
var Ti, Eu;
function kd() {
  if (Eu) return Ti;
  Eu = 1;
  var e = Function.prototype.call, t = Object.prototype.hasOwnProperty, r = yn();
  return Ti = r.call(e, t), Ti;
}
var Pi, Ou;
function Cd() {
  if (Ou) return Pi;
  Ou = 1;
  var e, t = /* @__PURE__ */ Rd(), r = /* @__PURE__ */ t1(), n = /* @__PURE__ */ r1(), o = /* @__PURE__ */ n1(), i = /* @__PURE__ */ o1(), a = /* @__PURE__ */ Ad(), s = /* @__PURE__ */ mn(), c = /* @__PURE__ */ i1(), u = /* @__PURE__ */ a1(), f = /* @__PURE__ */ s1(), d = /* @__PURE__ */ c1(), p = /* @__PURE__ */ u1(), h = /* @__PURE__ */ l1(), y = /* @__PURE__ */ f1(), m = /* @__PURE__ */ p1(), v = Function, P = function(L) {
    try {
      return v('"use strict"; return (' + L + ").constructor;")();
    } catch {
    }
  }, T = /* @__PURE__ */ Mr(), E = /* @__PURE__ */ Oo(), R = function() {
    throw new s();
  }, C = T ? (function() {
    try {
      return arguments.callee, R;
    } catch {
      try {
        return T(arguments, "callee").get;
      } catch {
        return R;
      }
    }
  })() : R, _ = m1()(), M = oc(), Z = Md(), $ = Dd(), G = rc(), B = tc(), N = {}, j = typeof Uint8Array > "u" || !M ? e : M(Uint8Array), D = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError > "u" ? e : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? e : ArrayBuffer,
    "%ArrayIteratorPrototype%": _ && M ? M([][Symbol.iterator]()) : e,
    "%AsyncFromSyncIteratorPrototype%": e,
    "%AsyncFunction%": N,
    "%AsyncGenerator%": N,
    "%AsyncGeneratorFunction%": N,
    "%AsyncIteratorPrototype%": N,
    "%Atomics%": typeof Atomics > "u" ? e : Atomics,
    "%BigInt%": typeof BigInt > "u" ? e : BigInt,
    "%BigInt64Array%": typeof BigInt64Array > "u" ? e : BigInt64Array,
    "%BigUint64Array%": typeof BigUint64Array > "u" ? e : BigUint64Array,
    "%Boolean%": Boolean,
    "%DataView%": typeof DataView > "u" ? e : DataView,
    "%Date%": Date,
    "%decodeURI%": decodeURI,
    "%decodeURIComponent%": decodeURIComponent,
    "%encodeURI%": encodeURI,
    "%encodeURIComponent%": encodeURIComponent,
    "%Error%": r,
    "%eval%": eval,
    // eslint-disable-line no-eval
    "%EvalError%": n,
    "%Float16Array%": typeof Float16Array > "u" ? e : Float16Array,
    "%Float32Array%": typeof Float32Array > "u" ? e : Float32Array,
    "%Float64Array%": typeof Float64Array > "u" ? e : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? e : FinalizationRegistry,
    "%Function%": v,
    "%GeneratorFunction%": N,
    "%Int8Array%": typeof Int8Array > "u" ? e : Int8Array,
    "%Int16Array%": typeof Int16Array > "u" ? e : Int16Array,
    "%Int32Array%": typeof Int32Array > "u" ? e : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": _ && M ? M(M([][Symbol.iterator]())) : e,
    "%JSON%": typeof JSON == "object" ? JSON : e,
    "%Map%": typeof Map > "u" ? e : Map,
    "%MapIteratorPrototype%": typeof Map > "u" || !_ || !M ? e : M((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": t,
    "%Object.getOwnPropertyDescriptor%": T,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise > "u" ? e : Promise,
    "%Proxy%": typeof Proxy > "u" ? e : Proxy,
    "%RangeError%": o,
    "%ReferenceError%": i,
    "%Reflect%": typeof Reflect > "u" ? e : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set > "u" ? e : Set,
    "%SetIteratorPrototype%": typeof Set > "u" || !_ || !M ? e : M((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? e : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": _ && M ? M(""[Symbol.iterator]()) : e,
    "%Symbol%": _ ? Symbol : e,
    "%SyntaxError%": a,
    "%ThrowTypeError%": C,
    "%TypedArray%": j,
    "%TypeError%": s,
    "%Uint8Array%": typeof Uint8Array > "u" ? e : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? e : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array > "u" ? e : Uint16Array,
    "%Uint32Array%": typeof Uint32Array > "u" ? e : Uint32Array,
    "%URIError%": c,
    "%WeakMap%": typeof WeakMap > "u" ? e : WeakMap,
    "%WeakRef%": typeof WeakRef > "u" ? e : WeakRef,
    "%WeakSet%": typeof WeakSet > "u" ? e : WeakSet,
    "%Function.prototype.call%": B,
    "%Function.prototype.apply%": G,
    "%Object.defineProperty%": E,
    "%Object.getPrototypeOf%": Z,
    "%Math.abs%": u,
    "%Math.floor%": f,
    "%Math.max%": d,
    "%Math.min%": p,
    "%Math.pow%": h,
    "%Math.round%": y,
    "%Math.sign%": m,
    "%Reflect.getPrototypeOf%": $
  };
  if (M)
    try {
      null.error;
    } catch (L) {
      var k = M(M(L));
      D["%Error.prototype%"] = k;
    }
  var A = function L(I) {
    var z;
    if (I === "%AsyncFunction%")
      z = P("async function () {}");
    else if (I === "%GeneratorFunction%")
      z = P("function* () {}");
    else if (I === "%AsyncGeneratorFunction%")
      z = P("async function* () {}");
    else if (I === "%AsyncGenerator%") {
      var q = L("%AsyncGeneratorFunction%");
      q && (z = q.prototype);
    } else if (I === "%AsyncIteratorPrototype%") {
      var re = L("%AsyncGenerator%");
      re && M && (z = M(re.prototype));
    }
    return D[I] = z, z;
  }, S = {
    __proto__: null,
    "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
    "%ArrayPrototype%": ["Array", "prototype"],
    "%ArrayProto_entries%": ["Array", "prototype", "entries"],
    "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
    "%ArrayProto_keys%": ["Array", "prototype", "keys"],
    "%ArrayProto_values%": ["Array", "prototype", "values"],
    "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
    "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
    "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
    "%BooleanPrototype%": ["Boolean", "prototype"],
    "%DataViewPrototype%": ["DataView", "prototype"],
    "%DatePrototype%": ["Date", "prototype"],
    "%ErrorPrototype%": ["Error", "prototype"],
    "%EvalErrorPrototype%": ["EvalError", "prototype"],
    "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
    "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
    "%FunctionPrototype%": ["Function", "prototype"],
    "%Generator%": ["GeneratorFunction", "prototype"],
    "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
    "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
    "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
    "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
    "%JSONParse%": ["JSON", "parse"],
    "%JSONStringify%": ["JSON", "stringify"],
    "%MapPrototype%": ["Map", "prototype"],
    "%NumberPrototype%": ["Number", "prototype"],
    "%ObjectPrototype%": ["Object", "prototype"],
    "%ObjProto_toString%": ["Object", "prototype", "toString"],
    "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
    "%PromisePrototype%": ["Promise", "prototype"],
    "%PromiseProto_then%": ["Promise", "prototype", "then"],
    "%Promise_all%": ["Promise", "all"],
    "%Promise_reject%": ["Promise", "reject"],
    "%Promise_resolve%": ["Promise", "resolve"],
    "%RangeErrorPrototype%": ["RangeError", "prototype"],
    "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
    "%RegExpPrototype%": ["RegExp", "prototype"],
    "%SetPrototype%": ["Set", "prototype"],
    "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
    "%StringPrototype%": ["String", "prototype"],
    "%SymbolPrototype%": ["Symbol", "prototype"],
    "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
    "%TypedArrayPrototype%": ["TypedArray", "prototype"],
    "%TypeErrorPrototype%": ["TypeError", "prototype"],
    "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
    "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
    "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
    "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
    "%URIErrorPrototype%": ["URIError", "prototype"],
    "%WeakMapPrototype%": ["WeakMap", "prototype"],
    "%WeakSetPrototype%": ["WeakSet", "prototype"]
  }, oe = yn(), J = /* @__PURE__ */ kd(), O = oe.call(B, Array.prototype.concat), pt = oe.call(G, Array.prototype.splice), g = oe.call(B, String.prototype.replace), b = oe.call(B, String.prototype.slice), x = oe.call(B, RegExp.prototype.exec), F = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, W = /\\(\\)?/g, V = function(I) {
    var z = b(I, 0, 1), q = b(I, -1);
    if (z === "%" && q !== "%")
      throw new a("invalid intrinsic syntax, expected closing `%`");
    if (q === "%" && z !== "%")
      throw new a("invalid intrinsic syntax, expected opening `%`");
    var re = [];
    return g(I, F, function(ne, de, X, tt) {
      re[re.length] = X ? g(tt, W, "$1") : de || ne;
    }), re;
  }, U = function(I, z) {
    var q = I, re;
    if (J(S, q) && (re = S[q], q = "%" + re[0] + "%"), J(D, q)) {
      var ne = D[q];
      if (ne === N && (ne = A(q)), typeof ne > "u" && !z)
        throw new s("intrinsic " + I + " exists, but is not available. Please file an issue!");
      return {
        alias: re,
        name: q,
        value: ne
      };
    }
    throw new a("intrinsic " + I + " does not exist!");
  };
  return Pi = function(I, z) {
    if (typeof I != "string" || I.length === 0)
      throw new s("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof z != "boolean")
      throw new s('"allowMissing" argument must be a boolean');
    if (x(/^%?[^%]*%?$/, I) === null)
      throw new a("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var q = V(I), re = q.length > 0 ? q[0] : "", ne = U("%" + re + "%", z), de = ne.name, X = ne.value, tt = !1, Ye = ne.alias;
    Ye && (re = Ye[0], pt(q, O([0, 1], Ye)));
    for (var w = 1, ge = !0; w < q.length; w += 1) {
      var Ze = q[w], vn = b(Ze, 0, 1), bn = b(Ze, -1);
      if ((vn === '"' || vn === "'" || vn === "`" || bn === '"' || bn === "'" || bn === "`") && vn !== bn)
        throw new a("property names with quotes must have matching quotes");
      if ((Ze === "constructor" || !ge) && (tt = !0), re += "." + Ze, de = "%" + re + "%", J(D, de))
        X = D[de];
      else if (X != null) {
        if (!(Ze in X)) {
          if (!z)
            throw new s("base intrinsic for " + I + " exists, but the property is not available.");
          return;
        }
        if (T && w + 1 >= q.length) {
          var wn = T(X, Ze);
          ge = !!wn, ge && "get" in wn && !("originalValue" in wn.get) ? X = wn.get : X = X[Ze];
        } else
          ge = J(X, Ze), X = X[Ze];
        ge && !tt && (D[de] = X);
      }
    }
    return X;
  }, Pi;
}
var Ei, Ru;
function gn() {
  if (Ru) return Ei;
  Ru = 1;
  var e = /* @__PURE__ */ Cd(), t = nc(), r = t([e("%String.prototype.indexOf%")]);
  return Ei = function(o, i) {
    var a = (
      /** @type {(this: unknown, ...args: unknown[]) => unknown} */
      e(o, !!i)
    );
    return typeof a == "function" && r(o, ".prototype.") > -1 ? t(
      /** @type {const} */
      [a]
    ) : a;
  }, Ei;
}
var Oi, Au;
function b1() {
  if (Au) return Oi;
  Au = 1;
  var e = Eo()(), t = /* @__PURE__ */ gn(), r = t("Object.prototype.toString"), n = function(s) {
    return e && s && typeof s == "object" && Symbol.toStringTag in s ? !1 : r(s) === "[object Arguments]";
  }, o = function(s) {
    return n(s) ? !0 : s !== null && typeof s == "object" && "length" in s && typeof s.length == "number" && s.length >= 0 && r(s) !== "[object Array]" && "callee" in s && r(s.callee) === "[object Function]";
  }, i = (function() {
    return n(arguments);
  })();
  return n.isLegacyArguments = o, Oi = i ? n : o, Oi;
}
var Ri, Du;
function w1() {
  if (Du) return Ri;
  Du = 1;
  var e = /* @__PURE__ */ gn(), t = Eo()(), r = /* @__PURE__ */ kd(), n = /* @__PURE__ */ Mr(), o;
  if (t) {
    var i = e("RegExp.prototype.exec"), a = {}, s = function() {
      throw a;
    }, c = {
      toString: s,
      valueOf: s
    };
    typeof Symbol.toPrimitive == "symbol" && (c[Symbol.toPrimitive] = s), o = function(p) {
      if (!p || typeof p != "object")
        return !1;
      var h = (
        /** @type {NonNullable<typeof gOPD>} */
        n(
          /** @type {{ lastIndex?: unknown }} */
          p,
          "lastIndex"
        )
      ), y = h && r(h, "value");
      if (!y)
        return !1;
      try {
        i(
          p,
          /** @type {string} */
          /** @type {unknown} */
          c
        );
      } catch (m) {
        return m === a;
      }
    };
  } else {
    var u = e("Object.prototype.toString"), f = "[object RegExp]";
    o = function(p) {
      return !p || typeof p != "object" && typeof p != "function" ? !1 : u(p) === f;
    };
  }
  return Ri = o, Ri;
}
var Ai, Mu;
function x1() {
  if (Mu) return Ai;
  Mu = 1;
  var e = /* @__PURE__ */ gn(), t = w1(), r = e("RegExp.prototype.exec"), n = /* @__PURE__ */ mn();
  return Ai = function(i) {
    if (!t(i))
      throw new n("`regex` must be a RegExp");
    return function(s) {
      return r(i, s) !== null;
    };
  }, Ai;
}
var Di, Iu;
function j1() {
  if (Iu) return Di;
  Iu = 1;
  const e = (
    /** @type {GeneratorFunctionConstructor} */
    (function* () {
    }).constructor
  );
  return Di = () => e, Di;
}
var Mi, ku;
function S1() {
  if (ku) return Mi;
  ku = 1;
  var e = /* @__PURE__ */ gn(), t = /* @__PURE__ */ x1(), r = t(/^\s*(?:function)?\*/), n = Eo()(), o = oc(), i = e("Object.prototype.toString"), a = e("Function.prototype.toString"), s = /* @__PURE__ */ j1();
  return Mi = function(u) {
    if (typeof u != "function")
      return !1;
    if (r(a(u)))
      return !0;
    if (!n) {
      var f = i(u);
      return f === "[object GeneratorFunction]";
    }
    if (!o)
      return !1;
    var d = s();
    return d && o(u) === d.prototype;
  }, Mi;
}
var Ii, Cu;
function N1() {
  if (Cu) return Ii;
  Cu = 1;
  var e = Function.prototype.toString, t = typeof Reflect == "object" && Reflect !== null && Reflect.apply, r, n;
  if (typeof t == "function" && typeof Object.defineProperty == "function")
    try {
      r = Object.defineProperty({}, "length", {
        get: function() {
          throw n;
        }
      }), n = {}, t(function() {
        throw 42;
      }, null, r);
    } catch (T) {
      T !== n && (t = null);
    }
  else
    t = null;
  var o = /^\s*class\b/, i = function(E) {
    try {
      var R = e.call(E);
      return o.test(R);
    } catch {
      return !1;
    }
  }, a = function(E) {
    try {
      return i(E) ? !1 : (e.call(E), !0);
    } catch {
      return !1;
    }
  }, s = Object.prototype.toString, c = "[object Object]", u = "[object Function]", f = "[object GeneratorFunction]", d = "[object HTMLAllCollection]", p = "[object HTML document.all class]", h = "[object HTMLCollection]", y = typeof Symbol == "function" && !!Symbol.toStringTag, m = !(0 in [,]), v = function() {
    return !1;
  };
  if (typeof document == "object") {
    var P = document.all;
    s.call(P) === s.call(document.all) && (v = function(E) {
      if ((m || !E) && (typeof E > "u" || typeof E == "object"))
        try {
          var R = s.call(E);
          return (R === d || R === p || R === h || R === c) && E("") == null;
        } catch {
        }
      return !1;
    });
  }
  return Ii = t ? function(E) {
    if (v(E))
      return !0;
    if (!E || typeof E != "function" && typeof E != "object")
      return !1;
    try {
      t(E, null, r);
    } catch (R) {
      if (R !== n)
        return !1;
    }
    return !i(E) && a(E);
  } : function(E) {
    if (v(E))
      return !0;
    if (!E || typeof E != "function" && typeof E != "object")
      return !1;
    if (y)
      return a(E);
    if (i(E))
      return !1;
    var R = s.call(E);
    return R !== u && R !== f && !/^\[object HTML/.test(R) ? !1 : a(E);
  }, Ii;
}
var ki, _u;
function T1() {
  if (_u) return ki;
  _u = 1;
  var e = N1(), t = Object.prototype.toString, r = Object.prototype.hasOwnProperty, n = function(c, u, f) {
    for (var d = 0, p = c.length; d < p; d++)
      r.call(c, d) && (f == null ? u(c[d], d, c) : u.call(f, c[d], d, c));
  }, o = function(c, u, f) {
    for (var d = 0, p = c.length; d < p; d++)
      f == null ? u(c.charAt(d), d, c) : u.call(f, c.charAt(d), d, c);
  }, i = function(c, u, f) {
    for (var d in c)
      r.call(c, d) && (f == null ? u(c[d], d, c) : u.call(f, c[d], d, c));
  };
  function a(s) {
    return t.call(s) === "[object Array]";
  }
  return ki = function(c, u, f) {
    if (!e(u))
      throw new TypeError("iterator must be a function");
    var d;
    arguments.length >= 3 && (d = f), a(c) ? n(c, u, d) : typeof c == "string" ? o(c, u, d) : i(c, u, d);
  }, ki;
}
var Ci, Fu;
function P1() {
  return Fu || (Fu = 1, Ci = [
    "Float16Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array"
  ]), Ci;
}
var _i, Bu;
function E1() {
  if (Bu) return _i;
  Bu = 1;
  var e = /* @__PURE__ */ P1(), t = typeof globalThis > "u" ? rl : globalThis;
  return _i = function() {
    for (var n = [], o = 0; o < e.length; o++)
      typeof t[e[o]] == "function" && (n[n.length] = e[o]);
    return n;
  }, _i;
}
var Fi = { exports: {} }, Bi, Lu;
function O1() {
  if (Lu) return Bi;
  Lu = 1;
  var e = /* @__PURE__ */ Oo(), t = /* @__PURE__ */ Ad(), r = /* @__PURE__ */ mn(), n = /* @__PURE__ */ Mr();
  return Bi = function(i, a, s) {
    if (!i || typeof i != "object" && typeof i != "function")
      throw new r("`obj` must be an object or a function`");
    if (typeof a != "string" && typeof a != "symbol")
      throw new r("`property` must be a string or a symbol`");
    if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
      throw new r("`nonEnumerable`, if provided, must be a boolean or null");
    if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
      throw new r("`nonWritable`, if provided, must be a boolean or null");
    if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
      throw new r("`nonConfigurable`, if provided, must be a boolean or null");
    if (arguments.length > 6 && typeof arguments[6] != "boolean")
      throw new r("`loose`, if provided, must be a boolean");
    var c = arguments.length > 3 ? arguments[3] : null, u = arguments.length > 4 ? arguments[4] : null, f = arguments.length > 5 ? arguments[5] : null, d = arguments.length > 6 ? arguments[6] : !1, p = !!n && n(i, a);
    if (e)
      e(i, a, {
        configurable: f === null && p ? p.configurable : !f,
        enumerable: c === null && p ? p.enumerable : !c,
        value: s,
        writable: u === null && p ? p.writable : !u
      });
    else if (d || !c && !u && !f)
      i[a] = s;
    else
      throw new t("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
  }, Bi;
}
var Li, $u;
function R1() {
  if ($u) return Li;
  $u = 1;
  var e = /* @__PURE__ */ Oo(), t = function() {
    return !!e;
  };
  return t.hasArrayLengthDefineBug = function() {
    if (!e)
      return null;
    try {
      return e([], "length", { value: 1 }).length !== 1;
    } catch {
      return !0;
    }
  }, Li = t, Li;
}
var $i, qu;
function A1() {
  if (qu) return $i;
  qu = 1;
  var e = /* @__PURE__ */ Cd(), t = /* @__PURE__ */ O1(), r = /* @__PURE__ */ R1()(), n = /* @__PURE__ */ Mr(), o = /* @__PURE__ */ mn(), i = e("%Math.floor%");
  return $i = function(s, c) {
    if (typeof s != "function")
      throw new o("`fn` is not a function");
    if (typeof c != "number" || c < 0 || c > 4294967295 || i(c) !== c)
      throw new o("`length` must be a positive 32-bit integer");
    var u = arguments.length > 2 && !!arguments[2], f = !0, d = !0;
    if ("length" in s && n) {
      var p = n(s, "length");
      p && !p.configurable && (f = !1), p && !p.writable && (d = !1);
    }
    return (f || d || !u) && (r ? t(
      /** @type {Parameters<define>[0]} */
      s,
      "length",
      c,
      !0,
      !0
    ) : t(
      /** @type {Parameters<define>[0]} */
      s,
      "length",
      c
    )), s;
  }, $i;
}
var qi, Uu;
function D1() {
  if (Uu) return qi;
  Uu = 1;
  var e = yn(), t = rc(), r = Id();
  return qi = function() {
    return r(e, t, arguments);
  }, qi;
}
var zu;
function M1() {
  return zu || (zu = 1, (function(e) {
    var t = /* @__PURE__ */ A1(), r = /* @__PURE__ */ Oo(), n = nc(), o = D1();
    e.exports = function(a) {
      var s = n(arguments), c = 1 + a.length - (arguments.length - 1);
      return t(
        s,
        c > 0 ? c : 0,
        !0
      );
    }, r ? r(e.exports, "apply", { value: o }) : e.exports.apply = o;
  })(Fi)), Fi.exports;
}
var Ui, Yu;
function _d() {
  if (Yu) return Ui;
  Yu = 1;
  var e = T1(), t = /* @__PURE__ */ E1(), r = M1(), n = /* @__PURE__ */ gn(), o = /* @__PURE__ */ Mr(), i = oc(), a = n("Object.prototype.toString"), s = Eo()(), c = typeof globalThis > "u" ? rl : globalThis, u = t(), f = n("String.prototype.slice"), d = n("Array.prototype.indexOf", !0) || function(v, P) {
    for (var T = 0; T < v.length; T += 1)
      if (v[T] === P)
        return T;
    return -1;
  }, p = { __proto__: null };
  s && o && i ? e(u, function(m) {
    var v = new c[m]();
    if (Symbol.toStringTag in v && i) {
      var P = i(v), T = o(P, Symbol.toStringTag);
      if (!T && P) {
        var E = i(P);
        T = o(E, Symbol.toStringTag);
      }
      if (T && T.get) {
        var R = r(T.get);
        p[
          /** @type {`$${import('.').TypedArrayName}`} */
          "$" + m
        ] = R;
      }
    }
  }) : e(u, function(m) {
    var v = new c[m](), P = v.slice || v.set;
    if (P) {
      var T = (
        /** @type {import('./types').BoundSlice | import('./types').BoundSet} */
        // @ts-expect-error TODO FIXME
        r(P)
      );
      p[
        /** @type {`$${import('.').TypedArrayName}`} */
        "$" + m
      ] = T;
    }
  });
  var h = function(v) {
    var P = !1;
    return e(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      p,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(T, E) {
        if (!P)
          try {
            "$" + T(v) === E && (P = /** @type {import('.').TypedArrayName} */
            f(E, 1));
          } catch {
          }
      }
    ), P;
  }, y = function(v) {
    var P = !1;
    return e(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      p,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(T, E) {
        if (!P)
          try {
            T(v), P = /** @type {import('.').TypedArrayName} */
            f(E, 1);
          } catch {
          }
      }
    ), P;
  };
  return Ui = function(v) {
    if (!v || typeof v != "object")
      return !1;
    if (!s) {
      var P = f(a(v), 8, -1);
      return d(u, P) > -1 ? P : P !== "Object" ? !1 : y(v);
    }
    return o ? h(v) : null;
  }, Ui;
}
var zi, Zu;
function I1() {
  if (Zu) return zi;
  Zu = 1;
  var e = /* @__PURE__ */ _d();
  return zi = function(r) {
    return !!e(r);
  }, zi;
}
var Wu;
function k1() {
  return Wu || (Wu = 1, (function(e) {
    var t = /* @__PURE__ */ b1(), r = S1(), n = /* @__PURE__ */ _d(), o = /* @__PURE__ */ I1();
    function i(w) {
      return w.call.bind(w);
    }
    var a = typeof BigInt < "u", s = typeof Symbol < "u", c = i(Object.prototype.toString), u = i(Number.prototype.valueOf), f = i(String.prototype.valueOf), d = i(Boolean.prototype.valueOf);
    if (a)
      var p = i(BigInt.prototype.valueOf);
    if (s)
      var h = i(Symbol.prototype.valueOf);
    function y(w, ge) {
      if (typeof w != "object")
        return !1;
      try {
        return ge(w), !0;
      } catch {
        return !1;
      }
    }
    e.isArgumentsObject = t, e.isGeneratorFunction = r, e.isTypedArray = o;
    function m(w) {
      return typeof Promise < "u" && w instanceof Promise || w !== null && typeof w == "object" && typeof w.then == "function" && typeof w.catch == "function";
    }
    e.isPromise = m;
    function v(w) {
      return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(w) : o(w) || b(w);
    }
    e.isArrayBufferView = v;
    function P(w) {
      return n(w) === "Uint8Array";
    }
    e.isUint8Array = P;
    function T(w) {
      return n(w) === "Uint8ClampedArray";
    }
    e.isUint8ClampedArray = T;
    function E(w) {
      return n(w) === "Uint16Array";
    }
    e.isUint16Array = E;
    function R(w) {
      return n(w) === "Uint32Array";
    }
    e.isUint32Array = R;
    function C(w) {
      return n(w) === "Int8Array";
    }
    e.isInt8Array = C;
    function _(w) {
      return n(w) === "Int16Array";
    }
    e.isInt16Array = _;
    function M(w) {
      return n(w) === "Int32Array";
    }
    e.isInt32Array = M;
    function Z(w) {
      return n(w) === "Float32Array";
    }
    e.isFloat32Array = Z;
    function $(w) {
      return n(w) === "Float64Array";
    }
    e.isFloat64Array = $;
    function G(w) {
      return n(w) === "BigInt64Array";
    }
    e.isBigInt64Array = G;
    function B(w) {
      return n(w) === "BigUint64Array";
    }
    e.isBigUint64Array = B;
    function N(w) {
      return c(w) === "[object Map]";
    }
    N.working = typeof Map < "u" && N(/* @__PURE__ */ new Map());
    function j(w) {
      return typeof Map > "u" ? !1 : N.working ? N(w) : w instanceof Map;
    }
    e.isMap = j;
    function D(w) {
      return c(w) === "[object Set]";
    }
    D.working = typeof Set < "u" && D(/* @__PURE__ */ new Set());
    function k(w) {
      return typeof Set > "u" ? !1 : D.working ? D(w) : w instanceof Set;
    }
    e.isSet = k;
    function A(w) {
      return c(w) === "[object WeakMap]";
    }
    A.working = typeof WeakMap < "u" && A(/* @__PURE__ */ new WeakMap());
    function S(w) {
      return typeof WeakMap > "u" ? !1 : A.working ? A(w) : w instanceof WeakMap;
    }
    e.isWeakMap = S;
    function oe(w) {
      return c(w) === "[object WeakSet]";
    }
    oe.working = typeof WeakSet < "u" && oe(/* @__PURE__ */ new WeakSet());
    function J(w) {
      return oe(w);
    }
    e.isWeakSet = J;
    function O(w) {
      return c(w) === "[object ArrayBuffer]";
    }
    O.working = typeof ArrayBuffer < "u" && O(new ArrayBuffer());
    function pt(w) {
      return typeof ArrayBuffer > "u" ? !1 : O.working ? O(w) : w instanceof ArrayBuffer;
    }
    e.isArrayBuffer = pt;
    function g(w) {
      return c(w) === "[object DataView]";
    }
    g.working = typeof ArrayBuffer < "u" && typeof DataView < "u" && g(new DataView(new ArrayBuffer(1), 0, 1));
    function b(w) {
      return typeof DataView > "u" ? !1 : g.working ? g(w) : w instanceof DataView;
    }
    e.isDataView = b;
    var x = typeof SharedArrayBuffer < "u" ? SharedArrayBuffer : void 0;
    function F(w) {
      return c(w) === "[object SharedArrayBuffer]";
    }
    function W(w) {
      return typeof x > "u" ? !1 : (typeof F.working > "u" && (F.working = F(new x())), F.working ? F(w) : w instanceof x);
    }
    e.isSharedArrayBuffer = W;
    function V(w) {
      return c(w) === "[object AsyncFunction]";
    }
    e.isAsyncFunction = V;
    function U(w) {
      return c(w) === "[object Map Iterator]";
    }
    e.isMapIterator = U;
    function L(w) {
      return c(w) === "[object Set Iterator]";
    }
    e.isSetIterator = L;
    function I(w) {
      return c(w) === "[object Generator]";
    }
    e.isGeneratorObject = I;
    function z(w) {
      return c(w) === "[object WebAssembly.Module]";
    }
    e.isWebAssemblyCompiledModule = z;
    function q(w) {
      return y(w, u);
    }
    e.isNumberObject = q;
    function re(w) {
      return y(w, f);
    }
    e.isStringObject = re;
    function ne(w) {
      return y(w, d);
    }
    e.isBooleanObject = ne;
    function de(w) {
      return a && y(w, p);
    }
    e.isBigIntObject = de;
    function X(w) {
      return s && y(w, h);
    }
    e.isSymbolObject = X;
    function tt(w) {
      return q(w) || re(w) || ne(w) || de(w) || X(w);
    }
    e.isBoxedPrimitive = tt;
    function Ye(w) {
      return typeof Uint8Array < "u" && (pt(w) || W(w));
    }
    e.isAnyArrayBuffer = Ye, ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(w) {
      Object.defineProperty(e, w, {
        enumerable: !1,
        value: function() {
          throw new Error(w + " is not supported in userland");
        }
      });
    });
  })(Zo)), Zo;
}
var Yi, Hu;
function C1() {
  return Hu || (Hu = 1, Yi = function(t) {
    return t && typeof t == "object" && typeof t.copy == "function" && typeof t.fill == "function" && typeof t.readUInt8 == "function";
  }), Yi;
}
var Nn = { exports: {} }, Vu;
function _1() {
  return Vu || (Vu = 1, typeof Object.create == "function" ? Nn.exports = function(t, r) {
    r && (t.super_ = r, t.prototype = Object.create(r.prototype, {
      constructor: {
        value: t,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  } : Nn.exports = function(t, r) {
    if (r) {
      t.super_ = r;
      var n = function() {
      };
      n.prototype = r.prototype, t.prototype = new n(), t.prototype.constructor = t;
    }
  }), Nn.exports;
}
var Gu;
function F1() {
  return Gu || (Gu = 1, (function(e) {
    var t = Object.getOwnPropertyDescriptors || function(b) {
      for (var x = Object.keys(b), F = {}, W = 0; W < x.length; W++)
        F[x[W]] = Object.getOwnPropertyDescriptor(b, x[W]);
      return F;
    }, r = /%[sdj%]/g;
    e.format = function(g) {
      if (!C(g)) {
        for (var b = [], x = 0; x < arguments.length; x++)
          b.push(a(arguments[x]));
        return b.join(" ");
      }
      for (var x = 1, F = arguments, W = F.length, V = String(g).replace(r, function(L) {
        if (L === "%%") return "%";
        if (x >= W) return L;
        switch (L) {
          case "%s":
            return String(F[x++]);
          case "%d":
            return Number(F[x++]);
          case "%j":
            try {
              return JSON.stringify(F[x++]);
            } catch {
              return "[Circular]";
            }
          default:
            return L;
        }
      }), U = F[x]; x < W; U = F[++x])
        T(U) || !$(U) ? V += " " + U : V += " " + a(U);
      return V;
    }, e.deprecate = function(g, b) {
      if (typeof process < "u" && process.noDeprecation === !0)
        return g;
      if (typeof process > "u")
        return function() {
          return e.deprecate(g, b).apply(this, arguments);
        };
      var x = !1;
      function F() {
        if (!x) {
          if (process.throwDeprecation)
            throw new Error(b);
          process.traceDeprecation ? console.trace(b) : console.error(b), x = !0;
        }
        return g.apply(this, arguments);
      }
      return F;
    };
    var n = {}, o = /^$/;
    if (process.env.NODE_DEBUG) {
      var i = process.env.NODE_DEBUG;
      i = i.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(), o = new RegExp("^" + i + "$", "i");
    }
    e.debuglog = function(g) {
      if (g = g.toUpperCase(), !n[g])
        if (o.test(g)) {
          var b = process.pid;
          n[g] = function() {
            var x = e.format.apply(e, arguments);
            console.error("%s %d: %s", g, b, x);
          };
        } else
          n[g] = function() {
          };
      return n[g];
    };
    function a(g, b) {
      var x = {
        seen: [],
        stylize: c
      };
      return arguments.length >= 3 && (x.depth = arguments[2]), arguments.length >= 4 && (x.colors = arguments[3]), P(b) ? x.showHidden = b : b && e._extend(x, b), M(x.showHidden) && (x.showHidden = !1), M(x.depth) && (x.depth = 2), M(x.colors) && (x.colors = !1), M(x.customInspect) && (x.customInspect = !0), x.colors && (x.stylize = s), f(x, g, x.depth);
    }
    e.inspect = a, a.colors = {
      bold: [1, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      white: [37, 39],
      grey: [90, 39],
      black: [30, 39],
      blue: [34, 39],
      cyan: [36, 39],
      green: [32, 39],
      magenta: [35, 39],
      red: [31, 39],
      yellow: [33, 39]
    }, a.styles = {
      special: "cyan",
      number: "yellow",
      boolean: "yellow",
      undefined: "grey",
      null: "bold",
      string: "green",
      date: "magenta",
      // "name": intentionally not styling
      regexp: "red"
    };
    function s(g, b) {
      var x = a.styles[b];
      return x ? "\x1B[" + a.colors[x][0] + "m" + g + "\x1B[" + a.colors[x][1] + "m" : g;
    }
    function c(g, b) {
      return g;
    }
    function u(g) {
      var b = {};
      return g.forEach(function(x, F) {
        b[x] = !0;
      }), b;
    }
    function f(g, b, x) {
      if (g.customInspect && b && N(b.inspect) && // Filter out the util module, it's inspect function is special
      b.inspect !== e.inspect && // Also filter out any prototype objects using the circular check.
      !(b.constructor && b.constructor.prototype === b)) {
        var F = b.inspect(x, g);
        return C(F) || (F = f(g, F, x)), F;
      }
      var W = d(g, b);
      if (W)
        return W;
      var V = Object.keys(b), U = u(V);
      if (g.showHidden && (V = Object.getOwnPropertyNames(b)), B(b) && (V.indexOf("message") >= 0 || V.indexOf("description") >= 0))
        return p(b);
      if (V.length === 0) {
        if (N(b)) {
          var L = b.name ? ": " + b.name : "";
          return g.stylize("[Function" + L + "]", "special");
        }
        if (Z(b))
          return g.stylize(RegExp.prototype.toString.call(b), "regexp");
        if (G(b))
          return g.stylize(Date.prototype.toString.call(b), "date");
        if (B(b))
          return p(b);
      }
      var I = "", z = !1, q = ["{", "}"];
      if (v(b) && (z = !0, q = ["[", "]"]), N(b)) {
        var re = b.name ? ": " + b.name : "";
        I = " [Function" + re + "]";
      }
      if (Z(b) && (I = " " + RegExp.prototype.toString.call(b)), G(b) && (I = " " + Date.prototype.toUTCString.call(b)), B(b) && (I = " " + p(b)), V.length === 0 && (!z || b.length == 0))
        return q[0] + I + q[1];
      if (x < 0)
        return Z(b) ? g.stylize(RegExp.prototype.toString.call(b), "regexp") : g.stylize("[Object]", "special");
      g.seen.push(b);
      var ne;
      return z ? ne = h(g, b, x, U, V) : ne = V.map(function(de) {
        return y(g, b, x, U, de, z);
      }), g.seen.pop(), m(ne, I, q);
    }
    function d(g, b) {
      if (M(b))
        return g.stylize("undefined", "undefined");
      if (C(b)) {
        var x = "'" + JSON.stringify(b).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return g.stylize(x, "string");
      }
      if (R(b))
        return g.stylize("" + b, "number");
      if (P(b))
        return g.stylize("" + b, "boolean");
      if (T(b))
        return g.stylize("null", "null");
    }
    function p(g) {
      return "[" + Error.prototype.toString.call(g) + "]";
    }
    function h(g, b, x, F, W) {
      for (var V = [], U = 0, L = b.length; U < L; ++U)
        oe(b, String(U)) ? V.push(y(
          g,
          b,
          x,
          F,
          String(U),
          !0
        )) : V.push("");
      return W.forEach(function(I) {
        I.match(/^\d+$/) || V.push(y(
          g,
          b,
          x,
          F,
          I,
          !0
        ));
      }), V;
    }
    function y(g, b, x, F, W, V) {
      var U, L, I;
      if (I = Object.getOwnPropertyDescriptor(b, W) || { value: b[W] }, I.get ? I.set ? L = g.stylize("[Getter/Setter]", "special") : L = g.stylize("[Getter]", "special") : I.set && (L = g.stylize("[Setter]", "special")), oe(F, W) || (U = "[" + W + "]"), L || (g.seen.indexOf(I.value) < 0 ? (T(x) ? L = f(g, I.value, null) : L = f(g, I.value, x - 1), L.indexOf(`
`) > -1 && (V ? L = L.split(`
`).map(function(z) {
        return "  " + z;
      }).join(`
`).slice(2) : L = `
` + L.split(`
`).map(function(z) {
        return "   " + z;
      }).join(`
`))) : L = g.stylize("[Circular]", "special")), M(U)) {
        if (V && W.match(/^\d+$/))
          return L;
        U = JSON.stringify("" + W), U.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (U = U.slice(1, -1), U = g.stylize(U, "name")) : (U = U.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), U = g.stylize(U, "string"));
      }
      return U + ": " + L;
    }
    function m(g, b, x) {
      var F = g.reduce(function(W, V) {
        return V.indexOf(`
`) >= 0, W + V.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      return F > 60 ? x[0] + (b === "" ? "" : b + `
 `) + " " + g.join(`,
  `) + " " + x[1] : x[0] + b + " " + g.join(", ") + " " + x[1];
    }
    e.types = k1();
    function v(g) {
      return Array.isArray(g);
    }
    e.isArray = v;
    function P(g) {
      return typeof g == "boolean";
    }
    e.isBoolean = P;
    function T(g) {
      return g === null;
    }
    e.isNull = T;
    function E(g) {
      return g == null;
    }
    e.isNullOrUndefined = E;
    function R(g) {
      return typeof g == "number";
    }
    e.isNumber = R;
    function C(g) {
      return typeof g == "string";
    }
    e.isString = C;
    function _(g) {
      return typeof g == "symbol";
    }
    e.isSymbol = _;
    function M(g) {
      return g === void 0;
    }
    e.isUndefined = M;
    function Z(g) {
      return $(g) && D(g) === "[object RegExp]";
    }
    e.isRegExp = Z, e.types.isRegExp = Z;
    function $(g) {
      return typeof g == "object" && g !== null;
    }
    e.isObject = $;
    function G(g) {
      return $(g) && D(g) === "[object Date]";
    }
    e.isDate = G, e.types.isDate = G;
    function B(g) {
      return $(g) && (D(g) === "[object Error]" || g instanceof Error);
    }
    e.isError = B, e.types.isNativeError = B;
    function N(g) {
      return typeof g == "function";
    }
    e.isFunction = N;
    function j(g) {
      return g === null || typeof g == "boolean" || typeof g == "number" || typeof g == "string" || typeof g == "symbol" || // ES6 symbol
      typeof g > "u";
    }
    e.isPrimitive = j, e.isBuffer = C1();
    function D(g) {
      return Object.prototype.toString.call(g);
    }
    function k(g) {
      return g < 10 ? "0" + g.toString(10) : g.toString(10);
    }
    var A = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    function S() {
      var g = /* @__PURE__ */ new Date(), b = [
        k(g.getHours()),
        k(g.getMinutes()),
        k(g.getSeconds())
      ].join(":");
      return [g.getDate(), A[g.getMonth()], b].join(" ");
    }
    e.log = function() {
      console.log("%s - %s", S(), e.format.apply(e, arguments));
    }, e.inherits = _1(), e._extend = function(g, b) {
      if (!b || !$(b)) return g;
      for (var x = Object.keys(b), F = x.length; F--; )
        g[x[F]] = b[x[F]];
      return g;
    };
    function oe(g, b) {
      return Object.prototype.hasOwnProperty.call(g, b);
    }
    var J = typeof Symbol < "u" ? /* @__PURE__ */ Symbol("util.promisify.custom") : void 0;
    e.promisify = function(b) {
      if (typeof b != "function")
        throw new TypeError('The "original" argument must be of type Function');
      if (J && b[J]) {
        var x = b[J];
        if (typeof x != "function")
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        return Object.defineProperty(x, J, {
          value: x,
          enumerable: !1,
          writable: !1,
          configurable: !0
        }), x;
      }
      function x() {
        for (var F, W, V = new Promise(function(I, z) {
          F = I, W = z;
        }), U = [], L = 0; L < arguments.length; L++)
          U.push(arguments[L]);
        U.push(function(I, z) {
          I ? W(I) : F(z);
        });
        try {
          b.apply(this, U);
        } catch (I) {
          W(I);
        }
        return V;
      }
      return Object.setPrototypeOf(x, Object.getPrototypeOf(b)), J && Object.defineProperty(x, J, {
        value: x,
        enumerable: !1,
        writable: !1,
        configurable: !0
      }), Object.defineProperties(
        x,
        t(b)
      );
    }, e.promisify.custom = J;
    function O(g, b) {
      if (!g) {
        var x = new Error("Promise was rejected with a falsy value");
        x.reason = g, g = x;
      }
      return b(g);
    }
    function pt(g) {
      if (typeof g != "function")
        throw new TypeError('The "original" argument must be of type Function');
      function b() {
        for (var x = [], F = 0; F < arguments.length; F++)
          x.push(arguments[F]);
        var W = x.pop();
        if (typeof W != "function")
          throw new TypeError("The last argument must be of type Function");
        var V = this, U = function() {
          return W.apply(V, arguments);
        };
        g.apply(this, x).then(
          function(L) {
            process.nextTick(U.bind(null, null, L));
          },
          function(L) {
            process.nextTick(O.bind(null, L, U));
          }
        );
      }
      return Object.setPrototypeOf(b, Object.getPrototypeOf(g)), Object.defineProperties(
        b,
        t(g)
      ), b;
    }
    e.callbackify = pt;
  })(Yo)), Yo;
}
function ce(e) {
  if (e === null || e === !0 || e === !1)
    return NaN;
  var t = Number(e);
  return isNaN(t) ? t : t < 0 ? Math.ceil(t) : Math.floor(t);
}
function Qt(e, t) {
  if (t.length < e)
    throw new TypeError(e + " argument" + (e > 1 ? "s" : "") + " required, but only " + t.length + " present");
}
function ic(e) {
  Qt(1, arguments);
  var t = Object.prototype.toString.call(e);
  return e instanceof Date || $r(e) === "object" && t === "[object Date]" ? new Date(e.getTime()) : typeof e == "number" || t === "[object Number]" ? new Date(e) : ((typeof e == "string" || t === "[object String]") && typeof console < "u" && (console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"), console.warn(new Error().stack)), /* @__PURE__ */ new Date(NaN));
}
function Fd(e, t) {
  Qt(2, arguments);
  var r = ic(e), n = ce(t);
  return isNaN(n) ? /* @__PURE__ */ new Date(NaN) : (n && r.setDate(r.getDate() + n), r);
}
function Bd(e, t) {
  Qt(2, arguments);
  var r = ic(e), n = ce(t);
  if (isNaN(n))
    return /* @__PURE__ */ new Date(NaN);
  if (!n)
    return r;
  var o = r.getDate(), i = new Date(r.getTime());
  i.setMonth(r.getMonth() + n + 1, 0);
  var a = i.getDate();
  return o >= a ? i : (r.setFullYear(i.getFullYear(), i.getMonth(), o), r);
}
function B1(e, t) {
  if (Qt(2, arguments), !t || $r(t) !== "object") return /* @__PURE__ */ new Date(NaN);
  var r = t.years ? ce(t.years) : 0, n = t.months ? ce(t.months) : 0, o = t.weeks ? ce(t.weeks) : 0, i = t.days ? ce(t.days) : 0, a = t.hours ? ce(t.hours) : 0, s = t.minutes ? ce(t.minutes) : 0, c = t.seconds ? ce(t.seconds) : 0, u = ic(e), f = n || r ? Bd(u, n + r * 12) : u, d = i || o ? Fd(f, i + o * 7) : f, p = s + a * 60, h = c + p * 60, y = h * 1e3, m = new Date(d.getTime() + y);
  return m;
}
const L1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: B1
}, Symbol.toStringTag, { value: "Module" })), $1 = /* @__PURE__ */ ua(L1);
function q1(e, t) {
  Qt(2, arguments);
  var r = ce(t);
  return Fd(e, -r);
}
function U1(e, t) {
  Qt(2, arguments);
  var r = ce(t);
  return Bd(e, -r);
}
function z1(e, t) {
  if (Qt(2, arguments), !t || $r(t) !== "object") return /* @__PURE__ */ new Date(NaN);
  var r = t.years ? ce(t.years) : 0, n = t.months ? ce(t.months) : 0, o = t.weeks ? ce(t.weeks) : 0, i = t.days ? ce(t.days) : 0, a = t.hours ? ce(t.hours) : 0, s = t.minutes ? ce(t.minutes) : 0, c = t.seconds ? ce(t.seconds) : 0, u = U1(e, n + r * 12), f = q1(u, i + o * 7), d = s + a * 60, p = c + d * 60, h = p * 1e3, y = new Date(f.getTime() - h);
  return y;
}
const Y1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: z1
}, Symbol.toStringTag, { value: "Module" })), Z1 = /* @__PURE__ */ ua(Y1);
var Zi, Ju;
function W1() {
  if (Ju) return Zi;
  Ju = 1;
  const e = F1(), n = {
    add: $1,
    sub: Z1
  }, o = {
    d: "days",
    w: "weeks",
    M: "months",
    y: "years",
    h: "hours",
    m: "minutes",
    s: "seconds"
  }, i = (a) => a.toISOString().replace("T", " ").replace(/\.[0-9]{3}Z/, "");
  return Zi = {
    ungroup(a) {
      return a.yg ? a.yg : a;
    },
    unescape(a) {
      const s = new RegExp(`\\\\(['"])`, "g");
      return a.replace(s, "$1");
    },
    stringToRegExp(a, s) {
      let c = a.replace(/[.*+?^$(){}|[\]\\]/g, "\\$&");
      return s === "^" ? c = "^" + c : s === "$" && (c = c + "$"), new RegExp(c, "i");
    },
    relDateToAbsolute(a, s, c) {
      if (this.preserveRelativeDates)
        return { $relativeDate: { op: a, amount: Number(s), unit: o[c] } };
      const u = /* @__PURE__ */ new Date(), f = n[a](u, { [o[c]]: s });
      return i(f);
    },
    debug() {
      if (!process.env.DEBUG || !/nql/.test(process.env.DEBUG))
        return;
      const a = arguments[0], s = Array.prototype.slice.call(arguments, 1), c = [a];
      s.forEach(function(u) {
        c.push(e.inspect(u, !1, null));
      }), console.log.apply(this, c);
    }
  }, Zi;
}
var Tn = { exports: {} };
const H1 = {}, V1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: H1
}, Symbol.toStringTag, { value: "Module" })), Ku = /* @__PURE__ */ ua(V1);
var Qu;
function G1() {
  return Qu || (Qu = 1, (function(e, t) {
    var r = (function() {
      var n = function(B, N, j, D) {
        for (j = j || {}, D = B.length; D--; j[B[D]] = N) ;
        return j;
      }, o = [1, 5], i = [1, 7], a = [1, 8], s = [1, 6, 10], c = [1, 9], u = [1, 6, 8, 10], f = [1, 24], d = [1, 25], p = [1, 26], h = [1, 27], y = [1, 28], m = [1, 29], v = [1, 30], P = [1, 17], T = [1, 18], E = [1, 19], R = [21, 22, 23, 24, 25, 29, 30], C = [1, 6, 8, 10, 18], _ = [1, 47], M = [6, 18], Z = {
        trace: function() {
        },
        yy: {},
        symbols_: { error: 2, expressions: 3, expression: 4, andCondition: 5, OR: 6, filterExpr: 7, AND: 8, LPAREN: 9, RPAREN: 10, propExpr: 11, valueExpr: 12, PROP: 13, NOT: 14, REGEXPOP: 15, LBRACKET: 16, inExpr: 17, RBRACKET: 18, OP: 19, VALUE: 20, NULL: 21, TRUE: 22, FALSE: 23, NUMBER: 24, NOW: 25, DATEOP: 26, AMOUNT: 27, INTERVAL: 28, LITERAL: 29, STRING: 30, ADD: 31, SUB: 32, CONTAINS: 33, STARTSWITH: 34, ENDSWITH: 35, GT: 36, LT: 37, GTE: 38, LTE: 39, $accept: 0, $end: 1 },
        terminals_: { 2: "error", 6: "OR", 8: "AND", 9: "LPAREN", 10: "RPAREN", 13: "PROP", 14: "NOT", 16: "LBRACKET", 18: "RBRACKET", 21: "NULL", 22: "TRUE", 23: "FALSE", 24: "NUMBER", 25: "NOW", 27: "AMOUNT", 28: "INTERVAL", 29: "LITERAL", 30: "STRING", 31: "ADD", 32: "SUB", 33: "CONTAINS", 34: "STARTSWITH", 35: "ENDSWITH", 36: "GT", 37: "LT", 38: "GTE", 39: "LTE" },
        productions_: [0, [3, 1], [4, 1], [4, 3], [5, 1], [5, 3], [7, 3], [7, 2], [11, 1], [12, 2], [12, 1], [12, 4], [12, 3], [12, 2], [12, 1], [17, 3], [17, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 4], [20, 1], [20, 1], [26, 1], [26, 1], [15, 2], [15, 2], [15, 2], [19, 1], [19, 1], [19, 1], [19, 1], [19, 1]],
        performAction: function(N, j, D, k, A, S, oe, J) {
          var O = S.length - 1;
          switch (A) {
            case 1:
              return k.debug("expression", S[O]), k.debug("opt", J), S[O] && S[O].yg ? S[O].yg : S[O];
            case 2:
              k.debug("andCondition", S[O]), this.$ = S[O];
              break;
            case 3:
              k.debug("expression OR andCondition", S[O - 2], S[O]), S[O - 2] = S[O - 2].$or ? S[O - 2] : { $or: [k.ungroup(S[O - 2])] }, S[O - 2].$or.push(k.ungroup(S[O])), this.$ = S[O - 2];
              break;
            case 4:
              k.debug("filterExpr", S[O]), this.$ = S[O];
              break;
            case 5:
              k.debug("andCondition AND filterExpr", S[O - 2], S[O]), S[O - 2] = S[O - 2].$and ? S[O - 2] : { $and: [k.ungroup(S[O - 2])] }, S[O - 2].$and.push(k.ungroup(S[O])), this.$ = S[O - 2];
              break;
            case 6:
              k.debug("LPAREN expression RPAREN", S[O - 1]), this.$ = { yg: S[O - 1] };
              break;
            case 7:
              this.$ = { [S[O - 1]]: S[O] };
              break;
            case 8:
              S[O] = S[O].replace(/:$/, ""), S[O] = J.aliases && J.aliases[S[O]] ? J.aliases[S[O]] : S[O], this.$ = S[O];
              break;
            case 9:
              this.$ = { $not: S[O] };
              break;
            case 10:
              this.$ = { $regex: S[O] };
              break;
            case 11:
              this.$ = { $nin: S[O - 1] };
              break;
            case 12:
              this.$ = { $in: S[O - 1] };
              break;
            case 13:
              this.$ = {}, this.$[S[O - 1]] = S[O];
              break;
            case 14:
              this.$ = S[O];
              break;
            case 15:
              this.$.push(S[O]);
              break;
            case 16:
              this.$ = [S[O]];
              break;
            case 17:
              this.$ = null;
              break;
            case 18:
              this.$ = !0;
              break;
            case 19:
              this.$ = !1;
              break;
            case 20:
              this.$ = parseInt(N);
              break;
            case 21:
              this.$ = k.relDateToAbsolute(S[O - 2], S[O - 1], S[O]);
              break;
            case 22:
              this.$ = k.unescape(S[O]);
              break;
            case 23:
              S[O] = S[O].replace(/^'|'$/g, ""), this.$ = k.unescape(S[O]);
              break;
            case 24:
              this.$ = "add";
              break;
            case 25:
              this.$ = "sub";
              break;
            case 26:
              S[O] = S[O].replace(/^'|'$/g, ""), S[O] = k.unescape(S[O]), this.$ = k.stringToRegExp(S[O]);
              break;
            case 27:
              S[O] = S[O].replace(/^'|'$/g, ""), S[O] = k.unescape(S[O]), this.$ = k.stringToRegExp(S[O], "^");
              break;
            case 28:
              S[O] = S[O].replace(/^'|'$/g, ""), S[O] = k.unescape(S[O]), this.$ = k.stringToRegExp(S[O], "$");
              break;
            case 29:
              this.$ = "$ne";
              break;
            case 30:
              this.$ = "$gt";
              break;
            case 31:
              this.$ = "$lt";
              break;
            case 32:
              this.$ = "$gte";
              break;
            case 33:
              this.$ = "$lte";
              break;
          }
        },
        table: [{ 3: 1, 4: 2, 5: 3, 7: 4, 9: o, 11: 6, 13: i }, { 1: [3] }, { 1: [2, 1], 6: a }, n(s, [2, 2], { 8: c }), n(u, [2, 4]), { 4: 10, 5: 3, 7: 4, 9: o, 11: 6, 13: i }, { 12: 11, 14: [1, 12], 15: 13, 16: [1, 14], 19: 15, 20: 16, 21: f, 22: d, 23: p, 24: h, 25: y, 29: m, 30: v, 33: P, 34: T, 35: E, 36: [1, 20], 37: [1, 21], 38: [1, 22], 39: [1, 23] }, n([14, 16, 21, 22, 23, 24, 25, 29, 30, 33, 34, 35, 36, 37, 38, 39], [2, 8]), { 5: 31, 7: 4, 9: o, 11: 6, 13: i }, { 7: 32, 9: o, 11: 6, 13: i }, { 6: a, 10: [1, 33] }, n(u, [2, 7]), n(R, [2, 29], { 15: 34, 16: [1, 35], 33: P, 34: T, 35: E }), n(u, [2, 10]), { 17: 36, 20: 37, 21: f, 22: d, 23: p, 24: h, 25: y, 29: m, 30: v }, { 20: 38, 21: f, 22: d, 23: p, 24: h, 25: y, 29: m, 30: v }, n(u, [2, 14]), { 30: [1, 39] }, { 30: [1, 40] }, { 30: [1, 41] }, n(R, [2, 30]), n(R, [2, 31]), n(R, [2, 32]), n(R, [2, 33]), n(C, [2, 17]), n(C, [2, 18]), n(C, [2, 19]), n(C, [2, 20]), { 26: 42, 31: [1, 43], 32: [1, 44] }, n(C, [2, 22]), n(C, [2, 23]), n(s, [2, 3], { 8: c }), n(u, [2, 5]), n(u, [2, 6]), n(u, [2, 9]), { 17: 45, 20: 37, 21: f, 22: d, 23: p, 24: h, 25: y, 29: m, 30: v }, { 6: _, 18: [1, 46] }, n(M, [2, 16]), n(u, [2, 13]), n(u, [2, 26]), n(u, [2, 27]), n(u, [2, 28]), { 27: [1, 48] }, { 27: [2, 24] }, { 27: [2, 25] }, { 6: _, 18: [1, 49] }, n(u, [2, 12]), { 20: 50, 21: f, 22: d, 23: p, 24: h, 25: y, 29: m, 30: v }, { 28: [1, 51] }, n(u, [2, 11]), n(M, [2, 15]), n(C, [2, 21])],
        defaultActions: { 43: [2, 24], 44: [2, 25] },
        parseError: function(N, j) {
          if (j.recoverable)
            this.trace(N);
          else {
            var D = new Error(N);
            throw D.hash = j, D;
          }
        },
        parse: function(N) {
          var j = this, D = [0], k = [null], A = [], S = this.table, oe = "", J = 0, O = 0, pt = 2, g = 1, b = A.slice.call(arguments, 1), x = Object.create(this.lexer), F = { yy: {} };
          for (var W in this.yy)
            Object.prototype.hasOwnProperty.call(this.yy, W) && (F.yy[W] = this.yy[W]);
          x.setInput(N, F.yy), F.yy.lexer = x, F.yy.parser = this, typeof x.yylloc > "u" && (x.yylloc = {});
          var V = x.yylloc;
          A.push(V);
          var U = x.options && x.options.ranges;
          typeof F.yy.parseError == "function" ? this.parseError = F.yy.parseError : this.parseError = Object.getPrototypeOf(this).parseError;
          for (var L = function() {
            var ge;
            return ge = x.lex() || g, typeof ge != "number" && (ge = j.symbols_[ge] || ge), ge;
          }, I, z, q, re, ne = {}, de, X, tt, Ye; ; ) {
            if (z = D[D.length - 1], this.defaultActions[z] ? q = this.defaultActions[z] : ((I === null || typeof I > "u") && (I = L()), q = S[z] && S[z][I]), typeof q > "u" || !q.length || !q[0]) {
              var w = "";
              Ye = [];
              for (de in S[z])
                this.terminals_[de] && de > pt && Ye.push("'" + this.terminals_[de] + "'");
              x.showPosition ? w = "Parse error on line " + (J + 1) + `:
` + x.showPosition() + `
Expecting ` + Ye.join(", ") + ", got '" + (this.terminals_[I] || I) + "'" : w = "Parse error on line " + (J + 1) + ": Unexpected " + (I == g ? "end of input" : "'" + (this.terminals_[I] || I) + "'"), this.parseError(w, {
                text: x.match,
                token: this.terminals_[I] || I,
                line: x.yylineno,
                loc: V,
                expected: Ye
              });
            }
            if (q[0] instanceof Array && q.length > 1)
              throw new Error("Parse Error: multiple actions possible at state: " + z + ", token: " + I);
            switch (q[0]) {
              case 1:
                D.push(I), k.push(x.yytext), A.push(x.yylloc), D.push(q[1]), I = null, O = x.yyleng, oe = x.yytext, J = x.yylineno, V = x.yylloc;
                break;
              case 2:
                if (X = this.productions_[q[1]][1], ne.$ = k[k.length - X], ne._$ = {
                  first_line: A[A.length - (X || 1)].first_line,
                  last_line: A[A.length - 1].last_line,
                  first_column: A[A.length - (X || 1)].first_column,
                  last_column: A[A.length - 1].last_column
                }, U && (ne._$.range = [
                  A[A.length - (X || 1)].range[0],
                  A[A.length - 1].range[1]
                ]), re = this.performAction.apply(ne, [
                  oe,
                  O,
                  J,
                  F.yy,
                  q[1],
                  k,
                  A
                ].concat(b)), typeof re < "u")
                  return re;
                X && (D = D.slice(0, -1 * X * 2), k = k.slice(0, -1 * X), A = A.slice(0, -1 * X)), D.push(this.productions_[q[1]][0]), k.push(ne.$), A.push(ne._$), tt = S[D[D.length - 2]][D[D.length - 1]], D.push(tt);
                break;
              case 3:
                return !0;
            }
          }
          return !0;
        }
      };
      Z.parseError = function(B, N) {
        var j = B.split(`
`);
        throw j[0] = "Query Error: unexpected character in filter at char " + (N.loc.first_column + 1), new Error(j.join(`
`));
      };
      var $ = (function() {
        var B = {
          EOF: 1,
          parseError: function(j, D) {
            if (this.yy.parser)
              this.yy.parser.parseError(j, D);
            else
              throw new Error(j);
          },
          // resets the lexer, sets new input
          setInput: function(N, j) {
            return this.yy = j || this.yy || {}, this._input = N, this._more = this._backtrack = this.done = !1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = "", this.conditionStack = ["INITIAL"], this.yylloc = {
              first_line: 1,
              first_column: 0,
              last_line: 1,
              last_column: 0
            }, this.options.ranges && (this.yylloc.range = [0, 0]), this.offset = 0, this;
          },
          // consumes and returns one char from the input
          input: function() {
            var N = this._input[0];
            this.yytext += N, this.yyleng++, this.offset++, this.match += N, this.matched += N;
            var j = N.match(/(?:\r\n?|\n).*/g);
            return j ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++, this.options.ranges && this.yylloc.range[1]++, this._input = this._input.slice(1), N;
          },
          // unshifts one char (or a string) into the input
          unput: function(N) {
            var j = N.length, D = N.split(/(?:\r\n?|\n)/g);
            this._input = N + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - j), this.offset -= j;
            var k = this.match.split(/(?:\r\n?|\n)/g);
            this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), D.length - 1 && (this.yylineno -= D.length - 1);
            var A = this.yylloc.range;
            return this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: D ? (D.length === k.length ? this.yylloc.first_column : 0) + k[k.length - D.length].length - D[0].length : this.yylloc.first_column - j
            }, this.options.ranges && (this.yylloc.range = [A[0], A[0] + this.yyleng - j]), this.yyleng = this.yytext.length, this;
          },
          // When called from action, caches matched text and appends it on next action
          more: function() {
            return this._more = !0, this;
          },
          // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
          reject: function() {
            if (this.options.backtrack_lexer)
              this._backtrack = !0;
            else
              return this.parseError("Lexical error on line " + (this.yylineno + 1) + `. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
` + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
              });
            return this;
          },
          // retain first n characters of the match
          less: function(N) {
            this.unput(this.match.slice(N));
          },
          // displays already matched input, i.e. for error messages
          pastInput: function() {
            var N = this.matched.substr(0, this.matched.length - this.match.length);
            return (N.length > 20 ? "..." : "") + N.substr(-20).replace(/\n/g, "");
          },
          // displays upcoming input, i.e. for error messages
          upcomingInput: function() {
            var N = this.match;
            return N.length < 20 && (N += this._input.substr(0, 20 - N.length)), (N.substr(0, 20) + (N.length > 20 ? "..." : "")).replace(/\n/g, "");
          },
          // displays the character position where the lexing error occurred, i.e. for error messages
          showPosition: function() {
            var N = this.pastInput(), j = new Array(N.length + 1).join("-");
            return N + this.upcomingInput() + `
` + j + "^";
          },
          // test the lexed token: return FALSE when not a match, otherwise return token
          test_match: function(N, j) {
            var D, k, A;
            if (this.options.backtrack_lexer && (A = {
              yylineno: this.yylineno,
              yylloc: {
                first_line: this.yylloc.first_line,
                last_line: this.last_line,
                first_column: this.yylloc.first_column,
                last_column: this.yylloc.last_column
              },
              yytext: this.yytext,
              match: this.match,
              matches: this.matches,
              matched: this.matched,
              yyleng: this.yyleng,
              offset: this.offset,
              _more: this._more,
              _input: this._input,
              yy: this.yy,
              conditionStack: this.conditionStack.slice(0),
              done: this.done
            }, this.options.ranges && (A.yylloc.range = this.yylloc.range.slice(0))), k = N[0].match(/(?:\r\n?|\n).*/g), k && (this.yylineno += k.length), this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: k ? k[k.length - 1].length - k[k.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + N[0].length
            }, this.yytext += N[0], this.match += N[0], this.matches = N, this.yyleng = this.yytext.length, this.options.ranges && (this.yylloc.range = [this.offset, this.offset += this.yyleng]), this._more = !1, this._backtrack = !1, this._input = this._input.slice(N[0].length), this.matched += N[0], D = this.performAction.call(this, this.yy, this, j, this.conditionStack[this.conditionStack.length - 1]), this.done && this._input && (this.done = !1), D)
              return D;
            if (this._backtrack) {
              for (var S in A)
                this[S] = A[S];
              return !1;
            }
            return !1;
          },
          // return next match in input
          next: function() {
            if (this.done)
              return this.EOF;
            this._input || (this.done = !0);
            var N, j, D, k;
            this._more || (this.yytext = "", this.match = "");
            for (var A = this._currentRules(), S = 0; S < A.length; S++)
              if (D = this._input.match(this.rules[A[S]]), D && (!j || D[0].length > j[0].length)) {
                if (j = D, k = S, this.options.backtrack_lexer) {
                  if (N = this.test_match(D, A[S]), N !== !1)
                    return N;
                  if (this._backtrack) {
                    j = !1;
                    continue;
                  } else
                    return !1;
                } else if (!this.options.flex)
                  break;
              }
            return j ? (N = this.test_match(j, A[k]), N !== !1 ? N : !1) : this._input === "" ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + `. Unrecognized text.
` + this.showPosition(), {
              text: "",
              token: null,
              line: this.yylineno
            });
          },
          // return next match that has a token
          lex: function() {
            var j = this.next();
            return j || this.lex();
          },
          // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
          begin: function(j) {
            this.conditionStack.push(j);
          },
          // pop the previously active lexer condition state off the condition stack
          popState: function() {
            var j = this.conditionStack.length - 1;
            return j > 0 ? this.conditionStack.pop() : this.conditionStack[0];
          },
          // produce the lexer rule set which is active for the currently active lexer condition state
          _currentRules: function() {
            return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1] ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules : this.conditions.INITIAL.rules;
          },
          // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
          topState: function(j) {
            return j = this.conditionStack.length - 1 - Math.abs(j || 0), j >= 0 ? this.conditionStack[j] : "INITIAL";
          },
          // alias for begin(condition)
          pushState: function(j) {
            this.begin(j);
          },
          // return the number of states currently on the stack
          stateStackSize: function() {
            return this.conditionStack.length;
          },
          options: {},
          performAction: function(j, D, k, A) {
            switch (k) {
              case 0:
                break;
              case 1:
                return 21;
              case 2:
                return 22;
              case 3:
                return 23;
              case 4:
                return 13;
              case 5:
                return 24;
              case 6:
                return 16;
              case 7:
                return 18;
              case 8:
                return this.pushState("reldate"), 25;
              case 9:
                return 32;
              case 10:
                return 31;
              case 11:
                return 27;
              case 12:
                return this.popState(), 28;
              case 13:
                return 29;
              case 14:
                return 30;
              case 15:
                return 9;
              case 16:
                return 10;
              case 17:
                return 6;
              case 18:
                return 8;
              case 19:
                return 14;
              case 20:
                return 38;
              case 21:
                return 39;
              case 22:
                return 36;
              case 23:
                return 37;
              case 24:
                return 34;
              case 25:
                return 35;
              case 26:
                return 33;
              case 27:
                return 29;
            }
          },
          rules: [/^(?:\s+)/, /^(?:(?:null|NULL|Null)(?!(\\(['"\+\,\(\)\>\<=\[\]\~\^\$])|([^\s'"\+\,\(\)\>\<=\[\]\~]))+))/, /^(?:(?:true|TRUE|True)(?!(\\(['"\+\,\(\)\>\<=\[\]\~\^\$])|([^\s'"\+\,\(\)\>\<=\[\]\~]))+))/, /^(?:(?:false|FALSE|False)(?!(\\(['"\+\,\(\)\>\<=\[\]\~\^\$])|([^\s'"\+\,\(\)\>\<=\[\]\~]))+))/, /^(?:[a-zA-Z_][a-zA-Z0-9_\.]*[:])/, /^(?:[0-9]+(\.[0-9]+)?\b(?![\-]))/, /^(?:\[)/, /^(?:\])/, /^(?:now(?=[-+]\d+[dwMyhms](?:([\+\,\(\)\[\]])|$)))/, /^(?:-)/, /^(?:\+)/, /^(?:\d+)/, /^(?:[dwMyhms])/, /^(?:([^\s'"\+\,\(\)\>\<=\[\]\~\-])(\\(['"\+\,\(\)\>\<=\[\]\~\^\$])|([^\s'"\+\,\(\)\>\<=\[\]\~]))+)/, /^(?:['](\\['"]|[^'"])+?['])/, /^(?:\()/, /^(?:\))/, /^(?:,)/, /^(?:\+)/, /^(?:-)/, /^(?:>=)/, /^(?:<=)/, /^(?:>)/, /^(?:<)/, /^(?:~\^)/, /^(?:~\$)/, /^(?:~)/, /^(?:([a-zA-Z])(?![a-zA-Z'"\,\(\)\>\<=\[\]\~]))/],
          conditions: { reldate: { rules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], inclusive: !0 }, INITIAL: { rules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], inclusive: !0 } }
        };
        return B.parseError = function(N, j) {
          var D = N.split(`
`), k, A;
          throw k = D[2].indexOf("^"), A = D[1].charAt(k), D[0] = 'Query Error: unrecognized text "' + A + '" in filter at char ' + (k + 1), Error(D.join(`
`));
        }, B;
      })();
      Z.lexer = $;
      function G() {
        this.yy = {};
      }
      return G.prototype = Z, Z.Parser = G, new G();
    })();
    typeof Mp < "u" && (t.parser = r, t.Parser = r.Parser, t.parse = function() {
      return r.parse.apply(r, arguments);
    }, t.main = function(o) {
      o[1] || (console.log("Usage: " + o[0] + " FILE"), process.exit(1));
      var i = Ku.readFileSync(Ku.normalize(o[1]), "utf8");
      return t.parser.parse(i);
    }, require.main === e && t.main(process.argv.slice(1)));
  })(Tn, Tn.exports)), Tn.exports;
}
var Xu;
function J1() {
  if (Xu) return Sn;
  Xu = 1;
  const e = W1(), t = G1().parser;
  return t.yy = e, Sn.lex = (r) => {
    t.lexer.setInput(r);
    let n = t.lexer.lex();
    const o = [];
    for (; n !== t.lexer.EOF; )
      o.push({ token: t.terminals_[n], matched: t.lexer.match }), n = t.lexer.lex();
    return o;
  }, Sn.parse = (r, n) => {
    const o = n || {};
    e.preserveRelativeDates = o.preserveRelativeDates === !0;
    try {
      return t.parse(r, o);
    } finally {
      e.preserveRelativeDates = !1;
    }
  }, Sn;
}
var Wi, el;
function K1() {
  return el || (el = 1, Wi = J1()), Wi;
}
var Q1 = K1();
const X1 = /* @__PURE__ */ Hd(Q1);
function e0(e, t) {
  const r = e.split("."), n = t.split(".");
  if (r.length !== n.length)
    return null;
  const o = {};
  for (let i = 0; i < r.length; i += 1) {
    const a = r[i], s = n[i];
    if (a.startsWith(":")) {
      o[a.slice(1)] = s;
      continue;
    }
    if (a !== s)
      return null;
  }
  return o;
}
function ac(e, t, r) {
  const n = e[t];
  if (n)
    return {
      definition: n,
      context: {
        key: t,
        pattern: t,
        params: {},
        timezone: r
      }
    };
  for (const [o, i] of Object.entries(e))
    if (i.parseKeys?.includes(t))
      return {
        definition: i,
        context: {
          key: o,
          pattern: o,
          params: {},
          timezone: r
        }
      };
  for (const [o, i] of Object.entries(e)) {
    if (!o.includes(":"))
      continue;
    const a = e0(o, t);
    if (a)
      return {
        definition: i,
        context: {
          key: t,
          pattern: o,
          params: a,
          timezone: r
        }
      };
  }
}
function Ld(e) {
  if (e)
    try {
      return X1.parse(e, { preserveRelativeDates: !0 });
    } catch {
      return;
    }
}
function t0(e) {
  return e.map((t, r) => ({
    ...t,
    id: `${t.field}:${r + 1}`
  }));
}
function r0(e, t) {
  const r = /* @__PURE__ */ new Set();
  return Object.entries(e).forEach(([n, o]) => {
    o.ui.type === t && (r.add(n), o.parseKeys?.forEach((i) => r.add(i)));
  }), r;
}
function sa(e, t) {
  return Object.keys(e).some((r) => t.has(r)) ? !0 : Object.values(e).some((r) => Array.isArray(r) ? r.some((n) => n !== null && typeof n == "object" && sa(n, t)) : r !== null && typeof r == "object" && !(r instanceof RegExp) && sa(r, t));
}
function n0(e, t, r) {
  return e.flatMap((n) => {
    const o = Object.keys(n);
    if (o.length !== 1 || o[0].startsWith("$"))
      return [];
    const i = ac(t, o[0], r);
    if (i) {
      const a = i.definition.codec.parse(n, i.context);
      if (a)
        return [a];
    }
    return [];
  });
}
function o0(e) {
  return [...e].sort((t, r) => t.localeCompare(r));
}
function i0(e, t, r) {
  const n = e.flatMap((o) => {
    const i = ac(t, o.field, r);
    return i ? i.definition.codec.serialize(o, i.context) ?? [] : [];
  });
  if (n.length)
    return o0(n).join("+");
}
const a0 = r0(hn, "date");
function $d(e) {
  return ac(hn, e.field, "UTC")?.definition.operators.includes(e.operator) ?? !1;
}
function qd(e, t) {
  return Array.isArray(e.$and) ? e.$and.flatMap((r) => qd(r, t)) : n0([e], hn, t);
}
function s0(e, t) {
  const r = Ld(e ?? "");
  return r ? t0(qd(r, t).filter($d)) : [];
}
function c0(e) {
  const t = Ld(e ?? "");
  return t ? sa(t, a0) : !1;
}
function sc(e, t) {
  return i0(e.filter($d), hn, t);
}
const Ud = ["status", "created_at", "body", "post", "author", "reported"], u0 = {
  is_not: "is-not",
  not_contains: "does-not-contain",
  before: "is-less",
  after: "is-greater",
  on_or_before: "is-or-less",
  on_or_after: "is-or-greater"
};
function l0(e) {
  const t = e.indexOf(":");
  if (t <= 0)
    return null;
  const r = e.substring(0, t), n = e.substring(t + 1);
  return n ? {
    operator: u0[r] ?? r,
    value: n
  } : null;
}
function f0(e) {
  const t = [];
  for (const [r, n] of e.entries()) {
    if (!Ud.includes(r))
      continue;
    const o = l0(n);
    o && t.push({
      id: `${r}:${t.length + 1}`,
      field: r,
      operator: o.operator,
      values: [o.value]
    });
  }
  return t;
}
function zd(e) {
  Ud.forEach((t) => e.delete(t));
}
function tl(e, t, r) {
  const n = new URLSearchParams(e), o = sc(t, r);
  return n.delete("filter"), zd(n), o && n.set("filter", o), n;
}
function d0(e, t, r = !t) {
  return !!e && r && !t && c0(e);
}
function p0(e) {
  const [t, r] = mr(), n = ie(null), o = be(() => t.get("filter") ?? void 0, [t]), i = be(() => t.toString(), [t]), a = be(() => o !== void 0 ? s0(o, e) : f0(t), [o, t, e]), [s, c] = xe(a), u = be(() => sc(s, e), [s, e]);
  Fe(() => {
    i !== n.current && (c(a), n.current = i);
  }, [i, a]), Fe(() => {
    if (n.current !== null && i !== n.current)
      return;
    const p = tl(t, s, e), h = p.toString();
    h !== i && (n.current = h, r(p, { replace: !0 }));
  }, [i, s, t, r, e]);
  const f = ur((p, h = {}) => {
    const y = typeof p == "function" ? p(s) : p, m = tl(t, y, e), v = h.replace ?? !0;
    c(y), n.current = m.toString(), r(m, { replace: v });
  }, [s, t, r, e]), d = ur(({ replace: p = !0 } = {}) => {
    const h = new URLSearchParams(t);
    h.delete("filter"), zd(h), c([]), n.current = h.toString(), r(h, { replace: p });
  }, [t, r]);
  return { filters: s, nql: u, setFilters: f, clearFilters: d };
}
function h0(e) {
  return e.get("id")?.match(/^is:(.+)$/)?.[1];
}
const m0 = ({
  timezone: e,
  singleCommentId: t
}) => {
  const [r, n] = mr(), { filters: o, nql: i, setFilters: a } = p0(e), [s, c] = xe(!1), u = ur((_, M, Z = "is") => {
    const $ = [
      ...o.filter((N) => N.field !== _),
      Jd(_, Z, [M])
    ];
    if (!t) {
      a($, { replace: !1 });
      return;
    }
    const G = new URLSearchParams(r), B = sc($, e);
    G.delete("id"), G.delete("filter"), B && G.set("filter", B), n(G, { replace: !1 });
  }, [o, r, a, n, t, e]), f = be(() => t ? `id:${pr(t)}` : i, [i, t]), d = ur(() => {
    n(new URLSearchParams(), { replace: !1 });
  }, [n]), {
    data: p,
    isError: h,
    isFetching: y,
    isFetchingNextPage: m,
    isRefetching: v,
    fetchNextPage: P,
    hasNextPage: T
  } = xd({
    searchParams: {
      include: Ks(s),
      ...f ? { filter: f } : {}
    },
    keepPreviousData: !0
  });
  Fe(() => {
    !s && p?.meta?.capabilities?.dislikes === !0 && c(!0);
  }, [s, p?.meta?.capabilities?.dislikes]);
  const E = y && !m && !v, R = f ?? "", C = o.length > 0;
  return /* @__PURE__ */ l.jsx(fl, { children: /* @__PURE__ */ l.jsxs(ar, { "data-testid": "comments-page", children: [
    /* @__PURE__ */ l.jsxs(ar.Header, { children: [
      /* @__PURE__ */ l.jsxs(gt, { blurredBackground: !1, sticky: !1, children: [
        /* @__PURE__ */ l.jsx(gt.Left, { children: /* @__PURE__ */ l.jsx(gt.Title, { children: "Comments" }) }),
        !t && !C && /* @__PURE__ */ l.jsx(gt.Actions, { children: /* @__PURE__ */ l.jsx(gt.ActionGroup, { children: /* @__PURE__ */ l.jsx(
          Yc,
          {
            filters: o,
            siteTimezone: e,
            onFiltersChange: a
          }
        ) }) })
      ] }),
      !t && C && /* @__PURE__ */ l.jsx(Ip, { children: /* @__PURE__ */ l.jsx(
        Yc,
        {
          filters: o,
          siteTimezone: e,
          onFiltersChange: a
        }
      ) })
    ] }),
    /* @__PURE__ */ l.jsx(ar.Body, { children: E ? /* @__PURE__ */ l.jsx("div", { className: "flex flex-1 items-center justify-center", children: /* @__PURE__ */ l.jsx(xt, { size: "lg" }) }) : h ? /* @__PURE__ */ l.jsxs("div", { className: "flex flex-1 flex-col items-center justify-center", children: [
      /* @__PURE__ */ l.jsx("h2", { className: "mb-2 text-xl font-medium", children: "Error loading comments" }),
      /* @__PURE__ */ l.jsx("p", { className: "mb-4 text-muted-foreground", children: "Please reload the page to try again" }),
      /* @__PURE__ */ l.jsx(le, { onClick: () => window.location.reload(), children: "Reload page" })
    ] }) : p?.comments.length ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
      /* @__PURE__ */ l.jsx(
        e1,
        {
          dislikesEnabled: s,
          fetchNextPage: P,
          hasNextPage: T,
          isFetchingNextPage: m,
          isLoading: y && !m,
          items: p?.comments ?? [],
          resetKey: R,
          totalItems: p?.meta?.pagination?.total ?? 0,
          onAddFilter: u
        }
      ),
      t && /* @__PURE__ */ l.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ l.jsx(le, { variant: "outline", onClick: d, children: "Show all comments" }) })
    ] }) : /* @__PURE__ */ l.jsx("div", { className: "flex flex-1 items-center justify-center", children: t ? /* @__PURE__ */ l.jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ l.jsx(Gi, { title: "Comment not found", children: /* @__PURE__ */ l.jsx(Vi, {}) }),
      /* @__PURE__ */ l.jsx(le, { className: "mt-4", variant: "outline", onClick: d, children: "Show all comments" })
    ] }) : /* @__PURE__ */ l.jsx(Gi, { title: "No comments yet", children: /* @__PURE__ */ l.jsx(Vi, {}) }) }) })
  ] }) });
}, U0 = () => {
  const [e] = mr(), { data: t, isLoading: r } = vp({}), n = be(() => h0(e), [e]), o = e.get("filter") ?? void 0;
  if (!n && d0(o, !!t, r))
    return /* @__PURE__ */ l.jsx(fl, { children: /* @__PURE__ */ l.jsxs(ar, { children: [
      /* @__PURE__ */ l.jsx(ar.Header, { children: /* @__PURE__ */ l.jsx(gt, { blurredBackground: !1, sticky: !1, children: /* @__PURE__ */ l.jsx(gt.Left, { children: /* @__PURE__ */ l.jsx(gt.Title, { children: "Comments" }) }) }) }),
      /* @__PURE__ */ l.jsx(ar.Body, { children: /* @__PURE__ */ l.jsx("div", { className: "flex flex-1 items-center justify-center", children: /* @__PURE__ */ l.jsx(xt, { size: "lg" }) }) })
    ] }) });
  const a = up(t?.settings ?? []);
  return /* @__PURE__ */ l.jsx(m0, { singleCommentId: n, timezone: a });
};
export {
  U0 as default
};
//# sourceMappingURL=comments-DUSJ25vf.mjs.map

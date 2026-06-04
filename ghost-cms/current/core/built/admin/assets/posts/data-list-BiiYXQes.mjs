import { m as Bg } from "./button-CQCNdxY6.mjs";
import { j as En, z as ce, M as Ge, C as Nt, h as ue, a1 as E, P as Wt, x as bn, ak as Bn, ac as D0, am as ml, a6 as N0, a9 as bl, af as wl, g as be, l as ji, a7 as rt, k as _t, a as q0, ab as k0, Q as Y, i as we } from "./index-BuIZkUhD.mjs";
import { P as ee } from "./index-CDwlVw9E.mjs";
import { i as Mi, a as L0 } from "./value-DhEK7_uT.mjs";
const B0 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
], mR = Bg("arrow-right", B0);
const F0 = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
], bR = Bg("arrow-up", F0);
var fa, _f;
function Ie() {
  if (_f) return fa;
  _f = 1;
  var e = Array.isArray;
  return fa = e, fa;
}
var ha, Of;
function Fg() {
  if (Of) return ha;
  Of = 1;
  var e = typeof En == "object" && En && En.Object === Object && En;
  return ha = e, ha;
}
var pa, Sf;
function nt() {
  if (Sf) return pa;
  Sf = 1;
  var e = Fg(), t = typeof self == "object" && self && self.Object === Object && self, r = e || t || Function("return this")();
  return pa = r, pa;
}
var da, Af;
function wn() {
  if (Af) return da;
  Af = 1;
  var e = nt(), t = e.Symbol;
  return da = t, da;
}
var va, Pf;
function U0() {
  if (Pf) return va;
  Pf = 1;
  var e = wn(), t = Object.prototype, r = t.hasOwnProperty, n = t.toString, i = e ? e.toStringTag : void 0;
  function a(o) {
    var u = r.call(o, i), s = o[i];
    try {
      o[i] = void 0;
      var c = !0;
    } catch {
    }
    var f = n.call(o);
    return c && (u ? o[i] = s : delete o[i]), f;
  }
  return va = a, va;
}
var ya, Tf;
function W0() {
  if (Tf) return ya;
  Tf = 1;
  var e = Object.prototype, t = e.toString;
  function r(n) {
    return t.call(n);
  }
  return ya = r, ya;
}
var ga, Ef;
function pt() {
  if (Ef) return ga;
  Ef = 1;
  var e = wn(), t = U0(), r = W0(), n = "[object Null]", i = "[object Undefined]", a = e ? e.toStringTag : void 0;
  function o(u) {
    return u == null ? u === void 0 ? i : n : a && a in Object(u) ? t(u) : r(u);
  }
  return ga = o, ga;
}
var ma, jf;
function dt() {
  if (jf) return ma;
  jf = 1;
  function e(t) {
    return t != null && typeof t == "object";
  }
  return ma = e, ma;
}
var ba, Mf;
function wr() {
  if (Mf) return ba;
  Mf = 1;
  var e = pt(), t = dt(), r = "[object Symbol]";
  function n(i) {
    return typeof i == "symbol" || t(i) && e(i) == r;
  }
  return ba = n, ba;
}
var wa, Cf;
function xl() {
  if (Cf) return wa;
  Cf = 1;
  var e = Ie(), t = wr(), r = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, n = /^\w*$/;
  function i(a, o) {
    if (e(a))
      return !1;
    var u = typeof a;
    return u == "number" || u == "symbol" || u == "boolean" || a == null || t(a) ? !0 : n.test(a) || !r.test(a) || o != null && a in Object(o);
  }
  return wa = i, wa;
}
var xa, If;
function Ot() {
  if (If) return xa;
  If = 1;
  function e(t) {
    var r = typeof t;
    return t != null && (r == "object" || r == "function");
  }
  return xa = e, xa;
}
var _a, $f;
function _l() {
  if ($f) return _a;
  $f = 1;
  var e = pt(), t = Ot(), r = "[object AsyncFunction]", n = "[object Function]", i = "[object GeneratorFunction]", a = "[object Proxy]";
  function o(u) {
    if (!t(u))
      return !1;
    var s = e(u);
    return s == n || s == i || s == r || s == a;
  }
  return _a = o, _a;
}
var Oa, Rf;
function z0() {
  if (Rf) return Oa;
  Rf = 1;
  var e = nt(), t = e["__core-js_shared__"];
  return Oa = t, Oa;
}
var Sa, Df;
function H0() {
  if (Df) return Sa;
  Df = 1;
  var e = z0(), t = (function() {
    var n = /[^.]+$/.exec(e && e.keys && e.keys.IE_PROTO || "");
    return n ? "Symbol(src)_1." + n : "";
  })();
  function r(n) {
    return !!t && t in n;
  }
  return Sa = r, Sa;
}
var Aa, Nf;
function Ug() {
  if (Nf) return Aa;
  Nf = 1;
  var e = Function.prototype, t = e.toString;
  function r(n) {
    if (n != null) {
      try {
        return t.call(n);
      } catch {
      }
      try {
        return n + "";
      } catch {
      }
    }
    return "";
  }
  return Aa = r, Aa;
}
var Pa, qf;
function G0() {
  if (qf) return Pa;
  qf = 1;
  var e = _l(), t = H0(), r = Ot(), n = Ug(), i = /[\\^$.*+?()[\]{}|]/g, a = /^\[object .+?Constructor\]$/, o = Function.prototype, u = Object.prototype, s = o.toString, c = u.hasOwnProperty, f = RegExp(
    "^" + s.call(c).replace(i, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function l(h) {
    if (!r(h) || t(h))
      return !1;
    var d = e(h) ? f : a;
    return d.test(n(h));
  }
  return Pa = l, Pa;
}
var Ta, kf;
function K0() {
  if (kf) return Ta;
  kf = 1;
  function e(t, r) {
    return t?.[r];
  }
  return Ta = e, Ta;
}
var Ea, Lf;
function zt() {
  if (Lf) return Ea;
  Lf = 1;
  var e = G0(), t = K0();
  function r(n, i) {
    var a = t(n, i);
    return e(a) ? a : void 0;
  }
  return Ea = r, Ea;
}
var ja, Bf;
function Ci() {
  if (Bf) return ja;
  Bf = 1;
  var e = zt(), t = e(Object, "create");
  return ja = t, ja;
}
var Ma, Ff;
function X0() {
  if (Ff) return Ma;
  Ff = 1;
  var e = Ci();
  function t() {
    this.__data__ = e ? e(null) : {}, this.size = 0;
  }
  return Ma = t, Ma;
}
var Ca, Uf;
function V0() {
  if (Uf) return Ca;
  Uf = 1;
  function e(t) {
    var r = this.has(t) && delete this.__data__[t];
    return this.size -= r ? 1 : 0, r;
  }
  return Ca = e, Ca;
}
var Ia, Wf;
function Y0() {
  if (Wf) return Ia;
  Wf = 1;
  var e = Ci(), t = "__lodash_hash_undefined__", r = Object.prototype, n = r.hasOwnProperty;
  function i(a) {
    var o = this.__data__;
    if (e) {
      var u = o[a];
      return u === t ? void 0 : u;
    }
    return n.call(o, a) ? o[a] : void 0;
  }
  return Ia = i, Ia;
}
var $a, zf;
function Z0() {
  if (zf) return $a;
  zf = 1;
  var e = Ci(), t = Object.prototype, r = t.hasOwnProperty;
  function n(i) {
    var a = this.__data__;
    return e ? a[i] !== void 0 : r.call(a, i);
  }
  return $a = n, $a;
}
var Ra, Hf;
function J0() {
  if (Hf) return Ra;
  Hf = 1;
  var e = Ci(), t = "__lodash_hash_undefined__";
  function r(n, i) {
    var a = this.__data__;
    return this.size += this.has(n) ? 0 : 1, a[n] = e && i === void 0 ? t : i, this;
  }
  return Ra = r, Ra;
}
var Da, Gf;
function Q0() {
  if (Gf) return Da;
  Gf = 1;
  var e = X0(), t = V0(), r = Y0(), n = Z0(), i = J0();
  function a(o) {
    var u = -1, s = o == null ? 0 : o.length;
    for (this.clear(); ++u < s; ) {
      var c = o[u];
      this.set(c[0], c[1]);
    }
  }
  return a.prototype.clear = e, a.prototype.delete = t, a.prototype.get = r, a.prototype.has = n, a.prototype.set = i, Da = a, Da;
}
var Na, Kf;
function ew() {
  if (Kf) return Na;
  Kf = 1;
  function e() {
    this.__data__ = [], this.size = 0;
  }
  return Na = e, Na;
}
var qa, Xf;
function Ol() {
  if (Xf) return qa;
  Xf = 1;
  function e(t, r) {
    return t === r || t !== t && r !== r;
  }
  return qa = e, qa;
}
var ka, Vf;
function Ii() {
  if (Vf) return ka;
  Vf = 1;
  var e = Ol();
  function t(r, n) {
    for (var i = r.length; i--; )
      if (e(r[i][0], n))
        return i;
    return -1;
  }
  return ka = t, ka;
}
var La, Yf;
function tw() {
  if (Yf) return La;
  Yf = 1;
  var e = Ii(), t = Array.prototype, r = t.splice;
  function n(i) {
    var a = this.__data__, o = e(a, i);
    if (o < 0)
      return !1;
    var u = a.length - 1;
    return o == u ? a.pop() : r.call(a, o, 1), --this.size, !0;
  }
  return La = n, La;
}
var Ba, Zf;
function rw() {
  if (Zf) return Ba;
  Zf = 1;
  var e = Ii();
  function t(r) {
    var n = this.__data__, i = e(n, r);
    return i < 0 ? void 0 : n[i][1];
  }
  return Ba = t, Ba;
}
var Fa, Jf;
function nw() {
  if (Jf) return Fa;
  Jf = 1;
  var e = Ii();
  function t(r) {
    return e(this.__data__, r) > -1;
  }
  return Fa = t, Fa;
}
var Ua, Qf;
function iw() {
  if (Qf) return Ua;
  Qf = 1;
  var e = Ii();
  function t(r, n) {
    var i = this.__data__, a = e(i, r);
    return a < 0 ? (++this.size, i.push([r, n])) : i[a][1] = n, this;
  }
  return Ua = t, Ua;
}
var Wa, eh;
function $i() {
  if (eh) return Wa;
  eh = 1;
  var e = ew(), t = tw(), r = rw(), n = nw(), i = iw();
  function a(o) {
    var u = -1, s = o == null ? 0 : o.length;
    for (this.clear(); ++u < s; ) {
      var c = o[u];
      this.set(c[0], c[1]);
    }
  }
  return a.prototype.clear = e, a.prototype.delete = t, a.prototype.get = r, a.prototype.has = n, a.prototype.set = i, Wa = a, Wa;
}
var za, th;
function Sl() {
  if (th) return za;
  th = 1;
  var e = zt(), t = nt(), r = e(t, "Map");
  return za = r, za;
}
var Ha, rh;
function aw() {
  if (rh) return Ha;
  rh = 1;
  var e = Q0(), t = $i(), r = Sl();
  function n() {
    this.size = 0, this.__data__ = {
      hash: new e(),
      map: new (r || t)(),
      string: new e()
    };
  }
  return Ha = n, Ha;
}
var Ga, nh;
function ow() {
  if (nh) return Ga;
  nh = 1;
  function e(t) {
    var r = typeof t;
    return r == "string" || r == "number" || r == "symbol" || r == "boolean" ? t !== "__proto__" : t === null;
  }
  return Ga = e, Ga;
}
var Ka, ih;
function Ri() {
  if (ih) return Ka;
  ih = 1;
  var e = ow();
  function t(r, n) {
    var i = r.__data__;
    return e(n) ? i[typeof n == "string" ? "string" : "hash"] : i.map;
  }
  return Ka = t, Ka;
}
var Xa, ah;
function uw() {
  if (ah) return Xa;
  ah = 1;
  var e = Ri();
  function t(r) {
    var n = e(this, r).delete(r);
    return this.size -= n ? 1 : 0, n;
  }
  return Xa = t, Xa;
}
var Va, oh;
function sw() {
  if (oh) return Va;
  oh = 1;
  var e = Ri();
  function t(r) {
    return e(this, r).get(r);
  }
  return Va = t, Va;
}
var Ya, uh;
function cw() {
  if (uh) return Ya;
  uh = 1;
  var e = Ri();
  function t(r) {
    return e(this, r).has(r);
  }
  return Ya = t, Ya;
}
var Za, sh;
function lw() {
  if (sh) return Za;
  sh = 1;
  var e = Ri();
  function t(r, n) {
    var i = e(this, r), a = i.size;
    return i.set(r, n), this.size += i.size == a ? 0 : 1, this;
  }
  return Za = t, Za;
}
var Ja, ch;
function Al() {
  if (ch) return Ja;
  ch = 1;
  var e = aw(), t = uw(), r = sw(), n = cw(), i = lw();
  function a(o) {
    var u = -1, s = o == null ? 0 : o.length;
    for (this.clear(); ++u < s; ) {
      var c = o[u];
      this.set(c[0], c[1]);
    }
  }
  return a.prototype.clear = e, a.prototype.delete = t, a.prototype.get = r, a.prototype.has = n, a.prototype.set = i, Ja = a, Ja;
}
var Qa, lh;
function Wg() {
  if (lh) return Qa;
  lh = 1;
  var e = Al(), t = "Expected a function";
  function r(n, i) {
    if (typeof n != "function" || i != null && typeof i != "function")
      throw new TypeError(t);
    var a = function() {
      var o = arguments, u = i ? i.apply(this, o) : o[0], s = a.cache;
      if (s.has(u))
        return s.get(u);
      var c = n.apply(this, o);
      return a.cache = s.set(u, c) || s, c;
    };
    return a.cache = new (r.Cache || e)(), a;
  }
  return r.Cache = e, Qa = r, Qa;
}
var eo, fh;
function fw() {
  if (fh) return eo;
  fh = 1;
  var e = Wg(), t = 500;
  function r(n) {
    var i = e(n, function(o) {
      return a.size === t && a.clear(), o;
    }), a = i.cache;
    return i;
  }
  return eo = r, eo;
}
var to, hh;
function hw() {
  if (hh) return to;
  hh = 1;
  var e = fw(), t = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, r = /\\(\\)?/g, n = e(function(i) {
    var a = [];
    return i.charCodeAt(0) === 46 && a.push(""), i.replace(t, function(o, u, s, c) {
      a.push(s ? c.replace(r, "$1") : u || o);
    }), a;
  });
  return to = n, to;
}
var ro, ph;
function Pl() {
  if (ph) return ro;
  ph = 1;
  function e(t, r) {
    for (var n = -1, i = t == null ? 0 : t.length, a = Array(i); ++n < i; )
      a[n] = r(t[n], n, t);
    return a;
  }
  return ro = e, ro;
}
var no, dh;
function pw() {
  if (dh) return no;
  dh = 1;
  var e = wn(), t = Pl(), r = Ie(), n = wr(), i = e ? e.prototype : void 0, a = i ? i.toString : void 0;
  function o(u) {
    if (typeof u == "string")
      return u;
    if (r(u))
      return t(u, o) + "";
    if (n(u))
      return a ? a.call(u) : "";
    var s = u + "";
    return s == "0" && 1 / u == -1 / 0 ? "-0" : s;
  }
  return no = o, no;
}
var io, vh;
function zg() {
  if (vh) return io;
  vh = 1;
  var e = pw();
  function t(r) {
    return r == null ? "" : e(r);
  }
  return io = t, io;
}
var ao, yh;
function Hg() {
  if (yh) return ao;
  yh = 1;
  var e = Ie(), t = xl(), r = hw(), n = zg();
  function i(a, o) {
    return e(a) ? a : t(a, o) ? [a] : r(n(a));
  }
  return ao = i, ao;
}
var oo, gh;
function Di() {
  if (gh) return oo;
  gh = 1;
  var e = wr();
  function t(r) {
    if (typeof r == "string" || e(r))
      return r;
    var n = r + "";
    return n == "0" && 1 / r == -1 / 0 ? "-0" : n;
  }
  return oo = t, oo;
}
var uo, mh;
function Tl() {
  if (mh) return uo;
  mh = 1;
  var e = Hg(), t = Di();
  function r(n, i) {
    i = e(i, n);
    for (var a = 0, o = i.length; n != null && a < o; )
      n = n[t(i[a++])];
    return a && a == o ? n : void 0;
  }
  return uo = r, uo;
}
var so, bh;
function Gg() {
  if (bh) return so;
  bh = 1;
  var e = Tl();
  function t(r, n, i) {
    var a = r == null ? void 0 : e(r, n);
    return a === void 0 ? i : a;
  }
  return so = t, so;
}
var dw = Gg();
const Qe = /* @__PURE__ */ ce(dw);
var co, wh;
function vw() {
  if (wh) return co;
  wh = 1;
  function e(t) {
    return t == null;
  }
  return co = e, co;
}
var yw = vw();
const V = /* @__PURE__ */ ce(yw);
var lo, xh;
function gw() {
  if (xh) return lo;
  xh = 1;
  var e = pt(), t = Ie(), r = dt(), n = "[object String]";
  function i(a) {
    return typeof a == "string" || !t(a) && r(a) && e(a) == n;
  }
  return lo = i, lo;
}
var mw = gw();
const Bt = /* @__PURE__ */ ce(mw);
var bw = _l();
const J = /* @__PURE__ */ ce(bw);
var ww = Ot();
const xr = /* @__PURE__ */ ce(ww);
var fo = { exports: {} }, te = {};
var _h;
function xw() {
  if (_h) return te;
  _h = 1;
  var e = /* @__PURE__ */ Symbol.for("react.element"), t = /* @__PURE__ */ Symbol.for("react.portal"), r = /* @__PURE__ */ Symbol.for("react.fragment"), n = /* @__PURE__ */ Symbol.for("react.strict_mode"), i = /* @__PURE__ */ Symbol.for("react.profiler"), a = /* @__PURE__ */ Symbol.for("react.provider"), o = /* @__PURE__ */ Symbol.for("react.context"), u = /* @__PURE__ */ Symbol.for("react.server_context"), s = /* @__PURE__ */ Symbol.for("react.forward_ref"), c = /* @__PURE__ */ Symbol.for("react.suspense"), f = /* @__PURE__ */ Symbol.for("react.suspense_list"), l = /* @__PURE__ */ Symbol.for("react.memo"), h = /* @__PURE__ */ Symbol.for("react.lazy"), d = /* @__PURE__ */ Symbol.for("react.offscreen"), g;
  g = /* @__PURE__ */ Symbol.for("react.module.reference");
  function v(p) {
    if (typeof p == "object" && p !== null) {
      var m = p.$$typeof;
      switch (m) {
        case e:
          switch (p = p.type, p) {
            case r:
            case i:
            case n:
            case c:
            case f:
              return p;
            default:
              switch (p = p && p.$$typeof, p) {
                case u:
                case o:
                case s:
                case h:
                case l:
                case a:
                  return p;
                default:
                  return m;
              }
          }
        case t:
          return m;
      }
    }
  }
  return te.ContextConsumer = o, te.ContextProvider = a, te.Element = e, te.ForwardRef = s, te.Fragment = r, te.Lazy = h, te.Memo = l, te.Portal = t, te.Profiler = i, te.StrictMode = n, te.Suspense = c, te.SuspenseList = f, te.isAsyncMode = function() {
    return !1;
  }, te.isConcurrentMode = function() {
    return !1;
  }, te.isContextConsumer = function(p) {
    return v(p) === o;
  }, te.isContextProvider = function(p) {
    return v(p) === a;
  }, te.isElement = function(p) {
    return typeof p == "object" && p !== null && p.$$typeof === e;
  }, te.isForwardRef = function(p) {
    return v(p) === s;
  }, te.isFragment = function(p) {
    return v(p) === r;
  }, te.isLazy = function(p) {
    return v(p) === h;
  }, te.isMemo = function(p) {
    return v(p) === l;
  }, te.isPortal = function(p) {
    return v(p) === t;
  }, te.isProfiler = function(p) {
    return v(p) === i;
  }, te.isStrictMode = function(p) {
    return v(p) === n;
  }, te.isSuspense = function(p) {
    return v(p) === c;
  }, te.isSuspenseList = function(p) {
    return v(p) === f;
  }, te.isValidElementType = function(p) {
    return typeof p == "string" || typeof p == "function" || p === r || p === i || p === n || p === c || p === f || p === d || typeof p == "object" && p !== null && (p.$$typeof === h || p.$$typeof === l || p.$$typeof === a || p.$$typeof === o || p.$$typeof === s || p.$$typeof === g || p.getModuleId !== void 0);
  }, te.typeOf = v, te;
}
var Oh;
function _w() {
  return Oh || (Oh = 1, fo.exports = xw()), fo.exports;
}
var Ow = _w(), ho, Sh;
function Kg() {
  if (Sh) return ho;
  Sh = 1;
  var e = pt(), t = dt(), r = "[object Number]";
  function n(i) {
    return typeof i == "number" || t(i) && e(i) == r;
  }
  return ho = n, ho;
}
var po, Ah;
function Sw() {
  if (Ah) return po;
  Ah = 1;
  var e = Kg();
  function t(r) {
    return e(r) && r != +r;
  }
  return po = t, po;
}
var Aw = Sw();
const xn = /* @__PURE__ */ ce(Aw);
var Pw = Kg();
const Tw = /* @__PURE__ */ ce(Pw);
var Ze = function(t) {
  return t === 0 ? 0 : t > 0 ? 1 : -1;
}, Rt = function(t) {
  return Bt(t) && t.indexOf("%") === t.length - 1;
}, B = function(t) {
  return Tw(t) && !xn(t);
}, Ew = function(t) {
  return V(t);
}, xe = function(t) {
  return B(t) || Bt(t);
}, jw = 0, Ni = function(t) {
  var r = ++jw;
  return "".concat(t || "").concat(r);
}, He = function(t, r) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
  if (!B(t) && !Bt(t))
    return n;
  var a;
  if (Rt(t)) {
    var o = t.indexOf("%");
    a = r * parseFloat(t.slice(0, o)) / 100;
  } else
    a = +t;
  return xn(a) && (a = n), i && a > r && (a = r), a;
}, mt = function(t) {
  if (!t)
    return null;
  var r = Object.keys(t);
  return r && r.length ? t[r[0]] : null;
}, Mw = function(t) {
  if (!Array.isArray(t))
    return !1;
  for (var r = t.length, n = {}, i = 0; i < r; i++)
    if (!n[t[i]])
      n[t[i]] = !0;
    else
      return !0;
  return !1;
}, Vt = function(t, r) {
  return B(t) && B(r) ? function(n) {
    return t + n * (r - t);
  } : function() {
    return r;
  };
};
function Fn(e, t, r) {
  return !e || !e.length ? null : e.find(function(n) {
    return n && (typeof t == "function" ? t(n) : Qe(n, t)) === r;
  });
}
var Cw = function(t, r) {
  return B(t) && B(r) ? t - r : Bt(t) && Bt(r) ? t.localeCompare(r) : t instanceof Date && r instanceof Date ? t.getTime() - r.getTime() : String(t).localeCompare(String(r));
};
function oc(e, t) {
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r) && (!{}.hasOwnProperty.call(t, r) || e[r] !== t[r]))
      return !1;
  for (var n in t)
    if ({}.hasOwnProperty.call(t, n) && !{}.hasOwnProperty.call(e, n))
      return !1;
  return !0;
}
function uc(e) {
  "@babel/helpers - typeof";
  return uc = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, uc(e);
}
var Iw = ["viewBox", "children"], $w = [
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-details",
  "aria-disabled",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
  "className",
  "color",
  "height",
  "id",
  "lang",
  "max",
  "media",
  "method",
  "min",
  "name",
  "style",
  /*
   * removed 'type' SVGElementPropKey because we do not currently use any SVG elements
   * that can use it and it conflicts with the recharts prop 'type'
   * https://github.com/recharts/recharts/pull/3327
   * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/type
   */
  // 'type',
  "target",
  "width",
  "role",
  "tabIndex",
  "accentHeight",
  "accumulate",
  "additive",
  "alignmentBaseline",
  "allowReorder",
  "alphabetic",
  "amplitude",
  "arabicForm",
  "ascent",
  "attributeName",
  "attributeType",
  "autoReverse",
  "azimuth",
  "baseFrequency",
  "baselineShift",
  "baseProfile",
  "bbox",
  "begin",
  "bias",
  "by",
  "calcMode",
  "capHeight",
  "clip",
  "clipPath",
  "clipPathUnits",
  "clipRule",
  "colorInterpolation",
  "colorInterpolationFilters",
  "colorProfile",
  "colorRendering",
  "contentScriptType",
  "contentStyleType",
  "cursor",
  "cx",
  "cy",
  "d",
  "decelerate",
  "descent",
  "diffuseConstant",
  "direction",
  "display",
  "divisor",
  "dominantBaseline",
  "dur",
  "dx",
  "dy",
  "edgeMode",
  "elevation",
  "enableBackground",
  "end",
  "exponent",
  "externalResourcesRequired",
  "fill",
  "fillOpacity",
  "fillRule",
  "filter",
  "filterRes",
  "filterUnits",
  "floodColor",
  "floodOpacity",
  "focusable",
  "fontFamily",
  "fontSize",
  "fontSizeAdjust",
  "fontStretch",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "format",
  "from",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyphName",
  "glyphOrientationHorizontal",
  "glyphOrientationVertical",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "hanging",
  "horizAdvX",
  "horizOriginX",
  "href",
  "ideographic",
  "imageRendering",
  "in2",
  "in",
  "intercept",
  "k1",
  "k2",
  "k3",
  "k4",
  "k",
  "kernelMatrix",
  "kernelUnitLength",
  "kerning",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "letterSpacing",
  "lightingColor",
  "limitingConeAngle",
  "local",
  "markerEnd",
  "markerHeight",
  "markerMid",
  "markerStart",
  "markerUnits",
  "markerWidth",
  "mask",
  "maskContentUnits",
  "maskUnits",
  "mathematical",
  "mode",
  "numOctaves",
  "offset",
  "opacity",
  "operator",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "overlinePosition",
  "overlineThickness",
  "paintOrder",
  "panose1",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointerEvents",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "r",
  "radius",
  "refX",
  "refY",
  "renderingIntent",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "restart",
  "result",
  "rotate",
  "rx",
  "ry",
  "seed",
  "shapeRendering",
  "slope",
  "spacing",
  "specularConstant",
  "specularExponent",
  "speed",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stemh",
  "stemv",
  "stitchTiles",
  "stopColor",
  "stopOpacity",
  "strikethroughPosition",
  "strikethroughThickness",
  "string",
  "stroke",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeLinecap",
  "strokeLinejoin",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textAnchor",
  "textDecoration",
  "textLength",
  "textRendering",
  "to",
  "transform",
  "u1",
  "u2",
  "underlinePosition",
  "underlineThickness",
  "unicode",
  "unicodeBidi",
  "unicodeRange",
  "unitsPerEm",
  "vAlphabetic",
  "values",
  "vectorEffect",
  "version",
  "vertAdvY",
  "vertOriginX",
  "vertOriginY",
  "vHanging",
  "vIdeographic",
  "viewTarget",
  "visibility",
  "vMathematical",
  "widths",
  "wordSpacing",
  "writingMode",
  "x1",
  "x2",
  "x",
  "xChannelSelector",
  "xHeight",
  "xlinkActuate",
  "xlinkArcrole",
  "xlinkHref",
  "xlinkRole",
  "xlinkShow",
  "xlinkTitle",
  "xlinkType",
  "xmlBase",
  "xmlLang",
  "xmlns",
  "xmlnsXlink",
  "xmlSpace",
  "y1",
  "y2",
  "y",
  "yChannelSelector",
  "z",
  "zoomAndPan",
  "ref",
  "key",
  "angle"
], Ph = ["points", "pathLength"], vo = {
  svg: Iw,
  polygon: Ph,
  polyline: Ph
}, El = ["dangerouslySetInnerHTML", "onCopy", "onCopyCapture", "onCut", "onCutCapture", "onPaste", "onPasteCapture", "onCompositionEnd", "onCompositionEndCapture", "onCompositionStart", "onCompositionStartCapture", "onCompositionUpdate", "onCompositionUpdateCapture", "onFocus", "onFocusCapture", "onBlur", "onBlurCapture", "onChange", "onChangeCapture", "onBeforeInput", "onBeforeInputCapture", "onInput", "onInputCapture", "onReset", "onResetCapture", "onSubmit", "onSubmitCapture", "onInvalid", "onInvalidCapture", "onLoad", "onLoadCapture", "onError", "onErrorCapture", "onKeyDown", "onKeyDownCapture", "onKeyPress", "onKeyPressCapture", "onKeyUp", "onKeyUpCapture", "onAbort", "onAbortCapture", "onCanPlay", "onCanPlayCapture", "onCanPlayThrough", "onCanPlayThroughCapture", "onDurationChange", "onDurationChangeCapture", "onEmptied", "onEmptiedCapture", "onEncrypted", "onEncryptedCapture", "onEnded", "onEndedCapture", "onLoadedData", "onLoadedDataCapture", "onLoadedMetadata", "onLoadedMetadataCapture", "onLoadStart", "onLoadStartCapture", "onPause", "onPauseCapture", "onPlay", "onPlayCapture", "onPlaying", "onPlayingCapture", "onProgress", "onProgressCapture", "onRateChange", "onRateChangeCapture", "onSeeked", "onSeekedCapture", "onSeeking", "onSeekingCapture", "onStalled", "onStalledCapture", "onSuspend", "onSuspendCapture", "onTimeUpdate", "onTimeUpdateCapture", "onVolumeChange", "onVolumeChangeCapture", "onWaiting", "onWaitingCapture", "onAuxClick", "onAuxClickCapture", "onClick", "onClickCapture", "onContextMenu", "onContextMenuCapture", "onDoubleClick", "onDoubleClickCapture", "onDrag", "onDragCapture", "onDragEnd", "onDragEndCapture", "onDragEnter", "onDragEnterCapture", "onDragExit", "onDragExitCapture", "onDragLeave", "onDragLeaveCapture", "onDragOver", "onDragOverCapture", "onDragStart", "onDragStartCapture", "onDrop", "onDropCapture", "onMouseDown", "onMouseDownCapture", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseMoveCapture", "onMouseOut", "onMouseOutCapture", "onMouseOver", "onMouseOverCapture", "onMouseUp", "onMouseUpCapture", "onSelect", "onSelectCapture", "onTouchCancel", "onTouchCancelCapture", "onTouchEnd", "onTouchEndCapture", "onTouchMove", "onTouchMoveCapture", "onTouchStart", "onTouchStartCapture", "onPointerDown", "onPointerDownCapture", "onPointerMove", "onPointerMoveCapture", "onPointerUp", "onPointerUpCapture", "onPointerCancel", "onPointerCancelCapture", "onPointerEnter", "onPointerEnterCapture", "onPointerLeave", "onPointerLeaveCapture", "onPointerOver", "onPointerOverCapture", "onPointerOut", "onPointerOutCapture", "onGotPointerCapture", "onGotPointerCaptureCapture", "onLostPointerCapture", "onLostPointerCaptureCapture", "onScroll", "onScrollCapture", "onWheel", "onWheelCapture", "onAnimationStart", "onAnimationStartCapture", "onAnimationEnd", "onAnimationEndCapture", "onAnimationIteration", "onAnimationIterationCapture", "onTransitionEnd", "onTransitionEndCapture"], Un = function(t, r) {
  if (!t || typeof t == "function" || typeof t == "boolean")
    return null;
  var n = t;
  if (/* @__PURE__ */ Ge(t) && (n = t.props), !xr(n))
    return null;
  var i = {};
  return Object.keys(n).forEach(function(a) {
    El.includes(a) && (i[a] = r || function(o) {
      return n[a](n, o);
    });
  }), i;
}, Rw = function(t, r, n) {
  return function(i) {
    return t(r, n, i), null;
  };
}, sc = function(t, r, n) {
  if (!xr(t) || uc(t) !== "object")
    return null;
  var i = null;
  return Object.keys(t).forEach(function(a) {
    var o = t[a];
    El.includes(a) && typeof o == "function" && (i || (i = {}), i[a] = Rw(o, r, n));
  }), i;
}, Dw = ["children"], Nw = ["children"];
function Th(e, t) {
  if (e == null) return {};
  var r = qw(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function qw(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function cc(e) {
  "@babel/helpers - typeof";
  return cc = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, cc(e);
}
var Eh = {
  click: "onClick",
  mousedown: "onMouseDown",
  mouseup: "onMouseUp",
  mouseover: "onMouseOver",
  mousemove: "onMouseMove",
  mouseout: "onMouseOut",
  mouseenter: "onMouseEnter",
  mouseleave: "onMouseLeave",
  touchcancel: "onTouchCancel",
  touchend: "onTouchEnd",
  touchmove: "onTouchMove",
  touchstart: "onTouchStart",
  contextmenu: "onContextMenu",
  dblclick: "onDoubleClick"
}, st = function(t) {
  return typeof t == "string" ? t : t ? t.displayName || t.name || "Component" : "";
}, jh = null, yo = null, jl = function e(t) {
  if (t === jh && Array.isArray(yo))
    return yo;
  var r = [];
  return Nt.forEach(t, function(n) {
    V(n) || (Ow.isFragment(n) ? r = r.concat(e(n.props.children)) : r.push(n));
  }), yo = r, jh = t, r;
};
function Ke(e, t) {
  var r = [], n = [];
  return Array.isArray(t) ? n = t.map(function(i) {
    return st(i);
  }) : n = [st(t)], jl(e).forEach(function(i) {
    var a = Qe(i, "type.displayName") || Qe(i, "type.name");
    n.indexOf(a) !== -1 && r.push(i);
  }), r;
}
function De(e, t) {
  var r = Ke(e, t);
  return r && r[0];
}
var Mh = function(t) {
  if (!t || !t.props)
    return !1;
  var r = t.props, n = r.width, i = r.height;
  return !(!B(n) || n <= 0 || !B(i) || i <= 0);
}, kw = ["a", "altGlyph", "altGlyphDef", "altGlyphItem", "animate", "animateColor", "animateMotion", "animateTransform", "circle", "clipPath", "color-profile", "cursor", "defs", "desc", "ellipse", "feBlend", "feColormatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "font", "font-face", "font-face-format", "font-face-name", "font-face-url", "foreignObject", "g", "glyph", "glyphRef", "hkern", "image", "line", "lineGradient", "marker", "mask", "metadata", "missing-glyph", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "script", "set", "stop", "style", "svg", "switch", "symbol", "text", "textPath", "title", "tref", "tspan", "use", "view", "vkern"], Lw = function(t) {
  return t && t.type && Bt(t.type) && kw.indexOf(t.type) >= 0;
}, wR = function(t) {
  return t && cc(t) === "object" && "clipDot" in t;
}, Bw = function(t, r, n, i) {
  var a, o = (a = vo?.[i]) !== null && a !== void 0 ? a : [];
  return r.startsWith("data-") || !J(t) && (i && o.includes(r) || $w.includes(r)) || n && El.includes(r);
}, se = function(t, r, n) {
  if (!t || typeof t == "function" || typeof t == "boolean")
    return null;
  var i = t;
  if (/* @__PURE__ */ Ge(t) && (i = t.props), !xr(i))
    return null;
  var a = {};
  return Object.keys(i).forEach(function(o) {
    var u;
    Bw((u = i) === null || u === void 0 ? void 0 : u[o], o, r, n) && (a[o] = i[o]);
  }), a;
}, lc = function e(t, r) {
  if (t === r)
    return !0;
  var n = Nt.count(t);
  if (n !== Nt.count(r))
    return !1;
  if (n === 0)
    return !0;
  if (n === 1)
    return Ch(Array.isArray(t) ? t[0] : t, Array.isArray(r) ? r[0] : r);
  for (var i = 0; i < n; i++) {
    var a = t[i], o = r[i];
    if (Array.isArray(a) || Array.isArray(o)) {
      if (!e(a, o))
        return !1;
    } else if (!Ch(a, o))
      return !1;
  }
  return !0;
}, Ch = function(t, r) {
  if (V(t) && V(r))
    return !0;
  if (!V(t) && !V(r)) {
    var n = t.props || {}, i = n.children, a = Th(n, Dw), o = r.props || {}, u = o.children, s = Th(o, Nw);
    return i && u ? oc(a, s) && lc(i, u) : !i && !u ? oc(a, s) : !1;
  }
  return !1;
}, Ih = function(t, r) {
  var n = [], i = {};
  return jl(t).forEach(function(a, o) {
    if (Lw(a))
      n.push(a);
    else if (a) {
      var u = st(a.type), s = r[u] || {}, c = s.handler, f = s.once;
      if (c && (!f || !i[u])) {
        var l = c(a, u, o);
        n.push(l), i[u] = !0;
      }
    }
  }), n;
}, Fw = function(t) {
  var r = t && t.type;
  return r && Eh[r] ? Eh[r] : null;
}, Uw = function(t, r) {
  return jl(r).indexOf(t);
}, Ww = ["children", "width", "height", "viewBox", "className", "style", "title", "desc"];
function fc() {
  return fc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, fc.apply(this, arguments);
}
function zw(e, t) {
  if (e == null) return {};
  var r = Hw(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function Hw(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function hc(e) {
  var t = e.children, r = e.width, n = e.height, i = e.viewBox, a = e.className, o = e.style, u = e.title, s = e.desc, c = zw(e, Ww), f = i || {
    width: r,
    height: n,
    x: 0,
    y: 0
  }, l = ue("recharts-surface", a);
  return /* @__PURE__ */ E.createElement("svg", fc({}, se(c, !0, "svg"), {
    className: l,
    width: r,
    height: n,
    style: o,
    viewBox: "".concat(f.x, " ").concat(f.y, " ").concat(f.width, " ").concat(f.height)
  }), /* @__PURE__ */ E.createElement("title", null, u), /* @__PURE__ */ E.createElement("desc", null, s), t);
}
var Gw = ["children", "className"];
function pc() {
  return pc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, pc.apply(this, arguments);
}
function Kw(e, t) {
  if (e == null) return {};
  var r = Xw(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function Xw(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var Te = /* @__PURE__ */ E.forwardRef(function(e, t) {
  var r = e.children, n = e.className, i = Kw(e, Gw), a = ue("recharts-layer", n);
  return /* @__PURE__ */ E.createElement("g", pc({
    className: a
  }, se(i, !0), {
    ref: t
  }), r);
}), qt = function(t, r) {
  for (var n = arguments.length, i = new Array(n > 2 ? n - 2 : 0), a = 2; a < n; a++)
    i[a - 2] = arguments[a];
}, go, $h;
function Vw() {
  if ($h) return go;
  $h = 1;
  function e(t, r, n) {
    var i = -1, a = t.length;
    r < 0 && (r = -r > a ? 0 : a + r), n = n > a ? a : n, n < 0 && (n += a), a = r > n ? 0 : n - r >>> 0, r >>>= 0;
    for (var o = Array(a); ++i < a; )
      o[i] = t[i + r];
    return o;
  }
  return go = e, go;
}
var mo, Rh;
function Yw() {
  if (Rh) return mo;
  Rh = 1;
  var e = Vw();
  function t(r, n, i) {
    var a = r.length;
    return i = i === void 0 ? a : i, !n && i >= a ? r : e(r, n, i);
  }
  return mo = t, mo;
}
var bo, Dh;
function Xg() {
  if (Dh) return bo;
  Dh = 1;
  var e = "\\ud800-\\udfff", t = "\\u0300-\\u036f", r = "\\ufe20-\\ufe2f", n = "\\u20d0-\\u20ff", i = t + r + n, a = "\\ufe0e\\ufe0f", o = "\\u200d", u = RegExp("[" + o + e + i + a + "]");
  function s(c) {
    return u.test(c);
  }
  return bo = s, bo;
}
var wo, Nh;
function Zw() {
  if (Nh) return wo;
  Nh = 1;
  function e(t) {
    return t.split("");
  }
  return wo = e, wo;
}
var xo, qh;
function Jw() {
  if (qh) return xo;
  qh = 1;
  var e = "\\ud800-\\udfff", t = "\\u0300-\\u036f", r = "\\ufe20-\\ufe2f", n = "\\u20d0-\\u20ff", i = t + r + n, a = "\\ufe0e\\ufe0f", o = "[" + e + "]", u = "[" + i + "]", s = "\\ud83c[\\udffb-\\udfff]", c = "(?:" + u + "|" + s + ")", f = "[^" + e + "]", l = "(?:\\ud83c[\\udde6-\\uddff]){2}", h = "[\\ud800-\\udbff][\\udc00-\\udfff]", d = "\\u200d", g = c + "?", v = "[" + a + "]?", p = "(?:" + d + "(?:" + [f, l, h].join("|") + ")" + v + g + ")*", m = v + g + p, w = "(?:" + [f + u + "?", u, l, h, o].join("|") + ")", x = RegExp(s + "(?=" + s + ")|" + w + m, "g");
  function _(y) {
    return y.match(x) || [];
  }
  return xo = _, xo;
}
var _o, kh;
function Qw() {
  if (kh) return _o;
  kh = 1;
  var e = Zw(), t = Xg(), r = Jw();
  function n(i) {
    return t(i) ? r(i) : e(i);
  }
  return _o = n, _o;
}
var Oo, Lh;
function ex() {
  if (Lh) return Oo;
  Lh = 1;
  var e = Yw(), t = Xg(), r = Qw(), n = zg();
  function i(a) {
    return function(o) {
      o = n(o);
      var u = t(o) ? r(o) : void 0, s = u ? u[0] : o.charAt(0), c = u ? e(u, 1).join("") : o.slice(1);
      return s[a]() + c;
    };
  }
  return Oo = i, Oo;
}
var So, Bh;
function tx() {
  if (Bh) return So;
  Bh = 1;
  var e = ex(), t = e("toUpperCase");
  return So = t, So;
}
var rx = tx();
const qi = /* @__PURE__ */ ce(rx);
function ie(e) {
  return function() {
    return e;
  };
}
const Vg = Math.cos, Wn = Math.sin, Ve = Math.sqrt, zn = Math.PI, ki = 2 * zn, dc = Math.PI, vc = 2 * dc, It = 1e-6, nx = vc - It;
function Yg(e) {
  this._ += e[0];
  for (let t = 1, r = e.length; t < r; ++t)
    this._ += arguments[t] + e[t];
}
function ix(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return Yg;
  const r = 10 ** t;
  return function(n) {
    this._ += n[0];
    for (let i = 1, a = n.length; i < a; ++i)
      this._ += Math.round(arguments[i] * r) / r + n[i];
  };
}
class ax {
  constructor(t) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = t == null ? Yg : ix(t);
  }
  moveTo(t, r) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}`;
  }
  closePath() {
    this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
  }
  lineTo(t, r) {
    this._append`L${this._x1 = +t},${this._y1 = +r}`;
  }
  quadraticCurveTo(t, r, n, i) {
    this._append`Q${+t},${+r},${this._x1 = +n},${this._y1 = +i}`;
  }
  bezierCurveTo(t, r, n, i, a, o) {
    this._append`C${+t},${+r},${+n},${+i},${this._x1 = +a},${this._y1 = +o}`;
  }
  arcTo(t, r, n, i, a) {
    if (t = +t, r = +r, n = +n, i = +i, a = +a, a < 0) throw new Error(`negative radius: ${a}`);
    let o = this._x1, u = this._y1, s = n - t, c = i - r, f = o - t, l = u - r, h = f * f + l * l;
    if (this._x1 === null)
      this._append`M${this._x1 = t},${this._y1 = r}`;
    else if (h > It) if (!(Math.abs(l * s - c * f) > It) || !a)
      this._append`L${this._x1 = t},${this._y1 = r}`;
    else {
      let d = n - o, g = i - u, v = s * s + c * c, p = d * d + g * g, m = Math.sqrt(v), w = Math.sqrt(h), x = a * Math.tan((dc - Math.acos((v + h - p) / (2 * m * w))) / 2), _ = x / w, y = x / m;
      Math.abs(_ - 1) > It && this._append`L${t + _ * f},${r + _ * l}`, this._append`A${a},${a},0,0,${+(l * d > f * g)},${this._x1 = t + y * s},${this._y1 = r + y * c}`;
    }
  }
  arc(t, r, n, i, a, o) {
    if (t = +t, r = +r, n = +n, o = !!o, n < 0) throw new Error(`negative radius: ${n}`);
    let u = n * Math.cos(i), s = n * Math.sin(i), c = t + u, f = r + s, l = 1 ^ o, h = o ? i - a : a - i;
    this._x1 === null ? this._append`M${c},${f}` : (Math.abs(this._x1 - c) > It || Math.abs(this._y1 - f) > It) && this._append`L${c},${f}`, n && (h < 0 && (h = h % vc + vc), h > nx ? this._append`A${n},${n},0,1,${l},${t - u},${r - s}A${n},${n},0,1,${l},${this._x1 = c},${this._y1 = f}` : h > It && this._append`A${n},${n},0,${+(h >= dc)},${l},${this._x1 = t + n * Math.cos(a)},${this._y1 = r + n * Math.sin(a)}`);
  }
  rect(t, r, n, i) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}h${n = +n}v${+i}h${-n}Z`;
  }
  toString() {
    return this._;
  }
}
function Ml(e) {
  let t = 3;
  return e.digits = function(r) {
    if (!arguments.length) return t;
    if (r == null)
      t = null;
    else {
      const n = Math.floor(r);
      if (!(n >= 0)) throw new RangeError(`invalid digits: ${r}`);
      t = n;
    }
    return e;
  }, () => new ax(t);
}
function Cl(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Zg(e) {
  this._context = e;
}
Zg.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      // falls through
      default:
        this._context.lineTo(e, t);
        break;
    }
  }
};
function Li(e) {
  return new Zg(e);
}
function Jg(e) {
  return e[0];
}
function Qg(e) {
  return e[1];
}
function em(e, t) {
  var r = ie(!0), n = null, i = Li, a = null, o = Ml(u);
  e = typeof e == "function" ? e : e === void 0 ? Jg : ie(e), t = typeof t == "function" ? t : t === void 0 ? Qg : ie(t);
  function u(s) {
    var c, f = (s = Cl(s)).length, l, h = !1, d;
    for (n == null && (a = i(d = o())), c = 0; c <= f; ++c)
      !(c < f && r(l = s[c], c, s)) === h && ((h = !h) ? a.lineStart() : a.lineEnd()), h && a.point(+e(l, c, s), +t(l, c, s));
    if (d) return a = null, d + "" || null;
  }
  return u.x = function(s) {
    return arguments.length ? (e = typeof s == "function" ? s : ie(+s), u) : e;
  }, u.y = function(s) {
    return arguments.length ? (t = typeof s == "function" ? s : ie(+s), u) : t;
  }, u.defined = function(s) {
    return arguments.length ? (r = typeof s == "function" ? s : ie(!!s), u) : r;
  }, u.curve = function(s) {
    return arguments.length ? (i = s, n != null && (a = i(n)), u) : i;
  }, u.context = function(s) {
    return arguments.length ? (s == null ? n = a = null : a = i(n = s), u) : n;
  }, u;
}
function jn(e, t, r) {
  var n = null, i = ie(!0), a = null, o = Li, u = null, s = Ml(c);
  e = typeof e == "function" ? e : e === void 0 ? Jg : ie(+e), t = typeof t == "function" ? t : ie(t === void 0 ? 0 : +t), r = typeof r == "function" ? r : r === void 0 ? Qg : ie(+r);
  function c(l) {
    var h, d, g, v = (l = Cl(l)).length, p, m = !1, w, x = new Array(v), _ = new Array(v);
    for (a == null && (u = o(w = s())), h = 0; h <= v; ++h) {
      if (!(h < v && i(p = l[h], h, l)) === m)
        if (m = !m)
          d = h, u.areaStart(), u.lineStart();
        else {
          for (u.lineEnd(), u.lineStart(), g = h - 1; g >= d; --g)
            u.point(x[g], _[g]);
          u.lineEnd(), u.areaEnd();
        }
      m && (x[h] = +e(p, h, l), _[h] = +t(p, h, l), u.point(n ? +n(p, h, l) : x[h], r ? +r(p, h, l) : _[h]));
    }
    if (w) return u = null, w + "" || null;
  }
  function f() {
    return em().defined(i).curve(o).context(a);
  }
  return c.x = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : ie(+l), n = null, c) : e;
  }, c.x0 = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : ie(+l), c) : e;
  }, c.x1 = function(l) {
    return arguments.length ? (n = l == null ? null : typeof l == "function" ? l : ie(+l), c) : n;
  }, c.y = function(l) {
    return arguments.length ? (t = typeof l == "function" ? l : ie(+l), r = null, c) : t;
  }, c.y0 = function(l) {
    return arguments.length ? (t = typeof l == "function" ? l : ie(+l), c) : t;
  }, c.y1 = function(l) {
    return arguments.length ? (r = l == null ? null : typeof l == "function" ? l : ie(+l), c) : r;
  }, c.lineX0 = c.lineY0 = function() {
    return f().x(e).y(t);
  }, c.lineY1 = function() {
    return f().x(e).y(r);
  }, c.lineX1 = function() {
    return f().x(n).y(t);
  }, c.defined = function(l) {
    return arguments.length ? (i = typeof l == "function" ? l : ie(!!l), c) : i;
  }, c.curve = function(l) {
    return arguments.length ? (o = l, a != null && (u = o(a)), c) : o;
  }, c.context = function(l) {
    return arguments.length ? (l == null ? a = u = null : u = o(a = l), c) : a;
  }, c;
}
class tm {
  constructor(t, r) {
    this._context = t, this._x = r;
  }
  areaStart() {
    this._line = 0;
  }
  areaEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  }
  point(t, r) {
    switch (t = +t, r = +r, this._point) {
      case 0: {
        this._point = 1, this._line ? this._context.lineTo(t, r) : this._context.moveTo(t, r);
        break;
      }
      case 1:
        this._point = 2;
      // falls through
      default: {
        this._x ? this._context.bezierCurveTo(this._x0 = (this._x0 + t) / 2, this._y0, this._x0, r, t, r) : this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + r) / 2, t, this._y0, t, r);
        break;
      }
    }
    this._x0 = t, this._y0 = r;
  }
}
function ox(e) {
  return new tm(e, !0);
}
function ux(e) {
  return new tm(e, !1);
}
const Il = {
  draw(e, t) {
    const r = Ve(t / zn);
    e.moveTo(r, 0), e.arc(0, 0, r, 0, ki);
  }
}, sx = {
  draw(e, t) {
    const r = Ve(t / 5) / 2;
    e.moveTo(-3 * r, -r), e.lineTo(-r, -r), e.lineTo(-r, -3 * r), e.lineTo(r, -3 * r), e.lineTo(r, -r), e.lineTo(3 * r, -r), e.lineTo(3 * r, r), e.lineTo(r, r), e.lineTo(r, 3 * r), e.lineTo(-r, 3 * r), e.lineTo(-r, r), e.lineTo(-3 * r, r), e.closePath();
  }
}, rm = Ve(1 / 3), cx = rm * 2, lx = {
  draw(e, t) {
    const r = Ve(t / cx), n = r * rm;
    e.moveTo(0, -r), e.lineTo(n, 0), e.lineTo(0, r), e.lineTo(-n, 0), e.closePath();
  }
}, fx = {
  draw(e, t) {
    const r = Ve(t), n = -r / 2;
    e.rect(n, n, r, r);
  }
}, hx = 0.8908130915292852, nm = Wn(zn / 10) / Wn(7 * zn / 10), px = Wn(ki / 10) * nm, dx = -Vg(ki / 10) * nm, vx = {
  draw(e, t) {
    const r = Ve(t * hx), n = px * r, i = dx * r;
    e.moveTo(0, -r), e.lineTo(n, i);
    for (let a = 1; a < 5; ++a) {
      const o = ki * a / 5, u = Vg(o), s = Wn(o);
      e.lineTo(s * r, -u * r), e.lineTo(u * n - s * i, s * n + u * i);
    }
    e.closePath();
  }
}, Ao = Ve(3), yx = {
  draw(e, t) {
    const r = -Ve(t / (Ao * 3));
    e.moveTo(0, r * 2), e.lineTo(-Ao * r, -r), e.lineTo(Ao * r, -r), e.closePath();
  }
}, qe = -0.5, ke = Ve(3) / 2, yc = 1 / Ve(12), gx = (yc / 2 + 1) * 3, mx = {
  draw(e, t) {
    const r = Ve(t / gx), n = r / 2, i = r * yc, a = n, o = r * yc + r, u = -a, s = o;
    e.moveTo(n, i), e.lineTo(a, o), e.lineTo(u, s), e.lineTo(qe * n - ke * i, ke * n + qe * i), e.lineTo(qe * a - ke * o, ke * a + qe * o), e.lineTo(qe * u - ke * s, ke * u + qe * s), e.lineTo(qe * n + ke * i, qe * i - ke * n), e.lineTo(qe * a + ke * o, qe * o - ke * a), e.lineTo(qe * u + ke * s, qe * s - ke * u), e.closePath();
  }
};
function bx(e, t) {
  let r = null, n = Ml(i);
  e = typeof e == "function" ? e : ie(e || Il), t = typeof t == "function" ? t : ie(t === void 0 ? 64 : +t);
  function i() {
    let a;
    if (r || (r = a = n()), e.apply(this, arguments).draw(r, +t.apply(this, arguments)), a) return r = null, a + "" || null;
  }
  return i.type = function(a) {
    return arguments.length ? (e = typeof a == "function" ? a : ie(a), i) : e;
  }, i.size = function(a) {
    return arguments.length ? (t = typeof a == "function" ? a : ie(+a), i) : t;
  }, i.context = function(a) {
    return arguments.length ? (r = a ?? null, i) : r;
  }, i;
}
function Hn() {
}
function Gn(e, t, r) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + r) / 6
  );
}
function im(e) {
  this._context = e;
}
im.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3:
        Gn(this, this._x1, this._y1);
      // falls through
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
      // falls through
      default:
        Gn(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function wx(e) {
  return new im(e);
}
function am(e) {
  this._context = e;
}
am.prototype = {
  areaStart: Hn,
  areaEnd: Hn,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2), this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._x2 = e, this._y2 = t;
        break;
      case 1:
        this._point = 2, this._x3 = e, this._y3 = t;
        break;
      case 2:
        this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
        break;
      default:
        Gn(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function xx(e) {
  return new am(e);
}
function om(e) {
  this._context = e;
}
om.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var r = (this._x0 + 4 * this._x1 + e) / 6, n = (this._y0 + 4 * this._y1 + t) / 6;
        this._line ? this._context.lineTo(r, n) : this._context.moveTo(r, n);
        break;
      case 3:
        this._point = 4;
      // falls through
      default:
        Gn(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function _x(e) {
  return new om(e);
}
function um(e) {
  this._context = e;
}
um.prototype = {
  areaStart: Hn,
  areaEnd: Hn,
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    this._point && this._context.closePath();
  },
  point: function(e, t) {
    e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t));
  }
};
function Ox(e) {
  return new um(e);
}
function Fh(e) {
  return e < 0 ? -1 : 1;
}
function Uh(e, t, r) {
  var n = e._x1 - e._x0, i = t - e._x1, a = (e._y1 - e._y0) / (n || i < 0 && -0), o = (r - e._y1) / (i || n < 0 && -0), u = (a * i + o * n) / (n + i);
  return (Fh(a) + Fh(o)) * Math.min(Math.abs(a), Math.abs(o), 0.5 * Math.abs(u)) || 0;
}
function Wh(e, t) {
  var r = e._x1 - e._x0;
  return r ? (3 * (e._y1 - e._y0) / r - t) / 2 : t;
}
function Po(e, t, r) {
  var n = e._x0, i = e._y0, a = e._x1, o = e._y1, u = (a - n) / 3;
  e._context.bezierCurveTo(n + u, i + u * t, a - u, o - u * r, a, o);
}
function Kn(e) {
  this._context = e;
}
Kn.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        Po(this, this._t0, Wh(this, this._t0));
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    var r = NaN;
    if (e = +e, t = +t, !(e === this._x1 && t === this._y1)) {
      switch (this._point) {
        case 0:
          this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          this._point = 3, Po(this, Wh(this, r = Uh(this, e, t)), r);
          break;
        default:
          Po(this, this._t0, r = Uh(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = r;
    }
  }
};
function sm(e) {
  this._context = new cm(e);
}
(sm.prototype = Object.create(Kn.prototype)).point = function(e, t) {
  Kn.prototype.point.call(this, t, e);
};
function cm(e) {
  this._context = e;
}
cm.prototype = {
  moveTo: function(e, t) {
    this._context.moveTo(t, e);
  },
  closePath: function() {
    this._context.closePath();
  },
  lineTo: function(e, t) {
    this._context.lineTo(t, e);
  },
  bezierCurveTo: function(e, t, r, n, i, a) {
    this._context.bezierCurveTo(t, e, n, r, a, i);
  }
};
function Sx(e) {
  return new Kn(e);
}
function Ax(e) {
  return new sm(e);
}
function lm(e) {
  this._context = e;
}
lm.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = [], this._y = [];
  },
  lineEnd: function() {
    var e = this._x, t = this._y, r = e.length;
    if (r)
      if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), r === 2)
        this._context.lineTo(e[1], t[1]);
      else
        for (var n = zh(e), i = zh(t), a = 0, o = 1; o < r; ++a, ++o)
          this._context.bezierCurveTo(n[0][a], i[0][a], n[1][a], i[1][a], e[o], t[o]);
    (this._line || this._line !== 0 && r === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
function zh(e) {
  var t, r = e.length - 1, n, i = new Array(r), a = new Array(r), o = new Array(r);
  for (i[0] = 0, a[0] = 2, o[0] = e[0] + 2 * e[1], t = 1; t < r - 1; ++t) i[t] = 1, a[t] = 4, o[t] = 4 * e[t] + 2 * e[t + 1];
  for (i[r - 1] = 2, a[r - 1] = 7, o[r - 1] = 8 * e[r - 1] + e[r], t = 1; t < r; ++t) n = i[t] / a[t - 1], a[t] -= n, o[t] -= n * o[t - 1];
  for (i[r - 1] = o[r - 1] / a[r - 1], t = r - 2; t >= 0; --t) i[t] = (o[t] - i[t + 1]) / a[t];
  for (a[r - 1] = (e[r] + i[r - 1]) / 2, t = 0; t < r - 1; ++t) a[t] = 2 * e[t + 1] - i[t + 1];
  return [i, a];
}
function Px(e) {
  return new lm(e);
}
function Bi(e, t) {
  this._context = e, this._t = t;
}
Bi.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN, this._point = 0;
  },
  lineEnd: function() {
    0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y), (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      // falls through
      default: {
        if (this._t <= 0)
          this._context.lineTo(this._x, t), this._context.lineTo(e, t);
        else {
          var r = this._x * (1 - this._t) + e * this._t;
          this._context.lineTo(r, this._y), this._context.lineTo(r, t);
        }
        break;
      }
    }
    this._x = e, this._y = t;
  }
};
function Tx(e) {
  return new Bi(e, 0.5);
}
function Ex(e) {
  return new Bi(e, 0);
}
function jx(e) {
  return new Bi(e, 1);
}
function rr(e, t) {
  if ((o = e.length) > 1)
    for (var r = 1, n, i, a = e[t[0]], o, u = a.length; r < o; ++r)
      for (i = a, a = e[t[r]], n = 0; n < u; ++n)
        a[n][1] += a[n][0] = isNaN(i[n][1]) ? i[n][0] : i[n][1];
}
function gc(e) {
  for (var t = e.length, r = new Array(t); --t >= 0; ) r[t] = t;
  return r;
}
function Mx(e, t) {
  return e[t];
}
function Cx(e) {
  const t = [];
  return t.key = e, t;
}
function Ix() {
  var e = ie([]), t = gc, r = rr, n = Mx;
  function i(a) {
    var o = Array.from(e.apply(this, arguments), Cx), u, s = o.length, c = -1, f;
    for (const l of a)
      for (u = 0, ++c; u < s; ++u)
        (o[u][c] = [0, +n(l, o[u].key, c, a)]).data = l;
    for (u = 0, f = Cl(t(o)); u < s; ++u)
      o[f[u]].index = u;
    return r(o, f), o;
  }
  return i.keys = function(a) {
    return arguments.length ? (e = typeof a == "function" ? a : ie(Array.from(a)), i) : e;
  }, i.value = function(a) {
    return arguments.length ? (n = typeof a == "function" ? a : ie(+a), i) : n;
  }, i.order = function(a) {
    return arguments.length ? (t = a == null ? gc : typeof a == "function" ? a : ie(Array.from(a)), i) : t;
  }, i.offset = function(a) {
    return arguments.length ? (r = a ?? rr, i) : r;
  }, i;
}
function $x(e, t) {
  if ((n = e.length) > 0) {
    for (var r, n, i = 0, a = e[0].length, o; i < a; ++i) {
      for (o = r = 0; r < n; ++r) o += e[r][i][1] || 0;
      if (o) for (r = 0; r < n; ++r) e[r][i][1] /= o;
    }
    rr(e, t);
  }
}
function Rx(e, t) {
  if ((i = e.length) > 0) {
    for (var r = 0, n = e[t[0]], i, a = n.length; r < a; ++r) {
      for (var o = 0, u = 0; o < i; ++o) u += e[o][r][1] || 0;
      n[r][1] += n[r][0] = -u / 2;
    }
    rr(e, t);
  }
}
function Dx(e, t) {
  if (!(!((o = e.length) > 0) || !((a = (i = e[t[0]]).length) > 0))) {
    for (var r = 0, n = 1, i, a, o; n < a; ++n) {
      for (var u = 0, s = 0, c = 0; u < o; ++u) {
        for (var f = e[t[u]], l = f[n][1] || 0, h = f[n - 1][1] || 0, d = (l - h) / 2, g = 0; g < u; ++g) {
          var v = e[t[g]], p = v[n][1] || 0, m = v[n - 1][1] || 0;
          d += p - m;
        }
        s += l, c += d * l;
      }
      i[n - 1][1] += i[n - 1][0] = r, s && (r -= c / s);
    }
    i[n - 1][1] += i[n - 1][0] = r, rr(e, t);
  }
}
function Fr(e) {
  "@babel/helpers - typeof";
  return Fr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Fr(e);
}
var Nx = ["type", "size", "sizeType"];
function mc() {
  return mc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, mc.apply(this, arguments);
}
function Hh(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Gh(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Hh(Object(r), !0).forEach(function(n) {
      qx(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Hh(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function qx(e, t, r) {
  return t = kx(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function kx(e) {
  var t = Lx(e, "string");
  return Fr(t) == "symbol" ? t : t + "";
}
function Lx(e, t) {
  if (Fr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Fr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Bx(e, t) {
  if (e == null) return {};
  var r = Fx(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function Fx(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var fm = {
  symbolCircle: Il,
  symbolCross: sx,
  symbolDiamond: lx,
  symbolSquare: fx,
  symbolStar: vx,
  symbolTriangle: yx,
  symbolWye: mx
}, Ux = Math.PI / 180, Wx = function(t) {
  var r = "symbol".concat(qi(t));
  return fm[r] || Il;
}, zx = function(t, r, n) {
  if (r === "area")
    return t;
  switch (n) {
    case "cross":
      return 5 * t * t / 9;
    case "diamond":
      return 0.5 * t * t / Math.sqrt(3);
    case "square":
      return t * t;
    case "star": {
      var i = 18 * Ux;
      return 1.25 * t * t * (Math.tan(i) - Math.tan(i * 2) * Math.pow(Math.tan(i), 2));
    }
    case "triangle":
      return Math.sqrt(3) * t * t / 4;
    case "wye":
      return (21 - 10 * Math.sqrt(3)) * t * t / 8;
    default:
      return Math.PI * t * t / 4;
  }
}, Hx = function(t, r) {
  fm["symbol".concat(qi(t))] = r;
}, $l = function(t) {
  var r = t.type, n = r === void 0 ? "circle" : r, i = t.size, a = i === void 0 ? 64 : i, o = t.sizeType, u = o === void 0 ? "area" : o, s = Bx(t, Nx), c = Gh(Gh({}, s), {}, {
    type: n,
    size: a,
    sizeType: u
  }), f = function() {
    var p = Wx(n), m = bx().type(p).size(zx(a, u, n));
    return m();
  }, l = c.className, h = c.cx, d = c.cy, g = se(c, !0);
  return h === +h && d === +d && a === +a ? /* @__PURE__ */ E.createElement("path", mc({}, g, {
    className: ue("recharts-symbols", l),
    transform: "translate(".concat(h, ", ").concat(d, ")"),
    d: f()
  })) : null;
};
$l.registerSymbol = Hx;
function nr(e) {
  "@babel/helpers - typeof";
  return nr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, nr(e);
}
function bc() {
  return bc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, bc.apply(this, arguments);
}
function Kh(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Gx(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Kh(Object(r), !0).forEach(function(n) {
      Ur(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Kh(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Kx(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function Xx(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, pm(n.key), n);
  }
}
function Vx(e, t, r) {
  return t && Xx(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function Yx(e, t, r) {
  return t = Xn(t), Zx(e, hm() ? Reflect.construct(t, r || [], Xn(e).constructor) : t.apply(e, r));
}
function Zx(e, t) {
  if (t && (nr(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return Jx(e);
}
function Jx(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function hm() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (hm = function() {
    return !!e;
  })();
}
function Xn(e) {
  return Xn = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Xn(e);
}
function Qx(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && wc(e, t);
}
function wc(e, t) {
  return wc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, i) {
    return n.__proto__ = i, n;
  }, wc(e, t);
}
function Ur(e, t, r) {
  return t = pm(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function pm(e) {
  var t = e1(e, "string");
  return nr(t) == "symbol" ? t : t + "";
}
function e1(e, t) {
  if (nr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (nr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Le = 32, Rl = /* @__PURE__ */ (function(e) {
  function t() {
    return Kx(this, t), Yx(this, t, arguments);
  }
  return Qx(t, e), Vx(t, [{
    key: "renderIcon",
    value: (
      /**
       * Render the path of icon
       * @param {Object} data Data of each legend item
       * @return {String} Path element
       */
      function(n) {
        var i = this.props.inactiveColor, a = Le / 2, o = Le / 6, u = Le / 3, s = n.inactive ? i : n.color;
        if (n.type === "plainline")
          return /* @__PURE__ */ E.createElement("line", {
            strokeWidth: 4,
            fill: "none",
            stroke: s,
            strokeDasharray: n.payload.strokeDasharray,
            x1: 0,
            y1: a,
            x2: Le,
            y2: a,
            className: "recharts-legend-icon"
          });
        if (n.type === "line")
          return /* @__PURE__ */ E.createElement("path", {
            strokeWidth: 4,
            fill: "none",
            stroke: s,
            d: "M0,".concat(a, "h").concat(u, `
            A`).concat(o, ",").concat(o, ",0,1,1,").concat(2 * u, ",").concat(a, `
            H`).concat(Le, "M").concat(2 * u, ",").concat(a, `
            A`).concat(o, ",").concat(o, ",0,1,1,").concat(u, ",").concat(a),
            className: "recharts-legend-icon"
          });
        if (n.type === "rect")
          return /* @__PURE__ */ E.createElement("path", {
            stroke: "none",
            fill: s,
            d: "M0,".concat(Le / 8, "h").concat(Le, "v").concat(Le * 3 / 4, "h").concat(-Le, "z"),
            className: "recharts-legend-icon"
          });
        if (/* @__PURE__ */ E.isValidElement(n.legendIcon)) {
          var c = Gx({}, n);
          return delete c.legendIcon, /* @__PURE__ */ E.cloneElement(n.legendIcon, c);
        }
        return /* @__PURE__ */ E.createElement($l, {
          fill: s,
          cx: a,
          cy: a,
          size: Le,
          sizeType: "diameter",
          type: n.type
        });
      }
    )
    /**
     * Draw items of legend
     * @return {ReactElement} Items
     */
  }, {
    key: "renderItems",
    value: function() {
      var n = this, i = this.props, a = i.payload, o = i.iconSize, u = i.layout, s = i.formatter, c = i.inactiveColor, f = {
        x: 0,
        y: 0,
        width: Le,
        height: Le
      }, l = {
        display: u === "horizontal" ? "inline-block" : "block",
        marginRight: 10
      }, h = {
        display: "inline-block",
        verticalAlign: "middle",
        marginRight: 4
      };
      return a.map(function(d, g) {
        var v = d.formatter || s, p = ue(Ur(Ur({
          "recharts-legend-item": !0
        }, "legend-item-".concat(g), !0), "inactive", d.inactive));
        if (d.type === "none")
          return null;
        var m = J(d.value) ? null : d.value;
        qt(
          !J(d.value),
          `The name property is also required when using a function for the dataKey of a chart's cartesian components. Ex: <Bar name="Name of my Data"/>`
          // eslint-disable-line max-len
        );
        var w = d.inactive ? c : d.color;
        return /* @__PURE__ */ E.createElement("li", bc({
          className: p,
          style: l,
          key: "legend-item-".concat(g)
        }, sc(n.props, d, g)), /* @__PURE__ */ E.createElement(hc, {
          width: o,
          height: o,
          viewBox: f,
          style: h
        }, n.renderIcon(d)), /* @__PURE__ */ E.createElement("span", {
          className: "recharts-legend-item-text",
          style: {
            color: w
          }
        }, v ? v(m, d, g) : m));
      });
    }
  }, {
    key: "render",
    value: function() {
      var n = this.props, i = n.payload, a = n.layout, o = n.align;
      if (!i || !i.length)
        return null;
      var u = {
        padding: 0,
        margin: 0,
        textAlign: a === "horizontal" ? o : "left"
      };
      return /* @__PURE__ */ E.createElement("ul", {
        className: "recharts-default-legend",
        style: u
      }, this.renderItems());
    }
  }]);
})(Wt);
Ur(Rl, "displayName", "Legend");
Ur(Rl, "defaultProps", {
  iconSize: 14,
  layout: "horizontal",
  align: "center",
  verticalAlign: "middle",
  inactiveColor: "#ccc"
});
var To, Xh;
function t1() {
  if (Xh) return To;
  Xh = 1;
  var e = $i();
  function t() {
    this.__data__ = new e(), this.size = 0;
  }
  return To = t, To;
}
var Eo, Vh;
function r1() {
  if (Vh) return Eo;
  Vh = 1;
  function e(t) {
    var r = this.__data__, n = r.delete(t);
    return this.size = r.size, n;
  }
  return Eo = e, Eo;
}
var jo, Yh;
function n1() {
  if (Yh) return jo;
  Yh = 1;
  function e(t) {
    return this.__data__.get(t);
  }
  return jo = e, jo;
}
var Mo, Zh;
function i1() {
  if (Zh) return Mo;
  Zh = 1;
  function e(t) {
    return this.__data__.has(t);
  }
  return Mo = e, Mo;
}
var Co, Jh;
function a1() {
  if (Jh) return Co;
  Jh = 1;
  var e = $i(), t = Sl(), r = Al(), n = 200;
  function i(a, o) {
    var u = this.__data__;
    if (u instanceof e) {
      var s = u.__data__;
      if (!t || s.length < n - 1)
        return s.push([a, o]), this.size = ++u.size, this;
      u = this.__data__ = new r(s);
    }
    return u.set(a, o), this.size = u.size, this;
  }
  return Co = i, Co;
}
var Io, Qh;
function dm() {
  if (Qh) return Io;
  Qh = 1;
  var e = $i(), t = t1(), r = r1(), n = n1(), i = i1(), a = a1();
  function o(u) {
    var s = this.__data__ = new e(u);
    this.size = s.size;
  }
  return o.prototype.clear = t, o.prototype.delete = r, o.prototype.get = n, o.prototype.has = i, o.prototype.set = a, Io = o, Io;
}
var $o, ep;
function o1() {
  if (ep) return $o;
  ep = 1;
  var e = "__lodash_hash_undefined__";
  function t(r) {
    return this.__data__.set(r, e), this;
  }
  return $o = t, $o;
}
var Ro, tp;
function u1() {
  if (tp) return Ro;
  tp = 1;
  function e(t) {
    return this.__data__.has(t);
  }
  return Ro = e, Ro;
}
var Do, rp;
function vm() {
  if (rp) return Do;
  rp = 1;
  var e = Al(), t = o1(), r = u1();
  function n(i) {
    var a = -1, o = i == null ? 0 : i.length;
    for (this.__data__ = new e(); ++a < o; )
      this.add(i[a]);
  }
  return n.prototype.add = n.prototype.push = t, n.prototype.has = r, Do = n, Do;
}
var No, np;
function ym() {
  if (np) return No;
  np = 1;
  function e(t, r) {
    for (var n = -1, i = t == null ? 0 : t.length; ++n < i; )
      if (r(t[n], n, t))
        return !0;
    return !1;
  }
  return No = e, No;
}
var qo, ip;
function gm() {
  if (ip) return qo;
  ip = 1;
  function e(t, r) {
    return t.has(r);
  }
  return qo = e, qo;
}
var ko, ap;
function mm() {
  if (ap) return ko;
  ap = 1;
  var e = vm(), t = ym(), r = gm(), n = 1, i = 2;
  function a(o, u, s, c, f, l) {
    var h = s & n, d = o.length, g = u.length;
    if (d != g && !(h && g > d))
      return !1;
    var v = l.get(o), p = l.get(u);
    if (v && p)
      return v == u && p == o;
    var m = -1, w = !0, x = s & i ? new e() : void 0;
    for (l.set(o, u), l.set(u, o); ++m < d; ) {
      var _ = o[m], y = u[m];
      if (c)
        var b = h ? c(y, _, m, u, o, l) : c(_, y, m, o, u, l);
      if (b !== void 0) {
        if (b)
          continue;
        w = !1;
        break;
      }
      if (x) {
        if (!t(u, function(O, S) {
          if (!r(x, S) && (_ === O || f(_, O, s, c, l)))
            return x.push(S);
        })) {
          w = !1;
          break;
        }
      } else if (!(_ === y || f(_, y, s, c, l))) {
        w = !1;
        break;
      }
    }
    return l.delete(o), l.delete(u), w;
  }
  return ko = a, ko;
}
var Lo, op;
function s1() {
  if (op) return Lo;
  op = 1;
  var e = nt(), t = e.Uint8Array;
  return Lo = t, Lo;
}
var Bo, up;
function c1() {
  if (up) return Bo;
  up = 1;
  function e(t) {
    var r = -1, n = Array(t.size);
    return t.forEach(function(i, a) {
      n[++r] = [a, i];
    }), n;
  }
  return Bo = e, Bo;
}
var Fo, sp;
function Dl() {
  if (sp) return Fo;
  sp = 1;
  function e(t) {
    var r = -1, n = Array(t.size);
    return t.forEach(function(i) {
      n[++r] = i;
    }), n;
  }
  return Fo = e, Fo;
}
var Uo, cp;
function l1() {
  if (cp) return Uo;
  cp = 1;
  var e = wn(), t = s1(), r = Ol(), n = mm(), i = c1(), a = Dl(), o = 1, u = 2, s = "[object Boolean]", c = "[object Date]", f = "[object Error]", l = "[object Map]", h = "[object Number]", d = "[object RegExp]", g = "[object Set]", v = "[object String]", p = "[object Symbol]", m = "[object ArrayBuffer]", w = "[object DataView]", x = e ? e.prototype : void 0, _ = x ? x.valueOf : void 0;
  function y(b, O, S, A, C, T, P) {
    switch (S) {
      case w:
        if (b.byteLength != O.byteLength || b.byteOffset != O.byteOffset)
          return !1;
        b = b.buffer, O = O.buffer;
      case m:
        return !(b.byteLength != O.byteLength || !T(new t(b), new t(O)));
      case s:
      case c:
      case h:
        return r(+b, +O);
      case f:
        return b.name == O.name && b.message == O.message;
      case d:
      case v:
        return b == O + "";
      case l:
        var j = i;
      case g:
        var I = A & o;
        if (j || (j = a), b.size != O.size && !I)
          return !1;
        var M = P.get(b);
        if (M)
          return M == O;
        A |= u, P.set(b, O);
        var R = n(j(b), j(O), A, C, T, P);
        return P.delete(b), R;
      case p:
        if (_)
          return _.call(b) == _.call(O);
    }
    return !1;
  }
  return Uo = y, Uo;
}
var Wo, lp;
function bm() {
  if (lp) return Wo;
  lp = 1;
  function e(t, r) {
    for (var n = -1, i = r.length, a = t.length; ++n < i; )
      t[a + n] = r[n];
    return t;
  }
  return Wo = e, Wo;
}
var zo, fp;
function f1() {
  if (fp) return zo;
  fp = 1;
  var e = bm(), t = Ie();
  function r(n, i, a) {
    var o = i(n);
    return t(n) ? o : e(o, a(n));
  }
  return zo = r, zo;
}
var Ho, hp;
function h1() {
  if (hp) return Ho;
  hp = 1;
  function e(t, r) {
    for (var n = -1, i = t == null ? 0 : t.length, a = 0, o = []; ++n < i; ) {
      var u = t[n];
      r(u, n, t) && (o[a++] = u);
    }
    return o;
  }
  return Ho = e, Ho;
}
var Go, pp;
function p1() {
  if (pp) return Go;
  pp = 1;
  function e() {
    return [];
  }
  return Go = e, Go;
}
var Ko, dp;
function d1() {
  if (dp) return Ko;
  dp = 1;
  var e = h1(), t = p1(), r = Object.prototype, n = r.propertyIsEnumerable, i = Object.getOwnPropertySymbols, a = i ? function(o) {
    return o == null ? [] : (o = Object(o), e(i(o), function(u) {
      return n.call(o, u);
    }));
  } : t;
  return Ko = a, Ko;
}
var Xo, vp;
function v1() {
  if (vp) return Xo;
  vp = 1;
  function e(t, r) {
    for (var n = -1, i = Array(t); ++n < t; )
      i[n] = r(n);
    return i;
  }
  return Xo = e, Xo;
}
var Vo, yp;
function y1() {
  if (yp) return Vo;
  yp = 1;
  var e = pt(), t = dt(), r = "[object Arguments]";
  function n(i) {
    return t(i) && e(i) == r;
  }
  return Vo = n, Vo;
}
var Yo, gp;
function Nl() {
  if (gp) return Yo;
  gp = 1;
  var e = y1(), t = dt(), r = Object.prototype, n = r.hasOwnProperty, i = r.propertyIsEnumerable, a = e(/* @__PURE__ */ (function() {
    return arguments;
  })()) ? e : function(o) {
    return t(o) && n.call(o, "callee") && !i.call(o, "callee");
  };
  return Yo = a, Yo;
}
var Rr = { exports: {} }, Zo, mp;
function g1() {
  if (mp) return Zo;
  mp = 1;
  function e() {
    return !1;
  }
  return Zo = e, Zo;
}
Rr.exports;
var bp;
function wm() {
  return bp || (bp = 1, (function(e, t) {
    var r = nt(), n = g1(), i = t && !t.nodeType && t, a = i && !0 && e && !e.nodeType && e, o = a && a.exports === i, u = o ? r.Buffer : void 0, s = u ? u.isBuffer : void 0, c = s || n;
    e.exports = c;
  })(Rr, Rr.exports)), Rr.exports;
}
var Jo, wp;
function ql() {
  if (wp) return Jo;
  wp = 1;
  var e = 9007199254740991, t = /^(?:0|[1-9]\d*)$/;
  function r(n, i) {
    var a = typeof n;
    return i = i ?? e, !!i && (a == "number" || a != "symbol" && t.test(n)) && n > -1 && n % 1 == 0 && n < i;
  }
  return Jo = r, Jo;
}
var Qo, xp;
function kl() {
  if (xp) return Qo;
  xp = 1;
  var e = 9007199254740991;
  function t(r) {
    return typeof r == "number" && r > -1 && r % 1 == 0 && r <= e;
  }
  return Qo = t, Qo;
}
var eu, _p;
function m1() {
  if (_p) return eu;
  _p = 1;
  var e = pt(), t = kl(), r = dt(), n = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", o = "[object Date]", u = "[object Error]", s = "[object Function]", c = "[object Map]", f = "[object Number]", l = "[object Object]", h = "[object RegExp]", d = "[object Set]", g = "[object String]", v = "[object WeakMap]", p = "[object ArrayBuffer]", m = "[object DataView]", w = "[object Float32Array]", x = "[object Float64Array]", _ = "[object Int8Array]", y = "[object Int16Array]", b = "[object Int32Array]", O = "[object Uint8Array]", S = "[object Uint8ClampedArray]", A = "[object Uint16Array]", C = "[object Uint32Array]", T = {};
  T[w] = T[x] = T[_] = T[y] = T[b] = T[O] = T[S] = T[A] = T[C] = !0, T[n] = T[i] = T[p] = T[a] = T[m] = T[o] = T[u] = T[s] = T[c] = T[f] = T[l] = T[h] = T[d] = T[g] = T[v] = !1;
  function P(j) {
    return r(j) && t(j.length) && !!T[e(j)];
  }
  return eu = P, eu;
}
var tu, Op;
function xm() {
  if (Op) return tu;
  Op = 1;
  function e(t) {
    return function(r) {
      return t(r);
    };
  }
  return tu = e, tu;
}
var Dr = { exports: {} };
Dr.exports;
var Sp;
function b1() {
  return Sp || (Sp = 1, (function(e, t) {
    var r = Fg(), n = t && !t.nodeType && t, i = n && !0 && e && !e.nodeType && e, a = i && i.exports === n, o = a && r.process, u = (function() {
      try {
        var s = i && i.require && i.require("util").types;
        return s || o && o.binding && o.binding("util");
      } catch {
      }
    })();
    e.exports = u;
  })(Dr, Dr.exports)), Dr.exports;
}
var ru, Ap;
function _m() {
  if (Ap) return ru;
  Ap = 1;
  var e = m1(), t = xm(), r = b1(), n = r && r.isTypedArray, i = n ? t(n) : e;
  return ru = i, ru;
}
var nu, Pp;
function w1() {
  if (Pp) return nu;
  Pp = 1;
  var e = v1(), t = Nl(), r = Ie(), n = wm(), i = ql(), a = _m(), o = Object.prototype, u = o.hasOwnProperty;
  function s(c, f) {
    var l = r(c), h = !l && t(c), d = !l && !h && n(c), g = !l && !h && !d && a(c), v = l || h || d || g, p = v ? e(c.length, String) : [], m = p.length;
    for (var w in c)
      (f || u.call(c, w)) && !(v && // Safari 9 has enumerable `arguments.length` in strict mode.
      (w == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      d && (w == "offset" || w == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      g && (w == "buffer" || w == "byteLength" || w == "byteOffset") || // Skip index properties.
      i(w, m))) && p.push(w);
    return p;
  }
  return nu = s, nu;
}
var iu, Tp;
function x1() {
  if (Tp) return iu;
  Tp = 1;
  var e = Object.prototype;
  function t(r) {
    var n = r && r.constructor, i = typeof n == "function" && n.prototype || e;
    return r === i;
  }
  return iu = t, iu;
}
var au, Ep;
function Om() {
  if (Ep) return au;
  Ep = 1;
  function e(t, r) {
    return function(n) {
      return t(r(n));
    };
  }
  return au = e, au;
}
var ou, jp;
function _1() {
  if (jp) return ou;
  jp = 1;
  var e = Om(), t = e(Object.keys, Object);
  return ou = t, ou;
}
var uu, Mp;
function O1() {
  if (Mp) return uu;
  Mp = 1;
  var e = x1(), t = _1(), r = Object.prototype, n = r.hasOwnProperty;
  function i(a) {
    if (!e(a))
      return t(a);
    var o = [];
    for (var u in Object(a))
      n.call(a, u) && u != "constructor" && o.push(u);
    return o;
  }
  return uu = i, uu;
}
var su, Cp;
function _n() {
  if (Cp) return su;
  Cp = 1;
  var e = _l(), t = kl();
  function r(n) {
    return n != null && t(n.length) && !e(n);
  }
  return su = r, su;
}
var cu, Ip;
function Fi() {
  if (Ip) return cu;
  Ip = 1;
  var e = w1(), t = O1(), r = _n();
  function n(i) {
    return r(i) ? e(i) : t(i);
  }
  return cu = n, cu;
}
var lu, $p;
function S1() {
  if ($p) return lu;
  $p = 1;
  var e = f1(), t = d1(), r = Fi();
  function n(i) {
    return e(i, r, t);
  }
  return lu = n, lu;
}
var fu, Rp;
function A1() {
  if (Rp) return fu;
  Rp = 1;
  var e = S1(), t = 1, r = Object.prototype, n = r.hasOwnProperty;
  function i(a, o, u, s, c, f) {
    var l = u & t, h = e(a), d = h.length, g = e(o), v = g.length;
    if (d != v && !l)
      return !1;
    for (var p = d; p--; ) {
      var m = h[p];
      if (!(l ? m in o : n.call(o, m)))
        return !1;
    }
    var w = f.get(a), x = f.get(o);
    if (w && x)
      return w == o && x == a;
    var _ = !0;
    f.set(a, o), f.set(o, a);
    for (var y = l; ++p < d; ) {
      m = h[p];
      var b = a[m], O = o[m];
      if (s)
        var S = l ? s(O, b, m, o, a, f) : s(b, O, m, a, o, f);
      if (!(S === void 0 ? b === O || c(b, O, u, s, f) : S)) {
        _ = !1;
        break;
      }
      y || (y = m == "constructor");
    }
    if (_ && !y) {
      var A = a.constructor, C = o.constructor;
      A != C && "constructor" in a && "constructor" in o && !(typeof A == "function" && A instanceof A && typeof C == "function" && C instanceof C) && (_ = !1);
    }
    return f.delete(a), f.delete(o), _;
  }
  return fu = i, fu;
}
var hu, Dp;
function P1() {
  if (Dp) return hu;
  Dp = 1;
  var e = zt(), t = nt(), r = e(t, "DataView");
  return hu = r, hu;
}
var pu, Np;
function T1() {
  if (Np) return pu;
  Np = 1;
  var e = zt(), t = nt(), r = e(t, "Promise");
  return pu = r, pu;
}
var du, qp;
function Sm() {
  if (qp) return du;
  qp = 1;
  var e = zt(), t = nt(), r = e(t, "Set");
  return du = r, du;
}
var vu, kp;
function E1() {
  if (kp) return vu;
  kp = 1;
  var e = zt(), t = nt(), r = e(t, "WeakMap");
  return vu = r, vu;
}
var yu, Lp;
function j1() {
  if (Lp) return yu;
  Lp = 1;
  var e = P1(), t = Sl(), r = T1(), n = Sm(), i = E1(), a = pt(), o = Ug(), u = "[object Map]", s = "[object Object]", c = "[object Promise]", f = "[object Set]", l = "[object WeakMap]", h = "[object DataView]", d = o(e), g = o(t), v = o(r), p = o(n), m = o(i), w = a;
  return (e && w(new e(new ArrayBuffer(1))) != h || t && w(new t()) != u || r && w(r.resolve()) != c || n && w(new n()) != f || i && w(new i()) != l) && (w = function(x) {
    var _ = a(x), y = _ == s ? x.constructor : void 0, b = y ? o(y) : "";
    if (b)
      switch (b) {
        case d:
          return h;
        case g:
          return u;
        case v:
          return c;
        case p:
          return f;
        case m:
          return l;
      }
    return _;
  }), yu = w, yu;
}
var gu, Bp;
function M1() {
  if (Bp) return gu;
  Bp = 1;
  var e = dm(), t = mm(), r = l1(), n = A1(), i = j1(), a = Ie(), o = wm(), u = _m(), s = 1, c = "[object Arguments]", f = "[object Array]", l = "[object Object]", h = Object.prototype, d = h.hasOwnProperty;
  function g(v, p, m, w, x, _) {
    var y = a(v), b = a(p), O = y ? f : i(v), S = b ? f : i(p);
    O = O == c ? l : O, S = S == c ? l : S;
    var A = O == l, C = S == l, T = O == S;
    if (T && o(v)) {
      if (!o(p))
        return !1;
      y = !0, A = !1;
    }
    if (T && !A)
      return _ || (_ = new e()), y || u(v) ? t(v, p, m, w, x, _) : r(v, p, O, m, w, x, _);
    if (!(m & s)) {
      var P = A && d.call(v, "__wrapped__"), j = C && d.call(p, "__wrapped__");
      if (P || j) {
        var I = P ? v.value() : v, M = j ? p.value() : p;
        return _ || (_ = new e()), x(I, M, m, w, _);
      }
    }
    return T ? (_ || (_ = new e()), n(v, p, m, w, x, _)) : !1;
  }
  return gu = g, gu;
}
var mu, Fp;
function Ll() {
  if (Fp) return mu;
  Fp = 1;
  var e = M1(), t = dt();
  function r(n, i, a, o, u) {
    return n === i ? !0 : n == null || i == null || !t(n) && !t(i) ? n !== n && i !== i : e(n, i, a, o, r, u);
  }
  return mu = r, mu;
}
var bu, Up;
function C1() {
  if (Up) return bu;
  Up = 1;
  var e = dm(), t = Ll(), r = 1, n = 2;
  function i(a, o, u, s) {
    var c = u.length, f = c, l = !s;
    if (a == null)
      return !f;
    for (a = Object(a); c--; ) {
      var h = u[c];
      if (l && h[2] ? h[1] !== a[h[0]] : !(h[0] in a))
        return !1;
    }
    for (; ++c < f; ) {
      h = u[c];
      var d = h[0], g = a[d], v = h[1];
      if (l && h[2]) {
        if (g === void 0 && !(d in a))
          return !1;
      } else {
        var p = new e();
        if (s)
          var m = s(g, v, d, a, o, p);
        if (!(m === void 0 ? t(v, g, r | n, s, p) : m))
          return !1;
      }
    }
    return !0;
  }
  return bu = i, bu;
}
var wu, Wp;
function Am() {
  if (Wp) return wu;
  Wp = 1;
  var e = Ot();
  function t(r) {
    return r === r && !e(r);
  }
  return wu = t, wu;
}
var xu, zp;
function I1() {
  if (zp) return xu;
  zp = 1;
  var e = Am(), t = Fi();
  function r(n) {
    for (var i = t(n), a = i.length; a--; ) {
      var o = i[a], u = n[o];
      i[a] = [o, u, e(u)];
    }
    return i;
  }
  return xu = r, xu;
}
var _u, Hp;
function Pm() {
  if (Hp) return _u;
  Hp = 1;
  function e(t, r) {
    return function(n) {
      return n == null ? !1 : n[t] === r && (r !== void 0 || t in Object(n));
    };
  }
  return _u = e, _u;
}
var Ou, Gp;
function $1() {
  if (Gp) return Ou;
  Gp = 1;
  var e = C1(), t = I1(), r = Pm();
  function n(i) {
    var a = t(i);
    return a.length == 1 && a[0][2] ? r(a[0][0], a[0][1]) : function(o) {
      return o === i || e(o, i, a);
    };
  }
  return Ou = n, Ou;
}
var Su, Kp;
function R1() {
  if (Kp) return Su;
  Kp = 1;
  function e(t, r) {
    return t != null && r in Object(t);
  }
  return Su = e, Su;
}
var Au, Xp;
function D1() {
  if (Xp) return Au;
  Xp = 1;
  var e = Hg(), t = Nl(), r = Ie(), n = ql(), i = kl(), a = Di();
  function o(u, s, c) {
    s = e(s, u);
    for (var f = -1, l = s.length, h = !1; ++f < l; ) {
      var d = a(s[f]);
      if (!(h = u != null && c(u, d)))
        break;
      u = u[d];
    }
    return h || ++f != l ? h : (l = u == null ? 0 : u.length, !!l && i(l) && n(d, l) && (r(u) || t(u)));
  }
  return Au = o, Au;
}
var Pu, Vp;
function N1() {
  if (Vp) return Pu;
  Vp = 1;
  var e = R1(), t = D1();
  function r(n, i) {
    return n != null && t(n, i, e);
  }
  return Pu = r, Pu;
}
var Tu, Yp;
function q1() {
  if (Yp) return Tu;
  Yp = 1;
  var e = Ll(), t = Gg(), r = N1(), n = xl(), i = Am(), a = Pm(), o = Di(), u = 1, s = 2;
  function c(f, l) {
    return n(f) && i(l) ? a(o(f), l) : function(h) {
      var d = t(h, f);
      return d === void 0 && d === l ? r(h, f) : e(l, d, u | s);
    };
  }
  return Tu = c, Tu;
}
var Eu, Zp;
function _r() {
  if (Zp) return Eu;
  Zp = 1;
  function e(t) {
    return t;
  }
  return Eu = e, Eu;
}
var ju, Jp;
function k1() {
  if (Jp) return ju;
  Jp = 1;
  function e(t) {
    return function(r) {
      return r?.[t];
    };
  }
  return ju = e, ju;
}
var Mu, Qp;
function L1() {
  if (Qp) return Mu;
  Qp = 1;
  var e = Tl();
  function t(r) {
    return function(n) {
      return e(n, r);
    };
  }
  return Mu = t, Mu;
}
var Cu, ed;
function B1() {
  if (ed) return Cu;
  ed = 1;
  var e = k1(), t = L1(), r = xl(), n = Di();
  function i(a) {
    return r(a) ? e(n(a)) : t(a);
  }
  return Cu = i, Cu;
}
var Iu, td;
function St() {
  if (td) return Iu;
  td = 1;
  var e = $1(), t = q1(), r = _r(), n = Ie(), i = B1();
  function a(o) {
    return typeof o == "function" ? o : o == null ? r : typeof o == "object" ? n(o) ? t(o[0], o[1]) : e(o) : i(o);
  }
  return Iu = a, Iu;
}
var $u, rd;
function Tm() {
  if (rd) return $u;
  rd = 1;
  function e(t, r, n, i) {
    for (var a = t.length, o = n + (i ? 1 : -1); i ? o-- : ++o < a; )
      if (r(t[o], o, t))
        return o;
    return -1;
  }
  return $u = e, $u;
}
var Ru, nd;
function F1() {
  if (nd) return Ru;
  nd = 1;
  function e(t) {
    return t !== t;
  }
  return Ru = e, Ru;
}
var Du, id;
function U1() {
  if (id) return Du;
  id = 1;
  function e(t, r, n) {
    for (var i = n - 1, a = t.length; ++i < a; )
      if (t[i] === r)
        return i;
    return -1;
  }
  return Du = e, Du;
}
var Nu, ad;
function W1() {
  if (ad) return Nu;
  ad = 1;
  var e = Tm(), t = F1(), r = U1();
  function n(i, a, o) {
    return a === a ? r(i, a, o) : e(i, t, o);
  }
  return Nu = n, Nu;
}
var qu, od;
function z1() {
  if (od) return qu;
  od = 1;
  var e = W1();
  function t(r, n) {
    var i = r == null ? 0 : r.length;
    return !!i && e(r, n, 0) > -1;
  }
  return qu = t, qu;
}
var ku, ud;
function H1() {
  if (ud) return ku;
  ud = 1;
  function e(t, r, n) {
    for (var i = -1, a = t == null ? 0 : t.length; ++i < a; )
      if (n(r, t[i]))
        return !0;
    return !1;
  }
  return ku = e, ku;
}
var Lu, sd;
function G1() {
  if (sd) return Lu;
  sd = 1;
  function e() {
  }
  return Lu = e, Lu;
}
var Bu, cd;
function K1() {
  if (cd) return Bu;
  cd = 1;
  var e = Sm(), t = G1(), r = Dl(), n = 1 / 0, i = e && 1 / r(new e([, -0]))[1] == n ? function(a) {
    return new e(a);
  } : t;
  return Bu = i, Bu;
}
var Fu, ld;
function X1() {
  if (ld) return Fu;
  ld = 1;
  var e = vm(), t = z1(), r = H1(), n = gm(), i = K1(), a = Dl(), o = 200;
  function u(s, c, f) {
    var l = -1, h = t, d = s.length, g = !0, v = [], p = v;
    if (f)
      g = !1, h = r;
    else if (d >= o) {
      var m = c ? null : i(s);
      if (m)
        return a(m);
      g = !1, h = n, p = new e();
    } else
      p = c ? [] : v;
    e:
      for (; ++l < d; ) {
        var w = s[l], x = c ? c(w) : w;
        if (w = f || w !== 0 ? w : 0, g && x === x) {
          for (var _ = p.length; _--; )
            if (p[_] === x)
              continue e;
          c && p.push(x), v.push(w);
        } else h(p, x, f) || (p !== v && p.push(x), v.push(w));
      }
    return v;
  }
  return Fu = u, Fu;
}
var Uu, fd;
function V1() {
  if (fd) return Uu;
  fd = 1;
  var e = St(), t = X1();
  function r(n, i) {
    return n && n.length ? t(n, e(i, 2)) : [];
  }
  return Uu = r, Uu;
}
var Y1 = V1();
const hd = /* @__PURE__ */ ce(Y1);
function Em(e, t, r) {
  return t === !0 ? hd(e, r) : J(t) ? hd(e, t) : e;
}
function ir(e) {
  "@babel/helpers - typeof";
  return ir = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ir(e);
}
var Z1 = ["ref"];
function pd(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function it(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? pd(Object(r), !0).forEach(function(n) {
      Ui(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : pd(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function J1(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function dd(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, Mm(n.key), n);
  }
}
function Q1(e, t, r) {
  return t && dd(e.prototype, t), r && dd(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function e_(e, t, r) {
  return t = Vn(t), t_(e, jm() ? Reflect.construct(t, r || [], Vn(e).constructor) : t.apply(e, r));
}
function t_(e, t) {
  if (t && (ir(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return r_(e);
}
function r_(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function jm() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (jm = function() {
    return !!e;
  })();
}
function Vn(e) {
  return Vn = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Vn(e);
}
function n_(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && xc(e, t);
}
function xc(e, t) {
  return xc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, i) {
    return n.__proto__ = i, n;
  }, xc(e, t);
}
function Ui(e, t, r) {
  return t = Mm(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Mm(e) {
  var t = i_(e, "string");
  return ir(t) == "symbol" ? t : t + "";
}
function i_(e, t) {
  if (ir(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ir(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function a_(e, t) {
  if (e == null) return {};
  var r = o_(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function o_(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function u_(e) {
  return e.value;
}
function s_(e, t) {
  if (/* @__PURE__ */ E.isValidElement(e))
    return /* @__PURE__ */ E.cloneElement(e, t);
  if (typeof e == "function")
    return /* @__PURE__ */ E.createElement(e, t);
  t.ref;
  var r = a_(t, Z1);
  return /* @__PURE__ */ E.createElement(Rl, r);
}
var vd = 1, er = /* @__PURE__ */ (function(e) {
  function t() {
    var r;
    J1(this, t);
    for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++)
      i[a] = arguments[a];
    return r = e_(this, t, [].concat(i)), Ui(r, "lastBoundingBox", {
      width: -1,
      height: -1
    }), r;
  }
  return n_(t, e), Q1(t, [{
    key: "componentDidMount",
    value: function() {
      this.updateBBox();
    }
  }, {
    key: "componentDidUpdate",
    value: function() {
      this.updateBBox();
    }
  }, {
    key: "getBBox",
    value: function() {
      if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
        var n = this.wrapperNode.getBoundingClientRect();
        return n.height = this.wrapperNode.offsetHeight, n.width = this.wrapperNode.offsetWidth, n;
      }
      return null;
    }
  }, {
    key: "updateBBox",
    value: function() {
      var n = this.props.onBBoxUpdate, i = this.getBBox();
      i ? (Math.abs(i.width - this.lastBoundingBox.width) > vd || Math.abs(i.height - this.lastBoundingBox.height) > vd) && (this.lastBoundingBox.width = i.width, this.lastBoundingBox.height = i.height, n && n(i)) : (this.lastBoundingBox.width !== -1 || this.lastBoundingBox.height !== -1) && (this.lastBoundingBox.width = -1, this.lastBoundingBox.height = -1, n && n(null));
    }
  }, {
    key: "getBBoxSnapshot",
    value: function() {
      return this.lastBoundingBox.width >= 0 && this.lastBoundingBox.height >= 0 ? it({}, this.lastBoundingBox) : {
        width: 0,
        height: 0
      };
    }
  }, {
    key: "getDefaultPosition",
    value: function(n) {
      var i = this.props, a = i.layout, o = i.align, u = i.verticalAlign, s = i.margin, c = i.chartWidth, f = i.chartHeight, l, h;
      if (!n || (n.left === void 0 || n.left === null) && (n.right === void 0 || n.right === null))
        if (o === "center" && a === "vertical") {
          var d = this.getBBoxSnapshot();
          l = {
            left: ((c || 0) - d.width) / 2
          };
        } else
          l = o === "right" ? {
            right: s && s.right || 0
          } : {
            left: s && s.left || 0
          };
      if (!n || (n.top === void 0 || n.top === null) && (n.bottom === void 0 || n.bottom === null))
        if (u === "middle") {
          var g = this.getBBoxSnapshot();
          h = {
            top: ((f || 0) - g.height) / 2
          };
        } else
          h = u === "bottom" ? {
            bottom: s && s.bottom || 0
          } : {
            top: s && s.top || 0
          };
      return it(it({}, l), h);
    }
  }, {
    key: "render",
    value: function() {
      var n = this, i = this.props, a = i.content, o = i.width, u = i.height, s = i.wrapperStyle, c = i.payloadUniqBy, f = i.payload, l = it(it({
        position: "absolute",
        width: o || "auto",
        height: u || "auto"
      }, this.getDefaultPosition(s)), s);
      return /* @__PURE__ */ E.createElement("div", {
        className: "recharts-legend-wrapper",
        style: l,
        ref: function(d) {
          n.wrapperNode = d;
        }
      }, s_(a, it(it({}, this.props), {}, {
        payload: Em(f, c, u_)
      })));
    }
  }], [{
    key: "getWithHeight",
    value: function(n, i) {
      var a = it(it({}, this.defaultProps), n.props), o = a.layout;
      return o === "vertical" && B(n.props.height) ? {
        height: n.props.height
      } : o === "horizontal" ? {
        width: n.props.width || i
      } : null;
    }
  }]);
})(Wt);
Ui(er, "displayName", "Legend");
Ui(er, "defaultProps", {
  iconSize: 14,
  layout: "horizontal",
  align: "center",
  verticalAlign: "bottom"
});
var Wu, yd;
function c_() {
  if (yd) return Wu;
  yd = 1;
  var e = wn(), t = Nl(), r = Ie(), n = e ? e.isConcatSpreadable : void 0;
  function i(a) {
    return r(a) || t(a) || !!(n && a && a[n]);
  }
  return Wu = i, Wu;
}
var zu, gd;
function Cm() {
  if (gd) return zu;
  gd = 1;
  var e = bm(), t = c_();
  function r(n, i, a, o, u) {
    var s = -1, c = n.length;
    for (a || (a = t), u || (u = []); ++s < c; ) {
      var f = n[s];
      i > 0 && a(f) ? i > 1 ? r(f, i - 1, a, o, u) : e(u, f) : o || (u[u.length] = f);
    }
    return u;
  }
  return zu = r, zu;
}
var Hu, md;
function l_() {
  if (md) return Hu;
  md = 1;
  function e(t) {
    return function(r, n, i) {
      for (var a = -1, o = Object(r), u = i(r), s = u.length; s--; ) {
        var c = u[t ? s : ++a];
        if (n(o[c], c, o) === !1)
          break;
      }
      return r;
    };
  }
  return Hu = e, Hu;
}
var Gu, bd;
function f_() {
  if (bd) return Gu;
  bd = 1;
  var e = l_(), t = e();
  return Gu = t, Gu;
}
var Ku, wd;
function Im() {
  if (wd) return Ku;
  wd = 1;
  var e = f_(), t = Fi();
  function r(n, i) {
    return n && e(n, i, t);
  }
  return Ku = r, Ku;
}
var Xu, xd;
function h_() {
  if (xd) return Xu;
  xd = 1;
  var e = _n();
  function t(r, n) {
    return function(i, a) {
      if (i == null)
        return i;
      if (!e(i))
        return r(i, a);
      for (var o = i.length, u = n ? o : -1, s = Object(i); (n ? u-- : ++u < o) && a(s[u], u, s) !== !1; )
        ;
      return i;
    };
  }
  return Xu = t, Xu;
}
var Vu, _d;
function Bl() {
  if (_d) return Vu;
  _d = 1;
  var e = Im(), t = h_(), r = t(e);
  return Vu = r, Vu;
}
var Yu, Od;
function $m() {
  if (Od) return Yu;
  Od = 1;
  var e = Bl(), t = _n();
  function r(n, i) {
    var a = -1, o = t(n) ? Array(n.length) : [];
    return e(n, function(u, s, c) {
      o[++a] = i(u, s, c);
    }), o;
  }
  return Yu = r, Yu;
}
var Zu, Sd;
function p_() {
  if (Sd) return Zu;
  Sd = 1;
  function e(t, r) {
    var n = t.length;
    for (t.sort(r); n--; )
      t[n] = t[n].value;
    return t;
  }
  return Zu = e, Zu;
}
var Ju, Ad;
function d_() {
  if (Ad) return Ju;
  Ad = 1;
  var e = wr();
  function t(r, n) {
    if (r !== n) {
      var i = r !== void 0, a = r === null, o = r === r, u = e(r), s = n !== void 0, c = n === null, f = n === n, l = e(n);
      if (!c && !l && !u && r > n || u && s && f && !c && !l || a && s && f || !i && f || !o)
        return 1;
      if (!a && !u && !l && r < n || l && i && o && !a && !u || c && i && o || !s && o || !f)
        return -1;
    }
    return 0;
  }
  return Ju = t, Ju;
}
var Qu, Pd;
function v_() {
  if (Pd) return Qu;
  Pd = 1;
  var e = d_();
  function t(r, n, i) {
    for (var a = -1, o = r.criteria, u = n.criteria, s = o.length, c = i.length; ++a < s; ) {
      var f = e(o[a], u[a]);
      if (f) {
        if (a >= c)
          return f;
        var l = i[a];
        return f * (l == "desc" ? -1 : 1);
      }
    }
    return r.index - n.index;
  }
  return Qu = t, Qu;
}
var es, Td;
function y_() {
  if (Td) return es;
  Td = 1;
  var e = Pl(), t = Tl(), r = St(), n = $m(), i = p_(), a = xm(), o = v_(), u = _r(), s = Ie();
  function c(f, l, h) {
    l.length ? l = e(l, function(v) {
      return s(v) ? function(p) {
        return t(p, v.length === 1 ? v[0] : v);
      } : v;
    }) : l = [u];
    var d = -1;
    l = e(l, a(r));
    var g = n(f, function(v, p, m) {
      var w = e(l, function(x) {
        return x(v);
      });
      return { criteria: w, index: ++d, value: v };
    });
    return i(g, function(v, p) {
      return o(v, p, h);
    });
  }
  return es = c, es;
}
var ts, Ed;
function g_() {
  if (Ed) return ts;
  Ed = 1;
  function e(t, r, n) {
    switch (n.length) {
      case 0:
        return t.call(r);
      case 1:
        return t.call(r, n[0]);
      case 2:
        return t.call(r, n[0], n[1]);
      case 3:
        return t.call(r, n[0], n[1], n[2]);
    }
    return t.apply(r, n);
  }
  return ts = e, ts;
}
var rs, jd;
function m_() {
  if (jd) return rs;
  jd = 1;
  var e = g_(), t = Math.max;
  function r(n, i, a) {
    return i = t(i === void 0 ? n.length - 1 : i, 0), function() {
      for (var o = arguments, u = -1, s = t(o.length - i, 0), c = Array(s); ++u < s; )
        c[u] = o[i + u];
      u = -1;
      for (var f = Array(i + 1); ++u < i; )
        f[u] = o[u];
      return f[i] = a(c), e(n, this, f);
    };
  }
  return rs = r, rs;
}
var ns, Md;
function b_() {
  if (Md) return ns;
  Md = 1;
  function e(t) {
    return function() {
      return t;
    };
  }
  return ns = e, ns;
}
var is, Cd;
function Rm() {
  if (Cd) return is;
  Cd = 1;
  var e = zt(), t = (function() {
    try {
      var r = e(Object, "defineProperty");
      return r({}, "", {}), r;
    } catch {
    }
  })();
  return is = t, is;
}
var as, Id;
function w_() {
  if (Id) return as;
  Id = 1;
  var e = b_(), t = Rm(), r = _r(), n = t ? function(i, a) {
    return t(i, "toString", {
      configurable: !0,
      enumerable: !1,
      value: e(a),
      writable: !0
    });
  } : r;
  return as = n, as;
}
var os, $d;
function x_() {
  if ($d) return os;
  $d = 1;
  var e = 800, t = 16, r = Date.now;
  function n(i) {
    var a = 0, o = 0;
    return function() {
      var u = r(), s = t - (u - o);
      if (o = u, s > 0) {
        if (++a >= e)
          return arguments[0];
      } else
        a = 0;
      return i.apply(void 0, arguments);
    };
  }
  return os = n, os;
}
var us, Rd;
function __() {
  if (Rd) return us;
  Rd = 1;
  var e = w_(), t = x_(), r = t(e);
  return us = r, us;
}
var ss, Dd;
function O_() {
  if (Dd) return ss;
  Dd = 1;
  var e = _r(), t = m_(), r = __();
  function n(i, a) {
    return r(t(i, a, e), i + "");
  }
  return ss = n, ss;
}
var cs, Nd;
function Wi() {
  if (Nd) return cs;
  Nd = 1;
  var e = Ol(), t = _n(), r = ql(), n = Ot();
  function i(a, o, u) {
    if (!n(u))
      return !1;
    var s = typeof o;
    return (s == "number" ? t(u) && r(o, u.length) : s == "string" && o in u) ? e(u[o], a) : !1;
  }
  return cs = i, cs;
}
var ls, qd;
function S_() {
  if (qd) return ls;
  qd = 1;
  var e = Cm(), t = y_(), r = O_(), n = Wi(), i = r(function(a, o) {
    if (a == null)
      return [];
    var u = o.length;
    return u > 1 && n(a, o[0], o[1]) ? o = [] : u > 2 && n(o[0], o[1], o[2]) && (o = [o[0]]), t(a, e(o, 1), []);
  });
  return ls = i, ls;
}
var A_ = S_();
const Fl = /* @__PURE__ */ ce(A_);
function Wr(e) {
  "@babel/helpers - typeof";
  return Wr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Wr(e);
}
function _c() {
  return _c = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, _c.apply(this, arguments);
}
function P_(e, t) {
  return M_(e) || j_(e, t) || E_(e, t) || T_();
}
function T_() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function E_(e, t) {
  if (e) {
    if (typeof e == "string") return kd(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return kd(e, t);
  }
}
function kd(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function j_(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], s = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(s = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); s = !0) ;
    } catch (f) {
      c = !0, i = f;
    } finally {
      try {
        if (!s && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function M_(e) {
  if (Array.isArray(e)) return e;
}
function Ld(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function fs(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ld(Object(r), !0).forEach(function(n) {
      C_(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ld(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function C_(e, t, r) {
  return t = I_(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function I_(e) {
  var t = $_(e, "string");
  return Wr(t) == "symbol" ? t : t + "";
}
function $_(e, t) {
  if (Wr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Wr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function R_(e) {
  return Array.isArray(e) && xe(e[0]) && xe(e[1]) ? e.join(" ~ ") : e;
}
var D_ = function(t) {
  var r = t.separator, n = r === void 0 ? " : " : r, i = t.contentStyle, a = i === void 0 ? {} : i, o = t.itemStyle, u = o === void 0 ? {} : o, s = t.labelStyle, c = s === void 0 ? {} : s, f = t.payload, l = t.formatter, h = t.itemSorter, d = t.wrapperClassName, g = t.labelClassName, v = t.label, p = t.labelFormatter, m = t.accessibilityLayer, w = m === void 0 ? !1 : m, x = function() {
    if (f && f.length) {
      var P = {
        padding: 0,
        margin: 0
      }, j = (h ? Fl(f, h) : f).map(function(I, M) {
        if (I.type === "none")
          return null;
        var R = fs({
          display: "block",
          paddingTop: 4,
          paddingBottom: 4,
          color: I.color || "#000"
        }, u), N = I.formatter || l || R_, q = I.value, k = I.name, W = q, H = k;
        if (N && W != null && H != null) {
          var F = N(q, k, I, M, f);
          if (Array.isArray(F)) {
            var G = P_(F, 2);
            W = G[0], H = G[1];
          } else
            W = F;
        }
        return (
          // eslint-disable-next-line react/no-array-index-key
          /* @__PURE__ */ E.createElement("li", {
            className: "recharts-tooltip-item",
            key: "tooltip-item-".concat(M),
            style: R
          }, xe(H) ? /* @__PURE__ */ E.createElement("span", {
            className: "recharts-tooltip-item-name"
          }, H) : null, xe(H) ? /* @__PURE__ */ E.createElement("span", {
            className: "recharts-tooltip-item-separator"
          }, n) : null, /* @__PURE__ */ E.createElement("span", {
            className: "recharts-tooltip-item-value"
          }, W), /* @__PURE__ */ E.createElement("span", {
            className: "recharts-tooltip-item-unit"
          }, I.unit || ""))
        );
      });
      return /* @__PURE__ */ E.createElement("ul", {
        className: "recharts-tooltip-item-list",
        style: P
      }, j);
    }
    return null;
  }, _ = fs({
    margin: 0,
    padding: 10,
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    whiteSpace: "nowrap"
  }, a), y = fs({
    margin: 0
  }, c), b = !V(v), O = b ? v : "", S = ue("recharts-default-tooltip", d), A = ue("recharts-tooltip-label", g);
  b && p && f !== void 0 && f !== null && (O = p(v, f));
  var C = w ? {
    role: "status",
    "aria-live": "assertive"
  } : {};
  return /* @__PURE__ */ E.createElement("div", _c({
    className: S,
    style: _
  }, C), /* @__PURE__ */ E.createElement("p", {
    className: A,
    style: y
  }, /* @__PURE__ */ E.isValidElement(O) ? O : "".concat(O)), x());
};
function zr(e) {
  "@babel/helpers - typeof";
  return zr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, zr(e);
}
function Mn(e, t, r) {
  return t = N_(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function N_(e) {
  var t = q_(e, "string");
  return zr(t) == "symbol" ? t : t + "";
}
function q_(e, t) {
  if (zr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (zr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ar = "recharts-tooltip-wrapper", k_ = {
  visibility: "hidden"
};
function L_(e) {
  var t = e.coordinate, r = e.translateX, n = e.translateY;
  return ue(Ar, Mn(Mn(Mn(Mn({}, "".concat(Ar, "-right"), B(r) && t && B(t.x) && r >= t.x), "".concat(Ar, "-left"), B(r) && t && B(t.x) && r < t.x), "".concat(Ar, "-bottom"), B(n) && t && B(t.y) && n >= t.y), "".concat(Ar, "-top"), B(n) && t && B(t.y) && n < t.y));
}
function Bd(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.key, i = e.offsetTopLeft, a = e.position, o = e.reverseDirection, u = e.tooltipDimension, s = e.viewBox, c = e.viewBoxDimension;
  if (a && B(a[n]))
    return a[n];
  var f = r[n] - u - i, l = r[n] + i;
  if (t[n])
    return o[n] ? f : l;
  if (o[n]) {
    var h = f, d = s[n];
    return h < d ? Math.max(l, s[n]) : Math.max(f, s[n]);
  }
  var g = l + u, v = s[n] + c;
  return g > v ? Math.max(f, s[n]) : Math.max(l, s[n]);
}
function B_(e) {
  var t = e.translateX, r = e.translateY, n = e.useTranslate3d;
  return {
    transform: n ? "translate3d(".concat(t, "px, ").concat(r, "px, 0)") : "translate(".concat(t, "px, ").concat(r, "px)")
  };
}
function F_(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.offsetTopLeft, i = e.position, a = e.reverseDirection, o = e.tooltipBox, u = e.useTranslate3d, s = e.viewBox, c, f, l;
  return o.height > 0 && o.width > 0 && r ? (f = Bd({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "x",
    offsetTopLeft: n,
    position: i,
    reverseDirection: a,
    tooltipDimension: o.width,
    viewBox: s,
    viewBoxDimension: s.width
  }), l = Bd({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "y",
    offsetTopLeft: n,
    position: i,
    reverseDirection: a,
    tooltipDimension: o.height,
    viewBox: s,
    viewBoxDimension: s.height
  }), c = B_({
    translateX: f,
    translateY: l,
    useTranslate3d: u
  })) : c = k_, {
    cssProperties: c,
    cssClasses: L_({
      translateX: f,
      translateY: l,
      coordinate: r
    })
  };
}
function ar(e) {
  "@babel/helpers - typeof";
  return ar = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ar(e);
}
function Fd(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ud(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Fd(Object(r), !0).forEach(function(n) {
      Sc(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Fd(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function U_(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function W_(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, Nm(n.key), n);
  }
}
function z_(e, t, r) {
  return t && W_(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function H_(e, t, r) {
  return t = Yn(t), G_(e, Dm() ? Reflect.construct(t, r || [], Yn(e).constructor) : t.apply(e, r));
}
function G_(e, t) {
  if (t && (ar(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return K_(e);
}
function K_(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Dm() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (Dm = function() {
    return !!e;
  })();
}
function Yn(e) {
  return Yn = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Yn(e);
}
function X_(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Oc(e, t);
}
function Oc(e, t) {
  return Oc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, i) {
    return n.__proto__ = i, n;
  }, Oc(e, t);
}
function Sc(e, t, r) {
  return t = Nm(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Nm(e) {
  var t = V_(e, "string");
  return ar(t) == "symbol" ? t : t + "";
}
function V_(e, t) {
  if (ar(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ar(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Wd = 1, Y_ = /* @__PURE__ */ (function(e) {
  function t() {
    var r;
    U_(this, t);
    for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++)
      i[a] = arguments[a];
    return r = H_(this, t, [].concat(i)), Sc(r, "state", {
      dismissed: !1,
      dismissedAtCoordinate: {
        x: 0,
        y: 0
      },
      lastBoundingBox: {
        width: -1,
        height: -1
      }
    }), Sc(r, "handleKeyDown", function(o) {
      if (o.key === "Escape") {
        var u, s, c, f;
        r.setState({
          dismissed: !0,
          dismissedAtCoordinate: {
            x: (u = (s = r.props.coordinate) === null || s === void 0 ? void 0 : s.x) !== null && u !== void 0 ? u : 0,
            y: (c = (f = r.props.coordinate) === null || f === void 0 ? void 0 : f.y) !== null && c !== void 0 ? c : 0
          }
        });
      }
    }), r;
  }
  return X_(t, e), z_(t, [{
    key: "updateBBox",
    value: function() {
      if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
        var n = this.wrapperNode.getBoundingClientRect();
        (Math.abs(n.width - this.state.lastBoundingBox.width) > Wd || Math.abs(n.height - this.state.lastBoundingBox.height) > Wd) && this.setState({
          lastBoundingBox: {
            width: n.width,
            height: n.height
          }
        });
      } else (this.state.lastBoundingBox.width !== -1 || this.state.lastBoundingBox.height !== -1) && this.setState({
        lastBoundingBox: {
          width: -1,
          height: -1
        }
      });
    }
  }, {
    key: "componentDidMount",
    value: function() {
      document.addEventListener("keydown", this.handleKeyDown), this.updateBBox();
    }
  }, {
    key: "componentWillUnmount",
    value: function() {
      document.removeEventListener("keydown", this.handleKeyDown);
    }
  }, {
    key: "componentDidUpdate",
    value: function() {
      var n, i;
      this.props.active && this.updateBBox(), this.state.dismissed && (((n = this.props.coordinate) === null || n === void 0 ? void 0 : n.x) !== this.state.dismissedAtCoordinate.x || ((i = this.props.coordinate) === null || i === void 0 ? void 0 : i.y) !== this.state.dismissedAtCoordinate.y) && (this.state.dismissed = !1);
    }
  }, {
    key: "render",
    value: function() {
      var n = this, i = this.props, a = i.active, o = i.allowEscapeViewBox, u = i.animationDuration, s = i.animationEasing, c = i.children, f = i.coordinate, l = i.hasPayload, h = i.isAnimationActive, d = i.offset, g = i.position, v = i.reverseDirection, p = i.useTranslate3d, m = i.viewBox, w = i.wrapperStyle, x = F_({
        allowEscapeViewBox: o,
        coordinate: f,
        offsetTopLeft: d,
        position: g,
        reverseDirection: v,
        tooltipBox: this.state.lastBoundingBox,
        useTranslate3d: p,
        viewBox: m
      }), _ = x.cssClasses, y = x.cssProperties, b = Ud(Ud({
        transition: h && a ? "transform ".concat(u, "ms ").concat(s) : void 0
      }, y), {}, {
        pointerEvents: "none",
        visibility: !this.state.dismissed && a && l ? "visible" : "hidden",
        position: "absolute",
        top: 0,
        left: 0
      }, w);
      return (
        // This element allow listening to the `Escape` key.
        // See https://github.com/recharts/recharts/pull/2925
        /* @__PURE__ */ E.createElement("div", {
          tabIndex: -1,
          className: _,
          style: b,
          ref: function(S) {
            n.wrapperNode = S;
          }
        }, c)
      );
    }
  }]);
})(Wt), Z_ = function() {
  return !(typeof window < "u" && window.document && window.document.createElement && window.setTimeout);
}, zi = {
  isSsr: Z_()
};
function or(e) {
  "@babel/helpers - typeof";
  return or = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, or(e);
}
function zd(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Hd(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? zd(Object(r), !0).forEach(function(n) {
      Ul(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : zd(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function J_(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function Q_(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, km(n.key), n);
  }
}
function eO(e, t, r) {
  return t && Q_(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function tO(e, t, r) {
  return t = Zn(t), rO(e, qm() ? Reflect.construct(t, r || [], Zn(e).constructor) : t.apply(e, r));
}
function rO(e, t) {
  if (t && (or(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return nO(e);
}
function nO(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function qm() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (qm = function() {
    return !!e;
  })();
}
function Zn(e) {
  return Zn = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Zn(e);
}
function iO(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Ac(e, t);
}
function Ac(e, t) {
  return Ac = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, i) {
    return n.__proto__ = i, n;
  }, Ac(e, t);
}
function Ul(e, t, r) {
  return t = km(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function km(e) {
  var t = aO(e, "string");
  return or(t) == "symbol" ? t : t + "";
}
function aO(e, t) {
  if (or(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (or(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function oO(e) {
  return e.dataKey;
}
function uO(e, t) {
  return /* @__PURE__ */ E.isValidElement(e) ? /* @__PURE__ */ E.cloneElement(e, t) : typeof e == "function" ? /* @__PURE__ */ E.createElement(e, t) : /* @__PURE__ */ E.createElement(D_, t);
}
var Ye = /* @__PURE__ */ (function(e) {
  function t() {
    return J_(this, t), tO(this, t, arguments);
  }
  return iO(t, e), eO(t, [{
    key: "render",
    value: function() {
      var n = this, i = this.props, a = i.active, o = i.allowEscapeViewBox, u = i.animationDuration, s = i.animationEasing, c = i.content, f = i.coordinate, l = i.filterNull, h = i.isAnimationActive, d = i.offset, g = i.payload, v = i.payloadUniqBy, p = i.position, m = i.reverseDirection, w = i.useTranslate3d, x = i.viewBox, _ = i.wrapperStyle, y = g ?? [];
      l && y.length && (y = Em(g.filter(function(O) {
        return O.value != null && (O.hide !== !0 || n.props.includeHidden);
      }), v, oO));
      var b = y.length > 0;
      return /* @__PURE__ */ E.createElement(Y_, {
        allowEscapeViewBox: o,
        animationDuration: u,
        animationEasing: s,
        isAnimationActive: h,
        active: a,
        coordinate: f,
        hasPayload: b,
        offset: d,
        position: p,
        reverseDirection: m,
        useTranslate3d: w,
        viewBox: x,
        wrapperStyle: _
      }, uO(c, Hd(Hd({}, this.props), {}, {
        payload: y
      })));
    }
  }]);
})(Wt);
Ul(Ye, "displayName", "Tooltip");
Ul(Ye, "defaultProps", {
  accessibilityLayer: !1,
  allowEscapeViewBox: {
    x: !1,
    y: !1
  },
  animationDuration: 400,
  animationEasing: "ease",
  contentStyle: {},
  coordinate: {
    x: 0,
    y: 0
  },
  cursor: !0,
  cursorStyle: {},
  filterNull: !0,
  isAnimationActive: !zi.isSsr,
  itemStyle: {},
  labelStyle: {},
  offset: 10,
  reverseDirection: {
    x: !1,
    y: !1
  },
  separator: " : ",
  trigger: "hover",
  useTranslate3d: !1,
  viewBox: {
    x: 0,
    y: 0,
    height: 0,
    width: 0
  },
  wrapperStyle: {}
});
var hs, Gd;
function sO() {
  if (Gd) return hs;
  Gd = 1;
  var e = nt(), t = function() {
    return e.Date.now();
  };
  return hs = t, hs;
}
var ps, Kd;
function cO() {
  if (Kd) return ps;
  Kd = 1;
  var e = /\s/;
  function t(r) {
    for (var n = r.length; n-- && e.test(r.charAt(n)); )
      ;
    return n;
  }
  return ps = t, ps;
}
var ds, Xd;
function lO() {
  if (Xd) return ds;
  Xd = 1;
  var e = cO(), t = /^\s+/;
  function r(n) {
    return n && n.slice(0, e(n) + 1).replace(t, "");
  }
  return ds = r, ds;
}
var vs, Vd;
function Lm() {
  if (Vd) return vs;
  Vd = 1;
  var e = lO(), t = Ot(), r = wr(), n = NaN, i = /^[-+]0x[0-9a-f]+$/i, a = /^0b[01]+$/i, o = /^0o[0-7]+$/i, u = parseInt;
  function s(c) {
    if (typeof c == "number")
      return c;
    if (r(c))
      return n;
    if (t(c)) {
      var f = typeof c.valueOf == "function" ? c.valueOf() : c;
      c = t(f) ? f + "" : f;
    }
    if (typeof c != "string")
      return c === 0 ? c : +c;
    c = e(c);
    var l = a.test(c);
    return l || o.test(c) ? u(c.slice(2), l ? 2 : 8) : i.test(c) ? n : +c;
  }
  return vs = s, vs;
}
var ys, Yd;
function fO() {
  if (Yd) return ys;
  Yd = 1;
  var e = Ot(), t = sO(), r = Lm(), n = "Expected a function", i = Math.max, a = Math.min;
  function o(u, s, c) {
    var f, l, h, d, g, v, p = 0, m = !1, w = !1, x = !0;
    if (typeof u != "function")
      throw new TypeError(n);
    s = r(s) || 0, e(c) && (m = !!c.leading, w = "maxWait" in c, h = w ? i(r(c.maxWait) || 0, s) : h, x = "trailing" in c ? !!c.trailing : x);
    function _(j) {
      var I = f, M = l;
      return f = l = void 0, p = j, d = u.apply(M, I), d;
    }
    function y(j) {
      return p = j, g = setTimeout(S, s), m ? _(j) : d;
    }
    function b(j) {
      var I = j - v, M = j - p, R = s - I;
      return w ? a(R, h - M) : R;
    }
    function O(j) {
      var I = j - v, M = j - p;
      return v === void 0 || I >= s || I < 0 || w && M >= h;
    }
    function S() {
      var j = t();
      if (O(j))
        return A(j);
      g = setTimeout(S, b(j));
    }
    function A(j) {
      return g = void 0, x && f ? _(j) : (f = l = void 0, d);
    }
    function C() {
      g !== void 0 && clearTimeout(g), p = 0, f = v = l = g = void 0;
    }
    function T() {
      return g === void 0 ? d : A(t());
    }
    function P() {
      var j = t(), I = O(j);
      if (f = arguments, l = this, v = j, I) {
        if (g === void 0)
          return y(v);
        if (w)
          return clearTimeout(g), g = setTimeout(S, s), _(v);
      }
      return g === void 0 && (g = setTimeout(S, s)), d;
    }
    return P.cancel = C, P.flush = T, P;
  }
  return ys = o, ys;
}
var gs, Zd;
function hO() {
  if (Zd) return gs;
  Zd = 1;
  var e = fO(), t = Ot(), r = "Expected a function";
  function n(i, a, o) {
    var u = !0, s = !0;
    if (typeof i != "function")
      throw new TypeError(r);
    return t(o) && (u = "leading" in o ? !!o.leading : u, s = "trailing" in o ? !!o.trailing : s), e(i, a, {
      leading: u,
      maxWait: a,
      trailing: s
    });
  }
  return gs = n, gs;
}
var pO = hO();
const Bm = /* @__PURE__ */ ce(pO);
function Hr(e) {
  "@babel/helpers - typeof";
  return Hr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Hr(e);
}
function Jd(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Cn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Jd(Object(r), !0).forEach(function(n) {
      dO(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Jd(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function dO(e, t, r) {
  return t = vO(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function vO(e) {
  var t = yO(e, "string");
  return Hr(t) == "symbol" ? t : t + "";
}
function yO(e, t) {
  if (Hr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Hr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function gO(e, t) {
  return xO(e) || wO(e, t) || bO(e, t) || mO();
}
function mO() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function bO(e, t) {
  if (e) {
    if (typeof e == "string") return Qd(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Qd(e, t);
  }
}
function Qd(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function wO(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], s = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(s = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); s = !0) ;
    } catch (f) {
      c = !0, i = f;
    } finally {
      try {
        if (!s && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function xO(e) {
  if (Array.isArray(e)) return e;
}
var _O = /* @__PURE__ */ bn(function(e, t) {
  var r = e.aspect, n = e.initialDimension, i = n === void 0 ? {
    width: -1,
    height: -1
  } : n, a = e.width, o = a === void 0 ? "100%" : a, u = e.height, s = u === void 0 ? "100%" : u, c = e.minWidth, f = c === void 0 ? 0 : c, l = e.minHeight, h = e.maxHeight, d = e.children, g = e.debounce, v = g === void 0 ? 0 : g, p = e.id, m = e.className, w = e.onResize, x = e.style, _ = x === void 0 ? {} : x, y = Bn(null), b = Bn();
  b.current = w, D0(t, function() {
    return Object.defineProperty(y.current, "current", {
      get: function() {
        return console.warn("The usage of ref.current.current is deprecated and will no longer be supported."), y.current;
      },
      configurable: !0
    });
  });
  var O = ml({
    containerWidth: i.width,
    containerHeight: i.height
  }), S = gO(O, 2), A = S[0], C = S[1], T = N0(function(j, I) {
    C(function(M) {
      var R = Math.round(j), N = Math.round(I);
      return M.containerWidth === R && M.containerHeight === N ? M : {
        containerWidth: R,
        containerHeight: N
      };
    });
  }, []);
  bl(function() {
    var j = function(k) {
      var W, H = k[0].contentRect, F = H.width, G = H.height;
      T(F, G), (W = b.current) === null || W === void 0 || W.call(b, F, G);
    };
    v > 0 && (j = Bm(j, v, {
      trailing: !0,
      leading: !1
    }));
    var I = new ResizeObserver(j), M = y.current.getBoundingClientRect(), R = M.width, N = M.height;
    return T(R, N), I.observe(y.current), function() {
      I.disconnect();
    };
  }, [T, v]);
  var P = wl(function() {
    var j = A.containerWidth, I = A.containerHeight;
    if (j < 0 || I < 0)
      return null;
    qt(Rt(o) || Rt(s), `The width(%s) and height(%s) are both fixed numbers,
       maybe you don't need to use a ResponsiveContainer.`, o, s), qt(!r || r > 0, "The aspect(%s) must be greater than zero.", r);
    var M = Rt(o) ? j : o, R = Rt(s) ? I : s;
    r && r > 0 && (M ? R = M / r : R && (M = R * r), h && R > h && (R = h)), qt(M > 0 || R > 0, `The width(%s) and height(%s) of chart should be greater than 0,
       please check the style of container, or the props width(%s) and height(%s),
       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the
       height and width.`, M, R, o, s, f, l, r);
    var N = !Array.isArray(d) && st(d.type).endsWith("Chart");
    return E.Children.map(d, function(q) {
      return /* @__PURE__ */ E.isValidElement(q) ? /* @__PURE__ */ be(q, Cn({
        width: M,
        height: R
      }, N ? {
        style: Cn({
          height: "100%",
          width: "100%",
          maxHeight: R,
          maxWidth: M
        }, q.props.style)
      } : {})) : q;
    });
  }, [r, d, s, h, l, f, A, o]);
  return /* @__PURE__ */ E.createElement("div", {
    id: p ? "".concat(p) : void 0,
    className: ue("recharts-responsive-container", m),
    style: Cn(Cn({}, _), {}, {
      width: o,
      height: s,
      minWidth: f,
      minHeight: l,
      maxHeight: h
    }),
    ref: y
  }, P);
}), Fm = function(t) {
  return null;
};
Fm.displayName = "Cell";
function Gr(e) {
  "@babel/helpers - typeof";
  return Gr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Gr(e);
}
function ev(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Pc(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ev(Object(r), !0).forEach(function(n) {
      OO(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ev(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function OO(e, t, r) {
  return t = SO(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function SO(e) {
  var t = AO(e, "string");
  return Gr(t) == "symbol" ? t : t + "";
}
function AO(e, t) {
  if (Gr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Gr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Yt = {
  widthCache: {},
  cacheCount: 0
}, PO = 2e3, TO = {
  position: "absolute",
  top: "-20000px",
  left: 0,
  padding: 0,
  margin: 0,
  border: "none",
  whiteSpace: "pre"
}, tv = "recharts_measurement_span";
function EO(e) {
  var t = Pc({}, e);
  return Object.keys(t).forEach(function(r) {
    t[r] || delete t[r];
  }), t;
}
var rv = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (t == null || zi.isSsr)
    return {
      width: 0,
      height: 0
    };
  var n = EO(r), i = JSON.stringify({
    text: t,
    copyStyle: n
  });
  if (Yt.widthCache[i])
    return Yt.widthCache[i];
  try {
    var a = document.getElementById(tv);
    a || (a = document.createElement("span"), a.setAttribute("id", tv), a.setAttribute("aria-hidden", "true"), document.body.appendChild(a));
    var o = Pc(Pc({}, TO), n);
    Object.assign(a.style, o), a.textContent = "".concat(t);
    var u = a.getBoundingClientRect(), s = {
      width: u.width,
      height: u.height
    };
    return Yt.widthCache[i] = s, ++Yt.cacheCount > PO && (Yt.cacheCount = 0, Yt.widthCache = {}), s;
  } catch {
    return {
      width: 0,
      height: 0
    };
  }
}, jO = function(t) {
  return {
    top: t.top + window.scrollY - document.documentElement.clientTop,
    left: t.left + window.scrollX - document.documentElement.clientLeft
  };
};
function Kr(e) {
  "@babel/helpers - typeof";
  return Kr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Kr(e);
}
function Jn(e, t) {
  return $O(e) || IO(e, t) || CO(e, t) || MO();
}
function MO() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function CO(e, t) {
  if (e) {
    if (typeof e == "string") return nv(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return nv(e, t);
  }
}
function nv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function IO(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], s = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t === 0) {
        if (Object(r) !== r) return;
        s = !1;
      } else for (; !(s = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); s = !0) ;
    } catch (f) {
      c = !0, i = f;
    } finally {
      try {
        if (!s && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function $O(e) {
  if (Array.isArray(e)) return e;
}
function RO(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function iv(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, NO(n.key), n);
  }
}
function DO(e, t, r) {
  return t && iv(e.prototype, t), r && iv(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function NO(e) {
  var t = qO(e, "string");
  return Kr(t) == "symbol" ? t : t + "";
}
function qO(e, t) {
  if (Kr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Kr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var av = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, ov = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, kO = /^px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q$/, LO = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/, Um = {
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  pt: 96 / 72,
  pc: 96 / 6,
  in: 96,
  Q: 96 / (2.54 * 40),
  px: 1
}, BO = Object.keys(Um), Jt = "NaN";
function FO(e, t) {
  return e * Um[t];
}
var In = /* @__PURE__ */ (function() {
  function e(t, r) {
    RO(this, e), this.num = t, this.unit = r, this.num = t, this.unit = r, Number.isNaN(t) && (this.unit = ""), r !== "" && !kO.test(r) && (this.num = NaN, this.unit = ""), BO.includes(r) && (this.num = FO(t, r), this.unit = "px");
  }
  return DO(e, [{
    key: "add",
    value: function(r) {
      return this.unit !== r.unit ? new e(NaN, "") : new e(this.num + r.num, this.unit);
    }
  }, {
    key: "subtract",
    value: function(r) {
      return this.unit !== r.unit ? new e(NaN, "") : new e(this.num - r.num, this.unit);
    }
  }, {
    key: "multiply",
    value: function(r) {
      return this.unit !== "" && r.unit !== "" && this.unit !== r.unit ? new e(NaN, "") : new e(this.num * r.num, this.unit || r.unit);
    }
  }, {
    key: "divide",
    value: function(r) {
      return this.unit !== "" && r.unit !== "" && this.unit !== r.unit ? new e(NaN, "") : new e(this.num / r.num, this.unit || r.unit);
    }
  }, {
    key: "toString",
    value: function() {
      return "".concat(this.num).concat(this.unit);
    }
  }, {
    key: "isNaN",
    value: function() {
      return Number.isNaN(this.num);
    }
  }], [{
    key: "parse",
    value: function(r) {
      var n, i = (n = LO.exec(r)) !== null && n !== void 0 ? n : [], a = Jn(i, 3), o = a[1], u = a[2];
      return new e(parseFloat(o), u ?? "");
    }
  }]);
})();
function Wm(e) {
  if (e.includes(Jt))
    return Jt;
  for (var t = e; t.includes("*") || t.includes("/"); ) {
    var r, n = (r = av.exec(t)) !== null && r !== void 0 ? r : [], i = Jn(n, 4), a = i[1], o = i[2], u = i[3], s = In.parse(a ?? ""), c = In.parse(u ?? ""), f = o === "*" ? s.multiply(c) : s.divide(c);
    if (f.isNaN())
      return Jt;
    t = t.replace(av, f.toString());
  }
  for (; t.includes("+") || /.-\d+(?:\.\d+)?/.test(t); ) {
    var l, h = (l = ov.exec(t)) !== null && l !== void 0 ? l : [], d = Jn(h, 4), g = d[1], v = d[2], p = d[3], m = In.parse(g ?? ""), w = In.parse(p ?? ""), x = v === "+" ? m.add(w) : m.subtract(w);
    if (x.isNaN())
      return Jt;
    t = t.replace(ov, x.toString());
  }
  return t;
}
var uv = /\(([^()]*)\)/;
function UO(e) {
  for (var t = e; t.includes("("); ) {
    var r = uv.exec(t), n = Jn(r, 2), i = n[1];
    t = t.replace(uv, Wm(i));
  }
  return t;
}
function WO(e) {
  var t = e.replace(/\s+/g, "");
  return t = UO(t), t = Wm(t), t;
}
function zO(e) {
  try {
    return WO(e);
  } catch {
    return Jt;
  }
}
function ms(e) {
  var t = zO(e.slice(5, -1));
  return t === Jt ? "" : t;
}
var HO = ["x", "y", "lineHeight", "capHeight", "scaleToFit", "textAnchor", "verticalAnchor", "fill"], GO = ["dx", "dy", "angle", "className", "breakAll"];
function Tc() {
  return Tc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Tc.apply(this, arguments);
}
function sv(e, t) {
  if (e == null) return {};
  var r = KO(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function KO(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function cv(e, t) {
  return ZO(e) || YO(e, t) || VO(e, t) || XO();
}
function XO() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function VO(e, t) {
  if (e) {
    if (typeof e == "string") return lv(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return lv(e, t);
  }
}
function lv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function YO(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], s = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t === 0) {
        if (Object(r) !== r) return;
        s = !1;
      } else for (; !(s = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); s = !0) ;
    } catch (f) {
      c = !0, i = f;
    } finally {
      try {
        if (!s && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function ZO(e) {
  if (Array.isArray(e)) return e;
}
var zm = /[ \f\n\r\t\v\u2028\u2029]+/, Hm = function(t) {
  var r = t.children, n = t.breakAll, i = t.style;
  try {
    var a = [];
    V(r) || (n ? a = r.toString().split("") : a = r.toString().split(zm));
    var o = a.map(function(s) {
      return {
        word: s,
        width: rv(s, i).width
      };
    }), u = n ? 0 : rv(" ", i).width;
    return {
      wordsWithComputedWidth: o,
      spaceWidth: u
    };
  } catch {
    return null;
  }
}, JO = function(t, r, n, i, a) {
  var o = t.maxLines, u = t.children, s = t.style, c = t.breakAll, f = B(o), l = u, h = function() {
    var M = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    return M.reduce(function(R, N) {
      var q = N.word, k = N.width, W = R[R.length - 1];
      if (W && (i == null || a || W.width + k + n < Number(i)))
        W.words.push(q), W.width += k + n;
      else {
        var H = {
          words: [q],
          width: k
        };
        R.push(H);
      }
      return R;
    }, []);
  }, d = h(r), g = function(M) {
    return M.reduce(function(R, N) {
      return R.width > N.width ? R : N;
    });
  };
  if (!f)
    return d;
  for (var v = "…", p = function(M) {
    var R = l.slice(0, M), N = Hm({
      breakAll: c,
      style: s,
      children: R + v
    }).wordsWithComputedWidth, q = h(N), k = q.length > o || g(q).width > Number(i);
    return [k, q];
  }, m = 0, w = l.length - 1, x = 0, _; m <= w && x <= l.length - 1; ) {
    var y = Math.floor((m + w) / 2), b = y - 1, O = p(b), S = cv(O, 2), A = S[0], C = S[1], T = p(y), P = cv(T, 1), j = P[0];
    if (!A && !j && (m = y + 1), A && j && (w = y - 1), !A && j) {
      _ = C;
      break;
    }
    x++;
  }
  return _ || d;
}, fv = function(t) {
  var r = V(t) ? [] : t.toString().split(zm);
  return [{
    words: r
  }];
}, QO = function(t) {
  var r = t.width, n = t.scaleToFit, i = t.children, a = t.style, o = t.breakAll, u = t.maxLines;
  if ((r || n) && !zi.isSsr) {
    var s, c, f = Hm({
      breakAll: o,
      children: i,
      style: a
    });
    if (f) {
      var l = f.wordsWithComputedWidth, h = f.spaceWidth;
      s = l, c = h;
    } else
      return fv(i);
    return JO({
      breakAll: o,
      children: i,
      maxLines: u,
      style: a
    }, s, c, r, n);
  }
  return fv(i);
}, hv = "#808080", Ec = function(t) {
  var r = t.x, n = r === void 0 ? 0 : r, i = t.y, a = i === void 0 ? 0 : i, o = t.lineHeight, u = o === void 0 ? "1em" : o, s = t.capHeight, c = s === void 0 ? "0.71em" : s, f = t.scaleToFit, l = f === void 0 ? !1 : f, h = t.textAnchor, d = h === void 0 ? "start" : h, g = t.verticalAnchor, v = g === void 0 ? "end" : g, p = t.fill, m = p === void 0 ? hv : p, w = sv(t, HO), x = wl(function() {
    return QO({
      breakAll: w.breakAll,
      children: w.children,
      maxLines: w.maxLines,
      scaleToFit: l,
      style: w.style,
      width: w.width
    });
  }, [w.breakAll, w.children, w.maxLines, l, w.style, w.width]), _ = w.dx, y = w.dy, b = w.angle, O = w.className, S = w.breakAll, A = sv(w, GO);
  if (!xe(n) || !xe(a))
    return null;
  var C = n + (B(_) ? _ : 0), T = a + (B(y) ? y : 0), P;
  switch (v) {
    case "start":
      P = ms("calc(".concat(c, ")"));
      break;
    case "middle":
      P = ms("calc(".concat((x.length - 1) / 2, " * -").concat(u, " + (").concat(c, " / 2))"));
      break;
    default:
      P = ms("calc(".concat(x.length - 1, " * -").concat(u, ")"));
      break;
  }
  var j = [];
  if (l) {
    var I = x[0].width, M = w.width;
    j.push("scale(".concat((B(M) ? M / I : 1) / I, ")"));
  }
  return b && j.push("rotate(".concat(b, ", ").concat(C, ", ").concat(T, ")")), j.length && (A.transform = j.join(" ")), /* @__PURE__ */ E.createElement("text", Tc({}, se(A, !0), {
    x: C,
    y: T,
    className: ue("recharts-text", O),
    textAnchor: d,
    fill: m.includes("url") ? hv : m
  }), x.map(function(R, N) {
    var q = R.words.join(S ? "" : " ");
    return (
      // duplicate words will cause duplicate keys
      // eslint-disable-next-line react/no-array-index-key
      /* @__PURE__ */ E.createElement("tspan", {
        x: C,
        dy: N === 0 ? P : u,
        key: "".concat(q, "-").concat(N)
      }, q)
    );
  }));
};
function wt(e, t) {
  return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function eS(e, t) {
  return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Wl(e) {
  let t, r, n;
  e.length !== 2 ? (t = wt, r = (u, s) => wt(e(u), s), n = (u, s) => e(u) - s) : (t = e === wt || e === eS ? e : tS, r = e, n = e);
  function i(u, s, c = 0, f = u.length) {
    if (c < f) {
      if (t(s, s) !== 0) return f;
      do {
        const l = c + f >>> 1;
        r(u[l], s) < 0 ? c = l + 1 : f = l;
      } while (c < f);
    }
    return c;
  }
  function a(u, s, c = 0, f = u.length) {
    if (c < f) {
      if (t(s, s) !== 0) return f;
      do {
        const l = c + f >>> 1;
        r(u[l], s) <= 0 ? c = l + 1 : f = l;
      } while (c < f);
    }
    return c;
  }
  function o(u, s, c = 0, f = u.length) {
    const l = i(u, s, c, f - 1);
    return l > c && n(u[l - 1], s) > -n(u[l], s) ? l - 1 : l;
  }
  return { left: i, center: o, right: a };
}
function tS() {
  return 0;
}
function Gm(e) {
  return e === null ? NaN : +e;
}
function* rS(e, t) {
  for (let r of e)
    r != null && (r = +r) >= r && (yield r);
}
const nS = Wl(wt), On = nS.right;
Wl(Gm).center;
class pv extends Map {
  constructor(t, r = oS) {
    if (super(), Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: r } }), t != null) for (const [n, i] of t) this.set(n, i);
  }
  get(t) {
    return super.get(dv(this, t));
  }
  has(t) {
    return super.has(dv(this, t));
  }
  set(t, r) {
    return super.set(iS(this, t), r);
  }
  delete(t) {
    return super.delete(aS(this, t));
  }
}
function dv({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : r;
}
function iS({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : (e.set(n, r), r);
}
function aS({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) && (r = e.get(n), e.delete(n)), r;
}
function oS(e) {
  return e !== null && typeof e == "object" ? e.valueOf() : e;
}
function uS(e = wt) {
  if (e === wt) return Km;
  if (typeof e != "function") throw new TypeError("compare is not a function");
  return (t, r) => {
    const n = e(t, r);
    return n || n === 0 ? n : (e(r, r) === 0) - (e(t, t) === 0);
  };
}
function Km(e, t) {
  return (e == null || !(e >= e)) - (t == null || !(t >= t)) || (e < t ? -1 : e > t ? 1 : 0);
}
const sS = Math.sqrt(50), cS = Math.sqrt(10), lS = Math.sqrt(2);
function Qn(e, t, r) {
  const n = (t - e) / Math.max(0, r), i = Math.floor(Math.log10(n)), a = n / Math.pow(10, i), o = a >= sS ? 10 : a >= cS ? 5 : a >= lS ? 2 : 1;
  let u, s, c;
  return i < 0 ? (c = Math.pow(10, -i) / o, u = Math.round(e * c), s = Math.round(t * c), u / c < e && ++u, s / c > t && --s, c = -c) : (c = Math.pow(10, i) * o, u = Math.round(e / c), s = Math.round(t / c), u * c < e && ++u, s * c > t && --s), s < u && 0.5 <= r && r < 2 ? Qn(e, t, r * 2) : [u, s, c];
}
function jc(e, t, r) {
  if (t = +t, e = +e, r = +r, !(r > 0)) return [];
  if (e === t) return [e];
  const n = t < e, [i, a, o] = n ? Qn(t, e, r) : Qn(e, t, r);
  if (!(a >= i)) return [];
  const u = a - i + 1, s = new Array(u);
  if (n)
    if (o < 0) for (let c = 0; c < u; ++c) s[c] = (a - c) / -o;
    else for (let c = 0; c < u; ++c) s[c] = (a - c) * o;
  else if (o < 0) for (let c = 0; c < u; ++c) s[c] = (i + c) / -o;
  else for (let c = 0; c < u; ++c) s[c] = (i + c) * o;
  return s;
}
function Mc(e, t, r) {
  return t = +t, e = +e, r = +r, Qn(e, t, r)[2];
}
function Cc(e, t, r) {
  t = +t, e = +e, r = +r;
  const n = t < e, i = n ? Mc(t, e, r) : Mc(e, t, r);
  return (n ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
function vv(e, t) {
  let r;
  for (const n of e)
    n != null && (r < n || r === void 0 && n >= n) && (r = n);
  return r;
}
function yv(e, t) {
  let r;
  for (const n of e)
    n != null && (r > n || r === void 0 && n >= n) && (r = n);
  return r;
}
function Xm(e, t, r = 0, n = 1 / 0, i) {
  if (t = Math.floor(t), r = Math.floor(Math.max(0, r)), n = Math.floor(Math.min(e.length - 1, n)), !(r <= t && t <= n)) return e;
  for (i = i === void 0 ? Km : uS(i); n > r; ) {
    if (n - r > 600) {
      const s = n - r + 1, c = t - r + 1, f = Math.log(s), l = 0.5 * Math.exp(2 * f / 3), h = 0.5 * Math.sqrt(f * l * (s - l) / s) * (c - s / 2 < 0 ? -1 : 1), d = Math.max(r, Math.floor(t - c * l / s + h)), g = Math.min(n, Math.floor(t + (s - c) * l / s + h));
      Xm(e, t, d, g, i);
    }
    const a = e[t];
    let o = r, u = n;
    for (Pr(e, r, t), i(e[n], a) > 0 && Pr(e, r, n); o < u; ) {
      for (Pr(e, o, u), ++o, --u; i(e[o], a) < 0; ) ++o;
      for (; i(e[u], a) > 0; ) --u;
    }
    i(e[r], a) === 0 ? Pr(e, r, u) : (++u, Pr(e, u, n)), u <= t && (r = u + 1), t <= u && (n = u - 1);
  }
  return e;
}
function Pr(e, t, r) {
  const n = e[t];
  e[t] = e[r], e[r] = n;
}
function fS(e, t, r) {
  if (e = Float64Array.from(rS(e)), !(!(n = e.length) || isNaN(t = +t))) {
    if (t <= 0 || n < 2) return yv(e);
    if (t >= 1) return vv(e);
    var n, i = (n - 1) * t, a = Math.floor(i), o = vv(Xm(e, a).subarray(0, a + 1)), u = yv(e.subarray(a + 1));
    return o + (u - o) * (i - a);
  }
}
function hS(e, t, r = Gm) {
  if (!(!(n = e.length) || isNaN(t = +t))) {
    if (t <= 0 || n < 2) return +r(e[0], 0, e);
    if (t >= 1) return +r(e[n - 1], n - 1, e);
    var n, i = (n - 1) * t, a = Math.floor(i), o = +r(e[a], a, e), u = +r(e[a + 1], a + 1, e);
    return o + (u - o) * (i - a);
  }
}
function pS(e, t, r) {
  e = +e, t = +t, r = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +r;
  for (var n = -1, i = Math.max(0, Math.ceil((t - e) / r)) | 0, a = new Array(i); ++n < i; )
    a[n] = e + n * r;
  return a;
}
function Ue(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(t).domain(e);
      break;
  }
  return this;
}
function vt(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1: {
      typeof e == "function" ? this.interpolator(e) : this.range(e);
      break;
    }
    default: {
      this.domain(e), typeof t == "function" ? this.interpolator(t) : this.range(t);
      break;
    }
  }
  return this;
}
const Ic = /* @__PURE__ */ Symbol("implicit");
function zl() {
  var e = new pv(), t = [], r = [], n = Ic;
  function i(a) {
    let o = e.get(a);
    if (o === void 0) {
      if (n !== Ic) return n;
      e.set(a, o = t.push(a) - 1);
    }
    return r[o % r.length];
  }
  return i.domain = function(a) {
    if (!arguments.length) return t.slice();
    t = [], e = new pv();
    for (const o of a)
      e.has(o) || e.set(o, t.push(o) - 1);
    return i;
  }, i.range = function(a) {
    return arguments.length ? (r = Array.from(a), i) : r.slice();
  }, i.unknown = function(a) {
    return arguments.length ? (n = a, i) : n;
  }, i.copy = function() {
    return zl(t, r).unknown(n);
  }, Ue.apply(i, arguments), i;
}
function Xr() {
  var e = zl().unknown(void 0), t = e.domain, r = e.range, n = 0, i = 1, a, o, u = !1, s = 0, c = 0, f = 0.5;
  delete e.unknown;
  function l() {
    var h = t().length, d = i < n, g = d ? i : n, v = d ? n : i;
    a = (v - g) / Math.max(1, h - s + c * 2), u && (a = Math.floor(a)), g += (v - g - a * (h - s)) * f, o = a * (1 - s), u && (g = Math.round(g), o = Math.round(o));
    var p = pS(h).map(function(m) {
      return g + a * m;
    });
    return r(d ? p.reverse() : p);
  }
  return e.domain = function(h) {
    return arguments.length ? (t(h), l()) : t();
  }, e.range = function(h) {
    return arguments.length ? ([n, i] = h, n = +n, i = +i, l()) : [n, i];
  }, e.rangeRound = function(h) {
    return [n, i] = h, n = +n, i = +i, u = !0, l();
  }, e.bandwidth = function() {
    return o;
  }, e.step = function() {
    return a;
  }, e.round = function(h) {
    return arguments.length ? (u = !!h, l()) : u;
  }, e.padding = function(h) {
    return arguments.length ? (s = Math.min(1, c = +h), l()) : s;
  }, e.paddingInner = function(h) {
    return arguments.length ? (s = Math.min(1, h), l()) : s;
  }, e.paddingOuter = function(h) {
    return arguments.length ? (c = +h, l()) : c;
  }, e.align = function(h) {
    return arguments.length ? (f = Math.max(0, Math.min(1, h)), l()) : f;
  }, e.copy = function() {
    return Xr(t(), [n, i]).round(u).paddingInner(s).paddingOuter(c).align(f);
  }, Ue.apply(l(), arguments);
}
function Vm(e) {
  var t = e.copy;
  return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
    return Vm(t());
  }, e;
}
function kr() {
  return Vm(Xr.apply(null, arguments).paddingInner(1));
}
function Hl(e, t) {
  return e = +e, t = +t, function(r) {
    return Math.round(e * (1 - r) + t * r);
  };
}
function dS(e, t) {
  t === void 0 && (t = e, e = Mi);
  for (var r = 0, n = t.length - 1, i = t[0], a = new Array(n < 0 ? 0 : n); r < n; ) a[r] = e(i, i = t[++r]);
  return function(o) {
    var u = Math.max(0, Math.min(n - 1, Math.floor(o *= n)));
    return a[u](o - u);
  };
}
function vS(e) {
  return function() {
    return e;
  };
}
function ei(e) {
  return +e;
}
var gv = [0, 1];
function je(e) {
  return e;
}
function $c(e, t) {
  return (t -= e = +e) ? function(r) {
    return (r - e) / t;
  } : vS(isNaN(t) ? NaN : 0.5);
}
function yS(e, t) {
  var r;
  return e > t && (r = e, e = t, t = r), function(n) {
    return Math.max(e, Math.min(t, n));
  };
}
function gS(e, t, r) {
  var n = e[0], i = e[1], a = t[0], o = t[1];
  return i < n ? (n = $c(i, n), a = r(o, a)) : (n = $c(n, i), a = r(a, o)), function(u) {
    return a(n(u));
  };
}
function mS(e, t, r) {
  var n = Math.min(e.length, t.length) - 1, i = new Array(n), a = new Array(n), o = -1;
  for (e[n] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++o < n; )
    i[o] = $c(e[o], e[o + 1]), a[o] = r(t[o], t[o + 1]);
  return function(u) {
    var s = On(e, u, 1, n) - 1;
    return a[s](i[s](u));
  };
}
function Sn(e, t) {
  return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function Hi() {
  var e = gv, t = gv, r = Mi, n, i, a, o = je, u, s, c;
  function f() {
    var h = Math.min(e.length, t.length);
    return o !== je && (o = yS(e[0], e[h - 1])), u = h > 2 ? mS : gS, s = c = null, l;
  }
  function l(h) {
    return h == null || isNaN(h = +h) ? a : (s || (s = u(e.map(n), t, r)))(n(o(h)));
  }
  return l.invert = function(h) {
    return o(i((c || (c = u(t, e.map(n), L0)))(h)));
  }, l.domain = function(h) {
    return arguments.length ? (e = Array.from(h, ei), f()) : e.slice();
  }, l.range = function(h) {
    return arguments.length ? (t = Array.from(h), f()) : t.slice();
  }, l.rangeRound = function(h) {
    return t = Array.from(h), r = Hl, f();
  }, l.clamp = function(h) {
    return arguments.length ? (o = h ? !0 : je, f()) : o !== je;
  }, l.interpolate = function(h) {
    return arguments.length ? (r = h, f()) : r;
  }, l.unknown = function(h) {
    return arguments.length ? (a = h, l) : a;
  }, function(h, d) {
    return n = h, i = d, f();
  };
}
function Gl() {
  return Hi()(je, je);
}
function bS(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function ti(e, t) {
  if (!isFinite(e) || e === 0) return null;
  var r = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e"), n = e.slice(0, r);
  return [
    n.length > 1 ? n[0] + n.slice(2) : n,
    +e.slice(r + 1)
  ];
}
function ur(e) {
  return e = ti(Math.abs(e)), e ? e[1] : NaN;
}
function wS(e, t) {
  return function(r, n) {
    for (var i = r.length, a = [], o = 0, u = e[0], s = 0; i > 0 && u > 0 && (s + u + 1 > n && (u = Math.max(1, n - s)), a.push(r.substring(i -= u, i + u)), !((s += u + 1) > n)); )
      u = e[o = (o + 1) % e.length];
    return a.reverse().join(t);
  };
}
function xS(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(r) {
      return e[+r];
    });
  };
}
var _S = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Vr(e) {
  if (!(t = _S.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new Kl({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10]
  });
}
Vr.prototype = Kl.prototype;
function Kl(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
Kl.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function OS(e) {
  e: for (var t = e.length, r = 1, n = -1, i; r < t; ++r)
    switch (e[r]) {
      case ".":
        n = i = r;
        break;
      case "0":
        n === 0 && (n = r), i = r;
        break;
      default:
        if (!+e[r]) break e;
        n > 0 && (n = 0);
        break;
    }
  return n > 0 ? e.slice(0, n) + e.slice(i + 1) : e;
}
var ri;
function SS(e, t) {
  var r = ti(e, t);
  if (!r) return ri = void 0, e.toPrecision(t);
  var n = r[0], i = r[1], a = i - (ri = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, o = n.length;
  return a === o ? n : a > o ? n + new Array(a - o + 1).join("0") : a > 0 ? n.slice(0, a) + "." + n.slice(a) : "0." + new Array(1 - a).join("0") + ti(e, Math.max(0, t + a - 1))[0];
}
function mv(e, t) {
  var r = ti(e, t);
  if (!r) return e + "";
  var n = r[0], i = r[1];
  return i < 0 ? "0." + new Array(-i).join("0") + n : n.length > i + 1 ? n.slice(0, i + 1) + "." + n.slice(i + 1) : n + new Array(i - n.length + 2).join("0");
}
const bv = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: bS,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => mv(e * 100, t),
  r: mv,
  s: SS,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function wv(e) {
  return e;
}
var xv = Array.prototype.map, _v = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function AS(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? wv : wS(xv.call(e.grouping, Number), e.thousands + ""), r = e.currency === void 0 ? "" : e.currency[0] + "", n = e.currency === void 0 ? "" : e.currency[1] + "", i = e.decimal === void 0 ? "." : e.decimal + "", a = e.numerals === void 0 ? wv : xS(xv.call(e.numerals, String)), o = e.percent === void 0 ? "%" : e.percent + "", u = e.minus === void 0 ? "−" : e.minus + "", s = e.nan === void 0 ? "NaN" : e.nan + "";
  function c(l, h) {
    l = Vr(l);
    var d = l.fill, g = l.align, v = l.sign, p = l.symbol, m = l.zero, w = l.width, x = l.comma, _ = l.precision, y = l.trim, b = l.type;
    b === "n" ? (x = !0, b = "g") : bv[b] || (_ === void 0 && (_ = 12), y = !0, b = "g"), (m || d === "0" && g === "=") && (m = !0, d = "0", g = "=");
    var O = (h && h.prefix !== void 0 ? h.prefix : "") + (p === "$" ? r : p === "#" && /[boxX]/.test(b) ? "0" + b.toLowerCase() : ""), S = (p === "$" ? n : /[%p]/.test(b) ? o : "") + (h && h.suffix !== void 0 ? h.suffix : ""), A = bv[b], C = /[defgprs%]/.test(b);
    _ = _ === void 0 ? 6 : /[gprs]/.test(b) ? Math.max(1, Math.min(21, _)) : Math.max(0, Math.min(20, _));
    function T(P) {
      var j = O, I = S, M, R, N;
      if (b === "c")
        I = A(P) + I, P = "";
      else {
        P = +P;
        var q = P < 0 || 1 / P < 0;
        if (P = isNaN(P) ? s : A(Math.abs(P), _), y && (P = OS(P)), q && +P == 0 && v !== "+" && (q = !1), j = (q ? v === "(" ? v : u : v === "-" || v === "(" ? "" : v) + j, I = (b === "s" && !isNaN(P) && ri !== void 0 ? _v[8 + ri / 3] : "") + I + (q && v === "(" ? ")" : ""), C) {
          for (M = -1, R = P.length; ++M < R; )
            if (N = P.charCodeAt(M), 48 > N || N > 57) {
              I = (N === 46 ? i + P.slice(M + 1) : P.slice(M)) + I, P = P.slice(0, M);
              break;
            }
        }
      }
      x && !m && (P = t(P, 1 / 0));
      var k = j.length + P.length + I.length, W = k < w ? new Array(w - k + 1).join(d) : "";
      switch (x && m && (P = t(W + P, W.length ? w - I.length : 1 / 0), W = ""), g) {
        case "<":
          P = j + P + I + W;
          break;
        case "=":
          P = j + W + P + I;
          break;
        case "^":
          P = W.slice(0, k = W.length >> 1) + j + P + I + W.slice(k);
          break;
        default:
          P = W + j + P + I;
          break;
      }
      return a(P);
    }
    return T.toString = function() {
      return l + "";
    }, T;
  }
  function f(l, h) {
    var d = Math.max(-8, Math.min(8, Math.floor(ur(h) / 3))) * 3, g = Math.pow(10, -d), v = c((l = Vr(l), l.type = "f", l), { suffix: _v[8 + d / 3] });
    return function(p) {
      return v(g * p);
    };
  }
  return {
    format: c,
    formatPrefix: f
  };
}
var $n, Xl, Ym;
PS({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function PS(e) {
  return $n = AS(e), Xl = $n.format, Ym = $n.formatPrefix, $n;
}
function TS(e) {
  return Math.max(0, -ur(Math.abs(e)));
}
function ES(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(ur(t) / 3))) * 3 - ur(Math.abs(e)));
}
function jS(e, t) {
  return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, ur(t) - ur(e)) + 1;
}
function Zm(e, t, r, n) {
  var i = Cc(e, t, r), a;
  switch (n = Vr(n ?? ",f"), n.type) {
    case "s": {
      var o = Math.max(Math.abs(e), Math.abs(t));
      return n.precision == null && !isNaN(a = ES(i, o)) && (n.precision = a), Ym(n, o);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null && !isNaN(a = jS(i, Math.max(Math.abs(e), Math.abs(t)))) && (n.precision = a - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(a = TS(i)) && (n.precision = a - (n.type === "%") * 2);
      break;
    }
  }
  return Xl(n);
}
function At(e) {
  var t = e.domain;
  return e.ticks = function(r) {
    var n = t();
    return jc(n[0], n[n.length - 1], r ?? 10);
  }, e.tickFormat = function(r, n) {
    var i = t();
    return Zm(i[0], i[i.length - 1], r ?? 10, n);
  }, e.nice = function(r) {
    r == null && (r = 10);
    var n = t(), i = 0, a = n.length - 1, o = n[i], u = n[a], s, c, f = 10;
    for (u < o && (c = o, o = u, u = c, c = i, i = a, a = c); f-- > 0; ) {
      if (c = Mc(o, u, r), c === s)
        return n[i] = o, n[a] = u, t(n);
      if (c > 0)
        o = Math.floor(o / c) * c, u = Math.ceil(u / c) * c;
      else if (c < 0)
        o = Math.ceil(o * c) / c, u = Math.floor(u * c) / c;
      else
        break;
      s = c;
    }
    return e;
  }, e;
}
function ni() {
  var e = Gl();
  return e.copy = function() {
    return Sn(e, ni());
  }, Ue.apply(e, arguments), At(e);
}
function Jm(e) {
  var t;
  function r(n) {
    return n == null || isNaN(n = +n) ? t : n;
  }
  return r.invert = r, r.domain = r.range = function(n) {
    return arguments.length ? (e = Array.from(n, ei), r) : e.slice();
  }, r.unknown = function(n) {
    return arguments.length ? (t = n, r) : t;
  }, r.copy = function() {
    return Jm(e).unknown(t);
  }, e = arguments.length ? Array.from(e, ei) : [0, 1], At(r);
}
function Qm(e, t) {
  e = e.slice();
  var r = 0, n = e.length - 1, i = e[r], a = e[n], o;
  return a < i && (o = r, r = n, n = o, o = i, i = a, a = o), e[r] = t.floor(i), e[n] = t.ceil(a), e;
}
function Ov(e) {
  return Math.log(e);
}
function Sv(e) {
  return Math.exp(e);
}
function MS(e) {
  return -Math.log(-e);
}
function CS(e) {
  return -Math.exp(-e);
}
function IS(e) {
  return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function $S(e) {
  return e === 10 ? IS : e === Math.E ? Math.exp : (t) => Math.pow(e, t);
}
function RS(e) {
  return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), (t) => Math.log(t) / e);
}
function Av(e) {
  return (t, r) => -e(-t, r);
}
function Vl(e) {
  const t = e(Ov, Sv), r = t.domain;
  let n = 10, i, a;
  function o() {
    return i = RS(n), a = $S(n), r()[0] < 0 ? (i = Av(i), a = Av(a), e(MS, CS)) : e(Ov, Sv), t;
  }
  return t.base = function(u) {
    return arguments.length ? (n = +u, o()) : n;
  }, t.domain = function(u) {
    return arguments.length ? (r(u), o()) : r();
  }, t.ticks = (u) => {
    const s = r();
    let c = s[0], f = s[s.length - 1];
    const l = f < c;
    l && ([c, f] = [f, c]);
    let h = i(c), d = i(f), g, v;
    const p = u == null ? 10 : +u;
    let m = [];
    if (!(n % 1) && d - h < p) {
      if (h = Math.floor(h), d = Math.ceil(d), c > 0) {
        for (; h <= d; ++h)
          for (g = 1; g < n; ++g)
            if (v = h < 0 ? g / a(-h) : g * a(h), !(v < c)) {
              if (v > f) break;
              m.push(v);
            }
      } else for (; h <= d; ++h)
        for (g = n - 1; g >= 1; --g)
          if (v = h > 0 ? g / a(-h) : g * a(h), !(v < c)) {
            if (v > f) break;
            m.push(v);
          }
      m.length * 2 < p && (m = jc(c, f, p));
    } else
      m = jc(h, d, Math.min(d - h, p)).map(a);
    return l ? m.reverse() : m;
  }, t.tickFormat = (u, s) => {
    if (u == null && (u = 10), s == null && (s = n === 10 ? "s" : ","), typeof s != "function" && (!(n % 1) && (s = Vr(s)).precision == null && (s.trim = !0), s = Xl(s)), u === 1 / 0) return s;
    const c = Math.max(1, n * u / t.ticks().length);
    return (f) => {
      let l = f / a(Math.round(i(f)));
      return l * n < n - 0.5 && (l *= n), l <= c ? s(f) : "";
    };
  }, t.nice = () => r(Qm(r(), {
    floor: (u) => a(Math.floor(i(u))),
    ceil: (u) => a(Math.ceil(i(u)))
  })), t;
}
function eb() {
  const e = Vl(Hi()).domain([1, 10]);
  return e.copy = () => Sn(e, eb()).base(e.base()), Ue.apply(e, arguments), e;
}
function Pv(e) {
  return function(t) {
    return Math.sign(t) * Math.log1p(Math.abs(t / e));
  };
}
function Tv(e) {
  return function(t) {
    return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
  };
}
function Yl(e) {
  var t = 1, r = e(Pv(t), Tv(t));
  return r.constant = function(n) {
    return arguments.length ? e(Pv(t = +n), Tv(t)) : t;
  }, At(r);
}
function tb() {
  var e = Yl(Hi());
  return e.copy = function() {
    return Sn(e, tb()).constant(e.constant());
  }, Ue.apply(e, arguments);
}
function Ev(e) {
  return function(t) {
    return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
  };
}
function DS(e) {
  return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function NS(e) {
  return e < 0 ? -e * e : e * e;
}
function Zl(e) {
  var t = e(je, je), r = 1;
  function n() {
    return r === 1 ? e(je, je) : r === 0.5 ? e(DS, NS) : e(Ev(r), Ev(1 / r));
  }
  return t.exponent = function(i) {
    return arguments.length ? (r = +i, n()) : r;
  }, At(t);
}
function Jl() {
  var e = Zl(Hi());
  return e.copy = function() {
    return Sn(e, Jl()).exponent(e.exponent());
  }, Ue.apply(e, arguments), e;
}
function qS() {
  return Jl.apply(null, arguments).exponent(0.5);
}
function jv(e) {
  return Math.sign(e) * e * e;
}
function kS(e) {
  return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function rb() {
  var e = Gl(), t = [0, 1], r = !1, n;
  function i(a) {
    var o = kS(e(a));
    return isNaN(o) ? n : r ? Math.round(o) : o;
  }
  return i.invert = function(a) {
    return e.invert(jv(a));
  }, i.domain = function(a) {
    return arguments.length ? (e.domain(a), i) : e.domain();
  }, i.range = function(a) {
    return arguments.length ? (e.range((t = Array.from(a, ei)).map(jv)), i) : t.slice();
  }, i.rangeRound = function(a) {
    return i.range(a).round(!0);
  }, i.round = function(a) {
    return arguments.length ? (r = !!a, i) : r;
  }, i.clamp = function(a) {
    return arguments.length ? (e.clamp(a), i) : e.clamp();
  }, i.unknown = function(a) {
    return arguments.length ? (n = a, i) : n;
  }, i.copy = function() {
    return rb(e.domain(), t).round(r).clamp(e.clamp()).unknown(n);
  }, Ue.apply(i, arguments), At(i);
}
function nb() {
  var e = [], t = [], r = [], n;
  function i() {
    var o = 0, u = Math.max(1, t.length);
    for (r = new Array(u - 1); ++o < u; ) r[o - 1] = hS(e, o / u);
    return a;
  }
  function a(o) {
    return o == null || isNaN(o = +o) ? n : t[On(r, o)];
  }
  return a.invertExtent = function(o) {
    var u = t.indexOf(o);
    return u < 0 ? [NaN, NaN] : [
      u > 0 ? r[u - 1] : e[0],
      u < r.length ? r[u] : e[e.length - 1]
    ];
  }, a.domain = function(o) {
    if (!arguments.length) return e.slice();
    e = [];
    for (let u of o) u != null && !isNaN(u = +u) && e.push(u);
    return e.sort(wt), i();
  }, a.range = function(o) {
    return arguments.length ? (t = Array.from(o), i()) : t.slice();
  }, a.unknown = function(o) {
    return arguments.length ? (n = o, a) : n;
  }, a.quantiles = function() {
    return r.slice();
  }, a.copy = function() {
    return nb().domain(e).range(t).unknown(n);
  }, Ue.apply(a, arguments);
}
function ib() {
  var e = 0, t = 1, r = 1, n = [0.5], i = [0, 1], a;
  function o(s) {
    return s != null && s <= s ? i[On(n, s, 0, r)] : a;
  }
  function u() {
    var s = -1;
    for (n = new Array(r); ++s < r; ) n[s] = ((s + 1) * t - (s - r) * e) / (r + 1);
    return o;
  }
  return o.domain = function(s) {
    return arguments.length ? ([e, t] = s, e = +e, t = +t, u()) : [e, t];
  }, o.range = function(s) {
    return arguments.length ? (r = (i = Array.from(s)).length - 1, u()) : i.slice();
  }, o.invertExtent = function(s) {
    var c = i.indexOf(s);
    return c < 0 ? [NaN, NaN] : c < 1 ? [e, n[0]] : c >= r ? [n[r - 1], t] : [n[c - 1], n[c]];
  }, o.unknown = function(s) {
    return arguments.length && (a = s), o;
  }, o.thresholds = function() {
    return n.slice();
  }, o.copy = function() {
    return ib().domain([e, t]).range(i).unknown(a);
  }, Ue.apply(At(o), arguments);
}
function ab() {
  var e = [0.5], t = [0, 1], r, n = 1;
  function i(a) {
    return a != null && a <= a ? t[On(e, a, 0, n)] : r;
  }
  return i.domain = function(a) {
    return arguments.length ? (e = Array.from(a), n = Math.min(e.length, t.length - 1), i) : e.slice();
  }, i.range = function(a) {
    return arguments.length ? (t = Array.from(a), n = Math.min(e.length, t.length - 1), i) : t.slice();
  }, i.invertExtent = function(a) {
    var o = t.indexOf(a);
    return [e[o - 1], e[o]];
  }, i.unknown = function(a) {
    return arguments.length ? (r = a, i) : r;
  }, i.copy = function() {
    return ab().domain(e).range(t).unknown(r);
  }, Ue.apply(i, arguments);
}
const bs = /* @__PURE__ */ new Date(), ws = /* @__PURE__ */ new Date();
function _e(e, t, r, n) {
  function i(a) {
    return e(a = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+a)), a;
  }
  return i.floor = (a) => (e(a = /* @__PURE__ */ new Date(+a)), a), i.ceil = (a) => (e(a = new Date(a - 1)), t(a, 1), e(a), a), i.round = (a) => {
    const o = i(a), u = i.ceil(a);
    return a - o < u - a ? o : u;
  }, i.offset = (a, o) => (t(a = /* @__PURE__ */ new Date(+a), o == null ? 1 : Math.floor(o)), a), i.range = (a, o, u) => {
    const s = [];
    if (a = i.ceil(a), u = u == null ? 1 : Math.floor(u), !(a < o) || !(u > 0)) return s;
    let c;
    do
      s.push(c = /* @__PURE__ */ new Date(+a)), t(a, u), e(a);
    while (c < a && a < o);
    return s;
  }, i.filter = (a) => _e((o) => {
    if (o >= o) for (; e(o), !a(o); ) o.setTime(o - 1);
  }, (o, u) => {
    if (o >= o)
      if (u < 0) for (; ++u <= 0; )
        for (; t(o, -1), !a(o); )
          ;
      else for (; --u >= 0; )
        for (; t(o, 1), !a(o); )
          ;
  }), r && (i.count = (a, o) => (bs.setTime(+a), ws.setTime(+o), e(bs), e(ws), Math.floor(r(bs, ws))), i.every = (a) => (a = Math.floor(a), !isFinite(a) || !(a > 0) ? null : a > 1 ? i.filter(n ? (o) => n(o) % a === 0 : (o) => i.count(0, o) % a === 0) : i)), i;
}
const ii = _e(() => {
}, (e, t) => {
  e.setTime(+e + t);
}, (e, t) => t - e);
ii.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? _e((t) => {
  t.setTime(Math.floor(t / e) * e);
}, (t, r) => {
  t.setTime(+t + r * e);
}, (t, r) => (r - t) / e) : ii);
ii.range;
const ot = 1e3, Be = ot * 60, ut = Be * 60, lt = ut * 24, Ql = lt * 7, Mv = lt * 30, xs = lt * 365, Dt = _e((e) => {
  e.setTime(e - e.getMilliseconds());
}, (e, t) => {
  e.setTime(+e + t * ot);
}, (e, t) => (t - e) / ot, (e) => e.getUTCSeconds());
Dt.range;
const ef = _e((e) => {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * ot);
}, (e, t) => {
  e.setTime(+e + t * Be);
}, (e, t) => (t - e) / Be, (e) => e.getMinutes());
ef.range;
const tf = _e((e) => {
  e.setUTCSeconds(0, 0);
}, (e, t) => {
  e.setTime(+e + t * Be);
}, (e, t) => (t - e) / Be, (e) => e.getUTCMinutes());
tf.range;
const rf = _e((e) => {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * ot - e.getMinutes() * Be);
}, (e, t) => {
  e.setTime(+e + t * ut);
}, (e, t) => (t - e) / ut, (e) => e.getHours());
rf.range;
const nf = _e((e) => {
  e.setUTCMinutes(0, 0, 0);
}, (e, t) => {
  e.setTime(+e + t * ut);
}, (e, t) => (t - e) / ut, (e) => e.getUTCHours());
nf.range;
const An = _e(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * Be) / lt,
  (e) => e.getDate() - 1
);
An.range;
const Gi = _e((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / lt, (e) => e.getUTCDate() - 1);
Gi.range;
const ob = _e((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / lt, (e) => Math.floor(e / lt));
ob.range;
function Ht(e) {
  return _e((t) => {
    t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
  }, (t, r) => {
    t.setDate(t.getDate() + r * 7);
  }, (t, r) => (r - t - (r.getTimezoneOffset() - t.getTimezoneOffset()) * Be) / Ql);
}
const Ki = Ht(0), ai = Ht(1), LS = Ht(2), BS = Ht(3), sr = Ht(4), FS = Ht(5), US = Ht(6);
Ki.range;
ai.range;
LS.range;
BS.range;
sr.range;
FS.range;
US.range;
function Gt(e) {
  return _e((t) => {
    t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
  }, (t, r) => {
    t.setUTCDate(t.getUTCDate() + r * 7);
  }, (t, r) => (r - t) / Ql);
}
const Xi = Gt(0), oi = Gt(1), WS = Gt(2), zS = Gt(3), cr = Gt(4), HS = Gt(5), GS = Gt(6);
Xi.range;
oi.range;
WS.range;
zS.range;
cr.range;
HS.range;
GS.range;
const af = _e((e) => {
  e.setDate(1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setMonth(e.getMonth() + t);
}, (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12, (e) => e.getMonth());
af.range;
const of = _e((e) => {
  e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCMonth(e.getUTCMonth() + t);
}, (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12, (e) => e.getUTCMonth());
of.range;
const ft = _e((e) => {
  e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setFullYear(e.getFullYear() + t);
}, (e, t) => t.getFullYear() - e.getFullYear(), (e) => e.getFullYear());
ft.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : _e((t) => {
  t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, (t, r) => {
  t.setFullYear(t.getFullYear() + r * e);
});
ft.range;
const ht = _e((e) => {
  e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCFullYear(e.getUTCFullYear() + t);
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), (e) => e.getUTCFullYear());
ht.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : _e((t) => {
  t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, (t, r) => {
  t.setUTCFullYear(t.getUTCFullYear() + r * e);
});
ht.range;
function ub(e, t, r, n, i, a) {
  const o = [
    [Dt, 1, ot],
    [Dt, 5, 5 * ot],
    [Dt, 15, 15 * ot],
    [Dt, 30, 30 * ot],
    [a, 1, Be],
    [a, 5, 5 * Be],
    [a, 15, 15 * Be],
    [a, 30, 30 * Be],
    [i, 1, ut],
    [i, 3, 3 * ut],
    [i, 6, 6 * ut],
    [i, 12, 12 * ut],
    [n, 1, lt],
    [n, 2, 2 * lt],
    [r, 1, Ql],
    [t, 1, Mv],
    [t, 3, 3 * Mv],
    [e, 1, xs]
  ];
  function u(c, f, l) {
    const h = f < c;
    h && ([c, f] = [f, c]);
    const d = l && typeof l.range == "function" ? l : s(c, f, l), g = d ? d.range(c, +f + 1) : [];
    return h ? g.reverse() : g;
  }
  function s(c, f, l) {
    const h = Math.abs(f - c) / l, d = Wl(([, , p]) => p).right(o, h);
    if (d === o.length) return e.every(Cc(c / xs, f / xs, l));
    if (d === 0) return ii.every(Math.max(Cc(c, f, l), 1));
    const [g, v] = o[h / o[d - 1][2] < o[d][2] / h ? d - 1 : d];
    return g.every(v);
  }
  return [u, s];
}
const [KS, XS] = ub(ht, of, Xi, ob, nf, tf), [VS, YS] = ub(ft, af, Ki, An, rf, ef);
function _s(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return t.setFullYear(e.y), t;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function Os(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return t.setUTCFullYear(e.y), t;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function Tr(e, t, r) {
  return { y: e, m: t, d: r, H: 0, M: 0, S: 0, L: 0 };
}
function ZS(e) {
  var t = e.dateTime, r = e.date, n = e.time, i = e.periods, a = e.days, o = e.shortDays, u = e.months, s = e.shortMonths, c = Er(i), f = jr(i), l = Er(a), h = jr(a), d = Er(o), g = jr(o), v = Er(u), p = jr(u), m = Er(s), w = jr(s), x = {
    a: N,
    A: q,
    b: k,
    B: W,
    c: null,
    d: Nv,
    e: Nv,
    f: wA,
    g: MA,
    G: IA,
    H: gA,
    I: mA,
    j: bA,
    L: sb,
    m: xA,
    M: _A,
    p: H,
    q: F,
    Q: Lv,
    s: Bv,
    S: OA,
    u: SA,
    U: AA,
    V: PA,
    w: TA,
    W: EA,
    x: null,
    X: null,
    y: jA,
    Y: CA,
    Z: $A,
    "%": kv
  }, _ = {
    a: G,
    A: ae,
    b: pe,
    B: $e,
    c: null,
    d: qv,
    e: qv,
    f: qA,
    g: KA,
    G: VA,
    H: RA,
    I: DA,
    j: NA,
    L: lb,
    m: kA,
    M: LA,
    p: Et,
    q: Me,
    Q: Lv,
    s: Bv,
    S: BA,
    u: FA,
    U: UA,
    V: WA,
    w: zA,
    W: HA,
    x: null,
    X: null,
    y: GA,
    Y: XA,
    Z: YA,
    "%": kv
  }, y = {
    a: C,
    A: T,
    b: P,
    B: j,
    c: I,
    d: Rv,
    e: Rv,
    f: pA,
    g: $v,
    G: Iv,
    H: Dv,
    I: Dv,
    j: cA,
    L: hA,
    m: sA,
    M: lA,
    p: A,
    q: uA,
    Q: vA,
    s: yA,
    S: fA,
    u: rA,
    U: nA,
    V: iA,
    w: tA,
    W: aA,
    x: M,
    X: R,
    y: $v,
    Y: Iv,
    Z: oA,
    "%": dA
  };
  x.x = b(r, x), x.X = b(n, x), x.c = b(t, x), _.x = b(r, _), _.X = b(n, _), _.c = b(t, _);
  function b(L, K) {
    return function(X) {
      var D = [], fe = -1, Z = 0, ye = L.length, ge, Ce, yt;
      for (X instanceof Date || (X = /* @__PURE__ */ new Date(+X)); ++fe < ye; )
        L.charCodeAt(fe) === 37 && (D.push(L.slice(Z, fe)), (Ce = Cv[ge = L.charAt(++fe)]) != null ? ge = L.charAt(++fe) : Ce = ge === "e" ? " " : "0", (yt = K[ge]) && (ge = yt(X, Ce)), D.push(ge), Z = fe + 1);
      return D.push(L.slice(Z, fe)), D.join("");
    };
  }
  function O(L, K) {
    return function(X) {
      var D = Tr(1900, void 0, 1), fe = S(D, L, X += "", 0), Z, ye;
      if (fe != X.length) return null;
      if ("Q" in D) return new Date(D.Q);
      if ("s" in D) return new Date(D.s * 1e3 + ("L" in D ? D.L : 0));
      if (K && !("Z" in D) && (D.Z = 0), "p" in D && (D.H = D.H % 12 + D.p * 12), D.m === void 0 && (D.m = "q" in D ? D.q : 0), "V" in D) {
        if (D.V < 1 || D.V > 53) return null;
        "w" in D || (D.w = 1), "Z" in D ? (Z = Os(Tr(D.y, 0, 1)), ye = Z.getUTCDay(), Z = ye > 4 || ye === 0 ? oi.ceil(Z) : oi(Z), Z = Gi.offset(Z, (D.V - 1) * 7), D.y = Z.getUTCFullYear(), D.m = Z.getUTCMonth(), D.d = Z.getUTCDate() + (D.w + 6) % 7) : (Z = _s(Tr(D.y, 0, 1)), ye = Z.getDay(), Z = ye > 4 || ye === 0 ? ai.ceil(Z) : ai(Z), Z = An.offset(Z, (D.V - 1) * 7), D.y = Z.getFullYear(), D.m = Z.getMonth(), D.d = Z.getDate() + (D.w + 6) % 7);
      } else ("W" in D || "U" in D) && ("w" in D || (D.w = "u" in D ? D.u % 7 : "W" in D ? 1 : 0), ye = "Z" in D ? Os(Tr(D.y, 0, 1)).getUTCDay() : _s(Tr(D.y, 0, 1)).getDay(), D.m = 0, D.d = "W" in D ? (D.w + 6) % 7 + D.W * 7 - (ye + 5) % 7 : D.w + D.U * 7 - (ye + 6) % 7);
      return "Z" in D ? (D.H += D.Z / 100 | 0, D.M += D.Z % 100, Os(D)) : _s(D);
    };
  }
  function S(L, K, X, D) {
    for (var fe = 0, Z = K.length, ye = X.length, ge, Ce; fe < Z; ) {
      if (D >= ye) return -1;
      if (ge = K.charCodeAt(fe++), ge === 37) {
        if (ge = K.charAt(fe++), Ce = y[ge in Cv ? K.charAt(fe++) : ge], !Ce || (D = Ce(L, X, D)) < 0) return -1;
      } else if (ge != X.charCodeAt(D++))
        return -1;
    }
    return D;
  }
  function A(L, K, X) {
    var D = c.exec(K.slice(X));
    return D ? (L.p = f.get(D[0].toLowerCase()), X + D[0].length) : -1;
  }
  function C(L, K, X) {
    var D = d.exec(K.slice(X));
    return D ? (L.w = g.get(D[0].toLowerCase()), X + D[0].length) : -1;
  }
  function T(L, K, X) {
    var D = l.exec(K.slice(X));
    return D ? (L.w = h.get(D[0].toLowerCase()), X + D[0].length) : -1;
  }
  function P(L, K, X) {
    var D = m.exec(K.slice(X));
    return D ? (L.m = w.get(D[0].toLowerCase()), X + D[0].length) : -1;
  }
  function j(L, K, X) {
    var D = v.exec(K.slice(X));
    return D ? (L.m = p.get(D[0].toLowerCase()), X + D[0].length) : -1;
  }
  function I(L, K, X) {
    return S(L, t, K, X);
  }
  function M(L, K, X) {
    return S(L, r, K, X);
  }
  function R(L, K, X) {
    return S(L, n, K, X);
  }
  function N(L) {
    return o[L.getDay()];
  }
  function q(L) {
    return a[L.getDay()];
  }
  function k(L) {
    return s[L.getMonth()];
  }
  function W(L) {
    return u[L.getMonth()];
  }
  function H(L) {
    return i[+(L.getHours() >= 12)];
  }
  function F(L) {
    return 1 + ~~(L.getMonth() / 3);
  }
  function G(L) {
    return o[L.getUTCDay()];
  }
  function ae(L) {
    return a[L.getUTCDay()];
  }
  function pe(L) {
    return s[L.getUTCMonth()];
  }
  function $e(L) {
    return u[L.getUTCMonth()];
  }
  function Et(L) {
    return i[+(L.getUTCHours() >= 12)];
  }
  function Me(L) {
    return 1 + ~~(L.getUTCMonth() / 3);
  }
  return {
    format: function(L) {
      var K = b(L += "", x);
      return K.toString = function() {
        return L;
      }, K;
    },
    parse: function(L) {
      var K = O(L += "", !1);
      return K.toString = function() {
        return L;
      }, K;
    },
    utcFormat: function(L) {
      var K = b(L += "", _);
      return K.toString = function() {
        return L;
      }, K;
    },
    utcParse: function(L) {
      var K = O(L += "", !0);
      return K.toString = function() {
        return L;
      }, K;
    }
  };
}
var Cv = { "-": "", _: " ", 0: "0" }, Se = /^\s*\d+/, JS = /^%/, QS = /[\\^$*+?|[\]().{}]/g;
function Q(e, t, r) {
  var n = e < 0 ? "-" : "", i = (n ? -e : e) + "", a = i.length;
  return n + (a < r ? new Array(r - a + 1).join(t) + i : i);
}
function eA(e) {
  return e.replace(QS, "\\$&");
}
function Er(e) {
  return new RegExp("^(?:" + e.map(eA).join("|") + ")", "i");
}
function jr(e) {
  return new Map(e.map((t, r) => [t.toLowerCase(), r]));
}
function tA(e, t, r) {
  var n = Se.exec(t.slice(r, r + 1));
  return n ? (e.w = +n[0], r + n[0].length) : -1;
}
function rA(e, t, r) {
  var n = Se.exec(t.slice(r, r + 1));
  return n ? (e.u = +n[0], r + n[0].length) : -1;
}
function nA(e, t, r) {
  var n = Se.exec(t.slice(r, r + 2));
  return n ? (e.U = +n[0], r + n[0].length) : -1;
}
function iA(e, t, r) {
  var n = Se.exec(t.slice(r, r + 2));
  return n ? (e.V = +n[0], r + n[0].length) : -1;
}
function aA(e, t, r) {
  var n = Se.exec(t.slice(r, r + 2));
  return n ? (e.W = +n[0], r + n[0].length) : -1;
}
function Iv(e, t, r) {
  var n = Se.exec(t.slice(r, r + 4));
  return n ? (e.y = +n[0], r + n[0].length) : -1;
}
function $v(e, t, r) {
  var n = Se.exec(t.slice(r, r + 2));
  return n ? (e.y = +n[0] + (+n[0] > 68 ? 1900 : 2e3), r + n[0].length) : -1;
}
function oA(e, t, r) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(r, r + 6));
  return n ? (e.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), r + n[0].length) : -1;
}
function uA(e, t, r) {
  var n = Se.exec(t.slice(r, r + 1));
  return n ? (e.q = n[0] * 3 - 3, r + n[0].length) : -1;
}
function sA(e, t, r) {
  var n = Se.exec(t.slice(r, r + 2));
  return n ? (e.m = n[0] - 1, r + n[0].length) : -1;
}
function Rv(e, t, r) {
  var n = Se.exec(t.slice(r, r + 2));
  return n ? (e.d = +n[0], r + n[0].length) : -1;
}
function cA(e, t, r) {
  var n = Se.exec(t.slice(r, r + 3));
  return n ? (e.m = 0, e.d = +n[0], r + n[0].length) : -1;
}
function Dv(e, t, r) {
  var n = Se.exec(t.slice(r, r + 2));
  return n ? (e.H = +n[0], r + n[0].length) : -1;
}
function lA(e, t, r) {
  var n = Se.exec(t.slice(r, r + 2));
  return n ? (e.M = +n[0], r + n[0].length) : -1;
}
function fA(e, t, r) {
  var n = Se.exec(t.slice(r, r + 2));
  return n ? (e.S = +n[0], r + n[0].length) : -1;
}
function hA(e, t, r) {
  var n = Se.exec(t.slice(r, r + 3));
  return n ? (e.L = +n[0], r + n[0].length) : -1;
}
function pA(e, t, r) {
  var n = Se.exec(t.slice(r, r + 6));
  return n ? (e.L = Math.floor(n[0] / 1e3), r + n[0].length) : -1;
}
function dA(e, t, r) {
  var n = JS.exec(t.slice(r, r + 1));
  return n ? r + n[0].length : -1;
}
function vA(e, t, r) {
  var n = Se.exec(t.slice(r));
  return n ? (e.Q = +n[0], r + n[0].length) : -1;
}
function yA(e, t, r) {
  var n = Se.exec(t.slice(r));
  return n ? (e.s = +n[0], r + n[0].length) : -1;
}
function Nv(e, t) {
  return Q(e.getDate(), t, 2);
}
function gA(e, t) {
  return Q(e.getHours(), t, 2);
}
function mA(e, t) {
  return Q(e.getHours() % 12 || 12, t, 2);
}
function bA(e, t) {
  return Q(1 + An.count(ft(e), e), t, 3);
}
function sb(e, t) {
  return Q(e.getMilliseconds(), t, 3);
}
function wA(e, t) {
  return sb(e, t) + "000";
}
function xA(e, t) {
  return Q(e.getMonth() + 1, t, 2);
}
function _A(e, t) {
  return Q(e.getMinutes(), t, 2);
}
function OA(e, t) {
  return Q(e.getSeconds(), t, 2);
}
function SA(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function AA(e, t) {
  return Q(Ki.count(ft(e) - 1, e), t, 2);
}
function cb(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? sr(e) : sr.ceil(e);
}
function PA(e, t) {
  return e = cb(e), Q(sr.count(ft(e), e) + (ft(e).getDay() === 4), t, 2);
}
function TA(e) {
  return e.getDay();
}
function EA(e, t) {
  return Q(ai.count(ft(e) - 1, e), t, 2);
}
function jA(e, t) {
  return Q(e.getFullYear() % 100, t, 2);
}
function MA(e, t) {
  return e = cb(e), Q(e.getFullYear() % 100, t, 2);
}
function CA(e, t) {
  return Q(e.getFullYear() % 1e4, t, 4);
}
function IA(e, t) {
  var r = e.getDay();
  return e = r >= 4 || r === 0 ? sr(e) : sr.ceil(e), Q(e.getFullYear() % 1e4, t, 4);
}
function $A(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : (t *= -1, "+")) + Q(t / 60 | 0, "0", 2) + Q(t % 60, "0", 2);
}
function qv(e, t) {
  return Q(e.getUTCDate(), t, 2);
}
function RA(e, t) {
  return Q(e.getUTCHours(), t, 2);
}
function DA(e, t) {
  return Q(e.getUTCHours() % 12 || 12, t, 2);
}
function NA(e, t) {
  return Q(1 + Gi.count(ht(e), e), t, 3);
}
function lb(e, t) {
  return Q(e.getUTCMilliseconds(), t, 3);
}
function qA(e, t) {
  return lb(e, t) + "000";
}
function kA(e, t) {
  return Q(e.getUTCMonth() + 1, t, 2);
}
function LA(e, t) {
  return Q(e.getUTCMinutes(), t, 2);
}
function BA(e, t) {
  return Q(e.getUTCSeconds(), t, 2);
}
function FA(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function UA(e, t) {
  return Q(Xi.count(ht(e) - 1, e), t, 2);
}
function fb(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? cr(e) : cr.ceil(e);
}
function WA(e, t) {
  return e = fb(e), Q(cr.count(ht(e), e) + (ht(e).getUTCDay() === 4), t, 2);
}
function zA(e) {
  return e.getUTCDay();
}
function HA(e, t) {
  return Q(oi.count(ht(e) - 1, e), t, 2);
}
function GA(e, t) {
  return Q(e.getUTCFullYear() % 100, t, 2);
}
function KA(e, t) {
  return e = fb(e), Q(e.getUTCFullYear() % 100, t, 2);
}
function XA(e, t) {
  return Q(e.getUTCFullYear() % 1e4, t, 4);
}
function VA(e, t) {
  var r = e.getUTCDay();
  return e = r >= 4 || r === 0 ? cr(e) : cr.ceil(e), Q(e.getUTCFullYear() % 1e4, t, 4);
}
function YA() {
  return "+0000";
}
function kv() {
  return "%";
}
function Lv(e) {
  return +e;
}
function Bv(e) {
  return Math.floor(+e / 1e3);
}
var Zt, hb, pb;
ZA({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function ZA(e) {
  return Zt = ZS(e), hb = Zt.format, Zt.parse, pb = Zt.utcFormat, Zt.utcParse, Zt;
}
function JA(e) {
  return new Date(e);
}
function QA(e) {
  return e instanceof Date ? +e : +/* @__PURE__ */ new Date(+e);
}
function uf(e, t, r, n, i, a, o, u, s, c) {
  var f = Gl(), l = f.invert, h = f.domain, d = c(".%L"), g = c(":%S"), v = c("%I:%M"), p = c("%I %p"), m = c("%a %d"), w = c("%b %d"), x = c("%B"), _ = c("%Y");
  function y(b) {
    return (s(b) < b ? d : u(b) < b ? g : o(b) < b ? v : a(b) < b ? p : n(b) < b ? i(b) < b ? m : w : r(b) < b ? x : _)(b);
  }
  return f.invert = function(b) {
    return new Date(l(b));
  }, f.domain = function(b) {
    return arguments.length ? h(Array.from(b, QA)) : h().map(JA);
  }, f.ticks = function(b) {
    var O = h();
    return e(O[0], O[O.length - 1], b ?? 10);
  }, f.tickFormat = function(b, O) {
    return O == null ? y : c(O);
  }, f.nice = function(b) {
    var O = h();
    return (!b || typeof b.range != "function") && (b = t(O[0], O[O.length - 1], b ?? 10)), b ? h(Qm(O, b)) : f;
  }, f.copy = function() {
    return Sn(f, uf(e, t, r, n, i, a, o, u, s, c));
  }, f;
}
function eP() {
  return Ue.apply(uf(VS, YS, ft, af, Ki, An, rf, ef, Dt, hb).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
function tP() {
  return Ue.apply(uf(KS, XS, ht, of, Xi, Gi, nf, tf, Dt, pb).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
function Vi() {
  var e = 0, t = 1, r, n, i, a, o = je, u = !1, s;
  function c(l) {
    return l == null || isNaN(l = +l) ? s : o(i === 0 ? 0.5 : (l = (a(l) - r) * i, u ? Math.max(0, Math.min(1, l)) : l));
  }
  c.domain = function(l) {
    return arguments.length ? ([e, t] = l, r = a(e = +e), n = a(t = +t), i = r === n ? 0 : 1 / (n - r), c) : [e, t];
  }, c.clamp = function(l) {
    return arguments.length ? (u = !!l, c) : u;
  }, c.interpolator = function(l) {
    return arguments.length ? (o = l, c) : o;
  };
  function f(l) {
    return function(h) {
      var d, g;
      return arguments.length ? ([d, g] = h, o = l(d, g), c) : [o(0), o(1)];
    };
  }
  return c.range = f(Mi), c.rangeRound = f(Hl), c.unknown = function(l) {
    return arguments.length ? (s = l, c) : s;
  }, function(l) {
    return a = l, r = l(e), n = l(t), i = r === n ? 0 : 1 / (n - r), c;
  };
}
function Pt(e, t) {
  return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function db() {
  var e = At(Vi()(je));
  return e.copy = function() {
    return Pt(e, db());
  }, vt.apply(e, arguments);
}
function vb() {
  var e = Vl(Vi()).domain([1, 10]);
  return e.copy = function() {
    return Pt(e, vb()).base(e.base());
  }, vt.apply(e, arguments);
}
function yb() {
  var e = Yl(Vi());
  return e.copy = function() {
    return Pt(e, yb()).constant(e.constant());
  }, vt.apply(e, arguments);
}
function sf() {
  var e = Zl(Vi());
  return e.copy = function() {
    return Pt(e, sf()).exponent(e.exponent());
  }, vt.apply(e, arguments);
}
function rP() {
  return sf.apply(null, arguments).exponent(0.5);
}
function gb() {
  var e = [], t = je;
  function r(n) {
    if (n != null && !isNaN(n = +n)) return t((On(e, n, 1) - 1) / (e.length - 1));
  }
  return r.domain = function(n) {
    if (!arguments.length) return e.slice();
    e = [];
    for (let i of n) i != null && !isNaN(i = +i) && e.push(i);
    return e.sort(wt), r;
  }, r.interpolator = function(n) {
    return arguments.length ? (t = n, r) : t;
  }, r.range = function() {
    return e.map((n, i) => t(i / (e.length - 1)));
  }, r.quantiles = function(n) {
    return Array.from({ length: n + 1 }, (i, a) => fS(e, a / n));
  }, r.copy = function() {
    return gb(t).domain(e);
  }, vt.apply(r, arguments);
}
function Yi() {
  var e = 0, t = 0.5, r = 1, n = 1, i, a, o, u, s, c = je, f, l = !1, h;
  function d(v) {
    return isNaN(v = +v) ? h : (v = 0.5 + ((v = +f(v)) - a) * (n * v < n * a ? u : s), c(l ? Math.max(0, Math.min(1, v)) : v));
  }
  d.domain = function(v) {
    return arguments.length ? ([e, t, r] = v, i = f(e = +e), a = f(t = +t), o = f(r = +r), u = i === a ? 0 : 0.5 / (a - i), s = a === o ? 0 : 0.5 / (o - a), n = a < i ? -1 : 1, d) : [e, t, r];
  }, d.clamp = function(v) {
    return arguments.length ? (l = !!v, d) : l;
  }, d.interpolator = function(v) {
    return arguments.length ? (c = v, d) : c;
  };
  function g(v) {
    return function(p) {
      var m, w, x;
      return arguments.length ? ([m, w, x] = p, c = dS(v, [m, w, x]), d) : [c(0), c(0.5), c(1)];
    };
  }
  return d.range = g(Mi), d.rangeRound = g(Hl), d.unknown = function(v) {
    return arguments.length ? (h = v, d) : h;
  }, function(v) {
    return f = v, i = v(e), a = v(t), o = v(r), u = i === a ? 0 : 0.5 / (a - i), s = a === o ? 0 : 0.5 / (o - a), n = a < i ? -1 : 1, d;
  };
}
function mb() {
  var e = At(Yi()(je));
  return e.copy = function() {
    return Pt(e, mb());
  }, vt.apply(e, arguments);
}
function bb() {
  var e = Vl(Yi()).domain([0.1, 1, 10]);
  return e.copy = function() {
    return Pt(e, bb()).base(e.base());
  }, vt.apply(e, arguments);
}
function wb() {
  var e = Yl(Yi());
  return e.copy = function() {
    return Pt(e, wb()).constant(e.constant());
  }, vt.apply(e, arguments);
}
function cf() {
  var e = Zl(Yi());
  return e.copy = function() {
    return Pt(e, cf()).exponent(e.exponent());
  }, vt.apply(e, arguments);
}
function nP() {
  return cf.apply(null, arguments).exponent(0.5);
}
const Fv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  scaleBand: Xr,
  scaleDiverging: mb,
  scaleDivergingLog: bb,
  scaleDivergingPow: cf,
  scaleDivergingSqrt: nP,
  scaleDivergingSymlog: wb,
  scaleIdentity: Jm,
  scaleImplicit: Ic,
  scaleLinear: ni,
  scaleLog: eb,
  scaleOrdinal: zl,
  scalePoint: kr,
  scalePow: Jl,
  scaleQuantile: nb,
  scaleQuantize: ib,
  scaleRadial: rb,
  scaleSequential: db,
  scaleSequentialLog: vb,
  scaleSequentialPow: sf,
  scaleSequentialQuantile: gb,
  scaleSequentialSqrt: rP,
  scaleSequentialSymlog: yb,
  scaleSqrt: qS,
  scaleSymlog: tb,
  scaleThreshold: ab,
  scaleTime: eP,
  scaleUtc: tP,
  tickFormat: Zm
}, Symbol.toStringTag, { value: "Module" }));
var Ss, Uv;
function xb() {
  if (Uv) return Ss;
  Uv = 1;
  var e = wr();
  function t(r, n, i) {
    for (var a = -1, o = r.length; ++a < o; ) {
      var u = r[a], s = n(u);
      if (s != null && (c === void 0 ? s === s && !e(s) : i(s, c)))
        var c = s, f = u;
    }
    return f;
  }
  return Ss = t, Ss;
}
var As, Wv;
function iP() {
  if (Wv) return As;
  Wv = 1;
  function e(t, r) {
    return t > r;
  }
  return As = e, As;
}
var Ps, zv;
function aP() {
  if (zv) return Ps;
  zv = 1;
  var e = xb(), t = iP(), r = _r();
  function n(i) {
    return i && i.length ? e(i, r, t) : void 0;
  }
  return Ps = n, Ps;
}
var oP = aP();
const Zi = /* @__PURE__ */ ce(oP);
var Ts, Hv;
function uP() {
  if (Hv) return Ts;
  Hv = 1;
  function e(t, r) {
    return t < r;
  }
  return Ts = e, Ts;
}
var Es, Gv;
function sP() {
  if (Gv) return Es;
  Gv = 1;
  var e = xb(), t = uP(), r = _r();
  function n(i) {
    return i && i.length ? e(i, r, t) : void 0;
  }
  return Es = n, Es;
}
var cP = sP();
const Ji = /* @__PURE__ */ ce(cP);
var js, Kv;
function lP() {
  if (Kv) return js;
  Kv = 1;
  var e = Pl(), t = St(), r = $m(), n = Ie();
  function i(a, o) {
    var u = n(a) ? e : r;
    return u(a, t(o, 3));
  }
  return js = i, js;
}
var Ms, Xv;
function fP() {
  if (Xv) return Ms;
  Xv = 1;
  var e = Cm(), t = lP();
  function r(n, i) {
    return e(t(n, i), 1);
  }
  return Ms = r, Ms;
}
var hP = fP();
const pP = /* @__PURE__ */ ce(hP);
var Cs, Vv;
function dP() {
  if (Vv) return Cs;
  Vv = 1;
  var e = Ll();
  function t(r, n) {
    return e(r, n);
  }
  return Cs = t, Cs;
}
var vP = dP();
const lf = /* @__PURE__ */ ce(vP);
var Or = 1e9, yP = {
  // These values must be integers within the stated ranges (inclusive).
  // Most of these values can be changed during run-time using `Decimal.config`.
  // The maximum number of significant digits of the result of a calculation or base conversion.
  // E.g. `Decimal.config({ precision: 20 });`
  precision: 20,
  // 1 to MAX_DIGITS
  // The rounding mode used by default by `toInteger`, `toDecimalPlaces`, `toExponential`,
  // `toFixed`, `toPrecision` and `toSignificantDigits`.
  //
  // ROUND_UP         0 Away from zero.
  // ROUND_DOWN       1 Towards zero.
  // ROUND_CEIL       2 Towards +Infinity.
  // ROUND_FLOOR      3 Towards -Infinity.
  // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
  // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
  // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
  // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
  // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
  //
  // E.g.
  // `Decimal.rounding = 4;`
  // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
  rounding: 4,
  // 0 to 8
  // The exponent value at and beneath which `toString` returns exponential notation.
  // JavaScript numbers: -7
  toExpNeg: -7,
  // 0 to -MAX_E
  // The exponent value at and above which `toString` returns exponential notation.
  // JavaScript numbers: 21
  toExpPos: 21,
  // 0 to MAX_E
  // The natural logarithm of 10.
  // 115 digits
  LN10: "2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286"
}, hf, le = !0, Fe = "[DecimalError] ", kt = Fe + "Invalid argument: ", ff = Fe + "Exponent out of range: ", Sr = Math.floor, $t = Math.pow, gP = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, Ne, Oe = 1e7, oe = 7, _b = 9007199254740991, ui = Sr(_b / oe), U = {};
U.absoluteValue = U.abs = function() {
  var e = new this.constructor(this);
  return e.s && (e.s = 1), e;
};
U.comparedTo = U.cmp = function(e) {
  var t, r, n, i, a = this;
  if (e = new a.constructor(e), a.s !== e.s) return a.s || -e.s;
  if (a.e !== e.e) return a.e > e.e ^ a.s < 0 ? 1 : -1;
  for (n = a.d.length, i = e.d.length, t = 0, r = n < i ? n : i; t < r; ++t)
    if (a.d[t] !== e.d[t]) return a.d[t] > e.d[t] ^ a.s < 0 ? 1 : -1;
  return n === i ? 0 : n > i ^ a.s < 0 ? 1 : -1;
};
U.decimalPlaces = U.dp = function() {
  var e = this, t = e.d.length - 1, r = (t - e.e) * oe;
  if (t = e.d[t], t) for (; t % 10 == 0; t /= 10) r--;
  return r < 0 ? 0 : r;
};
U.dividedBy = U.div = function(e) {
  return ct(this, new this.constructor(e));
};
U.dividedToIntegerBy = U.idiv = function(e) {
  var t = this, r = t.constructor;
  return ne(ct(t, new r(e), 0, 1), r.precision);
};
U.equals = U.eq = function(e) {
  return !this.cmp(e);
};
U.exponent = function() {
  return ve(this);
};
U.greaterThan = U.gt = function(e) {
  return this.cmp(e) > 0;
};
U.greaterThanOrEqualTo = U.gte = function(e) {
  return this.cmp(e) >= 0;
};
U.isInteger = U.isint = function() {
  return this.e > this.d.length - 2;
};
U.isNegative = U.isneg = function() {
  return this.s < 0;
};
U.isPositive = U.ispos = function() {
  return this.s > 0;
};
U.isZero = function() {
  return this.s === 0;
};
U.lessThan = U.lt = function(e) {
  return this.cmp(e) < 0;
};
U.lessThanOrEqualTo = U.lte = function(e) {
  return this.cmp(e) < 1;
};
U.logarithm = U.log = function(e) {
  var t, r = this, n = r.constructor, i = n.precision, a = i + 5;
  if (e === void 0)
    e = new n(10);
  else if (e = new n(e), e.s < 1 || e.eq(Ne)) throw Error(Fe + "NaN");
  if (r.s < 1) throw Error(Fe + (r.s ? "NaN" : "-Infinity"));
  return r.eq(Ne) ? new n(0) : (le = !1, t = ct(Yr(r, a), Yr(e, a), a), le = !0, ne(t, i));
};
U.minus = U.sub = function(e) {
  var t = this;
  return e = new t.constructor(e), t.s == e.s ? Ab(t, e) : Ob(t, (e.s = -e.s, e));
};
U.modulo = U.mod = function(e) {
  var t, r = this, n = r.constructor, i = n.precision;
  if (e = new n(e), !e.s) throw Error(Fe + "NaN");
  return r.s ? (le = !1, t = ct(r, e, 0, 1).times(e), le = !0, r.minus(t)) : ne(new n(r), i);
};
U.naturalExponential = U.exp = function() {
  return Sb(this);
};
U.naturalLogarithm = U.ln = function() {
  return Yr(this);
};
U.negated = U.neg = function() {
  var e = new this.constructor(this);
  return e.s = -e.s || 0, e;
};
U.plus = U.add = function(e) {
  var t = this;
  return e = new t.constructor(e), t.s == e.s ? Ob(t, e) : Ab(t, (e.s = -e.s, e));
};
U.precision = U.sd = function(e) {
  var t, r, n, i = this;
  if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(kt + e);
  if (t = ve(i) + 1, n = i.d.length - 1, r = n * oe + 1, n = i.d[n], n) {
    for (; n % 10 == 0; n /= 10) r--;
    for (n = i.d[0]; n >= 10; n /= 10) r++;
  }
  return e && t > r ? t : r;
};
U.squareRoot = U.sqrt = function() {
  var e, t, r, n, i, a, o, u = this, s = u.constructor;
  if (u.s < 1) {
    if (!u.s) return new s(0);
    throw Error(Fe + "NaN");
  }
  for (e = ve(u), le = !1, i = Math.sqrt(+u), i == 0 || i == 1 / 0 ? (t = Je(u.d), (t.length + e) % 2 == 0 && (t += "0"), i = Math.sqrt(t), e = Sr((e + 1) / 2) - (e < 0 || e % 2), i == 1 / 0 ? t = "5e" + e : (t = i.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + e), n = new s(t)) : n = new s(i.toString()), r = s.precision, i = o = r + 3; ; )
    if (a = n, n = a.plus(ct(u, a, o + 2)).times(0.5), Je(a.d).slice(0, o) === (t = Je(n.d)).slice(0, o)) {
      if (t = t.slice(o - 3, o + 1), i == o && t == "4999") {
        if (ne(a, r + 1, 0), a.times(a).eq(u)) {
          n = a;
          break;
        }
      } else if (t != "9999")
        break;
      o += 4;
    }
  return le = !0, ne(n, r);
};
U.times = U.mul = function(e) {
  var t, r, n, i, a, o, u, s, c, f = this, l = f.constructor, h = f.d, d = (e = new l(e)).d;
  if (!f.s || !e.s) return new l(0);
  for (e.s *= f.s, r = f.e + e.e, s = h.length, c = d.length, s < c && (a = h, h = d, d = a, o = s, s = c, c = o), a = [], o = s + c, n = o; n--; ) a.push(0);
  for (n = c; --n >= 0; ) {
    for (t = 0, i = s + n; i > n; )
      u = a[i] + d[n] * h[i - n - 1] + t, a[i--] = u % Oe | 0, t = u / Oe | 0;
    a[i] = (a[i] + t) % Oe | 0;
  }
  for (; !a[--o]; ) a.pop();
  return t ? ++r : a.shift(), e.d = a, e.e = r, le ? ne(e, l.precision) : e;
};
U.toDecimalPlaces = U.todp = function(e, t) {
  var r = this, n = r.constructor;
  return r = new n(r), e === void 0 ? r : (tt(e, 0, Or), t === void 0 ? t = n.rounding : tt(t, 0, 8), ne(r, e + ve(r) + 1, t));
};
U.toExponential = function(e, t) {
  var r, n = this, i = n.constructor;
  return e === void 0 ? r = Ft(n, !0) : (tt(e, 0, Or), t === void 0 ? t = i.rounding : tt(t, 0, 8), n = ne(new i(n), e + 1, t), r = Ft(n, !0, e + 1)), r;
};
U.toFixed = function(e, t) {
  var r, n, i = this, a = i.constructor;
  return e === void 0 ? Ft(i) : (tt(e, 0, Or), t === void 0 ? t = a.rounding : tt(t, 0, 8), n = ne(new a(i), e + ve(i) + 1, t), r = Ft(n.abs(), !1, e + ve(n) + 1), i.isneg() && !i.isZero() ? "-" + r : r);
};
U.toInteger = U.toint = function() {
  var e = this, t = e.constructor;
  return ne(new t(e), ve(e) + 1, t.rounding);
};
U.toNumber = function() {
  return +this;
};
U.toPower = U.pow = function(e) {
  var t, r, n, i, a, o, u = this, s = u.constructor, c = 12, f = +(e = new s(e));
  if (!e.s) return new s(Ne);
  if (u = new s(u), !u.s) {
    if (e.s < 1) throw Error(Fe + "Infinity");
    return u;
  }
  if (u.eq(Ne)) return u;
  if (n = s.precision, e.eq(Ne)) return ne(u, n);
  if (t = e.e, r = e.d.length - 1, o = t >= r, a = u.s, o) {
    if ((r = f < 0 ? -f : f) <= _b) {
      for (i = new s(Ne), t = Math.ceil(n / oe + 4), le = !1; r % 2 && (i = i.times(u), Zv(i.d, t)), r = Sr(r / 2), r !== 0; )
        u = u.times(u), Zv(u.d, t);
      return le = !0, e.s < 0 ? new s(Ne).div(i) : ne(i, n);
    }
  } else if (a < 0) throw Error(Fe + "NaN");
  return a = a < 0 && e.d[Math.max(t, r)] & 1 ? -1 : 1, u.s = 1, le = !1, i = e.times(Yr(u, n + c)), le = !0, i = Sb(i), i.s = a, i;
};
U.toPrecision = function(e, t) {
  var r, n, i = this, a = i.constructor;
  return e === void 0 ? (r = ve(i), n = Ft(i, r <= a.toExpNeg || r >= a.toExpPos)) : (tt(e, 1, Or), t === void 0 ? t = a.rounding : tt(t, 0, 8), i = ne(new a(i), e, t), r = ve(i), n = Ft(i, e <= r || r <= a.toExpNeg, e)), n;
};
U.toSignificantDigits = U.tosd = function(e, t) {
  var r = this, n = r.constructor;
  return e === void 0 ? (e = n.precision, t = n.rounding) : (tt(e, 1, Or), t === void 0 ? t = n.rounding : tt(t, 0, 8)), ne(new n(r), e, t);
};
U.toString = U.valueOf = U.val = U.toJSON = U[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")] = function() {
  var e = this, t = ve(e), r = e.constructor;
  return Ft(e, t <= r.toExpNeg || t >= r.toExpPos);
};
function Ob(e, t) {
  var r, n, i, a, o, u, s, c, f = e.constructor, l = f.precision;
  if (!e.s || !t.s)
    return t.s || (t = new f(e)), le ? ne(t, l) : t;
  if (s = e.d, c = t.d, o = e.e, i = t.e, s = s.slice(), a = o - i, a) {
    for (a < 0 ? (n = s, a = -a, u = c.length) : (n = c, i = o, u = s.length), o = Math.ceil(l / oe), u = o > u ? o + 1 : u + 1, a > u && (a = u, n.length = 1), n.reverse(); a--; ) n.push(0);
    n.reverse();
  }
  for (u = s.length, a = c.length, u - a < 0 && (a = u, n = c, c = s, s = n), r = 0; a; )
    r = (s[--a] = s[a] + c[a] + r) / Oe | 0, s[a] %= Oe;
  for (r && (s.unshift(r), ++i), u = s.length; s[--u] == 0; ) s.pop();
  return t.d = s, t.e = i, le ? ne(t, l) : t;
}
function tt(e, t, r) {
  if (e !== ~~e || e < t || e > r)
    throw Error(kt + e);
}
function Je(e) {
  var t, r, n, i = e.length - 1, a = "", o = e[0];
  if (i > 0) {
    for (a += o, t = 1; t < i; t++)
      n = e[t] + "", r = oe - n.length, r && (a += gt(r)), a += n;
    o = e[t], n = o + "", r = oe - n.length, r && (a += gt(r));
  } else if (o === 0)
    return "0";
  for (; o % 10 === 0; ) o /= 10;
  return a + o;
}
var ct = /* @__PURE__ */ (function() {
  function e(n, i) {
    var a, o = 0, u = n.length;
    for (n = n.slice(); u--; )
      a = n[u] * i + o, n[u] = a % Oe | 0, o = a / Oe | 0;
    return o && n.unshift(o), n;
  }
  function t(n, i, a, o) {
    var u, s;
    if (a != o)
      s = a > o ? 1 : -1;
    else
      for (u = s = 0; u < a; u++)
        if (n[u] != i[u]) {
          s = n[u] > i[u] ? 1 : -1;
          break;
        }
    return s;
  }
  function r(n, i, a) {
    for (var o = 0; a--; )
      n[a] -= o, o = n[a] < i[a] ? 1 : 0, n[a] = o * Oe + n[a] - i[a];
    for (; !n[0] && n.length > 1; ) n.shift();
  }
  return function(n, i, a, o) {
    var u, s, c, f, l, h, d, g, v, p, m, w, x, _, y, b, O, S, A = n.constructor, C = n.s == i.s ? 1 : -1, T = n.d, P = i.d;
    if (!n.s) return new A(n);
    if (!i.s) throw Error(Fe + "Division by zero");
    for (s = n.e - i.e, O = P.length, y = T.length, d = new A(C), g = d.d = [], c = 0; P[c] == (T[c] || 0); ) ++c;
    if (P[c] > (T[c] || 0) && --s, a == null ? w = a = A.precision : o ? w = a + (ve(n) - ve(i)) + 1 : w = a, w < 0) return new A(0);
    if (w = w / oe + 2 | 0, c = 0, O == 1)
      for (f = 0, P = P[0], w++; (c < y || f) && w--; c++)
        x = f * Oe + (T[c] || 0), g[c] = x / P | 0, f = x % P | 0;
    else {
      for (f = Oe / (P[0] + 1) | 0, f > 1 && (P = e(P, f), T = e(T, f), O = P.length, y = T.length), _ = O, v = T.slice(0, O), p = v.length; p < O; ) v[p++] = 0;
      S = P.slice(), S.unshift(0), b = P[0], P[1] >= Oe / 2 && ++b;
      do
        f = 0, u = t(P, v, O, p), u < 0 ? (m = v[0], O != p && (m = m * Oe + (v[1] || 0)), f = m / b | 0, f > 1 ? (f >= Oe && (f = Oe - 1), l = e(P, f), h = l.length, p = v.length, u = t(l, v, h, p), u == 1 && (f--, r(l, O < h ? S : P, h))) : (f == 0 && (u = f = 1), l = P.slice()), h = l.length, h < p && l.unshift(0), r(v, l, p), u == -1 && (p = v.length, u = t(P, v, O, p), u < 1 && (f++, r(v, O < p ? S : P, p))), p = v.length) : u === 0 && (f++, v = [0]), g[c++] = f, u && v[0] ? v[p++] = T[_] || 0 : (v = [T[_]], p = 1);
      while ((_++ < y || v[0] !== void 0) && w--);
    }
    return g[0] || g.shift(), d.e = s, ne(d, o ? a + ve(d) + 1 : a);
  };
})();
function Sb(e, t) {
  var r, n, i, a, o, u, s = 0, c = 0, f = e.constructor, l = f.precision;
  if (ve(e) > 16) throw Error(ff + ve(e));
  if (!e.s) return new f(Ne);
  for (le = !1, u = l, o = new f(0.03125); e.abs().gte(0.1); )
    e = e.times(o), c += 5;
  for (n = Math.log($t(2, c)) / Math.LN10 * 2 + 5 | 0, u += n, r = i = a = new f(Ne), f.precision = u; ; ) {
    if (i = ne(i.times(e), u), r = r.times(++s), o = a.plus(ct(i, r, u)), Je(o.d).slice(0, u) === Je(a.d).slice(0, u)) {
      for (; c--; ) a = ne(a.times(a), u);
      return f.precision = l, t == null ? (le = !0, ne(a, l)) : a;
    }
    a = o;
  }
}
function ve(e) {
  for (var t = e.e * oe, r = e.d[0]; r >= 10; r /= 10) t++;
  return t;
}
function Is(e, t, r) {
  if (t > e.LN10.sd())
    throw le = !0, r && (e.precision = r), Error(Fe + "LN10 precision limit exceeded");
  return ne(new e(e.LN10), t);
}
function gt(e) {
  for (var t = ""; e--; ) t += "0";
  return t;
}
function Yr(e, t) {
  var r, n, i, a, o, u, s, c, f, l = 1, h = 10, d = e, g = d.d, v = d.constructor, p = v.precision;
  if (d.s < 1) throw Error(Fe + (d.s ? "NaN" : "-Infinity"));
  if (d.eq(Ne)) return new v(0);
  if (t == null ? (le = !1, c = p) : c = t, d.eq(10))
    return t == null && (le = !0), Is(v, c);
  if (c += h, v.precision = c, r = Je(g), n = r.charAt(0), a = ve(d), Math.abs(a) < 15e14) {
    for (; n < 7 && n != 1 || n == 1 && r.charAt(1) > 3; )
      d = d.times(e), r = Je(d.d), n = r.charAt(0), l++;
    a = ve(d), n > 1 ? (d = new v("0." + r), a++) : d = new v(n + "." + r.slice(1));
  } else
    return s = Is(v, c + 2, p).times(a + ""), d = Yr(new v(n + "." + r.slice(1)), c - h).plus(s), v.precision = p, t == null ? (le = !0, ne(d, p)) : d;
  for (u = o = d = ct(d.minus(Ne), d.plus(Ne), c), f = ne(d.times(d), c), i = 3; ; ) {
    if (o = ne(o.times(f), c), s = u.plus(ct(o, new v(i), c)), Je(s.d).slice(0, c) === Je(u.d).slice(0, c))
      return u = u.times(2), a !== 0 && (u = u.plus(Is(v, c + 2, p).times(a + ""))), u = ct(u, new v(l), c), v.precision = p, t == null ? (le = !0, ne(u, p)) : u;
    u = s, i += 2;
  }
}
function Yv(e, t) {
  var r, n, i;
  for ((r = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (n = t.search(/e/i)) > 0 ? (r < 0 && (r = n), r += +t.slice(n + 1), t = t.substring(0, n)) : r < 0 && (r = t.length), n = 0; t.charCodeAt(n) === 48; ) ++n;
  for (i = t.length; t.charCodeAt(i - 1) === 48; ) --i;
  if (t = t.slice(n, i), t) {
    if (i -= n, r = r - n - 1, e.e = Sr(r / oe), e.d = [], n = (r + 1) % oe, r < 0 && (n += oe), n < i) {
      for (n && e.d.push(+t.slice(0, n)), i -= oe; n < i; ) e.d.push(+t.slice(n, n += oe));
      t = t.slice(n), n = oe - t.length;
    } else
      n -= i;
    for (; n--; ) t += "0";
    if (e.d.push(+t), le && (e.e > ui || e.e < -ui)) throw Error(ff + r);
  } else
    e.s = 0, e.e = 0, e.d = [0];
  return e;
}
function ne(e, t, r) {
  var n, i, a, o, u, s, c, f, l = e.d;
  for (o = 1, a = l[0]; a >= 10; a /= 10) o++;
  if (n = t - o, n < 0)
    n += oe, i = t, c = l[f = 0];
  else {
    if (f = Math.ceil((n + 1) / oe), a = l.length, f >= a) return e;
    for (c = a = l[f], o = 1; a >= 10; a /= 10) o++;
    n %= oe, i = n - oe + o;
  }
  if (r !== void 0 && (a = $t(10, o - i - 1), u = c / a % 10 | 0, s = t < 0 || l[f + 1] !== void 0 || c % a, s = r < 4 ? (u || s) && (r == 0 || r == (e.s < 0 ? 3 : 2)) : u > 5 || u == 5 && (r == 4 || s || r == 6 && // Check whether the digit to the left of the rounding digit is odd.
  (n > 0 ? i > 0 ? c / $t(10, o - i) : 0 : l[f - 1]) % 10 & 1 || r == (e.s < 0 ? 8 : 7))), t < 1 || !l[0])
    return s ? (a = ve(e), l.length = 1, t = t - a - 1, l[0] = $t(10, (oe - t % oe) % oe), e.e = Sr(-t / oe) || 0) : (l.length = 1, l[0] = e.e = e.s = 0), e;
  if (n == 0 ? (l.length = f, a = 1, f--) : (l.length = f + 1, a = $t(10, oe - n), l[f] = i > 0 ? (c / $t(10, o - i) % $t(10, i) | 0) * a : 0), s)
    for (; ; )
      if (f == 0) {
        (l[0] += a) == Oe && (l[0] = 1, ++e.e);
        break;
      } else {
        if (l[f] += a, l[f] != Oe) break;
        l[f--] = 0, a = 1;
      }
  for (n = l.length; l[--n] === 0; ) l.pop();
  if (le && (e.e > ui || e.e < -ui))
    throw Error(ff + ve(e));
  return e;
}
function Ab(e, t) {
  var r, n, i, a, o, u, s, c, f, l, h = e.constructor, d = h.precision;
  if (!e.s || !t.s)
    return t.s ? t.s = -t.s : t = new h(e), le ? ne(t, d) : t;
  if (s = e.d, l = t.d, n = t.e, c = e.e, s = s.slice(), o = c - n, o) {
    for (f = o < 0, f ? (r = s, o = -o, u = l.length) : (r = l, n = c, u = s.length), i = Math.max(Math.ceil(d / oe), u) + 2, o > i && (o = i, r.length = 1), r.reverse(), i = o; i--; ) r.push(0);
    r.reverse();
  } else {
    for (i = s.length, u = l.length, f = i < u, f && (u = i), i = 0; i < u; i++)
      if (s[i] != l[i]) {
        f = s[i] < l[i];
        break;
      }
    o = 0;
  }
  for (f && (r = s, s = l, l = r, t.s = -t.s), u = s.length, i = l.length - u; i > 0; --i) s[u++] = 0;
  for (i = l.length; i > o; ) {
    if (s[--i] < l[i]) {
      for (a = i; a && s[--a] === 0; ) s[a] = Oe - 1;
      --s[a], s[i] += Oe;
    }
    s[i] -= l[i];
  }
  for (; s[--u] === 0; ) s.pop();
  for (; s[0] === 0; s.shift()) --n;
  return s[0] ? (t.d = s, t.e = n, le ? ne(t, d) : t) : new h(0);
}
function Ft(e, t, r) {
  var n, i = ve(e), a = Je(e.d), o = a.length;
  return t ? (r && (n = r - o) > 0 ? a = a.charAt(0) + "." + a.slice(1) + gt(n) : o > 1 && (a = a.charAt(0) + "." + a.slice(1)), a = a + (i < 0 ? "e" : "e+") + i) : i < 0 ? (a = "0." + gt(-i - 1) + a, r && (n = r - o) > 0 && (a += gt(n))) : i >= o ? (a += gt(i + 1 - o), r && (n = r - i - 1) > 0 && (a = a + "." + gt(n))) : ((n = i + 1) < o && (a = a.slice(0, n) + "." + a.slice(n)), r && (n = r - o) > 0 && (i + 1 === o && (a += "."), a += gt(n))), e.s < 0 ? "-" + a : a;
}
function Zv(e, t) {
  if (e.length > t)
    return e.length = t, !0;
}
function Pb(e) {
  var t, r, n;
  function i(a) {
    var o = this;
    if (!(o instanceof i)) return new i(a);
    if (o.constructor = i, a instanceof i) {
      o.s = a.s, o.e = a.e, o.d = (a = a.d) ? a.slice() : a;
      return;
    }
    if (typeof a == "number") {
      if (a * 0 !== 0)
        throw Error(kt + a);
      if (a > 0)
        o.s = 1;
      else if (a < 0)
        a = -a, o.s = -1;
      else {
        o.s = 0, o.e = 0, o.d = [0];
        return;
      }
      if (a === ~~a && a < 1e7) {
        o.e = 0, o.d = [a];
        return;
      }
      return Yv(o, a.toString());
    } else if (typeof a != "string")
      throw Error(kt + a);
    if (a.charCodeAt(0) === 45 ? (a = a.slice(1), o.s = -1) : o.s = 1, gP.test(a)) Yv(o, a);
    else throw Error(kt + a);
  }
  if (i.prototype = U, i.ROUND_UP = 0, i.ROUND_DOWN = 1, i.ROUND_CEIL = 2, i.ROUND_FLOOR = 3, i.ROUND_HALF_UP = 4, i.ROUND_HALF_DOWN = 5, i.ROUND_HALF_EVEN = 6, i.ROUND_HALF_CEIL = 7, i.ROUND_HALF_FLOOR = 8, i.clone = Pb, i.config = i.set = mP, e === void 0 && (e = {}), e)
    for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "LN10"], t = 0; t < n.length; ) e.hasOwnProperty(r = n[t++]) || (e[r] = this[r]);
  return i.config(e), i;
}
function mP(e) {
  if (!e || typeof e != "object")
    throw Error(Fe + "Object expected");
  var t, r, n, i = [
    "precision",
    1,
    Or,
    "rounding",
    0,
    8,
    "toExpNeg",
    -1 / 0,
    0,
    "toExpPos",
    0,
    1 / 0
  ];
  for (t = 0; t < i.length; t += 3)
    if ((n = e[r = i[t]]) !== void 0)
      if (Sr(n) === n && n >= i[t + 1] && n <= i[t + 2]) this[r] = n;
      else throw Error(kt + r + ": " + n);
  if ((n = e[r = "LN10"]) !== void 0)
    if (n == Math.LN10) this[r] = new this(n);
    else throw Error(kt + r + ": " + n);
  return this;
}
var hf = Pb(yP);
Ne = new hf(1);
const re = hf;
function bP(e) {
  return OP(e) || _P(e) || xP(e) || wP();
}
function wP() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function xP(e, t) {
  if (e) {
    if (typeof e == "string") return Rc(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Rc(e, t);
  }
}
function _P(e) {
  if (typeof Symbol < "u" && Symbol.iterator in Object(e)) return Array.from(e);
}
function OP(e) {
  if (Array.isArray(e)) return Rc(e);
}
function Rc(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++)
    n[r] = e[r];
  return n;
}
var SP = function(t) {
  return t;
}, Tb = {}, Eb = function(t) {
  return t === Tb;
}, Jv = function(t) {
  return function r() {
    return arguments.length === 0 || arguments.length === 1 && Eb(arguments.length <= 0 ? void 0 : arguments[0]) ? r : t.apply(void 0, arguments);
  };
}, AP = function e(t, r) {
  return t === 1 ? r : Jv(function() {
    for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++)
      i[a] = arguments[a];
    var o = i.filter(function(u) {
      return u !== Tb;
    }).length;
    return o >= t ? r.apply(void 0, i) : e(t - o, Jv(function() {
      for (var u = arguments.length, s = new Array(u), c = 0; c < u; c++)
        s[c] = arguments[c];
      var f = i.map(function(l) {
        return Eb(l) ? s.shift() : l;
      });
      return r.apply(void 0, bP(f).concat(s));
    }));
  });
}, Qi = function(t) {
  return AP(t.length, t);
}, Dc = function(t, r) {
  for (var n = [], i = t; i < r; ++i)
    n[i - t] = i;
  return n;
}, PP = Qi(function(e, t) {
  return Array.isArray(t) ? t.map(e) : Object.keys(t).map(function(r) {
    return t[r];
  }).map(e);
}), TP = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  if (!r.length)
    return SP;
  var i = r.reverse(), a = i[0], o = i.slice(1);
  return function() {
    return o.reduce(function(u, s) {
      return s(u);
    }, a.apply(void 0, arguments));
  };
}, Nc = function(t) {
  return Array.isArray(t) ? t.reverse() : t.split("").reverse.join("");
}, jb = function(t) {
  var r = null, n = null;
  return function() {
    for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
      a[o] = arguments[o];
    return r && a.every(function(u, s) {
      return u === r[s];
    }) || (r = a, n = t.apply(void 0, a)), n;
  };
};
function EP(e) {
  var t;
  return e === 0 ? t = 1 : t = Math.floor(new re(e).abs().log(10).toNumber()) + 1, t;
}
function jP(e, t, r) {
  for (var n = new re(e), i = 0, a = []; n.lt(t) && i < 1e5; )
    a.push(n.toNumber()), n = n.add(r), i++;
  return a;
}
var MP = Qi(function(e, t, r) {
  var n = +e, i = +t;
  return n + r * (i - n);
}), CP = Qi(function(e, t, r) {
  var n = t - +e;
  return n = n || 1 / 0, (r - e) / n;
}), IP = Qi(function(e, t, r) {
  var n = t - +e;
  return n = n || 1 / 0, Math.max(0, Math.min(1, (r - e) / n));
});
const ea = {
  rangeStep: jP,
  getDigitCount: EP,
  interpolateNumber: MP,
  uninterpolateNumber: CP,
  uninterpolateTruncation: IP
};
function qc(e) {
  return DP(e) || RP(e) || Mb(e) || $P();
}
function $P() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function RP(e) {
  if (typeof Symbol < "u" && Symbol.iterator in Object(e)) return Array.from(e);
}
function DP(e) {
  if (Array.isArray(e)) return kc(e);
}
function Zr(e, t) {
  return kP(e) || qP(e, t) || Mb(e, t) || NP();
}
function NP() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Mb(e, t) {
  if (e) {
    if (typeof e == "string") return kc(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return kc(e, t);
  }
}
function kc(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++)
    n[r] = e[r];
  return n;
}
function qP(e, t) {
  if (!(typeof Symbol > "u" || !(Symbol.iterator in Object(e)))) {
    var r = [], n = !0, i = !1, a = void 0;
    try {
      for (var o = e[Symbol.iterator](), u; !(n = (u = o.next()).done) && (r.push(u.value), !(t && r.length === t)); n = !0)
        ;
    } catch (s) {
      i = !0, a = s;
    } finally {
      try {
        !n && o.return != null && o.return();
      } finally {
        if (i) throw a;
      }
    }
    return r;
  }
}
function kP(e) {
  if (Array.isArray(e)) return e;
}
function Cb(e) {
  var t = Zr(e, 2), r = t[0], n = t[1], i = r, a = n;
  return r > n && (i = n, a = r), [i, a];
}
function Ib(e, t, r) {
  if (e.lte(0))
    return new re(0);
  var n = ea.getDigitCount(e.toNumber()), i = new re(10).pow(n), a = e.div(i), o = n !== 1 ? 0.05 : 0.1, u = new re(Math.ceil(a.div(o).toNumber())).add(r).mul(o), s = u.mul(i);
  return t ? s : new re(Math.ceil(s));
}
function LP(e, t, r) {
  var n = 1, i = new re(e);
  if (!i.isint() && r) {
    var a = Math.abs(e);
    a < 1 ? (n = new re(10).pow(ea.getDigitCount(e) - 1), i = new re(Math.floor(i.div(n).toNumber())).mul(n)) : a > 1 && (i = new re(Math.floor(e)));
  } else e === 0 ? i = new re(Math.floor((t - 1) / 2)) : r || (i = new re(Math.floor(e)));
  var o = Math.floor((t - 1) / 2), u = TP(PP(function(s) {
    return i.add(new re(s - o).mul(n)).toNumber();
  }), Dc);
  return u(0, t);
}
function $b(e, t, r, n) {
  var i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0;
  if (!Number.isFinite((t - e) / (r - 1)))
    return {
      step: new re(0),
      tickMin: new re(0),
      tickMax: new re(0)
    };
  var a = Ib(new re(t).sub(e).div(r - 1), n, i), o;
  e <= 0 && t >= 0 ? o = new re(0) : (o = new re(e).add(t).div(2), o = o.sub(new re(o).mod(a)));
  var u = Math.ceil(o.sub(e).div(a).toNumber()), s = Math.ceil(new re(t).sub(o).div(a).toNumber()), c = u + s + 1;
  return c > r ? $b(e, t, r, n, i + 1) : (c < r && (s = t > 0 ? s + (r - c) : s, u = t > 0 ? u : u + (r - c)), {
    step: a,
    tickMin: o.sub(new re(u).mul(a)),
    tickMax: o.add(new re(s).mul(a))
  });
}
function BP(e) {
  var t = Zr(e, 2), r = t[0], n = t[1], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6, a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, o = Math.max(i, 2), u = Cb([r, n]), s = Zr(u, 2), c = s[0], f = s[1];
  if (c === -1 / 0 || f === 1 / 0) {
    var l = f === 1 / 0 ? [c].concat(qc(Dc(0, i - 1).map(function() {
      return 1 / 0;
    }))) : [].concat(qc(Dc(0, i - 1).map(function() {
      return -1 / 0;
    })), [f]);
    return r > n ? Nc(l) : l;
  }
  if (c === f)
    return LP(c, i, a);
  var h = $b(c, f, o, a), d = h.step, g = h.tickMin, v = h.tickMax, p = ea.rangeStep(g, v.add(new re(0.1).mul(d)), d);
  return r > n ? Nc(p) : p;
}
function FP(e, t) {
  var r = Zr(e, 2), n = r[0], i = r[1], a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, o = Cb([n, i]), u = Zr(o, 2), s = u[0], c = u[1];
  if (s === -1 / 0 || c === 1 / 0)
    return [n, i];
  if (s === c)
    return [s];
  var f = Math.max(t, 2), l = Ib(new re(c).sub(s).div(f - 1), a, 0), h = [].concat(qc(ea.rangeStep(new re(s), new re(c).sub(new re(0.99).mul(l)), l)), [c]);
  return n > i ? Nc(h) : h;
}
var UP = jb(BP), WP = jb(FP), zP = "Invariant failed";
function Ut(e, t) {
  throw new Error(zP);
}
var HP = ["offset", "layout", "width", "dataKey", "data", "dataPointFormatter", "xAxis", "yAxis"];
function lr(e) {
  "@babel/helpers - typeof";
  return lr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, lr(e);
}
function si() {
  return si = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, si.apply(this, arguments);
}
function GP(e, t) {
  return YP(e) || VP(e, t) || XP(e, t) || KP();
}
function KP() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function XP(e, t) {
  if (e) {
    if (typeof e == "string") return Qv(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Qv(e, t);
  }
}
function Qv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function VP(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], s = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(s = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); s = !0) ;
    } catch (f) {
      c = !0, i = f;
    } finally {
      try {
        if (!s && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function YP(e) {
  if (Array.isArray(e)) return e;
}
function ZP(e, t) {
  if (e == null) return {};
  var r = JP(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function JP(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function QP(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function eT(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, Nb(n.key), n);
  }
}
function tT(e, t, r) {
  return t && eT(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function rT(e, t, r) {
  return t = ci(t), nT(e, Rb() ? Reflect.construct(t, r || [], ci(e).constructor) : t.apply(e, r));
}
function nT(e, t) {
  if (t && (lr(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return iT(e);
}
function iT(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Rb() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (Rb = function() {
    return !!e;
  })();
}
function ci(e) {
  return ci = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, ci(e);
}
function aT(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Lc(e, t);
}
function Lc(e, t) {
  return Lc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, i) {
    return n.__proto__ = i, n;
  }, Lc(e, t);
}
function Db(e, t, r) {
  return t = Nb(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Nb(e) {
  var t = oT(e, "string");
  return lr(t) == "symbol" ? t : t + "";
}
function oT(e, t) {
  if (lr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (lr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var ta = /* @__PURE__ */ (function(e) {
  function t() {
    return QP(this, t), rT(this, t, arguments);
  }
  return aT(t, e), tT(t, [{
    key: "render",
    value: function() {
      var n = this.props, i = n.offset, a = n.layout, o = n.width, u = n.dataKey, s = n.data, c = n.dataPointFormatter, f = n.xAxis, l = n.yAxis, h = ZP(n, HP), d = se(h, !1);
      this.props.direction === "x" && f.type !== "number" && Ut();
      var g = s.map(function(v) {
        var p = c(v, u), m = p.x, w = p.y, x = p.value, _ = p.errorVal;
        if (!_)
          return null;
        var y = [], b, O;
        if (Array.isArray(_)) {
          var S = GP(_, 2);
          b = S[0], O = S[1];
        } else
          b = O = _;
        if (a === "vertical") {
          var A = f.scale, C = w + i, T = C + o, P = C - o, j = A(x - b), I = A(x + O);
          y.push({
            x1: I,
            y1: T,
            x2: I,
            y2: P
          }), y.push({
            x1: j,
            y1: C,
            x2: I,
            y2: C
          }), y.push({
            x1: j,
            y1: T,
            x2: j,
            y2: P
          });
        } else if (a === "horizontal") {
          var M = l.scale, R = m + i, N = R - o, q = R + o, k = M(x - b), W = M(x + O);
          y.push({
            x1: N,
            y1: W,
            x2: q,
            y2: W
          }), y.push({
            x1: R,
            y1: k,
            x2: R,
            y2: W
          }), y.push({
            x1: N,
            y1: k,
            x2: q,
            y2: k
          });
        }
        return /* @__PURE__ */ E.createElement(Te, si({
          className: "recharts-errorBar",
          key: "bar-".concat(y.map(function(H) {
            return "".concat(H.x1, "-").concat(H.x2, "-").concat(H.y1, "-").concat(H.y2);
          }))
        }, d), y.map(function(H) {
          return /* @__PURE__ */ E.createElement("line", si({}, H, {
            key: "line-".concat(H.x1, "-").concat(H.x2, "-").concat(H.y1, "-").concat(H.y2)
          }));
        }));
      });
      return /* @__PURE__ */ E.createElement(Te, {
        className: "recharts-errorBars"
      }, g);
    }
  }]);
})(E.Component);
Db(ta, "defaultProps", {
  stroke: "black",
  strokeWidth: 1.5,
  width: 5,
  offset: 0,
  layout: "horizontal"
});
Db(ta, "displayName", "ErrorBar");
function Jr(e) {
  "@babel/helpers - typeof";
  return Jr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Jr(e);
}
function ey(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ct(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ey(Object(r), !0).forEach(function(n) {
      uT(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ey(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function uT(e, t, r) {
  return t = sT(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function sT(e) {
  var t = cT(e, "string");
  return Jr(t) == "symbol" ? t : t + "";
}
function cT(e, t) {
  if (Jr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Jr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var qb = function(t) {
  var r = t.children, n = t.formattedGraphicalItems, i = t.legendWidth, a = t.legendContent, o = De(r, er);
  if (!o)
    return null;
  var u = er.defaultProps, s = u !== void 0 ? Ct(Ct({}, u), o.props) : {}, c;
  return o.props && o.props.payload ? c = o.props && o.props.payload : a === "children" ? c = (n || []).reduce(function(f, l) {
    var h = l.item, d = l.props, g = d.sectors || d.data || [];
    return f.concat(g.map(function(v) {
      return {
        type: o.props.iconType || h.props.legendType,
        value: v.name,
        color: v.fill,
        payload: v
      };
    }));
  }, []) : c = (n || []).map(function(f) {
    var l = f.item, h = l.type.defaultProps, d = h !== void 0 ? Ct(Ct({}, h), l.props) : {}, g = d.dataKey, v = d.name, p = d.legendType, m = d.hide;
    return {
      inactive: m,
      dataKey: g,
      type: s.iconType || p || "square",
      color: pf(l),
      value: v || g,
      // @ts-expect-error property strokeDasharray is required in Payload but optional in props
      payload: d
    };
  }), Ct(Ct(Ct({}, s), er.getWithHeight(o, i)), {}, {
    payload: c,
    item: o
  });
};
function Qr(e) {
  "@babel/helpers - typeof";
  return Qr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Qr(e);
}
function ty(e) {
  return pT(e) || hT(e) || fT(e) || lT();
}
function lT() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function fT(e, t) {
  if (e) {
    if (typeof e == "string") return Bc(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Bc(e, t);
  }
}
function hT(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function pT(e) {
  if (Array.isArray(e)) return Bc(e);
}
function Bc(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function ry(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function he(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ry(Object(r), !0).forEach(function(n) {
      tr(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ry(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function tr(e, t, r) {
  return t = dT(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function dT(e) {
  var t = vT(e, "string");
  return Qr(t) == "symbol" ? t : t + "";
}
function vT(e, t) {
  if (Qr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Qr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Xe(e, t, r) {
  return V(e) || V(t) ? r : xe(t) ? Qe(e, t, r) : J(t) ? t(e) : r;
}
function Lr(e, t, r, n) {
  var i = pP(e, function(u) {
    return Xe(u, t);
  });
  if (r === "number") {
    var a = i.filter(function(u) {
      return B(u) || parseFloat(u);
    });
    return a.length ? [Ji(a), Zi(a)] : [1 / 0, -1 / 0];
  }
  var o = n ? i.filter(function(u) {
    return !V(u);
  }) : i;
  return o.map(function(u) {
    return xe(u) || u instanceof Date ? u : "";
  });
}
var yT = function(t) {
  var r, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], i = arguments.length > 2 ? arguments[2] : void 0, a = arguments.length > 3 ? arguments[3] : void 0, o = -1, u = (r = n?.length) !== null && r !== void 0 ? r : 0;
  if (u <= 1)
    return 0;
  if (a && a.axisType === "angleAxis" && Math.abs(Math.abs(a.range[1] - a.range[0]) - 360) <= 1e-6)
    for (var s = a.range, c = 0; c < u; c++) {
      var f = c > 0 ? i[c - 1].coordinate : i[u - 1].coordinate, l = i[c].coordinate, h = c >= u - 1 ? i[0].coordinate : i[c + 1].coordinate, d = void 0;
      if (Ze(l - f) !== Ze(h - l)) {
        var g = [];
        if (Ze(h - l) === Ze(s[1] - s[0])) {
          d = h;
          var v = l + s[1] - s[0];
          g[0] = Math.min(v, (v + f) / 2), g[1] = Math.max(v, (v + f) / 2);
        } else {
          d = f;
          var p = h + s[1] - s[0];
          g[0] = Math.min(l, (p + l) / 2), g[1] = Math.max(l, (p + l) / 2);
        }
        var m = [Math.min(l, (d + l) / 2), Math.max(l, (d + l) / 2)];
        if (t > m[0] && t <= m[1] || t >= g[0] && t <= g[1]) {
          o = i[c].index;
          break;
        }
      } else {
        var w = Math.min(f, h), x = Math.max(f, h);
        if (t > (w + l) / 2 && t <= (x + l) / 2) {
          o = i[c].index;
          break;
        }
      }
    }
  else
    for (var _ = 0; _ < u; _++)
      if (_ === 0 && t <= (n[_].coordinate + n[_ + 1].coordinate) / 2 || _ > 0 && _ < u - 1 && t > (n[_].coordinate + n[_ - 1].coordinate) / 2 && t <= (n[_].coordinate + n[_ + 1].coordinate) / 2 || _ === u - 1 && t > (n[_].coordinate + n[_ - 1].coordinate) / 2) {
        o = n[_].index;
        break;
      }
  return o;
}, pf = function(t) {
  var r, n = t, i = n.type.displayName, a = (r = t.type) !== null && r !== void 0 && r.defaultProps ? he(he({}, t.type.defaultProps), t.props) : t.props, o = a.stroke, u = a.fill, s;
  switch (i) {
    case "Line":
      s = o;
      break;
    case "Area":
    case "Radar":
      s = o && o !== "none" ? o : u;
      break;
    default:
      s = u;
      break;
  }
  return s;
}, gT = function(t) {
  var r = t.barSize, n = t.totalSize, i = t.stackGroups, a = i === void 0 ? {} : i;
  if (!a)
    return {};
  for (var o = {}, u = Object.keys(a), s = 0, c = u.length; s < c; s++)
    for (var f = a[u[s]].stackGroups, l = Object.keys(f), h = 0, d = l.length; h < d; h++) {
      var g = f[l[h]], v = g.items, p = g.cateAxisId, m = v.filter(function(O) {
        return st(O.type).indexOf("Bar") >= 0;
      });
      if (m && m.length) {
        var w = m[0].type.defaultProps, x = w !== void 0 ? he(he({}, w), m[0].props) : m[0].props, _ = x.barSize, y = x[p];
        o[y] || (o[y] = []);
        var b = V(_) ? r : _;
        o[y].push({
          item: m[0],
          stackList: m.slice(1),
          barSize: V(b) ? void 0 : He(b, n, 0)
        });
      }
    }
  return o;
}, mT = function(t) {
  var r = t.barGap, n = t.barCategoryGap, i = t.bandSize, a = t.sizeList, o = a === void 0 ? [] : a, u = t.maxBarSize, s = o.length;
  if (s < 1) return null;
  var c = He(r, i, 0, !0), f, l = [];
  if (o[0].barSize === +o[0].barSize) {
    var h = !1, d = i / s, g = o.reduce(function(_, y) {
      return _ + y.barSize || 0;
    }, 0);
    g += (s - 1) * c, g >= i && (g -= (s - 1) * c, c = 0), g >= i && d > 0 && (h = !0, d *= 0.9, g = s * d);
    var v = (i - g) / 2 >> 0, p = {
      offset: v - c,
      size: 0
    };
    f = o.reduce(function(_, y) {
      var b = {
        item: y.item,
        position: {
          offset: p.offset + p.size + c,
          // @ts-expect-error the type check above does not check for type number explicitly
          size: h ? d : y.barSize
        }
      }, O = [].concat(ty(_), [b]);
      return p = O[O.length - 1].position, y.stackList && y.stackList.length && y.stackList.forEach(function(S) {
        O.push({
          item: S,
          position: p
        });
      }), O;
    }, l);
  } else {
    var m = He(n, i, 0, !0);
    i - 2 * m - (s - 1) * c <= 0 && (c = 0);
    var w = (i - 2 * m - (s - 1) * c) / s;
    w > 1 && (w >>= 0);
    var x = u === +u ? Math.min(w, u) : w;
    f = o.reduce(function(_, y, b) {
      var O = [].concat(ty(_), [{
        item: y.item,
        position: {
          offset: m + (w + c) * b + (w - x) / 2,
          size: x
        }
      }]);
      return y.stackList && y.stackList.length && y.stackList.forEach(function(S) {
        O.push({
          item: S,
          position: O[O.length - 1].position
        });
      }), O;
    }, l);
  }
  return f;
}, bT = function(t, r, n, i) {
  var a = n.children, o = n.width, u = n.margin, s = o - (u.left || 0) - (u.right || 0), c = qb({
    children: a,
    legendWidth: s
  });
  if (c) {
    var f = i || {}, l = f.width, h = f.height, d = c.align, g = c.verticalAlign, v = c.layout;
    if ((v === "vertical" || v === "horizontal" && g === "middle") && d !== "center" && B(t[d]))
      return he(he({}, t), {}, tr({}, d, t[d] + (l || 0)));
    if ((v === "horizontal" || v === "vertical" && d === "center") && g !== "middle" && B(t[g]))
      return he(he({}, t), {}, tr({}, g, t[g] + (h || 0)));
  }
  return t;
}, wT = function(t, r, n) {
  return V(r) ? !0 : t === "horizontal" ? r === "yAxis" : t === "vertical" || n === "x" ? r === "xAxis" : n === "y" ? r === "yAxis" : !0;
}, kb = function(t, r, n, i, a) {
  var o = r.props.children, u = Ke(o, ta).filter(function(c) {
    return wT(i, a, c.props.direction);
  });
  if (u && u.length) {
    var s = u.map(function(c) {
      return c.props.dataKey;
    });
    return t.reduce(function(c, f) {
      var l = Xe(f, n);
      if (V(l)) return c;
      var h = Array.isArray(l) ? [Ji(l), Zi(l)] : [l, l], d = s.reduce(function(g, v) {
        var p = Xe(f, v, 0), m = h[0] - Math.abs(Array.isArray(p) ? p[0] : p), w = h[1] + Math.abs(Array.isArray(p) ? p[1] : p);
        return [Math.min(m, g[0]), Math.max(w, g[1])];
      }, [1 / 0, -1 / 0]);
      return [Math.min(d[0], c[0]), Math.max(d[1], c[1])];
    }, [1 / 0, -1 / 0]);
  }
  return null;
}, xT = function(t, r, n, i, a) {
  var o = r.map(function(u) {
    return kb(t, u, n, a, i);
  }).filter(function(u) {
    return !V(u);
  });
  return o && o.length ? o.reduce(function(u, s) {
    return [Math.min(u[0], s[0]), Math.max(u[1], s[1])];
  }, [1 / 0, -1 / 0]) : null;
}, Lb = function(t, r, n, i, a) {
  var o = r.map(function(s) {
    var c = s.props.dataKey;
    return n === "number" && c && kb(t, s, c, i) || Lr(t, c, n, a);
  });
  if (n === "number")
    return o.reduce(
      // @ts-expect-error if (type === number) means that the domain is numerical type
      // - but this link is missing in the type definition
      function(s, c) {
        return [Math.min(s[0], c[0]), Math.max(s[1], c[1])];
      },
      [1 / 0, -1 / 0]
    );
  var u = {};
  return o.reduce(function(s, c) {
    for (var f = 0, l = c.length; f < l; f++)
      u[c[f]] || (u[c[f]] = !0, s.push(c[f]));
    return s;
  }, []);
}, Bb = function(t, r) {
  return t === "horizontal" && r === "xAxis" || t === "vertical" && r === "yAxis" || t === "centric" && r === "angleAxis" || t === "radial" && r === "radiusAxis";
}, xR = function(t, r, n, i) {
  if (i)
    return t.map(function(s) {
      return s.coordinate;
    });
  var a, o, u = t.map(function(s) {
    return s.coordinate === r && (a = !0), s.coordinate === n && (o = !0), s.coordinate;
  });
  return a || u.push(r), o || u.push(n), u;
}, Nr = function(t, r, n) {
  if (!t) return null;
  var i = t.scale, a = t.duplicateDomain, o = t.type, u = t.range, s = t.realScaleType === "scaleBand" ? i.bandwidth() / 2 : 2, c = (r || n) && o === "category" && i.bandwidth ? i.bandwidth() / s : 0;
  if (c = t.axisType === "angleAxis" && u?.length >= 2 ? Ze(u[0] - u[1]) * 2 * c : c, r && (t.ticks || t.niceTicks)) {
    var f = (t.ticks || t.niceTicks).map(function(l) {
      var h = a ? a.indexOf(l) : l;
      return {
        // If the scaleContent is not a number, the coordinate will be NaN.
        // That could be the case for example with a PointScale and a string as domain.
        coordinate: i(h) + c,
        value: l,
        offset: c
      };
    });
    return f.filter(function(l) {
      return !xn(l.coordinate);
    });
  }
  return t.isCategorical && t.categoricalDomain ? t.categoricalDomain.map(function(l, h) {
    return {
      coordinate: i(l) + c,
      value: l,
      index: h,
      offset: c
    };
  }) : i.ticks && !n ? i.ticks(t.tickCount).map(function(l) {
    return {
      coordinate: i(l) + c,
      value: l,
      offset: c
    };
  }) : i.domain().map(function(l, h) {
    return {
      coordinate: i(l) + c,
      value: a ? a[l] : l,
      index: h,
      offset: c
    };
  });
}, $s = /* @__PURE__ */ new WeakMap(), Rn = function(t, r) {
  if (typeof r != "function")
    return t;
  $s.has(t) || $s.set(t, /* @__PURE__ */ new WeakMap());
  var n = $s.get(t);
  if (n.has(r))
    return n.get(r);
  var i = function() {
    t.apply(void 0, arguments), r.apply(void 0, arguments);
  };
  return n.set(r, i), i;
}, Fb = function(t, r, n) {
  var i = t.scale, a = t.type, o = t.layout, u = t.axisType;
  if (i === "auto")
    return o === "radial" && u === "radiusAxis" ? {
      scale: Xr(),
      realScaleType: "band"
    } : o === "radial" && u === "angleAxis" ? {
      scale: ni(),
      realScaleType: "linear"
    } : a === "category" && r && (r.indexOf("LineChart") >= 0 || r.indexOf("AreaChart") >= 0 || r.indexOf("ComposedChart") >= 0 && !n) ? {
      scale: kr(),
      realScaleType: "point"
    } : a === "category" ? {
      scale: Xr(),
      realScaleType: "band"
    } : {
      scale: ni(),
      realScaleType: "linear"
    };
  if (Bt(i)) {
    var s = "scale".concat(qi(i));
    return {
      scale: (Fv[s] || kr)(),
      realScaleType: Fv[s] ? s : "point"
    };
  }
  return J(i) ? {
    scale: i
  } : {
    scale: kr(),
    realScaleType: "point"
  };
}, ny = 1e-4, Ub = function(t) {
  var r = t.domain();
  if (!(!r || r.length <= 2)) {
    var n = r.length, i = t.range(), a = Math.min(i[0], i[1]) - ny, o = Math.max(i[0], i[1]) + ny, u = t(r[0]), s = t(r[n - 1]);
    (u < a || u > o || s < a || s > o) && t.domain([r[0], r[n - 1]]);
  }
}, _T = function(t, r) {
  if (!t)
    return null;
  for (var n = 0, i = t.length; n < i; n++)
    if (t[n].item === r)
      return t[n].position;
  return null;
}, OT = function(t, r) {
  if (!r || r.length !== 2 || !B(r[0]) || !B(r[1]))
    return t;
  var n = Math.min(r[0], r[1]), i = Math.max(r[0], r[1]), a = [t[0], t[1]];
  return (!B(t[0]) || t[0] < n) && (a[0] = n), (!B(t[1]) || t[1] > i) && (a[1] = i), a[0] > i && (a[0] = i), a[1] < n && (a[1] = n), a;
}, ST = function(t) {
  var r = t.length;
  if (!(r <= 0))
    for (var n = 0, i = t[0].length; n < i; ++n)
      for (var a = 0, o = 0, u = 0; u < r; ++u) {
        var s = xn(t[u][n][1]) ? t[u][n][0] : t[u][n][1];
        s >= 0 ? (t[u][n][0] = a, t[u][n][1] = a + s, a = t[u][n][1]) : (t[u][n][0] = o, t[u][n][1] = o + s, o = t[u][n][1]);
      }
}, AT = function(t) {
  var r = t.length;
  if (!(r <= 0))
    for (var n = 0, i = t[0].length; n < i; ++n)
      for (var a = 0, o = 0; o < r; ++o) {
        var u = xn(t[o][n][1]) ? t[o][n][0] : t[o][n][1];
        u >= 0 ? (t[o][n][0] = a, t[o][n][1] = a + u, a = t[o][n][1]) : (t[o][n][0] = 0, t[o][n][1] = 0);
      }
}, PT = {
  sign: ST,
  // @ts-expect-error definitelytyped types are incorrect
  expand: $x,
  // @ts-expect-error definitelytyped types are incorrect
  none: rr,
  // @ts-expect-error definitelytyped types are incorrect
  silhouette: Rx,
  // @ts-expect-error definitelytyped types are incorrect
  wiggle: Dx,
  positive: AT
}, TT = function(t, r, n) {
  var i = r.map(function(u) {
    return u.props.dataKey;
  }), a = PT[n], o = Ix().keys(i).value(function(u, s) {
    return +Xe(u, s, 0);
  }).order(gc).offset(a);
  return o(t);
}, ET = function(t, r, n, i, a, o) {
  if (!t)
    return null;
  var u = o ? r.reverse() : r, s = {}, c = u.reduce(function(l, h) {
    var d, g = (d = h.type) !== null && d !== void 0 && d.defaultProps ? he(he({}, h.type.defaultProps), h.props) : h.props, v = g.stackId, p = g.hide;
    if (p)
      return l;
    var m = g[n], w = l[m] || {
      hasStack: !1,
      stackGroups: {}
    };
    if (xe(v)) {
      var x = w.stackGroups[v] || {
        numericAxisId: n,
        cateAxisId: i,
        items: []
      };
      x.items.push(h), w.hasStack = !0, w.stackGroups[v] = x;
    } else
      w.stackGroups[Ni("_stackId_")] = {
        numericAxisId: n,
        cateAxisId: i,
        items: [h]
      };
    return he(he({}, l), {}, tr({}, m, w));
  }, s), f = {};
  return Object.keys(c).reduce(function(l, h) {
    var d = c[h];
    if (d.hasStack) {
      var g = {};
      d.stackGroups = Object.keys(d.stackGroups).reduce(function(v, p) {
        var m = d.stackGroups[p];
        return he(he({}, v), {}, tr({}, p, {
          numericAxisId: n,
          cateAxisId: i,
          items: m.items,
          stackedData: TT(t, m.items, a)
        }));
      }, g);
    }
    return he(he({}, l), {}, tr({}, h, d));
  }, f);
}, Wb = function(t, r) {
  var n = r.realScaleType, i = r.type, a = r.tickCount, o = r.originalDomain, u = r.allowDecimals, s = n || r.scale;
  if (s !== "auto" && s !== "linear")
    return null;
  if (a && i === "number" && o && (o[0] === "auto" || o[1] === "auto")) {
    var c = t.domain();
    if (!c.length)
      return null;
    var f = UP(c, a, u);
    return t.domain([Ji(f), Zi(f)]), {
      niceTicks: f
    };
  }
  if (a && i === "number") {
    var l = t.domain(), h = WP(l, a, u);
    return {
      niceTicks: h
    };
  }
  return null;
};
function _R(e) {
  var t = e.axis, r = e.ticks, n = e.bandSize, i = e.entry, a = e.index, o = e.dataKey;
  if (t.type === "category") {
    if (!t.allowDuplicatedCategory && t.dataKey && !V(i[t.dataKey])) {
      var u = Fn(r, "value", i[t.dataKey]);
      if (u)
        return u.coordinate + n / 2;
    }
    return r[a] ? r[a].coordinate + n / 2 : null;
  }
  var s = Xe(i, V(o) ? t.dataKey : o);
  return V(s) ? null : t.scale(s);
}
var iy = function(t) {
  var r = t.axis, n = t.ticks, i = t.offset, a = t.bandSize, o = t.entry, u = t.index;
  if (r.type === "category")
    return n[u] ? n[u].coordinate + i : null;
  var s = Xe(o, r.dataKey, r.domain[u]);
  return V(s) ? null : r.scale(s) - a / 2 + i;
}, jT = function(t) {
  var r = t.numericAxis, n = r.scale.domain();
  if (r.type === "number") {
    var i = Math.min(n[0], n[1]), a = Math.max(n[0], n[1]);
    return i <= 0 && a >= 0 ? 0 : a < 0 ? a : i;
  }
  return n[0];
}, MT = function(t, r) {
  var n, i = (n = t.type) !== null && n !== void 0 && n.defaultProps ? he(he({}, t.type.defaultProps), t.props) : t.props, a = i.stackId;
  if (xe(a)) {
    var o = r[a];
    if (o) {
      var u = o.items.indexOf(t);
      return u >= 0 ? o.stackedData[u] : null;
    }
  }
  return null;
}, CT = function(t) {
  return t.reduce(function(r, n) {
    return [Ji(n.concat([r[0]]).filter(B)), Zi(n.concat([r[1]]).filter(B))];
  }, [1 / 0, -1 / 0]);
}, zb = function(t, r, n) {
  return Object.keys(t).reduce(function(i, a) {
    var o = t[a], u = o.stackedData, s = u.reduce(function(c, f) {
      var l = CT(f.slice(r, n + 1));
      return [Math.min(c[0], l[0]), Math.max(c[1], l[1])];
    }, [1 / 0, -1 / 0]);
    return [Math.min(s[0], i[0]), Math.max(s[1], i[1])];
  }, [1 / 0, -1 / 0]).map(function(i) {
    return i === 1 / 0 || i === -1 / 0 ? 0 : i;
  });
}, ay = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, oy = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, Fc = function(t, r, n) {
  if (J(t))
    return t(r, n);
  if (!Array.isArray(t))
    return r;
  var i = [];
  if (B(t[0]))
    i[0] = n ? t[0] : Math.min(t[0], r[0]);
  else if (ay.test(t[0])) {
    var a = +ay.exec(t[0])[1];
    i[0] = r[0] - a;
  } else J(t[0]) ? i[0] = t[0](r[0]) : i[0] = r[0];
  if (B(t[1]))
    i[1] = n ? t[1] : Math.max(t[1], r[1]);
  else if (oy.test(t[1])) {
    var o = +oy.exec(t[1])[1];
    i[1] = r[1] + o;
  } else J(t[1]) ? i[1] = t[1](r[1]) : i[1] = r[1];
  return i;
}, li = function(t, r, n) {
  if (t && t.scale && t.scale.bandwidth) {
    var i = t.scale.bandwidth();
    if (!n || i > 0)
      return i;
  }
  if (t && r && r.length >= 2) {
    for (var a = Fl(r, function(l) {
      return l.coordinate;
    }), o = 1 / 0, u = 1, s = a.length; u < s; u++) {
      var c = a[u], f = a[u - 1];
      o = Math.min((c.coordinate || 0) - (f.coordinate || 0), o);
    }
    return o === 1 / 0 ? 0 : o;
  }
  return n ? void 0 : 0;
}, uy = function(t, r, n) {
  return !t || !t.length || lf(t, Qe(n, "type.defaultProps.domain")) ? r : t;
}, Hb = function(t, r) {
  var n = t.type.defaultProps ? he(he({}, t.type.defaultProps), t.props) : t.props, i = n.dataKey, a = n.name, o = n.unit, u = n.formatter, s = n.tooltipType, c = n.chartType, f = n.hide;
  return he(he({}, se(t, !1)), {}, {
    dataKey: i,
    unit: o,
    formatter: u,
    name: a || i,
    color: pf(t),
    value: Xe(r, i),
    type: s,
    payload: r,
    chartType: c,
    hide: f
  });
};
function en(e) {
  "@babel/helpers - typeof";
  return en = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, en(e);
}
function sy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function at(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? sy(Object(r), !0).forEach(function(n) {
      Gb(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : sy(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Gb(e, t, r) {
  return t = IT(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function IT(e) {
  var t = $T(e, "string");
  return en(t) == "symbol" ? t : t + "";
}
function $T(e, t) {
  if (en(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (en(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function RT(e, t) {
  return kT(e) || qT(e, t) || NT(e, t) || DT();
}
function DT() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function NT(e, t) {
  if (e) {
    if (typeof e == "string") return cy(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return cy(e, t);
  }
}
function cy(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function qT(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], s = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(s = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); s = !0) ;
    } catch (f) {
      c = !0, i = f;
    } finally {
      try {
        if (!s && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function kT(e) {
  if (Array.isArray(e)) return e;
}
var fi = Math.PI / 180, LT = function(t) {
  return t * 180 / Math.PI;
}, Pe = function(t, r, n, i) {
  return {
    x: t + Math.cos(-fi * i) * n,
    y: r + Math.sin(-fi * i) * n
  };
}, BT = function(t, r) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  return Math.min(Math.abs(t - (n.left || 0) - (n.right || 0)), Math.abs(r - (n.top || 0) - (n.bottom || 0))) / 2;
}, OR = function(t, r, n, i, a) {
  var o = t.width, u = t.height, s = t.startAngle, c = t.endAngle, f = He(t.cx, o, o / 2), l = He(t.cy, u, u / 2), h = BT(o, u, n), d = He(t.innerRadius, h, 0), g = He(t.outerRadius, h, h * 0.8), v = Object.keys(r);
  return v.reduce(function(p, m) {
    var w = r[m], x = w.domain, _ = w.reversed, y;
    if (V(w.range))
      i === "angleAxis" ? y = [s, c] : i === "radiusAxis" && (y = [d, g]), _ && (y = [y[1], y[0]]);
    else {
      y = w.range;
      var b = y, O = RT(b, 2);
      s = O[0], c = O[1];
    }
    var S = Fb(w, a), A = S.realScaleType, C = S.scale;
    C.domain(x).range(y), Ub(C);
    var T = Wb(C, at(at({}, w), {}, {
      realScaleType: A
    })), P = at(at(at({}, w), T), {}, {
      range: y,
      radius: g,
      realScaleType: A,
      scale: C,
      cx: f,
      cy: l,
      innerRadius: d,
      outerRadius: g,
      startAngle: s,
      endAngle: c
    });
    return at(at({}, p), {}, Gb({}, m, P));
  }, {});
}, FT = function(t, r) {
  var n = t.x, i = t.y, a = r.x, o = r.y;
  return Math.sqrt(Math.pow(n - a, 2) + Math.pow(i - o, 2));
}, UT = function(t, r) {
  var n = t.x, i = t.y, a = r.cx, o = r.cy, u = FT({
    x: n,
    y: i
  }, {
    x: a,
    y: o
  });
  if (u <= 0)
    return {
      radius: u
    };
  var s = (n - a) / u, c = Math.acos(s);
  return i > o && (c = 2 * Math.PI - c), {
    radius: u,
    angle: LT(c),
    angleInRadian: c
  };
}, WT = function(t) {
  var r = t.startAngle, n = t.endAngle, i = Math.floor(r / 360), a = Math.floor(n / 360), o = Math.min(i, a);
  return {
    startAngle: r - o * 360,
    endAngle: n - o * 360
  };
}, zT = function(t, r) {
  var n = r.startAngle, i = r.endAngle, a = Math.floor(n / 360), o = Math.floor(i / 360), u = Math.min(a, o);
  return t + u * 360;
}, ly = function(t, r) {
  var n = t.x, i = t.y, a = UT({
    x: n,
    y: i
  }, r), o = a.radius, u = a.angle, s = r.innerRadius, c = r.outerRadius;
  if (o < s || o > c)
    return !1;
  if (o === 0)
    return !0;
  var f = WT(r), l = f.startAngle, h = f.endAngle, d = u, g;
  if (l <= h) {
    for (; d > h; )
      d -= 360;
    for (; d < l; )
      d += 360;
    g = d >= l && d <= h;
  } else {
    for (; d > l; )
      d -= 360;
    for (; d < h; )
      d += 360;
    g = d >= h && d <= l;
  }
  return g ? at(at({}, r), {}, {
    radius: o,
    angle: zT(d, r)
  }) : null;
}, SR = function(t) {
  return !/* @__PURE__ */ Ge(t) && !J(t) && typeof t != "boolean" ? t.className : "";
};
function tn(e) {
  "@babel/helpers - typeof";
  return tn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, tn(e);
}
var HT = ["offset"];
function GT(e) {
  return YT(e) || VT(e) || XT(e) || KT();
}
function KT() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function XT(e, t) {
  if (e) {
    if (typeof e == "string") return Uc(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Uc(e, t);
  }
}
function VT(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function YT(e) {
  if (Array.isArray(e)) return Uc(e);
}
function Uc(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function ZT(e, t) {
  if (e == null) return {};
  var r = JT(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function JT(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function fy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function me(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? fy(Object(r), !0).forEach(function(n) {
      QT(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : fy(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function QT(e, t, r) {
  return t = eE(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function eE(e) {
  var t = tE(e, "string");
  return tn(t) == "symbol" ? t : t + "";
}
function tE(e, t) {
  if (tn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (tn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function rn() {
  return rn = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, rn.apply(this, arguments);
}
var rE = function(t) {
  var r = t.value, n = t.formatter, i = V(t.children) ? r : t.children;
  return J(n) ? n(i) : i;
}, nE = function(t, r) {
  var n = Ze(r - t), i = Math.min(Math.abs(r - t), 360);
  return n * i;
}, iE = function(t, r, n) {
  var i = t.position, a = t.viewBox, o = t.offset, u = t.className, s = a, c = s.cx, f = s.cy, l = s.innerRadius, h = s.outerRadius, d = s.startAngle, g = s.endAngle, v = s.clockWise, p = (l + h) / 2, m = nE(d, g), w = m >= 0 ? 1 : -1, x, _;
  i === "insideStart" ? (x = d + w * o, _ = v) : i === "insideEnd" ? (x = g - w * o, _ = !v) : i === "end" && (x = g + w * o, _ = v), _ = m <= 0 ? _ : !_;
  var y = Pe(c, f, p, x), b = Pe(c, f, p, x + (_ ? 1 : -1) * 359), O = "M".concat(y.x, ",").concat(y.y, `
    A`).concat(p, ",").concat(p, ",0,1,").concat(_ ? 0 : 1, `,
    `).concat(b.x, ",").concat(b.y), S = V(t.id) ? Ni("recharts-radial-line-") : t.id;
  return /* @__PURE__ */ E.createElement("text", rn({}, n, {
    dominantBaseline: "central",
    className: ue("recharts-radial-bar-label", u)
  }), /* @__PURE__ */ E.createElement("defs", null, /* @__PURE__ */ E.createElement("path", {
    id: S,
    d: O
  })), /* @__PURE__ */ E.createElement("textPath", {
    xlinkHref: "#".concat(S)
  }, r));
}, aE = function(t) {
  var r = t.viewBox, n = t.offset, i = t.position, a = r, o = a.cx, u = a.cy, s = a.innerRadius, c = a.outerRadius, f = a.startAngle, l = a.endAngle, h = (f + l) / 2;
  if (i === "outside") {
    var d = Pe(o, u, c + n, h), g = d.x, v = d.y;
    return {
      x: g,
      y: v,
      textAnchor: g >= o ? "start" : "end",
      verticalAnchor: "middle"
    };
  }
  if (i === "center")
    return {
      x: o,
      y: u,
      textAnchor: "middle",
      verticalAnchor: "middle"
    };
  if (i === "centerTop")
    return {
      x: o,
      y: u,
      textAnchor: "middle",
      verticalAnchor: "start"
    };
  if (i === "centerBottom")
    return {
      x: o,
      y: u,
      textAnchor: "middle",
      verticalAnchor: "end"
    };
  var p = (s + c) / 2, m = Pe(o, u, p, h), w = m.x, x = m.y;
  return {
    x: w,
    y: x,
    textAnchor: "middle",
    verticalAnchor: "middle"
  };
}, oE = function(t) {
  var r = t.viewBox, n = t.parentViewBox, i = t.offset, a = t.position, o = r, u = o.x, s = o.y, c = o.width, f = o.height, l = f >= 0 ? 1 : -1, h = l * i, d = l > 0 ? "end" : "start", g = l > 0 ? "start" : "end", v = c >= 0 ? 1 : -1, p = v * i, m = v > 0 ? "end" : "start", w = v > 0 ? "start" : "end";
  if (a === "top") {
    var x = {
      x: u + c / 2,
      y: s - l * i,
      textAnchor: "middle",
      verticalAnchor: d
    };
    return me(me({}, x), n ? {
      height: Math.max(s - n.y, 0),
      width: c
    } : {});
  }
  if (a === "bottom") {
    var _ = {
      x: u + c / 2,
      y: s + f + h,
      textAnchor: "middle",
      verticalAnchor: g
    };
    return me(me({}, _), n ? {
      height: Math.max(n.y + n.height - (s + f), 0),
      width: c
    } : {});
  }
  if (a === "left") {
    var y = {
      x: u - p,
      y: s + f / 2,
      textAnchor: m,
      verticalAnchor: "middle"
    };
    return me(me({}, y), n ? {
      width: Math.max(y.x - n.x, 0),
      height: f
    } : {});
  }
  if (a === "right") {
    var b = {
      x: u + c + p,
      y: s + f / 2,
      textAnchor: w,
      verticalAnchor: "middle"
    };
    return me(me({}, b), n ? {
      width: Math.max(n.x + n.width - b.x, 0),
      height: f
    } : {});
  }
  var O = n ? {
    width: c,
    height: f
  } : {};
  return a === "insideLeft" ? me({
    x: u + p,
    y: s + f / 2,
    textAnchor: w,
    verticalAnchor: "middle"
  }, O) : a === "insideRight" ? me({
    x: u + c - p,
    y: s + f / 2,
    textAnchor: m,
    verticalAnchor: "middle"
  }, O) : a === "insideTop" ? me({
    x: u + c / 2,
    y: s + h,
    textAnchor: "middle",
    verticalAnchor: g
  }, O) : a === "insideBottom" ? me({
    x: u + c / 2,
    y: s + f - h,
    textAnchor: "middle",
    verticalAnchor: d
  }, O) : a === "insideTopLeft" ? me({
    x: u + p,
    y: s + h,
    textAnchor: w,
    verticalAnchor: g
  }, O) : a === "insideTopRight" ? me({
    x: u + c - p,
    y: s + h,
    textAnchor: m,
    verticalAnchor: g
  }, O) : a === "insideBottomLeft" ? me({
    x: u + p,
    y: s + f - h,
    textAnchor: w,
    verticalAnchor: d
  }, O) : a === "insideBottomRight" ? me({
    x: u + c - p,
    y: s + f - h,
    textAnchor: m,
    verticalAnchor: d
  }, O) : xr(a) && (B(a.x) || Rt(a.x)) && (B(a.y) || Rt(a.y)) ? me({
    x: u + He(a.x, c),
    y: s + He(a.y, f),
    textAnchor: "end",
    verticalAnchor: "end"
  }, O) : me({
    x: u + c / 2,
    y: s + f / 2,
    textAnchor: "middle",
    verticalAnchor: "middle"
  }, O);
}, uE = function(t) {
  return "cx" in t && B(t.cx);
};
function Ee(e) {
  var t = e.offset, r = t === void 0 ? 5 : t, n = ZT(e, HT), i = me({
    offset: r
  }, n), a = i.viewBox, o = i.position, u = i.value, s = i.children, c = i.content, f = i.className, l = f === void 0 ? "" : f, h = i.textBreakAll;
  if (!a || V(u) && V(s) && !/* @__PURE__ */ Ge(c) && !J(c))
    return null;
  if (/* @__PURE__ */ Ge(c))
    return /* @__PURE__ */ be(c, i);
  var d;
  if (J(c)) {
    if (d = /* @__PURE__ */ ji(c, i), /* @__PURE__ */ Ge(d))
      return d;
  } else
    d = rE(i);
  var g = uE(a), v = se(i, !0);
  if (g && (o === "insideStart" || o === "insideEnd" || o === "end"))
    return iE(i, d, v);
  var p = g ? aE(i) : oE(i);
  return /* @__PURE__ */ E.createElement(Ec, rn({
    className: ue("recharts-label", l)
  }, v, p, {
    breakAll: h
  }), d);
}
Ee.displayName = "Label";
var Kb = function(t) {
  var r = t.cx, n = t.cy, i = t.angle, a = t.startAngle, o = t.endAngle, u = t.r, s = t.radius, c = t.innerRadius, f = t.outerRadius, l = t.x, h = t.y, d = t.top, g = t.left, v = t.width, p = t.height, m = t.clockWise, w = t.labelViewBox;
  if (w)
    return w;
  if (B(v) && B(p)) {
    if (B(l) && B(h))
      return {
        x: l,
        y: h,
        width: v,
        height: p
      };
    if (B(d) && B(g))
      return {
        x: d,
        y: g,
        width: v,
        height: p
      };
  }
  return B(l) && B(h) ? {
    x: l,
    y: h,
    width: 0,
    height: 0
  } : B(r) && B(n) ? {
    cx: r,
    cy: n,
    startAngle: a || i || 0,
    endAngle: o || i || 0,
    innerRadius: c || 0,
    outerRadius: f || s || u || 0,
    clockWise: m
  } : t.viewBox ? t.viewBox : {};
}, sE = function(t, r) {
  return t ? t === !0 ? /* @__PURE__ */ E.createElement(Ee, {
    key: "label-implicit",
    viewBox: r
  }) : xe(t) ? /* @__PURE__ */ E.createElement(Ee, {
    key: "label-implicit",
    viewBox: r,
    value: t
  }) : /* @__PURE__ */ Ge(t) ? t.type === Ee ? /* @__PURE__ */ be(t, {
    key: "label-implicit",
    viewBox: r
  }) : /* @__PURE__ */ E.createElement(Ee, {
    key: "label-implicit",
    content: t,
    viewBox: r
  }) : J(t) ? /* @__PURE__ */ E.createElement(Ee, {
    key: "label-implicit",
    content: t,
    viewBox: r
  }) : xr(t) ? /* @__PURE__ */ E.createElement(Ee, rn({
    viewBox: r
  }, t, {
    key: "label-implicit"
  })) : null : null;
}, cE = function(t, r) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  if (!t || !t.children && n && !t.label)
    return null;
  var i = t.children, a = Kb(t), o = Ke(i, Ee).map(function(s, c) {
    return /* @__PURE__ */ be(s, {
      viewBox: r || a,
      // eslint-disable-next-line react/no-array-index-key
      key: "label-".concat(c)
    });
  });
  if (!n)
    return o;
  var u = sE(t.label, r || a);
  return [u].concat(GT(o));
};
Ee.parseViewBox = Kb;
Ee.renderCallByParent = cE;
var Rs, hy;
function lE() {
  if (hy) return Rs;
  hy = 1;
  function e(t) {
    var r = t == null ? 0 : t.length;
    return r ? t[r - 1] : void 0;
  }
  return Rs = e, Rs;
}
var fE = lE();
const hE = /* @__PURE__ */ ce(fE);
function nn(e) {
  "@babel/helpers - typeof";
  return nn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, nn(e);
}
var pE = ["valueAccessor"], dE = ["data", "dataKey", "clockWise", "id", "textBreakAll"];
function vE(e) {
  return bE(e) || mE(e) || gE(e) || yE();
}
function yE() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function gE(e, t) {
  if (e) {
    if (typeof e == "string") return Wc(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Wc(e, t);
  }
}
function mE(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function bE(e) {
  if (Array.isArray(e)) return Wc(e);
}
function Wc(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function hi() {
  return hi = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, hi.apply(this, arguments);
}
function py(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function dy(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? py(Object(r), !0).forEach(function(n) {
      wE(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : py(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function wE(e, t, r) {
  return t = xE(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function xE(e) {
  var t = _E(e, "string");
  return nn(t) == "symbol" ? t : t + "";
}
function _E(e, t) {
  if (nn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (nn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function vy(e, t) {
  if (e == null) return {};
  var r = OE(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function OE(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var SE = function(t) {
  return Array.isArray(t.value) ? hE(t.value) : t.value;
};
function Lt(e) {
  var t = e.valueAccessor, r = t === void 0 ? SE : t, n = vy(e, pE), i = n.data, a = n.dataKey, o = n.clockWise, u = n.id, s = n.textBreakAll, c = vy(n, dE);
  return !i || !i.length ? null : /* @__PURE__ */ E.createElement(Te, {
    className: "recharts-label-list"
  }, i.map(function(f, l) {
    var h = V(a) ? r(f, l) : Xe(f && f.payload, a), d = V(u) ? {} : {
      id: "".concat(u, "-").concat(l)
    };
    return /* @__PURE__ */ E.createElement(Ee, hi({}, se(f, !0), c, d, {
      parentViewBox: f.parentViewBox,
      value: h,
      textBreakAll: s,
      viewBox: Ee.parseViewBox(V(o) ? f : dy(dy({}, f), {}, {
        clockWise: o
      })),
      key: "label-".concat(l),
      index: l
    }));
  }));
}
Lt.displayName = "LabelList";
function AE(e, t) {
  return e ? e === !0 ? /* @__PURE__ */ E.createElement(Lt, {
    key: "labelList-implicit",
    data: t
  }) : /* @__PURE__ */ E.isValidElement(e) || J(e) ? /* @__PURE__ */ E.createElement(Lt, {
    key: "labelList-implicit",
    data: t,
    content: e
  }) : xr(e) ? /* @__PURE__ */ E.createElement(Lt, hi({
    data: t
  }, e, {
    key: "labelList-implicit"
  })) : null : null;
}
function PE(e, t) {
  var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  if (!e || !e.children && r && !e.label)
    return null;
  var n = e.children, i = Ke(n, Lt).map(function(o, u) {
    return /* @__PURE__ */ be(o, {
      data: t,
      // eslint-disable-next-line react/no-array-index-key
      key: "labelList-".concat(u)
    });
  });
  if (!r)
    return i;
  var a = AE(e.label, t);
  return [a].concat(vE(i));
}
Lt.renderCallByParent = PE;
function an(e) {
  "@babel/helpers - typeof";
  return an = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, an(e);
}
function zc() {
  return zc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, zc.apply(this, arguments);
}
function yy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function gy(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? yy(Object(r), !0).forEach(function(n) {
      TE(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : yy(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function TE(e, t, r) {
  return t = EE(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function EE(e) {
  var t = jE(e, "string");
  return an(t) == "symbol" ? t : t + "";
}
function jE(e, t) {
  if (an(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (an(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ME = function(t, r) {
  var n = Ze(r - t), i = Math.min(Math.abs(r - t), 359.999);
  return n * i;
}, Dn = function(t) {
  var r = t.cx, n = t.cy, i = t.radius, a = t.angle, o = t.sign, u = t.isExternal, s = t.cornerRadius, c = t.cornerIsExternal, f = s * (u ? 1 : -1) + i, l = Math.asin(s / f) / fi, h = c ? a : a + o * l, d = Pe(r, n, f, h), g = Pe(r, n, i, h), v = c ? a - o * l : a, p = Pe(r, n, f * Math.cos(l * fi), v);
  return {
    center: d,
    circleTangency: g,
    lineTangency: p,
    theta: l
  };
}, Xb = function(t) {
  var r = t.cx, n = t.cy, i = t.innerRadius, a = t.outerRadius, o = t.startAngle, u = t.endAngle, s = ME(o, u), c = o + s, f = Pe(r, n, a, o), l = Pe(r, n, a, c), h = "M ".concat(f.x, ",").concat(f.y, `
    A `).concat(a, ",").concat(a, `,0,
    `).concat(+(Math.abs(s) > 180), ",").concat(+(o > c), `,
    `).concat(l.x, ",").concat(l.y, `
  `);
  if (i > 0) {
    var d = Pe(r, n, i, o), g = Pe(r, n, i, c);
    h += "L ".concat(g.x, ",").concat(g.y, `
            A `).concat(i, ",").concat(i, `,0,
            `).concat(+(Math.abs(s) > 180), ",").concat(+(o <= c), `,
            `).concat(d.x, ",").concat(d.y, " Z");
  } else
    h += "L ".concat(r, ",").concat(n, " Z");
  return h;
}, CE = function(t) {
  var r = t.cx, n = t.cy, i = t.innerRadius, a = t.outerRadius, o = t.cornerRadius, u = t.forceCornerRadius, s = t.cornerIsExternal, c = t.startAngle, f = t.endAngle, l = Ze(f - c), h = Dn({
    cx: r,
    cy: n,
    radius: a,
    angle: c,
    sign: l,
    cornerRadius: o,
    cornerIsExternal: s
  }), d = h.circleTangency, g = h.lineTangency, v = h.theta, p = Dn({
    cx: r,
    cy: n,
    radius: a,
    angle: f,
    sign: -l,
    cornerRadius: o,
    cornerIsExternal: s
  }), m = p.circleTangency, w = p.lineTangency, x = p.theta, _ = s ? Math.abs(c - f) : Math.abs(c - f) - v - x;
  if (_ < 0)
    return u ? "M ".concat(g.x, ",").concat(g.y, `
        a`).concat(o, ",").concat(o, ",0,0,1,").concat(o * 2, `,0
        a`).concat(o, ",").concat(o, ",0,0,1,").concat(-o * 2, `,0
      `) : Xb({
      cx: r,
      cy: n,
      innerRadius: i,
      outerRadius: a,
      startAngle: c,
      endAngle: f
    });
  var y = "M ".concat(g.x, ",").concat(g.y, `
    A`).concat(o, ",").concat(o, ",0,0,").concat(+(l < 0), ",").concat(d.x, ",").concat(d.y, `
    A`).concat(a, ",").concat(a, ",0,").concat(+(_ > 180), ",").concat(+(l < 0), ",").concat(m.x, ",").concat(m.y, `
    A`).concat(o, ",").concat(o, ",0,0,").concat(+(l < 0), ",").concat(w.x, ",").concat(w.y, `
  `);
  if (i > 0) {
    var b = Dn({
      cx: r,
      cy: n,
      radius: i,
      angle: c,
      sign: l,
      isExternal: !0,
      cornerRadius: o,
      cornerIsExternal: s
    }), O = b.circleTangency, S = b.lineTangency, A = b.theta, C = Dn({
      cx: r,
      cy: n,
      radius: i,
      angle: f,
      sign: -l,
      isExternal: !0,
      cornerRadius: o,
      cornerIsExternal: s
    }), T = C.circleTangency, P = C.lineTangency, j = C.theta, I = s ? Math.abs(c - f) : Math.abs(c - f) - A - j;
    if (I < 0 && o === 0)
      return "".concat(y, "L").concat(r, ",").concat(n, "Z");
    y += "L".concat(P.x, ",").concat(P.y, `
      A`).concat(o, ",").concat(o, ",0,0,").concat(+(l < 0), ",").concat(T.x, ",").concat(T.y, `
      A`).concat(i, ",").concat(i, ",0,").concat(+(I > 180), ",").concat(+(l > 0), ",").concat(O.x, ",").concat(O.y, `
      A`).concat(o, ",").concat(o, ",0,0,").concat(+(l < 0), ",").concat(S.x, ",").concat(S.y, "Z");
  } else
    y += "L".concat(r, ",").concat(n, "Z");
  return y;
}, IE = {
  cx: 0,
  cy: 0,
  innerRadius: 0,
  outerRadius: 0,
  startAngle: 0,
  endAngle: 0,
  cornerRadius: 0,
  forceCornerRadius: !1,
  cornerIsExternal: !1
}, Vb = function(t) {
  var r = gy(gy({}, IE), t), n = r.cx, i = r.cy, a = r.innerRadius, o = r.outerRadius, u = r.cornerRadius, s = r.forceCornerRadius, c = r.cornerIsExternal, f = r.startAngle, l = r.endAngle, h = r.className;
  if (o < a || f === l)
    return null;
  var d = ue("recharts-sector", h), g = o - a, v = He(u, g, 0, !0), p;
  return v > 0 && Math.abs(f - l) < 360 ? p = CE({
    cx: n,
    cy: i,
    innerRadius: a,
    outerRadius: o,
    cornerRadius: Math.min(v, g / 2),
    forceCornerRadius: s,
    cornerIsExternal: c,
    startAngle: f,
    endAngle: l
  }) : p = Xb({
    cx: n,
    cy: i,
    innerRadius: a,
    outerRadius: o,
    startAngle: f,
    endAngle: l
  }), /* @__PURE__ */ E.createElement("path", zc({}, se(r, !0), {
    className: d,
    d: p,
    role: "img"
  }));
};
function on(e) {
  "@babel/helpers - typeof";
  return on = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, on(e);
}
function Hc() {
  return Hc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Hc.apply(this, arguments);
}
function my(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function by(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? my(Object(r), !0).forEach(function(n) {
      $E(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : my(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function $E(e, t, r) {
  return t = RE(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function RE(e) {
  var t = DE(e, "string");
  return on(t) == "symbol" ? t : t + "";
}
function DE(e, t) {
  if (on(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (on(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var wy = {
  curveBasisClosed: xx,
  curveBasisOpen: _x,
  curveBasis: wx,
  curveBumpX: ox,
  curveBumpY: ux,
  curveLinearClosed: Ox,
  curveLinear: Li,
  curveMonotoneX: Sx,
  curveMonotoneY: Ax,
  curveNatural: Px,
  curveStep: Tx,
  curveStepAfter: jx,
  curveStepBefore: Ex
}, Nn = function(t) {
  return t.x === +t.x && t.y === +t.y;
}, Mr = function(t) {
  return t.x;
}, Cr = function(t) {
  return t.y;
}, NE = function(t, r) {
  if (J(t))
    return t;
  var n = "curve".concat(qi(t));
  return (n === "curveMonotone" || n === "curveBump") && r ? wy["".concat(n).concat(r === "vertical" ? "Y" : "X")] : wy[n] || Li;
}, qE = function(t) {
  var r = t.type, n = r === void 0 ? "linear" : r, i = t.points, a = i === void 0 ? [] : i, o = t.baseLine, u = t.layout, s = t.connectNulls, c = s === void 0 ? !1 : s, f = NE(n, u), l = c ? a.filter(function(v) {
    return Nn(v);
  }) : a, h;
  if (Array.isArray(o)) {
    var d = c ? o.filter(function(v) {
      return Nn(v);
    }) : o, g = l.map(function(v, p) {
      return by(by({}, v), {}, {
        base: d[p]
      });
    });
    return u === "vertical" ? h = jn().y(Cr).x1(Mr).x0(function(v) {
      return v.base.x;
    }) : h = jn().x(Mr).y1(Cr).y0(function(v) {
      return v.base.y;
    }), h.defined(Nn).curve(f), h(g);
  }
  return u === "vertical" && B(o) ? h = jn().y(Cr).x1(Mr).x0(o) : B(o) ? h = jn().x(Mr).y1(Cr).y0(o) : h = em().x(Mr).y(Cr), h.defined(Nn).curve(f), h(l);
}, xy = function(t) {
  var r = t.className, n = t.points, i = t.path, a = t.pathRef;
  if ((!n || !n.length) && !i)
    return null;
  var o = n && n.length ? qE(t) : i;
  return /* @__PURE__ */ ji("path", Hc({}, se(t, !1), Un(t), {
    className: ue("recharts-curve", r),
    d: o,
    ref: a
  }));
};
const { getOwnPropertyNames: kE, getOwnPropertySymbols: LE } = Object, { hasOwnProperty: BE } = Object.prototype;
function Ds(e, t) {
  return function(n, i, a) {
    return e(n, i, a) && t(n, i, a);
  };
}
function qn(e) {
  return function(r, n, i) {
    if (!r || !n || typeof r != "object" || typeof n != "object")
      return e(r, n, i);
    const { cache: a } = i, o = a.get(r), u = a.get(n);
    if (o && u)
      return o === n && u === r;
    a.set(r, n), a.set(n, r);
    const s = e(r, n, i);
    return a.delete(r), a.delete(n), s;
  };
}
function FE(e) {
  return e?.[Symbol.toStringTag];
}
function _y(e) {
  return kE(e).concat(LE(e));
}
const UE = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  Object.hasOwn || ((e, t) => BE.call(e, t))
);
function Kt(e, t) {
  return e === t || !e && !t && e !== e && t !== t;
}
const WE = "__v", zE = "__o", HE = "_owner", { getOwnPropertyDescriptor: Oy, keys: Sy } = Object;
function GE(e, t) {
  return e.byteLength === t.byteLength && pi(new Uint8Array(e), new Uint8Array(t));
}
function KE(e, t, r) {
  let n = e.length;
  if (t.length !== n)
    return !1;
  for (; n-- > 0; )
    if (!r.equals(e[n], t[n], n, n, e, t, r))
      return !1;
  return !0;
}
function XE(e, t) {
  return e.byteLength === t.byteLength && pi(new Uint8Array(e.buffer, e.byteOffset, e.byteLength), new Uint8Array(t.buffer, t.byteOffset, t.byteLength));
}
function VE(e, t) {
  return Kt(e.getTime(), t.getTime());
}
function YE(e, t) {
  return e.name === t.name && e.message === t.message && e.cause === t.cause && e.stack === t.stack;
}
function ZE(e, t) {
  return e === t;
}
function Ay(e, t, r) {
  const n = e.size;
  if (n !== t.size)
    return !1;
  if (!n)
    return !0;
  const i = new Array(n), a = e.entries();
  let o, u, s = 0;
  for (; (o = a.next()) && !o.done; ) {
    const c = t.entries();
    let f = !1, l = 0;
    for (; (u = c.next()) && !u.done; ) {
      if (i[l]) {
        l++;
        continue;
      }
      const h = o.value, d = u.value;
      if (r.equals(h[0], d[0], s, l, e, t, r) && r.equals(h[1], d[1], h[0], d[0], e, t, r)) {
        f = i[l] = !0;
        break;
      }
      l++;
    }
    if (!f)
      return !1;
    s++;
  }
  return !0;
}
const JE = Kt;
function QE(e, t, r) {
  const n = Sy(e);
  let i = n.length;
  if (Sy(t).length !== i)
    return !1;
  for (; i-- > 0; )
    if (!Yb(e, t, r, n[i]))
      return !1;
  return !0;
}
function Ir(e, t, r) {
  const n = _y(e);
  let i = n.length;
  if (_y(t).length !== i)
    return !1;
  let a, o, u;
  for (; i-- > 0; )
    if (a = n[i], !Yb(e, t, r, a) || (o = Oy(e, a), u = Oy(t, a), (o || u) && (!o || !u || o.configurable !== u.configurable || o.enumerable !== u.enumerable || o.writable !== u.writable)))
      return !1;
  return !0;
}
function ej(e, t) {
  return Kt(e.valueOf(), t.valueOf());
}
function tj(e, t) {
  return e.source === t.source && e.flags === t.flags;
}
function Py(e, t, r) {
  const n = e.size;
  if (n !== t.size)
    return !1;
  if (!n)
    return !0;
  const i = new Array(n), a = e.values();
  let o, u;
  for (; (o = a.next()) && !o.done; ) {
    const s = t.values();
    let c = !1, f = 0;
    for (; (u = s.next()) && !u.done; ) {
      if (!i[f] && r.equals(o.value, u.value, o.value, u.value, e, t, r)) {
        c = i[f] = !0;
        break;
      }
      f++;
    }
    if (!c)
      return !1;
  }
  return !0;
}
function pi(e, t) {
  let r = e.byteLength;
  if (t.byteLength !== r || e.byteOffset !== t.byteOffset)
    return !1;
  for (; r-- > 0; )
    if (e[r] !== t[r])
      return !1;
  return !0;
}
function rj(e, t) {
  return e.hostname === t.hostname && e.pathname === t.pathname && e.protocol === t.protocol && e.port === t.port && e.hash === t.hash && e.username === t.username && e.password === t.password;
}
function Yb(e, t, r, n) {
  return (n === HE || n === zE || n === WE) && (e.$$typeof || t.$$typeof) ? !0 : UE(t, n) && r.equals(e[n], t[n], n, n, e, t, r);
}
const nj = "[object ArrayBuffer]", ij = "[object Arguments]", aj = "[object Boolean]", oj = "[object DataView]", uj = "[object Date]", sj = "[object Error]", cj = "[object Map]", lj = "[object Number]", fj = "[object Object]", hj = "[object RegExp]", pj = "[object Set]", dj = "[object String]", vj = {
  "[object Int8Array]": !0,
  "[object Uint8Array]": !0,
  "[object Uint8ClampedArray]": !0,
  "[object Int16Array]": !0,
  "[object Uint16Array]": !0,
  "[object Int32Array]": !0,
  "[object Uint32Array]": !0,
  "[object Float16Array]": !0,
  "[object Float32Array]": !0,
  "[object Float64Array]": !0,
  "[object BigInt64Array]": !0,
  "[object BigUint64Array]": !0
}, yj = "[object URL]", gj = Object.prototype.toString;
function mj({ areArrayBuffersEqual: e, areArraysEqual: t, areDataViewsEqual: r, areDatesEqual: n, areErrorsEqual: i, areFunctionsEqual: a, areMapsEqual: o, areNumbersEqual: u, areObjectsEqual: s, arePrimitiveWrappersEqual: c, areRegExpsEqual: f, areSetsEqual: l, areTypedArraysEqual: h, areUrlsEqual: d, unknownTagComparators: g }) {
  return function(p, m, w) {
    if (p === m)
      return !0;
    if (p == null || m == null)
      return !1;
    const x = typeof p;
    if (x !== typeof m)
      return !1;
    if (x !== "object")
      return x === "number" ? u(p, m, w) : x === "function" ? a(p, m, w) : !1;
    const _ = p.constructor;
    if (_ !== m.constructor)
      return !1;
    if (_ === Object)
      return s(p, m, w);
    if (Array.isArray(p))
      return t(p, m, w);
    if (_ === Date)
      return n(p, m, w);
    if (_ === RegExp)
      return f(p, m, w);
    if (_ === Map)
      return o(p, m, w);
    if (_ === Set)
      return l(p, m, w);
    const y = gj.call(p);
    if (y === uj)
      return n(p, m, w);
    if (y === hj)
      return f(p, m, w);
    if (y === cj)
      return o(p, m, w);
    if (y === pj)
      return l(p, m, w);
    if (y === fj)
      return typeof p.then != "function" && typeof m.then != "function" && s(p, m, w);
    if (y === yj)
      return d(p, m, w);
    if (y === sj)
      return i(p, m, w);
    if (y === ij)
      return s(p, m, w);
    if (vj[y])
      return h(p, m, w);
    if (y === nj)
      return e(p, m, w);
    if (y === oj)
      return r(p, m, w);
    if (y === aj || y === lj || y === dj)
      return c(p, m, w);
    if (g) {
      let b = g[y];
      if (!b) {
        const O = FE(p);
        O && (b = g[O]);
      }
      if (b)
        return b(p, m, w);
    }
    return !1;
  };
}
function bj({ circular: e, createCustomConfig: t, strict: r }) {
  let n = {
    areArrayBuffersEqual: GE,
    areArraysEqual: r ? Ir : KE,
    areDataViewsEqual: XE,
    areDatesEqual: VE,
    areErrorsEqual: YE,
    areFunctionsEqual: ZE,
    areMapsEqual: r ? Ds(Ay, Ir) : Ay,
    areNumbersEqual: JE,
    areObjectsEqual: r ? Ir : QE,
    arePrimitiveWrappersEqual: ej,
    areRegExpsEqual: tj,
    areSetsEqual: r ? Ds(Py, Ir) : Py,
    areTypedArraysEqual: r ? Ds(pi, Ir) : pi,
    areUrlsEqual: rj,
    unknownTagComparators: void 0
  };
  if (t && (n = Object.assign({}, n, t(n))), e) {
    const i = qn(n.areArraysEqual), a = qn(n.areMapsEqual), o = qn(n.areObjectsEqual), u = qn(n.areSetsEqual);
    n = Object.assign({}, n, {
      areArraysEqual: i,
      areMapsEqual: a,
      areObjectsEqual: o,
      areSetsEqual: u
    });
  }
  return n;
}
function wj(e) {
  return function(t, r, n, i, a, o, u) {
    return e(t, r, u);
  };
}
function xj({ circular: e, comparator: t, createState: r, equals: n, strict: i }) {
  if (r)
    return function(u, s) {
      const { cache: c = e ? /* @__PURE__ */ new WeakMap() : void 0, meta: f } = r();
      return t(u, s, {
        cache: c,
        equals: n,
        meta: f,
        strict: i
      });
    };
  if (e)
    return function(u, s) {
      return t(u, s, {
        cache: /* @__PURE__ */ new WeakMap(),
        equals: n,
        meta: void 0,
        strict: i
      });
    };
  const a = {
    cache: void 0,
    equals: n,
    meta: void 0,
    strict: i
  };
  return function(u, s) {
    return t(u, s, a);
  };
}
const _j = Tt();
Tt({ strict: !0 });
Tt({ circular: !0 });
Tt({
  circular: !0,
  strict: !0
});
Tt({
  createInternalComparator: () => Kt
});
Tt({
  strict: !0,
  createInternalComparator: () => Kt
});
Tt({
  circular: !0,
  createInternalComparator: () => Kt
});
Tt({
  circular: !0,
  createInternalComparator: () => Kt,
  strict: !0
});
function Tt(e = {}) {
  const { circular: t = !1, createInternalComparator: r, createState: n, strict: i = !1 } = e, a = bj(e), o = mj(a), u = r ? r(o) : wj(o);
  return xj({ circular: t, comparator: o, createState: n, equals: u, strict: i });
}
function Oj(e) {
  typeof requestAnimationFrame < "u" && requestAnimationFrame(e);
}
function Ty(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, r = -1, n = function i(a) {
    r < 0 && (r = a), a - r > t ? (e(a), r = -1) : Oj(i);
  };
  requestAnimationFrame(n);
}
function Gc(e) {
  "@babel/helpers - typeof";
  return Gc = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Gc(e);
}
function Sj(e) {
  return Ej(e) || Tj(e) || Pj(e) || Aj();
}
function Aj() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Pj(e, t) {
  if (e) {
    if (typeof e == "string") return Ey(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Ey(e, t);
  }
}
function Ey(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Tj(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Ej(e) {
  if (Array.isArray(e)) return e;
}
function jj() {
  var e = {}, t = function() {
    return null;
  }, r = !1, n = function i(a) {
    if (!r) {
      if (Array.isArray(a)) {
        if (!a.length)
          return;
        var o = a, u = Sj(o), s = u[0], c = u.slice(1);
        if (typeof s == "number") {
          Ty(i.bind(null, c), s);
          return;
        }
        i(s), Ty(i.bind(null, c));
        return;
      }
      Gc(a) === "object" && (e = a, t(e)), typeof a == "function" && a();
    }
  };
  return {
    stop: function() {
      r = !0;
    },
    start: function(a) {
      r = !1, n(a);
    },
    subscribe: function(a) {
      return t = a, function() {
        t = function() {
          return null;
        };
      };
    }
  };
}
function un(e) {
  "@babel/helpers - typeof";
  return un = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, un(e);
}
function jy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function My(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? jy(Object(r), !0).forEach(function(n) {
      Zb(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : jy(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Zb(e, t, r) {
  return t = Mj(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Mj(e) {
  var t = Cj(e, "string");
  return un(t) === "symbol" ? t : String(t);
}
function Cj(e, t) {
  if (un(e) !== "object" || e === null) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (un(n) !== "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ij = function(t, r) {
  return [Object.keys(t), Object.keys(r)].reduce(function(n, i) {
    return n.filter(function(a) {
      return i.includes(a);
    });
  });
}, $j = function(t) {
  return t;
}, Rj = function(t) {
  return t.replace(/([A-Z])/g, function(r) {
    return "-".concat(r.toLowerCase());
  });
}, Br = function(t, r) {
  return Object.keys(r).reduce(function(n, i) {
    return My(My({}, n), {}, Zb({}, i, t(i, r[i])));
  }, {});
}, Cy = function(t, r, n) {
  return t.map(function(i) {
    return "".concat(Rj(i), " ").concat(r, "ms ").concat(n);
  }).join(",");
};
function Dj(e, t) {
  return kj(e) || qj(e, t) || Jb(e, t) || Nj();
}
function Nj() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function qj(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], s = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(s = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); s = !0) ;
    } catch (f) {
      c = !0, i = f;
    } finally {
      try {
        if (!s && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function kj(e) {
  if (Array.isArray(e)) return e;
}
function Lj(e) {
  return Uj(e) || Fj(e) || Jb(e) || Bj();
}
function Bj() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Jb(e, t) {
  if (e) {
    if (typeof e == "string") return Kc(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Kc(e, t);
  }
}
function Fj(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Uj(e) {
  if (Array.isArray(e)) return Kc(e);
}
function Kc(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
var di = 1e-4, Qb = function(t, r) {
  return [0, 3 * t, 3 * r - 6 * t, 3 * t - 3 * r + 1];
}, e0 = function(t, r) {
  return t.map(function(n, i) {
    return n * Math.pow(r, i);
  }).reduce(function(n, i) {
    return n + i;
  });
}, Iy = function(t, r) {
  return function(n) {
    var i = Qb(t, r);
    return e0(i, n);
  };
}, Wj = function(t, r) {
  return function(n) {
    var i = Qb(t, r), a = [].concat(Lj(i.map(function(o, u) {
      return o * u;
    }).slice(1)), [0]);
    return e0(a, n);
  };
}, $y = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  var i = r[0], a = r[1], o = r[2], u = r[3];
  if (r.length === 1)
    switch (r[0]) {
      case "linear":
        i = 0, a = 0, o = 1, u = 1;
        break;
      case "ease":
        i = 0.25, a = 0.1, o = 0.25, u = 1;
        break;
      case "ease-in":
        i = 0.42, a = 0, o = 1, u = 1;
        break;
      case "ease-out":
        i = 0.42, a = 0, o = 0.58, u = 1;
        break;
      case "ease-in-out":
        i = 0, a = 0, o = 0.58, u = 1;
        break;
      default: {
        var s = r[0].split("(");
        if (s[0] === "cubic-bezier" && s[1].split(")")[0].split(",").length === 4) {
          var c = s[1].split(")")[0].split(",").map(function(p) {
            return parseFloat(p);
          }), f = Dj(c, 4);
          i = f[0], a = f[1], o = f[2], u = f[3];
        }
      }
    }
  var l = Iy(i, o), h = Iy(a, u), d = Wj(i, o), g = function(m) {
    return m > 1 ? 1 : m < 0 ? 0 : m;
  }, v = function(m) {
    for (var w = m > 1 ? 1 : m, x = w, _ = 0; _ < 8; ++_) {
      var y = l(x) - w, b = d(x);
      if (Math.abs(y - w) < di || b < di)
        return h(x);
      x = g(x - y / b);
    }
    return h(x);
  };
  return v.isStepper = !1, v;
}, zj = function() {
  var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = t.stiff, n = r === void 0 ? 100 : r, i = t.damping, a = i === void 0 ? 8 : i, o = t.dt, u = o === void 0 ? 17 : o, s = function(f, l, h) {
    var d = -(f - l) * n, g = h * a, v = h + (d - g) * u / 1e3, p = h * u / 1e3 + f;
    return Math.abs(p - l) < di && Math.abs(v) < di ? [l, 0] : [p, v];
  };
  return s.isStepper = !0, s.dt = u, s;
}, Hj = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  var i = r[0];
  if (typeof i == "string")
    switch (i) {
      case "ease":
      case "ease-in-out":
      case "ease-out":
      case "ease-in":
      case "linear":
        return $y(i);
      case "spring":
        return zj();
      default:
        if (i.split("(")[0] === "cubic-bezier")
          return $y(i);
    }
  return typeof i == "function" ? i : null;
};
function sn(e) {
  "@babel/helpers - typeof";
  return sn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, sn(e);
}
function Ry(e) {
  return Xj(e) || Kj(e) || t0(e) || Gj();
}
function Gj() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Kj(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Xj(e) {
  if (Array.isArray(e)) return Vc(e);
}
function Dy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ae(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Dy(Object(r), !0).forEach(function(n) {
      Xc(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Dy(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Xc(e, t, r) {
  return t = Vj(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Vj(e) {
  var t = Yj(e, "string");
  return sn(t) === "symbol" ? t : String(t);
}
function Yj(e, t) {
  if (sn(e) !== "object" || e === null) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (sn(n) !== "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Zj(e, t) {
  return eM(e) || Qj(e, t) || t0(e, t) || Jj();
}
function Jj() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function t0(e, t) {
  if (e) {
    if (typeof e == "string") return Vc(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Vc(e, t);
  }
}
function Vc(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Qj(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], s = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(s = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); s = !0) ;
    } catch (f) {
      c = !0, i = f;
    } finally {
      try {
        if (!s && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function eM(e) {
  if (Array.isArray(e)) return e;
}
var vi = function(t, r, n) {
  return t + (r - t) * n;
}, Yc = function(t) {
  var r = t.from, n = t.to;
  return r !== n;
}, tM = function e(t, r, n) {
  var i = Br(function(a, o) {
    if (Yc(o)) {
      var u = t(o.from, o.to, o.velocity), s = Zj(u, 2), c = s[0], f = s[1];
      return Ae(Ae({}, o), {}, {
        from: c,
        velocity: f
      });
    }
    return o;
  }, r);
  return n < 1 ? Br(function(a, o) {
    return Yc(o) ? Ae(Ae({}, o), {}, {
      velocity: vi(o.velocity, i[a].velocity, n),
      from: vi(o.from, i[a].from, n)
    }) : o;
  }, r) : e(t, i, n - 1);
};
const rM = (function(e, t, r, n, i) {
  var a = Ij(e, t), o = a.reduce(function(p, m) {
    return Ae(Ae({}, p), {}, Xc({}, m, [e[m], t[m]]));
  }, {}), u = a.reduce(function(p, m) {
    return Ae(Ae({}, p), {}, Xc({}, m, {
      from: e[m],
      velocity: 0,
      to: t[m]
    }));
  }, {}), s = -1, c, f, l = function() {
    return null;
  }, h = function() {
    return Br(function(m, w) {
      return w.from;
    }, u);
  }, d = function() {
    return !Object.values(u).filter(Yc).length;
  }, g = function(m) {
    c || (c = m);
    var w = m - c, x = w / r.dt;
    u = tM(r, u, x), i(Ae(Ae(Ae({}, e), t), h())), c = m, d() || (s = requestAnimationFrame(l));
  }, v = function(m) {
    f || (f = m);
    var w = (m - f) / n, x = Br(function(y, b) {
      return vi.apply(void 0, Ry(b).concat([r(w)]));
    }, o);
    if (i(Ae(Ae(Ae({}, e), t), x)), w < 1)
      s = requestAnimationFrame(l);
    else {
      var _ = Br(function(y, b) {
        return vi.apply(void 0, Ry(b).concat([r(1)]));
      }, o);
      i(Ae(Ae(Ae({}, e), t), _));
    }
  };
  return l = r.isStepper ? g : v, function() {
    return requestAnimationFrame(l), function() {
      cancelAnimationFrame(s);
    };
  };
});
function fr(e) {
  "@babel/helpers - typeof";
  return fr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, fr(e);
}
var nM = ["children", "begin", "duration", "attributeName", "easing", "isActive", "steps", "from", "to", "canBegin", "onAnimationEnd", "shouldReAnimate", "onAnimationReStart"];
function iM(e, t) {
  if (e == null) return {};
  var r = aM(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function aM(e, t) {
  if (e == null) return {};
  var r = {}, n = Object.keys(e), i, a;
  for (a = 0; a < n.length; a++)
    i = n[a], !(t.indexOf(i) >= 0) && (r[i] = e[i]);
  return r;
}
function Ns(e) {
  return cM(e) || sM(e) || uM(e) || oM();
}
function oM() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function uM(e, t) {
  if (e) {
    if (typeof e == "string") return Zc(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Zc(e, t);
  }
}
function sM(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function cM(e) {
  if (Array.isArray(e)) return Zc(e);
}
function Zc(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Ny(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function We(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ny(Object(r), !0).forEach(function(n) {
      qr(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ny(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function qr(e, t, r) {
  return t = r0(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function lM(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function fM(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, r0(n.key), n);
  }
}
function hM(e, t, r) {
  return t && fM(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function r0(e) {
  var t = pM(e, "string");
  return fr(t) === "symbol" ? t : String(t);
}
function pM(e, t) {
  if (fr(e) !== "object" || e === null) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (fr(n) !== "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function dM(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Jc(e, t);
}
function Jc(e, t) {
  return Jc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, i) {
    return n.__proto__ = i, n;
  }, Jc(e, t);
}
function vM(e) {
  var t = yM();
  return function() {
    var n = yi(e), i;
    if (t) {
      var a = yi(this).constructor;
      i = Reflect.construct(n, arguments, a);
    } else
      i = n.apply(this, arguments);
    return Qc(this, i);
  };
}
function Qc(e, t) {
  if (t && (fr(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return el(e);
}
function el(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function yM() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function yi(e) {
  return yi = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, yi(e);
}
var xt = /* @__PURE__ */ (function(e) {
  dM(r, e);
  var t = vM(r);
  function r(n, i) {
    var a;
    lM(this, r), a = t.call(this, n, i);
    var o = a.props, u = o.isActive, s = o.attributeName, c = o.from, f = o.to, l = o.steps, h = o.children, d = o.duration;
    if (a.handleStyleChange = a.handleStyleChange.bind(el(a)), a.changeStyle = a.changeStyle.bind(el(a)), !u || d <= 0)
      return a.state = {
        style: {}
      }, typeof h == "function" && (a.state = {
        style: f
      }), Qc(a);
    if (l && l.length)
      a.state = {
        style: l[0].style
      };
    else if (c) {
      if (typeof h == "function")
        return a.state = {
          style: c
        }, Qc(a);
      a.state = {
        style: s ? qr({}, s, c) : c
      };
    } else
      a.state = {
        style: {}
      };
    return a;
  }
  return hM(r, [{
    key: "componentDidMount",
    value: function() {
      var i = this.props, a = i.isActive, o = i.canBegin;
      this.mounted = !0, !(!a || !o) && this.runAnimation(this.props);
    }
  }, {
    key: "componentDidUpdate",
    value: function(i) {
      var a = this.props, o = a.isActive, u = a.canBegin, s = a.attributeName, c = a.shouldReAnimate, f = a.to, l = a.from, h = this.state.style;
      if (u) {
        if (!o) {
          var d = {
            style: s ? qr({}, s, f) : f
          };
          this.state && h && (s && h[s] !== f || !s && h !== f) && this.setState(d);
          return;
        }
        if (!(_j(i.to, f) && i.canBegin && i.isActive)) {
          var g = !i.canBegin || !i.isActive;
          this.manager && this.manager.stop(), this.stopJSAnimation && this.stopJSAnimation();
          var v = g || c ? l : i.to;
          if (this.state && h) {
            var p = {
              style: s ? qr({}, s, v) : v
            };
            (s && h[s] !== v || !s && h !== v) && this.setState(p);
          }
          this.runAnimation(We(We({}, this.props), {}, {
            from: v,
            begin: 0
          }));
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function() {
      this.mounted = !1;
      var i = this.props.onAnimationEnd;
      this.unSubscribe && this.unSubscribe(), this.manager && (this.manager.stop(), this.manager = null), this.stopJSAnimation && this.stopJSAnimation(), i && i();
    }
  }, {
    key: "handleStyleChange",
    value: function(i) {
      this.changeStyle(i);
    }
  }, {
    key: "changeStyle",
    value: function(i) {
      this.mounted && this.setState({
        style: i
      });
    }
  }, {
    key: "runJSAnimation",
    value: function(i) {
      var a = this, o = i.from, u = i.to, s = i.duration, c = i.easing, f = i.begin, l = i.onAnimationEnd, h = i.onAnimationStart, d = rM(o, u, Hj(c), s, this.changeStyle), g = function() {
        a.stopJSAnimation = d();
      };
      this.manager.start([h, f, g, s, l]);
    }
  }, {
    key: "runStepAnimation",
    value: function(i) {
      var a = this, o = i.steps, u = i.begin, s = i.onAnimationStart, c = o[0], f = c.style, l = c.duration, h = l === void 0 ? 0 : l, d = function(v, p, m) {
        if (m === 0)
          return v;
        var w = p.duration, x = p.easing, _ = x === void 0 ? "ease" : x, y = p.style, b = p.properties, O = p.onAnimationEnd, S = m > 0 ? o[m - 1] : p, A = b || Object.keys(y);
        if (typeof _ == "function" || _ === "spring")
          return [].concat(Ns(v), [a.runJSAnimation.bind(a, {
            from: S.style,
            to: y,
            duration: w,
            easing: _
          }), w]);
        var C = Cy(A, w, _), T = We(We(We({}, S.style), y), {}, {
          transition: C
        });
        return [].concat(Ns(v), [T, w, O]).filter($j);
      };
      return this.manager.start([s].concat(Ns(o.reduce(d, [f, Math.max(h, u)])), [i.onAnimationEnd]));
    }
  }, {
    key: "runAnimation",
    value: function(i) {
      this.manager || (this.manager = jj());
      var a = i.begin, o = i.duration, u = i.attributeName, s = i.to, c = i.easing, f = i.onAnimationStart, l = i.onAnimationEnd, h = i.steps, d = i.children, g = this.manager;
      if (this.unSubscribe = g.subscribe(this.handleStyleChange), typeof c == "function" || typeof d == "function" || c === "spring") {
        this.runJSAnimation(i);
        return;
      }
      if (h.length > 1) {
        this.runStepAnimation(i);
        return;
      }
      var v = u ? qr({}, u, s) : s, p = Cy(Object.keys(v), o, c);
      g.start([f, a, We(We({}, v), {}, {
        transition: p
      }), o, l]);
    }
  }, {
    key: "render",
    value: function() {
      var i = this.props, a = i.children;
      i.begin;
      var o = i.duration;
      i.attributeName, i.easing;
      var u = i.isActive;
      i.steps, i.from, i.to, i.canBegin, i.onAnimationEnd, i.shouldReAnimate, i.onAnimationReStart;
      var s = iM(i, nM), c = Nt.count(a), f = this.state.style;
      if (typeof a == "function")
        return a(f);
      if (!u || c === 0 || o <= 0)
        return a;
      var l = function(d) {
        var g = d.props, v = g.style, p = v === void 0 ? {} : v, m = g.className, w = /* @__PURE__ */ be(d, We(We({}, s), {}, {
          style: We(We({}, p), f),
          className: m
        }));
        return w;
      };
      return c === 1 ? l(Nt.only(a)) : /* @__PURE__ */ E.createElement("div", null, Nt.map(a, function(h) {
        return l(h);
      }));
    }
  }]), r;
})(Wt);
xt.displayName = "Animate";
xt.defaultProps = {
  begin: 0,
  duration: 1e3,
  from: "",
  to: "",
  attributeName: "",
  easing: "ease",
  isActive: !0,
  canBegin: !0,
  steps: [],
  onAnimationEnd: function() {
  },
  onAnimationStart: function() {
  }
};
xt.propTypes = {
  from: ee.oneOfType([ee.object, ee.string]),
  to: ee.oneOfType([ee.object, ee.string]),
  attributeName: ee.string,
  // animation duration
  duration: ee.number,
  begin: ee.number,
  easing: ee.oneOfType([ee.string, ee.func]),
  steps: ee.arrayOf(ee.shape({
    duration: ee.number.isRequired,
    style: ee.object.isRequired,
    easing: ee.oneOfType([ee.oneOf(["ease", "ease-in", "ease-out", "ease-in-out", "linear"]), ee.func]),
    // transition css properties(dash case), optional
    properties: ee.arrayOf("string"),
    onAnimationEnd: ee.func
  })),
  children: ee.oneOfType([ee.node, ee.func]),
  isActive: ee.bool,
  canBegin: ee.bool,
  onAnimationEnd: ee.func,
  // decide if it should reanimate with initial from style when props change
  shouldReAnimate: ee.bool,
  onAnimationStart: ee.func,
  onAnimationReStart: ee.func
};
function cn(e) {
  "@babel/helpers - typeof";
  return cn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, cn(e);
}
function gi() {
  return gi = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, gi.apply(this, arguments);
}
function gM(e, t) {
  return xM(e) || wM(e, t) || bM(e, t) || mM();
}
function mM() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function bM(e, t) {
  if (e) {
    if (typeof e == "string") return qy(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return qy(e, t);
  }
}
function qy(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function wM(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], s = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(s = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); s = !0) ;
    } catch (f) {
      c = !0, i = f;
    } finally {
      try {
        if (!s && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function xM(e) {
  if (Array.isArray(e)) return e;
}
function ky(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ly(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ky(Object(r), !0).forEach(function(n) {
      _M(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ky(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function _M(e, t, r) {
  return t = OM(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function OM(e) {
  var t = SM(e, "string");
  return cn(t) == "symbol" ? t : t + "";
}
function SM(e, t) {
  if (cn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (cn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var By = function(t, r, n, i, a) {
  var o = Math.min(Math.abs(n) / 2, Math.abs(i) / 2), u = i >= 0 ? 1 : -1, s = n >= 0 ? 1 : -1, c = i >= 0 && n >= 0 || i < 0 && n < 0 ? 1 : 0, f;
  if (o > 0 && a instanceof Array) {
    for (var l = [0, 0, 0, 0], h = 0, d = 4; h < d; h++)
      l[h] = a[h] > o ? o : a[h];
    f = "M".concat(t, ",").concat(r + u * l[0]), l[0] > 0 && (f += "A ".concat(l[0], ",").concat(l[0], ",0,0,").concat(c, ",").concat(t + s * l[0], ",").concat(r)), f += "L ".concat(t + n - s * l[1], ",").concat(r), l[1] > 0 && (f += "A ".concat(l[1], ",").concat(l[1], ",0,0,").concat(c, `,
        `).concat(t + n, ",").concat(r + u * l[1])), f += "L ".concat(t + n, ",").concat(r + i - u * l[2]), l[2] > 0 && (f += "A ".concat(l[2], ",").concat(l[2], ",0,0,").concat(c, `,
        `).concat(t + n - s * l[2], ",").concat(r + i)), f += "L ".concat(t + s * l[3], ",").concat(r + i), l[3] > 0 && (f += "A ".concat(l[3], ",").concat(l[3], ",0,0,").concat(c, `,
        `).concat(t, ",").concat(r + i - u * l[3])), f += "Z";
  } else if (o > 0 && a === +a && a > 0) {
    var g = Math.min(o, a);
    f = "M ".concat(t, ",").concat(r + u * g, `
            A `).concat(g, ",").concat(g, ",0,0,").concat(c, ",").concat(t + s * g, ",").concat(r, `
            L `).concat(t + n - s * g, ",").concat(r, `
            A `).concat(g, ",").concat(g, ",0,0,").concat(c, ",").concat(t + n, ",").concat(r + u * g, `
            L `).concat(t + n, ",").concat(r + i - u * g, `
            A `).concat(g, ",").concat(g, ",0,0,").concat(c, ",").concat(t + n - s * g, ",").concat(r + i, `
            L `).concat(t + s * g, ",").concat(r + i, `
            A `).concat(g, ",").concat(g, ",0,0,").concat(c, ",").concat(t, ",").concat(r + i - u * g, " Z");
  } else
    f = "M ".concat(t, ",").concat(r, " h ").concat(n, " v ").concat(i, " h ").concat(-n, " Z");
  return f;
}, AM = function(t, r) {
  if (!t || !r)
    return !1;
  var n = t.x, i = t.y, a = r.x, o = r.y, u = r.width, s = r.height;
  if (Math.abs(u) > 0 && Math.abs(s) > 0) {
    var c = Math.min(a, a + u), f = Math.max(a, a + u), l = Math.min(o, o + s), h = Math.max(o, o + s);
    return n >= c && n <= f && i >= l && i <= h;
  }
  return !1;
}, PM = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  // The radius of border
  // The radius of four corners when radius is a number
  // The radius of left-top, right-top, right-bottom, left-bottom when radius is an array
  radius: 0,
  isAnimationActive: !1,
  isUpdateAnimationActive: !1,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease"
}, df = function(t) {
  var r = Ly(Ly({}, PM), t), n = Bn(), i = ml(-1), a = gM(i, 2), o = a[0], u = a[1];
  bl(function() {
    if (n.current && n.current.getTotalLength)
      try {
        var _ = n.current.getTotalLength();
        _ && u(_);
      } catch {
      }
  }, []);
  var s = r.x, c = r.y, f = r.width, l = r.height, h = r.radius, d = r.className, g = r.animationEasing, v = r.animationDuration, p = r.animationBegin, m = r.isAnimationActive, w = r.isUpdateAnimationActive;
  if (s !== +s || c !== +c || f !== +f || l !== +l || f === 0 || l === 0)
    return null;
  var x = ue("recharts-rectangle", d);
  return w ? /* @__PURE__ */ E.createElement(xt, {
    canBegin: o > 0,
    from: {
      width: f,
      height: l,
      x: s,
      y: c
    },
    to: {
      width: f,
      height: l,
      x: s,
      y: c
    },
    duration: v,
    animationEasing: g,
    isActive: w
  }, function(_) {
    var y = _.width, b = _.height, O = _.x, S = _.y;
    return /* @__PURE__ */ E.createElement(xt, {
      canBegin: o > 0,
      from: "0px ".concat(o === -1 ? 1 : o, "px"),
      to: "".concat(o, "px 0px"),
      attributeName: "strokeDasharray",
      begin: p,
      duration: v,
      isActive: m,
      easing: g
    }, /* @__PURE__ */ E.createElement("path", gi({}, se(r, !0), {
      className: x,
      d: By(O, S, y, b, h),
      ref: n
    })));
  }) : /* @__PURE__ */ E.createElement("path", gi({}, se(r, !0), {
    className: x,
    d: By(s, c, f, l, h)
  }));
};
function tl() {
  return tl = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, tl.apply(this, arguments);
}
var n0 = function(t) {
  var r = t.cx, n = t.cy, i = t.r, a = t.className, o = ue("recharts-dot", a);
  return r === +r && n === +n && i === +i ? /* @__PURE__ */ ji("circle", tl({}, se(t, !1), Un(t), {
    className: o,
    cx: r,
    cy: n,
    r: i
  })) : null;
};
function ln(e) {
  "@babel/helpers - typeof";
  return ln = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ln(e);
}
var TM = ["x", "y", "top", "left", "width", "height", "className"];
function rl() {
  return rl = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, rl.apply(this, arguments);
}
function Fy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function EM(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Fy(Object(r), !0).forEach(function(n) {
      jM(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Fy(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function jM(e, t, r) {
  return t = MM(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function MM(e) {
  var t = CM(e, "string");
  return ln(t) == "symbol" ? t : t + "";
}
function CM(e, t) {
  if (ln(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ln(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function IM(e, t) {
  if (e == null) return {};
  var r = $M(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function $M(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var RM = function(t, r, n, i, a, o) {
  return "M".concat(t, ",").concat(a, "v").concat(i, "M").concat(o, ",").concat(r, "h").concat(n);
}, DM = function(t) {
  var r = t.x, n = r === void 0 ? 0 : r, i = t.y, a = i === void 0 ? 0 : i, o = t.top, u = o === void 0 ? 0 : o, s = t.left, c = s === void 0 ? 0 : s, f = t.width, l = f === void 0 ? 0 : f, h = t.height, d = h === void 0 ? 0 : h, g = t.className, v = IM(t, TM), p = EM({
    x: n,
    y: a,
    top: u,
    left: c,
    width: l,
    height: d
  }, v);
  return !B(n) || !B(a) || !B(l) || !B(d) || !B(u) || !B(c) ? null : /* @__PURE__ */ E.createElement("path", rl({}, se(p, !0), {
    className: ue("recharts-cross", g),
    d: RM(n, a, l, d, u, c)
  }));
}, qs, Uy;
function NM() {
  if (Uy) return qs;
  Uy = 1;
  var e = Om(), t = e(Object.getPrototypeOf, Object);
  return qs = t, qs;
}
var ks, Wy;
function qM() {
  if (Wy) return ks;
  Wy = 1;
  var e = pt(), t = NM(), r = dt(), n = "[object Object]", i = Function.prototype, a = Object.prototype, o = i.toString, u = a.hasOwnProperty, s = o.call(Object);
  function c(f) {
    if (!r(f) || e(f) != n)
      return !1;
    var l = t(f);
    if (l === null)
      return !0;
    var h = u.call(l, "constructor") && l.constructor;
    return typeof h == "function" && h instanceof h && o.call(h) == s;
  }
  return ks = c, ks;
}
var kM = qM();
const LM = /* @__PURE__ */ ce(kM);
var Ls, zy;
function BM() {
  if (zy) return Ls;
  zy = 1;
  var e = pt(), t = dt(), r = "[object Boolean]";
  function n(i) {
    return i === !0 || i === !1 || t(i) && e(i) == r;
  }
  return Ls = n, Ls;
}
var FM = BM();
const UM = /* @__PURE__ */ ce(FM);
function fn(e) {
  "@babel/helpers - typeof";
  return fn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, fn(e);
}
function mi() {
  return mi = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, mi.apply(this, arguments);
}
function WM(e, t) {
  return KM(e) || GM(e, t) || HM(e, t) || zM();
}
function zM() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function HM(e, t) {
  if (e) {
    if (typeof e == "string") return Hy(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Hy(e, t);
  }
}
function Hy(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function GM(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], s = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(s = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); s = !0) ;
    } catch (f) {
      c = !0, i = f;
    } finally {
      try {
        if (!s && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function KM(e) {
  if (Array.isArray(e)) return e;
}
function Gy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ky(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Gy(Object(r), !0).forEach(function(n) {
      XM(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Gy(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function XM(e, t, r) {
  return t = VM(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function VM(e) {
  var t = YM(e, "string");
  return fn(t) == "symbol" ? t : t + "";
}
function YM(e, t) {
  if (fn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (fn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Xy = function(t, r, n, i, a) {
  var o = n - i, u;
  return u = "M ".concat(t, ",").concat(r), u += "L ".concat(t + n, ",").concat(r), u += "L ".concat(t + n - o / 2, ",").concat(r + a), u += "L ".concat(t + n - o / 2 - i, ",").concat(r + a), u += "L ".concat(t, ",").concat(r, " Z"), u;
}, ZM = {
  x: 0,
  y: 0,
  upperWidth: 0,
  lowerWidth: 0,
  height: 0,
  isUpdateAnimationActive: !1,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease"
}, JM = function(t) {
  var r = Ky(Ky({}, ZM), t), n = Bn(), i = ml(-1), a = WM(i, 2), o = a[0], u = a[1];
  bl(function() {
    if (n.current && n.current.getTotalLength)
      try {
        var x = n.current.getTotalLength();
        x && u(x);
      } catch {
      }
  }, []);
  var s = r.x, c = r.y, f = r.upperWidth, l = r.lowerWidth, h = r.height, d = r.className, g = r.animationEasing, v = r.animationDuration, p = r.animationBegin, m = r.isUpdateAnimationActive;
  if (s !== +s || c !== +c || f !== +f || l !== +l || h !== +h || f === 0 && l === 0 || h === 0)
    return null;
  var w = ue("recharts-trapezoid", d);
  return m ? /* @__PURE__ */ E.createElement(xt, {
    canBegin: o > 0,
    from: {
      upperWidth: 0,
      lowerWidth: 0,
      height: h,
      x: s,
      y: c
    },
    to: {
      upperWidth: f,
      lowerWidth: l,
      height: h,
      x: s,
      y: c
    },
    duration: v,
    animationEasing: g,
    isActive: m
  }, function(x) {
    var _ = x.upperWidth, y = x.lowerWidth, b = x.height, O = x.x, S = x.y;
    return /* @__PURE__ */ E.createElement(xt, {
      canBegin: o > 0,
      from: "0px ".concat(o === -1 ? 1 : o, "px"),
      to: "".concat(o, "px 0px"),
      attributeName: "strokeDasharray",
      begin: p,
      duration: v,
      easing: g
    }, /* @__PURE__ */ E.createElement("path", mi({}, se(r, !0), {
      className: w,
      d: Xy(O, S, _, y, b),
      ref: n
    })));
  }) : /* @__PURE__ */ E.createElement("g", null, /* @__PURE__ */ E.createElement("path", mi({}, se(r, !0), {
    className: w,
    d: Xy(s, c, f, l, h)
  })));
}, QM = ["option", "shapeType", "propTransformer", "activeClassName", "isActive"];
function hn(e) {
  "@babel/helpers - typeof";
  return hn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, hn(e);
}
function eC(e, t) {
  if (e == null) return {};
  var r = tC(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function tC(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function Vy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function bi(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Vy(Object(r), !0).forEach(function(n) {
      rC(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Vy(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function rC(e, t, r) {
  return t = nC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function nC(e) {
  var t = iC(e, "string");
  return hn(t) == "symbol" ? t : t + "";
}
function iC(e, t) {
  if (hn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (hn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function aC(e, t) {
  return bi(bi({}, t), e);
}
function oC(e, t) {
  return e === "symbols";
}
function Yy(e) {
  var t = e.shapeType, r = e.elementProps;
  switch (t) {
    case "rectangle":
      return /* @__PURE__ */ E.createElement(df, r);
    case "trapezoid":
      return /* @__PURE__ */ E.createElement(JM, r);
    case "sector":
      return /* @__PURE__ */ E.createElement(Vb, r);
    case "symbols":
      if (oC(t))
        return /* @__PURE__ */ E.createElement($l, r);
      break;
    default:
      return null;
  }
}
function uC(e) {
  return /* @__PURE__ */ Ge(e) ? e.props : e;
}
function sC(e) {
  var t = e.option, r = e.shapeType, n = e.propTransformer, i = n === void 0 ? aC : n, a = e.activeClassName, o = a === void 0 ? "recharts-active-shape" : a, u = e.isActive, s = eC(e, QM), c;
  if (/* @__PURE__ */ Ge(t))
    c = /* @__PURE__ */ be(t, bi(bi({}, s), uC(t)));
  else if (J(t))
    c = t(s);
  else if (LM(t) && !UM(t)) {
    var f = i(t, s);
    c = /* @__PURE__ */ E.createElement(Yy, {
      shapeType: r,
      elementProps: f
    });
  } else {
    var l = s;
    c = /* @__PURE__ */ E.createElement(Yy, {
      shapeType: r,
      elementProps: l
    });
  }
  return u ? /* @__PURE__ */ E.createElement(Te, {
    className: o
  }, c) : c;
}
function ra(e, t) {
  return t != null && "trapezoids" in e.props;
}
function na(e, t) {
  return t != null && "sectors" in e.props;
}
function pn(e, t) {
  return t != null && "points" in e.props;
}
function cC(e, t) {
  var r, n, i = e.x === (t == null || (r = t.labelViewBox) === null || r === void 0 ? void 0 : r.x) || e.x === t.x, a = e.y === (t == null || (n = t.labelViewBox) === null || n === void 0 ? void 0 : n.y) || e.y === t.y;
  return i && a;
}
function lC(e, t) {
  var r = e.endAngle === t.endAngle, n = e.startAngle === t.startAngle;
  return r && n;
}
function fC(e, t) {
  var r = e.x === t.x, n = e.y === t.y, i = e.z === t.z;
  return r && n && i;
}
function hC(e, t) {
  var r;
  return ra(e, t) ? r = cC : na(e, t) ? r = lC : pn(e, t) && (r = fC), r;
}
function pC(e, t) {
  var r;
  return ra(e, t) ? r = "trapezoids" : na(e, t) ? r = "sectors" : pn(e, t) && (r = "points"), r;
}
function dC(e, t) {
  if (ra(e, t)) {
    var r;
    return (r = t.tooltipPayload) === null || r === void 0 || (r = r[0]) === null || r === void 0 || (r = r.payload) === null || r === void 0 ? void 0 : r.payload;
  }
  if (na(e, t)) {
    var n;
    return (n = t.tooltipPayload) === null || n === void 0 || (n = n[0]) === null || n === void 0 || (n = n.payload) === null || n === void 0 ? void 0 : n.payload;
  }
  return pn(e, t) ? t.payload : {};
}
function vC(e) {
  var t = e.activeTooltipItem, r = e.graphicalItem, n = e.itemData, i = pC(r, t), a = dC(r, t), o = n.filter(function(s, c) {
    var f = lf(a, s), l = r.props[i].filter(function(g) {
      var v = hC(r, t);
      return v(g, t);
    }), h = r.props[i].indexOf(l[l.length - 1]), d = c === h;
    return f && d;
  }), u = n.indexOf(o[o.length - 1]);
  return u;
}
var Bs, Zy;
function yC() {
  if (Zy) return Bs;
  Zy = 1;
  var e = Math.ceil, t = Math.max;
  function r(n, i, a, o) {
    for (var u = -1, s = t(e((i - n) / (a || 1)), 0), c = Array(s); s--; )
      c[o ? s : ++u] = n, n += a;
    return c;
  }
  return Bs = r, Bs;
}
var Fs, Jy;
function i0() {
  if (Jy) return Fs;
  Jy = 1;
  var e = Lm(), t = 1 / 0, r = 17976931348623157e292;
  function n(i) {
    if (!i)
      return i === 0 ? i : 0;
    if (i = e(i), i === t || i === -t) {
      var a = i < 0 ? -1 : 1;
      return a * r;
    }
    return i === i ? i : 0;
  }
  return Fs = n, Fs;
}
var Us, Qy;
function gC() {
  if (Qy) return Us;
  Qy = 1;
  var e = yC(), t = Wi(), r = i0();
  function n(i) {
    return function(a, o, u) {
      return u && typeof u != "number" && t(a, o, u) && (o = u = void 0), a = r(a), o === void 0 ? (o = a, a = 0) : o = r(o), u = u === void 0 ? a < o ? 1 : -1 : r(u), e(a, o, u, i);
    };
  }
  return Us = n, Us;
}
var Ws, eg;
function mC() {
  if (eg) return Ws;
  eg = 1;
  var e = gC(), t = e();
  return Ws = t, Ws;
}
var bC = mC();
const wi = /* @__PURE__ */ ce(bC);
function dn(e) {
  "@babel/helpers - typeof";
  return dn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, dn(e);
}
function tg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function rg(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? tg(Object(r), !0).forEach(function(n) {
      a0(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : tg(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function a0(e, t, r) {
  return t = wC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function wC(e) {
  var t = xC(e, "string");
  return dn(t) == "symbol" ? t : t + "";
}
function xC(e, t) {
  if (dn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (dn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var _C = ["Webkit", "Moz", "O", "ms"], OC = function(t, r) {
  var n = t.replace(/(\w)/, function(a) {
    return a.toUpperCase();
  }), i = _C.reduce(function(a, o) {
    return rg(rg({}, a), {}, a0({}, o + n, r));
  }, {});
  return i[t] = r, i;
};
function hr(e) {
  "@babel/helpers - typeof";
  return hr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, hr(e);
}
function xi() {
  return xi = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, xi.apply(this, arguments);
}
function ng(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function zs(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ng(Object(r), !0).forEach(function(n) {
      Re(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ng(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function SC(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function ig(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, u0(n.key), n);
  }
}
function AC(e, t, r) {
  return t && ig(e.prototype, t), r && ig(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function PC(e, t, r) {
  return t = _i(t), TC(e, o0() ? Reflect.construct(t, r || [], _i(e).constructor) : t.apply(e, r));
}
function TC(e, t) {
  if (t && (hr(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return EC(e);
}
function EC(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function o0() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (o0 = function() {
    return !!e;
  })();
}
function _i(e) {
  return _i = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, _i(e);
}
function jC(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && nl(e, t);
}
function nl(e, t) {
  return nl = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, i) {
    return n.__proto__ = i, n;
  }, nl(e, t);
}
function Re(e, t, r) {
  return t = u0(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function u0(e) {
  var t = MC(e, "string");
  return hr(t) == "symbol" ? t : t + "";
}
function MC(e, t) {
  if (hr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (hr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var CC = function(t) {
  var r = t.data, n = t.startIndex, i = t.endIndex, a = t.x, o = t.width, u = t.travellerWidth;
  if (!r || !r.length)
    return {};
  var s = r.length, c = kr().domain(wi(0, s)).range([a, a + o - u]), f = c.domain().map(function(l) {
    return c(l);
  });
  return {
    isTextActive: !1,
    isSlideMoving: !1,
    isTravellerMoving: !1,
    isTravellerFocused: !1,
    startX: c(n),
    endX: c(i),
    scale: c,
    scaleValues: f
  };
}, ag = function(t) {
  return t.changedTouches && !!t.changedTouches.length;
}, pr = /* @__PURE__ */ (function(e) {
  function t(r) {
    var n;
    return SC(this, t), n = PC(this, t, [r]), Re(n, "handleDrag", function(i) {
      n.leaveTimer && (clearTimeout(n.leaveTimer), n.leaveTimer = null), n.state.isTravellerMoving ? n.handleTravellerMove(i) : n.state.isSlideMoving && n.handleSlideDrag(i);
    }), Re(n, "handleTouchMove", function(i) {
      i.changedTouches != null && i.changedTouches.length > 0 && n.handleDrag(i.changedTouches[0]);
    }), Re(n, "handleDragEnd", function() {
      n.setState({
        isTravellerMoving: !1,
        isSlideMoving: !1
      }, function() {
        var i = n.props, a = i.endIndex, o = i.onDragEnd, u = i.startIndex;
        o?.({
          endIndex: a,
          startIndex: u
        });
      }), n.detachDragEndListener();
    }), Re(n, "handleLeaveWrapper", function() {
      (n.state.isTravellerMoving || n.state.isSlideMoving) && (n.leaveTimer = window.setTimeout(n.handleDragEnd, n.props.leaveTimeOut));
    }), Re(n, "handleEnterSlideOrTraveller", function() {
      n.setState({
        isTextActive: !0
      });
    }), Re(n, "handleLeaveSlideOrTraveller", function() {
      n.setState({
        isTextActive: !1
      });
    }), Re(n, "handleSlideDragStart", function(i) {
      var a = ag(i) ? i.changedTouches[0] : i;
      n.setState({
        isTravellerMoving: !1,
        isSlideMoving: !0,
        slideMoveStartX: a.pageX
      }), n.attachDragEndListener();
    }), n.travellerDragStartHandlers = {
      startX: n.handleTravellerDragStart.bind(n, "startX"),
      endX: n.handleTravellerDragStart.bind(n, "endX")
    }, n.state = {}, n;
  }
  return jC(t, e), AC(t, [{
    key: "componentWillUnmount",
    value: function() {
      this.leaveTimer && (clearTimeout(this.leaveTimer), this.leaveTimer = null), this.detachDragEndListener();
    }
  }, {
    key: "getIndex",
    value: function(n) {
      var i = n.startX, a = n.endX, o = this.state.scaleValues, u = this.props, s = u.gap, c = u.data, f = c.length - 1, l = Math.min(i, a), h = Math.max(i, a), d = t.getIndexInRange(o, l), g = t.getIndexInRange(o, h);
      return {
        startIndex: d - d % s,
        endIndex: g === f ? f : g - g % s
      };
    }
  }, {
    key: "getTextOfTick",
    value: function(n) {
      var i = this.props, a = i.data, o = i.tickFormatter, u = i.dataKey, s = Xe(a[n], u, n);
      return J(o) ? o(s, n) : s;
    }
  }, {
    key: "attachDragEndListener",
    value: function() {
      window.addEventListener("mouseup", this.handleDragEnd, !0), window.addEventListener("touchend", this.handleDragEnd, !0), window.addEventListener("mousemove", this.handleDrag, !0);
    }
  }, {
    key: "detachDragEndListener",
    value: function() {
      window.removeEventListener("mouseup", this.handleDragEnd, !0), window.removeEventListener("touchend", this.handleDragEnd, !0), window.removeEventListener("mousemove", this.handleDrag, !0);
    }
  }, {
    key: "handleSlideDrag",
    value: function(n) {
      var i = this.state, a = i.slideMoveStartX, o = i.startX, u = i.endX, s = this.props, c = s.x, f = s.width, l = s.travellerWidth, h = s.startIndex, d = s.endIndex, g = s.onChange, v = n.pageX - a;
      v > 0 ? v = Math.min(v, c + f - l - u, c + f - l - o) : v < 0 && (v = Math.max(v, c - o, c - u));
      var p = this.getIndex({
        startX: o + v,
        endX: u + v
      });
      (p.startIndex !== h || p.endIndex !== d) && g && g(p), this.setState({
        startX: o + v,
        endX: u + v,
        slideMoveStartX: n.pageX
      });
    }
  }, {
    key: "handleTravellerDragStart",
    value: function(n, i) {
      var a = ag(i) ? i.changedTouches[0] : i;
      this.setState({
        isSlideMoving: !1,
        isTravellerMoving: !0,
        movingTravellerId: n,
        brushMoveStartX: a.pageX
      }), this.attachDragEndListener();
    }
  }, {
    key: "handleTravellerMove",
    value: function(n) {
      var i = this.state, a = i.brushMoveStartX, o = i.movingTravellerId, u = i.endX, s = i.startX, c = this.state[o], f = this.props, l = f.x, h = f.width, d = f.travellerWidth, g = f.onChange, v = f.gap, p = f.data, m = {
        startX: this.state.startX,
        endX: this.state.endX
      }, w = n.pageX - a;
      w > 0 ? w = Math.min(w, l + h - d - c) : w < 0 && (w = Math.max(w, l - c)), m[o] = c + w;
      var x = this.getIndex(m), _ = x.startIndex, y = x.endIndex, b = function() {
        var S = p.length - 1;
        return o === "startX" && (u > s ? _ % v === 0 : y % v === 0) || u < s && y === S || o === "endX" && (u > s ? y % v === 0 : _ % v === 0) || u > s && y === S;
      };
      this.setState(Re(Re({}, o, c + w), "brushMoveStartX", n.pageX), function() {
        g && b() && g(x);
      });
    }
  }, {
    key: "handleTravellerMoveKeyboard",
    value: function(n, i) {
      var a = this, o = this.state, u = o.scaleValues, s = o.startX, c = o.endX, f = this.state[i], l = u.indexOf(f);
      if (l !== -1) {
        var h = l + n;
        if (!(h === -1 || h >= u.length)) {
          var d = u[h];
          i === "startX" && d >= c || i === "endX" && d <= s || this.setState(Re({}, i, d), function() {
            a.props.onChange(a.getIndex({
              startX: a.state.startX,
              endX: a.state.endX
            }));
          });
        }
      }
    }
  }, {
    key: "renderBackground",
    value: function() {
      var n = this.props, i = n.x, a = n.y, o = n.width, u = n.height, s = n.fill, c = n.stroke;
      return /* @__PURE__ */ E.createElement("rect", {
        stroke: c,
        fill: s,
        x: i,
        y: a,
        width: o,
        height: u
      });
    }
  }, {
    key: "renderPanorama",
    value: function() {
      var n = this.props, i = n.x, a = n.y, o = n.width, u = n.height, s = n.data, c = n.children, f = n.padding, l = Nt.only(c);
      return l ? /* @__PURE__ */ E.cloneElement(l, {
        x: i,
        y: a,
        width: o,
        height: u,
        margin: f,
        compact: !0,
        data: s
      }) : null;
    }
  }, {
    key: "renderTravellerLayer",
    value: function(n, i) {
      var a, o, u = this, s = this.props, c = s.y, f = s.travellerWidth, l = s.height, h = s.traveller, d = s.ariaLabel, g = s.data, v = s.startIndex, p = s.endIndex, m = Math.max(n, this.props.x), w = zs(zs({}, se(this.props, !1)), {}, {
        x: m,
        y: c,
        width: f,
        height: l
      }), x = d || "Min value: ".concat((a = g[v]) === null || a === void 0 ? void 0 : a.name, ", Max value: ").concat((o = g[p]) === null || o === void 0 ? void 0 : o.name);
      return /* @__PURE__ */ E.createElement(Te, {
        tabIndex: 0,
        role: "slider",
        "aria-label": x,
        "aria-valuenow": n,
        className: "recharts-brush-traveller",
        onMouseEnter: this.handleEnterSlideOrTraveller,
        onMouseLeave: this.handleLeaveSlideOrTraveller,
        onMouseDown: this.travellerDragStartHandlers[i],
        onTouchStart: this.travellerDragStartHandlers[i],
        onKeyDown: function(y) {
          ["ArrowLeft", "ArrowRight"].includes(y.key) && (y.preventDefault(), y.stopPropagation(), u.handleTravellerMoveKeyboard(y.key === "ArrowRight" ? 1 : -1, i));
        },
        onFocus: function() {
          u.setState({
            isTravellerFocused: !0
          });
        },
        onBlur: function() {
          u.setState({
            isTravellerFocused: !1
          });
        },
        style: {
          cursor: "col-resize"
        }
      }, t.renderTraveller(h, w));
    }
  }, {
    key: "renderSlide",
    value: function(n, i) {
      var a = this.props, o = a.y, u = a.height, s = a.stroke, c = a.travellerWidth, f = Math.min(n, i) + c, l = Math.max(Math.abs(i - n) - c, 0);
      return /* @__PURE__ */ E.createElement("rect", {
        className: "recharts-brush-slide",
        onMouseEnter: this.handleEnterSlideOrTraveller,
        onMouseLeave: this.handleLeaveSlideOrTraveller,
        onMouseDown: this.handleSlideDragStart,
        onTouchStart: this.handleSlideDragStart,
        style: {
          cursor: "move"
        },
        stroke: "none",
        fill: s,
        fillOpacity: 0.2,
        x: f,
        y: o,
        width: l,
        height: u
      });
    }
  }, {
    key: "renderText",
    value: function() {
      var n = this.props, i = n.startIndex, a = n.endIndex, o = n.y, u = n.height, s = n.travellerWidth, c = n.stroke, f = this.state, l = f.startX, h = f.endX, d = 5, g = {
        pointerEvents: "none",
        fill: c
      };
      return /* @__PURE__ */ E.createElement(Te, {
        className: "recharts-brush-texts"
      }, /* @__PURE__ */ E.createElement(Ec, xi({
        textAnchor: "end",
        verticalAnchor: "middle",
        x: Math.min(l, h) - d,
        y: o + u / 2
      }, g), this.getTextOfTick(i)), /* @__PURE__ */ E.createElement(Ec, xi({
        textAnchor: "start",
        verticalAnchor: "middle",
        x: Math.max(l, h) + s + d,
        y: o + u / 2
      }, g), this.getTextOfTick(a)));
    }
  }, {
    key: "render",
    value: function() {
      var n = this.props, i = n.data, a = n.className, o = n.children, u = n.x, s = n.y, c = n.width, f = n.height, l = n.alwaysShowText, h = this.state, d = h.startX, g = h.endX, v = h.isTextActive, p = h.isSlideMoving, m = h.isTravellerMoving, w = h.isTravellerFocused;
      if (!i || !i.length || !B(u) || !B(s) || !B(c) || !B(f) || c <= 0 || f <= 0)
        return null;
      var x = ue("recharts-brush", a), _ = E.Children.count(o) === 1, y = OC("userSelect", "none");
      return /* @__PURE__ */ E.createElement(Te, {
        className: x,
        onMouseLeave: this.handleLeaveWrapper,
        onTouchMove: this.handleTouchMove,
        style: y
      }, this.renderBackground(), _ && this.renderPanorama(), this.renderSlide(d, g), this.renderTravellerLayer(d, "startX"), this.renderTravellerLayer(g, "endX"), (v || p || m || w || l) && this.renderText());
    }
  }], [{
    key: "renderDefaultTraveller",
    value: function(n) {
      var i = n.x, a = n.y, o = n.width, u = n.height, s = n.stroke, c = Math.floor(a + u / 2) - 1;
      return /* @__PURE__ */ E.createElement(E.Fragment, null, /* @__PURE__ */ E.createElement("rect", {
        x: i,
        y: a,
        width: o,
        height: u,
        fill: s,
        stroke: "none"
      }), /* @__PURE__ */ E.createElement("line", {
        x1: i + 1,
        y1: c,
        x2: i + o - 1,
        y2: c,
        fill: "none",
        stroke: "#fff"
      }), /* @__PURE__ */ E.createElement("line", {
        x1: i + 1,
        y1: c + 2,
        x2: i + o - 1,
        y2: c + 2,
        fill: "none",
        stroke: "#fff"
      }));
    }
  }, {
    key: "renderTraveller",
    value: function(n, i) {
      var a;
      return /* @__PURE__ */ E.isValidElement(n) ? a = /* @__PURE__ */ E.cloneElement(n, i) : J(n) ? a = n(i) : a = t.renderDefaultTraveller(i), a;
    }
  }, {
    key: "getDerivedStateFromProps",
    value: function(n, i) {
      var a = n.data, o = n.width, u = n.x, s = n.travellerWidth, c = n.updateId, f = n.startIndex, l = n.endIndex;
      if (a !== i.prevData || c !== i.prevUpdateId)
        return zs({
          prevData: a,
          prevTravellerWidth: s,
          prevUpdateId: c,
          prevX: u,
          prevWidth: o
        }, a && a.length ? CC({
          data: a,
          width: o,
          x: u,
          travellerWidth: s,
          startIndex: f,
          endIndex: l
        }) : {
          scale: null,
          scaleValues: null
        });
      if (i.scale && (o !== i.prevWidth || u !== i.prevX || s !== i.prevTravellerWidth)) {
        i.scale.range([u, u + o - s]);
        var h = i.scale.domain().map(function(d) {
          return i.scale(d);
        });
        return {
          prevData: a,
          prevTravellerWidth: s,
          prevUpdateId: c,
          prevX: u,
          prevWidth: o,
          startX: i.scale(n.startIndex),
          endX: i.scale(n.endIndex),
          scaleValues: h
        };
      }
      return null;
    }
  }, {
    key: "getIndexInRange",
    value: function(n, i) {
      for (var a = n.length, o = 0, u = a - 1; u - o > 1; ) {
        var s = Math.floor((o + u) / 2);
        n[s] > i ? u = s : o = s;
      }
      return i >= n[u] ? u : o;
    }
  }]);
})(Wt);
Re(pr, "displayName", "Brush");
Re(pr, "defaultProps", {
  height: 40,
  travellerWidth: 5,
  gap: 1,
  fill: "#fff",
  stroke: "#666",
  padding: {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1
  },
  leaveTimeOut: 1e3,
  alwaysShowText: !1
});
var Hs, og;
function IC() {
  if (og) return Hs;
  og = 1;
  var e = Bl();
  function t(r, n) {
    var i;
    return e(r, function(a, o, u) {
      return i = n(a, o, u), !i;
    }), !!i;
  }
  return Hs = t, Hs;
}
var Gs, ug;
function $C() {
  if (ug) return Gs;
  ug = 1;
  var e = ym(), t = St(), r = IC(), n = Ie(), i = Wi();
  function a(o, u, s) {
    var c = n(o) ? e : r;
    return s && i(o, u, s) && (u = void 0), c(o, t(u, 3));
  }
  return Gs = a, Gs;
}
var RC = $C();
const DC = /* @__PURE__ */ ce(RC);
var et = function(t, r) {
  var n = t.alwaysShow, i = t.ifOverflow;
  return n && (i = "extendDomain"), i === r;
}, Ks, sg;
function NC() {
  if (sg) return Ks;
  sg = 1;
  var e = Rm();
  function t(r, n, i) {
    n == "__proto__" && e ? e(r, n, {
      configurable: !0,
      enumerable: !0,
      value: i,
      writable: !0
    }) : r[n] = i;
  }
  return Ks = t, Ks;
}
var Xs, cg;
function qC() {
  if (cg) return Xs;
  cg = 1;
  var e = NC(), t = Im(), r = St();
  function n(i, a) {
    var o = {};
    return a = r(a, 3), t(i, function(u, s, c) {
      e(o, s, a(u, s, c));
    }), o;
  }
  return Xs = n, Xs;
}
var kC = qC();
const LC = /* @__PURE__ */ ce(kC);
var Vs, lg;
function BC() {
  if (lg) return Vs;
  lg = 1;
  function e(t, r) {
    for (var n = -1, i = t == null ? 0 : t.length; ++n < i; )
      if (!r(t[n], n, t))
        return !1;
    return !0;
  }
  return Vs = e, Vs;
}
var Ys, fg;
function FC() {
  if (fg) return Ys;
  fg = 1;
  var e = Bl();
  function t(r, n) {
    var i = !0;
    return e(r, function(a, o, u) {
      return i = !!n(a, o, u), i;
    }), i;
  }
  return Ys = t, Ys;
}
var Zs, hg;
function UC() {
  if (hg) return Zs;
  hg = 1;
  var e = BC(), t = FC(), r = St(), n = Ie(), i = Wi();
  function a(o, u, s) {
    var c = n(o) ? e : t;
    return s && i(o, u, s) && (u = void 0), c(o, r(u, 3));
  }
  return Zs = a, Zs;
}
var WC = UC();
const s0 = /* @__PURE__ */ ce(WC);
var zC = ["x", "y"];
function vn(e) {
  "@babel/helpers - typeof";
  return vn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, vn(e);
}
function il() {
  return il = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, il.apply(this, arguments);
}
function pg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function $r(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? pg(Object(r), !0).forEach(function(n) {
      HC(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : pg(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function HC(e, t, r) {
  return t = GC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function GC(e) {
  var t = KC(e, "string");
  return vn(t) == "symbol" ? t : t + "";
}
function KC(e, t) {
  if (vn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (vn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function XC(e, t) {
  if (e == null) return {};
  var r = VC(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function VC(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function YC(e, t) {
  var r = e.x, n = e.y, i = XC(e, zC), a = "".concat(r), o = parseInt(a, 10), u = "".concat(n), s = parseInt(u, 10), c = "".concat(t.height || i.height), f = parseInt(c, 10), l = "".concat(t.width || i.width), h = parseInt(l, 10);
  return $r($r($r($r($r({}, t), i), o ? {
    x: o
  } : {}), s ? {
    y: s
  } : {}), {}, {
    height: f,
    width: h,
    name: t.name,
    radius: t.radius
  });
}
function dg(e) {
  return /* @__PURE__ */ E.createElement(sC, il({
    shapeType: "rectangle",
    propTransformer: YC,
    activeClassName: "recharts-active-bar"
  }, e));
}
var ZC = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  return function(n, i) {
    if (typeof t == "number") return t;
    var a = B(n) || Ew(n);
    return a ? t(n, i) : (a || Ut(), r);
  };
}, JC = ["value", "background"], c0;
function dr(e) {
  "@babel/helpers - typeof";
  return dr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, dr(e);
}
function QC(e, t) {
  if (e == null) return {};
  var r = eI(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function eI(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function Oi() {
  return Oi = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Oi.apply(this, arguments);
}
function vg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function de(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? vg(Object(r), !0).forEach(function(n) {
      bt(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : vg(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function tI(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function yg(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, f0(n.key), n);
  }
}
function rI(e, t, r) {
  return t && yg(e.prototype, t), r && yg(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function nI(e, t, r) {
  return t = Si(t), iI(e, l0() ? Reflect.construct(t, r || [], Si(e).constructor) : t.apply(e, r));
}
function iI(e, t) {
  if (t && (dr(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return aI(e);
}
function aI(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function l0() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (l0 = function() {
    return !!e;
  })();
}
function Si(e) {
  return Si = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Si(e);
}
function oI(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && al(e, t);
}
function al(e, t) {
  return al = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, i) {
    return n.__proto__ = i, n;
  }, al(e, t);
}
function bt(e, t, r) {
  return t = f0(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function f0(e) {
  var t = uI(e, "string");
  return dr(t) == "symbol" ? t : t + "";
}
function uI(e, t) {
  if (dr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (dr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Pn = /* @__PURE__ */ (function(e) {
  function t() {
    var r;
    tI(this, t);
    for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++)
      i[a] = arguments[a];
    return r = nI(this, t, [].concat(i)), bt(r, "state", {
      isAnimationFinished: !1
    }), bt(r, "id", Ni("recharts-bar-")), bt(r, "handleAnimationEnd", function() {
      var o = r.props.onAnimationEnd;
      r.setState({
        isAnimationFinished: !0
      }), o && o();
    }), bt(r, "handleAnimationStart", function() {
      var o = r.props.onAnimationStart;
      r.setState({
        isAnimationFinished: !1
      }), o && o();
    }), r;
  }
  return oI(t, e), rI(t, [{
    key: "renderRectanglesStatically",
    value: function(n) {
      var i = this, a = this.props, o = a.shape, u = a.dataKey, s = a.activeIndex, c = a.activeBar, f = se(this.props, !1);
      return n && n.map(function(l, h) {
        var d = h === s, g = d ? c : o, v = de(de(de({}, f), l), {}, {
          isActive: d,
          option: g,
          index: h,
          dataKey: u,
          onAnimationStart: i.handleAnimationStart,
          onAnimationEnd: i.handleAnimationEnd
        });
        return /* @__PURE__ */ E.createElement(Te, Oi({
          className: "recharts-bar-rectangle"
        }, sc(i.props, l, h), {
          // https://github.com/recharts/recharts/issues/5415
          // eslint-disable-next-line react/no-array-index-key
          key: "rectangle-".concat(l?.x, "-").concat(l?.y, "-").concat(l?.value, "-").concat(h)
        }), /* @__PURE__ */ E.createElement(dg, v));
      });
    }
  }, {
    key: "renderRectanglesWithAnimation",
    value: function() {
      var n = this, i = this.props, a = i.data, o = i.layout, u = i.isAnimationActive, s = i.animationBegin, c = i.animationDuration, f = i.animationEasing, l = i.animationId, h = this.state.prevData;
      return /* @__PURE__ */ E.createElement(xt, {
        begin: s,
        duration: c,
        isActive: u,
        easing: f,
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        key: "bar-".concat(l),
        onAnimationEnd: this.handleAnimationEnd,
        onAnimationStart: this.handleAnimationStart
      }, function(d) {
        var g = d.t, v = a.map(function(p, m) {
          var w = h && h[m];
          if (w) {
            var x = Vt(w.x, p.x), _ = Vt(w.y, p.y), y = Vt(w.width, p.width), b = Vt(w.height, p.height);
            return de(de({}, p), {}, {
              x: x(g),
              y: _(g),
              width: y(g),
              height: b(g)
            });
          }
          if (o === "horizontal") {
            var O = Vt(0, p.height), S = O(g);
            return de(de({}, p), {}, {
              y: p.y + p.height - S,
              height: S
            });
          }
          var A = Vt(0, p.width), C = A(g);
          return de(de({}, p), {}, {
            width: C
          });
        });
        return /* @__PURE__ */ E.createElement(Te, null, n.renderRectanglesStatically(v));
      });
    }
  }, {
    key: "renderRectangles",
    value: function() {
      var n = this.props, i = n.data, a = n.isAnimationActive, o = this.state.prevData;
      return a && i && i.length && (!o || !lf(o, i)) ? this.renderRectanglesWithAnimation() : this.renderRectanglesStatically(i);
    }
  }, {
    key: "renderBackground",
    value: function() {
      var n = this, i = this.props, a = i.data, o = i.dataKey, u = i.activeIndex, s = se(this.props.background, !1);
      return a.map(function(c, f) {
        c.value;
        var l = c.background, h = QC(c, JC);
        if (!l)
          return null;
        var d = de(de(de(de(de({}, h), {}, {
          fill: "#eee"
        }, l), s), sc(n.props, c, f)), {}, {
          onAnimationStart: n.handleAnimationStart,
          onAnimationEnd: n.handleAnimationEnd,
          dataKey: o,
          index: f,
          className: "recharts-bar-background-rectangle"
        });
        return /* @__PURE__ */ E.createElement(dg, Oi({
          key: "background-bar-".concat(f),
          option: n.props.background,
          isActive: f === u
        }, d));
      });
    }
  }, {
    key: "renderErrorBar",
    value: function(n, i) {
      if (this.props.isAnimationActive && !this.state.isAnimationFinished)
        return null;
      var a = this.props, o = a.data, u = a.xAxis, s = a.yAxis, c = a.layout, f = a.children, l = Ke(f, ta);
      if (!l)
        return null;
      var h = c === "vertical" ? o[0].height / 2 : o[0].width / 2, d = function(p, m) {
        var w = Array.isArray(p.value) ? p.value[1] : p.value;
        return {
          x: p.x,
          y: p.y,
          value: w,
          errorVal: Xe(p, m)
        };
      }, g = {
        clipPath: n ? "url(#clipPath-".concat(i, ")") : null
      };
      return /* @__PURE__ */ E.createElement(Te, g, l.map(function(v) {
        return /* @__PURE__ */ E.cloneElement(v, {
          key: "error-bar-".concat(i, "-").concat(v.props.dataKey),
          data: o,
          xAxis: u,
          yAxis: s,
          layout: c,
          offset: h,
          dataPointFormatter: d
        });
      }));
    }
  }, {
    key: "render",
    value: function() {
      var n = this.props, i = n.hide, a = n.data, o = n.className, u = n.xAxis, s = n.yAxis, c = n.left, f = n.top, l = n.width, h = n.height, d = n.isAnimationActive, g = n.background, v = n.id;
      if (i || !a || !a.length)
        return null;
      var p = this.state.isAnimationFinished, m = ue("recharts-bar", o), w = u && u.allowDataOverflow, x = s && s.allowDataOverflow, _ = w || x, y = V(v) ? this.id : v;
      return /* @__PURE__ */ E.createElement(Te, {
        className: m
      }, w || x ? /* @__PURE__ */ E.createElement("defs", null, /* @__PURE__ */ E.createElement("clipPath", {
        id: "clipPath-".concat(y)
      }, /* @__PURE__ */ E.createElement("rect", {
        x: w ? c : c - l / 2,
        y: x ? f : f - h / 2,
        width: w ? l : l * 2,
        height: x ? h : h * 2
      }))) : null, /* @__PURE__ */ E.createElement(Te, {
        className: "recharts-bar-rectangles",
        clipPath: _ ? "url(#clipPath-".concat(y, ")") : null
      }, g ? this.renderBackground() : null, this.renderRectangles()), this.renderErrorBar(_, y), (!d || p) && Lt.renderCallByParent(this.props, a));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function(n, i) {
      return n.animationId !== i.prevAnimationId ? {
        prevAnimationId: n.animationId,
        curData: n.data,
        prevData: i.curData
      } : n.data !== i.curData ? {
        curData: n.data
      } : null;
    }
  }]);
})(Wt);
c0 = Pn;
bt(Pn, "displayName", "Bar");
bt(Pn, "defaultProps", {
  xAxisId: 0,
  yAxisId: 0,
  legendType: "rect",
  minPointSize: 0,
  hide: !1,
  data: [],
  layout: "vertical",
  activeBar: !1,
  isAnimationActive: !zi.isSsr,
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: "ease"
});
bt(Pn, "getComposedData", function(e) {
  var t = e.props, r = e.item, n = e.barPosition, i = e.bandSize, a = e.xAxis, o = e.yAxis, u = e.xAxisTicks, s = e.yAxisTicks, c = e.stackedData, f = e.dataStartIndex, l = e.displayedData, h = e.offset, d = _T(n, r);
  if (!d)
    return null;
  var g = t.layout, v = r.type.defaultProps, p = v !== void 0 ? de(de({}, v), r.props) : r.props, m = p.dataKey, w = p.children, x = p.minPointSize, _ = g === "horizontal" ? o : a, y = c ? _.scale.domain() : null, b = jT({
    numericAxis: _
  }), O = Ke(w, Fm), S = l.map(function(A, C) {
    var T, P, j, I, M, R;
    c ? T = OT(c[f + C], y) : (T = Xe(A, m), Array.isArray(T) || (T = [b, T]));
    var N = ZC(x, c0.defaultProps.minPointSize)(T[1], C);
    if (g === "horizontal") {
      var q, k = [o.scale(T[0]), o.scale(T[1])], W = k[0], H = k[1];
      P = iy({
        axis: a,
        ticks: u,
        bandSize: i,
        offset: d.offset,
        entry: A,
        index: C
      }), j = (q = H ?? W) !== null && q !== void 0 ? q : void 0, I = d.size;
      var F = W - H;
      if (M = Number.isNaN(F) ? 0 : F, R = {
        x: P,
        y: o.y,
        width: I,
        height: o.height
      }, Math.abs(N) > 0 && Math.abs(M) < Math.abs(N)) {
        var G = Ze(M || N) * (Math.abs(N) - Math.abs(M));
        j -= G, M += G;
      }
    } else {
      var ae = [a.scale(T[0]), a.scale(T[1])], pe = ae[0], $e = ae[1];
      if (P = pe, j = iy({
        axis: o,
        ticks: s,
        bandSize: i,
        offset: d.offset,
        entry: A,
        index: C
      }), I = $e - pe, M = d.size, R = {
        x: a.x,
        y: j,
        width: a.width,
        height: M
      }, Math.abs(N) > 0 && Math.abs(I) < Math.abs(N)) {
        var Et = Ze(I || N) * (Math.abs(N) - Math.abs(I));
        I += Et;
      }
    }
    return de(de(de({}, A), {}, {
      x: P,
      y: j,
      width: I,
      height: M,
      value: c ? T : T[1],
      payload: A,
      background: R
    }, O && O[C] && O[C].props), {}, {
      tooltipPayload: [Hb(r, A)],
      tooltipPosition: {
        x: P + I / 2,
        y: j + M / 2
      }
    });
  });
  return de({
    data: S,
    layout: g
  }, h);
});
function yn(e) {
  "@babel/helpers - typeof";
  return yn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, yn(e);
}
function sI(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function gg(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, h0(n.key), n);
  }
}
function cI(e, t, r) {
  return t && gg(e.prototype, t), r && gg(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function mg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ze(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? mg(Object(r), !0).forEach(function(n) {
      ia(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : mg(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function ia(e, t, r) {
  return t = h0(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function h0(e) {
  var t = lI(e, "string");
  return yn(t) == "symbol" ? t : t + "";
}
function lI(e, t) {
  if (yn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (yn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var AR = function(t, r, n, i, a) {
  var o = t.width, u = t.height, s = t.layout, c = t.children, f = Object.keys(r), l = {
    left: n.left,
    leftMirror: n.left,
    right: o - n.right,
    rightMirror: o - n.right,
    top: n.top,
    topMirror: n.top,
    bottom: u - n.bottom,
    bottomMirror: u - n.bottom
  }, h = !!De(c, Pn);
  return f.reduce(function(d, g) {
    var v = r[g], p = v.orientation, m = v.domain, w = v.padding, x = w === void 0 ? {} : w, _ = v.mirror, y = v.reversed, b = "".concat(p).concat(_ ? "Mirror" : ""), O, S, A, C, T;
    if (v.type === "number" && (v.padding === "gap" || v.padding === "no-gap")) {
      var P = m[1] - m[0], j = 1 / 0, I = v.categoricalDomain.sort(Cw);
      if (I.forEach(function(ae, pe) {
        pe > 0 && (j = Math.min((ae || 0) - (I[pe - 1] || 0), j));
      }), Number.isFinite(j)) {
        var M = j / P, R = v.layout === "vertical" ? n.height : n.width;
        if (v.padding === "gap" && (O = M * R / 2), v.padding === "no-gap") {
          var N = He(t.barCategoryGap, M * R), q = M * R / 2;
          O = q - N - (q - N) / R * N;
        }
      }
    }
    i === "xAxis" ? S = [n.left + (x.left || 0) + (O || 0), n.left + n.width - (x.right || 0) - (O || 0)] : i === "yAxis" ? S = s === "horizontal" ? [n.top + n.height - (x.bottom || 0), n.top + (x.top || 0)] : [n.top + (x.top || 0) + (O || 0), n.top + n.height - (x.bottom || 0) - (O || 0)] : S = v.range, y && (S = [S[1], S[0]]);
    var k = Fb(v, a, h), W = k.scale, H = k.realScaleType;
    W.domain(m).range(S), Ub(W);
    var F = Wb(W, ze(ze({}, v), {}, {
      realScaleType: H
    }));
    i === "xAxis" ? (T = p === "top" && !_ || p === "bottom" && _, A = n.left, C = l[b] - T * v.height) : i === "yAxis" && (T = p === "left" && !_ || p === "right" && _, A = l[b] - T * v.width, C = n.top);
    var G = ze(ze(ze({}, v), F), {}, {
      realScaleType: H,
      x: A,
      y: C,
      scale: W,
      width: i === "xAxis" ? n.width : v.width,
      height: i === "yAxis" ? n.height : v.height
    });
    return G.bandSize = li(G, F), !v.hide && i === "xAxis" ? l[b] += (T ? -1 : 1) * G.height : v.hide || (l[b] += (T ? -1 : 1) * G.width), ze(ze({}, d), {}, ia({}, g, G));
  }, {});
}, p0 = function(t, r) {
  var n = t.x, i = t.y, a = r.x, o = r.y;
  return {
    x: Math.min(n, a),
    y: Math.min(i, o),
    width: Math.abs(a - n),
    height: Math.abs(o - i)
  };
}, fI = function(t) {
  var r = t.x1, n = t.y1, i = t.x2, a = t.y2;
  return p0({
    x: r,
    y: n
  }, {
    x: i,
    y: a
  });
}, d0 = /* @__PURE__ */ (function() {
  function e(t) {
    sI(this, e), this.scale = t;
  }
  return cI(e, [{
    key: "domain",
    get: function() {
      return this.scale.domain;
    }
  }, {
    key: "range",
    get: function() {
      return this.scale.range;
    }
  }, {
    key: "rangeMin",
    get: function() {
      return this.range()[0];
    }
  }, {
    key: "rangeMax",
    get: function() {
      return this.range()[1];
    }
  }, {
    key: "bandwidth",
    get: function() {
      return this.scale.bandwidth;
    }
  }, {
    key: "apply",
    value: function(r) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = n.bandAware, a = n.position;
      if (r !== void 0) {
        if (a)
          switch (a) {
            case "start":
              return this.scale(r);
            case "middle": {
              var o = this.bandwidth ? this.bandwidth() / 2 : 0;
              return this.scale(r) + o;
            }
            case "end": {
              var u = this.bandwidth ? this.bandwidth() : 0;
              return this.scale(r) + u;
            }
            default:
              return this.scale(r);
          }
        if (i) {
          var s = this.bandwidth ? this.bandwidth() / 2 : 0;
          return this.scale(r) + s;
        }
        return this.scale(r);
      }
    }
  }, {
    key: "isInRange",
    value: function(r) {
      var n = this.range(), i = n[0], a = n[n.length - 1];
      return i <= a ? r >= i && r <= a : r >= a && r <= i;
    }
  }], [{
    key: "create",
    value: function(r) {
      return new e(r);
    }
  }]);
})();
ia(d0, "EPS", 1e-4);
var vf = function(t) {
  var r = Object.keys(t).reduce(function(n, i) {
    return ze(ze({}, n), {}, ia({}, i, d0.create(t[i])));
  }, {});
  return ze(ze({}, r), {}, {
    apply: function(i) {
      var a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = a.bandAware, u = a.position;
      return LC(i, function(s, c) {
        return r[c].apply(s, {
          bandAware: o,
          position: u
        });
      });
    },
    isInRange: function(i) {
      return s0(i, function(a, o) {
        return r[o].isInRange(a);
      });
    }
  });
};
function hI(e) {
  return (e % 180 + 180) % 180;
}
var PR = function(t) {
  var r = t.width, n = t.height, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, a = hI(i), o = a * Math.PI / 180, u = Math.atan(n / r), s = o > u && o < Math.PI - u ? n / Math.sin(o) : r / Math.cos(o);
  return Math.abs(s);
}, Js, bg;
function pI() {
  if (bg) return Js;
  bg = 1;
  var e = St(), t = _n(), r = Fi();
  function n(i) {
    return function(a, o, u) {
      var s = Object(a);
      if (!t(a)) {
        var c = e(o, 3);
        a = r(a), o = function(l) {
          return c(s[l], l, s);
        };
      }
      var f = i(a, o, u);
      return f > -1 ? s[c ? a[f] : f] : void 0;
    };
  }
  return Js = n, Js;
}
var Qs, wg;
function dI() {
  if (wg) return Qs;
  wg = 1;
  var e = i0();
  function t(r) {
    var n = e(r), i = n % 1;
    return n === n ? i ? n - i : n : 0;
  }
  return Qs = t, Qs;
}
var ec, xg;
function vI() {
  if (xg) return ec;
  xg = 1;
  var e = Tm(), t = St(), r = dI(), n = Math.max;
  function i(a, o, u) {
    var s = a == null ? 0 : a.length;
    if (!s)
      return -1;
    var c = u == null ? 0 : r(u);
    return c < 0 && (c = n(s + c, 0)), e(a, t(o, 3), c);
  }
  return ec = i, ec;
}
var tc, _g;
function yI() {
  if (_g) return tc;
  _g = 1;
  var e = pI(), t = vI(), r = e(t);
  return tc = r, tc;
}
var gI = yI();
const mI = /* @__PURE__ */ ce(gI);
var bI = Wg();
const wI = /* @__PURE__ */ ce(bI);
var xI = wI(function(e) {
  return {
    x: e.left,
    y: e.top,
    width: e.width,
    height: e.height
  };
}, function(e) {
  return ["l", e.left, "t", e.top, "w", e.width, "h", e.height].join("");
}), yf = /* @__PURE__ */ _t(void 0), gf = /* @__PURE__ */ _t(void 0), v0 = /* @__PURE__ */ _t(void 0), y0 = /* @__PURE__ */ _t({}), g0 = /* @__PURE__ */ _t(void 0), m0 = /* @__PURE__ */ _t(0), b0 = /* @__PURE__ */ _t(0), Og = function(t) {
  var r = t.state, n = r.xAxisMap, i = r.yAxisMap, a = r.offset, o = t.clipPathId, u = t.children, s = t.width, c = t.height, f = xI(a);
  return /* @__PURE__ */ E.createElement(yf.Provider, {
    value: n
  }, /* @__PURE__ */ E.createElement(gf.Provider, {
    value: i
  }, /* @__PURE__ */ E.createElement(y0.Provider, {
    value: a
  }, /* @__PURE__ */ E.createElement(v0.Provider, {
    value: f
  }, /* @__PURE__ */ E.createElement(g0.Provider, {
    value: o
  }, /* @__PURE__ */ E.createElement(m0.Provider, {
    value: c
  }, /* @__PURE__ */ E.createElement(b0.Provider, {
    value: s
  }, u)))))));
}, _I = function() {
  return rt(g0);
}, OI = function(t) {
  var r = rt(yf);
  r == null && Ut();
  var n = r[t];
  return n == null && Ut(), n;
}, TR = function() {
  var t = rt(yf);
  return mt(t);
}, ER = function() {
  var t = rt(gf), r = mI(t, function(n) {
    return s0(n.domain, Number.isFinite);
  });
  return r || mt(t);
}, SI = function(t) {
  var r = rt(gf);
  r == null && Ut();
  var n = r[t];
  return n == null && Ut(), n;
}, AI = function() {
  var t = rt(v0);
  return t;
}, jR = function() {
  return rt(y0);
}, MR = function() {
  return rt(b0);
}, CR = function() {
  return rt(m0);
};
function vr(e) {
  "@babel/helpers - typeof";
  return vr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, vr(e);
}
function PI(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function TI(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, x0(n.key), n);
  }
}
function EI(e, t, r) {
  return t && TI(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function jI(e, t, r) {
  return t = Ai(t), MI(e, w0() ? Reflect.construct(t, r || [], Ai(e).constructor) : t.apply(e, r));
}
function MI(e, t) {
  if (t && (vr(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return CI(e);
}
function CI(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function w0() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (w0 = function() {
    return !!e;
  })();
}
function Ai(e) {
  return Ai = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Ai(e);
}
function II(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && ol(e, t);
}
function ol(e, t) {
  return ol = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, i) {
    return n.__proto__ = i, n;
  }, ol(e, t);
}
function Sg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ag(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Sg(Object(r), !0).forEach(function(n) {
      mf(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Sg(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function mf(e, t, r) {
  return t = x0(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function x0(e) {
  var t = $I(e, "string");
  return vr(t) == "symbol" ? t : t + "";
}
function $I(e, t) {
  if (vr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (vr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function RI(e, t) {
  return kI(e) || qI(e, t) || NI(e, t) || DI();
}
function DI() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function NI(e, t) {
  if (e) {
    if (typeof e == "string") return Pg(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Pg(e, t);
  }
}
function Pg(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function qI(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], s = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(s = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); s = !0) ;
    } catch (f) {
      c = !0, i = f;
    } finally {
      try {
        if (!s && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function kI(e) {
  if (Array.isArray(e)) return e;
}
function ul() {
  return ul = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ul.apply(this, arguments);
}
var LI = function(t, r) {
  var n;
  return /* @__PURE__ */ E.isValidElement(t) ? n = /* @__PURE__ */ E.cloneElement(t, r) : J(t) ? n = t(r) : n = /* @__PURE__ */ E.createElement("line", ul({}, r, {
    className: "recharts-reference-line-line"
  })), n;
}, BI = function(t, r, n, i, a, o, u, s, c) {
  var f = a.x, l = a.y, h = a.width, d = a.height;
  if (n) {
    var g = c.y, v = t.y.apply(g, {
      position: o
    });
    if (et(c, "discard") && !t.y.isInRange(v))
      return null;
    var p = [{
      x: f + h,
      y: v
    }, {
      x: f,
      y: v
    }];
    return s === "left" ? p.reverse() : p;
  }
  if (r) {
    var m = c.x, w = t.x.apply(m, {
      position: o
    });
    if (et(c, "discard") && !t.x.isInRange(w))
      return null;
    var x = [{
      x: w,
      y: l + d
    }, {
      x: w,
      y: l
    }];
    return u === "top" ? x.reverse() : x;
  }
  if (i) {
    var _ = c.segment, y = _.map(function(b) {
      return t.apply(b, {
        position: o
      });
    });
    return et(c, "discard") && DC(y, function(b) {
      return !t.isInRange(b);
    }) ? null : y;
  }
  return null;
};
function FI(e) {
  var t = e.x, r = e.y, n = e.segment, i = e.xAxisId, a = e.yAxisId, o = e.shape, u = e.className, s = e.alwaysShow, c = _I(), f = OI(i), l = SI(a), h = AI();
  if (!c || !h)
    return null;
  qt(s === void 0, 'The alwaysShow prop is deprecated. Please use ifOverflow="extendDomain" instead.');
  var d = vf({
    x: f.scale,
    y: l.scale
  }), g = xe(t), v = xe(r), p = n && n.length === 2, m = BI(d, g, v, p, h, e.position, f.orientation, l.orientation, e);
  if (!m)
    return null;
  var w = RI(m, 2), x = w[0], _ = x.x, y = x.y, b = w[1], O = b.x, S = b.y, A = et(e, "hidden") ? "url(#".concat(c, ")") : void 0, C = Ag(Ag({
    clipPath: A
  }, se(e, !0)), {}, {
    x1: _,
    y1: y,
    x2: O,
    y2: S
  });
  return /* @__PURE__ */ E.createElement(Te, {
    className: ue("recharts-reference-line", u)
  }, LI(o, C), Ee.renderCallByParent(e, fI({
    x1: _,
    y1: y,
    x2: O,
    y2: S
  })));
}
var bf = /* @__PURE__ */ (function(e) {
  function t() {
    return PI(this, t), jI(this, t, arguments);
  }
  return II(t, e), EI(t, [{
    key: "render",
    value: function() {
      return /* @__PURE__ */ E.createElement(FI, this.props);
    }
  }]);
})(E.Component);
mf(bf, "displayName", "ReferenceLine");
mf(bf, "defaultProps", {
  isFront: !1,
  ifOverflow: "discard",
  xAxisId: 0,
  yAxisId: 0,
  fill: "none",
  stroke: "#ccc",
  fillOpacity: 1,
  strokeWidth: 1,
  position: "middle"
});
function sl() {
  return sl = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, sl.apply(this, arguments);
}
function yr(e) {
  "@babel/helpers - typeof";
  return yr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, yr(e);
}
function Tg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Eg(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Tg(Object(r), !0).forEach(function(n) {
      aa(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Tg(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function UI(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function WI(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, O0(n.key), n);
  }
}
function zI(e, t, r) {
  return t && WI(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function HI(e, t, r) {
  return t = Pi(t), GI(e, _0() ? Reflect.construct(t, r || [], Pi(e).constructor) : t.apply(e, r));
}
function GI(e, t) {
  if (t && (yr(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return KI(e);
}
function KI(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _0() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (_0 = function() {
    return !!e;
  })();
}
function Pi(e) {
  return Pi = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Pi(e);
}
function XI(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && cl(e, t);
}
function cl(e, t) {
  return cl = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, i) {
    return n.__proto__ = i, n;
  }, cl(e, t);
}
function aa(e, t, r) {
  return t = O0(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function O0(e) {
  var t = VI(e, "string");
  return yr(t) == "symbol" ? t : t + "";
}
function VI(e, t) {
  if (yr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (yr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var YI = function(t) {
  var r = t.x, n = t.y, i = t.xAxis, a = t.yAxis, o = vf({
    x: i.scale,
    y: a.scale
  }), u = o.apply({
    x: r,
    y: n
  }, {
    bandAware: !0
  });
  return et(t, "discard") && !o.isInRange(u) ? null : u;
}, oa = /* @__PURE__ */ (function(e) {
  function t() {
    return UI(this, t), HI(this, t, arguments);
  }
  return XI(t, e), zI(t, [{
    key: "render",
    value: function() {
      var n = this.props, i = n.x, a = n.y, o = n.r, u = n.alwaysShow, s = n.clipPathId, c = xe(i), f = xe(a);
      if (qt(u === void 0, 'The alwaysShow prop is deprecated. Please use ifOverflow="extendDomain" instead.'), !c || !f)
        return null;
      var l = YI(this.props);
      if (!l)
        return null;
      var h = l.x, d = l.y, g = this.props, v = g.shape, p = g.className, m = et(this.props, "hidden") ? "url(#".concat(s, ")") : void 0, w = Eg(Eg({
        clipPath: m
      }, se(this.props, !0)), {}, {
        cx: h,
        cy: d
      });
      return /* @__PURE__ */ E.createElement(Te, {
        className: ue("recharts-reference-dot", p)
      }, t.renderDot(v, w), Ee.renderCallByParent(this.props, {
        x: h - o,
        y: d - o,
        width: 2 * o,
        height: 2 * o
      }));
    }
  }]);
})(E.Component);
aa(oa, "displayName", "ReferenceDot");
aa(oa, "defaultProps", {
  isFront: !1,
  ifOverflow: "discard",
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  fill: "#fff",
  stroke: "#ccc",
  fillOpacity: 1,
  strokeWidth: 1
});
aa(oa, "renderDot", function(e, t) {
  var r;
  return /* @__PURE__ */ E.isValidElement(e) ? r = /* @__PURE__ */ E.cloneElement(e, t) : J(e) ? r = e(t) : r = /* @__PURE__ */ E.createElement(n0, sl({}, t, {
    cx: t.cx,
    cy: t.cy,
    className: "recharts-reference-dot-dot"
  })), r;
});
function ll() {
  return ll = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ll.apply(this, arguments);
}
function gr(e) {
  "@babel/helpers - typeof";
  return gr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, gr(e);
}
function jg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Mg(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? jg(Object(r), !0).forEach(function(n) {
      ua(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : jg(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function ZI(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function JI(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, A0(n.key), n);
  }
}
function QI(e, t, r) {
  return t && JI(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function e$(e, t, r) {
  return t = Ti(t), t$(e, S0() ? Reflect.construct(t, r || [], Ti(e).constructor) : t.apply(e, r));
}
function t$(e, t) {
  if (t && (gr(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return r$(e);
}
function r$(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function S0() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (S0 = function() {
    return !!e;
  })();
}
function Ti(e) {
  return Ti = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Ti(e);
}
function n$(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && fl(e, t);
}
function fl(e, t) {
  return fl = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, i) {
    return n.__proto__ = i, n;
  }, fl(e, t);
}
function ua(e, t, r) {
  return t = A0(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function A0(e) {
  var t = i$(e, "string");
  return gr(t) == "symbol" ? t : t + "";
}
function i$(e, t) {
  if (gr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (gr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var a$ = function(t, r, n, i, a) {
  var o = a.x1, u = a.x2, s = a.y1, c = a.y2, f = a.xAxis, l = a.yAxis;
  if (!f || !l) return null;
  var h = vf({
    x: f.scale,
    y: l.scale
  }), d = {
    x: t ? h.x.apply(o, {
      position: "start"
    }) : h.x.rangeMin,
    y: n ? h.y.apply(s, {
      position: "start"
    }) : h.y.rangeMin
  }, g = {
    x: r ? h.x.apply(u, {
      position: "end"
    }) : h.x.rangeMax,
    y: i ? h.y.apply(c, {
      position: "end"
    }) : h.y.rangeMax
  };
  return et(a, "discard") && (!h.isInRange(d) || !h.isInRange(g)) ? null : p0(d, g);
}, sa = /* @__PURE__ */ (function(e) {
  function t() {
    return ZI(this, t), e$(this, t, arguments);
  }
  return n$(t, e), QI(t, [{
    key: "render",
    value: function() {
      var n = this.props, i = n.x1, a = n.x2, o = n.y1, u = n.y2, s = n.className, c = n.alwaysShow, f = n.clipPathId;
      qt(c === void 0, 'The alwaysShow prop is deprecated. Please use ifOverflow="extendDomain" instead.');
      var l = xe(i), h = xe(a), d = xe(o), g = xe(u), v = this.props.shape;
      if (!l && !h && !d && !g && !v)
        return null;
      var p = a$(l, h, d, g, this.props);
      if (!p && !v)
        return null;
      var m = et(this.props, "hidden") ? "url(#".concat(f, ")") : void 0;
      return /* @__PURE__ */ E.createElement(Te, {
        className: ue("recharts-reference-area", s)
      }, t.renderRect(v, Mg(Mg({
        clipPath: m
      }, se(this.props, !0)), p)), Ee.renderCallByParent(this.props, p));
    }
  }]);
})(E.Component);
ua(sa, "displayName", "ReferenceArea");
ua(sa, "defaultProps", {
  isFront: !1,
  ifOverflow: "discard",
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  fill: "#ccc",
  fillOpacity: 0.5,
  stroke: "none",
  strokeWidth: 1
});
ua(sa, "renderRect", function(e, t) {
  var r;
  return /* @__PURE__ */ E.isValidElement(e) ? r = /* @__PURE__ */ E.cloneElement(e, t) : J(e) ? r = e(t) : r = /* @__PURE__ */ E.createElement(df, ll({}, t, {
    className: "recharts-reference-area-rect"
  })), r;
});
function Cg(e) {
  return c$(e) || s$(e) || u$(e) || o$();
}
function o$() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function u$(e, t) {
  if (e) {
    if (typeof e == "string") return hl(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return hl(e, t);
  }
}
function s$(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function c$(e) {
  if (Array.isArray(e)) return hl(e);
}
function hl(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
var pl = function(t, r, n, i, a) {
  var o = Ke(t, bf), u = Ke(t, oa), s = [].concat(Cg(o), Cg(u)), c = Ke(t, sa), f = "".concat(i, "Id"), l = i[0], h = r;
  if (s.length && (h = s.reduce(function(v, p) {
    if (p.props[f] === n && et(p.props, "extendDomain") && B(p.props[l])) {
      var m = p.props[l];
      return [Math.min(v[0], m), Math.max(v[1], m)];
    }
    return v;
  }, h)), c.length) {
    var d = "".concat(l, "1"), g = "".concat(l, "2");
    h = c.reduce(function(v, p) {
      if (p.props[f] === n && et(p.props, "extendDomain") && B(p.props[d]) && B(p.props[g])) {
        var m = p.props[d], w = p.props[g];
        return [Math.min(v[0], m, w), Math.max(v[1], m, w)];
      }
      return v;
    }, h);
  }
  return a && a.length && (h = a.reduce(function(v, p) {
    return B(p) ? [Math.min(v[0], p), Math.max(v[1], p)] : v;
  }, h)), h;
}, rc = { exports: {} }, Ig;
function l$() {
  return Ig || (Ig = 1, (function(e) {
    var t = Object.prototype.hasOwnProperty, r = "~";
    function n() {
    }
    Object.create && (n.prototype = /* @__PURE__ */ Object.create(null), new n().__proto__ || (r = !1));
    function i(s, c, f) {
      this.fn = s, this.context = c, this.once = f || !1;
    }
    function a(s, c, f, l, h) {
      if (typeof f != "function")
        throw new TypeError("The listener must be a function");
      var d = new i(f, l || s, h), g = r ? r + c : c;
      return s._events[g] ? s._events[g].fn ? s._events[g] = [s._events[g], d] : s._events[g].push(d) : (s._events[g] = d, s._eventsCount++), s;
    }
    function o(s, c) {
      --s._eventsCount === 0 ? s._events = new n() : delete s._events[c];
    }
    function u() {
      this._events = new n(), this._eventsCount = 0;
    }
    u.prototype.eventNames = function() {
      var c = [], f, l;
      if (this._eventsCount === 0) return c;
      for (l in f = this._events)
        t.call(f, l) && c.push(r ? l.slice(1) : l);
      return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(f)) : c;
    }, u.prototype.listeners = function(c) {
      var f = r ? r + c : c, l = this._events[f];
      if (!l) return [];
      if (l.fn) return [l.fn];
      for (var h = 0, d = l.length, g = new Array(d); h < d; h++)
        g[h] = l[h].fn;
      return g;
    }, u.prototype.listenerCount = function(c) {
      var f = r ? r + c : c, l = this._events[f];
      return l ? l.fn ? 1 : l.length : 0;
    }, u.prototype.emit = function(c, f, l, h, d, g) {
      var v = r ? r + c : c;
      if (!this._events[v]) return !1;
      var p = this._events[v], m = arguments.length, w, x;
      if (p.fn) {
        switch (p.once && this.removeListener(c, p.fn, void 0, !0), m) {
          case 1:
            return p.fn.call(p.context), !0;
          case 2:
            return p.fn.call(p.context, f), !0;
          case 3:
            return p.fn.call(p.context, f, l), !0;
          case 4:
            return p.fn.call(p.context, f, l, h), !0;
          case 5:
            return p.fn.call(p.context, f, l, h, d), !0;
          case 6:
            return p.fn.call(p.context, f, l, h, d, g), !0;
        }
        for (x = 1, w = new Array(m - 1); x < m; x++)
          w[x - 1] = arguments[x];
        p.fn.apply(p.context, w);
      } else {
        var _ = p.length, y;
        for (x = 0; x < _; x++)
          switch (p[x].once && this.removeListener(c, p[x].fn, void 0, !0), m) {
            case 1:
              p[x].fn.call(p[x].context);
              break;
            case 2:
              p[x].fn.call(p[x].context, f);
              break;
            case 3:
              p[x].fn.call(p[x].context, f, l);
              break;
            case 4:
              p[x].fn.call(p[x].context, f, l, h);
              break;
            default:
              if (!w) for (y = 1, w = new Array(m - 1); y < m; y++)
                w[y - 1] = arguments[y];
              p[x].fn.apply(p[x].context, w);
          }
      }
      return !0;
    }, u.prototype.on = function(c, f, l) {
      return a(this, c, f, l, !1);
    }, u.prototype.once = function(c, f, l) {
      return a(this, c, f, l, !0);
    }, u.prototype.removeListener = function(c, f, l, h) {
      var d = r ? r + c : c;
      if (!this._events[d]) return this;
      if (!f)
        return o(this, d), this;
      var g = this._events[d];
      if (g.fn)
        g.fn === f && (!h || g.once) && (!l || g.context === l) && o(this, d);
      else {
        for (var v = 0, p = [], m = g.length; v < m; v++)
          (g[v].fn !== f || h && !g[v].once || l && g[v].context !== l) && p.push(g[v]);
        p.length ? this._events[d] = p.length === 1 ? p[0] : p : o(this, d);
      }
      return this;
    }, u.prototype.removeAllListeners = function(c) {
      var f;
      return c ? (f = r ? r + c : c, this._events[f] && o(this, f)) : (this._events = new n(), this._eventsCount = 0), this;
    }, u.prototype.off = u.prototype.removeListener, u.prototype.addListener = u.prototype.on, u.prefixed = r, u.EventEmitter = u, e.exports = u;
  })(rc)), rc.exports;
}
var f$ = l$();
const h$ = /* @__PURE__ */ ce(f$);
var nc = new h$(), ic = "recharts.syncMouseEvents";
function gn(e) {
  "@babel/helpers - typeof";
  return gn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, gn(e);
}
function p$(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function d$(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, P0(n.key), n);
  }
}
function v$(e, t, r) {
  return t && d$(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function ac(e, t, r) {
  return t = P0(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function P0(e) {
  var t = y$(e, "string");
  return gn(t) == "symbol" ? t : t + "";
}
function y$(e, t) {
  if (gn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (gn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var g$ = /* @__PURE__ */ (function() {
  function e() {
    p$(this, e), ac(this, "activeIndex", 0), ac(this, "coordinateList", []), ac(this, "layout", "horizontal");
  }
  return v$(e, [{
    key: "setDetails",
    value: function(r) {
      var n, i = r.coordinateList, a = i === void 0 ? null : i, o = r.container, u = o === void 0 ? null : o, s = r.layout, c = s === void 0 ? null : s, f = r.offset, l = f === void 0 ? null : f, h = r.mouseHandlerCallback, d = h === void 0 ? null : h;
      this.coordinateList = (n = a ?? this.coordinateList) !== null && n !== void 0 ? n : [], this.container = u ?? this.container, this.layout = c ?? this.layout, this.offset = l ?? this.offset, this.mouseHandlerCallback = d ?? this.mouseHandlerCallback, this.activeIndex = Math.min(Math.max(this.activeIndex, 0), this.coordinateList.length - 1);
    }
  }, {
    key: "focus",
    value: function() {
      this.spoofMouse();
    }
  }, {
    key: "keyboardEvent",
    value: function(r) {
      if (this.coordinateList.length !== 0)
        switch (r.key) {
          case "ArrowRight": {
            if (this.layout !== "horizontal")
              return;
            this.activeIndex = Math.min(this.activeIndex + 1, this.coordinateList.length - 1), this.spoofMouse();
            break;
          }
          case "ArrowLeft": {
            if (this.layout !== "horizontal")
              return;
            this.activeIndex = Math.max(this.activeIndex - 1, 0), this.spoofMouse();
            break;
          }
        }
    }
  }, {
    key: "setIndex",
    value: function(r) {
      this.activeIndex = r;
    }
  }, {
    key: "spoofMouse",
    value: function() {
      var r, n;
      if (this.layout === "horizontal" && this.coordinateList.length !== 0) {
        var i = this.container.getBoundingClientRect(), a = i.x, o = i.y, u = i.height, s = this.coordinateList[this.activeIndex].coordinate, c = ((r = window) === null || r === void 0 ? void 0 : r.scrollX) || 0, f = ((n = window) === null || n === void 0 ? void 0 : n.scrollY) || 0, l = a + s + c, h = o + this.offset.top + u / 2 + f;
        this.mouseHandlerCallback({
          pageX: l,
          pageY: h
        });
      }
    }
  }]);
})();
function m$(e, t, r) {
  if (r === "number" && t === !0 && Array.isArray(e)) {
    var n = e?.[0], i = e?.[1];
    if (n && i && B(n) && B(i))
      return !0;
  }
  return !1;
}
function b$(e, t, r, n) {
  var i = n / 2;
  return {
    stroke: "none",
    fill: "#ccc",
    x: e === "horizontal" ? t.x - i : r.left + 0.5,
    y: e === "horizontal" ? r.top + 0.5 : t.y - i,
    width: e === "horizontal" ? n : r.width - 1,
    height: e === "horizontal" ? r.height - 1 : n
  };
}
function T0(e) {
  var t = e.cx, r = e.cy, n = e.radius, i = e.startAngle, a = e.endAngle, o = Pe(t, r, n, i), u = Pe(t, r, n, a);
  return {
    points: [o, u],
    cx: t,
    cy: r,
    radius: n,
    startAngle: i,
    endAngle: a
  };
}
function w$(e, t, r) {
  var n, i, a, o;
  if (e === "horizontal")
    n = t.x, a = n, i = r.top, o = r.top + r.height;
  else if (e === "vertical")
    i = t.y, o = i, n = r.left, a = r.left + r.width;
  else if (t.cx != null && t.cy != null)
    if (e === "centric") {
      var u = t.cx, s = t.cy, c = t.innerRadius, f = t.outerRadius, l = t.angle, h = Pe(u, s, c, l), d = Pe(u, s, f, l);
      n = h.x, i = h.y, a = d.x, o = d.y;
    } else
      return T0(t);
  return [{
    x: n,
    y: i
  }, {
    x: a,
    y: o
  }];
}
function mn(e) {
  "@babel/helpers - typeof";
  return mn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, mn(e);
}
function $g(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function kn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? $g(Object(r), !0).forEach(function(n) {
      x$(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : $g(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function x$(e, t, r) {
  return t = _$(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function _$(e) {
  var t = O$(e, "string");
  return mn(t) == "symbol" ? t : t + "";
}
function O$(e, t) {
  if (mn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (mn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function S$(e) {
  var t, r, n = e.element, i = e.tooltipEventType, a = e.isActive, o = e.activeCoordinate, u = e.activePayload, s = e.offset, c = e.activeTooltipIndex, f = e.tooltipAxisBandSize, l = e.layout, h = e.chartName, d = (t = n.props.cursor) !== null && t !== void 0 ? t : (r = n.type.defaultProps) === null || r === void 0 ? void 0 : r.cursor;
  if (!n || !d || !a || !o || h !== "ScatterChart" && i !== "axis")
    return null;
  var g, v = xy;
  if (h === "ScatterChart")
    g = o, v = DM;
  else if (h === "BarChart")
    g = b$(l, o, s, f), v = df;
  else if (l === "radial") {
    var p = T0(o), m = p.cx, w = p.cy, x = p.radius, _ = p.startAngle, y = p.endAngle;
    g = {
      cx: m,
      cy: w,
      startAngle: _,
      endAngle: y,
      innerRadius: x,
      outerRadius: x
    }, v = Vb;
  } else
    g = {
      points: w$(l, o, s)
    }, v = xy;
  var b = kn(kn(kn(kn({
    stroke: "#ccc",
    pointerEvents: "none"
  }, s), g), se(d, !1)), {}, {
    payload: u,
    payloadIndex: c,
    className: ue("recharts-tooltip-cursor", d.className)
  });
  return /* @__PURE__ */ Ge(d) ? /* @__PURE__ */ be(d, b) : /* @__PURE__ */ ji(v, b);
}
var A$ = ["item"], P$ = ["children", "className", "width", "height", "style", "compact", "title", "desc"];
function mr(e) {
  "@babel/helpers - typeof";
  return mr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, mr(e);
}
function Qt() {
  return Qt = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Qt.apply(this, arguments);
}
function Rg(e, t) {
  return j$(e) || E$(e, t) || j0(e, t) || T$();
}
function T$() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function E$(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], s = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(s = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); s = !0) ;
    } catch (f) {
      c = !0, i = f;
    } finally {
      try {
        if (!s && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function j$(e) {
  if (Array.isArray(e)) return e;
}
function Dg(e, t) {
  if (e == null) return {};
  var r = M$(e, t), n, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      n = a[i], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function M$(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function C$(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function I$(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, M0(n.key), n);
  }
}
function $$(e, t, r) {
  return t && I$(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function R$(e, t, r) {
  return t = Ei(t), D$(e, E0() ? Reflect.construct(t, r || [], Ei(e).constructor) : t.apply(e, r));
}
function D$(e, t) {
  if (t && (mr(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return N$(e);
}
function N$(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function E0() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (E0 = function() {
    return !!e;
  })();
}
function Ei(e) {
  return Ei = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Ei(e);
}
function q$(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && dl(e, t);
}
function dl(e, t) {
  return dl = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, i) {
    return n.__proto__ = i, n;
  }, dl(e, t);
}
function br(e) {
  return B$(e) || L$(e) || j0(e) || k$();
}
function k$() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function j0(e, t) {
  if (e) {
    if (typeof e == "string") return vl(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return vl(e, t);
  }
}
function L$(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function B$(e) {
  if (Array.isArray(e)) return vl(e);
}
function vl(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Ng(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function $(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ng(Object(r), !0).forEach(function(n) {
      z(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ng(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function z(e, t, r) {
  return t = M0(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function M0(e) {
  var t = F$(e, "string");
  return mr(t) == "symbol" ? t : t + "";
}
function F$(e, t) {
  if (mr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (mr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var U$ = {
  xAxis: ["bottom", "top"],
  yAxis: ["left", "right"]
}, W$ = {
  width: "100%",
  height: "100%"
}, C0 = {
  x: 0,
  y: 0
};
function Ln(e) {
  return e;
}
var z$ = function(t, r) {
  return r === "horizontal" ? t.x : r === "vertical" ? t.y : r === "centric" ? t.angle : t.radius;
}, H$ = function(t, r, n, i) {
  var a = r.find(function(f) {
    return f && f.index === n;
  });
  if (a) {
    if (t === "horizontal")
      return {
        x: a.coordinate,
        y: i.y
      };
    if (t === "vertical")
      return {
        x: i.x,
        y: a.coordinate
      };
    if (t === "centric") {
      var o = a.coordinate, u = i.radius;
      return $($($({}, i), Pe(i.cx, i.cy, u, o)), {}, {
        angle: o,
        radius: u
      });
    }
    var s = a.coordinate, c = i.angle;
    return $($($({}, i), Pe(i.cx, i.cy, s, c)), {}, {
      angle: c,
      radius: s
    });
  }
  return C0;
}, ca = function(t, r) {
  var n = r.graphicalItems, i = r.dataStartIndex, a = r.dataEndIndex, o = (n ?? []).reduce(function(u, s) {
    var c = s.props.data;
    return c && c.length ? [].concat(br(u), br(c)) : u;
  }, []);
  return o.length > 0 ? o : t && t.length && B(i) && B(a) ? t.slice(i, a + 1) : [];
};
function I0(e) {
  return e === "number" ? [0, "auto"] : void 0;
}
var yl = function(t, r, n, i) {
  var a = t.graphicalItems, o = t.tooltipAxis, u = ca(r, t);
  return n < 0 || !a || !a.length || n >= u.length ? null : a.reduce(function(s, c) {
    var f, l = (f = c.props.data) !== null && f !== void 0 ? f : r;
    l && t.dataStartIndex + t.dataEndIndex !== 0 && // https://github.com/recharts/recharts/issues/4717
    // The data is sliced only when the active index is within the start/end index range.
    t.dataEndIndex - t.dataStartIndex >= n && (l = l.slice(t.dataStartIndex, t.dataEndIndex + 1));
    var h;
    if (o.dataKey && !o.allowDuplicatedCategory) {
      var d = l === void 0 ? u : l;
      h = Fn(d, o.dataKey, i);
    } else
      h = l && l[n] || u[n];
    return h ? [].concat(br(s), [Hb(c, h)]) : s;
  }, []);
}, qg = function(t, r, n, i) {
  var a = i || {
    x: t.chartX,
    y: t.chartY
  }, o = z$(a, n), u = t.orderedTooltipTicks, s = t.tooltipAxis, c = t.tooltipTicks, f = yT(o, u, c, s);
  if (f >= 0 && c) {
    var l = c[f] && c[f].value, h = yl(t, r, f, l), d = H$(n, u, f, a);
    return {
      activeTooltipIndex: f,
      activeLabel: l,
      activePayload: h,
      activeCoordinate: d
    };
  }
  return null;
}, G$ = function(t, r) {
  var n = r.axes, i = r.graphicalItems, a = r.axisType, o = r.axisIdKey, u = r.stackGroups, s = r.dataStartIndex, c = r.dataEndIndex, f = t.layout, l = t.children, h = t.stackOffset, d = Bb(f, a);
  return n.reduce(function(g, v) {
    var p, m = v.type.defaultProps !== void 0 ? $($({}, v.type.defaultProps), v.props) : v.props, w = m.type, x = m.dataKey, _ = m.allowDataOverflow, y = m.allowDuplicatedCategory, b = m.scale, O = m.ticks, S = m.includeHidden, A = m[o];
    if (g[A])
      return g;
    var C = ca(t.data, {
      graphicalItems: i.filter(function(F) {
        var G, ae = o in F.props ? F.props[o] : (G = F.type.defaultProps) === null || G === void 0 ? void 0 : G[o];
        return ae === A;
      }),
      dataStartIndex: s,
      dataEndIndex: c
    }), T = C.length, P, j, I;
    m$(m.domain, _, w) && (P = Fc(m.domain, null, _), d && (w === "number" || b !== "auto") && (I = Lr(C, x, "category")));
    var M = I0(w);
    if (!P || P.length === 0) {
      var R, N = (R = m.domain) !== null && R !== void 0 ? R : M;
      if (x) {
        if (P = Lr(C, x, w), w === "category" && d) {
          var q = Mw(P);
          y && q ? (j = P, P = wi(0, T)) : y || (P = uy(N, P, v).reduce(function(F, G) {
            return F.indexOf(G) >= 0 ? F : [].concat(br(F), [G]);
          }, []));
        } else if (w === "category")
          y ? P = P.filter(function(F) {
            return F !== "" && !V(F);
          }) : P = uy(N, P, v).reduce(function(F, G) {
            return F.indexOf(G) >= 0 || G === "" || V(G) ? F : [].concat(br(F), [G]);
          }, []);
        else if (w === "number") {
          var k = xT(C, i.filter(function(F) {
            var G, ae, pe = o in F.props ? F.props[o] : (G = F.type.defaultProps) === null || G === void 0 ? void 0 : G[o], $e = "hide" in F.props ? F.props.hide : (ae = F.type.defaultProps) === null || ae === void 0 ? void 0 : ae.hide;
            return pe === A && (S || !$e);
          }), x, a, f);
          k && (P = k);
        }
        d && (w === "number" || b !== "auto") && (I = Lr(C, x, "category"));
      } else d ? P = wi(0, T) : u && u[A] && u[A].hasStack && w === "number" ? P = h === "expand" ? [0, 1] : zb(u[A].stackGroups, s, c) : P = Lb(C, i.filter(function(F) {
        var G = o in F.props ? F.props[o] : F.type.defaultProps[o], ae = "hide" in F.props ? F.props.hide : F.type.defaultProps.hide;
        return G === A && (S || !ae);
      }), w, f, !0);
      if (w === "number")
        P = pl(l, P, A, a, O), N && (P = Fc(N, P, _));
      else if (w === "category" && N) {
        var W = N, H = P.every(function(F) {
          return W.indexOf(F) >= 0;
        });
        H && (P = W);
      }
    }
    return $($({}, g), {}, z({}, A, $($({}, m), {}, {
      axisType: a,
      domain: P,
      categoricalDomain: I,
      duplicateDomain: j,
      originalDomain: (p = m.domain) !== null && p !== void 0 ? p : M,
      isCategorical: d,
      layout: f
    })));
  }, {});
}, K$ = function(t, r) {
  var n = r.graphicalItems, i = r.Axis, a = r.axisType, o = r.axisIdKey, u = r.stackGroups, s = r.dataStartIndex, c = r.dataEndIndex, f = t.layout, l = t.children, h = ca(t.data, {
    graphicalItems: n,
    dataStartIndex: s,
    dataEndIndex: c
  }), d = h.length, g = Bb(f, a), v = -1;
  return n.reduce(function(p, m) {
    var w = m.type.defaultProps !== void 0 ? $($({}, m.type.defaultProps), m.props) : m.props, x = w[o], _ = I0("number");
    if (!p[x]) {
      v++;
      var y;
      return g ? y = wi(0, d) : u && u[x] && u[x].hasStack ? (y = zb(u[x].stackGroups, s, c), y = pl(l, y, x, a)) : (y = Fc(_, Lb(h, n.filter(function(b) {
        var O, S, A = o in b.props ? b.props[o] : (O = b.type.defaultProps) === null || O === void 0 ? void 0 : O[o], C = "hide" in b.props ? b.props.hide : (S = b.type.defaultProps) === null || S === void 0 ? void 0 : S.hide;
        return A === x && !C;
      }), "number", f), i.defaultProps.allowDataOverflow), y = pl(l, y, x, a)), $($({}, p), {}, z({}, x, $($({
        axisType: a
      }, i.defaultProps), {}, {
        hide: !0,
        orientation: Qe(U$, "".concat(a, ".").concat(v % 2), null),
        domain: y,
        originalDomain: _,
        isCategorical: g,
        layout: f
        // specify scale when no Axis
        // scale: isCategorical ? 'band' : 'linear',
      })));
    }
    return p;
  }, {});
}, X$ = function(t, r) {
  var n = r.axisType, i = n === void 0 ? "xAxis" : n, a = r.AxisComp, o = r.graphicalItems, u = r.stackGroups, s = r.dataStartIndex, c = r.dataEndIndex, f = t.children, l = "".concat(i, "Id"), h = Ke(f, a), d = {};
  return h && h.length ? d = G$(t, {
    axes: h,
    graphicalItems: o,
    axisType: i,
    axisIdKey: l,
    stackGroups: u,
    dataStartIndex: s,
    dataEndIndex: c
  }) : o && o.length && (d = K$(t, {
    Axis: a,
    graphicalItems: o,
    axisType: i,
    axisIdKey: l,
    stackGroups: u,
    dataStartIndex: s,
    dataEndIndex: c
  })), d;
}, V$ = function(t) {
  var r = mt(t), n = Nr(r, !1, !0);
  return {
    tooltipTicks: n,
    orderedTooltipTicks: Fl(n, function(i) {
      return i.coordinate;
    }),
    tooltipAxis: r,
    tooltipAxisBandSize: li(r, n)
  };
}, kg = function(t) {
  var r = t.children, n = t.defaultShowTooltip, i = De(r, pr), a = 0, o = 0;
  return t.data && t.data.length !== 0 && (o = t.data.length - 1), i && i.props && (i.props.startIndex >= 0 && (a = i.props.startIndex), i.props.endIndex >= 0 && (o = i.props.endIndex)), {
    chartX: 0,
    chartY: 0,
    dataStartIndex: a,
    dataEndIndex: o,
    activeTooltipIndex: -1,
    isTooltipActive: !!n
  };
}, Y$ = function(t) {
  return !t || !t.length ? !1 : t.some(function(r) {
    var n = st(r && r.type);
    return n && n.indexOf("Bar") >= 0;
  });
}, Lg = function(t) {
  return t === "horizontal" ? {
    numericAxisName: "yAxis",
    cateAxisName: "xAxis"
  } : t === "vertical" ? {
    numericAxisName: "xAxis",
    cateAxisName: "yAxis"
  } : t === "centric" ? {
    numericAxisName: "radiusAxis",
    cateAxisName: "angleAxis"
  } : {
    numericAxisName: "angleAxis",
    cateAxisName: "radiusAxis"
  };
}, Z$ = function(t, r) {
  var n = t.props, i = t.graphicalItems, a = t.xAxisMap, o = a === void 0 ? {} : a, u = t.yAxisMap, s = u === void 0 ? {} : u, c = n.width, f = n.height, l = n.children, h = n.margin || {}, d = De(l, pr), g = De(l, er), v = Object.keys(s).reduce(function(y, b) {
    var O = s[b], S = O.orientation;
    return !O.mirror && !O.hide ? $($({}, y), {}, z({}, S, y[S] + O.width)) : y;
  }, {
    left: h.left || 0,
    right: h.right || 0
  }), p = Object.keys(o).reduce(function(y, b) {
    var O = o[b], S = O.orientation;
    return !O.mirror && !O.hide ? $($({}, y), {}, z({}, S, Qe(y, "".concat(S)) + O.height)) : y;
  }, {
    top: h.top || 0,
    bottom: h.bottom || 0
  }), m = $($({}, p), v), w = m.bottom;
  d && (m.bottom += d.props.height || pr.defaultProps.height), g && r && (m = bT(m, i, n, r));
  var x = c - m.left - m.right, _ = f - m.top - m.bottom;
  return $($({
    brushBottom: w
  }, m), {}, {
    // never return negative values for height and width
    width: Math.max(x, 0),
    height: Math.max(_, 0)
  });
}, J$ = function(t, r) {
  if (r === "xAxis")
    return t[r].width;
  if (r === "yAxis")
    return t[r].height;
}, IR = function(t) {
  var r = t.chartName, n = t.GraphicalChild, i = t.defaultTooltipEventType, a = i === void 0 ? "axis" : i, o = t.validateTooltipEventTypes, u = o === void 0 ? ["axis"] : o, s = t.axisComponents, c = t.legendContent, f = t.formatAxisMap, l = t.defaultProps, h = function(m, w) {
    var x = w.graphicalItems, _ = w.stackGroups, y = w.offset, b = w.updateId, O = w.dataStartIndex, S = w.dataEndIndex, A = m.barSize, C = m.layout, T = m.barGap, P = m.barCategoryGap, j = m.maxBarSize, I = Lg(C), M = I.numericAxisName, R = I.cateAxisName, N = Y$(x), q = [];
    return x.forEach(function(k, W) {
      var H = ca(m.data, {
        graphicalItems: [k],
        dataStartIndex: O,
        dataEndIndex: S
      }), F = k.type.defaultProps !== void 0 ? $($({}, k.type.defaultProps), k.props) : k.props, G = F.dataKey, ae = F.maxBarSize, pe = F["".concat(M, "Id")], $e = F["".concat(R, "Id")], Et = {}, Me = s.reduce(function(jt, Mt) {
        var la = w["".concat(Mt.axisType, "Map")], wf = F["".concat(Mt.axisType, "Id")];
        la && la[wf] || Mt.axisType === "zAxis" || Ut();
        var xf = la[wf];
        return $($({}, jt), {}, z(z({}, Mt.axisType, xf), "".concat(Mt.axisType, "Ticks"), Nr(xf)));
      }, Et), L = Me[R], K = Me["".concat(R, "Ticks")], X = _ && _[pe] && _[pe].hasStack && MT(k, _[pe].stackGroups), D = st(k.type).indexOf("Bar") >= 0, fe = li(L, K), Z = [], ye = N && gT({
        barSize: A,
        stackGroups: _,
        totalSize: J$(Me, R)
      });
      if (D) {
        var ge, Ce, yt = V(ae) ? j : ae, Xt = (ge = (Ce = li(L, K, !0)) !== null && Ce !== void 0 ? Ce : yt) !== null && ge !== void 0 ? ge : 0;
        Z = mT({
          barGap: T,
          barCategoryGap: P,
          bandSize: Xt !== fe ? Xt : fe,
          sizeList: ye[$e],
          maxBarSize: yt
        }), Xt !== fe && (Z = Z.map(function(jt) {
          return $($({}, jt), {}, {
            position: $($({}, jt.position), {}, {
              offset: jt.position.offset - Xt / 2
            })
          });
        }));
      }
      var Tn = k && k.type && k.type.getComposedData;
      Tn && q.push({
        props: $($({}, Tn($($({}, Me), {}, {
          displayedData: H,
          props: m,
          dataKey: G,
          item: k,
          bandSize: fe,
          barPosition: Z,
          offset: y,
          stackedData: X,
          layout: C,
          dataStartIndex: O,
          dataEndIndex: S
        }))), {}, z(z(z({
          key: k.key || "item-".concat(W)
        }, M, Me[M]), R, Me[R]), "animationId", b)),
        childIndex: Uw(k, m.children),
        item: k
      });
    }), q;
  }, d = function(m, w) {
    var x = m.props, _ = m.dataStartIndex, y = m.dataEndIndex, b = m.updateId;
    if (!Mh({
      props: x
    }))
      return null;
    var O = x.children, S = x.layout, A = x.stackOffset, C = x.data, T = x.reverseStackOrder, P = Lg(S), j = P.numericAxisName, I = P.cateAxisName, M = Ke(O, n), R = ET(C, M, "".concat(j, "Id"), "".concat(I, "Id"), A, T), N = s.reduce(function(F, G) {
      var ae = "".concat(G.axisType, "Map");
      return $($({}, F), {}, z({}, ae, X$(x, $($({}, G), {}, {
        graphicalItems: M,
        stackGroups: G.axisType === j && R,
        dataStartIndex: _,
        dataEndIndex: y
      }))));
    }, {}), q = Z$($($({}, N), {}, {
      props: x,
      graphicalItems: M
    }), w?.legendBBox);
    Object.keys(N).forEach(function(F) {
      N[F] = f(x, N[F], q, F.replace("Map", ""), r);
    });
    var k = N["".concat(I, "Map")], W = V$(k), H = h(x, $($({}, N), {}, {
      dataStartIndex: _,
      dataEndIndex: y,
      updateId: b,
      graphicalItems: M,
      stackGroups: R,
      offset: q
    }));
    return $($({
      formattedGraphicalItems: H,
      graphicalItems: M,
      offset: q,
      stackGroups: R
    }, W), N);
  }, g = /* @__PURE__ */ (function(p) {
    function m(w) {
      var x, _, y;
      return C$(this, m), y = R$(this, m, [w]), z(y, "eventEmitterSymbol", /* @__PURE__ */ Symbol("rechartsEventEmitter")), z(y, "accessibilityManager", new g$()), z(y, "handleLegendBBoxUpdate", function(b) {
        if (b) {
          var O = y.state, S = O.dataStartIndex, A = O.dataEndIndex, C = O.updateId;
          y.setState($({
            legendBBox: b
          }, d({
            props: y.props,
            dataStartIndex: S,
            dataEndIndex: A,
            updateId: C
          }, $($({}, y.state), {}, {
            legendBBox: b
          }))));
        }
      }), z(y, "handleReceiveSyncEvent", function(b, O, S) {
        if (y.props.syncId === b) {
          if (S === y.eventEmitterSymbol && typeof y.props.syncMethod != "function")
            return;
          y.applySyncEvent(O);
        }
      }), z(y, "handleBrushChange", function(b) {
        var O = b.startIndex, S = b.endIndex;
        if (O !== y.state.dataStartIndex || S !== y.state.dataEndIndex) {
          var A = y.state.updateId;
          y.setState(function() {
            return $({
              dataStartIndex: O,
              dataEndIndex: S
            }, d({
              props: y.props,
              dataStartIndex: O,
              dataEndIndex: S,
              updateId: A
            }, y.state));
          }), y.triggerSyncEvent({
            dataStartIndex: O,
            dataEndIndex: S
          });
        }
      }), z(y, "handleMouseEnter", function(b) {
        var O = y.getMouseInfo(b);
        if (O) {
          var S = $($({}, O), {}, {
            isTooltipActive: !0
          });
          y.setState(S), y.triggerSyncEvent(S);
          var A = y.props.onMouseEnter;
          J(A) && A(S, b);
        }
      }), z(y, "triggeredAfterMouseMove", function(b) {
        var O = y.getMouseInfo(b), S = O ? $($({}, O), {}, {
          isTooltipActive: !0
        }) : {
          isTooltipActive: !1
        };
        y.setState(S), y.triggerSyncEvent(S);
        var A = y.props.onMouseMove;
        J(A) && A(S, b);
      }), z(y, "handleItemMouseEnter", function(b) {
        y.setState(function() {
          return {
            isTooltipActive: !0,
            activeItem: b,
            activePayload: b.tooltipPayload,
            activeCoordinate: b.tooltipPosition || {
              x: b.cx,
              y: b.cy
            }
          };
        });
      }), z(y, "handleItemMouseLeave", function() {
        y.setState(function() {
          return {
            isTooltipActive: !1
          };
        });
      }), z(y, "handleMouseMove", function(b) {
        b.persist(), y.throttleTriggeredAfterMouseMove(b);
      }), z(y, "handleMouseLeave", function(b) {
        y.throttleTriggeredAfterMouseMove.cancel();
        var O = {
          isTooltipActive: !1
        };
        y.setState(O), y.triggerSyncEvent(O);
        var S = y.props.onMouseLeave;
        J(S) && S(O, b);
      }), z(y, "handleOuterEvent", function(b) {
        var O = Fw(b), S = Qe(y.props, "".concat(O));
        if (O && J(S)) {
          var A, C;
          /.*touch.*/i.test(O) ? C = y.getMouseInfo(b.changedTouches[0]) : C = y.getMouseInfo(b), S((A = C) !== null && A !== void 0 ? A : {}, b);
        }
      }), z(y, "handleClick", function(b) {
        var O = y.getMouseInfo(b);
        if (O) {
          var S = $($({}, O), {}, {
            isTooltipActive: !0
          });
          y.setState(S), y.triggerSyncEvent(S);
          var A = y.props.onClick;
          J(A) && A(S, b);
        }
      }), z(y, "handleMouseDown", function(b) {
        var O = y.props.onMouseDown;
        if (J(O)) {
          var S = y.getMouseInfo(b);
          O(S, b);
        }
      }), z(y, "handleMouseUp", function(b) {
        var O = y.props.onMouseUp;
        if (J(O)) {
          var S = y.getMouseInfo(b);
          O(S, b);
        }
      }), z(y, "handleTouchMove", function(b) {
        b.changedTouches != null && b.changedTouches.length > 0 && y.throttleTriggeredAfterMouseMove(b.changedTouches[0]);
      }), z(y, "handleTouchStart", function(b) {
        b.changedTouches != null && b.changedTouches.length > 0 && y.handleMouseDown(b.changedTouches[0]);
      }), z(y, "handleTouchEnd", function(b) {
        b.changedTouches != null && b.changedTouches.length > 0 && y.handleMouseUp(b.changedTouches[0]);
      }), z(y, "handleDoubleClick", function(b) {
        var O = y.props.onDoubleClick;
        if (J(O)) {
          var S = y.getMouseInfo(b);
          O(S, b);
        }
      }), z(y, "handleContextMenu", function(b) {
        var O = y.props.onContextMenu;
        if (J(O)) {
          var S = y.getMouseInfo(b);
          O(S, b);
        }
      }), z(y, "triggerSyncEvent", function(b) {
        y.props.syncId !== void 0 && nc.emit(ic, y.props.syncId, b, y.eventEmitterSymbol);
      }), z(y, "applySyncEvent", function(b) {
        var O = y.props, S = O.layout, A = O.syncMethod, C = y.state.updateId, T = b.dataStartIndex, P = b.dataEndIndex;
        if (b.dataStartIndex !== void 0 || b.dataEndIndex !== void 0)
          y.setState($({
            dataStartIndex: T,
            dataEndIndex: P
          }, d({
            props: y.props,
            dataStartIndex: T,
            dataEndIndex: P,
            updateId: C
          }, y.state)));
        else if (b.activeTooltipIndex !== void 0) {
          var j = b.chartX, I = b.chartY, M = b.activeTooltipIndex, R = y.state, N = R.offset, q = R.tooltipTicks;
          if (!N)
            return;
          if (typeof A == "function")
            M = A(q, b);
          else if (A === "value") {
            M = -1;
            for (var k = 0; k < q.length; k++)
              if (q[k].value === b.activeLabel) {
                M = k;
                break;
              }
          }
          var W = $($({}, N), {}, {
            x: N.left,
            y: N.top
          }), H = Math.min(j, W.x + W.width), F = Math.min(I, W.y + W.height), G = q[M] && q[M].value, ae = yl(y.state, y.props.data, M), pe = q[M] ? {
            x: S === "horizontal" ? q[M].coordinate : H,
            y: S === "horizontal" ? F : q[M].coordinate
          } : C0;
          y.setState($($({}, b), {}, {
            activeLabel: G,
            activeCoordinate: pe,
            activePayload: ae,
            activeTooltipIndex: M
          }));
        } else
          y.setState(b);
      }), z(y, "renderCursor", function(b) {
        var O, S = y.state, A = S.isTooltipActive, C = S.activeCoordinate, T = S.activePayload, P = S.offset, j = S.activeTooltipIndex, I = S.tooltipAxisBandSize, M = y.getTooltipEventType(), R = (O = b.props.active) !== null && O !== void 0 ? O : A, N = y.props.layout, q = b.key || "_recharts-cursor";
        return /* @__PURE__ */ E.createElement(S$, {
          key: q,
          activeCoordinate: C,
          activePayload: T,
          activeTooltipIndex: j,
          chartName: r,
          element: b,
          isActive: R,
          layout: N,
          offset: P,
          tooltipAxisBandSize: I,
          tooltipEventType: M
        });
      }), z(y, "renderPolarAxis", function(b, O, S) {
        var A = Qe(b, "type.axisType"), C = Qe(y.state, "".concat(A, "Map")), T = b.type.defaultProps, P = T !== void 0 ? $($({}, T), b.props) : b.props, j = C && C[P["".concat(A, "Id")]];
        return /* @__PURE__ */ be(b, $($({}, j), {}, {
          className: ue(A, j.className),
          key: b.key || "".concat(O, "-").concat(S),
          ticks: Nr(j, !0)
        }));
      }), z(y, "renderPolarGrid", function(b) {
        var O = b.props, S = O.radialLines, A = O.polarAngles, C = O.polarRadius, T = y.state, P = T.radiusAxisMap, j = T.angleAxisMap, I = mt(P), M = mt(j), R = M.cx, N = M.cy, q = M.innerRadius, k = M.outerRadius;
        return /* @__PURE__ */ be(b, {
          polarAngles: Array.isArray(A) ? A : Nr(M, !0).map(function(W) {
            return W.coordinate;
          }),
          polarRadius: Array.isArray(C) ? C : Nr(I, !0).map(function(W) {
            return W.coordinate;
          }),
          cx: R,
          cy: N,
          innerRadius: q,
          outerRadius: k,
          key: b.key || "polar-grid",
          radialLines: S
        });
      }), z(y, "renderLegend", function() {
        var b = y.state.formattedGraphicalItems, O = y.props, S = O.children, A = O.width, C = O.height, T = y.props.margin || {}, P = A - (T.left || 0) - (T.right || 0), j = qb({
          children: S,
          formattedGraphicalItems: b,
          legendWidth: P,
          legendContent: c
        });
        if (!j)
          return null;
        var I = j.item, M = Dg(j, A$);
        return /* @__PURE__ */ be(I, $($({}, M), {}, {
          chartWidth: A,
          chartHeight: C,
          margin: T,
          onBBoxUpdate: y.handleLegendBBoxUpdate
        }));
      }), z(y, "renderTooltip", function() {
        var b, O = y.props, S = O.children, A = O.accessibilityLayer, C = De(S, Ye);
        if (!C)
          return null;
        var T = y.state, P = T.isTooltipActive, j = T.activeCoordinate, I = T.activePayload, M = T.activeLabel, R = T.offset, N = (b = C.props.active) !== null && b !== void 0 ? b : P;
        return /* @__PURE__ */ be(C, {
          viewBox: $($({}, R), {}, {
            x: R.left,
            y: R.top
          }),
          active: N,
          label: M,
          payload: N ? I : [],
          coordinate: j,
          accessibilityLayer: A
        });
      }), z(y, "renderBrush", function(b) {
        var O = y.props, S = O.margin, A = O.data, C = y.state, T = C.offset, P = C.dataStartIndex, j = C.dataEndIndex, I = C.updateId;
        return /* @__PURE__ */ be(b, {
          key: b.key || "_recharts-brush",
          onChange: Rn(y.handleBrushChange, b.props.onChange),
          data: A,
          x: B(b.props.x) ? b.props.x : T.left,
          y: B(b.props.y) ? b.props.y : T.top + T.height + T.brushBottom - (S.bottom || 0),
          width: B(b.props.width) ? b.props.width : T.width,
          startIndex: P,
          endIndex: j,
          updateId: "brush-".concat(I)
        });
      }), z(y, "renderReferenceElement", function(b, O, S) {
        if (!b)
          return null;
        var A = y, C = A.clipPathId, T = y.state, P = T.xAxisMap, j = T.yAxisMap, I = T.offset, M = b.type.defaultProps || {}, R = b.props, N = R.xAxisId, q = N === void 0 ? M.xAxisId : N, k = R.yAxisId, W = k === void 0 ? M.yAxisId : k;
        return /* @__PURE__ */ be(b, {
          key: b.key || "".concat(O, "-").concat(S),
          xAxis: P[q],
          yAxis: j[W],
          viewBox: {
            x: I.left,
            y: I.top,
            width: I.width,
            height: I.height
          },
          clipPathId: C
        });
      }), z(y, "renderActivePoints", function(b) {
        var O = b.item, S = b.activePoint, A = b.basePoint, C = b.childIndex, T = b.isRange, P = [], j = O.props.key, I = O.item.type.defaultProps !== void 0 ? $($({}, O.item.type.defaultProps), O.item.props) : O.item.props, M = I.activeDot, R = I.dataKey, N = $($({
          index: C,
          dataKey: R,
          cx: S.x,
          cy: S.y,
          r: 4,
          fill: pf(O.item),
          strokeWidth: 2,
          stroke: "#fff",
          payload: S.payload,
          value: S.value
        }, se(M, !1)), Un(M));
        return P.push(m.renderActiveDot(M, N, "".concat(j, "-activePoint-").concat(C))), A ? P.push(m.renderActiveDot(M, $($({}, N), {}, {
          cx: A.x,
          cy: A.y
        }), "".concat(j, "-basePoint-").concat(C))) : T && P.push(null), P;
      }), z(y, "renderGraphicChild", function(b, O, S) {
        var A = y.filterFormatItem(b, O, S);
        if (!A)
          return null;
        var C = y.getTooltipEventType(), T = y.state, P = T.isTooltipActive, j = T.tooltipAxis, I = T.activeTooltipIndex, M = T.activeLabel, R = y.props.children, N = De(R, Ye), q = A.props, k = q.points, W = q.isRange, H = q.baseLine, F = A.item.type.defaultProps !== void 0 ? $($({}, A.item.type.defaultProps), A.item.props) : A.item.props, G = F.activeDot, ae = F.hide, pe = F.activeBar, $e = F.activeShape, Et = !!(!ae && P && N && (G || pe || $e)), Me = {};
        C !== "axis" && N && N.props.trigger === "click" ? Me = {
          onClick: Rn(y.handleItemMouseEnter, b.props.onClick)
        } : C !== "axis" && (Me = {
          onMouseLeave: Rn(y.handleItemMouseLeave, b.props.onMouseLeave),
          onMouseEnter: Rn(y.handleItemMouseEnter, b.props.onMouseEnter)
        });
        var L = /* @__PURE__ */ be(b, $($({}, A.props), Me));
        function K(Mt) {
          return typeof j.dataKey == "function" ? j.dataKey(Mt.payload) : null;
        }
        if (Et)
          if (I >= 0) {
            var X, D;
            if (j.dataKey && !j.allowDuplicatedCategory) {
              var fe = typeof j.dataKey == "function" ? K : "payload.".concat(j.dataKey.toString());
              X = Fn(k, fe, M), D = W && H && Fn(H, fe, M);
            } else
              X = k?.[I], D = W && H && H[I];
            if ($e || pe) {
              var Z = b.props.activeIndex !== void 0 ? b.props.activeIndex : I;
              return [/* @__PURE__ */ be(b, $($($({}, A.props), Me), {}, {
                activeIndex: Z
              })), null, null];
            }
            if (!V(X))
              return [L].concat(br(y.renderActivePoints({
                item: A,
                activePoint: X,
                basePoint: D,
                childIndex: I,
                isRange: W
              })));
          } else {
            var ye, ge = (ye = y.getItemByXY(y.state.activeCoordinate)) !== null && ye !== void 0 ? ye : {
              graphicalItem: L
            }, Ce = ge.graphicalItem, yt = Ce.item, Xt = yt === void 0 ? b : yt, Tn = Ce.childIndex, jt = $($($({}, A.props), Me), {}, {
              activeIndex: Tn
            });
            return [/* @__PURE__ */ be(Xt, jt), null, null];
          }
        return W ? [L, null, null] : [L, null];
      }), z(y, "renderCustomized", function(b, O, S) {
        return /* @__PURE__ */ be(b, $($({
          key: "recharts-customized-".concat(S)
        }, y.props), y.state));
      }), z(y, "renderMap", {
        CartesianGrid: {
          handler: Ln,
          once: !0
        },
        ReferenceArea: {
          handler: y.renderReferenceElement
        },
        ReferenceLine: {
          handler: Ln
        },
        ReferenceDot: {
          handler: y.renderReferenceElement
        },
        XAxis: {
          handler: Ln
        },
        YAxis: {
          handler: Ln
        },
        Brush: {
          handler: y.renderBrush,
          once: !0
        },
        Bar: {
          handler: y.renderGraphicChild
        },
        Line: {
          handler: y.renderGraphicChild
        },
        Area: {
          handler: y.renderGraphicChild
        },
        Radar: {
          handler: y.renderGraphicChild
        },
        RadialBar: {
          handler: y.renderGraphicChild
        },
        Scatter: {
          handler: y.renderGraphicChild
        },
        Pie: {
          handler: y.renderGraphicChild
        },
        Funnel: {
          handler: y.renderGraphicChild
        },
        Tooltip: {
          handler: y.renderCursor,
          once: !0
        },
        PolarGrid: {
          handler: y.renderPolarGrid,
          once: !0
        },
        PolarAngleAxis: {
          handler: y.renderPolarAxis
        },
        PolarRadiusAxis: {
          handler: y.renderPolarAxis
        },
        Customized: {
          handler: y.renderCustomized
        }
      }), y.clipPathId = "".concat((x = w.id) !== null && x !== void 0 ? x : Ni("recharts"), "-clip"), y.throttleTriggeredAfterMouseMove = Bm(y.triggeredAfterMouseMove, (_ = w.throttleDelay) !== null && _ !== void 0 ? _ : 1e3 / 60), y.state = {}, y;
    }
    return q$(m, p), $$(m, [{
      key: "componentDidMount",
      value: function() {
        var x, _;
        this.addListener(), this.accessibilityManager.setDetails({
          container: this.container,
          offset: {
            left: (x = this.props.margin.left) !== null && x !== void 0 ? x : 0,
            top: (_ = this.props.margin.top) !== null && _ !== void 0 ? _ : 0
          },
          coordinateList: this.state.tooltipTicks,
          mouseHandlerCallback: this.triggeredAfterMouseMove,
          layout: this.props.layout
        }), this.displayDefaultTooltip();
      }
    }, {
      key: "displayDefaultTooltip",
      value: function() {
        var x = this.props, _ = x.children, y = x.data, b = x.height, O = x.layout, S = De(_, Ye);
        if (S) {
          var A = S.props.defaultIndex;
          if (!(typeof A != "number" || A < 0 || A > this.state.tooltipTicks.length - 1)) {
            var C = this.state.tooltipTicks[A] && this.state.tooltipTicks[A].value, T = yl(this.state, y, A, C), P = this.state.tooltipTicks[A].coordinate, j = (this.state.offset.top + b) / 2, I = O === "horizontal", M = I ? {
              x: P,
              y: j
            } : {
              y: P,
              x: j
            }, R = this.state.formattedGraphicalItems.find(function(q) {
              var k = q.item;
              return k.type.name === "Scatter";
            });
            R && (M = $($({}, M), R.props.points[A].tooltipPosition), T = R.props.points[A].tooltipPayload);
            var N = {
              activeTooltipIndex: A,
              isTooltipActive: !0,
              activeLabel: C,
              activePayload: T,
              activeCoordinate: M
            };
            this.setState(N), this.renderCursor(S), this.accessibilityManager.setIndex(A);
          }
        }
      }
    }, {
      key: "getSnapshotBeforeUpdate",
      value: function(x, _) {
        if (!this.props.accessibilityLayer)
          return null;
        if (this.state.tooltipTicks !== _.tooltipTicks && this.accessibilityManager.setDetails({
          coordinateList: this.state.tooltipTicks
        }), this.props.layout !== x.layout && this.accessibilityManager.setDetails({
          layout: this.props.layout
        }), this.props.margin !== x.margin) {
          var y, b;
          this.accessibilityManager.setDetails({
            offset: {
              left: (y = this.props.margin.left) !== null && y !== void 0 ? y : 0,
              top: (b = this.props.margin.top) !== null && b !== void 0 ? b : 0
            }
          });
        }
        return null;
      }
    }, {
      key: "componentDidUpdate",
      value: function(x) {
        lc([De(x.children, Ye)], [De(this.props.children, Ye)]) || this.displayDefaultTooltip();
      }
    }, {
      key: "componentWillUnmount",
      value: function() {
        this.removeListener(), this.throttleTriggeredAfterMouseMove.cancel();
      }
    }, {
      key: "getTooltipEventType",
      value: function() {
        var x = De(this.props.children, Ye);
        if (x && typeof x.props.shared == "boolean") {
          var _ = x.props.shared ? "axis" : "item";
          return u.indexOf(_) >= 0 ? _ : a;
        }
        return a;
      }
      /**
       * Get the information of mouse in chart, return null when the mouse is not in the chart
       * @param  {MousePointer} event    The event object
       * @return {Object}          Mouse data
       */
    }, {
      key: "getMouseInfo",
      value: function(x) {
        if (!this.container)
          return null;
        var _ = this.container, y = _.getBoundingClientRect(), b = jO(y), O = {
          chartX: Math.round(x.pageX - b.left),
          chartY: Math.round(x.pageY - b.top)
        }, S = y.width / _.offsetWidth || 1, A = this.inRange(O.chartX, O.chartY, S);
        if (!A)
          return null;
        var C = this.state, T = C.xAxisMap, P = C.yAxisMap, j = this.getTooltipEventType(), I = qg(this.state, this.props.data, this.props.layout, A);
        if (j !== "axis" && T && P) {
          var M = mt(T).scale, R = mt(P).scale, N = M && M.invert ? M.invert(O.chartX) : null, q = R && R.invert ? R.invert(O.chartY) : null;
          return $($({}, O), {}, {
            xValue: N,
            yValue: q
          }, I);
        }
        return I ? $($({}, O), I) : null;
      }
    }, {
      key: "inRange",
      value: function(x, _) {
        var y = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1, b = this.props.layout, O = x / y, S = _ / y;
        if (b === "horizontal" || b === "vertical") {
          var A = this.state.offset, C = O >= A.left && O <= A.left + A.width && S >= A.top && S <= A.top + A.height;
          return C ? {
            x: O,
            y: S
          } : null;
        }
        var T = this.state, P = T.angleAxisMap, j = T.radiusAxisMap;
        if (P && j) {
          var I = mt(P);
          return ly({
            x: O,
            y: S
          }, I);
        }
        return null;
      }
    }, {
      key: "parseEventsOfWrapper",
      value: function() {
        var x = this.props.children, _ = this.getTooltipEventType(), y = De(x, Ye), b = {};
        y && _ === "axis" && (y.props.trigger === "click" ? b = {
          onClick: this.handleClick
        } : b = {
          onMouseEnter: this.handleMouseEnter,
          onDoubleClick: this.handleDoubleClick,
          onMouseMove: this.handleMouseMove,
          onMouseLeave: this.handleMouseLeave,
          onTouchMove: this.handleTouchMove,
          onTouchStart: this.handleTouchStart,
          onTouchEnd: this.handleTouchEnd,
          onContextMenu: this.handleContextMenu
        });
        var O = Un(this.props, this.handleOuterEvent);
        return $($({}, O), b);
      }
    }, {
      key: "addListener",
      value: function() {
        nc.on(ic, this.handleReceiveSyncEvent);
      }
    }, {
      key: "removeListener",
      value: function() {
        nc.removeListener(ic, this.handleReceiveSyncEvent);
      }
    }, {
      key: "filterFormatItem",
      value: function(x, _, y) {
        for (var b = this.state.formattedGraphicalItems, O = 0, S = b.length; O < S; O++) {
          var A = b[O];
          if (A.item === x || A.props.key === x.key || _ === st(A.item.type) && y === A.childIndex)
            return A;
        }
        return null;
      }
    }, {
      key: "renderClipPath",
      value: function() {
        var x = this.clipPathId, _ = this.state.offset, y = _.left, b = _.top, O = _.height, S = _.width;
        return /* @__PURE__ */ E.createElement("defs", null, /* @__PURE__ */ E.createElement("clipPath", {
          id: x
        }, /* @__PURE__ */ E.createElement("rect", {
          x: y,
          y: b,
          height: O,
          width: S
        })));
      }
    }, {
      key: "getXScales",
      value: function() {
        var x = this.state.xAxisMap;
        return x ? Object.entries(x).reduce(function(_, y) {
          var b = Rg(y, 2), O = b[0], S = b[1];
          return $($({}, _), {}, z({}, O, S.scale));
        }, {}) : null;
      }
    }, {
      key: "getYScales",
      value: function() {
        var x = this.state.yAxisMap;
        return x ? Object.entries(x).reduce(function(_, y) {
          var b = Rg(y, 2), O = b[0], S = b[1];
          return $($({}, _), {}, z({}, O, S.scale));
        }, {}) : null;
      }
    }, {
      key: "getXScaleByAxisId",
      value: function(x) {
        var _;
        return (_ = this.state.xAxisMap) === null || _ === void 0 || (_ = _[x]) === null || _ === void 0 ? void 0 : _.scale;
      }
    }, {
      key: "getYScaleByAxisId",
      value: function(x) {
        var _;
        return (_ = this.state.yAxisMap) === null || _ === void 0 || (_ = _[x]) === null || _ === void 0 ? void 0 : _.scale;
      }
    }, {
      key: "getItemByXY",
      value: function(x) {
        var _ = this.state, y = _.formattedGraphicalItems, b = _.activeItem;
        if (y && y.length)
          for (var O = 0, S = y.length; O < S; O++) {
            var A = y[O], C = A.props, T = A.item, P = T.type.defaultProps !== void 0 ? $($({}, T.type.defaultProps), T.props) : T.props, j = st(T.type);
            if (j === "Bar") {
              var I = (C.data || []).find(function(q) {
                return AM(x, q);
              });
              if (I)
                return {
                  graphicalItem: A,
                  payload: I
                };
            } else if (j === "RadialBar") {
              var M = (C.data || []).find(function(q) {
                return ly(x, q);
              });
              if (M)
                return {
                  graphicalItem: A,
                  payload: M
                };
            } else if (ra(A, b) || na(A, b) || pn(A, b)) {
              var R = vC({
                graphicalItem: A,
                activeTooltipItem: b,
                itemData: P.data
              }), N = P.activeIndex === void 0 ? R : P.activeIndex;
              return {
                graphicalItem: $($({}, A), {}, {
                  childIndex: N
                }),
                payload: pn(A, b) ? P.data[R] : A.props.data[R]
              };
            }
          }
        return null;
      }
    }, {
      key: "render",
      value: function() {
        var x = this;
        if (!Mh(this))
          return null;
        var _ = this.props, y = _.children, b = _.className, O = _.width, S = _.height, A = _.style, C = _.compact, T = _.title, P = _.desc, j = Dg(_, P$), I = se(j, !1);
        if (C)
          return /* @__PURE__ */ E.createElement(Og, {
            state: this.state,
            width: this.props.width,
            height: this.props.height,
            clipPathId: this.clipPathId
          }, /* @__PURE__ */ E.createElement(hc, Qt({}, I, {
            width: O,
            height: S,
            title: T,
            desc: P
          }), this.renderClipPath(), Ih(y, this.renderMap)));
        if (this.props.accessibilityLayer) {
          var M, R;
          I.tabIndex = (M = this.props.tabIndex) !== null && M !== void 0 ? M : 0, I.role = (R = this.props.role) !== null && R !== void 0 ? R : "application", I.onKeyDown = function(q) {
            x.accessibilityManager.keyboardEvent(q);
          }, I.onFocus = function() {
            x.accessibilityManager.focus();
          };
        }
        var N = this.parseEventsOfWrapper();
        return /* @__PURE__ */ E.createElement(Og, {
          state: this.state,
          width: this.props.width,
          height: this.props.height,
          clipPathId: this.clipPathId
        }, /* @__PURE__ */ E.createElement("div", Qt({
          className: ue("recharts-wrapper", b),
          style: $({
            position: "relative",
            cursor: "default",
            width: O,
            height: S
          }, A)
        }, N, {
          ref: function(k) {
            x.container = k;
          }
        }), /* @__PURE__ */ E.createElement(hc, Qt({}, I, {
          width: O,
          height: S,
          title: T,
          desc: P,
          style: W$
        }), this.renderClipPath(), Ih(y, this.renderMap)), this.renderLegend(), this.renderTooltip()));
      }
    }]);
  })(q0);
  z(g, "displayName", r), z(g, "defaultProps", $({
    layout: "horizontal",
    stackOffset: "none",
    barCategoryGap: "10%",
    barGap: 4,
    margin: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    },
    reverseStackOrder: !1,
    syncMethod: "index"
  }, l)), z(g, "getDerivedStateFromProps", function(p, m) {
    var w = p.dataKey, x = p.data, _ = p.children, y = p.width, b = p.height, O = p.layout, S = p.stackOffset, A = p.margin, C = m.dataStartIndex, T = m.dataEndIndex;
    if (m.updateId === void 0) {
      var P = kg(p);
      return $($($({}, P), {}, {
        updateId: 0
      }, d($($({
        props: p
      }, P), {}, {
        updateId: 0
      }), m)), {}, {
        prevDataKey: w,
        prevData: x,
        prevWidth: y,
        prevHeight: b,
        prevLayout: O,
        prevStackOffset: S,
        prevMargin: A,
        prevChildren: _
      });
    }
    if (w !== m.prevDataKey || x !== m.prevData || y !== m.prevWidth || b !== m.prevHeight || O !== m.prevLayout || S !== m.prevStackOffset || !oc(A, m.prevMargin)) {
      var j = kg(p), I = {
        // (chartX, chartY) are (0,0) in default state, but we want to keep the last mouse position to avoid
        // any flickering
        chartX: m.chartX,
        chartY: m.chartY,
        // The tooltip should stay active when it was active in the previous render. If this is not
        // the case, the tooltip disappears and immediately re-appears, causing a flickering effect
        isTooltipActive: m.isTooltipActive
      }, M = $($({}, qg(m, x, O)), {}, {
        updateId: m.updateId + 1
      }), R = $($($({}, j), I), M);
      return $($($({}, R), d($({
        props: p
      }, R), m)), {}, {
        prevDataKey: w,
        prevData: x,
        prevWidth: y,
        prevHeight: b,
        prevLayout: O,
        prevStackOffset: S,
        prevMargin: A,
        prevChildren: _
      });
    }
    if (!lc(_, m.prevChildren)) {
      var N, q, k, W, H = De(_, pr), F = H && (N = (q = H.props) === null || q === void 0 ? void 0 : q.startIndex) !== null && N !== void 0 ? N : C, G = H && (k = (W = H.props) === null || W === void 0 ? void 0 : W.endIndex) !== null && k !== void 0 ? k : T, ae = F !== C || G !== T, pe = !V(x), $e = pe && !ae ? m.updateId : m.updateId + 1;
      return $($({
        updateId: $e
      }, d($($({
        props: p
      }, m), {}, {
        updateId: $e,
        dataStartIndex: F,
        dataEndIndex: G
      }), m)), {}, {
        prevChildren: _,
        dataStartIndex: F,
        dataEndIndex: G
      });
    }
    return null;
  }), z(g, "renderActiveDot", function(p, m, w) {
    var x;
    return /* @__PURE__ */ Ge(p) ? x = /* @__PURE__ */ be(p, m) : J(p) ? x = p(m) : x = /* @__PURE__ */ E.createElement(n0, m), /* @__PURE__ */ E.createElement(Te, {
      className: "recharts-active-dot",
      key: w
    }, x);
  });
  var v = /* @__PURE__ */ bn(function(m, w) {
    return /* @__PURE__ */ E.createElement(g, Qt({}, m, {
      ref: w
    }));
  });
  return v.displayName = g.displayName, v;
};
const Q$ = { light: "", dark: ".dark" }, $0 = _t(null);
function R0() {
  const e = rt($0);
  if (!e)
    throw new Error("useChart must be used within a <ChartContainer />");
  return e;
}
const eR = bn(({ id: e, className: t, children: r, config: n, ...i }, a) => {
  const o = k0(), u = `chart-${e || o.replace(/:/g, "")}`;
  return /* @__PURE__ */ Y.jsx($0.Provider, { value: { config: n }, children: /* @__PURE__ */ Y.jsxs(
    "div",
    {
      ref: a,
      className: we(
        "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted  [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden",
        t
      ),
      "data-chart": u,
      ...i,
      children: [
        /* @__PURE__ */ Y.jsx(tR, { config: n, id: u }),
        /* @__PURE__ */ Y.jsx(_O, { children: r })
      ]
    }
  ) });
});
eR.displayName = "Chart";
const tR = ({ id: e, config: t }) => {
  const r = Object.entries(t).filter(
    ([, n]) => n.theme || n.color
  );
  return r.length ? /* @__PURE__ */ Y.jsx(
    "style",
    {
      dangerouslySetInnerHTML: {
        __html: Object.entries(Q$).map(
          ([n, i]) => `
${i} [data-chart=${e}] {
${r.map(([a, o]) => {
            const u = o.theme?.[n] || o.color;
            return u ? `  --color-${a}: ${u};` : null;
          }).join(`
`)}
}
`
        ).join(`
`)
      }
    }
  ) : null;
}, $R = Ye, rR = bn(
  ({
    active: e,
    payload: t,
    className: r,
    indicator: n = "dot",
    hideLabel: i = !1,
    hideIndicator: a = !1,
    label: o,
    labelFormatter: u,
    labelClassName: s,
    formatter: c,
    color: f,
    nameKey: l,
    labelKey: h
  }, d) => {
    const { config: g } = R0(), v = wl(() => {
      if (i || !t?.length)
        return null;
      const [m] = t, w = `${h || m.dataKey || m.name || "value"}`, x = gl(g, m, w), _ = !h && typeof o == "string" ? g[o]?.label || o : x?.label;
      return u ? /* @__PURE__ */ Y.jsx("div", { className: we("font-medium", s), children: u(_, t) }) : _ ? /* @__PURE__ */ Y.jsx("div", { className: we("font-medium", s), children: _ }) : null;
    }, [
      o,
      u,
      t,
      i,
      s,
      g,
      h
    ]);
    if (!e || !t?.length)
      return null;
    const p = t.length === 1 && n !== "dot";
    return /* @__PURE__ */ Y.jsxs(
      "div",
      {
        ref: d,
        className: we(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          r
        ),
        children: [
          p ? null : v,
          /* @__PURE__ */ Y.jsx("div", { className: "grid gap-1", children: t.map((m, w) => {
            const x = `${l || m.name || m.dataKey || "value"}`, _ = gl(g, m, x), y = f || m.payload.fill || m.color;
            return /* @__PURE__ */ Y.jsx(
              "div",
              {
                className: we(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  n === "dot" && "items-center"
                ),
                children: c && m?.value !== void 0 && m.name ? c(m.value, m.name, m, w, m.payload) : /* @__PURE__ */ Y.jsxs(Y.Fragment, { children: [
                  _?.icon ? /* @__PURE__ */ Y.jsx(_.icon, {}) : !a && /* @__PURE__ */ Y.jsx(
                    "div",
                    {
                      className: we(
                        "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                        {
                          "h-2.5 w-2.5": n === "dot",
                          "w-1": n === "line",
                          "w-0 border-[1.5px] border-dashed bg-transparent": n === "dashed",
                          "my-0.5": p && n === "dashed"
                        }
                      ),
                      style: {
                        "--color-bg": y,
                        "--color-border": y
                      }
                    }
                  ),
                  /* @__PURE__ */ Y.jsxs(
                    "div",
                    {
                      className: we(
                        "flex flex-1 justify-between leading-none gap-1.5",
                        p ? "items-end" : "items-center"
                      ),
                      children: [
                        /* @__PURE__ */ Y.jsxs("div", { className: "grid gap-1.5", children: [
                          p ? v : null,
                          /* @__PURE__ */ Y.jsx("span", { className: "text-muted-foreground", children: _?.label || m.name })
                        ] }),
                        m.value && /* @__PURE__ */ Y.jsx("span", { className: "font-mono font-medium text-foreground tabular-nums", children: m.value.toLocaleString() })
                      ]
                    }
                  )
                ] })
              },
              m.dataKey
            );
          }) })
        ]
      }
    );
  }
);
rR.displayName = "ChartTooltip";
const nR = bn(
  ({ className: e, hideIcon: t = !1, payload: r, verticalAlign: n = "bottom", nameKey: i }, a) => {
    const { config: o } = R0();
    return r?.length ? /* @__PURE__ */ Y.jsx(
      "div",
      {
        ref: a,
        className: we(
          "flex items-center justify-center gap-4",
          n === "top" ? "pb-3" : "pt-3",
          e
        ),
        children: r.map((u) => {
          const s = `${i || u.dataKey || "value"}`, c = gl(o, u, s);
          return /* @__PURE__ */ Y.jsxs(
            "div",
            {
              className: we(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              ),
              children: [
                c?.icon && !t ? /* @__PURE__ */ Y.jsx(c.icon, {}) : /* @__PURE__ */ Y.jsx(
                  "div",
                  {
                    className: "size-2 shrink-0 rounded-full",
                    style: {
                      backgroundColor: u.color
                    }
                  }
                ),
                c?.label
              ]
            },
            u.value
          );
        })
      }
    ) : null;
  }
);
nR.displayName = "ChartLegend";
function gl(e, t, r) {
  if (typeof t != "object" || t === null)
    return;
  const n = "payload" in t && typeof t.payload == "object" && t.payload !== null ? t.payload : void 0;
  let i = r;
  return r in t && typeof t[r] == "string" ? i = t[r] : n && r in n && typeof n[r] == "string" && (i = n[r]), i in e ? e[i] : e[r];
}
const RR = ({ x: e, y: t, payload: r, index: n, formatter: i = (a) => String(a) }) => {
  const a = n === 0 ? "start" : "end";
  return /* @__PURE__ */ Y.jsx("g", { transform: `translate(${e},${t})`, children: /* @__PURE__ */ Y.jsx(
    "text",
    {
      dy: 16,
      fill: "var(--muted-foreground)",
      textAnchor: a,
      x: 0,
      y: -12,
      children: i(r.value)
    }
  ) });
}, iR = E.forwardRef(({ children: e, className: t, ...r }, n) => /* @__PURE__ */ Y.jsx(
  "div",
  {
    ref: n,
    className: we("flex flex-col items-stretch", t),
    ...r,
    children: e
  }
));
iR.displayName = "DataList";
const aR = E.forwardRef(({ children: e, className: t, ...r }, n) => /* @__PURE__ */ Y.jsx(
  "div",
  {
    ref: n,
    className: we("flex uppercase items-center justify-between gap-2 border-b p-2 text-xs tracking-wide font-medium text-muted-foreground", t),
    ...r,
    children: e
  }
));
aR.displayName = "DataListHeader";
const oR = E.forwardRef(({ children: e, className: t, ...r }, n) => /* @__PURE__ */ Y.jsx(
  "div",
  {
    ref: n,
    className: we("", t),
    ...r,
    children: e
  }
));
oR.displayName = "DataListHead";
const uR = E.forwardRef(({ children: e, className: t, ...r }, n) => /* @__PURE__ */ Y.jsx(
  "div",
  {
    ref: n,
    className: we("flex flex-col items-stretch pt-1.5", t),
    ...r,
    children: e
  }
));
uR.displayName = "DataListBody";
const sR = E.forwardRef(({ children: e, className: t, ...r }, n) => /* @__PURE__ */ Y.jsx(
  "div",
  {
    ref: n,
    className: we("group/row py-0.5 relative flex items-center justify-between gap-3 before:absolute before:z-0 before:-inset-x-0.5 before:inset-y-0.5 before:bg-muted/60 before:opacity-0 hover:before:opacity-100 before:rounded-[6px]", t),
    ...r,
    children: e
  }
));
sR.displayName = "DataListRow";
const cR = E.forwardRef(({ children: e, className: t, ...r }, n) => /* @__PURE__ */ Y.jsx(
  "div",
  {
    ref: n,
    className: we("absolute inset-x-0 inset-y-1 z-0 origin-left rounded-[4px] bg-state-info/10 group-hover/row:bg-state-info/25 dark:bg-state-info/20 dark:group-hover/row:bg-state-info/35 transition-all", t),
    ...r,
    children: e
  }
));
cR.displayName = "DataListBar";
const lR = E.forwardRef(({ children: e, className: t, ...r }, n) => /* @__PURE__ */ Y.jsx(
  "div",
  {
    ref: n,
    className: we("text-sm p-2 font-medium relative z-10 flex min-w-0 max-w-[calc(100%-32px)] items-center transition-[max-width] duration-300 ease-in-out group-hover/datalist:max-w-[calc(100%-100px)]", t),
    ...r,
    children: e
  }
));
lR.displayName = "DataListItemContent";
const fR = E.forwardRef(({ children: e, className: t, ...r }, n) => {
  const a = E.Children.toArray(e).length > 1;
  return /* @__PURE__ */ Y.jsx(
    "div",
    {
      ref: n,
      className: we(
        "z-10 flex items-center",
        // Apply animation styles when there are multiple children
        a && '[&>[data-type="value-abs"]]:transition-transform [&>[data-type="value-abs"]]:duration-300 [&>[data-type="value-abs"]]:group-hover/datalist:-translate-x-14',
        a && '[&>[data-type="value-perc"]]:invisible [&>[data-type="value-perc"]]:absolute [&>[data-type="value-perc"]]:right-0 [&>[data-type="value-perc"]]:translate-x-14 [&>[data-type="value-perc"]]:opacity-0 [&>[data-type="value-perc"]]:transition-all [&>[data-type="value-perc"]]:duration-300 [&>[data-type="value-perc"]]:group-hover/datalist:visible [&>[data-type="value-perc"]]:group-hover/datalist:translate-x-0 [&>[data-type="value-perc"]]:group-hover/datalist:opacity-100',
        t
      ),
      ...r,
      children: e
    }
  );
});
fR.displayName = "DataListItemValue";
const hR = E.forwardRef(({ children: e, className: t, ...r }, n) => /* @__PURE__ */ Y.jsx(
  "div",
  {
    ref: n,
    className: we("z-10 px-2 text-sm font-mono", t),
    "data-type": "value-abs",
    ...r,
    children: e
  }
));
hR.displayName = "DataListItemValueAbs";
const pR = E.forwardRef(({ children: e, className: t, ...r }, n) => /* @__PURE__ */ Y.jsx(
  "div",
  {
    ref: n,
    className: we("px-3 text-sm font-mono text-muted-foreground", t),
    "data-type": "value-perc",
    ...r,
    children: e
  }
));
pR.displayName = "DataListItemValuePerc";
export {
  Pe as $,
  RR as A,
  Qe as B,
  Fm as C,
  iR as D,
  PR as E,
  jT as F,
  zi as G,
  iy as H,
  _R as I,
  xR as J,
  rv as K,
  Ee as L,
  SR as M,
  Nr as N,
  Hb as O,
  Xe as P,
  wR as Q,
  Vt as R,
  sC as S,
  Ec as T,
  lf as U,
  J as V,
  xn as W,
  V as X,
  B as Y,
  Ze as Z,
  Zi as _,
  xt as a,
  xb as a0,
  iP as a1,
  St as a2,
  uP as a3,
  oc as a4,
  OT as a5,
  Ni as a6,
  TR as a7,
  CR as a8,
  MR as a9,
  jR as aa,
  OI as ab,
  SI as ac,
  ER as ad,
  qt as ae,
  mR as b,
  bR as c,
  eR as d,
  $R as e,
  rR as f,
  xy as g,
  cR as h,
  uR as i,
  oR as j,
  aR as k,
  lR as l,
  fR as m,
  hR as n,
  pR as o,
  sR as p,
  n0 as q,
  Lt as r,
  Te as s,
  sc as t,
  se as u,
  Ke as v,
  _T as w,
  AR as x,
  OR as y,
  IR as z
};
//# sourceMappingURL=data-list-BiiYXQes.mjs.map

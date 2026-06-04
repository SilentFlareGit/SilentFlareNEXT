import { m as H, R as O, E as jt, P as We, a1 as qe, J as a, a5 as re, X as Ue, O as Ee, a4 as wt, W as He, a0 as M, z as _, i as Y, t as Wt, A as qt, r as Ut, G as R, x as at } from "./index-B0-GYxa-.mjs";
import { b7 as I, bu as At, bv as Ht, bw as kt, bx as Zt, bp as ee, aK as Ze, bt as G, a4 as F, bj as St, aW as Qe, a2 as Je, M as Qt, J as Jt, bq as de, bk as se, aB as Xt, b as er, be as tr, bn as nt, bo as rr, br as ie, a3 as ar, bB as nr, Z as sr, bs as Oe, b8 as ir, p as or, bf as lr, bg as we, bU as st, bd as cr, b9 as dr, S as ye, A as ur, h as Xe, bz as be, aZ as oe, g as pr, N as fr, Q as mr, O as hr, P as Ae, Y as br, bb as q, bi as je, bc as pe, bI as xr, bh as Z, aD as Ot, T as gr, aI as vr, bP as yr, i as _e, m as et, n as tt, k as rt, at as Pt, ay as _t, az as Nt, au as Tt, aw as Ke, j as Ne, s as Dt, w as Ct, u as jr, o as wr, aU as Ar, aV as kr, x as Sr, B as it, q as Or, b6 as Pr, bS as _r, aG as Nr, aF as Tr, ag as Dr, K as Cr, aH as Er, r as Rr } from "./stats-1OOUxAam.mjs";
import { S as Mr, k as Ir, a as Lr, f as $r, b as Br, d as Fr, e as Kr, c as Gr, g as Vr, C as ne, j as zr, l as Yr } from "./content-helpers-Z7CNKj5g.mjs";
import { T as Et, c as Rt, a as ke, b as W, K as Wr, d as Se } from "./kpi-tabs-BB2VIhr4.mjs";
import { a as xe, f as K, b as L, c as qr, T as Mt, e as It, d as U, S as ue, B as Ur } from "./sort-button-DA_nsVfw.mjs";
import { g as $e, u as Hr } from "./use-growth-stats-D72MhBRu.mjs";
import { c as Zr, d as Qr } from "./audience-DCrfTPs2.mjs";
var Jr = ["points", "className", "baseLinePoints", "connectNulls"];
function le() {
  return le = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
    }
    return t;
  }, le.apply(this, arguments);
}
function Xr(t, e) {
  if (t == null) return {};
  var n = ea(t, e), r, s;
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    for (s = 0; s < o.length; s++)
      r = o[s], !(e.indexOf(r) >= 0) && Object.prototype.propertyIsEnumerable.call(t, r) && (n[r] = t[r]);
  }
  return n;
}
function ea(t, e) {
  if (t == null) return {};
  var n = {};
  for (var r in t)
    if (Object.prototype.hasOwnProperty.call(t, r)) {
      if (e.indexOf(r) >= 0) continue;
      n[r] = t[r];
    }
  return n;
}
function ot(t) {
  return na(t) || aa(t) || ra(t) || ta();
}
function ta() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ra(t, e) {
  if (t) {
    if (typeof t == "string") return Ge(t, e);
    var n = Object.prototype.toString.call(t).slice(8, -1);
    if (n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set") return Array.from(t);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Ge(t, e);
  }
}
function aa(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function na(t) {
  if (Array.isArray(t)) return Ge(t);
}
function Ge(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
  return r;
}
var lt = function(e) {
  return e && e.x === +e.x && e.y === +e.y;
}, sa = function() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], n = [[]];
  return e.forEach(function(r) {
    lt(r) ? n[n.length - 1].push(r) : n[n.length - 1].length > 0 && n.push([]);
  }), lt(e[0]) && n[n.length - 1].push(e[0]), n[n.length - 1].length <= 0 && (n = n.slice(0, -1)), n;
}, ge = function(e, n) {
  var r = sa(e);
  n && (r = [r.reduce(function(o, i) {
    return [].concat(ot(o), ot(i));
  }, [])]);
  var s = r.map(function(o) {
    return o.reduce(function(i, u, h) {
      return "".concat(i).concat(h === 0 ? "M" : "L").concat(u.x, ",").concat(u.y);
    }, "");
  }).join("");
  return r.length === 1 ? "".concat(s, "Z") : s;
}, ia = function(e, n, r) {
  var s = ge(e, r);
  return "".concat(s.slice(-1) === "Z" ? s.slice(0, -1) : s, "L").concat(ge(n.reverse(), r).slice(1));
}, oa = function(e) {
  var n = e.points, r = e.className, s = e.baseLinePoints, o = e.connectNulls, i = Xr(e, Jr);
  if (!n || !n.length)
    return null;
  var u = H("recharts-polygon", r);
  if (s && s.length) {
    var h = i.stroke && i.stroke !== "none", d = ia(n, s, o);
    return /* @__PURE__ */ O.createElement("g", {
      className: u
    }, /* @__PURE__ */ O.createElement("path", le({}, I(i, !0), {
      fill: d.slice(-1) === "Z" ? i.fill : "none",
      stroke: "none",
      d
    })), h ? /* @__PURE__ */ O.createElement("path", le({}, I(i, !0), {
      fill: "none",
      d: ge(n, o)
    })) : null, h ? /* @__PURE__ */ O.createElement("path", le({}, I(i, !0), {
      fill: "none",
      d: ge(s, o)
    })) : null);
  }
  var c = ge(n, o);
  return /* @__PURE__ */ O.createElement("path", le({}, I(i, !0), {
    fill: c.slice(-1) === "Z" ? i.fill : "none",
    className: u,
    d: c
  }));
}, Be, ct;
function la() {
  if (ct) return Be;
  ct = 1;
  var t = At(), e = Ht(), n = kt();
  function r(s, o) {
    return s && s.length ? t(s, n(o, 2), e) : void 0;
  }
  return Be = r, Be;
}
var ca = la();
const da = /* @__PURE__ */ jt(ca);
var Fe, dt;
function ua() {
  if (dt) return Fe;
  dt = 1;
  var t = At(), e = kt(), n = Zt();
  function r(s, o) {
    return s && s.length ? t(s, e(o, 2), n) : void 0;
  }
  return Fe = r, Fe;
}
var pa = ua();
const fa = /* @__PURE__ */ jt(pa);
var ma = ["cx", "cy", "angle", "ticks", "axisLine"], ha = ["ticks", "tick", "angle", "tickFormatter", "stroke"];
function fe(t) {
  "@babel/helpers - typeof";
  return fe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, fe(t);
}
function ve() {
  return ve = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
    }
    return t;
  }, ve.apply(this, arguments);
}
function ut(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(s) {
      return Object.getOwnPropertyDescriptor(t, s).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function J(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? ut(Object(n), !0).forEach(function(r) {
      Re(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : ut(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function pt(t, e) {
  if (t == null) return {};
  var n = ba(t, e), r, s;
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    for (s = 0; s < o.length; s++)
      r = o[s], !(e.indexOf(r) >= 0) && Object.prototype.propertyIsEnumerable.call(t, r) && (n[r] = t[r]);
  }
  return n;
}
function ba(t, e) {
  if (t == null) return {};
  var n = {};
  for (var r in t)
    if (Object.prototype.hasOwnProperty.call(t, r)) {
      if (e.indexOf(r) >= 0) continue;
      n[r] = t[r];
    }
  return n;
}
function xa(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function ft(t, e) {
  for (var n = 0; n < e.length; n++) {
    var r = e[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, $t(r.key), r);
  }
}
function ga(t, e, n) {
  return e && ft(t.prototype, e), n && ft(t, n), Object.defineProperty(t, "prototype", { writable: !1 }), t;
}
function va(t, e, n) {
  return e = Te(e), ya(t, Lt() ? Reflect.construct(e, n || [], Te(t).constructor) : e.apply(t, n));
}
function ya(t, e) {
  if (e && (fe(e) === "object" || typeof e == "function"))
    return e;
  if (e !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return ja(t);
}
function ja(t) {
  if (t === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return t;
}
function Lt() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (Lt = function() {
    return !!t;
  })();
}
function Te(t) {
  return Te = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(n) {
    return n.__proto__ || Object.getPrototypeOf(n);
  }, Te(t);
}
function wa(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && Ve(t, e);
}
function Ve(t, e) {
  return Ve = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r, s) {
    return r.__proto__ = s, r;
  }, Ve(t, e);
}
function Re(t, e, n) {
  return e = $t(e), e in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function $t(t) {
  var e = Aa(t, "string");
  return fe(e) == "symbol" ? e : e + "";
}
function Aa(t, e) {
  if (fe(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (fe(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Me = /* @__PURE__ */ (function(t) {
  function e() {
    return xa(this, e), va(this, e, arguments);
  }
  return wa(e, t), ga(e, [{
    key: "getTickValueCoord",
    value: (
      /**
       * Calculate the coordinate of tick
       * @param  {Number} coordinate The radius of tick
       * @return {Object} (x, y)
       */
      function(r) {
        var s = r.coordinate, o = this.props, i = o.angle, u = o.cx, h = o.cy;
        return G(u, h, s, i);
      }
    )
  }, {
    key: "getTickTextAnchor",
    value: function() {
      var r = this.props.orientation, s;
      switch (r) {
        case "left":
          s = "end";
          break;
        case "right":
          s = "start";
          break;
        default:
          s = "middle";
          break;
      }
      return s;
    }
  }, {
    key: "getViewBox",
    value: function() {
      var r = this.props, s = r.cx, o = r.cy, i = r.angle, u = r.ticks, h = da(u, function(c) {
        return c.coordinate || 0;
      }), d = fa(u, function(c) {
        return c.coordinate || 0;
      });
      return {
        cx: s,
        cy: o,
        startAngle: i,
        endAngle: i,
        innerRadius: d.coordinate || 0,
        outerRadius: h.coordinate || 0
      };
    }
  }, {
    key: "renderAxisLine",
    value: function() {
      var r = this.props, s = r.cx, o = r.cy, i = r.angle, u = r.ticks, h = r.axisLine, d = pt(r, ma), c = u.reduce(function(g, m) {
        return [Math.min(g[0], m.coordinate), Math.max(g[1], m.coordinate)];
      }, [1 / 0, -1 / 0]), x = G(s, o, c[0], i), j = G(s, o, c[1], i), p = J(J(J({}, I(d, !1)), {}, {
        fill: "none"
      }, I(h, !1)), {}, {
        x1: x.x,
        y1: x.y,
        x2: j.x,
        y2: j.y
      });
      return /* @__PURE__ */ O.createElement("line", ve({
        className: "recharts-polar-radius-axis-line"
      }, p));
    }
  }, {
    key: "renderTicks",
    value: function() {
      var r = this, s = this.props, o = s.ticks, i = s.tick, u = s.angle, h = s.tickFormatter, d = s.stroke, c = pt(s, ha), x = this.getTickTextAnchor(), j = I(c, !1), p = I(i, !1), g = o.map(function(m, v) {
        var A = r.getTickValueCoord(m), l = J(J(J(J({
          textAnchor: x,
          transform: "rotate(".concat(90 - u, ", ").concat(A.x, ", ").concat(A.y, ")")
        }, j), {}, {
          stroke: "none",
          fill: d
        }, p), {}, {
          index: v
        }, A), {}, {
          payload: m
        });
        return /* @__PURE__ */ O.createElement(F, ve({
          className: H("recharts-polar-radius-axis-tick", St(i)),
          key: "tick-".concat(m.coordinate)
        }, Qe(r.props, m, v)), e.renderTickItem(i, l, h ? h(m.value, v) : m.value));
      });
      return /* @__PURE__ */ O.createElement(F, {
        className: "recharts-polar-radius-axis-ticks"
      }, g);
    }
  }, {
    key: "render",
    value: function() {
      var r = this.props, s = r.ticks, o = r.axisLine, i = r.tick;
      return !s || !s.length ? null : /* @__PURE__ */ O.createElement(F, {
        className: H("recharts-polar-radius-axis", this.props.className)
      }, o && this.renderAxisLine(), i && this.renderTicks(), Je.renderCallByParent(this.props, this.getViewBox()));
    }
  }], [{
    key: "renderTickItem",
    value: function(r, s, o) {
      var i;
      return /* @__PURE__ */ O.isValidElement(r) ? i = /* @__PURE__ */ O.cloneElement(r, s) : ee(r) ? i = r(s) : i = /* @__PURE__ */ O.createElement(Ze, ve({}, s, {
        className: "recharts-polar-radius-axis-tick-value"
      }), o), i;
    }
  }]);
})(We);
Re(Me, "displayName", "PolarRadiusAxis");
Re(Me, "axisType", "radiusAxis");
Re(Me, "defaultProps", {
  type: "number",
  radiusAxisId: 0,
  cx: 0,
  cy: 0,
  angle: 0,
  orientation: "right",
  stroke: "#ccc",
  axisLine: !0,
  tick: !0,
  tickCount: 5,
  allowDataOverflow: !1,
  scale: "auto",
  allowDuplicatedCategory: !0
});
function me(t) {
  "@babel/helpers - typeof";
  return me = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, me(t);
}
function te() {
  return te = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
    }
    return t;
  }, te.apply(this, arguments);
}
function mt(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(s) {
      return Object.getOwnPropertyDescriptor(t, s).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function X(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? mt(Object(n), !0).forEach(function(r) {
      Ie(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : mt(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function ka(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function ht(t, e) {
  for (var n = 0; n < e.length; n++) {
    var r = e[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, Ft(r.key), r);
  }
}
function Sa(t, e, n) {
  return e && ht(t.prototype, e), n && ht(t, n), Object.defineProperty(t, "prototype", { writable: !1 }), t;
}
function Oa(t, e, n) {
  return e = De(e), Pa(t, Bt() ? Reflect.construct(e, n || [], De(t).constructor) : e.apply(t, n));
}
function Pa(t, e) {
  if (e && (me(e) === "object" || typeof e == "function"))
    return e;
  if (e !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return _a(t);
}
function _a(t) {
  if (t === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return t;
}
function Bt() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (Bt = function() {
    return !!t;
  })();
}
function De(t) {
  return De = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(n) {
    return n.__proto__ || Object.getPrototypeOf(n);
  }, De(t);
}
function Na(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && ze(t, e);
}
function ze(t, e) {
  return ze = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r, s) {
    return r.__proto__ = s, r;
  }, ze(t, e);
}
function Ie(t, e, n) {
  return e = Ft(e), e in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Ft(t) {
  var e = Ta(t, "string");
  return me(e) == "symbol" ? e : e + "";
}
function Ta(t, e) {
  if (me(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (me(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Da = Math.PI / 180, bt = 1e-5, Le = /* @__PURE__ */ (function(t) {
  function e() {
    return ka(this, e), Oa(this, e, arguments);
  }
  return Na(e, t), Sa(e, [{
    key: "getTickLineCoord",
    value: (
      /**
       * Calculate the coordinate of line endpoint
       * @param  {Object} data The Data if ticks
       * @return {Object} (x0, y0): The start point of text,
       *                  (x1, y1): The end point close to text,
       *                  (x2, y2): The end point close to axis
       */
      function(r) {
        var s = this.props, o = s.cx, i = s.cy, u = s.radius, h = s.orientation, d = s.tickSize, c = d || 8, x = G(o, i, u, r.coordinate), j = G(o, i, u + (h === "inner" ? -1 : 1) * c, r.coordinate);
        return {
          x1: x.x,
          y1: x.y,
          x2: j.x,
          y2: j.y
        };
      }
    )
    /**
     * Get the text-anchor of each tick
     * @param  {Object} data Data of ticks
     * @return {String} text-anchor
     */
  }, {
    key: "getTickTextAnchor",
    value: function(r) {
      var s = this.props.orientation, o = Math.cos(-r.coordinate * Da), i;
      return o > bt ? i = s === "outer" ? "start" : "end" : o < -bt ? i = s === "outer" ? "end" : "start" : i = "middle", i;
    }
  }, {
    key: "renderAxisLine",
    value: function() {
      var r = this.props, s = r.cx, o = r.cy, i = r.radius, u = r.axisLine, h = r.axisLineType, d = X(X({}, I(this.props, !1)), {}, {
        fill: "none"
      }, I(u, !1));
      if (h === "circle")
        return /* @__PURE__ */ O.createElement(Qt, te({
          className: "recharts-polar-angle-axis-line"
        }, d, {
          cx: s,
          cy: o,
          r: i
        }));
      var c = this.props.ticks, x = c.map(function(j) {
        return G(s, o, i, j.coordinate);
      });
      return /* @__PURE__ */ O.createElement(oa, te({
        className: "recharts-polar-angle-axis-line"
      }, d, {
        points: x
      }));
    }
  }, {
    key: "renderTicks",
    value: function() {
      var r = this, s = this.props, o = s.ticks, i = s.tick, u = s.tickLine, h = s.tickFormatter, d = s.stroke, c = I(this.props, !1), x = I(i, !1), j = X(X({}, c), {}, {
        fill: "none"
      }, I(u, !1)), p = o.map(function(g, m) {
        var v = r.getTickLineCoord(g), A = r.getTickTextAnchor(g), l = X(X(X({
          textAnchor: A
        }, c), {}, {
          stroke: "none",
          fill: d
        }, x), {}, {
          index: m,
          payload: g,
          x: v.x2,
          y: v.y2
        });
        return /* @__PURE__ */ O.createElement(F, te({
          className: H("recharts-polar-angle-axis-tick", St(i)),
          key: "tick-".concat(g.coordinate)
        }, Qe(r.props, g, m)), u && /* @__PURE__ */ O.createElement("line", te({
          className: "recharts-polar-angle-axis-tick-line"
        }, j, v)), i && e.renderTickItem(i, l, h ? h(g.value, m) : g.value));
      });
      return /* @__PURE__ */ O.createElement(F, {
        className: "recharts-polar-angle-axis-ticks"
      }, p);
    }
  }, {
    key: "render",
    value: function() {
      var r = this.props, s = r.ticks, o = r.radius, i = r.axisLine;
      return o <= 0 || !s || !s.length ? null : /* @__PURE__ */ O.createElement(F, {
        className: H("recharts-polar-angle-axis", this.props.className)
      }, i && this.renderAxisLine(), this.renderTicks());
    }
  }], [{
    key: "renderTickItem",
    value: function(r, s, o) {
      var i;
      return /* @__PURE__ */ O.isValidElement(r) ? i = /* @__PURE__ */ O.cloneElement(r, s) : ee(r) ? i = r(s) : i = /* @__PURE__ */ O.createElement(Ze, te({}, s, {
        className: "recharts-polar-angle-axis-tick-value"
      }), o), i;
    }
  }]);
})(We);
Ie(Le, "displayName", "PolarAngleAxis");
Ie(Le, "axisType", "angleAxis");
Ie(Le, "defaultProps", {
  type: "category",
  angleAxisId: 0,
  scale: "auto",
  cx: 0,
  cy: 0,
  orientation: "outer",
  axisLine: !0,
  tickLine: !0,
  tickSize: 8,
  tick: !0,
  hide: !1,
  allowDuplicatedCategory: !0
});
var Pe;
function he(t) {
  "@babel/helpers - typeof";
  return he = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, he(t);
}
function ce() {
  return ce = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
    }
    return t;
  }, ce.apply(this, arguments);
}
function xt(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(s) {
      return Object.getOwnPropertyDescriptor(t, s).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function D(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? xt(Object(n), !0).forEach(function(r) {
      $(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : xt(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function Ca(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function gt(t, e) {
  for (var n = 0; n < e.length; n++) {
    var r = e[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, Gt(r.key), r);
  }
}
function Ea(t, e, n) {
  return e && gt(t.prototype, e), n && gt(t, n), Object.defineProperty(t, "prototype", { writable: !1 }), t;
}
function Ra(t, e, n) {
  return e = Ce(e), Ma(t, Kt() ? Reflect.construct(e, n || [], Ce(t).constructor) : e.apply(t, n));
}
function Ma(t, e) {
  if (e && (he(e) === "object" || typeof e == "function"))
    return e;
  if (e !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return Ia(t);
}
function Ia(t) {
  if (t === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return t;
}
function Kt() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (Kt = function() {
    return !!t;
  })();
}
function Ce(t) {
  return Ce = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(n) {
    return n.__proto__ || Object.getPrototypeOf(n);
  }, Ce(t);
}
function La(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && Ye(t, e);
}
function Ye(t, e) {
  return Ye = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r, s) {
    return r.__proto__ = s, r;
  }, Ye(t, e);
}
function $(t, e, n) {
  return e = Gt(e), e in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Gt(t) {
  var e = $a(t, "string");
  return he(e) == "symbol" ? e : e + "";
}
function $a(t, e) {
  if (he(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (he(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
var V = /* @__PURE__ */ (function(t) {
  function e(n) {
    var r;
    return Ca(this, e), r = Ra(this, e, [n]), $(r, "pieRef", null), $(r, "sectorRefs", []), $(r, "id", nr("recharts-pie-")), $(r, "handleAnimationEnd", function() {
      var s = r.props.onAnimationEnd;
      r.setState({
        isAnimationFinished: !0
      }), ee(s) && s();
    }), $(r, "handleAnimationStart", function() {
      var s = r.props.onAnimationStart;
      r.setState({
        isAnimationFinished: !1
      }), ee(s) && s();
    }), r.state = {
      isAnimationFinished: !n.isAnimationActive,
      prevIsAnimationActive: n.isAnimationActive,
      prevAnimationId: n.animationId,
      sectorToFocus: 0
    }, r;
  }
  return La(e, t), Ea(e, [{
    key: "isActiveIndex",
    value: function(r) {
      var s = this.props.activeIndex;
      return Array.isArray(s) ? s.indexOf(r) !== -1 : r === s;
    }
  }, {
    key: "hasActiveIndex",
    value: function() {
      var r = this.props.activeIndex;
      return Array.isArray(r) ? r.length !== 0 : r || r === 0;
    }
  }, {
    key: "renderLabels",
    value: function(r) {
      var s = this.props.isAnimationActive;
      if (s && !this.state.isAnimationFinished)
        return null;
      var o = this.props, i = o.label, u = o.labelLine, h = o.dataKey, d = o.valueKey, c = I(this.props, !1), x = I(i, !1), j = I(u, !1), p = i && i.offsetRadius || 20, g = r.map(function(m, v) {
        var A = (m.startAngle + m.endAngle) / 2, l = G(m.cx, m.cy, m.outerRadius + p, A), f = D(D(D(D({}, c), m), {}, {
          stroke: "none"
        }, x), {}, {
          index: v,
          textAnchor: e.getTextAnchor(l.x, m.cx)
        }, l), T = D(D(D(D({}, c), m), {}, {
          fill: "none",
          stroke: m.fill
        }, j), {}, {
          index: v,
          points: [G(m.cx, m.cy, m.outerRadius, A), l]
        }), P = h;
        return de(h) && de(d) ? P = "value" : de(h) && (P = d), // eslint-disable-next-line react/no-array-index-key
        /* @__PURE__ */ O.createElement(F, {
          key: "label-".concat(m.startAngle, "-").concat(m.endAngle, "-").concat(m.midAngle, "-").concat(v)
        }, u && e.renderLabelLineItem(u, T, "line"), e.renderLabelItem(i, f, se(m, P)));
      });
      return /* @__PURE__ */ O.createElement(F, {
        className: "recharts-pie-labels"
      }, g);
    }
  }, {
    key: "renderSectorsStatically",
    value: function(r) {
      var s = this, o = this.props, i = o.activeShape, u = o.blendStroke, h = o.inactiveShape;
      return r.map(function(d, c) {
        if (d?.startAngle === 0 && d?.endAngle === 0 && r.length !== 1) return null;
        var x = s.isActiveIndex(c), j = h && s.hasActiveIndex() ? h : null, p = x ? i : j, g = D(D({}, d), {}, {
          stroke: u ? d.fill : d.stroke,
          tabIndex: -1
        });
        return /* @__PURE__ */ O.createElement(F, ce({
          ref: function(v) {
            v && !s.sectorRefs.includes(v) && s.sectorRefs.push(v);
          },
          tabIndex: -1,
          className: "recharts-pie-sector"
        }, Qe(s.props, d, c), {
          // eslint-disable-next-line react/no-array-index-key
          key: "sector-".concat(d?.startAngle, "-").concat(d?.endAngle, "-").concat(d.midAngle, "-").concat(c)
        }), /* @__PURE__ */ O.createElement(Xt, ce({
          option: p,
          isActive: x,
          shapeType: "sector"
        }, g)));
      });
    }
  }, {
    key: "renderSectorsWithAnimation",
    value: function() {
      var r = this, s = this.props, o = s.sectors, i = s.isAnimationActive, u = s.animationBegin, h = s.animationDuration, d = s.animationEasing, c = s.animationId, x = this.state, j = x.prevSectors, p = x.prevIsAnimationActive;
      return /* @__PURE__ */ O.createElement(er, {
        begin: u,
        duration: h,
        isActive: i,
        easing: d,
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        key: "pie-".concat(c, "-").concat(p),
        onAnimationStart: this.handleAnimationStart,
        onAnimationEnd: this.handleAnimationEnd
      }, function(g) {
        var m = g.t, v = [], A = o && o[0], l = A.startAngle;
        return o.forEach(function(f, T) {
          var P = j && j[T], k = T > 0 ? tr(f, "paddingAngle", 0) : 0;
          if (P) {
            var w = nt(P.endAngle - P.startAngle, f.endAngle - f.startAngle), b = D(D({}, f), {}, {
              startAngle: l + k,
              endAngle: l + w(m) + k
            });
            v.push(b), l = b.endAngle;
          } else {
            var S = f.endAngle, y = f.startAngle, E = nt(0, S - y), Q = E(m), B = D(D({}, f), {}, {
              startAngle: l + k,
              endAngle: l + Q + k
            });
            v.push(B), l = B.endAngle;
          }
        }), /* @__PURE__ */ O.createElement(F, null, r.renderSectorsStatically(v));
      });
    }
  }, {
    key: "attachKeyboardHandlers",
    value: function(r) {
      var s = this;
      r.onkeydown = function(o) {
        if (!o.altKey)
          switch (o.key) {
            case "ArrowLeft": {
              var i = ++s.state.sectorToFocus % s.sectorRefs.length;
              s.sectorRefs[i].focus(), s.setState({
                sectorToFocus: i
              });
              break;
            }
            case "ArrowRight": {
              var u = --s.state.sectorToFocus < 0 ? s.sectorRefs.length - 1 : s.state.sectorToFocus % s.sectorRefs.length;
              s.sectorRefs[u].focus(), s.setState({
                sectorToFocus: u
              });
              break;
            }
            case "Escape": {
              s.sectorRefs[s.state.sectorToFocus].blur(), s.setState({
                sectorToFocus: 0
              });
              break;
            }
          }
      };
    }
  }, {
    key: "renderSectors",
    value: function() {
      var r = this.props, s = r.sectors, o = r.isAnimationActive, i = this.state.prevSectors;
      return o && s && s.length && (!i || !rr(i, s)) ? this.renderSectorsWithAnimation() : this.renderSectorsStatically(s);
    }
  }, {
    key: "componentDidMount",
    value: function() {
      this.pieRef && this.attachKeyboardHandlers(this.pieRef);
    }
  }, {
    key: "render",
    value: function() {
      var r = this, s = this.props, o = s.hide, i = s.sectors, u = s.className, h = s.label, d = s.cx, c = s.cy, x = s.innerRadius, j = s.outerRadius, p = s.isAnimationActive, g = this.state.isAnimationFinished;
      if (o || !i || !i.length || !ie(d) || !ie(c) || !ie(x) || !ie(j))
        return null;
      var m = H("recharts-pie", u);
      return /* @__PURE__ */ O.createElement(F, {
        tabIndex: this.props.rootTabIndex,
        className: m,
        ref: function(A) {
          r.pieRef = A;
        }
      }, this.renderSectors(), h && this.renderLabels(i), Je.renderCallByParent(this.props, null, !1), (!p || g) && ar.renderCallByParent(this.props, i, !1));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function(r, s) {
      return s.prevIsAnimationActive !== r.isAnimationActive ? {
        prevIsAnimationActive: r.isAnimationActive,
        prevAnimationId: r.animationId,
        curSectors: r.sectors,
        prevSectors: [],
        isAnimationFinished: !0
      } : r.isAnimationActive && r.animationId !== s.prevAnimationId ? {
        prevAnimationId: r.animationId,
        curSectors: r.sectors,
        prevSectors: s.curSectors,
        isAnimationFinished: !0
      } : r.sectors !== s.curSectors ? {
        curSectors: r.sectors,
        isAnimationFinished: !0
      } : null;
    }
  }, {
    key: "getTextAnchor",
    value: function(r, s) {
      return r > s ? "start" : r < s ? "end" : "middle";
    }
  }, {
    key: "renderLabelLineItem",
    value: function(r, s, o) {
      if (/* @__PURE__ */ O.isValidElement(r))
        return /* @__PURE__ */ O.cloneElement(r, s);
      if (ee(r))
        return r(s);
      var i = H("recharts-pie-label-line", typeof r != "boolean" ? r.className : "");
      return /* @__PURE__ */ O.createElement(Jt, ce({}, s, {
        key: o,
        type: "linear",
        className: i
      }));
    }
  }, {
    key: "renderLabelItem",
    value: function(r, s, o) {
      if (/* @__PURE__ */ O.isValidElement(r))
        return /* @__PURE__ */ O.cloneElement(r, s);
      var i = o;
      if (ee(r) && (i = r(s), /* @__PURE__ */ O.isValidElement(i)))
        return i;
      var u = H("recharts-pie-label-text", typeof r != "boolean" && !ee(r) ? r.className : "");
      return /* @__PURE__ */ O.createElement(Ze, ce({}, s, {
        alignmentBaseline: "middle",
        className: u
      }), i);
    }
  }]);
})(We);
Pe = V;
$(V, "displayName", "Pie");
$(V, "defaultProps", {
  stroke: "#fff",
  fill: "#808080",
  legendType: "rect",
  cx: "50%",
  cy: "50%",
  startAngle: 0,
  endAngle: 360,
  innerRadius: 0,
  outerRadius: "80%",
  paddingAngle: 0,
  labelLine: !0,
  hide: !1,
  minAngle: 0,
  isAnimationActive: !sr.isSsr,
  animationBegin: 400,
  animationDuration: 1500,
  animationEasing: "ease",
  nameKey: "name",
  blendStroke: !1,
  rootTabIndex: 0
});
$(V, "parseDeltaAngle", function(t, e) {
  var n = Oe(e - t), r = Math.min(Math.abs(e - t), 360);
  return n * r;
});
$(V, "getRealPieData", function(t) {
  var e = t.data, n = t.children, r = I(t, !1), s = ir(n, or);
  return e && e.length ? e.map(function(o, i) {
    return D(D(D({
      payload: o
    }, r), o), s && s[i] && s[i].props);
  }) : s && s.length ? s.map(function(o) {
    return D(D({}, r), o.props);
  }) : [];
});
$(V, "parseCoordinateOfPie", function(t, e) {
  var n = e.top, r = e.left, s = e.width, o = e.height, i = lr(s, o), u = r + we(t.cx, s, s / 2), h = n + we(t.cy, o, o / 2), d = we(t.innerRadius, i, 0), c = we(t.outerRadius, i, i * 0.8), x = t.maxRadius || Math.sqrt(s * s + o * o) / 2;
  return {
    cx: u,
    cy: h,
    innerRadius: d,
    outerRadius: c,
    maxRadius: x
  };
});
$(V, "getComposedData", function(t) {
  var e = t.item, n = t.offset, r = e.type.defaultProps !== void 0 ? D(D({}, e.type.defaultProps), e.props) : e.props, s = Pe.getRealPieData(r);
  if (!s || !s.length)
    return null;
  var o = r.cornerRadius, i = r.startAngle, u = r.endAngle, h = r.paddingAngle, d = r.dataKey, c = r.nameKey, x = r.valueKey, j = r.tooltipType, p = Math.abs(r.minAngle), g = Pe.parseCoordinateOfPie(r, n), m = Pe.parseDeltaAngle(i, u), v = Math.abs(m), A = d;
  de(d) && de(x) ? (st(!1, `Use "dataKey" to specify the value of pie,
      the props "valueKey" will be deprecated in 1.1.0`), A = "value") : de(d) && (st(!1, `Use "dataKey" to specify the value of pie,
      the props "valueKey" will be deprecated in 1.1.0`), A = x);
  var l = s.filter(function(b) {
    return se(b, A, 0) !== 0;
  }).length, f = (v >= 360 ? l : l - 1) * h, T = v - l * p - f, P = s.reduce(function(b, S) {
    var y = se(S, A, 0);
    return b + (ie(y) ? y : 0);
  }, 0), k;
  if (P > 0) {
    var w;
    k = s.map(function(b, S) {
      var y = se(b, A, 0), E = se(b, c, S), Q = (ie(y) ? y : 0) / P, B;
      S ? B = w.endAngle + Oe(m) * h * (y !== 0 ? 1 : 0) : B = i;
      var N = B + Oe(m) * ((y !== 0 ? p : 0) + Q * T), C = (B + N) / 2, z = (g.innerRadius + g.outerRadius) / 2, ae = [{
        name: E,
        value: y,
        payload: b,
        dataKey: A,
        type: j
      }], Yt = G(g.cx, g.cy, z, C);
      return w = D(D(D({
        percent: Q,
        cornerRadius: o,
        name: E,
        tooltipPayload: ae,
        midAngle: C,
        middleRadius: z,
        tooltipPosition: Yt
      }, b), g), {}, {
        value: se(b, A),
        startAngle: B,
        endAngle: N,
        payload: b,
        paddingAngle: Oe(m) * h
      }), w;
    });
  }
  return D(D({}, g), {}, {
    sectors: k,
    data: s
  });
});
var Ba = cr({
  chartName: "PieChart",
  GraphicalChild: V,
  validateTooltipEventTypes: ["item"],
  defaultTooltipEventType: "item",
  legendContent: "children",
  axisComponents: [{
    axisType: "angleAxis",
    AxisComp: Le
  }, {
    axisType: "radiusAxis",
    AxisComp: Me
  }],
  formatAxisMap: dr,
  defaultProps: {
    layout: "centric",
    startAngle: 0,
    endAngle: 360,
    cx: "50%",
    cy: "50%",
    innerRadius: 0,
    outerRadius: "80%"
  }
});
const Vt = ({ className: t }) => {
  const e = qe();
  return /* @__PURE__ */ a.jsx(
    ye,
    {
      actions: /* @__PURE__ */ a.jsx(Xe, { variant: "outline", onClick: () => e("/settings/analytics", { crossApp: !0 }), children: "Open settings" }),
      className: t,
      description: "Enable member source tracking in settings to see which content drives member growth.",
      title: "Member sources have been disabled",
      children: /* @__PURE__ */ a.jsx(ur, {})
    }
  );
}, Fa = (t) => t === "total-members" || t === "free-members" || t === "paid-members" || t === "mrr", Ka = ({ active: t, payload: e, range: n, color: r, showBreakdown: s }) => {
  if (!t || !e?.length)
    return null;
  const o = e[0].payload, { date: i, formattedValue: u, label: h, comped: d, gift: c } = o, x = o.value - (d || 0) - (c || 0);
  return /* @__PURE__ */ a.jsxs("div", { className: "min-w-[200px] rounded-lg border bg-background px-3 py-2 shadow-lg", children: [
    i && /* @__PURE__ */ a.jsx("div", { className: "mb-1 text-sm text-foreground", children: q(i, n || 0) }),
    /* @__PURE__ */ a.jsxs("div", { className: "flex flex-col gap-1", children: [
      s && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        /* @__PURE__ */ a.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ a.jsxs("div", { className: "flex grow items-center justify-between gap-5", children: [
          /* @__PURE__ */ a.jsx("div", { className: "text-sm text-muted-foreground", children: "Paid subscriptions" }),
          /* @__PURE__ */ a.jsx("div", { className: "font-mono text-xs", children: _(x) })
        ] }) }),
        /* @__PURE__ */ a.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ a.jsxs("div", { className: "flex grow items-center justify-between gap-5", children: [
          /* @__PURE__ */ a.jsx("div", { className: "text-sm text-muted-foreground", children: "Gift subscriptions" }),
          /* @__PURE__ */ a.jsx("div", { className: "font-mono text-xs", children: c !== void 0 && c > 0 ? _(c) : "0" })
        ] }) }),
        /* @__PURE__ */ a.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ a.jsxs("div", { className: "flex grow items-center justify-between gap-5", children: [
          /* @__PURE__ */ a.jsx("div", { className: "text-sm text-muted-foreground", children: "Complimentary" }),
          /* @__PURE__ */ a.jsx("div", { className: "font-mono text-xs", children: d !== void 0 && d > 0 ? _(d) : "0" })
        ] }) }),
        /* @__PURE__ */ a.jsx(Mr, {})
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ a.jsx("span", { className: "inline-block size-2 rounded-full opacity-50", style: { backgroundColor: r || "var(--chart-purple)" } }),
        /* @__PURE__ */ a.jsxs("div", { className: "flex grow items-center justify-between gap-5", children: [
          h && /* @__PURE__ */ a.jsx("div", { className: "text-sm text-muted-foreground", children: h }),
          /* @__PURE__ */ a.jsx("div", { className: "font-mono font-medium", children: u })
        ] })
      ] })
    ] })
  ] });
}, Ga = ({ chartData: t, totals: e, initialTab: n, currencySymbol: r, isLoading: s, onTabChange: o }) => {
  const i = Fa(n) ? n : "total-members", [u, h] = re(i), { range: d } = Ue(), { appSettings: c } = Ee(), x = qe(), [j] = wt();
  He(() => {
    h(i);
  }, [i]);
  const p = (w) => {
    h(w);
    const b = new URLSearchParams(j);
    b.set("tab", w), x(`?${b.toString()}`, { replace: !0 }), o && o(w);
  }, { totalMembers: g, freeMembers: m, paidMembers: v, mrr: A, percentChanges: l, directions: f } = e, T = M(() => {
    if (!t || t.length === 0)
      return [];
    let w = [], b = "value";
    switch (u) {
      case "free-members":
        b = "free";
        break;
      case "paid-members":
        b = "paid";
        break;
      case "mrr": {
        b = "mrr";
        break;
      }
      default:
        b = "value";
    }
    w = be(t, d, b, "exact");
    let S = [];
    switch (u) {
      case "free-members":
        S = w.map((y) => ({
          ...y,
          value: y.free,
          formattedValue: _(y.free),
          label: "Free members"
        }));
        break;
      case "paid-members":
        S = w.map((y) => ({
          ...y,
          value: y.paid,
          formattedValue: _(y.paid),
          label: "Paid members",
          comped: y.comped,
          gift: y.gift,
          paid_subscribed: y.paid_subscribed
        }));
        break;
      case "mrr":
        S = w.map((y) => ({
          ...y,
          value: oe(y.mrr),
          formattedValue: `${r}${_(oe(y.mrr))}`,
          label: "MRR"
        }));
        break;
      default:
        S = w.map((y) => {
          const E = y.free + y.paid;
          return {
            ...y,
            value: E,
            formattedValue: _(E),
            label: "Total members"
          };
        });
    }
    return S;
  }, [u, t, d, r]), P = {
    "total-members": {
      color: "var(--chart-darkblue)"
    },
    "free-members": {
      color: "var(--chart-blue)"
    },
    "paid-members": {
      color: "var(--chart-purple)"
    },
    mrr: {
      color: "var(--chart-teal)"
    }
  };
  return s ? /* @__PURE__ */ a.jsx("div", { className: "-mb-6 flex h-[calc(16vw+132px)] w-full items-start justify-center", children: /* @__PURE__ */ a.jsx(pr, {}) }) : /* @__PURE__ */ a.jsxs(Et, { defaultValue: i, variant: "kpis", children: [
    /* @__PURE__ */ a.jsxs(Rt, { className: `-mx-6 ${c?.paidMembersEnabled ? "hidden grid-cols-4 lg:visible! lg:grid!" : "grid grid-cols-4"}`, children: [
      /* @__PURE__ */ a.jsx(ke, { className: c?.paidMembersEnabled ? "" : "cursor-auto after:hidden", value: "total-members", onClick: () => {
        c?.paidMembersEnabled && p("total-members");
      }, children: /* @__PURE__ */ a.jsx(
        W,
        {
          color: "var(--chart-darkblue)",
          diffDirection: d === Y.allTime.value ? "hidden" : f.total,
          diffValue: l.total,
          label: "Total members",
          value: _(g)
        }
      ) }),
      c?.paidMembersEnabled && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        /* @__PURE__ */ a.jsx(ke, { value: "free-members", onClick: () => {
          p("free-members");
        }, children: /* @__PURE__ */ a.jsx(
          W,
          {
            color: "var(--chart-blue)",
            diffDirection: d === Y.allTime.value ? "hidden" : f.free,
            diffValue: l.free,
            label: "Free members",
            value: _(m)
          }
        ) }),
        /* @__PURE__ */ a.jsx(ke, { value: "paid-members", onClick: () => {
          p("paid-members");
        }, children: /* @__PURE__ */ a.jsx(
          W,
          {
            color: "var(--chart-purple)",
            diffDirection: d === Y.allTime.value ? "hidden" : f.paid,
            diffValue: l.paid,
            label: "Paid members",
            value: _(v)
          }
        ) }),
        /* @__PURE__ */ a.jsx(ke, { value: "mrr", onClick: () => {
          p("mrr");
        }, children: /* @__PURE__ */ a.jsx(
          W,
          {
            color: "var(--chart-teal)",
            diffDirection: d === Y.allTime.value ? "hidden" : f.mrr,
            diffValue: l.mrr,
            label: "MRR",
            value: `${r}${_(oe(A))}`
          }
        ) })
      ] })
    ] }),
    c?.paidMembersEnabled && /* @__PURE__ */ a.jsxs(fr, { children: [
      /* @__PURE__ */ a.jsx(mr, { className: "lg:hidden", asChild: !0, children: /* @__PURE__ */ a.jsxs(Wr, { children: [
        u === "total-members" && /* @__PURE__ */ a.jsx(
          W,
          {
            color: "var(--chart-darkblue)",
            diffDirection: d === Y.allTime.value ? "hidden" : f.total,
            diffValue: l.total,
            label: "Total members",
            value: _(g)
          }
        ),
        u === "free-members" && /* @__PURE__ */ a.jsx(
          W,
          {
            color: "var(--chart-blue)",
            diffDirection: d === Y.allTime.value ? "hidden" : f.free,
            diffValue: l.free,
            label: "Free members",
            value: _(m)
          }
        ),
        u === "paid-members" && /* @__PURE__ */ a.jsx(
          W,
          {
            color: "var(--chart-purple)",
            diffDirection: d === Y.allTime.value ? "hidden" : f.paid,
            diffValue: l.paid,
            label: "Paid members",
            value: _(v)
          }
        ),
        u === "mrr" && /* @__PURE__ */ a.jsx(
          W,
          {
            color: "var(--chart-teal)",
            diffDirection: d === Y.allTime.value ? "hidden" : f.mrr,
            diffValue: l.mrr,
            label: "MRR",
            value: `${r}${_(oe(A))}`
          }
        )
      ] }) }),
      /* @__PURE__ */ a.jsxs(hr, { align: "end", className: "w-56", children: [
        /* @__PURE__ */ a.jsx(Ae, { onClick: () => p("total-members"), children: "Total members" }),
        /* @__PURE__ */ a.jsx(Ae, { onClick: () => p("free-members"), children: "Free members" }),
        /* @__PURE__ */ a.jsx(Ae, { onClick: () => p("paid-members"), children: "Paid members" }),
        /* @__PURE__ */ a.jsx(Ae, { onClick: () => p("mrr"), children: "MRR" })
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "my-4 [&_.recharts-cartesian-axis-tick-value]:fill-gray-500", children: /* @__PURE__ */ a.jsx(
      br,
      {
        className: "-mb-3 h-[16vw] max-h-[320px] w-full min-h-[180px]",
        color: P[u].color,
        data: T,
        dataFormatter: u === "mrr" ? (w) => `${r}${_(w)}` : _,
        id: u,
        range: d,
        tooltipContent: u === "paid-members" ? /* @__PURE__ */ a.jsx(Ka, { color: P["paid-members"].color, range: d, showBreakdown: !0 }) : void 0
      }
    ) })
  ] });
}, Va = Wt({
  dataType: "TopSourcesGrowthResponseType",
  path: "/stats/top-sources-growth"
}), za = (t, e = "signups desc", n = 50) => {
  const { startDate: r, endDate: s, timezone: o } = je(t), i = {
    date_from: pe(r),
    date_to: pe(s),
    member_status: Zr(qt),
    order: e,
    limit: n.toString()
  };
  return o && (i.timezone = o), Va({ searchParams: i });
}, vt = ({ data: t, currencySymbol: e, limit: n, defaultSourceIconUrl: r }) => {
  const s = n ? t.slice(0, n) : t, { appSettings: o } = Ee();
  return /* @__PURE__ */ a.jsx(xe, { children: s.map((i) => /* @__PURE__ */ a.jsxs(K, { className: "last:border-none", children: [
    /* @__PURE__ */ a.jsx(L, { className: "font-medium", children: /* @__PURE__ */ a.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ a.jsx(
        Vr,
        {
          defaultSourceIconUrl: r,
          displayName: i.displayName,
          iconSrc: i.iconSrc
        }
      ),
      i.linkUrl ? /* @__PURE__ */ a.jsx(
        "a",
        {
          className: "hover:underline",
          href: i.linkUrl,
          rel: "noreferrer",
          target: "_blank",
          children: i.displayName
        }
      ) : /* @__PURE__ */ a.jsx("span", { children: i.displayName })
    ] }) }),
    /* @__PURE__ */ a.jsxs(L, { className: "text-right font-mono text-sm", children: [
      "+",
      _(i.free_members)
    ] }),
    o?.paidMembersEnabled && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsxs(L, { className: "text-right font-mono text-sm", children: [
        "+",
        _(i.paid_members)
      ] }),
      /* @__PURE__ */ a.jsxs(L, { className: "text-right font-mono text-sm", children: [
        "+",
        e,
        _(oe(i.mrr))
      ] })
    ] })
  ] }, i.source)) });
}, Ya = ({
  range: t,
  limit: e = 20,
  showViewAll: n = !1,
  sortBy: r,
  setSortBy: s
}) => {
  const { data: o } = Ue(), { data: i } = xr(), { appSettings: u } = Ee(), [h, d] = re("free_members desc"), c = r || h, x = s || d, j = c.replace("free_members", "signups").replace("paid_members", "paid_conversions"), { data: p, isLoading: g } = za(t, j, e), m = o?.url, v = "https://www.google.com/s2/favicons?domain=ghost.org&sz=64", A = O.useMemo(() => {
    if (i?.stats && i?.meta?.totals) {
      const P = i.meta.totals;
      let k = P[0];
      if (!k)
        return $e("usd");
      for (const w of P)
        w.mrr > k.mrr && (k = w);
      return $e(k.currency);
    }
    return $e("usd");
  }, [i]), l = O.useMemo(() => p?.stats ? p.stats.map((P) => {
    const k = P.source || "Direct", { domain: w } = Ir(k, m), b = w ? `https://www.faviconextractor.com/favicon/${w}?larger=true` : v, S = w && k !== "Direct" ? `https://${w}` : void 0;
    return {
      source: k,
      free_members: P.signups,
      // Backend returns 'signups', we map to 'free_members' for display
      paid_members: P.paid_conversions,
      // Backend returns 'paid_conversions', we map to 'paid_members' for display
      mrr: P.mrr,
      iconSrc: b,
      displayName: k,
      linkUrl: S
    };
  }) : [], [p, m]), f = "Top sources", T = `Where did your growth come from ${Z(t)}`;
  return u?.analytics.membersTrackSources ? g ? /* @__PURE__ */ a.jsx(xe, { children: /* @__PURE__ */ a.jsx(K, { className: "last:border-none", children: /* @__PURE__ */ a.jsx(L, { className: "border-none py-2", colSpan: 1, children: /* @__PURE__ */ a.jsx(Ot, { containerClassName: "space-y-2", count: 5, maxWidth: 75, randomize: !0 }) }) }) }) : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
    l.length > 0 ? /* @__PURE__ */ a.jsx(
      vt,
      {
        currencySymbol: A,
        data: l,
        defaultSourceIconUrl: v,
        limit: e
      }
    ) : /* @__PURE__ */ a.jsx(xe, { children: /* @__PURE__ */ a.jsx(K, { className: "last:border-none", children: /* @__PURE__ */ a.jsx(L, { className: "border-none py-12 group-hover:bg-transparent!", colSpan: u?.paidMembersEnabled ? 4 : 2, children: /* @__PURE__ */ a.jsx(
      ye,
      {
        description: "Try adjusting your date range to see more data.",
        title: `No conversions ${Z(t)}`,
        children: /* @__PURE__ */ a.jsx(gr, { strokeWidth: 1.5 })
      }
    ) }) }) }),
    n && l.length > e && /* @__PURE__ */ a.jsx(qr, { className: "border-none bg-transparent hover:bg-transparent!", children: /* @__PURE__ */ a.jsx(K, { children: /* @__PURE__ */ a.jsx(L, { className: "border-none bg-transparent px-0 pb-0 hover:bg-transparent!", colSpan: 4, children: /* @__PURE__ */ a.jsxs(Lr, { children: [
      /* @__PURE__ */ a.jsx($r, { asChild: !0, children: /* @__PURE__ */ a.jsxs(Xe, { variant: "outline", children: [
        "View all ",
        /* @__PURE__ */ a.jsx(vr, {})
      ] }) }),
      /* @__PURE__ */ a.jsxs(Br, { className: "overflow-y-auto pt-0 sm:max-w-[420px]", children: [
        /* @__PURE__ */ a.jsxs(Fr, { className: "sticky top-0 z-40 -mx-6 bg-background/60 p-6 backdrop-blur", children: [
          /* @__PURE__ */ a.jsx(Kr, { children: f }),
          /* @__PURE__ */ a.jsx(Gr, { children: T })
        ] }),
        /* @__PURE__ */ a.jsx("div", { className: "group/datalist", children: /* @__PURE__ */ a.jsxs(Mt, { children: [
          /* @__PURE__ */ a.jsx(It, { children: /* @__PURE__ */ a.jsxs(K, { children: [
            /* @__PURE__ */ a.jsx(U, { children: "Source" }),
            /* @__PURE__ */ a.jsx(U, { className: "w-[110px] text-right", children: /* @__PURE__ */ a.jsx(ue, { activeSortBy: c, setSortBy: x, sortBy: "free_members desc", children: "Free members" }) }),
            u?.paidMembersEnabled && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
              /* @__PURE__ */ a.jsx(U, { className: "w-[110px] text-right", children: /* @__PURE__ */ a.jsx(ue, { activeSortBy: c, setSortBy: x, sortBy: "paid_members desc", children: "Paid members" }) }),
              /* @__PURE__ */ a.jsx(U, { className: "w-[110px] text-right", children: /* @__PURE__ */ a.jsx(ue, { activeSortBy: c, setSortBy: x, sortBy: "mrr desc", children: "MRR impact" }) })
            ] })
          ] }) }),
          /* @__PURE__ */ a.jsx(
            vt,
            {
              currencySymbol: A,
              data: l,
              defaultSourceIconUrl: v
            }
          )
        ] }) })
      ] })
    ] }) }) }) })
  ] }) : /* @__PURE__ */ a.jsx(xe, { children: /* @__PURE__ */ a.jsx(K, { className: "last:border-none", children: /* @__PURE__ */ a.jsx(L, { className: "border-none py-12 group-hover:bg-transparent!", colSpan: u?.paidMembersEnabled ? 4 : 2, children: /* @__PURE__ */ a.jsx(Vt, {}) }) }) });
}, Wa = "TiersResponseType", qa = Ut({
  dataType: Wa,
  path: "/tiers/",
  defaultNextPageParams: (t, e) => ({
    ...e,
    page: (t.meta?.pagination.next || 1).toString()
  }),
  returnData: (t) => {
    const { pages: e } = t, n = e.flatMap((s) => s.tiers), r = e[e.length - 1].meta;
    return {
      tiers: n,
      meta: r,
      isEnd: r ? r.pagination.pages === r.pagination.page : !0
    };
  }
}), Ua = ({ active: t, payload: e }) => {
  if (t && e && e.length) {
    const n = e[0];
    return /* @__PURE__ */ a.jsx("div", { className: "rounded-lg border bg-background p-2 shadow-sm", children: /* @__PURE__ */ a.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ a.jsx(
        "div",
        {
          className: "size-2 rounded-full opacity-50",
          style: { backgroundColor: n.payload.color }
        }
      ),
      /* @__PURE__ */ a.jsx("span", { className: "font-medium", children: n.name }),
      /* @__PURE__ */ a.jsx("span", { className: "font-mono", children: _(n.value) })
    ] }) });
  }
  return null;
}, Ha = ({ isLoading: t, range: e }) => {
  const { data: n } = yr(), { data: { tiers: r = [] } = {} } = qa(), [s, o] = re("billing-period"), { startDate: i, endDate: u } = M(() => je(e), [e]), h = M(() => pe(i), [i]), d = M(() => pe(u), [u]), c = M(() => r.filter((l) => l.type === "paid" && l.active).map((l) => ({
    id: l.id,
    name: l.name
  })), [r]), x = M(() => {
    if (!n?.stats)
      return [];
    const l = R(h), f = R(d), T = n.stats.filter((k) => {
      const w = R(k.date);
      return w.isSameOrAfter(l) && w.isSameOrBefore(f);
    }).reduce((k, w) => {
      const b = w.cadence;
      return k[b] || (k[b] = 0), k[b] += w.signups, k;
    }, {});
    return Object.entries(T).map(([k, w], b) => {
      let S = k, y = "url(#gradientPurple)", E = "var(--chart-purple)";
      return k === "month" ? (S = "Monthly", y = "url(#gradientPurple)", E = "var(--chart-purple)") : k === "year" && (S = "Annual", y = "url(#gradientTeal)", E = "var(--chart-teal)"), {
        id: `cadence-${b}`,
        name: S,
        count: w,
        fill: y,
        color: E
      };
    });
  }, [n, h, d]), j = M(() => {
    if (!n?.stats || c.length === 0)
      return [];
    const l = R(h), f = R(d), T = n.stats.filter((S) => {
      const y = R(S.date);
      return y.isSameOrAfter(l) && y.isSameOrBefore(f);
    }).reduce((S, y) => {
      const E = y.tier;
      return S[E] || (S[E] = 0), S[E] += y.signups, S;
    }, {}), P = [
      { gradient: "url(#gradientPurple)", solid: "var(--chart-purple)" },
      { gradient: "url(#gradientTeal)", solid: "var(--chart-teal)" },
      { gradient: "url(#gradientBlue)", solid: "var(--chart-blue)" },
      { gradient: "url(#gradientRose)", solid: "var(--chart-rose)" },
      { gradient: "url(#gradientOrange)", solid: "var(--chart-orange)" },
      { gradient: "url(#gradientGreen)", solid: "var(--chart-green)" },
      { gradient: "url(#gradientAmber)", solid: "var(--chart-amber)" },
      { gradient: "url(#gradientYellow)", solid: "var(--chart-yellow)" },
      { gradient: "url(#gradientDarkblue)", solid: "var(--chart-darkblue)" },
      { gradient: "url(#gradientGray)", solid: "var(--chart-darkgray)" }
    ];
    return [...c.map((S) => {
      const y = T[S.id] || 0;
      return {
        id: S.id,
        name: S.name,
        count: y
      };
    })].sort((S, y) => y.count - S.count).map((S, y) => {
      const E = y % P.length;
      return {
        ...S,
        fill: P[E].gradient,
        color: P[E].solid
      };
    });
  }, [n, c, h, d]), p = s === "billing-period" ? x : j, g = M(() => p.reduce((l, f) => l + f.count, 0), [p]), m = M(() => {
    const l = {
      count: {
        label: "Subscriptions"
      }
    };
    return p.forEach((f) => {
      l[f.id] = {
        label: f.name,
        color: f.color
      };
    }), l;
  }, [p]), v = M(() => g === 0 ? [] : p.map((l) => ({
    label: l.name,
    count: l.count,
    percentage: l.count / g * 100,
    color: l.color
  })), [p, g]);
  if (t || !n?.stats)
    return null;
  const A = p.length > 0 && g > 0;
  return /* @__PURE__ */ a.jsxs(_e, { children: [
    /* @__PURE__ */ a.jsx(et, { children: /* @__PURE__ */ a.jsxs("div", { className: "flex items-start justify-between gap-1.5", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ a.jsx(tt, { children: "Paid subscription breakdown" }),
        /* @__PURE__ */ a.jsxs(rt, { children: [
          "New paid subscriptions ",
          Z(e)
        ] })
      ] }),
      c.length > 1 && /* @__PURE__ */ a.jsx("div", { children: /* @__PURE__ */ a.jsxs(Pt, { value: s, onValueChange: (l) => o(l), children: [
        /* @__PURE__ */ a.jsx(_t, { className: "w-full", children: /* @__PURE__ */ a.jsx(Nt, {}) }),
        /* @__PURE__ */ a.jsxs(Tt, { align: "end", children: [
          /* @__PURE__ */ a.jsx(Ke, { value: "billing-period", children: "Billing period" }),
          /* @__PURE__ */ a.jsx(Ke, { value: "tiers", children: "Tiers" })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ a.jsx(Ne, { children: A ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsx(
        Dt,
        {
          className: "mx-auto aspect-square h-[250px] min-h-[250px] w-full",
          config: m,
          children: /* @__PURE__ */ a.jsxs(Ba, { children: [
            /* @__PURE__ */ a.jsxs("defs", { children: [
              /* @__PURE__ */ a.jsxs("linearGradient", { id: "gradientPurple", x1: "0", x2: "0", y1: "0", y2: "1", children: [
                /* @__PURE__ */ a.jsx("stop", { offset: "0%", stopColor: "var(--chart-purple)", stopOpacity: 0.8 }),
                /* @__PURE__ */ a.jsx("stop", { offset: "100%", stopColor: "var(--chart-purple)", stopOpacity: 0.6 })
              ] }),
              /* @__PURE__ */ a.jsxs("linearGradient", { id: "gradientTeal", x1: "0", x2: "0", y1: "0", y2: "1", children: [
                /* @__PURE__ */ a.jsx("stop", { offset: "0%", stopColor: "var(--chart-teal)", stopOpacity: 0.8 }),
                /* @__PURE__ */ a.jsx("stop", { offset: "100%", stopColor: "var(--chart-teal)", stopOpacity: 0.6 })
              ] }),
              /* @__PURE__ */ a.jsxs("linearGradient", { id: "gradientRose", x1: "0", x2: "0", y1: "0", y2: "1", children: [
                /* @__PURE__ */ a.jsx("stop", { offset: "0%", stopColor: "var(--chart-rose)", stopOpacity: 0.8 }),
                /* @__PURE__ */ a.jsx("stop", { offset: "100%", stopColor: "var(--chart-rose)", stopOpacity: 0.6 })
              ] }),
              /* @__PURE__ */ a.jsxs("linearGradient", { id: "gradientBlue", x1: "0", x2: "0", y1: "0", y2: "1", children: [
                /* @__PURE__ */ a.jsx("stop", { offset: "0%", stopColor: "var(--chart-blue)", stopOpacity: 0.8 }),
                /* @__PURE__ */ a.jsx("stop", { offset: "100%", stopColor: "var(--chart-blue)", stopOpacity: 0.6 })
              ] }),
              /* @__PURE__ */ a.jsxs("linearGradient", { id: "gradientOrange", x1: "0", x2: "0", y1: "0", y2: "1", children: [
                /* @__PURE__ */ a.jsx("stop", { offset: "0%", stopColor: "var(--chart-orange)", stopOpacity: 0.8 }),
                /* @__PURE__ */ a.jsx("stop", { offset: "100%", stopColor: "var(--chart-orange)", stopOpacity: 0.6 })
              ] }),
              /* @__PURE__ */ a.jsxs("linearGradient", { id: "gradientGreen", x1: "0", x2: "0", y1: "0", y2: "1", children: [
                /* @__PURE__ */ a.jsx("stop", { offset: "0%", stopColor: "var(--chart-green)", stopOpacity: 0.8 }),
                /* @__PURE__ */ a.jsx("stop", { offset: "100%", stopColor: "var(--chart-green)", stopOpacity: 0.6 })
              ] }),
              /* @__PURE__ */ a.jsxs("linearGradient", { id: "gradientAmber", x1: "0", x2: "0", y1: "0", y2: "1", children: [
                /* @__PURE__ */ a.jsx("stop", { offset: "0%", stopColor: "var(--chart-amber)", stopOpacity: 0.8 }),
                /* @__PURE__ */ a.jsx("stop", { offset: "100%", stopColor: "var(--chart-amber)", stopOpacity: 0.6 })
              ] }),
              /* @__PURE__ */ a.jsxs("linearGradient", { id: "gradientYellow", x1: "0", x2: "0", y1: "0", y2: "1", children: [
                /* @__PURE__ */ a.jsx("stop", { offset: "0%", stopColor: "var(--chart-yellow)", stopOpacity: 0.8 }),
                /* @__PURE__ */ a.jsx("stop", { offset: "100%", stopColor: "var(--chart-yellow)", stopOpacity: 0.6 })
              ] }),
              /* @__PURE__ */ a.jsxs("linearGradient", { id: "gradientDarkblue", x1: "0", x2: "0", y1: "0", y2: "1", children: [
                /* @__PURE__ */ a.jsx("stop", { offset: "0%", stopColor: "var(--chart-darkblue)", stopOpacity: 0.8 }),
                /* @__PURE__ */ a.jsx("stop", { offset: "100%", stopColor: "var(--chart-darkblue)", stopOpacity: 0.6 })
              ] }),
              /* @__PURE__ */ a.jsxs("linearGradient", { id: "gradientGray", x1: "0", x2: "0", y1: "0", y2: "1", children: [
                /* @__PURE__ */ a.jsx("stop", { offset: "0%", stopColor: "var(--chart-darkgray)", stopOpacity: 0.8 }),
                /* @__PURE__ */ a.jsx("stop", { offset: "100%", stopColor: "var(--chart-darkgray)", stopOpacity: 0.6 })
              ] })
            ] }),
            /* @__PURE__ */ a.jsx(
              Ct,
              {
                content: /* @__PURE__ */ a.jsx(Ua, {}),
                cursor: !1
              }
            ),
            /* @__PURE__ */ a.jsx(
              V,
              {
                animationBegin: 0,
                animationDuration: 1e3,
                data: p,
                dataKey: "count",
                innerRadius: 70,
                nameKey: "name",
                strokeWidth: 5,
                children: /* @__PURE__ */ a.jsx(
                  Je,
                  {
                    content: ({ viewBox: l }) => {
                      if (l && "cx" in l && "cy" in l)
                        return /* @__PURE__ */ a.jsxs(
                          "text",
                          {
                            dominantBaseline: "middle",
                            textAnchor: "middle",
                            x: l.cx,
                            y: l.cy,
                            children: [
                              /* @__PURE__ */ a.jsx(
                                "tspan",
                                {
                                  className: "fill-foreground text-2xl font-semibold tracking-tight",
                                  x: l.cx,
                                  y: l.cy,
                                  children: _(g)
                                }
                              ),
                              /* @__PURE__ */ a.jsx(
                                "tspan",
                                {
                                  className: "fill-muted-foreground",
                                  x: l.cx,
                                  y: (l.cy || 0) + 20,
                                  children: "Total"
                                }
                              )
                            ]
                          }
                        );
                    }
                  }
                )
              }
            )
          ] })
        }
      ),
      v.length > 0 && /* @__PURE__ */ a.jsx("div", { className: "mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-muted-foreground", children: v.map((l) => /* @__PURE__ */ a.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ a.jsx(
          "span",
          {
            className: "size-2 rounded-full opacity-50",
            style: { backgroundColor: l.color }
          }
        ),
        /* @__PURE__ */ a.jsx("span", { className: "max-w-[150px] truncate whitespace-nowrap", title: l.label, children: l.label }),
        /* @__PURE__ */ a.jsxs("span", { className: "font-medium text-foreground", children: [
          Math.round(Number(l.percentage) || 0),
          "%"
        ] })
      ] }, l.label)) })
    ] }) : /* @__PURE__ */ a.jsx("div", { className: "py-12", children: /* @__PURE__ */ a.jsx(
      ye,
      {
        description: `No new paid subscriptions ${Z(e)}.`,
        title: "No new subscribers",
        children: /* @__PURE__ */ a.jsx(jr, { strokeWidth: 1.5 })
      }
    ) }) })
  ] });
}, Za = (t, e, n) => {
  if (e === 1) {
    const c = R().format("YYYY-MM-DD"), x = t.find((j) => j.date === c);
    return [{
      date: c,
      signups: x?.signups || 0,
      cancellations: x?.cancellations || 0
    }];
  }
  const { startDate: r, endDate: s } = je(e), o = R(s).diff(R(r), "days"), i = Pr(e, o, "sum", n), u = new Map(t.map((c) => [c.date, c])), h = [], d = /* @__PURE__ */ new Set();
  if (i === "monthly") {
    const c = R(r).startOf("month"), x = R(s).startOf("month");
    for (; c.isSameOrBefore(x); ) {
      const j = c.format("YYYY-MM-DD");
      if (!d.has(j)) {
        d.add(j);
        const p = u.get(j);
        p ? h.push(p) : h.push({
          date: j,
          signups: 0,
          cancellations: 0
        });
      }
      c.add(1, "month");
    }
  } else if (i === "weekly") {
    const c = R(r).startOf("week"), x = R(s).startOf("week");
    for (; c.isSameOrBefore(x); ) {
      const j = c.format("YYYY-MM-DD");
      if (!d.has(j)) {
        d.add(j);
        const p = u.get(j);
        p ? h.push(p) : h.push({
          date: j,
          signups: 0,
          cancellations: 0
        });
      }
      c.add(1, "week");
    }
  } else {
    const c = R(r), x = R(s);
    for (; c.isSameOrBefore(x); ) {
      const j = c.format("YYYY-MM-DD"), p = u.get(j);
      p ? h.push(p) : h.push({
        date: j,
        signups: 0,
        cancellations: 0
      }), c.add(1, "day");
    }
  }
  return h;
}, zt = (t) => {
  if (t === -1) {
    const { startDate: e, endDate: n } = je(t);
    return R(n).diff(R(e), "days");
  }
  return t;
}, Qa = (t) => {
  const e = zt(t);
  return e < 30 ? ["daily"] : e >= 91 ? ["weekly", "monthly"] : ["daily", "weekly"];
}, yt = (t) => {
  const e = zt(t);
  return e < 30 ? "daily" : e >= 91 ? "monthly" : "weekly";
}, Ja = ({
  subscriptionData: t,
  memberData: e,
  range: n,
  isLoading: r
}) => {
  const [s, o] = re(() => yt(n));
  He(() => {
    o(yt(n));
  }, [n]);
  const i = M(() => Qa(n), [n]), u = M(() => {
    switch (s) {
      case "daily":
        return "none";
      case "weekly":
        return "weekly";
      case "monthly":
        return "monthly";
    }
  }, [s]), h = M(() => {
    if (t && t.length > 0) {
      if (n === 1) {
        const f = R().format("YYYY-MM-DD"), T = t.find((P) => P.date === f);
        return [{
          date: q(f, n),
          rawDate: f,
          // Keep raw date for dynamic tooltip formatting
          new: T?.signups || 0,
          cancelled: -(T?.cancellations || 0)
          // Negative for the stacked bar chart
        }];
      }
      const p = be(t, n, "signups", "sum", u), g = be(t, n, "cancellations", "sum", u), m = new Map(g.map((f) => [f.date, f])), v = p.map((f) => ({
        date: f.date,
        signups: f.signups || 0,
        cancellations: m.get(f.date)?.cancellations || 0
      })), A = new Set(v.map((f) => f.date));
      return g.forEach((f) => {
        A.has(f.date) || v.push({
          date: f.date,
          signups: 0,
          cancellations: f.cancellations || 0
        });
      }), v.sort((f, T) => new Date(f.date).getTime() - new Date(T.date).getTime()), Za(v, n, u).map((f) => {
        let T = n;
        return s === "weekly" && n < 91 ? T = 91 : s === "monthly" && n < 365 && (T = 365), {
          date: q(f.date, T),
          rawDate: f.date,
          // Keep raw date for dynamic tooltip formatting
          new: f.signups || 0,
          cancelled: -(f.cancellations || 0)
          // Negative for the stacked bar chart
        };
      });
    } else {
      if (!e || e.length === 0)
        return [];
      if (n === 1) {
        const l = R().format("YYYY-MM-DD"), f = e.find((T) => T.date === l);
        return [{
          date: q(l, n),
          rawDate: l,
          // Keep raw date for dynamic tooltip formatting
          new: f?.paid_subscribed || 0,
          cancelled: -(f?.paid_canceled || 0)
          // Negative for the stacked bar chart
        }];
      }
      const p = be(e, n, "paid_subscribed", "sum", u), g = be(e, n, "paid_canceled", "sum", u), m = new Map(g.map((l) => [l.date, l])), v = p.map((l) => ({
        date: l.date,
        paid_subscribed: l.paid_subscribed || 0,
        paid_canceled: m.get(l.date)?.paid_canceled || 0
      })), A = new Set(v.map((l) => l.date));
      return g.forEach((l) => {
        A.has(l.date) || v.push({
          date: l.date,
          paid_subscribed: 0,
          paid_canceled: l.paid_canceled || 0
        });
      }), v.sort((l, f) => new Date(l.date).getTime() - new Date(f.date).getTime()), v.map((l) => {
        let f = n;
        return s === "weekly" && n < 91 ? f = 91 : s === "monthly" && n < 365 && (f = 365), {
          date: q(l.date, f),
          rawDate: l.date,
          // Keep raw date for dynamic tooltip formatting
          new: l.paid_subscribed || 0,
          cancelled: -(l.paid_canceled || 0)
          // Negative for the stacked bar chart
        };
      });
    }
  }, [e, t, n, u, s]), d = {
    new: {
      label: "New",
      color: "var(--chart-teal)"
    },
    cancelled: {
      label: "Cancelled",
      color: "var(--chart-rose)"
    }
  }, c = M(() => {
    const p = h.reduce((m, v) => m + v.new, 0), g = h.reduce((m, v) => m + Math.abs(v.cancelled), 0);
    return { new: p, cancelled: g };
  }, [h]);
  if (r)
    return null;
  const x = h.length > 0 && (c.new > 0 || c.cancelled > 0), j = (p) => p.charAt(0).toUpperCase() + p.slice(1);
  return /* @__PURE__ */ a.jsxs(_e, { "data-testid": "paid-members-change-card", children: [
    /* @__PURE__ */ a.jsx(et, { children: /* @__PURE__ */ a.jsxs("div", { className: "flex items-start justify-between gap-1.5", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ a.jsx(tt, { children: "Paid subscriptions" }),
        /* @__PURE__ */ a.jsxs(rt, { children: [
          "New and cancelled paid subscriptions ",
          Z(n)
        ] })
      ] }),
      i.length > 1 && /* @__PURE__ */ a.jsx("div", { children: /* @__PURE__ */ a.jsxs(Pt, { value: s, onValueChange: (p) => o(p), children: [
        /* @__PURE__ */ a.jsx(_t, { className: "w-[110px]", children: /* @__PURE__ */ a.jsx(Nt, {}) }),
        /* @__PURE__ */ a.jsx(Tt, { align: "end", children: i.map((p) => /* @__PURE__ */ a.jsx(Ke, { value: p, children: j(p) }, p)) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ a.jsx(Ne, { children: x ? /* @__PURE__ */ a.jsxs("div", { children: [
      /* @__PURE__ */ a.jsx(Dt, { className: "aspect-auto h-[200px] w-full md:h-[220px] xl:h-[260px]", config: d, children: /* @__PURE__ */ a.jsxs(
        Ur,
        {
          data: h,
          stackOffset: "sign",
          children: [
            /* @__PURE__ */ a.jsx("defs", { children: /* @__PURE__ */ a.jsxs("linearGradient", { id: "tealGradient", x1: "0", x2: "0", y1: "0", y2: "1", children: [
              /* @__PURE__ */ a.jsx("stop", { offset: "0%", stopColor: "var(--color-new)", stopOpacity: 0.8 }),
              /* @__PURE__ */ a.jsx("stop", { offset: "100%", stopColor: "var(--color-new)", stopOpacity: 0.6 })
            ] }) }),
            /* @__PURE__ */ a.jsx("defs", { children: /* @__PURE__ */ a.jsxs("linearGradient", { id: "roseGradient", x1: "0", x2: "0", y1: "0", y2: "1", children: [
              /* @__PURE__ */ a.jsx("stop", { offset: "0%", stopColor: "var(--color-cancelled)", stopOpacity: 0.6 }),
              /* @__PURE__ */ a.jsx("stop", { offset: "100%", stopColor: "var(--color-cancelled)", stopOpacity: 0.8 })
            ] }) }),
            /* @__PURE__ */ a.jsx(wr, { stroke: "var(--border)", vertical: !1 }),
            /* @__PURE__ */ a.jsx(
              Ar,
              {
                axisLine: !1,
                dataKey: "date",
                tickFormatter: () => "",
                tickLine: !1,
                tickMargin: 10
              }
            ),
            /* @__PURE__ */ a.jsx(
              kr,
              {
                axisLine: !1,
                tickFormatter: (p) => p < 0 ? _(p * -1) : _(p),
                tickLine: !1
              }
            ),
            /* @__PURE__ */ a.jsx(
              Ct,
              {
                content: /* @__PURE__ */ a.jsx(
                  Sr,
                  {
                    className: "min-w-[120px]! px-3 py-2",
                    formatter: (p, g, m, v) => {
                      const A = Number(p);
                      let l = "0";
                      A === 0 ? l = "0" : l = A < 0 ? _(A * -1) : _(A);
                      const f = Number(m?.payload?.new || 0), T = Number(m?.payload?.cancelled || 0), P = f + T, k = P === 0 ? "0" : P > 0 ? `+${_(P)}` : _(P);
                      let w = m?.payload?.date;
                      return m?.payload?.rawDate && (s === "monthly" ? w = q(m.payload.rawDate, 366) : s === "weekly" ? w = q(m.payload.rawDate, 91) : w = q(m.payload.rawDate, 30)), /* @__PURE__ */ a.jsxs("div", { className: "flex w-full flex-col", children: [
                        v === 0 && /* @__PURE__ */ a.jsx("div", { className: "mb-1 text-sm font-medium text-foreground", children: w }),
                        /* @__PURE__ */ a.jsxs("div", { className: "flex w-full items-center justify-between gap-4", children: [
                          /* @__PURE__ */ a.jsxs("div", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ a.jsx(
                              "div",
                              {
                                className: "size-2 shrink-0 rounded-full bg-[var(--color-bg)] opacity-50",
                                style: {
                                  "--color-bg": `var(--color-${g})`
                                }
                              }
                            ),
                            /* @__PURE__ */ a.jsx("span", { className: "text-sm text-muted-foreground", children: d[g]?.label || g })
                          ] }),
                          /* @__PURE__ */ a.jsx("div", { className: "ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground tabular-nums", children: l })
                        ] }),
                        v === 1 && /* @__PURE__ */ a.jsxs("div", { className: "mt-1 flex w-full items-center justify-between gap-4 border-t pt-1", children: [
                          /* @__PURE__ */ a.jsx("span", { className: "text-sm text-muted-foreground", children: "Net change" }),
                          /* @__PURE__ */ a.jsx("div", { className: "ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground tabular-nums", children: k })
                        ] })
                      ] });
                    },
                    hideLabel: !0
                  }
                ),
                cursor: !1,
                isAnimationActive: !1,
                position: { y: 10 }
              }
            ),
            /* @__PURE__ */ a.jsx(
              it,
              {
                activeBar: { fillOpacity: 1 },
                dataKey: "new",
                fill: "url(#tealGradient)",
                fillOpacity: 0.75,
                maxBarSize: 32,
                minPointSize: 3,
                radius: [4, 4, 0, 0],
                stackId: "a"
              }
            ),
            /* @__PURE__ */ a.jsx(
              it,
              {
                activeBar: { fillOpacity: 1 },
                dataKey: "cancelled",
                fill: "url(#roseGradient)",
                fillOpacity: 0.75,
                maxBarSize: 32,
                radius: [4, 4, 0, 0],
                stackId: "a"
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ a.jsxs("div", { className: "mt-3 flex items-center justify-center gap-6 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ a.jsx(
            "span",
            {
              className: "size-2 rounded-full opacity-50",
              style: {
                backgroundColor: d.new.color
              }
            }
          ),
          /* @__PURE__ */ a.jsx("span", { children: "New" }),
          /* @__PURE__ */ a.jsx("span", { className: "font-medium text-foreground", children: _(c.new) })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ a.jsx(
            "span",
            {
              className: "size-2 rounded-full opacity-50",
              style: {
                backgroundColor: d.cancelled.color
              }
            }
          ),
          /* @__PURE__ */ a.jsx("span", { children: "Cancelled" }),
          /* @__PURE__ */ a.jsx("span", { className: "font-medium text-foreground", children: _(c.cancelled) })
        ] })
      ] })
    ] }) : /* @__PURE__ */ a.jsx("div", { className: "py-12", children: /* @__PURE__ */ a.jsx(
      ye,
      {
        description: `No paid subscription changes ${Z(n)}.`,
        title: "No paid member changes",
        children: /* @__PURE__ */ a.jsx(Or, { strokeWidth: 1.5 })
      }
    ) }) })
  ] });
}, Xa = (t, e, n) => {
  const r = t ?? 30, s = e ?? "mrr desc", { startDate: o, endDate: i } = M(() => je(r), [r]), u = M(() => {
    const c = {
      date_from: pe(o),
      date_to: pe(i),
      order: s
    };
    return n === "posts" ? c.post_type = "post" : n === "pages" && (c.post_type = "page"), c;
  }, [o, i, s, n]), h = Object.fromEntries(
    Object.entries(u).filter(([, c]) => c !== void 0)
  );
  return _r({ searchParams: h });
}, ln = () => {
  const { range: t, site: e, settings: n } = Ue(), r = String(n.find((b) => b.key === "timezone")?.value || "Etc/UTC"), s = qe(), [o, i] = re("free_members desc"), [u, h] = re(ne.POSTS_AND_PAGES), [d] = wt(), { appSettings: c } = Ee(), x = d.get("tab") || "total-members", [j, p] = re(x);
  He(() => {
    x !== j && p(x);
  }, [x]);
  const { isLoading: g, chartData: m, totals: v, currencySymbol: A, subscriptionData: l } = Hr(t), { data: f, isLoading: T } = Xa(
    t,
    o,
    u
  ), P = M(() => {
    const S = (f?.stats || []).reduce((N, C) => {
      const z = C.post_id || (C.title && C.title.trim() !== "" ? C.title : C.attribution_url);
      if (!z)
        return N;
      if (!N.has(z))
        N.set(z, C);
      else {
        const ae = N.get(z);
        ae.free_members += C.free_members, ae.paid_members += C.paid_members, ae.mrr += C.mrr, N.set(z, ae);
      }
      return N;
    }, /* @__PURE__ */ new Map()), y = Array.from(S.values()), E = y.reduce((N, C) => N + C.free_members, 0), Q = y.reduce((N, C) => N + C.paid_members, 0), B = y.reduce((N, C) => N + C.mrr, 0);
    return y.map((N) => {
      let C = 0;
      return o.includes("free_members") && E > 0 ? C = N.free_members / E : o.includes("paid_members") && Q > 0 ? C = N.paid_members / Q : o.includes("mrr") && B > 0 && (C = N.mrr / B), {
        title: N.title || N.attribution_url,
        post_id: N.post_id,
        attribution_url: N.attribution_url,
        attribution_type: N.attribution_type,
        attribution_id: N.attribution_id,
        free_members: N.free_members,
        paid_members: N.paid_members,
        mrr: N.mrr,
        percentage: C,
        published_at: N.published_at,
        url_exists: N.url_exists ?? !0
      };
    });
  }, [f, o]), k = g, w = g || T;
  return /* @__PURE__ */ a.jsxs(Nr, { children: [
    /* @__PURE__ */ a.jsx(Tr, { children: /* @__PURE__ */ a.jsx(Dr, { children: /* @__PURE__ */ a.jsx(Cr, {}) }) }),
    /* @__PURE__ */ a.jsxs(Er, { data: k ? void 0 : m, isLoading: !1, loadingComponent: /* @__PURE__ */ a.jsx(a.Fragment, {}), children: [
      /* @__PURE__ */ a.jsx(_e, { "data-testid": "total-members-card", children: /* @__PURE__ */ a.jsx(Ne, { children: /* @__PURE__ */ a.jsx(
        Ga,
        {
          chartData: m,
          currencySymbol: A,
          initialTab: x,
          isLoading: k,
          totals: v,
          onTabChange: p
        }
      ) }) }),
      c?.paidMembersEnabled && j === "paid-members" && /* @__PURE__ */ a.jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-[2fr_minmax(460px,1fr)]", children: [
        /* @__PURE__ */ a.jsx(
          Ja,
          {
            isLoading: k,
            memberData: m,
            range: t,
            subscriptionData: l
          }
        ),
        /* @__PURE__ */ a.jsx(Ha, { isLoading: k, range: t })
      ] }),
      /* @__PURE__ */ a.jsxs(_e, { className: "w-full overflow-x-auto", "data-testid": "top-content-card", children: [
        /* @__PURE__ */ a.jsxs(et, { children: [
          /* @__PURE__ */ a.jsx(tt, { children: zr(u) }),
          /* @__PURE__ */ a.jsx(rt, { children: Yr(u, t, Z) })
        ] }),
        /* @__PURE__ */ a.jsx(Ne, { children: /* @__PURE__ */ a.jsxs(Mt, { children: [
          /* @__PURE__ */ a.jsx(It, { children: /* @__PURE__ */ a.jsxs(K, { className: "[&>th]:h-auto [&>th]:pt-0 [&>th]:pb-2", children: [
            /* @__PURE__ */ a.jsx(U, { className: "min-w-[320px] pl-0", children: /* @__PURE__ */ a.jsx(Et, { defaultValue: u, variant: "button-sm", onValueChange: (b) => {
              h(b);
            }, children: /* @__PURE__ */ a.jsxs(Rt, { children: [
              /* @__PURE__ */ a.jsx(Se, { value: ne.POSTS_AND_PAGES, children: "Posts & pages" }),
              /* @__PURE__ */ a.jsx(Se, { value: ne.POSTS, children: "Posts" }),
              /* @__PURE__ */ a.jsx(Se, { value: ne.PAGES, children: "Pages" }),
              /* @__PURE__ */ a.jsx(Se, { value: ne.SOURCES, children: "Sources" })
            ] }) }) }),
            /* @__PURE__ */ a.jsx(U, { className: "w-[140px] text-right", children: c?.paidMembersEnabled ? /* @__PURE__ */ a.jsx(ue, { activeSortBy: o, setSortBy: i, sortBy: "free_members desc", children: "Free members" }) : /* @__PURE__ */ a.jsx(a.Fragment, { children: "Free members" }) }),
            c?.paidMembersEnabled && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
              /* @__PURE__ */ a.jsx(U, { className: "w-[140px] text-right", children: /* @__PURE__ */ a.jsx(ue, { activeSortBy: o, setSortBy: i, sortBy: "paid_members desc", children: "Paid members" }) }),
              /* @__PURE__ */ a.jsx(U, { className: "w-[140px] text-right", children: /* @__PURE__ */ a.jsx(ue, { activeSortBy: o, setSortBy: i, sortBy: "mrr desc", children: "MRR impact" }) })
            ] })
          ] }) }),
          u === ne.SOURCES ? /* @__PURE__ */ a.jsx(
            Ya,
            {
              limit: 20,
              range: t,
              setSortBy: (b) => i(b),
              showViewAll: !0,
              sortBy: o
            }
          ) : /* @__PURE__ */ a.jsx(xe, { children: w ? /* @__PURE__ */ a.jsx(K, { className: "last:border-none", children: /* @__PURE__ */ a.jsx(L, { className: "border-none py-2", colSpan: 1, children: /* @__PURE__ */ a.jsx(Ot, { containerClassName: "space-y-2", count: 5, maxWidth: 75, randomize: !0 }) }) }) : c?.analytics.membersTrackSources ? P.length > 0 ? P.map((b, S) => /* @__PURE__ */ a.jsxs(K, { className: "last:border-none", children: [
            /* @__PURE__ */ a.jsx(L, { children: /* @__PURE__ */ a.jsxs("div", { className: "group/link inline-flex flex-col items-start gap-px", children: [
              b.post_id && b.attribution_type === "post" ? /* @__PURE__ */ a.jsx(
                Xe,
                {
                  className: "h-auto p-0 text-left leading-tight font-medium whitespace-normal hover:underline!",
                  title: "View post analytics",
                  variant: "link",
                  onClick: Qr(b.attribution_url, b.post_id, e.url || "", s, b.attribution_type),
                  children: b.title
                }
              ) : /* @__PURE__ */ a.jsx("span", { className: "font-medium", children: b.title }),
              b.published_at && at && new Date(b.published_at).getTime() > 0 && /* @__PURE__ */ a.jsxs("span", { className: "text-muted-foreground", children: [
                "Published on ",
                at(b.published_at, r)
              ] })
            ] }) }),
            /* @__PURE__ */ a.jsxs(L, { className: "text-right font-mono text-sm", children: [
              b.free_members > 0 && "+",
              _(b.free_members)
            ] }),
            c?.paidMembersEnabled && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
              /* @__PURE__ */ a.jsxs(L, { className: "text-right font-mono text-sm", children: [
                b.paid_members > 0 && "+",
                _(b.paid_members)
              ] }),
              /* @__PURE__ */ a.jsxs(L, { className: "text-right font-mono text-sm", children: [
                b.mrr > 0 && "+",
                A,
                _(oe(b.mrr))
              ] })
            ] })
          ] }, `${u}-${b.post_id || `${b.title}-${S}`}`)) : /* @__PURE__ */ a.jsx(K, { className: "border-none", children: /* @__PURE__ */ a.jsx(L, { className: "py-12 group-hover:bg-transparent!", colSpan: c?.paidMembersEnabled ? 4 : 2, children: /* @__PURE__ */ a.jsx(
            ye,
            {
              description: "Try adjusting your date range to see more data.",
              title: `No conversions ${Z(t)}`,
              children: /* @__PURE__ */ a.jsx(Rr, { strokeWidth: 1.5 })
            }
          ) }) }) : /* @__PURE__ */ a.jsx(K, { className: "last:border-none", children: /* @__PURE__ */ a.jsx(L, { className: "border-none py-12 group-hover:bg-transparent!", colSpan: c?.paidMembersEnabled ? 4 : 2, children: /* @__PURE__ */ a.jsx(Vt, {}) }) }) })
        ] }) })
      ] })
    ] })
  ] });
};
export {
  ln as default
};
//# sourceMappingURL=index-BDVyyjDG.mjs.map

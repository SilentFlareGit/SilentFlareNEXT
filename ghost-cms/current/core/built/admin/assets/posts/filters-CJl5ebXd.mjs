import { a1 as M, k as at, a7 as st, a6 as ne, ak as re, ad as On, am as ae, a9 as ue, af as oe, Q as d, i as W, x as Ce, l as J, M as Rr, g as Gr, an as Lr, n as Me } from "./index-BuIZkUhD.mjs";
import { a as Kr, h as tn, B as Ur, w as qe, j as et, C as tt } from "./button-CQCNdxY6.mjs";
import { a as Xr, S as Qr, C as Zr, L as Pt } from "./search-Dz7F6ifc.mjs";
import { d as Jr, D as ea, n as ta, i as na, k as ra } from "./skeleton-DrFcKwP3.mjs";
import { R as aa, P as sa, O as oa, a as ia } from "./dialog-DRN6olky.mjs";
import { P as je } from "./index-DzWTmJMy.mjs";
import { P as mt, b as pt, a as gt } from "./popover-Du2NcggM.mjs";
import { S as la } from "./switch-DZFGAF_Y.mjs";
import { T as ca, c as ua, C as da, a as fa } from "./tooltip-D1X0uVas.mjs";
import { P as ha } from "./plus-DW3bG6ui.mjs";
import { X as Nn } from "./x-Cl72IwQm.mjs";
function ma(e, t, n = "long") {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone: e,
    timeZoneName: n
  }).format(t).split(/\s/g).slice(2).join(" ");
}
const pa = {}, Qe = {};
function Oe(e, t) {
  try {
    const r = (pa[e] ||= new Intl.DateTimeFormat("en-US", {
      timeZone: e,
      timeZoneName: "longOffset"
    }).format)(t).split("GMT")[1];
    return r in Qe ? Qe[r] : nn(r, r.split(":"));
  } catch {
    if (e in Qe) return Qe[e];
    const n = e?.match(ga);
    return n ? nn(e, n.slice(1)) : NaN;
  }
}
const ga = /([+-]\d\d):?(\d\d)?/;
function nn(e, t) {
  const n = +(t[0] || 0), r = +(t[1] || 0), a = +(t[2] || 0) / 60;
  return Qe[e] = n * 60 + r > 0 ? n * 60 + r + a : n * 60 - r - a;
}
class ke extends Date {
  //#region static
  constructor(...t) {
    super(), t.length > 1 && typeof t[t.length - 1] == "string" && (this.timeZone = t.pop()), this.internal = /* @__PURE__ */ new Date(), isNaN(Oe(this.timeZone, this)) ? this.setTime(NaN) : t.length ? typeof t[0] == "number" && (t.length === 1 || t.length === 2 && typeof t[1] != "number") ? this.setTime(t[0]) : typeof t[0] == "string" ? this.setTime(+new Date(t[0])) : t[0] instanceof Date ? this.setTime(+t[0]) : (this.setTime(+new Date(...t)), Sn(this, t)) : this.setTime(Date.now());
  }
  static tz(t, ...n) {
    return n.length ? new ke(...n, t) : new ke(Date.now(), t);
  }
  //#endregion
  //#region time zone
  withTimeZone(t) {
    return new ke(+this, t);
  }
  getTimezoneOffset() {
    const t = -Oe(this.timeZone, this);
    return t > 0 ? Math.floor(t) : Math.ceil(t);
  }
  //#endregion
  //#region time
  setTime(t) {
    return Date.prototype.setTime.apply(this, arguments), dt(this), +this;
  }
  //#endregion
  //#region date-fns integration
  [/* @__PURE__ */ Symbol.for("constructDateFrom")](t) {
    return new ke(+new Date(t), this.timeZone);
  }
  //#endregion
}
const rn = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((e) => {
  if (!rn.test(e)) return;
  const t = e.replace(rn, "$1UTC");
  ke.prototype[t] && (e.startsWith("get") ? ke.prototype[e] = function() {
    return this.internal[t]();
  } : (ke.prototype[e] = function() {
    return Date.prototype[t].apply(this.internal, arguments), ya(this), +this;
  }, ke.prototype[t] = function() {
    return Date.prototype[t].apply(this, arguments), dt(this), +this;
  }));
});
function dt(e) {
  e.internal.setTime(+e), e.internal.setUTCSeconds(e.internal.getUTCSeconds() - // Round after converting minutes to seconds to avoid fractional offset
  // precision errors from historical offsets.
  Math.round(-Oe(e.timeZone, e) * 60));
}
function ya(e) {
  Date.prototype.setFullYear.call(e, e.internal.getUTCFullYear(), e.internal.getUTCMonth(), e.internal.getUTCDate()), Date.prototype.setHours.call(e, e.internal.getUTCHours(), e.internal.getUTCMinutes(), e.internal.getUTCSeconds(), e.internal.getUTCMilliseconds()), Sn(e);
}
function Sn(e, t) {
  const n = Array.isArray(t) ? va(t) : +e.internal, r = Oe(e.timeZone, e), a = r > 0 ? Math.floor(r) : Math.ceil(r), o = /* @__PURE__ */ new Date(+e);
  o.setUTCHours(o.getUTCHours() - 1);
  const l = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset(), s = -(/* @__PURE__ */ new Date(+o)).getTimezoneOffset(), i = l - s;
  let c = l;
  if (i && l !== a) {
    const $ = Date.prototype.getHours.apply(e), N = Array.isArray(t) ? t[3] || 0 : e.internal.getUTCHours();
    if ($ !== N) {
      const z = /* @__PURE__ */ new Date(+e), X = l - a;
      X && z.setUTCMinutes(z.getUTCMinutes() + X);
      const U = Oe(e.timeZone, z);
      (U > 0 ? Math.floor(U) : Math.ceil(U)) === a && (c = s);
    }
  }
  const u = c - a;
  u && Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + u);
  const f = /* @__PURE__ */ new Date(+e);
  f.setUTCSeconds(0);
  const h = l > 0 ? f.getSeconds() : (f.getSeconds() - 60) % 60, p = Math.round(-(Oe(e.timeZone, e) * 60)) % 60;
  (p || h) && Date.prototype.setUTCSeconds.call(e, Date.prototype.getUTCSeconds.call(e) + p + h);
  const y = Oe(e.timeZone, e), S = y > 0 ? Math.floor(y) : Math.ceil(y), O = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset() - S, D = S !== a, v = O - u, k = S - a, b = n - S * 60 * 1e3, m = k > 0 && an(e) - n === k * 60 * 1e3 && an(e, b) !== n;
  if (D && v && !m) {
    Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + v);
    const $ = Oe(e.timeZone, e), N = $ > 0 ? Math.floor($) : Math.ceil($), z = S - N;
    z && v < 0 && Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + z);
  }
  dt(e);
  const B = (t ? n : n + p * 1e3) - +e.internal;
  B && Math.abs(B) < 1800 * 1e3 && (Date.prototype.setTime.call(e, +e + B), dt(e));
}
function va(e) {
  return Date.UTC(e[0], e.length > 1 ? e[1] : 0, e.length > 2 ? e[2] : 1, ...e.slice(3));
}
function an(e, t) {
  const n = new Date(t ?? +e);
  return n.setUTCSeconds(n.getUTCSeconds() - Math.round(-Oe(e.timeZone, n) * 60)), +n;
}
class se extends ke {
  //#region static
  static tz(t, ...n) {
    return n.length ? new se(...n, t) : new se(Date.now(), t);
  }
  //#endregion
  //#region representation
  toISOString() {
    const [t, n, r] = this.tzComponents(), a = `${t}${n}:${r}`;
    return this.internal.toISOString().slice(0, -1) + a;
  }
  toString() {
    return `${this.toDateString()} ${this.toTimeString()}`;
  }
  toDateString() {
    const [t, n, r, a] = this.internal.toUTCString().split(" ");
    return `${t?.slice(0, -1)} ${r} ${n} ${a}`;
  }
  toTimeString() {
    const t = this.internal.toUTCString().split(" ")[4], [n, r, a] = this.tzComponents();
    return `${t} GMT${n}${r}${a} (${ma(this.timeZone, this)})`;
  }
  toLocaleString(t, n) {
    return Date.prototype.toLocaleString.call(this, t, {
      ...n,
      timeZone: n?.timeZone || this.timeZone
    });
  }
  toLocaleDateString(t, n) {
    return Date.prototype.toLocaleDateString.call(this, t, {
      ...n,
      timeZone: n?.timeZone || this.timeZone
    });
  }
  toLocaleTimeString(t, n) {
    return Date.prototype.toLocaleTimeString.call(this, t, {
      ...n,
      timeZone: n?.timeZone || this.timeZone
    });
  }
  //#endregion
  //#region private
  tzComponents() {
    const t = this.getTimezoneOffset(), n = t > 0 ? "-" : "+", r = String(Math.floor(Math.abs(t) / 60)).padStart(2, "0"), a = String(Math.abs(t) % 60).padStart(2, "0");
    return [n, r, a];
  }
  //#endregion
  withTimeZone(t) {
    return new se(+this, t);
  }
  //#region date-fns integration
  [/* @__PURE__ */ Symbol.for("constructDateFrom")](t) {
    return new se(+new Date(t), this.timeZone);
  }
  //#endregion
}
const Cn = 6048e5, ba = 864e5, sn = /* @__PURE__ */ Symbol.for("constructDateFrom");
function ee(e, t) {
  return typeof e == "function" ? e(t) : e && typeof e == "object" && sn in e ? e[sn](t) : e instanceof Date ? new e.constructor(t) : new Date(t);
}
function K(e, t) {
  return ee(t || e, e);
}
function Wn(e, t, n) {
  const r = K(e, n?.in);
  return isNaN(t) ? ee(e, NaN) : (t && r.setDate(r.getDate() + t), r);
}
function _n(e, t, n) {
  const r = K(e, n?.in);
  if (isNaN(t)) return ee(e, NaN);
  if (!t)
    return r;
  const a = r.getDate(), o = ee(e, r.getTime());
  o.setMonth(r.getMonth() + t + 1, 0);
  const l = o.getDate();
  return a >= l ? o : (r.setFullYear(
    o.getFullYear(),
    o.getMonth(),
    a
  ), r);
}
let xa = {};
function ot() {
  return xa;
}
function Re(e, t) {
  const n = ot(), r = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0, a = K(e, t?.in), o = a.getDay(), l = (o < r ? 7 : 0) + o - r;
  return a.setDate(a.getDate() - l), a.setHours(0, 0, 0, 0), a;
}
function nt(e, t) {
  return Re(e, { ...t, weekStartsOn: 1 });
}
function jn(e, t) {
  const n = K(e, t?.in), r = n.getFullYear(), a = ee(n, 0);
  a.setFullYear(r + 1, 0, 4), a.setHours(0, 0, 0, 0);
  const o = nt(a), l = ee(n, 0);
  l.setFullYear(r, 0, 4), l.setHours(0, 0, 0, 0);
  const s = nt(l);
  return n.getTime() >= o.getTime() ? r + 1 : n.getTime() >= s.getTime() ? r : r - 1;
}
function on(e) {
  const t = K(e), n = new Date(
    Date.UTC(
      t.getFullYear(),
      t.getMonth(),
      t.getDate(),
      t.getHours(),
      t.getMinutes(),
      t.getSeconds(),
      t.getMilliseconds()
    )
  );
  return n.setUTCFullYear(t.getFullYear()), +e - +n;
}
function Le(e, ...t) {
  const n = ee.bind(
    null,
    t.find((r) => typeof r == "object")
  );
  return t.map(n);
}
function rt(e, t) {
  const n = K(e, t?.in);
  return n.setHours(0, 0, 0, 0), n;
}
function Bt(e, t, n) {
  const [r, a] = Le(
    n?.in,
    e,
    t
  ), o = rt(r), l = rt(a), s = +o - on(o), i = +l - on(l);
  return Math.round((s - i) / ba);
}
function wa(e, t) {
  const n = jn(e, t), r = ee(e, 0);
  return r.setFullYear(n, 0, 4), r.setHours(0, 0, 0, 0), nt(r);
}
function ka(e, t, n) {
  return Wn(e, t * 7, n);
}
function Ma(e, t, n) {
  return _n(e, t * 12, n);
}
function Da(e, t) {
  let n, r = t?.in;
  return e.forEach((a) => {
    !r && typeof a == "object" && (r = ee.bind(null, a));
    const o = K(a, r);
    (!n || n < o || isNaN(+o)) && (n = o);
  }), ee(r, n || NaN);
}
function Oa(e, t) {
  let n, r = t?.in;
  return e.forEach((a) => {
    !r && typeof a == "object" && (r = ee.bind(null, a));
    const o = K(a, r);
    (!n || n > o || isNaN(+o)) && (n = o);
  }), ee(r, n || NaN);
}
function Na(e, t, n) {
  const [r, a] = Le(
    n?.in,
    e,
    t
  );
  return +rt(r) == +rt(a);
}
function Fn(e) {
  return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
function Sa(e) {
  return !(!Fn(e) && typeof e != "number" || isNaN(+K(e)));
}
function Tn(e, t, n) {
  const [r, a] = Le(
    n?.in,
    e,
    t
  ), o = r.getFullYear() - a.getFullYear(), l = r.getMonth() - a.getMonth();
  return o * 12 + l;
}
function Ca(e, t) {
  const n = K(e, t?.in), r = n.getMonth();
  return n.setFullYear(n.getFullYear(), r + 1, 0), n.setHours(23, 59, 59, 999), n;
}
function En(e, t) {
  const [n, r] = Le(e, t.start, t.end);
  return { start: n, end: r };
}
function Wa(e, t) {
  const { start: n, end: r } = En(t?.in, e);
  let a = +n > +r;
  const o = a ? +n : +r, l = a ? r : n;
  l.setHours(0, 0, 0, 0), l.setDate(1);
  let s = 1;
  const i = [];
  for (; +l <= o; )
    i.push(ee(n, l)), l.setMonth(l.getMonth() + s);
  return a ? i.reverse() : i;
}
function _a(e, t) {
  const n = K(e, t?.in);
  return n.setDate(1), n.setHours(0, 0, 0, 0), n;
}
function ja(e, t) {
  const n = K(e, t?.in), r = n.getFullYear();
  return n.setFullYear(r + 1, 0, 0), n.setHours(23, 59, 59, 999), n;
}
function Pn(e, t) {
  const n = K(e, t?.in);
  return n.setFullYear(n.getFullYear(), 0, 1), n.setHours(0, 0, 0, 0), n;
}
function Fa(e, t) {
  const { start: n, end: r } = En(t?.in, e);
  let a = +n > +r;
  const o = a ? +n : +r, l = a ? r : n;
  l.setHours(0, 0, 0, 0), l.setMonth(0, 1);
  let s = 1;
  const i = [];
  for (; +l <= o; )
    i.push(ee(n, l)), l.setFullYear(l.getFullYear() + s);
  return a ? i.reverse() : i;
}
function Yn(e, t) {
  const n = ot(), r = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0, a = K(e, t?.in), o = a.getDay(), l = (o < r ? -7 : 0) + 6 - (o - r);
  return a.setDate(a.getDate() + l), a.setHours(23, 59, 59, 999), a;
}
function Ta(e, t) {
  return Yn(e, { ...t, weekStartsOn: 1 });
}
const Ea = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
}, Pa = (e, t, n) => {
  let r;
  const a = Ea[e];
  return typeof a == "string" ? r = a : t === 1 ? r = a.one : r = a.other.replace("{{count}}", t.toString()), n?.addSuffix ? n.comparison && n.comparison > 0 ? "in " + r : r + " ago" : r;
};
function Ot(e) {
  return (t = {}) => {
    const n = t.width ? String(t.width) : e.defaultWidth;
    return e.formats[n] || e.formats[e.defaultWidth];
  };
}
const Ya = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, Ia = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, za = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Ba = {
  date: Ot({
    formats: Ya,
    defaultWidth: "full"
  }),
  time: Ot({
    formats: Ia,
    defaultWidth: "full"
  }),
  dateTime: Ot({
    formats: za,
    defaultWidth: "full"
  })
}, Aa = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, $a = (e, t, n, r) => Aa[e];
function Ke(e) {
  return (t, n) => {
    const r = n?.context ? String(n.context) : "standalone";
    let a;
    if (r === "formatting" && e.formattingValues) {
      const l = e.defaultFormattingWidth || e.defaultWidth, s = n?.width ? String(n.width) : l;
      a = e.formattingValues[s] || e.formattingValues[l];
    } else {
      const l = e.defaultWidth, s = n?.width ? String(n.width) : e.defaultWidth;
      a = e.values[s] || e.values[l];
    }
    const o = e.argumentCallback ? e.argumentCallback(t) : t;
    return a[o];
  };
}
const Va = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, qa = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, Ha = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
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
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
}, Ra = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
}, Ga = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
}, La = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
}, Ka = (e, t) => {
  const n = Number(e), r = n % 100;
  if (r > 20 || r < 10)
    switch (r % 10) {
      case 1:
        return n + "st";
      case 2:
        return n + "nd";
      case 3:
        return n + "rd";
    }
  return n + "th";
}, Ua = {
  ordinalNumber: Ka,
  era: Ke({
    values: Va,
    defaultWidth: "wide"
  }),
  quarter: Ke({
    values: qa,
    defaultWidth: "wide",
    argumentCallback: (e) => e - 1
  }),
  month: Ke({
    values: Ha,
    defaultWidth: "wide"
  }),
  day: Ke({
    values: Ra,
    defaultWidth: "wide"
  }),
  dayPeriod: Ke({
    values: Ga,
    defaultWidth: "wide",
    formattingValues: La,
    defaultFormattingWidth: "wide"
  })
};
function Ue(e) {
  return (t, n = {}) => {
    const r = n.width, a = r && e.matchPatterns[r] || e.matchPatterns[e.defaultMatchWidth], o = t.match(a);
    if (!o)
      return null;
    const l = o[0], s = r && e.parsePatterns[r] || e.parsePatterns[e.defaultParseWidth], i = Array.isArray(s) ? Qa(s, (f) => f.test(l)) : (
      // [TODO] -- I challenge you to fix the type
      Xa(s, (f) => f.test(l))
    );
    let c;
    c = e.valueCallback ? e.valueCallback(i) : i, c = n.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      n.valueCallback(c)
    ) : c;
    const u = t.slice(l.length);
    return { value: c, rest: u };
  };
}
function Xa(e, t) {
  for (const n in e)
    if (Object.prototype.hasOwnProperty.call(e, n) && t(e[n]))
      return n;
}
function Qa(e, t) {
  for (let n = 0; n < e.length; n++)
    if (t(e[n]))
      return n;
}
function Za(e) {
  return (t, n = {}) => {
    const r = t.match(e.matchPattern);
    if (!r) return null;
    const a = r[0], o = t.match(e.parsePattern);
    if (!o) return null;
    let l = e.valueCallback ? e.valueCallback(o[0]) : o[0];
    l = n.valueCallback ? n.valueCallback(l) : l;
    const s = t.slice(a.length);
    return { value: l, rest: s };
  };
}
const Ja = /^(\d+)(th|st|nd|rd)?/i, es = /\d+/i, ts = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, ns = {
  any: [/^b/i, /^(a|c)/i]
}, rs = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, as = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, ss = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, os = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
}, is = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, ls = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, cs = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, us = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
}, ds = {
  ordinalNumber: Za({
    matchPattern: Ja,
    parsePattern: es,
    valueCallback: (e) => parseInt(e, 10)
  }),
  era: Ue({
    matchPatterns: ts,
    defaultMatchWidth: "wide",
    parsePatterns: ns,
    defaultParseWidth: "any"
  }),
  quarter: Ue({
    matchPatterns: rs,
    defaultMatchWidth: "wide",
    parsePatterns: as,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: Ue({
    matchPatterns: ss,
    defaultMatchWidth: "wide",
    parsePatterns: os,
    defaultParseWidth: "any"
  }),
  day: Ue({
    matchPatterns: is,
    defaultMatchWidth: "wide",
    parsePatterns: ls,
    defaultParseWidth: "any"
  }),
  dayPeriod: Ue({
    matchPatterns: cs,
    defaultMatchWidth: "any",
    parsePatterns: us,
    defaultParseWidth: "any"
  })
}, Be = {
  code: "en-US",
  formatDistance: Pa,
  formatLong: Ba,
  formatRelative: $a,
  localize: Ua,
  match: ds,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function fs(e, t) {
  const n = K(e, t?.in);
  return Bt(n, Pn(n)) + 1;
}
function At(e, t) {
  const n = K(e, t?.in), r = +nt(n) - +wa(n);
  return Math.round(r / Cn) + 1;
}
function In(e, t) {
  const n = K(e, t?.in), r = n.getFullYear(), a = ot(), o = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? a.firstWeekContainsDate ?? a.locale?.options?.firstWeekContainsDate ?? 1, l = ee(t?.in || e, 0);
  l.setFullYear(r + 1, 0, o), l.setHours(0, 0, 0, 0);
  const s = Re(l, t), i = ee(t?.in || e, 0);
  i.setFullYear(r, 0, o), i.setHours(0, 0, 0, 0);
  const c = Re(i, t);
  return +n >= +s ? r + 1 : +n >= +c ? r : r - 1;
}
function hs(e, t) {
  const n = ot(), r = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? n.firstWeekContainsDate ?? n.locale?.options?.firstWeekContainsDate ?? 1, a = In(e, t), o = ee(t?.in || e, 0);
  return o.setFullYear(a, 0, r), o.setHours(0, 0, 0, 0), Re(o, t);
}
function $t(e, t) {
  const n = K(e, t?.in), r = +Re(n, t) - +hs(n, t);
  return Math.round(r / Cn) + 1;
}
function G(e, t) {
  const n = e < 0 ? "-" : "", r = Math.abs(e).toString().padStart(t, "0");
  return n + r;
}
const We = {
  // Year
  y(e, t) {
    const n = e.getFullYear(), r = n > 0 ? n : 1 - n;
    return G(t === "yy" ? r % 100 : r, t.length);
  },
  // Month
  M(e, t) {
    const n = e.getMonth();
    return t === "M" ? String(n + 1) : G(n + 1, 2);
  },
  // Day of the month
  d(e, t) {
    return G(e.getDate(), t.length);
  },
  // AM or PM
  a(e, t) {
    const n = e.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return n.toUpperCase();
      case "aaa":
        return n;
      case "aaaaa":
        return n[0];
      default:
        return n === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(e, t) {
    return G(e.getHours() % 12 || 12, t.length);
  },
  // Hour [0-23]
  H(e, t) {
    return G(e.getHours(), t.length);
  },
  // Minute
  m(e, t) {
    return G(e.getMinutes(), t.length);
  },
  // Second
  s(e, t) {
    return G(e.getSeconds(), t.length);
  },
  // Fraction of second
  S(e, t) {
    const n = t.length, r = e.getMilliseconds(), a = Math.trunc(
      r * Math.pow(10, n - 3)
    );
    return G(a, t.length);
  }
}, Ie = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, ln = {
  // Era
  G: function(e, t, n) {
    const r = e.getFullYear() > 0 ? 1 : 0;
    switch (t) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return n.era(r, { width: "abbreviated" });
      // A, B
      case "GGGGG":
        return n.era(r, { width: "narrow" });
      default:
        return n.era(r, { width: "wide" });
    }
  },
  // Year
  y: function(e, t, n) {
    if (t === "yo") {
      const r = e.getFullYear(), a = r > 0 ? r : 1 - r;
      return n.ordinalNumber(a, { unit: "year" });
    }
    return We.y(e, t);
  },
  // Local week-numbering year
  Y: function(e, t, n, r) {
    const a = In(e, r), o = a > 0 ? a : 1 - a;
    if (t === "YY") {
      const l = o % 100;
      return G(l, 2);
    }
    return t === "Yo" ? n.ordinalNumber(o, { unit: "year" }) : G(o, t.length);
  },
  // ISO week-numbering year
  R: function(e, t) {
    const n = jn(e);
    return G(n, t.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(e, t) {
    const n = e.getFullYear();
    return G(n, t.length);
  },
  // Quarter
  Q: function(e, t, n) {
    const r = Math.ceil((e.getMonth() + 1) / 3);
    switch (t) {
      // 1, 2, 3, 4
      case "Q":
        return String(r);
      // 01, 02, 03, 04
      case "QQ":
        return G(r, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return n.ordinalNumber(r, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return n.quarter(r, {
          width: "abbreviated",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return n.quarter(r, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return n.quarter(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(e, t, n) {
    const r = Math.ceil((e.getMonth() + 1) / 3);
    switch (t) {
      // 1, 2, 3, 4
      case "q":
        return String(r);
      // 01, 02, 03, 04
      case "qq":
        return G(r, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return n.ordinalNumber(r, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return n.quarter(r, {
          width: "abbreviated",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return n.quarter(r, {
          width: "narrow",
          context: "standalone"
        });
      default:
        return n.quarter(r, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(e, t, n) {
    const r = e.getMonth();
    switch (t) {
      case "M":
      case "MM":
        return We.M(e, t);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return n.ordinalNumber(r + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "MMM":
        return n.month(r, {
          width: "abbreviated",
          context: "formatting"
        });
      // J, F, ..., D
      case "MMMMM":
        return n.month(r, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return n.month(r, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(e, t, n) {
    const r = e.getMonth();
    switch (t) {
      // 1, 2, ..., 12
      case "L":
        return String(r + 1);
      // 01, 02, ..., 12
      case "LL":
        return G(r + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return n.ordinalNumber(r + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "LLL":
        return n.month(r, {
          width: "abbreviated",
          context: "standalone"
        });
      // J, F, ..., D
      case "LLLLL":
        return n.month(r, {
          width: "narrow",
          context: "standalone"
        });
      default:
        return n.month(r, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(e, t, n, r) {
    const a = $t(e, r);
    return t === "wo" ? n.ordinalNumber(a, { unit: "week" }) : G(a, t.length);
  },
  // ISO week of year
  I: function(e, t, n) {
    const r = At(e);
    return t === "Io" ? n.ordinalNumber(r, { unit: "week" }) : G(r, t.length);
  },
  // Day of the month
  d: function(e, t, n) {
    return t === "do" ? n.ordinalNumber(e.getDate(), { unit: "date" }) : We.d(e, t);
  },
  // Day of year
  D: function(e, t, n) {
    const r = fs(e);
    return t === "Do" ? n.ordinalNumber(r, { unit: "dayOfYear" }) : G(r, t.length);
  },
  // Day of week
  E: function(e, t, n) {
    const r = e.getDay();
    switch (t) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return n.day(r, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "EEEEE":
        return n.day(r, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return n.day(r, {
          width: "short",
          context: "formatting"
        });
      default:
        return n.day(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(e, t, n, r) {
    const a = e.getDay(), o = (a - r.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(o);
      // Padded numerical value
      case "ee":
        return G(o, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return n.ordinalNumber(o, { unit: "day" });
      case "eee":
        return n.day(a, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "eeeee":
        return n.day(a, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return n.day(a, {
          width: "short",
          context: "formatting"
        });
      default:
        return n.day(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(e, t, n, r) {
    const a = e.getDay(), o = (a - r.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      // Numerical value (same as in `e`)
      case "c":
        return String(o);
      // Padded numerical value
      case "cc":
        return G(o, t.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return n.ordinalNumber(o, { unit: "day" });
      case "ccc":
        return n.day(a, {
          width: "abbreviated",
          context: "standalone"
        });
      // T
      case "ccccc":
        return n.day(a, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return n.day(a, {
          width: "short",
          context: "standalone"
        });
      default:
        return n.day(a, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(e, t, n) {
    const r = e.getDay(), a = r === 0 ? 7 : r;
    switch (t) {
      // 2
      case "i":
        return String(a);
      // 02
      case "ii":
        return G(a, t.length);
      // 2nd
      case "io":
        return n.ordinalNumber(a, { unit: "day" });
      // Tue
      case "iii":
        return n.day(r, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "iiiii":
        return n.day(r, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "iiiiii":
        return n.day(r, {
          width: "short",
          context: "formatting"
        });
      default:
        return n.day(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(e, t, n) {
    const a = e.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return n.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return n.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return n.dayPeriod(a, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return n.dayPeriod(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(e, t, n) {
    const r = e.getHours();
    let a;
    switch (r === 12 ? a = Ie.noon : r === 0 ? a = Ie.midnight : a = r / 12 >= 1 ? "pm" : "am", t) {
      case "b":
      case "bb":
        return n.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return n.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return n.dayPeriod(a, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return n.dayPeriod(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(e, t, n) {
    const r = e.getHours();
    let a;
    switch (r >= 17 ? a = Ie.evening : r >= 12 ? a = Ie.afternoon : r >= 4 ? a = Ie.morning : a = Ie.night, t) {
      case "B":
      case "BB":
      case "BBB":
        return n.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return n.dayPeriod(a, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return n.dayPeriod(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(e, t, n) {
    if (t === "ho") {
      let r = e.getHours() % 12;
      return r === 0 && (r = 12), n.ordinalNumber(r, { unit: "hour" });
    }
    return We.h(e, t);
  },
  // Hour [0-23]
  H: function(e, t, n) {
    return t === "Ho" ? n.ordinalNumber(e.getHours(), { unit: "hour" }) : We.H(e, t);
  },
  // Hour [0-11]
  K: function(e, t, n) {
    const r = e.getHours() % 12;
    return t === "Ko" ? n.ordinalNumber(r, { unit: "hour" }) : G(r, t.length);
  },
  // Hour [1-24]
  k: function(e, t, n) {
    let r = e.getHours();
    return r === 0 && (r = 24), t === "ko" ? n.ordinalNumber(r, { unit: "hour" }) : G(r, t.length);
  },
  // Minute
  m: function(e, t, n) {
    return t === "mo" ? n.ordinalNumber(e.getMinutes(), { unit: "minute" }) : We.m(e, t);
  },
  // Second
  s: function(e, t, n) {
    return t === "so" ? n.ordinalNumber(e.getSeconds(), { unit: "second" }) : We.s(e, t);
  },
  // Fraction of second
  S: function(e, t) {
    return We.S(e, t);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(e, t, n) {
    const r = e.getTimezoneOffset();
    if (r === 0)
      return "Z";
    switch (t) {
      // Hours and optional minutes
      case "X":
        return un(r);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return Te(r);
      // Hours and minutes with `:` delimiter
      default:
        return Te(r, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(e, t, n) {
    const r = e.getTimezoneOffset();
    switch (t) {
      // Hours and optional minutes
      case "x":
        return un(r);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return Te(r);
      // Hours and minutes with `:` delimiter
      default:
        return Te(r, ":");
    }
  },
  // Timezone (GMT)
  O: function(e, t, n) {
    const r = e.getTimezoneOffset();
    switch (t) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + cn(r, ":");
      default:
        return "GMT" + Te(r, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(e, t, n) {
    const r = e.getTimezoneOffset();
    switch (t) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + cn(r, ":");
      default:
        return "GMT" + Te(r, ":");
    }
  },
  // Seconds timestamp
  t: function(e, t, n) {
    const r = Math.trunc(+e / 1e3);
    return G(r, t.length);
  },
  // Milliseconds timestamp
  T: function(e, t, n) {
    return G(+e, t.length);
  }
};
function cn(e, t = "") {
  const n = e > 0 ? "-" : "+", r = Math.abs(e), a = Math.trunc(r / 60), o = r % 60;
  return o === 0 ? n + String(a) : n + String(a) + t + G(o, 2);
}
function un(e, t) {
  return e % 60 === 0 ? (e > 0 ? "-" : "+") + G(Math.abs(e) / 60, 2) : Te(e, t);
}
function Te(e, t = "") {
  const n = e > 0 ? "-" : "+", r = Math.abs(e), a = G(Math.trunc(r / 60), 2), o = G(r % 60, 2);
  return n + a + t + o;
}
const dn = (e, t) => {
  switch (e) {
    case "P":
      return t.date({ width: "short" });
    case "PP":
      return t.date({ width: "medium" });
    case "PPP":
      return t.date({ width: "long" });
    default:
      return t.date({ width: "full" });
  }
}, zn = (e, t) => {
  switch (e) {
    case "p":
      return t.time({ width: "short" });
    case "pp":
      return t.time({ width: "medium" });
    case "ppp":
      return t.time({ width: "long" });
    default:
      return t.time({ width: "full" });
  }
}, ms = (e, t) => {
  const n = e.match(/(P+)(p+)?/) || [], r = n[1], a = n[2];
  if (!a)
    return dn(e, t);
  let o;
  switch (r) {
    case "P":
      o = t.dateTime({ width: "short" });
      break;
    case "PP":
      o = t.dateTime({ width: "medium" });
      break;
    case "PPP":
      o = t.dateTime({ width: "long" });
      break;
    default:
      o = t.dateTime({ width: "full" });
      break;
  }
  return o.replace("{{date}}", dn(r, t)).replace("{{time}}", zn(a, t));
}, ps = {
  p: zn,
  P: ms
}, gs = /^D+$/, ys = /^Y+$/, vs = ["D", "DD", "YY", "YYYY"];
function bs(e) {
  return gs.test(e);
}
function xs(e) {
  return ys.test(e);
}
function ws(e, t, n) {
  const r = ks(e, t, n);
  if (console.warn(r), vs.includes(e)) throw new RangeError(r);
}
function ks(e, t, n) {
  const r = e[0] === "Y" ? "years" : "days of the month";
  return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${r} to the input \`${n}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const Ms = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Ds = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Os = /^'([^]*?)'?$/, Ns = /''/g, Ss = /[a-zA-Z]/;
function Ze(e, t, n) {
  const r = ot(), a = n?.locale ?? r.locale ?? Be, o = n?.firstWeekContainsDate ?? n?.locale?.options?.firstWeekContainsDate ?? r.firstWeekContainsDate ?? r.locale?.options?.firstWeekContainsDate ?? 1, l = n?.weekStartsOn ?? n?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, s = K(e, n?.in);
  if (!Sa(s))
    throw new RangeError("Invalid time value");
  let i = t.match(Ds).map((u) => {
    const f = u[0];
    if (f === "p" || f === "P") {
      const h = ps[f];
      return h(u, a.formatLong);
    }
    return u;
  }).join("").match(Ms).map((u) => {
    if (u === "''")
      return { isToken: !1, value: "'" };
    const f = u[0];
    if (f === "'")
      return { isToken: !1, value: Cs(u) };
    if (ln[f])
      return { isToken: !0, value: u };
    if (f.match(Ss))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + f + "`"
      );
    return { isToken: !1, value: u };
  });
  a.localize.preprocessor && (i = a.localize.preprocessor(s, i));
  const c = {
    firstWeekContainsDate: o,
    weekStartsOn: l,
    locale: a
  };
  return i.map((u) => {
    if (!u.isToken) return u.value;
    const f = u.value;
    (!n?.useAdditionalWeekYearTokens && xs(f) || !n?.useAdditionalDayOfYearTokens && bs(f)) && ws(f, t, String(e));
    const h = ln[f[0]];
    return h(s, f, a.localize, c);
  }).join("");
}
function Cs(e) {
  const t = e.match(Os);
  return t ? t[1].replace(Ns, "'") : e;
}
function Ws(e, t) {
  const n = K(e, t?.in), r = n.getFullYear(), a = n.getMonth(), o = ee(n, 0);
  return o.setFullYear(r, a + 1, 0), o.setHours(0, 0, 0, 0), o.getDate();
}
function _s(e, t) {
  return K(e, t?.in).getMonth();
}
function js(e, t) {
  return K(e, t?.in).getFullYear();
}
function Fs(e, t) {
  return +K(e) > +K(t);
}
function Ts(e, t) {
  return +K(e) < +K(t);
}
function Es(e, t, n) {
  const [r, a] = Le(
    n?.in,
    e,
    t
  );
  return r.getFullYear() === a.getFullYear() && r.getMonth() === a.getMonth();
}
function Ps(e, t, n) {
  const [r, a] = Le(
    n?.in,
    e,
    t
  );
  return r.getFullYear() === a.getFullYear();
}
function Ys(e, t, n) {
  const r = K(e, n?.in), a = r.getFullYear(), o = r.getDate(), l = ee(e, 0);
  l.setFullYear(a, t, 15), l.setHours(0, 0, 0, 0);
  const s = Ws(l);
  return r.setMonth(t, Math.min(o, s)), r;
}
function Is(e, t, n) {
  const r = K(e, n?.in);
  return isNaN(+r) ? ee(e, NaN) : (r.setFullYear(t), r);
}
const fn = 5, zs = 4;
function Bs(e, t) {
  const n = t.startOfMonth(e), r = n.getDay() > 0 ? n.getDay() : 7, a = t.addDays(e, -r + 1), o = t.addDays(a, fn * 7 - 1);
  return t.getMonth(e) === t.getMonth(o) ? fn : zs;
}
function Bn(e, t) {
  const n = t.startOfMonth(e), r = n.getDay();
  return r === 1 ? n : r === 0 ? t.addDays(n, -6) : t.addDays(n, -1 * (r - 1));
}
function As(e, t) {
  const n = Bn(e, t), r = Bs(e, t);
  return t.addDays(n, r * 7 - 1);
}
const An = {
  ...Be,
  labels: {
    labelDayButton: (e, t, n, r) => {
      let a;
      r && typeof r.format == "function" ? a = r.format.bind(r) : a = (l, s) => Ze(l, s, { locale: Be, ...n });
      let o = a(e, "PPPP");
      return t.today && (o = `Today, ${o}`), t.selected && (o = `${o}, selected`), o;
    },
    labelMonthDropdown: "Choose the Month",
    labelNext: "Go to the Next Month",
    labelPrevious: "Go to the Previous Month",
    labelWeekNumber: (e) => `Week ${e}`,
    labelYearDropdown: "Choose the Year",
    labelGrid: (e, t, n) => {
      let r;
      return n && typeof n.format == "function" ? r = n.format.bind(n) : r = (a, o) => Ze(a, o, { locale: Be, ...t }), r(e, "LLLL yyyy");
    },
    labelGridcell: (e, t, n, r) => {
      let a;
      r && typeof r.format == "function" ? a = r.format.bind(r) : a = (l, s) => Ze(l, s, { locale: Be, ...n });
      let o = a(e, "PPPP");
      return t?.today && (o = `Today, ${o}`), o;
    },
    labelNav: "Navigation bar",
    labelWeekNumberHeader: "Week Number",
    labelWeekday: (e, t, n) => {
      let r;
      return n && typeof n.format == "function" ? r = n.format.bind(n) : r = (a, o) => Ze(a, o, { locale: Be, ...t }), r(e, "cccc");
    }
  }
};
class he {
  /**
   * Creates an instance of `DateLib`.
   *
   * @param options Configuration options for the date library.
   * @param overrides Custom overrides for the date library functions.
   */
  constructor(t, n) {
    this.Date = Date, this.today = () => this.overrides?.today ? this.overrides.today() : this.options.timeZone ? se.tz(this.options.timeZone) : new this.Date(), this.newDate = (r, a, o) => this.overrides?.newDate ? this.overrides.newDate(r, a, o) : this.options.timeZone ? new se(r, a, o, this.options.timeZone) : new Date(r, a, o), this.addDays = (r, a) => this.overrides?.addDays ? this.overrides.addDays(r, a) : Wn(r, a), this.addMonths = (r, a) => this.overrides?.addMonths ? this.overrides.addMonths(r, a) : _n(r, a), this.addWeeks = (r, a) => this.overrides?.addWeeks ? this.overrides.addWeeks(r, a) : ka(r, a), this.addYears = (r, a) => this.overrides?.addYears ? this.overrides.addYears(r, a) : Ma(r, a), this.differenceInCalendarDays = (r, a) => this.overrides?.differenceInCalendarDays ? this.overrides.differenceInCalendarDays(r, a) : Bt(r, a), this.differenceInCalendarMonths = (r, a) => this.overrides?.differenceInCalendarMonths ? this.overrides.differenceInCalendarMonths(r, a) : Tn(r, a), this.eachMonthOfInterval = (r) => this.overrides?.eachMonthOfInterval ? this.overrides.eachMonthOfInterval(r) : Wa(r), this.eachYearOfInterval = (r) => {
      const a = this.overrides?.eachYearOfInterval ? this.overrides.eachYearOfInterval(r) : Fa(r), o = new Set(a.map((s) => this.getYear(s)));
      if (o.size === a.length)
        return a;
      const l = [];
      return o.forEach((s) => {
        l.push(new Date(s, 0, 1));
      }), l;
    }, this.endOfBroadcastWeek = (r) => this.overrides?.endOfBroadcastWeek ? this.overrides.endOfBroadcastWeek(r) : As(r, this), this.endOfISOWeek = (r) => this.overrides?.endOfISOWeek ? this.overrides.endOfISOWeek(r) : Ta(r), this.endOfMonth = (r) => this.overrides?.endOfMonth ? this.overrides.endOfMonth(r) : Ca(r), this.endOfWeek = (r, a) => this.overrides?.endOfWeek ? this.overrides.endOfWeek(r, a) : Yn(r, this.options), this.endOfYear = (r) => this.overrides?.endOfYear ? this.overrides.endOfYear(r) : ja(r), this.format = (r, a, o) => {
      const l = this.overrides?.format ? this.overrides.format(r, a, this.options) : Ze(r, a, this.options);
      return this.options.numerals && this.options.numerals !== "latn" ? this.replaceDigits(l) : l;
    }, this.getISOWeek = (r) => this.overrides?.getISOWeek ? this.overrides.getISOWeek(r) : At(r), this.getMonth = (r, a) => this.overrides?.getMonth ? this.overrides.getMonth(r, this.options) : _s(r, this.options), this.getYear = (r, a) => this.overrides?.getYear ? this.overrides.getYear(r, this.options) : js(r, this.options), this.getWeek = (r, a) => this.overrides?.getWeek ? this.overrides.getWeek(r, this.options) : $t(r, this.options), this.isAfter = (r, a) => this.overrides?.isAfter ? this.overrides.isAfter(r, a) : Fs(r, a), this.isBefore = (r, a) => this.overrides?.isBefore ? this.overrides.isBefore(r, a) : Ts(r, a), this.isDate = (r) => this.overrides?.isDate ? this.overrides.isDate(r) : Fn(r), this.isSameDay = (r, a) => this.overrides?.isSameDay ? this.overrides.isSameDay(r, a) : Na(r, a), this.isSameMonth = (r, a) => this.overrides?.isSameMonth ? this.overrides.isSameMonth(r, a) : Es(r, a), this.isSameYear = (r, a) => this.overrides?.isSameYear ? this.overrides.isSameYear(r, a) : Ps(r, a), this.max = (r) => this.overrides?.max ? this.overrides.max(r) : Da(r), this.min = (r) => this.overrides?.min ? this.overrides.min(r) : Oa(r), this.setMonth = (r, a) => this.overrides?.setMonth ? this.overrides.setMonth(r, a) : Ys(r, a), this.setYear = (r, a) => this.overrides?.setYear ? this.overrides.setYear(r, a) : Is(r, a), this.startOfBroadcastWeek = (r, a) => this.overrides?.startOfBroadcastWeek ? this.overrides.startOfBroadcastWeek(r, this) : Bn(r, this), this.startOfDay = (r) => this.overrides?.startOfDay ? this.overrides.startOfDay(r) : rt(r), this.startOfISOWeek = (r) => this.overrides?.startOfISOWeek ? this.overrides.startOfISOWeek(r) : nt(r), this.startOfMonth = (r) => this.overrides?.startOfMonth ? this.overrides.startOfMonth(r) : _a(r), this.startOfWeek = (r, a) => this.overrides?.startOfWeek ? this.overrides.startOfWeek(r, this.options) : Re(r, this.options), this.startOfYear = (r) => this.overrides?.startOfYear ? this.overrides.startOfYear(r) : Pn(r), this.options = { locale: An, ...t }, this.overrides = n;
  }
  /**
   * Generates a mapping of Arabic digits (0-9) to the target numbering system
   * digits.
   *
   * @since 9.5.0
   * @returns A record mapping Arabic digits to the target numerals.
   */
  getDigitMap() {
    const { numerals: t = "latn" } = this.options, n = new Intl.NumberFormat("en-US", {
      numberingSystem: t
    }), r = {};
    for (let a = 0; a < 10; a++)
      r[a.toString()] = n.format(a);
    return r;
  }
  /**
   * Replaces Arabic digits in a string with the target numbering system digits.
   *
   * @since 9.5.0
   * @param input The string containing Arabic digits.
   * @returns The string with digits replaced.
   */
  replaceDigits(t) {
    const n = this.getDigitMap();
    return t.replace(/\d/g, (r) => n[r] || r);
  }
  /**
   * Formats a number using the configured numbering system.
   *
   * @since 9.5.0
   * @param value The number to format.
   * @returns The formatted number as a string.
   */
  formatNumber(t) {
    return this.replaceDigits(t.toString());
  }
  /**
   * Returns the preferred ordering for month and year labels for the current
   * locale.
   */
  getMonthYearOrder() {
    const t = this.options.locale?.code;
    return t && he.yearFirstLocales.has(t) ? "year-first" : "month-first";
  }
  /**
   * Formats the month/year pair respecting locale conventions.
   *
   * @since 9.11.0
   */
  formatMonthYear(t) {
    const { locale: n, timeZone: r, numerals: a } = this.options, o = n?.code;
    if (o && he.yearFirstLocales.has(o))
      try {
        return new Intl.DateTimeFormat(o, {
          month: "long",
          year: "numeric",
          timeZone: r,
          numberingSystem: a
        }).format(t);
      } catch {
      }
    const l = this.getMonthYearOrder() === "year-first" ? "y LLLL" : "LLLL y";
    return this.format(t, l);
  }
}
he.yearFirstLocales = /* @__PURE__ */ new Set([
  "eu",
  "hu",
  "ja",
  "ja-Hira",
  "ja-JP",
  "ko",
  "ko-KR",
  "lt",
  "lt-LT",
  "lv",
  "lv-LV",
  "mn",
  "mn-MN",
  "zh",
  "zh-CN",
  "zh-HK",
  "zh-TW"
]);
const De = new he();
class $n {
  constructor(t, n, r = De) {
    this.date = t, this.displayMonth = n, this.outside = !!(n && !r.isSameMonth(t, n)), this.dateLib = r, this.isoDate = r.format(t, "yyyy-MM-dd"), this.displayMonthId = r.format(n, "yyyy-MM"), this.dateMonthId = r.format(t, "yyyy-MM");
  }
  /**
   * Checks if this day is equal to another `CalendarDay`, considering both the
   * date and the displayed month.
   *
   * @param day The `CalendarDay` to compare with.
   * @returns `true` if the days are equal, otherwise `false`.
   */
  isEqualTo(t) {
    return this.dateLib.isSameDay(t.date, this.date) && this.dateLib.isSameMonth(t.displayMonth, this.displayMonth);
  }
}
class $s {
  constructor(t, n) {
    this.date = t, this.weeks = n;
  }
}
class Vs {
  constructor(t, n) {
    this.days = n, this.weekNumber = t;
  }
}
function qs(e) {
  return M.createElement("button", { ...e });
}
function Hs(e) {
  return M.createElement("span", { ...e });
}
function Rs(e) {
  const { size: t = 24, orientation: n = "left", className: r } = e;
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: handled by the parent component
    M.createElement(
      "svg",
      { className: r, width: t, height: t, viewBox: "0 0 24 24" },
      n === "up" && M.createElement("polygon", { points: "6.77 17 12.5 11.43 18.24 17 20 15.28 12.5 8 5 15.28" }),
      n === "down" && M.createElement("polygon", { points: "6.77 8 12.5 13.57 18.24 8 20 9.72 12.5 17 5 9.72" }),
      n === "left" && M.createElement("polygon", { points: "16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20" }),
      n === "right" && M.createElement("polygon", { points: "8 18.112 14.18888889 12 8 5.87733333 9.91111111 4 18 12 9.91111111 20" })
    )
  );
}
function Gs(e) {
  const { day: t, modifiers: n, ...r } = e;
  return M.createElement("td", { ...r });
}
function Ls(e) {
  const { day: t, modifiers: n, ...r } = e, a = M.useRef(null);
  return M.useEffect(() => {
    n.focused && a.current?.focus();
  }, [n.focused]), M.createElement("button", { ref: a, ...r });
}
var j;
(function(e) {
  e.Root = "root", e.Chevron = "chevron", e.Day = "day", e.DayButton = "day_button", e.CaptionLabel = "caption_label", e.Dropdowns = "dropdowns", e.Dropdown = "dropdown", e.DropdownRoot = "dropdown_root", e.Footer = "footer", e.MonthGrid = "month_grid", e.MonthCaption = "month_caption", e.MonthsDropdown = "months_dropdown", e.Month = "month", e.Months = "months", e.Nav = "nav", e.NextMonthButton = "button_next", e.PreviousMonthButton = "button_previous", e.Week = "week", e.Weeks = "weeks", e.Weekday = "weekday", e.Weekdays = "weekdays", e.WeekNumber = "week_number", e.WeekNumberHeader = "week_number_header", e.YearsDropdown = "years_dropdown";
})(j || (j = {}));
var Q;
(function(e) {
  e.disabled = "disabled", e.hidden = "hidden", e.outside = "outside", e.focused = "focused", e.today = "today";
})(Q || (Q = {}));
var ve;
(function(e) {
  e.range_end = "range_end", e.range_middle = "range_middle", e.range_start = "range_start", e.selected = "selected";
})(ve || (ve = {}));
var fe;
(function(e) {
  e.weeks_before_enter = "weeks_before_enter", e.weeks_before_exit = "weeks_before_exit", e.weeks_after_enter = "weeks_after_enter", e.weeks_after_exit = "weeks_after_exit", e.caption_after_enter = "caption_after_enter", e.caption_after_exit = "caption_after_exit", e.caption_before_enter = "caption_before_enter", e.caption_before_exit = "caption_before_exit";
})(fe || (fe = {}));
function Ks(e) {
  const { options: t, className: n, components: r, classNames: a, ...o } = e, l = [a[j.Dropdown], n].join(" "), s = t?.find(({ value: i }) => i === o.value);
  return M.createElement(
    "span",
    { "data-disabled": o.disabled, className: a[j.DropdownRoot] },
    M.createElement(r.Select, { className: l, ...o }, t?.map(({ value: i, label: c, disabled: u }) => M.createElement(r.Option, { key: i, value: i, disabled: u }, c))),
    M.createElement(
      "span",
      { className: a[j.CaptionLabel], "aria-hidden": !0 },
      s?.label,
      M.createElement(r.Chevron, { orientation: "down", size: 18, className: a[j.Chevron] })
    )
  );
}
function Us(e) {
  return M.createElement("div", { ...e });
}
function Xs(e) {
  return M.createElement("div", { ...e });
}
function Qs(e) {
  const { calendarMonth: t, displayIndex: n, ...r } = e;
  return M.createElement("div", { ...r }, e.children);
}
function Zs(e) {
  const { calendarMonth: t, displayIndex: n, ...r } = e;
  return M.createElement("div", { ...r });
}
function Js(e) {
  return M.createElement("table", { ...e });
}
function eo(e) {
  return M.createElement("div", { ...e });
}
const Vn = at(void 0);
function it() {
  const e = st(Vn);
  if (e === void 0)
    throw new Error("useDayPicker() must be used within a custom component.");
  return e;
}
function to(e) {
  const { components: t } = it();
  return M.createElement(t.Dropdown, { ...e });
}
function no(e) {
  const { onPreviousClick: t, onNextClick: n, previousMonth: r, nextMonth: a, ...o } = e, { components: l, classNames: s, labels: { labelPrevious: i, labelNext: c } } = it(), u = ne((h) => {
    a && n?.(h);
  }, [a, n]), f = ne((h) => {
    r && t?.(h);
  }, [r, t]);
  return M.createElement(
    "nav",
    { ...o },
    M.createElement(
      l.PreviousMonthButton,
      { type: "button", className: s[j.PreviousMonthButton], tabIndex: r ? void 0 : -1, "aria-disabled": r ? void 0 : !0, "aria-label": i(r), onClick: f },
      M.createElement(l.Chevron, { disabled: r ? void 0 : !0, className: s[j.Chevron], orientation: "left" })
    ),
    M.createElement(
      l.NextMonthButton,
      { type: "button", className: s[j.NextMonthButton], tabIndex: a ? void 0 : -1, "aria-disabled": a ? void 0 : !0, "aria-label": c(a), onClick: u },
      M.createElement(l.Chevron, { disabled: a ? void 0 : !0, orientation: "right", className: s[j.Chevron] })
    )
  );
}
function ro(e) {
  const { components: t } = it();
  return M.createElement(t.Button, { ...e });
}
function ao(e) {
  return M.createElement("option", { ...e });
}
function so(e) {
  const { components: t } = it();
  return M.createElement(t.Button, { ...e });
}
function oo(e) {
  const { rootRef: t, ...n } = e;
  return M.createElement("div", { ...n, ref: t });
}
function io(e) {
  return M.createElement("select", { ...e });
}
function lo(e) {
  const { week: t, ...n } = e;
  return M.createElement("tr", { ...n });
}
function co(e) {
  return M.createElement("th", { ...e });
}
function uo(e) {
  return M.createElement(
    "thead",
    { "aria-hidden": !0 },
    M.createElement("tr", { ...e })
  );
}
function fo(e) {
  const { week: t, ...n } = e;
  return M.createElement("th", { ...n });
}
function ho(e) {
  return M.createElement("th", { ...e });
}
function mo(e) {
  return M.createElement("tbody", { ...e });
}
function po(e) {
  const { components: t } = it();
  return M.createElement(t.Dropdown, { ...e });
}
const go = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Button: qs,
  CaptionLabel: Hs,
  Chevron: Rs,
  Day: Gs,
  DayButton: Ls,
  Dropdown: Ks,
  DropdownNav: Us,
  Footer: Xs,
  Month: Qs,
  MonthCaption: Zs,
  MonthGrid: Js,
  Months: eo,
  MonthsDropdown: to,
  Nav: no,
  NextMonthButton: ro,
  Option: ao,
  PreviousMonthButton: so,
  Root: oo,
  Select: io,
  Week: lo,
  WeekNumber: fo,
  WeekNumberHeader: ho,
  Weekday: co,
  Weekdays: uo,
  Weeks: mo,
  YearsDropdown: po
}, Symbol.toStringTag, { value: "Module" }));
function Ne(e, t, n = !1, r = De) {
  let { from: a, to: o } = e;
  const { differenceInCalendarDays: l, isSameDay: s } = r;
  return a && o ? (l(o, a) < 0 && ([a, o] = [o, a]), l(t, a) >= (n ? 1 : 0) && l(o, t) >= (n ? 1 : 0)) : !n && o ? s(o, t) : !n && a ? s(a, t) : !1;
}
function Vt(e) {
  return !!(e && typeof e == "object" && "before" in e && "after" in e);
}
function yt(e) {
  return !!(e && typeof e == "object" && "from" in e);
}
function qt(e) {
  return !!(e && typeof e == "object" && "after" in e);
}
function Ht(e) {
  return !!(e && typeof e == "object" && "before" in e);
}
function qn(e) {
  return !!(e && typeof e == "object" && "dayOfWeek" in e);
}
function Hn(e, t) {
  return Array.isArray(e) && e.every(t.isDate);
}
function Se(e, t, n = De) {
  const r = Array.isArray(t) ? t : [t], { isSameDay: a, differenceInCalendarDays: o, isAfter: l } = n;
  return r.some((s) => {
    if (typeof s == "boolean")
      return s;
    if (n.isDate(s))
      return a(e, s);
    if (Hn(s, n))
      return s.some((i) => a(e, i));
    if (yt(s))
      return Ne(s, e, !1, n);
    if (qn(s))
      return Array.isArray(s.dayOfWeek) ? s.dayOfWeek.includes(e.getDay()) : s.dayOfWeek === e.getDay();
    if (Vt(s)) {
      const i = o(s.before, e), c = o(s.after, e), u = i > 0, f = c < 0;
      return l(s.before, s.after) ? f && u : u || f;
    }
    return qt(s) ? o(e, s.after) > 0 : Ht(s) ? o(s.before, e) > 0 : typeof s == "function" ? s(e) : !1;
  });
}
function yo(e, t, n, r, a) {
  const { disabled: o, hidden: l, modifiers: s, showOutsideDays: i, broadcastCalendar: c, today: u = a.today() } = t, { isSameDay: f, isSameMonth: h, startOfMonth: p, isBefore: y, endOfMonth: S, isAfter: C } = a, O = n && p(n), D = r && S(r), v = {
    [Q.focused]: [],
    [Q.outside]: [],
    [Q.disabled]: [],
    [Q.hidden]: [],
    [Q.today]: []
  }, k = {};
  for (const b of e) {
    const { date: m, displayMonth: F } = b, B = !!(F && !h(m, F)), $ = !!(O && y(m, O)), N = !!(D && C(m, D)), z = !!(o && Se(m, o, a)), X = !!(l && Se(m, l, a)) || $ || N || // Broadcast calendar will show outside days as default
    !c && !i && B || c && i === !1 && B, U = f(m, u);
    B && v.outside.push(b), z && v.disabled.push(b), X && v.hidden.push(b), U && v.today.push(b), s && Object.keys(s).forEach((L) => {
      const ie = s?.[L];
      ie && Se(m, ie, a) && (k[L] ? k[L].push(b) : k[L] = [b]);
    });
  }
  return (b) => {
    const m = {
      [Q.focused]: !1,
      [Q.disabled]: !1,
      [Q.hidden]: !1,
      [Q.outside]: !1,
      [Q.today]: !1
    }, F = {};
    for (const B in v) {
      const $ = v[B];
      m[B] = $.some((N) => N === b);
    }
    for (const B in k)
      F[B] = k[B].some(($) => $ === b);
    return {
      ...m,
      // custom modifiers should override all the previous ones
      ...F
    };
  };
}
function vo(e, t, n = {}) {
  return Object.entries(e).filter(([, a]) => a === !0).reduce((a, [o]) => (n[o] ? a.push(n[o]) : t[Q[o]] ? a.push(t[Q[o]]) : t[ve[o]] && a.push(t[ve[o]]), a), [t[j.Day]]);
}
function bo(e) {
  return {
    ...go,
    ...e
  };
}
function xo(e) {
  const t = {
    "data-mode": e.mode ?? void 0,
    "data-required": "required" in e ? e.required : void 0,
    "data-multiple-months": e.numberOfMonths && e.numberOfMonths > 1 || void 0,
    "data-week-numbers": e.showWeekNumber || void 0,
    "data-broadcast-calendar": e.broadcastCalendar || void 0,
    "data-nav-layout": e.navLayout || void 0
  };
  return Object.entries(e).forEach(([n, r]) => {
    n.startsWith("data-") && (t[n] = r);
  }), t;
}
function Rt() {
  const e = {};
  for (const t in j)
    e[j[t]] = `rdp-${j[t]}`;
  for (const t in Q)
    e[Q[t]] = `rdp-${Q[t]}`;
  for (const t in ve)
    e[ve[t]] = `rdp-${ve[t]}`;
  for (const t in fe)
    e[fe[t]] = `rdp-${fe[t]}`;
  return e;
}
function Rn(e, t, n) {
  return (n ?? new he(t)).formatMonthYear(e);
}
const wo = Rn;
function ko(e, t, n) {
  return (n ?? new he(t)).format(e, "d");
}
function Mo(e, t = De) {
  return t.format(e, "LLLL");
}
function Do(e, t, n) {
  return (n ?? new he(t)).format(e, "cccccc");
}
function Oo(e, t = De) {
  return e < 10 ? t.formatNumber(`0${e.toLocaleString()}`) : t.formatNumber(`${e.toLocaleString()}`);
}
function No() {
  return "";
}
function Gn(e, t = De) {
  return t.format(e, "yyyy");
}
const So = Gn, Co = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  formatCaption: Rn,
  formatDay: ko,
  formatMonthCaption: wo,
  formatMonthDropdown: Mo,
  formatWeekNumber: Oo,
  formatWeekNumberHeader: No,
  formatWeekdayName: Do,
  formatYearCaption: So,
  formatYearDropdown: Gn
}, Symbol.toStringTag, { value: "Module" }));
function Wo(e) {
  return e?.formatMonthCaption && !e.formatCaption && (e.formatCaption = e.formatMonthCaption), e?.formatYearCaption && !e.formatYearDropdown && (e.formatYearDropdown = e.formatYearCaption), {
    ...Co,
    ...e
  };
}
function Gt(e, t, n, r) {
  let a = (r ?? new he(n)).format(e, "PPPP");
  return t.today && (a = `Today, ${a}`), t.selected && (a = `${a}, selected`), a;
}
const _o = Gt;
function Lt(e, t, n) {
  return (n ?? new he(t)).formatMonthYear(e);
}
const jo = Lt;
function Ln(e, t, n, r) {
  let a = (r ?? new he(n)).format(e, "PPPP");
  return t?.today && (a = `Today, ${a}`), a;
}
function Kn(e) {
  return "Choose the Month";
}
function Un() {
  return "";
}
const Fo = "Go to the Next Month";
function Xn(e, t) {
  return Fo;
}
function Qn(e) {
  return "Go to the Previous Month";
}
function Zn(e, t, n) {
  return (n ?? new he(t)).format(e, "cccc");
}
function Jn(e, t) {
  return `Week ${e}`;
}
function er(e) {
  return "Week Number";
}
function tr(e) {
  return "Choose the Year";
}
const To = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  labelCaption: jo,
  labelDay: _o,
  labelDayButton: Gt,
  labelGrid: Lt,
  labelGridcell: Ln,
  labelMonthDropdown: Kn,
  labelNav: Un,
  labelNext: Xn,
  labelPrevious: Qn,
  labelWeekNumber: Jn,
  labelWeekNumberHeader: er,
  labelWeekday: Zn,
  labelYearDropdown: tr
}, Symbol.toStringTag, { value: "Module" })), ye = (e, t, n) => t || (n ? typeof n == "function" ? n : (...r) => n : e);
function Eo(e, t) {
  const n = t.locale?.labels ?? {};
  return {
    ...To,
    ...e ?? {},
    labelDayButton: ye(Gt, e?.labelDayButton, n.labelDayButton),
    labelMonthDropdown: ye(Kn, e?.labelMonthDropdown, n.labelMonthDropdown),
    labelNext: ye(Xn, e?.labelNext, n.labelNext),
    labelPrevious: ye(Qn, e?.labelPrevious, n.labelPrevious),
    labelWeekNumber: ye(Jn, e?.labelWeekNumber, n.labelWeekNumber),
    labelYearDropdown: ye(tr, e?.labelYearDropdown, n.labelYearDropdown),
    labelGrid: ye(Lt, e?.labelGrid, n.labelGrid),
    labelGridcell: ye(Ln, e?.labelGridcell, n.labelGridcell),
    labelNav: ye(Un, e?.labelNav, n.labelNav),
    labelWeekNumberHeader: ye(er, e?.labelWeekNumberHeader, n.labelWeekNumberHeader),
    labelWeekday: ye(Zn, e?.labelWeekday, n.labelWeekday)
  };
}
function Po(e, t, n, r, a) {
  const { startOfMonth: o, startOfYear: l, endOfYear: s, eachMonthOfInterval: i, getMonth: c } = a;
  return i({
    start: l(e),
    end: s(e)
  }).map((h) => {
    const p = r.formatMonthDropdown(h, a), y = c(h), S = t && h < o(t) || n && h > o(n) || !1;
    return { value: y, label: p, disabled: S };
  });
}
function Yo(e, t = {}, n = {}) {
  let r = { ...t?.[j.Day] };
  return Object.entries(e).filter(([, a]) => a === !0).forEach(([a]) => {
    r = {
      ...r,
      ...n?.[a]
    };
  }), r;
}
function Io(e, t, n, r) {
  const a = r ?? e.today(), o = n ? e.startOfBroadcastWeek(a, e) : t ? e.startOfISOWeek(a) : e.startOfWeek(a), l = [];
  for (let s = 0; s < 7; s++) {
    const i = e.addDays(o, s);
    l.push(i);
  }
  return l;
}
function zo(e, t, n, r, a = !1) {
  if (!e || !t)
    return;
  const { startOfYear: o, endOfYear: l, eachYearOfInterval: s, getYear: i } = r, c = o(e), u = l(t), f = s({ start: c, end: u });
  return a && f.reverse(), f.map((h) => {
    const p = n.formatYearDropdown(h, r);
    return {
      value: i(h),
      label: p,
      disabled: !1
    };
  });
}
function Bo(e, t = {}) {
  const { weekStartsOn: n, locale: r } = t, a = n ?? r?.options?.weekStartsOn ?? 0, o = (s) => {
    const i = typeof s == "number" || typeof s == "string" ? new Date(s) : s;
    return new se(i.getFullYear(), i.getMonth(), i.getDate(), 12, 0, 0, e);
  }, l = (s) => {
    const i = o(s);
    return new Date(i.getFullYear(), i.getMonth(), i.getDate(), 0, 0, 0, 0);
  };
  return {
    today: () => o(se.tz(e)),
    newDate: (s, i, c) => new se(s, i, c, 12, 0, 0, e),
    startOfDay: (s) => o(s),
    startOfWeek: (s, i) => {
      const c = o(s), u = i?.weekStartsOn ?? a, f = (c.getDay() - u + 7) % 7;
      return c.setDate(c.getDate() - f), c;
    },
    startOfISOWeek: (s) => {
      const i = o(s), c = (i.getDay() - 1 + 7) % 7;
      return i.setDate(i.getDate() - c), i;
    },
    startOfMonth: (s) => {
      const i = o(s);
      return i.setDate(1), i;
    },
    startOfYear: (s) => {
      const i = o(s);
      return i.setMonth(0, 1), i;
    },
    endOfWeek: (s, i) => {
      const c = o(s), h = (((i?.weekStartsOn ?? a) + 6) % 7 - c.getDay() + 7) % 7;
      return c.setDate(c.getDate() + h), c;
    },
    endOfISOWeek: (s) => {
      const i = o(s), c = (7 - i.getDay()) % 7;
      return i.setDate(i.getDate() + c), i;
    },
    endOfMonth: (s) => {
      const i = o(s);
      return i.setMonth(i.getMonth() + 1, 0), i;
    },
    endOfYear: (s) => {
      const i = o(s);
      return i.setMonth(11, 31), i;
    },
    eachMonthOfInterval: (s) => {
      const i = o(s.start), c = o(s.end), u = [], f = new se(i.getFullYear(), i.getMonth(), 1, 12, 0, 0, e), h = c.getFullYear() * 12 + c.getMonth();
      for (; f.getFullYear() * 12 + f.getMonth() <= h; )
        u.push(new se(f, e)), f.setMonth(f.getMonth() + 1, 1);
      return u;
    },
    // Normalize to noon once before arithmetic (avoid DST/midnight edge cases),
    // mutate the same TZDate, and return it.
    addDays: (s, i) => {
      const c = o(s);
      return c.setDate(c.getDate() + i), c;
    },
    addWeeks: (s, i) => {
      const c = o(s);
      return c.setDate(c.getDate() + i * 7), c;
    },
    addMonths: (s, i) => {
      const c = o(s);
      return c.setMonth(c.getMonth() + i), c;
    },
    addYears: (s, i) => {
      const c = o(s);
      return c.setFullYear(c.getFullYear() + i), c;
    },
    eachYearOfInterval: (s) => {
      const i = o(s.start), c = o(s.end), u = [], f = new se(i.getFullYear(), 0, 1, 12, 0, 0, e);
      for (; f.getFullYear() <= c.getFullYear(); )
        u.push(new se(f, e)), f.setFullYear(f.getFullYear() + 1, 0, 1);
      return u;
    },
    getWeek: (s, i) => {
      const c = l(s);
      return $t(c, {
        weekStartsOn: i?.weekStartsOn ?? a,
        firstWeekContainsDate: i?.firstWeekContainsDate ?? r?.options?.firstWeekContainsDate ?? 1
      });
    },
    getISOWeek: (s) => {
      const i = l(s);
      return At(i);
    },
    differenceInCalendarDays: (s, i) => {
      const c = l(s), u = l(i);
      return Bt(c, u);
    },
    differenceInCalendarMonths: (s, i) => {
      const c = l(s), u = l(i);
      return Tn(c, u);
    }
  };
}
const lt = (e) => e instanceof HTMLElement ? e : null, Nt = (e) => [
  ...e.querySelectorAll("[data-animated-month]") ?? []
], Ao = (e) => lt(e.querySelector("[data-animated-month]")), St = (e) => lt(e.querySelector("[data-animated-caption]")), Ct = (e) => lt(e.querySelector("[data-animated-weeks]")), $o = (e) => lt(e.querySelector("[data-animated-nav]")), Vo = (e) => lt(e.querySelector("[data-animated-weekdays]"));
function qo(e, t, { classNames: n, months: r, focused: a, dateLib: o }) {
  const l = re(null), s = re(r), i = re(!1);
  On(() => {
    const c = s.current;
    if (s.current = r, !t || !e.current || // safety check because the ref can be set to anything by consumers
    !(e.current instanceof HTMLElement) || // validation required for the animation to work as expected
    r.length === 0 || c.length === 0 || r.length !== c.length)
      return;
    const u = o.isSameMonth(r[0].date, c[0].date), f = o.isAfter(r[0].date, c[0].date), h = f ? n[fe.caption_after_enter] : n[fe.caption_before_enter], p = f ? n[fe.weeks_after_enter] : n[fe.weeks_before_enter], y = l.current, S = e.current.cloneNode(!0);
    if (S instanceof HTMLElement ? (Nt(S).forEach((v) => {
      if (!(v instanceof HTMLElement))
        return;
      const k = Ao(v);
      k && v.contains(k) && v.removeChild(k);
      const b = St(v);
      b && b.classList.remove(h);
      const m = Ct(v);
      m && m.classList.remove(p);
    }), l.current = S) : l.current = null, i.current || u || // skip animation if a day is focused because it can cause issues to the animation and is better for a11y
    a)
      return;
    const C = y instanceof HTMLElement ? Nt(y) : [], O = Nt(e.current);
    if (O?.every((D) => D instanceof HTMLElement) && C && C.every((D) => D instanceof HTMLElement)) {
      i.current = !0, e.current.style.isolation = "isolate";
      const D = $o(e.current);
      D && (D.style.zIndex = "1"), O.forEach((v, k) => {
        const b = C[k];
        if (!b)
          return;
        v.style.position = "relative", v.style.overflow = "hidden";
        const m = St(v);
        m && m.classList.add(h);
        const F = Ct(v);
        F && F.classList.add(p);
        const B = () => {
          i.current = !1, e.current && (e.current.style.isolation = ""), D && (D.style.zIndex = ""), m && m.classList.remove(h), F && F.classList.remove(p), v.style.position = "", v.style.overflow = "", v.contains(b) && v.removeChild(b);
        };
        b.style.pointerEvents = "none", b.style.position = "absolute", b.style.overflow = "hidden", b.setAttribute("aria-hidden", "true");
        const $ = Vo(b);
        $ && ($.style.opacity = "0");
        const N = St(b);
        N && (N.classList.add(f ? n[fe.caption_before_exit] : n[fe.caption_after_exit]), N.addEventListener("animationend", B));
        const z = Ct(b);
        z && z.classList.add(f ? n[fe.weeks_before_exit] : n[fe.weeks_after_exit]), v.insertBefore(b, v.firstChild);
      });
    }
  });
}
function Ho(e, t, n, r) {
  const a = e[0], o = e[e.length - 1], { ISOWeek: l, fixedWeeks: s, broadcastCalendar: i } = n ?? {}, { addDays: c, differenceInCalendarDays: u, differenceInCalendarMonths: f, endOfBroadcastWeek: h, endOfISOWeek: p, endOfMonth: y, endOfWeek: S, isAfter: C, startOfBroadcastWeek: O, startOfISOWeek: D, startOfWeek: v } = r, k = i ? O(a, r) : l ? D(a) : v(a), b = i ? h(o) : l ? p(y(o)) : S(y(o)), m = t && (i ? h(t) : l ? p(t) : S(t)), F = m && C(b, m) ? m : b, B = u(F, k), $ = f(o, a) + 1, N = [];
  for (let U = 0; U <= B; U++) {
    const L = c(k, U);
    N.push(L);
  }
  const X = (i ? 35 : 42) * $;
  if (s && N.length < X) {
    const U = X - N.length;
    for (let L = 0; L < U; L++) {
      const ie = c(N[N.length - 1], 1);
      N.push(ie);
    }
  }
  return N;
}
function Ro(e) {
  const t = [];
  return e.reduce((n, r) => {
    const a = r.weeks.reduce((o, l) => o.concat(l.days.slice()), t.slice());
    return n.concat(a.slice());
  }, t.slice());
}
function Go(e, t, n, r) {
  const { numberOfMonths: a = 1 } = n, o = [];
  for (let l = 0; l < a; l++) {
    const s = r.addMonths(e, l);
    if (t && s > t)
      break;
    o.push(s);
  }
  return o;
}
function hn(e, t, n, r) {
  const { month: a, defaultMonth: o, today: l = r.today(), numberOfMonths: s = 1 } = e;
  let i = a || o || l;
  const { differenceInCalendarMonths: c, addMonths: u, startOfMonth: f } = r;
  if (n && c(n, i) < s - 1) {
    const h = -1 * (s - 1);
    i = u(n, h);
  }
  return t && c(i, t) < 0 && (i = t), f(i);
}
function Lo(e, t, n, r) {
  const { addDays: a, endOfBroadcastWeek: o, endOfISOWeek: l, endOfMonth: s, endOfWeek: i, getISOWeek: c, getWeek: u, startOfBroadcastWeek: f, startOfISOWeek: h, startOfWeek: p } = r, y = e.reduce((S, C) => {
    const O = n.broadcastCalendar ? f(C, r) : n.ISOWeek ? h(C) : p(C), D = n.broadcastCalendar ? o(C) : n.ISOWeek ? l(s(C)) : i(s(C)), v = t.filter((F) => F >= O && F <= D), k = n.broadcastCalendar ? 35 : 42;
    if (n.fixedWeeks && v.length < k) {
      const F = t.filter((B) => {
        const $ = k - v.length;
        return B > D && B <= a(D, $);
      });
      v.push(...F);
    }
    const b = v.reduce((F, B) => {
      const $ = n.ISOWeek ? c(B) : u(B), N = F.find((X) => X.weekNumber === $), z = new $n(B, C, r);
      return N ? N.days.push(z) : F.push(new Vs($, [z])), F;
    }, []), m = new $s(C, b);
    return S.push(m), S;
  }, []);
  return n.reverseMonths ? y.reverse() : y;
}
function Ko(e, t) {
  let { startMonth: n, endMonth: r } = e;
  const { startOfYear: a, startOfDay: o, startOfMonth: l, endOfMonth: s, addYears: i, endOfYear: c, newDate: u, today: f } = t, { fromYear: h, toYear: p, fromMonth: y, toMonth: S } = e;
  !n && y && (n = y), !n && h && (n = t.newDate(h, 0, 1)), !r && S && (r = S), !r && p && (r = u(p, 11, 31));
  const C = e.captionLayout === "dropdown" || e.captionLayout === "dropdown-years";
  return n ? n = l(n) : h ? n = u(h, 0, 1) : !n && C && (n = a(i(e.today ?? f(), -100))), r ? r = s(r) : p ? r = u(p, 11, 31) : !r && C && (r = c(e.today ?? f())), [
    n && o(n),
    r && o(r)
  ];
}
function Uo(e, t, n, r) {
  if (n.disableNavigation)
    return;
  const { pagedNavigation: a, numberOfMonths: o = 1 } = n, { startOfMonth: l, addMonths: s, differenceInCalendarMonths: i } = r, c = a ? o : 1, u = l(e);
  if (!t)
    return s(u, c);
  if (!(i(t, e) < o))
    return s(u, c);
}
function Xo(e, t, n, r) {
  if (n.disableNavigation)
    return;
  const { pagedNavigation: a, numberOfMonths: o } = n, { startOfMonth: l, addMonths: s, differenceInCalendarMonths: i } = r, c = a ? o ?? 1 : 1, u = l(e);
  if (!t)
    return s(u, -c);
  if (!(i(u, t) <= 0))
    return s(u, -c);
}
function Qo(e) {
  const t = [];
  return e.reduce((n, r) => n.concat(r.weeks.slice()), t.slice());
}
function vt(e, t) {
  const [n, r] = ae(e);
  return [t === void 0 ? n : t, r];
}
function Zo(e, t) {
  const [n, r] = Ko(e, t), { startOfMonth: a, endOfMonth: o } = t, l = hn(e, n, r, t), [s, i] = vt(
    l,
    // initialMonth is always computed from props.month if provided
    e.month ? l : void 0
  );
  ue(() => {
    const k = hn(e, n, r, t);
    i(k);
  }, [e.timeZone]);
  const { months: c, weeks: u, days: f, previousMonth: h, nextMonth: p } = oe(() => {
    const k = Go(s, r, { numberOfMonths: e.numberOfMonths }, t), b = Ho(k, e.endMonth ? o(e.endMonth) : void 0, {
      ISOWeek: e.ISOWeek,
      fixedWeeks: e.fixedWeeks,
      broadcastCalendar: e.broadcastCalendar
    }, t), m = Lo(k, b, {
      broadcastCalendar: e.broadcastCalendar,
      fixedWeeks: e.fixedWeeks,
      ISOWeek: e.ISOWeek,
      reverseMonths: e.reverseMonths
    }, t), F = Qo(m), B = Ro(m), $ = Xo(s, n, e, t), N = Uo(s, r, e, t);
    return {
      months: m,
      weeks: F,
      days: B,
      previousMonth: $,
      nextMonth: N
    };
  }, [
    t,
    s.getTime(),
    r?.getTime(),
    n?.getTime(),
    e.disableNavigation,
    e.broadcastCalendar,
    e.endMonth?.getTime(),
    e.fixedWeeks,
    e.ISOWeek,
    e.numberOfMonths,
    e.pagedNavigation,
    e.reverseMonths
  ]), { disableNavigation: y, onMonthChange: S } = e, C = (k) => u.some((b) => b.days.some((m) => m.isEqualTo(k))), O = (k) => {
    if (y)
      return;
    let b = a(k);
    n && b < a(n) && (b = a(n)), r && b > a(r) && (b = a(r)), i(b), S?.(b);
  };
  return {
    months: c,
    weeks: u,
    days: f,
    navStart: n,
    navEnd: r,
    previousMonth: h,
    nextMonth: p,
    goToMonth: O,
    goToDay: (k) => {
      C(k) || O(k.date);
    }
  };
}
var we;
(function(e) {
  e[e.Today = 0] = "Today", e[e.Selected = 1] = "Selected", e[e.LastFocused = 2] = "LastFocused", e[e.FocusedModifier = 3] = "FocusedModifier";
})(we || (we = {}));
function mn(e) {
  return !e[Q.disabled] && !e[Q.hidden] && !e[Q.outside];
}
function Jo(e, t, n, r) {
  let a, o = -1;
  for (const l of e) {
    const s = t(l);
    mn(s) && (s[Q.focused] && o < we.FocusedModifier ? (a = l, o = we.FocusedModifier) : r?.isEqualTo(l) && o < we.LastFocused ? (a = l, o = we.LastFocused) : n(l.date) && o < we.Selected ? (a = l, o = we.Selected) : s[Q.today] && o < we.Today && (a = l, o = we.Today));
  }
  return a || (a = e.find((l) => mn(t(l)))), a;
}
function ei(e, t, n, r, a, o, l) {
  const { ISOWeek: s, broadcastCalendar: i } = o, { addDays: c, addMonths: u, addWeeks: f, addYears: h, endOfBroadcastWeek: p, endOfISOWeek: y, endOfWeek: S, max: C, min: O, startOfBroadcastWeek: D, startOfISOWeek: v, startOfWeek: k } = l;
  let m = {
    day: c,
    week: f,
    month: u,
    year: h,
    startOfWeek: (F) => i ? D(F, l) : s ? v(F) : k(F),
    endOfWeek: (F) => i ? p(F) : s ? y(F) : S(F)
  }[e](n, t === "after" ? 1 : -1);
  return t === "before" && r ? m = C([r, m]) : t === "after" && a && (m = O([a, m])), m;
}
function nr(e, t, n, r, a, o, l, s = 0) {
  if (s > 365)
    return;
  const i = ei(e, t, n.date, r, a, o, l), c = !!(o.disabled && Se(i, o.disabled, l)), u = !!(o.hidden && Se(i, o.hidden, l)), f = i, h = new $n(i, f, l);
  return !c && !u ? h : nr(e, t, h, r, a, o, l, s + 1);
}
function ti(e, t, n, r, a) {
  const { autoFocus: o } = e, [l, s] = ae(), i = Jo(t.days, n, r || (() => !1), l), [c, u] = ae(o ? i : void 0);
  return {
    isFocusTarget: (S) => !!i?.isEqualTo(S),
    setFocused: u,
    focused: c,
    blur: () => {
      s(c), u(void 0);
    },
    moveFocus: (S, C) => {
      if (!c)
        return;
      const O = nr(S, C, c, t.navStart, t.navEnd, e, a);
      O && (e.disableNavigation && !t.days.some((v) => v.isEqualTo(O)) || (t.goToDay(O), u(O)));
    }
  };
}
function ni(e, t) {
  const { selected: n, required: r, onSelect: a } = e, [o, l] = vt(n, a ? n : void 0), s = a ? n : o, { isSameDay: i } = t, c = (p) => s?.some((y) => i(y, p)) ?? !1, { min: u, max: f } = e;
  return {
    selected: s,
    select: (p, y, S) => {
      let C = [...s ?? []];
      if (c(p)) {
        if (s?.length === u || r && s?.length === 1)
          return;
        C = s?.filter((O) => !i(O, p));
      } else
        s?.length === f ? C = [p] : C = [...C, p];
      return a || l(C), a?.(C, p, y, S), C;
    },
    isSelected: c
  };
}
function ri(e, t, n = 0, r = 0, a = !1, o = De) {
  const { from: l, to: s } = t || {}, { isSameDay: i, isAfter: c, isBefore: u } = o;
  let f;
  if (!l && !s)
    f = { from: e, to: n > 0 ? void 0 : e };
  else if (l && !s)
    i(l, e) ? n === 0 ? f = { from: l, to: e } : a ? f = { from: l, to: void 0 } : f = void 0 : u(e, l) ? f = { from: e, to: l } : f = { from: l, to: e };
  else if (l && s)
    if (i(l, e) && i(s, e))
      a ? f = { from: l, to: s } : f = void 0;
    else if (i(l, e))
      f = { from: l, to: n > 0 ? void 0 : e };
    else if (i(s, e))
      f = { from: e, to: n > 0 ? void 0 : e };
    else if (u(e, l))
      f = { from: e, to: s };
    else if (c(e, l))
      f = { from: l, to: e };
    else if (c(e, s))
      f = { from: l, to: e };
    else
      throw new Error("Invalid range");
  if (f?.from && f?.to) {
    const h = o.differenceInCalendarDays(f.to, f.from);
    r > 0 && h > r ? f = { from: e, to: void 0 } : n > 1 && h < n && (f = { from: e, to: void 0 });
  }
  return f;
}
function ai(e, t, n = De) {
  const r = Array.isArray(t) ? t : [t];
  let a = e.from;
  const o = n.differenceInCalendarDays(e.to, e.from), l = Math.min(o, 6);
  for (let s = 0; s <= l; s++) {
    if (r.includes(a.getDay()))
      return !0;
    a = n.addDays(a, 1);
  }
  return !1;
}
function pn(e, t, n = De) {
  return Ne(e, t.from, !1, n) || Ne(e, t.to, !1, n) || Ne(t, e.from, !1, n) || Ne(t, e.to, !1, n);
}
function si(e, t, n = De) {
  const r = Array.isArray(t) ? t : [t];
  if (r.filter((s) => typeof s != "function").some((s) => typeof s == "boolean" ? s : n.isDate(s) ? Ne(e, s, !1, n) : Hn(s, n) ? s.some((i) => Ne(e, i, !1, n)) : yt(s) ? s.from && s.to ? pn(e, { from: s.from, to: s.to }, n) : !1 : qn(s) ? ai(e, s.dayOfWeek, n) : Vt(s) ? n.isAfter(s.before, s.after) ? pn(e, {
    from: n.addDays(s.after, 1),
    to: n.addDays(s.before, -1)
  }, n) : Se(e.from, s, n) || Se(e.to, s, n) : qt(s) || Ht(s) ? Se(e.from, s, n) || Se(e.to, s, n) : !1))
    return !0;
  const l = r.filter((s) => typeof s == "function");
  if (l.length) {
    let s = e.from;
    const i = n.differenceInCalendarDays(e.to, e.from);
    for (let c = 0; c <= i; c++) {
      if (l.some((u) => u(s)))
        return !0;
      s = n.addDays(s, 1);
    }
  }
  return !1;
}
function oi(e, t) {
  const { disabled: n, excludeDisabled: r, resetOnSelect: a, selected: o, required: l, onSelect: s } = e, [i, c] = vt(o, s ? o : void 0), u = s ? o : i;
  return {
    selected: u,
    select: (p, y, S) => {
      const { min: C, max: O } = e;
      let D;
      if (p) {
        const v = u?.from, k = u?.to, b = !!v && !!k, m = !!v && !!k && t.isSameDay(v, k) && t.isSameDay(p, v);
        a && (b || !u?.from) ? !l && m ? D = void 0 : D = { from: p, to: void 0 } : D = ri(p, u, C, O, l, t);
      }
      return r && n && D?.from && D.to && si({ from: D.from, to: D.to }, n, t) && (D.from = p, D.to = void 0), s || c(D), s?.(D, p, y, S), D;
    },
    isSelected: (p) => u && Ne(u, p, !1, t)
  };
}
function ii(e, t) {
  const { selected: n, required: r, onSelect: a } = e, [o, l] = vt(n, a ? n : void 0), s = a ? n : o, { isSameDay: i } = t;
  return {
    selected: s,
    select: (f, h, p) => {
      let y = f;
      return !r && s && s && i(f, s) && (y = void 0), a || l(y), a?.(y, f, h, p), y;
    },
    isSelected: (f) => s ? i(s, f) : !1
  };
}
function li(e, t) {
  const n = ii(e, t), r = ni(e, t), a = oi(e, t);
  switch (e.mode) {
    case "single":
      return n;
    case "multiple":
      return r;
    case "range":
      return a;
    default:
      return;
  }
}
function pe(e, t) {
  return e instanceof se && e.timeZone === t ? e : new se(e, t);
}
function ze(e, t, n) {
  return pe(e, t);
}
function gn(e, t, n) {
  return typeof e == "boolean" || typeof e == "function" ? e : e instanceof Date ? ze(e, t) : Array.isArray(e) ? e.map((r) => r instanceof Date ? ze(r, t) : r) : yt(e) ? {
    ...e,
    from: e.from ? pe(e.from, t) : e.from,
    to: e.to ? pe(e.to, t) : e.to
  } : Vt(e) ? {
    before: ze(e.before, t),
    after: ze(e.after, t)
  } : qt(e) ? {
    after: ze(e.after, t)
  } : Ht(e) ? {
    before: ze(e.before, t)
  } : e;
}
function Wt(e, t, n) {
  return e && (Array.isArray(e) ? e.map((r) => gn(r, t)) : gn(e, t));
}
function ci(e) {
  let t = e;
  const n = t.timeZone;
  if (n && (t = {
    ...e,
    timeZone: n
  }, t.today && (t.today = pe(t.today, n)), t.month && (t.month = pe(t.month, n)), t.defaultMonth && (t.defaultMonth = pe(t.defaultMonth, n)), t.startMonth && (t.startMonth = pe(t.startMonth, n)), t.endMonth && (t.endMonth = pe(t.endMonth, n)), t.mode === "single" && t.selected ? t.selected = pe(t.selected, n) : t.mode === "multiple" && t.selected ? t.selected = t.selected?.map((I) => pe(I, n)) : t.mode === "range" && t.selected && (t.selected = {
    from: t.selected.from ? pe(t.selected.from, n) : t.selected.from,
    to: t.selected.to ? pe(t.selected.to, n) : t.selected.to
  }), t.disabled !== void 0 && (t.disabled = Wt(t.disabled, n)), t.hidden !== void 0 && (t.hidden = Wt(t.hidden, n)), t.modifiers)) {
    const I = {};
    Object.keys(t.modifiers).forEach((R) => {
      I[R] = Wt(t.modifiers?.[R], n);
    }), t.modifiers = I;
  }
  const { components: r, formatters: a, labels: o, dateLib: l, locale: s, classNames: i } = oe(() => {
    const I = { ...An, ...t.locale }, R = t.broadcastCalendar ? 1 : t.weekStartsOn, E = t.noonSafe && t.timeZone ? Bo(t.timeZone, {
      weekStartsOn: R,
      locale: I
    }) : void 0, H = t.dateLib && E ? { ...E, ...t.dateLib } : t.dateLib ?? E, de = new he({
      locale: I,
      weekStartsOn: R,
      firstWeekContainsDate: t.firstWeekContainsDate,
      useAdditionalWeekYearTokens: t.useAdditionalWeekYearTokens,
      useAdditionalDayOfYearTokens: t.useAdditionalDayOfYearTokens,
      timeZone: t.timeZone,
      numerals: t.numerals
    }, H);
    return {
      dateLib: de,
      components: bo(t.components),
      formatters: Wo(t.formatters),
      labels: Eo(t.labels, de.options),
      locale: I,
      classNames: { ...Rt(), ...t.classNames }
    };
  }, [
    t.locale,
    t.broadcastCalendar,
    t.weekStartsOn,
    t.firstWeekContainsDate,
    t.useAdditionalWeekYearTokens,
    t.useAdditionalDayOfYearTokens,
    t.timeZone,
    t.numerals,
    t.dateLib,
    t.noonSafe,
    t.components,
    t.formatters,
    t.labels,
    t.classNames
  ]);
  t.today || (t = { ...t, today: l.today() });
  const { captionLayout: c, mode: u, navLayout: f, numberOfMonths: h = 1, onDayBlur: p, onDayClick: y, onDayFocus: S, onDayKeyDown: C, onDayMouseEnter: O, onDayMouseLeave: D, onNextClick: v, onPrevClick: k, showWeekNumber: b, styles: m } = t, { formatCaption: F, formatDay: B, formatMonthDropdown: $, formatWeekNumber: N, formatWeekNumberHeader: z, formatWeekdayName: X, formatYearDropdown: U } = a, L = Zo(t, l), { days: ie, months: me, navStart: le, navEnd: ge, previousMonth: Z, nextMonth: te, goToMonth: ce } = L, g = yo(ie, t, le, ge, l), { isSelected: T, select: A, selected: _ } = li(t, l) ?? {}, { blur: x, focused: w, isFocusTarget: P, moveFocus: Y, setFocused: V } = ti(t, L, g, T ?? (() => !1), l), { labelDayButton: be, labelGridcell: xt, labelGrid: wr, labelMonthDropdown: kr, labelNav: Zt, labelPrevious: Mr, labelNext: Dr, labelWeekday: Or, labelWeekNumber: Nr, labelWeekNumberHeader: Sr, labelYearDropdown: Cr } = o, Wr = oe(() => Io(l, t.ISOWeek, t.broadcastCalendar, t.today), [l, t.ISOWeek, t.broadcastCalendar, t.today]), Jt = u !== void 0 || y !== void 0, wt = ne(() => {
    Z && (ce(Z), k?.(Z));
  }, [Z, ce, k]), kt = ne(() => {
    te && (ce(te), v?.(te));
  }, [ce, te, v]), _r = ne((I, R) => (E) => {
    E.preventDefault(), E.stopPropagation(), V(I), !R.disabled && (A?.(I.date, R, E), y?.(I.date, R, E));
  }, [A, y, V]), jr = ne((I, R) => (E) => {
    V(I), S?.(I.date, R, E);
  }, [S, V]), Fr = ne((I, R) => (E) => {
    x(), p?.(I.date, R, E);
  }, [x, p]), Tr = ne((I, R) => (E) => {
    const H = {
      ArrowLeft: [
        E.shiftKey ? "month" : "day",
        t.dir === "rtl" ? "after" : "before"
      ],
      ArrowRight: [
        E.shiftKey ? "month" : "day",
        t.dir === "rtl" ? "before" : "after"
      ],
      ArrowDown: [E.shiftKey ? "year" : "week", "after"],
      ArrowUp: [E.shiftKey ? "year" : "week", "before"],
      PageUp: [E.shiftKey ? "year" : "month", "before"],
      PageDown: [E.shiftKey ? "year" : "month", "after"],
      Home: ["startOfWeek", "before"],
      End: ["endOfWeek", "after"]
    };
    if (H[E.key]) {
      E.preventDefault(), E.stopPropagation();
      const [de, q] = H[E.key];
      Y(de, q);
    }
    C?.(I.date, R, E);
  }, [Y, C, t.dir]), Er = ne((I, R) => (E) => {
    O?.(I.date, R, E);
  }, [O]), Pr = ne((I, R) => (E) => {
    D?.(I.date, R, E);
  }, [D]), Yr = ne((I) => (R) => {
    const E = Number(R.target.value), H = l.setMonth(l.startOfMonth(I), E);
    ce(H);
  }, [l, ce]), Ir = ne((I) => (R) => {
    const E = Number(R.target.value), H = l.setYear(l.startOfMonth(I), E);
    ce(H);
  }, [l, ce]), { className: zr, style: Br } = oe(() => ({
    className: [i[j.Root], t.className].filter(Boolean).join(" "),
    style: { ...m?.[j.Root], ...t.style }
  }), [i, t.className, t.style, m]), Ar = xo(t), en = re(null);
  qo(en, !!t.animate, {
    classNames: i,
    months: me,
    focused: w,
    dateLib: l
  });
  const $r = {
    dayPickerProps: t,
    selected: _,
    select: A,
    isSelected: T,
    months: me,
    nextMonth: te,
    previousMonth: Z,
    goToMonth: ce,
    getModifiers: g,
    components: r,
    classNames: i,
    styles: m,
    labels: o,
    formatters: a
  };
  return M.createElement(
    Vn.Provider,
    { value: $r },
    M.createElement(
      r.Root,
      { rootRef: t.animate ? en : void 0, className: zr, style: Br, dir: t.dir, id: t.id, lang: t.lang ?? s.code, nonce: t.nonce, title: t.title, role: t.role, "aria-label": t["aria-label"], "aria-labelledby": t["aria-labelledby"], ...Ar },
      M.createElement(
        r.Months,
        { className: i[j.Months], style: m?.[j.Months] },
        !t.hideNavigation && !f && M.createElement(r.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: i[j.Nav], style: m?.[j.Nav], "aria-label": Zt(), onPreviousClick: wt, onNextClick: kt, previousMonth: Z, nextMonth: te }),
        me.map((I, R) => M.createElement(
          r.Month,
          {
            "data-animated-month": t.animate ? "true" : void 0,
            className: i[j.Month],
            style: m?.[j.Month],
            // biome-ignore lint/suspicious/noArrayIndexKey: breaks animation
            key: R,
            displayIndex: R,
            calendarMonth: I
          },
          f === "around" && !t.hideNavigation && R === 0 && M.createElement(
            r.PreviousMonthButton,
            { type: "button", className: i[j.PreviousMonthButton], tabIndex: Z ? void 0 : -1, "aria-disabled": Z ? void 0 : !0, "aria-label": Mr(Z), onClick: wt, "data-animated-button": t.animate ? "true" : void 0 },
            M.createElement(r.Chevron, { disabled: Z ? void 0 : !0, className: i[j.Chevron], orientation: t.dir === "rtl" ? "right" : "left" })
          ),
          M.createElement(r.MonthCaption, { "data-animated-caption": t.animate ? "true" : void 0, className: i[j.MonthCaption], style: m?.[j.MonthCaption], calendarMonth: I, displayIndex: R }, c?.startsWith("dropdown") ? M.createElement(
            r.DropdownNav,
            { className: i[j.Dropdowns], style: m?.[j.Dropdowns] },
            (() => {
              const E = c === "dropdown" || c === "dropdown-months" ? M.createElement(r.MonthsDropdown, { key: "month", className: i[j.MonthsDropdown], "aria-label": kr(), classNames: i, components: r, disabled: !!t.disableNavigation, onChange: Yr(I.date), options: Po(I.date, le, ge, a, l), style: m?.[j.Dropdown], value: l.getMonth(I.date) }) : M.createElement("span", { key: "month" }, $(I.date, l)), H = c === "dropdown" || c === "dropdown-years" ? M.createElement(r.YearsDropdown, { key: "year", className: i[j.YearsDropdown], "aria-label": Cr(l.options), classNames: i, components: r, disabled: !!t.disableNavigation, onChange: Ir(I.date), options: zo(le, ge, a, l, !!t.reverseYears), style: m?.[j.Dropdown], value: l.getYear(I.date) }) : M.createElement("span", { key: "year" }, U(I.date, l));
              return l.getMonthYearOrder() === "year-first" ? [H, E] : [E, H];
            })(),
            M.createElement("span", { role: "status", "aria-live": "polite", style: {
              border: 0,
              clip: "rect(0 0 0 0)",
              height: "1px",
              margin: "-1px",
              overflow: "hidden",
              padding: 0,
              position: "absolute",
              width: "1px",
              whiteSpace: "nowrap",
              wordWrap: "normal"
            } }, F(I.date, l.options, l))
          ) : M.createElement(r.CaptionLabel, { className: i[j.CaptionLabel], role: "status", "aria-live": "polite" }, F(I.date, l.options, l))),
          f === "around" && !t.hideNavigation && R === h - 1 && M.createElement(
            r.NextMonthButton,
            { type: "button", className: i[j.NextMonthButton], tabIndex: te ? void 0 : -1, "aria-disabled": te ? void 0 : !0, "aria-label": Dr(te), onClick: kt, "data-animated-button": t.animate ? "true" : void 0 },
            M.createElement(r.Chevron, { disabled: te ? void 0 : !0, className: i[j.Chevron], orientation: t.dir === "rtl" ? "left" : "right" })
          ),
          R === h - 1 && f === "after" && !t.hideNavigation && M.createElement(r.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: i[j.Nav], style: m?.[j.Nav], "aria-label": Zt(), onPreviousClick: wt, onNextClick: kt, previousMonth: Z, nextMonth: te }),
          M.createElement(
            r.MonthGrid,
            { role: "grid", "aria-multiselectable": u === "multiple" || u === "range", "aria-label": wr(I.date, l.options, l) || void 0, className: i[j.MonthGrid], style: m?.[j.MonthGrid] },
            !t.hideWeekdays && M.createElement(
              r.Weekdays,
              { "data-animated-weekdays": t.animate ? "true" : void 0, className: i[j.Weekdays], style: m?.[j.Weekdays] },
              b && M.createElement(r.WeekNumberHeader, { "aria-label": Sr(l.options), className: i[j.WeekNumberHeader], style: m?.[j.WeekNumberHeader], scope: "col" }, z()),
              Wr.map((E) => M.createElement(r.Weekday, { "aria-label": Or(E, l.options, l), className: i[j.Weekday], key: String(E), style: m?.[j.Weekday], scope: "col" }, X(E, l.options, l)))
            ),
            M.createElement(r.Weeks, { "data-animated-weeks": t.animate ? "true" : void 0, className: i[j.Weeks], style: m?.[j.Weeks] }, I.weeks.map((E) => M.createElement(
              r.Week,
              { className: i[j.Week], key: E.weekNumber, style: m?.[j.Week], week: E },
              b && M.createElement(r.WeekNumber, { week: E, style: m?.[j.WeekNumber], "aria-label": Nr(E.weekNumber, {
                locale: s
              }), className: i[j.WeekNumber], scope: "row", role: "rowheader" }, N(E.weekNumber, l)),
              E.days.map((H) => {
                const { date: de } = H, q = g(H);
                if (q[Q.focused] = !q.hidden && !!w?.isEqualTo(H), q[ve.selected] = T?.(de) || q.selected, yt(_)) {
                  const { from: Mt, to: Dt } = _;
                  q[ve.range_start] = !!(Mt && Dt && l.isSameDay(de, Mt)), q[ve.range_end] = !!(Mt && Dt && l.isSameDay(de, Dt)), q[ve.range_middle] = Ne(_, de, !0, l);
                }
                const Vr = Yo(q, m, t.modifiersStyles), qr = vo(q, i, t.modifiersClassNames), Hr = !Jt && !q.hidden ? xt(de, q, l.options, l) : void 0;
                return M.createElement(r.Day, { key: `${H.isoDate}_${H.displayMonthId}`, day: H, modifiers: q, className: qr.join(" "), style: Vr, role: "gridcell", "aria-selected": q.selected || void 0, "aria-label": Hr, "data-day": H.isoDate, "data-month": H.outside ? H.dateMonthId : void 0, "data-selected": q.selected || void 0, "data-disabled": q.disabled || void 0, "data-hidden": q.hidden || void 0, "data-outside": H.outside || void 0, "data-focused": q.focused || void 0, "data-today": q.today || void 0 }, !q.hidden && Jt ? M.createElement(r.DayButton, { className: i[j.DayButton], style: m?.[j.DayButton], type: "button", day: H, modifiers: q, disabled: !q.focused && q.disabled || void 0, "aria-disabled": q.focused && q.disabled || void 0, tabIndex: P(H) ? 0 : -1, "aria-label": be(de, q, l.options, l), onClick: _r(H, q), onBlur: Fr(H, q), onFocus: jr(H, q), onKeyDown: Tr(H, q), onMouseEnter: Er(H, q), onMouseLeave: Pr(H, q) }, B(de, l.options, l)) : !q.hidden && B(H.date, l.options, l));
              })
            )))
          )
        ))
      ),
      t.footer && M.createElement(r.Footer, { className: i[j.Footer], style: m?.[j.Footer], role: "status", "aria-live": "polite" }, t.footer)
    )
  );
}
function rr({
  className: e,
  classNames: t,
  showOutsideDays: n = !0,
  captionLayout: r = "label",
  buttonVariant: a = "ghost",
  formatters: o,
  components: l,
  ...s
}) {
  const i = Rt();
  return /* @__PURE__ */ d.jsx(
    ci,
    {
      captionLayout: r,
      className: W(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        e
      ),
      classNames: {
        root: W("w-fit", i.root),
        months: W(
          "flex gap-4 flex-col md:flex-row relative",
          i.months
        ),
        month: W("flex flex-col w-full gap-4", i.month),
        nav: W(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          i.nav
        ),
        button_previous: W(
          tn({ variant: a }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          i.button_previous
        ),
        button_next: W(
          tn({ variant: a }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          i.button_next
        ),
        month_caption: W(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          i.month_caption
        ),
        dropdowns: W(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          i.dropdowns
        ),
        dropdown_root: W(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          i.dropdown_root
        ),
        dropdown: W("absolute bg-popover inset-0 opacity-0", i.dropdown),
        caption_label: W(
          "select-none font-medium",
          r === "label" ? "text-sm" : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          i.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: W("flex", i.weekdays),
        weekday: W(
          "text-muted-foreground rounded-md w-(--cell-size) font-normal text-sm select-none",
          i.weekday
        ),
        week: W("flex w-full mt-2", i.week),
        week_number_header: W(
          "select-none w-(--cell-size)",
          i.week_number_header
        ),
        week_number: W(
          "text-[0.8rem] select-none text-muted-foreground",
          i.week_number
        ),
        day: W(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          i.day
        ),
        range_start: W("rounded-l-md bg-accent", i.range_start),
        range_middle: W("rounded-none", i.range_middle),
        range_end: W("rounded-r-md bg-accent", i.range_end),
        today: W(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          i.today
        ),
        outside: W(
          "text-muted-foreground aria-selected:text-muted-foreground",
          i.outside
        ),
        disabled: W(
          "text-muted-foreground opacity-50",
          i.disabled
        ),
        hidden: W("invisible", i.hidden),
        ...t
      },
      components: {
        Root: ({ className: c, rootRef: u, ...f }) => /* @__PURE__ */ d.jsx(
          "div",
          {
            ref: u,
            className: W(c),
            "data-slot": "calendar",
            ...f
          }
        ),
        Chevron: ({ className: c, orientation: u, ...f }) => u === "left" ? /* @__PURE__ */ d.jsx(Xr, { className: W("size-4", c), ...f }) : u === "right" ? /* @__PURE__ */ d.jsx(Jr, { className: W("size-4", c), ...f }) : /* @__PURE__ */ d.jsx(Kr, { className: W("size-4", c), ...f }),
        DayButton: ar,
        WeekNumber: ({ children: c, ...u }) => /* @__PURE__ */ d.jsx("td", { ...u, children: /* @__PURE__ */ d.jsx("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children: c }) }),
        ...l
      },
      formatters: {
        formatMonthDropdown: (c) => c.toLocaleString("default", { month: "short" }),
        ...o
      },
      showOutsideDays: n,
      ...s
    }
  );
}
rr.displayName = "Calendar";
function ar({
  className: e,
  day: t,
  modifiers: n,
  ...r
}) {
  const a = Rt(), o = re(null);
  return ue(() => {
    n.focused && o.current?.focus();
  }, [n.focused]), /* @__PURE__ */ d.jsx(
    Ur,
    {
      ref: o,
      className: W(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-auto items-center justify-center gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        a.day,
        e
      ),
      "data-day": t.date.toLocaleDateString(),
      "data-range-end": n.range_end,
      "data-range-middle": n.range_middle,
      "data-range-start": n.range_start,
      "data-selected-single": n.selected && !n.range_start && !n.range_end && !n.range_middle,
      size: "icon",
      variant: "ghost",
      ...r
    }
  );
}
ar.displayName = "CalendarDayButton";
var yn = 1, ui = 0.9, di = 0.8, fi = 0.17, _t = 0.1, jt = 0.999, hi = 0.9999, mi = 0.99, pi = /[\\\/_+.#"@\[\(\{&]/, gi = /[\\\/_+.#"@\[\(\{&]/g, yi = /[\s-]/, sr = /[\s-]/g;
function Yt(e, t, n, r, a, o, l) {
  if (o === t.length) return a === e.length ? yn : mi;
  var s = `${a},${o}`;
  if (l[s] !== void 0) return l[s];
  for (var i = r.charAt(o), c = n.indexOf(i, a), u = 0, f, h, p, y; c >= 0; ) f = Yt(e, t, n, r, c + 1, o + 1, l), f > u && (c === a ? f *= yn : pi.test(e.charAt(c - 1)) ? (f *= di, p = e.slice(a, c - 1).match(gi), p && a > 0 && (f *= Math.pow(jt, p.length))) : yi.test(e.charAt(c - 1)) ? (f *= ui, y = e.slice(a, c - 1).match(sr), y && a > 0 && (f *= Math.pow(jt, y.length))) : (f *= fi, a > 0 && (f *= Math.pow(jt, c - a))), e.charAt(c) !== t.charAt(o) && (f *= hi)), (f < _t && n.charAt(c - 1) === r.charAt(o + 1) || r.charAt(o + 1) === r.charAt(o) && n.charAt(c - 1) !== r.charAt(o)) && (h = Yt(e, t, n, r, c + 1, o + 2, l), h * _t > f && (f = h * _t)), f > u && (u = f), c = n.indexOf(i, c + 1);
  return l[s] = u, u;
}
function vn(e) {
  return e.toLowerCase().replace(sr, " ");
}
function vi(e, t, n) {
  return e = n && n.length > 0 ? `${e + " " + n.join(" ")}` : e, Yt(e, t, vn(e), vn(t), 0, 0, {});
}
var Xe = '[cmdk-group=""]', Ft = '[cmdk-group-items=""]', bi = '[cmdk-group-heading=""]', or = '[cmdk-item=""]', bn = `${or}:not([aria-disabled="true"])`, It = "cmdk-item-select", Ae = "data-value", xi = (e, t, n) => vi(e, t, n), ir = at(void 0), ct = () => st(ir), lr = at(void 0), Kt = () => st(lr), cr = at(void 0), ur = Ce((e, t) => {
  let n = $e(() => {
    var g, T;
    return { search: "", value: (T = (g = e.value) != null ? g : e.defaultValue) != null ? T : "", selectedItemId: void 0, filtered: { count: 0, items: /* @__PURE__ */ new Map(), groups: /* @__PURE__ */ new Set() } };
  }), r = $e(() => /* @__PURE__ */ new Set()), a = $e(() => /* @__PURE__ */ new Map()), o = $e(() => /* @__PURE__ */ new Map()), l = $e(() => /* @__PURE__ */ new Set()), s = dr(e), { label: i, children: c, value: u, onValueChange: f, filter: h, shouldFilter: p, loop: y, disablePointerSelection: S = !1, vimBindings: C = !0, ...O } = e, D = qe(), v = qe(), k = qe(), b = re(null), m = ji();
  Pe(() => {
    if (u !== void 0) {
      let g = u.trim();
      n.current.value = g, F.emit();
    }
  }, [u]), Pe(() => {
    m(6, U);
  }, []);
  let F = oe(() => ({ subscribe: (g) => (l.current.add(g), () => l.current.delete(g)), snapshot: () => n.current, setState: (g, T, A) => {
    var _, x, w, P;
    if (!Object.is(n.current[g], T)) {
      if (n.current[g] = T, g === "search") X(), N(), m(1, z);
      else if (g === "value") {
        if (document.activeElement.hasAttribute("cmdk-input") || document.activeElement.hasAttribute("cmdk-root")) {
          let Y = document.getElementById(k);
          Y ? Y.focus() : (_ = document.getElementById(D)) == null || _.focus();
        }
        if (m(7, () => {
          var Y;
          n.current.selectedItemId = (Y = L()) == null ? void 0 : Y.id, F.emit();
        }), A || m(5, U), ((x = s.current) == null ? void 0 : x.value) !== void 0) {
          let Y = T ?? "";
          (P = (w = s.current).onValueChange) == null || P.call(w, Y);
          return;
        }
      }
      F.emit();
    }
  }, emit: () => {
    l.current.forEach((g) => g());
  } }), []), B = oe(() => ({ value: (g, T, A) => {
    var _;
    T !== ((_ = o.current.get(g)) == null ? void 0 : _.value) && (o.current.set(g, { value: T, keywords: A }), n.current.filtered.items.set(g, $(T, A)), m(2, () => {
      N(), F.emit();
    }));
  }, item: (g, T) => (r.current.add(g), T && (a.current.has(T) ? a.current.get(T).add(g) : a.current.set(T, /* @__PURE__ */ new Set([g]))), m(3, () => {
    X(), N(), n.current.value || z(), F.emit();
  }), () => {
    o.current.delete(g), r.current.delete(g), n.current.filtered.items.delete(g);
    let A = L();
    m(4, () => {
      X(), A?.getAttribute("id") === g && z(), F.emit();
    });
  }), group: (g) => (a.current.has(g) || a.current.set(g, /* @__PURE__ */ new Set()), () => {
    o.current.delete(g), a.current.delete(g);
  }), filter: () => s.current.shouldFilter, label: i || e["aria-label"], getDisablePointerSelection: () => s.current.disablePointerSelection, listId: D, inputId: k, labelId: v, listInnerRef: b }), []);
  function $(g, T) {
    var A, _;
    let x = (_ = (A = s.current) == null ? void 0 : A.filter) != null ? _ : xi;
    return g ? x(g, n.current.search, T) : 0;
  }
  function N() {
    if (!n.current.search || s.current.shouldFilter === !1) return;
    let g = n.current.filtered.items, T = [];
    n.current.filtered.groups.forEach((_) => {
      let x = a.current.get(_), w = 0;
      x.forEach((P) => {
        let Y = g.get(P);
        w = Math.max(Y, w);
      }), T.push([_, w]);
    });
    let A = b.current;
    ie().sort((_, x) => {
      var w, P;
      let Y = _.getAttribute("id"), V = x.getAttribute("id");
      return ((w = g.get(V)) != null ? w : 0) - ((P = g.get(Y)) != null ? P : 0);
    }).forEach((_) => {
      let x = _.closest(Ft);
      x ? x.appendChild(_.parentElement === x ? _ : _.closest(`${Ft} > *`)) : A.appendChild(_.parentElement === A ? _ : _.closest(`${Ft} > *`));
    }), T.sort((_, x) => x[1] - _[1]).forEach((_) => {
      var x;
      let w = (x = b.current) == null ? void 0 : x.querySelector(`${Xe}[${Ae}="${encodeURIComponent(_[0])}"]`);
      w?.parentElement.appendChild(w);
    });
  }
  function z() {
    let g = ie().find((A) => A.getAttribute("aria-disabled") !== "true"), T = g?.getAttribute(Ae);
    F.setState("value", T || void 0);
  }
  function X() {
    var g, T, A, _;
    if (!n.current.search || s.current.shouldFilter === !1) {
      n.current.filtered.count = r.current.size;
      return;
    }
    n.current.filtered.groups = /* @__PURE__ */ new Set();
    let x = 0;
    for (let w of r.current) {
      let P = (T = (g = o.current.get(w)) == null ? void 0 : g.value) != null ? T : "", Y = (_ = (A = o.current.get(w)) == null ? void 0 : A.keywords) != null ? _ : [], V = $(P, Y);
      n.current.filtered.items.set(w, V), V > 0 && x++;
    }
    for (let [w, P] of a.current) for (let Y of P) if (n.current.filtered.items.get(Y) > 0) {
      n.current.filtered.groups.add(w);
      break;
    }
    n.current.filtered.count = x;
  }
  function U() {
    var g, T, A;
    let _ = L();
    _ && (((g = _.parentElement) == null ? void 0 : g.firstChild) === _ && ((A = (T = _.closest(Xe)) == null ? void 0 : T.querySelector(bi)) == null || A.scrollIntoView({ block: "nearest" })), _.scrollIntoView({ block: "nearest" }));
  }
  function L() {
    var g;
    return (g = b.current) == null ? void 0 : g.querySelector(`${or}[aria-selected="true"]`);
  }
  function ie() {
    var g;
    return Array.from(((g = b.current) == null ? void 0 : g.querySelectorAll(bn)) || []);
  }
  function me(g) {
    let T = ie()[g];
    T && F.setState("value", T.getAttribute(Ae));
  }
  function le(g) {
    var T;
    let A = L(), _ = ie(), x = _.findIndex((P) => P === A), w = _[x + g];
    (T = s.current) != null && T.loop && (w = x + g < 0 ? _[_.length - 1] : x + g === _.length ? _[0] : _[x + g]), w && F.setState("value", w.getAttribute(Ae));
  }
  function ge(g) {
    let T = L(), A = T?.closest(Xe), _;
    for (; A && !_; ) A = g > 0 ? Wi(A, Xe) : _i(A, Xe), _ = A?.querySelector(bn);
    _ ? F.setState("value", _.getAttribute(Ae)) : le(g);
  }
  let Z = () => me(ie().length - 1), te = (g) => {
    g.preventDefault(), g.metaKey ? Z() : g.altKey ? ge(1) : le(1);
  }, ce = (g) => {
    g.preventDefault(), g.metaKey ? me(0) : g.altKey ? ge(-1) : le(-1);
  };
  return J(je.div, { ref: t, tabIndex: -1, ...O, "cmdk-root": "", onKeyDown: (g) => {
    var T;
    (T = O.onKeyDown) == null || T.call(O, g);
    let A = g.nativeEvent.isComposing || g.keyCode === 229;
    if (!(g.defaultPrevented || A)) switch (g.key) {
      case "n":
      case "j": {
        C && g.ctrlKey && te(g);
        break;
      }
      case "ArrowDown": {
        te(g);
        break;
      }
      case "p":
      case "k": {
        C && g.ctrlKey && ce(g);
        break;
      }
      case "ArrowUp": {
        ce(g);
        break;
      }
      case "Home": {
        g.preventDefault(), me(0);
        break;
      }
      case "End": {
        g.preventDefault(), Z();
        break;
      }
      case "Enter": {
        g.preventDefault();
        let _ = L();
        if (_) {
          let x = new Event(It);
          _.dispatchEvent(x);
        }
      }
    }
  } }, J("label", { "cmdk-label": "", htmlFor: B.inputId, id: B.labelId, style: Ti }, i), bt(e, (g) => J(lr.Provider, { value: F }, J(ir.Provider, { value: B }, g))));
}), wi = Ce((e, t) => {
  var n, r;
  let a = qe(), o = re(null), l = st(cr), s = ct(), i = dr(e), c = (r = (n = i.current) == null ? void 0 : n.forceMount) != null ? r : l?.forceMount;
  Pe(() => {
    if (!c) return s.item(a, l?.id);
  }, [c]);
  let u = fr(a, o, [e.value, e.children, o], e.keywords), f = Kt(), h = _e((m) => m.value && m.value === u.current), p = _e((m) => c || s.filter() === !1 ? !0 : m.search ? m.filtered.items.get(a) > 0 : !0);
  ue(() => {
    let m = o.current;
    if (!(!m || e.disabled)) return m.addEventListener(It, y), () => m.removeEventListener(It, y);
  }, [p, e.onSelect, e.disabled]);
  function y() {
    var m, F;
    S(), (F = (m = i.current).onSelect) == null || F.call(m, u.current);
  }
  function S() {
    f.setState("value", u.current, !0);
  }
  if (!p) return null;
  let { disabled: C, value: O, onSelect: D, forceMount: v, keywords: k, ...b } = e;
  return J(je.div, { ref: et(o, t), ...b, id: a, "cmdk-item": "", role: "option", "aria-disabled": !!C, "aria-selected": !!h, "data-disabled": !!C, "data-selected": !!h, onPointerMove: C || s.getDisablePointerSelection() ? void 0 : S, onClick: C ? void 0 : y }, e.children);
}), ki = Ce((e, t) => {
  let { heading: n, children: r, forceMount: a, ...o } = e, l = qe(), s = re(null), i = re(null), c = qe(), u = ct(), f = _e((p) => a || u.filter() === !1 ? !0 : p.search ? p.filtered.groups.has(l) : !0);
  Pe(() => u.group(l), []), fr(l, s, [e.value, e.heading, i]);
  let h = oe(() => ({ id: l, forceMount: a }), [a]);
  return J(je.div, { ref: et(s, t), ...o, "cmdk-group": "", role: "presentation", hidden: f ? void 0 : !0 }, n && J("div", { ref: i, "cmdk-group-heading": "", "aria-hidden": !0, id: c }, n), bt(e, (p) => J("div", { "cmdk-group-items": "", role: "group", "aria-labelledby": n ? c : void 0 }, J(cr.Provider, { value: h }, p))));
}), Mi = Ce((e, t) => {
  let { alwaysRender: n, ...r } = e, a = re(null), o = _e((l) => !l.search);
  return !n && !o ? null : J(je.div, { ref: et(a, t), ...r, "cmdk-separator": "", role: "separator" });
}), Di = Ce((e, t) => {
  let { onValueChange: n, ...r } = e, a = e.value != null, o = Kt(), l = _e((c) => c.search), s = _e((c) => c.selectedItemId), i = ct();
  return ue(() => {
    e.value != null && o.setState("search", e.value);
  }, [e.value]), J(je.input, { ref: t, ...r, "cmdk-input": "", autoComplete: "off", autoCorrect: "off", spellCheck: !1, "aria-autocomplete": "list", role: "combobox", "aria-expanded": !0, "aria-controls": i.listId, "aria-labelledby": i.labelId, "aria-activedescendant": s, id: i.inputId, type: "text", value: a ? e.value : l, onChange: (c) => {
    a || o.setState("search", c.target.value), n?.(c.target.value);
  } });
}), Oi = Ce((e, t) => {
  let { children: n, label: r = "Suggestions", ...a } = e, o = re(null), l = re(null), s = _e((c) => c.selectedItemId), i = ct();
  return ue(() => {
    if (l.current && o.current) {
      let c = l.current, u = o.current, f, h = new ResizeObserver(() => {
        f = requestAnimationFrame(() => {
          let p = c.offsetHeight;
          u.style.setProperty("--cmdk-list-height", p.toFixed(1) + "px");
        });
      });
      return h.observe(c), () => {
        cancelAnimationFrame(f), h.unobserve(c);
      };
    }
  }, []), J(je.div, { ref: et(o, t), ...a, "cmdk-list": "", role: "listbox", tabIndex: -1, "aria-activedescendant": s, "aria-label": r, id: i.listId }, bt(e, (c) => J("div", { ref: et(l, i.listInnerRef), "cmdk-list-sizer": "" }, c)));
}), Ni = Ce((e, t) => {
  let { open: n, onOpenChange: r, overlayClassName: a, contentClassName: o, container: l, ...s } = e;
  return J(aa, { open: n, onOpenChange: r }, J(sa, { container: l }, J(oa, { "cmdk-overlay": "", className: a }), J(ia, { "aria-label": e.label, "cmdk-dialog": "", className: o }, J(ur, { ref: t, ...s }))));
}), Si = Ce((e, t) => _e((n) => n.filtered.count === 0) ? J(je.div, { ref: t, ...e, "cmdk-empty": "", role: "presentation" }) : null), Ci = Ce((e, t) => {
  let { progress: n, children: r, label: a = "Loading...", ...o } = e;
  return J(je.div, { ref: t, ...o, "cmdk-loading": "", role: "progressbar", "aria-valuenow": n, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": a }, bt(e, (l) => J("div", { "aria-hidden": !0 }, l)));
}), Ye = Object.assign(ur, { List: Oi, Item: wi, Input: Di, Group: ki, Separator: Mi, Dialog: Ni, Empty: Si, Loading: Ci });
function Wi(e, t) {
  let n = e.nextElementSibling;
  for (; n; ) {
    if (n.matches(t)) return n;
    n = n.nextElementSibling;
  }
}
function _i(e, t) {
  let n = e.previousElementSibling;
  for (; n; ) {
    if (n.matches(t)) return n;
    n = n.previousElementSibling;
  }
}
function dr(e) {
  let t = re(e);
  return Pe(() => {
    t.current = e;
  }), t;
}
var Pe = typeof window > "u" ? ue : On;
function $e(e) {
  let t = re();
  return t.current === void 0 && (t.current = e()), t;
}
function _e(e) {
  let t = Kt(), n = () => e(t.snapshot());
  return Lr(t.subscribe, n, n);
}
function fr(e, t, n, r = []) {
  let a = re(), o = ct();
  return Pe(() => {
    var l;
    let s = (() => {
      var c;
      for (let u of n) {
        if (typeof u == "string") return u.trim();
        if (typeof u == "object" && "current" in u) return u.current ? (c = u.current.textContent) == null ? void 0 : c.trim() : a.current;
      }
    })(), i = r.map((c) => c.trim());
    o.value(e, s, i), (l = t.current) == null || l.setAttribute(Ae, s), a.current = s;
  }), a;
}
var ji = () => {
  let [e, t] = ae(), n = $e(() => /* @__PURE__ */ new Map());
  return Pe(() => {
    n.current.forEach((r) => r()), n.current = /* @__PURE__ */ new Map();
  }, [e]), (r, a) => {
    n.current.set(r, a), t({});
  };
};
function Fi(e) {
  let t = e.type;
  return typeof t == "function" ? t(e.props) : "render" in t ? t.render(e.props) : e;
}
function bt({ asChild: e, children: t }, n) {
  return e && Rr(t) ? Gr(Fi(t), { ref: t.ref }, n(t.props.children)) : n(t);
}
var Ti = { position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0" };
function ft({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    Ye,
    {
      className: W(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        e
      ),
      ...t
    }
  );
}
function Ut({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsxs("div", { className: "flex items-center border-b border-border px-3", "cmdk-input-wrapper": "", "data-slot": "command-input", children: [
    /* @__PURE__ */ d.jsx(Qr, { className: "me-2 size-4 shrink-0 opacity-50" }),
    /* @__PURE__ */ d.jsx(
      Ye.Input,
      {
        className: W(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-hidden text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          e
        ),
        ...t
      }
    )
  ] });
}
function Xt({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    Ye.List,
    {
      className: W("max-h-[300px] p-1 overflow-y-auto overflow-x-hidden", e),
      "data-slot": "command-list",
      ...t
    }
  );
}
function Qt({ ...e }) {
  return /* @__PURE__ */ d.jsx(Ye.Empty, { className: "py-6 text-center text-sm", "data-slot": "command-empty", ...e });
}
function Ge({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    Ye.Group,
    {
      className: W(
        "overflow-hidden p-1.5 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        e
      ),
      "data-slot": "command-group",
      ...t
    }
  );
}
function He({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    Ye.Separator,
    {
      className: W("-mx-1.5 h-px bg-border", e),
      "data-slot": "command-separator",
      ...t
    }
  );
}
function Ee({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    Ye.Item,
    {
      className: W(
        "relative flex text-foreground cursor-default gap-2 select-none items-center rounded-xs px-2 py-1.5 outline-hidden data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-[1.5px]",
        e
      ),
      "data-slot": "command-item",
      ...t
    }
  );
}
const Ve = {
  // UI Labels
  addFilter: "",
  clearFilters: "Clear",
  searchFields: "Search fields...",
  noFieldsFound: "No fields found.",
  noResultsFound: "No results found.",
  loading: "Loading...",
  loadMore: "Load more",
  select: "Select...",
  true: "True",
  false: "False",
  min: "Min",
  max: "Max",
  to: "to",
  typeAndPressEnter: "Type and press Enter to add tag",
  selected: "selected",
  selectedCount: "selected",
  percent: "%",
  defaultCurrency: "$",
  defaultColor: "currentColor",
  addFilterTitle: "",
  // Operators
  operators: {
    is: "is",
    isNot: "is not",
    isAnyOf: "is any of",
    isNotAnyOf: "is not any of",
    includesAll: "includes all",
    excludesAll: "excludes all",
    before: "before",
    after: "after",
    between: "between",
    notBetween: "not between",
    contains: "contains",
    notContains: "does not contain",
    startsWith: "starts with",
    endsWith: "ends with",
    isExactly: "is exactly",
    equals: "equals",
    notEquals: "not equals",
    greaterThan: "greater than",
    lessThan: "less than",
    overlaps: "overlaps",
    includes: "includes",
    excludes: "excludes",
    includesAllOf: "includes all of",
    includesAnyOf: "includes any of",
    empty: "is empty",
    notEmpty: "is not empty"
  },
  // Placeholders
  placeholders: {
    enterField: (e) => `Enter ${e}...`,
    selectField: "Select...",
    searchField: (e) => `Search ${e.toLowerCase()}...`,
    enterKey: "Enter key...",
    enterValue: "Enter value..."
  },
  // Helper functions
  helpers: {
    formatOperator: (e) => e.replace(/_/g, " ")
  },
  // Validation
  validation: {
    invalidEmail: "Invalid email format",
    invalidUrl: "Invalid URL format",
    invalidTel: "Invalid phone format",
    invalid: "Invalid input format"
  }
}, hr = at({
  variant: "outline",
  size: "md",
  radius: "md",
  i18n: Ve,
  cursorPointer: !0,
  className: void 0,
  showAddButton: !0,
  addButtonText: void 0,
  addButtonIcon: void 0,
  addButtonClassName: void 0,
  addButton: void 0,
  showSearchInput: !0,
  trigger: void 0,
  allowMultiple: !0
}), Fe = () => st(hr), zt = 200, mr = Me(
  [
    "relative flex shrink-0 items-center text-foreground outline-hidden transition",
    "has-[[data-slot=filters-input]:focus-visible]:ring-focus-ring/30",
    "has-[[data-slot=filters-input]:focus-visible]:border-focus-ring",
    "has-[[data-slot=filters-input]:focus-visible]:outline-hidden",
    "has-[[data-slot=filters-input]:focus-visible]:ring-[3px]",
    "has-[[data-slot=filters-input]:focus-visible]:z-1",
    "has-[[data-slot=filters-input]:[aria-invalid=true]]:border",
    "has-[[data-slot=filters-input]:[aria-invalid=true]]:border-solid",
    "has-[[data-slot=filters-input]:[aria-invalid=true]]:border-destructive/60",
    "has-[[data-slot=filters-input]:[aria-invalid=true]]:ring-destructive/10",
    "dark:has-[[data-slot=filters-input]:[aria-invalid=true]]:border-destructive",
    "dark:has-[[data-slot=filters-input]:[aria-invalid=true]]:ring-destructive/20"
  ],
  {
    variants: {
      variant: {
        solid: "border-0 bg-secondary",
        outline: "border border-border bg-background"
      },
      size: {
        lg: "h-10 px-2.5 text-sm has-[[data-slot=filters-prefix]]:ps-0 has-[[data-slot=filters-suffix]]:pe-0",
        md: "h-(--control-height) px-2.5 has-[[data-slot=filters-prefix]]:ps-0 has-[[data-slot=filters-suffix]]:pe-0",
        sm: "h-8 px-2 text-xs has-[[data-slot=filters-prefix]]:ps-0 has-[[data-slot=filters-suffix]]:pe-0"
      },
      cursorPointer: {
        true: "cursor-pointer",
        false: ""
      }
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      cursorPointer: !0
    }
  }
), Ei = Me(
  [
    "inline-flex shrink-0 items-center justify-center text-muted-foreground transition hover:text-foreground",
    "focus-visible:ring-1 focus-visible:ring-focus-ring focus-visible:outline-hidden"
  ],
  {
    variants: {
      variant: {
        solid: "bg-secondary",
        outline: "border border-s-0 border-border hover:bg-secondary"
      },
      size: {
        lg: "size-10 [&_svg:not([class*=size-])]:size-4",
        md: "size-(--control-height) [&_svg:not([class*=size-])]:size-3.5",
        sm: "size-8 [&_svg:not([class*=size-])]:size-3"
      },
      cursorPointer: {
        true: "cursor-pointer",
        false: ""
      },
      radius: {
        md: "rounded-e-md",
        full: "rounded-e-full"
      }
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      radius: "md",
      cursorPointer: !0
    }
  }
), xn = Me(
  [
    "inline-flex shrink-0 items-center justify-center text-foreground transition",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-[1.5px]",
    "focus-visible:ring-1 focus-visible:ring-focus-ring focus-visible:outline-hidden"
  ],
  {
    variants: {
      variant: {
        solid: "border border-input hover:bg-secondary/60",
        outline: "border border-border hover:bg-accent"
      },
      size: {
        lg: "h-10 gap-1.5 px-4 text-sm [&_svg:not([class*=size-])]:size-4",
        md: "h-(--control-height) gap-1.5 px-2.5 [&_svg:not([class*=size-])]:size-4",
        sm: "h-8 gap-1.5 px-2.5 text-xs [&_svg:not([class*=size-])]:size-3.5"
      },
      radius: {
        md: "rounded-md",
        full: "rounded-full"
      },
      cursorPointer: {
        true: "cursor-pointer",
        false: ""
      }
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      cursorPointer: !0
    }
  }
), Pi = Me(
  [
    "relative flex shrink-0 items-center whitespace-nowrap text-muted-foreground transition hover:text-foreground focus-visible:z-1 data-[state=open]:text-foreground",
    "focus-visible:ring-1 focus-visible:ring-focus-ring focus-visible:outline-hidden"
  ],
  {
    variants: {
      variant: {
        solid: "bg-secondary",
        outline: "border border-e-0 border-border bg-background hover:bg-secondary data-[state=open]:bg-secondary [&+[data-slot=filters-remove]]:border-s"
      },
      size: {
        lg: "h-10 gap-1.5 px-4 text-sm",
        md: "h-(--control-height) gap-0.5 px-2.5",
        sm: "h-8 gap-1 px-2.5 text-xs"
      },
      cursorPointer: {
        true: "cursor-pointer",
        false: ""
      }
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      cursorPointer: !0
    }
  }
), Yi = Me(
  [
    "flex shrink-0 items-center gap-1.5 px-1.5 py-1 text-foreground",
    "[&_svg:not([class*=size-])]:size-4"
  ],
  {
    variants: {
      variant: {
        solid: "bg-secondary",
        outline: "border border-e-0 border-border"
      },
      size: {
        lg: "h-10 gap-1.5 px-2 text-sm [&_svg:not([class*=size-])]:size-4",
        md: "h-(--control-height) gap-1.5 px-2.5 [&_svg:not([class*=size-])]:size-4",
        sm: "h-8 gap-0.5 px-2.5 text-xs [&_svg:not([class*=size-])]:size-3.5"
      },
      radius: {
        md: "rounded-s-md",
        full: "rounded-s-full"
      }
    },
    defaultVariants: {
      variant: "outline",
      size: "md"
    }
  }
), Je = Me(
  [
    "relative flex min-w-0 shrink items-center gap-1 text-foreground transition focus-visible:z-1",
    "focus-visible:ring-1 focus-visible:ring-focus-ring focus-visible:outline-hidden",
    "has-[[data-slot=filters-input]:focus-visible]:ring-focus-ring/30",
    "has-[[data-slot=filters-input]:focus-visible]:border-focus-ring",
    "has-[[data-slot=filters-input]:focus-visible]:outline-hidden",
    "has-[[data-slot=filters-input]:focus-visible]:ring-[3px]",
    "has-[[data-slot=filters-input]:focus-visible]:z-1",
    "has-[[data-slot=filters-input][aria-invalid=true]]:border",
    "has-[[data-slot=filters-input][aria-invalid=true]]:border-solid",
    "has-[[data-slot=filters-input][aria-invalid=true]]:border-destructive/60",
    "has-[[data-slot=filters-input][aria-invalid=true]]:ring-destructive/10",
    "dark:has-[[data-slot=filters-input][aria-invalid=true]]:border-destructive",
    "dark:has-[[data-slot=filters-input][aria-invalid=true]]:ring-destructive/20"
  ],
  {
    variants: {
      variant: {
        solid: "bg-secondary",
        outline: "border border-border bg-background hover:bg-secondary has-[[data-slot=switch]]:hover:bg-transparent has-[>[data-slot=filters-input-wrapper]]:hover:bg-background"
      },
      size: {
        lg: "h-10 gap-1.5 px-2 text-sm [&_svg:not([class*=size-])]:size-4",
        md: "h-(--control-height) gap-1.5 px-2.5 [&_svg:not([class*=size-])]:size-4",
        sm: "h-8 gap-0.5 px-2.5 text-xs [&_svg:not([class*=size-])]:size-3.5"
      },
      cursorPointer: {
        true: "cursor-pointer has-[[data-slot=switch]]:cursor-default has-[>[data-slot=filters-input-wrapper]]:cursor-text",
        false: ""
      }
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      cursorPointer: !0
    }
  }
), ht = Me("flex shrink-0 items-center justify-center text-foreground", {
  variants: {
    variant: {
      solid: "",
      outline: ""
    },
    size: {
      lg: "h-10 px-4 text-sm",
      md: "h-(--control-height) px-2.5",
      sm: "h-8 px-2.5 text-xs"
    }
  },
  defaultVariants: {
    variant: "outline",
    size: "md"
  }
}), ut = Me("flex shrink-0 items-center text-muted-foreground", {
  variants: {
    variant: {
      solid: "bg-secondary",
      outline: "border border-x-0 border-border bg-background"
    },
    size: {
      lg: "h-10 px-4 text-sm",
      md: "h-(--control-height) px-2.5",
      sm: "h-8 px-2.5 text-xs"
    }
  },
  defaultVariants: {
    variant: "outline",
    size: "md"
  }
}), Ii = Me("relative flex flex-wrap items-center", {
  variants: {
    variant: {
      solid: "gap-2",
      outline: ""
    },
    size: {
      sm: "gap-1.5",
      md: "gap-2.5",
      lg: "gap-3.5"
    }
  },
  defaultVariants: {
    variant: "outline",
    size: "md"
  }
}), zi = Me("flex max-w-[calc(100vw-32px)] items-center", {
  variants: {
    variant: {
      solid: "gap-px",
      outline: ""
    }
  },
  defaultVariants: {
    variant: "outline"
  }
});
function xe({
  field: e,
  onChange: t,
  onBlur: n,
  onKeyDown: r,
  onInputChange: a,
  className: o,
  ...l
}) {
  const s = Fe(), [i, c] = ae(!0), [u, f] = ae(""), h = (O, D) => !D || !O ? !0 : new RegExp(D).test(O), p = (O, D = !1) => {
    if ((O === "text" || O === "number") && D)
      return s.i18n.validation.invalid;
    switch (O) {
      case "email":
        return s.i18n.validation.invalidEmail;
      case "url":
        return s.i18n.validation.invalidUrl;
      case "tel":
        return s.i18n.validation.invalidTel;
      default:
        return s.i18n.validation.invalid;
    }
  }, y = (O) => {
    t?.(O);
  }, S = (O) => {
    const D = O.target.value, v = e?.pattern || l.pattern;
    if (D && v) {
      let k = !0;
      e?.validation ? k = e.validation(D) : k = h(D, v), c(k);
      const b = !!(e?.pattern || l.pattern);
      f(k ? "" : p(e?.type || "", b));
    } else
      c(!0), f("");
    a && a(O), n?.(O);
  }, C = (O) => {
    if (!i && !["Tab", "Escape", "Enter", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(O.key) && (c(!0), f("")), O.key === "Enter" && a) {
      const D = {
        ...O,
        target: O.target,
        currentTarget: O.currentTarget
      };
      a(D);
    }
    r?.(O);
  };
  return /* @__PURE__ */ d.jsxs(
    "div",
    {
      className: W("w-36", mr({ variant: s.variant, size: s.size }), o),
      "data-slot": "filters-input-wrapper",
      children: [
        e?.prefix && /* @__PURE__ */ d.jsx(
          "div",
          {
            className: ht({ variant: s.variant, size: s.size }),
            "data-slot": "filters-prefix",
            children: e.prefix
          }
        ),
        /* @__PURE__ */ d.jsxs("div", { className: "flex w-full items-stretch", children: [
          /* @__PURE__ */ d.jsx(
            "input",
            {
              "aria-describedby": !i && u ? `${e?.key || "input"}-error` : void 0,
              "aria-invalid": !i,
              autoComplete: "off",
              className: "w-full bg-transparent outline-hidden dark:!bg-transparent",
              "data-form-type": "other",
              "data-lpignore": "true",
              "data-slot": "filters-input",
              "data-1p-ignore": !0,
              onBlur: S,
              onChange: y,
              onKeyDown: C,
              ...l
            }
          ),
          !i && u && /* @__PURE__ */ d.jsxs(ca, { children: [
            /* @__PURE__ */ d.jsx(ua, { asChild: !0, children: /* @__PURE__ */ d.jsx("div", { className: "absolute top-1/2 right-2 flex -translate-y-1/2 items-center", children: /* @__PURE__ */ d.jsx(da, { className: "size-3.5 text-destructive" }) }) }),
            /* @__PURE__ */ d.jsx(fa, { children: /* @__PURE__ */ d.jsx("p", { children: u }) })
          ] })
        ] }),
        e?.suffix && /* @__PURE__ */ d.jsx(
          "div",
          {
            className: W(ht({ variant: s.variant, size: s.size })),
            "data-slot": "filters-suffix",
            children: e.suffix
          }
        )
      ]
    }
  );
}
const Tt = (e) => {
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
  if (!t)
    return;
  const [, n, r, a] = t, o = Number(n), l = Number(r), s = Number(a), i = new Date(o, l - 1, s);
  if (!(i.getFullYear() !== o || i.getMonth() !== l - 1 || i.getDate() !== s))
    return i;
}, wn = (e) => {
  if (!e)
    return "";
  const t = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0");
  return `${t}-${n}-${r}`;
};
function Et({
  field: e,
  value: t,
  onChange: n,
  className: r,
  embedded: a = !1
}) {
  const o = Fe(), [l, s] = ae(!1), i = oe(() => Tt(t), [t]), [c, u] = ae(i), f = re(null), h = re(t), [p, y] = ae(t);
  ue(() => {
    i && u(i);
  }, [i]), ue(() => {
    t !== h.current && document.activeElement !== f.current && (y(t), h.current = t);
  }, [t]);
  const S = (v, k = f.current) => {
    !e?.onInputChange || !k || e.onInputChange({
      target: { ...k, value: v },
      currentTarget: { ...k, value: v }
    });
  }, C = (v) => {
    y(v.target.value);
  }, O = (v) => {
    const k = v.target.value, b = Tt(k), m = k && !b ? wn(/* @__PURE__ */ new Date()) : k;
    b ? u(b) : m && u(Tt(m)), m !== k && (f.current && (f.current.value = m), y(m)), m !== t && (h.current = m, n(m)), S(m, v.target);
  }, D = (v) => {
    if (!v) {
      h.current = "", f.current && (f.current.value = ""), y(""), n(""), S("");
      return;
    }
    const k = wn(v);
    h.current = k, f.current && (f.current.value = k), u(v), y(k), n(k), S(k), s(!1);
  };
  return /* @__PURE__ */ d.jsxs(
    "div",
    {
      className: W(
        a ? "flex w-full min-w-0 items-center" : W("w-32", mr({ variant: o.variant, size: o.size, cursorPointer: !1 })),
        r
      ),
      "data-slot": "filters-input-wrapper",
      children: [
        e?.prefix && /* @__PURE__ */ d.jsx(
          "div",
          {
            className: ht({ variant: o.variant, size: o.size }),
            "data-slot": "filters-prefix",
            children: e.prefix
          }
        ),
        /* @__PURE__ */ d.jsx("div", { className: "flex w-full min-w-0 items-stretch", children: /* @__PURE__ */ d.jsx(
          "input",
          {
            ref: f,
            autoComplete: "off",
            className: "w-full min-w-0 bg-transparent outline-hidden dark:!bg-transparent",
            "data-slot": "filters-input",
            inputMode: "numeric",
            pattern: "\\d{4}-\\d{2}-\\d{2}",
            placeholder: "YYYY-MM-DD",
            type: "text",
            value: p,
            onBlur: O,
            onChange: C
          }
        ) }),
        /* @__PURE__ */ d.jsxs(mt, { open: l, onOpenChange: s, children: [
          /* @__PURE__ */ d.jsx(pt, { asChild: !0, children: /* @__PURE__ */ d.jsx(
            "button",
            {
              "aria-label": "Open calendar",
              className: W(
                ht({ variant: o.variant, size: o.size }),
                "cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              ),
              "data-slot": "filters-suffix",
              type: "button",
              children: /* @__PURE__ */ d.jsx(Zr, { className: "size-3.5" })
            }
          ) }),
          /* @__PURE__ */ d.jsx(gt, { align: "center", className: "w-auto overflow-hidden p-0", sideOffset: 4, children: /* @__PURE__ */ d.jsx(
            rr,
            {
              captionLayout: "dropdown-months",
              mode: "single",
              month: c,
              selected: i,
              onMonthChange: u,
              onSelect: D
            }
          ) })
        ] })
      ]
    }
  );
}
function Bi({ className: e, icon: t = /* @__PURE__ */ d.jsx(Nn, {}), ...n }) {
  const r = Fe();
  return /* @__PURE__ */ d.jsx(
    "button",
    {
      className: W(
        Ei({
          variant: r.variant,
          size: r.size,
          cursorPointer: r.cursorPointer,
          radius: r.radius
        }),
        e
      ),
      "data-slot": "filters-remove",
      ...n,
      type: "button",
      children: t
    }
  );
}
const pr = (e) => "fields" in e && Array.isArray(e.fields), gr = (e) => !!(e.group && e.fields), yr = (e) => e.reduce((t, n) => pr(n) ? [...t, ...n.fields] : gr(n) ? [...t, ...n.fields] : [...t, n], []), Ai = (e) => yr(e).reduce(
  (n, r) => (r.key && (n[r.key] = r), n),
  {}
), vr = (e) => ({
  select: [
    { value: "is", label: e.operators.is },
    { value: "is_not", label: e.operators.isNot },
    { value: "empty", label: e.operators.empty },
    { value: "not_empty", label: e.operators.notEmpty }
  ],
  multiselect: [
    { value: "is_any_of", label: e.operators.isAnyOf },
    { value: "is_not_any_of", label: e.operators.isNotAnyOf },
    { value: "includes_all", label: e.operators.includesAll },
    { value: "excludes_all", label: e.operators.excludesAll },
    { value: "empty", label: e.operators.empty },
    { value: "not_empty", label: e.operators.notEmpty }
  ],
  date: [
    { value: "before", label: e.operators.before },
    { value: "after", label: e.operators.after },
    { value: "is", label: e.operators.is },
    { value: "is_not", label: e.operators.isNot },
    { value: "empty", label: e.operators.empty },
    { value: "not_empty", label: e.operators.notEmpty }
  ],
  daterange: [
    { value: "between", label: e.operators.between },
    { value: "not_between", label: e.operators.notBetween },
    { value: "empty", label: e.operators.empty },
    { value: "not_empty", label: e.operators.notEmpty }
  ],
  text: [
    { value: "contains", label: e.operators.contains },
    { value: "not_contains", label: e.operators.notContains },
    { value: "starts_with", label: e.operators.startsWith },
    { value: "ends_with", label: e.operators.endsWith },
    { value: "is", label: e.operators.isExactly },
    { value: "empty", label: e.operators.empty },
    { value: "not_empty", label: e.operators.notEmpty }
  ],
  number: [
    { value: "equals", label: e.operators.equals },
    { value: "not_equals", label: e.operators.notEquals },
    { value: "greater_than", label: e.operators.greaterThan },
    { value: "less_than", label: e.operators.lessThan },
    { value: "between", label: e.operators.between },
    { value: "empty", label: e.operators.empty },
    { value: "not_empty", label: e.operators.notEmpty }
  ],
  numberrange: [
    { value: "between", label: e.operators.between },
    { value: "overlaps", label: e.operators.overlaps },
    { value: "contains", label: e.operators.contains },
    { value: "empty", label: e.operators.empty },
    { value: "not_empty", label: e.operators.notEmpty }
  ],
  boolean: [
    { value: "is", label: e.operators.is },
    { value: "is_not", label: e.operators.isNot },
    { value: "empty", label: e.operators.empty },
    { value: "not_empty", label: e.operators.notEmpty }
  ],
  email: [
    { value: "contains", label: e.operators.contains },
    { value: "not_contains", label: e.operators.notContains },
    { value: "starts_with", label: e.operators.startsWith },
    { value: "ends_with", label: e.operators.endsWith },
    { value: "is", label: e.operators.isExactly },
    { value: "empty", label: e.operators.empty },
    { value: "not_empty", label: e.operators.notEmpty }
  ],
  url: [
    { value: "contains", label: e.operators.contains },
    { value: "not_contains", label: e.operators.notContains },
    { value: "starts_with", label: e.operators.startsWith },
    { value: "ends_with", label: e.operators.endsWith },
    { value: "is", label: e.operators.isExactly },
    { value: "empty", label: e.operators.empty },
    { value: "not_empty", label: e.operators.notEmpty }
  ],
  tel: [
    { value: "contains", label: e.operators.contains },
    { value: "not_contains", label: e.operators.notContains },
    { value: "starts_with", label: e.operators.startsWith },
    { value: "ends_with", label: e.operators.endsWith },
    { value: "is", label: e.operators.isExactly },
    { value: "empty", label: e.operators.empty },
    { value: "not_empty", label: e.operators.notEmpty }
  ],
  time: [
    { value: "before", label: e.operators.before },
    { value: "after", label: e.operators.after },
    { value: "is", label: e.operators.is },
    { value: "between", label: e.operators.between },
    { value: "empty", label: e.operators.empty },
    { value: "not_empty", label: e.operators.notEmpty }
  ],
  datetime: [
    { value: "before", label: e.operators.before },
    { value: "after", label: e.operators.after },
    { value: "is", label: e.operators.is },
    { value: "between", label: e.operators.between },
    { value: "empty", label: e.operators.empty },
    { value: "not_empty", label: e.operators.notEmpty }
  ]
});
vr(Ve);
const $i = (e, t, n) => {
  if (e.operators)
    return e.operators;
  const r = vr(n);
  let a = e.type || "select";
  return a === "select" && t.length > 1 && (a = "multiselect"), a === "multiselect" || e.type === "multiselect" ? r.multiselect : r[a] || r.select;
};
function Vi({ field: e, operator: t, values: n, onChange: r }) {
  const a = Fe(), o = $i(e, n, a.i18n), l = o.find((s) => s.value === t)?.label || a.i18n.helpers.formatOperator(t);
  return e.hideOperatorSelect ? /* @__PURE__ */ d.jsx("div", { className: "flex items-center self-stretch border border-r-0 px-2.5 whitespace-nowrap text-muted-foreground", children: l }) : /* @__PURE__ */ d.jsxs(ea, { children: [
    /* @__PURE__ */ d.jsx(ta, { className: Pi({ variant: a.variant, size: a.size }), children: l }),
    /* @__PURE__ */ d.jsx(na, { align: "start", className: "w-fit min-w-fit", children: o.map((s) => /* @__PURE__ */ d.jsxs(
      ra,
      {
        className: "flex items-center justify-between",
        onClick: () => r(s.value),
        children: [
          /* @__PURE__ */ d.jsx("span", { children: s.label }),
          /* @__PURE__ */ d.jsx(tt, { className: `ms-auto text-primary ${s.value === t ? "opacity-100" : "opacity-0"}` })
        ]
      },
      s.value
    )) })
  ] });
}
function kn({
  searchable: e,
  label: t,
  searchInput: n,
  isSearching: r,
  className: a,
  onSearchChange: o
}) {
  const l = Fe();
  return e ? /* @__PURE__ */ d.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ d.jsx(
      Ut,
      {
        className: a,
        placeholder: l.i18n.placeholders.searchField(t || ""),
        value: n,
        onValueChange: o
      }
    ),
    r && /* @__PURE__ */ d.jsx(Pt, { className: "pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" })
  ] }) : null;
}
function qi(e, t) {
  const n = t.trim().toLowerCase();
  return n ? e.filter((r) => r.label.toLowerCase().includes(n) || r.detail?.toLowerCase().includes(n)) : e;
}
function Mn({
  contextLabel: e,
  selectedOptions: t,
  unselectedOptions: n,
  isInitialLoad: r,
  isLoadingMore: a,
  hasMore: o,
  onLoadMore: l,
  onSelectSelected: s,
  onSelectUnselected: i
}) {
  const c = Fe();
  return /* @__PURE__ */ d.jsxs(Xt, { className: "outline-hidden", children: [
    r ? /* @__PURE__ */ d.jsxs("div", { className: "flex items-center justify-center py-6 text-muted-foreground", children: [
      /* @__PURE__ */ d.jsx(Pt, { className: "mr-2 size-4 animate-spin" }),
      c.i18n.loading
    ] }) : /* @__PURE__ */ d.jsx(Qt, { children: c.i18n.noResultsFound }),
    t.length > 0 && /* @__PURE__ */ d.jsx(Ge, { heading: e, children: t.map((u) => /* @__PURE__ */ d.jsxs(
      Ee,
      {
        className: "group flex items-center gap-2",
        onSelect: () => s(u),
        children: [
          u.icon && u.icon,
          /* @__PURE__ */ d.jsxs("div", { className: "flex flex-col overflow-hidden", children: [
            /* @__PURE__ */ d.jsx("span", { className: "truncate text-accent-foreground", title: u.label, children: u.label }),
            u.detail && /* @__PURE__ */ d.jsx("span", { className: "truncate text-muted-foreground", title: u.detail, children: u.detail })
          ] }),
          /* @__PURE__ */ d.jsx(tt, { className: "ms-auto text-primary" })
        ]
      },
      String(u.value)
    )) }),
    n.length > 0 && /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      t.length > 0 && /* @__PURE__ */ d.jsx(He, {}),
      /* @__PURE__ */ d.jsx(Ge, { children: n.map((u) => /* @__PURE__ */ d.jsxs(
        Ee,
        {
          className: "group flex items-center gap-2",
          value: u.label + (u.detail ? ` - ${u.detail}` : ""),
          onSelect: () => i(u),
          children: [
            u.icon && u.icon,
            /* @__PURE__ */ d.jsxs("div", { className: "flex flex-col overflow-hidden", children: [
              /* @__PURE__ */ d.jsx("span", { className: "truncate text-accent-foreground", title: u.label, children: u.label }),
              u.detail && /* @__PURE__ */ d.jsx("span", { className: "truncate text-muted-foreground", title: u.detail, children: u.detail })
            ] }),
            /* @__PURE__ */ d.jsx(tt, { className: "ms-auto text-primary opacity-0" })
          ]
        },
        String(u.value)
      )) })
    ] }),
    o && /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      (t.length > 0 || n.length > 0) && /* @__PURE__ */ d.jsx(He, {}),
      /* @__PURE__ */ d.jsx("div", { className: "p-1.5", children: /* @__PURE__ */ d.jsxs(
        "button",
        {
          className: "flex w-full items-center justify-center rounded-xs px-2.5 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50",
          disabled: a,
          type: "button",
          onClick: l,
          children: [
            a && /* @__PURE__ */ d.jsx(Pt, { className: "mr-2 size-4 animate-spin" }),
            a ? c.i18n.loading : c.i18n.loadMore
          ]
        }
      ) })
    ] })
  ] });
}
function br({
  field: e,
  values: t,
  onChange: n,
  onClose: r,
  inline: a = !1,
  searchInput: o,
  onSearchChange: l,
  shouldClientFilter: s,
  isInitialLoad: i,
  isSearching: c,
  isLoadingMore: u,
  hasMore: f,
  onLoadMore: h
}) {
  const [p, y] = ae(!1), [S, C] = ae([]), O = Fe(), D = e.type === "multiselect" || t.length > 1, v = oe(() => e.value ?? t, [e.value, t]);
  ue(() => {
    p && e.searchable !== !1 && setTimeout(() => {
      const N = document.querySelector("[cmdk-input]");
      N && N.focus();
    }, 0);
  }, [p, e.searchable]);
  const k = oe(
    () => e.options?.filter((N) => v.includes(N.value)) || [],
    [e.options, v]
  );
  ue(() => {
    if (v.length === 0) {
      C([]);
      return;
    }
    k.length > 0 && C((N) => {
      const z = [];
      for (const X of v) {
        const U = k.find((L) => L.value === X) ?? N.find((L) => L.value === X);
        U && z.push(U);
      }
      return z;
    });
  }, [k, v]);
  const b = oe(() => v.length === 0 ? [] : S.length > 0 ? S : k, [S, v.length, k]), m = oe(() => qi(b, o), [o, b]), F = e.options?.filter((N) => !v.includes(N.value)) || [], B = (N) => {
    l(N);
  }, $ = () => {
    y(!1), setTimeout(() => l(""), zt), r?.();
  };
  return a ? /* @__PURE__ */ d.jsx("div", { className: "w-full", children: /* @__PURE__ */ d.jsxs(ft, { shouldFilter: s, children: [
    /* @__PURE__ */ d.jsx(
      kn,
      {
        className: "h-(--control-height) pr-8",
        isSearching: c,
        label: e.label,
        searchable: e.searchable !== !1,
        searchInput: o,
        onSearchChange: B
      }
    ),
    /* @__PURE__ */ d.jsx(
      Mn,
      {
        contextLabel: e.label || "Selected",
        hasMore: f,
        isInitialLoad: i,
        isLoadingMore: u,
        selectedOptions: m,
        unselectedOptions: F,
        onLoadMore: h,
        onSelectSelected: (N) => {
          if (D) {
            const z = v.filter((X) => X !== N.value);
            e.onValueChange ? e.onValueChange(z) : n(z);
          } else
            e.onValueChange ? e.onValueChange([]) : n([]);
        },
        onSelectUnselected: (N) => {
          if (D) {
            const z = [...v, N.value];
            if (e.maxSelections && z.length > e.maxSelections)
              return;
            e.onValueChange ? e.onValueChange(z) : n(z), e.autoCloseOnSelect && r?.();
          } else
            e.onValueChange ? e.onValueChange([N.value]) : n([N.value]), r?.();
        }
      }
    )
  ] }) }) : /* @__PURE__ */ d.jsxs(
    mt,
    {
      open: p,
      onOpenChange: (N) => {
        y(N), N || setTimeout(() => l(""), zt);
      },
      children: [
        /* @__PURE__ */ d.jsx(
          pt,
          {
            className: W(Je({
              variant: O.variant,
              size: O.size,
              cursorPointer: O.cursorPointer
            }), e.triggerClassName ?? "max-w-60"),
            children: /* @__PURE__ */ d.jsx("div", { className: "flex min-w-0 items-center gap-1.5", children: e.customValueRenderer ? e.customValueRenderer(t, e.options || []) : /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
              b.length > 0 && b.some((N) => N.icon) && /* @__PURE__ */ d.jsx("div", { className: W("-space-x-0.5 flex shrink-0 items-center", e.selectedOptionsClassName), children: b.slice(0, 3).map((N) => /* @__PURE__ */ d.jsx("div", { children: N.icon }, String(N.value))) }),
              b.length === 1 ? /* @__PURE__ */ d.jsx("span", { className: "min-w-0 truncate text-accent-foreground", title: b[0].detail ? `${b[0].label} - ${b[0].detail}` : b[0].label, children: b[0].label }) : b.length > 1 ? `${b.length} ${O.i18n.selectedCount}` : O.i18n.select
            ] }) })
          }
        ),
        /* @__PURE__ */ d.jsx(
          gt,
          {
            align: "start",
            className: W(
              "p-0 data-[state=closed]:animation-none! data-[state=closed]:duration-0!",
              e.className || "w-[200px]"
            ),
            children: /* @__PURE__ */ d.jsxs(ft, { shouldFilter: s, children: [
              /* @__PURE__ */ d.jsx(
                kn,
                {
                  className: "h-(--control-height) pr-8",
                  isSearching: c,
                  label: e.label,
                  searchable: e.searchable !== !1,
                  searchInput: o,
                  onSearchChange: B
                }
              ),
              /* @__PURE__ */ d.jsx(
                Mn,
                {
                  hasMore: f,
                  isInitialLoad: i,
                  isLoadingMore: u,
                  selectedOptions: m,
                  unselectedOptions: F,
                  onLoadMore: h,
                  onSelectSelected: (N) => {
                    n(D ? t.filter((z) => z !== N.value) : []), D || (y(!1), $());
                  },
                  onSelectUnselected: (N) => {
                    if (D) {
                      const z = [...t, N.value];
                      if (e.maxSelections && z.length > e.maxSelections)
                        return;
                      n(z), e.autoCloseOnSelect && $();
                    } else
                      n([N.value]), y(!1), $();
                  }
                }
              )
            ] })
          }
        )
      ]
    }
  );
}
function Hi({
  field: e,
  values: t,
  onChange: n,
  onClose: r,
  inline: a = !1,
  searchInput: o,
  onSearchChange: l
}) {
  const s = oe(() => e.value ?? t, [e.value, t]), i = e.valueSource.useOptions({
    query: o,
    selectedValues: s
  }), c = oe(() => ({
    ...e,
    options: i.options
  }), [e, i.options]);
  return /* @__PURE__ */ d.jsx(
    br,
    {
      field: c,
      hasMore: i.hasMore,
      inline: a,
      isInitialLoad: i.isInitialLoad,
      isLoadingMore: i.isLoadingMore,
      isSearching: i.isSearching,
      searchInput: o,
      shouldClientFilter: !1,
      values: t,
      onChange: n,
      onClose: r,
      onLoadMore: i.loadMore,
      onSearchChange: l
    }
  );
}
function xr({
  field: e,
  values: t,
  onChange: n,
  onClose: r,
  inline: a = !1
}) {
  const [o, l] = ae(""), s = e.options?.length ?? 0;
  return e.valueSource ? /* @__PURE__ */ d.jsx(
    Hi,
    {
      field: e,
      inline: a,
      searchInput: o,
      values: t,
      onChange: n,
      onClose: r,
      onSearchChange: l
    },
    e.valueSource.id
  ) : /* @__PURE__ */ d.jsx(
    br,
    {
      field: e,
      hasMore: !1,
      inline: a,
      isInitialLoad: !!e.isLoading && s === 0,
      isLoadingMore: !1,
      isSearching: !!e.isLoading && s > 0,
      searchInput: o,
      shouldClientFilter: !0,
      values: t,
      onChange: n,
      onClose: r,
      onLoadMore: () => {
      },
      onSearchChange: l
    }
  );
}
function Ri({ field: e, values: t, onChange: n, operator: r }) {
  const [a, o] = ae(!1), [l, s] = ae(""), i = Fe();
  if (ue(() => {
    a && e.searchable !== !1 && setTimeout(() => {
      const h = document.querySelector("[cmdk-input]");
      h && h.focus();
    }, 0);
  }, [a, e.searchable]), r === "empty" || r === "not_empty")
    return null;
  if (e.customRenderer)
    return /* @__PURE__ */ d.jsx(
      "div",
      {
        className: Je({
          variant: i.variant,
          size: i.size,
          cursorPointer: i.cursorPointer
        }),
        children: e.customRenderer({ field: e, values: t, onChange: n, operator: r })
      }
    );
  if (e.type === "boolean") {
    const h = t[0] === !0, p = e.onLabel || i.i18n.true, y = e.offLabel || i.i18n.false;
    return /* @__PURE__ */ d.jsx(
      "div",
      {
        className: Je({
          variant: i.variant,
          size: i.size,
          cursorPointer: i.cursorPointer
        }),
        children: /* @__PURE__ */ d.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ d.jsx(la, { checked: h, size: "sm", onCheckedChange: (S) => n([S]) }),
          e.onLabel && e.offLabel && /* @__PURE__ */ d.jsx("span", { className: "text-xs text-muted-foreground", children: h ? p : y })
        ] })
      }
    );
  }
  if (e.type === "time") {
    if (r === "between") {
      const h = t[0] || "", p = t[1] || "";
      return /* @__PURE__ */ d.jsxs("div", { className: "flex items-center", "data-slot": "filters-item", children: [
        /* @__PURE__ */ d.jsx(
          xe,
          {
            className: e.className,
            field: e,
            type: "time",
            value: h,
            onChange: (y) => n([y.target.value, p]),
            onInputChange: e.onInputChange
          }
        ),
        /* @__PURE__ */ d.jsx(
          "div",
          {
            className: ut({ variant: i.variant, size: i.size }),
            "data-slot": "filters-between",
            children: i.i18n.to
          }
        ),
        /* @__PURE__ */ d.jsx(
          xe,
          {
            className: e.className,
            field: e,
            type: "time",
            value: p,
            onChange: (y) => n([h, y.target.value]),
            onInputChange: e.onInputChange
          }
        )
      ] });
    }
    return /* @__PURE__ */ d.jsx(
      xe,
      {
        className: e.className,
        field: e,
        type: "time",
        value: t[0] || "",
        onChange: (h) => n([h.target.value]),
        onInputChange: e.onInputChange
      }
    );
  }
  if (e.type === "datetime") {
    if (r === "between") {
      const h = t[0] || "", p = t[1] || "";
      return /* @__PURE__ */ d.jsxs("div", { className: "flex items-center", "data-slot": "filters-item", children: [
        /* @__PURE__ */ d.jsx(
          xe,
          {
            className: W("w-36 max-w-full", e.className),
            field: e,
            type: "datetime-local",
            value: h,
            onChange: (y) => n([y.target.value, p]),
            onInputChange: e.onInputChange
          }
        ),
        /* @__PURE__ */ d.jsx(
          "div",
          {
            className: ut({ variant: i.variant, size: i.size }),
            "data-slot": "filters-between",
            children: i.i18n.to
          }
        ),
        /* @__PURE__ */ d.jsx(
          xe,
          {
            className: W("w-36 max-w-full", e.className),
            field: e,
            type: "datetime-local",
            value: p,
            onChange: (y) => n([h, y.target.value]),
            onInputChange: e.onInputChange
          }
        )
      ] });
    }
    return /* @__PURE__ */ d.jsx(
      xe,
      {
        className: W("w-36 max-w-full", e.className),
        field: e,
        type: "datetime-local",
        value: t[0] || "",
        onChange: (h) => n([h.target.value]),
        onInputChange: e.onInputChange
      }
    );
  }
  if (["email", "url", "tel"].includes(e.type || "")) {
    const h = () => {
      switch (e.type) {
        case "email":
          return "email";
        case "url":
          return "url";
        case "tel":
          return "tel";
        default:
          return "text";
      }
    }, p = () => {
      switch (e.type) {
        case "email":
          return "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$";
        case "url":
          return "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$";
        case "tel":
          return "^[\\+]?[1-9][\\d]{0,15}$";
        default:
          return;
      }
    };
    return /* @__PURE__ */ d.jsx(
      xe,
      {
        className: e.className,
        field: e,
        pattern: e.pattern || p(),
        placeholder: e.placeholder || i.i18n.placeholders.enterField(e.type || "text"),
        type: h(),
        value: t[0] || "",
        onChange: (y) => n([y.target.value]),
        onInputChange: e.onInputChange
      }
    );
  }
  if (e.type === "daterange") {
    const h = t[0] || "", p = t[1] || "";
    return /* @__PURE__ */ d.jsxs(
      "div",
      {
        className: Je({
          variant: i.variant,
          size: i.size,
          cursorPointer: i.cursorPointer
        }),
        children: [
          /* @__PURE__ */ d.jsx(
            Et,
            {
              className: W("max-w-full", e.className),
              field: e,
              value: h,
              onChange: (y) => n([y, p])
            }
          ),
          /* @__PURE__ */ d.jsx(
            "div",
            {
              className: ut({ variant: i.variant, size: i.size }),
              "data-slot": "filters-between",
              children: i.i18n.to
            }
          ),
          /* @__PURE__ */ d.jsx(
            Et,
            {
              className: W("max-w-full", e.className),
              field: e,
              value: p,
              onChange: (y) => n([h, y])
            }
          )
        ]
      }
    );
  }
  if (e.type === "text" || e.type === "number") {
    if (e.type === "number" && r === "between") {
      const h = t[0] || "", p = t[1] || "";
      return /* @__PURE__ */ d.jsxs("div", { className: "flex items-center", "data-slot": "filters-item", children: [
        /* @__PURE__ */ d.jsx(
          xe,
          {
            className: W("w-16 max-w-full", e.className),
            field: e,
            max: e.max,
            min: e.min,
            pattern: e.pattern,
            placeholder: i.i18n.min,
            step: e.step,
            type: "number",
            value: h,
            onChange: (y) => n([y.target.value, p]),
            onInputChange: e.onInputChange
          }
        ),
        /* @__PURE__ */ d.jsx(
          "div",
          {
            className: ut({ variant: i.variant, size: i.size }),
            "data-slot": "filters-between",
            children: i.i18n.to
          }
        ),
        /* @__PURE__ */ d.jsx(
          xe,
          {
            className: W("w-16 max-w-full", e.className),
            field: e,
            max: e.max,
            min: e.min,
            pattern: e.pattern,
            placeholder: i.i18n.max,
            step: e.step,
            type: "number",
            value: p,
            onChange: (y) => n([h, y.target.value]),
            onInputChange: e.onInputChange
          }
        )
      ] });
    }
    return /* @__PURE__ */ d.jsx("div", { className: "flex items-center", "data-slot": "filters-item", children: /* @__PURE__ */ d.jsx(
      xe,
      {
        className: W("w-36", e.className),
        field: e,
        max: e.type === "number" ? e.max : void 0,
        min: e.type === "number" ? e.min : void 0,
        pattern: e.pattern,
        placeholder: e.placeholder,
        step: e.type === "number" ? e.step : void 0,
        type: e.type === "number" ? "number" : "text",
        value: t[0] || "",
        onChange: (h) => n([h.target.value]),
        onInputChange: e.onInputChange
      }
    ) });
  }
  if (e.type === "date")
    return /* @__PURE__ */ d.jsx(
      Et,
      {
        className: e.className,
        field: e,
        value: t[0] || "",
        onChange: (h) => n([h])
      }
    );
  if (e.type === "select" || e.type === "multiselect")
    return /* @__PURE__ */ d.jsx(xr, { field: e, values: t, onChange: n });
  const c = t.length > 1, u = e.options?.filter((h) => t.includes(h.value)) || [], f = e.options?.filter((h) => !t.includes(h.value)) || [];
  return /* @__PURE__ */ d.jsxs(
    mt,
    {
      open: a,
      onOpenChange: (h) => {
        o(h), h || setTimeout(() => s(""), zt);
      },
      children: [
        /* @__PURE__ */ d.jsx(
          pt,
          {
            className: Je({
              variant: i.variant,
              size: i.size,
              cursorPointer: i.cursorPointer
            }),
            children: /* @__PURE__ */ d.jsx("div", { className: "flex w-full min-w-0 items-center gap-1.5", children: e.customValueRenderer ? e.customValueRenderer(t, e.options || []) : /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
              u.length > 0 && /* @__PURE__ */ d.jsx("div", { className: "flex shrink-0 items-center -space-x-1.5", children: u.slice(0, 3).map((h) => /* @__PURE__ */ d.jsx("div", { children: h.icon }, String(h.value))) }),
              u.length === 1 ? /* @__PURE__ */ d.jsx("span", { className: "min-w-0 truncate text-accent-foreground", title: u[0].detail ? `${u[0].label} - ${u[0].detail}` : u[0].label, children: u[0].label }) : u.length > 1 ? `${u.length} ${i.i18n.selectedCount}` : i.i18n.select
            ] }) })
          }
        ),
        /* @__PURE__ */ d.jsx(gt, { className: W("w-36 p-0 data-[state=closed]:animation-none! data-[state=closed]:duration-0!", e.popoverContentClassName), children: /* @__PURE__ */ d.jsxs(ft, { children: [
          e.searchable !== !1 && /* @__PURE__ */ d.jsx(
            Ut,
            {
              className: "h-(--control-height)",
              placeholder: i.i18n.placeholders.searchField(e.label || ""),
              value: l,
              onValueChange: s
            }
          ),
          /* @__PURE__ */ d.jsxs(Xt, { className: "outline-hidden", children: [
            /* @__PURE__ */ d.jsx(Qt, { children: i.i18n.noResultsFound }),
            u.length > 0 && /* @__PURE__ */ d.jsx(Ge, { children: u.map((h) => /* @__PURE__ */ d.jsxs(
              Ee,
              {
                className: "group flex items-center gap-2",
                onSelect: () => {
                  n(c ? t.filter((p) => p !== h.value) : []), c || o(!1);
                },
                children: [
                  h.icon && h.icon,
                  /* @__PURE__ */ d.jsx("span", { className: "truncate text-accent-foreground", children: h.label }),
                  /* @__PURE__ */ d.jsx(tt, { className: "ms-auto text-primary" })
                ]
              },
              String(h.value)
            )) }),
            f.length > 0 && /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
              u.length > 0 && /* @__PURE__ */ d.jsx(He, {}),
              /* @__PURE__ */ d.jsx(Ge, { children: f.map((h) => /* @__PURE__ */ d.jsxs(
                Ee,
                {
                  className: "group flex items-center gap-2",
                  value: h.label,
                  onSelect: () => {
                    if (c) {
                      const p = [...t, h.value];
                      if (e.maxSelections && p.length > e.maxSelections)
                        return;
                      n(p);
                    } else
                      n([h.value]), o(!1);
                  },
                  children: [
                    h.icon && h.icon,
                    /* @__PURE__ */ d.jsx("span", { className: "truncate text-accent-foreground", children: h.label }),
                    /* @__PURE__ */ d.jsx(tt, { className: "ms-auto text-primary opacity-0" })
                  ]
                },
                String(h.value)
              )) })
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
function rl({
  filters: e,
  fields: t,
  onChange: n,
  className: r,
  showAddButton: a = !0,
  addButtonText: o,
  addButtonIcon: l,
  addButtonClassName: s,
  addButton: i,
  showClearButton: c = !1,
  clearButtonText: u,
  clearButtonIcon: f,
  clearButtonClassName: h,
  clearButton: p,
  onClear: y,
  variant: S = "outline",
  size: C = "md",
  radius: O = "md",
  i18n: D,
  showSearchInput: v = !0,
  cursorPointer: k = !0,
  trigger: b,
  allowMultiple: m = !0,
  popoverContentClassName: F,
  popoverAlign: B = "start",
  keyboardShortcut: $,
  onActiveFieldChange: N
}) {
  const [z, X] = ae(!1), [U, L] = ae(null), [ie, me] = ae([]);
  ue(() => {
    N?.(U);
  }, [U, N]), ue(() => {
    if (!$)
      return;
    const x = (w) => {
      const P = w.target;
      P.tagName === "INPUT" || P.tagName === "TEXTAREA" || P.isContentEditable || w.key.toLowerCase() === $.toLowerCase() && !w.metaKey && !w.ctrlKey && !w.altKey && (w.preventDefault(), X((Y) => !Y));
    };
    return window.addEventListener("keydown", x), () => window.removeEventListener("keydown", x);
  }, [$]), ue(() => {
    z && setTimeout(() => {
      const x = document.querySelector("[cmdk-input]");
      if (x)
        x.focus();
      else {
        const w = document.querySelector("[cmdk-root]");
        w && w.focus();
      }
    }, 0);
  }, [z, U, v]);
  const le = {
    ...Ve,
    ...D,
    operators: {
      ...Ve.operators,
      ...D?.operators
    },
    placeholders: {
      ...Ve.placeholders,
      ...D?.placeholders
    },
    validation: {
      ...Ve.validation,
      ...D?.validation
    }
  }, ge = oe(() => Ai(t), [t]), Z = U ? ge[U] : null, te = ne(
    (x, w) => {
      n(
        e.map((P) => {
          if (P.id === x) {
            const Y = { ...P, ...w };
            return (w.operator === "empty" || w.operator === "not_empty") && (Y.values = []), Y;
          }
          return P;
        })
      );
    },
    [e, n]
  ), ce = ne(
    (x) => {
      n(e.filter((w) => w.id !== x));
    },
    [e, n]
  ), g = ne(() => {
    X(!1), L(null), me([]);
  }, []), T = ne(
    (x) => {
      const w = ge[x];
      if (!w?.key)
        return;
      if (w.type === "select" || w.type === "multiselect") {
        L(w.key), me([]);
        return;
      }
      const P = w.defaultOperator || (w.type === "daterange" || w.type === "numberrange" ? "between" : "is");
      let Y = [];
      w.defaultValue !== void 0 ? Y = [w.defaultValue] : ["text", "number", "date", "email", "url", "tel", "time", "datetime"].includes(w.type || "") ? Y = [""] : w.type === "daterange" ? Y = ["", ""] : w.type === "numberrange" ? Y = [w.min || 0, w.max || 100] : w.type === "boolean" && (Y = [!1]);
      const V = Dn(x, P, Y);
      n([...e, V]), g();
    },
    [m, g, ge, e, n]
  ), A = ne(
    (x, w) => {
      if (!x.key)
        return;
      const P = x.defaultOperator || (x.type === "multiselect" ? "is_any_of" : "is"), Y = Dn(x.key, P, w);
      n([...e, Y]), g();
    },
    [g, e, n]
  ), _ = oe(() => yr(t).filter((w) => !w.key || w.type === "separator" ? !1 : m ? !0 : !e.some((P) => P.field === w.key)), [t, e, m]);
  return /* @__PURE__ */ d.jsx(
    hr.Provider,
    {
      value: {
        variant: S,
        size: C,
        radius: O,
        i18n: le,
        cursorPointer: k,
        className: r,
        showAddButton: a,
        addButtonText: o,
        addButtonIcon: l,
        addButtonClassName: s,
        addButton: i,
        showSearchInput: v,
        trigger: b,
        allowMultiple: m
      },
      children: /* @__PURE__ */ d.jsxs("div", { className: W(
        Ii({ variant: S, size: C }),
        e.length > 0 && "w-full",
        c && e.length > 0 && "sm:pr-24",
        r
      ), children: [
        e.map((x) => {
          const w = ge[x.field];
          return w ? /* @__PURE__ */ d.jsxs("div", { className: zi({ variant: S }), "data-slot": "filter-item", children: [
            /* @__PURE__ */ d.jsxs("div", { className: Yi({ variant: S, size: C, radius: O }), children: [
              w.icon,
              w.label
            ] }),
            /* @__PURE__ */ d.jsx(
              Vi,
              {
                field: w,
                operator: x.operator,
                values: x.values,
                onChange: (P) => te(x.id, { operator: P })
              }
            ),
            /* @__PURE__ */ d.jsx(
              Ri,
              {
                field: w,
                operator: x.operator,
                values: x.values,
                onChange: (P) => te(x.id, { values: P })
              }
            ),
            /* @__PURE__ */ d.jsx(Bi, { onClick: () => ce(x.id) })
          ] }, x.id) : null;
        }),
        a && _.length > 0 && /* @__PURE__ */ d.jsxs(
          mt,
          {
            open: z,
            onOpenChange: (x) => {
              X(x), x || (L(null), me([]));
            },
            children: [
              /* @__PURE__ */ d.jsx(pt, { asChild: !0, children: i || /* @__PURE__ */ d.jsxs(
                "button",
                {
                  className: W(
                    xn({
                      variant: S,
                      size: C,
                      cursorPointer: k,
                      radius: O
                    }),
                    s
                  ),
                  title: le.addFilterTitle,
                  type: "button",
                  children: [
                    l || /* @__PURE__ */ d.jsx(ha, {}),
                    o || le.addFilter
                  ]
                }
              ) }),
              /* @__PURE__ */ d.jsx(
                gt,
                {
                  align: B,
                  className: W(
                    "p-0 data-[state=closed]:animation-none! data-[state=closed]:duration-0!",
                    Z?.className || F || "w-[220px]"
                  ),
                  children: Z ? (
                    // The inline "add filter" picker always commits one filter per
                    // pick and closes — for both `select` and `multiselect` fields.
                    // We override `multiselect` → `select` so SelectOptionsPopover
                    // renders the single-pick UI (one click → onChange + onClose).
                    // Multi-value editing of an existing filter happens through the
                    // filter row's own picker, not here.
                    /* @__PURE__ */ d.jsx(
                      xr,
                      {
                        field: Z.type === "multiselect" ? { ...Z, type: "select" } : Z,
                        inline: !0,
                        values: ie,
                        onChange: (x) => A(Z, x),
                        onClose: g
                      }
                    )
                  ) : (
                    // Show field selection - needs Command wrapper for search/list
                    /* @__PURE__ */ d.jsxs(ft, { className: "outline-hidden", tabIndex: v ? void 0 : 0, children: [
                      v && /* @__PURE__ */ d.jsx(Ut, { className: "h-(--control-height)", placeholder: le.searchFields }),
                      /* @__PURE__ */ d.jsxs(Xt, { className: "outline-hidden", children: [
                        /* @__PURE__ */ d.jsx(Qt, { children: le.noFieldsFound }),
                        t.map((x, w) => {
                          if (pr(x)) {
                            const Y = x.fields.filter((V) => V.type === "separator" || m ? !0 : !e.some((be) => be.field === V.key));
                            return Y.length === 0 ? null : /* @__PURE__ */ d.jsx(Ge, { heading: x.group || "Fields", children: Y.map((V, be) => {
                              if (V.type === "separator") {
                                const xt = V.key ?? `${x.group ?? `group-${w}`}-separator-${be}`;
                                return /* @__PURE__ */ d.jsx(He, {}, xt);
                              }
                              return /* @__PURE__ */ d.jsxs(
                                Ee,
                                {
                                  className: "min-w-0",
                                  onSelect: () => V.key && T(V.key),
                                  children: [
                                    V.icon,
                                    /* @__PURE__ */ d.jsx("span", { className: "truncate", children: V.label })
                                  ]
                                },
                                V.key ?? `${x.group ?? `group-${w}`}-field-${be}`
                              );
                            }) }, x.group || `group-${w}`);
                          }
                          if (gr(x)) {
                            const Y = x.fields.filter((V) => V.type === "separator" || m ? !0 : !e.some((be) => be.field === V.key));
                            return Y.length === 0 ? null : /* @__PURE__ */ d.jsx(Ge, { heading: x.group || "Fields", children: Y.map((V) => {
                              if (V.type === "separator") {
                                const be = V.key || `${x.group || `group-${w}`}-separator-${V.label || Math.random()}`;
                                return /* @__PURE__ */ d.jsx(He, {}, be);
                              }
                              return /* @__PURE__ */ d.jsxs(Ee, { className: "min-w-0", onSelect: () => V.key && T(V.key), children: [
                                V.icon,
                                /* @__PURE__ */ d.jsx("span", { className: "truncate", children: V.label })
                              ] }, V.key);
                            }) }, x.group || `group-${w}`);
                          }
                          const P = x;
                          if (P.type === "separator") {
                            const Y = P.key || `flat-separator-${P.label || w}`;
                            return /* @__PURE__ */ d.jsx(He, {}, Y);
                          }
                          return !m && e.some((Y) => Y.field === P.key) ? null : /* @__PURE__ */ d.jsxs(Ee, { className: "min-w-0", onSelect: () => P.key && T(P.key), children: [
                            P.icon,
                            /* @__PURE__ */ d.jsx("span", { className: "truncate", children: P.label })
                          ] }, P.key);
                        })
                      ] })
                    ] })
                  )
                }
              )
            ]
          }
        ),
        c && e.length > 0 && (p || /* @__PURE__ */ d.jsxs(
          "button",
          {
            className: W(
              xn({
                variant: S,
                size: C,
                cursorPointer: k,
                radius: O
              }),
              "border-0 bg-transparent hover:bg-transparent hover:text-foreground",
              "sm:absolute sm:right-0 sm:top-0",
              h
            ),
            type: "button",
            onClick: () => {
              y ? y() : n([]);
            },
            children: [
              f || /* @__PURE__ */ d.jsx(Nn, {}),
              u || le.clearFilters
            ]
          }
        ))
      ] })
    }
  );
}
const Dn = (e, t, n = []) => ({
  id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
  field: e,
  operator: t || "is",
  values: n
});
export {
  Et as F,
  rl as a,
  Dn as c
};
//# sourceMappingURL=filters-CJl5ebXd.mjs.map

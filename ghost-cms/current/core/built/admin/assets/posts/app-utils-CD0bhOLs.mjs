import { m as i } from "./button-CQCNdxY6.mjs";
import { U as c, r as f } from "./index-BuIZkUhD.mjs";
const D = [
  [
    "path",
    {
      d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z",
      key: "m61m77"
    }
  ],
  ["path", { d: "M17 14V2", key: "8ymqnk" }]
], x = i("thumbs-down", D);
const Y = [
  [
    "path",
    {
      d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",
      key: "emmmcr"
    }
  ],
  ["path", { d: "M7 10v12", key: "1qc93n" }]
], v = i("thumbs-up", Y), k = (a) => a.format("YYYY-MM-DD"), w = (a) => {
  if (!a.length)
    return { min: 0, max: 1 };
  const n = a.map((u) => Number(u.value));
  let t = Math.min(...n), e = Math.max(...n);
  if (t === e) {
    const u = t;
    return { min: Math.max(0, u - 1), max: u + 1 };
  }
  const r = 0.02;
  t = Math.max(0, t - t * r), e = e + e * r;
  const l = e - t, m = Math.floor(Math.log10(l)), s = Math.pow(10, m), h = Math.round(e / s) * s;
  e = h < e ? Math.ceil(e / s) * s : h;
  const o = Math.round(t / s) * s;
  if (t = o > t ? Math.floor(t / s) * s : o, t = Math.max(0, t), t === e) {
    const u = (t + e) / 2, M = Math.max(Math.abs(u) * r, s);
    t = Math.max(0, Math.floor(u - M)), e = Math.ceil(u + M);
  }
  return t = Math.max(0, t), { min: t, max: e };
}, y = (a, n) => {
  if (!a.length)
    return 40;
  const t = Math.max(...a.map((r) => n(r).length));
  return Math.max(20, t * 8 + 20);
}, O = (a) => {
  const n = Intl.DateTimeFormat().resolvedOptions().timeZone, t = c(a).tz(n).startOf("day"), r = c().tz(n).startOf("day").diff(t, "days") + 1;
  return Math.max(r, 1);
}, z = (a) => {
  const n = Intl.DateTimeFormat().resolvedOptions().timeZone, t = c().tz(n).endOf("day");
  let e;
  return a === -1 ? e = c().tz(n).startOf("year") : e = c().tz(n).subtract(a - 1, "days").startOf("day"), { startDate: e, endDate: t, timezone: n };
}, C = (a, n, t = "value", e = "avg") => {
  if (!a.length)
    return [];
  if (n >= 91 && n <= 356) {
    const r = [];
    let l = c(a[0].date).startOf("week"), m = 0, s = 0, h = 0;
    return a.forEach((o, u) => {
      const M = c(o.date);
      M.isSame(l, "week") ? (m += Number(o[t]), s += 1, h = Number(o[t])) : (r.push({
        ...a[u - 1],
        date: l.format("YYYY-MM-DD"),
        [t]: e === "sum" ? m : e === "avg" ? s > 0 ? m / s : 0 : h
      }), l = M.startOf("week"), m = Number(o[t]), s = 1, h = Number(o[t])), u === a.length - 1 && r.push({
        ...o,
        date: l.format("YYYY-MM-DD"),
        [t]: e === "sum" ? m : e === "avg" ? s > 0 ? m / s : 0 : h
      });
    }), r;
  } else if (n > 356) {
    const r = [];
    let l = c(a[0].date).startOf("month"), m = 0, s = 0, h = 0;
    return a.forEach((o, u) => {
      const M = c(o.date);
      M.isSame(l, "month") ? (m += Number(o[t]), s += 1, h = Number(o[t])) : (r.push({
        ...a[u - 1],
        date: l.format("YYYY-MM-DD"),
        [t]: e === "sum" ? m : e === "avg" ? s > 0 ? m / s : 0 : h
      }), l = M.startOf("month"), m = Number(o[t]), s = 1, h = Number(o[t])), u === a.length - 1 && r.push({
        ...o,
        date: l.format("YYYY-MM-DD"),
        [t]: e === "sum" ? m : e === "avg" ? s > 0 ? m / s : 0 : h
      });
    }), r;
  }
  return a;
}, I = (a, n, t = !1, e = !1) => n === 1 && e ? c(a).format("h:mma") : n === 1 && t ? c(a).format("MMM D, h:mma") : n > 365 ? c(a).format("MMM YYYY") : n >= 91 ? `Week of ${f(a)}` : f(a), d = (a) => a.name && a.name.trim() || a.email || "Unknown Member", R = (a) => {
  const n = d(a), t = n.split(" ");
  return t.length >= 2 ? (t[0][0] + t[t.length - 1][0]).toUpperCase() : n.substring(0, 2).toUpperCase();
};
export {
  x as T,
  v as a,
  d as b,
  y as c,
  k as d,
  z as e,
  I as f,
  R as g,
  O as h,
  w as i,
  C as s
};
//# sourceMappingURL=app-utils-CD0bhOLs.mjs.map

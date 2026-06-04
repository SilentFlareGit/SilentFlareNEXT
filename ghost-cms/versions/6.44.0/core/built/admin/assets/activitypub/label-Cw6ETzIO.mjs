import { aO as r, aZ as s, ai as i, az as n, aK as d } from "./index-D_R_kUw4.mjs";
var c = "Label", o = r((e, t) => /* @__PURE__ */ s.jsx(
  i.label,
  {
    ...e,
    ref: t,
    onMouseDown: (a) => {
      a.target.closest("button, input, select, textarea") || (e.onMouseDown?.(a), !a.defaultPrevented && a.detail > 1 && a.preventDefault());
    }
  }
));
o.displayName = c;
var l = o;
const u = d(
  "text-control leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
), m = r(({ className: e, ...t }, a) => /* @__PURE__ */ s.jsx(
  l,
  {
    ref: a,
    className: n(u(), e),
    ...t
  }
));
m.displayName = l.displayName;
export {
  m as L
};
//# sourceMappingURL=label-Cw6ETzIO.mjs.map

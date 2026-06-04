import { x as s, Q as l, i as m } from "./index-BuIZkUhD.mjs";
import { P as v } from "./index-DzWTmJMy.mjs";
var N = "Separator", e = "horizontal", f = ["horizontal", "vertical"], p = s((r, a) => {
  const { decorative: t, orientation: o = e, ...i } = r, n = u(o) ? o : e, d = t ? { role: "none" } : { "aria-orientation": n === "vertical" ? n : void 0, role: "separator" };
  return /* @__PURE__ */ l.jsx(
    v.div,
    {
      "data-orientation": n,
      ...d,
      ...i,
      ref: a
    }
  );
});
p.displayName = N;
function u(r) {
  return f.includes(r);
}
var c = p;
const x = s(
  ({ className: r, orientation: a = "horizontal", decorative: t = !0, ...o }, i) => /* @__PURE__ */ l.jsx(
    c,
    {
      ref: i,
      className: m(
        "shrink-0 bg-border",
        a === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        r
      ),
      decorative: t,
      orientation: a,
      ...o
    }
  )
);
x.displayName = c.displayName;
export {
  x as S
};
//# sourceMappingURL=separator-C7QPCSjM.mjs.map

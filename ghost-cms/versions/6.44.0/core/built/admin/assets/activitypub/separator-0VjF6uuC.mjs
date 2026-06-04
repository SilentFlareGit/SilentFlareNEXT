import { aO as s, aZ as l, ai as v, az as m } from "./index-D_R_kUw4.mjs";
var N = "Separator", e = "horizontal", u = ["horizontal", "vertical"], p = s((a, r) => {
  const { decorative: t, orientation: o = e, ...i } = a, n = O(o) ? o : e, d = t ? { role: "none" } : { "aria-orientation": n === "vertical" ? n : void 0, role: "separator" };
  return /* @__PURE__ */ l.jsx(
    v.div,
    {
      "data-orientation": n,
      ...d,
      ...i,
      ref: r
    }
  );
});
p.displayName = N;
function O(a) {
  return u.includes(a);
}
var c = p;
const f = s(
  ({ className: a, orientation: r = "horizontal", decorative: t = !0, ...o }, i) => /* @__PURE__ */ l.jsx(
    c,
    {
      ref: i,
      className: m(
        "shrink-0 bg-border",
        r === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        a
      ),
      decorative: t,
      orientation: r,
      ...o
    }
  )
);
f.displayName = c.displayName;
export {
  f as S
};
//# sourceMappingURL=separator-0VjF6uuC.mjs.map

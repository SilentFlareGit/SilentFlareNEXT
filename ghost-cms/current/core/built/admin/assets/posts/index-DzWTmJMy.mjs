import { x as p, Q as l } from "./index-BuIZkUhD.mjs";
import { o as f } from "./button-CQCNdxY6.mjs";
var u = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], c = u.reduce((t, i) => {
  const o = f(`Primitive.${i}`), r = p((e, s) => {
    const { asChild: a, ...m } = e, n = a ? o : i;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ l.jsx(n, { ...m, ref: s });
  });
  return r.displayName = `Primitive.${i}`, { ...t, [i]: r };
}, {});
export {
  c as P
};
//# sourceMappingURL=index-DzWTmJMy.mjs.map

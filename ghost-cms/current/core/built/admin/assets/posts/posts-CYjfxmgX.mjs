import { d as p, b as r, e as i, c as u } from "./hooks-D4pJ_p_P.mjs";
const a = "PostsResponseType", g = p({
  dataType: a,
  path: "/posts/"
}), m = u({
  dataType: a,
  path: "/posts/",
  defaultNextPageParams: (t, e) => {
    if (t.meta?.pagination.next)
      return {
        ...e,
        page: t.meta.pagination.next.toString()
      };
  },
  returnData: (t) => {
    const { pages: e } = t, o = e.flatMap((n) => n.posts), s = e[e.length - 1].meta;
    return {
      posts: o,
      meta: s,
      isEnd: s ? s.pagination.pages === s.pagination.page : !0
    };
  }
}), d = i({
  dataType: a,
  path: (t) => `/posts/${t}/`
}), h = r({
  method: "DELETE",
  path: (t) => `/posts/${t}/`
});
export {
  m as a,
  h as b,
  d as g,
  g as u
};
//# sourceMappingURL=posts-CYjfxmgX.mjs.map

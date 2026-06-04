import { ak as L, Q as e, u as k, x as I, al as M, L as b } from "./index-BuIZkUhD.mjs";
import { M as R } from "./main-layout-DejRuxP8.mjs";
import { a as z, u as B, L as E } from "./virtual-list-window-DqbQUkIo.mjs";
import { B as i } from "./button-CQCNdxY6.mjs";
import { T as S, d as A, e as p, c as x, a as G, b as c } from "./table-CZCVviNy.mjs";
import { P as $ } from "./pencil-DDnfXQqn.mjs";
import { h as w } from "./skeleton-DrFcKwP3.mjs";
import { E as H } from "./empty-indicator-Wiukrx4T.mjs";
import { L as _ } from "./loading-indicator-BsY7eGY6.mjs";
import { T as Q, a as N } from "./toggle-group-B_ubMZvo.mjs";
import { L as u, P as r } from "./list-page-DQIiFvFP.mjs";
import { c as D } from "./hooks-D4pJ_p_P.mjs";
import { E as V } from "./ellipsis-BIs4PL5-.mjs";
import { P as O } from "./plus-DW3bG6ui.mjs";
import { T as W } from "./tags-CkyGqwqi.mjs";
const v = ({ height: a }) => /* @__PURE__ */ e.jsx("tr", { "aria-hidden": "true", className: "flex lg:table-row", children: /* @__PURE__ */ e.jsx("td", { className: "flex lg:table-cell", style: { height: a } }) }), q = I(function(s, l) {
  return /* @__PURE__ */ e.jsx(
    p,
    {
      ref: l,
      ...s,
      "aria-hidden": "true",
      className: "relative flex flex-col lg:table-row",
      children: /* @__PURE__ */ e.jsx(c, { className: "relative z-10 h-24 animate-pulse", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-md bg-muted", "data-testid": "loading-placeholder" }) })
    }
  );
});
function F({
  items: a,
  totalItems: s,
  hasNextPage: l,
  isFetchingNextPage: t,
  fetchNextPage: o
}) {
  const d = L(null), { visibleItemCount: m, canLoadMore: g, loadMore: h } = z(s), { visibleItems: P, spaceBefore: T, spaceAfter: y } = B({
    items: a,
    totalItems: m,
    hasNextPage: l,
    isFetchingNextPage: t,
    fetchNextPage: o,
    parentRef: d
  });
  return /* @__PURE__ */ e.jsxs("div", { ref: d, className: "overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs(
      S,
      {
        className: "flex table-fixed flex-col lg:table",
        "data-testid": "tags-list",
        children: [
          /* @__PURE__ */ e.jsx(A, { className: "hidden lg:visible! lg:table-header-group!", children: /* @__PURE__ */ e.jsxs(p, { children: [
            /* @__PURE__ */ e.jsx(x, { className: "w-auto px-4", children: "Tag" }),
            /* @__PURE__ */ e.jsx(x, { className: "w-1/5 px-4", children: "Slug" }),
            /* @__PURE__ */ e.jsx(x, { className: "w-1/5 px-4", children: "No. of posts" }),
            /* @__PURE__ */ e.jsx(x, { className: "w-20 px-4" })
          ] }) }),
          /* @__PURE__ */ e.jsxs(G, { className: "flex flex-col lg:table-row-group", children: [
            /* @__PURE__ */ e.jsx(v, { height: T }),
            P.map(({ key: f, virtualItem: C, item: n, props: j }) => C.index > a.length - 1 ? /* @__PURE__ */ e.jsx(q, { ...j }, f) : /* @__PURE__ */ e.jsxs(
              p,
              {
                ...j,
                className: "group grid w-full grid-cols-[1fr_5rem] items-center gap-x-4 p-2 hover:bg-muted/50 md:grid-cols-[1fr_auto_5rem] lg:table-row lg:p-0 [&.group:hover_td]:bg-transparent",
                "data-testid": "tag-list-row",
                children: [
                  /* @__PURE__ */ e.jsxs(c, { className: "static col-start-1 col-end-1 row-start-1 row-end-1 flex min-w-0 flex-col p-0 md:relative lg:table-cell lg:w-1/2 lg:p-4 xl:w-3/5", children: [
                    /* @__PURE__ */ e.jsx(
                      "a",
                      {
                        className: "before:absolute before:top-0 before:left-0 before:z-10 before:h-full before:w-[100vw]",
                        href: `#/tags/${n.slug}`,
                        children: /* @__PURE__ */ e.jsx("span", { className: "block truncate text-base text-md font-semibold", children: n.name })
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { className: "block truncate text-muted-foreground", children: n.description })
                  ] }),
                  /* @__PURE__ */ e.jsx(c, { className: "col-start-1 col-end-1 row-start-2 row-end-2 flex p-0 lg:table-cell lg:p-4", children: /* @__PURE__ */ e.jsx("span", { className: "block truncate", children: n.slug }) }),
                  /* @__PURE__ */ e.jsx(c, { className: "col-start-1 col-end-1 row-start-3 row-end-3 flex p-0 md:col-start-2 md:col-end-2 md:row-start-1 md:row-end-3 lg:table-cell lg:p-4", children: n.count?.posts ? /* @__PURE__ */ e.jsx(
                    "a",
                    {
                      className: "relative z-10 -m-4 inline-block p-4 hover:underline",
                      href: `#/posts?tag=${n.slug}`,
                      children: `${k(n.count?.posts)}  ${n.count?.posts === 1 ? "post" : "posts"}`
                    }
                  ) : /* @__PURE__ */ e.jsx("span", { className: "text-muted-foreground", children: "0 posts" }) }),
                  /* @__PURE__ */ e.jsx(c, { className: "col-start-2 col-end-2 row-start-1 row-end-3 p-0 md:col-start-3 md:col-end-3 lg:table-cell lg:p-4", children: /* @__PURE__ */ e.jsx(
                    i,
                    {
                      "aria-hidden": "true",
                      className: "opacity-0 transition-all group-hover:opacity-100",
                      size: "icon",
                      tabIndex: -1,
                      variant: "outline",
                      children: /* @__PURE__ */ e.jsx($, {})
                    }
                  ) })
                ]
              },
              f
            )),
            /* @__PURE__ */ e.jsx(v, { height: y })
          ] })
        ]
      }
    ),
    g && /* @__PURE__ */ e.jsx(E, { isLoading: t, onClick: h })
  ] });
}
const J = "TagsResponseType", K = D({
  dataType: J,
  path: "/tags/",
  defaultNextPageParams: (a, s) => a.meta?.pagination.next ? {
    ...s,
    page: (a.meta?.pagination.next || 1).toString()
  } : void 0,
  returnData: (a) => {
    const { pages: s } = a, l = s.flatMap((o) => o.tags), t = s[s.length - 1].meta;
    return {
      tags: l,
      meta: t,
      isEnd: t ? t.pagination.pages === t.pagination.page : !0
    };
  }
}), U = ({
  filter: a,
  ...s
}) => {
  const l = Object.entries(a).map(([t, o]) => `${t}:${o}`).join(",");
  return K({
    ...s,
    searchParams: {
      limit: "100",
      order: "name asc",
      include: "count.posts",
      filter: l,
      ...s.searchParams
    }
  });
}, ge = () => {
  const [a, s] = M(), l = a.get("type") ?? "public", {
    data: t,
    isError: o,
    isLoading: d,
    isFetchingNextPage: m,
    fetchNextPage: g,
    hasNextPage: h
  } = U({
    filter: {
      visibility: l
    }
  });
  return /* @__PURE__ */ e.jsx(R, { children: /* @__PURE__ */ e.jsxs(u, { "data-testid": "tags-page", children: [
    /* @__PURE__ */ e.jsx(u.Header, { children: /* @__PURE__ */ e.jsxs(r, { blurredBackground: !1, sticky: !1, children: [
      /* @__PURE__ */ e.jsx(r.Left, { children: /* @__PURE__ */ e.jsx(r.Title, { children: "Tags" }) }),
      /* @__PURE__ */ e.jsxs(r.Actions, { children: [
        /* @__PURE__ */ e.jsxs(r.ActionGroup, { children: [
          /* @__PURE__ */ e.jsxs(Q, { "data-testid": "tags-header-tabs", size: "button", type: "single", value: l, children: [
            /* @__PURE__ */ e.jsx(N, { "aria-label": "Public tags", value: "public", asChild: !0, children: /* @__PURE__ */ e.jsx(b, { to: "/tags", children: "Public tags" }) }),
            /* @__PURE__ */ e.jsx(N, { "aria-label": "Internal tags", value: "internal", asChild: !0, children: /* @__PURE__ */ e.jsx(b, { to: "/tags?type=internal", children: "Internal tags" }) })
          ] }),
          /* @__PURE__ */ e.jsxs(r.ActionGroup.MobileMenu, { children: [
            /* @__PURE__ */ e.jsx(r.ActionGroup.MobileMenuTrigger, { children: /* @__PURE__ */ e.jsx(i, { variant: "outline", children: /* @__PURE__ */ e.jsx(V, { className: "size-4" }) }) }),
            /* @__PURE__ */ e.jsxs(r.ActionGroup.MobileMenuContent, { children: [
              /* @__PURE__ */ e.jsx(
                w,
                {
                  checked: l === "public",
                  onCheckedChange: () => s({}),
                  children: "Public tags"
                }
              ),
              /* @__PURE__ */ e.jsx(
                w,
                {
                  checked: l === "internal",
                  onCheckedChange: () => s({ type: "internal" }),
                  children: "Internal tags"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(r.ActionGroup, { children: /* @__PURE__ */ e.jsx(i, { asChild: !0, children: /* @__PURE__ */ e.jsxs("a", { className: "font-bold", href: "#/tags/new", children: [
          /* @__PURE__ */ e.jsx(O, { className: "size-4" }),
          /* @__PURE__ */ e.jsx("span", { className: "hidden sm:inline", children: "New tag" })
        ] }) }) })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsx(u.Body, { children: d ? /* @__PURE__ */ e.jsx("div", { className: "flex flex-1 items-center justify-center", children: /* @__PURE__ */ e.jsx(_, { size: "lg" }) }) : o ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-1 flex-col items-center justify-center", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "mb-2 text-xl font-medium", children: "Error loading tags" }),
      /* @__PURE__ */ e.jsx("p", { className: "mb-4 text-muted-foreground", children: "Please reload the page to try again" }),
      /* @__PURE__ */ e.jsx(i, { onClick: () => window.location.reload(), children: "Reload page" })
    ] }) : t?.tags.length ? /* @__PURE__ */ e.jsx(
      F,
      {
        fetchNextPage: g,
        hasNextPage: h,
        isFetchingNextPage: m,
        items: t?.tags ?? [],
        totalItems: t?.meta?.pagination?.total ?? 0
      }
    ) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-1 items-center justify-center", children: /* @__PURE__ */ e.jsx(
      H,
      {
        actions: /* @__PURE__ */ e.jsx(i, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: "#/tags/new", children: "Create a new tag" }) }),
        title: "Start organizing your content",
        children: /* @__PURE__ */ e.jsx(W, {})
      }
    ) }) })
  ] }) });
};
export {
  ge as default
};
//# sourceMappingURL=tags-BAmugIR1.mjs.map

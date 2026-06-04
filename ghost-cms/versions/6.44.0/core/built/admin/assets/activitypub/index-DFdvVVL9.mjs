import { aF as _, aZ as t, a1 as z, al as $, bC as g, bF as S, bK as u, br as I, aV as E, O as P, a4 as L, N as U, M as W, s as B, ar as N, A as w, t as H, u as O, W as C, aR as b, b3 as D, b5 as F, b6 as R, b2 as V, T as q, a6 as G, ak as K } from "./index-D_R_kUw4.mjs";
import { A as Z } from "./at-sign-DFqxysHx.mjs";
import { R as Q } from "./reply-CZEE7r_8.mjs";
const J = [
  ["path", { d: "m2 9 3-3 3 3", key: "1ltn5i" }],
  ["path", { d: "M13 18H7a2 2 0 0 1-2-2V6", key: "1r6tfw" }],
  ["path", { d: "m22 15-3 3-3-3", key: "4rnwn2" }],
  ["path", { d: "M11 6h6a2 2 0 0 1 2 2v10", key: "2f72bc" }]
], X = _("repeat-2", J);
const Y = [
  ["path", { d: "M2 21a8 8 0 0 1 13.292-6", key: "bjp14o" }],
  ["circle", { cx: "10", cy: "8", r: "5", key: "o932ke" }],
  ["path", { d: "m16 19 2 2 4-4", key: "1b14m6" }]
], ee = _("user-round-check", Y), A = ({ notificationType: a, size: l = "lg", className: c }) => {
  let r, s = "";
  const n = "white", o = l === "sm" ? 13 : 20, i = l === "sm" ? 2 : 1.5;
  switch (a) {
    case "follow":
      r = /* @__PURE__ */ t.jsx(ee, { className: `-mt-0.5 -mr-0.5 ${l === "sm" && "size-[11px]"}`, color: n, size: o, strokeWidth: i }), s = "bg-blue-600";
      break;
    case "like":
      r = /* @__PURE__ */ t.jsx(z, { className: `${l === "sm" ? "size-[11px]" : "mt-px size-5"}`, color: n, strokeWidth: i }), s = "bg-pink-600";
      break;
    case "reply":
      r = /* @__PURE__ */ t.jsx(Q, { className: "mr-px mb-px", color: n, size: o, strokeWidth: i }), s = "bg-purple-600";
      break;
    case "repost":
      r = /* @__PURE__ */ t.jsx(X, { color: n, size: o, strokeWidth: i }), s = "bg-green-500";
      break;
    case "mention":
      r = /* @__PURE__ */ t.jsx(Z, { className: `${l === "sm" ? "size-[12px]" : "size-5"}`, color: n, size: o, strokeWidth: i }), s = "bg-orange-500";
      break;
  }
  return /* @__PURE__ */ t.jsx("div", { className: `flex ${l === "sm" ? "size-5" : "size-9"} items-center justify-center rounded-full ${s} ${c && c}`, children: r });
}, te = $.createContext(void 0), x = ({ isGrouped: a, centerAlign: l, children: c, onClick: r, url: s, className: n }) => /* @__PURE__ */ t.jsx(te.Provider, { value: { onClick: r, url: s }, children: /* @__PURE__ */ t.jsx(
  "div",
  {
    className: `group relative -mx-4 -my-px ${a ? "grid" : "flex"} ${l ? "items-center" : "items-start"} break-anywhere cursor-pointer grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 rounded-lg px-4 py-5 text-left hover:bg-gray-100 ${n}`,
    role: "button",
    onClick: r,
    children: c
  }
) }), se = ({ size: a = "lg", type: l }) => /* @__PURE__ */ t.jsx("div", { className: "col-start-1 row-start-1", children: /* @__PURE__ */ t.jsx(A, { notificationType: l, size: a }) }), ae = ({ children: a }) => /* @__PURE__ */ t.jsx("div", { className: "col-start-2 row-start-1 flex gap-2", children: a }), ne = ({ children: a }) => /* @__PURE__ */ t.jsx("div", { className: "col-start-2 row-start-2 -mt-0.5 grow overflow-hidden", children: a });
x.Icon = se;
x.Avatars = ae;
x.Content = ne;
const le = () => /* @__PURE__ */ t.jsx("div", { className: "h-px w-full bg-gray-200 dark:bg-gray-950" });
function re(a) {
  const r = new Date(a).getTime();
  return (Math.floor(r / 864e5) * 864e5).toString();
}
function ce(a) {
  const l = {};
  let c = null, r = 0;
  return a.forEach((s) => {
    s.type !== c && (r += 1, c = s.type);
    let n = "";
    const o = `_${re(s.createdAt)}`, i = `_seq${r}`;
    switch (s.type) {
      case "like":
        s.post?.id && (n = `like_${s.post.id}${o}${i}`);
        break;
      case "reply":
        n = `reply_${s.id}`;
        break;
      case "repost":
        s.post?.id && (n = `repost_${s.post.id}${o}${i}`);
        break;
      case "follow":
        n = `follow_${o}${i}`;
        break;
      case "mention":
        n = `mention_${s.id}`;
        break;
    }
    l[n] || (l[n] = {
      id: s.id,
      type: s.type,
      actors: [],
      post: s.post,
      inReplyTo: s.inReplyTo,
      createdAt: s.createdAt
    }), l[n].actors.find((y) => y.id === s.actor.id) || l[n].actors.push(s.actor);
  }), Object.values(l);
}
const ie = ({ group: a }) => {
  const [l, ...c] = a.actors, r = c.length > 0, s = "cursor-pointer font-semibold hover:underline text-black dark:text-white", n = g(), o = /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
    /* @__PURE__ */ t.jsx(K, { actor: l, align: "center", isCurrentUser: !1, children: /* @__PURE__ */ t.jsx(
      "span",
      {
        className: s,
        onClick: (i) => {
          i?.stopPropagation(), b(l.handle, n);
        },
        children: l.name
      }
    ) }),
    r && ` and ${c.length} ${c.length > 1 ? "others" : "other"}`
  ] });
  switch (a.type) {
    case "follow":
      return /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        o,
        " followed you"
      ] });
    case "like":
      return /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        o,
        " liked your ",
        a.post?.type === "article" ? "post" : "note"
      ] });
    case "repost":
      return /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        o,
        " reposted your ",
        a.post?.type === "article" ? "post" : "note"
      ] });
    case "reply":
      if (a.inReplyTo && typeof a.inReplyTo != "string")
        return o;
      break;
    case "mention":
      return o;
  }
  return /* @__PURE__ */ t.jsx(t.Fragment, {});
}, oe = ({ content: a, className: l, stripTags: c = [] }) => {
  const r = u(null), s = g();
  return I(() => {
    const n = r.current;
    if (!n)
      return;
    const o = (i) => {
      const f = i.target.closest("a[data-profile]");
      if (f) {
        const h = f.getAttribute("data-profile")?.trim();
        /^@([\w.-]+)@([\w-]+\.[\w.-]+[a-zA-Z])$/.test(h || "") && h && (i.preventDefault(), i.stopPropagation(), b(h, s));
      }
    };
    return n.addEventListener("click", o), () => {
      n.removeEventListener("click", o);
    };
  }, [s, a]), /* @__PURE__ */ t.jsx(
    "div",
    {
      dangerouslySetInnerHTML: { __html: F(R(a || "", c)) },
      ref: r,
      className: l
    }
  );
}, xe = () => {
  const [a, l] = $.useState({}), c = g(), r = (e) => {
    l((d) => ({
      ...d,
      [e]: !d[e]
    }));
  }, s = () => {
  }, n = 5, { data: o, error: i, fetchNextPage: y, hasNextPage: f, isFetchingNextPage: h, isLoading: k } = S("index"), j = o?.pages.flatMap((e) => ce(e.notifications)) ?? Array(10).fill({ actors: [{}] }), p = u(null), v = u(null);
  I(() => (p.current && p.current.disconnect(), p.current = new IntersectionObserver((e) => {
    e[0].isIntersecting && f && !h && y();
  }), v.current && p.current.observe(v.current), () => {
    p.current && p.current.disconnect();
  }), [f, h, y]);
  const M = (e, d) => {
    switch (e.type) {
      case "like":
        e.post && c(`/${e.post.type === "article" ? "reader" : "notes"}/${encodeURIComponent(e.post.id)}`);
        break;
      case "reply":
        e.post && e.inReplyTo && c(`/notes/${encodeURIComponent(e.post.id)}`);
        break;
      case "repost":
        e.post && c(`/${e.post.type === "article" ? "reader" : "notes"}/${encodeURIComponent(e.post.id)}`);
        break;
      case "follow":
        e.actors.length > 1 ? r(e.id || `${e.type}_${d}`) : b(e.actors[0].handle, c);
        break;
      case "mention":
        e.post && c(`/notes/${encodeURIComponent(e.post.id)}`);
        break;
    }
  };
  return i && E(i) ? /* @__PURE__ */ t.jsx(P, { errorCode: i.code, statusCode: i.statusCode }) : /* @__PURE__ */ t.jsx(L, { children: /* @__PURE__ */ t.jsxs("div", { className: "z-0 flex w-full flex-col items-center", children: [
    k === !1 && j.length === 0 && /* @__PURE__ */ t.jsxs(U, { children: [
      /* @__PURE__ */ t.jsx(W, { children: /* @__PURE__ */ t.jsx(B, {}) }),
      "Quiet for now, but not for long! When someone likes, boosts, or replies to you, you'll find it here."
    ] }),
    j.length > 0 && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
      /* @__PURE__ */ t.jsx("div", { className: "my-8 flex w-full max-w-[620px] flex-col max-md:mt-5", children: j.map((e, d) => /* @__PURE__ */ t.jsxs($.Fragment, { children: [
        /* @__PURE__ */ t.jsxs(
          x,
          {
            centerAlign: e.actors.length < 2 && e.type === "follow",
            className: "hover:bg-gray-100 dark:hover:bg-gray-950",
            isGrouped: e.actors.length > 1,
            onClick: () => M(e, d),
            children: [
              k ? /* @__PURE__ */ t.jsx(N, { className: "rounded-full", containerClassName: "flex h-10 w-10" }) : e.actors.length > 1 ? /* @__PURE__ */ t.jsx(x.Icon, { type: e.type }) : /* @__PURE__ */ t.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ t.jsx(
                  w,
                  {
                    author: {
                      icon: {
                        url: e.actors[0].avatarUrl || ""
                      },
                      name: e.actors[0].name,
                      handle: e.actors[0].handle
                    },
                    size: "notification"
                  },
                  e.actors[0].id
                ),
                /* @__PURE__ */ t.jsx(A, { className: "absolute -right-1 -bottom-1 z-10 border-2 border-white dark:border-black", notificationType: e.type, size: "sm" })
              ] }),
              e.actors.length > 1 && /* @__PURE__ */ t.jsx(x.Avatars, { children: /* @__PURE__ */ t.jsxs("div", { className: "flex w-full flex-col", children: [
                /* @__PURE__ */ t.jsxs("div", { className: "relative flex w-fit items-center pl-2", children: [
                  !a[e.id || `${e.type}_${d}`] && e.actors.slice(0, n).map((m) => /* @__PURE__ */ t.jsx(
                    w,
                    {
                      author: {
                        icon: {
                          url: m.avatarUrl || ""
                        },
                        name: m.name,
                        handle: m.handle
                      },
                      className: "-ml-2 bg-[#F3F3F3]! outline outline-2 outline-white group-hover:bg-[#EDEEF0]! group-hover:outline-gray-100 dark:outline-black group-hover:dark:outline-gray-950",
                      size: "notification"
                    },
                    m.id
                  )),
                  e.actors.length > n && !a[e.id || `${e.type}_${d}`] && /* @__PURE__ */ t.jsx("div", { className: "absolute right-[28px] z-10 flex size-9 items-center justify-center rounded-full bg-black/50 text-base font-semibold tracking-tightest text-white", children: `+${e.actors.length - n}` }),
                  e.actors.length > 1 && /* @__PURE__ */ t.jsxs(H, { className: `group flex items-center gap-0.5 text-gray-700 hover:bg-transparent hover:text-black dark:text-gray-600 dark:hover:text-white ${a[e.id || `${e.type}_${d}`] ? "ml-[-20px]" : "ml-0 w-[28px]"}`, variant: "ghost", onClick: (m) => {
                    m?.stopPropagation(), r(e.id || `${e.type}_${d}`);
                  }, children: [
                    /* @__PURE__ */ t.jsx(O, { className: `${a[e.id || `${e.type}_${d}`] ? "rotate-180" : ""}`, size: 20, strokeWidth: 1.5 }),
                    a[e.id || `${e.type}_${d}`] ? "Hide" : /* @__PURE__ */ t.jsx("span", { className: "sr-only", children: "Show all" })
                  ] })
                ] }),
                /* @__PURE__ */ t.jsx("div", { className: `overflow-hidden transition-all duration-300 ease-in-out  ${a[e.id || `${e.type}_${d}`] ? "mb-2 max-h-[1384px] opacity-100" : "max-h-0 opacity-0"}`, children: a[e.id || `${e.type}_${d}`] && e.actors.length > 1 && /* @__PURE__ */ t.jsx("div", { className: "flex flex-col gap-2 pt-2", children: e.actors.map((m) => /* @__PURE__ */ t.jsxs(
                  "div",
                  {
                    className: "group/item break-anywhere flex items-center justify-between gap-4",
                    onClick: (T) => {
                      T?.stopPropagation(), b(m.handle, c);
                    },
                    children: [
                      /* @__PURE__ */ t.jsxs("div", { className: "flex min-w-0 items-center", children: [
                        /* @__PURE__ */ t.jsx(w, { author: {
                          icon: {
                            url: m.avatarUrl || ""
                          },
                          name: m.name,
                          handle: m.handle
                        }, size: "xs" }),
                        /* @__PURE__ */ t.jsx("span", { className: "ml-2 line-clamp-1 text-base font-semibold group-hover/item:underline dark:text-white", children: m.name }),
                        /* @__PURE__ */ t.jsx("span", { className: "ml-1 line-clamp-1 text-base text-gray-700 dark:text-gray-600", children: m.handle })
                      ] }),
                      e.type === "follow" && !m.followedByMe && /* @__PURE__ */ t.jsx(
                        C,
                        {
                          following: !1,
                          handle: m.handle,
                          variant: "link"
                        }
                      )
                    ]
                  },
                  m.id
                )) }) })
              ] }) }),
              /* @__PURE__ */ t.jsxs(x.Content, { children: [
                /* @__PURE__ */ t.jsx("div", { children: k ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
                  /* @__PURE__ */ t.jsx(N, {}),
                  /* @__PURE__ */ t.jsx(N, { className: "w-full max-w-60" })
                ] }) : /* @__PURE__ */ t.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ t.jsx("span", { className: "truncate", children: /* @__PURE__ */ t.jsx(ie, { group: e }) }),
                    e.actors.length < 2 && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
                      /* @__PURE__ */ t.jsx("span", { className: "mt-px text-[8px] text-gray-700 dark:text-gray-600", children: "•" }),
                      /* @__PURE__ */ t.jsx("span", { className: "mt-0.5 text-sm text-gray-700 dark:text-gray-600", children: D(e, !1) })
                    ] })
                  ] }),
                  e.actors.length === 1 && (e.type === "follow" || e.type === "reply" || e.type === "mention") && !e.actors[0].followedByMe && /* @__PURE__ */ t.jsx(
                    C,
                    {
                      following: !1,
                      handle: e.actors[0].handle,
                      variant: "link"
                    }
                  )
                ] }) }),
                (e.type === "reply" && e.inReplyTo || e.type === "mention" || e.type === "like" && !e.post?.name && e.post?.content || e.type === "repost" && !e.post?.name && e.post?.content) && (e.type !== "reply" && e.type !== "mention" ? /* @__PURE__ */ t.jsxs("div", { className: "ap-note-content mt-0.5 line-clamp-1 text-sm text-pretty text-gray-700 dark:text-gray-600", children: [
                  e.post?.type === "article" && e.post?.title && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
                    e.post.title,
                    " — "
                  ] }),
                  /* @__PURE__ */ t.jsx("span", { dangerouslySetInnerHTML: { __html: F(R(e.post?.content || "")) } })
                ] }) : /* @__PURE__ */ t.jsx(t.Fragment, { children: /* @__PURE__ */ t.jsxs("div", { className: "mt-2.5 rounded-md bg-gray-100 px-5 py-[14px] group-hover:bg-gray-200 dark:bg-gray-950/30 group-hover:dark:bg-black/40", children: [
                  /* @__PURE__ */ t.jsx(
                    oe,
                    {
                      className: "ap-note-content text-pretty",
                      content: e.post?.content || "",
                      stripTags: ["a"]
                    }
                  ),
                  e.post && e.post.attachments && e.post.attachments.length > 0 && /* @__PURE__ */ t.jsx("div", { className: "notification-attachments mb-1 [&_.attachment-gallery]:flex [&_.attachment-gallery]:flex-wrap [&_img]:aspect-square [&_img]:max-w-[calc(20%-6.4px)]", children: V(
                    { ...e.post, type: "Note", attachment: e.post.attachments }
                  ) })
                ] }) })),
                (e.type === "reply" && e.post || e.type === "mention") && /* @__PURE__ */ t.jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ t.jsx(
                  q,
                  {
                    actor: {
                      ...e.actors[0],
                      icon: {
                        url: e.actors[0].avatarUrl || ""
                      },
                      id: e.actors[0].url,
                      preferredUsername: e.actors[0].handle?.replace(/^@([^@]+)@.*$/, "$1") || "unknown"
                    },
                    buttonClassName: "hover:bg-gray-200",
                    commentCount: e.post.replyCount || 0,
                    layout: "notification",
                    likeCount: e.post.likeCount || 0,
                    object: {
                      ...e.post,
                      liked: e.post.likedByMe,
                      reposted: e.post.repostedByMe
                    },
                    repostCount: e.post.repostCount || 0,
                    onLikeClick: s
                  }
                ) })
              ] })
            ]
          }
        ),
        d < j.length - 1 && /* @__PURE__ */ t.jsx("div", { className: "pl-[52px]", children: /* @__PURE__ */ t.jsx(le, {}) })
      ] }, e.id || `${e.type}_${d}`)) }),
      /* @__PURE__ */ t.jsx("div", { ref: v, className: "h-1" }),
      h && /* @__PURE__ */ t.jsx("div", { className: "-mt-4 mb-8 flex flex-col items-center justify-center gap-4 text-center", children: /* @__PURE__ */ t.jsx(G, { size: "md" }) })
    ] })
  ] }) });
};
export {
  xe as default
};
//# sourceMappingURL=index-DFdvVVL9.mjs.map

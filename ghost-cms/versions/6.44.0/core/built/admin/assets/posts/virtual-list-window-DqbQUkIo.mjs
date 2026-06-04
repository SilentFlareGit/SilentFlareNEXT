import { Q as A, aj as H, am as j, p as N, ad as K, a9 as C, ae as P, ak as U } from "./index-BuIZkUhD.mjs";
import { B as J } from "./button-CQCNdxY6.mjs";
const gt = ({ isLoading: o, onClick: a }) => {
  const t = !!o;
  return /* @__PURE__ */ A.jsx("div", { className: "flex justify-center px-4 py-6", children: /* @__PURE__ */ A.jsx(
    J,
    {
      disabled: t,
      variant: "outline",
      onClick: a,
      children: t ? "Loading more..." : "Load more"
    }
  ) });
};
function D(o) {
  const t = o instanceof HTMLElement && window.getComputedStyle(o).overflowY, s = t !== "visible" && t !== "hidden";
  if (o) {
    if (s && o.scrollHeight >= o.clientHeight)
      return o;
  } else return null;
  return D(o.parentNode) || document.body;
}
function q(o, a, t) {
  const s = new Array(o);
  return new Proxy(s, {
    get(e, n, i) {
      if (typeof n == "string") {
        const r = n.charCodeAt(0);
        if (r >= 48 && r <= 57) {
          const l = +n;
          if (Number.isInteger(l) && l >= 0 && l < o) {
            let h = e[l];
            if (!h) {
              const c = a[l * 2];
              h = e[l] = {
                index: l,
                key: t(l),
                start: c,
                size: a[l * 2 + 1],
                end: c + a[l * 2 + 1],
                lane: 0
              };
            }
            return h;
          }
        }
        if (n === "length") return o;
      }
      return Reflect.get(e, n, i);
    }
  });
}
function I(o, a, t) {
  let s = t.initialDeps ?? [], e, n = !0;
  function i() {
    const r = o();
    return (r.length !== s.length || r.some((h, c) => s[c] !== h)) && (s = r, e = a(...r), t?.onChange && !(n && t.skipInitialOnChange) && t.onChange(e), n = !1), e;
  }
  return i.updateDeps = (r) => {
    s = r;
  }, i;
}
function R(o, a) {
  if (o === void 0)
    throw new Error("Unexpected undefined");
  return o;
}
const Y = (o, a) => Math.abs(o - a) < 1.01, $ = (o, a, t) => {
  let s;
  return function(...e) {
    o.clearTimeout(s), s = o.setTimeout(() => a.apply(this, e), t);
  };
};
let M;
const L = () => {
  if (M !== void 0) return M;
  if (typeof navigator > "u") return M = !1;
  if (/iP(hone|od|ad)/.test(navigator.userAgent)) return M = !0;
  const o = navigator.maxTouchPoints;
  return M = navigator.platform === "MacIntel" && o !== void 0 && o > 0;
}, W = (o) => {
  const { offsetWidth: a, offsetHeight: t } = o;
  return { width: a, height: t };
}, X = (o) => o, Q = (o) => {
  const a = Math.max(o.startIndex - o.overscan, 0), s = Math.min(o.endIndex + o.overscan, o.count - 1) - a + 1, e = new Array(s);
  for (let n = 0; n < s; n++)
    e[n] = a + n;
  return e;
}, Z = (o, a) => {
  const t = o.scrollElement;
  if (!t)
    return;
  const s = o.targetWindow;
  if (!s)
    return;
  const e = (i) => {
    const { width: r, height: l } = i;
    a({ width: Math.round(r), height: Math.round(l) });
  };
  if (e(W(t)), !s.ResizeObserver)
    return () => {
    };
  const n = new s.ResizeObserver((i) => {
    const r = () => {
      const l = i[0];
      if (l?.borderBoxSize) {
        const h = l.borderBoxSize[0];
        if (h) {
          e({ width: h.inlineSize, height: h.blockSize });
          return;
        }
      }
      e(W(t));
    };
    o.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(r) : r();
  });
  return n.observe(t, { box: "border-box" }), () => {
    n.unobserve(t);
  };
}, O = {
  passive: !0
}, G = typeof window > "u" ? !0 : "onscrollend" in window, tt = (o, a, t) => {
  const s = o.scrollElement;
  if (!s)
    return;
  const e = o.targetWindow;
  if (!e)
    return;
  const n = o.options.useScrollendEvent && G;
  let i = 0;
  const r = n ? null : $(
    e,
    () => a(i, !1),
    o.options.isScrollingResetDelay
  ), l = (f) => () => {
    i = t(s), r?.(), a(i, f);
  }, h = l(!0), c = l(!1);
  return s.addEventListener("scroll", h, O), n && s.addEventListener("scrollend", c, O), () => {
    s.removeEventListener("scroll", h), n && s.removeEventListener("scrollend", c);
  };
}, et = (o, a) => tt(o, a, (t) => {
  const { horizontal: s, isRtl: e } = o.options;
  return s ? t.scrollLeft * (e && -1 || 1) : t.scrollTop;
}), st = (o, a, t) => {
  if (a?.borderBoxSize) {
    const s = a.borderBoxSize[0];
    if (s)
      return Math.round(
        s[t.options.horizontal ? "inlineSize" : "blockSize"]
      );
  }
  return o[t.options.horizontal ? "offsetWidth" : "offsetHeight"];
}, nt = (o, {
  adjustments: a = 0,
  behavior: t
}, s) => {
  var e, n;
  (n = (e = s.scrollElement) == null ? void 0 : e.scrollTo) == null || n.call(e, {
    [s.options.horizontal ? "left" : "top"]: o + a,
    behavior: t
  });
}, it = nt;
class ot {
  constructor(a) {
    this.unsubs = [], this.scrollElement = null, this.targetWindow = null, this.isScrolling = !1, this.scrollState = null, this.measurementsCache = [], this._flatMeasurements = null, this.itemSizeCache = /* @__PURE__ */ new Map(), this.itemSizeCacheVersion = 0, this.laneAssignments = /* @__PURE__ */ new Map(), this.pendingMin = null, this.prevLanes = void 0, this.lanesChangedFlag = !1, this.lanesSettling = !1, this.scrollRect = null, this.scrollOffset = null, this.scrollDirection = null, this.scrollAdjustments = 0, this._iosDeferredAdjustment = 0, this._iosTouching = !1, this._iosJustTouchEnded = !1, this._iosTouchEndTimerId = null, this._intendedScrollOffset = null, this.elementsCache = /* @__PURE__ */ new Map(), this.now = () => {
      var t, s, e;
      return ((e = (s = (t = this.targetWindow) == null ? void 0 : t.performance) == null ? void 0 : s.now) == null ? void 0 : e.call(s)) ?? Date.now();
    }, this.observer = /* @__PURE__ */ (() => {
      let t = null;
      const s = () => t || (!this.targetWindow || !this.targetWindow.ResizeObserver ? null : t = new this.targetWindow.ResizeObserver((e) => {
        e.forEach((n) => {
          const i = () => {
            const r = n.target, l = this.indexFromElement(r);
            if (!r.isConnected) {
              this.observer.unobserve(r);
              for (const [h, c] of this.elementsCache)
                if (c === r) {
                  this.elementsCache.delete(h);
                  break;
                }
              return;
            }
            this.shouldMeasureDuringScroll(l) && this.resizeItem(
              l,
              this.options.measureElement(r, n, this)
            );
          };
          this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(i) : i();
        });
      }));
      return {
        disconnect: () => {
          var e;
          (e = s()) == null || e.disconnect(), t = null;
        },
        observe: (e) => {
          var n;
          return (n = s()) == null ? void 0 : n.observe(e, { box: "border-box" });
        },
        unobserve: (e) => {
          var n;
          return (n = s()) == null ? void 0 : n.unobserve(e);
        }
      };
    })(), this.range = null, this.setOptions = (t) => {
      const s = {
        debug: !1,
        initialOffset: 0,
        overscan: 1,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        horizontal: !1,
        getItemKey: X,
        rangeExtractor: Q,
        onChange: () => {
        },
        measureElement: st,
        initialRect: { width: 0, height: 0 },
        scrollMargin: 0,
        gap: 0,
        indexAttribute: "data-index",
        initialMeasurementsCache: [],
        lanes: 1,
        isScrollingResetDelay: 150,
        enabled: !0,
        isRtl: !1,
        useScrollendEvent: !1,
        useAnimationFrameWithResizeObserver: !1,
        laneAssignmentMode: "estimate"
      };
      for (const e in t) {
        const n = t[e];
        n !== void 0 && (s[e] = n);
      }
      this.options = s;
    }, this.notify = (t) => {
      var s, e;
      (e = (s = this.options).onChange) == null || e.call(s, this, t);
    }, this.maybeNotify = I(
      () => (this.calculateRange(), [
        this.isScrolling,
        this.range ? this.range.startIndex : null,
        this.range ? this.range.endIndex : null
      ]),
      (t) => {
        this.notify(t);
      },
      {
        key: !1,
        debug: () => this.options.debug,
        initialDeps: [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ]
      }
    ), this.cleanup = () => {
      this.unsubs.filter(Boolean).forEach((t) => t()), this.unsubs = [], this.observer.disconnect(), this.rafId != null && this.targetWindow && (this.targetWindow.cancelAnimationFrame(this.rafId), this.rafId = null), this.scrollState = null, this.scrollElement = null, this.targetWindow = null;
    }, this._didMount = () => () => {
      this.cleanup();
    }, this._willUpdate = () => {
      var t;
      const s = this.options.enabled ? this.options.getScrollElement() : null;
      if (this.scrollElement !== s) {
        if (this.cleanup(), !s) {
          this.maybeNotify();
          return;
        }
        if (this.scrollElement = s, this.scrollElement && "ownerDocument" in this.scrollElement ? this.targetWindow = this.scrollElement.ownerDocument.defaultView : this.targetWindow = ((t = this.scrollElement) == null ? void 0 : t.window) ?? null, this.elementsCache.forEach((e) => {
          this.observer.observe(e);
        }), this.unsubs.push(
          this.options.observeElementRect(this, (e) => {
            this.scrollRect = e, this.maybeNotify();
          })
        ), this.unsubs.push(
          this.options.observeElementOffset(this, (e, n) => {
            this._intendedScrollOffset !== null && Math.abs(e - this._intendedScrollOffset) < 1.5 && (e = this._intendedScrollOffset), this._intendedScrollOffset = null, this.scrollAdjustments = 0, this.scrollDirection = n ? this.getScrollOffset() < e ? "forward" : "backward" : null, this.scrollOffset = e, this.isScrolling = n, this._flushIosDeferredIfReady(), this.scrollState && this.scheduleScrollReconcile(), this.maybeNotify();
          })
        ), "addEventListener" in this.scrollElement) {
          const e = this.scrollElement, n = () => {
            this._iosTouching = !0, this._iosJustTouchEnded = !1, this._iosTouchEndTimerId !== null && this.targetWindow != null && (this.targetWindow.clearTimeout(this._iosTouchEndTimerId), this._iosTouchEndTimerId = null);
          }, i = () => {
            this._iosTouching = !1, !(!L() || this.targetWindow == null) && (this._iosJustTouchEnded = !0, this._iosTouchEndTimerId = this.targetWindow.setTimeout(() => {
              this._iosJustTouchEnded = !1, this._iosTouchEndTimerId = null, this._flushIosDeferredIfReady();
            }, 150));
          };
          e.addEventListener(
            "touchstart",
            n,
            O
          ), e.addEventListener(
            "touchend",
            i,
            O
          ), this.unsubs.push(() => {
            e.removeEventListener("touchstart", n), e.removeEventListener("touchend", i), this._iosTouchEndTimerId !== null && this.targetWindow != null && (this.targetWindow.clearTimeout(this._iosTouchEndTimerId), this._iosTouchEndTimerId = null);
          });
        }
        this._scrollToOffset(this.getScrollOffset(), {
          adjustments: void 0,
          behavior: void 0
        });
      }
    }, this._flushIosDeferredIfReady = () => {
      if (this._iosDeferredAdjustment === 0 || this.isScrolling || this._iosTouching || this._iosJustTouchEnded) return;
      const t = this.getScrollOffset(), s = this.getMaxScrollOffset();
      if (t < 0 || t > s) return;
      const e = this._iosDeferredAdjustment;
      this._iosDeferredAdjustment = 0, this._scrollToOffset(t, {
        adjustments: this.scrollAdjustments += e,
        behavior: void 0
      });
    }, this.rafId = null, this.getSize = () => this.options.enabled ? (this.scrollRect = this.scrollRect ?? this.options.initialRect, this.scrollRect[this.options.horizontal ? "width" : "height"]) : (this.scrollRect = null, 0), this.getScrollOffset = () => this.options.enabled ? (this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset == "function" ? this.options.initialOffset() : this.options.initialOffset), this.scrollOffset) : (this.scrollOffset = null, 0), this.getFurthestMeasurement = (t, s) => {
      const e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
      for (let i = s - 1; i >= 0; i--) {
        const r = t[i];
        if (e.has(r.lane))
          continue;
        const l = n.get(
          r.lane
        );
        if (l == null || r.end > l.end ? n.set(r.lane, r) : r.end < l.end && e.set(r.lane, !0), e.size === this.options.lanes)
          break;
      }
      return n.size === this.options.lanes ? Array.from(n.values()).sort((i, r) => i.end === r.end ? i.index - r.index : i.end - r.end)[0] : void 0;
    }, this.getMeasurementOptions = I(
      () => [
        this.options.count,
        this.options.paddingStart,
        this.options.scrollMargin,
        this.options.getItemKey,
        this.options.enabled,
        this.options.lanes,
        this.options.laneAssignmentMode
      ],
      (t, s, e, n, i, r, l) => (this.prevLanes !== void 0 && this.prevLanes !== r && (this.lanesChangedFlag = !0), this.prevLanes = r, this.pendingMin = null, {
        count: t,
        paddingStart: s,
        scrollMargin: e,
        getItemKey: n,
        enabled: i,
        lanes: r,
        laneAssignmentMode: l
      }),
      {
        key: !1
      }
    ), this.getMeasurements = I(
      () => [this.getMeasurementOptions(), this.itemSizeCacheVersion],
      ({
        count: t,
        paddingStart: s,
        scrollMargin: e,
        getItemKey: n,
        enabled: i,
        lanes: r,
        laneAssignmentMode: l
      }, h) => {
        const c = this.itemSizeCache;
        if (!i)
          return this.measurementsCache = [], this.itemSizeCache.clear(), this.laneAssignments.clear(), [];
        if (this.laneAssignments.size > t)
          for (const u of this.laneAssignments.keys())
            u >= t && this.laneAssignments.delete(u);
        this.lanesChangedFlag && (this.lanesChangedFlag = !1, this.lanesSettling = !0, this.measurementsCache = [], this.itemSizeCache.clear(), this.laneAssignments.clear(), this.pendingMin = null), this.measurementsCache.length === 0 && !this.lanesSettling && (this.measurementsCache = this.options.initialMeasurementsCache, this.measurementsCache.forEach((u) => {
          this.itemSizeCache.set(u.key, u.size);
        }));
        const f = this.lanesSettling ? 0 : this.pendingMin ?? 0;
        if (this.pendingMin = null, this.lanesSettling && this.measurementsCache.length === t && (this.lanesSettling = !1), r === 1) {
          const u = this.options.gap, S = t * 2;
          let m = this._flatMeasurements;
          if (!m || m.length < S) {
            const g = new Float64Array(S);
            m && f > 0 && g.set(m.subarray(0, f * 2)), m = g, this._flatMeasurements = m;
          }
          let p;
          if (f === 0)
            p = s + e;
          else {
            const g = f - 1;
            p = m[g * 2] + m[g * 2 + 1] + u;
          }
          for (let g = f; g < t; g++) {
            const y = n(g), w = c.get(y), _ = typeof w == "number" ? w : this.options.estimateSize(g);
            m[g * 2] = p, m[g * 2 + 1] = _, p += _ + u;
          }
          const v = q(t, m, n);
          return this.measurementsCache = v, v;
        }
        const d = this.measurementsCache.slice(0, f), E = new Array(r).fill(
          void 0
        );
        for (let u = 0; u < f; u++) {
          const S = d[u];
          S && (E[S.lane] = u);
        }
        for (let u = f; u < t; u++) {
          const S = n(u), m = this.laneAssignments.get(u);
          let p, v;
          const g = l === "estimate" || c.has(S);
          if (m !== void 0 && this.options.lanes > 1) {
            p = m;
            const b = E[p], T = b !== void 0 ? d[b] : void 0;
            v = T ? T.end + this.options.gap : s + e;
          } else {
            const b = this.options.lanes === 1 ? d[u - 1] : this.getFurthestMeasurement(d, u);
            v = b ? b.end + this.options.gap : s + e, p = b ? b.lane : u % this.options.lanes, this.options.lanes > 1 && g && this.laneAssignments.set(u, p);
          }
          const y = c.get(S), w = typeof y == "number" ? y : this.options.estimateSize(u), _ = v + w;
          d[u] = {
            index: u,
            start: v,
            size: w,
            end: _,
            key: S,
            lane: p
          }, E[p] = u;
        }
        return this.measurementsCache = d, d;
      },
      {
        key: !1,
        debug: () => this.options.debug
      }
    ), this.calculateRange = I(
      () => [
        this.getMeasurements(),
        this.getSize(),
        this.getScrollOffset(),
        this.options.lanes
      ],
      (t, s, e, n) => this.range = t.length > 0 && s > 0 ? rt({
        measurements: t,
        outerSize: s,
        scrollOffset: e,
        lanes: n,
        // Pass the typed array so binary search + forward-walk can
        // read start/end directly from Float64Array, skipping the
        // Proxy traps that materialize a full VirtualItem per probe.
        flat: n === 1 && this._flatMeasurements != null ? this._flatMeasurements : null
      }) : null,
      {
        key: !1,
        debug: () => this.options.debug
      }
    ), this.getVirtualIndexes = I(
      () => {
        let t = null, s = null;
        const e = this.calculateRange();
        return e && (t = e.startIndex, s = e.endIndex), this.maybeNotify.updateDeps([this.isScrolling, t, s]), [
          this.options.rangeExtractor,
          this.options.overscan,
          this.options.count,
          t,
          s
        ];
      },
      (t, s, e, n, i) => n === null || i === null ? [] : t({
        startIndex: n,
        endIndex: i,
        overscan: s,
        count: e
      }),
      {
        key: !1,
        debug: () => this.options.debug
      }
    ), this.indexFromElement = (t) => {
      const s = this.options.indexAttribute, e = t.getAttribute(s);
      return e ? parseInt(e, 10) : (console.warn(
        `Missing attribute name '${s}={index}' on measured element.`
      ), -1);
    }, this.shouldMeasureDuringScroll = (t) => {
      var s;
      if (!this.scrollState || this.scrollState.behavior !== "smooth")
        return !0;
      const e = this.scrollState.index ?? ((s = this.getVirtualItemForOffset(this.scrollState.lastTargetOffset)) == null ? void 0 : s.index);
      if (e !== void 0 && this.range) {
        const n = Math.max(
          this.options.overscan,
          Math.ceil((this.range.endIndex - this.range.startIndex) / 2)
        ), i = Math.max(0, e - n), r = Math.min(
          this.options.count - 1,
          e + n
        );
        return t >= i && t <= r;
      }
      return !0;
    }, this.measureElement = (t) => {
      if (!t) {
        this.elementsCache.forEach((i, r) => {
          i.isConnected || (this.observer.unobserve(i), this.elementsCache.delete(r));
        });
        return;
      }
      const s = this.indexFromElement(t), e = this.options.getItemKey(s), n = this.elementsCache.get(e);
      n !== t && (n && this.observer.unobserve(n), this.observer.observe(t), this.elementsCache.set(e, t)), (!this.isScrolling || this.scrollState) && this.shouldMeasureDuringScroll(s) && this.resizeItem(s, this.options.measureElement(t, void 0, this));
    }, this.resizeItem = (t, s) => {
      var e;
      if (t < 0 || t >= this.options.count) return;
      let n, i, r;
      const l = this._flatMeasurements;
      if (this.options.lanes === 1 && l !== null)
        r = this.options.getItemKey(t), i = l[t * 2], n = l[t * 2 + 1];
      else {
        const f = this.measurementsCache[t];
        if (!f) return;
        r = f.key, i = f.start, n = f.size;
      }
      const h = this.itemSizeCache.get(r) ?? n, c = s - h;
      c !== 0 && (((e = this.scrollState) == null ? void 0 : e.behavior) !== "smooth" && (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(
        // The callback expects a VirtualItem; build one lazily only
        // when the consumer actually supplied a custom predicate.
        this.measurementsCache[t] ?? {
          index: t,
          key: r,
          start: i,
          size: n,
          end: i + n,
          lane: 0
        },
        c,
        this
      ) : (
        // Default: adjust scrollTop only when the resize is an above-
        // viewport item AND we're not actively scrolling backward.
        // Adjusting during backward scroll fights the user's scroll
        // direction and produces the "items jump while scrolling up"
        // jank reported across many issues. Users who want the old
        // behavior can pass shouldAdjustScrollPositionOnItemSizeChange.
        i < this.getScrollOffset() + this.scrollAdjustments && this.scrollDirection !== "backward"
      )) && (L() && (this.isScrolling || this._iosTouching || this._iosJustTouchEnded) ? this._iosDeferredAdjustment += c : this._scrollToOffset(this.getScrollOffset(), {
        adjustments: this.scrollAdjustments += c,
        behavior: void 0
      })), (this.pendingMin === null || t < this.pendingMin) && (this.pendingMin = t), this.itemSizeCache.set(r, s), this.itemSizeCacheVersion++, this.notify(!1));
    }, this.getVirtualItems = I(
      () => [this.getVirtualIndexes(), this.getMeasurements()],
      (t, s) => {
        const e = [];
        for (let n = 0, i = t.length; n < i; n++) {
          const r = t[n], l = s[r];
          e.push(l);
        }
        return e;
      },
      {
        key: !1,
        debug: () => this.options.debug
      }
    ), this.getVirtualItemForOffset = (t) => {
      const s = this.getMeasurements();
      if (s.length === 0)
        return;
      const e = this._flatMeasurements, n = this.options.lanes === 1 && e != null, i = V(
        0,
        s.length - 1,
        n ? (r) => e[r * 2] : (r) => R(s[r]).start,
        t
      );
      return R(s[i]);
    }, this.getMaxScrollOffset = () => {
      if (!this.scrollElement) return 0;
      if ("scrollHeight" in this.scrollElement)
        return this.options.horizontal ? this.scrollElement.scrollWidth - this.scrollElement.clientWidth : this.scrollElement.scrollHeight - this.scrollElement.clientHeight;
      {
        const t = this.scrollElement.document.documentElement;
        return this.options.horizontal ? t.scrollWidth - this.scrollElement.innerWidth : t.scrollHeight - this.scrollElement.innerHeight;
      }
    }, this.getOffsetForAlignment = (t, s, e = 0) => {
      if (!this.scrollElement) return 0;
      const n = this.getSize(), i = this.getScrollOffset();
      s === "auto" && (s = t >= i + n ? "end" : "start"), s === "center" ? t += (e - n) / 2 : s === "end" && (t -= n);
      const r = this.getMaxScrollOffset();
      return Math.max(Math.min(r, t), 0);
    }, this.getOffsetForIndex = (t, s = "auto") => {
      t = Math.max(0, Math.min(t, this.options.count - 1));
      const e = this.getSize(), n = this.getScrollOffset(), i = this.measurementsCache[t];
      if (!i) return;
      if (s === "auto")
        if (i.end >= n + e - this.options.scrollPaddingEnd)
          s = "end";
        else if (i.start <= n + this.options.scrollPaddingStart)
          s = "start";
        else
          return [n, s];
      if (s === "end" && t === this.options.count - 1)
        return [this.getMaxScrollOffset(), s];
      const r = s === "end" ? i.end + this.options.scrollPaddingEnd : i.start - this.options.scrollPaddingStart;
      return [
        this.getOffsetForAlignment(r, s, i.size),
        s
      ];
    }, this.scrollToOffset = (t, { align: s = "start", behavior: e = "auto" } = {}) => {
      const n = this.getOffsetForAlignment(t, s), i = this.now();
      this.scrollState = {
        index: null,
        align: s,
        behavior: e,
        startedAt: i,
        lastTargetOffset: n,
        stableFrames: 0
      }, this._scrollToOffset(n, { adjustments: void 0, behavior: e }), this.scheduleScrollReconcile();
    }, this.scrollToIndex = (t, {
      align: s = "auto",
      behavior: e = "auto"
    } = {}) => {
      t = Math.max(0, Math.min(t, this.options.count - 1));
      const n = this.getOffsetForIndex(t, s);
      if (!n)
        return;
      const [i, r] = n, l = this.now();
      this.scrollState = {
        index: t,
        align: r,
        behavior: e,
        startedAt: l,
        lastTargetOffset: i,
        stableFrames: 0
      }, this._scrollToOffset(i, { adjustments: void 0, behavior: e }), this.scheduleScrollReconcile();
    }, this.scrollBy = (t, { behavior: s = "auto" } = {}) => {
      const e = this.getScrollOffset() + t, n = this.now();
      this.scrollState = {
        index: null,
        align: "start",
        behavior: s,
        startedAt: n,
        lastTargetOffset: e,
        stableFrames: 0
      }, this._scrollToOffset(e, { adjustments: void 0, behavior: s }), this.scheduleScrollReconcile();
    }, this.getTotalSize = () => {
      var t;
      const s = this.getMeasurements();
      let e;
      if (s.length === 0)
        e = this.options.paddingStart;
      else if (this.options.lanes === 1) {
        const n = s.length - 1, i = this._flatMeasurements;
        i != null ? e = i[n * 2] + i[n * 2 + 1] : e = ((t = s[n]) == null ? void 0 : t.end) ?? 0;
      } else {
        const n = Array(this.options.lanes).fill(null);
        let i = s.length - 1;
        for (; i >= 0 && n.some((r) => r === null); ) {
          const r = s[i];
          n[r.lane] === null && (n[r.lane] = r.end), i--;
        }
        e = Math.max(...n.filter((r) => r !== null));
      }
      return Math.max(
        e - this.options.scrollMargin + this.options.paddingEnd,
        0
      );
    }, this.takeSnapshot = () => {
      const t = [];
      if (this.itemSizeCache.size === 0) return t;
      const s = this.getMeasurements();
      for (const e of s)
        e && this.itemSizeCache.has(e.key) && t.push({
          index: e.index,
          key: e.key,
          start: e.start,
          size: e.size,
          end: e.end,
          lane: e.lane
        });
      return t;
    }, this._scrollToOffset = (t, {
      adjustments: s,
      behavior: e
    }) => {
      this._intendedScrollOffset = t + (s ?? 0), this.options.scrollToFn(t, { behavior: e, adjustments: s }, this);
    }, this.measure = () => {
      this.pendingMin = null, this.itemSizeCache.clear(), this.laneAssignments.clear(), this.itemSizeCacheVersion++, this.notify(!1);
    }, this.setOptions(a);
  }
  scheduleScrollReconcile() {
    if (!this.targetWindow) {
      this.scrollState = null;
      return;
    }
    this.rafId == null && (this.rafId = this.targetWindow.requestAnimationFrame(() => {
      this.rafId = null, this.reconcileScroll();
    }));
  }
  reconcileScroll() {
    if (!this.scrollState || !this.scrollElement) return;
    if (this.now() - this.scrollState.startedAt > 5e3) {
      this.scrollState = null;
      return;
    }
    const s = this.scrollState.index != null ? this.getOffsetForIndex(this.scrollState.index, this.scrollState.align) : void 0, e = s ? s[0] : this.scrollState.lastTargetOffset, n = 1, i = e !== this.scrollState.lastTargetOffset;
    if (!i && Y(e, this.getScrollOffset())) {
      if (this.scrollState.stableFrames++, this.scrollState.stableFrames >= n) {
        this.getScrollOffset() !== e && this._scrollToOffset(e, {
          adjustments: void 0,
          behavior: "auto"
        }), this.scrollState = null;
        return;
      }
    } else if (this.scrollState.stableFrames = 0, i) {
      const r = this.getSize() || 600, l = Math.abs(e - this.getScrollOffset()), h = this.scrollState.behavior === "smooth" && l > r;
      this.scrollState.lastTargetOffset = e, h || (this.scrollState.behavior = "auto"), this._scrollToOffset(e, {
        adjustments: void 0,
        behavior: h ? "smooth" : "auto"
      });
    }
    this.scheduleScrollReconcile();
  }
}
const V = (o, a, t, s) => {
  for (; o <= a; ) {
    const e = (o + a) / 2 | 0, n = t(e);
    if (n < s)
      o = e + 1;
    else if (n > s)
      a = e - 1;
    else
      return e;
  }
  return o > 0 ? o - 1 : 0;
};
function rt({
  measurements: o,
  outerSize: a,
  scrollOffset: t,
  lanes: s,
  flat: e
}) {
  const n = o.length - 1, i = e ? (c) => e[c * 2] : (c) => o[c].start, r = e ? (c) => e[c * 2] + e[c * 2 + 1] : (c) => o[c].end;
  if (o.length <= s)
    return {
      startIndex: 0,
      endIndex: n
    };
  let l = V(0, n, i, t), h = l;
  if (s === 1)
    for (; h < n && r(h) < t + a; )
      h++;
  else if (s > 1) {
    const c = Array(s).fill(0);
    for (; h < n && c.some((d) => d < t + a); ) {
      const d = o[h];
      c[d.lane] = d.end, h++;
    }
    const f = Array(s).fill(t + a);
    for (; l >= 0 && f.some((d) => d >= t); ) {
      const d = o[l];
      f[d.lane] = d.start, l--;
    }
    l = Math.max(0, l - l % s), h = Math.min(n, h + (s - 1 - h % s));
  }
  return { startIndex: l, endIndex: h };
}
const F = typeof document < "u" ? K : C;
function lt({
  useFlushSync: o = !0,
  ...a
}) {
  const t = H((n) => n + 1, 0)[1], s = {
    ...a,
    onChange: (n, i) => {
      var r;
      o && i ? N(t) : t(), (r = a.onChange) == null || r.call(a, n, i);
    }
  }, [e] = j(
    () => new ot(s)
  );
  return e.setOptions(s), F(() => e._didMount(), []), F(() => e._willUpdate()), e;
}
function at(o) {
  return lt({
    observeElementRect: Z,
    observeElementOffset: et,
    scrollToFn: it,
    ...o
  });
}
function pt({
  items: o,
  totalItems: a,
  parentRef: t,
  hasNextPage: s,
  isFetchingNextPage: e,
  fetchNextPage: n,
  estimateSize: i = () => 100,
  overscan: r = 5
}) {
  const l = at({
    count: a,
    getScrollElement: () => D(t.current),
    estimateSize: i,
    overscan: r
  }), h = l.getVirtualItems(), c = h.length > 0 ? (h.at(0)?.start ?? 0) - l.options.scrollMargin : 0, f = h.length > 0 ? l.getTotalSize() - (h.at(-1)?.end ?? 0) : 0, d = h.map((u) => ({
    virtualItem: u,
    key: u.key,
    item: o[u.index],
    props: {
      ref: l.measureElement,
      "data-index": u.index
    }
  })), E = d.at(-1) && !d.at(-1)?.item;
  return C(() => {
    s && E && !e && n();
  }, [s, E, e, n]), {
    visibleItems: d,
    virtualizer: l,
    spaceBefore: c,
    spaceAfter: f
  };
}
const B = 1e3, z = "ghostVirtualListWindow";
function ht({
  totalItems: o,
  unlockedItemCount: a
}) {
  const t = Math.min(o, a);
  return {
    visibleItemCount: t,
    canLoadMore: o > t
  };
}
function ct(o) {
  return o + B;
}
function ut(o, a) {
  return `${o}::${a}`;
}
function k(o, a, t = B) {
  const s = o?.[z];
  if (!s || typeof s != "object")
    return t;
  const e = s[a];
  return typeof e != "number" || !Number.isFinite(e) ? t : Math.max(1, Math.floor(e));
}
function dt(o, a, t) {
  if (typeof window > "u")
    return;
  const s = o?.[z], e = {
    ...o ?? {},
    [z]: {
      ...s && typeof s == "object" ? s : {},
      [a]: t
    }
  };
  window.history.replaceState(e, "");
}
function x() {
  if (!(typeof window > "u"))
    return window.history.state;
}
function St(o, {
  resetKey: a
} = {}) {
  const { key: t, pathname: s, search: e } = P(), i = ut(s, a ?? e), [r, l] = j(() => k(x(), i)), h = U(i);
  C(() => {
    if (h.current !== i) {
      h.current = i, l(k(x(), i));
      return;
    }
    dt(x(), i, r);
  }, [i, t, r]);
  const { visibleItemCount: c, canLoadMore: f } = ht({
    totalItems: o,
    unlockedItemCount: r
  });
  return {
    visibleItemCount: c,
    canLoadMore: f,
    loadMore: () => l((d) => ct(d))
  };
}
export {
  gt as L,
  St as a,
  D as g,
  pt as u
};
//# sourceMappingURL=virtual-list-window-DqbQUkIo.mjs.map

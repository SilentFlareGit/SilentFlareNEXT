import { a1 as re, aj as qr, a7 as Re, a9 as S, a6 as B, af as Pe, z as Kt, ak as Q, x as le, ac as Ut, F as _t, i as F, Q as o, l as yr, am as $, T as $t, k as Nr, L as ef, a3 as Te } from "./index-BuIZkUhD.mjs";
import { A as nf, f as rf, d as tf, c as ff, g as Af, j as cf, v as hr, e as af } from "./automations-BmGKngyG.mjs";
import { y as vf, F as of, H as Pf, u as En } from "./skeleton-DrFcKwP3.mjs";
import { T as Zr, a as Er, e as Vr, b as bn } from "./table-CZCVviNy.mjs";
import { A as lf, c as sf, f as uf, g as df, d as Hf, e as wf, b as jf, a as gf } from "./alert-dialog-mmQvJUHQ.mjs";
import { _ as qe, d as Ne, g as zr, e as kr, t as Of, i as Qe, c as vn, s as Ze, l as xf, B as Fe } from "./button-CQCNdxY6.mjs";
import { b as Xf, c as bf, g as pf } from "./dialog-DRN6olky.mjs";
import { P as D } from "./index-CDwlVw9E.mjs";
import { b as Kr, d as Df, h as Bf } from "./hooks-D4pJ_p_P.mjs";
import { S as nr } from "./switch-DZFGAF_Y.mjs";
import { H as yf } from "./heart-BMBWsLs2.mjs";
import { g as Ur, S as kn, e as Tn, f as Gn, a as mn, c as Mn } from "./select-FX6QYAFU.mjs";
import { u as hf, P as zf, b as kf, a as Tf } from "./popover-Du2NcggM.mjs";
import { I as fn } from "./input-DUvSHOFz.mjs";
import { P as Gf, U as mf, T as Mf, B as Cf } from "./underline-CV8OJ7qc.mjs";
import { T as Cn, a as ge } from "./toggle-group-B_ubMZvo.mjs";
import { L as Sf } from "./loading-indicator-BsY7eGY6.mjs";
import { S as rr } from "./separator-C7QPCSjM.mjs";
import { T as If, b as Jf, c as Tr, a as Gr } from "./tabs-1fkhM4p8.mjs";
import { i as Qf } from "./input-surface-CO8-j6V2.mjs";
import { i as wr, h as _r, s as Lf, g as Yf, a as Wf, u as Rf } from "./settings-DJqx19W1.mjs";
import { u as Ff } from "./site-Bxv-L5Dn.mjs";
import { M as qf } from "./main-layout-DejRuxP8.mjs";
import { L as Vn, P as gn } from "./list-page-DQIiFvFP.mjs";
var R = function() {
  return R = Object.assign || function(e) {
    for (var n, r = 1, t = arguments.length; r < t; r++) {
      n = arguments[r];
      for (var f in n) Object.prototype.hasOwnProperty.call(n, f) && (e[f] = n[f]);
    }
    return e;
  }, R.apply(this, arguments);
}, $r = function(e, n) {
  var r = {};
  for (var t in e) Object.prototype.hasOwnProperty.call(e, t) && n.indexOf(t) < 0 && (r[t] = e[t]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var f = 0, t = Object.getOwnPropertySymbols(e); f < t.length; f++)
      n.indexOf(t[f]) < 0 && Object.prototype.propertyIsEnumerable.call(e, t[f]) && (r[t[f]] = e[t[f]]);
  return r;
}, Kn = /* @__PURE__ */ Symbol("NiceModalId"), jr = {}, Ee = re.createContext(jr), et = re.createContext(null), se = {}, An = {}, Nf = 0, Ve = function() {
  throw new Error("No dispatch method detected, did you embed your app with NiceModal.Provider?");
}, nt = function() {
  return "_nice_modal_" + Nf++;
}, rt = function(e, n) {
  var r, t, f;
  switch (e === void 0 && (e = jr), n.type) {
    case "nice-modal/show": {
      var v = n.payload, a = v.modalId, c = v.args;
      return R(R({}, e), (r = {}, r[a] = R(R({}, e[a]), {
        id: a,
        args: c,
        // If modal is not mounted, mount it first then make it visible.
        // There is logic inside HOC wrapper to make it visible after its first mount.
        // This mechanism ensures the entering transition.
        visible: !!An[a],
        delayVisible: !An[a]
      }), r));
    }
    case "nice-modal/hide": {
      var a = n.payload.modalId;
      return e[a] ? R(R({}, e), (t = {}, t[a] = R(R({}, e[a]), { visible: !1 }), t)) : e;
    }
    case "nice-modal/remove": {
      var a = n.payload.modalId, A = R({}, e);
      return delete A[a], A;
    }
    case "nice-modal/set-flags": {
      var P = n.payload, a = P.modalId, l = P.flags;
      return R(R({}, e), (f = {}, f[a] = R(R({}, e[a]), l), f));
    }
    default:
      return e;
  }
};
function Zf(e) {
  var n;
  return (n = se[e]) === null || n === void 0 ? void 0 : n.comp;
}
function Ef(e, n) {
  return {
    type: "nice-modal/show",
    payload: {
      modalId: e,
      args: n
    }
  };
}
function Vf(e, n) {
  return {
    type: "nice-modal/set-flags",
    payload: {
      modalId: e,
      flags: n
    }
  };
}
function Kf(e) {
  return {
    type: "nice-modal/hide",
    payload: {
      modalId: e
    }
  };
}
function Uf(e) {
  return {
    type: "nice-modal/remove",
    payload: {
      modalId: e
    }
  };
}
var Xe = {}, Le = {}, Sn = function(e) {
  return typeof e == "string" ? e : (e[Kn] || (e[Kn] = nt()), e[Kn]);
};
function gr(e, n) {
  var r = Sn(e);
  if (typeof e != "string" && !se[r] && Jn(r, e), Ve(Ef(r, n)), !Xe[r]) {
    var t, f, v = new Promise(function(a, c) {
      t = a, f = c;
    });
    Xe[r] = {
      resolve: t,
      reject: f,
      promise: v
    };
  }
  return Xe[r].promise;
}
function Or(e) {
  var n = Sn(e);
  if (Ve(Kf(n)), delete Xe[n], !Le[n]) {
    var r, t, f = new Promise(function(v, a) {
      r = v, t = a;
    });
    Le[n] = {
      resolve: r,
      reject: t,
      promise: f
    };
  }
  return Le[n].promise;
}
var tt = function(e) {
  var n = Sn(e);
  Ve(Uf(n)), delete Xe[n], delete Le[n];
}, _f = function(e, n) {
  Ve(Vf(e, n));
};
function In(e, n) {
  var r = Re(Ee), t = Re(et), f = null, v = e && typeof e != "string";
  if (e ? f = Sn(e) : f = t, !f)
    throw new Error("No modal id found in NiceModal.useModal.");
  var a = f;
  S(function() {
    v && !se[a] && Jn(a, e, n);
  }, [v, a, e, n]);
  var c = r[a], A = B(function(i) {
    return gr(a, i);
  }, [a]), P = B(function() {
    return Or(a);
  }, [a]), l = B(function() {
    return tt(a);
  }, [a]), s = B(function(i) {
    var H;
    (H = Xe[a]) === null || H === void 0 || H.resolve(i), delete Xe[a];
  }, [a]), u = B(function(i) {
    var H;
    (H = Xe[a]) === null || H === void 0 || H.reject(i), delete Xe[a];
  }, [a]), d = B(function(i) {
    var H;
    (H = Le[a]) === null || H === void 0 || H.resolve(i), delete Le[a];
  }, [a]);
  return Pe(function() {
    return {
      id: a,
      args: c?.args,
      visible: !!c?.visible,
      keepMounted: !!c?.keepMounted,
      show: A,
      hide: P,
      remove: l,
      resolve: s,
      reject: u,
      resolveHide: d
    };
  }, [
    a,
    c?.args,
    c?.visible,
    c?.keepMounted,
    A,
    P,
    l,
    s,
    u,
    d
  ]);
}
var $f = function(e) {
  return function(n) {
    var r, t = n.defaultVisible, f = n.keepMounted, v = n.id, a = $r(n, ["defaultVisible", "keepMounted", "id"]), c = In(v), A = c.args, P = c.show, l = Re(Ee), s = !!l[v];
    S(function() {
      return t && P(), An[v] = !0, function() {
        delete An[v];
      };
    }, [v, P, t]), S(function() {
      f && _f(v, { keepMounted: !0 });
    }, [v, f]);
    var u = (r = l[v]) === null || r === void 0 ? void 0 : r.delayVisible;
    return S(function() {
      u && P(A);
    }, [u, A, P]), s ? re.createElement(
      et.Provider,
      { value: v },
      re.createElement(e, R({}, a, A))
    ) : null;
  };
}, Jn = function(e, n, r) {
  se[e] ? se[e].props = r : se[e] = { comp: n, props: r };
}, eA = function(e) {
  delete se[e];
}, ft = function() {
  var e = Re(Ee), n = Object.keys(e).filter(function(t) {
    return !!e[t];
  });
  n.forEach(function(t) {
    if (!se[t] && !An[t]) {
      console.warn("No modal found for id: " + t + ". Please check the id or if it is registered or declared via JSX.");
      return;
    }
  });
  var r = n.filter(function(t) {
    return se[t];
  }).map(function(t) {
    return R({ id: t }, se[t]);
  });
  return re.createElement(re.Fragment, null, r.map(function(t) {
    return re.createElement(t.comp, R({ key: t.id, id: t.id }, t.props));
  }));
}, nA = function(e) {
  var n = e.children, r = qr(rt, jr), t = r[0];
  return Ve = r[1], re.createElement(
    Ee.Provider,
    { value: t },
    n,
    re.createElement(ft, null)
  );
}, rA = function(e) {
  var n = e.children, r = e.dispatch, t = e.modals;
  return !r || !t ? re.createElement(nA, null, n) : (Ve = r, re.createElement(
    Ee.Provider,
    { value: t },
    n,
    re.createElement(ft, null)
  ));
}, tA = function(e) {
  var n = e.id, r = e.component;
  return S(function() {
    return Jn(n, r), function() {
      eA(n);
    };
  }, [n, r]), null;
}, fA = function(e) {
  var n, r = e.modal, t = e.handler, f = t === void 0 ? {} : t, v = $r(e, ["modal", "handler"]), a = Pe(function() {
    return nt();
  }, []), c = typeof r == "string" ? (n = se[r]) === null || n === void 0 ? void 0 : n.comp : r;
  if (!f)
    throw new Error("No handler found in NiceModal.ModalHolder.");
  if (!c)
    throw new Error("No modal found for id: " + r + " in NiceModal.ModalHolder.");
  return f.show = B(function(A) {
    return gr(a, A);
  }, [a]), f.hide = B(function() {
    return Or(a);
  }, [a]), re.createElement(c, R({ id: a }, v));
}, AA = function(e) {
  return {
    visible: e.visible,
    onOk: function() {
      return e.hide();
    },
    onCancel: function() {
      return e.hide();
    },
    afterClose: function() {
      e.resolveHide(), e.keepMounted || e.remove();
    }
  };
}, cA = function(e) {
  return {
    visible: e.visible,
    onClose: function() {
      return e.hide();
    },
    afterVisibleChange: function(n) {
      n || e.resolveHide(), !n && !e.keepMounted && e.remove();
    }
  };
}, aA = function(e) {
  return {
    open: e.visible,
    onClose: function() {
      return e.hide();
    },
    onExited: function() {
      e.resolveHide(), !e.keepMounted && e.remove();
    }
  };
}, vA = function(e) {
  return {
    show: e.visible,
    onHide: function() {
      return e.hide();
    },
    onExited: function() {
      e.resolveHide(), !e.keepMounted && e.remove();
    }
  };
}, cn = {
  Provider: rA,
  ModalDef: tA,
  ModalHolder: fA,
  NiceModalContext: Ee,
  create: $f,
  register: Jn,
  getModal: Zf,
  show: gr,
  hide: Or,
  remove: tt,
  useModal: In,
  reducer: rt,
  antdModal: AA,
  antdDrawer: cA,
  muiDialog: aA,
  bootstrapDialog: vA
}, oA = /* @__PURE__ */ new Map([
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  ["aac", "audio/aac"],
  ["abw", "application/x-abiword"],
  ["arc", "application/x-freearc"],
  ["avif", "image/avif"],
  ["avi", "video/x-msvideo"],
  ["azw", "application/vnd.amazon.ebook"],
  ["bin", "application/octet-stream"],
  ["bmp", "image/bmp"],
  ["bz", "application/x-bzip"],
  ["bz2", "application/x-bzip2"],
  ["cda", "application/x-cdf"],
  ["csh", "application/x-csh"],
  ["css", "text/css"],
  ["csv", "text/csv"],
  ["doc", "application/msword"],
  ["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ["eot", "application/vnd.ms-fontobject"],
  ["epub", "application/epub+zip"],
  ["gz", "application/gzip"],
  ["gif", "image/gif"],
  ["heic", "image/heic"],
  ["heif", "image/heif"],
  ["htm", "text/html"],
  ["html", "text/html"],
  ["ico", "image/vnd.microsoft.icon"],
  ["ics", "text/calendar"],
  ["jar", "application/java-archive"],
  ["jpeg", "image/jpeg"],
  ["jpg", "image/jpeg"],
  ["js", "text/javascript"],
  ["json", "application/json"],
  ["jsonld", "application/ld+json"],
  ["mid", "audio/midi"],
  ["midi", "audio/midi"],
  ["mjs", "text/javascript"],
  ["mp3", "audio/mpeg"],
  ["mp4", "video/mp4"],
  ["mpeg", "video/mpeg"],
  ["mpkg", "application/vnd.apple.installer+xml"],
  ["odp", "application/vnd.oasis.opendocument.presentation"],
  ["ods", "application/vnd.oasis.opendocument.spreadsheet"],
  ["odt", "application/vnd.oasis.opendocument.text"],
  ["oga", "audio/ogg"],
  ["ogv", "video/ogg"],
  ["ogx", "application/ogg"],
  ["opus", "audio/opus"],
  ["otf", "font/otf"],
  ["png", "image/png"],
  ["pdf", "application/pdf"],
  ["php", "application/x-httpd-php"],
  ["ppt", "application/vnd.ms-powerpoint"],
  ["pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  ["rar", "application/vnd.rar"],
  ["rtf", "application/rtf"],
  ["sh", "application/x-sh"],
  ["svg", "image/svg+xml"],
  ["swf", "application/x-shockwave-flash"],
  ["tar", "application/x-tar"],
  ["tif", "image/tiff"],
  ["tiff", "image/tiff"],
  ["ts", "video/mp2t"],
  ["ttf", "font/ttf"],
  ["txt", "text/plain"],
  ["vsd", "application/vnd.visio"],
  ["wav", "audio/wav"],
  ["weba", "audio/webm"],
  ["webm", "video/webm"],
  ["webp", "image/webp"],
  ["woff", "font/woff"],
  ["woff2", "font/woff2"],
  ["xhtml", "application/xhtml+xml"],
  ["xls", "application/vnd.ms-excel"],
  ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ["xml", "application/xml"],
  ["xul", "application/vnd.mozilla.xul+xml"],
  ["zip", "application/zip"],
  ["7z", "application/x-7z-compressed"],
  // Others
  ["mkv", "video/x-matroska"],
  ["mov", "video/quicktime"],
  ["msg", "application/vnd.ms-outlook"]
]);
function on(e, n) {
  var r = PA(e);
  if (typeof r.path != "string") {
    var t = e.webkitRelativePath;
    Object.defineProperty(r, "path", {
      value: typeof n == "string" ? n : typeof t == "string" && t.length > 0 ? t : e.name,
      writable: !1,
      configurable: !1,
      enumerable: !0
    });
  }
  return r;
}
function PA(e) {
  var n = e.name, r = n && n.lastIndexOf(".") !== -1;
  if (r && !e.type) {
    var t = n.split(".").pop().toLowerCase(), f = oA.get(t);
    f && Object.defineProperty(e, "type", {
      value: f,
      writable: !1,
      configurable: !1,
      enumerable: !0
    });
  }
  return e;
}
var lA = [
  // Thumbnail cache files for macOS and Windows
  ".DS_Store",
  "Thumbs.db"
  // Windows
];
function sA(e) {
  return qe(this, void 0, void 0, function() {
    return Ne(this, function(n) {
      return pn(e) && uA(e.dataTransfer) ? [2, wA(e.dataTransfer, e.type)] : iA(e) ? [2, dA(e)] : Array.isArray(e) && e.every(function(r) {
        return "getFile" in r && typeof r.getFile == "function";
      }) ? [2, HA(e)] : [2, []];
    });
  });
}
function uA(e) {
  return pn(e);
}
function iA(e) {
  return pn(e) && pn(e.target);
}
function pn(e) {
  return typeof e == "object" && e !== null;
}
function dA(e) {
  return tr(e.target.files).map(function(n) {
    return on(n);
  });
}
function HA(e) {
  return qe(this, void 0, void 0, function() {
    var n;
    return Ne(this, function(r) {
      switch (r.label) {
        case 0:
          return [4, Promise.all(e.map(function(t) {
            return t.getFile();
          }))];
        case 1:
          return n = r.sent(), [2, n.map(function(t) {
            return on(t);
          })];
      }
    });
  });
}
function wA(e, n) {
  return qe(this, void 0, void 0, function() {
    var r, t;
    return Ne(this, function(f) {
      switch (f.label) {
        case 0:
          return e.items ? (r = tr(e.items).filter(function(v) {
            return v.kind === "file";
          }), n !== "drop" ? [2, r] : [4, Promise.all(r.map(jA))]) : [3, 2];
        case 1:
          return t = f.sent(), [2, mr(At(t))];
        case 2:
          return [2, mr(tr(e.files).map(function(v) {
            return on(v);
          }))];
      }
    });
  });
}
function mr(e) {
  return e.filter(function(n) {
    return lA.indexOf(n.name) === -1;
  });
}
function tr(e) {
  if (e === null)
    return [];
  for (var n = [], r = 0; r < e.length; r++) {
    var t = e[r];
    n.push(t);
  }
  return n;
}
function jA(e) {
  if (typeof e.webkitGetAsEntry != "function")
    return Mr(e);
  var n = e.webkitGetAsEntry();
  return n && n.isDirectory ? ct(n) : Mr(e);
}
function At(e) {
  return e.reduce(function(n, r) {
    return zr(zr([], kr(n), !1), kr(Array.isArray(r) ? At(r) : [r]), !1);
  }, []);
}
function Mr(e) {
  var n = e.getAsFile();
  if (!n)
    return Promise.reject("".concat(e, " is not a File"));
  var r = on(n);
  return Promise.resolve(r);
}
function gA(e) {
  return qe(this, void 0, void 0, function() {
    return Ne(this, function(n) {
      return [2, e.isDirectory ? ct(e) : OA(e)];
    });
  });
}
function ct(e) {
  var n = e.createReader();
  return new Promise(function(r, t) {
    var f = [];
    function v() {
      var a = this;
      n.readEntries(function(c) {
        return qe(a, void 0, void 0, function() {
          var A, P, l;
          return Ne(this, function(s) {
            switch (s.label) {
              case 0:
                if (c.length) return [3, 5];
                s.label = 1;
              case 1:
                return s.trys.push([1, 3, , 4]), [4, Promise.all(f)];
              case 2:
                return A = s.sent(), r(A), [3, 4];
              case 3:
                return P = s.sent(), t(P), [3, 4];
              case 4:
                return [3, 6];
              case 5:
                l = Promise.all(c.map(gA)), f.push(l), v(), s.label = 6;
              case 6:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      }, function(c) {
        t(c);
      });
    }
    v();
  });
}
function OA(e) {
  return qe(this, void 0, void 0, function() {
    return Ne(this, function(n) {
      return [2, new Promise(function(r, t) {
        e.file(function(f) {
          var v = on(f, e.fullPath);
          r(v);
        }, function(f) {
          t(f);
        });
      })];
    });
  });
}
var On = {}, Cr;
function xA() {
  return Cr || (Cr = 1, On.__esModule = !0, On.default = function(e, n) {
    if (e && n) {
      var r = Array.isArray(n) ? n : n.split(",");
      if (r.length === 0)
        return !0;
      var t = e.name || "", f = (e.type || "").toLowerCase(), v = f.replace(/\/.*$/, "");
      return r.some(function(a) {
        var c = a.trim().toLowerCase();
        return c.charAt(0) === "." ? t.toLowerCase().endsWith(c) : c.endsWith("/*") ? v === c.replace(/\/.*$/, "") : f === c;
      });
    }
    return !0;
  }), On;
}
var XA = xA();
const bA = /* @__PURE__ */ Kt(XA);
function Sr(e) {
  return BA(e) || DA(e) || vt(e) || pA();
}
function pA() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function DA(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function BA(e) {
  if (Array.isArray(e)) return fr(e);
}
function Ir(e, n) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var t = Object.getOwnPropertySymbols(e);
    n && (t = t.filter(function(f) {
      return Object.getOwnPropertyDescriptor(e, f).enumerable;
    })), r.push.apply(r, t);
  }
  return r;
}
function Jr(e) {
  for (var n = 1; n < arguments.length; n++) {
    var r = arguments[n] != null ? arguments[n] : {};
    n % 2 ? Ir(Object(r), !0).forEach(function(t) {
      at(e, t, r[t]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ir(Object(r)).forEach(function(t) {
      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
    });
  }
  return e;
}
function at(e, n, r) {
  return n in e ? Object.defineProperty(e, n, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = r, e;
}
function an(e, n) {
  return zA(e) || hA(e, n) || vt(e, n) || yA();
}
function yA() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function vt(e, n) {
  if (e) {
    if (typeof e == "string") return fr(e, n);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return fr(e, n);
  }
}
function fr(e, n) {
  (n == null || n > e.length) && (n = e.length);
  for (var r = 0, t = new Array(n); r < n; r++)
    t[r] = e[r];
  return t;
}
function hA(e, n) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var t = [], f = !0, v = !1, a, c;
    try {
      for (r = r.call(e); !(f = (a = r.next()).done) && (t.push(a.value), !(n && t.length === n)); f = !0)
        ;
    } catch (A) {
      v = !0, c = A;
    } finally {
      try {
        !f && r.return != null && r.return();
      } finally {
        if (v) throw c;
      }
    }
    return t;
  }
}
function zA(e) {
  if (Array.isArray(e)) return e;
}
var kA = "file-invalid-type", TA = "file-too-large", GA = "file-too-small", mA = "too-many-files", MA = function(n) {
  n = Array.isArray(n) && n.length === 1 ? n[0] : n;
  var r = Array.isArray(n) ? "one of ".concat(n.join(", ")) : n;
  return {
    code: kA,
    message: "File type must be ".concat(r)
  };
}, Qr = function(n) {
  return {
    code: TA,
    message: "File is larger than ".concat(n, " ").concat(n === 1 ? "byte" : "bytes")
  };
}, Lr = function(n) {
  return {
    code: GA,
    message: "File is smaller than ".concat(n, " ").concat(n === 1 ? "byte" : "bytes")
  };
}, CA = {
  code: mA,
  message: "Too many files"
};
function ot(e, n) {
  var r = e.type === "application/x-moz-file" || bA(e, n);
  return [r, r ? null : MA(n)];
}
function Pt(e, n, r) {
  if (Ge(e.size))
    if (Ge(n) && Ge(r)) {
      if (e.size > r) return [!1, Qr(r)];
      if (e.size < n) return [!1, Lr(n)];
    } else {
      if (Ge(n) && e.size < n) return [!1, Lr(n)];
      if (Ge(r) && e.size > r) return [!1, Qr(r)];
    }
  return [!0, null];
}
function Ge(e) {
  return e != null;
}
function SA(e) {
  var n = e.files, r = e.accept, t = e.minSize, f = e.maxSize, v = e.multiple, a = e.maxFiles, c = e.validator;
  return !v && n.length > 1 || v && a >= 1 && n.length > a ? !1 : n.every(function(A) {
    var P = ot(A, r), l = an(P, 1), s = l[0], u = Pt(A, t, f), d = an(u, 1), i = d[0], H = c ? c(A) : null;
    return s && i && !H;
  });
}
function Dn(e) {
  return typeof e.isPropagationStopped == "function" ? e.isPropagationStopped() : typeof e.cancelBubble < "u" ? e.cancelBubble : !1;
}
function xn(e) {
  return e.dataTransfer ? Array.prototype.some.call(e.dataTransfer.types, function(n) {
    return n === "Files" || n === "application/x-moz-file";
  }) : !!e.target && !!e.target.files;
}
function Yr(e) {
  e.preventDefault();
}
function IA(e) {
  return e.indexOf("MSIE") !== -1 || e.indexOf("Trident/") !== -1;
}
function JA(e) {
  return e.indexOf("Edge/") !== -1;
}
function QA() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : window.navigator.userAgent;
  return IA(e) || JA(e);
}
function je() {
  for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
    n[r] = arguments[r];
  return function(t) {
    for (var f = arguments.length, v = new Array(f > 1 ? f - 1 : 0), a = 1; a < f; a++)
      v[a - 1] = arguments[a];
    return n.some(function(c) {
      return !Dn(t) && c && c.apply(void 0, [t].concat(v)), Dn(t);
    });
  };
}
function LA() {
  return "showOpenFilePicker" in window;
}
function YA(e) {
  if (Ge(e)) {
    var n = Object.entries(e).filter(function(r) {
      var t = an(r, 2), f = t[0], v = t[1], a = !0;
      return lt(f) || (console.warn('Skipped "'.concat(f, '" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.')), a = !1), (!Array.isArray(v) || !v.every(st)) && (console.warn('Skipped "'.concat(f, '" because an invalid file extension was provided.')), a = !1), a;
    }).reduce(function(r, t) {
      var f = an(t, 2), v = f[0], a = f[1];
      return Jr(Jr({}, r), {}, at({}, v, a));
    }, {});
    return [{
      // description is required due to https://crbug.com/1264708
      description: "Files",
      accept: n
    }];
  }
  return e;
}
function WA(e) {
  if (Ge(e))
    return Object.entries(e).reduce(function(n, r) {
      var t = an(r, 2), f = t[0], v = t[1];
      return [].concat(Sr(n), [f], Sr(v));
    }, []).filter(function(n) {
      return lt(n) || st(n);
    }).join(",");
}
function RA(e) {
  return e instanceof DOMException && (e.name === "AbortError" || e.code === e.ABORT_ERR);
}
function FA(e) {
  return e instanceof DOMException && (e.name === "SecurityError" || e.code === e.SECURITY_ERR);
}
function lt(e) {
  return e === "audio/*" || e === "video/*" || e === "image/*" || e === "text/*" || /\w+\/[-+.\w]+/g.test(e);
}
function st(e) {
  return /^.*\.[\w]+$/.test(e);
}
var qA = ["children"], NA = ["open"], ZA = ["refKey", "role", "onKeyDown", "onFocus", "onBlur", "onClick", "onDragEnter", "onDragOver", "onDragLeave", "onDrop"], EA = ["refKey", "onChange", "onClick"];
function VA(e) {
  return _A(e) || UA(e) || ut(e) || KA();
}
function KA() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function UA(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function _A(e) {
  if (Array.isArray(e)) return Ar(e);
}
function Un(e, n) {
  return nc(e) || ec(e, n) || ut(e, n) || $A();
}
function $A() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ut(e, n) {
  if (e) {
    if (typeof e == "string") return Ar(e, n);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Ar(e, n);
  }
}
function Ar(e, n) {
  (n == null || n > e.length) && (n = e.length);
  for (var r = 0, t = new Array(n); r < n; r++)
    t[r] = e[r];
  return t;
}
function ec(e, n) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var t = [], f = !0, v = !1, a, c;
    try {
      for (r = r.call(e); !(f = (a = r.next()).done) && (t.push(a.value), !(n && t.length === n)); f = !0)
        ;
    } catch (A) {
      v = !0, c = A;
    } finally {
      try {
        !f && r.return != null && r.return();
      } finally {
        if (v) throw c;
      }
    }
    return t;
  }
}
function nc(e) {
  if (Array.isArray(e)) return e;
}
function Wr(e, n) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var t = Object.getOwnPropertySymbols(e);
    n && (t = t.filter(function(f) {
      return Object.getOwnPropertyDescriptor(e, f).enumerable;
    })), r.push.apply(r, t);
  }
  return r;
}
function z(e) {
  for (var n = 1; n < arguments.length; n++) {
    var r = arguments[n] != null ? arguments[n] : {};
    n % 2 ? Wr(Object(r), !0).forEach(function(t) {
      cr(e, t, r[t]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Wr(Object(r)).forEach(function(t) {
      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
    });
  }
  return e;
}
function cr(e, n, r) {
  return n in e ? Object.defineProperty(e, n, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = r, e;
}
function Bn(e, n) {
  if (e == null) return {};
  var r = rc(e, n), t, f;
  if (Object.getOwnPropertySymbols) {
    var v = Object.getOwnPropertySymbols(e);
    for (f = 0; f < v.length; f++)
      t = v[f], !(n.indexOf(t) >= 0) && Object.prototype.propertyIsEnumerable.call(e, t) && (r[t] = e[t]);
  }
  return r;
}
function rc(e, n) {
  if (e == null) return {};
  var r = {}, t = Object.keys(e), f, v;
  for (v = 0; v < t.length; v++)
    f = t[v], !(n.indexOf(f) >= 0) && (r[f] = e[f]);
  return r;
}
var xr = /* @__PURE__ */ le(function(e, n) {
  var r = e.children, t = Bn(e, qA), f = dt(t), v = f.open, a = Bn(f, NA);
  return Ut(n, function() {
    return {
      open: v
    };
  }, [v]), /* @__PURE__ */ re.createElement(_t, null, r(z(z({}, a), {}, {
    open: v
  })));
});
xr.displayName = "Dropzone";
var it = {
  disabled: !1,
  getFilesFromEvent: sA,
  maxSize: 1 / 0,
  minSize: 0,
  multiple: !0,
  maxFiles: 0,
  preventDropOnDocument: !0,
  noClick: !1,
  noKeyboard: !1,
  noDrag: !1,
  noDragEventsBubbling: !1,
  validator: null,
  useFsAccessApi: !0,
  autoFocus: !1
};
xr.defaultProps = it;
xr.propTypes = {
  /**
   * Render function that exposes the dropzone state and prop getter fns
   *
   * @param {object} params
   * @param {Function} params.getRootProps Returns the props you should apply to the root drop container you render
   * @param {Function} params.getInputProps Returns the props you should apply to hidden file input you render
   * @param {Function} params.open Open the native file selection dialog
   * @param {boolean} params.isFocused Dropzone area is in focus
   * @param {boolean} params.isFileDialogActive File dialog is opened
   * @param {boolean} params.isDragActive Active drag is in progress
   * @param {boolean} params.isDragAccept Dragged files are accepted
   * @param {boolean} params.isDragReject Some dragged files are rejected
   * @param {File[]} params.acceptedFiles Accepted files
   * @param {FileRejection[]} params.fileRejections Rejected files and why they were rejected
   */
  children: D.func,
  /**
   * Set accepted file types.
   * Checkout https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker types option for more information.
   * Keep in mind that mime type determination is not reliable across platforms. CSV files,
   * for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
   * Windows. In some cases there might not be a mime type set at all (https://github.com/react-dropzone/react-dropzone/issues/276).
   */
  accept: D.objectOf(D.arrayOf(D.string)),
  /**
   * Allow drag 'n' drop (or selection from the file dialog) of multiple files
   */
  multiple: D.bool,
  /**
   * If false, allow dropped items to take over the current browser window
   */
  preventDropOnDocument: D.bool,
  /**
   * If true, disables click to open the native file selection dialog
   */
  noClick: D.bool,
  /**
   * If true, disables SPACE/ENTER to open the native file selection dialog.
   * Note that it also stops tracking the focus state.
   */
  noKeyboard: D.bool,
  /**
   * If true, disables drag 'n' drop
   */
  noDrag: D.bool,
  /**
   * If true, stops drag event propagation to parents
   */
  noDragEventsBubbling: D.bool,
  /**
   * Minimum file size (in bytes)
   */
  minSize: D.number,
  /**
   * Maximum file size (in bytes)
   */
  maxSize: D.number,
  /**
   * Maximum accepted number of files
   * The default value is 0 which means there is no limitation to how many files are accepted.
   */
  maxFiles: D.number,
  /**
   * Enable/disable the dropzone
   */
  disabled: D.bool,
  /**
   * Use this to provide a custom file aggregator
   *
   * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
   */
  getFilesFromEvent: D.func,
  /**
   * Cb for when closing the file dialog with no selection
   */
  onFileDialogCancel: D.func,
  /**
   * Cb for when opening the file dialog
   */
  onFileDialogOpen: D.func,
  /**
   * Set to true to use the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
   * to open the file picker instead of using an `<input type="file">` click event.
   */
  useFsAccessApi: D.bool,
  /**
   * Set to true to focus the root element on render
   */
  autoFocus: D.bool,
  /**
   * Cb for when the `dragenter` event occurs.
   *
   * @param {DragEvent} event
   */
  onDragEnter: D.func,
  /**
   * Cb for when the `dragleave` event occurs
   *
   * @param {DragEvent} event
   */
  onDragLeave: D.func,
  /**
   * Cb for when the `dragover` event occurs
   *
   * @param {DragEvent} event
   */
  onDragOver: D.func,
  /**
   * Cb for when the `drop` event occurs.
   * Note that this callback is invoked after the `getFilesFromEvent` callback is done.
   *
   * Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.
   * `accept` must be a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) or a valid file extension.
   * If `multiple` is set to false and additional files are dropped,
   * all files besides the first will be rejected.
   * Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.
   *
   * Note that the `onDrop` callback will always be invoked regardless if the dropped files were accepted or rejected.
   * If you'd like to react to a specific scenario, use the `onDropAccepted`/`onDropRejected` props.
   *
   * `onDrop` will provide you with an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which you can then process and send to a server.
   * For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:
   *
   * ```js
   * function onDrop(acceptedFiles) {
   *   const req = request.post('/upload')
   *   acceptedFiles.forEach(file => {
   *     req.attach(file.name, file)
   *   })
   *   req.end(callback)
   * }
   * ```
   *
   * @param {File[]} acceptedFiles
   * @param {FileRejection[]} fileRejections
   * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
   */
  onDrop: D.func,
  /**
   * Cb for when the `drop` event occurs.
   * Note that if no files are accepted, this callback is not invoked.
   *
   * @param {File[]} files
   * @param {(DragEvent|Event)} event
   */
  onDropAccepted: D.func,
  /**
   * Cb for when the `drop` event occurs.
   * Note that if no files are rejected, this callback is not invoked.
   *
   * @param {FileRejection[]} fileRejections
   * @param {(DragEvent|Event)} event
   */
  onDropRejected: D.func,
  /**
   * Cb for when there's some error from any of the promises.
   *
   * @param {Error} error
   */
  onError: D.func,
  /**
   * Custom validation function. It must return null if there's no errors.
   * @param {File} file
   * @returns {FileError|FileError[]|null}
   */
  validator: D.func
};
var ar = {
  isFocused: !1,
  isFileDialogActive: !1,
  isDragActive: !1,
  isDragAccept: !1,
  isDragReject: !1,
  acceptedFiles: [],
  fileRejections: []
};
function dt() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = z(z({}, it), e), r = n.accept, t = n.disabled, f = n.getFilesFromEvent, v = n.maxSize, a = n.minSize, c = n.multiple, A = n.maxFiles, P = n.onDragEnter, l = n.onDragLeave, s = n.onDragOver, u = n.onDrop, d = n.onDropAccepted, i = n.onDropRejected, H = n.onFileDialogCancel, w = n.onFileDialogOpen, j = n.useFsAccessApi, b = n.autoFocus, x = n.preventDropOnDocument, p = n.noClick, L = n.noKeyboard, V = n.noDrag, k = n.noDragEventsBubbling, ce = n.onError, ue = n.validator, te = Pe(function() {
    return WA(r);
  }, [r]), M = Pe(function() {
    return YA(r);
  }, [r]), ee = Pe(function() {
    return typeof w == "function" ? w : Rr;
  }, [w]), ie = Pe(function() {
    return typeof H == "function" ? H : Rr;
  }, [H]), I = Q(null), N = Q(null), xe = qr(tc, ar), fe = Un(xe, 2), _ = fe[0], Z = fe[1], ln = _.isFocused, Me = _.isFileDialogActive, he = Q(typeof window < "u" && window.isSecureContext && j && LA()), sn = function() {
    !he.current && Me && setTimeout(function() {
      if (N.current) {
        var X = N.current.files;
        X.length || (Z({
          type: "closeDialog"
        }), ie());
      }
    }, 300);
  };
  S(function() {
    return window.addEventListener("focus", sn, !1), function() {
      window.removeEventListener("focus", sn, !1);
    };
  }, [N, Me, ie, he]);
  var ne = Q([]), $e = function(X) {
    I.current && I.current.contains(X.target) || (X.preventDefault(), ne.current = []);
  };
  S(function() {
    return x && (document.addEventListener("dragover", Yr, !1), document.addEventListener("drop", $e, !1)), function() {
      x && (document.removeEventListener("dragover", Yr), document.removeEventListener("drop", $e));
    };
  }, [I, x]), S(function() {
    return !t && b && I.current && I.current.focus(), function() {
    };
  }, [I, b, t]);
  var de = B(function(O) {
    ce ? ce(O) : console.error(O);
  }, [ce]), ae = B(function(O) {
    O.preventDefault(), O.persist(), wn(O), ne.current = [].concat(VA(ne.current), [O.target]), xn(O) && Promise.resolve(f(O)).then(function(X) {
      if (!(Dn(O) && !k)) {
        var J = X.length, K = J > 0 && SA({
          files: X,
          accept: te,
          minSize: a,
          maxSize: v,
          multiple: c,
          maxFiles: A,
          validator: ue
        }), ve = J > 0 && !K;
        Z({
          isDragAccept: K,
          isDragReject: ve,
          isDragActive: !0,
          type: "setDraggedFiles"
        }), P && P(O);
      }
    }).catch(function(X) {
      return de(X);
    });
  }, [f, P, de, k, te, a, v, c, A, ue]), un = B(function(O) {
    O.preventDefault(), O.persist(), wn(O);
    var X = xn(O);
    if (X && O.dataTransfer)
      try {
        O.dataTransfer.dropEffect = "copy";
      } catch {
      }
    return X && s && s(O), !1;
  }, [s, k]), dn = B(function(O) {
    O.preventDefault(), O.persist(), wn(O);
    var X = ne.current.filter(function(K) {
      return I.current && I.current.contains(K);
    }), J = X.indexOf(O.target);
    J !== -1 && X.splice(J, 1), ne.current = X, !(X.length > 0) && (Z({
      type: "setDraggedFiles",
      isDragActive: !1,
      isDragAccept: !1,
      isDragReject: !1
    }), xn(O) && l && l(O));
  }, [I, l, k]), Ce = B(function(O, X) {
    var J = [], K = [];
    O.forEach(function(ve) {
      var en = ot(ve, te), Ie = Un(en, 2), Yn = Ie[0], Wn = Ie[1], Rn = Pt(ve, a, v), jn = Un(Rn, 2), Fn = jn[0], qn = jn[1], Nn = ue ? ue(ve) : null;
      if (Yn && Fn && !Nn)
        J.push(ve);
      else {
        var Zn = [Wn, qn];
        Nn && (Zn = Zn.concat(Nn)), K.push({
          file: ve,
          errors: Zn.filter(function(Vt) {
            return Vt;
          })
        });
      }
    }), (!c && J.length > 1 || c && A >= 1 && J.length > A) && (J.forEach(function(ve) {
      K.push({
        file: ve,
        errors: [CA]
      });
    }), J.splice(0)), Z({
      acceptedFiles: J,
      fileRejections: K,
      type: "setFiles"
    }), u && u(J, K, X), K.length > 0 && i && i(K, X), J.length > 0 && d && d(J, X);
  }, [Z, c, te, a, v, A, u, d, i, ue]), ze = B(function(O) {
    O.preventDefault(), O.persist(), wn(O), ne.current = [], xn(O) && Promise.resolve(f(O)).then(function(X) {
      Dn(O) && !k || Ce(X, O);
    }).catch(function(X) {
      return de(X);
    }), Z({
      type: "reset"
    });
  }, [f, Ce, de, k]), De = B(function() {
    if (he.current) {
      Z({
        type: "openDialog"
      }), ee();
      var O = {
        multiple: c,
        types: M
      };
      window.showOpenFilePicker(O).then(function(X) {
        return f(X);
      }).then(function(X) {
        Ce(X, null), Z({
          type: "closeDialog"
        });
      }).catch(function(X) {
        RA(X) ? (ie(X), Z({
          type: "closeDialog"
        })) : FA(X) ? (he.current = !1, N.current ? (N.current.value = null, N.current.click()) : de(new Error("Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."))) : de(X);
      });
      return;
    }
    N.current && (Z({
      type: "openDialog"
    }), ee(), N.current.value = null, N.current.click());
  }, [Z, ee, ie, j, Ce, de, M, c]), y = B(function(O) {
    !I.current || !I.current.isEqualNode(O.target) || (O.key === " " || O.key === "Enter" || O.keyCode === 32 || O.keyCode === 13) && (O.preventDefault(), De());
  }, [I, De]), C = B(function() {
    Z({
      type: "focus"
    });
  }, []), He = B(function() {
    Z({
      type: "blur"
    });
  }, []), Se = B(function() {
    p || (QA() ? setTimeout(De, 0) : De());
  }, [p, De]), we = function(X) {
    return t ? null : X;
  }, Ln = function(X) {
    return L ? null : we(X);
  }, Hn = function(X) {
    return V ? null : we(X);
  }, wn = function(X) {
    k && X.stopPropagation();
  }, Nt = Pe(function() {
    return function() {
      var O = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, X = O.refKey, J = X === void 0 ? "ref" : X, K = O.role, ve = O.onKeyDown, en = O.onFocus, Ie = O.onBlur, Yn = O.onClick, Wn = O.onDragEnter, Rn = O.onDragOver, jn = O.onDragLeave, Fn = O.onDrop, qn = Bn(O, ZA);
      return z(z(cr({
        onKeyDown: Ln(je(ve, y)),
        onFocus: Ln(je(en, C)),
        onBlur: Ln(je(Ie, He)),
        onClick: we(je(Yn, Se)),
        onDragEnter: Hn(je(Wn, ae)),
        onDragOver: Hn(je(Rn, un)),
        onDragLeave: Hn(je(jn, dn)),
        onDrop: Hn(je(Fn, ze)),
        role: typeof K == "string" && K !== "" ? K : "presentation"
      }, J, I), !t && !L ? {
        tabIndex: 0
      } : {}), qn);
    };
  }, [I, y, C, He, Se, ae, un, dn, ze, L, V, t]), Zt = B(function(O) {
    O.stopPropagation();
  }, []), Et = Pe(function() {
    return function() {
      var O = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, X = O.refKey, J = X === void 0 ? "ref" : X, K = O.onChange, ve = O.onClick, en = Bn(O, EA), Ie = cr({
        accept: te,
        multiple: c,
        type: "file",
        style: {
          display: "none"
        },
        onChange: we(je(K, ze)),
        onClick: we(je(ve, Zt)),
        tabIndex: -1
      }, J, N);
      return z(z({}, Ie), en);
    };
  }, [N, r, c, ze, t]);
  return z(z({}, _), {}, {
    isFocused: ln && !t,
    getRootProps: Nt,
    getInputProps: Et,
    rootRef: I,
    inputRef: N,
    open: we(De)
  });
}
function tc(e, n) {
  switch (n.type) {
    case "focus":
      return z(z({}, e), {}, {
        isFocused: !0
      });
    case "blur":
      return z(z({}, e), {}, {
        isFocused: !1
      });
    case "openDialog":
      return z(z({}, ar), {}, {
        isFileDialogActive: !0
      });
    case "closeDialog":
      return z(z({}, e), {}, {
        isFileDialogActive: !1
      });
    case "setDraggedFiles":
      return z(z({}, e), {}, {
        isDragActive: n.isDragActive,
        isDragAccept: n.isDragAccept,
        isDragReject: n.isDragReject
      });
    case "setFiles":
      return z(z({}, e), {}, {
        acceptedFiles: n.acceptedFiles,
        fileRejections: n.fileRejections
      });
    case "reset":
      return z({}, ar);
    default:
      return e;
  }
}
function Rr() {
}
const Ht = le(({
  accept: e,
  multiple: n = !1,
  maxFiles: r = n ? 0 : 1,
  disabled: t = !1,
  onDropAccepted: f,
  onDropRejected: v,
  className: a,
  children: c,
  ...A
}, P) => {
  const {
    getRootProps: l,
    getInputProps: s,
    rootRef: u,
    isDragActive: d,
    isDragAccept: i,
    isDragReject: H,
    isFocused: w,
    isFileDialogActive: j,
    open: b
  } = dt({
    accept: e,
    multiple: n,
    maxFiles: r,
    disabled: t,
    onDropAccepted: f,
    onDropRejected: v
  }), x = typeof c == "function" ? c({ isDragActive: d, isDragAccept: i, isDragReject: H, isFocused: w, isFileDialogActive: j, open: b }) : c, p = (ce) => {
    u.current = ce, typeof P == "function" ? P(ce) : P && (P.current = ce);
  }, L = l({
    ...A,
    role: "button",
    tabIndex: t ? -1 : 0,
    "aria-disabled": t,
    className: F(
      "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-10 transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
      t && "cursor-not-allowed opacity-60 pointer-events-none",
      H && "border-state-danger bg-state-danger/10",
      d && !H && !t && "border-state-success bg-state-success/10",
      !d && (t ? "border-border-default" : "border-border-default hover:border-border-strong"),
      a
    )
  }), { ref: V, ...k } = L;
  return /* @__PURE__ */ o.jsxs(
    "div",
    {
      ref: p,
      ...k,
      children: [
        /* @__PURE__ */ o.jsx("input", { ...s() }),
        x
      ]
    }
  );
});
Ht.displayName = "Dropzone";
const wt = le(({ className: e, ...n }, r) => /* @__PURE__ */ o.jsx(
  "textarea",
  {
    ref: r,
    className: F(
      Qf("self"),
      "flex min-h-[80px] w-full px-3 py-2 text-base placeholder:text-muted-foreground",
      e
    ),
    ...n
  }
));
wt.displayName = "Textarea";
const fc = (e) => /* @__PURE__ */ yr("svg", { fill: "none", height: 24, viewBox: "0 0 24 24", width: 24, xmlns: "http://www.w3.org/2000/svg", ...e }, /* @__PURE__ */ yr("path", { clipRule: "evenodd", d: "M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM11.8326 2.33879C6.37785 2.95189 3.95901 5.20797 3.41126 9.74699C3.34896 10.2632 3.22642 10.7805 3.10443 11.2954C2.93277 12.02 2.76221 12.74 2.76221 13.4458C2.76221 17.9885 6.5856 21.556 11.1283 21.556C12.8959 21.556 14.4433 20.8144 15.8756 20.048C19.0536 18.3478 22.0328 16.2597 22.0328 12.5411C22.0328 9.91512 20.1051 7.56932 18.466 5.5747C18.3834 5.47416 18.3015 5.37451 18.2206 5.27577C17.3866 4.25742 14.4333 2.04643 11.8326 2.33879Z", fill: "currentColor", fillRule: "evenodd" })), vr = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};
for (const e in vr) Object.freeze(vr[e]);
const Oe = Object.freeze(vr), jt = /* @__PURE__ */ Object.create(null);
for (const e in Oe)
  Object.hasOwn(Oe, e) && (jt[Oe[e]] = e);
const q = {
  to: {},
  get: {}
};
q.get = function(e) {
  const n = e.slice(0, 3).toLowerCase();
  let r, t;
  switch (n) {
    case "hsl": {
      r = q.get.hsl(e), t = "hsl";
      break;
    }
    case "hwb": {
      r = q.get.hwb(e), t = "hwb";
      break;
    }
    default: {
      r = q.get.rgb(e), t = "rgb";
      break;
    }
  }
  return r ? { model: t, value: r } : null;
};
q.get.rgb = function(e) {
  if (!e)
    return null;
  const n = /^#([a-f\d]{3,4})$/i, r = /^#([a-f\d]{6})([a-f\d]{2})?$/i, t = /^rgba?\(\s*([+-]?(?:\d*\.)?\d+(?:e\d+)?)(?=[\s,])\s*(?:,\s*)?([+-]?(?:\d*\.)?\d+(?:e\d+)?)(?=[\s,])\s*(?:,\s*)?([+-]?(?:\d*\.)?\d+(?:e\d+)?)\s*(?:[\s,|/]\s*([+-]?(?:\d*\.)?\d+(?:e\d+)?)(%?)\s*)?\)$/i, f = /^rgba?\(\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[\s,|/]\s*([+-]?[\d.]+)(%?)\s*)?\)$/i, v = /^(\w+)$/;
  let a = [0, 0, 0, 1], c, A, P;
  if (c = e.match(r)) {
    for (P = c[2], c = c[1], A = 0; A < 3; A++) {
      const l = A * 2;
      a[A] = Number.parseInt(c.slice(l, l + 2), 16);
    }
    P && (a[3] = Number.parseInt(P, 16) / 255);
  } else if (c = e.match(n)) {
    for (c = c[1], P = c[3], A = 0; A < 3; A++)
      a[A] = Number.parseInt(c[A] + c[A], 16);
    P && (a[3] = Number.parseInt(P + P, 16) / 255);
  } else if (c = e.match(t)) {
    for (A = 0; A < 3; A++)
      a[A] = Number.parseFloat(c[A + 1]);
    c[4] && (a[3] = c[5] ? Number.parseFloat(c[4]) * 0.01 : Number.parseFloat(c[4]));
  } else if (c = e.match(f)) {
    for (A = 0; A < 3; A++)
      a[A] = Math.round(Number.parseFloat(c[A + 1]) * 2.55);
    c[4] && (a[3] = c[5] ? Number.parseFloat(c[4]) * 0.01 : Number.parseFloat(c[4]));
  } else return (c = e.toLowerCase().match(v)) ? c[1] === "transparent" ? [0, 0, 0, 0] : Object.hasOwn(Oe, c[1]) ? (a = Oe[c[1]].slice(), a[3] = 1, a) : null : null;
  for (A = 0; A < 3; A++)
    a[A] = ye(a[A], 0, 255);
  return a[3] = ye(a[3], 0, 1), a;
};
q.get.hsl = function(e) {
  if (!e)
    return null;
  const n = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[,|/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:e[+-]?\d+)?)\s*)?\)$/i, r = e.match(n);
  if (r) {
    const t = Number.parseFloat(r[4]), f = (Number.parseFloat(r[1]) % 360 + 360) % 360, v = ye(Number.parseFloat(r[2]), 0, 100), a = ye(Number.parseFloat(r[3]), 0, 100), c = ye(Number.isNaN(t) ? 1 : t, 0, 1);
    return [f, v, a, c];
  }
  return null;
};
q.get.hwb = function(e) {
  if (!e)
    return null;
  const n = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*[\s,]\s*([+-]?[\d.]+)%\s*[\s,]\s*([+-]?[\d.]+)%\s*(?:[\s,]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:e[+-]?\d+)?)\s*)?\)$/i, r = e.match(n);
  if (r) {
    const t = Number.parseFloat(r[4]), f = (Number.parseFloat(r[1]) % 360 + 360) % 360, v = ye(Number.parseFloat(r[2]), 0, 100), a = ye(Number.parseFloat(r[3]), 0, 100), c = ye(Number.isNaN(t) ? 1 : t, 0, 1);
    return [f, v, a, c];
  }
  return null;
};
q.to.hex = function(...e) {
  return "#" + Xn(e[0]) + Xn(e[1]) + Xn(e[2]) + (e[3] < 1 ? Xn(Math.round(e[3] * 255)) : "");
};
q.to.rgb = function(...e) {
  return e.length < 4 || e[3] === 1 ? "rgb(" + Math.round(e[0]) + ", " + Math.round(e[1]) + ", " + Math.round(e[2]) + ")" : "rgba(" + Math.round(e[0]) + ", " + Math.round(e[1]) + ", " + Math.round(e[2]) + ", " + e[3] + ")";
};
q.to.rgb.percent = function(...e) {
  const n = Math.round(e[0] / 255 * 100), r = Math.round(e[1] / 255 * 100), t = Math.round(e[2] / 255 * 100);
  return e.length < 4 || e[3] === 1 ? "rgb(" + n + "%, " + r + "%, " + t + "%)" : "rgba(" + n + "%, " + r + "%, " + t + "%, " + e[3] + ")";
};
q.to.hsl = function(...e) {
  return e.length < 4 || e[3] === 1 ? "hsl(" + e[0] + ", " + e[1] + "%, " + e[2] + "%)" : "hsla(" + e[0] + ", " + e[1] + "%, " + e[2] + "%, " + e[3] + ")";
};
q.to.hwb = function(...e) {
  let n = "";
  return e.length >= 4 && e[3] !== 1 && (n = ", " + e[3]), "hwb(" + e[0] + ", " + e[1] + "%, " + e[2] + "%" + n + ")";
};
q.to.keyword = function(...e) {
  return jt[e.slice(0, 3)];
};
function ye(e, n, r) {
  return Math.min(Math.max(n, e), r);
}
function Xn(e) {
  const n = Math.round(e).toString(16).toUpperCase();
  return n.length < 2 ? "0" + n : n;
}
const gt = {};
for (const e of Object.keys(Oe))
  gt[Oe[e]] = e;
const g = {
  rgb: { channels: 3, labels: "rgb" },
  hsl: { channels: 3, labels: "hsl" },
  hsv: { channels: 3, labels: "hsv" },
  hwb: { channels: 3, labels: "hwb" },
  cmyk: { channels: 4, labels: "cmyk" },
  xyz: { channels: 3, labels: "xyz" },
  lab: { channels: 3, labels: "lab" },
  oklab: { channels: 3, labels: ["okl", "oka", "okb"] },
  lch: { channels: 3, labels: "lch" },
  oklch: { channels: 3, labels: ["okl", "okc", "okh"] },
  hex: { channels: 1, labels: ["hex"] },
  keyword: { channels: 1, labels: ["keyword"] },
  ansi16: { channels: 1, labels: ["ansi16"] },
  ansi256: { channels: 1, labels: ["ansi256"] },
  hcg: { channels: 3, labels: ["h", "c", "g"] },
  apple: { channels: 3, labels: ["r16", "g16", "b16"] },
  gray: { channels: 1, labels: ["gray"] }
}, pe = (6 / 29) ** 3;
function Ye(e) {
  const n = e > 31308e-7 ? 1.055 * e ** 0.4166666666666667 - 0.055 : e * 12.92;
  return Math.min(Math.max(0, n), 1);
}
function We(e) {
  return e > 0.04045 ? ((e + 0.055) / 1.055) ** 2.4 : e / 12.92;
}
for (const e of Object.keys(g)) {
  if (!("channels" in g[e]))
    throw new Error("missing channels property: " + e);
  if (!("labels" in g[e]))
    throw new Error("missing channel labels property: " + e);
  if (g[e].labels.length !== g[e].channels)
    throw new Error("channel and label counts mismatch: " + e);
  const { channels: n, labels: r } = g[e];
  delete g[e].channels, delete g[e].labels, Object.defineProperty(g[e], "channels", { value: n }), Object.defineProperty(g[e], "labels", { value: r });
}
g.rgb.hsl = function(e) {
  const n = e[0] / 255, r = e[1] / 255, t = e[2] / 255, f = Math.min(n, r, t), v = Math.max(n, r, t), a = v - f;
  let c, A;
  switch (v) {
    case f: {
      c = 0;
      break;
    }
    case n: {
      c = (r - t) / a;
      break;
    }
    case r: {
      c = 2 + (t - n) / a;
      break;
    }
    case t: {
      c = 4 + (n - r) / a;
      break;
    }
  }
  c = Math.min(c * 60, 360), c < 0 && (c += 360);
  const P = (f + v) / 2;
  return v === f ? A = 0 : P <= 0.5 ? A = a / (v + f) : A = a / (2 - v - f), [c, A * 100, P * 100];
};
g.rgb.hsv = function(e) {
  let n, r, t, f, v;
  const a = e[0] / 255, c = e[1] / 255, A = e[2] / 255, P = Math.max(a, c, A), l = P - Math.min(a, c, A), s = function(u) {
    return (P - u) / 6 / l + 1 / 2;
  };
  if (l === 0)
    f = 0, v = 0;
  else {
    switch (v = l / P, n = s(a), r = s(c), t = s(A), P) {
      case a: {
        f = t - r;
        break;
      }
      case c: {
        f = 1 / 3 + n - t;
        break;
      }
      case A: {
        f = 2 / 3 + r - n;
        break;
      }
    }
    f < 0 ? f += 1 : f > 1 && (f -= 1);
  }
  return [
    f * 360,
    v * 100,
    P * 100
  ];
};
g.rgb.hwb = function(e) {
  const n = e[0], r = e[1];
  let t = e[2];
  const f = g.rgb.hsl(e)[0], v = 1 / 255 * Math.min(n, Math.min(r, t));
  return t = 1 - 1 / 255 * Math.max(n, Math.max(r, t)), [f, v * 100, t * 100];
};
g.rgb.oklab = function(e) {
  const n = We(e[0] / 255), r = We(e[1] / 255), t = We(e[2] / 255), f = Math.cbrt(0.4122214708 * n + 0.5363325363 * r + 0.0514459929 * t), v = Math.cbrt(0.2119034982 * n + 0.6806995451 * r + 0.1073969566 * t), a = Math.cbrt(0.0883024619 * n + 0.2817188376 * r + 0.6299787005 * t), c = 0.2104542553 * f + 0.793617785 * v - 0.0040720468 * a, A = 1.9779984951 * f - 2.428592205 * v + 0.4505937099 * a, P = 0.0259040371 * f + 0.7827717662 * v - 0.808675766 * a;
  return [c * 100, A * 100, P * 100];
};
g.rgb.cmyk = function(e) {
  const n = e[0] / 255, r = e[1] / 255, t = e[2] / 255, f = Math.min(1 - n, 1 - r, 1 - t), v = (1 - n - f) / (1 - f) || 0, a = (1 - r - f) / (1 - f) || 0, c = (1 - t - f) / (1 - f) || 0;
  return [v * 100, a * 100, c * 100, f * 100];
};
function Ac(e, n) {
  return (e[0] - n[0]) ** 2 + (e[1] - n[1]) ** 2 + (e[2] - n[2]) ** 2;
}
g.rgb.keyword = function(e) {
  const n = gt[e];
  if (n)
    return n;
  let r = Number.POSITIVE_INFINITY, t;
  for (const f of Object.keys(Oe)) {
    const v = Oe[f], a = Ac(e, v);
    a < r && (r = a, t = f);
  }
  return t;
};
g.keyword.rgb = function(e) {
  return [...Oe[e]];
};
g.rgb.xyz = function(e) {
  const n = We(e[0] / 255), r = We(e[1] / 255), t = We(e[2] / 255), f = n * 0.4124564 + r * 0.3575761 + t * 0.1804375, v = n * 0.2126729 + r * 0.7151522 + t * 0.072175, a = n * 0.0193339 + r * 0.119192 + t * 0.9503041;
  return [f * 100, v * 100, a * 100];
};
g.rgb.lab = function(e) {
  const n = g.rgb.xyz(e);
  let r = n[0], t = n[1], f = n[2];
  r /= 95.047, t /= 100, f /= 108.883, r = r > pe ? r ** (1 / 3) : 7.787 * r + 16 / 116, t = t > pe ? t ** (1 / 3) : 7.787 * t + 16 / 116, f = f > pe ? f ** (1 / 3) : 7.787 * f + 16 / 116;
  const v = 116 * t - 16, a = 500 * (r - t), c = 200 * (t - f);
  return [v, a, c];
};
g.hsl.rgb = function(e) {
  const n = e[0] / 360, r = e[1] / 100, t = e[2] / 100;
  let f, v;
  if (r === 0)
    return v = t * 255, [v, v, v];
  const a = t < 0.5 ? t * (1 + r) : t + r - t * r, c = 2 * t - a, A = [0, 0, 0];
  for (let P = 0; P < 3; P++)
    f = n + 1 / 3 * -(P - 1), f < 0 && f++, f > 1 && f--, 6 * f < 1 ? v = c + (a - c) * 6 * f : 2 * f < 1 ? v = a : 3 * f < 2 ? v = c + (a - c) * (2 / 3 - f) * 6 : v = c, A[P] = v * 255;
  return A;
};
g.hsl.hsv = function(e) {
  const n = e[0];
  let r = e[1] / 100, t = e[2] / 100, f = r;
  const v = Math.max(t, 0.01);
  t *= 2, r *= t <= 1 ? t : 2 - t, f *= v <= 1 ? v : 2 - v;
  const a = (t + r) / 2, c = t === 0 ? 2 * f / (v + f) : 2 * r / (t + r);
  return [n, c * 100, a * 100];
};
g.hsv.rgb = function(e) {
  const n = e[0] / 60, r = e[1] / 100;
  let t = e[2] / 100;
  const f = Math.floor(n) % 6, v = n - Math.floor(n), a = 255 * t * (1 - r), c = 255 * t * (1 - r * v), A = 255 * t * (1 - r * (1 - v));
  switch (t *= 255, f) {
    case 0:
      return [t, A, a];
    case 1:
      return [c, t, a];
    case 2:
      return [a, t, A];
    case 3:
      return [a, c, t];
    case 4:
      return [A, a, t];
    case 5:
      return [t, a, c];
  }
};
g.hsv.hsl = function(e) {
  const n = e[0], r = e[1] / 100, t = e[2] / 100, f = Math.max(t, 0.01);
  let v, a;
  a = (2 - r) * t;
  const c = (2 - r) * f;
  return v = r * f, v /= c <= 1 ? c : 2 - c, v = v || 0, a /= 2, [n, v * 100, a * 100];
};
g.hwb.rgb = function(e) {
  const n = e[0] / 360;
  let r = e[1] / 100, t = e[2] / 100;
  const f = r + t;
  let v;
  f > 1 && (r /= f, t /= f);
  const a = Math.floor(6 * n), c = 1 - t;
  v = 6 * n - a, (a & 1) !== 0 && (v = 1 - v);
  const A = r + v * (c - r);
  let P, l, s;
  switch (a) {
    default:
    case 6:
    case 0: {
      P = c, l = A, s = r;
      break;
    }
    case 1: {
      P = A, l = c, s = r;
      break;
    }
    case 2: {
      P = r, l = c, s = A;
      break;
    }
    case 3: {
      P = r, l = A, s = c;
      break;
    }
    case 4: {
      P = A, l = r, s = c;
      break;
    }
    case 5: {
      P = c, l = r, s = A;
      break;
    }
  }
  return [P * 255, l * 255, s * 255];
};
g.cmyk.rgb = function(e) {
  const n = e[0] / 100, r = e[1] / 100, t = e[2] / 100, f = e[3] / 100, v = 1 - Math.min(1, n * (1 - f) + f), a = 1 - Math.min(1, r * (1 - f) + f), c = 1 - Math.min(1, t * (1 - f) + f);
  return [v * 255, a * 255, c * 255];
};
g.xyz.rgb = function(e) {
  const n = e[0] / 100, r = e[1] / 100, t = e[2] / 100;
  let f, v, a;
  return f = n * 3.2404542 + r * -1.5371385 + t * -0.4985314, v = n * -0.969266 + r * 1.8760108 + t * 0.041556, a = n * 0.0556434 + r * -0.2040259 + t * 1.0572252, f = Ye(f), v = Ye(v), a = Ye(a), [f * 255, v * 255, a * 255];
};
g.xyz.lab = function(e) {
  let n = e[0], r = e[1], t = e[2];
  n /= 95.047, r /= 100, t /= 108.883, n = n > pe ? n ** (1 / 3) : 7.787 * n + 16 / 116, r = r > pe ? r ** (1 / 3) : 7.787 * r + 16 / 116, t = t > pe ? t ** (1 / 3) : 7.787 * t + 16 / 116;
  const f = 116 * r - 16, v = 500 * (n - r), a = 200 * (r - t);
  return [f, v, a];
};
g.xyz.oklab = function(e) {
  const n = e[0] / 100, r = e[1] / 100, t = e[2] / 100, f = Math.cbrt(0.8189330101 * n + 0.3618667424 * r - 0.1288597137 * t), v = Math.cbrt(0.0329845436 * n + 0.9293118715 * r + 0.0361456387 * t), a = Math.cbrt(0.0482003018 * n + 0.2643662691 * r + 0.633851707 * t), c = 0.2104542553 * f + 0.793617785 * v - 0.0040720468 * a, A = 1.9779984951 * f - 2.428592205 * v + 0.4505937099 * a, P = 0.0259040371 * f + 0.7827717662 * v - 0.808675766 * a;
  return [c * 100, A * 100, P * 100];
};
g.oklab.oklch = function(e) {
  return g.lab.lch(e);
};
g.oklab.xyz = function(e) {
  const n = e[0] / 100, r = e[1] / 100, t = e[2] / 100, f = (0.999999998 * n + 0.396337792 * r + 0.215803758 * t) ** 3, v = (1.000000008 * n - 0.105561342 * r - 0.063854175 * t) ** 3, a = (1.000000055 * n - 0.089484182 * r - 1.291485538 * t) ** 3, c = 1.227013851 * f - 0.55779998 * v + 0.281256149 * a, A = -0.040580178 * f + 1.11225687 * v - 0.071676679 * a, P = -0.076381285 * f - 0.421481978 * v + 1.58616322 * a;
  return [c * 100, A * 100, P * 100];
};
g.oklab.rgb = function(e) {
  const n = e[0] / 100, r = e[1] / 100, t = e[2] / 100, f = (n + 0.3963377774 * r + 0.2158037573 * t) ** 3, v = (n - 0.1055613458 * r - 0.0638541728 * t) ** 3, a = (n - 0.0894841775 * r - 1.291485548 * t) ** 3, c = Ye(4.0767416621 * f - 3.3077115913 * v + 0.2309699292 * a), A = Ye(-1.2684380046 * f + 2.6097574011 * v - 0.3413193965 * a), P = Ye(-0.0041960863 * f - 0.7034186147 * v + 1.707614701 * a);
  return [c * 255, A * 255, P * 255];
};
g.oklch.oklab = function(e) {
  return g.lch.lab(e);
};
g.lab.xyz = function(e) {
  const n = e[0], r = e[1], t = e[2];
  let f, v, a;
  v = (n + 16) / 116, f = r / 500 + v, a = v - t / 200;
  const c = v ** 3, A = f ** 3, P = a ** 3;
  return v = c > pe ? c : (v - 16 / 116) / 7.787, f = A > pe ? A : (f - 16 / 116) / 7.787, a = P > pe ? P : (a - 16 / 116) / 7.787, f *= 95.047, v *= 100, a *= 108.883, [f, v, a];
};
g.lab.lch = function(e) {
  const n = e[0], r = e[1], t = e[2];
  let f;
  f = Math.atan2(t, r) * 360 / 2 / Math.PI, f < 0 && (f += 360);
  const a = Math.sqrt(r * r + t * t);
  return [n, a, f];
};
g.lch.lab = function(e) {
  const n = e[0], r = e[1], f = e[2] / 360 * 2 * Math.PI, v = r * Math.cos(f), a = r * Math.sin(f);
  return [n, v, a];
};
g.rgb.ansi16 = function(e, n = null) {
  const [r, t, f] = e;
  let v = n === null ? g.rgb.hsv(e)[2] : n;
  if (v = Math.round(v / 50), v === 0)
    return 30;
  let a = 30 + (Math.round(f / 255) << 2 | Math.round(t / 255) << 1 | Math.round(r / 255));
  return v === 2 && (a += 60), a;
};
g.hsv.ansi16 = function(e) {
  return g.rgb.ansi16(g.hsv.rgb(e), e[2]);
};
g.rgb.ansi256 = function(e) {
  const n = e[0], r = e[1], t = e[2];
  return n >> 4 === r >> 4 && r >> 4 === t >> 4 ? n < 8 ? 16 : n > 248 ? 231 : Math.round((n - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(n / 255 * 5) + 6 * Math.round(r / 255 * 5) + Math.round(t / 255 * 5);
};
g.ansi16.rgb = function(e) {
  e = e[0];
  let n = e % 10;
  if (n === 0 || n === 7)
    return e > 50 && (n += 3.5), n = n / 10.5 * 255, [n, n, n];
  const r = (Math.trunc(e > 50) + 1) * 0.5, t = (n & 1) * r * 255, f = (n >> 1 & 1) * r * 255, v = (n >> 2 & 1) * r * 255;
  return [t, f, v];
};
g.ansi256.rgb = function(e) {
  if (e = e[0], e >= 232) {
    const v = (e - 232) * 10 + 8;
    return [v, v, v];
  }
  e -= 16;
  let n;
  const r = Math.floor(e / 36) / 5 * 255, t = Math.floor((n = e % 36) / 6) / 5 * 255, f = n % 6 / 5 * 255;
  return [r, t, f];
};
g.rgb.hex = function(e) {
  const r = (((Math.round(e[0]) & 255) << 16) + ((Math.round(e[1]) & 255) << 8) + (Math.round(e[2]) & 255)).toString(16).toUpperCase();
  return "000000".slice(r.length) + r;
};
g.hex.rgb = function(e) {
  const n = e.toString(16).match(/[a-f\d]{6}|[a-f\d]{3}/i);
  if (!n)
    return [0, 0, 0];
  let r = n[0];
  n[0].length === 3 && (r = [...r].map((c) => c + c).join(""));
  const t = Number.parseInt(r, 16), f = t >> 16 & 255, v = t >> 8 & 255, a = t & 255;
  return [f, v, a];
};
g.rgb.hcg = function(e) {
  const n = e[0] / 255, r = e[1] / 255, t = e[2] / 255, f = Math.max(Math.max(n, r), t), v = Math.min(Math.min(n, r), t), a = f - v;
  let c;
  const A = a < 1 ? v / (1 - a) : 0;
  return a <= 0 ? c = 0 : f === n ? c = (r - t) / a % 6 : f === r ? c = 2 + (t - n) / a : c = 4 + (n - r) / a, c /= 6, c %= 1, [c * 360, a * 100, A * 100];
};
g.hsl.hcg = function(e) {
  const n = e[1] / 100, r = e[2] / 100, t = r < 0.5 ? 2 * n * r : 2 * n * (1 - r);
  let f = 0;
  return t < 1 && (f = (r - 0.5 * t) / (1 - t)), [e[0], t * 100, f * 100];
};
g.hsv.hcg = function(e) {
  const n = e[1] / 100, r = e[2] / 100, t = n * r;
  let f = 0;
  return t < 1 && (f = (r - t) / (1 - t)), [e[0], t * 100, f * 100];
};
g.hcg.rgb = function(e) {
  const n = e[0] / 360, r = e[1] / 100, t = e[2] / 100;
  if (r === 0)
    return [t * 255, t * 255, t * 255];
  const f = [0, 0, 0], v = n % 1 * 6, a = v % 1, c = 1 - a;
  let A = 0;
  switch (Math.floor(v)) {
    case 0: {
      f[0] = 1, f[1] = a, f[2] = 0;
      break;
    }
    case 1: {
      f[0] = c, f[1] = 1, f[2] = 0;
      break;
    }
    case 2: {
      f[0] = 0, f[1] = 1, f[2] = a;
      break;
    }
    case 3: {
      f[0] = 0, f[1] = c, f[2] = 1;
      break;
    }
    case 4: {
      f[0] = a, f[1] = 0, f[2] = 1;
      break;
    }
    default:
      f[0] = 1, f[1] = 0, f[2] = c;
  }
  return A = (1 - r) * t, [
    (r * f[0] + A) * 255,
    (r * f[1] + A) * 255,
    (r * f[2] + A) * 255
  ];
};
g.hcg.hsv = function(e) {
  const n = e[1] / 100, r = e[2] / 100, t = n + r * (1 - n);
  let f = 0;
  return t > 0 && (f = n / t), [e[0], f * 100, t * 100];
};
g.hcg.hsl = function(e) {
  const n = e[1] / 100, t = e[2] / 100 * (1 - n) + 0.5 * n;
  let f = 0;
  return t > 0 && t < 0.5 ? f = n / (2 * t) : t >= 0.5 && t < 1 && (f = n / (2 * (1 - t))), [e[0], f * 100, t * 100];
};
g.hcg.hwb = function(e) {
  const n = e[1] / 100, r = e[2] / 100, t = n + r * (1 - n);
  return [e[0], (t - n) * 100, (1 - t) * 100];
};
g.hwb.hcg = function(e) {
  const n = e[1] / 100, t = 1 - e[2] / 100, f = t - n;
  let v = 0;
  return f < 1 && (v = (t - f) / (1 - f)), [e[0], f * 100, v * 100];
};
g.apple.rgb = function(e) {
  return [e[0] / 65535 * 255, e[1] / 65535 * 255, e[2] / 65535 * 255];
};
g.rgb.apple = function(e) {
  return [e[0] / 255 * 65535, e[1] / 255 * 65535, e[2] / 255 * 65535];
};
g.gray.rgb = function(e) {
  return [e[0] / 100 * 255, e[0] / 100 * 255, e[0] / 100 * 255];
};
g.gray.hsl = function(e) {
  return [0, 0, e[0]];
};
g.gray.hsv = g.gray.hsl;
g.gray.hwb = function(e) {
  return [0, 100, e[0]];
};
g.gray.cmyk = function(e) {
  return [0, 0, 0, e[0]];
};
g.gray.lab = function(e) {
  return [e[0], 0, 0];
};
g.gray.hex = function(e) {
  const n = Math.round(e[0] / 100 * 255) & 255, t = ((n << 16) + (n << 8) + n).toString(16).toUpperCase();
  return "000000".slice(t.length) + t;
};
g.rgb.gray = function(e) {
  return [(e[0] + e[1] + e[2]) / 3 / 255 * 100];
};
function cc() {
  const e = {}, n = Object.keys(g);
  for (let { length: r } = n, t = 0; t < r; t++)
    e[n[t]] = {
      // http://jsperf.com/1-vs-infinity
      // micro-opt, but this is simple.
      distance: -1,
      parent: null
    };
  return e;
}
function ac(e) {
  const n = cc(), r = [e];
  for (n[e].distance = 0; r.length > 0; ) {
    const t = r.pop(), f = Object.keys(g[t]);
    for (let { length: v } = f, a = 0; a < v; a++) {
      const c = f[a], A = n[c];
      A.distance === -1 && (A.distance = n[t].distance + 1, A.parent = t, r.unshift(c));
    }
  }
  return n;
}
function vc(e, n) {
  return function(r) {
    return n(e(r));
  };
}
function oc(e, n) {
  const r = [n[e].parent, e];
  let t = g[n[e].parent][e], f = n[e].parent;
  for (; n[f].parent; )
    r.unshift(n[f].parent), t = vc(g[n[f].parent][f], t), f = n[f].parent;
  return t.conversion = r, t;
}
function Pc(e) {
  const n = ac(e), r = {}, t = Object.keys(n);
  for (let { length: f } = t, v = 0; v < f; v++) {
    const a = t[v];
    n[a].parent !== null && (r[a] = oc(a, n));
  }
  return r;
}
const E = {}, lc = Object.keys(g);
function sc(e) {
  const n = function(...r) {
    const t = r[0];
    return t == null ? t : (t.length > 1 && (r = t), e(r));
  };
  return "conversion" in e && (n.conversion = e.conversion), n;
}
function uc(e) {
  const n = function(...r) {
    const t = r[0];
    if (t == null)
      return t;
    t.length > 1 && (r = t);
    const f = e(r);
    if (typeof f == "object")
      for (let { length: v } = f, a = 0; a < v; a++)
        f[a] = Math.round(f[a]);
    return f;
  };
  return "conversion" in e && (n.conversion = e.conversion), n;
}
for (const e of lc) {
  E[e] = {}, Object.defineProperty(E[e], "channels", { value: g[e].channels }), Object.defineProperty(E[e], "labels", { value: g[e].labels });
  const n = Pc(e), r = Object.keys(n);
  for (const t of r) {
    const f = n[t];
    E[e][t] = uc(f), E[e][t].raw = sc(f);
  }
}
const Ot = [
  // To be honest, I don't really feel like keyword belongs in color convert, but eh.
  "keyword",
  // Gray conflicts with some method names, and has its own method defined.
  "gray",
  // Shouldn't really be in color-convert either...
  "hex"
], or = {};
for (const e of Object.keys(E))
  or[[...E[e].labels].sort().join("")] = e;
const Pr = {};
function h(e, n) {
  if (!(this instanceof h))
    return new h(e, n);
  if (n && n in Ot && (n = null), n && !(n in E))
    throw new Error("Unknown model: " + n);
  let r, t;
  if (e == null)
    this.model = "rgb", this.color = [0, 0, 0], this.valpha = 1;
  else if (e instanceof h)
    this.model = e.model, this.color = [...e.color], this.valpha = e.valpha;
  else if (typeof e == "string") {
    const f = q.get(e);
    if (f === null)
      throw new Error("Unable to parse color from string: " + e);
    this.model = f.model, t = E[this.model].channels, this.color = f.value.slice(0, t), this.valpha = typeof f.value[t] == "number" ? f.value[t] : 1;
  } else if (e.length > 0) {
    this.model = n || "rgb", t = E[this.model].channels;
    const f = Array.prototype.slice.call(e, 0, t);
    this.color = lr(f, t), this.valpha = typeof e[t] == "number" ? e[t] : 1;
  } else if (typeof e == "number")
    this.model = "rgb", this.color = [
      e >> 16 & 255,
      e >> 8 & 255,
      e & 255
    ], this.valpha = 1;
  else {
    this.valpha = 1;
    const f = Object.keys(e);
    "alpha" in e && (f.splice(f.indexOf("alpha"), 1), this.valpha = typeof e.alpha == "number" ? e.alpha : 0);
    const v = f.sort().join("");
    if (!(v in or))
      throw new Error("Unable to parse color from object: " + JSON.stringify(e));
    this.model = or[v];
    const { labels: a } = E[this.model], c = [];
    for (r = 0; r < a.length; r++)
      c.push(e[a[r]]);
    this.color = lr(c);
  }
  if (Pr[this.model])
    for (t = E[this.model].channels, r = 0; r < t; r++) {
      const f = Pr[this.model][r];
      f && (this.color[r] = f(this.color[r]));
    }
  this.valpha = Math.max(0, Math.min(1, this.valpha)), Object.freeze && Object.freeze(this);
}
h.prototype = {
  toString() {
    return this.string();
  },
  toJSON() {
    return this[this.model]();
  },
  string(e) {
    let n = this.model in q.to ? this : this.rgb();
    n = n.round(typeof e == "number" ? e : 1);
    const r = n.valpha === 1 ? n.color : [...n.color, this.valpha];
    return q.to[n.model](...r);
  },
  percentString(e) {
    const n = this.rgb().round(typeof e == "number" ? e : 1), r = n.valpha === 1 ? n.color : [...n.color, this.valpha];
    return q.to.rgb.percent(...r);
  },
  array() {
    return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];
  },
  object() {
    const e = {}, { channels: n } = E[this.model], { labels: r } = E[this.model];
    for (let t = 0; t < n; t++)
      e[r[t]] = this.color[t];
    return this.valpha !== 1 && (e.alpha = this.valpha), e;
  },
  unitArray() {
    const e = this.rgb().color;
    return e[0] /= 255, e[1] /= 255, e[2] /= 255, this.valpha !== 1 && e.push(this.valpha), e;
  },
  unitObject() {
    const e = this.rgb().object();
    return e.r /= 255, e.g /= 255, e.b /= 255, this.valpha !== 1 && (e.alpha = this.valpha), e;
  },
  round(e) {
    return e = Math.max(e || 0, 0), new h([...this.color.map(dc(e)), this.valpha], this.model);
  },
  alpha(e) {
    return e !== void 0 ? new h([...this.color, Math.max(0, Math.min(1, e))], this.model) : this.valpha;
  },
  // Rgb
  red: T("rgb", 0, Y(255)),
  green: T("rgb", 1, Y(255)),
  blue: T("rgb", 2, Y(255)),
  hue: T(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, (e) => (e % 360 + 360) % 360),
  saturationl: T("hsl", 1, Y(100)),
  lightness: T("hsl", 2, Y(100)),
  saturationv: T("hsv", 1, Y(100)),
  value: T("hsv", 2, Y(100)),
  chroma: T("hcg", 1, Y(100)),
  gray: T("hcg", 2, Y(100)),
  white: T("hwb", 1, Y(100)),
  wblack: T("hwb", 2, Y(100)),
  cyan: T("cmyk", 0, Y(100)),
  magenta: T("cmyk", 1, Y(100)),
  yellow: T("cmyk", 2, Y(100)),
  black: T("cmyk", 3, Y(100)),
  x: T("xyz", 0, Y(95.047)),
  y: T("xyz", 1, Y(100)),
  z: T("xyz", 2, Y(108.833)),
  l: T("lab", 0, Y(100)),
  a: T("lab", 1),
  b: T("lab", 2),
  keyword(e) {
    return e !== void 0 ? new h(e) : E[this.model].keyword(this.color);
  },
  hex(e) {
    return e !== void 0 ? new h(e) : q.to.hex(...this.rgb().round().color);
  },
  hexa(e) {
    if (e !== void 0)
      return new h(e);
    const n = this.rgb().round().color;
    let r = Math.round(this.valpha * 255).toString(16).toUpperCase();
    return r.length === 1 && (r = "0" + r), q.to.hex(...n) + r;
  },
  rgbNumber() {
    const e = this.rgb().color;
    return (e[0] & 255) << 16 | (e[1] & 255) << 8 | e[2] & 255;
  },
  luminosity() {
    const e = this.rgb().color, n = [];
    for (const [r, t] of e.entries()) {
      const f = t / 255;
      n[r] = f <= 0.04045 ? f / 12.92 : ((f + 0.055) / 1.055) ** 2.4;
    }
    return 0.2126 * n[0] + 0.7152 * n[1] + 0.0722 * n[2];
  },
  contrast(e) {
    const n = this.luminosity(), r = e.luminosity();
    return n > r ? (n + 0.05) / (r + 0.05) : (r + 0.05) / (n + 0.05);
  },
  level(e) {
    const n = this.contrast(e);
    return n >= 7 ? "AAA" : n >= 4.5 ? "AA" : "";
  },
  isDark() {
    const e = this.rgb().color;
    return (e[0] * 2126 + e[1] * 7152 + e[2] * 722) / 1e4 < 128;
  },
  isLight() {
    return !this.isDark();
  },
  negate() {
    const e = this.rgb();
    for (let n = 0; n < 3; n++)
      e.color[n] = 255 - e.color[n];
    return e;
  },
  lighten(e) {
    const n = this.hsl();
    return n.color[2] += n.color[2] * e, n;
  },
  darken(e) {
    const n = this.hsl();
    return n.color[2] -= n.color[2] * e, n;
  },
  saturate(e) {
    const n = this.hsl();
    return n.color[1] += n.color[1] * e, n;
  },
  desaturate(e) {
    const n = this.hsl();
    return n.color[1] -= n.color[1] * e, n;
  },
  whiten(e) {
    const n = this.hwb();
    return n.color[1] += n.color[1] * e, n;
  },
  blacken(e) {
    const n = this.hwb();
    return n.color[2] += n.color[2] * e, n;
  },
  grayscale() {
    const e = this.rgb().color, n = e[0] * 0.3 + e[1] * 0.59 + e[2] * 0.11;
    return h.rgb(n, n, n);
  },
  fade(e) {
    return this.alpha(this.valpha - this.valpha * e);
  },
  opaquer(e) {
    return this.alpha(this.valpha + this.valpha * e);
  },
  rotate(e) {
    const n = this.hsl();
    let r = n.color[0];
    return r = (r + e) % 360, r = r < 0 ? 360 + r : r, n.color[0] = r, n;
  },
  mix(e, n) {
    if (!e || !e.rgb)
      throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof e);
    const r = e.rgb(), t = this.rgb(), f = n === void 0 ? 0.5 : n, v = 2 * f - 1, a = r.alpha() - t.alpha(), c = ((v * a === -1 ? v : (v + a) / (1 + v * a)) + 1) / 2, A = 1 - c;
    return h.rgb(
      c * r.red() + A * t.red(),
      c * r.green() + A * t.green(),
      c * r.blue() + A * t.blue(),
      r.alpha() * f + t.alpha() * (1 - f)
    );
  }
};
for (const e of Object.keys(E)) {
  if (Ot.includes(e))
    continue;
  const { channels: n } = E[e];
  h.prototype[e] = function(...r) {
    return this.model === e ? new h(this) : r.length > 0 ? new h(r, e) : new h([...Hc(E[this.model][e].raw(this.color)), this.valpha], e);
  }, h[e] = function(...r) {
    let t = r[0];
    return typeof t == "number" && (t = lr(r, n)), new h(t, e);
  };
}
function ic(e, n) {
  return Number(e.toFixed(n));
}
function dc(e) {
  return function(n) {
    return ic(n, e);
  };
}
function T(e, n, r) {
  e = Array.isArray(e) ? e : [e];
  for (const t of e)
    (Pr[t] ||= [])[n] = r;
  return e = e[0], function(t) {
    let f;
    return t !== void 0 ? (r && (t = r(t)), f = this[e](), f.color[n] = t, f) : (f = this[e]().color[n], r && (f = r(f)), f);
  };
}
function Y(e) {
  return function(n) {
    return Math.max(0, Math.min(e, n));
  };
}
function Hc(e) {
  return Array.isArray(e) ? e : [e];
}
function lr(e, n) {
  for (let r = 0; r < n; r++)
    typeof e[r] != "number" && (e[r] = 0);
  return e;
}
var xt = ["PageUp", "PageDown"], Xt = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"], bt = {
  "from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
  "from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"]
}, Ke = "Slider", [sr, wc, jc] = vf(Ke), [pt] = xf(Ke, [
  jc
]), [gc, Qn] = pt(Ke), Dt = le(
  (e, n) => {
    const {
      name: r,
      min: t = 0,
      max: f = 100,
      step: v = 1,
      orientation: a = "horizontal",
      disabled: c = !1,
      minStepsBetweenThumbs: A = 0,
      defaultValue: P = [t],
      value: l,
      onValueChange: s = () => {
      },
      onValueCommit: u = () => {
      },
      inverted: d = !1,
      form: i,
      ...H
    } = e, w = Q(/* @__PURE__ */ new Set()), j = Q(0), x = a === "horizontal" ? Oc : xc, [p = [], L] = Of({
      prop: l,
      defaultProp: P,
      onChange: (M) => {
        [...w.current][j.current]?.focus(), s(M);
      }
    }), V = Q(p);
    function k(M) {
      const ee = Bc(p, M);
      te(M, ee);
    }
    function ce(M) {
      te(M, j.current);
    }
    function ue() {
      const M = V.current[j.current];
      p[j.current] !== M && u(p);
    }
    function te(M, ee, { commit: ie } = { commit: !1 }) {
      const I = kc(v), N = Tc(Math.round((M - t) / v) * v + t, I), xe = Ur(N, [t, f]);
      L((fe = []) => {
        const _ = pc(fe, xe, ee);
        if (zc(_, A * v)) {
          j.current = _.indexOf(xe);
          const Z = String(_) !== String(fe);
          return Z && ie && u(_), Z ? _ : fe;
        } else
          return fe;
      });
    }
    return /* @__PURE__ */ o.jsx(
      gc,
      {
        scope: e.__scopeSlider,
        name: r,
        disabled: c,
        min: t,
        max: f,
        valueIndexToChangeRef: j,
        thumbs: w.current,
        values: p,
        orientation: a,
        form: i,
        children: /* @__PURE__ */ o.jsx(sr.Provider, { scope: e.__scopeSlider, children: /* @__PURE__ */ o.jsx(sr.Slot, { scope: e.__scopeSlider, children: /* @__PURE__ */ o.jsx(
          x,
          {
            "aria-disabled": c,
            "data-disabled": c ? "" : void 0,
            ...H,
            ref: n,
            onPointerDown: Qe(H.onPointerDown, () => {
              c || (V.current = p);
            }),
            min: t,
            max: f,
            inverted: d,
            onSlideStart: c ? void 0 : k,
            onSlideMove: c ? void 0 : ce,
            onSlideEnd: c ? void 0 : ue,
            onHomeKeyDown: () => !c && te(t, 0, { commit: !0 }),
            onEndKeyDown: () => !c && te(f, p.length - 1, { commit: !0 }),
            onStepKeyDown: ({ event: M, direction: ee }) => {
              if (!c) {
                const N = xt.includes(M.key) || M.shiftKey && Xt.includes(M.key) ? 10 : 1, xe = j.current, fe = p[xe], _ = v * N * ee;
                te(fe + _, xe, { commit: !0 });
              }
            }
          }
        ) }) })
      }
    );
  }
);
Dt.displayName = Ke;
var [Bt, yt] = pt(Ke, {
  startEdge: "left",
  endEdge: "right",
  size: "width",
  direction: 1
}), Oc = le(
  (e, n) => {
    const {
      min: r,
      max: t,
      dir: f,
      inverted: v,
      onSlideStart: a,
      onSlideMove: c,
      onSlideEnd: A,
      onStepKeyDown: P,
      ...l
    } = e, [s, u] = $(null), d = Ze(n, (x) => u(x)), i = Q(void 0), H = of(f), w = H === "ltr", j = w && !v || !w && v;
    function b(x) {
      const p = i.current || s.getBoundingClientRect(), L = [0, p.width], k = Xr(L, j ? [r, t] : [t, r]);
      return i.current = p, k(x - p.left);
    }
    return /* @__PURE__ */ o.jsx(
      Bt,
      {
        scope: e.__scopeSlider,
        startEdge: j ? "left" : "right",
        endEdge: j ? "right" : "left",
        direction: j ? 1 : -1,
        size: "width",
        children: /* @__PURE__ */ o.jsx(
          ht,
          {
            dir: H,
            "data-orientation": "horizontal",
            ...l,
            ref: d,
            style: {
              ...l.style,
              "--radix-slider-thumb-transform": "translateX(-50%)"
            },
            onSlideStart: (x) => {
              const p = b(x.clientX);
              a?.(p);
            },
            onSlideMove: (x) => {
              const p = b(x.clientX);
              c?.(p);
            },
            onSlideEnd: () => {
              i.current = void 0, A?.();
            },
            onStepKeyDown: (x) => {
              const L = bt[j ? "from-left" : "from-right"].includes(x.key);
              P?.({ event: x, direction: L ? -1 : 1 });
            }
          }
        )
      }
    );
  }
), xc = le(
  (e, n) => {
    const {
      min: r,
      max: t,
      inverted: f,
      onSlideStart: v,
      onSlideMove: a,
      onSlideEnd: c,
      onStepKeyDown: A,
      ...P
    } = e, l = Q(null), s = Ze(n, l), u = Q(void 0), d = !f;
    function i(H) {
      const w = u.current || l.current.getBoundingClientRect(), j = [0, w.height], x = Xr(j, d ? [t, r] : [r, t]);
      return u.current = w, x(H - w.top);
    }
    return /* @__PURE__ */ o.jsx(
      Bt,
      {
        scope: e.__scopeSlider,
        startEdge: d ? "bottom" : "top",
        endEdge: d ? "top" : "bottom",
        size: "height",
        direction: d ? 1 : -1,
        children: /* @__PURE__ */ o.jsx(
          ht,
          {
            "data-orientation": "vertical",
            ...P,
            ref: s,
            style: {
              ...P.style,
              "--radix-slider-thumb-transform": "translateY(50%)"
            },
            onSlideStart: (H) => {
              const w = i(H.clientY);
              v?.(w);
            },
            onSlideMove: (H) => {
              const w = i(H.clientY);
              a?.(w);
            },
            onSlideEnd: () => {
              u.current = void 0, c?.();
            },
            onStepKeyDown: (H) => {
              const j = bt[d ? "from-bottom" : "from-top"].includes(H.key);
              A?.({ event: H, direction: j ? -1 : 1 });
            }
          }
        )
      }
    );
  }
), ht = le(
  (e, n) => {
    const {
      __scopeSlider: r,
      onSlideStart: t,
      onSlideMove: f,
      onSlideEnd: v,
      onHomeKeyDown: a,
      onEndKeyDown: c,
      onStepKeyDown: A,
      ...P
    } = e, l = Qn(Ke, r);
    return /* @__PURE__ */ o.jsx(
      vn.span,
      {
        ...P,
        ref: n,
        onKeyDown: Qe(e.onKeyDown, (s) => {
          s.key === "Home" ? (a(s), s.preventDefault()) : s.key === "End" ? (c(s), s.preventDefault()) : xt.concat(Xt).includes(s.key) && (A(s), s.preventDefault());
        }),
        onPointerDown: Qe(e.onPointerDown, (s) => {
          const u = s.target;
          u.setPointerCapture(s.pointerId), s.preventDefault(), l.thumbs.has(u) ? u.focus() : t(s);
        }),
        onPointerMove: Qe(e.onPointerMove, (s) => {
          s.target.hasPointerCapture(s.pointerId) && f(s);
        }),
        onPointerUp: Qe(e.onPointerUp, (s) => {
          const u = s.target;
          u.hasPointerCapture(s.pointerId) && (u.releasePointerCapture(s.pointerId), v(s));
        })
      }
    );
  }
), zt = "SliderTrack", kt = le(
  (e, n) => {
    const { __scopeSlider: r, ...t } = e, f = Qn(zt, r);
    return /* @__PURE__ */ o.jsx(
      vn.span,
      {
        "data-disabled": f.disabled ? "" : void 0,
        "data-orientation": f.orientation,
        ...t,
        ref: n
      }
    );
  }
);
kt.displayName = zt;
var ur = "SliderRange", Tt = le(
  (e, n) => {
    const { __scopeSlider: r, ...t } = e, f = Qn(ur, r), v = yt(ur, r), a = Q(null), c = Ze(n, a), A = f.values.length, P = f.values.map(
      (u) => Mt(u, f.min, f.max)
    ), l = A > 1 ? Math.min(...P) : 0, s = 100 - Math.max(...P);
    return /* @__PURE__ */ o.jsx(
      vn.span,
      {
        "data-orientation": f.orientation,
        "data-disabled": f.disabled ? "" : void 0,
        ...t,
        ref: c,
        style: {
          ...e.style,
          [v.startEdge]: l + "%",
          [v.endEdge]: s + "%"
        }
      }
    );
  }
);
Tt.displayName = ur;
var ir = "SliderThumb", Gt = le(
  (e, n) => {
    const r = wc(e.__scopeSlider), [t, f] = $(null), v = Ze(n, (c) => f(c)), a = Pe(
      () => t ? r().findIndex((c) => c.ref.current === t) : -1,
      [r, t]
    );
    return /* @__PURE__ */ o.jsx(Xc, { ...e, ref: v, index: a });
  }
), Xc = le(
  (e, n) => {
    const { __scopeSlider: r, index: t, name: f, ...v } = e, a = Qn(ir, r), c = yt(ir, r), [A, P] = $(null), l = Ze(n, (b) => P(b)), s = A ? a.form || !!A.closest("form") : !0, u = Pf(A), d = a.values[t], i = d === void 0 ? 0 : Mt(d, a.min, a.max), H = Dc(t, a.values.length), w = u?.[c.size], j = w ? yc(w, i, c.direction) : 0;
    return S(() => {
      if (A)
        return a.thumbs.add(A), () => {
          a.thumbs.delete(A);
        };
    }, [A, a.thumbs]), /* @__PURE__ */ o.jsxs(
      "span",
      {
        style: {
          transform: "var(--radix-slider-thumb-transform)",
          position: "absolute",
          [c.startEdge]: `calc(${i}% + ${j}px)`
        },
        children: [
          /* @__PURE__ */ o.jsx(sr.ItemSlot, { scope: e.__scopeSlider, children: /* @__PURE__ */ o.jsx(
            vn.span,
            {
              role: "slider",
              "aria-label": e["aria-label"] || H,
              "aria-valuemin": a.min,
              "aria-valuenow": d,
              "aria-valuemax": a.max,
              "aria-orientation": a.orientation,
              "data-orientation": a.orientation,
              "data-disabled": a.disabled ? "" : void 0,
              tabIndex: a.disabled ? void 0 : 0,
              ...v,
              ref: l,
              style: d === void 0 ? { display: "none" } : e.style,
              onFocus: Qe(e.onFocus, () => {
                a.valueIndexToChangeRef.current = t;
              })
            }
          ) }),
          s && /* @__PURE__ */ o.jsx(
            mt,
            {
              name: f ?? (a.name ? a.name + (a.values.length > 1 ? "[]" : "") : void 0),
              form: a.form,
              value: d
            },
            t
          )
        ]
      }
    );
  }
);
Gt.displayName = ir;
var bc = "RadioBubbleInput", mt = le(
  ({ __scopeSlider: e, value: n, ...r }, t) => {
    const f = Q(null), v = Ze(f, t), a = hf(n);
    return S(() => {
      const c = f.current;
      if (!c) return;
      const A = window.HTMLInputElement.prototype, l = Object.getOwnPropertyDescriptor(A, "value").set;
      if (a !== n && l) {
        const s = new Event("input", { bubbles: !0 });
        l.call(c, n), c.dispatchEvent(s);
      }
    }, [a, n]), /* @__PURE__ */ o.jsx(
      vn.input,
      {
        style: { display: "none" },
        ...r,
        ref: v,
        defaultValue: n
      }
    );
  }
);
mt.displayName = bc;
function pc(e = [], n, r) {
  const t = [...e];
  return t[r] = n, t.sort((f, v) => f - v);
}
function Mt(e, n, r) {
  const v = 100 / (r - n) * (e - n);
  return Ur(v, [0, 100]);
}
function Dc(e, n) {
  return n > 2 ? `Value ${e + 1} of ${n}` : n === 2 ? ["Minimum", "Maximum"][e] : void 0;
}
function Bc(e, n) {
  if (e.length === 1) return 0;
  const r = e.map((f) => Math.abs(f - n)), t = Math.min(...r);
  return r.indexOf(t);
}
function yc(e, n, r) {
  const t = e / 2, v = Xr([0, 50], [0, t]);
  return (t - v(n) * r) * r;
}
function hc(e) {
  return e.slice(0, -1).map((n, r) => e[r + 1] - n);
}
function zc(e, n) {
  if (n > 0) {
    const r = hc(e);
    return Math.min(...r) >= n;
  }
  return !0;
}
function Xr(e, n) {
  return (r) => {
    if (e[0] === e[1] || n[0] === n[1]) return n[0];
    const t = (n[1] - n[0]) / (e[1] - e[0]);
    return n[0] + t * (r - e[0]);
  };
}
function kc(e) {
  return (String(e).split(".")[1] || "").length;
}
function Tc(e, n) {
  const r = Math.pow(10, n);
  return Math.round(e * r) / r;
}
var Gc = Dt, mc = kt, Mc = Tt, Cc = Gt;
const Ct = Nr(
  void 0
), Pn = () => {
  const e = Re(Ct);
  if (!e)
    throw new Error(
      "useColorPicker must be used within a ColorPickerProvider"
    );
  return e;
}, Sc = ({
  value: e,
  defaultValue: n = "rgb(0 0 0)",
  onChange: r,
  className: t,
  ...f
}) => {
  const v = h(e ?? n), [a, c] = $(v.hue()), [A, P] = $(v.saturationl()), [l, s] = $(v.lightness()), [u, d] = $(v.alpha() * 100), [i, H] = $("hex");
  return S(() => {
    if (e) {
      const w = h(e);
      c(w.hue()), P(w.saturationl()), s(w.lightness()), d(w.alpha() * 100);
    }
  }, [e]), S(() => {
    if (r) {
      const j = h.hsl(a, A, l).alpha(
        u / 100
      ).hex();
      r(j);
    }
  }, [a, A, l, u, r]), /* @__PURE__ */ o.jsx(
    Ct.Provider,
    {
      value: {
        hue: a,
        saturation: A,
        lightness: l,
        alpha: u,
        mode: i,
        setHue: c,
        setSaturation: P,
        setLightness: s,
        setAlpha: d,
        setMode: H
      },
      children: /* @__PURE__ */ o.jsx(
        "div",
        {
          className: F("flex size-full flex-col gap-4", t),
          ...f
        }
      )
    }
  );
}, St = $t(
  ({ className: e, ...n }) => {
    const r = Q(null), [t, f] = $(!1), [v, a] = $(0), [c, A] = $(0), { hue: P, saturation: l, lightness: s, setSaturation: u, setLightness: d } = Pn(), i = Pe(() => `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)),
            linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)),
            hsl(${P}, 100%, 50%)`, [P]);
    S(() => {
      const j = l / 100, b = j < 0.01 ? 100 : 50 + 50 * (1 - j), x = Math.max(0, Math.min(1, 1 - s / b));
      a(j), A(x);
    }, [l, s]);
    const H = B(
      (j) => {
        if (!r.current)
          return;
        const b = r.current.getBoundingClientRect(), x = Math.max(
          0,
          Math.min(1, (j.clientX - b.left) / b.width)
        ), p = Math.max(
          0,
          Math.min(1, (j.clientY - b.top) / b.height)
        );
        a(x), A(p), u(x * 100);
        const V = (x < 0.01 ? 100 : 50 + 50 * (1 - x)) * (1 - p);
        d(V);
      },
      [u, d]
    ), w = B(
      (j) => {
        t && H(j);
      },
      [t, H]
    );
    return S(() => {
      const j = () => f(!1);
      return t && (window.addEventListener("pointermove", w), window.addEventListener("pointerup", j)), () => {
        window.removeEventListener("pointermove", w), window.removeEventListener("pointerup", j);
      };
    }, [t, w]), /* @__PURE__ */ o.jsx(
      "div",
      {
        ref: r,
        className: F(
          "relative size-full cursor-crosshair rounded",
          e
        ),
        style: {
          background: i
        },
        onPointerDown: (j) => {
          j.preventDefault(), f(!0), H(j.nativeEvent);
        },
        ...n,
        children: /* @__PURE__ */ o.jsx(
          "div",
          {
            className: "pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white",
            style: {
              left: `${v * 100}%`,
              top: `${c * 100}%`,
              boxShadow: "0 0 0 1px rgba(0,0,0,0.5)"
            }
          }
        )
      }
    );
  }
);
St.displayName = "ColorPickerSelection";
const Ic = ({
  className: e,
  ...n
}) => {
  const { hue: r, setHue: t } = Pn();
  return /* @__PURE__ */ o.jsxs(
    Gc,
    {
      className: F("relative flex h-4 w-full touch-none", e),
      max: 360,
      step: 1,
      value: [r],
      onValueChange: ([f]) => t(f),
      ...n,
      children: [
        /* @__PURE__ */ o.jsx(mc, { className: "relative my-0.5 h-3 w-full grow rounded-full bg-[linear-gradient(90deg,red,yellow,lime,aqua,blue,magenta,red)]", children: /* @__PURE__ */ o.jsx(Mc, { className: "absolute h-full" }) }),
        /* @__PURE__ */ o.jsx(Cc, { className: "block size-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:ring-1 focus-visible:ring-focus-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50" })
      ]
    }
  );
}, Jc = ({
  className: e,
  ...n
}) => {
  const { setHue: r, setSaturation: t, setLightness: f, setAlpha: v } = Pn();
  if (!(typeof window < "u" && "EyeDropper" in window))
    return null;
  const c = async () => {
    try {
      const P = await new EyeDropper().open(), l = h(P.sRGBHex), [s, u, d] = l.hsl().array();
      r(s), t(u), f(d), v(100);
    } catch (A) {
      console.error("EyeDropper failed:", A);
    }
  };
  return /* @__PURE__ */ o.jsx(
    Fe,
    {
      className: F("shrink-0 text-muted-foreground size-8", e),
      size: "icon",
      type: "button",
      variant: "outline",
      onClick: c,
      ...n,
      children: /* @__PURE__ */ o.jsx(Gf, { size: 16 })
    }
  );
}, Qc = ["hex", "rgb", "hsl"], Lc = ({ ...e }) => {
  const { mode: n, setMode: r } = Pn();
  return /* @__PURE__ */ o.jsxs(kn, { value: n, onValueChange: r, children: [
    /* @__PURE__ */ o.jsx(Tn, { className: "h-8 w-20 shrink-0 text-xs", ...e, children: /* @__PURE__ */ o.jsx(Gn, { placeholder: "Mode" }) }),
    /* @__PURE__ */ o.jsx(mn, { children: Qc.map((t) => /* @__PURE__ */ o.jsx(Mn, { className: "text-xs", value: t, children: t.toUpperCase() }, t)) })
  ] });
}, Yc = ({
  className: e,
  ...n
}) => {
  const {
    hue: r,
    saturation: t,
    lightness: f,
    mode: v,
    setHue: a,
    setSaturation: c,
    setLightness: A,
    setAlpha: P
  } = Pn(), l = h.hsl(r, t, f), [s, u] = $(null), d = (i, H) => {
    try {
      if (v === "hex") {
        const w = h(i);
        a(w.hue()), c(w.saturationl()), A(w.lightness()), P(w.alpha() * 100);
      } else if ((v === "rgb" || v === "hsl") && H !== void 0) {
        const w = l[v]().array().map((b) => Math.round(b));
        w[H] = parseInt(i, 10) || 0;
        const j = h[v](w[0], w[1], w[2]);
        a(j.hue()), c(j.saturationl()), A(j.lightness());
      }
    } catch {
    }
  };
  if (v === "hex") {
    const i = l.hex();
    return /* @__PURE__ */ o.jsx(
      "div",
      {
        className: F(
          "-space-x-px relative flex w-full items-center rounded-md",
          e
        ),
        ...n,
        children: /* @__PURE__ */ o.jsx(
          fn,
          {
            className: "h-8 px-2 font-mono text-xs shadow-none",
            type: "text",
            value: s ?? i,
            onBlur: () => {
              u(null);
            },
            onChange: (H) => {
              u(H.target.value), d(H.target.value);
            }
          }
        )
      }
    );
  }
  if (v === "rgb" || v === "hsl") {
    const i = l[v]().array().map((H) => Math.round(H));
    return /* @__PURE__ */ o.jsx(
      "div",
      {
        className: F(
          "-space-x-px flex flex-1 items-stretch rounded-md",
          e
        ),
        ...n,
        children: i.map((H, w) => /* @__PURE__ */ o.jsx(
          fn,
          {
            className: F(
              "h-8 px-2 font-mono text-xs flex-1 shadow-none focus:z-10",
              w && "rounded-l-none",
              w < i.length - 1 && "rounded-r-none"
            ),
            maxLength: 3,
            size: 4,
            type: "text",
            value: H,
            onChange: (j) => {
              d(j.target.value, w);
            }
          },
          w
        ))
      }
    );
  }
  return null;
}, Wc = (e) => /* @__PURE__ */ o.jsxs(Sc, { className: "w-auto min-w-80", ...e, children: [
  /* @__PURE__ */ o.jsx(St, { className: "aspect-square" }),
  /* @__PURE__ */ o.jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ o.jsx(Jc, {}),
    /* @__PURE__ */ o.jsx(Ic, {})
  ] }),
  /* @__PURE__ */ o.jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ o.jsx(Lc, {}),
    /* @__PURE__ */ o.jsx(Yc, {})
  ] })
] }), Rc = {
  "member-welcome-email-free": "Onboard new free members with a short welcome email.",
  "member-welcome-email-paid": "Greet new paid members and point them at member-only content."
}, Fc = () => /* @__PURE__ */ o.jsx(Zr, { className: "flex table-fixed flex-col border-t lg:table", "data-testid": "automations-list-loading", children: /* @__PURE__ */ o.jsx(Er, { className: "flex flex-col lg:table-row-group", children: Array.from({ length: 2 }, (e, n) => /* @__PURE__ */ o.jsxs(
  Vr,
  {
    "aria-hidden": "true",
    className: "grid w-full grid-cols-[1fr_auto] items-center gap-x-4 p-2 lg:table-row lg:p-0",
    children: [
      /* @__PURE__ */ o.jsxs(bn, { className: "min-w-0 lg:p-4", children: [
        /* @__PURE__ */ o.jsx(En, { className: "mb-1 h-3 w-48 max-w-full " }),
        /* @__PURE__ */ o.jsx(En, { className: "h-3 w-80 max-w-full" })
      ] }),
      /* @__PURE__ */ o.jsx(bn, { className: "text-right lg:w-32 lg:p-4", children: /* @__PURE__ */ o.jsx(En, { className: "ml-auto h-3 w-16" }) })
    ]
  },
  n
)) }) }), qc = ({ automations: e = [], isLoading: n = !1 }) => n ? /* @__PURE__ */ o.jsx(Fc, {}) : /* @__PURE__ */ o.jsx(Zr, { className: "flex table-fixed flex-col border-t lg:table", "data-testid": "automations-list", children: /* @__PURE__ */ o.jsx(Er, { className: "flex flex-col lg:table-row-group", children: e.map((r) => {
  const t = Rc[r.slug];
  return /* @__PURE__ */ o.jsxs(
    Vr,
    {
      className: "grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-x-4 p-2 lg:table-row lg:p-0",
      "data-testid": "automation-list-row",
      children: [
        /* @__PURE__ */ o.jsxs(bn, { className: "static min-w-0 lg:p-4", children: [
          /* @__PURE__ */ o.jsx(
            ef,
            {
              className: "before:absolute before:inset-0 before:z-10 before:rounded-sm focus-visible:outline-hidden focus-visible:before:ring-2 focus-visible:before:ring-focus-ring",
              to: `/automations/${r.id}`,
              children: /* @__PURE__ */ o.jsx("span", { className: "block text-md font-semibold", children: r.name })
            }
          ),
          t && /* @__PURE__ */ o.jsx("span", { className: "block text-muted-foreground", children: t })
        ] }),
        /* @__PURE__ */ o.jsx(bn, { className: "text-right lg:w-32 lg:p-4", children: /* @__PURE__ */ o.jsx(nf, { status: r.status }) })
      ]
    },
    r.slug
  );
}) }) }), Nc = ({
  title: e = "Are you sure you want to leave this page?",
  description: n = /* @__PURE__ */ o.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ o.jsx("p", { children: "Hey there! It looks like you didn't save the changes you made." }),
    /* @__PURE__ */ o.jsx("p", { children: "Save before you go!" })
  ] })
}) => {
  const r = In(), t = Q(r.visible), f = Q(!1);
  return S(() => {
    t.current && !r.visible && (r.resolveHide(), r.remove()), t.current = r.visible;
  }, [r]), /* @__PURE__ */ o.jsx(
    lf,
    {
      open: r.visible,
      onOpenChange: (v) => {
        v || (r.resolve(f.current), f.current = !1, r.hide());
      },
      children: /* @__PURE__ */ o.jsxs(
        sf,
        {
          "data-testid": "welcome-email-dirty-confirm-modal",
          onEscapeKeyDown: (v) => {
            v.stopPropagation();
          },
          children: [
            /* @__PURE__ */ o.jsxs(uf, { children: [
              /* @__PURE__ */ o.jsx(df, { children: e }),
              /* @__PURE__ */ o.jsx(Hf, { asChild: !0, children: n })
            ] }),
            /* @__PURE__ */ o.jsxs(wf, { children: [
              /* @__PURE__ */ o.jsx(jf, { asChild: !0, children: /* @__PURE__ */ o.jsx(Fe, { variant: "outline", children: "Stay" }) }),
              /* @__PURE__ */ o.jsx(gf, { asChild: !0, children: /* @__PURE__ */ o.jsx(
                Fe,
                {
                  variant: "destructive",
                  onClick: () => {
                    f.current = !0;
                  },
                  children: "Leave"
                }
              ) })
            ] })
          ]
        }
      )
    }
  );
}, Zc = cn.create(Nc), Ec = ({
  open: e,
  title: n,
  preview: r,
  sidebar: t,
  dirty: f = !1,
  isLoading: v = !1,
  okProps: a,
  onSave: c,
  onClose: A,
  afterClose: P,
  testId: l
}) => {
  const s = Q(c), u = Q(e);
  S(() => {
    s.current = c;
  }, [c]), S(() => {
    u.current && !e && P?.(), u.current = e;
  }, [P, e]), S(() => {
    const i = (H) => {
      (H.metaKey || H.ctrlKey) && H.key === "s" && (H.preventDefault(), s.current());
    };
    return window.addEventListener("keydown", i), () => window.removeEventListener("keydown", i);
  }, []);
  const d = async () => {
    if (!f) {
      A();
      return;
    }
    await cn.show(Zc) && A();
  };
  return /* @__PURE__ */ o.jsx(
    Xf,
    {
      open: e,
      onOpenChange: (i) => {
        i || d();
      },
      children: /* @__PURE__ */ o.jsx(
        bf,
        {
          className: F(
            "top-[50%] left-[50%] h-[calc(100vh-8vmin)] w-[calc(100vw-8vmin)] max-w-none translate-x-[-50%] translate-y-[-50%] gap-0 overflow-hidden p-0"
          ),
          "data-testid": l,
          onEscapeKeyDown: (i) => {
            i.preventDefault(), i.stopPropagation(), d();
          },
          children: /* @__PURE__ */ o.jsxs("div", { className: "flex h-full min-h-0", children: [
            /* @__PURE__ */ o.jsx("div", { className: "hidden min-h-0 flex-1 flex-col bg-gray-50 dark:bg-black [@media(min-width:801px)]:flex", children: /* @__PURE__ */ o.jsx("div", { className: "flex min-h-0 flex-1 items-center justify-center p-8", children: r }) }),
            /* @__PURE__ */ o.jsxs("div", { className: "flex min-h-0 w-full flex-col border-l border-gray-200 dark:border-gray-900 [@media(min-width:801px)]:w-[400px] [@media(min-width:801px)]:shrink-0", children: [
              /* @__PURE__ */ o.jsxs("div", { className: "flex items-center justify-between px-6 py-5", children: [
                /* @__PURE__ */ o.jsx(pf, { children: n }),
                /* @__PURE__ */ o.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ o.jsx(Fe, { variant: "outline", onClick: () => d(), children: "Close" }),
                  /* @__PURE__ */ o.jsx(
                    Fe,
                    {
                      className: a?.color === "green" ? "bg-green text-white hover:bg-green/90" : void 0,
                      disabled: v || a?.disabled,
                      variant: a?.color === "red" ? "destructive" : "default",
                      onClick: c,
                      children: a?.label || "Save"
                    }
                  )
                ] })
              ] }),
              t
            ] })
          ] })
        }
      )
    }
  );
};
function br(e, n) {
  return n = { exports: {} }, e(n, n.exports), n.exports;
}
var nn = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
}, Vc = function(n) {
  return !n || typeof n == "string" ? !1 : n instanceof Array || Array.isArray(n) || n.length >= 0 && (n.splice instanceof Function || Object.getOwnPropertyDescriptor(n, n.length - 1) && n.constructor.name !== "String");
}, rn = br(function(e) {
  var n = Array.prototype.concat, r = Array.prototype.slice, t = e.exports = function(v) {
    for (var a = [], c = 0, A = v.length; c < A; c++) {
      var P = v[c];
      Vc(P) ? a = n.call(a, r.call(P)) : a.push(P);
    }
    return a;
  };
  t.wrap = function(f) {
    return function() {
      return f(t(arguments));
    };
  };
}), me = br(function(e) {
  var n = Object.hasOwnProperty, r = /* @__PURE__ */ Object.create(null);
  for (var t in nn)
    n.call(nn, t) && (r[nn[t]] = t);
  var f = e.exports = {
    to: {},
    get: {}
  };
  f.get = function(c) {
    var A = c.substring(0, 3).toLowerCase(), P, l;
    switch (A) {
      case "hsl":
        P = f.get.hsl(c), l = "hsl";
        break;
      case "hwb":
        P = f.get.hwb(c), l = "hwb";
        break;
      default:
        P = f.get.rgb(c), l = "rgb";
        break;
    }
    return P ? { model: l, value: P } : null;
  }, f.get.rgb = function(c) {
    if (!c)
      return null;
    var A = /^#([a-f0-9]{3,4})$/i, P = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i, l = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/, s = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/, u = /^(\w+)$/, d = [0, 0, 0, 1], i, H, w;
    if (i = c.match(P)) {
      for (w = i[2], i = i[1], H = 0; H < 3; H++) {
        var j = H * 2;
        d[H] = parseInt(i.slice(j, j + 2), 16);
      }
      w && (d[3] = parseInt(w, 16) / 255);
    } else if (i = c.match(A)) {
      for (i = i[1], w = i[3], H = 0; H < 3; H++)
        d[H] = parseInt(i[H] + i[H], 16);
      w && (d[3] = parseInt(w + w, 16) / 255);
    } else if (i = c.match(l)) {
      for (H = 0; H < 3; H++)
        d[H] = parseInt(i[H + 1], 0);
      i[4] && (i[5] ? d[3] = parseFloat(i[4]) * 0.01 : d[3] = parseFloat(i[4]));
    } else if (i = c.match(s)) {
      for (H = 0; H < 3; H++)
        d[H] = Math.round(parseFloat(i[H + 1]) * 2.55);
      i[4] && (i[5] ? d[3] = parseFloat(i[4]) * 0.01 : d[3] = parseFloat(i[4]));
    } else return (i = c.match(u)) ? i[1] === "transparent" ? [0, 0, 0, 0] : n.call(nn, i[1]) ? (d = nn[i[1]], d[3] = 1, d) : null : null;
    for (H = 0; H < 3; H++)
      d[H] = v(d[H], 0, 255);
    return d[3] = v(d[3], 0, 1), d;
  }, f.get.hsl = function(c) {
    if (!c)
      return null;
    var A = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/, P = c.match(A);
    if (P) {
      var l = parseFloat(P[4]), s = (parseFloat(P[1]) % 360 + 360) % 360, u = v(parseFloat(P[2]), 0, 100), d = v(parseFloat(P[3]), 0, 100), i = v(isNaN(l) ? 1 : l, 0, 1);
      return [s, u, d, i];
    }
    return null;
  }, f.get.hwb = function(c) {
    if (!c)
      return null;
    var A = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/, P = c.match(A);
    if (P) {
      var l = parseFloat(P[4]), s = (parseFloat(P[1]) % 360 + 360) % 360, u = v(parseFloat(P[2]), 0, 100), d = v(parseFloat(P[3]), 0, 100), i = v(isNaN(l) ? 1 : l, 0, 1);
      return [s, u, d, i];
    }
    return null;
  }, f.to.hex = function() {
    var c = rn(arguments);
    return "#" + a(c[0]) + a(c[1]) + a(c[2]) + (c[3] < 1 ? a(Math.round(c[3] * 255)) : "");
  }, f.to.rgb = function() {
    var c = rn(arguments);
    return c.length < 4 || c[3] === 1 ? "rgb(" + Math.round(c[0]) + ", " + Math.round(c[1]) + ", " + Math.round(c[2]) + ")" : "rgba(" + Math.round(c[0]) + ", " + Math.round(c[1]) + ", " + Math.round(c[2]) + ", " + c[3] + ")";
  }, f.to.rgb.percent = function() {
    var c = rn(arguments), A = Math.round(c[0] / 255 * 100), P = Math.round(c[1] / 255 * 100), l = Math.round(c[2] / 255 * 100);
    return c.length < 4 || c[3] === 1 ? "rgb(" + A + "%, " + P + "%, " + l + "%)" : "rgba(" + A + "%, " + P + "%, " + l + "%, " + c[3] + ")";
  }, f.to.hsl = function() {
    var c = rn(arguments);
    return c.length < 4 || c[3] === 1 ? "hsl(" + c[0] + ", " + c[1] + "%, " + c[2] + "%)" : "hsla(" + c[0] + ", " + c[1] + "%, " + c[2] + "%, " + c[3] + ")";
  }, f.to.hwb = function() {
    var c = rn(arguments), A = "";
    return c.length >= 4 && c[3] !== 1 && (A = ", " + c[3]), "hwb(" + c[0] + ", " + c[1] + "%, " + c[2] + "%" + A + ")";
  }, f.to.keyword = function(c) {
    return r[c.slice(0, 3)];
  };
  function v(c, A, P) {
    return Math.min(Math.max(A, c), P);
  }
  function a(c) {
    var A = Math.round(c).toString(16).toUpperCase();
    return A.length < 2 ? "0" + A : A;
  }
});
me.to;
me.get;
var ke = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
}, m = br(function(e) {
  var n = {};
  for (var r in ke)
    ke.hasOwnProperty(r) && (n[ke[r]] = r);
  var t = e.exports = {
    rgb: { channels: 3, labels: "rgb" },
    hsl: { channels: 3, labels: "hsl" },
    hsv: { channels: 3, labels: "hsv" },
    hwb: { channels: 3, labels: "hwb" },
    cmyk: { channels: 4, labels: "cmyk" },
    xyz: { channels: 3, labels: "xyz" },
    lab: { channels: 3, labels: "lab" },
    lch: { channels: 3, labels: "lch" },
    hex: { channels: 1, labels: ["hex"] },
    keyword: { channels: 1, labels: ["keyword"] },
    ansi16: { channels: 1, labels: ["ansi16"] },
    ansi256: { channels: 1, labels: ["ansi256"] },
    hcg: { channels: 3, labels: ["h", "c", "g"] },
    apple: { channels: 3, labels: ["r16", "g16", "b16"] },
    gray: { channels: 1, labels: ["gray"] }
  };
  for (var f in t)
    if (t.hasOwnProperty(f)) {
      if (!("channels" in t[f]))
        throw new Error("missing channels property: " + f);
      if (!("labels" in t[f]))
        throw new Error("missing channel labels property: " + f);
      if (t[f].labels.length !== t[f].channels)
        throw new Error("channel and label counts mismatch: " + f);
      var v = t[f].channels, a = t[f].labels;
      delete t[f].channels, delete t[f].labels, Object.defineProperty(t[f], "channels", { value: v }), Object.defineProperty(t[f], "labels", { value: a });
    }
  t.rgb.hsl = function(A) {
    var P = A[0] / 255, l = A[1] / 255, s = A[2] / 255, u = Math.min(P, l, s), d = Math.max(P, l, s), i = d - u, H, w, j;
    return d === u ? H = 0 : P === d ? H = (l - s) / i : l === d ? H = 2 + (s - P) / i : s === d && (H = 4 + (P - l) / i), H = Math.min(H * 60, 360), H < 0 && (H += 360), j = (u + d) / 2, d === u ? w = 0 : j <= 0.5 ? w = i / (d + u) : w = i / (2 - d - u), [H, w * 100, j * 100];
  }, t.rgb.hsv = function(A) {
    var P, l, s, u, d, i = A[0] / 255, H = A[1] / 255, w = A[2] / 255, j = Math.max(i, H, w), b = j - Math.min(i, H, w), x = function(p) {
      return (j - p) / 6 / b + 1 / 2;
    };
    return b === 0 ? u = d = 0 : (d = b / j, P = x(i), l = x(H), s = x(w), i === j ? u = s - l : H === j ? u = 1 / 3 + P - s : w === j && (u = 2 / 3 + l - P), u < 0 ? u += 1 : u > 1 && (u -= 1)), [
      u * 360,
      d * 100,
      j * 100
    ];
  }, t.rgb.hwb = function(A) {
    var P = A[0], l = A[1], s = A[2], u = t.rgb.hsl(A)[0], d = 1 / 255 * Math.min(P, Math.min(l, s));
    return s = 1 - 1 / 255 * Math.max(P, Math.max(l, s)), [u, d * 100, s * 100];
  }, t.rgb.cmyk = function(A) {
    var P = A[0] / 255, l = A[1] / 255, s = A[2] / 255, u, d, i, H;
    return H = Math.min(1 - P, 1 - l, 1 - s), u = (1 - P - H) / (1 - H) || 0, d = (1 - l - H) / (1 - H) || 0, i = (1 - s - H) / (1 - H) || 0, [u * 100, d * 100, i * 100, H * 100];
  };
  function c(A, P) {
    return Math.pow(A[0] - P[0], 2) + Math.pow(A[1] - P[1], 2) + Math.pow(A[2] - P[2], 2);
  }
  t.rgb.keyword = function(A) {
    var P = n[A];
    if (P)
      return P;
    var l = 1 / 0, s;
    for (var u in ke)
      if (ke.hasOwnProperty(u)) {
        var d = ke[u], i = c(A, d);
        i < l && (l = i, s = u);
      }
    return s;
  }, t.keyword.rgb = function(A) {
    return ke[A];
  }, t.rgb.xyz = function(A) {
    var P = A[0] / 255, l = A[1] / 255, s = A[2] / 255;
    P = P > 0.04045 ? Math.pow((P + 0.055) / 1.055, 2.4) : P / 12.92, l = l > 0.04045 ? Math.pow((l + 0.055) / 1.055, 2.4) : l / 12.92, s = s > 0.04045 ? Math.pow((s + 0.055) / 1.055, 2.4) : s / 12.92;
    var u = P * 0.4124 + l * 0.3576 + s * 0.1805, d = P * 0.2126 + l * 0.7152 + s * 0.0722, i = P * 0.0193 + l * 0.1192 + s * 0.9505;
    return [u * 100, d * 100, i * 100];
  }, t.rgb.lab = function(A) {
    var P = t.rgb.xyz(A), l = P[0], s = P[1], u = P[2], d, i, H;
    return l /= 95.047, s /= 100, u /= 108.883, l = l > 8856e-6 ? Math.pow(l, 1 / 3) : 7.787 * l + 16 / 116, s = s > 8856e-6 ? Math.pow(s, 1 / 3) : 7.787 * s + 16 / 116, u = u > 8856e-6 ? Math.pow(u, 1 / 3) : 7.787 * u + 16 / 116, d = 116 * s - 16, i = 500 * (l - s), H = 200 * (s - u), [d, i, H];
  }, t.hsl.rgb = function(A) {
    var P = A[0] / 360, l = A[1] / 100, s = A[2] / 100, u, d, i, H, w;
    if (l === 0)
      return w = s * 255, [w, w, w];
    s < 0.5 ? d = s * (1 + l) : d = s + l - s * l, u = 2 * s - d, H = [0, 0, 0];
    for (var j = 0; j < 3; j++)
      i = P + 1 / 3 * -(j - 1), i < 0 && i++, i > 1 && i--, 6 * i < 1 ? w = u + (d - u) * 6 * i : 2 * i < 1 ? w = d : 3 * i < 2 ? w = u + (d - u) * (2 / 3 - i) * 6 : w = u, H[j] = w * 255;
    return H;
  }, t.hsl.hsv = function(A) {
    var P = A[0], l = A[1] / 100, s = A[2] / 100, u = l, d = Math.max(s, 0.01), i, H;
    return s *= 2, l *= s <= 1 ? s : 2 - s, u *= d <= 1 ? d : 2 - d, H = (s + l) / 2, i = s === 0 ? 2 * u / (d + u) : 2 * l / (s + l), [P, i * 100, H * 100];
  }, t.hsv.rgb = function(A) {
    var P = A[0] / 60, l = A[1] / 100, s = A[2] / 100, u = Math.floor(P) % 6, d = P - Math.floor(P), i = 255 * s * (1 - l), H = 255 * s * (1 - l * d), w = 255 * s * (1 - l * (1 - d));
    switch (s *= 255, u) {
      case 0:
        return [s, w, i];
      case 1:
        return [H, s, i];
      case 2:
        return [i, s, w];
      case 3:
        return [i, H, s];
      case 4:
        return [w, i, s];
      case 5:
        return [s, i, H];
    }
  }, t.hsv.hsl = function(A) {
    var P = A[0], l = A[1] / 100, s = A[2] / 100, u = Math.max(s, 0.01), d, i, H;
    return H = (2 - l) * s, d = (2 - l) * u, i = l * u, i /= d <= 1 ? d : 2 - d, i = i || 0, H /= 2, [P, i * 100, H * 100];
  }, t.hwb.rgb = function(A) {
    var P = A[0] / 360, l = A[1] / 100, s = A[2] / 100, u = l + s, d, i, H, w;
    u > 1 && (l /= u, s /= u), d = Math.floor(6 * P), i = 1 - s, H = 6 * P - d, (d & 1) !== 0 && (H = 1 - H), w = l + H * (i - l);
    var j, b, x;
    switch (d) {
      default:
      case 6:
      case 0:
        j = i, b = w, x = l;
        break;
      case 1:
        j = w, b = i, x = l;
        break;
      case 2:
        j = l, b = i, x = w;
        break;
      case 3:
        j = l, b = w, x = i;
        break;
      case 4:
        j = w, b = l, x = i;
        break;
      case 5:
        j = i, b = l, x = w;
        break;
    }
    return [j * 255, b * 255, x * 255];
  }, t.cmyk.rgb = function(A) {
    var P = A[0] / 100, l = A[1] / 100, s = A[2] / 100, u = A[3] / 100, d, i, H;
    return d = 1 - Math.min(1, P * (1 - u) + u), i = 1 - Math.min(1, l * (1 - u) + u), H = 1 - Math.min(1, s * (1 - u) + u), [d * 255, i * 255, H * 255];
  }, t.xyz.rgb = function(A) {
    var P = A[0] / 100, l = A[1] / 100, s = A[2] / 100, u, d, i;
    return u = P * 3.2406 + l * -1.5372 + s * -0.4986, d = P * -0.9689 + l * 1.8758 + s * 0.0415, i = P * 0.0557 + l * -0.204 + s * 1.057, u = u > 31308e-7 ? 1.055 * Math.pow(u, 1 / 2.4) - 0.055 : u * 12.92, d = d > 31308e-7 ? 1.055 * Math.pow(d, 1 / 2.4) - 0.055 : d * 12.92, i = i > 31308e-7 ? 1.055 * Math.pow(i, 1 / 2.4) - 0.055 : i * 12.92, u = Math.min(Math.max(0, u), 1), d = Math.min(Math.max(0, d), 1), i = Math.min(Math.max(0, i), 1), [u * 255, d * 255, i * 255];
  }, t.xyz.lab = function(A) {
    var P = A[0], l = A[1], s = A[2], u, d, i;
    return P /= 95.047, l /= 100, s /= 108.883, P = P > 8856e-6 ? Math.pow(P, 1 / 3) : 7.787 * P + 16 / 116, l = l > 8856e-6 ? Math.pow(l, 1 / 3) : 7.787 * l + 16 / 116, s = s > 8856e-6 ? Math.pow(s, 1 / 3) : 7.787 * s + 16 / 116, u = 116 * l - 16, d = 500 * (P - l), i = 200 * (l - s), [u, d, i];
  }, t.lab.xyz = function(A) {
    var P = A[0], l = A[1], s = A[2], u, d, i;
    d = (P + 16) / 116, u = l / 500 + d, i = d - s / 200;
    var H = Math.pow(d, 3), w = Math.pow(u, 3), j = Math.pow(i, 3);
    return d = H > 8856e-6 ? H : (d - 16 / 116) / 7.787, u = w > 8856e-6 ? w : (u - 16 / 116) / 7.787, i = j > 8856e-6 ? j : (i - 16 / 116) / 7.787, u *= 95.047, d *= 100, i *= 108.883, [u, d, i];
  }, t.lab.lch = function(A) {
    var P = A[0], l = A[1], s = A[2], u, d, i;
    return u = Math.atan2(s, l), d = u * 360 / 2 / Math.PI, d < 0 && (d += 360), i = Math.sqrt(l * l + s * s), [P, i, d];
  }, t.lch.lab = function(A) {
    var P = A[0], l = A[1], s = A[2], u, d, i;
    return i = s / 360 * 2 * Math.PI, u = l * Math.cos(i), d = l * Math.sin(i), [P, u, d];
  }, t.rgb.ansi16 = function(A) {
    var P = A[0], l = A[1], s = A[2], u = 1 in arguments ? arguments[1] : t.rgb.hsv(A)[2];
    if (u = Math.round(u / 50), u === 0)
      return 30;
    var d = 30 + (Math.round(s / 255) << 2 | Math.round(l / 255) << 1 | Math.round(P / 255));
    return u === 2 && (d += 60), d;
  }, t.hsv.ansi16 = function(A) {
    return t.rgb.ansi16(t.hsv.rgb(A), A[2]);
  }, t.rgb.ansi256 = function(A) {
    var P = A[0], l = A[1], s = A[2];
    if (P === l && l === s)
      return P < 8 ? 16 : P > 248 ? 231 : Math.round((P - 8) / 247 * 24) + 232;
    var u = 16 + 36 * Math.round(P / 255 * 5) + 6 * Math.round(l / 255 * 5) + Math.round(s / 255 * 5);
    return u;
  }, t.ansi16.rgb = function(A) {
    var P = A % 10;
    if (P === 0 || P === 7)
      return A > 50 && (P += 3.5), P = P / 10.5 * 255, [P, P, P];
    var l = (~~(A > 50) + 1) * 0.5, s = (P & 1) * l * 255, u = (P >> 1 & 1) * l * 255, d = (P >> 2 & 1) * l * 255;
    return [s, u, d];
  }, t.ansi256.rgb = function(A) {
    if (A >= 232) {
      var P = (A - 232) * 10 + 8;
      return [P, P, P];
    }
    A -= 16;
    var l, s = Math.floor(A / 36) / 5 * 255, u = Math.floor((l = A % 36) / 6) / 5 * 255, d = l % 6 / 5 * 255;
    return [s, u, d];
  }, t.rgb.hex = function(A) {
    var P = ((Math.round(A[0]) & 255) << 16) + ((Math.round(A[1]) & 255) << 8) + (Math.round(A[2]) & 255), l = P.toString(16).toUpperCase();
    return "000000".substring(l.length) + l;
  }, t.hex.rgb = function(A) {
    var P = A.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!P)
      return [0, 0, 0];
    var l = P[0];
    P[0].length === 3 && (l = l.split("").map(function(H) {
      return H + H;
    }).join(""));
    var s = parseInt(l, 16), u = s >> 16 & 255, d = s >> 8 & 255, i = s & 255;
    return [u, d, i];
  }, t.rgb.hcg = function(A) {
    var P = A[0] / 255, l = A[1] / 255, s = A[2] / 255, u = Math.max(Math.max(P, l), s), d = Math.min(Math.min(P, l), s), i = u - d, H, w;
    return i < 1 ? H = d / (1 - i) : H = 0, i <= 0 ? w = 0 : u === P ? w = (l - s) / i % 6 : u === l ? w = 2 + (s - P) / i : w = 4 + (P - l) / i + 4, w /= 6, w %= 1, [w * 360, i * 100, H * 100];
  }, t.hsl.hcg = function(A) {
    var P = A[1] / 100, l = A[2] / 100, s = 1, u = 0;
    return l < 0.5 ? s = 2 * P * l : s = 2 * P * (1 - l), s < 1 && (u = (l - 0.5 * s) / (1 - s)), [A[0], s * 100, u * 100];
  }, t.hsv.hcg = function(A) {
    var P = A[1] / 100, l = A[2] / 100, s = P * l, u = 0;
    return s < 1 && (u = (l - s) / (1 - s)), [A[0], s * 100, u * 100];
  }, t.hcg.rgb = function(A) {
    var P = A[0] / 360, l = A[1] / 100, s = A[2] / 100;
    if (l === 0)
      return [s * 255, s * 255, s * 255];
    var u = [0, 0, 0], d = P % 1 * 6, i = d % 1, H = 1 - i, w = 0;
    switch (Math.floor(d)) {
      case 0:
        u[0] = 1, u[1] = i, u[2] = 0;
        break;
      case 1:
        u[0] = H, u[1] = 1, u[2] = 0;
        break;
      case 2:
        u[0] = 0, u[1] = 1, u[2] = i;
        break;
      case 3:
        u[0] = 0, u[1] = H, u[2] = 1;
        break;
      case 4:
        u[0] = i, u[1] = 0, u[2] = 1;
        break;
      default:
        u[0] = 1, u[1] = 0, u[2] = H;
    }
    return w = (1 - l) * s, [
      (l * u[0] + w) * 255,
      (l * u[1] + w) * 255,
      (l * u[2] + w) * 255
    ];
  }, t.hcg.hsv = function(A) {
    var P = A[1] / 100, l = A[2] / 100, s = P + l * (1 - P), u = 0;
    return s > 0 && (u = P / s), [A[0], u * 100, s * 100];
  }, t.hcg.hsl = function(A) {
    var P = A[1] / 100, l = A[2] / 100, s = l * (1 - P) + 0.5 * P, u = 0;
    return s > 0 && s < 0.5 ? u = P / (2 * s) : s >= 0.5 && s < 1 && (u = P / (2 * (1 - s))), [A[0], u * 100, s * 100];
  }, t.hcg.hwb = function(A) {
    var P = A[1] / 100, l = A[2] / 100, s = P + l * (1 - P);
    return [A[0], (s - P) * 100, (1 - s) * 100];
  }, t.hwb.hcg = function(A) {
    var P = A[1] / 100, l = A[2] / 100, s = 1 - l, u = s - P, d = 0;
    return u < 1 && (d = (s - u) / (1 - u)), [A[0], u * 100, d * 100];
  }, t.apple.rgb = function(A) {
    return [A[0] / 65535 * 255, A[1] / 65535 * 255, A[2] / 65535 * 255];
  }, t.rgb.apple = function(A) {
    return [A[0] / 255 * 65535, A[1] / 255 * 65535, A[2] / 255 * 65535];
  }, t.gray.rgb = function(A) {
    return [A[0] / 100 * 255, A[0] / 100 * 255, A[0] / 100 * 255];
  }, t.gray.hsl = t.gray.hsv = function(A) {
    return [0, 0, A[0]];
  }, t.gray.hwb = function(A) {
    return [0, 100, A[0]];
  }, t.gray.cmyk = function(A) {
    return [0, 0, 0, A[0]];
  }, t.gray.lab = function(A) {
    return [A[0], 0, 0];
  }, t.gray.hex = function(A) {
    var P = Math.round(A[0] / 100 * 255) & 255, l = (P << 16) + (P << 8) + P, s = l.toString(16).toUpperCase();
    return "000000".substring(s.length) + s;
  }, t.rgb.gray = function(A) {
    var P = (A[0] + A[1] + A[2]) / 3;
    return [P / 255 * 100];
  };
});
m.rgb;
m.hsl;
m.hsv;
m.hwb;
m.cmyk;
m.xyz;
m.lab;
m.lch;
m.hex;
m.keyword;
m.ansi16;
m.ansi256;
m.hcg;
m.apple;
m.gray;
function Kc() {
  for (var e = {}, n = Object.keys(m), r = n.length, t = 0; t < r; t++)
    e[n[t]] = {
      // http://jsperf.com/1-vs-infinity
      // micro-opt, but this is simple.
      distance: -1,
      parent: null
    };
  return e;
}
function Uc(e) {
  var n = Kc(), r = [e];
  for (n[e].distance = 0; r.length; )
    for (var t = r.pop(), f = Object.keys(m[t]), v = f.length, a = 0; a < v; a++) {
      var c = f[a], A = n[c];
      A.distance === -1 && (A.distance = n[t].distance + 1, A.parent = t, r.unshift(c));
    }
  return n;
}
function _c(e, n) {
  return function(r) {
    return n(e(r));
  };
}
function $c(e, n) {
  for (var r = [n[e].parent, e], t = m[n[e].parent][e], f = n[e].parent; n[f].parent; )
    r.unshift(n[f].parent), t = _c(m[n[f].parent][f], t), f = n[f].parent;
  return t.conversion = r, t;
}
var ea = function(e) {
  for (var n = Uc(e), r = {}, t = Object.keys(n), f = t.length, v = 0; v < f; v++) {
    var a = t[v], c = n[a];
    c.parent !== null && (r[a] = $c(a, n));
  }
  return r;
}, Je = {}, na = Object.keys(m);
function ra(e) {
  var n = function(r) {
    return r == null ? r : (arguments.length > 1 && (r = Array.prototype.slice.call(arguments)), e(r));
  };
  return "conversion" in e && (n.conversion = e.conversion), n;
}
function ta(e) {
  var n = function(r) {
    if (r == null)
      return r;
    arguments.length > 1 && (r = Array.prototype.slice.call(arguments));
    var t = e(r);
    if (typeof t == "object")
      for (var f = t.length, v = 0; v < f; v++)
        t[v] = Math.round(t[v]);
    return t;
  };
  return "conversion" in e && (n.conversion = e.conversion), n;
}
na.forEach(function(e) {
  Je[e] = {}, Object.defineProperty(Je[e], "channels", { value: m[e].channels }), Object.defineProperty(Je[e], "labels", { value: m[e].labels });
  var n = ea(e), r = Object.keys(n);
  r.forEach(function(t) {
    var f = n[t];
    Je[e][t] = ta(f), Je[e][t].raw = ra(f);
  });
});
var oe = Je, pr = [].slice, It = [
  // to be honest, I don't really feel like keyword belongs in color convert, but eh.
  "keyword",
  // gray conflicts with some method names, and has its own method defined.
  "gray",
  // shouldn't really be in color-convert either...
  "hex"
], dr = {};
Object.keys(oe).forEach(function(e) {
  dr[pr.call(oe[e].labels).sort().join("")] = e;
});
var yn = {};
function U(e, n) {
  if (!(this instanceof U))
    return new U(e, n);
  if (n && n in It && (n = null), n && !(n in oe))
    throw new Error("Unknown model: " + n);
  var r, t;
  if (e == null)
    this.model = "rgb", this.color = [0, 0, 0], this.valpha = 1;
  else if (e instanceof U)
    this.model = e.model, this.color = e.color.slice(), this.valpha = e.valpha;
  else if (typeof e == "string") {
    var f = me.get(e);
    if (f === null)
      throw new Error("Unable to parse color from string: " + e);
    this.model = f.model, t = oe[this.model].channels, this.color = f.value.slice(0, t), this.valpha = typeof f.value[t] == "number" ? f.value[t] : 1;
  } else if (e.length) {
    this.model = n || "rgb", t = oe[this.model].channels;
    var v = pr.call(e, 0, t);
    this.color = Hr(v, t), this.valpha = typeof e[t] == "number" ? e[t] : 1;
  } else if (typeof e == "number")
    e &= 16777215, this.model = "rgb", this.color = [
      e >> 16 & 255,
      e >> 8 & 255,
      e & 255
    ], this.valpha = 1;
  else {
    this.valpha = 1;
    var a = Object.keys(e);
    "alpha" in e && (a.splice(a.indexOf("alpha"), 1), this.valpha = typeof e.alpha == "number" ? e.alpha : 0);
    var c = a.sort().join("");
    if (!(c in dr))
      throw new Error("Unable to parse color from object: " + JSON.stringify(e));
    this.model = dr[c];
    var A = oe[this.model].labels, P = [];
    for (r = 0; r < A.length; r++)
      P.push(e[A[r]]);
    this.color = Hr(P);
  }
  if (yn[this.model])
    for (t = oe[this.model].channels, r = 0; r < t; r++) {
      var l = yn[this.model][r];
      l && (this.color[r] = l(this.color[r]));
    }
  this.valpha = Math.max(0, Math.min(1, this.valpha)), Object.freeze && Object.freeze(this);
}
U.prototype = {
  toString: function() {
    return this.string();
  },
  toJSON: function() {
    return this[this.model]();
  },
  string: function(e) {
    var n = this.model in me.to ? this : this.rgb();
    n = n.round(typeof e == "number" ? e : 1);
    var r = n.valpha === 1 ? n.color : n.color.concat(this.valpha);
    return me.to[n.model](r);
  },
  percentString: function(e) {
    var n = this.rgb().round(typeof e == "number" ? e : 1), r = n.valpha === 1 ? n.color : n.color.concat(this.valpha);
    return me.to.rgb.percent(r);
  },
  array: function() {
    return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
  },
  object: function() {
    for (var e = {}, n = oe[this.model].channels, r = oe[this.model].labels, t = 0; t < n; t++)
      e[r[t]] = this.color[t];
    return this.valpha !== 1 && (e.alpha = this.valpha), e;
  },
  unitArray: function() {
    var e = this.rgb().color;
    return e[0] /= 255, e[1] /= 255, e[2] /= 255, this.valpha !== 1 && e.push(this.valpha), e;
  },
  unitObject: function() {
    var e = this.rgb().object();
    return e.r /= 255, e.g /= 255, e.b /= 255, this.valpha !== 1 && (e.alpha = this.valpha), e;
  },
  round: function(e) {
    return e = Math.max(e || 0, 0), new U(this.color.map(Aa(e)).concat(this.valpha), this.model);
  },
  alpha: function(e) {
    return arguments.length ? new U(this.color.concat(Math.max(0, Math.min(1, e))), this.model) : this.valpha;
  },
  // rgb
  red: G("rgb", 0, W(255)),
  green: G("rgb", 1, W(255)),
  blue: G("rgb", 2, W(255)),
  hue: G(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, function(e) {
    return (e % 360 + 360) % 360;
  }),
  // eslint-disable-line brace-style
  saturationl: G("hsl", 1, W(100)),
  lightness: G("hsl", 2, W(100)),
  saturationv: G("hsv", 1, W(100)),
  value: G("hsv", 2, W(100)),
  chroma: G("hcg", 1, W(100)),
  gray: G("hcg", 2, W(100)),
  white: G("hwb", 1, W(100)),
  wblack: G("hwb", 2, W(100)),
  cyan: G("cmyk", 0, W(100)),
  magenta: G("cmyk", 1, W(100)),
  yellow: G("cmyk", 2, W(100)),
  black: G("cmyk", 3, W(100)),
  x: G("xyz", 0, W(100)),
  y: G("xyz", 1, W(100)),
  z: G("xyz", 2, W(100)),
  l: G("lab", 0, W(100)),
  a: G("lab", 1),
  b: G("lab", 2),
  keyword: function(e) {
    return arguments.length ? new U(e) : oe[this.model].keyword(this.color);
  },
  hex: function(e) {
    return arguments.length ? new U(e) : me.to.hex(this.rgb().round().color);
  },
  rgbNumber: function() {
    var e = this.rgb().color;
    return (e[0] & 255) << 16 | (e[1] & 255) << 8 | e[2] & 255;
  },
  luminosity: function() {
    for (var e = this.rgb().color, n = [], r = 0; r < e.length; r++) {
      var t = e[r] / 255;
      n[r] = t <= 0.03928 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * n[0] + 0.7152 * n[1] + 0.0722 * n[2];
  },
  contrast: function(e) {
    var n = this.luminosity(), r = e.luminosity();
    return n > r ? (n + 0.05) / (r + 0.05) : (r + 0.05) / (n + 0.05);
  },
  level: function(e) {
    var n = this.contrast(e);
    return n >= 7.1 ? "AAA" : n >= 4.5 ? "AA" : "";
  },
  isDark: function() {
    var e = this.rgb().color, n = (e[0] * 299 + e[1] * 587 + e[2] * 114) / 1e3;
    return n < 128;
  },
  isLight: function() {
    return !this.isDark();
  },
  negate: function() {
    for (var e = this.rgb(), n = 0; n < 3; n++)
      e.color[n] = 255 - e.color[n];
    return e;
  },
  lighten: function(e) {
    var n = this.hsl();
    return n.color[2] += n.color[2] * e, n;
  },
  darken: function(e) {
    var n = this.hsl();
    return n.color[2] -= n.color[2] * e, n;
  },
  saturate: function(e) {
    var n = this.hsl();
    return n.color[1] += n.color[1] * e, n;
  },
  desaturate: function(e) {
    var n = this.hsl();
    return n.color[1] -= n.color[1] * e, n;
  },
  whiten: function(e) {
    var n = this.hwb();
    return n.color[1] += n.color[1] * e, n;
  },
  blacken: function(e) {
    var n = this.hwb();
    return n.color[2] += n.color[2] * e, n;
  },
  grayscale: function() {
    var e = this.rgb().color, n = e[0] * 0.3 + e[1] * 0.59 + e[2] * 0.11;
    return U.rgb(n, n, n);
  },
  fade: function(e) {
    return this.alpha(this.valpha - this.valpha * e);
  },
  opaquer: function(e) {
    return this.alpha(this.valpha + this.valpha * e);
  },
  rotate: function(e) {
    var n = this.hsl(), r = n.color[0];
    return r = (r + e) % 360, r = r < 0 ? 360 + r : r, n.color[0] = r, n;
  },
  mix: function(e, n) {
    if (!e || !e.rgb)
      throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof e);
    var r = e.rgb(), t = this.rgb(), f = n === void 0 ? 0.5 : n, v = 2 * f - 1, a = r.alpha() - t.alpha(), c = ((v * a === -1 ? v : (v + a) / (1 + v * a)) + 1) / 2, A = 1 - c;
    return U.rgb(
      c * r.red() + A * t.red(),
      c * r.green() + A * t.green(),
      c * r.blue() + A * t.blue(),
      r.alpha() * f + t.alpha() * (1 - f)
    );
  }
};
Object.keys(oe).forEach(function(e) {
  if (It.indexOf(e) === -1) {
    var n = oe[e].channels;
    U.prototype[e] = function() {
      if (this.model === e)
        return new U(this);
      if (arguments.length)
        return new U(arguments, e);
      var r = typeof arguments[n] == "number" ? n : this.valpha;
      return new U(ca(oe[this.model][e].raw(this.color)).concat(r), e);
    }, U[e] = function(r) {
      return typeof r == "number" && (r = Hr(pr.call(arguments), n)), new U(r, e);
    };
  }
});
function fa(e, n) {
  return Number(e.toFixed(n));
}
function Aa(e) {
  return function(n) {
    return fa(n, e);
  };
}
function G(e, n, r) {
  return e = Array.isArray(e) ? e : [e], e.forEach(function(t) {
    (yn[t] || (yn[t] = []))[n] = r;
  }), e = e[0], function(t) {
    var f;
    return arguments.length ? (r && (t = r(t)), f = this[e](), f.color[n] = t, f) : (f = this[e]().color[n], r && (f = r(f)), f);
  };
}
function W(e) {
  return function(n) {
    return Math.max(0, Math.min(e, n));
  };
}
function ca(e) {
  return Array.isArray(e) ? e : [e];
}
function Hr(e, n) {
  for (var r = 0; r < n; r++)
    typeof e[r] != "number" && (e[r] = 0);
  return e;
}
var _n = U;
function be(e) {
  const n = _n(e), r = _n({ r: 255, g: 255, b: 255 }), t = _n({ r: 0, g: 0, b: 0 });
  return n.red() * 0.299 + n.green() * 0.587 + n.b() * 0.114 >= 186 ? t : r;
}
const Ue = /^#(?:[0-9a-f]{3}){1,2}$/i;
function aa(e) {
  return Ue.test(e) ? e : "#ffffff";
}
function va(e, n) {
  return !e || e === "transparent" ? "transparent" : e === "accent" ? n : Ue.test(e) ? e : "transparent";
}
function oa(e, n, r) {
  return Ue.test(e || "") ? e : e === null ? be(r).hex() : n;
}
function Pa(e, n) {
  if (e === "fill")
    return be(n).hex();
}
function la(e, n, r) {
  const t = e === void 0 ? "accent" : e;
  return t === "accent" ? n : Ue.test(t || "") ? t : be(r).hex();
}
function sa(e, n, r) {
  return Ue.test(e || "") ? e : e === "accent" ? n : be(r).hex();
}
function ua(e, n) {
  return Ue.test(e || "") ? e : e === "accent" ? n : "#e0e7eb";
}
function Jt(e, n) {
  const r = aa(e.background_color), t = va(e.header_background_color, n), f = oa(e.button_color, n, r), v = be(r).hex(), a = be(r).alpha(0.5).toString(), c = t === "transparent" ? v : be(t).hex(), A = t === "transparent" ? a : be(t).alpha(0.5).toString();
  return {
    backgroundColor: r,
    headerBackgroundColor: t,
    sectionTitleColor: sa(e.section_title_color, n, r),
    buttonColor: f,
    buttonTextColor: Pa(e.button_style, f),
    linkColor: la(e.link_color, n, r),
    dividerColor: ua(e.divider_color, n),
    textColor: v,
    secondaryTextColor: a,
    headerTextColor: c,
    secondaryHeaderTextColor: A
  };
}
function ia(e) {
  return e === "serif" ? "Georgia, serif" : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
}
function da(e) {
  switch (e) {
    case "square":
      return "rounded-none";
    case "pill":
      return "rounded-full";
    default:
      return "rounded-[6px]";
  }
}
function Qt(e) {
  return e === "rounded" ? "rounded-md" : "";
}
const Ha = ({ senderName: e, senderEmail: n, replyToEmail: r, subject: t, showRecipientLine: f = !0, showSubjectLine: v = !0 }) => {
  const a = r || n, c = e && n ? `${e} (${n})` : e || n;
  return !c && !a && (!v || !t) ? null : /* @__PURE__ */ o.jsxs("div", { className: "flex flex-col justify-center gap-1 border-b border-grey-200 bg-white p-6 text-sm text-grey-700", children: [
    c && /* @__PURE__ */ o.jsxs("div", { children: [
      /* @__PURE__ */ o.jsx("span", { className: "font-semibold text-grey-900", children: "From:" }),
      " ",
      c
    ] }),
    f && n && /* @__PURE__ */ o.jsxs("div", { children: [
      /* @__PURE__ */ o.jsx("span", { className: "font-semibold text-grey-900", children: "To:" }),
      " subscriber@example.com"
    ] }),
    a && /* @__PURE__ */ o.jsxs("div", { children: [
      /* @__PURE__ */ o.jsx("span", { className: "font-semibold text-grey-900", children: "Reply-to:" }),
      " ",
      a
    ] }),
    v && t && /* @__PURE__ */ o.jsx("div", { className: "text-base font-medium text-grey-900", children: t })
  ] });
}, wa = ({ iconUrl: e, showIcon: n, showTitle: r, siteTitle: t, backgroundColor: f, textColor: v }) => !n && (!r || !t) ? null : /* @__PURE__ */ o.jsxs(
  "div",
  {
    className: "px-[7rem] py-3 text-center",
    style: { backgroundColor: f === "transparent" ? void 0 : f },
    children: [
      n && e && /* @__PURE__ */ o.jsx(
        "img",
        {
          alt: t || "Publication icon",
          className: "mx-auto mb-3 h-12 w-12 rounded",
          src: e
        }
      ),
      r && t && /* @__PURE__ */ o.jsx(
        "h4",
        {
          className: "mb-1 text-[1.6rem] leading-tight font-bold tracking-tight uppercase",
          style: { color: v },
          children: t
        }
      )
    ]
  }
), ja = ({ siteTitle: e, footerLinkText: n = "Unsubscribe", emailFooter: r, showBadge: t, color: f, textColor: v }) => /* @__PURE__ */ o.jsxs("div", { className: "flex flex-col items-center pt-10", children: [
  r && /* @__PURE__ */ o.jsx(
    "div",
    {
      className: "px-8 py-3 text-center text-[1.3rem] leading-base break-words whitespace-pre-line",
      style: { color: f },
      children: r
    }
  ),
  /* @__PURE__ */ o.jsxs("div", { className: "px-8 pt-3 pb-14 text-center text-[1.3rem]", children: [
    /* @__PURE__ */ o.jsxs("span", { style: { color: f }, children: [
      e || "Your publication",
      " © ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " — "
    ] }),
    /* @__PURE__ */ o.jsx("span", { className: "underline", style: { color: f }, children: n })
  ] }),
  t && /* @__PURE__ */ o.jsx("div", { className: "flex flex-col items-center pt-[10px] pb-[40px]", children: /* @__PURE__ */ o.jsxs("span", { className: "inline-flex items-center px-2 py-1 text-[1.25rem] font-semibold tracking-tight", style: { color: v }, children: [
    /* @__PURE__ */ o.jsx(fc, { className: "mr-[6px] size-4" }),
    /* @__PURE__ */ o.jsx("span", { children: "Powered by Ghost" })
  ] }) })
] }), ga = ({ settings: e, accentColor: n, publicationIcon: r, siteTitle: t, senderName: f, senderEmail: v, replyToEmail: a, subject: c, showRecipientLine: A = !0, showSubjectLine: P = !0, headerImage: l, showPublicationIcon: s = !1, showPublicationTitle: u = !0, showBadge: d = !0, emailFooter: i, footerLinkText: H, children: w }) => {
  const j = Jt(e, n), b = Qt(e.image_corners), x = t || void 0;
  return /* @__PURE__ */ o.jsxs("div", { className: "mx-auto flex max-h-full min-h-0 w-full max-w-[700px] flex-col overflow-hidden rounded-[4px] text-black shadow-sm", children: [
    /* @__PURE__ */ o.jsx(Ha, { replyToEmail: a, senderEmail: v, senderName: f, showRecipientLine: A, showSubjectLine: P, subject: c }),
    /* @__PURE__ */ o.jsxs(
      "div",
      {
        className: "min-h-0 w-full flex-1 overflow-y-auto text-sm",
        style: { backgroundColor: j.backgroundColor },
        children: [
          /* @__PURE__ */ o.jsxs("div", { className: "px-[7rem]", style: { backgroundColor: j.headerBackgroundColor === "transparent" ? void 0 : j.headerBackgroundColor }, children: [
            l && /* @__PURE__ */ o.jsx("div", { className: "pt-8", children: /* @__PURE__ */ o.jsx("img", { alt: "Header", className: F("h-auto w-full", b), src: l }) }),
            /* @__PURE__ */ o.jsx(
              wa,
              {
                backgroundColor: "transparent",
                iconUrl: r,
                showIcon: s && !!r,
                showTitle: u,
                siteTitle: x,
                textColor: j.headerTextColor
              }
            )
          ] }),
          w,
          /* @__PURE__ */ o.jsx(ja, { color: j.secondaryTextColor, emailFooter: i, footerLinkText: H, showBadge: d, siteTitle: x, textColor: j.textColor })
        ]
      }
    )
  ] });
}, Oa = Kr({
  method: "POST",
  path: () => "/images/upload/",
  body: ({ file: e }) => {
    const n = new FormData();
    return n.append("file", e), n.append("purpose", "image"), n;
  }
}), xa = (e) => e.images[0].url, Xa = ({ value: e, onChange: n }) => {
  const { mutateAsync: r } = Oa(), t = async (f) => {
    const v = xa(await r({ file: f }));
    n(v);
  };
  return /* @__PURE__ */ o.jsxs("div", { className: "flex flex-col gap-1.5", "data-testid": "header-image-field", children: [
    /* @__PURE__ */ o.jsx("label", { className: "text-sm font-medium", htmlFor: "welcome-email-header-image", children: "Header image" }),
    e ? /* @__PURE__ */ o.jsxs("div", { className: "relative overflow-hidden rounded-md border border-gray-200 dark:border-gray-800", children: [
      /* @__PURE__ */ o.jsx(
        "img",
        {
          alt: "Header",
          className: "h-auto w-full",
          src: e
        }
      ),
      /* @__PURE__ */ o.jsx(
        "button",
        {
          className: "absolute top-2 right-2 rounded bg-black/50 px-2 py-1 text-xs text-white hover:bg-black/70",
          type: "button",
          onClick: () => n(""),
          children: "Remove"
        }
      )
    ] }) : /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
      /* @__PURE__ */ o.jsx(
        Ht,
        {
          accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"] },
          className: "flex h-24 items-center justify-center p-0 text-sm",
          id: "welcome-email-header-image",
          onDropAccepted: (f) => f[0] && t(f[0]),
          children: /* @__PURE__ */ o.jsx("span", { className: "text-gray-700", children: "Upload header image" })
        }
      ),
      /* @__PURE__ */ o.jsx("span", { className: "text-xs text-muted-foreground", children: "1200x600 recommended. Use a transparent PNG for best results on any background." })
    ] })
  ] });
}, ba = ({ value: e, onChange: n }) => /* @__PURE__ */ o.jsxs("div", { className: "mt-6 flex items-start justify-between gap-4", children: [
  /* @__PURE__ */ o.jsxs("div", { className: "flex items-start gap-2", children: [
    /* @__PURE__ */ o.jsx(yf, { className: "mt-0.5 size-4 shrink-0 text-red-500" }),
    /* @__PURE__ */ o.jsxs("div", { className: "flex flex-col gap-0.5", children: [
      /* @__PURE__ */ o.jsx("span", { children: "Promote independent publishing" }),
      /* @__PURE__ */ o.jsx("span", { className: "text-xs leading-tight text-muted-foreground", children: "Show you're a part of the indie publishing movement with a small badge in the footer" })
    ] })
  ] }),
  /* @__PURE__ */ o.jsx(
    nr,
    {
      checked: e,
      size: "sm",
      onCheckedChange: n
    }
  )
] }), pa = "data:image/jpeg;base64,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", Lt = Nr(void 0), Da = ({ settings: e, onSettingsChange: n, accentColor: r, children: t }) => /* @__PURE__ */ o.jsx(Lt.Provider, { value: { settings: e, onSettingsChange: n, accentColor: r }, children: t }), Ae = () => {
  const e = Re(Lt);
  if (!e)
    throw new Error("useEmailDesign must be used within an EmailDesignProvider");
  return e;
}, Ba = () => {
  const { settings: e, accentColor: n } = Ae(), r = Jt(e, n), t = ia(e.body_font_category), f = da(e.button_corners), v = e.button_style === "outline", a = F(
    "no-underline",
    e.link_style === "underline" && "underline",
    e.link_style === "bold" && "font-bold"
  ), c = F(
    "mb-5 text-[2.6rem] tracking-tighter",
    e.title_font_category === "serif" && "font-serif",
    e.title_font_category === "sans_serif" && "font-sans",
    e.title_font_weight === "normal" && "font-normal",
    e.title_font_weight === "medium" && "font-medium",
    e.title_font_weight === "semibold" && "font-semibold",
    e.title_font_weight === "bold" && "font-bold"
  ), A = F(
    e.body_font_category === "serif" ? "font-serif text-[1.8rem]" : "text-[1.7rem]"
  );
  return /* @__PURE__ */ o.jsxs("div", { className: "mx-auto w-full max-w-[600px] px-10 pt-16", children: [
    /* @__PURE__ */ o.jsx(
      "h3",
      {
        className: c,
        style: { color: r.sectionTitleColor },
        children: "Your welcome email"
      }
    ),
    /* @__PURE__ */ o.jsxs(
      "div",
      {
        className: F(A),
        style: { color: r.textColor, fontFamily: t },
        children: [
          /* @__PURE__ */ o.jsx("p", { className: "mt-0 mb-6", children: "This is what your welcome email will look like when someone signs up to your site." }),
          /* @__PURE__ */ o.jsx("p", { className: "mt-0 mb-8", children: "Use the settings on the right to shape the design — from colors and typography to layout and buttons — so it feels like a natural extension of your brand." }),
          /* @__PURE__ */ o.jsx("div", { className: F(
            "h-[unset] w-full max-w-[600px] bg-cover bg-no-repeat"
          ), children: /* @__PURE__ */ o.jsx("img", { alt: "Example cover image", className: F(
            "min-h-full min-w-full shrink-0",
            Qt(e.image_corners)
          ), src: pa }) }),
          /* @__PURE__ */ o.jsx("div", { className: "mt-1 w-full max-w-[600px] pb-8 text-center text-body-sm", style: { color: r.secondaryTextColor }, children: "Image caption" }),
          /* @__PURE__ */ o.jsx("p", { className: "mt-0 mb-6", children: "Welcome emails set the tone for your relationship with new members. We’ve optimized this template to look great across devices and inboxes, so your first impression lands exactly how you want it." })
        ]
      }
    ),
    /* @__PURE__ */ o.jsx("div", { className: "my-5 py-4", children: /* @__PURE__ */ o.jsx("hr", { className: "m-0 border-0 border-t", style: { borderColor: r.dividerColor } }) }),
    /* @__PURE__ */ o.jsx(
      "h3",
      {
        className: c,
        style: { color: r.sectionTitleColor },
        children: "Need inspiration?"
      }
    ),
    /* @__PURE__ */ o.jsx(
      "div",
      {
        className: F(A),
        style: { color: r.textColor, fontFamily: t },
        children: /* @__PURE__ */ o.jsxs("p", { className: "mt-0 mb-6", children: [
          "We’ve put together a ",
          /* @__PURE__ */ o.jsx("a", { className: a, href: "https://ghost.org/help/email-design/", rel: "noopener noreferrer", style: { color: r.linkColor }, target: "_blank", children: "quick guide" }),
          " that walks through all the available settings, along with a few examples of what’s possible."
        ] })
      }
    ),
    /* @__PURE__ */ o.jsx("div", { className: "pb-6", children: /* @__PURE__ */ o.jsx(
      "a",
      {
        className: F(
          "inline-block border px-[18px] py-2.5 font-sans text-[15px] no-underline",
          f,
          v ? "bg-transparent" : "border-transparent",
          e.link_style === "bold" ? "font-bold" : "font-semibold"
        ),
        href: "https://ghost.org/help/email-design/",
        rel: "noopener noreferrer",
        style: v ? { borderColor: r.buttonColor, color: r.buttonColor } : { backgroundColor: r.buttonColor, color: r.buttonTextColor },
        target: "_blank",
        children: "Learn more"
      }
    ) }),
    /* @__PURE__ */ o.jsx("div", { className: "py-4", children: /* @__PURE__ */ o.jsx("hr", { className: "m-0 border-0 border-t", style: { borderColor: r.dividerColor } }) })
  ] });
}, Yt = "AutomatedEmailDesignResponseType", ya = Df({
  dataType: Yt,
  path: "/automated_emails/design/"
}), ha = Kr({
  method: "PUT",
  path: () => "/automated_emails/design/",
  body: (e) => ({ automated_email_design: [e] }),
  updateQueries: {
    emberUpdateType: "skip",
    dataType: Yt,
    update: (e) => e
  }
}), Fr = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i, za = (e, n, r = []) => {
  if (e && Fr.test(e))
    return e;
  switch (e) {
    case "accent":
      return n && Fr.test(n) ? n : "#ffffff";
    case "light":
      return "#ffffff";
    case "transparent":
      return "#00000000";
  }
  const t = r.find((f) => f.value === e);
  return t ? t.hex : "#ffffff";
}, ka = (e) => {
  const n = e.toLowerCase();
  return n.length === 5 && n[4] === "0" || n.length === 9 && n.slice(7) === "00";
}, Ta = () => /* @__PURE__ */ o.jsx("span", { className: "pointer-events-none absolute inset-0 overflow-hidden rounded-full", "data-testid": "transparent-indicator", "aria-hidden": !0, children: /* @__PURE__ */ o.jsx("span", { className: "absolute top-1/2 left-[-30%] block h-px w-[160%] -translate-y-1/2 -rotate-45 bg-red" }) }), _e = ({ title: e, value: n, onChange: r, accentColor: t, swatches: f = [] }) => {
  const [v, a] = $(!1), c = za(n, t, f), A = Q(!1), P = Q(!1), l = Q(null), s = f.find((w) => w.value === n || n && w.hex.toLowerCase() === n.toLowerCase()), u = () => {
    A.current = !1, P.current = !1;
  }, d = B(() => {
    l.current && (window.removeEventListener("keydown", l.current, !0), l.current = null);
  }, []), i = () => {
    d(), u(), a(!1);
  }, H = () => {
    if (l.current)
      return;
    const w = (j) => {
      j.key === "Escape" && (j.preventDefault(), j.stopPropagation(), i());
    };
    l.current = w, window.addEventListener("keydown", w, !0);
  };
  return S(() => () => {
    d();
  }, [d]), /* @__PURE__ */ o.jsxs(
    zf,
    {
      open: v,
      onOpenChange: (w) => {
        u(), w ? H() : d(), a(w);
      },
      children: [
        /* @__PURE__ */ o.jsx(kf, { asChild: !0, children: /* @__PURE__ */ o.jsxs("div", { className: "flex w-full cursor-pointer items-start justify-between", children: [
          /* @__PURE__ */ o.jsx("span", { className: "mt-px flex-1", children: e }),
          /* @__PURE__ */ o.jsxs("div", { className: "flex shrink-0 gap-1", children: [
            v && f.length > 0 && /* @__PURE__ */ o.jsx("div", { className: "flex items-center gap-1", children: f.map((w) => {
              const j = w.value === void 0 ? w.hex : w.value, b = s?.title === w.title;
              return /* @__PURE__ */ o.jsx(
                "button",
                {
                  "aria-label": w.title,
                  className: `relative flex h-5 w-5 shrink-0 cursor-pointer items-center overflow-hidden rounded-full border border-grey-300 dark:border-grey-800 ${b ? "outline-2 outline-green" : ""}`,
                  style: { backgroundColor: w.hex },
                  title: w.title,
                  type: "button",
                  onClick: () => {
                    A.current = !1, P.current = !0, r(j), i();
                  },
                  children: ka(w.hex) && /* @__PURE__ */ o.jsx(Ta, {})
                },
                w.title
              );
            }) }),
            /* @__PURE__ */ o.jsxs(
              "button",
              {
                "aria-label": "Pick color",
                className: "relative size-6 cursor-pointer rounded-full border border-grey-300 dark:border-grey-800",
                type: "button",
                children: [
                  /* @__PURE__ */ o.jsx("div", { className: "absolute inset-0 rounded-full bg-[conic-gradient(hsl(360,100%,50%),hsl(315,100%,50%),hsl(270,100%,50%),hsl(225,100%,50%),hsl(180,100%,50%),hsl(135,100%,50%),hsl(90,100%,50%),hsl(45,100%,50%),hsl(0,100%,50%))]" }),
                  /* @__PURE__ */ o.jsx("div", { className: "absolute inset-[3px] overflow-hidden rounded-full border border-white dark:border-grey-950", style: { backgroundColor: c } })
                ]
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ o.jsx(
          Tf,
          {
            align: "end",
            className: "w-auto p-4",
            onEscapeKeyDown: (w) => {
              w.stopPropagation();
            },
            children: /* @__PURE__ */ o.jsx(
              "div",
              {
                onInputCapture: () => {
                  A.current = !0;
                },
                onKeyDownCapture: () => {
                  A.current = !0;
                },
                onMouseDownCapture: () => {
                  A.current = !0;
                },
                onPointerDownCapture: () => {
                  A.current = !0;
                },
                onTouchStartCapture: () => {
                  A.current = !0;
                },
                children: /* @__PURE__ */ o.jsx(
                  Wc,
                  {
                    value: c,
                    onChange: (w) => {
                      P.current || !A.current || r(w);
                    }
                  }
                )
              }
            )
          }
        )
      ]
    }
  );
}, Ga = () => {
  const { settings: e, onSettingsChange: n } = Ae();
  return /* @__PURE__ */ o.jsx(
    _e,
    {
      swatches: [
        {
          title: "White",
          value: "light",
          hex: "#ffffff"
        }
      ],
      title: "Background color",
      value: e.background_color,
      onChange: (r) => r && n({ background_color: r })
    }
  );
}, Wt = [
  { value: "serif", label: "Elegant serif" },
  { value: "sans_serif", label: "Clean sans-serif" }
], hn = {
  sans_serif: {
    options: [
      { value: "normal", label: "Regular" },
      { value: "medium", label: "Medium" },
      { value: "semibold", label: "Semi-bold" },
      { value: "bold", label: "Bold" }
    ]
  },
  serif: {
    options: [
      { value: "normal", label: "Regular" },
      { value: "bold", label: "Bold" }
    ],
    map: {
      medium: "normal",
      semibold: "bold"
    }
  }
};
function Rt(e, n) {
  const r = hn[e] || hn.sans_serif;
  return r.options.find((t) => t.value === n) ? n : r.map?.[n] || "bold";
}
const ma = () => {
  const { settings: e, onSettingsChange: n } = Ae();
  return /* @__PURE__ */ o.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ o.jsx("span", { children: "Body font" }),
    /* @__PURE__ */ o.jsxs(kn, { value: e.body_font_category || "sans_serif", onValueChange: (r) => n({ body_font_category: r }), children: [
      /* @__PURE__ */ o.jsx(Tn, { className: "w-[180px]", children: /* @__PURE__ */ o.jsx(Gn, {}) }),
      /* @__PURE__ */ o.jsx(
        mn,
        {
          onEscapeKeyDown: (r) => {
            r.stopPropagation();
          },
          children: Wt.map((r) => /* @__PURE__ */ o.jsx(Mn, { value: r.value, children: r.label }, r.value))
        }
      )
    ] })
  ] });
}, Ma = /^#(?:[0-9a-f]{3}){1,2}$/i, Ca = (e) => e === "light" ? "#ffffff" : Ma.test(e) ? e : "#ffffff", Dr = (e) => be(Ca(e)).hex(), Sa = () => {
  const { settings: e, onSettingsChange: n, accentColor: r } = Ae(), t = Dr(e.background_color);
  return /* @__PURE__ */ o.jsx(
    _e,
    {
      accentColor: r,
      swatches: [
        {
          title: "Accent",
          value: "accent",
          hex: r
        },
        {
          title: "Auto",
          value: null,
          hex: t
        }
      ],
      title: "Button color",
      value: e.button_color,
      onChange: (f) => n({ button_color: f })
    }
  );
}, Ia = () => {
  const { settings: e, onSettingsChange: n } = Ae();
  return /* @__PURE__ */ o.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ o.jsx("span", { children: "Button corners" }),
    /* @__PURE__ */ o.jsxs(Cn, { type: "single", value: e.button_corners || "rounded", onValueChange: (r) => r && n({ button_corners: r }), children: [
      /* @__PURE__ */ o.jsx(ge, { "aria-label": "Square", value: "square", children: /* @__PURE__ */ o.jsx("span", { className: "inline-block size-4 border-[1.5px] border-current" }) }),
      /* @__PURE__ */ o.jsx(ge, { "aria-label": "Rounded", value: "rounded", children: /* @__PURE__ */ o.jsx("span", { className: "inline-block size-4 rounded-sm border-[1.5px] border-current" }) }),
      /* @__PURE__ */ o.jsx(ge, { "aria-label": "Pill", value: "pill", children: /* @__PURE__ */ o.jsx("span", { className: "inline-block size-4 rounded-full border-[1.5px] border-current" }) })
    ] })
  ] });
}, Ja = () => {
  const { settings: e, onSettingsChange: n } = Ae();
  return /* @__PURE__ */ o.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ o.jsx("span", { children: "Button style" }),
    /* @__PURE__ */ o.jsxs(Cn, { type: "single", value: e.button_style || "fill", onValueChange: (r) => r && n({ button_style: r }), children: [
      /* @__PURE__ */ o.jsx(ge, { "aria-label": "Fill", value: "fill", children: /* @__PURE__ */ o.jsx("span", { className: "inline-block h-4 w-5 rounded-sm bg-current" }) }),
      /* @__PURE__ */ o.jsx(ge, { "aria-label": "Outline", value: "outline", children: /* @__PURE__ */ o.jsx("span", { className: "inline-block h-4 w-5 rounded-sm border-[1.5px] border-current" }) })
    ] })
  ] });
}, Qa = () => {
  const { settings: e, onSettingsChange: n, accentColor: r } = Ae();
  return /* @__PURE__ */ o.jsx(
    _e,
    {
      accentColor: r,
      swatches: [
        {
          title: "Light",
          value: null,
          hex: "#e0e7eb"
        },
        {
          title: "Accent",
          value: "accent",
          hex: r
        }
      ],
      title: "Divider color",
      value: e.divider_color,
      onChange: (t) => n({ divider_color: t })
    }
  );
}, La = () => {
  const { settings: e, onSettingsChange: n } = Ae();
  return /* @__PURE__ */ o.jsx(
    _e,
    {
      swatches: [
        {
          title: "Transparent",
          value: "transparent",
          hex: "#00000000"
        }
      ],
      title: "Header background color",
      value: e.header_background_color,
      onChange: (r) => r && n({ header_background_color: r })
    }
  );
}, Ya = () => {
  const { settings: e, onSettingsChange: n } = Ae(), r = (t) => {
    const f = Rt(t, e.title_font_weight);
    n({ title_font_category: t, title_font_weight: f });
  };
  return /* @__PURE__ */ o.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ o.jsx("span", { children: "Heading font" }),
    /* @__PURE__ */ o.jsxs(kn, { value: e.title_font_category || "sans_serif", onValueChange: r, children: [
      /* @__PURE__ */ o.jsx(Tn, { className: "w-[180px]", children: /* @__PURE__ */ o.jsx(Gn, {}) }),
      /* @__PURE__ */ o.jsx(
        mn,
        {
          onEscapeKeyDown: (t) => {
            t.stopPropagation();
          },
          children: Wt.map((t) => /* @__PURE__ */ o.jsx(Mn, { value: t.value, children: t.label }, t.value))
        }
      )
    ] })
  ] });
}, Wa = () => {
  const { settings: e, onSettingsChange: n } = Ae(), r = e.title_font_category || "sans_serif", t = hn[r]?.options || hn.sans_serif.options, f = Rt(r, e.title_font_weight);
  return /* @__PURE__ */ o.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ o.jsx("span", { children: "Heading weight" }),
    /* @__PURE__ */ o.jsxs(kn, { value: f, onValueChange: (v) => n({ title_font_weight: v }), children: [
      /* @__PURE__ */ o.jsx(Tn, { className: "w-[180px]", children: /* @__PURE__ */ o.jsx(Gn, {}) }),
      /* @__PURE__ */ o.jsx(
        mn,
        {
          onEscapeKeyDown: (v) => {
            v.stopPropagation();
          },
          children: t.map((v) => /* @__PURE__ */ o.jsx(Mn, { value: v.value, children: v.label }, v.value))
        }
      )
    ] })
  ] });
}, Ra = () => {
  const { settings: e, onSettingsChange: n } = Ae();
  return /* @__PURE__ */ o.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ o.jsx("span", { children: "Image corners" }),
    /* @__PURE__ */ o.jsxs(Cn, { type: "single", value: e.image_corners || "square", onValueChange: (r) => r && n({ image_corners: r }), children: [
      /* @__PURE__ */ o.jsx(ge, { "aria-label": "Square", value: "square", children: /* @__PURE__ */ o.jsx("span", { className: "inline-block size-4 border-[1.5px] border-current" }) }),
      /* @__PURE__ */ o.jsx(ge, { "aria-label": "Rounded", value: "rounded", children: /* @__PURE__ */ o.jsx("span", { className: "inline-block size-4 rounded-sm border-[1.5px] border-current" }) })
    ] })
  ] });
}, Fa = () => {
  const { settings: e, onSettingsChange: n, accentColor: r } = Ae(), t = Dr(e.background_color);
  return /* @__PURE__ */ o.jsx(
    _e,
    {
      accentColor: r,
      swatches: [
        {
          title: "Accent",
          value: "accent",
          hex: r
        },
        {
          title: "Auto",
          value: null,
          hex: t
        }
      ],
      title: "Link color",
      value: e.link_color,
      onChange: (f) => n({ link_color: f })
    }
  );
}, qa = () => {
  const { settings: e, onSettingsChange: n } = Ae();
  return /* @__PURE__ */ o.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ o.jsx("span", { children: "Link style" }),
    /* @__PURE__ */ o.jsxs(Cn, { type: "single", value: e.link_style || "underline", onValueChange: (r) => r && n({ link_style: r }), children: [
      /* @__PURE__ */ o.jsx(ge, { "aria-label": "Underline", value: "underline", children: /* @__PURE__ */ o.jsx(mf, { className: "size-4" }) }),
      /* @__PURE__ */ o.jsx(ge, { "aria-label": "Regular", value: "regular", children: /* @__PURE__ */ o.jsx(Mf, { className: "size-4" }) }),
      /* @__PURE__ */ o.jsx(ge, { "aria-label": "Bold", value: "bold", children: /* @__PURE__ */ o.jsx(Cf, { className: "size-4" }) })
    ] })
  ] });
}, Na = () => {
  const { settings: e, onSettingsChange: n, accentColor: r } = Ae(), t = Dr(e.background_color);
  return /* @__PURE__ */ o.jsx(
    _e,
    {
      accentColor: r,
      swatches: [
        {
          title: "Auto",
          value: null,
          hex: t
        },
        {
          title: "Accent",
          value: "accent",
          hex: r
        }
      ],
      title: "Section title color",
      value: e.section_title_color,
      onChange: (f) => n({ section_title_color: f })
    }
  );
}, Ft = {
  background_color: "light",
  title_font_category: "sans_serif",
  title_font_weight: "bold",
  body_font_category: "sans_serif",
  header_background_color: "transparent",
  section_title_color: null,
  button_color: "accent",
  button_style: "fill",
  button_corners: "rounded",
  link_color: "accent",
  link_style: "underline",
  image_corners: "square",
  divider_color: null
}, zn = {
  free: "member-welcome-email-free",
  paid: "member-welcome-email-paid"
}, Za = `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Welcome! Thanks for subscribing — it's great to have you here.","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"You'll now receive new posts straight to your inbox. You can also log in any time to read the ","type":"extended-text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"full archive","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"__GHOST_URL__/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" or catch up on new posts as they go live.","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"A little housekeeping: If this email landed in spam or promotions, try moving it to your primary inbox and adding this address to your contacts. Small signals like that help your inbox recognize that these messages matter to you.","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Have questions or just want to say hi? Feel free to reply directly to this email or any newsletter in the future.","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`, Ea = `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Welcome, and thank you for your support — it means a lot.","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"As a paid member, you now have full access to everything: the complete archive, and any paid-only content going forward. New posts will land straight to your inbox, and you can log in any time to ","type":"extended-text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"catch up","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"__GHOST_URL__/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" on anything you've missed.","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"A little housekeeping: If this email landed in spam or promotions, try moving it to your primary inbox and adding this address to your contacts. Small signals like that help your inbox recognize that these messages matter to you.","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Have questions or just want to say hi? Feel free to reply directly to this email or any newsletter in the future.","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`, Va = (e, n) => ({
  name: e === "free" ? "Welcome Email (Free)" : "Welcome Email (Paid)",
  slug: zn[e],
  subject: e === "free" ? `Welcome to ${n || "our site"}` : "Welcome to your paid subscription",
  lexical: e === "free" ? Za : Ea
}), Br = (e, n, r) => wr(n) && !_r(n) && r ? r : e.sender_email || r || "", Ka = (e, n, r, t) => e.sender_reply_to === "newsletter" ? wr(n) ? "" : Br(e, n, t) : e.sender_reply_to === "support" ? r || t || "" : e.sender_reply_to, Ua = (e, n, r, t) => {
  const f = Ka(e, n, r, t);
  return f || (e.sender_reply_to === "newsletter" ? Br(e, n, t) || r || t || "" : r || t || "");
}, Be = (e) => e?.trim() || "", $n = (...e) => e.map(Be).find(Boolean) || "", _a = ({
  automatedEmails: e = [],
  config: n,
  defaultEmailAddress: r,
  newsletter: t,
  siteTitle: f,
  supportEmailAddress: v
}) => {
  const a = e.find((k) => k.slug === zn.free), c = e.find((k) => k.slug === zn.paid), A = $n(a?.sender_name, c?.sender_name), P = $n(a?.sender_email, c?.sender_email), l = $n(a?.sender_reply_to, c?.sender_reply_to), s = Be(t?.sender_name), u = t ? Be(Br(t, n, r || void 0)) : "", d = t ? Be(Ua(t, n, v || void 0, r || void 0)) : "", i = s || Be(f) || "Your site name", H = u || Be(r), w = d || Be(v) || Be(r), j = A || i, b = P || H || "", x = l || w || "", p = x !== "" && x !== b, L = wr(n), V = _r(n);
  return {
    hasDistinctReplyTo: p,
    replyToEmailInput: l,
    replyToEmailPlaceholder: w,
    resolvedReplyToEmail: x,
    resolvedSenderEmail: b,
    resolvedSenderName: j,
    senderEmailDomain: V ? Lf(n) : null,
    senderEmailInput: P,
    senderEmailPlaceholder: H,
    senderNameInput: A,
    senderNamePlaceholder: i,
    showSenderEmailInput: !L || V
  };
}, $a = (e = [], {
  config: n,
  defaultEmailAddress: r,
  siteTitle: t,
  supportEmailAddress: f
}) => {
  const { data: v } = rf({
    searchParams: {
      filter: "status:active",
      limit: "1"
    }
  }), a = v?.newsletters?.[0];
  return Pe(() => _a({
    automatedEmails: e,
    config: n,
    defaultEmailAddress: r,
    newsletter: a,
    siteTitle: t,
    supportEmailAddress: f
  }), [e, n, r, a, t, f]);
}, tn = "automation-email-design-save-error", ev = new Set(Object.keys(Ft)), qt = (e) => ev.has(e), nv = ({
  generalSettings: e,
  onGeneralChange: n,
  showPublicationIconToggle: r,
  senderNamePlaceholder: t,
  senderEmailPlaceholder: f,
  replyToEmailPlaceholder: v,
  showSenderEmailInput: a,
  senderNameError: c,
  senderEmailError: A,
  replyToEmailError: P
}) => /* @__PURE__ */ o.jsxs("div", { className: "flex flex-col gap-6 pt-6", children: [
  /* @__PURE__ */ o.jsxs("section", { children: [
    /* @__PURE__ */ o.jsx("h4", { className: "mb-4 font-semibold md:text-lg", children: "Email info" }),
    /* @__PURE__ */ o.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ o.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ o.jsx("label", { className: "text-sm font-medium", htmlFor: "welcome-email-sender-name", children: "Sender name" }),
        /* @__PURE__ */ o.jsx(
          fn,
          {
            id: "welcome-email-sender-name",
            placeholder: t,
            value: e.senderName,
            onChange: (l) => n({ senderName: l.target.value })
          }
        ),
        c ? /* @__PURE__ */ o.jsx("p", { className: "text-xs text-red", children: c }) : null
      ] }),
      a ? /* @__PURE__ */ o.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ o.jsx("label", { className: "text-sm font-medium", htmlFor: "welcome-email-sender-email", children: "Sender email" }),
        /* @__PURE__ */ o.jsx(
          fn,
          {
            id: "welcome-email-sender-email",
            placeholder: f,
            value: e.senderEmail,
            onChange: (l) => n({ senderEmail: l.target.value })
          }
        ),
        A ? /* @__PURE__ */ o.jsx("p", { className: "text-xs text-red", children: A }) : null
      ] }) : null,
      /* @__PURE__ */ o.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ o.jsx("label", { className: "text-sm font-medium", htmlFor: "welcome-email-reply-to-email", children: "Reply-to email" }),
        /* @__PURE__ */ o.jsx(
          fn,
          {
            id: "welcome-email-reply-to-email",
            placeholder: v,
            value: e.replyToEmail,
            onChange: (l) => n({ replyToEmail: l.target.value })
          }
        ),
        P ? /* @__PURE__ */ o.jsx("p", { className: "text-xs text-red", children: P }) : null
      ] })
    ] })
  ] }),
  /* @__PURE__ */ o.jsx(rr, {}),
  /* @__PURE__ */ o.jsxs("section", { children: [
    /* @__PURE__ */ o.jsx("h4", { className: "mb-4 font-semibold md:text-lg", children: "Content" }),
    /* @__PURE__ */ o.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ o.jsx(
        Xa,
        {
          value: e.headerImage,
          onChange: (l) => n({ headerImage: l })
        }
      ),
      r && /* @__PURE__ */ o.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ o.jsx("span", { className: "text-sm font-medium", children: "Publication icon" }),
        /* @__PURE__ */ o.jsx(
          nr,
          {
            checked: e.showPublicationIcon,
            size: "sm",
            onCheckedChange: (l) => n({ showPublicationIcon: l })
          }
        )
      ] }),
      /* @__PURE__ */ o.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ o.jsx("span", { className: "text-sm font-medium", children: "Publication title" }),
        /* @__PURE__ */ o.jsx(
          nr,
          {
            checked: e.showPublicationTitle,
            size: "sm",
            onCheckedChange: (l) => n({ showPublicationTitle: l })
          }
        )
      ] }),
      /* @__PURE__ */ o.jsxs("div", { className: "mt-2 flex flex-col gap-1.5", children: [
        /* @__PURE__ */ o.jsx("label", { className: "text-sm font-medium", htmlFor: "welcome-email-footer", children: "Email footer" }),
        /* @__PURE__ */ o.jsx(
          wt,
          {
            id: "welcome-email-footer",
            placeholder: "Any extra information or legal text",
            rows: 3,
            value: e.emailFooter,
            onChange: (l) => n({ emailFooter: l.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ o.jsx(
        ba,
        {
          value: e.showBadge,
          onChange: (l) => n({ showBadge: l })
        }
      )
    ] })
  ] })
] }), rv = () => /* @__PURE__ */ o.jsxs("div", { className: "flex flex-col gap-6 pt-6", children: [
  /* @__PURE__ */ o.jsxs("section", { children: [
    /* @__PURE__ */ o.jsx("h4", { className: "mb-4 font-semibold md:text-lg", children: "Global" }),
    /* @__PURE__ */ o.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ o.jsx(Ga, {}),
      /* @__PURE__ */ o.jsx(Ya, {}),
      /* @__PURE__ */ o.jsx(Wa, {}),
      /* @__PURE__ */ o.jsx(ma, {})
    ] })
  ] }),
  /* @__PURE__ */ o.jsx(rr, {}),
  /* @__PURE__ */ o.jsxs("section", { children: [
    /* @__PURE__ */ o.jsx("h4", { className: "mb-4 font-semibold md:text-lg", children: "Header" }),
    /* @__PURE__ */ o.jsx("div", { className: "flex flex-col gap-4", children: /* @__PURE__ */ o.jsx(La, {}) })
  ] }),
  /* @__PURE__ */ o.jsx(rr, {}),
  /* @__PURE__ */ o.jsxs("section", { children: [
    /* @__PURE__ */ o.jsx("h4", { className: "mb-4 font-semibold md:text-lg", children: "Body" }),
    /* @__PURE__ */ o.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ o.jsx(Na, {}),
      /* @__PURE__ */ o.jsx(Sa, {}),
      /* @__PURE__ */ o.jsx(Ja, {}),
      /* @__PURE__ */ o.jsx(Ia, {}),
      /* @__PURE__ */ o.jsx(Fa, {}),
      /* @__PURE__ */ o.jsx(qa, {}),
      /* @__PURE__ */ o.jsx(Ra, {}),
      /* @__PURE__ */ o.jsx(Qa, {})
    ] })
  ] })
] }), tv = ({
  generalSettings: e,
  onGeneralChange: n,
  showPublicationIconToggle: r,
  senderNamePlaceholder: t,
  senderEmailPlaceholder: f,
  replyToEmailPlaceholder: v,
  showSenderEmailInput: a,
  senderNameError: c,
  senderEmailError: A,
  replyToEmailError: P,
  isLoading: l,
  errorMessage: s
}) => /* @__PURE__ */ o.jsxs(If, { className: "flex min-h-0 flex-1 flex-col", defaultValue: "general", variant: "underline", children: [
  /* @__PURE__ */ o.jsxs(Jf, { className: "px-5", children: [
    /* @__PURE__ */ o.jsx(Tr, { value: "general", children: "General" }),
    /* @__PURE__ */ o.jsx(Tr, { value: "design", children: "Design" })
  ] }),
  l ? /* @__PURE__ */ o.jsx("div", { className: "flex flex-1 items-center justify-center", children: /* @__PURE__ */ o.jsx(Sf, { size: "md" }) }) : s ? /* @__PURE__ */ o.jsx("div", { className: "flex flex-1 items-center justify-center px-6 text-center text-sm text-gray-700 dark:text-gray-300", children: s }) : /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsx(Gr, { className: "min-h-0 flex-1 overflow-y-auto px-5 pb-5", value: "general", children: /* @__PURE__ */ o.jsx(
      nv,
      {
        generalSettings: e,
        replyToEmailError: P,
        replyToEmailPlaceholder: v,
        senderEmailError: A,
        senderEmailPlaceholder: f,
        senderNameError: c,
        senderNamePlaceholder: t,
        showPublicationIconToggle: r,
        showSenderEmailInput: a,
        onGeneralChange: n
      }
    ) }),
    /* @__PURE__ */ o.jsx(Gr, { className: "min-h-0 flex-1 overflow-y-auto px-5 pb-5", value: "design", children: /* @__PURE__ */ o.jsx(rv, {}) })
  ] })
] });
function fv(e, n) {
  return {
    senderName: n.senderName,
    senderEmail: n.senderEmail,
    replyToEmail: n.replyToEmail,
    headerImage: e.header_image || "",
    showPublicationIcon: e.show_header_icon,
    showPublicationTitle: e.show_header_title,
    showBadge: e.show_badge,
    emailFooter: e.footer_content || ""
  };
}
function Av(e) {
  return Object.fromEntries(
    Object.entries(e).filter(([n]) => qt(n))
  );
}
function cv(e) {
  return {
    ...Object.fromEntries(
      Object.entries(e.designSettings).filter(([r]) => qt(r))
    ),
    header_image: e.generalSettings.headerImage || null,
    show_header_icon: e.generalSettings.showPublicationIcon,
    show_header_title: e.generalSettings.showPublicationTitle,
    show_badge: e.generalSettings.showBadge,
    footer_content: e.generalSettings.emailFooter || null
  };
}
const av = ({ message: e }) => /* @__PURE__ */ o.jsx("div", { className: "flex h-full items-center justify-center px-6 text-center text-sm text-gray-700 dark:text-gray-300", children: e }), er = (e) => e?.trim() || "" || null, vv = cn.create(({ config: e, settings: n, siteData: r }) => {
  const t = In(), [f, v, a, c] = Yf(
    n,
    ["title", "default_email_address", "icon", "support_email_address"]
  ), A = Bf(), { data: P, isLoading: l, isError: s } = ya(), { data: u } = tf(), { mutateAsync: d } = ha(), { mutateAsync: i } = ff(), { mutateAsync: H } = Af(), [w, j] = $(!1), [b, x] = $(!1), p = u?.automated_emails || [], {
    senderNameInput: L,
    senderEmailInput: V,
    replyToEmailInput: k,
    senderNamePlaceholder: ce,
    senderEmailPlaceholder: ue,
    replyToEmailPlaceholder: te,
    showSenderEmailInput: M,
    senderEmailDomain: ee
  } = $a(p, {
    config: e,
    defaultEmailAddress: v,
    siteTitle: f,
    supportEmailAddress: c
  }), ie = Pe(() => ({
    senderName: L,
    senderEmail: V,
    replyToEmail: k,
    headerImage: "",
    showPublicationIcon: !0,
    showPublicationTitle: !0,
    showBadge: !0,
    emailFooter: ""
  }), [k, V, L]), I = B(async () => {
    const y = new Map((u?.automated_emails || []).map((C) => [C.slug, C]));
    for (const C of ["free", "paid"]) {
      if (y.has(zn[C]))
        continue;
      const He = Va(C, f), we = (await i({ ...He, status: "inactive" })).automated_emails?.[0];
      we && y.set(we.slug, we);
    }
  }, [i, u?.automated_emails, f]), { formState: N, saveState: xe, updateForm: fe, setFormState: _, handleSave: Z, okProps: ln, errors: Me } = cf({
    initialState: {
      designSettings: { ...Ft },
      generalSettings: ie
    },
    savingDelay: 500,
    onSave: async (y) => {
      if (!ne)
        throw Te.error("Unable to load email design settings. Please try again.", {
          id: tn
        }), j(!0), new Error("Unable to load email design settings");
      await I();
      const C = {
        sender_name: er(y.generalSettings.senderName),
        sender_reply_to: er(y.generalSettings.replyToEmail),
        ...M ? {
          sender_email: er(y.generalSettings.senderEmail)
        } : {}
      }, { meta: { sent_email_verification: He = [] } = {} } = await H(C);
      await d(cv(y)), He.length > 0 && Te.info("We’ve sent a confirmation email to the new address."), j(!1), Te.dismiss(tn);
    },
    onSaveError: (y) => {
      A(y, { withToast: !1 }), Te.error("Unable to save email design settings. Please try again.", {
        id: tn
      }), j(!0);
    },
    onValidate: (y) => {
      const C = {}, He = y.generalSettings.senderEmail?.trim(), Se = y.generalSettings.replyToEmail?.trim();
      return M && He && (hr.isEmail(He) ? ee && He.split("@")[1]?.toLowerCase() !== ee.toLowerCase() && (C.senderEmail = `Email address must end with @${ee}`) : C.senderEmail = "Enter a valid email address"), Se && !hr.isEmail(Se) && (C.replyToEmail = "Enter a valid email address"), C;
    }
  }), [he, sn] = $(null), ne = P?.automated_email_design?.[0], $e = ne ? `${ne.id}:${ne.updated_at ?? "initial"}` : null, { designSettings: de, generalSettings: ae } = N;
  S(() => {
    ne && he === null && (_((y) => ({
      designSettings: Av(ne),
      generalSettings: fv(ne, y.generalSettings)
    })), sn($e));
  }, [ne, $e, he, _]), S(() => {
    b || u === void 0 || (_((y) => ({
      ...y,
      generalSettings: {
        ...y.generalSettings,
        senderName: L,
        senderEmail: V,
        replyToEmail: k
      }
    })), x(!0));
  }, [u, k, V, b, L, _]);
  const un = B((y) => {
    j(!1), Te.dismiss(tn), fe((C) => ({
      ...C,
      designSettings: { ...C.designSettings, ...y }
    }));
  }, [fe]), dn = B((y) => {
    j(!1), Te.dismiss(tn), fe((C) => ({
      ...C,
      generalSettings: { ...C.generalSettings, ...y }
    }));
  }, [fe]), Ce = B(() => {
    t.hide();
  }, [t]), ze = "Unable to load email design settings. Please try again.", De = w ? {
    ...ln,
    color: "red",
    label: "Retry"
  } : ln;
  return /* @__PURE__ */ o.jsx(Da, { accentColor: r.accent_color, settings: de, onSettingsChange: un, children: /* @__PURE__ */ o.jsx(
    Ec,
    {
      afterClose: () => {
        t.resolveHide(), t.remove();
      },
      dirty: xe === "unsaved",
      isLoading: l || s,
      okProps: De,
      open: t.visible,
      preview: s ? /* @__PURE__ */ o.jsx(av, { message: ze }) : /* @__PURE__ */ o.jsx(
        ga,
        {
          accentColor: r.accent_color,
          emailFooter: ae.emailFooter,
          footerLinkText: "Manage your preferences",
          headerImage: ae.headerImage,
          publicationIcon: a,
          replyToEmail: ae.replyToEmail || te || "",
          senderEmail: ae.senderEmail || ue || v || "",
          senderName: ae.senderName || ce || f || "Your site",
          settings: de,
          showBadge: ae.showBadge,
          showPublicationIcon: ae.showPublicationIcon && !!a,
          showPublicationTitle: ae.showPublicationTitle,
          showRecipientLine: !1,
          showSubjectLine: !1,
          siteTitle: f,
          subject: `Welcome to ${ae.senderName || ce || f || "our publication"}`,
          children: /* @__PURE__ */ o.jsx(Ba, {})
        }
      ),
      sidebar: /* @__PURE__ */ o.jsx(
        tv,
        {
          errorMessage: s ? ze : void 0,
          generalSettings: ae,
          isLoading: l,
          replyToEmailError: Me.replyToEmail,
          replyToEmailPlaceholder: te,
          senderEmailError: Me.senderEmail,
          senderEmailPlaceholder: ue,
          senderNameError: Me.senderName,
          senderNamePlaceholder: ce,
          showPublicationIconToggle: !!a,
          showSenderEmailInput: M,
          onGeneralChange: dn
        }
      ),
      testId: "automation-email-design-modal",
      title: "Email design",
      onClose: Ce,
      onSave: () => Z({ fakeWhenUnchanged: !0 })
    }
  ) });
}), ov = () => {
  const e = Wf(), n = Ff(), r = Rf(), t = [e, n, r], f = t.map((c) => c.error).find(Boolean);
  re.useEffect(() => {
    f && console.error("Failed to load email design data", f);
  }, [f]);
  const v = t.some((c) => c.isLoading), a = () => {
    if (f || !r.data || !e.data || !n.data) {
      Te.error("Unable to load email design settings. Please try again.");
      return;
    }
    cn.show(vv, {
      config: r.data.config,
      settings: e.data.settings,
      siteData: n.data.site
    });
  };
  return /* @__PURE__ */ o.jsx(cn.Provider, { children: /* @__PURE__ */ o.jsx(
    Fe,
    {
      disabled: v,
      variant: "outline",
      onClick: a,
      children: "Email design"
    }
  ) });
}, Mv = () => {
  const { data: e, error: n, isError: r, isLoading: t } = af({
    defaultErrorHandler: !1
  });
  if (r)
    throw n || new Error("Failed to load automations");
  return /* @__PURE__ */ o.jsx(qf, { children: /* @__PURE__ */ o.jsxs(Vn, { "data-testid": "automations-page", children: [
    /* @__PURE__ */ o.jsx(Vn.Header, { children: /* @__PURE__ */ o.jsxs(gn, { blurredBackground: !1, sticky: !1, children: [
      /* @__PURE__ */ o.jsx(gn.Left, { children: /* @__PURE__ */ o.jsx(gn.Title, { children: "Automations" }) }),
      /* @__PURE__ */ o.jsx(gn.Actions, { children: /* @__PURE__ */ o.jsx(ov, {}) })
    ] }) }),
    /* @__PURE__ */ o.jsx(Vn.Body, { children: /* @__PURE__ */ o.jsx(qc, { automations: e?.automations, isLoading: t }) })
  ] }) });
};
export {
  Mv as default
};
//# sourceMappingURL=automations-BL0WaXHA.mjs.map

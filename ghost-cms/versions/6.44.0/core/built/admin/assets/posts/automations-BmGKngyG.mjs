import { am as Pt, a9 as Hu, a6 as Ot, Q as Ft, z as Wn } from "./index-BuIZkUhD.mjs";
import { b as Re, d as Kn, c as ku, e as Gu } from "./hooks-D4pJ_p_P.mjs";
const Fs = ({ initialState: u, savingDelay: e, savedDelay: l = 2e3, onSave: d, onSaveError: i, onSavedStateReset: t, onValidate: r }) => {
  const [a, n] = Pt(u), [f, v] = Pt(""), [o, s] = Pt({});
  Hu(() => {
    f === "saved" && setTimeout(() => {
      t?.(), v(($) => $ === "saved" ? "" : $);
    }, l);
  }, [f, l]);
  const _ = ($) => Object.values($).filter(Boolean).length === 0, S = Ot(
    () => {
      if (!r)
        return !0;
      const $ = r(a);
      return s($), _($);
    },
    [a, r]
  ), h = Ot(async ($ = {}) => {
    if (!S())
      return v("error"), !1;
    if (f !== "unsaved" && !$.force && !$.fakeWhenUnchanged)
      return !0;
    const E = Date.now();
    v("saving");
    try {
      (f === "unsaved" || $.force) && await d(a);
      const P = Date.now() - E;
      return e && P < e && await new Promise((L) => {
        setTimeout(L, e - P);
      }), v("saved"), !0;
    } catch (P) {
      throw await i?.(P), v("unsaved"), P;
    }
  }, [a, f, e, d, i, S]), g = Ot(($) => {
    n($), v("unsaved");
  }, []);
  let m = "black";
  f === "saved" ? m = "green" : f === "error" && (m = "red");
  let I = "";
  f === "saved" ? I = "Saved" : f === "saving" ? I = "Saving..." : f === "error" && (I = "Retry");
  const R = {
    disabled: f === "saving",
    color: m,
    label: I || void 0
  };
  return {
    formState: a,
    saveState: f,
    handleSave: h,
    updateForm: g,
    setFormState: n,
    reset() {
      n(u), v("");
    },
    validate: S,
    isValid: _(o),
    clearError: ($) => {
      s((E) => ({ ...E, [$]: "" }));
    },
    errors: o,
    setErrors: s,
    okProps: R
  };
}, Wu = (u, e) => (l, d) => {
  if (!d)
    return d;
  const i = ((t) => t[u]);
  if (typeof d == "object" && "pages" in d) {
    const { pages: t } = d, r = t[t.length - 1];
    return {
      ...d,
      pages: t.slice(0, -1).concat({
        ...r,
        [u]: r[u].concat(i(l))
      })
    };
  }
  return {
    ...d,
    [u]: d[u].concat(i(l))
  };
}, Ku = (u, e) => (l, d) => {
  if (!d)
    return d;
  const t = ((r) => r[u].reduce((n, f) => ({ ...n, [f.id]: f }), {}))(l);
  if (typeof d == "object" && "pages" in d) {
    const { pages: r } = d;
    return {
      ...d,
      pages: r.map((a) => ({
        ...a,
        [u]: a[u].map((n) => t[n.id] || n)
      }))
    };
  }
  return {
    ...d,
    [u]: d[u].map((r) => t[r.id] || r)
  };
}, Bs = ({ status: u }) => {
  switch (u) {
    case "active":
      return /* @__PURE__ */ Ft.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-green/20 px-2 py-0.5 text-xs font-medium text-green uppercase", children: [
        /* @__PURE__ */ Ft.jsx("span", { className: "size-1.5 rounded-full bg-green" }),
        "Live"
      ] });
    case "inactive":
      return /* @__PURE__ */ Ft.jsx("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground uppercase", children: "Off" });
    default: {
      const e = u;
      throw new Error(`Unhandled status: ${e}`);
    }
  }
};
var Le = { exports: {} }, Pe = { exports: {} }, Oe = { exports: {} }, kt;
function C() {
  return kt || (kt = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = d;
    function l(i) {
      "@babel/helpers - typeof";
      return l = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
        return typeof t;
      } : function(t) {
        return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
      }, l(i);
    }
    function d(i) {
      var t = typeof i == "string" || i instanceof String;
      if (!t) {
        var r = l(i);
        throw i === null ? r = "null" : r === "object" && (r = i.constructor.name), new TypeError("Expected a string but received a ".concat(r));
      }
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Oe, Oe.exports)), Oe.exports;
}
var Gt;
function Nt() {
  return Gt || (Gt = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t) {
      return (0, l.default)(t), t = Date.parse(t), isNaN(t) ? null : new Date(t);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Pe, Pe.exports)), Pe.exports;
}
var Fe = { exports: {} }, le = {}, U = {}, Wt;
function $e() {
  if (Wt) return U;
  Wt = 1, Object.defineProperty(U, "__esModule", {
    value: !0
  }), U.farsiLocales = U.englishLocales = U.dotDecimal = U.decimal = U.commaDecimal = U.bengaliLocales = U.arabicLocales = U.alphanumeric = U.alpha = void 0;
  for (var u = U.alpha = {
    "en-US": /^[A-Z]+$/i,
    "az-AZ": /^[A-VXYZÇƏĞİıÖŞÜ]+$/i,
    "bg-BG": /^[А-Я]+$/i,
    "cs-CZ": /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
    "da-DK": /^[A-ZÆØÅ]+$/i,
    "de-DE": /^[A-ZÄÖÜß]+$/i,
    "el-GR": /^[Α-ώ]+$/i,
    "es-ES": /^[A-ZÁÉÍÑÓÚÜ]+$/i,
    "fa-IR": /^[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/i,
    "fi-FI": /^[A-ZÅÄÖ]+$/i,
    "fr-FR": /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
    "it-IT": /^[A-ZÀÉÈÌÎÓÒÙ]+$/i,
    "ja-JP": /^[ぁ-んァ-ヶｦ-ﾟ一-龠ー・。、]+$/i,
    "nb-NO": /^[A-ZÆØÅ]+$/i,
    "nl-NL": /^[A-ZÁÉËÏÓÖÜÚ]+$/i,
    "nn-NO": /^[A-ZÆØÅ]+$/i,
    "hu-HU": /^[A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
    "pl-PL": /^[A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
    "pt-PT": /^[A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
    "ru-RU": /^[А-ЯЁ]+$/i,
    "kk-KZ": /^[А-ЯЁ\u04D8\u04B0\u0406\u04A2\u0492\u04AE\u049A\u04E8\u04BA]+$/i,
    "sl-SI": /^[A-ZČĆĐŠŽ]+$/i,
    "sk-SK": /^[A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
    "sr-RS@latin": /^[A-ZČĆŽŠĐ]+$/i,
    "sr-RS": /^[А-ЯЂЈЉЊЋЏ]+$/i,
    "sv-SE": /^[A-ZÅÄÖ]+$/i,
    "th-TH": /^[ก-๐\s]+$/i,
    "tr-TR": /^[A-ZÇĞİıÖŞÜ]+$/i,
    "uk-UA": /^[А-ЩЬЮЯЄIЇҐі]+$/i,
    "vi-VN": /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
    "ko-KR": /^[ㄱ-ㅎㅏ-ㅣ가-힣]*$/,
    "ku-IQ": /^[ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
    ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
    he: /^[א-ת]+$/,
    fa: /^['آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی']+$/i,
    bn: /^['ঀঁংঃঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ়ঽািীুূৃৄেৈোৌ্ৎৗড়ঢ়য়ৠৡৢৣৰৱ৲৳৴৵৶৷৸৹৺৻']+$/,
    eo: /^[ABCĈD-GĜHĤIJĴK-PRSŜTUŬVZ]+$/i,
    "hi-IN": /^[\u0900-\u0961]+[\u0972-\u097F]*$/i,
    "si-LK": /^[\u0D80-\u0DFF]+$/
  }, e = U.alphanumeric = {
    "en-US": /^[0-9A-Z]+$/i,
    "az-AZ": /^[0-9A-VXYZÇƏĞİıÖŞÜ]+$/i,
    "bg-BG": /^[0-9А-Я]+$/i,
    "cs-CZ": /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
    "da-DK": /^[0-9A-ZÆØÅ]+$/i,
    "de-DE": /^[0-9A-ZÄÖÜß]+$/i,
    "el-GR": /^[0-9Α-ω]+$/i,
    "es-ES": /^[0-9A-ZÁÉÍÑÓÚÜ]+$/i,
    "fi-FI": /^[0-9A-ZÅÄÖ]+$/i,
    "fr-FR": /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
    "it-IT": /^[0-9A-ZÀÉÈÌÎÓÒÙ]+$/i,
    "ja-JP": /^[0-9０-９ぁ-んァ-ヶｦ-ﾟ一-龠ー・。、]+$/i,
    "hu-HU": /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
    "nb-NO": /^[0-9A-ZÆØÅ]+$/i,
    "nl-NL": /^[0-9A-ZÁÉËÏÓÖÜÚ]+$/i,
    "nn-NO": /^[0-9A-ZÆØÅ]+$/i,
    "pl-PL": /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
    "pt-PT": /^[0-9A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
    "ru-RU": /^[0-9А-ЯЁ]+$/i,
    "kk-KZ": /^[0-9А-ЯЁ\u04D8\u04B0\u0406\u04A2\u0492\u04AE\u049A\u04E8\u04BA]+$/i,
    "sl-SI": /^[0-9A-ZČĆĐŠŽ]+$/i,
    "sk-SK": /^[0-9A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
    "sr-RS@latin": /^[0-9A-ZČĆŽŠĐ]+$/i,
    "sr-RS": /^[0-9А-ЯЂЈЉЊЋЏ]+$/i,
    "sv-SE": /^[0-9A-ZÅÄÖ]+$/i,
    "th-TH": /^[ก-๙\s]+$/i,
    "tr-TR": /^[0-9A-ZÇĞİıÖŞÜ]+$/i,
    "uk-UA": /^[0-9А-ЩЬЮЯЄIЇҐі]+$/i,
    "ko-KR": /^[0-9ㄱ-ㅎㅏ-ㅣ가-힣]*$/,
    "ku-IQ": /^[٠١٢٣٤٥٦٧٨٩0-9ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
    "vi-VN": /^[0-9A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
    ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
    he: /^[0-9א-ת]+$/,
    fa: /^['0-9آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی۱۲۳۴۵۶۷۸۹۰']+$/i,
    bn: /^['ঀঁংঃঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ়ঽািীুূৃৄেৈোৌ্ৎৗড়ঢ়য়ৠৡৢৣ০১২৩৪৫৬৭৮৯ৰৱ৲৳৴৵৶৷৸৹৺৻']+$/,
    eo: /^[0-9ABCĈD-GĜHĤIJĴK-PRSŜTUŬVZ]+$/i,
    "hi-IN": /^[\u0900-\u0963]+[\u0966-\u097F]*$/i,
    "si-LK": /^[0-9\u0D80-\u0DFF]+$/
  }, l = U.decimal = {
    "en-US": ".",
    ar: "٫"
  }, d = U.englishLocales = ["AU", "GB", "HK", "IN", "NZ", "ZA", "ZM"], i, t = 0; t < d.length; t++)
    i = "en-".concat(d[t]), u[i] = u["en-US"], e[i] = e["en-US"], l[i] = l["en-US"];
  for (var r = U.arabicLocales = ["AE", "BH", "DZ", "EG", "IQ", "JO", "KW", "LB", "LY", "MA", "QM", "QA", "SA", "SD", "SY", "TN", "YE"], a, n = 0; n < r.length; n++)
    a = "ar-".concat(r[n]), u[a] = u.ar, e[a] = e.ar, l[a] = l.ar;
  for (var f = U.farsiLocales = ["IR", "AF"], v, o = 0; o < f.length; o++)
    v = "fa-".concat(f[o]), e[v] = e.fa, l[v] = l.ar;
  for (var s = U.bengaliLocales = ["BD", "IN"], _, S = 0; S < s.length; S++)
    _ = "bn-".concat(s[S]), u[_] = u.bn, e[_] = e.bn, l[_] = l["en-US"];
  for (var h = U.dotDecimal = ["ar-EG", "ar-LB", "ar-LY"], g = U.commaDecimal = ["bg-BG", "cs-CZ", "da-DK", "de-DE", "el-GR", "en-ZM", "eo", "es-ES", "fr-CA", "fr-FR", "id-ID", "it-IT", "ku-IQ", "hi-IN", "hu-HU", "nb-NO", "nn-NO", "nl-NL", "pl-PL", "pt-PT", "ru-RU", "kk-KZ", "si-LK", "sl-SI", "sr-RS@latin", "sr-RS", "sv-SE", "tr-TR", "uk-UA", "vi-VN"], m = 0; m < h.length; m++)
    l[h[m]] = l["en-US"];
  for (var I = 0; I < g.length; I++)
    l[g[I]] = ",";
  return u["fr-CA"] = u["fr-FR"], e["fr-CA"] = e["fr-FR"], u["pt-BR"] = u["pt-PT"], e["pt-BR"] = e["pt-PT"], l["pt-BR"] = l["pt-PT"], u["pl-Pl"] = u["pl-PL"], e["pl-Pl"] = e["pl-PL"], l["pl-Pl"] = l["pl-PL"], u["fa-AF"] = u.fa, U;
}
var Kt;
function Vn() {
  if (Kt) return le;
  Kt = 1, Object.defineProperty(le, "__esModule", {
    value: !0
  }), le.default = d, le.locales = void 0;
  var u = l(/* @__PURE__ */ C()), e = /* @__PURE__ */ $e();
  function l(i) {
    return i && i.__esModule ? i : { default: i };
  }
  function d(i, t) {
    (0, u.default)(i), t = t || {};
    var r = new RegExp("^(?:[-+])?(?:[0-9]+)?(?:\\".concat(t.locale ? e.decimal[t.locale] : ".", "[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$"));
    if (i === "" || i === "." || i === "," || i === "-" || i === "+")
      return !1;
    var a = parseFloat(i.replace(",", "."));
    return r.test(i) && (!t.hasOwnProperty("min") || a >= t.min) && (!t.hasOwnProperty("max") || a <= t.max) && (!t.hasOwnProperty("lt") || a < t.lt) && (!t.hasOwnProperty("gt") || a > t.gt);
  }
  return le.locales = Object.keys(e.decimal), le;
}
var Vt;
function Yn() {
  return Vt || (Vt = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ Vn());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t) {
      return (0, l.default)(t) ? parseFloat(t) : NaN;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Fe, Fe.exports)), Fe.exports;
}
var Be = { exports: {} }, Yt;
function Vu() {
  return Yt || (Yt = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t, r) {
      return (0, l.default)(t), parseInt(t, r || 10);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Be, Be.exports)), Be.exports;
}
var Ne = { exports: {} }, zt;
function Yu() {
  return zt || (zt = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t, r) {
      return (0, l.default)(t), r ? t === "1" || /^true$/i.test(t) : t !== "0" && !/^false$/i.test(t) && t !== "";
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Ne, Ne.exports)), Ne.exports;
}
var Ze = { exports: {} }, Jt;
function zu() {
  return Jt || (Jt = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t, r) {
      return (0, l.default)(t), t === r;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Ze, Ze.exports)), Ze.exports;
}
var Te = { exports: {} }, qe = { exports: {} }, Xt;
function zn() {
  return Xt || (Xt = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = d;
    function l(i) {
      "@babel/helpers - typeof";
      return l = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
        return typeof t;
      } : function(t) {
        return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
      }, l(i);
    }
    function d(i) {
      return l(i) === "object" && i !== null ? typeof i.toString == "function" ? i = i.toString() : i = "[object Object]" : (i === null || typeof i > "u" || isNaN(i) && !i.length) && (i = ""), String(i);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(qe, qe.exports)), qe.exports;
}
var we = { exports: {} }, Qt;
function H() {
  return Qt || (Qt = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = l;
    function l() {
      var d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 ? arguments[1] : void 0;
      for (var t in i)
        typeof d[t] > "u" && (d[t] = i[t]);
      return d;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(we, we.exports)), we.exports;
}
var jt;
function Ju() {
  return jt || (jt = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = a;
    var l = t(/* @__PURE__ */ C()), d = t(/* @__PURE__ */ zn()), i = t(/* @__PURE__ */ H());
    function t(n) {
      return n && n.__esModule ? n : { default: n };
    }
    var r = {
      ignoreCase: !1,
      minOccurrences: 1
    };
    function a(n, f, v) {
      return (0, l.default)(n), v = (0, i.default)(v, r), v.ignoreCase ? n.toLowerCase().split((0, d.default)(f).toLowerCase()).length > v.minOccurrences : n.split((0, d.default)(f)).length > v.minOccurrences;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Te, Te.exports)), Te.exports;
}
var Ue = { exports: {} }, ea;
function Xu() {
  return ea || (ea = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t, r, a) {
      return (0, l.default)(t), Object.prototype.toString.call(r) !== "[object RegExp]" && (r = new RegExp(r, a)), !!t.match(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Ue, Ue.exports)), Ue.exports;
}
var be = { exports: {} }, He = { exports: {} }, ra;
function Jn() {
  return ra || (ra = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function i(r) {
      "@babel/helpers - typeof";
      return i = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
        return typeof a;
      } : function(a) {
        return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
      }, i(r);
    }
    function t(r, a) {
      (0, l.default)(r);
      var n, f;
      i(a) === "object" ? (n = a.min || 0, f = a.max) : (n = arguments[1], f = arguments[2]);
      var v = encodeURI(r).split(/%..|./).length - 1;
      return v >= n && (typeof f > "u" || v <= f);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(He, He.exports)), He.exports;
}
var ke = { exports: {} }, ta;
function Zt() {
  return ta || (ta = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = r;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ H());
    function i(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var t = {
      require_tld: !0,
      allow_underscores: !1,
      allow_trailing_dot: !1,
      allow_numeric_tld: !1,
      allow_wildcard: !1,
      ignore_max_length: !1
    };
    function r(a, n) {
      (0, l.default)(a), n = (0, d.default)(n, t), n.allow_trailing_dot && a[a.length - 1] === "." && (a = a.substring(0, a.length - 1)), n.allow_wildcard === !0 && a.indexOf("*.") === 0 && (a = a.substring(2));
      var f = a.split("."), v = f[f.length - 1];
      return n.require_tld && (f.length < 2 || !n.allow_numeric_tld && !/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(v) || /\s/.test(v)) || !n.allow_numeric_tld && /^\d+$/.test(v) ? !1 : f.every(function(o) {
        return !(o.length > 63 && !n.ignore_max_length || !/^[a-z_\u00a1-\uffff0-9-]+$/i.test(o) || /[\uff01-\uff5e]/.test(o) || /^-|-$/.test(o) || !n.allow_underscores && /_/.test(o));
      });
    }
    u.exports = e.default, u.exports.default = e.default;
  })(ke, ke.exports)), ke.exports;
}
var Ge = { exports: {} }, aa;
function _t() {
  return aa || (aa = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = f;
    var l = d(/* @__PURE__ */ C());
    function d(v) {
      return v && v.__esModule ? v : { default: v };
    }
    var i = "(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])", t = "(".concat(i, "[.]){3}").concat(i), r = new RegExp("^".concat(t, "$")), a = "(?:[0-9a-fA-F]{1,4})", n = new RegExp("^(" + "(?:".concat(a, ":){7}(?:").concat(a, "|:)|") + "(?:".concat(a, ":){6}(?:").concat(t, "|:").concat(a, "|:)|") + "(?:".concat(a, ":){5}(?::").concat(t, "|(:").concat(a, "){1,2}|:)|") + "(?:".concat(a, ":){4}(?:(:").concat(a, "){0,1}:").concat(t, "|(:").concat(a, "){1,3}|:)|") + "(?:".concat(a, ":){3}(?:(:").concat(a, "){0,2}:").concat(t, "|(:").concat(a, "){1,4}|:)|") + "(?:".concat(a, ":){2}(?:(:").concat(a, "){0,3}:").concat(t, "|(:").concat(a, "){1,5}|:)|") + "(?:".concat(a, ":){1}(?:(:").concat(a, "){0,4}:").concat(t, "|(:").concat(a, "){1,6}|:)|") + "(?::((?::".concat(a, "){0,5}:").concat(t, "|(?::").concat(a, "){1,7}|:))") + ")(%[0-9a-zA-Z-.:]{1,})?$");
    function f(v) {
      var o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      return (0, l.default)(v), o = String(o), o ? o === "4" ? r.test(v) : o === "6" ? n.test(v) : !1 : f(v, 4) || f(v, 6);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Ge, Ge.exports)), Ge.exports;
}
var na;
function Xn() {
  return na || (na = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = m;
    var l = a(/* @__PURE__ */ C()), d = a(/* @__PURE__ */ Jn()), i = a(/* @__PURE__ */ Zt()), t = a(/* @__PURE__ */ _t()), r = a(/* @__PURE__ */ H());
    function a(I) {
      return I && I.__esModule ? I : { default: I };
    }
    var n = {
      allow_display_name: !1,
      allow_underscores: !1,
      require_display_name: !1,
      allow_utf8_local_part: !0,
      require_tld: !0,
      blacklisted_chars: "",
      ignore_max_length: !1,
      host_blacklist: [],
      host_whitelist: []
    }, f = /^([^\x00-\x1F\x7F-\x9F\cX]+)</i, v = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i, o = /^[a-z\d]+$/, s = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i, _ = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i, S = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i, h = 254;
    function g(I) {
      var R = I.replace(/^"(.+)"$/, "$1");
      if (!R.trim())
        return !1;
      var $ = /[\.";<>]/.test(R);
      if ($) {
        if (R === I)
          return !1;
        var E = R.split('"').length === R.split('\\"').length;
        if (!E)
          return !1;
      }
      return !0;
    }
    function m(I, R) {
      if ((0, l.default)(I), R = (0, r.default)(R, n), R.require_display_name || R.allow_display_name) {
        var $ = I.match(f);
        if ($) {
          var E = $[1];
          if (I = I.replace(E, "").replace(/(^<|>$)/g, ""), E.endsWith(" ") && (E = E.slice(0, -1)), !g(E))
            return !1;
        } else if (R.require_display_name)
          return !1;
      }
      if (!R.ignore_max_length && I.length > h)
        return !1;
      var P = I.split("@"), L = P.pop(), F = L.toLowerCase();
      if (R.host_blacklist.includes(F) || R.host_whitelist.length > 0 && !R.host_whitelist.includes(F))
        return !1;
      var B = P.join("@");
      if (R.domain_specific_validation && (F === "gmail.com" || F === "googlemail.com")) {
        B = B.toLowerCase();
        var Z = B.split("+")[0];
        if (!(0, d.default)(Z.replace(/\./g, ""), {
          min: 6,
          max: 30
        }))
          return !1;
        for (var b = Z.split("."), G = 0; G < b.length; G++)
          if (!o.test(b[G]))
            return !1;
      }
      if (R.ignore_max_length === !1 && (!(0, d.default)(B, {
        max: 64
      }) || !(0, d.default)(L, {
        max: 254
      })))
        return !1;
      if (!(0, i.default)(L, {
        require_tld: R.require_tld,
        ignore_max_length: R.ignore_max_length,
        allow_underscores: R.allow_underscores
      })) {
        if (!R.allow_ip_domain)
          return !1;
        if (!(0, t.default)(L)) {
          if (!L.startsWith("[") || !L.endsWith("]"))
            return !1;
          var W = L.slice(1, -1);
          if (W.length === 0 || !(0, t.default)(W))
            return !1;
        }
      }
      if (B[0] === '"')
        return B = B.slice(1, B.length - 1), R.allow_utf8_local_part ? S.test(B) : s.test(B);
      for (var z = R.allow_utf8_local_part ? _ : v, k = B.split("."), Y = 0; Y < k.length; Y++)
        if (!z.test(k[Y]))
          return !1;
      return !(R.blacklisted_chars && B.search(new RegExp("[".concat(R.blacklisted_chars, "]+"), "g")) !== -1);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(be, be.exports)), be.exports;
}
var We = { exports: {} }, ua;
function Qu() {
  return ua || (ua = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = m;
    var l = r(/* @__PURE__ */ C()), d = r(/* @__PURE__ */ Zt()), i = r(/* @__PURE__ */ _t()), t = r(/* @__PURE__ */ H());
    function r(I) {
      return I && I.__esModule ? I : { default: I };
    }
    function a(I, R) {
      return s(I) || o(I, R) || f(I, R) || n();
    }
    function n() {
      throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    function f(I, R) {
      if (I) {
        if (typeof I == "string") return v(I, R);
        var $ = Object.prototype.toString.call(I).slice(8, -1);
        if ($ === "Object" && I.constructor && ($ = I.constructor.name), $ === "Map" || $ === "Set") return Array.from(I);
        if ($ === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test($)) return v(I, R);
      }
    }
    function v(I, R) {
      (R == null || R > I.length) && (R = I.length);
      for (var $ = 0, E = new Array(R); $ < R; $++) E[$] = I[$];
      return E;
    }
    function o(I, R) {
      var $ = I == null ? null : typeof Symbol < "u" && I[Symbol.iterator] || I["@@iterator"];
      if ($ != null) {
        var E, P, L, F, B = [], Z = !0, b = !1;
        try {
          if (L = ($ = $.call(I)).next, R !== 0) for (; !(Z = (E = L.call($)).done) && (B.push(E.value), B.length !== R); Z = !0) ;
        } catch (G) {
          b = !0, P = G;
        } finally {
          try {
            if (!Z && $.return != null && (F = $.return(), Object(F) !== F)) return;
          } finally {
            if (b) throw P;
          }
        }
        return B;
      }
    }
    function s(I) {
      if (Array.isArray(I)) return I;
    }
    var _ = {
      protocols: ["http", "https", "ftp"],
      require_tld: !0,
      require_protocol: !1,
      require_host: !0,
      require_port: !1,
      require_valid_protocol: !0,
      allow_underscores: !1,
      allow_trailing_dot: !1,
      allow_protocol_relative_urls: !1,
      allow_fragments: !0,
      allow_query_components: !0,
      validate_length: !0
    }, S = /^\[([^\]]+)\](?::([0-9]+))?$/;
    function h(I) {
      return Object.prototype.toString.call(I) === "[object RegExp]";
    }
    function g(I, R) {
      for (var $ = 0; $ < R.length; $++) {
        var E = R[$];
        if (I === E || h(E) && E.test(I))
          return !0;
      }
      return !1;
    }
    function m(I, R) {
      if ((0, l.default)(I), !I || /[\s<>]/.test(I) || I.indexOf("mailto:") === 0 || (R = (0, t.default)(R, _), R.validate_length && I.length >= 2083) || !R.allow_fragments && I.includes("#") || !R.allow_query_components && (I.includes("?") || I.includes("&")))
        return !1;
      var $, E, P, L, F, B, Z, b;
      if (Z = I.split("#"), I = Z.shift(), Z = I.split("?"), I = Z.shift(), Z = I.split("://"), Z.length > 1) {
        if ($ = Z.shift().toLowerCase(), R.require_valid_protocol && R.protocols.indexOf($) === -1)
          return !1;
      } else {
        if (R.require_protocol)
          return !1;
        if (I.slice(0, 2) === "//") {
          if (!R.allow_protocol_relative_urls)
            return !1;
          Z[0] = I.slice(2);
        }
      }
      if (I = Z.join("://"), I === "")
        return !1;
      if (Z = I.split("/"), I = Z.shift(), I === "" && !R.require_host)
        return !0;
      if (Z = I.split("@"), Z.length > 1) {
        if (R.disallow_auth || Z[0] === "" || (E = Z.shift(), E.indexOf(":") >= 0 && E.split(":").length > 2))
          return !1;
        var G = E.split(":"), W = a(G, 2), z = W[0], k = W[1];
        if (z === "" && k === "")
          return !1;
      }
      L = Z.join("@"), B = null, b = null;
      var Y = L.match(S);
      if (Y ? (P = "", b = Y[1], B = Y[2] || null) : (Z = L.split(":"), P = Z.shift(), Z.length && (B = Z.join(":"))), B !== null && B.length > 0) {
        if (F = parseInt(B, 10), !/^[0-9]+$/.test(B) || F <= 0 || F > 65535)
          return !1;
      } else if (R.require_port)
        return !1;
      return R.host_whitelist ? g(P, R.host_whitelist) : P === "" && !R.require_host ? !0 : !(!(0, i.default)(P) && !(0, d.default)(P, R) && (!b || !(0, i.default)(b, 6)) || (P = P || b, R.host_blacklist && g(P, R.host_blacklist)));
    }
    u.exports = e.default, u.exports.default = e.default;
  })(We, We.exports)), We.exports;
}
var Ke = { exports: {} }, ia;
function ju() {
  return ia || (ia = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = v;
    var l = d(/* @__PURE__ */ C());
    function d(o) {
      return o && o.__esModule ? o : { default: o };
    }
    var i = /^(?:[0-9a-fA-F]{2}([-:\s]))([0-9a-fA-F]{2}\1){4}([0-9a-fA-F]{2})$/, t = /^([0-9a-fA-F]){12}$/, r = /^([0-9a-fA-F]{4}\.){2}([0-9a-fA-F]{4})$/, a = /^(?:[0-9a-fA-F]{2}([-:\s]))([0-9a-fA-F]{2}\1){6}([0-9a-fA-F]{2})$/, n = /^([0-9a-fA-F]){16}$/, f = /^([0-9a-fA-F]{4}\.){3}([0-9a-fA-F]{4})$/;
    function v(o, s) {
      return (0, l.default)(o), s != null && s.eui && (s.eui = String(s.eui)), s != null && s.no_colons || s != null && s.no_separators ? s.eui === "48" ? t.test(o) : s.eui === "64" ? n.test(o) : t.test(o) || n.test(o) : s?.eui === "48" ? i.test(o) || r.test(o) : s?.eui === "64" ? a.test(o) || f.test(o) : v(o, {
        eui: "48"
      }) || v(o, {
        eui: "64"
      });
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Ke, Ke.exports)), Ke.exports;
}
var Ve = { exports: {} }, sa;
function ei() {
  return sa || (sa = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = n;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ _t());
    function i(f) {
      return f && f.__esModule ? f : { default: f };
    }
    var t = /^\d{1,3}$/, r = 32, a = 128;
    function n(f) {
      var v = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      (0, l.default)(f);
      var o = f.split("/");
      if (o.length !== 2 || !t.test(o[1]) || o[1].length > 1 && o[1].startsWith("0"))
        return !1;
      var s = (0, d.default)(o[0], v);
      if (!s)
        return !1;
      var _ = null;
      switch (String(v)) {
        case "4":
          _ = r;
          break;
        case "6":
          _ = a;
          break;
        default:
          _ = (0, d.default)(o[0], "6") ? a : r;
      }
      return o[1] <= _ && o[1] >= 0;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Ve, Ve.exports)), Ve.exports;
}
var Ye = { exports: {} }, la;
function Qn() {
  return la || (la = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = S;
    var l = d(/* @__PURE__ */ H());
    function d(h) {
      return h && h.__esModule ? h : { default: h };
    }
    function i(h, g) {
      return a(h) || r(h, g) || f(h, g) || t();
    }
    function t() {
      throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    function r(h, g) {
      var m = h == null ? null : typeof Symbol < "u" && h[Symbol.iterator] || h["@@iterator"];
      if (m != null) {
        var I, R, $, E, P = [], L = !0, F = !1;
        try {
          if ($ = (m = m.call(h)).next, g !== 0) for (; !(L = (I = $.call(m)).done) && (P.push(I.value), P.length !== g); L = !0) ;
        } catch (B) {
          F = !0, R = B;
        } finally {
          try {
            if (!L && m.return != null && (E = m.return(), Object(E) !== E)) return;
          } finally {
            if (F) throw R;
          }
        }
        return P;
      }
    }
    function a(h) {
      if (Array.isArray(h)) return h;
    }
    function n(h, g) {
      var m = typeof Symbol < "u" && h[Symbol.iterator] || h["@@iterator"];
      if (!m) {
        if (Array.isArray(h) || (m = f(h)) || g) {
          m && (h = m);
          var I = 0, R = function() {
          };
          return { s: R, n: function() {
            return I >= h.length ? { done: !0 } : { done: !1, value: h[I++] };
          }, e: function(F) {
            throw F;
          }, f: R };
        }
        throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      var $ = !0, E = !1, P;
      return { s: function() {
        m = m.call(h);
      }, n: function() {
        var F = m.next();
        return $ = F.done, F;
      }, e: function(F) {
        E = !0, P = F;
      }, f: function() {
        try {
          !$ && m.return != null && m.return();
        } finally {
          if (E) throw P;
        }
      } };
    }
    function f(h, g) {
      if (h) {
        if (typeof h == "string") return v(h, g);
        var m = Object.prototype.toString.call(h).slice(8, -1);
        if (m === "Object" && h.constructor && (m = h.constructor.name), m === "Map" || m === "Set") return Array.from(h);
        if (m === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(m)) return v(h, g);
      }
    }
    function v(h, g) {
      (g == null || g > h.length) && (g = h.length);
      for (var m = 0, I = new Array(g); m < g; m++) I[m] = h[m];
      return I;
    }
    var o = {
      format: "YYYY/MM/DD",
      delimiters: ["/", "-"],
      strictMode: !1
    };
    function s(h) {
      return /(^(y{4}|y{2})[.\/-](m{1,2})[.\/-](d{1,2})$)|(^(m{1,2})[.\/-](d{1,2})[.\/-]((y{4}|y{2})$))|(^(d{1,2})[.\/-](m{1,2})[.\/-]((y{4}|y{2})$))/gi.test(h);
    }
    function _(h, g) {
      for (var m = [], I = Math.min(h.length, g.length), R = 0; R < I; R++)
        m.push([h[R], g[R]]);
      return m;
    }
    function S(h, g) {
      if (typeof g == "string" ? g = (0, l.default)({
        format: g
      }, o) : g = (0, l.default)(g, o), typeof h == "string" && s(g.format)) {
        var m = g.delimiters.find(function(k) {
          return g.format.indexOf(k) !== -1;
        }), I = g.strictMode ? m : g.delimiters.find(function(k) {
          return h.indexOf(k) !== -1;
        }), R = _(h.split(I), g.format.toLowerCase().split(m)), $ = {}, E = n(R), P;
        try {
          for (E.s(); !(P = E.n()).done; ) {
            var L = i(P.value, 2), F = L[0], B = L[1];
            if (F.length !== B.length)
              return !1;
            $[B.charAt(0)] = F;
          }
        } catch (k) {
          E.e(k);
        } finally {
          E.f();
        }
        var Z = $.y;
        if (Z.startsWith("-"))
          return !1;
        if ($.y.length === 2) {
          var b = parseInt($.y, 10);
          if (isNaN(b))
            return !1;
          var G = (/* @__PURE__ */ new Date()).getFullYear() % 100;
          b < G ? Z = "20".concat($.y) : Z = "19".concat($.y);
        }
        var W = $.m;
        $.m.length === 1 && (W = "0".concat($.m));
        var z = $.d;
        return $.d.length === 1 && (z = "0".concat($.d)), new Date("".concat(Z, "-").concat(W, "-").concat(z, "T00:00:00.000Z")).getUTCDate() === +$.d;
      }
      return g.strictMode ? !1 : Object.prototype.toString.call(h) === "[object Date]" && isFinite(h);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Ye, Ye.exports)), Ye.exports;
}
var ze = { exports: {} }, fa;
function ri() {
  return fa || (fa = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = r;
    var l = d(/* @__PURE__ */ H());
    function d(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var i = {
      hourFormat: "hour24",
      mode: "default"
    }, t = {
      hour24: {
        default: /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/,
        withSeconds: /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/
      },
      hour12: {
        default: /^(0?[1-9]|1[0-2]):([0-5][0-9]) (A|P)M$/,
        withSeconds: /^(0?[1-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) (A|P)M$/
      }
    };
    function r(a, n) {
      return n = (0, l.default)(n, i), typeof a != "string" ? !1 : t[n.hourFormat][n.mode].test(a);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(ze, ze.exports)), ze.exports;
}
var Je = { exports: {} }, oa;
function ti() {
  return oa || (oa = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = a;
    var l = d(/* @__PURE__ */ C());
    function d(n) {
      return n && n.__esModule ? n : { default: n };
    }
    var i = {
      loose: !1
    }, t = ["true", "false", "1", "0"], r = [].concat(t, ["yes", "no"]);
    function a(n) {
      var f = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : i;
      return (0, l.default)(n), f.loose ? r.includes(n.toLowerCase()) : t.includes(n);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Je, Je.exports)), Je.exports;
}
var Xe = { exports: {} }, da;
function ai() {
  return da || (da = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = I;
    var l = d(/* @__PURE__ */ C());
    function d(R) {
      return R && R.__esModule ? R : { default: R };
    }
    var i = "([A-Za-z]{3}(-[A-Za-z]{3}){0,2})", t = "(([a-zA-Z]{2,3}(-".concat(i, ")?)|([a-zA-Z]{5,8}))"), r = "([A-Za-z]{4})", a = "([A-Za-z]{2}|\\d{3})", n = "([A-Za-z0-9]{5,8}|(\\d[A-Z-a-z0-9]{3}))", f = "(\\d|[A-W]|[Y-Z]|[a-w]|[y-z])", v = "(".concat(f, "(-[A-Za-z0-9]{2,8})+)"), o = "(x(-[A-Za-z0-9]{1,8})+)", s = "((en-GB-oed)|(i-ami)|(i-bnn)|(i-default)|(i-enochian)|(i-hak)|(i-klingon)|(i-lux)|(i-mingo)|(i-navajo)|(i-pwn)|(i-tao)|(i-tay)|(i-tsu)|(sgn-BE-FR)|(sgn-BE-NL)|(sgn-CH-DE))", _ = "((art-lojban)|(cel-gaulish)|(no-bok)|(no-nyn)|(zh-guoyu)|(zh-hakka)|(zh-min)|(zh-min-nan)|(zh-xiang))", S = "(".concat(s, "|").concat(_, ")"), h = "(-|_)", g = "".concat(t, "(").concat(h).concat(r, ")?(").concat(h).concat(a, ")?(").concat(h).concat(n, ")*(").concat(h).concat(v, ")*(").concat(h).concat(o, ")?"), m = new RegExp("(^".concat(o, "$)|(^").concat(S, "$)|(^").concat(g, "$)"));
    function I(R) {
      return (0, l.default)(R), m.test(R);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Xe, Xe.exports)), Xe.exports;
}
var Qe = { exports: {} }, ca;
function ni() {
  return ca || (ca = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /^(?!(1[3-9])|(20)|(3[3-9])|(4[0-9])|(5[0-9])|(60)|(7[3-9])|(8[1-9])|(9[0-2])|(9[3-9]))[0-9]{9}$/;
    function t(r) {
      if ((0, l.default)(r), !i.test(r)) return !1;
      for (var a = 0, n = 0; n < r.length; n++)
        n % 3 === 0 ? a += r[n] * 3 : n % 3 === 1 ? a += r[n] * 7 : a += r[n] * 1;
      return a % 10 === 0;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Qe, Qe.exports)), Qe.exports;
}
var fe = {}, va;
function ui() {
  if (va) return fe;
  va = 1, Object.defineProperty(fe, "__esModule", {
    value: !0
  }), fe.default = d, fe.locales = void 0;
  var u = l(/* @__PURE__ */ C()), e = /* @__PURE__ */ $e();
  function l(i) {
    return i && i.__esModule ? i : { default: i };
  }
  function d(i) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "en-US", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    (0, u.default)(i);
    var a = i, n = r.ignore;
    if (n)
      if (n instanceof RegExp)
        a = a.replace(n, "");
      else if (typeof n == "string")
        a = a.replace(new RegExp("[".concat(n.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, "\\$&"), "]"), "g"), "");
      else
        throw new Error("ignore should be instance of a String or RegExp");
    if (t in e.alpha)
      return e.alpha[t].test(a);
    throw new Error("Invalid locale '".concat(t, "'"));
  }
  return fe.locales = Object.keys(e.alpha), fe;
}
var oe = {}, pa;
function ii() {
  if (pa) return oe;
  pa = 1, Object.defineProperty(oe, "__esModule", {
    value: !0
  }), oe.default = d, oe.locales = void 0;
  var u = l(/* @__PURE__ */ C()), e = /* @__PURE__ */ $e();
  function l(i) {
    return i && i.__esModule ? i : { default: i };
  }
  function d(i) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "en-US", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    (0, u.default)(i);
    var a = i, n = r.ignore;
    if (n)
      if (n instanceof RegExp)
        a = a.replace(n, "");
      else if (typeof n == "string")
        a = a.replace(new RegExp("[".concat(n.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, "\\$&"), "]"), "g"), "");
      else
        throw new Error("ignore should be instance of a String or RegExp");
    if (t in e.alphanumeric)
      return e.alphanumeric[t].test(a);
    throw new Error("Invalid locale '".concat(t, "'"));
  }
  return oe.locales = Object.keys(e.alphanumeric), oe;
}
var je = { exports: {} }, _a;
function si() {
  return _a || (_a = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = r;
    var l = i(/* @__PURE__ */ C()), d = /* @__PURE__ */ $e();
    function i(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var t = /^[0-9]+$/;
    function r(a, n) {
      return (0, l.default)(a), n && n.no_symbols ? t.test(a) : new RegExp("^[+-]?([0-9]*[".concat((n || {}).locale ? d.decimal[n.locale] : ".", "])?[0-9]+$")).test(a);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(je, je.exports)), je.exports;
}
var er = { exports: {} }, ha;
function li() {
  return ha || (ha = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = {
      AM: /^[A-Z]{2}\d{7}$/,
      // ARMENIA
      AR: /^[A-Z]{3}\d{6}$/,
      // ARGENTINA
      AT: /^[A-Z]\d{7}$/,
      // AUSTRIA
      AU: /^[A-Z]\d{7}$/,
      // AUSTRALIA
      AZ: /^[A-Z]{1}\d{8}$/,
      // AZERBAIJAN
      BE: /^[A-Z]{2}\d{6}$/,
      // BELGIUM
      BG: /^\d{9}$/,
      // BULGARIA
      BR: /^[A-Z]{2}\d{6}$/,
      // BRAZIL
      BY: /^[A-Z]{2}\d{7}$/,
      // BELARUS
      CA: /^[A-Z]{2}\d{6}$/,
      // CANADA
      CH: /^[A-Z]\d{7}$/,
      // SWITZERLAND
      CN: /^G\d{8}$|^E(?![IO])[A-Z0-9]\d{7}$/,
      // CHINA [G=Ordinary, E=Electronic] followed by 8-digits, or E followed by any UPPERCASE letter (except I and O) followed by 7 digits
      CY: /^[A-Z](\d{6}|\d{8})$/,
      // CYPRUS
      CZ: /^\d{8}$/,
      // CZECH REPUBLIC
      DE: /^[CFGHJKLMNPRTVWXYZ0-9]{9}$/,
      // GERMANY
      DK: /^\d{9}$/,
      // DENMARK
      DZ: /^\d{9}$/,
      // ALGERIA
      EE: /^([A-Z]\d{7}|[A-Z]{2}\d{7})$/,
      // ESTONIA (K followed by 7-digits), e-passports have 2 UPPERCASE followed by 7 digits
      ES: /^[A-Z0-9]{2}([A-Z0-9]?)\d{6}$/,
      // SPAIN
      FI: /^[A-Z]{2}\d{7}$/,
      // FINLAND
      FR: /^\d{2}[A-Z]{2}\d{5}$/,
      // FRANCE
      GB: /^\d{9}$/,
      // UNITED KINGDOM
      GR: /^[A-Z]{2}\d{7}$/,
      // GREECE
      HR: /^\d{9}$/,
      // CROATIA
      HU: /^[A-Z]{2}(\d{6}|\d{7})$/,
      // HUNGARY
      IE: /^[A-Z0-9]{2}\d{7}$/,
      // IRELAND
      IN: /^[A-Z]{1}-?\d{7}$/,
      // INDIA
      ID: /^[A-C]\d{7}$/,
      // INDONESIA
      IR: /^[A-Z]\d{8}$/,
      // IRAN
      IS: /^(A)\d{7}$/,
      // ICELAND
      IT: /^[A-Z0-9]{2}\d{7}$/,
      // ITALY
      JM: /^[Aa]\d{7}$/,
      // JAMAICA
      JP: /^[A-Z]{2}\d{7}$/,
      // JAPAN
      KR: /^[MS]\d{8}$/,
      // SOUTH KOREA, REPUBLIC OF KOREA, [S=PS Passports, M=PM Passports]
      KZ: /^[a-zA-Z]\d{7}$/,
      // KAZAKHSTAN
      LI: /^[a-zA-Z]\d{5}$/,
      // LIECHTENSTEIN
      LT: /^[A-Z0-9]{8}$/,
      // LITHUANIA
      LU: /^[A-Z0-9]{8}$/,
      // LUXEMBURG
      LV: /^[A-Z0-9]{2}\d{7}$/,
      // LATVIA
      LY: /^[A-Z0-9]{8}$/,
      // LIBYA
      MT: /^\d{7}$/,
      // MALTA
      MZ: /^([A-Z]{2}\d{7})|(\d{2}[A-Z]{2}\d{5})$/,
      // MOZAMBIQUE
      MY: /^[AHK]\d{8}$/,
      // MALAYSIA
      MX: /^\d{10,11}$/,
      // MEXICO
      NL: /^[A-Z]{2}[A-Z0-9]{6}\d$/,
      // NETHERLANDS
      NZ: /^([Ll]([Aa]|[Dd]|[Ff]|[Hh])|[Ee]([Aa]|[Pp])|[Nn])\d{6}$/,
      // NEW ZEALAND
      PH: /^([A-Z](\d{6}|\d{7}[A-Z]))|([A-Z]{2}(\d{6}|\d{7}))$/,
      // PHILIPPINES
      PK: /^[A-Z]{2}\d{7}$/,
      // PAKISTAN
      PL: /^[A-Z]{2}\d{7}$/,
      // POLAND
      PT: /^[A-Z]\d{6}$/,
      // PORTUGAL
      RO: /^\d{8,9}$/,
      // ROMANIA
      RU: /^\d{9}$/,
      // RUSSIAN FEDERATION
      SE: /^\d{8}$/,
      // SWEDEN
      SL: /^(P)[A-Z]\d{7}$/,
      // SLOVENIA
      SK: /^[0-9A-Z]\d{7}$/,
      // SLOVAKIA
      TH: /^[A-Z]{1,2}\d{6,7}$/,
      // THAILAND
      TR: /^[A-Z]\d{8}$/,
      // TURKEY
      UA: /^[A-Z]{2}\d{6}$/,
      // UKRAINE
      US: /^\d{9}$/,
      // UNITED STATES
      ZA: /^[TAMD]\d{8}$/
      // SOUTH AFRICA
    };
    function t(r, a) {
      (0, l.default)(r);
      var n = r.replace(/\s/g, "").toUpperCase();
      return a.toUpperCase() in i && i[a].test(n);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(er, er.exports)), er.exports;
}
var rr = { exports: {} }, tr = { exports: {} }, ga;
function Tt() {
  return ga || (ga = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = r;
    var l = d(/* @__PURE__ */ C());
    function d(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var i = /^(?:[-+]?(?:0|[1-9][0-9]*))$/, t = /^[-+]?[0-9]+$/;
    function r(a, n) {
      (0, l.default)(a), n = n || {};
      var f = n.allow_leading_zeroes === !1 ? i : t, v = !n.hasOwnProperty("min") || a >= n.min, o = !n.hasOwnProperty("max") || a <= n.max, s = !n.hasOwnProperty("lt") || a < n.lt, _ = !n.hasOwnProperty("gt") || a > n.gt;
      return f.test(a) && v && o && s && _;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(tr, tr.exports)), tr.exports;
}
var Aa;
function fi() {
  return Aa || (Aa = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ Tt());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t) {
      return (0, l.default)(t, {
        allow_leading_zeroes: !1,
        min: 0,
        max: 65535
      });
    }
    u.exports = e.default, u.exports.default = e.default;
  })(rr, rr.exports)), rr.exports;
}
var ar = { exports: {} }, ma;
function oi() {
  return ma || (ma = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t) {
      return (0, l.default)(t), t === t.toLowerCase();
    }
    u.exports = e.default, u.exports.default = e.default;
  })(ar, ar.exports)), ar.exports;
}
var nr = { exports: {} }, Sa;
function di() {
  return Sa || (Sa = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t) {
      return (0, l.default)(t), t === t.toUpperCase();
    }
    u.exports = e.default, u.exports.default = e.default;
  })(nr, nr.exports)), nr.exports;
}
var ur = { exports: {} }, Ia;
function ci() {
  return Ia || (Ia = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = r;
    var l = d(/* @__PURE__ */ C());
    function d(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var i = /^[0-9]{15}$/, t = /^\d{2}-\d{6}-\d{6}-\d{1}$/;
    function r(a, n) {
      (0, l.default)(a), n = n || {};
      var f = i;
      if (n.allow_hyphens && (f = t), !f.test(a))
        return !1;
      a = a.replace(/-/g, "");
      for (var v = 0, o = 2, s = 14, _ = 0; _ < s; _++) {
        var S = a.substring(s - _ - 1, s - _), h = parseInt(S, 10) * o;
        h >= 10 ? v += h % 10 + 1 : v += h, o === 1 ? o += 1 : o -= 1;
      }
      var g = (10 - v % 10) % 10;
      return g === parseInt(a.substring(14, 15), 10);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(ur, ur.exports)), ur.exports;
}
var ir = { exports: {} }, Ra;
function vi() {
  return Ra || (Ra = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /^[\x00-\x7F]+$/;
    function t(r) {
      return (0, l.default)(r), i.test(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(ir, ir.exports)), ir.exports;
}
var de = {}, $a;
function jn() {
  if ($a) return de;
  $a = 1, Object.defineProperty(de, "__esModule", {
    value: !0
  }), de.default = d, de.fullWidth = void 0;
  var u = e(/* @__PURE__ */ C());
  function e(i) {
    return i && i.__esModule ? i : { default: i };
  }
  var l = de.fullWidth = /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;
  function d(i) {
    return (0, u.default)(i), l.test(i);
  }
  return de;
}
var ce = {}, Ma;
function eu() {
  if (Ma) return ce;
  Ma = 1, Object.defineProperty(ce, "__esModule", {
    value: !0
  }), ce.default = d, ce.halfWidth = void 0;
  var u = e(/* @__PURE__ */ C());
  function e(i) {
    return i && i.__esModule ? i : { default: i };
  }
  var l = ce.halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;
  function d(i) {
    return (0, u.default)(i), l.test(i);
  }
  return ce;
}
var sr = { exports: {} }, ya;
function pi() {
  return ya || (ya = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = r;
    var l = t(/* @__PURE__ */ C()), d = /* @__PURE__ */ jn(), i = /* @__PURE__ */ eu();
    function t(a) {
      return a && a.__esModule ? a : { default: a };
    }
    function r(a) {
      return (0, l.default)(a), d.fullWidth.test(a) && i.halfWidth.test(a);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(sr, sr.exports)), sr.exports;
}
var lr = { exports: {} }, xa;
function _i() {
  return xa || (xa = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /[^\x00-\x7F]/;
    function t(r) {
      return (0, l.default)(r), i.test(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(lr, lr.exports)), lr.exports;
}
var fr = { exports: {} }, or = { exports: {} }, Ca;
function hi() {
  return Ca || (Ca = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = l;
    function l(d, i) {
      var t = d.join("");
      return new RegExp(t, i);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(or, or.exports)), or.exports;
}
var Da;
function gi() {
  return Da || (Da = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = r;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ hi());
    function i(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var t = (0, d.default)(["^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)", "(?:-((?:0|[1-9]\\d*|\\d*[a-z-][0-9a-z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-z-][0-9a-z-]*))*))", "?(?:\\+([0-9a-z-]+(?:\\.[0-9a-z-]+)*))?$"], "i");
    function r(a) {
      return (0, l.default)(a), t.test(a);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(fr, fr.exports)), fr.exports;
}
var dr = { exports: {} }, Ea;
function Ai() {
  return Ea || (Ea = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;
    function t(r) {
      return (0, l.default)(r), i.test(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(dr, dr.exports)), dr.exports;
}
var cr = { exports: {} }, vr = { exports: {} }, La;
function mi() {
  return La || (La = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = void 0;
    var l = function(i, t) {
      return i.some(function(r) {
        return t === r;
      });
    };
    e.default = l, u.exports = e.default, u.exports.default = e.default;
  })(vr, vr.exports)), vr.exports;
}
var Pa;
function Si() {
  return Pa || (Pa = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = v;
    var l = r(/* @__PURE__ */ H()), d = r(/* @__PURE__ */ C()), i = r(/* @__PURE__ */ mi()), t = /* @__PURE__ */ $e();
    function r(o) {
      return o && o.__esModule ? o : { default: o };
    }
    function a(o) {
      var s = new RegExp("^[-+]?([0-9]+)?(\\".concat(t.decimal[o.locale], "[0-9]{").concat(o.decimal_digits, "})").concat(o.force_decimal ? "" : "?", "$"));
      return s;
    }
    var n = {
      force_decimal: !1,
      decimal_digits: "1,",
      locale: "en-US"
    }, f = ["", "-", "+"];
    function v(o, s) {
      if ((0, d.default)(o), s = (0, l.default)(s, n), s.locale in t.decimal)
        return !(0, i.default)(f, o.replace(/ /g, "")) && a(s).test(o);
      throw new Error("Invalid locale '".concat(s.locale, "'"));
    }
    u.exports = e.default, u.exports.default = e.default;
  })(cr, cr.exports)), cr.exports;
}
var pr = { exports: {} }, Oa;
function ru() {
  return Oa || (Oa = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /^(0x|0h)?[0-9A-F]+$/i;
    function t(r) {
      return (0, l.default)(r), i.test(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(pr, pr.exports)), pr.exports;
}
var _r = { exports: {} }, Fa;
function Ii() {
  return Fa || (Fa = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /^(0o)?[0-7]+$/i;
    function t(r) {
      return (0, l.default)(r), i.test(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(_r, _r.exports)), _r.exports;
}
var hr = { exports: {} }, Ba;
function Ri() {
  return Ba || (Ba = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ Yn());
    function i(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function t(r, a) {
      return (0, l.default)(r), (0, d.default)(r) % parseInt(a, 10) === 0;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(hr, hr.exports)), hr.exports;
}
var gr = { exports: {} }, Na;
function $i() {
  return Na || (Na = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;
    function t(r) {
      return (0, l.default)(r), i.test(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(gr, gr.exports)), gr.exports;
}
var Ar = { exports: {} }, Za;
function Mi() {
  return Za || (Za = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = n;
    var l = d(/* @__PURE__ */ C());
    function d(f) {
      return f && f.__esModule ? f : { default: f };
    }
    var i = /^rgb\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\)$/, t = /^rgba\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/, r = /^rgb\((([0-9]%|[1-9][0-9]%|100%),){2}([0-9]%|[1-9][0-9]%|100%)\)$/, a = /^rgba\((([0-9]%|[1-9][0-9]%|100%),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
    function n(f) {
      var v = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
      return (0, l.default)(f), v ? i.test(f) || t.test(f) || r.test(f) || a.test(f) : i.test(f) || t.test(f);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Ar, Ar.exports)), Ar.exports;
}
var mr = { exports: {} }, Ta;
function yi() {
  return Ta || (Ta = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = r;
    var l = d(/* @__PURE__ */ C());
    function d(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var i = /^hsla?\(((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?))(deg|grad|rad|turn)?(,(\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%){2}(,((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%?))?\)$/i, t = /^hsla?\(((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?))(deg|grad|rad|turn)?(\s(\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%){2}\s?(\/\s((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%?)\s?)?\)$/i;
    function r(a) {
      (0, l.default)(a);
      var n = a.replace(/\s+/g, " ").replace(/\s?(hsla?\(|\)|,)\s?/ig, "$1");
      return n.indexOf(",") !== -1 ? i.test(n) : t.test(n);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(mr, mr.exports)), mr.exports;
}
var Sr = { exports: {} }, qa;
function xi() {
  return qa || (qa = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /^[A-Z]{2}[0-9A-Z]{3}\d{2}\d{5}$/;
    function t(r) {
      return (0, l.default)(r), i.test(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Sr, Sr.exports)), Sr.exports;
}
var ve = {}, wa;
function Ci() {
  if (wa) return ve;
  wa = 1, Object.defineProperty(ve, "__esModule", {
    value: !0
  }), ve.default = r, ve.locales = void 0;
  var u = e(/* @__PURE__ */ C());
  function e(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var l = {
    AD: /^(AD[0-9]{2})\d{8}[A-Z0-9]{12}$/,
    AE: /^(AE[0-9]{2})\d{3}\d{16}$/,
    AL: /^(AL[0-9]{2})\d{8}[A-Z0-9]{16}$/,
    AT: /^(AT[0-9]{2})\d{16}$/,
    AZ: /^(AZ[0-9]{2})[A-Z0-9]{4}\d{20}$/,
    BA: /^(BA[0-9]{2})\d{16}$/,
    BE: /^(BE[0-9]{2})\d{12}$/,
    BG: /^(BG[0-9]{2})[A-Z]{4}\d{6}[A-Z0-9]{8}$/,
    BH: /^(BH[0-9]{2})[A-Z]{4}[A-Z0-9]{14}$/,
    BR: /^(BR[0-9]{2})\d{23}[A-Z]{1}[A-Z0-9]{1}$/,
    BY: /^(BY[0-9]{2})[A-Z0-9]{4}\d{20}$/,
    CH: /^(CH[0-9]{2})\d{5}[A-Z0-9]{12}$/,
    CR: /^(CR[0-9]{2})\d{18}$/,
    CY: /^(CY[0-9]{2})\d{8}[A-Z0-9]{16}$/,
    CZ: /^(CZ[0-9]{2})\d{20}$/,
    DE: /^(DE[0-9]{2})\d{18}$/,
    DK: /^(DK[0-9]{2})\d{14}$/,
    DO: /^(DO[0-9]{2})[A-Z]{4}\d{20}$/,
    DZ: /^(DZ\d{24})$/,
    EE: /^(EE[0-9]{2})\d{16}$/,
    EG: /^(EG[0-9]{2})\d{25}$/,
    ES: /^(ES[0-9]{2})\d{20}$/,
    FI: /^(FI[0-9]{2})\d{14}$/,
    FO: /^(FO[0-9]{2})\d{14}$/,
    FR: /^(FR[0-9]{2})\d{10}[A-Z0-9]{11}\d{2}$/,
    GB: /^(GB[0-9]{2})[A-Z]{4}\d{14}$/,
    GE: /^(GE[0-9]{2})[A-Z0-9]{2}\d{16}$/,
    GI: /^(GI[0-9]{2})[A-Z]{4}[A-Z0-9]{15}$/,
    GL: /^(GL[0-9]{2})\d{14}$/,
    GR: /^(GR[0-9]{2})\d{7}[A-Z0-9]{16}$/,
    GT: /^(GT[0-9]{2})[A-Z0-9]{4}[A-Z0-9]{20}$/,
    HR: /^(HR[0-9]{2})\d{17}$/,
    HU: /^(HU[0-9]{2})\d{24}$/,
    IE: /^(IE[0-9]{2})[A-Z0-9]{4}\d{14}$/,
    IL: /^(IL[0-9]{2})\d{19}$/,
    IQ: /^(IQ[0-9]{2})[A-Z]{4}\d{15}$/,
    IR: /^(IR[0-9]{2})0\d{2}0\d{18}$/,
    IS: /^(IS[0-9]{2})\d{22}$/,
    IT: /^(IT[0-9]{2})[A-Z]{1}\d{10}[A-Z0-9]{12}$/,
    JO: /^(JO[0-9]{2})[A-Z]{4}\d{22}$/,
    KW: /^(KW[0-9]{2})[A-Z]{4}[A-Z0-9]{22}$/,
    KZ: /^(KZ[0-9]{2})\d{3}[A-Z0-9]{13}$/,
    LB: /^(LB[0-9]{2})\d{4}[A-Z0-9]{20}$/,
    LC: /^(LC[0-9]{2})[A-Z]{4}[A-Z0-9]{24}$/,
    LI: /^(LI[0-9]{2})\d{5}[A-Z0-9]{12}$/,
    LT: /^(LT[0-9]{2})\d{16}$/,
    LU: /^(LU[0-9]{2})\d{3}[A-Z0-9]{13}$/,
    LV: /^(LV[0-9]{2})[A-Z]{4}[A-Z0-9]{13}$/,
    MA: /^(MA[0-9]{26})$/,
    MC: /^(MC[0-9]{2})\d{10}[A-Z0-9]{11}\d{2}$/,
    MD: /^(MD[0-9]{2})[A-Z0-9]{20}$/,
    ME: /^(ME[0-9]{2})\d{18}$/,
    MK: /^(MK[0-9]{2})\d{3}[A-Z0-9]{10}\d{2}$/,
    MR: /^(MR[0-9]{2})\d{23}$/,
    MT: /^(MT[0-9]{2})[A-Z]{4}\d{5}[A-Z0-9]{18}$/,
    MU: /^(MU[0-9]{2})[A-Z]{4}\d{19}[A-Z]{3}$/,
    MZ: /^(MZ[0-9]{2})\d{21}$/,
    NL: /^(NL[0-9]{2})[A-Z]{4}\d{10}$/,
    NO: /^(NO[0-9]{2})\d{11}$/,
    PK: /^(PK[0-9]{2})[A-Z0-9]{4}\d{16}$/,
    PL: /^(PL[0-9]{2})\d{24}$/,
    PS: /^(PS[0-9]{2})[A-Z0-9]{4}\d{21}$/,
    PT: /^(PT[0-9]{2})\d{21}$/,
    QA: /^(QA[0-9]{2})[A-Z]{4}[A-Z0-9]{21}$/,
    RO: /^(RO[0-9]{2})[A-Z]{4}[A-Z0-9]{16}$/,
    RS: /^(RS[0-9]{2})\d{18}$/,
    SA: /^(SA[0-9]{2})\d{2}[A-Z0-9]{18}$/,
    SC: /^(SC[0-9]{2})[A-Z]{4}\d{20}[A-Z]{3}$/,
    SE: /^(SE[0-9]{2})\d{20}$/,
    SI: /^(SI[0-9]{2})\d{15}$/,
    SK: /^(SK[0-9]{2})\d{20}$/,
    SM: /^(SM[0-9]{2})[A-Z]{1}\d{10}[A-Z0-9]{12}$/,
    SV: /^(SV[0-9]{2})[A-Z0-9]{4}\d{20}$/,
    TL: /^(TL[0-9]{2})\d{19}$/,
    TN: /^(TN[0-9]{2})\d{20}$/,
    TR: /^(TR[0-9]{2})\d{5}[A-Z0-9]{17}$/,
    UA: /^(UA[0-9]{2})\d{6}[A-Z0-9]{19}$/,
    VA: /^(VA[0-9]{2})\d{18}$/,
    VG: /^(VG[0-9]{2})[A-Z0-9]{4}\d{16}$/,
    XK: /^(XK[0-9]{2})\d{16}$/
  };
  function d(a) {
    var n = a.filter(function(f) {
      return !(f in l);
    });
    return !(n.length > 0);
  }
  function i(a, n) {
    var f = a.replace(/[\s\-]+/gi, "").toUpperCase(), v = f.slice(0, 2).toUpperCase(), o = v in l;
    if (n.whitelist) {
      if (!d(n.whitelist))
        return !1;
      var s = n.whitelist.includes(v);
      if (!s)
        return !1;
    }
    if (n.blacklist) {
      var _ = n.blacklist.includes(v);
      if (_)
        return !1;
    }
    return o && l[v].test(f);
  }
  function t(a) {
    var n = a.replace(/[^A-Z0-9]+/gi, "").toUpperCase(), f = n.slice(4) + n.slice(0, 4), v = f.replace(/[A-Z]/g, function(s) {
      return s.charCodeAt(0) - 55;
    }), o = v.match(/\d{1,7}/g).reduce(function(s, _) {
      return Number(s + _) % 97;
    }, "");
    return o === 1;
  }
  function r(a) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return (0, u.default)(a), i(a, n) && t(a);
  }
  return ve.locales = Object.keys(l), ve;
}
var Ir = { exports: {} }, pe = {}, Ua;
function tu() {
  if (Ua) return pe;
  Ua = 1, Object.defineProperty(pe, "__esModule", {
    value: !0
  }), pe.CountryCodes = void 0, pe.default = d;
  var u = e(/* @__PURE__ */ C());
  function e(i) {
    return i && i.__esModule ? i : { default: i };
  }
  var l = /* @__PURE__ */ new Set(["AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW"]);
  function d(i) {
    return (0, u.default)(i), l.has(i.toUpperCase());
  }
  return pe.CountryCodes = l, pe;
}
var ba;
function Di() {
  return ba || (ba = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = r;
    var l = i(/* @__PURE__ */ C()), d = /* @__PURE__ */ tu();
    function i(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var t = /^[A-Za-z]{6}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/;
    function r(a) {
      (0, l.default)(a);
      var n = a.slice(4, 6).toUpperCase();
      return !d.CountryCodes.has(n) && n !== "XK" ? !1 : t.test(a);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Ir, Ir.exports)), Ir.exports;
}
var Rr = { exports: {} }, Ha;
function Ei() {
  return Ha || (Ha = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /^[a-f0-9]{32}$/;
    function t(r) {
      return (0, l.default)(r), i.test(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Rr, Rr.exports)), Rr.exports;
}
var $r = { exports: {} }, ka;
function Li() {
  return ka || (ka = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = {
      md5: 32,
      md4: 32,
      sha1: 40,
      sha256: 64,
      sha384: 96,
      sha512: 128,
      ripemd128: 32,
      ripemd160: 40,
      tiger128: 32,
      tiger160: 40,
      tiger192: 48,
      crc32: 8,
      crc32b: 8
    };
    function t(r, a) {
      (0, l.default)(r);
      var n = new RegExp("^[a-fA-F0-9]{".concat(i[a], "}$"));
      return n.test(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })($r, $r.exports)), $r.exports;
}
var Mr = { exports: {} }, yr = { exports: {} }, Ga;
function au() {
  return Ga || (Ga = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = n;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ H());
    function i(f) {
      return f && f.__esModule ? f : { default: f };
    }
    var t = /[^A-Z0-9+\/=]/i, r = /^[A-Z0-9_\-]*$/i, a = {
      urlSafe: !1
    };
    function n(f, v) {
      (0, l.default)(f), v = (0, d.default)(v, a);
      var o = f.length;
      if (v.urlSafe)
        return r.test(f);
      if (o % 4 !== 0 || t.test(f))
        return !1;
      var s = f.indexOf("=");
      return s === -1 || s === o - 1 || s === o - 2 && f[o - 1] === "=";
    }
    u.exports = e.default, u.exports.default = e.default;
  })(yr, yr.exports)), yr.exports;
}
var Wa;
function Pi() {
  return Wa || (Wa = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ au());
    function i(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function t(r) {
      (0, l.default)(r);
      var a = r.split("."), n = a.length;
      return n !== 3 ? !1 : a.reduce(function(f, v) {
        return f && (0, d.default)(v, {
          urlSafe: !0
        });
      }, !0);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Mr, Mr.exports)), Mr.exports;
}
var xr = { exports: {} }, Ka;
function Oi() {
  return Ka || (Ka = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = a;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ H());
    function i(n) {
      return n && n.__esModule ? n : { default: n };
    }
    function t(n) {
      "@babel/helpers - typeof";
      return t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(f) {
        return typeof f;
      } : function(f) {
        return f && typeof Symbol == "function" && f.constructor === Symbol && f !== Symbol.prototype ? "symbol" : typeof f;
      }, t(n);
    }
    var r = {
      allow_primitives: !1
    };
    function a(n, f) {
      (0, l.default)(n);
      try {
        f = (0, d.default)(f, r);
        var v = [];
        f.allow_primitives && (v = [null, !1, !0]);
        var o = JSON.parse(n);
        return v.includes(o) || !!o && t(o) === "object";
      } catch {
      }
      return !1;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(xr, xr.exports)), xr.exports;
}
var Cr = { exports: {} }, Va;
function Fi() {
  return Va || (Va = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = r;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ H());
    function i(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var t = {
      ignore_whitespace: !1
    };
    function r(a, n) {
      return (0, l.default)(a), n = (0, d.default)(n, t), (n.ignore_whitespace ? a.trim().length : a.length) === 0;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Cr, Cr.exports)), Cr.exports;
}
var Dr = { exports: {} }, Ya;
function Bi() {
  return Ya || (Ya = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function i(r) {
      "@babel/helpers - typeof";
      return i = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
        return typeof a;
      } : function(a) {
        return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
      }, i(r);
    }
    function t(r, a) {
      (0, l.default)(r);
      var n, f;
      i(a) === "object" ? (n = a.min || 0, f = a.max) : (n = arguments[1] || 0, f = arguments[2]);
      var v = r.match(/(\uFE0F|\uFE0E)/g) || [], o = r.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [], s = r.length - v.length - o.length;
      return s >= n && (typeof f > "u" || s <= f);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Dr, Dr.exports)), Dr.exports;
}
var Er = { exports: {} }, za;
function Ni() {
  return za || (za = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = {
      1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
      2: /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
      3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
      4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
      5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
      7: /^[0-9A-F]{8}-[0-9A-F]{4}-7[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
      all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
    };
    function t(r, a) {
      (0, l.default)(r);
      var n = i[[void 0, null].includes(a) ? "all" : a];
      return !!n && n.test(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Er, Er.exports)), Er.exports;
}
var Lr = { exports: {} }, Ja;
function Zi() {
  return Ja || (Ja = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ ru());
    function i(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function t(r) {
      return (0, l.default)(r), (0, d.default)(r) && r.length === 24;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Lr, Lr.exports)), Lr.exports;
}
var Pr = { exports: {} }, Xa;
function Ti() {
  return Xa || (Xa = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ Nt());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t, r) {
      var a = r?.comparisonDate || r || Date().toString(), n = (0, l.default)(a), f = (0, l.default)(t);
      return !!(f && n && f > n);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Pr, Pr.exports)), Pr.exports;
}
var Or = { exports: {} }, Qa;
function qi() {
  return Qa || (Qa = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ Nt());
    function i(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function t(r) {
      var a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : String(/* @__PURE__ */ new Date());
      (0, l.default)(r);
      var n = (0, d.default)(a), f = (0, d.default)(r);
      return !!(f && n && f < n);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Or, Or.exports)), Or.exports;
}
var Fr = { exports: {} }, ja;
function wi() {
  return ja || (ja = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = r;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ zn());
    function i(a) {
      return a && a.__esModule ? a : { default: a };
    }
    function t(a) {
      "@babel/helpers - typeof";
      return t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
        return typeof n;
      } : function(n) {
        return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
      }, t(a);
    }
    function r(a, n) {
      (0, l.default)(a);
      var f;
      if (Object.prototype.toString.call(n) === "[object Array]") {
        var v = [];
        for (f in n)
          ({}).hasOwnProperty.call(n, f) && (v[f] = (0, d.default)(n[f]));
        return v.indexOf(a) >= 0;
      } else {
        if (t(n) === "object")
          return n.hasOwnProperty(a);
        if (n && typeof n.indexOf == "function")
          return n.indexOf(a) >= 0;
      }
      return !1;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Fr, Fr.exports)), Fr.exports;
}
var Br = { exports: {} }, en;
function nu() {
  return en || (en = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t) {
      (0, l.default)(t);
      for (var r = t.replace(/[- ]+/g, ""), a = 0, n, f, v, o = r.length - 1; o >= 0; o--)
        n = r.substring(o, o + 1), f = parseInt(n, 10), v ? (f *= 2, f >= 10 ? a += f % 10 + 1 : a += f) : a += f, v = !v;
      return !!(a % 10 === 0 && r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Br, Br.exports)), Br.exports;
}
var Nr = { exports: {} }, rn;
function Ui() {
  return rn || (rn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = a;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ nu());
    function i(n) {
      return n && n.__esModule ? n : { default: n };
    }
    var t = {
      amex: /^3[47][0-9]{13}$/,
      dinersclub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
      discover: /^6(?:011|5[0-9][0-9])[0-9]{12,15}$/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
      mastercard: /^5[1-5][0-9]{2}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/,
      // /^[25][1-7][0-9]{14}$/;
      unionpay: /^(6[27][0-9]{14}|^(81[0-9]{14,17}))$/,
      visa: /^(?:4[0-9]{12})(?:[0-9]{3,6})?$/
    }, r = (function() {
      var n = [];
      for (var f in t)
        t.hasOwnProperty(f) && n.push(t[f]);
      return n;
    })();
    function a(n) {
      var f = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      (0, l.default)(n);
      var v = f.provider, o = n.replace(/[- ]+/g, "");
      if (v && v.toLowerCase() in t) {
        if (!t[v.toLowerCase()].test(o))
          return !1;
      } else {
        if (v && !(v.toLowerCase() in t))
          throw new Error("".concat(v, " is not a valid credit card provider."));
        if (!r.some(function(s) {
          return s.test(o);
        }))
          return !1;
      }
      return (0, d.default)(n);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Nr, Nr.exports)), Nr.exports;
}
var Zr = { exports: {} }, tn;
function bi() {
  return tn || (tn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = r;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ Tt());
    function i(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var t = {
      PL: function(n) {
        (0, l.default)(n);
        var f = {
          1: 1,
          2: 3,
          3: 7,
          4: 9,
          5: 1,
          6: 3,
          7: 7,
          8: 9,
          9: 1,
          10: 3,
          11: 0
        };
        if (n != null && n.length === 11 && (0, d.default)(n, {
          allow_leading_zeroes: !0
        })) {
          var v = n.split("").slice(0, -1), o = v.reduce(function(S, h, g) {
            return S + Number(h) * f[g + 1];
          }, 0), s = o % 10, _ = Number(n.charAt(n.length - 1));
          if (s === 0 && _ === 0 || _ === 10 - s)
            return !0;
        }
        return !1;
      },
      ES: function(n) {
        (0, l.default)(n);
        var f = /^[0-9X-Z][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/, v = {
          X: 0,
          Y: 1,
          Z: 2
        }, o = ["T", "R", "W", "A", "G", "M", "Y", "F", "P", "D", "X", "B", "N", "J", "Z", "S", "Q", "V", "H", "L", "C", "K", "E"], s = n.trim().toUpperCase();
        if (!f.test(s))
          return !1;
        var _ = s.slice(0, -1).replace(/[X,Y,Z]/g, function(S) {
          return v[S];
        });
        return s.endsWith(o[_ % 23]);
      },
      FI: function(n) {
        if ((0, l.default)(n), n.length !== 11 || !n.match(/^\d{6}[\-A\+]\d{3}[0-9ABCDEFHJKLMNPRSTUVWXY]{1}$/))
          return !1;
        var f = "0123456789ABCDEFHJKLMNPRSTUVWXY", v = parseInt(n.slice(0, 6), 10) * 1e3 + parseInt(n.slice(7, 10), 10), o = v % 31, s = f[o];
        return s === n.slice(10, 11);
      },
      IN: function(n) {
        var f = /^[1-9]\d{3}\s?\d{4}\s?\d{4}$/, v = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], [2, 3, 4, 0, 1, 7, 8, 9, 5, 6], [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1], [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], [8, 7, 6, 5, 9, 3, 2, 1, 0, 4], [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]], o = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], [5, 8, 0, 3, 7, 9, 6, 1, 4, 2], [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1], [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]], s = n.trim();
        if (!f.test(s))
          return !1;
        var _ = 0, S = s.replace(/\s/g, "").split("").map(Number).reverse();
        return S.forEach(function(h, g) {
          _ = v[_][o[g % 8][h]];
        }), _ === 0;
      },
      IR: function(n) {
        if (!n.match(/^\d{10}$/) || (n = "0000".concat(n).slice(n.length - 6), parseInt(n.slice(3, 9), 10) === 0)) return !1;
        for (var f = parseInt(n.slice(9, 10), 10), v = 0, o = 0; o < 9; o++)
          v += parseInt(n.slice(o, o + 1), 10) * (10 - o);
        return v %= 11, v < 2 && f === v || v >= 2 && f === 11 - v;
      },
      IT: function(n) {
        return n.length !== 9 || n === "CA00000AA" ? !1 : n.search(/C[A-Z]\d{5}[A-Z]{2}/i) > -1;
      },
      NO: function(n) {
        var f = n.trim();
        if (isNaN(Number(f)) || f.length !== 11 || f === "00000000000") return !1;
        var v = f.split("").map(Number), o = (11 - (3 * v[0] + 7 * v[1] + 6 * v[2] + 1 * v[3] + 8 * v[4] + 9 * v[5] + 4 * v[6] + 5 * v[7] + 2 * v[8]) % 11) % 11, s = (11 - (5 * v[0] + 4 * v[1] + 3 * v[2] + 2 * v[3] + 7 * v[4] + 6 * v[5] + 5 * v[6] + 4 * v[7] + 3 * v[8] + 2 * o) % 11) % 11;
        return !(o !== v[9] || s !== v[10]);
      },
      TH: function(n) {
        if (!n.match(/^[1-8]\d{12}$/)) return !1;
        for (var f = 0, v = 0; v < 12; v++)
          f += parseInt(n[v], 10) * (13 - v);
        return n[12] === ((11 - f % 11) % 10).toString();
      },
      LK: function(n) {
        var f = /^[1-9]\d{8}[vx]$/i, v = /^[1-9]\d{11}$/i;
        return n.length === 10 && f.test(n) ? !0 : !!(n.length === 12 && v.test(n));
      },
      "he-IL": function(n) {
        var f = /^\d{9}$/, v = n.trim();
        if (!f.test(v))
          return !1;
        for (var o = v, s = 0, _, S = 0; S < o.length; S++)
          _ = Number(o[S]) * (S % 2 + 1), s += _ > 9 ? _ - 9 : _;
        return s % 10 === 0;
      },
      "ar-LY": function(n) {
        var f = /^(1|2)\d{11}$/, v = n.trim();
        return !!f.test(v);
      },
      "ar-TN": function(n) {
        var f = /^\d{8}$/, v = n.trim();
        return !!f.test(v);
      },
      "zh-CN": function(n) {
        var f = [
          "11",
          // 北京
          "12",
          // 天津
          "13",
          // 河北
          "14",
          // 山西
          "15",
          // 内蒙古
          "21",
          // 辽宁
          "22",
          // 吉林
          "23",
          // 黑龙江
          "31",
          // 上海
          "32",
          // 江苏
          "33",
          // 浙江
          "34",
          // 安徽
          "35",
          // 福建
          "36",
          // 江西
          "37",
          // 山东
          "41",
          // 河南
          "42",
          // 湖北
          "43",
          // 湖南
          "44",
          // 广东
          "45",
          // 广西
          "46",
          // 海南
          "50",
          // 重庆
          "51",
          // 四川
          "52",
          // 贵州
          "53",
          // 云南
          "54",
          // 西藏
          "61",
          // 陕西
          "62",
          // 甘肃
          "63",
          // 青海
          "64",
          // 宁夏
          "65",
          // 新疆
          "71",
          // 台湾
          "81",
          // 香港
          "82",
          // 澳门
          "91"
          // 国外
        ], v = ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"], o = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"], s = function($) {
          return f.includes($);
        }, _ = function($) {
          var E = parseInt($.substring(0, 4), 10), P = parseInt($.substring(4, 6), 10), L = parseInt($.substring(6), 10), F = new Date(E, P - 1, L);
          return F > /* @__PURE__ */ new Date() ? !1 : F.getFullYear() === E && F.getMonth() === P - 1 && F.getDate() === L;
        }, S = function($) {
          for (var E = $.substring(0, 17), P = 0, L = 0; L < 17; L++)
            P += parseInt(E.charAt(L), 10) * parseInt(v[L], 10);
          var F = P % 11;
          return o[F];
        }, h = function($) {
          return S($) === $.charAt(17).toUpperCase();
        }, g = function($) {
          var E = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test($);
          if (!E) return !1;
          var P = $.substring(0, 2);
          if (E = s(P), !E) return !1;
          var L = "19".concat($.substring(6, 12));
          return E = _(L), !!E;
        }, m = function($) {
          var E = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test($);
          if (!E) return !1;
          var P = $.substring(0, 2);
          if (E = s(P), !E) return !1;
          var L = $.substring(6, 14);
          return E = _(L), E ? h($) : !1;
        }, I = function($) {
          var E = /^\d{15}|(\d{17}(\d|x|X))$/.test($);
          return E ? $.length === 15 ? g($) : m($) : !1;
        };
        return I(n);
      },
      "zh-HK": function(n) {
        n = n.trim();
        var f = /^[A-Z]{1,2}[0-9]{6}((\([0-9A]\))|(\[[0-9A]\])|([0-9A]))$/, v = /^[0-9]$/;
        if (n = n.toUpperCase(), !f.test(n)) return !1;
        n = n.replace(/\[|\]|\(|\)/g, ""), n.length === 8 && (n = "3".concat(n));
        for (var o = 0, s = 0; s <= 7; s++) {
          var _ = void 0;
          v.test(n[s]) ? _ = n[s] : _ = (n[s].charCodeAt(0) - 55) % 11, o += _ * (9 - s);
        }
        o %= 11;
        var S;
        return o === 0 ? S = "0" : o === 1 ? S = "A" : S = String(11 - o), S === n[n.length - 1];
      },
      "zh-TW": function(n) {
        var f = {
          A: 10,
          B: 11,
          C: 12,
          D: 13,
          E: 14,
          F: 15,
          G: 16,
          H: 17,
          I: 34,
          J: 18,
          K: 19,
          L: 20,
          M: 21,
          N: 22,
          O: 35,
          P: 23,
          Q: 24,
          R: 25,
          S: 26,
          T: 27,
          U: 28,
          V: 29,
          W: 32,
          X: 30,
          Y: 31,
          Z: 33
        }, v = n.trim().toUpperCase();
        return /^[A-Z][0-9]{9}$/.test(v) ? Array.from(v).reduce(function(o, s, _) {
          if (_ === 0) {
            var S = f[s];
            return S % 10 * 9 + Math.floor(S / 10);
          }
          return _ === 9 ? (10 - o % 10 - Number(s)) % 10 === 0 : o + Number(s) * (9 - _);
        }, 0) : !1;
      }
    };
    function r(a, n) {
      if ((0, l.default)(a), n in t)
        return t[n](a);
      if (n === "any") {
        for (var f in t)
          if (t.hasOwnProperty(f)) {
            var v = t[f];
            if (v(a))
              return !0;
          }
        return !1;
      }
      throw new Error("Invalid locale '".concat(n, "'"));
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Zr, Zr.exports)), Zr.exports;
}
var Tr = { exports: {} }, an;
function Hi() {
  return an || (an = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = f;
    var l = d(/* @__PURE__ */ C());
    function d(v) {
      return v && v.__esModule ? v : { default: v };
    }
    var i = 8, t = 14, r = /^(\d{8}|\d{13}|\d{14})$/;
    function a(v, o) {
      return v === i || v === t ? o % 2 === 0 ? 3 : 1 : o % 2 === 0 ? 1 : 3;
    }
    function n(v) {
      var o = v.slice(0, -1).split("").map(function(_, S) {
        return Number(_) * a(v.length, S);
      }).reduce(function(_, S) {
        return _ + S;
      }, 0), s = 10 - o % 10;
      return s < 10 ? s : 0;
    }
    function f(v) {
      (0, l.default)(v);
      var o = Number(v.slice(-1));
      return r.test(v) && o === n(v);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Tr, Tr.exports)), Tr.exports;
}
var qr = { exports: {} }, nn;
function ki() {
  return nn || (nn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /^[A-Z]{2}[0-9A-Z]{9}[0-9]$/;
    function t(r) {
      if ((0, l.default)(r), !i.test(r))
        return !1;
      for (var a = !0, n = 0, f = r.length - 2; f >= 0; f--)
        if (r[f] >= "A" && r[f] <= "Z")
          for (var v = r[f].charCodeAt(0) - 55, o = v % 10, s = Math.trunc(v / 10), _ = 0, S = [o, s]; _ < S.length; _++) {
            var h = S[_];
            a ? h >= 5 ? n += 1 + (h - 5) * 2 : n += h * 2 : n += h, a = !a;
          }
        else {
          var g = r[f].charCodeAt(0) - 48;
          a ? g >= 5 ? n += 1 + (g - 5) * 2 : n += g * 2 : n += g, a = !a;
        }
      var m = Math.trunc((n + 9) / 10) * 10 - n;
      return +r[r.length - 1] === m;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(qr, qr.exports)), qr.exports;
}
var wr = { exports: {} }, un;
function Gi() {
  return un || (un = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = a;
    var l = d(/* @__PURE__ */ C());
    function d(n) {
      return n && n.__esModule ? n : { default: n };
    }
    var i = /^(?:[0-9]{9}X|[0-9]{10})$/, t = /^(?:[0-9]{13})$/, r = [1, 3];
    function a(n, f) {
      (0, l.default)(n);
      var v = String(f?.version || f);
      if (!(f != null && f.version || f))
        return a(n, {
          version: 10
        }) || a(n, {
          version: 13
        });
      var o = n.replace(/[\s-]+/g, ""), s = 0;
      if (v === "10") {
        if (!i.test(o))
          return !1;
        for (var _ = 0; _ < v - 1; _++)
          s += (_ + 1) * o.charAt(_);
        if (o.charAt(9) === "X" ? s += 100 : s += 10 * o.charAt(9), s % 11 === 0)
          return !0;
      } else if (v === "13") {
        if (!t.test(o))
          return !1;
        for (var S = 0; S < 12; S++)
          s += r[S % 2] * o.charAt(S);
        if (o.charAt(12) - (10 - s % 10) % 10 === 0)
          return !0;
      }
      return !1;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(wr, wr.exports)), wr.exports;
}
var Ur = { exports: {} }, sn;
function Wi() {
  return sn || (sn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = "^\\d{4}-?\\d{3}[\\dX]$";
    function t(r) {
      var a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      (0, l.default)(r);
      var n = i;
      if (n = a.require_hyphen ? n.replace("?", "") : n, n = a.case_sensitive ? new RegExp(n) : new RegExp(n, "i"), !n.test(r))
        return !1;
      for (var f = r.replace("-", "").toUpperCase(), v = 0, o = 0; o < f.length; o++) {
        var s = f[o];
        v += (s === "X" ? 10 : +s) * (8 - o);
      }
      return v % 11 === 0;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Ur, Ur.exports)), Ur.exports;
}
var br = { exports: {} }, te = {}, ln;
function uu() {
  if (ln) return te;
  ln = 1, Object.defineProperty(te, "__esModule", {
    value: !0
  }), te.iso7064Check = u, te.luhnCheck = e, te.reverseMultiplyAndSum = l, te.verhoeffCheck = d;
  function u(i) {
    for (var t = 10, r = 0; r < i.length - 1; r++)
      t = (parseInt(i[r], 10) + t) % 10 === 0 ? 20 % 11 : (parseInt(i[r], 10) + t) % 10 * 2 % 11;
    return t = t === 1 ? 0 : 11 - t, t === parseInt(i[10], 10);
  }
  function e(i) {
    for (var t = 0, r = !1, a = i.length - 1; a >= 0; a--) {
      if (r) {
        var n = parseInt(i[a], 10) * 2;
        n > 9 ? t += n.toString().split("").map(function(f) {
          return parseInt(f, 10);
        }).reduce(function(f, v) {
          return f + v;
        }, 0) : t += n;
      } else
        t += parseInt(i[a], 10);
      r = !r;
    }
    return t % 10 === 0;
  }
  function l(i, t) {
    for (var r = 0, a = 0; a < i.length; a++)
      r += i[a] * (t - a);
    return r;
  }
  function d(i) {
    for (var t = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], [2, 3, 4, 0, 1, 7, 8, 9, 5, 6], [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1], [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], [8, 7, 6, 5, 9, 3, 2, 1, 0, 4], [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]], r = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], [5, 8, 0, 3, 7, 9, 6, 1, 4, 2], [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1], [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]], a = i.split("").reverse().join(""), n = 0, f = 0; f < a.length; f++)
      n = t[n][r[f % 8][parseInt(a[f], 10)]];
    return n === 0;
  }
  return te;
}
var fn;
function Ki() {
  return fn || (fn = 1, (function(u, e) {
    function l(c) {
      "@babel/helpers - typeof";
      return l = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(p) {
        return typeof p;
      } : function(p) {
        return p && typeof Symbol == "function" && p.constructor === Symbol && p !== Symbol.prototype ? "symbol" : typeof p;
      }, l(c);
    }
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = Et;
    var d = n(/* @__PURE__ */ C()), i = a(/* @__PURE__ */ uu()), t = n(/* @__PURE__ */ Qn());
    function r(c) {
      if (typeof WeakMap != "function") return null;
      var p = /* @__PURE__ */ new WeakMap(), A = /* @__PURE__ */ new WeakMap();
      return (r = function(M) {
        return M ? A : p;
      })(c);
    }
    function a(c, p) {
      if (c && c.__esModule) return c;
      if (c === null || l(c) != "object" && typeof c != "function") return { default: c };
      var A = r(p);
      if (A && A.has(c)) return A.get(c);
      var y = { __proto__: null }, M = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var D in c) if (D !== "default" && {}.hasOwnProperty.call(c, D)) {
        var O = M ? Object.getOwnPropertyDescriptor(c, D) : null;
        O && (O.get || O.set) ? Object.defineProperty(y, D, O) : y[D] = c[D];
      }
      return y.default = c, A && A.set(c, y), y;
    }
    function n(c) {
      return c && c.__esModule ? c : { default: c };
    }
    function f(c) {
      return _(c) || s(c) || o(c) || v();
    }
    function v() {
      throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    function o(c, p) {
      if (c) {
        if (typeof c == "string") return S(c, p);
        var A = Object.prototype.toString.call(c).slice(8, -1);
        if (A === "Object" && c.constructor && (A = c.constructor.name), A === "Map" || A === "Set") return Array.from(c);
        if (A === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(A)) return S(c, p);
      }
    }
    function s(c) {
      if (typeof Symbol < "u" && c[Symbol.iterator] != null || c["@@iterator"] != null) return Array.from(c);
    }
    function _(c) {
      if (Array.isArray(c)) return S(c);
    }
    function S(c, p) {
      (p == null || p > c.length) && (p = c.length);
      for (var A = 0, y = new Array(p); A < p; A++) y[A] = c[A];
      return y;
    }
    function h(c) {
      var p = c.slice(0, 2), A = parseInt(c.slice(2, 4), 10);
      A > 40 ? (A -= 40, p = "20".concat(p)) : A > 20 ? (A -= 20, p = "18".concat(p)) : p = "19".concat(p), A < 10 && (A = "0".concat(A));
      var y = "".concat(p, "/").concat(A, "/").concat(c.slice(4, 6));
      if (!(0, t.default)(y, "YYYY/MM/DD"))
        return !1;
      for (var M = c.split("").map(function(T) {
        return parseInt(T, 10);
      }), D = [2, 4, 8, 5, 10, 9, 7, 3, 6], O = 0, N = 0; N < D.length; N++)
        O += M[N] * D[N];
      return O = O % 11 === 10 ? 0 : O % 11, O === M[9];
    }
    function g(c) {
      var p = c.split(""), A = p.filter(function(M, D) {
        return D % 2;
      }).map(function(M) {
        return Number(M) * 2;
      }).join("").split(""), y = p.filter(function(M, D) {
        return !(D % 2);
      }).concat(A).map(function(M) {
        return Number(M);
      }).reduce(function(M, D) {
        return M + D;
      });
      return y % 10 === 0;
    }
    function m(c) {
      c = c.replace(/\W/, "");
      var p = parseInt(c.slice(0, 2), 10);
      if (c.length === 10)
        p < 54 ? p = "20".concat(p) : p = "19".concat(p);
      else {
        if (c.slice(6) === "000")
          return !1;
        if (p < 54)
          p = "19".concat(p);
        else
          return !1;
      }
      p.length === 3 && (p = [p.slice(0, 2), "0", p.slice(2)].join(""));
      var A = parseInt(c.slice(2, 4), 10);
      if (A > 50 && (A -= 50), A > 20) {
        if (parseInt(p, 10) < 2004)
          return !1;
        A -= 20;
      }
      A < 10 && (A = "0".concat(A));
      var y = "".concat(p, "/").concat(A, "/").concat(c.slice(4, 6));
      if (!(0, t.default)(y, "YYYY/MM/DD"))
        return !1;
      if (c.length === 10 && parseInt(c, 10) % 11 !== 0) {
        var M = parseInt(c.slice(0, 9), 10) % 11;
        if (parseInt(p, 10) < 1986 && M === 10) {
          if (parseInt(c.slice(9), 10) !== 0)
            return !1;
        } else
          return !1;
      }
      return !0;
    }
    function I(c) {
      return i.luhnCheck(c);
    }
    function R(c) {
      for (var p = c.split("").map(function(T) {
        return parseInt(T, 10);
      }), A = [], y = 0; y < p.length - 1; y++) {
        A.push("");
        for (var M = 0; M < p.length - 1; M++)
          p[y] === p[M] && (A[y] += M);
      }
      if (A = A.filter(function(T) {
        return T.length > 1;
      }), A.length !== 2 && A.length !== 3)
        return !1;
      if (A[0].length === 3) {
        for (var D = A[0].split("").map(function(T) {
          return parseInt(T, 10);
        }), O = 0, N = 0; N < D.length - 1; N++)
          D[N] + 1 === D[N + 1] && (O += 1);
        if (O === 2)
          return !1;
      }
      return i.iso7064Check(c);
    }
    function $(c) {
      c = c.replace(/\W/, "");
      var p = parseInt(c.slice(4, 6), 10), A = c.slice(6, 7);
      switch (A) {
        case "0":
        case "1":
        case "2":
        case "3":
          p = "19".concat(p);
          break;
        case "4":
        case "9":
          p < 37 ? p = "20".concat(p) : p = "19".concat(p);
          break;
        default:
          if (p < 37)
            p = "20".concat(p);
          else if (p > 58)
            p = "18".concat(p);
          else
            return !1;
          break;
      }
      p.length === 3 && (p = [p.slice(0, 2), "0", p.slice(2)].join(""));
      var y = "".concat(p, "/").concat(c.slice(2, 4), "/").concat(c.slice(0, 2));
      if (!(0, t.default)(y, "YYYY/MM/DD"))
        return !1;
      for (var M = c.split("").map(function(T) {
        return parseInt(T, 10);
      }), D = 0, O = 4, N = 0; N < 9; N++)
        D += M[N] * O, O -= 1, O === 1 && (O = 7);
      return D %= 11, D === 1 ? !1 : D === 0 ? M[9] === 0 : M[9] === 11 - D;
    }
    function E(c) {
      for (var p = c.slice(0, 8).split("").map(function(D) {
        return parseInt(D, 10);
      }), A = 0, y = 1; y < p.length; y += 2)
        A += p[y];
      for (var M = 0; M < p.length; M += 2)
        p[M] < 2 ? A += 1 - p[M] : (A += 2 * (p[M] - 2) + 5, p[M] > 4 && (A += 2));
      return String.fromCharCode(A % 26 + 65) === c.charAt(8);
    }
    function P(c) {
      for (var p = c.split("").map(function(M) {
        return parseInt(M, 10);
      }), A = 0, y = 0; y < 8; y++)
        A += p[y] * Math.pow(2, 8 - y);
      return A % 11 % 10 === p[8];
    }
    function L(c) {
      var p = i.reverseMultiplyAndSum(c.split("").slice(0, 7).map(function(A) {
        return parseInt(A, 10);
      }), 8);
      return c.length === 9 && c[8] !== "W" && (p += (c[8].charCodeAt(0) - 64) * 9), p %= 23, p === 0 ? c[7].toUpperCase() === "W" : c[7].toUpperCase() === String.fromCharCode(64 + p);
    }
    var F = {
      andover: ["10", "12"],
      atlanta: ["60", "67"],
      austin: ["50", "53"],
      brookhaven: ["01", "02", "03", "04", "05", "06", "11", "13", "14", "16", "21", "22", "23", "25", "34", "51", "52", "54", "55", "56", "57", "58", "59", "65"],
      cincinnati: ["30", "32", "35", "36", "37", "38", "61"],
      fresno: ["15", "24"],
      internet: ["20", "26", "27", "45", "46", "47"],
      kansas: ["40", "44"],
      memphis: ["94", "95"],
      ogden: ["80", "90"],
      philadelphia: ["33", "39", "41", "42", "43", "46", "48", "62", "63", "64", "66", "68", "71", "72", "73", "74", "75", "76", "77", "81", "82", "83", "84", "85", "86", "87", "88", "91", "92", "93", "98", "99"],
      sba: ["31"]
    };
    function B() {
      var c = [];
      for (var p in F)
        F.hasOwnProperty(p) && c.push.apply(c, f(F[p]));
      return c;
    }
    function Z(c) {
      return B().indexOf(c.slice(0, 2)) !== -1;
    }
    function b(c) {
      for (var p = 0, A = c.split(""), y = parseInt(A.pop(), 10), M = 0; M < A.length; M++)
        p += A[9 - M] * (2 + M % 6);
      var D = 11 - p % 11;
      return D === 11 ? D = 0 : D === 10 && (D = 9), y === D;
    }
    function G(c) {
      var p = c.toUpperCase().split("");
      if (isNaN(parseInt(p[0], 10)) && p.length > 1) {
        var A = 0;
        switch (p[0]) {
          case "Y":
            A = 1;
            break;
          case "Z":
            A = 2;
            break;
        }
        p.splice(0, 1, A);
      } else
        for (; p.length < 9; )
          p.unshift(0);
      var y = ["T", "R", "W", "A", "G", "M", "Y", "F", "P", "D", "X", "B", "N", "J", "Z", "S", "Q", "V", "H", "L", "C", "K", "E"];
      p = p.join("");
      var M = parseInt(p.slice(0, 8), 10) % 23;
      return p[8] === y[M];
    }
    function W(c) {
      var p = c.slice(1, 3), A = c.slice(0, 1);
      switch (A) {
        case "1":
        case "2":
          p = "18".concat(p);
          break;
        case "3":
        case "4":
          p = "19".concat(p);
          break;
        default:
          p = "20".concat(p);
          break;
      }
      var y = "".concat(p, "/").concat(c.slice(3, 5), "/").concat(c.slice(5, 7));
      if (!(0, t.default)(y, "YYYY/MM/DD"))
        return !1;
      for (var M = c.split("").map(function(q) {
        return parseInt(q, 10);
      }), D = 0, O = 1, N = 0; N < 10; N++)
        D += M[N] * O, O += 1, O === 10 && (O = 1);
      if (D % 11 === 10) {
        D = 0, O = 3;
        for (var T = 0; T < 10; T++)
          D += M[T] * O, O += 1, O === 10 && (O = 1);
        if (D % 11 === 10)
          return M[10] === 0;
      }
      return D % 11 === M[10];
    }
    function z(c) {
      var p = c.slice(4, 6), A = c.slice(6, 7);
      switch (A) {
        case "+":
          p = "18".concat(p);
          break;
        case "-":
          p = "19".concat(p);
          break;
        default:
          p = "20".concat(p);
          break;
      }
      var y = "".concat(p, "/").concat(c.slice(2, 4), "/").concat(c.slice(0, 2));
      if (!(0, t.default)(y, "YYYY/MM/DD"))
        return !1;
      var M = parseInt(c.slice(0, 6) + c.slice(7, 10), 10) % 31;
      if (M < 10)
        return M === parseInt(c.slice(10), 10);
      M -= 10;
      var D = ["A", "B", "C", "D", "E", "F", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "U", "V", "W", "X", "Y"];
      return D[M] === c.slice(10);
    }
    function k(c) {
      if (c.slice(2, 4) !== "00" || c.slice(4, 6) !== "00") {
        var p = "".concat(c.slice(0, 2), "/").concat(c.slice(2, 4), "/").concat(c.slice(4, 6));
        if (!(0, t.default)(p, "YY/MM/DD"))
          return !1;
      }
      var A = 97 - parseInt(c.slice(0, 9), 10) % 97, y = parseInt(c.slice(9, 11), 10);
      return !(A !== y && (A = 97 - parseInt("2".concat(c.slice(0, 9)), 10) % 97, A !== y));
    }
    function Y(c) {
      c = c.replace(/\s/g, "");
      var p = parseInt(c.slice(0, 10), 10) % 511, A = parseInt(c.slice(10, 13), 10);
      return p === A;
    }
    function ht(c) {
      var p = "".concat(c.slice(0, 4), "/").concat(c.slice(4, 6), "/").concat(c.slice(6, 8));
      return !(0, t.default)(p, "YYYY/MM/DD") || !i.luhnCheck(c.slice(0, 12)) ? !1 : i.verhoeffCheck("".concat(c.slice(0, 11)).concat(c[12]));
    }
    function gt(c) {
      return i.iso7064Check(c);
    }
    function At(c) {
      for (var p = c.split("").map(function(M) {
        return parseInt(M, 10);
      }), A = 8, y = 1; y < 9; y++)
        A += p[y] * (y + 1);
      return A % 11 === p[9];
    }
    function Me(c) {
      for (var p = !1, A = !1, y = 0; y < 3; y++)
        if (!p && /[AEIOU]/.test(c[y]))
          p = !0;
        else if (!A && p && c[y] === "X")
          A = !0;
        else if (y > 0 && (p && !A && !/[AEIOU]/.test(c[y]) || A && !/X/.test(c[y])))
          return !1;
      return !0;
    }
    function ye(c) {
      var p = c.toUpperCase().split("");
      if (!Me(p.slice(0, 3)) || !Me(p.slice(3, 6)))
        return !1;
      for (var A = [6, 7, 9, 10, 12, 13, 14], y = {
        L: "0",
        M: "1",
        N: "2",
        P: "3",
        Q: "4",
        R: "5",
        S: "6",
        T: "7",
        U: "8",
        V: "9"
      }, M = 0, D = A; M < D.length; M++) {
        var O = D[M];
        p[O] in y && p.splice(O, 1, y[p[O]]);
      }
      var N = {
        A: "01",
        B: "02",
        C: "03",
        D: "04",
        E: "05",
        H: "06",
        L: "07",
        M: "08",
        P: "09",
        R: "10",
        S: "11",
        T: "12"
      }, T = N[p[8]], q = parseInt(p[9] + p[10], 10);
      q > 40 && (q -= 40), q < 10 && (q = "0".concat(q));
      var j = "".concat(p[6]).concat(p[7], "/").concat(T, "/").concat(q);
      if (!(0, t.default)(j, "YY/MM/DD"))
        return !1;
      for (var Q = 0, J = 1; J < p.length - 1; J += 2) {
        var Se = parseInt(p[J], 10);
        isNaN(Se) && (Se = p[J].charCodeAt(0) - 65), Q += Se;
      }
      for (var Ie = {
        // Maps of characters at odd places
        A: 1,
        B: 0,
        C: 5,
        D: 7,
        E: 9,
        F: 13,
        G: 15,
        H: 17,
        I: 19,
        J: 21,
        K: 2,
        L: 4,
        M: 18,
        N: 20,
        O: 11,
        P: 3,
        Q: 6,
        R: 8,
        S: 12,
        T: 14,
        U: 16,
        V: 10,
        W: 22,
        X: 25,
        Y: 24,
        Z: 23,
        0: 1,
        1: 0
      }, ee = 0; ee < p.length - 1; ee += 2) {
        var ne = 0;
        if (p[ee] in Ie)
          ne = Ie[p[ee]];
        else {
          var De = parseInt(p[ee], 10);
          ne = 2 * De + 1, De > 4 && (ne += 2);
        }
        Q += ne;
      }
      return String.fromCharCode(65 + Q % 26) === p[15];
    }
    function mt(c) {
      c = c.replace(/\W/, "");
      var p = c.slice(0, 2);
      if (p !== "32") {
        var A = c.slice(2, 4);
        if (A !== "00") {
          var y = c.slice(4, 6);
          switch (c[6]) {
            case "0":
              y = "18".concat(y);
              break;
            case "1":
              y = "19".concat(y);
              break;
            default:
              y = "20".concat(y);
              break;
          }
          var M = "".concat(y, "/").concat(c.slice(2, 4), "/").concat(p);
          if (!(0, t.default)(M, "YYYY/MM/DD"))
            return !1;
        }
        for (var D = 1101, O = [1, 6, 3, 7, 9, 10, 5, 8, 4, 2], N = 0; N < c.length - 1; N++)
          D -= parseInt(c[N], 10) * O[N];
        return parseInt(c[10], 10) === D % 11;
      }
      return !0;
    }
    function St(c) {
      if (c.length !== 9) {
        for (var p = c.toUpperCase().split(""); p.length < 8; )
          p.unshift(0);
        switch (c[7]) {
          case "A":
          case "P":
            if (parseInt(p[6], 10) === 0)
              return !1;
            break;
          default: {
            var A = parseInt(p.join("").slice(0, 5), 10);
            if (A > 32e3)
              return !1;
            var y = parseInt(p.join("").slice(5, 7), 10);
            if (A === y)
              return !1;
          }
        }
      }
      return !0;
    }
    function It(c) {
      return i.reverseMultiplyAndSum(c.split("").slice(0, 8).map(function(p) {
        return parseInt(p, 10);
      }), 9) % 11 === parseInt(c[8], 10);
    }
    function Rt(c) {
      if (c.length === 10) {
        for (var p = [6, 5, 7, 2, 3, 4, 5, 6, 7], A = 0, y = 0; y < p.length; y++)
          A += parseInt(c[y], 10) * p[y];
        return A %= 11, A === 10 ? !1 : A === parseInt(c[9], 10);
      }
      var M = c.slice(0, 2), D = parseInt(c.slice(2, 4), 10);
      D > 80 ? (M = "18".concat(M), D -= 80) : D > 60 ? (M = "22".concat(M), D -= 60) : D > 40 ? (M = "21".concat(M), D -= 40) : D > 20 ? (M = "20".concat(M), D -= 20) : M = "19".concat(M), D < 10 && (D = "0".concat(D));
      var O = "".concat(M, "/").concat(D, "/").concat(c.slice(4, 6));
      if (!(0, t.default)(O, "YYYY/MM/DD"))
        return !1;
      for (var N = 0, T = 1, q = 0; q < c.length - 1; q++)
        N += parseInt(c[q], 10) * T % 10, T += 2, T > 10 ? T = 1 : T === 5 && (T += 2);
      return N = 10 - N % 10, N === parseInt(c[10], 10);
    }
    function $t(c) {
      if (c.length === 11) {
        var p, A;
        if (p = 0, // Reject known invalid CPFs
        c === "11111111111" || c === "22222222222" || c === "33333333333" || c === "44444444444" || c === "55555555555" || c === "66666666666" || c === "77777777777" || c === "88888888888" || c === "99999999999" || c === "00000000000") return !1;
        for (var y = 1; y <= 9; y++) p += parseInt(c.substring(y - 1, y), 10) * (11 - y);
        if (A = p * 10 % 11, A === 10 && (A = 0), A !== parseInt(c.substring(9, 10), 10)) return !1;
        p = 0;
        for (var M = 1; M <= 10; M++) p += parseInt(c.substring(M - 1, M), 10) * (12 - M);
        return A = p * 10 % 11, A === 10 && (A = 0), A === parseInt(c.substring(10, 11), 10);
      }
      if (
        // Reject know invalid CNPJs
        c === "00000000000000" || c === "11111111111111" || c === "22222222222222" || c === "33333333333333" || c === "44444444444444" || c === "55555555555555" || c === "66666666666666" || c === "77777777777777" || c === "88888888888888" || c === "99999999999999"
      )
        return !1;
      for (var D = c.length - 2, O = c.substring(0, D), N = c.substring(D), T = 0, q = D - 7, j = D; j >= 1; j--)
        T += O.charAt(D - j) * q, q -= 1, q < 2 && (q = 9);
      var Q = T % 11 < 2 ? 0 : 11 - T % 11;
      if (Q !== parseInt(N.charAt(0), 10))
        return !1;
      D += 1, O = c.substring(0, D), T = 0, q = D - 7;
      for (var J = D; J >= 1; J--)
        T += O.charAt(D - J) * q, q -= 1, q < 2 && (q = 9);
      return Q = T % 11 < 2 ? 0 : 11 - T % 11, Q === parseInt(N.charAt(1), 10);
    }
    function Mt(c) {
      var p = 11 - i.reverseMultiplyAndSum(c.split("").slice(0, 8).map(function(A) {
        return parseInt(A, 10);
      }), 9) % 11;
      return p > 9 ? parseInt(c[8], 10) === 0 : p === parseInt(c[8], 10);
    }
    function yt(c) {
      if (c.slice(0, 4) !== "9000") {
        var p = c.slice(1, 3);
        switch (c[0]) {
          case "1":
          case "2":
            p = "19".concat(p);
            break;
          case "3":
          case "4":
            p = "18".concat(p);
            break;
          case "5":
          case "6":
            p = "20".concat(p);
            break;
        }
        var A = "".concat(p, "/").concat(c.slice(3, 5), "/").concat(c.slice(5, 7));
        if (A.length === 8) {
          if (!(0, t.default)(A, "YY/MM/DD"))
            return !1;
        } else if (!(0, t.default)(A, "YYYY/MM/DD"))
          return !1;
        for (var y = c.split("").map(function(N) {
          return parseInt(N, 10);
        }), M = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9], D = 0, O = 0; O < M.length; O++)
          D += y[O] * M[O];
        return D % 11 === 10 ? y[12] === 1 : y[12] === D % 11;
      }
      return !0;
    }
    function xt(c) {
      if (c.length === 9) {
        if (c = c.replace(/\W/, ""), c.slice(6) === "000")
          return !1;
        var p = parseInt(c.slice(0, 2), 10);
        if (p > 53)
          return !1;
        p < 10 ? p = "190".concat(p) : p = "19".concat(p);
        var A = parseInt(c.slice(2, 4), 10);
        A > 50 && (A -= 50), A < 10 && (A = "0".concat(A));
        var y = "".concat(p, "/").concat(A, "/").concat(c.slice(4, 6));
        if (!(0, t.default)(y, "YYYY/MM/DD"))
          return !1;
      }
      return !0;
    }
    function xe(c) {
      var p = 11 - i.reverseMultiplyAndSum(c.split("").slice(0, 7).map(function(A) {
        return parseInt(A, 10);
      }), 8) % 11;
      return p === 10 ? parseInt(c[7], 10) === 0 : p === parseInt(c[7], 10);
    }
    function Ct(c) {
      var p = c.slice(0);
      c.length > 11 && (p = p.slice(2));
      var A = "", y = p.slice(2, 4), M = parseInt(p.slice(4, 6), 10);
      if (c.length > 11)
        A = c.slice(0, 4);
      else if (A = c.slice(0, 2), c.length === 11 && M < 60) {
        var D = (/* @__PURE__ */ new Date()).getFullYear().toString(), O = parseInt(D.slice(0, 2), 10);
        if (D = parseInt(D, 10), c[6] === "-")
          parseInt("".concat(O).concat(A), 10) > D ? A = "".concat(O - 1).concat(A) : A = "".concat(O).concat(A);
        else if (A = "".concat(O - 1).concat(A), D - parseInt(A, 10) < 100)
          return !1;
      }
      M > 60 && (M -= 60), M < 10 && (M = "0".concat(M));
      var N = "".concat(A, "/").concat(y, "/").concat(M);
      if (N.length === 8) {
        if (!(0, t.default)(N, "YY/MM/DD"))
          return !1;
      } else if (!(0, t.default)(N, "YYYY/MM/DD"))
        return !1;
      return i.luhnCheck(c.replace(/\W/, ""));
    }
    function Dt(c) {
      for (var p = c.split("").map(function(D) {
        return parseInt(D, 10);
      }), A = [-1, 5, 7, 9, 4, 6, 10, 5, 7], y = 0, M = 0; M < A.length; M++)
        y += p[M] * A[M];
      return y % 11 === 10 ? p[9] === 0 : p[9] === y % 11;
    }
    var K = {
      "bg-BG": /^\d{10}$/,
      "cs-CZ": /^\d{6}\/{0,1}\d{3,4}$/,
      "de-AT": /^\d{9}$/,
      "de-DE": /^[1-9]\d{10}$/,
      "dk-DK": /^\d{6}-{0,1}\d{4}$/,
      "el-CY": /^[09]\d{7}[A-Z]$/,
      "el-GR": /^([0-4]|[7-9])\d{8}$/,
      "en-CA": /^\d{9}$/,
      "en-GB": /^\d{10}$|^(?!GB|NK|TN|ZZ)(?![DFIQUV])[A-Z](?![DFIQUVO])[A-Z]\d{6}[ABCD ]$/i,
      "en-IE": /^\d{7}[A-W][A-IW]{0,1}$/i,
      "en-US": /^\d{2}[- ]{0,1}\d{7}$/,
      "es-AR": /(20|23|24|27|30|33|34)[0-9]{8}[0-9]/,
      "es-ES": /^(\d{0,8}|[XYZKLM]\d{7})[A-HJ-NP-TV-Z]$/i,
      "et-EE": /^[1-6]\d{6}(00[1-9]|0[1-9][0-9]|[1-6][0-9]{2}|70[0-9]|710)\d$/,
      "fi-FI": /^\d{6}[-+A]\d{3}[0-9A-FHJ-NPR-Y]$/i,
      "fr-BE": /^\d{11}$/,
      "fr-FR": /^[0-3]\d{12}$|^[0-3]\d\s\d{2}(\s\d{3}){3}$/,
      // Conforms both to official spec and provided example
      "fr-LU": /^\d{13}$/,
      "hr-HR": /^\d{11}$/,
      "hu-HU": /^8\d{9}$/,
      "it-IT": /^[A-Z]{6}[L-NP-V0-9]{2}[A-EHLMPRST][L-NP-V0-9]{2}[A-ILMZ][L-NP-V0-9]{3}[A-Z]$/i,
      "lv-LV": /^\d{6}-{0,1}\d{5}$/,
      // Conforms both to DG TAXUD spec and original research
      "mt-MT": /^\d{3,7}[APMGLHBZ]$|^([1-8])\1\d{7}$/i,
      "nl-NL": /^\d{9}$/,
      "pl-PL": /^\d{10,11}$/,
      "pt-BR": /(?:^\d{11}$)|(?:^\d{14}$)/,
      "pt-PT": /^\d{9}$/,
      "ro-RO": /^\d{13}$/,
      "sk-SK": /^\d{6}\/{0,1}\d{3,4}$/,
      "sl-SI": /^[1-9]\d{7}$/,
      "sv-SE": /^(\d{6}[-+]{0,1}\d{4}|(18|19|20)\d{6}[-+]{0,1}\d{4})$/,
      "uk-UA": /^\d{10}$/
    };
    K["lb-LU"] = K["fr-LU"], K["lt-LT"] = K["et-EE"], K["nl-BE"] = K["fr-BE"], K["fr-CA"] = K["en-CA"];
    var V = {
      "bg-BG": h,
      "cs-CZ": m,
      "de-AT": I,
      "de-DE": R,
      "dk-DK": $,
      "el-CY": E,
      "el-GR": P,
      "en-CA": g,
      "en-IE": L,
      "en-US": Z,
      "es-AR": b,
      "es-ES": G,
      "et-EE": W,
      "fi-FI": z,
      "fr-BE": k,
      "fr-FR": Y,
      "fr-LU": ht,
      "hr-HR": gt,
      "hu-HU": At,
      "it-IT": ye,
      "lv-LV": mt,
      "mt-MT": St,
      "nl-NL": It,
      "pl-PL": Rt,
      "pt-BR": $t,
      "pt-PT": Mt,
      "ro-RO": yt,
      "sk-SK": xt,
      "sl-SI": xe,
      "sv-SE": Ct,
      "uk-UA": Dt
    };
    V["lb-LU"] = V["fr-LU"], V["lt-LT"] = V["et-EE"], V["nl-BE"] = V["fr-BE"], V["fr-CA"] = V["en-CA"];
    var Ce = /[-\\\/!@#$%\^&\*\(\)\+\=\[\]]+/g, ae = {
      "de-AT": Ce,
      "de-DE": /[\/\\]/g,
      "fr-BE": Ce
    };
    ae["nl-BE"] = ae["fr-BE"];
    function Et(c) {
      var p = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "en-US";
      (0, d.default)(c);
      var A = c.slice(0);
      if (p in K)
        return p in ae && (A = A.replace(ae[p], "")), K[p].test(A) ? p in V ? V[p](A) : !0 : !1;
      throw new Error("Invalid locale '".concat(p, "'"));
    }
    u.exports = e.default, u.exports.default = e.default;
  })(br, br.exports)), br.exports;
}
var _e = {}, on;
function Vi() {
  if (on) return _e;
  on = 1, Object.defineProperty(_e, "__esModule", {
    value: !0
  }), _e.default = d, _e.locales = void 0;
  var u = e(/* @__PURE__ */ C());
  function e(i) {
    return i && i.__esModule ? i : { default: i };
  }
  var l = {
    "am-AM": /^(\+?374|0)(33|4[134]|55|77|88|9[13-689])\d{6}$/,
    "ar-AE": /^((\+?971)|0)?5[024568]\d{7}$/,
    "ar-BH": /^(\+?973)?(3|6)\d{7}$/,
    "ar-DZ": /^(\+?213|0)(5|6|7)\d{8}$/,
    "ar-LB": /^(\+?961)?((3|81)\d{6}|7\d{7})$/,
    "ar-EG": /^((\+?20)|0)?1[0125]\d{8}$/,
    "ar-IQ": /^(\+?964|0)?7[0-9]\d{8}$/,
    "ar-JO": /^(\+?962|0)?7[789]\d{7}$/,
    "ar-KW": /^(\+?965)([569]\d{7}|41\d{6})$/,
    "ar-LY": /^((\+?218)|0)?(9[1-6]\d{7}|[1-8]\d{7,9})$/,
    "ar-MA": /^(?:(?:\+|00)212|0)[5-7]\d{8}$/,
    "ar-OM": /^((\+|00)968)?(9[1-9])\d{6}$/,
    "ar-PS": /^(\+?970|0)5[6|9](\d{7})$/,
    "ar-SA": /^(!?(\+?966)|0)?5\d{8}$/,
    "ar-SD": /^((\+?249)|0)?(9[012369]|1[012])\d{7}$/,
    "ar-SY": /^(!?(\+?963)|0)?9\d{8}$/,
    "ar-TN": /^(\+?216)?[2459]\d{7}$/,
    "az-AZ": /^(\+994|0)(10|5[015]|7[07]|99)\d{7}$/,
    "bs-BA": /^((((\+|00)3876)|06))((([0-3]|[5-6])\d{6})|(4\d{7}))$/,
    "be-BY": /^(\+?375)?(24|25|29|33|44)\d{7}$/,
    "bg-BG": /^(\+?359|0)?8[789]\d{7}$/,
    "bn-BD": /^(\+?880|0)1[13456789][0-9]{8}$/,
    "ca-AD": /^(\+376)?[346]\d{5}$/,
    "cs-CZ": /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
    "da-DK": /^(\+?45)?\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
    "de-DE": /^((\+49|0)1)(5[0-25-9]\d|6([23]|0\d?)|7([0-57-9]|6\d))\d{7,9}$/,
    "de-AT": /^(\+43|0)\d{1,4}\d{3,12}$/,
    "de-CH": /^(\+41|0)([1-9])\d{1,9}$/,
    "de-LU": /^(\+352)?((6\d1)\d{6})$/,
    "dv-MV": /^(\+?960)?(7[2-9]|9[1-9])\d{5}$/,
    "el-GR": /^(\+?30|0)?6(8[5-9]|9(?![26])[0-9])\d{7}$/,
    "el-CY": /^(\+?357?)?(9(9|6)\d{6})$/,
    "en-AI": /^(\+?1|0)264(?:2(35|92)|4(?:6[1-2]|76|97)|5(?:3[6-9]|8[1-4])|7(?:2(4|9)|72))\d{4}$/,
    "en-AU": /^(\+?61|0)4\d{8}$/,
    "en-AG": /^(?:\+1|1)268(?:464|7(?:1[3-9]|[28]\d|3[0246]|64|7[0-689]))\d{4}$/,
    "en-BM": /^(\+?1)?441(((3|7)\d{6}$)|(5[0-3][0-9]\d{4}$)|(59\d{5}$))/,
    "en-BS": /^(\+?1[-\s]?|0)?\(?242\)?[-\s]?\d{3}[-\s]?\d{4}$/,
    "en-GB": /^(\+?44|0)7\d{9}$/,
    "en-GG": /^(\+?44|0)1481\d{6}$/,
    "en-GH": /^(\+233|0)(20|50|24|54|27|57|26|56|23|28|55|59)\d{7}$/,
    "en-GY": /^(\+592|0)6\d{6}$/,
    "en-HK": /^(\+?852[-\s]?)?[456789]\d{3}[-\s]?\d{4}$/,
    "en-MO": /^(\+?853[-\s]?)?[6]\d{3}[-\s]?\d{4}$/,
    "en-IE": /^(\+?353|0)8[356789]\d{7}$/,
    "en-IN": /^(\+?91|0)?[6789]\d{9}$/,
    "en-JM": /^(\+?876)?\d{7}$/,
    "en-KE": /^(\+?254|0)(7|1)\d{8}$/,
    "fr-CF": /^(\+?236| ?)(70|75|77|72|21|22)\d{6}$/,
    "en-SS": /^(\+?211|0)(9[1257])\d{7}$/,
    "en-KI": /^((\+686|686)?)?( )?((6|7)(2|3|8)[0-9]{6})$/,
    "en-KN": /^(?:\+1|1)869(?:46\d|48[89]|55[6-8]|66\d|76[02-7])\d{4}$/,
    "en-LS": /^(\+?266)(22|28|57|58|59|27|52)\d{6}$/,
    "en-MT": /^(\+?356|0)?(99|79|77|21|27|22|25)[0-9]{6}$/,
    "en-MU": /^(\+?230|0)?\d{8}$/,
    "en-MW": /^(\+?265|0)(((77|88|31|99|98|21)\d{7})|(((111)|1)\d{6})|(32000\d{4}))$/,
    "en-NA": /^(\+?264|0)(6|8)\d{7}$/,
    "en-NG": /^(\+?234|0)?[789]\d{9}$/,
    "en-NZ": /^(\+?64|0)[28]\d{7,9}$/,
    "en-PG": /^(\+?675|0)?(7\d|8[18])\d{6}$/,
    "en-PK": /^((00|\+)?92|0)3[0-6]\d{8}$/,
    "en-PH": /^(09|\+639)\d{9}$/,
    "en-RW": /^(\+?250|0)?[7]\d{8}$/,
    "en-SG": /^(\+65)?[3689]\d{7}$/,
    "en-SL": /^(\+?232|0)\d{8}$/,
    "en-TZ": /^(\+?255|0)?[67]\d{8}$/,
    "en-UG": /^(\+?256|0)?[7]\d{8}$/,
    "en-US": /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,
    "en-ZA": /^(\+?27|0)\d{9}$/,
    "en-ZM": /^(\+?26)?09[567]\d{7}$/,
    "en-ZW": /^(\+263)[0-9]{9}$/,
    "en-BW": /^(\+?267)?(7[1-8]{1})\d{6}$/,
    "es-AR": /^\+?549(11|[2368]\d)\d{8}$/,
    "es-BO": /^(\+?591)?(6|7)\d{7}$/,
    "es-CO": /^(\+?57)?3(0(0|1|2|4|5)|1\d|2[0-4]|5(0|1))\d{7}$/,
    "es-CL": /^(\+?56|0)[2-9]\d{1}\d{7}$/,
    "es-CR": /^(\+506)?[2-8]\d{7}$/,
    "es-CU": /^(\+53|0053)?5\d{7}$/,
    "es-DO": /^(\+?1)?8[024]9\d{7}$/,
    "es-HN": /^(\+?504)?[9|8|3|2]\d{7}$/,
    "es-EC": /^(\+?593|0)([2-7]|9[2-9])\d{7}$/,
    "es-ES": /^(\+?34)?[6|7]\d{8}$/,
    "es-PE": /^(\+?51)?9\d{8}$/,
    "es-MX": /^(\+?52)?(1|01)?\d{10,11}$/,
    "es-NI": /^(\+?505)\d{7,8}$/,
    "es-PA": /^(\+?507)\d{7,8}$/,
    "es-PY": /^(\+?595|0)9[9876]\d{7}$/,
    "es-SV": /^(\+?503)?[67]\d{7}$/,
    "es-UY": /^(\+598|0)9[1-9][\d]{6}$/,
    "es-VE": /^(\+?58)?(2|4)\d{9}$/,
    "et-EE": /^(\+?372)?\s?(5|8[1-4])\s?([0-9]\s?){6,7}$/,
    "fa-IR": /^(\+?98[\-\s]?|0)9[0-39]\d[\-\s]?\d{3}[\-\s]?\d{4}$/,
    "fi-FI": /^(\+?358|0)\s?(4[0-6]|50)\s?(\d\s?){4,8}$/,
    "fj-FJ": /^(\+?679)?\s?\d{3}\s?\d{4}$/,
    "fo-FO": /^(\+?298)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
    "fr-BF": /^(\+226|0)[67]\d{7}$/,
    "fr-BJ": /^(\+229)\d{8}$/,
    "fr-CD": /^(\+?243|0)?(8|9)\d{8}$/,
    "fr-CM": /^(\+?237)6[0-9]{8}$/,
    "fr-FR": /^(\+?33|0)[67]\d{8}$/,
    "fr-GF": /^(\+?594|0|00594)[67]\d{8}$/,
    "fr-GP": /^(\+?590|0|00590)[67]\d{8}$/,
    "fr-MQ": /^(\+?596|0|00596)[67]\d{8}$/,
    "fr-PF": /^(\+?689)?8[789]\d{6}$/,
    "fr-RE": /^(\+?262|0|00262)[67]\d{8}$/,
    "fr-WF": /^(\+681)?\d{6}$/,
    "he-IL": /^(\+972|0)([23489]|5[012345689]|77)[1-9]\d{6}$/,
    "hu-HU": /^(\+?36|06)(20|30|31|50|70)\d{7}$/,
    "id-ID": /^(\+?62|0)8(1[123456789]|2[1238]|3[1238]|5[12356789]|7[78]|9[56789]|8[123456789])([\s?|\d]{5,11})$/,
    "ir-IR": /^(\+98|0)?9\d{9}$/,
    "it-IT": /^(\+?39)?\s?3\d{2} ?\d{6,7}$/,
    "it-SM": /^((\+378)|(0549)|(\+390549)|(\+3780549))?6\d{5,9}$/,
    "ja-JP": /^(\+81[ \-]?(\(0\))?|0)[6789]0[ \-]?\d{4}[ \-]?\d{4}$/,
    "ka-GE": /^(\+?995)?(79\d{7}|5\d{8})$/,
    "kk-KZ": /^(\+?7|8)?7\d{9}$/,
    "kl-GL": /^(\+?299)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
    "ko-KR": /^((\+?82)[ \-]?)?0?1([0|1|6|7|8|9]{1})[ \-]?\d{3,4}[ \-]?\d{4}$/,
    "ky-KG": /^(\+?7\s?\+?7|0)\s?\d{2}\s?\d{3}\s?\d{4}$/,
    "lt-LT": /^(\+370|8)\d{8}$/,
    "lv-LV": /^(\+?371)2\d{7}$/,
    "mg-MG": /^((\+?261|0)(2|3)\d)?\d{7}$/,
    "mn-MN": /^(\+|00|011)?976(77|81|88|91|94|95|96|99)\d{6}$/,
    "my-MM": /^(\+?959|09|9)(2[5-7]|3[1-2]|4[0-5]|6[6-9]|7[5-9]|9[6-9])[0-9]{7}$/,
    "ms-MY": /^(\+?60|0)1(([0145](-|\s)?\d{7,8})|([236-9](-|\s)?\d{7}))$/,
    "mz-MZ": /^(\+?258)?8[234567]\d{7}$/,
    "nb-NO": /^(\+?47)?[49]\d{7}$/,
    "ne-NP": /^(\+?977)?9[78]\d{8}$/,
    "nl-BE": /^(\+?32|0)4\d{8}$/,
    "nl-NL": /^(((\+|00)?31\(0\))|((\+|00)?31)|0)6{1}\d{8}$/,
    "nl-AW": /^(\+)?297(56|59|64|73|74|99)\d{5}$/,
    "nn-NO": /^(\+?47)?[49]\d{7}$/,
    "pl-PL": /^(\+?48)? ?([5-8]\d|45) ?\d{3} ?\d{2} ?\d{2}$/,
    "pt-BR": /^((\+?55\ ?[1-9]{2}\ ?)|(\+?55\ ?\([1-9]{2}\)\ ?)|(0[1-9]{2}\ ?)|(\([1-9]{2}\)\ ?)|([1-9]{2}\ ?))((\d{4}\-?\d{4})|(9[1-9]{1}\d{3}\-?\d{4}))$/,
    "pt-PT": /^(\+?351)?9[1236]\d{7}$/,
    "pt-AO": /^(\+244)\d{9}$/,
    "ro-MD": /^(\+?373|0)((6(0|1|2|6|7|8|9))|(7(6|7|8|9)))\d{6}$/,
    "ro-RO": /^(\+?40|0)\s?7\d{2}(\/|\s|\.|-)?\d{3}(\s|\.|-)?\d{3}$/,
    "ru-RU": /^(\+?7|8)?9\d{9}$/,
    "si-LK": /^(?:0|94|\+94)?(7(0|1|2|4|5|6|7|8)( |-)?)\d{7}$/,
    "sl-SI": /^(\+386\s?|0)(\d{1}\s?\d{3}\s?\d{2}\s?\d{2}|\d{2}\s?\d{3}\s?\d{3})$/,
    "sk-SK": /^(\+?421)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
    "so-SO": /^(\+?252|0)((6[0-9])\d{7}|(7[1-9])\d{7})$/,
    "sq-AL": /^(\+355|0)6[789]\d{6}$/,
    "sr-RS": /^(\+3816|06)[- \d]{5,9}$/,
    "sv-SE": /^(\+?46|0)[\s\-]?7[\s\-]?[02369]([\s\-]?\d){7}$/,
    "tg-TJ": /^(\+?992)?[5][5]\d{7}$/,
    "th-TH": /^(\+66|66|0)\d{9}$/,
    "tr-TR": /^(\+?90|0)?5\d{9}$/,
    "tk-TM": /^(\+993|993|8)\d{8}$/,
    "uk-UA": /^(\+?38|8)?0\d{9}$/,
    "uz-UZ": /^(\+?998)?(6[125-79]|7[1-69]|88|9\d)\d{7}$/,
    "vi-VN": /^((\+?84)|0)((3([2-9]))|(5([25689]))|(7([0|6-9]))|(8([1-9]))|(9([0-9])))([0-9]{7})$/,
    "zh-CN": /^((\+|00)86)?(1[3-9]|9[28])\d{9}$/,
    "zh-TW": /^(\+?886\-?|0)?9\d{8}$/,
    "dz-BT": /^(\+?975|0)?(17|16|77|02)\d{6}$/,
    "ar-YE": /^(((\+|00)9677|0?7)[0137]\d{7}|((\+|00)967|0)[1-7]\d{6})$/,
    "ar-EH": /^(\+?212|0)[\s\-]?(5288|5289)[\s\-]?\d{5}$/,
    "fa-AF": /^(\+93|0)?(2{1}[0-8]{1}|[3-5]{1}[0-4]{1})(\d{7})$/
  };
  l["en-CA"] = l["en-US"], l["fr-CA"] = l["en-CA"], l["fr-BE"] = l["nl-BE"], l["zh-HK"] = l["en-HK"], l["zh-MO"] = l["en-MO"], l["ga-IE"] = l["en-IE"], l["fr-CH"] = l["de-CH"], l["it-CH"] = l["fr-CH"];
  function d(i, t, r) {
    if ((0, u.default)(i), r && r.strictMode && !i.startsWith("+"))
      return !1;
    if (Array.isArray(t))
      return t.some(function(f) {
        if (l.hasOwnProperty(f)) {
          var v = l[f];
          if (v.test(i))
            return !0;
        }
        return !1;
      });
    if (t in l)
      return l[t].test(i);
    if (!t || t === "any") {
      for (var a in l)
        if (l.hasOwnProperty(a)) {
          var n = l[a];
          if (n.test(i))
            return !0;
        }
      return !1;
    }
    throw new Error("Invalid locale '".concat(t, "'"));
  }
  return _e.locales = Object.keys(l), _e;
}
var Hr = { exports: {} }, dn;
function Yi() {
  return dn || (dn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /^(0x)[0-9a-f]{40}$/i;
    function t(r) {
      return (0, l.default)(r), i.test(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Hr, Hr.exports)), Hr.exports;
}
var kr = { exports: {} }, cn;
function zi() {
  return cn || (cn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = a;
    var l = i(/* @__PURE__ */ H()), d = i(/* @__PURE__ */ C());
    function i(n) {
      return n && n.__esModule ? n : { default: n };
    }
    function t(n) {
      var f = "\\d{".concat(n.digits_after_decimal[0], "}");
      n.digits_after_decimal.forEach(function(I, R) {
        R !== 0 && (f = "".concat(f, "|\\d{").concat(I, "}"));
      });
      var v = "(".concat(n.symbol.replace(/\W/, function(I) {
        return "\\".concat(I);
      }), ")").concat(n.require_symbol ? "" : "?"), o = "-?", s = "[1-9]\\d*", _ = "[1-9]\\d{0,2}(\\".concat(n.thousands_separator, "\\d{3})*"), S = ["0", s, _], h = "(".concat(S.join("|"), ")?"), g = "(\\".concat(n.decimal_separator, "(").concat(f, "))").concat(n.require_decimal ? "" : "?"), m = h + (n.allow_decimal || n.require_decimal ? g : "");
      return n.allow_negatives && !n.parens_for_negatives && (n.negative_sign_after_digits ? m += o : n.negative_sign_before_digits && (m = o + m)), n.allow_negative_sign_placeholder ? m = "( (?!\\-))?".concat(m) : n.allow_space_after_symbol ? m = " ?".concat(m) : n.allow_space_after_digits && (m += "( (?!$))?"), n.symbol_after_digits ? m += v : m = v + m, n.allow_negatives && (n.parens_for_negatives ? m = "(\\(".concat(m, "\\)|").concat(m, ")") : n.negative_sign_before_digits || n.negative_sign_after_digits || (m = o + m)), new RegExp("^(?!-? )(?=.*\\d)".concat(m, "$"));
    }
    var r = {
      symbol: "$",
      require_symbol: !1,
      allow_space_after_symbol: !1,
      symbol_after_digits: !1,
      allow_negatives: !0,
      parens_for_negatives: !1,
      negative_sign_before_digits: !1,
      negative_sign_after_digits: !1,
      allow_negative_sign_placeholder: !1,
      thousands_separator: ",",
      decimal_separator: ".",
      allow_decimal: !0,
      require_decimal: !1,
      digits_after_decimal: [2],
      allow_space_after_digits: !1
    };
    function a(n, f) {
      return (0, d.default)(n), f = (0, l.default)(f, r), t(f).test(n);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(kr, kr.exports)), kr.exports;
}
var Gr = { exports: {} }, vn;
function Ji() {
  return vn || (vn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = r;
    var l = d(/* @__PURE__ */ C());
    function d(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var i = /^(bc1)[a-z0-9]{25,39}$/, t = /^(1|3)[A-HJ-NP-Za-km-z1-9]{25,39}$/;
    function r(a) {
      return (0, l.default)(a), i.test(a) || t.test(a);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Gr, Gr.exports)), Gr.exports;
}
var he = {}, pn;
function Xi() {
  if (pn) return he;
  pn = 1, Object.defineProperty(he, "__esModule", {
    value: !0
  }), he.isFreightContainerID = void 0, he.isISO6346 = i;
  var u = e(/* @__PURE__ */ C());
  function e(t) {
    return t && t.__esModule ? t : { default: t };
  }
  var l = /^[A-Z]{3}(U[0-9]{7})|([J,Z][0-9]{6,7})$/, d = /^[0-9]$/;
  function i(t) {
    if ((0, u.default)(t), t = t.toUpperCase(), !l.test(t)) return !1;
    if (t.length === 11) {
      for (var r = 0, a = 0; a < t.length - 1; a++)
        if (d.test(t[a]))
          r += t[a] * Math.pow(2, a);
        else {
          var n = void 0, f = t.charCodeAt(a) - 55;
          f < 11 ? n = f : f >= 11 && f <= 20 ? n = 12 + f % 11 : f >= 21 && f <= 30 ? n = 23 + f % 21 : n = 34 + f % 31, r += n * Math.pow(2, a);
        }
      var v = r % 11;
      return Number(t[t.length - 1]) === v;
    }
    return !0;
  }
  return he.isFreightContainerID = i, he;
}
var Wr = { exports: {} }, _n;
function Qi() {
  return _n || (_n = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /* @__PURE__ */ new Set(["aa", "ab", "ae", "af", "ak", "am", "an", "ar", "as", "av", "ay", "az", "az", "ba", "be", "bg", "bh", "bi", "bm", "bn", "bo", "br", "bs", "ca", "ce", "ch", "co", "cr", "cs", "cu", "cv", "cy", "da", "de", "dv", "dz", "ee", "el", "en", "eo", "es", "et", "eu", "fa", "ff", "fi", "fj", "fo", "fr", "fy", "ga", "gd", "gl", "gn", "gu", "gv", "ha", "he", "hi", "ho", "hr", "ht", "hu", "hy", "hz", "ia", "id", "ie", "ig", "ii", "ik", "io", "is", "it", "iu", "ja", "jv", "ka", "kg", "ki", "kj", "kk", "kl", "km", "kn", "ko", "kr", "ks", "ku", "kv", "kw", "ky", "la", "lb", "lg", "li", "ln", "lo", "lt", "lu", "lv", "mg", "mh", "mi", "mk", "ml", "mn", "mr", "ms", "mt", "my", "na", "nb", "nd", "ne", "ng", "nl", "nn", "no", "nr", "nv", "ny", "oc", "oj", "om", "or", "os", "pa", "pi", "pl", "ps", "pt", "qu", "rm", "rn", "ro", "ru", "rw", "sa", "sc", "sd", "se", "sg", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "ss", "st", "su", "sv", "sw", "ta", "te", "tg", "th", "ti", "tk", "tl", "tn", "to", "tr", "ts", "tt", "tw", "ty", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "wo", "xh", "yi", "yo", "za", "zh", "zu"]);
    function t(r) {
      return (0, l.default)(r), i.has(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Wr, Wr.exports)), Wr.exports;
}
var Kr = { exports: {} }, hn;
function ji() {
  return hn || (hn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = a;
    var l = d(/* @__PURE__ */ C());
    function d(n) {
      return n && n.__esModule ? n : { default: n };
    }
    var i = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/, t = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/, r = function(f) {
      var v = f.match(/^(\d{4})-?(\d{3})([ T]{1}\.*|$)/);
      if (v) {
        var o = Number(v[1]), s = Number(v[2]);
        return o % 4 === 0 && o % 100 !== 0 || o % 400 === 0 ? s <= 366 : s <= 365;
      }
      var _ = f.match(/(\d{4})-?(\d{0,2})-?(\d*)/).map(Number), S = _[1], h = _[2], g = _[3], m = h && "0".concat(h).slice(-2), I = g && "0".concat(g).slice(-2), R = new Date("".concat(S, "-").concat(m || "01", "-").concat(I || "01"));
      return h && g ? R.getUTCFullYear() === S && R.getUTCMonth() + 1 === h && R.getUTCDate() === g : !0;
    };
    function a(n) {
      var f = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      (0, l.default)(n);
      var v = f.strictSeparator ? t.test(n) : i.test(n);
      return v && f.strict ? r(n) : v;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Kr, Kr.exports)), Kr.exports;
}
var Vr = { exports: {} }, gn;
function es() {
  return gn || (gn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = m;
    var l = d(/* @__PURE__ */ C());
    function d(I) {
      return I && I.__esModule ? I : { default: I };
    }
    var i = /[0-9]{4}/, t = /(0[1-9]|1[0-2])/, r = /([12]\d|0[1-9]|3[01])/, a = /([01][0-9]|2[0-3])/, n = /[0-5][0-9]/, f = /([0-5][0-9]|60)/, v = /(\.[0-9]+)?/, o = new RegExp("[-+]".concat(a.source, ":").concat(n.source)), s = new RegExp("([zZ]|".concat(o.source, ")")), _ = new RegExp("".concat(a.source, ":").concat(n.source, ":").concat(f.source).concat(v.source)), S = new RegExp("".concat(i.source, "-").concat(t.source, "-").concat(r.source)), h = new RegExp("".concat(_.source).concat(s.source)), g = new RegExp("^".concat(S.source, "[ tT]").concat(h.source, "$"));
    function m(I) {
      return (0, l.default)(I), g.test(I);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Vr, Vr.exports)), Vr.exports;
}
var Yr = { exports: {} }, An;
function rs() {
  return An || (An = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /* @__PURE__ */ new Set(["AFG", "ALA", "ALB", "DZA", "ASM", "AND", "AGO", "AIA", "ATA", "ATG", "ARG", "ARM", "ABW", "AUS", "AUT", "AZE", "BHS", "BHR", "BGD", "BRB", "BLR", "BEL", "BLZ", "BEN", "BMU", "BTN", "BOL", "BES", "BIH", "BWA", "BVT", "BRA", "IOT", "BRN", "BGR", "BFA", "BDI", "KHM", "CMR", "CAN", "CPV", "CYM", "CAF", "TCD", "CHL", "CHN", "CXR", "CCK", "COL", "COM", "COG", "COD", "COK", "CRI", "CIV", "HRV", "CUB", "CUW", "CYP", "CZE", "DNK", "DJI", "DMA", "DOM", "ECU", "EGY", "SLV", "GNQ", "ERI", "EST", "ETH", "FLK", "FRO", "FJI", "FIN", "FRA", "GUF", "PYF", "ATF", "GAB", "GMB", "GEO", "DEU", "GHA", "GIB", "GRC", "GRL", "GRD", "GLP", "GUM", "GTM", "GGY", "GIN", "GNB", "GUY", "HTI", "HMD", "VAT", "HND", "HKG", "HUN", "ISL", "IND", "IDN", "IRN", "IRQ", "IRL", "IMN", "ISR", "ITA", "JAM", "JPN", "JEY", "JOR", "KAZ", "KEN", "KIR", "PRK", "KOR", "KWT", "KGZ", "LAO", "LVA", "LBN", "LSO", "LBR", "LBY", "LIE", "LTU", "LUX", "MAC", "MKD", "MDG", "MWI", "MYS", "MDV", "MLI", "MLT", "MHL", "MTQ", "MRT", "MUS", "MYT", "MEX", "FSM", "MDA", "MCO", "MNG", "MNE", "MSR", "MAR", "MOZ", "MMR", "NAM", "NRU", "NPL", "NLD", "NCL", "NZL", "NIC", "NER", "NGA", "NIU", "NFK", "MNP", "NOR", "OMN", "PAK", "PLW", "PSE", "PAN", "PNG", "PRY", "PER", "PHL", "PCN", "POL", "PRT", "PRI", "QAT", "REU", "ROU", "RUS", "RWA", "BLM", "SHN", "KNA", "LCA", "MAF", "SPM", "VCT", "WSM", "SMR", "STP", "SAU", "SEN", "SRB", "SYC", "SLE", "SGP", "SXM", "SVK", "SVN", "SLB", "SOM", "ZAF", "SGS", "SSD", "ESP", "LKA", "SDN", "SUR", "SJM", "SWZ", "SWE", "CHE", "SYR", "TWN", "TJK", "TZA", "THA", "TLS", "TGO", "TKL", "TON", "TTO", "TUN", "TUR", "TKM", "TCA", "TUV", "UGA", "UKR", "ARE", "GBR", "USA", "UMI", "URY", "UZB", "VUT", "VEN", "VNM", "VGB", "VIR", "WLF", "ESH", "YEM", "ZMB", "ZWE"]);
    function t(r) {
      return (0, l.default)(r), i.has(r.toUpperCase());
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Yr, Yr.exports)), Yr.exports;
}
var ge = {}, mn;
function ts() {
  if (mn) return ge;
  mn = 1, Object.defineProperty(ge, "__esModule", {
    value: !0
  }), ge.CurrencyCodes = void 0, ge.default = d;
  var u = e(/* @__PURE__ */ C());
  function e(i) {
    return i && i.__esModule ? i : { default: i };
  }
  var l = /* @__PURE__ */ new Set(["AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SLL", "SOS", "SRD", "SSP", "STN", "SVC", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "UYI", "UYU", "UYW", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XOF", "XPD", "XPF", "XPT", "XSU", "XTS", "XUA", "XXX", "YER", "ZAR", "ZMW", "ZWL"]);
  function d(i) {
    return (0, u.default)(i), l.has(i.toUpperCase());
  }
  return ge.CurrencyCodes = l, ge;
}
var zr = { exports: {} }, Sn;
function as() {
  return Sn || (Sn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = n;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ H());
    function i(f) {
      return f && f.__esModule ? f : { default: f };
    }
    var t = /^[A-Z2-7]+=*$/, r = /^[A-HJKMNP-TV-Z0-9]+$/, a = {
      crockford: !1
    };
    function n(f, v) {
      if ((0, l.default)(f), v = (0, d.default)(v, a), v.crockford)
        return r.test(f);
      var o = f.length;
      return !!(o % 8 === 0 && t.test(f));
    }
    u.exports = e.default, u.exports.default = e.default;
  })(zr, zr.exports)), zr.exports;
}
var Jr = { exports: {} }, In;
function ns() {
  return In || (In = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /^[A-HJ-NP-Za-km-z1-9]*$/;
    function t(r) {
      return (0, l.default)(r), !!i.test(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Jr, Jr.exports)), Jr.exports;
}
var Xr = { exports: {} }, Rn;
function us() {
  return Rn || (Rn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = a;
    var l = d(/* @__PURE__ */ C());
    function d(n) {
      return n && n.__esModule ? n : { default: n };
    }
    var i = /^[a-z]+\/[a-z0-9\-\+\._]+$/i, t = /^[a-z\-]+=[a-z0-9\-]+$/i, r = /^[a-z0-9!\$&'\(\)\*\+,;=\-\._~:@\/\?%\s]*$/i;
    function a(n) {
      (0, l.default)(n);
      var f = n.split(",");
      if (f.length < 2)
        return !1;
      var v = f.shift().trim().split(";"), o = v.shift();
      if (o.slice(0, 5) !== "data:")
        return !1;
      var s = o.slice(5);
      if (s !== "" && !i.test(s))
        return !1;
      for (var _ = 0; _ < v.length; _++)
        if (!(_ === v.length - 1 && v[_].toLowerCase() === "base64") && !t.test(v[_]))
          return !1;
      for (var S = 0; S < f.length; S++)
        if (!r.test(f[S]))
          return !1;
      return !0;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Xr, Xr.exports)), Xr.exports;
}
var Qr = { exports: {} }, $n;
function is() {
  return $n || ($n = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /(?:^magnet:\?|[^?&]&)xt(?:\.1)?=urn:(?:(?:aich|bitprint|btih|ed2k|ed2khash|kzhash|md5|sha1|tree:tiger):[a-z0-9]{32}(?:[a-z0-9]{8})?|btmh:1220[a-z0-9]{64})(?:$|&)/i;
    function t(r) {
      return (0, l.default)(r), r.indexOf("magnet:?") !== 0 ? !1 : i.test(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(Qr, Qr.exports)), Qr.exports;
}
var jr = { exports: {} }, et = { exports: {} }, rt = { exports: {} }, Mn;
function iu() {
  return Mn || (Mn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t, r) {
      if ((0, l.default)(t), r) {
        var a = new RegExp("[".concat(r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "]+$"), "g");
        return t.replace(a, "");
      }
      for (var n = t.length - 1; /\s/.test(t.charAt(n)); )
        n -= 1;
      return t.slice(0, n + 1);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(rt, rt.exports)), rt.exports;
}
var tt = { exports: {} }, yn;
function su() {
  return yn || (yn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t, r) {
      (0, l.default)(t);
      var a = r ? new RegExp("^[".concat(r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "]+"), "g") : /^\s+/g;
      return t.replace(a, "");
    }
    u.exports = e.default, u.exports.default = e.default;
  })(tt, tt.exports)), tt.exports;
}
var xn;
function lu() {
  return xn || (xn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = i(/* @__PURE__ */ iu()), d = i(/* @__PURE__ */ su());
    function i(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function t(r, a) {
      return (0, l.default)((0, d.default)(r, a), a);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(et, et.exports)), et.exports;
}
var Cn;
function ss() {
  return Cn || (Cn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = S;
    var l = t(/* @__PURE__ */ lu()), d = t(/* @__PURE__ */ Xn()), i = t(/* @__PURE__ */ C());
    function t(h) {
      return h && h.__esModule ? h : { default: h };
    }
    function r(h, g) {
      return f(h) || n(h, g) || o(h, g) || a();
    }
    function a() {
      throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    function n(h, g) {
      var m = h == null ? null : typeof Symbol < "u" && h[Symbol.iterator] || h["@@iterator"];
      if (m != null) {
        var I, R, $, E, P = [], L = !0, F = !1;
        try {
          if ($ = (m = m.call(h)).next, g !== 0) for (; !(L = (I = $.call(m)).done) && (P.push(I.value), P.length !== g); L = !0) ;
        } catch (B) {
          F = !0, R = B;
        } finally {
          try {
            if (!L && m.return != null && (E = m.return(), Object(E) !== E)) return;
          } finally {
            if (F) throw R;
          }
        }
        return P;
      }
    }
    function f(h) {
      if (Array.isArray(h)) return h;
    }
    function v(h, g) {
      var m = typeof Symbol < "u" && h[Symbol.iterator] || h["@@iterator"];
      if (!m) {
        if (Array.isArray(h) || (m = o(h)) || g) {
          m && (h = m);
          var I = 0, R = function() {
          };
          return { s: R, n: function() {
            return I >= h.length ? { done: !0 } : { done: !1, value: h[I++] };
          }, e: function(F) {
            throw F;
          }, f: R };
        }
        throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      var $ = !0, E = !1, P;
      return { s: function() {
        m = m.call(h);
      }, n: function() {
        var F = m.next();
        return $ = F.done, F;
      }, e: function(F) {
        E = !0, P = F;
      }, f: function() {
        try {
          !$ && m.return != null && m.return();
        } finally {
          if (E) throw P;
        }
      } };
    }
    function o(h, g) {
      if (h) {
        if (typeof h == "string") return s(h, g);
        var m = Object.prototype.toString.call(h).slice(8, -1);
        if (m === "Object" && h.constructor && (m = h.constructor.name), m === "Map" || m === "Set") return Array.from(h);
        if (m === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(m)) return s(h, g);
      }
    }
    function s(h, g) {
      (g == null || g > h.length) && (g = h.length);
      for (var m = 0, I = new Array(g); m < g; m++) I[m] = h[m];
      return I;
    }
    function _(h) {
      var g = /* @__PURE__ */ new Set(["subject", "body", "cc", "bcc"]), m = {
        cc: "",
        bcc: ""
      }, I = !1, R = h.split("&");
      if (R.length > 4)
        return !1;
      var $ = v(R), E;
      try {
        for ($.s(); !(E = $.n()).done; ) {
          var P = E.value, L = P.split("="), F = r(L, 2), B = F[0], Z = F[1];
          if (B && !g.has(B)) {
            I = !0;
            break;
          }
          Z && (B === "cc" || B === "bcc") && (m[B] = Z), B && g.delete(B);
        }
      } catch (b) {
        $.e(b);
      } finally {
        $.f();
      }
      return I ? !1 : m;
    }
    function S(h, g) {
      if ((0, i.default)(h), h.indexOf("mailto:") !== 0)
        return !1;
      var m = h.replace("mailto:", "").split("?"), I = r(m, 2), R = I[0], $ = I[1], E = $ === void 0 ? "" : $;
      if (!R && !E)
        return !0;
      var P = _(E);
      return P ? "".concat(R, ",").concat(P.cc, ",").concat(P.bcc).split(",").every(function(L) {
        return L = (0, l.default)(L, " "), L ? (0, d.default)(L, g) : !0;
      }) : !1;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(jr, jr.exports)), jr.exports;
}
var at = { exports: {} }, Dn;
function ls() {
  return Dn || (Dn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = a;
    var l = d(/* @__PURE__ */ C());
    function d(n) {
      return n && n.__esModule ? n : { default: n };
    }
    var i = /^(application|audio|font|image|message|model|multipart|text|video)\/[a-zA-Z0-9\.\-\+_]{1,100}$/i, t = /^text\/[a-zA-Z0-9\.\-\+]{1,100};\s?charset=("[a-zA-Z0-9\.\-\+\s]{0,70}"|[a-zA-Z0-9\.\-\+]{0,70})(\s?\([a-zA-Z0-9\.\-\+\s]{1,20}\))?$/i, r = /^multipart\/[a-zA-Z0-9\.\-\+]{1,100}(;\s?(boundary|charset)=("[a-zA-Z0-9\.\-\+\s]{0,70}"|[a-zA-Z0-9\.\-\+]{0,70})(\s?\([a-zA-Z0-9\.\-\+\s]{1,20}\))?){0,2}$/i;
    function a(n) {
      return (0, l.default)(n), i.test(n) || t.test(n) || r.test(n);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(at, at.exports)), at.exports;
}
var nt = { exports: {} }, En;
function fs() {
  return En || (En = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = v;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ H());
    function i(o) {
      return o && o.__esModule ? o : { default: o };
    }
    var t = /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/, r = /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/, a = /^(([1-8]?\d)\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|90\D+0\D+0)\D+[NSns]?$/i, n = /^\s*([1-7]?\d{1,2}\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|180\D+0\D+0)\D+[EWew]?$/i, f = {
      checkDMS: !1
    };
    function v(o, s) {
      if ((0, l.default)(o), s = (0, d.default)(s, f), !o.includes(",")) return !1;
      var _ = o.split(",");
      return _[0].startsWith("(") && !_[1].endsWith(")") || _[1].endsWith(")") && !_[0].startsWith("(") ? !1 : s.checkDMS ? a.test(_[0]) && n.test(_[1]) : t.test(_[0]) && r.test(_[1]);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(nt, nt.exports)), nt.exports;
}
var Ae = {}, Ln;
function os() {
  if (Ln) return Ae;
  Ln = 1, Object.defineProperty(Ae, "__esModule", {
    value: !0
  }), Ae.default = a, Ae.locales = void 0;
  var u = e(/* @__PURE__ */ C());
  function e(n) {
    return n && n.__esModule ? n : { default: n };
  }
  var l = /^\d{3}$/, d = /^\d{4}$/, i = /^\d{5}$/, t = /^\d{6}$/, r = {
    AD: /^AD\d{3}$/,
    AT: d,
    AU: d,
    AZ: /^AZ\d{4}$/,
    BA: /^([7-8]\d{4}$)/,
    BE: d,
    BG: d,
    BR: /^\d{5}-\d{3}$/,
    BY: /^2[1-4]\d{4}$/,
    CA: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][\s\-]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
    CH: d,
    CN: /^(0[1-7]|1[012356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[1-5]|8[1345]|9[09])\d{4}$/,
    CZ: /^\d{3}\s?\d{2}$/,
    DE: i,
    DK: d,
    DO: i,
    DZ: i,
    EE: i,
    ES: /^(5[0-2]{1}|[0-4]{1}\d{1})\d{3}$/,
    FI: i,
    FR: /^\d{2}\s?\d{3}$/,
    GB: /^(gir\s?0aa|[a-z]{1,2}\d[\da-z]?\s?(\d[a-z]{2})?)$/i,
    GR: /^\d{3}\s?\d{2}$/,
    HR: /^([1-5]\d{4}$)/,
    HT: /^HT\d{4}$/,
    HU: d,
    ID: i,
    IE: /^(?!.*(?:o))[A-Za-z]\d[\dw]\s\w{4}$/i,
    IL: /^(\d{5}|\d{7})$/,
    IN: /^((?!10|29|35|54|55|65|66|86|87|88|89)[1-9][0-9]{5})$/,
    IR: /^(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}$/,
    IS: l,
    IT: i,
    JP: /^\d{3}\-\d{4}$/,
    KE: i,
    KR: /^(\d{5}|\d{6})$/,
    LI: /^(948[5-9]|949[0-7])$/,
    LT: /^LT\-\d{5}$/,
    LU: d,
    LV: /^LV\-\d{4}$/,
    LK: i,
    MG: l,
    MX: i,
    MT: /^[A-Za-z]{3}\s{0,1}\d{4}$/,
    MY: i,
    NL: /^[1-9]\d{3}\s?(?!sa|sd|ss)[a-z]{2}$/i,
    NO: d,
    NP: /^(10|21|22|32|33|34|44|45|56|57)\d{3}$|^(977)$/i,
    NZ: d,
    PL: /^\d{2}\-\d{3}$/,
    PR: /^00[679]\d{2}([ -]\d{4})?$/,
    PT: /^\d{4}\-\d{3}?$/,
    RO: t,
    RU: t,
    SA: i,
    SE: /^[1-9]\d{2}\s?\d{2}$/,
    SG: t,
    SI: d,
    SK: /^\d{3}\s?\d{2}$/,
    TH: i,
    TN: d,
    TW: /^\d{3}(\d{2})?$/,
    UA: i,
    US: /^\d{5}(-\d{4})?$/,
    ZA: d,
    ZM: i
  };
  Ae.locales = Object.keys(r);
  function a(n, f) {
    if ((0, u.default)(n), f in r)
      return r[f].test(n);
    if (f === "any") {
      for (var v in r)
        if (r.hasOwnProperty(v)) {
          var o = r[v];
          if (o.test(n))
            return !0;
        }
      return !1;
    }
    throw new Error("Invalid locale '".concat(f, "'"));
  }
  return Ae;
}
var ut = { exports: {} }, Pn;
function ds() {
  return Pn || (Pn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t) {
      return (0, l.default)(t), t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\//g, "&#x2F;").replace(/\\/g, "&#x5C;").replace(/`/g, "&#96;");
    }
    u.exports = e.default, u.exports.default = e.default;
  })(ut, ut.exports)), ut.exports;
}
var it = { exports: {} }, On;
function cs() {
  return On || (On = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t) {
      return (0, l.default)(t), t.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#x2F;/g, "/").replace(/&#x5C;/g, "\\").replace(/&#96;/g, "`").replace(/&amp;/g, "&");
    }
    u.exports = e.default, u.exports.default = e.default;
  })(it, it.exports)), it.exports;
}
var st = { exports: {} }, lt = { exports: {} }, Fn;
function fu() {
  return Fn || (Fn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t, r) {
      return (0, l.default)(t), t.replace(new RegExp("[".concat(r, "]+"), "g"), "");
    }
    u.exports = e.default, u.exports.default = e.default;
  })(lt, lt.exports)), lt.exports;
}
var Bn;
function vs() {
  return Bn || (Bn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = i(/* @__PURE__ */ C()), d = i(/* @__PURE__ */ fu());
    function i(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function t(r, a) {
      (0, l.default)(r);
      var n = a ? "\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F" : "\\x00-\\x1F\\x7F";
      return (0, d.default)(r, n);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(st, st.exports)), st.exports;
}
var ft = { exports: {} }, Nn;
function ps() {
  return Nn || (Nn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t, r) {
      return (0, l.default)(t), t.replace(new RegExp("[^".concat(r, "]+"), "g"), "");
    }
    u.exports = e.default, u.exports.default = e.default;
  })(ft, ft.exports)), ft.exports;
}
var ot = { exports: {} }, Zn;
function _s() {
  return Zn || (Zn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = i;
    var l = d(/* @__PURE__ */ C());
    function d(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function i(t, r) {
      (0, l.default)(t);
      for (var a = t.length - 1; a >= 0; a--)
        if (r.indexOf(t[a]) === -1)
          return !1;
      return !0;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(ot, ot.exports)), ot.exports;
}
var dt = { exports: {} }, Tn;
function hs() {
  return Tn || (Tn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = v;
    var l = d(/* @__PURE__ */ H());
    function d(o) {
      return o && o.__esModule ? o : { default: o };
    }
    var i = {
      // The following options apply to all email addresses
      // Lowercases the local part of the email address.
      // Please note this may violate RFC 5321 as per http://stackoverflow.com/a/9808332/192024).
      // The domain is always lowercased, as per RFC 1035
      all_lowercase: !0,
      // The following conversions are specific to GMail
      // Lowercases the local part of the GMail address (known to be case-insensitive)
      gmail_lowercase: !0,
      // Removes dots from the local part of the email address, as that's ignored by GMail
      gmail_remove_dots: !0,
      // Removes the subaddress (e.g. "+foo") from the email address
      gmail_remove_subaddress: !0,
      // Conversts the googlemail.com domain to gmail.com
      gmail_convert_googlemaildotcom: !0,
      // The following conversions are specific to Outlook.com / Windows Live / Hotmail
      // Lowercases the local part of the Outlook.com address (known to be case-insensitive)
      outlookdotcom_lowercase: !0,
      // Removes the subaddress (e.g. "+foo") from the email address
      outlookdotcom_remove_subaddress: !0,
      // The following conversions are specific to Yahoo
      // Lowercases the local part of the Yahoo address (known to be case-insensitive)
      yahoo_lowercase: !0,
      // Removes the subaddress (e.g. "-foo") from the email address
      yahoo_remove_subaddress: !0,
      // The following conversions are specific to Yandex
      // Lowercases the local part of the Yandex address (known to be case-insensitive)
      yandex_lowercase: !0,
      // The following conversions are specific to iCloud
      // Lowercases the local part of the iCloud address (known to be case-insensitive)
      icloud_lowercase: !0,
      // Removes the subaddress (e.g. "+foo") from the email address
      icloud_remove_subaddress: !0
    }, t = ["icloud.com", "me.com"], r = ["hotmail.at", "hotmail.be", "hotmail.ca", "hotmail.cl", "hotmail.co.il", "hotmail.co.nz", "hotmail.co.th", "hotmail.co.uk", "hotmail.com", "hotmail.com.ar", "hotmail.com.au", "hotmail.com.br", "hotmail.com.gr", "hotmail.com.mx", "hotmail.com.pe", "hotmail.com.tr", "hotmail.com.vn", "hotmail.cz", "hotmail.de", "hotmail.dk", "hotmail.es", "hotmail.fr", "hotmail.hu", "hotmail.id", "hotmail.ie", "hotmail.in", "hotmail.it", "hotmail.jp", "hotmail.kr", "hotmail.lv", "hotmail.my", "hotmail.ph", "hotmail.pt", "hotmail.sa", "hotmail.sg", "hotmail.sk", "live.be", "live.co.uk", "live.com", "live.com.ar", "live.com.mx", "live.de", "live.es", "live.eu", "live.fr", "live.it", "live.nl", "msn.com", "outlook.at", "outlook.be", "outlook.cl", "outlook.co.il", "outlook.co.nz", "outlook.co.th", "outlook.com", "outlook.com.ar", "outlook.com.au", "outlook.com.br", "outlook.com.gr", "outlook.com.pe", "outlook.com.tr", "outlook.com.vn", "outlook.cz", "outlook.de", "outlook.dk", "outlook.es", "outlook.fr", "outlook.hu", "outlook.id", "outlook.ie", "outlook.in", "outlook.it", "outlook.jp", "outlook.kr", "outlook.lv", "outlook.my", "outlook.ph", "outlook.pt", "outlook.sa", "outlook.sg", "outlook.sk", "passport.com"], a = ["rocketmail.com", "yahoo.ca", "yahoo.co.uk", "yahoo.com", "yahoo.de", "yahoo.fr", "yahoo.in", "yahoo.it", "ymail.com"], n = ["yandex.ru", "yandex.ua", "yandex.kz", "yandex.com", "yandex.by", "ya.ru"];
    function f(o) {
      return o.length > 1 ? o : "";
    }
    function v(o, s) {
      s = (0, l.default)(s, i);
      var _ = o.split("@"), S = _.pop(), h = _.join("@"), g = [h, S];
      if (g[1] = g[1].toLowerCase(), g[1] === "gmail.com" || g[1] === "googlemail.com") {
        if (s.gmail_remove_subaddress && (g[0] = g[0].split("+")[0]), s.gmail_remove_dots && (g[0] = g[0].replace(/\.+/g, f)), !g[0].length)
          return !1;
        (s.all_lowercase || s.gmail_lowercase) && (g[0] = g[0].toLowerCase()), g[1] = s.gmail_convert_googlemaildotcom ? "gmail.com" : g[1];
      } else if (t.indexOf(g[1]) >= 0) {
        if (s.icloud_remove_subaddress && (g[0] = g[0].split("+")[0]), !g[0].length)
          return !1;
        (s.all_lowercase || s.icloud_lowercase) && (g[0] = g[0].toLowerCase());
      } else if (r.indexOf(g[1]) >= 0) {
        if (s.outlookdotcom_remove_subaddress && (g[0] = g[0].split("+")[0]), !g[0].length)
          return !1;
        (s.all_lowercase || s.outlookdotcom_lowercase) && (g[0] = g[0].toLowerCase());
      } else if (a.indexOf(g[1]) >= 0) {
        if (s.yahoo_remove_subaddress) {
          var m = g[0].split("-");
          g[0] = m.length > 1 ? m.slice(0, -1).join("-") : m[0];
        }
        if (!g[0].length)
          return !1;
        (s.all_lowercase || s.yahoo_lowercase) && (g[0] = g[0].toLowerCase());
      } else n.indexOf(g[1]) >= 0 ? ((s.all_lowercase || s.yandex_lowercase) && (g[0] = g[0].toLowerCase()), g[1] = "yandex.ru") : s.all_lowercase && (g[0] = g[0].toLowerCase());
      return g.join("@");
    }
    u.exports = e.default, u.exports.default = e.default;
  })(dt, dt.exports)), dt.exports;
}
var ct = { exports: {} }, qn;
function gs() {
  return qn || (qn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = /^[^\s-_](?!.*?[-_]{2,})[a-z0-9-\\][^\s]*[^-_\s]$/;
    function t(r) {
      return (0, l.default)(r), i.test(r);
    }
    u.exports = e.default, u.exports.default = e.default;
  })(ct, ct.exports)), ct.exports;
}
var vt = { exports: {} }, wn;
function As() {
  return wn || (wn = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = t;
    var l = d(/* @__PURE__ */ C());
    function d(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var i = {
      "cs-CZ": function(a) {
        return /^(([ABCDEFHIJKLMNPRSTUVXYZ]|[0-9])-?){5,8}$/.test(a);
      },
      "de-DE": function(a) {
        return /^((A|AA|AB|AC|AE|AH|AK|AM|AN|AÖ|AP|AS|AT|AU|AW|AZ|B|BA|BB|BC|BE|BF|BH|BI|BK|BL|BM|BN|BO|BÖ|BS|BT|BZ|C|CA|CB|CE|CO|CR|CW|D|DA|DD|DE|DH|DI|DL|DM|DN|DO|DU|DW|DZ|E|EA|EB|ED|EE|EF|EG|EH|EI|EL|EM|EN|ER|ES|EU|EW|F|FB|FD|FF|FG|FI|FL|FN|FO|FR|FS|FT|FÜ|FW|FZ|G|GA|GC|GD|GE|GF|GG|GI|GK|GL|GM|GN|GÖ|GP|GR|GS|GT|GÜ|GV|GW|GZ|H|HA|HB|HC|HD|HE|HF|HG|HH|HI|HK|HL|HM|HN|HO|HP|HR|HS|HU|HV|HX|HY|HZ|IK|IL|IN|IZ|J|JE|JL|K|KA|KB|KC|KE|KF|KG|KH|KI|KK|KL|KM|KN|KO|KR|KS|KT|KU|KW|KY|L|LA|LB|LC|LD|LF|LG|LH|LI|LL|LM|LN|LÖ|LP|LR|LU|M|MA|MB|MC|MD|ME|MG|MH|MI|MK|ML|MM|MN|MO|MQ|MR|MS|MÜ|MW|MY|MZ|N|NB|ND|NE|NF|NH|NI|NK|NM|NÖ|NP|NR|NT|NU|NW|NY|NZ|OA|OB|OC|OD|OE|OF|OG|OH|OK|OL|OP|OS|OZ|P|PA|PB|PE|PF|PI|PL|PM|PN|PR|PS|PW|PZ|R|RA|RC|RD|RE|RG|RH|RI|RL|RM|RN|RO|RP|RS|RT|RU|RV|RW|RZ|S|SB|SC|SE|SG|SI|SK|SL|SM|SN|SO|SP|SR|ST|SU|SW|SY|SZ|TE|TF|TG|TO|TP|TR|TS|TT|TÜ|ÜB|UE|UH|UL|UM|UN|V|VB|VG|VK|VR|VS|W|WA|WB|WE|WF|WI|WK|WL|WM|WN|WO|WR|WS|WT|WÜ|WW|WZ|Z|ZE|ZI|ZP|ZR|ZW|ZZ)[- ]?[A-Z]{1,2}[- ]?\d{1,4}|(ABG|ABI|AIB|AIC|ALF|ALZ|ANA|ANG|ANK|APD|ARN|ART|ASL|ASZ|AUR|AZE|BAD|BAR|BBG|BCH|BED|BER|BGD|BGL|BID|BIN|BIR|BIT|BIW|BKS|BLB|BLK|BNA|BOG|BOH|BOR|BOT|BRA|BRB|BRG|BRK|BRL|BRV|BSB|BSK|BTF|BÜD|BUL|BÜR|BÜS|BÜZ|CAS|CHA|CLP|CLZ|COC|COE|CUX|DAH|DAN|DAU|DBR|DEG|DEL|DGF|DIL|DIN|DIZ|DKB|DLG|DON|DUD|DÜW|EBE|EBN|EBS|ECK|EIC|EIL|EIN|EIS|EMD|EMS|ERB|ERH|ERK|ERZ|ESB|ESW|FDB|FDS|FEU|FFB|FKB|FLÖ|FOR|FRG|FRI|FRW|FTL|FÜS|GAN|GAP|GDB|GEL|GEO|GER|GHA|GHC|GLA|GMN|GNT|GOA|GOH|GRA|GRH|GRI|GRM|GRZ|GTH|GUB|GUN|GVM|HAB|HAL|HAM|HAS|HBN|HBS|HCH|HDH|HDL|HEB|HEF|HEI|HER|HET|HGN|HGW|HHM|HIG|HIP|HMÜ|HOG|HOH|HOL|HOM|HOR|HÖS|HOT|HRO|HSK|HST|HVL|HWI|IGB|ILL|JÜL|KEH|KEL|KEM|KIB|KLE|KLZ|KÖN|KÖT|KÖZ|KRU|KÜN|KUS|KYF|LAN|LAU|LBS|LBZ|LDK|LDS|LEO|LER|LEV|LIB|LIF|LIP|LÖB|LOS|LRO|LSZ|LÜN|LUP|LWL|MAB|MAI|MAK|MAL|MED|MEG|MEI|MEK|MEL|MER|MET|MGH|MGN|MHL|MIL|MKK|MOD|MOL|MON|MOS|MSE|MSH|MSP|MST|MTK|MTL|MÜB|MÜR|MYK|MZG|NAB|NAI|NAU|NDH|NEA|NEB|NEC|NEN|NES|NEW|NMB|NMS|NOH|NOL|NOM|NOR|NVP|NWM|OAL|OBB|OBG|OCH|OHA|ÖHR|OHV|OHZ|OPR|OSL|OVI|OVL|OVP|PAF|PAN|PAR|PCH|PEG|PIR|PLÖ|PRÜ|QFT|QLB|RDG|REG|REH|REI|RID|RIE|ROD|ROF|ROK|ROL|ROS|ROT|ROW|RSL|RÜD|RÜG|SAB|SAD|SAN|SAW|SBG|SBK|SCZ|SDH|SDL|SDT|SEB|SEE|SEF|SEL|SFB|SFT|SGH|SHA|SHG|SHK|SHL|SIG|SIM|SLE|SLF|SLK|SLN|SLS|SLÜ|SLZ|SMÜ|SOB|SOG|SOK|SÖM|SON|SPB|SPN|SRB|SRO|STA|STB|STD|STE|STL|SUL|SÜW|SWA|SZB|TBB|TDO|TET|TIR|TÖL|TUT|UEM|UER|UFF|USI|VAI|VEC|VER|VIB|VIE|VIT|VOH|WAF|WAK|WAN|WAR|WAT|WBS|WDA|WEL|WEN|WER|WES|WHV|WIL|WIS|WIT|WIZ|WLG|WMS|WND|WOB|WOH|WOL|WOR|WOS|WRN|WSF|WST|WSW|WTL|WTM|WUG|WÜM|WUN|WUR|WZL|ZEL|ZIG)[- ]?(([A-Z][- ]?\d{1,4})|([A-Z]{2}[- ]?\d{1,3})))[- ]?(E|H)?$/.test(a);
      },
      "de-LI": function(a) {
        return /^FL[- ]?\d{1,5}[UZ]?$/.test(a);
      },
      "en-IN": function(a) {
        return /^[A-Z]{2}[ -]?[0-9]{1,2}(?:[ -]?[A-Z])(?:[ -]?[A-Z]*)?[ -]?[0-9]{4}$/.test(a);
      },
      "es-AR": function(a) {
        return /^(([A-Z]{2} ?[0-9]{3} ?[A-Z]{2})|([A-Z]{3} ?[0-9]{3}))$/.test(a);
      },
      "fi-FI": function(a) {
        return /^(?=.{4,7})(([A-Z]{1,3}|[0-9]{1,3})[\s-]?([A-Z]{1,3}|[0-9]{1,5}))$/.test(a);
      },
      "hu-HU": function(a) {
        return /^((((?!AAA)(([A-NPRSTVZWXY]{1})([A-PR-Z]{1})([A-HJ-NPR-Z]))|(A[ABC]I)|A[ABC]O|A[A-W]Q|BPI|BPO|UCO|UDO|XAO)-(?!000)\d{3})|(M\d{6})|((CK|DT|CD|HC|H[ABEFIKLMNPRSTVX]|MA|OT|R[A-Z]) \d{2}-\d{2})|(CD \d{3}-\d{3})|(C-(C|X) \d{4})|(X-(A|B|C) \d{4})|(([EPVZ]-\d{5}))|(S A[A-Z]{2} \d{2})|(SP \d{2}-\d{2}))$/.test(a);
      },
      "pt-BR": function(a) {
        return /^[A-Z]{3}[ -]?[0-9][A-Z][0-9]{2}|[A-Z]{3}[ -]?[0-9]{4}$/.test(a);
      },
      "pt-PT": function(a) {
        return /^([A-Z]{2}|[0-9]{2})[ -·]?([A-Z]{2}|[0-9]{2})[ -·]?([A-Z]{2}|[0-9]{2})$/.test(a);
      },
      "sq-AL": function(a) {
        return /^[A-Z]{2}[- ]?((\d{3}[- ]?(([A-Z]{2})|T))|(R[- ]?\d{3}))$/.test(a);
      },
      "sv-SE": function(a) {
        return /^[A-HJ-PR-UW-Z]{3} ?[\d]{2}[A-HJ-PR-UW-Z1-9]$|(^[A-ZÅÄÖ ]{2,7}$)/.test(a.trim());
      },
      "en-PK": function(a) {
        return /(^[A-Z]{2}((\s|-){0,1})[0-9]{3,4}((\s|-)[0-9]{2}){0,1}$)|(^[A-Z]{3}((\s|-){0,1})[0-9]{3,4}((\s|-)[0-9]{2}){0,1}$)|(^[A-Z]{4}((\s|-){0,1})[0-9]{3,4}((\s|-)[0-9]{2}){0,1}$)|(^[A-Z]((\s|-){0,1})[0-9]{4}((\s|-)[0-9]{2}){0,1}$)/.test(a.trim());
      }
    };
    function t(r, a) {
      if ((0, l.default)(r), a in i)
        return i[a](r);
      if (a === "any") {
        for (var n in i) {
          var f = i[n];
          if (f(r))
            return !0;
        }
        return !1;
      }
      throw new Error("Invalid locale '".concat(a, "'"));
    }
    u.exports = e.default, u.exports.default = e.default;
  })(vt, vt.exports)), vt.exports;
}
var pt = { exports: {} }, Un;
function ms() {
  return Un || (Un = 1, (function(u, e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = _;
    var l = i(/* @__PURE__ */ H()), d = i(/* @__PURE__ */ C());
    function i(S) {
      return S && S.__esModule ? S : { default: S };
    }
    var t = /^[A-Z]$/, r = /^[a-z]$/, a = /^[0-9]$/, n = /^[-#!$@£%^&*()_+|~=`{}\[\]:";'<>?,.\/\\ ]$/, f = {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: !1,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10
    };
    function v(S) {
      var h = {};
      return Array.from(S).forEach(function(g) {
        var m = h[g];
        m ? h[g] += 1 : h[g] = 1;
      }), h;
    }
    function o(S) {
      var h = v(S), g = {
        length: S.length,
        uniqueChars: Object.keys(h).length,
        uppercaseCount: 0,
        lowercaseCount: 0,
        numberCount: 0,
        symbolCount: 0
      };
      return Object.keys(h).forEach(function(m) {
        t.test(m) ? g.uppercaseCount += h[m] : r.test(m) ? g.lowercaseCount += h[m] : a.test(m) ? g.numberCount += h[m] : n.test(m) && (g.symbolCount += h[m]);
      }), g;
    }
    function s(S, h) {
      var g = 0;
      return g += S.uniqueChars * h.pointsPerUnique, g += (S.length - S.uniqueChars) * h.pointsPerRepeat, S.lowercaseCount > 0 && (g += h.pointsForContainingLower), S.uppercaseCount > 0 && (g += h.pointsForContainingUpper), S.numberCount > 0 && (g += h.pointsForContainingNumber), S.symbolCount > 0 && (g += h.pointsForContainingSymbol), g;
    }
    function _(S) {
      var h = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
      (0, d.default)(S);
      var g = o(S);
      return h = (0, l.default)(h || {}, f), h.returnScore ? s(g, h) : g.length >= h.minLength && g.lowercaseCount >= h.minLowercase && g.uppercaseCount >= h.minUppercase && g.numberCount >= h.minNumbers && g.symbolCount >= h.minSymbols;
    }
    u.exports = e.default, u.exports.default = e.default;
  })(pt, pt.exports)), pt.exports;
}
var me = {}, bn;
function Ss() {
  if (bn) return me;
  bn = 1;
  function u(o) {
    "@babel/helpers - typeof";
    return u = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(s) {
      return typeof s;
    } : function(s) {
      return s && typeof Symbol == "function" && s.constructor === Symbol && s !== Symbol.prototype ? "symbol" : typeof s;
    }, u(o);
  }
  Object.defineProperty(me, "__esModule", {
    value: !0
  }), me.default = v, me.vatMatchers = void 0;
  var e = t(/* @__PURE__ */ C()), l = i(/* @__PURE__ */ uu());
  function d(o) {
    if (typeof WeakMap != "function") return null;
    var s = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap();
    return (d = function(h) {
      return h ? _ : s;
    })(o);
  }
  function i(o, s) {
    if (o && o.__esModule) return o;
    if (o === null || u(o) != "object" && typeof o != "function") return { default: o };
    var _ = d(s);
    if (_ && _.has(o)) return _.get(o);
    var S = { __proto__: null }, h = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var g in o) if (g !== "default" && {}.hasOwnProperty.call(o, g)) {
      var m = h ? Object.getOwnPropertyDescriptor(o, g) : null;
      m && (m.get || m.set) ? Object.defineProperty(S, g, m) : S[g] = o[g];
    }
    return S.default = o, _ && _.set(o, S), S;
  }
  function t(o) {
    return o && o.__esModule ? o : { default: o };
  }
  var r = function(s) {
    var _ = s.match(/^(AU)?(\d{11})$/);
    if (!_)
      return !1;
    var S = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    s = s.replace(/^AU/, "");
    for (var h = (parseInt(s.slice(0, 1), 10) - 1).toString() + s.slice(1), g = 0, m = 0; m < 11; m++)
      g += S[m] * h.charAt(m);
    return g !== 0 && g % 89 === 0;
  }, a = function(s) {
    var _ = function(h) {
      var g = h.pop(), m = [5, 4, 3, 2, 7, 6, 5, 4], I = (11 - h.reduce(function(R, $, E) {
        return R + $ * m[E];
      }, 0) % 11) % 11;
      return g === I;
    };
    return /^(CHE[- ]?)?(\d{9}|(\d{3}\.\d{3}\.\d{3})|(\d{3} \d{3} \d{3})) ?(TVA|MWST|IVA)?$/.test(s) && _(s.match(/\d/g).map(function(S) {
      return +S;
    }));
  }, n = function(s) {
    var _ = s.match(/^(PT)?(\d{9})$/);
    if (!_)
      return !1;
    var S = _[2], h = 11 - l.reverseMultiplyAndSum(S.split("").slice(0, 8).map(function(g) {
      return parseInt(g, 10);
    }), 9) % 11;
    return h > 9 ? parseInt(S[8], 10) === 0 : h === parseInt(S[8], 10);
  }, f = me.vatMatchers = {
    /**
     * European Union VAT identification numbers
     */
    AT: function(s) {
      return /^(AT)?U\d{8}$/.test(s);
    },
    BE: function(s) {
      return /^(BE)?\d{10}$/.test(s);
    },
    BG: function(s) {
      return /^(BG)?\d{9,10}$/.test(s);
    },
    HR: function(s) {
      return /^(HR)?\d{11}$/.test(s);
    },
    CY: function(s) {
      return /^(CY)?\w{9}$/.test(s);
    },
    CZ: function(s) {
      return /^(CZ)?\d{8,10}$/.test(s);
    },
    DK: function(s) {
      return /^(DK)?\d{8}$/.test(s);
    },
    EE: function(s) {
      return /^(EE)?\d{9}$/.test(s);
    },
    FI: function(s) {
      return /^(FI)?\d{8}$/.test(s);
    },
    FR: function(s) {
      return /^(FR)?\w{2}\d{9}$/.test(s);
    },
    DE: function(s) {
      return /^(DE)?\d{9}$/.test(s);
    },
    EL: function(s) {
      return /^(EL)?\d{9}$/.test(s);
    },
    HU: function(s) {
      return /^(HU)?\d{8}$/.test(s);
    },
    IE: function(s) {
      return /^(IE)?\d{7}\w{1}(W)?$/.test(s);
    },
    IT: function(s) {
      return /^(IT)?\d{11}$/.test(s);
    },
    LV: function(s) {
      return /^(LV)?\d{11}$/.test(s);
    },
    LT: function(s) {
      return /^(LT)?\d{9,12}$/.test(s);
    },
    LU: function(s) {
      return /^(LU)?\d{8}$/.test(s);
    },
    MT: function(s) {
      return /^(MT)?\d{8}$/.test(s);
    },
    NL: function(s) {
      return /^(NL)?\d{9}B\d{2}$/.test(s);
    },
    PL: function(s) {
      return /^(PL)?(\d{10}|(\d{3}-\d{3}-\d{2}-\d{2})|(\d{3}-\d{2}-\d{2}-\d{3}))$/.test(s);
    },
    PT: n,
    RO: function(s) {
      return /^(RO)?\d{2,10}$/.test(s);
    },
    SK: function(s) {
      return /^(SK)?\d{10}$/.test(s);
    },
    SI: function(s) {
      return /^(SI)?\d{8}$/.test(s);
    },
    ES: function(s) {
      return /^(ES)?\w\d{7}[A-Z]$/.test(s);
    },
    SE: function(s) {
      return /^(SE)?\d{12}$/.test(s);
    },
    /**
     * VAT numbers of non-EU countries
     */
    AL: function(s) {
      return /^(AL)?\w{9}[A-Z]$/.test(s);
    },
    MK: function(s) {
      return /^(MK)?\d{13}$/.test(s);
    },
    AU: r,
    BY: function(s) {
      return /^(УНП )?\d{9}$/.test(s);
    },
    CA: function(s) {
      return /^(CA)?\d{9}$/.test(s);
    },
    IS: function(s) {
      return /^(IS)?\d{5,6}$/.test(s);
    },
    IN: function(s) {
      return /^(IN)?\d{15}$/.test(s);
    },
    ID: function(s) {
      return /^(ID)?(\d{15}|(\d{2}.\d{3}.\d{3}.\d{1}-\d{3}.\d{3}))$/.test(s);
    },
    IL: function(s) {
      return /^(IL)?\d{9}$/.test(s);
    },
    KZ: function(s) {
      return /^(KZ)?\d{12}$/.test(s);
    },
    NZ: function(s) {
      return /^(NZ)?\d{9}$/.test(s);
    },
    NG: function(s) {
      return /^(NG)?(\d{12}|(\d{8}-\d{4}))$/.test(s);
    },
    NO: function(s) {
      return /^(NO)?\d{9}MVA$/.test(s);
    },
    PH: function(s) {
      return /^(PH)?(\d{12}|\d{3} \d{3} \d{3} \d{3})$/.test(s);
    },
    RU: function(s) {
      return /^(RU)?(\d{10}|\d{12})$/.test(s);
    },
    SM: function(s) {
      return /^(SM)?\d{5}$/.test(s);
    },
    SA: function(s) {
      return /^(SA)?\d{15}$/.test(s);
    },
    RS: function(s) {
      return /^(RS)?\d{9}$/.test(s);
    },
    CH: a,
    TR: function(s) {
      return /^(TR)?\d{10}$/.test(s);
    },
    UA: function(s) {
      return /^(UA)?\d{12}$/.test(s);
    },
    GB: function(s) {
      return /^GB((\d{3} \d{4} ([0-8][0-9]|9[0-6]))|(\d{9} \d{3})|(((GD[0-4])|(HA[5-9]))[0-9]{2}))$/.test(s);
    },
    UZ: function(s) {
      return /^(UZ)?\d{9}$/.test(s);
    },
    /**
     * VAT numbers of Latin American countries
     */
    AR: function(s) {
      return /^(AR)?\d{11}$/.test(s);
    },
    BO: function(s) {
      return /^(BO)?\d{7}$/.test(s);
    },
    BR: function(s) {
      return /^(BR)?((\d{2}.\d{3}.\d{3}\/\d{4}-\d{2})|(\d{3}.\d{3}.\d{3}-\d{2}))$/.test(s);
    },
    CL: function(s) {
      return /^(CL)?\d{8}-\d{1}$/.test(s);
    },
    CO: function(s) {
      return /^(CO)?\d{10}$/.test(s);
    },
    CR: function(s) {
      return /^(CR)?\d{9,12}$/.test(s);
    },
    EC: function(s) {
      return /^(EC)?\d{13}$/.test(s);
    },
    SV: function(s) {
      return /^(SV)?\d{4}-\d{6}-\d{3}-\d{1}$/.test(s);
    },
    GT: function(s) {
      return /^(GT)?\d{7}-\d{1}$/.test(s);
    },
    HN: function(s) {
      return /^(HN)?$/.test(s);
    },
    MX: function(s) {
      return /^(MX)?\w{3,4}\d{6}\w{3}$/.test(s);
    },
    NI: function(s) {
      return /^(NI)?\d{3}-\d{6}-\d{4}\w{1}$/.test(s);
    },
    PA: function(s) {
      return /^(PA)?$/.test(s);
    },
    PY: function(s) {
      return /^(PY)?\d{6,8}-\d{1}$/.test(s);
    },
    PE: function(s) {
      return /^(PE)?\d{11}$/.test(s);
    },
    DO: function(s) {
      return /^(DO)?(\d{11}|(\d{3}-\d{7}-\d{1})|[1,4,5]{1}\d{8}|([1,4,5]{1})-\d{2}-\d{5}-\d{1})$/.test(s);
    },
    UY: function(s) {
      return /^(UY)?\d{12}$/.test(s);
    },
    VE: function(s) {
      return /^(VE)?[J,G,V,E]{1}-(\d{9}|(\d{8}-\d{1}))$/.test(s);
    }
  };
  function v(o, s) {
    if ((0, e.default)(o), (0, e.default)(s), s in f)
      return f[s](o);
    throw new Error("Invalid country code: '".concat(s, "'"));
  }
  return me;
}
var Hn;
function Is() {
  return Hn || (Hn = 1, (function(u, e) {
    function l(w) {
      "@babel/helpers - typeof";
      return l = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(X) {
        return typeof X;
      } : function(X) {
        return X && typeof Symbol == "function" && X.constructor === Symbol && X !== Symbol.prototype ? "symbol" : typeof X;
      }, l(w);
    }
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = void 0;
    var d = x(/* @__PURE__ */ Nt()), i = x(/* @__PURE__ */ Yn()), t = x(/* @__PURE__ */ Vu()), r = x(/* @__PURE__ */ Yu()), a = x(/* @__PURE__ */ zu()), n = x(/* @__PURE__ */ Ju()), f = x(/* @__PURE__ */ Xu()), v = x(/* @__PURE__ */ Xn()), o = x(/* @__PURE__ */ Qu()), s = x(/* @__PURE__ */ ju()), _ = x(/* @__PURE__ */ _t()), S = x(/* @__PURE__ */ ei()), h = x(/* @__PURE__ */ Zt()), g = x(/* @__PURE__ */ Qn()), m = x(/* @__PURE__ */ ri()), I = x(/* @__PURE__ */ ti()), R = x(/* @__PURE__ */ ai()), $ = x(/* @__PURE__ */ ni()), E = ue(/* @__PURE__ */ ui()), P = ue(/* @__PURE__ */ ii()), L = x(/* @__PURE__ */ si()), F = x(/* @__PURE__ */ li()), B = x(/* @__PURE__ */ fi()), Z = x(/* @__PURE__ */ oi()), b = x(/* @__PURE__ */ di()), G = x(/* @__PURE__ */ ci()), W = x(/* @__PURE__ */ vi()), z = x(/* @__PURE__ */ jn()), k = x(/* @__PURE__ */ eu()), Y = x(/* @__PURE__ */ pi()), ht = x(/* @__PURE__ */ _i()), gt = x(/* @__PURE__ */ gi()), At = x(/* @__PURE__ */ Ai()), Me = x(/* @__PURE__ */ Tt()), ye = ue(/* @__PURE__ */ Vn()), mt = x(/* @__PURE__ */ Si()), St = x(/* @__PURE__ */ ru()), It = x(/* @__PURE__ */ Ii()), Rt = x(/* @__PURE__ */ Ri()), $t = x(/* @__PURE__ */ $i()), Mt = x(/* @__PURE__ */ Mi()), yt = x(/* @__PURE__ */ yi()), xt = x(/* @__PURE__ */ xi()), xe = ue(/* @__PURE__ */ Ci()), Ct = x(/* @__PURE__ */ Di()), Dt = x(/* @__PURE__ */ Ei()), K = x(/* @__PURE__ */ Li()), V = x(/* @__PURE__ */ Pi()), Ce = x(/* @__PURE__ */ Oi()), ae = x(/* @__PURE__ */ Fi()), Et = x(/* @__PURE__ */ Bi()), c = x(/* @__PURE__ */ Jn()), p = x(/* @__PURE__ */ Ni()), A = x(/* @__PURE__ */ Zi()), y = x(/* @__PURE__ */ Ti()), M = x(/* @__PURE__ */ qi()), D = x(/* @__PURE__ */ wi()), O = x(/* @__PURE__ */ nu()), N = x(/* @__PURE__ */ Ui()), T = x(/* @__PURE__ */ bi()), q = x(/* @__PURE__ */ Hi()), j = x(/* @__PURE__ */ ki()), Q = x(/* @__PURE__ */ Gi()), J = x(/* @__PURE__ */ Wi()), Se = x(/* @__PURE__ */ Ki()), Ie = ue(/* @__PURE__ */ Vi()), ee = x(/* @__PURE__ */ Yi()), ne = x(/* @__PURE__ */ zi()), De = x(/* @__PURE__ */ Ji()), Ut = /* @__PURE__ */ Xi(), cu = x(/* @__PURE__ */ Qi()), vu = x(/* @__PURE__ */ ji()), pu = x(/* @__PURE__ */ es()), _u = x(/* @__PURE__ */ tu()), hu = x(/* @__PURE__ */ rs()), gu = x(/* @__PURE__ */ ts()), Au = x(/* @__PURE__ */ as()), mu = x(/* @__PURE__ */ ns()), Su = x(/* @__PURE__ */ au()), Iu = x(/* @__PURE__ */ us()), Ru = x(/* @__PURE__ */ is()), $u = x(/* @__PURE__ */ ss()), Mu = x(/* @__PURE__ */ ls()), yu = x(/* @__PURE__ */ fs()), bt = ue(/* @__PURE__ */ os()), xu = x(/* @__PURE__ */ su()), Cu = x(/* @__PURE__ */ iu()), Du = x(/* @__PURE__ */ lu()), Eu = x(/* @__PURE__ */ ds()), Lu = x(/* @__PURE__ */ cs()), Pu = x(/* @__PURE__ */ vs()), Ou = x(/* @__PURE__ */ ps()), Fu = x(/* @__PURE__ */ fu()), Bu = x(/* @__PURE__ */ _s()), Nu = x(/* @__PURE__ */ hs()), Zu = x(/* @__PURE__ */ gs()), Tu = x(/* @__PURE__ */ As()), qu = x(/* @__PURE__ */ ms()), wu = x(/* @__PURE__ */ Ss());
    function Ht(w) {
      if (typeof WeakMap != "function") return null;
      var X = /* @__PURE__ */ new WeakMap(), re = /* @__PURE__ */ new WeakMap();
      return (Ht = function(Lt) {
        return Lt ? re : X;
      })(w);
    }
    function ue(w, X) {
      if (w && w.__esModule) return w;
      if (w === null || l(w) != "object" && typeof w != "function") return { default: w };
      var re = Ht(X);
      if (re && re.has(w)) return re.get(w);
      var ie = { __proto__: null }, Lt = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var se in w) if (se !== "default" && {}.hasOwnProperty.call(w, se)) {
        var Ee = Lt ? Object.getOwnPropertyDescriptor(w, se) : null;
        Ee && (Ee.get || Ee.set) ? Object.defineProperty(ie, se, Ee) : ie[se] = w[se];
      }
      return ie.default = w, re && re.set(w, ie), ie;
    }
    function x(w) {
      return w && w.__esModule ? w : { default: w };
    }
    var Uu = "13.12.0", bu = {
      version: Uu,
      toDate: d.default,
      toFloat: i.default,
      toInt: t.default,
      toBoolean: r.default,
      equals: a.default,
      contains: n.default,
      matches: f.default,
      isEmail: v.default,
      isURL: o.default,
      isMACAddress: s.default,
      isIP: _.default,
      isIPRange: S.default,
      isFQDN: h.default,
      isBoolean: I.default,
      isIBAN: xe.default,
      isBIC: Ct.default,
      isAbaRouting: $.default,
      isAlpha: E.default,
      isAlphaLocales: E.locales,
      isAlphanumeric: P.default,
      isAlphanumericLocales: P.locales,
      isNumeric: L.default,
      isPassportNumber: F.default,
      isPort: B.default,
      isLowercase: Z.default,
      isUppercase: b.default,
      isAscii: W.default,
      isFullWidth: z.default,
      isHalfWidth: k.default,
      isVariableWidth: Y.default,
      isMultibyte: ht.default,
      isSemVer: gt.default,
      isSurrogatePair: At.default,
      isInt: Me.default,
      isIMEI: G.default,
      isFloat: ye.default,
      isFloatLocales: ye.locales,
      isDecimal: mt.default,
      isHexadecimal: St.default,
      isOctal: It.default,
      isDivisibleBy: Rt.default,
      isHexColor: $t.default,
      isRgbColor: Mt.default,
      isHSL: yt.default,
      isISRC: xt.default,
      isMD5: Dt.default,
      isHash: K.default,
      isJWT: V.default,
      isJSON: Ce.default,
      isEmpty: ae.default,
      isLength: Et.default,
      isLocale: R.default,
      isByteLength: c.default,
      isUUID: p.default,
      isMongoId: A.default,
      isAfter: y.default,
      isBefore: M.default,
      isIn: D.default,
      isLuhnNumber: O.default,
      isCreditCard: N.default,
      isIdentityCard: T.default,
      isEAN: q.default,
      isISIN: j.default,
      isISBN: Q.default,
      isISSN: J.default,
      isMobilePhone: Ie.default,
      isMobilePhoneLocales: Ie.locales,
      isPostalCode: bt.default,
      isPostalCodeLocales: bt.locales,
      isEthereumAddress: ee.default,
      isCurrency: ne.default,
      isBtcAddress: De.default,
      isISO6346: Ut.isISO6346,
      isFreightContainerID: Ut.isFreightContainerID,
      isISO6391: cu.default,
      isISO8601: vu.default,
      isRFC3339: pu.default,
      isISO31661Alpha2: _u.default,
      isISO31661Alpha3: hu.default,
      isISO4217: gu.default,
      isBase32: Au.default,
      isBase58: mu.default,
      isBase64: Su.default,
      isDataURI: Iu.default,
      isMagnetURI: Ru.default,
      isMailtoURI: $u.default,
      isMimeType: Mu.default,
      isLatLong: yu.default,
      ltrim: xu.default,
      rtrim: Cu.default,
      trim: Du.default,
      escape: Eu.default,
      unescape: Lu.default,
      stripLow: Pu.default,
      whitelist: Ou.default,
      blacklist: Fu.default,
      isWhitelisted: Bu.default,
      normalizeEmail: Nu.default,
      toString,
      isSlug: Zu.default,
      isStrongPassword: qu.default,
      isTaxID: Se.default,
      isDate: g.default,
      isTime: m.default,
      isLicensePlate: Tu.default,
      isVAT: wu.default,
      ibanLocales: xe.locales
    };
    e.default = bu, u.exports = e.default, u.exports.default = e.default;
  })(Le, Le.exports)), Le.exports;
}
var Rs = /* @__PURE__ */ Is();
const Ns = /* @__PURE__ */ Wn(Rs), qt = "AutomatedEmailsResponseType", Zs = Kn({
  dataType: qt,
  path: "/automated_emails/"
}), Ts = Re({
  method: "POST",
  path: () => "/automated_emails/",
  body: (u) => ({ automated_emails: [u] }),
  updateQueries: {
    dataType: qt,
    emberUpdateType: "createOrUpdate",
    update: Wu("automated_emails")
  }
}), qs = Re({
  method: "PUT",
  path: () => "/automated_emails/senders/",
  body: (u) => u,
  updateQueries: {
    dataType: qt,
    emberUpdateType: "createOrUpdate",
    update: Ku("automated_emails")
  }
}), ws = Re({
  method: "POST",
  path: ({ id: u }) => `/automated_emails/${u}/test/`,
  body: ({ email: u, subject: e, lexical: l }) => ({ email: u, subject: e, lexical: l })
}), Us = Re({
  method: "POST",
  path: ({ id: u }) => `/automated_emails/${u}/preview/`,
  body: ({ subject: u, lexical: e }) => ({ subject: u, lexical: e })
}), $s = "NewslettersResponseType", bs = ku({
  dataType: $s,
  path: "/newsletters/",
  defaultSearchParams: { include: "count.active_members,count.posts", limit: "50" },
  defaultNextPageParams: (u, e) => ({
    ...e,
    page: (u.meta?.pagination.next || 1).toString()
  }),
  returnData: (u) => {
    const { pages: e } = u, l = e.flatMap((i) => i.newsletters), d = e[e.length - 1].meta;
    return {
      newsletters: l,
      meta: d,
      isEnd: d ? d.pagination.pages === d.pagination.page : !0
    };
  }
});
var Bt, kn;
function Ms() {
  if (kn) return Bt;
  kn = 1;
  for (var u = Math.floor(Math.random() * 16777215), e = f.index = parseInt(Math.random() * 16777215, 10), l = (typeof process > "u" || typeof process.pid != "number" ? Math.floor(Math.random() * 1e5) : process.pid) % 65535, d = (() => {
    try {
      return _Buffer;
    } catch {
      try {
        return Buffer;
      } catch {
        return null;
      }
    }
  })(), i = function(_) {
    return !!(_ != null && _.constructor && typeof _.constructor.isBuffer == "function" && _.constructor.isBuffer(_));
  }, t = [], r = 0; r < 256; r++)
    t[r] = (r <= 15 ? "0" : "") + r.toString(16);
  var a = new RegExp("^[0-9a-fA-F]{24}$"), n = [];
  for (r = 0; r < 10; ) n[48 + r] = r++;
  for (; r < 16; ) n[55 + r] = n[87 + r] = r++;
  function f(_) {
    if (!(this instanceof f)) return new f(_);
    if (_ && (_ instanceof f || _._bsontype === "ObjectID"))
      return _;
    if (this._bsontype = "ObjectID", _ == null || typeof _ == "number") {
      this.id = this.generate(_);
      return;
    }
    var S = f.isValid(_);
    if (!S && _ != null)
      throw new Error(
        "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
      );
    if (S && typeof _ == "string" && _.length === 24)
      return f.createFromHexString(_);
    if (_ != null && _.length === 12)
      this.id = _;
    else {
      if (_ != null && typeof _.toHexString == "function")
        return _;
      throw new Error(
        "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
      );
    }
  }
  Bt = f, f.default = f, f.createFromTime = function(_) {
    return _ = parseInt(_, 10) % 4294967295, new f(o(8, _) + "0000000000000000");
  }, f.createFromHexString = function(_) {
    if (typeof _ > "u" || _ != null && _.length !== 24)
      throw new Error(
        "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
      );
    for (var S = "", h = 0; h < 24; )
      S += String.fromCharCode(n[_.charCodeAt(h++)] << 4 | n[_.charCodeAt(h++)]);
    return new f(S);
  }, f.isValid = function(_) {
    return _ == null ? !1 : typeof _ == "number" ? !0 : typeof _ == "string" ? _.length === 12 || _.length === 24 && a.test(_) : _ instanceof f ? !0 : i(_) ? f.isValid(_.toString("hex")) : typeof _.toHexString == "function" && d && (_.id instanceof d || typeof _.id == "string") ? _.id.length === 12 || _.id.length === 24 && a.test(_.id) : !1;
  }, f.prototype = {
    constructor: f,
    /**
     * Return the ObjectID id as a 24 byte hex string representation
     *
     * @return {String} return the 24 byte hex string representation.
     * @api public
     */
    toHexString: function() {
      if (!this.id || !this.id.length)
        throw new Error(
          "invalid ObjectId, ObjectId.id must be either a string or a Buffer, but is [" + JSON.stringify(this.id) + "]"
        );
      if (this.id.length === 24)
        return this.id;
      if (i(this.id))
        return this.id.toString("hex");
      for (var _ = "", S = 0; S < this.id.length; S++)
        _ += t[this.id.charCodeAt(S)];
      return _;
    },
    /**
     * Compares the equality of this ObjectID with `otherID`.
     *
     * @param {Object} otherId ObjectID instance to compare against.
     * @return {Boolean} the result of comparing two ObjectID's
     * @api public
     */
    equals: function(_) {
      return _ instanceof f ? this.toString() === _.toString() : typeof _ == "string" && f.isValid(_) && _.length === 12 && i(this.id) ? _ === this.id.toString("binary") : typeof _ == "string" && f.isValid(_) && _.length === 24 ? _.toLowerCase() === this.toHexString() : typeof _ == "string" && f.isValid(_) && _.length === 12 ? _ === this.id : _ != null && (_ instanceof f || _.toHexString) ? _.toHexString() === this.toHexString() : !1;
    },
    /**
     * Returns the generation date (accurate up to the second) that this ID was generated.
     *
     * @return {Date} the generation date
     * @api public
     */
    getTimestamp: function() {
      var _ = /* @__PURE__ */ new Date(), S;
      return i(this.id) ? S = this.id[3] | this.id[2] << 8 | this.id[1] << 16 | this.id[0] << 24 : S = this.id.charCodeAt(3) | this.id.charCodeAt(2) << 8 | this.id.charCodeAt(1) << 16 | this.id.charCodeAt(0) << 24, _.setTime(Math.floor(S) * 1e3), _;
    },
    /**
    * Generate a 12 byte id buffer used in ObjectID's
    *
    * @method
    * @param {number} [time] optional parameter allowing to pass in a second based timestamp.
    * @return {string} return the 12 byte id buffer string.
    */
    generate: function(_) {
      typeof _ != "number" && (_ = ~~(Date.now() / 1e3)), _ = parseInt(_, 10) % 4294967295;
      var S = v();
      return String.fromCharCode(
        _ >> 24 & 255,
        _ >> 16 & 255,
        _ >> 8 & 255,
        _ & 255,
        u >> 16 & 255,
        u >> 8 & 255,
        u & 255,
        l >> 8 & 255,
        l & 255,
        S >> 16 & 255,
        S >> 8 & 255,
        S & 255
      );
    }
  };
  function v() {
    return e = (e + 1) % 16777215;
  }
  function o(_, S) {
    return S = S.toString(16), S.length === _ ? S : "00000000".substring(S.length, _) + S;
  }
  var s = Symbol && Symbol.for && /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom") || "inspect";
  return f.prototype[s] = function() {
    return "ObjectID(" + this + ")";
  }, f.prototype.toJSON = f.prototype.toHexString, f.prototype.toString = f.prototype.toHexString, Bt;
}
var ys = Ms();
const xs = /* @__PURE__ */ Wn(ys), Hs = 20, wt = "AutomationsResponseType", ks = Kn({
  dataType: wt,
  path: "/automations/"
}), Gs = Gu({
  dataType: wt,
  path: (u) => `/automations/${u}/`
}), Ws = Re({
  method: "PUT",
  path: ({ id: u }) => `/automations/${u}/`,
  body: ({ status: u, actions: e, edges: l }) => ({
    automations: [{
      status: u,
      actions: e,
      edges: l
    }]
  }),
  invalidateQueries: {
    dataType: wt
  }
}), ou = () => xs().toHexString(), Cs = JSON.stringify({
  root: {
    children: [],
    direction: null,
    format: "",
    indent: 0,
    type: "root",
    version: 1
  }
}), Ds = () => ({
  id: ou(),
  type: "wait",
  data: { wait_hours: 24 }
}), Es = () => ({
  id: ou(),
  type: "send_email",
  data: {
    email_subject: "Untitled email",
    email_lexical: Cs,
    email_sender_name: null,
    email_sender_email: null,
    email_sender_reply_to: null,
    // TODO NY-1252: replace this placeholder when email design settings are available.
    email_design_setting_id: "placeholder"
  }
}), Gn = (u, e) => {
  if (!u.actions.some((l) => l.id === e))
    throw new Error(`spliceAction: anchor references unknown action id "${e}"`);
}, Ls = (u, e, l) => u.edges.some((d) => d.source_action_id === e && d.target_action_id === l), du = ({ detail: u, action: e, anchor: l }) => {
  const { previousActionId: d, nextActionId: i } = l;
  if (d !== void 0 && Gn(u, d), i !== void 0 && Gn(u, i), d === void 0 && i === void 0 && u.actions.length > 0)
    throw new Error("spliceAction: anchor is required when inserting into a non-empty automation");
  if (d !== void 0 && i !== void 0 && !Ls(u, d, i))
    throw new Error(`spliceAction: anchor edge "${d}" -> "${i}" does not exist`);
  if (d !== void 0 && i === void 0 && u.edges.some((a) => a.source_action_id === d))
    throw new Error(`spliceAction: anchor previousActionId "${d}" is not the tail action`);
  if (d === void 0 && i !== void 0 && u.edges.some((a) => a.target_action_id === i))
    throw new Error(`spliceAction: anchor nextActionId "${i}" is not the head action`);
  const t = [...u.actions, e], r = u.edges.filter((a) => !(a.source_action_id === d && a.target_action_id === i));
  return d !== void 0 && r.push({ source_action_id: d, target_action_id: e.id }), i !== void 0 && r.push({ source_action_id: e.id, target_action_id: i }), { ...u, actions: t, edges: r };
}, Ks = ({ detail: u, anchor: e }) => du({ detail: u, action: Ds(), anchor: e }), Vs = ({ detail: u, anchor: e }) => du({ detail: u, action: Es(), anchor: e }), Ys = ({ detail: u, actionId: e, waitHours: l }) => {
  if (!Number.isSafeInteger(l) || l <= 0)
    throw new Error(`updateWaitAction: waitHours must be a safe positive integer, received "${l}"`);
  let d = !1;
  const i = u.actions.map((t) => {
    if (t.id === e) {
      if (t.type !== "wait")
        throw new Error(`updateWaitAction: action "${e}" is not a wait action`);
      return d = !0, {
        ...t,
        data: {
          ...t.data,
          wait_hours: l
        }
      };
    }
    return t;
  });
  if (!d)
    throw new Error(`updateWaitAction: unknown action id "${e}"`);
  return { ...u, actions: i, edges: [...u.edges] };
}, zs = ({ detail: u, actionId: e, emailSubject: l, emailLexical: d }) => {
  let i = !1;
  const t = u.actions.map((r) => {
    if (r.id === e) {
      if (r.type !== "send_email")
        throw new Error(`updateSendEmailAction: action "${e}" is not a send_email action`);
      return i = !0, {
        ...r,
        data: {
          ...r.data,
          email_subject: l,
          email_lexical: d
        }
      };
    }
    return r;
  });
  if (!i)
    throw new Error(`updateSendEmailAction: unknown action id "${e}"`);
  return { ...u, actions: t, edges: [...u.edges] };
}, Js = ({ detail: u, actionId: e }) => {
  const l = u.actions.filter((a) => a.id !== e);
  if (!(l.length < u.actions.length))
    throw new Error(`removeAction: unknown action id "${e}"`);
  const i = u.edges.find((a) => a.target_action_id === e), t = u.edges.find((a) => a.source_action_id === e), r = u.edges.filter(
    (a) => a.source_action_id !== e && a.target_action_id !== e
  );
  return i && t && r.push({
    source_action_id: i.source_action_id,
    target_action_id: t.target_action_id
  }), { ...u, actions: l, edges: r };
};
export {
  Bs as A,
  Hs as M,
  Ks as a,
  Ys as b,
  Ts as c,
  Zs as d,
  ks as e,
  bs as f,
  qs as g,
  Ws as h,
  Vs as i,
  Fs as j,
  Us as k,
  Gs as l,
  ws as m,
  Js as r,
  zs as u,
  Ns as v
};
//# sourceMappingURL=automations-BmGKngyG.mjs.map

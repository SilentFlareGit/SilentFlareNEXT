import { d as t } from "./hooks-D4pJ_p_P.mjs";
const i = "ConfigResponseType", g = t({
  dataType: i,
  path: "/config/"
}), m = (e) => !!e?.hostSettings?.managedEmail?.enabled, p = (e) => {
  const n = e?.hostSettings?.managedEmail?.sendingDomain;
  return typeof n == "string" && n.length > 0;
}, c = (e) => e?.hostSettings?.managedEmail?.sendingDomain, o = "SettingsResponseType", d = t({
  dataType: o,
  path: "/settings/",
  defaultSearchParams: {
    group: "site,theme,private,members,portal,newsletter,email,labs,slack,unsplash,views,firstpromoter,editor,comments,analytics,announcement,pintura,donations,security,social_web,explore,transistor"
  }
});
function l(e, n) {
  return n.map((s) => e?.find((a) => a.key === s)?.value);
}
export {
  d as a,
  l as g,
  p as h,
  m as i,
  c as s,
  g as u
};
//# sourceMappingURL=settings-DJqx19W1.mjs.map

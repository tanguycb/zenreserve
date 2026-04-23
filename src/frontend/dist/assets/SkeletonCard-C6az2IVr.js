import { j as jsxRuntimeExports, c as cn } from "./index-BNayfcmF.js";
import { S as Skeleton } from "./skeleton-D2EeOrWT.js";
function SkeletonCard({
  className,
  lines = 3,
  showAvatar = false,
  showImage = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "rounded-lg border border-border bg-card p-5 space-y-3",
        className
      ),
      "aria-busy": "true",
      "aria-label": "Inhoud wordt geladen...",
      children: [
        showImage && /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-36 rounded-md" }),
        showAvatar && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-10 rounded-full shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
          ] })
        ] }),
        !showAvatar && Array.from({ length: lines }, (_, i) => `line-${i}`).map((key, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")
          },
          key
        ))
      ]
    }
  );
}
function SkeletonTableRow() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 px-4 py-3 border-b border-border last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-md" })
  ] });
}
export {
  SkeletonTableRow as S,
  SkeletonCard as a
};

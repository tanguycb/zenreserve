import { i as createLucideIcon, r as reactExports, j as jsxRuntimeExports, P as useId, Y as Primitive, Z as composeEventHandlers, a5 as createContextScope, b1 as createCollection, V as useComposedRefs, b2 as useDirection, Q as useControllableState, b3 as useCallbackRef, _ as Presence, c as cn, aK as useActor, b4 as useQuery, a8 as useQueryClient, aL as useMutation, t as ue, aM as createActor, u as useTranslation, b5 as useNotificationSettings, b6 as useUpdateNotificationSettings, an as Bell, ar as CircleCheck, X, g as Clock, w as Label, B as Button, s as motion, q as AnimatePresence, O as Badge, I as Input, M as ChevronDown } from "./index-BNayfcmF.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-D5EHXLzH.js";
import { S as Skeleton } from "./skeleton-D2EeOrWT.js";
import { S as Switch } from "./switch-Da4cPyDO.js";
import { M as Mail } from "./mail-Bhz2n6KZ.js";
import { C as CircleAlert } from "./circle-alert-dyy_CREt.js";
import { L as List$1 } from "./list-Df0hlkMn.js";
import { S as Star } from "./star-h0dWBoX6.js";
import { M as MessageSquare } from "./message-square-CN7hfjg6.js";
import { S as Save } from "./save-DmaA-fW0.js";
import { R as RotateCcw } from "./rotate-ccw-DUbkDf76.js";
import { U as Upload } from "./upload-B8_9SfNZ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    { d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8", key: "mg9rjx" }
  ]
];
const Bold = createLucideIcon("bold", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["line", { x1: "19", x2: "10", y1: "4", y2: "4", key: "15jd3p" }],
  ["line", { x1: "14", x2: "5", y1: "20", y2: "20", key: "bu0au3" }],
  ["line", { x1: "15", x2: "9", y1: "4", y2: "20", key: "uljnxc" }]
];
const Italic = createLucideIcon("italic", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m14.622 17.897-10.68-2.913", key: "vj2p1u" }],
  [
    "path",
    {
      d: "M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z",
      key: "18tc5c"
    }
  ],
  [
    "path",
    {
      d: "M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15",
      key: "ytzfxy"
    }
  ]
];
const Paintbrush = createLucideIcon("paintbrush", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 4v6a6 6 0 0 0 12 0V4", key: "9kb039" }],
  ["line", { x1: "4", x2: "20", y1: "20", y2: "20", key: "nun2al" }]
];
const Underline = createLucideIcon("underline", __iconNode);
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
const DEFAULT_TEMPLATES = {
  confirmation: {
    templateType: "confirmation",
    subject: "Uw reservering bij {{restaurant_name}} is bevestigd",
    heading: "Reservering bevestigd! 🎉",
    bodyHtml: "<p>Beste <strong>{{guest_name}}</strong>,</p><p>Wij zijn verheugd uw reservering te bevestigen. We kijken ernaar uit u te verwelkomen.</p><p><strong>📅 Datum:</strong> {{date}}<br/><strong>⏰ Tijd:</strong> {{time}}<br/><strong>👥 Aantal personen:</strong> {{party_size}}<br/><strong>🔖 Reserveringsnummer:</strong> {{reservation_id}}</p>",
    footer: "Met vriendelijke groeten,\n{{restaurant_name}}",
    accentColor: "#c8a96e",
    backgroundColor: "#faf8f5",
    logoUrl: ""
  },
  reminder_24h: {
    templateType: "reminder_24h",
    subject: "Herinnering: uw reservering morgen bij {{restaurant_name}}",
    heading: "Tot morgen! 👋",
    bodyHtml: "<p>Beste <strong>{{guest_name}}</strong>,</p><p>Dit is een vriendelijke herinnering dat u morgen een tafel heeft gereserveerd.</p><p><strong>📅 Datum:</strong> {{date}}<br/><strong>⏰ Tijd:</strong> {{time}}<br/><strong>👥 Aantal personen:</strong> {{party_size}}</p><p>Heeft u aanpassingen nodig? Neem dan tijdig contact met ons op.</p>",
    footer: "Tot ziens,\n{{restaurant_name}}",
    accentColor: "#c8a96e",
    backgroundColor: "#faf8f5",
    logoUrl: ""
  },
  reminder_2h: {
    templateType: "reminder_2h",
    subject: "Over 2 uur zien we u bij {{restaurant_name}}",
    heading: "We zien u zo! ✨",
    bodyHtml: "<p>Beste <strong>{{guest_name}}</strong>,</p><p>Uw tafel staat klaar — over 2 uur verwachten we u!</p><p><strong>⏰ Tijd:</strong> {{time}}<br/><strong>👥 Aantal personen:</strong> {{party_size}}</p><p>Wij zijn er klaar voor. Tot zo!</p>",
    footer: "Tot straks,\n{{restaurant_name}}",
    accentColor: "#c8a96e",
    backgroundColor: "#faf8f5",
    logoUrl: ""
  },
  cancellation: {
    templateType: "cancellation",
    subject: "Uw reservering bij {{restaurant_name}} is geannuleerd",
    heading: "Reservering geannuleerd",
    bodyHtml: "<p>Beste <strong>{{guest_name}}</strong>,</p><p>Uw reservering op <strong>{{date}}</strong> om <strong>{{time}}</strong> is geannuleerd ({{reservation_id}}).</p><p>We hopen u binnenkort te mogen verwelkomen. Heeft u vragen, neem dan gerust contact met ons op.</p>",
    footer: "Met vriendelijke groeten,\n{{restaurant_name}}",
    accentColor: "#c8a96e",
    backgroundColor: "#faf8f5",
    logoUrl: ""
  }
};
const STORAGE_KEY$1 = "zenreserve_email_templates_v2";
const TEMPLATE_TYPES = [
  "confirmation",
  "reminder_24h",
  "reminder_2h",
  "cancellation"
];
function loadAllFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY$1);
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return null;
}
function getDefaultTemplates() {
  return Object.fromEntries(
    TEMPLATE_TYPES.map((t) => [t, { id: t, ...DEFAULT_TEMPLATES[t] }])
  );
}
function fromBackend(bt) {
  return {
    id: bt.id || bt.templateType,
    templateType: bt.templateType,
    subject: bt.subject,
    heading: bt.heading,
    bodyHtml: bt.bodyHtml,
    footer: bt.footer,
    accentColor: bt.accentColor,
    backgroundColor: bt.backgroundColor,
    logoUrl: bt.logoUrl
  };
}
function toBackend(t) {
  return {
    id: t.id,
    templateType: t.templateType,
    subject: t.subject,
    heading: t.heading,
    bodyHtml: t.bodyHtml,
    footer: t.footer,
    accentColor: t.accentColor,
    backgroundColor: t.backgroundColor,
    logoUrl: t.logoUrl
  };
}
const QK = ["emailTemplates"];
function useEmailTemplates() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: QK,
    queryFn: async () => {
      if (!actor) return getDefaultTemplates();
      const backendTemplates = await actor.getEmailTemplates();
      if (backendTemplates.length > 0) {
        const result = getDefaultTemplates();
        for (const bt of backendTemplates) {
          const type = bt.templateType;
          if (TEMPLATE_TYPES.includes(type)) {
            result[type] = fromBackend(bt);
          }
        }
        return result;
      }
      const stored = loadAllFromStorage();
      if (stored) {
        const templatesArray = Object.values(stored).map(toBackend);
        try {
          await actor.saveEmailTemplates(templatesArray);
          localStorage.removeItem(STORAGE_KEY$1);
        } catch {
        }
        return stored;
      }
      return getDefaultTemplates();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useSaveEmailTemplate() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (template) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.saveEmailTemplate(toBackend(template));
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onMutate: async (template) => {
      await queryClient.cancelQueries({ queryKey: QK });
      const prev = queryClient.getQueryData(QK);
      queryClient.setQueryData(
        QK,
        (old) => {
          if (!old) return old;
          return { ...old, [template.templateType]: template };
        }
      );
      return { prev };
    },
    onError: (_err, _template, context) => {
      if (context && typeof context === "object" && "prev" in context) {
        queryClient.setQueryData(QK, context.prev);
      }
      ue.error("Sjabloon opslaan mislukt. Probeer opnieuw.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK });
    }
  });
}
function useResetEmailTemplate() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (templateType) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.resetEmailTemplate(templateType);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onMutate: async (templateType) => {
      await queryClient.cancelQueries({ queryKey: QK });
      const prev = queryClient.getQueryData(QK);
      queryClient.setQueryData(
        QK,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            [templateType]: {
              id: templateType,
              ...DEFAULT_TEMPLATES[templateType]
            }
          };
        }
      );
      return { prev };
    },
    onError: (_err, _type, context) => {
      if (context && typeof context === "object" && "prev" in context) {
        queryClient.setQueryData(QK, context.prev);
      }
      ue.error("Sjabloon resetten mislukt. Probeer opnieuw.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK });
    }
  });
}
function useApplyHouseStyleToAll() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ accentColor, backgroundColor, logoUrl }) => {
      if (!actor) throw new Error("Actor not available");
      const current = queryClient.getQueryData(QK) ?? getDefaultTemplates();
      const updated = TEMPLATE_TYPES.map((type) => ({
        ...current[type],
        accentColor,
        backgroundColor,
        logoUrl
      }));
      const result = await actor.saveEmailTemplates(updated.map(toBackend));
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onMutate: async ({ accentColor, backgroundColor, logoUrl }) => {
      await queryClient.cancelQueries({ queryKey: QK });
      const prev = queryClient.getQueryData(QK);
      queryClient.setQueryData(
        QK,
        (old) => {
          if (!old) return old;
          const result = { ...old };
          for (const type of TEMPLATE_TYPES) {
            result[type] = {
              ...result[type],
              accentColor,
              backgroundColor,
              logoUrl
            };
          }
          return result;
        }
      );
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context && typeof context === "object" && "prev" in context) {
        queryClient.setQueryData(QK, context.prev);
      }
      ue.error("Huisstijl toepassen mislukt. Probeer opnieuw.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK });
    }
  });
}
const STORAGE_KEY = "zenreserve_review_requests_v1";
const DEFAULT_SETTINGS = {
  enabled: false,
  delay: "hour24",
  message: "Beste {{guest_name}}, bedankt voor uw bezoek aan {{restaurant_name}}! Wij hopen u snel weer te mogen verwelkomen. Zou u een moment de tijd willen nemen om uw ervaring te beoordelen?"
};
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return DEFAULT_SETTINGS;
}
function saveToStorage(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
  }
}
function useReviewRequests() {
  const { actor, isFetching } = useActor(createActor);
  const [settings, setSettings] = reactExports.useState(loadFromStorage);
  const [saved, setSaved] = reactExports.useState(loadFromStorage);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!actor || isFetching) return;
    let cancelled = false;
    (async () => {
      try {
        const backendActor = actor;
        if (typeof backendActor.getReviewRequestSettings === "function") {
          const result = await backendActor.getReviewRequestSettings();
          if (!cancelled && result) {
            const raw = result;
            const delayVariant = raw.delay;
            const delay = delayVariant ? Object.keys(delayVariant)[0] === "hour1" ? "hour1" : Object.keys(delayVariant)[0] === "hour2" ? "hour2" : "hour24" : "hour24";
            const mapped = {
              enabled: Boolean(raw.enabled),
              delay,
              message: String(raw.message ?? DEFAULT_SETTINGS.message)
            };
            setSettings(mapped);
            setSaved(mapped);
            saveToStorage(mapped);
          }
        }
      } catch {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching]);
  const isDirty = settings.enabled !== saved.enabled || settings.delay !== saved.delay || settings.message !== saved.message;
  const update = reactExports.useCallback(
    (key, value) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );
  const save = reactExports.useCallback(async () => {
    setIsSaving(true);
    try {
      if (actor && !isFetching) {
        const backendActor = actor;
        if (typeof backendActor.saveReviewRequestSettings === "function") {
          const delayVariant = { [settings.delay]: null };
          const result = await backendActor.saveReviewRequestSettings(
            settings.enabled,
            delayVariant,
            settings.message
          );
          const res = result;
          if (res && "err" in res) {
            return { ok: false, error: String(res.err) };
          }
        }
      }
      saveToStorage(settings);
      setSaved({ ...settings });
      return { ok: true };
    } catch {
      saveToStorage(settings);
      setSaved({ ...settings });
      return { ok: true };
    } finally {
      setIsSaving(false);
    }
  }, [actor, isFetching, settings]);
  const reset = reactExports.useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);
  return {
    settings,
    isLoading: isFetching && !actor,
    isSaving,
    isDirty,
    update,
    save,
    reset
  };
}
const MOCK_DATA = {
  guest_name: "Jan Janssen",
  date: "15 april 2026",
  time: "19:00",
  party_size: "4 personen",
  restaurant_name: "Restaurant Demo",
  reservation_id: "#RES-001"
};
const TEMPLATE_VARS = [
  { key: "{{guest_name}}", label: "{{guest_name}}" },
  { key: "{{date}}", label: "{{date}}" },
  { key: "{{time}}", label: "{{time}}" },
  { key: "{{party_size}}", label: "{{party_size}}" },
  { key: "{{restaurant_name}}", label: "{{restaurant_name}}" },
  { key: "{{reservation_id}}", label: "{{reservation_id}}" }
];
const DEFAULT_NOTIF_SETTINGS = {
  sendConfirmationEmail: true,
  sendReminderEmail: true,
  reminderHoursBefore: [24],
  sendCancellationEmail: true,
  waitlistAutoActivate: true
};
function replaceMockVars(html) {
  return html.replace(/\{\{guest_name\}\}/g, MOCK_DATA.guest_name).replace(/\{\{date\}\}/g, MOCK_DATA.date).replace(/\{\{time\}\}/g, MOCK_DATA.time).replace(/\{\{party_size\}\}/g, MOCK_DATA.party_size).replace(/\{\{restaurant_name\}\}/g, MOCK_DATA.restaurant_name).replace(/\{\{reservation_id\}\}/g, MOCK_DATA.reservation_id);
}
function RichTextEditor({
  value,
  onChange,
  placeholder
}) {
  const editorRef = reactExports.useRef(null);
  const [showVarMenu, setShowVarMenu] = reactExports.useState(false);
  const savedRange = reactExports.useRef(null);
  const { t } = useTranslation("dashboard");
  const lastExternal = reactExports.useRef(value);
  reactExports.useEffect(() => {
    if (editorRef.current && value !== lastExternal.current) {
      editorRef.current.innerHTML = value;
      lastExternal.current = value;
    }
  }, [value]);
  reactExports.useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = lastExternal.current;
    }
  }, []);
  const execCmd = (cmd, val) => {
    var _a;
    (_a = editorRef.current) == null ? void 0 : _a.focus();
    document.execCommand(cmd, false, val);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastExternal.current = html;
      onChange(html);
    }
  };
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastExternal.current = html;
      onChange(html);
    }
  };
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };
  const insertVar = (varKey) => {
    var _a;
    (_a = editorRef.current) == null ? void 0 : _a.focus();
    const sel = window.getSelection();
    if (savedRange.current) {
      sel == null ? void 0 : sel.removeAllRanges();
      sel == null ? void 0 : sel.addRange(savedRange.current);
    }
    document.execCommand("insertText", false, varKey);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastExternal.current = html;
      onChange(html);
    }
    setShowVarMenu(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border overflow-hidden bg-background focus-within:ring-2 focus-within:ring-primary/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onMouseDown: (e) => {
            e.preventDefault();
            execCmd("bold");
          },
          className: "h-7 w-7 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
          title: t("settings.notifications.editor.bold"),
          "data-ocid": "rte-bold",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { className: "h-3.5 w-3.5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onMouseDown: (e) => {
            e.preventDefault();
            execCmd("italic");
          },
          className: "h-7 w-7 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
          title: t("settings.notifications.editor.italic"),
          "data-ocid": "rte-italic",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Italic, { className: "h-3.5 w-3.5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onMouseDown: (e) => {
            e.preventDefault();
            execCmd("underline");
          },
          className: "h-7 w-7 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
          title: t("settings.notifications.editor.underline"),
          "data-ocid": "rte-underline",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Underline, { className: "h-3.5 w-3.5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-4 bg-border mx-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onMouseDown: (e) => {
              e.preventDefault();
              saveSelection();
            },
            onClick: () => setShowVarMenu((v) => !v),
            className: "flex items-center gap-1 h-7 px-2 rounded hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground",
            "data-ocid": "rte-vars-trigger",
            children: [
              t("settings.notifications.editor.insertVar"),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" })
            ]
          }
        ),
        showVarMenu && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 mt-1 z-20 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[180px]", children: TEMPLATE_VARS.map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => insertVar(key),
            className: "flex w-full items-center px-3 py-2 text-xs hover:bg-muted transition-colors text-left font-mono text-primary/80",
            "data-ocid": `rte-var-${key}`,
            children: label
          },
          key
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: editorRef,
        contentEditable: true,
        suppressContentEditableWarning: true,
        onInput: handleInput,
        onBlur: saveSelection,
        "data-placeholder": placeholder,
        className: "min-h-[140px] max-h-[280px] overflow-y-auto px-4 py-3 text-sm text-foreground outline-none [&_p]:mb-2 [&_p:empty]:hidden empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/60 empty:before:pointer-events-none",
        "data-ocid": "rte-body"
      }
    )
  ] });
}
function ColorPicker({
  label,
  value,
  onChange,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-9 w-9 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "color",
          value,
          onChange: (e) => onChange(e.target.value),
          className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
          "data-ocid": `${ocid}-native`,
          "aria-label": label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-9 w-9 rounded-lg border-2 border-border shadow-sm cursor-pointer",
          style: { backgroundColor: value }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value,
          onChange: (e) => onChange(e.target.value),
          maxLength: 7,
          className: "h-8 font-mono text-xs bg-background",
          "data-ocid": ocid
        }
      )
    ] })
  ] });
}
function LogoUploader({
  value,
  onChange
}) {
  const { t } = useTranslation("dashboard");
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const uploadFile = async (file) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      ue.error(t("settings.notifications.logoTooLarge"));
      return;
    }
    setIsUploading(true);
    try {
      const modulePath = "@caffeineai/object-storage";
      const mod = await import(
        /* @vite-ignore */
        modulePath
      ).catch(
        () => null
      );
      const uploadFn = mod && typeof mod.uploadFile === "function" ? mod.uploadFile : null;
      if (uploadFn) {
        onChange(await uploadFn(file, { folder: "email-logos", public: true }));
      } else {
        onChange(URL.createObjectURL(file));
      }
    } catch {
      onChange(URL.createObjectURL(file));
    } finally {
      setIsUploading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: t("settings.notifications.editor.logo") }),
    value ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: value,
          alt: "logo preview",
          className: "h-10 max-w-[120px] object-contain rounded"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: t("settings.notifications.editor.logoUploaded") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => onChange(""),
          className: "shrink-0 text-destructive hover:text-destructive",
          "data-ocid": "logo-remove",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onDragOver: (e) => {
          e.preventDefault();
          setIsDragging(true);
        },
        onDragLeave: () => setIsDragging(false),
        onDrop: (e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) uploadFile(file);
        },
        onClick: () => {
          var _a;
          return !isUploading && ((_a = fileRef.current) == null ? void 0 : _a.click());
        },
        disabled: isUploading,
        className: `relative w-full flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${isDragging ? "border-primary/60 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/20"}`,
        "data-ocid": "logo-dropzone",
        children: [
          isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: isUploading ? t("settings.notifications.editor.logoUploading", {
            defaultValue: "Uploading…"
          }) : t("settings.notifications.editor.logoDragHint") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60", children: t("settings.notifications.editor.logoSizeLimit") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileRef,
              type: "file",
              accept: "image/*",
              className: "hidden",
              onChange: (e) => {
                var _a;
                const file = (_a = e.target.files) == null ? void 0 : _a[0];
                if (file) uploadFile(file);
              },
              "data-ocid": "logo-file-input"
            }
          )
        ]
      }
    )
  ] });
}
function EmailPreview({ template }) {
  const { t } = useTranslation("dashboard");
  const subject = replaceMockVars(template.subject);
  const heading = replaceMockVars(template.heading);
  const bodyHtml = replaceMockVars(template.bodyHtml);
  const footer = replaceMockVars(template.footer);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: t("settings.notifications.editor.preview") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs ml-auto", children: t("settings.notifications.editor.previewMockBadge") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl overflow-hidden border border-border shadow-sm",
        style: {
          backgroundColor: template.backgroundColor || "var(--background)"
        },
        "data-ocid": "email-preview",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2.5 bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
              t("settings.notifications.editor.subjectLabel"),
              ":"
            ] }),
            " ",
            subject || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic opacity-60", children: t("settings.notifications.editor.subjectPlaceholder") })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
            template.logoUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: template.logoUrl,
                alt: "restaurant logo",
                className: "h-12 max-w-[160px] object-contain"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-1 rounded-full mb-5",
                style: { backgroundColor: template.accentColor || "var(--accent)" }
              }
            ),
            heading && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                className: "text-xl font-bold mb-4",
                style: { color: template.accentColor || "var(--accent)" },
                children: heading
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-sm leading-relaxed text-foreground [&_p]:mb-3 [&_strong]:font-semibold",
                dangerouslySetInnerHTML: { __html: bodyHtml }
              }
            ),
            footer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 pt-4 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground whitespace-pre-wrap", children: footer }) })
          ] })
        ]
      }
    )
  ] });
}
const TEMPLATE_LABELS = {
  confirmation: "Bevestiging",
  reminder_24h: "Herinnering 24u",
  reminder_2h: "Herinnering 2u",
  cancellation: "Annulering"
};
const ALL_TEMPLATE_TYPES = [
  "confirmation",
  "reminder_24h",
  "reminder_2h",
  "cancellation"
];
function ApplyAllModal({
  open,
  onOpenChange,
  houseStyle,
  allTemplates
}) {
  const { t } = useTranslation("dashboard");
  const applyAll = useApplyHouseStyleToAll();
  const [isApplying, setIsApplying] = reactExports.useState(false);
  const handleConfirm = async () => {
    setIsApplying(true);
    try {
      await applyAll.mutateAsync(houseStyle);
      ue.success(t("settings.notifications.applyAll.successToast"));
      onOpenChange(false);
    } catch {
      ue.error(t("settings.saveError"));
    } finally {
      setIsApplying(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "max-w-2xl", "data-ocid": "apply-all-modal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Paintbrush, { className: "h-5 w-5 text-primary" }),
        t("settings.notifications.applyAll.modalTitle")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: t("settings.notifications.applyAll.modalDesc") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border overflow-hidden my-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 divide-x divide-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: t("settings.notifications.applyAll.beforeLabel") }),
          ALL_TEMPLATE_TYPES.map((type) => {
            const tpl = allTemplates[type];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-3 w-3 rounded-full border border-border shrink-0",
                  style: { backgroundColor: tpl.accentColor }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-3 w-8 rounded border border-border shrink-0",
                  style: { backgroundColor: tpl.backgroundColor }
                }
              ),
              tpl.logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: tpl.logoUrl,
                  alt: "",
                  className: "h-4 max-w-[40px] object-contain rounded"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/50", children: "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground truncate", children: TEMPLATE_LABELS[type] })
            ] }, type);
          })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3 bg-primary/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-primary uppercase tracking-wide", children: t("settings.notifications.applyAll.afterLabel") }),
          ALL_TEMPLATE_TYPES.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-3 w-3 rounded-full border border-border shrink-0",
                style: { backgroundColor: houseStyle.accentColor }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-3 w-8 rounded border border-border shrink-0",
                style: { backgroundColor: houseStyle.backgroundColor }
              }
            ),
            houseStyle.logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: houseStyle.logoUrl,
                alt: "",
                className: "h-4 max-w-[40px] object-contain rounded"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/50", children: "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground font-medium truncate", children: TEMPLATE_LABELS[type] })
          ] }, type))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t border-border bg-muted/20 flex items-center gap-6 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-5 w-5 rounded border border-border",
              style: { backgroundColor: houseStyle.accentColor }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            t("settings.notifications.applyAll.accentColorLabel"),
            ":",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: houseStyle.accentColor })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-5 w-5 rounded border border-border",
              style: { backgroundColor: houseStyle.backgroundColor }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            t("settings.notifications.applyAll.bgColorLabel"),
            ":",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: houseStyle.backgroundColor })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          t("settings.notifications.applyAll.logoLabel"),
          ":",
          " ",
          houseStyle.logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: houseStyle.logoUrl,
              alt: "",
              className: "inline h-4 max-w-[60px] object-contain rounded ml-1"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: t("settings.notifications.applyAll.noLogo") })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: isApplying, "data-ocid": "apply-all-cancel", children: t("settings.notifications.applyAll.cancelBtn") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        AlertDialogAction,
        {
          onClick: handleConfirm,
          disabled: isApplying,
          className: "gap-2",
          "data-ocid": "apply-all-confirm",
          children: [
            isApplying ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Paintbrush, { className: "h-4 w-4" }),
            t("settings.notifications.applyAll.confirmBtn")
          ]
        }
      )
    ] })
  ] }) });
}
function TemplateEditor({
  templateType,
  template,
  onChange
}) {
  const { t } = useTranslation("dashboard");
  const saveTemplate = useSaveEmailTemplate();
  const resetTemplate = useResetEmailTemplate();
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [showReset, setShowReset] = reactExports.useState(false);
  const set = (key, value) => {
    onChange({ ...template, [key]: value });
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveTemplate.mutateAsync(template);
      ue.success(t("settings.notifications.editor.savedToast"));
    } catch {
      ue.error(t("settings.saveError"));
    } finally {
      setIsSaving(false);
    }
  };
  const handleReset = async () => {
    try {
      await resetTemplate.mutateAsync(templateType);
      onChange({ id: templateType, ...DEFAULT_TEMPLATES[templateType] });
      setShowReset(false);
      ue.success(t("settings.notifications.editor.resetToast"));
    } catch {
      ue.error(t("settings.saveError"));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: t("settings.notifications.editor.subject") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: template.subject,
              onChange: (e) => set("subject", e.target.value),
              placeholder: t(
                "settings.notifications.editor.subjectPlaceholder"
              ),
              className: "bg-background",
              "data-ocid": "template-subject"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: t("settings.notifications.editor.heading") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: template.heading,
              onChange: (e) => set("heading", e.target.value),
              placeholder: t(
                "settings.notifications.editor.headingPlaceholder"
              ),
              className: "bg-background",
              "data-ocid": "template-heading"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: t("settings.notifications.editor.body") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RichTextEditor,
            {
              value: template.bodyHtml,
              onChange: (v) => set("bodyHtml", v),
              placeholder: t("settings.notifications.editor.bodyPlaceholder")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: t("settings.notifications.editor.footer") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: template.footer,
              onChange: (e) => set("footer", e.target.value),
              rows: 3,
              placeholder: t("settings.notifications.editor.footerPlaceholder"),
              className: "w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40",
              "data-ocid": "template-footer"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ColorPicker,
            {
              label: t("settings.notifications.editor.accentColor"),
              value: template.accentColor,
              onChange: (v) => set("accentColor", v),
              ocid: "template-accent-color"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ColorPicker,
            {
              label: t("settings.notifications.editor.backgroundColor"),
              value: template.backgroundColor,
              onChange: (v) => set("backgroundColor", v),
              ocid: "template-bg-color"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          LogoUploader,
          {
            value: template.logoUrl,
            onChange: (v) => set("logoUrl", v)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleSave,
              disabled: isSaving,
              className: "gap-2 flex-1",
              "data-ocid": "save-template-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
                isSaving ? t("settings.saving") : t("settings.notifications.editor.save")
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => setShowReset(true),
              className: "gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/40",
              "data-ocid": "reset-template-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" }),
                t("settings.notifications.editor.reset")
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "xl:sticky xl:top-6 xl:self-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmailPreview, { template }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: showReset, onOpenChange: setShowReset, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "reset-confirm-modal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: t("settings.notifications.editor.resetConfirmTitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: t("settings.notifications.editor.resetConfirmDesc") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "reset-cancel", children: t("settings.notifications.editor.resetCancel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            onClick: handleReset,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            "data-ocid": "reset-confirm",
            children: t("settings.notifications.editor.resetConfirm")
          }
        )
      ] })
    ] }) })
  ] });
}
function ToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  icon,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-muted/40 flex items-center justify-center shrink-0 mt-0.5", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Label,
        {
          htmlFor: id,
          className: "text-sm font-medium text-foreground cursor-pointer",
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Switch,
      {
        id,
        checked,
        onCheckedChange,
        "data-ocid": ocid,
        className: "shrink-0"
      }
    )
  ] });
}
const PRESET_HOURS = [1, 2, 3, 6, 12, 24, 48, 72];
function ReminderTagInput({
  value,
  onChange
}) {
  const { t } = useTranslation("dashboard");
  const [inputVal, setInputVal] = reactExports.useState("");
  const addHour = (h) => {
    if (!value.includes(h)) onChange([...value, h].sort((a, b) => a - b));
  };
  const removeHour = (h) => onChange(value.filter((v) => v !== h));
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const parsed = Number.parseInt(inputVal, 10);
      if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 720) {
        addHour(parsed);
        setInputVal("");
      }
    }
    if (e.key === "Backspace" && inputVal === "" && value.length > 0) {
      removeHour(value[value.length - 1]);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 min-h-[36px]", children: [
      value.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/15 border border-primary/30 text-primary text-sm font-medium",
          children: [
            h,
            "h",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => removeHour(h),
                className: "ml-0.5 hover:text-destructive transition-colors",
                "aria-label": t("settings.notifications.removeHour", { h }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
              }
            )
          ]
        },
        h
      )),
      value.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground self-center", children: t("settings.notifications.noReminderHours") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: PRESET_HOURS.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => value.includes(h) ? removeHour(h) : addHour(h),
        className: `px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${value.includes(h) ? "bg-primary/15 border-primary/40 text-primary" : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
        "data-ocid": `reminder-preset-${h}`,
        children: [
          h,
          "u"
        ]
      },
      h
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "number",
          min: 1,
          max: 720,
          value: inputVal,
          onChange: (e) => setInputVal(e.target.value),
          onKeyDown: handleKeyDown,
          placeholder: t("settings.notifications.customHourPlaceholder"),
          className: "w-32 h-8 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
          "data-ocid": "reminder-custom-input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: t("settings.notifications.customHourHint") })
    ] })
  ] });
}
const REVIEW_DELAY_OPTIONS = [
  { value: "hour1", labelKey: "settings.reviewRequests.delay1h" },
  { value: "hour2", labelKey: "settings.reviewRequests.delay2h" },
  { value: "hour24", labelKey: "settings.reviewRequests.delay24h" }
];
const REVIEW_MOCK = {
  guest_name: "Jan Janssen",
  restaurant_name: "Restaurant Demo"
};
function NotificationsSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data: remoteTemplates, isLoading: isLoadingTemplates } = useEmailTemplates();
  const { data: remoteNotif } = useNotificationSettings();
  const updateNotifications = useUpdateNotificationSettings();
  const [notif, setNotif] = reactExports.useState(
    DEFAULT_NOTIF_SETTINGS
  );
  const [savedNotif, setSavedNotif] = reactExports.useState(
    null
  );
  const notifLoadedRef = reactExports.useRef(false);
  const [localTemplates, setLocalTemplates] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (remoteNotif && !notifLoadedRef.current) {
      notifLoadedRef.current = true;
      const loaded = {
        sendConfirmationEmail: remoteNotif.sendConfirmationEmail,
        sendReminderEmail: remoteNotif.sendReminderEmail,
        reminderHoursBefore: remoteNotif.reminderHoursBefore.map(Number),
        sendCancellationEmail: remoteNotif.sendCancellationEmail,
        waitlistAutoActivate: remoteNotif.waitlistAutoActivate
      };
      setNotif(loaded);
      setSavedNotif(loaded);
    }
  }, [remoteNotif]);
  const {
    settings: reviewSettings,
    isLoading: isReviewLoading,
    isSaving: isReviewSaving,
    isDirty: isReviewDirty,
    update: updateReview,
    save: saveReview
  } = useReviewRequests();
  const isNotifDirty = savedNotif === null || JSON.stringify(notif) !== JSON.stringify(savedNotif);
  const [isSavingNotif, setIsSavingNotif] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("confirmation");
  const [showApplyAll, setShowApplyAll] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (remoteTemplates && !localTemplates) {
      setLocalTemplates(remoteTemplates);
    }
  }, [remoteTemplates, localTemplates]);
  const templates = localTemplates ?? remoteTemplates;
  const setNotifField = reactExports.useCallback(
    (key, value) => {
      setNotif((s) => ({ ...s, [key]: value }));
    },
    []
  );
  const updateTemplate = reactExports.useCallback(
    (templateType, tpl) => {
      setLocalTemplates(
        (prev) => prev ? { ...prev, [templateType]: tpl } : prev
      );
    },
    []
  );
  const handleSaveNotif = async () => {
    setIsSavingNotif(true);
    try {
      await updateNotifications.mutateAsync({
        sendConfirmationEmail: notif.sendConfirmationEmail,
        sendReminderEmail: notif.sendReminderEmail,
        reminderHoursBefore: notif.reminderHoursBefore.map(BigInt),
        sendCancellationEmail: notif.sendCancellationEmail,
        waitlistAutoActivate: notif.waitlistAutoActivate
      });
      setSavedNotif(notif);
      ue.success(t("settings.saved"));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[NotificationsSettings] save failed:", err);
      ue.error(`${t("settings.saveError")}: ${message}`);
    } finally {
      setIsSavingNotif(false);
    }
  };
  const TEMPLATE_TABS = [
    {
      key: "confirmation",
      labelKey: "settings.notifications.tabs.confirmation"
    },
    {
      key: "reminder_24h",
      labelKey: "settings.notifications.tabs.reminder24h"
    },
    { key: "reminder_2h", labelKey: "settings.notifications.tabs.reminder2h" },
    {
      key: "cancellation",
      labelKey: "settings.notifications.tabs.cancellation"
    }
  ];
  const activeTemplate = templates == null ? void 0 : templates[activeTab];
  const houseStyle = {
    accentColor: (activeTemplate == null ? void 0 : activeTemplate.accentColor) ?? "#c8a96e",
    backgroundColor: (activeTemplate == null ? void 0 : activeTemplate.backgroundColor) ?? "#faf8f5",
    logoUrl: (activeTemplate == null ? void 0 : activeTemplate.logoUrl) ?? ""
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-7xl space-y-8",
      "data-ocid": "notifications-settings-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground", children: t("settings.nav.notifications") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.notifications.subtitle") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.notifications.emailSection") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-[oklch(var(--status-orange)/0.3)] bg-[oklch(var(--status-orange)/0.1)] px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-[oklch(var(--status-orange))] shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[oklch(var(--status-orange))]", children: t("settings.notifications.emailDisabledNote") })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 divide-y divide-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ToggleRow,
              {
                id: "confirmationToggle",
                label: t("settings.notifications.confirmation"),
                description: t("settings.notifications.confirmationDesc"),
                checked: notif.sendConfirmationEmail,
                onCheckedChange: (v) => setNotifField("sendConfirmationEmail", v),
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-primary/70" }),
                ocid: "toggle-confirmation"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ToggleRow,
              {
                id: "cancellationToggle",
                label: t("settings.notifications.cancellation"),
                description: t("settings.notifications.cancellationDesc"),
                checked: notif.sendCancellationEmail,
                onCheckedChange: (v) => setNotifField("sendCancellationEmail", v),
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-destructive/70" }),
                ocid: "toggle-cancellation"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToggleRow,
                {
                  id: "reminderToggle",
                  label: t("settings.notifications.reminder"),
                  description: t("settings.notifications.reminderDesc"),
                  checked: notif.sendReminderEmail,
                  onCheckedChange: (v) => setNotifField("sendReminderEmail", v),
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-[oklch(var(--status-orange))]" }),
                  ocid: "toggle-reminder"
                }
              ),
              notif.sendReminderEmail && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-13 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: t("settings.notifications.reminderHours") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ReminderTagInput,
                  {
                    value: notif.reminderHoursBefore,
                    onChange: (v) => setNotifField("reminderHoursBefore", v)
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ToggleRow,
              {
                id: "waitlistToggle",
                label: t("settings.notifications.waitlistAutoActivate"),
                description: t("settings.notifications.waitlistAutoActivateDesc"),
                checked: notif.waitlistAutoActivate,
                onCheckedChange: (v) => setNotifField("waitlistAutoActivate", v),
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(List$1, { className: "h-4 w-4 text-primary/70" }),
                ocid: "toggle-waitlist-auto"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between", children: [
            isNotifDirty && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.unsavedChanges") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleSaveNotif,
                disabled: isSavingNotif || !isNotifDirty,
                className: "gap-2 ml-auto",
                "data-ocid": "save-notif-btn",
                children: t(isSavingNotif ? "settings.saving" : "settings.save")
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground flex-1 min-w-0", children: t("settings.notifications.templatesSection") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setShowApplyAll(true),
                className: "gap-2 border-primary/40 text-primary hover:bg-primary/5 hover:border-primary/60 transition-colors shrink-0",
                "data-ocid": "apply-house-style-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Paintbrush, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t("settings.notifications.applyAll.button") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: t("settings.notifications.applyAll.confirmBtn") })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground hidden md:block", children: t("settings.notifications.templatesHint") })
          ] }),
          isLoadingTemplates ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-1/2" })
          ] }) : templates ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Tabs,
            {
              value: activeTab,
              onValueChange: (v) => setActiveTab(v),
              className: "w-full",
              "data-ocid": "template-tabs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pt-5 border-b border-border bg-muted/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, { className: "h-auto p-0 bg-transparent gap-0 flex-wrap", children: TEMPLATE_TABS.map(({ key, labelKey }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TabsTrigger,
                  {
                    value: key,
                    className: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-primary transition-colors",
                    "data-ocid": `tab-${key}`,
                    children: t(labelKey)
                  },
                  key
                )) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: TEMPLATE_TABS.map(
                  ({ key }) => activeTab === key ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TabsContent,
                    {
                      value: key,
                      className: "p-6 mt-0 focus-visible:outline-none",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.div,
                        {
                          initial: { opacity: 0, y: 6 },
                          animate: { opacity: 1, y: 0 },
                          exit: { opacity: 0, y: -6 },
                          transition: { duration: 0.18 },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            TemplateEditor,
                            {
                              templateType: key,
                              template: templates[key],
                              onChange: (tpl) => updateTemplate(key, tpl)
                            }
                          )
                        }
                      )
                    },
                    key
                  ) : null
                ) })
              ]
            }
          ) : null
        ] }),
        templates && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ApplyAllModal,
          {
            open: showApplyAll,
            onOpenChange: setShowApplyAll,
            houseStyle,
            allTemplates: templates
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "section",
          {
            className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden",
            "data-ocid": "review-requests-section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("reviewRequests.title", { ns: "settings" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-[oklch(var(--status-orange)/0.3)] bg-[oklch(var(--status-orange)/0.1)] px-4 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-[oklch(var(--status-orange))] shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[oklch(var(--status-orange))]", children: t("reviewRequests.disabledNote", { ns: "settings" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 space-y-6 pb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ToggleRow,
                  {
                    id: "reviewRequestsToggle",
                    label: t("reviewRequests.enableToggle", { ns: "settings" }),
                    description: t("reviewRequests.enableToggleDesc", {
                      ns: "settings"
                    }),
                    checked: reviewSettings.enabled,
                    onCheckedChange: (v) => updateReview("enabled", v),
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-primary/70" }),
                    ocid: "toggle-review-requests"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: reviewSettings.enabled && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, height: 0 },
                    animate: { opacity: 1, height: "auto" },
                    exit: { opacity: 0, height: 0 },
                    transition: { duration: 0.2 },
                    className: "overflow-hidden space-y-6",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: t("reviewRequests.delayTitle", { ns: "settings" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("reviewRequests.delayDesc", { ns: "settings" }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "flex flex-wrap gap-2",
                            "data-ocid": "review-delay-options",
                            children: REVIEW_DELAY_OPTIONS.map(({ value, labelKey }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: () => updateReview("delay", value),
                                className: `flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${reviewSettings.delay === value ? "bg-primary/10 border-primary/50 text-primary" : "bg-background border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"}`,
                                "data-ocid": `review-delay-${value}`,
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 shrink-0" }),
                                  t(labelKey, { ns: "settings" })
                                ]
                              },
                              value
                            ))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: t("reviewRequests.messageTitle", { ns: "settings" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("reviewRequests.messageDesc", { ns: "settings" }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "textarea",
                          {
                            value: reviewSettings.message,
                            onChange: (e) => updateReview("message", e.target.value.slice(0, 500)),
                            rows: 4,
                            maxLength: 500,
                            placeholder: t("reviewRequests.messagePlaceholder", {
                              ns: "settings"
                            }),
                            className: "w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40",
                            "data-ocid": "review-message-input"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `text-xs ${reviewSettings.message.length >= 500 ? "text-destructive" : "text-muted-foreground"}`,
                            children: reviewSettings.message.length >= 500 ? t("reviewRequests.messageCharLimit", {
                              ns: "settings"
                            }) : t("reviewRequests.messageCharCount", {
                              ns: "settings",
                              count: reviewSettings.message.length
                            })
                          }
                        ) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "review-message-preview", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4 text-muted-foreground" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: t("reviewRequests.previewTitle", { ns: "settings" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs ml-auto", children: t("reviewRequests.previewBadge", { ns: "settings" }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-muted/20 p-5 space-y-3", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-primary" }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: REVIEW_MOCK.restaurant_name }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t(
                                `reviewRequests.delay${reviewSettings.delay === "hour1" ? "1h" : reviewSettings.delay === "hour2" ? "2h" : "24h"}`,
                                { ns: "settings" }
                              ) })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words", children: reviewSettings.message.replace(/\{\{guest_name\}\}/g, REVIEW_MOCK.guest_name).replace(
                            /\{\{restaurant_name\}\}/g,
                            REVIEW_MOCK.restaurant_name
                          ) || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 italic", children: t("reviewRequests.messagePlaceholder", {
                            ns: "settings"
                          }) }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 pt-1", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Star,
                            {
                              className: "h-5 w-5 text-primary/40",
                              "aria-hidden": true
                            },
                            n
                          )) })
                        ] })
                      ] })
                    ]
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between", children: [
                isReviewDirty && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.unsavedChanges") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: async () => {
                      const result = await saveReview();
                      if (result.ok) {
                        ue.success(
                          t("reviewRequests.savedToast", { ns: "settings" })
                        );
                      } else {
                        ue.error(t("reviewRequests.saveError", { ns: "settings" }));
                      }
                    },
                    disabled: isReviewSaving || isReviewLoading || !isReviewDirty,
                    className: "gap-2 ml-auto",
                    "data-ocid": "save-review-requests-btn",
                    children: isReviewSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
                      t("settings.saving")
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
                      t("settings.save")
                    ] })
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  NotificationsSettingsPage as default
};

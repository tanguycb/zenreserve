import { r as reactExports, j as jsxRuntimeExports, _ as Presence, Y as Primitive, Q as useControllableState, V as useComposedRefs, Z as composeEventHandlers, aW as usePrevious, aX as useSize, a5 as createContextScope, G as Check, c as cn, u as useTranslation, e as useCapacityConfig, k as useOpeningHoursConfig, aY as useUpdateCapacityConfig, aZ as useTableGroupDefinitions, a_ as useCreateTableGroupDefinition, a$ as useUpdateTableGroupDefinition, b0 as useDeleteTableGroupDefinition, aj as Minus, I as Input, a7 as Plus, B as Button, w as Label, O as Badge, t as ue } from "./index-BNayfcmF.js";
import { B as BookOpen } from "./book-open-B1GgQIiP.js";
import { T as Trash2 } from "./trash-2-XAAtCYtx.js";
import { L as Layers } from "./layers-jY-i6yiE.js";
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control == null ? void 0 : control.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME;
var Checkbox$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Checkbox$1,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckboxIndicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" })
        }
      )
    }
  );
}
function CapacitySettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data: capacityData, isLoading: capLoading } = useCapacityConfig();
  const { data: hoursData } = useOpeningHoursConfig();
  const updateCapacity = useUpdateCapacityConfig();
  const { data: tableGroupsData } = useTableGroupDefinitions();
  const createGroupMutation = useCreateTableGroupDefinition();
  const updateGroupMutation = useUpdateTableGroupDefinition();
  const deleteGroupMutation = useDeleteTableGroupDefinition();
  const [config, setConfig] = reactExports.useState({
    serviceMaxGuests: {},
    minPartySize: 1,
    maxPartySize: 12,
    zones: [],
    tableTypes: [],
    occupancyCeiling: 85,
    totalSeatsPerSlot: 20
  });
  const [newZoneName, setNewZoneName] = reactExports.useState("");
  const [newTableTypeName, setNewTableTypeName] = reactExports.useState("");
  const [newTableTypeSeats, setNewTableTypeSeats] = reactExports.useState(4);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [tableGroups, setTableGroups] = reactExports.useState([]);
  const [showAddGroup, setShowAddGroup] = reactExports.useState(false);
  const [newGroupName, setNewGroupName] = reactExports.useState("");
  const [newGroupDescription, setNewGroupDescription] = reactExports.useState("");
  const [newGroupTableIds, setNewGroupTableIds] = reactExports.useState([]);
  const [deletingGroupId, setDeletingGroupId] = reactExports.useState(null);
  const [groupSaving, setGroupSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (capacityData) setConfig(capacityData);
  }, [capacityData]);
  reactExports.useEffect(() => {
    if (tableGroupsData) setTableGroups(tableGroupsData);
  }, [tableGroupsData]);
  const calcGroupCapacity = (tableIds) => tableIds.reduce((sum, tid) => {
    const tt = config.tableTypes.find((t2) => t2.id === tid);
    return sum + (tt ? tt.seatsPerTable * tt.count : 0);
  }, 0);
  const toggleNewGroupTable = (tableId) => {
    setNewGroupTableIds(
      (prev) => prev.includes(tableId) ? prev.filter((id) => id !== tableId) : [...prev, tableId]
    );
  };
  const handleAddGroup = async () => {
    const name = newGroupName.trim();
    if (!name || newGroupTableIds.length < 2) return;
    setGroupSaving(true);
    try {
      await createGroupMutation.mutateAsync({
        name,
        tableIds: newGroupTableIds,
        description: newGroupDescription.trim()
      });
      ue.success(t("settings.tableGroups.saved"));
      setShowAddGroup(false);
      setNewGroupName("");
      setNewGroupDescription("");
      setNewGroupTableIds([]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      ue.error(`${t("settings.saveError")}: ${msg}`);
    } finally {
      setGroupSaving(false);
    }
  };
  const handleDeleteGroup = async (id) => {
    if (deletingGroupId !== id) {
      setDeletingGroupId(id);
      return;
    }
    try {
      await deleteGroupMutation.mutateAsync(id);
      ue.success(t("settings.tableGroups.deleted"));
      setDeletingGroupId(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      ue.error(`${t("settings.saveError")}: ${msg}`);
    }
  };
  const handleUpdateGroup = async (group, updates) => {
    const updated = { ...group, ...updates };
    setTableGroups(
      (prev) => prev.map((g) => g.id === group.id ? updated : g)
    );
    try {
      await updateGroupMutation.mutateAsync({
        id: updated.id,
        name: updated.name,
        tableIds: updated.tableIds,
        description: updated.description
      });
    } catch (err) {
      setTableGroups(
        (prev) => prev.map((g) => g.id === group.id ? group : g)
      );
      const msg = err instanceof Error ? err.message : String(err);
      ue.error(`${t("settings.saveError")}: ${msg}`);
    }
  };
  const setServiceMax = (serviceId, value) => {
    setConfig((c) => ({
      ...c,
      serviceMaxGuests: { ...c.serviceMaxGuests, [serviceId]: value }
    }));
  };
  const addZone = () => {
    const name = newZoneName.trim();
    if (!name) return;
    const zone = { id: Date.now().toString(), name, maxGuests: 20 };
    setConfig((c) => ({ ...c, zones: [...c.zones, zone] }));
    setNewZoneName("");
  };
  const updateZone = (id, updates) => {
    setConfig((c) => ({
      ...c,
      zones: c.zones.map((z) => z.id === id ? { ...z, ...updates } : z)
    }));
  };
  const deleteZone = (id) => {
    setConfig((c) => ({ ...c, zones: c.zones.filter((z) => z.id !== id) }));
  };
  const addTableType = () => {
    const name = newTableTypeName.trim();
    if (!name) return;
    const tt = {
      id: Date.now().toString(),
      name,
      seatsPerTable: newTableTypeSeats,
      count: 1
    };
    setConfig((c) => ({ ...c, tableTypes: [...c.tableTypes, tt] }));
    setNewTableTypeName("");
    setNewTableTypeSeats(4);
  };
  const updateTableType = (id, updates) => {
    setConfig((c) => ({
      ...c,
      tableTypes: c.tableTypes.map(
        (tt) => tt.id === id ? { ...tt, ...updates } : tt
      )
    }));
  };
  const deleteTableType = (id) => {
    setConfig((c) => ({
      ...c,
      tableTypes: c.tableTypes.filter((tt) => tt.id !== id)
    }));
  };
  const saveAll = async () => {
    setIsSaving(true);
    try {
      await updateCapacity.mutateAsync(config);
      ue.success(t("settings.capacity.savedWithSync"));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[CapacitySettings] save failed:", err);
      ue.error(`${t("settings.saveError")}: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };
  if (capLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[40vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" }) });
  }
  const services = (hoursData == null ? void 0 : hoursData.services) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-8", "data-ocid": "capacity-settings-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground", children: t("settings.nav.capacity") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.capacity.subtitle") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.capacity.perService") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("settings.capacity.perServiceHint") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-3", children: [
        services.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.capacity.noServicesHint") }),
        services.map((s) => {
          const currentMax = config.serviceMaxGuests[s.id] !== void 0 ? config.serviceMaxGuests[s.id] : s.maxCapacity;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: s.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                s.openTime,
                " – ",
                s.closeTime
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setServiceMax(s.id, Math.max(1, currentMax - 5)),
                  className: "h-7 w-7 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors",
                  "aria-label": t("settings.capacity.decreaseMax"),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 1,
                  max: 999,
                  value: currentMax,
                  onChange: (e) => setServiceMax(s.id, Number(e.target.value)),
                  className: "w-20 text-center bg-background border-border",
                  "data-ocid": `service-max-${s.id}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setServiceMax(s.id, currentMax + 5),
                  className: "h-7 w-7 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors",
                  "aria-label": t("settings.capacity.increaseMax"),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground w-12", children: t("settings.capacity.guests") })
            ] })
          ] }, s.id);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: saveAll,
          disabled: isSaving,
          className: "gap-2",
          "data-ocid": "save-service-max-btn",
          children: [
            isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
            t(isSaving ? "settings.saving" : "settings.save")
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.capacity.partySize") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "minParty",
              className: "text-sm font-medium text-foreground",
              children: t("settings.capacity.minParty")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "minParty",
              type: "number",
              min: 1,
              max: config.maxPartySize,
              value: config.minPartySize,
              onChange: (e) => setConfig((c) => ({
                ...c,
                minPartySize: Number(e.target.value)
              })),
              className: "bg-background border-border",
              "data-ocid": "min-party-size"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "maxParty",
              className: "text-sm font-medium text-foreground",
              children: t("settings.capacity.maxParty")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "maxParty",
              type: "number",
              min: config.minPartySize,
              max: 100,
              value: config.maxPartySize,
              onChange: (e) => setConfig((c) => ({
                ...c,
                maxPartySize: Number(e.target.value)
              })),
              className: "bg-background border-border",
              "data-ocid": "max-party-size"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: saveAll,
          disabled: isSaving,
          className: "gap-2",
          "data-ocid": "save-party-size-btn",
          children: [
            isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
            t(isSaving ? "settings.saving" : "settings.save")
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.capacity.zones") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("settings.capacity.zonesHint") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-3", children: [
        config.zones.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background",
            "data-ocid": `zone-row-${z.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: z.name,
                  onChange: (e) => updateZone(z.id, { name: e.target.value }),
                  className: "flex-1 bg-card border-border h-8 text-sm",
                  "data-ocid": `zone-name-${z.id}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: 1,
                    max: 999,
                    value: z.maxGuests,
                    onChange: (e) => updateZone(z.id, { maxGuests: Number(e.target.value) }),
                    className: "w-20 text-center bg-card border-border h-8 text-sm",
                    "data-ocid": `zone-max-${z.id}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: t("settings.capacity.guests") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => deleteZone(z.id),
                  className: "p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                  "aria-label": t("settings.capacity.deleteZone"),
                  "data-ocid": `zone-delete-${z.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                }
              )
            ]
          },
          z.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: newZoneName,
              onChange: (e) => setNewZoneName(e.target.value),
              placeholder: t("settings.capacity.newZonePlaceholder"),
              className: "bg-background border-border",
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addZone();
                }
              },
              "data-ocid": "new-zone-name"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: addZone,
              disabled: !newZoneName.trim(),
              className: "shrink-0 gap-2 border-border",
              "data-ocid": "add-zone-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                t("settings.capacity.addZone")
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: saveAll,
          disabled: isSaving,
          className: "gap-2",
          "data-ocid": "save-zones-btn",
          children: [
            isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
            t(isSaving ? "settings.saving" : "settings.save")
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.capacity.tableTypes") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("settings.capacity.tableTypesHint") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-3 px-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: t("settings.capacity.tableTypeName") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground text-center", children: t("settings.capacity.seatsPerTable") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground text-center", children: t("settings.capacity.tableCount") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: t("settings.capacity.actions") })
        ] }),
        config.tableTypes.map((tt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-4 gap-3 items-center px-2 py-2 rounded-xl border border-border bg-background",
            "data-ocid": `table-type-row-${tt.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: tt.name,
                  onChange: (e) => updateTableType(tt.id, { name: e.target.value }),
                  className: "bg-card border-border h-8 text-sm",
                  "data-ocid": `tt-name-${tt.id}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 1,
                  max: 20,
                  value: tt.seatsPerTable,
                  onChange: (e) => updateTableType(tt.id, {
                    seatsPerTable: Number(e.target.value)
                  }),
                  className: "text-center bg-card border-border h-8 text-sm",
                  "data-ocid": `tt-seats-${tt.id}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  max: 999,
                  value: tt.count,
                  onChange: (e) => updateTableType(tt.id, { count: Number(e.target.value) }),
                  className: "text-center bg-card border-border h-8 text-sm",
                  "data-ocid": `tt-count-${tt.id}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => deleteTableType(tt.id),
                  className: "justify-self-end p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                  "aria-label": t("settings.capacity.deleteTableType"),
                  "data-ocid": `tt-delete-${tt.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                }
              )
            ]
          },
          tt.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[140px] space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("settings.capacity.tableTypeName") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: newTableTypeName,
                onChange: (e) => setNewTableTypeName(e.target.value),
                placeholder: t("settings.capacity.newTableTypePlaceholder"),
                className: "bg-background border-border",
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTableType();
                  }
                },
                "data-ocid": "new-tt-name"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 w-24", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("settings.capacity.seatsPerTable") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 1,
                max: 20,
                value: newTableTypeSeats,
                onChange: (e) => setNewTableTypeSeats(Number(e.target.value)),
                className: "bg-background border-border",
                "data-ocid": "new-tt-seats"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: addTableType,
              disabled: !newTableTypeName.trim(),
              className: "shrink-0 gap-2 border-border",
              "data-ocid": "add-table-type-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                t("settings.capacity.addTableType")
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: saveAll,
          disabled: isSaving,
          className: "gap-2",
          "data-ocid": "save-table-types-btn",
          children: [
            isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
            t(isSaving ? "settings.saving" : "settings.save")
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.capacity.occupancyCeiling") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("settings.capacity.occupancyCeilingHint") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: 50,
              max: 100,
              step: 5,
              value: config.occupancyCeiling,
              onChange: (e) => setConfig((c) => ({
                ...c,
                occupancyCeiling: Number(e.target.value)
              })),
              className: "flex-1 h-2 accent-primary cursor-pointer",
              "data-ocid": "occupancy-ceiling-slider",
              "aria-label": t("settings.capacity.occupancyCeiling")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-16 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-primary", children: config.occupancyCeiling }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "%" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground px-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "50%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "75%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "100%" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.capacity.occupancyCeilingLabel", {
          value: config.occupancyCeiling
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: saveAll,
          disabled: isSaving,
          className: "gap-2",
          "data-ocid": "save-occupancy-btn",
          children: [
            isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
            t(isSaving ? "settings.saving" : "settings.save")
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden",
        "data-ocid": "table-groups-section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.tableGroups.title") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("settings.tableGroups.description") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-3", children: [
            tableGroups.length === 0 && !showAddGroup && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-sm text-muted-foreground py-2",
                "data-ocid": "table-groups-empty-state",
                children: t("settings.tableGroups.noGroups")
              }
            ),
            tableGroups.map((group) => {
              const computedCapacity = calcGroupCapacity(group.tableIds);
              const isConfirmingDelete = deletingGroupId === group.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-xl border border-border bg-background px-4 py-3 space-y-3",
                  "data-ocid": `table-group-row-${group.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            value: group.name,
                            onChange: (e) => handleUpdateGroup(group, { name: e.target.value }),
                            className: "bg-card border-border h-8 text-sm font-medium",
                            "data-ocid": `table-group-name-${group.id}`,
                            "aria-label": t("settings.tableGroups.groupName")
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            value: group.description,
                            onChange: (e) => handleUpdateGroup(group, {
                              description: e.target.value
                            }),
                            placeholder: t(
                              "settings.tableGroups.descriptionPlaceholder"
                            ),
                            className: "bg-card border-border h-7 text-xs text-muted-foreground",
                            "data-ocid": `table-group-desc-${group.id}`
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Badge,
                          {
                            variant: "secondary",
                            className: "text-xs font-semibold tabular-nums",
                            "data-ocid": `table-group-capacity-${group.id}`,
                            children: [
                              computedCapacity,
                              " ",
                              t("settings.capacity.guests")
                            ]
                          }
                        ),
                        isConfirmingDelete ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => handleDeleteGroup(group.id),
                              className: "px-2 py-1 rounded-lg text-xs font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 transition-colors",
                              "data-ocid": `table-group-confirm-delete-${group.id}`,
                              children: t("settings.tableGroups.deleteConfirm")
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => setDeletingGroupId(null),
                              className: "px-2 py-1 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors",
                              "data-ocid": `table-group-cancel-delete-${group.id}`,
                              children: t("settings.tableGroups.cancel")
                            }
                          )
                        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => handleDeleteGroup(group.id),
                            className: "p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                            "aria-label": t("settings.tableGroups.deleteConfirm"),
                            "data-ocid": `table-group-delete-${group.id}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: config.tableTypes.map((tt) => {
                      const selected = group.tableIds.includes(tt.id);
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleUpdateGroup(group, {
                            tableIds: selected ? group.tableIds.filter((id) => id !== tt.id) : [...group.tableIds, tt.id]
                          }),
                          className: `px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${selected ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/30 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
                          "data-ocid": `table-group-toggle-${group.id}-${tt.id}`,
                          children: [
                            tt.name,
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 opacity-60", children: [
                              "(",
                              tt.seatsPerTable * tt.count,
                              ")"
                            ] })
                          ]
                        },
                        tt.id
                      );
                    }) })
                  ]
                },
                group.id
              );
            }),
            showAddGroup && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl border border-primary/30 bg-primary/5 px-4 py-4 space-y-3",
                "data-ocid": "table-group-add-form",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: t("settings.tableGroups.groupName") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: newGroupName,
                        onChange: (e) => setNewGroupName(e.target.value),
                        placeholder: t("settings.tableGroups.groupNamePlaceholder"),
                        className: "bg-card border-border",
                        "data-ocid": "new-group-name-input",
                        autoFocus: true
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-foreground", children: [
                      t("settings.tableGroups.selectTables"),
                      newGroupTableIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-muted-foreground font-normal", children: [
                        "(",
                        t("settings.tableGroups.totalCapacity"),
                        ":",
                        " ",
                        calcGroupCapacity(newGroupTableIds),
                        " ",
                        t("settings.capacity.guests"),
                        ")"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                      config.tableTypes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.tableGroups.noTablesHint") }),
                      config.tableTypes.map((tt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "label",
                        {
                          className: "flex items-center gap-2 cursor-pointer",
                          "data-ocid": `new-group-table-${tt.id}`,
                          htmlFor: `new-group-table-checkbox-${tt.id}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Checkbox,
                              {
                                id: `new-group-table-checkbox-${tt.id}`,
                                checked: newGroupTableIds.includes(tt.id),
                                onCheckedChange: () => toggleNewGroupTable(tt.id),
                                className: "border-border"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: tt.name }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                              "(",
                              tt.seatsPerTable * tt.count,
                              " ",
                              t("settings.capacity.guests"),
                              ")"
                            ] })
                          ]
                        },
                        tt.id
                      ))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: t("settings.tableGroups.descriptionOptional") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: newGroupDescription,
                        onChange: (e) => setNewGroupDescription(e.target.value),
                        placeholder: t("settings.tableGroups.descriptionPlaceholder"),
                        className: "bg-card border-border",
                        "data-ocid": "new-group-description-input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        onClick: handleAddGroup,
                        disabled: !newGroupName.trim() || newGroupTableIds.length < 2 || groupSaving,
                        className: "gap-2",
                        "data-ocid": "save-new-group-btn",
                        children: [
                          groupSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
                          t(groupSaving ? "settings.saving" : "settings.save")
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "ghost",
                        onClick: () => {
                          setShowAddGroup(false);
                          setNewGroupName("");
                          setNewGroupDescription("");
                          setNewGroupTableIds([]);
                        },
                        "data-ocid": "cancel-add-group-btn",
                        children: t("settings.tableGroups.cancel")
                      }
                    )
                  ] })
                ]
              }
            ),
            !showAddGroup && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => setShowAddGroup(true),
                className: "gap-2 border-border mt-1",
                "data-ocid": "add-table-group-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                  t("settings.tableGroups.addGroup")
                ]
              }
            )
          ] })
        ]
      }
    )
  ] });
}
export {
  CapacitySettingsPage as default
};

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOpeningHoursConfig } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Coffee, Moon, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

// ── Helpers ───────────────────────────────────────────────────────────────────

type ServiceKey = "lunch" | "diner";

interface ActiveService {
  key: ServiceKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  openTime: string;
  closeTime: string;
}

function detectActiveService(
  lunchStart: string,
  lunchEnd: string,
  dinerStart: string,
  dinerEnd: string,
): ServiceKey {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m ?? 0);
  };

  const lS = toMin(lunchStart);
  const lE = toMin(lunchEnd);
  const dS = toMin(dinerStart);
  const dE = toMin(dinerEnd);

  if (nowMin >= lS && nowMin < lE) return "lunch";
  if (nowMin >= dS && nowMin < dE) return "diner";

  // Outside both services: pick the nearest upcoming one
  if (nowMin < lS) return "lunch";
  if (nowMin < dS) return "diner";
  return "diner";
}

// ── Component ─────────────────────────────────────────────────────────────────

interface WalkInModalProps {
  open: boolean;
  onClose: () => void;
}

export function WalkInModal({ open, onClose }: WalkInModalProps) {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const { data: openingHoursConfig } = useOpeningHoursConfig();

  const lunchConfig = openingHoursConfig?.services?.find(
    (s) => s.id === "lunch" || s.name?.toLowerCase().includes("lunch"),
  );
  const dinerConfig = openingHoursConfig?.services?.find(
    (s) =>
      s.id === "diner" ||
      s.name?.toLowerCase().includes("diner") ||
      s.name?.toLowerCase().includes("dinner"),
  );

  const lunchStart = lunchConfig?.openTime ?? "12:00";
  const lunchEnd = lunchConfig?.closeTime ?? "14:30";
  const dinerStart = dinerConfig?.openTime ?? "18:00";
  const dinerEnd = dinerConfig?.closeTime ?? "22:00";

  const activeServiceKey = detectActiveService(
    lunchStart,
    lunchEnd,
    dinerStart,
    dinerEnd,
  );

  const services: ActiveService[] = [
    {
      key: "lunch",
      label: t("dashboard:walkIn.serviceLunch", "Lunch"),
      icon: Coffee,
      openTime: lunchStart,
      closeTime: lunchEnd,
    },
    {
      key: "diner",
      label: t("dashboard:walkIn.serviceDiner", "Diner"),
      icon: Moon,
      openTime: dinerStart,
      closeTime: dinerEnd,
    },
  ];

  const activeService =
    services.find((s) => s.key === activeServiceKey) ?? services[1];

  function handleConfirm(serviceKey: ServiceKey) {
    onClose();
    void navigate({
      to: "/dashboard/seating",
      search: { walkin: "true", service: serviceKey },
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="dark bg-card border-border max-w-md"
        data-ocid="walkin-modal"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t("dashboard:walkIn.title", "Walk-In")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Active service indicator */}
          <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              {activeServiceKey === "lunch" ? (
                <Coffee className="h-5 w-5 text-primary" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {t("dashboard:walkIn.activeService", "Huidige dienst")}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {activeService.label}
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              "dashboard:walkIn.description",
              "Selecteer de dienst en ga direct naar het tafelplan om een beschikbare tafel als bezet te markeren. Er zijn geen gastgegevens nodig.",
            )}
          </p>

          {/* Service selection */}
          <div className="grid grid-cols-2 gap-3">
            {services.map((svc) => {
              const Icon = svc.icon;
              const isActive = svc.key === activeServiceKey;
              return (
                <button
                  key={svc.key}
                  type="button"
                  onClick={() => handleConfirm(svc.key)}
                  data-ocid={`walkin-service-${svc.key}`}
                  className={cn(
                    "flex flex-col items-center gap-2.5 rounded-xl border px-4 py-5",
                    "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "bg-primary/10 border-primary/40 text-primary shadow-sm"
                      : "bg-muted/20 border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground hover:border-border/80",
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      isActive ? "bg-primary/20" : "bg-muted/40",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold">{svc.label}</span>
                  <span className="text-xs opacity-70">
                    {svc.openTime} – {svc.closeTime}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      {t("dashboard:walkIn.now", "Nu actief")}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Confirm with active service shortcut */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted"
              onClick={onClose}
              data-ocid="walkin-cancel-btn"
            >
              {t("dashboard:walkIn.cancel", "Annuleren")}
            </Button>
            <Button
              type="button"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              onClick={() => handleConfirm(activeServiceKey)}
              data-ocid="walkin-confirm-btn"
            >
              {t("dashboard:walkIn.confirm", "Ga naar tafelplan")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

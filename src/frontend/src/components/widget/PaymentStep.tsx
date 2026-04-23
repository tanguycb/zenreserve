import { createActor } from "@/backend";
import { cn } from "@/lib/utils";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Loader2,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface GuestDetails {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
}

interface PaymentStepProps {
  partySize: number;
  guestDetails?: GuestDetails;
  selectedDate?: string;
  selectedTime?: string;
  experienceId?: string;
  specialRequests?: string;
  onPaymentSuccess: () => void;
}

interface CreateReservationVars {
  guestDetails: GuestDetails;
  date: string;
  time: string;
  partySize: number;
  experienceId?: string;
  specialRequests?: string;
}

function useCreateReservation() {
  const { actor } = useActor(createActor);
  return useMutation<string, Error, CreateReservationVars>({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      const fullName = [data.guestDetails.firstName, data.guestDetails.lastName]
        .filter(Boolean)
        .join(" ");
      // First: create or find the guest record
      const guest = await actor.createGuest(
        fullName,
        data.guestDetails.email,
        data.guestDetails.phone ?? null,
      );
      // Then: create reservation with experienceId support
      const reservation = await actor.createReservation(
        guest.id,
        data.date,
        data.time,
        BigInt(data.partySize),
        data.experienceId ?? null,
        null,
        data.specialRequests ?? null,
      );
      // Type guard: backend returns Result in newer versions
      if (
        typeof reservation === "object" &&
        reservation !== null &&
        "__kind__" in reservation
      ) {
        const r = reservation as {
          __kind__: string;
          err?: string;
          ok?: { id: string };
        };
        if (r.__kind__ === "err") {
          throw new Error(r.err ?? "UNKNOWN");
        }
        return r.ok?.id ?? "";
      }
      return (reservation as { id: string }).id;
    },
  });
}

export function PaymentStep({
  partySize,
  guestDetails,
  selectedDate,
  selectedTime,
  experienceId,
  specialRequests,
  onPaymentSuccess,
}: PaymentStepProps) {
  const { t } = useTranslation("widget");
  const createReservation = useCreateReservation();

  const date = selectedDate ?? new Date().toISOString().split("T")[0];
  const time = selectedTime ?? "19:00";

  async function handleConfirm() {
    const guest: GuestDetails = guestDetails ?? {
      firstName: "Gast",
      email: "",
    };

    await createReservation.mutateAsync(
      {
        guestDetails: guest,
        date,
        time,
        partySize,
        experienceId,
        specialRequests,
      },
      {
        onSuccess: () => {
          setTimeout(onPaymentSuccess, 1400);
        },
      },
    );
  }

  if (createReservation.isSuccess) {
    return (
      <div
        className="text-center py-6 space-y-3"
        data-ocid="payment.success_state"
      >
        <div className="mx-auto h-14 w-14 rounded-full flex items-center justify-center bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="font-bold text-base text-foreground">
            {t("paymentStep.successTitle")}
          </p>
          <p className="text-sm mt-0.5 text-muted-foreground">
            {t("confirmationStep.confirmationSent", {
              email: guestDetails?.email ?? "",
            })}
          </p>
        </div>
        <div className="h-1 w-24 mx-auto rounded-full overflow-hidden bg-border">
          <div
            className="h-full rounded-full bg-primary"
            style={{ animation: "grow 1.4s ease-out forwards" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Booking summary card */}
      <div className="rounded-xl p-4 space-y-3 bg-muted/30 border border-border">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("confirmationStep.bookingSummary", "Boekingsoverzicht")}
        </p>

        <div className="space-y-2">
          {/* Date */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-secondary/10">
              <CalendarCheck className="h-3.5 w-3.5 text-secondary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                {t("dateStep.title")}
              </p>
              <p className="text-sm font-semibold text-foreground">{date}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent/10">
              <Clock className="h-3.5 w-3.5 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                {t("timeStep.title")}
              </p>
              <p className="text-sm font-semibold text-foreground">{time}</p>
            </div>
          </div>

          {/* Party size */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
              <Users className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                {t("partySizeStep.title")}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {partySize}{" "}
                {partySize === 1
                  ? t("partySizeStep.person", "persoon")
                  : t("partySizeStep.persons", "personen")}
              </p>
            </div>
          </div>
        </div>

        {/* Pay-at-venue note */}
        <div className="flex items-start gap-2 p-2.5 rounded-lg mt-1 bg-primary/5 border border-primary/20">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
          <p className="text-xs text-foreground/80">
            {t(
              "paymentStep.payAtVenueNote",
              "Geen vooruitbetaling vereist. Betaal ter plaatse.",
            )}
          </p>
        </div>
      </div>

      {/* Error */}
      {createReservation.isError && (
        <div
          className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20"
          role="alert"
          data-ocid="payment.error_state"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-destructive" />
          <p className="text-sm text-destructive">
            {createReservation.error?.message === "RATE_LIMIT_WIDGET"
              ? t("paymentStep.errorRateLimit")
              : (createReservation.error?.message ??
                t("paymentStep.errorDefault"))}
          </p>
        </div>
      )}

      {/* Confirm button */}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={createReservation.isPending}
        className={cn(
          "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200",
          "bg-primary text-primary-foreground",
          !createReservation.isPending
            ? "hover:opacity-90 active:scale-[0.98]"
            : "opacity-70 cursor-not-allowed",
        )}
        data-ocid="payment.submit_button"
      >
        {createReservation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("paymentStep.processing")}
          </>
        ) : (
          t("paymentStep.confirmButton", "Reservering bevestigen")
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        {t(
          "paymentStep.freeNote",
          "Gratis annuleren tot 24 uur voor aankomst.",
        )}
      </p>
    </div>
  );
}

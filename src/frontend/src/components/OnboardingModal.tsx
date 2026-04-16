import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useActor } from "@caffeineai/core-infrastructure";
import { CheckCircle2, Loader2, XCircle, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ONBOARDING_KEY = "zenreserve_owner_activated";

type ModalState = "idle" | "loading" | "success" | "error";

interface CopySet {
  title: string;
  body: string;
  button: string;
  success: string;
  error: string;
  retry: string;
}

const COPY: Record<string, CopySet> = {
  nl: {
    title: "Welkom bij ZenReserve",
    body: "Voordat je kan starten, activeer je je restaurant met één klik. Dit is een eenmalige stap.",
    button: "Activeer mijn restaurant",
    success: "Je restaurant is geactiveerd! Je wordt doorgestuurd...",
    error: "Er is iets misgegaan. Probeer het opnieuw.",
    retry: "Opnieuw proberen",
  },
  en: {
    title: "Welcome to ZenReserve",
    body: "Before you get started, activate your restaurant with one click. This is a one-time step.",
    button: "Activate my restaurant",
    success: "Your restaurant is activated! Redirecting...",
    error: "Something went wrong. Please try again.",
    retry: "Try again",
  },
  fr: {
    title: "Bienvenue sur ZenReserve",
    body: "Avant de commencer, activez votre restaurant en un clic. Il s'agit d'une étape unique.",
    button: "Activer mon restaurant",
    success: "Votre restaurant est activé ! Redirection...",
    error: "Une erreur est survenue. Veuillez réessayer.",
    retry: "Réessayer",
  },
};

interface OnboardingModalProps {
  onComplete: () => void;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const { i18n } = useTranslation("dashboard");
  const { identity } = useAuth();
  const { actor } = useActor(createActor);
  const [modalState, setModalState] = useState<ModalState>("idle");

  const lang = i18n.language?.slice(0, 2) ?? "nl";
  const c: CopySet = COPY[lang] ?? COPY.nl;

  async function handleActivate() {
    if (!identity || !actor) return;
    setModalState("loading");
    try {
      const principal = identity.getPrincipal();
      await actor.setOwner(principal);
      localStorage.setItem(ONBOARDING_KEY, "true");
      setModalState("success");
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch {
      setModalState("error");
    }
  }

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm w-full h-full max-w-none max-h-none m-0 p-0 border-0 bg-transparent"
      aria-labelledby="onboarding-title"
      data-ocid="onboarding.dialog"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="onboarding-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-4 w-full max-w-md rounded-2xl bg-[#1E2937] border border-white/10 shadow-2xl p-8"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/15 flex items-center justify-center ring-2 ring-primary/30">
              {modalState === "success" ? (
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              ) : modalState === "error" ? (
                <XCircle className="h-8 w-8 text-destructive" />
              ) : (
                <Zap className="h-8 w-8 text-primary" />
              )}
            </div>
          </div>

          {/* Title */}
          <h2
            id="onboarding-title"
            className="text-2xl font-bold text-foreground text-center mb-3 tracking-tight"
          >
            {c.title}
          </h2>

          {/* Body */}
          <p className="text-muted-foreground text-center text-sm leading-relaxed mb-8">
            {modalState === "success"
              ? c.success
              : modalState === "error"
                ? c.error
                : c.body}
          </p>

          {/* Action */}
          <div className="flex justify-center">
            {modalState === "loading" && (
              <Button
                disabled
                className="w-full max-w-xs h-12 text-base font-semibold rounded-xl"
                data-ocid="onboarding.loading_state"
              >
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {c.button}
              </Button>
            )}

            {modalState === "idle" && (
              <Button
                onClick={handleActivate}
                className="w-full max-w-xs h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                data-ocid="onboarding.confirm_button"
              >
                <Zap className="h-5 w-5 mr-2" />
                {c.button}
              </Button>
            )}

            {modalState === "error" && (
              <Button
                onClick={() => setModalState("idle")}
                variant="outline"
                className="w-full max-w-xs h-12 text-base font-semibold rounded-xl border-destructive/50 text-destructive hover:bg-destructive/10"
                data-ocid="onboarding.cancel_button"
              >
                {c.retry}
              </Button>
            )}

            {modalState === "success" && (
              <div
                className="flex items-center gap-2 text-green-400 font-medium"
                data-ocid="onboarding.success_state"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>{c.success}</span>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </dialog>
  );
}

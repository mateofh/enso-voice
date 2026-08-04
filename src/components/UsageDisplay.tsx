import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Cloud, KeyRound } from "lucide-react";
import { useUsage } from "../hooks/useUsage";
import { useToast } from "./ui/useToast";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { useSettingsStore } from "../stores/settingsStore";
import { ENSO_BETA_FEATURES } from "../config/product";

export default function UsageDisplay() {
  const { t, i18n } = useTranslation();
  const usage = useUsage();
  const { toast } = useToast();
  const hasShownApproachingToast = useRef(false);
  const isSpanish = i18n.language.toLowerCase().startsWith("es");
  const copy = useMemo(
    () =>
      isSpanish
        ? {
            endingTitle: "Créditos de Enso por terminar",
            remaining: (minutes: number) =>
              `Te quedan ${minutes.toLocaleString(i18n.language)} minutos administrados. Local y BYOK siguen disponibles.`,
            title: "Créditos de Enso",
            internal: "Enso Internal",
            community: "Community Pro",
            grace: "Periodo de gracia",
            active: "Activo",
            renews: (date: string) => `Renueva el ${date}`,
            ariaRemaining: (minutes: number) => `${minutes} minutos administrados restantes`,
            policy:
              "El dictado usa 1 crédito por minuto; las reuniones con hablantes usan 2. Local y BYOK no consumen créditos.",
            returns: (date: string) => `Tus créditos volverán el ${date}.`,
            fallback: "Puedes seguir trabajando ahora con procesamiento local o tu propia API key.",
            local: "Usar modo local",
            byok: "Configurar BYOK",
            betaTitle: "Acceso administrado de comunidad",
            betaBody:
              "Los créditos administrados se activan automáticamente para miembros activos. Mientras tanto, local y BYOK están disponibles sin límite de Enso.",
          }
        : {
            endingTitle: "Enso credits are running low",
            remaining: (minutes: number) =>
              `You have ${minutes.toLocaleString(i18n.language)} managed minutes left. Local and BYOK remain available.`,
            title: "Enso credits",
            internal: "Enso Internal",
            community: "Community Pro",
            grace: "Grace period",
            active: "Active",
            renews: (date: string) => `Renews ${date}`,
            ariaRemaining: (minutes: number) => `${minutes} managed minutes remaining`,
            policy:
              "Dictation uses 1 credit per minute; speaker-aware meetings use 2. Local and BYOK do not use credits.",
            returns: (date: string) => `Your credits return on ${date}.`,
            fallback: "Keep working now with local processing or your own API key.",
            local: "Use local mode",
            byok: "Configure BYOK",
            betaTitle: "Community managed access",
            betaBody:
              "Managed credits activate automatically for active members. Until then, local and BYOK remain available without an Enso limit.",
          },
    [i18n.language, isSpanish]
  );

  // One-time toast when approaching limit (>80%)
  useEffect(() => {
    if (usage?.isApproachingLimit && !hasShownApproachingToast.current) {
      hasShownApproachingToast.current = true;
      const remainingMinutes = usage.credits
        ? Math.ceil(usage.credits.remainingSeconds / 60)
        : null;
      toast({
        title: remainingMinutes !== null ? copy.endingTitle : t("usage.approachingLimit"),
        description:
          remainingMinutes !== null
            ? copy.remaining(remainingMinutes)
            : t("usage.approachingLimitDescription", {
                wordsUsed: usage.wordsUsed.toLocaleString(),
                limit: usage.limit.toLocaleString(),
              }),
        duration: 6000,
      });
    }
  }, [usage?.isApproachingLimit, usage?.wordsUsed, usage?.limit, usage?.credits, toast, t, copy]);

  if (!usage) return null;

  if (usage.credits) {
    const { credits, entitlement } = usage;
    const totalSeconds = credits.granted * 60;
    const remainingMinutes = Math.ceil(credits.remainingSeconds / 60);
    const percentageRemaining =
      totalSeconds > 0
        ? Math.max(0, Math.min(100, (credits.remainingSeconds / totalSeconds) * 100))
        : 0;
    const resetDate = new Date(credits.resetsAt).toLocaleDateString(i18n.language, {
      day: "numeric",
      month: "short",
    });
    const sourceLabel = entitlement.source === "internal" ? copy.internal : copy.community;
    const progressColor =
      percentageRemaining <= 10
        ? "[&>div]:bg-destructive"
        : percentageRemaining <= 25
          ? "[&>div]:bg-warning"
          : "[&>div]:bg-primary";

    const switchMode = (mode: "local" | "providers") => {
      const settings = useSettingsStore.getState();
      settings.setTranscriptionMode(mode);
      if (mode === "providers") settings.setCloudTranscriptionMode("byok");
      window.location.reload();
    };

    return (
      <section
        className="rounded-xl border border-border bg-card p-4"
        aria-labelledby="enso-credit-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-primary" aria-hidden="true" />
              <h3 id="enso-credit-title" className="text-sm font-semibold text-foreground">
                {copy.title}
              </h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{sourceLabel}</p>
          </div>
          <Badge variant={entitlement.status === "grace" ? "warning" : "success"}>
            {entitlement.status === "grace" ? copy.grace : copy.active}
          </Badge>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-2xl font-semibold tabular-nums text-foreground">
              {remainingMinutes.toLocaleString(i18n.language)} min
            </span>
            <span className="text-xs text-muted-foreground">{copy.renews(resetDate)}</span>
          </div>
          <Progress
            value={percentageRemaining}
            aria-label={copy.ariaRemaining(remainingMinutes)}
            className={`h-1.5 ${progressColor}`}
          />
          <p className="text-xs leading-5 text-muted-foreground">{copy.policy}</p>
        </div>

        {usage.isOverLimit && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground">{copy.returns(resetDate)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{copy.fallback}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => switchMode("local")}>
                {copy.local}
              </Button>
              <Button variant="outline" size="sm" onClick={() => switchMode("providers")}>
                <KeyRound className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                {copy.byok}
              </Button>
            </div>
          </div>
        )}
      </section>
    );
  }

  if (!ENSO_BETA_FEATURES.publicBilling) {
    const switchMode = (mode: "local" | "providers") => {
      const settings = useSettingsStore.getState();
      settings.setTranscriptionMode(mode);
      if (mode === "providers") settings.setCloudTranscriptionMode("byok");
      window.location.reload();
    };
    return (
      <section className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">{copy.betaTitle}</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{copy.betaBody}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => switchMode("local")}>
            {copy.local}
          </Button>
          <Button variant="outline" size="sm" onClick={() => switchMode("providers")}>
            <KeyRound className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            {copy.byok}
          </Button>
        </div>
      </section>
    );
  }

  // Pro plan or trial — minimal display
  if (usage.isSubscribed) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{t("usage.yourPlan")}</span>
          {usage.isTrial ? (
            <Badge variant="outline" className="text-primary border-primary/30">
              {t("usage.trial", { days: usage.trialDaysLeft, count: usage.trialDaysLeft })}
            </Badge>
          ) : (
            <Badge variant="success">
              {usage.plan === "business" ? t("usage.business") : t("usage.pro")}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {usage.isTrial ? t("usage.unlimitedTrial") : t("usage.unlimited")}
        </p>
        {!usage.isTrial && (
          <Button variant="outline" size="sm" onClick={() => usage.openBillingPortal()}>
            {t("usage.manageSubscription")}
          </Button>
        )}
      </div>
    );
  }

  // Free plan
  const percentage = usage.limit > 0 ? Math.min(100, (usage.wordsUsed / usage.limit) * 100) : 0;
  const progressColor =
    percentage >= 100
      ? "[&>div]:bg-destructive"
      : percentage >= 80
        ? "[&>div]:bg-warning"
        : "[&>div]:bg-primary";

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{t("usage.weeklyUsage")}</span>
        {usage.isOverLimit ? (
          <Badge variant="warning">{t("usage.limitReached")}</Badge>
        ) : (
          <Badge variant="outline">{t("usage.free")}</Badge>
        )}
      </div>

      <div className="space-y-1.5">
        <Progress
          value={percentage}
          className={`h-2 transition-colors duration-500 ${progressColor}`}
        />
        <div className="flex items-center justify-between">
          <span className="text-sm tabular-nums text-muted-foreground">
            {usage.wordsUsed.toLocaleString()} / {usage.limit.toLocaleString()}
          </span>
          {usage.isApproachingLimit && (
            <span className="text-xs text-warning">
              {t("usage.wordsRemaining", {
                count: usage.wordsRemaining,
                remaining: usage.wordsRemaining.toLocaleString(),
              })}
            </span>
          )}
          {!usage.isApproachingLimit && !usage.isOverLimit && (
            <span className="text-xs text-muted-foreground">{t("usage.rollingLimit")}</span>
          )}
        </div>
      </div>

      {usage.isOverLimit ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90"
            onClick={() => usage.openCheckout()}
          >
            {t("usage.upgradeToPro")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const s = useSettingsStore.getState();
              s.setTranscriptionMode("providers");
              s.setCloudTranscriptionMode("byok");
              window.location.reload();
            }}
          >
            {t("usage.useYourOwnKey")}
          </Button>
        </div>
      ) : usage.isApproachingLimit ? (
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90"
          onClick={() => usage.openCheckout()}
        >
          {t("usage.upgradeToPro")}
        </Button>
      ) : (
        <a
          href="#"
          className="text-primary hover:text-primary/80 text-sm inline-block"
          onClick={(e) => {
            e.preventDefault();
            usage.openCheckout();
          }}
        >
          {t("usage.upgradeUnlimited")}
        </a>
      )}
    </div>
  );
}

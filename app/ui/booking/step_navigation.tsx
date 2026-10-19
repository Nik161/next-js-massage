import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/shared/button";

export function StepHeader({
  step,
  totalSteps,
  title,
  subtitle,
}: {
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
}) {
  return (
    <header>
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-dark">
        Шаг {step} из {totalSteps}
      </p>
      <h2 className="mt-1 font-display text-3xl font-medium text-ink md:text-4xl">
        {title}
      </h2>
      <p className="mt-2 text-muted">{subtitle}</p>
    </header>
  );
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="ghost" onClick={onClick} className="group">
      <ArrowLeftIcon className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
      Назад
    </Button>
  );
}

export function NextButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="group"
    >
      Далее
      <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Button>
  );
}

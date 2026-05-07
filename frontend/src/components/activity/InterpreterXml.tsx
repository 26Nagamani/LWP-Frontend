import React, { useState, useRef } from "react";
import { XMLParser } from "fast-xml-parser";
import type { OptionItem, ParsedStep, RawStep } from "../../types/activity.types";
import OptionsStep from "./steps/OptionsStep";
import InteractiveStep from "./steps/InteractiveStep";
import Toast from "../ui/Toast";

// ─── XML parsing ──────────────────────────────────────────────────────────────

const parseActivityXML = (xmlString: string): ParsedStep[] => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    allowBooleanAttributes: true,
  });

  const json = parser.parse(xmlString);
  let raw: RawStep[] = json?.topic?.step ?? [];
  if (!Array.isArray(raw)) raw = [raw];
  

  return raw.map((s) => {
    let options: OptionItem[] | undefined;

    if (s.options?.option) {
      const opt = s.options.option;
      options = Array.isArray(opt) ? opt : [opt];
    }
     
  if (typeof s.image !== "string") {
    throw new Error(`Image missing for step ${s["@_number"]}`);
  }

    return {
      number: s["@_number"],
      mode: s["@_mode"],
      navigation: {
        prev_step: s.navigation?.prev_step ?? null,
        next_step: s.navigation?.next_step ?? null,
      },
      image: s.image,
      audio: typeof s.audio === "string" ? s.audio : undefined,             // ✅ NEW
      speak_line: typeof s.speak_line === "string" ? s.speak_line : undefined, // ✅ NEW
      question: s.question,
      explanation: s.explanation,
      options,
      answer: s.answer,
    };
  });
};

// ─── Step ─────────────────────────────────────────────────────────────────────

interface StepProps {
  step: ParsedStep;
  index: number;
  total: number;
  onNavigate: (targetStepNumber: string | null, direction: "next" | "prev") => void;
  onShowToast: (msg: string) => void;
}

const Step: React.FC<StepProps> = ({ step, onNavigate, onShowToast }) => {
  const navigate = (dir: "next" | "prev") =>
    onNavigate(
      dir === "next"
        ? step.navigation.next_step ?? null
        : step.navigation.prev_step ?? null,
      dir
    );

  const handleCorrect = () => navigate("next");
  const handleWrong = () => onShowToast("Wrong answer, Try again!");

  return (
    <div className="w-full">
  {step.mode === "interactive" && (
    <InteractiveStep
      src={step.image}
      audio={step.audio}
      speak_line={step.speak_line}
      question={step.question ?? ""}
      explanation={step.explanation}
      onNext={() => navigate("next")}
    />
  )}

  {step.mode === "options" && step.options && (
    <OptionsStep
      image={step.image}
      audio={step.audio}                 // ✅ ADD
      speak_line={step.speak_line}       // ✅ ADD
      question={step.question ?? ""}
      options={step.options}
      correctId={step.answer ?? "A"}
      explanation={step.explanation}
      onCorrect={handleCorrect}
      onWrong={handleWrong}
    />
  )}
</div>
  );
};

// ─── InterpretXML ─────────────────────────────────────────────────────────────

interface InterpretXMLProps {
  xmlString: string;
  setCurrentStep: (stepNumber: string) => void;
}

const InterpretXML: React.FC<InterpretXMLProps> = ({ xmlString, setCurrentStep }) => {
  const steps = React.useMemo(() => parseActivityXML(xmlString), [xmlString]);

  const [currentNumber, setCurrentNumber] = useState<string>(
    steps[0]?.number ?? "1"
  );

  const [toast, setToast] = useState({
    visible: false,
    msg: "",
  });

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentIndex = steps.findIndex((s) => s.number === currentNumber);

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);

    setToast({ visible: true, msg });

    toastTimer.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 2000);
  };

  const handleNavigate = (
    targetStepNumber: string | null,
    direction: "next" | "prev"
  ) => {
    let nextIndex: number;

    if (targetStepNumber !== null) {
      nextIndex = steps.findIndex((s) => s.number === targetStepNumber);

      if (nextIndex === -1) {
        nextIndex = currentIndex + 1;
      }
    } else {
      nextIndex =
        direction === "next"
          ? currentIndex + 1
          : currentIndex - 1;
    }

    if (nextIndex < 0 || nextIndex >= steps.length) return;

    const nextNumber = steps[nextIndex].number;

    setCurrentNumber(nextNumber);
    setCurrentStep(nextNumber);
  };

  if (!steps.length) {
    return (
      <p className="text-gray-400 text-sm">
        No steps found in XML.
      </p>
    );
  }

  if (currentIndex === -1 || currentIndex >= steps.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-4xl mb-2">✓</div>
        <p className="font-medium text-base">
          All steps complete!
        </p>
      </div>
    );
  }

  return (
    <>
      <Step
        key={currentNumber}
        step={steps[currentIndex]}
        index={currentIndex}
        total={steps.length}
        onNavigate={handleNavigate}
        onShowToast={showToast}
      />

      <Toast
        message={toast.msg}
        visible={toast.visible}
        type="error"
      />
    </>
  );
};

export default InterpretXML;
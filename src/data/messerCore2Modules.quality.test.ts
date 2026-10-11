import { describe, expect, it } from "vitest";
import { messerCore2Modules } from "./messerCore2Modules";

describe("Messer Core 2 authoring quality guards", () => {
  const generated = messerCore2Modules.filter(x => x.id.startsWith("messer-core2-topic-"));

  it("represents all 74 named topics with stable, distinct IDs", () => {
    expect(generated).toHaveLength(74);
    expect(new Set(generated.map(x => x.id)).size).toBe(74);
  });

  it("does not attach identical unrelated APIPA/HDMI labs to all the topics", () => {
    for (const course of generated) {
      expect(course.interactiveLabs?.some(x => /student laptop 169\.254|HDMI audio/i.test(x.title))).toBe(false);
    }
  });

  it("requires technical hypothesis tests instead of obvious longest-answer quizzes", () => {
    for (const course of generated) {
      const question = course.quiz.find(q => q.id.endsWith("-q1"));
      expect(question?.type).toBe("scenario-response");
      expect(question?.prompt).toMatch(/TWO technically plausible causes/);
      expect(question?.prompt).toMatch(/theory wrong/);
      const explanation = question?.modelAnswer ?? "";
      expect(explanation.length).toBeGreaterThan(200);
    }
  });

  it("teaches subject-specific mechanisms rather than a shared triage paragraph", () => {
    const noteAnswers = generated.map(course => {
      const second = course.quiz.find(q => q.id.endsWith("-q2"));
      expect(second?.prompt).toContain(course.title.replace("A+ Core 2: ", ""));
      return second?.modelAnswer ?? "";
    });
    expect(new Set(noteAnswers).size).toBe(74);
  });
});

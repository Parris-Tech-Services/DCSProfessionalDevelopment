import { describe, expect, it } from 'vitest';
import { getModuleById, getModuleQuestions, modules } from '../data/modules';
import { mspNetworkingModules } from '../data/mspNetworkingModules';

describe('MSP networking series', () => {
  it('adds ten MSP networking modules, resolvable by id', () => {
    expect(mspNetworkingModules.map((m) => m.id)).toEqual([
      'net-dhcp', 'net-dns', 'net-vlans', 'net-routing', 'net-nat-firewall',
      'net-ports', 'net-vpn', 'net-wifi', 'net-troubleshooting', 'net-ad-m365',
    ]);
    for (const m of mspNetworkingModules) {
      expect(getModuleById(m.id)).toBe(m);
      expect(getModuleQuestions(m.id).length).toBeGreaterThanOrEqual(5);
    }
  });

  it('meets the catalogue population rule (sections, 8+ flashcards, 4+ questions, scenarios, outputs)', () => {
    for (const m of mspNetworkingModules) {
      expect(m.sections.length, m.id).toBeGreaterThanOrEqual(3);
      expect(m.flashcards.length, m.id).toBeGreaterThanOrEqual(8);
      expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(4);
      expect(m.scenarioPrompts.length, m.id).toBeGreaterThanOrEqual(1);
      expect(m.practicalOutputs.length, m.id).toBeGreaterThanOrEqual(1);
    }
  });

  it('turns each ticket into an interactive lab with exactly one correct choice per decision', () => {
    for (const m of mspNetworkingModules) {
      expect(m.interactiveLabs).toHaveLength(1);
      for (const point of m.interactiveLabs![0].decisionPoints) {
        expect(point.options.filter((o) => o.isCorrect)).toHaveLength(1);
      }
    }
  });

  it('scores every question against one of its own options', () => {
    for (const m of mspNetworkingModules) {
      for (const q of m.quiz) {
        if (q.type === 'mcq') expect(q.options.map((o) => o.id)).toContain(q.correctOptionId);
        expect(q.dcsContext).toBeTruthy();
      }
    }
  });

  it('uses ids that collide with nothing else in the catalogue', () => {
    const others = modules.filter((m) => !mspNetworkingModules.includes(m));
    const otherIds = new Set(others.flatMap((m) => [m.id, ...m.quiz.map((q) => q.id), ...m.flashcards.map((f) => f.id)]));
    const ours = mspNetworkingModules.flatMap((m) => [m.id, ...m.quiz.map((q) => q.id), ...m.flashcards.map((f) => f.id)]);
    expect(new Set(ours).size).toBe(ours.length);
    expect(ours.filter((id) => otherIds.has(id))).toEqual([]);
  });
});

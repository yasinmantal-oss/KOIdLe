import type { BattleConfig } from '@koidle/rules';
import { rulesSummary } from '../format';

export function RulesSummary({ config }: { config: BattleConfig }) {
  return (
    <details className="rules">
      <summary>? Kurallar</summary>
      <ul>
        {rulesSummary(config).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </details>
  );
}

## vite-plugin-jsx-forge — transform benchmark

| Scenario                           | median  | mean      | p95      | min     | max      |
| ---------------------------------- | ------- | --------- | -------- | ------- | -------- |
| **Cold start .tsx** (type-aware)   | —       | 1186.6 ms | —        | —       | —        |
| **Cold start .tsx** (syntactic)    | —       | 34.9 ms   | —        | —       | —        |
| **Cold start .ts**                 | —       | 11.3 ms   | —        | —       | —        |
| **Warm request .tsx** (type-aware) | 2.0 ms  | 2.1 ms    | 3.3 ms   | 1.4 ms  | 3.3 ms   |
| **Warm request .tsx** (syntactic)  | 1.7 ms  | 1.7 ms    | 2.8 ms   | 1.2 ms  | 2.8 ms   |
| **Warm request .ts** (baseline)    | 2.9 ms  | 3.4 ms    | 12.0 ms  | 2.2 ms  | 12.0 ms  |
| **Incremental .tsx** (type-aware)  | 95.9 ms | 103.3 ms  | 153.4 ms | 89.1 ms | 153.4 ms |
| **Incremental .tsx** (syntactic)   | 5.8 ms  | 6.1 ms    | 8.7 ms   | 5.0 ms  | 8.7 ms   |
| **Incremental .ts** (baseline)     | 4.5 ms  | 4.7 ms    | 5.7 ms   | 4.0 ms  | 5.7 ms   |

_20 rounds, 3 warmup_

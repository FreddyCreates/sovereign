# Sovereign Training Consumer Contract

`training-contract.v1.json` defines the canonical, versioned material that model and compute repositories may consume from Sovereign.

The contract is intentionally data-oriented. Consumers do not copy an untracked collection of files and call it training. They must preserve the Sovereign commit, source-relative paths, per-file SHA-256 hashes, redaction counts, and a receipt describing exactly what entered the corpus.

Current consumers:

- Auro14B: doctrine, policy, language, architecture, model-registry, and reasoning corpus
- MESIE: validation/governance metadata for spectral training and release evidence

Consumers must distinguish architecture targets from trained checkpoints. A model name or parameter target is not evidence of trained weights.

## Browser runtime

`browser-runtime.v1.json` is the shared Auro/MESIE browser-workspace contract.
It requires governed inference, integrity storage, internal agents, PDF/XLSX
artifacts, bounded static security scanning, packaged extension downloads, and
local ONNX model support with remote model loading disabled by default.

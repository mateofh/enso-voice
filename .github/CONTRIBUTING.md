# Contributing to Enso Voice

Enso Voice is the community-focused distribution maintained in this fork. Bug
reports, fixes and focused product improvements are welcome.

For architecture and upstream development conventions, consult the
[OpenWhispr contributing guide](https://docs.openwhispr.com/contributing).

## Filing issues

- Enso-specific bugs and feature requests belong in this repository.
- Reproducible upstream defects should also be reported to
  [OpenWhispr](https://github.com/OpenWhispr/openwhispr/issues).
- Please use the existing issue templates (`bug_report`, `feature_request`)
  so we have the info needed to reproduce.
- For transcription or audio problems, attaching debug logs is a huge
  help — see [`DEBUG.md`](../DEBUG.md) for how to enable debug logging
  and where the log files live, and [`TROUBLESHOOTING.md`](../TROUBLESHOOTING.md)
  for common fixes to try first.

## Reporting security issues

**Please do not open public issues for security vulnerabilities.**
Follow the private reporting process in [`SECURITY.md`](../SECURITY.md).

## Contributing code

The short version:

1. Fork the repo and create a feature branch off `main`.
2. Make your change, keeping the diff focused.
3. Run `npm run lint` and `npm run format` before opening a PR.
4. Open a pull request against `mateofh/enso-voice` and explain the user impact.

### Local setup

| Requirement | Notes                                                                             |
| ----------- | --------------------------------------------------------------------------------- |
| Node.js     | Version pinned in [`.nvmrc`](../.nvmrc) (currently `24`). Use `nvm use` to match. |
| Install     | `npm install`                                                                     |
| Run dev     | `npm run dev`                                                                     |
| Lint        | `npm run lint`                                                                    |
| Format      | `npm run format`                                                                  |
| Build       | `npm run build` (or `build:mac` / `build:win` / `build:linux`)                    |

Platform-specific setup, local Whisper notes, and packaging details are
in [`README.md`](../README.md) and
[`LOCAL_WHISPER_SETUP.md`](../LOCAL_WHISPER_SETUP.md).

## Thanks

Thanks for helping make Enso Voice better for the community.

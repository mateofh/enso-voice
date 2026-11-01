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

The Expo mobile application is maintained separately in
[`openwhispr-mobile`](../openwhispr-mobile/) with its own dependencies, lockfile, and
development commands. Follow its
[`CONTRIBUTING.md`](../openwhispr-mobile/CONTRIBUTING.md) when changing mobile code.

### CI scope and required checks

PR checks follow the files changed:

| Changed files                                                                          | Application checks |
| -------------------------------------------------------------------------------------- | ------------------ |
| `openwhispr-mobile/**` or the mobile CI workflow                                       | Mobile only        |
| Desktop files at the repository root, including its dependencies and workflows         | Desktop only       |
| Files from both applications                                                           | Both               |
| Shared CI routing, CodeQL configuration, Dependabot configuration, or `.gitattributes` | Both               |

Small routing and status jobs run on every PR. They let required checks finish
successfully when an application is unaffected, without installing or building it.
CodeQL analyzes only the affected application; its weekly scan covers both.
Desktop documentation changes run quality checks but do not trigger packaging.

Mobile validation uses Node 24 and its own lockfile. It checks dependency sources,
integrity, and high/critical advisories before installation, then runs formatting, lint, types, Expo Doctor,
tests, and an iOS JavaScript bundle. Android build validation is deferred until
Android becomes an active release target. Native compilation, signing, EAS builds,
and App Store submissions remain separate release checks. Fork PR jobs receive no
Expo or Apple credentials and cannot deploy.

Repository maintainers should require **Desktop CI**, **Mobile CI**, **CodeQL CI**,
and **lockfile-lint** in the GitHub ruleset, replacing individual build/matrix checks.
Also require GitHub's **CodeQL** code-scanning results check (or a CodeQL code-scanning
merge-protection rule). **CodeQL CI** only confirms that the selected scans completed;
it does not enforce alert severity. Retain the security-results check to block new
high/critical findings. The lockfile job is skipped successfully for mobile
changes, whose lockfile is covered by Mobile CI. Require review before merging,
including explicit review of workflow and dependency changes, and enable approval
for workflows from outside contributors. Ruleset settings are managed on GitHub;
adding these workflow files does not configure them automatically.

## Thanks

Thanks for helping make Enso Voice better for the community.

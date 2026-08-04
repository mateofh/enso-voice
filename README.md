<p align="center">
  <img src="src/assets/logo.svg" alt="Enso Voice" width="120" />
</p>

<h1 align="center">Enso Voice</h1>

<p align="center">Voice to useful text—fast, private and under your control.</p>

Enso Voice is a macOS and Windows desktop app for dictation, meeting capture,
notes and text cleanup. It offers three routes without trapping the user:

- **Local:** audio stays on the device and does not consume credits.
- **BYOK:** use a personal provider key and do not consume Enso credits.
- **Enso Cloud:** community-managed processing with a transparent monthly balance.

## Community beta

Active Enso community members receive Community Pro with 120 managed credits
per month. One dictation minute costs one credit; a diarized meeting minute
costs two. Internal operators receive a separate 1,200-credit allowance. When
credits run out, local and BYOK modes continue to work.

Cloud audio is processed ephemerally and is not stored by Enso. Note sync is
separate and opt-in. See [PRODUCT.md](PRODUCT.md) and [DESIGN.md](DESIGN.md) for
the beta contract.

## Development

Requires Node.js 24+.

```bash
git clone https://github.com/mateofh/enso-voice.git
cd enso-voice
npm install
npm run dev
```

Copy `.env.example` to `.env` to connect authentication and managed cloud.
Without cloud configuration, local and BYOK workflows remain available.

Useful checks:

```bash
npm run quality-check
npm test
npm run build:renderer
```

## Releases

The community beta targets signed and notarized builds for macOS (Apple Silicon
and Intel) and signed installers for Windows. Release secrets and DNS are held
by the Enso company account; no long-lived provider secret belongs in this
public repository.

## Open-source lineage

Enso Voice is a fork of [OpenWhispr](https://github.com/OpenWhispr/openwhispr)
and remains licensed under MIT. We preserve upstream attribution and keep an
`upstream` Git remote so fixes can be incorporated continuously. The managed
service, provider credentials and membership data live in a separate private
repository.

## Security

Do not open public issues for vulnerabilities. Follow [SECURITY.md](SECURITY.md)
to report them privately.

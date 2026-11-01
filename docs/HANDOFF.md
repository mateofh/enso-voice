# Handoff — Enso Voice community beta

Actualizado: 1 de noviembre de 2026, America/Bogota (sección superior); resto del 4 de agosto.

## Actualización 1 de noviembre de 2026 — sync con upstream

Objetivo inmediato: usar Enso Voice para grabar reuniones, transcribirlas y
guardarlas en el servidor Enso, además de transcribir audios y dictar.

- Fork `mateofh/enso-voice`: merge de 796 commits de OpenWhispr hecho en local
  (rama `enso/upstream-sync-2026-11`), 3 adelante / 0 detrás de upstream.
  **Sin push todavía.** El árbol se copió a `Microapps/Enso-Voice` en la rama
  `feat/enso-voice-upstream-sync`.
- Validado con Node 24: quality-check, lint, i18n:check (11 idiomas) y la suite
  completa: 10.222 aprobadas, 14 omitidas, 2 fallidas solo por falta de Xcode
  Command Line Tools en la máquina (`swiftc`/`xcrun`).
- API: `/api/streaming-usage` acepta `clientTranscriptionId` además de
  `clientUsageId` (tests en `enso-voice-api/tests/idempotency.test.ts`).

Dominio confirmado: **beenso.com**. Mapa aplicado en app y API:

- API y auth en un solo host: `https://voice.beenso.com` (staging:
  `https://staging-voice.beenso.com`, solo por variable de entorno).
- Cookie de sesión limitada a ese host (`COOKIE_DOMAIN` sin definir). Nunca
  `beenso.com`: la recibirían la web y todas las microapps.
- Privacidad y términos: `beenso.com/es/privacidad` y `beenso.com/es/terminos`.
  Falta confirmar que cubran audio, transcripciones y notas.
- Soporte: `hola@beenso.com`. Remitente de correos: `voice@beenso.com`, que
  requiere verificar `beenso.com` en Resend.
- El esquema `ensovoice://` y los nombres de cookie no son dominios y no cambian.

Pendientes nuevos detectados en el sync:

1. **Límite de 4,5 MB por request en Vercel.** Las reuniones largas llegan solo
   porque el cliente las parte en trozos de 4 MB; cada trozo se diariza aparte y
   los `Speaker N` no son consistentes entre trozos. Diseño recomendado: subida a
   almacenamiento (presigned URL) y transcripción completa desde URL en el servidor.
2. **Better Auth:** cliente 1.7.14, API 1.6.25. Subir la API y regenerar el
   esquema al crear la base real (Fase 1), antes de ejecutar migraciones.
3. **Rutas que la app llama y la API no sirve:** `stt-config`,
   `note-recording-config`, `analytics/*`, `leaderboard/*`, `shared-dictionary/*`,
   `me/joinable`, `stt/orukeet/*`, `gemini-live-token`. Fallan sin bloquear
   dictado, reuniones ni notas; el reporter de `activation/*` quedó apagado.
4. Compartir notas (`shareNoteRules.ts`) sigue apuntando a `notes.openwhispr.com`;
   está oculto y la API no lo implementa.
5. **No existe la página para restablecer contraseña.** El correo de reset
   redirige a `voice.beenso.com/reset-password`; hay que servir esa página desde
   la API antes de abrir la beta. Lo mismo vale para `/auth/desktop-callback`
   cuando se active el login social.

## Resultado actual

Enso Voice ya existe como fork público sincronizado de OpenWhispr, acompañado
por una API privada independiente. El alcance implementado es una beta cerrada
para la comunidad Enso: dictado, limpieza de texto, notas, importación de audio
y reuniones con diarización. Facturación pública, equipos, integraciones,
referidos, SSO, login social y agente/chat están ocultos mediante feature flags.

Esto todavía no es un lanzamiento productivo. El código y los pipelines están
listos, pero faltan infraestructura, dominios, credenciales, firma de binarios y
pruebas en máquinas limpias.

## Repositorios y ramas

| Componente | Repositorio              | Rama                       | Commit de entrega | Visibilidad                 |
| ---------- | ------------------------ | -------------------------- | ----------------- | --------------------------- |
| Desktop    | `mateofh/enso-voice`     | `enso/productization-beta` | `3b763099`        | Público, fork de OpenWhispr |
| API        | `mateofh/enso-voice-api` | `main`                     | `fc57bb8`         | Privado                     |

En el momento del handoff, la rama desktop estaba cero commits detrás de
`OpenWhispr/openwhispr:main` y un commit por delante. Ambos working trees estaban
limpios antes de crear este documento.

## Contrato de producto de la beta

- Community Pro: 120 créditos administrados por mes calendario.
- Enso Internal: 1.200 créditos administrados por mes calendario.
- Dictado: 1 crédito por minuto de audio.
- Reunión o diarización: 2 créditos por minuto de audio.
- Procesamiento local y BYOK: no consume créditos Enso.
- Al agotarse el saldo, la grabación se conserva y se ofrece local/BYOK.
- La sincronización de notas personales es opt-in.
- Workspaces/equipos no forman parte de esta beta.
- Managed realtime está desactivado; reuniones administradas usan carga batch.

La definición completa vive en [`PRODUCT.md`](../PRODUCT.md) y el sistema visual
en [`DESIGN.md`](../DESIGN.md).

## Qué se implementó en desktop

- Marca, nombre de aplicación, protocolo `ensovoice://`, rutas de actualización
  y configuración de empaquetado Enso.
- Manrope para interfaz y JetBrains Mono para datos técnicos.
- Tema azul/neutral, superficies compactas y estados de créditos.
- Registro y login por email/password con verificación de correo.
- Lectura de entitlement, saldo, fuente, estado y fecha de renovación.
- Importación de reuniones con diarización gestionada y cobro 2x.
- Sync personal sujeto a capability del servidor.
- Feature flags en `src/config/product.ts` para limitar la superficie beta.
- CSP, `sandbox: true`, `webSecurity: true` y eliminación de `.env` del paquete.
- Traducciones consistentes en los diez locales existentes.
- CI de calidad y check semanal de divergencia con upstream.
- Builds beta limitados a macOS y Windows; Linux/Nix permanece desactivado.

Se conservaron identificadores internos `openwhispr` cuando cambiarlos podía
romper datos locales, compatibilidad con upstream o descargas nativas. No deben
confundirse con la marca visible.

## Qué se implementó en la API

Stack: Hono, Better Auth, PostgreSQL/Neon y despliegue preparado para Vercel.

- Auth email/password, verificación y reset vía Resend.
- Sesiones bearer firmadas para el cliente Electron.
- Webhook CRM HMAC-SHA256 con ventana anti-replay de cinco minutos.
- Reconciliación tardía: una membresía recibida antes del registro se aplica al
  usuario cuando aparece.
- Entitlements con prioridad `internal > community` y estado de gracia.
- Periodos mensuales, idempotencia y ledger append-only.
- Proxy en memoria a Deepgram Nova-3 con `mip_opt_out=true`.
- Formato `Speaker N` para diarización.
- Endpoint de razonamiento con OpenAI Responses API y sin herramientas.
- Rate limits persistidos en PostgreSQL.
- Sync personal validado por capability; equipos excluidos.
- Administración protegida con `x-admin-key` y comparación constante.
- Límites de cuerpo, CORS, headers seguros, IDs de request y errores saneados.

Las migraciones están en el repositorio privado:

- `migrations/001_initial.sql`: auth, CRM, entitlements, créditos, ledger, AI y sync.
- `migrations/002_rate_limits.sql`: rate limiting persistente.

## Validación realizada

Desktop:

- `npm run quality-check`
- `npm run i18n:check`
- `npm test`: 1.136 pruebas; 1.018 aprobadas, 118 omitidas, 0 fallidas.
- `npm run build:renderer`
- `npm audit --omit=dev`: cero vulnerabilidades reportadas.
- GitHub Actions `Enso quality`: exitoso en el commit de entrega.

API:

- `npm run lint`
- `npm run build`
- `npm test`: dos pruebas unitarias de firma de webhook aprobadas.
- `npm audit --omit=dev`: cero vulnerabilidades reportadas.
- GitHub Actions `API quality`: exitoso en el commit de entrega.

Las comprobaciones locales se ejecutaron con Node 22.23.1 y emitieron avisos de
engine. Ambos proyectos exigen Node 24; producción y CI deben usar Node 24.

## Dependencias y configuración pendientes

No hay secretos productivos en Git. Crear y custodiar:

### API / Vercel

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `CRM_WEBHOOK_SECRET`
- `ADMIN_API_KEY`
- `DEEPGRAM_API_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `INTERNAL_EMAILS`
- credenciales OAuth únicamente si se habilitan login social o SSO

Revisar explícitamente `OPENAI_REASON_MODEL` contra los modelos habilitados en
la cuenta antes del despliegue; el valor del ejemplo no debe considerarse una
garantía de disponibilidad.

### Desktop / GitHub

Variables:

- `VITE_AUTH_URL=https://auth.ensovoice.com`
- `VITE_ENSO_API_URL=https://api.ensovoice.com`
- las cuatro variables `AZURE_SIGNING_*`

Secretos:

- service principal de Azure Artifact Signing
- certificado y contraseña Apple
- credenciales de notarización Apple
- token de publicación cuando `github.token` no sea suficiente

## Orden recomendado para continuar

1. Crear Neon/Postgres productivo con rol de mínimo privilegio.
2. Desplegar la API privada en Vercel con Node 24 y variables productivas.
3. Ejecutar `npm run db:migrate` antes de recibir tráfico.
4. Confirmar el esquema generado por Better Auth 1.6.25 contra la base real.
5. Asociar `api.ensovoice.com` y `auth.ensovoice.com`; comprobar TLS y CORS.
6. Configurar Resend y verificar entrega, enlaces y dominio remitente.
7. Configurar Deepgram/OpenAI con límites de gasto y alertas.
8. Conectar el CRM al webhook firmado y ejecutar la reconciliación inicial.
9. Crear cuatro cuentas internas y una muestra de miembros Community Pro.
10. Configurar firma/notarización y producir candidatos macOS/Windows.
11. Ejecutar el smoke test completo de [`BETA_RELEASE.md`](BETA_RELEASE.md).
12. Distribuir primero a 5 usuarios, observar 48 horas y ampliar hasta 50.

## Comandos de operación

API local:

```bash
cd ../enso-voice-api
nvm use 24
npm ci
cp .env.example .env
npm run db:migrate
npm run dev
```

Desktop local:

```bash
cd ../Enso-Voice
nvm use 24
npm ci
npm run dev
```

Control de upstream:

```bash
git fetch upstream main
git rev-list --left-right --count HEAD...upstream/main
```

El resultado esperado antes de integrar una actualización es `N 0`: Enso puede
tener commits propios, pero no debe quedar detrás de upstream sin una decisión
explícita.

## Riesgos abiertos

- No se ejecutaron migraciones contra una base productiva real.
- No hay pruebas end-to-end de auth, CRM, créditos y sync con PostgreSQL real.
- No se han firmado ni probado instaladores en máquinas limpias.
- No se ha validado todavía el flujo completo con un CRM real.
- Las tarifas, límites y disponibilidad de proveedores deben verificarse antes
  de fijar el techo operativo de US$150/mes.
- Managed streaming sigue apagado porque el token directo del proveedor no
  permite imponer duración por sesión de forma confiable.
- Las pantallas ocultas de upstream siguen en el bundle. Antes de convertirlas
  en producto, requieren una revisión específica de seguridad, UX y backend.
- La sincronización futura con upstream puede producir conflictos en auth,
  billing, ventanas Electron, locales y workflows de release.

## Decisiones que no deben revertirse accidentalmente

- No empaquetar `.env` ni exponer claves de proveedores con prefijo `VITE_`.
- No habilitar billing público durante la beta comunitaria.
- No cobrar procesamiento local o BYOK.
- No habilitar managed streaming sin enforcement server-side verificable.
- No permitir equipos mediante una bandera solamente; requiere autorización y
  aislamiento multi-tenant en servidor.
- No editar ni borrar filas del ledger; usar ajustes compensatorios.
- No romper compatibilidad local sólo para eliminar nombres internos heredados.

## Release gate y rollback

La lista operativa, smoke test, secretos y rollback están en
[`docs/BETA_RELEASE.md`](BETA_RELEASE.md). Ningún build debe anunciarse como
producción hasta completar todas sus filas con evidencia y responsable.

Ante un incidente:

1. Pausar o revertir el deployment de Vercel.
2. Retirar claves gestionadas para apagar AI cloud sin afectar local/BYOK.
3. Preservar IDs fallidos del CRM para replay posterior.
4. Retirar el release desktop afectado y publicar aviso de beta.

## Contacto y ownership por asignar

Antes de abrir la beta hay que escribir nombres reales junto a estos roles:

- Engineering owner
- Release owner macOS
- Release owner Windows
- Community/CRM owner
- Incident commander
- Soporte de `support@ensovoice.com`

Hasta que esos responsables y credenciales existan, el estado correcto es
“implementado y validado en código; pendiente de despliegue productivo”.

# Enso Voice Design System

## Direction

Enso Voice adapts the established Enso system to a desktop productivity tool. The product uses a restrained color strategy: neutral working surfaces with Enso blue reserved for primary actions, active selection, focus, and live recording state. Familiar desktop affordances and compact hierarchy take precedence over marketing expression.

The physical scene is a business owner moving between calls, documents, and messages for hours at a time. Both light and dark themes must remain calm under sustained use; neither theme exists only for visual drama.

## Color

- Brand accent: `oklch(0.66 0.19 251)`; focus: `oklch(0.52 0.2 251)`.
- Light canvas uses a near-white neutral tilted toward the brand hue, never parchment or cream.
- Dark canvas uses charcoal-blue surfaces with clear elevation steps and no glow.
- Ink, muted text, borders, success, warning, and error are semantic roles shared by both themes.
- Body and placeholder text meet 4.5:1 contrast; large text and controls meet at least 3:1.
- Accent occupies less than 10% of ordinary working screens.

## Typography

- Manrope is the only family used for headings, body, navigation, controls, and labels.
- JetBrains Mono is limited to hotkeys, timestamps, identifiers, and technical diagnostics.
- Fraunces is not used in product controls; it may appear only in rare editorial or human-proof surfaces.
- Fixed desktop scale from 12 px metadata to 32 px onboarding headings; no fluid display typography.
- Headings use tracking between `-0.02em` and `-0.03em`; prose is capped at 75 characters.

## Shape and Layout

- Inputs and cards use 10–14 px radii; pills are reserved for statuses and compact actions.
- A component may use a one-pixel border or a small shadow, not both as decoration.
- Navigation, settings, notes, and usage share one component vocabulary across platforms.
- Use inline and progressive disclosure before modals.
- Layout changes structurally for narrow windows; typography remains fixed.

## Motion

- Most state transitions last 150–220 ms using `cubic-bezier(0.16, 1, 0.3, 1)`.
- Motion communicates recording, processing, completion, loading, or navigation state only.
- No orchestrated page entrances or decorative loops.
- `prefers-reduced-motion` replaces movement with an immediate state change or short crossfade.

## Core Components

- `ProcessingModeChoice`: Enso credits, local processing, and BYOK with explicit privacy/cost copy.
- `CreditBalance`: quiet remaining-minutes display with renewal date and 25/10/0 percent states.
- `RecordingStatus`: seek-safe recording, processing, recovery, and completion states.
- `EntitlementStatus`: Community Pro, Internal, grace period, and Free with source and expiry.
- `FallbackChoice`: preserves the recording and offers local/BYOK when cloud is unavailable or depleted.
- Existing buttons, inputs, badges, progress, tabs, dialogs, and toasts remain canonical and receive complete hover, focus, active, disabled, loading, and error states.

## Content and Accessibility

- Default UI language follows the operating system; Spanish and English are first-class.
- Credits are described as managed transcription minutes, never as money or game currency.
- Audio processing location and retention appear before first use and remain visible in settings.
- Empty states teach the next action. Skeletons represent loading; spinners are limited to compact controls.
- All controls have visible focus, accessible names, non-color state cues, and minimum 44 px primary touch/click targets where layout permits.

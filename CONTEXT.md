# Knowledge Comparison Video Series

This context defines the reusable short-form educational-video series in this repository. Each entry teaches the distinction between two commonly confused concepts using a consistent visual and narration format.

## Content model

**Video**:
One self-contained comparison entry stored in `videos/<slug>/`, comprising its brief, composition, voiceover inputs, and rendered outputs.
_Avoid_: Composition, render, clip

**Series**:
The collection of Videos that share one Design Contract and common TTS configuration.
_Avoid_: Template, channel

**Design Contract**:
The shared, mandatory visual and timing grammar for every Video in the Series: the three-zone layout, visual tokens, typography, and motion rules. A change to it is a Series-level change, not a Video-specific customization.
_Avoid_: Theme, per-video layout

**Narration Line**:
One timed unit of a Video's explanation, with a spoken text for TTS and a caption text for the viewer. The two may differ in spelling or phrasing when necessary for natural pronunciation, but must convey the same meaning.
_Avoid_: Audio clip, caption line

**Measured Voiceover Duration**:
The actual duration of a generated Narration Line, measured from its MP3. It is the authoritative timing input for that line's audio, caption, avatar gesture, and speaking animation.
_Avoid_: Estimated duration, nominal beat length

## Production configuration

**TTS Configuration**:
The Series-level selection and settings of the voice-generation provider, voice, and related credentials, stored at the repository root. It applies to every Video; a Video owns only its narration content and pronunciation adjustments.
_Avoid_: Per-video provider configuration, narration script

**Channel Label**:
The Series-level on-screen channel identity, configured once and synchronized into each Video's eyebrow before previewing, checking, rendering, or publishing.
_Avoid_: Video title, caption

## Production lifecycle

**Checked Video**:
A Video whose composition passes the HyperFrames quality checks. A Video must be Checked before it may be rendered.
_Avoid_: Previewed video, rendered video

**Rendered Video**:
A reproducible MP4 output generated from a Checked Video.
_Avoid_: Source video, published video

**Published Video**:
A Rendered Video that has been sent to the publishing destination and has a shareable result.
_Avoid_: Rendered video, preview

**Video Brief**:
The source of intent and scope for one Video: its concept pair, explanatory angle, audience format, assets, and narration rhythm. Content changes must update the Brief before or alongside the composition.
_Avoid_: Implementation notes, composition

**Target Duration**:
The expected short-form length of a Video, normally around 30–40 seconds. It is a pacing guideline derived from the measured voiceover and the meaningful explanation required, not a hard limit.
_Avoid_: Maximum duration, fixed runtime

**Comparison Arc**:
The mandatory explanatory sequence of a Video: identify both concepts, raise the distinction, explain the first concept, explain the second, compare them directly, then land a concise payoff. Its beats are fixed; AI chooses 10–16 Narration Lines within their documented ranges and explains why the chosen count is warranted.
_Avoid_: Eight-line script, twelve-line script, fixed narration template

**Concept Visual**:
The top-zone representation of one concept in a Video. It is Video-specific and may use a supplied asset or a CSS/SVG placeholder, provided it makes the A/B distinction clear and complies with the Design Contract.
_Avoid_: Required stock image, Series asset

**Concept Pair**:
Two related concepts that viewers are likely to confuse. A Video exists to make their essential distinction clear, not to rank them as better or worse.
_Avoid_: Versus matchup, unrelated comparison

**Content Claim**:
A factual assertion made by a Narration Line about a concept. Claims should support the Video's explanatory intent, but the Series does not require a formal source list or verification record in the Video Brief.
_Avoid_: Citation requirement, research dossier

## Project boundaries

**Self-contained Video Project**:
The independently runnable HyperFrames project for one Video. It owns the project's composition, assets, metadata, and production commands while inheriting the Series-level configuration at the repository root.
_Avoid_: Shared composition, monolithic video project

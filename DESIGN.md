# 小葉故事屋 · Visual identity

## Style Prompt
A warm, light, tactile storybook library. Cream paper, forest-green cloth covers, terracotta details, hand-cut SVG characters, layered landscape silhouettes, soft print texture, generous whitespace. The story emerges from an open book like a small paper theatre. Traditional Chinese throughout.

## Colors
- #f5f1e8: warm paper canvas
- #263f35: forest-green ink and covers
- #b65335: terracotta buttons and accents
- #a7b58c: sage landscape layers
- #efb5a7: pig paper cutouts

## Typography
Georgia and Noto Serif CJK TC for book headings; Noto Sans CJK TC / Microsoft JhengHei / system sans-serif for controls and body. Local fallbacks; no remote font requirement.

## Motion
GSAP paused finite timelines, registered under window.__timelines. 16-second scenes, layered entrances and actor gestures. Three.js renders a thick open book, extruded paper trees, volumetric pig and wolf characters, real houses, lights and shadows. Fold old pop-ups down, bend a subdivided page mesh over the spine, then raise the new scene. OrbitControls allows pointer dragging. Reduced-motion preference shows static scenes with complete dialogue. User can pause, replay, or navigate at any point. Narrative callbacks belong to the web reader, not the visual composition timeline.

## What NOT to Do
No neon, generic gradients, emoji artwork, fake book entries, audio before opening a book, endless GSAP repeats, or external runtime CDN dependency.

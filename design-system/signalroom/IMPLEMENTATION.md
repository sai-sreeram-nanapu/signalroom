# SignalRoom redesign decisions

Requested October 1, 2026: completely redesign the UI using UI/UX Pro Max.

Read the upstream skill, generated the recommendations in MASTER.md, and queried the React stack guidance. Treat the generated system as recommendations. Product-specific decisions below define the actual implementation.

- Research studio with cool white surfaces, white voting and form panels, and an ink results panel. Depth belongs to the marketing illustration; reading and input surfaces remain opaque.
- User-selected Navy & sky palette: #135e9c primary actions with white text; #192f45 navy text and results surfaces; #f1f6fa cool white canvas; #b2ddf6 sky and #b7d7ca mint chart bars. Muted text #556b7b on light surfaces, #c2d4e4 on navy. Each chart also has a letter, label, percentage, and count.
- Self-hosted Plus Jakarta Sans variable font, using the first verified design-system query's SaaS typography recommendation. The regenerated default recommended a serif pairing; the requested replacement of the old editorial direction makes the sans-serif recommendation a better fit here.
- Desktop workspace side rail; existing authenticated account controls preserved. On smaller screens, keep the app's collapsible navigation and remove the decorative rail.
- Landing: asymmetric message and dimensional illustration, two clear actions, clearly labeled illustrative app preview, three workflow cards, final action.
- Workspace: accurate counts, search and lifecycle filters, experiment cards, actionable empty state, separate illustrative example.
- Editor: numbered sections, visible labels, stable variant inputs, public-image disclosure, current draft summary, optional upload. The decorative progress bars indicate detail/message completion; image upload remains optional.
- Reviewer: large selectable cards, visible pressed states, keyboard-operable clarity choices, retained form values during auth, submission confirmation.
- Results: counts and overall clarity, labeled bars and vote counts, contextual live response announcement. AI: summary, evidence/confusion/disagreement cards, next experiment and sample limitations.
- Shared spacing, semantic tokens, visible focus, 44px principal controls, reflow, reduced-motion support. No auto-rotating content or decorative motion library.

No API, authorization, collection schema, publication semantics, billing or AI model changes are part of this redesign.

## Webflow 3D reference refinement

Reference supplied by the user: https://webflow.com/blog/3d-design-website

Applied layered planes, lighting and a product narrative to the marketing hero. The CSS perspective illustration shows two messages, a reviewer reaction and a next move. The Radio brand icon becomes a dimensional cube. The product preview and workflow icons gain subtle thickness and elevation.

The scene is decorative and hidden from assistive technology; complete product explanations and controls remain ordinary DOM content. There is no WebGL dependency, 3D asset download, continuous animation, scroll interception, or pointer tracking. Hover changes only the decorative cards' transforms. Reduced motion freezes the interaction; touch users receive the static composition. Mobile clipping is confined to decorative planes and preserves horizontal document reflow.

Cold authentication checks now have a visible branded connection state instead of a blank screen.

## Figma reference review

The user narrowed the review to resources required for this product on October 1, 2026. The 286-article index was catalogued; unrelated film production, business frameworks, and AI tool roundups were skipped. Full-library reading is not claimed.

Reviewed relevant guidance:
- [Color combinations](https://www.figma.com/resource-library/color-combinations/) and [palette types](https://www.figma.com/resource-library/types-of-color-palettes/): deliberate limited palette, functional contrast, consistent roles. Our palette adapts these principles rather than copying a swatch set.
- [UI principles](https://www.figma.com/resource-library/ui-design-principles/) and [visual hierarchy](https://www.figma.com/resource-library/what-is-visual-hierarchy/): primary actions stand out; nearby results support comparison; secondary interpretation is progressively disclosed.
- [Interaction design](https://www.figma.com/resource-library/interaction-design/): selecting a choice and committing a vote are distinct states. Committed feedback drives both results and interpretation.
- [Typography](https://www.figma.com/resource-library/typography-in-design/): clear type scale, readable copy, aligned headings, controlled line lengths.
- [Responsive design](https://www.figma.com/resource-library/responsive-website-design/), [layouts](https://www.figma.com/resource-library/website-layout-ideas/), and [grids](https://www.figma.com/resource-library/web-design-grid-layout-examples/): flexible columns become a readable mobile sequence; controls and content reflow together.
- [Accessibility and inclusion](https://www.figma.com/resource-library/creating-accessible-and-inclusive-design/): labeled charts, keyboard controls, visible focus, and alternatives to color alone.
- [Design system implementation](https://www.figma.com/resource-library/design-system-implementation/) and [token architecture](https://www.figma.com/resource-library/design-token-architecture/): shared semantic colors and existing reusable controls keep pages consistent.

Motion communicates change: interruptible number interpolation, eased progress transforms, finite entrance/selection feedback, and expanding interpretation. Reduced-motion preference disables transitions and finishes numeric updates immediately. No continuous decorative animation.

The demo interpretation is recomputed for submitted example votes, including ties, vote replacement, and reset. It remains explicitly illustrative. Real AI interpretation retains its manual refresh because generation uses account credits.

The user selected Navy & sky from three interactive palette previews. The selected palette applies to the favicon, first-paint canvas, shared components, 3D marketing scene, navigation, forms, voting states, workspace index, results, and interpretation. Shared dark-surface and series tokens prevent palette drift.

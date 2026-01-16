# Versus - Product Requirements Document

**Author:** Walt Harms
**Date:** 2026-01-15
**Version:** 1.0
**Status:** Draft

---

## Executive Summary

Versus is a mobile-first web game that ranks movies through pairwise comparisons. Instead of tedious drag-and-drop ordering, users make quick "this or that" decisions—swipe left or right on mobile, click on desktop. It's fast, fun, and surprisingly revealing.

Users select a genre, then face off 10 random movies head-to-head using a Swiss tournament format. After ~15-20 quick choices, they see their ranked list from #1 to #10, complete with playful commentary on their surprising picks.

### What Makes This Special

Binary choices are exhilarating. There's no overthinking, no reordering, no "maybe this one goes here." Just gut reactions. Users discover preferences they didn't know they had—and they keep coming back to play again.

---

## Project Classification

**Type:** Web Application
**Domain:** Entertainment / Gaming
**Complexity:** Medium

---

## Success Criteria

### The Magic Moment

A user finishes ranking, sees "You picked Fast & Furious over Schindler's List," laughs, and immediately hits Play Again.

### Measurable Outcomes

- **Primary:** Play Again button click rate (target: >40% of completed games)
- **Secondary:** Game completion rate (users who finish after starting)
- **Tertiary:** Return visits within 7 days

---

## Product Scope

### MVP (Must Have)

- Genre selection screen with tappable cards
- 5 launch genres: Sci-Fi/Fantasy, Horror, Animation, Action, Rom-Com
- 10 movies per round (random within selected genre)
- Swiss tournament comparison engine
- Swipe gestures (mobile) / Click interaction (desktop)
- Progress bar (visual only, no text)
- Results screen: Ranked list #1-#10
- Fun commentary on notable picks
- Play Again button
- Session persistence (survives page reload)
- OMDB API integration for movie data + posters
- Bright, playful, poster-centric design

### Growth (Post-MVP)

- Ad monetization (interstitial between rounds)
- OAuth / social sign-in
- Shareable results (image cards for social media)
- User-created lists
- More genres
- Analytics dashboard

### Out of Scope

- Analytics and utilization tracking (MVP)
- Ad placement (MVP)
- User accounts (MVP)
- Native mobile apps
- Multiplayer / competitive modes
- Movie ratings or reviews

---

## Target Users

### Primary User

**Pop Culture Enthusiasts**
Anyone who has opinions about movies. They've debated "Star Wars vs. Star Trek" or "Marvel vs. DC" and enjoy discovering their own preferences. They're looking for quick entertainment—something to do for 2-3 minutes while waiting in line or killing time.

### Secondary Users

- **Couples / Friends:** Playing together, comparing results, sparking debates
- **Content Creators:** Looking for shareable content (post-MVP with sharing features)

---

## Technical Decisions

### Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Backend | Bun | Fast, modern, JS/TS native |
| Frontend | React | Largest AI training corpus, mature ecosystem |
| Data | OMDB API | Free tier, movie posters + metadata |
| Design | Mobile-first | Primary use case is phone swiping |

### Key Technical Considerations

- **Swiss Tournament Algorithm:** Efficient ranking with minimal comparisons (~15-20 for 10 items)
- **Touch vs. Mouse Detection:** Enable swipe on touch devices, click targets on desktop
- **Session Storage:** Persist game state in localStorage for reload survival
- **OMDB Rate Limits:** Cache responses, batch requests where possible
- **Multi-genre Movies:** Movies can appear in multiple genre pools (Harry Potter in Sci-Fi AND Action)

---

## User Experience Flow

```
┌─────────────────┐
│   Landing Page  │
│  "Pick a Genre" │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Genre Selection │
│  [5 tap cards]  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Game Screen   │
│ [Poster vs Poster] │
│  ← Swipe/Click →   │
│  [Progress Bar]    │
└────────┬────────┘
         │ (~15-20 comparisons)
         ▼
┌─────────────────┐
│ Results Screen  │
│   #1 - #10 List │
│  Fun Commentary │
│  [Play Again]   │
└─────────────────┘
```

---

## Design Direction

- **Vibe:** Bright, playful, cinema-inspired
- **Focus:** Movie posters as hero elements
- **Mobile:** Full-screen posters, swipe gestures, haptic feedback consideration
- **Desktop:** Side-by-side posters, clear click targets
- **Progress:** Minimal progress bar, no text clutter
- **Results:** Clean list, personality through commentary

---

## Open Questions

1. **Domain name:** versus-[what].[tld]?
2. **OMDB API limits:** Need to verify free tier constraints
3. **Movie quality filter:** Minimum popularity/rating threshold to avoid obscure films?
4. **Commentary tone:** Snarky? Wholesome? Customizable?

---

## Next Steps

1. Run `/plan-reqs` to document functional and non-functional requirements
2. Run `/plan-arch` to finalize technical architecture decisions
3. Run `/plan-stories` to break into epics and user stories

---

*Generated via collaborative PRD discovery session*

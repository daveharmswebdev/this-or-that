# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This-or-That is a preference ranking app that determines a user's order of preference through pairwise comparisons. Users answer a series of "would you rather" questions (e.g., "hot dog or hamburger?"), and the app uses a Swiss tournament format to efficiently rank items from most to least preferred.

## Concept

- Present users with ~10 items to rank
- Use pairwise comparisons ("this or that" questions)
- Apply Swiss tournament format to minimize the number of comparisons needed
- Output a complete preference ordering from 1 to 10

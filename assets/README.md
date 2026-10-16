# Visual assets

Backpack artwork is cached locally from the community-maintained [tarkov.dev asset service](https://tarkov.dev/api/). Original Escape from Tarkov item artwork belongs to Battlestate Games; this project does not claim ownership. `backpacks/sources.json` records the original item IDs and source URLs. Names were matched using the TarkovTracker/tarkovdata item names and sp-tarkov/server English locale; no packing dimensions or rules were imported.

The 44 matched built-in backpacks use these images only for decoration. Custom bags and the three unmatched models retain the original generic backpack icon. Runtime rendering does not contact the asset service.

Rajdhani Medium comes from [Google Fonts](https://github.com/google/fonts/tree/main/ofl/rajdhani), under the SIL Open Font License included in `fonts/OFL-Rajdhani.txt`. The local font is used for Latin labels and numbers; Chinese uses the existing system fallback.

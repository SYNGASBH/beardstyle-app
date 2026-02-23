# Raw Images Folder

Place your downloaded Midjourney images here.

## Naming Convention

Use the exact slug from the database:

| Style | Filename |
|-------|----------|
| Full Beard | `full-beard.png` |
| Stubble | `stubble-3day.png` |
| Van Dyke | `van-dyke.png` |
| Clean Shaven | `clean-shaven.png` |
| Short Boxed | `short-boxed-beard.png` |
| Corporate | `corporate-beard.png` |
| Goatee | `goatee.png` |
| Balbo | `balbo.png` |
| Circle Beard | `circle-beard.png` |
| Ducktail | `ducktail.png` |
| Garibaldi | `garibaldi.png` |
| Mutton Chops | `mutton-chops.png` |
| Anchor Beard | `anchor-beard.png` |
| Chin Strap | `chin-strap.png` |
| Beardstache | `beardstache.png` |

## After Adding Images

Run the processing script:

```powershell
# Windows
.\process-images.ps1 -InputDir ".\raw" -OutputDir ".\processed"
```

```bash
# Mac/Linux
./process-images.sh ./raw ./processed
```

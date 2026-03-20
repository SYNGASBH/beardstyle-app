import { BeardIllustration } from './BeardIllustration'
import styles from './ResultsScreen.module.css'

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16">
      <polyline points="3,8 7,12 13,4" />
    </svg>
  )
}

export function StyleCard({ style, selected, onSelect, onDetail, onRealistic }) {
  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={onSelect}
    >
      {selected && (
        <div className={styles.cardCheck}>
          <CheckIcon />
        </div>
      )}

      <div className={styles.illustration}>
        {style.imageUrl
          ? <img
              src={style.imageUrl}
              alt={style.name}
              className={styles.illustrationImg}
              style={{ mixBlendMode: 'multiply' }}
            />
          : <BeardIllustration shape={style.shape} size={80} />
        }
      </div>

      <div className={styles.cardBody}>
        <p className={styles.cardName}>{style.name}</p>
        <p className={styles.cardDesc}>{style.desc}</p>
        <p className={styles.cardMatch}>{style.matchLabel}</p>
        {onRealistic && (
          <button
            className={styles.btnRealistic}
            onClick={(e) => { e.stopPropagation(); onRealistic(style); }}
            title="Generiši realističnu sliku"
          >
            🎨 Vizualizacija
          </button>
        )}
      </div>
    </div>
  )
}

import { BeardIllustration } from './BeardIllustration'
import styles from './ResultsScreen.module.css'

export function StyleDetail({ style, onBack }) {
  return (
    <div className={styles.detail}>
      <button className={styles.back} onClick={onBack}>&larr; Nazad na stilove</button>

      <div className={styles.detailHero}>
        <div className={styles.detailIllus}>
          {style.imageUrl
            ? <img src={style.imageUrl} alt={style.name}
                   style={{ width: '100%', height: '100%',
                            objectFit: 'cover', mixBlendMode: 'multiply' }} />
            : <BeardIllustration shape={style.shape} size={96} />
          }
        </div>
        <div className={styles.detailInfo}>
          <h3 className={styles.detailName}>{style.name}</h3>
          <p className={styles.detailWhy}>{style.why}</p>
          <div className={styles.detailTags}>
            {style.pros?.map((p, i) => (
              <span key={i} className={`${styles.tag} ${styles.tagPro}`}>{p}</span>
            ))}
            {style.cons?.map((c, i) => (
              <span key={i} className={`${styles.tag} ${styles.tagCon}`}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {style.maintenance && (
        <div className={styles.maintenance}>
          <p className={styles.maintTitle}>Zahtjevnost odrzavanja</p>
          {Object.entries(style.maintenance).map(([label, val]) => (
            <div key={label} className={styles.maintRow}>
              <span className={styles.maintLabel}>{label}</span>
              <div className={styles.maintBarWrap}>
                <div
                  className={styles.maintBar}
                  style={{ width: `${val}%` }}
                />
              </div>
              <span className={styles.maintVal}>{val}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

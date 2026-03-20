import { useState, useCallback } from 'react'
import { FaceShapeIcon } from './FaceShapeIcon'
import { StyleCard } from './StyleCard'
import { StyleDetail } from './StyleDetail'
import { BarberNote } from './BarberNote'
import { userAPI } from '../../services/api'
import styles from './ResultsScreen.module.css'

const TABS = ['stilovi', 'detalji', 'napomena']

const SHAPE_NAMES_BS = {
  oval:      'Oval',
  round:     'Okruglo',
  square:    'Kvadratno',
  heart:     'Srce',
  diamond:   'Dijamant',
  oblong:    'Pravokutno',
  triangle:  'Trokutno',
}

export function ResultsScreen({ result, imageUrl, onSave, onShare, onReset, onRealistic }) {
  const [tab, setTab]               = useState('stilovi')
  const [selectedId, setSelectedId] = useState(
    result?.beardStyles?.[0]?.id ?? null
  )
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState(null)

  const { aiAnalysis, beardStyles } = result
  const selectedStyle = beardStyles.find(s => s.id === selectedId)

  const handleSelect = (id) => {
    setSelectedId(id)
    setTab('stilovi')
  }

  const handleSave = useCallback(async () => {
    if (!selectedId || saving) return
    setSaving(true)
    setSaveMsg(null)

    try {
      const payload = {
        faceShape:          aiAnalysis.faceShape,
        recommendedStyleId: selectedId,
        confidenceScore:    aiAnalysis.confidence ?? null,
        imageUrl:           imageUrl ?? null,
        rawResult:          result,
      }

      const { data } = await userAPI.saveAnalysis(payload)

      setSaveMsg({ ok: true, text: 'Rezultat sacuvan!' })
      onSave?.({ ...result, selectedStyleId: selectedId, savedId: data.analysis.id })
    } catch (err) {
      const msg = err.response?.status === 401
        ? 'Prijavite se da sacuvate rezultat'
        : 'Greska pri cuvanju. Pokusajte ponovo.'
      setSaveMsg({ ok: false, text: msg })
    } finally {
      setSaving(false)
    }
  }, [selectedId, saving, aiAnalysis, imageUrl, result, onSave])

  return (
    <div className={styles.root}>

      {/* Header */}
      <header className={styles.header}>
        <span className={styles.logo}>BeardStyle</span>
        <span className={styles.stepLabel}>Rezultati analize</span>
      </header>

      {/* Face shape hero */}
      <section className={styles.hero}>
        <div className={styles.faceWrap}>
          <FaceShapeIcon shape={aiAnalysis.faceShape} />
          {aiAnalysis.confidence && (
            <span className={styles.confidence}>
              {Math.round(aiAnalysis.confidence * 100)}%
            </span>
          )}
        </div>
        <div className={styles.heroInfo}>
          <p className={styles.shapeLabel}>Oblik lica</p>
          <h2 className={styles.shapeName}>
            {SHAPE_NAMES_BS[aiAnalysis.faceShape] ?? aiAnalysis.faceShape}
          </h2>
          <div className={styles.features}>
            {(aiAnalysis.features ?? []).map((f, i) => (
              <span key={i} className={styles.featureTag}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.active : ''}`}
            onClick={() => setTab(t)}
          >
            {{ stilovi: 'Stilovi', detalji: 'Detalji', napomena: 'Napomena' }[t]}
          </button>
        ))}
      </nav>

      {/* Panels */}
      <div className={styles.panelWrap}>

        {tab === 'stilovi' && (
          <div className={styles.grid}>
            {beardStyles.map(style => (
              <StyleCard
                key={style.id}
                style={style}
                selected={style.id === selectedId}
                onSelect={() => handleSelect(style.id)}
                onDetail={() => { handleSelect(style.id); setTab('detalji') }}
                onRealistic={onRealistic}
              />
            ))}
          </div>
        )}

        {tab === 'detalji' && selectedStyle && (
          <StyleDetail
            style={selectedStyle}
            onBack={() => setTab('stilovi')}
            onRealistic={onRealistic}
          />
        )}

        {tab === 'napomena' && (
          <BarberNote
            analysisDate={result.meta?.timestamp}
            selectedStyleName={selectedStyle?.name}
          />
        )}

      </div>

      {/* Actions */}
      <footer className={styles.actions}>
        <button
          className={styles.btnPrimary}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Cuvam...' : 'Sacuvaj rezultat'}
        </button>
        {saveMsg && (
          <span className={saveMsg.ok ? styles.saveOk : styles.saveErr}>
            {saveMsg.text}
          </span>
        )}
        <button className={styles.btnGhost} onClick={() => onShare?.(result)}>
          Podijeli
        </button>
        <button className={styles.btnGhost} onClick={onReset}>
          Nova analiza
        </button>
      </footer>

    </div>
  )
}

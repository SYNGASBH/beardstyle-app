import styles from './ResultsScreen.module.css'

/**
 * B2B barber note — printable summary a client can show their barber.
 */
export function BarberNote({ analysisDate, selectedStyleName }) {
  const formattedDate = analysisDate
    ? new Date(analysisDate).toLocaleDateString('bs-BA', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : null

  return (
    <div className={styles.note}>
      <h3 className={styles.noteTitle}>Napomena za frizera</h3>
      <p className={styles.noteSubtitle}>
        Pokazi ovu napomenu svom frizeru za preciznije rezultate
      </p>

      <div className={styles.noteContent}>
        <p>
          Klijent je koristio BeardStyle AI analizu za odabir stila brade.
          {selectedStyleName && (
            <> Preporuceni stil: <strong>{selectedStyleName}</strong>.</>
          )}
        </p>
        <p>
          Analiza je uzela u obzir oblik lica, strukturu vilice, gustinu dlaka
          i proporcije lica. Molimo prilagodite preporuku iskustvu i procjeni
          klijentove teksture dlaka uzivo.
        </p>
        <p>
          Savjeti za frizera: provjerite rast na obrazima i vratu prije
          odabira konacne linije. Preporucite produkte za odrzavanje na
          osnovu klijentovog tipa koze.
        </p>
      </div>

      {formattedDate && (
        <p className={styles.noteMeta}>
          Generisano: {formattedDate} &middot; BeardStyle AI
        </p>
      )}
    </div>
  )
}

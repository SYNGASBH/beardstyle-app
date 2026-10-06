import React from 'react';

const DO = [
  ['Ravno ispred kamere', 'Kamera u visini očiju, na udaljenosti ispružene ruke (40–60 cm).'],
  ['Lice ispunjava oval', 'Čelo pri vrhu ovala, brada dodiruje donji rub. Uši i linija vilice moraju biti vidljivi.'],
  ['Glava ravno', 'Bez naginjanja u stranu, bez okretanja, brada paralelna s podom.'],
  ['Svjetlo sprijeda', 'Prozor ili lampa ispred vas, bez jakih sjena i bez svjetla iza leđa.'],
  ['Neutralan izraz', 'Usta zatvorena, bez osmijeha — osmijeh mijenja oblik vilice.'],
  ['Slobodno lice', 'Bez naočala, kape i maske; kosa sklonjena s čela i obraza.'],
];

const DONT = ['Selfie odozdo ili odozgo', 'Glava okrenuta u profil', 'Filteri i uljepšavanje', 'Više osoba na slici'];

/** Static illustration of correct face placement, shown for uploads and camera alike. */
export default function FacePlacementGuide() {
  return (
    <section className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6" aria-labelledby="face-guide-title">
      <h3 id="face-guide-title" className="font-bold mb-4">📐 Kako postaviti lice za fotografiju</h3>
      <div className="grid gap-6 md:grid-cols-[200px_1fr] items-start">
        <svg viewBox="0 0 200 240" className="w-48 mx-auto" role="img"
          aria-label="Lice unutar ovala: oči na isprekidanoj liniji, brada na donjem rubu ovala">
          <rect width="200" height="240" rx="12" fill="#1f2937" />
          <ellipse cx="100" cy="116" rx="68" ry="92" fill="#374151" />
          {/* head */}
          <path d="M100 36c-34 0-56 26-56 62 0 40 22 76 56 80 34-4 56-40 56-80 0-36-22-62-56-62z" fill="#d6b49a" />
          <ellipse cx="78" cy="102" rx="6" ry="4" fill="#1f2937" />
          <ellipse cx="122" cy="102" rx="6" ry="4" fill="#1f2937" />
          <path d="M100 108v20h-7" stroke="#8b6b55" strokeWidth="2" fill="none" />
          <path d="M86 146h28" stroke="#8b6b55" strokeWidth="3" strokeLinecap="round" />
          {/* guide */}
          <ellipse cx="100" cy="116" rx="68" ry="92" fill="none" stroke="#22c55e" strokeWidth="3" />
          <line x1="50" x2="150" y1="102" y2="102" stroke="#22c55e" strokeDasharray="5 4" />
          <line x1="100" x2="100" y1="32" y2="200" stroke="#22c55e" strokeDasharray="5 4" strokeOpacity="0.6" />
          <line x1="76" x2="124" y1="208" y2="208" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
          <text x="100" y="226" textAnchor="middle" fontSize="11" fill="#e5e7eb">brada na liniji</text>
          <text x="174" y="105" fontSize="10" fill="#e5e7eb">oči</text>
        </svg>
        <div>
          <ol className="space-y-2 text-sm text-gray-700">
            {DO.map(([title, text], i) => (
              <li key={title} className="flex gap-2">
                <span className="font-semibold text-green-700">{i + 1}.</span>
                <span><strong>{title}</strong> — {text}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm font-semibold text-gray-800">Izbjegavajte:</p>
          <ul className="mt-1 flex flex-wrap gap-2 text-xs">
            {DONT.map(item => (
              <li key={item} className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full">✕ {item}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            Kod kamere oval postaje zelen kada je lice pravilno postavljeno. Provjera se radi na vašem uređaju.
          </p>
        </div>
      </div>
    </section>
  );
}

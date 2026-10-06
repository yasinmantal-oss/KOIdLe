import { useState } from 'react';
import type { Gate1Answers } from '../gate1';

const initial: Gate1Answers = {
  eglence: 0,
  kararVermekZorundaKaldim: 0,
  gerekendenUzun: false,
  iseYaramayanKartSinirlendirdi: false,
  sonucuDegistirenKarariHatirliyorum: false,
  farkliHissettirdi: false,
  not: '',
};

export function Gate1Form({ onSubmit }: { onSubmit: (a: Gate1Answers) => void }) {
  const [a, setA] = useState(initial);
  const ready = a.eglence > 0 && a.kararVermekZorundaKaldim > 0;
  return (
    <form
      className="gate1"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onSubmit(a);
      }}
    >
      <h3>Maç formu (Faz 2)</h3>
      <Scale label="1. Eğlence" value={a.eglence} onChange={(v) => setA({ ...a, eglence: v })} />
      <Scale
        label="2. Karar vermek zorunda kaldım mı?"
        value={a.kararVermekZorundaKaldim}
        onChange={(v) => setA({ ...a, kararVermekZorundaKaldim: v })}
      />
      <YesNo
        label="3. Maç gereğinden uzun hissettirdi mi?"
        value={a.gerekendenUzun}
        onChange={(v) => setA({ ...a, gerekendenUzun: v })}
      />
      <YesNo
        label="4. Elimde işe yaramayan kart yüzünden sinirlendim mi?"
        value={a.iseYaramayanKartSinirlendirdi}
        onChange={(v) => setA({ ...a, iseYaramayanKartSinirlendirdi: v })}
      />
      <YesNo
        label="5. Sonucu değiştiren bir kombomu/kararımı hatırlıyor muyum?"
        value={a.sonucuDegistirenKarariHatirliyorum}
        onChange={(v) => setA({ ...a, sonucuDegistirenKarariHatirliyorum: v })}
      />
      <YesNo
        label="6. Bu job farklı hissettirdi mi?"
        value={a.farkliHissettirdi}
        onChange={(v) => setA({ ...a, farkliHissettirdi: v })}
      />
      <label className="gate1__note">
        7. Tek cümle not
        <input
          value={a.not}
          onChange={(e) => setA({ ...a, not: e.target.value })}
          maxLength={300}
        />
      </label>
      <button type="submit" disabled={!ready}>
        Kaydet
      </button>
    </form>
  );
}

function Scale(props: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <fieldset>
      <legend>{props.label}</legend>
      {[1, 2, 3, 4, 5].map((n) => (
        <label key={n}>
          <input type="radio" checked={props.value === n} onChange={() => props.onChange(n)} />
          {n}
        </label>
      ))}
    </fieldset>
  );
}

function YesNo(props: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <fieldset>
      <legend>{props.label}</legend>
      <label>
        <input type="radio" checked={props.value} onChange={() => props.onChange(true)} />
        Evet
      </label>
      <label>
        <input type="radio" checked={!props.value} onChange={() => props.onChange(false)} />
        Hayır
      </label>
    </fieldset>
  );
}

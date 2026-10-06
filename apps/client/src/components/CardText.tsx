import { keywordParts } from '../format';

export function CardText({ text }: { text: string }) {
  return (
    <>
      {keywordParts(text).map((p, i) =>
        p.kw ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: metin parçaları sabit sırada
          <span key={i} className={`kw kw--${p.kw}`}>
            {p.text}
          </span>
        ) : (
          p.text
        ),
      )}
    </>
  );
}

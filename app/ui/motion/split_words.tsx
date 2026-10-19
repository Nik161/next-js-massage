import { Fragment } from "react";

// Splits text into words that rise from a mask when an ancestor <Reveal>
// becomes visible. `offset` continues the stagger across several calls.
export default function SplitWords({
  text,
  offset = 0,
}: {
  text: string;
  offset?: number;
}) {
  return text.split(" ").map((word, index) => (
    <Fragment key={index}>
      <span className="split-word">
        <span style={{ "--i": index + offset } as React.CSSProperties}>
          {word}
        </span>
      </span>{" "}
    </Fragment>
  ));
}

import { ArrowClockwise } from "@phosphor-icons/react";
import "~/styles/artwork-playback.css";

export function ArtworkReplay({ name, reducedMotion, ready, replay }: {
  name: string;
  reducedMotion: boolean;
  ready: boolean;
  replay: () => void;
}) {
  return <div className="artwork-controls">
    {!reducedMotion && <button className="artwork-replay" type="button" disabled={!ready} onClick={replay} aria-label={`Replay animation: ${name}`}>
      <ArrowClockwise size="1em" aria-hidden /> Replay animation
    </button>}
  </div>;
}

// FIXTURE: playful slop. A settings screen that has been "given personality" from the stock
// catalogue: confetti on save, cute copy, a stock illustration, a sound with no off switch.
import confetti from "canvas-confetti";
import useSound from "use-sound";

export function Saved() {
  const [play] = useSound("/pop.mp3");
  const onSave = () => {
    play();
    confetti({ particleCount: 120, spread: 70 });
  };
  return (
    <section>
      <img src="/illustrations/undraw_celebration.svg" alt="" width={240} height={180} />
      <h2>Woohoo! You're all set!</h2>
      <p>Oops! Something went wrong</p>
      <p>Something went wrong</p>
      <p>It's quiet in here</p>
      <p>Hang tight, we're working our magic</p>
      <button onClick={onSave}>Save changes</button>
    </section>
  );
}

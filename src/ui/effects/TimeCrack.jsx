import { useEffect } from "react";

export default function useTimeCrack(ref) {
  useEffect(() => {
    const interval = setInterval(() => {
      // probabilidad baja → sensación de evento extraño
      if (Math.random() < 0.3) {
        ref.current?.classList.add("menu-crack");

        setTimeout(() => {
          ref.current?.classList.remove("menu-crack");
        }, 250);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [ref]);
}
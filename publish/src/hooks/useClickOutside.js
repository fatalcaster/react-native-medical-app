import { MutableRefObject, useEffect, useRef } from "react";

function useClickOutside(onClickOutside, ignoreRef) {
  const ref = useRef();

  const handleClickOutside = (event) => {
    if (
      !ref.current ||
      ref.current.contains(event.target) ||
      (ignoreRef !== undefined && ignoreRef.current.contains(event.target))
    ) {
      return;
    }
    onClickOutside();
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref };
}

export default useClickOutside;

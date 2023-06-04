import { useEffect, useRef } from "react";
function useKey(key, cb) {
  const callback = useRef(cb);

  useEffect(() => {
    callback.current = cb;
  });

  useEffect(() => {
    function handle(event) {
      if (event.code === key) {
        event.preventDefault();
        callback.current(event);
      } else if (key === "ctrls" && event.key === "s" && event.ctrlKey) {
        event.preventDefault();

        callback.current(event);
      }
    }

    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [key]);
}
export default useKey;

import React, { useRef, useEffect } from "react";

const MyComponent = ({
  children,
  minWidth,
  maxWidth,
  setWidth,
  hidden,
  style
} : {
  children: React.ReactNode,
  minWidth: number,
  maxWidth: number,
  setWidth: (fn: any) => void,
  hidden?: boolean,
  style?: React.CSSProperties
}) => {
  //resizing sidebar
  const isResized = useRef(false);

  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      if (!isResized.current) {
        return;
      }

      setWidth((previousWidth: number) => {
        const newWidth = previousWidth + e.movementX / 2;

        const isWidthInRange = newWidth >= minWidth && newWidth <= maxWidth;

        return isWidthInRange ? newWidth : previousWidth;
      });
    });

    window.addEventListener("mouseup", () => {
      isResized.current = false;
    });
  }, []);


  return (
    <div
      className={`md:static fixed z-40 h-full flex flex-1 ${
        hidden ? "hidden" : ""
      }`}
      style={style}
    >
      {children}
      <div
        //draggable divider
        onMouseDown={() => {
          console.log("mousedown")
          isResized.current = true;
        }}
        className="w-0 pl-[3px] bg-zinc-50 cursor-col-resize "
      ></div>
    </div>
  );
};

export default MyComponent;

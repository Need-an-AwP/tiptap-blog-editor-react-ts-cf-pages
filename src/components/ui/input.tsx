import * as React from "react"
import { useState, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  maxWidth?: number;
  autoResize?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, maxWidth, autoResize = false, ...props }, ref) => {
    const [width, setWidth] = useState<number | undefined>(undefined);
    const spanRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      if (autoResize && spanRef.current) {
        const newWidth = Math.min(spanRef.current.offsetWidth + 10, maxWidth || Infinity);
        setWidth(newWidth);
      }
    }, [props.value, autoResize, maxWidth]);

    return (
      <>
        <input
          type={type}
          className={cn(
            "flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          style={{ 
            width: autoResize ? width : '100%', 
            maxWidth: maxWidth ? `${maxWidth}px` : undefined 
          }}
          ref={ref}
          {...props}
        />
        {autoResize && (
          <span
            ref={spanRef}
            style={{
              maxWidth: maxWidth ? `${maxWidth}px` : '100%',
              position: 'absolute',
              visibility: 'hidden',
              whiteSpace: 'pre',
              fontSize: '14px', // 确保与输入框字体大小一致
              paddingLeft: '12px',
              paddingRight: '12px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {props.value || props.placeholder}
          </span>
        )}
      </>
    )
  }
)
Input.displayName = "Input"

export { Input }

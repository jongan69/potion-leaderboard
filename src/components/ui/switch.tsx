"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const [checked, setChecked] = React.useState(false);

  const handleCheckedChange = (checked: boolean) => {
    setChecked(checked);
    props.onCheckedChange?.(checked);
  };

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-[28px] w-[120px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#d500fe] data-[state=unchecked]:bg-input relative",
        className
      )}
      {...props}
      onCheckedChange={handleCheckedChange}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-6 w-6 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[88px] data-[state=unchecked]:translate-x-0 z-10"
        )}
      />
      <div className="absolute inset-0 flex items-center justify-between px-3">
        <span className={`text-xs text-black dark:text-white font-medium transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`}>
          Groups
        </span>
        <span className={`text-xs text-black dark:text-white font-medium transition-opacity ${checked ? 'opacity-0' : 'opacity-100'}`}>
          Traders
        </span>
      </div>
    </SwitchPrimitives.Root>
  );
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

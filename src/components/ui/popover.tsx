import * as React from "react";
import { clsx } from "clsx";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(
  undefined
);

interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PopoverTriggerRefContext =
  React.createContext<React.RefObject<HTMLElement> | null>(null);

export function Popover({
  children,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const content = document.querySelector(
        "[data-popover-content]"
      ) as HTMLElement;

      if (
        triggerRef.current &&
        content &&
        !triggerRef.current.contains(target) &&
        !content.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    // Delay để tránh đóng ngay khi click trigger
    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }, 0);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, setOpen]);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <PopoverTriggerRefContext.Provider
        value={triggerRef as React.RefObject<HTMLElement>}
      >
        <div className="relative" ref={triggerRef}>
          {children}
        </div>
      </PopoverTriggerRefContext.Provider>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error("PopoverTrigger must be used within Popover");

  const { open, setOpen } = context;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen(!open);
      },
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <div onClick={() => setOpen(!open)} className="cursor-pointer">
      {children}
    </div>
  );
}

export function PopoverContent({
  children,
  className,
  align = "start",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end" | "center";
}) {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error("PopoverContent must be used within Popover");

  const triggerRef = React.useContext(PopoverTriggerRefContext);
  const { open } = context;
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open || !contentRef.current || !triggerRef?.current) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const content = contentRef.current;
      if (!trigger || !content) return;

      const triggerRect = trigger.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = triggerRect.bottom + 8;
      let left = triggerRect.left;

      // Adjust horizontal position based on align - giữ sát trigger
      if (align === "end") {
        left = triggerRect.right - contentRect.width;
      } else if (align === "center") {
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      } else {
        // align === "start" - giữ sát bên trái trigger
        left = triggerRect.left;
      }

      // Chỉ điều chỉnh nếu thực sự overflow
      if (left + contentRect.width > viewportWidth - 16) {
        // Shift về trái để vừa viewport
        left = viewportWidth - contentRect.width - 16;
      }

      // Prevent overflow left
      if (left < 16) {
        left = 16;
      }

      // If not enough space below, show above
      if (top + contentRect.height > viewportHeight - 16) {
        top = triggerRect.top - contentRect.height - 8;
        // If still not enough space, center vertically
        if (top < 16) {
          top = Math.max(16, (viewportHeight - contentRect.height) / 2);
        }
      }

      content.style.top = `${top}px`;
      content.style.left = `${left}px`;
    };

    // Initial position
    updatePosition();

    // Update on scroll/resize
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, align, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      data-popover-content
      className={clsx(
        "fixed z-[9999] rounded-2xl border hairline glass",
        "shadow-lg",
        className
      )}
      style={{ top: 0, left: 0 }}
    >
      {children}
    </div>
  );
}

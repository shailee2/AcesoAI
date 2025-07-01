"use client"

import { useState, type ReactNode, createContext, useContext } from "react"

interface DropdownContextType {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined)

const useDropdown = () => {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error("Dropdown components must be used inside <Dropdown>")
  }
  return context
}

export const Dropdown = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen((prev) => !prev)
  const close = () => setIsOpen(false)

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  )
}

Dropdown.Trigger = ({ children }: { children: ReactNode }) => {
  const { toggle } = useDropdown()
  return (
    <button onClick={toggle} className="transition-colors" style={{ color: "#aaaaaa" }}>
      {children}
    </button>
  )
}

Dropdown.Content = ({
    children,
    className = "",
    style,
  }: {
    children: ReactNode
    className?: string
    style?: React.CSSProperties
  }) => {
    const { isOpen } = useDropdown()
    if (!isOpen) return null
  
    return (
      <div
        className={`absolute right-0 z-50 mt-2 w-48 rounded-md shadow-lg border p-2 ${className}`}
        style={style}
      >
        {children}
      </div>
    )
  }
  

Dropdown.Item = ({
  children,
  onClick,
}: {
  children: ReactNode
  onClick?: () => void
}) => {
  const { close } = useDropdown()
  const handleClick = () => {
    onClick?.()
    close()
  }

  return (
    <button
      onClick={handleClick}
      className="block w-full text-left px-4 py-2 text-sm rounded transition-colors hover:bg-red-500/20"
      style={{ color: "#ededed" }}
    >
      {children}
    </button>
  )
}

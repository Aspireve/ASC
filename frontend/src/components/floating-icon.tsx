interface FloatingIconProps {
  color: string
  position: string
  children: React.ReactNode
}

export function FloatingIcon({ color, position, children }: FloatingIconProps) {
  return (
    <div className={`absolute ${position} w-12 h-12 rounded-xl shadow-lg bg-white flex items-center justify-center`}>
      <div className={`text-${color}`}>
        {children}
      </div>
    </div>
  )
}


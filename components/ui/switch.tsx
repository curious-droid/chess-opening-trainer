import React from 'react'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  id?: string
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, id }) => {
  return (
    <label htmlFor={id} className="switch">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <span className="slider round"></span>
    </label>
  )
}
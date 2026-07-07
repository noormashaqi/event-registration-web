interface ActiveBadgeProps {
  isActive: boolean
  onToggle?: () => void
  disabled?: boolean
}

export function ActiveBadge({ isActive, onToggle, disabled }: ActiveBadgeProps) {
  const classes = `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
    isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
  }`

  if (!onToggle) {
    return <span className={classes}>{isActive ? 'Active' : 'Inactive'}</span>
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      title={isActive ? 'Click to deactivate' : 'Click to activate'}
      className={`${classes} cursor-pointer hover:opacity-75 disabled:cursor-wait disabled:opacity-50`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </button>
  )
}
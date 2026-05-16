export function CornerDownRightCurve({ className = "w-4 h-4" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Apenas o caminho do canto, sem a ponta da seta */}
      <polyline points="5 10 10 15 19 15" />
    </svg>
  )
};
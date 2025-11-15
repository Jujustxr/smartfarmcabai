import React from 'react'

const PageTransition = ({ children, type = 'fade' }) => {
  let cls = 'animate-fadeIn'
  if (type === 'slide') cls = 'animate-slideIn'
  if (type === 'blink') cls = 'animate-blinkSlow'

  return (
    <div className={cls}>
      {children}
    </div>
  )
}

export default PageTransition
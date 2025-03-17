import React from 'react'

export default function Content({children}) {
  return (
    <section className='wrap'>
      <div className='container-fluid'>
        {children}
      </div>
    </section>
  )
}

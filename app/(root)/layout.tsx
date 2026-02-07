import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-screen min-w-[100vw] overflow-x-hidden">
      <div className="w-screen min-w-[100vw]">
        {children}
      </div>
    </main>
  )
}

export default Layout
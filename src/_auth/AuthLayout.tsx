import { Outlet, Navigate } from "react-router-dom"

const AuthLayout = () => {
  const isAuthenticated = false

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <> 
          <section className="flex flex-col flex-1 justify-center items-center py-10 h-screen">
          <Outlet />
          </section>
          <img 
          src="/assets/images/side-img.svg" 
          alt="logo"
          className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}  
    </>
  )
}

export default AuthLayout

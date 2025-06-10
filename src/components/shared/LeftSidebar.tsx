import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import type { INavLink } from "@/Types";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess} = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate("/sign-in");
  }, [isSuccess]);

  return (
    <nav className='leftsidebar gap-6'>
      <div className="flex flex-col gap-11">
        <Link to='/' className='flex gap-3 items-center'>
          <img 
            src="/assets/images/logo.png" 
            alt="logo" 
            width={170}
            height={36}
          />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
            <img 
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} 
              alt="profile" 
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="body-bold">
                {user.name}
              </span>
              <span className="small-regular text-light-3">
                @{user.username}
              </span>
            </div>
          </Link>

          <ul className="flex flex-col gap-6">
            {sidebarLinks.map((link: INavLink) => {
              const isActive = pathname === link.route;
              return (
              <li key={link.label} className=
              {`leftsidebar-link group
                ${isActive && 'bg-primary-500'}`}
              >
                <NavLink 
                  to={link.route} 
                  className="flex gap-4 items-center p-4"
                >
                  <img 
                    src={link.imgURL} 
                    alt={link.label} 
                    className={
                      `group-hover:invert-white
                      ${isActive && 'invert-white'}`
                    }
                  />
                  <span className="">
                    {link.label}
                  </span>
                </NavLink>
              </li>
            )})
            }
          </ul>
      </div>
      <Button variant={"ghost"} className="shad-button_ghost p-4 py-7 hover:!bg-dark-1" onClick={() => signOut()}>
        <img
          src="/assets/icons/logout.svg" 
          alt="logout" 
        />
        <span className="small-medium lg:base-medium">
          Logout
        </span>
      </Button>
    </nav>
  )
}

export default LeftSidebar

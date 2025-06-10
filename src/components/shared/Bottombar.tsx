import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { bottombarLinks } from "@/constants";
import type { INavLink } from "@/Types";

const Bottombar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess} = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className='bottom-bar'>
        {bottombarLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
              <Link 
                to={link.route}
                key={link.label} 
                className={`${ isActive && 'bg-primary-500 rounded-[10px]' }
                flex-center flex-col transition gap-1 p-2`} 
              >
                <img 
                  src={link.imgURL} 
                  alt={link.label} 
                  width={16}
                  height={16}
                  className={ `${isActive && 'invert-white'}` }
                />
                <span className="tiny-medium text-light-2">
                  {link.label}
                </span>
              </Link>
          )})
        }
    </section>
  )
}

export default Bottombar

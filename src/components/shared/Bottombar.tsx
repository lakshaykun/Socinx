import { Link, useLocation } from "react-router-dom"
import { bottombarLinks } from "@/constants";

const Bottombar = () => {
  const { pathname } = useLocation();

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

import Topbar from '@/components/shared/Topbar.js';
import LeftSidebar from '@/components/shared/LeftSidebar.jsx';
import { Outlet } from 'react-router-dom';
import Bottombar from '@/components/shared/Bottombar';


const RootLayout = () => {
  return (
    <div className="w-full flex flex-col md:flex-row">
      <Topbar />
      <LeftSidebar />
      <section className='flex flex-1 lg:h-full overflow-hidden'>
        <Outlet />
      </section>
      <Bottombar />
    </div>
  )
}

export default RootLayout

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faUser, faUsers,faArrowRightFromBracket,faChevronDown } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import {useEffect, useState} from 'react'
const Sidebaar = ()=>{
const router = useRouter()
const [userType, setUserType] = useState('')
const Logout = ()=>{
    localStorage.clear();
    router.push("/")
}
const currentYear = new Date().getFullYear();

useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
       let localType = localStorage.getItem('type');
       if(localType){
        setUserType(localType)
       }  
       
    }
 
    }, []);
return(
    <>
                <div className="expovent__sidebar" data-background="/assets/img/bg/dropdown-bg.png">
                <div className="logo-details">
                    <span>
                    <Link href="/dashboard"><img className='logo__white' src="/assets/images/logo1.webp" alt=""/></Link>
                    </span>
                    <span>
                    <Link href="/dashboard"><img className='log__smnall' src="/assets/images/logo.webp" alt=""/></Link>
                    </span>
                </div>
                <div className="sidebar__inner simple-bar">
                    <div className="dlabnav">
                    <ul className="metismenu" id="menu">
                        <li> <Link className="has-arrow" href="/dashboard" robotoregular="true"  ><FontAwesomeIcon icon={faHouse}/><span className='nav-text'>Dashboard</span> </Link></li>
                        <li className="mm-active"><Link href="/profile" robotoregular="true"> <FontAwesomeIcon icon={faUser}/> <span className='nav-text'>Profile</span> </Link> </li>
{           userType &&  userType == 'admin' &&            
                     <li><Link href="/users" robotoregular="true"> <FontAwesomeIcon icon={faUsers} /> <span className='nav-text'>User Management </span></Link></li>}
                    </ul>
                    
                    <div className="sidebar__profile" onClick={()=>{Logout()}}>
                        <Link href="#"><FontAwesomeIcon icon={faArrowRightFromBracket} /><span className="links_name">Log out</span></Link>
                    </div>
                    <div className="sidebar__copyright">
                    <p> © {currentYear} EZ Rankings Pvt. Ltd. <br />All Rights Reserved.</p>
                    </div>
                    </div>
                </div>
            </div>
    </>
)
}
export default Sidebaar
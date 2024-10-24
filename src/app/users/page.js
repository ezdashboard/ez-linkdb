"use client"
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse,faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import $ from "jquery";
import { React,useState,useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Sidebaar from '../template/Sidebaar';
import Header from '../template/Header';
import Link from "next/link"
import axios from 'axios';
import Loader from '../template/Loading';
import { useRouter } from 'next/navigation';


const Users=()=>{
    const router = useRouter()
    const [isLoading, setLoading] = useState(true)
    const [totPage, setTotPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limitp, setlimitp] =useState(5);
    const [userType, setUserType] = useState('')
    const [userStoreData, setUserStoreData] = useState([]);
    const sideCanvasActive= () =>{ 
        $(".expovent__sidebar").removeClass("collapsed");
        $(".expovent__sidebar").removeClass("open");
        $(".app__offcanvas-overlay").removeClass("overlay-open");    
    }

    const fetchData = async (page) => {
        try {
        const config = {
            headers: {
              Authorization: `Bearer ${localStorage.tokenAuth ? localStorage.tokenAuth :''}`,
            },
          };
        axios.get(`${process.env.API_BASE_URL}users.php?page=${page}&limit=${limitp}`,config)
          .then(res => {
              const data = res.data.userData.map((item) => {
                return {
                  id: item.userid,
                  name: item.name,
                  email: item.email,
                  contactno: item.contactno,
                  companyname: item.companyname,
                  title: item.title,
                  logo: item.logo,
                  type: item.type,
                  status: item.status == '1' ? 'Active' : 'Inactive',
                  image: item.image
                }
            }
          )
          setUserStoreData(data);
          if(res.data.total && res.data.total > 0){
            setTotPage(res.data.total)
        }
          setLoading(false);
        })
        .catch(err => {
            setLoading(false)
         })
        } catch (error) {
            // Handle errors here
            if(error && error.response.data && error.response.data.detail){
              setMsg(error.response.data.detail);
            }
            // console.error(error);
          }
     }
     const getPage = (url)=>{
        setLoading(true)
        if(url){
        router.push(url)
        }else{
        setLoading(false)
        }
       // setLoading(false)
     } 
      useEffect(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
              let companyname = localStorage.getItem('companyname');
              let title = localStorage.getItem('title');
              let name = localStorage.getItem('name');
              let email = localStorage.getItem('email');
              let contactno = localStorage.getItem('contactno');
              let about = localStorage.getItem('about');
              let location = localStorage.getItem('location');
              let image = localStorage.getItem('image');
              let logo = localStorage.getItem('logo');
              let updatedBy = localStorage.getItem('tokenAuth');
              let userid = localStorage.getItem('userid');
          }
          fetchData(currentPage);
          let localType = localStorage.getItem('type');
          if(localType){
           setUserType(localType)
          }
          }, [currentPage]);
      return(
        <>
         <div className='page_-full-wrapper'>
           <Sidebaar/>
            <div className="app__offcanvas-overlay" onClick={sideCanvasActive}></div>
            <div className="page__body-wrapper">
             <Header />
                <div className="body__overlay"></div>
                <div className="app__slide-wrapper">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="breadcrumb__wrapper">
                                <div className="breadcrumb__inner">
                                    <div className="breadcrumb__icon">
                                      <FontAwesomeIcon icon={faHouse}/>
                                    </div>
                                    <div className="breadcrumb__menu">
                                        <nav>
                                          <ul>
                                              <li><span><a href="#">Home</a></span></li>
                                              <li className="active"><span>User List</span></li>
                                          </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-xl-12 col-md-12'>
                            { 
                             userType && userType == 'admin' &&   
                                <div className='add-more-new'>
                                <a href='#' onClick={()=>{
                                    getPage('/add-user')
                                }}>Add User</a>
                              </div>
                            }
                              <div className='lms-table-wrap-p'>
                               <Table >
                                <thead>
                                    <tr>
                                    <th>S.No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Contact No.</th>
                                    {/* <th>Role</th> */}
                                    <th>Status</th>
                                    <th>Action</th>
                                    </tr>
                                </thead>
                        { !isLoading &&
                                <tbody>
                                    { userStoreData && userStoreData.length > 0 && userStoreData.map((users, u)=>{
                                        return(
                                    <tr key={u}>
                                        <td>{(limitp*(currentPage-1)) + (u+1)}.</td>
                                        <td>{users.name}</td>
                                        <td>{users.email}</td>
                                        <td>{users.contactno}</td>
                                        {/* <td>{users.type}</td> */}
                                        <td>{users.status}</td>
                                        <td><a href={'#'} onClick={()=>{
                                    getPage('/users/'+users.id)
                                }}><FontAwesomeIcon icon={faPenToSquare} /></a></td>
                                    </tr>
                                    )})}
                                </tbody>}
                                </Table>
                              </div>
                              {isLoading && <Loader />}
                              <div className="pagination-wrap">
                                <ul className="pagination">
                                    {        currentPage > 1 &&                          
                                        <li className="page-item" onClick={()=>{
                                        setCurrentPage(currentPage-1)}}><a href="#" className='page-link'>{currentPage-1}</a></li>
                                    }                                  
                                        <li className="page-item active"><span className="page-link">{currentPage}<span className="visually-hidden">{currentPage}</span></span></li>
                                    {        currentPage < totPage &&                          
                                        <li className="page-item" onClick={()=>{
                                        setCurrentPage(currentPage+1)}}><a href="#" className='page-link'>{currentPage+1}</a></li>
                                    }
                                </ul>                                  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
        </>
    )
}
export default Users


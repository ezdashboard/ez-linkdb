"use client"
import Sidebaar from '../template/Sidebaar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { React, useState, useEffect } from 'react';
import $ from "jquery";
import Header from '../template/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse,faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link';
import MyVerticallyCenteredModal from '../template/ProfileEdit'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Loader from '../template/Loading';

const Profile=()=>{
  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(true)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [msg, setFormStatus] = useState('')
  
  const [closeIcon, setCloseIcon] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [submitBtn, setSubmitBtn] = useState({})
  const [modalShow, setModalShow] = useState(false);
  const [inputData, setInputData] = useState({
    companyname : '',
    title : '',
    name : '',
    email : '',
    contactno : '',
    about : '',
    location : '',
    image : '',
    logo : '',
    userid :''
})
  const [profileData, setProfileData] = useState({
    companyname : '',
    title : '',
    name : '',
    email : '',
    contactno : '',
    about : '',
    location : '',
    image : '',
    logo : '',
    userid : ''
});
const [sideBarAccess, setSideBarAccess] = useState({
  users: false
});
const [email, setEmail] = useState('')
const [isMLoading, setIsMLoading] = useState(false)
const [logo, setLogo] = useState('')
const [image, setImage] = useState('')
const [userid, setUserid] = useState(null)
const [name, setName] =useState('')
const closeModal =()=>{
  setModalShow(false)
  setFormStatus('')
}
const inputChangeData =(event)=> {
  const {name, value} = event.target;
  setInputData((valuePre)=>{
 return{
   ...valuePre,
   [name]:value
 }
})
}
  const sideCanvasActive= () =>{ 
    $(".expovent__sidebar").removeClass("collapsed");
    $(".expovent__sidebar").removeClass("open");
    $(".app__offcanvas-overlay").removeClass("overlay-open");
  }
  const onSubmit = (e) => {
    e.preventDefault()
    setIsMLoading(true)
    setSubmitBtn({
      padding: '1rem 0rem',
      display: 'block',
      color: 'red'
    })
    if(inputData && inputData.email){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValidEmail(emailRegex.test(inputData.email));
    }
    if(!inputData.name){
      setFormStatus("Name can not be blank.")
      setCloseIcon(true);
    }else if(!inputData.title){
      setFormStatus("Title can not be blank.")
      setCloseIcon(true);   
    }else{
      setIsMLoading(true)
      inputData.userid = profileData && profileData.userid ? profileData.userid : '';
      axios.post(`${process.env.API_BASE_URL}updateProfile.php`,inputData,{
        headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then(res => {
            const data = res.data;
            if(res &&  res.data && res.data.error && res.data.error.length > 0){
                setFormStatus(res.data.error);
                setCloseIcon(true);
                setIsMLoading(false)
            }else if(res &&  res.data && res.data.msg && res.data.msg.length > 0){
                    //Router.push('/thankyou')
                    setFormStatus("Update Successfully.");
                    localStorage.setItem('name', inputData.name);
                    localStorage.setItem('title', inputData.title);
                    localStorage.setItem('companyname', inputData.companyname);
                    localStorage.setItem('contactno', inputData.contactno);
                    localStorage.setItem('about', inputData.about);
                    localStorage.setItem('location', inputData.location);
                    setProfileData({
                      companyname : inputData.companyname,
                      title : inputData.title,
                      name : inputData.name,     
                      contactno : inputData.contactno ? inputData.contactno : '',
                      about : inputData.about ? inputData.about : '',
                      location : inputData.location ? inputData.location : '',
                      email : email ? email :'',
                      image : image ? image : '',
                      logo : logo?logo:'',
                      userid : userid ? userid : null
                  });

                    setCloseIcon(true);
                    setSubmitBtn({
                      padding: '1rem 0rem',
                      display: 'block',
                      color: '#46c737'
                    })
                    setIsMLoading(false)
                  }
            
  
      })
      .catch(err => {
        setIsMLoading(false)
       })
    }
    
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
      setName(name)
      setLogo(logo)
      setEmail(email)
      setImage(image)
      setUserid(userid)
      setProfileData({
         companyname : companyname ? companyname:'',
         title : title ? title :'',
         name : name ? name : '',
         email : email ? email :'',
         contactno : contactno ? contactno : '',
         about : about ? about : '',
         location : location ? location : '',
         image : image ? image : '',
         logo : logo ? logo :'',
         updatedBy : updatedBy ? updatedBy : '',
         userid : userid ? userid: null
     });
     setInputData({
      companyname : companyname ? companyname:'',
      title : title ? title :'',
      name : name ? name : '',
      email : email ? email :'',
      contactno : contactno ? contactno : '',
      about : about ? about : '',
      location : location ? location : '',
      image : image ? image : '',
      logo : logo ? logo :'',
      updatedBy : updatedBy ? updatedBy : '',
      userid : userid ? userid: null
  });
}
setLoading(false)

    }, []);
 return(
    <>
         <div className='page_-full-wrapper'>
           <Sidebaar />
            <div className="app__offcanvas-overlay" onClick={sideCanvasActive}>
            </div>
            <div className="page__body-wrapper">
              <Header/>
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
                                          <li className="active"><span>Profile</span></li>
                                      </ul>
                                      </nav>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                <div className='row'>
                  <div className='col-md-12'>
                    <div className='profile-area'>
                      <div className='body-card-wrapper'>
                        <div className='card-header-top'>
                          <div className='card-title-inner'>
                            <h1 style={{fontSize:'1.7rem'}}>Profile Information</h1>
                          </div>
                        </div>
                        <div className='profile-main-wrapper'>
                          <div className='row'>
                              <div className='col-md-12 '>
                                <div className='profile__left'>
                                  <div className='padding-left-inner'>
                                    <div className='profile-user'>
                                      <Link href='#'  onClick={() => setModalShow(true)}>
                                      <div className='profile-edit'>
                                          <FontAwesomeIcon icon={faPenToSquare} />
                                      </div>
                                      </Link>
                                    {  !isLoading &&                                   
                                      <ul>
                                          <li>
                                            <div className='profile-user-item'>
                                                <div className='profile-user-tiitle'>
                                                  <span>Name:</span>
                                                </div>
                                                <div className='profile-user-info'>
                                                  <span>{profileData.name}</span>
                                                </div>
                                            </div>
                                          </li>
                                          <li>
                                            <div className='profile-user-item'>
                                                <div className='profile-user-tiitle'>
                                                  <span>Email Address:</span>
                                                </div>
                                                <div className='profile-user-info'>
                                                  <span>{profileData.email}</span>
                                                </div>
                                            </div>
                                          </li>
                                          <li>
                                            <div className='profile-user-item'>
                                                <div className='profile-user-tiitle'>
                                                  <span>Phone Number:</span>
                                                </div>
                                                <div className='profile-user-info'>
                                                  <span>{profileData.contactno}</span>
                                                </div>
                                            </div>
                                          </li>
                                      </ul>
                                    }
                                    {isLoading && <Loader />}
                                    </div>
                                    </div>
                                </div>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         </div>
         <MyVerticallyCenteredModal
          show={modalShow}
          onHide={closeModal}
          inputData={inputData}
          isMLoading={isMLoading}
          inputChangeData={inputChangeData}
          onSubmit={onSubmit}
          msg={msg}
      />
    </>
 )


}
export default Profile
"use client"
import Sidebaar from '../../template/Sidebaar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { React,useState,useEffect  } from 'react';
import $ from "jquery";
import Header from '../../template/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import MsgModal from '../../template/MsgModal'
import Loader from '@/app/template/Loading';

const EditUser = ({params})=>{
    const [msg, setFormStatus] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [submitBtn, setSubmitBtn] = useState({})
    const [closeIcon, setCloseIcon] = useState(false)
    const [isValidEmail, setIsValidEmail] = useState(false)
    const [showManager, setShowManager] = useState(false)
    const [modalShow, setModalShow] = useState(false);
    const [msgType, setMsgType] = useState('')
    const [inputData, setInputData] = useState({
       name : '',
       email : '',
       updatedBy : '',
       userid :''
   });

    const inputChangeData =(event)=> {
       setModalShow(false)
       setMsgType('')
    const {name, value} = event.target;
    // if(name && name=="type" && value && value =="user"){
    //   setShowManager(true);
    // }else if(name && name=="type" && (!value || value !="user")){
    //   setShowManager(false);
    // }
    setInputData((valuePre)=>{
    return{
      ...valuePre,
      [name]:value
    }
  });
    }
 const sideCanvasActive= () =>{ 
     $(".expovent__sidebar").removeClass("collapsed");
     $(".expovent__sidebar").removeClass("open");
     $(".app__offcanvas-overlay").removeClass("overlay-open");
 }
 const onSubmit = (e) => {
    e.preventDefault()
 
    setModalShow(false)
    setMsgType('')
    setSubmitBtn({
      padding: '1rem 0rem',
      display: 'block',
      color: 'red'
    });
    if(inputData && inputData.email){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValidEmail(emailRegex.test(inputData.email));
      setModalShow(true)
      setMsgType('error')
    }
    if(!inputData.name){
       setModalShow(true)
       setMsgType('error')
      setFormStatus("Name can not be blank.")
      setCloseIcon(true);        
    }else if(!inputData.email){
      setFormStatus("Email can not be blank.")
      setCloseIcon(true);  
      setModalShow(true)
      setMsgType('error')
                             
    }else{
        setLoading(true);
      inputData.userid = params && params.user ? params.user : '';
      inputData.updatedBy = userid ? userid : null 
      axios.post(`${process.env.API_BASE_URL}updateUser.php`,inputData,{
        headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then(res => {
            const data = res.data;
            if(res &&  res.data && res.data.error && res.data.error.length > 0){
                setFormStatus(res.data.error);
                setCloseIcon(true);
                setModalShow(true)
                setMsgType('error')
            }else if(res &&  res.data && res.data.msg && res.data.msg.length > 0){
                    //Router.push('/thankyou')
                    setFormStatus(res.data.msg);
                    setMsgType('success')
                    setModalShow(true)
                    setCloseIcon(true);
                    setSubmitBtn({
                      padding: '1rem 0rem',
                      display: 'block',
                      color: '#46c737'
                    })
                   // router.push('/users')
                  }
                  setLoading(false);
  
      })
      .catch(err => {
       })
    }

  }
  const getUser = ()=>{
    console.log('params',params)
    if(params && params.user){
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${localStorage.tokenAuth ? localStorage.tokenAuth :''}`,
                },
              };
        setLoading(true);
       axios.get(`${process.env.API_BASE_URL}getuser.php?userid=${params.user}`,config)
       .then(res => {
       // setLearningData(data);
       setInputData({
         userid : params.user,
         name : res.data[0]['name'],
         email : res.data[0]['email'],
         status : res.data[0]['status']
       })
       setLoading(false);
    })
    .catch(err => {
    })
} catch (error) {
    // Handle errors here
    if(error && error.response.data && error.response.data.detail){
      setMsg(error.response.data.detail);
    }
    // console.error(error);
  }
    }
    
 }
 const [userid,setUserId] = useState(null)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        getUser()
       let updatedBy = localStorage.getItem('tokenAuth');
       let userid = localStorage.getItem('userid');
       setUserId(updatedBy)
    }
    setMsgType('')
    }, []);
    return(
        <>
            <div className='page_-full-wrapper'>
                <Sidebaar/>
                <div className="app__offcanvas-overlay" onClick={sideCanvasActive}></div>
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
                                                    <li className="active"><span>Edit User</span></li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                        <div className='col-md-12'>
                            <div className='add-more-form'>
                            {  !isLoading &&                  
                                <form onSubmit={onSubmit}>
                                    <div className='row'>
                                    <div className='col-md-6'>
                                        <div className='form-group'>
                                            <level>Name*</level>
                                            <input type='text' placeholder='Name*'  onChange={inputChangeData} name="name" value={inputData.name}/>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='form-group'>
                                            <level>Email*</level>
                                            <input type='text' placeholder='Email*'  onChange={inputChangeData} name="email" value={inputData.email} readOnly/>
                                        </div>
                                    </div>                                   
                                    {/* <div className='col-md-6'>
                                        <div className='form-group'>
                                            <level>Role*</level>
                                            <select onChange={inputChangeData} name="type">
                                            <option value={inputData.type}>{inputData.type ? inputData.type.toUpperCase() : ''}</option>
                                                <option value="">Select</option>
                                                <option value="User">User</option>
                                                <option value="Manager">Manager</option>
                                            </select>
                                            <input type='text' placeholder='Role*'/>
                                        </div>
                                    </div> */}
                                    <div className='col-md-6'>
                                        <div className='form-group'>
                                            <level>Status*</level>
                                            <select onChange={inputChangeData} name="status">
                                            <option value={inputData.status}>{inputData.status== 1 ? 'Active' : 'Inactive'}</option>
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
                                            </select>
                                            {/* <input type='text' placeholder='Role*'/> */}
                                        </div>
                                    </div>                                    
                                    <div className='col-md-6'>
                                        <div className='form-group'>
                                            <button>Update</button>
                                        </div>
                                    </div>
                                    </div>
                                </form>
                            }
                                {isLoading && <Loader />}
                            </div>
                        </div>
                        </div>
                        {modalShow && msgType &&
                            <MsgModal 
                            msgType={msgType}
                            msg={msg}
                            />
                        }
                </div>
                </div>
            </div>
        </>
    )
}
export default EditUser

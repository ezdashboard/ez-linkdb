"use client"
import Sidebaar from '../template/Sidebaar';
import 'bootstrap/dist/css/bootstrap.min.css';
import React,{useEffect, useState} from 'react'
import $ from "jquery";
import Header from '../template/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import Link from 'next/link';
import MsgModal from '../template/MsgModal';
import Loader from '../template/Loading';
import { useRouter } from 'next/navigation';


const Addmore=()=>{
   const [sideBarAccess, setSideBarAccess] = useState({
      users: false
   });

   const [currDate, setCurrDate] = useState('');
   const [isLoading, setLoading] = useState(true)
   const [userType, setUserType] = useState('')
   const [userid, setUserid] = useState(null)
   const [inputData, setInputData] = useState({
      activity:'',
      industry:'',
      country:'',
      url: '',
      da:'',
      spam_score:'',
      live_links:'',
      follow:'',
      status:'',
      indexing_status:''

   })
   const inputChangeData =(event)=> {
      setModalShow(false)
      setMsgType('')
      const {name, value} = event.target;
      if(name=='leadDate'){
         setCurrDate(value)
         setInputData((valuePre)=>{
            return{
              ...valuePre,
              [name]:value
            }
           })
      }else{
         setInputData((valuePre)=>{
            return{
              ...valuePre,
              [name]:value
            }
           })
      }

   }
   const [serviceStoreData, setServiceStoreData] = useState([]);
   const [countryList, setCountryList] = useState([]);
   const [activityList, setActivityList] = useState([]);

   const [msg, setFormStatus] = useState('')
   const [submitBtn, setSubmitBtn] = useState({})
   const [closeIcon, setCloseIcon] = useState(false)
   const [isValidEmail, setIsValidEmail] = useState(false)
   const [modalShow, setModalShow] = useState(false);
   const [msgType, setMsgType] = useState('')
   const router = useRouter()

   const submitCloseIcon = ()=>{
      setCloseIcon(false);
    }
   const sideCanvasActive= () =>{ 
         $(".expovent__sidebar").removeClass("collapsed");
         $(".expovent__sidebar").removeClass("open");
         $(".app__offcanvas-overlay").removeClass("overlay-open");
   }
   const getServiceData = async () => {
      axios.get(`${process.env.API_BASE_URL}services.php`)
         .then(res => {
            const data = res.data.serviceData.map((item) => {
               return {
                  id: item.id,
                  name: item.service_name,
                  status: item.status
               }
            }
         )
         setServiceStoreData(data);
      })
      .catch(err => {
         })
   }   
   const getCountryData = async () => {
      axios.get(`${process.env.API_BASE_URL}country.php`)
         .then(res => {
            const data = res.data.countryData.map((item) => {
               return {
                  id: item.id,
                  name: item.name,
                  status: item.status
               }
            }
         )
         setCountryList(data);
      })
      .catch(err => {
         })
   }
   const getActivityData = async () => {
      axios.get(`${process.env.API_BASE_URL}activity.php`)
         .then(res => {
            const data = res.data.activityData.map((item) => {
               return {
                  id: item.id,
                  title: item.title,
                  status: item.status
               }
            }
         )
         setActivityList(data);
      })
      .catch(err => {
         })
   }
   const onSubmit = (e) => {

      e.preventDefault()
      //setLoading(true);
      setSubmitBtn({
        padding: '1rem 0rem',
        display: 'block',
        color: 'red'
      });
      // if(inputData && inputData.primaryEmail){
      //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      //   setIsValidEmail(emailRegex.test(inputData.primaryEmail));

      // }
      if(!inputData.activity){
        setFormStatus("Please select Activities Type.")
        setModalShow(true)
        setMsgType('error')
      // }else if(!inputData.industry){
      //    setFormStatus("Please select Industry.")
      //    setModalShow(true)
      //    setMsgType('error')     
      // }else if(!inputData.country){
      //    setFormStatus("Please select country.")
      //    setModalShow(true)
      //    setMsgType('error')                 
      }else if(!inputData.url){
        setFormStatus("URLs can not be blank.")
        setModalShow(true)
        setMsgType('error')   
      // }else if(!inputData.da){
      //    setFormStatus("DA can not be blank.")
      //    setModalShow(true)
      //    setMsgType('error')  
      // }else if(!inputData.spam_score){
      //    setFormStatus("Spam Score can not be blank.")
      //    setModalShow(true)
      //    setMsgType('error')   

      // }else if(!inputData.live_links){
      //    setFormStatus("Live Links can not be blank.")
      //    setModalShow(true)
      //    setMsgType('error')   
      // }else if(!inputData.follow){
      //    setFormStatus("Please select follow.")
      //    setModalShow(true)
      //    setMsgType('error')
      // }else if(!inputData.status){
      //    setFormStatus("Please select status.")
      //    setModalShow(true)
      //    setMsgType('error')
      // }else if(!inputData.indexing_status){
      //    setFormStatus("Please select indexing status.")
      //    setModalShow(true)
      //    setMsgType('error')                                                                         
      }else{
        inputData.userid = userid ? userid : '';
        inputData.updatedBy =  userid ? userid : '' 
        axios.post(`${process.env.API_BASE_URL}addmore.php`,inputData,{
          headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
         .then(res => {
            const data = res.data;
            if(res &&  res.data && res.data.error && res.data.error.length > 0){
               setFormStatus(res.data.error);
               setModalShow(true)
               setMsgType('error') 
               setCloseIcon(true);
            }else if(res &&  res.data && res.data.msg && res.data.msg.length > 0){
                     //Router.push('/thankyou')
                     setFormStatus("Data added successfully.");
                     setModalShow(true)
                     setMsgType('success') 
                     alert("Data added successfully.");
                     //setTimeout(router.push('/dashboard'), 30000);
                     router.push('/dashboard')

                     //localStorage.clear();
                     setInputData({
                        activity:'',
                        industry:'',
                        country:'',
                        url: '',
                        da:'',
                        spam_score:'',
                        live_links:'',
                        follow:'',
                        status:'',
                        indexing_status:''
                  });
                     setCloseIcon(true);
                     setSubmitBtn({
                     padding: '1rem 0rem',
                     display: 'block',
                     color: '#46c737'
                     })
                  }
   
      })
        .catch(err => {
         })
      }
      setLoading(false)
    }                
   useEffect(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
         let localType = localStorage.getItem('type');
         let userid = localStorage.getItem('tokenAuth');

         if(localType){
          setUserType(localType)
         }
         var someDate = new Date();
         someDate.setDate(someDate.getDate());
         var date = someDate.toISOString().substr(0, 10);
         setCurrDate(date)
         setUserid(userid)
         getServiceData()
         getCountryData() 
         getActivityData()
         setLoading(false) 
      }
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
                                            <li><span><Link href="/dashboard">Home</Link></span></li>
                                            <li className="active"><span>Add New</span></li>
                                        </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                    {/* <div className="col-md-12">
                            {closeIcon  ?<span style={submitBtn}>{msg}  <span onClick={submitCloseIcon}><i className="fa fa-times" aria-hidden="true"></i></span></span>: ""}
                    </div> */}
                      <div className='col-md-12'>
                         <div className='add-more-form'>
{ !isLoading &&                           
                             <form onSubmit={onSubmit}>
                                <div className='row'>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Activities Type*</level>
                                         <select name="activity"  onChange={inputChangeData}>
                                                <option value="">Select</option>
                                          {activityList && activityList.length > 0 && activityList.map((actItem,c)=>{
                                             return(
                                                <option value={actItem.title} key={c}>{actItem.title}</option>
                                             )
                                          })}
                                         </select> 
                                      </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Industry</level>
                                         <select name="industry"  onChange={inputChangeData} >
                                         <option value="">Select</option>
                                          {serviceStoreData && serviceStoreData.length > 0 && serviceStoreData.map((serv,s)=>{
                                             return(
                                                <option value={serv.name} key={s}>{serv.name}</option>
                                             )
                                          })}
                                         </select>   
                                       </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Country</level>
                                         <select name="country"  onChange={inputChangeData}>
                                                <option value="">Select</option>
                                                <option value="All">All</option>
                                          {countryList && countryList.length > 0 && countryList.map((coun,c)=>{
                                             return(
                                                <option value={coun.name} key={c}>{coun.name}</option>
                                             )
                                          })}
                                         </select> 
                                      </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>URLs *</level>
                                         <input type='text' placeholder='URLs' onChange={inputChangeData} name="url" value={inputData.url}/>
                                      </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>DA</level>
                                         <input type='text' placeholder='DA' name="da" onChange={inputChangeData} value={inputData.da}/>
                                      </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Spam Score</level>
                                         <input type='text' placeholder='Spam Score*' name="spam_score" onChange={inputChangeData} value={inputData.spam_score}/>
                                      </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Live Links</level>
                                         <input type='text' placeholder='Live Links' name="live_links" onChange={inputChangeData} value={inputData.live_links}/>
                                      </div>
                                   </div>                                   
                                  
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Follow</level>
                                         <select name="follow"  onChange={inputChangeData} >
                                            <option value="">Select</option>
                                            <option value="Dofollow">Dofollow</option>
                                            <option value="Nofollow">Nofollow</option>
                                         </select>
                                      </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Status</level>
                                         <select name="status"  onChange={inputChangeData} >
                                            <option value="">Select</option>
                                            <option value="Active">Active</option>
                                            <option value="Not Working">Not Working</option>
                                            <option value="Re Confirm">Re Confirm</option>

                                         </select>
                                      </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Indexing Status</level>
                                         <select name="indexing_status"  onChange={inputChangeData} >
                                            <option value="">Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                         </select>
                                      </div>
                                   </div>                                   
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <button type="submit">Save</button>
                                      </div>
                                   </div>
                                </div>
                             </form>
                             }
                             {isLoading && <Loader />}
                         </div>
                      </div>
                    </div>
                </div>
              </div>
               {modalShow &&
              <MsgModal 
              msgType={msgType}
              msg={msg}
              />}
      </div>
    </>
 )


}
export default Addmore

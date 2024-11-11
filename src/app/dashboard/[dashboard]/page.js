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
    const [serviceStoreData, setServiceStoreData] = useState([]);
    const [countryList, setCountryList] = useState([]);

    const [isLoading, setLoading] = useState(false)
    const [submitBtn, setSubmitBtn] = useState({})
    const [closeIcon, setCloseIcon] = useState(false)
    const [isValidEmail, setIsValidEmail] = useState(false)
    const [showManager, setShowManager] = useState(false)
    const [modalShow, setModalShow] = useState(false);
    const [msgType, setMsgType] = useState('')
    const [activityList, setActivityList] = useState([]);
    const [inputData, setInputData] = useState({
      id: '',
      activity: '',
      create_at: '',
      da:  '',
      follow: '',
      indexing_status: '',
      industry:'',
      live_links:'',
      spam_score: '',
      status:'',
      industry:'',
      url:''
   });
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
     axios.post(`${process.env.API_BASE_URL}updateData.php`,inputData,{
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
                  setFormStatus("Data updated successfully.");
                  setModalShow(true)
                  setMsgType('success') 
                 // alert("Data updated successfully.");
                  //setTimeout(router.push('/dashboard'), 30000);
                  
                  //localStorage.clear();
               //    setInputData({
               //       activity:'',
               //       industry:'',
               //       country:'',
               //       url: '',
               //       da:'',
               //       spam_score:'',
               //       live_links:'',
               //       follow:'',
               //       status:'',
               //       indexing_status:''
               // });
                  setCloseIcon(true);
                  setSubmitBtn({
                  padding: '1rem 0rem',
                  display: 'block',
                  color: '#46c737'
                  })
               //   Router.push('/dashboard')

               }

   })
     .catch(err => {
      })
   }
   setLoading(false)
 } 
  const getData = ()=>{
    console.log('params',params)
    if(params && params.dashboard){
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${localStorage.tokenAuth ? localStorage.tokenAuth :''}`,
                },
              };
        setLoading(true);
       axios.get(`${process.env.API_BASE_URL}getdata.php?id=${params.dashboard}`,config)
       .then(res => {
       // setLearningData(data);
       setInputData({

         id: res.data[0].id,
         activity: res.data[0].activity,
         create_at: res.data[0].create_at,
         da:  res.data[0].da,
         follow: res.data[0].follow,
         indexing_status: res.data[0].indexing_status,
         country:res.data[0].country,
         industry:res.data[0].industry,
         live_links:res.data[0].live_links,
         spam_score: res.data[0].spam_score,
         status:res.data[0].status,
         industry:res.data[0].industry,
         url:res.data[0].url
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
 const [userid,setUserId] = useState(null)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        getData()
       let updatedBy = localStorage.getItem('tokenAuth');
       let userid = localStorage.getItem('userid');
       setUserId(updatedBy)
    }
    setMsgType('')
    getServiceData()
    getCountryData() 
    getActivityData()
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
                                                    <li><span><a href="/dasboard">Home</a></span></li>
                                                    <li className="active"><span>Edit Dashboard</span></li>
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
                        { !isLoading &&                           
                           <form onSubmit={onSubmit}>
                              <div className='row'>
                                 <div className='col-md-6'>
                                    <div className='form-group'>
                                       <level>Activities Type*</level>
                                       <select name="activity"  onChange={inputChangeData} value={inputData.activity}  >
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
                                       <select name="industry"  onChange={inputChangeData} value={inputData.industry}>
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
                                       <select name="country"  onChange={inputChangeData} value={inputData.country}>
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
                                       <select name="follow"  onChange={inputChangeData} value={inputData.follow}>
                                          <option value="">Select</option>
                                          <option value="Dofollow">Dofollow</option>
                                          <option value="Nofollow">Nofollow</option>
                                       </select>
                                    </div>
                                 </div>
                                 <div className='col-md-6'>
                                    <div className='form-group'>
                                       <level>Status</level>
                                       <select name="status"  onChange={inputChangeData} value={inputData.status}>
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
                                       <select name="indexing_status"  onChange={inputChangeData} value={inputData.indexing_status}>
                                          <option value="">Select</option>
                                          <option value="Yes">Yes</option>
                                          <option value="No">No</option>
                                       </select>
                                    </div>
                                 </div>                                   
                                 <div className='col-md-6'>
                                    <div className='form-group'>
                                       <button type="submit">Update</button>
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

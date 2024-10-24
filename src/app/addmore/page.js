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
      leadGenBy: null,
      leadGenFor:'',
      leadDate:'',
      clientName:'',
      primaryEmail:'',
      secondaryEmail:'',
      websiteUrl:'',
      contactNumber:'',
      services:'',
      industry:'',
      country:'',
      genratedFrom:''
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
   const onSubmit = (e) => {

      e.preventDefault()
      //setLoading(true);
      setSubmitBtn({
        padding: '1rem 0rem',
        display: 'block',
        color: 'red'
      });
      if(inputData && inputData.primaryEmail){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValidEmail(emailRegex.test(inputData.primaryEmail));

      }
      if(!inputData.leadGenFor){
        setFormStatus("Please select Lead genrate for.")
        setModalShow(true)
        setMsgType('error')
      }else if(!currDate){
         setFormStatus("Lead date can not be blank.")
         setModalShow(true)
         setMsgType('error')          
      }else if(!inputData.primaryEmail){
        setFormStatus("Primary Email can not be blank.")
        setModalShow(true)
        setMsgType('error')   
      }else if(!inputData.services){
         setFormStatus("Please select services.")
         setModalShow(true)
         setMsgType('error')  
 
      }else if(!inputData.country){
         setFormStatus("Please select country.")
         setModalShow(true)
         setMsgType('error')   
      // }else if(!inputData.genratedFrom){
      //    setFormStatus("Please select generated from.")
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
                     setFormStatus("User added successfully.");
                     setModalShow(true)
                     setMsgType('success') 
                     alert("User added successfully.");
                     //setTimeout(router.push('/dashboard'), 30000);
                     
                     //localStorage.clear();
                     setInputData({
                     companyname : '',
                     name : '',
                     email : '',
                     mangerId:'',
                     contactno : '',
                     type:'',
                     password : ''
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
         setInputData({
            leadGenBy: null,
            leadGenFor:'',
            leadDate:date,
            clientName:'',
            primaryEmail:'',
            secondaryEmail:'',
            websiteUrl:'',
            contactNumber:'',
            services:'',
            industry:'',
            country:'',
            genratedFrom:''
         })
         setUserid(userid)
         getServiceData()
         getCountryData() 
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
                                   {/* <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Lead Generated by</level>
                                         <input type='text' placeholder='Lead Generated by'/>
                                      </div>
                                   </div> */}
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Lead Generated For*</level>
                                         <select name="leadGenFor"  onChange={inputChangeData} >
                                            <option value="">Select</option>
                                            <option value="EZ">EZ</option>
                                            <option value="SIO">SIO</option>
                                            <option value="DAR">DAR</option>
                                            <option value="SMCA">SMCA</option>
                                            <option value="IPR">IPR</option>
                                         </select>
                                      </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Lead Date*</level>
                                         <input type='date' placeholder='Lead Date' onChange={inputChangeData} name="leadDate" value={currDate}/>
                                      </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Client Name</level>
                                         <input type='text' placeholder='Client Name' name="clientName" onChange={inputChangeData} value={inputData.clientName}/>
                                      </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Email ID*(Primary)</level>
                                         <input type='text' placeholder='Primary Email ID*' name="primaryEmail" onChange={inputChangeData} value={inputData.primaryEmail}/>
                                      </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Email ID(Secondary)</level>
                                         <input type='text' placeholder='Secondary Email ID' name="secondaryEmail" onChange={inputChangeData} value={inputData.secondaryEmail}/>
                                      </div>
                                   </div>                                   
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Website URL</level>
                                         <input type='text' placeholder='Website URL' name="websiteUrl" onChange={inputChangeData} value={inputData.websiteUrl}/>
                                      </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Contact Number</level>
                                         <input type='text' placeholder='Contact Number' name="contactNumber" onChange={inputChangeData} value={inputData.contactNumber}/>
                                      </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Services*</level>
                                         <select name="services"  onChange={inputChangeData} >
                                         <option value="">Select</option>
                                          {serviceStoreData && serviceStoreData.length > 0 && serviceStoreData.map((serv,s)=>{
                                             return(
                                                <option value={serv.id} key={s}>{serv.name}</option>
                                             )
                                          })}
                                         </select>   
                                       </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Industry</level>
                                         <input type='text' placeholder='Industry' name="industry" onChange={inputChangeData} value={inputData.industry}/>
                                      </div>
                                   </div>
                                   <div className='col-md-6'>
                                      <div className='form-group'>
                                         <level>Country*</level>
                                         <select name="country"  onChange={inputChangeData}>
                                                <option value="">Select</option>
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
                                         <level>Generated from Domain/General Ids</level>
                                         <select name="genratedFrom"  onChange={inputChangeData} >
                                            <option value="">Select</option>
                                            <option value="Domain">Domain</option>
                                            <option value="General Ids">General Ids</option>
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
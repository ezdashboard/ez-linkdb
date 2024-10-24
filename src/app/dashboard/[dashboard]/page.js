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
    const [inputData, setInputData] = useState({
       type : '',
       name : '',
       email : '',
       type : '',
       updatedBy : '',
       userid :''
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
    if(inputData && inputData.primaryEmail){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValidEmail(emailRegex.test(inputData.primaryEmail));

    }
    if(!inputData.leadGenFor){
      setFormStatus("Please select Lead genrate for.")
      setModalShow(true)
      setMsgType('error')
    }else if(!inputData.leadDate){
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
    }else if(!inputData.genratedFrom){
       setFormStatus("Please select generated from.")
       setModalShow(true)
       setMsgType('error')                                                                   
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
                   setFormStatus("Updated successfully.");
                   setModalShow(true)
                   setMsgType('success') 
                   //localStorage.clear();
               //     setInputData({
               //     companyname : '',
               //     name : '',
               //     email : '',
               //     mangerId:'',
               //     contactno : '',
               //     type:'',
               //     password : ''
               //  });
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
       axios.get(`${process.env.API_BASE_URL}getdata.php?userid=${params.dashboard}`,config)
       .then(res => {
       // setLearningData(data);
       setInputData({
        clientName : res.data[0].clientName,
        contactNumber : res.data[0].contactNumber,
        country : res.data[0].country,
        genratedFrom : res.data[0].genratedFrom,
        id : res.data[0].id,
        industry : res.data[0].industry,
        leadDate : res.data[0].leadDate,
        leadGenFor : res.data[0].leadGenFor,
        primaryEmail : res.data[0].primaryEmail,
        secondaryEmail : res.data[0].secondaryEmail,
        services : res.data[0].services,
        status : res.data[0].status,
        service_name: res.data[0].service_name,
        // userid : res.data[0].clientName,
        websiteUrl :res.data[0].websiteUrl,
        userid : params.dashboard
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
        getData()
       let updatedBy = localStorage.getItem('tokenAuth');
       let userid = localStorage.getItem('userid');
       setUserId(updatedBy)
    }
    setMsgType('')
    getServiceData()
    getCountryData() 
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
                                            <option value={inputData.leadGenFor}>{inputData.leadGenFor}</option>
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
                                         <input type='date' placeholder='Lead Date' onChange={inputChangeData} name="leadDate" value={inputData.leadDate}/>
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
                                         
                                         <option value={inputData.services}>{inputData.service_name}</option>
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
                                                <option value={inputData.country}>{inputData.country}</option>
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
                                            <option value={inputData.genratedFrom}>{inputData.genratedFrom}</option>
                                            <option value="Domain">Domain</option>
                                            <option value="General Ids">General Ids</option>
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
"use client"

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import $ from "jquery";
import { React,useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Sidebaar from '../template/Sidebaar';
import Header from '../template/Header';
import Link from "next/link"
import axios from 'axios';
import Loader from '../template/Loading'
import { useRouter } from 'next/navigation';
import { faPenToSquare,faTrashCan } from '@fortawesome/free-solid-svg-icons'
import MsgModal from '../template/MsgModal'
import ConfirmationModal from '../template/ConfirmationModal';
import ExcelDownloadButton from '../template/ExcelDownloadButton';
import * as XLSX from 'xlsx';

const Dashboard=()=>{

    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userType, setUserType] = useState('')
    const [totPage, setTotPage] = useState(0);
    const [isLoading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1);
    const [limitp, setlimitp] =useState(50);
    const [userinfo, setUserInfo] = useState({
        languages: [],
        response: [],
      });
    const sideCanvasActive= () =>{ 
        $(".expovent__sidebar").removeClass("collapsed");
        $(".expovent__sidebar").removeClass("open");
        $(".app__offcanvas-overlay").removeClass("overlay-open");
    
    }
    const [deId, setDelt] = useState('')
    const openModal = (id) => {
      setDelt(id)
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setDelt()
      setIsModalOpen(false);
    };
  
    const handleConfirm = () => {
      setLoading(true)

      // Implement your logic to handle confirmation
      if(deId){
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${localStorage.tokenAuth ? localStorage.tokenAuth :''}`,
                },
              };
              setLoading(true)
        
        // axios.get(`${process.env.API_BASE_URL}leadDelete.php?&id=${deId}`, config)
        let temData ={
          updatedBy : userId ? userId: null,
          id:deId?deId:null
        }

        axios.post(`${process.env.API_BASE_URL}leadDelete.php`,temData,{
          headers: {
            Authorization: `Bearer ${localStorage.tokenAuth ? localStorage.tokenAuth :''}`,
            'Content-Type': 'multipart/form-data'
          }
      })
        .then(res => {
            if(res && res.data && res.data.status){
              let idn = 0;
              // setDelt()
              alert(res.data.msg);
              getLeadsData('normal')
              // setMsg(res.data.msg);
              // setMsgType('success')
              // setModalShow(true)

        }
        setLoading(false)
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
      console.log('Confirmed');
      //alert(id)
      closeModal();
    };
    const [imgArry, setImgAry] = useState([]);

    const handleChange = (e) => {
        // Destructuring
        setModalShow(false)
        setMsgType('')
        const { value, checked } = e.target;
        const { languages } = userinfo;
        console.log(`${value} is ${checked}`);
         
        if (checked) {
          setUserInfo({
            languages: [...languages, value],
            response: [...languages, value],
          });
          let newArry = leadStoreData.filter(item => item.id == parseInt(value));

          setImgAry(imgArry => [newArry[0], ...imgArry]);
        }
      
        else {
          setUserInfo({
            languages: languages.filter((e) => e !== value),
            response: languages.filter((e) => e !== value),
          });
          let newArry = imgArry.filter(item => item.id != parseInt(value));
          setImgAry(newArry);
        }
        console.log('IANSNN', imgArry)
      }; 


    const [leadStoreData, setLeadStoreData] = useState([]);
    const [serviceStoreData, setServiceStoreData] = useState([]);

    const [inputData, setInputData] =useState({
        search:''
    })
    const [searData, setSearData] =useState({
      activity:'',
      industry:'',
      follow:'',
      country:'',
      sorting:''
    })
    const [countryList, setCountryList] = useState([]);
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
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('')
    const [modalShow, setModalShow] = useState(false);
    const openExternalLink = (url) => {
      
     let  tempUrl = url;
     if(tempUrl.substr(0, 4) != 'http'){
      tempUrl = 'http://'+tempUrl;
     }

      window.open(tempUrl, "_blank");
    };
    const inputChangeData =(event)=> {
      setModalShow(false)
    const {name, value} = event.target;
        setInputData((valuePre)=>{
            return{
            ...valuePre,
            [name]:value
            }
        })
    }
    const getPage = (url)=>{
        setLoading(true)
        if(url){
        router.push(url)
        //setLoading(false)
        }else{
        setLoading(false)
        }
       
     } 
     const inputSearchData =(event)=> {
     // setModalShow(false)
    const {name, value} = event.target;
        setSearData((valuePre)=>{
            return{
            ...valuePre,
            [name]:value
            }
        })
    }
    const [sData, setSeData] = useState([])

    const getSearchData=()=>{
      var userid = 1;
      // alert(searData.startDate);
      // alert(searData.endDate);
      // alert()
      setModalShow(false)
      //setMsg("");
      if(userid){
          try {
              const config = {
                  headers: {
                    Authorization: `Bearer ${localStorage.tokenAuth ? localStorage.tokenAuth :''}`,
                  },
                };
                setLoading(true)

          axios.get(`${process.env.API_BASE_URL}dwlLeads.php?&stD=${searData.startDate}&enD=${searData.endDate}`, config)
          .then(res => {
              if(res && res.data && res.data.leadRecordsData && res.data.leadRecordsData.length > 0){
                let idn = 0;
                const data = res.data.leadRecordsData.map((item) => {
                 idn = idn+1;
                return {
                  id: item.id,
                  activity: item.activity,
                  create_at: item.create_at,
                  da:  item.da,
                  follow: item.follow,
                  indexing_status: item.indexing_status,
                  industry:item.industry,
                  live_links:item.live_links,
                  spam_score: item.spam_score,
                  status:item.status,
                  industry:item.industry,
                  url:item.url
                }
            }
          )

          // if(res.data.total && res.data.total > 0){
          //     setTotPage(res.data.total)
          // }
          setSeData(data);
          //setMsg('')
          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
      
          // Save the Excel file
          XLSX.writeFile(wb, `${'records'}.xlsx`);

          }else if(res.data.msg && res.data.leadRecordsData.length==0){
            setSeData([]);
              //setTotPage(0)
              setMsg(res.data.msg)
          }
          setLoading(false)
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
    }
    const getLeadsData = async (type) => {
      setModalShow(false)
        //setMsg("");
       
            try {
              let apiDash = '';
              if(type && type=='search' ){
                apiDash = `${process.env.API_BASE_URL}leads.php?limit=${limitp}&activity=${searData.activity}&industry=${searData.industry}&follow=${searData.follow}&sort=${searData.sorting}&country=${searData.country}`;
              }else{
                apiDash = `${process.env.API_BASE_URL}leads.php?page=${currentPage}&limit=${limitp}`;
              }
                const config = {
                    headers: {
                      Authorization: `Bearer ${localStorage.tokenAuth ? localStorage.tokenAuth :''}`,
                    },
                  };
                  setLoading(true)

            axios.get(apiDash, config)
            .then(res => {
                if(res && res.data && res.data.leadRecordsData && res.data.leadRecordsData.length > 0){
                const data = res.data.leadRecordsData.map((item) => {
                  return {
                    id: item.id,
                    activity: item.activity,
                    create_at: item.create_at,
                    da:  item.da,
                    follow: item.follow,
                    indexing_status: item.indexing_status,
                    industry:item.industry,
                    live_links:item.live_links,
                    spam_score: item.spam_score,
                    status:item.status,
                    country:item.country,
                    industry:item.industry,
                    url:item.url
                    
                  }
              }
            )

            if(res.data.total && res.data.total > 0){
                setTotPage(res.data.total)
            }
            setLeadStoreData(data);
            setMsg('')
            }else if(res.data.msg && res.data.leadRecordsData.length==0){
                setLeadStoreData([]);
                setTotPage(0)
                setMsg(res.data.msg)
            }else if(res.data.msg && res.data.msg=='No Data Found'){
                setLeadStoreData([]);
                setTotPage(0)
                setMsg(res.data.msg)
            }
            setLoading(false)
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
     const [activityList, setActivityList] = useState([]);

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
     const statusUpdate = (status)=>{
        let data = {
            status: status,
            users: imgArry,
            updatedBy: userId
        } 
          if(!status){
            setMsg("Invalid request.")
            setModalShow(true)
            setMsgType('error')  
        //   }else if(!inputData.genratedFrom){
        //     setMsg("Please select generated from.")
        //      setModalShow(true)
        //      setMsgType('error')                                                                   
          }else{
            inputData.userid = userId ? userId : '';
            inputData.updatedBy =  userId ? userId : '' 
            axios.post(`${process.env.API_BASE_URL}updateccData.php`,data,{
              headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
             .then(res => {
                const data = res.data;
                if(res &&  res.data && res.data.error && res.data.error.length > 0){
                    setMsg(res.data.error);
                   setModalShow(true)
                   setMsgType('error') 
                   setCloseIcon(true);
                   setImgAry([])
                   
                }else if(res &&  res.data && res.data.msg && res.data.msg.length > 0){
                         //Router.push('/thankyou')
                         setImgAry([])
                         setMsg("Updated successfully.");
                         setModalShow(true)
                         setMsgType('success') 
                         //let storrLead1 = leadStoreData.filter(item => item.id == parseInt(value));
                         getLeadsData('normal')
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
        const [userId, seTuserId] = useState(null)
        useEffect(() => {
            setMsg("");
            if (typeof window !== 'undefined' && window.localStorage) {
               let localType = localStorage.getItem('type');
               let userid = localStorage.getItem('tokenAuth');
               if(userid){
                seTuserId(userid);
                // setTimeout(function() {
                    
                // }, 10000);
                getLeadsData('normal')
                getActivityData()
                getServiceData()
                getCountryData() 
               }
               if(localType){
                setUserType(localType)
               }  
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
                                        
                                            <li><span><Link href="#">Home</Link></span></li>
                                            <li className="active"><span>Dashboard</span></li>
                                        </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-xl-12 col-md-12'>
                        {modalShow && msgType &&
                            <MsgModal 
                            msgType={msgType}
                            msg={msg}
                            />
                        }
                            <div className='email-serach-box'>
                              
                                { userType && userType=='admin' &&  
                                <div className='add-more'>
                                 <a href='#' onClick={()=>{
                                    getPage('/addmore')
                                }}>Add New</a>
                                
                              </div>}
                              </div>
                              { 
                            <div className='col-md-12'>
                              <div className="">
                              <div className=''>
                                
                                
                                <div className='row'>
                                <strong>Search:</strong>
                                   <div className='col-md-3'>
                                      <div className='form-group'>
                                        <level>Activities Type</level>
                                        <select name="activity"  onChange={inputSearchData} className='form-control'>
                                            <option value="">Select</option>
                                              {activityList && activityList.length > 0 && activityList.map((actItem,c)=>{
                                                return(
                                                    <option value={actItem.title} key={c}>{actItem.title}</option>
                                                )
                                              })}
                                        </select>
                                      </div>
                                    </div>
                                    <div className='col-md-2'>
                                      <div className='form-group'>
                                         <level>Industry</level>
                                         <select name="industry"  onChange={inputSearchData} className='form-control'>
                                          <option value="">Select</option>
                                            {serviceStoreData && serviceStoreData.length > 0 && serviceStoreData.map((serv,s)=>{
                                              return(
                                                  <option value={serv.name} key={s}>{serv.name}</option>
                                              )
                                            })}
                                         </select>   
                                      </div>
                                    </div>
                                    <div className='col-md-2'>
                                      <div className='form-group'>
                                         <level>Country</level>
                                         <select name="country"  onChange={inputSearchData} className='form-control'>
                                          <option value="">Select</option>
                                          <option value={'Global'}>{'Global'}</option>

                                            {countryList && countryList.length > 0 && countryList.map((coun,s)=>{
                                              return(
                                                  <option value={coun.name} key={s}>{coun.name}</option>
                                              )
                                            })}
                                         </select>   
                                      </div>
                                    </div>
                                   <div className='col-md-2'>
                                      <div className='form-group'>
                                         <level>Follow</level>
                                         <select name="follow"  onChange={inputSearchData} className='form-control'>
                                            <option value="">Select</option>
                                            <option value="Dofollow">Dofollow</option>
                                            <option value="Nofollow">Nofollow</option>
                                         </select>
                                      </div>
                                   </div>
                                  
                                   <div className='col-md-3'>
                                      <div className='form-group two-btn' style={{marginTop:'20px'}}>
                                         <button type="button" onClick={()=>getLeadsData('search')} className='btn btn-primary'>Search</button>
                                      </div>
                                   </div>
                                </div>
                              {(searData.activity || searData.follow || searData.industry) && 
                                <div className='row'>
                                  <div className='col-md-9'>
                                        <div className='form-group'>
                                          <strong>Sorting:</strong>
                                          <select name="sorting"  onChange={inputSearchData} className='form-control'>
                                              <option value="">Select</option>
                                              <option value="1">Industry By Asc</option>
                                              <option value="2">Industry By Desc</option>
                                              <option value="3">DA By Asc</option>
                                              <option value="4">DA By Desc</option>
                                              <option value="5">Scam Score By Asc</option>
                                              <option value="6">Scam Score By Desc</option>
                                              <option value="7">Follow By Asc</option>
                                              <option value="8">Follow By Desc</option>
                                          </select>
                                        </div>
                                  </div>
                                  <div className='col-md-3'>
                                    <div className='form-group two-btn' style={{marginTop:'20px'}}>
                                        <button type="button" onClick={()=>getLeadsData('search')} className='btn btn-primary'>Sorting</button>
                                    </div>
                                  </div>
                                </div>
                                }
                               
                                
                              </div>
                                        
                            </div>
                            </div>}
                              <div className='lms-table-wrap-2'>
                               <Table striped bordered hover >
                                <thead>
                                    <tr>
                                    {/* { userType && userType=='admin' && 
                                     <th></th>} */}
                                     <th width="5%">S.No.</th>
                                    <th width="10%">Activities</th>
                                    <th width="10%">Industry</th>
                                    <th width="10%">Country</th>
                                    <th width="15%">URLs</th>
                                    <th width="5%">DA</th>
                                    <th width="5%">Spam Score</th>
                                    <th width="20%">Live Links</th>
                                    <th width="10%">Follow</th>
                                   
                                    {   userType && userType=='admin' &&
                                     <>
                                     <th width="10%">Status</th>
                                     <th width="10%">Action</th>
                                   </> 
                                    }
                                    </tr>
                                </thead>

                                { !isLoading &&
                                    <tbody>
                                    {leadStoreData && leadStoreData.length > 0 && leadStoreData.map((lead, l)=>{
                                        return(
                                            <tr key={l} className={lead.emailStatus == 2 ? 'table-danger':'table-light'}>
                                          {/* { userType && userType=='admin' &&
                                            <td><input type="checkbox" onChange={handleChange} value={lead.id}/></td>
                                          } */}
                                          <td>{lead.id}</td>
                                            <td>{lead.activity}</td>
                                            <td>{lead.industry}</td>
                                            <td>{lead.country}</td>
                                            <td><a href={'#'} onClick={()=>{openExternalLink(lead.url)}}>{lead.url}</a></td>
                                            <td>{lead.da}</td>
                                            <td>{lead.spam_score}</td>
                                            <td onClick={()=>{openExternalLink(lead.live_links)}}><a href={'#'}>{lead.live_links}</a></td>
                                            <td>{lead.follow}</td>
                                            
                                            
                                         { userType && userType=='admin' &&
                                         <>
                                          <td>{lead.status}</td>
                                            <td><a href={'#'} style={{color:'black',padding: '5px'}} onClick={()=>{
                                    getPage('/dashboard/'+lead.id)
                                }}><FontAwesomeIcon icon={faPenToSquare} /></a>

                              <a href={'#'} style={{color:'black'}} onClick={()=>{
                                openModal(lead.id)
                            }}><FontAwesomeIcon icon={faTrashCan} /></a></td>
                                         </>
                                           }                                   
                                        </tr>
                                        )
                                    })}
                                
                                    </tbody>
                                }
                                </Table>
                                {   isLoading &&                          
                                    <Loader />
                                } 
                                {msg && <p className='nofound'>{msg}</p>}
                              </div>
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
                            <ConfirmationModal
                              isOpen={isModalOpen}
                              onCancel={closeModal}
                              onConfirm={handleConfirm}
                            />
                        </div>
                    </div>
                </div>
            </div>
         </div>
        </>
    )
}
export default Dashboard


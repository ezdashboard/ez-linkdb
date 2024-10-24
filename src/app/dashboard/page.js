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
              // getLeadsData(userid,'normal')
              // setDelt()
              alert(res.data.msg);
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
    
    const [inputData, setInputData] =useState({
        search:''
    })
    const [searData, setSearData] =useState({
      startDate:'',
      endDate:'',
    })
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('')
    const [modalShow, setModalShow] = useState(false);

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
                  id: idn,
                  clientName: item.clientName,
                  create_at: item.create_at,
                  leadDate:  item.leadDate,
                  leadGenFor: item.leadGenFor,
                  primaryEmail: item.primaryEmail,
                  secondaryEmail:item.secondaryEmail,
                  websiteUrl:item.websiteUrl,
                  emailStatus: item.emailStatus,
                  contactNumber:item.contactNumber,
                  industry:item.industry,
                  country:item.country,
                  genratedFrom:item.genratedFrom,
                  leadGenBy: item.leadGenBy,
                  serviceName: item.serviceName
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
    const getLeadsData = async (userid, type) => {
      setModalShow(false)
        //setMsg("");
        if(userid){
            try {
              let apiDash = '';
              if(type && type=='search' && inputData.search){
                apiDash = `${process.env.API_BASE_URL}leads.php?limit=${limitp}&ser=${inputData.search}`;
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
                    clientName: item.clientName,
                    create_at: item.create_at,
                    leadDate:  item.leadDate,
                    leadGenFor: item.leadGenFor,
                    primaryEmail: item.primaryEmail,
                    secondaryEmail:item.secondaryEmail,
                    websiteUrl:item.websiteUrl,
                    emailStatus: item.emailStatus,
                    contactNumber:item.contactNumber,
                    industry:item.industry,
                    country:item.country,
                    genratedFrom:item.genratedFrom,
                    leadGenBy: item.leadGenBy,
                    serviceName: item.serviceName
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
                         getLeadsData(userId,'normal')
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
                getLeadsData(userid,'normal')
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
                              <form  className="serach">
                               
                                <input type="text" placeholder="Email"  onChange={inputChangeData} name="search" value={inputData.search}/>
                                <button type="button" onClick={()=>{
                                    getLeadsData(userId,'search')
                                }}>Search</button>
                                </form>
                                { userType &&   
                                <div className='add-more'>
                                 <a href='#' onClick={()=>{
                                    getPage('/addmore')
                                }}>Add New</a>
                                
                              </div>}
                              </div>
                              { userType && userType=='admin' &&
                            <div className='col-md-12'>
                              <div className="ser">
                              <div className='ser-wrap'>
                                <form>
                                <strong>Search:</strong><input type='date' name="startDate" onChange={inputSearchData} value={searData.startDate}/>
                                  <input type='date' name="endDate" onChange={inputSearchData} value={searData.endDate}/>
                                  {/* <div onClick={getSearchData}/>Search<div/> */}
                                  {/* <button type='button' onClick={()=>{
                                                                getSearchData()
                                                            }}>Search</button> */}
                                </form>
                                <button onClick={getSearchData}> Download Excel</button>
                                {/* {sData && sData.length > 0 &&
                                  <ExcelDownloadButton data={sData} fileName="records"/>} */}
                              </div>
                              <div className='two-btn'>
                                <button type='button'  className = "btn btn-primary" onClick={()=>{
                                                                statusUpdate('2')
                                                            }}>Disable</button>
                                                        
                                 <button type='button' className = "btn btn-primary" onClick={()=>{
                                                                statusUpdate('1')
                                                            }}>Enable</button>

                              
                                  </div>           
                            </div>
                            </div>}
                              <div className='lms-table-wrap'>
                               <Table striped bordered hover >
                                <thead>
                                    <tr>
                                    { userType && userType=='admin' &&  <th>
                                    </th>}
                                    <th>Generated By</th>
                                    <th>Generated For</th>
                                    <th>Date</th>
                                    <th>Client Name</th>
                                    <th>Email ID(Primary)</th>
                                    <th>Email ID(Secondary)</th>
                                    <th>Website URL</th>
                                    <th>Contact Number</th>
                                    <th>Service</th>
                                    <th>Industry</th>
                                    <th>Country</th>
                                    <th>Generated From</th>
                                    {    userType && userType=='admin' &&
                                      <th>Action</th>
                                    }
                                    </tr>
                                </thead>

                                { !isLoading &&
                                    <tbody>
                                    {leadStoreData && leadStoreData.length > 0 && leadStoreData.map((lead, l)=>{
                                        return(
                                            <tr key={l} className={lead.emailStatus == 2 ? 'table-danger':'table-light'}>
                                          { userType && userType=='admin' &&
                                            <td><input type="checkbox" onChange={handleChange} value={lead.id}/></td>
                                          }
                                            <td>{lead.leadGenBy}</td>
                                            <td>{lead.leadGenFor}</td>
                                            <td>{lead.leadDate}</td>
                                            <td>{lead.clientName}</td>
                                            <td>{lead.primaryEmail}</td>
                                            <td>{lead.secondaryEmail}</td>
                                            <td>{lead.websiteUrl}</td>
                                            <td>{lead.contactNumber}</td>
                                            <td>{lead.serviceName}</td>
                                            <td>{lead.industry}</td>
                                            <td>{lead.country}</td>
                                            <td>{lead.genratedFrom}</td>
                                         { userType && userType=='admin' &&
                                            <td><a href={'#'} onClick={()=>{
                                    getPage('/dashboard/'+lead.id)
                                }}><FontAwesomeIcon icon={faPenToSquare} /></a> 
                              <a href={'#'} onClick={()=>{
                                openModal(lead.id)
                            }}><FontAwesomeIcon icon={faTrashCan} /></a></td> }                                   
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


"use client"
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Roboto } from 'next/font/google';
import { React,useState,useEffect  } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Spinner from 'react-bootstrap/Spinner';
import MsgModal from './template/MsgModal';

const roboto=Roboto({
  weight:'900',
  subsets:['latin'],
  display:'swap'
})
const robotolight=Roboto({
  weight:'700',
  subsets:['latin'],
  display:'swap'
})


const Login=()=> {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [closeIcon, setCloseIcon] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [msg, setFormStatus] = useState('') 
  const [modalShow, setModalShow] = useState(false);
  const [msgType, setMsgType] = useState('')
  const [submitBtn, setSubmitBtn] = useState({})
  const submitCloseIcon = ()=>{
    setCloseIcon(false);
  }
  const [inputData, setInputData] = useState({
    email:'',
    password:''
  });
  const handleChange =(event)=> {
    setModalShow(false)
    const {name, value} = event.target;
    setInputData((valuePre)=>{
   return{
     ...valuePre,
     [name]:value
   }
 });

  }
  const submitLogin =(e)=> {
    setFormStatus("");
    setModalShow(false)
    if(!inputData.email){
      setFormStatus("Email can not be blank.")
      setCloseIcon(true);
      setModalShow(true)
      setMsgType('error')
    // }else if(!isValidEmail){
    //   setFormStatus("Invalid Email.")
    //   setCloseIcon(true);
  }else if(!inputData.password){
      setFormStatus("Password can not be blank.")
      setCloseIcon(true);  
      setModalShow(true)
      setMsgType('error')
  }else{
    setLoading(true)
    axios.post(`${process.env.API_BASE_URL}login.php`,inputData,{
      headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => {
          const data = res.data;
          if(res &&  res.data && res.data.error && res.data.error.length > 0){
              setFormStatus( res.data.error);
              setModalShow(true)
              setMsgType('error')
              setCloseIcon(true);
              setLoading(false)
          }else{
              if(data){
                setModalShow(false)
                setMsgType('')
                setFormStatus("");
                  //setCloseIcon(true);
                  setSubmitBtn({
                    padding: '1rem 0rem',
                    display: 'block',
                    color: '#46c737'
                  })
                  if(data.userData){
                      localStorage.clear();
                      localStorage.setItem("companyname", data.userData[0]['companyname']);
                      localStorage.setItem("title", data.userData[0]['title']);
                      localStorage.setItem("name", data.userData[0]['name']);
                      localStorage.setItem("email", data.userData[0]['email']);
                      localStorage.setItem("logo", data.userData[0]['logo']);
                      localStorage.setItem("userid", data.userData[0]['userid']);
                      localStorage.setItem("tokenAuth", data.userData[0]['tokenAuth'].token);
                      localStorage.setItem("image", data.userData[0]['image']); 
                      localStorage.setItem("type", data.userData[0]['type']); 
                      localStorage.setItem("contactno", data.userData[0]['contactno']);
                      localStorage.setItem("about", data.userData[0]['about']);  
                      localStorage.setItem("location", data.userData[0]['location']);
                      router.push('/dashboard')
                      //setLoading(false)
                  }
                }
          }
    })
    .catch(err => {
      if(err){
        setLoading(false)
      }
     })
  }
}
useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      let userid = localStorage.getItem('tokenAuth');
      if(userid){
        router.push('/dashboard')
      }
    }
  }, []);
  return (
<>
<Head>
</Head>
  <div className="container">
     <div className="row">
        <div className="col-md-12">
           <div className="login-form ">
             <form  className="login ">
             <h1 className={roboto.className}>Log In To Link Database</h1> 
              {isLoading &&
                <div className='loader'>
                  <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
                }
                {!isLoading &&
                <span>
                <input type="text" placeholder="User Name"  name="email" value={inputData.email} onChange={handleChange}/>
                <input type="password" placeholder="Password" name="password" value={inputData.password} onChange={handleChange} />
                <button className={robotolight.className} type="button" onClick={()=>{
                  submitLogin()
                }}>Log In</button>
                </span>
                }
              </form>
            </div>  
            {modalShow &&
                <MsgModal 
                    msgType={msgType}
                    msg={msg}
                />
            }
        </div>
     </div>
    </div>
</>

  );
}

export default Login;


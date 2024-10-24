"use client"
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
const MsgModal =(props)=> {
  Swal.fire({
    title: props && props.msg ? props.msg :'',
    text: '',
    icon: props && props.msgType ? props.msgType :'',
    confirmButtonText: 'ok'
  })
}



export default MsgModal
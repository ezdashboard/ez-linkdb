"use client"
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
const SuccessModal =(props)=> {
  Swal.fire({
    title: props && props.msg ? props.msg :'',
    text: '',
    icon: 'success',
    confirmButtonText: 'ok'
  })
}



export default SuccessModal
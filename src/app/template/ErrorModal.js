"use client"
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
const ErrorModal =(props)=> {
  Swal.fire({
    title: props && props.msg ? props.msg :'',
    text: '',
    icon: 'error',
    confirmButtonText: 'ok'
  })
}



export default ErrorModal
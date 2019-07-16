import {Message} from "element-ui";

export default ({$axios})=>{
   $axios.onError(err=>{
    //    console.log (err.response)
    //获取错误信息
     const {message, statusCode}=err.response.data

     //判断
     if (statusCode===400) {
        Message.warning(message);
     }
   })
}
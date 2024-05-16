//  redux
import { resetMessage } from "../slices/postSlice";


export const useResetComponentMessage = (dispatch) =>{
    return()=>{
        setTimeout(() => {
            dispatch(resetMessage())
        }, 2000);
    }
}

export default useResetComponentMessage;
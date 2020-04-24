
import axios from 'axios';
import global from '../../providers/global.static.jsx';

class Utils {
    doQuery(url,data = null) {
        return new Promise((resolve,reject)=>{
            let obj = {
                method         : 'post',
                url            : global.URLBASESERVICE + url
            };
            let currentCookie = Cookies.get('_svaf');
            if (data !== null){
                data.append('token', currentCookie);
            }else{
                data = new FormData();
                data.append('token', currentCookie);
            }
            obj.data = data;
            axios(obj)
            .then((response) => {
                let data = response.data;
                if (data.error !== undefined){
                    if (data.action == "logout"){
                        Cookies.remove('_svaf');
                        window.location.href = "/";
                    }
                }
                resolve(data);
            }).catch(()=>{
                resolve(null);
            });

        });
    }
}
export default Utils;

const { regClass, property } = Laya;
 
import { NetMgr } from '../common/NetMgr';
import { LoginBase } from './Login.generated';

@regClass()
export class Login extends LoginBase {

    onAwake() {
        console.log("Login start");
        this.login_button.on(Laya.Event.CLICK,this,this.onLoginButtenEvent.bind(this));
        NetMgr.getInstance().Test();
         NetMgr.getInstance().Verify([122,123,11],120,1000);
    
    }
    onOpened(param: any): void {
         
        
    }

    onLoginButtenEvent( ){
    
    };
 
    onChangeScene(){
        Laya.Scene.open("resources/scene/Home.ls",true, null, null,null);
        Laya.Scene.close("resources/scene/Login.ls")
        Laya.Scene.destroy("resources/scene/Login.ls")
    }
}
 
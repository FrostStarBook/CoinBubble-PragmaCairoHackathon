const { regClass } = Laya;
import { HomeBase } from './Home.generated';
 
@regClass()
export class Home extends HomeBase {

    gameComponents:any;
 
    result:any;

    onAwake() {
        console.log("Home start");
        this.pve_button.on(Laya.Event.CLICK,this,this.onPVEButtenEvent.bind(this));
        this.rank_button.on(Laya.Event.CLICK,this,this.onRankButtenEvent.bind(this));
    }
    onOpened(param: any): void {
         this.changeBg();
    }
    changeBg(){
        Laya.Tween.to(this.Mask,{alpha:0},1200,Laya.Ease.linearIn);
    }
    onActionFinishEvent(){
        this.onChangeScene();
    }
    onPVEButtenEvent( ){
        Laya.Tween.to(this.Mask,{alpha:1},1200,Laya.Ease.linearIn,Laya.Handler.create(this,this.onActionFinishEvent.bind(this)));
    };
    onRankButtenEvent( ){
        Laya.Scene.open("resources/prefab/P_rank.lh", false, {"text":'112'}) 
      
    };
    onChangeScene(){
        Laya.Scene.open("resources/scene/Game.ls",true, null, null,null);
        Laya.Scene.close("resources/scene/Home.ls")
        Laya.Scene.destroy("resources/scene/Home.ls")
    }
}
 
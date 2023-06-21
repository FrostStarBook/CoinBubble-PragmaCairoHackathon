import { GameManagerEvent } from "../common/Config";

const { regClass, property } = Laya;

@regClass()
export class GameBlock extends Laya.Script {
    //declare owner : Laya.Sprite3D;

    @property( { type: Laya.Image } )
    private image: Laya.Image;

    @property( { type: Laya.Text } )
    private Text: Laya.Text;

    public uid:number = -1;
    public touchFlag:boolean = true;
    constructor() {
        super();
    }
    onAwake(): void {
        this.image.on(Laya.Event.CLICK,this,this.onClickEvent.bind(this));
    }
    onClickEvent( ){
       // console.log('card touch');
        if(this.touchFlag == false){
            return;
        }
     //   console.log('card touch enabled ');
        Laya.stage.event(GameManagerEvent.TouchCard,this.uid);
        
    }
    SetID(uid:string){
        this.Text.text = uid;
    }
    SetTexture(res:string){
        if(this.image != undefined){
            this.image.loadImage(res);
        }
    }
 
}
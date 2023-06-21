 
const { regClass, property } = Laya;

@regClass()
export class GameRankItem extends Laya.Script {
    //declare owner : Laya.Sprite3D;
    @property( { type: Laya.Label } )
    private rank: Laya.Label;
    @property( { type: Laya.Label } )
    private playerid: Laya.Label;
    @property( { type: Laya.Label } )
    private score: Laya.Label;
    @property( { type: Laya.Image } )
    private bg: Laya.Image;
    constructor() {
        super();
    }
    onAwake(): void {

  
    }
    SetData(param: any){
        this.rank = param.index;
        this.playerid.text = param.id;
        this.score.text = param.score;
        this.bg.color = param.index%2 == 0?"3f6065":"447844";
    }
    onOpened(param: any): void {
      
    }
    onDisable(): void {
    }
    
}
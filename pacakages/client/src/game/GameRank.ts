import { GameRankBase } from "./GameRank.generated";
import { GameRankItem } from "./GameRankItem";

const { regClass, property } = Laya;

@regClass()
export class GameRank extends GameRankBase {
    //declare owner : Laya.Sprite3D;

    @property(String)
    public text: string = "";

    constructor() {
        super();
    }
     
    onOpened(param: any) {
        Laya.loader.load("resources/prefab/P_rankItem.lh").then( (res)=>{
            for (var i: number = 0; i < 10; i++) {
                let item = res.create();
                let script = item.getComponent(Laya.Script) as GameRankItem;
                const temp = {
                    id:i.toString(),
                    score:i,
                    index:i
                }
                script.SetData(temp);
                item.y = i*60;
                this.panel.addChildAt(item,i);
            }
        } ); 
    }
}
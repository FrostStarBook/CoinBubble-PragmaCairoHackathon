import { GameDialogBase } from "./GameDialog.generated";

const { regClass, property } = Laya;

@regClass()
export class GameDialog extends GameDialogBase {
 
    constructor() {
        super();
    }
    onAwake(): void {

        this.Text.text = "";
        
        this.Button.on(Laya.Event.CLICK, this, () => {
            this.close();
        });
    }
    onOpened(param: any): void {
        this.Text.text = param.text;
    }
    onDisable(): void {
    }

   
}
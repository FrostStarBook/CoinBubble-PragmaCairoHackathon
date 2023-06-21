const { regClass, property } = Laya;

 
import {GameConfigType,BlockType,ChessBoardUnitType, GameManagerEvent, RemoveRuleType, GameResultType, BlockStatusType, GameConfig, defaultGameConfig, MoveDeltaX, BlockSize, MoveDeltaY} from '../common/Config'
import { NetMgr } from '../common/NetMgr';
import { RandomMgr } from '../common/RandomMgr';
import { GameBlock } from '../game/GameBlock';
import { GameBase } from './Game.generated';
 
@regClass()
export class Game extends GameBase {
    
    randMgr:RandomMgr;
 
    chessBoard: ChessBoardUnitType[][] = [];
 
    res:Laya.PrefabImpl = null;
    card_res:Laya.PrefabImpl = null;
 
    cardNodeMap:Map<number,Laya.Image> = new Map();
    cardMap:Map<number,BlockType> = new Map();
     
    curSlotNum:number = 0;
    slotArea:number[];
    score:number=0;
    gameConfig:GameConfig;
    cardMoveSpeed:number = 1;
    slotCardMoveSpeed:number = 0.5;
    playerOpCards:number[];
    stageNum:number = 0;
    getgameconfig(level:number):GameConfig{
      //todo lib game
      return

    }
    async onAwake() {
        console.log("Game start");
        await Laya.loader.load("resources/prefab/P_block.lh").then((res)=>{
            this.res = res;
        } );
        await Laya.loader.load("resources/atlas/letter/letter.atlas", Laya.Loader.ATLAS).then((res)=> {
          this.card_res = res;
        });
  
        this.gameConfig = this.getgameconfig(120);
         
         
         
        this.view.size(this.gameConfig.viewSize*BlockSize,this.gameConfig.viewSize*BlockSize);
        Laya.stage.on(GameManagerEvent.TouchCard,this,this.onTouchCardEvent.bind(this));
        Laya.stage.on(GameManagerEvent.RestartGame,this,this.RestartGame.bind(this));
       
        Laya.Tween.to(this.Mask,{alpha:0},1500,Laya.Ease.linearIn);
        this.onInitGame(this.gameConfig);
    }
    onDestroy(): void {
      for(let node of this.cardNodeMap)
      {
          node[1].removeSelf();
      }

      this.cardNodeMap.clear();
    }
    initMap(mapConfig:any){
      
      this.gameConfig = {
        slotNum:this.getConfigValue(mapConfig,GameConfigType.SlotNum),
        composeNumMin:this.getConfigValue(mapConfig,GameConfigType.ComposeNumMin),
        composeNumMax:this.getConfigValue(mapConfig,GameConfigType.ComposeNumMax),
        typeNum:this.getConfigValue(mapConfig,GameConfigType.TypeNum),
        cardRatio:this.getConfigValue(mapConfig,GameConfigType.CardRatio),
        removeRule:this.getConfigValue(mapConfig,GameConfigType.RemoveRule),
        viewSize:this.getConfigValue(mapConfig,GameConfigType.ViewSize),
        totalNum:this.getConfigValue(mapConfig,GameConfigType.TotalNum),
        stageNum:this.getConfigValue(mapConfig,GameConfigType.StageNum),
        passScore:this.getConfigValue(mapConfig,GameConfigType.PassScore)
      };
    }
    getConfigValue(config:any, configType:GameConfigType){
      
      let result = 0;
      const _type = Number(configType);
      const t = config.config >> BigInt(16*(_type));
      result = Number(t % BigInt(2 ** 16));
      
      return result;
}
    onActionFinishEvent(){
      Laya.Scene.open("resources/scene/Login.ls",true, null, null,null);
      Laya.Scene.close("resources/scene/Game.ls")
      Laya.Scene.destroy("resources/scene/Game.ls")
  }
    onChangeScene(){
      Laya.Tween.to(this.Mask,{alpha:1},1200,Laya.Ease.linearIn,Laya.Handler.create(this,this.onActionFinishEvent.bind(this)));
  }
    RestartGame(type:number){
       
      if(type == 0){
        this.onChangeScene();
        return;
      }else if (type == 1){
        this.stageNum++;
        if(this.stageNum == this.gameConfig.stageNum){
          this.onChangeScene();
        }
      }
      this.onInitGame(this.gameConfig);
    }
    onTouchCardEvent(uid:number){
       //console.log("触摸：",uid);
        if(!this.cardMap.has(uid)){
          return;
        }
       // console.log(this.playerOpCards);
        const status = this.cardMap.get(uid).state;
        if(status == 0){
            this.onTouchViewCardEvent(uid);
        }else if(status == 1){
            this.onTouchSlotCardEvent(uid);
        }
    }
    onTouchViewCardEvent(uid:number){
         
      if(!this.cardMap.has(uid)){
        return;
      }
       
        let card = this.cardMap.get(uid);
        if(card.state != 0){
            return;
        }
        for (let i = this.cardMap.size - 1; i > uid;i--) {
          if(this.cardMap.get(i).state == 0){
            if(this.checkOverLap(this.cardMap.get(i),this.cardMap.get(uid))){
                return;
            }
          }
           
        }
        for (let i = uid - 1; i > 0; i--) {
          if(this.cardMap.get(i).state == 0){
            if(this.checkOverLap(this.cardMap.get(i),this.cardMap.get(uid))){
            //  console.log("id  ",this.cardMap.get(i).id);
              this.cardMap.get(i).upBlockNum -=1;
              if(this.cardMap.get(i).upBlockNum == 0){
                this.cardNodeMap.get(i).gray = false;
              }
            }
          }
           
        }
        
        this.onMoveTouchCard(uid); 
    }
    onMoveTouchCard(uid:number){
        this.curSlotNum++;
        this.playerOpCards.push(uid);
        if(this.curSlotNum > this.gameConfig.slotNum){
            this.onPopResult(GameResultType.DEFEAT,this.score.toString());
            return; 
        }
        Laya.Button
        this.cardMap.get(uid).state = 1;
        this.cardNodeMap.get(uid).zOrder = 999;
        const cPoint = new Laya.Point(this.cardNodeMap.get(uid).x,this.cardNodeMap.get(uid).y);
        let movePoint= new Laya.Point(0,0);
        this.bottom_frame.localToGlobal(movePoint,false);
        this.view.globalToLocal(movePoint,false);
        movePoint.x += (this.curSlotNum-1)*BlockSize+MoveDeltaX;
        movePoint.y += MoveDeltaY;

        const sTime = this.calcDistance(cPoint,movePoint)/this.cardMoveSpeed;

        let script = this.cardNodeMap.get(uid).getComponent(Laya.Script) as GameBlock;

        script.touchFlag = false;
        
        this.slotArea[this.curSlotNum-1] = uid;
        Laya.Tween.to(this.cardNodeMap.get(uid),movePoint,sTime,Laya.Ease.linearIn,Laya.Handler.create(this,this.onMoveCardFinishEvent.bind(this),[uid]));
       
    }
    calcDistance(a:Laya.Point,b:Laya.Point){
        return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2));
    }
    onMoveCardFinishEvent(args:number){
        const uid = args;
        let script = this.cardNodeMap.get(uid).getComponent(Laya.Script) as GameBlock;
        script.touchFlag = true;
    }
    onMoveSlotCardFinishEvent(args:number){
        const uid = args;
 
        let script = this.cardNodeMap.get(uid).getComponent(Laya.Script) as GameBlock;
        script.touchFlag = true;
    }
    onTouchSlotCardEvent(uid:number){
   
        if(!this.cardNodeMap.has(uid)){
            return;
        }
        
        let flag = true;
        for(let element of this.cardMap){
          if(element[1].state == BlockStatusType.Normal){
            flag = false;
            break;
          }
        }
         
        if(flag && this.cardNodeMap.size < this.gameConfig.composeNumMax){
          let tempMap = new Set<number>;
          flag = true;
          for (let element of this.cardNodeMap) {
            const type = this.cardMap.get(element[0]).type;
            if(tempMap.has(type)){
              flag = false;
              break;
            }else{
              tempMap.add(type);
            }
          }
          if(flag){
            this.onPopResult(GameResultType.DEFEAT,this.score.toString());
          }
        }
        
        let newSlot = [];
        let n = 0;
        const type = this.cardMap.get(uid).type;
        let removeArray = [];
        if(this.gameConfig.removeRule == RemoveRuleType.CONTINUE){
          let p_index = 0;

          for (let i = 0; i < this.slotArea.length; i++) {
            if(this.slotArea[i] == uid){
                p_index = i;
                break;
            }
        }
          for (let i = p_index; i < this.slotArea.length; i++) {
            if(this.slotArea[i] == -1){
                break;
            }
            if(this.cardMap.get(this.slotArea[i]).type == type){
                 removeArray.push(i);
                 n++;
                 if(n >= this.gameConfig.composeNumMax){
                    break;
                 }
            }
            else{
                break;
            }
          }
          if(n < this.gameConfig.composeNumMax){
            for (let i = p_index-1; i >= 0; i--) {
              if(this.slotArea[i] == -1){
                  break;
              }
              if(this.cardMap.get(this.slotArea[i]).type == type){
                  removeArray.push(i);
                  n++;
                  if(n >= this.gameConfig.composeNumMax){
                    break;
                  }
              }
              else{
                  break;
              }
            }
          } 
          if(n < this.gameConfig.composeNumMin){
              return;
          }
          this.curSlotNum  -= n;
        
          for (let index = 0; index < removeArray.length; index++) {
              const id = this.slotArea[removeArray[index]];
              this.cardNodeMap.get(id).removeSelf();
              this.cardNodeMap.delete(id);
              this.cardMap.get(id).state = 2;
              this.slotArea[removeArray[index]] = -1;
          }
        
          for (let index = 0; index < this.slotArea.length; index++) {
            const element = this.slotArea[index];
            if(element != -1){
                newSlot.push(element);
            }
          }
          const dC = this.slotArea.length-this.curSlotNum;
          for (let index = 0; index < dC; index++) {
            newSlot.push(-1);
          }
        }else if(this.gameConfig.removeRule == RemoveRuleType.DISCONTINUE)
        {
          for (let i = 0; i < this.slotArea.length; i++) {
            const id = this.slotArea[i];
            if(id == -1){
              break;
            }
            //console.log(id,type);
            if(this.cardMap.get(id).type == type){
              removeArray.push(i);
              n++;
              if(n >= this.gameConfig.composeNumMax){
                break;
              }
            }
          }
          if(n < this.gameConfig.composeNumMin){
            // this.onPopDialog('没有到最低消除个数! ');
             return;
         }
         this.curSlotNum  -= n;
        
         for (let index = 0; index < removeArray.length; index++) {
          const id = this.slotArea[removeArray[index]];
          this.cardNodeMap.get(id).removeSelf();
          this.cardNodeMap.delete(id);
          this.cardMap.get(id).state = 2;
          this.slotArea[removeArray[index]] = -1;
     
      }
          for (let index = 0; index < this.slotArea.length; index++) {
            const element = this.slotArea[index];
            if(element != -1){
                newSlot.push(element);
            }
          }
          const dC = this.slotArea.length-this.curSlotNum;
          for (let index = 0; index < dC; index++) {
            newSlot.push(-1);
          }
        }
        this.playerOpCards.push(uid);
        this.score += Math.pow(2,n-this.gameConfig.composeNumMin);
        this.score_number.text = this.score.toString();

        this.slotArea = newSlot;
        
      //  console.log('new slot ',this.slotArea);
        for (let i = 0; i < this.slotArea.length; i++) {
            const index = this.slotArea[i];
            if(index == -1 && !this.cardNodeMap.has(index)){
                continue;
            }
    
            const cPoint = new Laya.Point(this.cardNodeMap.get(index).x,this.cardNodeMap.get(index).y);
            let movePoint= new Laya.Point(0,0);
            this.bottom_frame.localToGlobal(movePoint,false);
            this.view.globalToLocal(movePoint,false);
            movePoint.x += i*BlockSize+MoveDeltaX;

            movePoint.y += MoveDeltaY;
            const sTime = this.calcDistance(cPoint,movePoint)/this.slotCardMoveSpeed;
            let script = this.cardNodeMap.get(index).getComponent(Laya.Script) as GameBlock;
    
            script.touchFlag = false;
            Laya.Tween.to(this.cardNodeMap.get(index),movePoint,sTime,Laya.Ease.linearIn,Laya.Handler.create(this,this.onMoveSlotCardFinishEvent.bind(this),[index]));
        }
         
        if(this.cardNodeMap.size == 0){
          this.onPopResult(GameResultType.VICTORY,this.score.toString());
          return; 
        } 
     
       
    }
    onInitGame(gameConfig:GameConfig){
        this.gameConfig = gameConfig;
 
        for(let node of this.cardNodeMap){
            node[1].removeSelf();
        }
 
        this.cardNodeMap.clear();
        this.cardMap.clear();
        this.curSlotNum = 0;
        this.slotArea =  new Array(gameConfig.slotNum).fill(-1);
         
        this.score_number.text = this.score.toString();
        this.playerOpCards = [];

        const blockNumUnit = gameConfig.composeNumMax * gameConfig.cardRatio * gameConfig.typeNum;

       // const seed = toInt32(Math.random()*1000);
        const seed = 1000;
        this.randMgr = new RandomMgr();
        this.randMgr.init(seed);

        this.seed_text.text = seed.toString();

        
        let AllBlockArray = Array<BlockType>();
        let typeArray = Array<number>();
        this.getRandomTypeArray(typeArray);
        const viewMax = 2*(gameConfig.viewSize)-1;
        const typeNum = gameConfig.typeNum;

        for (let i = 0; i < blockNumUnit; ++i) {
          let rx = this.randMgr.randomNum(0, viewMax-1)*BlockSize/2;
          let ry = this.randMgr.randomNum(0, viewMax-1)*BlockSize/2;
          const newBlock = {
          id: i+1,
          x:rx,
          y:ry,
          state:0,
          type: typeArray[i % typeNum],
          upBlockNum:0,
        } as BlockType;
         AllBlockArray.push(newBlock);
      }
     // console.log("end222 seed ",this.randMgr.seed);
      this.shuffleBlocks(AllBlockArray);
     
      this.initCard(AllBlockArray);
      for (let index = 0; index < AllBlockArray.length; index++) {
        const element = AllBlockArray[index];
        //console.log("id upnum",element.id,element.upBlockNum);
        this.cardMap.set(element.id,element);
      }
      this.gameStart();
    }
    getRandomTypeArray(typeArray:number[]){
      const totalNum =  this.gameConfig.totalNum;
      const typeNum =  this.gameConfig.typeNum;
      let totalArray = Array<number>();
      for (let i = 0; i < totalNum;i++) {
        totalArray.push(i);
      }
      for (let i = 0; i < typeNum;i++) {
        let j  = this.randMgr.randomNum(0,totalNum-i-1);
        typeArray[i] = totalArray[j];
        totalArray[j] = totalArray[totalNum-i-1];
      }
    }
    shuffleBlocks(blocks:BlockType[]){
      const length = blocks.length;
      let j;
      let temp;
      for (let i = 1; i < length; i++) {
        j = this.randMgr.randomNum(0,i);
        temp =  blocks[i].type;
        blocks[i].type = blocks[j].type;
        blocks[j].type = temp;
      }
    }
    initCard(blockInfo:BlockType[]){

      for (let i = 0; i < blockInfo.length; i++) {
            
        const info = blockInfo[i];
       // this.cardMap.set(info.id,info);

      //  const [a,c] = this.getCardInfo(defaultGameConfig,info.type);

        let ct = this.res.create() as Laya.Image;
        let script =  ct.getComponent(Laya.Script) as GameBlock;
        script.uid = info.id;
       
        //let res:Laya.Texture = Laya.loader.getRes(`resources/letter/letter_${info.type+1}.png`);
        script.SetTexture(`resources/blocks/play_icon_${info.type+1}_n.png`);
      //  script.SetID(info.id.toString());
        ct.x = this.view.width/4;
        ct.y = this.view.height/4;
        ct.zOrder = info.id;
        
        for (let j = blockInfo.length - 1; j > i; j--) {
          if(this.checkOverLap(blockInfo[j],info)){
            blockInfo[i].upBlockNum++;
            ct.gray = true;
           // break;
          }
        }
        /*
        if(info.lowerThanBlocks.size != 0){
            ct.gray = true;
        }
        */
        this.view.addChild(ct);
        this.cardNodeMap.set(info.id,ct);
      }
    }
    gameStart(){
        console.log('-----');
        const basePoint = new Laya.Point(0,0);
        for(let element of this.cardMap){
          const info = element[1];
          const node = this.cardNodeMap.get(info.id);
          let movePoint= new Laya.Point(info.x,info.y);
          const sTime = this.calcDistance(basePoint,movePoint)/this.slotCardMoveSpeed;
          let script = node.getComponent(Laya.Script) as GameBlock;
  
          script.touchFlag = false;

          Laya.Tween.to(node,movePoint,sTime,Laya.Ease.linearIn,Laya.Handler.create(this,this.onMoveSlotCardFinishEvent.bind(this),[info.id]));
        }
    }

    genLevelBlockPos = (
        curBlocks: BlockType[],
        nextBlocks: BlockType[],
        minX: number,
        minY: number,
        maxX: number,
        maxY: number
      ) => {
        for (let i = 0; i < nextBlocks.length; i++) {
          const block = nextBlocks[i];
          block.x = this.randMgr.randomNum(minX,maxX);
          block.y = this.randMgr.randomNum(minY,maxY);
          // 填充层级关系
          for (let j = 0; j < curBlocks.length; j++) {
            const element = curBlocks[j];
            if(this.checkOverLap(block,element)){
              //  element.lowerThanBlocks.add(block.id);
              //  block.higherThanBlocks.add(element.id);
            }
          }
          curBlocks.push(block);
        }
      };
      checkOverLap(a:BlockType,b:BlockType):boolean{
         if(b.y+BlockSize <= a.y ||
          b.y >= a.y +BlockSize || 
          b.x+BlockSize <= a.x ||
          b.x >= a.x +BlockSize){
            return false;
          }
          return true;
      }
 
    onPopDialog(message:string){
        Laya.Scene.open("resources/prefab/P_dialog.lh", false, {"text":message}) 
    }
    async onPopResult(type:number,message:string){
      
      //starknet
      const ret = await NetMgr.getInstance().Verify(this.playerOpCards,120,1000);
      console.log(this.playerOpCards);
      if(ret){
        if(type == GameResultType.DEFEAT){
          Laya.Scene.open("resources/prefab/P_defeat.lh", false, {"text":message,"type":type});
        }
        else{
           
          Laya.Scene.open("resources/prefab/P_victory.lh", false, {"text":message,"type":type});
        }
      }
      else{
        console.log("验证失败！");
      }
     
  }
}
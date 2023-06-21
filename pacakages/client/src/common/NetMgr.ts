
export class NetMgr {
    private constructor() {
    }

    private static instance: NetMgr | undefined

    static getInstance():NetMgr{
        if(NetMgr.instance === undefined) {
            NetMgr.instance = new NetMgr()
        }
        return NetMgr.instance;
    }
}
 
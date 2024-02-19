const initializeGame =async function(){
    try{
        // 玩家的初始资源
        const resources = {
            iron:0,  //铁
            wood:0,  //木
            stone:0, //石
            food:0,  //粮
            money:0, //铜
            prestige:0//声望
        };

        // 游戏的相关信息
        const gameInfo = {
            worldSize: { width: 1000, height: 1000 }, // 世界地图的大小
            dayCycle: 'day', // 当前的昼夜周期
            weather: 'clear' // 当前的天气
        };

        // 随机生成主角的出生坐标
        const playerPosition = {
            x: Math.floor(Math.random() * gameInfo.worldSize.width),
            y: Math.floor(Math.random() * gameInfo.worldSize.height)
        };

        // 初始化玩家的状态
        const playerState = {
            position: playerPosition,
            resources: resources,
        };
        // 返回初始化后的游戏状态
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve({
                    playerState: playerState,
                    gameInfo: gameInfo
                })
            },1000)
        })
    }catch(err){
        return new Promise((reject)=>{
            reject(err)
        })
    }
}
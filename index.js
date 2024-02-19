const startGame=()=>{
    console.log('开始游戏')
    LoadingStart()
    setInterval(updateLoadingMessage,2000);
    initializeGame().then((data)=>{
        console.log(data)
    }).catch((err)=>{
        console.log(err)
    }).finally(()=>{
        LoadingEnd()
    })
}
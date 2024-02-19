const loadingMessages = [
  "世界正在生成中...",
  "建筑正在施工...",
  "天气正在生成中...",
];
const LoadingStart=()=>{
  $('#start').fadeOut(500)
  $('#loading-screen').fadeIn(500)
}
let currentIndex = 0
const updateLoadingMessage=()=>{
  if(currentIndex>=loadingMessages.length){currentIndex=0}
  $('#loading-text').fadeOut(2000, function() {
    $(this).text(loadingMessages[currentIndex++]).fadeIn(2000);
  });
}
const LoadingEnd=()=>{
  $('#loading-screen').fadeOut(500); // 所有消息显示完毕后隐藏加载屏幕
  $('#game-content').fadeIn(500)
}
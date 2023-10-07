// 配置初始化数据
var Menu = []
function getMenu(){
  return new Promise((resolve,reject)=>{
    try{
      Menu = electron.ipcRenderer.getStoreValue('menu')
      if(!Menu){
        $('#load').load('./Stores/menu.json',(text)=>{
          Menu=JSON.parse(text).menu
          console.log(Menu,JSON.parse(text))
          electron.ipcRenderer.setStoreValue('menu',Menu)
          resolve(Menu)
          // readyMenu()
        })
      }else{
        resolve(Menu)  
      }
    }catch(err){
      reject(err)
    }
  })
}

//设置弹窗开关
function setEdit(){
  $('.li-edit-icon').click((e)=>{
    let Top = $(e.target).parent('.li-nav-item').offset().top
    if(Top < $('body').height()/2){
      $('.li-list-to').css('top',Top + 40)
    }else{
      $('.li-list-to').css('top',Top - 130)
    }
    $('.li-list-to').addClass('show')
    e.stopPropagation()
  })
}

// 配置菜单
function readyMenu(){
  let uinav = $('<ul class="li-nav-ui"></ul>')
  console.log(Menu)
  for(let i in Menu){
    let liitem =`<li class="li-nav-item bgBox">
      <a class="" href="javascript:;">`+ Menu[i].title +`</a>
      <i class="layui-icon li-edit-icon layui-icon-more-vertical"></i>
    </li>`
    uinav.append(liitem)
  }
  console.log(uinav)
  $('.layui-side-scroll').html(uinav)
  setEdit()
}

// 异步更新菜单
function setMenu(){
  getMenu().then((data)=>{
    readyMenu()
  })
}

// 右下角通知
const Ealert = (title="Title",text="Undefined",back=null)=>{
  const NOTIFICATION_TITLE = title
  const NOTIFICATION_BODY = text
  new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick =
    () => back
}

const SetHtml = ()=>{
  let file = $('.bodyHtml').attr("file")
  $('.bodyHtml').load(file)
}

//执行
setMenu()
SetHtml()


//点击展开菜单
$('.menuIcon').click((e)=>{
  $('.layui-plus-menu').toggleClass('hideMneu')
  $('.layui-body').toggleClass('hideBody')
  if($('.layui-plus-menu').hasClass('hideMneu')){
    $('.li-indent').addClass('layui-icon-next').removeClass('layui-icon-prev')
  }else{
    $('.li-indent').removeClass('layui-icon-next').addClass('layui-icon-prev')
  }
})
//点击关闭展开
$('body').click(()=>{
  $('.li-list-to').removeClass('show')
})

// //点击菜单，展开隐藏菜单
// $('.li-nav-item a').click((e)=>{
//   $(e.target).parent('.li-nav-item').find('.li-nav-child').toggleClass('show')
// })


// 创建新文件夹功能
$('body').on("click","#create",(e)=>{
  let index = layer.open({
    type: 1, // page 层类型
    area: ['500px', '200px'],
    title: '创建新文件夹',
    shade: 0.6, // 遮罩透明度
    shadeClose: true, // 点击遮罩区域，关闭弹层
    // maxmin: true, // 允许全屏最小化
    anim: 0, // 0-6 的动画形式，-1 不开启
    content: `<div style="padding:25px 40px;">
      <input type="text" name="" placeholder="请输入文件夹名称" class="layui-input nameInput">
      <div class="layui-footer">
        <button class="layui-btn layui-btn-primary layui-border close">取消</button>
        <button type="button" class="layui-btn submit">确定</button>
      </div>
    </div>`
  });
  $('.close').click(()=>{
    layer.close(index);
  })
  $('.submit').click(()=>{
    let title = $('.nameInput').val().trim()
    if(title){
      let id = new Date().getTime()
      let Obj ={id,title}
      Menu.push(Obj)
      electron.ipcRenderer.setStoreValue('menu',Menu)
      readyMenu()
      layer.close(index);
    }
  })
})


//统一动态设置元素节点
$(".include").each(function() {
  if (!!$(this).attr("file")) {
      var $includeObj = $(this);
      $(this).load($(this).attr("file"), function(html) {
          $includeObj.after(html).remove();
      })
  }
});

//右下角清除
$(".seting.button").click(()=>{
  electron.ipcRenderer.clearStorae()
  setMenu()
  Ealert('通知',"数据已全部清除！")
})
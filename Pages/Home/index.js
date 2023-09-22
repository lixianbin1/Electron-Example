// 配置初始化数据
const Menu = electron.ipcRenderer.getStoreValue('menu')
if(!Menu){
  $('#load').load('./Stores/menu.json',(text)=>{
    let JsonText=JSON.parse(text)
    electron.ipcRenderer.setStoreValue('menu',JsonText.menu)
  })
}

// 配置菜单
let uinav = $('<ul class="li-nav-ui"></ul>')
for(let i in Menu){
  let liitem =`<li class="li-nav-item bgBox">
    <a class="" href="javascript:;">`+ Menu[i].title +`</a>
    <i class="layui-icon li-edit-icon layui-icon-more-vertical"></i>
  </li>`
  uinav.append(liitem)
}
$('.layui-side-scroll').append(uinav)


// 右下角通知
const Ealert = (title="Title",text="Undefined",back=null)=>{
  const NOTIFICATION_TITLE = title
  const NOTIFICATION_BODY = text
  new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick =
    () => back
}



// let nav = $(`<ul class="layui-nav layui-nav-tree" lay-filter="test"></ul>`)
// for(let i in Mneu){
//     let event = $(`<li class="layui-nav-item layui-nav-itemed">
//         <a class="" href="javascript:;">`+ Mneu[i].title + `</a>
//     </li>`)

//     if(Mneu[i].child?.length){
//         let Child = Mneu[i].child
//         let Dlevent = $(`<dl class="layui-nav-child"></dl>`)
//         for(let i in Child){
//             let Cevent = `<dd><a href="javascript:;">`+ Child[i].title +`</a></dd>`
//             Dlevent.append(Cevent)
//         }
//         event.append(Dlevent)
//     }
//     nav.append(event)
// }
// console.log(nav[0])
// $('.layui-side-scroll').append(nav)


//点击菜单展示
$('.menuIcon').click((e)=>{
  $('.layui-plus-menu').toggleClass('hideMneu')
  $('.layui-body').toggleClass('hideBody')
  if($('.layui-plus-menu').hasClass('hideMneu')){
    $('.li-indent').addClass('layui-icon-next').removeClass('layui-icon-prev')
  }else{
    $('.li-indent').removeClass('layui-icon-next').addClass('layui-icon-prev')
  }
})

//点击菜单，展开隐藏菜单
$('.li-nav-item a').click((e)=>{
  $(e.target).parent('.li-nav-item').find('.li-nav-child').toggleClass('show')
})
//点击设置，打开设置弹窗
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
//点击页面，关闭设置弹窗
$('body').click(()=>{
  $('.li-list-to').removeClass('show')
})
//动态设置元素节点
$(".include").each(function() {
  console.log(111)
  if (!!$(this).attr("file")) {
      var $includeObj = $(this);
      $(this).load($(this).attr("file"), function(html) {
          $includeObj.after(html).remove();
      })
  }
});

$(".seting.button").click(()=>{
  electron.ipcRenderer.clearStorae()
  Ealert('通知',"数据已全部清除！")
})
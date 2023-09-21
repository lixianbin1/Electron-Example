// 获取菜单
const Mneu = electron.ipcRenderer.getStoreValue('menu')
console.log(Mneu)

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



$('.menuIcon').click((e)=>{
    // $('.layui-side').toggleClass('hideMneu')
    $('.layui-plus-menu').toggleClass('hideMneu')
    $('.layui-body').toggleClass('hideBody')
    if($('.layui-plus-menu').hasClass('hideMneu')){
      $('.layui-icon').addClass('layui-icon-next').removeClass('layui-icon-prev')
    }else{
      $('.layui-icon').removeClass('layui-icon-next').addClass('layui-icon-prev')
    }
  })

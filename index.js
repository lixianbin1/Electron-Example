console.log(layui)
layui.use(function(){
  var layer = layui.layer;
  layer.msg('Hello World', {icon: 6});
});
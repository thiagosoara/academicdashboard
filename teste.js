var start = new Date("02/05/2013");
var end = new Date("02/10/2013");


var loop = new Date(start);
while(loop <= end){
   alert(loop);           

   var newDate = loop.setDate(loop.getDate() + 1);
   loop = new Date(newDate);
}
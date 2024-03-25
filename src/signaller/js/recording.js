  var list = document.getElementById('myUL');

    // Add an event listener to the list
    list.addEventListener('click', function(event) {
      // Get the clicked item
      var item = event.target;

      // Get the item's text
      var text = item.textContent;

      // Alert the item's text

      alert(item.id);
      var  selectBox = document.getElementById("cameraSel");
      var camid = selectBox.options[selectBox.selectedIndex].value;
      if(obj[camid])
      {
        obj[camid].starttime = item.id;
        obj[camid].doCall( obj[camid].pc,  obj[camid].starttime );
      }
    });


 function recordlist(data)
 {

  let msg;

   try {

        msg = JSON.parse(data);
    

      }
      catch (e) {
       console.log(e); // error in the above string (in this case, yes)!

        return;

   }

   if( !msg.type)
   {
      console.log("datachannel data error %o", msg);
        return;
   }


   switch (msg.type) {
    case "recDates":
    {
       console.log('first: %o', msg.data);

       var list = document.getElementById('myUL');

       for( var i=0; i < msg.data.length ; ++ i )
       {

          var li = document.createElement('li');


          const myDate = new Date(Number(msg.data[i]));
          let dateStr = myDate.getFullYear() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getDate() + "_" + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds()
     
          li.innerText = dateStr;
          // li.setAttribute('draggable','true');
          // li.setAttribute('class','drag');
          li.setAttribute('id', msg.data[i]);
     
          list.appendChild(li);

        }


      break;
    }

    default:
    {
      console.log("WARNING: Ignoring unknown msg of messageType '" + msg.messageType + "'");
      break;
    }


    };

 
}

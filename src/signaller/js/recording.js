  var list = document.getElementById('myUL');

    // Add an event listener to the list
    list.addEventListener('click', function(event) {
      // Get the clicked item
      var item = event.target;


       var selected;
      
       if(item.tagName === 'LI') {                                      
        selected= document.querySelector('li.selected');
        if(selected) selected.className= ''; 
         item.className= 'selected';
       }



      // Get the item's text
      var text = item.textContent;

      if( isNaN(item.id ))
      {
         return;
      }

      // Alert the item's text
      var vsend= "starttime:" +  item.id;
      //alert(item.id);
      var  selectBox = document.getElementById("cameraSel");
      var camid = selectBox.options[selectBox.selectedIndex].value;
      if(channelSnd)
      {
         channelSnd.send(vsend);
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

       while (list.firstChild) {
        list.removeChild(list.firstChild);
       }


       for( var i=0; i < msg.data.length ; ++ i )
       {

          var li = document.createElement('li');

          if(!i)
          li.className= 'selected'; 


          const myDate = new Date(Number(msg.data[i]));

          //let dateStr = myDate.getFullYear() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getDate() + "_" + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds()
     
          li.innerText = myDate.toLocaleString();
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

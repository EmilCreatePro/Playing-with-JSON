var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var _ = require('lodash');
var $ = require('jquery');



const initialRead = () =>
    {
        return new Promise (function(resolve, reject)
{
    fetch('users.json')//make a fetch request
    .then(response => 
    {
    if(response.ok)
    {
        return response.json();//if the response had no problems then return the response converted to json
    }
    throw new Error('Request Failed! Could not read JSON file!');//if we reach this point the response was not ok and we through error
    }, networkError => reject(networkError.message)
    ).then(jsonResponse => {
        //alert("PLM" + JSON.stringify(jsonResponse));
        //return jsonResponse;
        resolve(jsonResponse);
    });

}
); 
    }

let list = ' ';//give dummy value of list at first

window.start = async function()//it's an asynchronous function, it returns a promise when called
{
    try
    {
        list = await initialRead();//we need to wait until the promise is fullfield
        //alert("fun" + JSON.stringify(list));
    }catch(err)
    {
        console.log(err);
    }
    //$("#deleteForm").toggle();//initially don't display the forms
}


window.clearDisplay = function() //use window to make function visible to the outside scope
{
    if(wasDisplayed == true)
    {
        $("#clearbtn").click(function(){
            document.getElementById('items').innerHTML ="";
            wasDisplayed = false;
          });
    }
}

window.findAndDeletUser = function()
{
    let userNameGiven = document.getElementById("delUser").value;
    //document.forms["deleteForm"]["username"].value;
    if(userNameGiven === '')
    {
        alert("Please give a name to delete!");
        return false;
    }
    for(let pos = 0; pos < list.length; pos++)
    {
        if(userNameGiven === list[pos].username)
        {
            list.splice(pos,1);//delete 1 user from position pos 
            console.log("Username found and deleted!");
            if(wasDisplayed == true)
            {
                document.getElementById('items').innerHTML ="";
                display();
            }
            return true;
        }
    }
    console.log("Username not found!");
}

window.addUserToList = function()
{
    let name1 = document.getElementById("name").value;
    let username1 = document.getElementById("username").value;
    let email1 = document.getElementById("email").value;
    let street1 = document.getElementById("street").value;
    let suite1 = document.getElementById("suite").value;
    let city1 = document.getElementById("city").value;
    let zipcode1 = document.getElementById("zipcode").value;
    let lat1 = document.getElementById("lat").value;
    let lng1 = document.getElementById("lng").value;

    let item = [name1, username1, email1, street1, suite1, city1, zipcode1, lat1, lng1];
    console.log(list[0]);
    
    for(let pos = 0; pos < item.length; pos++)
        if(item[pos] === '')
        {
            displayToFillMessage();
            return false;
        }
    let newItem={
        "id": parseInt(list[list.length - 1].id) + 1
    };
    for(let pos = 0; pos < item.length; pos++)
    {
        //newItem[id] = parseInt(list[list.length-1].id) + 1;
        newItem.name=item[pos];
        newItem.username=item[pos];
        newItem.email=item[pos];
        let address1={};//create dummy object first, to add this object as field to newItem object
        let geo1={};
        address1["street"]=item[pos];
        address1["suite"]=item[pos];
        address1["city"]=item[pos];
        address1["zipcode"]=item[pos];
        geo1["lat"]=item[pos];
        geo1["lng"]=item[pos];
        address1.geo = geo1;
        newItem.address = address1;
    }

    //console.log(newItem);
    list.push(newItem);//add new item
    console.log(list);
    let form = document.getElementById("addForm");
    form.style.display = "none";
    alert("User added succesfully!");
    
}

const displayToFillMessage = () =>
{
    let warning = document.getElementById("fillWarning");
    warning.style.display = "block";
    setTimeout(function()
    {
        warning.style.display = "none";
    },3000);
}

window.deleteUserForm = function() //use window to make function visible to the outside scope
{
    $(document).ready(function(){
        $("#remove").click(function(){
            $("#deleteForm").toggle();
        });
    });
}

const display = () => 
{ 
    //alert(JSON.stringify(list));
    for(let i = 0; i < list.length; i++)
    {
        $('#items').append(list[i].name + " username:" + list[i].username +"<br>");
    }
}
 
let wasDisplayed = false;

window.listItems = function() //use window to make function visible to the outside scope
{
    if(!wasDisplayed)
    {
        display();
        wasDisplayed = true;
    }
}

window.addUserForm = function()
{
    $(document).ready(function(){
        $("#addBtn").click(function(){
            $("#addForm").toggle();
        });
    });
}
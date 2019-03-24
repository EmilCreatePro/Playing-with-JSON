//var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//var _ = require('lodash');
var $ = require('jquery');

let list = ' ';//give dummy value of list at first

const initialRead = () =>
{
    return new Promise (function(resolve, reject)
    {
        fetch('users.json')//make a fetch request
        .then(response => 
        {
        if(response.ok)
        {
            return response.json();//if the response had no problems then return to the next then the response converted to json 
        }
        throw new Error('Request Failed! Could not read JSON file!');//if we reach this point the response was not ok and we through error
        }, networkError => reject(networkError.message)
        ).then(jsonResponse => 
            {
                resolve(jsonResponse);//when the promise is resolved the jsonResponse will be given
            });

    }); 
}

//function called when page load
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

const hideTable = () =>
{
    $("#usersTabel tr").remove();
    document.getElementById('usersTabel').style.display="none";
    wasDisplayed = false;
}

const showTable = () =>
{
    document.getElementById('usersTabel').style.display="block";
    wasDisplayed = true;
}

window.clearTable = function() //use window to make function visible to the outside scope
{
    $("#clearbtn").click(function(){
            hideTable();
    });
}

window.findAndDeletUser = function()
{
    hideTable();
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
            displayToNotifyMessage('Username found and deleted!');
            //document.getElementById('items').innerHTML ="";
            //hideTable();
            //display();
            $("#deleteForm").toggle();
            return true;
        }
    }
    console.log("Username not found!");
    displayToNotifyMessage("Username not found!");
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
            displayToNotifyMessage('Please don\'t let a field blank!');
            return false;
        }
    let newItem={
        "id": list.length===0 ? 0 : parseInt(list[list.length - 1].id) + 1//in case there are no users then add id to be 0
    };
    for(let pos = 0; pos < item.length; pos++)
    {
        let index = 0;
        newItem.name=item[index++];
        newItem.username=item[index++];
        newItem.email=item[index++];
        let address1={};//create dummy object first, to add this object as field to newItem object
        let geo1={};
        address1["street"]=item[index++];
        address1["suite"]=item[index++];
        address1["city"]=item[index++];
        address1["zipcode"]=item[index++];
        geo1["lat"]=item[index++];
        geo1["lng"]=item[index++];
        address1.geo = geo1;
        newItem.address = address1;
    }

    //console.log(newItem);
    list.push(newItem);//add new item
    console.log(list);
    let form = document.getElementById("addForm");
    form.style.display = "none";
    displayToNotifyMessage('User was added succesfully!');
    
}

const displayToNotifyMessage = (message) =>
{
    let warning = document.getElementById("notify");
    warning.innerHTML = message;
    warning.style.display = "block";
    setTimeout(function()
    {
        warning.style.display = "none";
    },2000);
}


let wasUserFound = -1;

window.findUser = function()
{
    hideTable();
    let userNameGiven = document.getElementById("searchUser").value;
    if(userNameGiven === '')
    {
        alert("Please give a username to search!");
        return false;
    }

    for(let i = 0; i < list.length; i++)
    {
        if(userNameGiven === list[i].username)
        {
            wasUserFound = i;
            break;
        }
    }

    if(wasUserFound !== -1)
    {
           document.getElementById("nameC").value = list[wasUserFound].name;
           document.getElementById("usernameC").value = list[wasUserFound].username;
           document.getElementById("emailC").value = list[wasUserFound].email;
           document.getElementById("streetC").value = list[wasUserFound].address.street;
           document.getElementById("suiteC").value = list[wasUserFound].address.suite;
           document.getElementById("cityC").value = list[wasUserFound].address.city;
           document.getElementById("zipcodeC").value = list[wasUserFound].address.zipcode;
           document.getElementById("latC").value = list[wasUserFound].address.geo.lat;
           document.getElementById("lngC").value = list[wasUserFound].address.geo.lng;

           $("#searchUserForm").toggle();//hide the search user form
           $("#modifyForm").toggle();//display the form of user selected
    }
    else
    {
        alert("No user was found!");
    }
}

window.modifyUser = function()
{
    list[wasUserFound].name = document.getElementById("nameC").value;
    list[wasUserFound].username = document.getElementById("usernameC").value;
    list[wasUserFound].email = document.getElementById("emailC").value ;
    list[wasUserFound].address.street = document.getElementById("streetC").value;
    list[wasUserFound].address.suite = document.getElementById("suiteC").value;
    list[wasUserFound].address.city = document.getElementById("cityC").value;
    list[wasUserFound].address.zipcode = document.getElementById("zipcodeC").value;
    list[wasUserFound].address.geo.lat = document.getElementById("latC").value;
    list[wasUserFound].address.geo.lng = document.getElementById("lngC").value; 
    $("#modifyForm").toggle();//hide the modify form again
    displayToNotifyMessage('User was changed succesfully!');   
}


const display = () => 
{ 
    $("#usersTabel").toggle();
    $('#usersTabel').append("<tr><th>id</th><th>Nssame</th><th>Username</th><th>Email</th></tr>");
    //alert(JSON.stringify(list));
    for(let i = 0; i < list.length; i++)
    {
        $('#usersTabel').append("<tr><td>" + list[i].id +"</td><td>"+ list[i].name + "</td><td>" + list[i].username +"</td><td>" + list[i].email + "</td></tr>");
    }
    showTable();
}

let wasDisplayed = false;

window.listItems = function() //use window to make function visible to the outside scope
{
    if(wasDisplayed == false)//if not displayed, display it
        display();

}

window.addUserForm = function()
{
    hideTable();
    $(document).ready(function(){
        $("#addBtn").click(function(){
            $("#addForm").toggle();
        });
    });
}

window.deleteUserForm = function() //use window to make function visible to the outside scope
{
    hideTable();
    $(document).ready(function(){
        $("#remove").click(function(){
            $("#deleteForm").toggle();
        });
    });
}

window.searchUserToModifyForm = function() //use window to make function visible to the outside scope
{
    hideTable();
    $(document).ready(function(){
        $("#modifyBtn").click(function(){
            $("#searchUserForm").toggle();
        });
    });
}

window.exportToJSON = function()
{
    var jsonContent = JSON.stringify(list);
    var fs = require('browserify-fs');

    fs.writeFile('./output.json', jsonContent);

    alert("JSON exported!");
}
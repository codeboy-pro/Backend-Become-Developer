async function getRandomUser() {
    try{
       console.log("Fetching random user from API...");
        var response=await fetch('https://randomuser.me/api/');
        if(!response.ok){
            throw new Error('Network response was not ok');

        }
        var data=await response.json();

        console.log(data);
        var user=data.results[0];;

        console.log(user);
        console.log("Random User Info:");
        console.log("Name:", `${user.name.first} ${user.name.last}`);
        console.log("Email:", user.email);
        console.log("Country:", user.location.country);
        return user;
    }catch(error){
console.log("error fetching data:"+error.message);
return null;


    }
   

    
}




getRandomUser();
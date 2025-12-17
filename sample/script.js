const searchBar = document.querySelector(".searchBar");
const cityInput = document.querySelector(".cityInput");
const weatherContainer = document.querySelector(".weatherContainer");
const apiKey = "30a130c2a95853a801cb5ad7e899f963";

searchBar.addEventListener("submit", async event =>{
     event.preventDefault();
     
     const city = cityInput.value;

     if(city){
        try{
            const weatherData = await getWeather(city);
            displayWeatherCondi(weatherData);
        }catch(error){
            console.error(error);
            displayError(error);
        }
     }else{
        displayError("Enter A City");
     }
});

async function getWeather (city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    console.log(response);

    if(!response.ok){
        throw new Error("City not found");
    }
    return await response.json();
}

function displayWeatherCondi(data){
    const {name: city, 
           main: {temp, humidity}, 
           weather: [{description}]} = data;

    weatherContainer.textContent = "";
    weatherContainer.style.display = "flex";

    const displayCity = document.createElement("h1");
    const displayTemp = document.createElement("p");
    const displayHumidity = document.createElement("p");
    const displayCondition = document.createElement("p");
    const errorMsgDisplay = document.createElement("p");

    displayCity.textContent = city;
    displayTemp.textContent = `${(temp - 273.15).toFixed(2)}°C`;
    displayHumidity.textContent = `Humidity: ${humidity}%`;
    displayCondition.textContent = `${description}`;


    displayCity.classList.add("displayCity");
    displayTemp.classList.add("displayTemp");
    displayHumidity.classList.add("displayHumidity");
    displayCondition.classList.add("displayCondition");


    weatherContainer.appendChild(displayCity);
    weatherContainer.appendChild(displayTemp);
    weatherContainer.appendChild(displayHumidity);
    weatherContainer.appendChild(displayCondition);
}

function displayError(errorMsg){
    const errorMsgDisplay = document.createElement("p");
    errorMsgDisplay.textContent = errorMsg;
    errorMsgDisplay.classList.add("errorMsgDisplay");

    weatherContainer.textContent = "";
    weatherContainer.style.display = "flex";
    weatherContainer.appendChild(errorMsgDisplay);
}
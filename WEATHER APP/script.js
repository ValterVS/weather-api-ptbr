const wrapper = document.querySelector(".wrapper");

inputPart = document.querySelector(".input-part");
infoTxt = inputPart.querySelector(".info-txt");
inputField = inputPart.querySelector("input");
locationBtn = inputPart.querySelector("button");
weatherPart = wrapper.querySelector(".weather-part");
wIcon = weatherPart.querySelector("img");
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup",(e) => {
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click",(e) => {
   
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(onSucess,onError);
        }else{
            alert("Seu navegador não suporta geo localização");
        }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&units=metric&appid=8368c3dab3e546d410c85b6826c8496d&lang=pt_br`;
    fetchData();
}

function onSucess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=8368c3dab3e546d410c85b6826c8496d&lang=pt_br`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}
function fetchData(){
    infoTxt.innerText = "Captando a detalhes da previsão...";
    infoTxt.classList.add("pending");
    fetch(api)
        .then((res) => res.json())
        .then((result) => weatherDetails(result))
        .catch(() => {
            infoTxt.innerText = "Algo deu errado";
            infoTxt.classList.replace("pending", "error");
        });
}


function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} não foi encontrado`
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description , id} = info.weather[0];
        const { temp, feels_like, humidity} = info.main;
        
        if(id == 800){
            wIcon.src = "imagens/limpo.jpg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "imagens/tempestade.jpg";
        }else if(id >= 600 && id <= 622){
            wIcon.src = "imagens/neve.jpg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "imagens/sereno.jpg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "imagens/nuvens.jpg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "imagens/chuva.jpg";
        }

        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city},${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending","error");
        infoTxt.innerText = "";
        inputField.innerText = "";
        wrapper.classList.add("active");

    }
}


arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});
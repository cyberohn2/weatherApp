let hasLoadedData = window.localStorage.getItem('hasLoadedData')
const locationInput = document.querySelector('#location-input')
const searchBtn = document.querySelector('#search-btn')
const errMsg = document.querySelector('#err-msg')
const weatherConditon = document.querySelector('#weather-condition')
const weatherInfo = document.querySelector('#weather-info')
const weatherIcon = document.querySelector('#weather-icon')
window.addEventListener('load', () =>{
    if (hasLoadedData == 'true') {
        //get users weather info from localStorage
        let userData = JSON.parse(window.localStorage.getItem('loadedData'))
        updateWeather(userData)
    } else {
    getData('https://api.ipify.org?format=json')
    .then( data => {
        getData(`http://api.weatherstack.com/current?access_key=ea068a6c805bcfad36d3ad3db0467165&query=${data.ip}`)
        .then( data => {
            updateWeather(data)
        })
    } )
    .catch(err => console.log(err.message) )
    }
})

searchBtn.addEventListener('click', (e) =>{
    e.preventDefault()
    if (locationInput.value == '') {
        locationInput.classList.add('border-red-500')
    }else{
        locationInput.classList.remove('border-red-500')
        getData(`http://api.weatherstack.com/current?access_key=ea068a6c805bcfad36d3ad3db0467165&query=${locationInput.value}`)
        .then( data =>{
            if (data.success == false) {
                errMsg.innerHTML = "Couldn't get city's data"
            } else {
                errMsg.innerHTML = ""
            updateWeather(data)
            window.localStorage.setItem('hasLoadedData', 'true')
            window.localStorage.setItem('loadedData', JSON.stringify(data))
            }
        })
    }
})

const getData = async (api) =>{
    const response = await fetch(api)
    if(response.status !== 200){
        throw new Error('cannot get user ip')
    }
    const data = await response.json()
    return data;
}

function updateWeather(weatherData) {
    weatherConditon.innerHTML = 
        `<div id="weather-condition" class="text-5xl">
        <p id="temp">${weatherData.current.temperature}°</p>
        <p id="condition" class="my-3">${weatherData.current.weather_descriptions[0]}</p>
        <p class="text-xl text-gray-500 font-medium">${weatherData.location.name}, ${weatherData.location.country}</p>
        </div>`
    weatherInfo.innerHTML = 
        `<p id="wind">Wind-Speed: ${weatherData.current.wind_speed}m/s</p>
        <p id="humidity">Humidity: ${weatherData.current.humidity}</p>`
    weatherIcon.setAttribute('src',weatherData.current.weather_icons[0])
    document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${weatherData.current.weather_descriptions[0]}')`
    }
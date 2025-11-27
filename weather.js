// https://geocoding-api.open-meteo.com/v1/search?name=Berlin
// https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41
let results = document.getElementById('result')
let city = document.getElementById('cityinput')
let btn = document.getElementById('btn')
let heading = document.getElementById('weather')
let body =  document.getElementsByTagName('body')[0];
let logo = document.getElementById('logo')
let lat;
let long;
let temp;
let time;
let country;
let state;
let date;
let humidty;
let maxtemp;
let mintemp;
let uv;
let weather;
let code;
let gif;
let climateicon;
let raining = [];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",""];
const weathercondition = ['Clear', 'Mist', 'Drizzle', 'Sandstorm', 'Fog', 'Drizzle', 'Rain', 'Snowfall', 'Heavy Rain', 'Storm Rain','Cloudy']
const weathericon = ['anime/clear.gif','anime/mist.gif','anime/drizzle.gif','anime/sand.gif','anime/fog.gif','anime/drizzle1.gif','anime/inter.gif','anime/snow.gif','anime/rain.gif','anime/storm.gif','anime/cloudy.gif']
const back = ['alto/1.jpg','alto/7.jpg','alto/9.jpg','alto/10.jpg','alto/11.jpg','alto/12.png','alto/13.jpg','alto/14.jpg','alto/15.jpg','alto/16.jpg','alto/17.jpg','alto/18.jpg','alto/19.jpg','alto/20.jpg','alto/21.jpg','alto/22.jpg','alto/23.jpg','alto/24.jpg']
function getloc() {
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city.value}`)
        .then((res) => res.json())
        .then((data) => {
            lat = data.results[0].latitude
            long = data.results[0].longitude
            country = data.results[0].country
            state = data.results[0].admin1
            timezone = data.results[0].timezone
            if (lat) {
                logo.classList.remove('fa-search')
                logo.classList.add('fa-solid','fa-cog','fa-spin')  
            }
            getweather();
        })
}
function getweather() {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,sunrise,temperature_2m_max,temperature_2m_min,sunset,daylight_duration,sunshine_duration,uv_index_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&models=best_match&current=temperature_2m,relative_humidity_2m,is_day,apparent_temperature,rain,showers,snowfall,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m`)
        .then((res)=>res.json())
        .then((data) => {
            temp = data.current.temperature_2m;
            humidty = data.current.relative_humidity_2m;
            time = data.current.time;
            let a = time.toString();
            time = a.slice(11,16)
            date = new Date(a.slice(0, 10));
            date = days[date.getDay()];
            wind = data.current.wind_speed_10m;
            maxtemp = Math.round(data.daily.temperature_2m_max[0]);
            mintemp = Math.round(data.daily.temperature_2m_min[0]);
            uv = Math.round(data.daily.uv_index_max[0]);
            code = data.daily.weather_code[0];
            code = Math.floor(code / 10);
            raining[0] = data.current.rain;
            raining[1] = data.current.showers;
            raining[2] = data.current.snowfall;
            if (weathercondition[code] == 'Rain' || weathercondition[code] == 'Intermediate Rain' || weathercondition[code] == 'Heavy Rain' && raining[0] == 0 && raining[1] == 0 ) {
                weather = weathercondition[10];
            } else if (weathercondition[code] == 'Snowfall'&&raining[2]==0) {
                weather = weathercondition[10];
            }else {
            weather = weathercondition[code]
            }
            setTimeout(() => {
                logo.classList.remove('fa-cog','fa-spin')
                logo.classList.add('fa-check')
                setTimeout(display, 200);
            },600)
    })
}
function icons() {
    if (weathercondition[code] == 'Rain' || weathercondition[code] == 'Intermediate Rain' || weathercondition[code] == 'Heavy Rain' && raining[0] == 0 && raining[1] == 0 ) {
        climateicon = `${weathericon[10]}`
    } else if (weathercondition[code] == 'Snowfall'&&raining[2]==0) {
        climateicon = `${weathericon[10]}`
    }else {
        climateicon = `${weathericon[code]}`
    }
    let len = (back.length)-1;
        let rand = Math.floor(Math.random() * len)
    body.style.backgroundImage = `url(${back[rand]})`;
}
function checkhead(iscountry) {
    let statelen;
    let countrylen;
    if (!iscountry) {
        if (state !== null) {
            statelen = (state.length) + (city.value.length)
            if (statelen > 15) {
                days[7] = 'smallerloc'
            }
        } else {
            return;
        }
    } else {
        if (country !== null) {
            countrylen = (country.length) + (city.value.length)
            if (countrylen > 15) {
                days[7] = 'smallerloc'
            }
        } else {
            return;
        }
    }
}

function display() {
    heading.classList.remove('weather')
    heading.classList.add('show')
    city.classList.add('disable')
    btn.classList.add('disable')
    results.classList.remove('disable')
    let iscountry = false;
    icons()
    let coma = ','
    let disable ='';
    if (state == null) {
        state = ''
        coma = ''
    }
    let a = city.value.toUpperCase();
    let b = state.toUpperCase();
    if (a == b) {
        state = country  
        iscountry = true;
    }
    checkhead(iscountry)
    if (temp > 28) {
        gif = 'anime/hot.gif'
    } else if (temp < 16) {
        gif = 'anime/cold.gif'
    } else {
    disable = 'disable'
        gif = 'anime/hot.gif'
    }
    heading.style.cursor = 'pointer'
    results.innerHTML = `
    <div class = 'card'>
    <div class = 'left'>
    <div class = 'loc ${days[7]}'>${city.value}${coma} ${state}</div>
    <h2 class='temper'>${temp}&deg;C<img src="${gif}" class = "hot ${disable}">
    </h2>
    <h4 class='date'>${date} | ${time}</h4>
    <img src="${climateicon}" class ="icons">
    </div>
    <div class = "right">
    <h3>weather : ${weather}</h3>
    <h3>max temp : ${maxtemp}&deg;C</h3>
    <h3>min temp : ${mintemp}&deg;C</h3>
    <h3>humidity : ${humidty}%</h3>
    <h3>wind speed : ${wind} Km/h </h3>
    <h3>Uv index : ${uv}</h3>
    </div>
    </div>

    `
    heading.addEventListener('click',resetall)
}

function resetall() {
    heading.style.cursor = 'text'
    heading.classList.add('weather')
    heading.classList.remove('show')
    results.classList.add('disable')
    city.classList.remove('disable')
    btn.classList.remove('disable')
    city.value = ''
    body.style.backgroundImage = ``;
    logo.classList.add('fa-search')
    logo.classList.remove('fa-check')  
    days[7]=""
}
btn.addEventListener('click', getloc)
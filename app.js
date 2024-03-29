// 1. in the html structure, create a form consisting of an input and a button, the input should have the placeholder "enter a city name ..."
// 2. bind an event listener to the form submit (call your function submitForm())
// 3. make sure you prevent the default browser behavior of the form
// 3. submitForm should get the text value the user entered into the input and send a request to obtain the weather data for that city
// 4. create a div container identified as "output"
// 5. continue with the render() function in such a way that it will find this container and render the temperature value and the air humidity, also the wind speed (use wrapping elements at your will) 
// 6. try to make use of "deep destructuring" while you "extract" data from the response
// 7. don't forget to display a corresponding message in the case the server didn't give the weather data

const form = document.querySelector('#form');
const input = document.querySelector('input');
const div = document.querySelector('#output');

const cityNameInputed = () => {
    const city = input.value;
    let cityName;

    if (city.trim().toLowerCase() !== "") {
        const cityName = city.trim().toLowerCase();
        return cityName;

    } else {
        console.log(`${city} is not a valid city name!`);
        return undefined;
    }

}

const saveDataToCache = (key, data) => {
    data.date = new Date();

    localStorage.setItem(key, JSON.stringify(data));
}

const loadDataFromCache = () => {
    return JSON.parse(localStorage.getItem('data'))
}

const checkDataCache = (key) => {
    return localStorage.getItem(key);

}

const getCityNameFromCache = () => {
    const { name: cityName } = loadDataFromCache();
    console.log(cityName);
    return cityName;
}

const checkCityName = () => {
    const cityNameCache = getCityNameFromCache();
    const cityNameInputed = cityNameInputed();
    if (cityNameCache === cityNameInputed) {
        return true;
    }
}

const checkDateOfCachedData = (data) => {
    const cashData = JSON.parse(localStorage.getItem(data));

    console.log(cashData);
    const { date: dateFromCache } = cashData;
    const cacheDate = new Date(dateFromCache).getTime();
    const nowDate = new Date().getTime();
    console.log(cacheDate, nowDate);
    if (Math.abs(cacheDate - nowDate) >= (1000 * 60 * 60)) {
        return -1;
    } else {
        return 0;
    }
}

const load = (cb) => {
    //1. check the cache
    if (checkDataCache('data') && checkDateOfCachedData('data') === 0 && checkCityName === true) {
        // 2. take from cache
        console.log(checkDateOfCachedData('data'));
        data = loadDataFromCache('data');
        console.log(data);
        cb(data);

    } else {
        // 3. take from API

        loadDataFromAPI((data) => {
            console.log(data);
            saveDataToCache("data", data);
            cb(data);
        })
    }
}

const render = (data) => {
    console.log(data);
    const { main: { temp }, name: cityName } = data;

    console.log(temp);
    div.innerHTML = `<p>The temperature in ${cityName} at the moment is <strong>${Math.round(temp)} C</strong><p>`;
}

function loadDataFromAPI(cb) {


    let xhr = new XMLHttpRequest();
    const apiKey = `3cf84b8c25e74a840e93ed93926eb80f`;
    if (cityNameInputed() !== undefined) {
        console.log(cityNameInputed());
        xhr.open(
            'GET',
            `http://api.openweathermap.org/geo/1.0/direct?q=${cityNameInputed()}&appid=${apiKey}`);

        xhr.send();
        xhr.onload = () => {
            let data = JSON.parse(xhr.responseText);
            console.log(data);
            if (data !== []) {
                const [{ lat, lon }] = data;

                console.log(lon, lat)
                xhr.open(
                    'GET',
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
                )
                xhr.send();
                xhr.onload = () => {
                    let data = JSON.parse(xhr.responseText);
                    cb(data);

                }
            } else {
                div.textContent = `Sorry there were no results found for your city!`
            }
        }

    } else {
        div.textContent = `Please enter a valid city name!!`
    }

}


form.addEventListener('submit', (e) => {
    e.preventDefault();
});

form.addEventListener('submit', () => {
    load(render);
});





/**
 * Created by rafael on 15/02/17.
 */
$(()=> {

    // WARNING: getCurrentPosition() and watchPosition() no longer work on insecure origins.
    // To use this feature, it is necessary to switch the application to a secure origin, such as HTTPS.
    // On the other hand, though I serve my application through HTTPS, the free plan
    // on OpenWeatherMap doesn't provide ssl, because of that it is impossible get the device's location
    // on a mobile phone and this program doesn't work.

    class WeatherApp {

        constructor(callback) {
            this.lat = 0;
            this.lon = 0;
            this.location = '';
            this.weather = '';
            this.weatherCode = 0;
            this.weatherDescription = '';
            this.weatherTempActive = 'C';
            this.weatherTempK = 0;
            this.weatherTempC = 0;
            this.weatherTempF = 0;

            this.apiId = '38be1e36805f729eccd0ebc9fcafa83d';

            navigator.geolocation.watchPosition(
                (data) => {
                    this.lat = data.coords.latitude;
                    this.lon = data.coords.longitude;
                    this.uri = `http://api.openweathermap.org/data/2.5/weather` +
                        `?appid=${this.apiId}&lat=${this.lat}&lon=${this.lon}`;

                    this.getWeather(callback);
                },
                null,
                {
                    enableHighAccuracy: true,
                    maximumAge: 5000
                }
            );
        };

        getWeather(callback) {
            $.getJSON(this.uri, {}).done((data) => {
                this.location = data.name + ', ' + data.sys.country;
                this.weather = data.weather[0].main;
                this.weatherCode = data.weather[0].id;
                this.weatherDescription = data.weather[0].description;
                this.weatherTempK = Math.round((data.main.temp + 0.00001) * 100) / 100;
                this.weatherTempC = Math.round(data.main.temp - 273.15);
                this.weatherTempF = Math.round(((data.main.temp * (9 / 5) - 459.67) + 0.00001) * 100) / 100;
                callback(this);
            });
        };

    }

    const assignData = (app) => {
        $('#weather-icon').addClass('wi wi-owm-' + app.weatherCode);
        $('#location').html(app.location);
        $('#weather').html(app.weatherDescription);
        $('.weather-temp-number').text(app.weatherTempC);
        $('.weather-temp-type').text(' ºC');
    };

    const changeWeatherUnit = (app) => {

        switch (app.weatherTempActive) {
            case 'K':
                app.weatherTempActive = 'C';
                break;
            case 'C':
                app.weatherTempActive = 'F';
                break;
            case 'F':
                app.weatherTempActive = 'K';
                break;
        }

        $('.weather-temp-number').text(app['weatherTemp' + app.weatherTempActive]);
        $('.weather-temp-type').text(' º' + app.weatherTempActive);
    };

    const app = new WeatherApp(assignData);
    $('.weather-temp-type').on('click', () => changeWeatherUnit(app));

});

/**
 * Created by rafael on 15/02/17.
 */
import WeatherApp from './WeatherApp';

$(()=> {

    const assignData = (app) => {
        $('#weather-icon').addClass('wi wi-yahoo-' + app.weatherCode);
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

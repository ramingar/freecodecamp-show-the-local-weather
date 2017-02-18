/**
 * Created by rafael on 17/02/17.
 */
export default class WeatherApp {

    constructor(callback) {
        this.lat = 0;
        this.lon = 0;
        this.location = '';
        this.weatherCode = 0;
        this.weatherDescription = '';
        this.weatherTempActive = 'C';
        this.weatherTempK = 0;
        this.weatherTempC = 0;
        this.weatherTempF = 0;

        this.getLocation(() => {
            this.yahooWeatherUri = `https://query.yahooapis.com/v1/public/yql?` +
                `q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20` +
                `(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D%22(${this.lat},${this.lon})%22)` +
                `&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;

            this.getWeather(callback);
        });


    };

    getLocation(callback) {
        navigator.geolocation.getCurrentPosition((data) => {
            this.lat = data.coords.latitude;
            this.lon = data.coords.longitude;
            callback();
        });
    };

    getWeather(callback) {
        $.getJSON(this.yahooWeatherUri, {}).done((data) => {
            this.location = data.query.results.channel.location.city + ', ' +
                data.query.results.channel.location.country;
            this.weatherCode = data.query.results.channel.item.condition.code;
            this.weatherDescription = data.query.results.channel.item.condition.text;
            this.weatherTempF = parseInt(data.query.results.channel.item.condition.temp);
            this.weatherTempK = Math.round((this.weatherTempF + 459.67) * 5 / 9);
            this.weatherTempC = Math.round(this.weatherTempK - 273.15);
            callback(this);
        });
    };

}

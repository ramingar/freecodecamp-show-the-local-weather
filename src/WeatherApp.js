/**
 * Created by rafael on 17/02/17.
 */
export default class WeatherApp {

    constructor(callback) {
        this.getData(callback);
    };

    initialize() {
        this.lat = 0;
        this.lon = 0;
        this.location = '';
        this.weatherCode = -1;
        this.weatherDescription = '';
        this.weatherTempActive = 'C';
        this.weatherTempK = 0;
        this.weatherTempC = 0;
        this.weatherTempF = 0;
        this.networkError = -1;
    }

    getData(callback) {
        this.initialize();

        this.getLocation(() => {
            this.yahooWeatherUri = `https://query.yahooapis.com/v1/public/yql?` +
                `q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20` +
                `(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D%22(${this.lat},${this.lon})%22)` +
                `&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;

            this.getWeather(callback);
        });
    }

    getLocation(callback) {
        navigator.geolocation.getCurrentPosition((data) => {
            this.lat = Math.round(data.coords.latitude * 100) / 100;
            this.lon = Math.round(data.coords.longitude * 100) / 100;
            callback();
        });
    };

    getWeather(callback) {

        let cacheDataReceived = false;

        const assignData = (data) => {
            this.location = data.query.results.channel.location.city + ', ' +
                data.query.results.channel.location.country;
            this.weatherCode = data.query.results.channel.item.condition.code;
            this.weatherDescription = data.query.results.channel.item.condition.text;
            this.weatherTempF = parseInt(data.query.results.channel.item.condition.temp);
            this.weatherTempK = Math.round((this.weatherTempF + 459.67) * 5 / 9);
            this.weatherTempC = Math.round(this.weatherTempK - 273.15);
        };

        // fetch fresh data
        const networkUpdate = () => {
            return new Promise((resolve, reject) => {
                $.getJSON(this.yahooWeatherUri, {}).done((data) => {
                    resolve(data);
                }).fail((data) => {
                    this.networkError = data.readyState;  // 0 == No internet connection
                    reject(data);
                });
            });
        };

        // fetch cached data
        // network == true  || cache == true   => network
        // network == true  || cache == false  => network
        // network == false || cache == true   => cache   (don't do anything (app displayed cached data before))
        // network == false || cache == false  => network (message: 'no internet connection')
        const promise = caches.match(this.yahooWeatherUri).then((data) => {
            if (!data) throw new Error("No data");
            return data.json();
        }).then((data) => {
            assignData(data);
            callback(this);
            cacheDataReceived = true;
            return networkUpdate();
        }, () => {
            return networkUpdate();
        }).then((data) => {
            assignData(data);
            callback(this);
        }, () => {
            if (!cacheDataReceived) {
                // no network connection and geolocation is different than cached geolocation
                switch (this.networkError) {
                    case 0:
                        this.location = 'No internet connection';
                        break;
                }
                callback(this);
            }
        });
    };

}
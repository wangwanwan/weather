//index.js
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

const UNPROMPTED = 0;
const UNAUTHORIZED = 1;
const AUTHORIZED = 2;

const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBg: '',
    hourlyWeather: [],
    todayTemp: '',
    todayDate: '',
    city: '广州市',
    locationAuthType: UNPROMPTED
  },

  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city
      },
      success: res => {
        let result = res.data.result;
        this.setNow(result);
        this.setHourlyWeather(result);
        this.setToday(result);    
      },
      complete: () => {
        callback && callback();
      }
    })
  },
  setNow(result) {
    let temp = result.now.temp;
    let weather = result.now.weather;
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBg: '/images/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather]
    })
  },
  setHourlyWeather(result) {
    let hourlyWeather = [];
    let forecast = result.forecast;
    let nowHour = new Date().getHours();
    for (let i = 0; i < 8; i++) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + '时',
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }
    hourlyWeather[0].time = '现在';
    this.setData({ hourlyWeather })
  },
  setToday(result) {
    let date = new Date();
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },
  onLoad() {
    //高德天气API
    // wx.request({
    //   url: 'https://restapi.amap.com/v3/weather/weatherInfo',
    //   data: {
    //     key: '06c557e11ad6add4d87a9418eac6cc03',
    //     city:'310115'
    //   },
    //   success: res => {
    //     console.log(res.data);
    //   }      
    // })

    this.qqmapsdk = new QQMapWX({
      key: 'MFQBZ-UMDLD-CFP4V-P342H-UA5C2-CXF6K'
    });
    wx.getSetting({
      success: res => {
        let auth = res.authSetting['scope.userLocation'];
        console.log(auth);
        this.setData({
          locationAuthType: auth ? AUTHORIZED : (auth == false) ? UNAUTHORIZED : UNPROMPTED
        })

        if (auth)
          this.getCityAndWeather()
        else
          this.getNow()
        console.log(auth);
      }
    })
    this.getNow();
  },

  onPullDownRefresh() {
    this.getNow(
      wx.stopPullDownRefresh()
    );
    console.log('hahahaha22')
  },
  dayTapWeather() {
    wx.navigateTo({
      url: '/pages/list/list?city=' + this.data.city,
    })
  },
  onTapLocation() {
    this.getCityAndWeather();
  },

  getCityAndWeather() {
    wx.getLocation({
      success: res => {
        console.log(res.latitude, res.longitude)
        this.setData({
          locationAuthType: AUTHORIZED
        })
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            let city = res.result.address_component.city
            console.log(city)
            this.setData({
              city: city
            })
          }
        });
        this.getNow();
      },
      fail: () => {
        this.setData({
          locationAuthType: UNAUTHORIZED
        })
        console.log('fail')
      }
    })
  }
})

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
Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBg: ''
  },
  onLoad() {
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

    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '上海市'
      },
      success: res => {
        let result = res.data.result;
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
        console.log(temp, weather);
      }
    })
  },

  onPullDownRefresh() {
    console.log('hahahaha')
  }
})

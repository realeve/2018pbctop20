let isMobile = () => {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i) ||
    navigator.userAgent.match(/MicroMessenger/i)
  ) {
    return true;
  } else {
    return false;
  }
};

const state = {
  isLoading: false,
  userInfo: {},
  cdnUrl: "http://cbpc540.applinzi.com/index.php",
  tips: "",
  isDebug: process.env.NODE_ENV !== "production",
  isPC: !isMobile(),
  sport: {
    // encodeURI('2017年行业"十件大事"').replace(/%/g,'')
    salt: "2017E5B9B4E8A18CE4B89A22E58D81E4BBB6E5A4A7E4BA8B22",
    id: 2,
    isLogin: true,
    name: "中国人民银行“改革开放40周年货币金银大事”",
    maxTickets: 20,
    allTickets: 40,
    loadWXInfo: true,
    startDate: "2018-06-16",
    endDate: "2018-06-22"
  }
};

export default state;

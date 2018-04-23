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
        id: 1,
        isLogin: true,
        name: '2017年中国印钞造币行业"十件大事"',
        maxTickets: 10,
        allTickets: 15,
        timeRange: "1月19日至24日",
        loadWXInfo: true,
        endDate: '2018-01-24'
    }
};

export default state;
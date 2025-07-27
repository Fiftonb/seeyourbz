/**
 * 中国城市经纬度数据
 * 按省级行政区分类，包含全国主要地级市
 */

export interface CityInfo {
  name: string
  longitude: number
  latitude: number
}

export interface ProvinceInfo {
  name: string
  code: string
  cities: CityInfo[]
}

export const CHINA_PROVINCES: ProvinceInfo[] = [
  // 直辖市
  {
    name: '北京市',
    code: 'BJ',
    cities: [
      { name: '北京市', longitude: 116.4074, latitude: 39.9042 }
    ]
  },
  {
    name: '天津市',
    code: 'TJ',
    cities: [
      { name: '天津市', longitude: 117.1901, latitude: 39.1034 }
    ]
  },
  {
    name: '上海市',
    code: 'SH',
    cities: [
      { name: '上海市', longitude: 121.4737, latitude: 31.2304 }
    ]
  },
  {
    name: '重庆市',
    code: 'CQ',
    cities: [
      { name: '重庆市', longitude: 106.5108, latitude: 29.5630 }
    ]
  },
  
  // 省份
  {
    name: '河北省',
    code: 'HE',
    cities: [
      { name: '石家庄市', longitude: 114.5149, latitude: 38.0428 },
      { name: '唐山市', longitude: 118.1758, latitude: 39.6351 },
      { name: '秦皇岛市', longitude: 119.5881, latitude: 39.9319 },
      { name: '邯郸市', longitude: 114.4775, latitude: 36.6125 },
      { name: '邢台市', longitude: 114.5086, latitude: 37.0682 },
      { name: '保定市', longitude: 115.4648, latitude: 38.8951 },
      { name: '张家口市', longitude: 114.8794, latitude: 40.8117 },
      { name: '承德市', longitude: 117.9635, latitude: 40.9739 },
      { name: '沧州市', longitude: 116.8387, latitude: 38.2976 },
      { name: '廊坊市', longitude: 116.7030, latitude: 39.5237 },
      { name: '衡水市', longitude: 115.6656, latitude: 37.7161 }
    ]
  },
  {
    name: '山西省',
    code: 'SX',
    cities: [
      { name: '太原市', longitude: 112.5489, latitude: 37.8706 },
      { name: '大同市', longitude: 113.2944, latitude: 40.0931 },
      { name: '阳泉市', longitude: 113.5834, latitude: 37.8695 },
      { name: '长治市', longitude: 113.1163, latitude: 36.1915 },
      { name: '晋城市', longitude: 112.8513, latitude: 35.4901 },
      { name: '朔州市', longitude: 112.4333, latitude: 39.3313 },
      { name: '晋中市', longitude: 112.7537, latitude: 37.6965 },
      { name: '运城市', longitude: 111.0237, latitude: 35.0228 },
      { name: '忻州市', longitude: 112.7340, latitude: 38.4161 },
      { name: '临汾市', longitude: 111.5183, latitude: 36.0881 },
      { name: '吕梁市', longitude: 111.1440, latitude: 37.5177 }
    ]
  },
  {
    name: '内蒙古自治区',
    code: 'NM',
    cities: [
      { name: '呼和浩特市', longitude: 111.7519, latitude: 40.8424 },
      { name: '包头市', longitude: 109.9402, latitude: 40.6581 },
      { name: '乌海市', longitude: 106.8254, latitude: 39.6738 },
      { name: '赤峰市', longitude: 118.8869, latitude: 42.2578 },
      { name: '通辽市', longitude: 122.2650, latitude: 43.6174 },
      { name: '鄂尔多斯市', longitude: 109.7817, latitude: 39.6085 },
      { name: '呼伦贝尔市', longitude: 119.7584, latitude: 49.2115 },
      { name: '巴彦淖尔市', longitude: 107.4167, latitude: 40.7574 },
      { name: '乌兰察布市', longitude: 113.1322, latitude: 41.0341 },
      { name: '兴安盟', longitude: 122.0706, latitude: 46.0763 },
      { name: '锡林郭勒盟', longitude: 116.0907, latitude: 43.9442 },
      { name: '阿拉善盟', longitude: 105.7286, latitude: 38.8516 }
    ]
  },
  {
    name: '辽宁省',
    code: 'LN',
    cities: [
      { name: '沈阳市', longitude: 123.4315, latitude: 41.8057 },
      { name: '大连市', longitude: 121.6147, latitude: 38.9140 },
      { name: '鞍山市', longitude: 122.9951, latitude: 41.1106 },
      { name: '抚顺市', longitude: 123.9574, latitude: 41.8654 },
      { name: '本溪市', longitude: 123.7706, latitude: 41.2914 },
      { name: '丹东市', longitude: 124.3832, latitude: 40.1244 },
      { name: '锦州市', longitude: 121.1353, latitude: 41.1192 },
      { name: '营口市', longitude: 122.2352, latitude: 40.6674 },
      { name: '阜新市', longitude: 121.6706, latitude: 42.0118 },
      { name: '辽阳市', longitude: 123.1823, latitude: 41.2694 },
      { name: '盘锦市', longitude: 122.0709, latitude: 41.1245 },
      { name: '铁岭市', longitude: 123.8441, latitude: 42.2230 },
      { name: '朝阳市', longitude: 120.4517, latitude: 41.5718 },
      { name: '葫芦岛市', longitude: 120.8560, latitude: 40.7430 }
    ]
  },
  {
    name: '吉林省',
    code: 'JL',
    cities: [
      { name: '长春市', longitude: 125.3235, latitude: 43.8171 },
      { name: '吉林市', longitude: 126.5500, latitude: 43.8436 },
      { name: '四平市', longitude: 124.3707, latitude: 43.1703 },
      { name: '辽源市', longitude: 125.1359, latitude: 42.9027 },
      { name: '通化市', longitude: 125.9363, latitude: 41.7285 },
      { name: '白山市', longitude: 126.4230, latitude: 41.9428 },
      { name: '松原市', longitude: 124.8259, latitude: 45.1182 },
      { name: '白城市', longitude: 122.8397, latitude: 45.6196 },
      { name: '延边朝鲜族自治州', longitude: 129.5135, latitude: 42.9048 }
    ]
  },
  {
    name: '黑龙江省',
    code: 'HL',
    cities: [
      { name: '哈尔滨市', longitude: 126.5358, latitude: 45.8018 },
      { name: '齐齐哈尔市', longitude: 123.9571, latitude: 47.3543 },
      { name: '鸡西市', longitude: 130.9750, latitude: 45.3006 },
      { name: '鹤岗市', longitude: 130.2772, latitude: 47.3380 },
      { name: '双鸭山市', longitude: 131.1572, latitude: 46.6434 },
      { name: '大庆市', longitude: 125.1031, latitude: 46.5907 },
      { name: '伊春市', longitude: 128.8999, latitude: 47.7248 },
      { name: '佳木斯市', longitude: 130.3619, latitude: 46.8099 },
      { name: '七台河市', longitude: 131.0158, latitude: 45.7712 },
      { name: '牡丹江市', longitude: 129.6333, latitude: 44.5833 },
      { name: '黑河市', longitude: 127.4990, latitude: 50.2496 },
      { name: '绥化市', longitude: 126.9929, latitude: 46.6374 },
      { name: '大兴安岭地区', longitude: 124.1116, latitude: 52.3353 }
    ]
  },
  {
    name: '江苏省',
    code: 'JS',
    cities: [
      { name: '南京市', longitude: 118.7969, latitude: 32.0603 },
      { name: '无锡市', longitude: 120.3019, latitude: 31.5804 },
      { name: '徐州市', longitude: 117.1851, latitude: 34.2618 },
      { name: '常州市', longitude: 119.9463, latitude: 31.7720 },
      { name: '苏州市', longitude: 120.6191, latitude: 31.2990 },
      { name: '南通市', longitude: 120.8644, latitude: 32.0116 },
      { name: '连云港市', longitude: 119.1788, latitude: 34.5996 },
      { name: '淮安市', longitude: 119.0153, latitude: 33.5975 },
      { name: '盐城市', longitude: 120.1398, latitude: 33.3776 },
      { name: '扬州市', longitude: 119.4215, latitude: 32.3932 },
      { name: '镇江市', longitude: 119.4525, latitude: 32.2044 },
      { name: '泰州市', longitude: 119.9153, latitude: 32.4849 },
      { name: '宿迁市', longitude: 118.3013, latitude: 33.9630 }
    ]
  },
  {
    name: '浙江省',
    code: 'ZJ',
    cities: [
      { name: '杭州市', longitude: 120.1614, latitude: 30.2936 },
      { name: '宁波市', longitude: 121.5440, latitude: 29.8683 },
      { name: '温州市', longitude: 120.6994, latitude: 27.9944 },
      { name: '嘉兴市', longitude: 120.7507, latitude: 30.7461 },
      { name: '湖州市', longitude: 120.0874, latitude: 30.8936 },
      { name: '绍兴市', longitude: 120.5820, latitude: 30.0023 },
      { name: '金华市', longitude: 119.6478, latitude: 29.0789 },
      { name: '衢州市', longitude: 118.8732, latitude: 28.9417 },
      { name: '舟山市', longitude: 122.2069, latitude: 29.9859 },
      { name: '台州市', longitude: 121.4204, latitude: 28.6568 },
      { name: '丽水市', longitude: 119.9212, latitude: 28.4676 }
    ]
  },
  {
    name: '安徽省',
    code: 'AH',
    cities: [
      { name: '合肥市', longitude: 117.2693, latitude: 31.8612 },
      { name: '芜湖市', longitude: 118.3762, latitude: 31.3262 },
      { name: '蚌埠市', longitude: 117.3638, latitude: 32.9165 },
      { name: '淮南市', longitude: 117.0187, latitude: 32.6476 },
      { name: '马鞍山市', longitude: 118.5077, latitude: 31.6893 },
      { name: '淮北市', longitude: 116.7947, latitude: 33.9717 },
      { name: '铜陵市', longitude: 117.8165, latitude: 30.9299 },
      { name: '安庆市', longitude: 117.0537, latitude: 30.5255 },
      { name: '黄山市', longitude: 118.3170, latitude: 29.7091 },
      { name: '滁州市', longitude: 118.3135, latitude: 32.3171 },
      { name: '阜阳市', longitude: 115.8197, latitude: 32.8969 },
      { name: '宿州市', longitude: 116.9583, latitude: 33.6341 },
      { name: '六安市', longitude: 116.5078, latitude: 31.7529 },
      { name: '亳州市', longitude: 115.7825, latitude: 33.8712 },
      { name: '池州市', longitude: 117.4893, latitude: 30.6566 },
      { name: '宣城市', longitude: 118.7576, latitude: 30.9457 }
    ]
  },
  {
    name: '福建省',
    code: 'FJ',
    cities: [
      { name: '福州市', longitude: 119.3063, latitude: 26.0745 },
      { name: '厦门市', longitude: 118.1689, latitude: 24.4797 },
      { name: '莆田市', longitude: 119.0077, latitude: 25.4312 },
      { name: '三明市', longitude: 117.6350, latitude: 26.2654 },
      { name: '泉州市', longitude: 118.5753, latitude: 24.8745 },
      { name: '漳州市', longitude: 117.6619, latitude: 24.5109 },
      { name: '南平市', longitude: 118.1782, latitude: 26.6354 },
      { name: '龙岩市', longitude: 117.0173, latitude: 25.0913 },
      { name: '宁德市', longitude: 119.5270, latitude: 26.6593 }
    ]
  },
  {
    name: '江西省',
    code: 'JX',
    cities: [
      { name: '南昌市', longitude: 115.8921, latitude: 28.6765 },
      { name: '景德镇市', longitude: 117.2145, latitude: 29.2927 },
      { name: '萍乡市', longitude: 113.8520, latitude: 27.6229 },
      { name: '九江市', longitude: 115.9929, latitude: 29.7198 },
      { name: '新余市', longitude: 114.9307, latitude: 27.8175 },
      { name: '鹰潭市', longitude: 117.0336, latitude: 28.2381 },
      { name: '赣州市', longitude: 114.9402, latitude: 25.8313 },
      { name: '吉安市', longitude: 114.9862, latitude: 27.1117 },
      { name: '宜春市', longitude: 114.3915, latitude: 27.8043 },
      { name: '抚州市', longitude: 116.3584, latitude: 27.9838 },
      { name: '上饶市', longitude: 117.9434, latitude: 28.4444 }
    ]
  },
  {
    name: '山东省',
    code: 'SD',
    cities: [
      { name: '济南市', longitude: 117.0009, latitude: 36.6758 },
      { name: '青岛市', longitude: 120.3826, latitude: 36.0671 },
      { name: '淄博市', longitude: 118.0474, latitude: 36.8135 },
      { name: '枣庄市', longitude: 117.5579, latitude: 34.8564 },
      { name: '东营市', longitude: 118.6745, latitude: 37.4613 },
      { name: '烟台市', longitude: 121.3914, latitude: 37.5367 },
      { name: '潍坊市', longitude: 119.1070, latitude: 36.7093 },
      { name: '济宁市', longitude: 116.5872, latitude: 35.4154 },
      { name: '泰安市', longitude: 117.1291, latitude: 36.1943 },
      { name: '威海市', longitude: 122.1162, latitude: 37.5127 },
      { name: '日照市', longitude: 119.4616, latitude: 35.4281 },
      { name: '临沂市', longitude: 118.3569, latitude: 35.1046 },
      { name: '德州市', longitude: 116.3073, latitude: 37.4538 },
      { name: '聊城市', longitude: 115.9851, latitude: 36.4562 },
      { name: '滨州市', longitude: 117.9708, latitude: 37.3835 },
      { name: '菏泽市', longitude: 115.4697, latitude: 35.2465 }
    ]
  },
  {
    name: '河南省',
    code: 'HA',
    cities: [
      { name: '郑州市', longitude: 113.6254, latitude: 34.7466 },
      { name: '开封市', longitude: 114.3414, latitude: 34.7971 },
      { name: '洛阳市', longitude: 112.4540, latitude: 34.7197 },
      { name: '平顶山市', longitude: 113.3073, latitude: 33.7453 },
      { name: '安阳市', longitude: 114.3925, latitude: 36.1034 },
      { name: '鹤壁市', longitude: 114.2951, latitude: 35.7480 },
      { name: '新乡市', longitude: 113.9268, latitude: 35.3026 },
      { name: '焦作市', longitude: 113.2417, latitude: 35.2158 },
      { name: '濮阳市', longitude: 115.0410, latitude: 35.7617 },
      { name: '许昌市', longitude: 113.8267, latitude: 34.0229 },
      { name: '漯河市', longitude: 114.0166, latitude: 33.5818 },
      { name: '三门峡市', longitude: 111.1945, latitude: 34.7773 },
      { name: '南阳市', longitude: 112.5407, latitude: 32.9999 },
      { name: '商丘市', longitude: 115.6504, latitude: 34.4378 },
      { name: '信阳市', longitude: 114.0752, latitude: 32.1234 },
      { name: '周口市', longitude: 114.6496, latitude: 33.6204 },
      { name: '驻马店市', longitude: 114.0229, latitude: 32.9802 }
    ]
  },
  {
    name: '湖北省',
    code: 'HB',
    cities: [
      { name: '武汉市', longitude: 114.2999, latitude: 30.5844 },
      { name: '黄石市', longitude: 115.0771, latitude: 30.2204 },
      { name: '十堰市', longitude: 110.7878, latitude: 32.6469 },
      { name: '宜昌市', longitude: 111.3090, latitude: 30.7318 },
      { name: '襄阳市', longitude: 112.1440, latitude: 32.0421 },
      { name: '鄂州市', longitude: 114.8965, latitude: 30.3968 },
      { name: '荆门市', longitude: 112.2044, latitude: 31.0354 },
      { name: '孝感市', longitude: 113.9269, latitude: 30.9264 },
      { name: '荆州市', longitude: 112.2380, latitude: 30.3273 },
      { name: '黄冈市', longitude: 114.8795, latitude: 30.4477 },
      { name: '咸宁市', longitude: 114.3222, latitude: 29.8326 },
      { name: '随州市', longitude: 113.3829, latitude: 31.7177 },
      { name: '恩施土家族苗族自治州', longitude: 109.4881, latitude: 30.2830 }
    ]
  },
  {
    name: '湖南省',
    code: 'HN',
    cities: [
      { name: '长沙市', longitude: 112.9388, latitude: 28.2282 },
      { name: '株洲市', longitude: 113.1518, latitude: 27.8274 },
      { name: '湘潭市', longitude: 112.9445, latitude: 27.8094 },
      { name: '衡阳市', longitude: 112.6072, latitude: 26.9007 },
      { name: '邵阳市', longitude: 111.4681, latitude: 27.2387 },
      { name: '岳阳市', longitude: 113.1287, latitude: 29.3570 },
      { name: '常德市', longitude: 111.6986, latitude: 29.0403 },
      { name: '张家界市', longitude: 110.4791, latitude: 29.1274 },
      { name: '益阳市', longitude: 112.3550, latitude: 28.5701 },
      { name: '郴州市', longitude: 113.0322, latitude: 25.7705 },
      { name: '永州市', longitude: 111.6088, latitude: 26.4204 },
      { name: '怀化市', longitude: 109.9783, latitude: 27.5509 },
      { name: '娄底市', longitude: 112.0085, latitude: 27.7281 },
      { name: '湘西土家族苗族自治州', longitude: 109.7397, latitude: 28.3115 }
    ]
  },
  {
    name: '广东省',
    code: 'GD',
    cities: [
      { name: '广州市', longitude: 113.2644, latitude: 23.1291 },
      { name: '韶关市', longitude: 113.5977, latitude: 24.8014 },
      { name: '深圳市', longitude: 114.0579, latitude: 22.5431 },
      { name: '珠海市', longitude: 113.5536, latitude: 22.2707 },
      { name: '汕头市', longitude: 116.6817, latitude: 23.3540 },
      { name: '佛山市', longitude: 113.1220, latitude: 23.0291 },
      { name: '江门市', longitude: 113.0946, latitude: 22.5901 },
      { name: '湛江市', longitude: 110.3646, latitude: 21.2707 },
      { name: '茂名市', longitude: 110.9194, latitude: 21.6597 },
      { name: '肇庆市', longitude: 112.4721, latitude: 23.0515 },
      { name: '惠州市', longitude: 114.4152, latitude: 23.0793 },
      { name: '梅州市', longitude: 116.1255, latitude: 24.2991 },
      { name: '汕尾市', longitude: 115.3648, latitude: 22.7746 },
      { name: '河源市', longitude: 114.6977, latitude: 23.7462 },
      { name: '阳江市', longitude: 111.9825, latitude: 21.8593 },
      { name: '清远市', longitude: 113.0516, latitude: 23.6817 },
      { name: '东莞市', longitude: 113.7464, latitude: 23.0201 },
      { name: '中山市', longitude: 113.3823, latitude: 22.5154 },
      { name: '潮州市', longitude: 116.6321, latitude: 23.6618 },
      { name: '揭阳市', longitude: 116.3557, latitude: 23.5493 },
      { name: '云浮市', longitude: 112.0446, latitude: 22.9154 }
    ]
  },
  {
    name: '广西壮族自治区',
    code: 'GX',
    cities: [
      { name: '南宁市', longitude: 108.3669, latitude: 22.8170 },
      { name: '柳州市', longitude: 109.4281, latitude: 24.3146 },
      { name: '桂林市', longitude: 110.2993, latitude: 25.2342 },
      { name: '梧州市', longitude: 111.2976, latitude: 23.4769 },
      { name: '北海市', longitude: 109.1191, latitude: 21.4733 },
      { name: '防城港市', longitude: 108.3541, latitude: 21.6146 },
      { name: '钦州市', longitude: 108.6544, latitude: 21.9574 },
      { name: '贵港市', longitude: 109.6007, latitude: 23.0936 },
      { name: '玉林市', longitude: 110.1542, latitude: 22.6314 },
      { name: '百色市', longitude: 106.6003, latitude: 23.8975 },
      { name: '贺州市', longitude: 111.5662, latitude: 24.4141 },
      { name: '河池市', longitude: 108.0628, latitude: 24.6969 },
      { name: '来宾市', longitude: 109.2287, latitude: 23.7338 },
      { name: '崇左市', longitude: 107.3531, latitude: 22.4041 }
    ]
  },
  {
    name: '海南省',
    code: 'HI',
    cities: [
      { name: '海口市', longitude: 110.3467, latitude: 20.0175 },
      { name: '三亚市', longitude: 109.5086, latitude: 18.2479 },
      { name: '三沙市', longitude: 112.3486, latitude: 16.8311 },
      { name: '儋州市', longitude: 109.5764, latitude: 19.5175 }
    ]
  },
  {
    name: '四川省',
    code: 'SC',
    cities: [
      { name: '成都市', longitude: 104.0665, latitude: 30.5728 },
      { name: '自贡市', longitude: 104.7794, latitude: 29.3528 },
      { name: '攀枝花市', longitude: 101.7183, latitude: 26.5805 },
      { name: '泸州市', longitude: 105.4433, latitude: 28.8719 },
      { name: '德阳市', longitude: 104.3987, latitude: 31.1270 },
      { name: '绵阳市', longitude: 104.6794, latitude: 31.4677 },
      { name: '广元市', longitude: 105.8430, latitude: 32.4336 },
      { name: '遂宁市', longitude: 105.5921, latitude: 30.5133 },
      { name: '内江市', longitude: 105.0581, latitude: 29.5802 },
      { name: '乐山市', longitude: 103.7614, latitude: 29.5522 },
      { name: '南充市', longitude: 106.0847, latitude: 30.7953 },
      { name: '眉山市', longitude: 103.8318, latitude: 30.0752 },
      { name: '宜宾市', longitude: 104.6308, latitude: 28.7602 },
      { name: '广安市', longitude: 106.6333, latitude: 30.4564 },
      { name: '达州市', longitude: 107.5023, latitude: 31.2090 },
      { name: '雅安市', longitude: 103.0010, latitude: 29.9877 },
      { name: '巴中市', longitude: 106.7537, latitude: 31.8691 },
      { name: '资阳市', longitude: 104.641, latitude: 30.1222 },
      { name: '阿坝藏族羌族自治州', longitude: 102.2211, latitude: 31.8998 },
      { name: '甘孜藏族自治州', longitude: 101.9636, latitude: 30.0507 },
      { name: '凉山彝族自治州', longitude: 102.2587, latitude: 27.8866 }
    ]
  },
  {
    name: '贵州省',
    code: 'GZ',
    cities: [
      { name: '贵阳市', longitude: 106.6302, latitude: 26.6477 },
      { name: '六盘水市', longitude: 104.8463, latitude: 26.5918 },
      { name: '遵义市', longitude: 106.9274, latitude: 27.7066 },
      { name: '安顺市', longitude: 105.9322, latitude: 26.2453 },
      { name: '毕节市', longitude: 105.2851, latitude: 27.3017 },
      { name: '铜仁市', longitude: 109.1915, latitude: 27.7183 },
      { name: '黔西南布依族苗族自治州', longitude: 104.9067, latitude: 25.0882 },
      { name: '黔东南苗族侗族自治州', longitude: 107.9772, latitude: 26.5834 },
      { name: '黔南布依族苗族自治州', longitude: 107.5172, latitude: 26.2582 }
    ]
  },
  {
    name: '云南省',
    code: 'YN',
    cities: [
      { name: '昆明市', longitude: 102.8329, latitude: 24.8801 },
      { name: '曲靖市', longitude: 103.7976, latitude: 25.5016 },
      { name: '玉溪市', longitude: 102.5437, latitude: 24.3520 },
      { name: '保山市', longitude: 99.1670, latitude: 25.1118 },
      { name: '昭通市', longitude: 103.7173, latitude: 27.3366 },
      { name: '丽江市', longitude: 100.2270, latitude: 26.8721 },
      { name: '普洱市', longitude: 100.9727, latitude: 22.7773 },
      { name: '临沧市', longitude: 100.0870, latitude: 23.8878 },
      { name: '楚雄彝族自治州', longitude: 101.5457, latitude: 25.0414 },
      { name: '红河哈尼族彝族自治州', longitude: 103.3943, latitude: 23.3668 },
      { name: '文山壮族苗族自治州', longitude: 104.2447, latitude: 23.4015 },
      { name: '西双版纳傣族自治州', longitude: 100.7971, latitude: 22.0017 },
      { name: '大理白族自治州', longitude: 100.2670, latitude: 25.6062 },
      { name: '德宏傣族景颇族自治州', longitude: 98.5784, latitude: 24.4367 },
      { name: '怒江傈僳族自治州', longitude: 98.8543, latitude: 25.8509 },
      { name: '迪庆藏族自治州', longitude: 99.7065, latitude: 27.8269 }
    ]
  },
  {
    name: '西藏自治区',
    code: 'XZ',
    cities: [
      { name: '拉萨市', longitude: 91.1409, latitude: 29.6456 },
      { name: '日喀则市', longitude: 88.8851, latitude: 29.2690 },
      { name: '昌都市', longitude: 97.1785, latitude: 31.1366 },
      { name: '林芝市', longitude: 94.3624, latitude: 29.6544 },
      { name: '山南市', longitude: 91.7665, latitude: 29.2363 },
      { name: '那曲市', longitude: 92.0602, latitude: 31.4760 },
      { name: '阿里地区', longitude: 80.1055, latitude: 32.5032 }
    ]
  },
  {
    name: '陕西省',
    code: 'SN',
    cities: [
      { name: '西安市', longitude: 108.9402, latitude: 34.3416 },
      { name: '铜川市', longitude: 108.9794, latitude: 34.8965 },
      { name: '宝鸡市', longitude: 107.1826, latitude: 34.3640 },
      { name: '咸阳市', longitude: 108.7094, latitude: 34.3299 },
      { name: '渭南市', longitude: 109.5028, latitude: 34.4994 },
      { name: '延安市', longitude: 109.4897, latitude: 36.5853 },
      { name: '汉中市', longitude: 107.0237, latitude: 33.0777 },
      { name: '榆林市', longitude: 109.7344, latitude: 38.2900 },
      { name: '安康市', longitude: 109.0293, latitude: 32.6901 },
      { name: '商洛市', longitude: 109.9400, latitude: 33.8739 }
    ]
  },
  {
    name: '甘肃省',
    code: 'GS',
    cities: [
      { name: '兰州市', longitude: 103.8236, latitude: 36.0581 },
      { name: '嘉峪关市', longitude: 98.2770, latitude: 39.7863 },
      { name: '金昌市', longitude: 102.1883, latitude: 38.5141 },
      { name: '白银市', longitude: 104.1383, latitude: 36.5448 },
      { name: '天水市', longitude: 105.7249, latitude: 34.5780 },
      { name: '武威市', longitude: 102.6381, latitude: 37.9289 },
      { name: '张掖市', longitude: 100.4505, latitude: 38.9248 },
      { name: '平凉市', longitude: 106.6650, latitude: 35.5428 },
      { name: '酒泉市', longitude: 98.5109, latitude: 39.7414 },
      { name: '庆阳市', longitude: 107.6430, latitude: 35.7342 },
      { name: '定西市', longitude: 104.6260, latitude: 35.5796 },
      { name: '陇南市', longitude: 104.9292, latitude: 33.3886 },
      { name: '临夏回族自治州', longitude: 103.2112, latitude: 35.5993 },
      { name: '甘南藏族自治州', longitude: 102.9109, latitude: 34.9864 }
    ]
  },
  {
    name: '青海省',
    code: 'QH',
    cities: [
      { name: '西宁市', longitude: 101.7782, latitude: 36.6171 },
      { name: '海东市', longitude: 102.1041, latitude: 36.5029 },
      { name: '海北藏族自治州', longitude: 100.9017, latitude: 36.9597 },
      { name: '黄南藏族自治州', longitude: 102.0076, latitude: 35.5177 },
      { name: '海南藏族自治州', longitude: 100.6197, latitude: 36.2804 },
      { name: '果洛藏族自治州', longitude: 100.2417, latitude: 34.4736 },
      { name: '玉树藏族自治州', longitude: 97.0089, latitude: 33.0040 },
      { name: '海西蒙古族藏族自治州', longitude: 97.3708, latitude: 37.3747 }
    ]
  },
  {
    name: '宁夏回族自治区',
    code: 'NX',
    cities: [
      { name: '银川市', longitude: 106.2309, latitude: 38.4872 },
      { name: '石嘴山市', longitude: 106.3768, latitude: 39.0135 },
      { name: '吴忠市', longitude: 106.1990, latitude: 37.9860 },
      { name: '固原市', longitude: 106.2853, latitude: 36.0040 },
      { name: '中卫市', longitude: 105.1896, latitude: 37.5149 }
    ]
  },
  {
    name: '新疆维吾尔自治区',
    code: 'XJ',
    cities: [
      { name: '乌鲁木齐市', longitude: 87.6168, latitude: 43.8256 },
      { name: '克拉玛依市', longitude: 84.8733, latitude: 45.5792 },
      { name: '吐鲁番市', longitude: 89.1841, latitude: 42.9476 },
      { name: '哈密市', longitude: 93.5156, latitude: 42.8330 },
      { name: '昌吉回族自治州', longitude: 87.3048, latitude: 44.0146 },
      { name: '博尔塔拉蒙古自治州', longitude: 82.0748, latitude: 44.9058 },
      { name: '巴音郭楞蒙古自治州', longitude: 86.1504, latitude: 41.7683 },
      { name: '阿克苏地区', longitude: 80.2651, latitude: 41.1717 },
      { name: '喀什地区', longitude: 75.9918, latitude: 39.4677 },
      { name: '和田地区', longitude: 79.9302, latitude: 37.1106 },
      { name: '伊犁哈萨克自治州', longitude: 81.3179, latitude: 43.9219 },
      { name: '塔城地区', longitude: 82.9857, latitude: 46.7464 },
      { name: '阿勒泰地区', longitude: 88.1396, latitude: 47.8484 }
    ]
  },
  // 特别行政区
  {
    name: '香港特别行政区',
    code: 'HK',
    cities: [
      { name: '香港', longitude: 114.1694, latitude: 22.3193 }
    ]
  },
  {
    name: '澳门特别行政区',
    code: 'MO',
    cities: [
      { name: '澳门', longitude: 113.5491, latitude: 22.1987 }
    ]
  },
  // 台湾省
  {
    name: '台湾省',
    code: 'TW',
    cities: [
      { name: '台北市', longitude: 121.5654, latitude: 25.0330 },
      { name: '新北市', longitude: 121.4627, latitude: 25.0121 },
      { name: '桃园市', longitude: 121.2168, latitude: 24.9936 },
      { name: '台中市', longitude: 120.6736, latitude: 24.1477 },
      { name: '台南市', longitude: 120.2513, latitude: 22.9999 },
      { name: '高雄市', longitude: 120.3014, latitude: 22.6273 },
      { name: '基隆市', longitude: 121.7081, latitude: 25.1279 },
      { name: '新竹市', longitude: 120.9647, latitude: 24.8067 },
      { name: '嘉义市', longitude: 120.4473, latitude: 23.4816 }
    ]
  }
]

// 按省份获取城市列表
export function getCitiesByProvince(provinceCode: string): CityInfo[] {
  const province = CHINA_PROVINCES.find(p => p.code === provinceCode)
  return province?.cities || []
}

// 根据城市名称获取坐标（支持重名城市，返回第一个匹配）
export function getCityCoordinates(cityName: string): { longitude: number, latitude: number } | null {
  for (const province of CHINA_PROVINCES) {
    const city = province.cities.find(c => c.name === cityName)
    if (city) {
      return { longitude: city.longitude, latitude: city.latitude }
    }
  }
  return null
}

// 根据城市名称和省份获取坐标（精确匹配）
export function getCityCoordinatesByProvince(cityName: string, provinceCode: string): { longitude: number, latitude: number } | null {
  const province = CHINA_PROVINCES.find(p => p.code === provinceCode)
  if (!province) return null
  
  const city = province.cities.find(c => c.name === cityName)
  return city ? { longitude: city.longitude, latitude: city.latitude } : null
}

// 获取所有城市的平铺列表（兼容旧版本）
export function getAllCities(): { [key: string]: { longitude: number, latitude: number } } {
  const result: { [key: string]: { longitude: number, latitude: number } } = {}
  
  for (const province of CHINA_PROVINCES) {
    for (const city of province.cities) {
      result[city.name] = { longitude: city.longitude, latitude: city.latitude }
    }
  }
  
  return result
} 
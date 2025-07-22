/**
 * 袁天罡称骨算命算法实现
 * 基于出生年、月、日、时计算称骨重量，并返回对应的命理歌决
 */

// 骨重数据接口
export interface BoneWeight {
  weight: number // 骨重（两）
  description?: string // 描述
}

// 称骨结果接口
export interface ChengGuResult {
  birthInfo: {
    year: number
    month: number
    day: number
    hour: number
  }
  boneWeights: {
    year: BoneWeight
    month: BoneWeight
    day: BoneWeight
    hour: BoneWeight
  }
  totalWeight: number // 总骨重（两）
  gender: 'male' | 'female'
  fortune: string // 歌决内容
  weightDescription: string // 骨重描述
  summary: string // 简要总结
}

// 年份骨重对照表（基于干支年份）
const YEAR_BONE_WEIGHTS: Record<string, number> = {
  // 属鼠
  '甲子': 1.2, '丙子': 1.6, '戊子': 1.5, '庚子': 0.7, '壬子': 0.5,
  // 属牛  
  '乙丑': 0.9, '丁丑': 0.8, '己丑': 0.7, '辛丑': 0.7, '癸丑': 0.7,
  // 属虎
  '丙寅': 0.6, '戊寅': 0.8, '庚寅': 0.9, '壬寅': 0.9, '甲寅': 1.2,
  // 属兔
  '丁卯': 0.7, '己卯': 1.9, '辛卯': 1.2, '癸卯': 1.2, '乙卯': 0.8,
  // 属龙
  '戊辰': 1.2, '庚辰': 1.2, '壬辰': 1.0, '甲辰': 0.8, '丙辰': 0.8,
  // 属蛇
  '己巳': 0.5, '辛巳': 0.6, '癸巳': 0.7, '乙巳': 0.7, '丁巳': 0.6,
  // 属马
  '庚午': 0.9, '壬午': 0.8, '甲午': 1.5, '丙午': 1.3, '戊午': 1.9,
  // 属羊
  '辛未': 0.8, '癸未': 0.7, '乙未': 0.6, '丁未': 0.5, '己未': 0.6,
  // 属猴
  '壬申': 0.7, '甲申': 0.5, '丙申': 0.5, '戊申': 1.4, '庚申': 0.8,
  // 属鸡
  '癸酉': 0.8, '乙酉': 1.5, '丁酉': 1.4, '己酉': 0.5, '辛酉': 1.6,
  // 属狗
  '甲戌': 1.5, '丙戌': 0.6, '戊戌': 1.4, '庚戌': 0.9, '壬戌': 1.0,
  // 属猪
  '乙亥': 0.9, '丁亥': 1.6, '己亥': 0.9, '辛亥': 1.7, '癸亥': 0.6
}

// 月份骨重对照表
const MONTH_BONE_WEIGHTS: Record<number, number> = {
  1: 0.6,  // 正月
  2: 0.7,  // 二月
  3: 1.8,  // 三月
  4: 0.9,  // 四月
  5: 0.5,  // 五月
  6: 1.6,  // 六月
  7: 0.9,  // 七月
  8: 1.5,  // 八月
  9: 1.8,  // 九月
  10: 0.8, // 十月
  11: 0.9, // 十一月
  12: 0.5  // 十二月
}

// 日期骨重对照表
const DAY_BONE_WEIGHTS: Record<number, number> = {
  1: 0.5, 2: 1.0, 3: 0.8, 4: 1.5, 5: 1.6,
  6: 1.5, 7: 0.8, 8: 1.6, 9: 0.8, 10: 1.6,
  11: 0.9, 12: 1.7, 13: 0.8, 14: 1.7, 15: 1.0,
  16: 0.8, 17: 0.9, 18: 1.8, 19: 0.5, 20: 1.0,
  21: 1.0, 22: 0.9, 23: 0.8, 24: 0.9, 25: 1.5,
  26: 1.8, 27: 0.7, 28: 0.8, 29: 1.6, 30: 0.6
}

// 时辰骨重对照表（24小时制转换为时辰）
const HOUR_BONE_WEIGHTS: Record<string, number> = {
  '子': 1.6, // 23:00-01:00
  '丑': 0.6, // 01:00-03:00
  '寅': 0.7, // 03:00-05:00
  '卯': 1.0, // 05:00-07:00
  '辰': 0.9, // 07:00-09:00
  '巳': 1.6, // 09:00-11:00
  '午': 1.0, // 11:00-13:00
  '未': 0.8, // 13:00-15:00
  '申': 0.8, // 15:00-17:00
  '酉': 0.9, // 17:00-19:00
  '戌': 0.6, // 19:00-21:00
  '亥': 0.6  // 21:00-23:00
}

// 男命称骨歌决
const MALE_FORTUNE_SONGS: Record<string, string> = {
  '2.1': '短命非业谓大空，平生灾难事重重；凶祸频临陷逆境，终世困苦事不成。',
  '2.2': '身寒骨冷苦伶仃，此命推来行乞人；劳劳碌碌无度日，终年打拱过平生。',
  '2.3': '此命推来骨格轻，求谋作事事难成；妻儿兄弟应难许，别处他乡作散人。',
  '2.4': '此命推来福禄无，门庭困苦总难荣；六亲骨肉皆无靠，流浪他乡作老翁。',
  '2.5': '此命推来祖业微，门庭营度似稀奇；六亲骨肉如冰炭，一世勤劳自把持。',
  '2.6': '平生衣禄苦中求，独自营谋事不休；离祖出门宜早计，晚来衣禄自无休。',
  '2.7': '一生作事少商量，难靠祖宗作主张；独马单枪空做去，早年晚岁总无长。',
  '2.8': '一生行事似飘蓬，祖宗产业在梦中；若不过房改名姓，也当移徒二三通。',
  '2.9': '初年运限未曾亨，纵有功名在后成；须过四旬才可立，移居改姓始为良。',
  '3.0': '劳劳碌碌苦中求，东奔西走何日休；若使终身勤与俭，老来稍可免忧愁。',
  '3.1': '忙忙碌碌苦中求，何日云开见日头；难得祖基家可立，中年衣食渐无忧。',
  '3.2': '初年运蹇事难谋，渐有财源如水流；到得中年衣食旺，那时名利一齐收。',
  '3.3': '早年做事事难成，百年勤劳枉费心；半世自如流水去，后来运到始得金。',
  '3.4': '此命福气果如何，僧道门中衣禄多；离祖出家方为妙，朝晚拜佛念弥陀。',
  '3.5': '生平福量不周全，祖业根基觉少传；营事生涯宜守旧，时来衣食胜从前。',
  '3.6': '不须劳碌过平生，独自成家福不轻；早有福星常照命，任君行去百般成。',
  '3.7': '此命般般事不成、弟兄少力自孤行；虽然祖业须微有，来得明时去不明。',
  '3.8': '一身骨肉最清高，早入簧门姓氏标；待到年将三十六，蓝衫脱去换红袍。',
  '3.9': '此命终身运不通，劳劳作事尽皆空；苦心竭力成家计，到得那时在梦中。',
  '4.0': '平生衣禄是绵长，件件心中自主张；前面风霜多受过，后来必定享安康。',
  '4.1': '此命推来自不同，为人能干异凡庸；中年还有逍遥福：不比前时运来通。',
  '4.2': '得宽怀处且宽怀，何用双眉皱不开；若使中年命运济，那时名利一起来。',
  '4.3': '为人心性最聪明，作事轩昂近贵人；衣禄一生天注定，不须劳碌是丰亨。',
  '4.4': '万事由天莫苦求，须知福碌赖人修；当年财帛难如意，晚景欣然便不优。',
  '4.5': '名利推求竟若何？前番辛苦后奔波；命中难养男和女，骨肉扶持也不多。',
  '4.6': '东西南北尽皆通，出姓移居更觉隆；衣禄无穷无数定，中年晚景一般同。',
  '4.7': '此命推求旺末年，妻荣子贵自怡然；平生原有滔滔福，可卜财源若水泉。',
  '4.8': '初年运道未曾通，几许蹉跎命亦穷；兄弟六亲无依靠，一生事业晚来整。',
  '4.9': '此命推来福不轻，自成自立显门庭；从来富贵人钦敬，使婢差奴过一生。',
  '5.0': '为利为名终日劳，中年福禄也多遭；老来自有财星照，不比前番目下高。',
  '5.1': '一世荣华事事通，不须劳碌自亨通；兄弟叔侄皆如意，家业成时福禄宏。',
  '5.2': '一世亨通事事能，不须劳苦自然宁；宗族有光欣喜甚，家产丰盈自称心。',
  '5.3': '此格推来福泽宏，兴家立业在其中；一生衣食安排定，却是人间一福翁。',
  '5.4': '此格详采福泽宏，诗书满腹看功成；丰衣足食多安稳，正是人间有福人。',
  '5.5': '策马扬鞭争名利，少年作事费筹论；一朝福禄源源至，富贵荣华显六亲。',
  '5.6': '此格推来礼义通，一身福禄用无穷；甜酸苦辣皆尝过，滚滚财源盈而丰。',
  '5.7': '福禄丰盈万事全，一身荣耀乐天年；名扬威震人争羡，此世逍遥宛似仙。',
  '5.8': '平生衣食自然来，名利双全富贵偕；金榜题名登甲第，紫袍玉带走金阶。',
  '5.9': '细推此格秀而清，必定才高学业成；甲第之中应有分，扬鞭走马显威荣。',
  '6.0': '一朝金榜快题名，显祖荣宗大器成；衣禄定然无欠缺，田园财帛更丰盈。',
  '6.1': '不作朝中金榜客，定为世上大财翁；聪明天付经书熟，名显高褂自是荣。',
  '6.2': '此命生来福不穷，读书必定显亲宗；紫衣玉带为卿相，富贵荣华孰与同。',
  '6.3': '命主为官福禄长，得来富贵实非常；名题雁塔传金榜，大显门庭天下扬。',
  '6.4': '此格威权不可当，紫袍金带尘高堂；荣华富贵谁能及？万古留名姓氏扬。',
  '6.5': '细推此命福非轻，富贵荣华孰与争；定国安邦人极品，威声显赫震寰瀛。',
  '6.6': '此格人间一福人，堆金积玉满堂春；从来富贵有天定，金榜题名更显亲。',
  '6.7': '此命生来福自宏，田园家业最高隆；平生衣禄盈丰足，一路荣华万事通。',
  '6.8': '富贵由天莫苦求，万事家计不须谋；十年不比前番事，祖业根基千古留。',
  '6.9': '君是人间福禄星，一生富贵众人钦；总然衣禄由天定，安享荣华过一生。',
  '7.0': '此命推来福不轻，何须愁虑苦劳心；荣华富贵已天定，正笏垂绅拜紫宸。',
  '7.1': '此命生成大不同，公侯卿相在其中；一生自有逍遥福，富贵荣华极品隆。',
  '7.2': '此命推来天下隆，必定人间一主公；富贵荣华数不尽，定为乾坤一蛟龙。',
  '7.3': '此命推来天下隆，必定人间一主公。富贵荣华数不尽，定为乾坤一蛟龙。'
}

// 女命称骨歌决
const FEMALE_FORTUNE_SONGS: Record<string, string> = {
  '2.1': '生身此命运不通，乌云盖月黑朦胧，莫向故园载花木，可来幽地种青松',
  '2.2': '女命孤冷独凄身，此身推来路乞人，操心烦恼难度日，一生痛苦度光阴',
  '2.3': '女命生来轻薄人，营谋事作难称心，六亲骨肉亦无靠，奔走劳碌困苦门',
  '2.4': '女命推来福禄无，治家艰难辛苦多，丈夫儿女不亲爱，奔走他乡作游姑',
  '2.5': '此命一身八字低，家庭艰辛多苦妻，娘家亲友冷如炭，一生勤劳多忧眉',
  '2.6': '平生依禄但苦求，两次配夫带忧愁，咸酸苦辣他偿过，晚年衣食本无忧',
  '2.7': '此格做事单独强，难告夫君作主张，心问口来口问心，晚景衣禄宜自生',
  '2.8': '女命生来八字轻，为善作事也无因，你把别人当亲生，别人对你假殷情',
  '2.9': '花支艳来硬性身，自奔自力不求人，若问求财方可止，在苦有甜度光阴',
  '3.0': '女命推来比郎强，婚姻大事碍无障，中年走过坎坷地，末年渐经行前强',
  '3.1': '早年行运在忙头，劳碌奔波苦勤求，费力劳心把家立，后来晚景名忧愁',
  '3.2': '时逢运来带吉神，从有凶星转灰尘，真变假来假成真，结拜弟妹当亲生',
  '3.3': '初限命中有变化，中年可比树落花，勤俭持家难度日，晚年成业享荣华',
  '3.4': '矮巴勾枣难捞枝，看破红尘最相宜，谋望求财空费力，婚姻三娶两次离',
  '3.5': '女子走冰怕冰薄，出行交易受残霜，婚姻周郎休此意，官司口舌须相加',
  '3.6': '忧悉常锁两眉间，家业挂心不等闲，从今以后防口角，任意行移不相关',
  '3.7': '此命推来费运多，若作摧群受折磨，山路崎岖吊下耳，左插右安心难留',
  '3.8': '凤鸣岐山四方扬，女命逢此大吉昌，走失夫君音信有，晚年衣禄财盈箱',
  '3.9': '女命推来运未能，劳碌奔波一场空，好似俊鸟在笼锁，中年未限凄秋风',
  '4.0': '目前月令运不良，千辛万苦受煎熬，女身受得多苦难，晚年福禄比密甜',
  '4.1': '此命推来一般艰，女子为人很非凡，中年逍遥多自在，晚年更比中年超',
  '4.2': '杜井破废已多年，今有泉水出来鲜，资生济竭人称美，中运来转喜安然',
  '4.3': '推车靠涯道路通，女名求财也无穷，婚姻出配无阻碍，疾病口舌离身躬',
  '4.4': '夜梦金银醒来空，立志谋业运不通，婚姻难成交易散，夫君趟失未见踪',
  '4.5': '女命终身驳杂多，六亲骨肉不相助，命中男女都难养，劳碌辛苦还奔波',
  '4.6': '孤舟行水离沙滩，离乡出外早过家，是非口舌皆无碍，婚姻合配紫微房',
  '4.7': '时来运转喜开颜，多年枯木逢春花，枝叶重生多茂盛，凡人见得都赞夸',
  '4.8': '一朵鲜花镜中开，看着极好取不来，劝你休把镜花想，此命推来主可癫',
  '4.9': '一生为人福宏名，心兹随君显门庭，容貌美丽惹人爱，银钱富足万事成',
  '5.0': '马氏太公不相和，好命逢此忧凝，多恩人无义反为仇，是非平地起风波',
  '5.1': '肥羊一群入出场，防虎逢之把口张，适口充饥心欢喜，女命八字大吉昌',
  '5.2': '顺风行舟扯起帆，上天又助一顺风，不用费力逍遥去，任意顺行大享通',
  '5.3': '此命相貌眉目清，文武双全功名成，一生衣禄皆无缺，可算世上积福人',
  '5.4': '运开满腹好文章，谋事求财大吉祥，出行交易多得稳，到处享通姓名扬',
  '5.5': '发政旅仁志量高，女命求财任他乡，交舍婚姻多有意，无君出外有音耗',
  '5.6': '明珠辉吐离埃来，女有口有清散开，走失郎君当两归，交易有成永无灾',
  '5.7': '游鱼戏水被网惊，踊身变化入龙门，三根杨柳垂金钱，万朵桃花显价能',
  '5.8': '此命推来转悠悠，时运未来莫强求，幸得今日重反点，自有好运在后头',
  '5.9': '雨雪载途活泥泞，交易不安难出生，疾病还拉婚姻慢，谋望求财事难寻',
  '6.0': '女命八字喜气和，谋事求财吉庆多，口舌渐消疾病少，夫君走别归老窠',
  '6.1': '缘木求鱼事多难，虽不得鱼无害反，若是行险弄巧地，事不遂心枉安凡',
  '6.2': '指日高升气象新，走失待人有信音，好命遇事遂心好，伺病口舌皆除根',
  '6.3': '五官脱运难抬头，妇命须当把财求，交易少行有人助，一生衣禄不须愁',
  '6.4': '俊鸟曾得出胧中，脱离为难显威风，一朝得意福力至，东南西北任意通',
  '6.5': '女命推来福非轻，兹善为事受人敬，天降文王开基业，八百年来富贵门',
  '6.6': '时来运转闺阁楼，贤德淑女君子求，击鼓乐之大吉庆，女命逢此喜悠悠',
  '6.7': '乱丝无头定有头，碰得亲事暂折磨，交易出行无好处，谋事求财心不遂',
  '6.8': '水底明月不可捞，女命早限运未高，交易出行难获利，未运终得渐见好',
  '6.9': '太公封祖不非凡，女子求财稳如山，交易合伙多吉庆，疾病口角遗天涯',
  '7.0': '本命推断喜气新，恰遇郎君金遂心，坤身来交正当运，富贵衣禄乐平生',
  '7.1': '此命推来宏运，交不须再愁苦劳难，一生身有衣禄福，安享荣华胜班超'
}

/**
 * 将24小时制转换为时辰
 */
function getHourBranch(hour: number): string {
  const hourBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  let index: number
  
  if (hour === 23 || hour === 0) {
    index = 0 // 子时
  } else {
    index = Math.floor((hour + 1) / 2)
  }
  
  return hourBranches[index]
}

/**
 * 根据年份获取干支
 */
function getGanZhiByYear(year: number): string {
  const heavenStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const earthBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  
  const stemIndex = (year - 4) % 10
  const branchIndex = (year - 4) % 12
  
  return heavenStems[stemIndex] + earthBranches[branchIndex]
}

/**
 * 获取年份骨重
 */
function getYearBoneWeight(year: number): BoneWeight {
  const ganzhi = getGanZhiByYear(year)
  const weight = YEAR_BONE_WEIGHTS[ganzhi] || 0.8 // 默认值
  
  return {
    weight,
    description: `${year}年（${ganzhi}）`
  }
}

/**
 * 获取月份骨重
 */
function getMonthBoneWeight(month: number): BoneWeight {
  const weight = MONTH_BONE_WEIGHTS[month] || 0.8 // 默认值
  const monthNames = ['', '正月', '二月', '三月', '四月', '五月', '六月', 
                     '七月', '八月', '九月', '十月', '十一月', '十二月']
  
  return {
    weight,
    description: monthNames[month] || `${month}月`
  }
}

/**
 * 获取日期骨重
 */
function getDayBoneWeight(day: number): BoneWeight {
  const weight = DAY_BONE_WEIGHTS[day] || 0.8 // 默认值
  
  // 转换为农历日期显示
  let dayName = ''
  if (day <= 10) {
    dayName = `初${['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][day]}`
  } else if (day < 20) {
    dayName = `十${['', '一', '二', '三', '四', '五', '六', '七', '八', '九'][day - 10]}`
  } else if (day === 20) {
    dayName = '二十'
  } else if (day < 30) {
    dayName = `廿${['', '一', '二', '三', '四', '五', '六', '七', '八', '九'][day - 20]}`
  } else if (day === 30) {
    dayName = '三十'
  }
  
  return {
    weight,
    description: dayName || `${day}日`
  }
}

/**
 * 获取时辰骨重
 */
function getHourBoneWeight(hour: number): BoneWeight {
  const hourBranch = getHourBranch(hour)
  const weight = HOUR_BONE_WEIGHTS[hourBranch] || 0.8 // 默认值
  
  const hourRanges: Record<string, string> = {
    '子': '23:00-01:00', '丑': '01:00-03:00', '寅': '03:00-05:00', '卯': '05:00-07:00',
    '辰': '07:00-09:00', '巳': '09:00-11:00', '午': '11:00-13:00', '未': '13:00-15:00',
    '申': '15:00-17:00', '酉': '17:00-19:00', '戌': '19:00-21:00', '亥': '21:00-23:00'
  }
  
  return {
    weight,
    description: `${hourBranch}时（${hourRanges[hourBranch]}）`
  }
}

/**
 * 格式化骨重数值为字符串键
 */
function formatWeightKey(weight: number): string {
  return weight.toFixed(1)
}

/**
 * 获取骨重描述
 */
function getWeightDescription(weight: number): string {
  const descriptions: Record<string, string> = {
    '极轻': '命运多舛，需要更多努力',
    '很轻': '运势较弱，但通过努力可以改善',
    '较轻': '平凡命格，需要勤劳致富',
    '中等': '中等命格，衣食无忧',
    '较重': '福禄双全，运势不错',
    '很重': '富贵命格，一生顺遂',
    '极重': '大富大贵，福禄深厚'
  }
  
  if (weight <= 2.5) return descriptions['极轻']
  if (weight <= 3.0) return descriptions['很轻']
  if (weight <= 3.5) return descriptions['较轻']
  if (weight <= 4.5) return descriptions['中等']
  if (weight <= 5.5) return descriptions['较重']
  if (weight <= 6.5) return descriptions['很重']
  return descriptions['极重']
}

/**
 * 计算袁天罡称骨算命结果
 * @param year 出生年份（公历）
 * @param month 出生月份（农历）
 * @param day 出生日期（农历）
 * @param hour 出生小时（0-23）
 * @param gender 性别（'male' | 'female'）
 * @returns 称骨算命结果
 */
export function calculateChengGu(
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: 'male' | 'female' = 'male'
): ChengGuResult {
  // 获取各项骨重
  const yearWeight = getYearBoneWeight(year)
  const monthWeight = getMonthBoneWeight(month)
  const dayWeight = getDayBoneWeight(day)
  const hourWeight = getHourBoneWeight(hour)
  
  // 计算总骨重
  const totalWeight = yearWeight.weight + monthWeight.weight + dayWeight.weight + hourWeight.weight
  
  // 获取对应的歌决
  const fortuneSongs = gender === 'male' ? MALE_FORTUNE_SONGS : FEMALE_FORTUNE_SONGS
  const weightKey = formatWeightKey(totalWeight)
  
  let fortune = fortuneSongs[weightKey]
  
  // 如果没有精确匹配，寻找最接近的
  if (!fortune) {
    const weights = Object.keys(fortuneSongs).map(k => parseFloat(k)).sort((a, b) => a - b)
    const closestWeight = weights.reduce((prev, curr) => 
      Math.abs(curr - totalWeight) < Math.abs(prev - totalWeight) ? curr : prev
    )
    fortune = fortuneSongs[formatWeightKey(closestWeight)]
  }
  
  // 如果还是没有，使用默认信息
  if (!fortune) {
    fortune = gender === 'male' 
      ? '此命推来福禄平，平生衣食不缺兴；总然命中多劳碌，晚年福禄自然成。'
      : '女命推来福不轻，平生衣食自安宁；虽然命中多操劳，晚年福禄享安荣。'
  }
  
  // 生成简要总结
  const summary = `您的称骨重量为${totalWeight.toFixed(1)}两，${getWeightDescription(totalWeight)}。${gender === 'male' ? '男命' : '女命'}格局。`
  
  return {
    birthInfo: {
      year,
      month,
      day,
      hour
    },
    boneWeights: {
      year: yearWeight,
      month: monthWeight,
      day: dayWeight,
      hour: hourWeight
    },
    totalWeight,
    gender,
    fortune,
    weightDescription: getWeightDescription(totalWeight),
    summary
  }
}

/**
 * 从农历日期计算袁天罡称骨
 * @param lunarYear 农历年份
 * @param lunarMonth 农历月份
 * @param lunarDay 农历日期
 * @param hour 出生小时（0-23）
 * @param gender 性别
 */
export function calculateChengGuFromLunar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  hour: number,
  gender: 'male' | 'female' = 'male'
): ChengGuResult {
  return calculateChengGu(lunarYear, lunarMonth, lunarDay, hour, gender)
}

/**
 * 批量计算不同时辰的称骨结果
 * @param year 出生年份
 * @param month 出生月份
 * @param day 出生日期
 * @param gender 性别
 * @returns 12个时辰的称骨结果数组
 */
export function calculateAllHourChengGu(
  year: number,
  month: number,
  day: number,
  gender: 'male' | 'female' = 'male'
): ChengGuResult[] {
  const results: ChengGuResult[] = []
  const hours = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23] // 每个时辰的代表小时
  
  for (const hour of hours) {
    results.push(calculateChengGu(year, month, day, hour, gender))
  }
  
  return results
}

/**
 * 获取称骨重量等级
 * @param weight 骨重
 * @returns 等级信息
 */
export function getWeightLevel(weight: number): {
  level: string
  color: string
  description: string
} {
  if (weight <= 2.5) {
    return {
      level: '轻',
      color: 'red',
      description: '命运多舛，需要更多努力'
    }
  } else if (weight <= 3.5) {
    return {
      level: '偏轻',
      color: 'orange',
      description: '运势较弱，但通过努力可以改善'
    }
  } else if (weight <= 4.5) {
    return {
      level: '中等',
      color: 'yellow',
      description: '中等命格，衣食无忧'
    }
  } else if (weight <= 5.5) {
    return {
      level: '偏重',
      color: 'green',
      description: '福禄双全，运势不错'
    }
  } else if (weight <= 6.5) {
    return {
      level: '重',
      color: 'blue',
      description: '富贵命格，一生顺遂'
    }
  } else {
    return {
      level: '极重',
      color: 'purple',
      description: '大富大贵，福禄深厚'
    }
  }
}

// 导出常量供外部使用
export {
  YEAR_BONE_WEIGHTS,
  MONTH_BONE_WEIGHTS,
  DAY_BONE_WEIGHTS,
  HOUR_BONE_WEIGHTS,
  MALE_FORTUNE_SONGS,
  FEMALE_FORTUNE_SONGS
} 
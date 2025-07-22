-- phpMyAdmin SQL Dump
-- version 2.10.3
-- http://www.phpmyadmin.net
-- 
-- 主机: localhost:3308
-- 生成日期: 2009 年 07 月 28 日 09:23
-- 服务器版本: 5.0.51
-- PHP 版本: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

-- 
-- 数据库: `ming`
-- 

-- --------------------------------------------------------

-- 
-- 表的结构 `wh`
-- 

CREATE TABLE `wh` (
  `wh` varchar(50) NOT NULL,
  `tnwh` varchar(50) default NULL,
  `ynwh` varchar(50) default NULL,
  `skzhyj` longtext,
  `whzx` longtext,
  `szwh` longtext,
  `hyhw` longtext,
  `whw` longtext,
  `whq` longtext,
  PRIMARY KEY  (`wh`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- 
-- 导出表中的数据 `wh`
-- 

INSERT INTO `wh` VALUES ('火', '火木', '水金土', '火旺得水，&nbsp;方成相济。\r<BR>火能生土，&nbsp;土多火晦；&nbsp;强火得土，&nbsp;方止其焰。\r<BR>火能克金，&nbsp;金多火熄；&nbsp;金弱遇火，&nbsp;必见销熔。\r<BR>火赖木生，&nbsp;木多火炽；&nbsp;木能生火，&nbsp;火多木焚。　\r<BR>', '火主礼，&nbsp;其性急，&nbsp;其情恭，&nbsp;其味苦，&nbsp;其色赤。&nbsp;火盛之人头小脚长，&nbsp;上尖下阔，浓眉小耳，&nbsp;精神闪烁，&nbsp;为人谦和恭敬，&nbsp;纯朴急躁。&nbsp;火衰之人则黄瘦尖楞，&nbsp;语言妄诞，&nbsp;诡诈妒毒，&nbsp;做事有始无终。', '心脏与小肠互为脏腑表里，&nbsp;又属血脉及整个循环系统。&nbsp;过旺或过衰，&nbsp;较宜患小肠，&nbsp;心脏，&nbsp;肩，&nbsp;血液，&nbsp;经血，&nbsp;脸部，&nbsp;牙齿，&nbsp;腹部，&nbsp;舌部等方面的疾病。', '宜火者，&nbsp;喜南方。&nbsp;可从事放光，&nbsp;照明，&nbsp;光学，&nbsp;高热，&nbsp;易燃，&nbsp;油类，&nbsp;酒精类，热饮食，&nbsp;食品，&nbsp;理发，&nbsp;化妆品，&nbsp;人身装饰品，&nbsp;文艺，&nbsp;文学，&nbsp;文具，&nbsp;文化学生，&nbsp;文人，&nbsp;作家，&nbsp;写作，&nbsp;撰文，&nbsp;教员，&nbsp;校长，&nbsp;秘书，&nbsp;出版，&nbsp;公务，&nbsp;正界等方面的经营和事业。', '', '');
INSERT INTO `wh` VALUES ('金', '金土', '火木水', '金旺得火，&nbsp;方成器皿。\r<BR>金能生水，&nbsp;水多金沉；&nbsp;强金得水，&nbsp;方挫其锋。\r<BR>金能克木，&nbsp;木多金缺；&nbsp;木弱逢金，&nbsp;必为砍折。\r<BR>金赖土生，&nbsp;土多金埋；&nbsp;土能生金，&nbsp;金多土变。　\r<BR>', '金主义，&nbsp;其性刚，&nbsp;其情烈，&nbsp;其味辣，&nbsp;其色白。&nbsp;金盛之人骨肉相称，&nbsp;面方白净，眉高眼深，&nbsp;体健神清。&nbsp;为人刚毅果断，&nbsp;疏财仗义，&nbsp;深知廉耻。&nbsp;太过则有勇无谋，贪欲不仁。&nbsp;不及则身材瘦小，&nbsp;为人刻薄内毒，&nbsp;喜淫好杀，&nbsp;吝啬贪婪。', '肺与大肠互为脏腑表里，&nbsp;又属气管及整个呼吸系统。&nbsp;过旺或过衰，&nbsp;较宜患大肠，&nbsp;肺，&nbsp;脐，&nbsp;咳痰，&nbsp;肝，&nbsp;皮肤，&nbsp;痔疮，&nbsp;鼻气管等方面的疾病。', '宜金者，&nbsp;喜西方。&nbsp;可从事精纤材或金属工具材料，&nbsp;坚硬，&nbsp;决断，&nbsp;武术，&nbsp;鉴定，总管，&nbsp;汽车，&nbsp;交通，&nbsp;金融，&nbsp;工程，&nbsp;种子，&nbsp;开矿，&nbsp;民意代表，&nbsp;伐木，&nbsp;机械等方面的经营和工作。', '', '');
INSERT INTO `wh` VALUES ('木', '木水', '金土火', '木旺得金，&nbsp;方成栋梁。\r<BR>木能生火，&nbsp;火多木焚；&nbsp;强木得火，&nbsp;方化其顽。\r<BR>木能克土，&nbsp;土多木折；&nbsp;土弱逢木，&nbsp;必为倾陷。\r<BR>木赖水生，&nbsp;水多木漂；&nbsp;水能生木，&nbsp;木多水缩。', '木主仁，&nbsp;其性直，&nbsp;其情和，&nbsp;其味酸，&nbsp;其色青。&nbsp;木盛的人长得丰姿秀丽，&nbsp;骨骼修长，&nbsp;手足细腻，&nbsp;口尖发美，&nbsp;面色青白。&nbsp;为人有博爱恻隐之心，&nbsp;慈祥恺悌之意，清高慷慨，&nbsp;质朴无伪。&nbsp;木衰之人则个子瘦长，&nbsp;头发稀少，&nbsp;性格偏狭，&nbsp;嫉妒不仁。木气死绝之人则眉眼不正，&nbsp;项长喉结，&nbsp;肌肉干燥，&nbsp;为人鄙下吝啬。', '肝与胆互为脏腑表里，&nbsp;又属筋骨和四肢。&nbsp;过旺或过衰，&nbsp;较宜患肝，&nbsp;胆，头，&nbsp;颈，&nbsp;四肢，&nbsp;关节，&nbsp;筋脉，&nbsp;眼，&nbsp;神经等方面的疾病。', '宜木者，&nbsp;喜东方。&nbsp;可从事木材，&nbsp;木器，&nbsp;家具，&nbsp;装潢，&nbsp;木成品，&nbsp;纸业，&nbsp;种植，养花，&nbsp;育树苗，&nbsp;敬神物品，&nbsp;香料，&nbsp;植物性素食品等经营和事业。', '', '');
INSERT INTO `wh` VALUES ('水', '水金', '土火木', '水旺得土，&nbsp;方成池沼。\r<BR>水能生木，&nbsp;木多水缩；&nbsp;强水得木，&nbsp;方泄其势。\r<BR>水能克火，&nbsp;火多水干；&nbsp;火弱遇水，&nbsp;必不熄灭。\r<BR>水赖金生，&nbsp;金多水浊；&nbsp;金能生水，&nbsp;水多金沉。', '水主智，&nbsp;其性聪，&nbsp;其情善，&nbsp;其味咸，&nbsp;其色黑。&nbsp;水旺之人面黑有采，&nbsp;语言清和，为人深思熟虑，&nbsp;足智多谋，&nbsp;学识过人。&nbsp;太过则好说是非，&nbsp;飘荡贪淫。&nbsp;不及则人物短小，&nbsp;性情无常，&nbsp;胆小无略，&nbsp;行事反覆。', '肾与膀胱互为脏腑表里，&nbsp;又属脑与泌尿系统。&nbsp;过旺或过衰，&nbsp;较宜患肾，膀胱，&nbsp;胫，&nbsp;足，&nbsp;头，&nbsp;肝，&nbsp;泌尿，&nbsp;阴部，&nbsp;腰部，&nbsp;耳，&nbsp;子宫，&nbsp;疝气等方面的疾病。', '宜水者，&nbsp;喜北方。&nbsp;可从事航海，&nbsp;冷温不燃液体，&nbsp;冰水，&nbsp;鱼类，&nbsp;水产，&nbsp;水利，冷藏，&nbsp;冷冻，&nbsp;打捞，&nbsp;洗洁，&nbsp;扫除，&nbsp;流水，&nbsp;港口，&nbsp;泳池，&nbsp;湖池塘，&nbsp;浴池，&nbsp;冷食物买卖，&nbsp;飘游，&nbsp;奔波，&nbsp;流动，&nbsp;连续性，&nbsp;易变化，&nbsp;属水性质，&nbsp;音响性质，&nbsp;清洁性质，&nbsp;海上作业，&nbsp;迁旅，&nbsp;特技表演，&nbsp;运动，&nbsp;导游，&nbsp;旅行，&nbsp;玩具，&nbsp;魔术，&nbsp;记者，&nbsp;侦探，&nbsp;旅社，灭火器具，&nbsp;钓鱼器具，&nbsp;医疗业，&nbsp;药物经营，&nbsp;医生，&nbsp;护士，&nbsp;占卜等方面的经营和工作。', '', '');
INSERT INTO `wh` VALUES ('土', '土火', '木水金', '土旺得水，&nbsp;方能疏通。\r<BR>土能生金，&nbsp;金多土变；&nbsp;强土得金，&nbsp;方制其壅。\r<BR>土能克水，&nbsp;水多土流；&nbsp;水弱逢土，&nbsp;必为淤塞。\r<BR>土赖火生，&nbsp;火多土焦；&nbsp;火能生土，&nbsp;土多火晦。', '土主信，&nbsp;其性重，&nbsp;其情厚，&nbsp;其味甘，&nbsp;其色黄。&nbsp;土盛之人圆腰廓鼻，&nbsp;眉清木秀，口才声重。&nbsp;为人忠孝至诚，&nbsp;度量宽厚，&nbsp;言必行，&nbsp;行必果。&nbsp;土气太过则头脑僵化，愚拙不明，&nbsp;内向好静。&nbsp;不及之人面色忧滞，&nbsp;面扁鼻低，&nbsp;为人狠毒乖戾，&nbsp;不讲信用，不通情理。', '脾与胃互为脏腑表里，&nbsp;又属肠及整个消化系统。&nbsp;过旺或过衰，&nbsp;较宜患脾，&nbsp;胃，&nbsp;肋，&nbsp;背，&nbsp;胸，&nbsp;肺，&nbsp;肚等方面的疾病。', '宜土者，&nbsp;喜中央之地，&nbsp;本地。&nbsp;可从事土产，&nbsp;地产，&nbsp;农村，&nbsp;畜牧，&nbsp;布匹，&nbsp;服装，纺织，&nbsp;石料，&nbsp;石灰，&nbsp;山地，&nbsp;水泥，&nbsp;建筑，&nbsp;房产买卖，&nbsp;雨衣，&nbsp;雨伞，&nbsp;筑堤，&nbsp;容水物品，&nbsp;当铺，&nbsp;古董，&nbsp;中间人，&nbsp;律师，&nbsp;管理，&nbsp;买卖，&nbsp;设计，&nbsp;顾问，&nbsp;丧业，&nbsp;筑墓，&nbsp;墓地管理，&nbsp;僧尼等方面的经营和事业。', '', '');

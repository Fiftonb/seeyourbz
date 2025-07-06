几乎所有的类型，都可以调用以下几个方法：

1. 名称
调用getName()返回名称字符串。

        // 农历年名称
        const lunarYear: LunarYear = LunarYear.fromYear(2023);
        // 农历癸卯年（依据国家标准《农历的编算和颁行》GB/T 33661-2017，农历年有2种命名方法：干支纪年法和生肖纪年法，这里默认采用干支纪年法。）
        const name: string = lunarYear.getName();
      
2. 完整描述
调用toString()返回完整描述字符串。

        // 农历月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        // 正月
        const monthName: string = lunarMonth.getName();
        // 农历癸卯年正月
        const monthString: string = lunarMonth.toString();
      
3. 推移
调用next(n)推移指定的步数，参数正数顺推，负数逆推。例如农历年推移，则代表推移多少年；农历时辰推移，则代表推移多少个时辰。

        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        // 得到5个月后的农历月
        const lunarMonth2: LunarMonth = lunarMonth.next(5);
      
也有很多支持轮回的类型(以轮回标注)，例如天干(10个为一轮)、地支(12个为一轮)、干支(60个为一轮)、星期(7个为一轮)等，可以通过索引值或名称进行初始化：

1. 通过索引值进行初始化
调用fromIndex(index)得到其对象。index为数字，从0开始，当索引值越界时，会自动轮回偏移。

        // 日
        let week = Week.fromIndex(0);

        // 六
        week = Week.fromIndex(-1);

        // 乙丑
        const sixtyCycle = SixtyCycle.fromIndex(1);
      
2. 通过名称进行初始化
调用fromName(name)得到其对象。name为字符串，当名称不存在时，会抛出参数异常。

        // 日
        let week: Week = Week.fromName('日');

        // 六
        week = Week.fromName('六');

        // 乙丑
        const sixtyCycle: SixtyCycle = SixtyCycle.fromName('乙丑');
      
农历年 LunarYear
依据国家标准《农历的编算和颁行》GB/T 33661-2017，农历年以正月初一开始，至除夕结束。

如何得到农历年？
1. 从年初始化
参数为农历年，支持从-1到9999年。

        const lunarYear: LunarYear = LunarYear.fromYear(2023);
      
2. 从农历月 LunarMonth得到农历年
        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        const lunarYear: LunarYear = lunarMonth.getLunarYear();
      
从农历年可以得到些什么？
1. 年
返回为农历年数字，范围为-1到9999。

        const lunarYear: LunarYear = LunarYear.fromYear(2023);
        // 得到2023
        const year: number = lunarYear.getYear();
      
2. 当年的总天数
返回为数字，从正月初一到除夕的总天数。

        const lunarYear: LunarYear = LunarYear.fromYear(2023);
        const dayCount: number = lunarYear.getDayCount();
      
3. 当年的闰月月份
返回为数字，代表当年的闰月月份，例如：5代表闰五月，0代表当年没有闰月。

        const lunarYear: LunarYear = LunarYear.fromYear(2023);
        const leapMonth: number = lunarYear.getLeapMonth();
      
4. 当年的干支
返回为干支 SixtyCycle。

        const lunarYear: LunarYear = LunarYear.fromYear(2023);
        const sixtyCycle: SixtyCycle = lunarYear.getSixtyCycle();
      
5. 运
返回为运 Twenty。

        const lunarYear: LunarYear = LunarYear.fromYear(2023);
        const twenty: Twenty = lunarYear.getTwenty();
      
6. 九星
返回为九星 NineStar。

        const lunarYear: LunarYear = LunarYear.fromYear(2023);
        const nineStar: NineStar = lunarYear.getNineStar();
      
7. 太岁方位
返回为方位 Direction。

        const lunarYear: LunarYear = LunarYear.fromYear(2023);
        const direction: Direction = lunarYear.getJupiterDirection();
      
8. 农历月列表
返回为农历月 LunarMonth的列表，从正月到十二月，包含闰月。

        const lunarYear: LunarYear = LunarYear.fromYear(2023);
        const months: LunarMonth[] = lunarYear.getMonths();
      
9. 灶码头 KitchenGodSteed
        LunarYear lunarYear = LunarYear.fromYear(2023);
        KitchenGodSteed kitchenGodSteed = lunarYear.getKitchenGodSteed();
      
农历季节 LunarSeason
从正月开始，依次为：孟春、仲春、季春、孟夏、仲夏、季夏、孟秋、仲秋、季秋、孟冬、仲冬、季冬。

如何得到农历季节？
1. 从农历月 LunarMonth得到
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        const season: LunarSeason = lunarMonth.getSeason();
      
农历月 LunarMonth
农历月以初一开始，大月30天，小月29天。

如何得到农历月？
1. 从农历年、月初始化
参数农历年，支持从-1到9999年；参数农历月，支持1到12，如果为闰月的，使用负数，即-3代表闰三月。

        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 5);
      
2. 从农历日 LunarDay得到农历月
        // 农历2023年正月初一
        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const lunarMonth: LunarMonth = lunarDay.getLunarMonth();
      
从农历月可以得到些什么？
1. 农历年
返回为农历年 LunarYear。

        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        const lunarYear: LunarYear = lunarMonth.getLunarYear();
      
2. 月
返回为月份数字，范围为1到12，如闰七月也返回7。

        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        // 1
        const month: number = lunarMonth.getMonth();
      
3. 月(支持闰月)
返回为月份数字，范围为1到12，闰月为负数，如闰7月返回-7。

        // 农历2023年正月
        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        // 1
        const month: number = lunarDay.getMonthWithLeap();
      
4. 是否闰月
返回为布尔值，闰月返回true，非闰月返回false。

        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        // false
        const leap: bool = lunarMonth.isLeap();
      
5. 位于当年的月索引
返回为数字，范围0到12，正月为0，依次类推，例如五月索引值为4，闰五月索引值为5。

        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        // 0
        const index: number = lunarMonth.getIndexInYear();
      
6. 当月的总天数
返回为数字，从初一开始的总天数，大月有30天，小月有29天。

        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        const dayCount: number = lunarMonth.getDayCount();
      
7. 农历季节
返回为农历季节 LunarSeason。

        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        const season: LunarSeason = lunarMonth.getSeason();
      
8. 初一的儒略日
返回为儒略日 JulianDay。

        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        const julianDay: JulianDay = lunarMonth.getFirstJulianDay();
      
9. 当月有几周
参数为起始星期，1234560分别代表星期一至星期天，返回为数字。

        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        const weekCount: number = lunarMonth.getWeekCount(1);
      
10. 当月的周列表
参数为起始星期，1234560分别代表星期一至星期天，返回为农历周 LunarWeek的列表。

        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        const weeks: LunarWeek[] = lunarMonth.getWeeks(1);
      
11. 当月的干支
返回为干支 SixtyCycle。

        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        const sixtyCycle: SixtyCycle = lunarMonth.getSixtyCycle();
      
12. 九星
返回为九星 NineStar。

        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        const nineStar: NineStar = lunarMonth.getNineStar();
      
13. 太岁方位
返回为方位 Direction。

        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        const direction: Direction = lunarMonth.getJupiterDirection();
      
14. 农历日列表
返回为农历日 LunarDay的列表，从初一开始。

        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        const days: LunarDay[] = lunarMonth.getDays();
      
15. 逐月胎神
返回为逐月胎神 FetusMonth。闰月无胎神。

        // 农历2023年正月
        const lunarMonth: LunarMonth = LunarMonth.fromYm(2023, 1);
        // 注意闰月会返回null
        const fetus: FetusMonth = lunarMonth.getFetus();
      
农历周 LunarWeek
农历一个月最多有6个周，分别为：第一周、第二周、第三周、第四周、第五周、第六周。

如何得到农历周？
1. 通过农历年月的周索引初始化，参数分别为农历年、农历月、周索引、起始星期（1234560分别代表星期一至星期日）
        // 农历癸卯年正月第一周，以星期2为一周的开始
        const lunarWeek: LunarWeek = LunarWeek.fromYm(2023, 1, 0, 2);
      
从农历周可以得到些什么？
1. 本周第一天的农历日
返回为农历日 LunarDay。

        const lunarWeek: LunarWeek = LunarWeek.fromYm(2023, 1, 0, 2);
         
        // 农历壬寅年十二月廿六
        const lunarDay: LunarDay = lunarWeek.getFirstDay();
      
2. 本周农历日列表
返回为农历日 LunarDay的列表。

        const lunarWeek: LunarWeek = LunarWeek.fromYm(2023, 1, 0, 2);
         
        // 农历壬寅年十二月廿六
        const days: LunarDay[] = lunarWeek.getDays();
      
农历日 LunarDay
如何得到农历日？
1. 从农历年、月、日初始化
参数农历年，支持从-1到9999年；参数农历月，支持1到12，如果为闰月的，使用负数，即-3代表闰三月；参数农历日，支持1到30，大月30天，小月29天。

        // 农历2023年正月初一
        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
      
2. 从农历时辰 LunarHour得到农历日
        // 农历2023年正月初一 13:00:00
        const lunarHour: LunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        const lunarDay: LunarDay = lunarHour.getLunarDay();
      
3. 从公历日 SolarDay转农历日
        // 公历2024年2月9日
        const solarDay: SolarDay = SolarDay.fromYmd(2024, 2, 9);
        // 农历癸卯年十二月三十
        const lunarDay: LunarDay = solarDay.getLunarDay();
      
从农历日可以得到些什么？
1. 农历月 LunarMonth
        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        // 正月
        const lunarMonth: LunarMonth = lunarDay.getLunarMonth();
      
2. 日
返回为数字，范围1到30。

        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        // 1
        const day: number = lunarDay.getDay();
      
3. 星期 Week
        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const week: Week = lunarDay.getWeek();
      
4. 当天的年干支(已废弃)
非当天所属的农历年干支，以立春换年。返回为干支 SixtyCycle。

        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const sixtyCycle: SixtyCycle = lunarDay.getYearSixtyCycle();
      
5. 当天的月干支(已废弃)
非当天所属的农历月干支，以节令换月。返回为干支 SixtyCycle。

        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const sixtyCycle: SixtyCycle = lunarDay.getMonthSixtyCycle();
      
6. 当天的干支
返回为干支 SixtyCycle。

        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const sixtyCycle: SixtyCycle = lunarDay.getSixtyCycle();
      
7. 九星
返回为九星 NineStar。

        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const nineStar: NineStar = lunarDay.getNineStar();
      
8. 太岁方位
返回为方位 Direction。

        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const direction: Direction = lunarDay.getJupiterDirection();
      
9. 建除十二值神
返回为建除十二值神 Duty。

        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const duty: Duty = lunarDay.getDuty();
      
10. 黄道黑道十二神
返回为黄道黑道十二神 TwelveStar。

        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const twelveStar: TwelveStar = lunarDay.getTwelveStar();
      
11. 逐日胎神
返回为逐日胎神 FetusDay。

        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const fetus: FetusDay = lunarDay.getFetusDay();
      
12. 月相
返回为月相 Phase。

        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const phase: Phase = lunarDay.getPhase();
      
13. 二十八宿
返回为二十八宿 TwentyEightStar。

        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const twentyEightStar: TwentyEightStar = lunarDay.getTwentyEightStar();
      
14. 农历传统节日
返回为农历传统节日 LunarFestival，当天无节日返回null。

        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const festival: LunarFestival = lunarDay.getFestival();
      
15. 农历日转公历日
返回为公历日 SolarDay。

        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const solarDay: SolarDay = lunarDay.getSolarDay();
      
16. 农历日前后比较
        // 农历2023年正月初一
        const a: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        // 农历2023年正月初二
        const b: LunarDay = LunarDay.fromYmd(2023, 1, 2);

        // a在b之前吗？这里返回true
        const aIsBeforeB: bool = a.isBefore(b);
         
        // a在b之后吗？这里返回false
        const aIsAfterB: bool = a.isAfter(b);
      
17. 当天的时辰列表
由于23:00-23:59、00:00-00:59均为子时，而农历日是从00:00-23:59为一天，所以获取当天的时辰列表，实际会返回13个。

        const lunarDay: LunarDay = LunarDay.fromYmd(2023, 1, 1);
        const lunarHours: LunarHour[] = lunarDay.getHours();
      
农历时辰 LunarHour
如何得到农历时辰？
1. 从农历年、月、日、时、分、秒初始化
参数农历年，支持从-1到9999年；参数农历月，支持1到12，如果为闰月的，使用负数，即-3代表闰三月；参数农历日，支持1到30，大月30天，小月29天；时为0-23；分为0-59；秒为0-59。

        // 农历2023年正月初一 13:00:00
        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
      
2. 从公历时刻 SolarTime转农历时辰
        // 公历2024年2月9日 13:00:00
        SolarTime solarTime = SolarTime.fromYmdHms(2024, 2, 9, 13, 0, 0);
        // 农历癸卯年十二月三十 未时
        LunarHour lunarHour = solarTime.getLunarHour();
      
从农历时辰可以得到些什么？
1. 农历日 LunarDay
        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        // 初一
        LunarDay lunarDay = lunarHour.getLunarDay();
      
2. 时
返回为数字，范围0到23。

        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        // 13
        int hour = lunarHour.getHour();
      
3. 分
返回为数字，范围0到59。

        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        // 0
        int minute = lunarHour.getMinute();
      
4. 秒
返回为数字，范围0到59。

        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        // 0
        int second = lunarHour.getSecond();
      
4. 位于当天的序号
返回为数字，范围0到11。

        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        // 7
        int index = lunarHour.getIndexInDay();
      
5. 当时的年干支(已废弃)
非当时所属的农历年干支，以立春具体时刻换年。返回为干支 SixtyCycle。

        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        SixtyCycle sixtyCycle = lunarHour.getYearSixtyCycle();
      
5. 当时的月干支(已废弃)
非当时所属的农历月干支，以节令具体时刻换月。返回为干支 SixtyCycle。

        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        SixtyCycle sixtyCycle = lunarHour.getMonthSixtyCycle();
      
6. 当时的日干支(已废弃)
返回为干支 SixtyCycle。注意：23:00开始算做第二天。

        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        SixtyCycle sixtyCycle = lunarHour.getDaySixtyCycle();
      
7. 时辰干支
返回为干支 SixtyCycle。

        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        SixtyCycle sixtyCycle = lunarHour.getSixtyCycle();
      
8. 九星
返回为九星 NineStar。

        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        NineStar nineStar = lunarHour.getNineStar();
      
9. 黄道黑道十二神
返回为黄道黑道十二神 TwelveStar。

        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        TwelveStar twelveStar = lunarHour.getTwelveStar();
      
10. 农历时辰转公历时刻
返回为公历时刻 SolarTime。

        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        SolarTime solarTime = lunarHour.getSolarTime();
      
11. 农历时辰转八字
默认23:00-23:59日干支为明天，返回为八字 EightChar。

        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        EightChar eightChar = lunarHour.getEightChar();
      
由于有的流派认为23:00-23:59日干支为当天，有的流派则认为应该算明天，可通过EightCharProvider来切换，默认支持以下几种方式，你也可以自定义。

a. 默认（23:00-23:59日干支为明天，对应Lunar流派1）
        LunarHour.provider = new DefaultEightCharProvider();
        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 23, 0, 0);
        EightChar eightChar = lunarHour.getEightChar();
      
b. Lunar流派2（23:00-23:59日干支为当天）
        LunarHour.provider = new LunarSect2EightCharProvider();
        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 23, 0, 0);
        EightChar eightChar = lunarHour.getEightChar();
      
c. 自定义
实现EightCharProvider接口。

        // 方式1，实现EightCharProvider接口
        public class MyEightCharProvider implements EightCharProvider {
          // 实现getEightChar方法
        }
         
        LunarHour.provider = new MyEightCharProvider();
      
12. 农历时辰前后比较
        // 农历2023年正月初一 13:00:00
        LunarHour a = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0);
        // // 农历2023年正月初二 09:00:00
        LunarHour b = LunarHour.fromYmdHms(2023, 1, 2, 09, 0, 0);

        // a在b之前吗？这里返回true
        boolean aIsBeforeB = a.isBefore(b);
         
        // a在b之后吗？这里返回false
        boolean aIsAfterB = a.isAfter(b);
      
藏历年 RabByungYear
公历1027年为藏历元年，即第一饶迥火兔年。藏历中绕迥代表60年。

如何得到藏历年？
1. 从年初始化
参数为藏历年数字，由于1027年是藏历元年，干支为丁火，属于第一饶迥，往前推到第一绕迥的第1年甲子年为1024年，因此参数最小值仅支持1024，再小绕迥就为零或负数了。参数最大值为9999。

        // 第十六饶迥铁虎年
        const y: RabByungYear = RabByungYear.fromYear(1950);
      
2. 从藏历月 RabByungMonth得到藏历年
        // 第十六饶迥铁虎年十二月
        const m: RabByungMonth = RabByungMonth.fromYm(1950, 12);
         
        // 第十六饶迥铁虎年
        const y: RabByungYear = m.getRabByungYear();
      
3. 从年干支 SixtyCycle得到藏历年
第1个参数为绕迥序号，从0开始，0代表第一饶迥(饶迥序号不能小于0，不能大于150，下同)。第2个参数为干支。

        const sc: SixtyCycle = SixtyCycle.fromName('丁卯');
         
        // 第一饶迥火兔年
        const y: RabByungYear = RabByungYear.fromSixtyCycle(0, sc);
      
4. 从藏历五行 RabByungElement和生肖 Zodiac得到藏历年
第1个参数为绕迥序号，从0开始，0代表第一饶迥。第2个参数为藏历五行。第3个参数为生肖。

        const e: RabByungElement = RabByungElement.fromName('火');
        const z: Zodiac = Zodiac.fromName('兔');
         
        // 第一饶迥火兔年
        const y: RabByungYear = RabByungYear.fromElementZodiac(0, e, z);
      
5. 公历年 SolarYear转藏历年
        // 1950年
        const sy: SolarYear = SolarYear.fromYear(1950);
         
        // 第十六饶迥铁虎年
        const y: RabByungYear = sy.getRabByungYear();
      
从藏历年可以得到些什么？
1. 年
返回为藏历年数字，范围为1024到9999。

        const y: RabByungYear = RabByungYear.fromYear(2023);
        // 得到2023
        const year: number = y.getYear();
      
2. 当年的闰月月份
返回为数字，代表当年的闰月月份，例如：5代表闰五月，0代表当年没有闰月。

        const y: RabByungYear = RabByungYear.fromYear(2043);
         
        // 5
        const m: number = y.getLeapMonth();
      
3. 当年的总月数
返回为数字，如果当年有闰月，则返回13，无闰月则返回12。

        const y: RabByungYear = RabByungYear.fromYear(2043);
         
        // 13
        const m: number = y.getMonthCount();
      
4. 饶迥序号
从0开始计。

        const y: RabByungYear = RabByungYear.fromYear(1027);
         
        // 0
        const n: number = y.getRabByungIndex();
      
5. 当年的干支
返回为干支 SixtyCycle。

        const y: RabByungYear = RabByungYear.fromYear(1027);
         
        // 丁卯
        const sc: SixtyCycle = y.getSixtyCycle();
      
6. 藏历五行 RabByungElement
藏历五行与五行一致，只是五行的金叫法不同，叫做铁。

        const y: RabByungYear = RabByungYear.fromYear(1027);
         
        // 火
        const e: RabByungElement = y.getElement();
      
7. 生肖 Zodiac
        const y: RabByungYear = RabByungYear.fromYear(1027);
         
        // 兔
        const z: Zodiac = y.getZodiac();
      
8. 藏历年转公历年 SolarYear
        const y: RabByungYear = RabByungYear.fromYear(1027);
         
        // 1027年
        const year: SolarYear = y.getSolarYear();
      
9. 首月
返回为正月(藏历月 RabByungMonth)。

        const y: RabByungYear = RabByungYear.fromYear(1027);
         
        // 第一饶迥火兔年正月
        const m: RabByungMonth = y.getFirstMonth();
      
8. 藏历月列表
返回为藏历月 RabByungMonth的列表，从正月到十二月，包含闰月。

        const y: RabByungYear = RabByungYear.fromYear(1027);
        const months: RabByungMonth[] = y.getMonths();
      
藏历月 RabByungMonth
藏历月比较特殊，虽然和农历类似，从初一到三十，但是可能出现缺日（例如：初五之后直接初七）和闰日（例如：2个初五）的情况，所以藏历月天数不固定，和农历基本对不上。

如何得到藏历月？
1. 从藏历年、月初始化
参数藏历年，支持从1950到2050年；参数藏历月，支持1到12，如果为闰月的，使用负数，即-3代表闰三月。藏历月仅支持藏历1950年十二月至藏历2050年十二月。

        const m: RabByungMonth = RabByungMonth.fromYm(1950, 12);
      
2. 从藏历日 RabByungDay得到藏历月
        // 第十六饶迥铁虎年十二月初一
        const d: RabByungDay = RabByungDay.fromYmd(1950, 12, 1);
        const m: RabByungMonth = d.getRabByungMonth();
      
从藏历月可以得到些什么？
1. 藏历年 RabByungYear
        const m: RabByungMonth = RabByungMonth.fromYm(1950, 12);
        const y: RabByungYear = m.getRabByungYear();
      
2. 月
返回为月份数字，范围为1到12，如闰七月也返回7。

        const m: RabByungMonth = RabByungMonth.fromYm(1950, 12);
        // 12
        const month: number = m.getMonth();
      
3. 月(支持闰月)
返回为月份数字，范围为1到12，闰月为负数，如闰7月返回-7。

        const m: RabByungMonth = RabByungMonth.fromYm(2043, -5);
        // -5
        const month: number = m.getMonthWithLeap();
      
4. 是否闰月
返回为布尔值，闰月返回true，非闰月返回false。

        const m: RabByungMonth = RabByungMonth.fromYm(2043, -5);
        // true
        const leap: bool = m.isLeap();
      
5. 别名
藏历每月有别名，如正月也称神变月，二月也称苦行月，后续类推为：具香月、萨嘎月、作净月、明净月、具醉月、具贤月、天降月、持众月、庄严月、满意月。

        const m: RabByungMonth = RabByungMonth.fromYm(2043, -5);
        // 闰作净月
        const alias: string = m.getAlias();
      
6. 位于当年的月索引
返回为数字，范围0到12，正月为0，依次类推，例如五月索引值为4，闰五月索引值为5。

        const m: RabByungMonth = RabByungMonth.fromYm(2043, 1);
        // 0
        const index: number = m.getIndexInYear();
      
7. 当月的总天数
返回为数字，因存在闰日和缺日的情况，天数不固定。

        /const m: RabByungMonth = RabByungMonth.fromYm(2043, 1);
        const n: number = m.getDayCount();
      
8. 闰日列表
将当月闰日的日期返回为数字列表，如闰初五和闰十一，则返回5和11。

        /const m: RabByungMonth = RabByungMonth.fromYm(2043, 1);
        const days: number[] = m.getLeapDays();
      
9. 缺日列表
将当月缺日的日期返回为数字列表，如缺初五和十一，则返回5和11。

        /const m: RabByungMonth = RabByungMonth.fromYm(2043, 1);
        const days: number[] = m.getMissDays();
      
10. 首日
返回为初一的藏历日 RabByungDay。

        const m: RabByungMonth = RabByungMonth.fromYm(2043, 1);
        const d: RabByungDay = m.getFirstDay();
      
11. 藏历日列表
返回为藏历日 RabByungDay的列表，从初一开始。

        const m: RabByungMonth = RabByungMonth.fromYm(2043, 1);
        const days: RabByungDay[] = m.getDays();
      
藏历月历示例如下：

2025年7月
一二三四五六日
30
初五
1
初六
2
初七
3
初八
4
初九
5
初十
6
十一
7
十二
8
十三
9
十四
10
十五
11
十六
12
十七
13
十八
14
十九
15
二十
16
廿一
17
廿二
18
廿三
19
廿四
20
廿五
21
廿六
22
廿七
23
廿九
24
三十
25
六月
26
初二
27
初三
28
初四
29
初五
30
初六
31
初七
1
初八
2
初九
3
闰初九
藏历日 RabByungDay
藏历日仅支持藏历1950年十二月初一（公历1951年1月8日）至藏历2050年十二月三十（公历2051年2月11日）。

如何得到藏历日？
1. 从藏历年、月、日初始化
参数藏历年，支持从1950-2051年；参数藏历月，支持1到12，如果为闰月的，使用负数，即-3代表闰三月；参数藏历日，支持1到30，闰日为负数，即-3代表闰初三。

        // 第十六饶迥铁虎年十二月初一
        const d: RabByungDay = RabByungDay.fromYmd(1950, 12, 1);
      
2. 从公历日 SolarDay转藏历日
        // 公历1951年1月8日
        const sd: SolarDay = SolarDay.fromYmd(1951, 1, 8);
        // 第十六饶迥铁虎年十二月初一
        const d: RabByungDay = sd.getRabByungDay();
      
从藏历日可以得到些什么？
1. 藏历月 RabByungMonth
        const d: RabByungDay = RabByungDay.fromYmd(1950, 12, 1);
        // 第十六饶迥铁虎年十二月
        const m: RabByungMonth = d.getRabByungMonth();
      
2. 日
返回为数字，范围1到30，闰日也为正数。

        const d: RabByungDay = RabByungDay.fromYmd(1950, 12, -16);
        // 16
        const day: number = d.getDay();
      
3. 日
返回为数字，范围1到30，当日为闰日时，返回负数。

        const d: RabByungDay = RabByungDay.fromYmd(1950, 12, -16);
        // -16
        const day: number = d.getDayWithLeap();
      
4. 是否闰日
        const d: RabByungDay = RabByungDay.fromYmd(1950, 12, -16);
        // true
        const leap: bool = d.isLeap();
      
5. 相差天数
        const d1: RabByungDay = RabByungDay.fromYmd(1950, 12, -16);
        const d2: RabByungDay = RabByungDay.fromYmd(1950, 12, 16);
        // 1
        const days: number = d1.subtract(d2);
      
6. 藏历日转公历日 SolarDay
        // 第十六饶迥铁虎年十二月闰十六
        const d: RabByungDay = RabByungDay.fromYmd(1950, 12, -16);
         
        // 1951年1月24日
        const sd: SolarDay = d.getSolarDay();
      
干支年 SixtyCycleYear
干支年从立春开始，至下个立春前结束。通常在民间，用于八字、流年等。

如何得到干支年？
1. 从年初始化
参数为干支年，支持从-1到9999年。

        const y: SixtyCycleYear = SixtyCycleYear.fromYear(2023);
      
2. 从干支月 SixtyCycle得到干支年
        // 2023年寅月
        const m: SixtyCycleMonth = SixtyCycleMonth.fromIndex(2023, 0);
        const y: SixtyCycleYear = m.getSixtyCycleYear();
      
从干支年可以得到些什么？
1. 年
返回为干支年数字，范围为-1到9999。

        const y: SixtyCycleYear = SixtyCycleYear.fromYear(2023);
        // 得到2023
        const year: number = y.getYear();
      
2. 当年的干支
返回为干支 SixtyCycle。

        const y: SixtyCycleYear = SixtyCycleYear.fromYear(2023);
        const sc: SixtyCycle = y.getSixtyCycle();
      
3. 运
返回为运 Twenty。

        const y: SixtyCycleYear = SixtyCycleYear.fromYear(2023);
        const t: Twenty = y.getTwenty();
      
4. 九星
返回为九星 NineStar。

        const y: SixtyCycleYear = SixtyCycleYear.fromYear(2023);
        const ns: NineStar = y.getNineStar();
      
5. 太岁方位
返回为方位 Direction。

        const y: SixtyCycleYear = SixtyCycleYear.fromYear(2023);
        const d: Direction = y.getJupiterDirection();
      
6. 干支月列表
返回为干支月 SixtyCycleMonth的列表，从寅月到丑月，共12个月。

        const y: SixtyCycleYear = SixtyCycleYear.fromYear(2023);
        const ms: SixtyCycleMonth[] = y.getMonths();
      
干支月 SixtyCycleMonth
干支月以节令开始，到下个节令前结束。

如何得到干支月？
1. 从干支年、月索引初始化
参数干支年，支持从-1到9999年；参数月索引，支持0到11，0代表寅月。

        const m: SixtyCycleMonth = SixtyCycleMonth.fromIndex(2023, 0);
      
2. 从干支日 SixtyCycleDay得到干支月
        const d: SixtyCycleDay = SolarDay.fromYmd(2023, 1, 1).getSixtyCycleDay();
        const m: SixtyCycleMonth = d.getSixtyCycleMonth();
      
从干支月可以得到些什么？
1. 干支年
返回为干支年 SixtyCycleYear。

        // 2023年寅月
        const m: SixtyCycleMonth = SixtyCycleMonth.fromIndex(2023, 0);
        const y: SixtyCycleYear = m.getSixtyCycleYear();
      
2. 年柱
返回为年的干支 SixtyCycle。

        // 2025年寅月
        const m: SixtyCycleMonth = SixtyCycleMonth.fromIndex(2025, 0);
        // 乙巳
        const y: SixtyCycle = m.getYear();
      
3. 月柱
返回为月的干支 SixtyCycle。

        // 2025年寅月
        const m: SixtyCycleMonth = SixtyCycleMonth.fromIndex(2025, 0);
        // 戊寅
        const sc: SixtyCycle = m.getSixtyCycle();
      
4. 位于当年的月索引
返回为数字，范围0到11，寅月为0，依次类推。

        // 2025年寅月
        const m: SixtyCycleMonth = SixtyCycleMonth.fromIndex(2025, 0);
        // 0
        const i: number = m.getIndexInYear();
      
5. 九星
返回为九星 NineStar。

        // 2025年寅月
        const m: SixtyCycleMonth = SixtyCycleMonth.fromIndex(2025, 0);
        const ns: NineStar = m.getNineStar();
      
6. 太岁方位
返回为方位 Direction。

        // 2025年寅月
        const m: SixtyCycleMonth = SixtyCycleMonth.fromIndex(2025, 0);
        const d: Direction = m.getJupiterDirection();
      
7. 首日
返回为干支日 SixtyCycleDay，即节令当天。

        // 2025年寅月
        const m: SixtyCycleMonth = SixtyCycleMonth.fromIndex(2025, 0);
        const d: SixtyCycleDay = m.getFirstDay();
      
8. 干支日列表
返回为干支日 SixtyCycleDay的列表，从节令当天开始。

        // 2025年寅月
        const m: SixtyCycleMonth = SixtyCycleMonth.fromIndex(2025, 0);
        const days: SixtyCycleDay[] = m.getDays();
      
干支日 SixtyCycleDay
如何得到干支日？
1. 从干支时辰 SixtyCycleHour得到干支日
        // 农历2023年正月初一 13:00:00对应的干支时辰
        const h: SixtyCycleHour = LunarHour.fromYmdHms(2023, 1, 1, 13, 0, 0).getSixtyCycleHour();
        const d: SixtyCycleDay = h.getSixtyCycleDay();
      
2. 从公历日 SolarDay转干支日
        // 公历2024年2月9日
        const d: SolarDay = SolarDay.fromYmd(2024, 2, 9);
        // 甲辰年丙寅月癸卯日
        const scd: SixtyCycleDay = d.getSixtyCycleDay();
      
3. 从农历日 LunarDay转干支日
        // 农历癸卯年十二月三十
        const d: LunarDay = LunarDay.fromYmd(2023, 12, 30);
        // 甲辰年丙寅月癸卯日
        const scd: SixtyCycleDay = d.getSixtyCycleDay();
      
从干支日可以得到些什么？
1. 干支月 SixtyCycleMonth
        // 农历癸卯年十二月三十 转干支日 甲辰年丙寅月癸卯日
        const d: SixtyCycleDay = LunarDay.fromYmd(2023, 12, 30).getSixtyCycleDay();
        // 丙寅月
        const m: SixtyCycleMonth = d.getSixtyCycleMonth();
      
2. 年柱
当天所属的干支年干支，以立春换年。返回为干支 SixtyCycle。

        // 农历癸卯年十二月三十 转干支日 甲辰年丙寅月癸卯日
        const d: SixtyCycleDay = LunarDay.fromYmd(2023, 12, 30).getSixtyCycleDay();
        // 甲辰
        const y: SixtyCycle = d.getYear();
      
3. 月柱
当天所属的干支月干支，以节令换月。返回为干支 SixtyCycle。

        // 农历癸卯年十二月三十 转干支日 甲辰年丙寅月癸卯日
        const d: SixtyCycleDay = LunarDay.fromYmd(2023, 12, 30).getSixtyCycleDay();
        // 丙寅
        const m: SixtyCycle = d.getMonth();
      
4. 日柱
当天的干支，返回为干支 SixtyCycle。

        // 农历癸卯年十二月三十 转干支日 甲辰年丙寅月癸卯日
        const d: SixtyCycleDay = LunarDay.fromYmd(2023, 12, 30).getSixtyCycleDay();
        // 癸卯
        const sc: SixtyCycle = d.getSixtyCycle();
      
5. 九星
返回为九星 NineStar。

        // 农历癸卯年十二月三十 转干支日 甲辰年丙寅月癸卯日
        const d: SixtyCycleDay = LunarDay.fromYmd(2023, 12, 30).getSixtyCycleDay();
        const ns: NineStar = d.getNineStar();
      
6. 太岁方位
返回为方位 Direction。

        // 农历癸卯年十二月三十 转干支日 甲辰年丙寅月癸卯日
        const d: SixtyCycleDay = LunarDay.fromYmd(2023, 12, 30).getSixtyCycleDay();
        const jd: Direction = d.getJupiterDirection();
      
7. 建除十二值神
返回为建除十二值神 Duty。

        // 农历癸卯年十二月三十 转干支日 甲辰年丙寅月癸卯日
        const d: SixtyCycleDay = LunarDay.fromYmd(2023, 12, 30).getSixtyCycleDay();
        const duty: Duty = d.getDuty();
      
8. 黄道黑道十二神
返回为黄道黑道十二神 TwelveStar。

        // 农历癸卯年十二月三十 转干支日 甲辰年丙寅月癸卯日
        const d: SixtyCycleDay = LunarDay.fromYmd(2023, 12, 30).getSixtyCycleDay();
        const t: TwelveStar = d.getTwelveStar();
      
9. 逐日胎神
返回为逐日胎神 FetusDay。

        // 农历癸卯年十二月三十 转干支日 甲辰年丙寅月癸卯日
        const d: SixtyCycleDay = LunarDay.fromYmd(2023, 12, 30).getSixtyCycleDay();
        const f: FetusDay = d.getFetusDay();
      
10. 二十八宿
返回为二十八宿 TwentyEightStar。

        // 农历癸卯年十二月三十 转干支日 甲辰年丙寅月癸卯日
        const d: SixtyCycleDay = LunarDay.fromYmd(2023, 12, 30).getSixtyCycleDay();
        const star: TwentyEightStar = d.getTwentyEightStar();
      
11. 当天的时辰列表
从23:00开始到23:00之前的12个干支时辰 SixtyCycleHour。

        const d: SixtyCycleDay = LunarDay.fromYmd(2023, 12, 30).getSixtyCycleDay();
        const hours: SixtyCycleHour[] = d.getHours();
      
干支时辰 SixtyCycleHour
如何得到干支时辰？
1. 从公历时刻 SolarTime转干支时辰
        // 公历2024年2月9日 13:00:00
        SolarTime t = SolarTime.fromYmdHms(2024, 2, 9, 13, 0, 0);
        // 甲辰年丙寅月癸卯日己未时
        SixtyCycleHour hour = t.getSixtyCycleHour();
      
2. 从农历时辰 LunarHour转干支时辰
        // 农历癸卯年十二月三十 13:00:00
        LunarHour t = LunarHour.fromYmdHms(2023, 12, 30, 13, 0, 0);
        // 甲辰年丙寅月癸卯日己未时
        SixtyCycleHour hour = t.getSixtyCycleHour();
      
从干支时辰可以得到些什么？
1. 干支日 SixtyCycleDay
        // 农历癸卯年十二月三十 13:00:00 转干支时辰 甲辰年丙寅月癸卯日己未时
        SixtyCycleHour h = LunarHour.fromYmdHms(2023, 12, 30, 13, 0, 0).getSixtyCycleHour();
        // 甲辰年丙寅月癸卯日
        SixtyCycleDay d = h.getSixtyCycleDay();
      
2. 位于当天的序号
返回为数字，范围0到11，23:00到00:59为0，以此类推。

        SixtyCycleHour h = LunarHour.fromYmdHms(2023, 12, 30, 23, 0, 0).getSixtyCycleHour();
        // 0
        int index = h.getIndexInDay();
      
3. 年柱
当时所属的干支年干支，以立春具体时刻换年。返回为干支 SixtyCycle。

        SixtyCycleHour h = LunarHour.fromYmdHms(2023, 12, 30, 13, 0, 0).getSixtyCycleHour();
        SixtyCycle y = lunarHour.getYear();
      
4. 月柱
当时所属的农历月干支，以节令具体时刻换月。返回为干支 SixtyCycle。

        SixtyCycleHour h = LunarHour.fromYmdHms(2023, 12, 30, 13, 0, 0).getSixtyCycleHour();
        SixtyCycle m = h.getMonth();
      
5. 日柱
返回为干支 SixtyCycle。注意：23:00开始为第二天日干支。

        SixtyCycleHour h = LunarHour.fromYmdHms(2023, 12, 30, 13, 0, 0).getSixtyCycleHour();
        SixtyCycle d = h.getDay();
      
6. 时辰干支
返回为干支 SixtyCycle。

        SixtyCycleHour h = LunarHour.fromYmdHms(2023, 12, 30, 13, 0, 0).getSixtyCycleHour();
        SixtyCycle sixtyCycle = h.getSixtyCycle();
      
7. 九星
返回为九星 NineStar。

        SixtyCycleHour h = LunarHour.fromYmdHms(2023, 12, 30, 13, 0, 0).getSixtyCycleHour();
        NineStar ns = h.getNineStar();
      
8. 黄道黑道十二神
返回为黄道黑道十二神 TwelveStar。

        SixtyCycleHour h = LunarHour.fromYmdHms(2023, 12, 30, 13, 0, 0).getSixtyCycleHour();
        TwelveStar ts = h.getTwelveStar();
      
9. 八字
23:00-23:59日干支为明天，返回为八字 EightChar。

        SixtyCycleHour h = LunarHour.fromYmdHms(2023, 12, 30, 13, 0, 0).getSixtyCycleHour();
        EightChar eightChar = h.getEightChar();
      
公历年 SolarYear
如何得到公历年？
1. 从年初始化
参数为公历年，支持从1到9999年。

        SolarYear solarYear = SolarYear.fromYear(2024);
      
2. 从公历月 SolarMonth得到公历年
        // 公历2024年2月
        SolarMonth solarMonth = SolarMonth.fromYm(2024, 2);
        SolarYear solarYear = solarMonth.getSolarYear();
      
从公历年可以得到些什么？
1. 年
返回为公历年数字，范围为1到9999。

        SolarYear solarYear = SolarYear.fromYear(2023);
        // 得到2023
        int year = solarYear.getYear();
      
2. 当年的总天数
返回为数字，从1月1日到12月31日的总天数。平年365天，闰年366天，1582年355天。

        SolarYear solarYear = SolarYear.fromYear(2023);
        // 365
        int dayCount = solarYear.getDayCount();
      
3. 当年是否闰年
返回为true/false。

        SolarYear solarYear = SolarYear.fromYear(2023);
        // false
        boolean leap = solarYear.isLeap();
      
4. 公历月列表
返回为公历月 SolarMonth的列表，从1月到12月。

        SolarYear solarYear = SolarYear.fromYear(2023);
        List<SolarMonth> months = solarYear.getMonths();
      
5. 公历半年列表
返回为公历半年 SolarHalfYear的列表，上半年和下半年。

        SolarYear solarYear = SolarYear.fromYear(2023);
        List<SolarHalfYear> halfYears = solarYear.getHalfYears();
      
6. 公历季度列表
返回为公历季度 SolarSeason的列表，一季度、二季度、三季度和四季度。

        SolarYear solarYear = SolarYear.fromYear(2023);
        List<SolarSeason> seasons = solarYear.getSeasons();
      
公历半年 SolarHalfYear
公历半年分为：上半年和下半年。

如何得到公历半年？
1. 从年初始化
参数为公历年和索引，支持从1到9999年，索引值为0或1，0代表上半年，1代表下半年。

        // 2024年上半年
        SolarHalfYear halfYear = SolarHalfYear.fromYear(2024, 0);
      
从公历半年可以得到些什么？
1. 年
返回为公历年数字，范围为1到9999。

        SolarHalfYear halfYear = SolarHalfYear.fromYear(2024, 0);
        // 得到2024
        int year = halfYear.getYear();
      
2. 索引
返回为数字，0代表上半年，1代表下半年。

        SolarHalfYear halfYear = SolarHalfYear.fromYear(2024, 0);
        // 0
        int index = halfYear.getIndex();
      
3. 公历月列表
返回为公历月 SolarMonth的列表，半年为6个月。

        SolarHalfYear halfYear = SolarHalfYear.fromYear(2024, 0);
        List<SolarMonth> months = halfYear.getMonths();
      
4. 公历季度列表
返回为公历季度 SolarSeason的列表，半年为2个季度。

        SolarHalfYear halfYear = SolarHalfYear.fromYear(2024, 0);
        List<SolarSeason> seasons = halfYear.getSeasons();
      
公历季度 SolarSeason
公历季度分为：一季度、二季度、三季度和四季度。

如何得到公历季度？
1. 从年初始化
参数为公历年和索引，支持从1到9999年，索引值为0-3，0代表一季度，3代表四季度。

        // 2024年上半年
        SolarSeason season = SolarSeason.fromYear(2024, 0);
      
2. 从公历月 SolarMonth得到
        SolarMonth solarMonth = SolarMonth.fromYm(2023, 5);
        // 二季度
        SolarSeason season = solarMonth.getSeason();
      
从公历季度可以得到些什么？
1. 年
返回为公历年数字，范围为1到9999。

        SolarSeason season = SolarSeason.fromYear(2024, 0);
        // 得到2024
        int year = season.getYear();
      
2. 索引
返回为数字0-3，0代表一季度，3代表四季度。

        SolarSeason season = SolarSeason.fromYear(2024, 0);
        // 0
        int index = season.getIndex();
      
3. 公历月列表
返回为公历月 SolarMonth的列表，一季度为3个月。

        SolarSeason season = SolarSeason.fromYear(2024, 0);
        List<SolarMonth> months = season.getMonths();
      
公历月 SolarMonth
公历1年有12个月，为1月到12月。

如何得到公历月？
1. 从公历年、月初始化
参数公历年，支持从1到9999年；参数公历月，支持1到12。

        SolarMonth solarMonth = SolarMonth.fromYm(2023, 5);
      
2. 从公历日 SolarDay得到公历月
        // 公历2023年1月1日
        SolarDay solarDay = Solar.fromYmd(2023, 1, 1);
        SolarMonth solarMonth = solarDay.getSolarMonth();
      
从公历月可以得到些什么？
1. 公历年
返回为公历年 SolarYear。

        SolarMonth solarMonth = SolarMonth.fromYm(2023, 5);
        SolarYear solarYear = solarMonth.getSolarYear();
      
2. 月
返回为月份数字，范围为1到12。

        SolarMonth solarMonth = SolarMonth.fromYm(2023, 5);
        // 5
        int month = solarMonth.getMonth();
      
3. 位于当年的月索引
返回为数字，范围0到11，0代表1月，11代表12月。

        SolarMonth solarMonth = SolarMonth.fromYm(2023, 5);
        // 4
        int index = solarMonth.getIndexInYear();
      
4. 当月的总天数
返回为数字，1582年10月只有21天，其余根据小学知识可知。

        SolarMonth solarMonth = SolarMonth.fromYm(2023, 5);
        int dayCount = solarMonth.getDayCount();
      
5. 公历季度
返回为公历季度 SolarSeason。

        SolarMonth solarMonth = SolarMonth.fromYm(2023, 5);
        // 二季度
        SolarSeason season = solarMonth.getSeason();
      
6. 当月有几周
参数为起始星期，1234560分别代表星期一至星期天，返回为数字。

        SolarMonth solarMonth = SolarMonth.fromYm(2023, 5);
        int weekCount = solarMonth.getWeekCount(1);
      
7. 当月的周列表
参数为起始星期，1234560分别代表星期一至星期天，返回为公历周 SolarWeek的列表。

        SolarMonth solarMonth = SolarMonth.fromYm(2023, 5);
        List<SolarWeek> weeks = solarMonth.getWeeks(1);
      
8. 公历日列表
返回为公历日 SolarDay的列表，从1日开始。

        SolarMonth solarMonth = SolarMonth.fromYm(2023, 5);
        List<SolarDay> days = solarMonth.getDays();
      
公历周 SolarWeek
公历一个月最多有6个周，分别为：第一周、第二周、第三周、第四周、第五周、第六周。

如何得到公历周？
1. 通过公历年月的周索引初始化，参数分别为公历年、公历月、周索引、起始星期（1234560分别代表星期一至星期日）
        // 2023年1月第一周，以星期2为一周的开始
        SolarWeek solarWeek = SolarWeek.fromYm(2023, 1, 0, 2);
      
从公历周可以得到些什么？
1. 本周第一天的公历日
返回为公历日 SolarDay。

        SolarWeek solarWeek = SolarWeek.fromYm(2023, 1, 0, 2);
         
        // 2022年12月27日
        SolarDay solarDay = solarWeek.getFirstDay();
      
2. 本周公历日列表
返回为公历日 SolarDay的列表。

        SolarWeek solarWeek = SolarWeek.fromYm(2023, 1, 0, 2);
        List<SolarDay> days = solarWeek.getDays();
      
3. 位于当年的索引
注意：索引值是从0开始，即0代表第一周

        SolarWeek solarWeek = SolarWeek.fromYm(2023, 1, 0, 2);
        // 0
        int index = solarWeek.getIndexInYear();
      
公历日 SolarDay
如何得到公历日？
1. 从公历年、月、日初始化
参数公历年，支持从1到9999年；参数公历月，支持1到12；参数公历日，支持1到31。

        // 公历2023年1月1日
        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
      
2. 从公历时刻 SolarTime得到公历日
        // 公历2023年1月1日 13:00:00
        SolarTime solarTime = SolarTime.fromYmdHms(2023, 1, 1, 13, 0, 0);
        SolarDay solarDay = solarTime.getSolarDay();
      
3. 从农历日 LunarDay转公历日
        // 农历癸卯年十二月三十
        LunarDay lunarDay = LunarDay.fromYmd(2023, 12, 30);
        // 公历2024年2月9日
        SolarDay solarDay = lunarDay.getSolarDay();
      
4. 从儒略日 JulianDay转公历日
        JulianDay julianDay = JulianDay.fromJulianDay(2451545);
        // 公历2000年1月1日
        SolarDay solarDay = julianDay.getSolarDay();
      
从公历日可以得到些什么？
1. 公历月 SolarMonth
        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        // 1月
        SolarMonth solarMonth = solarDay.getSolarMonth();
      
2. 日
返回为数字，范围1到31。

        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        // 1
        int day = solarDay.getDay();
      
3. 星期 Week
        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        Week week = solarDay.getWeek();
      
4. 公历周 SolarWeek
获取当天所在的公历周，参数为起始星期，1234560分别代表星期一至星期天。

        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        // 2023年1月第一周
        SolarWeek solarWeek = solarDay.getSolarWeek(0);
      
5. 星座 Constellation
        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        Constellation constellation = solarDay.getConstellation();
      
6. 当天所在的节气 SolarTerm
        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        SolarTerm term = solarDay.getTerm();
      
7. 当天所在的七十二候 PhenologyDay
        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        PhenologyDay phenologyDay = solarDay.getPhenologyDay();
      
8. 当天所在的三伏天 DogDay
        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        DogDay dogDay = solarDay.getDogDay();
      
9. 当天所在的数九天 NineDay
        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        NineDay nineDay = solarDay.getNineDay();
      
10. 位于当年的索引
        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        int index = solarDay.getIndexInYear();
      
11. 公历现代节日
返回为公历现代节日 SolarFestival，当天无节日返回null。

        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        // 元旦
        SolarFestival festival = solarDay.getFestival();
      
12. 法定假日
返回为法定假日 LegalHoliday，当天不是法定假日返回null。

        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        LegalHoliday festival = solarDay.getLegalHoliday();
      
13. 公历日转农历日
返回为农历日 LunarDay。

        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        LunarDay lunarDay = solarDay.getLunarDay();
      
14. 公历日转儒略日
返回为儒略日 JulianDay。

        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        JulianDay julianDay = solarDay.getJulianDay();
      
15. 公历日前后比较
        SolarDay a = SolarDay.fromYmd(2023, 1, 1);
        SolarDay b = SolarDay.fromYmd(2023, 1, 2);

        // a在b之前吗？这里返回true
        boolean aIsBeforeB = a.isBefore(b);
         
        // a在b之后吗？这里返回false
        boolean aIsAfterB = a.isAfter(b);
      
16. 公历日相减
返回为两个公历日之间相差的天数。

        // -1
        int days = SolarDay.fromYmd(2023, 1, 1).subtract(SolarDay.fromYmd(2023, 1, 2));
      
17. 当天所在的梅雨天 PlumRainDay
        SolarDay solarDay = SolarDay.fromYmd(2024, 6, 11);
        // 入梅第1天
        PlumRainDay plumRainDay = solarDay.getPlumRainDay();

        solarDay = SolarDay.fromYmd(2024, 7, 6);
        // 出梅
        plumRainDay = solarDay.getPlumRainDay();

        solarDay = SolarDay.fromYmd(2024, 6, 10);
        // null
        plumRainDay = solarDay.getPlumRainDay();
      
公历时刻 SolarTime
如何得到公历时刻？
1. 从公历年、月、日、时、分、秒初始化
参数公历年，支持从1到9999年；参数公历月，支持1到12；参数公历日，支持1到31；时为0-23；分为0-59；秒为0-59。

        // 2023年1月1日 13:00:00
        SolarTime solarTime = SolarTime.fromYmdHms(2023, 1, 1, 13, 0, 0);
      
2. 从农历时辰 LunarHour转公历时刻
        // 农历癸卯年十二月三十 未时
        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 12, 30, 13, 0, 0);
        // 2024年2月9日 13:00:00
        SolarTime solarTime = lunarHour.getSolarTime();
      
3. 从儒略日 JulianDay转公历时刻
        JulianDay julianDay = JulianDay.fromJulianDay(2451545);
        // 公历2000年1月1日 12:00:00
        SolarTime solarTime = julianDay.getSolarTime();
      
从公历时刻可以得到些什么？
1. 公历日 SolarDay
        SolarTime solarTime = SolarTime.fromYmdHms(2023, 1, 1, 13, 0, 0);
        // 2023年1月1日
        SolarDay solarDay = solarTime.getSolarDay();
      
2. 时
返回为数字，范围0到23。

        SolarTime solarTime = SolarTime.fromYmdHms(2023, 1, 1, 13, 0, 0);
        // 13
        int hour = solarTime.getHour();
      
3. 分
返回为数字，范围0到59。

        SolarTime solarTime = SolarTime.fromYmdHms(2023, 1, 1, 13, 5, 0);
        // 5
        int minute = solarTime.getMinute();
      
4. 秒
返回为数字，范围0到59。

        SolarTime solarTime = SolarTime.fromYmdHms(2023, 1, 1, 13, 5, 20);
        // 20
        int second = solarTime.getSecond();
      
5. 当时所在的节气 SolarTerm
        SolarTime solarTime = SolarTime.fromYmdHms(2023, 1, 1, 13, 5, 20);
        SolarTerm term = solarTime.getTerm();
      
6. 公历时刻转农历时辰
返回为农历时辰 LunarHour。

        SolarTime solarTime = SolarTime.fromYmdHms(2023, 1, 1, 13, 5, 20);
        LunarHour lunarHour = solarTime.getLunarHour();
      
7. 公历时刻转儒略日
返回为儒略日 JulianDay。

        SolarTime solarTime = SolarTime.fromYmdHms(2023, 1, 1, 13, 5, 20);
        JulianDay julianDay = solarTime.getJulianDay();
      
8. 公历时刻前后比较
        SolarTime a = SolarTime.fromYmdHms(2023, 1, 1, 0, 0, 0);
        SolarTime b = SolarTime.fromYmdHms(2023, 1, 1, 1, 0, 0);

        // a在b之前吗？这里返回true
        boolean aIsBeforeB = a.isBefore(b);
         
        // a在b之后吗？这里返回false
        boolean aIsAfterB = a.isAfter(b);
      
9. 公历时刻相减
返回为两个公历时刻之间相差的秒数。

        // -3600
        int seconds =  SolarTime.fromYmdHms(2023, 1, 1, 0, 0, 0).subtract(SolarTime.fromYmdHms(2023, 1, 1, 1, 0, 0));
      
生肖 Zodiac轮回
十二生效依次为：鼠、牛、虎、兔、龙、蛇、马、羊、猴、鸡、狗、猪。

如何得到生肖？
1. 通过地支 EarthBranch得到
        // 鼠
        Zodiac zodiac = EarthBranch.fromName("子").getZodiac();
      
从生肖可以得到些什么？
1. 生肖转地支
返回为地支 EarthBranch。

        Zodiac zodiac = Zodiac.fromName("牛");
         
        // 丑
        EarthBranch earthBranch = zodiac.getEarthBranch();
      
月相 Phase轮回
月相从农历初一开始，依次为：朔月、既朔月、蛾眉新月、蛾眉新月、蛾眉月、夕月、上弦月、上弦月、九夜月、宵月、宵月、宵月、渐盈凸月、小望月、望月、既望月、立待月、居待月、寝待月、更待月、渐亏凸月、下弦月、下弦月、有明月、有明月、蛾眉残月、蛾眉残月、残月、晓月、晦月。

如何得到月相？
1. 通过农历日 LunarDay得到
        // 朔月
        Phase phase = LunarDay.fromYmd(2000, 1, 1).getPhase();
      
星座 Constellation轮回
星座依次为：白羊、金牛、双子、巨蟹、狮子、处女、天秤、天蝎、射手、摩羯、水瓶、双鱼。

如何得到星座？
1. 通过公历日 SolarDay得到
        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        Constellation constellation = solarDay.getConstellation();
      
节气 SolarTerm轮回
节气依次为：冬至、小寒、大寒、立春、雨水、惊蛰、春分、清明、谷雨、立夏、小满、芒种、夏至、小暑、大暑、立秋、处暑、白露、秋分、寒露、霜降、立冬、小雪、大雪。节气的初始化需要带上公历年份：

1. 通过索引值进行初始化
调用fromIndex(year, index)得到其对象。year为公历年，当传入2013年时，取到的冬至，实际上是在2012年，这里一定要注意；index为数字，从0开始，当索引值越界时，会自动轮回偏移。

        // 2013年的第1个节气：冬至
        SolarTerm term = SolarTerm.fromIndex(2013, 0);
      
2. 通过名称进行初始化
调用fromName(year, name)得到其对象。year为公历年，当传入2013年时，取到的冬至，实际上是在2012年，这里一定要注意；name为字符串，当名称不存在时，会抛出参数异常。

        // 2013年的立春
        SolarTerm term = SolarTerm.fromName(2013, '立春');
      
3. 通过公历日得到当天所在节气
        SolarDay solarDay = SolarDay.fromYmd(2023, 1, 1);
        SolarTerm term = solarDay.getTerm();
      
也可以知道指定公历日位于节气的第几天：

        SolarDay solarDay = SolarDay.fromYmd(2023, 12, 7);
         
        // 大雪第1天
        SolarTermDay termDay = solarDay.getTermDay();
         
        // 0
        int dayIndex = termDay.getDayIndex();
      
4. 通过公历时刻得到当时所在节气
        SolarTime solarTime = SolarTime.fromYmdHms(2023, 1, 1, 13, 5, 20);
        SolarTerm term = solarTime.getTerm();
      
从节气可以得到些什么？
1. 是否节令
isJie()返回为true或false。

        SolarTerm term = SolarTerm.fromName(2013, '冬至');
         
        // false
        boolean isJie = term.isJie();
      
2. 是否气令
isQi()返回为true或false。

        SolarTerm term = SolarTerm.fromName(2013, '冬至');
         
        // true
        boolean isJie = term.isQi();
      
3. 儒略日
getJulianDay()返回为儒略日 JulianDay。

        SolarTerm term = SolarTerm.fromName(2013, '冬至');
         
        JulianDay julianDay = term.getJulianDay();
      
儒略日 JulianDay
儒略日可以通过以下几种方式得到：

1. 通过儒略日数值进行初始化
调用fromJulianDay(jd)得到其对象。jd为小数。

        // 公历2023年1月1日
        JulianDay julianDay = JulianDay.fromJulianDay(2459945.5);
      
2. 通过公历年月日时分秒进行初始化
调用fromYmdHms(year, month, day, hour, minute, second)得到其对象。

        JulianDay julianDay = JulianDay.fromYmdHms(2023, 1, 1, 0, 0, 0);
      
3. 通过公历日 SolarDay转换而来。
        JulianDay julianDay = SolarDay.fromYmd(2023, 1, 1).getJulianDay();
      
4. 通过公历时刻 SolarTime转换而来。
        JulianDay julianDay = SolarTime.fromYmdHms(2023, 1, 1, 12, 30, 0).getJulianDay();
      
从儒略日可以得到些什么？
1. 数值
getDay()返回小数。

        JulianDay julianDay = SolarDay.fromYmd(2023, 1, 1).getJulianDay();
         
        // 2459945.5
        double jd = julianDay.getDay();
      
2. 公历日
getSolarDay()返回公历日 SolarDay。

        JulianDay julianDay = JulianDay.fromJulianDay(2459945.5);
         
        // 2023年1月1日
        SolarDay solarDay = julianDay.getSolarDay();
      
3. 公历时刻
getSolarDay()返回公历时刻 SolarTime。

        JulianDay julianDay = JulianDay.fromJulianDay(2459945.5);
         
        // 2023年1月1日 00:00:00
        SolarTime solarTime = julianDay.getSolarTime();
      
4. 星期
通过儒略日计算的星期是最准的，基姆拉尔森和蔡勒公式计算星期的准确性，在儒略日面前都是弟弟，不服来辩。

getWeek()返回星期 Week。

        JulianDay julianDay = JulianDay.fromJulianDay(2459945.5);
         
        // 日
        Week week = julianDay.getWeek();
      
法定假日 LegalHoliday
法定假日有：元旦节、春节、清明节、劳动节、端午节、中秋节、国庆节、国庆中秋、抗战胜利日。仅支持2002年(含)至2025年(含)的法定假日。可以通过公历日 SolarDay得到，也可指定年、月、日得到。

        SolarDay solarDay = SolarDay.fromYmd(2023, 10, 1);

        // 国庆节
        LegalHoliday holiday = solarDay.getLegalHoliday();
         
        // 国庆节
        holiday = LegalHoliday.fromYmd(2023, 10, 1);
        
        // 非法定假日，返回null
        holiday = LegalHoliday.fromYmd(2023, 4, 20); 
      
调休怎么判断？
通过调用法定假日的isWork()方法得到当天是否上班。

        // 春节
        LegalHoliday holiday = LegalHoliday.fromYmd(2024, 2, 4);

        // true，代表要上班
        boolean woek = holiday.isWork();
      
如何更新法定假日的数据？
法定假日指国家规定的放假和调休安排，来源于国务院办公厅发布的国办发明电文件。可前往http://www.gov.cn/zhengce/xxgk/index.htm搜索节假日。一般是每年11月底12月初发布来年的节假日安排。

目前仅支持从2001年12月29日到2025年12月31日的法定假日安排，一般可以有两种方式更新法定假日数据：

1. Tyme发布新版本时更新，如果未及时更新，欢迎催更。

2. 自己维护节假日数据，可通过LegalHoliday.DATA = "节假日数据";来简单粗暴的替换Tyme的所有节假日数据。

数据格式为将每一个法定节假日数据直接拼接为一个长字符串，每个法定假日长度固定位13，如：2001122900+03

8位：yyyyMMdd格式的日期（20011229为2001年12月29日）；
1位：0代表上班，1代表放假（0为上班）；
1位：名称索引，0元旦节 1春节 2清明节 3劳动节 4端午节 5中秋节 6国庆节 7国庆中秋 8抗战胜利日（0为元旦节）；
1位：+节假日位于当天之后，-节假日位于当天之前（+为元旦节在2001年12月29日之后）；
2位：节假日相对于当天的偏移天数，不足10天的需补0（03为元旦节在2001年12月29日之后第3天）。
如何实现放假倒计时？
通过next(1)获取下一个法定假日，相同假期名称且不上班的，取第一天。

        // javascript
        // 设置最多10条
        var size = 10;
         
        // 取今天
        var now = new Date();
        var year = now.getFullYear();
        var today = SolarDay.fromYmd(year, now.getMonth() + 1, now.getDate());
         
        var name = null;
        var l = [];
         
        // 元旦节当天肯定放假
        var holiday = LegalHoliday.fromYmd(year, 1, 1);
        while (holiday && size > 0) {
          var nm = holiday.getName();
          if (nm != name && !holiday.isWork() && holiday.getDay().isAfter(today)) {
            l.push(holiday);
            name = nm;
            size--;
          }
          holiday = holiday.next(1);
        }
         
        for (var i = 0, j = l.length; i < j; i++) {
          var h = l[i];
          console.log('距 ' + h.getName() + '放假 还有 ' + (h.getDay().subtract(today) - 1) + ' 天');
        }
      
如果只取一个最近的法定假日，就简单许多。

        // javascript         
        // 取今天
        var now = new Date();
        var year = now.getFullYear();
        var today = SolarDay.fromYmd(year, now.getMonth() + 1, now.getDate());
         
        // 元旦节当天肯定放假
        var holiday = LegalHoliday.fromYmd(year, 1, 1);
        while (holiday) {
          if (!holiday.isWork() && holiday.getDay().isAfter(today)) {
            console.log('距 ' + holiday.getName() + '放假 还有 ' + (holiday.getDay().subtract(today) - 1) + ' 天');
            break;
          }
          holiday = holiday.next(1);
        }
      
距 国庆中秋放假 还有 86 天

公历现代节日 SolarFestival
公历现代节日有：元旦、三八妇女节、植树节、五一劳动节、五四青年节、六一儿童节、建党节、八一建军节、教师节、国庆节。可以通过公历日 SolarDay得到，也可指定年、月、日得到，也可指定索引得到。

        // 元旦
        SolarFestival festival = SolarDay.fromYmd(2023, 1, 1).getFestival();

        // 2023年第1个公历现代节日，元旦
        festival = SolarFestival.fromIndex(2023, 0);
         
        // 非公历现代节日，返回null
        festival = SolarDay.fromYmd(2023, 1, 20).getFestival();

        // 非公历现代节日，返回null
        festival = SolarFestival.fromYmd(2023, 4, 20);
      
公历现代节日都设有起始年，你可以用getStartYear()得到。

        // 元旦
        SolarFestival festival = SolarDay.fromYmd(2023, 1, 1).getFestival();
         
        // 1950
        int startYear = festival.getStartYear();
      
农历传统节日 LunarFestival
农历传统节日有：春节、元宵节、龙头节、上巳节、清明节、端午节、七夕节、中元节、中秋节、重阳节、冬至节、腊八节、除夕。可以通过农历日 LunarDay得到，也可指定农历年、月、日得到，也可指定索引得到。

        // 元宵节
        LunarFestival festival = LunarDay.fromYmd(2023, 1, 15).getFestival();
         
        // 2023年第1个农历传统节日，春节
        festival = LunarFestival.fromIndex(2023, 0);
         
        // 非农历传统节日，返回null
        festival = LunarDay.fromYmd(2023, 1, 2).getFestival();

        // 非农历传统节日，返回null
        festival = LunarFestival.fromYmd(2023, 1, 2);
      
星期 Week轮回
星期依次为：日、一、二、三、四、五、六。如下代码可指定从周几开始输出一周：

        // 以周一为起点
        int startIndex = 1;
        Week week = Week.fromIndex(startIndex);
        for (int i = 0; i < 7; i++) {
          System.out.println(week);
          // 往后推1天
          week = week.next(1);
        }
      
三候 ThreePhenology轮回
每个节气持续15天左右，每隔5天为一候，因此从节气日开始，分别为初候、二候、三候。

如何得到三候？
1. 从公历日 SolarDay初始化
        // 初候
        ThreePhenology threePhenology = SolarDay.fromYmd(2020, 4, 23).getPhenologyDay().getPhenology().getThreePhenology();
      
三伏天 DogDay
三伏，是初伏、中伏和末伏的统称，是一年中最热的时节。

民谚云：“夏至三庚入伏，冬至逢壬数九。”

三伏即是从夏至后第3个庚日算起，初伏为10天，中伏为10天或20天，末伏为10天。当夏至与立秋之间出现4个庚日时中伏为10天，出现5个庚日则为20天。

如何得到三伏天？
1. 从公历日 SolarDay初始化
        // 末伏第2天
        DogDay dogDay = SolarDay.fromYmd(2012, 8, 8).getDogDay();
      
五行 Element轮回
五行依次为：木、火、土、金、水。

1. 我生的
        Element me = Element.fromName("火");
         
        // 土 （火生土）
        Element el = me.getReinforce();
      
2. 我克的
        Element me = Element.fromName("金");
         
        // 木 （金克木）
        Element el = me.getRestrain();
      
3. 生我的
        Element me = Element.fromName("土");
         
        // 火 （火生土）
        Element el = me.getReinforced();
      
4. 克我的
        Element me = Element.fromName("木");
         
        // 金 （金克木）
        Element el = me.getRestrained();
      
六曜 SixStar轮回
六曜是中国传统历法中的一种注文，用以标示每日的凶吉。它起源于中国，据传由诸葛亮首创，称为“孔明六曜星”，主要用于军事韬略。但实际上，六曜是否形成于三国时期尚无定论，另一说认为六曜为唐代李淳风所创。后来传至日本，并于当地流行，在中国则日渐式微。历代版本有所转变，现时的版本分为先胜、友引、先负、佛灭、大安和赤口六种。

大安是六曜中最为吉利的一天，可以说在一整天的任何时间段都是吉利的。

友引仅次于大吉，仅在正午（11时-13时）为凶。

先胜和先负为一对，分别为上午吉和下午吉。上午吉，因此叫作先胜（早即赢），上午不吉，因此叫作先负（早即输）。日本人认为先胜日很适合博一把赌输赢，因此会把运动会和各类比赛放到这一天。而在先负日则期待平稳度过。

赤口被认为是凶日，做什么都不好，只有在短暂的正午(11时-13时)是吉利的。

佛灭则是六曜当中最不吉利的一天。

        // 友引
        SixStar sixStar = SolarDay.fromYmd(2020, 4, 10).getLunarDay().getSixStar();
      
小六壬 MinorRen轮回
小六壬是一种传统的中国占卜方法，它使用一种特殊的掌诀系统来预测未来的事件。小六壬的占卜过程涉及六个掌诀位，分别是大安、留连、速喜、赤口、小吉和空亡，这些掌诀位代表了占卜的不同结果和事物的吉凶。

如何得到小六壬？
1. 从农历月 LunarMonth、农历日 LunarDay、农历时辰 LunarHour得到
        // 速喜
        MinorRen minorRen = LunarMonth.fromYm(1991, 3).getMinorRen();

        // 大安
        MinorRen minorRen = LunarDay.fromYmd(2024, 3, 5).getMinorRen();

        // 留连
        MinorRen minorRen = LunarHour.fromYmdHms(2024, 9, 7, 10, 0, 0).getMinorRen();
      
从小六壬可以得到些什么？
1. 吉凶 Luck
大安、速喜、小吉为吉，留连、赤口、空亡为凶。

        // 大安
        MinorRen minorRen = LunarDay.fromYmd(2024, 3, 5).getMinorRen();

        // 吉
        Luck luck = minorRen.getLuck();
      
2. 五行 Element
        // 大安
        MinorRen minorRen = LunarDay.fromYmd(2024, 3, 5).getMinorRen();

        // 木
        Element element = minorRen.getElement();
      
七曜 SevenStar轮回
也称七政、七纬、七耀，与星期一一对应，分别为：日、月、火、水、木、金、土。以下为七曜和星期的相互转换示例：

        // 二
        Week week = Week.fromIndex(2);
        // 火
        SevenStar sevenStar = week.getSevenStar();
         
        sevenStar = SevenStar.fromName("土");
        // 六
        week = sevenStar.getWeek();
      
八字 EightChar
所谓八字，就是出生年、月、日、时辰的干支(分别称年柱、月柱、日柱、时柱)，共8个字。

如何得到八字？
1. 从四柱初始化
参数为年干支、月干支、日干支、时干支，可以同为字符串，也可同为干支 SixtyCycle对象。

        // 初始化方式一
        EightChar eightChar = new EightChar("丁丑", "癸卯", "癸丑", "辛酉");
         
        // 初始化方式二
        eightChar = new EightChar(
          SixtyCycle.fromName("丁丑"),
          SixtyCycle.fromName("癸卯"),
          SixtyCycle.fromName("癸丑"),
          SixtyCycle.fromName("辛酉")
        );
      
2. 从时辰 LunarHour得到八字（默认23:00-23:59日干支为明天）
        // 2023年正月初一 10:00:00的八字
        EightChar eightChar = LunarHour.fromYmdHms(2023, 1, 1, 10, 0, 0).getEightChar();
      
由于有的流派认为23:00-23:59日干支为当天，有的流派则认为应该算明天，可通过EightCharProvider来切换，默认支持以下几种方式，你也可以自定义。(切换后会影响八字转公历时刻的结果)

a. 默认（23:00-23:59日干支为明天，对应Lunar流派1）
        LunarHour.provider = new DefaultEightCharProvider();
        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 23, 0, 0);
        EightChar eightChar = lunarHour.getEightChar();
      
b. Lunar流派2（23:00-23:59日干支为当天）
        LunarHour.provider = new LunarSect2EightCharProvider();
        LunarHour lunarHour = LunarHour.fromYmdHms(2023, 1, 1, 23, 0, 0);
        EightChar eightChar = lunarHour.getEightChar();
      
c. 自定义
实现EightCharProvider接口。

        // 方式1，实现EightCharProvider接口
        public class MyEightCharProvider implements EightCharProvider {
          // 实现getEightChar方法
        }
         
        LunarHour.provider = new MyEightCharProvider();
      
从八字可以得到些什么？
1. 八字转公历时刻列表
getSolarTimes(startYear, endYear)，参数startYear为开始年份，支持1-9999年；参数endYear为结束年份，支持1-9999年。返回为公历时刻 SolarTime的列表。

        // 1937年3月27日 18:00:00、1997年3月12日 18:00:00
        List<SolarTime> solarTimes = new EightChar("丁丑", "癸卯", "癸丑", "辛酉").getSolarTimes(1900, 2024);
      
2. 年柱
getYear()，返回为干支 SixtyCycle。

        EightChar eightChar = new EightChar("丁丑", "癸卯", "癸丑", "辛酉");
        // 丁丑
        SixtyCycle year = eightChar.getYear();
      
3. 月柱
getMonth()，返回为干支 SixtyCycle。

        EightChar eightChar = new EightChar("丁丑", "癸卯", "癸丑", "辛酉");
        // 癸卯
        SixtyCycle month = eightChar.getMonth();
      
4. 日柱
getDay()，返回为干支 SixtyCycle。

        EightChar eightChar = new EightChar("丁丑", "癸卯", "癸丑", "辛酉");
        // 癸丑
        SixtyCycle day = eightChar.getDay();
      
4. 时柱
getHour()，返回为干支 SixtyCycle。

        EightChar eightChar = new EightChar("丁丑", "癸卯", "癸丑", "辛酉");
        // 辛酉
        SixtyCycle hour = eightChar.getHour();
      
5. 胎元
getFetalOrigin()，返回为干支 SixtyCycle。

        EightChar eightChar = new EightChar("癸卯", "辛酉", "己亥", "癸酉");
        // 壬子
        SixtyCycle fetalOrigin = eightChar.getFetalOrigin();
      
6. 胎息
getFetalBreath()，返回为干支 SixtyCycle。

        EightChar eightChar = new EightChar("癸卯", "辛酉", "己亥", "癸酉");
        // 甲寅
        SixtyCycle fetalBreath = eightChar.getFetalBreath();
      
7. 命宫
getOwnSign()，返回为干支 SixtyCycle。

        EightChar eightChar = new EightChar("癸卯", "辛酉", "己亥", "癸酉");
        // 癸亥
        SixtyCycle ownSign = eightChar.getOwnSign();
      
8. 身宫
getBodySign()，返回为干支 SixtyCycle。

        EightChar eightChar = new EightChar("癸卯", "辛酉", "己亥", "癸酉");
        // 己未
        SixtyCycle bodySign = eightChar.getBodySign();
      
9. 建除十二值神
getDuty()，返回为建除十二值神 Duty。

        EightChar eightChar = new EightChar("癸卯", "辛酉", "己亥", "癸酉");
        Duty duty = eightChar.getDuty();
      
九野 Land轮回
九野和方位一一对应，依次为：玄天、朱天、苍天、阳天、钧天、幽天、颢天、变天、炎天。

从九野可以得到些什么？
1. 方位
getDirection()返回为方位 Direction。

        Land land = Land.fromName("玄天");
         
        // 北
        Direction direction = land.getDirection();
      
九星 NineStar轮回
九星指北斗九星，我们熟知的北斗七星(天枢、天璇、天玑、天权、玉衡、开阳、摇光)，在古代实际上有9颗，而随着时间的推移，另外2颗(洞明、隐元)逐渐暗淡，人眼已经不容易观察到。

如何得到九星？
1. 通过农历年 LunarYear得到年九星
        // 三碧木
        NineStar nineStar = LunarYear.fromYear(2024).getNineStar();
      
2. 通过农历月 LunarMonth得到月九星
        // 二黑土
        NineStar nineStar = LunarMonth.fromYm(2024, 4).getNineStar();
      
3. 通过农历日 LunarDay得到日九星
        // 六白金
        NineStar nineStar = LunarDay.fromYmd(2024, 4, 13).getNineStar();
      
4. 通过农历时辰 LunarHour得到时九星
        // 九紫火
        NineStar nineStar = LunarHour.fromYmdHms(2024, 4, 13, 21, 55, 0).getNineStar();
      
从九星可以得到些什么？
1. 颜色
        
        NineStar nineStar = LunarYear.fromYear(2024).getNineStar();
        // 碧
        String color = nineStar.getColor();
      
2. 五行
        
        NineStar nineStar = LunarYear.fromYear(2024).getNineStar();
        // 木
        Element element = nineStar.getElement();
      
3. 方位
        
        NineStar nineStar = LunarYear.fromYear(2024).getNineStar();
        // 东
        Direction direction = nineStar.getDirection();
      
4. 北斗九星
        
        NineStar nineStar = LunarYear.fromYear(2024).getNineStar();
        // 天玑
        Dipper dipper = nineStar.getDipper();
      
北斗九星 Dipper轮回
北斗九星分别为：天枢、天璇、天玑、天权、玉衡、开阳、摇光、洞明、隐元。

如何得到北斗九星？
1. 通过九星 NineStar得到
        // 天玑
        Dipper dipper = LunarYear.fromYear(2024).getNineStar().getDipper();
      
数九天 NineDay
数九，又称冬九九，是中国民间一种计算寒天与春暖花开日期的方法。一般“三九、四九”是一年中最冷的时段。当数到九个“九天”（九九八十一天），便春深日暖、万物生机盎然，是春耕的时候了。

民谚云：“夏至三庚入伏，冬至逢壬数九。”

数九即是从冬至逢壬日算起，每九天算一“九”。但是大部分人都不知道壬日是哪一天，就干脆采用按冬至日作为一九的开始了。这里的算法也是按冬至日起算。

还记得小时候学的数九歌吗？

一九二九不出手，三九四九冰上走，五九六九沿河看柳，七九河开，八九燕来，九九加一九，耕牛遍地走。

如何得到数九天？
1. 从公历日 SolarDay初始化
        // 一九第2天
        NineDay nineDay = SolarDay.fromYmd(2020, 12, 22).getNineDay();
      
十神 TenStar轮回
十神是根据两个天干之间的五行关系得出的。生我者，正印偏印。我生者，伤官食神。克我者，正官七杀。我克者，正财偏财。同我者，劫财比肩。

        // 比肩
        TenStar tenStar = HeavenStem.fromName("甲").getTenStar(HeavenStem.fromName("甲"));
      
长生十二神 Terrain轮回
长生十二神又叫地势，是天干和地支之间的关系得出的。分别为：长生、沐浴、冠带、临官、帝旺、衰、病、死、墓、绝、胎、养。

        // 沐浴
        Terrain terrain = HeavenStem.fromName("癸").getTerrain(EarthBranch.fromName("寅"));
      
建除十二值神 Duty轮回
建除十二值神依次为：建、除、满、平、定、执、破、危、成、收、开、闭。

如何得到建除十二值神？
1. 从农历日 LunarDay得到
        // 农历2021年正月初一的建除十二值神
        Duty duty = LunarDay.fromYmd(2021, 1, 1).getDuty();
      
2. 从八字 EightChar得到
有些场景需要以节令切换的时刻区分，节令切换当天则会有两个值神，就需要从八字获取。

        // 农历2021年正月初一 13:00:00的建除十二值神
        Duty duty = LunarHour.fromYmdHms(2021, 1, 1, 13, 0, 0).getEightChar().getDuty();
      
黄道黑道十二神 TwelveStar轮回
黄道黑道十二神依次为：青龙、明堂、天刑；朱雀、金贵、天德；白虎、玉堂、天牢；玄武、司命、勾陈。

从黄道黑道十二神可以得到些什么？
1. 黄道黑道
getEcliptic()返回为黄道黑道 Ecliptic。

        TwelveStar twelveStar = TwelveStar.fromName("青龙");
         
        // 黄道
        Ecliptic ecliptic = twelveStar.getEcliptic();
      
黄道黑道 Ecliptic轮回
黄道黑道就两种，依次为：黄道、黑道。

从黄道黑道可以得到些什么？
1. 吉凶
getLuck()返回为吉凶 Luck。

        Ecliptic ecliptic = Ecliptic.fromName("黄道");
         
        // 吉
        Luck luck = ecliptic.getLuck();
      
二十八宿 TwentyEightStar轮回
二十八宿，是黄道附近的二十八组星象总称。上古时代人们根据日月星辰的运行轨迹和位置，把黄道附近的星象划分为二十八组，俗称二十八宿，包括：


        东方七宿：角、亢、氐、房、心、尾、箕；
        北方七宿：斗、牛、女、虚、危、室、壁；
        西方七宿：奎、娄、胃、昴、毕、觜、参；
        南方七宿：井、鬼、柳、星、张、翼、轸。
      
从二十八宿可以得到些什么？
1. 七曜
getSevenStar()返回为七曜 SevenStar。

        // 农历日
        LunarDay d = LunarDay.fromYmd(2020, 4, 13);
         
        // 翼
        TwentyEightStar star = d.getTwentyEightStar();
         
        // 火
        SevenStar sevenStar = star.getSevenStar();
      
2. 九野
getLand()返回为九野 Land。

        // 农历日
        LunarDay d = LunarDay.fromYmd(2020, 4, 13);
         
        // 翼
        TwentyEightStar star = d.getTwentyEightStar();
         
        // 阳天
        Land land = star.getLand();
      
3. 宫
getZone()返回为宫 Zone。

        // 农历日
        LunarDay d = LunarDay.fromYmd(2020, 4, 13);
         
        // 翼
        TwentyEightStar star = d.getTwentyEightStar();
         
        // 南
        Zone zone = star.getZone();
      
4. 动物
getAnimal()返回为动物 Animal。

        LunarDay d = LunarDay.fromYmd(2020, 4, 13);

        // 翼
        TwentyEightStar star = d.getTwentyEightStar();
         
        // 蛇
        Animal animal = star.getAnimal();
      
5. 吉凶
getLuck()返回为吉凶 Luck。

        // 农历日
        LunarDay d = LunarDay.fromYmd(2020, 4, 13);
         
        // 翼
        TwentyEightStar star = d.getTwentyEightStar();
         
        // 吉
        Luck luck = star.getLuck();
      
七十二候 PhenologyDay
七十二候，是我国古代用来指导农事活动的历法补充。它是根据黄河流域的地理、气候、和自然界的一些景象编写而成，以五日为候，三候为气，六气为时，四时为岁，一年“二十四节气”共七十二候。各候均以一个物候现象相应，称“候应”。其中植物候应有植物的幼芽萌动、开花、结实等；动物候应有动物的始振、始鸣、交配、迁徙等；非生物候应有始冻、解冻、雷始发声等。七十二候“候应”的依次变化，反映了一年中物候和气候变化的一般情况。

如何得到七十二候？
1. 从公历日 SolarDay初始化
        // 萍始生第5天
        PhenologyDay phenologyDay = SolarDay.fromYmd(2020, 4, 23).getPhenologyDay();
      
干支 SixtyCycle轮回
干支，又叫六十甲子、六十干支周，依次为：甲子、乙丑、丙寅、丁卯、戊辰、己巳、庚午、辛未、壬申、癸酉、甲戌、乙亥、丙子、丁丑、戊寅、己卯、庚辰、辛巳、壬午、癸未、甲申、乙酉、丙戌、丁亥、戊子、己丑、庚寅、辛卯、壬辰、癸巳、甲午、乙未、丙申、丁酉、戊戌、己亥、庚子、辛丑、壬寅、癸卯、甲辰、乙巳、丙午、丁未、戊申、己酉、庚戌、辛亥、壬子、癸丑、甲寅、乙卯、丙辰、丁巳、戊午、己未、庚申、辛酉、壬戌、癸亥。

从干支可以得到些什么？
1. 天干
返回为天干 HeavenStem。

        SixtyCycle sixtyCycle = SixtyCycle.fromIndex(1);

        // 乙
        HeavenStem heavenStem = sixtyCycle.getHeavenStem();
      
2. 地支
返回为地支 EarthBranch。

        SixtyCycle sixtyCycle = SixtyCycle.fromIndex(1);

        // 丑
        EarthBranch earthBranch = sixtyCycle.getEarthBranch();
      
3. 纳音
返回为纳音 Sound。

        SixtyCycle sixtyCycle = SixtyCycle.fromIndex(1);

        // 海中金
        Sound sound = sixtyCycle.getSound();
      
4. 彭祖百忌
返回为彭祖百忌 PengZu。

        SixtyCycle sixtyCycle = SixtyCycle.fromIndex(1);

        // 乙不栽植千株不长 丑不冠带主不还乡
        PengZu pengZu = sixtyCycle.getPengZu();
      
5. 旬
返回为旬 Ten。

        SixtyCycle sixtyCycle = SixtyCycle.fromName("乙卯");

        // 甲寅
        Ten ten = sixtyCycle.getTen();
      
6. 旬空
也称空亡，10天干与12地支匹配，必定会多出来2个地支，这2个即为旬空。返回为地支 EarthBranch。

        SixtyCycle sixtyCycle = SixtyCycle.fromName("甲子");

        // 戌, 亥
        EarthBranch[] extraEarthBranches = sixtyCycle.getExtraEarthBranches();
      
天干 HeavenStem轮回
天干也叫天元，依次为：甲、乙、丙、丁、戊、己、庚、辛、壬、癸。

从天干可以得到些什么？
1. 五行
返回为五行 Element。

        HeavenStem heavenStem = HeavenStem.fromName("丙");
         
        // 火
        Element element = heavenStem.getElement();
      
2. 阴阳
返回为阴阳 YinYang。

        HeavenStem heavenStem = HeavenStem.fromName("甲");
         
        // 阳
        YinYang yinYang = heavenStem.getYinYang();
      
3. 方位
返回为方位 Direction。

        HeavenStem heavenStem = HeavenStem.fromName("甲");
         
        // 方位：东
        Direction direction = heavenStem.getDirection();
         
        // 喜神方位（《喜神方位歌》甲己在艮乙庚乾，丙辛坤位喜神安。丁壬只在离宫坐，戊癸原在在巽间。）
        direction = heavenStem.getJoyDirection();
         
        // 阳贵神方位（《阳贵神歌》甲戊坤艮位，乙己是坤坎，庚辛居离艮，丙丁兑与乾，震巽属何日，壬癸贵神安。）
        direction = heavenStem.getYangDirection();
         
        // 阴贵神方位（《阴贵神歌》甲戊见牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸蛇兔藏，庚辛逢虎马，此是贵神方。）
        direction = heavenStem.getYinDirection();
         
        // 财神方位（《财神方位歌》甲乙东北是财神，丙丁向在西南寻，戊己正北坐方位，庚辛正东去安身，壬癸原来正南坐，便是财神方位真。）
        direction = heavenStem.getWealthDirection();
         
        // 福神方位（《福神方位歌》甲乙东南是福神，丙丁正东是堪宜，戊北己南庚辛坤，壬在乾方癸在西。）
        direction = heavenStem.getMascotDirection();
      
4. 天干彭祖百忌
返回为天干彭祖百忌 PengZuHeavenStem。

        HeavenStem heavenStem = HeavenStem.fromName("甲");
         
        // 甲不开仓财物耗散
        PengZuHeavenStem pengZuHeavenStem = heavenStem.getPengZuHeavenStem();
      
5. 十神
调用getTenStar(heavenStem)得到十神，参数为天干 HeavenStem ，返回为十神 TenStar。十神是通过五行判断，规则为：生我者，正印偏印。我生者，伤官食神。克我者，正官七杀。我克者，正财偏财。同我者，劫财比肩。

        // 日元(日主)
        HeavenStem me = HeavenStem.fromName("癸");
         
        // 正财
        TenStar tenStar = me.getTenStar(HeavenStem.fromName("丙"));
      
6. 长生十二神(地势)
调用getTerrain(earthBranch)得到长生十二神，参数为地支 EarthBranch ，返回为长生十二神 Terrain。长生十二神可通过不同的组合，得到自坐和星运。

        // 八字
        EightChar eightChar = new EightChar("丙寅", "癸巳", "癸酉", "己未");

        // 日元(日主)：癸
        HeavenStem me = eightChar.getDay().getHeavenStem();
         
        // 年柱星运：沐浴
        Terrain terrain = me.getTerrain(eightChar.getYear().getEarthBranch());

        // 月柱
        SixtyCycle month = eightChar.getMonth();

        // 月柱自坐：胎
        terrain = month.getHeavenStem().getTerrain(month.getEarthBranch());
      
7. 五合
甲己合，乙庚合，丙辛合，丁壬合，戊癸合。调用getCombine()，返回为天干 HeavenStem。

        HeavenStem heavenStem = HeavenStem.fromName("甲");
         
        // 己
        HeavenStem combineHeavenStem = heavenStem.getCombine();
      
8. 合化
甲己合化土，乙庚合化金，丙辛合化水，丁壬合化木，戊癸合化火。调用combine(target)，参数为天干 HeavenStem ，返回为五行 Element。如果无法合化，返回null。

        HeavenStem heavenStem = HeavenStem.fromName("甲");
         
        // 土
        Elemente element = heavenStem.combine(HeavenStem.fromName("己"));
      
地支 EarthBranch轮回
地支也叫地元，依次为：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥。

从地支可以得到些什么？
1. 五行
返回为五行 Element。

        EarthBranch earthBranch = EarthBranch.fromName("寅");
         
        // 木
        Element element = earthBranch.getElement();
      
2. 阴阳
返回为阴阳 YinYang。

        EarthBranch earthBranch = EarthBranch.fromName("子");
         
        // 阳
        YinYang yinYang = earthBranch.getYinYang();
      
3. 方位
返回为方位 Direction。

        EarthBranch earthBranch = EarthBranch.fromName("子");
         
        // 方位：北
        Direction direction = earthBranch.getDirection();
      
4. 地支彭祖百忌
返回为地支彭祖百忌 PengZuEarthBranch。

        EarthBranch earthBranch = EarthBranch.fromName("子");
         
        // 子不问卜自惹祸殃
        PengZuEarthBranch pengZuEarthBranch = earthBranch.getPengZuEarthBranch();
      
5. 生肖
返回为生肖 Zodiac。

        EarthBranch earthBranch = EarthBranch.fromName("子");
         
        // 鼠
        Zodiac zodiac = earthBranch.getZodiac();
      
6. 六冲
子午冲，丑未冲，寅申冲，辰戌冲，卯酉冲，巳亥冲。getOpposite()返回为地支 EarthBranch。

        EarthBranch earthBranch = EarthBranch.fromName("子");
         
        // 午
        EarthBranch oppositeEarthBranch = earthBranch.getOpposite();
      
7. 六合
子丑合，寅亥合，卯戌合，辰酉合，巳申合，午未合。getCombine()返回为地支 EarthBranch。

        EarthBranch earthBranch = EarthBranch.fromName("子");
         
        // 丑
        EarthBranch combineEarthBranch = earthBranch.getCombine();
      
8. 六害
子未害、丑午害、寅巳害、卯辰害、申亥害、酉戌害。getHarm()返回为地支 EarthBranch。

        EarthBranch earthBranch = EarthBranch.fromName("子");
         
        // 未
        EarthBranch harmEarthBranch = earthBranch.getHarm();
      
9. 合化
子丑合化土，寅亥合化木，卯戌合化火，辰酉合化金，巳申合化水，午未合化土。combine(target)，target参数为地支 EarthBranch，返回为五行 Element。如果无法合化，返回null。

        EarthBranch earthBranch = EarthBranch.fromName("子");
         
        // 土
        Element element = earthBranch.combine(EarthBranch.fromName("丑"));
      
10. 煞
逢巳日、酉日、丑日必煞东；亥日、卯日、未日必煞西；申日、子日、辰日必煞南；寅日、午日、戌日必煞北。getOminous()返回为方位 Direction。

        EarthBranch earthBranch = EarthBranch.fromName("子");
         
        // 南
        Direction direction = earthBranch.getOminous();
      
11. 藏干之本气(主气)
getHideHeavenStemMain()返回为天干 HeavenStem。

        EarthBranch earthBranch = EarthBranch.fromName("子");
         
        // 癸
        HeavenStem heavenStem = earthBranch.getHideHeavenStemMain();
      
12. 藏干之中气
getHideHeavenStemMiddle()返回为天干 HeavenStem，无中气的返回null。

        EarthBranch earthBranch = EarthBranch.fromName("寅");
         
        // 丙
        HeavenStem heavenStem = earthBranch.getHideHeavenStemMiddle();
      
13. 藏干之余气
getHideHeavenStemResidual()返回为天干 HeavenStem，无余气的返回null。

        EarthBranch earthBranch = EarthBranch.fromName("寅");
         
        // 戊
        HeavenStem heavenStem = earthBranch.getHideHeavenStemResidual();
      
14. 藏干列表
getHideHeavenStems()返回为藏干 HideHeavenStem的列表，注意：有些可能缺少中气或余气。

        EarthBranch earthBranch = EarthBranch.fromName("寅");
         
        // 癸, 丙, 戊
        List<HideHeavenStem> hideHeavenStems = earthBranch.getHideHeavenStems();
      
藏干 HideHeavenStem
‌‌地支藏干也叫人元，是指地支中包藏着天干，每一个地支里都藏着一至三个天干‌。遁藏的天干依据其力量强弱，可以分为本气、中气以及余气。

如何得到藏干？
1. 从地支 EarthBranch得到藏干列表
        EarthBranch earthBranch = EarthBranch.fromName("寅");
         
        // 癸, 丙, 戊
        List<HideHeavenStem> hideHeavenStems = earthBranch.getHideHeavenStems();
      
2. 从人元司令分野 HideHeavenStemDay得到藏干
        HideHeavenStemDay hideHeavenStemDay = SolarDay.fromYmd(2024, 12, 4).getHideHeavenStemDay();
         
        // 壬
        HideHeavenStem hideHeavenStem = hideHeavenStemDay.getHideHeavenStem();
      
从藏干可以得到些什么？
1. 天干
返回为天干 HeavenStem。

        HideHeavenStemDay hideHeavenStemDay = SolarDay.fromYmd(2024, 12, 4).getHideHeavenStemDay();
         
        HideHeavenStem hideHeavenStem = hideHeavenStemDay.getHideHeavenStem();
         
        // 壬
        HeavenStem heavenStem = hideHeavenStem.getHeavenStem();
      
2. 藏干类型
返回为藏干类型 HideHeavenStemType。

        HideHeavenStemDay hideHeavenStemDay = SolarDay.fromYmd(2024, 12, 4).getHideHeavenStemDay();
         
        HideHeavenStem hideHeavenStem = hideHeavenStemDay.getHideHeavenStem();
         
        // 本气
        HideHeavenStemType hideHeavenStemType = hideHeavenStem.getType();
      
人元司令分野 HideHeavenStemDay
‌‌人元司令分野是指在八字命理学中，将每个月份中五行之气各自司职当令的情况，以及这些气在该月内轮流管理的天数进行详细划分的一种方法。具体来说，人元司令分野涉及余气、中气、本气三种五行之气的轮流司令。每个月份或节气区间内，这三种气各自占据一定的天数，共同构成了该月的五行力量分布。

如何得到人元司令分野？
1. 从公历日 SolarDay得到人元司令分野
        // 壬水第16天
        HideHeavenStemDay hideHeavenStemDay = SolarDay.fromYmd(2024, 12, 4).getHideHeavenStemDay();
      
从人元司令分野可以得到些什么？
1. 藏干
getHideHeavenStem()返回为藏干 HideHeavenStem。

        HideHeavenStemDay hideHeavenStemDay = SolarDay.fromYmd(2024, 12, 4).getHideHeavenStemDay();
         
        // 壬
        HideHeavenStem hideHeavenStem = hideHeavenStemDay.getHideHeavenStem();
      
纳音 Sound轮回
纳音依次为：海中金、炉中火、大林木、路旁土、剑锋金、山头火、涧下水、城头土、白蜡金、杨柳木、泉中水、屋上土、霹雳火、松柏木、长流水、沙中金、山下火、平地木、壁上土、金箔金、覆灯火、天河水、大驿土、钗钏金、桑柘木、大溪水、沙中土、天上火、石榴木、大海水。

彭祖百忌 PengZu
彭祖百忌，指在天干地支记日中的某日或当日里的某时不要做某事否则会发生某事。口诀如下：

        // 天干忌讳
        甲不开仓财物耗散，乙不栽植千株不长；
        丙不修灶必见灾殃，丁不剃头头必生疮；
        戊不受田田主不祥，己不破券二比并亡；
        庚不经络织机虚张，辛不合酱主人不尝；
        壬不泱水更难提防，癸不词讼理弱敌强。
         
        // 地支忌讳
        子不问卜自惹祸殃，丑不冠带主不还乡；
        寅不祭祀神鬼不尝，卯不穿井水泉不香；
        辰不哭泣必主重丧，巳不远行财物伏藏；
        午不苫盖屋主更张，未不服药毒气入肠；
        申不安床鬼祟入房，酉不会客醉坐颠狂；
        戌不吃犬作怪上床，亥不嫁娶不利新郎。
      
如何得到彭祖百忌？
1. 从干支 SixtyCycle得到
        // 甲不开仓财物耗散 子不问卜自惹祸殃
        PengZu pengZu = SixtyCycle.fromName("甲子").getPengZu();
      
从彭祖百忌可以得到些什么？
1. 天干彭祖百忌
getPengZuHeavenStem()返回为天干彭祖百忌 PengZuHeavenStem。

        PengZu pengZu = SixtyCycle.fromName("甲子").getPengZu();
         
        // 甲不开仓财物耗散
        PengZuHeavenStem pengZuHeavenStem = pengZu.getPengZuHeavenStem();
      
2. 地支彭祖百忌
getPengZuHeavenStem()返回为地支彭祖百忌 PengZuEarthBranch。

        PengZu pengZu = SixtyCycle.fromName("甲子").getPengZu();
         
        // 子不问卜自惹祸殃
        PengZuEarthBranch pengZuEarthBranch = pengZu.getPengZuEarthBranch();
      
也可直接通过天干 HeavenStem获取天干彭祖百忌 PengZuHeavenStem，通过地支 EarthBranch直接获取地支彭祖百忌 PengZuEarthBranch。

        // 甲不开仓财物耗散
        PengZuHeavenStem pengZuHeavenStem = HeavenStem.fromName("甲").getPengZuHeavenStem();
         
        // 子不问卜自惹祸殃
        PengZuEarthBranch pengZuEarthBranch = EarthBranch.fromName("子").getPengZuEarthBranch();
      
吉凶 Luck轮回
目前只支持两种，依次为：吉、凶。

方位 Direction轮回
依据后天八卦排序：坎北、坤西南、震东、巽东南、中、乾西北、兑西、艮东北、离南），方位依次为：北、西南、东、东南、中、西北、西、东北、南。

从方位可以得到些什么？
1. 九野
getLand()返回为九野 Land。

        Direction direction = Direction.fromName("北");
         
        // 玄天
        Land land = direction.getLand();
      
宫 Zone轮回
宫依次为：东、北、西、南。

从宫可以得到些什么？
1. 方位
getDirection()返回为方位 Direction。

        Zone zone = Zone.fromName("东");
         
        // 东
        Direction direction = zone.getDirection();
      
2. 神兽
getBeast()返回为神兽 Beast。

        Zone zone = Zone.fromName("东");
         
        // 青龙
        Beast direction = zone.getBeast();
      
神兽 Beast轮回
神兽和宫一一对应，依次为：青龙、玄武、白虎、朱雀。

从神兽可以得到些什么？
1. 宫
getZone()返回为宫 Zone。

        Beast beast = Beast.fromName("青龙");
         
        // 东
        Zone zone = beast.getZone();
      
动物 Animal轮回
动物一般用于二十八宿，依次为：蛟、龙、貉、兔、狐、虎、豹、獬、牛、蝠、鼠、燕、猪、獝、狼、狗、彘、鸡、乌、猴、猿、犴、羊、獐、马、鹿、蛇、蚓。

如何得到动物？
1. 从二十八宿 TwentyEightStar得到
        LunarDay d = LunarDay.fromYmd(2020, 4, 13);

        // 翼
        TwentyEightStar star = d.getTwentyEightStar();
         
        // 蛇
        Animal animal = star.getAnimal();
      
元 Sixty轮回
一元等于三运，也就是60年，1甲子，元依次为：上元、中元、下元。常说三元九运，可以涵盖180年。

如何得到元？
1. 从运 Twenty得到
        // 九运
        Twenty twenty = LunarYear.fromYear(1863).getTwenty();
         
        // 下元
        Sixty sixty = twenty.getSixty();
      
运 Twenty轮回
20年为1运，一共有九运，依次为：一运、二运、三运、四运、五运、六运、七运、八运、九运。

如何得到运？
1. 从农历年 LunarYear得到
        // 二运
        Twenty twenty = LunarYear.fromYear(1884).getTwenty();
      
旬 Ten轮回
旬依次为：甲子、甲戌、甲申、甲午、甲辰、甲寅。1旬=10，常听说的八旬老人指80岁的老人，每月有上旬、中旬、下旬，指的则是10天。6旬正好为60年，对应六十甲子。

如何得到旬？
从干支 SixtyCycle得到。

        SixtyCycle sixtyCycle = SixtyCycle.fromName("乙卯");

        // 甲寅
        Ten ten = sixtyCycle.getTen();
      
梅雨天 PlumRainDay
江淮流域一带约6月上旬后出现的阴雨天气，称做梅雨期。梅雨期的始日谓“入梅”，也称“入霉”、“进梅”；梅雨期的终日谓“出梅”，也称“出霉”，“断梅”。梅雨期间的降水称为梅雨，此时正值江南梅子成熟期，故得名。

芒种后的第1个丙日入梅，小暑后的第1个未日出梅。

如何得到梅雨天？
1. 从公历日 SolarDay初始化
        // 入梅第1天
        PlumRainDay plumRainDay = SolarDay.fromYmd(2024, 6, 11).getPlumRainDay();
      
逐月胎神 FetusMonth轮回
胎神是掌管妇女胎孕之事的神灵。民间认为胎神是不能触犯的，触犯了胎神就会危及母腹中的婴儿。胎神的活动被看成是有规律的，它往往按照时间的移动而处在房间的不同位置。正十二月在床房，二三九十门户中，四六十一灶勿犯，五甲七子八厕凶。闰月无胎神。

如何得到逐月胎神？
1. 从农历月 LunarMonth初始化
        LunarMonth lunarMonth = LunarMonth.fromYm(2024, 4);
        // 占厨灶
        FetusMonth fetus = lunarMonth.getFetus();
      
逐日胎神 FetusDay
参考多方资料对比、修正，最终形成了这个我自认为最靠谱的逐日胎神表。

        甲子日 占门碓 外东南, 乙丑日 碓磨厕 外东南, 丙寅日 厨灶炉 外正南, 丁卯日 仓库门 外正南, 戊辰日 房床栖 外正南, 己巳日 占门床 外正南, 庚午日 占碓磨 外正南, 辛未日 厨灶厕 外西南, 壬申日 仓库炉 外西南, 癸酉日 房床门 外西南
        甲戌日 占门栖 外西南, 乙亥日 碓磨床 外西南, 丙子日 厨灶碓 外西南, 丁丑日 仓库厕 外正西, 戊寅日 房床炉 外正西, 己卯日 占大门 外正西, 庚辰日 碓磨栖 外正西, 辛巳日 厨灶床 外正西, 壬午日 仓库碓 外西北, 癸未日 房床厕 外西北
        甲申日 占门炉 外西北, 乙酉日 碓磨门 外西北, 丙戌日 厨灶栖 外西北, 丁亥日 仓库床 外西北, 戊子日 房床碓 外正北, 己丑日 占门厕 外正北, 庚寅日 碓磨炉 外正北, 辛卯日 厨灶门 外正北, 壬辰日 仓库栖 外正北, 癸巳日 占房床 房内北
        甲午日 占门碓 房内北, 乙未日 碓磨厕 房内北, 丙申日 厨灶炉 房内北, 丁酉日 仓库门 房内北, 戊戌日 房床栖 房内中, 己亥日 占门床 房内中, 庚子日 占碓磨 房内南, 辛丑日 厨灶厕 房内南, 壬寅日 仓库炉 房内南, 癸卯日 房床门 房内西
        甲辰日 占门栖 房内东, 乙巳日 碓磨床 房内东, 丙午日 厨灶碓 房内东, 丁未日 仓库厕 房内东, 戊申日 房床炉 房内中, 己酉日 占大门 外东北, 庚戌日 碓磨栖 外东北, 辛亥日 厨灶床 外东北, 壬子日 仓库碓 外东北, 癸丑日 房床厕 外东北
        甲寅日 占门炉 外东北, 乙卯日 碓磨门 外正东, 丙辰日 厨灶栖 外正东, 丁巳日 仓库床 外正东, 戊午日 房床碓 外正东, 己未日 占门厕 外正东, 庚申日 碓磨炉 外东南, 辛酉日 厨灶门 外东南, 壬戌日 仓库栖 外东南, 癸亥日 占房床 外东南
      
如何得到逐日胎神？
1. 从农历日 LunarDay初始化
        LunarDay lunarDay = LunarDay.fromYmd(2024, 4, 22);
        // 占房床 房内北
        FetusDay fetus = lunarDay.getFetusDay();
      
从逐日胎神可以得到些什么？
1. 内外 Side
        FetusDay fetus = LunarDay.fromYmd(2024, 4, 22).getFetusDay();
        // 内
        Side side = fetus.getSide();
      
2. 方位 Direction
        FetusDay fetus = LunarDay.fromYmd(2024, 4, 22).getFetusDay();
        // 北
        Direction direction = fetus.getDirection();
      
3. 天干六甲胎神 FetusHeavenStem
        FetusDay fetus = LunarDay.fromYmd(2024, 4, 22).getFetusDay();
        // 房
        FetusHeavenStem fetusHeavenStem = fetus.getFetusHeavenStem();
      
4. 地支六甲胎神 FetusEarthBranch
        FetusDay fetus = LunarDay.fromYmd(2024, 4, 22).getFetusDay();
        // 床
        FetusEarthBranch fetusEarthBranch = fetus.getFetusEarthBranch();
      
天干六甲胎神 FetusHeavenStem
天干六甲胎神歌：甲己之日占在门，乙庚碓磨休移动。丙辛厨灶莫相干，丁壬仓库忌修弄。戊癸房床若移整，犯之孕妇堕孩童。

天干六甲胎神所在位置分别为：门、碓磨、厨灶、仓库、房床。

地支六甲胎神 FetusEarthBranch
地支六甲胎神歌：子午二日碓须忌，丑未厕道莫修移。寅申火炉休要动，卯酉大门修当避。辰戌鸡栖巳亥床，犯着六甲身堕胎。

地支六甲胎神所在位置分别为：碓、厕、炉、门、栖、床。

灶马头 KitchenGodSteed
灶马头是中国传统文化中的一种特殊日历工具，主要用于预测一年的年景和收成情况。这一术语源自灶王爷的形象，因为灶王爷的画像中一直都是骑马巡视人间，便有了灶马头这一说法。它通常是一张印有灶神像和年历表的纸，上面记录了阴历、节气、农事等内容。

如何得到灶马头？
1. 从农历年 LunarYear得到
        // 第1种
        KitchenGodSteed kitchenGodSteed1 = LunarYear.fromYear(2017).getKitchenGodSteed();

        // 第2种
        KitchenGodSteed kitchenGodSteed2 = KitchenGodSteed.fromLunarYear(2017);
      
从灶马头可以得到些什么？
1. 几鼠偷粮、草子几分、几牛耕田、花收几分、几龙治水、几马驮谷、几鸡抢米、几姑看蚕、几屠共猪、甲田几分、几人分饼、几日得金、几人几丙、几人几锄
        KitchenGodSteed kitchenGodSteed = KitchenGodSteed.fromLunarYear(2017);
         
        // 十鼠偷粮
        String mouse = kitchenGodSteed.getMouse();
        // 草子十分
        String grass = kitchenGodSteed.getGrass();
        // 十一牛耕田
        String cattle = kitchenGodSteed.getCattle();
        // 花收一分
        String flower = kitchenGodSteed.getFlower();
        // 二龙治水
        String dragon = kitchenGodSteed.getDragon();
        // 四马驮谷
        String horse = kitchenGodSteed.getHorse();
        // 七鸡抢米
        String chicken = kitchenGodSteed.getChicken();
        // 七姑看蚕
        String silkworm = kitchenGodSteed.getSilkworm();
        // 九屠共猪
        String pig = kitchenGodSteed.getPig();
        // 甲田十分
        String field = kitchenGodSteed.getField();
        // 二人分饼
        String cake = kitchenGodSteed.getCake();
        // 七日得金
        String gold = kitchenGodSteed.getGold();
        // 十二人二丙
        String peopleCakes = kitchenGodSteed.getPeopleCakes();
        // 十二人三锄
        String peopleHoes = kitchenGodSteed.getPeopleHoes();
      
宜忌 Taboo
宜忌包括每日宜忌、时辰宜忌，数据仅供参考。

如何得到每日宜忌？
1. 从农历日 LunarDay或干支日 SixtyCycleDay得到，两者是一致的。
        LunarDay d = SolarDay.fromYmd(2024, 6, 26).getLunarDay();
        // SixtyCycleDay d = SolarDay.fromYmd(2024, 6, 26).getSixtyCycleDay();

        // 宜：嫁娶, 祭祀, 理发, 作灶, 修饰垣墙, 平治道涂, 整手足甲, 沐浴, 冠笄
        List<Taboo> taboos = d.getRecommends();
         
        // 忌：破土, 出行, 栽种
        taboos = d.getAvoids();
      
如何得到时辰宜忌？
1. 从农历时辰 LunarHour或干支时辰 SixtyCycleHour得到，两者是一致的。
        LunarHour h = SolarTime.fromYmdHms(2024, 4, 22, 0, 0, 0).getLunarHour();
        // SixtyCycleHour h = SolarTime.fromYmdHms(2024, 4, 22, 0, 0, 0).getSixtyCycleHour();
         
        // 宜：嫁娶, 交易, 开市, 安床, 祭祀, 求财
        List<Taboo> taboos = h.getRecommends();
         
        // 忌：出行, 移徙, 赴任, 词讼, 祈福, 修造, 求嗣
        taboos = h.getAvoids();
      
神煞 God
目前只支持农历日的吉神宜趋、凶神宜忌。

如何得到吉神宜趋和凶神宜忌？
1. 从农历日 LunarDay或干支日 SixtyCycleDay得到，两者是一致的。
        LunarDay d = SolarDay.fromYmd(1954, 7, 16).getLunarDay();
        // SixtyCycleDay d = SolarDay.fromYmd(1954, 7, 16).getSixtyCycleDay();
         
        // 获得当天的神煞列表
        List<God> gods = d.getGods();
         
        // 吉神宜趋
        List<God> goodGods = new ArrayList<>();
        // 凶神宜忌
        List<God> badGods = new ArrayList<>();
         
        // 遍历，根据神煞吉凶区分吉神和凶神
        for (God god : gods) {
          if ("吉".equals(god.getLuck().getName())) {
            goodGods.add(god);
          } else {
            badGods.add(god);
          }
        }
      
童限 ChildLimit
出生童限起运大运十年
小运小运小运小运小运小运小运小运小运小运
流年流年流年流年流年流年流年流年流年流年
如上图所示，童限为从出生到起运之间的时间，童限的开始即出生，童限的结束即起运。

        // 得到公历2022年3月9日 20:51:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(2022, 3, 9, 20, 51, 0), Gender.MAN);
      
从童限可以得到些什么？
1. 八字 EightChar
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 辛未 辛丑 戊申 戊午
        EightChar eightChar = childLimit.getEightChar();
      
2. 性别 Gender
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);
         
        // Gender.MAN (男)
        Gender gender = childLimit.getGender();
      
3. 是否顺推
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);
         
        // false (逆推)
        boolean forward = childLimit.isForward();
      
4. 年数
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);
         
        // 9
        int n = childLimit.getYearCount();
      
5. 月数
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);
         
        // 0
        int n = childLimit.getMonthCount();
      
6. 日数
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);
         
        // 9
        int n = childLimit.getDayCount();
      
7. 小时数
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);
         
        // 6
        int n = childLimit.getHourCount();
      
8. 分钟数
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);
         
        // 58
        int n = childLimit.getMinuteCount();
      
9. 开始(即出生)的公历时刻
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);
         
        // 1992年2月2日 12:00:00
        SolarTime time = childLimit.getStartTime();
      
10. 结束(即开始起运)的公历时刻
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);
         
        // 2001年2月11日 18:58:00
        SolarTime time = childLimit.getEndTime();
      
11. 大运 DecadeFortune
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);
         
        // 庚子
        DecadeFortune decadeFortune = childLimit.getStartDecadeFortune();
      
12. 小运 Fortune
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);
         
        // 戊申
        Fortune decadeFortune = childLimit.getStartFortune();
      
如何切换童限(起运)计算的流派？
童限的计算可通过ChildLimitProvider来切换，默认支持以下几种计算方式，你也可以自定义。

1. 默认
计算出生时刻和节令时刻相差的秒数，按3天 = 1年（3天 = 60秒 * 60 * 24 * 3 = 259200秒 = 1年）、1天 = 4月（1天 = 60秒 * 60 * 24 = 86400秒 = 4月，85400秒 / 4 = 21600秒 = 1月）、1时 = 5天（1时 = 60秒 * 60 = 3600秒 = 5天，3600秒 / 5 = 720秒 = 1天）、1分 = 2时（1分 = 60秒 = 2时，60秒 / 2 = 30秒 = 1时）、1秒 = 2分（1秒 / 2 = 0.5秒 = 1分）进行推移，最终起运时间精确到分钟。

        ChildLimit.provider = new DefaultChildLimitProvider();
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(2022, 3, 9, 20, 51, 0), Gender.MAN);
      
2. 元亨利贞
计算出生时刻和节令时刻相差的分钟数，按3天 = 1年（3天 = 60分 * 24 * 3 = 4320分 = 1年）、1天 = 4月（1天 = 60分 * 24 = 1440分， 1440分 / 4 = 360分 = 1月）、1时 = 5天（1时 = 60分 = 5天，60分 / 5 = 12分 = 1天）进行推移，最终起运时间精确到日。

        ChildLimit.provider = new China95ChildLimitProvider();
      
3. Lunar的流派1
直接用相差的天数和时辰数计算，按3天 = 1年、1天 = 4月、1时辰 = 10天进行推移，最终起运时间精确到日。

        ChildLimit.provider = new LunarSect1ChildLimitProvider();
      
4. Lunar的流派2
计算出生时刻和节令时刻相差的分钟数，按3天 = 1年（3天 = 60分 * 24 * 3 = 4320分 = 1年）、1天 = 4月（1天 = 60分 * 24 = 1440分， 1440分 / 4 = 360分 = 1月）、1时 = 5天（1时 = 60分 = 5天，60分 / 5 = 12分 = 1天）、1分 = 2时进行推移，最终起运时间精确到小时。

        ChildLimit.provider = new LunarSect2ChildLimitProvider();
      
5. 自定义
实现ChildLimitProvider接口，或继承AbstractChildLimitProvider抽象类。

        // 方式1，实现ChildLimitProvider接口
        public class MyChildLimitProvider implements ChildLimitProvider {
          // 实现getInfo方法
        }
         
        // 方式2，继承AbstractChildLimitProvider抽象类
        public class MyChildLimitProvider extends AbstractChildLimitProvider {
          // 实现getInfo方法
        }
         
        ChildLimit.provider = new MyChildLimitProvider();
      
大运 DecadeFortune
自起运开始，每十年为一大运。童限结束的公历时刻，即开始起运，是大运的开始。

        // 得到公历2022年3月9日 20:51:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(2022, 3, 9, 20, 51, 0), Gender.MAN);

        // 开始的大运
        DecadeFortune decadeFortune = childLimit.getStartDecadeFortune();
      
从大运可以得到些什么？
1. 开始年龄
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 开始的大运 (庚子)
        DecadeFortune decadeFortune = childLimit.getStartDecadeFortune();
         
        // 10 (10岁)
        int age = decadeFortune.getStartAge();
      
2. 结束年龄
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 开始的大运 (庚子)
        DecadeFortune decadeFortune = childLimit.getStartDecadeFortune();
         
        // 19 (19岁)
        int age = decadeFortune.getEndAge();
      
3. 开始农历年 LunarYear(已废弃)
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 开始的大运 (庚子)
        DecadeFortune decadeFortune = childLimit.getStartDecadeFortune();
         
        // 农历辛巳年
        LunarYear year = decadeFortune.getStartLunarYear();
      
4. 结束农历年 LunarYear(已废弃)
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 开始的大运 (庚子)
        DecadeFortune decadeFortune = childLimit.getStartDecadeFortune();
         
        // 农历庚寅年
        LunarYear year = decadeFortune.getEndLunarYear();
      
3. 开始干支年 SixtyCycleYear
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 开始的大运 (庚子)
        DecadeFortune decadeFortune = childLimit.getStartDecadeFortune();
         
        // 辛巳年
        SixtyCycleYear year = decadeFortune.getStartSixtyCycleYear();
      
4. 结束干支年 SixtyCycleYear
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 开始的大运 (庚子)
        DecadeFortune decadeFortune = childLimit.getStartDecadeFortune();
         
        // 庚寅年
        SixtyCycleYear year = decadeFortune.getEndSixtyCycleYear();
      
5. 干支 SixtyCycle
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 开始的大运 (庚子)
        DecadeFortune decadeFortune = childLimit.getStartDecadeFortune();
         
        // 庚子
        SixtyCycle sixtyCycle = decadeFortune.getSixtyCycle();
      
6. 本轮大运中开始的小运 Fortune
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 开始的大运 (庚子)
        DecadeFortune decadeFortune = childLimit.getStartDecadeFortune();
         
        // 戊申
        Fortune fortune = decadeFortune.getStartFortune();
      
7. 如何得到多轮大运？
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 开始的大运 (庚子)
        DecadeFortune decadeFortune = childLimit.getStartDecadeFortune();
         
        // 下一轮大运
        decadeFortune = decadeFortune.next(1);
         
        // 上一轮大运
        decadeFortune = decadeFortune.next(-1);
      
小运 Fortune
在十年大运中，每一年为一小运。童限结束的公历时刻，既是大运的开始，也是小运的开始。

        // 得到公历2022年3月9日 20:51:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(2022, 3, 9, 20, 51, 0), Gender.MAN);

        // 开始的小运
        Fortune fortune = childLimit.getStartFortune();
      
从小运可以得到些什么？
1. 年龄
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 开始的小运 (戊申)
        Fortune fortune = childLimit.getStartFortune();
         
        // 10 (10岁)
        int age = fortune.getAge();
      
2. 农历年 LunarYear(已废弃)
由于1大运为10年，对应10小运，因此1小运对应1年，称为流年，但注意小运干支并不等于流年干支。

        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 开始的小运 (戊申)
        Fortune fortune = childLimit.getStartFortune();
         
        // 农历辛巳年
        LunarYear year = fortune.getLunarYear();
      
2. 干支年 SixtyCycleYear
由于1大运为10年，对应10小运，因此1小运对应1年，称为流年，但注意小运干支并不等于流年干支。

        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 开始的小运 (戊申)
        Fortune fortune = childLimit.getStartFortune();
         
        // 辛巳年
        SixtyCycleYear year = fortune.getSixtyCycleYear();
      
3. 干支 SixtyCycle
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 开始的小运 (戊申)
        Fortune fortune = childLimit.getStartFortune();
         
        // 戊申
        SixtyCycle sixtyCycle = fortune.getSixtyCycle();
      
4. 如何得到多轮小运？
        // 得到公历1992年2月2日 12:00:00生男的童限
        ChildLimit childLimit = ChildLimit.fromSolarTime(SolarTime.fromYmdHms(1992, 2, 2, 12, 0, 0), Gender.MAN);

        // 开始的小运 (戊申)
        Fortune fortune = childLimit.getStartFortune();
         
        // 下一个小运
        fortune = fortune.next(1);
         
        // 上一个小运
        fortune = fortune.next(-1);
      
八字排盘的示例：

公历
2025
年 
7
月 
6
日 
10
时 
16
分 
9
秒 
男
 
晚子时日柱算明天
 起运流派
默认
年柱月柱日柱时柱
主星正印七杀元男正官
天干乙壬丙癸
地支巳午子巳
藏干
丙 比肩庚 偏财戊 食神
丁 劫财己 伤官
癸 正官
丙 比肩庚 偏财戊 食神
星运临官帝旺胎临官
自坐沐浴胎胎胎
空亡寅卯申酉申酉午未
纳音覆灯火杨柳木涧下水长流水
农历：农历乙巳年六月十二癸巳时
节气：芒种(6月5日 17:56:16) 小暑(7月7日 04:04:43)
胎元：癸酉(剑锋金) 胎息：辛丑(壁上土)
命宫：壬午(杨柳木) 身宫：戊子(霹雳火)
起运：10年2个月21天15时46分后起运 (公历2035年9月28日 02:02:09)
大运
童限
2025
2035
1 - 10岁
七杀
辛巳
2035
2044
11 - 20岁
正财
庚辰
2045
2054
21 - 30岁
偏财
己卯
2055
2064
31 - 40岁
伤官
戊寅
2065
2074
41 - 50岁
食神
丁丑
2075
2084
51 - 60岁
劫财
丙子
2085
2094
61 - 70岁
比肩
乙亥
2095
2104
71 - 80岁
正印
甲戌
2105
2114
81 - 90岁
偏印
癸酉
2115
2124
91 - 100岁
正官
壬申
2125
2134
101 - 110岁
七杀
小运
壬辰
2025
1岁
七杀
辛卯
2026
2岁
正财
庚寅
2027
3岁
偏财
己丑
2028
4岁
伤官
戊子
2029
5岁
食神
丁亥
2030
6岁
劫财
丙戌
2031
7岁
比肩
乙酉
2032
8岁
正印
甲申
2033
9岁
偏印
癸未
2034
10岁
正官
流年
乙巳
正印
丙午
比肩
丁未
劫财
戊申
食神
己酉
伤官
庚戌
偏财
辛亥
正财
壬子
七杀
癸丑
正官
甲寅
偏印
流月
戊寅
食神
己卯
伤官
庚辰
偏财
辛巳
正财
壬午
七杀
癸未
正官
甲申
偏印
乙酉
正印
丙戌
比肩
丁亥
劫财
戊子
食神
己丑
伤官
枚举
枚举类型都可以调用以下几个方法（有些开发语言可能不支持）：

1. 名称
调用getName()返回名称字符串。

        // 性别
        Gender gender = Gender.fromName("男");
        // 男
        String name = gender.getName();
      
2. 代码
调用getCode()返回数字代码。

        // 性别
        Gender gender = Gender.fromName("男");
        // 1
        int code = gender.getCode();
      
3. 通过代码进行初始化
调用fromCode(code)得到枚举对象。code为数字代码。

        // 阴
        YinYang yinYang = YinYang.fromCode(0);
      
4. 通过名称进行初始化
调用fromName(name)得到枚举对象。name为字符串，当名称不存在时，返回空。

        // 阴
        YinYang yinYang = YinYang.fromName("阴");
      
节日类型 FestivalType
节日类型枚举值有：DAY=0=日期，TERM=1=节气，EVE=2=除夕。

性别 Gender
性别枚举值有：WOMAN=0=女，MAN=1=男。

内网 Side
内外枚举值有：IN=0=内，OUT=1=外。

阴阳 YinYang
阴阳枚举值有：YIN=0=阴，YANG=1=阳。

藏干类型 HideHeavenStemType
藏干类型枚举值有：RESIDUAL=0=余气，MIDDLE=1=中气、MAIN=2=本气。
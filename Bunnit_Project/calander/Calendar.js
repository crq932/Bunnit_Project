import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import Icon from 'react-native-vector-icons/MaterialIcons';
import SelectMonthModal from "../Modal/SelectMonthModal";
import SelectYearModal from "../Modal/SelectYearModal";

function divideArray(data = [], size = 1) {
  const arr = [];
  for (let i = 0; i < data.length; i += size) {
    arr.push(data.slice(i, i + size));
  }
  return arr;
}

function isSameObj(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function EnglishMonth(month)
{
  if(month === 1) return "January";
  else if(month === 2) return "February";
  else if(month === 3) return "March";
  else if(month === 4) return "April";
  else if(month === 5) return "May";
  else if(month === 6) return "June";
  else if(month === 7) return "July";
  else if(month === 8) return "August";
  else if(month === 9) return "September";
  else if(month === 10) return "October";
  else if(month === 11) return "November";
  else if(month === 12) return "December";
  
}

function Header(props) {
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  return (
    <>
      <View style={HeaderStyle.header}>
        <Pressable
          onPress={props.moveToPreviousMonth.bind(this, props.month)}
          style={({ pressed }) => pressed && HeaderStyle.pressed}
        >
          <Icon name="arrow-left" size={24} color="black" />
        </Pressable>
        <View style={{ flexDirection: "row" }}>
          <Pressable onPress={setMonthModalVisible.bind(this, true)}>
            <Text>{props.month} </Text>
          </Pressable>
          <Pressable onPress={setYearModalVisible.bind(this, true)}>
            <Text>{props.year}</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={props.moveToNextMonth.bind(this, props.month)}
          style={({ pressed }) => pressed && HeaderStyle.pressed}
        >
          <Icon name="arrow-right" size={24} color="black" />
        </Pressable>
      </View>
      <SelectMonthModal
        year={props.year}
        modalVisible={monthModalVisible}
        setModalVisible={setMonthModalVisible}
        moveToSpecificYearAndMonth={props.moveToSpecificYearAndMonth}
      />
      <SelectYearModal
        month={props.month}
        year={props.year}
        modalVisible={yearModalVisible}
        setModalVisible={setYearModalVisible}
        moveToSpecificYearAndMonth={props.moveToSpecificYearAndMonth}
      />
    </>
  );
}


function Body(props) {

  const [totalDays, setTotalDays] = useState([]);
  const [totalDaysByState, setTotalDaysByState] = useState({});
  const [pressedDate, setPressedDate] = useState({
    state: "",
    year: 0,
    month: 0,
    date: 0,
  });
  const [week, setWeek] = useState(0);
  const [viewTotalDays, setViewTotalDays] = useState(true);
  const { year, month, date } = props;

  useEffect(() => {
    getTotalDays(year, month);
  }, [year, month, date]);

  useEffect(() => {
    totalDays.forEach((el, idx) => {
      if (el.includes(date)) {
        setWeek(idx);
      }
    });
  }, [totalDays]);

  const getTotalDays = (year, month) => {
    const previousMonthLastDate = new Date(year, month - 1, 0).getDate();
    const previousMonthLastDay = new Date(year, month - 1, 0).getDay();
    const currentMonthLastDate = new Date(year, month, 0).getDate();
    const currentMonthLastDay = new Date(year, month, 0).getDay();

    const previousDays = Array.from(
      { length: previousMonthLastDay + 1 },
      (v, i) => previousMonthLastDate - previousMonthLastDay + i
    );
    const currentDays = Array.from(
      { length: currentMonthLastDate },
      (v, i) => i + 1
    );
    const nextDays = Array.from(
      { length: 6 - currentMonthLastDay },
      (v, i) => i + 1
    );

    setTotalDays(
      divideArray([...previousDays, ...currentDays, ...nextDays], 7)
    );

    setTotalDaysByState({
      prev: {
        daysList: previousMonthLastDay !== 6 ? previousDays : [],
        year: month === 1 ? year - 1 : year,
        month: month === 1 ? 12 : month - 1,
      },
      curr: { daysList: currentDays, year: year, month: month },
      next: {
        daysList: nextDays,
        year: month === 12 ? year + 1 : year,
        month: month === 12 ? 1 : month + 1,
      },
    });
  };

  const handlePressDay = (pressedDate) => {
    setPressedDate(pressedDate);
    if (pressedDate.state === "prev" || pressedDate.state === "next") {
      props.moveToSpecificYearAndMonth(pressedDate.year, pressedDate.month);
    }
  };

  const onSwipeLeft = (gestureState) => {
    if (viewTotalDays === true) {
      props.moveToNextMonth(month);
    }
    if (viewTotalDays === false) {
      if (totalDays[week + 1] === undefined) {
        props.moveToNextMonth(month);
        setWeek(0);
      } else {
        setWeek(week + 1);
      }
    }
  };
  const onSwipeRight = (gestureState) => {
    if (viewTotalDays === true) {
      props.moveToPreviousMonth(month);
    }
    if (viewTotalDays === false) {
      if (totalDays[week - 1] === undefined) {
        props.moveToPreviousMonth(month);
        if (
          new Date(year, month - 1, 0).getDay() === 4 ||
          new Date(year, month - 1, 0).getDay() === 5
        ) {
          setWeek(5);
        } else {
          setWeek(4);
        }
      } else {
        setWeek(week - 1);
      }
    }
  };
  const onSwipeUp = () => {
    setViewTotalDays(false);
  };
  const onSwipeDown = () => {
    setViewTotalDays(true);
  };


return(
  <GestureRecognizer>
    <View style={BodyStyle.dayOfWeek}>
      {dayOfWeek.map((day, idx) => (
      <View style={BodyStyle.box} key={idx}>
        <Text style={changeColorByDay(day).dayOfWeek}>{day}</Text>
      </View>
    ))}
    </View>
    <View>
        {viewTotalDays ? (
          <View style={BodyStyle.totalDays}>
            {Object.keys(totalDaysByState).map((state) =>
              totalDaysByState[state].daysList.map((day) => {
                const checkPressedDate = {
                  state: state,
                  year: totalDaysByState[state].year,
                  month: totalDaysByState[state].month,
                  date: day,
                };
                return (
                  <View style={BodyStyle.box} >
                    <Pressable
                      onPress={handlePressDay.bind(this, checkPressedDate)}
                      style={({ pressed }) => {
                        return [
                          pressedDate.date === checkPressedDate.date &&
                          pressedDate.month === checkPressedDate.month &&
                          pressedDate.year === checkPressedDate.year
                            ? BodyStyle.pressedDate
                            : null,
                          pressed && BodyStyle.pressed,
                        ];
                      }}
                    >
                      <Text
                        style={[
                          [
                            isSameObj(
                              { state: "curr", ...props.today },
                              checkPressedDate
                            )
                              ? BodyStyle.today
                              : state === "prev" || state === "next"
                              ? BodyStyle.prev
                              : BodyStyle.curr,
                          ],
                        ]}
                      >
                        {day}
                      </Text>
                    </Pressable>
                  </View>
                );
              })
            )}
          </View>
        ) : (
          <View style={{ width: "100%", flexDirection: "row" }}>
            {totalDays[week]?.map((el, idx) => {
              const checkPressedDate = {
                year: year,
                month: month,
                date: el,
              };
              return (
                <View style={BodyStyle.box} key={idx}>
                  <Pressable
                    onPress={handlePressDay.bind(this, checkPressedDate)}
                    style={({ pressed }) => {
                      return [
                        pressedDate.date === checkPressedDate.date &&
                        pressedDate.month === checkPressedDate.month &&
                        pressedDate.year === checkPressedDate.year
                          ? BodyStyle.pressedDate
                          : null,
                        pressed && BodyStyle.pressed,
                      ];
                    }}
                  >
                    <Text
                      style={[
                        [
                          isSameObj({ ...props.today }, checkPressedDate)
                            ? BodyStyle.today
                            : BodyStyle.curr,
                        ],
                      ]}
                    >
                      {el}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </View>
  </GestureRecognizer>
)
}

function Calendar() {
  const DATE = new Date();
  const YEAR = DATE.getFullYear();
  const MONTH = DATE.getMonth() + 1;
  const DAY = DATE.getDate();
  const today = { year: YEAR, month: MONTH, date: DAY };

  const [month, setMonth] = useState(MONTH);
  const [year, setYear] = useState(YEAR);
  const [date, setDate] = useState(DAY);
  const moveToNextMonth = (month) => {
    if (month === 12) {
      setYear((previousYear) => previousYear + 1);
      setMonth(1);
    } else {
      setMonth((previousMonth) => previousMonth + 1);
    }
  };

  const moveToPreviousMonth = (month) => {
    if (month === 1) {
      setYear((previousYear) => previousYear - 1);
      setMonth(12);
    } else {
      setMonth((previousMonth) => previousMonth - 1);
    }
  };

  const moveToSpecificYearAndMonth = (year, month) => {
    setYear(year);
    setMonth(month);
  };

  return (
    <View style={CalanderStyle.calendarContainer}>
      <Header
        month={EnglishMonth(month)}
        year={year}
        moveToNextMonth={moveToNextMonth}
        moveToPreviousMonth={moveToPreviousMonth}
        moveToSpecificYearAndMonth={moveToSpecificYearAndMonth}
      />
      <Body            
        month={month}
        year={year}
        today={today}
        date={date}
        moveToNextMonth={moveToNextMonth}
        moveToPreviousMonth={moveToPreviousMonth}
        moveToSpecificYearAndMonth={moveToSpecificYearAndMonth}
       />
    </View>
  );
}
export default Calendar;

const CalanderStyle = StyleSheet.create({
  calendarContainer: {
    width: "100%",
    height : "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
});

const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HeaderStyle = StyleSheet.create({
  header: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.3,
  },
});


const BodyStyle = StyleSheet.create({
  dayOfWeek: {
    flexDirection: "row",
  },
  totalDays: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  box: {
    width: "14.2%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  prev: {
    color: "gray",
    fontSize: 24,
  },
  next: {
    color: "gray",
    fontSize: 24,
  },
  curr: {
    color: "black",
    fontSize: 24,
  },
  today: {
    color: "#2196f3",
    fontSize: 24,
  },
  pressedDate: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.3,
  },
});
const changeColorByDay = (day) =>
  StyleSheet.create({
    dayOfWeek: {
      color: day === "Sun" ? "red" : day === "Sat" ? "blue" : "gray",
      fontSize: 16,
    },
  });


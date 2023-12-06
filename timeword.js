function timeToWords(time) {
    const hours = parseInt(time.substring(0, 2));
    const minutes = parseInt(time.substring(3));
  
    const hourWords = [
      "midnight",
      "one", "two", "three", "four", "five", "six",
      "seven", "eight", "nine", "ten", "eleven", "noon"
    ];
  
    const minuteWords = [
      "oh", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
      "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
      "seventeen", "eighteen", "nineteen"
    ];
  
    const tensWords = ["", "", "twenty", "thirty", "forty", "fifty"];
  
    let period = "am";
    if (hours >= 12) {
      period = "pm";
    }
  
    if (hours > 12) {
      hours -= 12;
    }
  
    if (hours === 0 && minutes === 0) {
      return "midnight";
    }
  
    if (hours === 12 && minutes === 0) {
      return "noon";
    }
  
    let hourWord = hourWords[hours];
    let minuteWord = "";
  
    if (minutes === 0) {
      return `${hourWord} ${period}`;
    } else if (minutes < 20) {
      minuteWord = minuteWords[minutes];
    } else {
      const minuteTens = Math.floor(minutes / 10);
      const minuteOnes = minutes % 10;
      minuteWord = `${tensWords[minuteTens]} ${minuteWords[minuteOnes]}`;
    }
  
    return `${hourWord} ${minuteWord} ${period}`;
  }
  
  // Test Cases
  console.log(timeToWords("00:00")); // midnight
  console.log(timeToWords("00:12")); // twelve twelve am
  console.log(timeToWords("01:00")); // one o’clock am
  console.log(timeToWords("06:01")); // six oh one am
  console.log(timeToWords("06:10")); // six ten am
  console.log(timeToWords("06:18")); // six eighteen am
  console.log(timeToWords("06:30")); // six thirty am
  console.log(timeToWords("10:34")); // ten thirty four am
  console.log(timeToWords("12:00")); // noon
  console.log(timeToWords("12:09")); // twelve oh nine pm
  console.log(timeToWords("23:23")); // eleven twenty three pm
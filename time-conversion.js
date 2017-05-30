var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
]

function convertToStandardTime(textForm) {
  var date = textForm.substring(5, 7)
  if(date.length == 1) {
    date = "0" + date
  }

  var month = months.indexOf(textForm.substring(8, 11)).toString()
  if(month.length == 1) {
    month = "0" + month
  }

  var year = textForm.substring(12, 16)
  var time = textForm.substring(17, 25)

  var std = `${year}-${month}-${date}T${time}Z`

  return std
}


exports.convertToStandardTime = convertToStandardTime;

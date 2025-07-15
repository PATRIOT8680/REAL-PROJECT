export const sys = {

  biggestNum: (num1: number, num2: number): number => {
    if (num1 >= num2) {
      return num1
    } else { 
      return num2 
    }
  },

  digitFormat: (number: string | number): string => {
    return ('0' + number).slice(-sys.biggestNum(number.toString().length, 2))
  },

  getStringTimeInMinutes: (time: number): string => {
    let dateTime = new Date(time * 1000);
    return `${dateTime.getMinutes()}:${sys.digitFormat(dateTime.getSeconds())}`
  }
}
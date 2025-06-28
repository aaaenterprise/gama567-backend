const GameManagementServices = require('../../game_management/services/game_management_services')

class BettingHistoryUtils {


    async getCleanBettingData(bettingdataList) {
        const gameData = await GameManagementServices.getGameByName(bettingdataList[0].gameName)
        let res = []

        if (!gameData.hasSpecialTime) {
            console.log('no special schedule');
            // if close bid time is overed
            if (!this.isCurrentTimeBeforeTime(gameData.openingTime)) {
                return []
            }else{
                res = bettingdataList;
                return res;
            }
            // // checking if open bid is overed
            // if (!this.isCurrentTimeBeforeTime(gameData.openingTime)) {

            //     bettingdataList.forEach((betData) => {
            //         if (betData.betTime == 'Close') {
            //             res.push(betData)
            //         }
            //     });
            //     return res;
            // } else {
                // res = bettingdataList;
                // return res;
            // }
        } else {
            const todaygameSchedule = this.getScheduleForCurrentDay(gameData.specialSchedule)


            if (!todaygameSchedule.isOpen) {
                return []
            }
            else {

                // if close bid time is overed
                if (!this.isCurrentTimeBeforeTime(todaygameSchedule.openingTime)) {

                    return []
                }
                 else {
                    res = bettingdataList;
                    return res;
                }
            }
        }
    }
    getScheduleForCurrentDay(schedule) {
        // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const currentDayIndex = new Date().getDay();

        // Map day index to day names
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const currentDay = days[currentDayIndex];

        // Find the schedule data for the current day
        return schedule.find(item => item.dayOfWeek === currentDay) || null;
    }

    isCurrentTimeBeforeTime(time) {
        time = this.convert12hTo24h(time)
        // Get current time
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();

        // Parse given time
        const [givenHours, givenMinutes] = time.split(':').map(Number);

        // Compare current time with given time
        if (currentHours < givenHours) {
            return true;
        } else if (currentHours === givenHours && currentMinutes < givenMinutes) {
            return true;
        } else {
            return false;
        }
    }
    convert12hTo24h(time) {
        // Split time into hours, minutes, and period (AM/PM)
        const [timePart, period] = time.split(' ');
        const [hours, minutes] = timePart.split(':').map(Number);

        // Convert hours to 24-hour format
        let convertedHours = hours;
        if (period === 'PM' && hours < 12) {
            convertedHours += 12;
        } else if (period === 'AM' && hours === 12) {
            convertedHours = 0;
        }

        // Pad hours and minutes with leading zeros
        const formattedHours = String(convertedHours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');

        // Return time in 24-hour format
        return `${formattedHours}:${formattedMinutes}`;
    }


}

module.exports = new BettingHistoryUtils
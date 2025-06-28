class GameUtils {


   getTodayDate() {
    // Create a new Date object
    const today = new Date();

    // Get individual components of the date (year, month, day)
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months are zero-indexed, so add 1
    const day = today.getDate();

    // Format the date as a string
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

    return formattedDate;
}
    sortDataByOpeningTime(data) {
        return data.sort((a, b) => {
            const timeA = this.convertTo24HourFormat(a.openingTime);
            const timeB = this.convertTo24HourFormat(b.openingTime);
            return timeA.localeCompare(timeB);
        });
    }

    convertTo24HourFormat(timeString) {
        const [time, period] = timeString.split(' ');
        const [hours, minutes] = time.split(':').map(Number); // Use Number instead of String to convert to integers

        let convertedTime = ''; // Use let instead of var for better scoping and immutability

        if (period === 'AM' && hours === 12) {
            convertedTime = `00:${minutes.toString().padStart(2, '0')}`; // Pad minutes with leading zero if necessary
        } else if (period === 'PM' && hours !== 12) {
            convertedTime = `${hours + 12}:${minutes.toString().padStart(2, '0')}`; // Pad minutes with leading zero if necessary
        } else {
            convertedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`; // Pad hours and minutes with leading zero if necessary
        }

        return convertedTime;
    }
}

module.exports = new GameUtils;
import express from 'express';
import axios from 'axios';

const router = express.Router();


router.get('/', (req, res) => {
    res.render('index', { pageTitle: 'ChronoSphere - Historical Timeline' });
});


router.get('/timeline', async (req, res) => {
    const dateInput = req.query.date;
    let queryMonth, queryDay, queryYear;

    if (dateInput) {
        // Parse the date input
        const [year, month, day] = dateInput.split('-');
        queryYear = parseInt(year);
        queryMonth = parseInt(month);
        queryDay = parseInt(day);

        // Validate the date
        const inputDate = new Date(queryYear, queryMonth - 1, queryDay);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

        // Check if date is valid
        if (isNaN(inputDate.getTime())) {
            return res.render('results', {
                pageTitle: 'Invalid Date',
                error: 'Please enter a valid date.',
                events: [],
                births: [],
                deaths: [],
                queryMonth: queryMonth,
                queryDay: queryDay,
                queryYear: queryYear || new Date().getFullYear(),
                monthName: '',
                minYear: null,
                maxYear: null,
                totalCount: 0
            });
        }

        // Check if date is in the future
        if (inputDate > today) {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                               'July', 'August', 'September', 'October', 'November', 'December'];
            const monthName = monthNames[queryMonth - 1];
            
            return res.render('results', {
                pageTitle: 'Invalid Date',
                error: 'Cannot look into the future! Please select a date from the past.',
                events: [],
                births: [],
                deaths: [],
                queryMonth: queryMonth,
                queryDay: queryDay,
                queryYear: queryYear,
                monthName: monthName,
                minYear: null,
                maxYear: null,
                totalCount: 0
            });
        }
    } else {
        // Use today's date
        const today = new Date();
        queryMonth = today.getMonth() + 1; 
        queryDay = today.getDate();
        queryYear = today.getFullYear();
    }

    try {
        
        const response = await axios.get(`https://history.muffinlabs.com/date/${queryMonth}/${queryDay}`);
        
   
        const data = response.data.data;
        

        // Filter events, births, and deaths to only include years up to the selected year
        const allEvents = data.Events || [];
        const allBirths = data.Births || [];
        const allDeaths = data.Deaths || [];

        // Filter by selected year - only show events that happened UP TO that year
        const events = allEvents.filter(event => parseInt(event.year) <= queryYear);
        const births = allBirths.filter(birth => parseInt(birth.year) <= queryYear);
        const deaths = allDeaths.filter(death => parseInt(death.year) <= queryYear);

        // Calculate year ranges for display
        const allYears = [
            ...events.map(e => parseInt(e.year)),
            ...births.map(b => parseInt(b.year)),
            ...deaths.map(d => parseInt(d.year))
        ].filter(y => !isNaN(y));

        const minYear = allYears.length > 0 ? Math.min(...allYears) : null;
        const maxYear = allYears.length > 0 ? Math.max(...allYears) : null;
        const totalCount = events.length + births.length + deaths.length;

        // Month names for better display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = monthNames[queryMonth - 1];

        if (events.length > 0 || births.length > 0 || deaths.length > 0) {
            res.render('results', {
                pageTitle: `${monthName} ${queryDay} - Historical Timeline`,
                events: events,
                births: births,
                deaths: deaths,
                error: null,
                queryMonth: queryMonth,
                queryDay: queryDay,
                queryYear: queryYear,
                monthName: monthName,
                minYear: minYear,
                maxYear: maxYear,
                totalCount: totalCount
            });
        } else {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                               'July', 'August', 'September', 'October', 'November', 'December'];
            const monthName = monthNames[queryMonth - 1];
            
            res.render('results', {
                pageTitle: `${monthName} ${queryDay} - Historical Timeline`,
                error: 'No major events, births, or deaths found for this date. Try another one!',
                events: [],
                births: [],
                deaths: [],
                queryMonth: queryMonth,
                queryDay: queryDay,
                queryYear: queryYear,
                monthName: monthName,
                minYear: null,
                maxYear: null,
                totalCount: 0
            });
        }
    } catch (error) {
        console.error('Muffin Labs API request failed:', error.message);
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = queryMonth ? monthNames[queryMonth - 1] : '';
        
        res.render('results', {
            pageTitle: 'Timeline Error',
            error: 'Failed to fetch data from the API. Please try again later.',
            events: [],
            births: [],
            deaths: [],
            queryMonth: queryMonth || 0,
            queryDay: queryDay || 0,
            queryYear: queryYear || new Date().getFullYear(),
            monthName: monthName,
            minYear: null,
            maxYear: null,
            totalCount: 0
        });
    }
});

export default router;

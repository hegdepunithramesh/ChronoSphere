import express from 'express';
import axios from 'axios';

const router = express.Router();


router.get('/', (req, res) => {
    res.render('index', { pageTitle: 'ChronoSphere - Historical Timeline' });
});


router.get('/timeline', async (req, res) => {
    const dateInput = req.query.date;
    let queryMonth, queryDay;

    if (dateInput) {
        
        const [year, month, day] = dateInput.split('-');
        queryMonth = parseInt(month);
        queryDay = parseInt(day);
    } else {
        
        const today = new Date();
        queryMonth = today.getMonth() + 1; 
        queryDay = today.getDate();
    }

    try {
        
        const response = await axios.get(`https://history.muffinlabs.com/date/${queryMonth}/${queryDay}`);
        
   
        const data = response.data.data;
        

        const events = data.Events || [];
        const births = data.Births || [];
        const deaths = data.Deaths || [];

      
        if (events.length > 0 || births.length > 0 || deaths.length > 0) {
            res.render('results', {
                pageTitle: `Timeline for ${queryMonth}/${queryDay}`,
                events: events,
                births: births,
                deaths: deaths,
                error: null
            });
        } else {
           
            res.render('results', {
                pageTitle: `Timeline for ${queryMonth}/${queryDay}`,
                error: 'No major events, births, or deaths found for this date. Try another one!',
                events: [],
                births: [],
                deaths: []
            });
        }
    } catch (error) {
        console.error('Muffin Labs API request failed:', error.message);
        res.render('results', {
            pageTitle: 'Timeline',
            error: 'Failed to fetch data from the API. Please try again later.',
            events: [],
            births: [],
            deaths: []
        });
    }
});

export default router;

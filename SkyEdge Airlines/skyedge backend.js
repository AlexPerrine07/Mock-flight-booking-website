document.addEventListener('DOMContentLoaded', function() {
    const tripTypeSelect = document.getElementById('tripType');
    const returnDateGroup = document.getElementById('returnDateGroup');
    const searchForm = document.getElementById('flightSearchForm');

    // Store trip type in session storage
    if (tripTypeSelect) {
        tripTypeSelect.addEventListener('change', function() {
            sessionStorage.setItem('tripType', this.value);
            returnDateGroup.style.display = 
                this.value === 'roundtrip' ? 'block' : 'none';
        });
    }

    // Handle form submission
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Store selected class and destinations in sessionStorage
            const selectedClass = document.getElementById('flightClass').value;
            const fromCity = document.getElementById('from').value;
            const toCity = document.getElementById('to').value;
            const tripType = document.getElementById('tripType').value;
            
            sessionStorage.setItem('selectedClass', selectedClass);
            sessionStorage.setItem('fromCity', fromCity);
            sessionStorage.setItem('toCity', toCity);
            sessionStorage.setItem('tripType', tripType);
            
            window.location.href = 'departing-flights.html';
        });
    }
});

// Price multipliers for different classes
const priceMultipliers = {
    economy: 1,
    business: 2,
    first: 3
};

// When the flight selection pages load
document.addEventListener('DOMContentLoaded', function() {
    const selectedClass = sessionStorage.getItem('selectedClass') || 'economy';
    const fromCity = sessionStorage.getItem('fromCity') || 'City A';
    const toCity = sessionStorage.getItem('toCity') || 'City B';
    
    // Update destinations in all flight cards
    document.querySelectorAll('.flight-card').forEach(card => {
        // Update from/to cities
        const flightInfo = card.querySelector('.flight-info');
        const fromDiv = flightInfo.querySelector('.from-city');
        const toDiv = flightInfo.querySelector('.to-city');
        
        if (fromDiv) fromDiv.textContent = `From: ${fromCity}`;
        if (toDiv) toDiv.textContent = `To: ${toCity}`;
        
        // Update prices based on selected class
        const economyPrice = parseInt(card.querySelector('.price-options div:nth-child(1)').textContent.replace(/[^0-9]/g, ''));
        const businessPrice = parseInt(card.querySelector('.price-options div:nth-child(2)').textContent.replace(/[^0-9]/g, ''));
        const firstClassPrice = parseInt(card.querySelector('.price-options div:nth-child(3)').textContent.replace(/[^0-9]/g, ''));

        let finalPrice = economyPrice; // Default to economy price
        if (selectedClass === 'business') {
            finalPrice = businessPrice;
        } else if (selectedClass === 'first') {
            finalPrice = firstClassPrice;
        }

        card.querySelector('.flight-price').textContent = `$${finalPrice}`;
    });
});

// Function to update prices based on selected class
function updateFlightPrices() {
    const selectedClass = sessionStorage.getItem('selectedClass') || 'economy';
    document.querySelectorAll('.flight-card').forEach(card => {
        const economyPrice = parseInt(card.querySelector('.price-options div:nth-child(1)').textContent.replace(/[^0-9]/g, ''));
        const businessPrice = parseInt(card.querySelector('.price-options div:nth-child(2)').textContent.replace(/[^0-9]/g, ''));
        const firstClassPrice = parseInt(card.querySelector('.price-options div:nth-child(3)').textContent.replace(/[^0-9]/g, ''));

        let finalPrice = economyPrice; // Default to economy price
        if (selectedClass === 'business') {
            finalPrice = businessPrice;
        } else if (selectedClass === 'first') {
            finalPrice = firstClassPrice;
        }

        card.querySelector('.flight-price').textContent = `$${finalPrice}`;
    });
}

// When selecting a departing flight
function selectDepartingFlight(priceId, time, duration) {
    const priceElement = document.getElementById(priceId);
    const finalPrice = priceElement.textContent.replace('$', '');

    // Store departing flight details in sessionStorage
    sessionStorage.setItem('departingFlightPrice', `$${finalPrice}`);
    sessionStorage.setItem('departingFlightTime', time);
    sessionStorage.setItem('departingFlightDuration', duration);
    
    const tripType = sessionStorage.getItem('tripType');
    if (tripType === 'roundtrip') {
        window.location.href = 'return-flights.html';
    } else {
        window.location.href = 'checkout page.html';
    }
}

// When selecting a return flight
function selectReturnFlight(priceId, time, duration) {
    const priceElement = document.getElementById(priceId);
    const selectedClass = sessionStorage.getItem('selectedClass') || 'economy';
    const basePrice = parseInt(priceElement.textContent.replace('$', ''));
    const multiplier = priceMultipliers[selectedClass];
    const finalPrice = basePrice * multiplier;

    const departingPrice = sessionStorage.getItem('departingFlightPrice').replace('$', '');

    // Store return flight details in sessionStorage
    sessionStorage.setItem('returnFlightPrice', `$${finalPrice}`);
    sessionStorage.setItem('returnFlightTime', time);
    sessionStorage.setItem('returnFlightDuration', duration);
    
    // Calculate total price
    const totalPrice = (Number(departingPrice) + finalPrice).toString();
    sessionStorage.setItem('totalPrice', '$' + totalPrice);
    
    window.location.href = 'checkout page.html';
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Update the checkout form page load handler
window.onload = function() {
    if (window.location.pathname.includes('checkout')) {
        // Get flight details from sessionStorage
        const departingPrice = sessionStorage.getItem('departingFlightPrice') || '$0';
        const returnPrice = sessionStorage.getItem('returnFlightPrice') || '$0';
        const departingTime = sessionStorage.getItem('departingFlightTime') || '';
        const returnTime = sessionStorage.getItem('returnFlightTime') || '';
        const departingDuration = sessionStorage.getItem('departingFlightDuration') || '';
        const returnDuration = sessionStorage.getItem('returnFlightDuration') || '';
        const tripType = sessionStorage.getItem('tripType');
        const selectedClass = sessionStorage.getItem('selectedClass') || 'economy';

        // Update the checkout form
        document.getElementById('departing-price').textContent = departingPrice;
        document.getElementById('departing-time').textContent = departingTime;
        document.getElementById('departing-duration').textContent = departingDuration;
        document.getElementById('flight-class').textContent = capitalizeFirstLetter(selectedClass);
        
        // Handle return flight section visibility and flight count
        const returnFlightSection = document.getElementById('return-flight-section');
        const flightCount = document.getElementById('flight-count');
        
        if (tripType === 'roundtrip') {
            returnFlightSection.style.display = 'block';
            document.getElementById('return-price').textContent = returnPrice;
            document.getElementById('return-time').textContent = returnTime;
            document.getElementById('return-duration').textContent = returnDuration;
            flightCount.textContent = '2';
            
            // Calculate total price for round trip
            const totalPrice = (Number(departingPrice.replace('$', '')) + Number(returnPrice.replace('$', ''))).toString();
            document.getElementById('total-price').textContent = '$' + totalPrice;
        } else {
            returnFlightSection.style.display = 'none';
            flightCount.textContent = '1';
            // Set total price to departing price for one-way
            document.getElementById('total-price').textContent = departingPrice;
        }
    }
}

// Call updateFlightPrices on page load and when class changes
document.addEventListener('DOMContentLoaded', function() {
    updateFlightPrices();
    document.getElementById('flightClass').addEventListener('change', (event) => {
        sessionStorage.setItem('selectedClass', event.target.value);
        updateFlightPrices();
    });
}); 

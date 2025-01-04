document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const city = document.getElementById('city-input').value;

    try {
        const response = await fetch(`http://localhost:8080/api/weather/${city}`);
        if (!response.ok) {
            throw new Error(`City not found or an error occurred.`);
        }
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("City not found or an error occurred. Please try again.");
    }
});

function updateWeatherUI(data) {
    document.getElementById('city-name').textContent = data.city || "N/A";
    document.getElementById('temperature').textContent = `Temperature: ${data.temperature}°C` || "N/A";
    document.getElementById('description').textContent = `Description: ${data.description}` || "N/A";
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.windSpeed} m/s` || "N/A";

    const description = data.description.toLowerCase();
    const sunrise = data.sunrise; // Extracted from API response
    const sunset = data.sunset; // Extracted from API response

    triggerWeatherAnimation(description, sunrise, sunset);
}

function isDaytime(sunrise, sunset) {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in UNIX format
    return currentTime >= sunrise && currentTime <= sunset;
}

function triggerWeatherAnimation(description, sunrise, sunset) {
    console.log("Triggering animation for:", description);

    // Remove existing animation elements
    const existingAnimationContainer = document.getElementById('animation-container');
    if (existingAnimationContainer) {
        existingAnimationContainer.remove();
        console.log("Existing animation container removed.");
    }

    // Create a container for animations
    const animationContainer = document.createElement('div');
    animationContainer.id = 'animation-container';
    animationContainer.style.position = 'absolute';
    animationContainer.style.top = '0';
    animationContainer.style.left = '0';
    animationContainer.style.width = '100%';
    animationContainer.style.height = '100%';
    animationContainer.style.overflow = 'hidden';
    animationContainer.style.pointerEvents = 'none';
    animationContainer.style.zIndex = '10'; // Higher z-index for visibility
    document.body.appendChild(animationContainer);
    console.log("New animation container created:", animationContainer);

    // Determine if it's day or night
    const daytime = isDaytime(sunrise, sunset);

    // Change background based on weather description and time of day
    const body = document.body;
    if (description.includes('clear') || description.includes('sun')) {
        body.style.background = daytime
            ? 'linear-gradient(to bottom, #87CEEB, #FFD700)' // Day: Blue to gold
            : 'linear-gradient(to bottom, #2C3E50, #34495E)'; // Night: Dark blue to steel
    } else if (description.includes('rain') || description.includes('drizzle')) {
        body.style.background = daytime
            ? 'linear-gradient(to bottom, #4F4F4F, #8B8B8B)' // Day: Gray tones
            : 'linear-gradient(to bottom, #1C1C1C, #363636)'; // Night: Darker gray tones
    } else if (description.includes('snow')) {
        body.style.background = daytime
            ? 'linear-gradient(to bottom, #FFFFFF, #D3D3D3)' // Day: White tones
            : 'linear-gradient(to bottom, #E8E8E8, #A9A9A9)'; // Night: Dim white tones
    } else if (description.includes('cloud')) {
        body.style.background = daytime
            ? 'linear-gradient(to bottom, #B0C4DE, #778899)' // Day: Steel blue tones
            : 'linear-gradient(to bottom, #2C2C2C, #3E3E3E)'; // Night: Dark cloud tones
    } else {
        body.style.background = daytime
            ? 'linear-gradient(to bottom, #708090, #2F4F4F)' // Day: Slate tones
            : 'linear-gradient(to bottom, #1B1B1B, #141414)'; // Night: Dark tones
    }

    // Trigger animations based on description
    if (description.includes('clear') || description.includes('sun')) {
        console.log("Sunny animation triggered");
        createSunnyAnimation(animationContainer);
    }
    if (description.includes('rain') || description.includes('drizzle')) {
        console.log("Rainy animation triggered");
        createRainyAnimation(animationContainer);
    }
    if (description.includes('snow')) {
        console.log("Snowy animation triggered");
        createSnowyAnimation(animationContainer);
    }
    if (description.includes('cloud')) {
        console.log("Cloudy animation triggered");
        createCloudyAnimation(animationContainer);
    }
}


// Rainy Animation
function createRainyAnimation(container) {
    const dropCount = 50; // Adjust for performance
    const drops = [];

    for (let i = 0; i < dropCount; i++) {
        const raindrop = document.createElement('div');
        raindrop.style.position = 'absolute';
        raindrop.style.width = `${Math.random() * 2 + 1}px`; // Random width (1px to 3px)
        raindrop.style.height = `${Math.random() * 10 + 10}px`; // Random height (10px to 20px)
        raindrop.style.backgroundColor = 'rgba(135, 206, 250, 0.7)'; // Light blue with transparency
        raindrop.style.borderRadius = '2px'; // Rounded edges
        raindrop.style.opacity = '0.8';
        raindrop.style.transform = `translate(${Math.random() * window.innerWidth}px, -${Math.random() * window.innerHeight}px)`;
        raindrop.style.willChange = 'transform';
        raindrop.style.zIndex = '11';
        container.appendChild(raindrop);

        drops.push(raindrop);

        // Animate each raindrop
        gsap.to(raindrop, {
            y: window.innerHeight + 20, // Fall past the bottom of the screen
            duration: Math.random() * 0.5 + 1.5, // Random duration
            repeat: -1, // Infinite loop
            ease: 'linear',
            delay: Math.random() * 1, // Staggered start times
            onRepeat: () => {
                raindrop.style.transform = `translate(${Math.random() * window.innerWidth}px, -${Math.random() * window.innerHeight}px)`;
            },
        });
    }

    console.log(`${dropCount} raindrops created and animated.`);
}


// Sunny Animation
function createSunnyAnimation(container) {
    // Create the sun
    const sun = document.createElement('div');
    sun.style.position = 'absolute';
    sun.style.width = '120px';
    sun.style.height = '120px';
    sun.style.borderRadius = '50%';
    sun.style.backgroundColor = 'yellow';
    sun.style.boxShadow = '0 0 40px 15px rgba(255, 223, 0, 0.7)';
    sun.style.bottom = '-150px'; // Start below the page
    sun.style.left = 'calc(50% - 5px)'; // Center horizontally with offset fix
    sun.style.transform = 'translateX(-50%)';
    sun.style.zIndex = '2';
    container.appendChild(sun);

    // Animate the sun rising higher
    gsap.to(sun, {
        duration: 5,
        bottom: '120px', // Final position higher than before
        ease: 'power2.out',
    });

    // Create sun rays
    const rayCount = 12; // Balanced ray count
    for (let i = 0; i < rayCount; i++) {
        const ray = document.createElement('div');
        ray.style.position = 'absolute';
        ray.style.width = '8px';
        ray.style.height = '60px';
        ray.style.backgroundColor = 'rgba(255, 223, 0, 0.6)';
        ray.style.borderRadius = '5px';
        ray.style.transformOrigin = '60px 60px'; // Centered alignment
        ray.style.transform = `rotate(${i * (360 / rayCount)}deg) translateY(-70px)`;
        ray.style.opacity = '0.7';
        sun.appendChild(ray);

        // Animate the rays to pulse gently
        gsap.to(ray, {
            duration: 2,
            scaleY: 1.15,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 0.5,
        });
    }

    console.log("Sun animation updated with higher rise.");
}


// Snowy Animation
function createSnowyAnimation(container) {
    const snowflakeCount = 50; // Number of snowflakes
    const snowflakes = [];

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.textContent = '❄'; // Unicode snowflake
        snowflake.style.position = 'absolute';
        snowflake.style.fontSize = `${Math.random() * 10 + 10}px`; // Random size (10px to 20px)
        snowflake.style.color = 'white'; // Snowflake color
        snowflake.style.opacity = `${Math.random() * 0.5 + 0.5}`; // Random opacity (0.5 to 1)

        // Start at random positions above the screen
        const startY = Math.random() * -window.innerHeight; // Random vertical start
        const startX = Math.random() * window.innerWidth; // Random horizontal start
        snowflake.style.transform = `translateY(${startY}px) translateX(${startX}px)`;
        snowflake.style.willChange = 'transform'; // Optimize animation performance
        container.appendChild(snowflake);

        snowflakes.push(snowflake);

        // Animate each snowflake
        gsap.to(snowflake, {
            y: window.innerHeight, // Fall past the bottom of the screen
            x: `+=${Math.random() * 50 - 25}px`, // Drift sideways
            duration: Math.random() * 5 + 3, // Random duration (3s to 8s)
            repeat: -1, // Infinite loop
            ease: 'linear',
            delay: i * 0.05, // Staggered very slightly to avoid gaps
            onRepeat: () => {
                // Reset position above the screen
                const resetY = Math.random() * -50; // Slightly above the top
                const resetX = Math.random() * window.innerWidth;
                snowflake.style.transform = `translateY(${resetY}px) translateX(${resetX}px)`;
            },
        });
    }

    console.log(`${snowflakeCount} snowflakes created and animated.`);
}



// Cloudy Animation
function createCloudyAnimation(container) {
    const initialCloudCount = 5; // Start with fewer clouds
    const maxCloudCount = 15; // Maximum number of clouds over time
    let currentCloudCount = 0; // Track how many clouds have been created

    // Function to create a single cloud
    function createCloud() {
        if (currentCloudCount >= maxCloudCount) return; // Stop adding clouds once the maximum is reached

        const cloudWrapper = document.createElement('div');
        cloudWrapper.style.position = 'absolute';
        cloudWrapper.style.opacity = '0'; // Initially invisible
        cloudWrapper.style.top = `${Math.random() * window.innerHeight * 0.6}px`; // Random vertical position (top 60% of the screen)
        cloudWrapper.style.left = `${Math.random() * window.innerWidth}px`; // Random horizontal position
        container.appendChild(cloudWrapper);

        // Create individual "blobs" for the cloud
        for (let j = 0; j < 5; j++) { // Larger clouds with multiple blobs
            const cloudBlob = document.createElement('div');
            cloudBlob.style.position = 'absolute';
            cloudBlob.style.width = `${Math.random() * 150 + 100}px`; // Bigger blobs (100px to 250px)
            cloudBlob.style.height = `${Math.random() * 100 + 80}px`; // Bigger height (80px to 180px)
            cloudBlob.style.background = 'radial-gradient(circle, rgba(211, 211, 211, 0.9) 50%, rgba(169, 169, 169, 0.7) 100%)';
            cloudBlob.style.borderRadius = '50%'; // Rounded edges for fluffiness
            cloudBlob.style.top = `${Math.random() * 40}px`; // Slight vertical offsets
            cloudBlob.style.left = `${Math.random() * 60}px`; // Slight horizontal offsets
            cloudWrapper.appendChild(cloudBlob);
        }

        currentCloudCount++; // Increment cloud count

        // Randomize cloud movement direction
        const moveDirection = Math.random() > 0.5 ? 1 : -1; // 1 for right, -1 for left

        // Animate the cloud: Fade in and move simultaneously
        gsap.to(cloudWrapper, {
            opacity: 1, // Fade in the cloud
            x: moveDirection * (window.innerWidth + 500), // Move left or right
            y: `+=${Math.random() * 150 - 75}px`, // Slight vertical drift
            duration: Math.random() * 25 + 15, // Random duration (15s to 40s)
            repeat: -1, // Infinite loop
            ease: 'linear',
            onStart: () => {
                cloudWrapper.style.opacity = '1'; // Make visible
            },
            onRepeat: () => {
                // Reset cloud position
                cloudWrapper.style.left = `${Math.random() * window.innerWidth}px`;
                cloudWrapper.style.top = `${Math.random() * window.innerHeight * 0.6}px`;
            },
        });
    }

    // Add initial clouds
    for (let i = 0; i < initialCloudCount; i++) {
        createCloud();
    }

    // Continuously add clouds over time
    const cloudInterval = setInterval(() => {
        if (currentCloudCount < maxCloudCount) {
            createCloud();
        } else {
            clearInterval(cloudInterval); // Stop adding clouds when maxCloudCount is reached
        }
    }, 1000); // Add a new cloud every second
}
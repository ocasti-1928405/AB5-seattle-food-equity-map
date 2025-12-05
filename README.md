# Seattle Food Equity Map

## Project Overview

The Seattle Food Equity Map is an interactive web application that reimagines how we understand food access in urban environments. Unlike traditional food desert mapping that focuses solely on proximity to supermarkets, our project introduces a critical dimension: economic accessibility. By classifying grocery stores into three price tiers—Budget ($), Mid-Range ($$), and Premium ($$$)—we reveal the hidden disparities that exist even in neighborhoods with ample physical store access.

This project was developed by Group AB5 (Oscar Castillo, Chae Won Yoo, Nolawi Woldemariam, and Paul Gia-Huy Lam) for GEOG 328 at the University of Washington.

## Live Demo

Visit the interactive map: (https://ocasti-1928405.github.io/AB5-seattle-food-equity-map/)
## The Problem We're Addressing

The USDA's Food Access Research Atlas has been the gold standard for identifying food deserts in America. It defines "low access" areas using distance metrics: communities where significant portions of the population live more than 1 mile (urban) or 10 miles (rural) from the nearest supermarket. While this framework has helped direct resources to underserved areas, it operates on a flawed assumption: that all supermarkets provide equal access to affordable food.

Consider a low-income neighborhood with three supermarkets within walking distance—but all three are premium chains with prices 30-50% higher than budget alternatives. Traditional metrics would classify this area as "food secure," yet residents may still struggle to afford nutritious food. This is the gap our project addresses.

## Our Approach

### Data Collection & Processing

We compiled data from multiple authoritative sources:

- **USDA Food Access Research Atlas (2019)**: Provides Low Income/Low Access (LILA) classifications for census tracts, combining demographic data from the American Community Survey with verified supermarket locations
- **Seattle Active Business License Database**: Filtered by NAICS codes 445110 (Supermarkets) and 445120 (Convenience Stores) to create a comprehensive inventory of food retailers
- **US Census TIGER/Line Shapefiles (2010)**: Geographic boundaries that match the USDA's underlying methodology
- **Seattle Neighborhood Boundaries**: Provides intuitive geographic labels
- **Seattle Emergency Food Providers**: Locations of food banks and meal programs that serve as safety nets

### Manual Price Classification

The cornerstone of our methodology is the manual classification of each grocery store into price tiers. We categorized stores based on:

- Market positioning and brand recognition
- Typical product prices relative to Consumer Price Index data
- Availability of budget-friendly options versus premium specialty items
- Store format (discount warehouse, traditional supermarket, upscale grocer)

**Budget Tier ($)**: Includes discount chains like WinCo Foods, ethnic grocery stores, and value-focused retailers that prioritize low prices over premium selections.

**Mid-Range Tier ($$)**: Regional chains like Safeway, Fred Meyer, and QFC that balance store brands with national brands and offer loyalty programs.

**Premium Tier ($$$)**: Specialty grocers like Whole Foods, PCC Community Markets, and Metropolitan Market that emphasize organic, specialty, and prepared foods at higher price points.

## Key Features

### Interactive Filtering
Users can toggle price tiers on and off to see where budget, mid-range, or premium stores are concentrated. This reveals patterns that standard food desert maps miss entirely.

### Location-Based Distance Sorting
The map includes geolocation functionality that calculates distances from the user's current position to all grocery stores, sorting results from nearest to farthest. This feature is particularly valuable for transit-dependent residents who need to identify the closest affordable options.

### Multiple Data Layers
- **Grocery Stores**: Color-coded by price tier
- **Emergency Food Services**: Mapped as stars to show where safety-net services concentrate
- **Neighborhood Boundaries**: Provide geographic context
- **User Location Marker**: Shows your position when geolocation is enabled

### Responsive Design
The application works seamlessly on desktop, tablet, and mobile devices, ensuring accessibility for users across different platforms.

## Technical Implementation

### Technologies Used
- **Mapbox GL JS**: Modern, GPU-accelerated web mapping library that provides smooth interactions and beautiful styling
- **HTML5/CSS3**: Semantic markup and responsive design using CSS Grid and Flexbox
- **Vanilla JavaScript**: No framework dependencies, ensuring fast load times and maintainability
- **GeoJSON**: Standard format for all spatial data layers

### File Structure
```
/
├── index.html                 # Welcome page
├── css/
│   ├── main.css              # Global styles
│   └── map.css               # Map-specific styles
├── js/
│   ├── navigation.js         # Mobile menu functionality
│   └── map.js                # Map initialization and interactions
├── pages/
│   ├── map.html              # Interactive map page
│   ├── about.html            # Project information
│   └── education.html        # Food equity education
└── assets/
    ├── stores.geojson        # Grocery store data with price tiers
    ├── emergency_food.geojson # Food banks and meal programs
    ├── seattle_hoods.geojson  # Neighborhood boundaries
    └── favicon.png           # Site icon
```

## Findings & Insights

Our analysis reveals several important patterns:

1. **Economic Food Deserts**: Some neighborhoods have physical access to stores but lack affordable options relative to local income levels
2. **Safety Net Dependency**: Areas with higher ratios of premium to budget stores often show greater density of emergency food providers
3. **Cultural Food Access**: Budget stores frequently include ethnic grocers that provide culturally relevant foods—an aspect entirely missing from standard metrics
4. **Transit Barriers**: Distance matters more for residents without cars; our distance calculation helps quantify this challenge

## Future Enhancements

While we're proud of what we've accomplished, we recognize opportunities for improvement:

- Integration of real-time pricing data from store APIs
- Transit network analysis to calculate travel time, not just distance
- Temporal analysis showing how food access has changed over time
- Store quality metrics (hours, product variety, customer service)
- Community input features allowing residents to rate and review stores

## How to Use This Project

1. Visit the interactive map
2. Use the filter controls to show/hide price tiers
3. Enable location services to find stores nearest to you
4. Click on store markers to see details and pricing information
5. Explore the education page to learn more about food equity issues

## Acknowledgments

This project builds upon the foundational work of the USDA's Food Access Research Atlas while extending it with economic accessibility considerations. We acknowledge Seattle's emergency food providers whose tireless work addresses gaps in market-based food access.

## License

This project was created for educational purposes as part of GEOG 328 at the University of Washington.

## Contact

For questions or feedback about this project, please contact the team members through the University of Washington Geography Department.

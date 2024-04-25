/**
 * First name: Elliot
 * Last name: Simmons
 * Student ID: 801192813
*/

//Calculate the # of towers. Returns an array
function calcAvgNumTowersByCounty(data) {
    let AvgNumTowersByCounty = {};

    data.forEach(tower => {
        let { county, license } = tower;
        if (!AvgNumTowersByCounty[county]) {
            AvgNumTowersByCounty[county] = {
                'AT&T': 0,
                'Verizon': 0
            };
        }
        AvgNumTowersByCounty[county][license]++;
    });

        data.forEach(tower => {
                const {county} = tower;
                if (AvgNumTowersByCounty.hasOwnProperty(county)) {
                    tower.avgNum = AvgNumTowersByCounty[county];
                } else {
                    //console.warn(`Tower num for ${county} not found`);
                    tower.avgNum = 0;
                }
            });

        return AvgNumTowersByCounty;
    }

    //color interpolater.
    function colors(data) {
        let colorInterpolator = d3.interpolateHslLong("green", "orange");
        let colorScale = d3.scaleSequential()
        .domain([0, 50]) // Creating an array with the same length as data and filling it with 50
        .interpolator(colorInterpolator);
        return colorScale;
    }

class Map {
    /**
     * @param {Array} _data 
     * @param {Object} _us 
     * @param {string} _license
     */
    constructor(_us, _data, _license) {
        this.us = _us;
        this.data = _data;
        this.license = _license;

        let avgTowers = calcAvgNumTowersByCounty(this.data);
        this.initVis(avgTowers, this.license);
    }
    
        renderVis(avgTowers, license){
            d3.json('data/us_counties.json').then((county) =>  {

                let width = 1000;
                let height = 800;

                let svg = d3.select('#avgNumTowersByCounty')
                    .append('svg')
                    .attr('id', 'towersByLicense')
                    .style("width", width)
                    .style("height", height);
            
                let geoGenerator = d3.geoPath();
    
                let colorScale = colors(this.data);
               
                svg.append('g').selectAll('path')
                    .data(topojson.feature(county, county.objects.counties).features)
                    .join('path')
                    .attr('d', geoGenerator)
                    .attr('stroke', '#FFFFFF');
                
                svg.append('g')
                    .selectAll('.county') //Getting counties
                    //fill
                    .data(topojson.feature(county, county.objects.counties).features)
                    .enter().append('path')
                    .attr('class', 'county')
                    .attr('d', geoGenerator)
                    .style('fill', data => {
                        let county = data.properties.name.toUpperCase();
    
                        let towerData = avgTowers[county];
                        if (towerData) {
                            let towerCount = towerData[license]; // Access tower count based on selected license
                            if (typeof towerCount !== 'undefined') {
                                return colorScale(towerCount);
                            } else {
                                //console.warn(`Tower count not found for county: ${county}`);
                                return colorScale(0);
                            }
                        } else {
                            //console.warn(`Data not found for county: ${county}`);
                            return colorScale(0);
                        }
                    })
                    .on('click', function(event, d) {
                        let county = d.properties.name.toUpperCase();
                        let selectedTower = avgTowers[county];
            
                        if (selectedTower) {
                            let towerCount = selectedTower[license]; // Access tower count based on selected license
                            if (towerCount) {
                                alert(`Number of ${license} cell towers in ${county}: ${towerCount}`);
                            } else {
                                alert(`Number of ${license} cell towers in ${county} not specified`);
                            }
                        } else {
                            alert(`Data not found for ${county}`);
                        }
                    });
                });
    }

    updateVis(license) {
        let avgTowers = calcAvgNumTowersByCounty(this.data);

        let svg = d3.select('#towersByLicense');

        let colorScale = colors(data);

        svg.selectAll('.county')
            .style('fill', d => {
                let countyName = d.properties.name.toUpperCase();
                let towerData = avgTowers[countyName];
                if (towerData) {
                    let towerCount = towerData[license];
                    if (typeof towerCount !== 'undefined') {
                        return colorScale(towerCount);
                    } else {
                        //console.warn(`Tower count not found for county: ${countyName}`);
                        return colorScale(0);
                    }
                } else {
                    //console.warn(`Data not found for county: ${countyName}`);
                    return colorScale(0);
                }
            })
            .on('click', function(event, d) {
                let county = d.properties.name.toUpperCase();
                let selectedTower = avgTowers[county];
    
                if (selectedTower) {
                    let towerCount = selectedTower[license]; // Access tower count based on selected license
                    if (towerCount) {
                        alert(`Number of ${license} cell towers in ${county}: ${towerCount}`);
                    } else {
                        alert(`Number of ${license} cell towers in ${county} not specified`);
                    }
                } else {
                    alert(`Data not found for ${county}`);
                }
            });
    }

    initVis(avgTowers, license) {
                this.renderVis(avgTowers, license);
        }
}

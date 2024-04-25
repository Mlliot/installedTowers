/**
 * First name: Elliot
 * Last name: SImmons
 * Student ID: 801192813
*/

let data, avgNumTowersByCounty, us;
let selectedLicense = 'Verizon';

d3.json('data/us_counties.json').then(us => {
    d3.csv('data/celltowers.csv').then(data => {

        countyMap = new Map(us, data, selectedLicense);

        let checkbox = document.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function () {
        selectedLicense = this.checked ? 'AT&T' : 'Verizon';
        countyMap.updateVis(selectedLicense);
    });

    }).catch(error => console.error(error));
}).catch(error => console.error(error));
